# ARKI Knowledge Map

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Resultado cuantitativo

M0-K contiene 13 sources, 10 knowledge records, 9 FACT/K7 promovidos con autorización humana, 1 record retenido no canónico, 15 domain primitives, 4 typologies provisionales y 1 strategy. La persistencia canónica remota está **BLOCKED** (`urlConfigured=false`, `tokenConfigured=false`, `writePerformed=false`).

## Mapa por dominio

| Dominio | Estado | Qué está probado | Qué no debe inferirse |
|---|---|---|---|
| Arquitectura | PARTIALLY_KNOWN | invariantes abstractos y casos razonados | conocimiento profesional integral |
| Programa, actividades | KNOWN/PARTIALLY_KNOWN | separación de actividad, lista, tabla, área y diseño | programa normativo universal |
| Usuarios, relaciones, espacio | PARTIALLY_KNOWN | actores, relaciones y límites espaciales acotados | comportamiento completo |
| Topología, circulación, flows | PARTIALLY_KNOWN | nodos, relaciones y flujos conceptuales | solución ejecutiva |
| Geometría, representación, visualización | OBSERVED_ONLY | SVG, 2D y massing de fixtures | exactitud constructiva |
| Capacidad, temporalidad, operación | PARTIALLY_KNOWN | estrategias y throughput como casos | modelo operacional validado |
| Hazards/resiliencia/contexto | OBSERVED_ONLY/PARTIALLY_KNOWN | hipótesis y UNKNOWN | seguridad o riesgo certificado |
| Accesibilidad | NOT_FOUND como knowledge canónico | no hay corpus estructurado suficiente | cumplimiento legal |
| Clima, bioclimática, envolvente | NOT_FOUND | no hay records verificables | diseño pasivo |
| Estructura, MEP, construcción, materiales | NOT_FOUND | ausencia de contratos/modelos | coordinación técnica |
| Costos | NOT_FOUND | sólo simulación histórica | precio o presupuesto |
| Normativa | OBSERVED_ONLY/NOT_VERIFIED | menciones y gates humanos | vigencia o jurisdicción |
| Urbanismo, territorio, paisaje | NOT_FOUND | no hay GIS/catastro verificable | análisis territorial |
| BIM | OBSERVED_ONLY | límites y referencias documentales | IFC/DWG/RVT interoperable |
| AR | NOT_FOUND como conocimiento | vista experimental | survey georreferenciado |
| Professional practice | NOT_FOUND | review record técnico | licencia, sello o responsabilidad |

## Estructura epistemológica

`docs/arki-m0k/human-promotion-review.json` separa `promotedToFact` de `notPromoted`. KN-000008 queda HYPOTHESIS/K2_CANDIDATE; STR-000001 es PROPOSED. No se halló un registro de knowledge con estado canónico CONTEXT_SPECIFIC, rejected, superseded o conflicted. Esos estados sí aparecen en decisiones/recomendaciones y no deben mezclarse con knowledge.

La provenance de knowledge apunta a `ABSTRACT_ONLY_FROM_USER_PROVIDED_WORKBOOK`; el bundle fija `ABSTRACT_AND_REFERENCE_ONLY` y `sourceTextReproduced=false`. Typologies y strategy tienen enlaces granulares incompletos o nulos. Por eso el corpus es reutilizable como referencia abstracta, no como reproducción textual, normativa o profesional.

## Core y límites

`server/siclCore.ts` valida referencias source/evidence y mantiene snapshots de proyecto, pero no muestra una colección canónica M0-K equivalente. `server/coreHttpClient.ts` exige `SICL_CORE_URL` y `SICL_CORE_SERVICE_TOKEN`. El resultado correcto es **DEMONSTRATED_LOCAL/BLOCKED_REMOTE**, no conocimiento remoto confirmado.

**REUSE:** invariantes y guards. **CONNECT:** claims→sources→evidence→tests. **EXTEND:** registros de dominio y enlaces granulares. **BUILD:** corpus normativo/profesional. **RESEARCH:** validez, cobertura y generalización. La autoridad de canonización es humana.

## Referencias
[1] `docs/arki-m0k/manifest.json`
[2] `docs/arki-m0k/corpus-ingestion.json`
[3] `docs/arki-m0k/human-promotion-review.json`
[4] `server/siclCore.ts`
[5] `server/coreHttpClient.ts`
[6] `docs/arki-e1-k/manifest.json`

## Excel evidence addendum — D1–D6.1 lineage

The available workbooks establish a versioned research lineage that must remain distinct from current runtime capability. The corpus workbook records a **DOMAIN + EPISTEMIC + REASONING + LEARNING** architecture; the governing invariants include `SOURCE ≠ KNOWLEDGE`, `PROGRAM ≠ ROOM LIST ≠ AREA TABLE ≠ DESIGN`, `STRATEGY ≠ REALIZATION`, `UNKNOWN WITHOUT RESOLUTION PATH = INCOMPLETE DIAGNOSIS`, and `GRAPHICAL PRECISION ≠ EPISTEMIC PRECISION`. It also records the learning loop `OBSERVATION → CASE EVIDENCE → CANDIDATE KNOWLEDGE → TEST → REFINEMENT → PROMOTION DECISION`.

The D1–D6.1 workbook lineage adds the following evidence: Delta 1–3 separated knowledge kinds, project facts and requirements, and typed relationships such as functional, access, circulation, visual, acoustic, privacy, service, environmental, security, temporal and sectional/vertical relations. Delta 4 corrected the parti taxonomy, separating organization, form/massing, void, circulation, section, access, support/service and site response. Delta 5 defined the topology-first sequence from program and activity system through relationship graph, functional clusters, multiple topology hypotheses, evaluation/trade-offs and canonical geometry. Delta 6.1 formalized `FACT`, `RELATIONSHIP`, `INVARIANT`, `PATTERN`, `HEURISTIC`, `STRATEGY`, `DESIGN_MOVE`, `COUNTEREXAMPLE`, `REGULATORY_REQUIREMENT`, `REFERENCE_VALUE`, `HUMAN_DECISION`, promotion states, UNKNOWN taxonomy and the distinction `EXECUTION ≠ RETRIEVAL ≠ TRANSFER ≠ GENERALIZATION ≠ LEARNING`.

The same workbooks explicitly constrain interpretation: White, Neufert and Plazola are reference sources under `ABSTRACT_AND_REFERENCE_ONLY`; Plazola extraction is recorded as partial/visual-corpus-limited, and typological records remain provisional with partial source and knowledge coverage. Therefore these Excel records are **research and curriculum evidence**, not proof that every listed rule is a current FACT, implemented runtime behavior, or professional design capability. Evidence sources: `docs/arki-m0k/corpus-ingestion.json`, `docs/arki-m0k/manifest.json`, `docs/arki-d61/manifest.json`, and the historical workbook lineage available under `docs/arki-d61/` and the extracted workbook inventory used for this audit.
