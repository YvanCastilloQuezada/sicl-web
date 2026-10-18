# BKH-3 — Regeneration Schema

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## RegenerationChangeSet

Debe contener `changeSetId`, entidad y propiedad cambiada, valor anterior y propuesto, source revision, target revision, initiating cause, project version, scenario, provenance, timestamp, origin system/human, epistemic state y evidencia del cambio. BKH-3 recibe el cambio; no lo inventa.

## RegenerationPlan

Debe contener `planId`, ChangeSet, impacted entities, dirty entities, required regenerators, dependency order, prerequisites, blocked nodes, UNKNOWN nodes, expected outputs, constraint checks, diagnostics, provenance, deterministic ordering y status.

## RegenerationResult

Debe separar `regenerated`, `unchanged`, `dirtyRemaining`, `blocked`, `failed`, `unknown`, constraint results, diagnostics, provenance, regenerator versions, source/output hashes y deterministic evidence. Los estados globales mínimos son `PLANNED`, `REGENERATING`, `PARTIAL`, `COMPLETED`, `BLOCKED`, `FAILED`, `UNKNOWN`.

## RegenerationTrace

La traza debe reconstruir `CHANGE → RELATIONSHIP/DEPENDENCY → DIRTY → REGENERATOR → OUTPUT → CONSTRAINT CHECK → RESULT`. Cada salto requiere provenance y revisión/hash de entrada y salida.

## Planificación versus ejecución

Un plan no ejecuta. Una ejecución no hace commit. Un resultado no autoriza la decisión humana. BKH-4 queda fuera.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
