import { describe, expect, it } from "vitest";
import { createPartiHypothesis } from "./arkiRPartiManual";
import { materializeRPartiRealizations, validateRPartiMaterialization } from "./arkiRPartiGeometricMaterialization";

describe("R-PARTI geometric materialization", () => {
  it("materializes two geometrically distinct realizations of one parti", () => {
    const parti = createPartiHypothesis({
      partiId: "parti:coastal-maker-spine",
      seedId: "seed:coastal-maker",
      organizingHypothesis: "shared repair spine with public threshold",
      relations: ["ENTRY↔LEARNING", "LEARNING↔GATHERING", "SUPPORT↔LEARNING"],
      formInterpretations: ["linear", "inverted public sequence"],
      realizationFamilyIds: ["family:coastal-maker"],
      provenance: ["Project B semantic candidate", "human deliberation"],
      status: "HYPOTHESIS",
    });
    const result = materializeRPartiRealizations(parti);
    expect(validateRPartiMaterialization(result)).toBe(true);
    expect(result.realizations).toHaveLength(2);
    expect(result.sameParti).toBe(true);
    expect(result.geometricallyDistinct).toBe(true);
    expect(result.hardConstraintsPreserved).toBe(true);
    expect(result.realizations[0].geometrySignature).not.toBe(result.realizations[1].geometrySignature);
    expect(result.realizations[0].model.projectId).not.toBe(result.realizations[1].model.projectId);
    expect(result.realizations.every((realization) => realization.automaticWinner === "NONE")).toBe(true);
  });

  it("preserves unknown regulatory and accessibility states", () => {
    const result = materializeRPartiRealizations({ partiId: "parti:unknowns" });
    expect(result.status).toBe("PASS");
    expect(result.unknowns).toContain("B-CANDIDATE-01:ACCESSIBILITY_COMPLIANCE");
    expect(result.unknowns).toContain("B-CANDIDATE-02:REGULATORY_COMPLIANCE");
  });
});
