# BKH4-0 Implementation Baseline

**Fecha de captura:** 23 de septiembre de 2026

## Estado

Este baseline se captura antes de la implementación BKH4-0/1/2. El worktree histórico ya estaba sucio. No se presenta como limpio.

| Campo | Valor |
|---|---|
| Repository | `/home/ubuntu/generador-familias` |
| Branch | `main` |
| HEAD | `c62183a5904f02aa0a935572454a5a35f9d167aa` |
| Worktree | Sucio antes de esta orden; contiene cambios UI-3A, artefactos históricos y archivos no rastreados |
| Product implementation before Order 95 | BKH-1/2/3 hardened; BKH-4 not implemented |
| BKH4 scope authorized | BKH4-0, BKH4-1, BKH4-2 only |
| BKH4 firewall | No simulation sandbox, canonical mutation, commit, rollback, undo/redo, atomic persistence or legacy migration |

## Pre-existing verification baseline

Before this order, `pnpm check`, `pnpm build`, BKH-1, BKH-2, BKH-3, 92A, 93A, 93A-H, 93C and the internal suite of 42 executable tests had passed. Those outputs remain regression evidence; they are not reclassified as BKH4 evidence.

## BKH4 implementation changes

This order adds only the BKH4 foundation contract and its tests:

- `shared/arkiTransactionEngine.ts` — identity, revisions, legal state transitions and declarative mutation validation/serialization.
- `scripts/test-bkh4-foundation.ts` — BKH4-0/1/2 contract tests.
- `BKH4_IMPLEMENTATION_BASELINE.md`.
- `BKH4_MUTATION_WRITER_INVENTORY.md`.

No existing BKH-1, BKH-2 or BKH-3 source was modified. No canonical writer was migrated.

## Current evidence limits

BKH4-0/1/2 does not provide simulation, commit, rollback, undo/redo, recovery or atomic persistence. Tests requiring those capabilities are `NOT_APPLICABLE_YET`, not PASS.
