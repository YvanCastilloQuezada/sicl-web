export type CoreProject = {
  project_id: string;
  name: string;
  stage: string;
  version: number;
  objectives?: Record<string, unknown>;
  constraints?: Record<string, unknown>;
  alternatives?: Record<string, unknown>;
  evaluations?: Record<string, unknown>;
  comparisons?: Record<string, unknown>;
  recommendations?: Record<string, unknown>;
  events?: unknown[];
  [key: string]: unknown;
};

type ApiEnvelope<T> = {
  status: string;
  code: string;
  message: string;
  data: T;
};

type V1Envelope<T> = ApiEnvelope<T> & {
  contract_version?: string;
  project_id?: string;
  observed_version?: number;
};

type ProjectList = { projects: CoreProject[] };
export type CommandData = Record<string, unknown>;

export type Evidence = {
  evidence_id: string;
  statement: string;
  evidence_type: string;
  source_id?: string | null;
  evidence_url?: string | null;
  captured_at?: string | null;
  method_version?: string;
  state: string;
  [key: string]: unknown;
};

export type Source = {
  source_id: string;
  source_type: string;
  title: string;
  url?: string | null;
  [key: string]: unknown;
};

export type Evaluation = {
  evaluation_id?: string;
  alternative_id?: string;
  objective_id?: string;
  alternative?: string;
  objective?: string;
  value: number;
  unit?: string;
  confidence?: string | number;
  source?: string;
  [key: string]: unknown;
};

export type Comparison = {
  comparison_id?: string;
  alternative_ids?: string[];
  alternatives?: string[];
  objectives?: string[];
  created_at?: string;
  [key: string]: unknown;
};

export type EvidenceInput = {
  evidence_id: string;
  statement: string;
  evidence_type: string;
  source_id?: string;
  captured_at?: string;
  method_version?: string;
  evidence_url?: string;
  state?: string;
};

export type SourceInput = {
  source_id: string;
  source_type: string;
  title: string;
  url?: string;
};

export type EvaluationInput = {
  alternative: string;
  objective: string;
  value: number;
  unit?: string;
  confidence?: string;
  source?: string;
};

export type ComparisonInput = {
  alternatives: string[];
  objectives?: string[];
};

export type ProjectVariable = {
  variable_id: string;
  project_id: string;
  normalized_key: string;
  variable_type: "OBJECTIVE" | "CONSTRAINT" | "PARAMETER";
  value: unknown;
  actor_id: string;
  authority: string;
  unit?: string | null;
  spatial_scope?: string;
};

export type FeasibilityResult = {
  alternative_id: string;
  state: "FEASIBLE" | "INFEASIBLE" | "UNKNOWN" | "INSUFFICIENT_DATA";
  failed_constraint_ids: string[];
  unknown_constraint_ids: string[];
  insufficient_constraint_ids: string[];
  checks: Array<Record<string, unknown>>;
};

export type SpatialLocation = {
  location_id: string;
  project_id: string;
  spatial_scope: string;
  geometry_type: string;
  geometry: { type: string; coordinates: number[] };
  crs: string;
  place_label?: string | null;
  status: string;
  acquisition_method: string;
  provenance: string;
  longitude?: number | null;
  latitude?: number | null;
  [key: string]: unknown;
};

export type MissingDataReport = {
  location_present: boolean;
  variables: Array<{ canonical_variable_id: string; state: string; source?: string | null; acquisition_paths?: string[] }>;
  capabilities: Array<{ capability_id: string; state: string; missing_requirements?: string[] }>;
};

export type ParetoRequest = {
  alternative_ids?: string[];
  objective_ids?: string[];
  objectives?: string[];
};

export class SiclClientError extends Error {
  constructor(public readonly status: number, public readonly body: unknown) {
    super(`SICL Core API returned ${status}`);
    this.name = "SiclClientError";
  }
}

export function isMockCoreEnabled(): boolean {
  return typeof window !== "undefined" && window.localStorage.getItem("sims-dei.mock-core") === "true";
}

function apiUrl(): string {
  return "/api/core";
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, {
    ...init,
    headers: {
      accept: "application/json",
      ...(init?.body ? { "content-type": "application/json" } : {}),
      ...(init?.headers ?? {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new SiclClientError(response.status, body);
  return body as T;
}

async function v1Request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await request<V1Envelope<T>>(path, init);
  return response.data;
}

const CORE_READ_CACHE_TTL_MS = 15_000;
const coreReadCache = new Map<string, { expiresAt: number; value: unknown }>();
const coreReadInFlight = new Map<string, Promise<unknown>>();

async function cachedV1Request<T>(path: string): Promise<T> {
  const now = Date.now();
  const cached = coreReadCache.get(path);
  if (cached && cached.expiresAt > now) return cached.value as T;
  const pending = coreReadInFlight.get(path);
  if (pending) return pending as Promise<T>;
  const requestPromise = v1Request<T>(path)
    .then((value) => {
      coreReadCache.set(path, { value, expiresAt: Date.now() + CORE_READ_CACHE_TTL_MS });
      return value;
    })
    .finally(() => coreReadInFlight.delete(path));
  coreReadInFlight.set(path, requestPromise);
  return requestPromise;
}

function invalidateCoreReadCache(prefix: string) {
  Array.from(coreReadCache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) coreReadCache.delete(key);
  });
}

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof SiclClientError)) return error instanceof Error ? error.message : "Error de red";
  const body = error.body as { detail?: unknown; message?: string; code?: string } | null;
  const detail = Array.isArray(body?.detail)
    ? body.detail.map((item) => typeof item === "object" && item !== null && "msg" in item ? String((item as { msg: unknown }).msg) : String(item)).join(", ")
    : body?.detail ?? body?.message ?? body?.code ?? "Error del Core";
  if (error.status === 400) return `Datos inválidos: ${String(detail)}`;
  if (error.status === 404) return "No encontrado";
  if (error.status === 409) return "Conflicto: ya existe";
  if (error.status === 422) return `Datos incompletos: ${String(detail)}`;
  return `${String(detail)} (HTTP ${error.status})`;
}

export const siclClient = {
  isConfigured: () => true,
  isMock: isMockCoreEnabled,
  async listProjects(): Promise<CoreProject[]> {
    if (isMockCoreEnabled()) {
      const { mockListProjects } = await import("./mock-core");
      return mockListProjects();
    }
    const response = await request<ApiEnvelope<ProjectList>>("/projects");
    return response.data.projects;
  },
  async createProject(data: { project_id: string; name: string; actor?: string }): Promise<CoreProject> {
    if (isMockCoreEnabled()) {
      const { mockCreateProject } = await import("./mock-core");
      return mockCreateProject(data);
    }
    const response = await request<ApiEnvelope<CoreProject>>("/projects", { method: "POST", body: JSON.stringify(data) });
    return response.data;
  },
  async getProject(projectId: string): Promise<CoreProject> {
    if (isMockCoreEnabled()) {
      const { mockGetProject } = await import("./mock-core");
      return mockGetProject(projectId);
    }
    const response = await request<ApiEnvelope<CoreProject>>(`/projects/${encodeURIComponent(projectId)}`);
    return response.data;
  },
  async executeCommand(projectId: string, command: string, actor = "frontend-user"): Promise<CommandData> {
    if (isMockCoreEnabled()) {
      const { mockExecuteCommand } = await import("./mock-core");
      return mockExecuteCommand(command);
    }
    const response = await request<ApiEnvelope<CommandData>>("/commands", { method: "POST", body: JSON.stringify({ command, actor }) });
    return response.data;
  },
  async executeCanonicalCommand(projectId: string, command: string, actor = "frontend-user"): Promise<CommandData> {
    const data = await v1Request<CommandData>(`/v1/projects/${encodeURIComponent(projectId)}/commands`, {
      method: "POST",
      body: JSON.stringify({ command, actor }),
    });
    return data;
  },
  async getHistory(projectId: string): Promise<CommandData> {
    await this.getProject(projectId);
    return this.executeCommand(projectId, "/HISTORY");
  },
  async getCanonicalHistory(projectId: string): Promise<CommandData> {
    return v1Request<CommandData>(`/v1/projects/${encodeURIComponent(projectId)}/history`);
  },
  async calculatePareto(projectId: string, input: ParetoRequest): Promise<CommandData> {
    return v1Request<CommandData>(`/v1/projects/${encodeURIComponent(projectId)}/multiobjective/pareto`, { method: "POST", body: JSON.stringify(input) });
  },
  async listEvidence(projectId: string): Promise<Evidence[]> {
    const data = await cachedV1Request<{ evidence: Evidence[] }>(`/v1/projects/${encodeURIComponent(projectId)}/evidence`);
    return data.evidence ?? [];
  },
  async getEvidence(projectId: string, evidenceId: string): Promise<Evidence> {
    const data = await cachedV1Request<{ evidence: Evidence }>(`/v1/projects/${encodeURIComponent(projectId)}/evidence/${encodeURIComponent(evidenceId)}`);
    return data.evidence;
  },
  async createEvidence(projectId: string, input: EvidenceInput): Promise<Evidence> {
    const data = await v1Request<{ evidence: Evidence }>(`/v1/projects/${encodeURIComponent(projectId)}/evidence`, { method: "POST", body: JSON.stringify(input) });
    invalidateCoreReadCache(`/v1/projects/${encodeURIComponent(projectId)}/evidence`);
    return data.evidence;
  },
  async listSources(projectId: string): Promise<Source[]> {
    const data = await cachedV1Request<{ sources: Source[] }>(`/v1/projects/${encodeURIComponent(projectId)}/sources`);
    return data?.sources ?? [];
  },
  async getSource(projectId: string, sourceId: string): Promise<Source> {
    const data = await cachedV1Request<{ source: Source }>(`/v1/projects/${encodeURIComponent(projectId)}/sources/${encodeURIComponent(sourceId)}`);
    return data.source;
  },
  async createSource(projectId: string, input: SourceInput): Promise<Source> {
    const data = await v1Request<{ source: Source }>(`/v1/projects/${encodeURIComponent(projectId)}/sources`, { method: "POST", body: JSON.stringify(input) });
    invalidateCoreReadCache(`/v1/projects/${encodeURIComponent(projectId)}/sources`);
    return data.source;
  },
  async listEvaluations(projectId: string, filters?: { alternative?: string; objective?: string }): Promise<Evaluation[]> {
    const params = new URLSearchParams();
    if (filters?.alternative) params.set("alternative", filters.alternative);
    if (filters?.objective) params.set("objective", filters.objective);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    const data = await cachedV1Request<{ evaluations: Evaluation[] }>(`/v1/projects/${encodeURIComponent(projectId)}/evaluations${suffix}`);
    return data?.evaluations ?? [];
  },
  async createEvaluation(projectId: string, input: EvaluationInput): Promise<Evaluation> {
    const data = await v1Request<{ evaluation: Evaluation }>(`/v1/projects/${encodeURIComponent(projectId)}/evaluations`, { method: "POST", body: JSON.stringify(input) });
    invalidateCoreReadCache(`/v1/projects/${encodeURIComponent(projectId)}/evaluations`);
    return data.evaluation;
  },
  async listComparisons(projectId: string): Promise<Comparison[]> {
    const data = await cachedV1Request<{ comparisons: Comparison[] }>(`/v1/projects/${encodeURIComponent(projectId)}/comparisons`);
    return data?.comparisons ?? [];
  },
  async createComparison(projectId: string, input: ComparisonInput): Promise<Comparison> {
    const data = await v1Request<{ comparison: Comparison }>(`/v1/projects/${encodeURIComponent(projectId)}/comparisons`, { method: "POST", body: JSON.stringify(input) });
    invalidateCoreReadCache(`/v1/projects/${encodeURIComponent(projectId)}/comparisons`);
    return data.comparison;
  },
  async listVariables(projectId: string): Promise<ProjectVariable[]> {
    const data = await v1Request<{ variables: ProjectVariable[] }>(`/v1/projects/${encodeURIComponent(projectId)}/variables`);
    return data.variables ?? [];
  },
  async createVariable(projectId: string, input: Omit<ProjectVariable, "project_id">): Promise<ProjectVariable> {
    const data = await v1Request<{ variable: ProjectVariable }>(`/v1/projects/${encodeURIComponent(projectId)}/variables`, { method: "POST", body: JSON.stringify(input) });
    return data.variable;
  },
  async checkFeasibility(projectId: string, alternativeId: string, values: Record<string, unknown>): Promise<FeasibilityResult> {
    const data = await v1Request<{ feasibility: FeasibilityResult }>(`/v1/projects/${encodeURIComponent(projectId)}/feasibility`, { method: "POST", body: JSON.stringify({ alternative_id: alternativeId, values }) });
    return data.feasibility;
  },
  async feasiblePareto(projectId: string, paretoFront: string[]): Promise<{ pareto_front: string[]; feasible_pareto_front: string[] }> {
    return v1Request<{ pareto_front: string[]; feasible_pareto_front: string[] }>(`/v1/projects/${encodeURIComponent(projectId)}/multiobjective/feasible-pareto`, { method: "POST", body: JSON.stringify({ pareto_front: paretoFront }) });
  },
  async confirmLocation(projectId: string, input: { longitude: number; latitude: number; place_label?: string }): Promise<SpatialLocation> {
    const data = await v1Request<{ location: SpatialLocation }>(`/v1/projects/${encodeURIComponent(projectId)}/locations`, { method: "POST", body: JSON.stringify({ spatial_scope: "parcela_sitio", geometry_type: "Point", geometry: { type: "Point", coordinates: [input.longitude, input.latitude] }, place_label: input.place_label, acquisition_method: "MAP_SELECTION", provenance: "USER_DECLARED", actor_id: "frontend-user", authority: "project_owner", confirm: true }) });
    return data.location;
  },
  async currentLocation(projectId: string): Promise<SpatialLocation | null> {
    const data = await cachedV1Request<{ location: SpatialLocation | null }>(`/v1/projects/${encodeURIComponent(projectId)}/locations/current`);
    return data.location;
  },
  async missingData(projectId: string, spatialScope = "parcela_sitio"): Promise<MissingDataReport> {
    return cachedV1Request<MissingDataReport>(`/v1/projects/${encodeURIComponent(projectId)}/missing-data?spatial_scope=${encodeURIComponent(spatialScope)}`);
  },
};
