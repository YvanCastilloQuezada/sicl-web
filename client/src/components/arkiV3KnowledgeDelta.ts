import type { EvidenceRef, Flow, OperationalState, Relationship, SystemRequirement, FunctionalNecessity, FunctionalRole } from "./arkiCanonicalFunctionalOperationalization";

export const ARKI_V3_KNOWLEDGE_BASE = {
  version: "3.0",
  workbook: "ARKI_ARQUI_Canonical_Architectural_Research_Knowledge_Base_v3.0.xlsx",
  layers: ["H1_CANONICAL_ARCHITECTURE", "H2_ARCHITECTURAL_KNOWLEDGE", "H3_ARCHITECTURAL_REASONING", "H4_IMPLEMENTATION_MAPPING", "H5_RESEARCH_FRONTIER"] as const,
  sheetCount: 22,
  invariantCount: 181,
  legacyKnowledgeUnitCount: 108,
  status: "RESEARCHED_PARTIAL_IMPLEMENTATION_DELTA" as const,
  implementationMode: "EXTEND_EXISTING_ABSTRACTIONS" as const,
  humanAuthority: true as const,
  noParallelEngine: true as const,
  provenance: ["v3.0 workbook provided by Product Owner", "17_Reuse_Delta", "19_Guardrails"],
};

export type V3ResearchStatus = "RESEARCHED" | "PARTIAL" | "NOT_RESEARCHED" | "CONFLICTED" | "UNKNOWN";
export type V3Teachability = "TEACHABLE_TO_ARKI" | "CONDITIONAL" | "NOT_YET_TEACHABLE";
export type V3ImplementationStatus = "RESEARCH_ONLY" | "MAPPED_TO_EXISTING" | "PARTIAL" | "IMPLEMENTED" | "TESTED";
export type V3EvidenceStatus = "UNVERIFIED" | "SOURCE_SUPPORTED" | "SOURCE_VERIFIED" | "EVIDENCE_VERIFIED" | "PROJECT_VERIFIED" | "PROFESSIONALLY_CONFIRMED";
export type V3Availability = "AVAILABLE" | "CONDITIONAL" | "UNAVAILABLE" | "UNKNOWN";
export type V3Performance = "SUPPORTED" | "PARTIAL" | "UNSUPPORTED" | "UNKNOWN";
export type V3DeficitKind = "ABSENCE" | "CAPACITY" | "TEMPORAL" | "ACCESS" | "INTERFACE" | "PERFORMANCE" | "CONTROL" | "EVIDENCE";
export type V3RealizationMode = "INTERNAL" | "SHARED" | "EXTERNAL";
export type V3PersistenceMode = "PERMANENT" | "TEMPORARY";
export type V3FlowSeparation = "SHARED" | "CONTROLLED" | "TEMPORAL" | "SPATIAL" | "PROTECTED" | "PHYSICALLY_SEPARATED" | "UNKNOWN";
export type V3RelationshipDimension = "FUNCTIONAL" | "OPERATIONAL" | "PROXIMITY" | "ACCESS" | "VISUAL" | "ACOUSTIC" | "PRIVACY" | "SECURITY" | "HYGIENE" | "ENVIRONMENT" | "LOGISTICS" | "SUPERVISION" | "SOCIAL" | "TECHNICAL" | "TEMPORAL" | "TRAVEL" | "RESPONSE";
export type V3OperationalState = "NORMAL" | "PEAK" | "MAINTENANCE" | "CHANGEOVER" | "TESTING" | "FAULT" | "EMERGENCY" | "RECOVERY" | "UNKNOWN";

export type V3KnowledgeUnit = {
  id: string; domain: string; discovery: string; why: string; applicability: string; sourceBasis: string[];
  researchStatus: V3ResearchStatus; teachability: V3Teachability; normativeStatus: "REFERENCE" | "REQUIREMENT_CANDIDATE" | "NOT_NORMATIVE" | "UNKNOWN";
  implementationStatus: V3ImplementationStatus; evidenceStatus: V3EvidenceStatus; dependencies: string[]; limits: string[]; lastReviewed: string;
  humanReviewRequired: true;
};

export type V3CapabilityAssessment = {
  capabilityId: string; requirementId: string; necessity: FunctionalNecessity; realizationModes: V3RealizationMode[]; persistenceModes: V3PersistenceMode[];
  providerSystemIds: string[]; interfaceState: "VALID" | "PARTIAL" | "INVALID" | "UNKNOWN"; capacity?: { value?: number; unit: string; timeBasis?: string; demandBasis?: string; configuration?: string; state?: V3OperationalState };
  availability: V3Availability; performance: V3Performance; evidence: EvidenceRef[]; satisfied: "SATISFIED" | "PARTIAL" | "UNSATISFIED" | "UNKNOWN"; deficit?: V3DeficitKind;
  humanReviewRequired: true; noAutomaticDecision: true;
};

export type V3MultidimensionalRelationship = Omit<Relationship, "kind"> & { kind: "MULTIDIMENSIONAL"; dimensions: V3RelationshipDimension[]; temporalStates?: V3OperationalState[]; separation?: V3FlowSeparation };
export type V3FlowSegment = Omit<Flow, "separation" | "operationalStates"> & { separation: V3FlowSeparation; operationalStates: V3OperationalState[]; processId?: string; segmentId: string; compatibility: "COMPATIBLE" | "CONDITIONAL" | "INCOMPATIBLE" | "UNKNOWN"; humanReviewRequired: true };

export const ARKI_V3_KNOWLEDGE_UNITS: V3KnowledgeUnit[] = [
  { id: "V3-GRAMMAR-CAPABILITY-SATISFACTION", domain: "ARCHITECTURAL_REASONING", discovery: "Required capability must be traced to requirements, provider systems, interfaces, capacity, availability, performance and evidence.", why: "Prevents room-count validation from being mistaken for functional completeness.", applicability: "Typology and project contexts with explicit operating models.", sourceBasis: ["v3.0 sheet 07_Capability_Deficits", "v3.0 G-02"], researchStatus: "RESEARCHED", teachability: "TEACHABLE_TO_ARKI", normativeStatus: "REFERENCE", implementationStatus: "IMPLEMENTED", evidenceStatus: "SOURCE_SUPPORTED", dependencies: ["FUNCTIONAL_PROFILE", "SYSTEM_REQUIREMENT", "EVIDENCE"], limits: ["Does not certify professional performance."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V3-DEFICIT-TAXONOMY", domain: "ARCHITECTURAL_DIAGNOSTICS", discovery: "Functional deficits include absence, capacity, temporal, access, interface, performance, control and evidence deficits.", why: "A fully occupied plan can still fail operationally.", applicability: "Project and typology evaluation when the evidence basis is declared.", sourceBasis: ["v3.0 sheet 07_Capability_Deficits", "v3.0 INV- functional deficit"], researchStatus: "RESEARCHED", teachability: "TEACHABLE_TO_ARKI", normativeStatus: "REFERENCE", implementationStatus: "IMPLEMENTED", evidenceStatus: "SOURCE_SUPPORTED", dependencies: ["CAPABILITY_ASSESSMENT", "EVIDENCE"], limits: ["A deficit classification is not a design decision."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V3-RELATIONSHIP-MULTIDIMENSIONAL", domain: "SPATIAL_REASONING", discovery: "Relationships extend beyond adjacency to access, privacy, acoustic, hygiene, logistics, technical and temporal dimensions.", why: "Adjacency alone cannot represent architectural operation.", applicability: "All typologies; exact dimensions remain project dependent.", sourceBasis: ["v3.0 sheet 02_Canonical_Ontology", "v3.0 section 17"], researchStatus: "RESEARCHED", teachability: "CONDITIONAL", normativeStatus: "REFERENCE", implementationStatus: "IMPLEMENTED", evidenceStatus: "SOURCE_SUPPORTED", dependencies: ["RELATIONSHIP", "FLOW", "CONDITION"], limits: ["No universal weighting of relationship dimensions."], lastReviewed: "2026-09-19", humanReviewRequired: true },
  { id: "V3-TIME-OPERATIONAL-STATES", domain: "PERFORMANCE", discovery: "Spaces and systems may operate differently under normal, peak, maintenance, changeover, fault, emergency and recovery states.", why: "Static geometry cannot represent all operating conditions.", applicability: "Typologies where time and operational state affect capacity or flow.", sourceBasis: ["v3.0 section 15", "v3.0 sheet 10_Capacity_Time"], researchStatus: "RESEARCHED", teachability: "CONDITIONAL", normativeStatus: "REFERENCE", implementationStatus: "IMPLEMENTED", evidenceStatus: "SOURCE_SUPPORTED", dependencies: ["TIME", "CAPACITY", "FLOW"], limits: ["State transitions require project or typology evidence."], lastReviewed: "2026-09-19", humanReviewRequired: true },
];

function assessStatus(input: { providerSystemIds: string[]; interfaceState: V3CapabilityAssessment["interfaceState"]; capacity?: V3CapabilityAssessment["capacity"]; availability: V3Availability; performance: V3Performance; evidence: EvidenceRef[] }): Pick<V3CapabilityAssessment, "satisfied" | "deficit"> {
  if (!input.providerSystemIds.length) return { satisfied: "UNSATISFIED", deficit: "ABSENCE" };
  if (input.interfaceState === "INVALID") return { satisfied: "UNSATISFIED", deficit: "INTERFACE" };
  if (input.interfaceState === "UNKNOWN" || input.availability === "UNKNOWN" || input.performance === "UNKNOWN") return { satisfied: "UNKNOWN", deficit: "EVIDENCE" };
  if (input.interfaceState === "PARTIAL") return { satisfied: "PARTIAL", deficit: "INTERFACE" };
  if (input.availability === "UNAVAILABLE") return { satisfied: "UNSATISFIED", deficit: "TEMPORAL" };
  if (input.performance === "UNSUPPORTED") return { satisfied: "UNSATISFIED", deficit: "PERFORMANCE" };
  if (input.performance === "PARTIAL" || !input.capacity || !input.evidence.length) return { satisfied: "PARTIAL", deficit: input.capacity ? "EVIDENCE" : "CAPACITY" };
  return { satisfied: "SATISFIED" };
}

export function assessV3Capability(input: Omit<V3CapabilityAssessment, "satisfied" | "deficit" | "humanReviewRequired" | "noAutomaticDecision">): V3CapabilityAssessment {
  return { ...input, ...assessStatus(input), humanReviewRequired: true, noAutomaticDecision: true };
}

export function buildV3CapabilityAssessmentFromRequirement(input: { requirement: Pick<SystemRequirement, "id" | "role" | "functionalNecessity" | "evidence">; providerSystemIds: string[]; realizationModes?: V3RealizationMode[]; persistenceModes?: V3PersistenceMode[]; interfaceState?: V3CapabilityAssessment["interfaceState"]; capacity?: V3CapabilityAssessment["capacity"]; availability?: V3Availability; performance?: V3Performance }): V3CapabilityAssessment {
  return assessV3Capability({ capabilityId: `CAP-${input.requirement.id}`, requirementId: input.requirement.id, necessity: input.requirement.functionalNecessity, realizationModes: input.realizationModes ?? ["INTERNAL"], persistenceModes: input.persistenceModes ?? ["PERMANENT"], providerSystemIds: input.providerSystemIds, interfaceState: input.interfaceState ?? "UNKNOWN", capacity: input.capacity, availability: input.availability ?? "UNKNOWN", performance: input.performance ?? "UNKNOWN", evidence: input.requirement.evidence });
}

export function deriveV3Relationship(input: Omit<V3MultidimensionalRelationship, "kind">): V3MultidimensionalRelationship { return { ...input, kind: "MULTIDIMENSIONAL" }; }
export function deriveV3FlowSegment(input: Omit<V3FlowSegment, "humanReviewRequired">): V3FlowSegment { return { ...input, humanReviewRequired: true }; }
export function v3OperationalStatesForExistingFlow(flow: Flow): V3OperationalState[] { return flow.operationalStates.map((state: OperationalState) => state === "EVENT" ? "PEAK" : state as V3OperationalState); }
export function validateV3CapabilityAssessment(assessment: V3CapabilityAssessment): boolean { return assessment.humanReviewRequired && assessment.noAutomaticDecision && assessment.evidence.every((item) => item.id.length > 0 && item.source.length > 0) && (assessment.satisfied !== "SATISFIED" || Boolean(assessment.capacity && assessment.providerSystemIds.length && assessment.interfaceState === "VALID")); }
export function validateV3KnowledgeUnit(unit: V3KnowledgeUnit): boolean { return unit.humanReviewRequired && unit.sourceBasis.length > 0 && unit.limits.length > 0 && unit.lastReviewed.length > 0; }
export function summarizeV3Delta() { return { knowledgeUnits: ARKI_V3_KNOWLEDGE_UNITS.length, layers: ARKI_V3_KNOWLEDGE_BASE.layers.length, deficits: ["ABSENCE", "CAPACITY", "TEMPORAL", "ACCESS", "INTERFACE", "PERFORMANCE", "CONTROL", "EVIDENCE"], relationshipDimensions: 17, operationalStates: 9, implementationMode: ARKI_V3_KNOWLEDGE_BASE.implementationMode, humanAuthority: true, parallelEngine: false }; }
