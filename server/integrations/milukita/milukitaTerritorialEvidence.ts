export const MILUQUITA_WORLD_OBJECT_STATUSES = ["DRAFT", "CAPTURED", "UNDER_REVIEW", "EVIDENCE_REQUIRED", "VERIFIED", "PUBLISHED", "DISPUTED", "OUTDATED", "REJECTED", "ARCHIVED"] as const;
export type MiluquitaWorldObjectStatus = (typeof MILUQUITA_WORLD_OBJECT_STATUSES)[number];

export const MILUQUITA_CAPTURE_SYNC_STATUSES = ["OFFLINE", "PENDING", "SYNCED", "CONFLICT"] as const;
export type MiluquitaCaptureSyncStatus = (typeof MILUQUITA_CAPTURE_SYNC_STATUSES)[number];

export type FieldEvidenceEnvelope = {
  captureId: string;
  sourceSystem: "MILUQUITA";
  projectId: string;
  deviceId: string;
  capturedAt: string;
  observationKind: "CAMERA" | "GPS" | "HIT_TEST" | "ANCHOR" | "VOICE" | "DOCUMENT" | "MANUAL";
  payload: Record<string, unknown>;
  epistemicStatus: "USER_PROVIDED" | "AI_PROPOSED" | "UNVERIFIED";
  reviewRequired: true;
  syncStatus: MiluquitaCaptureSyncStatus;
  baseProjectVersion: number;
};

export function validateFieldGeo(input: { latitude: string | number; longitude: string | number; accuracyMeters: number }) {
  const latitude = Number(input.latitude);
  const longitude = Number(input.longitude);
  const errors: string[] = [];
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) errors.push("INVALID_LATITUDE");
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) errors.push("INVALID_LONGITUDE");
  if (!Number.isFinite(input.accuracyMeters) || input.accuracyMeters < 0) errors.push("INVALID_PRECISION");
  return { valid: errors.length === 0, errors, latitude, longitude };
}

export function canSyncFieldCapture(status: MiluquitaCaptureSyncStatus) {
  return status === "OFFLINE" || status === "PENDING";
}

export function hasVersionConflict(localVersion: number, canonicalVersion: number) {
  return localVersion !== canonicalVersion;
}

export function isPublishableEvidence(status: MiluquitaWorldObjectStatus, sourceCount: number, evidenceCount: number) {
  return status === "VERIFIED" && sourceCount > 0 && evidenceCount > 0;
}

export function preserveUnverifiedObservation(envelope: FieldEvidenceEnvelope) {
  return { ...envelope, epistemicStatus: envelope.epistemicStatus === "USER_PROVIDED" ? "USER_PROVIDED" as const : "UNVERIFIED" as const, reviewRequired: true as const };
}
