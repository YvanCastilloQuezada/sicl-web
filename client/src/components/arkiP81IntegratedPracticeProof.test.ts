import { describe, expect, it } from "vitest";
import { runP81IntegratedPracticeProof, validateP81Proof } from "./arkiP81IntegratedPracticeProof";

describe("P8.1 controlled integrated architectural practice", () => {
  it("runs a clean, non-UPAO chain through detection, diagnosis, strategy, mutation and comparison", () => {
    const result = runP81IntegratedPracticeProof();
    expect(result.boundary.state).toBe("CLEAN_BOUNDARY");
    expect(result.detection.fixtureAnswerLeakage).toBe(false);
    expect(result.detection.typologyDispatch).toBe(false);
    expect(result.diagnosis.causeNotSupplied).toBe(true);
    expect(result.strategy.strategiesProvided).toBe(0);
    expect(result.candidates.candidates.length).toBeGreaterThan(0);
    expect(result.closedLoop.l7).toBe("DEMONSTRATED");
    expect(result.effects.gate).toBe("PASS");
    expect(result.comparison.automaticWinner).toBe("NONE");
  });

  it("records broken bridges instead of fabricating professional or regulatory completion", () => {
    const result = runP81IntegratedPracticeProof();
    expect(result.brokenBridges.length).toBeGreaterThan(0);
    expect(result.permitReady).toBe(false);
    expect(result.professionalValidation).toBe("NOT_CLAIMED");
    expect(result.performance.noAutomaticCompliance).toBe(true);
    expect(result.coordination.state).toBe("BLOCKED");
  });

  it("preserves human authority and does not create K1", () => {
    const result = runP81IntegratedPracticeProof();
    expect(validateP81Proof(result)).toBe(true);
    expect(result.k1Created).toBe(false);
    expect(result.decision.state).toBe("PENDING_HUMAN_DECISION");
    expect(result.decision.noAutomaticDecision).toBe(true);
  });
});
