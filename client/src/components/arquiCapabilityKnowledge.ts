import type { CapabilityContext, CapabilityReadiness } from "./arquiCapabilities";

export type CapabilityAvailability = "IMPLEMENTED" | "IMPLEMENTED_WITH_LIMITATIONS" | "PARTIAL" | "REGISTERED_NOT_IMPLEMENTED" | "UNAVAILABLE" | "NOT_VERIFIED";
export type CapabilityCategory = "FIELD" | "EVIDENCE" | "VISUAL_INTELLIGENCE" | "SITE_CONTEXT" | "DESIGN" | "ANALYSIS" | "COMPARISON" | "SPATIAL_REGISTRATION" | "AR_PRESENTATION" | "HUMAN_REVIEW" | "KNOWLEDGE" | "NAVIGATION_VISUALIZATION";
export type MutationLevel = "READ_ONLY" | "PRESENTATION_ONLY" | "REVERSIBLE_UI_ACTION" | "PROJECT_MUTATION" | "HUMAN_AUTHORITY_ACTION";
export type HumanAuthorityLevel = "NONE" | "USER_INTERACTION" | "EXPLICIT_CONFIRMATION" | "HUMAN_ONLY";
export type OperationalReadiness = "CAN_READ" | "CAN_PREPARE" | "CAN_PROPOSE" | "CAN_EXECUTE_CURRENTLY" | "REQUIRES_HUMAN_CONFIRMATION" | "HUMAN_ONLY";

export type CapabilityDescriptor = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: CapabilityCategory;
  purposeKey: string;
  supportedScopes: string[];
  inputs: string[];
  requiredInputs: string[];
  optionalInputs: string[];
  outputs: string[];
  epistemicOutputs: string[];
  availableActions: string[];
  mutationLevel: MutationLevel;
  humanAuthorityLevel: HumanAuthorityLevel;
  reversibility: "NON_MUTATING" | "REVERSIBLE" | "MUTATING" | "UNKNOWN";
  availability: CapabilityAvailability;
  readiness: CapabilityReadiness;
  limitations: string[];
  uiDestination?: string;
  existingImplementationReference: string;
  relatedCapabilities: string[];
  operationalReadiness: OperationalReadiness[];
};

export type CapabilityKnowledgeContext = CapabilityContext & {
  hasAnalysis?: boolean;
  hasEvaluation?: boolean;
  hasSpatialRepresentation?: boolean;
  hasKnowledge?: boolean;
};

export type CapabilityKnowledgeAnswer = {
  descriptors: CapabilityDescriptor[];
  relevant: CapabilityDescriptor[];
  missing: string[];
};

const staticDescriptors: Omit<CapabilityDescriptor, "readiness" | "availability" | "operationalReadiness">[] = [
  { id: "FIELD_CAPTURE", nameKey: "arqui.capability_name_field_capture", descriptionKey: "arqui.capability_description_field_capture", category: "FIELD", purposeKey: "arqui.capability_purpose_field_capture", supportedScopes: ["project", "field"], inputs: ["observation", "optional location", "optional photo"], requiredInputs: ["user observation"], optionalInputs: ["photo", "location"], outputs: ["spatial evidence"], epistemicOutputs: ["USER_PROVIDED", "OBSERVED"], availableActions: ["navigate:evidence"], mutationLevel: "PROJECT_MUTATION", humanAuthorityLevel: "USER_INTERACTION", reversibility: "UNKNOWN", limitations: ["capture is not regulatory verification"], uiDestination: "evidence", existingImplementationReference: "FieldCapturePanel + spatial evidence endpoint", relatedCapabilities: ["MEDIA_EVIDENCE", "HUMAN_REVIEW"], },
  { id: "VISUAL_FIELD_INTELLIGENCE", nameKey: "arqui.capability_name_visual_field", descriptionKey: "arqui.capability_description_visual_field", category: "VISUAL_INTELLIGENCE", purposeKey: "arqui.capability_purpose_visual_field", supportedScopes: ["project", "field"], inputs: ["photo/media evidence"], requiredInputs: ["photo/media evidence"], optionalInputs: [], outputs: ["AI-proposed observations"], epistemicOutputs: ["AI_PROPOSED", "UNKNOWN"], availableActions: ["navigate:evidence"], mutationLevel: "PROJECT_MUTATION", humanAuthorityLevel: "EXPLICIT_CONFIRMATION", reversibility: "UNKNOWN", limitations: ["observations remain AI_PROPOSED until HumanReview"], uiDestination: "evidence", existingImplementationReference: "Visual Field Intelligence server adapter + FieldCapturePanel", relatedCapabilities: ["FIELD_CAPTURE", "HUMAN_REVIEW"], },
  { id: "HUMAN_REVIEW", nameKey: "arqui.capability_name_human_review", descriptionKey: "arqui.capability_description_human_review", category: "HUMAN_REVIEW", purposeKey: "arqui.capability_purpose_human_review", supportedScopes: ["project", "evidence"], inputs: ["AI-proposed or pending evidence"], requiredInputs: ["pending review item"], optionalInputs: [], outputs: ["confirmed, corrected or rejected evidence"], epistemicOutputs: ["CONFIRMED_EVIDENCE"], availableActions: ["navigate:evidence"], mutationLevel: "HUMAN_AUTHORITY_ACTION", humanAuthorityLevel: "HUMAN_ONLY", reversibility: "UNKNOWN", limitations: ["ARQUI cannot confirm on behalf of the architect"], uiDestination: "evidence", existingImplementationReference: "spatial evidence review endpoint + EvidencePage", relatedCapabilities: ["VISUAL_FIELD_INTELLIGENCE", "FIELD_CAPTURE"], },
  { id: "COMPARISON", nameKey: "arqui.capability_name_comparison", descriptionKey: "arqui.capability_description_comparison", category: "COMPARISON", purposeKey: "arqui.capability_purpose_comparison", supportedScopes: ["project", "design"], inputs: ["alternatives"], requiredInputs: ["at least two alternatives"], optionalInputs: ["evaluations"], outputs: ["comparison view"], epistemicOutputs: ["COMPUTED", "INTERPRETATION", "UNKNOWN"], availableActions: ["navigate:comparisons"], mutationLevel: "READ_ONLY", humanAuthorityLevel: "USER_INTERACTION", reversibility: "NON_MUTATING", limitations: ["comparison does not select a winner"], uiDestination: "comparisons", existingImplementationReference: "UPAO001SpatialComparison", relatedCapabilities: ["DESIGN_DISTANCE", "EVALUATION"], },
  { id: "REGISTERED_AR_VIEW", nameKey: "arqui.capability_name_ar", descriptionKey: "arqui.capability_description_ar", category: "AR_PRESENTATION", purposeKey: "arqui.capability_purpose_ar", supportedScopes: ["registered project"], inputs: ["spatial registration", "spatial representation"], requiredInputs: ["valid registration"], optionalInputs: ["camera"], outputs: ["registered AR view"], epistemicOutputs: ["PRESENTATION_STATE"], availableActions: ["navigate:ar"], mutationLevel: "PRESENTATION_ONLY", humanAuthorityLevel: "USER_INTERACTION", reversibility: "NON_MUTATING", limitations: ["real device/site alignment may remain unproven"], uiDestination: "ar", existingImplementationReference: "SpatialARView + SpatialRegistration", relatedCapabilities: ["SPATIAL_REGISTRATION", "SPATIAL_REPRESENTATION"], },
  { id: "DESIGN_OPERATIONS", nameKey: "arqui.capability_name_design_operations", descriptionKey: "arqui.capability_description_design_operations", category: "DESIGN", purposeKey: "arqui.capability_purpose_design_operations", supportedScopes: ["design", "building"], inputs: ["selected alternative", "supported operation"], requiredInputs: ["selected target"], optionalInputs: ["operation parameters"], outputs: ["preview or transformed alternative"], epistemicOutputs: ["COMPUTED", "HYPOTHESIS"], availableActions: ["navigate:design"], mutationLevel: "PROJECT_MUTATION", humanAuthorityLevel: "EXPLICIT_CONFIRMATION", reversibility: "REVERSIBLE", limitations: ["ARQUI does not execute operations automatically"], uiDestination: "design", existingImplementationReference: "SpatialOperationsPanel + canonical spatial operations", relatedCapabilities: ["SPATIAL_REPRESENTATION", "COMPARISON"], },
  { id: "DESIGN_KNOWLEDGE", nameKey: "arqui.capability_name_design_knowledge", descriptionKey: "arqui.capability_description_design_knowledge", category: "KNOWLEDGE", purposeKey: "arqui.capability_purpose_design_knowledge", supportedScopes: ["multiscale"], inputs: ["question", "scope", "problem terms"], requiredInputs: ["design question"], optionalInputs: ["scope", "typology"], outputs: ["source-aware knowledge matches"], epistemicOutputs: ["INTERPRETATION", "HYPOTHESIS", "UNKNOWN"], availableActions: ["navigate:design"], mutationLevel: "READ_ONLY", humanAuthorityLevel: "USER_INTERACTION", reversibility: "NON_MUTATING", limitations: ["general knowledge is not project fact"], uiDestination: "design", existingImplementationReference: "RFC-026 DesignKnowledgeAgent query endpoint", relatedCapabilities: ["CAUSAL_TRACE", "DESIGN_OPERATIONS"], },
  { id: "CAUSAL_TRACE", nameKey: "arqui.capability_name_causal_trace", descriptionKey: "arqui.capability_description_causal_trace", category: "ANALYSIS", purposeKey: "arqui.capability_purpose_causal_trace", supportedScopes: ["project", "design"], inputs: ["intent", "knowledge", "alternative"], requiredInputs: ["design reasoning context"], optionalInputs: ["observed effect"], outputs: ["design contribution trace"], epistemicOutputs: ["FACT", "COMPUTED", "INTERPRETATION", "UNKNOWN"], availableActions: ["navigate:design"], mutationLevel: "READ_ONLY", humanAuthorityLevel: "USER_INTERACTION", reversibility: "NON_MUTATING", limitations: ["expected effect is not observed effect"], uiDestination: "design", existingImplementationReference: "Design Contribution Trace endpoint + GuidedShell", relatedCapabilities: ["DESIGN_KNOWLEDGE", "EVALUATION"], },
];

export function deriveCapabilityKnowledge(context: CapabilityKnowledgeContext): CapabilityKnowledgeAnswer {
  const readiness = (id: string): CapabilityReadiness => {
    if (id === "COMPARISON") return context.alternatives >= 2 ? "READY" : "BLOCKED";
    if (id === "VISUAL_FIELD_INTELLIGENCE") return context.photos > 0 ? (context.pendingReview > 0 ? "PARTIAL" : "READY") : "BLOCKED";
    if (id === "HUMAN_REVIEW") return context.pendingReview > 0 ? "READY" : "UNKNOWN";
    if (id === "REGISTERED_AR_VIEW") return context.locationRegistered ? "READY" : "UNKNOWN";
    if (id === "DESIGN_OPERATIONS") return context.alternatives > 0 ? "READY" : "BLOCKED";
    if (id === "CAUSAL_TRACE") return context.alternatives > 0 ? "PARTIAL" : "UNKNOWN";
    return "READY";
  };
  const descriptors = staticDescriptors.map((base) => {
    const current = readiness(base.id);
    const availability: CapabilityAvailability = ["FIELD_CAPTURE", "VISUAL_FIELD_INTELLIGENCE", "HUMAN_REVIEW", "COMPARISON", "REGISTERED_AR_VIEW", "DESIGN_OPERATIONS", "DESIGN_KNOWLEDGE", "CAUSAL_TRACE"].includes(base.id) ? (current === "READY" ? "IMPLEMENTED" : "IMPLEMENTED_WITH_LIMITATIONS") : "NOT_VERIFIED";
    const operationalReadiness: OperationalReadiness[] = base.id === "HUMAN_REVIEW" ? ["CAN_READ", "CAN_PREPARE", "HUMAN_ONLY"] : base.mutationLevel === "READ_ONLY" || base.mutationLevel === "PRESENTATION_ONLY" ? ["CAN_READ", "CAN_PREPARE"] : ["CAN_READ", "CAN_PREPARE", "REQUIRES_HUMAN_CONFIRMATION"];
    return { ...base, readiness: current, availability, operationalReadiness };
  });
  return { descriptors, relevant: descriptors.filter((item) => item.readiness !== "UNKNOWN" || item.availability === "IMPLEMENTED"), missing: descriptors.filter((item) => item.readiness === "BLOCKED").map((item) => item.id) };
}

export function answerCapabilityQuestion(question: string, context: CapabilityKnowledgeContext): { kind: "CAPABILITY" | "REQUIREMENTS" | "WORKFLOW" | "EXECUTION" | "UNKNOWN"; descriptor?: CapabilityDescriptor; textKey: string; params?: Record<string, unknown> } {
  const q = question.toLowerCase();
  const knowledge = deriveCapabilityKnowledge(context);
  const find = (ids: string[]) => knowledge.descriptors.find((item) => ids.includes(item.id));
  const descriptor = /foto|photo|imagen|visual/.test(q) ? find(["VISUAL_FIELD_INTELLIGENCE"]) : /compar|alternativ/.test(q) ? find(["COMPARISON"]) : /ar\b|sitio/.test(q) ? find(["REGISTERED_AR_VIEW"]) : /altura|alto|height|patio|courtyard|cambiar|modify/.test(q) ? find(["DESIGN_OPERATIONS"]) : /revis|review|observ/.test(q) ? find(["HUMAN_REVIEW"]) : /conocimiento|principio|pattern|autor/.test(q) ? find(["DESIGN_KNOWLEDGE"]) : undefined;
  if (/qué necesitas|qué necesito|what do you need|requisit/.test(q) && descriptor) return { kind: "REQUIREMENTS", descriptor, textKey: "arqui.capability_requirements_answer", params: { name: descriptor.nameKey, requirements: descriptor.requiredInputs.join(", ") } };
  if (/cómo hago|how do i|dónde|where do i/.test(q) && descriptor) return { kind: "WORKFLOW", descriptor, textKey: "arqui.capability_workflow_answer", params: { name: descriptor.nameKey, destination: descriptor.uiDestination ?? "" } };
  if (/hazlo|do it|ejecut|for me/.test(q) && descriptor) return { kind: "EXECUTION", descriptor, textKey: descriptor.operationalReadiness.includes("CAN_EXECUTE_CURRENTLY") ? "arqui.capability_execution_available" : "arqui.capability_execution_not_authorized", params: { name: descriptor.nameKey } };
  if (descriptor) return { kind: "CAPABILITY", descriptor, textKey: "arqui.capability_answer", params: { name: descriptor.nameKey } };
  if (/qué puedes hacer|what can you do|qué capacidades|what capabilities|herramientas disponibles|available tools/.test(q)) return { kind: "CAPABILITY", textKey: "arqui.capability_catalog_answer", params: { count: knowledge.relevant.length } };
  return { kind: "UNKNOWN", textKey: "arqui.capability_unknown_answer" };
}
