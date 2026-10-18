import { createHash, randomUUID } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { auditEvents, territorialRoleAssignments, users } from "../drizzle/schema";
import { getDb } from "./db";
import { GOVERNANCE_STATES, isActionAfterIntent, isGovernanceState, requiresHumanAuthority, type GovernanceState } from "../shared/auditGovernance";

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([left], [right]) => left.localeCompare(right)).map(([key, nested]) => [key, canonicalize(nested)]));
  return value;
}

const canonicalJson = (value: unknown) => JSON.stringify(canonicalize(value ?? null));
const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
const publicId = () => `GOV-${randomUUID().replaceAll("-", "").slice(0, 24).toUpperCase()}`;

type AuditInput = {
  actorUserId?: number;
  action: string;
  resource: string;
  resourceId: string;
  previousState?: unknown;
  newState?: unknown;
  metadata?: Record<string, unknown>;
  correlationId?: string;
};

async function resolveActorRole(actorUserId?: number) {
  const db = await getDb();
  if (!db || actorUserId === undefined) return null;
  const assignment = (await db.select({ role: territorialRoleAssignments.role }).from(territorialRoleAssignments).where(eq(territorialRoleAssignments.userId, actorUserId)).limit(1))[0];
  if (assignment?.role) return assignment.role;
  const user = (await db.select({ role: users.role }).from(users).where(eq(users.id, actorUserId)).limit(1))[0];
  return user?.role ?? null;
}

function hashAuditEnvelope(previousHash: string | null, input: { action: string; resource: string; resourceId: string; previousStateJson: string; newStateJson: string; metadataJson: string; correlationId: string }) {
  return sha256([previousHash ?? "GENESIS", input.action, input.resource, input.resourceId, input.previousStateJson, input.newStateJson, input.metadataJson, input.correlationId].join("|"));
}

export async function appendGovernanceAudit(input: AuditInput) {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const correlationId = (input.correlationId ?? `corr:${input.resource}:${input.resourceId}`).slice(0, 96);
  if (requiresHumanAuthority(input.action)) await assertHumanAuthority({ actorUserId: input.actorUserId ?? -1, action: input.action, resource: input.resource, resourceId: input.resourceId });
  if (input.action.toUpperCase() === "ACTION_EXECUTED") {
    const intent = (await db.select({ id: auditEvents.id }).from(auditEvents).where(and(eq(auditEvents.entityPublicId, input.resourceId), eq(auditEvents.action, "INTENT_DETECTED"), eq(auditEvents.correlationId, correlationId))).limit(1))[0];
    if (!intent) throw new Error("INTENT_REQUIRED_BEFORE_ACTION");
  }
  const previous = await db.select({ eventHash: auditEvents.eventHash }).from(auditEvents).orderBy(desc(auditEvents.id)).limit(1);
  const previousHash = previous[0]?.eventHash ?? null;
  const previousStateJson = canonicalJson(input.previousState ?? null);
  const newStateJson = canonicalJson(input.newState ?? null);
  const metadataJson = canonicalJson(input.metadata ?? {});
  const eventHash = hashAuditEnvelope(previousHash, { action: input.action, resource: input.resource, resourceId: input.resourceId, previousStateJson, newStateJson, metadataJson, correlationId });
  const role = await resolveActorRole(input.actorUserId);
  const eventType = input.action.toUpperCase().replace(/[^A-Z0-9]+/g, "_").slice(0, 64);
  await db.insert(auditEvents).values({ publicId: publicId(), actorUserId: input.actorUserId ?? null, actorRole: role, eventType, entityType: input.resource, entityPublicId: input.resourceId, action: input.action.slice(0, 96), previousStateJson, newStateJson, metadataJson, correlationId, payloadJson: metadataJson, previousHash, eventHash });
  return { eventHash, previousHash, correlationId, actorRole: role };
}

export async function listGovernanceAudit(input: { actorUserId?: number; resource?: string; resourceId?: string; action?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const filters = [];
  if (input.actorUserId !== undefined) filters.push(eq(auditEvents.actorUserId, input.actorUserId));
  if (input.resource) filters.push(eq(auditEvents.entityType, input.resource));
  if (input.resourceId) filters.push(eq(auditEvents.entityPublicId, input.resourceId));
  if (input.action) filters.push(eq(auditEvents.action, input.action));
  return db.select().from(auditEvents).where(filters.length ? and(...filters) : undefined).orderBy(desc(auditEvents.id)).limit(Math.min(Math.max(input.limit ?? 100, 1), 500));
}

function expectedHash(row: typeof auditEvents.$inferSelect, previousHash: string | null) {
  if (row.action) return hashAuditEnvelope(previousHash, { action: row.action, resource: row.entityType, resourceId: row.entityPublicId, previousStateJson: row.previousStateJson ?? "null", newStateJson: row.newStateJson ?? "null", metadataJson: row.metadataJson ?? row.payloadJson, correlationId: row.correlationId ?? `corr:${row.entityType}:${row.entityPublicId}` });
  return sha256(`${previousHash ?? "GENESIS"}|${row.eventType}|${row.entityType}|${row.entityPublicId}|${row.payloadJson}`);
}

export function verifyAuditChainRows(rows: Array<typeof auditEvents.$inferSelect>) {
  const failures: Array<{ publicId: string; reason: string }> = [];
  let previousHash: string | null = null;
  for (const row of rows) {
    if (row.previousHash !== previousHash) failures.push({ publicId: row.publicId, reason: "PREVIOUS_HASH_MISMATCH" });
    const expected = expectedHash(row, previousHash);
    if (row.eventHash !== expected) failures.push({ publicId: row.publicId, reason: "EVENT_HASH_INVALID" });
    previousHash = row.eventHash;
  }
  return { valid: failures.length === 0, checked: rows.length, failures, tailHash: previousHash };
}

export async function validateAuditIntegrity() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const rows = await db.select().from(auditEvents).orderBy(auditEvents.id);
  return verifyAuditChainRows(rows);
}

export async function recordGovernanceState(input: { actorUserId: number; resource: string; resourceId: string; state: GovernanceState; previousState?: GovernanceState; metadata?: Record<string, unknown>; correlationId?: string }) {
  if (!isGovernanceState(input.state)) throw new Error("INVALID_GOVERNANCE_STATE");
  return appendGovernanceAudit({ actorUserId: input.actorUserId, action: "GOVERNANCE_STATE_CHANGED", resource: input.resource, resourceId: input.resourceId, previousState: input.previousState ? { state: input.previousState } : null, newState: { state: input.state }, metadata: input.metadata, correlationId: input.correlationId });
}

export async function assertHumanAuthority(input: { actorUserId: number; action: string; resource: string; resourceId: string }) {
  if (!requiresHumanAuthority(input.action)) return { allowed: true, role: null };
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  const assignment = (await db.select({ role: territorialRoleAssignments.role }).from(territorialRoleAssignments).where(eq(territorialRoleAssignments.userId, input.actorUserId)).limit(1))[0];
  const user = (await db.select({ role: users.role }).from(users).where(eq(users.id, input.actorUserId)).limit(1))[0];
  const isHuman = assignment?.role === "HUMAN_AUTHORITY" || user?.role === "admin";
  if (!isHuman) throw new Error("HUMAN_AUTHORITY_REQUIRED");
  return { allowed: true, role: assignment?.role ?? user?.role ?? null };
}

export async function assertCapability(input: { capability: string; action: string; intentRecorded: boolean; actorUserId?: number }) {
  if (input.action.toUpperCase() === "ACTION_EXECUTED" && !isActionAfterIntent(input.intentRecorded)) throw new Error("INTENT_REQUIRED_BEFORE_ACTION");
  if (input.capability === "MJP_CORE_WRITE") throw new Error("MJP_CORE_WRITE_BLOCKED");
  return { allowed: true, capability: input.capability, intentRecorded: input.intentRecorded };
}

export const governanceStates = GOVERNANCE_STATES;

export async function recordSecurityEvent(input: { eventType: "AUTH_FAILURE" | "AUTHZ_FAILURE" | "INVALID_TOKEN" | "EXPIRED_TOKEN" | "REVOKED_TOKEN" | "OWNERSHIP_DENIED" | "RATE_LIMITED" | "INVALID_INPUT" | "SECURITY_POLICY_VIOLATION" | "SECRET_EXPOSURE_ATTEMPT"; resourceId?: string; actorUserId?: number; metadata?: Record<string, unknown> }) {
  try {
    return await appendGovernanceAudit({
      actorUserId: input.actorUserId,
      action: input.eventType,
      resource: "SECURITY",
      resourceId: (input.resourceId ?? "UNKNOWN").slice(0, 96),
      metadata: input.metadata,
    });
  } catch {
    // Security telemetry must never turn an authentication failure into a data leak or outage.
    return null;
  }
}
