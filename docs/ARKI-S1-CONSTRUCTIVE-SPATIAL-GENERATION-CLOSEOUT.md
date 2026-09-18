# ARKI-S1 — Constructive Spatial Generation

## Result

**CONSTRUCTIVE_SPATIAL_GENERATION = PROVEN_WITH_OBSERVATIONS.**

ARKI-S1 closes the gap between the A21 conceptual spatial configuration and a geometrically verifiable conceptual floor-plan representation for HOUSE-A21. It reuses A21 program, relationships, zoning, parti, circulation intent and configuration lineage, while preserving the parent configuration as immutable.

The output is a **conceptual floor plan hypothesis**. It is not a permit document, construction document, BIM authoring model or construction-ready design.

```text
CONCEPTUAL FLOOR PLAN ≠ CONSTRUCTION DOCUMENT
CONSTRUCTION_DOCUMENTATION = NOT_CLAIMED
PERMIT_READY = FALSE
CONSTRUCTION_READY = FALSE
```

## Implemented chain

```text
PROGRAM
→ RELATIONSHIPS
→ PARTI
→ ZONING
→ SPACES
→ BOUNDARIES
→ WALLS / PARTITIONS
→ OPENINGS
→ CIRCULATION
→ CORE
→ VERTICAL CONNECTION
→ TECHNICAL RESERVATIONS
→ VALIDATION
→ CONCEPTUAL FLOOR PLAN
```

## Spatial model

The S1 model includes:

- ten bounded conceptual spaces across N1 and N2;
- target area, actual area and tolerance per space;
- explicit polygon boundaries;
- perimeter walls and partition members derived from closed boundaries;
- doors with host, related space, level, passage role and traversability;
- windows with host, level and visual-aperture role;
- a stair with footprint, run, landing, direction and N1→N2 connection;
- an elevator shaft reservation with lobby, pit, overhead and equipment reservation semantics;
- a continuous conceptual service shaft across N1 and N2;
- accessible route geometry on N1 and N2;
- technical route reservation;
- validation records with PASS, UNKNOWN and CONFLICT states;
- parent configuration lineage and immutable-parent control;
- preserved unknowns and explicit human review requirement.

## Geometric validation

| Required control | Result |
|---|---|
| ROOM_CONTAINMENT | PASS |
| ROOM_NON_OVERLAP | PASS |
| TARGET_AREA_TOLERANCE | PASS |
| ADJACENCY_GEOMETRY | PASS |
| DOOR_CONNECTION | PASS |
| WALL_CLOSURE | PASS |
| CIRCULATION_CONTINUITY | PASS |
| STAIR_LEVEL_CONNECTION | PASS |
| SHAFT_CONTINUITY | PASS |
| ACCESSIBLE_ROUTE_CONTINUITY | PASS |
| UNKNOWN_PRESERVATION | UNKNOWN by design |

The unknown state is intentional for unresolved A21 relationships, engineering dimensions and regulatory compliance.

## Walls, partitions and openings

Walls and partitions are represented as conceptual boundary members generated from the verified room polygons. They are not construction assemblies and do not include thickness, material, structural role, fire rating or detailed joining.

Doors connect explicitly declared spaces and are marked as traversable hypotheses. Windows are represented as visual apertures. Door and window semantics remain separate from construction documentation and code compliance.

## Vertical core and technical reservations

The stair representation includes:

- footprint;
- run;
- landing;
- direction `UP`;
- source level `N1`;
- destination level `N2`;
- occupied spatial region.

The elevator reservation includes shaft, lobby, pit, overhead and equipment reservation concepts. Manufacturer dimensions remain `UNKNOWN` and no traffic performance is claimed.

The service shaft is continuous conceptually across N1 and N2. Shaft continuity does not imply engineered sizing, fire rating, MEP coordination or construction approval.

## Accessible routes

The model provides continuous conceptual route geometry connecting access, circulation, living space and the vertical/upper circulation organization. The route records:

- path geometry;
- level;
- connected spaces;
- continuity state;
- compliance state.

`ACCESSIBLE_ROUTE_GEOMETRY = PROVEN`.

`ACCESSIBILITY_COMPLIANCE = NOT_ASSESSED`.

The system does not infer slope, clear width, turning radius, door clearance, handrail compliance or jurisdictional approval.

## Epistemic controls

All S1 geometry is `HYPOTHESIS`. The parent A21 configuration remains immutable. No HOUSE-001 geometry is used as a synthesis input. Unknowns remain explicit, including:

- regulatory compliance;
- accessible-route compliance;
- wall thickness and construction assemblies;
- door and window schedules;
- elevator manufacturer dimensions;
- engineering performance;
- fire and egress certification.

No automatic decision, winner, recommendation or construction claim is created.

## Visual integration

The existing ARKI panel exposes S1 summary metrics and validation states. S1 remains compatible with the existing `SpatialRepresentation` and `SpatialSvgViewer` direction without creating a second renderer. A future viewer adapter may render walls, openings, stairs, shafts and routes from this contract; this order does not create a separate rendering architecture.

## Validation summary

```text
FOCUSED S1 TESTS = 6 passed / 19 assertions
FOCUSED REGRESSIONS S1 + GDI + E1-E48 = 19 passed
FULL WEB SUITE = PENDING FINAL RUN
TYPESCRIPT = PENDING FINAL RUN
BUILD = PENDING FINAL RUN
GIT_DIFF_CHECK = PENDING FINAL RUN
```

## Final classification

```text
CONSTRUCTIVE_SPATIAL_GENERATION = PROVEN_WITH_OBSERVATIONS
ROOM_BOUNDARIES = PROVEN
WALLS_PARTITIONS = PROVEN_CONCEPTUALLY
DOORS_WINDOWS = PROVEN_CONCEPTUALLY
STAIR_LEVEL_CONNECTION = PROVEN_CONCEPTUALLY
ELEVATOR_SHAFT_RESERVATION = PROVEN_CONCEPTUALLY
SERVICE_SHAFT_CONTINUITY = PROVEN_CONCEPTUALLY
ACCESSIBLE_ROUTE_GEOMETRY = PROVEN_CONCEPTUALLY
FLOOR_PLAN_VALIDATION = PROVEN
CONSTRUCTION_DOCUMENTATION = NOT_CLAIMED
CORE_CONTRACT_CHANGED = NO
CORE_CHANGED = NO
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```
