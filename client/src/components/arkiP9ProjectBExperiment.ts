import {
  assertP9ProjectIsolation,
  classifyP9LearningCandidate,
  createP9K0Snapshot,
  evaluateP9PostHoc,
  freezeP9BlindResult,
  validateP9InputContract,
  type P9InputContractResult,
  type P9K0Snapshot,
  type P9LedgerEntry,
} from "./arkiP9BlindProjectProtocol";
import { buildP9CleanBoundary } from "./arkiP9BlindProjectProtocol";
import type { IntegratedProjectInput } from "./arkiIntegratedPracticeBoundary";

export const PROJECT_B_ID = "PROJECT-B-COASTAL-MAKER-REFUGE-001";

export const PROJECT_B_INPUTS: IntegratedProjectInput[] = [
  { id: "B-client-purpose", kind: "CLIENT_FACT", statement: "The client wants a public community facility for repair learning, mutual aid and ordinary community use.", state: "PROJECT_FACT", sourceRefs: ["project-b-client-brief"] },
  { id: "B-site-condition", kind: "SITE_FACT", statement: "The site is in a coastal settlement; exact survey, orientation and soil data are not supplied.", state: "PROJECT_FACT", sourceRefs: ["project-b-site-brief"] },
  { id: "B-objective", kind: "OBJECTIVE", statement: "Support learning, repair, gathering and safe exit for changing groups of users.", state: "HUMAN_CONFIRMED", sourceRefs: ["project-b-client-brief"] },
  { id: "B-hard-boundary", kind: "HARD_CONSTRAINT", statement: "The proposal must remain at controlled schematic-design scale and must not claim permit or construction readiness.", state: "HUMAN_CONFIRMED", sourceRefs: ["p9-experimental-governance"] },
  { id: "B-unknown-capacity", kind: "UNKNOWN", statement: "Peak occupancy, staffing, equipment inventory and event profile are unknown.", state: "UNKNOWN", sourceRefs: ["project-b-unknown-ledger"] },
  { id: "B-unknown-regulation", kind: "UNKNOWN", statement: "Jurisdiction, applicable regulatory edition and specialist life-safety requirements are unknown.", state: "UNKNOWN", sourceRefs: ["project-b-unknown-ledger"] },
];

export type ProjectBBlindResult = Readonly<{
  projectId: string;
  boundary: ReturnType<typeof buildP9CleanBoundary>;
  inputContract: P9InputContractResult;
  isolation: ReturnType<typeof assertP9ProjectIsolation>;
  k0: P9K0Snapshot;
  ledger: ReadonlyArray<P9LedgerEntry>;
  semanticProgram: ReadonlyArray<{ id: string; activity: string; requiredEvidence: string[]; state: "DERIVED" | "UNKNOWN" }>;
  candidateTopologies: ReadonlyArray<{ id: string; relations: string[]; state: "HYPOTHESIS"; humanReviewRequired: true }>;
  geometry: { state: "NOT_EXECUTED"; reason: string };
  decision: "HUMAN_DECISION_REQUIRED";
  k1Created: false;
  automaticWinner: "NONE";
}>;

function buildK0(): P9K0Snapshot {
  return createP9K0Snapshot(PROJECT_B_ID, [
    { id: "K0-general-architecture", bucket: "ALREADY_KNOWN", statement: "General architectural and functional reasoning exists before Project B.", sourceRefs: ["P9-K0-baseline"] },
    { id: "K0-project-inputs", bucket: "SUPPLIED_AS_INPUT", statement: "Only the frozen Project B input contract is supplied.", sourceRefs: ["project-b-input-freeze"] },
    { id: "K0-project-solution", bucket: "UNKNOWN", statement: "Project B solution, strategy, candidate and geometry are unknown.", sourceRefs: ["project-b-unknown-ledger"] },
    { id: "K0-learning", bucket: "UNKNOWN", statement: "No Project B learning event is known before execution.", sourceRefs: ["p9-learning-boundary"] },
  ]);
}

function buildBlindProgram(): ProjectBBlindResult["semanticProgram"] {
  return [
    { id: "ACT-LEARN", activity: "repair and learn", requiredEvidence: ["equipment and group size", "safe movement", "daylight/ventilation context"], state: "DERIVED" },
    { id: "ACT-GATHER", activity: "gather and exchange", requiredEvidence: ["occupancy and event profile", "acoustic expectations", "accessible arrival"], state: "DERIVED" },
    { id: "ACT-SUPPORT", activity: "staff, storage and support", requiredEvidence: ["service sequence", "storage demand", "waste and delivery conditions"], state: "DERIVED" },
    { id: "ACT-EXIT", activity: "ordinary and emergency exit", requiredEvidence: ["jurisdiction", "occupancy load", "egress and fire specialist review"], state: "UNKNOWN" },
  ];
}

function buildBlindTopologies(): ProjectBBlindResult["candidateTopologies"] {
  return [
    { id: "B-CANDIDATE-01", relations: ["arrival→shared threshold", "shared threshold→learning", "learning↔gathering", "support→learning: controlled", "exit→all public zones"], state: "HYPOTHESIS", humanReviewRequired: true },
    { id: "B-CANDIDATE-02", relations: ["arrival→gathering", "gathering→learning", "support→learning: separated", "support→storage", "exit→all public zones"], state: "HYPOTHESIS", humanReviewRequired: true },
  ];
}

function buildLedger(): P9LedgerEntry[] {
  return [
    { id: "B-L1", kind: "K0", bucket: "ALREADY_KNOWN", statement: "K0 frozen before blind execution.", sourceRefs: ["K0:PROJECT-B-COASTAL-MAKER-REFUGE-001"], phase: "BLIND_EXECUTION" },
    { id: "B-L2", kind: "INPUT", bucket: "SUPPLIED_AS_INPUT", statement: "Client, site, objective, hard boundary and unknowns received.", sourceRefs: PROJECT_B_INPUTS.flatMap((input) => input.sourceRefs), phase: "BLIND_EXECUTION" },
    { id: "B-L3", kind: "DERIVATION", bucket: "INFERRED_FROM_K0", statement: "Activities and relational requirements derived without selecting a geometry.", sourceRefs: ["B-L2", "P9-general-functional-reasoning"], phase: "BLIND_EXECUTION" },
    { id: "B-L4", kind: "CANDIDATE", bucket: "NOVEL_CANDIDATE", statement: "Two schematic topology hypotheses generated for human review.", sourceRefs: ["B-L3"], phase: "BLIND_EXECUTION" },
    { id: "B-L5", kind: "UNKNOWN", bucket: "UNKNOWN", statement: "Capacity, jurisdiction, exact site geometry, engineering and compliance remain unknown.", sourceRefs: ["B-L2"], phase: "BLIND_EXECUTION" },
  ];
}

export function runProjectBBlind(): ProjectBBlindResult {
  const boundary = buildP9CleanBoundary(PROJECT_B_ID, PROJECT_B_INPUTS);
  const inputContract = validateP9InputContract(PROJECT_B_INPUTS);
  const isolation = assertP9ProjectIsolation(PROJECT_B_ID, ["docs/ARKI-P9.0-BLIND-UNSEEN-PROJECT-PROTOCOL-2026-09-19.md", "general-architectural-knowledge", "UPAO-001-historical-fixture-excluded"]);
  const k0 = buildK0();
  const result = {
    projectId: PROJECT_B_ID,
    boundary,
    inputContract,
    isolation,
    k0,
    ledger: buildLedger(),
    semanticProgram: buildBlindProgram(),
    candidateTopologies: buildBlindTopologies(),
    geometry: { state: "NOT_EXECUTED" as const, reason: "P9 Phase A produces semantic candidates; no preferred geometry or construction-ready claim is authorized." },
    decision: "HUMAN_DECISION_REQUIRED" as const,
    k1Created: false as const,
    automaticWinner: "NONE" as const,
  };
  return freezeP9BlindResult(result);
}

export function evaluateProjectBPostHoc(blind: ProjectBBlindResult) {
  return evaluateP9PostHoc(blind, (frozen) => ({
    phase: "POST_HOC_EVALUATION",
    inputFreeze: frozen.k0.frozen && frozen.k0.k1Created === false ? "PASS" : "FAIL",
    noAnswerKey: frozen.boundary.excludedSolutionFields.length > 0 && frozen.inputContract.solutionFieldsDetected.length === 0 ? "PASS" : "FAIL",
    publicServiceRelationship: frozen.candidateTopologies.every((candidate) => candidate.relations.some((relation) => relation.includes("support→learning"))) ? "PASS_WITH_OBSERVATIONS" : "UNKNOWN",
    hardConstraint: frozen.geometry.state === "NOT_EXECUTED" ? "PASS_WITH_OBSERVATIONS" : "UNKNOWN",
    capacity: "INSUFFICIENT_EVIDENCE",
    regulatoryApplicability: "SPECIALIST_INPUT_REQUIRED",
    geometry: "NOT_EXECUTED",
    humanAuthority: frozen.decision === "HUMAN_DECISION_REQUIRED" ? "PASS" : "FAIL",
    learningCandidate: classifyP9LearningCandidate({ inK0: false, supplied: false, directExecutionResult: true, simpleRetrieval: false, fixtureOracle: false, architecturallyMeaningful: true, traceableToEvidence: true }),
    acceptance: "OBSERVATION_ONLY_NO_K1",
  }));
}

export function challengeProjectBObservation() {
  return {
    repetition: "PENDING_NEXT_AUTHORIZED_RUN",
    variant: "PENDING_NEXT_AUTHORIZED_RUN",
    counterexample: "PENDING_NEXT_AUTHORIZED_RUN",
    transfer: "NOT_RUN_IN_P9.0",
    fixationCheck: "NOT_RUN_IN_P9.0",
    candidateStatus: "OBSERVATION_ONLY",
    k1Created: false,
  } as const;
}
