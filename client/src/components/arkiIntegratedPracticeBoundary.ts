import type { CanonicalBuildingModel } from "./arkiBuildingAuthoring";
import type { DesignMemory } from "./a21DesignMemory";
import { createDesignMemory, recordHumanDesignDecision } from "./a21DesignMemory";
import type { MultidisciplinaryEngineeringModel } from "./arkiMultidisciplinaryEngineering";
import { assessRegulatoryApplicability, type RegulatoryApplicabilityAssessment, type RegulatoryApplicabilityContext, type RegulatoryRequirementReference, type RegulatorySourceReference } from "./regulatoryApplicabilityFoundation";

export type IntegratedInputKind = "CLIENT_FACT" | "SITE_FACT" | "OBJECTIVE" | "HARD_CONSTRAINT" | "PREFERENCE" | "REGULATORY_SOURCE" | "UNKNOWN" | "HUMAN_DECISION";
export type IntegratedInputState = "HUMAN_CONFIRMED" | "PROJECT_FACT" | "SOURCE_REFERENCED" | "DERIVED" | "HYPOTHESIS" | "UNKNOWN";
export type IntegratedStage = "PURPOSE" | "REQUIREMENT" | "PROGRAM" | "RELATIONSHIP" | "CANDIDATE" | "CANONICAL_MODEL";
export type IntegratedGateState = "PASS" | "PASS_WITH_OBSERVATIONS" | "BLOCKED" | "NOT_ASSESSED";

export type IntegratedProjectInput = {
  id: string;
  kind: IntegratedInputKind;
  statement: string;
  state: IntegratedInputState;
  sourceRefs: string[];
  forbiddenSolutionContent?: boolean;
};

export type CleanProjectBoundary = {
  projectId: string;
  historicalFixtureIds: string[];
  inputs: IntegratedProjectInput[];
  excludedSolutionFields: string[];
  state: "CLEAN_BOUNDARY" | "REJECTED_CONTAMINATED_INPUT";
  provenance: string[];
};

export type IntegratedTraceRecord = {
  traceId: string;
  stage: IntegratedStage;
  entityId: string;
  derivedFrom: string[];
  sourceRefs: string[];
  state: "INPUT" | "DERIVED" | "OBSERVED" | "UNKNOWN";
  epistemicState: IntegratedInputState;
};

export type IntegratedTrace = {
  projectId: string;
  records: IntegratedTraceRecord[];
  missingStages: IntegratedStage[];
  unknowns: string[];
  state: IntegratedGateState;
  noAutomaticDecision: true;
  provenance: string[];
};

export type CoordinationGate = {
  projectId: string;
  architecturalModelVersion?: string;
  state: IntegratedGateState;
  disciplineStates: Record<string, "PRESENT" | "MISSING" | "UNKNOWN" | "REQUIRES_SPECIALIST_REVIEW">;
  affectedSystems: string[];
  missingEvidence: string[];
  specialistReviewRequired: true;
  noAutomaticApproval: true;
  provenance: string[];
};

export type PerformanceEvidence = {
  evidenceId: string;
  metric: string;
  value?: number;
  unit?: string;
  evidenceClass: "MEASURED" | "SIMULATED" | "PROXY" | "SOURCE_STATEMENT" | "UNKNOWN";
  sourceRefs: string[];
  independentlyValidated: boolean;
  humanReviewState: "NOT_STARTED" | "PENDING_HUMAN_REVIEW" | "CONFIRMED";
};

export type PerformanceGate = {
  state: IntegratedGateState;
  evidence: PerformanceEvidence[];
  unknowns: string[];
  claims: string[];
  noAutomaticCompliance: true;
  provenance: string[];
};

export type IntegratedDecisionTrace = {
  projectId: string;
  designMemory: DesignMemory;
  state: "PENDING_HUMAN_DECISION" | "HUMAN_DECISION_RECORDED";
  pendingQuestions: string[];
  noAutomaticDecision: true;
  noAutomaticRecommendation: true;
  noAutomaticWinner: true;
};

const forbiddenSolutionFields = ["preferredParti", "expectedZoning", "desiredGeometry", "expectedDeficit", "expectedCause", "preferredAlternative", "answerKey"];

function containsHistoricalFixture(value: string): boolean {
  return /UPAO-001|UPAO001|UPAO_001/i.test(value);
}

export function createCleanProjectBoundary(projectId: string, inputs: IntegratedProjectInput[], historicalFixtureIds: string[] = []): CleanProjectBoundary {
  const contaminated = [...historicalFixtureIds, projectId, ...inputs.flatMap((input) => [input.id, input.statement, ...input.sourceRefs])].some(containsHistoricalFixture)
    || inputs.some((input) => input.forbiddenSolutionContent === true);
  return {
    projectId,
    historicalFixtureIds: [...historicalFixtureIds],
    inputs: contaminated ? [] : inputs,
    excludedSolutionFields: [...forbiddenSolutionFields],
    state: contaminated ? "REJECTED_CONTAMINATED_INPUT" : "CLEAN_BOUNDARY",
    provenance: ["P8.1 clean project boundary", "Historical fixtures excluded", "Solution leakage controls active"],
  };
}

export function buildIntegratedTrace(projectId: string, records: IntegratedTraceRecord[]): IntegratedTrace {
  const expected: IntegratedStage[] = ["PURPOSE", "REQUIREMENT", "PROGRAM", "RELATIONSHIP", "CANDIDATE", "CANONICAL_MODEL"];
  const present = new Set(records.map((record) => record.stage));
  const missingStages = expected.filter((stage) => !present.has(stage));
  const unknowns = records.filter((record) => record.state === "UNKNOWN" || record.epistemicState === "UNKNOWN").map((record) => `${record.stage}:${record.entityId}`);
  const chainValid = records.every((record) => record.traceId.length > 0 && record.entityId.length > 0 && record.sourceRefs.length > 0);
  return {
    projectId,
    records,
    missingStages,
    unknowns,
    state: !chainValid || missingStages.length > 0 ? "BLOCKED" : unknowns.length > 0 ? "PASS_WITH_OBSERVATIONS" : "PASS",
    noAutomaticDecision: true,
    provenance: ["P8.1 integrated trace", "A21/S1 lineage boundary", "CanonicalBuildingModel lineage required"],
  };
}

export function assessCoordination(model: MultidisciplinaryEngineeringModel | undefined, projectId: string): CoordinationGate {
  if (!model || model.projectId !== projectId) return { projectId, state: "BLOCKED", disciplineStates: {}, affectedSystems: [], missingEvidence: ["multidisciplinary model for project"], specialistReviewRequired: true, noAutomaticApproval: true, provenance: ["P8.1 coordination gate"] };
  const disciplineStates: Record<string, CoordinationGate["disciplineStates"][string]> = {};
  for (const discipline of model.disciplines) disciplineStates[discipline.name] = discipline.specialistRequired ? "REQUIRES_SPECIALIST_REVIEW" : "PRESENT";
  const unknownCount = model.records.filter((record) => record.state === "UNKNOWN" || record.state === "CALCULATION_REQUIRED").length;
  return { projectId, architecturalModelVersion: model.architecturalModelVersion, state: unknownCount > 0 ? "PASS_WITH_OBSERVATIONS" : "NOT_ASSESSED", disciplineStates, affectedSystems: model.records.filter((record) => record.kind === "CONFLICT").flatMap((record) => record.relations), missingEvidence: unknownCount ? ["discipline calculations", "structural/MEP/fire specialist review"] : [], specialistReviewRequired: true, noAutomaticApproval: true, provenance: ["P8.1 coordination gate", "arkiMultidisciplinaryEngineering"] };
}

export function assessRegulatoryGate(source: RegulatorySourceReference, requirement: RegulatoryRequirementReference | undefined, context: RegulatoryApplicabilityContext, evidenceRefs: string[] = []): RegulatoryApplicabilityAssessment {
  return assessRegulatoryApplicability(source, requirement, context, evidenceRefs);
}

export function assessPerformanceEvidence(evidence: PerformanceEvidence[]): PerformanceGate {
  const unknowns = evidence.filter((item) => item.evidenceClass === "UNKNOWN" || !item.sourceRefs.length).map((item) => `${item.evidenceId}:${item.metric}`);
  const onlyProxyOrSimulation = evidence.length > 0 && evidence.every((item) => item.evidenceClass === "PROXY" || item.evidenceClass === "SIMULATED");
  const independentlyMeasured = evidence.some((item) => item.evidenceClass === "MEASURED" && item.independentlyValidated);
  return {
    state: !evidence.length ? "NOT_ASSESSED" : unknowns.length ? "BLOCKED" : independentlyMeasured ? "PASS_WITH_OBSERVATIONS" : "PASS_WITH_OBSERVATIONS",
    evidence,
    unknowns,
    claims: onlyProxyOrSimulation ? ["Evidence supports a bounded analytical claim only.", "Proxy/simulation is not measured operational performance."] : ["Performance evidence remains subject to human and specialist review."],
    noAutomaticCompliance: true,
    provenance: ["P8.1 performance evidence gate", "Proxy/simulation distinction preserved"],
  };
}

export function createIntegratedDecisionTrace(projectId: string, pendingQuestions: string[] = []): IntegratedDecisionTrace {
  return { projectId, designMemory: createDesignMemory(projectId), state: "PENDING_HUMAN_DECISION", pendingQuestions, noAutomaticDecision: true, noAutomaticRecommendation: true, noAutomaticWinner: true };
}

export function recordIntegratedHumanDecision(trace: IntegratedDecisionTrace, decision: Parameters<typeof recordHumanDesignDecision>[1]): IntegratedDecisionTrace {
  return { ...trace, designMemory: recordHumanDesignDecision(trace.designMemory, decision), state: "HUMAN_DECISION_RECORDED", pendingQuestions: trace.pendingQuestions };
}

export function validateIntegratedPracticeBoundary(boundary: CleanProjectBoundary, trace: IntegratedTrace, coordination: CoordinationGate, performance: PerformanceGate, decision: IntegratedDecisionTrace): boolean {
  return boundary.state === "CLEAN_BOUNDARY"
    && trace.noAutomaticDecision
    && coordination.noAutomaticApproval
    && coordination.specialistReviewRequired
    && performance.noAutomaticCompliance
    && decision.noAutomaticDecision
    && decision.noAutomaticRecommendation
    && decision.noAutomaticWinner
    && !boundary.inputs.some((input) => input.forbiddenSolutionContent === true);
}

export function buildP8NegativeControls() {
  const contaminated = createCleanProjectBoundary("UPAO-001-B", [{ id: "input-1", kind: "CLIENT_FACT", statement: "clean", state: "PROJECT_FACT", sourceRefs: ["UPAO-001"] }]);
  const answerKey = createCleanProjectBoundary("PROJECT-B", [{ id: "input-2", kind: "PREFERENCE", statement: "expectedZoning = courtyard", state: "HYPOTHESIS", sourceRefs: ["human"], forbiddenSolutionContent: true }]);
  const incomplete = buildIntegratedTrace("PROJECT-B", [{ traceId: "t1", stage: "PURPOSE", entityId: "purpose-1", derivedFrom: [], sourceRefs: ["human"], state: "INPUT", epistemicState: "HUMAN_CONFIRMED" }]);
  const performance = assessPerformanceEvidence([{ evidenceId: "proxy-1", metric: "daylight", evidenceClass: "PROXY", sourceRefs: ["simulation"], independentlyValidated: false, humanReviewState: "PENDING_HUMAN_REVIEW" }]);
  return { contaminatedRejected: contaminated.state === "REJECTED_CONTAMINATED_INPUT", answerKeyRejected: answerKey.state === "REJECTED_CONTAMINATED_INPUT", incompleteTraceBlocked: incomplete.state === "BLOCKED", proxyNotCompliance: performance.state === "PASS_WITH_OBSERVATIONS" && performance.noAutomaticCompliance };
}

export { forbiddenSolutionFields };
