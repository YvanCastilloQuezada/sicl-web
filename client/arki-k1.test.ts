import { describe, expect, it } from "vitest";
import { buildHouseA21LearningFixture, buildK1NegativeControls, createK1ReadModel, determineReuseEligibility, recordHumanFeedback, recordProjectExperience, validateK1ReadModel } from "./src/components/arkiLearningContract";

describe("ARKI-K1 architectural learning contract", () => {
  it("records HOUSE-A21 feedback as project-specific experience with provenance", () => {
    const fixture = buildHouseA21LearningFixture();
    expect(fixture.houseProof.proofId).toBe("HOUSE-A21");
    expect(fixture.experiences).toHaveLength(1);
    expect(fixture.experiences[0].epistemicClass).toBe("EXPERIENCE");
    expect(fixture.experiences[0].reuseState).toBe("PROJECT_ONLY");
    expect(fixture.experiences[0].provenance.sourceRefs).toContain("K1-FB-01");
    expect(fixture.experiences[0].humanAction).toBe("CORRECTED");
    expect(validateK1ReadModel(fixture)).toBe(true);
  });

  it("allows reuse only within the same project context", () => {
    const fixture = buildHouseA21LearningFixture();
    expect(determineReuseEligibility(fixture.experiences[0], { projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "residential", designStage: "schematic design" })).toBe("PROJECT_ONLY");
    expect(determineReuseEligibility(fixture.experiences[0], { projectId: "OTHER", spatialScope: "edificacion", typology: "residential", designStage: "schematic design" })).toBe("UNKNOWN_APPLICABILITY");
  });

  it("preserves a knowledge candidate until explicit human validation", () => {
    const model = recordProjectExperience(recordHumanFeedback(createK1ReadModel("HOUSE-A21"), { feedbackId: "F-1", statement: "Correct the relationship in this project", action: "CORRECT", projectId: "HOUSE-A21", context: { projectId: "HOUSE-A21" } }), { experienceId: "E-1", projectId: "HOUSE-A21", spatialScope: "edificacion", typology: "residential", designStage: "schematic", context: { projectId: "HOUSE-A21" }, problem: "local", intent: "local", arkiProposal: "proposal", humanAction: "CORRECTED", changed: ["relationship"], unknowns: [], conflicts: [] });
    expect(model.candidates).toHaveLength(0);
    expect(model.noAutomaticPromotion).toBe(true);
  });

  it("passes all required negative controls", () => {
    const controls = buildK1NegativeControls();
    expect(controls.generalized).toBe(false);
    expect(controls.sourceClaim.candidates[0].validationState).toBe("NOT_VALIDATED");
    expect(controls.sourceClaim.candidates[0].reuseState).toBe("CANDIDATE");
    expect(controls.contradiction.contradictions[0].preserved).toBe(true);
    expect(controls.contradiction.contradictions[0].winnerCreated).toBe(false);
    expect(controls.unknownReuse).toBe("UNKNOWN_APPLICABILITY");
    expect(controls.aiOnly.candidates[0].epistemicStatus).toBe("KNOWLEDGE_CANDIDATE");
    expect(controls.aiOnly.candidates[0].validationState).toBe("NOT_VALIDATED");
    expect(controls.humanSelectionCreatesKnowledge).toBe(false);
  });
});
