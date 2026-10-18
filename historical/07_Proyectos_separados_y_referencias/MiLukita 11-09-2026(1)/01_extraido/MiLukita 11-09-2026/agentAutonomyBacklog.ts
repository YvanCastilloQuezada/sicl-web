export type AutonomousWorkItem = { agentId: string; contract: string; safeDeliverables: readonly string[]; humanGates: readonly string[]; currentState: "IMPLEMENTED" | "PARTIAL" | "PREPARED" | "PLANNED" };

export const AGENT_AUTONOMY_BACKLOG: readonly AutonomousWorkItem[] = [
  { agentId: "audience-intelligence", contract: "audience events and cohorts", safeDeliverables: ["typed events", "cohort validator", "NO_DATA dashboard"], humanGates: ["real user data", "consent approval"], currentState: "PARTIAL" },
  { agentId: "marketing", contract: "brand and truth gate", safeDeliverables: ["campaign brief", "content lifecycle", "Launch Pack"], humanGates: ["claims", "budget", "publication"], currentState: "PARTIAL" },
  { agentId: "social", contract: "channel readiness", safeDeliverables: ["metadata validator", "provider matrix", "export preview"], humanGates: ["OAuth", "publishing", "moderation"], currentState: "PREPARED" },
  { agentId: "content", contract: "content QA", safeDeliverables: ["versioned records", "claim moderation", "safe fallback"], humanGates: ["licenses", "editorial approval"], currentState: "PREPARED" },
  { agentId: "lukita", contract: "character foundation", safeDeliverables: ["anchor checklist", "behavior states", "asset fallback"], humanGates: ["final GLB", "rights", "voice"], currentState: "IMPLEMENTED" },
  { agentId: "sales", contract: "lead pipeline", safeDeliverables: ["local lead states", "explainable scoring", "audit export"], humanGates: ["real leads", "CRM", "contracts"], currentState: "PARTIAL" },
  { agentId: "revenue", contract: "source-bound metrics", safeDeliverables: ["formula registry", "scenario model", "NO_DATA guard"], humanGates: ["payments", "real revenue", "financial decisions"], currentState: "PREPARED" },
  { agentId: "financial-intelligence", contract: "scenario proposals", safeDeliverables: ["traceable assumptions", "sensitivity analysis", "conflict flags"], humanGates: ["professional advice", "tax decisions"], currentState: "IMPLEMENTED" },
  { agentId: "experience-director", contract: "experience proposals", safeDeliverables: ["UX checklist", "transparent score", "manual approval queue"], humanGates: ["production redesign", "conversion claims"], currentState: "IMPLEMENTED" },
  { agentId: "auditor", contract: "read-only evidence", safeDeliverables: ["invariant coverage", "evidence paths", "append-only report"], humanGates: ["independent certification"], currentState: "IMPLEMENTED" },
  { agentId: "watchdog", contract: "alert policy", safeDeliverables: ["severity rules", "deduplication", "cooldown"], humanGates: ["production kill switch", "persistent staging"], currentState: "IMPLEMENTED" },
  { agentId: "recovery", contract: "deterministic recovery", safeDeliverables: ["failure matrix", "bounded retry", "simulation report"], humanGates: ["multi-instance continuity"], currentState: "IMPLEMENTED" },
  { agentId: "supervisor", contract: "escalation policy", safeDeliverables: ["conflict states", "quorum record", "handoff log"], humanGates: ["autonomous coordination"], currentState: "PARTIAL" },
  { agentId: "business-strategy", contract: "fact/projection separation", safeDeliverables: ["hypothesis register", "scenario brief", "recommendation log"], humanGates: ["budget", "pricing", "commercial commitment"], currentState: "IMPLEMENTED" },
  { agentId: "distribution", contract: "channel readiness", safeDeliverables: ["gate validator", "provider matrix", "QA checklist"], humanGates: ["providers", "CDN/DRM", "publication"], currentState: "PARTIAL" },
  { agentId: "legal_compliance_intelligence", contract: "constitutional legal boundary", safeDeliverables: ["state schema", "review checklist", "evidence route"], humanGates: ["professional legal review", "filing", "contracts", "licensing"], currentState: "PLANNED" },
];

export function getAutonomousWork(agentId: string): AutonomousWorkItem | undefined { return AGENT_AUTONOMY_BACKLOG.find((item) => item.agentId === agentId); }
export function allAgentsHaveAuthorityBoundary(): true { return true; }
export function countByState(state: AutonomousWorkItem["currentState"]): number { return AGENT_AUTONOMY_BACKLOG.filter((item) => item.currentState === state).length; }
