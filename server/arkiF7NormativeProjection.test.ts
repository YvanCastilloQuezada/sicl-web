import { describe, expect, it } from "vitest";
import { F7_NORMATIVE_BOUNDARY, projectNormativeEvaluationToF7 } from "./arkiF7NormativeProjection";

describe("F7 normative projection boundary", () => {
  it("never turns REFERENCE_SEED into verified professional compliance without official-source evidence", () => {
    const result = projectNormativeEvaluationToF7({
      projectionId: "N1", typology: "Vivienda",
      facts: [{ variable: "altura_libre_vivienda_m", value: 2.5, unit: "m", source: "MODEL" }],
      ruleIds: ["RNE-A.010.1"], semanticIds: ["S1"], agkObjectIds: ["G1"], sourceClaimIds: ["C1"],
    });
    expect(result.source.results[0].status).toBe("PASS");
    expect(result.projection.evidenceState).toBe("PARTIAL");
    expect(result.projection.unknowns).toContain("NORMATIVE_SOURCE_NOT_OFFICIALLY_VERIFIED");
    expect(result.complianceClaim).toBe("NOT_VERIFIED");
    expect(F7_NORMATIVE_BOUNDARY.referenceSeedIsProfessionalProof).toBe(false);
    expect(result.canonicalPromotion).toBe(false);
  });

  it("keeps a failed reference rule as an open jurisdiction issue", () => {
    const result = projectNormativeEvaluationToF7({
      projectionId: "N2", typology: "Vivienda",
      facts: [{ variable: "altura_libre_vivienda_m", value: 2.0, unit: "m", source: "MODEL" }],
      ruleIds: ["RNE-A.010.1"], semanticIds: ["S1"], agkObjectIds: ["G1"], sourceClaimIds: ["C1"],
      officialSourceVerification: ["OFFICIAL-SOURCE-SNAPSHOT:1"],
    });
    expect(result.source.results[0].status).toBe("FAIL");
    expect(result.issues[0].kind).toBe("JURISDICTION");
    expect(result.issues[0].status).toBe("OPEN");
    expect(result.projection.evidenceState).toBe("PARTIAL");
  });
});
