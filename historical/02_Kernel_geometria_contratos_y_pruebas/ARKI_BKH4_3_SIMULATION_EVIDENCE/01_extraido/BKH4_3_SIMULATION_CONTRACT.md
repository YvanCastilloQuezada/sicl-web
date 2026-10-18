# BKH4-3 Simulation Sandbox Contract v1.0

## Boundary

`simulateTransaction(request)` consumes an immutable canonical state, a validated declarative transaction revision, and an explicit simulation context. It returns a structured `SimulationResult`.

The function clones the state before applying mutations. It never writes to the canonical owner, persistence layer, snapshot store, or transaction commit path.

## Required output

The result contains simulation, transaction and revision identities; base version; execution status; canonical-before/after fingerprints; simulated-state fingerprint; mutation results; relationship impact; BKH-2 results; BKH-3 results; consequences; unknowns; warnings; errors; provenance; and `humanDecisionRequired`.

## Status semantics

`COMPLETED`, `INVALID`, `UNKNOWN`, `STALE`, `BLOCKED` and `FAILED` remain distinct. `UNKNOWN` never becomes success. `STALE` never auto-rebases. A BKH-3 blocked or failed result remains visible in the simulation result.

## Reuse contracts

- BKH-1: `RelationshipFabric.fromJSON()` and registry validation.
- BKH-2: the supplied governed `evaluateConstraint` adapter and canonical status/reason taxonomy.
- BKH-3: supplied plan/execution adapters using the existing regeneration engine.
- BKH4-0/1/2: `TransactionRevision` validation and declarative mutation vocabulary.

## Security

The sandbox accepts only validated JSON mutation records. It does not accept callbacks as mutation payloads, interpreters, `eval`, `Function`, arbitrary JavaScript or opaque executable objects.

## Equivalence

Semantic determinism excludes operational `simulationId` and timestamp/context metadata only where explicitly declared. Equivalent canonical state, revision, datasets, regeneration context and configuration must produce equivalent semantic fingerprints.

## Explicit non-goals

No commit, authorization, rollback, undo/redo, atomic persistence, crash recovery, worksharing, legacy migration or ownership consolidation.
