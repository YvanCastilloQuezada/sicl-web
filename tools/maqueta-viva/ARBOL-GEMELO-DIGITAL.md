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
