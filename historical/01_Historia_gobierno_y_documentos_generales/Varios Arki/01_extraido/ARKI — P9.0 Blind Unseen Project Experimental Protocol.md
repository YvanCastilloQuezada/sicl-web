# ARKI — P9.0 Blind Unseen Project Experimental Protocol
## Preparation for Project B

**Baseline:** `2814be085f1e75c12c9ee7cbfdc780af11341720`  
**Status:** `READY_FOR_PROJECT_B`  
**Project B:** `NOT_CREATED`  
**Project C:** `NOT_CREATED`

## Scope

P9.0 prepara una prueba arquitectónica verdaderamente inédita. No diseña Project B, no ejecuta una solución y no solicita aprendizaje. La finalidad es que el siguiente experimento evalúe qué hace ARKI cuando no recibe déficit, causa, estrategia, candidato, geometría, ganador ni regla de aprendizaje esperados.

P8 queda congelado como evidencia histórica. Sus resultados no se modifican ni se reinterpretan silenciosamente.

## Protocol components

| Component | Implemented protocol |
|---|---|
| P8 freeze | Baseline exacto preservado |
| K0 | Snapshot reproducible creado antes de Project B; `K1` no se crea |
| Project B isolation | Identifier search and project-specific artifact contamination check |
| Input contract | Only legitimate project inputs with provenance; solution fields rejected |
| Input freeze | Initial inputs freeze before execution; later information gets a distinct external category |
| Oracle separation | Tests verify invariants and provenance, never a preferred architecture |
| Blind execution | Phase A is frozen before Phase B |
| Post-hoc evaluation | Phase B receives the frozen blind result and cannot mutate Phase A |
| Novelty filter | Novel, retrieved, supplied and direct execution results are not learning by themselves |
| Challenge path | Repetition, variant, counterexample, and later transfer/fixation gates remain future requirements |
| Specialist boundary | P8.2 semantics reused: specialist input is not capability failure |
| Human authority | Human decision boundaries remain pending and non-automatic |
| Second engine | Forbidden |

## K0 snapshot

The K0 contract records, for every entry, whether information is already known, supplied, retrieved, a direct execution result, inferred from K0, a novel candidate or unknown. The snapshot is frozen and explicitly records `k1Created = false`.

## Project B isolation

Before selecting Project B, ARKI must search the repository and persistent knowledge for the exact new identifier and for project-specific program, geometry, strategy and expected-result artifacts. Any match invalidates the clean experiment. General architectural knowledge remains admissible; a prior solution to Project B does not.

## Input contract

Permitted categories are `CLIENT_FACT`, `SITE_FACT`, `OBJECTIVE`, `HARD_CONSTRAINT`, `PREFERENCE`, `REGULATORY_SOURCE`, `KNOWN_CONTEXT`, `UNKNOWN` and `HUMAN_DECISION` or their existing canonical equivalents. Every input requires provenance. Solution fields such as `preferredParti`, `expectedGeometry`, `expectedStrategy`, `answerKey` and `expectedWinner` are rejected.

## Blind and post-hoc phases

Phase A receives only legitimate project input, freezes its result and records the experiment ledger. Phase B evaluates traceability, constraints, deficits, unknowns, reasoning quality, dependencies and authority. Phase B cannot alter Phase A or inject an architectural answer retroactively.

## Learning boundary

The protocol observes whether a candidate event is absent from K0, not supplied, not a direct execution result, not a simple retrieval, not a fixture oracle, architecturally meaningful and traceable to evidence. Only then may it become a `LEARNING_CANDIDATE`. Otherwise it remains `OBSERVATION_ONLY` or `UNKNOWN`. P9.0 creates no K1.

## Acceptance

```text
P9.0 = READY_FOR_PROJECT_B
PROJECT B EXECUTION = NOT AUTHORIZED BY THIS DELTA
K0 = DEFINED / FROZEN BEFORE PROJECT B
PROJECT B = NOT CREATED
K1 = NOT CREATED
PROJECT C = NOT CREATED
P8 = FROZEN
HUMAN AUTHORITY = PRESERVED
SECOND ENGINE = NOT CREATED
```

## Validation boundary

The implementation proves the protocol's isolation, provenance, no-answer-key, blind/post-hoc separation and novelty-filter contracts. It does not claim that ARKI has learned from Project B, generalized, produced a valid design or created persistent knowledge.
