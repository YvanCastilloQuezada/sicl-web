import { describe, expect, it } from "vitest";
import {
  architecturalCapabilityRepository,
  capabilitiesByArea,
  classifyCapability,
  sourcesForCapability,
} from "./architecturalCapabilityRepository";

describe("architectural capability repository", () => {
  it("organizes ideas by architectural problem instead of vendor", () => {
    expect(classifyCapability("VORONOI_SPACE_SUBDIVISION")).toBe("SPATIAL_LAYOUT");
    expect(classifyCapability("MEP_PORT_ROUTE_CONNECTIVITY")).toBe("SYSTEMS_NETWORKS");
    expect(classifyCapability("TSPLINE_MODELING")).toBe("GEOMETRY_TOPOLOGY");
    expect(classifyCapability("GRASSHOPPER_ARCHICAD_LIVE_BIM")).toBe("PARAMETRIC_COMPUTATIONAL");
  });

  it("keeps provenance and license boundary on every indexed capability", () => {
    const records = architecturalCapabilityRepository();
    expect(records.length).toBeGreaterThan(50);
    expect(records.every(record => record.sourceAssetId && record.host && record.disposition)).toBe(true);
    expect(records.find(record => record.sourceAssetId === "floorplan6")?.licenseVerified).toBe(true);
  });

  it("can retrieve competing sources for an architectural area or capability", () => {
    expect(capabilitiesByArea("GEOMETRY_TOPOLOGY").length).toBeGreaterThan(0);
    expect(sourcesForCapability("PANELING").map(record => record.sourceAssetId)).toContain("clockwork");
  });
});
