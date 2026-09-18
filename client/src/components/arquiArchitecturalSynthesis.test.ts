import { describe, expect, it } from "vitest";
import { deriveArchitecturalProblem } from "./arquiDesignProblem";
import { combineStrategies, deriveDesignDrivers, modifyStrategy, synthesizeArchitecturalStrategies } from "./arquiArchitecturalSynthesis";

const problem = deriveArchitecturalProblem({ project_id: "UPAO-001", name: "Educational example", spatial_scope: "edificacion", objectives: { open_site_area: "maximize open space" }, constraints: { privacy: "preserve privacy" }, preferences: { compactness: "compact footprint" }, program: [{ id: "p1", label: "learning spaces" }], site: { context: "urban edge" } } as any, [], []);

describe("A12 architectural synthesis", () => {
  it("derives traceable drivers and multiple coherent strategies", () => {
    const result = synthesizeArchitecturalStrategies(problem);
    expect(result.strategies).toHaveLength(3);
    expect(result.drivers.length).toBeGreaterThan(0);
    expect(result.strategies.every((strategy) => strategy.epistemicClass === "HYPOTHESIS")).toBe(true);
    expect(result.noWinner).toBe(true);
    expect(result.noGeometryMutation).toBe(true);
  });
  it("keeps parti and trade-offs attached to each strategy", () => {
    const result = synthesizeArchitecturalStrategies(problem);
    expect(result.strategies.every((strategy) => strategy.parti.provenance.length > 0)).toBe(true);
    expect(result.strategies.every((strategy) => strategy.expectedTradeoffs.length > 0)).toBe(true);
  });
  it("supports human-directed modification and combination without autonomous selection", () => {
    const result = synthesizeArchitecturalStrategies(problem);
    const revised = modifyStrategy(result.strategies[0], "prioritize shaded shared space");
    const hybrid = combineStrategies(result.strategies[0], result.strategies[1]);
    expect(revised.id).toContain("revised");
    expect(revised.parti.provenance).toContain("human.modification");
    expect(hybrid.name).toContain("Hybrid");
    expect(hybrid.parti.provenance).toContain("human.combination");
  });
});

describe("A12 driver extraction", () => {
  it("does not invent drivers when the problem is empty", () => {
    const empty = deriveArchitecturalProblem({ project_id: "P-EMPTY", spatial_scope: "edificacion" } as any, [], []);
    expect(deriveDesignDrivers(empty)).toEqual([]);
  });
});
