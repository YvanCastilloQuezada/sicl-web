export const ARKI_EXECUTION_GOVERNANCE_VERSION = "ARKI-EXECUTION-GOVERNANCE-1.0" as const;

export type ExecutionBoundary = "FIRST_PARTY_DETERMINISTIC" | "AUTHORIZED_EXTERNAL_HOST" | "SANDBOX_STAGING" | "MARKETPLACE_FROZEN";

export const ARKI_EXECUTION_BOUNDARIES = {
  firstParty: { enabled: true, boundary: "FIRST_PARTY_DETERMINISTIC" as const, network: "NONE", codeExecution: "DECLARED_GRAPH_ONLY" },
  externalHosts: { enabled: false, boundary: "AUTHORIZED_EXTERNAL_HOST" as const, requires: ["HTTPS", "SERVER_SIDE_SECRET", "OWNER_OR_HUMAN_REVIEW", "HOST_CAPABILITY_PROBE"] },
  sandbox: { enabled: false, boundary: "SANDBOX_STAGING" as const, requires: ["SEPARATE_SERVICE", "NONROOT", "READ_ONLY", "NETWORK_NONE", "RESOURCE_LIMITS", "SECCOMP_OR_GVISOR", "PENTEST"], reason: "Docker/gVisor and escape tests are not verified in this Manus runtime" },
  marketplace: { enabled: false, boundary: "MARKETPLACE_FROZEN" as const, requires: ["SANDBOX_PASS", "HUMAN_APPROVAL", "LICENSE_REVIEW", "PRICING_REVIEW", "ROLLBACK_PLAN"] },
} as const;

export function authorizeExecutionBoundary(boundary: ExecutionBoundary, humanApproved = false) {
  if (boundary === "FIRST_PARTY_DETERMINISTIC") return { allowed: true as const, status: "ALLOWED" as const };
  if (boundary === "AUTHORIZED_EXTERNAL_HOST" && humanApproved) return { allowed: false as const, status: "HOST_NOT_CONFIGURED" as const, reason: "External host must be probed and configured server-side." };
  return { allowed: false as const, status: "FAIL_CLOSED" as const, reason: "Boundary remains disabled until its evidence gates are satisfied." };
}
