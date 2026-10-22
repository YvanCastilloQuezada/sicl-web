# ARKI — BIC-006: Macrolote semántico ARE → ARKI-DRAW

Fecha: 2026-10-13. Fuentes inspeccionadas directamente en GitHub, sin ejecución local ni CI.

## Ideas preservadas por su contenido
| ID | Idea | Fuente | Madurez demostrada por lectura | Conector |
|---|---|---|---|---|
| BIC-017 | Contratos inmutables y neutrales de representación ARE-002 | `sicl-core@feat/arki-are-002-runtime-foundation:src/sicl/representation.py` | Implementación de tipos y validaciones; explícitamente NO proyecta, dibuja, persiste ni muta D2 | Snapshot arquitectónico → contrato ARE |
| BIC-018 | Proyección 2D ARE-003 | `sicl-core@feat/arki-are-003-2d-projection:src/sicl/representation.py`; rama histórica | Se constató base ARE-002 compartida; implementación específica de proyección todavía NO verificada | ARE contracts → GraphicScene, pendiente localizar código exacto |
| BIC-019 | Primitivas de dibujo deterministas ARKIDRAW Block1 | `sicl-core@feat/arkidraw-block1:src/sicl/drawing/primitives.py` | Clases Point, Line, Polyline, tipos de acotación, estilos y validaciones; no implica render completo | Primitivas → láminas/SVG derivados |
| BIC-020 | Exportación y composición ARKIDRAW | `sicl-core@feat/arkidraw-block1:src/sicl/drawing/__init__.py` | Interfaces expuestas de SVG, drawing set, composer, PDF, HTTP; ejecución pendiente | Scene/Primitives → publicación gráfica |

## Grafo conceptual con autoridad
```
Core/D-2/AGK (verdad según dominio)
   -> ARE-001 contrato de representación (BIC-015)
   -> ARE-002 contratos inmutables (BIC-017)
   -> ARE-003 proyección (BIC-018; evidencia incompleta)
   -> GraphicScene
   -> ARKI-DRAW Block2 adaptador (BIC-016)
   -> ARKI-DRAW Block1 primitivas y composición (BIC-019/020)
   -> SVG / láminas / publicación derivada
```
No convertir este grafo hipotético en afirmación de integración ejecutada.

## Solapamientos y complementariedad
- BIC-015 vs BIC-017: contrato arquitectónico frente a implementación de contratos tipados; **complementarios**.
- BIC-017 vs BIC-018: la misma ruta `representation.py` aparece en ambas ramas; **código compartido**, no concluir que ARE-003 es duplicado sin localizar su implementación específica.
- BIC-016 vs BIC-019: adaptador de escena frente a primitivas geométricas de dibujo; **complementarios**.
- BIC-019 vs BIC-020: primitivas frente a exportadores/composición; **subcapacidades de familia común**.

## Criterios siguientes
Identificar implementación específica de ARE-003, revisar tests y comparar comportamiento con ARE-002; verificar estado actual en main. Mantener la idea de proyección incluso si no hay módulo exclusivo. Nunca descartar por ausencia de commits únicos.

## Contadores
39 ramas comparadas preliminarmente de 189 no-main; **este macrolote profundiza fuentes ya incluidas**, no aumenta contador. Ideas únicas totales UNKNOWN. Sin CI ni integración.
