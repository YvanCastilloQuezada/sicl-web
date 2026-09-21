import { normalizeSpatialScope, normalizeTemporalScope, type SpatialScope, type TemporalScope } from "@shared/siclScopes";

export type SiclStatus = "DRAFT" | "ACTIVE" | "DECIDED" | "ARCHIVED";
export type RecordKind = "sources" | "evidence" | "requirements" | "objectives" | "constraints" | "preferences" | "alternatives" | "evaluations" | "comparisons" | "multiComparisons" | "decisionConditions" | "recommendations";

export type SiclRecord = {
  id: string;
  name?: string;
  statement?: string;
  sourceId?: string;
  requirementId?: string;
  direction?: "MINIMIZE" | "MAXIMIZE";
  metric?: string;
  operator?: string;
  threshold?: number;
  alternativeId?: string;
  objectiveId?: string;
  criterion?: string;
  value?: number;
  unit?: string;
  method?: string;
  inputs?: Array<Record<string, string | number | boolean>>;
  provenance?: string[];
  evaluationIds?: string[];
  comparisonKind?: "BINARY" | "MULTI_CRITERIA";
  feasibilityStatus?: "UNKNOWN" | "FEASIBLE" | "INFEASIBLE" | "INSUFFICIENT_DATA";
  conditionStatus?: "DECLARED" | "UNTESTED" | "CONFLICT";
  rationale?: string;
  data?: Record<string, string | number | boolean>;
  actorId?: string | number;
  confirmationId?: string;
  observedVersion?: string | number;
  recommendationVersion?: string | number;
  reason?: string;
  authorityBasis?: string;
  selectedAlternativeId?: string;
  justification?: string;
  preferenceStrength?: "SOFT" | "STRONG";
  scope?: string;
  decisionType?: "HUMAN" | string;
  status?: string;
};

export type SiclEvent = {
  id: string;
  type: string;
  entityId: string;
  actorId: number;
  createdAt: string;
  data: Record<string, unknown>;
};

export type SiclKnowledgeRecord = {
  id: string;
  kind: string;
  title: string;
  statement: string;
  epistemicStatus: "FACT" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICTED" | string;
  promotionState?: string;
  scopeId?: string;
  sourceIds: string[];
  evidenceIds: string[];
  applicability?: string;
  transferability?: string;
  rationale?: string;
  rightsStatus?: string;
  conflict?: string;
  unknown?: string;
  version: number;
};

export type SiclKnowledgeValidation = {
  id: string;
  knowledgeId: string;
  decision: "CONFIRMED_WITHIN_SCOPE" | "REQUIRES_REVISION" | "REJECTED" | string;
  authority: string;
  scopeId?: string;
  validatedAt: string;
  evidenceHash: string;
};

export type SiclReasoningExecution = {
  executionId: string;
  projectId: string;
  brief: string;
  coreKnowledgeVersion: number;
  retrievalQuery: string;
  retrievedKnowledgeIds: string[];
  trace: Record<string, unknown>;
  output: Record<string, unknown>;
  createdAt: string;
  runtimeVersion: string;
};

export type SiclSnapshot = {
  sources: SiclRecord[];
  evidence: SiclRecord[];
  requirements: SiclRecord[];
  objectives: SiclRecord[];
  constraints: SiclRecord[];
  preferences: SiclRecord[];
  alternatives: SiclRecord[];
  evaluations: SiclRecord[];
  comparisons: SiclRecord[];
  multiComparisons: SiclRecord[];
  decisionConditions: SiclRecord[];
  recommendations: SiclRecord[];
  humanReviews: SiclRecord[];
  decisions: SiclRecord[];
  events: SiclEvent[];
  knowledge: SiclKnowledgeRecord[];
  knowledgeValidations: SiclKnowledgeValidation[];
  reasoningExecutions: SiclReasoningExecution[];
  initialIntake?: {
    intent: string;
    location: string;
    site: string;
    dimensions: string;
    occupants: string;
    budget: string;
    provenance: "USER_PROVIDED";
    epistemicStatus: "UNVERIFIED";
    capturedAt: string;
  };
  spatialScope?: SpatialScope;
  temporalScope?: TemporalScope;
};

export const emptySnapshot = (): SiclSnapshot => ({
  sources: [], evidence: [], requirements: [], objectives: [], constraints: [], preferences: [], alternatives: [],
  evaluations: [], comparisons: [], multiComparisons: [], decisionConditions: [], recommendations: [], humanReviews: [], decisions: [], events: [], knowledge: [], knowledgeValidations: [], reasoningExecutions: [], initialIntake: undefined,
});

function collection(value: unknown): SiclRecord[] {
  if (Array.isArray(value)) return value as SiclRecord[];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, Record<string, unknown>>).map(([key, item]) => {
    const normalized: Record<string, unknown> = { ...item };
    const aliases: Record<string, string> = { project_id: "projectId", source_id: "sourceId", evidence_id: "id", requirement_id: "requirementId", objective_id: "objectiveId", constraint_id: "constraintId", alternative_id: "alternativeId", evaluation_id: "evaluationId", comparison_id: "comparisonId", recommendation_id: "recommendationId", decision_id: "decisionId", review_id: "id", event_id: "id", event_type: "type", entity_id: "entityId", actor_id: "actorId", confirmation_id: "confirmationId", authority_basis: "authorityBasis", observed_project_version: "observedVersion", recommendation_version: "recommendationVersion", based_on: "basedOn", based_on_kind: "basedOnKind", entity_version: "recommendationVersion", decision_maker: "actorId", selected_alternative_id: "selectedAlternativeId", evaluation_ids: "evaluationIds", comparison_kind: "comparisonKind", feasibility_status: "feasibilityStatus", condition_status: "conditionStatus", preference_id: "preferenceId", strength: "preferenceStrength", scope_type: "scopeType", scope_id: "scopeId", valid_from: "validFrom", valid_until: "validUntil" };
    for (const [from, to] of Object.entries(aliases)) if (item[from] !== undefined && normalized[to] === undefined) normalized[to] = item[from];
    const id = String(item.id ?? item.event_id ?? item.project_id ?? item.source_id ?? item.evidence_id ?? item.requirement_id ?? item.objective_id ?? item.constraint_id ?? item.alternative_id ?? item.evaluation_id ?? item.comparison_id ?? item.recommendation_id ?? item.decision_id ?? item.review_id ?? key);
    return { id, ...normalized } as SiclRecord;
  });
}

export function parseSnapshot(raw: string): SiclSnapshot {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const snapshot = emptySnapshot();
    const source = (parsed.core && typeof parsed.core === "object" ? parsed.core : parsed) as Record<string, unknown>;
    const project = source.project && typeof source.project === "object" ? source.project as Record<string, unknown> : {};
    const metadata = { ...source, ...project };
    const aliases: Record<keyof SiclSnapshot, string[]> = {
      sources: ["sources"], evidence: ["evidence"], requirements: ["requirements"], objectives: ["objectives"], constraints: ["constraints"], preferences: ["preferences"], alternatives: ["alternatives"], evaluations: ["evaluations"], comparisons: ["comparisons"], multiComparisons: ["multiComparisons", "multi_comparisons"], decisionConditions: ["decisionConditions", "decision_conditions"], recommendations: ["recommendations"], humanReviews: ["humanReviews", "human_reviews"], decisions: ["decisions"], events: ["events"], knowledge: ["knowledge", "knowledge_records"], knowledgeValidations: ["knowledgeValidations", "knowledge_validations"], reasoningExecutions: ["reasoningExecutions", "reasoning_executions"], initialIntake: ["initialIntake", "initial_intake"], spatialScope: ["spatialScope", "spatial_scope"], temporalScope: ["temporalScope", "temporal_scope"],
    };
    for (const key of Object.keys(aliases) as (keyof SiclSnapshot)[]) {
      if (key === "spatialScope") { const scope = aliases[key].map((alias) => normalizeSpatialScope(metadata[alias])).find(Boolean); if (scope) snapshot.spatialScope = scope; continue; }
      if (key === "temporalScope") { const scope = aliases[key].map((alias) => normalizeTemporalScope(metadata[alias])).find(Boolean); if (scope) snapshot.temporalScope = scope; continue; }
      if (key === "initialIntake") { const intake = aliases[key].map((alias) => metadata[alias]).find((value) => value && typeof value === "object"); if (intake) snapshot.initialIntake = intake as SiclSnapshot["initialIntake"]; continue; }
      const values = aliases[key].flatMap((alias) => collection(metadata[alias]));
      if (values.length) snapshot[key] = values as never;
    }
    return snapshot;
  } catch {
    throw new Error("SICL snapshot is invalid JSON");
  }
}

export function validateRecord(kind: RecordKind, record: SiclRecord, snapshot: SiclSnapshot): void {
  if (!record.id?.trim()) throw new Error("Record id is required");
  if (kind !== "evidence" && !record.name?.trim()) throw new Error("Record name is required");
  if (kind === "evidence" && (!record.statement?.trim() || !record.sourceId?.trim())) {
    throw new Error("Evidence requires statement and sourceId");
  }
  if (kind === "objectives") {
    if (!record.requirementId?.trim()) throw new Error("Objective requires requirementId");
    if (!record.direction) throw new Error("Objective direction must be explicit");
  }
  if (kind === "constraints" && (!record.metric?.trim() || typeof record.threshold !== "number")) {
    throw new Error("Constraint requires metric and numeric threshold");
  }
  if (kind === "preferences") {
    if (!record.justification?.trim()) throw new Error("Preference requires justification");
    if (record.preferenceStrength !== undefined && !["SOFT", "STRONG"].includes(record.preferenceStrength)) throw new Error("Preference strength is invalid");
  }
  if (kind === "evaluations") {
    if (!record.objectiveId?.trim() || !snapshot.objectives.some((objective) => objective.id === record.objectiveId)) throw new Error("Evaluation objectiveId does not exist");
    if (!record.alternativeId?.trim() || !snapshot.alternatives.some((alternative) => alternative.id === record.alternativeId)) throw new Error("Evaluation alternativeId does not exist");
    if (!record.criterion?.trim() || typeof record.value !== "number" || !Number.isFinite(record.value) || !record.unit?.trim() || !record.method?.trim()) throw new Error("Evaluation requires criterion, numeric value, unit and method");
    if (!Array.isArray(record.inputs) || record.inputs.length === 0) throw new Error("Evaluation requires explicit inputs");
    if (!Array.isArray(record.provenance) || record.provenance.length === 0 || record.provenance.some((item) => typeof item !== "string" || !item.trim())) throw new Error("Evaluation requires explicit provenance");
    if (record.feasibilityStatus === undefined) record.feasibilityStatus = "UNKNOWN";
  }
  if (kind === "decisionConditions") {
    if (!record.alternativeId?.trim() || !snapshot.alternatives.some((alternative) => alternative.id === record.alternativeId)) throw new Error("DecisionCondition alternativeId does not exist");
    if (!record.objectiveId?.trim() || !snapshot.objectives.some((objective) => objective.id === record.objectiveId)) throw new Error("DecisionCondition objectiveId does not exist");
    if (!record.criterion?.trim() || !record.operator?.trim() || typeof record.threshold !== "number" || !Number.isFinite(record.threshold) || !record.unit?.trim()) throw new Error("DecisionCondition requires criterion, operator, numeric threshold and unit");
    if (!record.rationale?.trim()) throw new Error("DecisionCondition requires rationale");
    if (!Array.isArray(record.provenance) || record.provenance.length === 0 || record.provenance.some((item) => typeof item !== "string" || !item.trim())) throw new Error("DecisionCondition requires explicit provenance");
    if (record.conditionStatus !== undefined && !["DECLARED", "UNTESTED", "CONFLICT"].includes(record.conditionStatus)) throw new Error("DecisionCondition status is invalid");
  }
  if (kind === "comparisons" || kind === "multiComparisons") {
    if (!record.objectiveId?.trim() || !snapshot.objectives.some((objective) => objective.id === record.objectiveId)) throw new Error("Comparison objectiveId does not exist");
    if (!record.direction) throw new Error("Comparison direction must be explicit");
    if (!Array.isArray(record.evaluationIds) || record.evaluationIds.length < 2 || new Set(record.evaluationIds).size !== record.evaluationIds.length) throw new Error("Comparison requires at least two distinct evaluationIds");
    const evaluations = record.evaluationIds.map((id) => snapshot.evaluations.find((item) => item.id === id));
    if (evaluations.some((item) => !item)) throw new Error("Comparison evaluationId does not exist");
    if (evaluations.some((item) => item?.objectiveId !== record.objectiveId)) throw new Error("Comparison evaluations must use the declared objective");
    const expectedKind = kind === "multiComparisons" ? "MULTI_CRITERIA" : "BINARY";
    if (record.comparisonKind !== expectedKind) throw new Error(`Comparison comparisonKind must be ${expectedKind}`);
    if (record.feasibilityStatus === undefined) throw new Error("Comparison feasibilityStatus must be explicit");
    if (!["UNKNOWN", "FEASIBLE", "INFEASIBLE", "INSUFFICIENT_DATA"].includes(record.feasibilityStatus)) throw new Error("Comparison feasibilityStatus is invalid");
  }
  if (kind === "evidence" && !snapshot.sources.some((source) => source.id === record.sourceId)) {
    throw new Error("Evidence sourceId does not exist");
  }
  if (kind === "objectives" && !snapshot.requirements.some((requirement) => requirement.id === record.requirementId)) {
    throw new Error("Objective requirementId does not exist");
  }
}

export function appendRecord(snapshot: SiclSnapshot, kind: RecordKind, record: SiclRecord, event: SiclEvent): SiclSnapshot {
  validateRecord(kind, record, snapshot);
  if (snapshot[kind].some((item) => item.id === record.id)) throw new Error(`${kind} id already exists`);
  return { ...snapshot, [kind]: [...snapshot[kind], record], events: [...snapshot.events, event] };
}

export function analysisView(snapshot: SiclSnapshot) {
  return {
    readOnly: true,
    objectives: snapshot.objectives,
    constraints: snapshot.constraints,
    preferences: snapshot.preferences,
    alternatives: snapshot.alternatives,
    evaluations: snapshot.evaluations,
    comparisons: snapshot.comparisons,
    decisionConditions: snapshot.decisionConditions,
    recommendations: snapshot.recommendations,
    spatialScope: snapshot.spatialScope,
    temporalScope: snapshot.temporalScope,
    finding: snapshot.alternatives.length > 1 ? "MULTI_ALTERNATIVE_ANALYSIS_AVAILABLE" : "INSUFFICIENT_DATA",
  };
}

export function appendHumanReview(snapshot: SiclSnapshot, review: SiclRecord, event: SiclEvent): SiclSnapshot {
  for (const key of ["actorId", "confirmationId", "observedVersion", "recommendationVersion", "reason"] as const) {
    if (review[key] === undefined || review[key] === "") throw new Error(`HumanReview requires ${key}`);
  }
  if (Number(review.observedVersion) !== Number(event.data.observedVersion)) throw new Error("HumanReview version mismatch");
  if (snapshot.humanReviews.some((item) => item.id === review.id)) throw new Error("HumanReview id already exists");
  return { ...snapshot, humanReviews: [...snapshot.humanReviews, review], events: [...snapshot.events, event] };
}

export function appendHumanDecision(snapshot: SiclSnapshot, decision: SiclRecord, event: SiclEvent): SiclSnapshot {
  for (const key of ["actorId", "authorityBasis", "confirmationId", "rationale", "observedVersion"] as const) {
    if (decision[key] === undefined || decision[key] === "") throw new Error(`Decision requires ${key}`);
  }
  if (decision.decisionType !== "HUMAN") throw new Error("decisionType must be HUMAN");
  if (Number(decision.observedVersion) !== Number(event.data.observedVersion)) throw new Error("Decision version mismatch");
  const approvedReview = snapshot.humanReviews.find((review) => review.actorId === decision.actorId && ["ACCEPTED", "APPROVED"].includes(String(review.status ?? "").toUpperCase()));
  if (!approvedReview) throw new Error("Decision requires an approved HumanReview by the same actor");
  if (snapshot.decisions.some((item) => item.id === decision.id)) throw new Error("Decision id already exists");
  return { ...snapshot, decisions: [...snapshot.decisions, decision], events: [...snapshot.events, event] };
}
