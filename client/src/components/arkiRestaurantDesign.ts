import { A26_MATERIALS, selectSustainableMaterial, type A26MaterialSelection } from "./a26SustainableArchitecturalEvaluation";
import type { Rect, ResidentialOpening, ResidentialWall, ResidentialCore, ResidentialRoute } from "./residentialConstructivePlan";
import { deduplicateResidentialWalls, residentialWallKey } from "./residentialConstructivePlan";
import { getTypologyFunctionalProfile, type FlowKind } from "./arkiTypologyFunctionalKnowledge";
import { buildSpatialHierarchy, type FunctionalUnit, type ArkiLevel } from "./arkiMultiscaleSpatialHierarchy";

type LevelId = "N1" | "N2";
export type RestaurantSpace = {
  id: string;
  name: string;
  levelId: LevelId;
  programId: string;
  zone: "PUBLIC" | "PRIVATE" | "SERVICE" | "CIRCULATION";
  footprint: Rect;
  targetAreaM2: number;
  areaM2: number;
  status: "EXPLICIT_GEOMETRY";
  flow: "PUBLIC" | "SERVICE" | "EVACUATION" | "VERTICAL" | "EXTERIOR";
  capacity: number;
  seats?: number;
};

export type RestaurantDesign = {
  projectId: string;
  alternativeId: string;
  projectName: string;
  site: Rect;
  siteFrontage: "SOUTH";
  spaces: RestaurantSpace[];
  walls: ResidentialWall[];
  openings: ResidentialOpening[];
  cores: ResidentialCore[];
  routes: ResidentialRoute[];
  levels: ArkiLevel[];
  functionalUnits: FunctionalUnit[];
  adjacency: Array<{ from: string; to: string; kind: "REQUIRED" | "PREFERRED"; evidence: "GEOMETRIC_OPENING" | "DECLARED_PROGRAM" }>;
  materialSelection: A26MaterialSelection;
  areaSchedule: Array<{ id: string; label: string; areaM2: number; levelId: LevelId; capacity: number }>;
  functionalOrganigram: { sequence: string[]; relations: Array<{ from: string; to: string; relation: string }> };
  restaurantProgram: { targetAforo: 500; diningSeats: number; kitchenAndSupportM2: number; publicDiningM2: number; coveredConceptualM2: number };
  parking: { customerSpaces: number; accessibleSpaces: number; serviceLoadingBay: number; areaM2: number };
  designNotes: string[];
  validation: { state: "SUPPORTED" | "PARTIAL" | "CONFLICTING"; checks: string[]; conflicts: string[]; humanReviewRequired: true; constructionDocumentation: "NOT_GENERATED"; epistemicState: "HYPOTHESIS" };
};

export type RestaurantTypologyEvaluation = {
  typology: "RESTAURANT";
  sourceFamilies: ["NEUFERT", "PLAZOLA"];
  epistemicState: "SOURCE_DERIVED_HYPOTHESIS";
  flowChecks: Array<{ flow: FlowKind; status: "PASS" | "UNKNOWN"; spatialEvidence: string; areaM2: number }>;
  circulationAreas: Array<{ id: string; kind: "PUBLIC" | "SERVICE" | "EMERGENCY"; areaM2: number; widthM: number }>;
  missingFunctionalAreas: string[];
  humanReviewRequired: true;
};

const rect = (minX: number, minY: number, maxX: number, maxY: number): Rect => ({ minX, minY, maxX, maxY });
const area = (r: Rect) => Number(((r.maxX - r.minX) * (r.maxY - r.minY)).toFixed(2));
const space = (id: string, name: string, levelId: LevelId, programId: string, zone: RestaurantSpace["zone"], footprint: Rect, flow: RestaurantSpace["flow"], capacity = 0, seats?: number): RestaurantSpace => ({ id, name, levelId, programId, zone, footprint, targetAreaM2: area(footprint), areaM2: area(footprint), status: "EXPLICIT_GEOMETRY", flow, capacity, ...(seats === undefined ? {} : { seats }) });
const makeWall = (id: string, levelId: LevelId, from: [number, number], to: [number, number], role: ResidentialWall["role"], roomIds?: string[]): ResidentialWall => ({ id, levelId, from, to, thicknessM: 0.15, role, ...(roomIds ? { roomIds } : {}) });
const opening = (id: string, levelId: LevelId, fromRoomId: string, toRoomId: string, kind: "DOOR" | "WINDOW", widthM: number): ResidentialOpening => ({ id, levelId, fromRoomId, toRoomId, kind, widthM, heightM: kind === "DOOR" ? 2.1 : 1.2, ...(kind === "WINDOW" ? { sillHeightM: 0.9, clearDistanceToOpposingObstructionM: 1.8 } : {}), status: kind === "DOOR" ? "VERIFIED_CLEARANCE" : "PROPOSED" });

function wallsFromSpaces(spaces: RestaurantSpace[]): ResidentialWall[] {
  const generated: ResidentialWall[] = [];
  for (const item of spaces.filter((candidate) => candidate.flow !== "EXTERIOR")) {
    const r = item.footprint;
    const edges: Array<{ from: [number, number]; to: [number, number] }> = [
      { from: [r.minX, r.minY], to: [r.maxX, r.minY] },
      { from: [r.maxX, r.minY], to: [r.maxX, r.maxY] },
      { from: [r.maxX, r.maxY], to: [r.minX, r.maxY] },
      { from: [r.minX, r.maxY], to: [r.minX, r.minY] },
    ];
    edges.forEach((edge, index) => generated.push(makeWall(`W-${item.levelId}-${item.id}-${index}`, item.levelId, edge.from, edge.to, "PARTITION", [item.id])));
  }
  return deduplicateResidentialWalls(generated);
}

export function buildRestaurantDesign(): RestaurantDesign {
  const site = rect(0, 0, 20, 40);
  const spaces: RestaurantSpace[] = [
    space("PARKING-CUSTOMER", "Estacionamiento frontal público (5 vehículos)", "N1", "PARKING", "PUBLIC", rect(0, 0, 14, 8), "EXTERIOR", 5),
    space("PARKING-ACCESSIBLE", "Estacionamiento accesible frontal", "N1", "ACCESSIBLE_PARKING", "PUBLIC", rect(14, 0, 17, 8), "EXTERIOR", 1),
    space("SERVICE-LOADING", "Bahía frontal de carga y descarga", "N1", "SERVICE_LOADING", "SERVICE", rect(17, 0, 20, 8), "EXTERIOR", 1),
    space("SERVICE-RECEIVING", "Recepción y control de mercancías", "N1", "SERVICE_RECEIVING", "SERVICE", rect(17, 8, 20, 12), "SERVICE", 4),
    space("MAIN-ENTRY", "Acceso principal y vestíbulo", "N1", "MAIN_ENTRY", "PUBLIC", rect(8, 8, 12, 11), "PUBLIC", 80),
    space("STAIR-W-N1", "Escalera de evacuación oeste", "N1", "STAIR", "CIRCULATION", rect(0, 8, 4, 12), "VERTICAL", 250),
    space("TOILETS-W-N1", "Servicios higiénicos públicos oeste", "N1", "PUBLIC_TOILETS", "SERVICE", rect(4, 8, 8, 12), "PUBLIC", 0),
    space("TOILETS-E-N1", "Servicios higiénicos públicos este", "N1", "PUBLIC_TOILETS", "SERVICE", rect(12, 8, 16, 12), "PUBLIC", 0),
    space("STAIR-E-N1", "Escalera de evacuación este", "N1", "STAIR", "CIRCULATION", rect(16, 8, 20, 12), "VERTICAL", 250),
    space("DINING-A-N1", "Salón comedor N1 oeste", "N1", "DINING", "PUBLIC", rect(0, 12, 10, 24), "PUBLIC", 120, 120),
    space("DINING-B-N1", "Salón comedor N1 este", "N1", "DINING", "PUBLIC", rect(10, 12, 17, 24), "PUBLIC", 120, 120),
    space("PUBLIC-SPINE-N1", "Pasaje público principal 3.00 m", "N1", "PUBLIC_CIRCULATION", "CIRCULATION", rect(0, 24, 17, 27), "PUBLIC", 500),
    space("SERVICE-SIDE-LANE-N1", "Circuito independiente de abastecimiento", "N1", "SERVICE_CIRCULATION", "SERVICE", rect(17, 12, 20, 40), "SERVICE", 20),
    space("KITCHEN-N1", "Cocina industrial y pase", "N1", "KITCHEN", "SERVICE", rect(0, 27, 12, 40), "SERVICE", 35),
    space("SERVICE-SUPPORT-N1", "Almacenes, cámaras, lavado y personal", "N1", "SERVICE_SUPPORT", "SERVICE", rect(12, 27, 17, 40), "SERVICE", 25),
    space("STAIR-W-N2", "Escalera de evacuación oeste", "N2", "STAIR", "CIRCULATION", rect(0, 8, 4, 12), "VERTICAL", 250),
    space("TOILETS-W-N2", "Servicios higiénicos públicos oeste", "N2", "PUBLIC_TOILETS", "SERVICE", rect(4, 8, 8, 12), "PUBLIC", 0),
    space("TOILETS-E-N2", "Servicios higiénicos públicos este", "N2", "PUBLIC_TOILETS", "SERVICE", rect(12, 8, 16, 12), "PUBLIC", 0),
    space("STAIR-E-N2", "Escalera de evacuación este", "N2", "STAIR", "CIRCULATION", rect(16, 8, 20, 12), "VERTICAL", 250),
    space("DINING-C-N2", "Salón comedor N2 oeste", "N2", "DINING", "PUBLIC", rect(0, 12, 10, 24), "PUBLIC", 130, 130),
    space("DINING-D-N2", "Salón comedor N2 este", "N2", "DINING", "PUBLIC", rect(10, 12, 20, 24), "PUBLIC", 130, 130),
    space("PUBLIC-SPINE-N2", "Pasaje público principal 3.00 m", "N2", "PUBLIC_CIRCULATION", "CIRCULATION", rect(0, 24, 20, 27), "PUBLIC", 500),
    space("PRIVATE-EVENT-N2", "Salón flexible / eventos con salida controlada", "N2", "EVENT_HALL", "PUBLIC", rect(0, 27, 20, 35), "PUBLIC", 0),
    space("ROOF-TERRACE-N2", "Terraza técnica no contabilizada como aforo", "N2", "ROOF_TERRACE", "SERVICE", rect(0, 35, 20, 40), "EXTERIOR", 0),
  ];
  const walls = wallsFromSpaces(spaces);
  const openings: ResidentialOpening[] = [
    opening("DOOR-MAIN-ENTRY", "N1", "MAIN-ENTRY", "EXTERIOR", "DOOR", 1.8),
    opening("EXIT-WEST-N1", "N1", "STAIR-W-N1", "EXTERIOR", "DOOR", 1.2),
    opening("EXIT-EAST-N1", "N1", "STAIR-E-N1", "EXTERIOR", "DOOR", 1.2),
    opening("DOOR-ENTRY-DINING-A", "N1", "MAIN-ENTRY", "DINING-A-N1", "DOOR", 1.8),
    opening("DOOR-ENTRY-DINING-B", "N1", "MAIN-ENTRY", "DINING-B-N1", "DOOR", 1.8),
    opening("DOOR-SERVICE-LOADING", "N1", "SERVICE-LOADING", "SERVICE-RECEIVING", "DOOR", 1.2),
    opening("DOOR-RECEIVING-SERVICE-LANE", "N1", "SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "DOOR", 1.2),
    opening("DOOR-SERVICE-LANE-SUPPORT", "N1", "SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "DOOR", 1.2),
    opening("DOOR-KITCHEN-SUPPORT", "N1", "KITCHEN-N1", "SERVICE-SUPPORT-N1", "DOOR", 1.8),
    opening("DOOR-DINING-SPINE-A", "N1", "DINING-A-N1", "PUBLIC-SPINE-N1", "DOOR", 1.8),
    opening("DOOR-DINING-SPINE-B", "N1", "DINING-B-N1", "PUBLIC-SPINE-N1", "DOOR", 1.8),
    opening("DOOR-STAIR-W-N1", "N1", "STAIR-W-N1", "PUBLIC-SPINE-N1", "DOOR", 1.2),
    opening("DOOR-STAIR-E-N1", "N1", "STAIR-E-N1", "PUBLIC-SPINE-N1", "DOOR", 1.2),
    opening("DOOR-STAIR-W-N2", "N2", "STAIR-W-N2", "PUBLIC-SPINE-N2", "DOOR", 1.2),
    opening("DOOR-STAIR-E-N2", "N2", "STAIR-E-N2", "PUBLIC-SPINE-N2", "DOOR", 1.2),
    opening("EXIT-WEST-N2", "N2", "STAIR-W-N2", "EXTERIOR", "DOOR", 1.2),
    opening("EXIT-EAST-N2", "N2", "STAIR-E-N2", "EXTERIOR", "DOOR", 1.2),
    opening("DOOR-DINING-SPINE-C", "N2", "DINING-C-N2", "PUBLIC-SPINE-N2", "DOOR", 1.8),
    opening("DOOR-DINING-SPINE-D", "N2", "DINING-D-N2", "PUBLIC-SPINE-N2", "DOOR", 1.8),
    opening("DOOR-SPINE-EVENT", "N2", "PUBLIC-SPINE-N2", "PRIVATE-EVENT-N2", "DOOR", 1.8),
    opening("WINDOW-DINING-SOUTH", "N1", "DINING-A-N1", "EXTERIOR", "WINDOW", 3),
    opening("WINDOW-DINING-NORTH", "N1", "DINING-B-N1", "EXTERIOR", "WINDOW", 3),
    opening("WINDOW-DINING-UPPER-SOUTH", "N2", "DINING-C-N2", "EXTERIOR", "WINDOW", 3),
    opening("WINDOW-DINING-UPPER-NORTH", "N2", "DINING-D-N2", "EXTERIOR", "WINDOW", 3),
  ];
  const cores: ResidentialCore[] = [
    { id: "STAIR-W-CORE", levelIds: ["N1", "N2"], footprint: rect(0, 8, 4, 12), kind: "STAIR", continuity: "CONTINUOUS" },
    { id: "STAIR-E-CORE", levelIds: ["N1", "N2"], footprint: rect(16, 8, 20, 12), kind: "STAIR", continuity: "CONTINUOUS" },
    { id: "KITCHEN-SERVICE-CORE", levelIds: ["N1"], footprint: rect(0, 27, 20, 40), kind: "SERVICE_DUCT", continuity: "PROPOSED" },
  ];
  const routes: ResidentialRoute[] = [
    { id: "PUBLIC-ROUTE-N1", levelIds: ["N1"], roomIds: ["MAIN-ENTRY", "DINING-A-N1", "DINING-B-N1", "PUBLIC-SPINE-N1", "STAIR-W-N1", "STAIR-E-N1"], widthM: 3, accessible: "VERIFIED_GEOMETRY", egress: "PROPOSED" },
    { id: "PUBLIC-ROUTE-N2", levelIds: ["N2"], roomIds: ["STAIR-W-N2", "STAIR-E-N2", "DINING-C-N2", "DINING-D-N2", "PUBLIC-SPINE-N2"], widthM: 3, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "SERVICE-ROUTE-N1", levelIds: ["N1"], roomIds: ["SERVICE-LOADING", "SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "KITCHEN-N1"], widthM: 3, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "VERTICAL-EGRESS", levelIds: ["N1", "N2"], roomIds: ["STAIR-W-N1", "STAIR-W-N2", "STAIR-E-N1", "STAIR-E-N2"], widthM: 2, accessible: "PROPOSED", egress: "PROPOSED" },
  ];
  const spatialHierarchy = buildSpatialHierarchy({
    projectId: "RESTAURANT-500-20X40-001",
    alternativeId: "RESTAURANT-A-SEPARATED-FLOWS",
    spaces,
    cores,
    routes,
    levels: [
      { levelId: "N1", projectId: "RESTAURANT-500-20X40-001", alternativeId: "RESTAURANT-A-SEPARATED-FLOWS", levelIndex: 0, levelLabel: "N1 — acceso, producción y comedor", levelRole: "GROUND", elevationReference: 0, floorToFloorHeight: 3.6, footprint: site },
      { levelId: "N2", projectId: "RESTAURANT-500-20X40-001", alternativeId: "RESTAURANT-A-SEPARATED-FLOWS", levelIndex: 1, levelLabel: "N2 — comedor y eventos", levelRole: "UPPER", elevationReference: 3.6, floorToFloorHeight: 3.6, footprint: site },
    ],
    functionalUnits: [
      { functionalUnitId: "UNIT-PUBLIC-ARRIVAL", name: "Acceso y atención pública", role: "PRIMARY", necessity: "ESSENTIAL", spaceIds: ["MAIN-ENTRY", "DINING-A-N1", "DINING-B-N1", "DINING-C-N2", "DINING-D-N2", "PUBLIC-SPINE-N1", "PUBLIC-SPINE-N2"], activityIds: ["ARRIVAL", "WAITING", "DINING", "DISTRIBUTION"], flowKinds: ["PUBLIC", "USER"], status: "OBSERVED" },
      { functionalUnitId: "UNIT-PRODUCTION-SERVICE", name: "Abastecimiento, producción y servicio", role: "SERVICE", necessity: "ESSENTIAL", spaceIds: ["SERVICE-LOADING", "SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "KITCHEN-N1"], activityIds: ["RECEIVE_GOODS", "STORE", "COOK", "WASH", "SERVE", "WASTE_RETURN"], flowKinds: ["STAFF", "SERVICE", "GOODS", "WASTE"], status: "OBSERVED" },
      { functionalUnitId: "UNIT-SANITARY-SUPPORT", name: "Soporte sanitario público", role: "SUPPORT", necessity: "ESSENTIAL", spaceIds: ["TOILETS-W-N1", "TOILETS-E-N1", "TOILETS-W-N2", "TOILETS-E-N2"], activityIds: ["HYGIENE", "ACCESS"], flowKinds: ["USER", "SERVICE"], status: "OBSERVED" },
      { functionalUnitId: "UNIT-EGRESS-VERTICAL", name: "Núcleo vertical y evacuación", role: "INFRASTRUCTURE", necessity: "ESSENTIAL", spaceIds: ["STAIR-W-N1", "STAIR-E-N1", "STAIR-W-N2", "STAIR-E-N2"], activityIds: ["VERTICAL_MOVEMENT", "EVACUATION", "EMERGENCY_RESPONSE"], flowKinds: ["VERTICAL", "EMERGENCY"], status: "OBSERVED" },
    ],
    provenance: ["ARKI_RESTAURANT_500", "A22.levels", "A20.circulation", "Neufert/Plazola functional hypothesis"],
  });
  const adjacency = [
    ["MAIN-ENTRY", "DINING-A-N1", "REQUIRED"], ["MAIN-ENTRY", "DINING-B-N1", "REQUIRED"], ["DINING-A-N1", "PUBLIC-SPINE-N1", "REQUIRED"], ["DINING-B-N1", "PUBLIC-SPINE-N1", "REQUIRED"],
    ["PUBLIC-SPINE-N1", "STAIR-W-N1", "REQUIRED"], ["PUBLIC-SPINE-N1", "STAIR-E-N1", "REQUIRED"], ["KITCHEN-N1", "SERVICE-SUPPORT-N1", "REQUIRED"], ["SERVICE-LOADING", "SERVICE-RECEIVING", "REQUIRED"], ["SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "REQUIRED"], ["SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "REQUIRED"],
    ["DINING-C-N2", "PUBLIC-SPINE-N2", "REQUIRED"], ["DINING-D-N2", "PUBLIC-SPINE-N2", "REQUIRED"], ["PUBLIC-SPINE-N2", "STAIR-W-N2", "REQUIRED"], ["PUBLIC-SPINE-N2", "STAIR-E-N2", "REQUIRED"], ["PUBLIC-SPINE-N2", "PRIVATE-EVENT-N2", "PREFERRED"],
  ].map(([from, to, kind]) => ({ from, to, kind: kind as "REQUIRED" | "PREFERRED", evidence: "GEOMETRIC_OPENING" as const }));
  const publicDiningM2 = spaces.filter((item) => item.programId === "DINING").reduce((sum, item) => sum + item.areaM2, 0);
  const kitchenAndSupportM2 = spaces.filter((item) => item.flow === "SERVICE").reduce((sum, item) => sum + item.areaM2, 0);
  const coveredConceptualM2 = spaces.filter((item) => item.flow !== "EXTERIOR").reduce((sum, item) => sum + item.areaM2, 0);
  const materialSelection = selectSustainableMaterial("COMMERCIAL", coveredConceptualM2, { budgetUsd: coveredConceptualM2 * 280, carbonTargetKgCo2e: coveredConceptualM2 * 250 });
  const selected = materialSelection.candidates.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const profile = A26_MATERIALS.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const conflicts: string[] = [];
  if (spaces.filter((item) => item.programId === "DINING").reduce((sum, item) => sum + (item.seats ?? 0), 0) !== 500) conflicts.push("DINING_SEAT_COUNT");
  if (spaces.filter((item) => item.levelId === "N2" && item.programId === "STAIR").length < 2) conflicts.push("INDEPENDENT_STAIRS");
  if (!routes.filter((item) => item.id.startsWith("PUBLIC")).every((route) => route.widthM >= 3)) conflicts.push("PUBLIC_SPINE_WIDTH");
  return {
    projectId: "RESTAURANT-500-20X40-001", alternativeId: "RESTAURANT-A-SEPARATED-FLOWS", projectName: "Restaurante 500 personas — lote 20 × 40 m", site, siteFrontage: "SOUTH", spaces, walls, openings, cores, routes, levels: spatialHierarchy.levels, functionalUnits: spatialHierarchy.functionalUnits, adjacency, materialSelection,
    areaSchedule: spaces.filter((item) => item.flow !== "EXTERIOR").map((item) => ({ id: item.id, label: item.name, areaM2: item.areaM2, levelId: item.levelId, capacity: item.capacity })),
    functionalOrganigram: { sequence: ["ARRIVAL", "ACCESS_CONTROL", "DINING", "PUBLIC_CIRCULATION", "KITCHEN_PRODUCTION", "SERVICE_LOGISTICS", "EVACUATION"], relations: [{ from: "PARKING-CUSTOMER", to: "MAIN-ENTRY", relation: "PUBLIC_ARRIVAL" }, { from: "MAIN-ENTRY", to: "DINING-A-N1", relation: "PRIMARY_ACCESS" }, { from: "DINING-A-N1", to: "PUBLIC-SPINE-N1", relation: "DISTRIBUTION" }, { from: "PUBLIC-SPINE-N1", to: "STAIR-W-N1", relation: "EVACUATION" }, { from: "PUBLIC-SPINE-N1", to: "STAIR-E-N1", relation: "EVACUATION" }, { from: "SERVICE-LOADING", to: "SERVICE-RECEIVING", relation: "SUPPLY_RECEIVING" }, { from: "SERVICE-RECEIVING", to: "SERVICE-SIDE-LANE-N1", relation: "INDEPENDENT_SERVICE_CIRCUIT" }, { from: "SERVICE-SIDE-LANE-N1", to: "SERVICE-SUPPORT-N1", relation: "WAREHOUSE_AND_WASHING" }, { from: "SERVICE-SUPPORT-N1", to: "KITCHEN-N1", relation: "FOOD_PRODUCTION" }] },
    restaurantProgram: { targetAforo: 500, diningSeats: spaces.filter((item) => item.programId === "DINING").reduce((sum, item) => sum + (item.seats ?? 0), 0), kitchenAndSupportM2, publicDiningM2, coveredConceptualM2 },
    parking: { customerSpaces: 5, accessibleSpaces: 1, serviceLoadingBay: 1, areaM2: 160 },
    designNotes: ["Se asume frente y acceso urbano por el lado sur.", "El frente se divide en estacionamiento público, estacionamiento accesible y bahía de carga; la carga no ingresa por el vestíbulo.", "La mercancía pasa por recepción/control, baja por un circuito lateral de servicio de 3.00 m y llega a almacenes, cámaras, lavado y cocina sin atravesar comedores ni circulación pública.", "El comedor se distribuye en cuatro salones para evitar un único recinto de 500 personas y facilitar orientación y evacuación.", "Las dos escaleras de evacuación son continuas entre N1 y N2 y desembocan hacia salidas exteriores independientes.", "La cocina, lavado, almacenes y personal se agrupan en el borde posterior para mantener flujo de servicio separado.", "El salón flexible N2 queda sin aforo asignado en esta primera alternativa: su uso futuro debe recalcular el aforo total."],
    validation: { state: conflicts.length ? "CONFLICTING" : "PARTIAL", checks: ["site 20x40", "500 dining seats", "front parking and loading", "defined accessible main entry", "public/service flow separation", "two continuous evacuation stairs", "3.00m public spines", "0.15m wall thickness", "opening endpoints", "conceptual RNE A.070/A.130 checks"], conflicts, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED", epistemicState: "HYPOTHESIS" },
  };
}

export function validateRestaurantDesign(design = buildRestaurantDesign()) {
  const diningSeats = design.spaces.filter((item) => item.programId === "DINING").reduce((sum, item) => sum + (item.seats ?? 0), 0);
  const n2Stairs = design.spaces.filter((item) => item.levelId === "N2" && item.programId === "STAIR");
  const publicRoutes = design.routes.filter((item) => item.id.startsWith("PUBLIC"));
  const serviceRoute = design.routes.find((item) => item.id === "SERVICE-ROUTE-N1");
  const publicDoors = design.openings.filter((item) => item.kind === "DOOR" && (item.fromRoomId.includes("DINING") || item.toRoomId.includes("DINING") || item.fromRoomId === "MAIN-ENTRY"));
  return {
    sitePass: design.site.maxX - design.site.minX === 20 && design.site.maxY - design.site.minY === 40,
    aforoPass: diningSeats === 500,
    diningSeatCount: diningSeats,
    parkingPass: design.parking.customerSpaces >= 5 && design.parking.accessibleSpaces === 1 && design.parking.serviceLoadingBay === 1,
    mainAccessPass: design.openings.some((item) => item.id === "DOOR-MAIN-ENTRY" && item.widthM >= 1.2),
    publicCirculationPass: publicRoutes.every((route) => route.widthM >= 3),
    serviceCirculationPass: (serviceRoute?.widthM ?? 0) >= 1.2,
    independentEvacuationPass: n2Stairs.length >= 2 && design.cores.filter((core) => core.kind === "STAIR" && core.continuity === "CONTINUOUS").length === 2,
    evacuationDoorWidthRecorded: publicDoors.every((door) => door.widthM >= 1.2),
    openingEndpointPass: design.openings.every((item) => item.toRoomId === "EXTERIOR" || design.spaces.some((spaceItem) => spaceItem.id === item.toRoomId)),
    wallThicknessPass: design.walls.length > 0 && design.walls.every((wallItem) => wallItem.thicknessM === 0.15),
    noClaimOfPermitDocumentation: design.validation.constructionDocumentation === "NOT_GENERATED" && design.validation.epistemicState === "HYPOTHESIS",
  };
}

export const restaurantAreaSummary = (design = buildRestaurantDesign()) => ({ siteM2: 800, coveredConceptualM2: design.restaurantProgram.coveredConceptualM2, publicDiningM2: design.restaurantProgram.publicDiningM2, kitchenAndSupportM2: design.restaurantProgram.kitchenAndSupportM2, diningSeats: design.restaurantProgram.diningSeats, parkingM2: design.parking.areaM2 });

/** Re-reads the canonical restaurant profile and checks that flows have spatial areas, not only arrows. */
export function evaluateRestaurantAgainstTypology(design = buildRestaurantDesign()): RestaurantTypologyEvaluation {
  const profile = getTypologyFunctionalProfile("RESTAURANT");
  const publicRoute = design.routes.find((route) => route.id === "PUBLIC-ROUTE-N1");
  const serviceRoute = design.routes.find((route) => route.id === "SERVICE-ROUTE-N1");
  const emergencyRoute = design.routes.find((route) => route.id === "VERTICAL-EGRESS");
  const areaOf = (ids: string[]) => design.spaces.filter((spaceItem) => ids.includes(spaceItem.id)).reduce((sum, spaceItem) => sum + spaceItem.areaM2, 0);
  const flowChecks: RestaurantTypologyEvaluation["flowChecks"] = [
    { flow: "PUBLIC", status: publicRoute ? "PASS" : "UNKNOWN", spatialEvidence: "PUBLIC-ROUTE-N1 + PUBLIC-SPINE-N1", areaM2: areaOf(["MAIN-ENTRY", "PUBLIC-SPINE-N1"]) },
    { flow: "USER", status: publicRoute ? "PASS" : "UNKNOWN", spatialEvidence: "PUBLIC-ROUTE-N1 + DINING spaces", areaM2: areaOf(["DINING-A-N1", "DINING-B-N1", "DINING-C-N2", "DINING-D-N2"]) },
    { flow: "STAFF", status: serviceRoute ? "PASS" : "UNKNOWN", spatialEvidence: "SERVICE-RECEIVING + SERVICE-SIDE-LANE-N1 + SERVICE-SUPPORT-N1", areaM2: areaOf(["SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1"]) },
    { flow: "SERVICE", status: serviceRoute ? "PASS" : "UNKNOWN", spatialEvidence: "SERVICE-ROUTE-N1", areaM2: areaOf(["SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "KITCHEN-N1"]) },
    { flow: "GOODS", status: design.spaces.some((spaceItem) => spaceItem.programId === "SERVICE_LOADING") ? "PASS" : "UNKNOWN", spatialEvidence: "SERVICE-LOADING + SERVICE-RECEIVING", areaM2: areaOf(["SERVICE-LOADING", "SERVICE-RECEIVING"]) },
    { flow: "WASTE", status: design.spaces.some((spaceItem) => spaceItem.programId === "SERVICE_SUPPORT") ? "PASS" : "UNKNOWN", spatialEvidence: "SERVICE-SUPPORT-N1; waste segregation still requires equipment layout", areaM2: areaOf(["SERVICE-SUPPORT-N1"]) },
    { flow: "EMERGENCY", status: emergencyRoute ? "PASS" : "UNKNOWN", spatialEvidence: "VERTICAL-EGRESS + two continuous stair cores", areaM2: areaOf(["STAIR-W-N1", "STAIR-E-N1", "STAIR-W-N2", "STAIR-E-N2"]) },
  ];
  const circulationAreas = [
    { id: "PUBLIC-SPINE-N1", kind: "PUBLIC" as const, areaM2: areaOf(["PUBLIC-SPINE-N1"]), widthM: 3 },
    { id: "PUBLIC-SPINE-N2", kind: "PUBLIC" as const, areaM2: areaOf(["PUBLIC-SPINE-N2"]), widthM: 3 },
    { id: "SERVICE-SIDE-LANE-N1", kind: "SERVICE" as const, areaM2: areaOf(["SERVICE-SIDE-LANE-N1"]), widthM: 3 },
    { id: "VERTICAL-EGRESS", kind: "EMERGENCY" as const, areaM2: areaOf(["STAIR-W-N1", "STAIR-E-N1", "STAIR-W-N2", "STAIR-E-N2"]), widthM: 2 },
  ];
  const missingFunctionalAreas = profile.programGroups.filter((group) => group === "delivery" || group === "waste" ? !flowChecks.some((check) => (group === "delivery" ? check.flow === "GOODS" : check.flow === "WASTE") && check.status === "PASS") : false);
  return { typology: "RESTAURANT", sourceFamilies: ["NEUFERT", "PLAZOLA"], epistemicState: "SOURCE_DERIVED_HYPOTHESIS", flowChecks, circulationAreas, missingFunctionalAreas, humanReviewRequired: true };
}
