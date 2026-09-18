import { describe, expect, it } from "vitest";
import { A26_TYPOLOGIES, A26_ZAHA_PRECEDENTS, evaluateAestheticAndExcellence, evaluateZahaCrazyCase, selectSustainableMaterial } from "./a26SustainableArchitecturalEvaluation";
import type { A24FloorPlanAlternative } from "./a24IntelligentFloorplan";

const plan: A24FloorPlanAlternative = { floorPlanAlternativeId: "a24-floorplan:UPAO-001-A:crazy", projectId: "UPAO-001", alternativeId: "UPAO-001-A", profile: "CRAZY", levelIds: ["N1", "N2"], shapeFamilies: ["RULED_SURFACE", "HYPERBOLIC_PROFILE"], shapeParameters: { ruledSurfaceTwist: 0.22, hyperbolicCurvature: 0.16 }, spaces: [{ spaceId: "HALL-01", programId: "HALL", levelId: "N1", zoneId: "public", footprint: { minX: 1, minY: 1, maxX: 8, maxY: 6 }, adjacentTo: [], separatedFrom: [], coreAccess: ["CORE-N1-N2"], provenance: ["A24"] }], cores: [{ coreId: "CORE-N1-N2", coreType: "STAIR_AND_ELEVATOR", levelIds: ["N1", "N2"], footprint: { minX: 10, minY: 6, maxX: 14, maxY: 10 }, continuityState: "CONTINUOUS", provenance: ["A22"] }], unresolvedRequirements: [], conflicts: [], constructabilityState: "CONTROLLED_HYPOTHESIS", validationState: "SUPPORTED", humanReviewRequired: true, noAutomaticDecision: true, noAutomaticWinner: true, provenance: ["A24"] };

describe("A26 sustainable architectural evaluation", () => {
  it("covers the requested typologies including hospital, prison, airport, terminal and university", () => {
    const ids = A26_TYPOLOGIES.map((item) => item.id);
    expect(ids).toEqual(expect.arrayContaining(["HOSPITAL", "PRISON", "AIRPORT", "BUS_TERMINAL", "EDUCATION_UNIVERSITY", "COMMERCIAL", "RECREATIONAL"]));
  });

  it("selects material candidates without pretending to produce a bid or LCA", () => {
    const result = selectSustainableMaterial("EDUCATION_UNIVERSITY", 1000, { budgetUsd: 250000, carbonTargetKgCo2e: 120000 });
    expect(result.candidates.length).toBeGreaterThan(0);
    expect(result.selectedMaterialId).toBeDefined();
    expect(result.requiresHumanReview).toBe(true);
    expect(result.costIsNotBid).toBe(true);
    expect(result.carbonIsNotLca).toBe(true);
  });

  it("keeps beauty, ugliness and excellence as human judgment", () => {
    const result = evaluateAestheticAndExcellence(plan, { typology: "CULTURAL", areaM2: 1000, estimatedCostUsd: 250000 });
    expect(result.beauty.state).toBe("HUMAN_JUDGMENT_REQUIRED");
    expect(result.ugliness.state).toBe("HUMAN_JUDGMENT_REQUIRED");
    expect(result.excellence.state).toBe("HUMAN_JUDGMENT_REQUIRED");
    expect(result.affordability.costBand).toBe("REASONABLE");
    expect(result.noAutomaticWinner).toBe(true);
  });

  it("evaluates a Zaha-inspired CRAZY case as a hypothesis, not a certification", () => {
    const result = evaluateZahaCrazyCase(plan, { areaM2: 1000, estimatedCostUsd: 250000, budgetUsd: 250000 });
    expect(A26_ZAHA_PRECEDENTS.length).toBe(3);
    expect(result.precedentRefs).toContain("ZAHA-VITRA-FIRE-STATION");
    expect(result.structuralReading.state).toBe("PARTIAL");
    expect(result.structuralReading.unresolved).toContain("load path");
    expect(result.materialSelection.selectedMaterialId).toBeDefined();
    expect(result.finalState).toBe("PARTIAL");
    expect(result.humanReviewRequired).toBe(true);
  });
});
