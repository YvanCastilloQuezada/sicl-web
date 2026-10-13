# BIC-002 — Primera extracción de ideas desde ramas (evidencia GitHub)

Corte 2026-10-13. Estado: PARTIAL, sin merge ni modificaciones canónicas.

## Inventario de ramas
- sicl-web: 85 ramas (incluye main).
- sicl-core: 105 ramas (incluye main).
- arki-acs: 2 ramas (incluye main).
- Total 192 ramas, 189 ramas no-main. La enumeración terminó al recibir página vacía y cursor null en Core. **No significa 189 ideas**.
- Git no tiene «subramas» anidadas como objetos: nombres con barras son etiquetas; ramificaciones reales se infieren del grafo de commits, merge bases y diferencias de contenido.

## Muestra de inspección por comparación exacta contra main
| Repositorio | Rama | Ahead | Behind | Archivos diff | Lectura preliminar |
|---|---|---:|---:|---:|---|
| web | feat/arbol-vivo-autoensamblaje-20261011 | 704 | 0 | 137 | múltiples capacidades; no 704 ideas |
| web | feat/arbol-vivo-precedencias-seguras-20261010 | 741 | 0 | 140 | múltiples capacidades, parte compartida con anterior |
| web | feat/arki-autonomy-orchestrator-20261013 | 712 | 0 | 143 | memoria, orquestación y otras capacidades compartidas |
| web | feat/f7-f8-integral-closure | 438 | 0 | 90 | coordinación profesional, dossier y avances anteriores |
| web | feat/agk-003-parametric-family-unification | 11 | 29 | 7 | familia paramétrica/regeneración AGK |
| web | feat/e2e002-spatial-reasoning-phase1 | 149 | 29 | 60 | razonamiento espacial, AGK, Capability Fabric |
| web | feat/arki-frontend-assembly-v1 | 51 | 1 | 19 | vistas de interfaz y mapa |
| web | feat/arki-master-map-live-v1 | 0 | 8 | 0 | no delta exclusivo vs main |
| core | feat/commit-8a-d2-persistence | 0 | 74 | 0 | contenido histórico ya alcanzado por main, no rescatar a ciegas |
| core | feat/commit-8b4b1-d2-event-contract | 0 | 31 | 0 | contrato histórico ya alcanzado por main |
| core | feat/h005-selective-recomputation | 0 | 119 | 0 | implementación histórica sin delta exclusivo |
| core | feat/dam-dna-advisor-examiner-foundation | 32 | 0 | 17 | asesor/examinador y pruebas; candidato |
| core | feat/rfc-034-1-layout-engine | 4 | 157 | 39 | dibujo/layout; rama divergente antigua |
| core | reconcile/arki-live-map-2026-10-07 | 2 | 0 | 2 | contrato de autoridad y limitaciones históricas |
| acs | feat/oece-arki-integration-v1 | 85 | 0 | 40 | adquisición OECE y evidencia, repositorio separado |

## Clústeres de ideas (NO número total)
| Clúster | Ramas que pueden contribuir | Conector | Riesgo de duplicación |
|---|---|---|---|
| CL-01 Continuidad y memoria | precedencias, autoensamblaje, autonomy-orchestrator, autonomy-memory | Mapa Vivo → Core Evidence | ALTO: múltiples diarios experimentales |
| CL-02 Árbol Vivo y autoensamblaje | precedencias, autoensamblaje, orchestrator | Árbol F1–F10 / propuestas | ALTO: planners/precedencias solapados |
| CL-03 Gemelo y razonamiento | e2e002, ADN, F7/F8 | Gemelo experimental → métricas | MEDIO: no asumir simulación verificada |
| CL-04 Geometría paramétrica | agk-003, e2e002 | AGK autoridad operacional | ALTO: versiones históricas compartidas |
| CL-05 Interfaz y Mapa | frontend-assembly, master-map-live, precedencias | Web proyección | ALTO: componentes ya en main |
| CL-06 Persistencia y eventos | core commit-8a, commit-8b4b1, live-map | Core autoridad canónica | ALTO: historial ya incluido en main |
| CL-07 Aprendizaje asesor | core dam-dna-advisor-examiner | Core DAM bajo contratos | DESCONOCIDO |
| CL-08 Dibujo profesional | core rfc-034 layout | Core proyección / dibujo | DESCONOCIDO |
| CL-09 Expediente profesional | web F7/F8 | Web proyección sobre Core/D-2/AGK | MEDIO |
| CL-10 Corpus OECE | acs oece integration | ACS adquisición → evidencia gobernada | BAJO con Web; límites autoridad |

## Algoritmo para la extracción exhaustiva
1. Para cada rama no-main, comparar con main y con ancestros cercanos; obtener lista de commits, rutas y diffs, no solo nombre.
2. Agrupar rutas por API/función/contrato y tests; una rama puede originar N fichas, una ficha puede enlazar M ramas.
3. Registrar SHA, repositorio, ruta, función, tests, dependencias, autoridad, F1–F10/UNKNOWN, evidencia y conector propuesto.
4. Detectar equivalencia por firma de API, pruebas, historial compartido y comportamiento; no deduplicar solo por nombres.
5. Clasificar COMPLEMENTARY / DUPLICATE / SUPERSEDED / REJECT / UNKNOWN y explicar evidencia.
6. Nunca confundir ahead/behind con cantidad de ideas ni aceptar código no verificado como integrado.

## Pendientes y criterio de cierre
Falta comparar 174 ramas no-main adicionales, inspeccionar diffs de archivos por clúster y calcular conteo deduplicado. Por tanto **TOTAL DE IDEAS = UNKNOWN** hasta completar el análisis. No borrar ni mover ramas todavía.
