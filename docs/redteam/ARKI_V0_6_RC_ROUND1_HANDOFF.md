# ARKI v0.6 RC — RED TEAM ROUND 1 HANDOFF

Status: RED_TEAM_ROUND_1
Canonical candidate SHA: `2ff81d9dbf378269a1de210daa65e85905558dac`
Canonical branch: `feat/e2e002-spatial-reasoning-phase1`
Red Team branches:
- Qwen: `redteam/qwen/e2e002-phase1`
- DeepSeek: `redteam/deepseek/e2e002-phase1`

## Mission

Attempt to falsify ARKI v0.6 RC. Do not confirm the implementation by inspection alone. Construct executable counterexamples wherever possible.

Round 1 is independent: do not use or inspect the other Red Team's findings before issuing the first verdict.

## Zero-debt doctrine

> No dejar para mañana aquello que sabemos que debe quedar correcto hoy. No construir hoy aquello cuya verdad sólo podremos conocer mañana.

A defect is debt when it is reproducible, fixable with current knowledge, belongs to the scope being frozen, and would remain in the frozen system if left unresolved.

Do not classify legitimate UNKNOWN, FUTURE/EVOLUTION, or explicit current-scope LIMITATION as debt merely because later phases can extend them. Conversely, a freeze/contract label does not excuse a demonstrated defect.

## Evidence already observed on this exact SHA

GitHub Actions:
- SICL Web CI #373: SUCCESS.
  - TypeScript check: SUCCESS.
  - tests: SUCCESS.
  - production build: SUCCESS.
- ARKI E2E-002 Phase 1 Canary #19: SUCCESS.
  - audited SHA verification: SUCCESS.
  - E2E-002 Phase 1 tests: SUCCESS.
  - D-2 boundary regression: SUCCESS.
  - AGK regression: SUCCESS.
  - Capability Fabric regression: SUCCESS.
- ARKI COMPAS Capability Canary #108/#109: SUCCESS, including pinned runtime identity and strict Capability Fabric canary.

This evidence is not a reason to trust the candidate. Attack it.

## Exceptional reopening to audit

Capability Fabric had been frozen. Full CI exposed seven reproducible TypeScript defects. The frozen surface was reopened in a controlled way to remove real known debt instead of preserving a knowingly non-compiling state.

Audit especially whether these corrections changed runtime or authority semantics:
- COMPAS transport promise typing.
- Capability operation literal typing.
- graph node typing.
- Set normalization compatibility.
- repaired import from `server/capabilityFabric/parametricGraphIr.ts` to canonical `server/arkiParametricRuntime.ts`.
- explicit TypeScript target ES2022.

Reject any change that creates an authority bypass, second canonical truth, provider self-selection, geometry authority leak, or hidden regression.

## Mandatory attack families

1. D-2 authority bypass and candidate self-promotion.
2. False regulatory/project authority.
3. UNKNOWN collapsing into certainty or NOT_APPLICABLE.
4. Applicability envelope edge cases.
5. Metric NaN/Infinity/negative/incoherent area semantics.
6. Shallow/deep mutation, alias mutation, post-seal execution mutation.
7. Solver declaration/envelope integrity and post-facto reclassification.
8. Deterministic/seeded/nondeterministic reproducibility claims.
9. Generation trace semantic hashing, including irrelevant event IDs.
10. UNSAT/MUS duplicate, subset and completeness semantics.
11. PARTI interpretation mutation/provenance.
12. Candidate lifecycle and stale-baseline behavior required by current scope.
13. Exception authorization behavior required by current scope.
14. Preliminary geometry escaping into canonical/AGK authority.
15. Capability Fabric provider selection: 0/1/multiple/explicit-unavailable.
16. COMPAS provider result-contract spoofing.
17. Cross-boundary D-2 → spatial reasoning → AGK invariants.
18. TypeScript/build/runtime regression caused by the controlled reopening.

## Rules of engagement

- Work only on your assigned Red Team branch.
- You may add tests, attack harnesses, instrumentation and proof-of-concept mutations.
- Do not modify the canonical branch.
- Do not merge.
- Do not weaken tests, tsconfig, CI gates, authority checks or existing invariants to manufacture a pass.
- A finding must include a reproducible counterexample or exact static proof path.
- Severity is secondary to reproducibility.
- Preserve successful attacks as tests on the Red Team branch.
- If no defect is found, say exactly what was attacked and what evidence was observed.

## Required finding schema

For every finding:
- ID
- claim
- scope
- precondition
- exact reproduction
- expected invariant
- observed result
- evidence
- current-scope classification: DEBT | UNKNOWN | FUTURE_EVOLUTION | LIMITATION
- proposed minimal correction (do not apply to canonical)
- regression test that would prevent recurrence

## Required final verdict

Return:
- audited SHA
- Red Team branch HEAD
- tests/commands actually executed
- CRITICAL / MAJOR / MINOR reproducible findings
- rejected attack hypotheses
- UNKNOWN/FUTURE items kept outside debt and why
- authority-boundary status
- reproducibility status
- controlled Capability Fabric reopening status
- FULL_CI evidence status
- KNOWN_FIXABLE_DEBT count
- READY_FOR_V0_6_FREEZE = YES | NO

A YES requires zero known reproducible fixable defects inside v0.6 freeze scope.
