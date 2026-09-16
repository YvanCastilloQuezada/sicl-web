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
type CommandData = Record<string, unknown>;

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

export class SiclClientError extends Error {
  constructor(public readonly status: number, public readonly body: unknown) {
    super(`SICL Core API returned ${status}`);
    this.name = "SiclClientError";
  }
}

function apiUrl(): string {
  const url = import.meta.env.VITE_API_URL?.trim() || "https://web-production-a93fa.up.railway.app";
  return url.replace(/\/$/, "");
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
  async listProjects(): Promise<CoreProject[]> {
    const response = await request<ApiEnvelope<ProjectList>>("/projects");
    return response.data.projects;
  },
  async createProject(data: { project_id: string; name: string; actor?: string }): Promise<CoreProject> {
    const response = await request<ApiEnvelope<CoreProject>>("/projects", { method: "POST", body: JSON.stringify(data) });
    return response.data;
  },
  async getProject(projectId: string): Promise<CoreProject> {
    const response = await request<ApiEnvelope<CoreProject>>(`/projects/${encodeURIComponent(projectId)}`);
    return response.data;
  },
  async executeCommand(projectId: string, command: string, actor = "frontend-user"): Promise<CommandData> {
    const response = await request<ApiEnvelope<CommandData>>("/commands", { method: "POST", body: JSON.stringify({ command, actor }) });
    return response.data;
  },
  async getHistory(projectId: string): Promise<CommandData> {
    await this.getProject(projectId);
    return this.executeCommand(projectId, "/HISTORY");
  },
  async listEvidence(projectId: string): Promise<Evidence[]> {
    const data = await v1Request<{ evidence: Evidence[] }>(`/v1/projects/${encodeURIComponent(projectId)}/evidence`);
    return data.evidence ?? [];
  },
  async getEvidence(projectId: string, evidenceId: string): Promise<Evidence> {
    const data = await v1Request<{ evidence: Evidence }>(`/v1/projects/${encodeURIComponent(projectId)}/evidence/${encodeURIComponent(evidenceId)}`);
    return data.evidence;
  },
  async createEvidence(projectId: string, input: EvidenceInput): Promise<Evidence> {
    const data = await v1Request<{ evidence: Evidence }>(`/v1/projects/${encodeURIComponent(projectId)}/evidence`, { method: "POST", body: JSON.stringify(input) });
    return data.evidence;
  },
  async listSources(projectId: string): Promise<Source[]> {
    const data = await v1Request<{ sources: Source[] }>(`/v1/projects/${encodeURIComponent(projectId)}/sources`);
    return data?.sources ?? [];
  },
  async getSource(projectId: string, sourceId: string): Promise<Source> {
    const data = await v1Request<{ source: Source }>(`/v1/projects/${encodeURIComponent(projectId)}/sources/${encodeURIComponent(sourceId)}`);
    return data.source;
  },
  async createSource(projectId: string, input: SourceInput): Promise<Source> {
    const data = await v1Request<{ source: Source }>(`/v1/projects/${encodeURIComponent(projectId)}/sources`, { method: "POST", body: JSON.stringify(input) });
    return data.source;
  },
  async listEvaluations(projectId: string, filters?: { alternative?: string; objective?: string }): Promise<Evaluation[]> {
    const params = new URLSearchParams();
    if (filters?.alternative) params.set("alternative", filters.alternative);
    if (filters?.objective) params.set("objective", filters.objective);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    const data = await v1Request<{ evaluations: Evaluation[] }>(`/v1/projects/${encodeURIComponent(projectId)}/evaluations${suffix}`);
    return data?.evaluations ?? [];
  },
  async createEvaluation(projectId: string, input: EvaluationInput): Promise<Evaluation> {
    const data = await v1Request<{ evaluation: Evaluation }>(`/v1/projects/${encodeURIComponent(projectId)}/evaluations`, { method: "POST", body: JSON.stringify(input) });
    return data.evaluation;
  },
  async listComparisons(projectId: string): Promise<Comparison[]> {
    const data = await v1Request<{ comparisons: Comparison[] }>(`/v1/projects/${encodeURIComponent(projectId)}/comparisons`);
    return data?.comparisons ?? [];
  },
  async createComparison(projectId: string, input: ComparisonInput): Promise<Comparison> {
    const data = await v1Request<{ comparison: Comparison }>(`/v1/projects/${encodeURIComponent(projectId)}/comparisons`, { method: "POST", body: JSON.stringify(input) });
    return data.comparison;
  },
};
