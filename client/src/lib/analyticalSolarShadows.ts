import type { SpatialElement, SpatialRepresentation } from "../components/UPAO001SpatialViewer";

export type Point2 = [number, number];

export type AnalyticalShadow = {
  alternativeId: string;
  massId: string;
  polygon: Point2[];
  length: number;
  azimuthDegrees: number;
  elevationDegrees: number;
};

export type AnalyticalShadowResult = {
  status: "AVAILABLE" | "NO_DIRECT_SOLAR_SHADOW";
  shadows: AnalyticalShadow[];
  direction: Point2;
  lengthForHeight: (height: number) => number;
};

function numeric(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function ringFromElement(element: SpatialElement): Point2[] {
  const coordinates = element.geometry.coordinates;
  if (element.geometry.type === "volume" && Array.isArray(coordinates)) {
    const vertices = coordinates.filter((point): point is number[] => Array.isArray(point) && point.every(numeric));
    const half = Math.floor(vertices.length / 2);
    return vertices.slice(0, half).map((point) => [point[0], point[1]] as Point2);
  }
  if (element.geometry.type === "polygon" && Array.isArray(coordinates) && Array.isArray(coordinates[0])) {
    return coordinates[0].filter((point): point is Point2 => Array.isArray(point) && numeric(point[0]) && numeric(point[1]));
  }
  return [];
}

/**
 * LOCAL_ENU convention: x=east, y=north, z=up. Solar azimuth is clockwise
 * from north. A shadow projects opposite the horizontal sun vector.
 */
export function analyticalSolarShadows(
  representation: SpatialRepresentation,
  azimuthDegrees: number,
  elevationDegrees: number,
): AnalyticalShadowResult {
  const azimuthRadians = (azimuthDegrees * Math.PI) / 180;
  const direction: Point2 = [-Math.sin(azimuthRadians), -Math.cos(azimuthRadians)];
  const safeElevation = Math.max(elevationDegrees, 0.001);
  const lengthForHeight = (height: number) => height / Math.tan((safeElevation * Math.PI) / 180);
  if (!Number.isFinite(elevationDegrees) || elevationDegrees <= 0) {
    return { status: "NO_DIRECT_SOLAR_SHADOW", shadows: [], direction, lengthForHeight };
  }

  const shadows = representation.elements.flatMap((element) => {
    if (element.element_type !== "BuildingMass") return [];
    const ring = ringFromElement(element);
    const height = Number(element.metadata?.height);
    if (ring.length < 3 || !Number.isFinite(height) || height <= 0) return [];
    const length = lengthForHeight(height);
    return [{
      alternativeId: representation.alternative_id,
      massId: element.id,
      polygon: [...ring, ...ring.map(([x, y]) => [x + direction[0] * length, y + direction[1] * length] as Point2)],
      length,
      azimuthDegrees,
      elevationDegrees,
    }];
  });
  return { status: "AVAILABLE", shadows, direction, lengthForHeight };
}

export function shadowDirectionLabel(azimuthDegrees: number): string {
  return `opposite solar azimuth ${azimuthDegrees.toFixed(1)}°`;
}

export function preservesRepresentation(representation: SpatialRepresentation, before: string): boolean {
  return JSON.stringify(representation) === before;
}
