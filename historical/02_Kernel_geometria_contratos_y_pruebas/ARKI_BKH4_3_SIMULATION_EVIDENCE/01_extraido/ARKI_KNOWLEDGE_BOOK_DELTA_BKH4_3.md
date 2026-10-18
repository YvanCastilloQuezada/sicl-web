# ARKI Knowledge Book Delta — BKH4-3

## Principle added

The Simulation Sandbox is a non-canonical consequence preview. It consumes a validated transaction revision and an explicit context, clones the canonical state, applies declarative mutations to the isolated copy, reuses BKH-1/BKH-2/BKH-3, and returns auditable results.

## Safety boundary

A simulation can inform, compare, diagnose and expose uncertainty. It cannot authorize, commit, rollback, persist atomically or replace Human Authority. `UNKNOWN`, `STALE`, `BLOCKED` and `FAILED` remain visible and are never upgraded to success by the sandbox.

## Evidence

Order 96 BKH4-3 tests passed isolation, determinism, stale-base handling, constraint violation/unknown, missing dependency, blocked/failed regeneration, malformed mutation rejection and absence of a commit path.
