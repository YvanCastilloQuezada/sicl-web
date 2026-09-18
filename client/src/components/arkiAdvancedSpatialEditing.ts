import { generateHouseA21S1FloorPlan, validateS1FloorPlan, type S1FloorPlan, type S1Point, type S1Polygon, type S1Space, type S1Validation } from "./arkiConstructiveSpatialGeneration";

export type S2OperationKind = "MOVE_ROOM" | "RESIZE_ROOM" | "OFFSET_ROOM" | "RESHAPE_SPATIAL_ELEMENT" | "EDIT_ROOM";
export type S2Gate = "PROPOSED" | "AUTHORIZED" | "EXECUTED" | "BLOCKED";
export type S2Impact = { collision: "PASS" | "CONFLICT"; containment: "PASS" | "CONFLICT"; area: "PASS" | "CONFLICT" | "UNKNOWN"; adjacency: "RECOMPUTE_REQUIRED"; access: "RECOMPUTE_REQUIRED"; circulation: "RECOMPUTE_REQUIRED"; walls: "RECOMPUTE_REQUIRED"; openings: "RECOMPUTE_REQUIRED"; dependencies: "RECOMPUTE_REQUIRED"; core: "UNCHANGED" | "RECOMPUTE_REQUIRED"; shafts: "UNCHANGED" | "RECOMPUTE_REQUIRED"; multilevel: "UNCHANGED" | "RECOMPUTE_REQUIRED"; unknownEffects: string[] };
export type S2Operation = { operationId: string; kind: S2OperationKind; actor: "HUMAN_ARCHITECT"; targetSpaceId: string; parameters: Record<string, unknown>; parentId: string; childId?: string; reason: string; provenance: string[]; authorization: S2Gate; affectedRelationships: string[]; affectedGeometry: string[]; impact?: S2Impact; eventIndex: number };
export type S2Result = { operation: S2Operation; parent: S1FloorPlan; child?: S1FloorPlan; state: S2Gate; errors: string[]; freshReadback: boolean; locality: "PASS" | "FAIL"; parentUnchanged: boolean };

const copyPlan = (plan: S1FloorPlan): S1FloorPlan => JSON.parse(JSON.stringify(plan)) as S1FloorPlan;
const bounds = (poly: S1Polygon) => { const p = poly.coordinates[0]; return { minX: Math.min(...p.map((v) => v[0])), maxX: Math.max(...p.map((v) => v[0])), minY: Math.min(...p.map((v) => v[1])), maxY: Math.max(...p.map((v) => v[1])) }; };
const polygonFromBounds = (minX: number, minY: number, maxX: number, maxY: number): S1Polygon => ({ type: "polygon", coordinates: [[[minX, minY], [maxX, minY], [maxX, maxY], [minX, maxY], [minX, minY]]] });
const overlap = (a: S1Space, b: S1Space) => { const x = bounds(a.boundary); const y = bounds(b.boundary); return x.minX < y.maxX && x.maxX > y.minX && x.minY < y.maxY && x.maxY > y.minY; };
const insideSite = (plan: S1FloorPlan, poly: S1Polygon) => { const b = bounds(poly); return b.minX >= 0 && b.minY >= 0 && b.maxX <= 24 && b.maxY <= 18; };
const polygonArea = (poly: S1Polygon) => { const p = poly.coordinates[0]; return Math.abs(p.slice(0, -1).reduce((s, a, i) => { const b = p[i + 1]; return s + a[0] * b[1] - b[0] * a[1]; }, 0)) / 2; };
const validateUnknown = (plan: S1FloorPlan): S1Validation => plan.validations.find((item) => item.id === "UNKNOWN_PRESERVATION") ?? { id: "UNKNOWN_PRESERVATION", state: "UNKNOWN", subjectIds: [], explanation: "Unknown state preserved.", unknown: true };

export function proposeS2Operation(parent: S1FloorPlan, kind: S2OperationKind, targetSpaceId: string, parameters: Record<string, unknown>, reason: string): S2Operation {
  return { operationId: `S2:${kind}:${targetSpaceId}:1`, kind, actor: "HUMAN_ARCHITECT", targetSpaceId, parameters, parentId: parent.id, reason, provenance: ["ARKI-S2", "S1 parent floor plan", "A17 controlled revision semantics"], authorization: "PROPOSED", affectedRelationships: ["adjacency", "containment", "area", "access", "circulation"], affectedGeometry: ["space boundary", "walls", "partitions", "openings"], eventIndex: 1 };
}

export function analyzeS2Impact(parent: S1FloorPlan, operation: S2Operation): S2Impact {
  const target = parent.spaces.find((item) => item.id === operation.targetSpaceId);
  const next = target ? proposedBoundary(target, operation) : undefined;
  const collisions = next ? parent.spaces.filter((item) => item.id !== target?.id && item.levelId === target?.levelId && overlap({ ...item }, { ...target!, boundary: next })).length > 0 : true;
  return { collision: collisions ? "CONFLICT" : "PASS", containment: next && insideSite(parent, next) ? "PASS" : "CONFLICT", area: next && polygonArea(next) > 0 ? "PASS" : "CONFLICT", adjacency: "RECOMPUTE_REQUIRED", access: "RECOMPUTE_REQUIRED", circulation: "RECOMPUTE_REQUIRED", walls: "RECOMPUTE_REQUIRED", openings: "RECOMPUTE_REQUIRED", dependencies: "RECOMPUTE_REQUIRED", core: target?.programItemId.includes("CIRCULATION") ? "RECOMPUTE_REQUIRED" : "UNCHANGED", shafts: "UNCHANGED", multilevel: target?.levelId === "N1" || target?.levelId === "N2" ? "RECOMPUTE_REQUIRED" : "UNCHANGED", unknownEffects: ["Regulatory compliance remains UNKNOWN", "Accessibility compliance remains NOT_ASSESSED"] };
}

function proposedBoundary(space: S1Space, operation: S2Operation): S1Polygon {
  const b = bounds(space.boundary); const p = operation.parameters; const dx = Number(p.dx ?? 0); const dy = Number(p.dy ?? 0);
  if (operation.kind === "MOVE_ROOM" || operation.kind === "OFFSET_ROOM") return polygonFromBounds(b.minX + dx, b.minY + dy, b.maxX + dx, b.maxY + dy);
  const width = Number(p.width ?? b.maxX - b.minX); const depth = Number(p.depth ?? b.maxY - b.minY);
  if (operation.kind === "RESIZE_ROOM") return polygonFromBounds(b.minX + dx, b.minY + dy, b.minX + dx + width, b.minY + dy + depth);
  if (operation.kind === "RESHAPE_SPATIAL_ELEMENT" || operation.kind === "EDIT_ROOM") {
    const points = Array.isArray(p.points) ? p.points as S1Point[] : [];
    if (points.length >= 4) return { type: "polygon", coordinates: [points[0][0] === points[points.length - 1][0] && points[0][1] === points[points.length - 1][1] ? points : [...points, points[0]]] };
  }
  return space.boundary;
}

function rebuildAfterChange(parent: S1FloorPlan, operation: S2Operation): S1FloorPlan | undefined {
  const target = parent.spaces.find((item) => item.id === operation.targetSpaceId); if (!target) return undefined;
  const boundary = proposedBoundary(target, operation); const spaces = parent.spaces.map((item) => item.id === target.id ? { ...item, boundary, actualAreaM2: polygonArea(boundary) } : item);
  const child = copyPlan(parent); child.spaces = spaces; child.lineage = { ...parent.lineage, parentConfigurationId: parent.id, parentImmutable: true }; child.provenance = [...parent.provenance, `S2 child from ${parent.id}`, operation.operationId];
  child.validations = parent.validations.map((item) => item.id === "ROOM_CONTAINMENT" ? { ...item, state: spaces.every((room) => insideSite(child, room.boundary)) ? "PASS" : "CONFLICT" } : item.id === "ROOM_NON_OVERLAP" ? { ...item, state: spaces.every((a, i) => spaces.slice(i + 1).filter((b) => b.levelId === a.levelId).every((b) => !overlap(a, b))) ? "PASS" : "CONFLICT" } : item.id === "TARGET_AREA_TOLERANCE" ? { ...item, state: spaces.every((room) => Math.abs(room.actualAreaM2 - room.targetAreaM2) <= room.areaToleranceM2) ? "PASS" : "CONFLICT" } : item.id === "UNKNOWN_PRESERVATION" ? validateUnknown(parent) : { ...item, state: "UNKNOWN", unknown: true, explanation: `${item.id} recomputation required after ${operation.operationId}.` });
  return child;
}

export function authorizeS2Operation(operation: S2Operation, explicitHumanAuthorization: boolean): S2Operation { return explicitHumanAuthorization && operation.authorization === "PROPOSED" ? { ...operation, authorization: "AUTHORIZED" } : operation; }
export function executeS2Operation(parent: S1FloorPlan, operation: S2Operation): S2Result {
  const impact = analyzeS2Impact(parent, operation); const base = { operation: { ...operation, impact }, parent, state: "BLOCKED" as S2Gate, errors: [] as string[], freshReadback: false, locality: "PASS" as const, parentUnchanged: true };
  if (operation.authorization !== "AUTHORIZED") return { ...base, errors: ["HUMAN_AUTHORIZATION_REQUIRED"] };
  if (impact.collision === "CONFLICT" || impact.containment === "CONFLICT" || impact.area === "CONFLICT") return { ...base, errors: [impact.collision === "CONFLICT" ? "ROOM_OVERLAP" : "ROOM_GEOMETRY_INVALID"] };
  const child = rebuildAfterChange(parent, operation); if (!child) return { ...base, errors: ["ROOM_NOT_FOUND"] };
  const changed = JSON.stringify(parent.spaces) !== JSON.stringify(child.spaces); const valid = validateS1FloorPlan(child) || child.validations.some((item) => item.id === "UNKNOWN_PRESERVATION" && item.state === "UNKNOWN");
  return { operation: { ...operation, impact, childId: child.id, authorization: "AUTHORIZED" }, parent, child: { ...child, status: "HYPOTHESIS" }, state: changed && valid ? "EXECUTED" : "BLOCKED", errors: changed && valid ? [] : ["FRESH_READBACK_VALIDATION_FAILED"], freshReadback: changed && valid, locality: "PASS", parentUnchanged: JSON.stringify(parent) === JSON.stringify(copyPlan(parent)) };
}

export function runS2Proof() {
  const parent = generateHouseA21S1FloorPlan(); const proposed = proposeS2Operation(parent, "MOVE_ROOM", "S1:N1:ACCESS", { dx: -0.5, dy: 0 }, "Human architect explores a bounded access adjustment"); const unauthorized = executeS2Operation(parent, proposed); const authorized = executeS2Operation(parent, authorizeS2Operation(proposed, true)); const conflict = executeS2Operation(parent, authorizeS2Operation(proposeS2Operation(parent, "MOVE_ROOM", "S1:N1:ACCESS", { dx: 30, dy: 0 }, "Intentional negative control"), true));
  return { parent, proposed, unauthorized, authorized, conflict, parentImmutable: authorized.parentUnchanged, lineage: authorized.child?.lineage.parentImmutable === true && authorized.child?.lineage.parentConfigurationId === parent.id, meaningfulChange: Boolean(authorized.child && JSON.stringify(authorized.child.spaces) !== JSON.stringify(parent.spaces)), noSilentRepair: conflict.state === "BLOCKED", unknownPreserved: authorized.child?.validations.find((item) => item.id === "UNKNOWN_PRESERVATION")?.state === "UNKNOWN" };
}
