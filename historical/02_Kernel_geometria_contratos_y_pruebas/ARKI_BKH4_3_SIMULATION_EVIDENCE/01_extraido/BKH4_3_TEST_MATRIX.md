# BKH4-3 Test Matrix

| Scenario | Expected | Observed |
|---|---|---|
| Valid isolated mutation | COMPLETED | PASS |
| Equivalent repeated simulation | semantic equality | PASS |
| Base version stale | STALE; no retry/rebase | PASS |
| Constraint satisfied | SATISFIED; simulation continues | PASS |
| Constraint violated | INVALID | PASS |
| Constraint unknown | UNKNOWN | PASS |
| Missing entity dependency | UNKNOWN + MISSING_DEPENDENCY | PASS |
| Regeneration blocked | BLOCKED | PASS |
| Regeneration failed | FAILED | PASS |
| Malformed transaction | rejected | PASS |
| Relationship impact | reused BKH-1 fabric | PASS |
| Commit path | absent | PASS |

## Contract test applicability

Tests requiring commit, atomic persistence, rollback, undo, redo, crash recovery, legacy migration and worksharing remain `NOT_APPLICABLE_YET`. They are not converted into PASS by this order.

## Regression suite

`pnpm check`, `pnpm build`, BKH-1, BKH-2, BKH-3, 92A, 93C, BKH4 foundation and BKH4-3 all exited with code 0.
