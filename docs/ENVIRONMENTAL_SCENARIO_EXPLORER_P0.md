# SiMS-DeI — Environmental Scenario Explorer P0

**Status:** IMPLEMENTED / PASS_WITH_OBSERVATIONS  
**Branch:** `feat/spatial-pilot-media-studio-v1`  
**Active vertical:** `ENVIRONMENTAL_SCENARIO_EXPLORER_P0`  
**Baseline:** `f0373bc7afe1b46a8845c27ef7f7f060f128c793`

## Scope

ESE-P0 implements interactive scenario exploration by orchestrating existing UPAO-001 environmental capabilities. It does not implement new environmental physics, a generic simulation engine, persistence, GIS, terrain, or additional environmental families.

The current product supports three truthful layers:

```text
SUN_POSITION
SOLAR_RADIATION
ANALYTICAL_SOLAR_SHADOW
```

The user may select one or multiple layers simultaneously. Multiple visible layers mean **overlay**, not coupled physics.

```text
ENVIRONMENTAL_LAYER_OVERLAY != COUPLED_ENVIRONMENTAL_ANALYSIS
COUPLED_ENVIRONMENTAL_ANALYSIS != PHYSICS_BASED_SIMULATION
```

## Scenario model

```text
SCENARIO_MODEL = VIEW / APPLICATION STATE
NEW_CANONICAL_ENTITY = NO
DATABASE_SCHEMA_CHANGED = NO
```

The scenario view state contains:

| Field | Current value or meaning |
|---|---|
| `scenarioType` | `PROXY_EDUCATIONAL` |
| `selectedDate` | Shared temporal date |
| `selectedTime` | Shared temporal time |
| `activeLayers` | One or more currently supported environmental layers |
| `locationName` | Current source location, presently Trujillo proxy |

No scenario is persisted to the Core or SQLite. No database schema was changed.

## Provenance

```text
SCENARIO_TYPE_IMPLEMENTED = PROXY_EDUCATIONAL
ENVIRONMENTAL_PROXY_LOCATION = Trujillo, Peru
CONFIRMED_SPATIAL_LOCATION = MISSING / UNKNOWN
PROVENANCE_VISIBLE = YES
PER_LAYER_PROVENANCE_COMPATIBLE = PARTIAL
```

The UI does not label the proxy as observed at the UPAO site and does not label synthetic educational conditions as real weather.

## Shared time and playback

The existing date/time controls and hourly playback are reused.

```text
SHARED_TIME_CONTEXT = YES
TIME_CONTROLLER_REUSABLE = YES
PLAYBACK_REUSED = YES
```

Changing date or time updates the temporal solar request and the active analytical shadow inputs. A/B/C are inspected under the same date, time, source context and active layer selection.

The term **interactive temporal exploration** is used instead of real-time physics simulation.

## A/B/C invariants

```text
A_B_C_SHARED_SCENARIO = YES
A_B_C_TIME_SYNCHRONIZED = YES
SITE_CONTEXT_SHARED = YES
SCENARIO_CHANGE_CREATES_ALTERNATIVE = NO
SCENARIO_CHANGE_MUTATES_GEOMETRY = NO
SPATIAL_REPRESENTATION_MUTATED = NO
```

Changing the active alternative changes only the inspected design geometry. It does not create a new environmental scenario. Changing date, time or layers does not alter `SpatialRepresentation`, `Alternative` or site geometry.

## Analytical maturity

```text
ANALYTICAL_SOLAR_SHADOW_MATURITY = L2_GEOMETRY_INFORMED
COUPLED_ENVIRONMENTAL_ANALYSIS = NOT_IMPLEMENTED
PHYSICS_BASED_SIMULATION = NOT_IMPLEMENTED
```

Solar shadows remain visually and semantically distinct from graphical Three.js presentation shadows.

## Visual acceptance

The runtime preview confirmed:

| Question | Result |
|---|---|
| Q1. Identify active scenario | YES — Educational / Trujillo proxy is visible |
| Q2. Select multiple available layers | YES — three supported checkboxes are available |
| Q3. See selected effects spatially | YES — solar direction and analytical shadow are visible in 2D when selected |
| Q4. Change time and update layers | YES — date/time controls and playback are shared |
| Q5. Inspect A/B/C under same scenario | YES |
| Q6. Understand no coupled physics | YES — explicit overlay-only disclosure |
| Q7. See proxy/synthetic provenance | YES |
| Q8. Keep design visually dominant | YES — design/site geometry remains primary |

The selected shadow layer can be disabled independently while sun position and solar radiation remain selected, proving that layer selection is independent and not a coupled model.

## Human authority and immutability

```text
AUTOMATIC_RECOMMENDATION_CREATED = NO
AUTOMATIC_HUMAN_REVIEW_CREATED = NO
AUTOMATIC_DECISION_CREATED = NO
```

## Tests and build

```text
FOCUSED_ESE_TESTS = 2 passed
FULL_FRONTEND_TESTS = 166 passed
TEST_FILES = 28 passed
TYPECHECK = PASS
BUILD = PASS
git diff --check = PASS
RUNTIME = PASS
```

## Explicitly not implemented

```text
WIND = NOT_IMPLEMENTED
CFD = NOT_IMPLEMENTED
TEMPERATURE = NOT_IMPLEMENTED
THERMAL_SIMULATION = NOT_IMPLEMENTED
HUMIDITY = NOT_IMPLEMENTED
RAIN = NOT_IMPLEMENTED
CLOUD = NOT_IMPLEMENTED
UV = NOT_IMPLEMENTED
AIR_QUALITY = NOT_IMPLEMENTED
ACOUSTICS = NOT_IMPLEMENTED
VEGETATION = NOT_IMPLEMENTED
ENERGY = NOT_IMPLEMENTED
CARBON = NOT_IMPLEMENTED
TERRAIN = NOT_IMPLEMENTED
GIS = NOT_IMPLEMENTED
CLIMATE_SCENARIOS = NOT_IMPLEMENTED
COUPLED_PHYSICS = NOT_IMPLEMENTED
GENERIC_SIMULATION_ENGINE = NOT_IMPLEMENTED
```

## Result

```text
ENVIRONMENTAL_SCENARIO_EXPLORER_P0 = PASS_WITH_OBSERVATIONS
```

The observation is that the scenario remains an application/view state and the available environmental layers are limited to currently evidenced capabilities. Future scenario persistence, per-layer provenance expansion, coupled analytical models and physical simulation remain frozen pending separate authorization.
