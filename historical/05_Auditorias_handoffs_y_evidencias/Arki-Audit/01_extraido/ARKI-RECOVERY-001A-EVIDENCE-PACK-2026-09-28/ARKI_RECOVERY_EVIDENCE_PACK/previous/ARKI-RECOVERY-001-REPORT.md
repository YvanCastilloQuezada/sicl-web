# ARKI-RECOVERY-001 — matriz consolidada de recuperación

## RECIBIDO
- **Baseline:** `main@71e72bb1abfb217bf4854f464ae443764281f469`; tag `arki-m1-block2-final-2026-09-28`; `HEAD/main/origin/main` observado.
- **Worktree:** limpio (`## main...origin/main`); la auditoría no escribió archivos, no actualizó MANIFEST, no hizo checkout/merge/cherry-pick/commit/push/tag ni cambió referencias.
- **Alcance:** consolidación forense de los diez resultados entregados para Generación/Tipologías, Knowledge/aprendizaje, Multiescala, Optimización/selección, Lifecycle/expediente, 4D/5D, BIM/interoperabilidad, Living Engine/DAM, Arqueología Git y Ruptura histórica de representación.
- **Regla de evidencia:** DOCUMENTED no implica CODE_PRESENT; CODE_PRESENT no implica EXECUTABLE; EXECUTABLE no implica TESTED; TESTED no implica INTEGRATED; INTEGRATED no implica CANONICAL; CANONICAL no implica PRODUCTION_READY. `TESTED` significa que existen tests/resultados reportados por los arqueólogos, no una nueva corrida de esta síntesis. No se afirma producción salvo evidencia explícita de despliegue, que no fue aportada.

## ENTREGADO

### Resumen ejecutivo
El canon observable no es un motor único: es un conjunto de capacidades acotadas, con fronteras de autoridad y trazabilidad. Sobreviven en `main` la ontología multiescala RFC-019, relaciones explícitas RFC-009, memoria institucional RFC-011, conocimiento consultivo RFC-025/026, generación abstracta RFC-010/RFC-016.1, evaluación/Pareto RFC-005/007, factibilidad RFC-020, ciclos y evolución RFC-013/013.1, simulación RFC-006/006.1, BIM/IFC read-only RFC-027/028, GIS read-only RFC-028/029, D2/IFC, ARE-002/003, dibujo RFC-030/ARKI-DRAW, A-002 y H-001..H-005.

La afirmación histórica `KNOWLEDGE → GENERATION → TYPOLOGY/PARAMETRIC → GEOMETRY → REPRESENTATION → SVG` **se rompe principalmente entre GENERATION y TYPOLOGY/PARAMETRIC→GEOMETRY**: knowledge y generation producen consultas, metadatos o candidatos, pero no existe un compilador de tipología ni un adapter probado a `ArchiElement/ArchiGeometry`. La representación posterior sí tiene una cadena parcial segura `D2 → ARE-003 → GraphicScene → scene_adapter → SVG`, pero no un caller productivo único que la encadene. RFC-030 legacy conserva scripts y outputs más ricos, pero su projector puede fabricar defaults/anotaciones; por eso no es autoridad semántica para ARE.

La conexión segura al pipeline actual es **por adapters explícitos y sin duplicar motores**: consulta Knowledge sólo como entrada revisable; generación conserva `GeneratedAlternative`, hash, append-only y promoción humana; un futuro adapter explícito y provenance-carrying materializaría D2; ARE-003 sigue siendo el único proyector D2→GraphicScene; ARKI-DRAW sólo adapta `GraphicScene` a primitivas/SVG; análisis Pareto/factibilidad sigue siendo descriptivo; Recommendation/Decision permanece separado y humano. Temporal, simulación y economía no se deben declarar MODEL+TIME+COST hasta que exista un contrato cross-domain y un test integrado. DAM/VSM documenta y vigila maestros, pero no implementa un Living Engine ni autoriza dependencias externas permanentes.

### Matriz
Los estados son estrictos y deliberadamente conservadores. `NOT_EVIDENCED` significa que el material recibido no permite afirmar ese nivel.

| Dominio / capacidad | DOCUMENTED | CODE_PRESENT | EXECUTABLE | TESTED | INTEGRATED | CANONICAL | PRODUCTION_READY | Evidencia / referencias |
|---|---|---|---|---|---|---|---|---|
| Multiscale `SpatialScope` de 11 niveles | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/domain.py:118-139`; RFC-001/RFC-019; `tests/test_multiscale.py`; `origin/rfc-001-multiscale-model@e4ff742`; RFC-019 alineación `93fdc2a`/docs con discrepancia documental `f2c4d205` vs `faff4f8e`. |
| Jerarquía `parent/children/ancestor` | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/multiscale.py:8-61`; `api/routes/v1.py:560-585`; `tests/test_multiscale.py`, `test_multiscale_relations.py`; RFC-019. |
| `ScaleRelation` explícita append-only | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/domain.py:243-247,582-591`; `repository.py`; RFC-009; `origin/rfc-009-multiscale-relations@099f525`; docs alineadas `3f84b9b7`; no GIS ni inferencia causal. |
| Importación explícita de objetivos bajo `CONTAINS` | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/cli.py:458-476`; POST `/import-objective`; `source_parent_objective_id`; RFC-009; `tests/test_multiscale_relations.py:42-91`. |
| Migración/rollback de aliases RFC-019 | YES | YES | YES_SEPARATE_TOOL | PARTIAL | PARTIAL | YES_TRANSITION_TOOL | NOT_EVIDENCED | `src/sicl/migrations/019_multiscale_refinement.py:10-76`; commit `01aea804`; no caller interno ni tests dedicados de migrate/dry-run/backup/rollback. |
| `SpatialRepresentation` renderer-neutral | YES | YES | YES_LIBRARY | YES_EXISTING | PARTIAL | YES_FOR_DERIVED_REPRESENTATION | NOT_EVIDENCED | `src/sicl/spatial.py`; commit `c91151f`; `tests/test_spatial.py`, `test_spatial_transport.py`; no GIS/territorial persistence general. |
| Catálogo Design Knowledge estático | YES | YES | YES | YES_EXISTING | PARTIAL | YES_PILOT | NOT_EVIDENCED | `src/sicl/design_knowledge.py:10-212,237-257`; 3 fuentes/3 items/1 patrón; RFC-026; commit `d53912b`, merge `8477ae2`, tag `sims-dei-2.6-rfc026-design-knowledge@4c4c15a`; `tests/test_rfc026_design_knowledge.py`. |
| `DesignKnowledgeAgent` y frontera normativa/humana | YES | YES | YES | YES_EXISTING | PARTIAL | YES_PILOT | NOT_EVIDENCED | `design_knowledge.py:260-289`; API `/v1/design-knowledge/*`; `decision_created=False`, `HUMAN_REVIEW_REQUIRED`; no caller desde generation/evaluation. |
| Persistencia editorial RFC-026 | YES | NO | NO | NO | NO | NO | NO | `docs/RFC-026_PERSISTENCE_AND_BIBLIOGRAPHY_PLAN.md:1-132`; no tablas, loaders JSON, eventos ni métodos repository observables. |
| Memoria institucional como proyección CLOSED | YES | YES | YES | YES_EXISTING | YES_EXPLICIT | YES | NOT_EVIDENCED | `src/sicl/memory.py:12-48`; `domain.py:515-530`; RFC-011; commit `24580705`; merge `d613b38`; CLI/API `/MEMORY`; no aprendizaje automático. |
| Persistencia/revocación/aplicación de memoria | YES | YES | YES | YES_EXISTING | YES_EXPLICIT | YES | NOT_EVIDENCED | `repository.py:227-232,713-743`; triggers append-only; API `routes/v1.py:350-403`; `tests/test_institutional_memory.py`; aplicación no muta estado canónico. |
| `PlanningInstrument` runtime RFC-008 | YES | YES | YES | YES_EXISTING | YES | YES_RUNTIME | NOT_EVIDENCED | `repository.py:768-792`, `/v1/planning/*`, `tests/test_planning_instruments.py`; commit `ab14f56`; no corpus real probado. |
| `planning_catalog.py` | YES | YES_EMPTY | YES_RETURNS_EMPTY | NO_NONEMPTY_SOURCE | NO_AS_SOURCE | NO | NO | `src/sicl/planning_catalog.py:1-8` declara estructura intencionalmente vacía (`INSTRUMENTS={}`); no resucitar como corpus. |
| `parametric_grid_v1` | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/generation.py:26-31,52-78,146-175`; RFC-010; commit `19c2fac` en `origin/rfc-010-design-generation`; `tests/test_design_generation.py`. |
| `pattern_variation_v1` | YES | YES | YES | YES_EXISTING | YES_GENERIC | YES | NOT_EVIDENCED | `generation.py:27-30,73-78`; RFC-010; candidatos exactos verificados en `tests/test_design_generation.py:98-110`; no conexión automática a RFC-026 `PATTERNS`. |
| `evolutionary_v1` | YES | YES | YES | YES_EXISTING | YES_GENERIC | YES_EXPERIMENTAL | NOT_EVIDENCED | `generation.py:29-31,81-143`; RFC-016.1; commit `5edd01f`; `tests/test_design_generation_extended.py`; ranking por `hash_candidate`, `objective_ids` no prueban fitness real. |
| `llm_assisted_v1` | YES | CONTRACT_ONLY | REJECTION_ONLY | YES_REJECTION | NO | NO_OPERATIONAL | NO | `generation.py:31,153-154`; RFC-010:32-34/67-73; devuelve `LLM_NOT_CONFIGURED`; no proveedor, provenance ni contrato futuro implementados. |
| UPAO-001 spatial generator | YES | YES | YES_LIBRARY | YES_EXISTING | PARTIAL | YES_BOUNDED_PILOT | NOT_EVIDENCED | `src/sicl/spatial_generator.py:30-73,418-493`; commit `032a867` en `origin/feat/upao001-spatial-generator-s2`; `spatial_evaluation.py`; no IFC/terreno real ni performance. |
| Promoción humana `GeneratedAlternative→Alternative` | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | RFC-010; `cli.py` promote; `routes/v1.py:344-355`; actor+authority; no Decision/Recommendation automático. |
| Puente Knowledge/Generation→Typology→D2 geometry | YES_CONCEPTUAL | NO_BRIDGE | NO | NO | NO | NO | NO | RFC-026:41-53,70-112; `generation.py` no importa `design_knowledge` ni `sicl.archi`; no typology compiler, materializer ni test candidate→D2. |
| Evaluation/Comparison | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | RFC-005; `src/sicl/v11.py:29-58`, `evaluation.py`; commit `ad59f89`; API v1; `tests/test_v1_evaluations_comparisons.py`; no Recommendation/Decision implícito. |
| Pareto multiobjetivo | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/optimization.py:81-104`; RFC-007; commit `4d9b0b9`; CLI/API `/multiobjective/pareto`; append-only `MultiobjectiveResult`; descriptivo, no selector. |
| Trade-off matrix | YES | YES | YES | YES_EXISTING_PARTIAL | YES | YES_PERSISTED_ROUTE | NOT_EVIDENCED | `optimization.py:43-66`; RFC-007; legacy commit `12ed526`, consolidación `4d9b0b9`; textual legacy requiere adapter para consumidores canónicos. |
| `GenerativeOptimizer` heurístico | YES | YES | YES_CLI | YES_EXISTING | PARTIAL | YES_LEGACY/EXPERIMENTAL | NOT_EVIDENCED | `optimization.py:18-40`; `cli.py:1148-1159`; commit `12ed526`; `tests/test_optimization_phase5.py`; IDs `uuid4`, sin chain automática evaluation→feasibility→Pareto. |
| Feasibility filter / feasible Pareto | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/feasibility.py:9-145`; RFC-020; commit `d4e177a`, docs/auditoría `6b0bad78`,`c7c068e`; `tests/test_feasibility.py`, HTTP; no Recommendation/Decision. |
| Selección automática desde Pareto/factibilidad | YES_CONTRACT_BOUNDARY | NO | NO_CONNECTED_CALLER | NO | NO | NO | NO | RFC-007:47-53 y RFC-020:17-19 excluyen prescripción; `/RECOMMEND` consume Comparison por separado; Decision exige autoridad+HumanReview. |
| Funnel 16→4→1 | NO_EVIDENCE | NO | NO | NO | NO | NO | NO | Búsqueda reportada sin coincidencias en docs/src/tests; no entidad, endpoint, cardinalidad, criterio ni commit/RFC exacto. |
| Human Authority / HumanReview / Decision gate | YES | YES | YES | YES_EXISTING_PARTIAL | YES_BOUNDARY | YES | NOT_EVIDENCED | `cli.py:842-850,1316-1331`; RFC-005/007/020; actor `DECISIONAL`, veto y revisión aprobada. |
| TemporalCycle/ScenarioBranch RFC-013 | YES | YES | YES | YES_EXISTING | PARTIAL | YES | NOT_EVIDENCED | `domain.py:356-382`, `temporal.py`, repository, CLI/API; commit `6dda71f` en `origin/rfc-013-temporal-cycles`; `tests/test_temporal_cycles.py` (22 pruebas reportadas). |
| ScenarioEvolution RFC-013.1 | YES | YES | YES | YES_EXISTING | PARTIAL | YES | NOT_EVIDENCED | `domain.py:386-397`, `cli.py:703-748`; commit `7fdc9f0` en `origin/rfc-013-1-temporal-evolution`; `tests/test_temporal_evolution.py`; no impacto geométrico/coste calculado. |
| Simulation RFC-006/006.1 | YES | YES | YES | YES_EXISTING | PARTIAL | YES | NOT_EVIDENCED | `src/sicl/simulation.py:13-190`; commits `6592695`, `a47ef17`; `tests/test_simulation.py`; no `cycle_id`, `scenario_id`, BOQ o duración. |
| MODEL+TIME integrado | YES_CONCEPTUAL | NO | NO | NO | NO | NO | NO | Temporal y Simulation tienen APIs/entidades independientes; no caller cross-domain ni FK `cycle/scenario→simulation/model`. |
| EconomicAgent | YES | YES | YES | YES_EXISTING | PARTIAL | YES_HEURISTIC | NOT_EVIDENCED | `src/sicl/agents.py:66-82`; commit `b648c95`, merge `c3bfbd5`; `/AGENT RUN ECONOMIC`; fórmula string-parsed `FLOORS×AREA×COST_PER_M2` vs `BUDGET`. |
| DerivationLedger Quantity/Cost refs | YES | YES_GENERIC | YES | YES_EXISTING | PARTIAL | YES_GENERIC | NOT_EVIDENCED | `src/sicl/derivation.py`; `tests/test_derivation.py`, `test_multiscale_wall_move_e2e.py`; lineage/staleness, no entidades Quantity/Cost/BOQ/APU. |
| 4D construction planning | YES_CONCEPTUAL | NO | NO | NO | NO | NO | NO | RFC-013 sólo horizonte/escenario; no activities, tasks, durations, sequence ni vínculos BIM. |
| 5D BOQ/APU/cost temporal | YES_CONCEPTUAL | NO | NO | NO | NO | NO | NO | No módulos/endpoints/tests persistentes `BOQ/APU/Quantity/UnitPrice/Budget/Cost`; EconomicAgent no es sustituto. |
| MODEL+TIME+COST | YES_CONCEPTUAL | NO_INTEGRATION | NO | NO | NO | NO | NO | No caller combinado ni test cross-domain; sólo piezas aisladas temporal/simulation/economic/derivation. |
| BIM snapshots/change sets PREVIEW RFC-027 | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/bim.py:10-120`; API `routes/v1.py:271-305`; commit `d1ef50d` en `origin/rfc-027-bim-ifc-exchange`; `tests/test_rfc027_bim.py`; `applied=False`, `PREVIEW_ONLY`. |
| IFC physical import read-only | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/ifc_adapter.py:87-145`; commit `db7b9ec` en `origin/rfc-028-gis-cadastral-ifc-adapter`, merge/tag `a3050c5`/`c6b7e7d`; `tests/test_ifc_adapter.py`, `test_ifc_import_http.py`; hash SHA-256, revisión requerida. |
| D2 authoring/export IFC | YES | YES | YES | YES_EXISTING | YES | YES | NOT_EVIDENCED | `src/sicl/archi/{model.py,ifc_export.py,transaction.py}`; commit `79b3a80`, rama relacionada `feat/arki3d-archi-model@cbf09ac`; `tests/test_archi_ifc_export.py`, `test_archi_transaction.py`; geometría explícitamente limitada. |
| IFC synthetic drawing helper | YES | YES | YES_FIXTURE | YES_LIMITED | PARTIAL | NO_GENERAL_CANON | NO | `src/sicl/drawing/ifc_synthetic.py`; commits `8e41ed3`,`9d2b4ad` en `feat/rfc-030-ifc-regeneration`; sirve fixtures/drawing, no authoring BIM general. |
| Revit adapter | YES_CONTRACT | PARTIAL_GUARDRAIL | STATUS_ONLY | YES_STATUS | NO | NO_NATIVE | NO | `src/sicl/bim_connectors.py:30-35`; `HOST_REQUIRED`; `tests/test_remaining_phases.py:41`; RFC-027 `d1ef50d`; sin SDK/add-in/parser/escritura. |
| Archicad adapter | YES_CONTRACT | PARTIAL_GUARDRAIL | STATUS_ONLY | YES_STATUS | NO | NO_NATIVE | NO | `bim_connectors.py:38-43`; `HOST_REQUIRED`; `tests/test_remaining_phases.py:42`; sin API/add-on/PLN parser. |
| BIM conflict detection | YES | YES | YES_LIBRARY | YES_EXISTING | PARTIAL | YES_FUNCTION | NOT_EVIDENCED | `bim.py:143-161`; `detect_bim_conflicts`; `tests/test_remaining_phases.py:37-40`; no endpoint/persistencia/workflow de resolución. |
| BIMParameterMapping operativo | YES_CONTRACT | DATACLASS_ONLY | NO_COMPLETE_ENGINE | NO_DEDICATED | NO | NO | NO | `bim.py:66-74`; docs RFC-027; sin tabla, loader, validación, endpoint ni caller productivo. |
| Apply/sync bidireccional IFC↔Revit/Archicad | YES_FUTURE | NO | NO | NO_APPLY | NO | NO | NO | `BIMChangeSet` rechaza APPLY/APPLIED; `BIMExportRequest` no tiene ejecutor; RFC-027:28-35,180-186; no worker/host SDK/rollback. |
| RFC-030 technical drawing | YES | YES | YES | YES_EXISTING | PARTIAL | YES_DRAWING_ONLY | NOT_EVIDENCED | docs `RFC-030-ARCHITECTURAL-DRAWING-GENERATION-FOUNDATION`; commits `2de6011`, estándar `6fb8be8`; `src/sicl/drawing/*`, scripts y tests; no expediente completo. |
| ARKI-DRAW M1 vector | YES | YES | YES | YES_EXISTING | YES_DRAWING_PIPELINE | YES | NOT_EVIDENCED | merge `origin/feat/arki-m1-vector-plan-pipeline@944dd52`; commits `8a0863a`,`580b77e`; `scene_adapter.py`, primitives/SVG; `tests/test_drawing*.py`. |
| RFC-034.1 sheet composition | YES | YES_BRANCH_ONLY | YES_BRANCH_ONLY | YES_BRANCH_ONLY | PARTIAL_BRANCH_ONLY | NO_MAIN_CANON | NO | `origin/feat/rfc-034-1-layout-engine@a6f727f`; `src/sicl/layout/*`, `tests/test_rfc0341_layout.py`; no evidencia de integración en main. |
| Core project/evidence lifecycle | YES | YES | YES | YES_EXISTING | YES | YES_CORE_ONLY | NOT_EVIDENCED | `src/sicl/interface/cli.py`, `domain.py`, `repository.py`, API; tests core/evidence/validity/temporal; no fases de obra/activo. |
| A-002 input sufficiency gate | YES | YES | YES_LIBRARY | YES_EXISTING | PARTIAL | YES | NOT_EVIDENCED | `src/sicl/a002/requirements.py`; foundation `8b1b6c2`, fixes `96dab57`/`ea6e31c`; `tests/test_a002_*`; no expediente/BOQ. |
| Technical dossier/expediente assembled | YES_CONCEPTUAL | NO | NO | NO | NO | NO | NO | No aggregate/manifest/exporter/signer/BOQ/tender package; RFC-030 explícitamente sólo planos; RFC-037 docs indican motor de programa no iniciado. |
| Construction/tender/BOQ/commissioning/maintenance lifecycle | YES_CONCEPTUAL | NO | NO | NO | NO | NO | NO | Sin paths/tests/callers; `CONSTRUCTION_COST` es métrica, no BOQ; RFC-027 excluye aplicación externa; `OPERATIONS_MANUAL` es del Core, no del activo. |
| RFC process lifecycle | YES_DOCUMENTATION | NO_RUNTIME | NO | NO | REFERENCE_ONLY | NO_RUNTIME | NO | `docs/RFC-018_RFC_PROCESS.md`, commit `65ad8db`; el documento no es motor de transiciones y su baseline textual difiere de HEAD. |
| DAM multi-engine doctrine / Living Engine | YES | NO_LIVING_ENGINE | NO | NO | NO | NO | NO | `docs/rfc/RFC-037-MULTI-ENGINE-ABSORPTION-DOCTRINE.md`, commit `b919e24`; no orchestrator/selector/rotator/provider registry. |
| VSM weekly master surveillance | YES | YES | YES_SCRIPT_CI | YES_DOCUMENTED_RUN | YES_CI | YES_TOOLING | NOT_EVIDENCED | `scripts/weekly_master_surveillance.py`; `.github/workflows/weekly-master-surveillance.yml`; RFC-037.1 commit `d740892`; hardening `f644ed0`; detecta/reporta, no absorbe. |
| Master registry | YES | YES_DATA | YES_CONSUMED_BY_VSM | NO_DEDICATED_CONTRACT | YES_VSM_ONLY | YES_DATA_REGISTRY | NOT_EVIDENCED | `data/master_registry/masters.json` (~52 maestros), logs `2026-09-26_weekly_review.md`; no plugin/runtime registry. |
| Native drawing/layout | YES | YES | YES | YES_EXISTING | YES | YES_NATIVE | NOT_EVIDENCED | `src/sicl/drawing/projector.py`, `composer.py`, `src/sicl/layout/layout_engine.py`; RFC-034.1; no FreeCAD/BlenderBIM runtime. |
| GIS/OGC ingestion and copilot preview | YES | YES | YES | YES_EXISTING | PARTIAL | YES_BOUNDED | NOT_EVIDENCED | `src/sicl/gis.py`, `api/routes/gis_copilot.py`; commits `56d7c8b`,`fc44b1a`; RFC-028/029; read-only/HUMAN_REVIEW_REQUIRED. |
| H-001..H-005 causal impact/validity/reaction/recompute | YES | YES | YES | YES_EXISTING | YES | YES_CORE | NOT_EVIDENCED | `src/sicl/impact.py`, `validity.py`, `reaction.py`, `h005/*`; commits `19232fb`,`3f4ce33`,`4a680c7`,`b801418`; `docs/ARKI_CORE_PATCHED_BASELINE_v1.0.md`; E2E tests report PASS. |
| ARE-002 representation foundation | YES | YES | YES_LIBRARY | YES_EXISTING | PARTIAL_BY_DESIGN | YES | NOT_EVIDENCED | commit `f7bf872`; `src/sicl/representation.py:332-445`; `tests/test_representation.py`; no projection/SVG/persistence itself. |
| ARE-003 D2→GraphicScene | YES | YES | YES_LIBRARY | YES_EXISTING | NO_APP_CALLER | YES | NOT_EVIDENCED | commits `faf8d4e`,`c914a27`; branch `feat/arki-are-003-2d-projection`; tag `arki-are-003-final-2026-09-28`; `src/sicl/projection.py`, `tests/test_projection.py`; sólo TOP/plan acotado. |
| GraphicScene→scene_adapter→vector | YES | YES | YES_LIBRARY | YES_EXISTING | NO_APP_CALLER | YES_LIBRARY | NOT_EVIDENCED | commits `8a0863a`,`580b77e`,`944dd52`; branch `feat/arki-m1-vector-plan-pipeline`; `src/sicl/drawing/scene_adapter.py`; `tests/test_drawing_block2.py`; no D2 inspección duplicada. |
| SVG serializer | YES | YES | YES | YES_EXISTING | PARTIAL_TWO_PATHS | YES_SERIALIZER | NOT_EVIDENCED | commit `4d932c2`; `src/sicl/drawing/svg_export.py`; legacy scripts usan composer/projector distinto; nuevo path recibe estado adaptado. |
| Legacy RFC-030 synthetic path | YES | YES | YES | YES_EXISTING | YES_LEGACY | NO_AS_ARE_AUTHORITY | NO | `drawing/projector.py`, scripts `drawing_cli.py`, `generate_rfc030_outputs.py`; auditorías ARE/DRAW prohíben synthetic walls/rooms/labels como autoridad canónica. |
| RFC-025 regulatory corpus / RNE pilot | YES | YES | YES | YES_EXISTING | PARTIAL_PILOT | YES_PILOT | NOT_EVIDENCED | `regulatory_corpus.py`, `regulatory.py`; commits `1551851`,`3e9ae7c`,`c671337`; `tests/test_rfc025_corpus.py`; no corpus masivo ni promoción automática. |
| RFC-029 local copilot | YES | YES | YES_CONFIG_DEPENDENT | YES_EXISTING | PARTIAL_PREVIEW | YES_PREVIEW | NO | `src/sicl/copilot.py`, API/routes; docs RFC-029; distinto de RFC-014; Ollama productivo no demostrado. |
| RFC-014 User Copilot general | YES | NO | NO | NO | NO | NO | NO | `docs/RFC-014_USER_COPILOT.md` dice `DEFINITION ONLY — NO IMPLEMENTATION`; no confundir con RFC-029. |
| Compliance/Laboratory experimental | YES | YES | YES | YES_EXISTING | PARTIAL | YES_EXPERIMENTAL | NO | `src/sicl/compliance/*`, `laboratory/*`; commits `60a6e27`,`ccab757`,`1ffe230`,`bbc8d75`,`505ccd1`; sin certificación ni gate universal. |
| ARE future engine / render/3D/DXF | YES_FUTURE | NO_INTEGRAL | NO | NO | NO | NO | NO | `ARKI-ARE-000_FUTURE_REPRESENTATION_ENGINE.md`, backlog; explícitamente blocked/deferred; primitives existentes no equivalen a ARE. |
| RFC-034.1/Block 2 remote branches | YES | YES_BRANCH_ONLY | YES_BRANCH_ONLY | YES_BRANCH_ONLY | NO_MAIN | NO_MAIN_CANON | NO | Layout `a6f727f`; Block 2 `origin/feat/arkidraw-block2-scene-adapter@c13c0ea` (commits `27ff812`,`c13c0ea`); no checkout ni fusión. |
| Weather/spatial evidence branch | YES_HISTORY | YES_BRANCH_ONLY | UNKNOWN_BRANCH_ONLY | YES_BRANCH_TESTS | NO_MAIN | NO_MAIN_CANON | NO | `origin/feat/weather-environmental-context-p1@1c41655`; 39 commits reportados, no ancestro de main. |

## WHAT WAS HIDDEN
- La capacidad más profunda y menos visible para inventarios de alto nivel es H-001..H-005: impacto, validez, reacción, ledger y recomputación selectiva fail-closed, con persistencia y E2E.
- `GeneratedAlternative` está separado de `Alternative`; hashes/eventos append-only y promoción actor+authority existen y son observables.
- La memoria institucional es una proyección persistente versionada/revocable, no aprendizaje automático.
- BIM/IFC tiene tres superficies distintas: snapshot/change-set PREVIEW, importador IFC físico read-only y authoring/export IFC interno D2.
- ARE-002/003, `GraphicTrace` y `scene_adapter` preservan autoridad de fuente, fingerprint y trazabilidad; no son el legacy projector.
- VSM realmente detecta/reporta cambios semanalmente, pero no absorbe motores.
- GIS/OGC, capability resolver solar S7-P0.5, Simulation, Pareto, feasibility y H005 son piezas ejecutables acotadas, no un Living Engine.

## WHAT WAS ONLY AN IDEA
- `llm_assisted_v1` operativo, proveedor, claims/provenance y revisión futura.
- Persistencia editorial/bibliográfica RFC-026, loaders JSON, query provenance y catálogo versionado.
- Typology-aware generation, compiler de tipologías, design-space exploration, genealogy, selección automática y AI-assisted generation; FFO-09 los mantiene congelados.
- Funnel 16→4→1.
- MODEL+TIME, 4D constructivo, 5D BOQ/APU y MODEL+TIME+COST.
- Expediente técnico ensamblado, BOQ/metrado, tender, construcción, commissioning, as-built, operación y mantenimiento.
- Living Engine/DAM multi-engine, promoción/rotación de solvers, surrogates y distillation.
- Revit/Archicad nativos, sync bidireccional y aplicación de change sets.
- RFC-014 User Copilot general, ARE integral, render/3D/DXF/frontend y RFC-035 photorealistic rendering.

## WHAT WAS PARTIALLY BUILT
- RFC-026: catálogo/agente estático y consultivo, sin persistencia editorial ni caller hacia generation.
- `evolutionary_v1`: mutación/crossover deterministas, pero no fitness objetivo real, genealogy, typologies ni SpatialRepresentation.
- UPAO-001: geometría sintética in-memory y métricas acotadas, sin IFC/terreno real, persistencia ni desempeño constructivo.
- GenerativeOptimizer: heurísticas hard-coded e IDs `uuid4`, sin cadena automática de evaluación/factibilidad/selección.
- Temporal/Simulation: completos como workflows separados, incompletos como MODEL+TIME.
- EconomicAgent/DerivationLedger: proxy de costo y lineage/staleness, no dominio económico ni BOQ/APU.
- RFC-030/ARKI-DRAW: dibujo técnico/vectorial real, no expediente ni representación D2 end-to-end.
- Revit/Archicad, BIM conflict, `BIMParameterMapping`: guardrails/función/DTO, no integración host o workflow persistente.
- RFC-034.1, Block 2 y weather evidence: código/test en refs remotas no alcanzables por main, no canon actual.
- Compliance/Laboratory, RFC-025/026 y RFC-028/029: pilotos acotados, no certificación, corpus amplio ni autoridad externa.

## WHAT SURVIVED INTO CURRENT CANON
- `main@71e72bb1...` y tag `arki-m1-block2-final-2026-09-28`.
- RFC-019 11 `SpatialScope`, relaciones explícitas RFC-009 e importación de objetivos con provenance.
- RFC-011 InstitutionalMemory con append-only, revocación y aplicación humana.
- RFC-010 `parametric_grid_v1`, `pattern_variation_v1`, `GeneratedAlternative` y promoción humana; RFC-016.1 `evolutionary_v1` acotado.
- RFC-005 Evaluation/Comparison, RFC-007 Pareto/trade-offs y RFC-020 feasibility, sin autoridad decisional.
- RFC-013/013.1 cycles, branches y evolution; RFC-006/006.1 Simulation/Monte Carlo.
- RFC-027/028 BIM/IFC read-only/preview, GIS/OGC read-only y D2 deterministic IFC authoring.
- A-002, H-001..H-005, D2, ARE-002, ARE-003 y el backend SVG/ARKI-DRAW.
- HumanReview, actor/authority, hash, append-only, fail-closed y separación epistemológica como invariantes.

## WHAT CAN BE RESURRECTED
- Reusar `generation.py` parametric/pattern y, con guardrails, evolutionary, siempre como candidatos declarativos y no como selector.
- Crear un adapter explícito `GeneratedAlternative/Typology → D2` sólo después de definir contrato, parámetros, autoridad, provenance candidato→elemento y tests; no duplicar proyección en drawing.
- Componer `project_architectural_plan → GraphicScene → scene_adapter → export_view_svg` mediante un caller de aplicación, manteniendo ARE como único proyector.
- Implementar el persistence plan RFC-026 sobre el catálogo piloto con migración idempotente, revisión editorial, licencias, versión/hash y tests.
- Generalizar capabilities desde el resolver solar mediante registry declarativo, sin presentar UPAO-001 como motor general.
- Usar Temporal/Scenario IDs como contexto de Simulation sólo tras contrato cross-domain; crear entidades persistentes de Quantity/BOQ/APU/Cost antes de reutilizar DerivationLedger.
- Conectar DrawingHttpService/layout a FastAPI sólo con contrato, auth, persistencia y pruebas.
- Implementar adapters Revit/Archicad únicamente dentro de host SDK aprobado, con mapping, permisos, rollback y E2E.
- Revalidar, con autorización explícita, layout `a6f727f`, Block 2 `c13c0ea` y weather branch `1c41655`; no son actuales por el mero hecho de existir en refs.

## WHAT MUST NOT BE RESURRECTED
- `planning_catalog.py` como corpus autorizado sin carga y aprobación verificables.
- `llm_assisted_v1` como generación operativa.
- Ranking hash de `evolutionary_v1` como fitness, recomendación o decisión.
- UPAO-001 como generador arquitectónico general, tipology-aware, energético, CFD o de desempeño real.
- Knowledge teórico/heurístico o RNE no verificado como requisito legal, constraint automático, Decision o geometría.
- Pareto/non-dominated/feasible front como aprobación o elección automática; no conectar automáticamente a Recommendation/Decision.
- Funnel 16→4→1 sin commit, contrato, caller y tests.
- RFC-030 synthetic projector como autoridad D2 de walls, rooms, openings, labels, dimensions, materials o hatches.
- Duplicar `project_architectural_plan` dentro de ARKI-DRAW; `scene_adapter` debe aceptar sólo `GraphicScene`.
- BIM PREVIEW como APPLY/APPLIED, parser falso `.rvt/.pln`, sync bidireccional o cambios externos sin host/rollback.
- Simulation/EconomicAgent como 4D/5D, BOQ/APU, presupuesto temporal o planificación constructiva.
- `masters.json`, documentación, fixtures, PDFs, tags o tests de presencia como prueba de engine, Living Engine o producción.
- Ollama productivo, solvers externos permanentes, auto-update, auto-absorption, fallback silencioso, distillation o surrogate sin evidencia reproducible.
- Feature branches no ancestro de main como canon sin merge/aprobación.

## UNKNOWN REGISTER
- Eficacia real del filtro `applicable_typologies` y contenido poblado del seed RFC-026.
- Corpus autorizado pendiente de `planning_catalog.py`; estado `SUPERSEDED` de memoria no demostrado en el flujo inspeccionado.
- Proveedor LLM, contrato de provenance/claims y revisión futura.
- Caller productivo UPAO001 fuera de `spatial_evaluation.py`/tests.
- Fitness/semántica efectiva de `objective_ids` en `evolutionary_v1`.
- Cualquier implementación histórica no visible en main para `design_generation.py`, `multiobjective.py` o funnel 16→4→1.
- Si DrawingHttpService/layout HTTP están registrados en la FastAPI canónica; scripts/servidores independientes sí existen.
- Integración de ARE-003 con `scene_adapter` en producto: la evidencia es biblioteca/tests, no caller productivo.
- Equivalencia fingerprint elemento↔snapshot de modelo; M1 la deja diferida.
- IFC round-trip completo, geometría/relaciones fuera del subconjunto y compatibilidad real Revit/Archicad.
- Modelo de costo persistente, unidades, moneda, precios, inflación, cantidades, calendario, recursos y secuencia BIM.
- Benchmarks/ground truth de maestros DAM y síntesis multi-maestro.
- Firma, versionado y control documental del expediente; requisitos legales dependen de jurisdicción y no están implementados.
- La ausencia observada se refiere al árbol/ref evidence entregado; no prueba inexistencia en repositorios externos no inspeccionados.

## DIVERGENCIA
La ruptura histórica no es un único archivo perdido sino una **divergencia de representación y autoridad**:
1. RFC-026 conceptualiza Fuente→Knowledge→Strategy/Pattern→Alternative, pero `DesignKnowledgeAgent` no llama a generation y `generation.py` no llama a D2.
2. RFC-010 produce candidatos abstractos; no define su materialización geométrica.
3. D2 sí es una fuente geométrica canónica, pero ARE-003 sólo proyecta D2 explícito; no recibe `GeneratedAlternative`.
4. ARKI-DRAW/`scene_adapter` serializa `GraphicScene`, no inspecciona D2 ni corrige el hueco anterior.
5. RFC-030 legacy puede producir más anotaciones, pero parte de synthetic/fallback semantics y por eso diverge epistemológicamente de D2/ARE.
6. Optimización, temporal, simulación, BIM y costo tienen superficies separadas; los nombres comunes no prueban integración MODEL+TIME+COST.

La reparación segura es una cadena de adapters con una sola autoridad por etapa: `Knowledge (consulta/revisión) → Generation (candidato) → promoción humana → D2 (modelo canónico) → ARE-003 (proyección) → GraphicScene → scene_adapter (adaptación) → ARKI-DRAW/SVG`; ningún motor debe duplicar a otro ni convertir documentación en estado.

## FALTA
- Puente ejecutable y testeado Knowledge/Generation→Typology→D2.
- Entry point de aplicación para D2→ARE→GraphicScene→SVG.
- Persistencia editorial/versionada RFC-026 y provenance reproducible de queries.
- Selección humana/automática claramente modelada desde resultados Pareto, sin saltar los gates.
- Integración real MODEL+TIME, 4D, modelo de costos 5D y MODEL+TIME+COST.
- Expediente técnico aggregate/manifest, firmas, revisiones, BOQ/APU, tender y lifecycle de obra/activo.
- Aplicación BIM externa, host adapters, mapping y conflicto persistente.
- Living Engine/multi-engine orchestrator, solvers físicos especializados y benchmarks DAM.
- Evidencia de deployment/operación en producción para cualquiera de las capacidades; por eso `PRODUCTION_READY` se conserva como `NOT_EVIDENCED` o `NO`.

**Conclusión:** el canon recuperable es amplio pero modular. Lo que sobrevivió debe conectarse por contratos explícitos, provenance, revisión humana y fail-closed; no debe resucitarse una narrativa de motor único, generación tipológica automática, expediente completo, 4D/5D, sync BIM o Living Engine que el código, los callers y los tests entregados no sostienen.