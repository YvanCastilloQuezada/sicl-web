import { describe, expect, it } from "vitest";
import { D76_VALIDATION_FIXTURE, detectD76Deficits } from "./arkiD76AutonomousDeficitDetection";

describe("D7.6 autonomous relational deficit detection", () => {
  it("passes L2 without receiving the deficit as an input label", () => {
    const result = detectD76Deficits(D76_VALIDATION_FIXTURE);
    expect(result.gate).toBe("PASS");
    expect(result.l2).toBe("DEMONSTRATED");
    expect(result.typologyDispatch).toBe(false);
    expect(result.fixtureAnswerLeakage).toBe(false);
    expect(result.findings.some((item) => item.epistemicStatus === "OBSERVED")).toBe(true);
  });

  it("does not classify unusual valid configuration as a deficit", () => {
    const result = detectD76Deficits(D76_VALIDATION_FIXTURE);
    expect(result.falsePositiveControl.passed).toBe(true);
    expect(result.falsePositiveControl.findingCount).toBe(0);
  });

  it("preserves insufficient evidence as UNKNOWN", () => {
    const result = detectD76Deficits(D76_VALIDATION_FIXTURE);
    expect(result.unknownControl.passed).toBe(true);
    expect(result.findings.some((item) => item.epistemicStatus === "UNKNOWN")).toBe(true);
  });
});
