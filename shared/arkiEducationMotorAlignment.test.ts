import { describe, expect, it } from "vitest";
import { evaluateMotorReadiness, validateMotorPracticum, type MotorPracticumDefinition } from "./arkiEducationMotorAlignment";

const base: MotorPracticumDefinition = {
  practicumId: "PRACTICUM-CFD-001",
  specialty: "CFD / Building Physics",
  capabilityTarget: "Computational fluid dynamics analysis",
  masterEngines: ["OpenFOAM", "SU2"],
  prerequisites: [
    { knowledgeId: "K-FLUIDS-ADV", minimumStage: "MASTERS", state: "HUMAN_CONFIRMED" },
    { knowledgeId: "K-CFD-DOCTORAL", minimumStage: "DOCTORATE", state: "HUMAN_CONFIRMED" },
  ],
  requiresTransferEvidence: true,
  requiresHumanReview: true,
};

describe("ARKI education to motor practicum gate", () => {
  it("keeps motor practicum locked while theoretical prerequisites are not confirmed", () => {
    const definition = {
      ...base,
      prerequisites: [
        ...base.prerequisites.slice(0, 1),
        { knowledgeId: "K-CFD-DOCTORAL", minimumStage: "DOCTORATE" as const, state: "DEMONSTRATED" as const },
      ],
    };
    expect(evaluateMotorReadiness(definition)).toEqual({
      state: "LOCKED",
      missingKnowledgeIds: ["K-CFD-DOCTORAL"],
      reason: "KNOWLEDGE_PREREQUISITES_NOT_HUMAN_CONFIRMED",
    });
  });

  it("opens only the practical training gate after theory is confirmed", () => {
    expect(evaluateMotorReadiness(base)).toEqual({
      state: "READY_FOR_PRACTICUM",
      missingKnowledgeIds: [],
      reason: "THEORY_GATE_SATISFIED_PRACTICAL_CAPABILITY_NOT_YET_DEMONSTRATED",
    });
  });

  it("does not allow a motor track without knowledge prerequisites", () => {
    expect(validateMotorPracticum({ ...base, prerequisites: [] })).toContain("KNOWLEDGE_PREREQUISITES_REQUIRED");
  });

  it("requires a practical master engine", () => {
    expect(validateMotorPracticum({ ...base, masterEngines: [] })).toContain("MASTER_ENGINE_REQUIRED");
  });
});
