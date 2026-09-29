export type CanonicalCoreSnapshot = { contract_version: string; project_id: string; observed_version: number | null; snapshot: Record<string, unknown> };
import type { SpatialScope, TemporalScope } from "@shared/siclScopes";

export type CanonicalNotFound = { not_found: true; project_id: string; status: 404; error: string; detail?: string; envelope: Record<string, unknown> };
type CoreWriteResponse = { contract_version: string; project_id: string; observed_version: number | null; [key: string]: unknown };

export type ReasoningKind = "PROJECT_BRAIN" | "D6_2" | "D6_3" | "DEVELOPER_PROPOSAL";
export type EpistemicStatus = "FACT" | "ASSUMPTION" | "HYPOTHESIS" | "UNKNOWN" | "CONFLICT" | "PROPOSAL";

export interface ReasoningExecutionRequest {
  execution_id: string;
  kind: ReasoningKind;
  fingerprint: string;
  input_fingerprint: string | null;
  payload: Record<string, unknown>;
  epistemic_status: EpistemicStatus;
  human_authority_ref: Record<string, unknown> | null;
  source_refs: unknown[];
  actor: string;
  created_at: string;
}

export interface ReasoningExecutionResponse {
  status: "RECORDED";
  execution_id: string;
  event_id: number;
  observed_version: number;
}
export type OperationsResearchMethod = { method: string; required_inputs: string[]; required_units: string[]; required_constraints: string[]; required_assumptions: string[]; required_provenance: string[]; output_fields: string[]; feasibility_states: string[]; sensitivity_outputs: string[]; version: string };
export type OperationsResearchCatalog = { contract_version: string; read_only: boolean; methods: OperationsResearchMethod[] };
export type CanonicalCouncil = { contract_version: string; project_id: string; observed_version: number; read_only: true; readOnly: boolean; finding: string; comparisons: unknown[]; multi_comparisons: unknown[]; tradeoffs: unknown[]; recommendations: unknown[]; [key: string]: unknown };
export type CanonicalHistory = { contract_version: string; project_id: string; observed_version: number; events: unknown[] };

type V1Envelope = { contract_version: string; status: string; code: string; message: string; project_id?: string | null; observed_version?: number | null; data?: Record<string, unknown> };

export class SiclCoreHttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly errorCode?: string,
    detail?: string,
    public readonly envelope: Record<string, unknown> = {},
    public readonly retryAfter: number | null = null,
  ) {
    super(detail ? `SICL Core adapter returned ${status}: ${detail}` : `SICL Core adapter returned ${status}`);
    this.name = "SiclCoreHttpError";
  }
}

export type CoreOperationalStatus = "CORE_UNAVAILABLE" | "CORE_UNAUTHORIZED" | "CORE_TIMEOUT" | "CORE_HTTP_ERROR" | "CORE_CONTRACT_ERROR" | "CORE_OK";

export function classifyCoreError(error: unknown): CoreOperationalStatus {
  if (error instanceof Error && error.message === "SICL_CORE_URL is required") return "CORE_UNAVAILABLE";
  if (error instanceof Error && error.message === "SICL_CORE_SERVICE_TOKEN is required") return "CORE_UNAUTHORIZED";
  if (error instanceof Error && error.name === "AbortError") return "CORE_TIMEOUT";
  if (error instanceof SiclCoreHttpError) return error.status === 401 || error.status === 403 ? "CORE_UNAUTHORIZED" : "CORE_HTTP_ERROR";
  return "CORE_UNAVAILABLE";
}

export async function checkCoreHealth(): Promise<{ status: "ok"; observed_version?: number; contract_version?: string }> {
  const result = await coreRequest<{ status?: string; observed_version?: number; contract_version?: string }>("/v1/scales", { method: "GET" });
  if (!result || typeof result !== "object") throw new Error("Core health response is not a valid envelope");
  return { status: "ok", observed_version: result.observed_version, contract_version: result.contract_version };
}

export async function proxyCoreRequest(path: string, init: RequestInit = {}) {
  const base = coreUrl();
  if (!base) throw new Error("SICL_CORE_URL is required");
  const response = await fetchWithTimeout(`${base}${path}`, {
    ...init,
    headers: { ...serviceHeaders(), ...(init.headers ?? {}) },
  });
  const body = await response.text();
  return { status: response.status, contentType: response.headers.get("content-type") ?? "application/json", body };
}

const CORE_TIMEOUT_MS = 15_000;
async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CORE_TIMEOUT_MS);
  try { return await fetch(input, { ...init, signal: init.signal ?? controller.signal }); }
  finally { clearTimeout(timeout); }
}

export function hasCoreUrl(): boolean { return Boolean(coreUrl()); }
function coreUrl(): string | undefined { const value = process.env.SICL_CORE_URL?.trim(); return value ? value.replace(/\/$/, "") : undefined; }
function serviceHeaders() { const token = process.env.SICL_CORE_SERVICE_TOKEN?.trim(); if (!token) throw new Error("SICL_CORE_SERVICE_TOKEN is required"); return { accept: "application/json", authorization: `Bearer ${token}` }; }

function unwrap<T>(body: T): T {
  if (!body || typeof body !== "object") return body;
  const envelope = body as unknown as V1Envelope;
  if (!envelope.data || typeof envelope.data !== "object") return body;
  return { ...envelope, ...envelope.data } as T;
}

function parseRetryAfter(value: string | null): number | null {
  if (value === null || !/^[1-9]\\d*$/.test(value.trim())) return null;
  const seconds = Number(value.trim());
  return Number.isSafeInteger(seconds) ? seconds : null;
}

async function errorFromResponse(response: Response): Promise<SiclCoreHttpError> {
  let errorCode: string | undefined;
  let detail: string | undefined;
  let envelope: Record<string, unknown> = {};
  try {
    envelope = await response.json() as Record<string, unknown>;
    const nested = envelope.detail;
    if (nested && typeof nested === "object") {
      const body = nested as Record<string, unknown>;
      if (typeof body.code === "string") errorCode = body.code;
      if (typeof body.message === "string") detail = body.message;
    } else if (typeof nested === "string") {
      detail = nested;
    }
    if (!errorCode && typeof envelope.error === "string") errorCode = envelope.error;
    if (!errorCode && typeof envelope.code === "string") errorCode = envelope.code;
    if (!detail && typeof envelope.message === "string") detail = envelope.message;
  } catch { /* Preserve status when body is empty or malformed. */ }
  return new SiclCoreHttpError(response.status, errorCode, detail, envelope, parseRetryAfter(response.headers.get("retry-after")));
}

async function coreRequest<T>(path: string, init: RequestInit): Promise<T> {
  const base = coreUrl();
  if (!base) throw new Error("SICL_CORE_URL is required");
  const response = await fetch(`${base}${path}`, { ...init, headers: { ...serviceHeaders(), ...(init.headers ?? {}) } });
  if (!response.ok) throw await errorFromResponse(response);
  return unwrap(await response.json() as T);
}

async function coreRequestWithTimeout<T>(path: string, init: RequestInit): Promise<T> {
  const base = coreUrl();
  if (!base) throw new Error("SICL_CORE_URL is required");
  const response = await fetchWithTimeout(`${base}${path}`, { ...init, headers: { ...serviceHeaders(), ...(init.headers ?? {}) } });
  if (!response.ok) throw await errorFromResponse(response);
  return unwrap(await response.json() as T);
}

export async function fetchOperationsResearchMethods(): Promise<OperationsResearchCatalog | undefined> {
  if (!coreUrl()) return undefined;
  return coreRequest<OperationsResearchCatalog>("/v1/operations-research/methods", { method: "GET" });
}

export async function fetchCanonicalCouncil(projectId: string): Promise<CanonicalCouncil | CanonicalNotFound | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/council`, { headers: serviceHeaders() });
  if (response.status === 404) { const error = await errorFromResponse(response); return { not_found: true, project_id: projectId, status: 404, error: error.errorCode ?? "HTTP_404", detail: error.envelope.detail as string | undefined, envelope: error.envelope }; }
  if (!response.ok) throw await errorFromResponse(response);
  return unwrap(await response.json() as CanonicalCouncil);
}

export async function fetchCanonicalSnapshot(projectId: string): Promise<CanonicalCoreSnapshot | CanonicalNotFound | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/snapshot`, { headers: serviceHeaders() });
  if (response.status === 404) { const error = await errorFromResponse(response); return { not_found: true, project_id: projectId, status: 404, error: error.errorCode ?? "HTTP_404", detail: error.envelope.detail as string | undefined, envelope: error.envelope }; }
  if (!response.ok) throw await errorFromResponse(response);
  return unwrap(await response.json() as CanonicalCoreSnapshot);
}

export async function fetchCanonicalHistory(projectId: string): Promise<CanonicalHistory | CanonicalNotFound | undefined> {
  const base = coreUrl();
  if (!base) return undefined;
  const response = await fetch(`${base}/v1/projects/${encodeURIComponent(projectId)}/history`, { headers: serviceHeaders() });
  if (response.status === 404) { const error = await errorFromResponse(response); return { not_found: true, project_id: projectId, status: 404, error: error.errorCode ?? "HTTP_404", detail: error.envelope.detail as string | undefined, envelope: error.envelope }; }
  if (!response.ok) throw await errorFromResponse(response);
  return unwrap(await response.json() as CanonicalHistory);
}

export async function createCoreProject(projectId: string, name: string, scopes?: { spatialScope?: SpatialScope; temporalScope?: TemporalScope }) {
  return coreRequest<{ contract_version: string; project_id: string; observed_version: number; snapshot: Record<string, unknown> }>("/v1/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ project_id: projectId, name, ...(scopes?.spatialScope ? { spatial_scope: { scale: scopes.spatialScope.scale, id: scopes.spatialScope.id, name: scopes.spatialScope.name, ...(scopes.spatialScope.parentId ? { parent_id: scopes.spatialScope.parentId } : {}) } } : {}), ...(scopes?.temporalScope ? { temporal_scope: scopes.temporalScope } : {}) }) });
}

export async function createCorePreference(projectId: string, payload: Record<string, unknown>) {
  const statement = payload.justification ?? payload.statement ?? payload.name;
  return coreRequest<CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/preferences`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, statement }) });
}

export async function createCoreRecommendation(projectId: string, payload: Record<string, unknown>) {
  return coreRequest<CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/recommendations`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
}

export async function appendCoreReasoningExecution(projectId: string, request: ReasoningExecutionRequest): Promise<ReasoningExecutionResponse> {
  return coreRequest<ReasoningExecutionResponse>(`/v1/projects/${encodeURIComponent(projectId)}/reasoning-executions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(request) });
}

export interface BoundHumanReviewRequest {
  actor: string;
  timestamp: string;
  review: string;
  reason: string;
  authority: string;
  referenced_entity_type: "DEVELOPER_PROPOSAL";
  referenced_entity_id: string;
  referenced_fingerprint: string;
}

export interface BoundHumanReviewResponse extends CoreWriteResponse {
  human_review: {
    review_id: string;
    project_id: string;
    actor: string;
    timestamp: string;
    review: string;
    reason: string;
    authority: string;
    status: "APPROVED";
    version: number;
    referenced_entity_type: "DEVELOPER_PROPOSAL";
    referenced_entity_id: string;
    referenced_fingerprint: string;
  };
}

export function recordCoreHumanReview(projectId: string, payload: BoundHumanReviewRequest): Promise<BoundHumanReviewResponse>;
export function recordCoreHumanReview(projectId: string, payload: Record<string, unknown>): Promise<CoreWriteResponse>;
export async function recordCoreHumanReview(projectId: string, payload: BoundHumanReviewRequest | Record<string, unknown>): Promise<BoundHumanReviewResponse | CoreWriteResponse> {
  const isBoundDeveloperReview =
    payload.referenced_entity_type === "DEVELOPER_PROPOSAL";
  const body = isBoundDeveloperReview
    ? payload
    : {
        ...payload,
        actor: payload.actor ?? (payload as Record<string, unknown>).actor_id,
        authority: payload.authority ?? (payload as Record<string, unknown>).authority_basis,
        review: payload.review ?? "Recommendation reviewed by human authority",
        timestamp: payload.timestamp ?? new Date().toISOString(),
      };
  return coreRequest<BoundHumanReviewResponse | CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/human-reviews`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function recordCoreDecision(projectId: string, payload: Record<string, unknown>) {
  return coreRequest<CoreWriteResponse>(`/v1/projects/${encodeURIComponent(projectId)}/decisions`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...payload, actor: payload.actor ?? payload.actor_id ?? payload.decision_maker, authority: payload.authority ?? payload.authority_basis, statement: payload.statement ?? payload.rationale }) });
}


export interface DeveloperPromotionRequest {
  proposal_id: string;
  proposal_fingerprint: string;
  human_review_id: string;
}

export interface DeveloperPromotionResponse extends CoreWriteResponse {
  status: "COMMITTED";
  proposal_id: string;
  snapshot_id: string;
  d2_version: number;
  effects_status: "COMPLETE" | "PARTIAL" | "FAILED" | "NOT_ATTEMPTED";
  reason: string | null;
}

export interface CoreD2Snapshot {
  snapshot_id: string;
  project_id: string;
  version: number;
  elements: unknown[];
  content_hash: string;
  actor: string;
  source_event_id: number;
  created_at: string;
}

export interface CoreD2SnapshotResponse extends CoreWriteResponse {
  snapshot: CoreD2Snapshot;
}

export async function promoteDeveloperProposal(projectId: string, request: DeveloperPromotionRequest): Promise<DeveloperPromotionResponse> {
  return coreRequestWithTimeout<DeveloperPromotionResponse>(`/v1/projects/${encodeURIComponent(projectId)}/developer-promotions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(request),
  });
}

export async function fetchCoreD2Snapshot(projectId: string, version: number): Promise<CoreD2SnapshotResponse> {
  return coreRequest<CoreD2SnapshotResponse>(`/v1/projects/${encodeURIComponent(projectId)}/d2/snapshots/${encodeURIComponent(String(version))}`, {
    method: "GET",
  });
}
