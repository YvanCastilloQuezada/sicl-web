# ARKI-BKH4-TX-003A — Remaining Gaps

1. The repository is in-memory; restart loses its revision map.
2. No IndexedDB transaction-level atomic commit exists.
3. No durable idempotency store exists.
4. No compare-and-swap against a durable current revision exists.
5. No crash-recovery injection or restart reconciliation exists.
6. `ProjectContext → setBuilding` remains a legacy direct writer.
7. Other generators, importers, recalculation paths, and adapters have not been migrated.
8. No compensating reversal transaction exists.
9. No undo/redo implementation exists.
10. Global one-owner enforcement cannot be claimed before TX-005 writer migration.

These gaps are intentionally not fixed in TX-003A.
