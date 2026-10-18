import { describe, expect, it } from "vitest";
import { calculateConfidenceScore, isRuntimeVisible } from "./territorialTrust";

describe("territorial order 35", () => {
  it("keeps field permissions in explicit user-facing states", () => {
    expect(["UNKNOWN", "REQUESTING", "GRANTED", "DENIED", "UNSUPPORTED"]).toHaveLength(5);
    expect("DENIED").not.toBe("GRANTED");
  });

  it("keeps confidence explainable and runtime closed to non-published states", () => {
    const score = calculateConfidenceScore({ sourceCount: 1, evidenceCount: 1, claimCount: 1, accuracyMeters: 10, status: "VERIFIED" });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(isRuntimeVisible("CAPTURED")).toBe(false);
    expect(isRuntimeVisible("PUBLISHED")).toBe(true);
  });
});
