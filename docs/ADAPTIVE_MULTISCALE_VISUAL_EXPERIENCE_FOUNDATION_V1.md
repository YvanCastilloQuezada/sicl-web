# SiMS-DeI — Adaptive Multiscale Visual Experience Foundation V1

**Estado:** DOCUMENTATION / ARCHITECTURE ONLY  
**Gate:** B, posterior a Architect Rendering Quality V2  
**Alcance:** Las 11 escalas canónicas de `SpatialScope`  
**Implementación autorizada por este documento:** No

## 1. Decisión arquitectónica

SiMS-DeI mantiene una experiencia **visual-first** en todas las escalas, pero no utiliza un único workspace idéntico para todos los problemas. El producto conserva una identidad común, un flujo reconocible y un modelo de autoridad humana constante. Las herramientas visuales cambian según la escala, la semántica de la representación, los datos disponibles, el contexto, la etapa, los objetivos, la jurisdicción y los actores.

> **One product does not mean one identical workspace.**

La escala `edificacion` constituye el perfil visual de referencia actual porque ya dispone de representación espacial determinista, comparación A/B/C, vistas 2D y 3D, modos de presentación, contexto solar, métricas, Pareto, Media Studio y exportación de massing. Esta implementación no se extrapola automáticamente a las otras diez escalas.

## 2. Shell visual común

El shell conceptual común es:

```text
PROJECT / CONTEXT
        ↓
ALTERNATIVES / SCENARIOS
        ↓
PRIMARY SPATIAL VIEW
        ├── EXPLORE
        ├── COMPARE
        ├── ANALYZE
        ├── PRESENT
        └── EXPORT
        ↓
EVIDENCE / METRICS / CONTEXT
        ↓
HUMAN REVIEW
        ↓
DECISION
```

El shell no implica que toda escala deba renderizar masas arquitectónicas. En `pais`, la vista primaria puede ser un mapa territorial o una comparación de escenarios. En `edificacion`, puede ser un viewport 3D de massing. En `objeto`, puede ser una vista de geometría y dimensiones.

## 3. Ecuación de adaptación

```text
SpatialScope
+ Typology
+ Context
+ Stage
+ Available Data
+ Objectives
+ Jurisdiction
+ Actors
        ↓
ScaleCapabilityProfile
        ↓
Adaptive Visual Workspace
```

Este documento no crea un segundo resolver. La ecuación debe integrarse conceptualmente con los perfiles de capacidad e interoperabilidad existentes cuando se autorice una implementación posterior.

## 4. Semántica visual de `sistema`

La evidencia canónica disponible describe `sistema` como una escala de sistema técnico o funcional integrado en la jerarquía del proyecto. Esta definición no determina por sí sola un renderer único. La visualización deberá evaluarse como una combinación de geometría, relaciones, redes y función, según la representación disponible.

```text
SYSTEM_VISUAL_SEMANTICS = HYBRID / REQUIRES_CANONICAL_EVIDENCE
```

No se autoriza inventar una definición exclusivamente geométrica ni reducir `sistema` a un edificio menor.

## 5. Matriz visual de las 11 escalas

Los estados y roles de esta matriz describen el estado de arquitectura y evidencia actual. `Future` no significa implementación.

| SpatialScope | Primary Visual Representation | Secondary Visual Representations | 2D Role | 3D Role | Map Role | Architectural Rendering Role | GIS Layer Role | Analysis Overlay Role | Comparison Role | Temporal Visualization Role | Media Role | Saved View Role | Primary Interaction | Primary User Understanding Goal | Current Capability | Requires Data | Future Capability | Notes / Evidence |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `pais` | Territorial system and scenario view | Indicators, networks, thematic layers | PRIMARY | SUPPORTING | PRIMARY | NOT_APPLICABLE | PRIMARY | CONTEXTUAL | Scenario comparison | SUPPORTING | Supporting | View extent and scenario | Understand national spatial systems | REQUIRES_DATA | Territorial indicators, boundaries, time series | Territorial scenario workspace | No country renderer is implemented |
| `macro_region` | Multiregional territorial view | Networks, resources, environment | PRIMARY | SUPPORTING | PRIMARY | NOT_APPLICABLE | PRIMARY | CONTEXTUAL | Scenario comparison | SUPPORTING | Supporting | Pan, layer selection, scenario | Understand relations among macro-regional systems | REQUIRES_DATA | Regional boundaries and domain data | Network and scenario visualization | Documentation only |
| `region` | Regional territorial view | Settlement, infrastructure, environment | PRIMARY | SUPPORTING | PRIMARY | NOT_APPLICABLE | PRIMARY | CONTEXTUAL | Scenario comparison | SUPPORTING | Supporting | Thematic exploration | Understand regional structure and change | REQUIRES_DATA | Regional geometry and indicators | Regional layers and time series | Documentation only |
| `provincia_metropoli` | Provincial/metropolitan system view | Settlements, land systems, networks | PRIMARY | SUPPORTING | PRIMARY | NOT_APPLICABLE | PRIMARY | CONTEXTUAL | Scenario comparison | SUPPORTING | Supporting | Extent, network and scenario exploration | Understand metropolitan or provincial structure | REQUIRES_DATA | Jurisdiction-specific geometry and data | Combined-scope metropolitan profile | Canonical scope remains combined |
| `distrito_ciudad` | Urban morphology and network view | Land use, density, mobility | PRIMARY | SUPPORTING | PRIMARY | NOT_APPLICABLE | PRIMARY | SUPPORTING | Scenario comparison | SUPPORTING | Supporting | Map, network and scenario exploration | Understand urban organization and flows | REQUIRES_DATA | Urban base layers and networks | Urban visual workspace | No GIS implementation authorized |
| `zona_barrio_sector` | Neighborhood and sector morphology | Parcels, public space, mobility | CO_PRIMARY | SUPPORTING | PRIMARY | NOT_APPLICABLE | PRIMARY | SUPPORTING | Alternative/scenario comparison | SUPPORTING | Supporting | Explore relationships among entities | Understand urban relationships and public/open space | REQUIRES_DATA | Parcels, blocks and networks where available | Neighborhood profile | Evidence must precede current classification |
| `parcela_sitio` | Site geometry plus contextual location | Massing, open space, orientation, environment | CO_PRIMARY | CO_PRIMARY | CONTEXTUAL | SUPPORTING | CONTEXTUAL | SUPPORTING | Alternative comparison | SUPPORTING | PRIMARY | Inspect site, context and massing | Understand the design in its site context | REQUIRES_DATA | Confirmed location, site geometry and context | Hybrid architecture/GIS workspace | GIS remains future in this gate |
| `edificacion` | Architectural massing and spatial alternatives | 2D plan, 3D view, solar and metrics | CO_PRIMARY | PRIMARY | CONTEXTUAL | PRIMARY | CONTEXTUAL | SUPPORTING | A/B/C alternatives and raw Pareto | SUPPORTING | PRIMARY | Select, orbit, compare and present | Understand form, strategy and trade-offs | AVAILABLE | Canonical spatial representation and metrics | Improved rendering profile | Current UPAO-001 reference implementation |
| `sistema` | Technical/functional system representation | Relations, networks, geometry where supported | CO_PRIMARY | SUPPORTING | NOT_APPLICABLE | SUPPORTING | CONTEXTUAL | SUPPORTING | System alternatives where supported | SUPPORTING | Supporting | Inspect relations and functional structure | Understand system organization and dependencies | REQUIRES_DATA | Canonical system semantics and relations | Hybrid system workspace | Semantics require further evidence |
| `espacio` | Enclosure, volume and spatial relationships | Zones, circulation, environmental context | PRIMARY | CO_PRIMARY | NOT_APPLICABLE | SUPPORTING | CONTEXTUAL | SUPPORTING | Spatial alternatives | SUPPORTING | PRIMARY | Inspect adjacency, volume and use | Understand spatial organization | REQUIRES_DATA | Spatial boundaries, zones and circulation | Plan/section/3D profile | Do not invent walls or furniture |
| `objeto` | Object geometry and attributes | Dimensions, orientation, surfaces | CO_PRIMARY | PRIMARY | NOT_APPLICABLE | SUPPORTING | NOT_APPLICABLE | SUPPORTING | Object alternatives where supported | Supporting | Supporting | Inspect dimensions and orientation | Understand the represented object | REQUIRES_DATA | Object geometry and semantic attributes | Object presentation profile | Do not invent manufacturing semantics |

## 6. Capability semantics

Capability state and visual role are independent dimensions.

```text
STATE ≠ ROLE
```

States:

- `AVAILABLE`: the behavior exists with the required data.
- `REQUIRES_DATA`: the behavior is meaningful, but required data is absent.
- `NOT_AVAILABLE`: the behavior is not implemented.
- `NOT_APPLICABLE`: the behavior is semantically inappropriate for the active scale or representation.

Roles:

- `PRIMARY`
- `CO_PRIMARY`
- `SUPPORTING`
- `CONTEXTUAL`
- `NOT_APPLICABLE`

## 7. Scale-adaptive visual language

```text
OBJECT / SPACE
→ geometry + relationships

BUILDING
→ architectural form + performance context

SITE
→ architecture + context

NEIGHBORHOOD / URBAN
→ morphology + networks + layers

METROPOLITAN / TERRITORIAL
→ systems + networks + scenarios

COUNTRY
→ national territorial systems + scenarios
```

This progression is conceptual. It does not rename `SpatialScope` values and does not authorize new UI, GIS, layers, renderers, or exports.

## 8. Analysis overlays

The intended architecture is:

```text
SpatialRepresentation
+
Analysis Result
        ↓
Visual Overlay
```

An overlay must never mutate canonical geometry. Solar context, evaluation, Pareto, future mobility, risk and regulatory layers are independent presentation or analysis results. Only the solar and Pareto-related building capabilities have current evidence in this workspace.

## 9. Human authority

The visual workspace may help users see, understand, compare, evaluate and explain. It must not silently select, approve, recommend or decide.

```text
Analysis ≠ Recommendation
Recommendation ≠ HumanReview
HumanReview ≠ Decision
```

Selection of A/B/C remains inspection state. Presentation mode remains presentation state. Media remains presentation output and not editable spatial data.

## 10. Interoperability relationship

The visual foundation must remain compatible with the existing interoperability matrix:

```text
SpatialScope
        ↓
ScaleCapabilityProfile
        ├── Visual Capability Profile
        ├── Analysis Capability Profile
        └── Interoperability Profile
```

These profiles must not become isolated taxonomies. The current `edificacion` profile exposes IFC, DXF and GLB according to massing semantics. No GIS implementation is added by this document.

## 11. Proposed Decision Lock

### DL-MULTISCALE-VISUAL-01 — PROPOSED / OPEN_PENDING_PO_DECISION

1. `VISUAL_FIRST` is invariant across all `SpatialScope` values.
2. Visual capabilities adapt to scale, semantics, available data and workflow.
3. A common product shell does not imply an identical toolset.
4. Architectural rendering modes are not forced onto territorial scales.
5. GIS and map visualization are not forced onto object-scale design.
6. 2D, 3D and maps are independent representation roles.
7. Analysis overlays do not mutate canonical geometry.
8. Presentation state does not create a `Decision`.
9. Media is presentation, not editable spatial data.
10. Scale changes visual semantics, not merely geometric complexity.

This Decision Lock remains open because the matrix is architectural documentation and the semantics of several scales require future evidence.

## 12. Gate B result

```text
STATUS = DOCUMENTATION_COMPLETE
CANONICAL_SPATIAL_SCOPE_COUNT = 11
SYSTEM_VISUAL_SEMANTICS = HYBRID / REQUIRES_CANONICAL_EVIDENCE
COMMON_PRODUCT_SHELL = YES
SCALE_ADAPTIVE_TOOLSET = YES / ARCHITECTURE ONLY
VISUAL_FIRST_ALL_SCALES = YES
ARCHITECTURAL_RENDERING_UNIVERSAL = NO
MAP_GIS_VISUALIZATION_UNIVERSAL = NO
DL_MULTISCALE_VISUAL_01 = OPEN_PENDING_PO_DECISION
NEW_UI = NO
GIS_IMPLEMENTED = NO
NEW_RENDERER = NO
NEW_EXPORTER = NO
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
```

## References

[1]: docs/MULTISCALE_INTEROPERABILITY_MATRIX_V1.md "SiMS-DeI Complete Canonical Multiscale Interoperability Matrix V1"
[2]: docs/VISUALIZATION_ENGINE.md "SiMS-DeI Visualization Engine"
[3]: docs/SIMS_DEI_FRONTEND_ARCHITECTURE.md "SiMS-DeI Frontend Architecture"
[4]: docs/SIMS_DEI_AND_SICL_FOUNDATIONS.md "SiMS-DeI and SICL Foundations"
