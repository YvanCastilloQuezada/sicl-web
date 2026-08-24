import { describe, expect, it } from "vitest";
import { nextRecommendationVersion } from "./recommendationVersion";

describe("nextRecommendationVersion", () => {
  it("starts at one and increments the highest existing version", () => {
    expect(nextRecommendationVersion([])).toBe(1);
    expect(nextRecommendationVersion([1, "2", 4])).toBe(5);
  });

  it("ignores absent and non-numeric historical values", () => {
    expect(nextRecommendationVersion([undefined, null, "", "invalid", 3])).toBe(4);
  });
});
