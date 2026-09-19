import type { EvidenceRef } from "./arkiCanonicalFunctionalOperationalization";

export const ARKI_V5_RESEARCH_DELTA = {
  version: "5.0",
  workbook: "ARKI_ARQUI_Canonical_Research_Delta_v5.0.xlsx",
  workbookSha256: "dc393966334570e9bc973ba1d6f96f0b3a915866ad9c2c3765eb7cec5249a8ba",
  researchPasses: ["INDUSTRIAL", "WAREHOUSE_LOGISTICS", "FOOD_COLD_CHAIN", "HOSPITAL_HEALTHCARE", "LABORATORY_BIOSAFETY"],
  invariantCount: 38,
  sourceCount: 7,
  implementationAuthority: "RESEARCH_CHECKPOINT_ONLY" as const,
  hazardPrimitive: "CANDIDATE_NOT_IMPLEMENTED" as const,
  noParallelEngine: true as const,
  humanAuthority: true as const,
};

export type V5ImplementationStatus = "RESEARCH_ONLY" | "PARTIAL" | "DERIVED_VIEW" | "DATA_ONLY" | "NOT_IMPLEMENTED";
export type V5KnowledgeUnit = {
  id: string;
  domain: string;
  claim: string;
  sourceBasis: string[];
  applicability: string;
  implementationStatus: V5ImplementationStatus;
  normativeStatus: "REFERENCE" | "FOREIGN_TECHNICAL_REFERENCE" | "UNKNOWN";
  limits: string[];
  humanReviewRequired: true;
};

export type V5JourneySegment = {
  id: string;
  from: string;
  to: string;
  subjectId: string;
  process: string;
  interfaceIds: string[];
  conditionRequirements: string[];
  controls: string[];
  temporalRole: "TRAVEL" | "DWELL" | "EXPOSURE" | "SERVICE" | "RECOVERY";
  evidence: EvidenceRef[];
};

export type V5JourneyValidity = {
  journeyId: string;
  subjectId: string;
  segments: V5JourneySegment[];
  requiredConditions: string[];
  missingEvidence: string[];
  status: "VALIDATED" | "PARTIAL" | "UNKNOWN";
  derivedView: true;
  humanReviewRequired: true;
};

export type V5MutationReassessment = {
  mutationId: string;
  changedElementIds: string[];
  affectedCapabilityIds: string[];
  affectedScenarioIds: string[];
  reevaluatedClaimIds: string[];
  preservedClaimIds: string[];
  unknownClaimIds: string[];
  humanReviewRequired: true;
};

export const ARKI_V5_KNOWLEDGE_UNITS: V5KnowledgeUnit[] = [
  { id: "V5-JOURNEY-VALIDITY", domain: "JOURNEY", claim: "A connected route is not sufficient; journey validity includes subjects, interfaces, conditions, controls, time and evidence across segments.", sourceBasis: ["v5.0 08_Journey_Validity", "v5.0 INV-002", "v5.0 INV-036"], applicability: "Resource, service, waste, cold-chain, patient and specimen journeys.", implementationStatus: "DERIVED_VIEW", normativeStatus: "REFERENCE", limits: ["Does not certify operational execution.", "Missing condition or control evidence remains explicit."], humanReviewRequired: true },
  { id: "V5-HAZARD-CANDIDATE", domain: "HAZARD", claim: "HAZARD is a research-supported candidate primitive, distinct from exposure, risk, condition and issue; it is not activated by this delta.", sourceBasis: ["v5.0 02_Ontology", "v5.0 09_Hazard_Control", "v5.0 INV-003"], applicability: "Future hazard-aware reasoning after a repository-level authorization gate.", implementationStatus: "NOT_IMPLEMENTED", normativeStatus: "REFERENCE", limits: ["No canonical Hazard entity is created.", "No biosafety or professional safety certification is inferred."], humanReviewRequired: true },
  { id: "V5-MUTATION-SCOPED-REEVALUATION", domain: "REEVALUATION", claim: "A geometry or process mutation should trigger dependency-scoped reevaluation of affected claims rather than an unbounded or hidden global pass.", sourceBasis: ["v5.0 INV-036", "v5.0 14_Teachability", "v5.0 15_Impl_Delta"], applicability: "Controlled spatial repairs and design mutations.", implementationStatus: "PARTIAL", normativeStatus: "REFERENCE", limits: ["Affected-set derivation must be explainable.", "Human review remains required for acceptance."], humanReviewRequired: true },
  { id: "V5-GENERAL-COVERAGE", domain: "COVERAGE", claim: "Relevant, evaluated, resolved, unresolved and not-evaluated sets form a general verification pattern across typologies.", sourceBasis: ["v5.0 13_Coverage", "v5.0 INV-038"], applicability: "Functional, scenario, hazard, performance and evidence claims.", implementationStatus: "PARTIAL", normativeStatus: "REFERENCE", limits: ["Coverage is scoped to a claim; it is not a global completeness assertion."], humanReviewRequired: true },
  { id: "V5-SUBJECT-SCENARIO-CAPABILITY", domain: "CAPABILITY", claim: "Capability satisfaction is scoped to subject, state, scenario and time; physical count alone is insufficient.", sourceBasis: ["v5.0 07_Capability_Model", "v5.0 INV-012", "v5.0 INV-013"], applicability: "Architectural service and resource capabilities with demand or operating profiles.", implementationStatus: "PARTIAL", normativeStatus: "REFERENCE", limits: ["No clinical, biosafety or legal certification is produced."], humanReviewRequired: true },
];

export function validateV5KnowledgeUnit(unit: V5KnowledgeUnit): boolean {
  return unit.humanReviewRequired && unit.sourceBasis.length > 0 && unit.limits.length > 0 && unit.claim.length > 0;
}

export function deriveV5JourneyValidity(input: Omit<V5JourneyValidity, "derivedView" | "humanReviewRequired">): V5JourneyValidity {
  const unknown = input.missingEvidence.length > 0 || input.segments.some((segment) => segment.evidence.length === 0);
  return { ...input, status: unknown && input.status === "VALIDATED" ? "PARTIAL" : input.status, derivedView: true, humanReviewRequired: true };
}

export function buildV5MutationReassessment(input: Omit<V5MutationReassessment, "humanReviewRequired">): V5MutationReassessment {
  return { ...input, humanReviewRequired: true };
}

export function summarizeV5Delta() {
  return { version: ARKI_V5_RESEARCH_DELTA.version, knowledgeUnits: ARKI_V5_KNOWLEDGE_UNITS.length, invariantCount: ARKI_V5_RESEARCH_DELTA.invariantCount, sourceCount: ARKI_V5_RESEARCH_DELTA.sourceCount, hazardPrimitive: ARKI_V5_RESEARCH_DELTA.hazardPrimitive, noParallelEngine: true, humanAuthority: true };
}
