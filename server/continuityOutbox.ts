import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync as DatabaseSyncType } from "node:sqlite";

const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite") as typeof import("node:sqlite");

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

type OutboxStatus = "PENDING_SYNC" | "SYNCED" | "BLOCKED";
type OutboxRow = {
  id: number;
  ownerId: number;
  projectId: string;
  workstreamId: string;
  eventId: string;
  idempotencyKey: string;
  eventType: string;
  encryptedEnvelope: string;
  nonce: string;
  authTag: string;
  sha256: string;
  status: OutboxStatus;
  attempts: number;
  nextAttemptAt: string | null;
  lastError: string | null;
  coreSequence: number | null;
  createdAt: string;
  updatedAt: string;
};

function canonical(value: unknown): string {
  const sort = (input: unknown): unknown => {
    if (Array.isArray(input)) return input.map(sort);
    if (input && typeof input === "object") {
      return Object.fromEntries(Object.entries(input as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, sort(item)]));
    }
    return input;
  };
  return JSON.stringify(sort(value));
}

function keyFromEnvironment(): Buffer {
  const raw = process.env.ARKI_CONTINUITY_ENCRYPTION_KEY?.trim();
  if (!raw) throw new Error("CONTINUITY_ENCRYPTION_KEY_REQUIRED");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32 || key.toString("base64") !== raw) throw new Error("CONTINUITY_ENCRYPTION_KEY_INVALID");
  return key;
}

function aad(row: Pick<OutboxRow, "ownerId" | "projectId" | "workstreamId" | "eventId" | "idempotencyKey" | "eventType">): Buffer {
  return Buffer.from(canonical({
    ownerId: row.ownerId,
    projectId: row.projectId,
    workstreamId: row.workstreamId,
    eventId: row.eventId,
    idempotencyKey: row.idempotencyKey,
    eventType: row.eventType,
  }), "utf8");
}

function encrypt(clear: string, context: Buffer) {
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyFromEnvironment(), nonce);
  cipher.setAAD(context);
  const ciphertext = Buffer.concat([cipher.update(clear, "utf8"), cipher.final()]);
  return { encryptedEnvelope: ciphertext.toString("base64"), nonce: nonce.toString("hex"), authTag: cipher.getAuthTag().toString("hex") };
}

function decrypt(row: OutboxRow): ContinuityEnvelope {
  const decipher = createDecipheriv("aes-256-gcm", keyFromEnvironment(), Buffer.from(row.nonce, "hex"));
  decipher.setAAD(aad(row));
  decipher.setAuthTag(Buffer.from(row.authTag, "hex"));
  const clear = Buffer.concat([
    decipher.update(Buffer.from(row.encryptedEnvelope, "base64")),
    decipher.final(),
  ]).toString("utf8");
  const event = JSON.parse(clear) as ContinuityEnvelope;
  if (createHash("sha256").update(canonical(event)).digest("hex") !== row.sha256) {
    throw new Error("CONTINUITY_OUTBOX_INTEGRITY_FAILURE");
  }
  if (event.event_id !== row.eventId || event.idempotency_key !== row.idempotencyKey) {
    throw new Error("CONTINUITY_OUTBOX_CONTEXT_MISMATCH");
  }
  return event;
}

function mapRow(row: Record<string, unknown>): OutboxRow {
  return {
    id: Number(row.id),
    ownerId: Number(row.owner_id),
    projectId: String(row.project_id),
    workstreamId: String(row.workstream_id),
    eventId: String(row.event_id),
    idempotencyKey: String(row.idempotency_key),
    eventType: String(row.event_type),
    encryptedEnvelope: String(row.encrypted_envelope),
    nonce: String(row.nonce),
    authTag: String(row.auth_tag),
    sha256: String(row.sha256),
    status: String(row.status) as OutboxStatus,
    attempts: Number(row.attempts),
    nextAttemptAt: row.next_attempt_at == null ? null : String(row.next_attempt_at),
    lastError: row.last_error == null ? null : String(row.last_error),
    coreSequence: row.core_sequence == null ? null : Number(row.core_sequence),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export function createContinuityOutboxStore(db: DatabaseSyncType) {
  db.exec("PRAGMA busy_timeout=5000");
  db.exec(`
    CREATE TABLE IF NOT EXISTS arki_continuity_outbox (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL,
      project_id TEXT NOT NULL,
      workstream_id TEXT NOT NULL,
      event_id TEXT NOT NULL UNIQUE,
      idempotency_key TEXT NOT NULL,
      event_type TEXT NOT NULL,
      encrypted_envelope TEXT NOT NULL,
      nonce TEXT NOT NULL,
      auth_tag TEXT NOT NULL,
      sha256 TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('PENDING_SYNC','SYNCED','BLOCKED')),
      attempts INTEGER NOT NULL DEFAULT 0,
      next_attempt_at TEXT,
      last_error TEXT,
      core_sequence INTEGER,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
      UNIQUE(owner_id, project_id, idempotency_key)
    );
    CREATE INDEX IF NOT EXISTS arki_continuity_pending_idx
      ON arki_continuity_outbox(status, created_at);
  `);
  const columns = db.prepare("PRAGMA table_info(arki_continuity_outbox)").all() as Array<{ name: string }>;
  if (!columns.some((column) => column.name === "next_attempt_at")) {
    db.exec("ALTER TABLE arki_continuity_outbox ADD COLUMN next_attempt_at TEXT");
  }

  return {
    enqueue(input: { ownerId: number; projectId: string; event: ContinuityEnvelope }) {
      db.exec("BEGIN IMMEDIATE");
      let transactionOpen = true;
      try {
        // Serialize concurrent retries and preserve the original server-side recorded_at.
        const existingRaw = db.prepare(`
          SELECT * FROM arki_continuity_outbox
          WHERE event_id=? OR (owner_id=? AND project_id=? AND idempotency_key=?)
          LIMIT 2
        `).all(input.event.event_id, input.ownerId, input.projectId, input.event.idempotency_key) as Record<string, unknown>[];
        const existingRows = existingRaw.map(mapRow);
        if (existingRows.length > 0) {
          const existing = existingRows.find((row) => row.eventId === input.event.event_id)
            ?? existingRows.find((row) => row.idempotencyKey === input.event.idempotency_key);
          if (!existing || existing.ownerId !== input.ownerId || existing.projectId !== input.projectId ||
              existing.eventId !== input.event.event_id || existing.idempotencyKey !== input.event.idempotency_key) {
            throw new Error("CONTINUITY_IDEMPOTENCY_CONFLICT");
          }
          const previous = decrypt(existing);
          const comparable = (event: ContinuityEnvelope) => canonical({ ...event, recorded_at: null });
          if (comparable(previous) !== comparable(input.event)) {
            throw new Error("CONTINUITY_IDEMPOTENCY_CONFLICT");
          }
          db.exec("COMMIT");
          transactionOpen = false;
          return { id: existing.id, eventId: existing.eventId, status: existing.status, sha256: existing.sha256 };
        }

        const clear = canonical(input.event);
        const sha256 = createHash("sha256").update(clear).digest("hex");
        const context = aad({
          ownerId: input.ownerId,
          projectId: input.projectId,
          workstreamId: input.event.workstream_id,
          eventId: input.event.event_id,
          idempotencyKey: input.event.idempotency_key,
          eventType: input.event.event_type,
        });
        const encrypted = encrypt(clear, context);
        db.prepare(`
          INSERT INTO arki_continuity_outbox
          (owner_id, project_id, workstream_id, event_id, idempotency_key, event_type,
           encrypted_envelope, nonce, auth_tag, sha256, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_SYNC')
        `).run(
          input.ownerId, input.projectId, input.event.workstream_id, input.event.event_id,
          input.event.idempotency_key, input.event.event_type, encrypted.encryptedEnvelope,
          encrypted.nonce, encrypted.authTag, sha256,
        );
        const inserted = db.prepare("SELECT id, status FROM arki_continuity_outbox WHERE event_id=?")
          .get(input.event.event_id) as { id: number; status: OutboxStatus } | undefined;
        if (!inserted) throw new Error("CONTINUITY_OUTBOX_INSERT_NOT_CONFIRMED");
        db.exec("COMMIT");
        transactionOpen = false;
        return { id: Number(inserted.id), eventId: input.event.event_id, status: inserted.status, sha256 };
      } catch (error) {
        if (transactionOpen) db.exec("ROLLBACK");
        throw error;
      }
    },

    pending(limit = 25) {
      const rows = db.prepare(`
        SELECT * FROM arki_continuity_outbox
        WHERE status='PENDING_SYNC' AND (next_attempt_at IS NULL OR next_attempt_at <= strftime('%Y-%m-%dT%H:%M:%fZ','now')) ORDER BY created_at ASC, id ASC LIMIT ?
      `).all(limit) as Record<string, unknown>[];
      return rows.map((raw) => {
        const row = mapRow(raw);
        try { return { row, event: decrypt(row), decryptError: null as string | null }; }
        catch (error) { return { row, event: null, decryptError: error instanceof Error ? error.message : "CONTINUITY_DECRYPTION_FAILED" }; }
      });
    },

    markSynced(id: number, coreSequence: number) {
      db.prepare(`
        UPDATE arki_continuity_outbox
        SET status='SYNCED', core_sequence=?, last_error=NULL, next_attempt_at=NULL,
            updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
        WHERE id=? AND status='PENDING_SYNC'
      `).run(coreSequence, id);
    },

    recordFailure(id: number, error: string, blocked = false) {
      const current = db.prepare("SELECT attempts FROM arki_continuity_outbox WHERE id=? AND status='PENDING_SYNC'")
        .get(id) as { attempts: number } | undefined;
      if (!current) return;
      const attempts = Number(current.attempts) + 1;
      const delaySeconds = Math.min(3600, 30 * (2 ** Math.min(attempts - 1, 7)));
      const nextAttemptAt = blocked ? null : new Date(Date.now() + delaySeconds * 1000).toISOString();
      db.prepare(`
        UPDATE arki_continuity_outbox
        SET attempts=?,
            status=CASE WHEN ?=1 THEN 'BLOCKED' ELSE 'PENDING_SYNC' END,
            next_attempt_at=?,
            last_error=?,
            updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now')
        WHERE id=? AND status='PENDING_SYNC'
      `).run(attempts, blocked ? 1 : 0, nextAttemptAt, error.slice(0, 1000), id);
    },

    status(ownerId: number, projectId: string) {
      const rows = db.prepare(`
        SELECT status, COUNT(*) AS count FROM arki_continuity_outbox
        WHERE owner_id=? AND project_id=? GROUP BY status
      `).all(ownerId, projectId) as Array<{ status: OutboxStatus; count: number }>;
      return rows.reduce((acc, row) => {
        acc[row.status] = Number(row.count);
        return acc;
      }, {} as Record<string, number>);
    },

    event(ownerId: number, projectId: string, eventId: string) {
      const raw = db.prepare(`
        SELECT event_id, status, sha256, core_sequence, attempts, last_error
        FROM arki_continuity_outbox
        WHERE owner_id=? AND project_id=? AND event_id=? LIMIT 1
      `).get(ownerId, projectId, eventId) as Record<string, unknown> | undefined;
      if (!raw) return null;
      return {
        eventId: String(raw.event_id),
        status: String(raw.status) as OutboxStatus,
        sha256: String(raw.sha256),
        coreSequence: raw.core_sequence == null ? null : Number(raw.core_sequence),
        attempts: Number(raw.attempts),
        lastError: raw.last_error == null ? null : String(raw.last_error),
      };
    },
  };
}

let store: ReturnType<typeof createContinuityOutboxStore> | null = null;

function getStore() {
  if (store) return store;
  const configured = process.env.ARKI_CONTINUITY_OUTBOX_PATH?.trim();
  const root = process.env.ARKI_STORAGE_ROOT?.trim() || path.join(process.cwd(), "data");
  const file = path.resolve(configured || path.join(root, "memory", "continuity-outbox.sqlite"));
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  try { fs.chmodSync(path.dirname(file), 0o700); } catch { /* platform may not support chmod */ }
  const db = new DatabaseSync(file);
  try { fs.chmodSync(file, 0o600); } catch { /* file permissions are best-effort on unsupported filesystems */ }
  db.exec("PRAGMA journal_mode=WAL");
  store = createContinuityOutboxStore(db);
  return store;
}

export async function enqueueContinuityEvent(input: { ownerId: number; projectId: string; event: ContinuityEnvelope }) {
  return getStore().enqueue(input);
}
export async function listPendingContinuityEvents(limit = 25) {
  return getStore().pending(limit);
}
export async function markContinuitySynced(id: number, coreSequence: number) {
  getStore().markSynced(id, coreSequence);
}
export async function recordContinuitySyncFailure(id: number, error: string, blocked = false) {
  getStore().recordFailure(id, error, blocked);
}
export async function getContinuityOutboxStatus(ownerId: number, projectId: string) {
  return getStore().status(ownerId, projectId);
}
export async function getContinuityOutboxEvent(ownerId: number, projectId: string, eventId: string) {
  return getStore().event(ownerId, projectId, eventId);
}
