import { describe, expect, it } from "vitest";
import { capabilitiesForScale, spatialPlanningCapabilities } from "./spatialPlanningHarvest";

describe("multiscale spatial planning harvest", () => {
  it("does not confine planning intelligence to buildings", () => {
    const park = capabilitiesForScale("CAMPUS_PARK").map(item => item.capability);
    const urban = capabilitiesForScale("URBAN").map(item => item.capability);
    expect(park).toEqual(expect.arrayContaining([
      "SPATIAL_SUBDIVISION",
      "PEDESTRIAN_PATH_NETWORK",
      "LAND_USE_ALLOCATION",
      "PARAMETRIC_LANDFORM",
      "STORMWATER_GRADING_ANALYSIS",
    ]));
    expect(urban).toEqual(expect.arrayContaining([
      "PLOT_SUBDIVISION",
      "STREET_PATH_GENERATION",
      "LAND_USE_ALLOCATION",
    ]));
  });

  it("separates Voronoi spatial planning from facade expression", () => {
    const all = spatialPlanningCapabilities();
    const partition = all.find(item => item.capability === "VORONOI_PARTITION_2D");
    const facade = all.find(item => item.capability === "FACADE_VORONOI_PATTERN");
    expect(partition?.scales).toEqual(["INTERIOR", "BUILDING", "CAMPUS_PARK", "URBAN"]);
    expect(facade?.scales).toEqual(["BUILDING"]);
    expect(facade?.arkiTargets).toContain("PARAMETRIC_COMPUTATIONAL_DESIGN_DIRECTOR");
  });

  it("keeps proprietary/current Autodesk features as references rather than harvested implementations", () => {
    const refs = spatialPlanningCapabilities().filter(item => item.sourceClass === "EXTERNAL_REFERENCE");
    expect(refs.map(item => item.capability)).toEqual(expect.arrayContaining([
      "SITE_AUTOMATION_REFERENCE",
      "BUILDING_LAYOUT_EXPLORER_REFERENCE",
    ]));
  });
});
