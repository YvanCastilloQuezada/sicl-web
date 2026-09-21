# Currículo avanzado de Inteligencia Artificial para ARKI

**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Fecha de corte:** 2026-09-21  
**Objeto:** propuesta de ciclo formativo completo, progresivo y auditable para un sistema/agente denominado ARKI, con aplicaciones prudentes a arquitectura, BIM, modelado, razonamiento y seguridad.

## Resumen ejecutivo

Este documento propone una ruta de **36–48 semanas**, organizada en fundamentos, métodos, laboratorio/proyecto y evaluación. No es una afirmación de que ARKI haya leído libros completos, ni de que haya adquirido automáticamente las competencias de un plan universitario. Se separan explícitamente cuatro estados de evidencia:

1. **Índice o plan de estudios:** temario publicado por una universidad u organismo. Sirve para definir cobertura, no prueba aprendizaje.
2. **Texto recomendado:** libro o material citado por el curso. Se recomienda como ruta de estudio, pero no se declara leído.
3. **Material público consultado para este informe:** páginas, sílabos, documentación técnica y normas accesibles que fueron consultados y resumidos aquí. Esta categoría sí respalda las afirmaciones documentales, dentro de su alcance.
4. **Conocimiento que requeriría ingestión autorizada:** libros protegidos, cursos cerrados, datos de proyectos de ARKI, modelos BIM de clientes, normas de pago, documentación interna, código privado o material sujeto a licencia. No se descargó ni reprodujo ningún libro protegido y no se presume ingestión de ninguno.

La recomendación central es no evaluar a ARKI por la mera presencia de una bibliografía. Cada curso debe producir artefactos verificables: derivaciones, código reproducible, pruebas, informes de errores, modelos IFC/IDS validados, registros de procedencia y demostraciones orales o interactivas. En arquitectura y BIM, ARKI debe actuar como **asistente verificable**, no como autoridad autónoma sobre seguridad estructural, cumplimiento normativo, coste, contratación o decisiones profesionales.

## Modelo de cobertura

La cobertura se expresa como un vector de ocho dominios, cada uno con conocimientos, habilidades, práctica y evidencia. La cobertura se considera completa cuando ARKI alcanza el nivel mínimo en todos los dominios y supera los gates de evaluación; una bibliografía sin artefactos no aumenta la cobertura demostrada.

| Dominio | Alcance | Evidencia mínima | Peso sugerido |
|---|---|---|---:|
| Matemáticas y programación | Álgebra lineal, cálculo, probabilidad, estadística, Python, estructuras de datos y complejidad | Cuaderno de derivaciones y biblioteca de referencia con tests | 15% |
| IA simbólica y razonamiento | Búsqueda, satisfacción de restricciones, planificación, lógica, redes bayesianas, decisión y agentes | Solucionadores explicables y defensa oral de supuestos | 15% |
| Aprendizaje automático | Supervisado, no supervisado, regularización, selección de modelos, incertidumbre y evaluación | Experimentos reproducibles con baselines y análisis de errores | 20% |
| Deep learning y generativo | Redes, atención/transformers, representación, visión, texto, RAG y agentes con herramientas | Prototipo acotado, evaluación de calidad y pruebas de seguridad | 15% |
| Ingeniería de datos y MLOps | Datos, versionado, pipelines, serving, observabilidad, deriva, costes y reproducibilidad | Pipeline end-to-end con registro de datos, modelos y métricas | 10% |
| IA confiable y seguridad | Privacidad, sesgo, robustez, prompt injection, filtración, supply chain, abuso y supervisión humana | Threat model, red-team controlado, mitigaciones y matriz de riesgos | 15% |
| Arquitectura, BIM y modelado | IFC, IDS, bSDD, geometría, API de Revit, calidad de información y coordinación | Modelo de prueba IFC validado, IDS ejecutable y plugin/script documentado | 7% |
| Comunicación y práctica profesional | Trazabilidad, límites, citación, revisión humana, propiedad intelectual y decisión | Informe técnico, changelog, oral defense y checklist de entrega | 3% |

**Niveles:** L0 = exposición; L1 = explicación y reproducción guiada; L2 = implementación independiente en datos de juguete; L3 = integración reproducible con evaluación; L4 = operación supervisada con incident response. El objetivo de la ruta es L3 en fundamentos y métodos, y L2–L3 en aplicaciones BIM hasta que exista validación humana experta.

## Secuencia progresiva y cursos completos propuestos

Las cargas son orientativas para una dedicación de 10–12 horas semanales. Se pueden comprimir, pero no deben eliminarse los gates. Los nombres son propuestas de ARKI, no cursos existentes ni atribuidos a una universidad.

### Fase 0 — Diagnóstico y contrato de aprendizaje (1 semana)

**Curso 0. Diagnóstico, alfabetización científica y control de procedencia.** Se levantan los prerrequisitos de Python, álgebra, cálculo, probabilidad, lectura técnica y razonamiento. Se crea un registro de afirmaciones: fuente, fecha, licencia, material realmente consultado, confianza y necesidad de revisión. Se define una política de datos para separar datos públicos, datos internos y datos que requieren autorización.

**Entregables:** prueba diagnóstica; repositorio reproducible; plantilla de ficha de fuente; matriz de permisos; declaración explícita de no-ingestión de materiales no autorizados. **Gate 0:** identificar correctamente qué es un plan de estudios, qué es un texto recomendado y qué es evidencia de aprendizaje, con al menos 90% en un cuestionario de trazabilidad.

### Fase 1 — Fundamentos (10–12 semanas)

**Curso 1. Programación científica y estructuras de datos.** Python, NumPy, visualización, funciones, clases, archivos, pruebas, control de versiones, complejidad, grafos y programación vectorizada. Se priorizan ejemplos pequeños y código legible antes que frameworks.

**Laboratorio:** implementar búsqueda en grafos, colas de prioridad, evaluación de expresiones y un pipeline de datos tabular. **Evaluación:** 40% tests y revisión de código, 30% complejidad y explicación, 20% reproducibilidad, 10% documentación.

**Curso 2. Matemáticas para IA.** Vectores, matrices, espacios, autovalores, derivadas, gradiente, optimización convexa básica, probabilidad, variables aleatorias, estimación e intervalos. El énfasis es operacional: derivar y verificar, no memorizar fórmulas.

**Laboratorio:** regresión lineal desde cero, descenso de gradiente, simulación Monte Carlo y análisis de sensibilidad. **Gate 1:** obtener resultados numéricos reproducibles, detectar un error de dimensiones y explicar cuándo una métrica no representa el objetivo.

**Curso 3. IA simbólica, búsqueda y representación.** Agentes y entornos; búsqueda no informada e informada; A*; satisfacción de restricciones; juegos; lógica; planificación; ontologías ligeras; razonamiento bajo incertidumbre; redes bayesianas y procesos de decisión de Markov. El plan de CS188 de Berkeley ofrece una referencia pública para esta progresión, que incluye búsqueda, CSP, juegos, MDP, probabilidad, redes bayesianas, HMM, aprendizaje, redes neuronales y transformers [1]. MIT 6.034 describe como objetivos la representación de conocimiento, la resolución de problemas y los métodos de aprendizaje, además de ofrecer vídeos, exámenes y tareas públicas bajo su propia licencia [2].

**Laboratorio:** resolver un problema de asignación de espacios con CSP; planificar una secuencia de coordinación BIM; comparar A* con una heurística no admisible; construir una red bayesiana con inferencia explícita. **Evaluación:** corrección, completitud de supuestos, explicación del camino de razonamiento y casos adversariales.

**Curso 4. Diseño experimental y estadística aplicada.** Muestreo, particiones train/validation/test, fuga de información, intervalos de confianza, pruebas de hipótesis, calibración, precisión/recobrado, ROC/PR, costes de falsos positivos y negativos, y análisis de subgrupos.

**Laboratorio:** diseñar un experimento sobre clasificación de incidencias BIM con datos sintéticos o autorizados. **Gate 2:** ningún resultado se acepta sin baseline, protocolo, incertidumbre, análisis de errores y registro de semillas/entorno.

### Fase 2 — Métodos de aprendizaje y modelos (12–14 semanas)

**Curso 5. Aprendizaje supervisado y teoría práctica.** Regresión lineal y logística, generativos, Naive Bayes, SVM y kernels, árboles y ensembles, regularización, bias-variance, selección de variables, aprendizaje online y calibración. El syllabus público de Stanford CS229 respalda esta secuencia e incluye también redes neuronales, aprendizaje no supervisado, MDP, reinforcement learning, HMM, Gaussian processes y proyectos [3].

**Laboratorio:** predecir una variable de proyecto a partir de datos tabulares no sensibles; comparar heurística, modelo simple y modelo complejo. **Evaluación:** 25% formulación, 25% implementación, 25% métrica y error, 15% reproducibilidad, 10% defensa.

**Curso 6. Aprendizaje no supervisado, representación y causalidad prudente.** k-means, mezclas gaussianas, EM, PCA/ICA, embeddings, detección de anomalías, clustering de elementos y documentos, y distinción entre correlación y causalidad. No se presentará una asociación observada como causa sin diseño causal o evidencia adicional.

**Laboratorio:** agrupar familias de elementos IFC y estudiar estabilidad frente a escalado, ruido y cambios de versión. **Gate 3:** demostrar que la agrupación no es un estándar BIM ni una clasificación profesional por sí misma.

**Curso 7. Deep learning y visión.** Perceptrón, backpropagation, optimización, CNN, regularización, transfer learning, detección/segmentación, embeddings multimodales, métricas y coste computacional. Se compara un baseline clásico con una red neuronal y se documenta el dominio de validez.

**Laboratorio:** clasificar imágenes de planos o defectos sólo con dataset de licencia clara o sintético, sin inferir propiedades personales ni decisiones de seguridad. **Evaluación:** matriz de confusión, calibración, test fuera de distribución y análisis de fallos.

**Curso 8. Lenguaje, transformers y sistemas generativos.** Tokenización, atención, transformers, preentrenamiento frente a fine-tuning, prompting, generación aumentada por recuperación (RAG), grounding, herramientas, agentes limitados y evaluación de factualidad. La página oficial de CS188 de otoño de 2026 incluye transformers como módulo final, pero debe tratarse como un índice docente, no como prueba de que ARKI haya cursado o aprendido la asignatura [1].

**Laboratorio:** asistente de consulta sobre un pequeño corpus autorizado de requisitos BIM y documentación pública. Toda respuesta debe incluir citas, fragmentos mínimos permitidos, fecha, confianza y ruta de escalado humano. **Gate 4:** resolver consultas con abstención cuando la evidencia no está en el corpus y bloquear instrucciones de herramienta no autorizadas.

### Fase 3 — Ingeniería de sistemas, arquitectura/BIM y seguridad (8–10 semanas)

**Curso 9. Datos, MLOps y operación reproducible.** Diseño de esquemas, calidad, linaje, versionado, feature pipelines, entrenamiento, registro de modelos, serving, monitorización, deriva, rollback, coste y pruebas de integración. Google recomienda construir primero una infraestructura robusta y un modelo simple, diseñar métricas antes del ML, probar la infraestructura por separado y controlar el training-serving skew [4].

**Laboratorio:** pipeline con datos sintéticos de activos, baseline y modelo, métricas offline, validación de esquema, registro de artefactos, monitor de deriva y plan de rollback. **Evaluación:** reconstrucción por una tercera persona y fallo inyectado recuperado en menos de 30 minutos.

**Curso 10. BIM computable, IFC, IDS y modelado.** IFC se estudia como esquema digital abierto y neutral de descripción del entorno construido, no sólo como extensión de archivo. La versión oficial indicada por buildingSMART es IFC 4.3.2.0, publicada también como ISO 16739-1:2024, y existe un servicio oficial de validación [5]. IDS 1.0 fue aprobado como estándar oficial el 1 de junio de 2024; permite expresar requisitos de información en forma interpretable por máquina y comprobar automáticamente modelos IFC, pero se limita a información alfanumérica y no cubre geometría [6].

**Laboratorio:** redactar un IDS para propiedades de muros, materiales o clasificación; generar un IFC de prueba; validar sintaxis y cumplimiento; reportar qué requisitos geométricos quedan fuera y necesitan otra verificación. Se puede añadir una práctica opcional con Revit API: Autodesk documenta una API .NET, guía de desarrollador, SDK y más de 100 ejemplos de código [7]. No se presupone licencia de Revit ni acceso a modelos de clientes.

**Aplicaciones prudentes:** extracción de cantidades, chequeo de propiedades, detección de inconsistencias, clasificación de elementos y asistencia en coordinación. No se automatizarán sin revisión las decisiones de resistencia, evacuación, habitabilidad, cumplimiento normativo, presupuesto contractual, autoría o seguridad de obra.

**Gate 5:** un tercero debe validar el IFC/IDS; ARKI debe señalar expresamente que IDS no cubre geometría y que el resultado no equivale a aprobación de diseño.

**Curso 11. IA confiable, seguridad y gobernanza.** Amenazas al dato, al modelo, a la aplicación y al proceso; privacidad y minimización; sesgo; robustez; trazabilidad; supervisión humana; control de acceso; gestión de incidentes; propiedad intelectual; evaluación de proveedores. NIST AI RMF 1.0 es un marco voluntario para incorporar confiabilidad en diseño, desarrollo, uso y evaluación, organizado alrededor de gobernar, mapear, medir y gestionar [8]. Su perfil para IA generativa, NIST AI 600-1, es un recurso complementario publicado en 2024 [9]. ISO/IEC 42001:2023 especifica requisitos para establecer, implementar, mantener y mejorar un sistema de gestión de IA; no sustituye la evaluación técnica de una aplicación concreta [10]. OWASP GenAI Top 10 2025 enumera riesgos como prompt injection, divulgación de información sensible, supply chain, data/model poisoning, improper output handling, excessive agency, system prompt leakage, debilidades de vectores/embeddings, misinformation y consumo no acotado [11].

**Laboratorio:** threat model de un asistente BIM con RAG y herramientas; pruebas de prompt injection y fuga; control de permisos; validación de salidas; kill switch; registro de auditoría; informe de impacto. **Gate 6:** ninguna herramienta que escriba o modifique modelos puede ejecutarse sin autorización explícita, validación de esquema y posibilidad de reversión.

### Fase 4 — Proyecto integrador y evaluación final (5–7 semanas)

**Curso 12. Proyecto de investigación aplicada y defensa.** Cada equipo elige un problema acotado: (a) QA de información IFC con IDS; (b) búsqueda y explicación de requisitos de proyecto; (c) detección de anomalías en datos de activos; (d) asistencia a modelado mediante API en un entorno de prueba; o (e) planificación de tareas sin autoridad para ejecutar cambios. El proyecto debe incluir problema, usuarios, dataset y licencia, baseline, método, evaluación, threat model, límites, coste, reproducibilidad, revisión humana y plan de retirada.

**Entregables:** repositorio; informe de 15–25 páginas; dataset o generador sintético; modelo/pipeline; conjunto de pruebas; ficha de modelo; ficha de datos; matriz NIST/OWASP; demostración grabada y defensa oral. **Gate final:** dos revisores independientes reproducen los resultados principales, encuentran las limitaciones en el informe y pueden provocar una abstención segura. Se aprueba con ≥80/100 global, ≥70/100 en cada dominio y cero fallos críticos de seguridad o de procedencia.

## Plan de evaluación y criterios de paso

La evaluación es acumulativa. Un resultado de modelo no se considera suficiente si no se puede explicar el objetivo, el dataset, la métrica, la incertidumbre, los errores y la ruta de corrección.

| Gate | Prueba | Criterio de paso |
|---|---|---|
| G0 Procedencia | Clasificar 20 afirmaciones y fuentes | ≥90%; cero afirmaciones de “libro leído” sin evidencia de ingestión autorizada |
| G1 Fundamentos | Derivaciones, código y tests | ≥80%; reproducibilidad en entorno limpio |
| G2 Experimentación | Diseñar y ejecutar experimento | Baseline, particiones, incertidumbre, error y registro completos |
| G3 Razonamiento | Resolver CSP/planificación/Bayes y defender supuestos | ≥75%; identificar casos donde el razonamiento no es válido |
| G4 Generativo | RAG con abstención y citas | ≥90% de respuestas soportadas en muestra; 100% de tool calls autorizadas |
| G5 BIM | IFC + IDS + validación | Sintaxis válida; requisitos cumplidos; limitación geométrica declarada |
| G6 Seguridad | Red-team controlado y mitigaciones | Cero acceso fuera de permisos; detección y recuperación documentadas |
| G7 Proyecto | Revisión independiente y defensa | ≥80/100; ≥70/100 por dominio; sin fallos críticos |

**Rubrica de proyecto:** 20% definición y trazabilidad; 20% corrección metodológica; 20% evaluación y errores; 15% reproducibilidad y operación; 15% seguridad/gobernanza; 10% comunicación y límites. Un fallo crítico incluye exponer datos protegidos, ejecutar una acción irreversible sin autorización, atribuir cumplimiento normativo sin base, ocultar una fuente, presentar alucinaciones como hechos o no poder revertir una modificación.

## Bibliografía candidata trazable

La siguiente bibliografía es **candidata y verificable**, no una lista de libros que ARKI haya leído. Los cursos pueden usar los materiales públicos enlazados. Para textos protegidos se requiere adquisición o acceso institucional legítimo y una decisión explícita de ingestión; este informe no descarga ni reproduce ninguno.

| Recurso | Tipo y uso propuesto | Estado para ARKI |
|---|---|---|
| Berkeley CS188 Fall 2026 y su textbook público [1] | Índice, lecturas enlazadas, vídeos y proyectos públicos para IA simbólica, probabilidad, RL, ML y transformers | Consultado como página y temario; no equivale a cursar ni a leer AIMA completo |
| MIT OpenCourseWare 6.034 [2] | Curso público de representación de conocimiento, resolución de problemas y aprendizaje; vídeos, exámenes y programación | Consultado como descripción y recursos públicos; no equivale a completar el curso |
| Stanford CS229 syllabus [3] | Syllabus y notas públicas para ML estadístico, deep learning, no supervisado, RL y proyecto | Consultado como syllabus; no afirma matrícula ni lectura completa |
| Google Rules of ML [4] | Documentación primaria de prácticas de ingeniería ML | Consultado públicamente; aplicable como guía, no certificación |
| CS2023 ACM/IEEE-CS/AAAI [12] | Marco curricular oficial de áreas de conocimiento y prácticas de computación | Consultado como índice curricular; no es un curso de ARKI |
| NIST AI RMF 1.0 [8] y GenAI Profile [9] | Marco y perfil de riesgos y confiabilidad | Material técnico público consultado |
| ISO/IEC 42001:2023 [10] | Estándar de sistema de gestión de IA | Página oficial y resumen consultados; el texto completo es de pago y no se presume ingestión |
| OWASP GenAI Top 10 2025 [11] | Riesgos y mitigaciones de aplicaciones generativas | Página oficial consultada; actualizar si OWASP publica una versión posterior |
| buildingSMART IFC [5] e IDS [6] | Estándares/documentación primaria de openBIM, validación e intercambio de información | Páginas oficiales consultadas; versiones deben fijarse en cada proyecto |
| Autodesk Revit API [7] | Documentación primaria y SDK para laboratorio de automatización | Página oficial consultada; SDK/licencias/modelos no se presuponen |
| Russell y Norvig, *Artificial Intelligence: A Modern Approach* | Texto recomendado por el syllabus de Berkeley | Recomendación bibliográfica; no leído ni ingerido por ARKI en esta investigación |
| Murphy, *Probabilistic Machine Learning*; Goodfellow, Bengio y Courville, *Deep Learning*; Bishop, *Pattern Recognition and Machine Learning* | Textos candidatos para profundización matemática y estadística | Recomendaciones; requieren acceso legítimo y no se declaran leídos |

## Fuentes primarias consultadas

Se consultaron páginas oficiales de cursos, organismos y documentación técnica. La fecha de consulta de este informe es 2026-09-21. Las versiones futuras o cambiantes deben verificarse antes de convertir esta propuesta en requisito contractual.

[1]: https://inst.eecs.berkeley.edu/~cs188/ "UC Berkeley CS 188 Fall 2026: Introduction to Artificial Intelligence"
[2]: https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/ "MIT OpenCourseWare 6.034 Artificial Intelligence"
[3]: https://cs229.stanford.edu/syllabus-new.html "Stanford CS229 Syllabus and Course Schedule"
[4]: https://developers.google.com/machine-learning/guides/rules-of-ml "Google Rules of Machine Learning"
[5]: https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/ "buildingSMART Industry Foundation Classes"
[6]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/ "buildingSMART Information Delivery Specification"
[7]: https://aps.autodesk.com/developer/overview/revit-api "Autodesk Platform Services Revit API"
[8]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"
[9]: https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence "NIST AI RMF Generative AI Profile"
[10]: https://www.iso.org/standard/42001 "ISO/IEC 42001:2023 Artificial Intelligence Management System"
[11]: https://genai.owasp.org/llm-top-10/ "OWASP Top 10 for LLMs and Generative AI Applications 2025"
[12]: https://csed.acm.org/ "CS2023 ACM/IEEE-CS/AAAI Computer Science Curricula"
[13]: https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng "Regulation (EU) 2024/1689: Artificial Intelligence Act"

## Unknowns que requieren revisión humana

- No se conoce el nivel inicial real de ARKI en matemáticas, programación, memoria de trabajo, herramientas, idiomas ni capacidad de ejecutar código.
- No está definido si ARKI es un modelo conversacional, un agente con herramientas, un sistema RAG, un producto o una combinación; el plan debe adaptarse a su arquitectura y permisos.
- No existe un corpus autorizado de proyectos ARKI, modelos IFC, requisitos de clientes, normativa local, datos de obra ni criterios de aceptación sectoriales.
- No se ha fijado jurisdicción. El Reglamento Europeo de IA adopta un enfoque basado en riesgo y contempla prohibiciones, obligaciones para sistemas de alto riesgo y transparencia [13], pero no sustituye asesoría jurídica ni determina por sí solo la clasificación de un caso BIM.
- No se han verificado las versiones concretas de software, IFC/MVD, IDS, Revit, APIs, modelos de lenguaje, proveedores, costes, límites de contexto ni disponibilidad en producción.
- No se han ejecutado los laboratorios ni se ha observado desempeño; los porcentajes de evaluación son criterios propuestos, no resultados medidos.

## Límites y salvaguardas

Este currículo no otorga credenciales universitarias, licencia profesional, certificación ISO, conformidad BIM ni autorización para firmar proyectos. Las referencias a universidades y estándares describen sus materiales y alcance, no constituyen afiliación ni endorsement.

Los modelos BIM reales pueden contener propiedad intelectual, información de seguridad, datos personales, secretos comerciales o información de infraestructura crítica. Deben permanecer en entornos autorizados, con minimización, control de acceso, retención definida y registro de exportaciones. Se deben preferir datasets sintéticos o públicos con licencia clara para enseñanza.

La IA generativa puede producir texto convincente pero incorrecto. En decisiones de arquitectura, ingeniería o construcción debe usarse recuperación con citas, reglas deterministas, validación de esquema, pruebas fuera de distribución y revisión de una persona competente. IDS puede comprobar información alfanumérica, pero no cubre geometría; por eso no debe venderse como revisión integral del modelo.

Los estándares, planes de curso, páginas de software y amenazas cambian. Antes de cada cohorte se debe congelar una lista de versiones, repetir los gates de procedencia y actualizar la matriz de riesgos. Las normas de pago y los libros no deben copiarse al corpus sin permiso. Si se autoriza ingestión, debe registrarse título, edición, licencia, alcance, fecha, hash o identificador y reglas de citación.

## Recomendación de decisión

Aprobar este documento como **diseño curricular para revisión humana**, no como declaración de conocimiento adquirido. El siguiente paso es realizar G0 con una instancia concreta de ARKI, seleccionar un caso BIM no sensible, obtener permisos de datos y software, y ejecutar cursos 1–4 antes de permitir cualquier integración generativa o modificación de modelos. La promoción a un entorno real debe depender de G5–G7, de la aceptación de un responsable de arquitectura/BIM y de una revisión de seguridad independiente.

## Registro de verificación

- Las fuentes universitarias se utilizaron para comparar índices y tipos de evaluación; no se presentaron como un currículo único ni como cursos de ARKI.
- Las páginas de NIST, ISO, OWASP, buildingSMART, Autodesk y EUR-Lex se trataron como documentación primaria o normativa oficial dentro de su alcance.
- No se descargaron ni reprodujeron libros protegidos.
- La distinción entre material consultado y material que requeriría ingestión autorizada aparece al inicio y se repite en la bibliografía y los límites.
- El estado del archivo queda en `READY_FOR_HUMAN_REVIEW` hasta que una persona revise versiones, licencias, jurisdicción, prerrequisitos y criterios de seguridad.

**Autor:** Manus AI
