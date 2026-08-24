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


describe("canonical comparison collections", () => {
  it("does not merge comparisons and multi-comparisons", async () => {
    const { parseSnapshot } = await import("./siclCore");
    const snapshot = parseSnapshot(JSON.stringify({ comparisons: { "CMP-1": { comparison_id: "CMP-1" } }, multi_comparisons: { "MCMP-1": { comparison_id: "MCMP-1" } } }));
    expect(snapshot.comparisons.map((item) => item.id)).toEqual(["CMP-1"]);
    expect(snapshot.multiComparisons.map((item) => item.id)).toEqual(["MCMP-1"]);
  });
});

describe("hierarchical SICL scopes", () => {
  it("normalizes spatial scale and temporal horizon without changing analytical collections", async () => {
    const { parseSnapshot } = await import("./siclCore");
    const snapshot = parseSnapshot(JSON.stringify({ spatial_scope: { scale: "CITY", id: "CITY-TRUJILLO", name: "Trujillo" }, temporal_scope: { horizon: "2040", scenario: "compact-growth" }, alternatives: { "ALT-A": { alternative_id: "ALT-A", name: "Scheme A" } } }));
    expect(snapshot.spatialScope).toEqual({ scale: "CITY", id: "CITY-TRUJILLO", name: "Trujillo" });
    expect(snapshot.temporalScope).toEqual({ horizon: "2040", scenario: "compact-growth" });
    expect(snapshot.alternatives).toHaveLength(1);
  });

  it("normalizes scopes nested inside the canonical CoreProject", async () => {
    const { parseSnapshot } = await import("./siclCore");
    const snapshot = parseSnapshot(JSON.stringify({ project: { spatial_scope: { scale: "MACROREGION", id: "MR-01", name: "Andes" }, temporal_scope: { horizon: "2030" } }, alternatives: { "ALT-A": { alternative_id: "ALT-A", name: "Scheme A" } } }));
    expect(snapshot.spatialScope).toMatchObject({ scale: "MACROREGION", id: "MR-01" });
    expect(snapshot.temporalScope).toEqual({ horizon: "2030" });
    expect(snapshot.alternatives).toHaveLength(1);
  });

  it("keeps historical snapshots valid when scopes are absent or invalid", async () => {
    const { parseSnapshot } = await import("./siclCore");
    const snapshot = parseSnapshot(JSON.stringify({ objectives: [], spatial_scope: { scale: "UNKNOWN", id: "x", name: "x" }, temporal_scope: { horizon: "2099" } }));
    expect(snapshot.spatialScope).toBeUndefined();
    expect(snapshot.temporalScope).toBeUndefined();
    expect(snapshot.objectives).toEqual([]);
  });
});


describe("explicit analytical records", () => {
  const analyticalSnapshot = () => {
    const snapshot = emptySnapshot();
    snapshot.requirements.push({ id: "REQ-1", name: "Access" });
    snapshot.objectives.push({ id: "OBJ-1", name: "Daylight", requirementId: "REQ-1", direction: "MAXIMIZE" });
    snapshot.alternatives.push({ id: "ALT-A", name: "Scheme A" }, { id: "ALT-B", name: "Scheme B" });
    return snapshot;
  };

  it("requires explicit Evaluation references, method, inputs and provenance", () => {
    const snapshot = analyticalSnapshot();
    const evaluation = { id: "EVAL-A", name: "Evaluation A", alternativeId: "ALT-A", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 650, unit: "lux", method: "site_measurement", inputs: [{ sensor_id: "S-07" }], provenance: ["SRC-001", "EVD-004"] };
    const next = appendRecord(snapshot, "evaluations", evaluation, actorEvent("EVALUATION", evaluation.id, 1));
    expect(next.evaluations[0]).toMatchObject({ id: "EVAL-A", feasibilityStatus: "UNKNOWN" });
    expect(next.decisions).toHaveLength(0);
    expect(next.recommendations).toHaveLength(0);
  });

  it("rejects a Comparison without explicit direction or valid evaluation references", () => {
    const snapshot = analyticalSnapshot();
    snapshot.evaluations.push({ id: "EVAL-A", name: "Evaluation A", alternativeId: "ALT-A", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 650, unit: "lux", method: "site_measurement" }, { id: "EVAL-B", name: "Evaluation B", alternativeId: "ALT-B", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 540, unit: "lux", method: "site_measurement" });
    expect(() => appendRecord(snapshot, "comparisons", { id: "CMP-1", name: "Comparison", objectiveId: "OBJ-1", comparisonKind: "BINARY", evaluationIds: ["EVAL-A", "missing"], direction: "MAXIMIZE", feasibilityStatus: "UNKNOWN" }, actorEvent("COMPARISON", "CMP-1", 1))).toThrow("evaluationId does not exist");
    expect(() => appendRecord(snapshot, "comparisons", { id: "CMP-2", name: "Comparison", objectiveId: "OBJ-1", comparisonKind: "BINARY", evaluationIds: ["EVAL-A", "EVAL-B"] }, actorEvent("COMPARISON", "CMP-2", 1))).toThrow("direction must be explicit");
    expect(() => appendRecord(snapshot, "comparisons", { id: "CMP-3", name: "Comparison", objectiveId: "OBJ-1", comparisonKind: "BINARY", evaluationIds: ["EVAL-A", "EVAL-B"], direction: "MAXIMIZE" }, actorEvent("COMPARISON", "CMP-3", 1))).toThrow("feasibilityStatus must be explicit");
    expect(() => appendRecord(snapshot, "comparisons", { id: "CMP-4", name: "Comparison", objectiveId: "OBJ-1", comparisonKind: "BINARY", evaluationIds: ["EVAL-A", "EVAL-B"], direction: "MAXIMIZE", feasibilityStatus: "INVALID" as never }, actorEvent("COMPARISON", "CMP-4", 1))).toThrow("feasibilityStatus is invalid");
  });

  it("keeps binary and multi-criteria comparisons separate and explicit", () => {
    const snapshot = analyticalSnapshot();
    snapshot.evaluations.push({ id: "EVAL-A", name: "Evaluation A", alternativeId: "ALT-A", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 650, unit: "lux", method: "site_measurement" }, { id: "EVAL-B", name: "Evaluation B", alternativeId: "ALT-B", objectiveId: "OBJ-1", criterion: "daylight_lux", value: 540, unit: "lux", method: "site_measurement" });
    const binary = appendRecord(snapshot, "comparisons", { id: "CMP-1", name: "Binary comparison", objectiveId: "OBJ-1", comparisonKind: "BINARY", evaluationIds: ["EVAL-A", "EVAL-B"], direction: "MAXIMIZE", feasibilityStatus: "INSUFFICIENT_DATA" }, actorEvent("COMPARISON", "CMP-1", 1));
    const multi = appendRecord(binary, "multiComparisons", { id: "MCMP-1", name: "Multi comparison", objectiveId: "OBJ-1", comparisonKind: "MULTI_CRITERIA", evaluationIds: ["EVAL-A", "EVAL-B"], direction: "MAXIMIZE", feasibilityStatus: "UNKNOWN" }, actorEvent("MULTI_COMPARISON", "MCMP-1", 1));
    expect(multi.comparisons.map((item) => item.id)).toEqual(["CMP-1"]);
    expect(multi.multiComparisons.map((item) => item.id)).toEqual(["MCMP-1"]);
    expect(multi.recommendations).toHaveLength(0);
  });
});


describe("explicit preferences", () => {
  it("requires a justification and preserves preference semantics", () => {
    const snapshot = emptySnapshot();
    expect(() => appendRecord(snapshot, "preferences", { id: "PREF-1", name: "Public access" }, actorEvent("PREFERENCE", "PREF-1", 1))).toThrow("justification");
    const next = appendRecord(snapshot, "preferences", { id: "PREF-1", name: "Public access", preferenceStrength: "SOFT", scope: "PROJECT", justification: "Supports the intended public program" }, actorEvent("PREFERENCE", "PREF-1", 1));
    expect(next.preferences[0]).toMatchObject({ id: "PREF-1", preferenceStrength: "SOFT", scope: "PROJECT" });
    expect(next.constraints).toHaveLength(0);
    expect(next.events).toHaveLength(1);
  });

  it("rejects an unrecognized preference strength", () => {
    expect(() => appendRecord(emptySnapshot(), "preferences", { id: "PREF-2", name: "Daylight", preferenceStrength: "MANDATORY" as never, justification: "Supports user comfort" }, actorEvent("PREFERENCE", "PREF-2", 1))).toThrow("Preference strength is invalid");
  });
});


describe("preference snapshot compatibility", () => {
  it("preserves preferences from a canonical collection", async () => {
    const { parseSnapshot } = await import("./siclCore");
    const snapshot = parseSnapshot(JSON.stringify({ preferences: { "PREF-1": { id: "PREF-1", name: "Public access", justification: "Supports the program", preference_strength: "SOFT" } } }));
    expect(snapshot.preferences).toHaveLength(1);
    expect(snapshot.preferences[0]).toMatchObject({ id: "PREF-1", name: "Public access" });
  });
});
