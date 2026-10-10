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

## Implementación complementaria: observabilidad, alternativas, geometría, tiempo y respaldo

**Estado:** código y pruebas añadidos a la rama experimental; **NO VERIFICADO** hasta ejecutar las suites sintética y Edge.

### Alternativas A/B/C

`twinThreeAlternatives(twinObservation())` produce tres proyecciones reproducibles de las piezas documentales:

- **A:** ubicación original declarada (baseline).
- **B:** ubicación propuesta por la lógica documental existente.
- **C:** ubicación propuesta solo cuando no existen dependencias desconocidas; de lo contrario conserva la ubicación original.

Las tres calculan conteos de traslados y referencias desconocidas. No son tres resultados de un motor generativo, no se puntúan económicamente y no se promueven automáticamente. Pueden coincidir si los datos no justifican diferencias.

### Recibos de ejecución externos (contrato de importación)

Se acepta un JSON de la forma:

```json
{
  "schema": "ARKI-TWIN-EXECUTION-RECEIPTS-1",
  "receipts": [{
    "id": "EXAMPLE-1",
    "producer": "AGK",
    "outcome": "UNKNOWN",
    "timestamp": "2026-10-10T14:00:00Z",
    "operation": "mesh-export",
    "commit": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "phaseId": "F6"
  }]
}
```

**Este ejemplo es sintético y NO constituye evidencia de ejecución real.** El adaptador rechaza duplicados, resultados fuera de catálogo, timestamps inválidos y commits mal formados. La autenticación permanece `UNVERIFIED_EXTERNAL_CLAIM` incluso si el campo `outcome` dice `SUCCESS`. El usuario debe proporcionar recibos reales desde una fuente autorizada; el prototipo no tiene credenciales ni conexión a runtime.

### Malla 3D externa (contrato de lectura)

```json
{
  "schema": "ARKI-TWIN-AGK-MESH-1",
  "canonicalMutation": false,
  "sourceCommit": "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
  "vertices": [[0,0,0],[1,0,0],[0,1,0]],
  "triangles": [[0,1,2]]
}
```

**Ejemplo sintético; no es una exportación real de AGK.** Se verifican límites de cantidad, coordenadas finitas, índices válidos y triángulos no degenerados por índice. El visor usa una proyección isométrica SVG de los triángulos, sin conexión directa al AGK. No se demuestra la topología de sólidos, precisión geométrica, unidades, ni fidelidad entre formatos.

### Historial causal documental

La línea temporal muestra la versión, el disparador registrado y el tipo de cambio. El historial conserva el carácter `DOCUMENTARY_HISTORY_ONLY`; el disparador no es prueba de causalidad física ni de ejecución.

### Respaldo con SHA-256

`exportTwinVerifiedBackup()` genera un sobre JSON con el workspace y su digest SHA-256 calculado por WebCrypto. `importTwinVerifiedBackup()` compara el hash **antes** de importar el workspace, y conserva las validaciones previas de fases e historiales.

**SHA-256 detecta alteraciones accidentales, pero no autentica al autor.** Un atacante puede recalcular el hash. El archivo debe conservarse fuera del perfil Edge y verificarse mediante restauración en un entorno aislado. La copia no incluye recibos externos ni mallas importadas, que siguen siendo datos de sesión no autenticados.

### Puertas pendientes para integración productiva

- Proveedor de recibos **autenticados** Core/AGK con firma o canal confiable, correlación, autorización y esquema estable.
- Adaptador geométrico real con unidades, transformaciones, versión AGK, tolerancias y procedencia verificable.
- Evaluador de alternativas con restricciones, objetivos multiobjetivo, trazabilidad y prueba de no-regresión.
- Pruebas Edge reales, restauración en un segundo perfil, pruebas de rendimiento y revisión de seguridad.
- Auditoría del Equipo Rojo y congelamiento explícito de contratos. Ninguna de estas puertas está declarada cerrada.
