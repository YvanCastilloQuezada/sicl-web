export const ARKI_EDUCATION_MOTOR_ALIGNMENT_VERSION = "ARKI-EDU-MOTOR-ALIGNMENT-1.1" as const;
export const DELTA_62_REQUIRED_FORMAT = "DELTA-6.2-FEDERATED-KNOWLEDGE-1.0" as const;

export type EducationStage = "FOUNDATION" | "UNDERGRADUATE" | "SPECIALIZATION" | "MASTERS" | "DOCTORATE";
export type RequirementState = "NOT_EVIDENCED" | "PARTIAL" | "DEMONSTRATED" | "HUMAN_CONFIRMED";
export type MotorReadinessState = "LOCKED" | "READY_FOR_PRACTICUM";
export type CuratorDecision = "ALIGNED" | "GAP" | "DUPLICATE" | "CONFLICT" | "OUT_OF_SCOPE" | "HUMAN_REVIEW_REQUIRED";

export type CurriculumDefinition = {
  curriculumId: string;
  stage: EducationStage;
  specialty: string;
  parentCurriculumId?: string;
  learningOutcomeIds: readonly string[];
  prerequisiteKnowledgeIds: readonly string[];
  motorCapabilityTargets: readonly string[];
  status: "RESEARCH_PENDING" | "READY_FOR_HUMAN_REVIEW" | "HUMAN_CONFIRMED";
};

export type Delta62CurriculumCandidate = {
  recordId: string;
  formatVersion: typeof DELTA_62_REQUIRED_FORMAT;
  domain: string;
  knowledgeId: string;
  proposedStage: EducationStage;
  proposedCurriculumId: string;
  provenance: readonly string[];
  sourceCommit: string;
  sourceFile: string;
  confidence: "DECLARED" | "EVIDENCED" | "REVIEWED";
};

export type CuratorReview = {
  recordId: string;
  curriculumId: string;
  decision: CuratorDecision;
  reason: string;
  humanReviewRequired: true;
};

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

export function curateDelta62Candidate(
  candidate: Delta62CurriculumCandidate,
  curriculum: CurriculumDefinition,
): CuratorReview {
  if (candidate.formatVersion !== DELTA_62_REQUIRED_FORMAT) {
    return { recordId: candidate.recordId, curriculumId: curriculum.curriculumId, decision: "CONFLICT", reason: "DELTA_62_FORMAT_MISMATCH", humanReviewRequired: true };
  }
  if (!candidate.provenance.length || !candidate.sourceCommit || !candidate.sourceFile) {
    return { recordId: candidate.recordId, curriculumId: curriculum.curriculumId, decision: "HUMAN_REVIEW_REQUIRED", reason: "PROVENANCE_INCOMPLETE", humanReviewRequired: true };
  }
  if (candidate.proposedCurriculumId !== curriculum.curriculumId || candidate.proposedStage !== curriculum.stage) {
    return { recordId: candidate.recordId, curriculumId: curriculum.curriculumId, decision: "OUT_OF_SCOPE", reason: "CURRICULUM_OR_STAGE_MISMATCH", humanReviewRequired: true };
  }
  if (candidate.domain !== curriculum.specialty) {
    return { recordId: candidate.recordId, curriculumId: curriculum.curriculumId, decision: "HUMAN_REVIEW_REQUIRED", reason: "SPECIALTY_ALIGNMENT_REQUIRES_REVIEW", humanReviewRequired: true };
  }
  if (curriculum.prerequisiteKnowledgeIds.includes(candidate.knowledgeId)) {
    return { recordId: candidate.recordId, curriculumId: curriculum.curriculumId, decision: "DUPLICATE", reason: "KNOWLEDGE_ALREADY_REGISTERED_AS_PREREQUISITE", humanReviewRequired: true };
  }
  return { recordId: candidate.recordId, curriculumId: curriculum.curriculumId, decision: "ALIGNED", reason: "DELTA_62_CANDIDATE_ALIGNS_WITH_CURRICULUM", humanReviewRequired: true };
}

export function validateCurriculumHierarchy(curricula: readonly CurriculumDefinition[]): string[] {
  const errors: string[] = [];
  const ids = new Set(curricula.map((item) => item.curriculumId));
  for (const item of curricula) {
    if ((item.stage === "MASTERS" || item.stage === "DOCTORATE") && !item.parentCurriculumId) errors.push(`${item.curriculumId}:PARENT_CURRICULUM_REQUIRED`);
    if (item.parentCurriculumId && !ids.has(item.parentCurriculumId)) errors.push(`${item.curriculumId}:PARENT_CURRICULUM_NOT_FOUND`);
    if (!item.learningOutcomeIds.length) errors.push(`${item.curriculumId}:LEARNING_OUTCOMES_REQUIRED`);
  }
  return errors;
}

export function evaluateMotorReadiness(definition: MotorPracticumDefinition): MotorReadiness {
  const missing = definition.prerequisites
    .filter((requirement) => requirement.state !== "HUMAN_CONFIRMED")
    .map((requirement) => requirement.knowledgeId);

  if (missing.length > 0) {
    return { state: "LOCKED", missingKnowledgeIds: missing, reason: "KNOWLEDGE_PREREQUISITES_NOT_HUMAN_CONFIRMED" };
  }
  return { state: "READY_FOR_PRACTICUM", missingKnowledgeIds: [], reason: "THEORY_GATE_SATISFIED_PRACTICAL_CAPABILITY_NOT_YET_DEMONSTRATED" };
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
