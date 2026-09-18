import { describe, expect, it } from "vitest";
import { buildGDIContinuum } from "./src/components/arkiGenerativeDesignContinuum";
import { buildCapabilitySetV1, validateCapabilitySetV1 } from "./src/components/arkiCapabilitySetV1";
import { getModeProfile, modeView } from "./src/components/arkiDesignModes";

describe("ARKI Design Genius bounded proof", () => {
  it("runs a fresh non-HOUSE-A21 project through the shared GDI engine", () => {
    const continuum = buildGDIContinuum("ARKI-DESIGN-GENIUS-E2E-001");
    expect(continuum.alternatives).toHaveLength(3);
    expect(continuum.alternatives.every((item) => item.id.startsWith("ARKI-DESIGN-GENIUS-E2E-001"))).toBe(true);
    expect(continuum.alternatives.every((item) => item.state === "HYPOTHESIS")).toBe(true);
    expect(continuum.controls.noAutomaticWinner).toBe(true);
    expect(continuum.controls.noAutomaticDecision).toBe(true);
    expect(continuum.alternatives.every((item) => item.humanSelectionRequired)).toBe(true);
  });

  it("keeps one engine while making four modes meaningfully different", () => {
    const continuum = buildGDIContinuum("ARKI-DESIGN-GENIUS-E2E-001");
    const modes = (["JUNIOR", "ARCHITECT", "MASTER", "CRAZY"] as const).map((mode) => modeView(continuum, mode));
    expect(modes.map((item) => item.mode)).toEqual(["JUNIOR", "ARCHITECT", "MASTER", "CRAZY"]);
    expect(modes.map((item) => item.profile.reasoningDepth)).toEqual([1, 2, 4, 5]);
    expect(modes.map((item) => item.profile.noveltyTolerance)).toEqual(["LOW", "BALANCED", "HIGH", "RADICAL_BOUNDED"]);
    expect(modes.every((item) => item.humanSelectionRequired && item.noTruthMutation && item.hardConstraintsPreserved)).toBe(true);
    expect(getModeProfile("CRAZY").mutationAmplitude).toBe("RADICAL_BOUNDED");
  });

  it("validates the unified capability set without creating a second canonical model", () => {
    const set = buildCapabilitySetV1();
    expect(validateCapabilitySetV1(set)).toBe(true);
    expect(set.modes).toHaveLength(4);
    expect(set.unifiedDesignState.controls.singleCanonicalModel).toBe(true);
    expect(set.unifiedDesignState.controls.singleDesignOperationSystem).toBe(true);
    expect(set.unifiedDesignState.controls.noAutomaticWinner).toBe(true);
  });
});
