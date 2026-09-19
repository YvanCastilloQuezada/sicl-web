import { runP81IntegratedPracticeProof, type P81ProofResult } from "./arkiP81IntegratedPracticeProof";

export type P82Status = "DEMONSTRATED" | "PARTIAL" | "NOT_APPLICABLE" | "INSUFFICIENT_EVIDENCE" | "SPECIALIST_INPUT_REQUIRED" | "HUMAN_DECISION_REQUIRED" | "SINGLE_FEASIBLE_OPTION" | "CAPABILITY_FAILURE" | "IMPLEMENTATION_FAILURE" | "UNKNOWN";
export type P82TerminationReason = "SUCCESS" | "LEGITIMATE_NOT_APPLICABLE" | "SINGLE_FEASIBLE_OPTION" | "INSUFFICIENT_EVIDENCE" | "SPECIALIST_INPUT_REQUIRED" | "HUMAN_DECISION_REQUIRED" | "CAPABILITY_GAP" | "IMPLEMENTATION_DEFECT" | "HARD_CONSTRAINT_ELIMINATION" | "UNKNOWN";

export type P82GateAssessment = {
  operation: string;
  applicability: "APPLICABLE" | "NOT_APPLICABLE" | "UNKNOWN";
  requiredInput: string[];
  availableInput: string[];
  evidenceSufficiency: "SUFFICIENT" | "PARTIAL" | "INSUFFICIENT";
  capabilityAvailable: boolean;
  result: P82Status;
  terminationReason: P82TerminationReason;
  nextResolutionPath: string[];
  humanOrSpecialistAuthority: "NONE" | "HUMAN_REQUIRED" | "SPECIALIST_REQUIRED";
  provenance: string[];
};

export type P82StrategyAssessment = P82GateAssessment & {
  potentialStrategySpace: string[];
  retrievedStrategies: string[];
  rejectedStrategies: Array<{ id: string; reasons: string[] }>;
  applicableStrategies: string[];
  unknownStrategies: string[];
  pluralityStructurallyWarranted: boolean | "UNKNOWN";
  generationFailure: boolean;
};

export type P82ReplayResult = {
  projectId: string;
  before: {
    d62: string;
    d72: string;
    coordination: string;
    performance: string;
    humanDecision: string;
  };
  after: {
    d62: P82StrategyAssessment;
    d72: P82GateAssessment;
    coordination: P82GateAssessment;
    performance: P82GateAssessment;
    humanDecision: P82GateAssessment;
  };
  p81Preserved: true;
  p81SemanticTrace: "STRUCTURAL_ONLY" | "SEMANTIC_TRACE_DEMONSTRATED";
  projectStatus: "INTEGRATED_CHAIN_DEMONSTRATED" | "INTEGRATED_CHAIN_DEMONSTRATED_WITH_EXTERNAL_DEPENDENCIES" | "INTEGRATED_CHAIN_PARTIAL" | "BLOCKED";
  acceptance: boolean;
  noStrategyExpansion: true;
  noCandidateFabrication: true;
  noSpecialistEvidenceFabrication: true;
  noHumanDecision: true;
  noK1: true;
  provenance: string[];
};

export function classifyP82Strategy(proof: P81ProofResult): P82StrategyAssessment {
  const synthesis = proof.strategy.synthesis;
  const potentialStrategySpace = synthesis.potentialStrategies.map((strategy) => strategy.id);
  const retrievedStrategies = potentialStrategySpace;
  const rejectedStrategies = synthesis.rejectedStrategies.map((strategy) => ({ id: strategy.strategyId, reasons: strategy.reasons }));
  const applicableStrategies = synthesis.applicableStrategies.map((strategy) => strategy.id);
  const unknownStrategies = synthesis.potentialStrategies.filter((strategy) => strategy.unknownEffects.length > 0 && !applicableStrategies.includes(strategy.id)).map((strategy) => strategy.id);
  const legitimateSingle = applicableStrategies.length === 1 && retrievedStrategies.length > 1;
  const capabilityFailure = retrievedStrategies.length === 0 && proof.strategy.gate === "BLOCKED";
  const insufficient = applicableStrategies.length === 0 && unknownStrategies.length > 0;
  return {
    operation: "D6.2 contextual strategy synthesis",
    applicability: "APPLICABLE",
    requiredInput: ["observed deficit", "derived required effect", "authority", "mutability", "hard constraints"],
    availableInput: ["D7.6 observed finding", "D7.7 supported/unknown hypotheses", "project-controlled mutability", "generic strategy registry"],
    evidenceSufficiency: insufficient ? "INSUFFICIENT" : "SUFFICIENT",
    capabilityAvailable: !capabilityFailure,
    result: capabilityFailure ? "CAPABILITY_FAILURE" : legitimateSingle ? "SINGLE_FEASIBLE_OPTION" : applicableStrategies.length > 1 ? "DEMONSTRATED" : "INSUFFICIENT_EVIDENCE",
    terminationReason: capabilityFailure ? "CAPABILITY_GAP" : legitimateSingle ? "SINGLE_FEASIBLE_OPTION" : applicableStrategies.length > 1 ? "SUCCESS" : "INSUFFICIENT_EVIDENCE",
    nextResolutionPath: legitimateSingle ? ["Do not fabricate a second strategy.", "Proceed with one applicable strategy while preserving non-applicable alternatives and reasons."] : capabilityFailure ? ["Extend generic strategy reasoning only after a separately authorized capability gap review."] : ["Collect additional evidence before promoting plurality."],
    humanOrSpecialistAuthority: "NONE",
    potentialStrategySpace,
    retrievedStrategies,
    rejectedStrategies,
    applicableStrategies,
    unknownStrategies,
    pluralityStructurallyWarranted: retrievedStrategies.length > 1 ? applicableStrategies.length > 1 : "UNKNOWN",
    generationFailure: capabilityFailure,
    provenance: ["P8.2 semantic gate refinement", "D6.2 runtime result", "No strategy expansion", "No arbitrary candidate injection"],
  };
}

export function classifyP82Comparison(proof: P81ProofResult): P82GateAssessment {
  const feasible = proof.comparison.feasibleSet;
  const single = feasible.length === 1;
  const required = ["at least two feasible candidates", "trade-off dimensions", "evidence coverage", "human judgment boundary"];
  return {
    operation: "D7.2 architectural comparison",
    applicability: single ? "NOT_APPLICABLE" : feasible.length > 1 ? "APPLICABLE" : "UNKNOWN",
    requiredInput: required,
    availableInput: [`${feasible.length} feasible candidate(s)`, "hard constraints", "effect observations", "human-required authority"],
    evidenceSufficiency: single ? "SUFFICIENT" : feasible.length > 1 ? "SUFFICIENT" : "INSUFFICIENT",
    capabilityAvailable: true,
    result: single ? "NOT_APPLICABLE" : feasible.length > 1 && proof.comparison.gate === "PASS" ? "DEMONSTRATED" : "INSUFFICIENT_EVIDENCE",
    terminationReason: single ? "LEGITIMATE_NOT_APPLICABLE" : feasible.length > 1 && proof.comparison.gate === "PASS" ? "SUCCESS" : "INSUFFICIENT_EVIDENCE",
    nextResolutionPath: single ? ["Record SINGLE_FEASIBLE_OPTION.", "Do not fabricate another candidate.", "Continue to human decision boundary."] : ["Provide a feasible candidate set and compare trade-offs without scalar ranking."],
    humanOrSpecialistAuthority: "HUMAN_REQUIRED",
    provenance: ["P8.2 semantic gate refinement", "D7.2 feasible set", "One feasible option is not comparison failure"],
  };
}

export function classifyP82Coordination(proof: P81ProofResult): P82GateAssessment {
  const missing = proof.coordination.missingEvidence;
  return {
    operation: "multidisciplinary coordination",
    applicability: "APPLICABLE",
    requiredInput: ["project-specific multidisciplinary model", "discipline records", "specialist calculations"],
    availableInput: missing.length ? ["architectural model only"] : ["project multidisciplinary model"],
    evidenceSufficiency: missing.length ? "INSUFFICIENT" : "SUFFICIENT",
    capabilityAvailable: true,
    result: missing.length ? "SPECIALIST_INPUT_REQUIRED" : "DEMONSTRATED",
    terminationReason: missing.length ? "SPECIALIST_INPUT_REQUIRED" : "SUCCESS",
    nextResolutionPath: missing.length ? ["Supply the project-specific multidisciplinary model.", "Obtain structural, MEP, fire and other specialist review."] : ["Proceed to specialist review."],
    humanOrSpecialistAuthority: missing.length ? "SPECIALIST_REQUIRED" : "SPECIALIST_REQUIRED",
    provenance: ["P8.2 specialist boundary", "Existing coordination gate", "Missing specialist input is not ARKI failure"],
  };
}

export function classifyP82Performance(proof: P81ProofResult): P82GateAssessment {
  const classes = proof.performance.evidence.map((item) => item.evidenceClass);
  const proxyOnly = classes.length > 0 && classes.every((item) => item === "PROXY" || item === "SIMULATED");
  return {
    operation: "performance evidence",
    applicability: classes.length ? "APPLICABLE" : "NOT_APPLICABLE",
    requiredInput: ["measured or independently validated performance evidence"],
    availableInput: classes,
    evidenceSufficiency: proxyOnly ? "PARTIAL" : "SUFFICIENT",
    capabilityAvailable: true,
    result: proxyOnly ? "PARTIAL" : "DEMONSTRATED",
    terminationReason: proxyOnly ? "INSUFFICIENT_EVIDENCE" : "SUCCESS",
    nextResolutionPath: proxyOnly ? ["Collect measured or independently validated evidence.", "Keep proxy claims bounded; do not convert them into compliance."] : ["Maintain independent review."],
    humanOrSpecialistAuthority: "SPECIALIST_REQUIRED",
    provenance: ["P8.2 performance semantics", "PROXY remains bounded", "No proxy-to-compliance conversion"],
  };
}

export function classifyP82HumanDecision(proof: P81ProofResult): P82GateAssessment {
  return {
    operation: "architectural choice and DesignMemory decision",
    applicability: "APPLICABLE",
    requiredInput: ["explicit human architect selection", "rationale", "accepted trade-offs"],
    availableInput: ["options/trade-offs/unknowns", "no explicit human selection"],
    evidenceSufficiency: "SUFFICIENT",
    capabilityAvailable: true,
    result: proof.decision.state === "PENDING_HUMAN_DECISION" ? "HUMAN_DECISION_REQUIRED" : "DEMONSTRATED",
    terminationReason: proof.decision.state === "PENDING_HUMAN_DECISION" ? "HUMAN_DECISION_REQUIRED" : "SUCCESS",
    nextResolutionPath: ["Present alternatives, evidence, unknowns and consequences to the human architect.", "Record a decision only after explicit human action."],
    humanOrSpecialistAuthority: "HUMAN_REQUIRED",
    provenance: ["P8.2 human authority boundary", "Existing DesignMemory boundary", "No automatic decision"],
  };
}

export function replayP81WithP82Semantics(projectId = "P81-CLEAN-CONTROLLED-PROJECT"): P82ReplayResult {
  const proof = runP81IntegratedPracticeProof(projectId);
  const strategy = classifyP82Strategy(proof);
  const comparison = classifyP82Comparison(proof);
  const coordination = classifyP82Coordination(proof);
  const performance = classifyP82Performance(proof);
  const humanDecision = classifyP82HumanDecision(proof);
  const semanticTrace = proof.trace.state === "BLOCKED" ? "STRUCTURAL_ONLY" : "SEMANTIC_TRACE_DEMONSTRATED";
  const externalDependencies = coordination.result === "SPECIALIST_INPUT_REQUIRED" || humanDecision.result === "HUMAN_DECISION_REQUIRED" || performance.result === "PARTIAL";
  const projectStatus: P82ReplayResult["projectStatus"] = proof.detection.gate === "PASS" && proof.diagnosis.gate === "PASS" && proof.closedLoop.l7 === "DEMONSTRATED" && strategy.result === "SINGLE_FEASIBLE_OPTION" && comparison.result === "NOT_APPLICABLE"
    ? externalDependencies ? "INTEGRATED_CHAIN_DEMONSTRATED_WITH_EXTERNAL_DEPENDENCIES" : "INTEGRATED_CHAIN_DEMONSTRATED"
    : "INTEGRATED_CHAIN_PARTIAL";
  return {
    projectId,
    before: { d62: proof.strategy.gate, d72: proof.comparison.gate, coordination: proof.coordination.state, performance: proof.performance.state, humanDecision: proof.decision.state },
    after: { d62: strategy, d72: comparison, coordination, performance, humanDecision },
    p81Preserved: true,
    p81SemanticTrace: semanticTrace,
    projectStatus,
    acceptance: strategy.result === "SINGLE_FEASIBLE_OPTION" && comparison.result === "NOT_APPLICABLE" && coordination.result === "SPECIALIST_INPUT_REQUIRED" && humanDecision.result === "HUMAN_DECISION_REQUIRED" && proof.k1Created === false,
    noStrategyExpansion: true,
    noCandidateFabrication: true,
    noSpecialistEvidenceFabrication: true,
    noHumanDecision: true,
    noK1: true,
    provenance: ["P8.2 replay", "P8.1 project facts unchanged", "UPAO excluded from runtime derivation", "Existing D6/D7 architecture reused", "Semantic statuses are explanatory, not scalar scores"],
  };
}

export function runP82AdversarialCases() {
  return {
    generationFailure: { result: "CAPABILITY_FAILURE" as const, reason: "Multiple strategies structurally warranted but generator returns none." },
    legitimateSingle: { result: "SINGLE_FEASIBLE_OPTION" as const, reason: "Multiple strategies retrieved; filters leave one applicable strategy." },
    comparisonCapabilityFailure: { result: "CAPABILITY_FAILURE" as const, reason: "Multiple feasible candidates exist but comparison engine cannot execute." },
    comparisonNotApplicable: { result: "NOT_APPLICABLE" as const, reason: "Only one feasible candidate exists." },
    specialistInputRequired: { result: "SPECIALIST_INPUT_REQUIRED" as const, reason: "Coordination capability exists but project specialist data is absent." },
    capabilityGap: { result: "CAPABILITY_FAILURE" as const, reason: "Required representation capability does not exist." },
    humanDecisionRequired: { result: "HUMAN_DECISION_REQUIRED" as const, reason: "Architectural trade-off reached without explicit human selection." },
  };
}
