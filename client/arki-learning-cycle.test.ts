import { describe, expect, it } from "vitest";
import {
  buildL00L08HouseLearningPilot,
  evaluateLearningCycle,
  recordCorrection,
  recordExplanation,
  recordPractice,
  recordTransfer,
  reviewLearningCycle,
  runLearningCycleNegativeControls,
  validateLearningCycle,
} from "./src/components/arkiLearningCycle";

describe("ARKI canonical learning cycle pilot", () => {
  it("reuses L00-L08 knowledge for a controlled house pilot without maturity promotion", () => {
    const pilot = buildL00L08HouseLearningPilot();
    expect(validateLearningCycle(pilot)).toBe(true);
    expect(pilot.knowledgeUnitIds).toEqual(["KU-L00-001", "KU-L02-001", "KU-L05-001", "KU-L08-001"]);
    expect(pilot.practices.map((practice) => practice.type)).toEqual(["APPLICATION", "NON_APPLICATION", "TRANSFER"]);
    expect(pilot.maturity).toBe("IMPORTED_CURRICULAR_KNOWLEDGE");
    expect(pilot.currentPhase).toBe("PRINCIPLE");
  });

  it("requires the pedagogical sequence and preserves unknowns during evaluation", () => {
    const pilot = buildL00L08HouseLearningPilot();
    const explained = recordExplanation(pilot, { attemptId: "explanation", statement: "Room name is not an activity model; topology must precede coordinate commitment.", evidenceRefs: ["L00-L02-L05-L08"], unknowns: ["household schedule"], contradictions: ["courtyard preference versus privacy"], epistemicState: "HYPOTHESIS" });
    const practiced = recordPractice(explained, { attemptId: "practice", statement: "HOUSE-A21 preserves three independent topology hypotheses before coordinates.", evidenceRefs: ["L08-TOPOLOGY-A", "L08-TOPOLOGY-B", "L08-TOPOLOGY-C"], unknowns: ["site orientation", "service route"], contradictions: ["privacy versus openness"], epistemicState: "HYPOTHESIS" });
    const evaluated = evaluateLearningCycle(practiced);
    expect(evaluated.currentPhase).toBe("CORRECTION");
    expect(evaluated.assessment?.outcome).toBe("PASS_WITH_OBSERVATIONS");
    expect(evaluated.assessment?.humanReviewRequired).toBe(true);
    expect(evaluated.assessment?.automaticPromotion).toBe(false);
    expect(evaluated.attempts.every((attempt) => attempt.unknowns.length > 0)).toBe(true);
  });

  it("blocks transfer until a human architect confirms the correction", () => {
    const pilot = buildL00L08HouseLearningPilot();
    const evaluated = evaluateLearningCycle(recordPractice(recordExplanation(pilot, { attemptId: "explanation", statement: "A line or adjacency does not prove circulation or access.", evidenceRefs: ["negative-controls"], unknowns: ["applicability"], contradictions: ["access versus separation"], epistemicState: "HYPOTHESIS" }), { attemptId: "practice", statement: "The house pilot keeps activity, relation and topology distinct.", evidenceRefs: ["HOUSE-A21", "L08-TOPOLOGY-A"], unknowns: ["site context"], contradictions: ["courtyard preference versus requirement"], epistemicState: "HYPOTHESIS" }));
    expect(() => recordTransfer(evaluated, { transferId: "premature", fromContext: pilot.practices[0].context, toContext: pilot.practices[2].context, preservedPrinciples: ["topology before coordinates"], changedConditions: ["users", "flows"], nonApplicationCases: ["room label does not determine activity"], outcome: "PASS", reason: "not yet human reviewed", humanReviewRequired: true })).toThrow();
    const corrected = recordCorrection(evaluated, { correctionId: "human-correction", action: "CORRECT", statement: "Keep the topology hypothesis separate from the selected architectural decision.", changed: ["selection state", "transfer framing"], preservedUnknowns: ["site orientation", "service route"], reviewer: "ARCHITECT", humanReviewState: "CONFIRMED" });
    const transferred = recordTransfer(corrected, { transferId: "pavilion-transfer", fromContext: pilot.practices[0].context, toContext: pilot.practices[2].context, preservedPrinciples: ["topology before coordinates", "relationship is not adjacency"], changedConditions: ["users", "flows", "typology"], nonApplicationCases: ["house courtyard solution cannot be copied to pavilion"], outcome: "PASS_WITH_OBSERVATIONS", reason: "Principles transfer with changed conditions; architectural form remains a hypothesis.", humanReviewRequired: true });
    expect(transferred.currentPhase).toBe("HUMAN_REVIEW");
    expect(transferred.maturity).toBe("HUMAN_REVIEWED");
    expect(reviewLearningCycle(transferred, "CONFIRM").maturity).toBe("HUMAN_REVIEWED");
  });

  it("passes negative controls for epistemic integrity and authority", () => {
    expect(runLearningCycleNegativeControls()).toEqual({ importedNotMature: true, noTransferBeforeHumanCorrection: true, humanAuthorityPreserved: true, automaticPromotionBlocked: true, unknownPreserved: true });
  });
});
