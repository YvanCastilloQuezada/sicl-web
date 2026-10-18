# ARKI Predictive Architecture 001 · S2 Evidence

**Verdict:** `COST_INTELLIGENCE_PARTIAL`

## Baseline recovered

The workspace was resumed from checkpoint `661483ee5524062c8dc72fb7919e2eb2625172b4`. The active branch was `feature/arki-native-generator-v1`; the same commit was present on `origin/main` and `user_github/main`. The checkpoint already contained the S2 cost engine, Design Funnel S1, CCF Finance integration, and the earlier automated validation. Eight pre-existing PNG renders were untracked and were restored unchanged after the safe checkpoint operation.

## Work completed after resumption

The S2 Design Funnel was reconciled with the Product Owner's foundational interaction law without rebuilding the cost engine, CCF, router, or App architecture. The workspace now expresses the semantic three-panel contract:

- **LEFT = COST:** stage-aware comparison for 16, 4, or 1 candidates.
- **CENTER = ARCHITECTURE:** architectural representations only, with display identifiers `P1…P16`; technical candidate IDs remain internal.
- **RIGHT = DETAIL:** contextual information for the active proposal, including supported geometry metrics, evidence, provenance, unknowns, and economic context.

Selection is synchronized in both directions in the implementation: selecting a proposal in the left cost panel activates it in the center and right inspector; selecting a proposal in the center activates the same proposal in the left and right panels. The center no longer renders cost, scores, Pareto information, technical state, telemetry, or provenance alongside the architectural representation.

The selected-development action now makes the stale-to-recalculate transition visible and preserves the generated `CostDelta` in the right inspector. The prior estimate is marked `STALE`; recalculation creates a new estimate and records the absolute delta, percentage delta, design revision reference, and evidence references.

## App.tsx reconciliation

No App.tsx conflict existed in the recovered actual workspace. The file was inspected directly and had no `<<<<<<<`, `=======`, or `>>>>>>>` markers. Therefore, no blind replacement or unrelated App.tsx modification was made.

## Automated validation

| Check | Result |
|---|---|
| `pnpm check` | PASS |
| Focused S2 tests | PASS — 16/16 |
| Focused S1 + S2 tests | PASS — 24/24 |
| Full regression `pnpm test -- --reporter=dot` | PASS — 95 files, 429 tests |
| `pnpm build` | PASS |
| `git diff --check` | PASS |
| Conflict marker scan | PASS |
| Mutation guards in S2 suite | PASS — identity, missing evidence, no automatic winner |
| CostDelta and stale guards | PASS — covered by S2 tests and connected in UI code |

## Visual verification

The local browser reached the actual application authentication gate and displayed `Cargando Architectural Intelligence Workspace…`. No credentials or security bypass were used. Consequently, browser-level clicks through stages 16, 4, and 1 and live LEFT↔CENTER↔RIGHT synchronization could not be completed in this session. The captured fallback screenshot is included as evidence of the blocker.

This is why the verdict is `COST_INTELLIGENCE_PARTIAL` rather than `COST_INTELLIGENCE_VERIFIED_FOR_BOUNDED_SCOPE`. The implementation and automated contracts are validated, but the authenticated browser interaction evidence remains pending.

## Controls audited in scope

The modified S2 controls are: proposal selection from the center, proposal selection from the left cost comparison, 16→4 promotion, deep evaluation, 4→1 selection, reversible return to Final Four, geometry propagation/recalculation, stale marking, and CostDelta display. Controls not modified by this closure were not globally audited, in accordance with the order's scope restriction.

## Unknowns and limitations

The S2 engine uses bounded conceptual reference prices with `ASSUMED` provenance; it is not a market quotation database, S10/APU system, final budget, professional quantity takeoff, construction price, or signed technical document. The UI must not claim the target uncertainty bands unless evidence supports them; actual ranges remain visible. Authentication is required for browser-level verification. No global UI audit, new capability, external integration, security bypass, dependency upgrade, or GitHub push was performed.

## Evidence files

The accompanying ZIP contains the changed Design Funnel page, S1/S2 contracts and tests, the existing S2 evidence, the recovered baseline notes, the browser fallback screenshot, and the exact validation summary. The SHA-256 sidecar is generated alongside the ZIP.
