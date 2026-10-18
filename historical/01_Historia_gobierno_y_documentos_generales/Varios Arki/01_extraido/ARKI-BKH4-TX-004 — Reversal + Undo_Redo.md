# ARKI-BKH4-TX-004 — Reversal + Undo/Redo

**Fecha de ejecución:** 24 de septiembre de 2026  
**Alcance:** compensating transactions sobre la persistencia canónica durable existente.  
**Estado máximo:** `IMPLEMENTED / EVIDENCE REVIEW READY`; TX-005 y BKH4-4 global permanecen bloqueados.

## Resultado ejecutivo

TX-004 implementa `UNDO` y `REDO` sin borrar ni modificar retrospectivamente la historia. Cada operación produce una nueva transacción, una nueva revisión canónica, provenance de reversión, auditoría e idempotencia durable. La ruta usa el mismo `commitWithCas()` y la misma persistencia multi-store de TX-003C/TX-003D.

El resultado no constituye un cierre global de BKH4. Tampoco modifica PF-H01/PF-H01.R1, no migra writers legacy y no crea una autoridad paralela.

## Veredictos separados

| Capacidad | Resultado | Evidencia |
| --- | --- | --- |
| Reversal implementation | `IMPLEMENTED` | `shared/arkiReversalEngine.ts` |
| Undo | `VERIFIED FOR BOUNDED COMPENSATING-TRANSACTION SCOPE` | 29 casos adversariales y cadena histórica |
| Redo | `VERIFIED FOR BOUNDED REVALIDATED-REPLAY SCOPE` | adapter obligatorio; rechazo negativo y redo válido |
| CAS para undo/redo | `VERIFIED FOR TESTED SCOPE` | race de dos undo: un ganador y un `STALE_BASE` |
| Idempotencia durable | `VERIFIED FOR TESTED SCOPE` | retry exacto `REPLAYED`; payload distinto `IDEMPOTENCY_CONFLICT` |
| Inmutabilidad histórica | `VERIFIED` | T1/R1 permanece después de T2/R2 y T3/R3 |
| Crash/restart real | `VERIFIED FOR TWO TESTED POINTS` | Chromium real, SIGKILL, perfil persistente y proceso nuevo |
| Real-browser evidence | `PASS` | `after-idempotency-write`, `after-current-write` |
| Power loss | `NOT_TESTED` | No se convierte en PASS |

## Decisiones semánticas

`UNDO(T1)` es una transacción compensatoria T2. Su mutation set es la inversión declarativa de T1, aplicada en orden inverso cuando corresponde. T1 y R1 no se eliminan ni se reescriben. Si el estado resultante tiene los mismos valores que un estado anterior, esa equivalencia no cambia su identidad histórica.

`REDO(T2)` crea T3 y vuelve a aplicar la intención de T1 bajo el estado actual. No es restauración de historia borrada. REDO exige un adapter `revalidate()` explícito; si falta o devuelve `false`, la operación se rechaza antes de generar una revisión. Este adapter es una frontera gobernada para Relationship Fabric, Constraint Engine, regeneración e invariantes. TX-004 no afirma que los solvers profesionales hayan sido ejecutados.

`UNDO(UNDO(T1))` no se trata automáticamente como REDO. Puede construirse como otra compensating transaction explícita, con nueva identidad y nueva revisión. La implementación conserva esa separación; `redo()` sólo acepta como target una compensación marcada como `UNDO`.

Una transacción `NON_REVERSIBLE` no se vuelve reversible por inferencia. PF-H01 y PF-H01.R1 están fuera del alcance: cualquier mutation cuyo target sea ese principio se rechaza.

## Evidencia ejecutada

La suite `scripts/test-bkh4-tx-004-reversal.ts` produjo 29 casos PASS, diez semillas de cadena y un race real de dos undo concurrentes. La suite cubre undo normal, retry, conflicto de idempotencia, stale base, target inexistente, cross-project, operación no reversible, redo normal, revalidación negativa, redo retry, redo stale, provenance inválida, concurrencia y protección PF-H01.

`scripts/test-bkh4-tx-004-test-the-test.ts` detectó seis implementaciones defectuosas deliberadas: borrado de historia, last-write-wins, duplicación por retry, redo ciego, ignorar current revision y reversión cross-project.

La campaña real de Chromium ejecutó SIGKILL durante `after-idempotency-write` y `after-current-write`. Tras iniciar un proceso nuevo con el mismo perfil persistente, `recoverTransaction()` clasificó ambos casos mediante los seis artefactos durables. La campaña confirma sólo los dos puntos ejecutados; no demuestra pérdida física de energía.

La regresión completa registrada en `BKH4_TX_004_OUTPUTS.txt` pasó `pnpm check`, `pnpm build`, BKH-1, BKH-2, BKH-3, BKH-3 corrective, BKH4 foundation, BKH4-3, persistencia, TX-003A, TX-003B, TX-003C, TX-003D y las nuevas suites TX-004.

## Límites y deuda explícita

La implementación opera sobre mutation sets declarativos almacenados en el registro durable de la transacción. No realiza todavía migración de todos los writers existentes. No sustituye la autoridad canónica del sistema completo ni resuelve la consolidación de ownership. Esas tareas pertenecen a TX-005 y están fuera de esta orden.

La recuperación real no cubre los ocho puntos de la matriz contractual; sólo cubre dos puntos representativos con SIGKILL. `POWER LOSS` permanece `NOT_TESTED`. La aplicación concreta de restricciones, relaciones y regeneración se exige como adapter de revalidación, pero este paquete no presenta un solver profesional como verificado.

## Archivos principales

- `shared/arkiReversalEngine.ts`
- `shared/arkiCanonicalPersistence.ts`
- `shared/arkiTransactionEngine.ts`
- `scripts/test-bkh4-tx-004-reversal.ts`
- `scripts/test-bkh4-tx-004-test-the-test.ts`
- `scripts/test-bkh4-tx-004-browser.ts`
- `scripts/run-bkh4-tx-004-real-browser.mjs`
- `scripts/run-bkh4-tx-004-evidence.sh`
- `BKH4_TX_004_OUTPUTS.txt`

## STOP

No se inicia TX-005, BKH-5, BKH-6, BKH-7, E8, MVH, ARKI-SEC, Constitutional Root, CAD, GEO, LUCA ni migración de writers. PF-H01/PF-H01.R1 permanecen intactos.

## References

[1]: ARKI_BKH4_TX_004_ORDER.md "Orden ARKI-BKH4-TX-004"
[2]: ARKI_FOUNDATIONAL_PRINCIPLE_PF-H01_LOCK.json "PF-H01 constitutional lock"
