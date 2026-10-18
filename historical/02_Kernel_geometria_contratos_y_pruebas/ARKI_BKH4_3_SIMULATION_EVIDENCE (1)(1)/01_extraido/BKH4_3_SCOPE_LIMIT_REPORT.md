# BKH4-3 Scope-Limit Report

**Maximum state:** `HARDENED / PENDING INDEPENDENT VERIFICATION`

## Implemented

- Isolated simulation state.
- Declarative mutation application over the isolated copy.
- Canonical before/after fingerprint comparison.
- Simulation context and structured result.
- BKH-1 relationship impact through the existing fabric.
- BKH-2 evaluation through a governed adapter.
- BKH-3 regeneration through supplied existing-engine adapters.
- Determinism, stale-base and failure-isolation tests.
- Independent canonical snapshot/fingerprint proof and nested aliasing defense.
- Explicit global status precedence preserving FAILED/BLOCKED alongside UNKNOWN.

## Explicitly not implemented

Commit, authorization authority, rollback, undo/redo, atomic persistence, crash recovery, legacy writer migration, ownership consolidation, worksharing, CRDT, distributed transactions, BKH-5/6/7, E8, IFC, Smart Cities and Urban Digital Twin.

## Contract tests remaining not applicable

Any test requiring commit, persistence atomicity, crash recovery, rollback, undo, redo or legacy migration remains `NOT_APPLICABLE_YET`.

STOP. BKH4-4+ remains blocked.
