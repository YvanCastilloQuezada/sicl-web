# ARKI Knowledge versus Software Gap Matrix

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Matriz obligatoria

| Capability | Knowledge exists? | Software exists? | Connected? | Demonstrated? | Missing piece |
|---|---|---|---|---|---|
| Invariants epistemológicos | YES, abstract FACT | YES | YES local | YES | remote canonical persistence |
| M0-K typologies | PARTIAL/PROVISIONAL | ingestion/round-trip | PARTIAL local | PARTIAL | source/evidence depth |
| OCR/visual observations | NO FACT; AI_PROPOSED | YES | PARTIAL | PARTIAL | semantic/professional validation |
| Reasoning bounded | PARTIAL domain knowledge | YES | YES local | YES controlled | broader causal model |
| Conceptual geometry | PARTIAL | YES bridge/viewers | YES local | YES conceptual | canonical construction model |
| AR/GIS/survey | NO verified knowledge | interface/adapters | NO/experimental | NO | CRS, datum, calibration, data |
| Regulatory reasoning | NO verified corpus | review routes | NO | NOT_VERIFIED | jurisdictional source and specialist gate |
| Learning/generalization | case candidate only | helpers/ledger types | NO remote | NOT_DEMONSTRATED | persistence, metrics, longitudinal cases |
| ARKI-BOOK tutoring | editorial content | UI | NO | UI only | assessment, progression, tutor contracts |
| BIM/MEP/structure | NOT_FOUND | NOT_FOUND sufficient | NO | NO | new discipline models and exchange |
| Pricing | simulation only | chart/model | NO | DOCUMENTED_ONLY | rates, quantities, quote and calibration |
| Professional practice | NOT_FOUND canonical | review/decision primitives | PARTIAL | NOT_VERIFIED | licensure, responsibility, sign-off |

## Case interpretation

The strongest **Case A** is local epistemic contracts and project snapshot. **Case B** includes Book/content plus reasoning/evaluation pieces that are not connected. **Case C** includes future regulatory, BIM, discipline and professional knowledge absent as sufficient software. **Case D** includes voice/map adapters and editorial UI where software exists without demonstrated domain knowledge. **Case E** includes autonomous generalization and a corporate ecosystem.

**REUSE:** Case A components. **CONNECT:** Case B. **EXTEND:** partial domain bases. **BUILD:** missing product/domain systems. **RESEARCH:** unresolved knowledge and validation. `NOT_FOUND` refers only to the audited baseline, not metaphysical absence outside the repository.

## Referencias
[1] `server/siclCore.ts`
[2] `docs/arki-m0k/corpus-ingestion.json`
[3] `server/arkiOcr.ts`
[4] `server/visualField.ts`
[5] `server/arkiD62ReasoningHarness.ts`
[6] `server/arkiD63GeometricBridge.ts`
[7] `client/src/pages/ArkiBookPage.tsx`
[8] `drizzle/schema.ts`

## Excel evidence addendum — research-to-software boundary

The Excel lineage identifies many concepts that are specified or teachable but not necessarily implemented: active topology as a derived view, capability dependency graphs, concurrency validation, hazard semantics, journey validity, multiscale relationships, learning promotion, transfer restraint and regression. The repository audit confirms that several are partial or conceptual rather than complete product systems.

For gap classification, the workbooks are evidence of `RESEARCHED` and sometimes `TEACHABLE`; they are not by themselves evidence of `IMPLEMENTED`, `VALIDATED`, `PERSISTED` or `PROFESSIONAL`. Each proposed mapping must therefore pass the existing reuse-first guardrails: one canonical geometry, one semantic system, no parallel engine, UNKNOWN distinct from PASS/FAIL, and human review before promotion. This addendum prevents the historical Excel matrices from being mistaken for executable modules.
