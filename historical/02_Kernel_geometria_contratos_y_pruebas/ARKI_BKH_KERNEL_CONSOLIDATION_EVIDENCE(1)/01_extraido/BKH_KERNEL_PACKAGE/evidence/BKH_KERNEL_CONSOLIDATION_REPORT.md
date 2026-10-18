# ARKI — BKH Kernel Consolidation Evidence Review

**Orden:** 93 + Suplemento post-92A  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa` (`c62183a`)  
**Estado máximo permitido por la orden:** `COMPLETED / PENDING INDEPENDENT REVIEW`

## Veredicto

# BKH KERNEL CONSOLIDATION — COMPLETED / PENDING INDEPENDENT REVIEW

No se declara `VERIFIED`. La Orden 93 exige revisión independiente y prohíbe que Manus se auto-certifique.

## Resultados ejecutados

| Área | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS; sólo warning de chunks grandes y warning de configuración pnpm |
| BKH-1 suite | PASS; 130 relaciones migradas, registry=14 |
| BKH-2 suite | PASS; 28 casos, estados y razones contractuales cubiertos |
| BKH-3 suite | PASS |
| BKH-3 corrective / 92A regression lock | PASS |
| Regresión E7 | PASS; 23 checks |
| No auto-certificación | PASS; gate forjado rechazado como `UNKNOWN + BKH2_GATE_UNTRUSTED` |
| Auditoría E7 MEP | PASS como verificación topológica bounded; no solver profesional |
| ZIP evidenciario | PASS; 29 archivos físicos, hash verificado |

## Corrección aplicada durante la Orden 93

La API de gates BKH-3 ahora exige autoridad explícita `BKH-2` y `constraintId`. Los `constraintResults` producidos directamente por `RegeneratorDefinition.run()` ya no se aceptan como evidencia de constraints. Se añadió una prueba adversarial que intenta devolver `SATISFIED` sin autoridad BKH-2; el resultado queda en `UNKNOWN` y no se regenera como éxito.

Esta corrección no implementa Transaction Engine, no valida evidencia por sí misma y no convierte al callback en un solver. Es una frontera de rechazo mínima; la revisión independiente debe decidir si el modelo de adapter BKH-2 es suficientemente fuerte para producción.

## MEP: aclaración obligatoria

El campo histórico `mep: "VERIFIED"` sólo demuestra que el fixture MEP hospitalario mínimo tiene referencias nodo–conector consistentes. El contrato también emite `Professional MEP sizing solver not executed`. No se afirma dimensionamiento profesional, cálculo de caudales, pérdidas, presión, coordinación federada ni firma de ingeniería.

## Límites y deuda visible

El worktree estaba sucio antes de la Orden 93. No se hizo reset ni eliminación destructiva. Los cambios UI-3A, contratos BKH y artefactos históricos quedaron clasificados en el baseline. Persisten decisiones arquitectónicas sobre ownership global de Geometry, Quantity, Cost, Schedule, Snapshot, ProjectVersion, SceneModel y HumanDecision.

KITM-001 tiene especificación y una ejecución reducida heredada de 92A; la matriz completa de branching/diamond, reload integral, fuzz/property testing, stress baseline y auditoría independiente del paquete quedan como `DEFERRED_WITH_REASON`, no como PASS inventado.

## Firewall respetado

No se inició BKH-4. No se implementaron commit, rollback, undo/redo, worksharing, multiusuario, Documentation Compiler, nuevos solvers profesionales, Academy/Tutor, E8 ni reapertura de E5/E6/E7.

## Paquete

El ZIP final contiene baseline, outputs, scans, matrices, ledger, auditoría MEP, fuentes BKH-1/2/3 y pruebas. El hash SHA-256 se registra en `BKH_KERNEL_PACKAGE.zip.sha256`.

## Estado de fases

| Fase | Estado |
|---|---|
| BKH-0 | RECONCILED / VERIFIED histórico |
| BKH-1 | VERIFIED / regression hardened |
| BKH-2 | VERIFIED / regression hardened |
| BKH-3 | IMPLEMENTED / pending independent review |
| Cross-engine | Tested within bounded evidence |
| KITM-001 | Executed in reduced 92A-compatible scope; full matrix deferred |
| BKH-4 | BLOCKED |
| E5/E6/E7 | FROZEN |
| E8 | NOT STARTED |

**STOP ABSOLUTO:** no diseñar ni implementar BKH-4 en esta orden.
