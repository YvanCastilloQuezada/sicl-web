# BKH-0 — Relationship Inventory

## Resultado

El repositorio contiene relaciones BIM reales, pero distribuidas entre tres formas principales: `ElementRelation`, `StructuralElement.tracesTo` y referencias de dominio como `ConstructionSpace.wallIds` y `ScheduleTask.elementIds`. No existe todavía un Relationship Fabric único.

| Relación | Representación actual | Estado | Observación |
|---|---|---|---|
| Columna apoyada en zapata | `ElementRelation.relation = rests_on` | EXISTS | Se genera en `generateElementSet`; `verified` queda en `false`. |
| Viga soporta losa | `ElementRelation.relation = supports` | EXISTS | Se genera por nivel. |
| Puerta pertenece a muro | `ElementRelation.relation = opens_to` y `tracesTo` | PARTIAL | Hay dos representaciones que deben consolidarse. |
| Ventana pertenece a muro | `opens_to` y `tracesTo` | PARTIAL | La relación semántica existe, pero la abertura de `Muro` y el elemento ventana no comparten un owner único. |
| Muro se apoya en losa | `rests_on` | EXISTS | Se genera por nivel; no hay verificación universal. |
| Espacio bounded-by muro | `ConstructionSpace.wallIds` | PARTIAL | Es una lista de IDs, no una relación tipada del grafo. |
| Schedule vinculado a elementos | `ScheduleTask.elementIds` | EXISTS | La vinculación existe dentro del modelo constructivo. |
| Cantidad vinculada a elemento | `QuantityItem.elementId` | EXISTS | El módulo 5D la utiliza. |
| Impacto entre dominios | `Impact.sourceId/targetId` | EXISTS | Es un grafo de consecuencias, pero no autoridad de relaciones BIM. |
| Clash entre disciplinas | `CoordinationNode` y detector volumétrico | EXISTS | Es una relación de coordinación derivada, no persistida como relación canónica del modelo. |
| Scene node relacionado | `SceneNode.relatedIds` | PARTIAL | Derivado para visualización; no es owner del vínculo semántico. |

## Hallazgos

Las relaciones se generan durante la creación del modelo y se transportan como datos. No se observó una operación general para agregar, eliminar, validar o recomputar relaciones después de una mutación. El campo `verified` existe, pero el flujo que lo convierte en evidencia aprobada no está implementado transversalmente.

## Recomendación clasificada

`ElementRelation` debe REUSE y EXTEND. `tracesTo`, `wallIds`, `elementIds` y `relatedIds` deben CONSOLIDATE bajo un modelo de relaciones común. No se ejecutó la consolidación.

## Evidencia

La inspección fuente quedó en `BKH0_INSPECTION_RAW.txt` y la suite completa en `BKH0_TEST_RUN_RAW.txt`.
