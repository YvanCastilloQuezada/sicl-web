import { describe, expect, it } from "vitest";
import { SURVIVAL_INVARIANTS, canPublish, coreIntegrityDominates, failSafeFor, redactPrivateReasoning } from "./milukitaConsolidation";

describe("Milukita consolidation", () => {
  it("defines all five survival invariants and protects core failure semantics", () => {
    expect(SURVIVAL_INVARIANTS).toHaveLength(5);
    expect(SURVIVAL_INVARIANTS.every((item) => item.verified)).toBe(true);
    expect(coreIntegrityDominates({ coreIntegrity: 0, business: 100, experience: 100, agents: 100 })).toBe("CRITICAL");
  });
  it("does not publish without explicit human approval", () => {
    expect(canPublish("IMPLEMENTED", false, false)).toBe(false);
    expect(canPublish("IMPLEMENTED", false, true)).toBe(true);
    expect(canPublish("PRODUCTION", true, true)).toBe(false);
  });
  it("uses fail-safe outcomes by subsystem", () => {
    expect(failSafeFor("FINANCIAL")).toBe("CONTINUE_CORE_AND_EXISTING_EXPERIENCE");
    expect(failSafeFor("CONTENT")).toBe("BLOCK_NEW_CONTENT_PUBLICATION");
    expect(failSafeFor("SUPERVISOR")).toBe("BLOCK_SENSITIVE_AUTONOMOUS_ACTIONS");
  });
  it("keeps an operational explanation bounded for auditability", () => {
    const chain = { recommendationId: "R-1", agentId: "financial-intelligence", timestamp: "2026-08-27T00:00:00Z", inputData: [], dataSources: [], sourceVersion: null, assumptions: [], modelVersion: null, reasoningSummary: "x".repeat(700), confidence: null, recommendation: "UNKNOWN", risk: null, requiredApproval: "HUMAN", finalDecision: null, decisionMaker: null, decisionTimestamp: null };
    expect(redactPrivateReasoning(chain).reasoningSummary).toHaveLength(500);
  });
});
