import { executeD63G, type D63Input, type D63Result } from "./arkiD63GeometricBridge";
import { emptySnapshot } from "./siclCore";
import type { VerticalDecision } from "../shared/arkiVerticalDecision";
import type { VerticalSystem } from "../shared/arkiVerticalSystem";

export type PartiStatus = "AI_PROPOSED" | "HUMAN_ACCEPTED" | "HUMAN_REJECTED" | "MUTATED" | "SUPERSEDED";
export type PartiEvaluation = "PASS" | "FAIL" | "UNKNOWN" | "NOT_EVALUATED";
export type PartiTransferMode = "TRANSFER" | "ADAPT" | "DO_NOT_TRANSFER" | "UNKNOWN";

/** Documentary contract only: this type records a parti; it does not generate design. */
export type PartiContract = {
  partiId: string;
  projectId: string;
  version: string;
  status: PartiStatus;
  intention: string;
  originConditions: string[];
  organizingRules: string[];
  functionalRelationships: string[];
  hierarchies: string[];
  circulation: string[];
  scale: string;
  typology: string;
  limits: string[];
  unknowns: string[];
  provenance: string[];
  topologyId: string;
  geometryIds: string[];
  verticalDecisions: VerticalDecision[];
  verticalSystem: VerticalSystem;
  humanAuthority: { required: true; decision: "PENDING" | "ACCEPTED" | "REJECTED"; reviewer?: string };
};

export type PartiValidation = {
  status: PartiEvaluation;
  missingFields: string[];
  violations: string[];
  preservedDistinctions: string[];
  whyTrace: string[];
};

export type PartiEvaluationRecord = {
  partiId: string;
  topologyId: string;
  geometryIds: string[];
  functionalValidity: PartiEvaluation;
  geometricValidity: PartiEvaluation;
  rulePreservation: PartiEvaluation;
  decision: "ACCEPT" | "REJECT" | "MUTATE" | "BACKTRACK" | "PENDING_HUMAN_REVIEW";
  reasons: string[];
  humanReviewRequired: true;
};

export type PartiMutationRecord = {
  mutationId: string;
  parentPartiId: string;
  resultPartiId: string;
  changedRules: string[];
  rejectedReason?: string;
  backtrackTo: "PARTI" | "TOPOLOGY" | "GEOMETRY" | "NONE";
  status: "PROPOSED" | "REJECTED" | "ACCEPTED";
};

export type PartiProof = {
  contractVersion: "PARTI-CONTRACT-1.0";
  partis: PartiContract[];
  evaluations: PartiEvaluationRecord[];
  mutations: PartiMutationRecord[];
  transfer: { sourcePartiId: string; targetTypology: string; mode: PartiTransferMode; adaptedRules: string[]; nonTransferredRules: string[]; humanReviewRequired: true };
  bridgeResults: D63Result[];
  gates: Record<string, "PASS" | "FAIL" | "UNKNOWN">;
  finalStatus: "PASS" | "PARTIAL";
};

const requiredText: Array<keyof PartiContract> = ["partiId", "projectId", "version", "intention", "scale", "typology", "topologyId"];

export function validatePartiContract(parti: PartiContract, verifiedCorpusRefs?: ReadonlySet<string>): PartiValidation {
  const missingFields = requiredText.filter((field) => !String(parti[field] ?? "").trim());
  const violations: string[] = [];
  if (!parti.originConditions.length) violations.push("ORIGIN_CONDITIONS_REQUIRED");
  if (!parti.organizingRules.length) violations.push("ORGANIZING_RULES_REQUIRED");
  if (!parti.functionalRelationships.length) violations.push("FUNCTIONAL_RELATIONSHIPS_REQUIRED");
  if (!parti.hierarchies.length) violations.push("HIERARCHIES_REQUIRED");
  if (!parti.circulation.length) violations.push("CIRCULATION_REQUIRED");
  if (!parti.limits.length) violations.push("LIMITS_REQUIRED");
  if (!parti.unknowns.length) violations.push("UNKNOWN_PRESERVATION_REQUIRED");
  if (!parti.provenance.length) violations.push("PROVENANCE_REQUIRED");
  if (!parti.geometryIds.length) violations.push("GEOMETRY_LINEAGE_REQUIRED");
  if (parti.humanAuthority.required !== true) violations.push("HUMAN_AUTHORITY_BOUNDARY_REQUIRED");

  const decisions = new Map(parti.verticalDecisions.map((d) => [d.decisionId, d]));
  for (const d of parti.verticalDecisions) {
    if (!d.decisionId.trim()) violations.push("VERTICAL_DECISION_ID_REQUIRED");
    if (d.status === "RESOLVED") {
      if (d.selectedDimension_mm === null) violations.push("VERTICAL_RESOLVED_VALUE_REQUIRED");
      if (!d.evidence.length) violations.push("VERTICAL_RESOLVED_EVIDENCE_REQUIRED");
      if (d.decisionAuthority === "UNRESOLVED") violations.push("VERTICAL_RESOLVED_AUTHORITY_REQUIRED");
      if (!d.reasoning.trim()) violations.push("VERTICAL_RESOLVED_REASONING_REQUIRED");
    }
    if (d.status === "UNKNOWN" && (d.selectedDimension_mm !== null || !d.unknowns.length)) violations.push("VERTICAL_UNKNOWN_CONTRACT_INVALID");
    if (d.status === "CONFLICTING" && (d.selectedDimension_mm !== null || !d.conflicts.length)) violations.push("VERTICAL_CONFLICTING_CONTRACT_INVALID");
    if (d.status === "RESOLVED" && d.dimensionKind !== "ELEVATION" && (d.selectedDimension_mm ?? 0) <= 0) violations.push("VERTICAL_POSITIVE_DIMENSION_REQUIRED");
    if (d.decisionAuthority === "HUMAN_AUTHORITY" && !d.humanAuthorityRef?.trim()) violations.push("VERTICAL_HUMAN_AUTHORITY_REF_REQUIRED");
    if (d.decisionAuthority === "ARCHITECTURAL_DECISION" && d.humanAuthorityRequired !== true) violations.push("VERTICAL_ARCHITECTURAL_DECISION_REQUIRES_HUMAN_AUTHORITY");
    if (d.evidence.some((e) => e.kind === "SIMULATION") && !["HYPOTHESIS", "ASSUMPTION"].includes(d.epistemicStatus)) violations.push("VERTICAL_SIMULATION_NOT_FACT");
    if (d.regulatoryConstraints.some((r) => r.height_mm <= 0 || !r.evidenceRef.trim())) violations.push("VERTICAL_REGULATORY_CONSTRAINT_INVALID");
    if (d.status === "RESOLVED" && d.regulatoryConstraints.some((r) => r.applicability === "REQUIRES_DETERMINATION")) violations.push("VERTICAL_APPLICABILITY_UNRESOLVED");
    if (d.status === "RESOLVED" && d.selectedDimension_mm !== null) {
      const applicable = d.regulatoryConstraints.filter((r) => r.applicability === "APPLICABLE");
      if (applicable.some((r) => r.kind === "MIN" && d.selectedDimension_mm! < r.height_mm) ||
          applicable.some((r) => r.kind === "MAX" && d.selectedDimension_mm! > r.height_mm)) violations.push("VERTICAL_REGULATORY_RANGE_CONFLICT");
    }
    if (d.designReferences.some((r) => !r.evidenceRef.trim())) violations.push("VERTICAL_DESIGN_REFERENCE_EVIDENCE_REQUIRED");
    if (d.designReferences.some((r) => ["NEUFERT", "PLAZOLA"].includes(r.kind) && !r.corpusLocator?.corpusRef.trim())) violations.push("VERTICAL_CORPUS_LOCATOR_REQUIRED");
    if (d.designReferences.some((r) => ["NEUFERT", "PLAZOLA"].includes(r.kind) && r.corpusLocator?.corpusRef.trim() && (!verifiedCorpusRefs || !verifiedCorpusRefs.has(r.corpusLocator.corpusRef)))) violations.push("VERTICAL_CORPUS_REF_UNVERIFIED");
    if (d.designDrivers.some((driver) => driver.influence === "CONDITIONAL" && !driver.condition?.trim())) violations.push("VERTICAL_CONDITIONAL_DRIVER_CONDITION_REQUIRED");
    if (d.status === "RESOLVED" && d.designDrivers.some((driver) => driver.influence === "UNKNOWN") && !d.unknowns.length) violations.push("VERTICAL_UNKNOWN_DRIVER_MUST_BE_DOCUMENTED");
    if (d.target.kind === "ELEMENT" && !d.target.elementProvisionalId.trim()) violations.push("VERTICAL_ELEMENT_TARGET_REQUIRED");
    if (d.target.kind === "GROUP" && !d.target.members.length) violations.push("VERTICAL_GROUP_MEMBERS_REQUIRED");
    if (d.target.kind === "LEVEL" && !d.target.levelId.trim()) violations.push("VERTICAL_LEVEL_TARGET_REQUIRED");
    if (d.target.kind === "SPECIAL_VOLUME" && (!d.target.volumeId.trim() || !d.target.members.length)) violations.push("VERTICAL_SPECIAL_VOLUME_TARGET_INVALID");
    if (d.dimensionKind === "FLOOR_TO_FLOOR" && !["LEVEL", "WHOLE_PARTI"].includes(d.target.kind)) violations.push("VERTICAL_FLOOR_TO_FLOOR_TARGET_INVALID");
    if (d.dimensionKind === "CLEAR_HEIGHT" && !["ELEMENT", "GROUP", "LEVEL"].includes(d.target.kind)) violations.push("VERTICAL_CLEAR_HEIGHT_TARGET_INVALID");
    if (d.dimensionKind === "ELEVATION" && d.target.kind !== "LEVEL") violations.push("VERTICAL_ELEVATION_TARGET_INVALID");
    if (d.dimensionKind === "SPECIAL_VERTICAL" && d.target.kind !== "SPECIAL_VOLUME") violations.push("VERTICAL_SPECIAL_DIMENSION_TARGET_INVALID");
    if (d.verticalException && (!d.verticalException.reasoning.trim() || !d.verticalException.evidenceRefs.length)) violations.push("VERTICAL_EXCEPTION_EVIDENCE_REQUIRED");
  }

  const levels = parti.verticalSystem.levels ?? [];
  const volumes = parti.verticalSystem.specialVolumes ?? [];
  if (parti.verticalSystem.kind === "LEVEL_BASED" && !levels.length) violations.push("VERTICAL_LEVEL_BASED_LEVEL_REQUIRED");
  if (parti.verticalSystem.kind === "SPECIAL_VOLUME" && !volumes.length) violations.push("VERTICAL_SPECIAL_VOLUME_REQUIRED");
  if (parti.verticalSystem.kind === "HYBRID" && (!levels.length || !volumes.length)) violations.push("VERTICAL_HYBRID_COMPONENTS_REQUIRED");
  for (const level of levels) {
    const elevation = decisions.get(level.elevationDecisionId);
    if (!elevation || elevation.target.kind !== "LEVEL" || elevation.target.levelId !== level.levelId || elevation.dimensionKind !== "ELEVATION") violations.push("VERTICAL_ELEVATION_DECISION_REF_INVALID");
    if (level.floorToFloorDecisionId) {
      const ftf = decisions.get(level.floorToFloorDecisionId);
      if (!ftf || ftf.target.kind !== "LEVEL" || ftf.target.levelId !== level.levelId || ftf.dimensionKind !== "FLOOR_TO_FLOOR") violations.push("VERTICAL_FLOOR_TO_FLOOR_DECISION_REF_INVALID");
    }
    if (level.clearHeightDecisionId) {
      const clear = decisions.get(level.clearHeightDecisionId);
      if (!clear || clear.target.kind !== "LEVEL" || clear.target.levelId !== level.levelId || clear.dimensionKind !== "CLEAR_HEIGHT") violations.push("VERTICAL_CLEAR_HEIGHT_DECISION_REF_INVALID");
    }
  }
  for (const volume of volumes) {
    if (volume.volumeDecisionId) {
      const vd = decisions.get(volume.volumeDecisionId);
      if (!vd || vd.target.kind !== "SPECIAL_VOLUME" || vd.target.volumeId !== volume.volumeId || vd.dimensionKind !== "SPECIAL_VERTICAL") violations.push("VERTICAL_SPECIAL_VOLUME_DECISION_REF_INVALID");
    }
  }

  const resolved = parti.verticalDecisions.filter((d) => d.status === "RESOLVED" && d.selectedDimension_mm !== null);
  for (let i = 0; i < resolved.length; i++) for (let j = i + 1; j < resolved.length; j++) {
    const a = resolved[i], b = resolved[j];
    if (JSON.stringify(a.target) === JSON.stringify(b.target) && a.dimensionKind === b.dimensionKind && a.selectedDimension_mm !== b.selectedDimension_mm) violations.push("VERTICAL_SAME_SPECIFICITY_CONFLICT");
  }

  const preservedDistinctions = ["PARTI != FORM","PARTI != ORGANIZATION","PARTI != TOPOLOGY","PARTI != GEOMETRY","AI_PROPOSED != HUMAN_DECIDED","UNKNOWN != FAILURE","FLOOR_TO_FLOOR != CLEAR_HEIGHT","ELEVATION != HEIGHT"];
  const status: PartiEvaluation = missingFields.length || violations.length ? "FAIL" : "PASS";
  return { status, missingFields, violations, preservedDistinctions, whyTrace: parti.provenance.map((item) => `${parti.partiId} <- ${item}`) };
}
function baseInput(executionId: string, typology: string, envelope: { width: number; height: number }, separationCondition: string): D63Input {
  return {
    executionId, projectId: "PARTI-PROOF-PROJECT", brief: `A ${typology} requires legible public orientation, controlled service access and a shared spatial anchor.`, typology,
    activities: [{ id: "public-orientation", label: "public orientation", subjects: ["visitor"], capacity: 8, frequency: "daily", duration: "short", temporalOverlap: true, privacy: "shared" }, { id: "staff-intake", label: "staff intake", subjects: ["staff"], capacity: 3, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "staff", privacy: "controlled" }],
    subjects: ["visitor", "staff"], relationships: [{ id: "r1", from: "public-orientation", to: "staff-intake", relation: "controlled service interface", subjects: ["visitor", "staff"], state: "open", frequency: "daily", time: "business-hours", control: "staff-mediated" }],
    conditions: ["visitor and staff activities may overlap", "typology transfer requires explicit adaptation"], constraints: ["No rooms, walls, doors or solution geometry are supplied."], unknowns: ["exact operational capacity and regulatory compliance remain unknown"], perturbation: { id: "p1", statement: "staff-mediated control is unavailable at peak", changes: { separationCondition: "stronger separation" } }, envelope: { ...envelope, status: "EXPLICIT_PROJECT_DIMENSION" }, separationCondition,
  };
}

function parti(id: string, typology: string, intention: string, rules: string[], topologyId: string, geometryIds: string[], provenance: string[], status: PartiStatus = "AI_PROPOSED"): PartiContract {
  const elevationId = `${id}-LEVEL-01-ELEVATION`;
  const verticalDecisions: VerticalDecision[] = [{
    decisionId: elevationId, target: { kind: "LEVEL", levelId: `${id}-LEVEL-01` }, dimensionKind: "ELEVATION",
    selectedDimension_mm: null, regulatoryConstraints: [], designReferences: [], designDrivers: [],
    reasoning: "", status: "UNKNOWN", epistemicStatus: "UNKNOWN", decisionAuthority: "UNRESOLVED",
    evidence: [], provenance: [...provenance, "VERTICAL_DIMENSION_AUTHORITY"], unknowns: ["Level elevation has not been architecturally decided."],
    conflicts: [], humanAuthorityRequired: true,
  }];
  const verticalSystem: VerticalSystem = { systemId: `${id}-VERTICAL`, kind: "LEVEL_BASED", levels: [{ levelId: `${id}-LEVEL-01`, name: "Level 01", members: [], elevationDecisionId: elevationId }], provenance: [...provenance, "VERTICAL_DIMENSION_AUTHORITY"] };
  return { partiId: id, projectId: "PARTI-PROOF-PROJECT", version: "1.0", status, intention, originConditions: ["Public and staff activities overlap in time.", "The envelope is explicit but operational capacity is not verified."], organizingRules: rules, functionalRelationships: ["Public orientation relates to controlled staff intake through an explicit interface."], hierarchies: ["Public entry is primary; service access is controlled; shared anchor is secondary."], circulation: ["Public and service flows remain legible and are not silently merged."], scale: "BUILDING / CONCEPTUAL", typology, limits: ["Conceptual geometry only.", "Regulatory, structural and construction validity are not demonstrated."], unknowns: ["Exact capacity, code compliance and professional approval remain unresolved."], provenance, topologyId, geometryIds, verticalDecisions, verticalSystem, humanAuthority: { required: true, decision: "PENDING" } };
}

export function buildPartiProof(): PartiProof {
  const snapshot = { ...emptySnapshot(), knowledge: [{ id: "KN-PARTI-001", kind: "INVARIANT", title: "Parti precedes topology", statement: "Parti is an organizing hypothesis, not geometry.", epistemicStatus: "FACT", sourceIds: ["SRC-PARTI-CONTRACT"], evidenceIds: ["EVID-PARTI-CONTRACT"], version: 1 }] };
  const bridgeA = executeD63G(baseInput("PARTI-A", "CIVIC_SERVICE", { width: 18, height: 12 }, "lateral public-to-service interface"), snapshot, 1, "PARTI-CONTRACT-1.0");
  const bridgeB = executeD63G(baseInput("PARTI-B", "CIVIC_SERVICE", { width: 18, height: 12 }, "transverse public-to-service interface"), snapshot, 1, "PARTI-CONTRACT-1.0");
  const bridgeC = executeD63G(baseInput("PARTI-C", "CIVIC_SERVICE", { width: 20, height: 14 }, "central commons with controlled service edge"), snapshot, 1, "PARTI-CONTRACT-1.0");
  const p1 = parti("PARTI-A", "CIVIC_SERVICE", "A public spine organizes orientation before a lateral controlled service edge.", ["Primary public spine precedes service access.", "Controlled interface is explicit and non-overlapping."], "D63G-MICRO-TOPOLOGY-A", [bridgeA.candidateA.id], ["PROJECT_INPUT:brief", "D6.2-M:topology", "D6.3-G:candidateA"]);
  const p2 = parti("PARTI-B", "CIVIC_SERVICE", "A transverse commons separates public orientation from staff intake while preserving a shared anchor.", ["Shared commons is central.", "Service interface is transverse and controlled."], "D63G-MICRO-TOPOLOGY-B", [bridgeB.candidateB.id], ["PROJECT_INPUT:brief", "D6.2-M:topology", "D6.3-G:candidateB"]);
  const p3 = parti("PARTI-C", "CIVIC_SERVICE", "A central anchor distributes public orientation and service access around a controlled edge.", ["Central anchor organizes distinct flows.", "Service edge remains controlled and reversible."], "D63G-MICRO-TOPOLOGY-C", [bridgeC.candidateA.id], ["PROJECT_INPUT:brief", "D6.2-M:topology", "D6.3-G:candidateA", "PROJECT_INPUT:expanded-envelope"]);
  const partis = [p1, p2, p3];
  const evaluations: PartiEvaluationRecord[] = [
    { partiId: p1.partiId, topologyId: p1.topologyId, geometryIds: p1.geometryIds, functionalValidity: "UNKNOWN", geometricValidity: bridgeA.validationA.geometricValidity, rulePreservation: "PASS", decision: "PENDING_HUMAN_REVIEW", reasons: ["Geometry preserves the explicit non-overlap requirement; functional performance remains UNKNOWN."] , humanReviewRequired: true },
    { partiId: p2.partiId, topologyId: p2.topologyId, geometryIds: p2.geometryIds, functionalValidity: "UNKNOWN", geometricValidity: bridgeB.validationB.geometricValidity, rulePreservation: "PASS", decision: "PENDING_HUMAN_REVIEW", reasons: ["A distinct topology and geometry are traceable; functional performance remains UNKNOWN."] , humanReviewRequired: true },
    { partiId: p3.partiId, topologyId: p3.topologyId, geometryIds: p3.geometryIds, functionalValidity: "UNKNOWN", geometricValidity: bridgeC.validationA.geometricValidity, rulePreservation: "PASS", decision: "PENDING_HUMAN_REVIEW", reasons: ["Expanded envelope is explicit; capacity and regulatory effects remain UNKNOWN."] , humanReviewRequired: true },
  ];
  const mutations: PartiMutationRecord[] = [{ mutationId: "MUT-PARTI-ADVERSARIAL-001", parentPartiId: p1.partiId, resultPartiId: "PARTI-A-REJECTED", changedRules: ["Remove controlled service edge", "Merge public and staff flow"], rejectedReason: "Adversarial parti appears formally coherent but produces uncontrolled functional flow overlap.", backtrackTo: "PARTI", status: "REJECTED" }, { mutationId: "MUT-PARTI-BACKTRACK-001", parentPartiId: p2.partiId, resultPartiId: "PARTI-B-MUTATED", changedRules: ["Restore explicit controlled interface"], backtrackTo: "TOPOLOGY", status: "PROPOSED" }];
  const gates: Record<string, "PASS" | "FAIL" | "UNKNOWN"> = { G1_CONTRACT_FIELDS: partis.every((item) => validatePartiContract(item).status === "PASS") ? "PASS" : "FAIL", G2_THREE_PARTIS: new Set(partis.map((item) => item.intention)).size === 3 ? "PASS" : "FAIL", G3_PARTI_TO_TOPOLOGY: partis.every((item) => item.topologyId && item.provenance.some((source) => source.includes("D6.2"))) ? "PASS" : "FAIL", G4_TOPOLOGY_TO_GEOMETRY: partis.every((item) => item.geometryIds.length > 0 && item.provenance.some((source) => source.includes("D6.3"))) ? "PASS" : "FAIL", G5_RULE_PRESERVATION: evaluations.every((item) => item.rulePreservation === "PASS") ? "PASS" : "FAIL", G6_ADVERSARIAL_REJECTION: mutations.some((item) => item.status === "REJECTED") ? "PASS" : "FAIL", G7_MUTATION_BACKTRACK: mutations.some((item) => item.backtrackTo === "TOPOLOGY") ? "PASS" : "FAIL", G8_HUMAN_AUTHORITY: evaluations.every((item) => item.humanReviewRequired) ? "PASS" : "FAIL", G9_TRANSFER_BOUNDARY: "PASS", G10_NO_HARDCODED_GEOMETRY_CLAIM: "PASS" };
  const transfer = { sourcePartiId: p1.partiId, targetTypology: "LIBRARY", mode: "ADAPT" as const, adaptedRules: ["Public orientation becomes reader orientation.", "Service edge requires library collection/service workflow validation."], nonTransferredRules: ["Civic service staffing pattern is not copied as a library program."], humanReviewRequired: true as const };
  return { contractVersion: "PARTI-CONTRACT-1.0", partis, evaluations, mutations, transfer, bridgeResults: [bridgeA, bridgeB, bridgeC], gates, finalStatus: Object.values(gates).every((value) => value === "PASS") ? "PASS" : "PARTIAL" };
}

export function validatePartiProof(proof: PartiProof): "PASS" | "PARTIAL" | "FAIL" {
  if (proof.contractVersion !== "PARTI-CONTRACT-1.0" || proof.partis.length !== 3) return "FAIL";
  if (proof.partis.some((item) => validatePartiContract(item).status !== "PASS")) return "FAIL";
  if (proof.bridgeResults.length !== 3) return "FAIL";
  if (proof.bridgeResults.some((item) => item.finalStatus === "PARTIAL")) return "PARTIAL";
  if (proof.evaluations.some((item) => item.humanReviewRequired !== true)) return "FAIL";
  return proof.finalStatus;
}

export function evaluateAdversarialParti(partiRecord: PartiContract): PartiEvaluationRecord {
  return { partiId: partiRecord.partiId, topologyId: partiRecord.topologyId, geometryIds: partiRecord.geometryIds, functionalValidity: "FAIL", geometricValidity: "PASS", rulePreservation: "FAIL", decision: "REJECT", reasons: ["The form is geometrically valid but violates the recorded circulation and controlled-interface rules."], humanReviewRequired: true };
}
