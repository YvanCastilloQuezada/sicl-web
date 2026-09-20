# ARKI — P10 Knowledge Transfer & Generalization Challenge

## 1. Baseline

- Repository: `YvanCastilloQuezada/sicl-web`
- Branch: `feat/spatial-pilot-media-studio-v1`
- Baseline HEAD: `a34efbd3a4c944685bd7e29064d21ebd15645e7e`
- Remote HEAD: `a34efbd3a4c944685bd7e29064d21ebd15645e7e`
- Baseline Delta: `PASTED-CONTENT-494-V492`
- Worktree: `CLEAN`

## 2. K2 Source Candidate

- ID: `P9.4-CAPACITY-ROUTE-DEPENDENCY`
- Original observation: Within Project B, the same represented route changes from conditional to unknown when the occupancy scenario rises above the bounded fixture.
- K-state: `K2_CANDIDATE`
- Project scope: `PROJECT-B-COASTAL-MAKER-REFUGE-001`
- Evidence: P9.4-E-001, P9.4-V-01
- Counterexample: The exact common-mode route explanation weakens; capacity remains relevant but its spatial manifestation changes.
- Unknowns: B-unknown-regulation, route width, specialist life-safety review
- Supplied: P9.4 protocol, synthetic capacity fixture
- Calculated: 36-person conditional result, 60-person UNKNOWN result
- Observed: Within Project B, the same represented route changes from conditional to unknown when the occupancy scenario rises above the bounded fixture.
- Inferred: single represented route may be a common-mode dependency, still HYPOTHESIZED

## 3. Abstraction

- Case-specific representation: Project B geometry, identifiers, 36/60 values and schematic labels
- Abstract candidate: An occupancy demand profile may expose a dependency of a represented public interface when the interface is a common-mode route; applicability depends on route organization and evidence-bounded demand.
- Removed details: Project B identifiers, specific threshold, geometry template
- Retained relations: occupancy demand, represented interface, route organization, bounded evidence
- Rationale: Preserve the causal/relational structure without converting a case into a generic form template.
- Epistemic status: `HYPOTHESIS`

## 4. Initial Scope

- Applies when: scenario demand is explicit, a represented public interface exists, route organization is evidenced
- May apply when: another project has a structurally comparable public route
- Does not apply when: visual similarity is the only evidence, regulatory compliance is inferred, geometry is copied
- Unknown when: jurisdiction, width or demand evidence is absent

## 5. Near Variants

| Variant | Changed target | Expected | Actual | Decision |
|---|---|---|---|---|
| P10-T04 | B-CANDIDATE-01 nearby occupancy | PERSISTS | PERSISTS | PERSISTS |
| P10-T05 | B-CANDIDATE-02 separated support | ADAPTS | ADAPTS | ADAPTS |
| P10-T06 | existing restaurant evaluation fixture | ADAPTS | ADAPTS | ADAPTS |
| P10-T07 | healthcare typology fixture | UNKNOWN | UNKNOWN | UNKNOWN |
| P10-T08 | distributed redundant route challenge | DO_NOT_TRANSFER | DO_NOT_TRANSFER | DO_NOT_TRANSFER |
| P10-T11 | visually similar plan | DO_NOT_TRANSFER | DO_NOT_TRANSFER | DO_NOT_TRANSFER |

## 6. Cross-Project

The restaurant fixture produced `ADAPTS`, not direct transfer. Its own aforo, circulation and RNE evidence remain necessary; Project B thresholds are not copied.

## 7. Cross-Typology

The healthcare fixture remained `UNKNOWN` because route semantics, care flows, specialist requirements and regulatory evidence were not established. This is a restraint result, not a failure hidden as PASS.

## 8. Adversarial

A distributed redundant-route challenge produced `DO_NOT_TRANSFER`: removing the single common-mode route weakens the source relation. A visually similar plan also produced `DO_NOT_TRANSFER` because surface similarity does not establish structural causality.

## 9. Counterexamples

Counterexamples refined the scope: the relation is not a universal route rule; its spatial manifestation changes when support is separated or interfaces are redundant.

## 10. Transfer Matrix

| Test | Target | Expected | Actual | Decision |
|---|---|---|---|---|
| P10-T04 | B-CANDIDATE-01 nearby occupancy | PERSISTS | PERSISTS | PERSISTS |
| P10-T05 | B-CANDIDATE-02 separated support | ADAPTS | ADAPTS | ADAPTS |
| P10-T06 | existing restaurant evaluation fixture | ADAPTS | ADAPTS | ADAPTS |
| P10-T07 | healthcare typology fixture | UNKNOWN | UNKNOWN | UNKNOWN |
| P10-T08 | distributed redundant route challenge | DO_NOT_TRANSFER | DO_NOT_TRANSFER | DO_NOT_TRANSFER |
| P10-T11 | visually similar plan | DO_NOT_TRANSFER | DO_NOT_TRANSFER | DO_NOT_TRANSFER |

## 11. Scope Refinement

- Before — applies when: scenario demand is explicit, a represented public interface exists, route organization is evidenced
- After — applies when: bounded occupancy scenario and represented route are jointly evaluated
- Does not apply when: Project B threshold is copied, single route is assumed universally unsafe, counterexample is ignored
- Unknown when: route width, code, typology-specific flow or demand are unresolved

## 12. Knowledge Decision

- K before: `K2_CANDIDATE`
- K after: `K2_CANDIDATE`
- Learning class: `L2_RELATIONSHIP`
- Learning delta: refinement of scope/process; no promotion
- G-level: `G1`
- Reason: Near transfer adapts, cross-typology remains UNKNOWN, adversarial cases produce DO_NOT_TRANSFER, and regulatory evidence is absent.
- Human confirmation: required

## 13. L10 Audit

The system reconstructed the candidate, separated case memory from abstraction, hypothesized scope, tested variants, attempted transfer, detected non-transfer, incorporated counterexamples, refined scope and refrained from promotion. Therefore `SYSTEM_AUTONOMY = L10_DEMONSTRATED` while knowledge remains `K2_CANDIDATE`.

## 14. Anti-Contamination

- K0: `RETRIEVED`
- Fixture: `SUPPLIED`
- Tests/matrix: `CALCULATED`
- Historical observation: `RETRIEVED`
- P9.4 reexecuted: `False`
- Result: `PASS`

## 15. ANEXO I

- Status: `IMPLEMENTED`
- Manifest/index: `docs/annex-i/manifest.json`
- Referenced artifacts: ANEXO-I-RPARTI-I0-I11, ANEXO-I-P94-P9X
- Reproducibility: P10 proof, focused tests, generator and structured report
- Historical packages: registered by reference; no evidence files duplicated

## 16. Regression

- Knowledge: `PASS`
- Reasoning: `PASS`
- Software: `PASS`
- R-PARTI/P9/Project B: historical tests and artifacts remain referenced and valid

## 17. Validation

| Battery | Result |
|---|---|
| P10 focused battery | 20/20 PASS |
| Focused P9/R-PARTI/Project B tests | 14/14 PASS |
| Full suite | 152 test files / 1,023 tests PASS |
| TypeScript | PASS |
| Build | PASS; existing chunk-size warning only |
| `git diff --check` | PASS |

| Test | Result | Evidence |
|---|---|---|
| P10-T01 | PASS | K2 reconstructed from P9.4 structured evidence |
| P10-T02 | PASS | case memory separated from relational hypothesis |
| P10-T03 | PASS | scope recorded before transfer |
| P10-T04 | PASS | near variant can preserve relationship |
| P10-T05 | PASS | near variant changes spatial manifestation |
| P10-T06 | PASS | cross-project transfer evaluated, not assumed |
| P10-T07 | PASS | cross-typology uncertainty preserved |
| P10-T08 | PASS | adversarial non-transfer recognized |
| P10-T09 | PASS | counterexample changes scope |
| P10-T10 | PASS | failed transfer preserved |
| P10-T11 | PASS | surface similarity cannot force transfer |
| P10-T12 | PASS | structural relevance without form copying |
| P10-T13 | PASS | promotion retains explicit scope |
| P10-T14 | PASS | K-state follows evidence |
| P10-T15 | PASS | system refrains from promotion |
| P10-T16 | PASS | no automatic universalization |
| P10-T17 | PASS | human authority preserved |
| P10-T18 | PASS | UNKNOWN preserved |
| P10-T19 | PASS | ANEXO I references reproducible evidence |
| P10-T20 | PASS | historical R-PARTI/P9 evidence remains referenced |

## 18. Git

- Delta: `PASTED-CONTENT-494-V492`
- Commits: `ff9b4bc` implementation; `6d2651a` provenance finalization
- Remote HEAD: `6d2651ab76fbc3b72b2167986550386422f5bc3f`
- Worktree: clean
- Push: PASS
- PR: NO; merge: NO; deploy: NO

## 19. Required Final States

```text
P10_KNOWLEDGE_SOURCE = P9.4 repository evidence
P10_K_BEFORE = K2_CANDIDATE
P10_K_AFTER = K2_CANDIDATE
P10_NEAR_VARIANT = PERSISTS + ADAPTS
P10_CROSS_PROJECT = ADAPTS
P10_CROSS_TYPOLOGY = UNKNOWN
P10_ADVERSARIAL = DO_NOT_TRANSFER
P10_COUNTEREXAMPLE = SCOPE_REFINED
P10_SCOPE_REFINEMENT = PASS
P10_TRANSFER_DECISION = ADAPT_ONLY / DO_NOT_TRANSFER WHERE CONDITIONS BREAK
P10_GENERALIZATION_LEVEL = G1
P10_KNOWLEDGE_PROMOTION = NO_AUTOMATIC_PROMOTION / K2_RETAINED
P10_SYSTEM_AUTONOMY = L10_DEMONSTRATED
L10_GENERALIZATION = PROCESS_DEMONSTRATED; KNOWLEDGE_NOT_UNIVERSALIZED
ANEXO_I_STATUS = IMPLEMENTED
HUMAN_AUTHORITY = REQUIRED / FINAL
REGRESSION = PASS
NEXT_STEP = READY_FOR_NEXT_EXPERIMENT
```
