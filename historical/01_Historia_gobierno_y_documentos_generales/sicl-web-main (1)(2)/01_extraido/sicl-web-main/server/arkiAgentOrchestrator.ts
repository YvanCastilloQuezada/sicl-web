import { executeArkiUnifiedMotor, type UnifiedMotorInput, type UnifiedMotorResult } from "./arkiUnifiedMotor";
import type { AgentDefinition } from "./arkiAgentRegistry";
import { AGENT_REGISTRY, getAgentDefinition } from "./arkiAgentRegistry";

export type AgentRunStatus = "CONTRACT_ONLY" | "IMPLEMENTED" | "CONNECTED" | "EXECUTABLE" | "TESTED" | "DEMONSTRATED" | "PARTIAL" | "BLOCKED" | "SPECIALIST_REQUIRED" | "NOT_IMPLEMENTED";

export type AgentOrchestrationInput = UnifiedMotorInput & {
  problem?: string;
  phase?: string;
  jurisdiction?: string;
  requestedAgents?: string[];
};

export type AgentArtifact = {
  agentId: string;
  projectId: string;
  timestamp: string;
  version: string;
  scale: string;
  scenario: string;
  epistemicState: "FACT" | "HYPOTHESIS" | "AI_PROPOSED" | "UNKNOWN";
  analysis: string;
  evidence: string[];
  dependencies: string[];
  unknowns: string[];
  humanReviewRequired: true;
};

export type AgentOrchestrationResult = {
  version: "ARKI-MULTI-AGENT-ORCHESTRATOR-1.0";
  oneMotor: true;
  motor: UnifiedMotorResult;
  selectedAgents: AgentDefinition[];
  artifacts: AgentArtifact[];
  selectionReasons: Array<{ agentId: string; reason: string }>;
  status: "EXECUTABLE_WITH_BOUNDS" | "PARTIAL";
  multiAgentClaim: "COORDINATED_AGENT_CONTRACTS_NOT_DEMONSTRATED";
  humanAuthority: "FINAL";
};

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const textOf = (input: AgentOrchestrationInput) => normalize([input.problem, input.phase, input.typology, input.brief, input.jurisdiction, ...input.constraints, ...input.conditions, ...input.unknowns].filter(Boolean).join(" "));

function chooseAgents(input: AgentOrchestrationInput): Array<{ agent: AgentDefinition; reason: string }> {
  const text = textOf(input);
  const explicit = new Set(input.requestedAgents ?? []);
  const selected = new Map<string, { agent: AgentDefinition; reason: string }>();
  const add = (id: string, reason: string) => {
    const agent = getAgentDefinition(id);
    if (agent) selected.set(id, { agent, reason });
  };
  add("AGENT-BRIEF", "Every orchestration begins from the common project brief and sufficiency state.");
  if (explicit.size) Array.from(explicit).forEach((id) => add(id, "Explicitly requested by the caller; still subject to its declared limits."));
  if (input.typology || /parti|program|espacio|topolog|forma|diseno|design|arquitect/.test(text)) add("AGENT-PARTI", "Every architectural typology or explicit spatial-organization request requires a parti hypothesis contract.");
  if (/norma|regul|rne|permit|jurisdic|accesib|evacu|fire|codigo|code/.test(text) || input.jurisdiction) add("AGENT-REGULATION", "Jurisdictional, regulatory or professional-feasibility evidence is relevant.");
  if (/costo|cost|presupuesto|budget|monto|precio|metrado|quantity/.test(text)) add("AGENT-COST", "Cost, quantity or budget language is present.");
  if (/consecu|impact|cambio|change|riesgo|risk/.test(text)) add("AGENT-CONSEQUENCE", "A change or impact analysis is requested.");
  if (input.unknowns.length || /que falta|unknown|incertid|dato faltante|missing/.test(text)) add("AGENT-VOI", "Unknowns or missing information require value-of-information ranking.");
  if ((input.requestedPieces ?? []).includes("PARTI-CONTRACT-1.0") || /alternativ|divergen|opcion|option/.test(text)) add("AGENT-DIVERGENCE", "Alternatives or divergence between design realizations is relevant.");
  if (input.requestedAgents?.includes("AGENT-DEBT") || /deuda|debt|mantenimiento|maintenance|decision/.test(text)) add("AGENT-DEBT", "A decision with future liabilities or maintenance horizon is relevant.");
  if (input.requestedAgents?.includes("AGENT-COUNTERFACTUAL") || /si cambi|what if|contrafactual|counterfactual|escenario/.test(text)) add("AGENT-COUNTERFACTUAL", "Counterfactual scenarios are requested.");
  if (input.requestedAgents?.includes("AGENT-RED-TEAM") || /adversarial|red team|atac|critica|falla|failure/.test(text)) add("AGENT-RED-TEAM", "Adversarial or failure-seeking review is requested.");
  if (input.requestedAgents?.includes("AGENT-CONTRADICTION") || /contradic|conflict|oposic|inconsisten/.test(text)) add("AGENT-CONTRADICTION", "Contradiction and conflict detection is relevant.");
  if (input.requestedAgents?.includes("AGENT-TRANSFER") || /transfer|analog|otro proyecto|cross project|tipolog/.test(text)) add("AGENT-TRANSFER", "Cross-project or typological transfer is relevant.");
  return Array.from(selected.values());
}

function buildArtifact(agent: AgentDefinition, input: AgentOrchestrationInput, motor: UnifiedMotorResult, reason: string): AgentArtifact {
  const now = new Date().toISOString();
  const unresolved = [
    ...input.unknowns,
    ...motor.unknowns,
    ...(agent.id === "AGENT-REGULATION" ? ["Applicable clauses and professional sign-off remain UNKNOWN until jurisdictional evidence is reviewed."] : []),
    ...(agent.id === "AGENT-COST" ? ["Market rates and measured quantities remain UNKNOWN until project-specific data is supplied."] : []),
  ];
  const epistemicState: AgentArtifact["epistemicState"] = agent.implementationStatus === "IMPLEMENTED" && agent.demonstrationStatus === "TESTED" ? "AI_PROPOSED" : "UNKNOWN";
  return {
    agentId: agent.id,
    projectId: input.projectId,
    timestamp: now,
    version: "1.0",
    scale: String(input.context.scale ?? input.context.spatialScale ?? "PROJECT"),
    scenario: input.phase ?? "CONCEPTUAL_PROJECT_CYCLE",
    epistemicState,
    analysis: `${agent.domain} (${agent.id}) was selected for this project state. The orchestrator coordinates its declared contract through the common Unified Motor; it does not create a parallel truth or approve the project. Selection reason: ${reason}`,
    evidence: ["PROJECT_STATE", ...input.sourceIds.map((id) => `SOURCE:${id}`), `MOTOR:${motor.motorVersion}`],
    dependencies: agent.dependencies,
    unknowns: Array.from(new Set(unresolved.filter(Boolean))),
    humanReviewRequired: true,
  };
}

export function orchestrateAgents(input: AgentOrchestrationInput): AgentOrchestrationResult {
  const motor = executeArkiUnifiedMotor(input);
  const selected = chooseAgents(input);
  const selectedAgents = selected.map((item) => item.agent);
  const artifacts = selected.map((item) => buildArtifact(item.agent, input, motor, item.reason));
  return {
    version: "ARKI-MULTI-AGENT-ORCHESTRATOR-1.0",
    oneMotor: true,
    motor,
    selectedAgents,
    artifacts,
    selectionReasons: selected.map((item) => ({ agentId: item.agent.id, reason: item.reason })),
    status: selectedAgents.length && motor.status === "PASS_WITH_BOUNDS" ? "EXECUTABLE_WITH_BOUNDS" : "PARTIAL",
    multiAgentClaim: "COORDINATED_AGENT_CONTRACTS_NOT_DEMONSTRATED",
    humanAuthority: "FINAL",
  };
}

export function summarizeAgentOrchestration(result: AgentOrchestrationResult) {
  return {
    version: result.version,
    oneMotor: result.oneMotor,
    selectedAgentIds: result.selectedAgents.map((agent) => agent.id),
    artifactCount: result.artifacts.length,
    humanAuthority: result.humanAuthority,
    status: result.status,
    multiAgentClaim: result.multiAgentClaim,
    noAutonomousApproval: true,
  };
}

export { AGENT_REGISTRY };
