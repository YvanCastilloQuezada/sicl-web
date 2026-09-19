import { generateHouseA21S1FloorPlan, type S1FloorPlan, type S1Point, type S1Polygon } from "./arkiConstructiveSpatialGeneration";
import type { SpatialRepresentation } from "./UPAO001SpatialViewer";

export type AuthoringElementKind = "SITE" | "BUILDING" | "LEVEL" | "SPACE" | "ZONE" | "WALL" | "PARTITION" | "DOOR" | "WINDOW" | "STAIR" | "SHAFT" | "ROUTE";
export type CanonicalBuildingElement = { arkiId: string; kind: AuthoringElementKind; level?: string; geometry?: unknown; properties: Record<string, unknown>; geometryVersion: string; lineage: string[]; provenance: string[]; epistemicState: "HYPOTHESIS" };
export type CanonicalBuildingModel = { projectId: string; modelVersion: string; maturity: "CONCEPTUAL"; elements: CanonicalBuildingElement[]; sourcePlanId: string; constructionDocumentation: "NOT_CLAIMED"; permitReady: false; constructionReady: false };
export type DrawingViewKind = "FLOOR_PLAN" | "SITE_PLAN" | "BUILDING_SECTION" | "EXTERIOR_ELEVATION";
export type DrawingView = { viewId: string; kind: DrawingViewKind; modelVersion: string; elementIds: string[]; annotations: Array<{ id: string; text: string; sourceElementId?: string }>; geometry: Array<{ elementId: string; type: "POLYGON" | "LINE"; coordinates: unknown }>; provenance: string[] };

export type ConstructiveDiscipline = "ARCHITECTURE" | "STRUCTURE" | "MEP";
export type ConstructiveReadinessState = "READY_WITH_OBSERVATIONS" | "REQUIRES_DATA" | "NOT_AVAILABLE";
export type ConstructiveCandidate = { id: string; kind: string; discipline: ConstructiveDiscipline; sourceElementIds: string[]; state: ConstructiveReadinessState; geometryAvailable: boolean; missingInputs: string[]; epistemicState: "HYPOTHESIS" };
export type ConstructiveReadiness = { state: ConstructiveReadinessState; candidates: ConstructiveCandidate[]; missingInputs: string[]; externalValidationRequired: string[]; claims: string[] };

export function deriveConstructiveReadiness(model: CanonicalBuildingModel): ConstructiveReadiness {
  const candidates: ConstructiveCandidate[] = [];
  const add = (kind: string, discipline: ConstructiveDiscipline, elements: CanonicalBuildingElement[], missingInputs: string[], state: ConstructiveReadinessState = "REQUIRES_DATA") => {
    if (elements.length) candidates.push({ id: model.projectId + ":CONSTRUCTIVE-" + kind, kind, discipline, sourceElementIds: elements.map((element) => element.arkiId), state, geometryAvailable: elements.every((element) => Boolean(element.geometry)), missingInputs, epistemicState: "HYPOTHESIS" });
  };
  add("WALL_AND_PARTITION_CANDIDATES", "ARCHITECTURE", model.elements.filter((element) => element.kind === "WALL" || element.kind === "PARTITION"), ["wall thickness", "wall height", "resolved adjacency", "material/assembly"]);
  add("DOOR_AND_WINDOW_CANDIDATES", "ARCHITECTURE", model.elements.filter((element) => element.kind === "DOOR" || element.kind === "WINDOW"), ["opening dimensions", "controlled family/type", "verified host wall geometry"]);
  add("STAIR_CANDIDATES", "ARCHITECTURE", model.elements.filter((element) => element.kind === "STAIR"), ["riser/tread dimensions", "landing rules", "clear width", "code verification"]);
  add("SHAFT_AND_SERVICE_RESERVATIONS", "MEP", model.elements.filter((element) => element.kind === "SHAFT"), ["system assignment", "equipment/duct dimensions", "discipline calculations"]);
  add("STRUCTURAL_COORDINATION_RESERVATION", "STRUCTURE", model.elements.filter((element) => element.kind === "SPACE"), ["structural grid", "loads", "material system", "structural analysis"], "NOT_AVAILABLE");
  return { state: candidates.length ? "REQUIRES_DATA" : "NOT_AVAILABLE", candidates, missingInputs: Array.from(new Set(candidates.flatMap((candidate) => candidate.missingInputs))), externalValidationRequired: ["DWG native round-trip", "Revit native/API round-trip", "MEP coordination", "structural analysis", "professional review"], claims: ["Candidates are derived from the existing CanonicalBuildingModel.", "No construction value or permit status is fabricated.", "All outputs remain HYPOTHESIS."] };
}

const polygon = (value: S1Polygon) => value.coordinates[0];
const version = "ARKI-AUTHORING-1";
const prov = ["ARKI canonical building authoring", "S1 conceptual floor plan", "same canonical model"];

export function buildCanonicalBuildingModel(plan: S1FloorPlan = generateHouseA21S1FloorPlan()): CanonicalBuildingModel {
  const elements: CanonicalBuildingElement[] = [];
  elements.push({ arkiId: `${plan.projectId}:BUILDING`, kind: "BUILDING", properties: { representation: plan.representationKind }, geometryVersion: version, lineage: [plan.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  for (const level of plan.levels) elements.push({ arkiId: `${plan.projectId}:LEVEL:${level}`, kind: "LEVEL", level, properties: {}, geometryVersion: version, lineage: [plan.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  for (const space of plan.spaces) elements.push({ arkiId: space.id, kind: "SPACE", level: space.levelId, geometry: space.boundary, properties: { programItemId: space.programItemId, zoneId: space.zoneId, areaM2: space.actualAreaM2 }, geometryVersion: version, lineage: [plan.id, space.id], provenance: [...prov, ...space.provenance], epistemicState: "HYPOTHESIS" });
  for (const wall of [...plan.walls, ...plan.partitions]) elements.push({ arkiId: wall.id, kind: wall.role === "PARTITION" ? "PARTITION" : "WALL", geometry: wall.segment, properties: { hostSpaceId: wall.hostSpaceId }, geometryVersion: version, lineage: [plan.id, wall.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  for (const opening of plan.openings) elements.push({ arkiId: opening.id, kind: opening.type, level: opening.levelId, geometry: opening.position, properties: { hostSpaceId: opening.hostSpaceId, relatedSpaceId: opening.relatedSpaceId, semanticRole: opening.semanticRole }, geometryVersion: version, lineage: [plan.id, opening.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  elements.push({ arkiId: plan.stair.id, kind: "STAIR", level: plan.stair.fromLevel, geometry: plan.stair.footprint, properties: { toLevel: plan.stair.toLevel, run: plan.stair.run }, geometryVersion: version, lineage: [plan.id, plan.stair.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  for (const shaft of plan.shafts) elements.push({ arkiId: shaft.id, kind: "SHAFT", geometry: shaft.shaft, properties: { kind: shaft.kind, levelIds: shaft.levelIds, dimensions: shaft.dimensions }, geometryVersion: version, lineage: [plan.id, shaft.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  for (const route of plan.routes) elements.push({ arkiId: route.id, kind: "ROUTE", level: route.levelId, geometry: route.path, properties: { routeKind: route.kind, continuity: route.continuity, compliance: route.compliance }, geometryVersion: version, lineage: [plan.id, route.id], provenance: prov, epistemicState: "HYPOTHESIS" });
  return { projectId: plan.projectId, modelVersion: version, maturity: "CONCEPTUAL", elements, sourcePlanId: plan.id, constructionDocumentation: "NOT_CLAIMED", permitReady: false, constructionReady: false };
}

function linePoints(value: unknown): S1Point[] { return Array.isArray(value) ? value.filter((p): p is S1Point => Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number") : []; }
function geomFor(element: CanonicalBuildingElement): { elementId: string; type: "POLYGON" | "LINE"; coordinates: unknown } | undefined {
  if (!element.geometry) return undefined;
  if ((element.kind === "SPACE" || element.kind === "STAIR" || element.kind === "SHAFT") && (element.geometry as S1Polygon).type === "polygon") return { elementId: element.arkiId, type: "POLYGON", coordinates: polygon(element.geometry as S1Polygon) };
  const points = linePoints(element.kind === "ROUTE" ? (element.geometry as { coordinates: S1Point[] }).coordinates : element.geometry);
  return points.length >= 2 ? { elementId: element.arkiId, type: "LINE", coordinates: points } : undefined;
}

export function deriveDrawingViews(model: CanonicalBuildingModel): DrawingView[] {
  const spaces = model.elements.filter((e) => e.kind === "SPACE");
  const geometry = model.elements.map(geomFor).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const ids = model.elements.map((e) => e.arkiId);
  const annotations = spaces.map((space) => ({ id: `${space.arkiId}:TAG`, text: `${space.properties.programItemId ?? space.arkiId} · ${space.properties.areaM2 ?? "UNKNOWN"} m²`, sourceElementId: space.arkiId }));
  return [
    { viewId: `${model.projectId}:VIEW:FLOOR_PLAN:N1`, kind: "FLOOR_PLAN", modelVersion: model.modelVersion, elementIds: spaces.filter((e) => e.level === "N1").map((e) => e.arkiId), annotations: annotations.filter((a) => model.elements.find((e) => e.arkiId === a.sourceElementId)?.level === "N1"), geometry: geometry.filter((g) => model.elements.find((e) => e.arkiId === g.elementId)?.level === "N1"), provenance: [...prov, "derived drawing view"] },
    { viewId: `${model.projectId}:VIEW:SITE_PLAN`, kind: "SITE_PLAN", modelVersion: model.modelVersion, elementIds: ids, annotations: [{ id: `${model.projectId}:NORTH`, text: "NORTH — derived from project orientation" }], geometry, provenance: [...prov, "derived site view"] },
    { viewId: `${model.projectId}:VIEW:SECTION`, kind: "BUILDING_SECTION", modelVersion: model.modelVersion, elementIds: ids.filter((id) => id.includes("STAIR") || id.includes("SHAFT") || id.includes("LEVEL")), annotations: [{ id: `${model.projectId}:SECTION_NOTE`, text: "Conceptual section; unmodeled assemblies remain UNKNOWN" }], geometry: [], provenance: [...prov, "section evidence limited to available vertical reservations"] },
    { viewId: `${model.projectId}:VIEW:ELEVATION`, kind: "EXTERIOR_ELEVATION", modelVersion: model.modelVersion, elementIds: ids.filter((id) => id.includes("WINDOW") || id.includes("LEVEL")), annotations: [{ id: `${model.projectId}:ELEVATION_NOTE`, text: "Conceptual elevation; facade materials remain UNKNOWN" }], geometry: [], provenance: [...prov, "elevation evidence limited to available openings and levels"] },
  ];
}

export function drawingViewToSvg(view: DrawingView): string {
  const polygons = view.geometry.filter((g) => g.type === "POLYGON").map((g) => `<polygon data-arki-id="${g.elementId}" points="${(g.coordinates as S1Point[]).map((p) => p.join(",")).join(" ")}" fill="none" stroke="#16324f" stroke-width="0.08"/>`).join("");
  const lines = view.geometry.filter((g) => g.type === "LINE").map((g) => `<polyline data-arki-id="${g.elementId}" points="${(g.coordinates as S1Point[]).map((p) => p.join(",")).join(" ")}" fill="none" stroke="#7c3aed" stroke-width="0.12"/>`).join("");
  const text = view.annotations.map((a) => `<text data-arki-id="${a.id}" x="0" y="0" font-size="0.35">${a.text}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" data-view-id="${view.viewId}" data-model-version="${view.modelVersion}" data-maturity="CONCEPTUAL" role="img"><title>${view.kind} — CONCEPTUAL</title>${polygons}${lines}${text}<metadata>PROVENANCE=${view.provenance.join(";")}; PERMIT_READY=FALSE; CONSTRUCTION_READY=FALSE</metadata></svg>`;
}

export function spatialRepresentationToGeoJson(rep: SpatialRepresentation) {
  return { type: "FeatureCollection", features: rep.elements.map((element) => ({ type: "Feature", id: element.id, geometry: { type: element.geometry.type, coordinates: element.geometry.coordinates }, properties: { element_id: element.id, element_type: element.element_type, project_id: rep.alternative_id, model_version: rep.representation_version, units: rep.units, crs: rep.coordinate_system, provenance: "ARKI SpatialRepresentation; synthetic analytical geometry" } })), metadata: { project_id: rep.alternative_id, model_version: rep.representation_version, crs: rep.coordinate_system, units: rep.units, provenance: "ARKI SpatialRepresentation", uncertainty: "Synthetic educational representation; not surveyed" } };
}

export function validateAuthoringIdentity(model: CanonicalBuildingModel, views: DrawingView[]): boolean { return model.elements.length > 0 && model.elements.every((e) => e.arkiId && e.geometryVersion === model.modelVersion && e.provenance.length > 0) && views.every((view) => view.modelVersion === model.modelVersion && view.provenance.length > 0 && view.elementIds.every((id) => model.elements.some((e) => e.arkiId === id)));
}
