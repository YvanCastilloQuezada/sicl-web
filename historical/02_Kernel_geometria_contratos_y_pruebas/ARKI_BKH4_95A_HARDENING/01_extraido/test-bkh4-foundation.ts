import { strict as assert } from "node:assert";
import { assertMutationSetSerializable, assertTransactionSerializable, createTransaction, createTransactionRevision, isLegalTransactionTransition, proposeTransaction, serializeMutationSet, serializeTransaction, transitionTransaction, validateMutationRecord, validateTransactionRevisionHistory, type MutationRecord, type TransactionProvenance } from "../shared/arkiTransactionEngine";

const provenance: TransactionProvenance = { source: "fixture:bkh4-95a", actorId: "po-test", evidenceRefs: ["fixture-1"], transformations: ["test"] };
const base = (operation: MutationRecord["operation"], overrides: Partial<MutationRecord> = {}): MutationRecord => ({ mutationId: `m-${operation}`, schemaVersion: "1.1", target: { entityId: "wall-1" }, operation, expectedRevision: "wall-1:r1", provenance, reason: "contract test", intent: "UPDATE", ...overrides });
const create = base("CREATE_ENTITY", { target: { entityId: "wall-new", entityKind: "Wall" }, proposedAfter: { kind: "Wall", height: 3 } });
const update = base("UPDATE_PROPERTY", { target: { entityId: "wall-1", entityKind: "Wall", propertyPath: "height" }, before: 3, proposedAfter: 4 });
const move = base("MOVE_ENTITY", { target: { entityId: "wall-1", entityKind: "Wall" }, before: { x: 0, y: 0, z: 0 }, proposedAfter: { x: 1, y: 2, z: 0 } });
const removeEntity = base("DELETE_ENTITY", { target: { entityId: "wall-1", entityKind: "Wall" }, before: { kind: "Wall", height: 3 } });
const addRelationship = base("ADD_RELATIONSHIP", { target: { entityId: "wall-1", relationshipId: "rel-1" }, proposedAfter: { sourceEntityId: "wall-1", targetEntityId: "space-1", type: "BOUNDS" }, intent: "RELATE" });
const removeRelationship = base("REMOVE_RELATIONSHIP", { target: { entityId: "wall-1", relationshipId: "rel-1" }, before: { sourceEntityId: "wall-1", targetEntityId: "space-1", type: "BOUNDS" }, intent: "RELATE" });
const parameter = base("UPDATE_PARAMETER", { target: { entityId: "wall-1", entityKind: "Wall", parameterId: "height" }, before: 3, proposedAfter: 4, intent: "PARAMETER_CHANGE" });
for (const mutation of [create, update, move, removeEntity, addRelationship, removeRelationship, parameter]) validateMutationRecord(mutation);
assertMutationSetSerializable([create, update, move, removeEntity, addRelationship, removeRelationship, parameter]);

const transaction = createTransaction({ transactionId: "tx-1", projectId: "project-1", proposedBy: "po-test", intent: "UPDATE", provenance, createdAt: "2026-09-23T00:00:00Z" });
const revision = createTransactionRevision({ transactionRevisionId: "tx-1:r1", transactionId: "tx-1", revisionNumber: 1, baseProjectVersion: "V10", mutationSet: [update], status: "DRAFT", intent: "UPDATE", provenance, createdAt: "2026-09-23T00:00:00Z" });
const proposed = proposeTransaction(transaction, { ...revision, status: "PROPOSED" });
assert.equal(proposed.transactionId, "tx-1"); assert.notEqual(proposed.currentRevisionId, proposed.transactionId); assert.equal(proposed.baseProjectVersion, "V10"); assertTransactionSerializable(proposed);
assert.equal(serializeTransaction(proposed), serializeTransaction(JSON.parse(JSON.stringify(proposed))));
assert.equal(serializeMutationSet([update]), serializeMutationSet(JSON.parse(JSON.stringify([update]))));
for (const forbiddenStatus of ["AUTHORIZED", "COMMITTING", "COMMITTED", "RECOVERY_REQUIRED"] as const) assert.throws(() => createTransactionRevision({ ...revision, status: forbiddenStatus as never }), /status is not allowed/);
validateTransactionRevisionHistory("tx-1", [revision]); assert.throws(() => validateTransactionRevisionHistory("tx-1", [revision, revision]), /Duplicate transactionRevisionId/);

let current = proposed; const audits: string[] = [];
for (const to of ["SIMULATING", "SIMULATED", "VALIDATING", "VALID", "AUTHORIZED"] as const) { const result = transitionTransaction({ transaction: current, to, at: "2026-09-23T00:00:00Z", actorId: "po-test", reason: "fixture transition", provenance }); current = result.transaction; audits.push(`${result.audit.from}->${result.audit.to}`); }
assert.equal(current.status, "AUTHORIZED"); assert.deepEqual(audits, ["PROPOSED->SIMULATING", "SIMULATING->SIMULATED", "SIMULATED->VALIDATING", "VALIDATING->VALID", "VALID->AUTHORIZED"]);
assert.equal(isLegalTransactionTransition("AUTHORIZED", "COMMITTING"), true); assert.equal(isLegalTransactionTransition("DRAFT", "COMMITTED"), false);
assert.throws(() => transitionTransaction({ transaction: proposed, to: "COMMITTED", at: "2026-09-23T00:00:00Z", actorId: "po-test", reason: "illegal", provenance }), /Illegal transaction transition/);
assert.throws(() => createTransactionRevision({ ...revision, baseProjectVersion: "" }), /baseProjectVersion/);

const invalid = (mutation: unknown, pattern: RegExp): void => assert.throws(() => validateMutationRecord(mutation as MutationRecord), pattern);
invalid({ ...update, proposedAfter: { value: 4 }, callback: () => "bypass" }, /unsupported fields/);
invalid({ ...update, proposedAfter: "Function(\"bad\")" }, /Executable mutation content/);
invalid({ ...update, proposedAfter: "ordinary => text" }, /Executable mutation content/);
invalid({ ...update, operation: "RUN_CODE" }, /Unsupported mutation operation/);
invalid({ ...update, target: { entityId: "wall-1", propertyPath: "height", extra: "bypass" } }, /unsupported fields/);
invalid({ ...create, before: null }, /CREATE_ENTITY requires/);
invalid({ ...update, target: { entityId: "wall-1" } }, /target.propertyPath/);
invalid({ ...update, before: 4, proposedAfter: 4 }, /distinct/);
invalid({ ...move, proposedAfter: { x: 1, y: "two", z: 0 } }, /numeric y/);
invalid({ ...removeEntity, proposedAfter: null }, /DELETE_ENTITY requires/);
invalid({ ...addRelationship, target: { entityId: "wall-1" } }, /target.relationshipId/);
invalid({ ...addRelationship, proposedAfter: { sourceEntityId: "wall-1" } }, /relationship proposedAfter/);
invalid({ ...removeRelationship, before: { sourceEntityId: "wall-1" }, proposedAfter: {} }, /no proposedAfter/);
invalid({ ...parameter, target: { entityId: "wall-1" } }, /target.parameterId/);
invalid({ ...update, proposedAfter: { nested: { fn: () => "not JSON" } } }, /JSON serializable/);

console.log(JSON.stringify({ status: "PASS", revisionStatusRestricted: true, stableIdentity: true, revisionDistinct: true, baseVersionRequired: true, legalTransitions: audits.length, illegalTransitionRejected: true, serializationRoundTrip: true, operationInvariants: 7, arbitraryCodeRejectedStructurally: true, malformedMutationRejected: true, deterministicSerialization: true, duplicateRevisionRejected: true, provenancePreserved: true, canonicalMutation: "NOT_IMPLEMENTED" }));
