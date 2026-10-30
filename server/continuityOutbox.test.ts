import { afterEach, describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import { randomBytes } from "node:crypto";
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
  process.env.ARKI_CONTINUITY_ENCRYPTION_KEY = key;
  const db = new DatabaseSync(":memory:");
  const store = createContinuityOutboxStore(db);
  return { db, store };
}

afterEach(() => {
  if (originalKey === undefined) delete process.env.ARKI_CONTINUITY_ENCRYPTION_KEY;
  else process.env.ARKI_CONTINUITY_ENCRYPTION_KEY = originalKey;
});

describe("ARKI MEMORY SQLite continuity outbox", () => {
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

  it("is idempotent for identical retries and rejects changed content", () => {
    const { db, store } = fixture();
    try {
      const first = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      const retry = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      expect(retry.id).toBe(first.id);
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

  it("blocks poison events after bounded retries", () => {
    const { db, store } = fixture();
    try {
      const queued = store.enqueue({ ownerId: 7, projectId: "ARKI", event: event() });
      for (let i = 0; i < 12; i++) store.recordFailure(queued.id, "CORE_UNAVAILABLE");
      expect(store.event(7, "ARKI", queued.eventId)).toMatchObject({
        status: "BLOCKED",
        attempts: 12,
        lastError: "CORE_UNAVAILABLE",
      });
      expect(store.pending()).toHaveLength(0);
    } finally { db.close(); }
  });
});
