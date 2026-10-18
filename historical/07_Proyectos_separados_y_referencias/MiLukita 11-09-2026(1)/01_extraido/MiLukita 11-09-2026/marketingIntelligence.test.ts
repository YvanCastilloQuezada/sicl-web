import { describe, expect, it } from "vitest";
import {
  MARKETING_AGENT_READS,
  MARKETING_AGENT_REQUIRES_HUMAN,
  MARKETING_CONTENT_PILLARS,
  MARKETING_CORE_WRITE_DENIALS,
  evaluateContentGate,
  isAgentKpi,
  isBusinessKpi,
  marketingCoreWriteAllowed,
  canPublishMarketingContent,
  repurposeContentFormats,
  validateClaim,
} from "./marketingIntelligence";

describe("Marketing Intelligence constitutional contract", () => {
  it("blocks unsupported or non-implemented claims", () => {
    expect(validateClaim({ claim: "Disponible en 50 canales", evidence: [], productState: "PROJECTION", claimStatus: "PROJECTED" })).toEqual({ status: "FALSE_OR_UNSUPPORTED", decision: "BLOCKED", reason: "UNVERIFIED_OR_NON_IMPLEMENTED_PRODUCT_CLAIM" });
    expect(validateClaim({ claim: "TV a móvil", evidence: ["manifest-v2"], productState: "IMPLEMENTED", claimStatus: "KNOWN" }).decision).toBe("REQUIRES_HUMAN");
  });

  it("requires truth, legal, experience and human approval before publication", () => {
    expect(evaluateContentGate({ claimStatus: "FALSE_OR_UNSUPPORTED", productState: "BLOCKED", legalStatus: "BLOCKED", experienceStatus: "REQUIRES_HUMAN", approvalStatus: "PENDING" })).toBe("BLOCKED");
    expect(evaluateContentGate({ claimStatus: "KNOWN", productState: "IMPLEMENTED", legalStatus: "CLEARED", experienceStatus: "CLEARED", approvalStatus: "PENDING" })).toBe("REQUIRES_HUMAN");
    expect(canPublishMarketingContent({ claimStatus: "KNOWN", productState: "IMPLEMENTED", legalStatus: "CLEARED", experienceStatus: "CLEARED", approvalStatus: "APPROVED" })).toBe(false);
  });

  it("keeps marketing outside core authority and separates KPI families", () => {
    expect(marketingCoreWriteAllowed("RNG")).toBe(false);
    expect(MARKETING_CORE_WRITE_DENIALS).toEqual(["MJP_CORE", "RNG", "RESULT", "RTP", "WALLET", "LEDGER", "SETTLEMENT"]);
    expect(MARKETING_AGENT_READS).toContain("APPROVED_PRODUCT_INFORMATION");
    expect(MARKETING_AGENT_REQUIRES_HUMAN).toContain("REGULATORY_CLAIM");
    expect(isBusinessKpi("REACH")).toBe(true);
    expect(isAgentKpi("FALSE_CLAIM_RATE")).toBe(true);
    expect(isBusinessKpi("FALSE_CLAIM_RATE")).toBe(false);
  });

  it("preserves content pillars and controlled repurposing", () => {
    expect(MARKETING_CONTENT_PILLARS).toContain("QR_EXPERIENCE");
    expect(repurposeContentFormats("idea")).toHaveLength(8);
    expect(repurposeContentFormats(" ")).toEqual([]);
  });
});
