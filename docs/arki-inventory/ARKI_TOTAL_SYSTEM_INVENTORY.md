# ARKI — Total System Capability Inventory (Delta 513)

**Fecha de corte:** 2026-09-20  
**Repositorio:** `YvanCastilloQuezada/sicl-web`  
**HEAD auditado:** `a565a90952c5b219e97f73607ff32db29bf8712d`  
**Flujo aplicado:** DISCOVER → INVENTORY → TRACE → CLASSIFY → REPORT  
**Modo:** auditoría read-only. Este documento no autoriza reparación, refactorización, promoción de conocimiento ni despliegue.

## 1. Resumen ejecutivo

ARKI es actualmente un **sistema de apoyo arquitectónico trazable** integrado sobre SICL, no un sustituto autónomo del arquitecto ni un generador certificado de expedientes ejecutivos. Su núcleo demostrado puede recibir un encargo estructurado, recuperar conocimiento con estado epistémico, distinguir `TRANSFER`, `ADAPT`, `DO_NOT_TRANSFER` y `UNKNOWN`, producir alternativas estratégicas, materializar dos representaciones espaciales 2D conceptuales y preservar provenance, lineage, incertidumbre y revisión humana. D6.4 añade ingestión de imágenes/PDF, OCR y biblioteca de fuentes.

La capacidad implementada está más avanzada que la capacidad profesional demostrada. El sistema **sí demuestra** reasoning arquitectónico acotado, puente conocimiento→topología, puente topología→geometría conceptual, ingestión multimodal, visualización 2D/3D/AR experimental, persistencia versionada local y gates de autoridad humana. **No demuestra** documentación constructiva completa, DWG nativo, Revit nativo, IFC/MEP/estructura, cálculo normativo automático, levantamiento topográfico fiable, GIS territorial completo, ni publicación de planos listos para licencia.

## 2. Inventario por dominio

| Dominio | Capacidad observable | Implementación/evidencia | Estado canónico | Límite verificable |
|---|---|---|---|---|
| Identidad de proyecto | Proyectos con `projectId`, nombre, ubicación, estado y versión | `drizzle/schema.ts:15-26`; `client/src/lib/project-id.ts`; pruebas de project-id | DEMONSTRATED | El proyecto persistente contiene snapshot textual; no es aún un PDM/BIM completo |
| SICL Core | Snapshot, conocimiento, decisiones, ledger, versionado y HTTP client | `server/siclCore.ts`; `server/coreHttpClient*.ts`; `server/governanceLedger.ts`; tests Core | DEMONSTRATED_LOCAL / REMOTE_DEPENDENT | `SICL_CORE_URL` no está presente en el entorno auditado; escritura remota no demostrada |
| Corpus arquitectónico M0-K | Ingestión y promoción humana de registros del corpus | `docs/arki-m0k/manifest.json`, `corpus-ingestion.json`, `human-promotion-review.json`; `client/src/arkiKnowledgeCorpusFoundation.ts` | DEMONSTRATED_WITH_HUMAN_GATE | El corpus no convierte automáticamente toda fuente nueva en FACT |
| Reasoning | Recuperación acotada, relevancia textual, trace, unknowns, estrategias A/B, perturbaciones, fallos y contraejemplos | `server/arkiD62ReasoningHarness.ts:50-193`; tests D6.2 | DEMONSTRATED | La relevancia es lexical/estructurada; no equivale a comprensión universal ni a diseño profesional completo |
| Transferencia tipológica | `TRANSFER`, `ADAPT`, `DO_NOT_TRANSFER`, `UNKNOWN` con diferencias y burden | `server/arkiD62ReasoningHarness.ts:66-102`; `docs/arki-l2/` | DEMONSTRATED_LOCAL | Persistencia remota y aprendizaje promovido no demostrados sin Core canónico |
| Programa funcional | Actividad antes que recinto; necesidades espaciales, relaciones y unknowns | `arkiD62ReasoningHarness.ts:164-188`, `executeReasoningToTopology` en el mismo archivo | DEMONSTRATED_PARTIAL | No deriva automáticamente una programación normativa completa para todas las tipologías |
| Topología | Relaciones, flujos, condiciones, hazards, capacidad y trazabilidad | `arkiD62ReasoningHarness.ts:236-377`; `docs/arki-d62m/D6.2-M-REPORT.md` | DEMONSTRATED | Topología conceptual; no prueba operación real a escala de proyecto |
| Geometría 2D | Dos candidatos canónicos, polígonos, zonas, buffer, validación de containment/non-overlap | `server/arkiD63GeometricBridge.ts:5-59`; `docs/arki-d63g/` | DEMONSTRATED_CONCEPTUAL | `functionalValidity` y `operationalValidity` quedan `UNKNOWN`; normativa `NOT_EVALUATED` |
| Planos | SVG conceptual de casa N1/N2 y SVG D6.3-G | `docs/exams/house-two-floor-existing-arki/`; `docs/arki-d63g/candidate-a.svg`, `candidate-b.svg` | DEMONSTRATED_CONCEPTUAL | No son DWG, Revit, expediente firmado ni resultado ciego del examen E1-K |
| 3D/massing | Viewer Three.js/React Three Fiber sobre la misma `SpatialRepresentation` | `client/src/components/UPAO001MassingViewer3D.tsx`; `UPAO001SpatialViewer.tsx:33-34,192+` | DEMONSTRATED_EXPERIMENTAL | Representación analítica/massing; no BIM semántico ni familias constructivas |
| WebXR/AR | Cámara, geolocalización, orientación, dos estacas, escala declarada, minimapa y `immersive-ar` cuando el dispositivo lo soporta | `client/src/components/ArkiRealityView.tsx:15-21,88-176` | DEMONSTRATED_EXPERIMENTAL | Anclaje real depende del dispositivo, permisos, precisión GPS y calibración; no se garantiza precisión topográfica |
| Visual Field | Ingestión de cámara/archivo/PDF, storage reference, provenance, estado `SOURCE_INGESTED` | `server/visualField.ts`; `docs/arki-d64/D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md:7-11` | DEMONSTRATED_LOCAL | Media storage/persistencia remota depende de configuración y Core |
| OCR | `pdftotext` para PDF textual; `pdftoppm + tesseract` para escaneado; Tesseract para imágenes | `server/arkiOcr.ts`; D6.4 report:13-19; `server/arkiOcr.test.ts` | DEMONSTRATED_ADAPTER | OCR es provisional; no transforma automáticamente OCR en FACT |
| Visor de fuentes | `/sources`, búsqueda/filtros, provenance/OCR expandible, ImagePanZoom | `client/src/pages/SourceLibraryPage.tsx`; `client/src/components/ImagePanZoom.tsx`; checkpoint `a565a909` | DEMONSTRATED | Revisión humana sigue siendo obligatoria |
| AI/LLM | Cliente compatible con texto, imagen, archivo, tools y JSON schema | `server/_core/llm.ts:1-114,215+` | IMPLEMENTED_INTERFACE / NOT_DEMONSTRATED_AS_AUTONOMOUS_CORE | El reasoning D6.2 usa runtime determinista/estructurado; no se probó aquí una cadena LLM autónoma integral |
| Voz | Infraestructura de transcripción y UI Command Bar/micrófono según historial y archivos | `server/_core/voiceTranscription.ts`; `client/src/components/CommandBar.tsx`; tests command-bar | DEMONSTRATED_UI / ADAPTER | No se afirma comprensión arquitectónica de voz sin evidencia de ejecución end-to-end |
| Mapas/GIS | Componente Map y tipos espaciales; coordenadas/norte/solar en viewer; georreferencia AR experimental | `client/src/components/Map.tsx`; `UPAO001SpatialViewer.tsx:136-188`; `ArkiRealityView.tsx` | PARTIAL / EXPERIMENTAL | No hay GIS territorial completo, capas, análisis de red, catastro ni exportación GIS demostrada |
| Audio/visual multimodal | Tipos de imagen, archivo y voz en clientes; cámara/visión y OCR | `server/_core/llm.ts`; `visualField.ts`; `arkiOcr.ts` | DEMONSTRATED_ADAPTERS | No hay pipeline de audio semántico arquitectónico demostrado como FACT |
| Normativa | Campos y gates conceptuales que reservan `regulatoryValidity` | `arkiD63GeometricBridge.ts:13,39`; exam reports | NOT_VERIFIED | No se verifican artículos RNE, jurisdicción, iluminación, ventilación, evacuación o licencia automáticamente |
| Constructivo/BIM | Tipos conceptuales de zonas, masas y elementos espaciales | `UPAO001SpatialViewer.tsx:6-28`; geometry bridge | DOCUMENTED_ONLY / NOT_IMPLEMENTED | No se encontraron exportadores DWG, DXF, RVT, IFC, familias Revit, MEP o estructura demostrados |
| Costos | Simulación documentada de costos de casa A21 | `docs/costs/ARKI-HOUSE-A21-S1-COST-SIMULATION.md/.xlsx` | DEMONSTRATED_SIMULATION | No es presupuesto validado ni medición automática universal |
| Libro vivo/educación | `/arki-book`, volúmenes, perfiles, tipologías públicas, evaluación y navegación | `client/src/pages/ArkiBookPage.tsx`; `docs/ARKI_FIRST_CONTACT_MANUAL.md`; tests arki-book | DEMONSTRATED_PRODUCT_UI | El contenido público no equivale a certificación profesional |
| Seguridad/autoridad | Auth, protected procedures, revisión humana, no promoción automática | `server/_core/trpc.ts`; routers; D6.4 report | DEMONSTRATED | No hay matriz completa de roles de arquitecto/revisor/cliente en el schema actual |
| Persistencia de aprendizaje | Snapshots/versiones locales, replay fingerprint, manifest y reportes | `siclCore.ts`; `arkiD62ReasoningHarness.ts:196-197`; `docs/arki-l2/` | DEMONSTRATED_LOCAL | Promoción/escritura remota canónica no demostrada |

## 3. Capacidad por escala

La interfaz y los artefactos soportan el discurso micro→macro y tipologías, pero la implementación ejecutable observada está concentrada en **proyecto**, **programa/topología**, **representación 2D/massing** y **AR de una representación**. Las escalas de unidad funcional, piso/nivel, edificio completo, conjunto, sitio, GIS urbano, metrópoli, territorio, región y país aparecen en la documentación o tipos, pero no deben clasificarse como una capacidad homogéneamente demostrada. Para esas escalas: `DOCUMENTED_ONLY` salvo evidencia explícita en cada módulo.

## 4. Inventario de evidencias principales

| Evidencia | Qué prueba | Qué no prueba |
|---|---|---|
| `docs/arki-d61/` | Round-trip/corpus y examen de restaurante | No prueba geometría ejecutiva ni RNE |
| `docs/arki-d62m/D6.2-M-REPORT.md` | Conocimiento→topología trazable | No genera geometría |
| `docs/arki-d63g/D6.3-G-REPORT.md` | Topología→dos geometrías conceptuales | No prueba funcionalidad, operación o normativa |
| `docs/arki-d64/D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md` | Fuentes, OCR, provenance, human gate | No promueve FACT automáticamente |
| `docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md` | Transferencia/adaptación local versionada | No prueba persistencia remota |
| `docs/exams/ARKI-RESTAURANT-500-EXAM-2026-09-20.md` | Reasoning funcional 18/18 en el examen registrado | Declara geometría constructiva `NOT_DEMONSTRATED` y normativa `NOT_VERIFIED` |
| `docs/exams/house-two-floor-existing-arki/` | Láminas SVG y modelo conceptual | No es salida del examen ciego ni permiso |
| Git HEAD/checkpoints | Integración histórica y validaciones reportadas | No reemplaza ejecución actual de cada claim |

## 5. Conclusión de Delta 513

**ARKI está en el nivel de sistema arquitectónico analítico/conceptual trazable con multimodalidad y puentes iniciales hacia geometría.** Su frontera actual está entre `L2 / conceptual geometry` y `professional executive project`. El siguiente salto no debe declararse como realizado: requiere especificación, evidencia y gates separados para modelo canónico constructivo, exportación interoperable, normativa por jurisdicción, cálculo, documentación ejecutiva, revisión profesional y control de cambios.

**Estado global:** `DEMONSTRATED_PARTIAL`.

**Regla de interpretación:** cuando una pantalla, tipo o documento menciona una capacidad pero no existe una prueba reproducible y una salida verificable, se clasifica como `DOCUMENTED_ONLY`, no como `DEMONSTRATED`.

## 6. Memoria de ideas, decisiones, órdenes y futuros — Delta 515

### IDEA_REPOSITORY_DISCOVERY

**EXISTS = PARTIAL / DISTRIBUTED_ARCHIVE.** No se encontró una entidad, tabla, API o servicio canónico separado para ideas, backlog, roadmap, propuestas o research ideas. La memoria está distribuida principalmente entre `todo.md`, RFCs y especificaciones en `docs/`, manifests y fixtures JSON, inventarios Delta 513/514, reportes D6.x/L2/E-KNOW, scripts, comentarios/símbolos del código y el historial Git. `drizzle/schema.ts` y `server/db.ts` persisten proyectos y snapshots, no registros normalizados de ideas.

El archivo de backlog más claro es `todo.md`, que mezcla trabajo completado y pendiente. RFC-024 y otros RFCs contienen propuestas y arquitectura futura, pero no hay un registro único de aprobación por propuesta. `docs/arki-inventory/` y `docs/arki-post-513-inventory/` son archivos de auditoría y memoria en el worktree, actualmente no rastreados por Git; no deben tratarse como baseline comprometido sin decisión humana posterior.

**Baseline reproducible:** `main@a565a90952c5b219e97f73607ff32db29bf8712d`, igual a `origin/main`. La actualización más reciente del inventario de ideas está en el worktree y no tiene commit asociado. Persistencia canónica remota de la memoria de ideas: **NOT_RECORDED**. Relación con Project State: indirecta; Project State sí existe en snapshots, pero no existe enlace normalizado idea→proyecto. Relación con Knowledge: documental y parcial; no existe promoción automática. Relación con decisiones y órdenes: reconstruible desde reportes y Git, no desde un ledger único.

### ARKI_ORDER_LEDGER

El inventario específico [`ARKI_IDEA_AND_DECISION_INVENTORY.md`](./ARKI_IDEA_AND_DECISION_INVENTORY.md) reconstruye diez familias de órdenes y macroórdenes. Entre ellas están Delta 513, Delta 514, Delta 515, D6.1, D6.2-M, D6.3-G, D6.4, E-KNOW Block 2, L2 y las referencias R-PARTI. La evidencia distingue estrictamente entre orden emitida, orden ejecutada, resultado validado y resultado congelado.

El estado más conservador es el siguiente: D6.1–D6.4, E-KNOW y L2 tienen artefactos de implementación, manifests o reportes con resultados acotados; Delta 513 y Delta 514 tienen informes en el worktree pero no evidencia de completitud comprometida en el HEAD auditado; Delta 515 es una orden de suplemento cuyo informe documental acaba de ser creado en el worktree; R-PARTI aparece en órdenes adjuntas, pero no se encontró su implementación o informe correspondiente en el repositorio. No se infiere ejecución, push, supersession o freeze cuando no existe evidencia explícita.

### FROZEN_DECISIONS

Las decisiones preservadas más importantes son: una sola semántica y una sola geometría canónica; `SOURCE ≠ KNOWLEDGE`; `STRATEGY ≠ REALIZATION`; `UNKNOWN ≠ PASS/FAIL`; revisión humana antes de promoción o decisión; no convertir ARKI-BOOK en conocimiento canónico; no tratar SVG/massing como documentación constructiva; no afirmar BIM/CAD/GIS, regulación o profesionalización sin evidencia; y mantener la persistencia remota bloqueada cuando faltan endpoint y credenciales canónicas.

Estas decisiones están implementadas de forma local o documental según el caso. Su existencia no implica que todas las capacidades futuras estén implementadas. No se encontró un registro completo de reapertura, override humano o supersession de cada decisión histórica.

### FROZEN_FUTURE_ARCHITECTURE

El archivo de Delta 515 clasifica como futura o parcialmente preparada la arquitectura multiescala; el contexto de sitio, urbanismo y GIS; BIM/IFC/RVT; DWG/DXF; documentación profesional y constructiva; coordinación MEP/estructura; operaciones, as-built y lifecycle; deployment/Core remoto; y composites como ARKI-BOOK adaptativo, ARKI-CONSTRUCT, ARKI-BUILDING y ecosistema profesional. Hay elementos conceptualmente definidos, scaffolds o visualizadores parciales, pero no se debe elevarlos a capacidad demostrada.

Terrain/DTM/DSM, GLB/glTF, CFD y simulación térmica no tienen evidencia suficiente en el repositorio auditado y permanecen `UNKNOWN` o `NOT_FOUND`. AR/WebXR existe como scaffold experimental, no como levantamiento topográfico o anclaje profesional. BIM/CAD tienen arquitectura futura descrita, pero no exportadores demostrados.

### IMPORTANT_UNIMPLEMENTED_IDEAS

Las ideas preservadas que no deben perderse incluyen: persistencia Core remota y E2E verificable; tutor adaptativo del Libro Vivo con estado de lector, evaluación y ledger longitudinal; razonamiento normativo jurisdiccional con fuentes versionadas; modelo espacial constructivo con BIM/CAD/MEP/estructura; generación de tres realizaciones PARTI con rechazo y backtrack; continuidad sitio→edificio→operación; y composites de confianza, especialistas, profesionales y ecosistema. Se identifican para trazabilidad, no se recomienda implementarlas durante esta auditoría.

### IDEA_DECISION_CONFLICTS

Se registran conflictos o ambigüedades sin resolver entre artefactos históricos congelados y el baseline actual. Los principales son: la presencia de inventarios post-513 no rastreados frente a `HEAD`; la ausencia de un selector autoritativo entre checkpoints históricos; la diferencia entre capítulos editoriales y conocimiento tipológico estructurado; y las referencias R-PARTI sin implementación verificable. No se eligió automáticamente un ganador. Cada caso queda como `UNRESOLVED_CONFLICT`, `UNKNOWN` o `NOT_RECORDED` hasta decisión humana explícita.

### RELACIÓN ENTRE MEMORIAS

La relación reconstruida es:

`SOURCE / RESEARCH → KNOWLEDGE → IDEA → PROPOSAL → HUMAN DECISION → CANONICAL / FROZEN DECISION → ORDER → IMPLEMENTATION → TEST → DEMONSTRATION → CURRENT CAPABILITY → OBSERVATION → LEARNING / NEW IDEA`

En el baseline, los enlaces más sólidos son `SOURCE/RESEARCH → KNOWLEDGE` en M0-K, `ORDER → IMPLEMENTATION → TEST` en D6.2-M/D6.3-G/D6.4/L2 y `TEST → DEMONSTRATION` en microcasos controlados. Los enlaces `IDEA → PROPOSAL → HUMAN DECISION`, `CURRENT CAPABILITY → OBSERVATION` y `OBSERVATION → LEARNING` son parciales y human-gated. La persistencia remota y la promoción longitudinal no están demostradas.

### REPOSITORIES_NOT_TO_CONFUSE

La auditoría distingue: **Knowledge Repository** (M0-K y registros locales), **Idea Repository** (distribuido, sin entidad canónica), **Decision Repository** (reviews/decisions de SICL), **Order Ledger** (órdenes y reportes), **Project State** (snapshots de proyectos), **Experiment Evidence** (fixtures/manifests/tests), **Roadmap** (`todo.md`, RFCs e inventarios), **Historical Archive** (Git y checkpoints) y **Frozen Baselines** (manifests/reportes clasificados como históricos). Compartir archivos o carpetas no convierte estos sistemas en uno solo.

### Conteos ejecutivos Delta 515

| Campo | Resultado conservador |
|---|---:|
| `IDEA_REPOSITORY_EXISTS` | `PARTIAL / DISTRIBUTED_ARCHIVE` |
| `IDEA_REPOSITORY_LOCATION` | `todo.md`, `docs/`, manifests/fixtures, Git y worktree de inventarios |
| `TOTAL_IDEAS_IDENTIFIED` | `23` entradas de inventario |
| `RAW_IDEAS` | `UNKNOWN / no ledger normalizado` |
| `RESEARCHED_IDEAS` | `varias; ver registros y referencias |
| `APPROVED_IDEAS` | `NOT_RECORDED como conjunto global` |
| `FROZEN_FUTURE_IDEAS` | `varias; arquitectónicamente definidas o preservadas |
| `DEFERRED_IDEAS` | `varias; no normalizadas |
| `IMPLEMENTED_IDEAS` | `parcial; principalmente reasoning, provenance, geometría conceptual y governance local |
| `REJECTED_IDEAS` | `NOT_RECORDED como ledger de ideas |
| `SUPERSEDED_IDEAS` | `NOT_RECORDED explícitamente |
| `CONFLICTED_IDEAS` | `11` conflictos/ambigüedades identificados |
| `UNKNOWN_STATUS_IDEAS` | `varias; ver inventario detallado |
| `TOTAL_ORDERS_IDENTIFIED` | `10` familias |
| `EXECUTED_ORDERS` | `parcialmente reconstruibles; no asumir globalmente |
| `PARTIALLY_EXECUTED_ORDERS` | `varias |
| `PENDING_ORDERS` | `UNKNOWN / no ledger único |
| `FROZEN_ORDERS` | `NOT_RECORDED como conjunto global |
| `SUPERSEDED_ORDERS` | `ninguna explícita encontrada |
| `TOTAL_FROZEN_DECISIONS` | `varias; sin contador canónico único |
| `IMPLEMENTATIONS_WITHOUT_IDEA_TRACE` | `1` hallazgo explícito principal |
| `CONFLICTS_REQUIRING_HUMAN_DECISION` | `11` |
| `CAPABILITIES_OR_IDEAS_NEW_TO_CHIEF_ARCHITECT` | `NOT_RECORDED; no hay comparación verificable con conocimiento externo del Arquitecto Jefe |

### Cierre read-only

Delta 515 queda limitado a **DISCOVERY / INVENTORY / RECONSTRUCTION ONLY**. No se cambiaron estados de ideas, decisiones u órdenes. No se congelaron nuevos elementos, no se descongeló ninguno, no se implementó, no se reorganizó el archivo distribuido, no se hizo commit, push o deploy. El inventario detallado queda para revisión del Product Owner y Chief Architect.

## 7. Resolución documentada de los 11 conflictos Delta 515

Por orden explícita del Product Owner / Arquitecto Jefe, los once conflictos identificados en Delta 515 fueron resueltos documentalmente. La resolución completa se encuentra en [`ARKI_CONFLICT_RESOLUTION_RECORD.md`](./ARKI_CONFLICT_RESOLUTION_RECORD.md).

La decisión de baseline es `main@a565a90952c5b219e97f73607ff32db29bf8712d`, igual a `origin/main`. Los inventarios no rastreados se consideran evidencia de auditoría y no baseline adoptado. Los checkpoints D6.x, L2, E-KNOW y M0-K se conservan como lineage/replay. D6.3-G queda limitado a geometría conceptual de microcaso; ARKI-BOOK sigue siendo una vista editorial; E-KNOW permanece como hipótesis; L2 queda como persistencia local demostrada y persistencia remota bloqueada; R-PARTI se clasifica como no verificado y fuera del baseline; la aprobación de RFC no se considera despliegue; y ARKI no se presenta como un runtime Delta 515 unificado.

Resultado de la resolución: `11` conflictos cerrados como clasificación o interpretación de baseline; `0` capacidades nuevas implementadas; `0` promociones de conocimiento; `0` órdenes nuevas ejecutadas. Se mantuvieron `CODE_CHANGE = NO`, `COMMIT = NO`, `PUSH = NO` y `DEPLOY = NO`.
