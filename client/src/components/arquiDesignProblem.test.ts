import { describe, expect, it } from "vitest";
import { answerDesignProblemQuestion, deriveArchitecturalProblem } from "./arquiDesignProblem";

describe("A11 architectural design problem", () => {
  it("composes project state without creating a second source of truth", () => {
    const problem = deriveArchitecturalProblem({
      project_id: "UPAO-001", name: "Educational housing example", spatial_scope: "edificacion",
      objectives: { open_site: "maximize open space" }, constraints: { footprint: "preserve compact footprint" },
      preferences: { privacy: "prioritize privacy" }, program: [{ id: "P1", label: "housing" }],
    }, [{ evidence_id: "E1", statement: "west exposure", evidence_type: "OBSERVATION", state: "OBSERVED" }], []);
    expect(problem.project[0].text).toContain("Educational housing");
    expect(problem.objectives.length).toBeGreaterThan(0);
    expect(problem.constraints.length).toBeGreaterThan(0);
    expect(problem.preferences.length).toBeGreaterThan(0);
    expect(problem.noDecision).toBe(true);
    expect(problem.noGeneration).toBe(true);
  });

  it("preserves unknown and AI-proposed information without upgrading it", () => {
    const problem = deriveArchitecturalProblem({ project_id: "P", name: "P", spatial_scope: "espacio" }, [
      { evidence_id: "E-AI", statement: "possible access issue", evidence_type: "PHOTO", state: "AI_PROPOSED" },
      { evidence_id: "E-U", statement: "program area not supplied", evidence_type: "OBSERVATION", state: "UNKNOWN" },
    ], []);
    expect(problem.unknown).toHaveLength(2);
    expect(problem.unknown.every((item) => item.classification === "UNKNOWN")).toBe(true);
    expect(problem.readiness).toBe("PARTIAL");
  });

  it("derives an unresolved tension and a question, never a solution", () => {
    const problem = deriveArchitecturalProblem({ project_id: "P", name: "P", spatial_scope: "edificacion", objectives: { open: "maximize open space" }, preferences: { compact: "compact footprint" } }, [], []);
    expect(problem.tensions).toHaveLength(1);
    expect(problem.tensions[0].unresolved).toBe(true);
    expect(problem.designQuestions[0].solution).toBe(false);
    expect(problem.intent?.classification).toBe("DERIVED_INTERPRETATION");
    expect(problem.intent?.humanConfirmation).toBe("REQUIRED");
  });

  it("answers bounded problem questions from the derived model", () => {
    const problem = deriveArchitecturalProblem({ project_id: "P", name: "P", spatial_scope: "parcela_sitio" }, [], []);
    expect(answerDesignProblemQuestion("What are we designing?", problem).answerKey).toBe("arqui.problem_answer_designing");
    expect(answerDesignProblemQuestion("What don't we know?", problem).answerKey).toBe("arqui.problem_answer_unknown");
    expect(answerDesignProblemQuestion("What conflicts do you see?", problem).answerKey).toBe("arqui.problem_answer_tensions");
  });
});
