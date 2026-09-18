import { describe, expect, it } from "vitest";
import { applyRevisionResult, authorizeRevision, prepareRevision, prepareSpaceGeometryRevision, supportedRevisionHypothesis, supportedSpaceGeometryRevisionHypothesis, unsupportedRevisionHypothesis, validateRevision } from "./arquiControlledRevision";
import type { ArchitecturalDesignReading } from "./arquiArchitecturalReading";
import type { ArchitecturalCritique } from "./arquiDesignCritic";

const reading = (id = "UPAO-001-C") => ({ alternativeId: id, sourceStrategyId: "strategy-c", sourcePartiId: "strategy-c", sourceOrganizationId: "org-c", sourceRealizationPlanId: "plan-c", observedElements: [], observedHierarchy: [], observedRelationships: [], observedMassVoid: { massCount: 2, footprintType: "multipolygon", centralVoid: "NOT_OBSERVED", status: "COMPUTED", basis: ["geometry"] }, observedAccess: { status: "UNKNOWN", basis: [] }, observedCirculation: { status: "UNKNOWN", elementIds: [], basis: [] }, observedVerticalOrganization: { status: "OBSERVED", floorCount: 3, height: 9.6, basis: ["metadata"] }, observedSiteRelationship: { status: "OBSERVED", position: "WITHIN_SITE", basis: ["geometry"] }, correspondence: [{ expected: "CIRCULATION_LOOP", status: "UNVERIFIABLE", observed: "not represented", basis: ["geometry"] }], transformations: [], missingExpectedElements: [], unverifiableElements: ["CIRCULATION_LOOP"], contradictions: [], provenance: ["A15"], epistemicStatus: "DERIVED", noCritique: true, noRecommendation: true, noMutation: true, noDecision: true }) as unknown as ArchitecturalDesignReading;
const critique = (kind: "UNRESOLVED" | "ALIGNED" = "UNRESOLVED") => ({ subjectAlternativeId: "UPAO-001-C", findings: [{ id: "a16-circulation-gap", subject: "RELATIONSHIP", category: "CIRCULATION", kind, observation: "circulation", basis: ["OBSERVED_GEOMETRY"], interpretation: "bounded", implication: "open", uncertainty: "unknown", severity: "ATTENTION", confidence: "HIGH", changeHypotheses: [], epistemicStatus: "DERIVED_CRITIQUE", provenance: ["A16"], noDecision: true, noRecommendation: true, noMutation: true }], hypotheses: [], tradeoffs: [], missingEvidence: [], noQualityScore: true, noWinner: true, noDecision: true, noAutonomousLoop: true, noGeometryMutation: true, provenance: ["A16"] }) as unknown as ArchitecturalCritique;

describe("A17 controlled revision loop", () => {
  it("does not prepare or execute without human selection", () => {
    const plan = prepareRevision(supportedRevisionHypothesis(), reading(), { mass_separation: 8 }, false);
    expect(plan.humanSelectionGate).toBe("NOT_SELECTED");
    expect(plan.executionState).toBe("NOT_SELECTED");
  });
  it("blocks unsupported CREATE_SPINE and preserves the hypothesis", () => {
    const plan = prepareRevision(unsupportedRevisionHypothesis(), reading(), {}, true);
    expect(plan.selectedHypothesis.capabilityStatus).toBe("UNSUPPORTED");
    expect(plan.executionState).toBe("BLOCKED");
    expect(plan.parameterProvenance).toEqual([]);
  });
  it("prepares a generic explicit-space replacement without inventing a room-specific operation", () => {
    const plan = prepareSpaceGeometryRevision(reading(), { space_id: "BEDROOM-01", program_item_id: "BEDROOM", geometry: { type: "polygon", coordinates: [[[0, 0], [5, 0], [5, 3], [0, 3], [0, 0]]] } }, true);
    expect(supportedSpaceGeometryRevisionHypothesis().candidateCapability).toBe("REPLACE_SPATIAL_REALIZATION");
    expect(plan.executionState).toBe("PREPARED");
    expect(plan.selectedHypothesis.target).toBe("EXPLICIT_SPATIAL_REALIZATION");
    expect(plan.parameters).toHaveProperty("replacement");
  });
  it("requires a traceable parameter and separates selection from authorization", () => {
    const plan = prepareRevision(supportedRevisionHypothesis(), reading(), { mass_separation: 8 }, true);
    expect(plan.humanSelectionGate).toBe("SELECTED");
    expect(plan.executionState).toBe("PREPARED");
    expect(authorizeRevision(plan, false).executionState).toBe("PREPARED");
    expect(authorizeRevision(plan, true).executionState).toBe("AUTHORIZED");
  });
  it("verifies actual post-change geometry and re-reads/re-critiques it", () => {
    const plan = authorizeRevision(prepareRevision(supportedRevisionHypothesis(), reading(), { mass_separation: 8 }, true), true);
    const after = applyRevisionResult(plan, { resultAlternative: "UPAO-001-C-revision-1", geometryChanged: true, postReading: reading("UPAO-001-C-revision-1"), postCritique: critique("ALIGNED") }, critique());
    expect(after.executionState).toBe("VERIFIED");
    expect(after.readback?.geometricChangeObserved).toBe(true);
    expect(after.reevaluation?.postReading.alternativeId).toBe("UPAO-001-C-revision-1");
    expect(after.reevaluation?.transitions.find((item) => item.findingId === "a16-circulation-gap")?.transition).toBe("RESOLVED");
    expect(validateRevision(after)).toBe(true);
  });
  it("rejects false success when execution response has no observed geometry change", () => {
    const plan = authorizeRevision(prepareRevision(supportedRevisionHypothesis(), reading(), { mass_separation: 8 }, true), true);
    const after = applyRevisionResult(plan, { resultAlternative: "UPAO-001-C", geometryChanged: false, postReading: reading(), postCritique: critique() }, critique());
    expect(after.executionState).toBe("BLOCKED");
    expect(after.readback?.geometricChangeObserved).toBe(false);
    expect(validateRevision(after)).toBe(false);
  });
});
