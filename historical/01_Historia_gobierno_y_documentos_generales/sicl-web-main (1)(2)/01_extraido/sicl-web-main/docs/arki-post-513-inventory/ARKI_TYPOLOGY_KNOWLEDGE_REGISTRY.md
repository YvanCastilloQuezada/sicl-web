# ARKI Typology Knowledge Registry

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Conteos auditados

`TYPOLOGIES_MENTIONED = 27`; `TYPOLOGIES_WITH_STRUCTURED_KNOWLEDGE = 8`; `TYPOLOGIES_WITH_REASONING_EVIDENCE = 6`; `TYPOLOGIES_WITH_TRANSFER_EVIDENCE = 2`; `TYPOLOGIES_WITH_GEOMETRIC_EVIDENCE = 2`; `TYPOLOGIES_WITH_PROFESSIONAL_LEVEL_EVIDENCE = 0`.

Los conteos distinguen capítulos editoriales de records, fixtures y exámenes. Un capítulo ARKI-BOOK prueba contenido/UI, no conocimiento especializado.

## Registro resumido

| ID/nombre | Fuente y records | Evidencia | Madurez y límite |
|---|---|---|---|
| RESIDENTIAL/HOUSE-A21-S1 | ARKI-BOOK III-T-01; `docs/exams/house-two-floor-existing-arki/` | geometría conceptual y tests de containment/non-overlap | DEMONSTRATED_CONCEPTUAL; UNKNOWN de shafts, no permitReady. |
| HOSPITAL | M0-K `TYP-HEALTHCARE` | round-trip y no-transfer frente a LIBRARY | FROZEN_BASELINE/PROVISIONAL; sin geometry ni regulación. |
| HOTEL | M0-K `TYP-HOSPITALITY` | retrieval histórico UNKNOWN | FROZEN_BASELINE; cobertura parcial. |
| INDUSTRY | M0-K `TYP-INDUSTRY` | ingestión/round-trip | FROZEN_BASELINE; processes/flows TO_BE_DECOMPOSED. |
| TERMINAL | M0-K `TYP-TRANSPORT` | retrieval histórico UNKNOWN | FROZEN_BASELINE; sin examen específico. |
| RESTAURANT | ARKI-BOOK, `scripts/arki_d62_restaurant_exam.ts`, exam JSON | reasoning funcional, UNKNOWN preservado | DEMONSTRATED_PARTIAL; geometría constructiva NOT_DEMONSTRATED, runtime histórico bloqueado. |
| LIBRARY | ARKI-BOOK y D6.2 harness | reasoning/control de incompatibilidad | DEMONSTRATED_PARTIAL; no record especializado canonizado. |
| MUNICIPAL_ARCHIVE_READING_ROOM | D6.2 generic fixture/result | retrieval, rationale, UNKNOWN, transfer ADAPT/UNKNOWN | DEMONSTRATED_PARTIAL; sin geometry. |
| CIVIC_CONSULTATION_UNIT | D6.2-M minimal bridge | knowledge→topology y perturbación | DEMONSTRATED_PARTIAL; geometry NOT_IMPLEMENTED_BY_DELTA. |
| CIVIC_SERVICE_MICROCASE | D6.3-G bridge | dos geometrías SVG, lineage, 12 gates | DEMONSTRATED_CONCEPTUAL; funcional UNKNOWN, normativa NOT_EVALUATED. |
| ANIMAL_RESCUE/SHELTER | E1-K blind exam | reasoning y transferencia ADAPT | DEMONSTRATED_PARTIAL; examen niega knowledge especializado, learning case-scoped. |
| CARE, EDUCATION, OFFICE, LABORATORY, LOGISTICS, RETAIL, MARKET, MUSEUM, SPORTS, RELIGIOUS, JUSTICE, EMERGENCY, MIXED-USE, CAMPUS, URBAN_PUBLIC_REALM | 23 capítulos ARKI-BOOK | contenido editorial | DOCUMENTED_ONLY; no records/test/geometry específicos. |

## Interpretación

`MENTIONED` no equivale a `HAS SOURCE MATERIAL`; source material no equivale a structured knowledge; structured knowledge no equivale a reasoning/transfer/geometry; ninguno de esos estados equivale a diseño profesional. Los cuatro records M0-K (`HOSPITAL`, `HOTEL`, `INDUSTRY`, `TERMINAL`) son PROVISIONAL/PARTIAL. No existe tipología con evidencia simultánea de structured knowledge, reasoning, transfer, geometry y nivel profesional.

**REUSE:** fixtures y controles de no transferencia. **CONNECT:** registry↔source/evidence/tests. **EXTEND:** cobertura y métricas tipológicas. **BUILD:** normativa, BIM y diseño profesional. **RESEARCH:** generalización y validez cross-typology. La autoridad de canonización es HUMAN_ARCHITECT/Chief Architect.

## Referencias
[1] `client/src/pages/ArkiBookPage.tsx`
[2] `client/src/pages/arki-book.test.ts`
[3] `docs/arki-m0k/corpus-ingestion.json`
[4] `docs/arki-d62/restaurant-exam-result.json`
[5] `docs/arki-d62/generic-fixture-result.json`
[6] `docs/arki-d63g/microcase-result.json`
[7] `docs/exams/ARKI-E1-K-BLIND-LEARNING-EXAM-2026-09-20.md`

## Excel evidence addendum — typology and multiscale knowledge

The historical workbooks show that typology was intended to be modeled as a **service/operating system**, not as a room catalogue. The canonical research lineage classifies hospital, hospitality/hotel, industrial, transport/terminal and later industrial, logistics, food/cold-chain, hospital/healthcare and laboratory/biosafety stress tests through actors, processes, flows, support systems, capacity, concurrency, hazards, controls, evidence and performance. The D6.1 workbook preserves the multiscale graph and warns that `MULTISCALE ≠ STRICT CONTAINMENT TREE`; functional unit and level relationships may be many-to-many and are not automatically parent-child.

The workbooks also provide the curricular distinction needed for interpreting the 23 ARKI-BOOK typology chapters: `TYPOLOGY ≠ TEMPLATE`, `TRANSFER ≠ COPY`, `DWELLING ≠ ROOM LIST`, `OPERATION ≠ ROOM LABEL`, and `PROGRAM ≠ DESIGN`. These are documented principles and evaluation targets. They do not upgrade chapters with no source record, exam, fixture or transfer evidence into structured typological knowledge. In the audited baseline, M0-K still contains four provisional structured typologies (hospital, hotel, industry and terminal), while several other typologies are supported only by editorial chapters or bounded cases.

The Excel evidence therefore supports a **knowledge coverage map**, not a claim that ARKI can professionally design every named typology. It also confirms that typological transfer must preserve subject, process, state, hazard, capacity, time, control and jurisdiction differences, with `TRANSFER`, `ADAPT`, `DO_NOT_TRANSFER` or `UNKNOWN` recorded explicitly.
