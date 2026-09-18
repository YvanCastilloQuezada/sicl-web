# SiMS-DeI — ASI-G2
# Canonical Controlled Spatial Realization Mutation

## Final classification

```text
ASI-G2 = PASS_WITH_OBSERVATIONS
P2R_REAL_GATE = RESOLVED
CANONICAL_SPACE_MUTATION = PASS
NEW_CANONICAL_ENTITY = 0
NEW_PARALLEL_SPATIAL_MODEL = NO
NEW_OPERATION_FAMILY = ONE_GENERIC_OPERATION
CORE_CONTRACT = BACKWARD_COMPATIBLE EXTENSION
HUMAN_AUTHORITY = PRESERVED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

ASI-G2 resolves the P2R mutation gate with the smallest reusable extension: one generic `REALIZE_SPATIAL_ELEMENT` operation that carries explicit human-supplied architectural-space geometry into a result `Alternative`, then composes it into the existing generated `SpatialRepresentation` as an ASI-G1 `SpatialZone`.

No room-specific operation, floor-plan generator, BIM model, second spatial state, second event log or second authority system was created.

## Baselines

```text
WEB_BASELINE = 01fce38e767e888250b6367e47d82b34d6e97151
CORE_BASELINE = 1c416551a945286e3b7fab6a5f01e8852442ea7b
CORE_FINAL = 4060b4f98224b4403ecbfee5e59042e736ccf5be
```

The A18, P2 and P2R diagnostic reports remain deliberately untracked. No unrelated cleanup was performed.

## Implemented contract

`Alternative` now accepts an optional backward-compatible field:

```text
explicit_spatial_realizations: list[dict]
```

Existing alternatives default to an empty list and continue to serialize, deserialize and regenerate unchanged.

The generic operation is:

```text
REALIZE_SPATIAL_ELEMENT
```

Its minimum required realization payload is:

```text
space_id
program_item_id
geometry
geometry_provenance
```

The payload may additionally carry:

```text
spatial_element_id
coordinate context
units
level
parent_id
boundary_status
request provenance
labels
```

The implementation validates a closed, non-degenerate polygon and rejects missing or invalid geometry. It does not infer geometry from target area, space type, A13 relationships, ARQUI or an LLM response.

## Canonical result composition

The successful path is:

```text
SOURCE ALTERNATIVE
→ REALIZE_SPATIAL_ELEMENT preview
→ explicit Human Authority
→ RESULT ALTERNATIVE
→ existing spatial generator
→ existing generated massing/site elements
   + explicit authorized SpatialZone
→ RESULT SpatialRepresentation
→ independent readback
→ A15 fresh observation
```

The resulting zone carries:

```text
element_type = SpatialZone
space_role = architectural_space
space_id = BEDROOM-01
program_item_id = BEDROOM
geometry_provenance = HUMAN_SUPPLIED_TEST_INPUT
boundary_status = EXPLICIT_BOUNDARY
```

Spatial element identity remains separate from architectural-space identity. In the proof:

```text
BEDROOM
→ BEDROOM-01
→ SpatialZone:BEDROOM-01:f91dc622ec69f711
→ explicit polygon
```

## Controlled positive runtime

```text
PROJECT/FIXTURE = TEST_FIXTURE-HOUSING-P1
SOURCE_ALTERNATIVE = UPAO-001-A
RESULT_ALTERNATIVE = UPAO-001-A-SPACE-BEDROOM-01
PROGRAM_ITEM_ID = BEDROOM
SPACE_ID = BEDROOM-01
INPUT_PROVENANCE = HUMAN_SUPPLIED_TEST_INPUT
COORDINATE_SYSTEM = LOCAL_ENU
UNITS = m
INPUT_GEOMETRY = polygon [[[0,0],[4,0],[4,3],[0,0]]]
VALIDATION = PASS
PREVIEW = PREVIEW
AUTHORIZATION = HUMAN_CONFIRMATION_REQUIRED
EXECUTION = EXECUTED after human_confirmed=true
READBACK = PASS
GEOMETRY_MATCH = YES
BOUNDARY_STATUS = EXPLICIT_BOUNDARY
TARGET_AREA = NOT SUPPLIED
ACTUAL_AREA = 6 m²
ACTUAL_AREA_SOURCE = RESULT_GEOMETRY_COMPUTATION
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
```

The supplied polygon is a triangle, not a 4×3 rectangle. Its deterministic area is exactly 6 m².

## Authority and negative controls

Without explicit authorization:

```text
PREVIEW = AVAILABLE
EXECUTION = NONE
RESULT ALTERNATIVE = NONE
SOURCE STATE = UNCHANGED
```

The runtime returned:

```text
HUMAN_CONFIRMATION_REQUIRED
```

Invalid geometry is rejected. Target area alone does not create geometry. Duplicate `space_id` realization is rejected with an explicit conflict. No silent repair or overwrite occurs.

## Semantic-only control

The primary proof realizes only one space. `BATH-01` is not included in the explicit realization list and remains semantic-only:

```text
BATH-01 = PRESENT SEMANTICALLY
BATH-01 GEOMETRY = NONE
BATH-01 ACTUAL_AREA = UNKNOWN
```

There is no bulk materialization and no collateral geometry creation.

## A15 fresh observation

A15 was run against the result `SpatialRepresentation`, not the preview. It observed:

```text
spaceId = BEDROOM-01
programItemId = BEDROOM
spatialElementId = SZ-ARCH-001
geometryType = polygon
hasBoundedGeometry = true
boundaryStatus = EXPLICIT_BOUNDARY
actualArea = 6
coordinateSystem = LOCAL_ENU
units = m
epistemicStatus = OBSERVED
realizationStatus = GEOMETRICALLY_REALIZED
provenance = actual SpatialRepresentation + actual element metadata
```

The A15 reader retained its safeguards:

```text
noCritique = true
noMutation = true
noDecision = true
```

This confirms that A15 observed actual canonical result state and did not consume preview data.

## Interaction with later massing operations

Existing massing operations preserve the optional explicit realization list when creating a derived child `Alternative`. The generator therefore continues to compose the explicit zone after operations such as `CHANGE_HEIGHT`, `SCALE_MASS`, `SET_GAP` or `CREATE_COURTYARD`.

However, there is no canonical geometric transformation linking massing changes to the explicit room polygon. Therefore the current status is:

```text
EXPLICIT SPACE GEOMETRY AFTER MASSING CHANGE = PRESERVED AS DATA
GEOMETRIC VALIDITY RELATIVE TO NEW MASSING = REQUIRES_REVIEW
AUTOMATIC COORDINATE TRANSFORMATION = NO
AUTOMATIC STALENESS INFERENCE = NO
```

The geometry is not silently moved, scaled or deleted. A future dependency/invalidation policy may classify such geometry as `POTENTIALLY_STALE` or `REQUIRES_REVIEW`, but that policy was not expanded in ASI-G2.

## Scope explicitly not activated

ASI-G2 does not implement:

- `CREATE_ROOM`;
- `CREATE_BEDROOM`;
- `CREATE_BATHROOM`;
- automatic room generation;
- floor-plan generation;
- layout optimization;
- circulation generation;
- adjacency satisfaction;
- access or privacy solution;
- walls, doors or windows;
- BIM;
- AI-generated geometry;
- multi-room batching;
- modification of existing space geometry;
- automatic decisions or recommendations.

The resulting capability is:

```text
CREATE/REALIZE EXPLICIT SPACE = SUPPORTED
MODIFY EXISTING SPACE = UNSUPPORTED
SPACE GENERATION = UNSUPPORTED
SPACE DESIGN = UNSUPPORTED
```

## Validation

```text
CORE_FOCUSED_TESTS = 8 passed
CORE_FULL_SUITE = 399 passed, 1 warning
CORE_COMPILEALL = PASS
CORE_GIT_DIFF_CHECK = PASS
WEB_FULL_SUITE = 244 passed across 46 test files
WEB_TYPESCRIPT = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CONTROLLED_CORE_RUNTIME = PASS
A15_FRESH_RUNTIME = PASS
```

The Web build retained the pre-existing Vite warning about large chunks; it did not fail the build.

## Changed files

Core commit `4060b4f98224b4403ecbfee5e59042e736ccf5be` changed only:

```text
src/sicl/v11.py
src/sicl/gdi.py
src/sicl/spatial_generator.py
src/sicl/spatial_operations.py
tests/test_spatial_operations.py
```

No Web product code was changed. The existing Web client methods already expose the generic preview/execute endpoints and the existing A15 reader consumed the resulting representation without a parallel API or geometry store.

## Final state

```text
ASI-G2 = CLOSED / PASS_WITH_OBSERVATIONS
P2 = READY_FOR_NEXT CONTROLLED SCOPE
P2R = RESOLVED
CORE_CONTRACT_BREAKING_CHANGE = NO
NEW_CANONICAL_ENTITY = 0
NEW_DEPENDENCY = NO
HUMAN_AUTHORITY = PASS
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

The mutation boundary is crossed safely for one explicitly supplied architectural-space polygon. Further space modification, generation or architectural design intelligence remains outside this order.
