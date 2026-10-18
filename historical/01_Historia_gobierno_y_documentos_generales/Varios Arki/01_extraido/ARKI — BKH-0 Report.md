# ARKI — BKH-0 Report

## Veredicto único

# BKH-0 VERIFIED

La auditoría Forensic Mapping se ejecutó sobre el repositorio real y produjo los doce entregables exigidos por el Contrato BIM Kernel Hardening v1.1. Se conservaron baseline, inventarios, inspecciones, outputs crudos y hashes. No se implementó BKH-1 ni se reabrieron E5, E6, E7 o E8.

`VERIFIED` califica la ejecución y completitud de BKH-0. No califica como completas las capacidades del kernel. El repositorio muestra un sistema funcional y amplio, pero con relaciones, cantidades, costos, versiones, snapshots y mutaciones distribuidos entre contratos paralelos.

## Baseline observado

- Branch: `main`.
- HEAD: `c62183a5904f02aa0a935572454a5a35f9d167aa`.
- Worktree: sucio antes de BKH-0.
- Cambios de producto previos: `ArkiNavigator`, `ArkiWorkspaceShell`, `ProjectContext`, `index.css`, `GeneratorModule`, `package.json`, `pnpm-lock.yaml` y dos pruebas de limpieza/layout.
- Archivos no rastreados previos: numerosos contratos, evidencia, fixtures, módulos y contratos shared de E5-E7.

El baseline exacto está en `BKH0_BASELINE.txt`.

## Qué existe realmente

ARKI tiene un modelo constructivo semántico con muros, espacios, aberturas, capas, acabados, columnas, vigas, losas, cimentaciones, escaleras, pisos, cubiertas y particiones. También contiene metrados, partidas, precios APU, un schedule constructivo, relaciones tipadas, SceneModel 3D, selección BIM, persistencia IndexedDB, contratos de identidad IFC4, exportación/importación inicial, presupuesto 5D, planificación 4D, clashes, contratos estructurales, MEP e impactos.

Estas capacidades están en estados diferentes. Algunas son `EXISTS`; otras son `PARTIAL`, `CONTRACT_ONLY` o `NOT_DEMONSTRATED`. El detalle está en los mapas entregados.

## Qué no existe como kernel transversal

No se encontró un Constraint Engine general, un Transaction Engine, una autoridad única de relaciones, un compilador documental canónico, worksharing multiusuario ni un Performance Kernel. Tampoco se demostró que todas las mutaciones pasen por un único punto de commit.

## Hallazgo de identidad

El modelo tiene un mapeo determinista `ArchiElementId` ↔ `GlobalId` como contrato. Sin embargo, el código observado también usa `Math.random()`, `Date.now()` y fechas de ejecución para generar IDs o metadatos. Por ello la estabilidad universal de GUID no puede marcarse como verificada.

## Hallazgo de mutación

El Generador cambia el estado activo por `setProjectBuilding(next)`. Las versiones de UI se guardan en `localStorage`. Los snapshots se guardan y aprueban en IndexedDB. La importación IFC carga un resultado en el panel, pero no se demostró que sustituya el `ConstructionModel` canónico. No existe aún commit/undo/redo/rollback transversal.

## Invariantes

Los diez invariantes aprobados fueron comprobados contra el código y la suite. Ninguno se declaró `PASS` universal. Hay señales parciales para la separación candidato/decisión, generated/fact, preview/commit, GUID y revisión humana, pero no existe enforcement central.

## Disposición de alcance

| Acción futura | Disposición |
|---|---|
| REUSE | Owners y cálculos existentes que tienen evidencia. |
| EXTEND | Identidad, IFC, persistencia, familias, relaciones e impactos. |
| CONSOLIDATE | Relaciones, cantidades, costos, schedule, versiones y snapshots. |
| DEPRECATE | Sólo después de demostrar qué contrato es no canónico. |
| CREATE | Constraints, transacciones, documentación compilable, worksharing y performance. |

No se ejecutó ninguna de esas acciones.

## Gate siguiente

BKH-1 permanece bloqueado. Para abrirlo se requiere autorización expresa posterior del Product Owner. La próxima ejecución permitida, si se autoriza, deberá comenzar por resolver el plan de consolidación a partir de estos mapas, no por crear un segundo sistema paralelo.

## Entregables

1. `BKH0_FORENSIC_MAP.md`
2. `BKH0_ENTITY_REGISTRY.md`
3. `BKH0_RELATIONSHIP_INVENTORY.md`
4. `BKH0_DUPLICATION_REPORT.md`
5. `BKH0_DEPENDENCY_MAP.md`
6. `BKH0_IMPLEMENTATION_GAPS.md`
7. `BKH0_CANONICAL_OWNERSHIP_MAP.md`
8. `BKH0_MUTATION_PATH_MAP.md`
9. `BKH0_INVARIANT_REGISTRY.md`
10. `BKH0_OUTPUTS.txt`
11. `BKH0_MANIFEST.json`
12. `BKH0_REPORT.md`

## References

[1]: https://standards.buildingsmart.org/IFC/RELEASE/IFC4_3/HTML/chapter-7/index.html "buildingSMART IFC4.3 documentation"

La referencia sólo contextualiza IFC. Las conclusiones de BKH-0 se basan en el repositorio local y en los outputs guardados.
