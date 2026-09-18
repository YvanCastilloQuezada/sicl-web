# SiMS-DeI — ARQUI A17
# Human-Authorized Design Revision and Re-Evaluation Loop

## Final status

```text
A17 = PASS_WITH_OBSERVATIONS
REVISION_LOOP = PASS
HUMAN_AUTHORITY = PRESERVED
REAL_GATE = NOT_TRIGGERED
```

A17 compone A14, A15, A16, P8 y P9 para demostrar un ciclo controlado:

```text
A16 FINDING
→ HUMAN HYPOTHESIS SELECTION
→ CAPABILITY CHECK
→ PREPARE
→ HUMAN EXECUTION AUTHORIZATION
→ EXISTING CANONICAL OPERATION
→ ACTUAL GEOMETRY CHANGE
→ READBACK
→ NEW A15 READING
→ NEW A16 CRITIQUE
→ BEFORE/AFTER TRANSITION
```

No se implementó iteración autónoma, planificación en segundo plano, optimización automática ni un segundo motor de revisión.

## Baseline

| Item | Result |
|---|---|
| Web baseline | `3f5c53ac3dbaf79492da47c98739ae1b3da771ac` |
| Core baseline | `1c416551a945286e3b7fab6a5f01e8852442ea7b` |
| A11–A16 | Reused; not re-executed as phases |
| Core changed | NO |
| Core Contract changed | NO |
| New canonical entity | 0 |
| New operation | NO |
| Frozen systems activated | NO |
| Push / PR / merge / deployment | NO |

## Positive controlled revision proof

The positive case uses the existing Core operation `SET_GAP`, declared `AVAILABLE` by the current operation capability contract.

```text
SOURCE_ALTERNATIVE = UPAO-001-C
SELECTED_HYPOTHESIS = COURTYARD_GAP
CANDIDATE_CAPABILITY = SET_GAP
CAPABILITY_STATUS = SUPPORTED
PARAMETER = mass_separation = 8.0
PARAMETER_PROVENANCE = existing SET_GAP contract + explicit human-editable value
HUMAN_SELECTION_GATE = SELECTED
HUMAN_EXECUTION_GATE = AUTHORIZED
OPERATION = SET_GAP
```

The direct canonical Core runtime produced:

```text
STATUS = EXECUTED
SOURCE_ALTERNATIVE = UPAO-001-C
RESULT_ALTERNATIVE = UPAO-001-C-GDI-47fc22a0
GEOMETRY_CHANGED = TRUE
BEFORE_MASS_COUNT = 2
AFTER_MASS_COUNT = 2
HUMAN_CONFIRMATION_REQUIRED = TRUE
DECISION_CREATED = FALSE
RECOMMENDATION_CREATED = FALSE
```

The result was independently compared through before/after `SpatialRepresentation` serialization. The operation response was not trusted by itself.

## Human authority gates

The two gates remain distinct:

```text
GATE A — HUMAN SELECTS HYPOTHESIS
GATE B — HUMAN AUTHORIZES PREPARED OPERATION
```

The system cannot execute after selection alone. It must reach `PREPARED`, then `AUTHORIZED`, and only then call the existing canonical operation with `human_confirmed = true`.

Missing parameters produce `BLOCKED`; no reasonable architectural value is invented.

## Post-change A15 and A16

After the Core operation returns, A17 reads `after_representation` with a fresh A15 invocation. It then sends that new reading into a fresh A16 invocation. The pre-change reading and critique are not edited or reused as post-change truth.

The A17 plan stores:

- source alternative;
- result alternative;
- independent readback;
- post-change A15 reading;
- post-change A16 critique;
- per-finding transitions.

The transition vocabulary is bounded:

```text
UNCHANGED
RESOLVED
REDUCED
TRANSFORMED
NEW
NO_LONGER_OBSERVABLE
UNKNOWN
```

The system never labels the operation `BETTER`, `IMPROVED` or `OPTIMIZED` merely because geometry changed.

## Unsupported negative proof

The architectural hypothesis remains preserved even when the operation cannot execute:

```text
HYPOTHESIS = CIRCULATION_SPINE
CANDIDATE_CAPABILITY = CREATE_SPINE
CAPABILITY_STATUS = UNSUPPORTED
PREPARATION = BLOCKED
EXECUTION = NONE
```

This proves that critique is not distorted to fit available operations.

## False-success protection

If an execution response reports success but the before/after representation is unchanged, A17 returns:

```text
REVISION = NOT_VERIFIED / BLOCKED
```

It does not claim geometric success from the response status alone.

## Validation

```text
FOCUSED_A17_A14_A15_A16_TESTS = 18 PASSED
FULL_WEB_TEST_FILES = 44 PASSED
FULL_WEB_TESTS = 227 PASSED
TYPESCRIPT = PASS
VITE_BUILD = PASS
git diff --check = PASS
I18N_8_LOCALES = PASS
CORE_SET_GAP_RUNTIME = PASS
```

The initial full validation found a TypeScript target compatibility issue in `Map.keys()` iteration. It was corrected by using `Array.from(...)` without changing A17 semantics. The complete validation was then repeated successfully.

The build retains the existing non-blocking warning for chunks larger than 500 kB. No new dependency was added.

## Required classifications

```text
A17 = PASS_WITH_OBSERVATIONS
REVISION_LOOP = PASS
A16_FINDING_REUSE = PASS
HYPOTHESIS_SELECTION = PASS
CAPABILITY_CHECK = PASS
PARAMETER_PROVENANCE = PASS
HUMAN_SELECTION_GATE = PASS
HUMAN_EXECUTION_GATE = PASS
CONTROLLED_EXECUTION = PASS
REAL_GEOMETRY_CHANGE = PASS
READBACK = PASS
FALSE_SUCCESS_PROTECTION = PASS
POST_CHANGE_A15_READING = PASS
POST_CHANGE_A16_CRITIQUE = PASS
BEFORE_AFTER_COMPARISON = PASS
FINDING_TRANSITION = PASS
NEW_FINDING_HANDLING = PARTIAL / NOT_DEMONSTRATED IN POSITIVE FIXTURE
UNKNOWN_PRESERVATION = PASS
UNSUPPORTED_HYPOTHESIS_PRESERVATION = PASS
NO_AUTOMATIC_IMPROVEMENT = PASS
NO_QUALITY_SCORE = PASS
NO_WINNER = PASS
NO_AUTOMATIC_DECISION = PASS
NO_AUTONOMOUS_LOOP = PASS
NO_BACKGROUND_EXECUTION = PASS
NO_NEW_DESIGN_OPERATION = PASS
TRACEABILITY_A11_A17 = PASS
HUMAN_AUTHORITY = PASS
RENDERER_REUSE = PASS
VISUAL_BROWSER_RUNTIME = NOT_EXECUTED
I18N_8_LOCALES = PASS
RESPONSIVE = PASS_WITH_EXISTING_LAYOUT
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_CANONICAL_ENTITY = 0
REAL_GATE = NOT_TRIGGERED
```

## Central answers

1. **Can A17 consume a real A16 finding?** Yes; the revision plan records the source finding.
2. **Can a human select a hypothesis explicitly?** Yes; selection is a distinct state.
3. **Is selection distinct from execution authorization?** Yes.
4. **Can ARQUI map the selected hypothesis to an existing capability?** Yes; `SET_GAP` is supported.
5. **Does it refuse unsupported hypotheses?** Yes; `CREATE_SPINE` is blocked.
6. **Are parameters traceable?** Yes; the gap parameter is explicit and provenance-labelled.
7. **Can it prepare without executing?** Yes.
8. **Does mutation require authorization?** Yes.
9. **Does canonical geometry change?** Yes, in the controlled Core runtime.
10. **Is execution independently verified?** Yes, by before/after representation comparison.
11. **Does A15 read the new state?** Yes, through a fresh post-change call.
12. **Does A16 critique the new reading?** Yes, through a fresh post-change call.
13. **Are stale readings avoided?** Yes.
14. **Can it identify transitions?** Yes, with bounded statuses.
15. **Can it identify unchanged findings?** Yes.
16. **Can it expose new findings?** The model supports `NEW`; a new-finding positive fixture was not demonstrated in this run.
17. **Does it avoid equating change with improvement?** Yes.
18. **Can it report measurable objective movement?** The composition preserves the channel; no invented target or percentage is created when absent.
19. **Is unsupported intent preserved?** Yes.
20. **Does Human Authority remain final?** Yes.
21. **Is A11→A17 traceable?** Yes.
22. **Did A17 require Core changes?** No.
23. **Was one complete controlled cycle demonstrated?** Yes at the composition/runtime level: design → realize → read → critique → selected revision → modify → read → re-critique.
24. **What remains missing for a stronger general architectural assistant?** Rich program semantics, complete circulation topology, verified regulatory/environmental/economic analysis, broader Design Knowledge critique and architect validation across real projects.
25. **Is this a major local milestone?** Yes. It is suitable for a local GitHub checkpoint, but this order does not authorize publication.

## Commit policy

One coherent local Web commit is created. No push, PR, merge or deployment is performed.
