import { describe, expect, it } from "vitest";
import { ecosystemAssets, reusableAssets } from "./ecosystemHarvest";

describe("Dynamo Grasshopper Rhino ecosystem harvest", () => {
  it("keeps host ecosystems horizontal and outside canonical authority", () => {
    const assets = ecosystemAssets();
    expect(assets.length).toBeGreaterThanOrEqual(14);
    expect(new Set(assets.map(asset => asset.host))).toEqual(
      new Set(["DYNAMO", "GRASSHOPPER", "RHINO"]),
    );
    expect(assets.some(asset => asset.assetId === "rhino-compute" && asset.disposition === "EXTERNAL_HOST")).toBe(true);
  });

  it("allows automatic reuse only for assets with verified licensing", () => {
    const reusable = reusableAssets();
    expect(reusable.length).toBeGreaterThan(0);
    for (const asset of reusable) {
      expect(asset.licenseVerified).toBe(true);
      expect(asset.licenseSpdx).not.toBeNull();
      expect(["REUSE_CODE", "ADAPT_PATTERN"]).toContain(asset.disposition);
    }
    expect(reusable.some(asset => asset.assetId === "dynamo-core")).toBe(true);
    expect(reusable.some(asset => asset.assetId === "clockwork")).toBe(true);
    const spacePlanning = reusable.find(asset => asset.assetId === "refinery-space-planning-toolkit");
    expect(spacePlanning?.capabilities).toEqual(expect.arrayContaining([
      "BIN_PACKING_2D",
      "GEOMETRIC_MEDIAN",
      "ISOVIST_2D",
      "SHORTEST_PATH_2D",
      "ADJACENCY_ANALYSIS",
    ]));
    expect(reusable.some(asset => asset.assetId === "rhino-compute")).toBe(false);
    expect(reusable.some(asset => asset.assetId === "dynashape")).toBe(true);
    expect(reusable.some(asset => asset.assetId === "topologic-dynamo")).toBe(false);
  });
});
