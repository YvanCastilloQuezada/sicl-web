import { describe, expect, it } from "vitest";
import { createDemoCandidates, createDesignFunnel, completeDeepEvaluation, promoteToFinalFour, selectForDevelopment, returnToFinalFour, setComparisonMode } from "../shared/arkiDesignFunnel";

const makeState = () => createDesignFunnel({ projectId: "P-001", candidates: createDemoCandidates("P-001"), timestamp: "2026-01-01T00:00:00.000Z" });

describe("ARKI F5 epistemic separation", () => {
  it("keeps facts, assumptions, preferences, requirements, objectives and constraints structurally distinct", () => {
    const candidate = createDemoCandidates("P-EPI")[0];

    expect(candidate.epistemic.facts[0].id).toMatch(/^FACT-/);
    expect(candidate.epistemic.assumptions[0].id).toMatch(/^ASSUMPTION-/);
    expect(candidate.epistemic.preferences[0].id).toMatch(/^PREFERENCE-/);
    expect(candidate.epistemic.requirements[0].id).toMatch(/^REQUIREMENT-/);
    expect(candidate.epistemic.objectives[0].id).toMatch(/^OBJECTIVE-/);
    expect(candidate.epistemic.constraints[0].id).toMatch(/^CONSTRAINT-/);

    expect(candidate.epistemic.preferences).not.toBe(candidate.epistemic.objectives);
    expect(candidate.epistemic.assumptions).not.toBe(candidate.epistemic.facts);
  });

  it("does not convert an assumption into a fact when the candidate enters the funnel", () => {
    const candidates = createDemoCandidates("P-EPI");
    const assumption = candidates[0].epistemic.assumptions[0];
    const state = createDesignFunnel({ projectId: "P-EPI", candidates });

    expect(state.candidates[0].epistemic.assumptions).toContainEqual(assumption);
    expect(state.candidates[0].epistemic.facts).not.toContainEqual(assumption);
  });

  it("preserves preferences separately from objectives through human promotion", () => {
    const state = createDesignFunnel({ projectId: "P-EPI", candidates: createDemoCandidates("P-EPI") });
    const preference = state.candidates[0].epistemic.preferences[0];
    const objective = state.candidates[0].epistemic.objectives[0];

    const promoted = promoteToFinalFour(state, ["A01", "A02", "A03", "A04"], "Yvan");
    const candidate = promoted.candidates.find((item) => item.id === "A01")!;

    expect(candidate.epistemic.preferences).toContainEqual(preference);
    expect(candidate.epistemic.objectives).toContainEqual(objective);
    expect(candidate.epistemic.objectives).not.toContainEqual(preference);
  });

  it("keeps UNKNOWN outside facts and numeric metrics", () => {
    const candidate = createDemoCandidates("P-EPI")[0];

    expect(candidate.unknowns.length).toBeGreaterThan(0);
    for (const unknown of candidate.unknowns) {
      expect(candidate.epistemic.facts.some((item) => item.statement === unknown)).toBe(false);
      expect(Object.values(candidate.metrics)).not.toContain(unknown);
    }
  });
});
describe("ARKI F5 Requirement-Constraint semantic boundary", () => {
  it("does not silently treat a Requirement as a Constraint through the funnel", () => {
    const candidates = createDemoCandidates("P-EPI-REQ-CONSTRAINT");
    const requirement = candidates[0].epistemic.requirements[0];

    expect(requirement).toBeDefined();
    expect(candidates[0].epistemic.constraints).not.toContain(requirement);

    const state = createDesignFunnel({
      projectId: "P-EPI-REQ-CONSTRAINT",
      candidates,
    });

    const preserved = state.candidates.find(
      (candidate) => candidate.id === candidates[0].id
    );

    expect(preserved).toBeDefined();
    expect(preserved!.epistemic.requirements).toContain(requirement);
    expect(preserved!.epistemic.constraints).not.toContain(requirement);
  });
});
describe("ARKI F5 C2 cross-category rejection", () => {
  it("rejects a Preference injected into Objectives", () => {
    const candidates = createDemoCandidates("P-EPI-C2");

    const preference =
      candidates[0].epistemic.preferences[0];

    (candidates[0].epistemic.objectives as unknown as Array<typeof preference>).push(
      preference
    );

    expect(() =>
      createDesignFunnel({
        projectId: "P-EPI-C2",
        candidates,
      })
    ).toThrow(
      "INVALID_CANDIDATE_EPISTEMIC_KIND:objectives:OBJECTIVE:PREFERENCE"
    );
  });
});
describe("ARKI F5 epistemic runtime boundary", () => {
  it("rejects a candidate with the epistemic model removed at runtime", () => {
    const candidates = createDemoCandidates("P-EPI-RUNTIME");
    const forged = { ...candidates[0] } as any;
    delete forged.epistemic;

    expect(() =>
      createDesignFunnel({
        projectId: "P-EPI-RUNTIME",
        candidates: [forged, ...candidates.slice(1)],
      })
    ).toThrow("INVALID_CANDIDATE_EPISTEMIC_MODEL");
  });

  it("rejects a candidate with a missing epistemic category at runtime", () => {
    const candidates = createDemoCandidates("P-EPI-RUNTIME");
    const forged = {
      ...candidates[0],
      epistemic: { ...candidates[0].epistemic },
    } as any;

    delete forged.epistemic.preferences;

    expect(() =>
      createDesignFunnel({
        projectId: "P-EPI-RUNTIME",
        candidates: [forged, ...candidates.slice(1)],
      })
    ).toThrow("INVALID_CANDIDATE_EPISTEMIC_CATEGORY:preferences");
  });

  it("rejects malformed epistemic evidence instead of silently accepting it", () => {
    const candidates = createDemoCandidates("P-EPI-RUNTIME");
    const forged = {
      ...candidates[0],
      epistemic: {
        ...candidates[0].epistemic,
        objectives: [
          {
            ...candidates[0].epistemic.objectives[0],
            evidenceRefs: [42],
          },
        ],
      },
    } as any;

    expect(() =>
      createDesignFunnel({
        projectId: "P-EPI-RUNTIME",
        candidates: [forged, ...candidates.slice(1)],
      })
    ).toThrow("INVALID_CANDIDATE_EPISTEMIC_ITEM:objectives");
  });
});
describe("ARKI Design Funnel S1", () => {
  it("creates the canonical 16-candidate waiting state", () => {
    const state = makeState();
    expect(state.candidates).toHaveLength(16);
    expect(state.waitState).toBe("AWAITING_16_TO_4_SELECTION");
  });
  it("requires exactly four human-selected candidates", () => {
    expect(() => promoteToFinalFour(makeState(), ["A01", "A02", "A03"], "Yvan")).toThrow("SELECTION_REQUIRES_4");
    expect(() => promoteToFinalFour(makeState(), ["A01", "A01", "A02", "A03"], "Yvan")).toThrow("DUPLICATE_CANDIDATE_SELECTION");
  });
  it("promotes four and preserves the other twelve", () => {
    const state = promoteToFinalFour(makeState(), ["A01", "A07", "A11", "A14"], "Yvan", "Comparación de patios y circulación");
    expect(state.stage).toBe("FINALIST_4");
    expect(state.candidates.filter((candidate) => candidate.stage === "FINALIST_4")).toHaveLength(4);
    expect(state.candidates.filter((candidate) => candidate.stage === "ARCHIVED")).toHaveLength(12);
    expect(state.events[0].type).toBe("HUMAN_DESIGN_SELECTION");
  });
  it("rejects cross-project and stale selections", () => {
    const state = makeState();
    const foreign = { ...state.candidates[0], projectId: "OTHER" };
    expect(() => promoteToFinalFour({ ...state, candidates: [foreign, ...state.candidates.slice(1)] }, ["A01", "A02", "A03", "A04"], "Yvan")).toThrow("CROSS_PROJECT_SELECTION");
    const finalists = promoteToFinalFour(state, ["A01", "A02", "A03", "A04"], "Yvan");
    expect(() => promoteToFinalFour(finalists, ["A01", "A02", "A03", "A04"], "Yvan")).toThrow("INVALID_16_TO_4_STAGE");
  });
  it("requires deeper evaluation before the 4-to-1 decision", () => {
    const finalists = promoteToFinalFour(makeState(), ["A01", "A02", "A03", "A04"], "Yvan");
    expect(() => selectForDevelopment(finalists, "A01", "Yvan")).toThrow("INVALID_4_TO_1_STAGE");
    const evaluated = completeDeepEvaluation(finalists, { A01: { status: "READY", findings: ["Buena circulación"] }, A02: { status: "READY" }, A03: { status: "READY" }, A04: { status: "BLOCKED", findings: ["Solver estructural no disponible"] } });
    expect(evaluated.waitState).toBe("AWAITING_4_TO_1_SELECTION");
    expect(evaluated.candidates.find((candidate) => candidate.id === "A04")?.stage).toBe("BLOCKED");
  });
  it("selects one without automatic winner and preserves three finalists", () => {
    const evaluated = completeDeepEvaluation(promoteToFinalFour(makeState(), ["A01", "A02", "A03", "A04"], "Yvan"), { A01: { status: "READY" }, A02: { status: "READY" }, A03: { status: "READY" }, A04: { status: "READY" } });
    const selected = selectForDevelopment(evaluated, "A03", "Yvan");
    expect(selected.stage).toBe("SELECTED_FOR_DEVELOPMENT");
    expect(selected.selectedCandidateId).toBe("A03");
    expect(selected.candidates.filter((candidate) => candidate.stage === "ARCHIVED")).toHaveLength(15);
    expect(selected.events.filter((event) => event.type === "HUMAN_DESIGN_SELECTION")).toHaveLength(2);
  });
  it("supports reversible return to the Final Four", () => {
    const evaluated = completeDeepEvaluation(promoteToFinalFour(makeState(), ["A01", "A02", "A03", "A04"], "Yvan"), { A01: { status: "READY" }, A02: { status: "READY" }, A03: { status: "READY" }, A04: { status: "READY" } });
    const selected = selectForDevelopment(evaluated, "A03", "Yvan");
    const returned = returnToFinalFour(selected, "Falla técnica crítica detectada");
    expect(returned.stage).toBe("RETURNED_TO_FINALISTS");
    expect(returned.candidates.filter((candidate) => candidate.stage === "FINALIST_4")).toHaveLength(4);
  });
  it("exposes only implemented comparison modes", () => {
    expect(setComparisonMode(makeState(), "PLAN").comparisonMode).toBe("PLAN");
    expect(setComparisonMode(makeState(), "ELEVATION").comparisonMode).toBe("ELEVATION");
    expect(() => setComparisonMode(makeState(), "DAYLIGHT")).toThrow("COMPARISON_MODE_NOT_IMPLEMENTED");
  });
});
