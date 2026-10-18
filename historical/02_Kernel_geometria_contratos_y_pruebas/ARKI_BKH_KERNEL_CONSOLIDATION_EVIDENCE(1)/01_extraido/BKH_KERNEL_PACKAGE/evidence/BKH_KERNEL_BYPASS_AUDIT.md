# ARKI — BKH Kernel Bypass Audit

**Orden:** 93A · **Estado:** ejecutado sin consolidar ownership

| Ruta | Clasificación | Evidencia | Decisión |
|---|---|---|---|
| `arkiRelationshipFabric.ts` | CANONICAL | Registry, identity, inverse y revision tests | Reuse |
| `arkiRelationshipAdapters.ts` | SAFE_ADAPTER | Adapta ConstructionModel/SceneModel/legacy hacia BKH-1 | Mantener; migración futura explícita |
| `arkiConstraintEngine.ts` | CANONICAL | Registry, AST declarativo, evaluación fail-closed | Reuse |
| `arkiRegenerationEngine.ts` | CANONICAL DERIVED | Dirty set, fingerprints, propagation, BKH-2 gates | Reuse; no commit |
| `arkiRecalculation.ts` | LEGACY / MIGRATION_REQUIRED | Genera recálculos de mampara y resultados propios | No borrar; owner futuro requiere decisión |
| `arki4d/index.ts` | DERIVED / ARCHITECTURAL_DECISION_REQUIRED | Schedule y critical path especializados | No consolidar en esta orden |
| `arki5d/index.ts` | DERIVED / ARCHITECTURAL_DECISION_REQUIRED | Quantity/PriceBook/Budget especializados | No consolidar en esta orden |
| `GeneratorModule.tsx` | BYPASS_DEFECT risk | `setProjectBuilding()` muta `ProjectContext` directamente | Registrar; no implementar Transaction Engine |
| `ProjectContext.tsx` | CANONICAL UI STATE candidate | Mantiene building y constructionModel activos | No elevar a owner global |
| IFC adapters | SAFE_ADAPTER / PARTIAL | Export/import gobernado con loss report | Mantener fail-closed |
| IndexedDB persistence | SAFE_ADAPTER / PARTIAL | snapshots y versiones locales | No afirmar worksharing |

## Conclusión

Se completó el mapa solicitado. Se identifican dos rutas que requieren decisión futura: `arkiRecalculation` frente a BKH-3 y la mutación directa del Generador hacia `ProjectContext`. No se resuelve ownership global ni se introduce un nuevo motor.
