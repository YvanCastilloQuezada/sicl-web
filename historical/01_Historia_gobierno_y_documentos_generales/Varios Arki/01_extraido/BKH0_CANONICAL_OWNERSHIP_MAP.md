# BKH-0 — Canonical Ownership Map

**Regla:** este mapa registra el propietario semántico actual observado. No resuelve conflictos.

| Concepto | Propietario actual observado | Estado | Conflicto o límite |
|---|---|---|---|
| Wall | `Muro` dentro de `ConstructionModel` | EXISTS | `StructuralElement` y `SceneNode` también representan elementos derivados/paralelos. |
| Geometry | Geometría de `Muro`, `StructuralElement.geometry` y `GeneratedBuilding.geometry*` | DUPLICATED | No existe un geometry owner único. |
| Relationship | `ConstructionModel.relations` con `ElementRelation` | PARTIAL | `tracesTo`, `wallIds`, `elementIds` y `relatedIds` duplican vínculos. |
| Constraint | `DynamicBuildingFamily.baseRules` | CONTRACT_ONLY | Las reglas de familia no son un constraint solver general. |
| ProjectVersion | `ArkiVersion` en persistencia | CONTRACT_ONLY | UI mantiene `SavedVersion`; `Muro.version` es versión de entidad. |
| Snapshot | `ArkiSnapshot` en IndexedDB | PARTIAL | También hay `FormalSnapshot` y versiones en `localStorage`. |
| Quantity | `Muro.metrado`, `StructuralElement.quantity`, `QuantityItem` | DUPLICATED | Tres representaciones de cantidades. |
| Cost | `PartidaPresupuestal`, `ApuPartida`, `ElementCost`, `Budget5D` | DUPLICATED | No hay owner único de costo. |
| Schedule | `ConstructionModel.schedule` con `ScheduleTask` | PARTIAL | `Activity4D` es un segundo contrato de planificación. |
| Scene representation | `SceneModel` y `SceneNode` | EXISTS | Es owner de representación, no de semántica constructiva. |
| HumanDecision | No existe entidad canónica implementada | MISSING / CONTRACT_ONLY | Hay `humanReviewRequired`, gates y workflows locales, sin enforcement transversal. |

## Conclusión

El mapa confirma que `ConstructionModel` es el owner más cercano al modelo constructivo actual y que `SceneModel` es una representación derivada. Las áreas de Geometry, Relationship, Version, Snapshot, Quantity, Cost y Schedule requieren consolidación posterior. BKH-0 no decide cuál contrato debe sobrevivir.
