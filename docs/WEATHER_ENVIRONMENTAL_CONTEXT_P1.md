# SiMS-DeI — Weather Environmental Context P1

**Status:** IMPLEMENTED LOCALLY — NOT PUSHED / NOT MERGED / NOT DEPLOYED

## Purpose

WEC-P1 adds meteorological wind context to the existing educational environmental workflow. It reuses the Open-Meteo retrieval already used by Solar P1 and exposes wind speed and meteorological direction for the shared A/B/C temporal scenario.

## Implemented scope

The Core requests `wind_speed_10m` in metres per second and `wind_direction_10m` from Open-Meteo. The environmental result preserves the existing source envelope and adds deterministic fields:

| Field | Meaning | Unit | Provenance |
|---|---|---|---|
| `wind_speed_m_s` | Wind speed at 10 m | m/s | Open-Meteo source value |
| `wind_direction_degrees` | Meteorological direction **from** which wind arrives | degrees | Open-Meteo source value |

The Web adds a `WEATHER_WIND` environmental layer, a compact vector in the existing 2D SVG viewer, and a textual readout in the environmental scenario panel. The layer is independently selectable and shares the selected date, time, location context, and A/B/C synchronization already implemented by ESE-P0.

## Semantic limits

WEC-P1 is contextual meteorological visualization. It is not CFD, wind comfort analysis, thermal simulation, airflow simulation, structural analysis, or a coupled environmental model. The wind vector does not mutate the spatial representation, create an evaluation, recommend an alternative, create a HumanReview, or create a Decision.

The Trujillo educational proxy remains explicitly disclosed when no confirmed project location is available. A confirmed project location, when supplied through the existing Core location flow, remains the source of environmental coordinates.

## Verification evidence

The local Core endpoint returned HTTP 200 for UPAO-001 at `2026-09-17 15:00`, with Open-Meteo source variables including `wind_speed_10m` and `wind_direction_10m`. Alternatives A, B, and C returned the same timestamp and wind values, proving shared temporal context rather than alternative-specific fabrication. `decision_created` remained `false`.

The Web preview displayed the `Weather wind` layer, the meteorological `from` convention, and the contextual 2D wind arrow while preserving the existing 2D/3D, Pareto, provenance, and A/B/C controls.

## Validation

The Core full suite collected 307 tests and completed without failures. The focused environmental suite passed 6 tests. The Web typecheck, focused environmental tests, full frontend suite, build, and `git diff --check` passed locally.

## Explicitly frozen

Wind comfort, CFD, temperature, humidity, rain, cloud physics, thermal, hydrology, terrain, GIS, and any other environmental family remain outside WEC-P1 and require a separate Product Owner order.

## Phase B — ambient temperature and multivariable presentation

The same Open-Meteo hourly request now includes `temperature_2m`. The Core exposes it as `air_temperature_c` with unit `°C`, timestamp, source variables, and the existing proxy/location provenance. The Web adds the independent `AIR_TEMPERATURE` layer and shows a compact ambient-context indicator. It does not color building surfaces or fabricate a spatial temperature field.

Solar, wind, and temperature share the same scenario, date, time, timezone, and A/B/C synchronization. Switching alternatives changes geometry only; contextual environmental values remain shared. Playback changes the temporal request and therefore displays the source value for the selected hour.

The multivariable experience remains an **interactive temporal environmental exploration**, not a real-time multiphysics simulation. Coupled comfort, thermal response, energy simulation, CFD, humidity-for-comfort, UTCI, PET, PMV/PPD, and surface temperature remain frozen.
