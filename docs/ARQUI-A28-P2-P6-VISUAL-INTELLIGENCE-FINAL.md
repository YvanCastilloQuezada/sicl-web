# SiMS-DeI — ARQUI A28-P2 a P6
# Architectural Visual Intelligence — Final Report

## Estado

```text
A28-P2 MULTILEVEL AXONOMETRIC PRESENTATION = PASS_WITH_OBSERVATIONS
A28-P3 ANALYTICAL OVERLAY FRAMEWORK = PASS_WITH_OBSERVATIONS
A28-P4 PROFESSIONAL BOARD COMPOSER = PASS
A28-P5 COMPARISON / DESIGN REVIEW PRESENTATION = PASS_WITH_OBSERVATIONS
A28-P6 ARQUI PRESENTATION ORCHESTRATION = PASS_WITH_OBSERVATIONS
```

Las fases se implementaron como un **read model derivado** sobre HOUSE-001 y los componentes existentes de A28-P1, A20, A21, A22, A25 y A26. No se creó una entidad canónica nueva, una segunda base de verdad ni un renderer paralelo.

## A28-P2 — Coordinación multilevel

`buildMultilevelView()` coordina N1 y N2 usando:

- identidad estable de nivel;
- identidad de espacios;
- núcleos compartidos `STAIR-CORE` y `DUCT-CORE`;
- orientación `NORTH_UP`;
- escala `SHARED_SITE_SCALE`;
- estado de frescura derivado del mismo modelo `HOUSE-001-EXPLICIT:v1`.

La continuidad del núcleo se representa porque existe en el modelo residencial. No se infiere continuidad de instalaciones más allá del ducto explícito.

## A28-P3 — Overlays analíticos

Se añadieron overlays derivados con `analysis_id`, tipo, fuente, método, unidades, resultado y estado epistemológico:

| Overlay | Resultado | Estado |
|---|---|---|
| Daylight exposure | MEDIUM por orientación/apertura | PROXY |
| Ambient thermal context | 26 °C / 65 % / 2.4 m/s | OBSERVED |
| Declared circulation | ruta de 0.9 m; accesibilidad propuesta | DERIVED |
| Accessibility evidence | propuesta; no compliance | REQUIRES_HUMAN_REVIEW |
| Regulatory applicability | no evaluada | NOT_ASSESSED |
| Architectural critique | revisión requerida | REQUIRES_HUMAN_REVIEW |

No se generó un mapa térmico falso, ni una simulación solar real, ni una afirmación de accesibilidad o cumplimiento normativo.

## A28-P4 — Composer profesional

`composeReviewBoard()` compone:

- plan N1;
- plan N2;
- axonometría/hipótesis CRAZY;
- overlays ambientales legítimos;
- leyenda derivada de las capas visibles;
- métricas y advertencias;
- provenance A25/A26/A20/A16.

El composer no duplica geometría ni transforma un proxy en hecho.

## A28-P5 — Comparación y revisión

`comparePresentationStates()` coordina estados antes/después con:

- misma orientación;
- mismos niveles;
- mismos IDs de alternativa;
- diferencias explícitas de huella;
- trade-offs declarados;
- asuntos no resueltos;
- `winnerCreated = false`;
- `humanSelection = NONE`.

Una modificación de `BED-01` mediante `MOVE_ROOM` se muestra como cambio de huella, no como recomendación ni como ganador.

## A28-P6 — Orquestación de ARQUI

`orchestratePresentation()` atiende solicitudes derivadas:

```text
SHOW_PLAN
SHOW_ORGANIZATION
SHOW_CIRCULATION
SHOW_SOLAR
SHOW_CHANGED
PREPARE_REVIEW_BOARD
```

ARQUI devuelve:

1. la vista o tablero disponible;
2. los overlays aplicables;
3. capacidades ausentes;
4. advertencias epistemológicas;
5. estado de revisión humana;
6. confirmación de que no creó decisión ni ganador.

Por ejemplo, `SHOW_SOLAR` declara `REAL_SOLAR_SIMULATION` como no disponible en lugar de inventarla.

## Seguridad epistemológica

```text
SPACE POLYGON != WALL
DAYLIGHT PROXY != DAYLIGHT SIMULATION
AMBIENT WEATHER != THERMAL COMFORT
CARBON PROXY != PROJECT LCA
ACCESSIBILITY EVIDENCE != ACCESSIBILITY COMPLIANCE
CRITIQUE != DECISION
COMPARISON != WINNER
DISPLAY TRANSFORM != MODEL TRANSFORM
```

## Validación

```text
FOCUSED A28 P2-P6 = PASS
FULL WEB SUITE = PASS
TYPECHECK = PASS
BUILD = PASS
GIT_DIFF_CHECK = PASS
```

## Limitaciones declaradas

A28-P2 a P6 no implementan todavía:

- simulación física anual de iluminación;
- confort térmico PMV/PPD/UTCI/PET;
- CFD o simulación energética;
- LCA de proyecto o EPD verificados;
- verificación normativa automática;
- certificación de accesibilidad;
- structural analysis;
- exportación PDF/SVG profesional configurable;
- edición geométrica desde lenguaje natural;
- decisión o recomendación automática.

Estas salidas permanecen `UNKNOWN`, `NOT_ASSESSED`, `PROXY` o `REQUIRES_HUMAN_REVIEW` cuando corresponde.

## Cierre

```text
VISUAL_FIRST = PRESERVED
DATA_ON_DEMAND = PRESERVED
REUSE_BEFORE_CREATION = PASS
NO_SECOND_RENDERER = PASS
HUMAN_AUTHORITY = PRESERVED
DECISION_CREATED = FALSE
WINNER_CREATED = FALSE
```
