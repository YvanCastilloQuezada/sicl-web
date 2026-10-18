# BKH-3 — Regeneration Ownership Map

**Estado:** CONTRACT DESIGN ONLY — IMPLEMENTATION BLOCKED  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Regla

Este mapa registra owners observados, no resuelve conflictos de ownership. Cuando dos capas puedan escribir la misma semántica, el estado queda como `ARCHITECTURAL DECISION REQUIRED`.

| Estado | Owner observado | Writers | Readers | Dependencia | Tratamiento |
|---|---|---|---|---|---|
| Family parameters | Dynamic family contracts | Generator/UI | Construction generation | input parameters | SOURCE candidate |
| ConstructionModel | Construction ontology/generator | generator/context | 2D, 3D, dossier, quantities | family/project input | SOURCE/DERIVED boundary unresolved |
| Geometry nodes | Construction elements / SceneModel adapter | scene converter | WebGL viewer | ConstructionModel | DERIVED |
| Relationships | BKH-1 Relationship Fabric | Fabric/adapters | selection, impacts, future planner | entity identities | REUSE BKH-1 |
| Constraints | BKH-2 Constraint Engine | constraint registry | evaluator/planner | entity/context | REUSE BKH-2 |
| Quantities | arki5d and constructive metrado paths | domain calculators | budget/dossier | model geometry | DERIVED; owner conflict documented |
| Cost | arki5d PriceBook/calculator | 5D domain | panels/dossier | quantities + price book | DERIVED |
| Schedule | arki4d | schedule calculator | 4D/panels | elements + activities | DERIVED |
| Scene representation | SceneModel converter | scene module | 3D/comparison | ConstructionModel | DERIVED, not semantic owner |
| Snapshot/version | persistence contracts and IndexedDB | persistence adapter | restore/comparison | project state | PARTIAL |
| Human decision | No transversal canonical entity | UI actions/documented PO | governance | evidence | MISSING / outside BKH-3 |

## Unknowns

La auditoría no demuestra todavía una única mutación fuente para cada entidad, ni persistencia E2E de un regeneration plan. BKH-3 deberá conservar esos UNKNOWNs y elevar las colisiones antes de implementar.

## Referencias

- `BKH-0`: Forensic Mapping verificado.
- `BKH-1`: Relationship Fabric verificado dentro de su alcance.
- `BKH-2`: Constraint Engine implementado, pendiente de revisión independiente.
- Orden 91 — ARKI BKH-3 Regeneration Engine, Contract Design Only.
