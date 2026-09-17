# SiMS-DeI — Territorial Visual Intelligence Architecture P0

**Estado:** ARCHITECTURE PROPOSAL / DOCUMENTATION ONLY  
**Decision Lock:** `DL-MULTISCALE-VISUAL-01 = CLOSED / ACTIVE`  
**Implementation:** No  
**Canonical scopes:** 11  
**Purpose:** Evolve `VISUAL_FIRST` from architectural design toward site, urban and territorial intelligence without creating eleven separate applications.

## 1. Executive conclusion

SiMS-DeI should use a small family of adaptive visual experiences rather than eleven independent workspaces. The proposed family has three archetypes:

1. **Architectural** for object, space, building and selected system cases.
2. **Site / urban hybrid** for parcel, site and neighborhood or sector relationships.
3. **Territorial** for district, metropolitan, regional, macro-regional and country systems.

These archetypes share one product shell, one alternative and comparison model where applicable, one evidence and review flow, and one human authority model. They differ in the primary spatial representation, layer semantics, interaction density and analysis emphasis.

```text
ONE PRODUCT
        ↓
COMMON VISUAL SHELL
        ↓
SCALE-CAPABILITY PROFILE
        ↓
ADAPTIVE VISUAL ARCHETYPE
```

This proposal does not implement GIS, terrain, layers, territorial workspaces, new renderers, new exporters or new Core entities.

## 2. Archetype model

### 2.1 Architectural archetype

The Architectural archetype is the current reference experience represented by the `edificacion` Spatial Pilot. It emphasizes canonical geometry, architectural massing, 2D/3D views, A/B/C alternatives, rendering modes, metrics, solar context, raw Pareto, saved views, image/video capture and massing export.

It is potentially relevant to:

- `objeto`;
- `espacio`;
- `edificacion`;
- selected `sistema` cases where geometry and relations are canonical.

It must not fabricate manufacturing details, furniture, construction elements or BIM authoring semantics.

### 2.2 Site / urban hybrid archetype

The Site / urban hybrid archetype combines architectural representation with site and contextual relationships. Its primary concerns may include:

- site geometry;
- building masses;
- open space;
- circulation;
- orientation;
- location;
- environment;
- parcels or blocks where data exists;
- networks and context;
- 2D, 3D and map roles without conflating their semantics.

It is potentially relevant to:

- `parcela_sitio`;
- `zona_barrio_sector`.

It must not reduce a site to a larger building. It also must not claim cadastral or GIS capability when georeferenced data and the corresponding implementation are absent.

### 2.3 Territorial archetype

The Territorial archetype focuses on systems, networks, layers, scenarios, time and indicators. Its primary representation may be a geographic map or territorial view. Three-dimensional terrain or scenario views may support the primary view, but architectural photorealism is not the defining metaphor.

It is potentially relevant to:

- `distrito_ciudad`;
- `provincia_metropoli`;
- `region`;
- `macro_region`;
- `pais`.

The territorial archetype must not represent a country as a giant architectural model.

### 2.4 Special case: `sistema`

`Sistema` remains capability-driven until canonical evidence determines whether the active representation is primarily geometric, relational, network-based, functional or hybrid.

```text
SYSTEM_VISUAL_SEMANTICS = HYBRID / REQUIRES_CANONICAL_EVIDENCE
ARCHETYPE_ASSIGNMENT = NOT_FORCED
```

## 3. Architectural experience profile

The professional should first understand **the spatial organization and design alternatives being evaluated**. The primary view is the canonical spatial representation. Raw variables and evidence remain available on demand.

| Concern | Architectural profile |
|---|---|
| Primary view | 2D plan and/or 3D geometry according to representation |
| Main interaction | Select alternative, orbit or inspect geometry, compare, present |
| Visual difference | Form, mass count, voids, proportions, height and spatial relationships |
| Secondary data | Metrics, provenance, analysis results, Pareto and evidence |
| Typical overlays | Solar, environmental and evaluation overlays where available |
| Time | Instant, day or period where capability exists |
| Media | PNG and WebM presentation output |
| Export | Massing-oriented IFC, DXF and GLB where capability is available |
| Authority boundary | Selection is inspection; Recommendation, HumanReview and Decision remain separate |

The UPAO-001 experience is the current reference implementation for this profile. Its architectural rendering modes are not universal across scopes.

## 4. Site / urban hybrid experience profile

The professional should first understand **how the design or spatial entity relates to its site and surrounding spatial context**.

| Concern | Site / urban hybrid profile |
|---|---|
| Primary view | Site and contextual spatial representation |
| Main interaction | Inspect geometry and relationships; switch context or scenario where supported |
| Visual difference | Footprint, massing, open space, circulation, parcel/block relationship and orientation |
| Secondary data | Location, metrics, environmental context, evidence and provenance |
| Possible overlays | Solar, environment, mobility, regulation or risk only when data and capability exist |
| 2D role | Site plan, parcel/block context or map context according to semantics |
| 3D role | Massing, terrain or contextual volume only when represented |
| GIS role | Contextual or primary according to georeferencing and available data |
| Media | Image/video of the hybrid scene, not editable spatial data |
| Authority boundary | Visual comparison does not create a recommendation or decision |

A site plan is not automatically a geographic map. Geographic context requires spatial reference, provenance and appropriate data. A neutral presentation ground is not a digital terrain model.

## 5. Territorial experience profile

The professional should first understand **the structure, relationships and scenario consequences of a territorial system**.

| Concern | Territorial profile |
|---|---|
| Primary view | Geographic or territorial system representation |
| Main interaction | Pan, zoom, select layers, compare scenarios and inspect spatial relationships |
| Visual difference | Added or removed areas, changed networks, indicators, environmental effects or scenario states |
| Secondary data | Metrics, evidence, provenance, variables and institutional sources |
| Layer emphasis | Built form, mobility, infrastructure, environment, risk, regulation and activity where supported |
| 2D role | Primary for many territorial representations |
| 3D role | Supporting for terrain, density or scenario explanation where meaningful |
| Map role | Primary when geographic reference and data exist |
| Architectural rendering | Usually not applicable as the primary representation |
| Time | Planning horizon, operational time or scenario horizon where supported |
| Media | Territorial scenario communication, not editable spatial data |
| Authority boundary | A highlighted scenario is not a recommendation or decision |

The territorial profile must not become a spreadsheet-first dashboard. Metrics support the spatial understanding rather than replacing it.

## 6. Transition rules between archetypes

Archetype selection should be derived from the active capability profile, not from a frontend route name.

```text
SpatialScope
+ Representation Semantics
+ Available Data
+ Context
+ Objectives
+ Stage
+ Jurisdiction
+ Actors
        ↓
ScaleCapabilityProfile
        ↓
Visual Archetype and Tool Roles
```

Transition rules:

1. `objeto`, `espacio` and `edificacion` default toward the Architectural archetype when canonical geometry exists.
2. `parcela_sitio` defaults toward Site / urban hybrid when site and contextual data exist.
3. `zona_barrio_sector` may use the Site / urban hybrid archetype with stronger relational and network emphasis.
4. `distrito_ciudad` and larger scopes default toward Territorial when geographic or territorial data exists.
5. `sistema` remains capability-driven and may use any archetype only when canonical semantics support it.
6. Missing required data yields `REQUIRES_DATA`; it does not silently fall back to an invented representation.
7. A semantically inappropriate capability is `NOT_APPLICABLE`, not merely unavailable.
8. The same product shell remains recognizable across transitions.

## 7. Terrain role

Terrain concepts must remain distinct:

| Concept | Meaning | Current status |
|---|---|---|
| `NEUTRAL_PRESENTATION_GROUND` | Visual floor used to explain massing and scale | Existing presentation concept |
| `SITE_TERRAIN` | Site-specific ground representation | Future; requires data |
| `DIGITAL_TERRAIN_MODEL` | Elevation-based terrain surface | Future; requires elevation data |
| `DIGITAL_SURFACE_MODEL` | Surface including represented objects or built context | Future; requires source data |

A neutral ground must not be described as real terrain. No terrain implementation is included in this order.

## 8. Map and GIS visual role

The following distinctions are normative:

```text
MAP ≠ ARCHITECTURAL_2D
GIS_INPUT ≠ GIS_CONTEXT ≠ GIS_EXPORT
```

An architectural plan may use local coordinates. A geographic map requires a geographic or spatial reference. GIS may be contextual at an architectural scale and primary at a territorial scale. It is not restricted to large scopes, and it is not mandatory at object scale.

This proposal does not select a GIS provider, format, cadastral source or export profile. GIS remains unimplemented under this order.

## 9. Layer model

The conceptual layer model is:

```text
SpatialRepresentation
        +
Visual Layers
        +
Analysis Overlays
        +
Scenario
        +
Time State
        ↓
Primary Spatial View
```

Candidate visual layer families are:

- base spatial;
- terrain;
- parcel or land structure;
- built form;
- mobility;
- infrastructure;
- environment;
- risk;
- regulation;
- demographic or activity;
- evaluation;
- scenario difference.

These are candidate families, not implementation claims. A layer is eligible only when its semantics, data, provenance and capability are available.

Analysis overlays must not mutate canonical geometry.

## 10. Scenario comparison model

`Alternative` remains cross-scale. Its meaning changes with the active problem but not its constitutional separation from Recommendation and Decision.

```text
BUILDING
A / B / C design alternatives

URBAN
A / B / C spatial alternatives or scenarios

TERRITORIAL
A / B / C territorial scenarios
```

A future `SCENARIO_DIFFERENCE_VIEW` may show:

```text
Scenario A vs Scenario B
        ↓
added areas
removed areas
changed networks
changed indicators
changed environmental effects
```

This is a visualization of differences. It is not an automatic judgment of which scenario is best.

## 11. Temporal visualization model

Temporal visualization may differ by archetype:

- architectural instant, day or period;
- urban operational time;
- planning horizon;
- territorial scenario horizon.

Existing temporal architecture remains authoritative. This proposal does not add temporal functionality or alter `TemporalScope`.

## 12. Visual Pareto connection

The intended cross-scale interaction is:

```text
SELECT TRADE-OFF
        ↓
HIGHLIGHT ALTERNATIVE / SCENARIO
        ↓
SHOW SPATIAL CONSEQUENCES
        ↓
SHOW SUPPORTING METRICS
```

The selected point or scenario must remain linked to its canonical alternative or representation identity. Raw Pareto does not become a recommendation.

```text
PARETO ≠ RECOMMENDATION ≠ DECISION
```

At building scale, this is already demonstrated by UPAO-001 massing and spatial objectives. At urban and territorial scales, it remains a future capability requiring canonical data and evaluation definitions.

## 13. Data on demand

All archetypes preserve:

```text
PRIMARY SPATIAL VIEW = DOMINANT
RAW DATA = SECONDARY
```

The secondary layer may include metrics, provenance, variables, evidence, sources, assumptions, analysis results and scenario metadata. It must not obscure the primary spatial understanding.

## 14. Human authority preservation

Every archetype preserves the same flow:

```text
EXPLORE
COMPARE
ANALYZE
PRESENT
        ↓
HUMAN REVIEW
        ↓
DECISION
```

No visual system may silently choose, approve, recommend or decide. A highlighted map feature, selected alternative, Pareto point or saved presentation view is not a Decision.

## 15. Professional mental model

| Archetype | What the professional should see first | What should be interactive | What remains secondary | What differentiates alternatives |
|---|---|---|---|---|
| Architectural | Spatial organization and form | Geometry, camera, alternatives and presentation | Metrics, evidence and provenance | Massing, voids, dimensions and performance context |
| Site / urban hybrid | Relation between design, site and context | Site, masses, circulation, context and scenario | Raw cadastral, environmental and source data | Site occupation, open space, networks and orientation |
| Territorial | Territorial structure and relationships | Map extent, layers, networks, time and scenarios | Indicators, source records and assumptions | Changed areas, networks, indicators and scenario effects |

## 16. Relation to active Decision Lock

This architecture implements the meaning of `DL-MULTISCALE-VISUAL-01` at the policy level:

```text
VISUAL_FIRST = YES
COMMON_PRODUCT_SHELL = YES
SCALE_ADAPTIVE_VISUAL_TOOLSET = YES
IDENTICAL_TOOLSET_ALL_SCALES = NO
ARCHITECTURAL_RENDERING_UNIVERSAL = NO
MAP_GIS_VISUALIZATION_UNIVERSAL = NO
2D_3D_MAP_ARE_INDEPENDENT_REPRESENTATION_ROLES = YES
ANALYSIS_OVERLAY_MUTATES_SPATIAL_REPRESENTATION = NO
MEDIA_IS_EDITABLE_SPATIAL_DATA = NO
PRESENTATION_STATE_CREATES_DECISION = NO
COUNTRY_IS_GIANT_ARCHITECTURAL_MODEL = NO
```

## 17. Governance and non-actions

```text
PRODUCT_CODE_CHANGED = NO
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
GIS_IMPLEMENTED = NO
TERRAIN_IMPLEMENTED = NO
NEW_RENDERER = NO
NEW_EXPORTER = NO
FFO_ACTIVATED = NO
PUSH_EXECUTED = NO
DEPLOYMENT_EXECUTED = NO
```

This document does not authorize eleven workspaces. It defines a coherent family of visual experiences that can later be implemented incrementally through the existing capability architecture.

## 18. Final proposal

The three-archetype model is the preferred architecture for the next visual planning stage:

```text
ARCHITECTURAL
        ↓
SITE / URBAN HYBRID
        ↓
TERRITORIAL
```

The transition is not a fixed ladder of geometric complexity. It is a change in visual meaning. The same product remains recognizable because the shell, alternative semantics, evidence flow, review boundary and human authority are preserved.

The next implementation, if separately authorized, should begin with evidence and capability profiles for `parcela_sitio` and `distrito_ciudad`, not with eleven independent pages or a universal GIS dashboard.

## References

[1]: docs/ADAPTIVE_MULTISCALE_VISUAL_EXPERIENCE_FOUNDATION_V1.md "SiMS-DeI Adaptive Multiscale Visual Experience Foundation V1"
[2]: docs/MULTISCALE_INTEROPERABILITY_MATRIX_V1.md "SiMS-DeI Complete Canonical Multiscale Interoperability Matrix V1"
[3]: docs/GLB_RENDER_TRANSPORT_PROOF_P0_1.md "SiMS-DeI Geometry-Preserving GLB Render Transport P0.1"
[4]: docs/SIMS_DEI_FRONTEND_ARCHITECTURE.md "SiMS-DeI Frontend Architecture"
[5]: docs/SIMS_DEI_AND_SICL_FOUNDATIONS.md "SiMS-DeI and SICL Foundations"
