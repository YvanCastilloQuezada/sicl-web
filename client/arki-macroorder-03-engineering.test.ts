import { describe, expect, it } from "vitest";
import { buildEngineeringProof, buildMultidisciplinaryEngineeringModel, validateMultidisciplinaryModel } from "./src/components/arkiMultidisciplinaryEngineering";

describe("ARKI Macroorder 03 multidisciplinary engineering", () => {
  it("uses one common model for S3-S11 without duplicating building geometry", () => {
    const model = buildMultidisciplinaryEngineeringModel();
    expect(model.disciplines).toHaveLength(48);
    expect(model.records.some((record) => record.kind === "SYSTEM")).toBe(true);
    expect(model.records.some((record) => record.kind === "RESERVATION")).toBe(true);
    expect(model.records.some((record) => record.kind === "ROUTE")).toBe(true);
    expect(model.records.some((record) => record.kind === "DEPENDENCY")).toBe(true);
    expect(validateMultidisciplinaryModel(model)).toBe(true);
  });
  it("preserves epistemic states and calculation boundaries", () => {
    const proof = buildEngineeringProof();
    expect(proof.valid).toBe(true);
    expect(proof.noFakeNumbers).toBe(true);
    expect(proof.model.epistemicStates).toContain("CALCULATION_REQUIRED");
    expect(proof.model.records.every((record) => record.provenance.length > 0)).toBe(true);
  });
  it("propagates architectural changes to affected systems without silent mutation", () => {
    const proof = buildEngineeringProof();
    expect(proof.impact.state).toBe("IMPACT_IDENTIFIED");
    expect(proof.impact.affectedSystems).toContain("STRUCTURAL_SYSTEMS");
    expect(proof.impact.affectedSystems).toContain("HVAC");
    expect(proof.impact.reEvaluationRequired).toBe(true);
    expect(proof.impact.specialistReviewRequired).toBe(true);
    expect(proof.noMutation).toBe(true);
    expect(proof.impact.unknowns).toContain("Member sizes");
  });
  it("preserves human authority and avoids automatic decisions or winners", () => {
    const model = buildMultidisciplinaryEngineeringModel();
    expect(model.humanAuthority).toBe("PRESERVED");
    expect(model.noAutomaticDecision).toBe(true);
    expect(model.noAutomaticWinner).toBe(true);
  });
});
