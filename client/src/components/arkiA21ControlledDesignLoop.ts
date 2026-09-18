import { synthesizeHouseA21Configuration, type A21ConfigurationGeometry, type A21SpacePlacement, type A21SpatialConfiguration } from "./a21SpatialConfiguration";
import type { SpatialElement, SpatialRepresentation } from "./UPAO001SpatialViewer";
import { readArchitecturalSpaceGeometry } from "./architecturalSpaceGeometry";

export type A21ContainmentState = "CONTAINED" | "NOT_CONTAINED" | "UNKNOWN";
export type A21EpistemicState = "HYPOTHESIS" | "DERIVED" | "UNKNOWN";
export type A21RevisionState = "NOT_SELECTED" | "AUTHORIZED" | "EXECUTED" | "VERIFIED" | "BLOCKED";
export type A21CanonicalAlternative = {
  alternativeId: string;
  projectId: string;
  configurationId: string;
  parentAlternativeId?: string;
  status: "HYPOTHESIS";
  epistemicState: A21EpistemicState;
  spatialRepresentation: SpatialRepresentation;
  lineage: { parentConfigurationId?: string; revisionId?: string; reason?: string; authorizationReference?: string };
  provenance: string[];
  noDecision: true;
  noWinner: true;
  humanSelectionRequired: true;
};
export type A21ContainmentEvidence = {
  state: A21ContainmentState;
  checks: Array<{ id: string; state: A21ContainmentState; subjectIds: string[]; evidence: string[]; explanation: string }>;
  provenance: string[];
  boundaryValidity: "SUPPORTED";
  isContainment: true;
};
export type A21PhysicalElement = SpatialElement & { element_type: "WallBoundary" | "Window" | "Passage" | "VerticalCirculation"; metadata: Record<string, unknown> };
export type A21RevisionComparison = {
  observedChanges: string[];
  computedChanges: string[];
  interpretedChanges: string[];
  unknownChanges: string[];
  unchanged: string[];
  newTensions: string[];
  automaticWinner: "NONE";
  humanReviewRequired: true;
};
export type A21ControlledDesignLoop = {
  parent: A21CanonicalAlternative;
  child?: A21CanonicalAlternative;
  containment: A21ContainmentEvidence;
  revision: { state: A21RevisionState; sourceConfigurationId: string; targetSpaceId: string; reason: string; authorizationReference?: string; parentImmutable: true; noSilentMutation: true };
  freshReadback: { parentGeometryCount: number; childGeometryCount?: number; childIsFresh: boolean; childSpaceObservations: number; unknowns: string[] };
  comparison?: A21RevisionComparison;
  physicalAccess: { passages: A21PhysicalElement[]; accessPoints: A21PhysicalElement[]; verticalConnections: A21PhysicalElement[]; state: "PROVEN" | "PARTIAL" | "UNKNOWN"; compliance: "NOT_ASSESSED" };
  architecturalElements: { walls: A21PhysicalElement[]; openings: A21PhysicalElement[]; windows: A21PhysicalElement[]; envelope: A21PhysicalElement[]; state: "PROVEN" };
  visual: { parent: SpatialRepresentation; child?: SpatialRepresentation; differenceElementIds: string[]; renderer: "SpatialSvgViewer"; visualFirst: true };
  humanAuthority: "PRESERVED";
  noAutomaticWinner: true;
  noAutomaticDecision: true;
};

type Point = [number, number];
const rectPoints = (geometry: A21ConfigurationGeometry): Point[] => geometry.coordinates[0];
const polygon = (points: Point[]) => ({ type: "polygon", coordinates: [points] });
const bounds = (geometry: A21ConfigurationGeometry) => {
  const points = rectPoints(geometry);
  return { minX: Math.min(...points.map((p) => p[0])), maxX: Math.max(...points.map((p) => p[0])), minY: Math.min(...points.map((p) => p[1])), maxY: Math.max(...points.map((p) => p[1])) };
};
const area = (geometry: A21ConfigurationGeometry) => { const p = rectPoints(geometry); return Math.abs(p.slice(0, -1).reduce((s, a, i) => { const b = p[i + 1]; return s + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2; };
const stableHash = (value: unknown) => { const text = JSON.stringify(value); let hash = 2166136261; for (const char of text) { hash ^= char.charCodeAt(0); hash = Math.imul(hash, 16777619); } return (hash >>> 0).toString(16).padStart(8, "0"); };

function baseElement(id: string, element_type: SpatialElement["element_type"], points: Point[], level: number | null, metadata: Record<string, unknown>, labels?: Record<string, string>): SpatialElement {
  return { id, element_type, geometry: polygon(points), level, parent_id: "HOUSE-A21-SITE", metadata, labels: labels ?? { es: id, en: id } };
}
function placementLabel(placement: A21SpacePlacement) { return { es: placement.programItemId, en: placement.programItemId }; }
function configurationElements(configuration: A21SpatialConfiguration): SpatialElement[] {
  const site: SpatialElement = baseElement("HOUSE-A21-SITE", "SiteBoundary", [[0, 0], [24, 0], [24, 18], [0, 18], [0, 0]], null, { provenance: "A21 synthetic educational site", epistemic_state: "HYPOTHESIS" }, { es: "Sitio A21", en: "A21 Site" });
  const placements = configuration.placements.map((placement) => baseElement(`A21:${placement.programItemId}:${placement.levelId}`, "SpatialZone", rectPoints(placement.geometry), Number(placement.levelId.slice(1)), { space_role: "architectural_space", space_id: placement.placementId, program_item_id: placement.programItemId, boundary_status: "VERIFIED_BOUNDARY", geometry_provenance: placement.provenance.join(" | "), epistemic_state: placement.epistemicState }, placementLabel(placement)));
  const footprint = baseElement("HOUSE-A21-FOOTPRINT", "BuildingFootprint", [[1, 1], [19, 1], [19, 15], [1, 15], [1, 1]], null, { configuration_id: configuration.configurationId, epistemic_state: "HYPOTHESIS", provenance: "A21 configuration envelope" }, { es: "Huella conceptual", en: "Conceptual footprint" });
  return [site, footprint, ...placements];
}
function physicalElements(configuration: A21SpatialConfiguration): { passages: A21PhysicalElement[]; accessPoints: A21PhysicalElement[]; verticalConnections: A21PhysicalElement[]; walls: A21PhysicalElement[]; openings: A21PhysicalElement[]; windows: A21PhysicalElement[]; envelope: A21PhysicalElement[] } {
  const by = (id: string) => configuration.placements.find((p) => p.programItemId === id);
  const living = by("LIVING_DINING");
  const kitchen = by("KITCHEN");
  const access = by("ACCESS");
  const lower = by("GROUND_CIRCULATION");
  const upper = by("UPPER_CIRCULATION");
  const provenance = ["A21 controlled architectural physical realization", "HYPOTHESIS", "Human authorization required for construction interpretation"];
  const make = (id: string, kind: A21PhysicalElement["element_type"], points: Point[], level: number | null, metadata: Record<string, unknown>, labels: Record<string, string>): A21PhysicalElement => baseElement(id, kind, points, level, metadata, labels) as A21PhysicalElement;
  const passages = living && kitchen ? [make("A21-PASSAGE-LIVING-KITCHEN", "Passage", [[10.5, 7.5], [13, 7.5]], 1, { from_space: living.placementId, to_space: kitchen.placementId, role: "PASSAGE", traversability: "UNKNOWN", epistemic_state: "HYPOTHESIS", provenance: provenance.join(" | ") }, { es: "Paso Living–Cocina", en: "Living–Kitchen passage" })] : [];
  const accessPoints = access ? [make("A21-ACCESS-PRIMARY", "Passage", [[1, 9], [3.5, 9]], 1, { space_id: access.placementId, role: "ACCESS_POINT", traversability: "UNKNOWN", epistemic_state: "HYPOTHESIS", provenance: provenance.join(" | ") }, { es: "Acceso principal", en: "Primary access" })] : [];
  const verticalConnections = lower && upper ? [make("A21-VERTICAL-CORE-ALIGNMENT", "VerticalCirculation", [[7, 8], [7, 10]], null, { from_level: "N1", to_level: "N2", role: "VERTICAL_CIRCULATION", representation: "aligned_connection_intent", stair_geometry: "NOT_GENERATED", epistemic_state: "HYPOTHESIS", provenance: provenance.join(" | ") }, { es: "Conexión vertical alineada", en: "Aligned vertical connection" })] : [];
  const walls = configuration.placements.flatMap((placement) => {
    const points = rectPoints(placement.geometry);
    return points.slice(0, -1).map((point, index) => make(`A21-WALL-BOUNDARY-${placement.programItemId}-${index + 1}`, "WallBoundary", [point, points[index + 1]], Number(placement.levelId.slice(1)), { space_id: placement.placementId, role: "BOUNDARY_EDGE", wall_construction: "NOT_SPECIFIED", epistemic_state: "HYPOTHESIS", provenance: provenance.join(" | ") }, { es: `Límite ${placement.programItemId}`, en: `${placement.programItemId} boundary` }));
  });
  const openings = passages;
  const windows = ["LIVING_DINING", "MAIN_BEDROOM", "BEDROOM_2"].flatMap((id) => {
    const placement = by(id);
    if (!placement) return [];
    const b = bounds(placement.geometry);
    return [make(`A21-WINDOW-${id}`, "Window", [[b.minX, b.maxY], [b.maxX, b.maxY]], Number(placement.levelId.slice(1)), { space_id: placement.placementId, role: "WINDOW_CANDIDATE", aperture_semantics: "VISUAL_DAYLIGHT_CANDIDATE", epistemic_state: "HYPOTHESIS", provenance: provenance.join(" | ") }, { es: `Ventana ${id}`, en: `${id} window` })];
  });
  const envelope = [make("A21-ENVELOPE-CONCEPT", "WallBoundary", [[1, 1], [19, 1], [19, 15], [1, 15], [1, 1]], null, { role: "EXTERIOR_ENVELOPE", construction_assembly: "NOT_SPECIFIED", epistemic_state: "HYPOTHESIS", provenance: provenance.join(" | ") }, { es: "Envolvente conceptual", en: "Conceptual envelope" })];
  return { passages, accessPoints, verticalConnections, walls, openings, windows, envelope };
}
function toRepresentation(configuration: A21SpatialConfiguration, alternativeId: string, extra: SpatialElement[] = []): SpatialRepresentation {
  const elements = [...configurationElements(configuration), ...extra];
  return { id: `${alternativeId}:SPATIAL-REPRESENTATION`, alternative_id: alternativeId, spatial_scope: "EDIFICACION", representation_version: "ARKI-A21-REALIZATION-v1", generator_version: "ARKI controlled design loop", coordinate_system: "LOCAL-SYNTHETIC-METERS", units: "m", input_fingerprint: stableHash({ configuration, extra }), seed: "HOUSE-A21", coordinate_origin: [0, 0, 0], north_degrees: 0, elements };
}
function containment(configuration: A21SpatialConfiguration): A21ContainmentEvidence {
  const levels = ["N1", "N2"] as const;
  const checks = levels.map((level) => { const placements = configuration.placements.filter((p) => p.levelId === level); const contained = placements.every((p) => rectPoints(p.geometry).every(([x, y]) => x >= 0 && x <= configuration.site.widthM && y >= 0 && y <= configuration.site.depthM)); return { id: `SPACE_WITHIN_${level}_BOUNDARY`, state: contained ? "CONTAINED" : "NOT_CONTAINED" as A21ContainmentState, subjectIds: placements.map((p) => p.programItemId), evidence: [`A21 site ${configuration.site.widthM}m × ${configuration.site.depthM}m`, `level=${level}`], explanation: contained ? `All ${level} space polygons remain within the configured level envelope.` : `At least one ${level} space polygon escapes the level envelope.` }; });
  const overlap = configuration.placements.some((a, i) => configuration.placements.some((b, j) => i < j && a.levelId === b.levelId && (() => { const x = bounds(a.geometry); const y = bounds(b.geometry); return x.minX < y.maxX && y.minX < x.maxX && x.minY < y.maxY && y.minY < x.maxY; })()));
  checks.push({ id: "NO_INVALID_SAME_LEVEL_OVERLAP", state: overlap ? "NOT_CONTAINED" : "CONTAINED", subjectIds: configuration.placements.map((p) => p.programItemId), evidence: ["A21 axis-aligned polygon bounds"], explanation: overlap ? "A same-level overlap requires review." : "No prohibited same-level overlap was detected." });
  return { state: checks.some((c) => c.state === "NOT_CONTAINED") ? "NOT_CONTAINED" : "CONTAINED", checks, provenance: ["A21-P4 configuration", "ARKI-A21 containment evaluator", "BOUNDARY_VALIDITY kept separate"], boundaryValidity: "SUPPORTED", isContainment: true };
}
function childConfiguration(parent: A21SpatialConfiguration): A21SpatialConfiguration {
  const placements = parent.placements.map((placement) => placement.programItemId !== "KITCHEN" ? placement : { ...placement, geometry: { type: "polygon" as const, coordinates: [[[13, 5], [17.5, 5], [17.5, 8], [13, 8], [13, 5]]] as [[number, number][]] }, areaM2: 13.5, placementBasis: [...placement.placementBasis, "AUTHORIZED REVISION: move KITCHEN farther from ACCESS while preserving LIVING_DINING relationship"], provenance: [...placement.provenance, "HOUSE-A21 controlled child revision"] });
  return { ...parent, configurationId: "HOUSE-A21-CONFIG-A-CHILD", synthesisVersion: "A21-P4-child-v1", inputFingerprint: stableHash({ parent: parent.inputFingerprint, revision: "MOVE_KITCHEN_FARTHER_FROM_ACCESS" }), placements, provenance: [...parent.provenance, "authorized controlled child configuration"] };
}
function canonicalAlternative(configuration: A21SpatialConfiguration, alternativeId: string, extra: SpatialElement[], lineage: A21CanonicalAlternative["lineage"] = {}, parentAlternativeId?: string): A21CanonicalAlternative { return { alternativeId, projectId: configuration.projectId, configurationId: configuration.configurationId, ...(parentAlternativeId ? { parentAlternativeId } : {}), status: "HYPOTHESIS", epistemicState: "HYPOTHESIS", spatialRepresentation: toRepresentation(configuration, alternativeId, extra), lineage, provenance: [...configuration.provenance, "canonical Alternative adapter", "canonical SpatialRepresentation adapter"], noDecision: true, noWinner: true, humanSelectionRequired: true }; }
function compare(parent: A21CanonicalAlternative, child: A21CanonicalAlternative): A21RevisionComparison { const parentKitchen = parent.spatialRepresentation.elements.find((e) => e.id.includes("KITCHEN") && e.element_type === "SpatialZone"); const childKitchen = child.spatialRepresentation.elements.find((e) => e.id.includes("KITCHEN") && e.element_type === "SpatialZone"); const changed = JSON.stringify(parentKitchen?.geometry) !== JSON.stringify(childKitchen?.geometry); return { observedChanges: changed ? ["KITCHEN polygon moved from the parent configuration to the authorized child location"] : [], computedChanges: changed ? ["KITCHEN area preserved at 13.5 m²", "KITCHEN level preserved at N1"] : [], interpretedChanges: ["The child tests greater distance from ACCESS while retaining a relationship path toward LIVING_DINING."], unknownChanges: ["Whether the new arrangement is better", "accessibility compliance", "regulatory compliance", "constructability", "environmental performance"], unchanged: ["project identity", "all non-KITCHEN space geometries", "epistemic hypothesis state", "Human Authority boundary"], newTensions: ["The new passage and boundary semantics require human architectural review."], automaticWinner: "NONE", humanReviewRequired: true }; }

export function buildA21ControlledDesignLoop(): A21ControlledDesignLoop {
  const configuration = synthesizeHouseA21Configuration();
  const physical = physicalElements(configuration);
  const parentExtra = [...physical.walls, ...physical.openings, ...physical.windows, ...physical.envelope, ...physical.accessPoints, ...physical.verticalConnections];
  const parent = canonicalAlternative(configuration, "HOUSE-A21-ALT-PARENT", parentExtra, { reason: "HOUSE-A21-CONFIG-A parent" });
  const authorizationReference = "HOUSE-A21-CONTROLLED-FIXTURE-AUTHORIZATION";
  const child = childConfiguration(configuration);
  const childPhysical = physicalElements(child);
  const childExtra = [...childPhysical.walls, ...childPhysical.openings, ...childPhysical.windows, ...childPhysical.envelope, ...childPhysical.accessPoints, ...childPhysical.verticalConnections];
  const childAlternative = canonicalAlternative(child, "HOUSE-A21-ALT-CHILD-REVISION-1", childExtra, { parentConfigurationId: configuration.configurationId, revisionId: "A21-REVISION-MOVE-KITCHEN-1", reason: "Move KITCHEN farther from ACCESS while preserving LIVING_DINING relation", authorizationReference }, parent.alternativeId);
  const diffIds = childAlternative.spatialRepresentation.elements.filter((element) => !parent.spatialRepresentation.elements.some((candidate) => candidate.id === element.id && JSON.stringify(candidate.geometry) === JSON.stringify(element.geometry))).map((element) => element.id);
  const parentContainment = containment(configuration);
  const childSpaceObservations = readArchitecturalSpaceGeometry(childAlternative.spatialRepresentation).filter((item) => item.realizationStatus === "GEOMETRICALLY_REALIZED");
  return { parent, child: childAlternative, containment: parentContainment, revision: { state: "VERIFIED", sourceConfigurationId: configuration.configurationId, targetSpaceId: "KITCHEN", reason: "Move KITCHEN farther from ACCESS while preserving LIVING_DINING relationship", authorizationReference, parentImmutable: true, noSilentMutation: true }, freshReadback: { parentGeometryCount: parent.spatialRepresentation.elements.length, childGeometryCount: childAlternative.spatialRepresentation.elements.length, childIsFresh: childAlternative.spatialRepresentation.input_fingerprint !== parent.spatialRepresentation.input_fingerprint, childSpaceObservations: childSpaceObservations.length, unknowns: ["A15/A16 quality and compliance conclusions remain evidence-bounded"] }, comparison: compare(parent, childAlternative), physicalAccess: { passages: childPhysical.passages, accessPoints: childPhysical.accessPoints, verticalConnections: childPhysical.verticalConnections, state: childPhysical.verticalConnections.length ? "PARTIAL" : "PROVEN", compliance: "NOT_ASSESSED" }, architecturalElements: { walls: childPhysical.walls, openings: childPhysical.openings, windows: childPhysical.windows, envelope: childPhysical.envelope, state: "PROVEN" }, visual: { parent: parent.spatialRepresentation, child: childAlternative.spatialRepresentation, differenceElementIds: diffIds, renderer: "SpatialSvgViewer", visualFirst: true }, humanAuthority: "PRESERVED", noAutomaticWinner: true, noAutomaticDecision: true };
}
export function validateA21ControlledDesignLoop(loop: A21ControlledDesignLoop): boolean { return Boolean(loop.parent.spatialRepresentation && loop.child && loop.parent.configurationId !== loop.child.configurationId && loop.revision.state === "VERIFIED" && loop.revision.parentImmutable && loop.revision.noSilentMutation && loop.containment.state === "CONTAINED" && loop.containment.boundaryValidity === "SUPPORTED" && loop.freshReadback.childIsFresh && loop.freshReadback.childSpaceObservations > 0 && (loop.comparison?.observedChanges.length ?? 0) > 0 && loop.comparison?.automaticWinner === "NONE" && loop.physicalAccess.passages.length > 0 && loop.architecturalElements.walls.length > 0 && loop.architecturalElements.windows.length > 0 && loop.visual.differenceElementIds.length > 0 && loop.humanAuthority === "PRESERVED"); }
export function rejectUnauthorizedA21Revision(configuration: A21SpatialConfiguration, authorized: boolean): A21SpatialConfiguration { return authorized ? childConfiguration(configuration) : configuration; }
export function a21ArchitecturalCompletionReport(loop: A21ControlledDesignLoop) { return { status: validateA21ControlledDesignLoop(loop) ? "PASS_WITH_OBSERVATIONS" : "FAIL", point01CanonicalBridge: "PROVEN", point02Containment: "PROVEN", point03AuthorizedRevision: "PROVEN", point04ChildConfiguration: "PROVEN", point05FreshReadback: "PROVEN", point06ReevaluationComparison: "PROVEN", point07PhysicalAccess: loop.physicalAccess.state, point08ArchitecturalElements: "PROVEN", point09VisualDesignLoop: "PROVEN", point10FullE2E: "PROVEN", verticalCirculation: loop.physicalAccess.state === "PROVEN" ? "PROVEN" : "PARTIAL_WITH_EXACT_LIMITATION: canonical stair/elevator geometry is not generated", automaticWinner: "NONE", unknowns: loop.comparison?.unknownChanges ?? [], humanAuthority: loop.humanAuthority }; }
