# KITM-001 — Kernel Integrity Torture Matrix

**Orden:** 93 · **Estado:** especificación y ejecución base preparada

## Escenario

`SOURCE PARAMETER → SEMANTIC ENTITY → BKH-1 RELATIONSHIP → BKH-2 CONSTRAINT → BKH-3 DIRTY PROPAGATION → GEOMETRY DERIVATION → QUANTITY → COST → SCHEDULE/DEPENDENCY → REPRESENTATION`

## Casos incluidos

| Caso | Resultado exigido |
|---|---|
| Cadena directa | Dirty set mínimo y orden determinista |
| Dependencia transitiva | Propagación a descendientes autorizados |
| Branch/diamond | Sin duplicación ni pérdida de nodos |
| Entidad no relacionada | Estado unchanged |
| Cross-discipline | Sin extrapolación implícita |
| Cross-scale | Sólo con dependencia explícita |
| Constraint SATISFIED | Regeneración permitida |
| Constraint VIOLATED | Nodo BLOCKED/FAILED según gate |
| Constraint UNKNOWN | Estado UNKNOWN, nunca éxito |
| Missing dependency | UNKNOWN + razón explícita |
| Cycle attempt | Cycle contained; no recursión infinita |
| Stale fingerprint | Invalidación reproducible |
| Context relevant/irrelevant | Cambio sólo cuando corresponde |
| Unsupported solver | UNKNOWN/UNSUPPORTED_SOLVER; no cálculo inventado |
| Source mutation attempt | Source hash permanece igual |
| No canonical commit | Resultado derivado no se promueve |

## Evidencia disponible

La suite `scripts/test-bkh3-corrective.ts` ya ejecuta una cadena reducida con propagación transitiva, entidad no relacionada, costo bloqueado, gates BKH-2, estados SATISFIED/VIOLATED/UNKNOWN y no mutación. La Orden 93 exige ampliar esta matriz con grafos branching/diamond, reload y auditores de bypass; cualquier caso no ejecutado permanece explícito como `DEFERRED_WITH_REASON`.

## Firewall

KITM-001 no implementa Transaction Engine, commit, rollback, worksharing, Documentation Compiler, solvers profesionales ni HumanDecision.
