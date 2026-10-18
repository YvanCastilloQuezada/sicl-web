import { AGENT_REGISTRY, type AgentRegistryEntry } from "./agentRegistry";
import { safeCapabilitiesFor, noAgentCanWriteProtectedCore, type SafeCapability } from "./agentSafeCapability";

export type AgentRouteIntent = "AUDIT" | "EXPERIENCE_REVIEW" | "FINANCIAL_ANALYSIS" | "DISTRIBUTION_REVIEW" | "LEGAL_REVIEW" | "OBSERVE";
export type AgentRouteDecision = {
  intent: AgentRouteIntent;
  agentId: string | null;
  status: "ROUTED" | "NO_DATA" | "DENIED";
  mode: AgentRegistryEntry["mode"] | null;
  reason: string;
  capabilities: readonly SafeCapability[];
  canMutateCore: false;
};

const ROUTE_MAP: Record<AgentRouteIntent, string | null> = {
  AUDIT: "auditor",
  EXPERIENCE_REVIEW: "experience-director",
  FINANCIAL_ANALYSIS: "financial-intelligence",
  DISTRIBUTION_REVIEW: "distribution",
  LEGAL_REVIEW: "legal_compliance_intelligence",
  OBSERVE: "watchdog",
};

export function routeAgentIntent(intent: AgentRouteIntent): AgentRouteDecision {
  const agentId = ROUTE_MAP[intent];
  const agent = agentId ? AGENT_REGISTRY.find((entry) => entry.id === agentId) : undefined;
  if (!agent) return { intent, agentId: null, status: "NO_DATA", mode: null, reason: "AGENT_NOT_REGISTERED", capabilities: [], canMutateCore: false };
  const capabilities = safeCapabilitiesFor(agent.id).filter((result) => result.available).map((result) => result.capability);
  if (agent.evidenceState === "PLANNED" || agent.mode === "PROJECTION_ONLY") return { intent, agentId: agent.id, status: "NO_DATA", mode: agent.mode, reason: agent.limitation, capabilities, canMutateCore: noAgentCanWriteProtectedCore(agent.id) };
  return { intent, agentId: agent.id, status: "ROUTED", mode: agent.mode, reason: "ROUTED_TO_REGISTERED_AGENT_WITH_EXPLICIT_BOUNDARY", capabilities, canMutateCore: noAgentCanWriteProtectedCore(agent.id) };
}

export function registeredAgentForIntent(intent: AgentRouteIntent): AgentRegistryEntry | null {
  const id = ROUTE_MAP[intent];
  return AGENT_REGISTRY.find((entry) => entry.id === id) ?? null;
}

export function isSafeAgentIntent(intent: string): intent is AgentRouteIntent {
  return Object.prototype.hasOwnProperty.call(ROUTE_MAP, intent);
}
