import { describe, expect, it } from "vitest";
import { buildProjectBGeometricVariants, validateProjectBGeometricVariants } from "./arkiP9ProjectBGeometry";

describe("Project B geometric deliberation", () => {
  it("creates two comparable conceptual variants", () => {
    const variants = buildProjectBGeometricVariants();
    expect(variants.map((v) => v.variantId)).toEqual(["B-CANDIDATE-01", "B-CANDIDATE-02"]);
    expect(variants.every((v) => v.model.maturity === "CONCEPTUAL")).toBe(true);
    expect(variants.every((v) => v.model.constructionReady === false)).toBe(true);
    expect(variants.every((v) => v.model.elements.some((e) => e.kind === "SPACE"))).toBe(true);
  });

  it("preserves the human gate and unknown compliance evidence", () => {
    const variants = buildProjectBGeometricVariants();
    expect(validateProjectBGeometricVariants(variants)).toBe(true);
    expect(variants.every((v) => v.validations.find((x) => x.id === "ACCESSIBILITY_COMPLIANCE")?.state === "UNKNOWN")).toBe(true);
    expect(variants.every((v) => v.humanReviewRequired)).toBe(true);
  });
});
