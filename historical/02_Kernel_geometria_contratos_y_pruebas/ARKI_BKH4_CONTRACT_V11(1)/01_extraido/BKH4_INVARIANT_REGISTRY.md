# BKH-4 Invariant Registry v1.1

**Estado:** contractual; no implementación.

| ID | Invariante | Evidencia futura mínima | Estado |
|---|---|---|---|
| BKH4-I01 | NO_CANONICAL_MUTATION_WITHOUT_GOVERNED_TRANSACTION | Mutation-path audit + negative test | CONTRACT |
| BKH4-I02 | SIMULATION_DOES_NOT_MUTATE_CANONICAL_STATE | Before/after canonical hash | CONTRACT |
| BKH4-I03 | TRANSACTION_IDENTITY_STABLE | Serialization/revision test | CONTRACT |
| BKH4-I04 | REVISION_NOT_IDENTITY | Same transaction, new revision test | CONTRACT |
| BKH4-I05 | BASE_VERSION_REQUIRED | Missing-base negative test | CONTRACT |
| BKH4-I06 | STALE_TRANSACTION_NOT_COMMITTABLE | V10→V11 conflict test | CONTRACT |
| BKH4-I07 | NO_SILENT_OVERWRITE | Concurrent commit negative test | CONTRACT |
| BKH4-I08 | COMMIT_ATOMIC_FOR_DECLARED_BOUNDARY | Multi-mutation all-or-none test | CONTRACT |
| BKH4-I09 | PARTIAL_COMMIT_NOT_SUCCESS | Crash/partial commit test | CONTRACT |
| BKH4-I10 | ABORT_NOT_ROLLBACK | State-machine test | CONTRACT |
| BKH4-I11 | ROLLBACK_NOT_HISTORICAL_ERASURE | Journal preservation test | CONTRACT |
| BKH4-I12 | UNDO_PRESERVES_HISTORY | New governed reversal test | CONTRACT |
| BKH4-I13 | REDO_REQUIRES_REVALIDATION | Changed-world redo test | CONTRACT |
| BKH4-I14 | BKH1_NOT_DUPLICATED | Static and runtime integration audit | CONTRACT |
| BKH4-I15 | BKH2_NOT_DUPLICATED | Gate provenance audit | CONTRACT |
| BKH4-I16 | BKH3_NOT_DUPLICATED | Regeneration delegation audit | CONTRACT |
| BKH4-I17 | UNKNOWN_NOT_VALID | Unknown precondition test | CONTRACT |
| BKH4-I18 | GENERATED_NOT_FACT | Epistemic transition negative test | CONTRACT |
| BKH4-I19 | DERIVED_STATE_DISPOSITION_EXPLICIT | Commit report test | CONTRACT |
| BKH4-I20 | HUMAN_AUTHORITY_PRESERVED | Authorization boundary test | CONTRACT |
| BKH4-I21 | PERMISSION_NOT_AUTHORITY | Role/authority negative test | CONTRACT |
| BKH4-I22 | CRASH_NOT_ASSUMED_SUCCESS | Recovery-state test | CONTRACT |
| BKH4-I23 | EXTERNAL_SIDE_EFFECT_NOT_INTERNAL_COMMIT | External effect ledger test | CONTRACT |

All 23 invariants are contractual. None is marked PASS before BKH-4 implementation evidence exists.

## Additional gate

`ATOMIC_COMMIT_PERSISTENCE = IMPLEMENTATION_PREREQUISITE`.

The current evidence proves local persistence and serialization fixtures, but does not prove an atomic durable commit primitive or crash recovery across a real commit boundary. BKH4-6 is blocked until that primitive is designed, implemented, and independently verified.
