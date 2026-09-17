# SiMS-DeI — Complete Canonical Multiscale Interoperability Matrix V1

**Type:** Architecture / Product Owner review artifact  
**Status:** Documentation-only; pending final Product Owner closure  
**Baseline:** `be0b00ac6433cdb8bfd71f1800ad6a442b33e45e`  
**Massing profile:** `4496a3a080a0b8637e4197a341824ece06a6be6f`  

## 1. Scope and invariants

This document defines the conceptual interoperability profile for the eleven canonical `SpatialScope` values. It does not implement GIS, add exporters, alter IFC/DXF/GLB, activate a frozen future order, or change the Core Contract.

The canonical model is:

```text
SpatialScope
+ RepresentationSemantics
+ AvailableData
+ CoordinateContext
+ GeoreferencingRequirement
+ TargetProfessionalWorkflow
↓
MultiscaleInteroperabilityProfile
↓
ExportCapabilityResolver
↓
CAD / BIM / GIS / 3D / MEDIA
```

Interoperability is **compositional**. CAD, BIM, GIS, 3D and Media may coexist at one scale.

Capability state, professional role and implementation maturity are independent:

```text
CAPABILITY_STATE ≠ INTEROPERABILITY_ROLE ≠ IMPLEMENTATION_MATURITY
```

Capability states are `AVAILABLE`, `REQUIRES_DATA`, `NOT_AVAILABLE`, and `NOT_APPLICABLE`. Roles are `PRIMARY`, `CO_PRIMARY`, `SUPPORTING`, `CONTEXTUAL`, and `NOT_APPLICABLE`. Documentation maturity is descriptive only: `IMPLEMENTED`, `PARTIALLY_IMPLEMENTED`, `DOCUMENTED`, and `FUTURE_FROZEN`.

## 2. Canonical SpatialScopes

The verified identifiers and hierarchy are:

| Order | SpatialScope | Canonical meaning |
|---:|---|---|
| 1 | `pais` | Country-level territorial system |
| 2 | `macro_region` | Multiregional territorial system |
| 3 | `region` | Regional territorial system |
| 4 | `provincia_metropoli` | Provincial or metropolitan system, intentionally grouped |
| 5 | `distrito_ciudad` | District/city urban system |
| 6 | `zona_barrio_sector` | Neighborhood/sector urban system |
| 7 | `parcela_sitio` | Parcel/site and immediate context |
| 8 | `edificacion` | Architectural building configuration |
| 9 | `sistema` | Technical or functional system integrated in the project hierarchy |
| 10 | `espacio` | Spatial boundary, volume, relationship or zone |
| 11 | `objeto` | Material, technical or spatial object |

`SYSTEM_SCOPE_CANONICAL_MEANING` is **technical or functional system integrated within the project hierarchy**, supported by the canonical relation `edificacion → sistema → espacio`. It is not automatically an MEP model, construction family, urban system, or manufacturing object.

## 3. Complete 23-dimension matrix

The values below are architectural review defaults, not claims that every future capability is implemented. `NOT_AVAILABLE` means professionally relevant but not currently delivered; `REQUIRES_DATA` means the capability could be used once required data exists; `NOT_APPLICABLE` is reserved for semantic inappropriateness.

| SpatialScope | Primary representation | Secondary representations | CAD state / role | BIM state / role | GIS state / role | 3D state / role | Media state / role | GIS input / context / export | Georef. role | Coordinate requirement | Geometric detail | Information level | Primary professional workflow | Current implementation state | Future requirement |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `objeto` | Object geometry and attributes | Local volume, orientation, image | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / PRIMARY` when object semantics justify it | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `REQUIRES_DATA / SUPPORTING` | Contextual / contextual / supporting | `OPTIONAL` | `LOCAL_ENU`; geographic anchor only when meaningful | Dimensions, position, orientation | Object identity and provenance | Object design/review | Documented; no object exporter | Object-specific CAD/BIM/3D semantics without fabrication claims |
| `espacio` | Boundary, volume, zones and relationships | 2D plan, 3D volume, contextual location | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `REQUIRES_DATA / SUPPORTING` | Contextual / contextual / supporting | `OPTIONAL` | `LOCAL_ENU`; optional geographic context | Boundary and volume, not construction assemblies | Space identity, relationships and provenance | Interior/spatial organization | Documented; no space exporter | Spatial CAD/BIM/3D representation without inventing walls or slabs |
| `sistema` | Technical/functional system representation | Components, relationships, diagrams, 3D | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / PRIMARY` where semantic system data exists | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `REQUIRES_DATA / SUPPORTING` | Contextual / contextual / supporting | `CONTEXTUAL` | `LOCAL_ENU`, with geographic anchor when system context requires it | Components and relationships | Functional/technical identity and dependencies | System integration and coordination | Documented; no system exporter | Canonical system semantics and adapters |
| `edificacion` | Architectural massing | Footprint, site boundary, local 3D, geographic context | `AVAILABLE / SUPPORTING` | `AVAILABLE / PRIMARY` for massing-only IFC | `NOT_AVAILABLE / CONTEXTUAL` | `AVAILABLE / PRIMARY` for visual massing | `AVAILABLE / SUPPORTING` | Contextual / contextual / future | `CONTEXTUAL` | `LOCAL_ENU` + `EPSG:4326` project reference | Masses, footprint and placement | Massing identity, units, height, provenance | Architectural massing → IFC/DXF/GLB → professional continuation | Implemented V1 massing profile | Preserve massing; add richer context only with approved scope |
| `parcela_sitio` | Site, parcel and immediate spatial context | Masses, open space, circulation, location | `AVAILABLE / CO_PRIMARY` for existing footprint/massing exchange | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CO_PRIMARY` | `NOT_AVAILABLE / SUPPORTING` | `REQUIRES_DATA / SUPPORTING` | Input / co-primary / future | `IMPORTANT` | `EPSG:4326` reference + local design coordinates | Parcel/site boundary and masses | Location, boundary, provenance and site relations | Site planning and parcel analysis | RFC-028 initial read-only GIS architecture; no GIS export | Parcel persistence, official sources and GIS export |
| `zona_barrio_sector` | Urban morphology and spatial relations | Buildings, parcels, public space, networks | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CO_PRIMARY` | `NOT_AVAILABLE / SUPPORTING` | `REQUIRES_DATA / SUPPORTING` | Input / co-primary / future | `IMPORTANT` | Geographic CRS and explicit provenance | Simplified objects, boundaries and networks | Land use, relations, provenance and temporal context | Neighborhood/sector planning | Documented; no urban exporter | GIS data, networks and scenario visualization |
| `distrito_ciudad` | Urban spatial system | Morphology, zones, networks, infrastructure | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CO_PRIMARY` | `NOT_AVAILABLE / SUPPORTING` | `REQUIRES_DATA / SUPPORTING` | Input / co-primary / future | `ESSENTIAL` | Geographic CRS, attributes and provenance | Points, lines, polygons and networks | Urban entities, indicators and relations | City/district planning and analysis | Documented; no GIS/urban exporter | GIS input/export, urban 3D and scenario profiles |
| `provincia_metropoli` | Metropolitan/provincial territorial system | Networks, settlements, infrastructure, indicators | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `NOT_AVAILABLE / CONTEXTUAL` | `REQUIRES_DATA / SUPPORTING` | Input / primary / future | `ESSENTIAL` | Geographic CRS, network and provenance context | Networks, areas and simplified entities | Territorial indicators, provenance and time | Metropolitan/provincial strategy | Documented; no territorial exporter | Distinguish provincial and metropolitan workflows within the grouped scope |
| `region` | Regional territorial system | Environment, economy, networks, indicators | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `NOT_AVAILABLE / CONTEXTUAL` | `REQUIRES_DATA / SUPPORTING` | Input / primary / future | `ESSENTIAL` | Geographic CRS, attributes and provenance | Areas, networks, points and thematic layers | Regional indicators, scenarios and time | Regional planning and analysis | Documented; no territorial exporter | Regional GIS, temporal and scenario representations |
| `macro_region` | Multiregional territorial system | Cross-region networks, sectors, scenarios | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `NOT_AVAILABLE / CONTEXTUAL` | `REQUIRES_DATA / SUPPORTING` | Input / primary / future | `ESSENTIAL` | Geographic CRS, network and provenance context | Networks, areas and thematic systems | Cross-regional indicators and scenarios | Multiregional coordination | Documented; no territorial exporter | Cross-region GIS and scenario workflows |
| `pais` | National territorial system | Administrative, infrastructure, environmental and scenario systems | `NOT_AVAILABLE / SUPPORTING` | `NOT_AVAILABLE / CONTEXTUAL` | `NOT_AVAILABLE / PRIMARY` | `NOT_AVAILABLE / CONTEXTUAL` | `REQUIRES_DATA / SUPPORTING` | Input / primary / future | `ESSENTIAL` | Geographic CRS, provenance and temporal context | Networks, areas, points, thematic systems | National indicators, scenarios and provenance | National territorial planning | Documented; no national exporter | Country-scale GIS and scenario representation; never a giant building model |

## 4. GIS role matrices

| SpatialScope | GIS input role | GIS context role | GIS export role |
|---|---|---|---|
| `objeto` | `CONTEXTUAL` | `CONTEXTUAL` | `SUPPORTING` |
| `espacio` | `CONTEXTUAL` | `CONTEXTUAL` | `SUPPORTING` |
| `sistema` | `CONTEXTUAL` | `CONTEXTUAL` | `SUPPORTING` |
| `edificacion` | `CONTEXTUAL` | `CONTEXTUAL` | `SUPPORTING` |
| `parcela_sitio` | `CO_PRIMARY` | `CO_PRIMARY` | `PRIMARY` |
| `zona_barrio_sector` | `CO_PRIMARY` | `CO_PRIMARY` | `PRIMARY` |
| `distrito_ciudad` | `PRIMARY` | `CO_PRIMARY` | `PRIMARY` |
| `provincia_metropoli` | `PRIMARY` | `PRIMARY` | `PRIMARY` |
| `region` | `PRIMARY` | `PRIMARY` | `PRIMARY` |
| `macro_region` | `PRIMARY` | `PRIMARY` | `PRIMARY` |
| `pais` | `PRIMARY` | `PRIMARY` | `PRIMARY` |

These are roles, not implementation claims. Current GIS export remains unavailable and GIS implementation is not activated by this document.

## 5. Georeferencing and coordinate architecture

`LOCAL_ENU` and `EPSG:4326` are distinct coordinate contexts and may coexist:

```text
LOCAL DESIGN SPACE
+ GEOGRAPHIC REFERENCE SPACE
↓
Coordinate / CRS Context
```

- `objeto`, `espacio`: local coordinates are normally sufficient; geography is optional/contextual.
- `sistema`, `edificacion`: local design geometry may remain primary while location and environmental context use geographic reference.
- `parcela_sitio`: georeferencing is important because parcel, site and jurisdiction relationships depend on location.
- Urban and territorial scopes: explicit geographic CRS, provenance and often temporal context are essential.

No coordinate transformation is implemented by this matrix.

## 6. Visualization relationship

Presentation capability may adapt by scale but does not define export geometry.

Architectural modes may include `LINES`, `FACES`, `SHADOWS`, `MATERIALS`, `REALISTIC`, and `PHOTO_REALISTIC`. Urban and territorial work may eventually emphasize boundaries, networks, density, mobility, environment, infrastructure, risk, terrain and scenarios. These future modes are documented, not implemented here.

```text
PresentationMode ≠ ExportProfile
GeometricDetail ≠ InformationLevel
Media ≠ EditableSpatialData
```

## 7. Massing lock relationship

```text
DL-EXPORT-MASSING-01 = CLOSED / ACTIVE
MASSING_LOCK_SCOPE = EDIFICACION / CURRENT ARCHITECTURAL MASSING PROFILE
ALL_SPATIALSCOPES_EXPORT_MASSING = NO
```

The existing profile remains:

- IFC = massing BIM exchange.
- DXF = massing/footprint CAD exchange.
- GLB = massing visual exchange.

No walls, doors, windows, slabs, beams, columns, foundations, MEP, families, quantities or construction documentation are fabricated.

`DL-MULTISCALE-EXPORT-01` is the all-scale architecture and is compatible with the narrower architectural massing lock.

## 8. Implementation maturity summary

| Family | Current maturity | Evidence | Boundary |
|---|---|---|---|
| CAD / DXF | `PARTIALLY_IMPLEMENTED` | Architectural massing/footprint export | Not a universal CAD adapter |
| BIM / IFC | `PARTIALLY_IMPLEMENTED` | IFC4 massing exchange at `edificacion` | Not native Revit, not construction BIM |
| GIS | `DOCUMENTED` | Location, parcel and RFC-028 read-only direction | No GIS export or new GIS dependency |
| 3D / GLB | `PARTIALLY_IMPLEMENTED` | UPAO-001 massing visualization/export | Not universal territorial 3D data |
| Media / PNG/WebM | `IMPLEMENTED` | Presentation capture in Spatial Pilot | Not editable spatial data |

## 9. Product Owner decisions required

### Decision 1 — Final role defaults for `sistema`

**Question:** Should `sistema` default to BIM/3D `PRIMARY`, or should roles remain dependent on declared system semantics?  
**Why it matters:** `sistema` is semantic/functional, not merely geometric.  
**Option A:** BIM/3D primary by default.  
**Option B:** Role determined by declared system semantics and available data.  
**Recommended technical default:** Option B.  
**Consequence:** Avoids fabricating MEP, structural or construction semantics.

### Decision 2 — Grouped `provincia_metropoli`

**Question:** Should the grouped canonical scope expose one shared profile or two workflow presets?  
**Why it matters:** Province and metropolis can require different indicators and networks.  
**Option A:** One shared profile.  
**Option B:** One canonical scope with two non-taxonomic workflow presets.  
**Recommended technical default:** Option B.  
**Consequence:** Preserves the eleven-scope ontology while avoiding a forced identical professional workflow.

### Decision 3 — GIS export representation

**Question:** Which open GIS representation should be selected in a later authorized implementation?  
**Why it matters:** GeoJSON, GeoPackage and OGC APIs serve different exchange and persistence needs.  
**Option A:** GeoJSON for lightweight exchange.  
**Option B:** GeoPackage for richer offline datasets.  
**Option C:** Separate input/output adapters with OGC API Features for services.  
**Recommended technical default:** Defer selection until data and workflow requirements are approved.  
**Consequence:** No premature dependency or format lock.

### Decision 4 — Multiscale 3D scope

**Question:** Should future 3D support urban/territorial scenario visualization, or remain architectural-only?  
**Why it matters:** 3D can coexist with GIS without becoming BIM.  
**Option A:** Architectural-only.  
**Option B:** Add scale-aware urban/territorial scenario visualization.  
**Recommended technical default:** Option B as a future frozen scope, not current implementation.  
**Consequence:** Requires explicit data, performance and visualization contracts.

## 10. Decision Lock evaluation

The matrix supports closure of the architectural principles of `DL-MULTISCALE-EXPORT-01`, but the four Product Owner decisions above remain open. Therefore:

```text
DL-MULTISCALE-EXPORT-01 = OPEN_PENDING_PO_DECISION
```

The following are established:

1. No universal export representation exists across all scales.
2. Interoperability is compositional.
3. CAD, BIM, GIS, 3D and Media may coexist.
4. Capability state is independent from role.
5. Implementation maturity is independent from both.
6. GIS may appear before city scale.
7. GIS may be input, context and export.
8. BIM does not automatically disappear when GIS becomes relevant.
9. CAD does not automatically disappear when BIM/GIS becomes relevant.
10. 3D is multiscale.
11. Media is cross-scale but not editable spatial data.
12. Georeferencing importance varies by scale and workflow.
13. Presentation mode does not determine export geometry.
14. Geometric detail does not equal information level.
15. No semantic detail may be fabricated during export.

## 11. Validation record

```text
CANONICAL_SCOPE_COUNT = 11
NO_SCOPE_RENAMED = YES
MATRIX_ROWS = 11
CAPABILITY_STATE_ROLE_SEPARATED = YES
IMPLEMENTATION_MATURITY_SEPARATED = YES
GIS_SCALE_ADAPTIVE = YES
GIS_BIDIRECTIONAL_ARCHITECTURE = YES
LOCAL_GEOGRAPHIC_SPACE_SEPARATED = YES
MASSING_PROFILE_PRESERVED = YES
COUNTRY_TERRITORIAL = YES
PRODUCT_CODE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
GIS_IMPLEMENTED = NO
NEW_EXPORTER_IMPLEMENTED = NO
NEW_DEPENDENCY = NO
NEW_FFO_ACTIVATED = NO
```

This artifact is documentation only. It does not authorize implementation, push, deployment, GIS selection, or changes to the existing resolver/exporters.
