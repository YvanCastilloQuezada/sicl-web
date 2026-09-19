import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { runD65TransferLearning } from "./arkiD65TransferLearning";

describe("D6.5 transfer and learning boundary", () => {
  it("demonstrates transfer with adaptation and restraint", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const result = runD65TransferLearning(d64);
    expect(result.positiveTransfer).toBe("PASS");
    expect(result.restraint).toBe("PASS");
    expect(result.assessments.some((item) => item.decision === "ADAPT")).toBe(true);
    expect(result.assessments.some((item) => item.decision === "DO_NOT_TRANSFER")).toBe(true);
  });

  it("does not claim autonomous learning or persistence from execution", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const result = runD65TransferLearning(d64);
    expect(result.learningClaim).toBe("NONE");
    expect(result.persistence).toBe("NOT_TESTED");
    expect(result.generalization).toBe("PARTIAL");
  });
});
