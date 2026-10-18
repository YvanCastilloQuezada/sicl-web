# ARKI-BKH4-TX-002 — Design Gaps and Implementation Prerequisites

1. `CanonicalProjectRepository` is selected conceptually but not implemented.
2. IndexedDB currently lacks canonical-revision, transaction, idempotency, and commit-metadata stores.
3. Current writes use separate object-store transactions rather than one atomic multi-store boundary.
4. `saveArkiVersion` currently targets `ARKI_PROJECT_STORE`; this must be corrected or explicitly migrated in a later implementation order.
5. No durable restart recovery test exists.
6. No failure-injection harness exists for the five crash scenarios.
7. No writer migration has been authorized or performed.
8. `ProjectContext` remains a direct in-memory state writer until TX-005.
9. Replay is limited by the absence of a transaction history implementation.

These are implementation prerequisites, not evidence that TX-003 has been executed.
