import { A26_MATERIALS, selectSustainableMaterial, type A26MaterialSelection } from "./a26SustainableArchitecturalEvaluation";

export type Rect = { minX: number; minY: number; maxX: number; maxY: number };
export type ResidentialRoom = { id: string; name: string; levelId: string; programId: string; zone: "PUBLIC" | "PRIVATE" | "SERVICE" | "CIRCULATION"; footprint: Rect; targetAreaM2: number; areaM2: number; status: "EXPLICIT_GEOMETRY" };
export type ResidentialWall = { id: string; levelId: string; from: [number, number]; to: [number, number]; thicknessM: number; role: "EXTERNAL" | "PARTITION" };
export type ResidentialOpening = { id: string; levelId: string; fromRoomId: string; toRoomId: string; kind: "DOOR" | "WINDOW"; widthM: number; status: "PROPOSED" | "VERIFIED_CLEARANCE"; clearDistanceToOpposingObstructionM?: number };
export type ResidentialCore = { id: string; levelIds: string[]; footprint: Rect; kind: "STAIR" | "SERVICE_DUCT"; continuity: "CONTINUOUS" | "PROPOSED" };
export type ResidentialRoute = { id: string; levelIds: string[]; roomIds: string[]; widthM: number; accessible: "PROPOSED" | "VERIFIED_GEOMETRY" | "NOT_ASSESSED"; egress: "PROPOSED" | "NOT_ASSESSED" };
export type ResidentialPlan = { projectId: string; alternativeId: string; site: Rect; rooms: ResidentialRoom[]; walls: ResidentialWall[]; openings: ResidentialOpening[]; cores: ResidentialCore[]; routes: ResidentialRoute[]; adjacency: Array<{ from: string; to: string; kind: "REQUIRED" | "PREFERRED"; evidence: "GEOMETRIC_OPENING" | "DECLARED_PROGRAM" }>; materialSelection: A26MaterialSelection; carbonSummary: { grossAreaM2: number; selectedMaterial: string; carbonLowKgCo2e: number; carbonHighKgCo2e: number; carbonMidKgCo2e: number; state: "ILLUSTRATIVE_PROXY"; carbonIsNotLca: true }; validation: { state: "SUPPORTED" | "PARTIAL" | "CONFLICTING"; checks: string[]; conflicts: string[]; humanReviewRequired: true; constructionDocumentation: "NOT_GENERATED" } };

const area = (r: Rect) => Math.max(0, r.maxX - r.minX) * Math.max(0, r.maxY - r.minY);
const contains = (outer: Rect, inner: Rect) => inner.minX >= outer.minX && inner.minY >= outer.minY && inner.maxX <= outer.maxX && inner.maxY <= outer.maxY;
const overlaps = (a: Rect, b: Rect) => a.minX < b.maxX && a.maxX > b.minX && a.minY < b.maxY && a.maxY > b.minY;
const sameLevel = (a: ResidentialRoom, b: ResidentialRoom) => a.levelId === b.levelId;

function wall(id: string, levelId: string, from: [number, number], to: [number, number], role: ResidentialWall["role"]): ResidentialWall { return { id, levelId, from, to, thicknessM: 0.15, role }; }

export function generateVerifiedResidentialPlan(): ResidentialPlan {
  const site = { minX: 0, minY: 0, maxX: 10, maxY: 8 };
  const rooms: ResidentialRoom[] = [
    { id: "LIVING", name: "Living / dining", levelId: "N1", programId: "LIVING", zone: "PUBLIC", footprint: { minX: 0.5, minY: 0.5, maxX: 5.5, maxY: 4.0 }, targetAreaM2: 17.5, areaM2: 17.5, status: "EXPLICIT_GEOMETRY" },
    { id: "KITCHEN", name: "Kitchen", levelId: "N1", programId: "KITCHEN", zone: "SERVICE", footprint: { minX: 5.5, minY: 0.5, maxX: 9.5, maxY: 3.0 }, targetAreaM2: 10, areaM2: 10, status: "EXPLICIT_GEOMETRY" },
    { id: "HALL-N1", name: "Ground circulation", levelId: "N1", programId: "CIRCULATION", zone: "CIRCULATION", footprint: { minX: 0.5, minY: 4.0, maxX: 9.5, maxY: 4.8 }, targetAreaM2: 7.2, areaM2: 7.2, status: "EXPLICIT_GEOMETRY" },
    { id: "BED-01", name: "Bedroom 1", levelId: "N2", programId: "BEDROOM", zone: "PRIVATE", footprint: { minX: 0.5, minY: 0.5, maxX: 5.0, maxY: 3.5 }, targetAreaM2: 13.5, areaM2: 13.5, status: "EXPLICIT_GEOMETRY" },
    { id: "BED-02", name: "Bedroom 2", levelId: "N2", programId: "BEDROOM", zone: "PRIVATE", footprint: { minX: 5.0, minY: 0.5, maxX: 9.5, maxY: 3.5 }, targetAreaM2: 13.5, areaM2: 13.5, status: "EXPLICIT_GEOMETRY" },
    { id: "BATH", name: "Bathroom", levelId: "N2", programId: "BATHROOM", zone: "SERVICE", footprint: { minX: 0.5, minY: 3.5, maxX: 3.5, maxY: 5.8 }, targetAreaM2: 6.9, areaM2: 6.9, status: "EXPLICIT_GEOMETRY" },
    { id: "HALL-N2", name: "Upper circulation", levelId: "N2", programId: "CIRCULATION", zone: "CIRCULATION", footprint: { minX: 3.5, minY: 3.5, maxX: 9.5, maxY: 4.3 }, targetAreaM2: 4.8, areaM2: 4.8, status: "EXPLICIT_GEOMETRY" },
  ];
  const walls = [
    wall("EXT-N1-W", "N1", [0, 0], [10, 0], "EXTERNAL"), wall("EXT-N1-E", "N1", [10, 0], [10, 8], "EXTERNAL"), wall("EXT-N1-N", "N1", [10, 8], [0, 8], "EXTERNAL"), wall("EXT-N1-S", "N1", [0, 8], [0, 0], "EXTERNAL"),
    wall("EXT-N2-W", "N2", [0, 0], [10, 0], "EXTERNAL"), wall("EXT-N2-E", "N2", [10, 0], [10, 8], "EXTERNAL"), wall("EXT-N2-N", "N2", [10, 8], [0, 8], "EXTERNAL"), wall("EXT-N2-S", "N2", [0, 8], [0, 0], "EXTERNAL"),
    wall("PART-N1-01", "N1", [5.5, 0.5], [5.5, 4], "PARTITION"), wall("PART-N2-01", "N2", [5, 0.5], [5, 3.5], "PARTITION"), wall("PART-N2-02", "N2", [0.5, 3.5], [9.5, 3.5], "PARTITION"),
  ];
  const openings: ResidentialOpening[] = [
    { id: "DOOR-ENTRY", levelId: "N1", fromRoomId: "LIVING", toRoomId: "HALL-N1", kind: "DOOR", widthM: 0.9, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-LIVING-KITCHEN", levelId: "N1", fromRoomId: "LIVING", toRoomId: "KITCHEN", kind: "DOOR", widthM: 0.9, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-BED-01", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "BED-01", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-BED-02", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "BED-02", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "DOOR-BATH", levelId: "N2", fromRoomId: "HALL-N2", toRoomId: "BATH", kind: "DOOR", widthM: 0.8, status: "VERIFIED_CLEARANCE" },
    { id: "WINDOW-LIVING", levelId: "N1", fromRoomId: "LIVING", toRoomId: "EXTERIOR", kind: "WINDOW", widthM: 1.8, status: "PROPOSED" },
  ];
  const cores: ResidentialCore[] = [{ id: "STAIR-CORE", levelIds: ["N1", "N2"], footprint: { minX: 8.0, minY: 4.8, maxX: 9.5, maxY: 7.5 }, kind: "STAIR", continuity: "PROPOSED" }, { id: "DUCT-CORE", levelIds: ["N1", "N2"], footprint: { minX: 3.7, minY: 5.0, maxX: 4.3, maxY: 5.6 }, kind: "SERVICE_DUCT", continuity: "PROPOSED" }];
  const routes: ResidentialRoute[] = [{ id: "ACCESSIBLE-ROUTE-CONCEPT", levelIds: ["N1", "N2"], roomIds: ["LIVING", "HALL-N1", "STAIR-CORE", "HALL-N2", "BED-01"], widthM: 0.9, accessible: "PROPOSED", egress: "PROPOSED" }];
  const adjacency = [{ from: "LIVING", to: "KITCHEN", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const }, { from: "LIVING", to: "HALL-N1", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const }, { from: "HALL-N2", to: "BED-01", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const }, { from: "HALL-N2", to: "BED-02", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const }, { from: "HALL-N2", to: "BATH", kind: "REQUIRED" as const, evidence: "GEOMETRIC_OPENING" as const }];
  const grossAreaM2 = rooms.reduce((sum, room) => sum + room.areaM2, 0); const materialSelection = selectSustainableMaterial("HOUSING", grossAreaM2, { budgetUsd: grossAreaM2 * 220, carbonTargetKgCo2e: grossAreaM2 * 140 }); const selected = materialSelection.candidates.find((item) => item.materialId === materialSelection.selectedMaterialId); const profile = A26_MATERIALS.find((item) => item.materialId === materialSelection.selectedMaterialId);
  const conflicts: string[] = []; if (rooms.some((room) => !contains(site, room.footprint))) conflicts.push("ROOM_OUTSIDE_SITE"); if (rooms.some((room, index) => rooms.slice(index + 1).some((other) => sameLevel(room, other) && overlaps(room.footprint, other.footprint)))) conflicts.push("ROOM_OVERLAP"); if (openings.some((opening) => !rooms.some((room) => room.id === opening.fromRoomId) || (opening.toRoomId !== "EXTERIOR" && !rooms.some((room) => room.id === opening.toRoomId)))) conflicts.push("OPENING_ENDPOINT_UNKNOWN");
  return { projectId: "HOUSE-001-EXPLICIT", alternativeId: "HOUSE-A-CONSTRUCTIVE", site, rooms, walls, openings, cores, routes, adjacency, materialSelection, carbonSummary: { grossAreaM2, selectedMaterial: selected?.materialId ?? "NOT_SELECTED", carbonLowKgCo2e: profile ? grossAreaM2 * profile.indicativeCarbonKgCo2eM2.low : 0, carbonHighKgCo2e: profile ? grossAreaM2 * profile.indicativeCarbonKgCo2eM2.high : 0, carbonMidKgCo2e: selected?.estimatedCarbonKgCo2e ?? 0, state: "ILLUSTRATIVE_PROXY", carbonIsNotLca: true }, validation: { state: conflicts.length ? "CONFLICTING" : "PARTIAL", checks: ["room boundaries", "site containment", "same-level overlap", "door endpoints", "required adjacency through openings", "vertical core identity", "service duct identity", "route width recorded"], conflicts, humanReviewRequired: true, constructionDocumentation: "NOT_GENERATED" } };
}

export type RoomOperation = "MOVE_ROOM" | "RESIZE_ROOM" | "OFFSET_ROOM" | "RESHAPE_SPATIAL_ELEMENT" | "EDIT_ROOM";
export function applyRoomOperation(plan: ResidentialPlan, operation: RoomOperation, roomId: string, delta: { dx?: number; dy?: number; width?: number; depth?: number }): { ok: boolean; plan: ResidentialPlan; errors: string[] } {
  const room = plan.rooms.find((item) => item.id === roomId); if (!room) return { ok: false, plan, errors: ["ROOM_NOT_FOUND"] }; const dx = delta.dx ?? 0; const dy = delta.dy ?? 0; const width = delta.width ?? room.footprint.maxX - room.footprint.minX; const depth = delta.depth ?? room.footprint.maxY - room.footprint.minY; const nextFootprint = { minX: room.footprint.minX + dx, minY: room.footprint.minY + dy, maxX: room.footprint.minX + dx + width, maxY: room.footprint.minY + dy + depth }; const errors: string[] = []; if (!contains(plan.site, nextFootprint)) errors.push("ROOM_OUTSIDE_SITE"); if (plan.rooms.some((other) => other.id !== roomId && sameLevel(room, other) && overlaps(nextFootprint, other.footprint))) errors.push("ROOM_OVERLAP"); if (width < 1.8 || depth < 1.8) errors.push("ROOM_MINIMUM_DIMENSION_NOT_MET"); if (errors.length) return { ok: false, plan, errors }; const rooms = plan.rooms.map((item) => item.id === roomId ? { ...item, footprint: nextFootprint, areaM2: area(nextFootprint) } : item); return { ok: true, plan: { ...plan, rooms, validation: { ...plan.validation, state: "PARTIAL", conflicts: [] } }, errors: [] };
}
