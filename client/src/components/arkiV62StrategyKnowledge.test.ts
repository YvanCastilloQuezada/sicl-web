import { describe, expect, it } from "vitest";
import { synthesizeV62Strategies } from "./arkiV62StrategyKnowledge";

describe("ARKI D6.2 generic strategy knowledge", () => {
  it("generates multiple distinct families from effects and conditions without typology dispatch", () => {
    const result = synthesizeV62Strategies({
      observedDeficit: "incompatible simultaneous interaction",
      cause: "incompatible simultaneous interaction",
      requiredEffect: "reduce incompatible interaction",
      conditionTags: ["interaction", "journey"],
      stateTags: ["mutable interface"],
      scenarioTags: ["simultaneous demand"],
      mutability: "MUTABLE",
      authority: "PROJECT_CONTROLLED",
      hardConstraints: [],
    });
    expect(result.applicableStrategies.length).toBeGreaterThan(1);
    expect(result.distinctFamilies.length).toBeGreaterThan(1);
    expect(result.provenance.join(" ")).toContain("No typology name used for dispatch");
    expect(result.applicableStrategies.every((strategy) => strategy.matchedEffects.length > 0)).toBe(true);
  });

  it("rejects temporal separation when simultaneous use is mandatory", () => {
    const result = synthesizeV62Strategies({
      observedDeficit: "incompatible simultaneous interaction",
      cause: "incompatible simultaneous interaction",
      requiredEffect: "reduce incompatible interaction",
      conditionTags: ["interaction"],
      stateTags: ["mandatory simultaneous"],
      scenarioTags: ["mandatory simultaneous"],
      mutability: "MUTABLE",
      authority: "PROJECT_CONTROLLED",
      hardConstraints: [],
    });
    const temporal = result.rejectedStrategies.find((strategy) => strategy.family === "TEMPORAL");
    expect(temporal?.reasons.join(" ")).toContain("temporal separation conflicts");
  });

  it("rejects a spatial strategy when authority and mutability cannot support it", () => {
    const result = synthesizeV62Strategies({
      observedDeficit: "incompatible interaction at external boundary",
      cause: "incompatible interaction",
      requiredEffect: "reduce incompatible interaction",
      conditionTags: ["external authority"],
      stateTags: ["immutable geometry"],
      scenarioTags: [],
      mutability: "IMMUTABLE",
      authority: "EXTERNAL_AUTHORITY",
      hardConstraints: ["external geometry cannot be mutated"],
    });
    const spatial = result.rejectedStrategies.find((strategy) => strategy.family === "SPATIAL");
    expect(spatial?.reasons.length).toBeGreaterThan(0);
    expect(result.applicableStrategies.some((strategy) => strategy.family === "SPATIAL")).toBe(false);
  });
});
