# ARKI-BKH4-TX-003A — Implementation Report

## Scope

TX-003A implements an isolated, in-memory `CanonicalProjectRepository`. It establishes canonical project/revision identity, parent lineage, defensive payload isolation, deterministic fingerprints, provenance preservation, explicit current revision retrieval, and fail-closed corruption validation.

It does **not** implement atomic persistence, CAS persistence, durable idempotency, recovery, rollback, undo/redo, or writer migration.

## Baseline

The repository is `/home/ubuntu/generador-familias`, branch `main`, at the HEAD recorded in `BKH4_TX_003A_GIT_DISCIPLINE.txt`. The worktree was dirty before TX-003A and contains pre-existing UI, BKH, E8, CAD, contract, and evidence artifacts. The existing `ProjectContext → setBuilding` writer was not migrated.

## Code delta

Created:

- `shared/arkiCanonicalProjectRepository.ts`
- `scripts/test-bkh4-tx-003a-repository.ts`
- `scripts/run-bkh4-tx-003a-evidence.sh`

No existing product file was modified to route UI or legacy writers through the repository.

## Implemented authority

`CanonicalProjectRepository` is a bounded repository authority, not a React context, simulation store, generic application state container, or second BIM model. It stores immutable internal revision records in memory and returns defensive clones to callers.

The repository enforces distinct `projectId`, `revisionId`, and `transactionId`; one transaction cannot create multiple revisions; a new revision must extend the current revision; silent forks are rejected; current revision is tracked explicitly rather than inferred from order or timestamps; and fingerprints are computed from canonical JSON state using sorted object keys.

## Epistemic and authority limits

Repository integrity is not professional architectural correctness. Supplied statuses such as `VERIFIED` are rejected as unsupported revision statuses. `UNKNOWN` is not promoted to a canonical status. `HUMAN_AUTHORIZED` and system authority labels are preserved as provenance/authority metadata; the repository does not decide for the Product Owner.

## Result

The repository implementation is **VERIFIED FOR THE ISOLATED TX-003A SCOPE**. The global application does not yet have one effective canonical writer because legacy writers remain active and were intentionally not migrated.
