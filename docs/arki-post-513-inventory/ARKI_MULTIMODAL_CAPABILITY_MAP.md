# ARKI Multimodal Capability Map

## Alcance y baseline

Auditoría **READ-ONLY** contra `YvanCastilloQuezada/sicl-web`, `main@a565a90952c5b219e97f73607ff32db29bf8712d`. `HEAD == origin/main`; el worktree tiene seis documentos no rastreados preexistentes bajo `docs/arki-inventory/` y no tiene archivos versionados modificados. No se escribieron código, corpus, schemas, base de datos, estados, checkpoints, commits, push ni deploy.

**Regla epistemológica:** documentación no equivale a implementación; implementación no equivale a demostración; ejecución o retrieval no equivalen a aprendizaje; transferencia no equivale a generalización; una mención tipológica no equivale a conocimiento ni a capacidad de diseño profesional. La autoridad final permanece en Product Owner, Chief Architect y profesionales especialistas según el tipo de decisión.

**Evidencia transversal:** `package.json` declara `check`, `test`, `build` y `start`; `client/src/App.tsx` expone las rutas; `server/routers.ts` contiene `appRouter`; `server/siclCore.ts` define snapshots, knowledge, reviews, decisions y reasoning executions; `server/arkiD62ReasoningHarness.ts` y `server/arkiD63GeometricBridge.ts` implementan los puentes locales. El checkpoint registrado en `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` reporta 177/177 tests, TypeScript y build PASS, pero la presente auditoría no trató un reporte histórico como ejecución fresca.

## Evidencia, límites y autoridad humana

**Evidencia runtime:** los símbolos, rutas y pruebas locales citados demuestran contratos compilables o microcasos controlados; no se verificó un servidor HTTP vivo, navegación E2E ni escritura remota del SICL Core. **Evidencia histórica:** manifests y reportes D6.1–D6.4, E1-K y L2 corresponden a checkpoints que pueden tener HEAD distinto del baseline actual; se reutilizan como linaje, no como ejecución actual. **Estados canónicos:** se conservan literalmente estados como `DEMONSTRATED_PARTIAL`, `DEMONSTRATED_LOCAL`, `HISTORICAL_ONLY`, `FROZEN_BASELINE`, `NOT_VERIFIED`, `BLOCKED`, `UNKNOWN`, `AI_PROPOSED` y `K2_CANDIDATE` sin elevarlos.

**Limitaciones:** la evidencia local no prueba despliegue, rendimiento, conocimiento generalizado, validez normativa, constructibilidad, licencia profesional ni persistencia canónica remota. **Autoridad humana:** Product Owner y Chief Architect deciden alcance y aceptación; Human Architect y especialistas resuelven UNKNOWN, revisan geometría, normativa y uso profesional; la promoción de conocimiento y la aprobación de decisiones requieren revisión humana explícita. Esta auditoría no autoriza conexiones ni implementación.


## Matriz modal

| Modalidad | Input/procesamiento | Interpretación e integración | Output/estado | Límite y revisión |
|---|---|---|---|---|
| TEXT | Command Bar y formularios | encargo textual local | contexto/request | razonamiento sólo si se conecta a harness; humano confirma intención |
| VOICE/AUDIO | adapter `transcribeAudio`; evento `arki:voice-state` | semantic/architectural interpretation NOT_VERIFIED | indicador; no playback/tutor probado | adapter REACHABLE_BUT_UNUSED; confirmación humana |
| IMAGE/CAMERA | upload/storage + Visual Field | observaciones AI_PROPOSED | proposal/provenance | visión arquitectónica no demostrada; review required |
| PDF/DOCUMENT/FILE | `pdftotext`, `pdftoppm`, Tesseract; clasificación provisional | OCR/extracción, no comprensión | OCR metadata | `arkiOcr.test.ts`; UNKNOWN y derechos preservados |
| MAP/GEO | `_core/map.ts`, `Map.tsx`, geolocation | no CRS/datum/territorial semantics | mapa/overlay potencial | provider/key y consumidor no verificados |
| 2D/SVG | spatial viewer y D6.3-G bridge | representación analítica | SVG/candidate A/B | no plano legal/constructivo |
| 3D/MASSING | UPAO massing viewer | derivación de fixture | massing A/B/C | no BIM/GLB interoperable |
| AR | `ArkiRealityView.tsx` cámara/GPS | overlay experimental | dos estacas/WebXR potencial | no SLAM, survey, anchors o error bounds |

## Respuestas directas

ARKI **ve** imágenes, PDF y documentos hasta el nivel de ingestión/OCR/propuesta provisional. **Escucha** sólo en el sentido de contar con un adapter e indicador; no se probó captura→transcripción→razonamiento. **Comprende** parcialmente estructuras extraídas y observaciones delimitadas, no significado arquitectónico profesional. Puede razonar con entradas estructuradas cuando se pasan al harness; no se demostró que audio/visión lleguen a él. Puede aprender de una observación sólo como candidato case-scoped y con revisión humana; no hay generalización.

## Clasificación

**REUSE:** OCR, provenance, Visual Field, SpatialRepresentation y viewers. **CONNECT:** media→project→reasoning/evaluation. **EXTEND:** correspondencia espacial, confidence y change sets. **BUILD:** survey/GIS profesional, BIM y tutela multimodal si faltan modelos. **RESEARCH:** semantic vision, audio understanding y causal multimodal learning. AI_PROPOSED nunca es FACT; la autoridad humana decide promoción.

## Referencias
[1] `server/arkiOcr.ts`
[2] `server/arkiOcr.test.ts`
[3] `server/visualField.ts`
[4] `client/src/api/visual-field.ts`
[5] `server/_core/voiceTranscription.ts`
[6] `server/_core/map.ts`
[7] `client/src/components/ArkiRealityView.tsx`
[8] `client/src/components/UPAO001SpatialViewer.tsx`
[9] `client/src/components/UPAO001MassingViewer3D.tsx`
[10] `docs/arki-d64/D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md`
