import type {
  Applicability,
  EpistemicStatus,
  EvidenceRecord,
  ProvenanceRecord,
  UnitValue,
} from "./arkiSharedFoundation";

export const CAPABILITY_INPUT_SCHEMA = "ARKI-CAPABILITY-INPUT-BASE-1.0" as const;
export const CAPABILITY_OUTPUT_SCHEMA = "ARKI-CAPABILITY-OUTPUT-BASE-1.0" as const;

export type RequestContextIdentity = Readonly<{
  requestId: string;
  actorId: string;
  sessionId?: string;
  requestedAt: string;
}>;

export type CapabilityInputBase = Readonly<{
  schema: typeof CAPABILITY_INPUT_SCHEMA;
  context: RequestContextIdentity;
  project?: Readonly<{ projectId: string; projectVersion?: string; snapshotId?: string }>;
  entityRefs?: readonly string[];
  epistemic: EpistemicStatus;
  evidenceRefs: readonly string[];
  provenance: readonly ProvenanceRecord[];
  units?: readonly UnitValue[];
  applicability?: Applicability;
  time?: Readonly<{ effectiveAt: string; phase?: string; durationSeconds?: number }>;
  scenario?: string;
  source?: Readonly<{ system: string; version: string; sourceId?: string }>;
  unknowns: readonly string[];
  humanAuthority: Readonly<{ required: boolean; decisionId?: string }>;
}>;

export type CapabilityResultType = "VALUE" | "ENTITY_SET" | "GRAPH" | "DOCUMENT" | "ASSESSMENT" | "PROPOSAL" | "NO_RESULT";

export type CapabilityOutputBase<TResult = unknown> = Readonly<{
  schema: typeof CAPABILITY_OUTPUT_SCHEMA;
  capabilityId: string;
  result: TResult;
  resultType: CapabilityResultType;
  affectedEntityRefs: readonly string[];
  epistemic: EpistemicStatus;
  evidence: readonly EvidenceRecord[];
  provenance: readonly ProvenanceRecord[];
  units?: readonly UnitValue[];
  assumptions: readonly string[];
  unknowns: readonly string[];
  limitations: readonly string[];
  confidence?: number;
  professionalValidationRequired: boolean;
  invalidatedDependencyRefs: readonly string[];
  candidateActions: readonly string[];
  canonicalMutationRequested: false;
}>;

export function validateCapabilityInput(input: CapabilityInputBase): void {
  if (input.schema !== CAPABILITY_INPUT_SCHEMA) throw new Error("CAPABILITY_INPUT_SCHEMA_MISMATCH");
  if (!input.context.requestId || !input.context.actorId || !input.context.requestedAt) throw new Error("INPUT_CONTEXT_REQUIRED");
  if (input.epistemic.truth === "FACT" && input.evidenceRefs.length === 0) throw new Error("FACT_INPUT_REQUIRES_EVIDENCE");
  if (input.unknowns.length > 0 && !input.humanAuthority.required) throw new Error("UNKNOWN_INPUT_REQUIRES_HUMAN_AUTHORITY");
  for (const unit of input.units ?? []) {
    if (!Number.isFinite(unit.value) || !unit.unit || !unit.dimension) throw new Error("INVALID_INPUT_UNIT");
  }
}

export function createCapabilityOutput<TResult>(input: Omit<CapabilityOutputBase<TResult>, "schema" | "canonicalMutationRequested">): CapabilityOutputBase<TResult> {
  if (input.confidence !== undefined && (input.confidence < 0 || input.confidence > 1)) throw new Error("INVALID_CONFIDENCE");
  return { ...input, schema: CAPABILITY_OUTPUT_SCHEMA, canonicalMutationRequested: false };
}

export function assertCapabilityOutputIsNotCommit(output: CapabilityOutputBase): void {
  if (output.canonicalMutationRequested !== false) throw new Error("CAPABILITY_OUTPUT_CANNOT_COMMIT");
}

export const CAPABILITY_CONTRACT_FIREWALL = Object.freeze({
  canonicalMutationRequestedDefault: false,
  directCanonicalCommit: false,
  selfApproval: false,
  humanAuthorityBypass: false,
  arbitraryExecution: false,
});

export type CapabilityInputExtension<T extends object = object> = CapabilityInputBase & T;
export type CapabilityOutputExtension<TResult = unknown, T extends object = object> = CapabilityOutputBase<TResult> & T;
