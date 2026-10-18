# ARKI — BKH-0 Forensic Mapping

**Fecha de auditoría:** 2026-09-23  
**Repositorio:** `/home/ubuntu/generador-familias`  
**Branch:** `main`  
**HEAD observado:** `c62183a5904f02aa0a935572454a5a35f9d167aa`  
**Veredicto de BKH-0:** **BKH-0 VERIFIED**

## Alcance y límite

BKH-0 auditó el repositorio real sin modificar código de producto. Se inspeccionaron archivos fuente, contratos, rutas de mutación, pruebas, dependencias y estado Git. No se ejecutó BKH-1. E5, E6 y E7 permanecen congelados. E8 no se inició.

`BKH-0 VERIFIED` significa que el mapeo forense y sus evidencias fueron producidos y verificados. No significa que el BIM Kernel ya esté completo ni que los invariantes estén implementados.

## Baseline

El worktree no estaba limpio al comenzar la auditoría. El HEAD coincidía con el checkpoint `c62183a`, pero había cinco archivos de producto modificados, `package.json`, `pnpm-lock.yaml`, dos pruebas modificadas y numerosos archivos no rastreados. La evidencia completa está en `BKH0_BASELINE.txt`.

El árbol contiene una capa canónica previa en `shared/arkiConstructionOntology.ts`, una capa constructiva auxiliar en `shared/arkiConstructionElements.ts`, una representación de escena en `shared/arkiSceneModel.ts`, persistencia local en `shared/persistence/arkiPersistence.ts` y adaptadores IFC4 en `shared/ifc4/`. También contiene contratos 4D, 5D, coordinación, estructura, MEP e impactos.

## Clasificación global

| Área | Estado | Hallazgo principal |
|---|---|---|
| Muros y elementos constructivos | EXISTS | `Muro`, `ConstructionModel` y `StructuralElement` existen y se ejercitan por pruebas. |
| Familias paramétricas | PARTIAL | Existen familias, variantes y parámetros, pero la parametrización genera candidatos; no existe un motor general de restricciones y regeneración. |
| Relaciones BIM | PARTIAL | `ElementRelation` y `tracesTo` existen; no hay una autoridad transversal única ni verificación universal. |
| Constraints | MISSING | No se encontró un Constraint Engine general. |
| Regeneración | PARTIAL | Hay funciones de generación deterministas en forma conceptual, pero no un servicio transaccional de regeneración sobre un proyecto existente. |
| Transacciones | MISSING | No existe un motor general de commit, undo, redo, rollback y atomicidad. |
| Documentación derivada | PARTIAL | Hay dossier, SVG y resúmenes; no existe un compilador documental canónico completo. |
| Familias reutilizables | PARTIAL | `DynamicBuildingFamily` existe; faltan tipos/instancias y edición paramétrica general de familias. |
| Coordinación | PARTIAL | Existe detección de clashes y contratos disciplinares mínimos. |
| IFC | PARTIAL | Hay exportación semántica y parser/adaptador IFC4 inicial; el round-trip productivo completo no está demostrado. |
| Persistencia | PARTIAL | IndexedDB y snapshots existen; la restauración formal, versionado completo y worksharing no están demostrados end-to-end. |
| Worksharing | MISSING | No hay multiusuario, locks, conflictos, merges ni sincronización remota productiva. |
| Rendimiento | NOT_DEMONSTRATED | No hay baseline de proyectos grandes, carga parcial ni recuperación bajo fallo. |
| Inteligencia ARKI | CONTRACT_ONLY | Hay contratos y documentación conceptual; no hay autoridad de mutación de inteligencia integrada al kernel. |

## Hallazgos críticos

1. La identidad canónica de `Muro` es fuerte dentro de `ConstructionModel`, pero los elementos estructurales usan un contrato paralelo (`StructuralElement`). La relación entre ambos se expresa parcialmente mediante IDs y relaciones, no mediante un grafo de dominio único.
2. La generación usa identificadores no deterministas en `arkiConstructionOntology.ts` mediante `Math.random()` y marcas temporales en otras capas. Esto impide afirmar estabilidad universal de identidad.
3. La UI del Generador modifica el estado de proyecto mediante `setProjectBuilding(next)` sin pasar por una transacción, un command bus o un gate de commit.
4. La persistencia IndexedDB permite guardar y aprobar snapshots, pero el adaptador usa el mismo store de proyectos para proyectos y versiones. Esto debe documentarse como deuda de consolidación, no como corrección aplicada.
5. La exportación IFC4 declara geometría conceptual y `nativeRvt: false`; por tanto, no debe presentarse como interoperabilidad productiva completa.
6. La suite existente pasa sus comandos registrados, pero varias pruebas verifican contratos estructurales y montaje. No constituyen evidencia de un kernel transaccional completo.

## Acciones futuras clasificadas

| Acción | Elementos principales |
|---|---|
| REUSE | `Muro`, `ConstructionModel`, `StructuralElement`, `ElementRelation`, `SceneModel`, `ArkiSnapshot`, `calculateBudget5D`, `calculateSchedule4D`, `detectClashes`. |
| EXTEND | Identidad, relaciones, persistencia, IFC, familias, impactos y documentación derivada. |
| CONSOLIDATE | Owners de geometría, relaciones, versiones, snapshots, cantidades, costos y schedule. |
| DEPRECATE | Rutas de mutación directa y cualquier contrato duplicado que BKH-1 confirme como no canónico. |
| CREATE | Constraint Engine, Transaction Engine, compilador documental y baseline de rendimiento. |

Estas acciones son recomendaciones de BKH-0. No se ejecutó ninguna.

## Evidencia

- `BKH0_BASELINE.txt`
- `BKH0_INSPECTION_RAW.txt`
- `BKH0_DUPLICATION_RAW.txt`
- `BKH0_TEST_RUN_RAW.txt`
- `BKH0_ENTITY_REGISTRY.md`
- `BKH0_RELATIONSHIP_INVENTORY.md`
- `BKH0_DUPLICATION_REPORT.md`
- `BKH0_DEPENDENCY_MAP.md`
- `BKH0_IMPLEMENTATION_GAPS.md`
- `BKH0_CANONICAL_OWNERSHIP_MAP.md`
- `BKH0_MUTATION_PATH_MAP.md`
- `BKH0_INVARIANT_REGISTRY.md`

## Stop condition

BKH-0 termina aquí. BKH-1 requiere autorización explícita posterior del Product Owner.

## References

[1]: https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/chapter-7/index.html "buildingSMART IFC4.3 documentation"

La referencia externa sólo contextualiza IFC; los hallazgos de este informe provienen del repositorio local y de los outputs guardados.
