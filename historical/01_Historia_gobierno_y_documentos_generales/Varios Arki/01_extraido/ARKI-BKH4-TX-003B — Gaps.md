# ARKI-BKH4-TX-003B — Gaps

1. Evidence is `fake-indexeddb`; real browser IndexedDB was not tested.
2. `idempotency` store exists structurally but durable idempotency behavior belongs to TX-003C.
3. CAS against the current durable revision belongs to TX-003C.
4. Process interruption and restart reconciliation belong to TX-003D.
5. The durable API does not yet establish the global canonical writer; legacy writers remain.
6. No ProjectContext or writer migration was performed.
7. No rollback, undo, redo, or compensating transaction was implemented.
8. The durable schema currently stores canonical revisions and related records but does not yet enforce the full revision chain against persisted current state; that boundary belongs to later CAS/repository integration.

The result must remain `PARTIAL / EMULATED_EVIDENCE` until a real browser/headless IndexedDB environment verifies the same claims.
