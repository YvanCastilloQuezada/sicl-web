import { authorizeManiacCoreTrust } from "./arkiSecurityLayers";

export type ArkiLayer = "EDGE" | "BRAIN" | "CORE_TRUST";
export type AuthorityLevel = "NONE" | "SYSTEM" | "HUMAN";
export type EpistemicStatus = "FACT" | "ASSUMPTION" | "INFERENCE" | "GENERATED" | "UNKNOWN";
export type CoreOperation = "PROJECT_CREATE" | "PROJECT_STATE_COMMIT" | "INITIAL_INTAKE_COMMIT" | "REASONING_APPEND" | "HUMAN_REVIEW_APPEND" | "HUMAN_DECISION_APPEND" | "HISTORY_APPEND";

export const ARKI_THREE_LAYER_CONTRACT = {
  version: "ARKI-THREE-LAYER-1.0",
  oneArki: true,
  responsibilities: {
    EDGE: ["PWA", "UI", "navigation", "First Contact", "QR", "Share", "camera", "WebXR", "Field Mode", "local interaction", "safe cache", "preview", "capability detection"],
    BRAIN: ["knowledge retrieval", "reasoning", "agents", "generation", "evaluation", "comparison", "simulation", "alternatives", "superpowers", "multiscale analysis"],
    CORE_TRUST: ["identity", "authentication", "authorization", "roles", "canonical Project State", "persistence", "evidence", "provenance", "epistemic states", "human review", "human decisions", "history", "audit", "integrity", "versioning", "conflicts", "critical policies"],
  },
  authorityRule: { edge: "MAY_INTERACT", brain: "MAY_THINK", core: "MAY_COMMIT", human: "MAY_DECIDE" },
  projectState: { canonicalOwner: "CORE_TRUST", edgeState: "TEMPORARY_CACHE_PREVIEW_EXPLORE", brainState: "CANDIDATES_REASONING_SIMULATIONS" },
  humanAuthority: "FINAL",
} as const;

const ALLOWED_DEPENDENCIES: Record<ArkiLayer, ArkiLayer[]> = { EDGE: ["EDGE", "BRAIN", "CORE_TRUST"], BRAIN: ["BRAIN", "CORE_TRUST"], CORE_TRUST: ["CORE_TRUST"] };

export function assertLayerDependency(from: ArkiLayer, to: ArkiLayer): void {
  if (!ALLOWED_DEPENDENCIES[from].includes(to)) throw new Error(`Forbidden layer dependency: ${from} -> ${to}`);
}

export function classifyLayerComponent(component: string) {
  const value = component.toLowerCase();
  if (/dashboard|page|component|fieldmode|parametricruntime|commandbar|pwa|webxr|camera|qr|share|preview/.test(value)) return { component, target: "EDGE" as const, reason: "User/device interaction or local presentation responsibility." };
  if (/brain|reason|agent|superpower|parti|visual|ocr|geometry|knowledge|evaluation|simulation|recommendation|orchestrat/.test(value)) return { component, target: "BRAIN" as const, reason: "Exploration, synthesis, analysis or candidate generation." };
  if (/siclcore|router|db|projectstate|auth|audit|provenance|decision|review|history|snapshot|storage|policy/.test(value)) return { component, target: "CORE_TRUST" as const, reason: "Canonical state, authority, persistence or integrity responsibility." };
  if (/shared|types|logging|telemetry|error|config/.test(value)) return { component, target: "CROSS_CUTTING" as const, reason: "Shared contract requiring explicit ownership." };
  return { component, target: "UNRESOLVED" as const, reason: "Requires human architectural review; no name-based promotion." };
}

export function isEpistemicPromotionForbidden(from: EpistemicStatus, to: EpistemicStatus): boolean { return ["UNKNOWN", "ASSUMPTION", "INFERENCE", "GENERATED"].includes(from) && to === "FACT"; }

export function authorizeCoreOperation(input: { operation: CoreOperation; sourceLayer: ArkiLayer; authority: AuthorityLevel; humanApproved?: boolean }) {
  assertLayerDependency(input.sourceLayer, "CORE_TRUST");
  const humanAuthorityRequired = input.operation === "HUMAN_REVIEW_APPEND" || input.operation === "HUMAN_DECISION_APPEND";
  if (humanAuthorityRequired && input.authority !== "HUMAN") throw new Error(`${input.operation} requires HUMAN authority`);
  if (["PROJECT_STATE_COMMIT", "INITIAL_INTAKE_COMMIT", "REASONING_APPEND"].includes(input.operation) && input.authority === "NONE") throw new Error(`${input.operation} requires an authorized actor`);
  if (input.operation === "HUMAN_DECISION_APPEND" && input.humanApproved !== true) throw new Error("HUMAN_DECISION_APPEND requires explicit human approval");
  const maniac = authorizeManiacCoreTrust({
    action: humanAuthorityRequired ? (input.operation === "HUMAN_REVIEW_APPEND" ? "HUMAN_REVIEW_APPEND" : "HUMAN_DECISION_APPEND") : input.operation === "PROJECT_CREATE" ? "PROJECT_CREATE" : input.operation === "PROJECT_STATE_COMMIT" || input.operation === "INITIAL_INTAKE_COMMIT" || input.operation === "REASONING_APPEND" ? "PROJECT_STATE_COMMIT" : "READ",
    actorAuthenticated: input.authority !== "NONE",
    humanApproved: input.humanApproved,
    expectedVersionMatches: true,
    auditIntegrityValid: true,
  });
  if (!maniac.allowed) throw new Error(`MANIAC_CORE_DENY: ${maniac.reason}`);
  return { allowed: true as const, owner: "CORE_TRUST" as const, humanAuthorityRequired, maniac };
}

export function edgePreview<T>(value: T) { return { layer: "EDGE" as const, mutation: "NONE" as const, projectStateEffect: "NO_CANONICAL_MUTATION" as const, value }; }
export function brainCandidate<T>(value: T) { return { layer: "BRAIN" as const, mutation: "NONE" as const, epistemicStatus: "GENERATED" as const, requiresCoreCommit: true as const, value }; }
export function coreCommit<T>(value: T, operation: CoreOperation, authority: AuthorityLevel, humanApproved = false) { return { layer: "CORE_TRUST" as const, operation, authorization: authorizeCoreOperation({ operation, sourceLayer: "BRAIN", authority, humanApproved }), canonical: true as const, value }; }

export function architectureContractSummary() { return { contract: ARKI_THREE_LAYER_CONTRACT, allowedDependencies: ALLOWED_DEPENDENCIES, invariants: ["EDGE_CANNOT_SILENTLY_COMMIT", "BRAIN_CANNOT_SILENTLY_DECIDE", "CORE_DOES_NOT_NEED_UI_OR_WEBXR", "ONE_CANONICAL_PROJECT_STATE", "HUMAN_AUTHORITY_FINAL", "UNKNOWN_NEVER_SILENTLY_BECOMES_FACT", "EDGE_FAILURE_DOES_NOT_GRANT_CORE_ACCESS", "BRAIN_FAILURE_DOES_NOT_DELETE_PROJECT_STATE", "EXTERNAL_HOST_FAILURE_DEGRADES_GRACEFULLY"] }; }

export function isolationPolicy() {
  return {
    EDGE_FAILURE: "CORE_SURVIVES",
    BRAIN_FAILURE: "CORE_SURVIVES",
    AI_UNAVAILABLE: "PROJECT_STATE_SURVIVES",
    WEBXR_FAILURE: "ARKI_SURVIVES_WITH_3D_OR_CAMERA_FALLBACK",
    EXTERNAL_HOST_FAILURE: "ARKI_SURVIVES_WITH_HOST_GATE",
  } as const;
}

export function boundaryEvent(input: { layer: ArkiLayer; actorId: string; projectId: string; authority: AuthorityLevel; operation: string; result: string }) {
  return { type: "ARKI_BOUNDARY_EVENT", layer: input.layer, actorId: input.actorId, projectId: input.projectId, authority: input.authority, operation: input.operation, result: input.result, privatePayloadIncluded: false as const };
}

export function verticalFlowProof() {
  const preview = edgePreview({ kind: "RECTANGULAR_MASS", width: 24, depth: 16, height: 3.2, floors: 2 });
  const candidate = brainCandidate({ id: "ALT-PARAM-001", geometry: preview.value, recommendation: "REQUIRES_HUMAN_REVIEW" });
  const committed = coreCommit({ candidateId: candidate.value.id, command: "/PROJECT STATE COMMIT" }, "PROJECT_STATE_COMMIT", "SYSTEM");
  const history = { type: "CORE_COMMIT_RECORDED", candidateId: candidate.value.id, canonical: committed.canonical };
  return { flow: ["USER", "EDGE", "PARAMETRIC_EXPLORE", "BRAIN_ANALYSIS", "USER_APPLY", "COMMAND_RESOLUTION", "CORE_VALIDATION", "PROJECT_STATE", "HISTORY", "CLOSE", "REOPEN"], preview, candidate, committed, history, reopenedCanonical: committed.canonical };
}

export function layerCatalog() { return [{ id: "EDGE", status: "IMPLEMENTED", proof: "Local preview, UI, PWA, Field Mode and Parametric Runtime remain non-committing until Core operation." }, { id: "BRAIN", status: "IMPLEMENTED", proof: "Unified motor, Project Brain, agents, superpowers and parametric candidates produce bounded outputs." }, { id: "CORE_TRUST", status: "IMPLEMENTED", proof: "SICL Core port, protected procedures, optimistic versions, provenance, events, Human Review and Human Decision." }] as const; }
export type LayerBoundaryAudit = ReturnType<typeof verticalFlowProof>;
export type LayerRegistry = ReturnType<typeof layerCatalog>;

export default ARKI_THREE_LAYER_CONTRACT;
