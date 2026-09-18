import { describe, expect, it } from "vitest";
import { buildGDIProof, buildGDIContinuum, compareDesigns, humanAuthorizeMutation, identifyExplorationGaps, searchByExample, validateGDIContinuum } from "./src/components/arkiGenerativeDesignContinuum";

describe("ARKI GDI-P9 → GDI-P24 continuum", () => {
  it("composes exactly sixteen phases over existing GDI", () => {
    const result = buildGDIContinuum();
    expect(result.phases).toHaveLength(16);
    expect(result.phases[0].id).toBe("GDI-P9");
    expect(result.phases.at(-1)?.id).toBe("GDI-P24");
    expect(result.phases.every((phase) => phase.humanAuthority === "PRESERVED")).toBe(true);
  });
  it("creates three hypotheses with immutable branch identity and provenance", () => {
    const result = buildGDIProof();
    expect(result.valid).toBe(true);
    expect(result.continuum.alternatives).toHaveLength(3);
    expect(result.continuum.alternatives.every((item) => item.state === "HYPOTHESIS")).toBe(true);
    expect(result.continuum.branches).toEqual(["branch-main", "branch-compact", "branch-courtyard", "branch-separated"]);
  });
  it("keeps distance descriptive and does not turn it into ranking", () => {
    const result = buildGDIContinuum();
    expect(result.comparisons).toHaveLength(3);
    expect(result.comparisons.every((item) => item.distance.interpretation.includes("not quality"))).toBe(true);
    expect(result.controls.noAutomaticRanking).toBe(true);
    expect(result.controls.noAutomaticWinner).toBe(true);
  });
  it("supports example retrieval and explicit unexplored-space gaps", () => {
    const result = buildGDIContinuum();
    expect(searchByExample(result, { compositionFamily: "COURTYARD_SOCIAL" })).toHaveLength(1);
    expect(identifyExplorationGaps(result).some((item) => item.includes("geometry-level similarity"))).toBe(true);
  });
  it("preserves unresolved engineering and performance questions in challenge mode", () => {
    const result = buildGDIProof();
    expect(result.continuum.challenges).toHaveLength(3);
    expect(result.continuum.challenges.every((item) => item.perspectives.includes("ENGINEERING") && item.noDecision)).toBe(true);
    expect(result.gaps.some((item) => item.includes("engineering coordination"))).toBe(true);
  });
  it("requires explicit human authorization before a mutation can proceed", () => {
    const result = buildGDIContinuum();
    expect(() => humanAuthorizeMutation(result, "missing", "move core")).toThrow();
    const authorization = humanAuthorizeMutation(result, result.alternatives[0].id, "Human Architect requests a bounded revision");
    expect(authorization.authorized).toBe(true);
    expect(authorization.mutation).toBe("PENDING_GEOMETRIC_OPERATION");
    expect(authorization.freshReadbackRequired).toBe(true);
  });
  it("is deterministic and keeps geometric distance explicitly unavailable", () => {
    const first = buildGDIProof();
    const second = buildGDIProof();
    expect(first.stableFingerprint).toBe(second.stableFingerprint);
    expect(compareDesigns(first.continuum.alternatives[0], first.continuum.alternatives[1]).geometryDistance).toBe("NOT_COMPUTED");
    expect(validateGDIContinuum(first.continuum)).toBe(true);
  });
});
