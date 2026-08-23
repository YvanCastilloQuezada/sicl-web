import { describe, expect, it } from "vitest";
import { analysisView, appendHumanDecision, appendHumanReview, appendRecord, emptySnapshot } from "./siclCore";

const actorEvent = (type: string, entityId: string, observedVersion: number) => ({
  id: `${type}-${entityId}`,
  type,
  entityId,
  actorId: 7,
  createdAt: "2026-08-23T00:00:00.000Z",
  data: { observedVersion },
});

describe("SICL web domain adapter", () => {
  it("rejects evidence without an existing source", () => {
    expect(() => appendRecord(emptySnapshot(), "evidence", { id: "E-1", statement: "Observed", sourceId: "missing" }, actorEvent("EVIDENCE", "E-1", 1))).toThrow("sourceId does not exist");
  });

  it("rejects objectives without explicit direction", () => {
    const snapshot = emptySnapshot();
    snapshot.requirements.push({ id: "REQ-1", name: "Access" });
    expect(() => appendRecord(snapshot, "objectives", { id: "OBJ-1", name: "Comfort", requirementId: "REQ-1" }, actorEvent("OBJECTIVE", "OBJ-1", 1))).toThrow("direction must be explicit");
  });

  it("returns an explicitly read-only Council view", () => {
    const view = analysisView(emptySnapshot());
    expect(view.readOnly).toBe(true);
    expect(view.finding).toBe("INSUFFICIENT_DATA");
    expect(view).not.toHaveProperty("actorId");
    expect(view).not.toHaveProperty("authorityBasis");
  });

  it("keeps human review and decision as separate append-only records", () => {
    const snapshot = emptySnapshot();
    snapshot.recommendations.push({ id: "REC-1", alternativeId: "ALT-A", recommendationVersion: 1 });
    const reviewed = appendHumanReview(snapshot, { id: "REV-1", actorId: "human-1", confirmationId: "CONF-1", observedVersion: 1, recommendationVersion: 1, reason: "Explicit review", status: "ACCEPTED" }, actorEvent("REVIEW", "REV-1", 1));
    expect(reviewed.decisions).toHaveLength(0);
    const decided = appendHumanDecision(reviewed, { id: "DEC-1", actorId: "human-1", authorityBasis: "PRODUCT_OWNER", confirmationId: "CONF-2", observedVersion: 1, rationale: "Human choice", decisionType: "HUMAN" }, actorEvent("DECISION", "DEC-1", 1));
    expect(decided.humanReviews).toHaveLength(1);
    expect(decided.decisions).toHaveLength(1);
  });
});

  it("normalizes canonical Python collections and preserves explicit versions", async () => {
    const { parseSnapshot } = await import("./siclCore");
    const snapshot = parseSnapshot(JSON.stringify({ recommendations: { "REC-1": { recommendation_id: "REC-1", based_on_kind: "MULTI_CRITERIA", entity_version: 3 } }, events: { "EV-1": { event_id: "EV-1", event_type: "RECOMMENDATION_RECORDED", entity_id: "REC-1" } } }));
    expect(snapshot.recommendations[0]).toMatchObject({ id: "REC-1", recommendationId: "REC-1", basedOnKind: "MULTI_CRITERIA", recommendationVersion: 3 });
    expect(snapshot.events[0]).toMatchObject({ id: "EV-1", type: "RECOMMENDATION_RECORDED", entityId: "REC-1" });
  });
