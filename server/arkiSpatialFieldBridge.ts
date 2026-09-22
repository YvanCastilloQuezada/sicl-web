import { createHash, randomUUID } from "node:crypto";

export const ARKI_SPATIAL_FIELD_BRIDGE = {
  contractVersion: "ARKI-SFB-1.0" as const,
  sourceSystem: "MILUQUITA" as const,
  authoritySystem: "ARKI_SICL_CORE" as const,
  rule: "Miluquita captura y visualiza; ARKI interpreta y propone; SICL Core persiste, versiona y autoriza.",
  canonicalWrite: "SICL_CORE_ONLY" as const,
  decisionCommitFromDevice: false as const,
  publicationFromDevice: false as const,
  humanReviewRequired: true as const,
};

export type SpatialBridgeMode = "ONLINE" | "DEGRADED" | "OFFLINE" | "CORE_UNAVAILABLE" | "REVOKED";
export type SpatialBridgeOperation = "PROJECT_LINK" | "FIELD_OBSERVATION" | "PROPOSAL" | "ARTIFACT_UPLOAD";
export type SpatialBridgeObservationKind = "CAMERA" | "GPS" | "HIT_TEST" | "ANCHOR" | "VOICE" | "DOCUMENT" | "MANUAL";

export type SpatialBridgeSession = {
  sessionId: string;
  projectId: string;
  userId: number;
  deviceId: string;
  mode: SpatialBridgeMode;
  scopes: string[];
  observedProjectVersion: number;
  createdAt: string;
  expiresAt: string;
  provenance: "MILUQUITA_FIELD_SESSION";
};

export type SpatialBridgeObservation = {
  observationId: string;
  sessionId: string;
  projectId: string;
  kind: SpatialBridgeObservationKind;
  payload: Record<string, unknown>;
  confidence: "UNKNOWN" | "LOW" | "MEDIUM" | "HIGH";
  observedProjectVersion: number;
  provenance: string[];
  epistemicStatus: "AI_PROPOSED" | "USER_PROVIDED" | "UNVERIFIED";
  humanReviewRequired: true;
  capturedAt: string;
};

export type SpatialBridgeErrorCode =
  | "BRIDGE_CONTRACT_INVALID"
  | "BRIDGE_SCOPE_REQUIRED"
  | "BRIDGE_CORE_REQUIRED"
  | "BRIDGE_MODE_BLOCKED"
  | "BRIDGE_VERSION_REQUIRED"
  | "BRIDGE_DEVICE_UNTRUSTED"
  | "BRIDGE_DECISION_FORBIDDEN";

export class SpatialBridgeError extends Error {
  constructor(public readonly code: SpatialBridgeErrorCode, message: string = code) {
    super(message);
    this.name = "SpatialBridgeError";
  }
}

const WRITE_SCOPES: Record<SpatialBridgeOperation, string> = {
  PROJECT_LINK: "sfb:project:read",
  FIELD_OBSERVATION: "sfb:project:observe",
  PROPOSAL: "sfb:project:propose",
  ARTIFACT_UPLOAD: "sfb:artifact:upload",
};

const OBSERVATION_KINDS = new Set<SpatialBridgeObservationKind>(["CAMERA", "GPS", "HIT_TEST", "ANCHOR", "VOICE", "DOCUMENT", "MANUAL"]);
const MODES = new Set<SpatialBridgeMode>(["ONLINE", "DEGRADED", "OFFLINE", "CORE_UNAVAILABLE", "REVOKED"]);

export function spatialBridgeContract() {
  return {
    ...ARKI_SPATIAL_FIELD_BRIDGE,
    modes: ["ONLINE", "DEGRADED", "OFFLINE", "CORE_UNAVAILABLE", "REVOKED"] as const,
    scopes: Object.values(WRITE_SCOPES),
    observationKinds: Array.from(OBSERVATION_KINDS),
    deviceRule: "The field device never receives SICL_CORE_SERVICE_TOKEN and has no decision or publication scope.",
  };
}

export function authorizeSpatialBridgeOperation(input: {
  operation: SpatialBridgeOperation;
  mode: SpatialBridgeMode;
  scopes: string[];
  coreAvailable: boolean;
  deviceId?: string;
  expectedProjectVersion?: number;
}) {
  if (!Object.prototype.hasOwnProperty.call(WRITE_SCOPES, input.operation)) throw new SpatialBridgeError("BRIDGE_CONTRACT_INVALID");
  if (!MODES.has(input.mode)) throw new SpatialBridgeError("BRIDGE_CONTRACT_INVALID");
  if (!input.deviceId?.trim()) throw new SpatialBridgeError("BRIDGE_DEVICE_UNTRUSTED", "A registered device id is required");
  if (!input.scopes.includes(WRITE_SCOPES[input.operation])) throw new SpatialBridgeError("BRIDGE_SCOPE_REQUIRED", `Missing ${WRITE_SCOPES[input.operation]}`);
  if (!input.coreAvailable) throw new SpatialBridgeError("BRIDGE_CORE_REQUIRED", "Canonical SICL Core is unavailable; canonical write is blocked");
  if (input.mode !== "ONLINE") throw new SpatialBridgeError("BRIDGE_MODE_BLOCKED", "Only ONLINE mode can request canonical synchronization");
  if (input.expectedProjectVersion === undefined || !Number.isInteger(input.expectedProjectVersion) || input.expectedProjectVersion < 1) throw new SpatialBridgeError("BRIDGE_VERSION_REQUIRED");
  return { allowed: true as const, operation: input.operation, canonicalTarget: "SICL_CORE" as const, humanReviewRequired: true as const };
}

export function openSpatialBridgeSession(input: {
  projectId: string;
  userId: number;
  deviceId: string;
  scopes: string[];
  observedProjectVersion: number;
  coreAvailable: boolean;
  now?: Date;
  ttlMinutes?: number;
}): SpatialBridgeSession {
  const now = input.now ?? new Date();
  authorizeSpatialBridgeOperation({ operation: "PROJECT_LINK", mode: "ONLINE", scopes: input.scopes, coreAvailable: input.coreAvailable, deviceId: input.deviceId, expectedProjectVersion: input.observedProjectVersion });
  const ttlMinutes = Math.min(Math.max(Math.trunc(input.ttlMinutes ?? 15), 1), 60);
  return {
    sessionId: `SFB-${randomUUID()}`,
    projectId: input.projectId,
    userId: input.userId,
    deviceId: input.deviceId.trim(),
    mode: "ONLINE",
    scopes: Array.from(new Set(input.scopes)),
    observedProjectVersion: input.observedProjectVersion,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ttlMinutes * 60_000).toISOString(),
    provenance: "MILUQUITA_FIELD_SESSION",
  };
}

export function validateSpatialBridgeSession(session: SpatialBridgeSession, input: { userId: number; projectId: string; now?: Date }) {
  const now = input.now ?? new Date();
  if (session.userId !== input.userId || session.projectId !== input.projectId) throw new SpatialBridgeError("BRIDGE_DEVICE_UNTRUSTED", "Bridge session is not owned by this user and project");
  if (session.mode !== "ONLINE" || Date.parse(session.expiresAt) <= now.getTime()) throw new SpatialBridgeError("BRIDGE_MODE_BLOCKED", "Bridge session is expired or not online");
  return session;
}

export function buildSpatialObservation(input: {
  session: SpatialBridgeSession;
  kind: SpatialBridgeObservationKind;
  payload: Record<string, unknown>;
  confidence?: SpatialBridgeObservation["confidence"];
  expectedProjectVersion: number;
  coreAvailable: boolean;
  now?: Date;
}): SpatialBridgeObservation {
  authorizeSpatialBridgeOperation({ operation: "FIELD_OBSERVATION", mode: input.session.mode, scopes: input.session.scopes, coreAvailable: input.coreAvailable, deviceId: input.session.deviceId, expectedProjectVersion: input.expectedProjectVersion });
  if (!OBSERVATION_KINDS.has(input.kind)) throw new SpatialBridgeError("BRIDGE_CONTRACT_INVALID", "Unknown observation kind");
  if (input.session.projectId.trim() === "" || input.session.projectId !== input.session.projectId.trim()) throw new SpatialBridgeError("BRIDGE_CONTRACT_INVALID", "Invalid project id");
  if (input.expectedProjectVersion !== input.session.observedProjectVersion) throw new SpatialBridgeError("BRIDGE_VERSION_REQUIRED", "Observation version does not match linked project version");
  const now = input.now ?? new Date();
  const payload = JSON.parse(JSON.stringify(input.payload)) as Record<string, unknown>;
  return {
    observationId: `OBS-${createHash("sha256").update(`${input.session.sessionId}:${now.toISOString()}:${JSON.stringify(payload)}`).digest("hex").slice(0, 24).toUpperCase()}`,
    sessionId: input.session.sessionId,
    projectId: input.session.projectId,
    kind: input.kind,
    payload,
    confidence: input.confidence ?? "UNKNOWN",
    observedProjectVersion: input.expectedProjectVersion,
    provenance: ["SOURCE:MILUQUITA", `DEVICE:${input.session.deviceId}`, `SESSION:${input.session.sessionId}`],
    epistemicStatus: input.kind === "MANUAL" ? "USER_PROVIDED" : "AI_PROPOSED",
    humanReviewRequired: true,
    capturedAt: now.toISOString(),
  };
}

export function assertNoDeviceDecisionOrPublication(action: string): never {
  if (action === "DECISION_COMMIT" || action === "PUBLISH") throw new SpatialBridgeError("BRIDGE_DECISION_FORBIDDEN", "Field devices cannot commit decisions or publish versions");
  throw new SpatialBridgeError("BRIDGE_DECISION_FORBIDDEN", "Unsupported privileged field action");
}

export function observationRecord(observation: SpatialBridgeObservation) {
  return {
    id: observation.observationId,
    name: `Observación de campo ${observation.kind}`,
    provenance: observation.provenance,
    data: {
      sourceSystem: "MILUQUITA",
      observationKind: observation.kind,
      payload: JSON.stringify(observation.payload),
      confidence: observation.confidence,
      epistemicStatus: observation.epistemicStatus,
      humanReviewRequired: true,
      sessionId: observation.sessionId,
      capturedAt: observation.capturedAt,
    },
    status: "AI_PROPOSED",
  };
}

export function observationEvent(observation: SpatialBridgeObservation, actorId: number) {
  return {
    id: randomUUID(),
    type: "MILUQUITA_FIELD_OBSERVATION_RECEIVED",
    entityId: observation.observationId,
    actorId,
    createdAt: observation.capturedAt,
    data: {
      projectId: observation.projectId,
      sessionId: observation.sessionId,
      observedVersion: observation.observedProjectVersion,
      humanReviewRequired: true,
      sourceSystem: "MILUQUITA",
    },
  };
}

export function bridgeEvidenceSummary() {
  return {
    miluquitaProductCode: "NOT_RECOVERED",
    executableArEvidence: "NOT_FOUND_IN_PUBLIC_REPOSITORY",
    governanceEvidence: "PRESENT",
    c000RecoveryRequired: true,
    c001RealityMapStatus: "BLOCKED",
    physicalValidation: "REQUIRED",
    arkiBridgeImplementation: "CONTRACT_AND_CORE_ADAPTER_IMPLEMENTED",
  } as const;
}
