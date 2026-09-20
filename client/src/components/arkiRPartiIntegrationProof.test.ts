import { describe, expect, it } from "vitest";
import { runRPartiIntegrationProof, validateRPartiIntegrationProof } from "./arkiRPartiIntegrationProof";

describe("R-PARTI integrated proof I0-I11", () => {
  it("demonstrates one parti producing three distinct generated realizations", () => {
    const proof = runRPartiIntegrationProof({ head: "9a8675961074db476288a22740d851d5ee749080", remoteHead: "9a8675961074db476288a22740d851d5ee749080", worktree: "CLEAN" });
    expect(proof.parti.realizationIds).toHaveLength(3);
    expect(proof.parti.distinctGeometry).toBe(true);
    expect(proof.parti.notTemplate).toBe(true);
    expect(validateRPartiIntegrationProof(proof)).toBe(true);
  });

  it("preserves unknowns, human authority and rejects hardcoding", () => {
    const proof = runRPartiIntegrationProof({ head: "9a8675961074db476288a22740d851d5ee749080", remoteHead: "9a8675961074db476288a22740d851d5ee749080", worktree: "CLEAN" });
    expect(proof.representation.unknownPreserved).toBe(true);
    expect(proof.humanFeedback.automaticAestheticJudgment).toBe(false);
    expect(proof.adversarial.hardcodingDetected).toBe(false);
    expect(proof.mutationBacktrack.humanDecisionRequired).toBe(true);
    expect(proof.rpMatrix).toHaveLength(20);
  });
});
