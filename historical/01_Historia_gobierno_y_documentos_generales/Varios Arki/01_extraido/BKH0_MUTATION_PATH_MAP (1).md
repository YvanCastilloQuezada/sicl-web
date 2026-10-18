# BKH-0 — Mutation Path Map

## Resultado general

No todas las rutas terminan en una autoridad transaccional común. La autoridad efectiva actual es distribuida: React state para la sesión activa, `GeneratedBuilding` y `ConstructionModel` para el resultado generado, `localStorage` para versiones de UI e IndexedDB para snapshots formales.

| Ruta | Dónde nace | Capas que atraviesa | Persistencia actual | Autoridad canónica efectiva | Estado |
|---|---|---|---|---|---|
| Edición directa UI | Inputs y botones de `GeneratorModule` | React state → `generateDynamicBuilding` → `setBuilding` / `setProjectBuilding` | `localStorage` sólo al guardar versión | `GeneratedBuilding` en memoria | EXISTS / PARTIAL |
| Controles paramétricos | Familia, variante, área, capacidad, niveles, ciudad | React state → parámetros → `generateDynamicBuilding` → `ConstructionModel` | No hay commit general; versión UI opcional | Función de generación y `GeneratedBuilding` | EXISTS / PARTIAL |
| Generador | `generate()` de `GeneratorModule` | Dynamic family → construction ontology → element set → schedule/summary | Contexto React; snapshot sólo desde visor 3D | `GeneratedBuilding.constructionModel` | EXISTS |
| SICL command | Documentos y referencias históricas | No se encontró ruta productiva verificable en el código auditado | No demostrado | No demostrada | NOT_DEMONSTRATED |
| ARKI intelligence | Contratos y documentación de inteligencia | No se encontró una autoridad de mutación integrada en el código auditado | No demostrado | No demostrada | CONTRACT_ONLY |
| Importación IFC | `Ifc4Panel` → `parseIFC4WithWebIfc` | File input → web-ifc adapter → parse result y loss report | No se observó integración del resultado al `ConstructionModel` activo | Resultado local del panel, no modelo canónico | PARTIAL |
| Exportación IFC | `Ifc4Panel` / `GeneratorModule` | SceneModel o ConstructionModel → exporter → descarga | Archivo descargado; no reimportación automática | Exportador, no autoridad del proyecto | EXISTS / PARTIAL |
| Guardar snapshot | `SceneModel3D` → `snapshotRecord` → IndexedDB | SceneModel → ArkiSnapshot → store | IndexedDB | `ArkiSnapshot` local | PARTIAL |
| Aprobar snapshot | `approveArkiSnapshot` | IndexedDB read → gateStatus approved → put | IndexedDB | Snapshot local, sin commit de modelo | PARTIAL |
| Restaurar snapshot | `restoreArkiSnapshot` | IndexedDB → UI/visor | IndexedDB | No se demostró sustitución atómica del modelo activo | CONTRACT_ONLY |
| Undo/redo | No se encontró ruta general | — | — | — | MISSING |

## Hallazgo principal

El Generador sí conecta el resultado a `ProjectContext`, pero no existe un Mutation Path centralizado que valide una mutación, produzca impactos, regenere dependencias, recomponga cantidades/costos/schedule, y finalmente haga commit o rollback.

No se modificó ninguna ruta durante BKH-0.
