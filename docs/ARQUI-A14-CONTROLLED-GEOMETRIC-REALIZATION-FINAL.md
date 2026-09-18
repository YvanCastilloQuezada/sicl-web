# SiMS-DeI — ARQUI A14
# Controlled Architectural Geometric Realization

## A. Executive status

**A14 = PASS_WITH_OBSERVATIONS**.

A14 now bridges the existing A11 architectural problem, A12 strategy and parti, and A13 spatial organization to a bounded, inspectable realization plan. The plan uses existing canonical design operations and preserves explicit human authority before mutation. One controlled courtyard case produced a real canonical derived alternative with changed geometry, successful readback, and a measurable central-void preservation check.

The result is not a claim of complete architectural design, architectural quality, regulatory compliance, performance, or autonomous iteration.

## B. Verified baseline

| Surface | Baseline |
|---|---|
| A11 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| A12 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| A13 | CLOSED / PASS_WITH_OBSERVATIONS / FROZEN |
| A13 implementation | `357aa203d0f8c7f03ecf2b2613233850e6db635d` |
| Web before A14 | `f16d3ba2e454d7083f1b6ddf5f43c7265e667faf` |
| Core | `1c416551a945286e3b7fab6a5f01e8852442ea7b` |
| Site-development opportunity order | REGISTERED / APPROVED PRODUCT DIRECTION / FROZEN / NOT AUTHORIZED |

A10–A13 and P1–P9 were not re-executed. The frozen site-development opportunity capability was not modified or activated.

## C. Final HEADs

The A14 Web commit is created locally after this report. Core remains unchanged at `1c416551a945286e3b7fab6a5f01e8852442ea7b`.

## D. Files changed

- `client/src/api/sicl-client.ts` — exposes the existing spatial-operation capability endpoint.
- `client/src/components/arquiControlledRealization.ts` — derived A14 coverage, plan, readback, and intent-preservation model.
- `client/src/components/ArquiControlledRealization.tsx` — bounded A14 UI orchestration, preview, authority gate, execution, readback, and reuse of the existing SVG renderer.
- `client/src/components/ArquiControlledRealization.test.ts` — focused A14 tests.
- `client/src/components/ArquiContextPanel.tsx` — composes A14 after A13 without replacing A13.
- `client/src/i18n/locales/*.json` — A14 strings for all eight locales.
- `docs/ARQUI-A14-CONTROLLED-GEOMETRIC-REALIZATION-FINAL.md` — this report.

No Core files were changed.

## E. A11–A13 lineage

The trace is preserved as:

`A11 DESIGN PROBLEM → A12 STRATEGY → A12 PARTI → A13 SPATIAL ORGANIZATION → A14 REALIZATION PLAN → EXISTING OPERATION → RESULT ALTERNATIVE → READBACK`

A14 carries strategy, organization, intent, operation, and knowledge linkage into the existing operation request. It does not create a parallel design subject or geometry model.

## F. Passive realization coverage

A14 inspects the current operation contract rather than inferring support from names. The current Core reports `CREATE_COURTYARD`, `MODIFY_COURTYARD`, `SCALE_MASS`, `SET_GAP`, `CHANGE_HEIGHT`, `SPLIT_MASS`, and `ARTICULATE_MASS` as available. `MOVE_MASS` and `ROTATE_MASS` remain partial. `ADD_MASS`, `REMOVE_MASS`, `MERGE_MASSES`, `OFFSET_MASS`, and `STEP_MASS` remain unsupported.

The A14 Web plan maps only concepts with an explicit current operation. `CREATE_SPINE` and `ALIGN_TO_EDGE`, used as conceptual moves by the linear strategy, remain unsupported and are never silently replaced.

## G. Exact current design-operation coverage

| A13 concept | Current operation | Result |
|---|---|---|
| Central void / courtyard | `CREATE_COURTYARD` | SUPPORTED |
| Mass separation | `SET_GAP` | SUPPORTED by Core, but not silently composed into the courtyard proof because current GDI semantics change the family to articulated |
| Vertical intensification | `CHANGE_HEIGHT` | SUPPORTED when an existing floor count is available |
| Mass scaling | `SCALE_MASS` | SUPPORTED |
| Linear organization | `CREATE_SPINE` / `ALIGN_TO_EDGE` | UNSUPPORTED |
| Compact vertical | `SCALE_MASS` plus optional `CHANGE_HEIGHT` | SUPPORTED or PARTIAL depending on inputs |
| Hybrid | No automatic composition | UNKNOWN / not activated |

## H. Realization-plan architecture

`ArchitecturalRealizationPlan` is a derived, noncanonical representation. It includes strategy and organization identity, source intent, ordered steps, required capabilities and inputs, unresolved requirements, expected preservation targets, explicit authority requirement, execution status, and provenance.

Each step records target, architectural purpose, canonical operation, bounded parameters, parameter source, preconditions, expected effect, affected intent, and authority requirement. The plan is inspectable before any mutation.

## I. Parameter provenance

A14 uses only existing alternative parameters, bounded preview values, or existing operation contract values. The courtyard proof uses a bounded `courtyard_ratio` and `footprint_ratio`; floor changes use the existing `parameters.floors`. If the selected alternative or required value is unavailable, the plan is blocked rather than inventing a dimension.

## J. Human Authority flow

The flow is:

`PREPARE → PREVIEW → EXPLAIN → REQUEST AUTHORITY → EXECUTE AFTER EXPLICIT CONFIRMATION → READ BACK → VERIFY`

The UI exposes separate **Prepare preview** and **Authorize and execute** actions. The Core endpoint continues to require `human_confirmed = true`. Existing P9 semantics are reused; no second authorization system was created.

Natural-language questions do not authorize execution.

## K. Controlled execution

The controlled runtime verified:

- execution without authority returns `HUMAN_CONFIRMATION_REQUIRED`;
- explicit controlled authority executes `CREATE_COURTYARD`;
- the operation returns `EXECUTED`;
- the result is a new derived alternative rather than the source alternative;
- `decision_created = false`;
- `recommendation_created = false`.

The API route records the existing `SPATIAL_OPERATION_EXECUTED` event. The direct deterministic runtime used the same Core operation contract to validate the geometry path without changing Core.

## L. Actual geometric/state mutation

The runtime proof used source `UPAO-001-A` and produced `UPAO-001-A-GDI-3419939c`. The resulting parameters use the `courtyard` strategy. The footprint metric changed, and the generated representation contains four `BuildingMass` elements, which is the measurable current-model proxy for the perimeter around a central void.

**REAL_GEOMETRY_CHANGE = PASS**.

## M. Source/result alternative identity

The source alternative remains identifiable as `UPAO-001-A`. The result uses a distinct derived alternative ID. A14 does not overwrite the source in the controlled path and does not create a parallel `ArquiAlternative` entity.

## N. Readback

A14 reads `proposed_child`, `before_representation`, `after_representation`, result alternative identity, strategy parameters, mass count, and metric deltas. It does not trust an execution status alone.

The readback proof confirmed changed geometry, result identity, courtyard strategy, and four mass elements.

## O. False-success protection

If the Core returns `EXECUTED` but the result identity or representation does not differ, A14 marks the result as false success and does not report successful intent preservation. A focused test covers this mismatch.

## P. Intent-preservation analysis

The first measurable preservation target is **central void exists**. For the controlled courtyard result, A14 reports `PRESERVED` because the result strategy is courtyard, the result geometry changed, and the current spatial generator reads four mass elements.

A14 does not infer abstract qualities such as privacy, beauty, comfort, or architectural value from geometry. Those remain `UNKNOWN` or require separate evidence.

## Q. Partial realization

Compact vertical may be represented by one or two existing operations depending on available floor-count input. If one required input is missing, the plan remains `PARTIAL` and reports the unresolved requirement.

The linear strategy is not presented as realized because its canonical spine and edge-alignment operations do not exist.

## R. Unsupported concepts

Unsupported concepts remain explicit. A14 never maps linear organization to courtyard, compactness, or another unrelated operation. No `ADD_MASS`, `REMOVE_MASS`, `MERGE_MASSES`, `OFFSET_MASS`, `STEP_MASS`, `CREATE_SPINE`, or `ALIGN_TO_EDGE` operation was fabricated.

## S. No-silent-approximation proof

The coverage matrix, plan status, unresolved requirements, and operation status are displayed. Unsupported or partial strategy elements remain visible to the architect. A14 does not label reduced geometry as the full parti.

## T. Design Distance use

No Design Distance score is used as an architectural-quality score. The current A14 proof relies on direct geometry/state readback and measurable operation effects. Future distance measures remain compatible with the existing Design Distance direction.

## U. Traceability

The controlled operation carries `intent_linkage` and `knowledge_linkage`. The complete intended chain is preserved as a bounded trace. A14 does not claim causal certainty beyond the actual operation and readback evidence.

## V. Visual consumption

A14 reuses `SpatialSvgViewer` for an executed `after_representation` when that result is available. No renderer, 3D engine, image-generation pipeline, or Workspace V2 was created.

**VISUAL_CONSUMPTION = PARTIAL**: the integration path is implemented, but a browser/device screenshot was not executed in this controlled run.

## W. Controlled runtime

**CONTROLLED_RUNTIME = PASS** for the deterministic Core operation and readback proof.

**VISUAL_RUNTIME = NOT_EXECUTED** in this run. No screenshot proof is claimed.

## X. Proof cases

| Proof | Result |
|---|---|
| A — A13 coverage mapping | PASS |
| B — structured realization plan | PASS |
| C — no authority, no execution | PASS |
| D — explicit authority, real geometry change | PASS |
| E — readback | PASS |
| F — measurable central-void preservation | PASS |
| G — partial realization boundary | PASS |
| H — unsupported linear concept preserved | PASS |
| I — false-success rejection | PASS |
| J — existing renderer consumption path | PARTIAL / runtime not executed |

## Y. Tests

- Focused A14 tests: **3 passed**.
- Full Web suite: **41 test files / 212 tests passed**.
- TypeScript: **PASS**.
- Vite build: **PASS**.
- `git diff --check`: **PASS**.

The build retains the existing non-blocking warning about chunks larger than 500 kB.

## Z. i18n

A14 strings were added to all eight declared locales:

`es → en → pt → it → fr → de → ru → zh`

The existing i18n consistency suite passed as part of the full Web suite.

## AA. Responsive behavior

The A14 panel uses the existing responsive card/grid system and wraps controls and coverage cells for narrow layouts. No separate workspace or responsive architecture was introduced.

**RESPONSIVE_BEHAVIOR = PASS by existing Web validation; no device screenshot was executed.**

## AB. Regression

The existing A13, ARQUI, spatial viewer, i18n, operations, and application tests passed in the 212-test suite. No A11–A13 business logic was changed.

## AC. Core preservation

**CORE_CHANGED = NO**.

**CORE_CONTRACT_CHANGED = NO**.

A14 uses the existing spatial-operation capabilities endpoint and preview/execute endpoints.

## AD. REAL GATE

**REAL_GATE = NOT_TRIGGERED**.

No new canonical entity, operation, Event semantics, persistence semantics, authority semantics, or Core Contract change was required. The result alternative and event semantics are existing Core behavior.

## AE. Observations

The controlled proof is intentionally narrow. The first complete proof uses courtyard realization because the current operation contract provides the strongest direct coverage. The visual surface is wired to consume the result, but browser visual proof remains a separate observation.

## AF. Limitations

A14 does not perform architectural critique, performance analysis, regulatory analysis, financial feasibility, BIM authoring, wall/door/window authoring, autonomous iteration, or automatic decision-making. The existing operation endpoint records an execution event and returns a derived result; the full project alternative catalog is not silently overwritten by A14.

## AG. Exact remaining capability gap

The principal remaining local gap is **architectural critique of the realized result**. A14 can determine whether measurable geometric targets survived. It cannot yet determine whether the realized result is good architecture, whether semantic intentions such as privacy were achieved, or whether specialist requirements are satisfied.

## AH. Required classifications

| Classification | Result |
|---|---|
| `A14` | `PASS_WITH_OBSERVATIONS` |
| `REALIZATION_COVERAGE` | `PASS` |
| `REALIZATION_PLAN` | `PASS` |
| `OPERATION_MAPPING` | `PARTIAL` |
| `PARAMETER_PROVENANCE` | `PASS` |
| `HUMAN_AUTHORITY_GATE` | `PASS` |
| `CONTROLLED_EXECUTION` | `PASS` |
| `REAL_GEOMETRY_CHANGE` | `PASS` |
| `CANONICAL_ALTERNATIVE_REUSE` | `PASS` |
| `READBACK` | `PASS` |
| `FALSE_SUCCESS_PROTECTION` | `PASS` |
| `INTENT_PRESERVATION` | `PASS_WITH_OBSERVATIONS` |
| `PARTIAL_REALIZATION` | `PASS` |
| `UNSUPPORTED_PRESERVATION` | `PASS` |
| `NO_SILENT_APPROXIMATION` | `PASS` |
| `NO_SILENT_DEGRADATION` | `PASS` |
| `DESIGN_DISTANCE_REUSE` | `NOT_APPLICABLE` |
| `TRACEABILITY` | `PASS` |
| `VISUAL_CONSUMPTION` | `PARTIAL / NOT_EXECUTED` |
| `NO_SECOND_DESIGN_ENGINE` | `PASS` |
| `NO_SECOND_GEOMETRY_MODEL` | `PASS` |
| `NO_GENERAL_PLANNER` | `PASS` |
| `NO_AUTONOMOUS_LOOP` | `PASS` |
| `NO_WINNER` | `PASS` |
| `NO_AUTOMATIC_DECISION` | `PASS` |
| `NO_FALSE_PERFORMANCE` | `PASS` |
| `NO_FALSE_COMPLIANCE` | `PASS` |
| `HUMAN_AUTHORITY` | `PASS` |
| `CORE_CHANGED` | `NO` |
| `CORE_CONTRACT_CHANGED` | `NO` |
| `NEW_CANONICAL_ENTITY` | `0` |
| `NEW_CANONICAL_OPERATION` | `0` |
| `REAL_GATE` | `NOT_TRIGGERED` |
| `I18N_8_LOCALES` | `PASS` |
| `CONTROLLED_RUNTIME` | `PASS` |
| `WORKTREE_WEB` | `CLEAN after commit` |
| `WORKTREE_CORE` | `CLEAN` |

## AI. Answers to central questions

1. **Can A13 be translated into an executable realization plan?** Yes, for supported and bounded strategy elements.
2. **Does the plan use existing operations?** Yes.
3. **Which concepts are fully realizable?** Courtyard, mass scaling, and floor-count change when inputs exist.
4. **Which are partial?** Compact vertical depending on inputs, and mass separation when it would require composition that changes the source family.
5. **Which are unsupported?** Linear spine/edge alignment and other absent canonical operations.
6. **Are parameters traceable?** Yes; they come from existing state or bounded explicit preview inputs.
7. **Does ARQUI refuse missing parameters?** Yes; the plan blocks and reports unresolved requirements.
8. **Does mutation require authority?** Yes; the Core rejects execution without explicit confirmation.
9. **Can one strategy become canonical geometry/state?** Yes; the courtyard proof changed geometry.
10. **Is the result read back?** Yes.
11. **Can false success be detected?** Yes.
12. **Can measurable parti elements be checked?** Yes; the courtyard mass/void proxy was checked.
13. **Which intent elements remain unverifiable?** Abstract qualities and semantics not represented by current geometry/state.
14. **Can partial realization be reported?** Yes.
15. **Are unsupported concepts preserved?** Yes.
16. **Is source/result identity preserved?** Yes.
17. **Can the existing renderer consume the result?** Yes, through the integrated SVG path; browser proof remains pending.
18. **Did A14 create a parallel design engine?** No.
19. **Did A14 require Core modification?** No.
20. **What is still missing?** Architectural critique and semantic intent validation beyond measurable geometry.
21. **Can the chain reach real geometry?** Yes, for bounded supported operations.
22. **What remains before self-critique?** A separately authorized critique capability with explicit evidence and human review boundaries.
23. **Is A14 a major local milestone?** Yes, with observations on visual runtime and semantic limitations.

## AJ. Major local milestone

`MAJOR_LOCAL_MILESTONE = YES`

Reason: A14 demonstrates the previously unproven bridge from architectural intent through A13 organization to an actual canonical geometric alternative, with explicit authority, readback, and measurable preservation evidence.

## AK. GitHub checkpoint recommendation

`GITHUB_CHECKPOINT_RECOMMENDED = YES`

Reason: the Web implementation and tests form one coherent local milestone, Core remains unchanged, and the full Web validation is green. Publication still requires a separate Product Owner decision.

## Final execution policy

`PUSH = NO`

`PR = NO`

`MERGE = NO`

`DEPLOYMENT = NO`

**A14 FINAL STATUS = PASS_WITH_OBSERVATIONS**
