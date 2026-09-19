import { describe, expect, it } from "vitest";
import { evaluateRestaurantV3, validateRestaurantV3Evaluation } from "./arkiRestaurantV3Evaluation";

describe("ARKI v3 restaurant evaluation", () => {
  it("satisfies the declared 500-seat dining capability", () => {
    const evaluation = evaluateRestaurantV3();
    const result = validateRestaurantV3Evaluation(evaluation);
    expect(result.typologyPass).toBe(true);
    expect(result.capacityCapabilityPass).toBe(true);
    expect(evaluation.capabilities.find((item) => item.capabilityId === "CAP-RESTAURANT-DINING")?.capacity?.value).toBe(500);
  });

  it("recognizes independent goods/service flows rather than one generic corridor", () => {
    const evaluation = evaluateRestaurantV3();
    const result = validateRestaurantV3Evaluation(evaluation);
    expect(result.serviceFlowPass).toBe(true);
    expect(evaluation.flowSegments.find((item) => item.id === "FLOW-RESTAURANT-GOODS")?.separation).toBe("PHYSICALLY_SEPARATED");
    expect(evaluation.flowSegments).toHaveLength(5);
  });

  it("preserves an operational deficit instead of reporting a false complete result", () => {
    const evaluation = evaluateRestaurantV3();
    const result = validateRestaurantV3Evaluation(evaluation);
    expect(result.deficitPreserved).toBe(true);
    expect(evaluation.status).toBe("PARTIAL");
    expect(result.noPermitClaim).toBe(true);
    expect(result.humanReviewRequired).toBe(true);
  });

  it("evaluates multidimensional relationships and protected emergency flow", () => {
    const evaluation = evaluateRestaurantV3();
    const result = validateRestaurantV3Evaluation(evaluation);
    expect(result.multidimensionalRelationshipPass).toBe(true);
    expect(result.emergencyFlowPass).toBe(true);
    expect(evaluation.relationships[0].dimensions).toContain("HYGIENE");
  });
});
