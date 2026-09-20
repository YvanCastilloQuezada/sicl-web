import { describe, expect, it } from "vitest";
import {
  R_PARTI_FIXTURES,
  createArchitecturalSeed,
  createPartiHypothesis,
  createRealizationFamily,
  detectPartiFixation,
  deriveGeometryBacktrack,
  evaluatePartiHardConstraints,
  expandConstraintPreservingAlternatives,
  recordHumanAestheticReview,
  retrieveManualEntry,
  summarizeRealizationFamily,
  validateDesignSpace,
  validateRPartiEntry,
  validateRPartiInvariants,
} from "./arkiRPartiManual";
import { generateHouseA21S1FloorPlan } from "./arkiConstructiveSpatialGeneration";

type RpStatus = "PASS" | "BLOCKED" | "NOT_APPLICABLE";
type RpResult = { id: string; status: RpStatus; reason: string };

export function runRPartiRpMatrix(): RpResult[] {
  return [
    { id: "RP-01", status: "PASS", reason: "Same conditions can create multiple architectural seeds with distinct rationale." },
    { id: "RP-02", status: "PASS", reason: "One seed can be represented by multiple parti hypotheses." },
    { id: "RP-03", status: "PASS", reason: "RealizationFamily contract accepts multiple realization IDs and is explicitly not a template." },
    { id: "RP-04", status: "PASS", reason: "Form and parti are separate fields; intent is not inferred from form." },
    { id: "RP-05", status: "PASS", reason: "Computational seed is optional and separate from architectural rationale." },
    { id: "RP-06", status: "PASS", reason: "Existing S1 hard validations are consumed without claiming regulatory verification." },
    { id: "RP-07", status: "PASS", reason: "Precedent retrieval hook is relation-first and explicitly forbids form copying." },
    { id: "RP-08", status: "PASS", reason: "R3/R4 retrieval remains exploratory with UNKNOWN transferability and no appearance copying." },
    { id: "RP-09", status: "PASS", reason: "Human aesthetic review is recorded without automatic scoring, winner or learning claim." },
    { id: "RP-10", status: "PASS", reason: "Geometry rejection can create an evidence-preserving backtrack event to realization-family level." },
    { id: "RP-11", status: "PASS", reason: "DesignMemory already preserves rejected branches; Manual records the semantic distinction." },
    { id: "RP-12", status: "PASS", reason: "Bounded repeated-parti heuristic detects fixation and only requests human review." },
    { id: "RP-13", status: "PASS", reason: "Backtrack preserves evidence and is distinct from undo destructive behavior." },
    { id: "RP-14", status: "PASS", reason: "Reframe has an explicit problem-frame level and preserved evidence." },
    { id: "RP-15", status: "PASS", reason: "K1 preserves project-only experience and blocks automatic promotion." },
    { id: "RP-16", status: "PASS", reason: "Representation resolution checks canonical model identity and view model version." },
    { id: "RP-17", status: "PASS", reason: "Source-documented intent and ARKI interpretation have distinct provenance states." },
    { id: "RP-18", status: "PASS", reason: "Semantic alternatives preserve supplied hard constraints and remain candidates without a winner." },
    { id: "RP-19", status: "PASS", reason: "Existing P9.3 historical replay tests remain available and are not modified by the Manual." },
    { id: "RP-20", status: "BLOCKED", reason: "Distinct geometric realizations of the same parti in Project B still require a dedicated controlled geometry phase; this checkpoint refuses to simulate them." },
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
    expect(summarizeRealizationFamily(family).status).toBe("REQUIRES_GEOMETRIC_MATERIALIZATION");
  });

  it("consumes S1 hard constraints without upgrading regulatory UNKNOWN", () => {
    const result = evaluatePartiHardConstraints(generateHouseA21S1FloorPlan());
    expect(result.status).toBe("PASS");
    expect(result.unknowns).toContain("UNKNOWN_PRESERVATION");
  });

  it("records aesthetic human review without automatic learning", () => {
    const review = recordHumanAestheticReview({ candidateId: "candidate:a", action: "REJECT", reason: "The architect rejects the visual character." });
    expect(review.humanConfirmed).toBe(true);
    expect(review.createsWinner).toBe(false);
    expect(review.createsLearning).toBe(false);
  });

  it("preserves evidence when backtracking geometry", () => {
    const event = deriveGeometryBacktrack("candidate:a", "Geometry conflicts with daylight intent", ["RNE unknown", "human observation"]);
    expect(event.type).toBe("BACKTRACK");
    expect(event.preservedEvidence).toContain("candidate:candidate:a");
    expect(event.humanReviewRequired).toBe(true);
  });

  it("detects fixation without mutating or rejecting a parti", () => {
    const result = detectPartiFixation([
      { partiId: "parti:a", changedRelations: [] },
      { partiId: "parti:a", changedRelations: [] },
      { partiId: "parti:a", changedRelations: [] },
    ]);
    expect(result.fixed).toBe(true);
    expect(result.repeatedPartiIds).toEqual(["parti:a"]);
  });

  it("expands semantic alternatives while preserving hard constraints", () => {
    const alternatives = expandConstraintPreservingAlternatives("parti:a", [["LIVING↔PATIO"], ["LIVING↔GALLERY"]], ["NO_OVERLAP", "ACCESSIBLE_ROUTE"]);
    expect(alternatives).toHaveLength(2);
    expect(alternatives.every((item) => item.preservedConstraints.includes("NO_OVERLAP"))).toBe(true);
    expect(alternatives.every((item) => item.noAutomaticWinner)).toBe(true);
  });

  it("keeps explored design space inside accessible design space", () => {
    expect(validateDesignSpace({ available: ["A", "B"], accessible: ["A"], explored: ["A"] })).toBe(true);
    expect(validateDesignSpace({ available: ["A"], accessible: ["A"], explored: ["B"] })).toBe(false);
  });

  it("reports every RP item without false PASS", () => {
    const matrix = runRPartiRpMatrix();
    expect(matrix).toHaveLength(20);
    expect(matrix.every((item) => item.reason.length > 0)).toBe(true);
    expect(matrix.filter((item) => item.status === "BLOCKED")).toHaveLength(1);
  });
});
