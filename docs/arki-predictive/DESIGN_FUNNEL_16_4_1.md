# ARKI Design Funnel 16 → 4 → 1

El flujo canónico de ARKI es **N → 16 → 4 → 1 → SELECTED_FOR_DEVELOPMENT**. N representa exploración de máquina con presupuesto configurable; 16 es la superficie visual humana; 4 recibe información comparativa más profunda; 1 es una decisión explícita del arquitecto. ARKI no elige ganador automáticamente.

Los candidatos no seleccionados se preservan como `ARCHIVED`; no se eliminan. Cada promoción genera `HUMAN_DESIGN_SELECTION` con proyecto, exploración, generación, conjunto disponible, selección, no seleccionados, actor, fecha, evidencia y contexto UI.

La implementación ejecutable está en `shared/arkiDesignFunnel.ts` y la pantalla minimalista en `/arki-design-funnel`.

## Estados

`DESIGN_EXPLORER_16`, `FINALIST_4`, `SELECTED_FOR_DEVELOPMENT`, `RETURNED_TO_FINALISTS`, `BLOCKED` y `ARCHIVED` son estados de trabajo; no significan expediente oficial, aprobación normativa ni diseño final firmado.

## Límites

La orden S1 no autoriza nuevos solvers comerciales, despliegue productivo, publicación pública, ni la sustitución de ARKI-SEE o CCF.
