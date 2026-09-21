import { executeArchitecturalReasoning, type ArchitecturalReasoningInput } from "./arkiD62ReasoningHarness";
import { executeProjectBrainWave1, type ProjectBrainInput } from "./arkiProjectBrain";
import { appendCoreReasoningExecution, fetchCanonicalSnapshot, hasCoreUrl, type CanonicalCoreSnapshot } from "./coreHttpClient";
import { parseSnapshot, type SiclSnapshot } from "./siclCore";

export type CanonicalExecutionInput = ProjectBrainInput & {
  brainExecutionId: string;
  d62ExecutionId: string;
  requestedReasoningDepth: ArchitecturalReasoningInput["requestedReasoningDepth"];
  seed?: string;
  perturbations?: ArchitecturalReasoningInput["perturbations"];
  failures?: ArchitecturalReasoningInput["failures"];
  counterexamples?: ArchitecturalReasoningInput["counterexamples"];
};

export type CanonicalExecutionResult = {
  status: "EXECUTED";
  projectId: string;
  brain: ReturnType<typeof executeProjectBrainWave1>;
  d62: ReturnType<typeof executeArchitecturalReasoning>;
  brainCommit: Record<string, unknown>;
  d62Commit: Record<string, unknown>;
  versions: { initial: number | null; afterBrain: number | null; afterD62: number | null };
  persistence: "CANONICAL_CORE";
  humanAuthority: "FINAL";
  promotion: "HUMAN_REVIEW_REQUIRED";
};

function snapshotFromCanonical(canonical: CanonicalCoreSnapshot, projectId: string): { snapshot: SiclSnapshot; version: number } {
  if (canonical.project_id !== projectId) throw new Error("CORE_PROJECT_ID_MISMATCH");
  if (!Number.isInteger(canonical.observed_version) || (canonical.observed_version as number) < 0) throw new Error("CORE_VERSION_INVALID");
  return { snapshot: parseSnapshot(JSON.stringify(canonical.snapshot)), version: canonical.observed_version as number };
}

function requireCanonicalSnapshot(value: CanonicalCoreSnapshot | { not_found: true; detail?: string } | undefined, projectId: string): { snapshot: SiclSnapshot; version: number } {
  if (!value) throw new Error("CORE_CANONICAL_SNAPSHOT_REQUIRED");
  if ("not_found" in value) throw new Error(value.detail ?? "CORE_PROJECT_NOT_FOUND");
  return snapshotFromCanonical(value, projectId);
}

export async function executeCanonicalBrainAndD62(input: CanonicalExecutionInput): Promise<CanonicalExecutionResult> {
  if (!hasCoreUrl()) throw new Error("SICL_CORE_URL is required");
  const initialCanonical = await fetchCanonicalSnapshot(input.projectId);
  const initial = requireCanonicalSnapshot(initialCanonical, input.projectId);

  const brainInput: ProjectBrainInput = {
    projectId: input.projectId,
    name: input.name,
    typology: input.typology,
    brief: input.brief,
    location: input.location,
    jurisdiction: input.jurisdiction,
    site: input.site,
    knownFacts: input.knownFacts,
    assumptions: input.assumptions,
    unknowns: input.unknowns,
    conflicts: input.conflicts,
    requirements: input.requirements,
    objectives: input.objectives,
    constraints: input.constraints,
    preferences: input.preferences,
    activities: input.activities,
    relationships: input.relationships,
    capacities: input.capacities,
    stakeholders: input.stakeholders,
    sourceIds: input.sourceIds,
  };
  const brain = executeProjectBrainWave1(brainInput);
  const brainCommit = await appendCoreReasoningExecution(input.projectId, {
    execution_id: input.brainExecutionId,
    engine: "ARKI-PROJECT-BRAIN-WAVE-1",
    runtime_version: "ARKI-PROJECT-BRAIN-WAVE-1",
    expected_project_version: initial.version,
    input: brainInput,
    output: brain,
    epistemic_status: "AI_PROPOSED",
    human_review_required: true,
    promotion: "HUMAN_REVIEW_REQUIRED",
  });
  const afterBrain = Number(brainCommit.observed_version);
  if (!Number.isInteger(afterBrain) || afterBrain < initial.version) throw new Error("CORE_BRAIN_COMMIT_VERSION_INVALID");

  const refreshedCanonical = await fetchCanonicalSnapshot(input.projectId);
  const refreshed = requireCanonicalSnapshot(refreshedCanonical, input.projectId);
  if (refreshed.version !== afterBrain) throw new Error("CORE_VERSION_CHANGED_AFTER_BRAIN_COMMIT");

  const d62Input: ArchitecturalReasoningInput = {
    executionId: input.d62ExecutionId,
    projectId: input.projectId,
    brief: input.brief,
    context: { ...(input.site ?? {}), typology: input.typology, location: input.location, jurisdiction: input.jurisdiction, activities: input.activities },
    constraints: input.constraints ?? [],
    knownFacts: input.knownFacts,
    unknowns: input.unknowns,
    requestedReasoningDepth: input.requestedReasoningDepth,
    seed: input.seed,
    perturbations: input.perturbations,
    failures: input.failures,
    counterexamples: input.counterexamples,
  };
  const d62 = executeArchitecturalReasoning(d62Input, refreshed.snapshot, refreshed.version, "ARKI-L2-TRANSFER-1.0");
  const d62Commit = await appendCoreReasoningExecution(input.projectId, {
    execution_id: input.d62ExecutionId,
    engine: "ARKI-D6.2-M",
    runtime_version: "ARKI-L2-TRANSFER-1.0",
    expected_project_version: refreshed.version,
    input: d62Input,
    output: d62,
    core_knowledge_version: refreshed.version,
    replay_fingerprint: d62.replayFingerprint,
    epistemic_status: "AI_PROPOSED",
    human_review_required: true,
    promotion: "HUMAN_REVIEW_REQUIRED",
  });
  const afterD62 = Number(d62Commit.observed_version);
  if (!Number.isInteger(afterD62) || afterD62 < refreshed.version) throw new Error("CORE_D62_COMMIT_VERSION_INVALID");

  return { status: "EXECUTED", projectId: input.projectId, brain, d62, brainCommit, d62Commit, versions: { initial: initial.version, afterBrain, afterD62 }, persistence: "CANONICAL_CORE", humanAuthority: "FINAL", promotion: "HUMAN_REVIEW_REQUIRED" };
}
