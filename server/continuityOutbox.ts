import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { and, asc, eq, or } from "drizzle-orm";
import { arkiContinuityOutbox } from "../drizzle/schema";
import { getDb } from "./db";

export type ContinuityEnvelope = {
  event_id: string;
  event_type: string;
  workstream_id: string;
  occurred_at: string;
  recorded_at: string;
  actor: string;
  authority_ref: string | null;
  source_system: "SICL_WEB";
  source_sha: string | null;
  evidence_refs: string[];
  payload: Record<string, unknown>;
  idempotency_key: string;
  correlation_id: string;
  supersedes_event_id: string | null;
};

function encryptionKey(): Buffer {
  const raw = process.env.ARKI_CONTINUITY_ENCRYPTION_KEY?.trim();
  if (!raw) throw new Error("CONTINUITY_ENCRYPTION_KEY_REQUIRED");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("CONTINUITY_ENCRYPTION_KEY_INVALID");
  return key;
}

function sortDeep(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sortDeep(item)]));
  }
  return value;
}

function canonical(value: unknown): string {
  return JSON.stringify(sortDeep(value));
}

function encrypt(value: string) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), nonce);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return { encryptedEnvelope: ciphertext.toString("base64"), nonce: nonce.toString("hex"), authTag: cipher.getAuthTag().toString("hex") };
}

function decrypt(row: typeof arkiContinuityOutbox.$inferSelect): ContinuityEnvelope {
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(row.nonce, "hex"));
  decipher.setAuthTag(Buffer.from(row.authTag, "hex"));
  const clear = Buffer.concat([
    decipher.update(Buffer.from(row.encryptedEnvelope, "base64")),
    decipher.final(),
  ]).toString("utf8");
  const event = JSON.parse(clear) as ContinuityEnvelope;
  const actual = createHash("sha256").update(canonical(event)).digest("hex");
  if (actual !== row.sha256) throw new Error("CONTINUITY_OUTBOX_INTEGRITY_FAILURE");
  return event;
}

export async function enqueueContinuityEvent(input: {
  ownerId: number;
  projectId: string;
  event: ContinuityEnvelope;
}) {
  const db = await getDb();
  if (!db) throw new Error("CONTINUITY_DATABASE_REQUIRED");
  const clear = canonical(input.event);
  const sha256 = createHash("sha256").update(clear).digest("hex");
  const encrypted = encrypt(clear);
  await db.insert(arkiContinuityOutbox).values({
    ownerId: input.ownerId,
    projectId: input.projectId,
    workstreamId: input.event.workstream_id,
    eventId: input.event.event_id,
    idempotencyKey: input.event.idempotency_key,
    eventType: input.event.event_type,
    ...encrypted,
    sha256,
    status: "PENDING_SYNC",
    attempts: 0,
    lastError: null,
    coreSequence: null,
  }).onDuplicateKeyUpdate({ set: { updatedAt: new Date() } });

  const rows = await db.select().from(arkiContinuityOutbox).where(or(
    eq(arkiContinuityOutbox.eventId, input.event.event_id),
    and(
      eq(arkiContinuityOutbox.ownerId, input.ownerId),
      eq(arkiContinuityOutbox.projectId, input.projectId),
      eq(arkiContinuityOutbox.idempotencyKey, input.event.idempotency_key),
    ),
  )).limit(2);
  const row = rows.find((item) => item.eventId === input.event.event_id)
    ?? rows.find((item) => item.idempotencyKey === input.event.idempotency_key);
  if (!row || row.ownerId !== input.ownerId || row.projectId !== input.projectId || row.sha256 !== sha256) {
    throw new Error("CONTINUITY_IDEMPOTENCY_CONFLICT");
  }
  return { id: row.id, eventId: row.eventId, status: row.status, sha256: row.sha256 };
}

export async function listPendingContinuityEvents(limit = 25) {
  const db = await getDb();
  if (!db) throw new Error("CONTINUITY_DATABASE_REQUIRED");
  const rows = await db.select().from(arkiContinuityOutbox)
    .where(eq(arkiContinuityOutbox.status, "PENDING_SYNC"))
    .orderBy(asc(arkiContinuityOutbox.createdAt))
    .limit(limit);
  return rows.map((row) => {
    try { return { row, event: decrypt(row), decryptError: null as string | null }; }
    catch (error) { return { row, event: null, decryptError: error instanceof Error ? error.message : "CONTINUITY_DECRYPTION_FAILED" }; }
  });
}

export async function markContinuitySynced(id: number, coreSequence: number) {
  const db = await getDb();
  if (!db) throw new Error("CONTINUITY_DATABASE_REQUIRED");
  await db.update(arkiContinuityOutbox).set({
    status: "SYNCED", coreSequence, lastError: null, updatedAt: new Date(),
  }).where(eq(arkiContinuityOutbox.id, id));
}

export async function recordContinuitySyncFailure(id: number, error: string, blocked = false) {
  const db = await getDb();
  if (!db) throw new Error("CONTINUITY_DATABASE_REQUIRED");
  const rows = await db.select().from(arkiContinuityOutbox).where(eq(arkiContinuityOutbox.id, id)).limit(1);
  if (!rows[0]) return;
  const attempts = rows[0].attempts + 1;
  await db.update(arkiContinuityOutbox).set({
    status: blocked || attempts >= 12 ? "BLOCKED" : "PENDING_SYNC",
    attempts,
    lastError: error.slice(0, 1000),
    updatedAt: new Date(),
  }).where(eq(arkiContinuityOutbox.id, id));
}

export async function getContinuityOutboxStatus(ownerId: number, projectId: string) {
  const db = await getDb();
  if (!db) throw new Error("CONTINUITY_DATABASE_REQUIRED");
  const rows = await db.select({
    status: arkiContinuityOutbox.status,
    count: arkiContinuityOutbox.id,
  }).from(arkiContinuityOutbox).where(and(
    eq(arkiContinuityOutbox.ownerId, ownerId),
    eq(arkiContinuityOutbox.projectId, projectId),
  ));
  return rows.reduce((acc, row) => {
    acc[row.status] = (acc[row.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}
