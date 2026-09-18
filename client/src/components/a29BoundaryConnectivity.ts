import type { Rect, ResidentialPlan, ResidentialRoom } from "./residentialConstructivePlan";

export type BoundaryClass = "EXTERIOR" | "INTERIOR_SHARED" | "UNSHARED_SPACE_BOUNDARY" | "INTERIOR_UNRESOLVED" | "DEGENERATE" | "UNKNOWN";
export type BoundaryRelation = "SHARED_BOUNDARY" | "POINT_CONTACT" | "NO_SHARED_SEGMENT" | "OVERLAP_CONFLICT";
export type ConnectionState = "NO_CONNECTION_EVIDENCE" | "CONNECTION_INTENDED" | "CONNECTION_OBSERVED" | "CONNECTION_HUMAN_CONFIRMED" | "CONNECTION_CONFLICTING" | "CONNECTION_UNKNOWN";
export type ConnectionType = "DIRECT" | "CONTROLLED" | "CIRCULATION_MEDIATED" | "VERTICAL" | "VISUAL_ONLY" | "INTENDED" | "UNKNOWN";
export type AccessState = "ACCESS_OBSERVED" | "ACCESS_INTENDED" | "ACCESS_HUMAN_CONFIRMED" | "ACCESS_UNVERIFIED" | "ACCESS_UNKNOWN";
export type BoundarySegment = { x1: number; y1: number; x2: number; y2: number };
export type ArchitecturalBoundaryObservation = { boundaryId: string; spaceId: string; programItemId: string; levelId: string; sourceSpatialElementId: string; segment: BoundarySegment; classification: BoundaryClass; relatedSpaceId?: string; relationship: BoundaryRelation; sourceAlternative: string; geometryVersion: string; provenance: string[]; epistemicState: "DERIVED" | "UNKNOWN" | "CONFLICT" };
export type ArchitecturalConnectionObservation = { connectionId: string; fromSpaceId: string; toSpaceId: string; levelId: string; boundaryRefs: string[]; connectionType: ConnectionType; state: ConnectionState; evidenceRefs: string[]; provenance: string[]; epistemicState: "DERIVED" | "UNKNOWN" | "CONFLICT"; humanReviewState: "REQUIRED" | "NOT_REQUIRED"; circulationRef?: string; sourceAlternative: string };
export type IntentObservationResult = "GEOMETRIC_ADJACENCY_OBSERVED" | "ACCESS_UNVERIFIED" | "POTENTIAL_RELATIONSHIP_CONFLICT" | "INTENT_NOT_OBSERVED" | "NO_INTENT";
export type IntentObservation = { intentType: "REQUIRED_ADJACENCY" | "PREFERRED_ADJACENCY" | "DIRECT_ACCESS_REQUIRED" | "REQUIRED_SEPARATION"; from: string; to: string; result: IntentObservationResult; evidenceRefs: string[]; humanReviewRequired: true };
export type A29ReadModel = { alternativeId: string; geometryVersion: string; boundaries: ArchitecturalBoundaryObservation[]; connections: ArchitecturalConnectionObservation[]; intentObservations: IntentObservation[]; accessStates: Array<{ routeId: string; roomId: string; state: AccessState; source: string }>; warnings: string[] };

const EPS = 1e-9;
const segmentLength = (s: BoundarySegment) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1);
const normalize = (s: BoundarySegment): BoundarySegment => s.x1 < s.x2 || (Math.abs(s.x1 - s.x2) < EPS && s.y1 <= s.y2) ? s : { x1: s.x2, y1: s.y2, x2: s.x1, y2: s.y1 };
function rectSegments(r: Rect): BoundarySegment[] { return [{ x1: r.minX, y1: r.minY, x2: r.maxX, y2: r.minY }, { x1: r.maxX, y1: r.minY, x2: r.maxX, y2: r.maxY }, { x1: r.maxX, y1: r.maxY, x2: r.minX, y2: r.maxY }, { x1: r.minX, y1: r.maxY, x2: r.minX, y2: r.minY }].map(normalize); }
function overlap1D(a1: number, a2: number, b1: number, b2: number): [number, number] | undefined { const lo = Math.max(Math.min(a1, a2), Math.min(b1, b2)); const hi = Math.min(Math.max(a1, a2), Math.max(b1, b2)); return hi - lo > EPS ? [lo, hi] : undefined; }
function sharedSegment(a: BoundarySegment, b: BoundarySegment): BoundarySegment | undefined {
  const horizontal = Math.abs(a.y1 - a.y2) < EPS && Math.abs(b.y1 - b.y2) < EPS && Math.abs(a.y1 - b.y1) < EPS;
  if (horizontal) { const o = overlap1D(a.x1, a.x2, b.x1, b.x2); return o ? normalize({ x1: o[0], y1: a.y1, x2: o[1], y2: a.y1 }) : undefined; }
  const vertical = Math.abs(a.x1 - a.x2) < EPS && Math.abs(b.x1 - b.x2) < EPS && Math.abs(a.x1 - b.x1) < EPS;
  if (vertical) { const o = overlap1D(a.y1, a.y2, b.y1, b.y2); return o ? normalize({ x1: a.x1, y1: o[0], x2: a.x1, y2: o[1] }) : undefined; }
  return undefined;
}
function samePoint(a: BoundarySegment, b: BoundarySegment) { return (Math.abs(a.x1 - b.x1) < EPS && Math.abs(a.y1 - b.y1) < EPS) || (Math.abs(a.x1 - b.x2) < EPS && Math.abs(a.y1 - b.y2) < EPS) || (Math.abs(a.x2 - b.x1) < EPS && Math.abs(a.y2 - b.y1) < EPS) || (Math.abs(a.x2 - b.x2) < EPS && Math.abs(a.y2 - b.y2) < EPS); }
function id(alternative: string, room: string, segment: BoundarySegment) { return `${alternative}:${room}:${segment.x1.toFixed(3)},${segment.y1.toFixed(3)}-${segment.x2.toFixed(3)},${segment.y2.toFixed(3)}`; }

export function deriveA29Boundaries(plan: ResidentialPlan): ArchitecturalBoundaryObservation[] {
  const result: ArchitecturalBoundaryObservation[] = [];
  for (const room of plan.rooms) {
    const own = rectSegments(room.footprint);
    own.forEach((segment, index) => {
      const related = plan.rooms.filter((other) => other.id !== room.id && other.levelId === room.levelId).flatMap((other) => rectSegments(other.footprint).map((otherSegment) => ({ other, shared: sharedSegment(segment, otherSegment) }))).find((item) => item.shared);
      const boundaryId = id(plan.alternativeId, room.id, segment);
      result.push({ boundaryId, spaceId: room.id, programItemId: room.programId, levelId: room.levelId, sourceSpatialElementId: room.id, segment, classification: related ? "INTERIOR_SHARED" : "UNSHARED_SPACE_BOUNDARY", relatedSpaceId: related?.other.id, relationship: related ? "SHARED_BOUNDARY" : "NO_SHARED_SEGMENT", sourceAlternative: plan.alternativeId, geometryVersion: "HOUSE-001-EXPLICIT:v1", provenance: [`residentialConstructivePlan.room.${room.id}`, `segment.${index}`], epistemicState: "DERIVED" });
    });
  }
  return result;
}

export function deriveA29Connections(plan: ResidentialPlan, boundaries = deriveA29Boundaries(plan)): ArchitecturalConnectionObservation[] {
  const result: ArchitecturalConnectionObservation[] = [];
  for (const opening of plan.openings.filter((item) => item.kind === "DOOR" && item.toRoomId !== "EXTERIOR")) {
    const refs = boundaries.filter((boundary) => (boundary.spaceId === opening.fromRoomId || boundary.spaceId === opening.toRoomId) && boundary.relatedSpaceId && ((boundary.spaceId === opening.fromRoomId && boundary.relatedSpaceId === opening.toRoomId) || (boundary.spaceId === opening.toRoomId && boundary.relatedSpaceId === opening.fromRoomId))).map((boundary) => boundary.boundaryId);
    const room = plan.rooms.find((item) => item.id === opening.fromRoomId);
    result.push({ connectionId: `${plan.alternativeId}:${opening.id}`, fromSpaceId: opening.fromRoomId, toSpaceId: opening.toRoomId, levelId: opening.levelId, boundaryRefs: refs, connectionType: refs.length ? "DIRECT" : "UNKNOWN", state: refs.length ? "CONNECTION_OBSERVED" : "CONNECTION_UNKNOWN", evidenceRefs: [opening.id, ...refs], provenance: [`residentialConstructivePlan.opening.${opening.id}`], epistemicState: refs.length ? "DERIVED" : "UNKNOWN", humanReviewState: opening.status === "VERIFIED_CLEARANCE" ? "NOT_REQUIRED" : "REQUIRED", circulationRef: plan.routes.find((route) => route.roomIds.includes(opening.fromRoomId) && route.roomIds.includes(opening.toRoomId))?.id, sourceAlternative: plan.alternativeId });
    if (!room) result[result.length - 1].state = "CONNECTION_CONFLICTING";
  }
  return result;
}

export function deriveA29IntentObservations(plan: ResidentialPlan, boundaries = deriveA29Boundaries(plan), connections = deriveA29Connections(plan, boundaries)): IntentObservation[] {
  return plan.adjacency.map((intent) => {
    const shared = boundaries.some((boundary) => boundary.spaceId === intent.from && boundary.relatedSpaceId === intent.to && boundary.relationship === "SHARED_BOUNDARY");
    const connection = connections.find((item) => (item.fromSpaceId === intent.from && item.toSpaceId === intent.to) || (item.fromSpaceId === intent.to && item.toSpaceId === intent.from));
    const result: IntentObservationResult = intent.kind === "REQUIRED" && shared ? (connection ? "GEOMETRIC_ADJACENCY_OBSERVED" : "ACCESS_UNVERIFIED") : intent.kind === "REQUIRED" ? "INTENT_NOT_OBSERVED" : "NO_INTENT";
    return { intentType: intent.kind === "REQUIRED" ? "REQUIRED_ADJACENCY" : "PREFERRED_ADJACENCY", from: intent.from, to: intent.to, result, evidenceRefs: [intent.from, intent.to, ...(connection?.evidenceRefs ?? [])], humanReviewRequired: true };
  });
}

export function buildA29ReadModel(plan: ResidentialPlan): A29ReadModel {
  const boundaries = deriveA29Boundaries(plan); const connections = deriveA29Connections(plan, boundaries); const intentObservations = deriveA29IntentObservations(plan, boundaries, connections);
  return { alternativeId: plan.alternativeId, geometryVersion: "HOUSE-001-EXPLICIT:v1", boundaries, connections, intentObservations, accessStates: plan.routes.flatMap((route) => route.roomIds.map((roomId) => ({ routeId: route.id, roomId, state: route.accessible === "VERIFIED_GEOMETRY" ? "ACCESS_OBSERVED" : "ACCESS_UNVERIFIED" as AccessState, source: "A20-P2 / ResidentialRoute" }))), warnings: ["Shared boundary does not prove a door or connection.", "Connection does not prove an accessible route.", "Unshared space boundary is not automatically an exterior wall.", "No WALL, DOOR or WINDOW entity is created by this read model."] };
}
