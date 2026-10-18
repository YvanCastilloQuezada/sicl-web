# SICL 1–3 — Jerarquía espacial y temporal

## Decisión semántica

SICL utiliza un mismo núcleo de entidades y relaciones —fuentes, evidencia, requisitos, objetivos, restricciones, alternativas, evaluaciones, comparaciones, recomendaciones, HumanReview, Decision y Event— para distintos alcances. El alcance espacial y el horizonte temporal contextualizan el análisis; no modifican por sí mismos las reglas matemáticas, no crean ganadores y no conceden autoridad humana.

| Nivel | Alcance espacial representado | Uso previsto |
|---|---|---|
| SICL 1 | `PROJECT` | Edificio, sitio, alternativas, evaluación, recomendación y decisión. |
| SICL 2 | `SECTOR`, `DISTRICT`, `CITY`, `METROPOLITAN_AREA`, `REGION` | Planeamiento urbano y territorial. |
| SICL 3 | `MACROREGION`, `COUNTRY` | Desarrollo nacional y comparación de escenarios. |

## Contrato de datos

`spatial_scope` contiene `scale`, `id`, `name` y, opcionalmente, `parentId`. `temporal_scope` contiene `horizon`, con valores `PRESENT`, `2030`, `2040` o `2050`, y un `scenario` opcional. Los campos son opcionales para preservar snapshots históricos; valores desconocidos se descartan durante la normalización en lugar de inferirse.

Un horizonte como `2030`, `2040` o `2050` es un marco temporal declarado. No equivale a una predicción ni habilita generación automática de escenarios. La responsabilidad de definir evidencia, supuestos y autoridad permanece separada.

## Estado de implementación

El Command Center permite seleccionar escala y horizonte al crear un proyecto, los conserva en el snapshot web y los muestra como marco analítico activo. El adaptador TypeScript normaliza las variantes `spatial_scope`/`spatialScope` y `temporal_scope`/`temporalScope`, sin fusionarlas con las colecciones analíticas.

El núcleo Python ahora recibe estos campos como parte opcional de su entidad `Project`, los valida, los persiste en SQLite y los devuelve en la respuesta canónica del adaptador HTTP. Los snapshots históricos sin estos campos siguen siendo válidos. La prueba end-to-end contra una instancia remota desplegada permanece pendiente únicamente porque el Cloud Computer todavía no está adjunto.
