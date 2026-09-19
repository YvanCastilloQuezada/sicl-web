import { buildMinimumSystemRequirement } from "./arkiCanonicalFunctionalOperationalization";
import { assessV3Capability, deriveV3FlowSegment, deriveV3Relationship, type V3CapabilityAssessment, type V3FlowSegment, type V3MultidimensionalRelationship } from "./arkiV3KnowledgeDelta";
import { buildRestaurantDesign, type RestaurantDesign } from "./arkiRestaurantDesign";

export type RestaurantV3Evaluation = {
  projectId: string;
  alternativeId: string;
  typology: "RESTAURANT";
  design: RestaurantDesign;
  capabilities: V3CapabilityAssessment[];
  flowSegments: V3FlowSegment[];
  relationships: V3MultidimensionalRelationship[];
  deficits: V3CapabilityAssessment[];
  status: "SUPPORTED_WITH_OBSERVATIONS" | "PARTIAL" | "CONFLICTING";
  humanReviewRequired: true;
  epistemicState: "HYPOTHESIS";
  noPermitClaim: true;
};

function requirement(id: string, name: string, rationale: string) { return buildMinimumSystemRequirement({ id, name, role: "SERVICE", necessity: "ESSENTIAL", rationale }); }

export function evaluateRestaurantV3(design = buildRestaurantDesign()): RestaurantV3Evaluation {
  const diningRequirement = requirement("RESTAURANT-DINING-CAPACITY", "Dining capacity", "The public dining system must serve the declared seating demand during the declared service period.");
  const serviceRequirement = requirement("RESTAURANT-SERVICE-SEPARATION", "Independent service logistics", "Goods and staff should reach receiving, storage and kitchen without crossing public dining circulation.");
  const egressRequirement = requirement("RESTAURANT-EMERGENCY-EGRESS", "Emergency egress network", "The two-level public population requires continuous vertical evacuation routes and exterior discharge.");
  const wasteRequirement = requirement("RESTAURANT-WASTE-INTERFACE", "Waste and dirty return", "Waste and dirty ware require a declared operational interface and equipment layout.");
  const capabilities = [
    assessV3Capability({ capabilityId: "CAP-RESTAURANT-DINING", requirementId: diningRequirement.id, necessity: diningRequirement.functionalNecessity, realizationModes: ["INTERNAL"], persistenceModes: ["PERMANENT"], providerSystemIds: ["DINING-A-N1", "DINING-B-N1", "DINING-C-N2", "DINING-D-N2"], interfaceState: "VALID", capacity: { value: design.restaurantProgram.diningSeats, unit: "seats", timeBasis: "declared service period", demandBasis: "declared aforo 500", configuration: "four dining salons", state: "PEAK" }, availability: "AVAILABLE", performance: design.restaurantProgram.diningSeats === 500 ? "SUPPORTED" : "UNSUPPORTED", evidence: diningRequirement.evidence }),
    assessV3Capability({ capabilityId: "CAP-RESTAURANT-SERVICE", requirementId: serviceRequirement.id, necessity: serviceRequirement.functionalNecessity, realizationModes: ["INTERNAL"], persistenceModes: ["PERMANENT"], providerSystemIds: ["SERVICE-LOADING", "SERVICE-RECEIVING", "SERVICE-SIDE-LANE-N1", "SERVICE-SUPPORT-N1", "KITCHEN-N1"], interfaceState: "VALID", capacity: { value: 3, unit: "m clear route width", timeBasis: "normal and peak delivery", demandBasis: "service logistics", configuration: "lateral independent circuit", state: "NORMAL" }, availability: "AVAILABLE", performance: design.routes.some((route) => route.id === "SERVICE-ROUTE-N1" && route.widthM >= 3) ? "SUPPORTED" : "PARTIAL", evidence: serviceRequirement.evidence }),
    assessV3Capability({ capabilityId: "CAP-RESTAURANT-EGRESS", requirementId: egressRequirement.id, necessity: egressRequirement.functionalNecessity, realizationModes: ["INTERNAL"], persistenceModes: ["PERMANENT"], providerSystemIds: ["STAIR-W-CORE", "STAIR-E-CORE"], interfaceState: "VALID", capacity: { value: 500, unit: "persons declared aforo", timeBasis: "emergency", demandBasis: "maximum declared occupancy", configuration: "two continuous stair cores", state: "EMERGENCY" }, availability: "AVAILABLE", performance: design.cores.filter((core) => core.kind === "STAIR" && core.continuity === "CONTINUOUS").length === 2 ? "SUPPORTED" : "PARTIAL", evidence: egressRequirement.evidence }),
    assessV3Capability({ capabilityId: "CAP-RESTAURANT-WASTE", requirementId: wasteRequirement.id, necessity: wasteRequirement.functionalNecessity, realizationModes: ["INTERNAL"], persistenceModes: ["PERMANENT"], providerSystemIds: ["SERVICE-SUPPORT-N1"], interfaceState: "PARTIAL", capacity: undefined, availability: "CONDITIONAL", performance: "PARTIAL", evidence: wasteRequirement.evidence }),
  ];
  const flowSegments = [
    deriveV3FlowSegment({ id: "FLOW-RESTAURANT-PUBLIC", segmentId: "SEG-PUBLIC-01", kind: "PUBLIC", from: "PARKING-CUSTOMER", to: "DINING-A-N1", separation: "SPATIAL", operationalStates: ["NORMAL", "PEAK", "EMERGENCY"], compatibility: "COMPATIBLE", evidence: diningRequirement.evidence }),
    deriveV3FlowSegment({ id: "FLOW-RESTAURANT-GOODS", segmentId: "SEG-GOODS-01", kind: "GOODS", from: "SERVICE-LOADING", to: "KITCHEN-N1", separation: "PHYSICALLY_SEPARATED", operationalStates: ["NORMAL", "PEAK", "MAINTENANCE"], processId: "PROC-RECEIVE-STORE-COOK", compatibility: "COMPATIBLE", evidence: serviceRequirement.evidence }),
    deriveV3FlowSegment({ id: "FLOW-RESTAURANT-SERVICE", segmentId: "SEG-SERVICE-01", kind: "SERVICE", from: "SERVICE-RECEIVING", to: "SERVICE-SUPPORT-N1", separation: "SPATIAL", operationalStates: ["NORMAL", "PEAK", "CHANGEOVER"], processId: "PROC-SERVICE-LOGISTICS", compatibility: "COMPATIBLE", evidence: serviceRequirement.evidence }),
    deriveV3FlowSegment({ id: "FLOW-RESTAURANT-WASTE", segmentId: "SEG-WASTE-01", kind: "WASTE", from: "KITCHEN-N1", to: "SERVICE-SUPPORT-N1", separation: "CONTROLLED", operationalStates: ["NORMAL", "MAINTENANCE"], processId: "PROC-WASTE-RETURN", compatibility: "CONDITIONAL", evidence: wasteRequirement.evidence }),
    deriveV3FlowSegment({ id: "FLOW-RESTAURANT-EGRESS", segmentId: "SEG-EGRESS-01", kind: "EMERGENCY", from: "DINING-C-N2", to: "EXTERIOR", separation: "PROTECTED", operationalStates: ["EMERGENCY", "RECOVERY"], processId: "PROC-EVACUATION", compatibility: "COMPATIBLE", evidence: egressRequirement.evidence }),
  ];
  const relationships = [
    deriveV3Relationship({ id: "REL-RESTAURANT-KITCHEN-DINING", from: "KITCHEN-N1", to: "DINING-A-N1", dimensions: ["FUNCTIONAL", "LOGISTICS", "HYGIENE", "TEMPORAL"], temporalStates: ["NORMAL", "PEAK", "CHANGEOVER"], separation: "CONTROLLED", compatibility: "SHARE_WITH_CONDITIONS", reason: "Kitchen and dining share a service interface while public and goods flows remain separated.", evidence: serviceRequirement.evidence }),
    deriveV3Relationship({ id: "REL-RESTAURANT-PUBLIC-SERVICE", from: "PUBLIC-SPINE-N1", to: "SERVICE-SIDE-LANE-N1", dimensions: ["SECURITY", "LOGISTICS", "ACCESS", "HYGIENE"], temporalStates: ["NORMAL", "PEAK", "EMERGENCY"], separation: "PHYSICALLY_SEPARATED", compatibility: "SEPARATE", reason: "Public and service circulation require separation in this alternative.", evidence: serviceRequirement.evidence }),
  ];
  const deficits = capabilities.filter((capability) => capability.satisfied !== "SATISFIED");
  return { projectId: design.projectId, alternativeId: design.alternativeId, typology: "RESTAURANT", design, capabilities, flowSegments, relationships, deficits, status: deficits.length === 0 ? "SUPPORTED_WITH_OBSERVATIONS" : "PARTIAL", humanReviewRequired: true, epistemicState: "HYPOTHESIS", noPermitClaim: true };
}

export function validateRestaurantV3Evaluation(evaluation = evaluateRestaurantV3()) { return { typologyPass: evaluation.typology === "RESTAURANT", capacityCapabilityPass: evaluation.capabilities.find((item) => item.capabilityId === "CAP-RESTAURANT-DINING")?.satisfied === "SATISFIED", serviceFlowPass: evaluation.flowSegments.some((item) => item.id === "FLOW-RESTAURANT-GOODS" && item.separation === "PHYSICALLY_SEPARATED"), emergencyFlowPass: evaluation.flowSegments.some((item) => item.id === "FLOW-RESTAURANT-EGRESS" && item.separation === "PROTECTED"), multidimensionalRelationshipPass: evaluation.relationships.every((item) => item.kind === "MULTIDIMENSIONAL" && item.dimensions.length > 1), deficitPreserved: evaluation.deficits.some((item) => item.capabilityId === "CAP-RESTAURANT-WASTE" && item.deficit), humanReviewRequired: evaluation.humanReviewRequired, noPermitClaim: evaluation.noPermitClaim }; }
