# ARKI Learning Curriculum

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Currículo reconstruido

| Lección/bloque | Qué recibió ARKI | Implementación/test | Resultado, retención y transferencia |
|---|---|---|---|
| M0-K / White, Neufert, Plazola | abstracciones de 13 sources, no reproducción textual | `corpus-ingestion.json`, foundation tests | 9 FACT humanos y 1 no canónico; local, remoto BLOCKED; reutilizable como referencia. |
| SICL epistemology | separación SOURCE/EVIDENCE/KNOWLEDGE, rights, UNKNOWN | `client/src/arkiKnowledgeCorpusFoundation.test.ts` T1-T11 | IMPLEMENTED local; guards reutilizables, no cobertura profesional completa. |
| D6.1 | persistencia, provenance, scope, rights, human validation | roundtrip histórico: 30 records, 9 facts, 4 UNKNOWN | HISTORICAL/FROZEN; restaurant runtime bloqueado. |
| D6.2/D6.2-M | retrieval→requirements→deficits→strategies→topology | harness 4/4 y focused 7/7 históricos | DEMONSTRATED_CONCEPTUAL; geometry excluida, project-scoped. |
| D6.3-G | topology→candidate geometry, mutation y lineage | 12 gates, 3/3 focused tests, SVG A/B | DEMONSTRATED_CONCEPTUAL; no winner, SVG no canonical model. |
| D6.4 | cámara/PDF/OCR/Visual Field y Source Library | OCR tests y manifest | IMPLEMENTED_PENDING_FINAL_VALIDATION; AI_PROPOSED, no auto-promotion. |
| E-KNOW Block 2 | SPACE/ROOM y SPATIAL_BOUNDARY/WALL | 6/6 focused tests | EXPERIMENTAL HYPOTHESIS/K2; Core no modificado. |
| E1-K blind exam | adaptación, counterexample protocol y learning candidate | manifest y exam | learning CASE-SCOPED K2_CANDIDATE; persistence/generalization blocked. |
| L2 | transfer/adapt/do-not-transfer/unknown, replay y versioning | 4/4 focales, 177/177 suite en checkpoint | DEMONSTRATED_LOCAL; remoto NOT_DEMONSTRATED. |
| ARKI-BOOK | contenido editorial y perfiles de lectura | `arki-book.test.ts`: 23 capítulos públicos | IMPLEMENTED_INTERFACE; no assessment/progression/tutor. |

## Qué permanece accesible

Lo más reproducible es el código local, fixtures, manifests y tests. Los checkpoints D6.x/E1-K no deben confundirse con estado actual reejecutado. M0-K es accesible como JSON local, pero no como conocimiento confirmado en Core remoto. P9.4/P10 aparecen como contratos reutilizados, no como engines independientes. `reasoning grammar`, `synthesis grammar` y `learning grammar` no se encontraron como artefactos separados.

## Clasificación de reutilización

**REUSE:** guards, fixtures, round-trip, reasoning harness y curriculum editorial. **CONNECT:** currículo↔assessment↔learner state y Book↔project. **EXTEND:** learning ledger persistente, evaluación y cobertura tipológica. **BUILD:** tutor adaptativo, interoperabilidad profesional y currículo canónico si faltan contratos. **RESEARCH:** generalización, causalidad y validez normativa.

## Limitaciones y autoridad

Se probó software y microcasos, no educación autónoma. `RETRIEVAL ≠ LEARNING`; `EXECUTION ≠ LEARNING`; `TRANSFER ≠ GENERALIZATION`. Product Owner y Chief Architect deben aceptar cualquier futura lección, promoción o descongelamiento; Human Architect conserva la autoridad de dominio.

## Referencias
[1] `docs/arki-m0k/manifest.json`
[2] `docs/arki-m0k/corpus-ingestion.json`
[3] `client/src/arkiKnowledgeCorpusFoundation.test.ts`
[4] `docs/arki-d61/D6.1-REPORT.md`
[5] `docs/arki-d62m/D6.2-M-REPORT.md`
[6] `docs/arki-d63g/D6.3-G-REPORT.md`
[7] `docs/arki-d64/D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md`
[8] `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md`
[9] `client/src/pages/arki-book.test.ts`

## Excel evidence addendum — curriculum, practice and promotion

The workbook lineage defines the educational loop as `PRINCIPLE → EXPLANATION → PRACTICE → EVALUATION → CORRECTION → TRANSFER → HUMAN REVIEW`. It requires application, non-application and transfer cases, and explicitly states that imported rows begin as curricular/research knowledge only: no automatic promotion to learned, mature, transferred or human-reviewed status is permitted. The D6.1 learning classes are `L1_PARAMETER`, `L2_RELATIONSHIP`, `L3_STRUCTURAL` and `L4_REASONING_PATTERN`; promotion states include `OBSERVED`, `CANDIDATE`, `SUPPORTED`, `TRANSFER_TESTED`, `GENERALIZED_CANDIDATE`, `CANONICAL/HUMAN-CONFIRMED`, `CONTEXT_SPECIFIC`, `CONFLICTED`, `SUPERSEDED` and `REJECTED`.

The curriculum implications are concrete. L00–L08 must teach foundations, human/activity/equipment, space, relationships, topology, typology and representation through positive, negative and transfer exercises. L09–L32 extend the same contract to functional units, dwelling, small non-residential architecture, material, assembly, campus, public space, block, neighborhood, district, city and metropolis. The workbooks repeatedly require preservation of UNKNOWN, contradiction, provenance, applicability and non-applicability, and distinguish reference dimensions from project requirements.

The current runtime demonstrates only bounded portions of this curriculum. The workbook evidence is therefore recorded here as **curriculum specification and research provenance**, while D6.2-M, D6.3-G, L2 and E1-K provide the separate implementation/execution evidence. A valid learning event still requires a before-state, observation, challenge, transfer test, counterexample handling, promotion decision and persistence; the audited E1-K event remains case-scoped and not generalized.
