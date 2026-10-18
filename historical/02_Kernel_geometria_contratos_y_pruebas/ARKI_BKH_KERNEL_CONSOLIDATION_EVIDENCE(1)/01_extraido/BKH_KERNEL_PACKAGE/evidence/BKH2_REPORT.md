# ARKI — BKH-2 Constraint Engine Evidence Review

**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`  
**Estado máximo:** **IMPLEMENTED / PENDING EVIDENCE REVIEW**

## Resultado de la revisión correctiva

Se ejecutó exclusivamente el delta BKH-2 aprobado. Los cinco fixes quedaron implementados dentro de `shared/arkiConstraintEngine.ts` y demostrados mediante la suite ampliada `scripts/test-bkh2-constraint-engine.ts`.

No se inició BKH-3, BKH-4, Transaction Engine, Regeneration Engine, HumanDecision, E8 ni ningún solver profesional nuevo. E5, E6 y E7 no fueron reabiertos.

## Fixes cerrados

| Fix | Resultado |
|---|---|
| FIX-BKH2-01 — Evidence semantics | Evidencia insuficiente produce `UNKNOWN + INSUFFICIENT_EVIDENCE`; la constraint estructuralmente inválida produce `ERROR + INVALID_INPUT`. |
| FIX-BKH2-02 — Missing dependency semantics | Referencias ausentes en `entity`, `derived`, `context` o Relationship Fabric producen `UNKNOWN + MISSING_DEPENDENCY`. |
| FIX-BKH2-03 — Adversarial predicate input | `eval()`, `Function()`, JavaScript arbitrario, strings ejecutables y funciones no registradas son rechazados o tratados como datos; nunca se ejecutan. Texto ordinario permanece permitido como literal. |
| FIX-BKH2-04 — Complete contract coverage | La suite ejecuta 28 casos, incluyendo estados, aplicabilidad, conflictos, aridad, tipos, determinismo y no mutación. |
| FIX-BKH2-05 — Currency safety | PEN y USD son incompatibles sin tasa/contexto gobernado. No se implementó FX engine. |

## Outputs finales

La validación completa terminó con `validation_exit=0` e incluyó:

- `pnpm check`.
- `pnpm build`.
- Suite BKH-2 completa: 28 casos obligatorios.
- Regresión BKH-1.
- Tests constructivos, profesionales, dossier técnico, serialización, coherencia muro/puerta, SceneModel, persistencia formal y E7.

El output crudo completo está en `BKH2_IMPLEMENTATION_OUTPUTS.txt`.

## Evidencia de estados

La suite demuestra `SATISFIED`, `VIOLATED`, `UNKNOWN`, `NOT_APPLICABLE`, `CONFLICTING` y `ERROR`, junto con `NOT_DEMONSTRATED`, `EXTERNAL_ORACLE_REQUIRED` mediante solver no conectado, `INSUFFICIENT_EVIDENCE`, `INSUFFICIENT_EPISTEMIC_STATE`, `MISSING_DEPENDENCY` e `INVALID_INPUT`.

También demuestra aplicabilidad cross-scale, cross-discipline, jurisdiction, phase y projectType; unidades incompatibles; moneda PEN/USD; constraints `SOFT`; relación BKH-1 sin mutación; repetición determinista; snapshots y entradas sin cambios; y ausencia de regeneración o mutación canónica.

## Estado de promoción

El estado permanece **IMPLEMENTED / PENDING EVIDENCE REVIEW**, conforme a la orden correctiva. Este paquete no emite `VERIFIED`; deja preparada la evidencia para revisión independiente.

## Límites preservados

BKH-2 no regenera geometría ni propaga cambios, no modifica entidades, relaciones o snapshots, no hace commit, rollback, undo, redo o worksharing, no resuelve conflictos automáticamente y no implementa conversión monetaria FX. BKH-3 y BKH-4 continúan bloqueados.

El worktree ya estaba sucio antes de Gate 1. El baseline y esa condición se conservan en `BKH2_GATE1_BASELINE.txt`.
