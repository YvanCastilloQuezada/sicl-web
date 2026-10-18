export type AgentMaturityState = "PLANNED" | "PREPARED" | "PARTIAL" | "IMPLEMENTED" | "EXTERNAL_REQUIRED" | "REQUIRES_HUMAN";
export type AgentEvidenceCriterion = "CONTRACT" | "VALIDATOR" | "TESTS" | "EVIDENCE" | "OBSERVABILITY" | "FAILURE_BEHAVIOR" | "AUTHORITY_BOUNDARY";

export type AgentMaturityAssessment = {
  agentId: string;
  criteria: Readonly<Record<AgentEvidenceCriterion, boolean>>;
  state: AgentMaturityState;
  missing: readonly AgentEvidenceCriterion[];
  blockedByHuman: readonly string[];
};

export const AGENT_MATURITY_CRITERIA: readonly AgentEvidenceCriterion[] = ["CONTRACT", "VALIDATOR", "TESTS", "EVIDENCE", "OBSERVABILITY", "FAILURE_BEHAVIOR", "AUTHORITY_BOUNDARY"];

export function assessAgentMaturity(input: { agentId: string; criteria: Partial<Record<AgentEvidenceCriterion, boolean>>; blockedByHuman?: readonly string[] }): AgentMaturityAssessment {
  const criteria = Object.fromEntries(AGENT_MATURITY_CRITERIA.map((criterion) => [criterion, input.criteria[criterion] === true])) as Record<AgentEvidenceCriterion, boolean>;
  const missing = AGENT_MATURITY_CRITERIA.filter((criterion) => !criteria[criterion]);
  const blockedByHuman = [...(input.blockedByHuman ?? [])];
  const state: AgentMaturityState = criteria.CONTRACT && criteria.TESTS && criteria.AUTHORITY_BOUNDARY && missing.length <= 2 ? "PARTIAL" : criteria.CONTRACT && criteria.TESTS && criteria.AUTHORITY_BOUNDARY ? "PREPARED" : "PLANNED";
  return { agentId: input.agentId, criteria, state, missing, blockedByHuman };
}

export function canAutonomouslyPromoteToImplemented(assessment: AgentMaturityAssessment): false {
  void assessment;
  return false;
}

export function maturityRequiresHumanGate(assessment: AgentMaturityAssessment): boolean {
  return assessment.blockedByHuman.length > 0 || assessment.missing.includes("EVIDENCE") || assessment.missing.includes("OBSERVABILITY");
}
