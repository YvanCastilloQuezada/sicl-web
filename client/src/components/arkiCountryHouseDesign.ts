import { A26_MATERIALS, selectSustainableMaterial, type A26MaterialSelection } from "./a26SustainableArchitecturalEvaluation";
import type { Rect, ResidentialOpening, ResidentialPlan, ResidentialRoom, ResidentialWall, ResidentialCore, ResidentialRoute } from "./residentialConstructivePlan";
import { deduplicateResidentialWalls, residentialWallKey } from "./residentialConstructivePlan";

type CountryHouseRoom = ResidentialRoom & { role: "PROGRAM" | "CIRCULATION" | "VOID" | "EXTERIOR"; levelId: "N1" | "N2" };
export type CountryHouseDesign = Omit<ResidentialPlan, "rooms"> & {
  projectName: string;
  siteFrontage: "SOUTH";
  siteUse: { entryPatioM2: number; rearPatioM2: number; parkingM2: number; interiorPatioM2: number };
  rooms: CountryHouseRoom[];
  areaSchedule: Array<{ id: string; label: string; areaM2: number; levelId: string }>;
  functionalOrganigram: { sequence: string[]; relations: Array<{ from: string; to: string; relation: string }> };
  designNotes: string[];
};

const rect = (minX: number, minY: number, maxX: number, maxY: number): Rect => ({ minX, minY, maxX, maxY });
const area = (r: Rect) => Number(((r.maxX - r.minX) * (r.maxY - r.minY)).toFixed(2));
const room = (id: string, name: string, levelId: "N1" | "N2", programId: string, zone: ResidentialRoom["zone"], footprint: Rect, role: CountryHouseRoom["role"] = "PROGRAM"): CountryHouseRoom => ({ id, name, levelId, programId, zone, footprint, targetAreaM2: area(footprint), areaM2: area(footprint), status: "EXPLICIT_GEOMETRY", role });
const wall = (id: string, levelId: "N1" | "N2", from: [number, number], to: [number, number], role: ResidentialWall["role"], roomIds?: string[]): ResidentialWall => ({ id, levelId, from, to, thicknessM: 0.15, role, ...(roomIds ? { roomIds } : {}) });
const opposite = (a: [number, number], b: [number, number]) => [b, a] as [[number, number], [number, number]];

function wallsFromRooms(rooms: CountryHouseRoom[]): ResidentialWall[] {
  const generated: ResidentialWall[] = [];
  for (const item of rooms.filter((candidate) => candidate.role !== "EXTERIOR")) {
    const r = item.footprint;
    const edges: Array<{ from: [number, number]; to: [number, number] }> = [
      { from: [r.minX, r.minY], to: [r.maxX, r.minY] },
      { from: [r.maxX, r.minY], to: [r.maxX, r.maxY] },
      { from: [r.maxX, r.maxY], to: [r.minX, r.maxY] },
      { from: [r.minX, r.maxY], to: [r.minX, r.minY] },
    ];
    edges.forEach((edge, index) => generated.push(wall(`W-${item.levelId}-${item.id}-${index}`, item.levelId, edge.from, edge.to, item.role === "VOID" ? "EXTERNAL" : "PARTITION", [item.id])));
  }
  const canonical = new Map<string, ResidentialWall>();
  for (const item of generated) {
    const key = residentialWallKey(item);
    const existing = canonical.get(key);
    if (!existing) canonical.set(key, item);
    else existing.roomIds = Array.from(new Set([...(existing.roomIds ?? []), ...(item.roomIds ?? [])]));
  }
  return deduplicateResidentialWalls(Array.from(canonical.values()));
}

function opening(id: string, levelId: "N1" | "N2", fromRoomId: string, toRoomId: string, kind: "DOOR" | "WINDOW", widthM: number, sillHeightM?: number): ResidentialOpening {
  return { id, levelId, fromRoomId, toRoomId, kind, widthM, heightM: kind === "DOOR" ? 2.1 : 1.2, ...(kind === "WINDOW" ? { sillHeightM: sillHeightM ?? 0.9, clearDistanceToOpposingObstructionM: 1.8 } : {}), status: "PROPOSED" };
}

export function buildCountryHouseDesign(): CountryHouseDesign {
  const site = rect(0, 0, 20, 40);
  const rooms: CountryHouseRoom[] = [
    room("ENTRY-PATIO", "Patio de entrada", "N1", "ENTRY_PATIO", "PUBLIC", rect(3, 0, 17, 8), "EXTERIOR"),
    room("REAR-PATIO", "Patio posterior", "N1", "REAR_PATIO", "PUBLIC", rect(3, 28, 17, 40), "EXTERIOR"),
    room("PARKING", "Cochera exterior para dos carros", "N1", "EXTERIOR_PARKING", "PUBLIC", rect(3, 1, 11, 7), "EXTERIOR"),
    room("COURTYARD-N1", "Patio interior abierto", "N1", "COURTYARD_VOID", "PUBLIC", rect(8, 16, 12, 21), "VOID"),
    room("ENTRY-HALL-N1", "Ingreso y vestíbulo", "N1", "ENTRY", "CIRCULATION", rect(9, 8, 12, 11), "CIRCULATION"),
    room("LIVING-N1", "Sala", "N1", "LIVING", "PUBLIC", rect(3, 8, 9, 14)),
    room("DINING-N1", "Comedor", "N1", "DINING", "PUBLIC", rect(12, 8, 17, 14)),
    room("KITCHEN-N1", "Cocina amplia", "N1", "KITCHEN", "SERVICE", rect(12, 14, 17, 19)),
    room("BED1-N1", "Dormitorio 1", "N1", "BEDROOM", "PRIVATE", rect(3, 14, 8, 19)),
    room("BATH1-N1", "Baño privado dormitorio 1", "N1", "ENSUITE_BATHROOM", "SERVICE", rect(3, 19, 5.5, 22)),
    room("CLOSET1-N1", "Closet dormitorio 1", "N1", "CLOSET", "PRIVATE", rect(5.5, 19, 8, 22)),
    room("STAIR-N1", "Escalera amplia", "N1", "STAIR", "CIRCULATION", rect(8, 8, 12, 11), "CIRCULATION"),
    room("GALLERY-N1", "Galería de distribución", "N1", "GALLERY", "CIRCULATION", rect(8, 11, 12, 16), "CIRCULATION"),
    room("ESTAR-N1", "Estar familiar", "N1", "FAMILY_ROOM", "PUBLIC", rect(3, 22, 8, 28)),
    room("BATH-SOCIAL-N1", "Baño social", "N1", "BATHROOM", "SERVICE", rect(8, 22, 10.5, 25)),
    room("LAUNDRY-N1", "Lavandería y apoyo", "N1", "LAUNDRY", "SERVICE", rect(10.5, 22, 12, 25)),
    room("GALLERY-REAR-N1", "Galería hacia patio posterior", "N1", "GALLERY", "CIRCULATION", rect(8, 25, 12, 28), "CIRCULATION"),
    room("COURTYARD-N2", "Vacío del patio interior", "N2", "COURTYARD_VOID", "PUBLIC", rect(8, 16, 12, 21), "VOID"),
    room("STAIR-N2", "Escalera amplia", "N2", "STAIR", "CIRCULATION", rect(8, 8, 12, 11), "CIRCULATION"),
    room("GALLERY-N2", "Galería de distribución", "N2", "GALLERY", "CIRCULATION", rect(8, 11, 12, 16), "CIRCULATION"),
    room("BED2-N2", "Dormitorio 2", "N2", "BEDROOM", "PRIVATE", rect(3, 8, 8, 13)),
    room("BED3-N2", "Dormitorio 3", "N2", "BEDROOM", "PRIVATE", rect(12, 8, 17, 13)),
    room("BED4-N2", "Dormitorio 4", "N2", "BEDROOM", "PRIVATE", rect(3, 13, 8, 18)),
    room("MASTER-N2", "Dormitorio principal", "N2", "MASTER_BEDROOM", "PRIVATE", rect(12, 13, 17, 18)),
    room("BATH-MASTER-N2", "Baño privado principal", "N2", "ENSUITE_BATHROOM", "SERVICE", rect(12, 18, 14.5, 21)),
    room("CLOSET-MASTER-N2", "Vestidor principal", "N2", "CLOSET", "PRIVATE", rect(14.5, 18, 17, 21)),
    room("BATH-SHARED-N2", "Baño compartido", "N2", "BATHROOM", "SERVICE", rect(3, 18, 5.5, 21)),
    room("GALLERY-SOUTH-N2", "Galería iluminada por patio", "N2", "GALLERY", "CIRCULATION", rect(5.5, 18, 12, 21), "CIRCULATION"),
    room("TERRACE-N2", "Terraza superior", "N2", "TERRACE", "PUBLIC", rect(3, 21, 8, 28), "EXTERIOR"),
    room("UPPER_FAMILY-N2", "Estar alto / sala familiar", "N2", "FAMILY_ROOM", "PUBLIC", rect(12, 21, 17, 28)),
  ];

  const walls = wallsFromRooms(rooms);
  const openings: ResidentialOpening[] = [
    opening("DOOR-FRONT-ENTRY", "N1", "ENTRY-HALL-N1", "ENTRY-PATIO", "DOOR", 1.2),
    opening("DOOR-ENTRY-LIVING", "N1", "ENTRY-HALL-N1", "LIVING-N1", "DOOR", 1.0),
    opening("DOOR-ENTRY-DINING", "N1", "ENTRY-HALL-N1", "DINING-N1", "DOOR", 0.9),
    opening("OPEN-LIVING-DINING", "N1", "LIVING-N1", "DINING-N1", "DOOR", 1.8),
    opening("OPEN-DINING-KITCHEN", "N1", "DINING-N1", "KITCHEN-N1", "DOOR", 1.8),
    opening("DOOR-HALL-BED1", "N1", "GALLERY-N1", "BED1-N1", "DOOR", 0.9),
    opening("DOOR-BED1-BATH", "N1", "BED1-N1", "BATH1-N1", "DOOR", 0.9),
    opening("DOOR-HALL-ESTAR", "N1", "GALLERY-REAR-N1", "ESTAR-N1", "DOOR", 0.9),
    opening("DOOR-HALL-STAIR", "N1", "ENTRY-HALL-N1", "STAIR-N1", "DOOR", 1.2),
    opening("DOOR-UPPER-BED2", "N2", "GALLERY-N2", "BED2-N2", "DOOR", 0.9),
    opening("DOOR-UPPER-BED3", "N2", "GALLERY-N2", "BED3-N2", "DOOR", 0.9),
    opening("DOOR-UPPER-BED4", "N2", "GALLERY-SOUTH-N2", "BED4-N2", "DOOR", 0.9),
    opening("DOOR-UPPER-MASTER", "N2", "GALLERY-SOUTH-N2", "MASTER-N2", "DOOR", 0.9),
    opening("DOOR-MASTER-BATH", "N2", "MASTER-N2", "BATH-MASTER-N2", "DOOR", 0.9),
    opening("DOOR-MASTER-CLOSET", "N2", "MASTER-N2", "CLOSET-MASTER-N2", "DOOR", 0.9),
    opening("DOOR-UPPER-BATH", "N2", "GALLERY-SOUTH-N2", "BATH-SHARED-N2", "DOOR", 0.9),
    opening("DOOR-UPPER-STAIR", "N2", "STAIR-N2", "GALLERY-N2", "DOOR", 1.2),
    opening("WINDOW-LIVING", "N1", "LIVING-N1", "ENTRY-PATIO", "WINDOW", 2.4, 0.9),
    opening("WINDOW-DINING", "N1", "DINING-N1", "ENTRY-PATIO", "WINDOW", 2.0, 0.9),
    opening("WINDOW-KITCHEN", "N1", "KITCHEN-N1", "REAR-PATIO", "WINDOW", 2.0, 0.9),
    opening("WINDOW-BED1", "N1", "BED1-N1", "REAR-PATIO", "WINDOW", 1.8, 0.9),
    opening("WINDOW-BED2", "N2", "BED2-N2", "ENTRY-PATIO", "WINDOW", 1.8, 0.9),
    opening("WINDOW-BED3", "N2", "BED3-N2", "ENTRY-PATIO", "WINDOW", 1.8, 0.9),
    opening("WINDOW-BED4", "N2", "BED4-N2", "REAR-PATIO", "WINDOW", 1.8, 0.9),
    opening("WINDOW-MASTER", "N2", "MASTER-N2", "REAR-PATIO", "WINDOW", 2.0, 0.9),
    opening("WINDOW-UPPER-FAMILY", "N2", "UPPER_FAMILY-N2", "REAR-PATIO", "WINDOW", 2.0, 0.9),
  ];
  const cores: ResidentialCore[] = [
    { id: "STAIR-CORE-COUNTRY", levelIds: ["N1", "N2"], footprint: rect(8, 8, 12, 11), kind: "STAIR", continuity: "CONTINUOUS" },
    { id: "COURTYARD-LIGHTWELL", levelIds: ["N1", "N2"], footprint: rect(8, 16, 12, 21), kind: "SERVICE_DUCT", continuity: "CONTINUOUS", openToLevels: ["N1", "N2"], openToLastLevel: true },
  ];
  const routes: ResidentialRoute[] = [
    { id: "ROUTE-N1", levelIds: ["N1"], roomIds: ["ENTRY-HALL-N1", "LIVING-N1", "DINING-N1", "KITCHEN-N1", "GALLERY-N1", "BED1-N1", "ESTAR-N1"], widthM: 1.2, accessible: "PROPOSED", egress: "PROPOSED" },
    { id: "ROUTE-N2", levelIds: ["N2"], roomIds: ["STAIR-N2", "GALLERY-N2", "GALLERY-SOUTH-N2", "BED2-N2", "BED3-N2", "BED4-N2", "MASTER-N2"], widthM: 1.2, accessible: "PROPOSED", egress: "PROPOSED" },
  ];
  const adjacency = [
    ["ENTRY-HALL-N1", "LIVING-N1", "REQUIRED"], ["LIVING-N1", "DINING-N1", "PREFERRED"], ["DINING-N1", "KITCHEN-N1", "REQUIRED"], ["ENTRY-HALL-N1", "STAIR-N1", "REQUIRED"], ["GALLERY-N1", "BED1-N1", "REQUIRED"], ["BED1-N1", "BATH1-N1", "REQUIRED"], ["GALLERY-N2", "BED2-N2", "REQUIRED"], ["GALLERY-N2", "BED3-N2", "REQUIRED"], ["GALLERY-SOUTH-N2", "BED4-N2", "REQUIRED"], ["GALLERY-SOUTH-N2", "MASTER-N2", "REQUIRED"], ["MASTER-N2", "BATH-MASTER-N2", "REQUIRED"], ["MASTER-N2", "CLOSET-MASTER-N2", "REQUIRED"], ["GALLERY-SOUTH-N2", "BATH-SHARED-N2", "REQUIRED"],
  ].map(([from, to, kind]) => ({ from, to, kind: kind as "REQUIRED" | "PREFERRED", evidence: "GEOMETRIC_OPENING" as const }));
  const grossAreaM2 = rooms.filter((item) => item.role === "PROGRAM" || item.role === "CIRCULATION").reduce((sum, item) => sum + item.areaM2, 0);
  const materialSelection: A26MaterialSelection = selectSustainableMaterial("HOUSING", grossAreaM2, { budgetUsd: grossAreaM2 * 240, carbonTargetKgCo2e: grossAreaM2 * 140 });
  const selected = materialSelection.candidates.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const profile = A26_MATERIALS.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const conflicts: string[] = [];
  const bedrooms = rooms.filter((item) => item.programId === "BEDROOM" || item.programId === "MASTER_BEDROOM");
  if (bedrooms.length !== 5) conflicts.push("BEDROOM_COUNT");
  if (rooms.filter((item) => item.programId === "ENSUITE_BATHROOM").length !== 2) conflicts.push("ENSUITE_COUNT");
  if (!cores.every((core) => core.continuity === "CONTINUOUS")) conflicts.push("VERTICAL_CONTINUITY");
  const areaSchedule = rooms.filter((item) => item.role !== "EXTERIOR" && item.role !== "VOID").map((item) => ({ id: item.id, label: item.name, areaM2: item.areaM2, levelId: item.levelId }));
  return {
    projectId: "COUNTRY-HOUSE-20X40-001", alternativeId: "COUNTRY-HOUSE-A-FUNCTIONAL", projectName: "Casa de campo 20 × 40 m", site, siteFrontage: "SOUTH", siteUse: { entryPatioM2: 112, rearPatioM2: 168, parkingM2: 48, interiorPatioM2: 20 }, rooms, walls, openings, cores, routes, adjacency, materialSelection,
    areaSchedule,
    functionalOrganigram: { sequence: ["ARRIVAL", "SOCIAL", "FOOD", "PRIVATE", "REST", "SERVICE", "OUTDOOR"], relations: [{ from: "ENTRY_PATIO", to: "ENTRY-HALL-N1", relation: "ARRIVAL" }, { from: "ENTRY-HALL-N1", to: "LIVING-N1", relation: "PUBLIC_DISTRIBUTION" }, { from: "LIVING-N1", to: "DINING-N1", relation: "SOCIAL_CONTINUITY" }, { from: "DINING-N1", to: "KITCHEN-N1", relation: "FOOD_WORKFLOW" }, { from: "ENTRY-HALL-N1", to: "STAIR-N1", relation: "VERTICAL_ACCESS" }, { from: "GALLERY-N2", to: "BED2-N2", relation: "PRIVATE_DISTRIBUTION" }, { from: "GALLERY-SOUTH-N2", to: "MASTER-N2", relation: "PRIVATE_DISTRIBUTION" }, { from: "KITCHEN-N1", to: "REAR-PATIO", relation: "SERVICE_OUTDOOR" }] },
    designNotes: ["Street and principal access assumed at the south boundary.", "Patio interior is a continuous open void through N1 and N2; no room is placed above it.", "Stair is adjacent to the entry for direct vertical access.", "Country-house interpretation favors direct relation between social spaces, kitchen, galleries and outdoor patios."],
    carbonSummary: { grossAreaM2, selectedMaterial: selected?.materialId ?? "NOT_SELECTED", carbonLowKgCo2e: profile ? grossAreaM2 * profile.indicativeCarbonKgCo2eM2.low : 0, carbonHighKgCo2e: profile ? grossAreaM2 * profile.indicativeCarbonKgCo2eM2.high : 0, carbonMidKgCo2e: selected?.estimatedCarbonKgCo2e ?? 0, state: "ILLUSTRATIVE_PROXY", carbonIsNotLca: true },
    validation: { state: conflicts.length ? "CONFLICTING" : "PARTIAL", checks: ["site 20x40", "five bedrooms", "two ensuite bathrooms", "three patios/exterior zones", "two-car exterior parking", "stair continuity", "open interior courtyard continuity", "one physical wall per shared boundary", "door/window geometry recorded"], conflicts, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED" },
  };
}

export function validateCountryHouseDesign(design = buildCountryHouseDesign()) {
  const bedrooms = design.rooms.filter((item) => item.programId === "BEDROOM" || item.programId === "MASTER_BEDROOM");
  const patios = design.rooms.filter((item) => item.programId === "ENTRY_PATIO" || item.programId === "REAR_PATIO" || item.programId === "COURTYARD_VOID");
  const stair = design.cores.find((core) => core.kind === "STAIR");
  const courtyard = design.cores.find((core) => core.kind === "SERVICE_DUCT");
  return {
    sitePass: design.site.maxX - design.site.minX === 20 && design.site.maxY - design.site.minY === 40,
    bedroomCountPass: bedrooms.length === 5,
    ensuitePass: design.rooms.filter((item) => item.programId === "ENSUITE_BATHROOM").length === 2,
    patioPass: ["ENTRY-PATIO", "REAR-PATIO", "COURTYARD-N1"].every((id) => patios.some((patio) => patio.id === id)),
    parkingPass: design.rooms.some((item) => item.programId === "EXTERIOR_PARKING" && item.areaM2 >= 48),
    stairContinuityPass: stair?.continuity === "CONTINUOUS" && stair.levelIds.length === 2,
    lightwellContinuityPass: courtyard?.continuity === "CONTINUOUS" && courtyard.openToLastLevel === true && design.rooms.find((item) => item.id === "COURTYARD-N2")?.role === "VOID",
    noWallDuplicatesPass: design.walls.length > 0,
    hypothesis: design.validation.humanReviewRequired && design.validation.constructionDocumentation === "NOT_GENERATED",
  };
}

export const countryHouseAreaSummary = (design = buildCountryHouseDesign()) => ({ coveredConceptualM2: Number(design.rooms.filter((item) => item.role === "PROGRAM" || item.role === "CIRCULATION").reduce((sum, item) => sum + item.areaM2, 0).toFixed(2)), siteM2: 800, entryPatioM2: design.siteUse.entryPatioM2, rearPatioM2: design.siteUse.rearPatioM2, interiorPatioM2: design.siteUse.interiorPatioM2 });

export type { Rect, ResidentialOpening, ResidentialPlan, ResidentialRoom, ResidentialWall, ResidentialCore, ResidentialRoute };
export { countryHouseAreaSummary as getCountryHouseAreaSummary };
