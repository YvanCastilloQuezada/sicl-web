export const ARKI_EDUCATION_MOTOR_ALIGNMENT_VERSION = "ARKI-EDU-MOTOR-ALIGNMENT-1.0" as const;

export type EducationStage = "FOUNDATION" | "UNDERGRADUATE" | "SPECIALIZATION" | "MASTERS" | "DOCTORATE";
export type RequirementState = "NOT_EVIDENCED" | "PARTIAL" | "DEMONSTRATED" | "HUMAN_CONFIRMED";
export type MotorReadinessState = "LOCKED" | "READY_FOR_PRACTICUM";

export type KnowledgeRequirement = {
  knowledgeId: string;
  minimumStage: EducationStage;
  state: RequirementState;
};

export type MotorPracticumDefinition = {
  practicumId: string;
  specialty: string;
  capabilityTarget: string;
  masterEngines: readonly string[];
  prerequisites: readonly KnowledgeRequirement[];
  requiresTransferEvidence: true;
  requiresHumanReview: true;
};

export type MotorReadiness = {
  state: MotorReadinessState;
  missingKnowledgeIds: string[];
  reason: string;
};

const STAGE_ORDER: Record<EducationStage, number> = {
  FOUNDATION: 0,
  UNDERGRADUATE: 1,
  SPECIALIZATION: 2,
  MASTERS: 3,
  DOCTORATE: 4,
};

export function evaluateMotorReadiness(definition: MotorPracticumDefinition): MotorReadiness {
  const missing = definition.prerequisites
    .filter((requirement) =>
      requirement.state !== "HUMAN_CONFIRMED" ||
      STAGE_ORDER[requirement.minimumStage] > STAGE_ORDER.DOCTORATE
    )
    .map((requirement) => requirement.knowledgeId);

  if (missing.length > 0) {
    return {
      state: "LOCKED",
      missingKnowledgeIds: missing,
      reason: "KNOWLEDGE_PREREQUISITES_NOT_HUMAN_CONFIRMED",
    };
  }

  return {
    state: "READY_FOR_PRACTICUM",
    missingKnowledgeIds: [],
    reason: "THEORY_GATE_SATISFIED_PRACTICAL_CAPABILITY_NOT_YET_DEMONSTRATED",
  };
}

export function validateMotorPracticum(definition: MotorPracticumDefinition): string[] {
  const errors: string[] = [];
  if (!definition.practicumId || !definition.specialty || !definition.capabilityTarget) errors.push("IDENTITY_REQUIRED");
  if (definition.masterEngines.length < 1) errors.push("MASTER_ENGINE_REQUIRED");
  if (definition.prerequisites.length < 1) errors.push("KNOWLEDGE_PREREQUISITES_REQUIRED");
  if (!definition.requiresTransferEvidence) errors.push("TRANSFER_EVIDENCE_REQUIRED");
  if (!definition.requiresHumanReview) errors.push("HUMAN_REVIEW_REQUIRED");
  return errors;
}
