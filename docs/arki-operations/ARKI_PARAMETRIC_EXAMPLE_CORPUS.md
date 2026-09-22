# ARKI Parametric Example Corpus

El corpus de ejemplos paramétricos contiene **67 ejemplos, uno por cada comando del catálogo canónico**. Cada registro conserva un identificador estable (`EJEMPLO-001` a `EJEMPLO-067`), el comando completo con valores concretos, el modo operativo recomendado, el objetivo de aprendizaje, la procedencia y los `UNKNOWN` que impiden interpretar el ejemplo como una ejecución real.

## Uso

La biblioteca se encuentra en `client/src/content/parametric-examples/manifest.json` y se muestra en `ARKI-PARAMETRIC-RUNTIME`. Seleccionar un ejemplo coloca su comando en la barra de comandos para que el usuario pueda previsualizarlo, revisar su sintaxis y repetirlo con otro proyecto o conjunto de datos. El corpus se regenera mediante `tools/generate_parametric_examples.mjs` y se verifica mediante `tools/validate_parametric_examples.mjs`.

## Límites epistemológicos

Los ejemplos son **material didáctico reproducible**, no acciones ejecutadas. No crean decisiones humanas, no promueven alternativas, no invocan un SICL Core remoto y no simulan que Dynamo/Revit o Rhino/Grasshopper hayan producido binarios nativos. Las categorías que requieren evidencia, un host autorizado o autoridad humana se mantienen explícitamente en `EXPLORE`, `APPLY` o `DECIDE`, según corresponda.

El ejemplo `GEN-DES` incluye un paquete de intercambio `.ark`, `.dyn` y `.ghx`. El `.ark` es una propuesta geométrica trazable que conserva provenance y revisión humana requerida; `.dyn` y `.ghx` son intercambios legibles, no archivos nativos `.rvt` o `.gh`.

## Criterio de repetibilidad

La repetibilidad se refiere a la **entrada canónica y a la estructura del ejemplo**. La salida arquitectónica real seguirá dependiendo del estado del proyecto, evidencia disponible, regulación aplicable, versión del host, permisos y revisión humana. Por ello cada ejemplo preserva `humanReviewRequired: true` y una advertencia de alcance.
