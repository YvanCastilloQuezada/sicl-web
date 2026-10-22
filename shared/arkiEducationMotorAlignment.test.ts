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


describe("ARKI Delta 6.2 curriculum curator", () => {
  const undergraduate = {
    curriculumId: "CURR-STRUCT-UG",
    stage: "UNDERGRADUATE" as const,
    specialty: "Structural Engineering",
    learningOutcomeIds: ["LO-STATICS"],
    prerequisiteKnowledgeIds: ["K-MATH-001"],
    motorCapabilityTargets: [],
    status: "HUMAN_CONFIRMED" as const,
  };
  const masters = {
    curriculumId: "CURR-STRUCT-MSC",
    stage: "MASTERS" as const,
    specialty: "Structural Engineering",
    parentCurriculumId: undergraduate.curriculumId,
    learningOutcomeIds: ["LO-NONLINEAR"],
    prerequisiteKnowledgeIds: ["K-STATICS-ADV"],
    motorCapabilityTargets: ["CAP-OPENSEES"],
    status: "READY_FOR_HUMAN_REVIEW" as const,
  };

  it("requires every masters/doctorate curriculum to have a parent curriculum", async () => {
    const { validateCurriculumHierarchy } = await import("./arkiEducationMotorAlignment");
    expect(validateCurriculumHierarchy([{ ...masters, parentCurriculumId: undefined }])).toContain("CURR-STRUCT-MSC:PARENT_CURRICULUM_REQUIRED");
  });

  it("accepts a traceable Delta 6.2 candidate only as curriculum-aligned, never canonical", async () => {
    const { curateDelta62Candidate } = await import("./arkiEducationMotorAlignment");
    expect(curateDelta62Candidate({
      recordId: "D62-STR-001",
      formatVersion: "DELTA-6.2-FEDERATED-KNOWLEDGE-1.0",
      domain: "Structural Engineering",
      knowledgeId: "K-DYNAMICS-001",
      proposedStage: "MASTERS",
      proposedCurriculumId: masters.curriculumId,
      provenance: ["SRC-001"],
      sourceCommit: "abc123",
      sourceFile: "source.xlsx",
      confidence: "EVIDENCED",
    }, masters)).toEqual({
      recordId: "D62-STR-001",
      curriculumId: masters.curriculumId,
      decision: "ALIGNED",
      reason: "DELTA_62_CANDIDATE_ALIGNS_WITH_CURRICULUM",
      humanReviewRequired: true,
    });
  });

  it("rejects curriculum-stage mismatch for Delta 6.2 food", async () => {
    const { curateDelta62Candidate } = await import("./arkiEducationMotorAlignment");
    expect(curateDelta62Candidate({
      recordId: "D62-STR-002",
      formatVersion: "DELTA-6.2-FEDERATED-KNOWLEDGE-1.0",
      domain: "Structural Engineering",
      knowledgeId: "K-BRIDGE-001",
      proposedStage: "DOCTORATE",
      proposedCurriculumId: masters.curriculumId,
      provenance: ["SRC-002"],
      sourceCommit: "def456",
      sourceFile: "source.xlsx",
      confidence: "EVIDENCED",
    }, masters).decision).toBe("OUT_OF_SCOPE");
  });

  it("preserves the full hierarchy before motor practicum", async () => {
    const { validateCurriculumHierarchy } = await import("./arkiEducationMotorAlignment");
    expect(validateCurriculumHierarchy([undergraduate, masters])).toEqual([]);
  });
});
