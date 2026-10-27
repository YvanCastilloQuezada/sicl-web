# ARKI — MAPA VIVO DE CONTINUIDAD

> GENERADO A PARTIR DE GIT + EVENTOS DECLARADOS. No es el Event Store canónico del Core. No verifica CI, arquitectura ni despliegue.

## Cómo retomar en un nuevo chat
1. Leer este documento y el historial `ARKI_CONTINUITY_EVENTS.jsonl`.
2. Comprobar SHA remoto y CI; no asumir que una declaración es evidencia ejecutada.
3. Continuar desde pendientes sin repetir inventarios ya documentados.

## Estado observado
- Rama: `main`
- Último SHA de cambios sustantivos (excluye snapshot): `76d79f6192e79ad8dd930d5d0e83a0b9daef6ac0`
- Último commit: 2026-10-27T16:21:32-05:00 — ci(arki): recuperar workflow arki-live-pulse de rama histórica
- Estado de Core/D-2/AGK: NOT_VERIFIED
- CI exacto y E2E: NOT_VERIFIED
- Promoción canónica: NO_AUTORIZADA_POR_ESTE_MAPA

## Decisiones y acciones explícitamente registradas (orden del ledger)
- **2026-10-13** [PRIORITY_DECISION] CONT-20261013-001 — La continuidad automática y el Mapa Vivo histórico pasan a ser prioridad P0 antes de autoevaluación o automejora.; evidencia: Conversación del propietario 2026-10-13; decisión declarada, no validación técnica; estado: AUTHORIZED_SCOPE
- **2026-10-13** [ARCHITECTURE_CONSTRAINT] CONT-20261013-002 — Reutilizar memoria y Event Store Core; la bitácora documental no es una segunda fuente canónica. No modificar D-2 ni FROZEN.; evidencia: ARKI_CONSOLIDADO_ESQUELETO_SISTEMA_NERVIOSO_2026-09-29; restricciones de continuidad; estado: CONSTRAINT
- **2026-10-13** [PROGRESS] CONT-20261013-003 — Bolsa de Ideas: 44 de 189 ramas no-main comparadas; 145 pendientes; fechas de concepción y commit independientes.; evidencia: docs/arki-master-map/ARKI_BOLSA_IDEAS_CRONOLOGIA_BIC_007.md; estado: PARTIAL
- **2026-10-13** [IMPLEMENTATION] CONT-20261013-004 — Pulso read-only de ARKI y pruebas creados en rama aislada; CI y operación real aún no verificados.; evidencia: sicl-web feat/arki-live-readonly-pulse-20261013; commits be48f997, f907eaf5, 9893dfda; estado: IMPLEMENTED_NOT_VERIFIED
- **2026-10-13** [AUTOMATION] CONT-20261013-005 — Revisión recurrente diaria del Mapa Vivo programada para 08:00 hora de Perú, ejecución inicial pendiente.; evidencia: Automatización ChatGPT Continuidad diaria ARKI creada el 2026-10-13; estado: SCHEDULED_NOT_EXECUTED
- **2026-10-13** [CI_OBSERVATION] CONT-20261013-006 — CI general SICL Web falló en run 38477412351 para commit 8b8a76dd; no hay verde verificable para merge.; evidencia: GitHub Actions SICL Web CI run 38477412351, verify job 115571415371, conclusion failure; estado: BLOCKED
- **2026-10-13** [IMPLEMENTATION] CONT-20261013-007 — Generador Mapa Vivo reforzado con validación de tipos y fechas en eventos; pruebas y workflow creados, ejecución pendiente.; evidencia: sicl-web feat/arki-integration-genealogy-20261013 commits d3f10ab8, 8b8a76dd, a24cd5b9; estado: IMPLEMENTED_NOT_VERIFIED
- **2026-10-13** [CONTINUITY_HARDENING] CONT-20261013-008 — Mapa Vivo ahora muestra última acción del ledger y enlace al protocolo de arranque; el CI del SHA exacto sigue sin verificación verde.; evidencia: sicl-web commit c1c3bf7b5a8b97badbb37c68b9bea26b8bc552ed; CI previo run 38477412351 failure; logs no recuperables; estado: IMPLEMENTED_NOT_VERIFIED
- **2026-10-13** [CI_REPAIR] CONT-20261013-009 — Workflow de continuidad ajustado para probar en PR y publicar solo en push de rama; falta evidencia de ejecución verde, por lo que la fusión sigue bloqueada.; evidencia: sicl-web commit ff24dabdc7c58aa6cf04124e0594398b1aaeca6b; GitHub CI anterior 38480483015 FAILURE; estado: IMPLEMENTED_NOT_VERIFIED
- **2026-10-13** [VALIDATION_PROTOCOL] CONT-20261013-010 — Se habilita verificación offline por SHA en servidor privado; GitHub Actions no se usa como evidencia de aprobación hasta recuperar su operación.; evidencia: sicl-web commit f46a5ca3cdd910d63e8ef3750b272b5ab91ffbca; tools/maqueta-viva/arki-continuity-local-verify.cjs; estado: IMPLEMENTED_AWAITING_LOCAL_EXECUTION
- **2026-10-14** [CONTINUITY_REVIEW] CONT-20261014-011 — Revisión de continuidad: desde f46a5ca3 hasta b0a37f1b hay dos commits nuevos: protocolo de validación privada documentado y lanzador Ubuntu por SHA; la bitácora añadió CONT-20261013-010. No se demues; evidencia: GitHub compare f46a5ca3cdd910d63e8ef3750b272b5ab91ffbca...b0a37f1b3f063b66c6f0fcf1ac2cc8ebb4c17ea4; commits 2dea59b4190754ee76d2b9b40d8fc636b6a9cdad y b0a37f1b3f063b66c6f0fcf1ac2cc8ebb4c17ea4; estado: IMPLEMENTED_NOT_EXECUTED
- **2026-10-14** [CI_OBSERVATION] CONT-20261014-012 — ARKI Continuity Map y SICL Web CI fallan para SHA b0a37f1b; jobs continuity y verify finalizaron failure sin runner asignado (runner_id=0, steps vacíos). No hay evidencia de ejecución de pruebas; caus; evidencia: GitHub Actions runs 38494969069 y 38494969097; jobs API; SHA b0a37f1b3f063b66c6f0fcf1ac2cc8ebb4c17ea4; estado: BLOCKED_PRE_EXECUTION
- **2026-10-21** [CONTINUITY_REVIEW] CONT-20261021-013 — La rama fuente feat/arki-integration-genealogy-20261013 sigue en b0a37f1 sin commits nuevos. Novedad desde la revisión previa: PR #59 fue fusionado en main el 2026-10-21T06:12:36Z mediante merge commi; evidencia: GitHub branch API (feat branch b0a37f1); PR #59 API merged_at=2026-10-21T06:12:36Z, merge_commit_sha=2d2f0333181db4c7e52050086b506e6c747ce4a3; run 39554020549 step 'Validate continuity generator and l; estado: VERIFIED_PARTIAL
- **2026-10-22** [CONTINUITY_REVIEW] CONT-20261022-014 — La rama feat/arki-integration-genealogy-20261013 permanece sin cambios en b0a37f1b; main avanzó 28 commits hasta a6d9d1bf e incluye PR #59 y avances de REVIVIR ARKI/MO-22. SICL Web CI pasó en a6d9d1bf; evidencia: Branch API source b0a37f1b3f063b66c6f0fcf1ac2cc8ebb4c17ea4; main a6d9d1bfd1962302ba1a4a41136522d6143ce694; compare b0a37f1...main ahead_by=28; SICL Web CI https://github.com/YvanCastilloQuezada/sicl-w; estado: VERIFIED_PARTIAL

## Última acción registrada
- CONT-20261022-014 — La rama feat/arki-integration-genealogy-20261013 permanece sin cambios en b0a37f1b; main avanzó 28 commits hasta a6d9d1bf e incluye PR #59 y avances de REVIVIR ARKI/MO-22. SICL Web CI pasó en a6d9d1bf — VERIFIED_PARTIAL

## Últimos 80 commits observados (no son aprobación)
- 2026-10-27T16:21:32-05:00 — `76d79f6192e7` — ci(arki): recuperar workflow arki-live-pulse de rama histórica
- 2026-10-27T16:08:05-05:00 — `e7833a51d6d2` — fix(adn): recuperar test de arki-adn-mejora-continua de av035-main-integration
- 2026-10-27T16:06:46-05:00 — `07b4a23bdb39` — fix(adn): recuperar verifyReceiptSignature y receiptSigningPayload de av035-main-integration
- 2026-10-27T16:04:33-05:00 — `c3b49e0324bc` — fix(maqueta-viva): eliminar return inalcanzable en arkiPriorityLane (bug del rebase del PR #79)
- 2026-10-27T05:16:29-05:00 — `fec8ab5b9e0d` — Merge pull request #97 from YvanCastilloQuezada/feat/agk-003-parametric-family-unification
- 2026-10-27T05:16:25-05:00 — `86bee18e5450` — resolve conflict with main in arkiGeometryKernel.ts
- 2026-10-27T05:13:11-05:00 — `ec147ef7d966` — Revert "Merge pull request #81 from YvanCastilloQuezada/feat/arbol-vivo-autoensamblaje-20261011"
- 2026-10-27T05:10:11-05:00 — `e5eab66d734d` — Merge pull request #96 from YvanCastilloQuezada/audit/l04-workflow-base-044707a
- 2026-10-27T05:05:34-05:00 — `70c69549f546` — Merge pull request #81 from YvanCastilloQuezada/feat/arbol-vivo-autoensamblaje-20261011
- 2026-10-27T05:05:29-05:00 — `e29b9aa81c0b` — resolve conflicts with main after #79
- 2026-10-27T04:57:43-05:00 — `cdd93cd5754e` — fix(maqueta-viva): restore balanced precedence loop and single blocking reason
- 2026-10-27T04:37:38-05:00 — `9e6b05d8ed61` — Merge pull request #39 from YvanCastilloQuezada/audit/l04-agk-only-trigger-v2
- 2026-10-27T04:18:53-05:00 — `3dc596fd4395` — fix(tools): reparar 4 .cjs con bugs de sintaxis del merge 2773bcdc (copiados de av023-arbol-vivo)
- 2026-10-22T19:28:40-05:00 — `d1922b2de8ac` — docs: consolidate evidence-backed closures in todo
- 2026-10-22T17:33:20-05:00 — `25d4bf24f279` — fix(railway): define deterministic Web build and health check
- 2026-10-22T17:33:13-05:00 — `8e451d752a13` — fix(railway): expose health endpoint and honor assigned port
- 2026-10-22T17:19:41-05:00 — `c83705e008a9` — fix(web): bind production listener to container interface
- 2026-10-22T17:19:29-05:00 — `52bbb8bb46ce` — fix(web): bind production listener to container interface
- 2026-10-22T17:19:07-05:00 — `919632f00c2b` — fix(web): avoid registering HTTP server listener twice
- 2026-10-22T17:14:19-05:00 — `5fa38851f4f7` — fix(ci): make ARKI continuity snapshot read-only
- 2026-10-22T16:20:13-05:00 — `bec9a7a93147` — fix(arki): preserve FROZEN_READ_ONLY in autonomy orchestrator
- 2026-10-22T15:52:07-05:00 — `8c6c9e0515a6` — fix(ci): restore valid read-only F1-F10 and MO11 evidence workflow
- 2026-10-22T15:49:01-05:00 — `b312443809f8` — fix(ci): remove duplicate evidence workflow header
- 2026-10-22T15:45:36-05:00 — `3bf6a731d848` — test(arki): enforce frozen autonomy boundary
- 2026-10-22T15:44:44-05:00 — `d080abe78809` — fix(arki): keep frozen items blocked in autonomy planner
- 2026-10-22T15:43:50-05:00 — `8c110720b404` — fix(arki): repair malformed autonomy orchestrator block
- 2026-10-22T15:41:55-05:00 — `ead473cbde7c` — Merge branch 'main' into fix/maqueta-viva-runner-20261022
- 2026-10-22T15:30:16-05:00 — `99635af39ce2` — Merge pull request #86 from YvanCastilloQuezada/fix/arki-continuity-workflow-readonly-20261021
- 2026-10-22T15:20:46-05:00 — `577ea7c3d53d` — fix(ci): provision MariaDB and test secrets for MO11 evidence
- 2026-10-22T15:13:53-05:00 — `c3efb157df9a` — fix(ci): repair read-only ARKI evidence workflows
- 2026-10-22T15:11:16-05:00 — `98cbbdae7863` — Merge branch 'main' into audit/deepseek-f5-f9-redteam-v1
- 2026-10-22T15:11:05-05:00 — `3c094fe9eab3` — fix(ci): repair ARKI workflow definitions on current main
- 2026-10-22T14:57:41-05:00 — `ca1e9b19ffc6` — Repair ARKI state, assembly registry, and CI blockers
- 2026-10-22T14:47:16-05:00 — `dab843e8bdb5` — Remove duplicate verification fields from assembly registry
- 2026-10-22T14:40:41-05:00 — `96437ae3ce0c` — Repair duplicate keys in ARKI master map state
- 2026-10-22T14:40:09-05:00 — `16e6266030ed` — Repair duplicate keys in ARKI master map state
- 2026-10-22T10:30:59-05:00 — `a5a2415010d7` — Merge branch 'main' into feat/arbol-vivo-autoensamblaje-20261011
- 2026-10-22T10:28:45-05:00 — `712c1db95dd0` — Merge pull request #67 from YvanCastilloQuezada/docs/av-ui-001-preparation-20261010
- 2026-10-22T10:23:54-05:00 — `83b270b9cace` — Merge branch 'main' into feat/arbol-vivo-autoensamblaje-20261011
- 2026-10-22T10:20:02-05:00 — `9aab3621abcc` — Merge branch 'main' into feat/arki-frontend-assembly-v1
- 2026-10-22T10:19:09-05:00 — `71189bb896f1` — Merge branch 'main' into docs/av-ui-001-preparation-20261010
- 2026-10-22T10:07:35-05:00 — `a3f9d9436eba` — Merge branch 'main' into feat/f7-f8-integral-closure
- 2026-10-22T09:59:20-05:00 — `e0baceadce78` — Merge branch 'main' into feat/arbol-vivo-autoensamblaje-20261011
- 2026-10-22T09:55:08-05:00 — `2773bcdc901d` — Merge branch 'main' into docs/av-ui-001-preparation-20261010
- 2026-10-22T09:50:02-05:00 — `0ae8e31ddf84` — Merge branch 'main' into feat/arki-autonomy-memory-main-20261013
- 2026-10-22T09:48:16-05:00 — `da1592c5a6f2` — Merge pull request #31 from YvanCastilloQuezada/feat/arki-education-motor-readiness
- 2026-10-22T09:46:58-05:00 — `4ec36e4064cf` — Merge pull request #54 from YvanCastilloQuezada/test/maqueta-viva-construction-waves-e3
- 2026-10-22T09:45:21-05:00 — `ce112be50aef` — Merge pull request #42 from YvanCastilloQuezada/feat/e2e002-spatial-reasoning-phase1
- 2026-10-22T09:44:53-05:00 — `3c5d1a33c67b` — Merge pull request #52 from YvanCastilloQuezada/ci/arki-f1-f10-evidence-runner-v1
- 2026-10-22T09:42:19-05:00 — `95d874a0745a` — Merge branch 'main' into audit/deepseek-f5-f9-redteam-v1
- 2026-10-22T09:40:29-05:00 — `86220ed7c8b4` — Merge branch 'feat/arbol-vivo-autoensamblaje-20261011' into feat/arki-autonomy-orchestrator-20261013
- 2026-10-22T09:35:48-05:00 — `6f7ba821bd02` — docs(memory): correct branch audit progress after second batch
- 2026-10-22T09:35:40-05:00 — `b85b6a931cdf` — docs(memory): record second batch of branch comparisons
- 2026-10-22T09:35:32-05:00 — `ac54871e26af` — docs(memory): format second batch comparison table
- 2026-10-22T09:35:29-05:00 — `0330aebaa2d4` — Merge branch 'main' into audit/arki-continuity-daily-20261014
- 2026-10-22T09:35:23-05:00 — `7865bfff35fc` — docs(memory): extend branch audit with ten additional comparisons
- 2026-10-22T09:33:37-05:00 — `2945bfa081dc` — docs(memory): append ARKI continuity update for branch audit and local environment
- 2026-10-22T09:33:33-05:00 — `519965a9b6ea` — docs(memory): update branch catalog with priority audit findings
- 2026-10-22T09:33:20-05:00 — `25cf01e1bc3f` — docs(memory): correct branch audit count and add priority commit inspection
- 2026-10-22T09:23:59-05:00 — `84790a05c21f` — docs(arki): record 2026-10-22 continuity and publication blocker evidence
- 2026-10-22T08:10:56-05:00 — `0122146d3f4d` — docs(arki): document continuity generator and verification limits
- 2026-10-22T08:10:32-05:00 — `2c704516c04f` — docs(arki): document canonical handoff copy and continuity generator
- 2026-10-22T08:10:21-05:00 — `7c523af45165` — docs(arki): copy and update canonical ARKI handoff in memory branch
- 2026-10-22T03:28:52-05:00 — `767dd92e9ef6` — docs(arki): update branch audit progress count
- 2026-10-22T03:28:32-05:00 — `b0862ef2d7dc` — docs(arki): extend branch audit comparison batch
- 2026-10-22T03:28:15-05:00 — `82410f705b6c` — docs(arki): link current comparative branch audit
- 2026-10-22T03:27:57-05:00 — `8925c1d156ef` — docs(arki): record comparative SICL Web branch audit
- 2026-10-22T02:49:52-05:00 — `177cab2e21ea` — docs(revivir-arki): record 14 of 14 MO22 integration checks
- 2026-10-22T02:48:54-05:00 — `e7e3c68b88c7` — docs(revivir-arki): record integration and adapter trace findings
- 2026-10-22T02:45:38-05:00 — `422a232f3cef` — docs(revivir-arki): add continuity evidence register
- 2026-10-22T02:32:38-05:00 — `5a995e4aa6ae` — test(storage): cover authorization revalidation edge cases
- 2026-10-22T01:30:22-05:00 — `71fdbc925245` — Merge pull request #55 from YvanCastilloQuezada/feat/arbol-vivo-precedencias-seguras-20261010
- 2026-10-22T00:02:55-05:00 — `80773aeb068f` — fix(storage): revalidate authorization after read
- 2026-10-21T08:42:14-05:00 — `ba9878b1b8a8` — docs(arki): record merge and recovered continuity CI evidence
- 2026-10-21T04:50:17-05:00 — `e7237c6f8c67` — docs(arki): correct memory consolidation path from source audit
- 2026-10-21T04:50:00-05:00 — `752087b8cb24` — docs(arki): extend commit catalog across older main history
- 2026-10-21T04:49:50-05:00 — `e433aa77e26c` — docs(arki): expand branch catalog with deeper main histories
- 2026-10-21T04:47:47-05:00 — `a0081ae04418` — docs(arki): catalog sicl web branches for memory audit
- 2026-10-21T04:46:14-05:00 — `d5e81e34a7dc` — docs(arki): record memory persistence integration gap
- 2026-10-21T04:44:21-05:00 — `905999edcc9b` — docs(arki): catalog branch heads and memory-related commit history

## Fuentes complementarias
- `docs/arki-master-map/ARKI_CONTINUITY_NEW_CHAT_PROTOCOL.md` — protocolo de arranque y actualización.
- `docs/arki-master-map/ARKI_M10_001_MACROORDERS.md` — ruta de macroórdenes.
- `docs/arki-master-map/ARKI_BOLSA_IDEAS_DOBLE_FECHA_ESTADO_BIC_008.md` — doble fecha de ideas.
- `docs/arki-master-map/ARKI_BOLSA_IDEAS_CRONOLOGIA_BIC_007.md` — cronología verificada.
- `docs/arki-master-map/ARKI_CONTINUITY_EVENTS.jsonl` — eventos declarados; nunca sustituye eventos Core.

## Pendientes de continuidad
- Conectar captura automática de decisiones de conversación con autorización y trazabilidad.
- Verificar CI del workflow y lectura en un chat nuevo.
- Reconciliar la continuidad documental con el Event Store Core sin duplicarlo.
