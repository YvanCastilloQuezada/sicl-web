# ARKI — ÁRBOL Vivo y ÁRBOL Gemelo Digital

## Nombres oficiales en esta interfaz

- **ÁRBOL Vivo**: representación documental de la columna vertebral F1–F10, actividades, hojas, capacidades y dependencias del proyecto ARKI.
- **ÁRBOL Gemelo Digital**: pantalla de observación sincronizada del estado del sistema ARKI, con tres representaciones de una misma fuente de datos.
- **No confundir** con los futuros gemelos digitales de edificios, conjuntos, ciudades o territorio que ARKI diseñe o supervise.

## Tres representaciones implementadas

| Vista | Función | Fuente |
| --- | --- | --- |
| ÁRBOL Vivo | Fases y dependencias documentales | `phaseData()`, `twinPhaseSnapshot()` |
| Cerebro relacional | Grafo de fases y enlaces explícitos | Mismo estado observado, sin inferir conexiones inexistentes |
| Vista 3D | Proyección isométrica conceptual de las fases y relaciones | Mismo estado observado; **no** geometría AGK ni simulación |

El centro de observación muestra indicadores de piezas documentales, evidencias sin autenticar, decisiones provisionales y revisiones. La selección de fase es compartida con el Árbol Vivo tradicional. El selector de versiones permite consultar snapshots `ALT-xxxx` sin reimportarlos ni mutar el estado actual.

**Modelo de observación:** `twinObservation()` con `schema=ARKI-TWIN-OBSERVATION-1`, `canonicalMutation=false`, `verification=UNKNOWN`, `simulation=NOT_EXECUTED`.

## Límites y siguientes pasos

1. La vista 3D es **una proyección gráfica conceptual**. No se ha implementado un modelo geométrico 3D navegable ni se ha conectado el AGK.
2. El Cerebro muestra dependencias disponibles; no supone una arquitectura completa de relaciones semánticas, de causalidad o de runtime.
3. Las fases y estados históricos proceden de catálogos documentales y snapshots experimentales; `FROZEN` documental no es certificación de ejecución.
4. El selector de versiones es read-only. No es un mecanismo de restauración o de promoción canónica.
5. Validar con pruebas sintéticas y Edge reales antes de marcar esta versión `VERIFIED`.

**Disciplina:** CLAIM ≠ IMPLEMENTED ≠ EXECUTED ≠ VERIFIED ≠ FROZEN.

## Suplemento — propagación documental de dependencias

El inspector del ÁRBOL Gemelo Digital permite activar **Mostrar propagación documental** sobre la fase seleccionada. Calcula:

- Dependientes directos por referencias de fases y dependencias entre piezas documentales.
- Alcance transitivo mediante recorrido del grafo dirigido; evita bucles en ciclos.
- Cantidad de referencias a piezas desconocidas (no se inventan enlaces).
- Advertencias permanentes: `DOCUMENTARY_ESTIMATE_ONLY`, `NOT_EXECUTED`, `UNKNOWN`, sin mutación canónica.

Esta función **no** predice efectos físicos, costos, cumplimiento normativo ni impactos geométricos. No sustituye la futura causalidad verificada por AGK/Core.

### Recomendaciones priorizadas

1. **Evidencia primero:** conectar los identificadores de fases, piezas, dependencias y decisiones a recibos versionados de fuente real; mantener `UNKNOWN` ante falta de respaldo.
2. **Observabilidad real:** instrumentar eventos de ejecución de Core/AGK con tiempo, correlación, resultado y huella del código, sin mezclar la vista documental con la ejecución real.
3. **Impacto causal:** distinguir `DEPENDENCY_DECLARED`, `INFERRED` y `EXECUTION_VERIFIED`; prohibir que una inferencia se convierta en hecho.
4. **Geometría real:** integrar geometría 3D del AGK solamente mediante contrato de lectura autorizado; la vista isométrica actual no debe presentarse como simulación.
5. **Comparación de alternativas:** preparar tres escenarios `A/B/C` aislados con objetivos, restricciones, cobertura de evidencia, diferencias y trazabilidad; no elegir automáticamente una alternativa sin criterios auditables.
6. **Persistencia:** incorporar exportación de respaldos con checksum y prueba de restauración entre perfiles; `localStorage` no es un almacén duradero.
7. **Accesibilidad:** reforzar teclado, zoom, búsqueda de nodos y manejo de grafos grandes antes de promover la interfaz.

**Estado:** IMPLEMENTED / AWAITING EXECUTION para el suplemento de propagación.
