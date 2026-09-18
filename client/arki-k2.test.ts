import { describe, expect, it } from "vitest";
import { ARKI_K2_DOMAINS, ARKI_K2_FACULTIES, ARKI_K2_PROFILES, K2_SPATIAL_SCOPES, classifyEvidenceRequirement, classifyK2Question, isCurriculumValid } from "./src/components/arkiKnowledgeCurriculum";

describe("ARKI-K2 architectural knowledge curriculum", () => {
  it("keeps a deterministic unique domain registry", () => {
    expect(ARKI_K2_DOMAINS.length).toBe(28);
    expect(isCurriculumValid()).toBe(true);
    expect(new Set(ARKI_K2_DOMAINS.map((domain) => domain.id)).size).toBe(28);
  });
  it("covers all twelve world-class faculties", () => {
    const covered = new Set(ARKI_K2_DOMAINS.flatMap((domain) => domain.faculties));
    expect(ARKI_K2_FACULTIES.every((faculty) => covered.has(faculty))).toBe(true);
  });
  it("uses all eleven canonical spatial scopes without creating a second scale ontology", () => {
    expect(K2_SPATIAL_SCOPES).toHaveLength(11);
    expect(ARKI_K2_DOMAINS.some((domain) => domain.scopes.pais)).toBe(true);
    expect(ARKI_K2_DOMAINS.some((domain) => domain.scopes.objeto)).toBe(false);
  });
  it("prepares Housing and Bioclimatic profiles without source claims", () => {
    expect(ARKI_K2_PROFILES.map((profile) => profile.id)).toEqual(["HOUSING", "BIOCLIMATIC"]);
    expect(ARKI_K2_PROFILES.every((profile) => profile.status === "PREPARED_NOT_SOURCE_POPULATED")).toBe(true);
  });
  it("classifies the HOUSE-A21 question without deciding it", () => {
    const result = classifyK2Question("Should KITCHEN be moved farther from ACCESS while preserving LIVING_DINING?", { hasHumanInput: true });
    expect(result.domains).toEqual(expect.arrayContaining(["SPATIAL_COMPOSITION", "HOUSING", "ARCHITECTURAL_PROGRAMMING", "CIRCULATION_EXPERIENCE"]));
    expect(result.noAutomaticDecision).toBe(true);
    expect(result.outputs).toContain("DESIGN_HYPOTHESIS");
  });
  it("separates bioclimatic knowledge from performance", () => {
    const result = classifyK2Question("Would a courtyard improve daylight in this house?", { hasSimulation: false, hasComputation: false });
    expect(result.domains).toContain("CLIMATE_BIOCLIMATIC");
    expect(result.answerState).toBe("NOT_COMPUTED");
  });
  it("requires verified regulatory evidence for compliance", () => {
    const result = classifyK2Question("Is this bedroom compliant?", { hasSource: false, hasProjectEvidence: false });
    expect(result.kind).toBe("COMPLIANCE");
    expect(result.answerState).toBe("NOT_ASSESSED");
    expect(classifyEvidenceRequirement("REGULATORY_SOURCE_REQUIRED", {})).toBe("SOURCE_REQUIRED");
  });
  it("keeps precedent distinct from prescription and unknown without source", () => {
    const result = classifyK2Question("Project X uses a courtyard.", { hasSource: false });
    expect(result.kind).toBe("PRECEDENT");
    expect(result.outputs).toContain("STRATEGY_CANDIDATE");
    expect(result.answerState).toBe("UNKNOWN");
  });
  it("preserves source, computation, simulation and human-input controls", () => {
    expect(classifyEvidenceRequirement("SOURCE_REQUIRED", {})).toBe("SOURCE_REQUIRED");
    expect(classifyEvidenceRequirement("COMPUTATION_REQUIRED", {})).toBe("NOT_COMPUTED");
    expect(classifyEvidenceRequirement("SIMULATION_REQUIRED", {})).toBe("NOT_SIMULATED");
    expect(classifyEvidenceRequirement("HUMAN_INPUT_REQUIRED", {})).toBe("UNKNOWN");
  });
});
