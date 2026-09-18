import { describe, expect, it } from "vitest";
import { buildD1ToD8Proof, buildD8Exploration, generateD2Alternatives, validateD8Exploration, varyD3 } from "./src/components/arkiAdvancedDesignIntelligence";

describe("ARKI advanced design intelligence D1-D8", () => {
  it("proves a bounded vertical circulation geometry without claiming compliance", () => {
    const proof = buildD1ToD8Proof();
    expect(proof.verticalGeometry).toBe(true);
    expect(proof.d1.status).toBe("PROVEN");
    expect(proof.d1.boundary).toBe("STAIR_GEOMETRY_NOT_CODE_COMPLIANCE");
    expect(proof.d1.verticalCirculation.codeCompliance).toBe("NOT_ASSESSED");
    expect(proof.d1.verticalCirculation.accessibleRoute).toBe("NOT_CLAIMED");
  });

  it("proves three deterministic meaningful alternatives from the same A21 program", () => {
    const alternatives = generateD2Alternatives();
    expect(alternatives).toHaveLength(3);
    expect(new Set(alternatives.map((alternative) => alternative.representation.input_fingerprint)).size).toBe(3);
    expect(new Set(alternatives.map((alternative) => alternative.strategy)).size).toBe(3);
    expect(alternatives.every((alternative) => alternative.noDecision && alternative.noWinner && alternative.humanSelectionRequired)).toBe(true);
  });

  it("proves explicit traceable deterministic design variables", () => {
    const alternatives = generateD2Alternatives();
    const variation = varyD3(alternatives[1], [{ id: "courtyard_size", value: "5x5m", basis: "declared outdoor relationship", effect: "increases protected void" }]);
    expect(variation.deterministic).toBe(true);
    expect(variation.variables[0].basis).toBeTruthy();
    expect(variation.reason).toContain("courtyard_size");
    expect(variation.preservesProgram).toBe(true);
    expect(variation.preservesUnknowns).toBe(true);
  });

  it("proves D4 lineage, D5 source trace, D6 pressures, D7 critique and D8 evolution", () => {
    const proof = buildD1ToD8Proof();
    expect(proof.multiGeneration).toBe(true);
    expect(proof.parentImmutable).toBe(true);
    expect(proof.exploration.generations.ancestry).toHaveLength(3);
    expect(proof.sourceToGeometry).toBe(true);
    expect(proof.exploration.pressures.some((pressure) => pressure.family === "BIOCLIMATIC")).toBe(true);
    expect(proof.exploration.pressures.some((pressure) => pressure.family === "REGULATORY" && pressure.classification === "UNKNOWN_APPLICABILITY")).toBe(true);
    expect(proof.exploration.critiques.every((critique) => critique.noScore && critique.noRanking && critique.noWinner && critique.noDecision)).toBe(true);
    expect(proof.exploration.tradeoffs.humanChoiceRequired).toBe(true);
    expect(proof.exploration.visualComparisons.inspectable).toBe(true);
    expect(validateD8Exploration(proof.exploration)).toBe(true);
  });

  it("preserves negative controls: no winner, no decision, no autonomous design", () => {
    const exploration = buildD8Exploration();
    expect(exploration.automaticWinner).toBe("NONE");
    expect(exploration.autonomousDecision).toBe("NO");
    expect(exploration.humanAuthority).toBe("PRESERVED");
    expect(exploration.unknowns).toContain("Structural performance");
    expect(exploration.unknowns).toContain("Environmental performance");
    expect(exploration.unknowns).toContain("Regulatory compliance");
  });
});
