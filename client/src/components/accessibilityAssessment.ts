import type { CirculationEvidenceEdge, CirculationEvidenceGraph } from "./circulationEvidenceGraph";

export type AccessibilityAssessmentStatus = "NOT_ASSESSED" | "UNKNOWN" | "INCOMPLETE" | "PENDING_HUMAN_REVIEW" | "CONFLICTING_EVIDENCE";
export type HumanReviewState = "NOT_STARTED" | "PENDING_HUMAN_REVIEW" | "CONFIRMED" | "REJECTED";

export type AccessibilityProfile = {
  id: string;
  jurisdictionRef: string;
  ruleVersion: string;
  clearWidthMinimum?: number;
  slopeMaximum?: number;
  turningRadiusMinimum?: number;
  levelChangeMaximum?: number;
  sourceRefs: string[];
  humanReviewState: HumanReviewState;
};

export type AccessibilityRouteInput = {
  routeId: string;
  originNodeId: string;
  destinationNodeId: string;
  edgeIds: string[];
  profile?: AccessibilityProfile;
  measurements: Record<string, { clearWidth?: number; slope?: number; turningRadius?: number; levelChange?: number; evidenceRefs: string[] }>;
  humanReviewState: HumanReviewState;
};

export type AccessibilityRouteAssessment = {
  routeId: string;
  originNodeId: string;
  destinationNodeId: string;
  status: AccessibilityAssessmentStatus;
  routeObserved: boolean;
  measuredEdgeIds: string[];
  missingInputs: string[];
  conflicts: string[];
  evidenceRefs: string[];
  jurisdictionRef?: string;
  ruleVersion?: string;
  humanReviewState: HumanReviewState;
  complianceStatus: "NOT_ASSESSED";
  noAutomaticApproval: true;
  noDecision: true;
  noRecommendation: true;
};

const edgeMap = (graph: CirculationEvidenceGraph): Map<string, CirculationEvidenceEdge> => new Map(graph.edges.map((edge) => [edge.id, edge]));

export function assessAccessibilityRoute(graph: CirculationEvidenceGraph, input: AccessibilityRouteInput): AccessibilityRouteAssessment {
  const edges = edgeMap(graph);
  const missingInputs: string[] = [];
  const conflicts: string[] = [];
  const evidenceRefs = [...graph.provenance];
  const selectedEdges = input.edgeIds.map((id) => edges.get(id)).filter((edge): edge is CirculationEvidenceEdge => Boolean(edge));
  const routeObserved = input.edgeIds.length > 0 && selectedEdges.length === input.edgeIds.length && selectedEdges.every((edge) => edge.state === "OBSERVED");
  if (!input.edgeIds.length) missingInputs.push("ROUTE_EDGE_IDS");
  if (!routeObserved) missingInputs.push("OBSERVED_ROUTE_GRAPH");
  if (!graph.nodes.some((node) => node.id === input.originNodeId)) missingInputs.push("ORIGIN_NODE");
  if (!graph.nodes.some((node) => node.id === input.destinationNodeId)) missingInputs.push("DESTINATION_NODE");
  if (!input.profile) missingInputs.push("ACCESSIBILITY_PROFILE");
  if (input.profile && !input.profile.jurisdictionRef) missingInputs.push("JURISDICTION_REF");
  if (input.profile && !input.profile.ruleVersion) missingInputs.push("RULE_VERSION");
  for (const edgeId of input.edgeIds) {
    const measurement = input.measurements[edgeId];
    if (!measurement) { missingInputs.push(`MEASUREMENTS:${edgeId}`); continue; }
    evidenceRefs.push(...measurement.evidenceRefs);
    if (input.profile?.clearWidthMinimum !== undefined && measurement.clearWidth !== undefined && measurement.clearWidth < input.profile.clearWidthMinimum) conflicts.push(`CLEAR_WIDTH_BELOW_PROFILE:${edgeId}`);
    if (input.profile?.slopeMaximum !== undefined && measurement.slope !== undefined && measurement.slope > input.profile.slopeMaximum) conflicts.push(`SLOPE_ABOVE_PROFILE:${edgeId}`);
    if (input.profile?.turningRadiusMinimum !== undefined && measurement.turningRadius !== undefined && measurement.turningRadius < input.profile.turningRadiusMinimum) conflicts.push(`TURNING_RADIUS_BELOW_PROFILE:${edgeId}`);
    if (input.profile?.levelChangeMaximum !== undefined && measurement.levelChange !== undefined && measurement.levelChange > input.profile.levelChangeMaximum) conflicts.push(`LEVEL_CHANGE_ABOVE_PROFILE:${edgeId}`);
  }
  const status: AccessibilityAssessmentStatus = missingInputs.length ? "INCOMPLETE" : conflicts.length ? "CONFLICTING_EVIDENCE" : input.humanReviewState === "CONFIRMED" && input.profile?.humanReviewState === "CONFIRMED" ? "PENDING_HUMAN_REVIEW" : "PENDING_HUMAN_REVIEW";
  return { routeId: input.routeId, originNodeId: input.originNodeId, destinationNodeId: input.destinationNodeId, status, routeObserved, measuredEdgeIds: selectedEdges.map((edge) => edge.id), missingInputs, conflicts, evidenceRefs: Array.from(new Set(evidenceRefs)), jurisdictionRef: input.profile?.jurisdictionRef, ruleVersion: input.profile?.ruleVersion, humanReviewState: input.humanReviewState, complianceStatus: "NOT_ASSESSED", noAutomaticApproval: true, noDecision: true, noRecommendation: true };
}

export function validateAccessibilityAssessment(assessment: AccessibilityRouteAssessment): boolean {
  return assessment.complianceStatus === "NOT_ASSESSED" && assessment.noAutomaticApproval && assessment.noDecision && assessment.noRecommendation && assessment.evidenceRefs.length > 0 && (assessment.status === "INCOMPLETE" || assessment.status === "CONFLICTING_EVIDENCE" || assessment.status === "PENDING_HUMAN_REVIEW" || assessment.status === "UNKNOWN" || assessment.status === "NOT_ASSESSED");
}
