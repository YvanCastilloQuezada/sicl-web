import { describe, expect, it } from "vitest";
import { dslSummary, executeTypologyDsl, validateTypologyDsl, type TypologyDslDefinition } from "../shared/arkiTypologyDsl";

const definition: TypologyDslDefinition = {
  version: "ARKI-TYPOLOGY-DSL-1.0",
  params: [{ id: "area", type: "float", defaultValue: 100, unit: "m²" }, { id: "pct", type: "float", defaultValue: 20, unit: "%" }],
  metrics: [{ id: "built", formula: { op: "pct", args: ["area", "pct"] }, round: 2, unit: "m²" }],
  geometry: { type: "prismatic" },
  alerts: [{ severity: "high", message: "Área supera límite conceptual", condition: { op: "gt", args: ["area", 1000] } }],
};

describe("ARKI typology DSL", () => {
  it("validates and executes declarative expressions without arbitrary code", () => {
    expect(validateTypologyDsl(definition).valid).toBe(true);
    const result = executeTypologyDsl(definition, { area: 500, pct: 20 });
    expect(result.metrics.built).toBe(100);
    expect(result.status).toBe("AI_PROPOSED");
    expect(result.humanReviewRequired).toBe(true);
  });
  it("rejects unknown variables and unsupported geometry", () => {
    const invalid = { ...definition, geometry: { type: "python" as never }, metrics: [{ id: "x", formula: "not_allowed" }] };
    const validation = validateTypologyDsl(invalid);
    expect(validation.valid).toBe(false);
    expect(validation.errors.join(" ")).toContain("GEOMETRY_NOT_ALLOWED");
  });
  it("exposes explicit safety boundaries", () => {
    const summary = dslSummary();
    expect(summary.arbitraryCodeExecution).toBe(false);
    expect(summary.humanReviewRequired).toBe(true);
  });
});
