import { describe, expect, it } from "vitest";
import { D76_VALIDATION_FIXTURE, detectD76Deficits } from "./arkiD76AutonomousDeficitDetection";
import { diagnoseD77 } from "./arkiD77AutonomousCauseDiagnosis";

describe("D7.7 autonomous cause diagnosis", () => {
  it("diagnoses from D7.6 output without receiving the cause", () => {
    const detected = detectD76Deficits(D76_VALIDATION_FIXTURE);
    const result = diagnoseD77(detected.findings);
    expect(result.gate).toBe("PASS");
    expect(result.l3).toBe("DEMONSTRATED");
    expect(result.causeNotSupplied).toBe(true);
    expect(result.typologyLookup).toBe(false);
    expect(result.diagnoses.length).toBeGreaterThan(0);
  });

  it("retains unsupported and unknown causal hypotheses", () => {
    const result = diagnoseD77(detectD76Deficits(D76_VALIDATION_FIXTURE).findings);
    const hypotheses = result.diagnoses.flatMap((item) => item.hypotheses);
    expect(hypotheses.some((item) => item.status === "SUPPORTED")).toBe(true);
    expect(hypotheses.some((item) => item.status === "UNSUPPORTED")).toBe(true);
    expect(hypotheses.some((item) => item.status === "UNKNOWN")).toBe(true);
    expect(result.diagnoses.every((item) => item.causeModels[0].verifiedCauses.length === 0)).toBe(true);
  });
});
