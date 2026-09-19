import type {
  RegulatoryApplicabilityContext,
  RegulatoryHumanReviewState,
  RegulatoryRequirementReference,
  RegulatorySourceReference,
} from "./regulatoryApplicabilityFoundation";

export const RNE_OFFICIAL_SOURCE_IDS = {
  MASTER: "RNE-DS-011-2006-VIVIENDA-CURRENT_INDEX",
  G010: "RNE-G010-RM-278-2026-VIVIENDA",
  E030: "RNE-E030-RM-183-2026-VIVIENDA-AS_MODIFIED_RM-217-2026",
  SENCICO_INDEX: "RNE-SENCICO-OFFICIAL-INDEX",
} as const;

export const RNE_PERU_SOURCES: RegulatorySourceReference[] = [
  {
    sourceId: RNE_OFFICIAL_SOURCE_IDS.MASTER,
    sourceTitle: "Reglamento Nacional de Edificaciones — DS 011-2006-VIVIENDA y actualizaciones oficiales",
    sourceType: "REGULATION",
    issuingAuthority: "Ministerio de Vivienda, Construcción y Saneamiento",
    jurisdiction: "PERU",
    publicationDate: "2006-03-05",
    version: "DS-011-2006-VIVIENDA+CURRENT_OFFICIAL_UPDATES",
    sourceLocator: "https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne",
    provenance: ["OFFICIAL_GOB_PE", "RNE_MASTER_PUBLICATION", "VERSIONED_SOURCE_REGISTRY"],
    verificationState: "VERIFIED",
    humanReviewState: "CONFIRMED",
  },
  {
    sourceId: RNE_OFFICIAL_SOURCE_IDS.G010,
    sourceTitle: "G.010 Consideraciones Básicas — RM 278-2026-VIVIENDA",
    sourceType: "TECHNICAL_STANDARD",
    issuingAuthority: "Ministerio de Vivienda, Construcción y Saneamiento",
    jurisdiction: "PERU",
    publicationDate: "2026-09-19",
    effectiveDate: "2026-09-19",
    version: "RM-278-2026-VIVIENDA",
    sourceLocator: "https://cdn.www.gob.pe/uploads/document/file/2364029/2309793-01-g-010-consideraciones-basicas.pdf",
    provenance: ["OFFICIAL_GOB_PE", "RNE_OFFICIAL_DOCUMENT"],
    verificationState: "VERIFIED",
    humanReviewState: "CONFIRMED",
  },
  {
    sourceId: RNE_OFFICIAL_SOURCE_IDS.E030,
    sourceTitle: "E.030 Diseño Sismorresistente — RM 183-2026-VIVIENDA, modificada por RM 217-2026-VIVIENDA",
    sourceType: "TECHNICAL_STANDARD",
    issuingAuthority: "Ministerio de Vivienda, Construcción y Saneamiento",
    jurisdiction: "PERU",
    publicationDate: "2026-04-28",
    amendmentReference: "RM-217-2026-VIVIENDA",
    version: "RM-183-2026-VIVIENDA+RM-217-2026-VIVIENDA",
    sourceLocator: "https://www.gob.pe/institucion/vivienda/normas-legales/8219609-217-2026-vivienda",
    provenance: ["OFFICIAL_GOB_PE", "RNE_OFFICIAL_UPDATE_CHAIN", "E030_CURRENT_UPDATE"],
    verificationState: "VERIFIED",
    humanReviewState: "CONFIRMED",
  },
  {
    sourceId: RNE_OFFICIAL_SOURCE_IDS.SENCICO_INDEX,
    sourceTitle: "Índice y normas del Reglamento Nacional de Edificaciones",
    sourceType: "REGULATION",
    issuingAuthority: "SENCICO / Ministerio de Vivienda, Construcción y Saneamiento",
    jurisdiction: "PERU",
    publicationDate: "2020-07-29",
    version: "OFFICIAL_INDEX_WITH_UPDATES",
    sourceLocator: "https://www.gob.pe/institucion/sencico/informes-publicaciones/887225-normas-del-reglamento-nacional-de-edificaciones-rne",
    provenance: ["OFFICIAL_GOB_PE", "SENCICO_INDEX", "NORMATIVE_FAMILY_INDEX"],
    verificationState: "VERIFIED",
    humanReviewState: "CONFIRMED",
  },
];

export type RneEvidenceResult = "PASS" | "FAIL" | "NOT_ASSESSED";

export type RneProjectEvidence = {
  requirementId: string;
  result: RneEvidenceResult;
  evidenceRefs: string[];
  modelRefs: string[];
  notes?: string[];
};

export type RneHumanComplianceReview = {
  reviewerId: string;
  reviewerRole: "ARCHITECT" | "ENGINEER" | "SPECIALIST" | "AUTHORITY";
  confirmationId: string;
  reviewedAt: string;
  confirmed: boolean;
  reviewState: Extract<RegulatoryHumanReviewState, "CONFIRMED" | "REJECTED">;
};

export type RneComplianceVerification = {
  status: "VERIFIED" | "NOT_ASSESSED";
  jurisdiction: "PERU";
  sourceIds: string[];
  requirementIds: string[];
  evidenceRefs: string[];
  modelRefs: string[];
  blockers: string[];
  humanReview: RneHumanComplianceReview | null;
  noAutomaticApproval: true;
  noAutomaticDecision: true;
  professionalVerificationRequired: true;
  provenance: string[];
};

export type RneVerificationInput = {
  context: RegulatoryApplicabilityContext;
  sources: RegulatorySourceReference[];
  requirements: RegulatoryRequirementReference[];
  evidence: RneProjectEvidence[];
  humanReview: RneHumanComplianceReview | null;
  conflicts?: string[];
};

function nonEmpty(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Verifies a closed RNE evidence package. It never invents a requirement,
 * treats a book/reference dimension as law, or substitutes for professional
 * sign-off. VERIFIED means the supplied package met every explicit gate.
 */
export function verifyRnePeruCompliance(input: RneVerificationInput): RneComplianceVerification {
  const blockers: string[] = [];
  const context = input.context;
  if (context.jurisdiction !== "PERU") blockers.push("JURISDICTION_MUST_BE_PERU");
  for (const key of ["spatialScope", "projectUseType", "projectStage"] as const) {
    if (!nonEmpty(context[key])) blockers.push(`MISSING_CONTEXT:${key}`);
  }
  if (!input.sources.length) blockers.push("NO_RNE_SOURCES");
  if (!input.requirements.length) blockers.push("NO_EXPLICIT_RNE_REQUIREMENTS");
  if (input.conflicts?.length) blockers.push("UNRESOLVED_REGULATORY_CONFLICTS");
  for (const source of input.sources) {
    if (source.jurisdiction !== "PERU" || source.verificationState !== "VERIFIED" || source.humanReviewState !== "CONFIRMED") blockers.push(`SOURCE_NOT_VERIFIED:${source.sourceId}`);
  }
  const sourceIds = new Set(input.sources.map((source) => source.sourceId));
  for (const requirement of input.requirements) {
    if (!sourceIds.has(requirement.sourceId)) blockers.push(`REQUIREMENT_SOURCE_NOT_INCLUDED:${requirement.requirementId}`);
    if (requirement.applicability !== "HUMAN_CONFIRMED_APPLICABLE") blockers.push(`REQUIREMENT_NOT_CONFIRMED_APPLICABLE:${requirement.requirementId}`);
    if (requirement.epistemicState !== "INTERPRETED") blockers.push(`REQUIREMENT_NOT_INTERPRETED:${requirement.requirementId}`);
    if (requirement.humanReviewState !== "CONFIRMED") blockers.push(`REQUIREMENT_NOT_HUMAN_CONFIRMED:${requirement.requirementId}`);
  }
  const requirementIds = new Set(input.requirements.map((requirement) => requirement.requirementId));
  for (const evidence of input.evidence) {
    if (!requirementIds.has(evidence.requirementId)) blockers.push(`EVIDENCE_REQUIREMENT_NOT_INCLUDED:${evidence.requirementId}`);
    if (evidence.result !== "PASS") blockers.push(`EVIDENCE_NOT_PASS:${evidence.requirementId}`);
    if (!evidence.evidenceRefs.length) blockers.push(`EVIDENCE_REFERENCE_MISSING:${evidence.requirementId}`);
    if (!evidence.modelRefs.length) blockers.push(`MODEL_REFERENCE_MISSING:${evidence.requirementId}`);
  }
  if (input.evidence.length !== input.requirements.length) blockers.push("EVIDENCE_NOT_COMPLETE_FOR_REQUIREMENTS");
  if (!input.humanReview?.confirmed || input.humanReview.reviewState !== "CONFIRMED") blockers.push("HUMAN_COMPLIANCE_REVIEW_REQUIRED");
  const allEvidence = input.evidence.flatMap((item) => [...item.evidenceRefs, ...item.modelRefs]);
  const uniqueBlockers = Array.from(new Set(blockers));
  return {
    status: uniqueBlockers.length === 0 ? "VERIFIED" : "NOT_ASSESSED",
    jurisdiction: "PERU",
    sourceIds: input.sources.map((source) => source.sourceId),
    requirementIds: input.requirements.map((requirement) => requirement.requirementId),
    evidenceRefs: allEvidence.filter((ref, index) => allEvidence.indexOf(ref) === index),
    modelRefs: input.evidence.flatMap((item) => item.modelRefs),
    blockers: uniqueBlockers,
    humanReview: input.humanReview,
    noAutomaticApproval: true,
    noAutomaticDecision: true,
    professionalVerificationRequired: true,
    provenance: ["RNE_OFFICIAL_SOURCE_REGISTRY", "EXPLICIT_REQUIREMENT_EVIDENCE", "CANONICAL_MODEL_READBACK", "HUMAN_COMPLIANCE_REVIEW"],
  };
}

export function validateRneOfficialSourceRegistry(): boolean {
  return RNE_PERU_SOURCES.length >= 4 && RNE_PERU_SOURCES.every((source) => source.jurisdiction === "PERU" && source.verificationState === "VERIFIED" && source.provenance.length > 0);
}

export function buildRnePeruContext(overrides: Partial<RegulatoryApplicabilityContext> = {}): RegulatoryApplicabilityContext {
  return { jurisdiction: "PERU", spatialScope: "EDIFICACION", projectUseType: "RESIDENTIAL", buildingUseCategory: "VIVIENDA_UNIFAMILIAR", projectStage: "ANTEPROYECTO", temporalDate: "2026-09-19", ...overrides };
}

export function buildRneRequirement(sourceId: string, requirementId: string, subject: string): RegulatoryRequirementReference {
  return { requirementId, sourceId, subject, applicability: "HUMAN_CONFIRMED_APPLICABLE", epistemicState: "INTERPRETED", provenance: ["RNE_OFFICIAL_SOURCE_REGISTRY", "HUMAN_INTERPRETATION_REQUIRED"], humanReviewState: "CONFIRMED" };
}
