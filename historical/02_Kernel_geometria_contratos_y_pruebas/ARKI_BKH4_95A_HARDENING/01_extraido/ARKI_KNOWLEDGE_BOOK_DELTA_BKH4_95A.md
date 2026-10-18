# ARKI Knowledge Book Delta — BKH4-1/2 Hardening

## Principle added

BKH4 foundation must distinguish lifecycle authority from revision metadata. `Transaction` owns lifecycle; `TransactionRevision` may report only restricted draft/proposal/evaluation states. Mutation sets are data, never code: JSON-only values, closed operation vocabulary, closed field schemas, typed operation invariants and no callback/interpreter surface. A valid schema is a prerequisite for future transaction gates, not evidence that a mutation was executed.

## Boundary preserved

This delta does not create simulation, commit, rollback, undo/redo, persistence, migration, ownership consolidation or professional solver behavior. Those capabilities remain blocked and require separate authorization and evidence.
