import { describe, expect, it } from "vitest";
import { AGENT_REGISTRY, AGENT_FAMILIES, agentRegistrySummary } from "./arkiAgentRegistry";
import { orchestrateAgents, summarizeAgentOrchestration, type AgentOrchestrationInput } from "./arkiAgentOrchestrator";

const input: AgentOrchestrationInput = {
  projectId: "TER-MUL-300-001",
  projectName: "Terminal intermodal",
  typology: "TRANSPORT",
  brief: "Terminal with public, service, freight, bus and taxi flows; prepare a conceptual architectural cycle.",
  context: { location: "Peru", scale: "PROJECT" },
  constraints: ["Separate public and service flows", "Maintain human review"],
  activities: [{ id: "public", label: "passengers", subjects: ["traveler"], capacity: 300, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "shared" }],
  relationships: [{ id: "r1", from: "public", to: "service", relation: "controlled interface", subjects: ["traveler", "staff"], state: "open", frequency: "daily", time: "operating-hours" }],
  subjects: ["traveler", "staff"],
  conditions: ["service access is separate", "freight circulation requires verification"],
  unknowns: ["local egress and parking requirements"],
  envelope: { width: 150, height: 200 },
  sourceIds: ["SRC-TERMINAL-BRIEF"],
  problem: "Evaluate alternatives, regulation, cost and what changes if capacity increases.",
  phase: "CONCEPT_AND_FEASIBILITY",
  jurisdiction: "PE",
};

describe("ARKI KR-6.3 Agent Registry", () => {
  it("contains the core and expanded multidisciplinary agents while preserving the A00-A59 boundary", () => {
    expect(AGENT_REGISTRY.length).toBeGreaterThanOrEqual(25);
    expect(AGENT_REGISTRY.map((agent) => agent.id)).toEqual(expect.arrayContaining(["AGENT-SYSTEMS", "AGENT-SOFTWARE", "AGENT-ECONOMICS", "AGENT-ACCOUNTING", "AGENT-FINANCE", "AGENT-OPERATIONS-RESEARCH", "AGENT-INDUSTRIAL", "AGENT-AGRICULTURAL", "AGENT-FORESTRY"]));
    expect(AGENT_FAMILIES).toHaveLength(6);
    expect(agentRegistrySummary().notDemonstratedExternalSpecialists).toContain("A00–A59 target catalog");
  });

  it("selects specialists by brief, jurisdiction, cost, unknowns and change", () => {
    const result = orchestrateAgents(input);
    expect(result.oneMotor).toBe(true);
    expect(result.motor.motorVersion).toBe("ARKI-UNIFIED-MOTOR-1.0");
    expect(result.selectedAgents.map((agent) => agent.id)).toEqual(expect.arrayContaining([
      "AGENT-BRIEF", "AGENT-PARTI", "AGENT-REGULATION", "AGENT-COST", "AGENT-CONSEQUENCE", "AGENT-VOI",
    ]));
    expect(result.artifacts.every((artifact) => artifact.projectId === input.projectId)).toBe(true);
    expect(result.artifacts.every((artifact) => artifact.humanReviewRequired)).toBe(true);
  });

  it("honors explicit agent requests without activating unknown A00-A59 names", () => {
    const result = orchestrateAgents({ ...input, requestedAgents: ["AGENT-RED-TEAM", "AGENT-TRANSFER", "A00"] });
    expect(result.selectedAgents.map((agent) => agent.id)).toEqual(expect.arrayContaining(["AGENT-BRIEF", "AGENT-RED-TEAM", "AGENT-TRANSFER"]));
    expect(result.selectedAgents.map((agent) => agent.id)).not.toContain("A00");
    expect(result.multiAgentClaim).toBe("COORDINATED_AGENT_CONTRACTS_NOT_DEMONSTRATED");
  });

  it("keeps specialist outputs epistemically bounded and exposes a summary", () => {
    const result = orchestrateAgents({ ...input, requestedAgents: ["AGENT-REGULATION", "AGENT-COST"] });
    const summary = summarizeAgentOrchestration(result);
    expect(summary.noAutonomousApproval).toBe(true);
    expect(summary.humanAuthority).toBe("FINAL");
    expect(result.artifacts.some((artifact) => artifact.unknowns.some((value) => value.includes("UNKNOWN")))).toBe(true);
  });
});
