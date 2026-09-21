# ARKI-PARAMETRIC-RUNTIME

## Propósito

`ARKI-PARAMETRIC-RUNTIME` es la capa de control paramétrico de ARKI. Su función es observar, validar, transformar y conservar geometría paramétrica sin convertirla automáticamente en decisión arquitectónica. La página propia del runtime muestra cambios en tiempo real mediante SVG determinista, guarda sesiones por proyecto y permite exportar un paquete de intercambio.

## Paquete de intercambio

Al exportar una propuesta llamada `casa_yvan`, ARKI genera:

| Archivo | Uso | Estado |
|---|---|---|
| `casa_yvan.ark` | Formato propio de propuesta ARKI, con geometría, grafo, provenance, observaciones y UNKNOWNs | Generación local demostrada |
| `casa_yvan.dyn` | Grafo textual de intercambio para Dynamo y flujo posterior hacia Revit | Generación local; ejecución requiere Dynamo/Revit |
| `casa_yvan.ghx` | XML legible de intercambio para Grasshopper/Rhino | Generación local; ejecución requiere Rhino/Grasshopper o Rhino.Compute |

ARKI no fabrica un `.rvt` ni un `.gh` binario falso. Los formatos nativos dependen de sus aplicaciones, SDKs y hosts autorizados. Cuando existan endpoint HTTPS, token, versión compatible y aprobación humana, el host worker existente puede recibir una orden `VALIDATE`, `EXECUTE` o `EXPORT`. Sin esos requisitos, el estado permanece `PENDING_EXTERNAL`.

## Formato `.ark`

El formato propio usa el contrato `ARKI-ARK-1.0`. Una propuesta contiene `projectId`, `name`, `source`, `geometry`, el grafo paramétrico opcional, `observations`, `unknowns`, fecha de creación y `humanReviewRequired: true`.

El archivo se puede abrir de nuevo desde la página del runtime. ARKI valida el contrato y lo incorpora como `PROPOSAL_IMPORTED`. Si la geometría es una masa o una masa con patio, su rol se clasifica como `VOLUMETRIC_PROPOSAL`; si son puntos, como `CONCEPTUAL_GEOMETRY`. La asimilación conserva reglas geométricas y genera próximos análisis: programa y circulación, iluminación y ventilación, estructura, regulación, costo y comparación de alternativas. No genera una decisión automática ni promueve la propuesta a FACT.

## Sesiones persistentes

Cada sesión se guarda con `ownerId`, `projectId`, `sessionId`, comando, parámetros, resultado de preview, paso tutorial, puntaje del ejercicio y última acción. La Escuela Operativa recupera la sesión del proyecto activo y realiza autoguardado después de cambios, además de ofrecer **Guardar ahora**. Las sesiones no se mezclan entre proyectos.

## Aprendizaje

El tutorial introduce geometría, mutación paramétrica, lectura de consecuencias y reingesta `.ark`. El ejercicio evaluable comprueba que el usuario entiende la diferencia entre una propuesta geométrica trazable y una decisión constructiva aprobada. El puntaje se conserva junto con la sesión para continuar posteriormente.

## Límites epistemológicos

Una forma generada no prueba funcionalidad, cumplimiento normativo, seguridad estructural, costo ni constructibilidad. El runtime es un acelerador de exploración y de intercambio; la evaluación arquitectónica completa exige contexto, evidencia, alternativas, revisión humana y, cuando corresponde, especialistas y hosts profesionales.
