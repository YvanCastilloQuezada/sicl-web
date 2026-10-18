import { AGENT_AUTONOMY_BACKLOG, type AutonomousWorkItem } from "./agentAutonomyBacklog";

export type SafeCapability = "CONTRACT" | "VALIDATION" | "TESTS" | "EVIDENCE_PATH" | "OBSERVABILITY" | "FAILURE_BEHAVIOR" | "AUTHORITY_BOUNDARY";
export type SafeCapabilityResult = { agentId: string; capability: SafeCapability; available: boolean; reason: string };

export function assessSafeCapability(agentId: string, capability: SafeCapability): SafeCapabilityResult {
  const item: AutonomousWorkItem | undefined = AGENT_AUTONOMY_BACKLOG.find((candidate) => candidate.agentId === agentId);
  if (!item) return { agentId, capability, available: false, reason: "AGENT_NOT_REGISTERED" };
  if (capability === "CONTRACT") return { agentId, capability, available: item.contract.trim().length > 0, reason: item.contract };
  if (capability === "EVIDENCE_PATH") return { agentId, capability, available: item.safeDeliverables.length > 0, reason: "SAFE_DELIVERABLES_CATALOGUED" };
  if (capability === "AUTHORITY_BOUNDARY") return { agentId, capability, available: true, reason: "CORE_MUTATION_DENIED_BY_CONSTITUTION" };
  if (capability === "FAILURE_BEHAVIOR") return { agentId, capability, available: item.safeDeliverables.some((deliverable) => /fallback|validator|matrix|guard|NO_DATA|readiness|cooldown/i.test(deliverable)), reason: "BOUNDED_FAILURE_PATH_REQUIRED" };
  return { agentId, capability, available: false, reason: "PERSISTENT_OR_EXTERNAL_EVIDENCE_REQUIRED" };
}

export function safeCapabilitiesFor(agentId: string): readonly SafeCapabilityResult[] {
  return ["CONTRACT", "VALIDATION", "TESTS", "EVIDENCE_PATH", "OBSERVABILITY", "FAILURE_BEHAVIOR", "AUTHORITY_BOUNDARY"].map((capability) => assessSafeCapability(agentId, capability as SafeCapability));
}

export function noAgentCanWriteProtectedCore(_agentId: string): false { return false; }
