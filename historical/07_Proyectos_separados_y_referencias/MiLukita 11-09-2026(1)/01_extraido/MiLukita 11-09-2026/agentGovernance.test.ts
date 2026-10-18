import { describe, expect, it } from "vitest";
import { buildAgentScorecard, getSystemStatus } from "./agentGovernance";

describe("agent governance", () => {
  it("keeps critical Level 0 failures dominant", () => {
    expect(getSystemStatus({ level0CriticalFailure: true, level1Degraded: false, nonCriticalWarning: false })).toBe("CRITICAL");
  });

  it("does not use an average to hide integrity failure", () => {
    const scorecard = buildAgentScorecard({ agentId: "financial-intelligence", health: 95, quality: 95, impact: 95, governance: 100, cost: 90, metricTypes: { health: "SIMULATED", quality: "SIMULATED", impact: "SIMULATED", governance: "FACT", cost: "ESTIMATE" }, level0CriticalFailure: true, level1Degraded: false, nonCriticalWarning: false });
    expect(scorecard.status).toBe("CRITICAL");
  });
});
