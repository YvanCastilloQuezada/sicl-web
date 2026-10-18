import { describe, expect, it } from "vitest";
import { DISTRIBUTION_CORE_DENIALS, DISTRIBUTION_REQUIRED_GATES, assessDistributionChannel, distributionCanPublish, distributionCanWriteCore, distributionStatusIsHonest } from "./distributionReadiness";

describe("Distribution OS readiness contract", () => {
  it("keeps unconnected channels external-required", () => {
    const assessment = assessDistributionChannel({ channel: "SOCIAL" });
    expect(assessment.readiness).toBe("EXTERNAL_REQUIRED");
    expect(assessment.missingGates).toEqual(DISTRIBUTION_REQUIRED_GATES);
    expect(distributionCanPublish(assessment)).toBe(false);
  });
  it("can measure all gates without granting publication authority", () => {
    const assessment = assessDistributionChannel({ channel: "WEB", gates: DISTRIBUTION_REQUIRED_GATES, provider: "staging", evidence: ["qa-report"] });
    expect(assessment.readiness).toBe("READY");
    expect(distributionCanPublish(assessment)).toBe(false);
  });
  it("preserves honest no-data and core isolation", () => {
    expect(distributionStatusIsHonest("NO_DATA", [])).toBe(true);
    expect(distributionStatusIsHonest("NO_DATA", ["invented"])).toBe(false);
    expect(distributionCanWriteCore("RNG")).toBe(false);
    expect(DISTRIBUTION_CORE_DENIALS).toContain("MJP_CORE");
  });
});
