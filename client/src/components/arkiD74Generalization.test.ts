import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { runD65TransferLearning } from "./arkiD65TransferLearning";
import { verifyD71Effects } from "./arkiD71EffectVerification";
import { compareD72Candidates } from "./arkiD72ArchitecturalComparison";
import { runD73PersistentLearningProof } from "./arkiD73PersistentLearningProof";
import { runD74Generalization } from "./arkiD74Generalization";

describe("D7.4 generalization and restraint", () => {
  it("preserves positive transfer and critical non-transfer while requiring persistence", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const d71 = verifyD71Effects(d64); const d72 = compareD72Candidates(d64, d71); const d73 = runD73PersistentLearningProof(d71, d72);
    const result = runD74Generalization(runD65TransferLearning(d64), d73);
    expect(result.crossTypologyCompatible).toBe("PASS");
    expect(result.criticalDifferenceRestraint).toBe("PASS");
    expect(result.persistence).toBe("FAIL");
    expect(result.generalization).toBe("PARTIAL");
  });
});
