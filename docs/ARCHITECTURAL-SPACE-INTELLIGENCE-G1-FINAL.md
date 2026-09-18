# SiMS-DeI — ASI-G1
# Canonical Architectural Space Geometry Foundation

## Final status

```text
ASI_G1 = PASS_WITH_OBSERVATIONS
P2_REAL_GATE = RESOLVED
CANONICAL_SPACE_REPRESENTATION = PASS
EXISTING_REUSE_SUFFICIENT = YES
SPATIAL_ZONE_REUSE = PASS
SPATIAL_ELEMENT_REUSE = PASS
BOUNDED_GEOMETRY = PASS
BOUNDARY_SEMANTICS = PASS
SPACE_IDENTITY_CONTINUITY = PASS
PROGRAM_LINEAGE = PASS
ACTUAL_AREA = PASS
TARGET_ACTUAL_SEPARATION = PASS
GEOMETRY_PROVENANCE = PASS
COORDINATE_REUSE = PASS
A15_FRESH_READING = PASS
A16_COMPATIBILITY = PASS
A17_COMPATIBILITY = UNSUPPORTED
RENDERER_REUSE = PASS
SEMANTIC_ONLY_PROTECTION = PASS
FALSE_ROOM_PROTECTION = PASS
AUTO_GEOMETRY_FROM_AREA = NO
PARAMETER_FABRICATION = NONE
NEW_GENERATIVE_OPERATION = NO
BIM_SCOPE = NO
SECOND_SPATIAL_MODEL = NO
SECOND_GEOMETRY_MODEL = NO
SECOND_COORDINATE_SYSTEM = NO
HUMAN_AUTHORITY = PRESERVED
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = 0
REAL_GATE_ESCALATION = NO
MAJOR_LOCAL_MILESTONE = YES
GITHUB_CHECKPOINT_CANDIDATE = YES
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

ASI-G1 resolves the P2 gate through the minimum safe path: reuse the existing `SpatialElement`/`SpatialZone` representation and existing renderer/coordinate semantics. No new Core entity, parallel geometry system, operation, BIM model or floor-plan system was introduced.

## Authoritative baseline

```text
WEB_BASELINE = 7a2cc037fb8220bc2ab653d55d951024e4e74b55
CORE_BASELINE = 1c416551a945286e3b7fab6a5f01e8852442ea7b
CORE_CHANGED = NO
```

The pre-existing A18 diagnostic and the earlier P2 report remain untracked deliberately. No cleanup work was performed.

## Reuse decision

`SpatialZone` and `SpatialElement` already provide the required technical carrier:

- stable element identity;
- polygon geometry;
- parent/container reference;
- level reference;
- metadata extension;
- `LOCAL_ENU` coordinate context;
- metre units already used by the spatial representation;
- serialization through `SpatialRepresentation`;
- compatibility with the current SVG renderer;
- existing deterministic polygon-area logic in the Web derivation layer.

The missing distinction was semantic, not a second geometry architecture. ASI-G1 therefore requires explicit metadata before a zone may be treated as architectural-space geometry:

```text
space_role = architectural_space
space_id = stable P1 space identity
program_item_id = stable P1 program identity
geometry_provenance = explicit provenance value
```

Historical `SpatialZone` instances without this explicit role are not automatically reinterpreted as rooms or architectural spaces.

## Canonical representation contract

The canonical bridge is:

```text
PROGRAM ITEM
→ P1 SPACE ID
→ SpatialElement / SpatialZone ID
→ explicit bounded polygon
→ deterministic actual area
→ A15 observed geometry
```

The representation is intentionally 2D and renderer-neutral. It is architectural-space geometry, not construction geometry:

```text
ARCHITECTURAL SPACE GEOMETRY ≠ WALL
SPACE BOUNDARY ≠ DOOR
SPACE AREA ≠ SLAB AREA
ARCHITECTURAL SPACE ≠ BIM / IFC SPACE REQUIREMENT
```

### Required fields

| Field | Source / meaning |
|---|---|
| `space_id` | Stable P1 architectural-space identity |
| `program_item_id` | Stable P1 program lineage |
| `spatialElementId` | Existing canonical `SpatialElement.id` |
| `spatialZoneId` | Same existing reference when the element is a `SpatialZone` |
| `geometry` | Existing polygon geometry field |
| `geometry.type` | `polygon` for the first ASI-G1 bounded representation |
| `boundaryStatus` | `EXPLICIT_BOUNDARY`, `DERIVED_BOUNDARY`, or `UNKNOWN` |
| `geometry_provenance` | Explicit test, human, existing or authorized source provenance |
| `coordinate_system` | Reused from `SpatialRepresentation` |
| `units` | Reused from `SpatialRepresentation`; not fabricated |
| `level` | Reused when explicitly available |
| `parent_id` | Reused when explicitly observable |
| `actualArea` | Computed only from valid bounded geometry |
| epistemic state | `OBSERVED` for valid actual geometry; `UNKNOWN` otherwise |
| realization state | `GEOMETRICALLY_REALIZED` or `UNKNOWN` |

### Validation rules

A valid ASI-G1 polygon must have:

- explicit architectural-space metadata;
- polygon geometry;
- at least a closed ring;
- finite coordinates;
- deterministic coordinate order;
- non-zero computed area;
- valid serialization;
- the existing representation coordinate and unit context.

Invalid geometry produces `UNKNOWN` realization and no actual-area claim. It is not silently repaired.

## A15 integration contract

A15 now reads the actual `SpatialRepresentation`, not P1 expectations:

```text
ACTUAL SpatialRepresentation
→ readArchitecturalSpaceGeometry()
→ observedSpaceGeometry
→ A15 visual/read-only panel
```

For each explicit architectural-space element, A15 can observe:

- `spaceId`;
- `programItemId`;
- `spatialElementId` / `spatialZoneId`;
- geometry type;
- bounded-geometry presence;
- boundary state;
- computed actual area;
- coordinate system and units;
- level reference where explicit;
- parent/container where observable;
- geometry provenance;
- epistemic status;
- realization status.

A15 does not copy `targetArea` into `actualArea`, infer geometry from a space type, or treat a mass perimeter as a room boundary.

## Controlled runtime proof

```text
FIXTURE = TEST_FIXTURE-HOUSING-P1
PROGRAM_ITEM_ID = BEDROOM
SPACE_ID = BEDROOM-01
SPATIAL_REFERENCE_ID = SZ-ARCH-001
GEOMETRY_TYPE = polygon
BOUNDARY_STATUS = EXPLICIT_BOUNDARY
GEOMETRY_PROVENANCE = TEST_FIXTURE
COORDINATE_SYSTEM = LOCAL_ENU
UNITS = m
TARGET_AREA = 10
ACTUAL_AREA = 6
AREA_SOURCE = GEOMETRY_COMPUTATION
A15_OBSERVATION = GEOMETRICALLY_REALIZED / ACTUAL_AREA 6
```

The same fixture retained another P1 space without geometry:

```text
SEMANTIC_ONLY_SPACE = BATH-01
GEOMETRY = NONE
ACTUAL_AREA = UNKNOWN
AUTO_GEOMETRY_FROM_AREA = FALSE
```

The test also verified that an existing historical zone with only `program` metadata is not reinterpreted as architectural-space geometry.

## A16 and A17 compatibility

A16 can consume the resulting observations and distinguish:

- required space with geometry;
- required space without geometry;
- actual area known;
- actual area unknown;
- target/actual difference;
- boundary unknown;
- relationship unverified.

ASI-G1 does not create quality, compliance, optimality or recommendation claims.

A17 remains compatible structurally but does not gain a new space-editing operation:

```text
SPACE REPRESENTATION = SUPPORTED
SPACE GENERATION = NOT YET SUPPORTED
SPACE MODIFICATION = NOT YET SUPPORTED
```

Future mutation must preserve the existing:

```text
PREPARE
→ HUMAN AUTHORIZE
→ EXECUTE
→ READBACK
→ VERIFY
```

## Renderer and i18n

The existing `UPAO001SpatialViewer` renderer remains the only renderer. Explicit polygon geometry can be displayed through the existing spatial element path. Semantic-only spaces are not drawn as fake polygons.

The A15 panel exposes observed bounded-space geometry using the existing ARQUI surface and the eight existing locales. No locale-specific logic or second UI state was introduced.

## Validation

```text
FOCUSED_TEST_FILES = 3 passed
FOCUSED_TESTS = 22 passed
FULL_WEB_TEST_FILES = 46 passed
FULL_WEB_TESTS = 244 passed
TYPESCRIPT = PASS
VITE_BUILD = PASS
GIT_DIFF_CHECK = PASS
CONTROLLED_RUNTIME = PASS
```

The Vite build emitted only the pre-existing chunk-size warning; the build completed successfully.

## Change surface

```text
WEB_ONLY = YES
CORE_FILES_CHANGED = 0
NEW_CORE_ENTITY = 0
NEW_CORE_OPERATION = 0
NEW_RENDERER = 0
NEW_COORDINATE_SYSTEM = 0
NEW_BIM_SCOPE = 0
NEW_FLOOR_PLAN_GENERATOR = 0
```

Implementation files are limited to:

- explicit architectural-space geometry adapter and validation;
- P1 filtering/realization classification;
- A15 observed geometry field and panel;
- focused tests;
- eight i18n catalogs;
- this final report.

## Remaining observations / frozen future scope

ASI-G1 establishes representation and reading only. It does not authorize:

- `CREATE_ROOM`;
- `CREATE_SPACE`;
- `MODIFY_ROOM`;
- `MOVE_ROOM`;
- `RESIZE_ROOM`;
- `CREATE_CORRIDOR`;
- automatic placement;
- adjacency solving;
- circulation generation;
- floor-plan generation;
- 3D room solids;
- BIM or IFC room export;
- optimization;
- autonomous design.

Level semantics, relationships and future space modification remain partial or unsupported by design.

## Final recommendation

```text
P2_REAL_GATE = RESOLVED
ASI-G1 = PASS_WITH_OBSERVATIONS
NEXT_SAFE_DIRECTION = FUTURE AUTHORIZED SPACE GENERATION / MODIFICATION
CURRENT_IMPLEMENTATION_STOP = YES
```

The canonical foundation is now sufficient for future authorized phases to introduce generation or modification deliberately, without requiring a second spatial model and without confusing architectural-space geometry with BIM or construction geometry.
