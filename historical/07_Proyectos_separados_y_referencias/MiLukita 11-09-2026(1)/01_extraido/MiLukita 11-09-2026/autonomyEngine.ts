export const AUTONOMY_LEVELS = ["MANUAL", "ASSISTED", "SUPERVISED", "AUTONOMOUS", "RESILIENT_AUTONOMOUS"] as const;
export type AutonomyLevel = (typeof AUTONOMY_LEVELS)[number];

export const AUTONOMY_ACTIONS = ["OPEN_EVENT", "CLOSE_EVENT", "ACTIVATE_EXPERIENCE", "START_COUNTDOWN", "ACTIVATE_QR", "PUBLISH_CONTENT", "PREPARE_NEXT_EVENT", "DETECT_FAILURE", "ENTER_CONTINGENCY", "APPEND_AUDIT"] as const;
export type AutonomyAction = (typeof AUTONOMY_ACTIONS)[number];

const SAFE_ACTIONS: ReadonlySet<AutonomyAction> = new Set(AUTONOMY_ACTIONS);

export type AutonomyDecision = { allowed: boolean; requiresHumanApproval: boolean; reason: string; virtualOnly: true };

export function evaluateAutonomyAction(level: AutonomyLevel, action: AutonomyAction, controlMode: "NORMAL" | "DEGRADED" | "STOPPED" | "MAINTENANCE"): AutonomyDecision {
  if (controlMode === "STOPPED") return { allowed: false, requiresHumanApproval: true, reason: "kill_switch_active", virtualOnly: true };
  if (!SAFE_ACTIONS.has(action)) return { allowed: false, requiresHumanApproval: true, reason: "action_not_allowlisted", virtualOnly: true };
  if (level === "MANUAL") return { allowed: false, requiresHumanApproval: true, reason: "manual_mode_requires_operator", virtualOnly: true };
  if (level === "ASSISTED") return { allowed: true, requiresHumanApproval: true, reason: "proposal_requires_human_approval", virtualOnly: true };
  if (controlMode !== "NORMAL") return { allowed: true, requiresHumanApproval: true, reason: "degraded_mode_requires_human_confirmation", virtualOnly: true };
  return { allowed: true, requiresHumanApproval: false, reason: level === "RESILIENT_AUTONOMOUS" ? "resilient_supervised_action" : "allowlisted_orchestration_action", virtualOnly: true };
}

export function isAuthoritativeAction(action: string): boolean {
  return ["MODIFY_RESULT", "MODIFY_RULES", "MODIFY_PRIZE", "MODIFY_RTP", "DELETE_AUDIT", "ENABLE_REAL_MONEY", "ACTIVATE_PAYMENT", "BYPASS_KILL_SWITCH"].includes(action);
}
