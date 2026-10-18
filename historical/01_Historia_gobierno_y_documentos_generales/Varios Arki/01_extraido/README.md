# ARKI — Parallel Design Trials

## Resultado

Se generaron cuatro hipótesis independientes para el mismo problema, sitio, programa y restricciones duras. La imagen de referencia se utilizó únicamente para definir el formato de comparación; no se utilizó como geometría, fixture, ground truth ni entrada del motor.

| Modo | Estrategia fuente | ID de alternativa | Modelo | Planta 2D | Vista 3D |
|---|---|---|---|---|---|
| JUNIOR | Compact privacy | `ARKI-PARALLEL-TRIALS-001-JUNIOR-D2-A` | `ARKI-AUTHORING-1` | `junior-plan.svg` | `junior-3d.svg` |
| ARCHITECT | Courtyard social | `ARKI-PARALLEL-TRIALS-001-ARCHITECT-D2-B` | `ARKI-AUTHORING-1` | `architect-plan.svg` | `architect-3d.svg` |
| MASTER | Separated masses | `ARKI-PARALLEL-TRIALS-001-MASTER-D2-C` | `ARKI-AUTHORING-1` | `master-plan.svg` | `master-3d.svg` |
| CRAZY | Separated masses + bounded articulated outdoor variation | `ARKI-PARALLEL-TRIALS-001-CRAZY-D2-CRAZY` | `ARKI-AUTHORING-1` | `crazy-plan.svg` | `crazy-3d.svg` |

## Correspondencia 2D/3D

Cada modo tiene un `projectId`, `modelVersion`, `planId` y conjunto de elementos común entre sus dos vistas. La planta y la vista 3D no son imágenes independientes: se derivan del mismo `CanonicalBuildingModel`. Los metadatos completos, programa, áreas, relaciones, flujos, provenance y controles de unknowns están en los archivos `*-data.json`.

## Estado epistemológico y límites

Todas las geometrías permanecen en estado `HYPOTHESIS`. Las áreas y relaciones son deterministas y sintéticas. No se presenta ningún resultado como permiso, expediente constructivo, cálculo estructural, desempeño térmico, cumplimiento normativo o decisión humana. No se selecciona un ganador automáticamente.

La vista 3D entregada es **massing conceptual derivado** del modelo canónico disponible; no es un render fotorrealista. El modo CRAZY usa una variación no rectangular acotada sobre el espacio exterior, preservando programa y unknowns; no pretende representar superficies hiperbólicas ni ingeniería avanzada.

## Archivos

- `arki-parallel-trials-comparison.svg`: lámina comparativa.
- `junior-plan.svg`, `architect-plan.svg`, `master-plan.svg`, `crazy-plan.svg`: plantas 2D reales derivadas.
- `junior-3d.svg`, `architect-3d.svg`, `master-3d.svg`, `crazy-3d.svg`: vistas 3D conceptuales derivadas.
- `*-data.json`: readback completo por alternativa.
- `parallel-trials.json`: paquete consolidado de evidencia.
