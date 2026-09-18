import { describe, expect, it } from "vitest";
import { assessKnowledgeNeed, validateK5Assessment } from "./src/components/arkiKnowledgeNeed";

describe("ARKI-K5 knowledge need and consultation planning", () => {
  it("classifies a simple housing relationship as ARKI_GENERAL without specialist execution", () => {
    const assessment = assessKnowledgeNeed("What is a functional relationship between kitchen and dining spaces?");
    expect(assessment.competence).toBe("ARKI_GENERAL");
    expect(assessment.relevantDomains).toEqual(expect.arrayContaining(["HOUSING", "SPATIAL_COMPOSITION", "ARCHITECTURAL_PROGRAMMING"]));
    expect(assessment.specialistRequired).toBe(false);
    expect(validateK5Assessment(assessment)).toBe(true);
  });
  it("distinguishes a general bioclimatic definition from performance assessment", () => {
    const definition = assessKnowledgeNeed("What is cross ventilation?");
    const performance = assessKnowledgeNeed("Will this courtyard provide adequate natural ventilation?", undefined, { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(definition.competence).toBe("ARKI_GENERAL");
    expect(definition.answerability).toBe("ANSWERABLE_WITH_ARKI_GENERAL");
    expect(performance.competence).toBe("CROSS_CUTTING");
    expect(performance.answerability).toBe("REQUIRES_SIMULATION");
    expect(performance.missingInformation).toEqual(expect.arrayContaining(["MISSING_PROJECT_EVIDENCE", "MISSING_SIMULATION"]));
    expect(performance.specialistPlan.requiredPerspectives.map((item) => item.perspectiveId)).toContain("BIOCLIMATIC");
  });
  it("detects deep structural competence only for performance depth", () => {
    const definition = assessKnowledgeNeed("What is a structural grid?");
    const performance = assessKnowledgeNeed("Will this structural system resist the design earthquake?", undefined, { projectId: "HOUSE-A21", spatialScope: "edificacion" });
    expect(definition.competence).toBe("ARKI_GENERAL");
    expect(performance.competence).toBe("SPECIALIST_DEEP");
    expect(performance.answerability).toBe("REQUIRES_SIMULATION");
    expect(performance.specialistPlan.requiredPerspectives[0].perspectiveId).toBe("STRUCTURAL");
  });
  it("detects regulatory needs without asserting compliance", () => {
    const assessment = assessKnowledgeNeed("Does this bedroom comply?", undefined, { projectId: "HOUSE-A21", spatialScope: "edificacion" });
    expect(assessment.relevantDomains).toContain("REGULATORY_INTELLIGENCE");
    expect(assessment.evidenceNeeds).toEqual(expect.arrayContaining(["REGULATORY_SOURCE_REQUIRED", "PROJECT_EVIDENCE_REQUIRED"]));
    expect(assessment.answerability).toBe("REQUIRES_REGULATORY_SOURCE");
    expect(assessment.missingInformation).toEqual(expect.arrayContaining(["MISSING_REGULATORY_SOURCE", "MISSING_JURISDICTION"]));
  });
  it("detects human-only preference and authorization questions", () => {
    const preference = assessKnowledgeNeed("Which of these two valid alternatives do I prefer?");
    const authorization = assessKnowledgeNeed("Should ARKI execute this approved modification?");
    expect(preference.competence).toBe("HUMAN_ONLY");
    expect(preference.answerability).toBe("REQUIRES_HUMAN_INPUT");
    expect(authorization.competence).toBe("HUMAN_ONLY");
    expect(authorization.noDesignOperation).toBe(true);
  });
  it("detects insufficient information instead of routing randomly", () => {
    const assessment = assessKnowledgeNeed("Is this good?");
    expect(assessment.competence).toBe("INSUFFICIENT_INFORMATION");
    expect(assessment.answerability).toBe("NOT_CURRENTLY_ANSWERABLE");
    expect(assessment.missingInformation).toContain("MISSING_PROJECT_CONTEXT");
  });
  it("plans the minimum sufficient perspectives for an economic courtyard tradeoff", () => {
    const assessment = assessKnowledgeNeed("Should we enlarge the courtyard if construction cost must remain moderate?");
    expect(assessment.competence).toBe("MULTI_PERSPECTIVE");
    const ids = assessment.specialistPlan.requiredPerspectives.map((item) => item.perspectiveId);
    expect(ids).toEqual(expect.arrayContaining(["ECONOMICS"]));
    expect(ids).not.toContain("STRUCTURAL");
    expect(assessment.specialistPlan.executionStatus).toBe("PLANNED_NOT_EXECUTED");
  });
  it("preserves HOUSE-A21 retrieval without creating a design decision", () => {
    const assessment = assessKnowledgeNeed("Should KITCHEN be moved farther from ACCESS while preserving its preferred relationship with LIVING_DINING?", undefined, { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(assessment.relevantDomains).toEqual(expect.arrayContaining(["HOUSING", "SPATIAL_COMPOSITION", "ARCHITECTURAL_PROGRAMMING"]));
    expect(assessment.competence).toBe("ARKI_GENERAL");
    expect(assessment.evidenceNeeds).toContain("PROJECT_EVIDENCE_REQUIRED");
    expect(assessment.noDecision).toBe(true);
    expect(assessment.noDesignOperation).toBe(true);
  });
  it("keeps plans deterministic and explanations explicit", () => {
    const question = "Will this exact facade assembly satisfy the required fire performance?";
    const first = assessKnowledgeNeed(question, undefined, { projectId: "P", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    const second = assessKnowledgeNeed(question, undefined, { projectId: "P", spatialScope: "edificacion", typology: "HOUSING", designStage: "CONCEPT" });
    expect(first).toEqual(second);
    expect(first.specialistPlan.requiredPerspectives[0].reason).toContain("Exact assembly");
    expect(first.specialistPlan.requiredPerspectives[0].consultationQuestion).not.toMatch(/best|confirm that/i);
  });
  it("does not activate specialists, federation, retrieval or new infrastructure", () => {
    const assessment = assessKnowledgeNeed("What is a parti?");
    expect(assessment.specialistPlan.executionStatus).toBe("PLANNED_NOT_EXECUTED");
    expect(assessment.noKnowledgePromotion).toBe(true);
    expect(assessment.specialistPlan.expectedOutputTypes).not.toContain("DECISION");
  });
});
