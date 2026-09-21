export type ProfessionalReviewStatus = "NOT_READY" | "READY_FOR_REVIEW" | "REVISIONS_REQUIRED" | "APPROVED_FOR_SIGNATURE" | "SIGNED_EXTERNALLY";
export type ProfessionalRole = "ARCHITECT" | "STRUCTURAL_ENGINEER" | "SANITARY_ENGINEER" | "ELECTRICAL_ENGINEER" | "MECHANICAL_ENGINEER" | "FIRE_ENGINEER" | "BIOSAFETY_SPECIALIST" | "ENVIRONMENTAL_SPECIALIST" | "SOMA_SPECIALIST" | "TRAFFIC_ENGINEER" | "BIM_MANAGER" | "OTHER_SPECIALIST";
export type ProfessionalReviewInput = { projectId: string; specialtyId: string; role: ProfessionalRole; packageVersion: string; evidenceIds: string[]; calculations: string[]; openUnknowns: string[]; proposedCorrections: string[]; reviewerIdentity?: string; licenseOrCredentialReference?: string; decision: "ACCEPT" | "ACCEPT_WITH_CORRECTIONS" | "REJECT" | "REQUEST_MORE_EVIDENCE" };

export function buildProfessionalReviewGate(input: Pick<ProfessionalReviewInput, "projectId" | "specialtyId" | "role" | "packageVersion" | "evidenceIds" | "calculations" | "openUnknowns">) {
  const missing: string[] = [];
  if (!input.projectId || !input.specialtyId || !input.packageVersion) missing.push("project/package identity");
  if (input.evidenceIds.length === 0) missing.push("review evidence");
  if (input.calculations.length === 0) missing.push("specialist calculations or explicit not-applicable statement");
  const status: ProfessionalReviewStatus = missing.length ? "NOT_READY" : input.openUnknowns.length ? "READY_FOR_REVIEW" : "READY_FOR_REVIEW";
  return { schema: "ARKI-PROFESSIONAL-REVIEW-GATE-1.0", projectId: input.projectId, specialtyId: input.specialtyId, role: input.role, packageVersion: input.packageVersion, missing, status, requiredActions: ["Review model, inputs, calculations and assumptions", "Record corrections or acceptance", "Confirm jurisdictional and code basis", "Only the qualified specialist may sign", "A signature must never be auto-generated"], finalAuthority: "Professional reviewer and approving authority", humanReviewRequired: true as const };
}

export function recordProfessionalReview(input: ProfessionalReviewInput) {
  const gate = buildProfessionalReviewGate(input);
  if (gate.status === "NOT_READY") return { ...gate, decision: "BLOCKED" as const, signed: false as const, reason: "REVIEW_PACKAGE_INCOMPLETE" };
  const status: ProfessionalReviewStatus = input.decision === "REJECT" || input.decision === "REQUEST_MORE_EVIDENCE" ? "REVISIONS_REQUIRED" : input.decision === "ACCEPT_WITH_CORRECTIONS" ? "REVISIONS_REQUIRED" : input.reviewerIdentity && input.licenseOrCredentialReference ? "APPROVED_FOR_SIGNATURE" : "READY_FOR_REVIEW";
  return { ...gate, status, decision: input.decision, corrections: input.proposedCorrections, reviewerIdentity: input.reviewerIdentity ?? "NOT_RECORDED", licenseOrCredentialReference: input.licenseOrCredentialReference ?? "NOT_RECORDED", signed: false as const, signatureState: "EXTERNAL_SIGNATURE_REQUIRED" as const, noAutomaticApproval: true as const };
}

export function professionalAuthorityContract() {
  return { schema: "ARKI-PROFESSIONAL-AUTHORITY-1.0", arkiRole: "Produce coordinated design, calculations, assumptions, evidence and correction candidates across specialties", specialistRole: "Review, recalculate, correct, accept or reject and sign when professionally authorized", rule: "Good ARKI output is reviewable; it is not automatically approved or signed", performanceClaim: "No accuracy percentage is asserted without representative benchmark evidence", statuses: ["NOT_READY", "READY_FOR_REVIEW", "REVISIONS_REQUIRED", "APPROVED_FOR_SIGNATURE", "SIGNED_EXTERNALLY"] as const };
}
