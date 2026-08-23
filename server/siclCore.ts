export type SiclStatus = "DRAFT" | "ACTIVE" | "DECIDED" | "ARCHIVED";
export type RecordKind = "sources" | "evidence" | "requirements" | "objectives" | "constraints" | "alternatives" | "recommendations";

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
  description?: string;
  data?: Record<string, string | number | boolean>;
  actorId?: string | number;
  confirmationId?: string;
  observedVersion?: string | number;
  recommendationVersion?: string | number;
  reason?: string;
  authorityBasis?: string;
  rationale?: string;
  decisionType?: "HUMAN" | string;
};

export type SiclEvent = {
  id: string;
  type: string;
  entityId: string;
  actorId: number;
  createdAt: string;
  data: Record<string, unknown>;
};

export type SiclSnapshot = {
  sources: SiclRecord[];
  evidence: SiclRecord[];
  requirements: SiclRecord[];
  objectives: SiclRecord[];
  constraints: SiclRecord[];
  alternatives: SiclRecord[];
  evaluations: SiclRecord[];
  comparisons: SiclRecord[];
  recommendations: SiclRecord[];
  humanReviews: SiclRecord[];
  decisions: SiclRecord[];
  events: SiclEvent[];
};

export const emptySnapshot = (): SiclSnapshot => ({
  sources: [], evidence: [], requirements: [], objectives: [], constraints: [], alternatives: [],
  evaluations: [], comparisons: [], recommendations: [], humanReviews: [], decisions: [], events: [],
});

function collection(value: unknown): SiclRecord[] {
  if (Array.isArray(value)) return value as SiclRecord[];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, Record<string, unknown>>).map(([key, item]) => ({ id: String(item.id ?? item.project_id ?? item.source_id ?? item.requirement_id ?? item.objective_id ?? item.constraint_id ?? item.alternative_id ?? item.evaluation_id ?? item.comparison_id ?? item.recommendation_id ?? item.decision_id ?? key), ...item }));
}

export function parseSnapshot(raw: string): SiclSnapshot {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const snapshot = emptySnapshot();
    const source = (parsed.core && typeof parsed.core === "object" ? parsed.core : parsed) as Record<string, unknown>;
    const aliases: Record<keyof SiclSnapshot, string[]> = {
      sources: ["sources"], evidence: ["evidence"], requirements: ["requirements"], objectives: ["objectives"], constraints: ["constraints"], alternatives: ["alternatives"], evaluations: ["evaluations"], comparisons: ["comparisons", "multi_comparisons"], recommendations: ["recommendations"], humanReviews: ["humanReviews", "human_reviews"], decisions: ["decisions"], events: ["events"],
    };
    for (const key of Object.keys(snapshot) as (keyof SiclSnapshot)[]) {
      const values = aliases[key].flatMap((alias) => collection(source[alias]));
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
    alternatives: snapshot.alternatives,
    evaluations: snapshot.evaluations,
    comparisons: snapshot.comparisons,
    recommendations: snapshot.recommendations,
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
  if (snapshot.decisions.some((item) => item.id === decision.id)) throw new Error("Decision id already exists");
  return { ...snapshot, decisions: [...snapshot.decisions, decision], events: [...snapshot.events, event] };
}
