# BKH-3 — Scope Limits

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Incluido

Diseño de ChangeSet, source/derived state, dirty model, impact analysis, RegenerationPlan, Regenerator Registry, ordering, cycle semantics, determinism, idempotence, partial results, provenance, explanation, integration boundaries and future gates.

## Excluido

Implementación de código de producto, commit, transactions, undo/redo, rollback, HumanDecision, Relationship Fabric nuevo, Constraint Engine nuevo, solver general, solver profesional, Documentation Compiler, performance work, worksharing, UI feature, E8 y reapertura de E5/E6/E7.

Toda colisión de ownership geométrico, Quantity, Cost, Version, Snapshot o Schedule se documenta y se eleva como decisión arquitectónica. No se resuelve silenciosamente.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
