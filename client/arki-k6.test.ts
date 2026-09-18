import { describe, expect, it } from "vitest";
import { assessKnowledgeNeed } from "./src/components/arkiKnowledgeNeed";
import { buildK4FixtureStore } from "./src/components/arkiKnowledgeStore";
import { buildK6ConsultationFromK5, executeK6Question, executeControlledK6Perspective, k6Traceback, K6_PERSPECTIVES, validateK6Finding } from "./src/components/arkiSpecialistPerspective";

describe("ARKI-K6 controlled specialist perspective contract", () => {
  it("defines bounded Housing and Bioclimatic perspectives without personas", () => {
    expect(K6_PERSPECTIVES.HOUSING_PERSPECTIVE.authorityBoundary).toBe("NON_FINAL");
    expect(K6_PERSPECTIVES.BIOCLIMATIC_PERSPECTIVE.knowledgeAccessScope).toBe("BOUNDED_K4_RETRIEVAL");
    expect(K6_PERSPECTIVES.HOUSING_PERSPECTIVE).not.toHaveProperty("name");
    expect(K6_PERSPECTIVES.BIOCLIMATIC_PERSPECTIVE).not.toHaveProperty("memory");
  });
  it("consumes the K5 consultation plan and only eligible bounded K4 knowledge", () => {
    const store = buildK4FixtureStore();
    const assessment = assessKnowledgeNeed("What architectural considerations may influence the relationship between kitchen and dining spaces?", store, { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    const consultation = buildK6ConsultationFromK5(assessment, "HOUSING_PERSPECTIVE", store, { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(consultation.executionStatus).toBe("CONTROLLED_EXECUTED_NOT_PRODUCTION_RUNTIME");
    expect(consultation.availableKnowledge.every((item) => item.record.validation === "VALIDATED")).toBe(true);
    expect(consultation.availableKnowledge.length).toBeGreaterThan(0);
  });
  it("produces a bounded Housing interpretation for the general fixture", () => {
    const finding = executeK6Question("What architectural considerations may influence the relationship between kitchen and dining spaces?", "HOUSING_PERSPECTIVE", buildK4FixtureStore(), { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(finding.perspectiveId).toBe("HOUSING_PERSPECTIVE");
    expect(finding.epistemicStatus).toBe("INTERPRETATION");
    expect(finding.findingType).toBe("INTERPRETATION");
    expect(validateK6Finding(finding)).toBe(true);
  });
  it("produces the HOUSE-A21 trade-off without moving geometry or creating a decision", () => {
    const finding = executeK6Question("Should KITCHEN be moved farther from ACCESS while preserving its preferred relationship with LIVING_DINING?", "HOUSING_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(finding.findingType).toBe("TRADEOFF");
    expect(finding.statement).toContain("trade-off");
    expect(finding.limitations).toContain("No room movement was executed.");
    expect(finding.noDecision).toBe(true);
    expect(finding.authorityBoundary).toBe("NON_FINAL");
  });
  it("keeps Housing structural questions out of scope", () => {
    const finding = executeK6Question("Will the structural system resist the design earthquake?", "HOUSING_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21", spatialScope: "edificacion" });
    expect(finding.epistemicStatus).toBe("OUT_OF_SCOPE");
    expect(finding.additionalPerspectivesNeeded).toContain("STRUCTURAL");
    expect(finding.findingType).toBe("OPEN_QUESTION");
  });
  it("produces general Bioclimatic interpretation without simulation", () => {
    const finding = executeK6Question("What factors influence cross ventilation?", "BIOCLIMATIC_PERSPECTIVE", buildK4FixtureStore(), { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(finding.epistemicStatus).toBe("INTERPRETATION");
    expect(finding.evidenceSufficiency).toMatch(/GENERAL|CONTEXTUAL/);
    expect(finding.statement).toContain("Cross-ventilation");
    expect(finding.statement).not.toContain("adequate");
  });
  it("preserves unknown and non-simulated status for bioclimatic performance", () => {
    const finding = executeK6Question("Will this courtyard provide adequate natural ventilation?", "BIOCLIMATIC_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(finding.epistemicStatus).toBe("UNKNOWN");
    expect(finding.findingType).toBe("OPEN_QUESTION");
    expect(finding.unknowns.length).toBeGreaterThan(0);
    expect(finding.limitations).toContain("No project performance calculation or simulation was executed.");
    expect(finding.answerability).toBe("NOT_ESTABLISHED");
  });
  it("keeps Bioclimatic regulatory questions out of scope", () => {
    const finding = executeK6Question("Does this bedroom legally comply with the applicable regulation?", "BIOCLIMATIC_PERSPECTIVE", buildK4FixtureStore(), { projectId: "HOUSE-A21", spatialScope: "edificacion" });
    expect(finding.epistemicStatus).toBe("OUT_OF_SCOPE");
    expect(finding.additionalPerspectivesNeeded).toContain("REGULATORY");
    expect(finding.evidenceSufficiency).toBe("REGULATORY_SOURCE_REQUIRED");
  });
  it("keeps same courtyard question perspective-bounded", () => {
    const store = buildK4FixtureStore();
    const assessment = assessKnowledgeNeed("Will this courtyard provide adequate natural ventilation?", store, { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    const housing = executeControlledK6Perspective(buildK6ConsultationFromK5(assessment, "HOUSING_PERSPECTIVE", store, { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" }));
    const bioclimatic = executeControlledK6Perspective(buildK6ConsultationFromK5(assessment, "BIOCLIMATIC_PERSPECTIVE", store, { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" }));
    expect(housing.perspectiveId).not.toBe(bioclimatic.perspectiveId);
    expect(housing.statement).not.toContain("airflow");
    expect(bioclimatic.statement).toContain("bioclimatic");
    expect(housing.noDecision && bioclimatic.noDecision).toBe(true);
  });
  it("preserves provenance and distinguishes retrieved from used knowledge", () => {
    const store = buildK4FixtureStore();
    const finding = executeK6Question("What architectural considerations may influence the relationship between kitchen and dining spaces?", "HOUSING_PERSPECTIVE", store, { spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(finding.retrievedKnowledgeIds.length).toBeGreaterThanOrEqual(finding.knowledgeIdsUsed.length);
    expect(k6Traceback(finding, store).every((item) => item.provenance || item.origin)).toBe(true);
  });
  it("is deterministic and returns the finding to ARKI without activating runtime", () => {
    const first = executeK6Question("What factors influence cross ventilation?", "BIOCLIMATIC_PERSPECTIVE", buildK4FixtureStore());
    const second = executeK6Question("What factors influence cross ventilation?", "BIOCLIMATIC_PERSPECTIVE", buildK4FixtureStore());
    expect(first).toEqual(second);
    expect(first.returnedToArki).toBe(true);
    expect(first.noHumanReview).toBe(true);
    expect(first.noKnowledgePromotion).toBe(true);
  });
});
