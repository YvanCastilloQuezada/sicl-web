# BKH4-1/2 Foundation Hardening — Order 95A

## Maximum state

```text
BKH4-0/1/2: HARDENED / PENDING INDEPENDENT VERIFICATION
BKH4-3: NOT AUTHORIZED
Simulation sandbox: NOT IMPLEMENTED
Canonical mutation: NOT IMPLEMENTED
Commit/rollback/undo/redo: NOT IMPLEMENTED
Persistence implementation: NOT IMPLEMENTED
Legacy migration: NOT IMPLEMENTED
Ownership consolidation: NOT IMPLEMENTED
```

## F1 — TransactionRevision state semantics

`Transaction.status` remains the authoritative transaction lifecycle state. `TransactionRevision.status` is retained only as a restricted revision assessment/status field with the closed vocabulary `DRAFT | PROPOSED | INVALID | UNKNOWN`. Operational and final states such as `AUTHORIZED`, `COMMITTING` and `COMMITTED` are rejected at runtime and are not part of the revision type.

## F2 — Declarative mutation hardening

Mutation records are structurally closed: JSON-only values, a closed operation vocabulary, explicit target/provenance schemas, no callback field, no interpreter and no executable mutation API. Function objects, extra callback-like fields, malformed objects and executable-like payloads are rejected. The regex remains only defense in depth; schema rejection is primary.

## F3 — Operation-specific invariants

All seven operations have explicit minimum structural invariants and are validated without execution:

```text
CREATE_ENTITY, UPDATE_PROPERTY, MOVE_ENTITY, DELETE_ENTITY,
ADD_RELATIONSHIP, REMOVE_RELATIONSHIP, UPDATE_PARAMETER
```

## Regression status

The foundation test covers the three fixes and the required previous foundation checks. The mandatory BKH-1, BKH-2, BKH-3, 92A and 93C regressions remain required and are not reclassified as BKH4 verification of future capabilities.

## Not applicable yet

T01–T42 scenarios requiring simulation, canonical commit, crash recovery, rollback, undo/redo, atomic persistence, migration or ownership consolidation remain `NOT_APPLICABLE_YET`. No future test was converted into PASS.
