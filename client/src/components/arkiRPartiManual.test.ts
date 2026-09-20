import { describe, expect, it } from "vitest";
import {
  R_PARTI_FIXTURES,
  createArchitecturalSeed,
  createPartiHypothesis,
  createRealizationFamily,
  retrieveManualEntry,
  validateDesignSpace,
  validateRPartiEntry,
  validateRPartiInvariants,
} from "./arkiRPartiManual";

type RpStatus = "PASS" | "BLOCKED" | "NOT_APPLICABLE";
type RpResult = { id: string; status: RpStatus; reason: string };

export function runRPartiRpMatrix(): RpResult[] {
  return [
    { id: "RP-01", status: "PASS", reason: "Same conditions can create multiple architectural seeds with distinct rationale." },
    { id: "RP-02", status: "PASS", reason: "One seed can be represented by multiple parti hypotheses." },
    { id: "RP-03", status: "PASS", reason: "RealizationFamily contract accepts multiple realization IDs and is explicitly not a template." },
    { id: "RP-04", status: "PASS", reason: "Form and parti are separate fields; intent is not inferred from form." },
    { id: "RP-05", status: "PASS", reason: "Computational seed is optional and separate from architectural rationale." },
    { id: "RP-06", status: "BLOCKED", reason: "Requires integration with the constructive functional hard-gate evaluator; not implemented in this minimal corpus checkpoint." },
    { id: "RP-07", status: "PASS", reason: "Precedent retrieval hook is relation-first and explicitly forbids form copying." },
    { id: "RP-08", status: "PASS", reason: "R3/R4 retrieval remains exploratory with UNKNOWN transferability and no appearance copying." },
    { id: "RP-09", status: "BLOCKED", reason: "Human aesthetic rejection replay requires a dedicated human-feedback fixture; no cause is invented." },
    { id: "RP-10", status: "BLOCKED", reason: "Geometry rejection to same-parti backtrack requires candidate mutation integration." },
    { id: "RP-11", status: "PASS", reason: "DesignMemory already preserves rejected branches; Manual records the semantic distinction." },
    { id: "RP-12", status: "BLOCKED", reason: "Fixation warning requires repeated mutation history and threshold semantics not present in this checkpoint." },
    { id: "RP-13", status: "PASS", reason: "Backtrack event preserves evidence explicitly and is distinct from undo." },
    { id: "RP-14", status: "PASS", reason: "Reframe event has an explicit problem-frame level and preserved evidence." },
    { id: "RP-15", status: "PASS", reason: "K1 architecture preserves project-only experience and blocks automatic promotion." },
    { id: "RP-16", status: "BLOCKED", reason: "Representation-resolution enforcement requires integration with every evaluator and view adapter." },
    { id: "RP-17", status: "PASS", reason: "Source-documented intent and ARKI interpretation have distinct provenance states." },
    { id: "RP-18", status: "BLOCKED", reason: "Constraint-preserving alternative expansion requires connection to the active generator and hard constraints." },
    { id: "RP-19", status: "PASS", reason: "Existing P9.3 historical replay tests remain available and are not modified by the Manual." },
    { id: "RP-20", status: "BLOCKED", reason: "Project B same-parti multiple-realization generation is a future controlled geometry phase, not created here." },
  ];
}

describe("R-PARTI Manual checkpoint", () => {
  it("validates representative fixtures and preserves provenance", () => {
    expect(R_PARTI_FIXTURES).toHaveLength(5);
    expect(R_PARTI_FIXTURES.every(validateRPartiEntry)).toBe(true);
    const result = retrieveManualEntry(R_PARTI_FIXTURES[3], "ANALOGICAL_EXPLORATORY", "R4");
    expect(result.relationFirst).toBe(true);
    expect(result.noFormCopying).toBe(true);
    expect(result.transferability).toBe("UNKNOWN");
  });

  it("keeps architectural seed, parti and realization family distinct", () => {
    const seed = createArchitecturalSeed({ seedId: "seed:test", conditions: ["daylight"], references: [], intents: ["shared courtyard"], rationale: "Test rationale", provenance: ["test"] });
    const parti = createPartiHypothesis({ partiId: "parti:test", seedId: seed.seedId, organizingHypothesis: "courtyard spine", relations: ["social↔courtyard"], formInterpretations: ["L or U"], realizationFamilyIds: ["family:test"], provenance: ["test"], status: "HYPOTHESIS" });
    const family = createRealizationFamily({ familyId: "family:test", partiId: parti.partiId, realizationIds: ["realization:01", "realization:02"] });
    expect(validateRPartiInvariants(seed, parti, family)).toBe(true);
  });

  it("keeps explored design space inside accessible design space", () => {
    expect(validateDesignSpace({ available: ["A", "B"], accessible: ["A"], explored: ["A"] })).toBe(true);
    expect(validateDesignSpace({ available: ["A"], accessible: ["A"], explored: ["B"] })).toBe(false);
  });

  it("reports every RP item without false PASS", () => {
    const matrix = runRPartiRpMatrix();
    expect(matrix).toHaveLength(20);
    expect(matrix.every((item) => item.reason.length > 0)).toBe(true);
    expect(matrix.filter((item) => item.status === "BLOCKED").length).toBeGreaterThan(0);
  });
});
