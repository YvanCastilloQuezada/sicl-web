# SiMS-DeI — ARQUI A28
# Architectural Visual Intelligence — P0 Audit + P1 House Presentation

## 1. Estado de ejecución

```text
AUTHORITY = Product Owner / Human Architect
P0 = COMPLETED
P1 = COMPLETED / PASS_WITH_OBSERVATIONS
PROJECT = HOUSE-001-EXPLICIT
MODEL_VERSION = HOUSE-001-EXPLICIT:v1
SECOND_RENDERER = NO
NEW_CANONICAL_ENTITY = NO
CORE_CONTRACT_CHANGED = NO
HUMAN_AUTHORITY = PRESERVED
```

La orden se ejecutó bajo `REUSE BEFORE CREATION`. El tablero es una composición derivada de las vistas residenciales y ambientales existentes; no crea una segunda fuente de verdad arquitectónica.

## 2. Capability Audit P0

| Capability | Estado | Evidencia reutilizada | Límite |
|---|---|---|---|
| Spatial representation | SUPPORTED | `residentialConstructivePlan`, ASI-G2 | explícita para el fixture HOUSE-001 |
| Architectural-space polygons | SUPPORTED | `architecturalSpaceGeometry` / plan residencial | no equivale automáticamente a muros |
| 2D plan rendering | SUPPORTED | render residencial existente | puertas/ventanas solo si canónicas |
| 3D / axonometric | PARTIAL | `UPAO001SpatialViewer`, render CRAZY | CRAZY es hipótesis, no modelo estructural |
| SVG | SUPPORTED | renderer espacial existente | la semántica debe seguir siendo derivada |
| Levels | SUPPORTED | A22 + plan N1/N2 | continuidad futura requiere más casos |
| Program labels / areas | SUPPORTED | plan residencial | áreas explícitas del fixture |
| Functional zoning | SUPPORTED | categorías derivadas PUBLIC/PRIVATE/SERVICE/CIRCULATION |
| Circulation | PARTIAL | A20-P1 y núcleos verticales | intención no equivale a ruta accesible verificada |
| North / orientation | SUPPORTED | plan y representación HOUSE-001 |
| Daylight | PARTIAL / PROXY | A25 | no es simulación anual de iluminancia |
| Thermal | CONTEXT ONLY | A25 | no es temperatura operativa ni confort |
| Environmental weather | SUPPORTED | contexto ambiental existente |
| A15 reading | SUPPORTED | reader arquitectónico |
| A16 critic | SUPPORTED | geometry-critical reading |
| A17 revision | SUPPORTED | controlled revision |
| A20 circulation/accessibility/regulatory | PARTIAL | evidence graph, assessment, applicability foundation | no implica compliance |
| A21 design reasoning | SUPPORTED as derived model | relations, zoning, DesignMemory |
| HOUSE-001 visualization | SUPPORTED | three house views + board |
| CRAZY visualization | SUPPORTED / HYPOTHESIS | ruled/hyperbolic controlled profile |
| Export | PARTIAL | PNG artifacts | SVG/PDF professional export remains future work |
| Responsive UI | SUPPORTED at product shell level | existing responsive Web | board itself is a fixed high-resolution artifact |

## 3. Plan presentation capability matrix

| Feature | Status | Truthful representation |
|---|---|---|
| Space boundary | SUPPORTED | explicit room polygons |
| Space identity/name | SUPPORTED | fixture room identities |
| Actual area | SUPPORTED | computed from explicit room model |
| Target area | UNKNOWN | not supplied in canonical fixture |
| Functional category | SUPPORTED | derived zone category |
| Circulation | PARTIAL | explicit circulation elements and intent |
| Access | PARTIAL | evidence only; not compliance |
| Doors | NOT_SUPPORTED unless canonical | no doors invented |
| Windows | NOT_SUPPORTED unless canonical | no windows invented |
| Openings | NOT_SUPPORTED unless canonical | no openings invented |
| Walls | NOT_SUPPORTED as semantic elements | boundaries are not walls |
| Core/stair/shaft | PARTIAL / SUPPORTED where explicit | visualized only when represented |
| Level | SUPPORTED | N1/N2 stable IDs |
| North | SUPPORTED | orientation marker |
| Scale/dimensions | PARTIAL | only when canonical dimensions exist |
| Annotations | SUPPORTED | derived labels, metrics and warnings |
| Site/context | PARTIAL | project/site context available as fixture |

## 4. Semantic gates

```text
SPACE POLYGON != WALL
SHARED BOUNDARY != DOOR
PROXIMITY != ADJACENCY
ADJACENCY != ACCESS
OUTDOOR TEMPERATURE != INDOOR COMFORT
DAYLIGHT PROXY != DAYLIGHT SIMULATION
CARBON FACTOR PROXY != PROJECT LCA
CRAZY HYPOTHESIS != STRUCTURAL VALIDITY
```

No furniture, doors, windows, lux heatmaps, operative temperatures, structural claims or verified carbon values were fabricated.

## 5. A28-P1 implemented capability

A derived `PresentationViewModel` now composes the HOUSE-001 professional presentation from canonical and existing derived data. It contains project and alternative identity, model version, level bindings, visible layers, metrics, warnings, provenance and board blocks.

The first useful proof includes:

- N1 plan;
- N2 plan;
- coordinated N1/N2 identity;
- axonometric CRAZY hypothesis;
- daylight proxy/context panels;
- thermal context explicitly marked `NOT_ASSESSED` for comfort;
- carbon explicitly marked `PROXY`;
- metric cards with scope, method, source and epistemic state;
- professional warnings and provenance.

## 6. Board artifact

`HOUSE-001-professional-board.png` is a high-resolution derived composition. It is not a new architectural model and does not persist presentation state as a canonical entity.

The board intentionally degrades unavailable analyses:

```text
SIMULATION → PROXY → CONTEXT → UNKNOWN
```

It never degrades them into invented simulation.

## 7. CRAZY safety

The expressive view preserves N1/N2 identity and the vertical cores, while showing the ruled/hyperbolic envelope as a controlled hypothesis. It exposes structural uncertainty and requires human engineering review. It does not imply buildability, structural feasibility, code compliance or thermal performance.

## 8. A28-P0/P1 acceptance

```text
P0_CAPABILITY_AUDIT = PASS
P1_PROFESSIONAL_PLAN_PRESENTATION = PASS_WITH_OBSERVATIONS
TRACEABLE_VISIBLE_INFORMATION = PASS
TRUTHFUL_DEGRADATION = PASS
NO_FAKE_DASHBOARD = PASS
NO_SECOND_RENDERER = PASS
HOUSE_001_BOARD = PASS_WITH_OBSERVATIONS
```

Observation: the supplied target reference contains richer photorealistic and analytical graphics than the current canonical dataset can justify. The implementation therefore preserves professional information hierarchy while explicitly labeling proxy, context, hypothesis and not-assessed states.

## 9. Next authorized sequence

A28-P2 may later extend the same derived presentation model to multilevel axonometric coordination. A28-P3 may later formalize analytical overlays. A28-P4 may later compose configurable export boards. These are not silently activated by this report.
