import { describe, expect, it } from "vitest";
import { D62_GENERIC_FIXTURE, executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { verifyD71Effects } from "./arkiD71EffectVerification";
import { detectD76Deficits, D76_VALIDATION_FIXTURE } from "./arkiD76AutonomousDeficitDetection";
import { diagnoseD77 } from "./arkiD77AutonomousCauseDiagnosis";
import { runD78NovelObservation } from "./arkiD78NovelObservation";

describe("D7.8 novel observation", () => {
  it("freezes K0 and stops promotion when no valid novelty is observed", () => {
    const d62 = executeD62GeneralStrategyGate(D62_GENERIC_FIXTURE);
    const d64 = runD64ClosedLoop(synthesizeD63Candidates(d62.synthesis.contextualStrategies).candidates);
    const d71 = verifyD71Effects(d64);
    const d77 = diagnoseD77(detectD76Deficits(D76_VALIDATION_FIXTURE).findings);
    const result = runD78NovelObservation(d64, d71, d77.diagnoses);
    expect(result.k0Hash.length).toBeGreaterThan(0);
    expect(result.observations.every((item) => item.classification === "DIRECT_EXECUTION_RESULT")).toBe(true);
    expect(result.learningCandidate).toBeNull();
    expect(result.gate).toBe("NO_VALID_NOVEL_OBSERVATION");
    expect(result.persistencePromotion).toBe("STOPPED");
  });
});
