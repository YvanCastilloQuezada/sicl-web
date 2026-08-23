export type CanonicalCoreSnapshot = { contract_version: string; project_id: string; observed_version: number | null; snapshot: Record<string, unknown> };

type CoreWriteResponse = { contract_version: string; project_id: string; observed_version: number; [key: string]: unknown };
export type CanonicalCouncil = { contract_version: string; project_id: string; observed_version: number; read_only: true; readOnly: boolean; finding: string; comparisons: unknown[]; multi_comparisons: unknown[]; tradeoffs: unknown[]; recommendations: unknown[] };

export function hasCoreUrl(): boolean { return Boolean(coreUrl()); }

function coreUrl(): string | undefined {
  const value = process.env.SICL_CORE_URL?.trim();
  return value ? value.replace(/\/$/, "") : undefined;
}

function serviceHeaders() {
  const token = process.env.SICL_CORE_SERVICE_TOKEN?.trim();
  if (!token) throw new Error("SICL_CORE_SERVICE_TOKEN is required");
  return { accept: "application/json", authorization: `Bearer ${token}` };
}

async function coreRequest<T>(path: string, init: RequestInit): Promise<T> {
  const base = coreUrl();
  if (!base) throw new Error("SICL_CORE_URL is required");
  const response = await fetch(`${base}${path}`, { ...init, headers: { ...serviceHeaders(), ...(init.headers ?? {}) } });
  if (!response.ok) throw new Error(`SICL Core adapter returned ${response.status}`);
  return response.json() as Promise<T>;
}

export async function fetchCanonicalCouncil(projectId: string): Promise<CanonicalCouncil | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/council`, { headers: serviceHeaders() });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`SICL Core adapter returned ${response.status}`);
  return response.json() as Promise<CanonicalCouncil>;
}

export async function fetchCanonicalSnapshot(projectId: string): Promise<CanonicalCoreSnapshot | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/snapshot`, { headers: serviceHeaders() });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`SICL Core adapter returned ${response.status}`);
  return response.json() as Promise<CanonicalCoreSnapshot>;
}

export async function createCoreProject(projectId: string, name: string) {
  return coreRequest<{ contract_version: string; project_id: string; observed_version: number; snapshot: Record<string, unknown> }>("/v1/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ project_id: projectId, name }) });
}

export async function createCoreRecommendation(projectId: string, payload: Record<string, unknown>) {
  return coreRequest<CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/recommendations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}

export async function recordCoreHumanReview(projectId: string, payload: Record<string, unknown>) {
  return coreRequest<CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/human-reviews`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}

export async function recordCoreDecision(projectId: string, payload: Record<string, unknown>) {
  return coreRequest<CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/decisions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}
