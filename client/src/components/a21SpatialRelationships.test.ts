import { describe, expect, it } from "vitest";
import { detectAdjacencyConflicts, deriveAdjacencyRequirements, proposeFunctionalZones, validateA21SpatialModel, validateCirculationIntent, type CirculationIntent } from "./a21SpatialRelationships";
import type { CirculationEvidenceGraph } from "./circulationEvidenceGraph";

const graph: CirculationEvidenceGraph = { graphId: "circulation-evidence:A", alternativeId: "A", representationId: "rep-A", nodes: [{ id: "ENTRY", kind: "ACCESS", state: "OBSERVED", evidenceRefs: ["fixture"] }, { id: "SOCIAL", kind: "DESTINATION", state: "OBSERVED", evidenceRefs: ["fixture"] }, { id: "PRIVATE", kind: "DESTINATION", state: "UNVERIFIED", evidenceRefs: ["fixture"] }], edges: [{ id: "ENTRY->SOCIAL", from: "ENTRY", to: "SOCIAL", relation: "DESTINATION_OF", state: "OBSERVED", evidenceRefs: ["fixture"] }], continuity: "OBSERVED", loop: "UNKNOWN", spine: "UNKNOWN", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: ["A20-P1 fixture"], readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true };
const intent: CirculationIntent = { circulationIntentId: "intent-entry-social", originProgramId: "ENTRY", destinationProgramId: "SOCIAL", sequence: ["ENTRY", "SOCIAL"], routeType: "ACCESS_INTENT", priority: "MUST", requiredContinuity: true, rationale: "Entry should lead to social zone.", provenance: ["HUMAN_INPUT"], epistemicState: "HUMAN_CONFIRMED", status: "HUMAN_CONFIRMED" };

describe("A21 spatial relationships and CirculationIntent", () => {
  it("preserves required/preferred relations and detects contradictory requirements", () => {
    const requirements = deriveAdjacencyRequirements([{ programId: "SOCIAL", name: "Social", provenance: ["fixture"] }, { programId: "PRIVATE", name: "Private", provenance: ["fixture"] }], [{ sourceProgramId: "SOCIAL", targetProgramId: "PRIVATE", relationType: "REQUIRED_ADJACENCY", priority: "MUST", source: "HUMAN_INPUT" }, { sourceProgramId: "SOCIAL", targetProgramId: "PRIVATE", relationType: "REQUIRED_SEPARATION", priority: "MUST", source: "HUMAN_INPUT" }]);
    expect(requirements[0].epistemicState).toBe("AI_PROPOSED");
    expect(detectAdjacencyConflicts(requirements)).toEqual(["a21-adjacency-1|a21-adjacency-2", "a21-adjacency-2|a21-adjacency-1"]);
  });

  it("proposes zones without creating geometry or a decision", () => {
    const requirements = deriveAdjacencyRequirements([{ programId: "SOCIAL", name: "Social", zoneType: "PUBLIC", provenance: ["fixture"] }, { programId: "PRIVATE", name: "Private", zoneType: "PRIVATE", provenance: ["fixture"] }], []);
    const zones = proposeFunctionalZones([{ programId: "SOCIAL", name: "Social", zoneType: "PUBLIC", provenance: ["fixture"] }, { programId: "PRIVATE", name: "Private", zoneType: "PRIVATE", provenance: ["fixture"] }], requirements);
    expect(zones.map((zone) => zone.zoneType)).toEqual(["PUBLIC", "PRIVATE"]);
    expect(zones.every((zone) => zone.status === "PROPOSED" && zone.noGeometryMutation && zone.noDecision)).toBe(true);
    expect(validateA21SpatialModel(zones, requirements)).toBe(true);
  });

  it("classifies a CirculationIntent as OBSERVED when A20-P1 covers the sequence", () => {
    const result = validateCirculationIntent(intent, graph);
    expect(result.state).toBe("OBSERVED");
    expect(result.observedEdgeIds).toEqual(["ENTRY->SOCIAL"]);
    expect(result.accessibleRoute).toBe("NOT_ASSESSED");
    expect(result.compliance).toBe("NOT_ASSESSED");
    expect(result.humanReviewRequired).toBe(true);
  });

  it("classifies missing/private evidence as OBSERVED_PARTIAL or UNVERIFIED, never as success", () => {
    const privateIntent: CirculationIntent = { ...intent, circulationIntentId: "intent-entry-private", destinationProgramId: "PRIVATE", sequence: ["ENTRY", "PRIVATE"] };
    const result = validateCirculationIntent(privateIntent, graph);
    expect(["OBSERVED_PARTIAL", "UNVERIFIED"]).toContain(result.state);
    expect(result.missingEvidence).toContain("CONTINUITY_EVIDENCE");
    expect(result.noAutomaticRepair).toBe(true);
  });

  it("preserves explicit conflicting intent as CONFLICTING", () => {
    const result = validateCirculationIntent({ ...intent, epistemicState: "CONFLICTING" }, graph);
    expect(result.state).toBe("CONFLICTING");
    expect(result.contradictions).toContain("INTENT_MARKED_CONFLICTING");
  });
});
