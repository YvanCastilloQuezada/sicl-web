export type QualityEvidence = "FACT" | "OBSERVED" | "SIMULATED" | "UNKNOWN" | "REQUIRES_HUMAN";
export type CognitiveLoad = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type PageQualityStatus = "APPROVED" | "APPROVED_WITH_WARNINGS" | "PROPOSED" | "BLOCKED" | "REQUIRES_HUMAN";
export type Surface = "WEB" | "MOBILE" | "DESKTOP" | "TV" | "LIVE" | "QR" | "SECOND_SCREEN" | "LUKITA" | "CONTROL_ROOM";

export type ExperienceKpiSnapshot = {
  measuredAt: string | null;
  evidence: QualityEvidence;
  visualQuality: number | null;
  contentClarity: number | null;
  messageAlignment: number | null;
  claimAccuracy: number | null;
  cognitiveLoad: CognitiveLoad | null;
  navigationSuccess: number | null;
  taskCompletion: number | null;
  timeToUnderstandingSeconds: number | null;
  qrDiscoverability: number | null;
  qrScanSuccess: number | null;
  mobileUx: number | null;
  tvUx: number | null;
  accessibility: number | null;
  performance: number | null;
};

export type ClaimAudit = { claim: string; systemState: string | null; evidence: QualityEvidence; status: "ALIGNED" | "BLOCKED" | "REQUIRES_HUMAN" | "UNKNOWN"; reason: string };
export type PageQualityGate = { pageId: string; surfaces: readonly Surface[]; checks: { content: QualityEvidence; truth: QualityEvidence; visual: QualityEvidence; ux: QualityEvidence; accessibility: QualityEvidence; performance: QualityEvidence; mobile: QualityEvidence; tv: QualityEvidence; qr: QualityEvidence; analytics: QualityEvidence; regulatory: QualityEvidence }; qualityScore: number | null; status: PageQualityStatus; blockers: readonly string[] };
export type AgentSelfAudit = { agentId: string; timestamp: string; whatDid: string; dataUsed: readonly string[]; changed: readonly string[]; notChanged: readonly string[]; recommended: readonly string[]; uncertainties: readonly string[]; exceededAuthority: false };

export const EXPERIENCE_MODULES = ["VISUAL_AUDIT", "UI_AUDIT", "CONTENT_AUDIT", "MESSAGE_ALIGNMENT", "CLAIM_VALIDATION", "COGNITIVE_LOAD", "NAVIGATION", "ACCESSIBILITY", "MOBILE_UX", "TV_UX", "QR_UX", "LUKITA_UX", "PERFORMANCE_UX", "CONVERSION_UX"] as const;
export const EXPERIENCE_AUTHORITY_BOUNDARY = ["MJP_CORE", "RNG", "RTP", "WALLET", "LEDGER", "SETTLEMENT", "RULES", "PUBLISH"] as const;

export function auditClaim(claim: string, systemState: string | null): ClaimAudit { if (!systemState) return { claim, systemState: null, evidence: "UNKNOWN", status: "UNKNOWN", reason: "NO DATA -> NO CLAIM" }; if (/simulat|planned|pending|negotiat/i.test(systemState)) return { claim, systemState, evidence: "SIMULATED", status: "BLOCKED", reason: "SIMULATED/PLANNED/NEGOTIATION cannot be presented as production" }; return { claim, systemState, evidence: "FACT", status: "ALIGNED", reason: "Claim has a stated system state" }; }
export function pageQualityDecision(gate: PageQualityGate): PageQualityStatus { if (gate.blockers.length > 0) return "BLOCKED"; if (Object.values(gate.checks).some((value) => value === "UNKNOWN" || value === "REQUIRES_HUMAN")) return "REQUIRES_HUMAN"; if (Object.values(gate.checks).some((value) => value === "SIMULATED")) return "PROPOSED"; return "APPROVED"; }
export function lukitaCannotOverrideGame(): false { return false; }
