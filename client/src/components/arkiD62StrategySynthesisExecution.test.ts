import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";

describe("ARKI D6.2 strategy synthesis execution", () => {
  it("passes the general strategy gate with zero supplied strategies", () => {
    const result = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    expect(result.strategiesProvided).toBe(0);
    expect(result.strategiesRetrieved).toBeGreaterThan(1);
    expect(result.strategiesGenerated).toBeGreaterThan(1);
    expect(result.contextualStrategiesGenerated).toBe(result.strategiesGenerated);
    expect(result.synthesis.distinctFamilies.length).toBeGreaterThan(1);
    expect(result.gate).toBe("PASS");
    expect(result.l5).toBe("DEMONSTRATED");
    expect(Object.values(result.checks).every((value) => value === "PASS")).toBe(true);
  });

  it("keeps contextual strategies as hypotheses with complete provenance", () => {
    const result = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    expect(result.synthesis.contextualStrategies.every((strategy) => strategy.epistemicStatus === "HYPOTHESIS")).toBe(true);
    expect(result.synthesis.contextualStrategies.every((strategy) => strategy.sourceKnowledge.length > 0 && strategy.applicabilityEvidence.length > 0)).toBe(true);
    expect(result.synthesis.contextualStrategies.every((strategy) => strategy.unknowns.length > 0)).toBe(true);
  });

  it("does not change strategy families when only an irrelevant typology label changes", () => {
    const base = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const labeled = executeD62GeneralStrategyGate({ ...D62_GENERIC_FIXTURE, conditionTags: [...D62_GENERIC_FIXTURE.conditionTags, "label: hospital"] });
    expect(labeled.synthesis.distinctFamilies).toEqual(base.synthesis.distinctFamilies);
    expect(labeled.strategiesGenerated).toBe(base.strategiesGenerated);
  });

  it("retains unknown effects rather than promoting predicted effects to facts", () => {
    const result = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    expect(result.remainingUnknowns.length).toBeGreaterThan(0);
    expect(result.synthesis.applicableStrategies.every((strategy) => strategy.unknownEffects.length > 0)).toBe(true);
  });
});
