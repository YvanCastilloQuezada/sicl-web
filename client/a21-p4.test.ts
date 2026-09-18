import { describe, expect, it } from "vitest";
import { buildHouseA21Proof } from "./src/components/a21ArchitecturalProgram";
import { buildA21P3Graph } from "./src/components/a21CirculationIntent";
import { compareConfigurationWithExistingPlan, runA21P4Proof, synthesizeHouseA21Configuration, validateHouseA21Configuration } from "./src/components/a21SpatialConfiguration";
import { generateVerifiedResidentialPlan } from "./src/components/residentialConstructivePlan";

describe("A21-P4 controlled spatial configuration synthesis", () => {
  it("generates a deterministic, hypothesis-only HOUSE-A21 configuration", () => {
    const result = runA21P4Proof();
    expect(result.validation).toBe(true);
    expect(result.determinism).toBe(true);
    expect(result.configuration.configurationId).toBe("HOUSE-A21-CONFIG-A");
    expect(result.configuration.status).toBe("HYPOTHESIS");
    expect(result.configuration.placements).toHaveLength(10);
    expect(result.configuration.placements.every((item) => item.epistemicState === "HYPOTHESIS")).toBe(true);
  });

  it("preserves unknowns and never creates construction elements", () => {
    const result = runA21P4Proof();
    expect(result.configuration.preservedUnknowns.length).toBeGreaterThan(0);
    expect(result.configuration.constraintEvaluations.filter((item) => item.unknown).every((item) => item.state === "UNKNOWN")).toBe(true);
    expect(result.noConstructionGeneration).toBe(true);
    expect(result.configuration.noWalls).toBe(true);
    expect(result.configuration.noDoors).toBe(true);
    expect(result.configuration.noWindows).toBe(true);
    expect(result.configuration.noStairs).toBe(true);
  });

  it("passes anti-copy, ablation and conflict controls", () => {
    const result = runA21P4Proof();
    expect(result.antiCopy).toBe(true);
    expect(result.inputAblation).toBe(true);
    expect(result.conflictPreservation).toBe(true);
    expect(compareConfigurationWithExistingPlan(result.configuration, generateVerifiedResidentialPlan()).antiCopy).toBe("PASS");
  });

  it("consumes A21-P1/P2/P3 inputs without changing their epistemic model", () => {
    const proof = buildHouseA21Proof();
    const circulation = buildA21P3Graph();
    const configuration = synthesizeHouseA21Configuration(proof, circulation);
    expect(validateHouseA21Configuration(configuration)).toBe(true);
    expect(proof.geometryCreated).toBe(false);
    expect(circulation.noGeometryMutation).toBe(true);
    expect(circulation.noDecision).toBe(true);
    expect(circulation.warnings.some((warning) => warning.includes("Intent is not corridor geometry"))).toBe(true);
  });
});
