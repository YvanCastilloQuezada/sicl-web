import { describe, expect, it } from "vitest";
import { comparisonCollectionForRecommendation, nextRecommendationVersion } from "./recommendationVersion";

describe("nextRecommendationVersion", () => {
  it("starts at one and increments the highest existing version", () => {
    expect(nextRecommendationVersion([])).toBe(1);
    expect(nextRecommendationVersion([1, "2", 4])).toBe(5);
  });

  it("ignores absent and non-numeric historical values", () => {
    expect(nextRecommendationVersion([undefined, null, "", "invalid", 3])).toBe(4);
  });
});

describe("comparisonCollectionForRecommendation", () => {
  const snapshot = { comparisons: [{ id: "CMP-1" }], multiComparisons: [{ id: "MCMP-1" }] };

  it("selects the declared collection and keeps multi-criteria references separate", () => {
    expect(comparisonCollectionForRecommendation("BINARY", snapshot).map((item) => item.id)).toEqual(["CMP-1"]);
    expect(comparisonCollectionForRecommendation("MULTI_CRITERIA", snapshot).map((item) => item.id)).toEqual(["MCMP-1"]);
  });
});
