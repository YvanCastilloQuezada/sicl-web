# SiMS-DeI — Architectural Space Intelligence P1
# Explicit Architectural Space + Program-to-Space Semantics

## Final status

```text
P1 = PASS_WITH_OBSERVATIONS
MODE = DERIVED-FIRST
HUMAN_AUTHORITY = PRESERVED
REAL_GATE = NOT_TRIGGERED
```

P1 closes the first part of the A18 representation/generation gap by creating a traceable semantic interpretation between explicit architectural program requirements and the existing spatial representation. It does not claim that semantic spaces are realized rooms.

## Baseline

```text
WEB_BASELINE = bcb284d46c6aa63c15b13da40c170e13b2b46483
CORE_BASELINE = 1c416551a945286e3b7fab6a5f01e8852442ea7b
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = 0
NEW_OPERATION = NO
NEW_RENDERER = NO
```

The pre-existing A18 diagnostic report remained untracked and was not cleaned up or committed as part of P1.

## Architectural constitution preserved

```text
PROGRAM REQUIREMENT ≠ REALIZED SPACE
SPATIAL ZONE ≠ ARCHITECTURAL ROOM
PROGRAM ASSIGNMENT ≠ GEOMETRIC VERIFICATION
TARGET AREA ≠ ACTUAL AREA
MINIMUM AREA ≠ REGULATORY MINIMUM
ADJACENCY REQUIREMENT ≠ ACTUAL ADJACENCY
CONNECTED ≠ ACCESSIBLE ROUTE
LEVEL REFERENCE ≠ COMPLETE FLOOR MODEL
UNKNOWN ≠ FALSE
MISSING VALUE ≠ ZERO
AI_PROPOSED ≠ HUMAN_CONFIRMED
SPACE CREATION ≠ DESIGN DECISION
```

## Reuse decisions

P1 composes the existing surfaces:

- A11 `ArchitecturalProblem` program information;
- A12 strategy and parti;
- A13 spatial organization and expected relations;
- `SpatialRepresentation`;
- `SpatialElement`;
- existing `SpatialZone` elements;
- existing hierarchy and relationship fields;
- current renderer and ARQUI contextual panel;
- existing provenance and epistemic vocabulary;
- A15/A16/A17 compatibility boundaries.

No parallel model was created:

```text
SECOND_SPATIAL_MODEL = NO
SECOND_GEOMETRY_MODEL = NO
SECOND_HIERARCHY = NO
SECOND_RELATIONSHIP_GRAPH = NO
SECOND_PROGRAM_SYSTEM = NO
SECOND_HUMAN_AUTHORITY_SYSTEM = NO
```

## P1 derived semantics

### Architectural program item

Each program item may carry:

- stable `programItemId`;
- name;
- space type;
- quantity;
- target area, only when supplied;
- minimum area, only when supplied;
- level preference, only when supplied;
- required or preferred adjacency requirements;
- access requirements;
- privacy requirements;
- source/provenance;
- epistemic status;
- unknowns.

### Architectural space semantic

Each intended space instance may carry:

- stable `spaceId`;
- `programItemId`;
- deterministic `instanceIndex`;
- name and type;
- an existing `spatialElementId`/`spatialZoneId` where available;
- level reference;
- target and minimum area separately;
- actual area only when deterministically computable from supported geometry;
- boundary status;
- relationship requirements;
- observed relationships separately;
- assignment status;
- provenance;
- epistemic status;
- realization status;
- unknowns.

### Realization states

```text
REQUIREMENT_ONLY
SEMANTIC_SPACE
SPATIALLY_REFERENCED
GEOMETRICALLY_REALIZED
GEOMETRICALLY_VERIFIED
UNKNOWN
```

The current P1 composition intentionally produces semantic-only spaces where no suitable actual `SpatialZone` exists. It does not draw fake room polygons.

## Controlled runtime

Fixture:

```text
PROJECT = TEST_FIXTURE-HOUSING-P1
FIXTURE_STATUS = TEST_FIXTURE
```

Explicit program:

```text
LIVING = quantity 1, target area 24 m²
BEDROOM = quantity 2, target area UNKNOWN
BATHROOM = quantity 1, target area UNKNOWN
```

Runtime result:

```text
PROGRAM_ITEMS = 3
SPACE_INSTANCES = 4
QUANTITY_EXPANSION = BEDROOM-01, BEDROOM-02
SEMANTIC_ONLY = 3
SPATIALLY_REFERENCED = 1
GEOMETRICALLY_REALIZED = 0
UNKNOWN_TARGET_AREA = 3
KNOWN_TARGET_AREA = 1
NO_ROOM_INFERENCE = TRUE
NO_DECISION = TRUE
NO_GEOMETRY_MUTATION = TRUE
```

Program-space lineage:

```text
LIVING
→ LIVING-01
→ SZ-01
→ SPATIALLY_REFERENCED

BEDROOM
→ BEDROOM-01
→ REQUIREMENT_TO_SPACE

BEDROOM
→ BEDROOM-02
→ REQUIREMENT_TO_SPACE

BATHROOM
→ BATH-01
→ REQUIREMENT_TO_SPACE
```

The runtime confirms that quantity expansion creates distinguishable intended instances without claiming geometry for each instance.

## Unknown and area proof

For program items without an explicit area:

```text
TARGET_AREA = UNKNOWN
ACTUAL_AREA = UNKNOWN when geometry is unavailable
```

No value such as `20 m²`, `25 m²`, typical area or regulatory minimum was invented.

For the living-space fixture, the target and actual values remain separate:

```text
TARGET_AREA = 24 m²
ACTUAL_AREA = deterministic polygon area of referenced SpatialZone
```

This is not presented as regulatory compliance. A future comparison may only use bounded terminology such as `AT_OR_ABOVE_TARGET`, `BELOW_TARGET` or `UNKNOWN`.

## Relationship proof

The living-space fixture carries:

```text
REQUIRED_ADJACENCY = DINING
```

The runtime keeps:

```text
relationshipRequirements = [{ target: DINING, relation: REQUIRED_ADJACENCY }]
observedRelationships = []
```

Therefore P1 does not promote an intended adjacency into an observed or verified adjacency.

## A15 compatibility

P1 establishes the state distinctions required for a future A15 extension:

```text
EXPECTED SPACE
SEMANTIC SPACE
SPATIALLY REFERENCED SPACE
GEOMETRICALLY OBSERVED SPACE
UNVERIFIABLE SPACE
```

The current P1 panel does not claim that semantic-only spaces are observed rooms. A15 remains unchanged as a frozen phase.

## A16 compatibility

P1 provides future-safe bounded findings such as:

- program item unassigned;
- required space not realized;
- target area unknown;
- actual area unverifiable;
- required adjacency unverified.

P1 does not add architectural quality judgments or claim deficient area unless both an explicit target/minimum and deterministic actual area are available.

## A17 compatibility

P1 does not create a new operation. It exposes semantic lineage and realization status so a future authorized phase can determine whether an existing operation can act on a selected semantic target.

The valid current result is:

```text
SPACE SEMANTICS = PRESENT
SPACE MODIFICATION CAPABILITY = NOT YET AVAILABLE IN P1
```

No `CREATE_ROOM`, `CREATE_SPACE`, `ASSIGN_ROOM`, `CREATE_WALL`, `CREATE_DOOR`, `CREATE_WINDOW` or `CREATE_SPINE` operation was added.

## Visual behavior

The existing ARQUI contextual surface and renderer are reused. The P1 panel exposes, on demand:

- program items;
- semantic space instances;
- program assignment;
- target area and actual area states;
- level;
- boundary status;
- realization state;
- spatial reference;
- provenance;
- unknowns.

When no geometry exists, the UI shows semantic-only status instead of drawing a fabricated room.

No Workspace V2, new navigation or new renderer was created.

## ARQUI bounded readback

The semantic model supports bounded questions such as:

```text
What spaces does this project require?
Which program items already have space instances?
Which spaces are still unassigned?
What area is required for this space?
Do we know its actual area?
Which required adjacencies remain unresolved?
Is this a real observed space or only a semantic design space?
```

The controlled runtime answered an area question with:

```text
ANSWER = SPACE_AREA_STATE
STATUS = DERIVED
UNKNOWN = preserved where target or actual area is absent
```

## Validation

```text
P1_FOCUSED_TEST_FILES = 5 PASSED
P1_FOCUSED_TESTS = 28 PASSED
FULL_WEB_TEST_FILES = 45 PASSED
FULL_WEB_TESTS = 237 PASSED
TYPESCRIPT = PASS
VITE_BUILD = PASS
git diff --check = PASS
I18N_8_LOCALES = PASS
CONTROLLED_RUNTIME = PASS
CORE_RUNTIME = NOT CHANGED
```

The build retains the existing non-blocking warning for chunks larger than 500 kB. No new dependency was introduced.

## Required classifications

```text
P1 = PASS_WITH_OBSERVATIONS
PROGRAM_ITEM_IDENTITY = PASS
SPACE_IDENTITY = PASS
QUANTITY_EXPANSION = PASS
PROGRAM_SPACE_LINEAGE = PASS
SEMANTIC_ONLY_SPACE = PASS
SPATIALLY_REFERENCED_SPACE = PASS
GEOMETRICALLY_REALIZED_SPACE = NOT CLAIMED / 0 IN FIXTURE
TARGET_AREA_PRESERVATION = PASS
ACTUAL_AREA_SEPARATION = PASS
UNKNOWN_TARGET_AREA = PASS
MINIMUM_AREA_NOT_INVENTED = PASS
LEVEL_REFERENCE_BOUNDED = PASS
ADJACENCY_REQUIREMENT_PRESERVED = PASS
OBSERVED_ADJACENCY_NOT_INVENTED = PASS
ACCESS_REQUIREMENT_NOT_VERIFIED = PASS
PRIVACY_REQUIREMENT_NOT_VERIFIED = PASS
PROVENANCE = PASS
AI_PROPOSAL_NOT_HUMAN_CONFIRMATION = PASS
FALSE_ROOM_INFERENCE = REJECTED
MASS_NOT_ROOM = PASS
SPATIAL_ZONE_NOT_ROOM_BY_RENAME = PASS
A15_FALSE_OBSERVATION = NOT_CREATED
A16_FALSE_CRITIQUE = NOT_CREATED
A17_INVENTED_OPERATION = NO
NO_CREATE_ROOM = PASS
NO_CREATE_SPINE = PASS
NO_BIM_ENTITIES = PASS
NO_WALLS = PASS
NO_DOORS = PASS
NO_WINDOWS = PASS
NO_REGULATORY_COMPLIANCE_CLAIM = PASS
HUMAN_AUTHORITY = PRESERVED
DECISION_CREATED = FALSE
RENDERER_REUSED = PASS
I18N_8_LOCALES = PASS
RESPONSIVE_COMPOSITION = PRESERVED
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = 0
REAL_GATE = NOT_TRIGGERED
```

## Commit and publication

```text
WEB_COMMIT = PENDING_LOCAL_COMMIT
CORE_COMMIT = UNCHANGED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

P1 is complete at the authorized derived-first scope. The next step, if desired, requires a separate order for actual semantic-space generation/modification or canonical contract expansion. P1 itself does not authorize either.
