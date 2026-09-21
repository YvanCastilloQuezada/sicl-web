export type HostWorkerKind = "DYNAMO_REVIT" | "REVIT" | "RHINO_GRASSHOPPER" | "BLENDER";
export type HostWorkerStatus = "READY" | "PENDING_EXTERNAL" | "MISCONFIGURED";

type WorkerConfig = { url: string | undefined; token: string | undefined };
const config: Record<HostWorkerKind, WorkerConfig> = {
  REVIT: { url: process.env.ARKI_REVIT_HOST_URL, token: process.env.ARKI_REVIT_HOST_TOKEN },
  DYNAMO_REVIT: { url: process.env.ARKI_DYNAMO_WORKER_URL, token: process.env.ARKI_DYNAMO_WORKER_TOKEN },
  RHINO_GRASSHOPPER: { url: process.env.ARKI_RHINO_WORKER_URL, token: process.env.ARKI_RHINO_WORKER_TOKEN },
  BLENDER: { url: process.env.ARKI_BLENDER_WORKER_URL, token: process.env.ARKI_BLENDER_WORKER_TOKEN },
};
function statusFor(kind: HostWorkerKind): HostWorkerStatus { const worker = config[kind]; if (!worker.url && !worker.token) return "PENDING_EXTERNAL"; if (!worker.url || !worker.token || !worker.url.startsWith("https://")) return "MISCONFIGURED"; return "READY"; }
export function hostWorkerCatalog() { return Object.entries(config).map(([kind, worker]) => ({ kind: kind as HostWorkerKind, status: statusFor(kind as HostWorkerKind), endpointConfigured: Boolean(worker.url), tokenConfigured: Boolean(worker.token), requiresHttps: true, humanReviewRequired: true })); }
export async function probeConfiguredHost(input: { kind: HostWorkerKind; projectId: string; artifactId: string }) {
  const worker = config[input.kind]; const status = statusFor(input.kind);
  if (status !== "READY" || !worker.url || !worker.token) return { status: "PENDING_EXTERNAL" as const, kind: input.kind, workerStatus: status, reason: "Server-side host URL/token not configured" };
  try { const response = await fetch(worker.url, { method: "POST", headers: { authorization: `Bearer ${worker.token}`, "content-type": "application/json", "x-arki-probe": "true", "x-arki-project-id": input.projectId, "x-arki-artifact-id": input.artifactId }, body: JSON.stringify({ contractVersion: "ARKI-HOST-PROBE-1.0", kind: input.kind }), signal: AbortSignal.timeout(15_000) }); const body = await response.text(); return response.ok ? { status: "HOST_REACHABLE" as const, kind: input.kind, httpStatus: response.status, body: body.slice(0, 2000) } : { status: "HOST_REJECTED" as const, kind: input.kind, httpStatus: response.status, body: body.slice(0, 2000) }; } catch (error) { return { status: "HOST_UNREACHABLE" as const, kind: input.kind, reason: error instanceof Error ? error.message : "Unknown host error" }; }
}
export async function executeAuthorizedHostWorker(input: { kind: HostWorkerKind; projectId: string; artifactId: string; command: "VALIDATE" | "EXECUTE" | "EXPORT"; payload: Record<string, unknown>; humanReviewApproved: boolean }) {
  if (!input.humanReviewApproved) return { status: "REJECTED" as const, reason: "HUMAN_REVIEW_REQUIRED" };
  const worker = config[input.kind]; const status = statusFor(input.kind);
  if (status !== "READY" || !worker.url || !worker.token) return { status: "PENDING_EXTERNAL" as const, kind: input.kind, workerStatus: status, reason: "Authorized host worker is not configured" };
  const response = await fetch(worker.url, { method: "POST", headers: { authorization: `Bearer ${worker.token}`, "content-type": "application/json", "x-arki-project-id": input.projectId, "x-arki-artifact-id": input.artifactId }, body: JSON.stringify({ contractVersion: "ARKI-HOST-WORKER-1.0", ...input }), signal: AbortSignal.timeout(120_000) });
  const body = await response.text(); if (!response.ok) return { status: "HOST_ERROR" as const, httpStatus: response.status, body: body.slice(0, 2000) }; return { status: "HOST_ACCEPTED" as const, kind: input.kind, body: body.slice(0, 20_000), humanReviewApproved: true };
}
