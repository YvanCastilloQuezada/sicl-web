# BKH-3 — Source State versus Derived State

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Modelo contractual

El estado fuente es la entrada cuya modificación legítima puede invalidar resultados. El estado derivado es calculado desde fuentes y dependencias declaradas. La clasificación es contextual: un resultado puede ser fuente para otro cálculo, sin convertirse por ello en verdad primaria del proyecto.

| Fuente candidata | Derivado | Regla |
|---|---|---|
| parámetros de familia | geometría de instancia | no presentar geometría stale como current |
| ConstructionModel semántico | SceneModel, planta, corte y 3D | una identidad semántica, múltiples representaciones |
| geometría/elementos | quantities | cantidades deben guardar source revision |
| quantities + PriceBook | cost | costo queda dirty si cambian quantities o precio |
| elementos + actividades | schedule/4D | schedule debe invalidarse por cambios de alcance |
| model + IFC mapping | IFC representation | IFC es derivado, con loss report |
| relationships | impact paths | BKH-1 es fuente relacional, BKH-3 sólo consume |
| constraints | evaluation results | BKH-2 definitions no se mutan para hacer pasar el resultado |

## Invariante

`DERIVED_STATE_EXPLICIT`: todo derivado debe declarar source revision, dependency hashes, regenerator version y estado dirty/clean. `STALE ≠ VALID` y `DIRTY ≠ INVALID SOURCE`.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine VERIFIED.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
