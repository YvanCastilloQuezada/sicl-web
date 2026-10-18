# COCO-EXPRESS-002 — Familia N: Normativa

**Orden:** COCO-EXPRESS-002 FULL ARSENAL PRETRAINING  
**Alcance:** N1–N5: RNE Perú, accesibilidad, evacuación, habitabilidad y conocimiento estructural aplicable.  
**Estado de esta ficha:** `PARTIAL`; prepara prerrequisitos transferibles y no declara competencia profesional, cumplimiento normativo, cálculo, certificación, firma ni expediente emitible.

## Contrato común de la familia N

La unidad de conocimiento normativo es una **afirmación situada**, no un número aislado. Toda afirmación debe conservar, como mínimo, `UNKNOWN` cuando falte evidencia; provenance con fuente, autoridad y transformación; unidades y dimensión; jurisdicción; escala; proyecto; fase o escenario; fecha de validez; y estado epistémico. `OBSERVATION`, `SIMULATION`, `FORECAST`, `INFERENCE`, `HASH` e `IMPORT_SUCCESS` no se convierten automáticamente en hecho normativo, fidelidad, verificación o certificación. La ausencia de evidencia se mantiene como `UNKNOWN` o `NOT_DEMONSTRATED`, no como conformidad ni como incumplimiento.

## N1

### CAPABILITY_ID
`N1`

### NAME
**RNE Perú y trazabilidad normativa situada.**

### PURPOSE
Preparar una lectura controlada de requisitos del Reglamento Nacional de Edificaciones del Perú y de otras fuentes normativas identificadas por el proyecto. El objetivo es vincular cada regla a jurisdicción, versión, fecha, escala, uso, fase y evidencia, sin inventar artículos ni extrapolar reglas entre contextos.

### CORE_CONCEPTS
Jurisdicción peruana; documento y versión; fuente primaria o referencia secundaria; requisito, restricción, excepción y condición de aplicabilidad; estado epistémico; evidencia; provenance; periodo de validez; escala; proyecto y escenario; revisión humana.

### PREREQUISITES
Se requiere una fuente normativa identificable y vigente para el caso, un proyecto definido, uso o tipo de edificación, ubicación, fase, escala de aplicación, fecha de corte y autoridad revisora. Si alguno falta, el resultado es `UNKNOWN` o `NOT_DEMONSTRATED`.

### INPUTS
Identificador de fuente; jurisdicción; versión o fecha de consulta; tipo de proyecto; uso; ubicación; elementos afectados; fase; escala; escenario; unidades; evidencia documental; y responsable de revisión.

### OUTPUTS
Matriz de trazabilidad normativa; registro de aplicabilidad; lista de afirmaciones con estado epistémico; conflictos o dependencias detectadas; preguntas pendientes; y propuesta `REVIEW_REQUIRED`. No produce certificado de cumplimiento.

### CORE_RELATIONSHIPS
Una regla sólo puede evaluarse contra un proyecto si coinciden jurisdicción, alcance, escala, periodo y condición de uso. La regla se relaciona con elementos y documentos por provenance y evidencia. El resultado se relaciona con una revisión humana, no con una autorización automática.

### BASIC_METHODS_OR_ALGORITHMS
Identificación de fuente; normalización de unidades; filtrado por aplicabilidad; evaluación declarativa de restricciones; comparación dimensional; detección de dependencias faltantes; registro de `UNKNOWN`; y revisión de conflictos entre restricciones duras. El método es de preevaluación y trazabilidad, no un intérprete jurídico completo.

### COMMON_FAILURES
Citar un artículo no comprobado; usar una versión anterior sin marcarla; tratar una regla de otra jurisdicción como peruana; confundir `hash` con firma; tratar importación exitosa como fidelidad; omitir escala o fecha; y convertir una salida compilada en emisión profesional.

### LIMITS
Esta ficha no contiene el texto completo del RNE, no resuelve excepciones jurídicas, no determina la vigencia legal por sí sola y no cubre todos los usos, municipios, licencias o normas complementarias. No se afirma ningún artículo específico sin fuente verificable.

### PROFESSIONAL_BOUNDARY
No sustituye al arquitecto, ingeniero, abogado, revisor municipal ni autoridad competente. No certifica cumplimiento, no firma, no aprueba licencias y no emite expediente técnico.

### ARKI_EXISTING_KNOWLEDGE
`shared/arkiConstraintEngine.ts` ya registra `REGULATORY_RULE`, severidad, dureza, aplicabilidad por escala, disciplina, jurisdicción, fase, tipo de proyecto, evidencia, provenance, versión de proyecto, escenario y estado epistémico. El COCO Core Doctrine exige separar `KNOWLEDGE`, `PROJECT_STATE`, `EVIDENCE`, `MEMORY` y `STRATEGY`, y conservar `UNKNOWN`. Las auditorías COCO-B observan que la trazabilidad documental y el contrato completo de aplicabilidad todavía son parciales.

### ARKI_NEW_TRAINING
Entrenar la plantilla de afirmación normativa situada: `claim_id`, fuente, jurisdicción, versión, fecha de corte, elemento, escala, proyecto, fase, escenario, unidades, aplicabilidad, estado epistémico, evidencia, provenance y revisor. Entrenar la abstención cuando no exista fuente verificable.

### GAPS_REMAINING
Falta un corpus RNE controlado y versionado, extracción verificable de texto, cobertura de excepciones y una unión demostrada entre regla, documento, revisor independiente y decisión final. `UNKNOWN` sigue siendo obligatorio cuando esos datos no existen.

## N2

### CAPABILITY_ID
`N2`

### NAME
**Accesibilidad arquitectónica como conocimiento aplicable.**

### PURPOSE
Organizar la revisión preliminar de rutas y elementos accesibles: continuidad, acceso, puertas, circulaciones, rampas, descansos, maniobra, señalización y coordinación con uso y evacuación. Los valores dimensionales sólo se usan si la fuente aplicable los respalda y si se conservan unidades y tolerancias.

### CORE_CONCEPTS
Ruta accesible; continuidad; barrera; ancho y claro; pendiente; descanso; giro y maniobra; nivel; umbral; pasamanos; señalización; contraste; alcance; usuario y escenario; medición observada frente a requisito normativo.

### PREREQUISITES
Plano o modelo identificado; ruta y destino definidos; uso y población previstos; mediciones con unidades; datum o referencia de nivel; jurisdicción y fuente aplicable; fase del proyecto; y revisión de interferencias. Sin medición o fuente, el criterio queda `UNKNOWN`.

### INPUTS
Geometría de rutas, puertas, rampas, escaleras, descansos y espacios de giro; cotas y unidades; obstáculos; uso; escenario; fuente normativa; evidencia de levantamiento; y versión del modelo.

### OUTPUTS
Mapa de barreras y dependencias; comprobaciones dimensionales preliminares; inconsistencias de unidades; estado `SATISFIED`, `VIOLATED` o `UNKNOWN` sólo según evidencia suficiente; y lista de revisión humana. No produce una declaración de accesibilidad legal.

### CORE_RELATIONSHIPS
La ruta conecta espacio, componente y destino; la medición se interpreta dentro de una escala; la pendiente depende de longitud, desnivel y unidades; la puerta afecta accesibilidad y evacuación; la aplicación depende del uso, jurisdicción y fase. Un valor observado no demuestra por sí solo conformidad.

### BASIC_METHODS_OR_ALGORITHMS
Grafo de rutas; comprobación de continuidad; conversión explícita de unidades; cálculo básico de pendiente `desnivel / longitud` como apoyo geométrico; detección de obstáculos; verificación de campos obligatorios; y salida fail-closed ante datos faltantes. No dimensiona ni certifica.

### COMMON_FAILURES
Confundir ancho nominal con claro útil; mezclar centímetros y metros; revisar sólo una puerta y no la ruta completa; olvidar umbrales o giros; extrapolar una medida de un tipo de edificio; tratar una observación fotográfica como verdad canónica; y suponer que una simulación de usuario prueba cumplimiento.

### LIMITS
No contiene un catálogo exhaustivo de medidas, excepciones o usos del RNE. No sustituye levantamiento, inspección, coordinación de especialidades ni juicio profesional. La geometría conceptual puede ser insuficiente para revisar obra construida.

### PROFESSIONAL_BOUNDARY
No declara accesibilidad conforme, universalidad, permiso, certificación ni seguridad de uso. La decisión corresponde a profesionales y autoridades con la fuente y el proyecto completos.

### ARKI_EXISTING_KNOWLEDGE
`arkiTechnicalDossier.ts` ya relaciona puertas, pisos y rutas con revisión de accesibilidad y mantiene `requiresInspection`. `arkiConstraintEngine.ts` ofrece la familia `ACCESSIBILITY`, unidades, aplicabilidad, evidencia y estados `UNKNOWN`/`NOT_APPLICABLE`. La lista Revit identifica puertas, rampas, pisos y señalización como objetos reutilizables, sin tratarlos como prueba de cumplimiento.

### ARKI_NEW_TRAINING
Entrenar fichas de rutas con pares `medición–fuente–escala–escenario`, conservación de unidades y distinción entre observación, propuesta y regla. Entrenar la propagación de `UNKNOWN` desde una medición o requisito ausente hasta el resultado de la ruta.

### GAPS_REMAINING
Falta una biblioteca peruana verificada de criterios por uso, un modelo completo de accesibilidad por ruta, evidencia de levantamiento y pruebas con proyectos reales. La inspección automática de obstáculos y maniobras no está demostrada.

## N3

### CAPABILITY_ID
`N3`

### NAME
**Evacuación y seguridad de recorridos como preevaluación.**

### PURPOSE
Representar recorridos de salida y sus dependencias para detectar preguntas, discontinuidades y posibles conflictos antes de una revisión especializada. Considera ocupación, destinos, salidas, puertas, escaleras, rampas, señalización, compartimentación y escenarios de uso, sin afirmar desempeño de incendio ni aprobación.

### CORE_CONCEPTS
Ocupación; escenario; origen y destino; ruta de salida; alternativa; salida; continuidad; ancho; distancia de recorrido; tiempo de recorrido; obstrucción; puerta; escalera; señalización; compartimentación; emergencia frente a operación normal; evidencia observada frente a simulación.

### PREREQUISITES
Uso y aforo con fuente; geometría coordinada; niveles; salidas y rutas identificadas; escenario de ocupación; supuestos temporales; jurisdicción; fuente normativa; y responsable de revisión. Sin aforo, geometría o fuente, el resultado no puede ser `CONFORME`.

### INPUTS
Grafo espacial; aforo o población objetivo; salidas; anchos y unidades; niveles; obstáculos; puertas y sentido de apertura; escenario; fecha y versión; evidencia; y supuestos declarados.

### OUTPUTS
Grafo de recorridos; rutas alternativas; dependencias faltantes; cálculos geométricos simples con unidades; alertas `UNKNOWN`/`NOT_DEMONSTRATED`; y paquete de revisión. Una simulación de evacuación sólo es una simulación y no una prueba física ni un certificado.

### CORE_RELATIONSHIPS
El aforo condiciona el análisis de rutas; la ruta depende de la conectividad espacial y de los elementos de salida; la escala del edificio no se reduce automáticamente a la del componente; la condición de incendio o emergencia define el escenario; los resultados dependen de fecha, versión y supuestos.

### BASIC_METHODS_OR_ALGORITHMS
Grafo BFS/DFS para conectividad; búsqueda de rutas alternativas; suma de segmentos con unidades; conteo o clasificación de salidas; validación de campos de escenario; detección de cuellos de botella conceptuales; y fail-closed ante aforo o fuente desconocidos. No es FDS, CFD ni simulador profesional.

### COMMON_FAILURES
Usar una ruta de diseño como ruta ejecutable; llamar tiempo de simulación tiempo real; ignorar puertas cerradas u obstáculos; sumar longitudes con unidades incompatibles; tratar una ruta conectada como ruta aprobada; y usar importación, preview o hash como evidencia de seguridad.

### LIMITS
No calcula propagación de humo, fuego, comportamiento humano validado, resistencia al fuego, señalización instalada ni disponibilidad real de salidas. No sustituye análisis de seguridad, inspección, plan de emergencia ni autoridad competente.

### PROFESSIONAL_BOUNDARY
No certifica evacuación, protección contra incendios, ocupación segura, licencia ni cumplimiento RNE. Todo resultado requiere revisión profesional y humana independiente.

### ARKI_EXISTING_KNOWLEDGE
`arkiConstraintEngine.ts` soporta relaciones, aplicabilidad, unidades, escenarios, evidencia y estados epistemológicos. `arkiTechnicalDossier.ts` ya lista evacuación y accesibilidad como revisión requerida y mantiene `specialistReviewRequired`. COCO-A aporta algoritmos genéricos de grafos, reutilizables como prerrequisito, no como solver de seguridad.

### ARKI_NEW_TRAINING
Entrenar separación explícita entre `OBSERVATION`, `SIMULATION` y `FORECAST`; entre conectividad geométrica y cumplimiento; y entre escala `SPACE`, `BUILDING` y `SITE`. Cada recorrido debe conservar proyecto, fecha, escenario, unidades y provenance.

### GAPS_REMAINING
Faltan fuentes RNE verificadas por uso, reglas de aforo y salida con trazabilidad completa, datos coordinados de arquitectura y seguridad, validación de escenarios y pruebas independientes. No existe evidencia de simulación profesional validada.

## N4

### CAPABILITY_ID
`N4`

### NAME
**Habitabilidad y desempeño espacial como marco de revisión.**

### PURPOSE
Estructurar preguntas sobre condiciones de uso y desempeño: iluminación, ventilación, asoleamiento, confort térmico y acústico, salubridad, privacidad, dimensiones funcionales y relación con clima y uso. El marco distingue indicador, medición, modelo, observación y requisito aplicable.

### CORE_CONCEPTS
Uso; ocupación; iluminación natural y artificial; ventilación; orientación; clima; humedad; temperatura; acústica; salubridad; privacidad; superficie; volumen; indicador; tolerancia; periodo; escenario; desempeño observado frente a desempeño predicho.

### PREREQUISITES
Tipo de uso; clima y ubicación; periodo de evaluación; geometría; materiales o supuestos; instrumentos o modelo; unidades; fuente normativa; escenario de ocupación; y método de medición o simulación declarado.

### INPUTS
Espacios y áreas; aberturas; orientación; superficies; volúmenes; condiciones ambientales; horarios; ocupación; mediciones; resultados de simulación; fuente; versión y provenance.

### OUTPUTS
Matriz indicador–fuente–medición; relaciones geométricas básicas; dependencias de clima y horario; `UNKNOWN` donde falte evidencia; y recomendaciones de revisión. Un forecast o simulación no se presenta como hecho medido ni como conformidad.

### CORE_RELATIONSHIPS
El desempeño depende de espacio, envolvente, clima, uso y tiempo; el indicador sólo es interpretable con unidades y método; la escala del recinto no prueba el edificio completo; la observación puntual no prueba todo el periodo; una simulación depende de supuestos y no equivale a medición.

### BASIC_METHODS_OR_ALGORITHMS
Chequeo de dimensiones y unidades; relaciones área–volumen; inventario de aberturas; clasificación de mediciones y predicciones; propagación de incertidumbre cualitativa; y trazabilidad de supuestos. No ejecuta EnergyPlus, Radiance, CFD ni un modelo profesional de confort.

### COMMON_FAILURES
Comparar lux, temperatura, ruido o renovaciones sin unidad, periodo o instrumento; generalizar una medición puntual; ocultar el escenario; usar forecast como observación; asumir que geometría importada es fiel; y confundir referencia de diseño con requisito legal.

### LIMITS
No contiene una base exhaustiva de clima, materiales, requisitos por uso o métodos de ensayo. No valida el desempeño ambiental, sanitario o acústico real y no emite conformidad de habitabilidad.

### PROFESSIONAL_BOUNDARY
No certifica habitabilidad, salubridad, confort, eficiencia, calidad ambiental ni cumplimiento municipal. Requiere profesionales, instrumentos y fuentes apropiadas.

### ARKI_EXISTING_KNOWLEDGE
El COCO Core Doctrine conserva unidades, contexto, tolerancia y determinismo. Los contratos de restricciones permiten `UnitValue`, evidencia, provenance, versión, escenario y estados `UNKNOWN`. Las auditorías existentes señalan que escala, tiempo, escenario y provenance no gobiernan aún todo el dossier.

### ARKI_NEW_TRAINING
Entrenar registros de indicador con `value`, `unit`, `dimension`, `method`, `period`, `scenario`, `epistemic_status` y provenance. Entrenar el rechazo de una salida que omita la distinción entre observación, simulación y forecast.

### GAPS_REMAINING
Faltan catálogos de fuentes y métodos por uso, instrumentación verificable, modelos climáticos y de ocupación trazables, validación de simulaciones y cobertura normativa completa. No se demuestra desempeño real.

## N5

### CAPABILITY_ID
`N5`

### NAME
**Conocimiento estructural aplicable sin solver profesional.**

### PURPOSE
Preparar razonamiento conceptual sobre sistema resistente, trayectoria de cargas, acciones, materialidad, suelo, regularidad, juntas, coordinación y dependencias de diseño. Sirve para formular entradas y detectar que se requiere cálculo o revisión especializada; no dimensiona ni verifica una estructura.

### CORE_CONCEPTS
Sistema resistente; carga permanente y variable; acción lateral; trayectoria de carga; elemento; conexión; apoyo; diafragma; estabilidad; regularidad; ductilidad; material; cimentación; suelo; sismo; viento; combinación; estado límite; incertidumbre; escala y modelo.

### PREREQUISITES
Uso y geometría; sistema estructural propuesto; ubicación y amenaza pertinente; materiales; cargas y unidades; suelo o su ausencia explícita; nivel de diseño; fase; norma y versión; hipótesis; y profesional responsable. Datos faltantes mantienen `UNKNOWN`.

### INPUTS
Modelo conceptual; elementos y relaciones; dimensiones nominales; materiales; cargas; condiciones de apoyo; suelo; escenario; unidades; fuente; versión; evidencia y provenance.

### OUTPUTS
Mapa conceptual de cargas y dependencias; lista de entradas faltantes; comprobaciones dimensionales simples; clasificación de afirmaciones; advertencias de conflicto; y solicitud de solver o revisión profesional. No produce esfuerzos, armados, secciones aprobadas o seguridad estructural.

### CORE_RELATIONSHIPS
La carga se transmite por una trayectoria desde acción a elemento y apoyo; el sistema depende de geometría, material, suelo, conexiones y escenario; la escala `COMPONENT` no valida `BUILDING`; la acción sísmica o eólica depende de ubicación y fuente; la ausencia de estudio geotécnico impide cerrar la cimentación.

### BASIC_METHODS_OR_ALGORITHMS
Inventario de acciones y unidades; grafo de trayectoria de carga; balance cualitativo de dependencias; detección de referencias faltantes; dimensional checks no resistentes; y clasificación `UNDEMONSTRATED_RULE` o `STRUCTURAL_SOLVER` cuando el caso requiere oráculo externo. No se implementa solver estructural.

### COMMON_FAILURES
Inferir seguridad desde una sección nominal; usar una resistencia material sin certificado; ignorar suelo, conexiones o irregularidad; mezclar cargas y unidades; convertir una preevaluación en cálculo; y tomar el tipo `STRUCTURAL_SOLVER` del registro como solver ejecutado.

### LIMITS
No analiza resistencia, deriva, estabilidad, vibración, punzonamiento, pandeo, detallado, ductilidad, interacción suelo–estructura ni combinaciones normativas completas. No sustituye E.030, E.050, E.060, E.070 u otras fuentes aplicables, que deben ser verificadas en su versión y alcance; la mención de una norma no demuestra cumplimiento.

### PROFESSIONAL_BOUNDARY
No diseña, calcula, revisa, certifica ni firma estructuras. La salida sólo prepara información para un ingeniero competente y para autoridad humana.

### ARKI_EXISTING_KNOWLEDGE
`arkiConstraintEngine.ts` registra `STRUCTURAL_SOLVER` como tipo que requiere solver externo y evidencia reproducible; también permite reglas regulatorias, unidades, aplicabilidad, provenance y estados. `arkiTechnicalDossier.ts` marca elementos de estructuras y revisión de suelos como pendientes o sujetos a especialista. El COCO Scope Limits excluye explícitamente el solver estructural.

### ARKI_NEW_TRAINING
Entrenar el patrón `entrada estructural → dependencia → estado epistémico → revisión requerida`, con trayectoria de cargas y unidades. Entrenar que `solver externo requerido`, `simulación`, `hash` o `import success` no son cálculo, verdad ni certificación.

### GAPS_REMAINING
Faltan fuentes normativas versionadas, datos de suelo, cargas de proyecto, modelos coordinados, ensayos, solver validado, revisión independiente y evidencia de responsabilidad profesional. Estos gaps bloquean cualquier lectura de diseño o certificación.

## Estado consolidado

La familia N queda en **`PARTIAL`**. La evidencia permite reutilizar contratos de restricciones, unidades, provenance, aplicabilidad, escenarios, estados epistemológicos, grafos y gates de revisión. No demuestra corpus RNE completo, cobertura por uso, verificación de vigencia, revisión profesional independiente ni capacidad de emitir. Los tres microejercicios de `EXERCISES_N.txt` ejecutan invariantes de conservación de contexto y abstención.

## References

[1]: file:///home/ubuntu/generador-familias/COCO_EXPRESS_002/COCO_EXPRESS_002_ORDER_SOURCE.txt "COCO-EXPRESS-002 order source"
[2]: file:///home/ubuntu/generador-familias/COCO_EXPRESS_002/CORE/COCO_CORE_DOCTRINE.md "COCO-EXPRESS-002 core doctrine"
[3]: file:///home/ubuntu/generador-familias/shared/arkiConstraintEngine.ts "ARKI constraint evidence, applicability and epistemic states"
[4]: file:///home/ubuntu/generador-familias/shared/arkiTechnicalDossier.ts "ARKI technical dossier and normative readiness"
[5]: file:///home/ubuntu/generador-familias/COCO/COCO_SCOPE_LIMITS.md "COCO scope limits"
[6]: file:///home/ubuntu/generador-familias/COCO/AUDIT/COCO-B_AUDIT.md "COCO-B audit and remaining dossier gaps"
[7]: file:///home/ubuntu/generador-familias/ARKI_LISTA_COMPLETA_FAMILIAS_REVIT.md "ARKI Revit family inventory"

**Control de cambios:** se crearon únicamente esta ficha y `EXERCISES_N.txt` dentro de `COCO_EXPRESS_002/N_REGULATION`. No se modificaron Product State, BKH, TX, E5–E8 ni PF-H01.
