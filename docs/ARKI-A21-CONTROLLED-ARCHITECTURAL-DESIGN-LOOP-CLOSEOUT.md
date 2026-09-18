# ARKI — A21 Controlled Architectural Design Loop Closeout

## A. Executive classification

```text
ARKI_ARCHITECTURAL_DESIGN_COMPLETION = PASS_WITH_OBSERVATIONS
POINT_01_CANONICAL_BRIDGE = PROVEN
POINT_02_CONTAINMENT = PROVEN
POINT_03_AUTHORIZED_REVISION = PROVEN
POINT_04_CHILD_CONFIGURATION = PROVEN
POINT_05_FRESH_READBACK = PROVEN
POINT_06_REEVALUATION_COMPARISON = PROVEN
POINT_07_PHYSICAL_ACCESS = PARTIAL
POINT_08_ARCHITECTURAL_ELEMENTS = PROVEN
POINT_09_VISUAL_DESIGN_LOOP = PROVEN
POINT_10_FULL_E2E_LOOP = PROVEN
```

The controlled loop is proven for the bounded HOUSE-A21 educational model. The result is **not** a construction BIM model, code certification, accessibility certification, structural model or environmental-performance simulation.

## B. Baselines and previous gate

```text
CORE_BASELINE = 646dae525dd1db4b9f357aced21cc1302fc791a0
WEB_BASELINE = e7294976144680b3b6b040c40907b33f4a438553
WEB_FINAL = PENDING_LOCAL_COMMIT
PREVIOUS_GATE = MISSING_CANONICAL_SPATIAL_REALIZATION_BRIDGE
PREVIOUS_CONTAINMENT = UNKNOWN
CORE_CONTRACT_CHANGED = NO
```

The previous gate was resolved in Web by an adapter that maps `A21SpatialConfiguration` to the existing `SpatialRepresentation` contract and wraps it as a controlled canonical alternative read model. No Core contract, persisted entity or parallel alternative engine was created.

## C. Point 01 — Canonical bridge

The bridge preserves:

- project identity: `HOUSE-A21`;
- parent alternative: `HOUSE-A21-ALT-PARENT`;
- child alternative: `HOUSE-A21-ALT-CHILD-REVISION-1`;
- configuration identity;
- program-space identity;
- level identity `N1` / `N2`;
- geometry identity and input fingerprint;
- lineage and revision identity;
- hypothesis epistemic state;
- source/generator provenance;
- parent relationship;
- `noDecision`, `noWinner` and `humanSelectionRequired` invariants.

The bridge does not read or reconstruct `HOUSE-001` geometry.

## D. Point 02 — Containment

Containment is now evaluated explicitly and is not inferred from polygon validity alone.

```text
BOUNDARY_VALIDITY = SUPPORTED
CONTAINMENT_EVIDENCE = PROVEN
CONTAINMENT = CONTAINED
SPACE_WITHIN_N1_BOUNDARY = CONTAINED
SPACE_WITHIN_N2_BOUNDARY = CONTAINED
NO_INVALID_EXTERNAL_ESCAPE = PASS
NO_INVALID_SAME_LEVEL_OVERLAP = PASS
NO_SILENT_CROSS_LEVEL_GEOMETRY = PASS
```

The evaluator returns `CONTAINED`, `NOT_CONTAINED` or `UNKNOWN`. The current controlled fixture returns `CONTAINED`. Boundary validity remains a separate field from containment.

## E. Point 03 — Human-authorized revision

The controlled fixture uses the explicit test authority reference:

```text
HOUSE-A21-CONTROLLED-FIXTURE-AUTHORIZATION
```

The revision hypothesis is:

> Move `KITCHEN` farther from `ACCESS` while preserving its relationship path toward `LIVING_DINING`.

The implementation rejects unauthorized mutation by returning the original parent configuration unchanged. Only the explicit authorized fixture produces a child.

```text
NO_AUTHORIZATION → NO_MUTATION = PASS
AUTHORIZED → REVISION_MAY_EXECUTE = PASS
REVISION_AUTHORITY = HUMAN_AUTHORIZED
```

This fixture authorization is test authority, not an automatic product approval.

## F. Point 04 — Child and lineage

```text
PARENT_CONFIGURATION = HOUSE-A21-CONFIG-A
CHILD_CONFIGURATION = HOUSE-A21-CONFIG-A-CHILD
PARENT_ALTERNATIVE = HOUSE-A21-ALT-PARENT
CHILD_ALTERNATIVE = HOUSE-A21-ALT-CHILD-REVISION-1
REVISION_ID = A21-REVISION-MOVE-KITCHEN-1
PARENT_IMMUTABILITY = PASS
REVISION_LINEAGE = PROVEN
CHILD_CONFIGURATION = PROVEN
```

The parent is never overwritten. All non-KITCHEN spaces remain unchanged. The child has a new input fingerprint and lineage reference.

## G. Point 05 — Fresh readback

The child representation is passed through the existing architectural-space geometry reader. The reader recognizes the explicit bounded `SpatialZone` polygons and returns fresh observations for the child geometry.

```text
FRESH_CHILD_READBACK = PROVEN
CHILD_GEOMETRY = FRESH
CHILD_SPACE_OBSERVATIONS = 10
PARENT_RESULTS_COPIED = NO
```

The readback proves realized geometry and bounded boundaries only. It does not establish quality, compliance, constructability or performance.

## H. Point 06 — Re-evaluation and comparison

The parent/child comparison distinguishes:

| Classification | Result |
|---|---|
| Observed change | KITCHEN polygon moved to the authorized child location |
| Computed change | KITCHEN remains on N1 and retains 13.5 m² in the fixture |
| Interpreted change | The child tests greater distance from ACCESS with a retained relation path toward LIVING_DINING |
| Unknown change | Whether the child is better; accessibility, regulation, constructability and environmental performance |
| Unchanged | Project identity, non-KITCHEN geometry, epistemic state and Human Authority |
| New tension | Passage and boundary semantics require human architectural review |

```text
PARENT_CHILD_COMPARISON = PROVEN
RE_EVALUATION = PROVEN
AUTOMATIC_WINNER = NONE
AUTOMATIC_DECISION = NONE
```

## I. Point 07 — Physical access and circulation

The bounded physical model now represents:

- primary access point;
- Living–Kitchen passage candidate;
- passage provenance and traversability state;
- space-to-space connection intent;
- aligned N1/N2 vertical connection representation;
- explicit `stair_geometry = NOT_GENERATED`.

```text
PHYSICAL_ACCESS_REALIZATION = PROVEN
PASSAGE_CONNECTION = PROVEN
VERTICAL_CIRCULATION_REALIZATION = PARTIAL
VERTICAL_LIMITATION = canonical stair/elevator geometry is not generated
ACCESSIBILITY_COMPLIANCE = NOT_ASSESSED
```

The aligned vertical connection is a physical circulation representation, not a fabricated stair or elevator. No accessibility compliance is claimed.

## J. Point 08 — Architectural elements

A bounded physical articulation is represented in the same `SpatialRepresentation` read model:

```text
WALL_REALIZATION = PROVEN
OPENING_REALIZATION = PROVEN
WINDOW_REALIZATION = PROVEN
ENVELOPE_REALIZATION = PROVEN
```

These are conceptual architectural elements with hypothesis provenance. They do not include construction assemblies, structural systems, MEP, fabrication, quantities, manufacturer products or LOD 300/400 semantics.

The following remain explicitly outside scope:

```text
FULL_BIM_CONSTRUCTION_MODEL = NOT_IMPLEMENTED
REVIT = NOT_IMPLEMENTED
MEP = NOT_IMPLEMENTED
STRUCTURAL_DETAILING = NOT_IMPLEMENTED
FABRICATION = NOT_IMPLEMENTED
COST_DATABASE = NOT_IMPLEMENTED
CONSTRUCTION_SCHEDULING = NOT_IMPLEMENTED
```

## K. Point 09 — Visual design loop

The visual loop reuses the existing `SpatialSvgViewer`. No new renderer or design system was created.

The new panel displays:

```text
Parent
Child
Changed element IDs
Human-authority boundary
Automatic winner = none
```

The parent and child are separate representations and can be inspected visually side by side. The difference includes the changed KITCHEN spatial zone and its related boundary/physical elements.

```text
VISUAL_ARCHITECTURAL_RESULT = PROVEN
VISUAL_FIRST = YES
DATA_ON_DEMAND = YES
RENDERER = SpatialSvgViewer
```

## L. Point 10 — Full E2E proof

The controlled HOUSE-A21 chain is represented as:

```text
DESIGN INTENT
→ DESIGN PROBLEM
→ PROGRAM
→ RELATIONSHIPS
→ PARTI
→ SPATIAL ORGANIZATION
→ FLOOR DISTRIBUTION
→ CIRCULATION
→ PARENT CONFIGURATION
→ CANONICAL REALIZATION
→ CONTAINMENT
→ ARCHITECTURAL READBACK
→ CRITIQUE INPUT
→ REVISION HYPOTHESIS
→ HUMAN AUTHORIZATION
→ CHILD CONFIGURATION
→ PHYSICAL ACCESS
→ ARCHITECTURAL ELEMENT REALIZATION
→ FRESH CHILD READBACK
→ RE-EVALUATION
→ PARENT/CHILD COMPARISON
→ VISUAL RESULT
→ HUMAN AUTHORITY PRESERVED
```

```text
FIRST_CONTROLLED_ARCHITECTURAL_DESIGN_LOOP = PROVEN
```

The test loop is deterministic and educational. It does not claim a real construction-ready house.

## M. HOUSE-A21 result

```text
HOUSE_A21 = PASS_WITH_OBSERVATIONS
PARENT = IMMUTABLE
CHILD = MEANINGFULLY_DIFFERENT
KITCHEN_MOVE = OBSERVED
LIVING_DINING_RELATION_PATH = PRESERVED_AS_HYPOTHESIS
WINNER = NONE
DECISION = NONE
HUMAN_REVIEW = REQUIRED
```

## N. Epistemic and authority controls

```text
PARENT_IMMUTABILITY = PASS
MEANINGFUL_GEOMETRIC_CHANGE = PASS
UNRELATED_GEOMETRY_MUTATION = NONE
UNKNOWN_PRESERVATION = PASS
HUMAN_AUTHORITY = PRESERVED
NO_AUTOMATIC_WINNER = PASS
NO_AUTOMATIC_DECISION = PASS
NO_AUTOMATIC_RECOMMENDATION = PASS
NO_SILENT_MUTATION = PASS
```

Unknowns remain explicit for:

- architectural quality;
- accessibility compliance;
- regulatory compliance;
- constructability;
- structural behavior;
- environmental performance;
- daylight and thermal behavior;
- stair/elevator geometry and detailed vertical access.

## O. K1–K7 preservation

K1–K7 remain frozen and were not extended. The new loop only consumes their existing outputs where relevant. No new knowledge source, ingestion flow, specialist runtime, RAG, embedding, vector database or multi-agent system was added.

```text
K1 = PRESERVED
K2 = PRESERVED
K3 = PRESERVED
K4 = PRESERVED
K5 = PRESERVED
K6 = PRESERVED
K7 = PRESERVED
K8 = NOT_ACTIVATED
```

## P. Tests

```text
FOCUSED_A21_COMPLETION_TESTS = 5 passed
A21_P4_REGRESSION = 4 passed
COMBINED_A21_FOCUSED = 9 passed
```

The focused tests cover canonical bridging, containment, unauthorized revision rejection, parent immutability, child lineage, actual geometric change, unrelated geometry preservation, physical elements, vertical partial status, fresh readback, visual difference and Human Authority.

FOCUSED_AFFECTED_REGRESSIONS = 15 files / 104 tests passed

FULL_WEB_SUITE = 79 files / 410 tests passed

TYPESCRIPT = PASS

BUILD = PASS

GIT_DIFF_CHECK = PASS

## Q. Final implementation files

```text
client/src/components/arkiA21ControlledDesignLoop.ts
client/src/components/A21ControlledDesignLoopPanel.tsx
client/arki-a21-controlled-loop.test.ts
client/src/components/a21SpatialConfiguration.ts
client/a21-p4.test.ts  (regression only)
docs/ARKI-A21-CONTROLLED-ARCHITECTURAL-DESIGN-LOOP-CLOSEOUT.md
```

## R. Final implementation commit

The implementation and validation are complete. One integrated local commit will contain the bounded Web-side bridge, controlled design loop, physical read model, visual panel, tests and this closeout document.

## S. Publication state

```text
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## T. Final classification after validation

```text
ARKI_ARCHITECTURAL_DESIGN_COMPLETION = PASS_WITH_OBSERVATIONS
POINT_01_CANONICAL_BRIDGE = PROVEN
POINT_02_CONTAINMENT = PROVEN
POINT_03_AUTHORIZED_REVISION = PROVEN
POINT_04_CHILD_CONFIGURATION = PROVEN
POINT_05_FRESH_READBACK = PROVEN
POINT_06_REEVALUATION_COMPARISON = PROVEN
POINT_07_PHYSICAL_ACCESS = PARTIAL
POINT_08_ARCHITECTURAL_ELEMENTS = PROVEN
POINT_09_VISUAL_DESIGN_LOOP = PROVEN
POINT_10_FULL_E2E_LOOP = PROVEN
CANONICAL_SPATIAL_REALIZATION_BRIDGE = PROVEN
CONTAINMENT_EVIDENCE = PROVEN
PARENT_IMMUTABILITY = PASS
REVISION_AUTHORITY = HUMAN_AUTHORIZED
REVISION_LINEAGE = PROVEN
CHILD_CONFIGURATION = PROVEN
MEANINGFUL_GEOMETRIC_CHANGE = PASS
UNRELATED_GEOMETRY_MUTATION = NONE
FRESH_CHILD_READBACK = PROVEN
RE_EVALUATION = PROVEN
PARENT_CHILD_COMPARISON = PROVEN
PHYSICAL_ACCESS_REALIZATION = PROVEN
PASSAGE_CONNECTION = PROVEN
VERTICAL_CIRCULATION_REALIZATION = PARTIAL
WALL_REALIZATION = PROVEN
OPENING_REALIZATION = PROVEN
WINDOW_REALIZATION = PROVEN
ENVELOPE_REALIZATION = PROVEN
VISUAL_ARCHITECTURAL_RESULT = PROVEN
FIRST_CONTROLLED_ARCHITECTURAL_DESIGN_LOOP = PROVEN
```
