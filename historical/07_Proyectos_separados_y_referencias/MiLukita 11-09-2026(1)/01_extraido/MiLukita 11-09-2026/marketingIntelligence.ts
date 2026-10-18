export type MarketingCapabilityState = "IMPLEMENTED" | "PARTIAL" | "SIMULATED" | "PROJECTION" | "EXTERNAL_REQUIRED" | "ROADMAP" | "BLOCKED" | "REQUIRES_HUMAN";
export type ContentLifecycle = "IDEA" | "DRAFT" | "GENERATED" | "QA" | "LEGAL_REVIEW" | "HUMAN_REVIEW" | "APPROVED" | "SCHEDULED" | "PUBLISHED" | "MEASURED" | "ARCHIVED";
export type ContentDecision = "APPROVED" | "BLOCKED" | "REQUIRES_HUMAN" | "EXTERNAL_REQUIRED";
export type ClaimStatus = "KNOWN" | "UNKNOWN" | "ESTIMATED" | "PROJECTED" | "SIMULATED" | "EXTERNAL_REQUIRED" | "FALSE_OR_UNSUPPORTED";
export type MarketingAgentKpi = "TASK_SUCCESS" | "GENERATION_SUCCESS" | "VALIDATION_SUCCESS" | "RECOMMENDATION_ACCEPTANCE" | "FALSE_CLAIM_RATE" | "POLICY_VIOLATION_RATE" | "HUMAN_ESCALATION_RATE" | "EXECUTION_LATENCY";
export type BusinessKpi = "REACH" | "IMPRESSIONS" | "ENGAGEMENT_RATE" | "CTR" | "QR_SCAN_RATE" | "NEW_USERS" | "RETURNING_USERS" | "CAC" | "CAMPAIGN_ROI";

export type BrandIntelligence = {
  identity: string;
  positioning: string;
  valueProposition: string;
  personality: string;
  tone: string;
  approvedClaims: readonly string[];
  prohibitedClaims: readonly string[];
  capabilityStates: Record<string, MarketingCapabilityState>;
  version: string;
};

export type ContentRecord = {
  contentId: string;
  campaignId: string | null;
  objective: string;
  audience: string;
  channel: string;
  format: string;
  version: string;
  author: string;
  createdAt: number;
  lifecycle: ContentLifecycle;
  claimStatus: ClaimStatus;
  productState: MarketingCapabilityState;
  legalStatus: "NOT_REVIEWED" | "CLEARED" | "BLOCKED" | "REQUIRES_HUMAN";
  experienceStatus: "NOT_REVIEWED" | "CLEARED" | "REQUIRES_HUMAN";
  approvalStatus: "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
  sourceReferences: readonly string[];
};

export type CampaignBrief = {
  campaignId: string;
  name: string;
  objective: string;
  audience: string;
  duration: string;
  budget: number | null;
  channels: readonly string[];
  message: string;
  cta: string;
  kpis: readonly string[];
  restrictions: readonly string[];
  status: "DRAFT" | "VALIDATED" | "READY_FOR_HUMAN_APPROVAL" | "SCHEDULED" | "BLOCKED" | "EXTERNAL_REQUIRED";
};

export const MARKETING_INTELLIGENCE_MODULES = ["BRAND_INTELLIGENCE", "AUDIENCE_INTERFACE", "CONTENT_STRATEGY", "CONTENT_FACTORY", "CAMPAIGN_ENGINE", "CHANNEL_STRATEGY", "CREATIVE_TESTING", "MARKETING_ANALYTICS", "ATTRIBUTION", "FUNNEL_INTELLIGENCE", "GROWTH_INTELLIGENCE", "OPTIMIZATION_ENGINE"] as const;
export const MARKETING_CONTENT_PILLARS = ["MILUKITA", "MILUKITA_LIVE", "LUKITA", "INTERACTIVE_TV", "QR_EXPERIENCE", "GAMES", "AI", "TECHNOLOGY", "COMMUNITY", "BEHIND_THE_SCENES", "B2B", "SPONSORS"] as const;
export const MARKETING_AGENT_READS = ["MARKETING_DATA", "AUDIENCE_DATA", "APPROVED_PRODUCT_INFORMATION", "APPROVED_BRAND_INFORMATION", "CAMPAIGN_DATA"] as const;
export const MARKETING_AGENT_REQUIRES_HUMAN = ["CRITICAL_PUBLICATION", "BUDGET_CHANGE", "LEGAL_SENSITIVE_CAMPAIGN", "REGULATORY_CLAIM", "COMMERCIAL_COMMITMENT", "EXTERNAL_CONTRACT"] as const;
export const MARKETING_CORE_WRITE_DENIALS = ["MJP_CORE", "RNG", "RESULT", "RTP", "WALLET", "LEDGER", "SETTLEMENT"] as const;

export function validateClaim(input: { claim: string; evidence: readonly string[]; productState: MarketingCapabilityState; claimStatus: ClaimStatus }): { status: ClaimStatus; decision: ContentDecision; reason: string } {
  const unsupported = input.evidence.length === 0 || input.productState !== "IMPLEMENTED" || input.claimStatus === "FALSE_OR_UNSUPPORTED";
  if (unsupported) return { status: "FALSE_OR_UNSUPPORTED", decision: "BLOCKED", reason: "UNVERIFIED_OR_NON_IMPLEMENTED_PRODUCT_CLAIM" };
  return { status: "KNOWN", decision: "REQUIRES_HUMAN", reason: "FACTUAL_CLAIM_REQUIRES_REVIEW_BEFORE_PUBLICATION" };
}

export function evaluateContentGate(input: Pick<ContentRecord, "claimStatus" | "productState" | "legalStatus" | "experienceStatus" | "approvalStatus">): ContentDecision {
  if (input.claimStatus === "FALSE_OR_UNSUPPORTED" || input.productState === "BLOCKED") return "BLOCKED";
  if (input.legalStatus === "BLOCKED" || input.experienceStatus === "REQUIRES_HUMAN" || input.approvalStatus !== "APPROVED") return "REQUIRES_HUMAN";
  if (input.legalStatus !== "CLEARED" || input.experienceStatus !== "CLEARED") return "REQUIRES_HUMAN";
  return "APPROVED";
}

export function marketingCoreWriteAllowed(target: string): false {
  void target;
  return false;
}

export function canPublishMarketingContent(input: Pick<ContentRecord, "claimStatus" | "legalStatus" | "experienceStatus" | "approvalStatus" | "productState">): false {
  void input;
  return false;
}

export function isBusinessKpi(kpi: string): kpi is BusinessKpi {
  return ["REACH", "IMPRESSIONS", "ENGAGEMENT_RATE", "CTR", "QR_SCAN_RATE", "NEW_USERS", "RETURNING_USERS", "CAC", "CAMPAIGN_ROI"].includes(kpi);
}

export function isAgentKpi(kpi: string): kpi is MarketingAgentKpi {
  return ["TASK_SUCCESS", "GENERATION_SUCCESS", "VALIDATION_SUCCESS", "RECOMMENDATION_ACCEPTANCE", "FALSE_CLAIM_RATE", "POLICY_VIOLATION_RATE", "HUMAN_ESCALATION_RATE", "EXECUTION_LATENCY"].includes(kpi);
}

export function repurposeContentFormats(master: string): readonly string[] {
  if (!master.trim()) return [];
  return ["REEL", "TIKTOK", "YOUTUBE_SHORT", "INSTAGRAM_POST", "STORY", "LINKEDIN", "X", "BLOG_LANDING"];
}
