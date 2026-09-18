import { describe, expect, it } from "vitest";
import { buildD9D16Proof, buildD16IntegratedIntelligence, validateD9D16 } from "./src/components/arkiAdvancedDesignIntelligenceD9D16";

describe("ARKI advanced design intelligence D9-D16", () => {
  it("proves site-to-building and site-to-space reasoning without inventing site facts", () => {
    const proof = buildD9D16Proof();
    expect(proof.siteToBuilding).toBe(true);
    expect(proof.siteToSpace).toBe(true);
    expect(proof.integrated.siteReasoning.noSiteFactInference).toBe(true);
    expect(proof.integrated.siteReasoning.siteFacts.some((fact) => fact.epistemicStatus === "UNKNOWN")).toBe(true);
  });

  it("detects a bounded program change and traces it to geometry", () => {
    const proof = buildD9D16Proof();
    expect(proof.programChange).toBe(true);
    expect(proof.programGeometry).toBe(true);
    expect(proof.integrated.programAdaptation.unaffectedProgramIds).toContain("LIVING_DINING");
    expect(proof.integrated.programAdaptation.humanAuthorizationRequired).toBe(true);
  });

  it("resolves constraints without silent violation or automatic priority", () => {
    const proof = buildD9D16Proof();
    expect(proof.constraintReasoning).toBe(true);
    expect(proof.integrated.constraints.conflict.noSilentViolation).toBe(true);
    expect(proof.integrated.constraints.noAutomaticPriority).toBe(true);
    expect(proof.integrated.constraints.compatibility.some((item) => item.status === "TENSION")).toBe(true);
    expect(proof.integrated.constraints.compatibility.some((item) => item.status === "UNKNOWN")).toBe(true);
  });

  it("proves structural, constructability, material, envelope and system awareness without engineering claims", () => {
    const proof = buildD9D16Proof();
    expect(proof.structuralAwareness).toBe(true);
    expect(proof.integrated.structural.structuralPerformance).toBe("UNKNOWN");
    expect(proof.integrated.structural.noUnsupportedAdequacy).toBe(true);
    expect(proof.materialReasoning).toBe(true);
    expect(proof.integrated.materialEnvelope.noFinalSpecification).toBe(true);
    expect(proof.integrated.materialEnvelope.noFullBim).toBe(true);
  });

  it("proves multi-scale coherence, change propagation, intent and causal traceability", () => {
    const proof = buildD9D16Proof();
    expect(proof.multiScale).toBe(true);
    expect(proof.impactPropagation).toBe(true);
    expect(proof.intentTraceability).toBe(true);
    expect(proof.causalTraceability).toBe(true);
    expect(proof.noFalsePrecision).toBe(true);
    expect(proof.integrated.coherence.effects.map((effect) => effect.scale)).toEqual(["SPACE", "LEVEL", "BUILDING", "SITE", "ELEMENT"]);
  });

  it("integrates D1-D8 and preserves the final authority boundary", () => {
    const integrated = buildD16IntegratedIntelligence();
    expect(validateD9D16(integrated)).toBe(true);
    expect(integrated.d8.alternatives).toHaveLength(3);
    expect(integrated.visualComparison.inspectable).toBe(true);
    expect(integrated.humanAuthority).toBe("PRESERVED");
    expect(integrated.noAutomaticWinner).toBe(true);
    expect(integrated.noAutomaticDecision).toBe(true);
  });
});
