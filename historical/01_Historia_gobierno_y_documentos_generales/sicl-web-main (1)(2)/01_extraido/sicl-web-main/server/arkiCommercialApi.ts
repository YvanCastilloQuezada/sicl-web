import { enterpriseCapabilityMatrix, type EnterpriseRunInput } from "./arkiEnterpriseArchitecture";

export type CommercialPlan = "EVALUATION" | "PROFESSIONAL" | "ENTERPRISE";
export type CommercialApiRequest = { apiVersion: "v1"; tenantId: string; actorId: string; plan: CommercialPlan; operation: "CAPABILITIES" | "ARCHITECTURE_PLAN" | "EXPORT_REQUEST"; input?: EnterpriseRunInput; idempotencyKey: string };
export type CommercialApiResponse = { apiVersion: "v1"; requestId: string; tenantId: string; status: "ACCEPTED" | "REJECTED"; result: unknown; audit: { actorId: string; idempotencyKey: string; humanReviewRequired: true } };

const limits: Record<CommercialPlan, number> = { EVALUATION: 10, PROFESSIONAL: 100, ENTERPRISE: 1000 };

export function validateCommercialRequest(request: CommercialApiRequest) {
  const errors: string[] = [];
  if (!request.tenantId.trim()) errors.push("tenantId is required");
  if (!request.actorId.trim()) errors.push("actorId is required");
  if (!request.idempotencyKey.trim()) errors.push("idempotencyKey is required");
  return { valid: errors.length === 0, errors, monthlyOperationLimit: limits[request.plan] };
}

export function handleCommercialApiRequest(request: CommercialApiRequest): CommercialApiResponse {
  const check = validateCommercialRequest(request);
  const requestId = `ARKI-API-${request.idempotencyKey}`;
  if (!check.valid) return { apiVersion: "v1", requestId, tenantId: request.tenantId, status: "REJECTED", result: { errors: check.errors }, audit: { actorId: request.actorId, idempotencyKey: request.idempotencyKey, humanReviewRequired: true } };
  const result = request.operation === "CAPABILITIES" ? { capabilities: enterpriseCapabilityMatrix() } : { status: "ACCEPTED", message: "Request registered at the commercial boundary; internal execution requires the governed ARKI runtime and human review." };
  return { apiVersion: "v1", requestId, tenantId: request.tenantId, status: "ACCEPTED", result, audit: { actorId: request.actorId, idempotencyKey: request.idempotencyKey, humanReviewRequired: true } };
}

export function commercialApiContract() { return { name: "ARKI Commercial API", version: "v1", brainSeparated: true, authentication: "required", tenancy: "required", idempotency: "required", humanReviewRequired: true, billing: "external integration required", limits }; }
