export const LKS_SCHEMA_VERSION = "1.0" as const;

export type LivingCodebookId = "LKC-001-IFC" | "LKC-002-SMART-CITIES" | "LKC-003-URBAN-DIGITAL-TWIN";
export type KnowledgeState = "DISCOVERED" | "EXTRACTED" | "PENDING_CURATION" | "VERIFIED" | "PARTIALLY_VERIFIED" | "NOT_VERIFIED" | "REJECTED" | "UNKNOWN" | "CONFLICT" | "STALE" | "SUPERSEDED" | "STAGED" | "ASSESSED_FOR_ARKI" | "CANONICAL_CANDIDATE" | "CANONICAL";
export type SourceType = "NORMATIVE_STANDARD" | "TECHNICAL_SPECIFICATION" | "DRAFT" | "OFFICIAL_GUIDANCE" | "REFERENCE_MODEL" | "SCIENTIFIC_EVIDENCE" | "IMPLEMENTATION_EXAMPLE" | "INDUSTRY_PRACTICE" | "VENDOR_CLAIM" | "COMMENTARY" | "UNKNOWN";
export type ApplicabilityScale = "COMPONENT" | "OBJECT" | "SYSTEM" | "BUILDING" | "SITE" | "CITY" | "TERRITORY" | "LIFECYCLE" | "UNKNOWN";
export type CapabilityDimension = "REPRESENT" | "CREATE" | "READ" | "MODIFY" | "REASON" | "VALIDATE" | "GENERATE" | "SIMULATE" | "IMPORT" | "EXPORT" | "ROUND_TRIP" | "LOSS_DETECTION";
export type CapabilityStatus = "ABSENT" | "EXISTS" | "PARTIAL" | "MAPPED" | "SEMANTICALLY_ALIGNED" | "COMPATIBLE_WITH_MAPPING" | "ARKI_SUPERSET" | "EXTERNAL_SUPERSET" | "SEMANTIC_MISMATCH" | "NOT_DEMONSTRATED" | "UNKNOWN" | "ARCHITECTURAL_DECISION_REQUIRED";
export type ChangeType = "NEW_STANDARD" | "NEW_VERSION" | "AMENDMENT" | "CORRIGENDUM" | "DEPRECATION" | "SUPERSESSION" | "NEW_SCHEMA" | "NEW_ENTITY" | "CHANGED_ENTITY" | "NEW_PROPERTY_SET" | "CHANGED_REQUIREMENT" | "NEW_GUIDANCE" | "NEW_API" | "NEW_IMPLEMENTATION_GUIDE" | "NEW_CERTIFICATION_RULE" | "NEW_RESEARCH_RELEVANT_TO_ARKI" | "SOURCE_REMOVED" | "SOURCE_STATUS_CHANGED";
export type GapStatus = "OPEN" | "ASSESSED" | "CANDIDATE" | "DEFERRED" | "CLOSED" | "UNKNOWN";

export type Evidence = { evidenceId: string; sourceUri: string; excerpt: string; locator?: string; observedAt: string; hash: string };
export type ClaimAssessment = { sourceAuthority: "PASS" | "FAIL" | "UNKNOWN"; sourceAuthenticity: "PASS" | "FAIL" | "UNKNOWN"; version: "PASS" | "FAIL" | "UNKNOWN"; currentness: "PASS" | "FAIL" | "UNKNOWN"; claimSupport: "PASS" | "FAIL" | "UNKNOWN"; semanticMapping: "PASS" | "FAIL" | "UNKNOWN"; arkiImplementation: "PASS" | "FAIL" | "UNKNOWN"; conflicts: "PASS" | "FAIL" | "UNKNOWN"; unknown: string[] };
export type LivingKnowledgeRecord = {
  externalId: string; canonicalName: string; codebook: LivingCodebookId; sourceOrganization: string; sourceType: SourceType; sourceVersion: string; publicationStatus: string; publicationDate: string; officialSource: boolean; firstObserved: string; lastChecked: string; lastChanged?: string; supersedes?: string[]; supersededBy?: string; meaning: string; parent?: string; children: string[]; relationships: string[]; applicableScales: ApplicabilityScale[]; disciplines: string[]; jurisdiction: string[]; applicability: string[]; arkiEquivalent?: string; arkiInternalId?: string; arkiOwner?: string; mappingType?: string; evidence: Evidence[]; epistemicState: KnowledgeState; unknowns: string[]; gaps: string[]; implementationRequirement?: string; humanDecisionRequired: boolean; history: Array<{ state: KnowledgeState; at: string; actor: string; reason: string }>;
};
export type CapabilityAssessment = { externalConcept: string; codebook: LivingCodebookId; dimension: CapabilityDimension; status: CapabilityStatus; evidenceRefs: string[]; unknowns: string[]; humanDecisionRequired: boolean };
export type KnowledgeGap = { gapId: string; codebook: LivingCodebookId; externalConcept: string; arkiCapability: string; gapType: "ABSENT" | "PARTIAL" | "MISMATCH" | "UNVERIFIED" | "DECISION"; evidence: string[]; impact: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN"; dependencies: string[]; applicableScale: ApplicabilityScale[]; discipline: string[]; implementationCandidate?: string; status: GapStatus; humanDecisionRequired: boolean };
export type ChangeDelta = { changeId: string; codebook: LivingCodebookId; externalId: string; type: ChangeType; previousFingerprint?: string; currentFingerprint: string; materiality: "NO_MATERIAL_IMPACT" | "MATERIAL_IMPACT" | "ARCHITECTURAL_IMPACT" | "UNKNOWN"; evidenceRefs: string[]; humanDecisionRequired: boolean; unknowns: string[] };
export type CycleResult = { runId: string; checkedAt: string; result: "NO_RELEVANT_CHANGE" | "CHANGES_RECORDED" | "HUMAN_DECISION_REQUIRED" | "UNKNOWN"; sourceIds: string[]; versionsObserved: string[]; deltas: ChangeDelta[]; closedAutomatically: boolean; schedulerImplementation: "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED" };

const transitions: Record<KnowledgeState, readonly KnowledgeState[]> = {
  DISCOVERED: ["EXTRACTED", "REJECTED", "UNKNOWN"], EXTRACTED: ["PENDING_CURATION", "REJECTED", "UNKNOWN"], PENDING_CURATION: ["VERIFIED", "PARTIALLY_VERIFIED", "NOT_VERIFIED", "REJECTED", "CONFLICT", "UNKNOWN"], VERIFIED: ["STAGED", "STALE", "SUPERSEDED", "CONFLICT"], PARTIALLY_VERIFIED: ["STAGED", "VERIFIED", "STALE", "SUPERSEDED", "CONFLICT"], NOT_VERIFIED: ["PENDING_CURATION", "REJECTED", "UNKNOWN"], REJECTED: ["DISCOVERED"], UNKNOWN: ["DISCOVERED", "EXTRACTED", "PENDING_CURATION", "REJECTED"], CONFLICT: ["PENDING_CURATION", "VERIFIED", "REJECTED", "UNKNOWN"], STALE: ["DISCOVERED", "SUPERSEDED", "PENDING_CURATION"], SUPERSEDED: [], STAGED: ["ASSESSED_FOR_ARKI", "STALE", "SUPERSEDED"], ASSESSED_FOR_ARKI: ["CANONICAL_CANDIDATE", "STAGED", "STALE", "CONFLICT"], CANONICAL_CANDIDATE: ["CANONICAL", "REJECTED", "CONFLICT", "STALE"], CANONICAL: ["STALE", "SUPERSEDED"]
};

function stable(value: unknown): string { if (value === null || typeof value !== "object") return JSON.stringify(value); if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`; return `{${Object.keys(value as Record<string, unknown>).sort().map((key) => `${JSON.stringify(key)}:${stable((value as Record<string, unknown>)[key])}`).join(",")}}`; }
function fingerprint(value: unknown): string { let hash = 2166136261; for (const char of stable(value)) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`; }

export function canTransitionKnowledgeState(from: KnowledgeState, to: KnowledgeState): boolean { return transitions[from].includes(to); }
export function transitionKnowledgeState(record: LivingKnowledgeRecord, to: KnowledgeState, actor: "RESEARCHER" | "CURATOR" | "HUMAN_AUTHORITY" | "SYSTEM", at: string, reason: string): LivingKnowledgeRecord {
  if (!canTransitionKnowledgeState(record.epistemicState, to)) throw new Error(`LKS_ILLEGAL_TRANSITION:${record.epistemicState}->${to}`);
  if ((to === "CANONICAL_CANDIDATE" || to === "CANONICAL") && actor !== "HUMAN_AUTHORITY") throw new Error("LKS_HUMAN_AUTHORITY_REQUIRED");
  if (to === "VERIFIED" && actor === "RESEARCHER") throw new Error("LKS_RESEARCHER_CANNOT_SELF_VALIDATE");
  return { ...record, epistemicState: to, history: [...record.history, { state: to, at, actor, reason }] };
}

export function assertAdversarialClaimAssessment(assessment: ClaimAssessment): void {
  const values = Object.values(assessment).filter((value) => typeof value === "string") as string[];
  if (values.includes("FAIL")) return;
  if (values.includes("UNKNOWN") || assessment.unknown.length > 0) throw new Error("LKS_INSUFFICIENT_EVIDENCE");
}
export function curateClaim(record: LivingKnowledgeRecord, assessment: ClaimAssessment, actor: "CURATOR" | "HUMAN_AUTHORITY", at: string): LivingKnowledgeRecord {
  if (actor !== "CURATOR" && actor !== "HUMAN_AUTHORITY") throw new Error("LKS_CURATOR_REQUIRED");
  if (assessment.sourceAuthority === "FAIL" || assessment.sourceAuthenticity === "FAIL" || assessment.claimSupport === "FAIL") return transitionKnowledgeState(record, "REJECTED", actor, at, "ACP failed source or claim support");
  if (assessment.unknown.length > 0 || Object.values(assessment).some((value) => value === "UNKNOWN")) return transitionKnowledgeState(record, "PARTIALLY_VERIFIED", actor, at, "ACP unresolved dimensions");
  return transitionKnowledgeState(record, "VERIFIED", actor, at, "ACP survived adversarial review");
}

export function assessCapability(input: Omit<CapabilityAssessment, "humanDecisionRequired"> & { humanDecisionRequired?: boolean }): CapabilityAssessment { return { ...input, humanDecisionRequired: input.humanDecisionRequired ?? input.status === "ARCHITECTURAL_DECISION_REQUIRED" }; }
export function deriveCapabilityAtlas(records: readonly LivingKnowledgeRecord[], assessments: readonly CapabilityAssessment[]): CapabilityAssessment[] { return assessments.filter((assessment) => records.some((record) => record.externalId === assessment.externalConcept)); }
export function deriveGaps(assessments: readonly CapabilityAssessment[]): KnowledgeGap[] { return assessments.filter((item) => ["ABSENT", "PARTIAL", "SEMANTIC_MISMATCH", "NOT_DEMONSTRATED", "UNKNOWN", "ARCHITECTURAL_DECISION_REQUIRED", "EXTERNAL_SUPERSET"].includes(item.status)).map((item) => ({ gapId: `gap:${item.codebook}:${item.externalConcept}:${item.dimension}`, codebook: item.codebook, externalConcept: item.externalConcept, arkiCapability: item.dimension, gapType: item.status === "ARCHITECTURAL_DECISION_REQUIRED" ? "DECISION" : item.status === "NOT_DEMONSTRATED" || item.status === "UNKNOWN" ? "UNVERIFIED" : item.status === "SEMANTIC_MISMATCH" ? "MISMATCH" : item.status === "ABSENT" ? "ABSENT" : "PARTIAL", evidence: item.evidenceRefs, impact: item.status === "ABSENT" || item.status === "EXTERNAL_SUPERSET" ? "HIGH" : "UNKNOWN", dependencies: [], applicableScale: ["UNKNOWN"], discipline: [], status: "OPEN", humanDecisionRequired: item.humanDecisionRequired || item.status === "ARCHITECTURAL_DECISION_REQUIRED" })); }
export function detectChanges(previous: LivingKnowledgeRecord | undefined, current: LivingKnowledgeRecord): ChangeDelta[] { const currentFingerprint = fingerprint(current); if (!previous) return [{ changeId: `change:${current.codebook}:${current.externalId}:NEW`, codebook: current.codebook, externalId: current.externalId, type: "NEW_STANDARD", currentFingerprint, materiality: "UNKNOWN", evidenceRefs: current.evidence.map((item) => item.evidenceId), humanDecisionRequired: true, unknowns: ["NO_PREVIOUS_RECORD"] }]; const previousFingerprint = fingerprint(previous); if (previousFingerprint === currentFingerprint) return []; const type: ChangeType = previous.sourceVersion !== current.sourceVersion ? "NEW_VERSION" : previous.publicationStatus !== current.publicationStatus ? "SOURCE_STATUS_CHANGED" : "CHANGED_ENTITY"; const materiality = current.humanDecisionRequired ? "ARCHITECTURAL_IMPACT" : "UNKNOWN"; return [{ changeId: `change:${current.codebook}:${current.externalId}:${type}`, codebook: current.codebook, externalId: current.externalId, type, previousFingerprint, currentFingerprint, materiality, evidenceRefs: current.evidence.map((item) => item.evidenceId), humanDecisionRequired: materiality === "ARCHITECTURAL_IMPACT", unknowns: [] }]; }
export function runLivingKnowledgeCycle(input: { runId: string; checkedAt: string; records: readonly LivingKnowledgeRecord[]; previousRecords: readonly LivingKnowledgeRecord[]; sourceIds: readonly string[]; versionsObserved: readonly string[] }): CycleResult { const deltas = input.records.flatMap((record) => detectChanges(input.previousRecords.find((previous) => previous.externalId === record.externalId), record)); const result = deltas.some((delta) => delta.humanDecisionRequired) ? "HUMAN_DECISION_REQUIRED" : deltas.length > 0 ? "CHANGES_RECORDED" : "NO_RELEVANT_CHANGE"; return { runId: input.runId, checkedAt: input.checkedAt, result, sourceIds: [...input.sourceIds], versionsObserved: [...input.versionsObserved], deltas, closedAutomatically: result === "NO_RELEVANT_CHANGE" || (result === "CHANGES_RECORDED" && deltas.every((delta) => delta.materiality === "NO_MATERIAL_IMPACT")), schedulerImplementation: "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED" }; }

export const LIVING_CODEBOOKS: ReadonlyArray<{ id: LivingCodebookId; name: string; primarySourcePolicy: string }> = [
  { id: "LKC-001-IFC", name: "IFC / openBIM", primarySourcePolicy: "buildingSMART official publication" },
  { id: "LKC-002-SMART-CITIES", name: "Smart Cities", primarySourcePolicy: "ISO/TC 268 and official standards bodies" },
  { id: "LKC-003-URBAN-DIGITAL-TWIN", name: "Urban Digital Twins", primarySourcePolicy: "official standards bodies and primary scientific evidence" },
];

export const LKS_SCHEDULER_STATUS = "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED" as const;

export type KnowledgeImpact = "NO_IMPACT" | "POSSIBLE_IMPACT" | "MATERIAL_IMPACT" | "UNKNOWN" | "HUMAN_DECISION_REQUIRED";
export type MappingType = "DIRECT" | "PARTIAL" | "CONTEXTUAL" | "REFERENCE_ONLY" | "POTENTIAL" | "CONFLICT" | "UNKNOWN";
export type CompetencyRevalidationState = "STILL_VALID" | "REVIEW_REQUIRED" | "PARTIALLY_STALE" | "STALE" | "UNKNOWN";
export type CurriculumStatus = "KNOWN" | "STRUCTURED" | "PRACTICED" | "DEMONSTRATED" | "VERIFIED" | "PARTIAL" | "NOT_DEMONSTRATED" | "STALE" | "UNKNOWN";
export type KnowledgeLayer = "GENERAL_KNOWLEDGE" | "DOMAIN_KNOWLEDGE" | "PROJECT_SPECIFIC_KNOWLEDGE";

export type CurriculumViewItem = {
  curriculumItemId: string;
  canonicalName: string;
  domain: string;
  discipline: string[];
  applicableScales: ApplicabilityScale[];
  knowledgePrerequisites: string[];
  competencyPrerequisites: string[];
  learningObjectives: string[];
  requiredKnowledge: string[];
  requiredCapabilities: string[];
  sourceClaims: string[];
  standardsReferences: string[];
  regulatoryReferences: string[];
  epistemicState: KnowledgeState;
  competencyState: CurriculumStatus;
  evidence: string[];
  tests: string[];
  heldOutTests: string[];
  deficits: string[];
  lastReviewed: string;
  lastChanged: string;
  stalenessStatus: "CURRENT" | "REVALIDATION_REQUIRED" | "STALE" | "UNKNOWN";
  humanDecisionRequired: boolean;
};

export type StandardsKnowledgeRecord = {
  standardId: string;
  organization: string;
  standardNumber: string;
  canonicalTitle: string;
  edition: string;
  publicationYear: string;
  publicationDate: string;
  status: "CURRENT" | "PUBLISHED" | "AMENDED" | "CORRIGENDUM" | "UNDER_REVIEW" | "UNDER_DEVELOPMENT" | "DRAFT" | "SUPERSEDED" | "WITHDRAWN" | "UNKNOWN";
  amendments: string[];
  corrigenda: string[];
  supersedes: string[];
  supersededBy: string[];
  officialSource: string;
  domains: string[];
  disciplines: string[];
  applicableScales: ApplicabilityScale[];
  jurisdiction: string[];
  authorityLevel: SourceType;
  relatedStandards: string[];
  concepts: string[];
  requirements: string[];
  indicators: string[];
  arkiMappings: Array<{ target: string; type: MappingType }>;
  curriculumMappings: string[];
  competencyMappings: string[];
  capabilityMappings: string[];
  implementationMappings: string[];
  evidence: string[];
  lastChecked: string;
  curatorStatus: KnowledgeState;
  unknowns: string[];
};

export type CurriculumDelta = {
  deltaId: string;
  triggeringChange: string;
  source: string;
  previousState: string;
  newEvidence: string[];
  affectedKnowledge: string[];
  affectedCurriculumItems: string[];
  affectedCompetencies: string[];
  proposedAddition: string[];
  proposedModification: string[];
  proposedDeprecation: string[];
  revalidationRequired: boolean;
  impact: KnowledgeImpact;
  unknowns: string[];
  humanDecisionRequired: boolean;
};

export type CompetencyRevalidation = {
  competencyId: string;
  state: CompetencyRevalidationState;
  demonstratedAgainstKnowledge: string[];
  demonstratedAt: string;
  evidence: string[];
  changedAfterwards: string[];
  reason: string;
  humanDecisionRequired: boolean;
};

export type IntegratedKnowledgePackage = {
  packageId: string;
  asOf: string;
  knowledge: string[];
  sources: string[];
  claims: string[];
  evidence: string[];
  standards: string[];
  curriculum: string[];
  competencies: string[];
  capabilities: string[];
  gaps: string[];
  temporalHistory: string[];
  owners: Record<string, string>;
  derivedViews: string[];
  unknowns: string[];
  canonicalPromotionAllowed: false;
};

export type KnowledgeConflict = {
  conflictId: string;
  left: string;
  right: string;
  status: "NO_CONFLICT" | "POTENTIAL_CONFLICT" | "CONFIRMED_CONFLICT" | "RESOLVED_WITH_EVIDENCE" | "HUMAN_DECISION_REQUIRED" | "UNKNOWN";
  evidence: string[];
  humanDecisionRequired: boolean;
};

export const LKS_CANONICAL_CANDIDATE_POLICY = "ARCHITECTURAL_DECISION_REQUIRED" as const;

export function deriveCurriculumView(input: { historicalItems: readonly CurriculumViewItem[]; inventoryEvidence: readonly string[]; capabilityEvidence: readonly string[]; gaps: readonly string[] }): CurriculumViewItem[] {
  const evidence = Array.from(new Set([...input.inventoryEvidence, ...input.capabilityEvidence]));
  return input.historicalItems.map((item) => ({ ...item, evidence: Array.from(new Set([...item.evidence, ...evidence.filter((ref) => ref.includes(item.curriculumItemId) || ref.includes(item.canonicalName))])) }));
}

export function createCurriculumDelta(input: Omit<CurriculumDelta, "humanDecisionRequired"> & { humanDecisionRequired?: boolean }): CurriculumDelta {
  const requiresDecision = input.humanDecisionRequired ?? (input.impact === "MATERIAL_IMPACT" || input.impact === "HUMAN_DECISION_REQUIRED" || input.revalidationRequired);
  return { ...input, humanDecisionRequired: requiresDecision };
}

export function revalidateCompetency(input: { competencyId: string; knowledgeVersionChanged: boolean; materialRequirementChanged: boolean; evidence: string[]; demonstratedAgainstKnowledge: string[]; demonstratedAt: string; changedAfterwards: string[] }): CompetencyRevalidation {
  const state: CompetencyRevalidationState = input.materialRequirementChanged ? "REVIEW_REQUIRED" : input.knowledgeVersionChanged ? "PARTIALLY_STALE" : "STILL_VALID";
  return { competencyId: input.competencyId, state, demonstratedAgainstKnowledge: [...input.demonstratedAgainstKnowledge], demonstratedAt: input.demonstratedAt, evidence: [...input.evidence], changedAfterwards: [...input.changedAfterwards], reason: state === "STILL_VALID" ? "No material knowledge change" : "Historical evidence preserved; revalidation analysis required", humanDecisionRequired: state !== "STILL_VALID" };
}

export function assessStandardsChangeImpact(input: { previous: StandardsKnowledgeRecord; current: StandardsKnowledgeRecord; affectedCurriculumItems: string[]; affectedCompetencies: string[]; affectedCapabilities: string[] }): CurriculumDelta {
  const material = input.previous.edition !== input.current.edition || input.previous.status !== input.current.status || input.previous.requirements.join("|") !== input.current.requirements.join("|");
  return createCurriculumDelta({ deltaId: `delta:${input.current.standardId}:${input.current.edition}`, triggeringChange: input.current.standardId, source: input.current.officialSource, previousState: `${input.previous.edition}:${input.previous.status}`, newEvidence: [...input.current.evidence], affectedKnowledge: [input.current.standardId], affectedCurriculumItems: [...input.affectedCurriculumItems], affectedCompetencies: [...input.affectedCompetencies], proposedAddition: [], proposedModification: material ? [...input.affectedCurriculumItems] : [], proposedDeprecation: input.current.status === "SUPERSEDED" ? [...input.affectedCurriculumItems] : [], revalidationRequired: material, impact: material ? "MATERIAL_IMPACT" : "NO_IMPACT", unknowns: [...input.current.unknowns], humanDecisionRequired: material || input.current.unknowns.length > 0 });
}

export function buildIntegratedKnowledgePackage(input: { packageId: string; asOf: string; records: readonly LivingKnowledgeRecord[]; standards: readonly StandardsKnowledgeRecord[]; curriculum: readonly CurriculumViewItem[]; competencies: readonly CompetencyRevalidation[]; capabilities: readonly CapabilityAssessment[]; gaps: readonly KnowledgeGap[]; history: readonly string[] }): IntegratedKnowledgePackage {
  return { packageId: input.packageId, asOf: input.asOf, knowledge: input.records.map((record) => record.externalId), sources: Array.from(new Set(input.records.flatMap((record) => record.evidence.map((evidence) => evidence.sourceUri)))), claims: input.records.map((record) => record.meaning), evidence: Array.from(new Set(input.records.flatMap((record) => record.evidence.map((evidence) => evidence.evidenceId)))), standards: input.standards.map((standard) => standard.standardId), curriculum: input.curriculum.map((item) => item.curriculumItemId), competencies: input.competencies.map((item) => item.competencyId), capabilities: input.capabilities.map((item) => `${item.codebook}:${item.externalConcept}:${item.dimension}`), gaps: input.gaps.map((gap) => gap.gapId), temporalHistory: [...input.history], owners: { knowledge: "ARKI-LKS-001", standards: "ARKI-LKS-001", curriculum: "DERIVED_VIEW_OVER_AKI-001_AND_LKS", competencies: "DERIVED_VIEW_OVER_EVIDENCE", capabilities: "ARKI-LKS-001", gaps: "ARKI-LKS-001" }, derivedViews: ["CURRICULUM_VIEW", "CAPABILITY_ATLAS", "GAP_REGISTER", "STANDARDS_COVERAGE_VIEW", "ARCHITECT_VIEW", "TECHNICAL_VIEW", "EXECUTIVE_CHANGE_VIEW"], unknowns: Array.from(new Set([...input.records.flatMap((record) => record.unknowns), ...input.standards.flatMap((standard) => standard.unknowns)])), canonicalPromotionAllowed: false };
}

export function detectKnowledgeConflict(input: { conflictId: string; left: string; right: string; evidence: string[]; contradiction: boolean }): KnowledgeConflict { return { conflictId: input.conflictId, left: input.left, right: input.right, status: input.contradiction ? "HUMAN_DECISION_REQUIRED" : "NO_CONFLICT", evidence: [...input.evidence], humanDecisionRequired: input.contradiction }; }

export function assertNoParallelTruth(owners: Record<string, string>): void { const values = Object.values(owners); if (values.some((owner) => /(^|_|-)SECOND|(^|_|-)PARALLEL|#2|_2\b/i.test(owner))) throw new Error("LKS_PARALLEL_TRUTH_OWNER"); }

export type ForesightValidationStatus = "VERIFIED" | "PARTIAL" | "UNKNOWN" | "REJECTED" | "CONFLICT" | "INSUFFICIENT_EVIDENCE";
export type ForesightActivationMode = "PERIODIC_CHECK" | "PROJECT_NEED" | "UNKNOWN_RESOLUTION" | "STANDARD_CHANGE_CHECK" | "CURATOR_VERIFICATION" | "FORESIGHT_REVIEW" | "HUMAN_REQUEST";
export type ForesightGovernanceLevel = "LEVEL_A_ROUTINE_MAINTENANCE" | "LEVEL_B_APPROVED_CURRICULUM_EVOLUTION" | "LEVEL_C_STRATEGIC_CURRICULUM_CHANGE";
export type ForesightPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";

export type ForesightSignal = {
  signalId: string;
  source: string;
  sourceType: "PRIMARY" | "SECONDARY" | "PROJECT" | "MARKET" | "SOCIETAL" | "SCIENTIFIC" | "STANDARD" | "REGULATORY" | "TECHNOLOGY" | "USER" | "INTERNAL";
  detectedAt: string;
  domain: string;
  discipline: string[];
  applicableScales: ApplicabilityScale[];
  jurisdiction: string[];
  description: string;
  evidence: string[];
  curatorStatus: ForesightValidationStatus;
  novelty: ForesightPriority;
  relevance: ForesightPriority;
  persistence: ForesightPriority;
  uncertainty: ForesightPriority;
  relatedKnowledge: string[];
  relatedCompetencies: string[];
  relatedCapabilities: string[];
  relatedStandards: string[];
  relatedProjects: string[];
};

export type LearningNeedCandidate = {
  needId: string;
  canonicalName: string;
  sourceSignals: string[];
  evidence: string[];
  curatorStatus: ForesightValidationStatus;
  domain: string;
  discipline: string[];
  applicableScales: ApplicabilityScale[];
  jurisdiction: string[];
  currentARKIKnowledge: string[];
  currentARKICompetency: string[];
  currentARKICapability: string[];
  requiredKnowledge: string[];
  requiredCompetency: string[];
  requiredCapability: string[];
  knowledgeGap: boolean;
  competencyGap: boolean;
  capabilityGap: boolean;
  societalRelevance: ForesightPriority;
  professionalRelevance: ForesightPriority;
  projectRelevance: ForesightPriority;
  standardsRelevance: ForesightPriority;
  regulatoryRelevance: ForesightPriority;
  scientificRelevance: ForesightPriority;
  technologyRelevance: ForesightPriority;
  urgency: ForesightPriority;
  persistence: ForesightPriority;
  dependencies: string[];
  proposedCurriculumImpact: string[];
  proposedRevalidationImpact: string[];
  unknowns: string[];
  conflicts: string[];
  humanDecisionRequired: boolean;
  governanceLevel: ForesightGovernanceLevel;
};

export type ResearchActivation = {
  mode: ForesightActivationMode;
  purpose: string;
  scope: string[];
  sourcePolicy: string;
  budget: { maxSources: number; maxDurationMinutes: number };
  stoppingConditions: string[];
  evidenceRequirements: string[];
  schedulerStatus: "NOT_DEMONSTRATED" | "EXTERNAL_ORCHESTRATION_REQUIRED";
};

export type ResearchBudgetResult = {
  sourcesChecked: number;
  authoritativeSourcesChecked: number;
  newSignals: number;
  verifiedSignals: number;
  rejectedSignals: number;
  materialChanges: number;
  learningNeedsGenerated: number;
  cost: string;
  durationMinutes: number;
  evidenceYield: number;
  usefulNovelty: number;
  stoppedBy: "AUTHORITATIVE_ANSWER" | "SUFFICIENT_EVIDENCE" | "NO_RELEVANT_CHANGE" | "DIMINISHING_YIELD" | "BUDGET_REACHED" | "UNRESOLVED_CONFLICT" | "SOURCE_ACCESS_LIMITATION" | "HUMAN_DECISION_REQUIRED";
};

export const KCF_SCHEDULER_STATUS = "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED" as const;
export const KCF_INTERNET_POLICY = "INTERNET_AVAILABLE_ON_DEMAND / RESEARCH_ACTIVATED_BY_POLICY" as const;

export function validateForesightSignal(signal: ForesightSignal): ForesightValidationStatus {
  if (signal.sourceType === "INTERNAL") return "REJECTED";
  if (signal.evidence.length === 0) return "INSUFFICIENT_EVIDENCE";
  if (signal.uncertainty === "CRITICAL" || signal.curatorStatus === "CONFLICT") return "UNKNOWN";
  return signal.curatorStatus;
}

export function createLearningNeedCandidate(input: Omit<LearningNeedCandidate, "humanDecisionRequired"> & { humanDecisionRequired?: boolean }): LearningNeedCandidate {
  const status = input.curatorStatus;
  const requiresDecision = input.humanDecisionRequired ?? (input.governanceLevel === "LEVEL_C_STRATEGIC_CURRICULUM_CHANGE" || status === "CONFLICT" || status === "UNKNOWN" || status === "INSUFFICIENT_EVIDENCE");
  return { ...input, humanDecisionRequired: requiresDecision };
}

export function prioritizeLearningNeed(candidate: LearningNeedCandidate): LearningNeedCandidate {
  const strategic = candidate.governanceLevel === "LEVEL_C_STRATEGIC_CURRICULUM_CHANGE";
  return { ...candidate, humanDecisionRequired: candidate.humanDecisionRequired || strategic || candidate.curatorStatus !== "VERIFIED" };
}

export function createResearchActivation(input: Omit<ResearchActivation, "schedulerStatus">): ResearchActivation { return { ...input, schedulerStatus: "NOT_DEMONSTRATED" }; }

export function createLearningNeedFromProjectFeedback(input: { needId: string; canonicalName: string; projectId: string; repeatedUnknown: boolean; repeatedFailure: boolean; evidence: string[]; discipline: string[]; scale: ApplicabilityScale }): LearningNeedCandidate {
  const gap = input.repeatedUnknown || input.repeatedFailure;
  return createLearningNeedCandidate({ needId: input.needId, canonicalName: input.canonicalName, sourceSignals: [`project:${input.projectId}`], evidence: [...input.evidence], curatorStatus: input.evidence.length > 0 ? "PARTIAL" : "INSUFFICIENT_EVIDENCE", domain: "PROJECT_FEEDBACK", discipline: [...input.discipline], applicableScales: [input.scale], jurisdiction: [], currentARKIKnowledge: [], currentARKICompetency: [], currentARKICapability: [], requiredKnowledge: [], requiredCompetency: [], requiredCapability: [], knowledgeGap: input.repeatedUnknown, competencyGap: input.repeatedFailure, capabilityGap: input.repeatedFailure, societalRelevance: "UNKNOWN", professionalRelevance: "MEDIUM", projectRelevance: "HIGH", standardsRelevance: "UNKNOWN", regulatoryRelevance: "UNKNOWN", scientificRelevance: "UNKNOWN", technologyRelevance: "UNKNOWN", urgency: gap ? "HIGH" : "LOW", persistence: gap ? "HIGH" : "LOW", dependencies: [], proposedCurriculumImpact: gap ? ["ROOT_CAUSE_ANALYSIS_REQUIRED"] : [], proposedRevalidationImpact: [], unknowns: gap ? [] : ["No repeated signal"], conflicts: [], governanceLevel: "LEVEL_B_APPROVED_CURRICULUM_EVOLUTION" });
}

export function assertForesightCannotModifyProduct(candidate: LearningNeedCandidate): void { if (candidate.proposedCurriculumImpact.some((item) => /CODE|KERNEL|IMPLEMENT/i.test(item))) throw new Error("KCF_NO_AUTO_CODE_CHANGE"); }

export type ACIResult = "WINNER" | "RUNNER_UP" | "THIRD_PRIZE" | "HONORABLE_MENTION" | "SPECIAL_MENTION" | "FINALIST" | "SHORTLISTED" | "NON_WINNER" | "DISQUALIFIED" | "UNKNOWN";
export type ACIEpistemicStatus = "DOCUMENTED" | "OBSERVED" | "INFERRED" | "HYPOTHESIZED" | "UNKNOWN";
export type ACIRightsStatus = "PUBLIC_METADATA" | "PUBLICLY_VIEWABLE" | "DOWNLOADABLE" | "LICENSED" | "OPEN_LICENSE" | "RESTRICTED" | "COPYRIGHTED" | "UNKNOWN_RIGHTS";
export type ACIAnalysisStatus = "NOT_ANALYZED" | "PARTIAL" | "ANALYZED" | "UNKNOWN";
export type ACIComplianceStatus = "COMPLIANT" | "PARTIALLY_COMPLIANT" | "NONCOMPLIANT" | "DISQUALIFIED" | "UNKNOWN";

export type CompetitionRecord = {
  competitionId: string; canonicalName: string; organizer: string; country: string; city: string; site: string; year: number;
  competitionType: "PROFESSIONAL" | "STUDENT" | "YOUNG_ARCHITECT" | "OPEN" | "RESTRICTED";
  brief: string; program: string[]; requirements: string[]; constraints: string[]; eligibility: string[]; evaluationCriteria: string[];
  jury: string[]; juryReport: string[]; submissionsKnown: number; submissionsAvailable: number; prizes: string[]; results: ACIResult[];
  officialSources: string[]; archiveSources: string[]; copyrightStatus: ACIRightsStatus; accessStatus: ACIRightsStatus;
  builtOutcome: "BUILT" | "UNBUILT" | "PARTIAL" | "UNKNOWN"; implementationStatus: string; evidence: string[]; provenance: string[]; unknowns: string[];
};

export type CompetitionProposalRecord = {
  proposalId: string; competitionId: string; anonymousCompetitionCode: string; team: string[]; authors: string[]; country: string;
  result: ACIResult; rank?: number; boards: string[]; plans: string[]; sections: string[]; elevations: string[]; diagrams: string[]; renders: string[]; text: string[]; models: string[];
  concept: string[]; parti: string[]; sourceFiles: string[]; provenance: string[]; copyrightStatus: ACIRightsStatus; juryComments: string[]; expertComments: string[];
  builtStatus: "BUILT" | "UNBUILT" | "UNKNOWN"; analysisStatus: ACIAnalysisStatus; reconstructionStatus: ACIAnalysisStatus; evidence: string[]; unknowns: string[];
};

export type JuryEvaluationRecord = { juryComposition: string[]; professionalBackground: string[]; evaluationCriteria: string[]; explicitComments: string[]; explicitStrengths: string[]; explicitWeaknesses: string[]; reasonsForSelection: string[]; reasonsForRejection: string[]; epistemicStatus: ACIEpistemicStatus };
export type ArchitecturalObservation = { observationId: string; proposalId: string; category: string; scale: ApplicabilityScale; statement: string; epistemicStatus: ACIEpistemicStatus; evidence: string[]; assumptions: string[]; unknowns: string[]; provenance: string[] };
export type DesignStrategyCandidate = { strategyId: string; name: string; sourceProposalIds: string[]; patternStatus: "PROJECT_SPECIFIC" | "RECURRING_PATTERN" | "TRANSFER_CANDIDATE" | "TRANSFER_VERIFIED_WITHIN_SCOPE" | "REJECTED" | "UNKNOWN"; evidence: string[]; curatorStatus: ForesightValidationStatus; causalStatus: "CORRELATION" | "JURY_ATTRIBUTED_REASON" | "ARKI_HYPOTHESIS" | "CAUSAL_EVIDENCE" | "UNKNOWN"; noStyleCopy: true };
export type CompetitionComparison = { comparisonId: string; competitionId: string; proposalIds: string[]; commonResponses: string[]; divergentResponses: string[]; rareStrategies: string[]; recurringProblems: string[]; recurringFailures: string[]; winnerNonWinnerDifferences: string[]; unexplainedDifferences: string[]; evidence: string[]; epistemicStatus: ACIEpistemicStatus };
export type BuiltOutcomeDelta = { proposalId: string; preservedIdeas: string[]; modifiedIdeas: string[]; removedIdeas: string[]; addedSystems: string[]; structuralChanges: string[]; programChanges: string[]; costDrivenChanges: string[]; regulatoryChanges: string[]; materialChanges: string[]; environmentalChanges: string[]; operationalChanges: string[]; evidence: string[]; unknowns: string[] };

export const ACI_SCHEDULER_STATUS = "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED" as const;
export const ACI_INGESTION_POLICY = "SELECTIVE / GOVERNED / TRACEABLE" as const;
export const ACI_MAXIMUM_STATUS = "FOUNDATION IMPLEMENTED / PILOT SCOPE / PENDING INDEPENDENT VERIFICATION" as const;

export function validateCompetitionRecord(record: CompetitionRecord): void { if (!record.competitionId || !record.canonicalName || record.evidence.length === 0) throw new Error("ACI_INVALID_COMPETITION_RECORD"); if (record.submissionsAvailable > record.submissionsKnown) throw new Error("ACI_INVALID_SUBMISSION_COUNT"); }
export function validateCompetitionProposal(proposal: CompetitionProposalRecord): void { if (!proposal.proposalId || !proposal.competitionId || !proposal.anonymousCompetitionCode) throw new Error("ACI_INVALID_PROPOSAL_IDENTITY"); if (proposal.authors.length === 0 && !proposal.unknowns.includes("AUTHOR_UNKNOWN")) throw new Error("ACI_AUTHOR_MUST_BE_UNKNOWN_EXPLICIT"); if (proposal.copyrightStatus === "UNKNOWN_RIGHTS") throw new Error("ACI_RIGHTS_REVIEW_REQUIRED"); }
export function createArchitecturalObservation(input: Omit<ArchitecturalObservation, "epistemicStatus"> & { epistemicStatus?: ACIEpistemicStatus }): ArchitecturalObservation { return { ...input, epistemicStatus: input.epistemicStatus ?? "OBSERVED" }; }
export function compareCompetitionProposals(input: { comparisonId: string; competitionId: string; proposalIds: string[]; commonResponses: string[]; divergentResponses: string[]; evidence: string[] }): CompetitionComparison { return { ...input, rareStrategies: [], recurringProblems: [], recurringFailures: [], winnerNonWinnerDifferences: [], unexplainedDifferences: [], epistemicStatus: input.evidence.length > 0 ? "OBSERVED" : "UNKNOWN" }; }
export function createStrategyCandidate(input: Omit<DesignStrategyCandidate, "noStyleCopy">): DesignStrategyCandidate { return { ...input, noStyleCopy: true }; }
export function assertCompetitionCannotSelfCertify(status: ACIResult): void { if (status === "WINNER" || status === "RUNNER_UP" || status === "FINALIST") throw new Error("ACI_RESULT_IS_NOT_COMPETENCY_CERTIFICATION"); }
export function assertCorpusItemNotCanonical(status: ForesightValidationStatus): void { if (status === "VERIFIED") throw new Error("ACI_CORPUS_ITEM_REQUIRES_CROSS_PROJECT_CURATOR_PROMOTION"); }

export type ArchivalCompleteness = "COMPLETE_ARCHIVAL_RECORD" | "SUBSTANTIAL_ARCHIVAL_RECORD" | "PARTIAL_ARCHIVAL_RECORD" | "FRAGMENTARY_ARCHIVAL_RECORD" | "LOST_COMPETITION_RECORD" | "UNKNOWN";
export type DigitizationStatus = "DOES_NOT_EXIST" | "EXISTS_BUT_NOT_DIGITIZED" | "EXISTS_BUT_NOT_ACCESSIBLE" | "EXISTS_BUT_NOT_DISCOVERED" | "EXISTENCE_UNKNOWN";
export type HistoricalConflictStatus = "NO_CONFLICT" | "MINOR_CONFLICT" | "MATERIAL_CONFLICT" | "UNRESOLVED" | "RESOLVED_WITH_EVIDENCE" | "UNKNOWN";
export type HistoricalClassification = { movement?: string; tendency?: string; school?: string; historicalClassification?: string; selfIdentification?: string; laterCriticalClassification?: string; disputedClassification?: string; contemporaryLabel?: string; retrospectiveLabel?: string; arkiClassification?: string; status: "DOCUMENTED" | "DISPUTED" | "UNKNOWN" };
export type HistoricalIdentity = { identityId: string; historicalName: string; currentName?: string; alternateTransliterations: string[]; originalScript?: string; jurisdictionAtProjectDate?: string; currentJurisdiction?: string; historicalCountry?: string; currentCountry?: string; aliases: string[] };
export type ArchivalGap = { gapId: string; missing: Array<"BRIEF" | "JURY_REPORT" | "PROPOSALS" | "AUTHORSHIP" | "DRAWINGS" | "RESULT" | "BUILT_OUTCOME" | "INACCESSIBLE_ARCHIVE" | "RIGHTS_RESTRICTION" | "UNDIGITIZED_SOURCE" | "LANGUAGE_BARRIER" | "UNKNOWN">; status: "OPEN" | "PARTIAL" | "CLOSED"; evidence: string[]; unknowns: string[] };
export type ArchitecturalArchiveSource = { archiveId: string; institution: string; country: string; collection: string; sourceType: string; temporalCoverage: string[]; geographicCoverage: string[]; accessMode: "OPEN" | "REQUEST" | "RESTRICTED" | "UNKNOWN"; digitizationStatus: DigitizationStatus; rightsStatus: ACIRightsStatus; language: string[]; authority: string; reliability: ForesightPriority; relevantProjects: string[]; relevantCompetitions: string[]; lastChecked: string; curatorStatus: ForesightValidationStatus };
export type ReferenceArchitecturalWorkRecord = { workId: string; name: string; location: string; country: string; date: string; architects: string[]; status: "BUILT" | "UNBUILT" | "PARTIAL" | "UNKNOWN"; competitionOrigin: "YES" | "NO" | "UNKNOWN"; typology: string[]; scales: ApplicabilityScale[]; disciplines: string[]; sourceEvidence: string[]; drawings: string[]; models: string[]; photographs: string[]; texts: string[]; historicalContext: Record<string, string>; architecturalObservations: string[]; classifications: HistoricalClassification[]; disputedClassifications: string[]; provenance: string[]; rights: ACIRightsStatus; unknowns: string[] };
export const HAI_MAXIMUM_STATUS = "FOUNDATION IMPLEMENTED / HISTORICAL PILOT / PENDING INDEPENDENT VERIFICATION" as const;
export const HAI_SCHEDULER_STATUS = "NOT_DEMONSTRATED / EXTERNAL_ORCHESTRATION_REQUIRED" as const;

export function validateHistoricalIdentity(identity: HistoricalIdentity): void { if (!identity.identityId || !identity.historicalName) throw new Error("HAI_INVALID_IDENTITY"); if (identity.aliases.includes(identity.historicalName) && identity.currentName && identity.currentName !== identity.historicalName) throw new Error("HAI_DUPLICATE_ALIAS_IDENTITY"); }
export function validateArchivalSource(source: ArchitecturalArchiveSource): void { if (!source.archiveId || !source.institution || source.language.length === 0) throw new Error("HAI_INVALID_ARCHIVE_SOURCE"); if (source.digitizationStatus === "EXISTS_BUT_NOT_DIGITIZED" && source.accessMode === "OPEN") throw new Error("HAI_INCONSISTENT_DIGITIZATION_ACCESS"); }
export function classifyHistoricalWork(input: { documented: string[]; retrospectiveLabel?: string; selfIdentification?: string; disputed?: string }): HistoricalClassification { return { historicalClassification: input.documented[0], retrospectiveLabel: input.retrospectiveLabel, selfIdentification: input.selfIdentification, disputedClassification: input.disputed, status: input.disputed ? "DISPUTED" : input.documented.length > 0 ? "DOCUMENTED" : "UNKNOWN" }; }
export function assertHistoricalNotCurrentCompliance(work: ReferenceArchitecturalWorkRecord, claim: string): void { if (/COMPLIANCE|SAFETY|PERFORMANCE|SUSTAINABILITY/i.test(claim) && work.sourceEvidence.length === 0) throw new Error("HAI_NO_UNSUPPORTED_PERFORMANCE_CLAIM"); }
export function assertHistoricalClassificationSeparation(classification: HistoricalClassification): void { if (classification.arkiClassification && classification.arkiClassification === "SOVIET" && classification.selfIdentification === "YUGOSLAV") throw new Error("HAI_CLASSIFICATION_COLLAPSE"); }
