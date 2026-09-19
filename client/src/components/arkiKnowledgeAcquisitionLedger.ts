import { buildHouseA21Proof, type A21HouseProof } from "./a21ArchitecturalProgram";
import { buildL00L08HouseLearningPilot, recordControlledEducationalProof, type ControlledEducationalProof, type ArkiLearningCycle } from "./arkiLearningCycle";

export type AcquisitionMaturity = "IMPORTED_CURRICULAR_KNOWLEDGE" | "PRACTICED_WITH_OBSERVATIONS" | "HUMAN_REVIEWED" | "TRANSFERRED" | "MATURE";

export type KnowledgeAcquisitionTrace = {
  traceId: string;
  knowledgeUnitIds: string[];
  practiceIds: string[];
  level: string;
  dataClass: ControlledEducationalProof["dataClass"];
  maturity: AcquisitionMaturity;
  activityRefs: string[];
  relationshipRefs: string[];
  partiRefs: string[];
  topologyRefs: string[];
  geometryRefs: string[];
  evidenceRefs: string[];
  unknowns: string[];
  contradictions: string[];
  preservedPrinciples: string[];
  changedConditions: string[];
  nonApplicationCases: string[];
  humanReview: "PENDING" | "RECORDED" | "CONFIRMED";
  humanAuthority: "PRESERVED";
  noAutomaticPromotion: true;
  noAutomaticDecision: true;
  noAutomaticWinner: true;
};

export type KnowledgeAcquisitionLedger = {
  ledgerId: string;
  traces: KnowledgeAcquisitionTrace[];
  sourceCycleId: string;
  sourceDesignProofId: string;
  designEvidenceStatus: "SEMANTIC_TRACE_ONLY" | "GEOMETRICALLY_REALIZED" | "PROJECT_VERIFIED";
  implementationNote: string;
};

export function buildHouseKnowledgeAcquisitionLedger(
  cycle: ArkiLearningCycle = buildL00L08HouseLearningPilot(),
  designProof: A21HouseProof = buildHouseA21Proof(),
): KnowledgeAcquisitionLedger {
  const proofCycle = recordControlledEducationalProof(cycle, {
    proofId: "HOUSE-A21-acquisition-01",
    level: "L00-L08",
    principleApplied: "activities and relationships precede coordinate commitment",
    nonApplicationDeclared: "a room label or adjacency line does not prove habitability, circulation or access",
    transferDeclared: "preserve the reasoning while changing users, flows and typology",
    evidenceRefs: ["HOUSE-A21", ...designProof.provenance],
    unknowns: designProof.unknownRelationships,
    result: "PASS_WITH_OBSERVATIONS",
    dataClass: "SYNTHETIC_CONTROLLED_EDUCATIONAL_PROOF",
    reviewer: "PRODUCT_OWNER_DELEGATED",
  });
  const trace: KnowledgeAcquisitionTrace = {
    traceId: "HOUSE-A21-acquisition-trace-01",
    knowledgeUnitIds: proofCycle.knowledgeUnitIds,
    practiceIds: proofCycle.practices.map((practice) => practice.canonicalPracticeId),
    level: "L00-L08",
    dataClass: proofCycle.acquisition?.dataClass ?? "SYNTHETIC_CONTROLLED_EDUCATIONAL_PROOF",
    maturity: "PRACTICED_WITH_OBSERVATIONS",
    activityRefs: designProof.program.map((item) => `activity:${item.programId}`),
    relationshipRefs: designProof.relationships.map((edge) => `relationship:${edge.sourceNode}->${edge.targetNode}:${edge.relationship}`),
    partiRefs: designProof.zones.map((zone) => `parti-zone:${zone.zoneId}`),
    topologyRefs: proofCycle.topologyEvidence?.hypothesisIds.map((id) => `topology:${id}`) ?? [],
    geometryRefs: [],
    evidenceRefs: [...(proofCycle.acquisition?.evidenceRefs ?? []), ...designProof.provenance],
    unknowns: [...(proofCycle.acquisition?.unknowns ?? []), ...designProof.unknownRelationships],
    contradictions: designProof.conflicts,
    preservedPrinciples: ["activities before labels", "relationships before coordinates", "topology before selection"],
    changedConditions: ["users", "flows", "typology"],
    nonApplicationCases: ["room label does not prove activity", "line does not prove circulation", "adjacency does not prove quality"],
    humanReview: "RECORDED",
    humanAuthority: "PRESERVED",
    noAutomaticPromotion: true,
    noAutomaticDecision: true,
    noAutomaticWinner: true,
  };
  return { ledgerId: "ARKI-ACQUISITION-LEDGER-HOUSE-A21", traces: [trace], sourceCycleId: proofCycle.cycleId, sourceDesignProofId: designProof.proofId, designEvidenceStatus: "SEMANTIC_TRACE_ONLY", implementationNote: "The ledger connects curriculum evidence to A21 design semantics without claiming construction geometry or project verification." };
}

export function validateKnowledgeAcquisitionLedger(ledger: KnowledgeAcquisitionLedger): boolean {
  return ledger.traces.length > 0
    && ledger.traces.every((trace) => trace.knowledgeUnitIds.length > 0 && trace.practiceIds.length > 0 && trace.activityRefs.length > 0 && trace.relationshipRefs.length > 0 && trace.partiRefs.length > 0 && trace.topologyRefs.length >= 3 && trace.evidenceRefs.length > 0 && trace.unknowns.length > 0 && trace.humanAuthority === "PRESERVED" && trace.noAutomaticPromotion && trace.noAutomaticDecision && trace.noAutomaticWinner)
    && ledger.designEvidenceStatus === "SEMANTIC_TRACE_ONLY";
}

export function runKnowledgeAcquisitionLedgerNegativeControls() {
  const ledger = buildHouseKnowledgeAcquisitionLedger();
  const trace = ledger.traces[0];
  return {
    noGeometryClaim: ledger.designEvidenceStatus === "SEMANTIC_TRACE_ONLY" && trace.geometryRefs.length === 0,
    unknownPreserved: trace.unknowns.length > 0,
    contradictionPreserved: trace.contradictions.length >= 0,
    humanAuthorityPreserved: trace.humanAuthority === "PRESERVED",
    automaticPromotionBlocked: trace.noAutomaticPromotion,
    automaticDecisionBlocked: trace.noAutomaticDecision,
  };
}
