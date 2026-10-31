# ARKI Design Funnel 9 → 4 → 1

**Status:** PO-directed contract revision, 2026-10-31  
**Version:** `ARKI-PREDICTIVE-ARCHITECTURE-001.S2`  
**Working ref:** `po-recovery-copy-20261031`

## Product decision

The former 16 → 4 → 1 funnel is replaced in this recovery workspace by **9 → 4 → 1**. The reduction is a usability and review-load decision. It does not relax architectural quality, evidence, provenance, or human-authority requirements.

## Canonical sequence

1. **9 generated candidates:** the upstream ARKI generation pipeline must produce nine distinct, input-derived architectural candidates. A fixture, repeated template, placeholder, or synthetic demo is not an acceptable production result.
2. **Human selection of 4:** the architect selects exactly four of the nine. The five non-selected candidates are archived with identity and provenance; they are not silently deleted.
3. **Deep evaluation:** the four finalists undergo the available architectural, spatial, functional, regulatory-source, engineering, and cost checks. Unsupported checks remain `UNKNOWN` or `NOT_EVALUATED`.
4. **Human selection of 1:** after deep evaluation, the architect selects one candidate for development. The three other finalists remain recoverable.
5. **Reversible decision:** the selected candidate can be returned to the Final Four with an explicit reason and preserved history.

## Contract constraints

- `FUNNEL_LIMITS = { explorer: 9, finalists: 4, selected: 1 }`.
- First selection stage: `9_TO_4`; second selection stage: `4_TO_1`.
- Every selection requires an identified human actor.
- Candidate identity, project identity, generation identity, evidence, unknowns, and provenance must survive every transition.
- Cross-project, duplicate, stale, blocked, or missing candidates must fail closed.
- The 9-candidate cost fidelity is `RAPID_9`; the four finalists use `DEEP_4`; the selected candidate uses `DEVELOPMENT_1`.
- No automatic winner. Lowest estimated cost is not an automatic selection criterion.

## Demonstration hold

All user-facing synthetic demonstration paths are suspended indefinitely by Product Owner direction. The Design Studio route remains in a paused state until the real generation pipeline is connected and verified. Test fixtures may remain in test code, but they must not be presented as live project output.

## Acceptance gate to reopen the Studio

- A real project brief and verified site/context enter the canonical reasoning and generation path.
- The generation path returns nine distinct candidates with traceable lineage to input, knowledge, parti, topology, and geometry.
- The same candidate identity resolves consistently in plan, section, elevation, 3D, metrics, and cost projections.
- AGK remains the sole operational geometric authority; no parallel geometry engine is introduced.
- F5 evaluation, 9 → 4 human selection, deep evaluation, and 4 → 1 human selection pass automated tests.
- No unsupported regulatory, structural, MEP, BIM, cost, or professional-completion claims are made.
- End-to-end evidence is recorded. Until then, the feature remains paused and is not GREEN.

## Scope boundary

This document changes the funnel cardinality only. It does not claim that nine production candidates are already being generated, nor does it authorize merges to `main`, changes to FROZEN artifacts, or activation of blocked capabilities.
