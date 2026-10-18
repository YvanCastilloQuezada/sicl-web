# BKH-0 — Dependency Map

## Capas observadas

```text
UI / React
  → ProjectContext
  → GeneratedBuilding / ConstructionModel
  → SceneModel / E7 panels / IFC panel

Dynamic family generation
  → DynamicBuildingFamily
  → GeneratedBuilding
  → generateConstructionModel
  → ConstructionModel

Construction domain
  → Muro
  → StructuralElement
  → ElementRelation
  → quantities / partidas / schedule

Derived domains
  → SceneModel
  → 5D Budget
  → 4D Schedule
  → Coordination clashes
  → Structural and MEP validation
  → Impacts

Persistence and interoperability
  → IndexedDB snapshots, versions and audit
  → GlobalId mapping
  → IFC4 exporter/parser/web-ifc adapter
```

## Dependencias principales

| Dependencia | Tipo | Estado |
|---|---|---|
| `GeneratedBuilding.constructionModel` → `ProjectContext` | Estado de aplicación | EXISTS |
| `ConstructionModel` → `SceneModel` | Conversión derivada | EXISTS |
| `ConstructionModel` → 5D/4D | Datos y cálculos paralelos | PARTIAL |
| `StructuralElement` → `ElementRelation` | Generación de relaciones | EXISTS |
| `SceneModel` → IFC4 | Exportación/importación | PARTIAL |
| `SceneModel` → IndexedDB snapshot | Persistencia local | PARTIAL |
| `ArkiVersion` → IndexedDB | Contrato y store compartido | CONTRACT_ONLY / PARTIAL |
| UI Generator → `setProjectBuilding` | Mutación directa | EXISTS / deuda |
| UI Generator → `localStorage` | Historial local paralelo | EXISTS / deuda |
| E7 panels → shared domain calculators | Lectura de contratos | EXISTS |
| SICL → producto | Ruta encontrada en documentación, no en código productivo verificable | NOT_DEMONSTRATED |
| ARKI intelligence → producto | Contratos/documentación, sin mutation authority verificable | CONTRACT_ONLY |

## Riesgo arquitectónico

La dependencia central es `generateDynamicBuilding` → `generateConstructionModel`. El resultado es reutilizado por UI, planta, SceneModel, 5D, 4D e IFC. Sin embargo, las capas derivadas pueden calcular o persistir sus propios contratos sin una transacción compartida. Una futura mutación puede dejar divergentes el edificio, el modelo constructivo, la escena, las cantidades, los costos, el schedule y los snapshots.

BKH-0 no cambia ninguna dependencia. Sólo la documenta.
