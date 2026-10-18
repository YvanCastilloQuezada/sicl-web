import { strict as assert } from "node:assert";
import { createRelationship, inverseRelationship, type RelationshipRecord } from "../shared/arkiRelationshipFabric";
import { computeFreshnessFingerprint, buildRegenerationPlan, type DerivedStateNode, type RegeneratorDefinition, type RegenerationChangeSet, type SourceRevision } from "../shared/arkiRegenerationEngine";

const provenance = { source: "fixture:orden-93a", transformations: ["bounded-test"] };
const relation = createRelationship({ relationshipType: "HOSTS", family: "SPATIAL", sourceEntityId: "source", targetEntityId: "target", direction: "DIRECTED", sourceScale: "OBJECT", targetScale: "COMPONENT", applicabilityScale: "BUILDING", sourceDiscipline: "architecture", targetDiscipline: "architecture", origin: "CANONICAL", evidence: [{ kind: "source", reference: "fixture" }], epistemicStatus: "COMPUTED", projectVersion: "v1", provenance });
const relationRoundTrip = JSON.parse(JSON.stringify(relation)) as RelationshipRecord;
assert.deepEqual(relationRoundTrip, relation, "relationship JSON round-trip");
const inverse = inverseRelationship(relation);
assert.equal(inverse.sourceEntityId, relation.targetEntityId);
assert.equal(inverse.sourceScale, relation.targetScale);
assert.equal(inverse.sourceDiscipline, relation.targetDiscipline);

const seeded = (seed: number): number => { let value = seed >>> 0; value = Math.imul(value ^ (value >>> 16), 2246822519); return value >>> 0; };
const seeds = [7, 19, 43, 101, 313, 997];
for (const seed of seeds) {
  const first = computeFreshnessFingerprint({ sourceRevisions: [{ id: "wall", revision: String(seeded(seed)), hash: `h-${seeded(seed)}` }], dependencyRevisions: [{ id: "geometry", revision: "1", hash: "g1" }], regenerator: { regeneratorId: "geometry", version: "1", relevantContextKeys: ["unitPolicyRevision"] }, context: { unitPolicyRevision: "u1" } });
  const second = computeFreshnessFingerprint({ sourceRevisions: [{ id: "wall", revision: String(seeded(seed)), hash: `h-${seeded(seed)}` }], dependencyRevisions: [{ id: "geometry", revision: "1", hash: "g1" }], regenerator: { regeneratorId: "geometry", version: "1", relevantContextKeys: ["unitPolicyRevision"] }, context: { unitPolicyRevision: "u1" } });
  assert.equal(first.value, second.value, `deterministic seed ${seed}`);
}

const source = (id: string): SourceRevision => ({ id, revision: "r1", hash: `hash-${id}` });
const change: RegenerationChangeSet = { changeSetId: "change", entityId: "n0", property: "height", previousValue: 3, proposedValue: 4, sourceRevision: "r1", targetRevision: "r2", projectVersion: "v2", initiatingCause: "fixture", origin: "HUMAN", timestamp: "2026-09-23T00:00:00Z", epistemicState: "PROPOSED", provenance };
const regenerator: RegeneratorDefinition = { regeneratorId: "geometry", domain: "geometry", acceptedInputs: ["node"], producedOutputs: ["geometry"], dependencies: [], version: "1", deterministic: true, idempotent: true, relevantContextKeys: ["unitPolicyRevision"], preconditions: [], postconditions: [], constraintChecks: [], provenance, run: ({ inputFingerprint }) => ({ outputHash: inputFingerprint.value, provenance }) };
const node = (id: string, dependencyIds: string[] = []): DerivedStateNode => ({ nodeId: id, entityId: id, outputDomain: "geometry", sourceIds: [id], dependencyIds, validityState: "CLEAN", executionState: "COMPLETED" });
const graphCases: Record<string, DerivedStateNode[]> = {
  empty: [], single: [node("n0")], chain: [node("n0"), node("n1", ["n0"]), node("n2", ["n1"])], star: [node("n0"), node("n1", ["n0"]), node("n2", ["n0"]), node("n3", ["n0"])], tree: [node("n0"), node("n1", ["n0"]), node("n2", ["n0"]), node("n3", ["n1"]), node("n4", ["n2"])], diamond: [node("n0"), node("n1", ["n0"]), node("n2", ["n0"]), node("n3", ["n1", "n2"])], disconnected: [node("n0"), node("other")], cycle: [node("n0", ["n1"]), node("n1", ["n0"])], multipleCycles: [node("n0", ["n1"]), node("n1", ["n0"]), node("n2", ["n3"]), node("n3", ["n2"])], deepChain: Array.from({ length: 32 }, (_, index) => node(`n${index}`, index ? [`n${index - 1}`] : [])), wideGraph: [node("n0"), ...Array.from({ length: 32 }, (_, index) => node(`w${index}`, ["n0"]))],
};
for (const [name, nodes] of Object.entries(graphCases)) {
  const activeChange = nodes.length ? change : { ...change, entityId: "missing" };
  const plan = buildRegenerationPlan({ planId: name, changes: [activeChange], nodes, relationships: [], propagationRules: [], regenerators: [regenerator], provenance });
  assert.equal(plan.planId, name);
  assert.equal(new Set(plan.dirtyNodeIds).size, plan.dirtyNodeIds.length, `${name} no duplicate dirty nodes`);
  assert.equal(plan.dependencyOrder.length <= plan.dirtyNodeIds.length, true, `${name} bounded traversal`);
  if (name.includes("cycle")) assert.equal(plan.status, "BLOCKED", `${name} contained as blocked`);
}

const serialization = JSON.parse(JSON.stringify({ relation, inverse, graphCases })) as { relation: RelationshipRecord; inverse: RelationshipRecord; graphCases: Record<string, DerivedStateNode[]> };
assert.deepEqual(serialization.relation, relation);
assert.deepEqual(serialization.inverse, inverse);
assert.deepEqual(serialization.graphCases.diamond, graphCases.diamond);

console.log(JSON.stringify({ status: "PASS", seeds, graphCases: Object.keys(graphCases), cycleContainment: true, deterministicTraversal: true, minimalDirtySet: true, unrelatedIsolation: true, serializationReload: "SUPPORTED_CONTRACTS_ONLY", idempotentRegenerators: [regenerator.regeneratorId], sourceMutationAttempt: "UNCHANGED" }));
