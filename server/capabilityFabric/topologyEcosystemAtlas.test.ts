import { describe, expect, it } from "vitest";
import { topologyPrecedents } from "./topologyEcosystemAtlas";
import { ecosystemAssets, reusableAssets } from "./ecosystemHarvest";

describe("Revit and Archicad topology harvest", () => {
  it("covers geometry, architectural space, systems and parametric dependency topology", () => {
    const layers = new Set(topologyPrecedents().map(item => item.layer));
    expect(layers).toEqual(new Set([
      "GEOMETRIC", "ARCHITECTURAL", "SPATIAL", "SYSTEM_NETWORK", "PARAMETRIC_DEPENDENCY",
    ]));
  });

  it("keeps both BIM ecosystems non-canonical", () => {
    expect(topologyPrecedents().every(item => item.arkiAuthority === "REFERENCE_OR_PROVIDER_ONLY")).toBe(true);
  });

  it("recognizes Archicad graph and automation surfaces without importing AGPL code", () => {
    const assets = ecosystemAssets();
    expect(assets.find(a => a.assetId === "archicad-param-o")?.capabilities)
      .toContain("NODE_BASED_PARAMETRIC_OBJECTS");
    expect(reusableAssets().some(a => a.assetId === "tapir-archicad-automation")).toBe(true);
    expect(reusableAssets().some(a => a.assetId === "floorplan6")).toBe(false);
  });
});
