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

type ProjectList = { projects: CoreProject[] };
type CommandData = Record<string, unknown>;

export class SiclClientError extends Error {
  constructor(public readonly status: number, public readonly body: unknown) {
    super(`SICL Core API returned ${status}`);
    this.name = "SiclClientError";
  }
}

function apiUrl(): string {
  const url = import.meta.env.VITE_API_URL?.trim();
  if (!url) throw new Error("VITE_API_URL is required for the REST Core bridge");
  return url.replace(/\/$/, "");
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl()}${path}`, {
    ...init,
    headers: { accept: "application/json", ...(init?.body ? { "content-type": "application/json" } : {}), ...(init?.headers ?? {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new SiclClientError(response.status, body);
  return body as T;
}

export const siclClient = {
  isConfigured: () => Boolean(import.meta.env.VITE_API_URL?.trim()),
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
};
