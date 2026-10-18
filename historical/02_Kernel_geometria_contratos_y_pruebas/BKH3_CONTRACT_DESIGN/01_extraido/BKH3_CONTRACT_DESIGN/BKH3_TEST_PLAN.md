# BKH-3 — Contract Test Plan

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Casos obligatorios

El plan debe cubrir dependencia directa y transitiva, entidad no relacionada CLEAN, dirty set mínimo, orden determinista, regeneración determinista, idempotencia, ciclo, dependencia ausente, regenerador no soportado, regeneración parcial y fallida, propagación UNKNOWN, pre/postconditions BKH-2, violación posterior, Relationship Fabric y Constraint definitions sin cambios, source state intacto, no commit/transaction/rollback, propagación cross-discipline y cross-scale, no extrapolación de escala/disciplina, representaciones, quantities, cost, schedule, persistencia de metadata, evaluación repetida, stale data, solver profesional no demostrado, capability probabilística no determinista, rechazo de source mutation e invariancia de salidas no relacionadas.

## Criterio

Cada caso debe verificar estado, causa, diagnostics, provenance y no mutación. Los tests contractuales no se ejecutan todavía porque esta orden sólo autoriza diseño.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
