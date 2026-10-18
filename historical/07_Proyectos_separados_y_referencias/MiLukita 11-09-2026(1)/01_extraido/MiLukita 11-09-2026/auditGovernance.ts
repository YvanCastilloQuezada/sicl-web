export const GOVERNANCE_STATES = [
  "IMPLEMENTED",
  "PARTIAL",
  "SIMULATED",
  "PENDING",
  "BLOCKED",
  "EXTERNAL_REQUIRED",
  "REQUIRES_HUMAN",
  "NOT_VERIFIED",
  "DEPRECATED",
] as const;
export type GovernanceState = (typeof GOVERNANCE_STATES)[number];

export const GOVERNANCE_CAPABILITIES = [
  "AUDIT_READ",
  "AUDIT_VALIDATE",
  "GOVERNANCE_WRITE",
  "HUMAN_APPROVAL",
  "RBAC_ADMIN",
  "MJP_CORE_WRITE",
] as const;
export type GovernanceCapability = (typeof GOVERNANCE_CAPABILITIES)[number];

export function requiresHumanAuthority(action: string) {
  return ["APPROVE", "PUBLISH", "MODIFY_RBAC", "RESOLVE_CRITICAL_CONFLICT", "MODIFY_MJP_CORE"].includes(action.toUpperCase());
}

export function isGovernanceState(value: string): value is GovernanceState {
  return (GOVERNANCE_STATES as readonly string[]).includes(value);
}

export function isActionAfterIntent(intentFound: boolean) {
  return intentFound;
}
