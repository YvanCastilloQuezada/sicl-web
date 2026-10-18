# BKH4-3 Invariant Report

| ID | Invariant | Evidence | Result |
|---|---|---|---|
| BKH4-3-I01 | Simulation is isolated from canonical state | `test-bkh4-3-simulation.ts`, canonical fingerprint assertions | PASS |
| BKH4-3-I02 | Simulation is not commit | `canonicalMutation=false`, foundation regression says commit not implemented | PASS |
| BKH4-3-I03 | Canonical version does not change | result flag and before/after fingerprint | PASS |
| BKH4-3-I04 | Base-version mismatch is stale | stale scenario | PASS |
| BKH4-3-I05 | BKH-2 UNKNOWN is not satisfied | unknown constraint scenario | PASS |
| BKH4-3-I06 | Constraint violation is not success | violation scenario returns INVALID | PASS |
| BKH4-3-I07 | Missing dependency is not invalid input | missing entity scenario returns UNKNOWN | PASS |
| BKH4-3-I08 | BKH-3 BLOCKED and FAILED remain observable | blocked and failed adapters | PASS |
| BKH4-3-I09 | Relationship impact uses BKH-1 fabric | real OPENS_TO fixture and `reusedFabric=true` | PASS |
| BKH4-3-I10 | Equivalent simulations are semantically equivalent | repeated simulation with different operational IDs | PASS |
| BKH4-3-I11 | Malformed mutation is rejected before simulation | malformed revision negative test | PASS |
| BKH4-3-I12 | Human authority is not auto-created | `humanDecisionRequired` is informational only | PASS |

## 96A corrective invariants

| ID | Invariant | Evidence | Result |
|---|---|---|---|
| FIX-BKH43-01 | Independent canonical before/after snapshot remains identical | Snapshot, fingerprints and field-level comparisons | PASS |
| FIX-BKH43-01A | Canonical project version remains unchanged | Explicit projectVersion comparison | PASS |
| FIX-BKH43-01B | Canonical relationships remain unchanged | Explicit relationship snapshot comparison | PASS |
| FIX-BKH43-01C | Canonical derived state remains unchanged | Explicit derived-state snapshot comparison | PASS |
| FIX-BKH43-01D | Canonical and isolated mutable references are not aliased | Nested-object alias probe | PASS |
| FIX-BKH43-02 | Global status precedence is INVALID > FAILED > BLOCKED > UNKNOWN > COMPLETED | Combined BKH-3 failure/block plus UNKNOWN tests | PASS |
| FIX-BKH43-02A | FAILED is not hidden by UNKNOWN | Failed-plus-unknown fixture | PASS |
| FIX-BKH43-02B | BLOCKED is not hidden by UNKNOWN | Blocked-plus-unknown fixture | PASS |

## Status

All invariants in this hardened scope passed their executable fixtures. This report does not promote BKH4-3 to VERIFIED; independent review remains required.
