import {
  ARKI_AUDIT_STORE,
  ARKI_ASSET_HISTORY_STORE,
  ARKI_ASSET_STORE,
  ARKI_CANONICAL_REVISION_STORE,
  ARKI_COMMIT_METADATA_STORE,
  ARKI_IDEMPOTENCY_STORE,
  ARKI_INSPECTION_STORE,
  ARKI_MANUAL_STORE,
  ARKI_PERSISTENCE_DB,
  ARKI_PERSISTENCE_VERSION,
  ARKI_PROJECT_STORE,
  ARKI_SESSION_STORE,
  ARKI_SNAPSHOT_STORE,
  ARKI_TRANSACTION_STORE,
  ARKI_VERSION_STORE,
  ARKI_WARRANTY_STORE,
  ARKI_WORK_ORDER_STORE,
} from "./persistence/arkiPersistence";
import { canonicalStateSerialization, type CanonicalProjectState, type CanonicalProjectRevision } from "./arkiCanonicalProjectRepository";
import type { TransactionProvenance } from "./arkiTransactionEngine";

export const TX003B_FINGERPRINT_ALGORITHM = "sha256:v1" as const;

export type Tx003BFailurePoint =
  | "before-transaction"
  | "after-transaction-open"
  | "after-first-write"
  | "after-canonical-revision"
  | "after-transaction-record"
  | "after-commit-metadata"
  | "during-audit"
  | "before-transaction-completion";

export type DurableCanonicalRevisionRecord = Readonly<{
  id: string;
  projectId: string;
  revisionId: string;
  parentRevisionId: string | null;
  transactionId: string;
  timestamp: string;
  statePayload: CanonicalProjectState;
  stateFingerprint: string;
  fingerprintAlgorithm: typeof TX003B_FINGERPRINT_ALGORITHM;
  provenance: TransactionProvenance;
  actor: string;
  authority: CanonicalProjectRevision["authority"];
  status: CanonicalProjectRevision["status"];
}>;

export type DurableTransactionRecord = Readonly<{
  id: string;
  transactionId: string;
  projectId: string;
  revisionId: string;
  status: "COMMITTED";
  createdAt: string;
}>;

export type DurableCommitMetadata = Readonly<{
  id: string;
  transactionId: string;
  projectId: string;
  revisionId: string;
  fingerprint: string;
  committedAt: string;
}>;

export type DurableCanonicalAudit = Readonly<{
  id: string;
  transactionId: string;
  projectId: string;
  revisionId: string;
  actor: string;
  authority: string;
  provenance: TransactionProvenance;
  recordedAt: string;
}>;

export type DurableCommitInput = {
  revision: CanonicalProjectRevision;
  actor: string;
  authority: CanonicalProjectRevision["authority"];
  provenance: TransactionProvenance;
  committedAt: string;
  failurePoint?: Tx003BFailurePoint;
};

const stores = [
  ARKI_SNAPSHOT_STORE,
  ARKI_SESSION_STORE,
  ARKI_PROJECT_STORE,
  ARKI_VERSION_STORE,
  ARKI_AUDIT_STORE,
  ARKI_ASSET_STORE,
  ARKI_WARRANTY_STORE,
  ARKI_MANUAL_STORE,
  ARKI_INSPECTION_STORE,
  ARKI_WORK_ORDER_STORE,
  ARKI_ASSET_HISTORY_STORE,
  ARKI_CANONICAL_REVISION_STORE,
  ARKI_TRANSACTION_STORE,
  ARKI_COMMIT_METADATA_STORE,
  ARKI_IDEMPOTENCY_STORE,
] as const;

export class CanonicalPersistenceError extends Error {
  readonly code: "INVALID" | "CORRUPTED" | "DURABILITY";
  constructor(code: CanonicalPersistenceError["code"], message: string) {
    super(`${code}: ${message}`);
    this.name = "CanonicalPersistenceError";
    this.code = code;
  }
}

const requestResult = <T>(request: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new CanonicalPersistenceError("DURABILITY", "IndexedDB request failed"));
});

const transactionDone = (transaction: IDBTransaction): Promise<void> => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error ?? new CanonicalPersistenceError("DURABILITY", "IndexedDB transaction failed"));
  transaction.onabort = () => reject(transaction.error ?? new CanonicalPersistenceError("DURABILITY", "IndexedDB transaction aborted"));
});

const ensureFailure = (failurePoint: Tx003BFailurePoint | undefined, expected: Tx003BFailurePoint): void => {
  if (failurePoint === expected) throw new CanonicalPersistenceError("DURABILITY", `controlled failure at ${expected}`);
};

export const sha256Fingerprint = async (state: CanonicalProjectState): Promise<string> => {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new CanonicalPersistenceError("DURABILITY", "Web Crypto SHA-256 is unavailable");
  const bytes = new TextEncoder().encode(canonicalStateSerialization(state));
  const digest = await subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${TX003B_FINGERPRINT_ALGORITHM}:${hex}`;
};

const openDatabase = (dbName: string): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(dbName, ARKI_PERSISTENCE_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    for (const store of stores) {
      if (!database.objectStoreNames.contains(store)) database.createObjectStore(store, { keyPath: "id" });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new CanonicalPersistenceError("DURABILITY", "IndexedDB open failed"));
});

const closeQuietly = (database: IDBDatabase): void => {
  try { database.close(); } catch { /* close is best effort */ }
};

export const createDurableRevision = async (revision: CanonicalProjectRevision): Promise<DurableCanonicalRevisionRecord> => ({
  id: revision.revisionId,
  projectId: revision.projectId,
  revisionId: revision.revisionId,
  parentRevisionId: revision.parentRevisionId,
  transactionId: revision.transactionId,
  timestamp: revision.timestamp,
  statePayload: JSON.parse(JSON.stringify(revision.statePayload)) as CanonicalProjectState,
  stateFingerprint: await sha256Fingerprint(revision.statePayload),
  fingerprintAlgorithm: TX003B_FINGERPRINT_ALGORITHM,
  provenance: JSON.parse(JSON.stringify(revision.provenance)) as TransactionProvenance,
  actor: revision.actor,
  authority: revision.authority,
  status: revision.status,
});

export class CanonicalDurablePersistence {
  readonly dbName: string;
  constructor(dbName = ARKI_PERSISTENCE_DB) {
    this.dbName = dbName;
  }

  async commit(input: DurableCommitInput): Promise<void> {
    ensureFailure(input.failurePoint, "before-transaction");
    const durableRevision = await createDurableRevision(input.revision);
    const transactionRecord: DurableTransactionRecord = { id: input.revision.transactionId, transactionId: input.revision.transactionId, projectId: input.revision.projectId, revisionId: input.revision.revisionId, status: "COMMITTED", createdAt: input.committedAt };
    const commitMetadata: DurableCommitMetadata = { id: input.revision.transactionId, transactionId: input.revision.transactionId, projectId: input.revision.projectId, revisionId: input.revision.revisionId, fingerprint: durableRevision.stateFingerprint, committedAt: input.committedAt };
    const audit: DurableCanonicalAudit = { id: `${input.revision.transactionId}:audit`, transactionId: input.revision.transactionId, projectId: input.revision.projectId, revisionId: input.revision.revisionId, actor: input.actor, authority: input.authority, provenance: input.provenance, recordedAt: input.committedAt };
    const database = await openDatabase(this.dbName);
    const transaction = database.transaction([ARKI_CANONICAL_REVISION_STORE, ARKI_TRANSACTION_STORE, ARKI_COMMIT_METADATA_STORE, ARKI_AUDIT_STORE, ARKI_IDEMPOTENCY_STORE], "readwrite");
    try {
      ensureFailure(input.failurePoint, "after-transaction-open");
      await requestResult(transaction.objectStore(ARKI_CANONICAL_REVISION_STORE).add(durableRevision));
      ensureFailure(input.failurePoint, "after-first-write");
      ensureFailure(input.failurePoint, "after-canonical-revision");
      await requestResult(transaction.objectStore(ARKI_TRANSACTION_STORE).add(transactionRecord));
      ensureFailure(input.failurePoint, "after-transaction-record");
      await requestResult(transaction.objectStore(ARKI_COMMIT_METADATA_STORE).add(commitMetadata));
      ensureFailure(input.failurePoint, "after-commit-metadata");
      await requestResult(transaction.objectStore(ARKI_AUDIT_STORE).add(audit));
      ensureFailure(input.failurePoint, "during-audit");
      ensureFailure(input.failurePoint, "before-transaction-completion");
      await transactionDone(transaction);
    } catch (error) {
      try { transaction.abort(); } catch { /* already aborted */ }
      throw error;
    } finally {
      closeQuietly(database);
    }
  }

  async readCommit(transactionId: string): Promise<{ revision: DurableCanonicalRevisionRecord | null; transaction: DurableTransactionRecord | null; metadata: DurableCommitMetadata | null; audit: DurableCanonicalAudit | null }> {
    const database = await openDatabase(this.dbName);
    try {
      const transaction = database.transaction([ARKI_CANONICAL_REVISION_STORE, ARKI_TRANSACTION_STORE, ARKI_COMMIT_METADATA_STORE, ARKI_AUDIT_STORE], "readonly");
      const revision = await requestResult(transaction.objectStore(ARKI_CANONICAL_REVISION_STORE).getAll()) as DurableCanonicalRevisionRecord[];
      const transactions = await requestResult(transaction.objectStore(ARKI_TRANSACTION_STORE).get(transactionId)) as DurableTransactionRecord | undefined;
      const metadata = await requestResult(transaction.objectStore(ARKI_COMMIT_METADATA_STORE).get(transactionId)) as DurableCommitMetadata | undefined;
      const audit = await requestResult(transaction.objectStore(ARKI_AUDIT_STORE).get(`${transactionId}:audit`)) as DurableCanonicalAudit | undefined;
      await transactionDone(transaction);
      return { revision: revision.find((item) => item.transactionId === transactionId) ?? null, transaction: transactions ?? null, metadata: metadata ?? null, audit: audit ?? null };
    } finally {
      closeQuietly(database);
    }
  }

  async listStoreCounts(): Promise<Record<string, number>> {
    const database = await openDatabase(this.dbName);
    try {
      const transaction = database.transaction([...stores], "readonly");
      const counts: Record<string, number> = {};
      for (const store of stores) counts[store] = await requestResult(transaction.objectStore(store).count());
      await transactionDone(transaction);
      return counts;
    } finally {
      closeQuietly(database);
    }
  }

  async deleteDatabase(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(this.dbName);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error ?? new CanonicalPersistenceError("DURABILITY", "IndexedDB delete failed"));
    });
  }
}

export const TX003B_STORE_NAMES = stores;
