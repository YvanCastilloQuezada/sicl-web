export type AgentFamily =
  | "Direction/Coordination"
  | "Architecture"
  | "Engineering/Performance"
  | "Professional Feasibility"
  | "Production/Real World"
  | "Critical Intelligence/Learning";

export type AgentDefinition = {
  id: string;
  family: AgentFamily;
  domain: string;
  requiredInputs: string[];
  primaryRuntime: string;
  implementationStatus: "IMPLEMENTED" | "PARTIAL" | "CONTRACT_ONLY";
  demonstrationStatus: "TESTED" | "NOT_DEMONSTRATED";
  evidence: string[];
  dependencies: string[];
  boundary: string;
};

export const AGENT_REGISTRY: AgentDefinition[] = [
  { id: "AGENT-BRIEF", family: "Direction/Coordination", domain: "Brief and project framing", requiredInputs: ["Project State", "intent", "constraints", "UNKNOWNs"], primaryRuntime: "Project Brain", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiProjectBrain.ts", "server/arkiProjectBrain.test.ts"], dependencies: ["PROJECT_STATE"], boundary: "Human review required; no autonomous approval." },
  { id: "AGENT-PARTI", family: "Architecture", domain: "Parti hypotheses and organizing principles", requiredInputs: ["Project State", "program", "relationships", "tensions"], primaryRuntime: "PARTI contract / Integrated Cycle", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiPartiContract.ts", "server/arkiIntegratedArchitectCycle.ts"], dependencies: ["AGENT-BRIEF", "PARTI-CONTRACT-1.0"], boundary: "Parti is not form, topology or construction proof." },
  { id: "AGENT-REGULATION", family: "Professional Feasibility", domain: "Jurisdictional source coordination", requiredInputs: ["jurisdiction", "source registry", "applicable rules"], primaryRuntime: "Advanced Geometry / source protocol", implementationStatus: "PARTIAL", demonstrationStatus: "TESTED", evidence: ["server/arkiAdvancedGeometry.ts", "official-source protocol"], dependencies: ["AGENT-BRIEF", "SOURCE_REGISTRY"], boundary: "Does not certify compliance or replace a licensed professional." },
  { id: "AGENT-COST", family: "Production/Real World", domain: "Cost and lifecycle budget coordination", requiredInputs: ["program", "quantities", "assumptions", "scenario"], primaryRuntime: "Project Lifecycle", implementationStatus: "PARTIAL", demonstrationStatus: "TESTED", evidence: ["server/arkiProjectLifecycle.ts"], dependencies: ["AGENT-BRIEF", "QUANTITY_MODEL"], boundary: "Transparent simulation; no market quote or professional estimate." },
  { id: "AGENT-CONSEQUENCE", family: "Critical Intelligence/Learning", domain: "Consequence Radar", requiredInputs: ["project change", "baseline", "domains"], primaryRuntime: "Superpowers Pack", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiSuperpowersPack.ts", "server/arkiSuperpowersPack.test.ts"], dependencies: ["PROJECT_STATE", "AGENT-BRIEF"], boundary: "Heuristic classification; human interpretation required." },
  { id: "AGENT-VOI", family: "Critical Intelligence/Learning", domain: "Value of Information", requiredInputs: ["UNKNOWN register", "impact", "dependencies"], primaryRuntime: "Superpowers Pack", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiSuperpowersPack.ts", "server/arkiSuperpowersPack.test.ts"], dependencies: ["UNKNOWN_REGISTER", "AGENT-BRIEF"], boundary: "Prioritization heuristic, not probability or certainty." },
  { id: "AGENT-DIVERGENCE", family: "Architecture", domain: "Design Divergence Analyst", requiredInputs: ["alternatives", "parti", "topology", "circulation"], primaryRuntime: "Superpowers Pack", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiSuperpowersPack.ts", "server/arkiSuperpowersPack.test.ts"], dependencies: ["AGENT-PARTI", "D6.2-M", "D6.3-G"], boundary: "Difference analysis, not design selection." },
  { id: "AGENT-DEBT", family: "Production/Real World", domain: "Architectural Debt Keeper", requiredInputs: ["decisions", "benefits", "risks", "horizon"], primaryRuntime: "Superpowers Pack", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiSuperpowersPack.ts", "server/arkiSuperpowersPack.test.ts"], dependencies: ["AGENT-BRIEF", "DECISION_LEDGER"], boundary: "Risk register requires professional review." },
  { id: "AGENT-COUNTERFACTUAL", family: "Critical Intelligence/Learning", domain: "Counterfactual Explorer", requiredInputs: ["baseline decision", "assumptions", "affected domains"], primaryRuntime: "Superpowers Pack", implementationStatus: "IMPLEMENTED", demonstrationStatus: "TESTED", evidence: ["server/arkiSuperpowersPack.ts", "server/arkiSuperpowersPack.test.ts"], dependencies: ["AGENT-BRIEF", "AGENT-CONSEQUENCE"], boundary: "Scenarios are AI_PROPOSED; no simulation claim." },
  { id: "AGENT-RED-TEAM", family: "Critical Intelligence/Learning", domain: "Red Team", requiredInputs: ["alternatives", "constraints", "evidence"], primaryRuntime: "Project Brain / DG protocols", implementationStatus: "PARTIAL", demonstrationStatus: "TESTED", evidence: ["server/arkiProjectBrain.ts", "docs/arki-knowledge/demonstration-gates/DG-01"], dependencies: ["AGENT-DIVERGENCE", "DG-01B"], boundary: "Adversarial protocol is not equivalent to independent external review." },
  { id: "AGENT-CONTRADICTION", family: "Critical Intelligence/Learning", domain: "Contradiction Hunter", requiredInputs: ["facts", "assumptions", "conflicts", "sources"], primaryRuntime: "Project Brain / SICL epistemic rules", implementationStatus: "PARTIAL", demonstrationStatus: "TESTED", evidence: ["server/arkiProjectBrain.ts", "docs/arki-knowledge"], dependencies: ["AGENT-BRIEF", "SOURCE_REGISTRY"], boundary: "Conflict detection is bounded to available inputs." },
  { id: "AGENT-TRANSFER", family: "Critical Intelligence/Learning", domain: "Cross-project Transfer", requiredInputs: ["source project", "target project", "provenance", "applicability"], primaryRuntime: "Unified Motor / L2 transfer runtime", implementationStatus: "PARTIAL", demonstrationStatus: "TESTED", evidence: ["server/arkiUnifiedMotor.ts", "docs/arki-l2"], dependencies: ["AGENT-BRIEF", "PROVENANCE", "L2_TRANSFER"], boundary: "No automatic canonization or false analogy." },
];

export const AGENT_FAMILIES = [
  { id: "F-01", name: "Direction/Coordination", specialists: ["AGENT-BRIEF"], status: "IMPLEMENTED/PARTIAL" },
  { id: "F-02", name: "Architecture", specialists: ["AGENT-PARTI", "AGENT-DIVERGENCE"], status: "IMPLEMENTED/PARTIAL" },
  { id: "F-03", name: "Engineering/Performance", specialists: ["A00–A59 target catalog"], status: "CONTRACT_ONLY / ADAPTER_REQUIRED" },
  { id: "F-04", name: "Professional Feasibility", specialists: ["AGENT-REGULATION", "AGENT-COST"], status: "PARTIAL" },
  { id: "F-05", name: "Production/Real World", specialists: ["A00–A59 target catalog"], status: "CONTRACT_ONLY / ADAPTER_REQUIRED" },
  { id: "F-06", name: "Critical Intelligence/Learning", specialists: ["AGENT-CONSEQUENCE", "AGENT-VOI", "AGENT-RED-TEAM", "AGENT-CONTRADICTION", "AGENT-TRANSFER"], status: "IMPLEMENTED/PARTIAL" },
] as const;

export function getAgentDefinition(id: string) { return AGENT_REGISTRY.find((agent) => agent.id === id); }
export function agentRegistrySummary() {
  return {
    version: "ARKI-KR6.3-AGENT-REGISTRY",
    agentCount: AGENT_REGISTRY.length,
    familyCount: AGENT_FAMILIES.length,
    testedCount: AGENT_REGISTRY.filter((agent) => agent.demonstrationStatus === "TESTED").length,
    notDemonstratedExternalSpecialists: ["A00–A59 target catalog"],
    noAutonomousProfessionalAuthority: true,
  };
}
