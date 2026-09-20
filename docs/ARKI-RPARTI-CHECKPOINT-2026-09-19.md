# ARKI — R-PARTI Checkpoint: Manual de Formas Arquitectónicas

## Resultado ejecutivo

**R-PARTI = PASS_WITH_OBSERVATIONS / REPAIRED v0.2.0**.

Se incorporó un corpus mínimo y trazable del Manual de Formas Arquitectónicas — ARKI. La implementación usa los contratos existentes de ARKI y no crea un segundo motor de diseño, un segundo sistema de memoria, un segundo motor de transferencia ni un segundo modelo geométrico.

## Integración realizada

| Superficie | Resultado |
|---|---|
| Manual humano | `docs/knowledge/manual-formas/README.md` y `manifest.json` |
| Representación machine-readable | `client/src/components/arkiRPartiManual.ts` |
| Capas | `VISUAL_MEMORY`, `CASE_MEMORY`, `ABSTRACT_ARCHITECTURAL_KNOWLEDGE` |
| Provenance | `SOURCE_DOCUMENTED`, `SOURCE_DERIVED`, `ARKI_INTERPRETATION`, `ARKI_DERIVED`, `ARKI_GENERATED`, `ARKI_DISCOVERED_CANDIDATE`, `HUMAN_CONFIRMED` |
| Espacio de diseño | `AVAILABLE`, `ACCESSIBLE`, `EXPLORED` |
| R0–R4 | Hook de recuperación relation-first con bloqueo explícito de copia formal |
| Seed → Parti → RealizationFamily | Contratos separados y testeados |
| Backtrack / Reframe | Eventos semánticos con evidencia preservada y revisión humana |
| Fixtures | 5 representativos; no constituyen una biblioteca masiva ni verdad de diseño |

## RP-01..RP-20

| ID | Estado | Resultado verificable |
|---|---|---|
| RP-01 | PASS | Unas mismas condiciones pueden producir varios seeds con racionales distintos. |
| RP-02 | PASS | Un seed admite varias hipótesis de parti. |
| RP-03 | PASS | Una familia admite varias realizaciones y no es una plantilla. |
| RP-04 | PASS | Parti y forma son campos distintos; la intención no se infiere de la forma. |
| RP-05 | PASS | Seed arquitectónico y seed computacional están separados. |
| RP-06 | PASS | Se integra el evaluador S1 existente; los desconocidos regulatorios permanecen separados. |
| RP-07 | PASS | Recuperación de precedente relation-first y no-copying. |
| RP-08 | PASS | R3/R4 permanecen exploratorios, con transferibilidad UNKNOWN cuando corresponde. |
| RP-09 | PASS | Se registra feedback estético humano sin score automático, ganador ni aprendizaje automático. |
| RP-10 | PASS | El rechazo geométrico genera backtrack con evidencia preservada hacia la familia de realizaciones. |
| RP-11 | PASS | DesignMemory ya preserva ramas rechazadas; el Manual explicita la distinción. |
| RP-12 | PASS | Se añade heurística acotada de repetición de parti con umbral y revisión humana. |
| RP-13 | PASS | Backtrack preserva evidencia y no es undo destructivo. |
| RP-14 | PASS | Reframe tiene nivel de problem-frame explícito. |
| RP-15 | PASS | K1 conserva experiencias como PROJECT_ONLY y bloquea promoción automática. |
| RP-16 | PASS | Se valida identidad del modelo canónico, versión y resolución de IDs en vistas. |
| RP-17 | PASS | Provenance de fuente documentada e interpretación ARKI son distintas. |
| RP-18 | PASS | Se generan alternativas semánticas que conservan hard constraints y no crean ganador automático. |
| RP-19 | PASS | El replay histórico P9.3 sigue disponible y no fue alterado. |
| RP-20 | BLOCKED | Se mantiene bloqueado honestamente: aún no se demuestra geometría distinta del mismo parti en Project B. |

**Conteo actualizado:** 19 PASS, 1 BLOCKED, 0 falsos PASS. El único bloqueo restante exige una fase geométrica controlada; no se simula como PASS.

## Relación con los deltas recientes

- **Delta 489:** registrado automáticamente como `PASTED-CONTENT-489-V1`; su superficie de deliberación permanece separada.
- **Delta 490:** registrado automáticamente como `PASTED-CONTENT-490-V488`; P9.4 permanece en `HOLD` y no fue reabierto por este checkpoint.

## Límites y autoridad

El checkpoint no demuestra que ARKI haya aprendido a diseñar de forma autónoma, que comprenda intención de autor, que pueda puntuar belleza o creatividad, ni que produzca documentación constructiva o permiso. Las hipótesis permanecen `HYPOTHESIS` hasta revisión humana. No se crea ganador automático, canonización automática ni decisión humana automática.

## Validación ejecutada

- `arkiRPartiManual.test.ts`: 4 tests PASS.
- P9.3 regression fixture: 2 tests PASS.
- Project B geometry fixture: 2 tests PASS.
- Project B blind experiment fixture: 3 tests PASS.
- Total focalizado: **11 tests PASS**.
- TypeScript `pnpm check`: **PASS**.
- `git diff --check`: **PASS**.

## Reparación v0.2.0

Se repararon RP-06, RP-09, RP-10, RP-12, RP-16 y RP-18 mediante extensiones del Manual que reutilizan S1, el modelo canónico y la identidad de vistas existentes. RP-13 queda cubierto por el backtrack reparado. La reparación no crea un segundo motor geométrico, evaluador paralelo, sistema de memoria ni proceso de decisión humana automática.

RP-20 no se marca como PASS porque una familia con varios `realizationIds` todavía no prueba que existan geometrías diferentes. El contrato ahora informa explícitamente `REQUIRES_GEOMETRIC_MATERIALIZATION`, preservando la autoridad humana y evitando un falso éxito.
