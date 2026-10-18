import { describe, expect, it } from "vitest";
import { buildFinancialAlerts, calculateFinancialMetrics, createFinancialProposal, JURISDICTION_COMPARISON } from "./financialIntelligence";

describe("Financial Intelligence", () => {
  it("does not interpret virtual credits as accounting revenue", () => {
    const input = { users: 0, viewers: 0, events: 0, qrScans: 0, conversionRate: 0, advertisingRevenue: 0, sponsorshipRevenue: 0, distributionRevenue: 0, infrastructureCost: 0, aiCost: 0, supportCost: 0, cac: 0, retentionRate: 0, classification: "UNAVAILABLE" as const };
    const metrics = calculateFinancialMetrics(input);
    expect(metrics.classification).toBe("UNAVAILABLE");
    expect(metrics.revenuePerUser).toBeNull();
    expect(buildFinancialAlerts(input, metrics).some((alert) => alert.code === "DATA_UNAVAILABLE")).toBe(true);
  });
  it("requires human approval for proposals and leaves jurisdictions unassessed", () => {
    expect(createFinancialProposal("Test", "Evidence", "Impact").executeAllowed).toBe(false);
    expect(JURISDICTION_COMPARISON.every((item) => item.recommendation === "NONE")).toBe(true);
  });
});
