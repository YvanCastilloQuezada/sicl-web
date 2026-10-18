export const WORLD_OBJECT_STATUSES = [
  "DRAFT",
  "CAPTURED",
  "UNDER_REVIEW",
  "EVIDENCE_REQUIRED",
  "VERIFIED",
  "PUBLISHED",
  "DISPUTED",
  "OUTDATED",
  "REJECTED",
  "ARCHIVED",
] as const;
export type WorldObjectStatus = (typeof WORLD_OBJECT_STATUSES)[number];

export const CLAIM_VERIFICATION_STATUSES = ["UNVERIFIED", "UNDER_REVIEW", "VERIFIED", "DISPUTED", "REJECTED"] as const;
export type ClaimVerificationStatus = (typeof CLAIM_VERIFICATION_STATUSES)[number];

export const REVIEW_DECISIONS = ["REQUEST_EVIDENCE", "VERIFY", "DISPUTE", "REJECT", "ARCHIVE"] as const;
export type ReviewDecision = (typeof REVIEW_DECISIONS)[number];

export const MAPPER_ROLES = ["MAPPER_OPERATOR", "EYE_REVIEWER", "HUMAN_AUTHORITY"] as const;
export type MapperRole = (typeof MAPPER_ROLES)[number];

export const WORLD_OBJECT_TYPES = ["PLACE", "BUILDING", "MONUMENT", "BUSINESS", "STREET", "PUBLIC_SPACE", "HERITAGE", "OBJECT", "EVENT", "ROUTE", "NATURAL_ELEMENT", "INFRASTRUCTURE"] as const;

export const CAPTURE_SESSION_STATUSES = ["DRAFT", "ACTIVE", "PAUSED", "COMPLETED", "ARCHIVED"] as const;
export type CaptureSessionStatus = (typeof CAPTURE_SESSION_STATUSES)[number];

export const CAPTURE_SYNC_STATUSES = ["OFFLINE", "PENDING", "SYNCED", "CONFLICT"] as const;
export type CaptureSyncStatus = (typeof CAPTURE_SYNC_STATUSES)[number];

export const OFFLINE_CAPTURE_STATUSES = ["OFFLINE", "PENDING_SYNC", "SYNCED", "CONFLICT", "REJECTED"] as const;
export const CONFLICT_RESOLUTIONS = ["KEEP_LOCAL", "KEEP_REMOTE", "MERGE", "MARK_DISPUTED"] as const;
export type ConflictResolution = (typeof CONFLICT_RESOLUTIONS)[number];
export type OfflineCaptureStatus = (typeof OFFLINE_CAPTURE_STATUSES)[number];

export type TerritorialSnapshotState = {
  worldObject: Record<string, unknown>;
  claims: Array<Record<string, unknown>>;
  sources: Array<Record<string, unknown>>;
  evidence: Array<Record<string, unknown>>;
  assets: Array<Record<string, unknown>>;
  status: WorldObjectStatus;
  confidenceScore: number;
  version: number;
  captureSessionId: number | null;
};

export type OfflineCapturePayload = {
  clientCaptureId: string;
  deviceFingerprint: string;
  captureSessionPublicId?: string;
  targetObjectPublicId?: string;
  baseVersion?: number;
  worldObject: TerritorialCreateInput;
  evidence?: Array<Record<string, unknown>>;
  notes?: string;
  capturedAt: string;
};

export function canSyncOfflineCapture(status: OfflineCaptureStatus) {
  return status === "OFFLINE" || status === "PENDING_SYNC";
}

export function shouldPreserveConflict(localVersion: number, serverVersion: number) {
  return localVersion !== serverVersion;
}

export type CaptureSessionFilter = {
  search?: string;
  status?: WorldObjectStatus | "ALL";
  objectType?: string;
  evidence?: "ALL" | "WITH_EVIDENCE" | "WITHOUT_EVIDENCE";
};

export type TerritorialObjectUpdateInput = {
  objectPublicId: string;
  name: string;
  description: string;
  objectType: string;
  latitude: string;
  longitude: string;
  accuracyMeters: number;
  actorUserId?: number;
};

export type TerritorialCreateInput = {
  objectType: string;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  accuracyMeters: number;
  geometry: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  relations?: Record<string, unknown>;
  assets?: Array<Record<string, unknown>>;
  captureSessionPublicId?: string;
};

export type TerritorialStatusEvent = {
  entityType: "WORLD_OBJECT" | "CLAIM" | "EVIDENCE" | "SOURCE" | "REVIEW";
  entityPublicId: string;
  eventType: string;
  actorUserId: number;
  payload: Record<string, unknown>;
};

const allowedTransitions: Record<WorldObjectStatus, readonly WorldObjectStatus[]> = {
  DRAFT: ["CAPTURED", "REJECTED", "ARCHIVED"],
  CAPTURED: ["UNDER_REVIEW", "EVIDENCE_REQUIRED", "REJECTED", "ARCHIVED"],
  UNDER_REVIEW: ["EVIDENCE_REQUIRED", "VERIFIED", "DISPUTED", "REJECTED", "ARCHIVED"],
  EVIDENCE_REQUIRED: ["CAPTURED", "UNDER_REVIEW", "REJECTED", "ARCHIVED"],
  VERIFIED: ["PUBLISHED", "DISPUTED", "OUTDATED", "ARCHIVED"],
  PUBLISHED: ["OUTDATED", "DISPUTED", "ARCHIVED"],
  DISPUTED: ["UNDER_REVIEW", "REJECTED", "ARCHIVED"],
  OUTDATED: ["UNDER_REVIEW", "ARCHIVED"],
  REJECTED: ["DRAFT", "ARCHIVED"],
  ARCHIVED: [],
};

export function canTransitionWorldObject(from: WorldObjectStatus, to: WorldObjectStatus) {
  return allowedTransitions[from].includes(to);
}

export const EVIDENCE_DIMENSIONS = ["EXISTENCE", "LOCATION", "IDENTITY", "CONTENT", "SOURCE", "FRESHNESS", "EVIDENCE", "CONSISTENCY"] as const;
export type EvidenceDimension = (typeof EVIDENCE_DIMENSIONS)[number];
export type ConfidenceBreakdown = { dimension: EvidenceDimension; points: number; reason: string };

export function calculateConfidenceBreakdown(input: { sourceCount: number; evidenceCount: number; accuracyMeters: number; claimCount: number; status: WorldObjectStatus }): ConfidenceBreakdown[] {
  return [
    { dimension: "EXISTENCE", points: input.evidenceCount > 0 ? 15 : 0, reason: input.evidenceCount > 0 ? "Existe al menos una evidencia registrada." : "Falta evidencia registrada." },
    { dimension: "LOCATION", points: input.accuracyMeters <= 50 ? 15 : input.accuracyMeters <= 250 ? 8 : 0, reason: `Precisión declarada: ${input.accuracyMeters} m.` },
    { dimension: "IDENTITY", points: input.claimCount > 0 ? 10 : 0, reason: input.claimCount > 0 ? "Hay claims que describen la identidad." : "No hay claims asociados." },
    { dimension: "CONTENT", points: input.claimCount > 0 ? 10 : 0, reason: input.claimCount > 0 ? "El expediente contiene contenido verificable." : "El contenido aún no tiene claims." },
    { dimension: "SOURCE", points: input.sourceCount > 0 ? 15 : 0, reason: input.sourceCount > 0 ? "Hay al menos una fuente asociada." : "Falta una fuente asociada." },
    { dimension: "FRESHNESS", points: 0, reason: "La actualidad requiere evaluación documental; no se infiere automáticamente." },
    { dimension: "EVIDENCE", points: input.evidenceCount > 0 ? 20 : 0, reason: input.evidenceCount > 0 ? "La evidencia está registrada y tiene huella de integridad." : "Falta evidencia." },
    { dimension: "CONSISTENCY", points: input.status === "DISPUTED" ? 0 : 15, reason: input.status === "DISPUTED" ? "El objeto está disputado y no recibe puntos de consistencia." : "No existe una disputa abierta en el estado actual." },
  ];
}

export function calculateConfidenceScore(input: Parameters<typeof calculateConfidenceBreakdown>[0]) {
  return Math.min(100, calculateConfidenceBreakdown(input).reduce((total, item) => total + item.points, 0));
}

export function canPublishWorldObject(status: WorldObjectStatus, confidenceScore: number, evidenceCount: number, sourceCount: number) {
  return status === "VERIFIED" && confidenceScore >= 1 && evidenceCount > 0 && sourceCount > 0;
}

export function isRuntimeVisible(status: WorldObjectStatus) {
  return status === "PUBLISHED";
}
