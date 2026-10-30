import test from "node:test";
import assert from "node:assert/strict";
import { buildProjection } from "./arki-memory-core-projection.mjs";

test("Core projection is deterministic for a fixed timestamp and redacts actor identifiers", () => {
  const checkpoint = { project_version: 4, last_event_id: 7, event_count: 1 };
  const events = [{
    sequence: 7,
    sha256: "a".repeat(64),
    event: {
      event_id: "evt-7",
      event_type: "DECISION_RECORDED",
      workstream_id: "MEMORY",
      occurred_at: "2026-10-30T10:00:00Z",
      recorded_at: "2026-10-30T10:00:00Z",
      actor: "private-owner-id",
      authority_ref: "OWNER_CONFIRMED",
      source_sha: null,
      evidence_refs: ["https://example.test/evidence"],
      payload: { decision: "Core is canonical", secret: "must-not-be-exported" },
    },
  }];
  const a = buildProjection("ARKI", checkpoint, events, "2026-10-30T10:01:00Z");
  const b = buildProjection("ARKI", checkpoint, events, "2026-10-30T10:01:00Z");
  assert.deepEqual(a, b);
  assert.equal(a.events[0].summary, "Core is canonical");
  assert.notEqual(a.events[0].actor_ref, "private-owner-id");
  assert.equal(JSON.stringify(a).includes("must-not-be-exported"), false);
  assert.match(a.markdown, /no captura transcripciones/);
});

test("Core projection preserves explicit event sequence and SHA evidence", () => {
  const projection = buildProjection("ARKI", { last_event_id: 9 }, [{
    sequence: 9,
    sha256: "b".repeat(64),
    event: { event_id: "evt-9", event_type: "TASK_BLOCKED", workstream_id: "M5", occurred_at: "2026-10-30T11:00:00Z", recorded_at: "2026-10-30T11:00:00Z", actor: "actor", payload: {} },
  }], "2026-10-30T11:01:00Z");
  assert.equal(projection.events[0].sequence, 9);
  assert.equal(projection.events[0].sha256, "b".repeat(64));
  assert.match(projection.markdown, /No se infiere ejecución/);
});
