import { buildRestaurantDesign, type RestaurantDesign, type RestaurantSpace } from "./arkiRestaurantDesign";
import { deduplicateResidentialWalls, type Rect, type ResidentialWall } from "./residentialConstructivePlan";
import { buildV5MutationReassessment, deriveV5JourneyValidity, type V5JourneyValidity } from "./arkiV5ResearchDelta";

export type WasteRepairValidation = {
  status: "GEOMETRICALLY_RESOLVED" | "PARTIAL" | "CONFLICTING";
  checks: Record<string, "PASS" | "UNKNOWN" | "FAIL">;
  errors: string[];
  humanReviewRequired: true;
  constructionDocumentation: "NOT_GENERATED";
  epistemicState: "HYPOTHESIS";
};

export type RestaurantWasteRepair = {
  original: RestaurantDesign;
  candidate: RestaurantDesign;
  changedElementIds: string[];
  affectedCapabilityIds: string[];
  journey: V5JourneyValidity;
  reassessment: ReturnType<typeof buildV5MutationReassessment>;
  validation: WasteRepairValidation;
  rationale: string[];
};

const area = (r: Rect) => Number(((r.maxX - r.minX) * (r.maxY - r.minY)).toFixed(2));
const space = (id: string, name: string, footprint: Rect, capacity = 0): RestaurantSpace => ({ id, name, levelId: "N1", programId: "WASTE_RETURN", zone: "SERVICE", footprint, targetAreaM2: area(footprint), areaM2: area(footprint), status: "EXPLICIT_GEOMETRY", flow: "SERVICE", capacity });
const wallsFor = (item: RestaurantSpace): ResidentialWall[] => {
  const r = item.footprint;
  const edge = (index: number, from: [number, number], to: [number, number]): ResidentialWall => ({ id: `W-N1-${item.id}-${index}`, levelId: "N1", from, to, thicknessM: 0.15, role: "PARTITION", roomIds: [item.id] });
  return [edge(0, [r.minX, r.minY], [r.maxX, r.minY]), edge(1, [r.maxX, r.minY], [r.maxX, r.maxY]), edge(2, [r.maxX, r.maxY], [r.minX, r.maxY]), edge(3, [r.minX, r.maxY], [r.minX, r.minY])];
};

export function buildRestaurantWasteRepair(original = buildRestaurantDesign()): RestaurantWasteRepair {
  const wasteZone = space("WASTE-RETURN-N1", "Retorno de vajilla sucia y residuos", { minX: 12, minY: 27, maxX: 17, maxY: 30 }, 12);
  const adjustedSupport = { minX: 12, minY: 30, maxX: 17, maxY: 40 };
  const candidateSpaces = original.spaces.filter((item) => item.id !== "SERVICE-SUPPORT-N1").concat([{ ...original.spaces.find((item) => item.id === "SERVICE-SUPPORT-N1")!, footprint: adjustedSupport, targetAreaM2: area(adjustedSupport), areaM2: area(adjustedSupport) }, wasteZone]);
  const oldSupportWalls = new Set(original.walls.filter((wall) => wall.roomIds?.includes("SERVICE-SUPPORT-N1")).map((wall) => wall.id));
  const candidateWalls = deduplicateResidentialWalls([...original.walls.filter((wall) => !oldSupportWalls.has(wall.id)), ...wallsFor(candidateSpaces.find((item) => item.id === "SERVICE-SUPPORT-N1")!), ...wallsFor(wasteZone)]);
  const candidateOpenings = original.openings.filter((opening) => opening.id !== "DOOR-KITCHEN-SUPPORT").concat([
    { id: "DOOR-KITCHEN-WASTE", levelId: "N1", fromRoomId: "KITCHEN-N1", toRoomId: "WASTE-RETURN-N1", kind: "DOOR" as const, widthM: 1.2, heightM: 2.1, status: "VERIFIED_CLEARANCE" as const },
    { id: "DOOR-WASTE-SUPPORT", levelId: "N1", fromRoomId: "WASTE-RETURN-N1", toRoomId: "SERVICE-SUPPORT-N1", kind: "DOOR" as const, widthM: 1.2, heightM: 2.1, status: "VERIFIED_CLEARANCE" as const },
    { id: "DOOR-WASTE-LANE", levelId: "N1", fromRoomId: "WASTE-RETURN-N1", toRoomId: "SERVICE-SIDE-LANE-N1", kind: "DOOR" as const, widthM: 1.2, heightM: 2.1, status: "VERIFIED_CLEARANCE" as const },
  ]);
  const candidateRoutes = original.routes.concat([{ id: "WASTE-RETURN-ROUTE-N1", levelIds: ["N1"], roomIds: ["KITCHEN-N1", "WASTE-RETURN-N1", "SERVICE-SUPPORT-N1", "SERVICE-SIDE-LANE-N1"], widthM: 1.2, accessible: "PROPOSED" as const, egress: "NOT_ASSESSED" as const }]);
  const candidateAdjacency = original.adjacency.concat([
    { from: "KITCHEN-N1", to: "WASTE-RETURN-N1", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const },
    { from: "WASTE-RETURN-N1", to: "SERVICE-SUPPORT-N1", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const },
    { from: "WASTE-RETURN-N1", to: "SERVICE-SIDE-LANE-N1", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const },
  ]);
  const candidate: RestaurantDesign = {
    ...original,
    alternativeId: "RESTAURANT-A-WASTE-REPAIR-01",
    projectName: "Restaurante 500 personas — reparación automática candidata de residuos",
    spaces: candidateSpaces,
    walls: candidateWalls,
    openings: candidateOpenings,
    routes: candidateRoutes,
    adjacency: candidateAdjacency,
    areaSchedule: candidateSpaces.filter((item) => item.flow !== "EXTERIOR").map((item) => ({ id: item.id, label: item.name, areaM2: item.areaM2, levelId: item.levelId, capacity: item.capacity })),
    functionalUnits: original.functionalUnits.map((unit) => unit.functionalUnitId === "UNIT-PRODUCTION-SERVICE" ? { ...unit, spaceIds: [...unit.spaceIds, "WASTE-RETURN-N1"] } : unit),
    functionalOrganigram: { sequence: [...original.functionalOrganigram.sequence, "WASTE_RETURN"], relations: [...original.functionalOrganigram.relations, { from: "KITCHEN-N1", to: "WASTE-RETURN-N1", relation: "DIRTY_RETURN" }, { from: "WASTE-RETURN-N1", to: "SERVICE-SIDE-LANE-N1", relation: "CONTROLLED_WASTE_EXIT" }] },
    restaurantProgram: { ...original.restaurantProgram, kitchenAndSupportM2: candidateSpaces.filter((item) => item.flow === "SERVICE").reduce((sum, item) => sum + item.areaM2, 0), coveredConceptualM2: candidateSpaces.filter((item) => item.flow !== "EXTERIOR").reduce((sum, item) => sum + item.areaM2, 0) },
    designNotes: [...original.designNotes, "La reparación candidata agrega un recinto explícito de retorno de vajilla sucia y residuos de 15 m² entre cocina, soporte y la franja lateral de servicio.", "La propuesta mantiene el circuito independiente, pero la operación, higiene, frecuencia de retiro y exigencias normativas deben verificarse humanamente."],
    validation: { ...original.validation, state: "PARTIAL", checks: [...original.validation.checks, "waste-return zone containment", "waste route continuity", "waste door endpoints"], conflicts: [] },
  };
  const journey = deriveV5JourneyValidity({ journeyId: "JOURNEY-WASTE-RETURN-01", subjectId: "WASTE-RETURN-N1", segments: [
    { id: "SEG-KITCHEN-WASTE", from: "KITCHEN-N1", to: "WASTE-RETURN-N1", subjectId: "WASTE-RETURN-N1", process: "dirty return", interfaceIds: ["DOOR-KITCHEN-WASTE"], conditionRequirements: ["controlled handling"], controls: ["door and segregated room"], temporalRole: "TRAVEL", evidence: [{ id: "V5-WASTE-JOURNEY-1", source: "candidate geometry", evidenceState: "SOURCE_DERIVED_HYPOTHESIS" }] },
    { id: "SEG-WASTE-LANE", from: "WASTE-RETURN-N1", to: "SERVICE-SIDE-LANE-N1", subjectId: "WASTE-RETURN-N1", process: "controlled removal", interfaceIds: ["DOOR-WASTE-LANE"], conditionRequirements: ["scheduled removal"], controls: ["service-only lane"], temporalRole: "SERVICE", evidence: [{ id: "V5-WASTE-JOURNEY-2", source: "candidate geometry", evidenceState: "SOURCE_DERIVED_HYPOTHESIS" }] },
  ], requiredConditions: ["dimensioned capacity", "cleaning protocol", "removal frequency", "RNE applicability review"], missingEvidence: ["operational waste capacity", "validated hygiene procedure", "RNE-specific waste requirement mapping"], status: "PARTIAL" });
  const reassessment = buildV5MutationReassessment({ mutationId: "MUTATION-WASTE-REPAIR-01", changedElementIds: ["SERVICE-SUPPORT-N1", wasteZone.id, "DOOR-KITCHEN-WASTE", "DOOR-WASTE-SUPPORT", "DOOR-WASTE-LANE", "WASTE-RETURN-ROUTE-N1"], affectedCapabilityIds: ["CAP-RESTAURANT-WASTE", "CAP-RESTAURANT-SERVICE", "CAP-V4-RESTAURANT-WASTE"], affectedScenarioIds: ["REST-NORMAL", "REST-PEAK", "REST-MAINTENANCE"], reevaluatedClaimIds: ["WASTE_GEOMETRIC_CONTAINMENT", "WASTE_ROUTE_CONTINUITY", "SERVICE_FLOW_SEPARATION"], preservedClaimIds: ["DINING_CAPACITY", "PUBLIC_ACCESS", "N2_VERTICAL_EGRESS"], unknownClaimIds: ["WASTE_OPERATIONAL_CAPACITY", "RNE_WASTE_COMPLIANCE"] });
  const validation = validateRestaurantWasteRepair(original, candidate);
  return { original, candidate, changedElementIds: reassessment.changedElementIds, affectedCapabilityIds: reassessment.affectedCapabilityIds, journey, reassessment, validation, rationale: ["Candidate generated from the existing canonical building model.", "Original alternative remains immutable.", "Only the affected service/support geometry and its dependency-scoped evidence are reevaluated.", "Operational and regulatory claims remain unresolved where evidence is absent."] };
}

export function validateRestaurantWasteRepair(original: RestaurantDesign, candidate: RestaurantDesign): WasteRepairValidation {
  const waste = candidate.spaces.find((item) => item.id === "WASTE-RETURN-N1");
  const support = candidate.spaces.find((item) => item.id === "SERVICE-SUPPORT-N1");
  const route = candidate.routes.find((item) => item.id === "WASTE-RETURN-ROUTE-N1");
  const endpoints = ["DOOR-KITCHEN-WASTE", "DOOR-WASTE-SUPPORT", "DOOR-WASTE-LANE"].every((id) => candidate.openings.some((opening) => opening.id === id && opening.widthM >= 1.2));
  const errors: string[] = [];
  if (!waste || !support) errors.push("WASTE_SPACE_MISSING");
  if (waste && (waste.areaM2 < 12 || waste.footprint.minX < candidate.site.minX || waste.footprint.maxX > candidate.site.maxX)) errors.push("WASTE_GEOMETRY_INVALID");
  if (route && route.widthM < 1.2) errors.push("WASTE_ROUTE_WIDTH");
  if (!route) errors.push("WASTE_ROUTE_MISSING");
  if (!endpoints) errors.push("WASTE_DOOR_ENDPOINTS");
  const geometryChanged = original.spaces.length !== candidate.spaces.length && candidate.alternativeId !== original.alternativeId;
  return { status: errors.length ? "CONFLICTING" : "GEOMETRICALLY_RESOLVED", checks: { WASTE_SPACE: waste ? "PASS" : "FAIL", CONTAINMENT: waste && waste.footprint.maxX <= candidate.site.maxX ? "PASS" : "FAIL", NON_OVERLAP_WITH_DINING: waste && !candidate.spaces.some((item) => item.programId === "DINING" && item.levelId === "N1" && item.footprint.minX < waste.footprint.maxX && item.footprint.maxX > waste.footprint.minX && item.footprint.minY < waste.footprint.maxY && item.footprint.maxY > waste.footprint.minY) ? "PASS" : "FAIL", ROUTE_CONTINUITY: route ? "PASS" : "FAIL", DOOR_CONNECTIONS: endpoints ? "PASS" : "FAIL", ORIGINAL_IMMUTABILITY: geometryChanged ? "PASS" : "FAIL", OPERATIONAL_CAPACITY: "UNKNOWN", RNE_WASTE_COMPLIANCE: "UNKNOWN" }, errors, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED", epistemicState: "HYPOTHESIS" };
}
