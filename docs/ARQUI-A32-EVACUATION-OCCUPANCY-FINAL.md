# SiMS-DeI — ARQUI A32
# Evacuation Flow and Maximum Occupancy

## Executive result

**A32 = PASS_WITH_OBSERVATIONS.** A32 calculates a deterministic preliminary occupancy proxy from room area and explicit occupant-load factors, then estimates route capacity and a capacity-proxy flow value for reachable paths to a declared exit node.

The result is not an evacuation certification, not a maximum legal occupancy approval and not a fire-safety determination. Human review remains mandatory.

## Occupancy calculation

For each explicit room, A32 records the room, level, area, zone, factor, calculated maximum persons, source class, evidence references and provenance.

The calculation is:

```text
MAXIMUM_PERSONS = floor(AREA_M2 / OCCUPANT_LOAD_FACTOR_M2_PER_PERSON)
```

The initial HOUSE-001 demonstration uses educational proxy factors:

| Zone | Factor |
|---|---:|
| PUBLIC | 8 m²/person |
| PRIVATE | 12 m²/person |
| SERVICE | 10 m²/person |
| CIRCULATION | 10 m²/person |

These values are labeled `EDUCATIONAL_PROXY`. They are not extracted from a jurisdictional code.

For HOUSE-001, the resulting preliminary proxy is:

```text
N1 = 3 persons
N2 = 2 persons
TOTAL = 5 persons
```

Missing or invalid factors produce `INCOMPLETE`; A32 does not silently substitute a value.

## Evacuation flow calculation

For each occupied room, A32 resolves a path through the declared route to the exit node. The route capacity proxy is:

```text
CAPACITY_PERSONS_PER_MIN = ROUTE_WIDTH_M × FLOW_RATE_PERSONS_PER_MIN_PER_M
```

The estimated value is:

```text
CAPACITY_PROXY_MINUTES = DEMAND_PERSONS / CAPACITY_PERSONS_PER_MIN
```

This value is explicitly named a **capacity proxy**, not evacuation time. It does not model walking speed, travel distance, door swing, stair geometry, merging flows, smoke, fire, visibility, alarm delay, queuing dynamics or occupant behavior.

The A28 visual pipeline exposes A32 through the existing overlay type `EVACUATION_OCCUPANCY`. The overlay reports proxy occupants and the capacity-proxy result while preserving `NOT_ASSESSED` for evacuation compliance.

## Reachability and safety behavior

A route with an unreachable origin, missing exit or missing valid flow profile is classified as `CONFLICTING` or `INCOMPLETE`. The system preserves the missing evidence and performs no automatic correction.

A reachable path can be calculated without being declared safe. A computed flow value therefore does not create a recommendation, decision or approval.

## Epistemic and authority boundaries

```text
AREA × FACTOR ≠ LEGAL_OCCUPANCY
ROUTE_CAPACITY ≠ EVACUATION_CERTIFICATION
FLOW_PROXY ≠ EVACUATION_TIME
REACHABLE ≠ SAFE
DOOR_WIDTH ≠ CODE_COMPLIANCE
STAIR_CORE ≠ APPROVED_EXIT
FIRE_MODEL ≠ PRESENT
COMPUTED ≠ APPROVED
```

A32 preserves the following statuses:

```text
EVACUATION_COMPLIANCE = NOT_ASSESSED
FIRE_SAFETY_STATUS = NOT_ASSESSED
HUMAN_REVIEW_REQUIRED = TRUE
NO_AUTOMATIC_CORRECTION = TRUE
NO_AUTOMATIC_APPROVAL = TRUE
```

## Reuse

A32 reuses the explicit room and level geometry from `ResidentialPlan`, the declared route from A20/A30, the opening and passage evidence from A30/A31, and the existing A28 visual overlay pipeline. No second circulation graph, geometry engine, fire engine or persistence model was created.

## Validation

```text
Focused A32 + A28 tests = 9 passed
Full Web suite = 67 test files, 327 tests passed
TypeScript = PASS
Build = PASS
Build duration = 11.15 s
git diff --check = PASS
Core changed = NO
Core status = CLEAN
```

The build emitted the existing warning about large JavaScript chunks. It completed successfully.

## Required final classification

```text
A32 = PASS_WITH_OBSERVATIONS
OCCUPANCY_CALCULATION = PASS
OCCUPANCY_MAXIMUM_MEANING = PRELIMINARY_CAPACITY_PROXY
EVACUATION_FLOW_CALCULATION = PASS_AS_CAPACITY_PROXY
REACHABILITY = PASS_WHEN_ROUTE_EVIDENCE_EXISTS
MISSING_FACTOR_HANDLING = INCOMPLETE_WITHOUT_SUBSTITUTION
UNREACHABLE_ROUTE_HANDLING = CONFLICTING_WITHOUT_AUTO_CORRECTION
EVACUATION_COMPLIANCE = NOT_ASSESSED
FIRE_SAFETY = NOT_ASSESSED
REGULATORY_COMPLIANCE = NOT_ASSESSED
HUMAN_AUTHORITY = PRESERVED
NEW_CANONICAL_ENTITY = NO
NEW_DERIVED_READ_MODEL = YES
NEW_GEOMETRY_ENGINE = NO
NEW_FIRE_SIMULATION_ENGINE = NO
NEW_CIRCULATION_GRAPH = NO
NEW_RENDERER = NO
CORE_CHANGED = NO
WEB_CHANGED = YES
REAL_GATE = NOT_TRIGGERED
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## Next causal boundary

The next required capability is not an automatic safety verdict. It is a separately authorized evidence layer for **jurisdiction-bound occupant-load factors and measured egress geometry**, including door clear width, stair width, travel distance and exit semantics. A32 does not implement that layer.

**A32_STATUS = PASS_WITH_OBSERVATIONS**
