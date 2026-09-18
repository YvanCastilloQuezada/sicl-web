import { describe, expect, it } from "vitest";
import { assessAccessibilityRoute, validateAccessibilityAssessment, type AccessibilityProfile } from "./accessibilityAssessment";
import { deriveCirculationEvidenceGraph } from "./circulationEvidenceGraph";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

function graph() {
  const representation: SpatialRepresentation = {
    id: "rep-access", alternative_id: "A", spatial_scope: "edificacion", representation_version: "S2", generator_version: "test", coordinate_system: "LOCAL", units: "m", input_fingerprint: "fixture", north_degrees: 0,
    elements: [{ id: "CIRC-01", element_type: "CirculationElement", geometry: { type: "polyline", coordinates: [[0, 0], [4, 0]] }, metadata: { access_point: "NORTH", connects_to: ["SPACE-01"] } }],
  };
  return deriveCirculationEvidenceGraph(representation);
}

const profile: AccessibilityProfile = { id: "profile-test", jurisdictionRef: "TEST-JURISDICTION", ruleVersion: "TEST-V1", clearWidthMinimum: 1.2, slopeMaximum: 0.08, sourceRefs: ["human-provided-test-profile"], humanReviewState: "CONFIRMED" };

describe("A20-P2 accessibility assessment", () => {
  it("returns INCOMPLETE when the graph or profile cannot support assessment", () => {
    const result = assessAccessibilityRoute(graph(), { routeId: "R-1", originNodeId: "CIRC-01:access", destinationNodeId: "SPACE-01", edgeIds: ["CIRC-01->SPACE-01"], measurements: {}, humanReviewState: "NOT_STARTED" });
    expect(result.status).toBe("INCOMPLETE");
    expect(result.missingInputs).toContain("ACCESSIBILITY_PROFILE");
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
    expect(validateAccessibilityAssessment(result)).toBe(true);
  });

  it("reports CONFLICTING_EVIDENCE without automatically rejecting or approving", () => {
    const result = assessAccessibilityRoute(graph(), { routeId: "R-1", originNodeId: "CIRC-01:access", destinationNodeId: "SPACE-01", edgeIds: ["CIRC-01->SPACE-01"], profile, measurements: { "CIRC-01->SPACE-01": { clearWidth: 0.9, slope: 0.12, evidenceRefs: ["measurement:e1"] } }, humanReviewState: "PENDING_HUMAN_REVIEW" });
    expect(result.status).toBe("CONFLICTING_EVIDENCE");
    expect(result.conflicts).toEqual(["CLEAR_WIDTH_BELOW_PROFILE:CIRC-01->SPACE-01", "SLOPE_ABOVE_PROFILE:CIRC-01->SPACE-01"]);
    expect(result.noAutomaticApproval).toBe(true);
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
  });

  it("keeps complete evidence pending human review", () => {
    const result = assessAccessibilityRoute(graph(), { routeId: "R-1", originNodeId: "CIRC-01:access", destinationNodeId: "SPACE-01", edgeIds: ["CIRC-01->SPACE-01"], profile, measurements: { "CIRC-01->SPACE-01": { clearWidth: 1.5, slope: 0.04, evidenceRefs: ["measurement:e2"] } }, humanReviewState: "PENDING_HUMAN_REVIEW" });
    expect(result.status).toBe("PENDING_HUMAN_REVIEW");
    expect(result.routeObserved).toBe(true);
    expect(result.missingInputs).toEqual([]);
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
  });

  it("rejects an unobserved destination edge as an assessable route", () => {
    const result = assessAccessibilityRoute(graph(), { routeId: "R-2", originNodeId: "CIRC-01:access", destinationNodeId: "SPACE-02", edgeIds: ["CIRC-01->SPACE-02"], profile, measurements: { "CIRC-01->SPACE-02": { clearWidth: 1.5, slope: 0.04, evidenceRefs: ["measurement:e3"] } }, humanReviewState: "PENDING_HUMAN_REVIEW" });
    expect(result.status).toBe("INCOMPLETE");
    expect(result.missingInputs).toContain("OBSERVED_ROUTE_GRAPH");
  });
});
