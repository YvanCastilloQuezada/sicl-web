import { describe, expect, it } from "vitest";
import { buildD17D32Proof, buildWorldClassDesignIntelligence, validateWorldClassDesignIntelligence } from "./src/components/arkiWorldClassDesignIntelligence";

describe("ARKI world-class architectural design intelligence D17-D32", () => {
  it("proves concept and parti generation with traceable consequences", () => {
    const proof = buildD17D32Proof();
    expect(proof.conceptToGeometry).toBe(true);
    expect(proof.partiToConfiguration).toBe(true);
    expect(proof.result.d17).toHaveLength(3);
    expect(proof.result.d18).toHaveLength(3);
    expect(proof.result.d17.every((concept) => concept.postHoc === false)).toBe(true);
  });
  it("proves proportion, hierarchy, sequence, threshold and light reasoning without false performance", () => {
    const result = buildWorldClassDesignIntelligence();
    expect(result.d19.universalProportionRule).toBe("NONE");
    expect(result.d19.hierarchy.length).toBeGreaterThan(0);
    expect(result.d20.stages).toHaveLength(9);
    expect(result.d20.thresholdReasoning.length).toBeGreaterThan(0);
    expect(result.d21.quantitativePerformance).toBe("UNKNOWN");
  });
  it("proves massing, facade and tectonic reasoning without arbitrary sculpture or engineering claims", () => {
    const proof = buildD17D32Proof();
    expect(proof.planToMass).toBe(true);
    expect(proof.interiorToFacade).toBe(true);
    expect(proof.result.d22.alternatives).toHaveLength(3);
    expect(proof.result.d22.arbitrarySculpture).toBe("NONE");
    expect(proof.result.d24.structuralPerformance).toBe("UNKNOWN");
    expect(proof.result.d24.specialistRequired).toBe(true);
  });
  it("proves place, landscape, typology and precedent reasoning without stereotype or copying", () => {
    const proof = buildD17D32Proof();
    expect(proof.contextToDesign).toBe(true);
    expect(proof.result.d25.stereotyping).toBe("NONE");
    expect(proof.result.d26.relationships.length).toBeGreaterThan(0);
    expect(proof.result.d27.copying).toBe("PROHIBITED");
    expect(proof.result.d28.copying).toBe("NO");
  });
  it("proves economic, adaptability, synthesis and recovery boundaries", () => {
    const proof = buildD17D32Proof();
    expect(proof.result.d29.actualCost).toBe("UNKNOWN");
    expect(proof.result.d29.noCheapestSelection).toBe(true);
    expect(proof.result.d30.lifecyclePerformance).toBe("UNKNOWN");
    expect(proof.result.d31.noScore).toBe(true);
    expect(proof.result.d31.noWinner).toBe(true);
    expect(proof.designRecovery).toBe(true);
  });
  it("proves the D32 studio loop, visual proof and human authority controls", () => {
    const proof = buildD17D32Proof();
    expect(proof.validation).toBe(true);
    expect(validateWorldClassDesignIntelligence(proof.result)).toBe(true);
    expect(proof.creativeDivergence).toBe(true);
    expect(proof.controlledConvergence).toBe(true);
    expect(proof.progressiveResolution).toBe(true);
    expect(proof.projectDesignMemory).toBe(true);
    expect(proof.visualProof).toBe(true);
    expect(proof.result.d32.selectedHumanPath).toContain("NONE");
    expect(proof.result.d32.worldClassClaim).toBe("ASPIRATIONAL_NOT_CERTIFIED");
    expect(proof.result.d32.noAutomaticWinner).toBe(true);
    expect(proof.result.d32.noAutomaticDecision).toBe(true);
  });
});
