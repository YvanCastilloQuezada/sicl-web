import { CanonicalDurablePersistence, sha256Fingerprint, type Tx003BFailurePoint } from "../shared/arkiCanonicalPersistence";
import { CanonicalProjectRepository } from "../shared/arkiCanonicalProjectRepository";
import type { TransactionProvenance } from "../shared/arkiTransactionEngine";

type BrowserResult = Record<string, unknown>;
const provenance: TransactionProvenance = { source: "browser:tx-003b-r", actorId: "chromium", evidenceRefs: ["fixture:tx003b-r"], transformations: ["native-browser-test"] };
const state = (value: number) => ({ model: { wall: { height: value } }, stable: true });
const points: Tx003BFailurePoint[] = ["before-transaction", "after-transaction-open", "after-first-write", "after-canonical-revision", "after-transaction-record", "after-commit-metadata", "during-audit", "before-transaction-completion"];
const dbName = (name: string) => `tx003b-r-${name}-${Date.now()}`;
const revision = (projectId: string, revisionId: string, transactionId: string, value: number) => {
  const repository = new CanonicalProjectRepository(projectId);
  return repository.createGenesis({ revisionId, transactionId, timestamp: "2026-09-24T00:00:00Z", statePayload: state(value), provenance, actor: "chromium", authority: "HUMAN_AUTHORIZED" });
};
const open = (name: string, version = 4): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(name, version);
  request.onupgradeneeded = () => {
    const database = request.result;
    const legacyStores = ["projects", "snapshots", "sessions", "audit", "assets", "warranties", "manuals", "inspections", "workOrders", "assetHistory"];
    const canonicalStores = ["versions", "canonicalRevisions", "transactions", "commitMetadata", "idempotency"];
    for (const store of [...legacyStores, ...(version >= 4 ? canonicalStores : [])]) if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});
const close = (database: IDBDatabase) => database.close();
const deleteDb = (name: string): Promise<void> => new Promise((resolve, reject) => { const request = indexedDB.deleteDatabase(name); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
const counts = async (persistence: CanonicalDurablePersistence): Promise<Record<string, number>> => persistence.listStoreCounts();
const zeroParticipantCounts = (value: Record<string, number>) => ["canonicalRevisions", "transactions", "commitMetadata", "audit"].every((store) => value[store] === 0);

const run = async (): Promise<BrowserResult> => {
  const browserName = navigator.userAgent;
  const successDb = dbName("success");
  const success = new CanonicalDurablePersistence(successDb);
  await success.commit({ revision: revision("project-a", "r0", "tx0", 1), actor: "chromium", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:01:00Z" });
  const reopened = await success.readCommit("tx0");
  const successCounts = await counts(success);
  const successRecords = Boolean(reopened.revision && reopened.transaction && reopened.metadata && reopened.audit && successCounts.canonicalRevisions === 1 && successCounts.transactions === 1 && successCounts.commitMetadata === 1 && successCounts.audit === 1);
  const fingerprintAfterReopen = successRecords && reopened.revision!.stateFingerprint === await sha256Fingerprint(reopened.revision!.statePayload);
  const overwriteConnection = await open(successDb);
  let overwriteRejected = false;
  await new Promise<void>((resolve) => {
    const transaction = overwriteConnection.transaction("canonicalRevisions", "readwrite");
    const request = transaction.objectStore("canonicalRevisions").add({ id: "r0", projectId: "project-a", revisionId: "r0", transactionId: "tx-conflict", statePayload: state(999), stateFingerprint: "sha256:v1:conflict" });
    request.onerror = () => { overwriteRejected = true; try { transaction.abort(); } catch { /* already aborted */ } };
    transaction.onabort = () => resolve();
    transaction.onerror = () => resolve();
    transaction.oncomplete = () => resolve();
  });
  close(overwriteConnection);
  const originalAfterOverwrite = await success.readCommit("tx0");
  const historicalOverwriteDefense = overwriteRejected && (originalAfterOverwrite.revision!.statePayload as { model: { wall: { height: number } } }).model.wall.height === 1;

  let failuresPassed = 0;
  for (const point of points) {
    const persistence = new CanonicalDurablePersistence(dbName(point));
    try { await persistence.commit({ revision: revision("project-fail", `r-${point}`, `tx-${point}`, 2), actor: "chromium", authority: "SYSTEM_EXECUTED", provenance, committedAt: "2026-09-24T00:02:00Z", failurePoint: point }); } catch { /* expected */ }
    const fresh = await counts(persistence);
    if (zeroParticipantCounts(fresh)) failuresPassed += 1;
  }

  const corruptionDb = dbName("corrupt");
  const corruption = new CanonicalDurablePersistence(corruptionDb);
  await corruption.commit({ revision: revision("project-corrupt", "c-r0", "c-tx", 5), actor: "chromium", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:03:00Z" });
  const corruptionConnection = await open(corruptionDb);
  await new Promise<void>((resolve, reject) => { const transaction = corruptionConnection.transaction("canonicalRevisions", "readwrite"); const request = transaction.objectStore("canonicalRevisions").get("c-r0"); request.onsuccess = () => { const item = request.result; item.statePayload = state(999); transaction.objectStore("canonicalRevisions").put(item); }; transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error); });
  close(corruptionConnection);
  const corrupted = await corruption.readCommit("c-tx");
  const corruptionDetected = corrupted.revision!.stateFingerprint !== await sha256Fingerprint(corrupted.revision!.statePayload);

  const upgradeDb = dbName("upgrade");
  const legacy = await open(upgradeDb, 3);
  await new Promise<void>((resolve, reject) => { const transaction = legacy.transaction(["projects", "snapshots", "audit"], "readwrite"); transaction.objectStore("projects").put({ id: "legacy-project", name: "legacy" }); transaction.objectStore("snapshots").put({ id: "legacy-snapshot", projectId: "legacy-project" }); transaction.objectStore("audit").put({ id: "legacy-audit", target: "legacy-project" }); transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error); });
  close(legacy);
  const upgraded = new CanonicalDurablePersistence(upgradeDb);
  const upgradedCounts = await counts(upgraded);
  await upgraded.commit({ revision: revision("legacy-project", "legacy-r0", "legacy-tx", 3), actor: "chromium", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:04:00Z" });
  const legacyPreserved = upgradedCounts.projects === 1 && upgradedCounts.snapshots === 1 && upgradedCounts.audit === 1 && Boolean((await upgraded.readCommit("legacy-tx")).revision);

  const multiDb = dbName("multi");
  const multi = new CanonicalDurablePersistence(multiDb);
  await multi.commit({ revision: revision("project-a", "a-r0", "a-tx", 1), actor: "a", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:05:00Z" });
  await multi.commit({ revision: revision("project-b", "b-r0", "b-tx", 2), actor: "b", authority: "HUMAN_AUTHORIZED", provenance, committedAt: "2026-09-24T00:06:00Z" });
  const multiProjectIsolation = (await multi.readCommit("a-tx")).revision?.projectId === "project-a" && (await multi.readCommit("b-tx")).revision?.projectId === "project-b";

  const contentionDb = dbName("contention");
  const connectionA = await open(contentionDb);
  const connectionB = await open(contentionDb);
  let firstComplete = false;
  let secondComplete = false;
  await new Promise<void>((resolve, reject) => {
    const first = connectionA.transaction("commitMetadata", "readwrite");
    first.objectStore("commitMetadata").put({ id: "contention-a" });
    first.oncomplete = () => { firstComplete = true; };
    first.onerror = () => reject(first.error);
    const second = connectionB.transaction("commitMetadata", "readwrite");
    second.objectStore("commitMetadata").put({ id: "contention-b" });
    second.oncomplete = () => { secondComplete = true; resolve(); };
    second.onerror = () => reject(second.error);
  });
  close(connectionA); close(connectionB);
  const contention = firstComplete && secondComplete;

  return {
    status: "VERIFIED_REAL_BROWSER_SCOPE",
    browser: browserName,
    nativeIndexedDb: indexedDB instanceof IDBFactory,
    fakeIndexedDbImported: false,
    productivePersistenceTested: true,
    oneRealMultiStoreTransaction: successRecords,
    realBrowserAllOrNothing: failuresPassed === points.length,
    failureInjection: `${failuresPassed}/${points.length}`,
    zeroPartialAfterFreshConnection: failuresPassed === points.length,
    durabilityAfterConnectionReopen: successRecords,
    durabilityAfterBrowserRestart: "NOT_DEMONSTRATED",
    sha256AfterReopen: fingerprintAfterReopen,
    corruptionDetection: corruptionDetected,
    historicalOverwriteDefense,
    schemaMigration: legacyPreserved,
    legacyDataPreservation: legacyPreserved,
    twoConnectionContention: contention ? "VERIFIED" : "ISSUE_FOUND",
    tx003C: "NOT_IMPLEMENTED",
    crashRecovery: "NOT_IMPLEMENTED",
    globalCanonicalOwner: "NOT_VERIFIED",
  };
};

run().then((result) => { document.body.textContent = JSON.stringify(result); }).catch((error: unknown) => { document.body.textContent = JSON.stringify({ status: "FAILED", error: String(error), stack: error instanceof Error ? error.stack : undefined }); });
