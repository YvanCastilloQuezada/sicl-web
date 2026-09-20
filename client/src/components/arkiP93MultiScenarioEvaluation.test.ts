import { describe, expect, it } from "vitest";
import { buildProjectBGeometricVariants } from "./arkiP9ProjectBGeometry";
import { evaluateProjectBP93, validateP93Evaluation } from "./arkiP93MultiScenarioEvaluation";

describe("P9.3 multi-scenario adversarial evaluation", () => {
  it("evaluates both frozen candidates across the same four scenarios", () => {
    const variants = buildProjectBGeometricVariants();
    const before = JSON.stringify(variants);
    const result = evaluateProjectBP93(variants);
    expect(result.cells).toHaveLength(8);
    expect(result.cells.filter((cell) => cell.scenario === "S3_EMERGENCY_SAFE_EXIT")).toHaveLength(2);
    expect(JSON.stringify(variants)).toBe(before);
    expect(validateP93Evaluation(result, variants)).toBe(true);
  });

  it("does not encode an answer key or scalar winner", () => {
    const result = evaluateProjectBP93();
    expect(result.automaticWinner).toBe("NONE");
    expect(result.automaticRecommendation).toBe("NONE");
    expect(result.dominance).toBe("INCOMPARABLE_DUE_TO_UNKNOWN");
    expect(result.learningCandidate).toBe("NONE");
    expect(result.k1).toBe("NOT_CREATED");
  });
});
