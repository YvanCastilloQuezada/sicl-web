# ARKI — Inventario histórico de superpoderes (2026-10-12)
Estado: AUDITORÍA ESTÁTICA EN TRES PASADAS, NO E2E, NO CANÓNICA.
Repositorios inspeccionados: sicl-web main ec6ede75; sicl-core main 45fd21a6; arki-acs main 6a061218. Rama de Árbol Vivo: feat/arbol-vivo-autoensamblaje-20261011.
Metodología: (1) árboles y código presente, (2) genealogía desde documentos canónicos previos, (3) límites y evidencia CI. No se recorrió exhaustivamente cada commit histórico: auditoría histórica exhaustiva pendiente.

## Cinco superpoderes oficiales
Fuente: docs/arki-superpowers/ARKI_SUPERPOWERS_PACK.md, server/arkiSuperpowersPack.ts, server/arkiSuperpowersPack.test.ts.
- SP-01 Consequence Radar: consecuencias directas/secundarias/terciarias/posibles/desconocidas. Heurístico, no simulación.
- SP-02 Value of Information: priorización de UNKNOWN. No es probabilidad calibrada.
- SP-03 Design Divergence: diferencia entre partidos, topologías, relaciones, circulación, sección, masa, estructura. No elige mejor diseño.
- SP-04 Architectural Debt: riesgo, horizonte y mitigación de decisiones. Requiere evidencia profesional.
- SP-05 Counterfactual Explorer: ocho escenarios AI_PROPOSED. No simula sus resultados.
Estado documental: IMPLEMENTED / FOCUSED_TESTS_PASS / PASS_WITH_BOUNDS; regresión actual NO EJECUTADA.

## Capacidades adicionales — NO son SP-06 en adelante
WEB: D-2 y motor unificado, programa/Parti, generación y tipologías, funnel N→16→4→1, familias dinámicas, geometría AGK, BIM/IFC, dibujo y visores 2D/3D, Site Intelligence, clima/solar/GIS, costos, agentes, PWA/WebXR, Maqueta Viva, Árbol Vivo, Gemelo Digital, ADN de mejora continua.
CORE: Project State, evidencias, derivaciones, transacción arquitectónica, IFC, gramática de conocimiento de diseño multiescala, agentes, evaluación, optimización/Pareto, laboratorio, generación paramétrica, por patrones y evolutiva. src/sicl/generation.py declara llm_assisted_v1 como DEFINED_NOT_CONFIGURED: no es generación LLM operativa.
ACS: laboratorio tecnológico, NO runtime productivo ni sandbox de seguridad. Modos KNOW/RUN/UNDERSTAND/EVOLVE; inspectores, worker, benchmarks, comparador de librerías, VersionMonitor, DeltaAnalyzer, EvidenceInvalidation. No puede promover código ni mutar geometría canónica.

## Hallazgos y límites
- El mapa docs/arki-master-map/ARKI_MASTER_MAP_LIVE.md se declara punto de entrada canónico. 00_START.md experimental es auxiliar y requiere reconciliación.
- La rama experimental contiene tools/maqueta-viva y ADN ausentes de main auditado.
- Árbol Gemelo Digital tiene tres vistas documentales; vista 3D conceptual, no AGK.
- Plano Vivo como integración real: UNKNOWN.
- ADN experimental observa JSON y propone mejoras; no hay servicio persistente ni aprendizaje autónomo canónico demostrado.
- El estado ARKI_MASTER_MAP_STATE.json registra updated_at 2026-10-07, anterior a avances de octubre 10–12.
- En rama experimental, SHA 0343851: CI Assembly Planner 38192989124 FAILURE; Maqueta Viva smoke 38192989034 FAILURE. Logs no recuperables: causa UNKNOWN.
- HOUSE-A21 histórico tiene placements rectangulares fijos: no prueba creatividad general.
- El Core implementa evolución de alternativas, pero no está demostrada su integración al Funnel Web.

## Prioridades de reensamblaje
1. Reconciliar 00_START, MASTER_MAP_LIVE, MASTER_MAP_STATE, ramas y evidencia SHA.
2. Unificar estado observado de Maqueta/Plano/Árbol/Gemelo; probar cambio→dependencias→persistencia→handoff y no mutación FROZEN.
3. Integrar observador/ACS EVOLVE/Delta 6.2 con pruebas aisladas, métricas, rollback, Qwen y autorización humana. Nunca autopromoción.
4. Probar encargo→Parti→geometría variable AGK→planos/3D→evaluación; luego 16 alternativas reales.
5. Revalidar BIM, GIS, clima, dibujo, costos y dispositivos contra fuentes y ejecución actuales.

## Evidencia base
WEB: docs/arki-master-map/ARKI_BODY_MAP_TRIPLE_AUDIT_V1.md; ARKI_CANONICAL_HANDOFF_2026-10-05.md; ARKI_MASTER_MAP_LIVE.md; ARKI_MASTER_MAP_STATE.json; docs/arki-superpowers/ARKI_SUPERPOWERS_PACK.md.
CORE: docs/D2_ARCHITECTURAL_CAPABILITIES.md; docs/RFC-026_DESIGN_KNOWLEDGE_AND_MULTISCALE_DESIGN_GRAMMAR.md; src/sicl/generation.py; tests/test_design_generation.py.
ACS: README.md; docs/ARCHITECTURE.md; src/Acs.Evolution/; tests/Acs.Tests.Integration/.
Árbol: tools/maqueta-viva/ARBOL-GEMELO-DIGITAL.md; ARKI-ADN-MEJORA-CONTINUA-CONTRATO-PROPUESTO.md; README.md.

Regla: CLAIM != IMPLEMENTED != EXECUTED != VERIFIED != FROZEN. No evidencia = no verde. No tocar MiLukita ni main.
## Recuperación específica — Motores, Dynamo, Grasshopper, Revit e IFC (2026-10-12)
**Hallazgo principal:** `sicl-core/docs/rfc/RFC-037-MULTI-ENGINE-ABSORPTION-DOCTRINE.md` contiene la Doctrina de Absorción Multi-Motor (DAM): maestros externos para ground truth y aprendizaje, síntesis en motor propio, pruebas de graduación, máximo dos ramas paralelas, sin dependencia de runtime ni absorción automática. `RFC-037-RAMAS-Y-MOTORES.md` inventaría dibujo (IfcOpenShell Draw, FreeCAD TechDraw, Bonsai, ezdxf, LibreCAD), BIM (IfcOpenShell, xBIM, web-ifc), estructuras, energía, GIS, optimización, simulación, acústica, geotecnia, hidráulica, CFD y LCA. Inventario NO equivale a instalación.
**Vigilancia:** `sicl-core/docs/rfc/RFC-037.1-WEEKLY-MASTER-SURVEILLANCE.md` establece revisión semanal lunes 06:00 UTC, detectar→evaluar→absorber/descartar→purgar→registrar. Documento prohíbe AUTO_UPDATE, AUTO_ABSORPTION y AUTO_PURGE; ejecución del scheduler NO VERIFICADA.
**Dynamo real en ACS:** `arki-acs/tools/probe-dynamo-runtime.ps1` busca DynamoCLI.exe, ejecuta `test-minimal.dyn` y comprueba XML. `tests/Acs.Tests.Acceptance/ProtoGeometryLibgChainTests.cs` inspecciona seis DLLs de ProtoGeometry/LibG y falla INPUT_NOT_AVAILABLE sin artefactos. `docs/REPRODUCTION.md` exige `ACS_PROTOGEOMETRY_LIBG_DIR`. Pruebas del host y salida real NO EJECUTADAS en esta auditoría.
**Parametría Web:** `sicl-web/client/src/content/parametric-examples/examples/EJEMPLO-031-generate-design/` conserva `EJEMPLO-031.dyn` y `EJEMPLO-031.ghx`. Su README dice que no demuestra ejecución nativa Dynamo/Revit/Rhino/Grasshopper.
**Hosts Revit/Dynamo:** `sicl-web/docs/arki-research/ARKI_IFC4_HOSTS_SELF_CARE_2026-09-21.md` documenta página y contratos, requisitos Revit `revit-export`, `shared-coordinates`, `parameter-map`, y Dynamo `dynamo-run`, `revit-transaction-guard`; ejecución real bloqueada hasta host, servidor y aprobación.
**Core BIM:** `sicl-core/docs/RFC-027_BIM_IFC_EXCHANGE_CONTRACT.md` y `src/sicl/bim_connectors.py` confirman snapshots append-only, IFC físico solo lectura, change sets PREVIEW, `RevitAdapter.inspect` HOST_REQUIRED, no escritura RVT ni add-in Revit implementado allí.
**Web IFC:** `sicl-web/server/arkiIfc4.ts` parsea productos semánticos IFC4/4X3, devuelve geometryDecoded=false hasta recibir adaptador; round-trip compara conjuntos normalizados y tolerancias, no garantiza equivalencia RVT ni geometría IFC completa.
**Historia:** búsqueda de commits en los tres repositorios halló menciones Dynamo/Revit/Grasshopper en `sicl-web` y doctrina DAM en `sicl-core`; genealogía completa de cada commit aún no recorrida.
**Decisión de recuperación:** no crear otro motor paralelo. Conectar ACS→evidencia→Delta 6.2→motor propio AGK y host autorizado. Separar tres objetivos: `.dyn/.ghx` definiciones, `.ifc` modelo interoperable, `.rvt` modelo nativo editable; requieren pruebas independientes.
**Estado:** SOURCE_FOUND / IMPLEMENTATION_PARTIAL / HOST_E2E_UNKNOWN / NO_NATIVE_RVT_CLAIM.

## Recuperación AGK / OCCT y delta 95/5 — 2026-10-12
**Fuente primaria:** `sicl-web/docs/arki-master-map/AGK_OCCT_EXECUTION_EVIDENCE_V1.md` (main). Arquitectura aprobada: `AGK = OCCT body + minimal evidence-derived ARKI_KERNEL_DELTA`; un kernel, sin cadena de backends. El 95%/5% es hipótesis de selección, NO medición de cobertura.
**Pruebas históricas registradas en HP Z840, OCCT 8.0.1:** instalación PASS; G0/G1/G2 BRep PASS (8 vértices, 12 aristas, 6 caras, 1 sólido, volumen 6000, área 2200); avanzado 16/16; T1 22/22; T2 coordenadas/tolerancias con frontera de booleanos 5e-7 vs 2.5e-7, marco local gana 9/13; T3 12 tests, 11 invariantes PASS, T303 frontera esperada, 0 fallos inexplicados. Evidencia histórica documentada, no reejecutada aquí.
**Delta demostrado como necesidad/política candidata:** AGK-DELTA-001 Local Engineering Frame (CRS/global placement→transformación reversible→BRep local); AGK-DELTA-002 Geometric Acceptance Contract (operación, validez BRep, invariantes geométricos/topológicos, semántica, tolerancia→ACCEPT/REJECT/UNKNOWN). `ARKI_KERNEL_DELTA` sigue NOT_FINALIZED.
**Pendiente T4:** NURBS/B-Spline, doble curvatura, loft/sweep/torsión, offset, booleans curvas, intersecciones, continuidad, regeneración determinista y roundtrip BRep/STEP.
**Maestros candidatos, NO dependencias productivas aprobadas:** CGAL, Manifold, OpenVDB, libfive, PicoGK, SolveSpace/libslvs, Topologic. Solo incorporar por límite OCCT reproducido, con licencia y pruebas. 
**Gates:** reconciliar código/commits con informe T0-T3; ejecutar T4; validar interfaz D-2→AGK→plano/maqueta/IFC; no declarar cobertura porcentual ni AGK FROZEN de producción sin evidencia.

## Recuperación fundacional: ley de autoridad única y un solo motor (2026-10-12)
Fuentes primarias verificadas: `docs/ARKI_AND_SICL_FOUNDATIONS.md` (WEB), `docs/arki-knowledge/fundamental-research/FKCG-02/FKCG-02_FUNDAMENTAL_KNOWLEDGE_PRESERVATION.md` (WEB), `docs/arki-inventory/ARKI_FROZEN_AND_HISTORICAL_ASSETS.md` (WEB), `sicl-core/docs/ARKI_CORE_FROZEN_v1.0.md`, y `docs/arki-master-map/ARKI_CANONICAL_HANDOFF_2026-10-05.md` (WEB).
- **Una sola autoridad arquitectónica semántica D-2**; **una sola autoridad de geometría canónica AGK**; Core valida/persiste, Delta 6.2 gobierna conocimiento; humano autorizado decide finalmente. No segundo motor canónico, no segunda verdad semántica ni geométrica, no autopromoción.
- SICL es lenguaje formal, no segundo sistema decisor; Web es interfaz, no autoridad de estado. `Recommendation != Decision`; `Decision` requiere `HumanReview`, actor y autoridad. Auditoría append-only.
- FKCG-02: A WORLD, B KNOWLEDGE, C REASONING, D GENERATION, E EVALUATION, F LEARNING son responsabilidades conceptuales, no autorización para seis motores. `NO_NEW_SYSTEM`, `NO_NEW_ENGINE`, `NO_NEW_PRIMITIVE`, `NO_RUNTIME_ACTIVATION`, `NO_AUTOMATIC_CANONIZATION`.
- Core H-001 Derivation Integrity, H-002 Impact Analysis, H-003 Validity/Invalidation, H-004 Reaction Planning están FROZEN; fail-closed y sin mutación autónoma del ledger/event store. Modificaciones estructurales requieren autorización humana.
- Registro Frozen: preservar evidencia histórica no equivale a capacidad productiva; no descongelar motores paralelos, normativa no verificada, exportadores BIM/CAD sin gates.
- Interpretación operativa: ACS, laboratorios, Revit/Dynamo/Grasshopper y maestros OCCT/CGAL/etc. son fuentes de observación, pruebas o adaptadores subordinados; jamás autoridades paralelas. El 95/5 es hipótesis, no permiso de agregar motores.
- **Pendiente**: reconciliar el corpus constitucional en `docs/arki-knowledge/preserved/01_ARKI_Decisiones_y_Constitucion_v1.0.xlsx` y los registros FROZEN; esta pasada revisó referencias y Markdown, no leyó todas las hojas del workbook.
