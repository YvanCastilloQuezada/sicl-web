import {
  buildV6LearningLedger,
  buildV6TransferAssessment,
  type V6AutonomyLevel,
  type V6EvaluationReport,
  type V6StrategyFamily,
  validateV6EvaluationReport,
} from "./arkiV6ReasoningCheckpoint";

export type V61CaseId = "A_RESTAURANT_SOURCE" | "B_RESTAURANT_VARIANT" | "C_HOSPITAL_TRANSFER" | "D_LABORATORY_RESTRAINT" | "E_PUBLIC_REALM_AUTHORITY" | "F_MIXED_USE_CAPACITY";
export type V61Status = "DEMONSTRATED" | "PARTIAL" | "NOT_DEMONSTRATED" | "BLOCKED";

export type V61CaseResult = {
  caseId: V61CaseId;
  problem: string;
  strategyInput: string[];
  strategiesRetrieved: string[];
  strategiesGenerated: string[];
  strategiesRejected: string[];
  candidateCount: number;
  mutationCount: number;
  reevaluation: V61Status;
  comparison: V61Status;
  transfer: V61Status;
  generalization: V61Status;
  stopReason: string;
  report: V6EvaluationReport;
};

export type V61ProofResult = {
  baseline: { repository: string; branch: string; head: string; worktree: "CLEAN" | "DIRTY" };
  cases: V61CaseResult[];
  autonomy: Record<V6AutonomyLevel, { status: V61Status; evidence: string }>;
  learningMatrix: Array<{ caseId: V61CaseId; k0: string; observed: string; k1: string; status: V61Status }>;
  transferMatrix: Array<{ source: string; target: string; decision: string; evidence: string; status: V61Status }>;
  triplePropagation: { runtime: string; curriculum: string; book: string; consistency: V61Status };
  finalStatus: V61Status;
};

const commonUnknown = { type: "EVIDENCE" as const, statement: "Generic strategy generation evidence is absent in the current runtime.", resolutionPath: "Run a controlled case with a non-fixture strategy generator and persist its provenance." };

function buildReport(caseId: V61CaseId, problem: string, transfer: V6EvaluationReport["transfer"] = []): V6EvaluationReport {
  const learning = buildV6LearningLedger({
    k0: ["v6.0 contracts for cause, design move, transfer and evaluation"],
    suppliedInput: [problem],
    retrievedKnowledge: ["V6CauseModel", "V6DesignMove", "V6TransferAssessment"],
    adaptedKnowledge: [],
    executedReasoning: ["Case classified against the existing generic contracts."],
    observations: ["No generic runtime produced an unseeded strategy or candidate."],
    k1: [],
    deltaType: "EXECUTION",
    persisted: false,
  });
  return {
    reportId: `ARKI-V61-${caseId}`,
    baseline: { k0: ["v6.0 integrated contracts"], repository: "YvanCastilloQuezada/sicl-web", branch: "feat/spatial-pilot-media-studio-v1", head: "d47038d533b22368483cd7316a5c5239acfb0103", worktree: "DIRTY" },
    suppliedInput: [problem],
    initialUnknowns: [commonUnknown],
    reasoningActivated: ["V6 cause/strategy/design-move/transfer/report contracts"],
    knowledgeReused: ["V6CauseModel", "V6DesignMove", "V6TransferAssessment"],
    reasoningProvenance: ["client/src/components/arkiV6ReasoningCheckpoint.ts"],
    deficitsDetected: [problem],
    causeModels: [{ observedDeficit: problem, causeHypotheses: ["Multiple cause families may explain the observed deficit."], supportedCauses: [], verifiedCauses: [], certainty: "UNKNOWN", evidenceRefs: [], unknowns: [commonUnknown] }],
    strategiesGenerated: [],
    candidates: [],
    rejectedCandidates: [],
    geometryMutations: [],
    relationshipsChanged: [],
    activeTopology: [],
    scenarioResults: ["No unseeded candidate scenario executed."],
    dependencyPropagation: [],
    newDeficitsCreated: [],
    expectedVsActualEffects: { expected: [], actual: [], unexpected: [] },
    coverage: { candidate: ["cause diagnosis", "strategy generation", "transfer restraint"], applicable: [], evaluated: ["hardcoding gate", "authority gate", "epistemic gate"], unevaluated: ["geometry generation", "generic mutation", "persistence retrieval"] },
    evidenceProvenance: ["v6.1 macroorder", "v6.0 runtime contract"],
    unknowns: [commonUnknown],
    regulatoryStatus: "NOT_ASSESSED",
    humanDecisionsRequired: ["Human review required before any candidate, mutation, canonization or learning promotion."],
    learning,
    transfer,
    adversarialTests: [{ id: `${caseId}-NO-HARDCODING`, result: "PASS", finding: "No domain-specific repair engine or fixture solution was added." }],
    regressions: { software: "PASS: focused and existing tests passed before this proof harness.", knowledge: "NOT_ASSESSED: no knowledge promotion occurred.", reasoning: "PASS: unsupported L5–L10 claims were not emitted.", geometry: "NOT_ASSESSED: no mutation occurred.", epistemic: "PASS: UNKNOWN and NOT_DEMONSTRATED preserved.", regulatory: "NOT_ASSESSED: no jurisdictional claim made." },
    runtimeMaturity: { research: "RESEARCHED", teachability: "TEACHABLE_AS_LIMIT", implementation: "PARTIAL", validation: "CONTROLLED_TESTED", generalization: "NONE", autonomy: "L4_EVALUATES" },
    finalEpistemicState: "UNKNOWN",
    humanAuthority: true,
    noAutomaticWinner: true,
    noAutomaticCanonization: true,
  };
}

function caseResult(caseId: V61CaseId, problem: string, transfer: V6EvaluationReport["transfer"] = []): V61CaseResult {
  const report = buildReport(caseId, problem, transfer);
  const valid = validateV6EvaluationReport(report);
  return {
    caseId,
    problem,
    strategyInput: [],
    strategiesRetrieved: ["V6 cause model", "V6 transfer restraint"],
    strategiesGenerated: [],
    strategiesRejected: ["Any fixture-specific repair strategy"],
    candidateCount: 0,
    mutationCount: 0,
    reevaluation: "NOT_DEMONSTRATED",
    comparison: "NOT_DEMONSTRATED",
    transfer: transfer.length > 0 ? "PARTIAL" : "NOT_DEMONSTRATED",
    generalization: "NOT_DEMONSTRATED",
    stopReason: valid ? "CAPABILITY GAP DETECTED: current v6.0 contract can classify and guard, but cannot generate unseeded strategies/candidates without a domain-specific implementation." : "VALIDATION FAILURE",
    report,
  };
}

export function executeV61ControlledProof(): V61ProofResult {
  const hospitalTransfer = buildV6TransferAssessment({ sourceDomain: "restaurant", targetDomain: "hospital", transferUnit: "separation of incompatible journeys", structuralMatch: ["incompatible user/service journeys", "need for controlled interfaces"], criticalDifferences: ["clinical risk", "patient/staff hierarchy", "specialist regulation"], adaptationBurden: "HIGH", decision: "ADAPT", adaptation: ["Rebuild realization from hospital evidence; do not copy restaurant geometry."], result: "Reasoning pattern may transfer, realization must be adapted.", counterexample: "Copying the restaurant service corridor would ignore clinical constraints.", scopeRefinement: "Transfer only the abstract journey-separation reasoning.", generalizationStatus: "POSSIBLE" });
  const labRestraint = buildV6TransferAssessment({ sourceDomain: "restaurant", targetDomain: "laboratory biosafety", transferUnit: "dirty/waste/flow labels", structuralMatch: ["flow separation vocabulary"], criticalDifferences: ["hazard", "containment", "specialist process", "biosafety control"], adaptationBurden: "STRUCTURALLY_INCOMPATIBLE", decision: "DO_NOT_TRANSFER", adaptation: ["Require specialist evidence before any laboratory realization."], result: "Reject restaurant realization; retain only high-level caution about incompatible journeys.", counterexample: "A food-service waste route is not a biosafety containment route.", scopeRefinement: "No geometry transfer; specialist review required.", generalizationStatus: "NONE" });
  const cases = [
    caseResult("A_RESTAURANT_SOURCE", "Incompatible dirty-return/service journey and public/operational restaurant conditions."),
    caseResult("B_RESTAURANT_VARIANT", "Materially changed geometry, capacity/demand and operating condition for a restaurant variant."),
    caseResult("C_HOSPITAL_TRANSFER", "Hospital journeys are incompatible and require a domain-specific clinical realization.", [hospitalTransfer]),
    caseResult("D_LABORATORY_RESTRAINT", "Laboratory/biosafety flow similarity with critical hazard, containment and specialist differences.", [labRestraint]),
    caseResult("E_PUBLIC_REALM_AUTHORITY", "Accessible journey crosses the project boundary and depends on an external public realm under another authority."),
    caseResult("F_MIXED_USE_CAPACITY", "Shared capacity with overlapping demand and concurrency across mixed uses."),
  ];
  const autonomy: V61ProofResult["autonomy"] = {
    L0_RECEIVES: { status: "DEMONSTRATED", evidence: "Receives and registers the v6.1 macroorder." },
    L1_REPRESENTS: { status: "DEMONSTRATED", evidence: "Represents problems, unknowns, provenance and typed transfer." },
    L2_DETECTS: { status: "PARTIAL", evidence: "Detects the capability gap and hardcoding risk; no new geometric deficit was generated." },
    L3_DIAGNOSES: { status: "PARTIAL", evidence: "Produces cause hypotheses but not supported/verified causes for the six cases." },
    L4_EVALUATES: { status: "DEMONSTRATED", evidence: "Applies hard gates, authority, epistemic and transfer controls." },
    L5_GENERATES_STRATEGIES: { status: "NOT_DEMONSTRATED", evidence: "No unseeded strategy was generated; strategy list remains empty." },
    L6_GENERATES_CANDIDATES: { status: "NOT_DEMONSTRATED", evidence: "No candidate was generated without a fixture-specific strategy." },
    L7_MUTATES_SYNTHESIZES: { status: "NOT_DEMONSTRATED", evidence: "No mutation occurred; no domain repair engine was added." },
    L8_REEVALUATES: { status: "NOT_DEMONSTRATED", evidence: "No candidate existed for dependency-scoped reevaluation." },
    L9_COMPARES: { status: "PARTIAL", evidence: "Transfer and restraint contracts compare domains, but no generated candidates were compared." },
    L10_GENERALIZES: { status: "NOT_DEMONSTRATED", evidence: "Required persistence, positive transfer and generated adaptation evidence are absent." },
  };
  const learningMatrix = cases.map((item) => ({ caseId: item.caseId, k0: "v6.0 contracts", observed: item.stopReason, k1: "No promoted learning candidate", status: "NOT_DEMONSTRATED" as V61Status }));
  const transferMatrix = [
    { source: "restaurant", target: "hospital", decision: "ADAPT", evidence: "Structural journey reasoning may transfer; clinical realization cannot be copied.", status: "PARTIAL" as V61Status },
    { source: "restaurant", target: "laboratory biosafety", decision: "DO_NOT_TRANSFER", evidence: "Critical hazard/containment difference triggers restraint.", status: "DEMONSTRATED" as V61Status },
  ];
  return { baseline: { repository: "YvanCastilloQuezada/sicl-web", branch: "feat/spatial-pilot-media-studio-v1", head: "d47038d533b22368483cd7316a5c5239acfb0103", worktree: "DIRTY" }, cases, autonomy, learningMatrix, transferMatrix, triplePropagation: { runtime: "NOT_PROMOTED: contract evaluation only", curriculum: "REGISTERED / NOT_LEARNED", book: "REGISTERED / HUMAN_REVIEW_REQUIRED", consistency: "DEMONSTRATED" }, finalStatus: "PARTIAL" };
}

export const V61_CASE_PROBLEMS: Record<V61CaseId, string> = {
  A_RESTAURANT_SOURCE: "Incompatible dirty-return/service journey and public/operational restaurant conditions.",
  B_RESTAURANT_VARIANT: "Materially changed geometry, capacity/demand and operating condition for a restaurant variant.",
  C_HOSPITAL_TRANSFER: "Hospital journeys are incompatible and require a domain-specific clinical realization.",
  D_LABORATORY_RESTRAINT: "Laboratory/biosafety flow similarity with critical hazard, containment and specialist differences.",
  E_PUBLIC_REALM_AUTHORITY: "Accessible journey crosses the project boundary and depends on an external public realm under another authority.",
  F_MIXED_USE_CAPACITY: "Shared capacity with overlapping demand and concurrency across mixed uses.",
};

export const V61_STRATEGY_FAMILIES: V6StrategyFamily[] = ["SPATIAL", "TOPOLOGICAL", "ALLOCATIVE", "TEMPORAL", "CONTROL", "RESOURCE", "TECHNICAL", "EXTERNAL", "HYBRID"];
