import { describe, expect, it } from "vitest";
import { attemptD62StrategySynthesis, D62_PROBLEM_FIXTURE } from "./arkiD62StrategySynthesisAttempt";

describe("ARKI D6.2 general strategy synthesis gate", () => {
  it("attempts with zero supplied strategies and blocks truthfully", () => {
    const result = attemptD62StrategySynthesis(D62_PROBLEM_FIXTURE);
    expect(result.providedStrategies).toHaveLength(0);
    expect(result.retrievedStrategies).toHaveLength(0);
    expect(result.generatedStrategies).toHaveLength(0);
    expect(result.gate).toBe("BLOCKED");
    expect(result.l5).toBe("NOT_DEMONSTRATED");
    expect(result.capabilityGap?.minimumGeneralCapability).toContain("generic strategy knowledge");
  });

  it("does not dispatch by typology or add a repair engine", () => {
    const result = attemptD62StrategySynthesis("hospital, restaurant, laboratory and public realm labels are intentionally absent");
    expect(result.rejectedStrategies[0].reason).toContain("anti-hardcoding");
    expect(result.discovery.disposition).toBe("EXTEND");
    expect(result.discovery.affectedFiles).not.toContain("RestaurantRepairEngine");
  });
});
