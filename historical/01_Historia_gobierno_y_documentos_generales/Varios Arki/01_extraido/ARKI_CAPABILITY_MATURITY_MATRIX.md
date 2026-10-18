# ARKI — Capability Maturity Matrix (Delta 513)

**Corte:** `a565a909` · **Clasificación:** `DOCUMENTED_ONLY`, `IMPLEMENTED`, `DEMONSTRATED`, `DEMONSTRATED_PARTIAL`, `EXPERIMENTAL`, `NOT_VERIFIED`, `BROKEN`.

| Capacidad | Madurez | Evidencia principal | Criterio satisfecho | Brecha / condición de salida |
|---|---|---|---|---|
| Identidad y versiones de proyecto | DEMONSTRATED | `drizzle/schema.ts:15-26`; `client/src/lib/project-id.ts`; `client/src/lib/project-id.test.ts` | ID, snapshot, estado y versión | Versiones no equivalen a ramas BIM ni historial semántico de elementos |
| Knowledge foundation M0-K | DEMONSTRATED_WITH_HUMAN_GATE | `docs/arki-m0k/manifest.json`; `client/src/arkiKnowledgeCorpusFoundation.ts` | Corpus/manifest y promoción explícita | Automatizar incorporación FACT está prohibido sin revisión |
| SICL local snapshot/replay | DEMONSTRATED | `server/siclCore.ts`; `arkiD62ReasoningHarness.ts:196-197`; tests | Replay fingerprint y snapshot | No remoto verificable sin `SICL_CORE_URL` |
| Recuperación de conocimiento | DEMONSTRATED_PARTIAL | `arkiD62ReasoningHarness.ts:54-60,154-159` | Recuperación trazable y acotada | Relevancia lexical; falta evaluación semántica amplia |
| Reasoning funcional | DEMONSTRATED | `arkiD62ReasoningHarness.ts:154-193`; `docs/arki-d62/restaurant-exam-result.json` | Trace, constraints, unknowns, strategies | Resultado parcial; no garantiza diseño completo |
| Transferencia tipológica | DEMONSTRATED_LOCAL | `arkiD62ReasoningHarness.ts:66-102`; `docs/arki-l2/` | Cuatro modos y burden | Promoción y Core remoto no demostrados |
| Topología conceptual | DEMONSTRATED | `executeReasoningToTopology`; `docs/arki-d62m/D6.2-M-REPORT.md` | Relaciones y provenance | No es grafo operacional calibrado |
| Dos realizaciones divergentes | DEMONSTRATED | `arkiD62ReasoningHarness.ts:105-112`; `arkiD63GeometricBridge.ts:48-55` | A/B con diferencia significativa | Sólo dos candidatos en D6.3-G |
| Topología→geometría | DEMONSTRATED_CONCEPTUAL | `arkiD63GeometricBridge.ts:43-59`; report D6.3-G | Requirements, moves, mutations, gates | Functional/operational UNKNOWN; regulatory NOT_EVALUATED |
| Validez geométrica básica | DEMONSTRATED | `arkiD63GeometricBridge.ts:28-39` | containment, non-overlap, buffer | No materiales, muros, puertas ni construcción |
| Planos SVG conceptuales | DEMONSTRATED_CONCEPTUAL | `docs/exams/house-two-floor-existing-arki/`; `docs/arki-d63g/*.svg` | Salidas visibles y legibles | No DWG/RVT/IFC; no licencia |
| 3D massing | DEMONSTRATED_EXPERIMENTAL | `UPAO001MassingViewer3D.tsx`; viewer route | Consume SpatialRepresentation | Massing analítico, no BIM |
| WebXR/cámara AR | EXPERIMENTAL | `ArkiRealityView.tsx:140-176`; `UPAO001SpatialViewer.tsx:192+` | Cámara, GPS, estacas, WebXR opcional | Precisión física, datum y tracking dependen del dispositivo |
| Ingestión de fuentes | DEMONSTRATED_LOCAL | `server/visualField.ts`; D6.4 report | Media, provenance, source record | Persistencia remota/configuración pendiente |
| OCR PDF/texto/escaneado | DEMONSTRATED_ADAPTER | `server/arkiOcr.ts`; `server/arkiOcr.test.ts` | Tres rutas OCR documentadas | Confianza y estructura siguen siendo provisionales |
| Biblioteca visual/zoom/pan | DEMONSTRATED | `SourceLibraryPage.tsx`; `ImagePanZoom.tsx`; checkpoint `a565a909` | Consulta, visor y estados | No valida contenido arquitectónico |
| Observación AI_PROPOSED | DEMONSTRATED | D6.4 report:17-19 | No promoción automática | FACT requiere humano |
| Voz/Command Bar | DEMONSTRATED_UI / ADAPTER | `CommandBar.tsx`; `voiceTranscription.ts`; tests | Interfaz y transcripción configurada | No prueba ciclo de comprensión arquitectónica de extremo a extremo |
| LLM multimodal | IMPLEMENTED_INTERFACE | `_core/llm.ts:1-114` | Tipos texto/imagen/archivo/tools/schema | No se debe confundir wrapper con capacidad autónoma probada |
| Normativa RNE/Plazola/Neufert | NOT_VERIFIED | Exam reports; gates D6.3 | Hay campos y unknowns | Faltan corpus normativo trazable por jurisdicción, cálculo y evidencia |
| Export DWG/DXF | DOCUMENTED_ONLY | Solicitudes históricas; no exporter encontrado | Ningún gate reproducible | No implementado/demostrado |
| Export Revit/RVT/IFC | DOCUMENTED_ONLY | Tipos espaciales solamente | Ningún artefacto ni exporter | No implementado/demostrado |
| MEP/estructura/familias | DOCUMENTED_ONLY | No hay símbolos/evidencia ejecutable en inventario | Ningún gate | No implementado/demostrado |
| GIS territorial | PARTIAL | `Map.tsx`; SpatialRepresentation; AR geospatial | Coordenadas y vista | No capas/análisis/export GIS completo |
| Cost simulation | DEMONSTRATED_SIMULATION | `docs/costs/*.md/.xlsx` | Caso documentado | No presupuesto certificado |
| Libro Vivo | DEMONSTRATED_PRODUCT_UI | `ArkiBookPage.tsx`; tests; checkpoints | UI, perfiles, capítulos y evaluaciones | Contenido interno y público deben mantenerse separados |
| Human authority | DEMONSTRATED | D6.4 report; protected routes; `humanReviewRequired` | Revisión explícita y estados | Falta matriz completa de roles profesionales |

## Lectura de madurez

El sistema tiene una **columna vertebral demostrada** desde fuente → conocimiento → reasoning → topología → geometría conceptual → representación. Los estados superiores de producción profesional no se infieren de esa columna: requieren pruebas independientes. El estado global de la plataforma es **DEMONSTRATED_PARTIAL**, no `MASTER` ni `READY_FOR_LICENSE_DOCUMENTATION`.

## Estados negativos relevantes

No se halló evidencia de una capacidad `BROKEN` en los módulos D6.1–D6.4 auditados. Sí existen capacidades que deben permanecer en `NOT_VERIFIED`, `DOCUMENTED_ONLY` o `EXPERIMENTAL`; convertirlas a `PASS` sería una violación de integridad epistémica.
