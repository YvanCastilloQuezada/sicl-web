# SiMS-DeI — ARQUI A21-P3
# Architectural Circulation Intent Intelligence — Final Report

## A. Executive classification

```text
A21_P3 = PASS_WITH_OBSERVATIONS
A21_P3R = PASS
PROGRAM_REUSE = PASS
RELATIONSHIP_REUSE = PASS
ZONING_REUSE = PASS
CIRCULATION_INTENT = PASS
CIRCULATION_INTENT_GRAPH = PASS
MOVEMENT_SEQUENCE = PASS
ROUTE_HIERARCHY = PASS
ACCESS_INTENT = PASS
CONTROLLED_ACCESS = PASS
ROUTE_MEDIATION = PARTIAL
VERTICAL_CONNECTION_INTENT = PASS
INTENT_CONTINUITY = PARTIAL
CONFLICT_PRESERVATION = PASS
UNKNOWN_PRESERVATION = PASS
PROVENANCE = PASS
A12_HANDOFF = PASS
A13_INTEGRATION = PASS
A20_COMPARISON = PARTIAL
A29_COMPARISON = PASS
A30_COMPARISON = PARTIAL
A15_HANDOFF = READY
A16_CONSUMPTION_READY = YES
A17_HANDOFF = PARTIAL
A28_VISUALIZATION = NOT_CHANGED
PATIO_PHYSICAL_ACCESS = UNKNOWN
KITCHEN_DIRECT_ACCESS = OBSERVED
MAIN_BEDROOM_CONTROLLED_ACCESS = PASS
PRIVATE_BATH_ACCESS = UNKNOWN
BEDROOM_AS_ROUTE_MEDIATOR = NO
STAIR_INFERRED = NO
ELEVATOR_INFERRED = NO
DOOR_INFERRED = NO
CORRIDOR_GEOMETRY_CREATED = NO
ACCESSIBILITY = NOT_ASSESSED
REGULATORY_COMPLIANCE = NOT_ASSESSED
AUTOMATIC_REPAIR = NO
DECISION_CREATED = NO
WINNER_CREATED = NO
HUMAN_AUTHORITY = PRESERVED
FLOOR_PLAN_GENERATION_READINESS = PARTIAL
SPATIAL_SYNTHESIS_READINESS = PARTIAL
FIRST_SYNTHESIS_BREAK = SPATIAL_CONFIGURATION_SYNTHESIS_REQUIRING_EXPLICIT_SPACE_PLACEMENT_AND_CONSTRAINT_SOLVING
MINIMUM_NEXT_CAPABILITY = EXTEND_EXISTING_GDI-P3/A13_SYNTHESIS_WITH_CONSTRAINED_SPATIAL_CONFIGURATION_HYPOTHESIS
EXISTING_SYNTHESIS_REUSE = A13_SPATIAL_ORGANIZATION + A21_PROGRAM_RELATIONSHIPS_ZONES + EXISTING_GDI-P3_DIRECTION
REAL_GATE = NOT_TRIGGERED
CORE_CHANGED = NO
WEB_CHANGED = YES
NEW_CANONICAL_ENTITY = NO
NEW_DERIVED_READ_MODEL = YES
NEW_GEOMETRY_ENGINE = NO
NEW_PATHFINDING_ENGINE = NO
NEW_OPTIMIZER = NO
NEW_RENDERER = NO
NEW_CIRCULATION_GRAPH = NO
KNOWLEDGE_FEDERATION = FROZEN
A29 = FROZEN
A30 = FROZEN
A31 = NOT_ACTIVATED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## B. Baseline verification

The expected Core baseline was confirmed at `646dae525dd1db4b9f357aced21cc1302fc791a0`. The Web HEAD before the change was `de7fa33838369ad1498828fb90273a648fb047fd`; the working Web surface contained unrelated untracked historical documentation and image artifacts, which were deliberately excluded from the commit. No reset or broad cleanup was performed.

## C. Reuse verification

A21-P3 reuses the existing `A21ProgramItem` and `A21RelationshipRecord` models, the existing functional-zone proposals, the `CirculationIntent` and `validateCirculationIntent` contract, the A20-P1 evidence graph shape, the A29 boundary/connection read model, and the A30 opening audit. No parallel circulation graph, pathfinding engine, geometry engine, optimizer, authority system, persistence layer, or canonical entity was introduced.

## D. Existing circulation-related capability

Before P3, SiMS-DeI could represent circulation-related program nodes, declared relationships, functional zones, and observed circulation evidence. It could not yet compose these into a single architect-facing intent model expressing **who moves, from where, toward what, through which sequence, with what privacy/control logic, and across which level relationship**. P3 closes that read-model gap without claiming a corridor, door, stair, elevator, accessible route, or constructed floor plan.

## E. P3 model

The new derived model is `A21P3Graph`, identified as `HOUSE-A21-CIRCULATION-INTENT`. It contains human/derived/unknown nodes, hierarchical routes, movement sequences, mediation nodes, access intent, vertical intent, continuity requirements, validations, evidence references, and warnings. It is explicitly read-only and carries `noGeometryMutation`, `noDecision`, `noRecommendation`, and `noAutomaticRepair` invariants.

The implementation is in `client/src/components/a21CirculationIntent.ts`. The model is derived over existing state; it does not create a Core entity and does not alter the existing A21, A20, A29, or A30 contracts.

## F–N. Semantics

**Node semantics.** Nodes distinguish origin, transition, destination, mediator, vertical, and unknown roles. Program labels are not treated as geometry. A program node without supplied circulation evidence remains an architectural unknown.

**Route semantics.** Routes are ordered sequences rather than polylines. Each route records origin, destination, mediation, level transition, hierarchy, access intent, continuity requirement, provenance, and epistemic state.

**Route hierarchy.** The HOUSE-A21 proof contains primary access-to-social movement, service movement between social and kitchen areas, private controlled access, a derived secondary private route, and a vertical relationship between N1 and N2. The secondary private route is explicitly derived and requires human review.

**Movement sequences.** The controlled HOUSE-A21 graph records six sequences: access to social, social to service, private controlled access, secondary private access, N1 to N2 vertical relation, and social-bath access. The social-bath sequence is intentionally UNKNOWN because the human fixture did not supply an access intent for it.

**Access intent and controlled access.** Access intent is distinct from a physical opening. The main-bedroom route is controlled from upper circulation, as required by the human program. This does not certify privacy, accessibility, code compliance, or architectural quality.

**Route mediation.** `GROUND_CIRCULATION` mediates access to the social zone and `UPPER_CIRCULATION` mediates private destinations. The implementation does not infer a bedroom as a mediator. `BEDROOM_AS_ROUTE_MEDIATOR = NO`.

**Vertical connection intent.** The N1↔N2 relation is represented as vertical intent only. No stair or elevator is inferred; `STAIR_INFERRED = NO` and `ELEVATOR_INFERRED = NO`.

**Intent continuity.** Continuity is checked against the controlled A20-shaped evidence graph. It is partial where the underlying evidence is absent or unresolved, and it never triggers automatic repair.

## O. Provenance

Every route and node has provenance. Human routes retain the original `HOUSE-A21.human-intent:*` lineage. Derived routes identify their derivation and require review. The unknown social-bath route preserves the original A21 unknown rather than inventing a relationship. A20, A29, and A30 evidence references remain attached to observed transitions.

## P–W. HOUSE-A21 controlled proof

| Intent | Sequence | Result | Interpretation |
|---|---|---|---|
| Access to social | `ACCESS → GROUND_CIRCULATION → LIVING_DINING` | Observed in controlled evidence | Human intent is represented; no corridor geometry is created. |
| Social to service | `LIVING_DINING → KITCHEN` | Observed/partial | A29/A30 support the relationship; direct access remains evidence-scoped. |
| Main bedroom control | `UPPER_CIRCULATION → MAIN_BEDROOM` | Observed/partial | Controlled access intent is preserved; no privacy certification is made. |
| Secondary private movement | `UPPER_CIRCULATION → BEDROOM_2` | Derived/partial | Derived from N2 private organization; human review required. |
| Vertical relation | `GROUND_CIRCULATION → UPPER_CIRCULATION` | Observed intent | A vertical element is not inferred. |
| Social bath access | `ACCESS → GROUND_CIRCULATION → SOCIAL_BATH` | Unknown | The source order did not provide this intent; no bedroom mediator is fabricated. |

Patio is a visual-connection intent in A21. Its physical access is `UNKNOWN`; visual relation is not physical access. Kitchen adjacency is observed through the existing A29/A30 read surfaces, but adjacency is not identical to an accessible route. Private bathroom access is `UNKNOWN`, because the A21 human fixture explicitly left the relevant relationship unresolved.

## X–AB. Negative controls

The negative-control matrix passed. Conflicting adjacency and separation semantics remain preserved rather than reconciled automatically. An incomplete sequence containing `MISSING_ROOM` becomes insufficient/unverified and does not become a route. The vertical negative control confirms that vertical intent does not create a stair. Accessibility and regulatory checks remain `NOT_ASSESSED` and do not become positive merely because a sequence exists.

## AC–AJ. Handoffs and comparisons

A12 handoff is **PASS**: parti and design intentions remain upstream context and are not rewritten. A13 integration is **PASS**: the P3 model is compatible with the existing spatial-organization read model and does not mutate units or relationships. A20 comparison is **PARTIAL** because the proof uses a controlled A20-shaped evidence graph rather than a new evidence system. A29 comparison is **PASS** through the existing boundary and connection read model. A30 comparison is **PARTIAL** because legacy openings lack explicit extents and role/traversability remain evidence-scoped. A15 is ready to consume the route intent as context for future architectural reading. A16 can consume the routes as critique context. A17 handoff is partial: future revision may use route tensions, but no automatic repair or geometric mutation is authorized here.

## AK. Visualization and false-success protection

A28 was not changed. The new model can be serialized into the existing review-board/read-model pathway, but this order did not add a renderer or visual surface. False-success protection is maintained through explicit epistemic states, unknown preservation, human-review requirements, and negative assertions against geometry creation, automatic repair, decision creation, and regulatory certification.

## AL–AS. Readiness and next phase

P3 does not produce a constructive floor plan. The first synthesis break is the need to compose program, relationships, zones, circulation intent, parti, level intent, area targets, constraints, and unknowns into a spatial configuration hypothesis while preserving collision, containment, adjacency, and continuity checks. The minimum next capability is therefore **an extension of the existing GDI-P3/A13 synthesis direction**, not a new `FloorPlanGenerator`, `RoomPackingEngine`, or parallel `ARQUISpatialEngine`.

The exact next macrophase should begin with a capability-first audit of existing GDI-P3/A13/ASI surfaces and then, only if justified, add a constrained spatial-configuration hypothesis layer. It must not start with doors, windows, walls, stairs, BIM, or a construction floor plan.

## AT. REAL_GATE determination

`REAL_GATE = NOT_TRIGGERED`. A21-P3 required only a derived read model and existing evidence reuse. It did not require a Core Contract change, new canonical circulation entity, new geometry engine, pathfinding engine, optimizer, persistence architecture, authority system, new LLM provider, or Knowledge Federation activation.

## AU–AZ. Validation

Focused validation passed:

```text
3 test files passed
12 tests passed
```

The full Web validation passed:

```text
70 test files passed
338 tests passed
TypeScript: PASS
Build: PASS
Build completed in 10.43s
 git diff --check: PASS
```

The build emitted the existing large-chunk warning for the application bundle; this is a performance observation, not an A21-P3 failure.

## BA–BE. Final state

```text
CORE_SHA = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE_SHA = de7fa33838369ad1498828fb90273a648fb047fd
CORE_CHANGED = NO
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

The only files intended for the A21-P3 local commit are:

```text
client/src/components/a21CirculationIntent.ts
client/src/components/a21CirculationIntent.test.ts
docs/ARQUI-A21-P3-CIRCULATION-INTENT-FINAL.md
```

## Commit and publication state

One local commit is required after final verification. No push, pull request, merge, or deployment is authorized by this order. After the commit, control returns to the Product Owner and ChatGPT.

## Constitutional closure

> Program is not geometry. Relationship is not geometry. Zoning is not a floor plan. Circulation intent is not a corridor. Route intent is not route geometry. Access intent is not a door. Vertical connection intent is not a stair or elevator. Unknown is a valid result. No evidence implies no fact. Human authority is preserved.

**STOP after the local commit.**

**A21-P3 — ARCHITECTURAL CIRCULATION INTENT INTELLIGENCE — PASS WITH OBSERVATIONS**
