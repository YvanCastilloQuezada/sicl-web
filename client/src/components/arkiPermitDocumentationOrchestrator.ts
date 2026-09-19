import type { IntegratedProductFoundation } from "./arkiIntegratedProductFoundation";
import { deriveConstructiveReadiness } from "./arkiBuildingAuthoring";

export type PermitGateState = "PASS_WITH_OBSERVATIONS" | "REQUIRES_DATA" | "EXTERNAL_VALIDATION_REQUIRED" | "PENDING_HUMAN_REVIEW" | "BLOCKED";
export type PermitPhaseId = "P0_CONSTRUCTIVE_FOUNDATION" | "P1_ARCHITECTURAL_DOCUMENTATION" | "P2_ENGINEERING_COORDINATION" | "P3_REGULATORY_APPLICABILITY" | "P4_EXPORT_AND_SHEETS" | "P5_PROFESSIONAL_REVIEW";
export type PermitProjectProfile = { jurisdiction?: string; projectUseType?: string; buildingUseCategory?: string; projectStage?: string; humanReviewerAssigned?: boolean; humanReviewConfirmed?: boolean; regulatoryComplianceStatus?: "VERIFIED" | "NOT_ASSESSED"; regulatoryVerificationRefs?: string[] };
export type PermitGate = { phase: PermitPhaseId; state: PermitGateState; evidence: string[]; missingInputs: string[]; claims: string[]; humanReviewRequired: true };
export type PermitDocumentationPackage = { projectId: string; modelVersion: string; status: "NOT_READY_FOR_PERMIT" | "PREPARED_FOR_HUMAN_REVIEW"; gates: PermitGate[]; deliverables: string[]; externalDependencies: string[]; noAutomaticApproval: true; noAutomaticDecision: true; humanAuthority: "PRESERVED"; permitReady: false; constructionReady: false; provenance: string[] };

const gate = (phase: PermitPhaseId, state: PermitGateState, evidence: string[], missingInputs: string[], claims: string[]): PermitGate => ({ phase, state, evidence, missingInputs, claims, humanReviewRequired: true });

/**
 * Coordinates the existing canonical model, engineering awareness, regulatory
 * applicability and export boundaries into one permit-oriented package.
 * This is an orchestration/readiness contract, not a permit approval engine.
 */
export function buildPermitDocumentationPackage(foundation: IntegratedProductFoundation, profile: PermitProjectProfile = {}): PermitDocumentationPackage {
  const model = foundation.model;
  const readiness = deriveConstructiveReadiness(model);
  const hasJurisdiction = Boolean(profile.jurisdiction?.trim());
  const hasUse = Boolean(profile.projectUseType?.trim() || profile.buildingUseCategory?.trim());
  const hasStage = Boolean(profile.projectStage?.trim());
  const hasRegulatorySource = foundation.regulatory.some((item) => item.jurisdiction !== "UNKNOWN_JURISDICTION" && item.source !== "NO_VERIFIED_PROJECT_SOURCE");
  const hasVerifiedRegulatoryPackage = profile.regulatoryComplianceStatus === "VERIFIED" && (profile.regulatoryVerificationRefs?.length ?? 0) > 0;
  const gates: PermitGate[] = [
    gate("P0_CONSTRUCTIVE_FOUNDATION", readiness.candidates.length ? "REQUIRES_DATA" : "BLOCKED", readiness.candidates.length ? ["CanonicalBuildingModel", "constructive readiness map"] : [], readiness.missingInputs, ["Constructive candidates remain HYPOTHESIS.", "No thickness, family, material or engineering value is invented."]),
    gate("P1_ARCHITECTURAL_DOCUMENTATION", foundation.drawings.length >= 4 ? "PASS_WITH_OBSERVATIONS" : "BLOCKED", foundation.drawings.map((view) => view.viewId), ["verified dimensions", "complete annotation schedule", "professional sheet review"], ["Plan, site, section and elevation views derive from one canonical model.", "Conceptual documentation is not construction documentation."]),
    gate("P2_ENGINEERING_COORDINATION", foundation.engineering.records.length > 0 ? "REQUIRES_DATA" : "BLOCKED", foundation.engineering.records.map((record) => record.id), ["structural calculations", "geotechnical evidence", "MEP sizing and calculations", "fire and life-safety engineering", "discipline coordination review"], ["Engineering awareness and reservations exist.", "Performance calculations are not claimed."]),
    gate("P3_REGULATORY_APPLICABILITY", hasVerifiedRegulatoryPackage ? "PASS_WITH_OBSERVATIONS" : hasJurisdiction && hasUse && hasStage && hasRegulatorySource ? "PENDING_HUMAN_REVIEW" : "REQUIRES_DATA", [...foundation.regulatory.map((item) => item.source), ...(profile.regulatoryVerificationRefs ?? [])], hasVerifiedRegulatoryPackage ? ["professional review remains required for permit issuance"] : ["jurisdiction", "verified regulatory sources and versions", "project use/category", "project stage", "human applicability review"].filter((item) => item === "jurisdiction" && hasJurisdiction || item === "project use/category" && hasUse || item === "project stage" && hasStage || !["jurisdiction", "project use/category", "project stage"].includes(item)), [hasVerifiedRegulatoryPackage ? "RNE project compliance package is VERIFIED for the supplied evidence and human review record." : "Regulatory applicability is not compliance approval.", "Conflicting requirements remain preserved."]),
    gate("P4_EXPORT_AND_SHEETS", "EXTERNAL_VALIDATION_REQUIRED", ["DXF", "IFC massing", "GLB", "GeoJSON when CRS exists"], ["DWG native round-trip", "Revit native/API round-trip", "sheet/PDF professional review", "export parser readback"], ["DXF is not DWG.", "IFC massing is not a native Revit model."]),
    gate("P5_PROFESSIONAL_REVIEW", profile.humanReviewerAssigned && profile.humanReviewConfirmed ? "PENDING_HUMAN_REVIEW" : "BLOCKED", [], ["assigned architect and discipline reviewers", "signed review record", "professional signature/review", "revision and issue log"], ["Human authority is final.", "Automatic approval is forbidden."]),
  ];
  const allDataReady = gates.every((item) => item.state === "PASS_WITH_OBSERVATIONS" || item.state === "PENDING_HUMAN_REVIEW");
  return { projectId: foundation.projectId, modelVersion: model.modelVersion, status: allDataReady ? "PREPARED_FOR_HUMAN_REVIEW" : "NOT_READY_FOR_PERMIT", gates, deliverables: ["architectural drawing set", "coordination matrix", "regulatory applicability matrix", "issue/evidence register", "export package", "revision history"], externalDependencies: ["jurisdictional regulatory corpus", "survey and geotechnical evidence", "structural engineer", "MEP/fire specialists", "DWG/AutoCAD round-trip", "Revit runtime/API", "professional signature/review", "authority submission"], noAutomaticApproval: true, noAutomaticDecision: true, humanAuthority: "PRESERVED", permitReady: false, constructionReady: false, provenance: ["CanonicalBuildingModel", "IntegratedProductFoundation", "existing engineering awareness", "existing regulatory applicability foundation"] };
}

export function validatePermitDocumentationPackage(pkg: PermitDocumentationPackage): boolean {
  return pkg.projectId.length > 0 && pkg.modelVersion.length > 0 && pkg.gates.length === 6 && pkg.deliverables.length >= 5 && pkg.noAutomaticApproval && pkg.noAutomaticDecision && pkg.humanAuthority === "PRESERVED" && !pkg.permitReady && !pkg.constructionReady;
}
