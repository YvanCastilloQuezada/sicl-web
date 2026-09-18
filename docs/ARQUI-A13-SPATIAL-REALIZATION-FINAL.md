# SiMS-DeI — ARQUI A13
# Spatial Organization and Generative Intent

## Estado

**IMPLEMENTED LOCALLY / PASS_WITH_OBSERVATIONS**

A13 composes the existing A11 architectural problem and A12 strategy/parti layers into a derived spatial organization read model. It does not create a second design engine, a new canonical entity, or an autonomous design workflow.

## Trace

`A11 INTENT → A12 STRATEGY → A12 PARTI → A13 SPATIAL ORGANIZATION → A13 GENERATIVE INTENT`

Each derived organization preserves strategy provenance and records spatial units, relationships, program zones, access, circulation, mass/void structure, vertical organization, site anchors, orientation intent, unresolved elements, and capability requirements.

## Spatial model

The model uses derived hypotheses at SITE, BUILDING, MASS, and SPACE scales. It represents site, building organization, public/private zones, access, circulation, and strategy-specific mass/void or vertical elements. Relationships are explicit and typed as `CONTAINS`, `CONNECTED`, `SEPARATED`, `SURROUNDS`, or `ACCESSIBLE_FROM`.

## Epistemic and authority boundaries

All spatial units and relationships are marked `HYPOTHESIS`; generative intents are marked `DERIVED`. A13 preserves `PENDING_HUMAN_AUTHORITY`, `noDecision`, `noWinner`, `noGeometryMutation`, and `noExecution`. It does not claim architectural causality, real geometry, regulatory compliance, or autonomous synthesis.

A13 is a spatial organization bridge for human review, not a replacement for P3, P6, P8, the Core contract, or the deterministic spatial generator.

## UI integration

The derived organization is displayed inside the existing ARQUI Context Panel. The panel reports unit, relation, and intent counts per strategy, coherence, partial realizability, provenance boundaries, and the pending human-authority state. New visible strings are catalogued for all eight declared languages.

## Validation

| Gate | Result |
|---|---|
| A13 focused test | PASS — 1 test |
| Full Web suite | PASS — 40 test files / 209 tests |
| TypeScript | PASS |
| Vite build | PASS |
| `git diff --check` | PASS |
| Core changes | NONE |
| Geometry mutation | NONE |
| Decision/winner creation | NONE |
| Push / merge / deploy | NOT EXECUTED |

The build retains the existing warning about chunks larger than 500 kB; it is non-blocking and unrelated to A13.

## Future-compatible boundary

Future work may attach canonical spatial geometry, metrics, validated program data, human-confirmed relationships, and controlled realization. Those capabilities require separate authorization and must reuse existing engines rather than introduce parallel reasoning systems.

**A13 FINAL STATUS = PASS_WITH_OBSERVATIONS**
