# ARKI — BIC-007 / Cronología verificable de ideas y nuevo macrolote

Fecha del informe: 2026-10-13. Fuentes: GitHub search_commits (created_at) y compare_commits. NO equiparar fecha de commit con nacimiento intelectual de una idea.

## Política temporal obligatoria
- `idea_conceived_at`: fecha en que se propuso por primera vez la idea; UNKNOWN si no hay documento/conversación fechado.
- `first_repository_evidence_at`: primer commit verificable que menciona o materializa explícitamente la capacidad; solo cuando búsqueda y trazabilidad suficientes.
- `first_observed_commit_at`: primer commit observado en la búsqueda actual; no necesariamente el primero histórico.
- `branch_created_at`: UNKNOWN salvo evidencia de creación de ref (Git no guarda fecha de creación de rama).
- `commit_at`: fecha del commit GitHub y SHA; `observed_at`: fecha de auditoría.
- `integrated_at`, `validated_at`: UNKNOWN salvo prueba explícita. Registrar zona horaria original y UTC normalizado.
- `temporal_confidence`: EXACT_COMMIT / SEARCH_SAMPLE / DOCUMENT_CLAIM / UNKNOWN.

## Cronología de commits observados (NO cronología completa de nacimiento)
| Fecha y hora original | Evento | SHA | Interpretación |
|---|---|---|---|
| 2026-09-27 23:45:50 UTC | feat(arkidraw): primitivas deterministas y exportación SVG | `4d932c2c2` | evidencia de implementación ARKIDRAW; no fecha de concepción |
| 2026-09-28 06:11:01 UTC | docs(architecture): cerrar semántica de fuentes/dependencias ARE | `e80bd3a21` | contrato ARE observado |
| 2026-09-28 06:25:19 UTC | feat(are-002): contratos inmutables | `f7bf872f0` | implementación parcial ARE-002 |
| 2026-09-28 06:56:11 UTC | feat(are): proyección arquitectónica 2D | `faf8d4ee5` | implementación ARE-003 indicada por commit; revisar archivo/tests |
| 2026-09-28 07:01:40 UTC | fix(are): semántica de vistas de proyección | `c914a279d` | endurecimiento de ARE-003 |
| 2026-09-30 22:56:16 -05:00 | feat(agk): columna vertebral de geometría operacional | `2cfb197de` | inicio observado del conjunto AGK por búsqueda textual |
| 2026-09-30 22:59:22 -05:00 | feat(agk): propagación atómica de dependencias host | `dcdc01ec5` | subidea causal AGK |
| 2026-09-30 23:13:42 -05:00 | fix(agk): determinismo e inmutabilidad del commit draft | `b0508d0b8` | endurecimiento AGK |

**Precaución:** La búsqueda `ARE` también devolvió un commit H-001 del 2026-09-27 por coincidencia textual; se excluyó por no demostrar creación de ARE. La cronología anterior está filtrada por relevancia semántica, no por mera coincidencia de palabras.

## Macrolote: doce comparaciones, cinco ramas no contadas previamente
| Repo | Rama | Ahead | Behind | Ideas preservadas | Contada antes |
|---|---|---:|---:|---|---|
| web | feat/agk-t4-t7-evidence-v2 | 75 | 0 | AGK evidencias T4–T7, OCCT, nomenclatura persistente | NO |
| web | feat/vertical-dimension-authority | 0 | 100 | Autoridad de dimensiones verticales | NO |
| web | feat/vertical-special-volume-architectural-base | 0 | 96 | Base arquitectónica de volúmenes especiales | NO |
| web | feat/vertical-special-volume-geometry-resolution | 0 | 92 | Resolución geométrica de volúmenes especiales | SÍ |
| web | feat/arki-education-motor-readiness | 5 | 58 | Aprendizaje universitario → motor y pruebas | SÍ |
| web | feat/arki-frontend-assembly-v1 | 51 | 1 | Ensamblaje interfaz, visores, navegación | SÍ |
| core | feat/rfc-030-drawing-standard | 6 | 157 | Normas gráficas ISO/RNE Perú, símbolos y estilos | NO |
| core | feat/rfc-030-ifc-regeneration | 5 | 157 | Regeneración IFC, planos y exportación | NO |
| core | feat/rfc-034-1-layout-engine | 4 | 157 | Composición de láminas | SÍ |
| core | feat/rfc-037-1-vsm | 9 | 157 | Vigilancia/estándares y aprendizaje | SÍ |
| core | feat/dam-dna-advisor-examiner-foundation | 32 | 0 | DAM/ADN asesor-examinador | SÍ |
| core | feat/arki-case-001-controlled-house | 1 | 84 | Caso controlado de vivienda con SVG y evidencia | SÍ |

## Progreso deduplicado
Previo: 39 ramas no-main comparadas. Nuevas ramas únicas en este lote: 5 (AGK T4–T7, autoridad vertical, base de volumen, RFC-030 estándar, RFC-030 IFC). **Total actualizado: 44 de 189; 145 pendientes**. Doce llamadas comparativas, siete reauditorías. El conteo deduplicado prevalece sobre el número de consultas.

## Clasificación temporal e ideas
- Familia AGK: geometría operacional, causalidad, inmutabilidad, OCCT y volúmenes especiales. No asumir equivalencia entre subideas.
- Familia ARE/ARKIDRAW: contratos → proyección → escena → primitivas → composición y normas de dibujo. Son etapas relacionadas, no necesariamente duplicados.
- Familia de aprendizaje: educación universitaria, VSM y DAM/ADN; conexiones tentativas, sin evidencia de integración.
- El primer commit observado no demuestra fecha de creación de rama ni de la idea. No fabricar fechas.

## Próximo cierre
Obtener fecha más antigua verificable por idea desde documentos/commits; localizar implementación ARE-003 y tests; seguir las 145 ramas; publicar tabla cronológica ordenable y clasificación por capacidad con conectores. No modificar main ni verdad canónica.
