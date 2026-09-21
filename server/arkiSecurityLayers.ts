export type SecurityLayer = "EDGE" | "BRAIN_APPLICATION" | "CORE_TRUST_MANiac";

export const ARKI_SECURITY_LAYERS = {
  version: "ARKI-SECURITY-3L-1.0",
  mode: "DEFENSIVE_ONLY",
  layers: [
    {
      id: "EDGE",
      objective: "Reducir superficie de ataque antes de que una petición alcance la aplicación.",
      controls: ["CSP_ENFORCEMENT_PRODUCTION", "SECURITY_HEADERS", "ORIGIN_GUARD", "RATE_LIMIT", "WS_LIMITS", "SAFE_CACHE", "INPUT_SIZE_LIMITS"],
      failure: "DENY_AND_DEGRADE",
    },
    {
      id: "BRAIN_APPLICATION",
      objective: "Aislar exploración, agentes y generación de cualquier mutación silenciosa.",
      controls: ["PROTECTED_PROCEDURES", "ADMIN_PROCEDURES", "ZOD_VALIDATION", "HUMAN_DECISION_GATE", "UNKNOWN_PRESERVATION", "AUDIT_EVENTS", "TIMEOUT_AND_CIRCUIT_BREAKER"],
      failure: "CANDIDATE_ONLY_NO_COMMIT",
    },
    {
      id: "CORE_TRUST_MANiac",
      objective: "Máxima defensa del estado canónico: no confianza implícita, integridad verificable y bloqueo por defecto.",
      controls: ["DEFAULT_DENY", "NO_DIRECT_EDGE_WRITE", "VERSION_CONFLICT_REJECTION", "HASH_CHAIN_AUDIT", "EPISTEMIC_PROMOTION_BLOCK", "HUMAN_AUTHORITY_FINAL", "FAIL_CLOSED", "REPLAY_RESISTANCE"],
      failure: "STOP_COMMIT_AND_PRESERVE_CANONICAL_STATE",
    },
  ],
  invariants: [
    "DEFENSIVE_ONLY_NO_OFFENSIVE_AUTOMATION",
    "ONE_CANONICAL_PROJECT_STATE",
    "EDGE_NEVER_COMMITS_DIRECTLY",
    "BRAIN_NEVER_DECIDES",
    "CORE_TRUST_DENIES_UNKNOWN_OPERATIONS",
    "UNKNOWN_NEVER_PROMOTES_TO_FACT_AUTOMATICALLY",
    "AUDIT_INTEGRITY_FAILURE_STOPS_COMMIT",
    "HUMAN_AUTHORITY_IS_FINAL",
  ],
} as const;

export type CoreTrustAction = "READ" | "PREVIEW" | "PROJECT_CREATE" | "PROJECT_STATE_COMMIT" | "HUMAN_REVIEW_APPEND" | "HUMAN_DECISION_APPEND" | "UNKNOWN";

export function authorizeManiacCoreTrust(input: { action: CoreTrustAction; actorAuthenticated: boolean; humanApproved?: boolean; expectedVersionMatches?: boolean; auditIntegrityValid?: boolean }) {
  if (input.action === "UNKNOWN") return { allowed: false as const, reason: "DEFAULT_DENY_UNKNOWN_OPERATION" };
  if (!input.actorAuthenticated) return { allowed: false as const, reason: "AUTHENTICATION_REQUIRED" };
  if (input.auditIntegrityValid === false) return { allowed: false as const, reason: "AUDIT_INTEGRITY_FAILURE" };
  if (input.action === "PREVIEW" || input.action === "READ") return { allowed: true as const, reason: "READ_OR_PREVIEW_ALLOWED" };
  if (input.expectedVersionMatches === false) return { allowed: false as const, reason: "VERSION_CONFLICT" };
  if (input.action === "HUMAN_REVIEW_APPEND" || input.action === "HUMAN_DECISION_APPEND") {
    return input.humanApproved === true ? { allowed: true as const, reason: "EXPLICIT_HUMAN_AUTHORITY" } : { allowed: false as const, reason: "HUMAN_AUTHORITY_REQUIRED" };
  }
  return { allowed: true as const, reason: "AUTHORIZED_CANONICAL_COMMIT" };
}

export function securityLayerCatalog() { return ARKI_SECURITY_LAYERS; }
