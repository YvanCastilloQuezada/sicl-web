// ARKI — BKH-3 Regeneration Engine
// Scope: planning and derived-state regeneration only.
// It does not commit, transact, mutate source state, or replace canonical state.

import type { RelationshipRecord } from "./arkiRelationshipFabric";

export type ValidityState = "CLEAN" | "DIRTY" | "UNKNOWN";
export type ExecutionState = "PENDING" | "REGENERATING" | "COMPLETED" | "BLOCKED" | "FAILED";
export type RegenerationGlobalStatus = "PLANNED" | "REGENERATING" | "PARTIAL" | "COMPLETED" | "BLOCKED" | "FAILED" | "UNKNOWN";
export type InvalidationPolicy = "NONE" | "DIRECT_ONLY" | "TRANSITIVE_AUTHORIZED" | "INVERSE_AUTHORIZED";
export type PropagationDirection = "FORWARD" | "INVERSE" | "BIDIRECTIONAL";
export type PropagationConditionStatus = "TRUE" | "FALSE" | "UNKNOWN";
export type ConstraintGateResult = { status: "SATISFIED" | "VIOLATED" | "UNKNOWN"; reason?: string };

export type RegenerationContext = {
  unitPolicyRevision?: string;
  tolerancePolicyRevision?: string;
  configurationRevision?: string;
  domainDatasetRevisions?: Readonly<Record<string, string>>;
  priceBookRevision?: string;
  mappingVersion?: string;
  externalOracleVersions?: Readonly<Record<string, string>>;
  relevantInputs?: Readonly<Record<string, string>>;
};

export type SourceRevision = { id: string; revision: string; hash: string };
export type FreshnessFingerprint = {
  algorithm: "ARKI-FNV1A-STABLE-1";
  sourceHashes: string[];
  dependencyHashes: string[];
  regeneratorId: string;
  regeneratorVersion: string;
  contextHash: string;
  value: string;
};

export type Provenance = { source: string; transformations: string[]; evidence?: string[] };
export type Diagnostic = { code: string; message: string; nodeId?: string };

export type RegenerationChangeSet = {
  changeSetId: string;
  entityId: string;
  property: string;
  previousValue: unknown;
  proposedValue: unknown;
  sourceRevision: string;
  targetRevision: string;
  projectVersion: string;
  scenario?: string;
  initiatingCause: string;
  origin: "SYSTEM" | "HUMAN" | "IMPORTED" | "ADAPTER";
  timestamp: string;
  epistemicState: "PROPOSED" | "OBSERVED" | "COMPUTED" | "VERIFIED" | "UNKNOWN";
  provenance: Provenance;
};

export type PropagationRule = {
  ruleId: string;
  relationshipType: string;
  propagationDirection: PropagationDirection;
  affectedOutputDomain: string;
  conditionId?: string;
  invalidationPolicy: InvalidationPolicy;
  version: string;
  provenance: Provenance;
};

export type DerivedStateNode = {
  nodeId: string;
  entityId: string;
  outputDomain: string;
  sourceIds: string[];
  dependencyIds: string[];
  validityState: ValidityState;
  executionState: ExecutionState;
  currentFingerprint?: FreshnessFingerprint;
  reason?: string;
};

export type RegeneratorInput = {
  node: DerivedStateNode;
  changes: readonly RegenerationChangeSet[];
  context: RegenerationContext;
  inputFingerprint: FreshnessFingerprint;
};

export type RegeneratorOutput = {
  outputHash: string;
  diagnostics?: Diagnostic[];
  constraintResults?: readonly string[];
  provenance?: Provenance;
};

export type RegeneratorDefinition = {
  regeneratorId: string;
  domain: string;
  acceptedInputs: string[];
  producedOutputs: string[];
  dependencies: string[];
  version: string;
  deterministic: boolean;
  idempotent?: boolean;
  relevantContextKeys: string[];
  preconditions: string[];
  postconditions: string[];
  constraintChecks: string[];
  provenance: Provenance;
  evaluateConstraints?: (phase: "precondition" | "postcondition", input: RegeneratorInput, output?: RegeneratorOutput) => readonly ConstraintGateResult[];
  run: (input: RegeneratorInput) => RegeneratorOutput;
};

export type RegenerationNodeResult = {
  outputIdentity: string;
  entityId: string;
  regenerator?: string;
  inputFingerprint?: FreshnessFingerprint;
  outputFingerprint?: FreshnessFingerprint;
  validityState: ValidityState;
  executionState: ExecutionState;
  reason?: string;
  diagnostics: Diagnostic[];
  constraintResults: string[];
  provenance: Provenance;
};

export type RegenerationPlan = {
  planId: string;
  changeSetIds: string[];
  impactedNodeIds: string[];
  dirtyNodeIds: string[];
  dependencyOrder: string[];
  requiredRegenerators: string[];
  blockedNodeIds: string[];
  unknownNodeIds: string[];
  diagnostics: Diagnostic[];
  provenance: Provenance;
  status: "PLANNED" | "BLOCKED" | "UNKNOWN";
};

export type RegenerationResult = {
  planId: string;
  status: RegenerationGlobalStatus;
  nodes: RegenerationNodeResult[];
  regenerated: string[];
  unchanged: string[];
  dirtyRemaining: string[];
  blocked: string[];
  failed: string[];
  unknown: string[];
  diagnostics: Diagnostic[];
  provenance: Provenance;
};

export type RegenerationTrace = {
  traceId: string;
  planId: string;
  events: Array<{ sequence: number; kind: string; nodeId?: string; detail: string }>;
};

export const aggregateRegenerationStatus = (states: readonly ExecutionState[], hasDirtyRemaining = false): RegenerationGlobalStatus => {
  if (states.some((state) => state === "FAILED")) return "FAILED";
  if (states.some((state) => state === "BLOCKED")) return "BLOCKED";
  if (states.some((state) => state === "PENDING")) return "UNKNOWN";
  if (hasDirtyRemaining) return "PARTIAL";
  if (states.length > 0 && states.every((state) => state === "COMPLETED")) return "COMPLETED";
  return "PLANNED";
};

const stableJson = (value: unknown): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`).join(",")}}`;
};

const hash = (value: string): string => {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(16).padStart(8, "0");
};

export const stableRegenerationId = (value: unknown): string => `regen:${hash(stableJson(value))}`;

const contextSubset = (context: RegenerationContext, keys: readonly string[]): Record<string, unknown> => {
  const all: Record<string, unknown> = {
    unitPolicyRevision: context.unitPolicyRevision,
    tolerancePolicyRevision: context.tolerancePolicyRevision,
    configurationRevision: context.configurationRevision,
    domainDatasetRevisions: context.domainDatasetRevisions,
    priceBookRevision: context.priceBookRevision,
    mappingVersion: context.mappingVersion,
    externalOracleVersions: context.externalOracleVersions,
    relevantInputs: context.relevantInputs,
  };
  return Object.fromEntries(Array.from(keys).sort().map((key: string) => [key, all[key] ?? context.relevantInputs?.[key]]));
};

export const computeFreshnessFingerprint = (input: {
  sourceRevisions: readonly SourceRevision[];
  dependencyRevisions: readonly SourceRevision[];
  regenerator: Pick<RegeneratorDefinition, "regeneratorId" | "version" | "relevantContextKeys">;
  context: RegenerationContext;
}): FreshnessFingerprint => {
  const sourceHashes = input.sourceRevisions.map((item) => `${item.id}@${item.revision}:${item.hash}`).sort();
  const dependencyHashes = input.dependencyRevisions.map((item) => `${item.id}@${item.revision}:${item.hash}`).sort();
  const contextHash = hash(stableJson(contextSubset(input.context, input.regenerator.relevantContextKeys)));
  const value = hash(stableJson({ sourceHashes, dependencyHashes, regeneratorId: input.regenerator.regeneratorId, regeneratorVersion: input.regenerator.version, contextHash }));
  return { algorithm: "ARKI-FNV1A-STABLE-1", sourceHashes, dependencyHashes, regeneratorId: input.regenerator.regeneratorId, regeneratorVersion: input.regenerator.version, contextHash, value };
};

export const fingerprintsEqual = (left: FreshnessFingerprint | undefined, right: FreshnessFingerprint): boolean => Boolean(left && left.value === right.value && left.regeneratorId === right.regeneratorId && left.regeneratorVersion === right.regeneratorVersion && left.contextHash === right.contextHash);
export const isFingerprintCurrent = (stored: FreshnessFingerprint | undefined, expected: FreshnessFingerprint): boolean => fingerprintsEqual(stored, expected);

const directionAllows = (rule: PropagationRule, relation: RelationshipRecord, changeEntityId: string): boolean => {
  const forward = relation.sourceEntityId === changeEntityId;
  const inverse = relation.targetEntityId === changeEntityId;
  if (rule.propagationDirection === "FORWARD") return forward;
  if (rule.propagationDirection === "INVERSE") return inverse;
  return forward || inverse;
};

export const propagationTarget = (rule: PropagationRule, relation: RelationshipRecord, changeEntityId: string, conditionEvaluator?: (conditionId: string, relation: RelationshipRecord, changeEntityId: string) => PropagationConditionStatus): string | undefined => {
  if (rule.relationshipType !== relation.relationshipType || rule.invalidationPolicy === "NONE") return undefined;
  if (rule.conditionId && (!conditionEvaluator || conditionEvaluator(rule.conditionId, relation, changeEntityId) !== "TRUE")) return undefined;
  if (!directionAllows(rule, relation, changeEntityId)) return undefined;
  if (rule.propagationDirection === "FORWARD" && relation.sourceEntityId === changeEntityId) return relation.targetEntityId;
  if (rule.propagationDirection === "INVERSE" && relation.targetEntityId === changeEntityId) return relation.sourceEntityId;
  if (rule.propagationDirection === "BIDIRECTIONAL") return relation.sourceEntityId === changeEntityId ? relation.targetEntityId : relation.sourceEntityId;
  return undefined;
};

const topologicalOrder = (nodes: readonly DerivedStateNode[], selected: ReadonlySet<string>): { order: string[]; cycles: string[] } => {
  const selectedNodes = nodes.filter((node) => selected.has(node.nodeId));
  const incoming = new Map(selectedNodes.map((node) => [node.nodeId, node.dependencyIds.filter((id) => selected.has(id))]));
  const order: string[] = [];
  const pending = new Set(selectedNodes.map((node) => node.nodeId));
  while (pending.size > 0) {
    const ready = Array.from(pending).filter((id) => (incoming.get(id) ?? []).every((dependency) => !pending.has(dependency))).sort();
    if (ready.length === 0) return { order, cycles: Array.from(pending).sort() };
    ready.forEach((id) => { pending.delete(id); order.push(id); });
  }
  return { order, cycles: [] };
};

export const buildRegenerationPlan = (input: {
  planId: string;
  changes: readonly RegenerationChangeSet[];
  nodes: readonly DerivedStateNode[];
  relationships: readonly RelationshipRecord[];
  propagationRules: readonly PropagationRule[];
  regenerators: readonly RegeneratorDefinition[];
  provenance: Provenance;
  expectedFingerprints?: Readonly<Record<string, FreshnessFingerprint>>;
  conditionEvaluator?: (conditionId: string, relation: RelationshipRecord, changeEntityId: string) => PropagationConditionStatus;
}): RegenerationPlan => {
  const impacted = new Set<string>();
  const dirty = new Set<string>();
  const diagnostics: Diagnostic[] = [];
  const byEntity = new Map(input.nodes.map((node) => [node.entityId, node]));
  input.nodes.forEach((node) => {
    const expected = input.expectedFingerprints?.[node.nodeId];
    if (expected && !isFingerprintCurrent(node.currentFingerprint, expected)) { impacted.add(node.nodeId); dirty.add(node.nodeId); }
  });
  input.changes.forEach((change) => {
    input.nodes.filter((node) => node.sourceIds.includes(change.entityId) || node.entityId === change.entityId).forEach((node) => { impacted.add(node.nodeId); dirty.add(node.nodeId); });
    input.relationships.forEach((relation) => input.propagationRules.forEach((rule) => {
      const target = propagationTarget(rule, relation, change.entityId, input.conditionEvaluator);
      if (!target) return;
      const node = byEntity.get(target);
      if (node) { impacted.add(node.nodeId); dirty.add(node.nodeId); }
    }));
  });
  let expanded = true;
  while (expanded) {
    expanded = false;
    input.nodes.forEach((node) => {
      if (!dirty.has(node.nodeId) && node.dependencyIds.some((dependencyId) => dirty.has(dependencyId))) { dirty.add(node.nodeId); impacted.add(node.nodeId); expanded = true; }
    });
  }
  const { order, cycles } = topologicalOrder(input.nodes, dirty);
  if (cycles.length > 0) diagnostics.push(...cycles.map((nodeId) => ({ code: "CYCLE_DETECTED", message: `Dependency cycle prevents ordering for ${nodeId}`, nodeId })));
  const required = Array.from(new Set(input.nodes.filter((node) => dirty.has(node.nodeId)).map((node) => input.regenerators.find((regenerator) => regenerator.domain === node.outputDomain)?.regeneratorId).filter((id): id is string => Boolean(id)))).sort();
  const blocked = input.nodes.filter((node) => dirty.has(node.nodeId) && !input.regenerators.some((regenerator) => regenerator.domain === node.outputDomain)).map((node) => node.nodeId).sort();
  const unknown = input.nodes.filter((node) => dirty.has(node.nodeId) && node.validityState === "UNKNOWN").map((node) => node.nodeId).sort();
  if (blocked.length > 0) diagnostics.push(...blocked.map((nodeId) => ({ code: "UNSUPPORTED_REGENERATOR", message: `No registered regenerator for ${nodeId}`, nodeId })));
  return { planId: input.planId, changeSetIds: input.changes.map((change) => change.changeSetId), impactedNodeIds: Array.from(impacted).sort(), dirtyNodeIds: Array.from(dirty).sort(), dependencyOrder: order, requiredRegenerators: required, blockedNodeIds: Array.from(new Set(blocked.concat(cycles))).sort(), unknownNodeIds: unknown, diagnostics, provenance: input.provenance, status: cycles.length || blocked.length > 0 ? "BLOCKED" : unknown.length > 0 ? "UNKNOWN" : "PLANNED" };
};

export const executeRegenerationPlan = (input: {
  plan: RegenerationPlan;
  changes: readonly RegenerationChangeSet[];
  nodes: readonly DerivedStateNode[];
  regenerators: readonly RegeneratorDefinition[];
  context: RegenerationContext;
  sourceRevisions: readonly SourceRevision[];
  dependencyRevisions: readonly SourceRevision[];
  provenance: Provenance;
}): { result: RegenerationResult; trace: RegenerationTrace } => {
  const nodeMap = new Map(input.nodes.map((node) => [node.nodeId, node]));
  const events: RegenerationTrace["events"] = [];
  const results: RegenerationNodeResult[] = [];
  const regenerated: string[] = [];
  const unchanged: string[] = input.nodes.filter((node) => !input.plan.dirtyNodeIds.includes(node.nodeId)).map((node) => node.nodeId).sort();
  const dirtyRemaining: string[] = [];
  const blocked: string[] = [];
  const failed: string[] = [];
  const unknown: string[] = [];
  let sequence = 0;
  const emit = (kind: string, detail: string, nodeId?: string) => { sequence += 1; events.push({ sequence, kind, detail, nodeId }); };
  input.plan.dependencyOrder.forEach((nodeId) => {
    const node = nodeMap.get(nodeId);
    if (!node) return;
    const regenerator = input.regenerators.find((item) => item.domain === node.outputDomain);
    if (!regenerator) {
      blocked.push(nodeId); dirtyRemaining.push(nodeId); emit("BLOCKED", "UNSUPPORTED_REGENERATOR", nodeId);
      results.push({ outputIdentity: node.nodeId, entityId: node.entityId, validityState: "DIRTY", executionState: "BLOCKED", reason: "UNSUPPORTED_REGENERATOR", diagnostics: [{ code: "UNSUPPORTED_REGENERATOR", message: `No regenerator for ${node.outputDomain}`, nodeId }], constraintResults: [], provenance: input.provenance });
      return;
    }
    const fingerprint = computeFreshnessFingerprint({ sourceRevisions: input.sourceRevisions.filter((item) => node.sourceIds.includes(item.id)), dependencyRevisions: input.dependencyRevisions.filter((item) => node.dependencyIds.includes(item.id)), regenerator, context: input.context });
    const regeneratorInput: RegeneratorInput = { node, changes: input.changes, context: input.context, inputFingerprint: fingerprint };
    const preconditions = regenerator.evaluateConstraints?.("precondition", regeneratorInput) ?? [];
    const preViolation = preconditions.find((item) => item.status === "VIOLATED");
    const preUnknown = preconditions.find((item) => item.status === "UNKNOWN");
    if (preViolation || preUnknown) {
      const executionState: ExecutionState = preViolation ? "BLOCKED" : "PENDING";
      const reason = preViolation ? "BKH2_PRECONDITION_VIOLATED" : "BKH2_PRECONDITION_UNKNOWN";
      if (preViolation) blocked.push(nodeId); else unknown.push(nodeId);
      dirtyRemaining.push(nodeId); emit(executionState === "BLOCKED" ? "BLOCKED" : "UNKNOWN", reason, nodeId);
      results.push({ outputIdentity: node.nodeId, entityId: node.entityId, regenerator: regenerator.regeneratorId, inputFingerprint: fingerprint, validityState: "UNKNOWN", executionState, reason, diagnostics: [{ code: reason, message: preViolation?.reason ?? preUnknown?.reason ?? reason, nodeId }], constraintResults: preconditions.map((item) => item.status), provenance: input.provenance });
      return;
    }
    emit("REGENERATING", "regenerator started", nodeId);
    try {
      const output = regenerator.run(regeneratorInput);
      const postconditions = regenerator.evaluateConstraints?.("postcondition", regeneratorInput, output) ?? [];
      const postViolation = postconditions.find((item) => item.status === "VIOLATED");
      const postUnknown = postconditions.find((item) => item.status === "UNKNOWN");
      const outputFingerprint = { ...fingerprint, value: hash(fingerprint.value + "|" + output.outputHash) };
      if (postViolation || postUnknown) {
        const executionState: ExecutionState = postViolation ? "FAILED" : "PENDING";
        const reason = postViolation ? "BKH2_POSTCONDITION_VIOLATED" : "BKH2_POSTCONDITION_UNKNOWN";
        if (postViolation) failed.push(nodeId); else unknown.push(nodeId);
        dirtyRemaining.push(nodeId); emit(postViolation ? "FAILED" : "UNKNOWN", reason, nodeId);
        results.push({ outputIdentity: node.nodeId, entityId: node.entityId, regenerator: regenerator.regeneratorId, inputFingerprint: fingerprint, outputFingerprint, validityState: "UNKNOWN", executionState, reason, diagnostics: [{ code: reason, message: postViolation?.reason ?? postUnknown?.reason ?? reason, nodeId }], constraintResults: [...(output.constraintResults ?? []), ...postconditions.map((item) => item.status)], provenance: output.provenance ?? input.provenance });
        return;
      }
      regenerated.push(nodeId);
      emit("REGENERATED", "derived state proposed; no canonical commit", nodeId);
      results.push({ outputIdentity: node.nodeId, entityId: node.entityId, regenerator: regenerator.regeneratorId, inputFingerprint: fingerprint, outputFingerprint, validityState: "CLEAN", executionState: "COMPLETED", diagnostics: output.diagnostics ?? [], constraintResults: [...(output.constraintResults ?? []), ...preconditions.map((item) => item.status)], provenance: output.provenance ?? input.provenance });
    } catch (error) {
      failed.push(nodeId); dirtyRemaining.push(nodeId); const message = error instanceof Error ? error.message : "Unknown regenerator failure"; emit("FAILED", message, nodeId);
      results.push({ outputIdentity: node.nodeId, entityId: node.entityId, regenerator: regenerator.regeneratorId, inputFingerprint: fingerprint, validityState: "DIRTY", executionState: "FAILED", reason: "DETERMINISTIC_FAILURE", diagnostics: [{ code: "REGENERATOR_FAILED", message, nodeId }], constraintResults: [], provenance: input.provenance });
    }
  });
  input.plan.blockedNodeIds.filter((nodeId) => !blocked.includes(nodeId) && !results.some((result) => result.outputIdentity === nodeId)).forEach((nodeId) => { blocked.push(nodeId); dirtyRemaining.push(nodeId); emit("BLOCKED", "CYCLE_DETECTED", nodeId); });
  input.plan.unknownNodeIds.filter((nodeId) => !unknown.includes(nodeId) && !results.some((result) => result.outputIdentity === nodeId)).forEach((nodeId) => { unknown.push(nodeId); dirtyRemaining.push(nodeId); emit("UNKNOWN", "UNKNOWN_VALIDITY", nodeId); results.push({ outputIdentity: nodeId, entityId: nodeMap.get(nodeId)?.entityId ?? nodeId, validityState: "UNKNOWN", executionState: "PENDING", reason: "UNKNOWN_VALIDITY", diagnostics: [{ code: "UNKNOWN_VALIDITY", message: "Node validity is unknown.", nodeId }], constraintResults: [], provenance: input.provenance }); });
  const aggregate = aggregateRegenerationStatus(results.map((result) => result.executionState), dirtyRemaining.length > 0);
  const status: RegenerationGlobalStatus = aggregate === "PLANNED" && regenerated.length > 0 ? "COMPLETED" : aggregate;
  const result: RegenerationResult = { planId: input.plan.planId, status, nodes: results, regenerated: regenerated.sort(), unchanged, dirtyRemaining: Array.from(new Set(dirtyRemaining)).sort(), blocked: Array.from(new Set(blocked)).sort(), failed: Array.from(new Set(failed)).sort(), unknown: Array.from(new Set(unknown)).sort(), diagnostics: input.plan.diagnostics, provenance: input.provenance };
  return { result, trace: { traceId: "trace:" + hash(input.plan.planId + "|" + events.length), planId: input.plan.planId, events } };
};

export const noCanonicalMutation = (): true => true;
