# BKH-3 — Contractual Torture Scenario

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Cadena

El escenario futuro cambia el parámetro `floorHeight` de 3.00 m a 3.30 m en un componente. La cadena contractual debe recorrer `PARAMETER → GEOMETRY → RELATIONSHIP → QUANTITY → COST → REPRESENTATION`.

## Condiciones simultáneas

Debe incluir una dependencia directa, una transitiva, una entidad no relacionada que permanezca CLEAN, una constraint violada, una UNKNOWN por solver profesional, una dependencia bloqueada, propagación cross-discipline, propagación cross-scale y un intento de ciclo.

## Resultado esperado

El resultado debe ser granular. Geometry y quantities pueden regenerarse si existen regeneradores autorizados. Cost puede quedar DIRTY si su dependencia no está disponible. Structural verification puede ser UNKNOWN. El escenario no puede reportar `PROJECT REGENERATED SUCCESSFULLY` si persisten bloqueos o UNKNOWNs.

Este escenario es contractual y no se ejecuta en BKH-3 Contract Design. No debe confundirse con BKH-7.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine VERIFIED.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
