import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { verifyD71Effects } from "./arkiD71EffectVerification";
import { compareD72Candidates } from "./arkiD72ArchitecturalComparison";
import { runD73PersistentLearningProof } from "./arkiD73PersistentLearningProof";

describe("D7.3 persistent learning proof", () => {
  it("records K0 and refuses false learning when no valid event exists", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const d71 = verifyD71Effects(d64);
    const d72 = compareD72Candidates(d64, d71);
    const result = runD73PersistentLearningProof(d71, d72);
    expect(result.gate).toBe("NO_VALID_LEARNING_EVENT_OBSERVED");
    expect(result.k1).toBe("NOT_CREATED");
    expect(result.persistence).toBe("NOT_DEMONSTRATED");
    expect(result.counterfactualFilter.some((item) => item.answer === "YES")).toBe(true);
  });
});
