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
