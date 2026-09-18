import type { AccessibilityRouteInput } from "./accessibilityAssessment";

export type RegulatorySourceType = "LAW" | "REGULATION" | "TECHNICAL_STANDARD" | "MUNICIPAL_RULE" | "ADMINISTRATIVE_RULE" | "GUIDELINE" | "OTHER" | "UNKNOWN";
export type RegulatoryVerificationState = "VERIFIED" | "NO_VERIFIED" | "UNKNOWN";
export type RegulatoryHumanReviewState = "NOT_STARTED" | "PENDING_HUMAN_REVIEW" | "CONFIRMED" | "REJECTED";
export type ApplicabilityState = "APPLICABLE_CANDIDATE" | "NOT_APPLICABLE" | "INSUFFICIENT_CONTEXT" | "CONFLICTING_EVIDENCE" | "PENDING_HUMAN_REVIEW" | "HUMAN_CONFIRMED_APPLICABLE" | "HUMAN_CONFIRMED_NOT_APPLICABLE" | "UNKNOWN";
export type RequirementEpistemicState = "IDENTIFIED" | "INTERPRETED" | "UNKNOWN";

export type RegulatorySourceReference = {
  sourceId: string;
  sourceTitle?: string;
  sourceType: RegulatorySourceType;
  issuingAuthority?: string;
  jurisdiction?: string;
  publicationDate?: string;
  effectiveDate?: string;
  expiryOrRepealState?: string;
  version?: string;
  amendmentReference?: string;
  sourceLocator?: string;
  provenance: string[];
  verificationState: RegulatoryVerificationState;
  humanReviewState: RegulatoryHumanReviewState;
};

export type RegulatoryRequirementReference = {
  requirementId: string;
  sourceId: string;
  sourceLocator?: string;
  subject?: string;
  parameter?: string;
  operator?: string;
  value?: number | string;
  unit?: string;
  tolerance?: number | string;
  conditions?: string[];
  applicability: ApplicabilityState;
  epistemicState: RequirementEpistemicState;
  provenance: string[];
  humanReviewState: RegulatoryHumanReviewState;
};

export type RegulatoryApplicabilityContext = {
  jurisdiction?: string;
  spatialScope?: string;
  projectUseType?: string;
  buildingUseCategory?: string;
  projectStage?: string;
  subject?: string;
  temporalDate?: string;
  accessibilityContext?: string;
};

export type RegulatoryApplicabilityAssessment = {
  sourceId: string;
  requirementId?: string;
  state: ApplicabilityState;
  reasons: string[];
  missingContext: string[];
  sourceRefs: string[];
  evidenceRefs: string[];
  humanReviewState: RegulatoryHumanReviewState;
  complianceStatus: "NOT_ASSESSED";
  noAutomaticApproval: true;
  noDecision: true;
  noRecommendation: true;
};

export type RegulatoryConflictSet = {
  conflictId: string;
  requirementIds: string[];
  sourceIds: string[];
  state: "CONFLICT_PRESERVED";
  reason: string;
  humanReviewRequired: true;
  automaticWinner: false;
};

export type AccessibilityRegulatoryTrace = {
  routeId: string;
  jurisdictionRef?: string;
  ruleVersion?: string;
  evidenceRefs: string[];
  requirementRefs: string[];
  regulatoryEvidenceRefs: string[];
  complianceStatus: "NOT_ASSESSED";
};

function known(value: string | undefined): boolean { return typeof value === "string" && value.trim().length > 0; }
function requiredContext(context: RegulatoryApplicabilityContext): Array<[string, string | undefined]> { return [["JURISDICTION", context.jurisdiction], ["SPATIAL_SCOPE", context.spatialScope], ["PROJECT_USE_TYPE", context.projectUseType], ["PROJECT_STAGE", context.projectStage]]; }

export function assessRegulatoryApplicability(source: RegulatorySourceReference, requirement: RegulatoryRequirementReference | undefined, context: RegulatoryApplicabilityContext, evidenceRefs: string[] = []): RegulatoryApplicabilityAssessment {
  const missingContext = requiredContext(context).filter(([, value]) => !known(value)).map(([name]) => name);
  const reasons: string[] = [];
  if (!known(source.jurisdiction)) missingContext.push("SOURCE_JURISDICTION");
  if (!known(source.version)) missingContext.push("SOURCE_VERSION");
  if (source.verificationState !== "VERIFIED") missingContext.push("SOURCE_VERIFICATION");
  if (requirement && requirement.sourceId !== source.sourceId) reasons.push("REQUIREMENT_SOURCE_MISMATCH");
  if (requirement && requirement.applicability === "CONFLICTING_EVIDENCE") reasons.push("REQUIREMENT_CONFLICT");
  const sameJurisdiction = known(source.jurisdiction) && known(context.jurisdiction) && source.jurisdiction === context.jurisdiction;
  if (known(source.jurisdiction) && known(context.jurisdiction) && !sameJurisdiction) reasons.push("JURISDICTION_MISMATCH");
  const state: ApplicabilityState = reasons.includes("JURISDICTION_MISMATCH") ? "NOT_APPLICABLE" : reasons.length ? "CONFLICTING_EVIDENCE" : missingContext.length ? "INSUFFICIENT_CONTEXT" : "APPLICABLE_CANDIDATE";
  return { sourceId: source.sourceId, requirementId: requirement?.requirementId, state, reasons, missingContext: Array.from(new Set(missingContext)), sourceRefs: [source.sourceId, ...(source.sourceLocator ? [source.sourceLocator] : [])], evidenceRefs, humanReviewState: state === "APPLICABLE_CANDIDATE" ? "PENDING_HUMAN_REVIEW" : "NOT_STARTED", complianceStatus: "NOT_ASSESSED", noAutomaticApproval: true, noDecision: true, noRecommendation: true };
}

export function confirmApplicability(assessment: RegulatoryApplicabilityAssessment, confirmed: boolean): RegulatoryApplicabilityAssessment {
  if (!confirmed || assessment.state !== "APPLICABLE_CANDIDATE") return assessment;
  return { ...assessment, state: "HUMAN_CONFIRMED_APPLICABLE", humanReviewState: "CONFIRMED" };
}

export function preserveRegulatoryConflict(requirements: RegulatoryRequirementReference[], reason: string): RegulatoryConflictSet | undefined {
  if (requirements.length < 2) return undefined;
  return { conflictId: `regulatory-conflict:${requirements.map((item) => item.requirementId).join("|")}`, requirementIds: requirements.map((item) => item.requirementId), sourceIds: requirements.map((item) => item.sourceId), state: "CONFLICT_PRESERVED", reason, humanReviewRequired: true, automaticWinner: false };
}

export function buildAccessibilityRegulatoryTrace(input: AccessibilityRouteInput, requirementRefs: string[], regulatoryEvidenceRefs: string[]): AccessibilityRegulatoryTrace {
  const evidenceRefs = Object.values(input.measurements).flatMap((measurement) => measurement.evidenceRefs);
  return { routeId: input.routeId, jurisdictionRef: input.profile?.jurisdictionRef, ruleVersion: input.profile?.ruleVersion, evidenceRefs, requirementRefs, regulatoryEvidenceRefs, complianceStatus: "NOT_ASSESSED" };
}

export function validateRegulatoryFoundation(source: RegulatorySourceReference, requirement: RegulatoryRequirementReference | undefined, assessment: RegulatoryApplicabilityAssessment): boolean {
  return Boolean(source.sourceId && source.provenance.length && assessment.complianceStatus === "NOT_ASSESSED" && assessment.noAutomaticApproval && assessment.noDecision && assessment.noRecommendation && (!requirement || requirement.sourceId === source.sourceId));
}
