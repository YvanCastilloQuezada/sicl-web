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
