export type V6ReuseDisposition = "REUSE" | "EXTEND" | "ADAPT" | "DATA_ONLY" | "DERIVED_VIEW" | "RESEARCH_ONLY" | "DO_NOT_ADD";
export type V6StrategyFamily = "SPATIAL" | "TOPOLOGICAL" | "ALLOCATIVE" | "TEMPORAL" | "CONTROL" | "RESOURCE" | "TECHNICAL" | "EXTERNAL" | "HYBRID";
export type V6OperatorFamily = "SPATIAL" | "COMPOSITIONAL" | "TOPOLOGICAL" | "ALLOCATIVE" | "TEMPORAL" | "CONTROL" | "RESOURCE" | "STATE";
export type V6KnowledgeDeltaType = "ADD" | "REFINE" | "GENERALIZE" | "SPECIALIZE" | "REVISE" | "RETIRE" | "INPUT_ACQUISITION" | "RETRIEVAL" | "EXECUTION" | "IN_SESSION_INFERENCE";
export type V6UnknownType = "PROJECT_DATA" | "ARCHITECTURAL_KNOWLEDGE" | "REGULATORY" | "SPECIALIST" | "IMPLEMENTATION" | "EVIDENCE" | "HUMAN_DECISION";
export type V6EpistemicStatus = "HYPOTHESIS" | "OBSERVED" | "SUPPORTED" | "VERIFIED" | "CONFLICTED" | "UNKNOWN" | "NOT_APPLICABLE";
export type V6GeneralizationStatus = "NONE" | "POSSIBLE" | "PARTIAL" | "DEMONSTRATED";
export type V6AutonomyLevel = "L0_RECEIVES" | "L1_REPRESENTS" | "L2_DETECTS" | "L3_DIAGNOSES" | "L4_EVALUATES" | "L5_GENERATES_STRATEGIES" | "L6_GENERATES_CANDIDATES" | "L7_MUTATES_SYNTHESIZES" | "L8_REEVALUATES" | "L9_COMPARES" | "L10_GENERALIZES";

export type V6DiscoveryRecord = {
  capabilityId: string;
  existingArtifact: string;
  currentCapability: string;
  gap: string;
  disposition: V6ReuseDisposition;
  affectedFiles: string[];
};

export type V6CauseModel = {
  observedDeficit: string;
  causeHypotheses: string[];
  supportedCauses: string[];
  verifiedCauses: string[];
  certainty: "UNKNOWN" | "HYPOTHESIZED" | "SUPPORTED" | "VERIFIED";
  evidenceRefs: string[];
  unknowns: Array<{ type: V6UnknownType; statement: string; resolutionPath: string }>;
};

export type V6DesignMove = {
  moveId: string;
  intent: string;
  target: string;
  strategyFamilies: V6StrategyFamily[];
  operators: Array<{ family: V6OperatorFamily; operation: string; target: string }>;
  preconditions: string[];
  forbiddenConditions: string[];
  authorityScope: string;
  expectedBenefits: string[];
  expectedCosts: string[];
  expectedRisks: string[];
  unknownEffects: string[];
  impactScope: "DIRECT" | "DEPENDENCY" | "POSSIBLE" | "UNKNOWN";
  verificationPlan: string[];
  provenance: string[];
  noAutomaticDecision: true;
};

export type V6LearningLedger = {
  k0: string[];
  suppliedInput: string[];
  retrievedKnowledge: string[];
  adaptedKnowledge: string[];
  executedReasoning: string[];
  observations: string[];
  k1: string[];
  deltaType: V6KnowledgeDeltaType;
  persisted: boolean;
  learningClaim: "NONE" | "CANDIDATE" | "SUPPORTED" | "TRANSFER_TESTED";
};

export type V6TransferAssessment = {
  sourceDomain: string;
  targetDomain: string;
  transferUnit: string;
  structuralMatch: string[];
  criticalDifferences: string[];
  adaptationBurden: "NONE" | "LOW" | "MODERATE" | "HIGH" | "STRUCTURALLY_INCOMPATIBLE" | "UNKNOWN";
  decision: "TRANSFER" | "ADAPT" | "DO_NOT_TRANSFER";
  adaptation: string[];
  result: string;
  counterexample: string;
  scopeRefinement: string;
  generalizationStatus: V6GeneralizationStatus;
};

export type V6EvaluationReport = {
  reportId: string;
  baseline: { k0: string[]; repository: string; branch: string; head: string; worktree: "CLEAN" | "DIRTY" };
  suppliedInput: string[];
  initialUnknowns: Array<{ type: V6UnknownType; statement: string; resolutionPath: string }>;
  reasoningActivated: string[];
  knowledgeReused: string[];
  reasoningProvenance: string[];
  deficitsDetected: string[];
  causeModels: V6CauseModel[];
  strategiesGenerated: Array<{ family: V6StrategyFamily; rationale: string; distinctFrom: string[] }>;
  candidates: Array<{ candidateId: string; lineage: string[]; strategyFamilies: V6StrategyFamily[]; status: "CANDIDATE" | "REJECTED" | "SELECTED_FOR_REVIEW" }>;
  rejectedCandidates: Array<{ candidateId: string; reason: string; hardConstraint: boolean }>;
  geometryMutations: string[];
  relationshipsChanged: string[];
  activeTopology: string[];
  scenarioResults: string[];
  dependencyPropagation: string[];
  newDeficitsCreated: string[];
  expectedVsActualEffects: { expected: string[]; actual: string[]; unexpected: string[] };
  coverage: { candidate: string[]; applicable: string[]; evaluated: string[]; unevaluated: string[] };
  evidenceProvenance: string[];
  unknowns: Array<{ type: V6UnknownType; statement: string; resolutionPath: string }>;
  regulatoryStatus: "NOT_ASSESSED" | "PARTIAL" | "VERIFIED" | "REQUIRES_VERIFICATION";
  humanDecisionsRequired: string[];
  learning: V6LearningLedger;
  transfer: V6TransferAssessment[];
  adversarialTests: Array<{ id: string; result: "PASS" | "FAIL" | "UNKNOWN"; finding: string }>;
  regressions: { software: string; knowledge: string; reasoning: string; geometry: string; epistemic: string; regulatory: string };
  runtimeMaturity: { research: string; teachability: string; implementation: string; validation: string; generalization: V6GeneralizationStatus; autonomy: V6AutonomyLevel };
  finalEpistemicState: V6EpistemicStatus;
  humanAuthority: true;
  noAutomaticWinner: true;
  noAutomaticCanonization: true;
};

export function classifyV6Discovery(input: Omit<V6DiscoveryRecord, "disposition"> & { disposition: V6ReuseDisposition }): V6DiscoveryRecord {
  return { ...input, affectedFiles: [...input.affectedFiles] };
}

export function buildV6DesignMove(input: Omit<V6DesignMove, "noAutomaticDecision">): V6DesignMove {
  return { ...input, noAutomaticDecision: true };
}

export function buildV6LearningLedger(input: Omit<V6LearningLedger, "learningClaim"> & { learningClaim?: V6LearningLedger["learningClaim"] }): V6LearningLedger {
  const learningClaim = input.learningClaim ?? "NONE";
  if (learningClaim !== "NONE" && !input.persisted) {
    throw new Error("V6 learning claims require persisted evidence");
  }
  if ((input.deltaType === "INPUT_ACQUISITION" || input.deltaType === "RETRIEVAL" || input.deltaType === "EXECUTION" || input.deltaType === "IN_SESSION_INFERENCE") && learningClaim !== "NONE") {
    throw new Error("V6 supplied input, retrieval, execution and temporary inference are not learning by themselves");
  }
  return { ...input, learningClaim };
}

export function buildV6TransferAssessment(input: V6TransferAssessment): V6TransferAssessment {
  if (input.decision === "TRANSFER" && input.criticalDifferences.length > 0 && input.adaptationBurden === "STRUCTURALLY_INCOMPATIBLE") {
    throw new Error("V6 transfer cannot be accepted when critical differences are structurally incompatible");
  }
  return { ...input, structuralMatch: [...input.structuralMatch], criticalDifferences: [...input.criticalDifferences] };
}

export function validateV6EvaluationReport(report: V6EvaluationReport): boolean {
  const unknownsHavePaths = report.unknowns.every((unknown) => unknown.statement.length > 0 && unknown.resolutionPath.length > 0);
  const causesHaveEvidenceOrUnknown = report.causeModels.every((cause) => cause.evidenceRefs.length > 0 || cause.certainty === "UNKNOWN");
  const movesAreVerified = report.candidates.every((candidate) => candidate.lineage.length > 0 && candidate.strategyFamilies.length > 0);
  const noAutomaticAuthority = report.humanAuthority && report.noAutomaticWinner && report.noAutomaticCanonization;
  const learningSeparated = report.learning.suppliedInput.every((item) => !report.learning.k1.includes(item)) && report.learning.retrievedKnowledge.every((item) => !report.learning.k1.includes(item));
  return Boolean(report.reportId && report.baseline.repository && report.baseline.branch && report.reasoningActivated.length >= 0 && unknownsHavePaths && causesHaveEvidenceOrUnknown && movesAreVerified && noAutomaticAuthority && learningSeparated);
}

export function buildV6CheckpointDelta(before: string[], after: string[], type: V6KnowledgeDeltaType): { before: string[]; after: string[]; type: V6KnowledgeDeltaType; newItems: string[]; retiredItems: string[] } {
  const oldSet = new Set(before);
  const newSet = new Set(after);
  return { before: [...before], after: [...after], type, newItems: after.filter((item) => !oldSet.has(item)), retiredItems: before.filter((item) => !newSet.has(item)) };
}
