import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";

export type ArchitecturalSpaceGeometryObservation = {
  spaceId: string;
  programItemId: string;
  spatialElementId: string;
  spatialZoneId: string;
  geometryType: string;
  hasBoundedGeometry: boolean;
  boundaryStatus: "EXPLICIT_BOUNDARY" | "DERIVED_BOUNDARY" | "UNKNOWN";
  actualArea?: number;
  coordinateSystem: string;
  units: string;
  levelReference?: string;
  parentId?: string;
  provenance: string[];
  epistemicStatus: "OBSERVED" | "UNKNOWN";
  realizationStatus: "GEOMETRICALLY_REALIZED" | "UNKNOWN";
};

const objectRecord = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const polygonPoints = (element: SpatialElement): Array<[number, number]> => { const coordinates = element.geometry.coordinates; const walk = (value: unknown): Array<[number, number]> => Array.isArray(value) ? value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number" ? [[value[0], value[1]]] : value.flatMap(walk) : []; return walk(coordinates); };
const boundedArea = (element: SpatialElement): number | undefined => { if (!['polygon', 'multipolygon'].includes(element.geometry.type)) return undefined; const points = polygonPoints(element); if (points.length < 3) return undefined; let sum = 0; for (let index = 0; index < points.length; index += 1) { const left = points[index]; const right = points[(index + 1) % points.length]; sum += left[0] * right[1] - right[0] * left[1]; } const result = Math.abs(sum) / 2; return Number.isFinite(result) && result > 0 ? result : undefined; };
const isClosed = (element: SpatialElement): boolean => { const points = polygonPoints(element); return points.length >= 4 && points[0][0] === points[points.length - 1][0] && points[0][1] === points[points.length - 1][1]; };

/** Only explicit ASI-G1 metadata marks a zone as architectural-space geometry. */
export function isExplicitArchitecturalSpaceElement(element: SpatialElement): boolean { const metadata = objectRecord(element.metadata); return metadata.space_role === "architectural_space" && typeof metadata.space_id === "string" && typeof metadata.program_item_id === "string"; }

export function readArchitecturalSpaceGeometry(representation: SpatialRepresentation): ArchitecturalSpaceGeometryObservation[] {
  return representation.elements.filter(isExplicitArchitecturalSpaceElement).map((element) => {
    const metadata = objectRecord(element.metadata); const rawArea = boundedArea(element); const valid = element.geometry.type === "polygon" && isClosed(element) && rawArea !== undefined; const area = valid ? rawArea : undefined;
    const provenance = ["actual SpatialRepresentation", `SpatialElement[${element.id}]`, String(metadata.geometry_provenance ?? "UNKNOWN")];
    return { spaceId: String(metadata.space_id), programItemId: String(metadata.program_item_id), spatialElementId: element.id, spatialZoneId: element.id, geometryType: element.geometry.type, hasBoundedGeometry: valid, boundaryStatus: valid ? (metadata.boundary_status === "VERIFIED_BOUNDARY" ? "DERIVED_BOUNDARY" : "EXPLICIT_BOUNDARY") : "UNKNOWN", ...(area === undefined ? {} : { actualArea: area }), coordinateSystem: representation.coordinate_system, units: representation.units, ...(element.level === undefined || element.level === null ? {} : { levelReference: `LEVEL_${element.level}` }), ...(element.parent_id ? { parentId: element.parent_id } : {}), provenance, epistemicStatus: valid ? "OBSERVED" : "UNKNOWN", realizationStatus: valid ? "GEOMETRICALLY_REALIZED" : "UNKNOWN" };
  });
}

export function validateArchitecturalSpaceGeometry(element: SpatialElement): { valid: boolean; reason?: string } { if (!isExplicitArchitecturalSpaceElement(element)) return { valid: false, reason: "EXPLICIT_ARCHITECTURAL_SPACE_METADATA_REQUIRED" }; if (element.geometry.type !== "polygon") return { valid: false, reason: "BOUNDED_POLYGON_REQUIRED" }; if (!isClosed(element)) return { valid: false, reason: "POLYGON_MUST_BE_CLOSED" }; if (boundedArea(element) === undefined) return { valid: false, reason: "NON_ZERO_AREA_REQUIRED" }; return { valid: true }; }
