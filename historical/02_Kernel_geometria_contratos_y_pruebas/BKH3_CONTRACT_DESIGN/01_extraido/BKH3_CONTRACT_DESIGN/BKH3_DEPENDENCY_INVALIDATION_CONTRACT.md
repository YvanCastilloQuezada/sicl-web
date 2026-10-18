# BKH-3 — Dependency and Invalidation Contract

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Estados

La taxonomía mínima es `CLEAN`, `DIRTY`, `REGENERATING`, `REGENERATED`, `BLOCKED`, `FAILED` y `UNKNOWN`. `STALE` puede ser una razón o marca de presentación, pero nunca equivale a `CLEAN`.

## Invalidación

Un cambio debe producir el conjunto mínimo de entidades derivadas afectadas. Deben recorrerse dependencias directas y transitivas mediante BKH-1. No se crea un segundo grafo sin demostrar que Relationship Fabric no puede representar la dependencia necesaria.

## Orden

El orden debe ser determinista, acíclico cuando sea posible y explícito ante dependencias faltantes, opcionales, condicionales, cross-discipline y cross-scale. Un ciclo produce `CYCLE_DETECTED`; no puede ocultarse ni generar un bucle infinito.

## Datos stale

El último valor puede conservarse para visualización si lleva marca DIRTY/STALE. Nunca puede presentarse como resultado actualizado antes de la regeneración correspondiente.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
