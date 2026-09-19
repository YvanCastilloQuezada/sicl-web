import { describe, expect, it } from "vitest";
import { evaluateNeufertResidentialZoning, NEUFERT_RESIDENTIAL_ZONING_RULES } from "./arkiNeufertResidentialZoning";

describe("Neufert residential zoning", () => {
  it("teaches seven traceable residential zoning rules", () => {
    expect(NEUFERT_RESIDENTIAL_ZONING_RULES).toHaveLength(7);
    expect(NEUFERT_RESIDENTIAL_ZONING_RULES.every((rule) => rule.sourceStatus === "SOURCE_DERIVED_HYPOTHESIS")).toBe(true);
  });

  it("evaluates the house by zones and keeps unknown access visible", () => {
    const evaluation = evaluateNeufertResidentialZoning();
    expect(evaluation.findings).toHaveLength(7);
    expect(evaluation.findings.find((item) => item.ruleId === "NZ-01")?.status).toBe("SUPPORTED");
    expect(evaluation.findings.find((item) => item.ruleId === "NZ-02")?.status).toBe("UNKNOWN");
    expect(evaluation.findings.find((item) => item.ruleId === "NZ-06")?.status).toBe("UNKNOWN");
    expect(evaluation.noAutomaticDecision).toBe(true);
    expect(evaluation.humanReviewRequired).toBe(true);
    expect(evaluation.areaRelations).toHaveLength(7);
    expect(evaluation.areaRelations.find((item) => item.relation === "UNKNOWN_ACCESS")?.evidenceStatus).toBe("UNKNOWN");
  });
});
