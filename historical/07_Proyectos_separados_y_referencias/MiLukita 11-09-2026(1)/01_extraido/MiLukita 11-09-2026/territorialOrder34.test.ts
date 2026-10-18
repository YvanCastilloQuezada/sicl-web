import { describe, expect, it } from "vitest";
import { calculateConfidenceBreakdown, calculateConfidenceScore, canPublishWorldObject, isRuntimeVisible } from "./territorialTrust";

describe("territorial order 34 acceptance", () => {
  it("returns a reason for every evidence dimension without claiming truth", () => {
    const rows = calculateConfidenceBreakdown({ sourceCount: 1, evidenceCount: 1, accuracyMeters: 10, claimCount: 1, status: "VERIFIED" });
    expect(rows).toHaveLength(8);
    expect(rows.every(row => row.reason.length > 0)).toBe(true);
    expect(calculateConfidenceScore({ sourceCount: 1, evidenceCount: 1, accuracyMeters: 10, claimCount: 1, status: "VERIFIED" })).toBeLessThanOrEqual(100);
  });

  it("rejects all non-published knowledge states from Runtime", () => {
    for (const status of ["DRAFT", "CAPTURED", "UNDER_REVIEW", "EVIDENCE_REQUIRED", "DISPUTED", "REJECTED", "ARCHIVED"] as const) {
      expect(isRuntimeVisible(status)).toBe(false);
      expect(canPublishWorldObject(status, 100, 1, 1)).toBe(false);
    }
  });
});
