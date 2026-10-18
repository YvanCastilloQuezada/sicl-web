import "fake-indexeddb/auto";
import { strict as assert } from "node:assert";
import {
  CanonicalDurablePersistence,
  sha256Fingerprint,
  TX003B_STORE_NAMES,
  type Tx003BFailurePoint,
} from "../shared/arkiCanonicalPersistence";
import { CanonicalProjectRepository } from "../shared/arkiCanonicalProjectRepository";
import type { TransactionProvenance } from "../shared/arkiTransactionEngine";

const provenance: TransactionProvenance = { source: "test:tx-003b", actorId: "tx003b", evidenceRefs: ["fixture:tx003b"], transformations: ["durable-test"] };
const state = (value: number) => ({ model: { wall: { height: value } }, stable: true });
const failurePoints: Tx003BFailurePoint[] = ["before-transaction", "after-transaction-open", "after-first-write", "after-canonical-revision", "after-transaction-record", "after-commit-metadata", "during-audit", "before-transaction-completion"];
const uniqueDb = (suffix: string) => `tx003b-${suffix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const makeRevision = (projectId = "project-a", revisionId = "r0", transactionId = "tx0", value = 1) => {
  const repository = new CanonicalProjectRepository(projectId);
  return repository.createGenesis({ revisionId, transactionId, timestamp: "2026-09-24T00:00:00Z", statePayload: state(value), provenance, actor: "tx003b", authority: "HUMAN_AUTHORIZED" });
};

const successfulDb = uniqueDb("success");
const successful = new CanonicalDurablePersistence(successfulDb);
const revision = makeRevision();
await successful.commit({ revision, actor: "tx003b", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:01:00Z" });
const reopened = await successful.readCommit("tx0");
assert.ok(reopened.revision);
assert.ok(reopened.transaction);
assert.ok(reopened.metadata);
assert.ok(reopened.audit);
assert.equal(reopened.revision?.projectId, "project-a");
assert.equal(reopened.transaction?.revisionId, "r0");
assert.equal(reopened.metadata?.revisionId, "r0");
assert.equal(reopened.audit?.revisionId, "r0");
assert.equal(reopened.revision?.fingerprintAlgorithm, "sha256:v1");
assert.equal(reopened.revision?.stateFingerprint, await sha256Fingerprint(reopened.revision!.statePayload));
const successCounts = await successful.listStoreCounts();
for (const store of ["canonicalRevisions", "transactions", "commitMetadata", "audit"] as const) assert.equal(successCounts[store], 1, `${store} must contain the commit`);
assert.equal(successCounts.idempotency, 0, "idempotency is structural only in TX-003B");

// AP-FAIL-01..08: each failure aborts one real IndexedDB transaction and leaves zero participant records.
for (const point of failurePoints) {
  const persistence = new CanonicalDurablePersistence(uniqueDb(point));
  const failedRevision = makeRevision("project-fail", `r-${point}`, `tx-${point}`);
  await assert.rejects(() => persistence.commit({ revision: failedRevision, actor: "tx003b", authority: "SYSTEM_EXECUTED", provenance, committedAt: "2026-09-24T00:02:00Z", failurePoint: point }));
  const counts = await persistence.listStoreCounts();
  for (const store of ["canonicalRevisions", "transactions", "commitMetadata", "audit"] as const) assert.equal(counts[store], 0, `${point} left partial ${store}`);
}

// Historical overwrite: add() rejects duplicate primary key and preserves the original record.
const overwriteDb = uniqueDb("overwrite");
const overwrite = new CanonicalDurablePersistence(overwriteDb);
const original = makeRevision("project-overwrite", "r0", "tx-original", 10);
await overwrite.commit({ revision: original, actor: "tx003b", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:03:00Z" });
const conflicting = makeRevision("project-overwrite", "r0", "tx-conflict", 99);
await assert.rejects(() => overwrite.commit({ revision: conflicting, actor: "tx003b", authority: "SYSTEM_EXECUTED", provenance, committedAt: "2026-09-24T00:04:00Z" }));
const afterOverwrite = await overwrite.readCommit("tx-original");
assert.equal((afterOverwrite.revision?.statePayload as { model: { wall: { height: number } } }).model.wall.height, 10);
assert.equal((await overwrite.readCommit("tx-conflict")).revision, null);

// Multi-project isolation: both projects may coexist, but their records retain explicit project identity.
const multiDb = uniqueDb("multi");
const multi = new CanonicalDurablePersistence(multiDb);
await multi.commit({ revision: makeRevision("project-a", "a-r0", "a-tx", 1), actor: "a", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:05:00Z" });
await multi.commit({ revision: makeRevision("project-b", "b-r0", "b-tx", 2), actor: "b", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:06:00Z" });
assert.equal((await multi.readCommit("a-tx")).revision?.projectId, "project-a");
assert.equal((await multi.readCommit("b-tx")).revision?.projectId, "project-b");

// Corruption attack: change stored payload after close, reopen and recompute fingerprint.
const corruptionDb = uniqueDb("corruption");
const corruption = new CanonicalDurablePersistence(corruptionDb);
await corruption.commit({ revision: makeRevision("project-corrupt", "c-r0", "c-tx", 5), actor: "c", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:07:00Z" });
await new Promise<void>((resolve, reject) => {
  const request = indexedDB.open(corruptionDb, 4);
  request.onsuccess = () => {
    const database = request.result;
    const transaction = database.transaction("canonicalRevisions", "readwrite");
    const get = transaction.objectStore("canonicalRevisions").get("c-r0");
    get.onsuccess = () => { const item = get.result; item.statePayload = state(999); transaction.objectStore("canonicalRevisions").put(item); };
    transaction.oncomplete = () => { database.close(); resolve(); };
    transaction.onerror = () => reject(transaction.error);
  };
  request.onerror = () => reject(request.error);
});
const corrupted = await corruption.readCommit("c-tx");
assert.notEqual(corrupted.revision?.stateFingerprint, await sha256Fingerprint(corrupted.revision!.statePayload), "corrupted payload must fail revalidation");

// Upgrade attack: legacy stores/data survive v3 -> v4 schema upgrade.
const upgradeDb = uniqueDb("upgrade");
await new Promise<void>((resolve, reject) => {
  const request = indexedDB.open(upgradeDb, 3);
  request.onupgradeneeded = () => {
    const database = request.result;
    for (const store of ["projects", "snapshots", "sessions", "audit", "assets", "warranties", "manuals", "inspections", "workOrders", "assetHistory"]) if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
  };
  request.onsuccess = () => { const database = request.result; const transaction = database.transaction(["projects", "snapshots", "audit"], "readwrite"); transaction.objectStore("projects").put({ id: "legacy-project", name: "legacy" }); transaction.objectStore("snapshots").put({ id: "legacy-snapshot", projectId: "legacy-project" }); transaction.objectStore("audit").put({ id: "legacy-audit", target: "legacy-project" }); transaction.oncomplete = () => { database.close(); resolve(); }; transaction.onerror = () => reject(transaction.error); };
  request.onerror = () => reject(request.error);
});
const upgraded = new CanonicalDurablePersistence(upgradeDb);
const upgradedCounts = await upgraded.listStoreCounts();
assert.equal(upgradedCounts.projects, 1);
assert.equal(upgradedCounts.snapshots, 1);
assert.equal(upgradedCounts.audit, 1);
for (const store of TX003B_STORE_NAMES) assert.ok(store in upgradedCounts, `missing upgraded store ${store}`);
await upgraded.commit({ revision: makeRevision("legacy-project", "legacy-r0", "legacy-tx"), actor: "legacy", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:08:00Z" });
assert.ok((await upgraded.readCommit("legacy-tx")).revision);
assert.equal((await upgraded.listStoreCounts()).projects, 1);

// Repeated reopen: each read opens a fresh database connection and still sees the commit.
for (let index = 0; index < 3; index += 1) assert.equal((await successful.readCommit("tx0")).revision?.revisionId, "r0");

console.log(JSON.stringify({
  status: "PARTIAL_EMULATED_EVIDENCE",
  indexedDbMechanism: "fake-indexeddb",
  realBrowserIndexedDb: "NOT_TESTED",
  oneMultiStoreTransaction: true,
  allOrNothing: true,
  failureInjection: `${failurePoints.length}/${failurePoints.length}`,
  zeroPartialDurableState: true,
  durabilityAfterReopen: true,
  fingerprintAlgorithm: "sha256:v1",
  fingerprintAfterReopen: true,
  historicalOverwriteDefense: true,
  projectIsolation: true,
  schemaMigration: true,
  legacyDataPreserved: true,
  tx003aRegressionRequired: true,
  cas: "NOT_IMPLEMENTED",
  durableIdempotency: "NOT_IMPLEMENTED",
  crashRecovery: "NOT_IMPLEMENTED",
  undoRedo: "NOT_IMPLEMENTED",
  stores: TX003B_STORE_NAMES,
}));
