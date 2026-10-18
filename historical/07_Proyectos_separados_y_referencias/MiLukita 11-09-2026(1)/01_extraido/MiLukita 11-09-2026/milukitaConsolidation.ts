export type ConsolidationLayer = "PRODUCT" | "ENTERTAINMENT_OS" | "BUSINESS_OS" | "AGENT_OS" | "GOVERNANCE_OS" | "MJP_CORE";
export type OperationalStatus = "IMPLEMENTED" | "PARTIAL" | "SIMULATED" | "PENDING" | "BLOCKED" | "EXTERNAL_REQUIRED" | "REQUIRES_HUMAN" | "NOT_VERIFIED" | "PRODUCTION";
export type MetricStatus = "REAL" | "SIMULATED" | "ESTIMATED" | "UNKNOWN" | "NOT_VERIFIED" | "EXTERNAL_REQUIRED" | "REQUIRES_HUMAN";
export type PriorityBand = "P0_CORE" | "P1_OPERATION" | "P2_EXPERIENCE" | "P3_INTELLIGENCE" | "P4_BUSINESS" | "P5_DISTRIBUTION_GROWTH";

export const CONSOLIDATION_LAYERS: readonly ConsolidationLayer[] = ["PRODUCT", "ENTERTAINMENT_OS", "BUSINESS_OS", "AGENT_OS", "GOVERNANCE_OS", "MJP_CORE"];
export const CONSOLIDATION_PRIORITIES: readonly PriorityBand[] = ["P0_CORE", "P1_OPERATION", "P2_EXPERIENCE", "P3_INTELLIGENCE", "P4_BUSINESS", "P5_DISTRIBUTION_GROWTH"];
export const PROTECTED_CORE_SURFACES = ["MJP_CORE", "RNG", "RTP", "RULES", "RESULT", "WALLET", "LEDGER", "SETTLEMENT"] as const;

export type MetricRecord = { name: string; formula: string | null; source: string | null; timestamp: string | null; version: string | null; quality: string | null; owner: string | null; status: MetricStatus; value: number | null };
export type EvidenceChain = { recommendationId: string; agentId: string; timestamp: string; inputData: readonly string[]; dataSources: readonly string[]; sourceVersion: string | null; assumptions: readonly string[]; modelVersion: string | null; reasoningSummary: string; confidence: number | null; recommendation: string; risk: string | null; requiredApproval: string; finalDecision: string | null; decisionMaker: string | null; decisionTimestamp: string | null };
export type HumanApprovalRequest = { requestId: string; requestedBy: string; recommendation: string; risk: string; requiredApprovals: readonly string[]; status: "PENDING_HUMAN" | "APPROVED" | "REJECTED"; evidenceId: string | null };
export type SurvivalInvariant = { id: string; failure: string; expected: string; coreImpact: false | "CRITICAL"; verified: boolean };

export const SURVIVAL_INVARIANTS: readonly SurvivalInvariant[] = [
  { id: "commercial-failure", failure: "COMMERCIAL_FAILURE", expected: "ENTERTAINMENT_CONTINUES", coreImpact: false, verified: true },
  { id: "distribution-failure", failure: "DISTRIBUTION_FAILURE", expected: "MASTER_EXPERIENCE_CONTINUES", coreImpact: false, verified: true },
  { id: "lukita-failure", failure: "LUKITA_FAILURE", expected: "MILUKITA_CONTINUES", coreImpact: false, verified: true },
  { id: "ai-failure", failure: "AI_FAILURE", expected: "DEGRADED_EXPERIENCE_NOT_CORE_FAILURE", coreImpact: false, verified: true },
  { id: "core-failure", failure: "MJP_CORE_FAILURE", expected: "CRITICAL_NO_FALSE_SUCCESS", coreImpact: "CRITICAL", verified: true },
];

export function coreIntegrityDominates(input: { coreIntegrity: number | null; business: number | null; experience: number | null; agents: number | null }): "CRITICAL" | "MEASURED" | "UNKNOWN" { if (input.coreIntegrity === 0) return "CRITICAL"; if (input.coreIntegrity == null) return "UNKNOWN"; return "MEASURED"; }
export function canPublish(status: OperationalStatus, hasCriticalFailure: boolean, humanApproved: boolean): false | true { if (hasCriticalFailure || !humanApproved) return false; return status === "PRODUCTION" || status === "IMPLEMENTED"; }
export function failSafeFor(component: "FINANCIAL" | "UX" | "CONTENT" | "DISTRIBUTION" | "SUPERVISOR"): string { if (component === "CONTENT") return "BLOCK_NEW_CONTENT_PUBLICATION"; if (component === "SUPERVISOR") return "BLOCK_SENSITIVE_AUTONOMOUS_ACTIONS"; return "CONTINUE_CORE_AND_EXISTING_EXPERIENCE"; }
export function redactPrivateReasoning(chain: EvidenceChain): Omit<EvidenceChain, "reasoningSummary"> & { reasoningSummary: string } { return { ...chain, reasoningSummary: chain.reasoningSummary.slice(0, 500) }; }
