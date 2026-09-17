# SiMS-DeI — Multiscale Spatial Navigation P0

**Estado:** ARCHITECTURE / PRODUCT SEMANTICS  
**Implementation:** No  
**Policy:** `DL-MULTISCALE-VISUAL-01 = CLOSED / ACTIVE`  
**Canonical scopes:** 11

## 1. Purpose

Multiscale navigation must let a professional move between valid spatial contexts without confusing camera zoom, semantic scale, geometric detail, information density or spatial hierarchy. SiMS-DeI remains one product with one recognizable visual shell, but it does not treat the eleven `SpatialScope` values as eleven identical workspaces.

The conceptual navigation state is:

```text
FOCUS
+
CURRENT SPATIAL SCOPE
+
AVAILABLE CONTEXT
+
VALID SPATIAL RELATIONSHIPS
        ↓
Adaptive Workspace
```

Navigation changes the user’s view and context. It does not create a `Decision`.

## 2. Core distinctions

The following concepts are independent:

```text
CAMERA_ZOOM ≠ SPATIAL_SCOPE
SPATIAL_SCOPE ≠ LEVEL_OF_DETAIL
LEVEL_OF_DETAIL ≠ INFORMATION_LEVEL
SPATIAL_HIERARCHY ≠ CAMERA_DISTANCE
```

A user may zoom into a country map without changing scope. A building may be displayed with a simplified or detailed representation without changing `edificacion`. More information does not necessarily mean a finer spatial scale.

## 3. Focus and context

A future non-canonical UX concept, `SpatialFocus`, may preserve what the user is following while the surrounding context changes. For example:

```text
building → site → neighborhood → city
```

The focused element may become contextual rather than primary as the user moves outward. The focus must not invent geometry.

Context has three conceptual levels:

```text
FOCUS
IMMEDIATE CONTEXT
WIDER CONTEXT
```

Each context item must come from available spatial data and explicit relationships. A higher-scale source must not silently become canonical lower-scale design data.

## 4. Canonical scopes

The canonical list remains exactly:

```text
pais
macro_region
region
provincia_metropoli
distrito_ciudad
zona_barrio_sector
parcela_sitio
edificacion
sistema
espacio
objeto
```

Enum order is not evidence of containment. The sequence is a controlled vocabulary, not a parent-child graph.

## 5. Valid relationship requirement

A scope transition may be offered only when a valid spatial or semantic relationship exists. The system must not infer `parent`, `child`, `contains` or `belongs_to` from enum order, naming or proximity alone.

A future relationship record or existing canonical relationship may support navigation when it provides:

- source identity;
- target identity;
- relationship type;
- provenance;
- version or timestamp where relevant;
- authority or source context;
- sufficient evidence for the transition.

This document does not create a new Core entity or prescribe a new persistence model.

## 6. Bidirectional navigation

The intended interaction is bidirectional:

```text
OBJECT → COUNTRY
COUNTRY → OBJECT
```

The path may be discontinuous. A project might validly expose:

```text
pais → distrito_ciudad → parcela_sitio → edificacion
```

when intermediate representations are unavailable. The interface must show available broader and finer contexts rather than fabricate missing scopes.

## 7. Adaptive Workspace connection

Navigation must connect to the existing adaptive architecture:

```text
SpatialScope
        │
        ├── Variable Profile
        ├── Capability Profile
        ├── Visual Profile
        └── Interoperability Profile
                         ↓
                  Adaptive Workspace
```

The navigation layer must not create a competing capability resolver. It should consume the same applicability semantics:

```text
AVAILABLE
REQUIRES_DATA
NOT_AVAILABLE
NOT_APPLICABLE
```

A missing scale is not automatically `NOT_AVAILABLE`; it may be `REQUIRES_DATA`. A semantically inappropriate transition is `NOT_APPLICABLE`.

## 8. Four visual families

The common visual grammar can be expressed as:

```text
GEOMETRY
+
CONTEXT
+
ANALYSIS
+
SCENARIO
```

The four families are not a new canonical taxonomy. They are a conceptual composition:

| Family | Purpose | Constraint |
|---|---|---|
| Geometry | Show the represented spatial form or entities | Do not fabricate geometry |
| Context | Show related surrounding information | Preserve source and provenance |
| Analysis | Show derived results and overlays | Do not mutate canonical geometry |
| Scenario | Compare alternatives or time states | Do not become recommendation or decision |

The composition changes by scope. `edificacion` may emphasize geometry and analysis. `pais` may emphasize context, scenario and territorial analysis.

## 9. Difference View

A future `Spatial Difference View` may compare two alternatives or scenarios:

```text
Alternative / Scenario A
vs
Alternative / Scenario B
        ↓
Spatial Difference View
```

Possible deterministic states are:

```text
UNCHANGED
ADDED
REMOVED
MODIFIED
```

These states are valid only when the underlying representations can be compared deterministically. A difference visualization is not a semantic judgment about quality.

## 10. Cross-scale consequences

The future architecture may support two directional analytical relationships:

```text
HIGHER-SCALE CONTEXT
        ↓
LOWER-SCALE CONSTRAINTS / OPPORTUNITIES
```

and:

```text
LOWER-SCALE DESIGN
        ↓
HIGHER-SCALE CONSEQUENCES
```

Neither direction may be inferred merely from navigation. Propagation requires explicit analytical evidence, defined inputs, provenance and an appropriate model. This P0 does not implement propagation.

## 11. Breadcrumb and scale navigation

A future breadcrumb or scale navigator should expose:

- current `SpatialScope`;
- focused spatial element;
- available broader context;
- available finer context;
- unavailable or data-dependent transitions;
- provenance where context changes source.

It must not hard-code geographic containment. A visible breadcrumb represents supported relationships, not enum order.

## 12. System special case

`Sistema` must remain semantically open:

```text
SYSTEM_VISUAL_SEMANTICS = HYBRID / REQUIRES_CANONICAL_EVIDENCE
```

It must not be assumed to be spatially contained between `edificacion` and `espacio`. Navigation into or out of `sistema` requires canonical evidence of the relevant relationship.

## 13. Provenance and human authority

Changing scope may expose data from different sources. Provenance must remain attached to the source representation or analysis result. A higher-scale source must not silently become the canonical design representation of a lower-scale project.

The following invariants remain active:

```text
SCOPE_NAVIGATION = NO DECISION
CONTEXT_PROPAGATION = NO DECISION
SCENARIO_COMPARISON = NO DECISION
ANALYSIS_OVERLAY_MUTATES_SPATIAL_REPRESENTATION = NO
```

The visual flow remains:

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

## 14. Proposed Decision Lock

### DL-MULTISCALE-NAVIGATION-01 — DRAFT / OPEN_PENDING_PO_DECISION

1. Camera zoom does not change `SpatialScope`.
2. `SpatialScope` does not determine geometric detail by itself.
3. Enum ordering does not establish spatial containment.
4. Cross-scale navigation requires explicit supported relationships.
5. Focus may persist while context changes.
6. Missing intermediate scales are not fabricated.
7. Scale-specific data preserves provenance.
8. Analysis overlays do not mutate canonical geometry.
9. Cross-scale consequences require explicit analytical evidence.
10. Navigation does not create a `Decision`.

## 15. Governance

```text
CODE_CHANGED = NO
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_ENTITY_CREATED = NO
GIS_IMPLEMENTED = NO
TERRAIN_IMPLEMENTED = NO
CROSS_SCALE_PROPAGATION = NO
FFO_ACTIVATED = NO
PUSH_EXECUTED = NO
DEPLOYMENT_EXECUTED = NO
```

## References

[1]: docs/TERRITORIAL_VISUAL_INTELLIGENCE_ARCHITECTURE_P0.md "SiMS-DeI Territorial Visual Intelligence Architecture P0"
[2]: docs/ADAPTIVE_MULTISCALE_VISUAL_EXPERIENCE_FOUNDATION_V1.md "SiMS-DeI Adaptive Multiscale Visual Experience Foundation V1"
[3]: docs/SIMS_DEI_AND_SICL_FOUNDATIONS.md "SiMS-DeI and SICL Foundations"
