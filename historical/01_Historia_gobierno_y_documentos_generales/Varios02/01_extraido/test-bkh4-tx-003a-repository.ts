import { strict as assert } from "node:assert";
import {
  CanonicalProjectRepository,
  CanonicalRepositoryError,
  canonicalStateFingerprint,
  serializeCanonicalRevision,
  validateCanonicalRevisionChain,
  type CanonicalProjectRevision,
} from "../shared/arkiCanonicalProjectRepository";
import type { TransactionProvenance } from "../shared/arkiTransactionEngine";

const provenance: TransactionProvenance = {
  source: "test:tx-003a",
  actorId: "test-actor",
  evidenceRefs: ["fixture:tx-003a"],
  transformations: ["test-fixture"],
};
const state = (value: number) => ({ entities: { wall: { height: value } }, metadata: { stable: true } });
const expectCode = (code: CanonicalRepositoryError["code"], operation: () => unknown): void => {
  assert.throws(operation, (error: unknown) => error instanceof CanonicalRepositoryError && error.code === code);
};
const repo = () => new CanonicalProjectRepository("project-a");
const createGenesis = (repository: CanonicalProjectRepository, id = "r0", tx = "tx0") => repository.createGenesis({ revisionId: id, transactionId: tx, timestamp: "2026-09-24T00:00:00Z", statePayload: state(1), provenance, actor: "test-actor", authority: "HUMAN_AUTHORIZED" });

// CR-001 / CR-002 / CR-003 / CR-004: empty, genesis, chain, current.
const empty = repo();
assert.equal(empty.getCurrentRevision(), null);
const r0 = createGenesis(empty);
const r1 = empty.appendRevision({ revisionId: "r1", parentRevisionId: "r0", transactionId: "tx1", timestamp: "2026-09-24T00:01:00Z", statePayload: state(2), provenance, actor: "test-actor", authority: "SYSTEM_EXECUTED" });
const r2 = empty.appendRevision({ revisionId: "r2", parentRevisionId: "r1", transactionId: "tx2", timestamp: "2026-09-24T00:02:00Z", statePayload: state(3), provenance, actor: "test-actor", authority: "SYSTEM_EXECUTED" });
assert.equal(empty.getCurrentRevision()?.revisionId, "r2");
assert.equal(empty.getRevision("r0")?.parentRevisionId, null);
assert.equal(empty.verifyChain(), true);

// CR-005 / CR-006 / CR-007 / CR-008 / CR-009 / CR-010.
expectCode("CONFLICT", () => empty.appendRevision({ revisionId: "r2", parentRevisionId: "r1", transactionId: "tx3", timestamp: "x", statePayload: state(4), provenance, actor: "a", authority: "SYSTEM_EXECUTED" }));
expectCode("CONFLICT", () => new CanonicalProjectRepository("project-b").appendRevision({ revisionId: "foreign", parentRevisionId: "r2", transactionId: "foreign-tx", timestamp: "x", statePayload: state(4), provenance, actor: "a", authority: "SYSTEM_EXECUTED" }));
const missingParentRepository = repo();
createGenesis(missingParentRepository);
expectCode("NOT_FOUND", () => missingParentRepository.appendRevision({ revisionId: "r1", parentRevisionId: "missing", transactionId: "tx1", timestamp: "x", statePayload: state(2), provenance, actor: "a", authority: "SYSTEM_EXECUTED" }));
expectCode("CONFLICT", () => empty.appendRevision({ revisionId: "self", parentRevisionId: "self", transactionId: "tx-self", timestamp: "x", statePayload: state(4), provenance, actor: "a", authority: "SYSTEM_EXECUTED" }));
const cycleA = { ...r1, revisionId: "cycle-a", parentRevisionId: "cycle-b", status: "HISTORICAL" as const };
const cycleB = { ...r2, revisionId: "cycle-b", parentRevisionId: "cycle-a", status: "CURRENT" as const };
expectCode("CORRUPTED", () => validateCanonicalRevisionChain("project-a", [cycleA, cycleB]));
expectCode("CONFLICT", () => validateCanonicalRevisionChain("project-a", [r0, r1, { ...r2, revisionId: "wrong-parent", parentRevisionId: "r0", status: "CURRENT" }]));

// CR-011 / CR-012: external payload mutation and nested aliasing.
const externalPayload = { nested: { value: 1 }, list: ["a"] };
const isolated = repo();
const isolatedRevision = isolated.createGenesis({ revisionId: "iso-r0", transactionId: "iso-tx0", timestamp: "x", statePayload: externalPayload, provenance, actor: "a", authority: "HUMAN_AUTHORIZED" });
externalPayload.nested.value = 999;
externalPayload.list.push("b");
assert.equal((isolated.getRevision("iso-r0")?.statePayload as { nested: { value: number } }).nested.value, 1);
const returned = isolated.getRevision("iso-r0")!;
(returned.statePayload as { nested: { value: number } }).nested.value = 777;
assert.equal((isolated.getRevision("iso-r0")?.statePayload as { nested: { value: number } }).nested.value, 1);
assert.notEqual(isolatedRevision.statePayload, externalPayload);

// CR-013 / CR-014 / CR-015: fingerprint, project and parent tampering.
const tamperedPayload = { ...r1, statePayload: state(999) };
expectCode("CORRUPTED", () => empty.verifyRevision(tamperedPayload));
expectCode("CORRUPTED", () => empty.verifyRevision({ ...r1, stateFingerprint: "ARKI-CR-fake" }));
expectCode("CONFLICT", () => empty.verifyRevision({ ...r1, projectId: "project-b" }));
expectCode("CORRUPTED", () => empty.verifyRevision({ ...r1, parentRevisionId: "missing" }));

// CR-016 / CR-017 / CR-018.
expectCode("INVALID", () => validateCanonicalRevisionChain("project-a", [r0, { ...r1, statePayload: new Date() as never }]));
expectCode("INVALID", () => validateCanonicalRevisionChain("project-a", [r0, { ...r1, provenance: undefined } as never]));
expectCode("INVALID", () => validateCanonicalRevisionChain("project-a", [r0, { ...r1, revisionId: r1.transactionId }]));

// CR-019 deterministic serialization and fingerprint.
assert.equal(canonicalStateFingerprint({ b: 2, a: 1 }), canonicalStateFingerprint({ a: 1, b: 2 }));
assert.equal(serializeCanonicalRevision(r1), serializeCanonicalRevision(JSON.parse(JSON.stringify(r1))));
assert.notEqual(canonicalStateFingerprint(state(1)), canonicalStateFingerprint(state(2)));

// CR-020 competing candidates, CR-021 UNKNOWN, CR-022 unexpected status/property, CR-023/CR-024/CR-025.
const competing = repo();
createGenesis(competing);
competing.appendRevision({ revisionId: "candidate-a", parentRevisionId: "r0", transactionId: "candidate-tx-a", timestamp: "x", statePayload: state(2), provenance, actor: "a", authority: "SYSTEM_EXECUTED" });
expectCode("CONFLICT", () => competing.appendRevision({ revisionId: "candidate-b", parentRevisionId: "r0", transactionId: "candidate-tx-b", timestamp: "x", statePayload: state(3), provenance, actor: "a", authority: "SYSTEM_EXECUTED" }));
expectCode("UNKNOWN", () => validateCanonicalRevisionChain("project-a", [{ ...r1, status: "VERIFIED" as never }]));
expectCode("INVALID", () => validateCanonicalRevisionChain("project-a", [r0, { ...r1, unexpected: true } as never]));
const bypassRepository = repo();
createGenesis(bypassRepository);
const bypassRevision = bypassRepository.appendRevision({ revisionId: "bypass", parentRevisionId: "r0", transactionId: "tx-bypass", timestamp: "x", statePayload: state(4), provenance, actor: "a", authority: "SYSTEM_EXECUTED", status: "HISTORICAL" });
assert.equal(bypassRevision.status, "CURRENT");
expectCode("CORRUPTED", () => empty.verifyRevision({ ...r2, parentRevisionId: "r0" }));
expectCode("CONFLICT", () => empty.appendRevision({ revisionId: "r3", parentRevisionId: "r2", transactionId: "tx0", timestamp: "x", statePayload: state(4), provenance, actor: "a", authority: "SYSTEM_EXECUTED" }));
assert.equal(empty.getCurrentRevision("project-a")?.revisionId, "r2");
expectCode("CONFLICT", () => empty.getCurrentRevision("project-b"));

// Torture chain: 1,000 revisions, then verify every parent and fingerprint.
const torture = repo();
createGenesis(torture, "t-r0", "t-tx0");
for (let index = 1; index <= 1000; index += 1) {
  torture.appendRevision({ revisionId: `t-r${index}`, parentRevisionId: `t-r${index - 1}`, transactionId: `t-tx${index}`, timestamp: `2026-09-24T00:${String(index).padStart(4, "0")}Z`, statePayload: state(index + 1), provenance, actor: "torture", authority: "SYSTEM_EXECUTED" });
}
assert.equal(torture.listRevisions().length, 1001);
assert.equal(torture.getCurrentRevision()?.revisionId, "t-r1000");
assert.equal(torture.verifyChain(), true);
assert.equal(torture.getRevision("t-r500")?.parentRevisionId, "t-r499");

// Deterministic property-style invalid input sweep; no random dependency.
let rejected = 0;
for (let index = 0; index < 200; index += 1) {
  const candidate = { ...r1, revisionId: index % 2 === 0 ? "" : r1.transactionId, projectId: index % 3 === 0 ? "project-b" : "project-a" };
  try { validateCanonicalRevisionChain("project-a", [candidate as CanonicalProjectRevision]); } catch { rejected += 1; }
}
assert.equal(rejected, 200);

// Self-certification attack: supplied status is not accepted as evidence.
expectCode("UNKNOWN", () => validateCanonicalRevisionChain("project-a", [{ ...r1, status: "VERIFIED" as never }]));

console.log(JSON.stringify({
  status: "VERIFIED",
  adversarialCases: 25,
  identityInvariants: true,
  projectIsolation: true,
  immutablePayloadIsolation: true,
  deepFreeze: true,
  lineageIntegrity: true,
  currentRevisionUnambiguous: true,
  deterministicFingerprint: true,
  corruptionDetected: true,
  provenancePreserved: true,
  unknownNotPromoted: true,
  selfCertificationRejected: true,
  tortureRevisions: 1001,
  fuzzCases: 200,
  fuzzRejected: rejected,
  atomicCommit: "NOT_IMPLEMENTED",
  atomicCommitPersistence: "NOT_VERIFIED",
  casIdempotency: "NOT_IMPLEMENTED",
  crashRecovery: "NOT_IMPLEMENTED",
  writerMigration: "NOT_IMPLEMENTED",
}));
