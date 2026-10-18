# BKH-4 Adversarial Test Plan v1.1

**Estado:** contractual; no implementación.

Each scenario maps one invariant to an expected result, evidence and a future implementation gate. `PASS` below means the expected behavior, not current product evidence.

| Test ID | Invariant | Scenario | Expected state/result | Required evidence | Future gate |
|---|---|---|---|---|---|
| T01 | I01 | Direct canonical writer bypasses transaction | REJECTED | Mutation-path trace | BKH4-9 |
| T02 | I02 | Simulation updates wall in memory | Canonical hash unchanged | Before/after hash | BKH4-3 |
| T03 | I03 | Same transaction revised | Same transactionId | Revision comparison | BKH4-1 |
| T04 | I04 | Revision mistaken for new transaction | REJECTED | Identity/revision report | BKH4-1 |
| T05 | I05 | Proposal without base version | INVALID | Negative test | BKH4-1 |
| T06 | I06 | Commit after base advances | STALE | V10/V11 trace | BKH4-5 |
| T07 | I07 | Two writers commit V10 | One commit; one conflict | No-overwrite evidence | BKH4-5 |
| T08 | I08 | Two canonical mutations commit | ALL or NONE | Atomic boundary report | BKH4-6 |
| T09 | I09 | Crash after first mutation | RECOVERY_REQUIRED or NOT_COMMITTED | Durable journal | BKH4-7 |
| T10 | I10 | Abort before commit | ABORTED, no rollback claim | State trace | BKH4-6 |
| T11 | I11 | Failed commit restored | Journal retained | Version/history diff | BKH4-7 |
| T12 | I12 | Undo committed wall move | New reversal, history retained | Transaction chain | BKH4-8 |
| T13 | I13 | Redo after world changes | Revalidation required | Changed-world test | BKH4-8 |
| T14 | I14 | Transaction creates relationship | BKH-1 record used | Registry provenance | BKH4-4 |
| T15 | I15 | Transaction bypasses constraint registry | REJECTED | Gate provenance | BKH4-4 |
| T16 | I16 | Transaction implements own dirty traversal | REJECTED | Delegation audit | BKH4-4 |
| T17 | I17 | Missing evidence precondition | UNKNOWN | Reasoned diagnostic | BKH4-4 |
| T18 | I18 | Generated quantity committed as fact | REJECTED | Epistemic negative test | BKH4-4 |
| T19 | I19 | Derived state not refreshed | Explicit disposition | Commit report | BKH4-6 |
| T20 | I20 | Professional approval required | AWAITING_HUMAN_DECISION | Decision record | BKH4-6 |
| T21 | I21 | Technical editor lacks authority | REJECTED | Permission/authority trace | BKH4-6 |
| T22 | I22 | Process crash during COMMITTING | RECOVERY_REQUIRED | Recovery fixture | BKH4-7 |
| T23 | I23 | IFC export during commit | External side effect separate | Effect journal | BKH4-7 |
| T24 | I06 | Relevant context changes after validation | STALE | Fingerprint comparison | BKH4-5 |
| T25 | I07 | Automatic retry after conflict | REJECTED | No-retry trace | BKH4-5 |
| T26 | I08 | Canonical plus derived mixed boundary | Explicit boundary result | Disposition matrix | BKH4-6 |
| T27 | I09 | Partial quantity/cost update | Not COMMITTED | Failure report | BKH4-6 |
| T28 | I10 | Abort after simulation only | ABORTED | Canonical unchanged | BKH4-3 |
| T29 | I11 | Historical reversal requested | New transaction, no erase | Journal chain | BKH4-8 |
| T30 | I12 | Undo with dependent later transaction | Conflict or revalidation | Dependency torture | BKH4-8 |
| T31 | I13 | Redo with changed relationship | STALE or revalidation failure | Relationship revision trace | BKH4-8 |
| T32 | I14 | Ad hoc relationship array injected | REJECTED | BKH-1 adapter audit | BKH4-4 |
| T33 | I15 | Fake SATISFIED callback injected | REJECTED/UNKNOWN | Adversarial callback test | BKH4-4 |
| T34 | I16 | Regenerator result PARTIAL | Not VALID | Aggregation report | BKH4-4 |
| T35 | I17 | Missing dependency | UNKNOWN + MISSING_DEPENDENCY | Diagnostic evidence | BKH4-4 |
| T36 | I18 | Assumption presented as verified | REJECTED | Epistemic report | BKH4-4 |
| T37 | I19 | Cached representation is stale | INVALIDATED/current flag false | Cache state trace | BKH4-6 |
| T38 | I20 | Human rejects proposal | REJECTED, no commit | Decision record | BKH4-6 |
| T39 | I21 | Permission changes during validation | STALE or REJECTED | Authority snapshot | BKH4-5 |
| T40 | I22 | Journal itself unavailable during crash | UNKNOWN_COMMIT_STATE | Fail-closed recovery | BKH4-7 |
| T41 | I23 | Irreversible external API call fails | Internal result separated | Side-effect ledger | BKH4-7 |
| T42 | I01 | Legacy writer attempts canonical mutation | Blocked or governed adapter | Full mutation map | BKH4-9 |

No scenario authorizes implementation. The table is the acceptance skeleton for future BKH4 deliveries.
