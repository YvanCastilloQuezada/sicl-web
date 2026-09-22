export type AssistantProduct = "ARKI" | "LUCA";
export const AR_LU_ORCHESTRATOR_NAME = "AR-LU FEDERATED ORCHESTRATOR" as const;
export const AR_LU_ORCHESTRATOR_VERSION = "AR-LU-ORCHESTRATOR-1.0" as const;
export type AssistantSharingDisposition = "SHARED_CONTRACT" | "SHARED_READ_ONLY" | "ADAPTER_REQUIRED" | "ISOLATED" | "PLANNED";
export type AssistantMaturity = "IMPLEMENTED" | "PARTIAL" | "PREPARED" | "CONTRACT_ONLY" | "CONCEPTUAL" | "PLANNED";

export type FederatedAssistant = {
  id: string;
  name: string;
  product: AssistantProduct;
  domain: string;
  maturity: AssistantMaturity;
  mode: "READ_ONLY" | "ALERT_ONLY" | "PROPOSE_ONLY" | "PROJECTION_ONLY" | "CONTRACT_ONLY";
  disposition: AssistantSharingDisposition;
  canMutateCore: false;
  humanReviewRequired: true;
  evidence: readonly string[];
  limitation: string;
};

const LUCA_ASSISTANTS: FederatedAssistant[] = [
  ["audience-intelligence", "Audience Intelligence", "AUDIENCE", "PARTIAL", "PROPOSE_ONLY", "SHARED_READ_ONLY", "shared/agentRegistry.ts"],
  ["marketing", "Marketing Intelligence", "MARKETING", "PARTIAL", "PROPOSE_ONLY", "SHARED_CONTRACT", "shared/marketingIntelligence.ts"],
  ["social", "Social", "SOCIAL", "PREPARED", "PROJECTION_ONLY", "ADAPTER_REQUIRED", "shared/distributionOs.ts"],
  ["content", "Content", "CONTENT", "PREPARED", "PROPOSE_ONLY", "SHARED_CONTRACT", "shared/lukitaScripts.ts"],
  ["lukita", "Lukita Host Visual", "CHARACTER", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "shared/characterOs.ts"],
  ["sales", "Sales", "SALES", "PARTIAL", "PROPOSE_ONLY", "ISOLATED", "shared/commercialOs.ts"],
  ["revenue", "Revenue", "REVENUE", "PREPARED", "PROPOSE_ONLY", "ISOLATED", "shared/commercialOs.ts"],
  ["financial-intelligence", "Financial Intelligence", "FINANCE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_READ_ONLY", "shared/financialIntelligence.ts"],
  ["experience-director", "Experience Director", "EXPERIENCE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/experience/ExperienceDirector.ts"],
  ["auditor", "Auditor", "GOVERNANCE", "IMPLEMENTED", "READ_ONLY", "SHARED_READ_ONLY", "server/auditor/AuditorAgent.ts"],
  ["watchdog", "Watchdog", "GOVERNANCE", "IMPLEMENTED", "ALERT_ONLY", "SHARED_READ_ONLY", "server/watchdog/WatchdogAgent.ts"],
  ["recovery", "Recovery", "GOVERNANCE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/recovery/RecoveryEngine.ts"],
  ["supervisor", "Supervisor", "GOVERNANCE", "PARTIAL", "PROPOSE_ONLY", "ADAPTER_REQUIRED", "shared/agentGovernance.ts"],
  ["business-strategy", "Business Strategy", "GOVERNANCE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "docs/BUSINESS_STRATEGY_AGENT.md"],
  ["distribution", "Distribution", "DISTRIBUTION", "PARTIAL", "PROJECTION_ONLY", "ADAPTER_REQUIRED", "shared/distributionOs.ts"],
  ["legal-compliance-intelligence", "Legal and Compliance Intelligence", "LEGAL_COMPLIANCE", "PLANNED", "PROPOSE_ONLY", "PLANNED", "shared/legalComplianceAgent.ts"],
  ["field-voice-copilot", "Field Voice Copilot", "FIELD", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "shared/fieldVoiceCopilot.ts"],
  ["territorial-trust", "Territorial Trust", "GOVERNANCE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_READ_ONLY", "shared/territorialTrust.ts"],
  ["device-controller", "Universal Device Controller", "DEVICE_CONTROL", "IMPLEMENTED", "PROPOSE_ONLY", "ADAPTER_REQUIRED", "shared/universalController.ts"],
].map(([id, name, domain, maturity, mode, disposition, evidence]) => ({ id, name, product: "LUCA", domain, maturity: maturity as AssistantMaturity, mode: mode as FederatedAssistant["mode"], disposition: disposition as AssistantSharingDisposition, canMutateCore: false, humanReviewRequired: true, evidence: [evidence], limitation: "No puede modificar MJP CORE, publicar ni transferir secretos." }));

const ARKI_ASSISTANTS: FederatedAssistant[] = [
  ["AGENT-BRIEF", "Project Brief", "COORDINATION", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiProjectBrain.ts"],
  ["AGENT-PARTI", "Parti", "ARCHITECTURE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_READ_ONLY", "server/arkiPartiContract.ts"],
  ["AGENT-REGULATION", "Regulation", "REGULATION", "PARTIAL", "PROPOSE_ONLY", "ADAPTER_REQUIRED", "server/arkiAdvancedGeometry.ts"],
  ["AGENT-COST", "Cost", "COST", "PARTIAL", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiProjectLifecycle.ts"],
  ["AGENT-CONSEQUENCE", "Consequence Radar", "LEARNING", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiSuperpowersPack.ts"],
  ["AGENT-VOI", "Value of Information", "LEARNING", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiSuperpowersPack.ts"],
  ["AGENT-DIVERGENCE", "Design Divergence", "ARCHITECTURE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_READ_ONLY", "server/arkiSuperpowersPack.ts"],
  ["AGENT-DEBT", "Architectural Debt", "LIFECYCLE", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiSuperpowersPack.ts"],
  ["AGENT-COUNTERFACTUAL", "Counterfactual", "LEARNING", "IMPLEMENTED", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiSuperpowersPack.ts"],
  ["AGENT-RED-TEAM", "Red Team", "LEARNING", "PARTIAL", "PROPOSE_ONLY", "SHARED_READ_ONLY", "server/arkiProjectBrain.ts"],
  ["AGENT-CONTRADICTION", "Contradiction Hunter", "LEARNING", "PARTIAL", "PROPOSE_ONLY", "SHARED_READ_ONLY", "server/arkiProjectBrain.ts"],
  ["AGENT-TRANSFER", "Cross-project Transfer", "LEARNING", "PARTIAL", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiUnifiedMotor.ts"],
  ["AGENT-SYSTEMS", "Systems Engineering", "ENGINEERING", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiEtiBim.ts"],
  ["AGENT-COMPUTING", "Computer Engineering", "ENGINEERING", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiEtiBim.ts"],
  ["AGENT-SOFTWARE", "Software Engineering", "ENGINEERING", "PARTIAL", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiSecurityLayers.ts"],
  ["AGENT-ECONOMICS", "Engineering Economics", "ECONOMICS", "PARTIAL", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiCostIntelligence.ts"],
  ["AGENT-ACCOUNTING", "Accounting", "ACCOUNTING", "CONTRACT_ONLY", "CONTRACT_ONLY", "SHARED_CONTRACT", "server/arkiCostIntelligence.ts"],
  ["AGENT-FINANCE", "Finance", "FINANCE", "CONTRACT_ONLY", "CONTRACT_ONLY", "ISOLATED", "server/arkiProjectLifecycle.ts"],
  ["AGENT-ADMINISTRATION", "Administration", "GOVERNANCE", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiEtiBim.ts"],
  ["AGENT-OPERATIONS-RESEARCH", "Operations Research", "OPTIMIZATION", "PARTIAL", "PROPOSE_ONLY", "SHARED_CONTRACT", "server/arkiProjectLifecycle.ts"],
  ["AGENT-INDUSTRIAL", "Industrial Engineering", "ENGINEERING", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiEtiBim.ts"],
  ["AGENT-AGRICULTURAL", "Agricultural Engineering", "TERRITORY", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiEtiBim.ts"],
  ["AGENT-FORESTRY", "Forestry", "TERRITORY", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiEtiBim.ts"],
  ["AGENT-ORGANIZATION", "Organization", "GOVERNANCE", "CONTRACT_ONLY", "CONTRACT_ONLY", "ADAPTER_REQUIRED", "server/arkiUnifiedMotor.ts"],
  ["AGENT-INFORMATION-SECURITY", "Information Security", "SECURITY", "PARTIAL", "PROPOSE_ONLY", "SHARED_READ_ONLY", "server/arkiSecurityLayers.ts"],
].map(([id, name, domain, maturity, mode, disposition, evidence]) => ({ id, name, product: "ARKI", domain, maturity: maturity as AssistantMaturity, mode: mode as FederatedAssistant["mode"], disposition: disposition as AssistantSharingDisposition, canMutateCore: false, humanReviewRequired: true, evidence: [evidence], limitation: "No puede aprobar proyectos, firmar, publicar ni mutar el Core sin autoridad humana." }));

export const FEDERATED_ASSISTANT_CATALOG: readonly FederatedAssistant[] = [...LUCA_ASSISTANTS, ...ARKI_ASSISTANTS];

export type DirectorRequest = { request: string; sourceCommit: string; evidence: string[]; humanApproved?: boolean };
export type DirectorDecision = { director: typeof AR_LU_ORCHESTRATOR_NAME; version: typeof AR_LU_ORCHESTRATOR_VERSION; selected: FederatedAssistant[]; handoffStatus: "CANDIDATE" | "HUMAN_REVIEW" | "APPROVED" | "BLOCKED"; reasons: string[]; trace: string[]; noCoreMutation: true; noSecretTransfer: true; humanAuthority: "FINAL" };

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function directFederatedAssistants(input: DirectorRequest): DirectorDecision {
  const text = normalize(input.request);
  const selected = FEDERATED_ASSISTANT_CATALOG.filter((assistant) => {
    if (/geo|territor|mapa|gps|ar|campo|publicidad|marketing|vision|ocr|dispositivo/.test(text)) return assistant.product === "LUCA" || ["AGENT-REGULATION", "AGENT-TRANSFER", "AGENT-INFORMATION-SECURITY"].includes(assistant.id);
    if (/arquitect|bim|parti|plano|costo|presupuesto|proyecto/.test(text)) return assistant.product === "ARKI" || ["marketing", "territorial-trust", "field-voice-copilot"].includes(assistant.id);
    return assistant.disposition !== "ISOLATED";
  });
  const reasons = selected.map((assistant) => `${assistant.id}: ${assistant.disposition} · ${assistant.domain}`);
  const trace = [`REQUEST:${input.request}`, `SOURCE_COMMIT:${input.sourceCommit}`, ...input.evidence.map((evidence) => `EVIDENCE:${evidence}`), "ROUTE:ONE_GOVERNED_DIRECTOR", "CORE_WRITE:FORBIDDEN", "SECRET_TRANSFER:FORBIDDEN"];
  if (!input.sourceCommit.trim() || input.evidence.length === 0) return { director: AR_LU_ORCHESTRATOR_NAME, version: AR_LU_ORCHESTRATOR_VERSION, selected: [], handoffStatus: "BLOCKED", reasons: ["SOURCE_COMMIT_AND_EVIDENCE_REQUIRED"], trace, noCoreMutation: true, noSecretTransfer: true, humanAuthority: "FINAL" };
  return { director: AR_LU_ORCHESTRATOR_NAME, version: AR_LU_ORCHESTRATOR_VERSION, selected, handoffStatus: input.humanApproved === true ? "APPROVED" : "HUMAN_REVIEW", reasons, trace, noCoreMutation: true, noSecretTransfer: true, humanAuthority: "FINAL" };
}

export function federatedAssistantSummary() {
  return {
    total: FEDERATED_ASSISTANT_CATALOG.length,
    arki: FEDERATED_ASSISTANT_CATALOG.filter((assistant) => assistant.product === "ARKI").length,
    luca: FEDERATED_ASSISTANT_CATALOG.filter((assistant) => assistant.product === "LUCA").length,
    sharedContract: FEDERATED_ASSISTANT_CATALOG.filter((assistant) => assistant.disposition === "SHARED_CONTRACT").length,
    readOnly: FEDERATED_ASSISTANT_CATALOG.filter((assistant) => assistant.disposition === "SHARED_READ_ONLY").length,
    adapterRequired: FEDERATED_ASSISTANT_CATALOG.filter((assistant) => assistant.disposition === "ADAPTER_REQUIRED").length,
    isolated: FEDERATED_ASSISTANT_CATALOG.filter((assistant) => assistant.disposition === "ISOLATED").length,
    allCoreMutationDisabled: FEDERATED_ASSISTANT_CATALOG.every((assistant) => assistant.canMutateCore === false),
  } as const;
}
