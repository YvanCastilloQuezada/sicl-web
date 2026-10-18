# ARKI-BKH4-TX-002 — Canonical State Owner + Atomic Persistence Boundary

## Result

**DESIGN LOCK COMPLETE — IMPLEMENTATION NOT AUTHORIZED BY THIS ORDER**

The design selects a conceptual `CanonicalProjectRepository` as the only authority for canonical project state. It does not yet exist as a product implementation. `ProjectContext` is assigned the future role of UI working projection, not canonical authority.

The selected persistence boundary is a single IndexedDB database transaction spanning all stores required for one commit. The browser primitive is suitable for a local atomic unit across object stores, but the current adapter opens separate transactions per record and has no transaction, idempotency, canonical-revision, or recovery stores. Therefore the design is viable, while current product readiness is **PARTIAL**.

## Decision A — canonical owner

The future canonical owner is:

```text
CanonicalProjectRepository
```

It will own the authoritative revision chain and expose governed operations for proposing, validating, authorizing, and committing a transaction. It will not be a second model parallel to `ProjectSnapshot`; it will be the repository boundary that stores canonical revisions and uses existing snapshot/model contracts as payloads where compatible.

The following are not canonical owners:

- `ProjectContext`;
- `GeneratorModule`;
- agents and reasoners;
- CAD and IFC importers;
- recalculation functions;
- simulation state;
- derived quantities, cost, schedule, or viewer state.

## Current ProjectContext interpretation

`GeneratorModule → ProjectContext.setBuilding` currently represents in-memory UI/session state. It is best classified as a mixed working projection and cache-like view of the current generated building. It is not demonstrated to be durable, revisioned, transaction-authorized, or canonical.

Future route:

```text
CanonicalProjectRepository → read projection → ProjectContext → UI
```

`ProjectContext` must not be migrated in TX-002. Migration belongs to the later writer-migration gate.

## Canonical revision contract

The minimum future record is:

```text
CanonicalProjectRevision {
  projectId
  revisionId
  parentRevisionId
  transactionId
  timestamp
  stateReference
  provenance
  actor
  authority
  stateFingerprint
  status
}
```

`revisionId` is distinct from `transactionId`. The state payload may reuse `ProjectSnapshot` or a compatible canonical-state envelope, but the repository must own the revision chain and fingerprint verification.

## Decision B — persistence boundary

The existing database is `arki-local-first`, version 3. It currently contains object stores for snapshots, sessions, projects, audit, assets, warranties, manuals, inspections, work orders, and asset history. The adapter writes individual records through independent `database.transaction(storeName, "readwrite")` calls.

The current adapter therefore provides local persistence but not a transaction-level atomic commit boundary. It also contains a correctness gap requiring explicit handling: `saveArkiVersion` currently writes an `ArkiVersion` record to `ARKI_PROJECT_STORE` rather than a dedicated version store.

The future commit boundary should use one IndexedDB readwrite transaction that includes, at minimum:

```text
canonicalRevisions
transactions
idempotency
commitMetadata
audit
```

A single IndexedDB transaction can atomically commit writes to multiple object stores in the same database transaction. This is a capability of the selected mechanism, not evidence that the current adapter already provides it.

## One atomic commit

The atomic unit is:

```text
BEGIN one IndexedDB readwrite transaction

1. Read current canonical revision.
2. Verify expectedRevision equals currentRevision.
3. Read idempotency record by transactionId.
4. If already committed, return ALREADY_COMMITTED without effects.
5. Validate transaction intent and mutation set.
6. Write transaction intent/status.
7. Write the new canonical revision.
8. Write committed transaction result.
9. Write idempotency record keyed by transactionId.
10. Write commit metadata and audit/provenance.

COMMIT one IndexedDB transaction
```

The UI acknowledgment happens only after the durable IndexedDB transaction resolves successfully. Projection updates happen after commit and are rebuildable; projection failure must not turn a successful canonical commit into an unknown canonical outcome.

## CAS strategy

The repository must compare:

```text
expectedRevision === currentRevision
```

inside the same IndexedDB readwrite transaction that writes the new canonical revision. A mismatch produces:

```text
STALE_TRANSACTION / CONFLICT
```

There is no last-write-wins behavior for canonical state. Automatic rebase is outside this design lock.

## Idempotency strategy

The `transactionId` is the durable idempotency key. A committed transaction writes an idempotency record containing at least:

```text
transactionId
projectId
committedRevisionId
resultFingerprint
committedAt
```

A retry after restart reads the record inside the same transaction boundary and returns `ALREADY_COMMITTED` without repeating canonical effects. An in-flight or incomplete record is resolved by the atomic outcome of the enclosing IndexedDB transaction; no partially committed record is accepted as success.

## Crash semantics

| Scenario | Restart source of truth | Required result |
| --- | --- | --- |
| CRASH-01 before transaction persistence | No transaction record and no canonical revision | `NOT_COMMITTED` |
| CRASH-02 after validation before commit | No durable committed transaction and no new revision | `NOT_COMMITTED` |
| CRASH-03 during IndexedDB transaction | Atomic transaction outcome; inspect transaction/idempotency/revision records | `NOT_COMMITTED` or `COMMITTED` |
| CRASH-04 after durable commit before UI acknowledgment | Committed transaction/idempotency record and canonical revision | `COMMITTED` |
| CRASH-05 while rebuilding read model | Canonical revision and transaction result remain authoritative | `COMMITTED`; projection rebuild required if stale |

`RECOVERY_REQUIRED` is reserved for an observable inconsistency that cannot be resolved by the atomic record set. The implementation must never infer commit success from UI memory or acknowledgment state.

## Event history decision

A full event-sourcing system is **not required now**. The selected strategy is:

```text
Hybrid transaction log + canonical revisions/snapshots
```

Each committed transaction and canonical revision is durable and replayable at the transaction/revision level. This supports audit, recovery, compensating reversal, and future undo/redo without introducing a second event store. A full event store may be reconsidered only if later requirements demonstrate that revision snapshots plus transaction history are insufficient.

## Undo/redo compatibility

The design is compatible with transactional undo/redo:

```text
TX-101 COMMITTED
  → TX-102 COMPENSATING REVERSAL
  → TX-103 REAPPLICATION AFTER REVALIDATION
```

Undo never deletes historical revisions. Redo is a new transaction and must revalidate against the current revision.

## Read-model strategy

Canonical state is authoritative. Transaction history, audit, and idempotency records support recovery. UI state, read models, caches, analytics, derived state, and simulation remain downstream projections.

A failed projection update after a durable commit is a projection/rebuild problem, not a canonical commit ambiguity.

## Design gates

- `ATOMIC_COMMIT_PERSISTENCE DESIGN`: **READY**.
- Current product implementation: **PARTIAL / NOT IMPLEMENTED**.
- `BKH4-4 READY`: **NO**.
- TX-003 implementation: **NOT EXECUTED**.

The minimum next implementation sequence is `TX-003A — Canonical Repository`, followed by `TX-003B — Atomic Persistence`, `TX-003C — CAS + Idempotency`, and `TX-003D — Failure Injection + Restart`. This sequence is proposed, not executed.

## References

[1]: `client/src/persistence/arkiIndexedDb.ts` "Current ARKI IndexedDB adapter"
[2]: `shared/persistence/arkiPersistence.ts` "Current ARKI persistence contracts"
[3]: `shared/arkiTransactionEngine.ts` "Current BKH4 transaction and mutation contracts"
[4]: `client/src/contexts/ProjectContext.tsx` "Current ProjectContext implementation"
[5]: `BKH4_TX_001_PHASE_A_ADDENDUM.md` "BKH4-TX-001 Phase A audit findings"
