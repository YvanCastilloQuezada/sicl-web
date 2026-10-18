import { createHash, randomBytes } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { shareSessions, shareTargets, worldObjects } from "../drizzle/schema";
import {
  clampShareTtl,
  normalizeShareDefinition,
  type ShareDefinitionInput,
  type ShareTargetType,
  type ShareCapability,
} from "../shared/lukaShare";
import { getDb } from "./db";
import { appendOperationalEvent } from "./eventStore";
import { appendGovernanceAudit } from "./auditGovernance";

const TOKEN_BYTES = 24;

type ShareTargetRow = typeof shareTargets.$inferSelect;
type ShareSessionRow = typeof shareSessions.$inferSelect;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function publicId(prefix: "SHARE" | "SSN") {
  return `${prefix}-${randomBytes(10).toString("hex").toUpperCase()}`;
}

function now() {
  return new Date();
}

function isExpired(expiresAt: Date | null, at = now()) {
  return Boolean(expiresAt && expiresAt.getTime() <= at.getTime());
}

export function validateShareOrigin(origin: string) {
  let parsed: URL;
  try { parsed = new URL(origin); } catch { throw new Error("SHARE_ORIGIN_INVALID"); }
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) throw new Error("SHARE_ORIGIN_INVALID");
  const configured = process.env.PUBLIC_APP_ORIGIN ? [process.env.PUBLIC_APP_ORIGIN] : [];
  const allowed = new Set([...configured, "https://luka.manus.space", "https://ruletaperu-dnzxnqyn.manus.space", "http://localhost:3000", "http://127.0.0.1:3000"]);
  if (!allowed.has(parsed.origin)) throw new Error("SHARE_ORIGIN_NOT_ALLOWED");
  return parsed.origin;
}

function parseMetadata(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function rowToView(row: ShareTargetRow, session = false) {
  return {
    publicId: row.publicId,
    targetType: row.targetType as ShareTargetType,
    destinationPath: row.destinationPath,
    metadata: parseMetadata(row.metadataJson),
    capability: row.capability as ShareCapability,
    priority: row.priority,
    expiresAt: row.expiresAt?.toISOString() ?? null,
    status: row.status,
    session,
    coreAccess: "NONE" as const,
  };
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db;
}

async function markTargetExpiredIfNeeded(db: Awaited<ReturnType<typeof requireDb>>, row: ShareTargetRow) {
  if (row.status === "ACTIVE" && isExpired(row.expiresAt)) {
    await db.update(shareTargets).set({ status: "EXPIRED" }).where(eq(shareTargets.id, row.id));
    return { ...row, status: "EXPIRED" as const };
  }
  return row;
}

async function markSessionExpiredIfNeeded(db: Awaited<ReturnType<typeof requireDb>>, row: ShareSessionRow) {
  if (row.status === "ACTIVE" && isExpired(row.expiresAt)) {
    await db.update(shareSessions).set({ status: "EXPIRED" }).where(eq(shareSessions.id, row.id));
    return { ...row, status: "EXPIRED" as const };
  }
  return row;
}

export async function createShareTarget(input: {
  ownerUserId: number;
  definition: ShareDefinitionInput;
}) {
  const db = await requireDb();
  if (input.definition.targetType === "EXPERIENCE") {
    const metadata = input.definition.metadata ?? {};
    validatePublishedShareMetadata(metadata);
    if (!["EXPERIENCE", "TERRITORIAL_WORLD_OBJECT"].includes(String(metadata.resourceType ?? ""))) throw new Error("SHARE_TARGET_RESOURCE_TYPE_REQUIRED");
  }
  const definition = normalizeShareDefinition(input.definition);
  const sharePublicId = publicId("SHARE");
  await db.insert(shareTargets).values({
    publicId: sharePublicId,
    ownerUserId: input.ownerUserId,
    targetType: definition.targetType,
    destinationPath: definition.destinationPath,
    metadataJson: JSON.stringify(definition.metadata),
    capability: definition.capability,
    priority: definition.priority,
    expiresAt: definition.expiresAt ?? null,
  });
  await appendOperationalEvent(
    {
      eventType: "LUKA_SHARE_TARGET_CREATED",
      aggregateType: "SHARE_TARGET",
      aggregateId: sharePublicId,
      actorUserId: input.ownerUserId,
      source: "luka_share",
      payload: {
        targetType: definition.targetType,
        capability: definition.capability,
        destinationPath: definition.destinationPath,
        coreAccess: "NONE",
      },
      idempotencyKey: `luka-share-create:${sharePublicId}`,
    },
    db
  );
  return rowToView({
    id: 0,
    publicId: sharePublicId,
    ownerUserId: input.ownerUserId,
    targetType: definition.targetType,
    destinationPath: definition.destinationPath,
    metadataJson: JSON.stringify(definition.metadata),
    capability: definition.capability,
    priority: definition.priority,
    status: "ACTIVE",
    expiresAt: definition.expiresAt ?? null,
    revokedAt: null,
    createdAt: now(),
    updatedAt: now(),
  });
}

export async function createShareSession(input: {
  ownerUserId: number;
  sharePublicId: string;
  expiresInSeconds: number;
  origin: string;
}) {
  const db = await requireDb();
  const origin = validateShareOrigin(input.origin);
  const target = (await db.select().from(shareTargets).where(eq(shareTargets.publicId, input.sharePublicId)).limit(1))[0];
  if (!target) throw new Error("El ShareTarget no existe.");
  const currentTarget = await markTargetExpiredIfNeeded(db, target);
  if (currentTarget.ownerUserId !== input.ownerUserId) throw new Error("El usuario no es propietario del ShareTarget.");
  if (currentTarget.status !== "ACTIVE") throw new Error("El ShareTarget no está activo.");
  const token = randomBytes(TOKEN_BYTES).toString("base64url");
  const sessionPublicId = publicId("SSN");
  const expiresAt = new Date(Date.now() + clampShareTtl(input.expiresInSeconds) * 1000);
  await db.insert(shareSessions).values({
    publicId: sessionPublicId,
    targetId: currentTarget.id,
    tokenHash: hashToken(token),
    userId: input.ownerUserId,
    expiresAt,
  });
  const url = `${origin}/share/${encodeURIComponent(sessionPublicId)}?token=${encodeURIComponent(token)}`;
  await appendOperationalEvent(
    {
      eventType: "LUKA_SHARE_SESSION_CREATED",
      aggregateType: "SHARE_SESSION",
      aggregateId: sessionPublicId,
      actorUserId: input.ownerUserId,
      source: "luka_share",
      payload: { sharePublicId: input.sharePublicId, expiresAt: expiresAt.toISOString(), coreAccess: "NONE" },
      idempotencyKey: `luka-share-session-create:${sessionPublicId}`,
    },
    db
  );
  return { publicId: sessionPublicId, token, url, expiresAt: expiresAt.toISOString(), coreAccess: "NONE" as const };
}

export async function resolveShareTarget(input: { publicId: string; token?: string }) {
  const db = await requireDb();
  if (input.publicId.startsWith("SSN-")) {
    if (!input.token) throw new Error("La sesión ShareTarget requiere token.");
    const session = (await db.select().from(shareSessions).where(eq(shareSessions.publicId, input.publicId)).limit(1))[0];
    if (!session || hashToken(input.token) !== session.tokenHash) throw new Error("Enlace ShareTarget inválido.");
    const currentSession = await markSessionExpiredIfNeeded(db, session);
    if (currentSession.status !== "ACTIVE") throw new Error("La sesión ShareTarget no está activa.");
    const target = (await db.select().from(shareTargets).where(eq(shareTargets.id, currentSession.targetId)).limit(1))[0];
    if (!target) throw new Error("El target ShareTarget no existe.");
    const currentTarget = await markTargetExpiredIfNeeded(db, target);
    if (currentTarget.status !== "ACTIVE") throw new Error("El target ShareTarget no está activo.");
    if (currentTarget.targetType === "EXPERIENCE") {
      const metadata = parseMetadata(currentTarget.metadataJson);
      validatePublishedShareMetadata(metadata);
      if (!["EXPERIENCE", "TERRITORIAL_WORLD_OBJECT"].includes(String(metadata.resourceType ?? ""))) throw new Error("SHARE_TARGET_RESOURCE_TYPE_REQUIRED");
    }
    return rowToView(currentTarget, true);
  }
  const target = (await db.select().from(shareTargets).where(eq(shareTargets.publicId, input.publicId)).limit(1))[0];
  if (!target) throw new Error("El ShareTarget no existe.");
  const currentTarget = await markTargetExpiredIfNeeded(db, target);
  if (currentTarget.status !== "ACTIVE") throw new Error("El target ShareTarget no está activo.");
  if (currentTarget.targetType === "EXPERIENCE") {
    const metadata = parseMetadata(currentTarget.metadataJson);
    validatePublishedShareMetadata(metadata);
    if (!["EXPERIENCE", "TERRITORIAL_WORLD_OBJECT"].includes(String(metadata.resourceType ?? ""))) throw new Error("SHARE_TARGET_RESOURCE_TYPE_REQUIRED");
  }
  return rowToView(currentTarget);
}

export async function listOwnedShareTargets(ownerUserId: number) {
  const db = await requireDb();
  const rows = await db.select().from(shareTargets).where(eq(shareTargets.ownerUserId, ownerUserId)).orderBy(asc(shareTargets.priority), asc(shareTargets.createdAt));
  return Promise.all(rows.map(row => markTargetExpiredIfNeeded(db, row))).then(updated => updated.map(row => rowToView(row)));
}

export function validatePublishedShareMetadata(metadata: Record<string, unknown>) {
  const resourceState = metadata.resourceState ?? metadata.status;
  const publicationStatus = metadata.publicationStatus ?? metadata.publication;
  const authorized = metadata.authorized === true || metadata.authorization === "AUTHORIZED" || publicationStatus === "PUBLISHED";
  if (resourceState !== "PUBLISHED" || !authorized) throw new Error("SHARE_TARGET_RESOURCE_NOT_PUBLISHED");
}

export async function createPublishedExperienceShareTarget(input: {
  ownerUserId: number;
  experiencePublicId: string;
  destinationPath: string;
  metadata: Record<string, unknown>;
  capability: ShareCapability;
  priority?: number;
  expiresAt?: Date | null;
}) {
  validatePublishedShareMetadata(input.metadata);
  return createShareTarget({
    ownerUserId: input.ownerUserId,
    definition: {
      targetType: "EXPERIENCE",
      destinationPath: input.destinationPath,
      metadata: { ...input.metadata, resourceType: "EXPERIENCE", resourcePublicId: input.experiencePublicId, deepLinkKind: input.metadata.deepLinkKind ?? "EXPERIENCE" },
      capability: input.capability,
      priority: input.priority,
      expiresAt: input.expiresAt,
    },
  });
}

export async function createPublishedTerritorialShareTarget(input: {
  ownerUserId: number;
  objectPublicId: string;
  destinationPath: string;
  metadata?: Record<string, unknown>;
  priority?: number;
  expiresAt?: Date | null;
}) {
  const db = await requireDb();
  const object = (await db.select({ id: worldObjects.id, status: worldObjects.status, publicationStatus: worldObjects.publicationStatus, version: worldObjects.version }).from(worldObjects).where(eq(worldObjects.publicId, input.objectPublicId)).limit(1))[0];
  if (!object) throw new Error("WORLD_OBJECT_NOT_FOUND");
  if (object.status !== "PUBLISHED" || object.publicationStatus !== "PUBLISHED") throw new Error("SHARE_TARGET_RESOURCE_NOT_PUBLISHED");
  return createShareTarget({
    ownerUserId: input.ownerUserId,
    definition: {
      targetType: "EXPERIENCE",
      destinationPath: input.destinationPath,
      metadata: { ...(input.metadata ?? {}), resourceType: "TERRITORIAL_WORLD_OBJECT", resourcePublicId: input.objectPublicId, resourceState: "PUBLISHED", publicationStatus: "PUBLISHED", publishedVersion: object.version, deepLinkKind: input.metadata?.deepLinkKind ?? "LUKA_AR" },
      capability: "TERRITORIAL_RUNTIME",
      priority: input.priority,
      expiresAt: input.expiresAt,
    },
  });
}

export async function resolveActiveShareTarget(input: { experienceSharePublicId?: string; sessionPublicId?: string; sessionToken?: string; publicLukaSharePublicId?: string }) {
  let resolved: { view: Awaited<ReturnType<typeof resolveShareTarget>>; resolution: "ACTIVE_EXPERIENCE" | "AUTHORIZED_SESSION" | "PUBLIC_LUKA" } | null = null;
  if (input.experienceSharePublicId) {
    const view = await resolveShareTarget({ publicId: input.experienceSharePublicId });
    if (view.targetType !== "EXPERIENCE") throw new Error("INVALID_EXPERIENCE_SHARE_TARGET");
    resolved = { view, resolution: "ACTIVE_EXPERIENCE" };
  } else if (input.sessionPublicId) {
    const view = await resolveShareTarget({ publicId: input.sessionPublicId, token: input.sessionToken });
    resolved = { view, resolution: "AUTHORIZED_SESSION" };
  } else if (input.publicLukaSharePublicId) {
    const view = await resolveShareTarget({ publicId: input.publicLukaSharePublicId });
    if (view.targetType !== "PUBLIC_LUKA") throw new Error("INVALID_PUBLIC_LUKA_TARGET");
    resolved = { view, resolution: "PUBLIC_LUKA" };
  } else {
    const db = await requireDb();
    const rows = await db.select().from(shareTargets).where(eq(shareTargets.status, "ACTIVE")).orderBy(asc(shareTargets.priority), asc(shareTargets.createdAt));
    const current = [] as ShareTargetRow[];
    for (const row of rows) {
      const active = await markTargetExpiredIfNeeded(db, row);
      if (active.status === "ACTIVE") current.push(active);
    }
    const experience = current.find(row => row.targetType === "EXPERIENCE");
    const publicLuka = current.find(row => row.targetType === "PUBLIC_LUKA");
    if (experience) resolved = { view: rowToView(experience), resolution: "ACTIVE_EXPERIENCE" };
    else if (publicLuka) resolved = { view: rowToView(publicLuka), resolution: "PUBLIC_LUKA" };
  }
  if (!resolved) throw new Error("NO_ACTIVE_SHARE_TARGET");
  await appendGovernanceAudit({ action: "SHARE_TARGET_RESOLVED", resource: "SHARE_TARGET", resourceId: resolved.view.publicId, metadata: { resolution: resolved.resolution, targetType: resolved.view.targetType, session: resolved.view.session, coreAccess: "NONE" } });
  return { ...resolved.view, resolution: resolved.resolution };
}

export async function revokeShareTarget(input: { ownerUserId: number; publicId: string }) {
  const db = await requireDb();
  const target = (await db.select().from(shareTargets).where(eq(shareTargets.publicId, input.publicId)).limit(1))[0];
  if (!target || target.ownerUserId !== input.ownerUserId) throw new Error("ShareTarget inexistente o sin ownership.");
  await db.update(shareTargets).set({ status: "REVOKED", revokedAt: now() }).where(eq(shareTargets.id, target.id));
  await db.update(shareSessions).set({ status: "REVOKED", revokedAt: now() }).where(and(eq(shareSessions.targetId, target.id), eq(shareSessions.status, "ACTIVE")));
  await appendOperationalEvent(
    {
      eventType: "LUKA_SHARE_TARGET_REVOKED",
      aggregateType: "SHARE_TARGET",
      aggregateId: input.publicId,
      actorUserId: input.ownerUserId,
      source: "luka_share",
      payload: { coreAccess: "NONE" },
      idempotencyKey: `luka-share-revoke:${input.publicId}:${Date.now()}`,
    },
    db
  );
  return { revoked: true, publicId: input.publicId, coreAccess: "NONE" as const };
}
