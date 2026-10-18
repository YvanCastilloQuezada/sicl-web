import { strict as assert } from "node:assert";
import {
  buildRegenerationPlan,
  computeFreshnessFingerprint,
  executeRegenerationPlan,
  fingerprintsEqual,
  propagationTarget,
  type DerivedStateNode,
  type PropagationRule,
  type RegeneratorDefinition,
  type RegenerationChangeSet,
} from "../shared/arkiRegenerationEngine";
import { createRelationship } from "../shared/arkiRelationshipFabric";

const provenance = { source: "fixture:bkh3", transformations: ["test"] };
const relationship = createRelationship({
  relationshipType: "HOSTS", family: "SPATIAL", sourceEntityId: "wall-1", targetEntityId: "door-1", direction: "DIRECTED", sourceScale: "OBJECT", targetScale: "COMPONENT", applicabilityScale: "BUILDING", sourceDiscipline: "architecture", targetDiscipline: "architecture", origin: "CANONICAL", evidence: [{ kind: "source", reference: "fixture" }], epistemicStatus: "COMPUTED", projectVersion: "v1", provenance,
});
const rule: PropagationRule = { ruleId: "host-to-door", relationshipType: "HOSTS", propagationDirection: "FORWARD", affectedOutputDomain: "quantities", invalidationPolicy: "DIRECT_ONLY", version: "1.0", provenance };
assert.equal(propagationTarget(rule, relationship, "wall-1"), "door-1");
assert.equal(propagationTarget(rule, relationship, "door-1"), undefined);

const nodes: DerivedStateNode[] = [
  { nodeId: "wall-quantity", entityId: "wall-1", outputDomain: "quantities", sourceIds: ["wall-1"], dependencyIds: [], validityState: "CLEAN", executionState: "COMPLETED" },
  { nodeId: "door-quantity", entityId: "door-1", outputDomain: "quantities", sourceIds: ["door-1", "wall-1"], dependencyIds: ["wall-quantity"], validityState: "CLEAN", executionState: "COMPLETED" },
  { nodeId: "unsupported", entityId: "door-1", outputDomain: "unknown-domain", sourceIds: ["door-1"], dependencyIds: [], validityState: "CLEAN", executionState: "COMPLETED" },
];
const change: RegenerationChangeSet = { changeSetId: "change-1", entityId: "wall-1", property: "height", previousValue: 3, proposedValue: 3.6, sourceRevision: "r1", targetRevision: "r2", projectVersion: "v2", initiatingCause: "human parameter change", origin: "HUMAN", timestamp: "2026-09-23T00:00:00Z", epistemicState: "PROPOSED", provenance };
const regenerator: RegeneratorDefinition = { regeneratorId: "quantity-regenerator", domain: "quantities", acceptedInputs: ["wall", "door"], producedOutputs: ["quantity"], dependencies: [], version: "1.0", deterministic: true, idempotent: true, relevantContextKeys: ["unitPolicyRevision"], preconditions: ["source exists"], postconditions: ["output hash exists"], constraintChecks: ["BKH2"] , provenance, run: ({ inputFingerprint }) => ({ outputHash: "quantity-output:" + inputFingerprint.value, constraintResults: ["SATISFIED"], provenance }) };
const plan = buildRegenerationPlan({ planId: "plan-1", changes: [change], nodes, relationships: [relationship], propagationRules: [rule], regenerators: [regenerator], provenance });
assert.equal(plan.status, "BLOCKED");
assert.deepEqual(plan.dirtyNodeIds, ["door-quantity", "unsupported", "wall-quantity"]);
assert.equal(plan.blockedNodeIds.includes("unsupported"), true);
assert.equal(plan.dependencyOrder.includes("wall-quantity"), true);

const context = { unitPolicyRevision: "units-v1" };
const fingerprint = computeFreshnessFingerprint({ sourceRevisions: [{ id: "wall-1", revision: "r2", hash: "h1" }], dependencyRevisions: [], regenerator, context });
assert.equal(fingerprintsEqual(fingerprint, { ...fingerprint }), true);
assert.equal(fingerprintsEqual(fingerprint, { ...fingerprint, contextHash: "different" }), false);
const sourceBefore = JSON.stringify(nodes);
const execution = executeRegenerationPlan({ plan, changes: [change], nodes, regenerators: [regenerator], context, sourceRevisions: [{ id: "wall-1", revision: "r2", hash: "h1" }, { id: "door-1", revision: "r1", hash: "h2" }], dependencyRevisions: [{ id: "wall-quantity", revision: "r1", hash: "h3" }], provenance });
assert.equal(execution.result.status, "BLOCKED");
assert.equal(execution.result.regenerated.includes("wall-quantity"), true);
assert.equal(execution.result.blocked.includes("unsupported"), true);
assert.equal(JSON.stringify(nodes), sourceBefore, "BKH-3 must not mutate canonical/source nodes");
assert.equal(execution.trace.events.some((event) => event.kind === "REGENERATED"), true);
console.log(JSON.stringify({ status: "PASS", planStatus: plan.status, executionStatus: execution.result.status, regenerated: execution.result.regenerated.length, blocked: execution.result.blocked.length, traceEvents: execution.trace.events.length, noCanonicalMutation: true }));
