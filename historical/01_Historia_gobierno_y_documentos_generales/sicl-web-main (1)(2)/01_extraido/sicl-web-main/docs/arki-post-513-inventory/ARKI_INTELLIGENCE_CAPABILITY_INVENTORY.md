# ARKI Intelligence Capability Inventory

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Conclusión

ARKI hoy es un sistema local de ingestión/provenance, retrieval acotado, reasoning controlado, evaluación de invariantes y representación 2D/3D conceptual. Puede almacenar y replayar estados locales y exigir revisión humana. No se demostró comprensión arquitectónica general de voz o visión, regulación, BIM/CAD, cálculo, aprendizaje persistente, generalización ni profesionalización autónoma.

## Inventario de capacidades

| ID | Capacidad y ubicación | Entrada → salida | Estado canónico | Evidencia y límite |
|---|---|---|---|---|
| C01 | Texto/Command Bar; `client/src/components/CommandBar.tsx` | texto, micrófono o archivo → encargo/evento | IMPLEMENTED_INTERFACE | Rutas y componentes compilados; no prueba comprensión semántica ni tutoría. |
| C02 | Ingestión multimodal; `server/routers.ts:49-68`, `server/visualField.ts` | cámara, imagen, PDF, libro, plano → `SOURCE_INGESTED`, OCR y `AI_PROPOSED` | DEMONSTRATED_PARTIAL | `server/arkiOcr.test.ts` y D6.4; revisión humana obligatoria, OCR provisional. |
| C03 | Provenance/Source Library; `client/src/pages/SourceLibraryPage.tsx` | `projectId`, fuente, versión → fuente consultable con provenance | DEMONSTRATED_LOCAL | Conectada al snapshot local; Core remoto no verificado. |
| C04 | Knowledge corpus M0-K; `docs/arki-m0k/corpus-ingestion.json` | fuentes abstractas → 10 records, 9 FACT/K7 humanos, 1 no canónico | DEMONSTRATED_LOCAL | `human-promotion-review.json`; escritura remota bloqueada. |
| C05 | Retrieval/transfer; `server/arkiD62ReasoningHarness.ts` | snapshot + contexto → IDs recuperados y `TRANSFER/ADAPT/DO_NOT_TRANSFER/UNKNOWN` | DEMONSTRATED | `server/arkiD62ReasoningHarness.test.ts`; heurística acotada, no aprendizaje. |
| C06 | Reasoning/contraejemplos; `executeArchitecturalReasoning` | requisitos y perturbaciones → déficits, estrategias, realizaciones y trace | DEMONSTRATED_IN_CONTROLLED_TEST | PASS histórico/local; no causalidad general ni decisión autónoma. |
| C07 | Topología→geometría; `server/arkiD63GeometricBridge.ts` | topología conceptual → candidatos A/B, mutaciones, SVG | DEMONSTRATED_CONCEPTUAL | 12 gates y tests focales; SVG no es modelo constructivo. |
| C08 | Visualización 2D/3D/massing; `UPAO001SpatialViewer.tsx`, `UPAO001MassingViewer3D.tsx` | representación espacial → SVG/massing | DEMONSTRATED_PARTIAL | Fixtures UPAO-001; no BIM/GIS/CAD. |
| C09 | Proyecto/version/replay; `server/storage.ts`, `server/siclCore.ts` | snapshot + `expectedVersion` → eventos y ejecución local versionada | DEMONSTRATED_LOCAL | Persistencia remota de reasoning/M0-K BLOCKED. |
| C10 | Human review/decision; `server/routers.ts:162-190` | recomendación + actor/confirmación → review/decision auditables | IMPLEMENTED | Gate de software; no firma profesional ni aprobación normativa. |
| C11 | AR/geolocation/maps; `ArkiRealityView.tsx`, `_core/map.ts` | cámara/GPS/proxy → overlay y mapas potenciales | EXPERIMENTAL / REACHABLE_BUT_UNUSED | No CRS, datum, survey, key ni integración territorial demostrada. |
| C12 | Cost/evaluation; `docs/costs/*`, `paretoModel.ts` | métricas/simulación → comparaciones visuales | DOCUMENTED_ONLY | No pricing, cantidades ni cotización contractual. |
| C13 | Voz/audio; `_core/voiceTranscription.ts` | audio potencial → transcripción | REACHABLE_BUT_UNUSED | No consumidor runtime `transcribeAudio`; UI sólo indica escucha. |

## Matriz de capacidad

`CAN_DISPLAY=DEMONSTRATED_PARTIAL`; `CAN_STORE=DEMONSTRATED_LOCAL`; `CAN_RETRIEVE=DEMONSTRATED`; `CAN_REASON=DEMONSTRATED` sólo acotado; `CAN_GENERATE=DEMONSTRATED_CONCEPTUAL`; `CAN_EVALUATE=DEMONSTRATED_PARTIAL`; `CAN_VERIFY=DEMONSTRATED_PARTIAL` sólo invariantes de software; `CAN_EXECUTE=DEMONSTRATED` en procedimientos locales; `CAN_LEARN=DEMONSTRATED_CASE_SCOPED` y humano-gated; `CAN_GENERALIZE=NOT_DEMONSTRATED`; `CAN_PROFESSIONALIZE=NOT_VERIFIED`.

## Reusabilidad y futuro

**REUSE:** snapshot, provenance, guards epistemológicos, OCR adapter, Source Library, harness y viewers. **CONNECT:** Book↔assessment, voz↔contexto, cámara↔proyecto, reasoning↔review. **EXTEND:** aprendizaje persistente, modelo disciplinar, cambio/as-built y evaluación. **BUILD:** identidad profesional, coordinación BIM/MEP/estructura, billing/CRM/legal. **RESEARCH:** causalidad general, regulación verificable, survey/GIS, precios y generalización. Ninguna clasificación autoriza implementación durante esta orden.

## Limitaciones y autoridad

Los tests prueban contratos e invariantes locales, no verdad profesional. `AI_PROPOSED` no es FACT; `UNKNOWN` no habilita invención. La aceptación de conocimiento, selección de alternativa, validación geométrica y uso profesional requiere revisión humana documentada.

## Referencias
[1] `package.json`
[2] `client/src/App.tsx`
[3] `server/routers.ts`
[4] `server/arkiD62ReasoningHarness.ts`
[5] `server/arkiD63GeometricBridge.ts`
[6] `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md`
[7] `docs/arki-d64/manifest.json`

## Excel evidence addendum — capability interpretation

The D1–D6.1 workbooks document a broad **research capability model**: represent architectural knowledge by kind and scope; distinguish facts from hypotheses and project conditions; reason through typed relationships, flows, topology and multiscale systems; generate alternatives; evaluate trade-offs; preserve UNKNOWN; test transfer and restraint; and record learning/promotion states. These are documented capability requirements and design contracts.

The audit therefore classifies workbook-only claims as `DOCUMENTED_ONLY` or `RESEARCHED` unless matched by runtime symbols and evidence. The current demonstrated boundary remains narrower: local source/OCR/provenance ingestion, bounded retrieval/reasoning, transfer decisions, topology and conceptual geometry bridges, controlled evaluation, local versioning and human-gated promotion. The workbooks do not establish professional BIM/CAD/GIS, regulatory compliance, construction documentation, universal typology competence, autonomous learning or generalization.
