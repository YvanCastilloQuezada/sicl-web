import { assessAccessibilityRoute, type AccessibilityProfile, type AccessibilityRouteAssessment } from "./accessibilityAssessment";
import { buildA29ReadModel, type A29ReadModel } from "./a29BoundaryConnectivity";
import { deriveA30OpeningConnections, deriveA30OpeningObservations, legacyOpeningEvidence, type A30OpeningConnection, type A30OpeningEvidence } from "./a30ArchitecturalOpenings";
import type { CirculationEvidenceEdge, CirculationEvidenceGraph, CirculationEvidenceNode } from "./circulationEvidenceGraph";
import type { ResidentialPlan, ResidentialRoute } from "./residentialConstructivePlan";

export type A30CheckState = "PASS" | "INCOMPLETE" | "CONFLICT" | "UNKNOWN";
export type A30RouteCheck = { id: string; label: string; state: A30CheckState; evidenceRefs: string[]; detail: string };
export type A30AccessibleRouteVerification = {
  verificationId: string;
  routeId: string;
  alternativeId: string;
  checks: A30RouteCheck[];
  accessibilityAssessment: AccessibilityRouteAssessment;
  status: "GEOMETRICALLY_SUPPORTED" | "INCOMPLETE" | "CONFLICTING_EVIDENCE" | "UNKNOWN";
  complianceStatus: "NOT_ASSESSED";
  humanReviewState: "PENDING_HUMAN_REVIEW";
  noAutomaticApproval: true;
  noDecision: true;
  noRecommendation: true;
  noBimEntitiesCreated: true;
  provenance: string[];
};

function node(id: string, kind: CirculationEvidenceNode["kind"], plan: ResidentialPlan): CirculationEvidenceNode {
  const room = plan.rooms.find((item) => item.id === id);
  const core = plan.cores.find((item) => item.id === id);
  return { id, kind, label: room?.name ?? core?.kind ?? id, sourceElementId: id, spaceId: room?.id, level: room ? Number(room.levelId.replace("N", "")) : null, state: "OBSERVED", evidenceRefs: [`ResidentialPlan:${plan.alternativeId}`, `source:${id}`] };
}

function graphForRoute(plan: ResidentialPlan, route: ResidentialRoute, a29: A29ReadModel, openingConnections: A30OpeningConnection[]): CirculationEvidenceGraph {
  const nodes = route.roomIds.map((id) => node(id, plan.rooms.some((room) => room.id === id) ? "SPACE" : "CIRCULATION", plan));
  const edges: CirculationEvidenceEdge[] = [];
  for (let index = 0; index < route.roomIds.length - 1; index += 1) {
    const from = route.roomIds[index]; const to = route.roomIds[index + 1];
    const openingConnection = openingConnections.find((item) => (item.fromSpaceId === from && item.toSpaceId === to) || (item.fromSpaceId === to && item.toSpaceId === from));
    const connection = a29.connections.find((item) => (item.fromSpaceId === from && item.toSpaceId === to) || (item.fromSpaceId === to && item.toSpaceId === from));
    if (openingConnection || connection) {
      const state = openingConnection?.state === "CONNECTION_OBSERVED" ? "OBSERVED" : "UNVERIFIED";
      edges.push({ id: `${route.id}:${from}->${to}`, from, to, relation: "CONNECTS", state, sourceElementId: openingConnection?.connectionId ?? connection?.connectionId, level: nodes[index].level, evidenceRefs: [...(openingConnection?.evidenceRefs ?? []), ...(connection?.evidenceRefs ?? [])] });
    }
  }
  return { graphId: `a30:${plan.alternativeId}:${route.id}`, alternativeId: plan.alternativeId, representationId: "HOUSE-001-EXPLICIT:v1", nodes, edges, continuity: edges.length === route.roomIds.length - 1 ? "OBSERVED" : "UNVERIFIED", loop: "UNKNOWN", spine: "UNKNOWN", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: [`A30.graphForRoute:${route.id}`, "A29 ArchitecturalConnectionObservation", "A20-P1 Circulation Evidence Graph"], readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true };
}

function checkRoute(plan: ResidentialPlan, route: ResidentialRoute, a29: A29ReadModel, openingConnections: A30OpeningConnection[]): { checks: A30RouteCheck[]; graph: CirculationEvidenceGraph; edgeIds: string[]; measurements: Record<string, { clearWidth?: number; evidenceRefs: string[] }> } {
  const checks: A30RouteCheck[] = [];
  const roomAndCoreIds = new Set([...plan.rooms.map((room) => room.id), ...plan.cores.map((core) => core.id)]);
  const missing = route.roomIds.filter((id) => !roomAndCoreIds.has(id));
  checks.push({ id: "A30-NODES", label: "Route nodes identify explicit rooms or cores", state: missing.length ? "INCOMPLETE" : "PASS", evidenceRefs: route.roomIds.map((id) => `source:${id}`), detail: missing.length ? `Unknown nodes: ${missing.join(", ")}` : "All route nodes have explicit source identity" });
  checks.push({ id: "A30-WIDTH", label: "Route clear width is recorded", state: route.widthM > 0 ? "PASS" : "INCOMPLETE", evidenceRefs: [`route:${route.id}:width`], detail: `${route.widthM}m recorded; normative sufficiency is not assessed` });
  const graph = graphForRoute(plan, route, a29, openingConnections);
  const edgeIds = graph.edges.map((edge) => edge.id);
  checks.push({ id: "A30-CONTINUITY", label: "Every consecutive route pair has observed connection evidence", state: graph.continuity === "OBSERVED" ? "PASS" : "INCOMPLETE", evidenceRefs: graph.provenance, detail: graph.continuity === "OBSERVED" ? "All transitions have explicit connection evidence" : "One or more transitions lack explicit connection evidence" });
  const levels = route.levelIds.map((level) => Number(level.replace("N", ""))).filter(Number.isFinite);
  const contiguous = levels.length > 0 && levels.every((level, index) => index === 0 || Math.abs(level - levels[index - 1]) <= 1);
  checks.push({ id: "A30-LEVELS", label: "Level sequence is explicit and non-skipping", state: contiguous ? "PASS" : "INCOMPLETE", evidenceRefs: route.levelIds.map((level) => `level:${level}`), detail: contiguous ? route.levelIds.join(" → ") : "Level transition is not fully evidenced" });
  checks.push({ id: "A30-EGRESS", label: "Egress/accessibility status remains separate", state: "UNKNOWN", evidenceRefs: [`route:${route.id}:egress`], detail: `egress=${route.egress}; accessible=${route.accessible}; no certification inferred` });
  return { checks, graph, edgeIds, measurements: Object.fromEntries(edgeIds.map((edgeId) => [edgeId, { clearWidth: route.widthM, evidenceRefs: [`route:${route.id}:width`] }])) };
}

export function verifyAccessibleRouteA30(plan: ResidentialPlan, routeId = plan.routes[0]?.id, profile?: AccessibilityProfile, openingEvidence: A30OpeningEvidence[] = legacyOpeningEvidence(plan)): A30AccessibleRouteVerification {
  const route = plan.routes.find((item) => item.id === routeId);
  if (!route) {
    const emptyGraph: CirculationEvidenceGraph = { graphId: `a30:${plan.alternativeId}:missing`, alternativeId: plan.alternativeId, representationId: "HOUSE-001-EXPLICIT:v1", nodes: [], edges: [], continuity: "UNVERIFIED", loop: "UNKNOWN", spine: "UNKNOWN", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: ["A30 missing route"], readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true };
    const assessment = assessAccessibilityRoute(emptyGraph, { routeId: routeId ?? "UNKNOWN", originNodeId: "UNKNOWN", destinationNodeId: "UNKNOWN", edgeIds: [], measurements: {}, profile, humanReviewState: "PENDING_HUMAN_REVIEW" });
    return { verificationId: `A30:${plan.alternativeId}:${routeId ?? "UNKNOWN"}`, routeId: routeId ?? "UNKNOWN", alternativeId: plan.alternativeId, checks: [{ id: "A30-ROUTE", label: "Route exists", state: "INCOMPLETE", evidenceRefs: ["A30"], detail: "Route not found" }], accessibilityAssessment: assessment, status: "INCOMPLETE", complianceStatus: "NOT_ASSESSED", humanReviewState: "PENDING_HUMAN_REVIEW", noAutomaticApproval: true, noDecision: true, noRecommendation: true, noBimEntitiesCreated: true, provenance: ["A30.verifyAccessibleRoute"] };
  }
  const a29 = buildA29ReadModel(plan); const openingConnections = deriveA30OpeningConnections(plan, deriveA30OpeningObservations(plan, openingEvidence, a29));
  const prepared = checkRoute(plan, route, a29, openingConnections);
  const assessment = assessAccessibilityRoute(prepared.graph, { routeId: route.id, originNodeId: route.roomIds[0], destinationNodeId: route.roomIds[route.roomIds.length - 1], edgeIds: prepared.edgeIds, measurements: prepared.measurements, profile, humanReviewState: "PENDING_HUMAN_REVIEW" });
  const a20Check: A30RouteCheck = { id: "A30-A20", label: "A20-P2 assessment is preserved", state: assessment.status === "INCOMPLETE" ? "INCOMPLETE" : assessment.conflicts.length ? "CONFLICT" : "PASS", evidenceRefs: assessment.evidenceRefs, detail: `A20-P2=${assessment.status}; compliance=${assessment.complianceStatus}` };
  const checks = [...prepared.checks, a20Check];
  const status = checks.some((check) => check.state === "CONFLICT") ? "CONFLICTING_EVIDENCE" : checks.some((check) => check.state === "INCOMPLETE") ? "INCOMPLETE" : checks.some((check) => check.state === "UNKNOWN") ? "UNKNOWN" : "GEOMETRICALLY_SUPPORTED";
  return { verificationId: `A30:${plan.alternativeId}:${route.id}`, routeId: route.id, alternativeId: plan.alternativeId, checks, accessibilityAssessment: assessment, status, complianceStatus: "NOT_ASSESSED", humanReviewState: "PENDING_HUMAN_REVIEW", noAutomaticApproval: true, noDecision: true, noRecommendation: true, noBimEntitiesCreated: true, provenance: ["A30.verifyAccessibleRoute", "A29 ArchitecturalConnectionObservation", "A20-P1 Circulation Evidence Graph", "A20-P2 Accessibility Assessment", `ResidentialRoute:${route.id}`] };
}

export function validateA30Verification(result: A30AccessibleRouteVerification): boolean {
  return result.complianceStatus === "NOT_ASSESSED" && result.humanReviewState === "PENDING_HUMAN_REVIEW" && result.noAutomaticApproval && result.noDecision && result.noRecommendation && result.noBimEntitiesCreated && result.provenance.length > 0 && result.accessibilityAssessment.complianceStatus === "NOT_ASSESSED";
}
