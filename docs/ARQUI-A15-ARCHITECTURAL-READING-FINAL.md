# SiMS-DeI — ARQUI A15
# Architectural Reading of Realized Design

## 1. Final status

**A15 = PASS_WITH_OBSERVATIONS**.

A15 reads the actual `SpatialRepresentation` produced by the existing A14 path and separates:

```text
ACTUAL RESULT STATE
→ OBSERVED ARCHITECTURAL STRUCTURE
→ EXPECTED A11–A14 STRUCTURE
→ ELEMENT-LEVEL CORRESPONDENCE
→ PRESERVED / TRANSFORMED / NOT_REALIZED / UNVERIFIABLE
```

A15 is strictly read-only. It does not evaluate architectural quality, issue recommendations, mutate geometry, create a winner, create a preference, or create a Decision.

## 2. Scope and baseline

A15 was implemented primarily in Web on the verified A11–A14 baseline:

| Surface | State |
|---|---|
| Web baseline | `d546ff38c8e928b8fa0804e6806d87164a1d9054` |
| Core baseline | `1c416551a945286e3b7fab6a5f01e8852442ea7b` |
| A11 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| A12 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| A13 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| A14 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| Site-development opportunity intelligence | REGISTERED / APPROVED PRODUCT DIRECTION / FROZEN / NOT AUTHORIZED |
| Core changed | NO |
| Core Contract changed | NO |
| New canonical entity | 0 |
| REAL GATE | NOT_TRIGGERED |

A11–A14 were not re-run and no repository-wide audit was performed.

## 3. Reuse before creation

A15 reuses:

- A11 design-problem lineage;
- A12 strategy and parti;
- A13 spatial organization units, relations and expected elements;
- A14 realization plan and readback;
- Core `SpatialRepresentation`;
- `SpatialElement.parent_id` hierarchy;
- element metadata and deterministic geometry;
- existing mass/void metrics;
- the existing SVG renderer;
- existing i18n and responsive Web composition.

The only new A15 artifact is a **derived/noncanonical reading composition**. No `ArquiGeometry`, `ArquiBuilding`, `ArquiSpatialGraph`, parallel relationship system, or second geometry model was created.

## 4. Actual result priority

The reader always starts from actual representation elements. Expected A13/A14 structures are used only for comparison. A hypothesis or operation name is never promoted to an observed fact.

For example, an expected central void is reported as `PRESERVED` only when actual evidence supports it: the current deterministic courtyard representation has a multipolygon footprint and four building masses. If that evidence is absent, A15 reports `NOT_REALIZED` or `UNVERIFIABLE`.

## 5. Observed architecture

The current reader extracts, where supported:

- `SiteBoundary`;
- `BuildingFootprint`;
- `BuildingMass` elements;
- `SpatialZone` elements;
- `CirculationElement`;
- parent/child containment;
- mass count;
- footprint geometry type;
- central-void evidence;
- explicit access point metadata;
- circulation element presence;
- floor count and height metadata;
- site/footprint relationship;
- orientation/north value.

Each observed element is classified as a `FACT` based on actual representation state. Derived mass/void conclusions are marked `COMPUTED`. Correspondence statements remain derived interpretations with explicit basis.

## 6. Hierarchy and relationships

A15 reconstructs `CONTAINS` from actual `SpatialElement.parent_id`. It does not copy A13 hypotheses into the observed relationship set.

Currently observed hierarchy is sufficient for:

```text
SITE → BUILDING FOOTPRINT → BUILDING MASS → SPATIAL ZONE
SITE → CIRCULATION ELEMENT
```

The current representation does not provide a complete canonical relation graph for all architectural meanings. `CONNECTED`, `SURROUNDS`, privacy gradients, room adjacency and circulation loops therefore remain unknown unless directly represented or deterministically supported.

## 7. Mass / void reading

The controlled A14 courtyard result was read as:

```text
mass_count = 4
footprint_type = multipolygon
central_void = OBSERVED
```

The resulting correspondence was:

```text
CENTRAL_VOID = PRESERVED
```

This is a geometric/structural reading. It is not a claim about daylight, comfort, environmental quality, privacy, or architectural value.

## 8. Access, circulation, program and vertical reading

| Domain | Current result |
|---|---|
| Access | OBSERVED only when `CirculationElement.metadata.access_point` exists |
| Circulation | OBSERVED as an explicit line element; loop/spine semantics remain limited |
| Linear spine | NOT_REALIZED when the expected operation was unsupported |
| Program | `UNVERIFIABLE` unless actual spatial-zone metadata carries validated program assignment |
| Vertical organization | OBSERVED when mass `floor_count` and `height` metadata exist |
| Site relationship | OBSERVED when site, footprint parentage and orientation are present |
| Legal setbacks | Not inferred |
| Performance | Not inferred |

A shape is never called lobby, bedroom, restaurant, or another program merely because of its geometry.

## 9. Correspondence model

A15 classifies expected elements independently:

| Status | Meaning |
|---|---|
| `PRESERVED` | Sufficient actual evidence supports the intended element |
| `TRANSFORMED` | A recognizable counterpart exists but differs materially |
| `NOT_REALIZED` | Expected element is absent or explicitly unsupported by A14 |
| `UNVERIFIABLE` | Current state cannot establish presence or absence |
| `NOT_APPLICABLE` | The expected element does not apply to the current case |

There is no global parti-preservation claim unless all required measurable elements support it. The controlled courtyard result preserves the central void but leaves circulation-loop semantics unverifiable. Therefore the correct aggregate is partial, not global preservation.

## 10. Intent loss and unsupported concepts

The linear strategy provides a controlled negative proof:

```text
A12/A13 expected = LINEAR_SPINE
A14 operation = CREATE_SPINE / ALIGN_TO_EDGE unavailable
A15 result = NOT_REALIZED
```

A15 does not hallucinate a spine from a generic circulation line. This keeps intent loss visible and prevents expectation from becoming observation.

## 11. Contradiction detection

A15 compares actual mass bounding boxes when an expected separated-mass relation is relevant. A controlled fixture with overlapping masses produces an explicit contradiction:

```text
EXPECTED_RELATION = SEPARATED_MASSES
OBSERVED_RELATION = mass overlap
CORRESPONDENCE = contradiction exposed
```

No silent reconciliation is performed. Contradiction is not converted into a quality judgment.

## 12. Epistemic boundaries

The reader preserves the following distinctions:

```text
FACT = actual element/state
COMPUTED = deterministic geometric derivation
INTERPRETATION = bounded correspondence with basis
HYPOTHESIS = expected A11–A14 structure
UNKNOWN = not established by current representation
```

The following remain explicitly unknown or uncomputed in the controlled proof:

- whether the courtyard provides adequate daylight;
- thermal comfort;
- ventilation;
- energy;
- acoustics;
- structural performance;
- cost;
- constructability;
- regulatory compliance;
- architectural quality;
- whether the circulation line functions as a complete loop;
- validated program semantics where metadata is absent.

## 13. Provenance

The A15 reading preserves the trace:

```text
PROJECT INPUT
→ A11 INTENT
→ A12 DRIVER
→ A12 STRATEGY
→ A12 PARTI
→ A13 ORGANIZATION
→ A14 REALIZATION
→ ACTUAL SPATIAL REPRESENTATION
→ A15 OBSERVATION / CORRESPONDENCE
```

Each important statement points to actual representation, element metadata, geometry, A13 expected structure, A14 plan/readback, or deterministic metrics.

## 14. Visual-first composition

The A15 panel appears after the existing A14 result and SVG renderer. The geometry remains visually dominant; the reading is contextual. The panel presents summary counts, actual state, hierarchy, correspondence, unknowns, contradictions and traceability rather than a raw JSON dump.

The existing renderer is reused. A15 does not create a second renderer or Workspace V2.

```text
SEE DESIGN
→ ASK / SELECT
→ UNDERSTAND
→ INSPECT DETAILS IF NEEDED
```

A bounded browser visual proof was not executed in this run:

```text
VISUAL_BROWSER_RUNTIME = NOT_EXECUTED
```

This is an observation, not a failure.

## 15. Controlled runtime proof

The runtime used the realized courtyard representation equivalent to `UPAO-001-A-GDI-3419939c` and a linear expectation against the same actual state.

```text
actual_state_read = true
mass_count = 4
central_void = OBSERVED
courtyard_correspondence = PRESERVED
linear_spine_correspondence = NOT_REALIZED
program_correspondence = UNVERIFIABLE
preserved = 1
unverifiable = 2
no_mutation = true
no_critique = true
no_recommendation = true
no_decision = true
```

The serialized representation was identical before and after reading. A15 executed no Core operation and no P9 operation.

## 16. Validation

| Validation | Result |
|---|---|
| Focused A15 + A14 tests | 8 passed |
| Full Web suite | PASS |
| Full Web test count | 41 files / 217 tests passed |
| TypeScript | PASS |
| Vite build | PASS |
| `git diff --check` | PASS |
| JSON validation, 8 locales | PASS |
| Core changed | NO |
| Core Contract changed | NO |
| Browser visual runtime | NOT_EXECUTED |

The build retains the existing non-blocking warning about chunks larger than 500 kB.

## 17. Required classifications

```text
A15 = PASS_WITH_OBSERVATIONS
ARCHITECTURAL_READING = PASS
ACTUAL_STATE_READING = PASS
EXPECTED_VS_OBSERVED_SEPARATION = PASS
OBSERVED_ELEMENTS = PASS
HIERARCHY_READING = PASS
RELATIONSHIP_READING = PARTIAL
MASS_VOID_READING = PASS
ACCESS_READING = PASS_WHERE_REPRESENTED
CIRCULATION_READING = PARTIAL
PROGRAM_READING = UNKNOWN / NOT_REPRESENTED_WHERE_ABSENT
VERTICAL_READING = PASS_WHERE_REPRESENTED
SITE_RELATIONSHIP_READING = PASS_WHERE_SUPPORTED
INTENT_CORRESPONDENCE = PASS_WITH_OBSERVATIONS
INTENT_LOSS_DETECTION = PASS
CONTRADICTION_DETECTION = PASS
UNKNOWN_PRESERVATION = PASS
DESIGN_DISTANCE_REUSE = NOT_APPLICABLE
TRACEABILITY_A11_A15 = PASS
NO_EXPECTATION_AS_OBSERVATION = PASS
NO_CRITIQUE = PASS
NO_RECOMMENDATION = PASS
NO_GEOMETRY_MUTATION = PASS
NO_P9_EXECUTION = PASS
NO_WINNER = PASS
NO_DECISION = PASS
NO_FALSE_PERFORMANCE = PASS
NO_FALSE_COMPLIANCE = PASS
NO_SECOND_SPATIAL_GRAPH = PASS
NO_SECOND_GEOMETRY_MODEL = PASS
RENDERER_REUSE = PASS
VISUAL_BROWSER_RUNTIME = NOT_EXECUTED
I18N_8_LOCALES = PASS
RESPONSIVE = PASS_WITH_EXISTING_LAYOUT
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = 0
REAL_GATE = NOT_TRIGGERED
```

## 18. Central answers

1. **Can ARQUI read the realized design rather than repeat intention?** Yes, for the currently represented canonical geometry/state.
2. **What can it observe deterministically?** Site, footprint, masses, zones, explicit circulation, parentage, mass count, selected geometry types, access metadata, heights, floors and orientation.
3. **What hierarchy can it reconstruct?** The actual parent-child containment exposed by `parent_id`, primarily site → footprint → mass → zone.
4. **What relationships can it determine?** Actual containment and explicitly represented access/circulation relations; broader relational semantics remain partial.
5. **Can it read mass/void organization?** Yes, for the controlled courtyard representation.
6. **Can it determine central courtyard existence from actual geometry?** Yes, when multipolygon footprint and four-mass evidence are present.
7. **Can it distinguish expected from observed circulation?** Yes; an unsupported spine is `NOT_REALIZED`, while an explicit line is observed without claiming loop semantics.
8. **Can it distinguish intended program from represented program?** Yes; it reports `UNVERIFIABLE` without validated program metadata.
9. **Can it identify unrealized elements?** Yes, at element level, as shown by the linear spine proof.
10. **Can it preserve unknown?** Yes.
11. **Can it expose contradiction?** Yes, via overlapping actual masses against expected separation.
12. **Can it determine element-level correspondence?** Yes, with explicit basis and observations.
13. **Can it avoid global parti-preservation claims?** Yes.
14. **Can it explain its basis?** Yes, through provenance and element/metric sources.
15. **Does it preserve A11→A15 provenance?** Yes.
16. **Does it avoid critique?** Yes.
17. **Does it avoid recommendation?** Yes.
18. **Does it remain read-only?** Yes.
19. **Did it create a second spatial/geometry system?** No.
20. **Did it require Core modification?** No.
21. **What remains unobservable?** Rich program semantics, room adjacency, full circulation topology, performance, quality, compliance and construction meaning.
22. **Is it sufficient for a future Design Critic without hallucinating state?** It is a necessary perception/read layer and a safe partial foundation; it is not itself a Design Critic.
23. **What should come next?** A separately authorized Design Critic that consumes A15 readings, preserves epistemic boundaries, and remains distinct from recommendation and decision authority.

## 19. Final recommendation

A15 is a **major local milestone with observations**. The current result is sufficient to support a future Design Critic as an input layer, but not sufficient to authorize Design Critic automatically. The next capability requires a separate explicit Product Owner order.

## 20. Git and execution policy

A15 requires one coherent local Web commit only. No push, PR, merge or deployment is authorized by this order.

```text
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```
