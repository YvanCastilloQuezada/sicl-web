# SiMS-DeI — TESU-P1 Territorial Environmental Scale-Up

**Status:** Implemented locally; not pushed, merged, or deployed.  
**Baseline:** TEIF-P0 approved locally.  
**Pilot:** UPAO-001.

## Scale-adaptive capability matrix

| SpatialScope | Primary role | Representation | Temporal semantics | Resolution disclosure |
|---|---|---|---|---|
| `distrito_ciudad` | Local context | Point context + provider model grid | Hour/day | Provider cell; not administrative boundary |
| `provincia_metropoli` | Metropolitan pattern | Provider grid + temporal series | Hour/day and climate period | Provider cell; not provincial boundary |
| `region` | Regional context | Regional pattern + temporal series | Daily and climate period | Model cell; no regional polygon asserted |
| `macro_region` | Macro-regional pattern | Pattern comparison + scenario context | Model period / temporal comparison | Provider resolution; no macro-region polygon asserted |
| `pais` | National pattern | National pattern + regional comparison | Climate and temporal comparison | Provider resolution; no national polygon asserted |

## Cross-scale continuity

The shared Web shell transitions the same environmental workspace across the five active scopes. The Core returns an explicit `cross_scale` record and sets `containment_asserted=false` and `relationship_evidence=none` unless a future authoritative spatial relationship is supplied. The pilot therefore preserves continuity of task and provenance without inventing district, province, regional, macro-regional, or national polygons.

## Active environmental families

Air quality and climate are available through the Open-Meteo provider path. Existing weather, solar, wind, temperature, and radiation capabilities remain available through the existing environmental path where requested by the existing workspace. They are not collapsed into a single semantic layer. Weather, climate, climate projection, provider cell, and local measurement remain distinct concepts.

## Human authority

The territorial endpoint is read-only. No recommendation, HumanReview, or Decision is created by scale changes, environmental overlays, comparisons, or provider responses.

## Deferred and frozen

No administrative GIS, cadastral geometry, polygon generation, spatial database migration, advanced geoprocessing, flood, marine, satellite, CFD, hydrological simulation, energy simulation, urban microclimate, or coupled comfort analysis was activated.
