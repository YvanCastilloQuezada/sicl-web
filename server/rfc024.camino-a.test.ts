import { describe, expect, it } from "vitest";
import { analysisView, appendHumanDecision, appendHumanReview, appendRecord, emptySnapshot } from "./siclCore";

const event = (type: string, entityId: string, observedVersion: number) => ({
  id: `EV-${type}-${entityId}`,
  type,
  entityId,
  actorId: "human-demo",
  createdAt: "2026-09-16T22:00:00.000Z",
  data: { observedVersion },
});

describe("RFC-024 Camino A local/mock validation", () => {
  it("completes Project → Preference → Recommendation → HumanReview → Decision → Audit → Council", () => {
    let snapshot = { ...emptySnapshot(), spatialScope: { scale: "CITY", id: "CITY-TRUJILLO", name: "Trujillo" } as const, temporalScope: { horizon: "2040", scenario: "compact-growth" } };
    snapshot = appendRecord(snapshot, "preferences", { id: "MOCK-PREFERENCE-024", name: "Public access", preferenceStrength: "SOFT", scope: "PROJECT", justification: "Maintain equitable access" }, event("PREFERENCE_RECORDED", "MOCK-PREFERENCE-024", 1));
    snapshot.alternatives.push({ id: "MOCK-ALT-A", name: "Compact mixed-use scheme" });
    snapshot = appendRecord(snapshot, "recommendations", { id: "MOCK-REC-024", name: "Compact scheme recommendation", alternativeId: "MOCK-ALT-A", recommendationVersion: 1, rationale: "Best fit for the declared preference" }, event("RECOMMENDATION_RECORDED", "MOCK-REC-024", 2));

    expect(snapshot.decisions).toHaveLength(0);
    const reviewed = appendHumanReview(snapshot, { id: "MOCK-REVIEW-024", actorId: "human-demo", confirmationId: "MOCK-CONFIRM-024", observedVersion: 2, recommendationVersion: 1, reason: "Reviewed by the authorized human actor", status: "ACCEPTED" }, event("HUMAN_REVIEW_RECORDED", "MOCK-REVIEW-024", 2));
    expect(reviewed.humanReviews).toHaveLength(1);
    expect(reviewed.decisions).toHaveLength(0);

    const decided = appendHumanDecision(reviewed, { id: "MOCK-DECISION-024", actorId: "human-demo", authorityBasis: "PRODUCT_OWNER_DEMO", confirmationId: "MOCK-DECISION-CONFIRM-024", observedVersion: 3, rationale: "Human authority selects the reviewed alternative", decisionType: "HUMAN", selectedAlternativeId: "MOCK-ALT-A" }, event("DECISION_RECORDED", "MOCK-DECISION-024", 3));
    expect(decided.decisions).toHaveLength(1);
    expect(decided.decisions[0]).toMatchObject({ actorId: "human-demo", authorityBasis: "PRODUCT_OWNER_DEMO", selectedAlternativeId: "MOCK-ALT-A" });

    const audit = decided.events.map((item) => item.type);
    expect(audit).toEqual(["PREFERENCE_RECORDED", "RECOMMENDATION_RECORDED", "HUMAN_REVIEW_RECORDED", "DECISION_RECORDED"]);
    const council = analysisView(decided);
    expect(council).toMatchObject({ readOnly: true });
    expect(council).not.toHaveProperty("authorityBasis");
  });

  it("preserves Human Authority by rejecting a decision without a review", () => {
    const snapshot = { ...emptySnapshot(), alternatives: [{ id: "MOCK-ALT-A", name: "Scheme" }] };
    expect(() => appendHumanDecision(snapshot, { id: "MOCK-DECISION-BLOCKED", actorId: "human-demo", authorityBasis: "PRODUCT_OWNER_DEMO", confirmationId: "CONFIRM", observedVersion: 1, rationale: "Attempt without review", decisionType: "HUMAN", selectedAlternativeId: "MOCK-ALT-A" }, event("DECISION_RECORDED", "MOCK-DECISION-BLOCKED", 1))).toThrow("approved HumanReview");
  });
});
