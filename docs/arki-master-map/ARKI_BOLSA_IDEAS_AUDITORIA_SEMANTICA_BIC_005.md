# ARKI — BIC-005: Auditoría semántica de ideas, no solo ramas

Fecha 2026-10-13. Lectura directa de fuentes históricas. **Sin ejecución de pruebas ni cambios canónicos.**

## Dos ideas recuperadas a nivel de contenido

### BIC-015 — ARE, Representar muchas veces desde un modelo
Fuente: `sicl-core@feat/arki-are-001-contract:docs/architecture/ARKI_ARE_001_REPRESENTATION_ARCHITECTURE_CONTRACT.md`.
- Intención: MODEL ONCE → REASON ONCE → REPRESENT MANY. Diferenciar MODEL / VIEW / DRAWING / RENDER; representación nunca equivale a verdad arquitectónica.
- Madurez **en la fuente**: CONTRACT_COMPLETE_PENDING_RED_TEAM; el propio contrato declara que **no implementa** runtime, motor de proyección, render ni exportadores.
- Conector: fuente D-2 semántica / AGK operacional (según autoridad aplicable) → vistas derivadas → ARKI-DRAW, sin mutación canónica.
- Fase F1–F10: UNKNOWN hasta mapeo contractual. Valor: alto como contrato, no afirmar que el sistema está listo.
- Ramas relacionadas: ARE-001, ARE-002, ARE-003, ARKIDRAW block1/2, M1 vector plan; complementarias por hipótesis, falta comparar código.

### BIC-016 — Adaptador de escena gráfica ARKI-DRAW
Fuente: `sicl-core@feat/arkidraw-block2-scene-adapter:src/sicl/drawing/scene_adapter.py`.
- Intención: consumir `GraphicScene` ARE y convertir a primitivas vectoriales/SVG con trazabilidad gráfica; no inspeccionar D-2, IFC ni relaciones directamente.
- Evidencia de código: `AdaptedGraphicScene`, `DrawingAdapterError`, validación de margen finito, estilos/line weights y geometría; prueba asociada `tests/test_drawing_block2.py` localizada por comparación.
- Conector: ARE GraphicScene → ARKI-DRAW SVG / composición gráfica. No equivale a mutación de geometría canónica.
- Madurez: CODE_CANDIDATE / TESTS_PRESENT_NOT_EXECUTED.
- Relación con BIC-015: **COMPLEMENTARY_CANDIDATE**, no duplicado: contrato de representación frente a adaptador de dibujo.

## Matriz de deduplicación — primer resultado defendible
| Pareja | Juicio | Fundamento | Confianza |
|---|---|---|---|
| ARE-001 vs ARKIDRAW Block2 | Complementarias candidatas | una define arquitectura de representación; otra adapta escena gráfica a vector | MEDIA, lectura directa |
| ARE-001 vs ARE-002/003 | Etapas de misma familia, NO descartar | nombres y continuidad histórica; falta inspección de runtime/proyección | BAJA |
| Memoria Web experimental vs Core persistencia | Solapamiento potencial, NO duplicación confirmada | dominios de autoridad distintos, implementaciones no comparadas por conducta | BAJA |

## Criterio de descarte
Nunca descartar por 0 ahead, ausencia de archivos nuevos, rama antigua o nombre. Para rechazar: describir idea, comparar objetivos y cobertura actual, mostrar evidencia de inviabilidad/obsolescencia o duplicación total, y registrar decisión autorizada. Las ideas incompletas pueden seguir siendo prioritarias.

## Conteos
Las 39 ramas previamente comparadas siguen siendo 39: estas lecturas profundizan dos fichas, **no agregan ramas al total**. Ideas únicas totales: UNKNOWN. No hay ejecución CI ni integración.
