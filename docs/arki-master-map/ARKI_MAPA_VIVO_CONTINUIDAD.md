# ARKI — MAPA VIVO DE CONTINUIDAD

> GENERADO A PARTIR DE GIT + EVENTOS DECLARADOS. No es el Event Store canónico del Core. No verifica CI, arquitectura ni despliegue.

## Cómo retomar en un nuevo chat
1. Leer este documento y el historial `ARKI_CONTINUITY_EVENTS.jsonl`.
2. Comprobar SHA remoto y CI; no asumir que una declaración es evidencia ejecutada.
3. Continuar desde pendientes sin repetir inventarios ya documentados.

## Estado observado
- Rama: `main`
- Último SHA de cambios sustantivos (excluye snapshot): `a15597e2b2b51916d429afdec2ec4a8c77b72a20`
- Último commit: 2026-10-21T01:54:26-05:00 — fix(arki): correct continuity ledger parser
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

## Última acción registrada
- CONT-20261013-010 — Se habilita verificación offline por SHA en servidor privado; GitHub Actions no se usa como evidencia de aprobación hasta recuperar su operación. — IMPLEMENTED_AWAITING_LOCAL_EXECUTION

## Últimos 80 commits observados (no son aprobación)
- 2026-10-21T01:54:26-05:00 — `a15597e2b2b5` — fix(arki): correct continuity ledger parser
- 2026-10-21T01:12:35-05:00 — `2d2f0333181d` — Merge pull request #59 from YvanCastilloQuezada/feat/arki-integration-genealogy-20261013
- 2026-10-21T00:30:01-05:00 — `3018e9cc6992` — Merge pull request #62 from YvanCastilloQuezada/integration/arki-av035-main-20261015
- 2026-10-21T00:25:20-05:00 — `87d7059015a4` — ci: provide isolated MariaDB and session fixtures for MO22 tests
- 2026-10-20T23:58:14-05:00 — `8b40a717efa0` — feat(arki): harden receipt verification and operational self-improvement
- 2026-10-17T11:36:28-05:00 — `f5f450712e97` — Merge pull request #63 from YvanCastilloQuezada/ace87/remove-qr
- 2026-10-17T11:24:01-05:00 — `6fa1fb16a5c9` — test(mo29): track project resolver and secure core test fixtures
- 2026-10-17T11:00:16-05:00 — `015caa62bf45` — fix(mo29): gate authorized storage by verified local identity
- 2026-10-17T07:48:39-05:00 — `00891432b906` — ARKI MO08: guarded SQL local auth and verified isolated E2E
- 2026-10-17T05:14:00-05:00 — `3f7bc450cf53` — ARKI MO24-MO27: integrate source and parametric browser flows
- 2026-10-17T04:24:08-05:00 — `eda60ad12ce4` — feat(arki): integrate MO22 storage bridge and TypeScript declarations
- 2026-10-17T04:20:36-05:00 — `67542ffa59ae` — feat(arki): checkpoint MO22 isolated storage components
- 2026-10-16T18:01:18-05:00 — `0f977158a47b` — docs: add ARKI-00 canonical continuity and Árbol Vivo integration handoff
- 2026-10-15T18:00:08-05:00 — `ffecd30daf44` — fix(arki): AV036 F6 revocation and executor safeguards
- 2026-10-15T16:37:05-05:00 — `9914f5dfed15` — integrate(arki): AV035 tree and canonical map candidate
- 2026-10-14T00:05:49-05:00 — `a72e1a9d7258` — ACE87: remove legacy QR access components
- 2026-10-13T20:18:01-05:00 — `b0a37f1b3f06` — Add Ubuntu one-command SHA-pinned offline validation entrypoint
- 2026-10-13T19:17:26-05:00 — `2dea59b41907` — Record private-server validation protocol and pending evidence
- 2026-10-13T19:17:21-05:00 — `f46a5ca3cdd9` — Add one-command offline continuity verification with SHA-pinned report
- 2026-10-13T19:15:50-05:00 — `3bbe7de807a4` — Fix adversarial duplicate-event validation in continuity ledger loader
- 2026-10-13T19:14:32-05:00 — `82ef12ae4414` — Preserve continuity test diagnostics as CI artifact to identify failing step
- 2026-10-13T19:14:13-05:00 — `de61c119b16d` — Add adversarial tests for missing ledger, corrupt JSON, duplicate IDs and invalid evidence
- 2026-10-13T19:14:07-05:00 — `1621428e267d` — Allow isolated adversarial ledger validation without modifying production ledger
- 2026-10-13T19:14:01-05:00 — `80e6e96c3bad` — Fail closed on missing continuity ledger and stabilize branch naming in detached CI checkout
- 2026-10-13T17:59:43-05:00 — `bb0d358d7e84` — Enable continuity updates on main after merge and verify deterministic snapshot
- 2026-10-13T17:59:32-05:00 — `64a96b9cd8f0` — Test stable snapshot generation and source-only commit SHA
- 2026-10-13T17:59:27-05:00 — `246eb0352b0b` — Prevent self-referential continuity snapshot commit loop with source-only SHA
- 2026-10-13T17:59:20-05:00 — `e10187d43969` — Prepare deterministic continuity history selection for verification
- 2026-10-13T17:57:33-05:00 — `929d9693e475` — Track workflow repair and remaining CI gate in ARKI continuity ledger
- 2026-10-13T17:57:01-05:00 — `ff24dabdc7c5` — Run isolated continuity tests on PR and restrict snapshot publishing to branch pushes
- 2026-10-13T17:50:44-05:00 — `cfb6af43b87c` — Record latest living-map continuity hardening and CI verification blocker
- 2026-10-13T17:50:37-05:00 — `c1c3bf7b5a8b` — Expose last documented ARKI action and mandatory new-chat protocol in living map
- 2026-10-13T17:47:17-05:00 — `7ccbf698d9d0` — Specify mandatory ARKI new-chat handoff and append-only continuity acceptance protocol
- 2026-10-13T17:47:07-05:00 — `23c117467839` — Journal CI failure, scheduled continuity and hardened ledger work with evidence
- 2026-10-13T17:47:00-05:00 — `a24cd5b938c1` — Correct date validation regex in ARKI continuity ledger parser
- 2026-10-13T17:46:53-05:00 — `7a596c76bf0b` — Harden ARKI continuity event schema with typed fields and valid dates
- 2026-10-13T17:22:54-05:00 — `8b8a76dde4a4` — Gate ARKI living-map publication on deterministic continuity tests
- 2026-10-13T17:22:49-05:00 — `d3f10ab825e6` — Add fail-closed tests for durable ARKI continuity snapshot and evidence ledger
- 2026-10-13T17:20:39-05:00 — `9cb20e852e1e` — Automate ARKI continuity map generation on branch changes with nonrecursive publishing
- 2026-10-13T17:20:30-05:00 — `9a3d3eac9a45` — Seed append-only ARKI continuity decision and evidence ledger
- 2026-10-13T17:20:28-05:00 — `73c379486b40` — Implement deterministic ARKI continuity snapshot from Git history and explicit ledger
- 2026-10-13T15:32:06-05:00 — `3d9b4f2d9d93` — Require idea conception date, implementation commit date, and independently evidenced open/closed status in every idea card
- 2026-10-13T15:30:18-05:00 — `4bec9fb43ba9` — Add dated evidence timeline and preserve five newly compared branches with separate idea creation and commit dates
- 2026-10-13T15:23:09-05:00 — `3b9dcd01da82` — Recover ARE representation and ARKIDRAW primitives as connected subcapabilities with explicit evidence gaps
- 2026-10-13T15:19:59-05:00 — `520214888a4d` — Audit ARE and ARKIDRAW source semantics and classify complementary ideas without discarding historical branches
- 2026-10-13T14:49:25-05:00 — `b86429dff63f` — Execute third idea-bag macro batch: preserve 12 branches and group five more capability clusters
- 2026-10-13T14:46:46-05:00 — `528e4fbdf23e` — Continue macro-order batch: inspect 12 more branches and preserve historical architectural ideas
- 2026-10-13T14:39:18-05:00 — `c591972da480` — Correct idea inventory: preserve incomplete ideas even when Git history is fully in main
- 2026-10-13T14:36:44-05:00 — `e9e27737c89a` — Inventory 192 branches and extract initial cross-branch idea clusters with traceable comparison evidence
- 2026-10-13T14:34:29-05:00 — `b4e9b6646913` — Create idea bag with traceable candidate connectors and ten initial recovered capabilities
- 2026-10-13T14:30:58-05:00 — `c3740ad11bd7` — Advance M02-M03 using Core authority contract and historical debt classification
- 2026-10-13T14:30:41-05:00 — `41c658446b83` — Execute M01 multi-repository inventory and identify existing map authority branches
- 2026-10-13T14:29:33-05:00 — `c1a8df64436a` — Define ten gated ARKI recovery macro-orders and one-batch acceptance protocol
- 2026-10-13T14:20:07-05:00 — `fab1086a689e` — Audit 17 assembly files, reverse branch deltas, and real continuity workflow limitations
- 2026-10-13T14:17:00-05:00 — `1bc97dadf5d4` — Record branch divergence and local test evidence without claiming CI approval
- 2026-10-13T13:18:53-05:00 — `c482cbcfe5f4` — Inventory branch genealogy and main integration gates without altering canonical code
- 2026-10-11T18:39:19-05:00 — `1544b977ad34` — ACE85: synchronize validated local changes
- 2026-10-04T23:36:06-05:00 — `e7cc9f9cd2f3` — docs(master-map): make frontend assembly the immediate ARKI priority
- 2026-10-04T23:35:56-05:00 — `699528c16d9f` — feat(frontend): assemble primary ARKI surfaces and site-first nervous system
- 2026-10-04T23:33:27-05:00 — `4f1ee9cca287` — docs(master-map): register AGK T2/T3 evidence and delta policies
- 2026-10-04T23:33:17-05:00 — `f69edc07eece` — docs(agk): record T2 coordinate policy and T3 torture evidence
- 2026-10-04T23:17:05-05:00 — `135b06f271cf` — docs(agk): record OCCT bounded execution evidence
- 2026-10-04T18:14:48-05:00 — `2b7bfc8e1362` — docs(handoff): freeze ARKI continuity baseline before merge
- 2026-10-04T18:11:37-05:00 — `8d9d92ca9ae5` — docs(master-map): add ARKI triple-audit body map
- 2026-10-04T17:59:35-05:00 — `ca6915242d06` — docs(master-map): recover Phase 6 3D-to-2D fidelity gap
- 2026-10-04T17:53:16-05:00 — `7ec0ebf37e9a` — docs(master-map): define three-dashboard evolution and architectural testbed
- 2026-10-04T17:53:06-05:00 — `44b09dad5832` — chore(command-center): remove superseded hidden evolution block
- 2026-10-04T17:52:57-05:00 — `16519f5d5be6` — feat(command-center): add ideas-frozen board and 16-4-1 demo entry
- 2026-10-04T17:52:41-05:00 — `781538acd68e` — feat(design-funnel): add editable 120-floor demo brief to 16-4-1 explorer
- 2026-10-04T17:38:22-05:00 — `ea58cb11862e` — docs(master-map): make Delta 6.2 the governed ARKI knowledge gate
- 2026-10-04T17:38:10-05:00 — `00b0d0643073` — refactor(command-center): align organs with Delta 6.2 knowledge gate
- 2026-10-04T17:38:01-05:00 — `5f68223a2220` — feat(command-center): evolve local frontend with Delta 6.2 knowledge view
- 2026-10-04T16:30:20-05:00 — `364b628b4fd7` — docs(master-map): define localhost-only Command Center V1 and add federation evidence
- 2026-10-04T16:27:06-05:00 — `dbc1fd240c67` — docs(master-map): begin AR-LU Corporation organizational consolidation
- 2026-10-04T16:10:50-05:00 — `00fa82cc9baa` — docs(constitution): seal PF-05 Mutual Care as immutable fifth pillar
- 2026-10-04T15:59:43-05:00 — `260792551c38` — feat(command-center): register Superarchitect live map route
- 2026-10-04T15:59:38-05:00 — `8e67a7d579f8` — feat(command-center): add first Superarchitect Command Center
- 2026-10-04T15:59:36-05:00 — `9e6704e0feda` — feat(command-center): add evidence-bounded live map model
- 2026-10-04T15:52:52-05:00 — `462f02572d91` — docs(master-map): register computational intelligence architecture
- 2026-10-04T15:47:45-05:00 — `68c94a6cf186` — audit(master-map): register AI Laboratory and LUCA evidence

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
