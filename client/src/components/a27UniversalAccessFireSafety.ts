import type { A24FloorPlanAlternative } from "./a24IntelligentFloorplan";
import type { A26MaterialSelection } from "./a26SustainableArchitecturalEvaluation";
import type { CirculationEvidenceGraph } from "./circulationEvidenceGraph";
import { assessAccessibilityRoute, type AccessibilityProfile, type AccessibilityRouteAssessment } from "./accessibilityAssessment";

export type A27Jurisdiction = "ADA_2010" | "PERU_RNE_A120" | "PERU_RNE_A130" | "LOCAL_AUTHORITY";
export type A27GateState = "SUPPORTED" | "PARTIAL" | "CONFLICTING" | "NOT_ASSESSED";
export type A27FireRoute = { routeId: string; originNodeId: string; exitNodeId: string; edgeIds: string[]; travelDistanceM?: number; occupantLoad: number; exitsAvailable: number; fireRatingMinutes?: number; evidenceRefs: string[] };
export type A27FireAssessment = { routeId: string; reachable: boolean; routeComplete: boolean; travelDistanceState: A27GateState; exitRedundancyState: A27GateState; compartmentationState: A27GateState; alarmAndWayfindingState: A27GateState; missingInputs: string[]; conflicts: string[]; state: A27GateState; complianceStatus: "NOT_ASSESSED"; humanReviewRequired: true; noAutomaticApproval: true; noAutomaticEvacuationCertification: true; evidenceRefs: string[] };
export type A27HospitalUnit = { unitId: string; name: string; levelId: string; risk: "LOW" | "MEDIUM" | "HIGH"; cleanDirtyFlow: "SEPARATED" | "PARTIAL" | "UNKNOWN"; patientMobility: "MOBILE" | "LIMITED" | "BED_DEPENDENT"; adjacencyRefs: string[]; provenance: string[] };
export type A27HospitalCase = { projectId: string; typology: "HOSPITAL"; profile: "MASTER"; levels: string[]; units: A27HospitalUnit[]; accessibility: AccessibilityRouteAssessment[]; fireSafety: A27FireAssessment[]; materialSelection: A26MaterialSelection; designStrengths: string[]; unresolvedRisks: string[]; state: A27GateState; humanReviewRequired: true; noAutomaticWinner: true };

export const A27_NORMATIVE_PROFILES: Record<A27Jurisdiction, AccessibilityProfile> = {
  ADA_2010: { id: "ADA-2010-ACCESSIBLE-ROUTE", jurisdictionRef: "US-ADA", ruleVersion: "2010 Standards", clearWidthMinimum: 0.915, slopeMaximum: 0.0833, turningRadiusMinimum: 1.525, levelChangeMaximum: 0, sourceRefs: ["https://www.ada.gov/law-and-regs/design-standards/2010-stds/"], humanReviewState: "PENDING_HUMAN_REVIEW" },
  PERU_RNE_A120: { id: "PERU-RNE-A120", jurisdictionRef: "PE-RNE", ruleVersion: "A.120 / RM 072-2019-VIVIENDA", clearWidthMinimum: 0.9, slopeMaximum: 0.0833, turningRadiusMinimum: 1.5, levelChangeMaximum: 0, sourceRefs: ["https://www.gob.pe/institucion/vivienda/informes-publicaciones/353700-norma-tecnica-a-120"], humanReviewState: "PENDING_HUMAN_REVIEW" },
  PERU_RNE_A130: { id: "PERU-RNE-A130", jurisdictionRef: "PE-RNE", ruleVersion: "A.130 Requisitos de seguridad", sourceRefs: ["https://ww3.vivienda.gob.pe/ejes/vivienda-y-urbanismo/documentos/Reglamento%20Nacional%20de%20Edificaciones.pdf"], humanReviewState: "PENDING_HUMAN_REVIEW" },
  LOCAL_AUTHORITY: { id: "LOCAL-AUTHORITY-PENDING", jurisdictionRef: "LOCAL_AUTHORITY", ruleVersion: "REQUIRES_JURISDICTION_VERSION", sourceRefs: [], humanReviewState: "NOT_STARTED" },
};

export function assessFireRoute(graph: CirculationEvidenceGraph, route: A27FireRoute, options: { maximumTravelDistanceM?: number; requiredFireRatingMinutes?: number } = {}): A27FireAssessment {
  const edgeIds = new Set(graph.edges.map((edge) => edge.id));
  const routeComplete = route.edgeIds.length > 0 && route.edgeIds.every((edgeId) => edgeIds.has(edgeId));
  const originExists = graph.nodes.some((node) => node.id === route.originNodeId);
  const exitExists = graph.nodes.some((node) => node.id === route.exitNodeId);
  const reachable = routeComplete && originExists && exitExists;
  const missingInputs: string[] = [];
  const conflicts: string[] = [];
  if (route.travelDistanceM === undefined || options.maximumTravelDistanceM === undefined) missingInputs.push("TRAVEL_DISTANCE_OR_LIMIT");
  else if (route.travelDistanceM > options.maximumTravelDistanceM) conflicts.push("TRAVEL_DISTANCE_EXCEEDS_PROFILE");
  if (route.exitsAvailable < 2) conflicts.push("EXIT_REDUNDANCY_NOT_ESTABLISHED");
  if (route.fireRatingMinutes === undefined || options.requiredFireRatingMinutes === undefined) missingInputs.push("COMPARTMENT_FIRE_RATING");
  else if (route.fireRatingMinutes < options.requiredFireRatingMinutes) conflicts.push("FIRE_RATING_BELOW_PROFILE");
  const travelDistanceState: A27GateState = route.travelDistanceM === undefined || options.maximumTravelDistanceM === undefined ? "NOT_ASSESSED" : conflicts.includes("TRAVEL_DISTANCE_EXCEEDS_PROFILE") ? "CONFLICTING" : "PARTIAL";
  const exitRedundancyState: A27GateState = route.exitsAvailable >= 2 ? "PARTIAL" : "CONFLICTING";
  const compartmentationState: A27GateState = route.fireRatingMinutes === undefined || options.requiredFireRatingMinutes === undefined ? "NOT_ASSESSED" : conflicts.includes("FIRE_RATING_BELOW_PROFILE") ? "CONFLICTING" : "PARTIAL";
  const state: A27GateState = !reachable || conflicts.length ? "CONFLICTING" : missingInputs.length ? "PARTIAL" : "PARTIAL";
  return { routeId: route.routeId, reachable, routeComplete, travelDistanceState, exitRedundancyState, compartmentationState, alarmAndWayfindingState: "NOT_ASSESSED", missingInputs, conflicts, state, complianceStatus: "NOT_ASSESSED", humanReviewRequired: true, noAutomaticApproval: true, noAutomaticEvacuationCertification: true, evidenceRefs: [...graph.provenance, ...route.evidenceRefs, "A27.fire-route-assessment"] };
}

export function assessUniversalAccessRoute(graph: CirculationEvidenceGraph, route: Parameters<typeof assessAccessibilityRoute>[1]): AccessibilityRouteAssessment {
  return assessAccessibilityRoute(graph, route);
}

export function buildHospitalMasterCase(input: { plan: A24FloorPlanAlternative; graph: CirculationEvidenceGraph; materialSelection: A26MaterialSelection; accessibilityRoutes: Array<Parameters<typeof assessAccessibilityRoute>[1]>; fireRoutes: A27FireRoute[] }): A27HospitalCase {
  const accessibility = input.accessibilityRoutes.map((route) => assessUniversalAccessRoute(input.graph, route));
  const fireSafety = input.fireRoutes.map((route) => assessFireRoute(input.graph, route, { maximumTravelDistanceM: 45, requiredFireRatingMinutes: 120 }));
  const units: A27HospitalUnit[] = [
    { unitId: "ED", name: "Emergency Department", levelId: "N1", risk: "HIGH", cleanDirtyFlow: "PARTIAL", patientMobility: "LIMITED", adjacencyRefs: ["IMAGING", "ICU", "PUBLIC-ENTRY"], provenance: ["A27 hospital fixture"] },
    { unitId: "IMAGING", name: "Imaging and Diagnostics", levelId: "N1", risk: "MEDIUM", cleanDirtyFlow: "SEPARATED", patientMobility: "BED_DEPENDENT", adjacencyRefs: ["ED", "SURGERY"], provenance: ["A27 hospital fixture"] },
    { unitId: "ICU", name: "Intensive Care Unit", levelId: "N2", risk: "HIGH", cleanDirtyFlow: "SEPARATED", patientMobility: "BED_DEPENDENT", adjacencyRefs: ["ED", "SURGERY", "VERTICAL-CORE"], provenance: ["A27 hospital fixture"] },
    { unitId: "SURGERY", name: "Surgical Suite", levelId: "N2", risk: "HIGH", cleanDirtyFlow: "SEPARATED", patientMobility: "BED_DEPENDENT", adjacencyRefs: ["ICU", "IMAGING", "STERILE-SERVICE"], provenance: ["A27 hospital fixture"] },
    { unitId: "PUBLIC", name: "Public and Family Services", levelId: "N1", risk: "LOW", cleanDirtyFlow: "PARTIAL", patientMobility: "MOBILE", adjacencyRefs: ["PUBLIC-ENTRY", "ED"], provenance: ["A27 hospital fixture"] },
  ];
  const unresolvedRisks = ["hospital infection-control validation", "smoke-control and fire-alarm design", "horizontal evacuation strategy for bed-dependent patients", "local authority interpretation", "final medical planning and equipment coordination"];
  const state: A27GateState = accessibility.some((item) => item.status === "CONFLICTING_EVIDENCE") || fireSafety.some((item) => item.state === "CONFLICTING") ? "CONFLICTING" : "PARTIAL";
  return { projectId: input.plan.projectId, typology: "HOSPITAL", profile: "MASTER", levels: input.plan.levelIds, units, accessibility, fireSafety, materialSelection: input.materialSelection, designStrengths: ["separates public, emergency and clinical flows as a design hypothesis", "keeps bed-dependent patients visible in vertical planning", "reuses continuous vertical core", "combines low-carbon material candidates with hospital durability review", "requires human and specialist review before any approval"], unresolvedRisks, state, humanReviewRequired: true, noAutomaticWinner: true };
}
