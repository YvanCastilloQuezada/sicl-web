import { createHash, randomBytes, randomInt } from "crypto";
import QRCode from "qrcode";
import { and, asc, eq, gt } from "drizzle-orm";
import {
  controllerCommands,
  controllerRoleAssignments,
  controllerSessions,
  controllerSharedProfiles,
  users,
} from "../drizzle/schema";
import {
  canCreateControllerSession,
  canSendControllerCommand,
  type ControllerCommandType,
  type ControllerMode,
  type ControllerRole,
} from "../shared/controllerLab";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";

const TOKEN_BYTES = 24;
const SESSION_MAX_SECONDS = 1_800;
const SESSION_MIN_SECONDS = 60;
const MANUAL_LINK_CODE_LENGTH = 8;

type CommandPayload = Record<string, string>;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sessionPublicId() {
  return `CTRL-${randomBytes(10).toString("hex").toUpperCase()}`;
}

function commandPublicId() {
  return `CMD-${randomBytes(10).toString("hex").toUpperCase()}`;
}

function sharedProfileCode() {
  return `ML${randomBytes(4).toString("hex").toUpperCase()}`;
}

function manualLinkCode() {
  return Array.from({ length: MANUAL_LINK_CODE_LENGTH }, () =>
    randomInt(0, 10)
  ).join("");
}

function now() {
  return new Date();
}

function isExpired(session: { expiresAt: Date }, at = now()) {
  return session.expiresAt.getTime() <= at.getTime();
}

export async function getControllerRole(
  userId: number,
  baseRole?: string
): Promise<ControllerRole> {
  if (baseRole === "admin") return "OPERATOR";
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const account = (
    await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)
  )[0];
  if (account?.role === "admin") return "OPERATOR";
  const assignment = (
    await db
      .select()
      .from(controllerRoleAssignments)
      .where(eq(controllerRoleAssignments.userId, userId))
      .limit(1)
  )[0];
  return assignment?.controllerRole ?? "USER";
}

export async function assignControllerRole(input: {
  targetUserId: number;
  controllerRole: ControllerRole;
  assignedByUserId: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const current = (
    await db
      .select()
      .from(controllerRoleAssignments)
      .where(eq(controllerRoleAssignments.userId, input.targetUserId))
      .limit(1)
  )[0];
  if (current)
    await db
      .update(controllerRoleAssignments)
      .set({
        controllerRole: input.controllerRole,
        assignedByUserId: input.assignedByUserId,
      })
      .where(eq(controllerRoleAssignments.id, current.id));
  else
    await db.insert(controllerRoleAssignments).values({
      userId: input.targetUserId,
      controllerRole: input.controllerRole,
      assignedByUserId: input.assignedByUserId,
    });
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_ROLE_ASSIGNED",
      aggregateType: "CONTROLLER_ROLE",
      aggregateId: String(input.targetUserId),
      actorUserId: input.assignedByUserId,
      source: "controller_lab",
      payload: { controllerRole: input.controllerRole, coreAccess: "NONE" },
      idempotencyKey: `controller-role:${input.targetUserId}:${input.controllerRole}:${Date.now()}`,
    },
    db
  );
  return {
    assigned: true,
    targetUserId: input.targetUserId,
    controllerRole: input.controllerRole,
    coreAccess: "NONE" as const,
  };
}

export async function createControllerSession(input: {
  userId: number;
  baseRole?: string;
  origin: string;
  expiresInSeconds: number;
}) {
  const role = await getControllerRole(input.userId, input.baseRole);
  if (!canCreateControllerSession(role))
    throw new Error(
      "Solo los perfiles PRESENTADOR u OPERADOR pueden crear sesiones de control."
    );
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const publicId = sessionPublicId();
  const mobileToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const screenToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const manualCode = manualLinkCode();
  const expiresAt = new Date(
    Date.now() +
      Math.min(
        SESSION_MAX_SECONDS,
        Math.max(SESSION_MIN_SECONDS, input.expiresInSeconds)
      ) *
        1_000
  );
  await db.insert(controllerSessions).values({
    publicId,
    createdByUserId: input.userId,
    mobileTokenHash: hashToken(mobileToken),
    screenTokenHash: hashToken(screenToken),
    manualLinkCodeHash: hashToken(manualCode),
    status: "PENDING",
    expiresAt,
  });
  const mobileUrl = `${input.origin}/touch-remote?controllerSession=${encodeURIComponent(publicId)}&controllerToken=${encodeURIComponent(mobileToken)}`;
  const screenUrl = `${input.origin}/tv?mode=live&controllerSession=${encodeURIComponent(publicId)}&controllerScreen=${encodeURIComponent(screenToken)}`;
  const qrDataUrl = await QRCode.toDataURL(mobileUrl, {
    width: 360,
    margin: 2,
    errorCorrectionLevel: "M",
  });
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_SESSION_CREATED",
      aggregateType: "CONTROLLER_SESSION",
      aggregateId: publicId,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: {
        role,
        expiresAt: expiresAt.toISOString(),
        manualLinkAvailable: true,
        coreAccess: "NONE",
        commandScope: "PRESENTATION_ONLY",
      },
      idempotencyKey: `controller-session-create:${publicId}`,
    },
    db
  );
  return {
    publicId,
    role,
    expiresAt: expiresAt.toISOString(),
    mobileToken,
    manualCode,
    mobileUrl,
    screenUrl,
    qrDataUrl,
    status: "PENDING" as const,
    coreAccess: "NONE" as const,
  };
}

async function loadSession(publicId: string) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const session = (
    await db
      .select()
      .from(controllerSessions)
      .where(eq(controllerSessions.publicId, publicId))
      .limit(1)
  )[0];
  if (!session) throw new Error("La sesión de control no existe.");
  if (session.status !== "CLOSED" && isExpired(session)) {
    await db
      .update(controllerSessions)
      .set({ status: "EXPIRED", lastSeenAt: now() })
      .where(eq(controllerSessions.id, session.id));
    return { db, session: { ...session, status: "EXPIRED" as const } };
  }
  return { db, session };
}

export async function connectControllerSession(input: {
  userId: number;
  baseRole?: string;
  publicId: string;
  mobileToken: string;
}) {
  const { db, session } = await loadSession(input.publicId);
  if (session.status === "EXPIRED" || session.status === "CLOSED")
    throw new Error("La sesión de control está vencida o cerrada.");
  if (hashToken(input.mobileToken) !== session.mobileTokenHash)
    throw new Error("El código de conexión no coincide con la sesión.");
  if (session.connectedUserId && session.connectedUserId !== input.userId)
    throw new Error("La sesión ya está vinculada a otro usuario.");
  const role = await getControllerRole(input.userId, input.baseRole);
  await db
    .update(controllerSessions)
    .set({
      status: "CONNECTED",
      connectedUserId: input.userId,
      lastSeenAt: now(),
    })
    .where(eq(controllerSessions.id, session.id));
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_SESSION_CONNECTED",
      aggregateType: "CONTROLLER_SESSION",
      aggregateId: session.publicId,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: { role, coreAccess: "NONE" },
      idempotencyKey: `controller-session-connect:${session.publicId}:${input.userId}`,
    },
    db
  );
  return {
    publicId: session.publicId,
    status: "CONNECTED" as const,
    role,
    expiresAt: session.expiresAt.toISOString(),
    coreAccess: "NONE" as const,
  };
}

export async function connectControllerSessionWithManualCode(input: {
  userId: number;
  baseRole?: string;
  manualCode: string;
}) {
  const normalizedCode = input.manualCode.replace(/\D/g, "");
  if (!new RegExp(`^\\d{${MANUAL_LINK_CODE_LENGTH}}$`).test(normalizedCode))
    throw new Error("Ingresa el código numérico temporal de 8 dígitos.");
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const session = (
    await db
      .select()
      .from(controllerSessions)
      .where(
        eq(controllerSessions.manualLinkCodeHash, hashToken(normalizedCode))
      )
      .limit(1)
  )[0];
  if (!session || !session.manualLinkCodeHash)
    throw new Error("El código manual no existe o venció.");
  if (
    session.status === "EXPIRED" ||
    session.status === "CLOSED" ||
    isExpired(session)
  )
    throw new Error("El código manual venció. Solicita un QR o código nuevo.");
  if (session.connectedUserId && session.connectedUserId !== input.userId)
    throw new Error("La sesión ya está vinculada a otro usuario.");
  const role = await getControllerRole(input.userId, input.baseRole);
  const mobileToken = randomBytes(TOKEN_BYTES).toString("base64url");
  await db
    .update(controllerSessions)
    .set({
      mobileTokenHash: hashToken(mobileToken),
      status: "CONNECTED",
      connectedUserId: input.userId,
      lastSeenAt: now(),
    })
    .where(eq(controllerSessions.id, session.id));
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_SESSION_MANUAL_CODE_CONNECTED",
      aggregateType: "CONTROLLER_SESSION",
      aggregateId: session.publicId,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: { role, manualCode: "REDACTED", coreAccess: "NONE" },
      idempotencyKey: `controller-session-manual-connect:${session.publicId}:${input.userId}`,
    },
    db
  );
  return {
    publicId: session.publicId,
    mobileToken,
    status: "CONNECTED" as const,
    role,
    expiresAt: session.expiresAt.toISOString(),
    coreAccess: "NONE" as const,
  };
}

export async function sendControllerCommand(input: {
  userId: number;
  baseRole?: string;
  publicId: string;
  mobileToken: string;
  requestId: string;
  mode: ControllerMode;
  commandType: ControllerCommandType;
  payload: CommandPayload;
}) {
  const { db, session } = await loadSession(input.publicId);
  if (
    session.status !== "CONNECTED" ||
    session.connectedUserId !== input.userId
  )
    throw new Error("Conecta el celular antes de enviar comandos.");
  if (hashToken(input.mobileToken) !== session.mobileTokenHash)
    throw new Error("El código de conexión no coincide con la sesión.");
  const role = await getControllerRole(input.userId, input.baseRole);
  if (!canSendControllerCommand(role, input.commandType))
    throw new Error("Tu rol no puede enviar este comando de presentación.");
  const duplicate = (
    await db
      .select()
      .from(controllerCommands)
      .where(
        and(
          eq(controllerCommands.sessionId, session.id),
          eq(controllerCommands.requestId, input.requestId)
        )
      )
      .limit(1)
  )[0];
  if (duplicate)
    return {
      publicId: duplicate.publicId,
      commandId: duplicate.id,
      accepted: true,
      duplicate: true,
      coreAccess: "NONE" as const,
    };
  const publicId = commandPublicId();
  await db.insert(controllerCommands).values({
    publicId,
    sessionId: session.id,
    actorUserId: input.userId,
    mode: input.mode,
    commandType: input.commandType,
    payloadJson: JSON.stringify(input.payload),
    requestId: input.requestId,
  });
  const stored = (
    await db
      .select({ id: controllerCommands.id })
      .from(controllerCommands)
      .where(eq(controllerCommands.publicId, publicId))
      .limit(1)
  )[0];
  await db
    .update(controllerSessions)
    .set({ lastSeenAt: now() })
    .where(eq(controllerSessions.id, session.id));
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_COMMAND_SENT",
      aggregateType: "CONTROLLER_SESSION",
      aggregateId: session.publicId,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: {
        publicId,
        role,
        mode: input.mode,
        commandType: input.commandType,
        coreAccess: "NONE",
      },
      idempotencyKey: `controller-command:${session.publicId}:${input.requestId}`,
    },
    db
  );
  return {
    publicId,
    commandId: stored?.id ?? 0,
    accepted: true,
    duplicate: false,
    coreAccess: "NONE" as const,
  };
}

export async function getControllerScreenSnapshot(input: {
  publicId: string;
  screenToken: string;
  afterCommandId?: number;
}) {
  const { db, session } = await loadSession(input.publicId);
  if (hashToken(input.screenToken) !== session.screenTokenHash)
    throw new Error("La pantalla no está autorizada para esta sesión.");
  const commands = await db
    .select()
    .from(controllerCommands)
    .where(
      and(
        eq(controllerCommands.sessionId, session.id),
        gt(controllerCommands.id, input.afterCommandId ?? 0)
      )
    )
    .orderBy(asc(controllerCommands.id))
    .limit(50);
  return {
    publicId: session.publicId,
    status: session.status,
    expiresAt: session.expiresAt.toISOString(),
    commands: commands.map(command => ({
      id: command.id,
      publicId: command.publicId,
      mode: command.mode,
      commandType: command.commandType,
      payload: JSON.parse(command.payloadJson) as CommandPayload,
      createdAt: command.createdAt.toISOString(),
    })),
    coreAccess: "NONE" as const,
  };
}

export async function closeControllerSession(input: {
  userId: number;
  baseRole?: string;
  publicId: string;
}) {
  const { db, session } = await loadSession(input.publicId);
  const role = await getControllerRole(input.userId, input.baseRole);
  if (session.createdByUserId !== input.userId && role !== "OPERATOR")
    throw new Error("Solo el creador u OPERADOR puede cerrar la sesión.");
  await db
    .update(controllerSessions)
    .set({ status: "CLOSED", closedAt: now(), lastSeenAt: now() })
    .where(eq(controllerSessions.id, session.id));
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_SESSION_CLOSED",
      aggregateType: "CONTROLLER_SESSION",
      aggregateId: session.publicId,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: { role, coreAccess: "NONE" },
      idempotencyKey: `controller-session-close:${session.publicId}`,
    },
    db
  );
  return {
    closed: true,
    publicId: session.publicId,
    coreAccess: "NONE" as const,
  };
}

export async function authorizeControllerSocket(input: {
  publicId: string;
  token: string;
  channel: "mobile" | "screen";
}) {
  const { session } = await loadSession(input.publicId);
  if (session.status === "EXPIRED" || session.status === "CLOSED")
    throw new Error("La sesión de control está vencida o cerrada.");
  const expectedHash =
    input.channel === "mobile"
      ? session.mobileTokenHash
      : session.screenTokenHash;
  if (hashToken(input.token) !== expectedHash)
    throw new Error("El token de WebSocket no corresponde con la sesión.");
  if (
    input.channel === "mobile" &&
    (!session.connectedUserId || session.status !== "CONNECTED")
  )
    throw new Error(
      "El celular debe completar el vínculo autenticado antes de abrir WebSocket."
    );
  return {
    sessionId: session.id,
    publicId: session.publicId,
    channel: input.channel,
    connectedUserId: session.connectedUserId,
    expiresAt: session.expiresAt.toISOString(),
    coreAccess: "NONE" as const,
  };
}

export async function sendControllerSocketCommand(input: {
  publicId: string;
  mobileToken: string;
  requestId: string;
  mode: ControllerMode;
  commandType: ControllerCommandType;
  payload: CommandPayload;
}) {
  const { session } = await loadSession(input.publicId);
  if (!session.connectedUserId)
    throw new Error("No hay un celular autenticado para esta sesión.");
  return sendControllerCommand({
    userId: session.connectedUserId,
    publicId: input.publicId,
    mobileToken: input.mobileToken,
    requestId: input.requestId,
    mode: input.mode,
    commandType: input.commandType,
    payload: input.payload,
  });
}

export async function shareControllerProfile(input: {
  userId: number;
  profile: Record<string, unknown>;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const profileJson = JSON.stringify(input.profile);
  if (profileJson.length > 12_000)
    throw new Error("El perfil supera el tamaño permitido.");
  const shareCode = sharedProfileCode();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000);
  await db
    .insert(controllerSharedProfiles)
    .values({ shareCode, ownerUserId: input.userId, profileJson, expiresAt });
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_PROFILE_SHARED",
      aggregateType: "CONTROLLER_PROFILE",
      aggregateId: shareCode,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: {
        expiresAt: expiresAt.toISOString(),
        containsSessionTokens: false,
        coreAccess: "NONE",
      },
      idempotencyKey: `controller-profile-share:${shareCode}`,
    },
    db
  );
  return {
    shareCode,
    expiresAt: expiresAt.toISOString(),
    coreAccess: "NONE" as const,
  };
}

export async function importSharedControllerProfile(input: {
  userId: number;
  shareCode: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const item = (
    await db
      .select()
      .from(controllerSharedProfiles)
      .where(
        eq(controllerSharedProfiles.shareCode, input.shareCode.toUpperCase())
      )
      .limit(1)
  )[0];
  if (!item || item.expiresAt.getTime() <= Date.now())
    throw new Error("El código de perfil no existe o venció.");
  const profile = JSON.parse(item.profileJson) as Record<string, unknown>;
  await appendOperationalEvent(
    {
      eventType: "CONTROLLER_PROFILE_IMPORTED",
      aggregateType: "CONTROLLER_PROFILE",
      aggregateId: item.shareCode,
      actorUserId: input.userId,
      source: "controller_lab",
      payload: { ownerUserId: item.ownerUserId, coreAccess: "NONE" },
      idempotencyKey: `controller-profile-import:${item.shareCode}:${input.userId}`,
    },
    db
  );
  return {
    shareCode: item.shareCode,
    profile,
    expiresAt: item.expiresAt.toISOString(),
    coreAccess: "NONE" as const,
  };
}
