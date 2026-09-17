# SiMS-DeI — Territorial Environmental Intelligence Foundation P0

**Status:** IMPLEMENTED LOCALLY — NOT PUSHED / NOT DEPLOYED  
**Pilot:** UPAO-001  
**Active scope:** `distrito_ciudad`  
**Date:** 2026-09-17

## Purpose

TEIF-P0 adds a read-only territorial environmental context for the educational UPAO-001 project. It composes already available Open-Meteo access with two additional source families: Air Quality and Climate. The response preserves provider, model, time horizon, spatial resolution, evidence URL, and explicit proxy semantics.

## Representation

The pilot uses `POINT_CONTEXT + PROVIDER_MODEL_GRID`. The Trujillo coordinate is a provider query point, not a cadastral boundary, a GIS parcel, a local sensor station, or a generated territorial polygon. The Web view renders a lightweight model-grid context so that the architect can inspect provenance and scale without fabricating map data.

## Source families

| Family | API | Temporal semantics | Spatial semantics | Status |
|---|---|---|---|---|
| Air quality | Open-Meteo Air Quality API | Hourly selected timestamp | Provider model grid; not local sensor | Available when provider responds |
| Climate | Open-Meteo Climate API | Daily value and model horizon | Provider climate-model cell | Available when provider responds |

Weather and climate remain separate. Air-quality values are not treated as health diagnosis. Climate values are not treated as a forecast certainty or a building-performance simulation.

## Human authority invariants

The endpoint is read-only. It creates no `Recommendation`, `HumanReview`, `Decision`, or implicit design action. It returns `decision_created=false`, `human_review_created=false`, and `recommendation_created=false`. Any provider failure is surfaced as a family-level error rather than replaced with invented data.

## Web experience

`/territorial-environment` provides a lightweight visual context with a date/time control, independent family selection, provider-grid illustration, model metadata, and disclosure of provenance. It does not claim cadastral geometry, GIS coverage, thermal comfort, CFD, hydrology, or coupled environmental simulation.

## Deferred

The following remain outside TEIF-P0: official air-quality stations, geospatial polygons, GIS layers, cadastral boundaries, terrain, health interpretation, climate downscaling, thermal comfort, energy simulation, and automatic recommendation.
