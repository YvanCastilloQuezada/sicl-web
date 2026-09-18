import { describe, expect, it } from "vitest";
import { buildHospitalMasterCase, assessFireRoute, assessUniversalAccessRoute, A27_NORMATIVE_PROFILES } from "./a27UniversalAccessFireSafety";
import { selectSustainableMaterial } from "./a26SustainableArchitecturalEvaluation";
import type { A24FloorPlanAlternative } from "./a24IntelligentFloorplan";
import type { CirculationEvidenceGraph } from "./circulationEvidenceGraph";

const graph: CirculationEvidenceGraph = { graphId: "g:hospital", alternativeId: "HOSP-A", representationId: "rep:hospital", nodes: [{ id: "ED", kind: "SPACE", level: 1, state: "OBSERVED", evidenceRefs: ["fixture"] }, { id: "EXIT-N1", kind: "DESTINATION", level: 1, state: "OBSERVED", evidenceRefs: ["fixture"] }, { id: "ICU-N2", kind: "SPACE", level: 2, state: "OBSERVED", evidenceRefs: ["fixture"] }, { id: "ELEVATOR", kind: "CIRCULATION", level: 1, state: "OBSERVED", evidenceRefs: ["fixture"] }], edges: [{ id: "ED-ELEVATOR", from: "ED", to: "ELEVATOR", relation: "CONNECTS", state: "OBSERVED", evidenceRefs: ["fixture"] }, { id: "ELEVATOR-EXIT", from: "ELEVATOR", to: "EXIT-N1", relation: "CONNECTS", state: "OBSERVED", evidenceRefs: ["fixture"] }], continuity: "OBSERVED", loop: "UNKNOWN", spine: "OBSERVED", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: ["A27 fixture"], readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true };
const plan: A24FloorPlanAlternative = { floorPlanAlternativeId: "hospital-master", projectId: "HOSPITAL-001", alternativeId: "HOSP-A", profile: "MASTER", levelIds: ["N1", "N2"], shapeFamilies: ["HYBRID"], shapeParameters: { courtyard: 1 }, spaces: [], cores: [{ coreId: "VERTICAL-CORE", coreType: "STAIR_AND_ELEVATOR", levelIds: ["N1", "N2"], footprint: { minX: 0, minY: 0, maxX: 5, maxY: 5 }, continuityState: "CONTINUOUS", provenance: ["A22"] }], unresolvedRequirements: [], conflicts: [], constructabilityState: "CONCEPTUAL", validationState: "SUPPORTED", humanReviewRequired: true, noAutomaticDecision: true, noAutomaticWinner: true, provenance: ["A27 fixture"] };

describe("A27 universal access and fire safety", () => {
  it("uses ADA and Peru profiles as versioned profiles, not as automatic approvals", () => {
    expect(A27_NORMATIVE_PROFILES.ADA_2010.ruleVersion).toContain("2010");
    expect(A27_NORMATIVE_PROFILES.PERU_RNE_A120.jurisdictionRef).toBe("PE-RNE");
  });

  it("assesses an observed accessible route and keeps compliance unassessed", () => {
    const result = assessUniversalAccessRoute(graph, { routeId: "ACCESS-ED-EXIT", originNodeId: "ED", destinationNodeId: "EXIT-N1", edgeIds: ["ED-ELEVATOR", "ELEVATOR-EXIT"], profile: A27_NORMATIVE_PROFILES.PERU_RNE_A120, measurements: { "ED-ELEVATOR": { clearWidth: 1.2, slope: 0, turningRadius: 1.6, levelChange: 0, evidenceRefs: ["survey"] }, "ELEVATOR-EXIT": { clearWidth: 1.2, slope: 0, turningRadius: 1.6, levelChange: 0, evidenceRefs: ["survey"] } }, humanReviewState: "PENDING_HUMAN_REVIEW" });
    expect(result.routeObserved).toBe(true);
    expect(result.complianceStatus).toBe("NOT_ASSESSED");
    expect(result.noAutomaticApproval).toBe(true);
  });

  it("detects a fire route without redundancy and does not certify evacuation", () => {
    const result = assessFireRoute(graph, { routeId: "FIRE-ED-EXIT", originNodeId: "ED", exitNodeId: "EXIT-N1", edgeIds: ["ED-ELEVATOR", "ELEVATOR-EXIT"], travelDistanceM: 60, occupantLoad: 40, exitsAvailable: 1, fireRatingMinutes: 60, evidenceRefs: ["fire-fixture"] }, { maximumTravelDistanceM: 45, requiredFireRatingMinutes: 120 });
    expect(result.reachable).toBe(true);
    expect(result.conflicts).toContain("TRAVEL_DISTANCE_EXCEEDS_PROFILE");
    expect(result.conflicts).toContain("EXIT_REDUNDANCY_NOT_ESTABLISHED");
    expect(result.noAutomaticEvacuationCertification).toBe(true);
  });

  it("builds a complex hospital MASTER case with low-carbon material candidates", () => {
    const result = buildHospitalMasterCase({ plan, graph, materialSelection: selectSustainableMaterial("HOSPITAL", 5000, { budgetUsd: 1200000, carbonTargetKgCo2e: 1500000 }), accessibilityRoutes: [{ routeId: "ACCESS-ED-EXIT", originNodeId: "ED", destinationNodeId: "EXIT-N1", edgeIds: ["ED-ELEVATOR", "ELEVATOR-EXIT"], profile: A27_NORMATIVE_PROFILES.PERU_RNE_A120, measurements: { "ED-ELEVATOR": { clearWidth: 1.2, slope: 0, turningRadius: 1.6, levelChange: 0, evidenceRefs: ["survey"] }, "ELEVATOR-EXIT": { clearWidth: 1.2, slope: 0, turningRadius: 1.6, levelChange: 0, evidenceRefs: ["survey"] } }, humanReviewState: "PENDING_HUMAN_REVIEW" }], fireRoutes: [{ routeId: "FIRE-ICU-EXIT", originNodeId: "ICU-N2", exitNodeId: "EXIT-N1", edgeIds: ["ED-ELEVATOR", "ELEVATOR-EXIT"], travelDistanceM: 40, occupantLoad: 20, exitsAvailable: 2, fireRatingMinutes: 120, evidenceRefs: ["fire-fixture"] }] });
    expect(result.profile).toBe("MASTER");
    expect(result.typology).toBe("HOSPITAL");
    expect(result.units.map((unit) => unit.unitId)).toEqual(expect.arrayContaining(["ED", "ICU", "SURGERY"]));
    expect(result.materialSelection.candidates.length).toBeGreaterThan(0);
    expect(result.humanReviewRequired).toBe(true);
    expect(result.noAutomaticWinner).toBe(true);
  });
});
