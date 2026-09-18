import type { BoundarySegment, ArchitecturalBoundaryObservation, A29ReadModel } from "./a29BoundaryConnectivity";
import { buildA29ReadModel, deriveA29Boundaries, deriveA29Connections } from "./a29BoundaryConnectivity";
import type { ResidentialPlan } from "./residentialConstructivePlan";

export type A30OpeningRole = "PASSAGE_CANDIDATE" | "VISUAL_APERTURE_CANDIDATE" | "SERVICE_APERTURE_CANDIDATE" | "UNKNOWN";
export type A30Traversability = "TRAVERSABLE" | "NON_TRAVERSABLE" | "UNKNOWN";
export type A30OpeningBindingState = "VALID" | "INVALID" | "UNKNOWN" | "STALE";
export type A30OpeningEvidence = {
  openingId: string;
  hostSpaceId: string;
  relatedSpaceId?: string;
  levelId: string;
  extent?: BoundarySegment;
  role?: A30OpeningRole;
  traversability?: A30Traversability;
  sourceAlternativeId: string;
  geometryVersion: string;
  evidenceRefs: string[];
  provenance: string[];
  epistemicState: "FACT" | "HYPOTHESIS" | "DERIVED" | "UNKNOWN";
  humanReviewState: "REQUIRED" | "CONFIRMED" | "NOT_STARTED";
};
export type A30OpeningObservation = A30OpeningEvidence & {
  boundaryId?: string;
  bindingState: A30OpeningBindingState;
  positionOnBoundary?: BoundarySegment;
  visualConnectionState: "OBSERVED" | "UNKNOWN" | "NOT_APPLICABLE";
  exteriorStatus: "UNKNOWN" | "NOT_ESTABLISHED";
  staleReasons: string[];
};
export type A30OpeningConnection = {
  connectionId: string;
  openingId: string;
  fromSpaceId: string;
  toSpaceId: string;
  levelId: string;
  state: "CONNECTION_OBSERVED" | "CONNECTION_UNVERIFIED" | "CONNECTION_NOT_ESTABLISHED";
  traversability: A30Traversability;
  boundaryId?: string;
  evidenceRefs: string[];
  provenance: string[];
};

const EPS = 1e-9;
const norm = (s: BoundarySegment): BoundarySegment => s.x1 < s.x2 || (Math.abs(s.x1 - s.x2) < EPS && s.y1 <= s.y2) ? s : { x1: s.x2, y1: s.y2, x2: s.x1, y2: s.y1 };
const collinear = (a: BoundarySegment, b: BoundarySegment) => (Math.abs(a.y1 - a.y2) < EPS && Math.abs(b.y1 - b.y2) < EPS && Math.abs(a.y1 - b.y1) < EPS) || (Math.abs(a.x1 - a.x2) < EPS && Math.abs(b.x1 - b.x2) < EPS && Math.abs(a.x1 - b.x1) < EPS);
const containsExtent = (boundary: BoundarySegment, extent: BoundarySegment) => {
  if (!collinear(boundary, extent)) return false;
  const b = norm(boundary); const e = norm(extent);
  return Math.min(e.x1, e.x2) >= Math.min(b.x1, b.x2) - EPS && Math.max(e.x1, e.x2) <= Math.max(b.x1, b.x2) + EPS && Math.min(e.y1, e.y2) >= Math.min(b.y1, b.y2) - EPS && Math.max(e.y1, e.y2) <= Math.max(b.y1, b.y2) + EPS && Math.hypot(e.x2 - e.x1, e.y2 - e.y1) > EPS;
};

export function legacyOpeningEvidence(plan: ResidentialPlan): A30OpeningEvidence[] {
  return plan.openings.map((opening) => ({ openingId: opening.id, hostSpaceId: opening.fromRoomId, relatedSpaceId: opening.toRoomId === "EXTERIOR" ? undefined : opening.toRoomId, levelId: opening.levelId, role: "UNKNOWN", traversability: "UNKNOWN", sourceAlternativeId: plan.alternativeId, geometryVersion: "HOUSE-001-EXPLICIT:v1", evidenceRefs: [opening.id, `ResidentialOpening:${opening.id}`], provenance: [`residentialConstructivePlan.opening.${opening.id}`, "A30-P0 legacy opening audit"], epistemicState: "DERIVED", humanReviewState: opening.status === "VERIFIED_CLEARANCE" ? "REQUIRED" : "NOT_STARTED" }));
}

function boundaryForEvidence(evidence: A30OpeningEvidence, boundaries: ArchitecturalBoundaryObservation[]): ArchitecturalBoundaryObservation | undefined {
  const candidates = boundaries.filter((boundary) => boundary.spaceId === evidence.hostSpaceId && boundary.levelId === evidence.levelId && (!evidence.relatedSpaceId || boundary.relatedSpaceId === evidence.relatedSpaceId));
  const extent = evidence.extent;
  if (!extent) return undefined;
  return candidates.find((boundary) => containsExtent(boundary.segment, extent));
}

export function deriveA30OpeningObservations(plan: ResidentialPlan, evidence: A30OpeningEvidence[], a29: A29ReadModel = buildA29ReadModel(plan)): A30OpeningObservation[] {
  const boundaries = a29.boundaries;
  return evidence.map((item) => {
    const boundary = boundaryForEvidence(item, boundaries);
    const sameAlternative = item.sourceAlternativeId === plan.alternativeId;
    const sameGeometry = item.geometryVersion === a29.geometryVersion;
    const bindingState: A30OpeningBindingState = !sameAlternative || !sameGeometry ? "STALE" : item.extent ? boundary ? "VALID" : "INVALID" : "UNKNOWN";
    const staleReasons = [!sameAlternative ? "SOURCE_ALTERNATIVE_CHANGED" : "", !sameGeometry ? "GEOMETRY_VERSION_CHANGED" : ""].filter(Boolean);
    return { ...item, boundaryId: boundary?.boundaryId, bindingState, positionOnBoundary: boundary && item.extent ? item.extent : undefined, visualConnectionState: boundary ? "OBSERVED" : "UNKNOWN", exteriorStatus: item.relatedSpaceId ? "NOT_ESTABLISHED" : "UNKNOWN", staleReasons };
  });
}

export function deriveA30OpeningConnections(plan: ResidentialPlan, observations = deriveA30OpeningObservations(plan, legacyOpeningEvidence(plan))): A30OpeningConnection[] {
  return observations.filter((opening) => opening.relatedSpaceId).map((opening) => {
    const traversability = opening.traversability ?? "UNKNOWN";
    const state = opening.bindingState !== "VALID" ? "CONNECTION_NOT_ESTABLISHED" : traversability === "TRAVERSABLE" ? "CONNECTION_OBSERVED" : "CONNECTION_UNVERIFIED";
    return { connectionId: `A30:${plan.alternativeId}:${opening.openingId}`, openingId: opening.openingId, fromSpaceId: opening.hostSpaceId, toSpaceId: opening.relatedSpaceId as string, levelId: opening.levelId, state, traversability, boundaryId: opening.boundaryId, evidenceRefs: [...opening.evidenceRefs, ...(opening.boundaryId ? [opening.boundaryId] : [])], provenance: [...opening.provenance, "A30.deriveA30OpeningConnections"] };
  });
}

export function validateA30OpeningObservation(observation: A30OpeningObservation): boolean {
  return observation.bindingState !== "VALID" || (Boolean(observation.boundaryId) && observation.evidenceRefs.length > 0 && observation.provenance.length > 0 && observation.staleReasons.length === 0);
}

export function summarizeA30OpeningAudit(plan: ResidentialPlan): { classification: "PARTIAL_BUT_REUSABLE"; existingOpenings: A30OpeningObservation[]; boundaryCount: number; connectionCount: number; warnings: string[] } {
  const a29 = buildA29ReadModel(plan); const existingOpenings = deriveA30OpeningObservations(plan, legacyOpeningEvidence(plan), a29); const connections = deriveA30OpeningConnections(plan, existingOpenings);
  return { classification: "PARTIAL_BUT_REUSABLE", existingOpenings, boundaryCount: a29.boundaries.length, connectionCount: connections.length, warnings: ["Legacy openings have no explicit boundary extent.", "Legacy opening role and traversability remain UNKNOWN.", "No opening is promoted to Door or Window.", "No accessibility or compliance is inferred."] };
}

export function openingBindingForSyntheticFixture(plan: ResidentialPlan, opening: A30OpeningEvidence): A30OpeningObservation {
  return deriveA30OpeningObservations(plan, [opening])[0];
}
