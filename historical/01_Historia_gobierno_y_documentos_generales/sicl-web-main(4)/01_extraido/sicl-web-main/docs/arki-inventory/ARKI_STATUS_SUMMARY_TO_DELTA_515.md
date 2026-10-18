# ARKI — Resumen consolidado hasta Delta 515

**Fecha de corte:** 2026-09-20  
**Baseline de código:** `main@a565a90952c5b219e97f73607ff32db29bf8712d`  
**Remote:** `origin/main@a565a90952c5b219e97f73607ff32db29bf8712d`  
**Estado de tareas:** paralizadas; no hay trabajos activos.

## 1. Punto exacto alcanzado

ARKI terminó una fase de inventario y reconstrucción documental. El trabajo cubrió el sistema de capacidades, la arquitectura actual, el conocimiento histórico, el Libro Vivo, los futuros congelados, las ideas, las decisiones, las órdenes y las ambigüedades registradas hasta Delta 515.

La fase no fue de desarrollo. No se implementaron nuevas capacidades, no se repararon defectos y no se modificó el Core. El objetivo fue determinar qué existe, qué está demostrado, qué está documentado, qué está congelado, qué está pendiente y qué no puede afirmarse con la evidencia disponible.

## 2. Estado técnico de ARKI

ARKI es actualmente un **sistema local de apoyo arquitectónico trazable**, integrado sobre SICL. Su capacidad demostrada se concentra en:

- Ingestión local de imágenes, PDFs y documentos.
- OCR para PDFs textuales, PDFs escaneados e imágenes.
- Provenance y almacenamiento de fuentes.
- Biblioteca de fuentes `/sources` con búsqueda y visor ImagePanZoom.
- Preservación de `UNKNOWN`, `HYPOTHESIS` y `AI_PROPOSED`.
- Retrieval y razonamiento arquitectónico acotado.
- Transferencia tipológica con `TRANSFER`, `ADAPT`, `DO_NOT_TRANSFER` y `UNKNOWN`.
- Puente conocimiento→topología D6.2-M.
- Puente topología→geometría conceptual D6.3-G.
- Dos candidatos geométricos conceptuales en un microcaso controlado.
- Visualización 2D, massing 3D y AR/WebXR experimental.
- Persistencia local versionada, replay y gates de revisión humana.
- Libro Vivo ARKI como interfaz editorial/educativa.

## 3. Límites confirmados

No está demostrado que ARKI produzca:

- Expedientes completos listos para licencia.
- DWG/DXF nativo validado.
- Revit/RVT/IFC/BIM profesional.
- Familias Revit, estructura o MEP coordinados.
- Cálculo normativo automático o cumplimiento RNE verificado.
- GIS territorial completo, catastro o análisis urbano profesional.
- Terreno DTM/DSM, CFD o simulación térmica.
- GLB/glTF como intercambio validado.
- Aprendizaje autónomo generalizable.
- Tutor adaptativo longitudinal plenamente implementado.
- Persistencia remota canónica en SICL Core.
- Capacidad profesional autónoma o responsabilidad de firma.

## 4. Deltas y evidencias principales

**M0-K y D6.1** establecen el corpus, la procedencia, la separación epistemológica y la promoción humana local. La evidencia es acotada al corpus disponible.

**D6.2-M** demuestra retrieval y transformación de conocimiento hacia requisitos, unknowns, déficits, hipótesis, estrategias, realizaciones y topología. Se detiene antes de habitaciones, muros, dimensiones, BIM o planos constructivos.

**D6.3-G** demuestra dos realizaciones geométricas conceptuales trazables en un microcaso. No demuestra funcionalidad operativa, normativa, construcción ni documentación profesional.

**D6.4** añade ingestión multimodal, OCR, provenance, fuente visual y revisión humana. No convierte automáticamente OCR en `FACT`.

**L2** demuestra transferencia local, perturbación, contraejemplos, replay y persistencia versionada local. La escritura remota canónica permanece bloqueada/no demostrada.

**E-KNOW Block 2** mantiene SPACE/ROOM y SPATIAL_BOUNDARY/WALL como hipótesis `K2_CANDIDATE`, aunque sus pruebas locales reporten PASS.

## 5. Resultado de Delta 513/514

Se generaron inventarios de capacidad, madurez, arquitectura, activos históricos, potencial de extensión, recorridos de usuario y arquitecto, conocimiento, aprendizaje, tipologías, autonomía, multimodalidad y brechas software-conocimiento.

La conclusión fue que la investigación y el currículo de ARKI son más amplios que la capacidad de software demostrada. Los Excel D1–D6.1 se incorporaron como evidencia de investigación y contratos curriculares, no como prueba automática de aprendizaje o implementación.

## 6. Resultado de Delta 515

No se encontró un repositorio canónico separado de ideas, backlog o roadmap. La memoria de ARKI está distribuida entre `todo.md`, RFCs, manifests, fixtures, informes, inventarios, código y Git.

Se identificaron 23 ideas/proposiciones y 10 familias de órdenes. Se reconstruyeron decisiones congeladas, futuros preservados, ideas importantes no implementadas, relaciones entre conocimiento e implementación y vacíos de trazabilidad.

Las ideas futuras más importantes preservadas son:

- Persistencia remota Core y E2E verificable.
- Tutor adaptativo del Libro Vivo.
- Razonamiento normativo jurisdiccional.
- Modelo constructivo BIM/CAD/MEP/estructura.
- Tres realizaciones PARTI con rechazo y backtracking.
- Continuidad sitio→edificio→operación.
- ARKI-CONSTRUCT, ARKI-BUILDING y composites del ecosistema.

## 7. Resolución de los 11 conflictos

Los 11 conflictos fueron resueltos documentalmente, sin implementar capacidades:

1. Se adopta el HEAD actual como baseline reproducible.
2. Delta 513/514/515 se clasifican como órdenes documentadas, sin inferir cierre completo.
3. Los reportes históricos se mantienen como lineage/replay.
4. D6.3-G queda limitado a microcaso conceptual.
5. ARKI-BOOK queda como vista editorial.
6. E-KNOW continúa como hipótesis, no FACT.
7. L2 queda como local PASS y remoto BLOCKED.
8. R-PARTI queda como NOT_VERIFIED y fuera del baseline.
9. La aprobación de RFC no equivale a despliegue.
10. No se afirma un runtime Delta 515 unificado.
11. Los baselines históricos se conservan sin declararlos superseded.

## 8. Estado del repositorio y tareas

No hay tareas activas. La consulta final de trabajos reportó cero jobs en ejecución.

El código rastreado no tiene modificaciones pendientes: `git diff --name-only` no devuelve archivos modificados. Los informes de inventario están presentes como archivos no rastreados en `docs/arki-inventory/` y `docs/arki-post-513-inventory/`. Por tanto, están disponibles en el entorno local, pero no forman parte de `HEAD` ni de `origin/main`.

No se realizó commit, push, PR, merge ni deploy durante esta fase.

## 9. Estado global

**Estado global de ARKI:** `DEMONSTRATED_PARTIAL`.

**Interpretación:** existe una base local trazable con razonamiento, topología, geometría conceptual, multimodalidad y revisión humana. La distancia restante hasta un sistema profesional de proyecto ejecutivo, BIM, normativa y aprendizaje generalizado sigue siendo considerable y está documentada, no resuelta.

## 10. Próximo paso permitido

El trabajo queda detenido para revisión humana. No se recomienda iniciar una nueva implementación hasta que el Product Owner y el Arquitecto Jefe decidan qué baseline documental adoptar, qué futuros priorizar y qué evidencia adicional exigir.

## Referencias

[1]: file:///home/ubuntu/sicl-web/docs/arki-inventory/ARKI_TOTAL_SYSTEM_INVENTORY.md "ARKI Total System Capability Inventory"
[2]: file:///home/ubuntu/sicl-web/docs/arki-inventory/ARKI_IDEA_AND_DECISION_INVENTORY.md "ARKI Idea and Decision Inventory — Delta 515"
[3]: file:///home/ubuntu/sicl-web/docs/arki-inventory/ARKI_CONFLICT_RESOLUTION_RECORD.md "ARKI Conflict Resolution Record"
[4]: file:///home/ubuntu/sicl-web/docs/arki-post-513-inventory/ARKI_POST_513_EXECUTIVE_SYNTHESIS.md "ARKI Post-513 Executive Synthesis"
[5]: file:///home/ubuntu/sicl-web/docs/arki-d64/D6.4-MULTIMODAL-SOURCE-INGESTION-REPORT.md "D6.4 Multimodal Source Ingestion Report"
[6]: file:///home/ubuntu/sicl-web/docs/arki-l2/ARKI-L2-TRANSFER-RUNTIME.md "ARKI L2 Transfer Runtime"
