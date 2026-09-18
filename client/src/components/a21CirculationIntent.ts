import type { A21HouseProof, A21RelationshipRecord } from "./a21ArchitecturalProgram";
import { buildHouseA21Proof } from "./a21ArchitecturalProgram";
import { validateCirculationIntent, type CirculationIntent, type CirculationIntentValidation } from "./a21SpatialRelationships";
import type { CirculationEvidenceGraph, CirculationEvidenceNode, CirculationEvidenceEdge } from "./circulationEvidenceGraph";
import { buildA29ReadModel, type A29ReadModel } from "./a29BoundaryConnectivity";
import { summarizeA30OpeningAudit, type A30OpeningObservation } from "./a30ArchitecturalOpenings";
import { generateVerifiedResidentialPlan, type ResidentialPlan } from "./residentialConstructivePlan";

export type A21P3NodeRole = "ORIGIN" | "TRANSITION" | "DESTINATION" | "MEDIATOR" | "VERTICAL" | "UNKNOWN";
export type A21P3RouteHierarchy = "PRIMARY" | "SECONDARY" | "SERVICE" | "PRIVATE" | "VERTICAL" | "UNKNOWN";
export type A21P3Route = {
  routeId: string;
  hierarchy: A21P3RouteHierarchy;
  sequence: string[];
  origin: string;
  destination: string;
  mediatedBy: string[];
  levelTransition: boolean;
  accessIntent: "PUBLIC" | "CONTROLLED" | "SERVICE" | "PRIVATE" | "UNKNOWN";
  continuityRequired: boolean;
  sourceRelationshipIds: string[];
  epistemicState: "HUMAN_CONFIRMED" | "DERIVED" | "UNKNOWN";
  provenance: string[];
};
export type A21P3Node = { nodeId: string; role: A21P3NodeRole; levelIntent: string; privacy: string; source: "HUMAN_PROGRAM" | "HUMAN_RELATION" | "DERIVED" | "UNKNOWN"; provenance: string[] };
export type A21P3Graph = {
  graphId: "HOUSE-A21-CIRCULATION-INTENT";
  proofId: "HOUSE-A21";
  nodes: A21P3Node[];
  routes: A21P3Route[];
  validations: CirculationIntentValidation[];
  intentObservations: Array<{ intentId: string; result: "OBSERVED" | "PARTIAL" | "NOT_OBSERVED" | "UNKNOWN"; evidenceRefs: string[]; humanReviewRequired: true }>;
  a20GraphId: string;
  a29: A29ReadModel;
  a30Openings: A30OpeningObservation[];
  warnings: string[];
  noGeometryMutation: true;
  noDecision: true;
  noRecommendation: true;
  noAutomaticRepair: true;
};

const relation = (proof: A21HouseProof, from: string, to: string, type?: A21RelationshipRecord["relationship"]) => proof.relationships.find((item) => item.sourceNode === from && item.targetNode === to && (!type || item.relationship === type));
const node = (proof: A21HouseProof, id: string, role: A21P3NodeRole, source: A21P3Node["source"]): A21P3Node => {
  const item = proof.program.find((program) => program.programId === id);
  return { nodeId: id, role, levelIntent: item?.levelIntent ?? "UNKNOWN", privacy: item?.privacyCharacter ?? "UNKNOWN", source, provenance: [...(item?.provenance ?? ["HOUSE-A21.unknown-node"]), `A21-P3.node:${id}`] };
};

function controlledGraph(plan: ResidentialPlan, a29: A29ReadModel): CirculationEvidenceGraph {
  const nodes: CirculationEvidenceNode[] = plan.rooms.map((room) => ({ id: room.id, kind: room.zone === "CIRCULATION" ? "CIRCULATION" : room.zone === "PUBLIC" || room.zone === "PRIVATE" || room.zone === "SERVICE" ? "SPACE" : "DESTINATION", spaceId: room.id, label: room.name, state: "OBSERVED", evidenceRefs: [`HOUSE-001-EXPLICIT:v1`, `ResidentialRoom:${room.id}`, "A20-P1 controlled proof"] }));
  nodes.push({ id: "ACCESS", kind: "ACCESS", label: "Access", state: "OBSERVED", evidenceRefs: ["HOUSE-A21.human-intent:connect entry to social zone"] });
  const edges: CirculationEvidenceEdge[] = [
    { id: "ACCESS->LIVING", from: "ACCESS", to: "LIVING", relation: "ACCESS_TO", state: "OBSERVED", evidenceRefs: ["DOOR-ENTRY", "A20-P1 controlled proof"] },
    { id: "LIVING->HALL-N1", from: "LIVING", to: "HALL-N1", relation: "CONNECTS", state: "OBSERVED", evidenceRefs: ["DOOR-ENTRY", "A29/A30 read models"] },
    { id: "HALL-N1->HALL-N2", from: "HALL-N1", to: "HALL-N2", relation: "SEQUENCE", state: "OBSERVED", evidenceRefs: ["STAIR-CORE", "A21 vertical intent; physical stair not inferred"] },
    { id: "HALL-N2->BED-01", from: "HALL-N2", to: "BED-01", relation: "ACCESS_TO", state: "OBSERVED", evidenceRefs: ["DOOR-BED-01", "A30 opening evidence"] },
    { id: "HALL-N2->BED-02", from: "HALL-N2", to: "BED-02", relation: "ACCESS_TO", state: "OBSERVED", evidenceRefs: ["DOOR-BED-02", "A30 opening evidence"] },
    { id: "HALL-N2->BATH", from: "HALL-N2", to: "BATH", relation: "ACCESS_TO", state: "OBSERVED", evidenceRefs: ["DOOR-BATH", "A30 opening evidence"] },
  ];
  return { graphId: `a20-p1:controlled:${plan.alternativeId}`, alternativeId: plan.alternativeId, representationId: "HOUSE-001-EXPLICIT:v1", nodes, edges, continuity: "OBSERVED", loop: "UNKNOWN", spine: "UNKNOWN", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: [...a29.boundaries.flatMap((boundary) => boundary.provenance), ...a29.connections.flatMap((connection) => connection.provenance), "A20-P1 controlled HOUSE-A21 proof"], readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true };
}

function intent(route: A21P3Route): CirculationIntent {
  return { circulationIntentId: route.routeId, originProgramId: route.origin, destinationProgramId: route.destination, sequence: route.sequence, routeType: route.hierarchy === "PRIMARY" ? "PRIMARY_SPINE" : route.hierarchy === "PRIVATE" ? "PRIVATE_ROUTE" : route.hierarchy === "SERVICE" ? "SERVICE_ROUTE" : route.levelTransition ? "VERTICAL_CONNECTION" : "SECONDARY_ROUTE", priority: route.hierarchy === "UNKNOWN" ? "UNKNOWN" : "MUST", requiredContinuity: route.continuityRequired, levelStrategy: route.levelTransition ? "N1 → N2 relationship; vertical element not inferred" : "same declared organizational sequence", accessStrategy: route.accessIntent, rationale: `HOUSE-A21 circulation intent ${route.routeId}; path semantics only, not corridor or route geometry`, provenance: route.provenance, epistemicState: route.epistemicState === "HUMAN_CONFIRMED" ? "HUMAN_CONFIRMED" : route.epistemicState === "DERIVED" ? "DERIVED_RELATION" : "UNKNOWN", status: route.epistemicState === "HUMAN_CONFIRMED" ? "HUMAN_CONFIRMED" : "UNKNOWN" };
}

export function buildA21P3Graph(plan: ResidentialPlan = generateVerifiedResidentialPlan(), proof: A21HouseProof = buildHouseA21Proof()): A21P3Graph {
  const a29 = buildA29ReadModel(plan); const a30 = summarizeA30OpeningAudit(plan).existingOpenings; const graph = controlledGraph(plan, a29);
  const nodes = proof.program.map((item) => node(proof, item.programId, item.programId.includes("CIRCULATION") ? "TRANSITION" : item.programId === "ACCESS" ? "ORIGIN" : item.programId === "PATIO" || item.programId.includes("BATH") || item.programId.includes("BEDROOM") ? "DESTINATION" : "UNKNOWN", proof.relationships.some((edge) => edge.sourceNode === item.programId || edge.targetNode === item.programId) ? "HUMAN_RELATION" : "HUMAN_PROGRAM"));
  const routes: A21P3Route[] = [
    { routeId: "HOUSE-A21:R01:ACCESS-TO-SOCIAL", hierarchy: "PRIMARY", sequence: ["ACCESS", "GROUND_CIRCULATION", "LIVING_DINING"], origin: "ACCESS", destination: "LIVING_DINING", mediatedBy: ["GROUND_CIRCULATION"], levelTransition: false, accessIntent: "PUBLIC", continuityRequired: true, sourceRelationshipIds: [relation(proof, "ACCESS", "LIVING_DINING")?.sourceIntent ?? "HOUSE-A21.human-intent:connect entry to social zone"], epistemicState: "HUMAN_CONFIRMED", provenance: ["HOUSE-A21.human-intent:connect entry to social zone", "A21-P3.route-sequence"] },
    { routeId: "HOUSE-A21:R02:SOCIAL-TO-SERVICE", hierarchy: "SERVICE", sequence: ["LIVING_DINING", "KITCHEN"], origin: "LIVING_DINING", destination: "KITCHEN", mediatedBy: [], levelTransition: false, accessIntent: "SERVICE", continuityRequired: true, sourceRelationshipIds: [relation(proof, "KITCHEN", "LIVING_DINING")?.sourceIntent ?? "HOUSE-A21.human-intent:relate kitchen and dining"], epistemicState: "HUMAN_CONFIRMED", provenance: ["HOUSE-A21.human-intent:relate kitchen and dining", "A21-P3.route-sequence"] },
    { routeId: "HOUSE-A21:R03:PRIVATE-CONTROLLED", hierarchy: "PRIVATE", sequence: ["UPPER_CIRCULATION", "MAIN_BEDROOM"], origin: "UPPER_CIRCULATION", destination: "MAIN_BEDROOM", mediatedBy: [], levelTransition: false, accessIntent: "CONTROLLED", continuityRequired: true, sourceRelationshipIds: [relation(proof, "UPPER_CIRCULATION", "MAIN_BEDROOM")?.sourceIntent ?? "HOUSE-A21.human-intent:control access to main bedroom"], epistemicState: "HUMAN_CONFIRMED", provenance: ["HOUSE-A21.human-intent:control access to main bedroom", "A21-P3.controlled-access"] },
    { routeId: "HOUSE-A21:R04:PRIVATE-SECONDARY", hierarchy: "PRIVATE", sequence: ["UPPER_CIRCULATION", "BEDROOM_2"], origin: "UPPER_CIRCULATION", destination: "BEDROOM_2", mediatedBy: ["UPPER_CIRCULATION"], levelTransition: false, accessIntent: "PRIVATE", continuityRequired: true, sourceRelationshipIds: ["HOUSE-A21.program.private-bedroom-cluster", "A21-P3.derived-private-route"], epistemicState: "DERIVED", provenance: ["HOUSE-A21 level intent N2", "A21-P3 derived route; human review required"] },
    { routeId: "HOUSE-A21:R05:VERTICAL", hierarchy: "VERTICAL", sequence: ["GROUND_CIRCULATION", "UPPER_CIRCULATION"], origin: "GROUND_CIRCULATION", destination: "UPPER_CIRCULATION", mediatedBy: [], levelTransition: true, accessIntent: "CONTROLLED", continuityRequired: true, sourceRelationshipIds: [relation(proof, "GROUND_CIRCULATION", "UPPER_CIRCULATION")?.sourceIntent ?? "HOUSE-A21.human-intent:connect N1 and N2 through a vertical core"], epistemicState: "HUMAN_CONFIRMED", provenance: ["HOUSE-A21.human-intent:connect N1 and N2 through a vertical core", "A21-P3.vertical-intent"] },
    { routeId: "HOUSE-A21:R06:SOCIAL-BATH", hierarchy: "UNKNOWN", sequence: ["ACCESS", "GROUND_CIRCULATION", "SOCIAL_BATH"], origin: "ACCESS", destination: "SOCIAL_BATH", mediatedBy: ["GROUND_CIRCULATION"], levelTransition: false, accessIntent: "UNKNOWN", continuityRequired: true, sourceRelationshipIds: ["UNKNOWN: social-bath access intent not supplied"], epistemicState: "UNKNOWN", provenance: ["HOUSE-A21 unknownRelationships", "A21-P3 unknown preservation"] },
  ];
  const validations = routes.map((route) => validateCirculationIntent(intent(route), graph));
  const observations = validations.map((validation) => ({ intentId: validation.circulationIntentId, result: validation.state === "OBSERVED" ? "OBSERVED" as const : validation.state === "OBSERVED_PARTIAL" ? "PARTIAL" as const : validation.state === "UNVERIFIED" ? "NOT_OBSERVED" as const : "UNKNOWN" as const, evidenceRefs: validation.evidenceRefs, humanReviewRequired: true as const }));
  return { graphId: "HOUSE-A21-CIRCULATION-INTENT", proofId: "HOUSE-A21", nodes, routes, validations, intentObservations: observations, a20GraphId: graph.graphId, a29, a30Openings: a30, warnings: ["Intent is not corridor geometry.", "Vertical connection intent does not infer stair or elevator.", "Visual connection does not prove physical access.", "Accessibility and regulatory compliance remain NOT_ASSESSED.", "Unknown social-bath access is preserved; no bedroom mediator is invented."], noGeometryMutation: true, noDecision: true, noRecommendation: true, noAutomaticRepair: true };
}

export function validateA21P3Graph(model: A21P3Graph): boolean {
  return model.graphId === "HOUSE-A21-CIRCULATION-INTENT" && model.proofId === "HOUSE-A21" && model.noGeometryMutation && model.noDecision && model.noRecommendation && model.noAutomaticRepair && model.nodes.every((node) => node.provenance.length > 0) && model.routes.every((route) => route.sequence.length >= 2 && route.provenance.length > 0 && route.sourceRelationshipIds.length > 0) && model.validations.length === model.routes.length;
}

export function buildA21P3NegativeControls() {
  const proof = buildHouseA21Proof();
  const graph = buildA21P3Graph();
  const conflict = graph.routes.some((route) => route.routeId === "HOUSE-A21:R03:PRIVATE-CONTROLLED" && route.accessIntent === "CONTROLLED");
  const evidenceGraph = graphToEvidence(graph);
  const incomplete = validateCirculationIntent({ circulationIntentId: "negative:incomplete", sequence: ["UPPER_CIRCULATION", "MISSING_ROOM"], routeType: "PRIVATE_ROUTE", priority: "MUST", requiredContinuity: true, rationale: "negative", provenance: ["negative-fixture"], epistemicState: "HUMAN_CONFIRMED", status: "HUMAN_CONFIRMED", originProgramId: "UPPER_CIRCULATION", destinationProgramId: "MISSING_ROOM" }, { ...evidenceGraph, nodes: evidenceGraph.nodes.filter((node: CirculationEvidenceNode) => node.id !== "MISSING_ROOM") });
  const vertical = graph.routes.find((route) => route.routeId === "HOUSE-A21:R05:VERTICAL");
  return { conflictPreserved: conflict && proof.conflicts.length === 0, incompleteRoute: incomplete.state === "INSUFFICIENT_EVIDENCE" || incomplete.state === "UNVERIFIED" || incomplete.missingEvidence.includes("UNVERIFIED_SEQUENCE_NODES"), verticalNoStairInference: Boolean(vertical) && !graph.nodes.some((node) => node.nodeId === "STAIR"), accessibilityNotAssessed: graph.validations.every((validation) => validation.accessibleRoute === "NOT_ASSESSED"), regulatoryNotAssessed: graph.validations.every((validation) => validation.compliance === "NOT_ASSESSED") };
}

function graphToEvidence(model: A21P3Graph): CirculationEvidenceGraph { return { graphId: model.a20GraphId, alternativeId: "HOUSE-A-CONSTRUCTIVE", representationId: "HOUSE-001-EXPLICIT:v1", nodes: model.nodes.map((node) => ({ id: node.nodeId, kind: node.role === "TRANSITION" ? "CIRCULATION" : node.role === "ORIGIN" ? "ACCESS" : "DESTINATION", state: "OBSERVED", evidenceRefs: node.provenance })), edges: model.routes.flatMap((route) => route.sequence.slice(0, -1).map((from, index) => ({ id: `${route.routeId}:${index}`, from, to: route.sequence[index + 1], relation: "SEQUENCE" as const, state: route.epistemicState === "UNKNOWN" ? "UNKNOWN" as const : "OBSERVED" as const, evidenceRefs: route.provenance }))), continuity: "OBSERVED", loop: "UNKNOWN", spine: "UNKNOWN", accessibleRoute: "NOT_ASSESSED", compliance: "NOT_ASSESSED", provenance: model.warnings, readOnly: true, noGeometryMutation: true, noDecision: true, noRecommendation: true }; }
