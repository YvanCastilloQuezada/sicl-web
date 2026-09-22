export type FederatedSyncLane = "AUTO_SYNC" | "MIRROR_WITH_REVIEW" | "NEVER_SYNC";
export type FederatedSyncDirection = "ARKI_TO_LUCA" | "LUCA_TO_ARKI";

export const ARLU_FEDERATED_SYNC_VERSION = "AR-LU-FEDERATED-SYNC-1.0" as const;
export const ARLU_SYNC_INVARIANTS = [
  "SOURCE_COMMIT_REQUIRED",
  "TARGET_TESTS_REQUIRED",
  "PROVENANCE_REQUIRED",
  "NO_SECRET_TRANSFER",
  "NO_CORE_OR_PROJECT_STATE_TRANSFER",
  "NO_PRODUCT_DATA_MERGE",
  "NO_UNREVIEWED_SECURITY_OR_AUTH_MERGE",
  "ROLLBACK_POINT_REQUIRED",
] as const;

const AUTO_SYNC_PATTERNS = [
  /^shared\/(delta62Knowledge|arLuLiveTelemetry|arkiContextGate|arkiTvFrozenContract)\.ts$/,
  /^docs\/.*(AR_LU|LUCA|ARKI_CONTEXT|PROVIDER).+\.md$/,
];
const REVIEW_PATTERNS = [
  /(^|\/)(security|auth|routers|schema|migrations|database|Core|core|ProjectState)/i,
  /(^|\/)(server|client)\/.*\.(ts|tsx)$/,
];
const NEVER_SYNC_PATTERNS = [
  /(^|\/)(\.env|secrets?|credentials?|tokens?|private|uploads?|storage\/objects)/i,
  /(^|\/)(wallet|ledger|rng|rtp|mjp|roulette|game|financial)/i,
  /(^|\/)(projectState|snapshots?|canonical|production-data)/i,
];

export function classifyFederatedSyncPath(path: string): FederatedSyncLane {
  const normalized = path.replaceAll("\\", "/").replace(/^\.?\//, "");
  if (NEVER_SYNC_PATTERNS.some((pattern) => pattern.test(normalized))) return "NEVER_SYNC";
  if (AUTO_SYNC_PATTERNS.some((pattern) => pattern.test(normalized))) return "AUTO_SYNC";
  if (REVIEW_PATTERNS.some((pattern) => pattern.test(normalized))) return "MIRROR_WITH_REVIEW";
  return "MIRROR_WITH_REVIEW";
}

export function authorizeFederatedSync(input: { direction: FederatedSyncDirection; paths: string[]; sourceCommit: string; targetTestsPass: boolean; provenance: string; rollbackPoint: string; humanReview?: boolean }) {
  if (!input.sourceCommit.trim()) return { allowed: false as const, reason: "SOURCE_COMMIT_REQUIRED" };
  if (!input.provenance.trim()) return { allowed: false as const, reason: "PROVENANCE_REQUIRED" };
  if (!input.rollbackPoint.trim()) return { allowed: false as const, reason: "ROLLBACK_POINT_REQUIRED" };
  if (!input.targetTestsPass) return { allowed: false as const, reason: "TARGET_TESTS_REQUIRED" };
  const lanes = input.paths.map(classifyFederatedSyncPath);
  if (lanes.includes("NEVER_SYNC")) return { allowed: false as const, reason: "NEVER_SYNC_PATH_PRESENT", lanes };
  if (lanes.includes("MIRROR_WITH_REVIEW") && input.humanReview !== true) return { allowed: false as const, reason: "HUMAN_REVIEW_REQUIRED", lanes };
  return { allowed: true as const, reason: lanes.includes("MIRROR_WITH_REVIEW") ? "REVIEWED_MIRROR_ALLOWED" : "AUTO_SYNC_ALLOWED", lanes };
}

export function federatedSyncSummary() {
  return { version: ARLU_FEDERATED_SYNC_VERSION, lanes: ["AUTO_SYNC", "MIRROR_WITH_REVIEW", "NEVER_SYNC"] as const, invariants: ARLU_SYNC_INVARIANTS, directions: ["ARKI_TO_LUCA", "LUCA_TO_ARKI"] as const };
}
