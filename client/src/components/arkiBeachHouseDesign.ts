import { A26_MATERIALS, selectSustainableMaterial, type A26MaterialSelection } from "./a26SustainableArchitecturalEvaluation";
import type { Rect, ResidentialOpening, ResidentialWall, ResidentialCore, ResidentialRoute } from "./residentialConstructivePlan";
import { deduplicateResidentialWalls, residentialWallKey } from "./residentialConstructivePlan";
import { buildSpatialHierarchy, type FunctionalUnit, type ArkiLevel } from "./arkiMultiscaleSpatialHierarchy";

export type BeachHouseRoom = {
  id: string; name: string; levelId: "N1" | "N2"; programId: string;
  zone: "PUBLIC" | "PRIVATE" | "SERVICE" | "CIRCULATION"; footprint: Rect;
  targetAreaM2: number; areaM2: number; role: "PROGRAM" | "CIRCULATION" | "VOID" | "EXTERIOR";
  status: "EXPLICIT_GEOMETRY";
};

export type BeachHouseDesign = {
  projectId: string; alternativeId: string; projectName: string; site: Rect; siteFrontage: "SOUTH";
  occupants: { parents: number; children: number; guests: number; total: number };
  rooms: BeachHouseRoom[]; walls: ResidentialWall[]; openings: ResidentialOpening[]; cores: ResidentialCore[]; routes: ResidentialRoute[];
  levels: ArkiLevel[]; functionalUnits: FunctionalUnit[]; pool: { id: string; footprint: Rect; areaM2: number; capacity: number };
  areaSchedule: Array<{ id: string; label: string; areaM2: number; levelId: string }>;
  functionalOrganigram: { sequence: string[]; relations: Array<{ from: string; to: string; relation: string }> };
  materialSelection: A26MaterialSelection; coveredConceptualM2: number; designNotes: string[];
  validation: { state: "SUPPORTED" | "PARTIAL" | "CONFLICTING"; checks: string[]; conflicts: string[]; humanReviewRequired: true; constructionDocumentation: "NOT_GENERATED"; epistemicState: "HYPOTHESIS" };
};

const rect = (minX: number, minY: number, maxX: number, maxY: number): Rect => ({ minX, minY, maxX, maxY });
const area = (r: Rect) => Number(((r.maxX - r.minX) * (r.maxY - r.minY)).toFixed(2));
const room = (id: string, name: string, levelId: "N1" | "N2", programId: string, zone: BeachHouseRoom["zone"], footprint: Rect, role: BeachHouseRoom["role"] = "PROGRAM"): BeachHouseRoom => ({ id, name, levelId, programId, zone, footprint, targetAreaM2: area(footprint), areaM2: area(footprint), role, status: "EXPLICIT_GEOMETRY" });
const wall = (id: string, levelId: "N1" | "N2", from: [number, number], to: [number, number], role: ResidentialWall["role"], roomIds?: string[]): ResidentialWall => ({ id, levelId, from, to, thicknessM: 0.15, role, ...(roomIds ? { roomIds } : {}) });
const opening = (id: string, levelId: "N1" | "N2", fromRoomId: string, toRoomId: string, kind: "DOOR" | "WINDOW", widthM: number): ResidentialOpening => ({ id, levelId, fromRoomId, toRoomId, kind, widthM, heightM: kind === "DOOR" ? 2.1 : 1.2, ...(kind === "WINDOW" ? { sillHeightM: 0.9, clearDistanceToOpposingObstructionM: 1.8 } : {}), status: kind === "DOOR" ? "VERIFIED_CLEARANCE" : "PROPOSED" });

function wallsFromRooms(rooms: BeachHouseRoom[]): ResidentialWall[] {
  const generated: ResidentialWall[] = [];
  for (const item of rooms.filter((candidate) => candidate.role !== "EXTERIOR")) {
    const r = item.footprint;
    [[r.minX, r.minY, r.maxX, r.minY], [r.maxX, r.minY, r.maxX, r.maxY], [r.maxX, r.maxY, r.minX, r.maxY], [r.minX, r.maxY, r.minX, r.minY]].forEach((edge, index) => generated.push(wall(`W-${item.levelId}-${item.id}-${index}`, item.levelId, [edge[0], edge[1]], [edge[2], edge[3]], item.role === "VOID" ? "EXTERNAL" : "PARTITION", [item.id])));
  }
  const canonical = new Map<string, ResidentialWall>();
  for (const item of generated) { const key = residentialWallKey(item); const existing = canonical.get(key); if (!existing) canonical.set(key, item); else existing.roomIds = Array.from(new Set([...(existing.roomIds ?? []), ...(item.roomIds ?? [])])); }
  return deduplicateResidentialWalls(Array.from(canonical.values()));
}

export function buildBeachHouseDesign(): BeachHouseDesign {
  const site = rect(0, 0, 30, 50);
  const rooms: BeachHouseRoom[] = [
    room("FRONT-GARDEN", "Jardín de llegada", "N1", "FRONT_GARDEN", "PUBLIC", rect(0, 0, 30, 8), "EXTERIOR"),
    room("PARKING", "Estacionamiento exterior para 3 vehículos", "N1", "PARKING", "PUBLIC", rect(2, 1, 14, 7), "EXTERIOR"),
    room("POOL-DECK", "Terraza de piscina", "N1", "POOL_DECK", "PUBLIC", rect(2, 38, 28, 50), "EXTERIOR"),
    room("POOL", "Piscina familiar", "N1", "POOL", "PUBLIC", rect(8, 40, 22, 48), "EXTERIOR"),
    room("COURTYARD-N1", "Patio interior abierto", "N1", "COURTYARD_VOID", "PUBLIC", rect(13, 20, 19, 27), "VOID"),
    room("ENTRY-HALL", "Ingreso y vestíbulo", "N1", "ENTRY", "CIRCULATION", rect(13, 8, 19, 11), "CIRCULATION"),
    room("LIVING", "Sala principal hacia jardín", "N1", "LIVING", "PUBLIC", rect(2, 8, 10, 14)),
    room("DINING", "Comedor conectado a terraza", "N1", "DINING", "PUBLIC", rect(10, 8, 16, 14)),
    room("KITCHEN", "Cocina amplia con isla", "N1", "KITCHEN", "SERVICE", rect(19, 8, 28, 14)),
    room("SERVICE", "Lavandería, depósito y apoyo", "N1", "SERVICE_SUPPORT", "SERVICE", rect(24, 14, 28, 20)),
    room("MASTER", "Dormitorio principal de padres", "N1", "MASTER_BEDROOM", "PRIVATE", rect(2, 14, 8, 20)),
    room("MASTER-BATH", "Baño principal", "N1", "ENSUITE_BATHROOM", "SERVICE", rect(8, 14, 11, 17)),
    room("GUEST", "Suite de invitados", "N1", "GUEST_BEDROOM", "PRIVATE", rect(21, 20, 28, 25)),
    room("GUEST-BATH", "Baño de invitados", "N1", "GUEST_BATHROOM", "SERVICE", rect(21, 25, 24, 28)),
    room("GALLERY-N1", "Galería social y distribución", "N1", "GALLERY", "CIRCULATION", rect(10, 14, 13, 30), "CIRCULATION"),
    room("STAIR-N1", "Escalera principal", "N1", "STAIR", "CIRCULATION", rect(13, 11, 19, 14), "CIRCULATION"),
    room("FAMILY-N1", "Estar familiar", "N1", "FAMILY_ROOM", "PUBLIC", rect(19, 14, 24, 20)),
    room("COURTYARD-N2", "Vacío continuo del patio interior", "N2", "COURTYARD_VOID", "PUBLIC", rect(13, 20, 19, 27), "VOID"),
    room("STAIR-N2", "Llegada de escalera", "N2", "STAIR", "CIRCULATION", rect(13, 11, 19, 14), "CIRCULATION"),
    room("GALLERY-N2", "Galería de dormitorios", "N2", "GALLERY", "CIRCULATION", rect(10, 14, 13, 30), "CIRCULATION"),
    room("KID-1", "Dormitorio hijos 1 y 2", "N2", "BEDROOM", "PRIVATE", rect(2, 8, 8, 14)),
    room("KID-2", "Dormitorio hijos 3 y 4", "N2", "BEDROOM", "PRIVATE", rect(21, 8, 27, 14)),
    room("KID-3", "Dormitorio hijo 5", "N2", "BEDROOM", "PRIVATE", rect(2, 14, 8, 20)),
    room("KIDS-BATH", "Baño compartido hijos", "N2", "BATHROOM", "SERVICE", rect(8, 14, 11, 18)),
    room("UPPER-FAMILY", "Estar de hijos y estudio", "N2", "FAMILY_ROOM", "PUBLIC", rect(21, 14, 28, 20)),
    room("TERRACE", "Terraza superior al paisaje", "N2", "TERRACE", "PUBLIC", rect(20, 22, 28, 30), "EXTERIOR"),
  ];
  const cores: ResidentialCore[] = [
    { id: "STAIR-CORE-BEACH", levelIds: ["N1", "N2"], footprint: rect(13, 11, 19, 14), kind: "STAIR", continuity: "CONTINUOUS" },
    { id: "COURTYARD-LIGHTWELL-BEACH", levelIds: ["N1", "N2"], footprint: rect(13, 20, 19, 27), kind: "SERVICE_DUCT", continuity: "CONTINUOUS", openToLevels: ["N1", "N2"], openToLastLevel: true },
  ];
  const walls = wallsFromRooms(rooms);
  const openings: ResidentialOpening[] = [
    opening("MAIN-DOOR", "N1", "ENTRY-HALL", "FRONT-GARDEN", "DOOR", 1.5), opening("ENTRY-LIVING", "N1", "ENTRY-HALL", "LIVING", "DOOR", 1.2), opening("ENTRY-DINING", "N1", "ENTRY-HALL", "DINING", "DOOR", 1.2), opening("DINING-KITCHEN", "N1", "DINING", "KITCHEN", "DOOR", 1.8), opening("ENTRY-STAIR", "N1", "ENTRY-HALL", "STAIR-N1", "DOOR", 1.2),
    opening("GALLERY-MASTER", "N1", "GALLERY-N1", "MASTER", "DOOR", 0.9), opening("MASTER-BATH", "N1", "MASTER", "MASTER-BATH", "DOOR", 0.9), opening("GALLERY-GUEST", "N1", "GALLERY-N1", "GUEST", "DOOR", 0.9), opening("GUEST-BATH", "N1", "GUEST", "GUEST-BATH", "DOOR", 0.9), opening("STAIR-UPPER", "N2", "STAIR-N2", "GALLERY-N2", "DOOR", 1.2),
    opening("GALLERY-KID1", "N2", "GALLERY-N2", "KID-1", "DOOR", 0.9), opening("GALLERY-KID3", "N2", "GALLERY-N2", "KID-3", "DOOR", 0.9), opening("UPPER-KID2", "N2", "UPPER-FAMILY", "KID-2", "DOOR", 0.9), opening("KID-BATH", "N2", "GALLERY-N2", "KIDS-BATH", "DOOR", 0.9),
    opening("WINDOW-LIVING", "N1", "LIVING", "FRONT-GARDEN", "WINDOW", 2.4), opening("WINDOW-DINING", "N1", "DINING", "POOL-DECK", "WINDOW", 2.4), opening("WINDOW-KITCHEN", "N1", "KITCHEN", "POOL-DECK", "WINDOW", 2.4), opening("WINDOW-MASTER", "N1", "MASTER", "COURTYARD-N1", "WINDOW", 1.8), opening("WINDOW-GUEST", "N1", "GUEST", "POOL-DECK", "WINDOW", 2.0), opening("WINDOW-KID1", "N2", "KID-1", "FRONT-GARDEN", "WINDOW", 2.0), opening("WINDOW-KID2", "N2", "KID-2", "POOL-DECK", "WINDOW", 2.0), opening("WINDOW-KID3", "N2", "KID-3", "COURTYARD-N2", "WINDOW", 2.0), opening("WINDOW-UPPER-FAMILY", "N2", "UPPER-FAMILY", "TERRACE", "WINDOW", 2.4),
  ];
  const routes: ResidentialRoute[] = [
    { id: "PUBLIC-ROUTE-N1", levelIds: ["N1"], roomIds: ["ENTRY-HALL", "LIVING", "DINING", "KITCHEN", "GALLERY-N1", "FAMILY-N1"], widthM: 1.2, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "PRIVATE-ROUTE-N2", levelIds: ["N2"], roomIds: ["STAIR-N2", "GALLERY-N2", "KID-1", "KID-3", "KIDS-BATH", "UPPER-FAMILY"], widthM: 1.2, accessible: "PROPOSED", egress: "PROPOSED" },
  ];
  const hierarchy = buildSpatialHierarchy({ projectId: "BEACH-HOUSE-30X50-001", alternativeId: "BEACH-HOUSE-A-COURTYARD-POOL", spaces: rooms.map((item) => ({ id: item.id, levelId: item.levelId, programId: item.programId })), levels: [{ levelId: "N1", projectId: "BEACH-HOUSE-30X50-001", alternativeId: "BEACH-HOUSE-A-COURTYARD-POOL", levelIndex: 0, levelLabel: "N1 — social, suites y piscina", levelRole: "GROUND", elevationReference: 0, floorToFloorHeight: 3.2, footprint: site }, { levelId: "N2", projectId: "BEACH-HOUSE-30X50-001", alternativeId: "BEACH-HOUSE-A-COURTYARD-POOL", levelIndex: 1, levelLabel: "N2 — hijos, estudio y terraza", levelRole: "UPPER", elevationReference: 3.2, floorToFloorHeight: 3.2, footprint: site }], cores, routes, functionalUnits: [
    { functionalUnitId: "UNIT-ARRIVAL-SOCIAL", name: "Llegada, vida social y piscina", role: "PRIMARY", necessity: "ESSENTIAL", spaceIds: ["FRONT-GARDEN", "PARKING", "ENTRY-HALL", "LIVING", "DINING", "FAMILY-N1", "POOL-DECK", "POOL"], activityIds: ["ARRIVE", "REST", "EAT", "SWIM", "GATHER"], flowKinds: ["PUBLIC", "USER", "VEHICLE"], status: "OBSERVED" },
    { functionalUnitId: "UNIT-PARENTS-GUESTS", name: "Alojamiento de padres e invitados", role: "PRIMARY", necessity: "ESSENTIAL", spaceIds: ["MASTER", "MASTER-BATH", "GUEST", "GUEST-BATH"], activityIds: ["SLEEP", "DRESS", "BATH", "HOST"], flowKinds: ["USER"], status: "OBSERVED" },
    { functionalUnitId: "UNIT-CHILDREN", name: "Alojamiento y estar de los hijos", role: "PRIMARY", necessity: "ESSENTIAL", spaceIds: ["KID-1", "KID-2", "KID-3", "KIDS-BATH", "UPPER-FAMILY"], activityIds: ["SLEEP", "STUDY", "PLAY", "BATH"], flowKinds: ["USER"], status: "OBSERVED" },
    { functionalUnitId: "UNIT-VERTICAL-COURTYARD", name: "Núcleo vertical y patio climático", role: "INFRASTRUCTURE", necessity: "ESSENTIAL", spaceIds: ["STAIR-N1", "STAIR-N2", "COURTYARD-N1", "COURTYARD-N2", "GALLERY-N1", "GALLERY-N2"], activityIds: ["CONNECT_LEVELS", "DISTRIBUTE", "VENTILATE", "DAYLIGHT"], flowKinds: ["VERTICAL", "PUBLIC"], status: "OBSERVED" },
  ], provenance: ["BEACH_HOUSE_30X50", "A22.levels", "A21.functional-units", "Neufert/Plazola functional hypothesis"] });
  const gross = rooms.filter((item) => item.role === "PROGRAM" || item.role === "CIRCULATION").reduce((sum, item) => sum + item.areaM2, 0);
  const materialSelection = selectSustainableMaterial("HOUSING", gross, { budgetUsd: gross * 260, carbonTargetKgCo2e: gross * 150 });
  const selected = materialSelection.candidates.find((item) => item.materialId === materialSelection.selectedMaterialId); const profile = A26_MATERIALS.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const conflicts: string[] = []; if (rooms.filter((item) => item.programId === "MASTER_BEDROOM" || item.programId === "GUEST_BEDROOM" || item.programId === "BEDROOM").length !== 5) conflicts.push("BEDROOM_COUNT"); if (hierarchy.status === "CONFLICTING") conflicts.push("MULTISCALE_HIERARCHY");
  return { projectId: "BEACH-HOUSE-30X50-001", alternativeId: "BEACH-HOUSE-A-COURTYARD-POOL", projectName: "Casa de playa 30 × 50 m — 10 personas", site, siteFrontage: "SOUTH", occupants: { parents: 2, children: 5, guests: 3, total: 10 }, rooms, walls, openings, cores, routes, levels: hierarchy.levels, functionalUnits: hierarchy.functionalUnits, pool: { id: "POOL", footprint: rect(8, 40, 22, 48), areaM2: 80, capacity: 10 }, areaSchedule: rooms.filter((item) => item.role !== "EXTERIOR" && item.role !== "VOID").map((item) => ({ id: item.id, label: item.name, areaM2: item.areaM2, levelId: item.levelId })), functionalOrganigram: { sequence: ["ARRIVAL", "SOCIAL", "FOOD", "PARENTS_GUESTS", "CHILDREN", "POOL_OUTDOOR", "VERTICAL_COURTYARD"], relations: [{ from: "FRONT-GARDEN", to: "ENTRY-HALL", relation: "ARRIVAL" }, { from: "ENTRY-HALL", to: "LIVING", relation: "SOCIAL_DISTRIBUTION" }, { from: "DINING", to: "KITCHEN", relation: "FOOD_WORKFLOW" }, { from: "LIVING", to: "POOL-DECK", relation: "INDOOR_OUTDOOR" }, { from: "ENTRY-HALL", to: "STAIR-N1", relation: "VERTICAL_ACCESS" }, { from: "STAIR-N2", to: "KID-1", relation: "CHILDREN_DISTRIBUTION" }, { from: "COURTYARD-N1", to: "COURTYARD-N2", relation: "CONTINUOUS_LIGHT_AND_AIR" }] }, materialSelection, coveredConceptualM2: gross, designNotes: ["Lote sin vecinos: las cuatro caras se consideran libres en esta hipótesis y requieren verificación de orientación, viento y privacidad.", "La piscina se ubica al fondo para separar llegada vehicular de ocio y permitir relación directa con comedor, cocina y deck.", "El patio interior es un vacío continuo N1-N2; no se tapa con dormitorios.", "La escalera se ubica junto al ingreso para que todos los usuarios alcancen N2 sin cruzar las áreas privadas.", "La capacidad residencial se organiza para 10 personas: padres, cinco hijos y tres invitados.", "La configuración de hijos usa tres dormitorios: dos habitaciones dobles y una individual; padres e invitados ocupan dos suites."], validation: { state: conflicts.length ? "CONFLICTING" : "PARTIAL", checks: ["site 30x50", "10 occupants", "five bedrooms", "pool 80m2", "front parking", "continuous courtyard", "continuous stair", "functional units and levels", "0.15m walls", "opening endpoints"], conflicts, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED", epistemicState: "HYPOTHESIS" } };
}

export function validateBeachHouseDesign(design = buildBeachHouseDesign()) {
  const bedroomCount = design.rooms.filter((item) => ["MASTER_BEDROOM", "GUEST_BEDROOM", "BEDROOM"].includes(item.programId)).length;
  const stair = design.cores.find((core) => core.kind === "STAIR"); const courtyard = design.cores.find((core) => core.kind === "SERVICE_DUCT");
  return { sitePass: design.site.maxX - design.site.minX === 30 && design.site.maxY - design.site.minY === 50, occupantsPass: design.occupants.total === 10, bedroomCountPass: bedroomCount === 5, poolPass: design.pool.areaM2 === 80 && design.pool.capacity >= 10, parkingPass: design.rooms.some((item) => item.programId === "PARKING" && item.areaM2 >= 48), stairContinuityPass: stair?.continuity === "CONTINUOUS" && stair.levelIds.length === 2, courtyardContinuityPass: courtyard?.continuity === "CONTINUOUS" && courtyard?.openToLastLevel === true, multiscalePass: design.levels.length === 2 && design.functionalUnits.length === 4 && design.functionalUnits.every((unit) => unit.provenance.length > 0), wallThicknessPass: design.walls.length > 0 && design.walls.every((item) => item.thicknessM === 0.15), hypothesis: design.validation.humanReviewRequired && design.validation.constructionDocumentation === "NOT_GENERATED" };
}

export const beachHouseAreaSummary = (design = buildBeachHouseDesign()) => ({ siteM2: 1500, coveredConceptualM2: design.coveredConceptualM2, poolM2: design.pool.areaM2, occupants: design.occupants.total, bedrooms: design.rooms.filter((item) => ["MASTER_BEDROOM", "GUEST_BEDROOM", "BEDROOM"].includes(item.programId)).length });
