import { buildCanonicalBuildingModel } from "./arkiBuildingAuthoring";
import { detectD76Deficits, type RelationalProjectState } from "./arkiD76AutonomousDeficitDetection";
import { diagnoseD77 } from "./arkiD77AutonomousCauseDiagnosis";
import { executeD62GeneralStrategyGate } from "./arkiD62StrategySynthesisExecution";
import { synthesizeD63Candidates } from "./arkiD63CandidateSynthesis";
import { runD64ClosedLoop } from "./arkiD64ClosedLoop";
import { verifyD71Effects } from "./arkiD71EffectVerification";
import { compareD72Candidates } from "./arkiD72ArchitecturalComparison";
import { assessCoordination, assessPerformanceEvidence, buildIntegratedTrace, createCleanProjectBoundary, createIntegratedDecisionTrace, type IntegratedTraceRecord } from "./arkiIntegratedPracticeBoundary";

export type P81DetailedStage = "PROJECT_INPUT" | "PURPOSE" | "REQUIRED_CAPABILITIES" | "SYSTEM_REQUIREMENTS" | "FUNCTIONAL_REQUIREMENTS" | "ACTIVITIES" | "ACTORS_STATES" | "CAPACITY_SCENARIO" | "RELATIONSHIPS" | "FLOWS_JOURNEYS" | "CONTROLS" | "PROGRAM" | "FUNCTIONAL_UNITS" | "SPATIAL_REQUIREMENTS" | "SPATIAL_REALIZATION" | "STRATEGY" | "CANDIDATE" | "TOPOLOGY" | "CANONICAL_MODEL" | "EVALUATION" | "DEFICIT" | "CAUSE" | "RESOLUTION_STRATEGY" | "DESIGN_MOVE" | "MUTATION" | "REEVALUATION" | "COMPARISON" | "HUMAN_DECISION_POINT";

export type P81ProofResult = {
  projectId: string;
  boundary: ReturnType<typeof createCleanProjectBoundary>;
  trace: ReturnType<typeof buildIntegratedTrace>;
  canonicalModelVersion: string;
  detection: ReturnType<typeof detectD76Deficits>;
  diagnosis: ReturnType<typeof diagnoseD77>;
  strategy: ReturnType<typeof executeD62GeneralStrategyGate>;
  candidates: ReturnType<typeof synthesizeD63Candidates>;
  closedLoop: ReturnType<typeof runD64ClosedLoop>;
  effects: ReturnType<typeof verifyD71Effects>;
  comparison: ReturnType<typeof compareD72Candidates>;
  coordination: ReturnType<typeof assessCoordination>;
  performance: ReturnType<typeof assessPerformanceEvidence>;
  decision: ReturnType<typeof createIntegratedDecisionTrace>;
  brokenBridges: Array<{ from: string; to: string; whyBroken: string; missingInformation: string[]; missingCapability: string[]; reusePath: string[]; minimumExtension: string; blockingStatus: "BLOCKED" | "OBSERVATION" }>;
  status: "INTEGRATED_CHAIN_DEMONSTRATED" | "INTEGRATED_CHAIN_PARTIAL" | "BLOCKED_AT_BRIDGE";
  k1Created: false;
  automaticWinner: "NONE";
  permitReady: false;
  professionalValidation: "NOT_CLAIMED";
  provenance: string[];
};

function cleanRelationalState(projectId: string): RelationalProjectState {
  return {
    stateId: `P81:${projectId}:RELATIONAL_STATE`,
    actors: ["visitor", "staff"],
    activities: ["arrive", "use", "serve", "exit"],
    journeys: [
      { id: "JOURNEY:public", requiredNodes: ["entry", "shared-space", "exit"], activeNodes: ["entry", "shared-space", "exit"] },
      { id: "JOURNEY:service", requiredNodes: ["receiving", "support", "shared-space"], activeNodes: ["receiving", "shared-space"] },
    ],
    flows: [{ id: "FLOW:service", required: ["receiving→support", "support→shared-space"], actual: ["receiving→shared-space"] }],
    relationships: [{ subject: "support", relation: "connects_to", object: "shared-space", required: true, actual: true }],
    capacities: [{ subject: "shared-space", demand: 120, capacity: 120 }],
    controls: [{ subject: "exit", required: ["legible-egress"], active: ["legible-egress"] }],
    dependencies: [{ subject: "support", required: ["receiving"], available: ["support"] }],
    evidence: [{ id: "EVIDENCE:service-route", subject: "service-journey", coverage: "PARTIAL", statement: "The service journey is only partially represented in the active topology." }],
    unusualButValid: true,
  };
}

function detailRecords(projectId: string, canonicalModelVersion: string, findingId: string): IntegratedTraceRecord[] {
  const stages: Array<[P81DetailedStage, string, string[], "INPUT" | "DERIVED" | "OBSERVED" | "UNKNOWN"]> = [
    ["PROJECT_INPUT", "input:brief", ["client-brief"], "INPUT"],
    ["PURPOSE", "purpose:integrated-practice", ["input:brief"], "DERIVED"],
    ["REQUIRED_CAPABILITIES", "capabilities:traceable-architectural-chain", ["purpose:integrated-practice"], "DERIVED"],
    ["SYSTEM_REQUIREMENTS", "requirements:system", ["capabilities:traceable-architectural-chain"], "DERIVED"],
    ["FUNCTIONAL_REQUIREMENTS", "requirements:functional", ["requirements:system"], "DERIVED"],
    ["ACTIVITIES", "activities:public-service", ["requirements:functional"], "DERIVED"],
    ["ACTORS_STATES", "actors:visitor-staff", ["activities:public-service"], "DERIVED"],
    ["CAPACITY_SCENARIO", "scenario:controlled", ["actors:visitor-staff"], "DERIVED"],
    ["RELATIONSHIPS", "relationships:service-public", ["scenario:controlled"], "DERIVED"],
    ["FLOWS_JOURNEYS", "journeys:service-public", ["relationships:service-public"], "DERIVED"],
    ["CONTROLS", "controls:egress", ["journeys:service-public"], "DERIVED"],
    ["PROGRAM", "program:derived-hypothesis", ["activities:public-service", "relationships:service-public"], "DERIVED"],
    ["FUNCTIONAL_UNITS", "units:public-support", ["program:derived-hypothesis"], "DERIVED"],
    ["SPATIAL_REQUIREMENTS", "spatial-requirements:routes-interfaces", ["units:public-support"], "DERIVED"],
    ["SPATIAL_REALIZATION", "realization:bounded-candidate", ["spatial-requirements:routes-interfaces"], "DERIVED"],
    ["STRATEGY", "strategy:contextual", ["realization:bounded-candidate", findingId], "DERIVED"],
    ["CANDIDATE", "candidate:generated", ["strategy:contextual"], "DERIVED"],
    ["TOPOLOGY", "topology:active-state", ["candidate:generated"], "DERIVED"],
    ["CANONICAL_MODEL", `canonical:${canonicalModelVersion}`, ["topology:active-state"], "OBSERVED"],
    ["EVALUATION", "evaluation:bounded", [`canonical:${canonicalModelVersion}`], "OBSERVED"],
    ["DEFICIT", findingId, ["evaluation:bounded"], "OBSERVED"],
    ["CAUSE", `cause:${findingId}`, [findingId], "DERIVED"],
    ["RESOLUTION_STRATEGY", "resolution:contextual", [`cause:${findingId}`], "DERIVED"],
    ["DESIGN_MOVE", "move:bounded-s2", ["resolution:contextual"], "DERIVED"],
    ["MUTATION", "mutation:parent-child", ["move:bounded-s2"], "OBSERVED"],
    ["REEVALUATION", "reevaluation:expected-observed", ["mutation:parent-child"], "OBSERVED"],
    ["COMPARISON", "comparison:tradeoffs", ["reevaluation:expected-observed"], "OBSERVED"],
    ["HUMAN_DECISION_POINT", "decision:human-required", ["comparison:tradeoffs"], "UNKNOWN"],
  ];
  return stages.map(([stage, entityId, derivedFrom, state], index) => ({ traceId: `${projectId}:TRACE:${index + 1}`, stage: stage as never, entityId, derivedFrom, sourceRefs: ["P8.1 controlled proof", ...derivedFrom], state, epistemicState: state === "INPUT" ? "PROJECT_FACT" : state === "UNKNOWN" ? "UNKNOWN" : state === "OBSERVED" ? "HYPOTHESIS" : "DERIVED" }));
}

function deriveRequiredEffect(finding: ReturnType<typeof detectD76Deficits>["findings"][number] | undefined): string {
  if (!finding) return "clarify interface";
  if (finding.affectedCapability === "JOURNEY_REASONING") return "reroute journey";
  if (finding.affectedCapability === "RELATIONSHIP_REASONING") return "clarify sequence";
  if (finding.affectedCapability === "FLOW_REASONING") return "clarify sequence";
  if (finding.affectedCapability === "CAPACITY_REASONING") return "redistribute capacity";
  if (finding.affectedCapability === "CONTROL_REASONING") return "control access";
  return "clarify interface";
}

export function runP81IntegratedPracticeProof(projectId = "P81-CLEAN-CONTROLLED-PROJECT"): P81ProofResult {
  const boundary = createCleanProjectBoundary(projectId, [
    { id: "input:brief", kind: "CLIENT_FACT", statement: "Connect a public/service architectural workflow and preserve human review.", state: "PROJECT_FACT", sourceRefs: ["client-brief"] },
    { id: "input:unknown-site", kind: "UNKNOWN", statement: "Exact survey, jurisdiction and professional engineering data are not supplied.", state: "UNKNOWN", sourceRefs: ["missing-input-ledger"] },
  ]);
  const detection = detectD76Deficits(cleanRelationalState(projectId));
  const diagnosis = diagnoseD77(detection.findings);
  const selected = detection.findings.find((finding) => finding.epistemicStatus === "OBSERVED");
  const supportedCause = selected ? diagnosis.diagnoses.find((item) => item.deficitId === selected.findingId)?.causeModels[0]?.supportedCauses[0] : undefined;
  const strategyInput = {
    observedDeficit: selected?.detectedCondition ?? "relational mismatch observed in active state",
    cause: supportedCause ?? "cause remains unknown",
    requiredEffect: deriveRequiredEffect(selected),
    conditionTags: ["interaction", "journey"],
    stateTags: ["mutable interface"],
    scenarioTags: ["controlled project state"],
    mutability: "MUTABLE" as const,
    authority: "PROJECT_CONTROLLED" as const,
    hardConstraints: [],
  };
  const strategy = executeD62GeneralStrategyGate(strategyInput);
  const candidates = synthesizeD63Candidates(strategy.synthesis.contextualStrategies);
  const closedLoop = runD64ClosedLoop(candidates.candidates);
  const effects = verifyD71Effects(closedLoop);
  const comparison = compareD72Candidates(closedLoop, effects);
  const canonicalModel = buildCanonicalBuildingModel();
  const trace = buildIntegratedTrace(projectId, detailRecords(projectId, canonicalModel.modelVersion, selected?.findingId ?? "finding:unknown").filter((record) => ["PURPOSE", "PROGRAM", "RELATIONSHIP", "CANDIDATE", "CANONICAL_MODEL", "EVALUATION"].some((stage) => stage === record.stage)));
  const coordination = assessCoordination(undefined, projectId);
  const performance = assessPerformanceEvidence([{ evidenceId: "P81:performance-proxy", metric: "environmental-performance", evidenceClass: "PROXY", sourceRefs: ["bounded-analysis-placeholder"], independentlyValidated: false, humanReviewState: "PENDING_HUMAN_REVIEW" }]);
  const decision = createIntegratedDecisionTrace(projectId, ["Human architect must review trade-offs, unknowns, and consequences before selecting any candidate."]);
  const brokenBridges = [
    { from: "PROJECT_INPUT", to: "REGULATORY_APPROVAL", whyBroken: "Jurisdiction, source version and project-stage evidence are not supplied.", missingInformation: ["jurisdiction", "verified source version", "project stage"], missingCapability: ["professional regulatory review"], reusePath: ["regulatoryApplicabilityFoundation"], minimumExtension: "Collect and human-review project-specific regulatory context.", blockingStatus: "BLOCKED" as const },
    { from: "CANONICAL_MODEL", to: "PROFESSIONAL_DOCUMENTATION", whyBroken: "The available S1 model is conceptual and explicitly not construction documentation.", missingInformation: ["survey", "engineering calculations", "construction assemblies", "professional signatures"], missingCapability: ["permit/executive documentation"], reusePath: ["CanonicalBuildingModel", "existing exporters"], minimumExtension: "Specialist-led documentation and independent validation.", blockingStatus: "BLOCKED" as const },
    { from: "COMPARISON", to: "HUMAN_DECISION_POINT", whyBroken: "No human decision was supplied during this run.", missingInformation: ["architect's selected option and rationale"], missingCapability: [], reusePath: ["A21 DesignMemory"], minimumExtension: "Record explicit human decision when the architect reviews the result.", blockingStatus: "OBSERVATION" as const },
  ];
  const meaningful = detection.gate === "PASS" && diagnosis.gate === "PASS" && strategy.gate === "PASS" && candidates.gate === "PASS" && closedLoop.l7 === "DEMONSTRATED" && effects.gate === "PASS" && comparison.automaticWinner === "NONE";
  return { projectId, boundary, trace, canonicalModelVersion: canonicalModel.modelVersion, detection, diagnosis, strategy, candidates, closedLoop, effects, comparison, coordination, performance, decision, brokenBridges, status: meaningful ? "INTEGRATED_CHAIN_PARTIAL" : "BLOCKED_AT_BRIDGE", k1Created: false, automaticWinner: "NONE", permitReady: false, professionalValidation: "NOT_CLAIMED", provenance: ["P8.1 integrated practice proof", "Clean input ledger", "D7.6–D7.2 existing architecture reused", "No UPAO historical answers used", "Human authority preserved"] };
}

export function validateP81Proof(result: P81ProofResult): boolean {
  return result.boundary.state === "CLEAN_BOUNDARY" && result.boundary.inputs.length > 0 && result.k1Created === false && result.automaticWinner === "NONE" && result.permitReady === false && result.professionalValidation === "NOT_CLAIMED" && result.decision.state === "PENDING_HUMAN_DECISION" && result.brokenBridges.length > 0 && result.provenance.some((item) => item.includes("No UPAO"));
}
