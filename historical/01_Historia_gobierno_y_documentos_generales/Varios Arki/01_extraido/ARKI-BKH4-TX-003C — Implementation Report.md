# ARKI-BKH4-TX-003C — Implementation Report

## Verdict

`TX-003C = VERIFIED FOR CAS + DURABLE IDEMPOTENCY BOUNDED SCOPE`

The implementation adds a compare-and-swap boundary and durable idempotency to `CanonicalDurablePersistence`. It does not claim global writer migration or global canonical ownership.

## Implemented boundary

`durableCurrentRevision` is stored in `commitMetadata` under `current:<projectId>`. The pointer, canonical revision, transaction record, commit metadata, audit record, and idempotency record are written in the same IndexedDB `readwrite` transaction.

The CAS request requires `projectId`, `transactionId`, `expectedRevisionId`, and `newRevisionId`. Genesis is explicit with `expectedRevisionId: null` and is accepted only when no durable current exists for the project. A missing current pointer in a project that already has revisions fails closed as `CORRUPTED_CURRENT`.

Revision keys are scoped as `projectId:revisionId`, preserving multi-project isolation while retaining the logical `revisionId` in the record. The transaction ID remains the durable idempotency key.

## Idempotency

The durable request fingerprint uses `sha256:v1` over canonical sorted-key data containing project, transaction, expected revision, new revision, parent, timestamp, state payload, actor, authority, and provenance. Same request retries return `REPLAYED`. Reuse with a different project or payload produces `IDEMPOTENCY_CONFLICT`.

## Scope limits

TX-003C does not implement TX-003D crash recovery, rollback, reversal, undo, redo, writer migration, ProjectContext migration, ARKI-SEC, CAD, GEO, ABB-001, or the Master Validation Harness.
