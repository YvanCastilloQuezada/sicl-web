export type CanonicalCoreSnapshot = { contract_version: string; project_id: string; observed_version: number | null; snapshot: Record<string, unknown> };
import type { SpatialScope, TemporalScope } from "@shared/siclScopes";

/**
 * Local anti-corruption wrapper for a canonical read miss. The `envelope` field
 * is the upstream 404 JSON body preserved verbatim; the wrapper adds only the
 * type discriminator and project context needed by the tRPC boundary.
 * Regression coverage: coreHttpClient.test.ts and integration-hardening.test.ts.
 */
export type CanonicalNotFound = { not_found: true; project_id: string; status: 404; error: string; detail?: string; envelope: Record<string, unknown> };

type CoreWriteResponse = { contract_version: string; project_id: string; observed_version: number; [key: string]: unknown };
export type OperationsResearchMethod = {
  method: string;
  required_inputs: string[];
  required_units: string[];
  required_constraints: string[];
  required_assumptions: string[];
  required_provenance: string[];
  output_fields: string[];
  feasibility_states: string[];
  sensitivity_outputs: string[];
  version: string;
};

export type OperationsResearchCatalog = {
  contract_version: string;
  read_only: boolean;
  methods: OperationsResearchMethod[];
};

export type CanonicalCouncil = {
  contract_version: string;
  project_id: string;
  observed_version: number;
  read_only: true;
  readOnly: boolean;
  finding: string;
  comparisons: unknown[];
  multi_comparisons: unknown[];
  tradeoffs: unknown[];
  recommendations: unknown[];
};

export class SiclCoreHttpError extends Error {
  constructor(public readonly status: number, public readonly errorCode?: string, detail?: string, public readonly envelope: Record<string, unknown> = {}) {
    super(detail ? `SICL Core adapter returned ${status}: ${detail}` : `SICL Core adapter returned ${status}`);
    this.name = "SiclCoreHttpError";
  }
}

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

async function errorFromResponse(response: Response): Promise<SiclCoreHttpError> {
  let errorCode: string | undefined;
  let detail: string | undefined;
  let envelope: Record<string, unknown> = {};
  try {
    const body = await response.json() as Record<string, unknown>;
    envelope = body;
    if (typeof body.error === "string") errorCode = body.error;
    if (typeof body.detail === "string") detail = body.detail;
  } catch {
    // Preserve the HTTP status even when the upstream body is empty or invalid.
  }
  return new SiclCoreHttpError(response.status, errorCode, detail, envelope);
}

async function coreRequest<T>(path: string, init: RequestInit): Promise<T> {
  const base = coreUrl();
  if (!base) throw new Error("SICL_CORE_URL is required");
  const response = await fetch(`${base}${path}`, { ...init, headers: { ...serviceHeaders(), ...(init.headers ?? {}) } });
  if (!response.ok) throw await errorFromResponse(response);
  return response.json() as Promise<T>;
}

export async function fetchOperationsResearchMethods(): Promise<OperationsResearchCatalog | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  return coreRequest<OperationsResearchCatalog>("/v1/operations-research/methods", { method: "GET" });
}

export async function fetchCanonicalCouncil(projectId: string): Promise<CanonicalCouncil | CanonicalNotFound | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/council`, { headers: serviceHeaders() });
  if (response.status === 404) { const error = await errorFromResponse(response); return { not_found: true, project_id: projectId, status: 404, error: error.errorCode ?? "HTTP_404", detail: typeof error.envelope.detail === "string" ? error.envelope.detail : undefined, envelope: error.envelope }; }
  if (!response.ok) throw await errorFromResponse(response);
  return response.json() as Promise<CanonicalCouncil>;
}

export async function fetchCanonicalSnapshot(projectId: string): Promise<CanonicalCoreSnapshot | CanonicalNotFound | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/snapshot`, { headers: serviceHeaders() });
  if (response.status === 404) { const error = await errorFromResponse(response); return { not_found: true, project_id: projectId, status: 404, error: error.errorCode ?? "HTTP_404", detail: typeof error.envelope.detail === "string" ? error.envelope.detail : undefined, envelope: error.envelope }; }
  if (!response.ok) throw await errorFromResponse(response);
  return response.json() as Promise<CanonicalCoreSnapshot>;
}

export async function createCoreProject(projectId: string, name: string, scopes?: { spatialScope?: SpatialScope; temporalScope?: TemporalScope }) {
  return coreRequest<{ contract_version: string; project_id: string; observed_version: number; snapshot: Record<string, unknown> }>("/v1/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ project_id: projectId, name, ...(scopes?.spatialScope ? { spatial_scope: { scale: scopes.spatialScope.scale, id: scopes.spatialScope.id, name: scopes.spatialScope.name, ...(scopes.spatialScope.parentId ? { parent_id: scopes.spatialScope.parentId } : {}) } } : {}), ...(scopes?.temporalScope ? { temporal_scope: scopes.temporalScope } : {}) }) });
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
