import { strict as assert } from "node:assert";
import { createConstraint, evaluateConstraint, type ConstraintRecord, type ConstraintEvaluationContext } from "../shared/arkiConstraintEngine";
import { createRelationship } from "../shared/arkiRelationshipFabric";
import {
  aggregateRegenerationStatus,
  buildRegenerationPlan,
  computeFreshnessFingerprint,
  executeRegenerationPlan,
  fingerprintsEqual,
  propagationTarget,
  type DerivedStateNode,
  type PropagationRule,
  type RegeneratorDefinition,
  type RegenerationChangeSet,
  type SourceRevision,
} from "../shared/arkiRegenerationEngine";

const provenance = { source: "fixture:bkh3-92a", transformations: ["test"] };
const relationship = createRelationship({ relationshipType: "HOSTS", family: "SPATIAL", sourceEntityId: "wall-1", targetEntityId: "door-1", direction: "DIRECTED", sourceScale: "OBJECT", targetScale: "COMPONENT", applicabilityScale: "BUILDING", sourceDiscipline: "architecture", targetDiscipline: "architecture", origin: "CANONICAL", evidence: [{ kind: "source", reference: "fixture" }], epistemicStatus: "COMPUTED", projectVersion: "v1", provenance });
const relationship2 = createRelationship({ relationshipType: "SUPPORTS", family: "STRUCTURAL", sourceEntityId: "door-1", targetEntityId: "cost-1", direction: "DIRECTED", sourceScale: "COMPONENT", targetScale: "OBJECT", applicabilityScale: "BUILDING", sourceDiscipline: "architecture", targetDiscipline: "cost", origin: "CANONICAL", evidence: [{ kind: "calculation", reference: "fixture" }], epistemicStatus: "COMPUTED", projectVersion: "v1", provenance });
const rule: PropagationRule = { ruleId: "host-to-door", relationshipType: "HOSTS", propagationDirection: "FORWARD", affectedOutputDomain: "geometry", invalidationPolicy: "DIRECT_ONLY", version: "1.0", provenance };
const conditionalRule: PropagationRule = { ...rule, ruleId: "conditional", conditionId: "phase-approved" };
assert.equal(propagationTarget(conditionalRule, relationship, "wall-1", () => "TRUE"), "door-1");
assert.equal(propagationTarget(conditionalRule, relationship, "wall-1", () => "FALSE"), undefined);
assert.equal(propagationTarget(conditionalRule, relationship, "wall-1", () => "UNKNOWN"), undefined);

const baseContext = { unitPolicyRevision: "u1", relevantInputs: { tolerance: "t1" } };
const sources = (revision: string): SourceRevision[] => [{ id: "wall-1", revision, hash: "wall-hash-" + revision }];
const deps = (revision: string): SourceRevision[] => [{ id: "geometry-1", revision, hash: "geometry-hash-" + revision }];
const makeRegenerator = (version = "1.0", contextKeys = ["unitPolicyRevision"]): RegeneratorDefinition => ({ regeneratorId: "geometry-regenerator", domain: "geometry", acceptedInputs: ["wall"], producedOutputs: ["geometry"], dependencies: [], version, deterministic: true, idempotent: true, relevantContextKeys: contextKeys, preconditions: ["BKH2 precondition"], postconditions: ["BKH2 postcondition"], constraintChecks: ["constraint-1"], provenance, run: ({ inputFingerprint }) => ({ outputHash: "out-" + inputFingerprint.value, constraintResults: ["SATISFIED"], provenance }) });
const regenerator = makeRegenerator();
const fp = (sourceRevision = "r1", dependencyRevision = "d1", version = "1.0", context = baseContext) => computeFreshnessFingerprint({ sourceRevisions: sources(sourceRevision), dependencyRevisions: deps(dependencyRevision), regenerator: { regeneratorId: regenerator.regeneratorId, version, relevantContextKeys: regenerator.relevantContextKeys }, context });
const current = fp();
assert.equal(fingerprintsEqual(current, fp()), true);
assert.equal(fingerprintsEqual(current, fp("r2")), false, "source revision changes freshness");
assert.equal(fingerprintsEqual(current, fp("r1", "d2")), false, "dependency revision changes freshness");
assert.equal(fingerprintsEqual(current, computeFreshnessFingerprint({ sourceRevisions: sources("r1"), dependencyRevisions: deps("d1"), regenerator: { regeneratorId: regenerator.regeneratorId, version: "2.0", relevantContextKeys: regenerator.relevantContextKeys }, context: baseContext })), false, "regenerator version changes freshness");
assert.equal(fingerprintsEqual(current, fp("r1", "d1", "1.0", { ...baseContext, unitPolicyRevision: "u2" })), false, "relevant context changes freshness");
assert.equal(fingerprintsEqual(current, fp("r1", "d1", "1.0", { ...baseContext, tolerancePolicyRevision: "unrelated" })), true, "irrelevant context does not change freshness");

const nodes: DerivedStateNode[] = [
  { nodeId: "geometry", entityId: "wall-1", outputDomain: "geometry", sourceIds: ["wall-1"], dependencyIds: [], validityState: "CLEAN", executionState: "COMPLETED", currentFingerprint: current },
  { nodeId: "quantity", entityId: "door-1", outputDomain: "geometry", sourceIds: ["door-1"], dependencyIds: ["geometry"], validityState: "CLEAN", executionState: "COMPLETED", currentFingerprint: current },
  { nodeId: "cost", entityId: "cost-1", outputDomain: "cost", sourceIds: ["cost-1"], dependencyIds: ["quantity"], validityState: "CLEAN", executionState: "COMPLETED", currentFingerprint: current },
  { nodeId: "unrelated", entityId: "unrelated-1", outputDomain: "geometry", sourceIds: ["unrelated-1"], dependencyIds: [], validityState: "CLEAN", executionState: "COMPLETED", currentFingerprint: current },
  { nodeId: "unknown", entityId: "unknown-1", outputDomain: "geometry", sourceIds: ["unknown-1"], dependencyIds: [], validityState: "UNKNOWN", executionState: "PENDING", currentFingerprint: current },
];
const change: RegenerationChangeSet = { changeSetId: "change-1", entityId: "wall-1", property: "height", previousValue: 3, proposedValue: 3.6, sourceRevision: "r1", targetRevision: "r2", projectVersion: "v2", initiatingCause: "human parameter change", origin: "HUMAN", timestamp: "2026-09-23T00:00:00Z", epistemicState: "PROPOSED", provenance };
const plan = buildRegenerationPlan({ planId: "torture", changes: [change], nodes, relationships: [relationship, relationship2], propagationRules: [rule], regenerators: [regenerator], expectedFingerprints: { geometry: fp("r2") }, provenance });
assert.deepEqual(plan.dirtyNodeIds, ["cost", "geometry", "quantity"]);
assert.equal(plan.dirtyNodeIds.includes("unrelated"), false);
assert.equal(plan.dirtyNodeIds.includes("unknown"), false);
const execution = executeRegenerationPlan({ plan, changes: [change], nodes, regenerators: [regenerator], context: baseContext, sourceRevisions: sources("r2"), dependencyRevisions: deps("d1"), provenance });
assert.equal(execution.result.nodes.length, 3);
assert.equal(execution.result.status, "BLOCKED", "unsupported cost remains visible and blocks global success");
assert.equal(execution.result.blocked.includes("cost"), true);
assert.equal(execution.result.regenerated.includes("geometry"), true);
assert.equal(execution.result.regenerated.includes("quantity"), true);
assert.equal(JSON.stringify(nodes[0].currentFingerprint), JSON.stringify(current), "source node unchanged");

assert.equal(aggregateRegenerationStatus(["COMPLETED"]), "COMPLETED");
assert.equal(aggregateRegenerationStatus(["COMPLETED", "PENDING"]), "UNKNOWN");
assert.equal(aggregateRegenerationStatus(["COMPLETED", "BLOCKED"]), "BLOCKED");
assert.equal(aggregateRegenerationStatus(["COMPLETED", "FAILED"]), "FAILED");
assert.equal(aggregateRegenerationStatus(["COMPLETED"], true), "PARTIAL");

const constraintBase = { constraintType: "DIMENSION_RANGE", subjectEntityIds: ["wall-1"], relationIds: [], applicability: { scales: ["OBJECT"], disciplines: ["architecture"], entityIds: ["wall-1"], entityKinds: ["wall"], jurisdictions: [], phaseIds: [], projectTypes: [] }, predicate: { kind: "binary", operator: "GTE", left: { kind: "reference", reference: "entity.wall-1.height", valueType: "number" }, right: { kind: "literal", value: 3, valueType: "number" } } as const, operands: {}, hardness: "HARD" as const, applicabilityMode: "UNCONDITIONAL" as const, severity: "ERROR" as const, enforcement: "BLOCK_HYPOTHETICAL" as const, epistemicStatus: "COMPUTED" as const, evidence: [], provenance: { source: "fixture", transformations: [] }, projectVersion: "v1", status: "ACTIVE" as const };
const constraint = createConstraint(constraintBase as Omit<ConstraintRecord, "constraintId" | "constraintRevisionId" | "family">);
const context: ConstraintEvaluationContext = { scale: "OBJECT", discipline: "architecture", entities: { "wall-1": { height: 3.5 } }, derived: {}, relationships: [] };
const satisfied = evaluateConstraint(constraint, context);
const violated = evaluateConstraint(constraint, { ...context, entities: { "wall-1": { height: 2 } } });
const unknown = evaluateConstraint(constraint, { ...context, entities: {} });
assert.equal(satisfied.status, "SATISFIED");
assert.equal(violated.status, "VIOLATED");
assert.equal(unknown.status, "UNKNOWN");
const gated = makeRegenerator();
const gatedWithBkh2: RegeneratorDefinition = { ...gated, evaluateConstraints: (phase) => phase === "precondition" ? [{ status: "SATISFIED", authority: "BKH-2", constraintId: "constraint-1" }] : [{ status: satisfied.status, authority: "BKH-2", constraintId: "constraint-1" }] };
const gatedPlan = buildRegenerationPlan({ planId: "bkh2-gated", changes: [change], nodes: [nodes[0]], relationships: [], propagationRules: [], regenerators: [gatedWithBkh2], provenance });
const gatedExecution = executeRegenerationPlan({ plan: gatedPlan, changes: [change], nodes: [nodes[0]], regenerators: [gatedWithBkh2], context: baseContext, sourceRevisions: sources("r2"), dependencyRevisions: [], provenance });
assert.equal(gatedExecution.result.status, "COMPLETED");
assert.equal(gatedExecution.result.nodes[0].constraintResults.includes("SATISFIED"), true);
const violatedGate: RegeneratorDefinition = { ...gated, evaluateConstraints: (phase) => phase === "precondition" ? [{ status: "SATISFIED", authority: "BKH-2", constraintId: "constraint-1" }] : [{ status: "VIOLATED", authority: "BKH-2", constraintId: "constraint-1", reason: "postcondition failed" }] };
const violatedPlan = buildRegenerationPlan({ planId: "bkh2-violated", changes: [change], nodes: [nodes[0]], relationships: [], propagationRules: [], regenerators: [violatedGate], provenance });
const violatedExecution = executeRegenerationPlan({ plan: violatedPlan, changes: [change], nodes: [nodes[0]], regenerators: [violatedGate], context: baseContext, sourceRevisions: sources("r2"), dependencyRevisions: [], provenance });
assert.equal(violatedExecution.result.status, "FAILED");
assert.equal(violatedExecution.result.nodes[0].reason, "BKH2_POSTCONDITION_VIOLATED");

const forgedGate: RegeneratorDefinition = { ...gated, evaluateConstraints: () => [{ status: "SATISFIED" } as never] };
const forgedPlan = buildRegenerationPlan({ planId: "bkh2-forged", changes: [change], nodes: [nodes[0]], relationships: [], propagationRules: [], regenerators: [forgedGate], provenance });
const forgedExecution = executeRegenerationPlan({ plan: forgedPlan, changes: [change], nodes: [nodes[0]], regenerators: [forgedGate], context: baseContext, sourceRevisions: sources("r2"), dependencyRevisions: [], provenance });
assert.equal(forgedExecution.result.status, "UNKNOWN");
assert.equal(forgedExecution.result.nodes[0].reason, "BKH2_GATE_UNTRUSTED");

console.log(JSON.stringify({ status: "PASS", freshnessE2E: true, conditionalPropagation: ["TRUE", "FALSE", "UNKNOWN"], minimalDirtySet: plan.dirtyNodeIds, aggregation: ["COMPLETED", "PARTIAL", "BLOCKED", "FAILED", "UNKNOWN"], bkh2Statuses: [satisfied.status, violated.status, unknown.status], selfCertification: "REJECTED", torture: "PARAMETER→GEOMETRY→RELATIONSHIP→QUANTITY→COST", noCanonicalMutation: true }));
