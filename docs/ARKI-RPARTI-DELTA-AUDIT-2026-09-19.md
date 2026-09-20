# ARKI — R-PARTI Delta Audit

## Baseline

- Repository: `YvanCastilloQuezada/sicl-web`
- Branch: `feat/spatial-pilot-media-studio-v1`
- HEAD: `96eda49ff86afbc99fbad6b25416fa90d1c4906b`
- Remote HEAD: `96eda49ff86afbc99fbad6b25416fa90d1c4906b`
- Worktree: CLEAN
- P9.4: HOLD

## Architecture decision

The **Manual de Formas Arquitectónicas — ARKI** will be a versioned knowledge corpus inside the existing repository and will use the existing ARKI reasoning, provenance, transfer, learning-gate and canonical-geometry contracts. No parallel cognitive engine, CanonicalBuildingModel, learning system, transfer engine or geometry generator is introduced.

## Concept mapping

| R-PARTI concept | Existing ARKI surface | Disposition | Note |
|---|---|---|---|
| Architectural cultural repertoire | Knowledge store, source contract, curriculum | EXTEND | Three layers remain distinct: visual memory, case memory and abstract knowledge. |
| Available / accessible / explored design space | Design branches, candidates, V6 evaluation coverage | EXTEND | Explicit labels added in the Manual corpus; no numeric creativity score. |
| Architectural seed | V6 strategy/design-move provenance and DesignMemory | EXTEND | Architectural rationale is separate from computational variation. |
| Parti hypothesis | A21 DesignMemory and candidate lineage | EXTEND | Multiple hypotheses are allowed; no parti-template equivalence. |
| Realization family | Candidate lineage and canonical realizations | EXTEND | Same parti may map to multiple realizations; not generated automatically in this checkpoint. |
| Design memory | `a21DesignMemory.ts` | REUSE | Branches, rejections, trade-offs, unknowns and human decisions already exist. |
| Backtrack / reframe | DesignMemory branch history plus V6 cause/unknown contracts | EXTEND | Added as explicit corpus semantics; no destructive undo. |
| Provenance | K1 provenance, source knowledge, V6 evidence | REUSE | Manual entries carry source/interpretation/derived/generated states. |
| Retrieval R0–R4 | V6 transfer assessment and existing retrieval-related knowledge | EXTEND | Minimal retrieval hook only; no parallel retrieval engine. |
| Manual corpus | No exact canonical location existed | CREATE MODULE | `docs/knowledge/manual-formas/` plus machine-readable TypeScript sibling. |
| Beauty / creativity score | No compatible canonical target | DO_NOT_ADD | Human judgment remains authoritative. |
| Mass bibliography / image ingestion | Not authorized by R-PARTI checkpoint | DO_NOT_ADD | Only representative fixtures are included. |

## Contradiction check

No contradiction was found with v6.0/v6.1, P8, P9.0–P9.3, the CanonicalBuildingModel, human authority, UNKNOWN preservation, or no-automatic-learning rules.

## Implementation boundary

This checkpoint formalizes the minimum vocabulary, provenance, cross-reference and retrieval hooks, with representative fixtures and RP tests. It does not claim architectural learning, autonomous creativity, permit readiness, or construction documentation.

P9.4 remains on HOLD and is not executed by the R-PARTI order.
