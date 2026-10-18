import { createCleanProjectBoundary, type IntegratedInputKind, type IntegratedProjectInput } from "./arkiIntegratedPracticeBoundary";

export type P9KnowledgeBucket = "ALREADY_KNOWN" | "SUPPLIED_AS_INPUT" | "RETRIEVED" | "DIRECT_EXECUTION_RESULT" | "INFERRED_FROM_K0" | "NOVEL_CANDIDATE" | "UNKNOWN";
export type P9LedgerKind = "K0" | "INPUT" | "UNKNOWN" | "DERIVATION" | "RETRIEVAL" | "DEFICIT" | "CAUSE" | "STRATEGY" | "CANDIDATE" | "MUTATION" | "OBSERVATION" | "EXPECTED_EFFECT" | "ACTUAL_EFFECT" | "DEPENDENCY" | "NEW_DEFICIT" | "HUMAN_DECISION" | "SPECIALIST_DEPENDENCY" | "LEARNING_CANDIDATE" | "REJECTION" | "COUNTEREXAMPLE" | "K1";

export type P9K0Snapshot = Readonly<{
  snapshotId: string;
  projectId: string;
  createdAt: string;
  entries: ReadonlyArray<Readonly<{ id: string; bucket: P9KnowledgeBucket; statement: string; sourceRefs: ReadonlyArray<string> }>>;
  frozen: true;
  k1Created: false;
  provenance: ReadonlyArray<string>;
}>;

export type P9LedgerEntry = Readonly<{
  id: string;
  kind: P9LedgerKind;
  bucket: P9KnowledgeBucket;
  statement: string;
  sourceRefs: ReadonlyArray<string>;
  phase: "BLIND_EXECUTION" | "POST_HOC_EVALUATION";
}>;

export type P9InputContractResult = {
  valid: boolean;
  accepted: IntegratedInputKind[];
  rejected: Array<{ id: string; reason: string }>;
  provenanceComplete: boolean;
  solutionFieldsDetected: string[];
};

export const P9_SOLUTION_FIELDS = ["preferredParti", "expectedZoning", "desiredGeometry", "expectedDeficit", "expectedCause", "preferredAlternative", "answerKey", "expectedStrategy", "expectedCandidate", "expectedWinner", "expectedLearningRule"] as const;

function stableSnapshotId(projectId: string, entries: P9K0Snapshot["entries"]): string {
  return `K0:${projectId}:${entries.map((entry) => `${entry.id}:${entry.bucket}:${entry.statement}`).join("|").length}`;
}

export function createP9K0Snapshot(projectId: string, entries: P9K0Snapshot["entries"], createdAt = "P9-PREPROJECT-UTC"): P9K0Snapshot {
  const frozenEntries = entries.map((entry) => Object.freeze({ ...entry, sourceRefs: Object.freeze([...entry.sourceRefs]) }));
  return Object.freeze({
    snapshotId: stableSnapshotId(projectId, frozenEntries),
    projectId,
    createdAt,
    entries: Object.freeze(frozenEntries),
    frozen: true,
    k1Created: false,
    provenance: Object.freeze(["P9.0 K0 freeze", "Created before Project B", "No Project B facts included"]),
  });
}

export function assertP9ProjectIsolation(projectId: string, artifacts: ReadonlyArray<string>): { isolated: boolean; matches: string[]; status: "CLEAN" | "INVALID_CONTAMINATED" } {
  const matches = artifacts.filter((artifact) => artifact.includes(projectId));
  return { isolated: matches.length === 0, matches, status: matches.length === 0 ? "CLEAN" : "INVALID_CONTAMINATED" };
}

export function validateP9InputContract(inputs: ReadonlyArray<IntegratedProjectInput>): P9InputContractResult {
  const acceptedKinds: IntegratedInputKind[] = ["CLIENT_FACT", "SITE_FACT", "OBJECTIVE", "HARD_CONSTRAINT", "PREFERENCE", "REGULATORY_SOURCE", "UNKNOWN", "HUMAN_DECISION"];
  const accepted: IntegratedInputKind[] = [];
  const rejected: Array<{ id: string; reason: string }> = [];
  const solutionFieldsDetected: string[] = [];
  for (const input of inputs) {
    const fieldHits = P9_SOLUTION_FIELDS.filter((field) => input.statement.includes(field) || input.id.includes(field));
    if (!acceptedKinds.includes(input.kind)) rejected.push({ id: input.id, reason: "Input kind is not permitted by P9." });
    if (fieldHits.length) solutionFieldsDetected.push(...fieldHits);
    if (!input.sourceRefs.length) rejected.push({ id: input.id, reason: "Every Project B input requires provenance." });
    if (acceptedKinds.includes(input.kind) && !fieldHits.length && input.sourceRefs.length) accepted.push(input.kind);
  }
  return { valid: rejected.length === 0 && solutionFieldsDetected.length === 0, accepted, rejected, provenanceComplete: inputs.every((input) => input.sourceRefs.length > 0), solutionFieldsDetected: Array.from(new Set(solutionFieldsDetected)) };
}

export function freezeP9BlindResult<T extends object>(result: T): Readonly<T> {
  return Object.freeze({ ...result });
}

export function evaluateP9PostHoc<T extends object>(blindResult: Readonly<T>, evaluator: (frozenResult: Readonly<T>) => Record<string, unknown>): Readonly<T & { postHoc: Record<string, unknown> }> {
  return Object.freeze({ ...blindResult, postHoc: evaluator(blindResult) });
}

export function classifyP9LearningCandidate(input: { inK0: boolean; supplied: boolean; directExecutionResult: boolean; simpleRetrieval: boolean; fixtureOracle: boolean; architecturallyMeaningful: boolean; traceableToEvidence: boolean }): "LEARNING_CANDIDATE" | "OBSERVATION_ONLY" | "UNKNOWN" {
  if (input.inK0 || input.supplied || input.directExecutionResult || input.simpleRetrieval || input.fixtureOracle) return "OBSERVATION_ONLY";
  if (input.architecturallyMeaningful && input.traceableToEvidence) return "LEARNING_CANDIDATE";
  return "UNKNOWN";
}

export function buildP9Protocol() {
  return {
    status: "READY_FOR_PROJECT_B" as const,
    p8FrozenBaseline: "2814be085f1e75c12c9ee7cbfdc780af11341720",
    projectB: "NOT_CREATED",
    projectC: "NOT_CREATED",
    k0: "DEFINED_BEFORE_PROJECT_B",
    blindRun: "PHASE_A_FROZEN_BEFORE_POST_HOC_EVALUATION",
    postHocEvaluation: "PHASE_B_SEPARATED_FROM_PHASE_A",
    learning: "OBSERVED_NOT_REQUESTED",
    k1: "NOT_CREATED",
    secondEngine: "FORBIDDEN",
    humanAuthority: "PRESERVED",
    specialistBoundary: "P8.2_SEMANTICS_REUSED",
    noArchitecturalAnswerKey: true,
    noExpectedGeometry: true,
    noAutomaticWinner: true,
  };
}

export function buildP9CleanBoundary(projectId: string, inputs: ReadonlyArray<IntegratedProjectInput>) {
  return createCleanProjectBoundary(projectId, [...inputs]);
}
