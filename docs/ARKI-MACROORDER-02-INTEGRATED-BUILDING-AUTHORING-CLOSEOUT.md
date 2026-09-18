# ARKI — Macroorden 02
## Integrated Building Authoring and Delivery Closeout

## Result

Macroorden 02 autorizó V-A, V-B y V-C. Se implementó el puente local que faltaba para derivar múltiples representaciones desde un único modelo canónico de edificio basado en la planta conceptual S1 existente.

```text
V-A LOCAL VISUAL FOUNDATION = REUSED / AVAILABLE
V-B DOCUMENTATION FOUNDATION = IMPLEMENTED / CONCEPTUAL
V-C BIM/CAD FOUNDATION = REUSED / MASSING-BOUNDED
GIS GEOJSON BOUNDARY = IMPLEMENTED
CROSS-REPRESENTATION IDENTITY = PROVEN LOCALLY
V-FINAL = FROZEN / NOT TOUCHED
```

## Canonical building authoring

The new `CanonicalBuildingModel` is derived from the existing S1 plan. It carries stable ARKI IDs, model version, geometry version, lineage, provenance and `HYPOTHESIS` epistemic state. It includes available conceptual spaces, walls, partitions, doors, windows, stair, shafts and routes. It preserves the existing maturity boundary:

```text
MATURITY = CONCEPTUAL
CONSTRUCTION_DOCUMENTATION = NOT_CLAIMED
PERMIT_READY = FALSE
CONSTRUCTION_READY = FALSE
```

The model is a derived representation, not a second source of truth and not a replacement for the S1 spatial model.

## Visual and documentation surfaces

The existing SVG spatial viewer and 3D massing viewer remain the visual surfaces. The new authoring bridge derives four inspectable drawing views from the same model:

```text
FLOOR_PLAN
SITE_PLAN
BUILDING_SECTION
EXTERIOR_ELEVATION
```

The views preserve `modelVersion`, referenced element IDs and provenance. SVG output contains the model version, maturity, source IDs and explicit non-permit/non-construction claims. Section and elevation output is intentionally bounded by available geometry; unmodeled assemblies remain unknown.

This does not claim photorealistic rendering, native CAD sheet production or construction documentation.

## BIM/CAD and GIS reuse

Existing massing-bounded exports remain available:

- DXF for massing and linework exchange.
- IFC4 text export for massing exchange.
- GLB for massing visualization.

The existing IFC adapter remains massing-only. It does not claim native Revit authoring, construction BIM or validated professional IFC coordination.

The new GeoJSON boundary preserves project/alternative identity, representation version, units, CRS, provenance and synthetic uncertainty metadata. A georeferenced survey, parcel authority or terrain model is not fabricated.

## Cross-representation identity

Local validation proves that drawing references resolve to canonical ARKI element IDs and that model elements have unique identities, model versions, lineage and provenance. The validated local chain is:

```text
S1 element
→ CanonicalBuildingModel.arkiId
→ DrawingView.elementIds
→ SVG data-arki-id
```

IFC, DXF and GLB already preserve massing-level element references through their existing metadata and generated entity names. Revit identity remains external and unproven because no compatible Revit execution environment is available.

## Explicit external dependencies

```text
PHOTOREALISTIC_RENDERING = EXTERNAL_RENDERER_REQUIRED
NATIVE_REVIT_EXECUTION = EXTERNAL_ENVIRONMENT_REQUIRED
REVIT_READBACK = NOT_PROVEN
IFC_PROFESSIONAL_VALIDATION = NOT_VERIFIED_WITH_EXTERNAL_VALIDATOR
DWG = EXTERNAL_ADAPTER_REQUIRED
SURVEYED GIS / TERRAIN = REQUIRES_DATA
```

These states are not converted into false local passes.

## Validation

```text
FOCUSED AUTHORING / GDI / S1 / S2 / EXPORT = 27 tests passed
FULL WEB SUITE = RUN AFTER THIS DOCUMENTATION UPDATE
TYPESCRIPT = RUN AFTER THIS DOCUMENTATION UPDATE
BUILD = RUN AFTER THIS DOCUMENTATION UPDATE
GIT_DIFF_CHECK = RUN AFTER THIS DOCUMENTATION UPDATE
```

## V-FINAL boundary

V-FINAL remains frozen. No cross-representation convergence modification, human architectural change propagation across all visual/document/BIM outputs, or final convergence proof was executed.

## Files added

- `client/src/components/arkiBuildingAuthoring.ts`
- `client/arki-building-authoring.test.ts`
- `docs/ARKI-MACROORDER-02-INTEGRATED-BUILDING-AUTHORING-CLOSEOUT.md`
