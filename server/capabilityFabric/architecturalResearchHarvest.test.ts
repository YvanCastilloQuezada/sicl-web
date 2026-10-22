import { describe, expect, it } from "vitest";
import { architecturalResearchPatterns } from "./architecturalResearchHarvest";

describe("architectural research harvest", () => {
  it("preserves the Autodesk spatial-design lineage as capabilities, not canonical authority", () => {
    const patterns = architecturalResearchPatterns();
    expect(patterns.map(pattern => pattern.year)).toEqual([2017,2018,2019,2020,2021,2022,2023,2024,2025]);
    expect(patterns.some(pattern => pattern.capabilities.includes("ROOM_ADJACENCY"))).toBe(true);
    expect(patterns.some(pattern => pattern.capabilities.includes("PATHFINDING_3D"))).toBe(true);
    expect(patterns.some(pattern => pattern.capabilities.includes("DISCRETE_EVENT_SIMULATION"))).toBe(true);
  });

  it("maps harvested methods to Directors rather than directly to D-2", () => {
    for (const pattern of architecturalResearchPatterns()) {
      expect(pattern.arkiUse.length).toBeGreaterThan(0);
      expect(pattern.arkiUse).not.toContain("D2_CANONICAL_MUTATION");
    }
  });
});
