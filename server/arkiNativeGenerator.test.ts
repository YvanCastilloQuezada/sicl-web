import { describe, expect, it } from "vitest";
import { analyzeNativeGeometry, ARKI_NATIVE_TEMPLATES, getNativeTemplate, nativeGeneratorSecurityContract, nativeTemplateSummary } from "../shared/arkiNativeGenerator";

describe("ARKI native generator", () => {
  it("exposes a deterministic first-party template catalog", () => {
    expect(nativeTemplateSummary()).toMatchObject({ version: "ARKI-NATIVE-GENERATOR-1.0", templates: 7 });
    expect(ARKI_NATIVE_TEMPLATES.map((template) => template.id)).toHaveLength(7);
    expect(new Set(ARKI_NATIVE_TEMPLATES.map((template) => template.id)).size).toBe(7);
  });

  it("loads a template without mutating the catalog", () => {
    const template = getNativeTemplate("TROPICAL_STADIUM");
    expect(template?.geometry.width).toBe(220);
    expect(getNativeTemplate("UNKNOWN" as never)).toBeNull();
  });

  it("calculates reproducible conceptual metrics", () => {
    const result = analyzeNativeGeometry({ kind: "COURTYARD_MASS", width: 20, depth: 10, height: 3, floors: 2, courtyardRatio: 0.25 }, "COURTYARD_HOTEL");
    expect(result.metrics).toEqual({ floorArea: 200, conceptualBuiltArea: 300, totalHeight: 6, courtyardArea: 50 });
    expect(result.humanReviewRequired).toBe(true);
  });

  it("flags geometry that requires professional review", () => {
    const result = analyzeNativeGeometry({ kind: "COURTYARD_MASS", width: 4, depth: 10, height: 10, floors: 4, courtyardRatio: 0.75 });
    expect(result.alerts.map((alert) => alert.code)).toEqual(expect.arrayContaining(["DIMENSION_OUT_OF_RANGE", "COURTYARD_REVIEW", "HEIGHT_REVIEW"]));
  });

  it("does not permit third-party code execution or implicit Core mutation", () => {
    expect(nativeGeneratorSecurityContract()).toMatchObject({ thirdPartyCodeExecution: "DISABLED", projectStateMutation: "EXPLICIT_SAVE_ONLY", humanReviewRequired: true });
  });
});
