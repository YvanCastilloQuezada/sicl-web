# BKH-0 — Duplication Report

## Veredicto de duplicación

Se detectaron **contratos paralelos y responsabilidades superpuestas**, pero BKH-0 no los resolvió ni los marcó automáticamente como duplicados equivalentes. La clasificación correcta es `DUPLICATED` cuando dos estructuras expresan el mismo concepto con autoridades distintas, y `PARTIAL` cuando la relación aún no permite afirmar equivalencia completa.

| Concepto | Estructuras observadas | Clasificación | Riesgo |
|---|---|---|---|
| Elemento constructivo | `Muro` y `StructuralElement` | DUPLICATED / PARTIAL | Dos contratos para elementos semánticos y dos rutas de cálculo. |
| Relación de elemento | `ElementRelation`, `tracesTo`, `wallIds`, `relatedIds` | DUPLICATED | La misma dependencia se expresa en varios campos. |
| Versión | `ArkiVersion`, `SavedVersion` en UI y versión numérica de `Muro` | DUPLICATED / PARTIAL | No existe una autoridad única para versión de proyecto, UI y entidad. |
| Snapshot | `ArkiSnapshot`, `FormalSnapshot` y versiones guardadas en `localStorage` | DUPLICATED / PARTIAL | Tres niveles de snapshot/historial con gates diferentes. |
| Cantidades | `Metrado`, `QuantityItem`, `StructuralElement.quantity` | DUPLICATED / PARTIAL | Cálculos de cantidades en contratos diferentes. |
| Costos | `PartidaPresupuestal`, `ApuPartida`, `ElementCost`, `Budget5D` | DUPLICATED / PARTIAL | No hay una entidad de costo transversal única. |
| Schedule | `ScheduleTask` y `Activity4D` | DUPLICATED / PARTIAL | Dos modelos de actividad y precedencias. |
| Identidad | IDs de generación, `GlobalIdMapping`, hash IFC y IDs de UI | PARTIAL | Existe mapeo determinista, pero no está integrado a toda mutación. |
| Edición | React state, `localStorage`, IndexedDB y generación directa | DUPLICATED / PARTIAL | No hay Transaction Engine que unifique las rutas. |

## No clasificado como duplicación

`SceneModel` no se considera duplicación de `ConstructionModel`; es una representación derivada válida. Sin embargo, su autoridad debe permanecer derivada y no convertirse en owner semántico.

## No ejecutar durante BKH-0

No se renombró, fusionó ni eliminó ninguna entidad. Las decisiones `REUSE`, `EXTEND`, `CONSOLIDATE`, `DEPRECATE` y `CREATE` quedan para una fase posterior autorizada.
