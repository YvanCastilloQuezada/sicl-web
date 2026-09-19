# ARKI — Operacionalización tipológica y topologías educativas

## Estado

`TYPOLOGY_OPERATIONALIZATION = IMPLEMENTED / HYPOTHESIS / HUMAN_REVIEW_REQUIRED`

Se extendió la gramática funcional canónica existente. No se creó un segundo motor generativo, una segunda ontología de habitaciones ni una planta automática.

## Cobertura

Se materializaron programas operativos con el mismo contrato canónico para las ocho tipologías registradas:

| Tipología | Programa operativo | Estado epistemológico | Revisión humana |
|---|---:|---|---:|
| Residential | Sí | HYPOTHESIS | Obligatoria |
| Education | Sí | HYPOTHESIS | Obligatoria |
| Healthcare | Sí | HYPOTHESIS | Obligatoria |
| Hospitality / Commerce | Sí | HYPOTHESIS | Obligatoria |
| Office / Religious | Sí | HYPOTHESIS | Obligatoria |
| Industry / Laboratory / Agriculture | Sí | HYPOTHESIS | Obligatoria |
| Sports / Culture | Sí | HYPOTHESIS | Obligatoria |
| Transport | Sí | HYPOTHESIS | Obligatoria |

La implementación operacionaliza perfiles, sistemas mínimos, actividades, relaciones, flujos, controles, interfaces, capacidades y requisitos funcionales. Los datos contextuales ausentes permanecen `UNKNOWN`.

## Educación antes de geometría

La zonificación educativa se conecta con tres alternativas de topología pre-coordenada:

1. `EDU-TOPOLOGY-A`: learning street con commons supervisado.
2. `EDU-TOPOLOGY-B`: clúster de aprendizaje alrededor de patio.
3. `EDU-TOPOLOGY-C`: pabellones conectados por commons controlado.

Las tres conservan las bandas:

```text
PUBLIC_ENTRY → SUPERVISED_SHARED → LEARNING → STAFF_RESTRICTED → SERVICE
```

Todas incluyen la restricción `SERVICE` separado de `LEARNING`. Ninguna produce coordenadas, ganador, recomendación o decisión.

## Evaluación 1

`EDU-EVAL-01`

- Matrícula sintética: 180 estudiantes.
- Contexto de sitio: lote urbano compacto.
- Condición climática: cálido-seco.
- Resultado: las tres alternativas cubren las zonas y preservan la separación de servicio/aprendizaje.
- Ajuste climático y espacial: `UNKNOWN`; requiere información del sitio y juicio humano.
- Ganador: no creado.
- Recomendación: no creada.
- Decisión: no creada.

## Evaluación 2

`EDU-EVAL-02`

- Matrícula sintética: 96 estudiantes.
- Contexto de sitio: lote suburbano abierto.
- Condición climática: frío-húmedo.
- Resultado: las tres alternativas cubren las zonas y preservan la separación de servicio/aprendizaje.
- Ajuste climático y espacial: `UNKNOWN`; requiere información del sitio y juicio humano.
- Ganador: no creado.
- Recomendación: no creada.
- Decisión: no creada.

La segunda evaluación usa un contexto sintético diferente y comprueba que el sistema no convierte automáticamente una alternativa en solución preferida.

## Validación

- Typecheck: `PASS`.
- Pruebas focalizadas: `21/21 PASS`.
- Evaluaciones independientes: `2`.
- Alternativas evaluadas por evaluación: `3`.
- Plantas geométricas generadas por esta fase: `0`.
- Cumplimiento normativo declarado: `NO`.
- Autoridad humana: `PRESERVED`.

## Siguiente paso

El siguiente paso seguro es convertir una sola alternativa educativa seleccionada por el arquitecto en un grafo espacial más detallado, manteniendo la separación entre programa, topología, geometría y cumplimiento. La selección debe ser humana; esta fase no selecciona ganadores.
