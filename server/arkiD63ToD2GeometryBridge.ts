import type { Geometry2D } from "./arkiD63GeometricBridge";

export const ARCHIGEOMETRY_RECTANGLE_ORIGIN_CONVENTION_V1 = "MIN_X_MIN_Y_BASE_Z" as const;

export type D63ToD2GeometryBridgeFailureCode =
  | "GEOMETRY_TYPE_NOT_SUPPORTED"
  | "GEOMETRY_COORDINATE_SYSTEM_NOT_SUPPORTED"
  | "GEOMETRY_UNITS_NOT_SUPPORTED"
  | "GEOMETRY_RING_COUNT_INVALID"
  | "GEOMETRY_RING_VERTEX_COUNT_INVALID"
  | "GEOMETRY_RING_NOT_CLOSED"
  | "GEOMETRY_VERTEX_NOT_2D"
  | "GEOMETRY_COORDINATE_NOT_FINITE"
  | "GEOMETRY_RECTANGLE_VERTEX_SET_INVALID"
  | "GEOMETRY_RECTANGLE_DEGENERATE"
  | "GEOMETRY_MM_PRECISION_NOT_REPRESENTABLE"
  | "GEOMETRY_BASE_ELEVATION_NOT_FINITE"
  | "GEOMETRY_BASE_ELEVATION_NOT_INTEGER"
  | "GEOMETRY_VERTICAL_EXTENT_NOT_FINITE"
  | "GEOMETRY_VERTICAL_EXTENT_NOT_INTEGER"
  | "GEOMETRY_VERTICAL_EXTENT_NOT_POSITIVE";

export type D2ExtrudedRectangleGeometry = {
  kind: "EXTRUDED_RECTANGLE";
  profile: { width_mm: number; depth_mm: number; radius_mm: null };
  x_mm: number;
  y_mm: number;
  z_mm: number;
  height_mm: number;
};

export type D63ToD2GeometryBridgeResult =
  | { ok: true; value: D2ExtrudedRectangleGeometry }
  | { ok: false; code: D63ToD2GeometryBridgeFailureCode };

export interface D63ToD2GeometryBridgeInput {
  geometry: Geometry2D | unknown;
  coordinateSystem: string;
  units: string;
  baseElevation_mm: number;
  verticalExtent_mm: number;
}

const MM_EPSILON = 1e-9;

function fail(code: D63ToD2GeometryBridgeFailureCode): D63ToD2GeometryBridgeResult {
  return { ok: false, code };
}

function exactMillimetres(valueMetres: number): number | null {
  const scaled = valueMetres * 1000;
  const nearest = Math.round(scaled);
  return Math.abs(scaled - nearest) <= MM_EPSILON ? nearest : null;
}

function samePoint(a: readonly number[], b: readonly number[]): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Pure mechanical D6.3 -> D-2 geometry adapter.
 * It validates and transforms only; architectural authority is supplied by callers.
 */
export function bridgeD63ToD2Geometry(
  input: D63ToD2GeometryBridgeInput
): D63ToD2GeometryBridgeResult {
  if (input.coordinateSystem !== "LOCAL_PROJECT_2D") {
    return fail("GEOMETRY_COORDINATE_SYSTEM_NOT_SUPPORTED");
  }
  if (input.units !== "m") return fail("GEOMETRY_UNITS_NOT_SUPPORTED");

  if (!Number.isFinite(input.baseElevation_mm)) return fail("GEOMETRY_BASE_ELEVATION_NOT_FINITE");
  if (!Number.isInteger(input.baseElevation_mm)) return fail("GEOMETRY_BASE_ELEVATION_NOT_INTEGER");
  if (!Number.isFinite(input.verticalExtent_mm)) return fail("GEOMETRY_VERTICAL_EXTENT_NOT_FINITE");
  if (!Number.isInteger(input.verticalExtent_mm)) return fail("GEOMETRY_VERTICAL_EXTENT_NOT_INTEGER");
  if (input.verticalExtent_mm <= 0) return fail("GEOMETRY_VERTICAL_EXTENT_NOT_POSITIVE");

  const geometry = input.geometry;
  if (!geometry || typeof geometry !== "object" || (geometry as { type?: unknown }).type !== "Polygon") {
    return fail("GEOMETRY_TYPE_NOT_SUPPORTED");
  }
  const coordinates = (geometry as { coordinates?: unknown }).coordinates;
  if (!Array.isArray(coordinates) || coordinates.length !== 1) {
    return fail("GEOMETRY_RING_COUNT_INVALID");
  }
  const ring = coordinates[0];
  if (!Array.isArray(ring) || ring.length !== 5) {
    return fail("GEOMETRY_RING_VERTEX_COUNT_INVALID");
  }
  for (const vertex of ring) {
    if (!Array.isArray(vertex) || vertex.length !== 2) return fail("GEOMETRY_VERTEX_NOT_2D");
    if (!vertex.every((coordinate) => typeof coordinate === "number" && Number.isFinite(coordinate))) {
      return fail("GEOMETRY_COORDINATE_NOT_FINITE");
    }
  }

  const points = ring as number[][];
  if (!samePoint(points[0], points[4])) return fail("GEOMETRY_RING_NOT_CLOSED");
  const vertices = points.slice(0, 4);
  const uniqueVertices = new Set(vertices.map(([x, y]) => `${x}|${y}`));
  if (uniqueVertices.size !== 4) return fail("GEOMETRY_RECTANGLE_VERTEX_SET_INVALID");

  const xs = [...new Set(vertices.map(([x]) => x))];
  const ys = [...new Set(vertices.map(([, y]) => y))];
  if (xs.length !== 2 || ys.length !== 2) return fail("GEOMETRY_RECTANGLE_VERTEX_SET_INVALID");

  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  if (!(maxX > minX) || !(maxY > minY)) return fail("GEOMETRY_RECTANGLE_DEGENERATE");

  const expected = new Set([
    `${minX}|${minY}`, `${minX}|${maxY}`,
    `${maxX}|${minY}`, `${maxX}|${maxY}`,
  ]);
  if ([...uniqueVertices].some((vertex) => !expected.has(vertex))) {
    return fail("GEOMETRY_RECTANGLE_VERTEX_SET_INVALID");
  }

  for (let i = 0; i < 4; i += 1) {
    const [x1, y1] = points[i], [x2, y2] = points[i + 1];
    const horizontal = y1 === y2 && x1 !== x2;
    const vertical = x1 === x2 && y1 !== y2;
    if (!(horizontal !== vertical)) return fail("GEOMETRY_RECTANGLE_VERTEX_SET_INVALID");
  }

  const x_mm = exactMillimetres(minX);
  const y_mm = exactMillimetres(minY);
  const maxX_mm = exactMillimetres(maxX);
  const maxY_mm = exactMillimetres(maxY);
  if (x_mm === null || y_mm === null || maxX_mm === null || maxY_mm === null) {
    return fail("GEOMETRY_MM_PRECISION_NOT_REPRESENTABLE");
  }
  const width_mm = maxX_mm - x_mm;
  const depth_mm = maxY_mm - y_mm;
  if (width_mm <= 0 || depth_mm <= 0) return fail("GEOMETRY_RECTANGLE_DEGENERATE");

  return {
    ok: true,
    value: {
      kind: "EXTRUDED_RECTANGLE",
      profile: { width_mm, depth_mm, radius_mm: null },
      x_mm,
      y_mm,
      z_mm: input.baseElevation_mm,
      height_mm: input.verticalExtent_mm,
    },
  };
}
