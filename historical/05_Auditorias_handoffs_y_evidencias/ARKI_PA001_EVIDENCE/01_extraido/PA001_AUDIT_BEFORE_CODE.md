# PA-001 — Auditoría previa a código

**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`  
**Estado del worktree:** sucio antes de esta orden; no se presenta como limpio.  
**Regla:** no se crea un segundo modelo de espacios.

## Hallazgos

| Área | Evidencia existente | Acción PA-001 |
|---|---|---|
| Espacios | `shared/arkiConstructionOntology.ts` contiene `ConstructionSpace[]` dentro de `ConstructionModel` con id, nombre, función, nivel, área, altura, muros, requisitos y estado | `REUSE` como estado observado; no duplicar geometría espacial |
| Modelo constructivo | `ConstructionModel` es propietario actual del conjunto constructivo y sus espacios | `REUSE` como entrada del evaluador |
| Relaciones existentes | `ConstructionModel.relations` contiene `ElementRelation[]` de elementos constructivos; BKH-1 contiene `RelationshipRecord` para relaciones generales | `ADAPT`: las relaciones de programa se mantienen como contrato programático explícito; no se falsifica equivalencia con relaciones observadas |
| Constraints | `shared/arkiConstraintEngine.ts` existe y separa status, epistemic state y applicability | `REUSE` conceptual; PA-001 no modifica BKH-2 |
| Provenance/evidence | BKH-1 define evidencia y provenance; BKH-2 define estados epistemológicos y unknown | `REUSE` mediante tipos acotados compatibles |
| Persistencia/canonical state | BKH4 y repositorios canónicos existentes | `NOT TOUCHED`; PA-001 es evaluación pura |
| Space Syntax | contrato recibido, sin implementación en esta orden | `BLOCKED`; no se crea integración |
| Knowledge/LKS | `shared/arkiLivingKnowledge.ts` existente | `NOT TOUCHED`; no crear registry paralelo |

## Decisión

Se crea un único contrato de **ArchitecturalProgram** y un evaluador puro de programa esperado contra `ConstructionModel` observado. No se crea un nuevo `SpaceModel`, no se modifica `ConstructionModel`, no se implementa Space Syntax y no se incorporan tipologías hardcodeadas.

## Gaps deliberados

La generación actual de `ConstructionSpace.requisitos` es limitada y no contiene evidencia suficiente para todas las dimensiones programáticas. El resultado correspondiente será `UNKNOWN` o `MISSING`, nunca `VIOLATED` por ausencia de información.
