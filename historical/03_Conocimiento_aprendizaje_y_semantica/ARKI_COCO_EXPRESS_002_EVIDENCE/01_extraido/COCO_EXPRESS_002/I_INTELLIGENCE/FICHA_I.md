# ARKI — COCO-EXPRESS-002 — Familia I: Inteligencia arquitectónica avanzada

**Alcance:** I1–I3 exclusivamente: Pattern Language operacionalizado, tipología y razonamiento formal arquitectónico. **Estado global:** `PARTIAL`. La evidencia local demuestra gramática y modelos conceptuales reutilizables, más microejercicios ejecutados con assertions; no demuestra un motor de inteligencia arquitectónica profesional, autónomo ni certificable. No se usaron respuestas de exámenes DeepSeek/Lipsic ni se modificaron Product State, BKH, TX, E5–E8 o PF-H01.

## Ficha compacta

### CAPABILITY_ID
`I1`, `I2`, `I3`.

### NAME
`I1 — Pattern Language operacionalizado`; `I2 — Tipología arquitectónica`; `I3 — Razonamiento formal arquitectónico`.

### PURPOSE
**I1** convierte una relación recurrente entre contexto, fuerzas, condiciones y respuesta espacial en una propuesta trazable, aplicable sólo cuando sus premisas y escala son compatibles. **I2** organiza hipótesis tipológicas a partir de rasgos observables y mantiene varias candidatas cuando los rasgos no discriminan. **I3** deriva conclusiones limitadas desde premisas explícitas, dependencias y reglas; detiene la inferencia cuando una premisa es `UNKNOWN`.

### CORE_CONCEPTS
El núcleo común es un registro de afirmación con `value`, `status`, `provenance`, `units`, `applicability`, `scale`, `project`, `time` y `scenario`. Los estados permitidos para estos ejercicios son `OBSERVED`, `INFERRED`, `HYPOTHESIZED`, `UNKNOWN` y `PROPOSED`; `UNKNOWN` no se sustituye por una predicción conveniente. `PROPOSED` expresa una salida de diseño, no una verdad construida ni una aprobación.

**I1:** patrón, contexto, fuerzas, precondiciones, respuesta, consecuencias, incompatibilidades y nivel de evidencia. La operacionalización mínima es una regla declarativa `si contexto compatible → proponer respuesta`, con trazabilidad a la regla y salida acotada.

**I2:** familia tipológica, rasgos discriminantes, escala, función, organización espacial, relación público/privado, vacío/lleno, acceso, circulación, programa y contexto. La clasificación es una inferencia revisable; una lista de candidatas o rasgos insuficientes conserva `UNKNOWN`.

**I3:** premisas, regla, conclusión, dependencia, contradicción, alcance, condiciones de parada y explicación. Una conclusión hereda proyecto, tiempo, escenario y escala de sus premisas; no puede convertir simulación, observación parcial, forecast, hash o `import success` en verdad o certificación.

### PREREQUISITES
Se requiere un contexto identificado, escala explícita, proyecto, tiempo y escenario; unidades cuando el dato sea cuantitativo; fuente/provenance para cada observación; y un vocabulario de estados. Para I1 se requieren precondiciones y aplicabilidad del patrón. Para I2 se requiere un conjunto de rasgos observables y un catálogo de tipos no presentado como universal. Para I3 se requiere una regla explícita y premisas verificables o marcadas `UNKNOWN`. La autoridad humana permanece fuera del automatismo.

### INPUTS
Contexto del proyecto; programa y rasgos espaciales; restricciones y objetivos; datos observados o documentados; patrones candidatos; catálogo tipológico; premisas, reglas y relaciones. Cada entrada conserva `project`, `time`, `scenario`, `scale`, `applicability`, `provenance`, `status` y `units` cuando corresponde. La falta de un dato no autoriza rellenarlo con un valor implícito.

### OUTPUTS
I1 produce una propuesta de patrón, precondiciones satisfechas o faltantes, consecuencias esperadas y provenance de regla. I2 produce una tipología inferida sólo si hay discriminación suficiente; si no, devuelve conjunto de candidatas y `UNKNOWN`/`AMBIGUOUS`. I3 produce una conclusión limitada, explicación paso a paso, premisas heredadas y `UNKNOWN` si existe dependencia desconocida. Toda salida es candidata, análisis o propuesta; nunca certificado, firma, cumplimiento normativo ni diseño profesional final.

### CORE_RELATIONSHIPS
`context → forces → pattern applicability → proposed response`; `observed features → discriminating predicates → typology candidates`; `premises → formal rule → bounded conclusion`. Todas las relaciones deben conservar dirección, provenance, estado, escala y alcance. Una relación entre objetos o elementos BIM no demuestra por sí sola una relación causal o tipológica. El resultado no se propaga entre proyectos, escalas, tiempos o escenarios sin una regla de transferencia explícita.

### BASIC_METHODS_OR_ALGORITHMS
**I1:** representar cada patrón como `{id, required_units, preconditions, min/max constraints, applicability, action, provenance}`; validar el contexto; aplicar sólo condiciones satisfechas; emitir `UNKNOWN` cuando faltan unidades o condiciones. **I2:** extraer rasgos; evaluar predicados discriminantes; devolver una única hipótesis sólo si la cardinalidad de candidatas es uno; devolver candidatas y `UNKNOWN` si es cero o mayor que uno. **I3:** construir un pequeño grafo de premisas y dependencias; ejecutar reglas declarativas monotónicas; propagar `UNKNOWN`; impedir conclusiones de seguridad, cumplimiento o certificación desde evidencia incompleta. En los tres casos se usan assertions de contrato y un oracle de no-sobreafirmación.

### COMMON_FAILURES
Confundir una etiqueta tipológica con una explicación causal; aplicar un patrón fuera de su escala o escenario; ocultar unidades ausentes; convertir una observación parcial en hecho universal; resolver ambigüedad escogiendo la primera candidata; usar geometría generada como prueba de constructibilidad; convertir un hash, una importación exitosa o un render en veracidad; mezclar `PROPOSED`, `INFERRED` y `CERTIFIED`; perder provenance durante una transformación; transferir una regla de vivienda a infraestructura o de concepto a obra; ignorar contradicciones y datos faltantes.

### LIMITS
La gramática local de análisis cubre parti, programa, zoning, acceso, circulación, secuencia espacial, público/privado, sólido/vacío, masa, topología, lógica estructural, envolvente, luz, materialidad, clima y otros temas, pero declara explícitamente que analiza y no recupera el modelo original ni ejecuta cálculo estructural profesional. La evidencia de tipologías está fragmentada en catálogos y roadmap. No existe evidencia local de un motor I1–I3 dedicado, de un clasificador validado con corpus, de cobertura urbana multiescala reproducible o de un grafo causal completo. Los microejercicios validan contratos, no competencia profesional ni generalización.

### PROFESSIONAL_BOUNDARY
ARKI puede describir, proponer, comparar y explicar alternativas bajo hipótesis declaradas. No firma, certifica, aprueba normativa, sustituye al arquitecto o ingeniero responsable, ni ejecuta solvers profesionales. Ninguna salida I1–I3 debe presentarse como seguridad, habitabilidad, evacuación, cumplimiento, constructibilidad o autorización de obra. La decisión regulada queda bajo `Human Authority` y revisión profesional independiente.

### ARKI_EXISTING_KNOWLEDGE
Existe una **gramática de análisis arquitectónico v1.0** que enumera los dominios de análisis y conserva estados `documented`, `observed`, `inferred`, `hypothesized` y `unknown`. El inventario AKI-001 registra generación paramétrica de familias, `ConstructionModel`, espacios, muros, relaciones constructivas, SceneModel, selección, metrados, costos y 4D en alcances probados; también clasifica `Reasoning y generación` como `STRUCTURED / NOT_DEMONSTRATED`. El mapa multiescala evidencia componentes, objetos, espacios y edificios pequeños, pero marca bloque/public realm, neighborhood y varias escalas superiores como `UNKNOWN`. La addenda de separación Intelligence/BIM establece que la inteligencia propone y explica, mientras el BIM Kernel representa y valida; también reconoce como parciales el objeto causal unificado, constraint graph, topología causal y coordinación federada. El Codebook local exige no extrapolar un fixture y distingue `VERIFIED` acotado de competencia profesional. El mentor aporta la dirección de pasar de sólidos a espacios/edificio y diferenciar ARKI con razonamiento computacional, pero esa dirección no es evidencia operativa.

### ARKI_NEW_TRAINING
**I1:** entrenar registros patrón con contexto, fuerzas, precondiciones, respuesta, consecuencias, escala y provenance; practicar salidas `PROPOSED` y abstención por unidades/aplicabilidad ausentes. **I2:** entrenar rasgos discriminantes y conjuntos de candidatas en espacio, edificio y sitio, con ejemplos deliberadamente ambiguos; separar observación de inferencia. **I3:** entrenar reglas pequeñas con premisas trazables, propagación de `UNKNOWN`, contradicción y alcance; exigir que cada conclusión herede proyecto, tiempo, escenario, escala, unidades y provenance. En todos los casos, incluir negativos donde observación, simulación, forecast, hash o import success no cambian el estado de verdad. El entrenamiento nuevo queda en los tres microejercicios de `EXERCISES_I.txt`; no incorpora material de exámenes conocidos.

### GAPS_REMAINING
Falta una implementación dedicada y versionada de I1–I3 con contrato estable, corpus curado, métricas de precisión/abstención, pruebas fuera de muestra y revisión humana. Falta definir un catálogo tipológico gobernado, una ontología de fuerzas y un grafo causal interoperable sin duplicar BKH/TX. Falta probar transferencia entre escalas y tipos de proyecto sin extrapolación. Falta registrar conflictos temporales y escenarios concurrentes. Falta evidencia de uso en sitio, bloque, neighborhood o ciudad; el mapa local los deja `UNKNOWN` o `EXPOSED` sin ejercicio reproducible. Falta conexión segura con el Project State sin modificarlo durante esta orden. Por ello el estado es `PARTIAL`, no `IMPLEMENTED`, `VERIFIED` ni `PROFESSIONAL_VALIDATION_REQUIRED` resuelto.

## Evidencia ejecutada

Se ejecutaron tres microejercicios propios con assertions: `NORMAL` pasó una regla de patrón contextual; `ADVERSARIAL` conservó dos candidatas tipológicas y `UNKNOWN`; `TRANSFER` bloqueó una conclusión de seguridad por una premisa `UNKNOWN`. Un mutante controlado que trataba `import-success` como `OBSERVED/CERTIFIED` fue rechazado por el oracle (`MUTANT KILLED 1`). El código correcto permaneció intacto en el área de trabajo de prueba y sólo se copió el resultado textual solicitado al directorio COCO.

## References

[1]: `../../ARKI_ARCHITECTURAL_ANALYSIS_GRAMMAR.md` "ARKI Architectural Analysis Grammar v1.0"
[2]: `../../AKI001_KNOWLEDGE_INVENTORY.md` "AKI-001 Knowledge Inventory"
[3]: `../../AKI001_MULTISCALE_KNOWLEDGE_MAP.md` "AKI-001 Multiscale Knowledge Map"
[4]: `../../ARKI_ADDENDA_SEPARACION_INTELIGENCIA_Y_BIM_KERNEL_V1.md` "Addenda de separación entre Inteligencia Arquitectónica y BIM Kernel"
[5]: `../../ARKI_CODEBOOK_FOR_ARCHITECT.md` "ARKI Codebook for Architect v1.0 Candidate"
[6]: `../COCO_EXPRESS_002_ORDER_SOURCE.txt` "COCO-EXPRESS-002 FULL ARSENAL PRETRAINING"
