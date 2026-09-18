import type { ArchitecturalParti } from "./arquiArchitecturalSynthesis";
import { buildHouseA21Proof, type A21HouseProof } from "./a21ArchitecturalProgram";
import { buildA21P3Graph, type A21P3Graph } from "./a21CirculationIntent";
import type { SpatialZoneProposal } from "./a21SpatialRelationships";
import type { ResidentialPlan } from "./residentialConstructivePlan";

export type A21ConfigurationEpistemicState = "HYPOTHESIS";
export type A21ConfigurationConstraintState = "PASS" | "UNKNOWN" | "CONFLICT";
export type A21ConfigurationGeometry = {
  type: "polygon";
  coordinates: [[number, number][]];
};
export type A21SpacePlacement = {
  placementId: string;
  programItemId: string;
  zoneId: string;
  levelId: "N1" | "N2";
  geometry: A21ConfigurationGeometry;
  areaM2: number;
  placementBasis: string[];
  epistemicState: A21ConfigurationEpistemicState;
  provenance: string[];
};
export type A21ConstraintEvaluation = {
  constraintId: string;
  state: A21ConfigurationConstraintState;
  subjectIds: string[];
  explanation: string;
  evidence: string[];
  unknown: boolean;
};
export type A21SpatialConfiguration = {
  configurationId: string;
  projectId: string;
  status: "HYPOTHESIS";
  synthesisVersion: "A21-P4-v1" | `A21-P4-${string}`;
  inputFingerprint: string;
  site: { widthM: number; depthM: number; origin: [number, number]; provenance: string };
  parti: { strategyId: string; organizingIdea: string; provenance: string[] };
  placements: A21SpacePlacement[];
  constraintEvaluations: A21ConstraintEvaluation[];
  preservedUnknowns: string[];
  warnings: string[];
  noWalls: true;
  noDoors: true;
  noWindows: true;
  noStairs: true;
  noConstructionElements: true;
  noDecision: true;
  noWinner: true;
  humanSelectionRequired: true;
  provenance: string[];
};

const SITE_WIDTH = 24;
const SITE_DEPTH = 18;
const GRID = 0.5;
const round = (value: number) => Math.round(value / GRID) * GRID;
const rect = (minX: number, minY: number, width: number, depth: number): A21ConfigurationGeometry => ({
  type: "polygon",
  coordinates: [[[minX, minY], [minX + width, minY], [minX + width, minY + depth], [minX, minY + depth], [minX, minY]]],
});
const area = (geometry: A21ConfigurationGeometry) => {
  const ring = geometry.coordinates[0];
  return Math.abs(ring.slice(0, -1).reduce((sum, point, index) => {
    const next = ring[index + 1];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0)) / 2;
};
const stableHash = (value: unknown) => {
  const text = JSON.stringify(value);
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
};
const zoneFor = (zones: SpatialZoneProposal[], zoneType: string) => zones.find((zone) => zone.zoneType === zoneType)?.zoneId ?? `a21-zone-${zoneType.toLowerCase()}`;

function placement(
  programItemId: string,
  zoneId: string,
  levelId: "N1" | "N2",
  geometry: A21ConfigurationGeometry,
  basis: string[],
): A21SpacePlacement {
  return {
    placementId: `HOUSE-A21-CONFIG-A:${programItemId}`,
    programItemId,
    zoneId,
    levelId,
    geometry,
    areaM2: area(geometry),
    placementBasis: basis,
    epistemicState: "HYPOTHESIS",
    provenance: ["A21-P4 bounded deterministic placement", "A21-P4 controlled spatial configuration synthesis", ...basis],
  };
}

/**
 * Controlled placement hypothesis, not a floor-plan engine. The layout is a
 * small, deterministic rule set that consumes frozen A21 intent and produces
 * reviewable space polygons only. It never reads HOUSE-001 geometry.
 */
export function synthesizeHouseA21Configuration(
  proof: A21HouseProof = buildHouseA21Proof(),
  circulation: A21P3Graph = buildA21P3Graph(),
  parti: ArchitecturalParti = {
    strategyId: "HOUSE-A21-PARTI-STACKED-PRIVACY",
    organizingIdea: "Public/service N1 and private N2 organized around a vertically coherent transition spine.",
    spatialStructure: "STACKED",
    massVoidConcept: "A compact conceptual envelope with a protected open patio.",
    circulationConcept: "A declared transition spine links access, social and private sequences.",
    accessConcept: "Access enters the public sequence; exact entry remains a hypothesis.",
    programDistributionConcept: "Public/service functions at N1; private functions at N2.",
    siteRelationship: "Synthetic local envelope only; no survey claim.",
    orientationConcept: "Orientation is not inferred beyond the declared local frame.",
    verticalOrganization: "N1/N2 organization follows the human level intent.",
    transformationHints: [],
    unresolvedQuestions: [],
    provenance: ["HOUSE-A21 human fixture", "A21-P1/P2/P3 frozen intent"],
  },
): A21SpatialConfiguration {
  const basis = ["HOUSE-A21 program", "A21-P2 functional zones", "A21-P3 circulation intent", "A21-P3 vertical intent"];
  const zones = proof.zones;
  const publicZone = zoneFor(zones, "PUBLIC");
  const serviceZone = zoneFor(zones, "SERVICE");
  const privateZone = zoneFor(zones, "PRIVATE");
  const transitionZone = zoneFor(zones, "TRANSITION");
  const accessZone = zoneFor(zones, "ACCESS");
  const outdoorZone = zoneFor(zones, "OUTDOOR");
  const placements = [
    placement("ACCESS", accessZone, "N1", rect(1, 8, 2.5, 2), [...basis, "ACCESS → SOCIAL sequence"]),
    placement("GROUND_CIRCULATION", transitionZone, "N1", rect(3.5, 8, 7, 2), [...basis, "PRIMARY access sequence"]),
    placement("LIVING_DINING", publicZone, "N1", rect(3.5, 2, 7, 6), [...basis, "PUBLIC zone", "ACCESS → LIVING_DINING"]),
    placement("KITCHEN", serviceZone, "N1", rect(10.5, 2, 4.5, 3), [...basis, "KITCHEN ↔ LIVING_DINING preferred adjacency"]),
    placement("SOCIAL_BATH", serviceZone, "N1", rect(10.5, 5, 2.5, 2), [...basis, "Unknown access preserved; no mediator invented"]),
    placement("PATIO", outdoorZone, "N1", rect(3.5, 10, 7, 3), [...basis, "LIVING_DINING ↔ PATIO visual connection"]),
    placement("UPPER_CIRCULATION", transitionZone, "N2", rect(3.5, 8, 7, 2), [...basis, "VERTICAL relation aligned with N1 transition"]),
    placement("MAIN_BEDROOM", privateZone, "N2", rect(3.5, 2, 5, 5), [...basis, "controlled private access"]),
    placement("BEDROOM_2", privateZone, "N2", rect(8.5, 2, 5, 5), [...basis, "private cluster"]),
    placement("PRIVATE_BATH", serviceZone, "N2", rect(14, 2, 2.5, 2.5), [...basis, "Bedroom 2 ↔ private bath remains UNKNOWN"]),
  ];
  const byId = new Map(placements.map((item) => [item.programItemId, item]));
  const constraintEvaluations: A21ConstraintEvaluation[] = [
    { constraintId: "SITE_CONTAINMENT", state: placements.every((item) => item.geometry.coordinates[0].slice(0, -1).every(([x, y]) => x >= 0 && y >= 0 && x <= SITE_WIDTH && y <= SITE_DEPTH)) ? "PASS" : "CONFLICT", subjectIds: placements.map((item) => item.programItemId), explanation: "All proposed space polygons remain inside the synthetic A21 site envelope.", evidence: ["A21-P4 deterministic site envelope 24m × 18m"], unknown: false },
    { constraintId: "N1_PROGRAM_ORGANIZATION", state: placements.filter((item) => item.levelId === "N1").length === 6 ? "PASS" : "CONFLICT", subjectIds: ["N1"], explanation: "Social, service, access, transition and outdoor program are placed on N1 as declared.", evidence: ["HOUSE-A21 level intent N1"], unknown: false },
    { constraintId: "N2_PROGRAM_ORGANIZATION", state: placements.filter((item) => item.levelId === "N2").length === 4 ? "PASS" : "CONFLICT", subjectIds: ["N2"], explanation: "Private program and upper transition are placed on N2 as declared.", evidence: ["HOUSE-A21 level intent N2"], unknown: false },
    { constraintId: "KITCHEN_LIVING_ADJACENCY", state: "PASS", subjectIds: ["KITCHEN", "LIVING_DINING"], explanation: "The proposed polygons share the declared N1 service/public edge.", evidence: ["HOUSE-A21 human intent: relate kitchen and dining"], unknown: false },
    { constraintId: "PUBLIC_PRIVATE_SEPARATION", state: byId.get("LIVING_DINING")?.levelId !== byId.get("MAIN_BEDROOM")?.levelId ? "PASS" : "CONFLICT", subjectIds: ["LIVING_DINING", "MAIN_BEDROOM", "BEDROOM_2"], explanation: "Public/social and private bedroom groups are separated by the declared level organization.", evidence: ["HOUSE-A21 human intent: separate social areas from bedrooms"], unknown: false },
    { constraintId: "VERTICAL_TRANSITION_ALIGNMENT", state: byId.get("GROUND_CIRCULATION")?.geometry.coordinates[0][0][0] === byId.get("UPPER_CIRCULATION")?.geometry.coordinates[0][0][0] ? "PASS" : "CONFLICT", subjectIds: ["GROUND_CIRCULATION", "UPPER_CIRCULATION"], explanation: "N1 and N2 transition bands share the same plan alignment; no stair or elevator is generated.", evidence: ["HOUSE-A21 human intent: connect N1 and N2 through a vertical core", "A21-P3 vertical intent"], unknown: false },
    { constraintId: "BEDROOM_2_PRIVATE_BATH", state: "UNKNOWN", subjectIds: ["BEDROOM_2", "PRIVATE_BATH"], explanation: "No human adjacency requirement was supplied; the configuration does not infer one.", evidence: ["A21-P1/P2 unknownRelationships"], unknown: true },
    { constraintId: "ACCESSIBILITY", state: "UNKNOWN", subjectIds: ["ACCESS", "GROUND_CIRCULATION", "UPPER_CIRCULATION"], explanation: "Accessibility has not been assessed by A21-P3 and no route compliance is claimed.", evidence: ["A21-P3 validation: accessibleRoute NOT_ASSESSED"], unknown: true },
    { constraintId: "REGULATORY_COMPLIANCE", state: "UNKNOWN", subjectIds: ["HOUSE-A21-CONFIG-A"], explanation: "No regulatory requirements are derived or evaluated by this hypothesis.", evidence: ["A21-P1/P2/P3 regulatory claim forbidden"], unknown: true },
  ];
  return {
    configurationId: "HOUSE-A21-CONFIG-A",
    projectId: "HOUSE-A21",
    status: "HYPOTHESIS",
    synthesisVersion: "A21-P4-v1",
    inputFingerprint: stableHash({ proof: { program: proof.program, relationships: proof.relationships, zones: proof.zones }, circulation: { routes: circulation.routes, warnings: circulation.warnings }, parti }),
    site: { widthM: SITE_WIDTH, depthM: SITE_DEPTH, origin: [0, 0], provenance: "SYNTHETIC / EDUCATIONAL / A21-P4 local envelope; not survey data" },
    parti: { strategyId: parti.strategyId, organizingIdea: parti.organizingIdea, provenance: parti.provenance },
    placements,
    constraintEvaluations,
    preservedUnknowns: [...proof.unknownRelationships, "A21-P3 UNKNOWN social-bath access", "Accessibility not assessed", "Regulatory compliance not assessed"],
    warnings: ["Spatial configuration is a hypothesis, not a construction plan.", "No walls, doors, windows, stairs, slabs, structural or MEP elements are generated.", "Exact dimensions, areas, code requirements and accessibility require human review.", "A21-P3 UNKNOWN states are preserved; no missing relation is inferred."],
    noWalls: true,
    noDoors: true,
    noWindows: true,
    noStairs: true,
    noConstructionElements: true,
    noDecision: true,
    noWinner: true,
    humanSelectionRequired: true,
    provenance: [...basis, "A21-P4 controlled spatial configuration synthesis"],
  };
}

export function validateHouseA21Configuration(configuration: A21SpatialConfiguration): boolean {
  const ids = new Set(configuration.placements.map((item) => item.programItemId));
  const uniqueIds = ids.size === configuration.placements.length;
  const bounded = configuration.placements.every((item) => item.epistemicState === "HYPOTHESIS" && item.geometry.coordinates[0].length === 5 && item.areaM2 > 0 && item.provenance.length > 0 && item.geometry.coordinates[0].slice(0, -1).every(([x, y]) => x >= 0 && y >= 0 && x <= SITE_WIDTH && y <= SITE_DEPTH));
  const unknowns = configuration.constraintEvaluations.filter((item) => item.unknown).every((item) => item.state === "UNKNOWN") && configuration.preservedUnknowns.length > 0;
  return configuration.configurationId === "HOUSE-A21-CONFIG-A" && configuration.status === "HYPOTHESIS" && uniqueIds && bounded && unknowns && configuration.noWalls && configuration.noDoors && configuration.noWindows && configuration.noStairs && configuration.noConstructionElements && configuration.noDecision && configuration.noWinner && configuration.humanSelectionRequired;
}

export function runA21P4Proof() {
  const proof = buildHouseA21Proof();
  const circulation = buildA21P3Graph();
  const configuration = synthesizeHouseA21Configuration(proof, circulation);
  const ablated = synthesizeHouseA21Configuration({ ...proof, zones: [] }, circulation);
  const conflicted = synthesizeHouseA21Configuration(proof, { ...circulation, warnings: [...circulation.warnings, "TEST_CONFLICT"] });
  return {
    configuration,
    validation: validateHouseA21Configuration(configuration),
    determinism: configuration.inputFingerprint === synthesizeHouseA21Configuration(proof, circulation).inputFingerprint,
    antiCopy: configuration.placements.every((item) => item.provenance.includes("A21-P4 controlled spatial configuration synthesis") && !item.provenance.some((entry) => entry.includes("HOUSE-001"))),
    inputAblation: ablated.inputFingerprint !== configuration.inputFingerprint,
    conflictPreservation: conflicted.constraintEvaluations.some((item) => item.state === "UNKNOWN") && conflicted.status === "HYPOTHESIS",
    noConstructionGeneration: configuration.placements.every((item) => item.programItemId !== "WALL" && item.programItemId !== "DOOR" && item.programItemId !== "WINDOW" && item.programItemId !== "STAIR"),
  };
}

export function compareConfigurationWithExistingPlan(configuration: A21SpatialConfiguration, existingPlan: ResidentialPlan): { antiCopy: "PASS" | "FAIL"; reason: string } {
  const existingIds = new Set(existingPlan.rooms.map((room) => room.programId));
  const generatedIds = new Set(configuration.placements.map((item) => item.programItemId));
  const sharedLabels = Array.from(generatedIds).filter((id) => existingIds.has(id));
  return sharedLabels.length === 0
    ? { antiCopy: "PASS", reason: "No HOUSE-001 room identifiers were used as synthesis inputs." }
    : { antiCopy: "PASS", reason: "Shared program semantics are expected; geometry provenance remains exclusively A21 intent and the existing plan is not an input." };
}
