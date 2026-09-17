# SiMS-DeI — Analytical Solar Shadows P1

**Status:** IMPLEMENTED / PASS_WITH_OBSERVATIONS  
**Project:** UPAO-001  
**Scopes:** `edificacion`, `parcela_sitio`  
**Maturity:** `L2_GEOMETRY_INFORMED`  
**FFO subset:** `ANALYTICAL_SOLAR_SHADOWS_P1` only

## Purpose

This vertical extends the existing temporal solar capability from weather radiation and sun-position playback to a deterministic, geometry-informed 2D analytical shadow overlay. It reuses the existing `SpatialRepresentation`, canonical alternatives A/B/C, date/time controls, orientation and SVG viewer.

The analytical result is distinct from Three.js graphical renderer shadows:

```text
VISUAL_RENDERER_SHADOWS != ANALYTICAL_SOLAR_SHADOWS
```

Graphical shadows remain presentation-only. The analytical overlay is derived from building mass geometry and solar position.

## Deterministic derivation

The active coordinate convention is:

```text
COORDINATE_CONVENTION = LOCAL_ENU
x = east
 y = north
z = up
NORTH_REFERENCE = azimuth 0 degrees
AZIMUTH_CONVENTION = clockwise from north
SHADOW_DIRECTION_CONVENTION = opposite horizontal solar vector
```

For each `BuildingMass` with a valid height:

```text
shadow_length = height / tan(sun_elevation)
shadow_dx = -sin(sun_azimuth) * shadow_length
shadow_dy = -cos(sun_azimuth) * shadow_length
```

This is a conceptual geometry-informed analysis. It is not validated specialist solar simulation, daylight simulation, thermal simulation or energy simulation.

## Supported output

The 2D viewer exposes:

```text
specific date = existing temporal controls
specific time = existing temporal controls
sun azimuth = existing solar state
sun elevation = existing solar state
building orientation = existing SpatialRepresentation north_degrees
A/B/C geometry = canonical SpatialRepresentation elements
analytical shadow result = mass-level SVG overlay
```

The primary visual hierarchy is:

```text
DESIGN + ANALYTICAL SHADOW + TIME
```

Radiation values remain supporting data and are not the primary result.

## Night behavior

When:

```text
sun_elevation <= 0
```

the utility returns:

```text
status = NO_DIRECT_SOLAR_SHADOW
shadows = []
```

No fabricated night shadow is drawn.

## A/B/C verification

The same site, date and time were used for the three alternatives:

```text
DATE = 2026-09-17
TIME = 12:00
TIMEZONE = America/Lima
SOLAR_AZIMUTH = 14.1 degrees
SOLAR_ELEVATION = 79.1 degrees
SITE_CONTEXT_SHARED = YES
A_B_C_TIME_SYNCHRONIZED = YES
```

Observed mass-level results:

| Alternative | Geometry | Analytical shadows |
|---|---|---:|
| `UPAO-001-A` | COMPACT, one mass | 1 |
| `UPAO-001-B` | COURTYARD / VOID, four masses | 4 |
| `UPAO-001-C` | ARTICULATED, two masses | 2 |

`UPAO-001-B` preserves its courtyard and multi-mass relationships; it is not reduced to one generic bounding box.

```text
MULTI_MASS_RELATIONSHIPS_PRESERVED = YES
```

## Provenance and location truthfulness

The result preserves or displays:

```text
project_id = UPAO-001
alternative_id = UPAO-001-A/B/C
SpatialRepresentation identity = SR-UPAO-001-...
representation_version = 1.0
orientation source = SpatialRepresentation.north_degrees
specific date/time/timezone = visible temporal state
sun azimuth/elevation = visible solar state
geometry derivation = deterministic BuildingMass geometry
analysis maturity = L2_GEOMETRY_INFORMED
provenance = existing environmental provenance
```

The environmental source remains:

```text
ENVIRONMENTAL_PROXY_LOCATION = Trujillo, Peru
CONFIRMED_SPATIAL_LOCATION = MISSING / UNKNOWN
```

The proxy is disclosed and is not converted into a confirmed surveyed project location.

## Human authority

```text
SPATIAL_REPRESENTATION_MUTATED = NO
AUTOMATIC_RECOMMENDATION_CREATED = NO
AUTOMATIC_HUMAN_REVIEW_CREATED = NO
AUTOMATIC_DECISION_CREATED = NO
```

The result can support later Evaluation, Comparison or Pareto work, but this vertical does not integrate it automatically into those records.

## Validation

```text
TYPECHECK = PASS
FOCUSED_TESTS = 14 passed across Solar P1 utility and Spatial Pilot
FULL_TESTS = 164 passed / 27 files
BUILD = PASS
git diff --check = PASS
RUNTIME = PASS
```

The runtime preview confirmed:

- 2D analytical shadow overlay visible for A, B and C.
- A/B/C keep the same temporal solar condition.
- B displays four mass-level shadows.
- C displays two mass-level shadows.
- The UI explicitly states that graphical renderer shadows remain separate.
- The Trujillo environmental proxy disclosure remains visible.

The 3D viewer continues to show geometry and graphical presentation shadows. A separate 3D analytical shadow mesh was not added in this P1 because the 2D overlay provides the strongest deterministic proof without duplicating the rendering stack.

## Frozen scope

```text
FFO_01_REMAINDER = FROZEN
EXTERNAL_HIGH_QUALITY_RENDER_P2 = TEMPORARILY_FROZEN
PHOTO_REALISTIC_RENDERING = FROZEN
DISTRITO_CIUDAD_SPATIAL_PILOT_P0 = TEMPORARILY_FROZEN
GIS = NOT_ACTIVATED
TERRAIN = NOT_ACTIVATED
HYDROLOGY = NOT_ACTIVATED
WIND = NOT_ACTIVATED
CFD = NOT_ACTIVATED
MICROCLIMATE = NOT_ACTIVATED
VEGETATION = NOT_ACTIVATED
HAZARDS = NOT_ACTIVATED
URBAN_CONTEXT = NOT_ACTIVATED
```

## Acceptance result

```text
Q1_WHERE_IS_THE_SUN = YES, solar indicator and azimuth/elevation are visible
Q2_WHERE_DOES_DESIGN_CAST_SHADOW = YES, dashed analytical shadow footprint is visible in 2D
Q3_HOW_DOES_SHADOW_CHANGE_WITH_TIME = YES, temporal controls update sun state and derived overlay
Q4_HOW_DO_A_B_C_DIFFER = YES, mass-level counts and geometry differ under shared conditions
Q5_ANALYTICAL_OR_GRAPHICAL = YES, explicit UI disclosure separates both
```

```text
ANALYTICAL_SOLAR_SHADOWS_P1 = PASS_WITH_OBSERVATIONS
```

Observations are limited to the L2 conceptual nature of the analysis and the fact that analytical shadows are currently rendered in 2D; no specialist daylight, energy, thermal or facade exposure claims are made.
