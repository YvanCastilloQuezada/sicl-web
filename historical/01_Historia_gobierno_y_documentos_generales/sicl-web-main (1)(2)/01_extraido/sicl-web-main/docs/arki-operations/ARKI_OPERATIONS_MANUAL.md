# ARKI — Manual operativo y laboratorio de comandos

## 1. Qué es la Escuela Operativa

La Escuela Operativa es la interfaz de aprendizaje y uso cotidiano de ARKI. Está diseñada para que una persona pueda pasar de la intención arquitectónica al comando canónico sin memorizar sintaxis. El usuario selecciona una operación en el panel izquierdo, configura sus parámetros en el panel derecho y observa en el área central el comando, la previsualización y el resultado estructurado.

La Escuela no reemplaza la autoridad humana. Una previsualización puede ser útil para explorar, comparar o preparar una solicitud, pero no constituye por sí misma un hecho, una decisión, una aprobación normativa ni una exportación profesional validada.

## 2. Flujo recomendado

Primero se selecciona el proyecto activo y se elige un comando por categoría. Después se modifican los parámetros mínimos y se pulsa **Actualizar preview**. El usuario debe comprobar que el comando canónico representa correctamente su intención, revisar los campos desconocidos y exportar el resultado sólo cuando la trazabilidad sea suficiente. La decisión final continúa siendo humana y queda separada de la generación de la propuesta.

## 3. Panel izquierdo: catálogo

El catálogo permite filtrar por categoría y buscar por nombre o sintaxis. Las categorías existentes proceden del registro canónico de comandos: proyectos, etapas, objetivos, restricciones, alternativas, evidencia, evaluación, comparación, consejo, decisión y auditoría. Elegir un comando reinicia sus parámetros con valores seguros de demostración para evitar que una operación anterior contamine la siguiente.

## 4. Centro: previsualización

El centro muestra cuatro elementos: el comando canónico, una representación visual del flujo contexto → regla → resultado, el resultado estructurado y el estado de la previsualización. El resultado se declara como `PREVIEW_READY` y conserva `humanReviewRequired: true`. El centro no ejecuta código arbitrario, no escribe automáticamente una decisión y no convierte una propuesta en FACT.

## 5. Panel derecho: parámetros

Los argumentos enumerados por el catálogo se convierten automáticamente en controles. Las opciones cerradas aparecen como selectores; los argumentos numéricos como sliders; y los valores textuales como campos editables. El identificador de proyecto usa el formato ARKI `XXX-XXX-XXX-XXX`: los dos primeros bloques deben ser letras y los dos últimos bloques números. La página conserva el proyecto activo localmente para que los comandos mantengan continuidad.

## 6. Exportación

**Copiar** copia el comando canónico. **Exportar JSON** produce una evidencia estructurada con comando, proyecto, categoría, estado, fecha y límites epistemológicos. **Exportar HTML** produce una ficha legible que puede imprimirse o guardarse como PDF desde el navegador. Estas exportaciones son resultados de laboratorio y requieren revisión antes de incorporarse a un expediente de proyecto.

## 7. Extensiones

El botón **Crear extensión** genera un manifiesto `ARKI-EXTENSION-1.0` con nombre, versión, comandos autorizados, esquema de entrada, capacidades, provenance, requisito de revisión humana y prohibición de código arbitrario. El manifiesto es una frontera de integración, no una autorización para ejecutar un plugin. La activación de una extensión real debe pasar por revisión de seguridad, sandbox, versionado, permisos por tenant, logs y prueba de regresión.

## 8. Qué hacer cuando aparece UNKNOWN

No se debe rellenar un UNKNOWN por intuición. El usuario debe conservarlo, registrar qué dato falta, indicar quién puede resolverlo y decidir si bloquea la interpretación. En un comando arquitectónico, por ejemplo, un reglamento aplicable, una dimensión no medida o una condición del terreno pueden requerir fuente externa o autoridad profesional.

## 9. Comandos esenciales

| Comando | Uso | Resultado esperado |
|---|---|---|
| `/PROJECT CREATE` | Crear un espacio de proyecto con identidad y alcance | Contexto inicial versionado |
| `/PROJECT OPEN` | Abrir un proyecto existente | Proyecto seleccionado |
| `/PROJECT SET SCOPE` | Definir escala espacial y horizonte temporal | Alcance explícito |
| `/OBJECTIVE SET` | Registrar objetivo y dirección de optimización | Objetivo trazable |
| `/CONSTRAINT SET` | Registrar una restricción | Gate de evaluación |
| `/ALTERNATIVE CREATE` | Proponer una alternativa | Candidato comparativo |
| `/EVIDENCE ADD` | Asociar evidencia a una afirmación | Provenance de entrada |
| `/EVALUATION RUN` | Preparar evaluación de alternativas | Resultado condicionado |
| `/COMPARISON RUN` | Comparar candidatos | Diferencias y UNKNOWNs |
| `/HUMAN REVIEW` | Registrar revisión humana | Gate de revisión |
| `/DECISION RECORD` | Registrar decisión autorizada | Decisión final trazable |
| `/AUDIT RUN` | Revisar contexto, evidencia y decisión | Auditoría epistemológica |

## 10. Límites de la página

La Escuela Operativa no afirma que Dynamo/Revit, Rhino/Grasshopper, Blender, CAD, BIM, simulación o normativa local estén instalados o verificados sólo porque exista un comando relacionado. Los workers externos requieren sus hosts, endpoint HTTPS, autenticación, versionado y revisión humana. La geometría compleja, BIM, costos, ciclo de vida y regulaciones deben conservar fuente, versión, incertidumbre y autoridad competente.

## 11. Laboratorio ARKI-PARAMETRIC-RUNTIME

La página `ARKI-PARAMETRIC-RUNTIME` ofrece un laboratorio separado para experimentar con masas rectangulares y masas con patio. Los sliders de ancho, fondo, altura y niveles actualizan inmediatamente la axonometría conceptual, la planta paramétrica y las métricas de control. El resultado es deliberadamente una hipótesis geométrica: todavía no representa un programa funcional, una estructura calculada ni un expediente normativo.

El paquete de intercambio genera un archivo `.ark`, un grafo `.dyn` para Dynamo/Revit y un XML `.ghx` para Grasshopper/Rhino. ARKI evita fabricar binarios `.rvt` o `.gh` que no puede verificar. La página muestra el estado de los hosts y mantiene `PENDING_EXTERNAL` hasta que existe un worker autorizado.

El archivo `.ark` puede importarse de nuevo. ARKI comprueba `ARKI-ARK-1.0`, recupera la geometría y la trata como `PROPOSAL_IMPORTED`. Luego puede sugerir pruebas de programa, circulación, iluminación, ventilación, estructura, regulación, costos y comparación. Esta reingesta conserva provenance y UNKNOWNs y no registra una decisión automática.

La página también incluye un tutorial de cuatro pasos y un ejercicio evaluable. El tutorial se guarda con la sesión del proyecto. El autoguardado persiste proyecto, parámetros, resultado de preview, paso pedagógico, puntaje y última acción, por lo que el usuario puede volver a continuar sin mezclar sesiones de otros proyectos.

## 12. Comandos esenciales compartidos en ARKI-PARAMETRIC-RUNTIME

El runtime reutiliza directamente el mismo `commands-catalog.json` que usa la Escuela Operativa y no crea un catálogo ni un motor paralelo. La vista contextual muestra un subconjunto pertinente: `/PROJECT OPEN`, `/PROJECT SET SCOPE`, `/OBJECTIVE SET`, `/CONSTRAINT SET`, `/EVIDENCE ADD`, `/HUMAN REVIEW`, `/INTERPRET REVIEW`, `/ALTERNATIVE PROMOTE`, `/MULTIOBJECTIVE` y `/DECISION RECORD`.

Estos comandos conservan su nombre, sintaxis y significado canónicos. El contexto activo añade el proyecto, el artefacto `.ark`, la geometría y la provenance del runtime. Los controles gráficos siguen siendo una segunda representación de la misma intención: sus resultados se incluyen en el preview como `canonicalCommand`, `commandSyntax` y `commandContext`.

`/ALTERNATIVE PROMOTE` y `/DECISION RECORD` aparecen como operaciones controladas, pero no se ejecutan automáticamente. Requieren revisión y autoridad humana. Si una acción paramétrica no tiene una representación canónica compatible, se conserva como interacción de interfaz y no se inventa un comando nuevo.

## 13. Shortcuts humanos y estados operativos

El runtime incorpora un resolver reutilizable que se apoya en la normalización existente de `CommandBar.tsx`. Los shortcuts son una interfaz humana, no una nueva semántica. Por ejemplo, `/gen` se convierte visiblemente en `/GENERATE DESIGN`, mientras que el Core continúa recibiendo únicamente la forma canónica cuando exista una ejecución autorizada.

Los shortcuts registrados se validan de forma fail-closed: una entrada desconocida no se inventa, y cualquier ambigüedad debe mostrar candidatos o bloquearse. Entre los shortcuts de baja fricción se encuentran `/o` para abrir proyecto, `/obj` para objetivo, `/con` para restricción, `/fact`, `/assume`, `/evidence`, `/review`, `/gen`, `/gl`, `/gs`, `/gm`, `/site`, `/reg`, `/pareto`, `/snap`, `/status`, `/hist` y `/decide`. `/decide` conserva explícitamente el requisito de autoridad humana.

El runtime separa tres estados. **EXPLORE** actualiza la geometría y la previsualización sin modificar automáticamente el estado canónico. **APPLY** prepara una aplicación explícita y debe registrar actor, proyecto, valores anterior y nuevo, fuente, provenance y acción canónica cuando exista equivalencia. **DECIDE** queda reservado a la autoridad humana; una previsualización, inferencia, generación o importación nunca se promueve por sí sola a decisión o FACT.

La vista contextual muestra los comandos esenciales pertinentes y permite alternar a los 67 comandos del catálogo canónico v2.2.0. Esta opción no duplica el catálogo: solo cambia el filtro de presentación.
