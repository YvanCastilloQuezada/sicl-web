export type CapabilityReadiness = "READY" | "PARTIAL" | "BLOCKED" | "UNKNOWN";
export type CapabilityId = "COMPARISON" | "REGISTERED_AR_VIEW" | "VISUAL_FIELD_INTELLIGENCE" | "FIELD_CAPTURE";
export type Capability = { id: CapabilityId; status: CapabilityReadiness; requirementKeys: string[]; missingKeys: string[]; pendingReview: number; action?: { target: string; labelKey: string } };
export type CapabilityContext = { alternatives: number; photos: number; pendingReview: number; locationRegistered: boolean };

export function deriveArquiCapabilities(context: CapabilityContext): Capability[] {
  return [
    { id: "COMPARISON", status: context.alternatives >= 2 ? "READY" : "BLOCKED", requirementKeys: ["arqui.capability_requirement_alternatives"], missingKeys: context.alternatives >= 2 ? [] : ["arqui.capability_missing_alternative"], pendingReview: 0, action: context.alternatives >= 2 ? { target: "comparisons", labelKey: "arqui.compare_action" } : { target: "alternatives", labelKey: "arqui.view_alternatives" } },
    { id: "REGISTERED_AR_VIEW", status: context.locationRegistered ? "READY" : "UNKNOWN", requirementKeys: ["arqui.capability_requirement_registration"], missingKeys: context.locationRegistered ? [] : ["arqui.capability_unknown_registration"], pendingReview: 0, action: { target: "context", labelKey: "arqui.review_registration" } },
    { id: "VISUAL_FIELD_INTELLIGENCE", status: context.photos > 0 ? (context.pendingReview > 0 ? "PARTIAL" : "READY") : "BLOCKED", requirementKeys: ["arqui.capability_requirement_photo"], missingKeys: context.photos > 0 ? [] : ["arqui.capability_missing_photo"], pendingReview: context.pendingReview, action: { target: "evidence", labelKey: context.photos > 0 ? "arqui.analyze_photo" : "arqui.select_photo" } },
    { id: "FIELD_CAPTURE", status: "READY", requirementKeys: [], missingKeys: [], pendingReview: 0, action: { target: "evidence", labelKey: "arqui.open_field_capture" } },
  ];
}
