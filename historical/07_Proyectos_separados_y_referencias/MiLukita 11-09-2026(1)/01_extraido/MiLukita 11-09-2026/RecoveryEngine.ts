export type FailureSeverity = "WARNING" | "CRITICAL";
export type Failure = { component: string; severity: FailureSeverity; reason: string; observedAt: string };
export type RecoveryPlan = { failure: Failure; actions: Array<"RETRY_READ" | "PUBLISH_ALERT" | "ESCALATE_HUMAN">; authority: "NO_RESULT_AUTHORITY" };
export type RecoveryResult = { status: "PLANNED" | "ESCALATED"; executed: false; plan: RecoveryPlan; message: string };

export function detectFailure(component: string, reason: string, severity: FailureSeverity = "WARNING"): Failure {
  return { component, reason: reason.slice(0, 255), severity, observedAt: new Date().toISOString() };
}

export function planRecovery(failure: Failure): RecoveryPlan {
  const actions: RecoveryPlan["actions"] = ["RETRY_READ", "PUBLISH_ALERT"];
  if (failure.severity === "CRITICAL") actions.push("ESCALATE_HUMAN");
  return { failure, actions, authority: "NO_RESULT_AUTHORITY" };
}

export function executeRecovery(plan: RecoveryPlan): RecoveryResult {
  const escalated = plan.actions.includes("ESCALATE_HUMAN");
  return {
    status: escalated ? "ESCALATED" : "PLANNED",
    executed: false,
    plan,
    message: escalated ? "Recovery requiere intervención humana; no se ejecutaron cambios automáticos." : "Recovery limitado a reintento de lectura y alerta; no se ejecutaron cambios automáticos.",
  };
}
