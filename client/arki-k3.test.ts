import { describe, expect, it } from "vitest";
import { buildK3Fixture, buildK3NegativeControls, buildK3ValidationProof, deriveKnowledgeUnit, reconstructSourceTrace, validateK3ReadModel } from "./src/components/arkiSourceKnowledgeContract";

describe("ARKI-K3 source-to-knowledge contract", () => {
  it("builds two deterministic controlled sources and preserves source/content/knowledge separation", () => {
    const model = buildK3Fixture();
    expect(model.sources).toHaveLength(2);
    expect(model.contentUnits).toHaveLength(2);
    expect(model.knowledgeUnits).toHaveLength(2);
    expect(validateK3ReadModel(model)).toBe(true);
    expect(model.knowledgeUnits[0].validationState).toBe("KNOWLEDGE_CANDIDATE");
  });
  it("maps one knowledge unit to multiple K2 domains and retains location traceability", () => {
    const model = buildK3Fixture();
    const trace = reconstructSourceTrace(model, "K3-KU-A");
    expect(trace?.source.sourceId).toBe("K3-FIXTURE-HOUSING-001");
    expect(trace?.content.location.page).toBe(1);
    expect(trace?.knowledge.domainIds).toEqual(expect.arrayContaining(["HOUSING", "SPATIAL_COMPOSITION"]));
  });
  it("preserves courtyard and compact positions without a winner", () => {
    const model = buildK3Fixture();
    expect(model.contradictions[0].knowledgeUnitIds).toEqual(["K3-KU-A", "K3-KU-B"]);
    expect(model.contradictions[0].preserved).toBe(true);
    expect(model.contradictions[0].winnerCreated).toBe(false);
  });
  it("requires human validation for promotion and preserves rejection", () => {
    const proof = buildK3ValidationProof();
    expect(proof.model.knowledgeUnits.find((unit) => unit.knowledgeUnitId === "K3-KU-A")?.validationState).toBe("HUMAN_VALIDATED");
    expect(proof.model.knowledgeUnits.find((unit) => unit.knowledgeUnitId === "K3-KU-B")?.validationState).toBe("REJECTED");
    expect(proof.promoted.candidates[0].validationState).toBe("HUMAN_VALIDATED");
  });
  it("rejects missing source identity, location and unknown K2 domain", () => {
    const controls = buildK3NegativeControls();
    expect(controls.noId.knowledgeUnits).toHaveLength(2);
    expect(controls.noLocation.knowledgeUnits).toHaveLength(2);
    expect(controls.unknownDomain.knowledgeUnits).toHaveLength(2);
  });
  it("deduplicates stable sources and identical source/location claims", () => {
    const controls = buildK3NegativeControls();
    expect(controls.duplicateSource.sources).toHaveLength(2);
    expect(controls.duplicateClaim.knowledgeUnits).toHaveLength(2);
  });
  it("keeps federation and retrieval inactive", () => {
    const model = buildK3Fixture();
    expect(model.federation).toBe("FROZEN_NOT_ACTIVATED");
    expect(model.retrieval).toBe("NOT_ACTIVATED");
    expect(model.fullSourceStorage).toBe("NOT_IMPLEMENTED");
  });
  it("does not create a HOUSE-A21 decision or design operation", () => {
    const model = buildK3Fixture();
    expect(model.noAutomaticDecision).toBe(true);
    expect(model.noAutomaticWinner).toBe(true);
    expect(model.knowledgeUnits.every((unit) => unit.validationState !== "HUMAN_VALIDATED")).toBe(true);
  });
});
