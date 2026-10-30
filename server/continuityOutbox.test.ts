import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createContinuityOutboxStore, type ContinuityEnvelope } from "./continuityOutbox";

const { DatabaseSync } = createRequire(import.meta.url)("node:sqlite") as typeof import("node:sqlite");
const originalKey = process.env.ARKI_CONTINUITY_ENCRYPTION_KEY;
const key = randomBytes(32).toString("base64");

function event(overrides: Partial<ContinuityEnvelope> = {}): ContinuityEnvelope {
  return {
    event_id: "SICL-EVENT-001",
    event_type: "TASK_UPDATED",
    workstream_id: "MEMORY",
    occurred_at: "2026-10-30T10:00:00.000Z",
    recorded_at: "2026-10-30T10:00:00.000Z",
    actor: "owner-001",
    authority_ref: null,
    source_system: "SICL_WEB",
    source_sha: null,
    evidence_refs: [],
    payload: { summary: "Outbox persistence test" },
    idempotency_key: "idem-001",
    correlation_id: "corr-001",
    supersedes_event_id: null,
    ...overrides,
  };
}

function fixture() {
  const db = new DatabaseSync(":memory:");
  const store = createContinuityOutboxStore(db);
  return { db, store };
}

beforeEach(() => {
  process.env.ARKI_CONTINUITY_ENCRYPTION_KEY = key;
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.ARKI_CONTINUITY_ENCRYPTION_KEY;
  else process.env.ARKI_CONTINUITY_ENCRYPTION_KEY = originalKey;
});

describe("ARKI MEMORY SQLite continuity outbox", () => {
  it("adds the retry schedule column to an existing outbox database", () => {
    const db = new DatabaseSync(":memory:");
    try {
      db.exec(`
        CREATE TABLE arki_continuity_outbox (
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
          last_error TEXT,
          core_sequence INTEGER,
          created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
          UNIQUE(owner_id, project_id, idempotency_key)
        );
      `);
      createContinuityOutboxStore(db);
      const columns = db.prepare("PRAGMA table_info(arki_continuity_outbox)").all() as Array<{ name: string }>;
      expect(columns.some((column) => column.name === "next_attempt_at")).toBe(true);
    } finally { db.close(); }
  });

  it("persists encrypted events and decrypts them for retry", () => {
    const { db, store } = fixture();
    try {
      const queued = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      const pending = store.pending();
      expect(queued.status).toBe("PENDING_SYNC");
      expect(pending).toHaveLength(1);
      expect(pending[0].event).toEqual(event());
      expect(pending[0].row.encryptedEnvelope).not.toContain("Outbox persistence test");
    } finally { db.close(); }
  });

  it("survives closing and reopening a file-backed SQLite database", async () => {
    const directory = await mkdtemp(join(tmpdir(), "arki-memory-outbox-"));
    const file = join(directory, "outbox.sqlite");
    try {
      const firstDb = new DatabaseSync(file);
      const firstStore = createContinuityOutboxStore(firstDb);
      firstStore.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      firstDb.close();

      const secondDb = new DatabaseSync(file);
      try {
        const secondStore = createContinuityOutboxStore(secondDb);
        expect(secondStore.pending()).toHaveLength(1);
        expect(secondStore.pending()[0].event).toEqual(event());
      } finally { secondDb.close(); }
    } finally { await rm(directory, { recursive: true, force: true }); }
  });

  it("is idempotent for identical retries and rejects changed content", () => {
    const { db, store } = fixture();
    try {
      const first = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      const retry = store.enqueue({
        ownerId: 7,
        projectId: "ARKI",
        event: event({ recorded_at: "2026-10-30T11:00:00.000Z" }),
      });
      expect(retry.id).toBe(first.id);
      expect(store.pending()[0].event?.recorded_at).toBe("2026-10-30T10:00:00.000Z");
      expect(db.prepare("SELECT COUNT(*) AS count FROM arki_continuity_outbox").get()).toMatchObject({ count: 1 });
      expect(() => store.enqueue({
        ownerId: 7,
        projectId: "ARKI",
        event: event({ payload: { summary: "Changed content" } }),
      })).toThrow("CONTINUITY_IDEMPOTENCY_CONFLICT");
    } finally { db.close(); }
  });

  it("authenticates ownership and project metadata as AES-GCM associated data", () => {
    const { db, store } = fixture();
    try {
      store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      db.prepare("UPDATE arki_continuity_outbox SET project_id='OTHER'").run();
      const pending = store.pending();
      expect(pending).toHaveLength(1);
      expect(pending[0].event).toBeNull();
      expect(pending[0].decryptError).toBeTruthy();
    } finally { db.close(); }
  });

  it("records Core sequence, exposes per-event status and removes synced events from retry", () => {
    const { db, store } = fixture();
    try {
      const queued = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      store.markSynced(queued.id, 41);
      expect(store.event(7, "ARKI", queued.eventId)).toMatchObject({
        status: "SYNCED",
        coreSequence: 41,
        attempts: 0,
      });
      expect(store.status(7, "ARKI")).toEqual({ SYNCED: 1 });
      expect(store.pending()).toHaveLength(0);
    } finally { db.close(); }
  });

  it("keeps transient Core failures pending with exponential retry delay", () => {
    const { db, store } = fixture();
    try {
      const queued = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      for (let i = 0; i < 12; i++) store.recordFailure(queued.id, "CORE_UNAVAILABLE");
      expect(store.event(7, "ARKI", queued.eventId)).toMatchObject({
        status: "PENDING_SYNC",
        attempts: 12,
        lastError: "CORE_UNAVAILABLE",
      });
      expect(store.pending()).toHaveLength(0);
      const row = db.prepare("SELECT next_attempt_at FROM arki_continuity_outbox WHERE id=?").get(queued.id) as { next_attempt_at: string };
      expect(Date.parse(row.next_attempt_at)).toBeGreaterThan(Date.now());
    } finally { db.close(); }
  });

  it("blocks only explicitly permanent failures", () => {
    const { db, store } = fixture();
    try {
      const queued = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      store.recordFailure(queued.id, "CORE_IDEMPOTENCY_CONFLICT", true);
      expect(store.event(7, "ARKI", queued.eventId)).toMatchObject({
        status: "BLOCKED",
        attempts: 1,
        lastError: "CORE_IDEMPOTENCY_CONFLICT",
      });
      expect(store.pending()).toHaveLength(0);
    } finally { db.close(); }
  });
});
