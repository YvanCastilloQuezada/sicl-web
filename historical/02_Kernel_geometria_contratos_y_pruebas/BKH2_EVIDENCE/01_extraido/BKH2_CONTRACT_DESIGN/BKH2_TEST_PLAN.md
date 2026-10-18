# BKH-2 — Contract Test Plan v1.2

**Estado:** diseño de pruebas; no ejecutable porque BKH-2 no está implementado.

## Pruebas obligatorias

| ID | Caso | Resultado exigido |
|---|---|---|
| BKH2-T01 | Tipo o registry no registrado | Rechazo explícito |
| BKH2-T02 | `HARD + CONDITIONAL + WARNING` | Constraint válida; ejes no colisionan |
| BKH2-T03 | `SOFT + UNCONDITIONAL + CRITICAL` | Constraint válida; severity no redefine hardness |
| BKH2-T04 | Aplicabilidad de instancia fuera de escala | `NOT_APPLICABLE` |
| BKH2-T05 | Aplicabilidad de instancia fuera de disciplina | `NOT_APPLICABLE` |
| BKH2-T06 | Entidad o jurisdicción no aplicable | `NOT_APPLICABLE` o `UNKNOWN` según dependencia |
| BKH2-T07 | Dimensional satisfecha | `SATISFIED` |
| BKH2-T08 | Dimensional violada | `VIOLATED` con valores, tolerancia y unidades |
| BKH2-T09 | Unidad incompatible | `ERROR` con `INVALID_INPUT` |
| BKH2-T10 | Tipo de evaluación no demostrado | `UNKNOWN` + `NOT_DEMONSTRATED` |
| BKH2-T11 | Solver ausente | `UNKNOWN` + `UNSUPPORTED_SOLVER` o `EXTERNAL_ORACLE_REQUIRED` |
| BKH2-T12 | Dependencia relacional ausente | `UNKNOWN` + `MISSING_DEPENDENCY` |
| BKH2-T13 | Evidencia insuficiente | `UNKNOWN` + `INSUFFICIENT_EVIDENCE` |
| BKH2-T14 | Repetición de evaluación | Resultado determinista y equivalente |
| BKH2-T15 | Dos constraints incompatibles | `CONFLICTING` con todas las IDs |
| BKH2-T16 | Revisión V1/V2 | `constraintId` estable e historial preservado |
| BKH2-T17 | Predicate literal y reference | AST válido y tipado |
| BKH2-T18 | Operador no registrado | Rechazo antes de evaluar |
| BKH2-T19 | Aridad o tipos incorrectos | Rechazo antes de evaluar |
| BKH2-T20 | `eval()` o `Function()` en predicate | Rechazo; ninguna ejecución |
| BKH2-T21 | String con código arbitrario | Rechazo como operand/predicate |
| BKH2-T22 | Función `call` no registrada | Rechazo explícito |
| BKH2-T23 | Evaluación sobre snapshot | Snapshot permanece byte-equivalente |
| BKH2-T24 | Entrada con relación BKH-1 | Se referencia, no se duplica ni modifica |
| BKH2-T25 | Intento de regeneración desde evaluación | Ningún efecto secundario |
| BKH2-T26 | Constraint regulatoria sin aplicabilidad | `UNKNOWN` o `NOT_APPLICABLE`, nunca `SATISFIED` |
| BKH2-T27 | Constraint `SOFT` | Nunca se transforma silenciosamente en `HARD` |
| BKH2-T28 | Causalidad no declarada | No se genera causa por inferencia automática |

## Modelo de estados

No se aceptan taxonomías paralelas con `UNRESOLVED`, `EXTERNAL_ORACLE_REQUIRED`, `NOT_DEMONSTRATED` o `MISSING_DEPENDENCY` como estados principales. Todos deben aparecer como `resolutionReason` junto a un `ConstraintEvaluationStatus` canónico.

## Prueba de frontera

Una evaluación sobre un modelo con relación `SUPPORTS` puede consultar `relationIds`, pero no puede convertirla en una relación nueva, modificarla, mover la columna, recalcular la viga, regenerar geometría o crear una transacción.

## Criterio de cierre

No se declarará BKH-2 `VERIFIED` sólo porque existan tipos o contratos. Cada resultado deberá estar respaldado por pruebas ejecutables, outputs crudos, pruebas negativas y evidencia de no mutación.
