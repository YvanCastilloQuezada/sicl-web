# BKH-2 — Contract Test Plan

**Estado:** diseño de pruebas; no ejecutable todavía porque BKH-2 no está implementado.

## Pruebas obligatorias para una futura implementación

| ID | Caso | Resultado exigido |
|---|---|---|
| BKH2-T01 | Tipo de restricción no registrado | Rechazo explícito |
| BKH2-T02 | Restricción dimensional satisfecha | `SATISFIED` |
| BKH2-T03 | Restricción dimensional violada | `VIOLATED` con actual, esperado, tolerancia y unidades |
| BKH2-T04 | Unidad incompatible | `ERROR` o `UNRESOLVED`; nunca aprobación silenciosa |
| BKH2-T05 | Restricción fuera de dominio | `NOT_APPLICABLE` |
| BKH2-T06 | Restricción `HARD` violada | Se reporta; no muta ni aprueba |
| BKH2-T07 | Dos restricciones incompatibles | `CONFLICTING` con ambas IDs |
| BKH2-T08 | Repetición de evaluación | Resultado determinista y equivalente |
| BKH2-T09 | Entrada con relación BKH-1 | Se referencia; no se duplica ni modifica |
| BKH2-T10 | Solver externo ausente | `UNRESOLVED` o `ERROR`; fail-closed |
| BKH2-T11 | Evaluación sobre snapshot | Snapshot permanece byte-equivalente |
| BKH2-T12 | Intento de regeneración desde evaluación | No existe efecto secundario |
| BKH2-T13 | Revisión V1/V2 de una restricción | `constraintId` estable e historial preservado |
| BKH2-T14 | Provenance incompleta | Rechazo explícito |

## Prueba de frontera

La prueba más importante deberá ejecutar una evaluación sobre un modelo con una relación `SUPPORTS`. La evaluación podrá consultar la relación, pero no podrá convertirla en un nuevo tipo relacional, modificarla, mover la columna, recalcular la viga ni crear una transacción.

## Criterio de cierre

No se declarará BKH-2 `VERIFIED` sólo porque existan tipos o contratos. Cada resultado deberá estar respaldado por pruebas ejecutables y outputs crudos.
