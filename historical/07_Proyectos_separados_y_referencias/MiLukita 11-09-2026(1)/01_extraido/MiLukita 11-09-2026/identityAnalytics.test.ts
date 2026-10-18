import { describe, expect, it } from "vitest";
import { compareDeviceDistributions, isWithinAnalyticsRange, summarizeDeviceDistribution } from "./identityAnalytics";

describe("identity analytics", () => {
  it("includes the complete selected calendar days", () => {
    const range = { from: "2026-08-27", to: "2026-08-27" };
    expect(isWithinAnalyticsRange("2026-08-27T00:00:00.000Z", range)).toBe(true);
    expect(isWithinAnalyticsRange("2026-08-27T23:59:59.999Z", range)).toBe(true);
    expect(isWithinAnalyticsRange("2026-08-28T00:00:00.000Z", range)).toBe(false);
  });

  it("returns deterministic device counts and keeps unknown types explicit", () => {
    const points = summarizeDeviceDistribution([
      { createdAt: "2026-08-27T10:00:00.000Z", deviceType: "MOBILE" },
      { createdAt: "2026-08-27T11:00:00.000Z", deviceType: "MOBILE" },
      { createdAt: "2026-08-27T12:00:00.000Z", deviceType: null },
      { createdAt: "2026-08-28T12:00:00.000Z", deviceType: "TV" },
    ], { from: "2026-08-27", to: "2026-08-27" });
    expect(points).toEqual([{ name: "MOBILE", users: 2 }, { name: "UNKNOWN", users: 1 }]);
  });

  it("does not create a claim when there are no records in the selected range", () => {
    expect(summarizeDeviceDistribution([{ createdAt: "2026-08-28T12:00:00.000Z", deviceType: "TV" }], { from: "2026-08-27", to: "2026-08-27" })).toEqual([]);
  });

  it("aligns device types across two ranges and exposes zeroes instead of hiding differences", () => {
    expect(compareDeviceDistributions([
      { createdAt: "2026-08-27T10:00:00.000Z", deviceType: "MOBILE" },
      { createdAt: "2026-08-28T10:00:00.000Z", deviceType: "TV" },
    ], { from: "2026-08-27", to: "2026-08-27" }, { from: "2026-08-28", to: "2026-08-28" })).toEqual([
      { name: "MOBILE", firstUsers: 1, secondUsers: 0 },
      { name: "TV", firstUsers: 0, secondUsers: 1 },
    ]);
  });
});
