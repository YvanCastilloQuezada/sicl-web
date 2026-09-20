/**
 * ARKI Architectural Knowledge Corpus — M0-K foundation.
 *
 * This is a small, additive semantic contract. It is not a second engine or
 * canonical store; it provides typed records and validation helpers for the
 * existing SICL source/evidence/event infrastructure.
 */

export type EpistemicStatus =
  | "FACT"
  | "HYPOTHESIS"
  | "AI_PROPOSED"
  | "OBSERVED"
  | "INSUFFICIENT"
  | "CONFLICTING"
  | "UNKNOWN"
  | "CONFLICT"
  | "HUMAN_CONFIRMED"
  | "REJECTED"
  | "SUPERSEDED"
  | "CONTEXT_SPECIFIC";

export type KnowledgeKind =
  | "FACT"
  | "RELATIONSHIP"
  | "INVARIANT"
  | "PATTERN"
  | "HEURISTIC"
  | "STRATEGY"
  | "DESIGN_MOVE"
  | "COUNTEREXAMPLE"
  | "REGULATORY_REQUIREMENT"
  | "REFERENCE_VALUE"
  | "HUMAN_DECISION";

export type KState =
  | "K0_ABSENT"
  | "K1_OBSERVED"
  | "K2_CANDIDATE"
  | "K3_SUPPORTED"
  | "K4_TRANSFER_TESTED"
  | "K5_GENERALIZED_CANDIDATE"
  | "K6_CANONICAL_CANDIDATE"
  | "K7_CANONICAL_HUMAN_CONFIRMED"
  | "REJECTED"
  | "SUPERSEDED"
  | "CONFLICTED"
  | "CONTEXT_SPECIFIC"
  | "UNKNOWN";

export type TransferMode = "TRANSFER" | "ADAPT" | "DO_NOT_TRANSFER" | "UNKNOWN";
export type RightsStatus = "PUBLIC_DOMAIN" | "OPEN_LICENSE" | "COPYRIGHTED" | "UNKNOWN";
export type IngestionStatus = "NOT_REQUESTED" | "ABSTRACT_ONLY" | "ALLOWED" | "BLOCKED" | "REQUIRES_REVIEW";

export type Scope = {
  typology?: string;
  subtypology?: string;
  serviceModel?: string;
  subject?: string;
  activity?: string;
  state?: string;
  process?: string;
  capability?: string;
  technology?: string;
  climate?: string;
  culture?: string;
  jurisdiction?: string;
  time?: string;
  scale?: string;
  operatingModel?: string;
  hazard?: string;
  scenario?: string;
};

export type SourceRecord = {
  sourceId: string;
  title: string;
  author?: string;
  sourceType: "BOOK" | "STANDARD" | "LAW" | "PROJECT" | "WEB" | "USER_PROVIDED" | "UNKNOWN";
  accessStatus: "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN";
  rightsStatus: RightsStatus;
  rightsEvidence?: string;
  ingestionStatus: IngestionStatus;
  provenanceNote?: string;
};

export type EvidenceRecord = {
  evidenceId: string;
  sourceId?: string;
  statement: string;
  evidenceType: "DOCUMENT" | "OBSERVATION" | "MEASUREMENT" | "REFERENCE" | "TESTIMONY" | "NORMATIVE" | "TEST" | "OTHER";
  epistemicStatus: EpistemicStatus;
  scope?: Scope;
  capturedAt?: string;
  methodVersion?: string;
};

export type KnowledgeItem = {
  knowledgeId: string;
  kind: KnowledgeKind;
  statement: string;
  epistemicStatus: EpistemicStatus;
  kState: KState;
  scope?: Scope;
  evidenceIds: string[];
  provenance: "SOURCE_STATEMENT" | "ARKI_ABSTRACTION" | "ARKI_INFERENCE" | "HUMAN_CONFIRMED" | "UNKNOWN";
};

export type RationaleEdge = {
  rationaleId: string;
  fromNode: string;
  relation: "WHY" | "CAUSES" | "SUPPORTS" | "CONSTRAINS" | "EXPECTED_EFFECT" | "REFINES";
  toNode: string;
  evidenceIds: string[];
  epistemicStatus: EpistemicStatus;
};

export type StrategyRecord = { strategyId: string; statement: string; scope?: Scope; knowledgeId?: string };
export type RealizationRecord = { realizationId: string; description: string; strategyIds: string[]; canonicalModelId?: string };
export type TransferRecord = { transferId: string; knowledgeId: string; mode: TransferMode; fromScope: Scope; toScope: Scope; whatRemains?: string; whatChanges?: string; why?: string; adaptationBurden?: string; epistemicStatus: EpistemicStatus };
export type CounterexampleRecord = { counterexampleId: string; knowledgeId: string; observation: string; scopeConflict: string; resultingAction: "REFINE_SCOPE" | "SPECIALIZE" | "REVISE" | "REJECT"; preservedOriginal: true };
export type UnknownRecord = { unknownId: string; statement: string; whyItMatters: string; affectedCapability?: string; blockedScope?: Scope; resolutionPath?: string; resolverAuthority?: "HUMAN_ARCHITECT" | "SPECIALIST" | "REGULATOR" | "UNKNOWN" };
export type LearningEvent = { learningId: string; observationIds: string[]; candidateKnowledgeIds: string[]; challengeIds: string[]; promotionDecision: "NONE" | "HUMAN_REVIEW_REQUIRED" | "PROMOTE" | "REJECT"; epistemicStatus: EpistemicStatus };
export type HazardRecord = { hazardId: string; statement: string; status: "READY_FOR_CANONIZATION_PROPOSAL" | "PROVISIONAL" | "HUMAN_CONFIRMED" | "UNKNOWN" };

export type M0KSemanticFixture = {
  evidence: EvidenceRecord;
  condition: KnowledgeItem;
  requirement: KnowledgeItem;
  designQuestion: KnowledgeItem;
  strategy: StrategyRecord;
  realizations: [RealizationRecord, RealizationRecord];
  expectedEffect: RationaleEdge;
  evaluation: EvidenceRecord;
  learningCandidate: LearningEvent;
};

export function sourceMayBeIngested(source: SourceRecord): boolean {
  return source.ingestionStatus === "ALLOWED" && source.rightsStatus !== "COPYRIGHTED" && source.accessStatus === "AVAILABLE";
}

export function rationaleTrace(startNode: string, edges: RationaleEdge[]): string[] {
  const trace = [startNode];
  let current = startNode;
  const visited = new Set<string>();
  while (!visited.has(current)) {
    visited.add(current);
    const edge = edges.find((candidate) => candidate.fromNode === current);
    if (!edge) break;
    trace.push(edge.relation, edge.toNode);
    current = edge.toNode;
  }
  return trace;
}

export function isIncompleteUnknown(unknown: UnknownRecord): boolean {
  return !unknown.resolutionPath || !unknown.resolverAuthority;
}

export function promoteOnlyAfterHumanReview(event: LearningEvent): boolean {
  return event.promotionDecision === "PROMOTE" && event.epistemicStatus === "HUMAN_CONFIRMED";
}

export function applyCounterexample(counterexample: CounterexampleRecord): CounterexampleRecord {
  return { ...counterexample, preservedOriginal: true };
}

export function createGenericSemanticFixture(): M0KSemanticFixture {
  const evidence: EvidenceRecord = { evidenceId: "M0K-E-001", statement: "A user activity requires a legible transition between two operating states.", evidenceType: "OBSERVATION", epistemicStatus: "OBSERVED" };
  const condition: KnowledgeItem = { knowledgeId: "M0K-K-001", kind: "FACT", statement: "The transition must be identifiable to the user.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", evidenceIds: [evidence.evidenceId], provenance: "ARKI_ABSTRACTION" };
  const requirement: KnowledgeItem = { knowledgeId: "M0K-K-002", kind: "RELATIONSHIP", statement: "Transition cues should remain visible from the approach path.", epistemicStatus: "HYPOTHESIS", kState: "K2_CANDIDATE", evidenceIds: [evidence.evidenceId], provenance: "ARKI_ABSTRACTION" };
  const designQuestion: KnowledgeItem = { knowledgeId: "M0K-K-003", kind: "HUMAN_DECISION", statement: "Which transition strategy best fits this context?", epistemicStatus: "UNKNOWN", kState: "UNKNOWN", evidenceIds: [], provenance: "UNKNOWN" };
  const strategy: StrategyRecord = { strategyId: "M0K-S-001", statement: "Make the transition legible through spatial sequence and controlled threshold." };
  const realizations: [RealizationRecord, RealizationRecord] = [
    { realizationId: "M0K-R-001", description: "Sequential threshold with a compressed entry zone.", strategyIds: [strategy.strategyId] },
    { realizationId: "M0K-R-002", description: "Open threshold with a visible landmark and direct route.", strategyIds: [strategy.strategyId] },
  ];
  const expectedEffect: RationaleEdge = { rationaleId: "M0K-W-001", fromNode: realizations[0].realizationId, relation: "EXPECTED_EFFECT", toNode: "M0K-EFFECT-001", evidenceIds: [evidence.evidenceId], epistemicStatus: "HYPOTHESIS" };
  const evaluation: EvidenceRecord = { evidenceId: "M0K-E-002", statement: "Evaluation fixture: both realizations preserve legibility but differ in sequence and openness.", evidenceType: "TEST", epistemicStatus: "OBSERVED" };
  const learningCandidate: LearningEvent = { learningId: "M0K-L-001", observationIds: [evaluation.evidenceId], candidateKnowledgeIds: [condition.knowledgeId, requirement.knowledgeId], challengeIds: [], promotionDecision: "HUMAN_REVIEW_REQUIRED", epistemicStatus: "HYPOTHESIS" };
  return { evidence, condition, requirement, designQuestion, strategy, realizations, expectedEffect, evaluation, learningCandidate };
}
