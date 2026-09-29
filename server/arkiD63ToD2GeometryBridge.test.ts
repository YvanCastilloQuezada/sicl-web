import { describe, expect, it } from "vitest";
import { bridgeD63ToD2Geometry } from "./arkiD63ToD2GeometryBridge";

const polygon = (ring: unknown[]) => ({ type: "Polygon", coordinates: [ring] });
const validRing = [[1.1, 2.4], [3, 2.4], [3, 4], [1.1, 4], [1.1, 2.4]];
const run = (overrides: Record<string, unknown> = {}) => bridgeD63ToD2Geometry({
  geometry: polygon(validRing),
  coordinateSystem: "LOCAL_PROJECT_2D",
  units: "m",
  baseElevation_mm: 0,
  verticalExtent_mm: 2800,
  ...overrides,
} as never);

describe("D6.3 to D-2 strict geometry bridge", () => {
  it("emits the verified Core EXTRUDED_RECTANGLE shape with explicit origin and vertical values", () => {
    expect(run()).toEqual({ ok: true, value: {
      kind: "EXTRUDED_RECTANGLE",
      profile: { width_mm: 1900, depth_mm: 1600, radius_mm: null },
      x_mm: 1100, y_mm: 2400, z_mm: 0, height_mm: 2800,
    }});
  });

  it.each([-3200, 0, 4500])("preserves authorized z_mm=%i without conversion or default", (z) => {
    const result = run({ baseElevation_mm: z });
    expect(result.ok && result.value.z_mm).toBe(z);
  });

  it("accepts clockwise/counterclockwise winding and different starting vertices", () => {
    const rings = [
      [[1,2],[3,2],[3,4],[1,4],[1,2]],
      [[1,2],[1,4],[3,4],[3,2],[1,2]],
      [[3,4],[1,4],[1,2],[3,2],[3,4]],
    ];
    for (const ring of rings) expect(run({ geometry: polygon(ring) }).ok).toBe(true);
  });

  it.each([0.1,0.2,0.3,1.1,2.4,3])("accepts ordinary IEEE-754 metre value %f at exact-mm semantics", (x) => {
    const result = run({ geometry: polygon([[x,2],[x+1,2],[x+1,3],[x,3],[x,2]]) });
    expect(result.ok).toBe(true);
  });

  it("rejects unsupported representation context", () => {
    expect(run({ coordinateSystem: "EPSG:4326" })).toEqual({ ok:false, code:"GEOMETRY_COORDINATE_SYSTEM_NOT_SUPPORTED" });
    expect(run({ units: "ft" })).toEqual({ ok:false, code:"GEOMETRY_UNITS_NOT_SUPPORTED" });
  });

  it("validates runtime shape rather than trusting TypeScript", () => {
    expect(run({ geometry: null })).toEqual({ ok:false, code:"GEOMETRY_TYPE_NOT_SUPPORTED" });
    expect(run({ geometry: { type:"LineString", coordinates:[] } })).toEqual({ ok:false, code:"GEOMETRY_TYPE_NOT_SUPPORTED" });
    expect(run({ geometry: { type:"Polygon", coordinates:[] } })).toEqual({ ok:false, code:"GEOMETRY_RING_COUNT_INVALID" });
    expect(run({ geometry: { type:"Polygon", coordinates:[validRing, validRing] } })).toEqual({ ok:false, code:"GEOMETRY_RING_COUNT_INVALID" });
    expect(run({ geometry: polygon([[0,0],[1,0],[1,1],[0,1]]) })).toEqual({ ok:false, code:"GEOMETRY_RING_VERTEX_COUNT_INVALID" });
    expect(run({ geometry: polygon([[0,0],[1,0],[1,1],[0,1],[9,9]]) })).toEqual({ ok:false, code:"GEOMETRY_RING_NOT_CLOSED" });
    expect(run({ geometry: polygon([[0,0,0],[1,0],[1,1],[0,1],[0,0]]) })).toEqual({ ok:false, code:"GEOMETRY_VERTEX_NOT_2D" });
    expect(run({ geometry: polygon([[0,0],[1,0],[1,Infinity],[0,1],[0,0]]) })).toEqual({ ok:false, code:"GEOMETRY_COORDINATE_NOT_FINITE" });
  });

  it("rejects triangles, duplicate vertices, rotated rectangles, trapezoids and bow-ties instead of bounding-box conversion", () => {
    const invalid = [
      [[0,0],[2,0],[0,2],[0,0],[0,0]],
      [[0,0],[2,0],[2,0],[0,2],[0,0]],
      [[0,1],[1,0],[2,1],[1,2],[0,1]],
      [[0,0],[3,0],[2,2],[0,2],[0,0]],
      [[0,0],[2,2],[0,2],[2,0],[0,0]],
    ];
    for (const ring of invalid) expect(run({ geometry: polygon(ring) }).ok).toBe(false);
  });

  it("rejects non-representable sub-mm coordinates", () => {
    expect(run({ geometry: polygon([[0.0004,0],[1,0],[1,1],[0.0004,1],[0.0004,0]]) }))
      .toEqual({ ok:false, code:"GEOMETRY_MM_PRECISION_NOT_REPRESENTABLE" });
  });

  it("enforces the frozen 1e-9 mm computational precision boundary", () => {
    const withinMetres = (1e-9 / 1000) * 0.5;
    const beyondMetres = (1e-9 / 1000) * 2;
    expect(run({ geometry: polygon([[withinMetres,0],[1,0],[1,1],[withinMetres,1],[withinMetres,0]]) }).ok).toBe(true);
    expect(run({ geometry: polygon([[beyondMetres,0],[1,0],[1,1],[beyondMetres,1],[beyondMetres,0]]) }))
      .toEqual({ ok:false, code:"GEOMETRY_MM_PRECISION_NOT_REPRESENTABLE" });
  });

  it.each([NaN, Infinity, -Infinity])("rejects non-finite planar coordinate %s", (coordinate) => {
    expect(run({ geometry: polygon([[0,0],[1,0],[1,coordinate],[0,1],[0,0]]) }))
      .toEqual({ ok:false, code:"GEOMETRY_COORDINATE_NOT_FINITE" });
  });

  it("validates vertical authority as already-mm integers", () => {
    expect(run({ baseElevation_mm: NaN })).toEqual({ ok:false, code:"GEOMETRY_BASE_ELEVATION_NOT_FINITE" });
    expect(run({ baseElevation_mm: 1.5 })).toEqual({ ok:false, code:"GEOMETRY_BASE_ELEVATION_NOT_INTEGER" });
    expect(run({ verticalExtent_mm: Infinity })).toEqual({ ok:false, code:"GEOMETRY_VERTICAL_EXTENT_NOT_FINITE" });
    expect(run({ verticalExtent_mm: 2800.5 })).toEqual({ ok:false, code:"GEOMETRY_VERTICAL_EXTENT_NOT_INTEGER" });
    expect(run({ verticalExtent_mm: 0 })).toEqual({ ok:false, code:"GEOMETRY_VERTICAL_EXTENT_NOT_POSITIVE" });
    expect(run({ verticalExtent_mm: -1 })).toEqual({ ok:false, code:"GEOMETRY_VERTICAL_EXTENT_NOT_POSITIVE" });
  });

  it("does not mutate its geometry input", () => {
    const geometry = polygon(validRing.map((p) => [...p]));
    const before = JSON.stringify(geometry);
    run({ geometry });
    expect(JSON.stringify(geometry)).toBe(before);
  });
});
