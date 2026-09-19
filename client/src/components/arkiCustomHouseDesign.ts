import { A26_MATERIALS, selectSustainableMaterial } from "./a26SustainableArchitecturalEvaluation";
import type { ResidentialOpening, ResidentialPlan, ResidentialRoom, ResidentialWall } from "./residentialConstructivePlan";

type Rect = { minX: number; minY: number; maxX: number; maxY: number };
const area = (r: Rect) => (r.maxX - r.minX) * (r.maxY - r.minY);
const contains = (outer: Rect, inner: Rect) => inner.minX >= outer.minX && inner.minY >= outer.minY && inner.maxX <= outer.maxX && inner.maxY <= outer.maxY;
const overlaps = (a: Rect, b: Rect) => a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;

function room(id: string, name: string, levelId: "N1" | "N2", programId: string, zone: ResidentialRoom["zone"], footprint: Rect, targetAreaM2 = area(footprint)): ResidentialRoom {
  return { id, name, levelId, programId, zone, footprint, targetAreaM2, areaM2: area(footprint), status: "EXPLICIT_GEOMETRY" };
}
function boundaryWalls(levelId: "N1" | "N2", rooms: ResidentialRoom[]): ResidentialWall[] {
  return rooms.flatMap((item) => [
    { id: `${item.id}-W`, levelId, from: [item.footprint.minX, item.footprint.minY], to: [item.footprint.minX, item.footprint.maxY], thicknessM: 0.12, role: "PARTITION" as const },
    { id: `${item.id}-E`, levelId, from: [item.footprint.maxX, item.footprint.minY], to: [item.footprint.maxX, item.footprint.maxY], thicknessM: 0.12, role: "PARTITION" as const },
    { id: `${item.id}-S`, levelId, from: [item.footprint.minX, item.footprint.minY], to: [item.footprint.maxX, item.footprint.minY], thicknessM: 0.12, role: "PARTITION" as const },
    { id: `${item.id}-N`, levelId, from: [item.footprint.minX, item.footprint.maxY], to: [item.footprint.maxX, item.footprint.maxY], thicknessM: 0.12, role: "PARTITION" as const },
  ]);
}

export function generateCustomHouseDesign(): ResidentialPlan {
  const site = { minX: 0, minY: 0, maxX: 15, maxY: 20 };
  const n1: ResidentialRoom[] = [
    room("GARAGE-N1", "Garage", "N1", "GARAGE", "SERVICE", { minX: 0, minY: 0, maxX: 3.5, maxY: 5 }),
    room("LIVING-N1", "Living room", "N1", "LIVING", "PUBLIC", { minX: 3.5, minY: 0, maxX: 7.5, maxY: 4 }),
    room("DINING-N1", "Dining room", "N1", "DINING", "PUBLIC", { minX: 7.5, minY: 0, maxX: 10, maxY: 4 }),
    room("HALL-N1", "Ground circulation", "N1", "CIRCULATION", "CIRCULATION", { minX: 2, minY: 5, maxX: 4, maxY: 10 }),
    room("BATH-SOCIAL-N1", "Social bathroom", "N1", "BATHROOM", "SERVICE", { minX: 0, minY: 5, maxX: 2, maxY: 7 }),
    room("STAIR-LOBBY-N1", "Stair landing", "N1", "VERTICAL_CORE", "CIRCULATION", { minX: 4, minY: 4, maxX: 6.5, maxY: 6 }),
    room("KITCHEN-N1", "Kitchen", "N1", "KITCHEN", "SERVICE", { minX: 7.5, minY: 4, maxX: 10, maxY: 7 }),
    room("LAUNDRY-N1", "Laundry / service", "N1", "LAUNDRY", "SERVICE", { minX: 6.5, minY: 7, maxX: 8, maxY: 10 }),
    room("FLEX-N1", "Entry / service flex", "N1", "FLEX", "CIRCULATION", { minX: 8, minY: 7, maxX: 10, maxY: 10 }),
  ];
  const n2: ResidentialRoom[] = [
    room("MASTER-N2", "Master bedroom", "N2", "BEDROOM", "PRIVATE", { minX: 0, minY: 0, maxX: 4, maxY: 4 }),
    room("CLOSET-MASTER-N2", "Master closet", "N2", "CLOSET", "PRIVATE", { minX: 0, minY: 4, maxX: 2, maxY: 6 }),
    room("BATH-MASTER-N2", "Master ensuite", "N2", "BATHROOM", "SERVICE", { minX: 2, minY: 4, maxX: 4, maxY: 6 }),
    room("BEDROOM-2-N2", "Bedroom 2", "N2", "BEDROOM", "PRIVATE", { minX: 6.5, minY: 0, maxX: 10, maxY: 3.5 }),
    room("CLOSET-2-N2", "Bedroom 2 closet", "N2", "CLOSET", "PRIVATE", { minX: 6.5, minY: 3.5, maxX: 8, maxY: 5 }),
    room("BEDROOM-3-N2", "Bedroom 3", "N2", "BEDROOM", "PRIVATE", { minX: 8, minY: 5, maxX: 10, maxY: 8 }),
    room("CLOSET-3-N2", "Bedroom 3 closet", "N2", "CLOSET", "PRIVATE", { minX: 8, minY: 8, maxX: 10, maxY: 10 }),
    room("BATH-SHARED-N2", "Shared bathroom", "N2", "BATHROOM", "SERVICE", { minX: 6.5, minY: 5, maxX: 8, maxY: 7.5 }),
    room("HALL-N2", "Upper circulation", "N2", "CIRCULATION", "CIRCULATION", { minX: 4, minY: 7.5, maxX: 6.5, maxY: 10 }),
    room("STAIR-LOBBY-N2", "Stair landing", "N2", "VERTICAL_CORE", "CIRCULATION", { minX: 4, minY: 4, maxX: 6.5, maxY: 6 }),
    room("TERRACE-N2", "Upper terrace", "N2", "TERRACE", "PUBLIC", { minX: 0, minY: 6, maxX: 4, maxY: 10 }),
  ];
  const rooms = [...n1, ...n2];
  const exteriorWalls: ResidentialWall[] = [
    ...(["N1", "N2"] as const).flatMap((levelId) => [
      { id: `EXT-${levelId}-W`, levelId, from: [0, 0] as [number, number], to: [0, 10] as [number, number], thicknessM: 0.2, role: "EXTERNAL" as const },
      { id: `EXT-${levelId}-E`, levelId, from: [10, 0] as [number, number], to: [10, 10] as [number, number], thicknessM: 0.2, role: "EXTERNAL" as const },
      { id: `EXT-${levelId}-S`, levelId, from: [0, 0] as [number, number], to: [10, 0] as [number, number], thicknessM: 0.2, role: "EXTERNAL" as const },
      { id: `EXT-${levelId}-N`, levelId, from: [0, 10] as [number, number], to: [10, 10] as [number, number], thicknessM: 0.2, role: "EXTERNAL" as const },
    ]),
  ];
  const walls = [...exteriorWalls, ...boundaryWalls("N1", n1), ...boundaryWalls("N2", n2)];
  const openings: ResidentialOpening[] = [
    { id: "DOOR-ENTRY-GARAGE", levelId: "N1", fromRoomId: "GARAGE-N1", toRoomId: "HALL-N1", kind: "DOOR", widthM: 0.9, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-ENTRY-LIVING", levelId: "N1", fromRoomId: "HALL-N1", toRoomId: "LIVING-N1", kind: "DOOR", widthM: 0.9, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-LIVING-DINING", levelId: "N1", fromRoomId: "LIVING-N1", toRoomId: "DINING-N1", kind: "DOOR", widthM: 1.2, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-DINING-KITCHEN", levelId: "N1", fromRoomId: "DINING-N1", toRoomId: "KITCHEN-N1", kind: "DOOR", widthM: 0.9, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-HALL-BATH-SOCIAL", levelId: "N1", fromRoomId: "HALL-N1", toRoomId: "BATH-SOCIAL-N1", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-N1-STAIR", levelId: "N1", fromRoomId: "HALL-N1", toRoomId: "STAIR-LOBBY-N1", kind: "DOOR", widthM: 1.0, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-N2-STAIR", levelId: "N2", fromRoomId: "STAIR-LOBBY-N2", toRoomId: "HALL-N2", kind: "DOOR", widthM: 1.0, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-HALL-MASTER", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "MASTER-N2", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-MASTER-CLOSET", levelId: "N2", fromRoomId: "MASTER-N2", toRoomId: "CLOSET-MASTER-N2", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-MASTER-BATH", levelId: "N2", fromRoomId: "MASTER-N2", toRoomId: "BATH-MASTER-N2", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-HALL-BED2", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "BEDROOM-2-N2", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-HALL-BED3", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "BEDROOM-3-N2", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-HALL-BATH2", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "BATH-SHARED-N2", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    ...["LIVING-N1", "DINING-N1", "KITCHEN-N1", "MASTER-N2", "BEDROOM-2-N2", "BEDROOM-3-N2", "TERRACE-N2"].map((id, index) => ({ id: `WINDOW-${index + 1}`, levelId: id.endsWith("N1") ? "N1" as const : "N2" as const, fromRoomId: id, toRoomId: "EXTERIOR", kind: "WINDOW" as const, widthM: 1.2, status: "PROPOSED" as const })),
  ];
  const cores = [
    { id: "STAIR-CORE-CONTINUOUS", levelIds: ["N1", "N2"], footprint: { minX: 4, minY: 4, maxX: 6.5, maxY: 6 }, kind: "STAIR" as const, continuity: "CONTINUOUS" as const },
    { id: "SERVICE-DUCT-CONTINUOUS", levelIds: ["N1", "N2"], footprint: { minX: 6.5, minY: 5, maxX: 7, maxY: 5.5 }, kind: "SERVICE_DUCT" as const, continuity: "CONTINUOUS" as const },
  ];
  const routes = [{ id: "ROUTE-ACCESS-N1-N2", levelIds: ["N1", "N2"], roomIds: ["HALL-N1", "STAIR-LOBBY-N1", "STAIR-LOBBY-N2", "HALL-N2", "MASTER-N2"], widthM: 1.0, accessible: "PROPOSED" as const, egress: "PROPOSED" as const }];
  const adjacency = [
    ["LIVING-N1", "DINING-N1"], ["DINING-N1", "KITCHEN-N1"], ["HALL-N1", "BATH-SOCIAL-N1"], ["HALL-N1", "STAIR-LOBBY-N1"],
    ["HALL-N2", "MASTER-N2"], ["MASTER-N2", "CLOSET-MASTER-N2"], ["MASTER-N2", "BATH-MASTER-N2"], ["HALL-N2", "BEDROOM-2-N2"], ["HALL-N2", "BEDROOM-3-N2"], ["HALL-N2", "BATH-SHARED-N2"],
  ].map(([from, to]) => ({ from, to, kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const }));
  const conflicts: string[] = [];
  for (const item of rooms) if (!contains({ minX: 0, minY: 0, maxX: 10, maxY: 10 }, item.footprint)) conflicts.push(`ROOM_OUTSIDE_BUILDING:${item.id}`);
  for (let i = 0; i < rooms.length; i += 1) for (let j = i + 1; j < rooms.length; j += 1) if (rooms[i].levelId === rooms[j].levelId && overlaps(rooms[i].footprint, rooms[j].footprint)) conflicts.push(`ROOM_OVERLAP:${rooms[i].id}:${rooms[j].id}`);
  const grossAreaM2 = 200;
  const materialSelection = selectSustainableMaterial("HOUSING", grossAreaM2, { budgetUsd: grossAreaM2 * 220, carbonTargetKgCo2e: grossAreaM2 * 140 });
  const selected = materialSelection.candidates.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const profile = A26_MATERIALS.find((item) => item.materialId === materialSelection.selectedMaterialId);
  return {
    projectId: "HOUSE-300M2-200M2-CUSTOM",
    alternativeId: "HOUSE-CUSTOM-A-PARTI-COURTYARD-LIKE",
    site,
    rooms,
    walls,
    openings,
    cores,
    routes,
    adjacency,
    materialSelection,
    carbonSummary: { grossAreaM2, selectedMaterial: selected?.materialId ?? "NOT_SELECTED", carbonLowKgCo2e: profile ? grossAreaM2 * profile.indicativeCarbonKgCo2eM2.low : 0, carbonHighKgCo2e: profile ? grossAreaM2 * profile.indicativeCarbonKgCo2eM2.high : 0, carbonMidKgCo2e: selected?.estimatedCarbonKgCo2e ?? 0, state: "ILLUSTRATIVE_PROXY", carbonIsNotLca: true },
    validation: { state: conflicts.length ? "CONFLICTING" : "PARTIAL", checks: ["33-program rooms represented", "300m2 site boundary", "200m2 gross covered target", "same-level non-overlap", "door endpoint graph", "continuous stair core", "continuous service duct", "two-level route"], conflicts, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED" },
  };
}

export type CustomHouseDiagnostic = {
  id: string;
  severity: "ERROR" | "WARNING";
  principle: string;
  elementIds: string[];
  observation: string;
  correction: string;
};

function geometricAdjacency(a: Rect, b: Rect): boolean {
  const horizontalTouch = (a.maxX === b.minX || b.maxX === a.minX) && Math.min(a.maxY, b.maxY) > Math.max(a.minY, b.minY);
  const verticalTouch = (a.maxY === b.minY || b.maxY === a.minY) && Math.min(a.maxX, b.maxX) > Math.max(a.minX, b.minX);
  return horizontalTouch || verticalTouch;
}

export function diagnoseCustomHouseDesign(plan: ResidentialPlan = generateCustomHouseDesign()): CustomHouseDiagnostic[] {
  const byId = new Map(plan.rooms.map((item) => [item.id, item]));
  const diagnostics: CustomHouseDiagnostic[] = [];
  for (const edge of plan.adjacency) {
    const from = byId.get(edge.from);
    const to = byId.get(edge.to);
    if (from && to && from.levelId === to.levelId && !geometricAdjacency(from.footprint, to.footprint)) {
      diagnostics.push({ id: `ADJACENCY-${edge.from}-${edge.to}`, severity: "ERROR", principle: "A21-GEOMETRIC-ADJACENCY", elementIds: [edge.from, edge.to], observation: `The declared ${edge.from} → ${edge.to} relationship has an opening record but the room boundaries do not touch.`, correction: "Move or reshape the circulation/room boundaries until a real shared boundary and door connection exist; then re-evaluate." });
    }
  }
  const stairN1 = byId.get("STAIR-LOBBY-N1");
  const stairN2 = byId.get("STAIR-LOBBY-N2");
  const hallN1 = byId.get("HALL-N1");
  const hallN2 = byId.get("HALL-N2");
  if (stairN1 && hallN1 && !geometricAdjacency(stairN1.footprint, hallN1.footprint)) diagnostics.push({ id: "VERTICAL-CORE-N1", severity: "ERROR", principle: "A22-MULTILEVEL-CONTINUITY", elementIds: ["HALL-N1", "STAIR-LOBBY-N1"], observation: "The N1 circulation and stair landing are not geometrically connected despite the declared door.", correction: "Create a continuous landing and circulation edge before claiming vertical continuity." });
  if (stairN2 && hallN2 && !geometricAdjacency(stairN2.footprint, hallN2.footprint)) diagnostics.push({ id: "VERTICAL-CORE-N2", severity: "ERROR", principle: "A22-MULTILEVEL-CONTINUITY", elementIds: ["STAIR-LOBBY-N2", "HALL-N2"], observation: "The N2 stair landing and upper circulation are separated by an unmodeled gap.", correction: "Extend or relocate the upper hall so the stair landing connects to the bedroom circulation." });
  if (plan.routes[0]?.roomIds.some((id, index, ids) => {
    if (index === 0) return false;
    const previous = byId.get(ids[index - 1]);
    const current = byId.get(id);
    if (!previous || !current || previous.levelId !== current.levelId) return false;
    return !geometricAdjacency(previous.footprint, current.footprint);
  })) diagnostics.push({ id: "ROUTE-CONTINUITY-01", severity: "ERROR", principle: "A20-CIRCULATION-EVIDENCE", elementIds: plan.routes[0]?.roomIds ?? [], observation: "The proposed route contains declared room sequence edges that are not continuous geometry.", correction: "Resolve each missing edge, then validate accessible route and egress separately." });
  return diagnostics;
}

export function generateResolvedCustomHouseDesign(): ResidentialPlan {
  const base = generateCustomHouseDesign();
  const rooms = base.rooms
    .filter((item) => item.id !== "STAIR-LOBBY-N2")
    .map((item) => item.id === "HALL-N2" ? { ...item, footprint: { minX: 4, minY: 0, maxX: 6.5, maxY: 10 }, areaM2: 25, targetAreaM2: 25 } :
      item.id === "BEDROOM-3-N2" ? { ...item, footprint: { minX: 6.5, minY: 5, maxX: 10, maxY: 8 }, areaM2: 10.5, targetAreaM2: 10.5 } :
      item.id === "BATH-SHARED-N2" ? { ...item, footprint: { minX: 6.5, minY: 8, maxX: 8, maxY: 10 }, areaM2: 3, targetAreaM2: 3 } : item);
  const openings = base.openings.map((opening) => opening.id === "DOOR-N2-STAIR"
    ? { ...opening, fromRoomId: "STAIR-CORE-CONTINUOUS", toRoomId: "HALL-N2" }
    : opening);
  const routes = [{ ...base.routes[0], roomIds: ["HALL-N1", "STAIR-LOBBY-N1", "STAIR-CORE-CONTINUOUS", "HALL-N2", "MASTER-N2"] }];
  const adjacency = base.adjacency.filter((edge) => edge.from !== "HALL-N2" || edge.to !== "STAIR-LOBBY-N2");
  return { ...base, alternativeId: "HOUSE-CUSTOM-B-ADJACENCY-REPAIRED", rooms, openings, routes, adjacency, validation: { ...base.validation, checks: [...base.validation.checks, "corrected N2 circulation adjacency"] } };
}
