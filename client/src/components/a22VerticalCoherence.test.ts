import { describe, expect, it } from "vitest";
import { assessMassAlignment, buildVerticalRelationGraph, createMassStack, validateA22VerticalModel, type A22Level, type A22MassMember, type A22VerticalRelation } from "./a22VerticalCoherence";

const footprint = (minX: number, minY: number): A22MassMember["footprint"] => ({ coordinates: [[minX, minY], [minX + 10, minY], [minX + 10, minY + 8], [minX, minY + 8]], units: "m", coordinateFrame: "SITE-LOCAL", orientation: 0 });
const levels: A22Level[] = [
  { levelId: "N1", projectId: "UPAO-001", alternativeId: "UPAO-001-A", levelIndex: 1, levelLabel: "Ground", levelRole: "GROUND", provenance: ["fixture:N1"], epistemicState: "OBSERVED_GEOMETRY", status: "OBSERVED" },
  { levelId: "N2", projectId: "UPAO-001", alternativeId: "UPAO-001-A", levelIndex: 2, levelLabel: "Upper", levelRole: "UPPER", provenance: ["fixture:N2"], epistemicState: "OBSERVED_GEOMETRY", status: "OBSERVED" },
];
const relation = (overrides: Partial<A22VerticalRelation> = {}): A22VerticalRelation => ({ verticalRelationId: "VR-01", alternativeId: "UPAO-001-A", fromLevelId: "N2", fromElementId: "MASS-N2", toLevelId: "N1", toElementId: "MASS-N1", relationType: "STACKS_ABOVE", alignmentMode: "UNKNOWN", supportMode: "UNKNOWN", continuityMode: "UNKNOWN", priority: "MUST", requiredEvidence: ["A22 fixture"], provenance: ["fixture:vertical-relation"], epistemicState: "AI_PROPOSED", status: "PROPOSED", ...overrides });

describe("A22 vertical coherence and mass alignment", () => {
  it("detects displaced unjustified upper floor as CONFLICTING", () => {
    const members: A22MassMember[] = [{ levelId: "N1", massElementId: "MASS-N1", footprint: footprint(0, 0), sourceRepresentationId: "rep-A-N1", provenance: ["fixture:N1"] }, { levelId: "N2", massElementId: "MASS-N2", footprint: footprint(30, 30), sourceRepresentationId: "rep-A-N2", provenance: ["fixture:N2"] }];
    const stack = createMassStack("UPAO-001-A", "MAIN-MASS", members);
    const assessment = assessMassAlignment(stack, levels, [relation()]);
    expect(assessment.state).toBe("CONFLICTING");
    expect(assessment.massAlignment).toBe("CONFLICTING");
    expect(assessment.setbackState).toBe("OFFSET_UNJUSTIFIED");
    expect(assessment.overhangState).toBe("OVERHANG_UNEXPLAINED");
    expect(assessment.humanReviewRequired).toBe(true);
    expect(assessment.noAutomaticCorrection).toBe(true);
    expect(assessment.openQuestions).toContain("ARCHITECTURAL_REASON_FOR_OFFSET");
  });

  it("accepts a contained upper floor as coherent without claiming structural validity", () => {
    const members: A22MassMember[] = [{ levelId: "N1", massElementId: "MASS-N1", footprint: footprint(0, 0), provenance: ["fixture:N1"] }, { levelId: "N2", massElementId: "MASS-N2", footprint: footprint(0.05, 0.05), provenance: ["fixture:N2"] }];
    const assessment = assessMassAlignment(createMassStack("UPAO-001-A", "MAIN-MASS", members), levels, [relation()]);
    expect(assessment.state).toBe("COHERENT");
    expect(assessment.massContainment).toBe("SUPPORTED");
    expect(assessment.structuralValidation).toBe("NOT_ASSESSED");
  });

  it("accepts a justified setback as coherent with observations", () => {
    const members: A22MassMember[] = [{ levelId: "N1", massElementId: "MASS-N1", footprint: footprint(0, 0), provenance: ["fixture:N1"] }, { levelId: "N2", massElementId: "MASS-N2", footprint: footprint(2, 2), provenance: ["fixture:N2"] }];
    const assessment = assessMassAlignment(createMassStack("UPAO-001-A", "MAIN-MASS", members), levels, [relation({ relationType: "RETRACTS_FROM", alignmentMode: "OFFSET_JUSTIFIED", rationale: "terrace and solar response" })]);
    expect(assessment.state).toBe("COHERENT_WITH_OBSERVATIONS");
    expect(assessment.setbackState).toBe("SUPPORTED");
    expect(assessment.openQuestions).toEqual([]);
  });

  it("rejects relations across alternatives and validates graph provenance", () => {
    const cross = relation({ alternativeId: "UPAO-001-B" });
    const graph = buildVerticalRelationGraph(levels, [cross]);
    expect(graph).toHaveLength(0);
    expect(validateA22VerticalModel(levels, [createMassStack("UPAO-001-A", "MAIN-MASS", [{ levelId: "N1", massElementId: "MASS-N1", footprint: footprint(0, 0), provenance: ["fixture"] }])], [relation()])).toBe(true);
  });
});
