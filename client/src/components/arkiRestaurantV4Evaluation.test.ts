import { describe, expect, it } from "vitest";
import { compareRestaurantV3V4, evaluateRestaurantV4, validateRestaurantV4Evaluation } from "./arkiRestaurantV4Evaluation";

describe("ARKI v4 restaurant incremental evaluation", () => {
  it("evaluates the same project and alternative without replacing the geometry", () => {
    const evaluation = evaluateRestaurantV4();
    const result = validateRestaurantV4Evaluation(evaluation);
    expect(result.sameProject).toBe(true);
    expect(result.sameAlternative).toBe(true);
    expect(result.geometryPreserved).toBe(true);
    expect(result.activeTopologyDerived).toBe(true);
  });

  it("adds explicit scenarios and concurrent-demand analysis", () => {
    const evaluation = evaluateRestaurantV4();
    const comparison = compareRestaurantV3V4(evaluation);
    expect(comparison.v3FlowCount).toBe(5);
    expect(comparison.v4ScenarioCount).toBe(4);
    expect(comparison.v4ConcurrentDemandCount).toBe(2);
    expect(validateRestaurantV4Evaluation(evaluation).scenarioCoverageExpanded).toBe(true);
    expect(validateRestaurantV4Evaluation(evaluation).concurrencyEvaluated).toBe(true);
  });

  it("preserves unknown coverage and avoids overclaiming redundancy", () => {
    const evaluation = evaluateRestaurantV4();
    const result = validateRestaurantV4Evaluation(evaluation);
    expect(result.unknownCoveragePreserved).toBe(true);
    expect(result.redundancyNotOverclaimed).toBe(true);
    expect(result.wasteDeficitPreserved).toBe(true);
    expect(evaluation.status).toBe("PARTIAL");
  });

  it("reports the increment as explanatory and scenario coverage, not automatic geometric improvement", () => {
    const comparison = compareRestaurantV3V4();
    expect(comparison.increment).toBe("EXPLANATORY_AND_SCENARIO_COVERAGE");
    expect(comparison.geometryPreserved).toBe(true);
    expect(comparison.v3Status).toBe("PARTIAL");
    expect(comparison.v4Status).toBe("PARTIAL");
  });
});
