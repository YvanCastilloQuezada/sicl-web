import { createRelationship, RelationshipFabric, type RelationshipRecord } from "./arkiRelationshipFabric";
import type { ConstraintEvaluation, ConstraintEvaluationContext, ConstraintRecord, PrimitiveValue } from "./arkiConstraintEngine";
import type { RegenerationChangeSet, RegenerationContext, RegenerationPlan, RegenerationResult, RegenerationTrace } from "./arkiRegenerationEngine";
import { createTransactionRevision, validateMutationRecord, type JsonObject, type JsonValue, type MutationRecord, type TransactionRevision } from "./arkiTransactionEngine";

export const BKH4_SIMULATION_SCHEMA_VERSION = "1.0" as const;
export type SimulationExecutionStatus = "COMPLETED" | "INVALID" | "UNKNOWN" | "STALE" | "BLOCKED" | "FAILED";
export type SimulationEpistemicState = "PROPOSED" | "COMPUTED" | "VERIFIED" | "UNKNOWN";
export type SimulationConsequenceKind = "DIRECT_MUTATION" | "RELATIONSHIP_IMPACT" | "CONSTRAINT_CONSEQUENCE" | "REGENERATED_CONSEQUENCE" | "DERIVED_CONSEQUENCE" | "UNKNOWN_CONSEQUENCE";
export type SimulationCanonicalState = {
  projectVersion: string;
  entities: Readonly<Record<string, JsonObject>>;
  relationships: readonly RelationshipRecord[];
  derivedState?: Readonly<Record<string, JsonValue>>;
};
export type SimulationContext = {
  transactionId: string;
  transactionRevisionId: string;
  baseProjectVersion: string;
  simulationId: string;
  simulationContextRevision: string;
  regenerationContext: RegenerationContext;
  relevantDatasets: Readonly<Record<string, string>>;
  units: Readonly<Record<string, string>>;
  tolerances: Readonly<Record<string, number>>;
  applicableEvidence: readonly string[];
  epistemicState: SimulationEpistemicState;
  provenance: { source: string; actorId: string; transformations: string[]; evidenceRefs: string[] };
};
export type AppliedMutationResult = { mutationId: string; operation: MutationRecord["operation"]; targetEntityId: string; status: "APPLIED" | "REJECTED"; reason?: string };
export type SimulationConsequence = { kind: SimulationConsequenceKind; id: string; sourceIds: string[]; status: "KNOWN" | "UNKNOWN"; detail: string };
export type SimulationRelationshipImpact = { affectedRelationshipIds: string[]; affectedEntityIds: string[]; unknowns: string[]; reusedFabric: true };
export type SimulationRegenerationAdapter = {
  buildPlan: (input: { changes: readonly RegenerationChangeSet[]; context: RegenerationContext }) => RegenerationPlan;
  executePlan: (input: { plan: RegenerationPlan; changes: readonly RegenerationChangeSet[]; context: RegenerationContext }) => { result: RegenerationResult; trace: RegenerationTrace };
};
export type SimulationConstraintAdapter = (constraint: ConstraintRecord, context: ConstraintEvaluationContext) => ConstraintEvaluation;
export type SimulationRequest = {
  canonicalState: SimulationCanonicalState;
  transactionRevision: TransactionRevision;
  context: SimulationContext;
  constraints?: readonly ConstraintRecord[];
  constraintContext?: ConstraintEvaluationContext;
  evaluateConstraint?: SimulationConstraintAdapter;
  regeneration?: SimulationRegenerationAdapter;
  changes?: readonly RegenerationChangeSet[];
};
export type SimulationResult = {
  schemaVersion: typeof BKH4_SIMULATION_SCHEMA_VERSION;
  simulationId: string;
  transactionId: string;
  transactionRevisionId: string;
  baseProjectVersion: string;
  executionStatus: SimulationExecutionStatus;
  canonicalStateBeforeFingerprint: string;
  canonicalStateAfterFingerprint: string;
  simulatedStateFingerprint?: string;
  appliedMutationResults: readonly AppliedMutationResult[];
  relationshipImpact: SimulationRelationshipImpact;
  constraintResults: readonly ConstraintEvaluation[];
  regenerationResults?: { result: RegenerationResult; trace: RegenerationTrace };
  derivedConsequences: readonly SimulationConsequence[];
  unknowns: readonly string[];
  warnings: readonly string[];
  errors: readonly string[];
  provenance: SimulationContext["provenance"];
  humanDecisionRequired: boolean;
  canonicalMutation: false;
  canonicalVersionChanged: false;
};

type MutableJsonObject = { [key: string]: JsonValue };
type MutableState = { projectVersion: string; entities: Record<string, MutableJsonObject>; relationships: RelationshipRecord[]; derivedState: Record<string, JsonValue> };
const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const stableJson = (value: unknown): string => { if (value === null || typeof value !== "object") return JSON.stringify(value); if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`; const record = value as Record<string, unknown>; return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`; };
const hash = (value: string): string => { let result = 2166136261; for (let index = 0; index < value.length; index += 1) { result ^= value.charCodeAt(index); result = Math.imul(result, 16777619); } return (result >>> 0).toString(16).padStart(8, "0"); };
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const stateFingerprint = (state: SimulationCanonicalState | MutableState): string => `state:${hash(stableJson({ projectVersion: state.projectVersion, entities: state.entities, relationships: state.relationships, derivedState: state.derivedState ?? {} }))}`;
const mutationValue = (value: JsonValue | undefined): JsonValue => value === undefined ? null : value;
const requireEntity = (state: MutableState, entityId: string): MutableJsonObject => { const entity = state.entities[entityId]; if (!entity) throw new Error(`MISSING_DEPENDENCY: entity ${entityId}`); return entity; };

const applyMutation = (state: MutableState, mutation: MutationRecord): AppliedMutationResult => {
  const entityId = mutation.target.entityId;
  if (mutation.operation === "CREATE_ENTITY") {
    if (state.entities[entityId]) throw new Error(`INVALID_INPUT: entity ${entityId} already exists`);
    state.entities[entityId] = clone(mutation.proposedAfter as JsonObject);
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  if (mutation.operation === "UPDATE_PROPERTY") {
    const entity = requireEntity(state, entityId);
    const path = mutation.target.propertyPath as string;
    const before = entity[path];
    if (stableJson(before) !== stableJson(mutation.before)) throw new Error(`STALE: expected property ${path} revision differs`);
    entity[path] = clone(mutation.proposedAfter as JsonValue);
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  if (mutation.operation === "UPDATE_PARAMETER") {
    const entity = requireEntity(state, entityId);
    const parameterId = mutation.target.parameterId as string;
    const parameters = isRecord(entity.parameters) ? entity.parameters as Record<string, JsonValue> : {};
    if (stableJson(parameters[parameterId]) !== stableJson(mutation.before)) throw new Error(`STALE: expected parameter ${parameterId} revision differs`);
    parameters[parameterId] = clone(mutation.proposedAfter as JsonValue); entity.parameters = parameters;
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  if (mutation.operation === "MOVE_ENTITY") {
    const entity = requireEntity(state, entityId); if (!isRecord(mutation.proposedAfter)) throw new Error("INVALID_INPUT: move coordinates");
    entity.position = clone(mutation.proposedAfter as JsonObject);
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  if (mutation.operation === "DELETE_ENTITY") {
    requireEntity(state, entityId); delete state.entities[entityId];
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  if (mutation.operation === "ADD_RELATIONSHIP") {
    if (!isRecord(mutation.proposedAfter)) throw new Error("INVALID_INPUT: relationship payload");
    const relation = createRelationship(mutation.proposedAfter as unknown as Omit<RelationshipRecord, "relationshipId" | "relationshipRevisionId" | "family">);
    state.relationships.push(relation);
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  if (mutation.operation === "REMOVE_RELATIONSHIP") {
    const relationshipId = mutation.target.relationshipId as string;
    const before = state.relationships.length; state.relationships = state.relationships.filter((relation) => relation.relationshipId !== relationshipId);
    if (before === state.relationships.length) throw new Error(`MISSING_DEPENDENCY: relationship ${relationshipId}`);
    return { mutationId: mutation.mutationId, operation: mutation.operation, targetEntityId: entityId, status: "APPLIED" };
  }
  throw new Error(`INVALID_INPUT: unsupported operation ${mutation.operation}`);
};

export const simulationSemanticFingerprint = (result: SimulationResult): string => hash(stableJson({ simulationId: "excluded", executionStatus: result.executionStatus, baseProjectVersion: result.baseProjectVersion, simulatedStateFingerprint: result.simulatedStateFingerprint, appliedMutationResults: result.appliedMutationResults, relationshipImpact: result.relationshipImpact, constraintResults: result.constraintResults, regenerationResults: result.regenerationResults?.result, derivedConsequences: result.derivedConsequences, unknowns: result.unknowns, warnings: result.warnings, errors: result.errors, humanDecisionRequired: result.humanDecisionRequired }));

export const simulateTransaction = (request: SimulationRequest): SimulationResult => {
  const canonicalBefore = stateFingerprint(request.canonicalState);
  const base = request.canonicalState.projectVersion;
  const revision = createTransactionRevision(request.transactionRevision);
  const baseResult = { schemaVersion: BKH4_SIMULATION_SCHEMA_VERSION, simulationId: request.context.simulationId, transactionId: revision.transactionId, transactionRevisionId: revision.transactionRevisionId, baseProjectVersion: revision.baseProjectVersion, canonicalStateBeforeFingerprint: canonicalBefore, canonicalStateAfterFingerprint: canonicalBefore, appliedMutationResults: [] as AppliedMutationResult[], relationshipImpact: { affectedRelationshipIds: [], affectedEntityIds: [], unknowns: [], reusedFabric: true as const }, constraintResults: [] as ConstraintEvaluation[], derivedConsequences: [] as SimulationConsequence[], unknowns: [] as string[], warnings: [] as string[], errors: [] as string[], provenance: request.context.provenance, humanDecisionRequired: false, canonicalMutation: false as const, canonicalVersionChanged: false as const };
  if (revision.baseProjectVersion !== base) return { ...baseResult, executionStatus: "STALE", unknowns: ["BASE_VERSION_STALE"], warnings: ["NO_AUTO_REBASE"], humanDecisionRequired: true };
  if (request.context.baseProjectVersion !== base) return { ...baseResult, executionStatus: "STALE", unknowns: ["CONTEXT_BASE_VERSION_STALE"], warnings: ["NO_AUTO_REBASE"], humanDecisionRequired: true };
  const isolated: MutableState = { projectVersion: request.canonicalState.projectVersion, entities: clone(request.canonicalState.entities) as Record<string, MutableJsonObject>, relationships: clone(Array.from(request.canonicalState.relationships)), derivedState: clone(request.canonicalState.derivedState ?? {}) as Record<string, JsonValue> };
  const applied: AppliedMutationResult[] = [];
  try {
    revision.mutationSet.forEach((mutation) => { validateMutationRecord(mutation); applied.push(applyMutation(isolated, mutation)); });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN_SIMULATION_FAILURE";
    return { ...baseResult, executionStatus: message.startsWith("MISSING_DEPENDENCY") ? "UNKNOWN" : message.startsWith("STALE") ? "STALE" : "INVALID", appliedMutationResults: applied, errors: [message], unknowns: message.startsWith("MISSING_DEPENDENCY") ? [message] : [], humanDecisionRequired: message.startsWith("MISSING_DEPENDENCY") };
  }
  const originalFabric = RelationshipFabric.fromJSON(Array.from(request.canonicalState.relationships));
  const isolatedFabric = RelationshipFabric.fromJSON(isolated.relationships);
  const changedEntities = new Set(revision.mutationSet.map((mutation) => mutation.target.entityId));
  const affectedRelationships = [...originalFabric.all(), ...isolatedFabric.all()].filter((relation, index, all) => all.findIndex((item) => item.relationshipId === relation.relationshipId && item.relationshipRevisionId === relation.relationshipRevisionId) === index && (changedEntities.has(relation.sourceEntityId) || changedEntities.has(relation.targetEntityId))).map((relation) => relation.relationshipId).sort();
  const affectedEntityIds = Array.from(new Set([...Array.from(changedEntities), ...affectedRelationships.flatMap((relationshipId) => { const relation = [...originalFabric.all(), ...isolatedFabric.all()].find((item) => item.relationshipId === relationshipId); return relation ? [relation.sourceEntityId, relation.targetEntityId] : []; })])).sort();
  const relationshipImpact: SimulationRelationshipImpact = { affectedRelationshipIds: affectedRelationships, affectedEntityIds, unknowns: [], reusedFabric: true };
  const constraintResults = request.constraints?.map((constraint) => request.evaluateConstraint && request.constraintContext ? request.evaluateConstraint(constraint, { ...request.constraintContext, projectVersion: base, entities: isolated.entities as unknown as Readonly<Record<string, Readonly<Record<string, PrimitiveValue>>>>, relationships: isolated.relationships, derived: isolated.derivedState as unknown as Readonly<Record<string, PrimitiveValue>> }) : ({ constraintId: constraint.constraintId, constraintRevisionId: constraint.constraintRevisionId, projectVersion: base, status: "UNKNOWN", resolutionReason: "EXTERNAL_ORACLE_REQUIRED", hardness: constraint.hardness, severity: constraint.severity, explanation: "No governed BKH-2 evaluator supplied", evidence: constraint.evidence, conflictingConstraintIds: [], dependencies: [], provenance: constraint.provenance, evaluatedAtRevision: revision.transactionRevisionId } as ConstraintEvaluation)) ?? [];
  const constraintUnknowns = constraintResults.filter((result) => result.status === "UNKNOWN").map((result) => `CONSTRAINT_UNKNOWN:${result.constraintId}`);
  const constraintViolations = constraintResults.filter((result) => result.status === "VIOLATED" || result.status === "CONFLICTING").map((result) => `CONSTRAINT_${result.status}:${result.constraintId}`);
  const changes = request.changes ?? revision.mutationSet.map((mutation, index) => ({ changeSetId: `simulation-change:${index + 1}`, entityId: mutation.target.entityId, property: mutation.target.propertyPath ?? mutation.target.parameterId ?? mutation.operation, previousValue: mutation.before, proposedValue: mutation.proposedAfter, sourceRevision: mutation.expectedRevision, targetRevision: revision.transactionRevisionId, projectVersion: base, initiatingCause: "BKH4-3_SIMULATION", origin: "HUMAN", timestamp: request.context.simulationContextRevision, epistemicState: "PROPOSED", provenance: { source: request.context.provenance.source, transformations: ["simulation"] } } as RegenerationChangeSet));
  let regenerationResults: SimulationResult["regenerationResults"];
  if (request.regeneration) regenerationResults = request.regeneration.executePlan({ plan: request.regeneration.buildPlan({ changes, context: request.context.regenerationContext }), changes, context: request.context.regenerationContext });
  const unknowns = [...constraintUnknowns, ...(regenerationResults?.result.unknown ?? []), ...(regenerationResults?.result.status === "UNKNOWN" ? ["BKH3_RESULT_UNKNOWN"] : [])];
  const derivedConsequences: SimulationConsequence[] = [
    ...revision.mutationSet.map((mutation) => ({ kind: "DIRECT_MUTATION" as const, id: mutation.mutationId, sourceIds: [mutation.target.entityId], status: "KNOWN" as const, detail: `${mutation.operation} applied only to isolated simulation state` })),
    ...affectedRelationships.map((id) => ({ kind: "RELATIONSHIP_IMPACT" as const, id, sourceIds: affectedEntityIds, status: "KNOWN" as const, detail: "Impact determined through reused Relationship Fabric" })),
    ...constraintResults.map((result) => ({ kind: "CONSTRAINT_CONSEQUENCE" as const, id: result.constraintId, sourceIds: result.dependencies, status: result.status === "UNKNOWN" ? "UNKNOWN" as const : "KNOWN" as const, detail: result.explanation })),
    ...(regenerationResults?.result.nodes ?? []).map((node) => ({ kind: "REGENERATED_CONSEQUENCE" as const, id: node.outputIdentity, sourceIds: [node.entityId], status: node.executionState === "PENDING" ? "UNKNOWN" as const : "KNOWN" as const, detail: node.reason ?? node.executionState })),
  ];
  const simulatedStateFingerprint = stateFingerprint(isolated);
  const executionStatus: SimulationExecutionStatus = constraintViolations.length > 0 ? "INVALID" : regenerationResults?.result.status === "FAILED" ? "FAILED" : regenerationResults?.result.status === "BLOCKED" ? "BLOCKED" : unknowns.length > 0 ? "UNKNOWN" : "COMPLETED";
  return { ...baseResult, executionStatus, simulatedStateFingerprint, appliedMutationResults: applied, relationshipImpact, constraintResults, regenerationResults, derivedConsequences, unknowns, errors: constraintViolations, humanDecisionRequired: constraintUnknowns.length > 0 || constraintViolations.length > 0 };
};

export const assertCanonicalStateUnchanged = (before: SimulationCanonicalState, after: SimulationCanonicalState): true => { if (stateFingerprint(before) !== stateFingerprint(after)) throw new Error("CANONICAL_STATE_CHANGED"); return true; };
export const canonicalStateFingerprint = stateFingerprint;
