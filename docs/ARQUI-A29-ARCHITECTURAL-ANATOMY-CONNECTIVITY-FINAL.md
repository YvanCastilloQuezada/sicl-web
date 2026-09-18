# SiMS-DeI — ARQUI A29
# Architectural Building Anatomy & Connectivity Intelligence

## 1. Baseline verification

| Field | Result |
|---|---|
| EXPECTED_WEB_SHA | `86a29239f5b64cc60e7a588ff6ea65e4c2ea44fd` |
| ACTUAL_WEB_SHA at audit | `807b339f3fc394b556a04e1e36aac8e0658d3aa2` |
| EXPECTED_CORE_SHA | `646dae525dd1db4b9f357aced21cc1302fc791a0` |
| ACTUAL_CORE_SHA | `646dae525dd1db4b9f357aced21cc1302fc791a0` |
| Web worktree | historical untracked reports/assets only; untouched |
| Core worktree | clean |

El Web ya contenía A28-P2 a P6 sobre el SHA esperado por la orden. No se alteró el Core.

## 2. A29-P0 — Capability matrix

| Capability | Existing source | Canonical / derived | Current semantics | Geometry | Identity | Provenance | A15 | A20 | A28 | Status | Gap | Recommended action |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SPACE BOUNDARY | ResidentialPlan room footprint; SpatialRepresentation | Derived | Boundary of an explicit space | YES | room/space ID | YES | YES | YES | YES | SUPPORTED_DERIVED | no canonical building element | retain derived observation |
| SHARED BOUNDARY | room polygon comparison | Derived | Shared collinear segment only | YES | deterministic boundary ID | YES | YES | YES | YES | SUPPORTED_DERIVED | no prior explicit read model | derive A29 observation |
| EXTERIOR BOUNDARY | Site/space context | Derived/partial | Not inferred from unshared room edge | YES | partial | YES | partial | partial | YES | PARTIAL | building envelope context absent | preserve UNSHARED / UNKNOWN |
| INTERIOR BOUNDARY | room footprint | Derived | Interior segment or unresolved edge | YES | YES | YES | YES | YES | YES | SUPPORTED_DERIVED | no wall semantics | keep non-wall classification |
| SPACE INTERFACE | shared boundary relation | Derived | Interface between explicit spaces | YES | YES | YES | YES | YES | YES | SUPPORTED_DERIVED | no prior interface object | use read model |
| OPENING | ResidentialOpening | Existing derived model | Explicit proposed/verified opening | NO independent segment binding | opening ID | YES | partial | YES | YES | PARTIAL | not a canonical building entity | use as evidence only |
| DOOR | ResidentialOpening kind DOOR | Existing derived model | Explicit opening labeled DOOR | NO wall/door construction model | opening ID | YES | partial | YES | YES | PARTIAL | no door geometry entity | do not promote |
| WINDOW | ResidentialOpening kind WINDOW | Existing derived model | Explicit proposed window opening | NO envelope semantics | opening ID | YES | partial | partial | YES | PARTIAL | no window/envelope model | do not infer |
| ACCESS POINT | A20-P2 / route | Derived | Proposed or unverified access evidence | partial | route ID | YES | partial | YES | YES | PARTIAL | human confirmation required | reuse A20-P2 |
| DIRECT CONNECTION | explicit door + shared boundary | Derived | Observed only when both evidence layers exist | YES | connection ID | YES | partial | YES | YES | SUPPORTED_DERIVED | human confirmation policy | preserve state |
| CONTROLLED CONNECTION | A21 intent / opening evidence | Derived | Intent may exist; observation separate | partial | intent/connection ID | YES | partial | YES | YES | PARTIAL | no controlled access evidence | expose UNKNOWN/INTENDED |
| CIRCULATION CONNECTION | A20-P1 + route | Derived | Route-linked connection | partial | route ID | YES | partial | YES | YES | SUPPORTED_DERIVED | not equivalent accessible route | reuse A20 |
| VERTICAL CONNECTION | A22 cores and levels | Derived | Shared stair/duct identity across levels | YES | core ID | YES | YES | YES | YES | SUPPORTED_DERIVED | stair movement not fully verified | preserve PROPOSED |
| LEVEL TRANSITION | A22 level graph | Derived | N1↔N2 coordination | YES | level IDs | YES | YES | YES | YES | SUPPORTED_DERIVED | no complete egress proof | reuse A22 |
| ENVELOPE | no independent canonical envelope | Unsupported/partial | CRAZY surface is hypothesis only | partial | alternative ID | YES | partial | partial | YES | PARTIAL | envelope semantics missing | REAL_GATE for future |
| WALL | plan wall records exist as derived fixture | Partial | Explicit wall-like lines but not canonical construction model | YES | wall ID | YES | partial | partial | YES | PARTIAL | wall ≠ boundary; no construction semantics | do not infer or promote |

## 3. Geometry audit

The existing rectangular polygon representation supports the following deterministic operations without a new geometry engine:

- individual rectangle boundary segments;
- collinear shared segments;
- partial shared segments through 1D overlap;
- unshared space boundaries;
- point-contact rejection;
- no automatic repair of overlaps;
- deterministic segment identity from alternative, space and rounded coordinates.

The controlled A29 read model does not classify a segment as `WALL`. It uses `INTERIOR_SHARED`, `UNSHARED_SPACE_BOUNDARY`, `INTERIOR_UNRESOLVED`, `DEGENERATE` and `UNKNOWN` vocabulary. A shared segment does not imply an opening or connection.

### Geometry limitations

The current implementation is reliable for the explicit rectangular HOUSE-001 fixture and simple collinear segments. Arbitrary polygons, holes, non-manifold boundaries, self-intersections and general curved geometry remain outside this controlled slice. No new geometry engine was created. A broader geometry engine would require a future REAL_GATE.

## 4. A29-P1 — Boundary observation

`ArchitecturalBoundaryObservation` is a **derived read model**, not a new canonical building entity. It records:

- deterministic `boundaryId`;
- `spaceId`, `programItemId`, `levelId`;
- source spatial element;
- segment geometry;
- boundary classification;
- related space and relation type;
- alternative and geometry version;
- provenance;
- epistemic state.

## 5. Connection observation

`ArchitecturalConnectionObservation` is also derived. A connection is emitted from explicit opening evidence and a compatible shared boundary. The model preserves:

```text
SHARED_BOUNDARY ≠ OPENING
OPENING ≠ CONNECTION
CONNECTION ≠ ACCESS
ACCESS ≠ ACCESSIBLE ROUTE
```

Connection states include `CONNECTION_OBSERVED`, `CONNECTION_UNKNOWN`, `CONNECTION_CONFLICTING` and intent-only states. No `Door` entity is created.

## 6. A21 intent versus observed geometry

`deriveA29IntentObservations()` compares declared A21 adjacency with the geometry-derived boundary and explicit connection evidence.

Examples:

```text
REQUIRED_ADJACENCY + SHARED_BOUNDARY
= GEOMETRIC_ADJACENCY_OBSERVED

REQUIRED_ADJACENCY + SHARED_BOUNDARY WITHOUT CONNECTION
= ACCESS_UNVERIFIED

REQUIRED_ADJACENCY WITHOUT SHARED_BOUNDARY
= INTENT_NOT_OBSERVED
```

A potential conflict remains a review item; it is not automatically a design failure.

## 7. A20 integration

The A29 model reuses A20 route identity and A20-P2 accessibility status. It does not create a second circulation graph and does not convert a route into a certified accessible route. For HOUSE-001, the route remains `ACCESS_UNVERIFIED` because its accessibility is `PROPOSED`, not verified geometry.

## 8. A28 integration

The A28 review board now carries the A29 read model as `anatomy` and adds:

- `BOUNDARY_INTERFACES`;
- `CONNECTIONS`;
- boundary/interface legend entries;
- A29 provenance;
- A29 warnings.

This makes the new semantics displayable through the existing A28 presentation composer without adding another renderer or UI truth source.

## 9. Human authority and safety

```text
WALL_CREATED = FALSE
DOOR_CREATED = FALSE
WINDOW_CREATED = FALSE
AUTOMATIC_REPAIR = FALSE
ACCESSIBILITY_CERTIFIED = FALSE
REGULATORY_COMPLIANCE_CREATED = FALSE
DECISION_CREATED = FALSE
WINNER_CREATED = FALSE
HUMAN_REVIEW_REQUIRED = TRUE
```

## 10. Validation

Focused validation:

```text
A29 FOCUSED TESTS = 5 passed
TYPECHECK = PASS
GIT_DIFF_CHECK = PASS
```

The full Web suite and build remain required before the local commit is finalized.

## 11. Classification

```text
A29-P0 = PASS
A29-P1 = PASS_WITH_OBSERVATIONS
REAL_GATE = NOT_TRIGGERED for the controlled rectangular fixture
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_BUILDING_ENTITY = NO
NEW_GEOMETRY_ENGINE = NO
SECOND_CIRCULATION_GRAPH = NO
```
