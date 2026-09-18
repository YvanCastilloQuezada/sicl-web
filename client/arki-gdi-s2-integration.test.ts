import { describe, expect, it } from "vitest";
import { buildGDIContinuum } from "./src/components/arkiGenerativeDesignContinuum";
import { buildGdiS2ControlledLoop, runGdiS2ControlledProof } from "./src/components/arkiGdiS2Integration";

describe("ARKI GDI → S2 controlled architectural loop", () => {
  it("uses an existing GDI hypothesis and preserves its branch identity", () => {
    const continuum = buildGDIContinuum("HOUSE-A21");
    const loop = buildGdiS2ControlledLoop(continuum.alternatives[1].id, "Human Architect directs the bounded revision");
    expect(loop.selectedAlternative).toBe(continuum.alternatives[1].id);
    expect(loop.selectedBranch).toBe(continuum.alternatives[1].branchId);
    expect(loop.execution.operation.parentId).toBe(loop.parent.id);
  });
  it("executes only after human direction and performs fresh readback", () => {
    const proof = runGdiS2ControlledProof();
    expect(proof.loop.execution.state).toBe("EXECUTED");
    expect(proof.loop.execution.freshReadback).toBe(true);
    expect(proof.loop.reevaluation?.geometryState).toBe("CHANGED");
    expect(proof.revaluated).toBe(true);
  });
  it("propagates affected design concerns without fabricating conclusions", () => {
    const proof = runGdiS2ControlledProof();
    expect(proof.loop.reevaluation?.affected).toEqual(expect.arrayContaining(["geometry", "adjacency", "circulation", "critique", "evaluation"]));
    expect(proof.loop.reevaluation?.unknownsPreserved).toBe(true);
    expect(proof.loop.reevaluation?.noDecision).toBe(true);
  });
  it("blocks unauthorized and conflicting mutations", () => {
    const proof = runGdiS2ControlledProof();
    expect(proof.unauthorized.state).toBe("BLOCKED");
    expect(proof.unauthorized.errors).toContain("HUMAN_AUTHORIZATION_REQUIRED");
    expect(proof.conflictBlocked).toBe(true);
  });
  it("does not create a winner, decision or automatic optimization", () => {
    const proof = runGdiS2ControlledProof();
    expect(proof.selectedIsHypothesis).toBe(true);
    expect(proof.noAutomaticWinner).toBe(true);
    expect(proof.noAutomaticDecision).toBe(true);
    expect(proof.branchPreserved).toBe(true);
  });
});
