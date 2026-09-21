# Modelos causa-efecto y modelos causales para ARKI

**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Fecha de corte:** 2026-09-21  
**Destinatario:** ARKI  
**Tipo de documento:** propuesta de currículo avanzado, no certificación de entrenamiento ni de lectura exhaustiva.

## 1. Dictamen y alcance

Se propone una ruta de **32–40 semanas** organizada en cuatro capas: fundamentos formales, métodos de identificación y estimación, laboratorio/proyecto aplicado a arquitectura/BIM y evaluación con controles de seguridad. La ruta combina tres tradiciones que deben mantenerse relacionadas, pero no confundirse: el marco de resultados potenciales o contrafactuales; los grafos causales y modelos causales estructurales (SCM); y la modelización de sistemas físicos o informacionales, como un modelo energético de edificio o un flujo BIM.

La cobertura propuesta llega hasta identificación no paramétrica, ajuste por confusión, mediación, variables instrumentales, datos longitudinales, descubrimiento causal con supuestos explícitos, aprendizaje causal y validación/refutación. No convierte una correlación, un modelo predictivo ni una simulación física en evidencia causal por sí sola. Para ARKI, el resultado esperado es un sistema capaz de **formular preguntas causales, exponer supuestos, separar predicción de intervención, mantener procedencia y declarar incertidumbre**, no un agente autorizado para tomar decisiones de seguridad estructural, evacuación, cumplimiento normativo o cambios de obra sin revisión humana competente.

### 1.1 Qué se consultó y qué no se debe afirmar

La investigación independiente consultó páginas públicas de cursos, temarios y documentación primaria. En particular, se revisaron el resumen y objetivos del curso de Berkeley sobre la *Causal Roadmap*; el programa de *Causal Modeling* de University of Washington; el curso *Causality and Machine Learning* de Carnegie Mellon; el seminario *Counterfactual Machine Learning* de Cornell; el artículo de Judea Pearl disponible en PubMed Central; la página pública del libro *Causal Inference: What If*; la documentación de DoWhy; NIST AI RMF; W3C PROV; ISO sobre BIM; y documentación DOE sobre EnergyPlus y ASHRAE Standard 140.[1] [2] [3] [4] [5] [6] [7] [8] [9] [10] [11] [12]

Estas páginas sirven como **índices, sílabos, objetivos, materiales públicos y documentación técnica**. No prueban que ARKI haya leído libros completos, seguido clases completas, ejecutado todos los laboratorios o dominado sus contenidos. Los libros comerciales citados en los sílabos son bibliografía candidata. Su lectura integral, extracción masiva, redistribución o incorporación a una base de conocimiento requeriría acceso y autorización adecuados. No se descargaron ni reprodujeron libros protegidos.

La página de Hernán y Robins ofrece públicamente una versión en línea y código/datos asociados; aun así, este informe sólo afirma que se consultó la página y sus metadatos de acceso, no que ARKI haya leído la obra completa.[2] La página de ISO describe normas y enlaces de compra; no se trató el texto normativo como material leído ni como contenido ingerido. La aplicación a arquitectura y BIM que sigue es una **propuesta de diseño curricular prudente**, no una afirmación de que las fuentes universitarias ya cubran arquitectura.

## 2. Modelo de cobertura

| Capa | Resultado verificable | Contenidos mínimos | Evidencia requerida |
|---|---|---|---|
| Fundamentos | Formaliza una pregunta causal y sus unidades | Probabilidad, variables aleatorias, regresión, potencial outcomes, DAG, d-separation, SCM, intervenciones y contrafactuales | Examen oral/escrito y ejercicios con grafos |
| Métodos | Puede pasar de pregunta a estimando, identificación y estimación | Back-door/front-door, g-computation, IPW, TMLE, matching, IV, mediación, longitudinalidad, missingness, heterogeneidad | Notebook reproducible y defensa de supuestos |
| Aprendizaje y descubrimiento | Distingue estructura aprendida de estructura identificada | PC, FCI, GES, LiNGAM, variables latentes, representación causal, policy learning y evaluación contrafactual | Comparación de métodos bajo simulaciones con verdad conocida |
| Modelado aplicado | Conecta causalidad con un sistema BIM/edificio sin sobreafirmar | Ontología de variables, intervención operacional, simulación energética, calibración, procedencia, versionado, incertidumbre | Proyecto de arquitectura/BIM con registro de decisiones |
| Seguridad y gobernanza | Evita automatizar conclusiones no identificadas | NIST AI RMF, W3C PROV, trazabilidad, revisión humana, límites de uso, privacidad, seguridad de información BIM | Auditoría de riesgo y prueba de rechazo/abstención |
| Comunicación | Hace que un tercero pueda reproducir y criticar el análisis | Estimando, población, intervención, horizonte, supuestos, sensibilidad, rango de validez y limitaciones | Informe técnico y presentación ante panel |

## 3. Ruta progresiva y cursos completos propuestos

Cada curso puede impartirse en 6–8 semanas a 5–7 horas por semana. Los porcentajes son una propuesta de evaluación de ARKI, no una reproducción de la calificación de una universidad.

### Curso 1 — Fundamentos matemáticos y lenguaje causal (6 semanas)

**Prerrequisitos.** Álgebra lineal básica, probabilidad, estadística descriptiva e inferencial, regresión, Python o R y lectura de notación matemática. Si faltan, añadir un puente de 2–4 semanas.

**Objetivos.** Al terminar, ARKI debe distinguir asociación, predicción, intervención y contrafactual; expresar un estimando; dibujar un DAG y leer d-separation; describir un SCM con variables exógenas y ecuaciones; y explicar por qué los supuestos son parte de la conclusión. Pearl presenta SCM como una base que relaciona intervenciones, contrafactuales y efectos directos/indirectos; el sílabo de Washington organiza precisamente el inicio en contrafactuales, grafos, d-separation, confusión y SEM.[5] [3]

**Programa completo.** Semanas 1–2: eventos, distribución conjunta, independencia condicional, esperanza, varianza y regresión como descripción condicional. Semana 3: resultados potenciales, SUTVA/consistencia, efecto medio, efecto de tratamiento y heterogeneidad. Semana 4: DAG, nodos observados/no observados, caminos, back-door y collider. Semana 5: SCM, modularidad, intervención `do(X=x)`, ecuaciones estructurales y relación entre SCM y potencial outcomes. Semana 6: taller de traducción: de una pregunta verbal a grafo, estimando, población, intervención y supuestos.

**Laboratorio.** Simular datos desde SCM lineales y no lineales con confusión, mediación y collider. Comparar una regresión asociativa con el efecto interventional verdadero conocido por simulación. Cada notebook debe incluir semilla, versión de entorno, diagrama, tabla de variables y explicación de qué no puede identificarse.

**Evaluación y paso.** 30% ejercicios formales, 25% notebooks, 25% examen de grafos/SCM y 20% defensa oral. Paso: ≥80/100, ningún error crítico al distinguir `P(Y|X)` de `P(Y|do(X))`, y capacidad de declarar al menos dos supuestos y un límite para cada estimando.

### Curso 2 — Identificación, estimación y datos complejos (8 semanas)

**Objetivos.** Seguir una versión operativa de la *Causal Roadmap*: pregunta, modelo, datos observados, identificabilidad, problema estadístico, estimador e interpretación. Berkeley explicita esta secuencia y cubre g-computation, IPW, TMLE con Super Learner, missing outcomes y extensiones temporales/agrupadas.[1]

**Programa completo.** Semana 1: diseño experimental, aleatorización, cumplimiento y efectos de intención de tratar. Semana 2: identificación por back-door y front-door; reglas de ajuste; do-calculus a nivel conceptual y con ejemplos. Semana 3: g-computation y modelos de resultado. Semana 4: propensity scores, IPW, estabilización, positividad y diagnóstico de pesos. Semana 5: doubly robust/TMLE, cross-fitting y separación entre modelo de nuisance y estimando. Semana 6: IV, LATE, supuestos de exclusión, relevancia y monotonicidad. Semana 7: mediación, efectos directos/indirectos, exposiciones dependientes del tiempo, confusión dependiente del tiempo y g-methods. Semana 8: missing data, medición diferencial, clusters, continuous treatments y sensibilidad a confusión no medida.

**Laboratorio.** Replicar una pregunta simple con datos públicos permitidos. Usar simulaciones con ground truth para mostrar cuándo un estimador funciona y cuándo falla. Comparar al menos tres métodos y reportar intervalos, diagnósticos de positividad, especificación alternativa y análisis de sensibilidad. Se recomienda usar los datos/código públicos asociados a *What If* únicamente bajo sus condiciones de acceso; no se debe presentar el ejercicio como lectura integral del libro.[2]

**Evaluación y paso.** 20% problemas de identificación, 30% laboratorio reproducible, 20% revisión crítica de un artículo y 30% examen/defensa. Paso: ≥80/100; identificar correctamente si un efecto es identificable bajo el DAG entregado; no reportar una cifra sin estimando, población, intervención y horizonte; y detectar al menos un caso de positividad insuficiente o sesgo por collider.

### Curso 3 — Descubrimiento causal, modelos estructurales y aprendizaje causal (8 semanas)

**Objetivos.** Entender que descubrir estructura desde observaciones depende de supuestos de Markov, faithfulness, ausencia/presencia de latentes, intervención disponible y calidad de medición. CMU cubre modelos gráficos, intervención, SEM, identificación, contrafactuales, PC/FCI/GES, LiNGAM, representación causal y aplicaciones a aprendizaje; Cornell vincula contrafactuales con evaluación de sistemas y datos de interacción, destacando sesgo de selección, feedback y policy learning.[4] [5]

**Programa completo.** Semana 1: independencias implicadas por modelos causales, equivalencia de Markov y límites de una estructura observacional. Semana 2: PC y GES; lectura de CPDAG y selección de modelos. Semana 3: FCI y PAG con variables latentes. Semana 4: SEM, restricciones de independencia, endogeneidad y variables instrumentales; diferenciar SEM causal de un modelo de covarianzas. Semana 5: modelos funcionales, LiNGAM y supuestos no gaussianos; no confundir identificabilidad matemática con validez sustantiva. Semana 6: causal representation learning, heterogeneidad, transporte y predicción fuera de distribución. Semana 7: bandits, feedback, policy evaluation, IPS y doubly robust en datos de interacción. Semana 8: falsificación, refutación, análisis de sensibilidad y comparación de estructuras candidatas.

**Laboratorio.** Generar cinco familias de datos con estructuras conocidas: confusión, latente, selección, medición errónea y cambio de dominio. Ejecutar PC/FCI/GES o herramientas equivalentes documentadas, comparar con la verdad y explicar falsos positivos/negativos. En una tarea de recomendación sintética, separar predicción de recompensa bajo una política intervenida. DoWhy puede apoyar el laboratorio porque su documentación separa modelar, estimar y refutar, y advierte que la validación predictiva ordinaria no basta cuando la distribución interventional no se observa.[8]

**Evaluación y paso.** 25% teoría, 35% benchmark sintético, 20% auditoría de supuestos y 20% defensa. Paso: F1 estructural ≥0.75 en el benchmark acordado o explicación correcta de por qué el objetivo no es identificable; cero afirmaciones de “causalidad descubierta” sin declarar supuestos; y capacidad de producir una matriz de sensibilidad para al menos dos estructuras plausibles.

### Curso 4 — Laboratorio ARKI: arquitectura, BIM, simulación y procedencia causal (8–10 semanas)

**Propósito.** Aplicar los cursos anteriores a un caso acotado y de bajo riesgo, por ejemplo: “¿qué cambio de diseño o de operación modifica el consumo energético simulado bajo estas condiciones?” o “¿qué factor explica una discrepancia de coordinación BIM?” El proyecto no debe transformarse en certificado de desempeño, dictamen estructural ni decisión de seguridad de vida.

**Módulo A: planteamiento del sistema.** Definir unidad de análisis, activos, espacios, equipos, clima, ocupación, operación, intervención y outcome. Separar variables de diseño, variables operativas, mediadores, confusores, resultados y restricciones. Representar el sistema en un DAG y, cuando proceda, en ecuaciones dinámicas o un modelo de simulación.

**Módulo B: BIM e información.** ISO presenta la familia ISO 19650 como normas para organizar, digitalizar e intercambiar información durante el ciclo de vida, e incluye partes de conceptos, entrega, operación, intercambio y un enfoque de gestión de información con mentalidad de seguridad.[9] Se propone que ARKI aprenda a tratar el modelo BIM como fuente versionada y contextual, no como una verdad causal automática. Cada variable debe tener identificador, unidad, fecha, responsable, fuente, transformación y nivel de confianza.

**Módulo C: simulación física y validación.** DOE describe EnergyPlus como motor abierto de simulación energética de edificio con modelos detallados de transferencia de calor y humedad, iluminación, sombreado, HVAC y dinámicas subhorarias.[10] El curso debe usarlo como **modelo de proceso** o generador de escenarios, no como medición de realidad. Para la verificación del simulador se debe estudiar la lógica de ASHRAE Standard 140: DOE describe pruebas analíticas con solución cerrada, empíricas con datos medidos y comparativas entre motores.[11]

**Módulo D: trazabilidad.** W3C PROV modela entidades, actividades y agentes para evaluar calidad, confiabilidad y confianza, y distingue un recorrido de uso básico de especificaciones avanzadas para desarrolladores y validadores.[7] ARKI debe exportar un registro de procedencia de cada dataset, simulación, transformación, intervención hipotética, versión de código y revisión humana.

**Módulo E: seguridad y gobernanza.** NIST AI RMF es voluntario y está destinado a incorporar consideraciones de confiabilidad en diseño, desarrollo, uso y evaluación de sistemas de IA; su estructura operativa incluye gobernar, mapear, medir y gestionar riesgos.[6] Para BIM, el proyecto debe tratar como sensibles los planos, modelos de activos, rutas de acceso, datos de ocupación y vulnerabilidades. Se requieren minimización de datos, control de acceso, separación entre entornos, logs inmutables, revisión humana y abstención ante extrapolación.

**Entregables.** (1) contrato de pregunta causal de dos páginas; (2) inventario de variables y DAG versionado; (3) notebook de simulación/estimación; (4) validación según el tipo de evidencia disponible; (5) paquete PROV de procedencia; (6) análisis de sensibilidad y escenarios adversos; (7) informe de 15–25 páginas; (8) presentación ante un panel de arquitectura, datos y seguridad.

**Evaluación y paso.** 15% definición del estimando, 20% modelo y supuestos, 20% reproducibilidad/procedencia, 20% validación y sensibilidad, 15% seguridad, 10% comunicación. Paso sólo si el panel confirma que no se confunde simulación con observación, asociación con intervención ni resultado exploratorio con decisión de obra.

### Curso 5 — Evaluación, auditoría y mantenimiento (4–6 semanas, recurrente)

Este curso se repite por versión de ARKI. Incluye pruebas de regresión de notebooks, pruebas de invariancia con datos de dominio, tests de perturbación de grafos, auditoría de procedencia, red-team de prompts y datos, calibración de abstención, revisión de permisos y postmortem de errores. La salida no es una nota única, sino un expediente de liberación con fecha, versión, datos permitidos, supuestos conocidos, resultados de pruebas, fallos abiertos, responsable y fecha de revisión.

## 4. Aplicaciones prudentes para ARKI

**Arquitectura y diseño.** ARKI puede ayudar a convertir una hipótesis (“un cambio de orientación podría reducir cargas térmicas”) en un DAG, proponer variables de medición, comparar escenarios y mostrar sensibilidad. No debe asegurar que el cambio sea causa del ahorro real si no hay intervención o diseño observacional que sostenga la identificación.

**BIM.** Puede usar relaciones de activos, versiones y eventos para investigar dependencias y causas probables de retrabajo o conflictos. Debe presentar candidatos y evidencia, no atribuir culpa a una disciplina o proveedor sin un diseño de medición y sin revisar confusión por calendario, alcance, equipo y cambios de proyecto.

**Modelado físico.** Puede acoplar variables de diseño con EnergyPlus u otro motor y analizar escenarios. Debe distinguir causalidad dentro del modelo (“si se fuerza esta variable en el simulador”) de validez externa (“qué ocurrirá en el edificio real”). La segunda requiere calibración, mediciones y validación apropiadas.

**Razonamiento y explicaciones.** Toda respuesta causal debe incluir pregunta, intervención, outcome, población, horizonte, DAG o mecanismo, supuestos, método, incertidumbre, sensibilidad y condiciones de abstención. Una explicación plausible no equivale a un efecto identificado.

**Seguridad.** Las funciones de alto impacto deben ser de asesoramiento revisable. No automatizar instrucciones que puedan afectar estabilidad estructural, protección contra incendios, evacuación, instalaciones críticas, privacidad de ocupantes o controles industriales. Los modelos BIM y sus metadatos deben clasificarse por sensibilidad y no exponerse en salidas de depuración.

## 5. Bibliografía candidata trazable

| ID | Recurso | Tipo y uso curricular | Estado de acceso/consulta |
|---|---|---|---|
| [1] | Petersen y Balzer, Berkeley, *Introduction to Causal Inference* | Sílabo público y objetivos; roadmap, g-computation, IPW, TMLE y proyecto | Página pública consultada; no se afirma cursado completo |
| [2] | Hernán y Robins, *Causal Inference: What If* | Texto recomendado; contrafactuales, DAG, longitudinalidad; código/datos públicos asociados | Página pública y metadatos consultados; lectura integral requeriría un plan autorizado |
| [3] | Richardson, University of Washington, *Causal Modeling* | Programa universitario; potencial outcomes, DAG, SEM, IV, mediación, do-calculus y proyecto | Sílabo público consultado; edición 2019, no curso actual de ARKI |
| [4] | Zhang, Carnegie Mellon, *Causality and Machine Learning* | Programa avanzado; descubrimiento, latentes, representación causal, contrafactuales y generative AI | Sílabo 2025 consultado; materiales restringidos o enlazados no se consideran ingeridos |
| [5] | Joachims, Cornell, *Counterfactual Machine Learning* | Seminario; feedback, bandits, selection bias, policy learning | Página y programa 2016 consultados; no evidencia de vigencia actual |
| [6] | NIST, *AI Risk Management Framework 1.0* | Gobernanza, map/measure/manage, confianza y evaluación | Página oficial pública consultada; el texto completo debe tratarse como documento normativo externo |
| [7] | W3C, *PROV-Overview* y familia PROV | Procedencia, entidades, actividades, agentes, validación y reproducibilidad | Recomendación/nota pública consultada; verificar estado normativo antes de implementación |
| [8] | PyWhy, documentación DoWhy | Flujo model-identify-estimate-refute, tareas causales y límites de validación predictiva | Documentación pública consultada; fijar versión de software en laboratorio |
| [9] | ISO, página sectorial BIM e ISO 19650 | Gestión de información BIM a lo largo del ciclo de vida; seguridad | Página oficial y metadatos consultados; normas completas son de acceso comercial |
| [10] | U.S. DOE, *EnergyPlus* | Motor de simulación de energía de edificios y capacidades | Descripción oficial pública consultada; documentación de versión debe fijarse |
| [11] | U.S. DOE, *ASHRAE Standard 140 Maintenance and Development* | Pruebas analíticas, empíricas y comparativas para BEM | Descripción oficial pública consultada; estándar completo no reproducido |
| [12] | Pearl, *An Introduction to Causal Inference* | Artículo primario abierto; SCM, intervenciones, contrafactuales y mediación | Texto público en PMC consultado; no sustituye a un curso o libro completo |

**Textos que requieren ingestión autorizada o acceso bibliotecario.** Entre los recomendados por los sílabos aparecen Pearl, *Causality*; Imbens y Rubin, *Causal Inference for Statistical, Social, and Biomedical Sciences*; Morgan y Winship, *Counterfactuals and Causal Inference*; Spirtes, Glymour y Scheines, *Causation, Prediction, and Search*; Angrist y Pischke, *Mostly Harmless Econometrics*; y otros textos de aprendizaje estadístico. Se incluyen aquí como referencias candidatas, no como conocimiento leído por ARKI. La ingestión debe respetar licencia, derechos de autor, controles de acceso, retención y trazabilidad. No se debe descargar ni redistribuir una copia de libro protegido para completar este currículo.

## 6. Plan de evaluación global y criterios de paso

El expediente de cada versión de ARKI debe contener: (a) pretest y postest; (b) conjunto de ejercicios con respuestas esperadas; (c) notebooks reproducibles; (d) benchmark sintético con verdad generadora; (e) proyecto aplicado; (f) defensa oral; (g) auditoría de procedencia y seguridad; y (h) registro de errores y correcciones.

Los **criterios de paso global** son los siguientes:

1. **Competencia conceptual:** al menos 80% en preguntas que distingan asociación, predicción, intervención y contrafactual; ningún error crítico en `P(Y|X)` frente a `P(Y|do(X))`.
2. **Identificación:** para cinco DAG distintos, identificar un conjunto de ajuste válido o justificar formalmente que no basta la información disponible; declarar positividad, consistencia y ausencia/forma de confusión no medida.
3. **Estimación:** reproducir un efecto con al menos dos métodos apropiados, incluir incertidumbre y explicar divergencias; no seleccionar por rendimiento predictivo solamente.
4. **Descubrimiento:** reportar equivalencia, latentes y sensibilidad; nunca presentar una arista aprendida como verdad causal sin supuestos y validación externa.
5. **Simulación/BIM:** separar parámetros del simulador, observaciones y decisiones; documentar versión, unidades, calibración y alcance de validez.
6. **Reproducibilidad:** un revisor independiente debe ejecutar el análisis en un entorno limpio y obtener resultados dentro de una tolerancia predeclarada.
7. **Seguridad:** pasar pruebas de permisos, fuga de información, prompt injection en documentos de proyecto, abstención bajo falta de positividad y revisión humana obligatoria en decisiones de alto impacto.
8. **Comunicación:** informe y defensa deben incluir estimando, población, intervención, horizonte, DAG/mecanismo, supuestos, método, incertidumbre, sensibilidad, límites y recomendación de no uso cuando corresponda.

## 7. Unknowns y preguntas para revisión humana

- No se ha definido el perfil matemático, el idioma operativo, las horas semanales ni el entorno de ejecución de ARKI.
- No se sabe qué datos BIM, sensores, logs de obra o modelos energéticos están legalmente disponibles ni con qué clasificación de seguridad.
- No se ha elegido una versión de EnergyPlus, DoWhy, Python/R ni un esquema de interoperabilidad BIM.
- No se ha verificado si el caso de uso principal es diseño, operación, coordinación, mantenimiento, investigación o educación; cada uno exige otro estimando y otra población.
- No se ha seleccionado un conjunto de datos de edificio con permisos, medición suficiente y criterios de validación independientes.
- No se ha establecido quién puede aprobar una afirmación causal ni quién responde por una recomendación que afecte un activo.
- La vigencia de cursos, enlaces y versiones debe comprobarse antes de convertir la propuesta en calendario oficial. Los programas históricos se usan como evidencia de cobertura, no como oferta futura.
- Debe decidirse si ARKI recibirá sólo materiales públicos consultados, extractos con licencia, enlaces recuperables o una ingestión completa autorizada. El currículo no presupone esta decisión.

## 8. Límites explícitos

- Un sílabo demuestra que un curso propone contenidos; no demuestra que ARKI haya aprendido esos contenidos.
- Una bibliografía no es evidencia de lectura ni de dominio.
- Un DAG elaborado por una persona o por ARKI codifica supuestos; no es una prueba de que el mundo tenga esa estructura.
- Los modelos de simulación física pueden responder intervenciones dentro de sus ecuaciones, pero no garantizan validez externa sin datos y validación.
- Las pruebas de refutación y sensibilidad pueden descubrir fragilidad, pero no garantizan que un DAG sea el verdadero.
- Los resultados causales no autorizan automáticamente acciones de arquitectura, construcción, operación o seguridad.
- Las normas ISO y ASHRAE tienen texto, alcance y requisitos que deben consultarse en sus versiones autorizadas; esta propuesta usa sus descripciones oficiales públicas y no reproduce sus contenidos protegidos.
- El sistema debe abstenerse cuando falte soporte de identificación, cuando haya extrapolación fuera del soporte de datos, cuando la procedencia sea incompleta o cuando el coste de error exceda la capacidad de revisión disponible.

## References

[1]: https://ctml.berkeley.edu/introduction-causal-inference "UC Berkeley, Introduction to Causal Inference"
[2]: https://miguelhernan.org/whatifbook "Hernán and Robins, Causal Inference: What If"
[3]: https://sites.stat.washington.edu/tsr/s566/syllabus566w19.pdf "University of Washington, CS&SS/STAT 566 Causal Modeling syllabus"
[4]: https://www.andrew.cmu.edu/course/80-516/ "Carnegie Mellon University, Causality and Machine Learning syllabus"
[5]: https://www.cs.cornell.edu/courses/cs7792/2016fa/ "Cornell University, CS7792 Counterfactual Machine Learning"
[6]: https://www.nist.gov/itl/ai-risk-management-framework "NIST, AI Risk Management Framework"
[7]: https://www.w3.org/TR/prov-overview/ "W3C, PROV-Overview"
[8]: https://www.pywhy.org/dowhy/v0.13/user_guide/intro.html "PyWhy DoWhy, Introduction and refutation guide"
[9]: https://www.iso.org/sectors/building-construction/building-information-modelling "ISO, Building information modelling (BIM) sector page"
[10]: https://www.energy.gov/cmei/buildings/articles/energyplus "U.S. Department of Energy, EnergyPlus"
[11]: https://www.energy.gov/cmei/buildings/ashrae-standard-140-maintenance-and-development "U.S. Department of Energy, ASHRAE Standard 140 Maintenance and Development"
[12]: https://pmc.ncbi.nlm.nih.gov/articles/PMC2836213/ "Judea Pearl, An Introduction to Causal Inference"

**Fin del informe.**
