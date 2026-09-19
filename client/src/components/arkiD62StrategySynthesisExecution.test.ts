import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";

describe("ARKI D6.2 strategy synthesis execution", () => {
  it("passes the general strategy gate with zero supplied strategies", () => {
    const result = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    expect(result.strategiesProvided).toBe(0);
    expect(result.strategiesRetrieved).toBeGreaterThan(1);
    expect(result.strategiesGenerated).toBeGreaterThan(1);
    expect(result.synthesis.distinctFamilies.length).toBeGreaterThan(1);
    expect(result.gate).toBe("PASS");
    expect(result.l5).toBe("DEMONSTRATED");
    expect(Object.values(result.checks).every((value) => value === "PASS")).toBe(true);
  });

  it("retains unknown effects rather than promoting predicted effects to facts", () => {
    const result = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    expect(result.remainingUnknowns.length).toBeGreaterThan(0);
    expect(result.synthesis.applicableStrategies.every((strategy) => strategy.unknownEffects.length > 0)).toBe(true);
  });
});
