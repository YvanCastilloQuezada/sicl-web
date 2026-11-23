import { describe, expect, it } from "vitest";
import { hasValidRenderGeometry } from "./CockpitSpatialARModal";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

type Element = SpatialRepresentation["elements"][number];
const make = (element_type: string, type: string, coordinates: unknown, metadata?: Record<string, unknown>): Element => ({
  id: "test-element", element_type, geometry: { type, coordinates }, metadata,
});
const ring = [[0,0],[4,0],[4,3],[0,3],[0,0]];
const polygonCoordinates = [ring];
const onePartMultiPolygon = [[ring]];
const twoPartMultiPolygon = [[ring], [[[5,5],[8,5],[8,8],[5,5]]]];
const polygonWithHole = [ring, [[1,1],[2,1],[2,2],[1,1]]];

describe("Cockpit AR render geometry gate", () => {
  it("accepts finite 3D volume with positive height", () => {
    const volume = [[0,0,0],[4,0,0],[4,3,0],[0,3,0],[0,0,8],[4,0,8],[4,3,8],[0,3,8]];
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", volume, { height: 8 }))).toBe(true);
  });
  it("rejects nonfinite volume coordinates and missing/nonpositive height", () => {
    const validVolume = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,2],[1,0,2]];
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", validVolume, { height: 2 }))).toBe(true);
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", validVolume, { height: 0 }))).toBe(false);
    const invalidVolume = [[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,2],[NaN,0,2]];
    expect(hasValidRenderGeometry(make("BuildingMass", "volume", invalidVolume, { height: 2 }))).toBe(false);
  });
  it("accepts standard GeoJSON Polygon and rejects a degenerate exterior ring", () => {
    expect(hasValidRenderGeometry(make("BuildingFootprint", "polygon", polygonCoordinates))).toBe(true);
    expect(hasValidRenderGeometry(make("BuildingFootprint", "polygon", [[[0,0],[0,0],[0,0],[0,0]]]))).toBe(false);
  });
  it("accepts a single-part MultiPolygon, but blocks multipart and holes until rendered", () => {
    expect(hasValidRenderGeometry(make("SpatialZone", "multipolygon", onePartMultiPolygon))).toBe(true);
    expect(hasValidRenderGeometry(make("SpatialZone", "multipolygon", twoPartMultiPolygon))).toBe(false);
    expect(hasValidRenderGeometry(make("BuildingFootprint", "polygon", polygonWithHole))).toBe(false);
    expect(hasValidRenderGeometry(make("SiteBoundary", "polygon", polygonCoordinates))).toBe(false);
    expect(hasValidRenderGeometry(make("SpatialZone", "point", [1,2]))).toBe(false);
  });
});
