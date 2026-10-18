# BKH-0 — Entity Registry

**Baseline:** `c62183a5904f02aa0a935572454a5a35f9d167aa`

| Entidad o contrato | Owner actual observado | Estado | Evidencia | Acción recomendada |
|---|---|---|---|---|
| `Muro` | `shared/arkiConstructionOntology.ts` | EXISTS | Clase con geometría, capas, aberturas, metrados y `to_dict()`. | REUSE |
| `ConstructionModel` | `shared/arkiConstructionOntology.ts` | EXISTS | Tipo raíz con espacios, muros, elementos, relaciones, schedule y resumen. | REUSE / EXTEND |
| `StructuralElement` | `shared/arkiConstructionElements.ts` | EXISTS | Contrato paralelo para columnas, vigas, losas, puertas, ventanas y otros. | CONSOLIDATE |
| `ElementRelation` | `shared/arkiConstructionElements.ts` | PARTIAL | Relaciones `supports`, `rests_on`, `hosts`, `bounds`, `opens_to`, `coordinates_with`. | EXTEND |
| `DynamicBuildingFamily` | `shared/arkiDynamicFamilies.ts` | EXISTS | Familias, variantes, parámetros y reglas. | REUSE |
| `GeneratedBuilding` | `shared/arkiDynamicFamilies.ts` | EXISTS | Candidato generado con `humanReviewRequired` y `projectStateMutation`. | REUSE / EXTEND |
| `SceneModel` | `shared/arkiSceneModel.ts` | EXISTS | Conversión de `ConstructionModel` a nodos seleccionables. | REUSE |
| `ArkiSnapshot` | `shared/persistence/arkiPersistence.ts` | PARTIAL | Snapshot de escena con hash y gate draft/approved. | EXTEND |
| `ArkiVersion` | `shared/persistence/arkiPersistence.ts` | CONTRACT_ONLY | Tipo formal; flujo end-to-end no demostrado. | EXTEND |
| `QuantityItem` | `shared/arki5d/index.ts` | EXISTS | Cantidad vinculada a elemento e ítem de precio. | REUSE |
| `Budget5D` | `shared/arki5d/index.ts` | EXISTS | Cálculo determinista de líneas y costo directo. | REUSE |
| `Activity4D` | `shared/arki4d/index.ts` | EXISTS | Actividades, precedencias y ruta crítica. | REUSE |
| `CoordinationNode` | `shared/coordination/index.ts` | EXISTS | Bounding boxes y detección de clashes. | REUSE / EXTEND |
| `StructuralModel` | `shared/structural/index.ts` | PARTIAL | Contrato y validación; el cálculo estructural real está explícitamente no demostrado. | EXTEND |
| `MepNode` | `shared/mep/index.ts` | PARTIAL | Topología mínima de MEP y gases/seguridad/sanitarias. | EXTEND |
| `Impact` | `shared/arkiImpacts/index.ts` | EXISTS | Grafo simple de consecuencias con revisión humana. | REUSE / EXTEND |
| `GlobalIdMapping` | `shared/identity/arkiGlobalId.ts` | PARTIAL | Mapeo determinista por contrato; su integración universal no está demostrada. | EXTEND |
| `Constraint` | No existe owner de producto identificable | MISSING | No se encontró Constraint Engine general. | CREATE |
| `Transaction` | No existe owner de producto identificable | MISSING | No hay commit/undo/redo/rollback general. | CREATE |
| `HumanDecision` | No existe entidad canónica implementada | CONTRACT_ONLY | Hay gates y flags, pero no autoridad humana transversal. | CREATE / CONSOLIDATE |

No se ejecutó ninguna acción de consolidación durante BKH-0.
