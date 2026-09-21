# Ciclo formativo avanzado de modelos matemáticos para ARKI

**Fecha de corte:** 2026-09-21  
**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Ámbito:** fundamentos, métodos, laboratorio/proyecto, evaluación, BIM/openBIM, modelado geométrico y espacial, razonamiento técnico, verificación/validación, incertidumbre y seguridad.

## 1. Dictamen y alcance

Este documento propone un **plan formativo completo**, no una afirmación de que ARKI haya cursado una titulación universitaria ni leído libros completos. La base investigada está formada por páginas públicas de cursos universitarios, documentación primaria de organismos técnicos y páginas de estándares. Se consultaron de forma directa los recursos públicos indicados en las referencias; no se descargaron ni reprodujeron libros protegidos, y no se realizó ingestión de material cerrado.

La ruta recomendada es progresiva: (1) lenguaje matemático y computacional; (2) álgebra lineal, cálculo y ecuaciones diferenciales; (3) probabilidad, estadística y optimización; (4) análisis numérico y ecuaciones en derivadas parciales; (5) modelado espacial, BIM y datos; (6) verificación, validación, incertidumbre y seguridad; y (7) un laboratorio integrador con evaluación independiente. Esta secuencia evita usar un modelo numérico o una inferencia generativa como sustituto de una especificación, una medición o una revisión profesional.

La selección se apoya en dos patrones curriculares oficiales. MIT OpenCourseWare explicita prerrequisitos de cálculo multivariable, ecuaciones diferenciales y exposición al álgebra lineal para análisis numérico, y combina teoría con experimentos computacionales y exámenes [2]. Cambridge distingue entre el **syllabus/plan oficial**, los materiales de enseñanza y la evaluación; además, sus proyectos computacionales se evalúan mediante notebooks y programas entregados [8]. Estos hechos se usan como referencias de diseño, no como prueba de aprendizaje de ARKI.

## 2. Modelo de cobertura

La cobertura se expresa como una matriz de competencias, evidencias y límites. La meta es que cada competencia tenga al menos una evidencia reproducible y una prueba oral o escrita que no dependa de copiar código.

| Dominio | Cobertura propuesta | Evidencia mínima | Aplicación prudente a ARKI |
|---|---|---|---|
| Fundamentos | Lógica, funciones, cálculo diferencial e integral, cálculo multivariable, unidades y dimensionalidad | Resolución razonada de problemas y chequeos dimensionales | Traducir un requisito espacial o físico a variables y restricciones explícitas |
| Álgebra lineal y geometría | Vectores, matrices, sistemas, autovalores, transformaciones, coordenadas, geometría computacional básica | Implementación y análisis de un sistema lineal y una transformación 3D | Marcos de referencia, transformaciones BIM, ajuste de puntos y detección de degeneraciones |
| Ecuaciones y sistemas dinámicos | ODE, estabilidad, condiciones iniciales y de contorno, modelos de difusión, calor y ondas | Comparación analítica-numérica y análisis de sensibilidad | Simulaciones de energía, confort o flujo; nunca como cálculo reglamentario sin validación competente |
| Probabilidad y estadística | Variables aleatorias, estimación, regresión, intervalos, muestreo, propagación de incertidumbre | Informe con datos, supuestos, intervalos y análisis de sensibilidad | Ruido de sensores, cantidades BIM incompletas, escenarios de coste/plazo |
| Optimización y decisión | Optimización lineal/no lineal, restricciones, multiobjetivo, Pareto y robustez | Formulación, solución, validación y análisis de alternativas | Explorar masa, orientación, coste o energía sin presentar un óptimo como verdad única |
| Análisis numérico | Error, estabilidad, convergencia, interpolación, integración, raíces, mínimos cuadrados, PCA | Experimentos reproducibles y comparación de métodos | Saber cuándo una malla, tolerancia o redondeo cambia el resultado |
| PDE y discretización | Diferencias finitas y elementos finitos a nivel conceptual y práctico | Caso de Poisson/difusión con estudio de malla | Prototipos de transferencia, estructura o ambiente; revisión por especialista para decisiones de seguridad |
| Modelado de información | Esquemas, ontologías, semántica, versionado, trazabilidad, validación de datos | Mapeo documentado entre un pequeño modelo y IFC | Consultas y controles sobre objetos/propiedades, distinguiendo geometría de semántica |
| BIM/openBIM y ciudad 3D | ISO 19650, IFC, bSDD, CityGML, niveles de detalle y coordinación | Validación de un archivo de prueba y registro de incidencias | Intercambio vendor-neutral y coordinación; no asumir que la interoperabilidad es completa |
| Razonamiento | Separar datos, modelo, hipótesis, inferencia y decisión; contraejemplos y análisis de sensibilidad | Cuaderno de decisiones con cadena de evidencia | Explicar qué se sabe, qué se calcula y qué queda indeterminado |
| VVUQ y seguridad | Verificación, validación, cuantificación de incertidumbre, amenazas, controles y escalado humano | Plan VVUQ, matriz de riesgos y prueba adversarial | No automatizar aprobaciones estructurales, seguridad vital, cumplimiento normativo o acceso a sistemas |

**Cobertura lograda por la investigación:** currículo y prerrequisitos oficiales (MIT y Cambridge); modelado numérico de ODE/PDE; estándares primarios de IFC, CityGML e ISO 19650; y marcos de VVUQ y gestión de riesgos de NIST. **Cobertura no demostrada:** requisitos concretos de una jurisdicción de edificación, acreditación profesional, rendimiento de ARKI en ejercicios, seguridad de un despliegue real o validez de un modelo físico concreto.

## 3. Cursos completos propuestos

La carga es deliberadamente modular. Un curso se considera “completo” cuando tiene resultados de aprendizaje, práctica, una entrega, una prueba y un criterio de paso. La duración sugerida es orientativa y no equivale a créditos oficiales.

### Curso 0 — Herramientas, lenguaje y reproducibilidad (2–3 semanas)

**Objetivos.** Manejar notación, unidades, funciones, vectores, tablas, gráficos, control de versiones y notebooks. Distinguir dato observado, parámetro, variable de estado, hipótesis y resultado. Documentar versión de código, semillas aleatorias, origen de datos y tolerancias.

**Prácticas.** Construir un notebook que convierta unidades, grafique una función, propague un error elemental y reproduzca un resultado desde cero. Introducir pruebas unitarias para funciones matemáticas y una revisión de entradas mal formadas.

**Entrega y paso.** Notebook reproducible, explicación de dos páginas y defensa oral breve. Paso con 80% de pruebas automáticas correctas, cero errores de unidades no declarados y trazabilidad de cada entrada.

### Curso 1 — Cálculo y modelado continuo (6–8 semanas)

**Objetivos.** Dominar límites, derivadas, integrales, series, cálculo multivariable, gradiente, divergencia, rotacional, integrales de línea/superficie y dimensionalidad. Relacionar una ley o balance con una ecuación y discutir condiciones de aplicabilidad.

**Prácticas.** Modelos de crecimiento, balance térmico simple, optimización de una función de varias variables y verificación de unidades. Incluir ejemplos donde una singularidad o un dominio incorrecto invalide la solución.

**Entrega y paso.** Examen cerrado de fundamentos, problemas abiertos y mini-modelo documentado. Paso con ≥75% en conceptos, ≥80% en dimensionalidad y explicación correcta de al menos dos supuestos limitantes.

### Curso 2 — Álgebra lineal, geometría y transformaciones 3D (6–8 semanas)

**Objetivos.** Sistemas lineales, espacios vectoriales, rango, condicionamiento, autovalores/autovectores, matrices definidas positivas, mínimos cuadrados, coordenadas homogéneas y transformaciones rígidas/afines.

MIT describe como núcleo aplicado los sistemas de ecuaciones, espacios vectoriales, determinantes, autovalores, semejanza y matrices definidas positivas [3]. Se emplean aquí como índice curricular de referencia, no como afirmación de que ARKI haya completado el curso.

**Prácticas.** Ajustar una nube pequeña de puntos, registrar cambios de marco y detectar matrices singulares o casi singulares. Comparar una transformación correcta con una que invierte ejes o mezcla unidades.

**Entrega y paso.** Implementación sin biblioteca de caja negra para un solver pequeño, más auditoría de condicionamiento y prueba geométrica. Paso con residuo cuantificado, identificación de casos degenerados y 80% en ejercicios.

### Curso 3 — Ecuaciones diferenciales y sistemas dinámicos (6–8 semanas)

**Objetivos.** ODE de primer y segundo orden, sistemas lineales, estabilidad, equilibrio, osciladores, modelos de estado, condiciones iniciales y lectura de fase. MIT presenta las ecuaciones diferenciales como herramientas para modelar, resolver e interpretar fenómenos de ciencia e ingeniería [1].

**Prácticas.** Comparar solución analítica, Euler, Runge–Kutta y una solución de referencia. Estudiar paso temporal, estabilidad y sensibilidad de parámetros. Conectar un modelo de temperatura o demanda con un balance explícito.

**Entrega y paso.** Informe de simulación con análisis de error, sensibilidad y límites de extrapolación. Paso con convergencia demostrada en al menos un caso y sin confundir ajuste empírico con causalidad física.

### Curso 4 — Probabilidad, estadística y cuantificación de incertidumbre (6–8 semanas)

**Objetivos.** Probabilidad condicional, variables aleatorias, distribuciones, esperanza/varianza, muestreo, estimación, regresión, intervalos, validación cruzada, errores de medición y propagación de incertidumbre.

**Prácticas.** Simular mediciones de sensores, distinguir incertidumbre aleatoria de sesgo, reportar intervalos y realizar análisis de sensibilidad global y local. Comparar un modelo calibrado con un conjunto de validación separado.

**Entrega y paso.** Informe estadístico reproducible con datos sintéticos y, si se usan datos reales, su licencia y procedencia. Paso si se reportan supuestos, incertidumbre y límites de generalización; queda prohibido ocultar datos faltantes o presentar una métrica única sin contexto.

### Curso 5 — Optimización, inferencia y decisión multiobjetivo (5–7 semanas)

**Objetivos.** Optimización lineal y no lineal, restricciones, convexidad a nivel práctico, regularización, métodos de gradiente, búsqueda, Pareto, robustez y decisión bajo incertidumbre.

**Prácticas.** Formular un problema de alternativas de diseño con objetivos conflictivos, por ejemplo, área útil, energía y coste. Separar variables de decisión de indicadores y probar sensibilidad a pesos y restricciones.

**Entrega y paso.** Cuaderno de formulación y Pareto con al menos tres escenarios. Paso si el estudiante puede explicar por qué un “óptimo” depende de la función objetivo, los datos y las restricciones; no se acepta optimización sin análisis de factibilidad.

### Curso 6 — Análisis numérico y computación científica (6–8 semanas)

**Objetivos.** Error de truncamiento/redondeo, estabilidad, convergencia, interpolación, splines, integración, diferenciación, raíces, mínimos cuadrados, Fourier, muestreo y PCA. MIT resume este campo como el tratamiento computacional de funciones, derivadas, integrales y ecuaciones diferenciales, e incluye interpolación, ODE, Newton, Fourier, mínimos cuadrados y PCA [2].

**Prácticas.** Implementar métodos con tolerancias explícitas. Comparar precisión, coste y estabilidad. Construir pruebas de regresión y visualizaciones que muestren cuándo el método falla.

**Entrega y paso.** Paquete reproducible con código, tests, experimentos y nota técnica. Paso con error empírico consistente con la teoría en casos de control y con identificación de al menos un régimen inestable.

### Curso 7 — PDE, mallas y elementos finitos (7–9 semanas)

**Objetivos.** Ecuaciones de calor/difusión, ondas y Poisson; condiciones de contorno; discretización; sistemas dispersos; diferencias finitas y elementos finitos; calidad de malla y convergencia.

MIT 18.303 describe precisamente el uso de herramientas analíticas y computacionales para PDE lineales, con foco en calor/difusión, ondas y Poisson; presenta diferencias finitas y elementos finitos como reducciones a problemas matriciales y usa Julia en tareas sencillas [4].

**Prácticas.** Resolver Poisson 2D en un dominio simple, hacer refinamiento de malla y contrastar una solución manufacturada. La geometría arquitectónica se usa solo como dominio de prueba; no se afirma seguridad estructural.

**Entrega y paso.** Informe V&V de una simulación PDE con mallas, tolerancias, solución de referencia, sensibilidad y limitaciones. Paso con evidencia de convergencia y explicación de por qué una malla geométricamente bonita puede ser numéricamente inadecuada.

### Curso 8 — Modelado geométrico, espacial y semántico para BIM (5–7 semanas)

**Objetivos.** Distinguir geometría, topología, semántica, relaciones, unidades, sistemas de coordenadas, niveles de detalle, esquema y serialización. Introducir IFC, bSDD, CityGML, consultas y validación.

buildingSMART define IFC como descripciones digitales estandarizadas del entorno construido, abiertas, vendor-neutral y publicadas como ISO 16739; su página identifica IFC 4.3.2.0 como la versión oficial más reciente indicada allí [5]. La documentación HTML de IFC 4.3 advierte que su copia web puede ser un working draft y que no cambia el esquema ISO publicado [9]; por tanto, el curso debe fijar versión y fuente antes de validar.

OGC define CityGML como modelo conceptual y formato de intercambio para ciudades 3D, con aplicaciones que incluyen planificación, BIM, gestión de desastres, navegación y simulaciones ambientales [6].

**Prácticas.** Crear un modelo mínimo de edificio con espacios, elementos, propiedades y relaciones; mapearlo a un esquema; validar un archivo de prueba; comparar pérdida semántica entre una exportación y una importación. Para ciudad 3D, documentar nivel de detalle y sistema de referencia.

**Entrega y paso.** Archivo de prueba, mapa de entidades/propiedades, informe de validación y registro de incidencias. Paso solo si el alumno distingue “archivo válido según esquema” de “modelo adecuado para el uso”.

### Curso 9 — Gestión de información BIM, trazabilidad y coordinación (4–6 semanas)

**Objetivos.** Requisitos de información, versiones, estados, entregables, responsabilidades, control de cambios y coordinación. ISO 19650-1:2018 describe conceptos y principios de gestión de información BIM, incluyendo intercambio, registro, versionado y organización a lo largo del ciclo de vida del activo [7]. La página ISO indica que la edición fue confirmada en 2024 y que se esperaba una revisión; el curso debe comprobar el estado vigente antes de una decisión contractual.

**Prácticas.** Diseñar un flujo de aprobación para un modelo, un registro de cambios y un conjunto de reglas de validación. Separar “dato requerido”, “dato recibido” y “dato confiable para una decisión”.

**Entrega y paso.** Plan de información de un proyecto ficticio y auditoría de tres revisiones. Paso con trazabilidad completa de quién/qué/cuándo/por qué, y con tratamiento explícito de conflictos y datos ausentes.

### Curso 10 — VVUQ, razonamiento técnico y seguridad (5–7 semanas)

**Objetivos.** Separar verificación del código, validación frente al mundo y cuantificación de incertidumbre. ASME define verificación como determinar si el modelo computacional se ajusta a la descripción matemática; validación como determinar si representa adecuadamente la aplicación real; y cuantificación de incertidumbre como estudiar el efecto de variaciones en parámetros numéricos y físicos [10].

NIST AI RMF es un marco voluntario para incorporar confiabilidad en diseño, desarrollo, uso y evaluación de sistemas de IA; organiza el riesgo alrededor de Govern, Map, Measure y Manage y reconoce incertidumbres y riesgos desconocidos [11]. En ARKI se adopta como control de proceso, no como certificación de seguridad.

**Prácticas.** Construir una matriz de riesgos para un asistente que interpreta requisitos BIM o resultados numéricos. Diseñar pruebas adversariales para unidades, coordenadas, entradas incompletas, extrapolación, instrucciones conflictivas y datos sensibles. Definir puntos de escalado a una persona competente.

**Entrega y paso.** Dossier VVUQ y seguridad con casos positivos/negativos, riesgos residuales, logs y plan de rollback. Paso si ninguna conclusión crítica carece de fuente, incertidumbre y responsable de revisión.

### Curso 11 — Laboratorio integrador: modelo arquitectónico verificable (8–10 semanas)

**Proyecto.** Para un edificio pequeño y un contexto urbano delimitado, construir un modelo reproducible que combine: geometría y transformaciones; un modelo físico simple, como balance térmico o difusión; un conjunto de datos BIM mínimo; una consulta o validación IFC; y una exploración multiobjetivo. El resultado debe incluir un caso de fallo conocido y una comparación con referencia.

**Entregables.** Especificación de problema; diccionario de datos; modelo y código; notebook reproducible; archivo IFC de prueba o fixture equivalente; informe numérico; matriz VVUQ; evaluación de seguridad; y presentación oral. No se usan datos personales, planos confidenciales ni información crítica de instalaciones sin autorización.

**Criterio de aprobación.** La nota mínima global sugerida es 80/100, con mínimos de 70/100 en fundamentos, 80/100 en VVUQ y 90/100 en seguridad y trazabilidad. Un fallo crítico de seguridad, una cita inventada, una licencia incumplida o una conclusión materialmente falsa implica no pasar aunque el promedio sea alto.

## 4. Método de enseñanza y progresión

Cada semana combina una lectura de syllabus o documentación primaria, una sesión de explicación, problemas resueltos, un experimento computacional y una revisión. El progreso debe ir de la **representación** a la **formulación**, de la formulación al **cálculo**, del cálculo a la **validación**, y de la validación a la **decisión condicionada**.

La evaluación continua debe mantener un cuaderno de evidencias. Cada entrada registra: pregunta; versión del modelo; variables y unidades; datos y licencia; hipótesis; método; tolerancias; resultado; incertidumbre; prueba negativa; y decisión sobre si hace falta revisión humana. Se recomienda revisión por pares para notebooks y una defensa oral para descartar que la evidencia sea solo una transcripción.

## 5. Evaluación global y criterios de paso

| Componente | Peso | Evidencia | Umbral |
|---|---:|---|---:|
| Fundamentos y problemas | 20% | Exámenes y problemas inéditos | ≥70% |
| Métodos numéricos | 20% | Código, tests, error y convergencia | ≥75% |
| Datos/BIM/espacial | 15% | Modelo mínimo, esquema y validación | ≥75% |
| Estadística/optimización | 10% | Incertidumbre y escenarios multiobjetivo | ≥75% |
| Laboratorio/proyecto | 25% | Dossier reproducible y demo | ≥80% |
| VVUQ, seguridad y comunicación | 10% | Defensa, matriz de riesgos y escalado | ≥80% |

Los criterios de paso son: (a) reproducibilidad por un tercero con las instrucciones entregadas; (b) supuestos, unidades y versión declarados; (c) separación entre error numérico, incertidumbre de datos y limitación de modelo; (d) verificación independiente de los resultados críticos; (e) evidencia de que el modelo no se extrapola más allá de su dominio; (f) trazabilidad de estándares y licencias; y (g) escalado a un profesional cuando una decisión afecte seguridad, cumplimiento, coste material o vida útil del activo.

Una prueba de recuperación debe exigir modificar un parámetro, introducir datos faltantes, cambiar el sistema de coordenadas o reducir la malla. El estudiante debe predecir qué cambia antes de ejecutar. El aprobado no se concede por coincidencia de una cifra, sino por explicar el mecanismo, el error y el límite.

## 6. Material consultado, bibliografía candidata y estado de conocimiento

### Material público realmente consultado

Se consultaron las páginas públicas de MIT OCW sobre ecuaciones diferenciales, álgebra lineal, análisis numérico y PDE; la página de estructura curricular y evaluación de Cambridge; las páginas oficiales de buildingSMART sobre IFC y su documentación HTML; la página OGC de CityGML; la ficha pública de ISO 19650-1; la página ASME de VVUQ; y la página NIST AI RMF. Las afirmaciones específicas del informe se limitan a lo que esas páginas exponen.

### Bibliografía candidata trazable

La lista siguiente no significa que ARKI haya leído esos libros o estándares completos. “Candidata” significa que puede seleccionarse para una futura lectura, compra, consulta institucional o ingestión autorizada, respetando copyright y licencias.

| Recurso | Uso propuesto | Estado |
|---|---|---|
| MIT OCW 18.03SC, *Differential Equations* | Índice, vídeos, notas, problemas y exámenes abiertos | Público consultado; no libro completo |
| MIT OCW 18.06, *Linear Algebra* | Índice y recursos de álgebra lineal | Público consultado; no libro completo |
| MIT OCW 18.330, *Introduction to Numerical Analysis* | Prerrequisitos, temas, tareas y esquema de evaluación | Público consultado; no libro completo |
| MIT OCW 18.303, *Linear Partial Differential Equations: Analysis and Numerics* | PDE, diferencias finitas y elementos finitos | Público consultado; no libro completo |
| Faculty of Mathematics, University of Cambridge, *Mathematical Tripos course information* | Modelo de syllabus, proyectos y exámenes | Página pública consultada |
| buildingSMART International, *Industry Foundation Classes (IFC)* | Definición, versiones, validación e interoperabilidad | Página pública consultada |
| OGC, *CityGML 3.0 Conceptual Model and Encoding Standards* | Modelo urbano 3D, semántica y LOD | Página y documentos enlazados consultados; no asumir lectura completa del estándar |
| ISO, *ISO 19650-1:2018* | Gestión de información BIM durante el ciclo de vida | Ficha/abstract público consultado; texto completo de pago o sujeto a licencia |
| ASME, *Verification, Validation and Uncertainty Quantification* | Definiciones y módulos introductorios | Página pública consultada; normas completas sujetas a licencia |
| NIST, *AI Risk Management Framework 1.0* y *Generative AI Profile* | Gestión de riesgos y evaluación de IA | Página pública y enlaces oficiales consultados; lectura completa futura separada |
| J. D. Anderson, *Computational Fluid Dynamics: The Basics with Applications* | Candidato para discretización y CFD | Bibliografía candidata; no consultado para este informe |
| R. J. LeVeque, *Finite Difference Methods for Ordinary and Partial Differential Equations* | Candidato para análisis numérico | Bibliografía candidata; no consultado para este informe |
| M. P. do Carmo, *Differential Geometry of Curves and Surfaces* | Candidato para geometría diferencial | Bibliografía candidata; no consultado para este informe |
| T. Hastie, R. Tibshirani y J. Friedman, *The Elements of Statistical Learning* | Candidato para estadística/aprendizaje | Bibliografía candidata; no consultado para este informe |

### Conocimiento que requeriría ingestión autorizada

Requerirían acceso autorizado y una decisión explícita de licencia: libros comerciales completos; el texto integral de ISO 19650 y otras normas de pago; normas ASME completas; manuales propietarios de software BIM; datos de proyectos, modelos federados, planos, nubes de puntos o sensores no públicos; y cualquier corpus privado de ARKI. Hasta que exista autorización, ARKI debe usar solo resúmenes, páginas públicas, estándares abiertos permitidos, ejemplos sintéticos y archivos con licencia compatible. Una referencia bibliográfica por sí sola no convierte su contenido en conocimiento aprendido.

## 7. Unknowns y preguntas para revisión humana

1. No se conoce el nivel inicial real de ARKI en cálculo, programación, álgebra lineal, estadística ni lectura técnica.
2. No se conoce el objetivo operativo exacto: tutoría, generación de modelos, revisión BIM, simulación o asistencia de investigación.
3. No se conoce la jurisdicción normativa ni si el uso afectará permisos, estructuras, evacuación, energía, seguridad laboral o mantenimiento.
4. No se conoce la versión IFC, MVD, bSDD, CityGML, sistema de coordenadas ni software que el entorno deba soportar.
5. No se conoce la disponibilidad de datos etiquetados, casos de referencia, mediciones físicas ni expertos para validación.
6. No se ha probado el rendimiento de ARKI ni la resistencia a prompt injection, datos maliciosos, confusión de unidades o instrucciones contradictorias.
7. Las páginas de estándares pueden cambiar. La documentación de IFC consultada marca su HTML como working draft; por ello las decisiones de conformidad deben fijar una release oficial y conservar una copia legalmente permitida.
8. ISO 19650-1:2018 aparece como vigente en la ficha consultada, pero la misma página indica una revisión esperada; se requiere comprobación antes de usarla contractualmente.

## 8. Límites y salvaguardas

Este currículo no acredita competencia profesional ni autoriza a ARKI a firmar, aprobar o certificar diseños. Un resultado numérico plausible no demuestra que el modelo físico sea válido. Un archivo IFC válido no demuestra que contenga toda la información necesaria ni que la semántica haya sobrevivido a una conversión. CityGML y BIM describen información y relaciones; no sustituyen levantamientos, ensayos o responsabilidades legales.

Para arquitectura e ingeniería, ARKI solo debe ofrecer exploración, explicación, comprobaciones y alternativas claramente etiquetadas. Las decisiones sobre estabilidad, fuego, evacuación, accesibilidad, salud, instalaciones críticas, seguridad laboral, cumplimiento normativo o impacto económico significativo requieren revisión y aceptación de una persona competente. Los ejemplos del laboratorio deben ser sintéticos o contar con autorización; no deben contener secretos, credenciales, datos personales ni información sensible de seguridad física.

## 9. Verification gates antes de declarar “formado”

1. **Gate curricular:** completar Cursos 0–6 y demostrar los mínimos de fundamentos, cálculo, álgebra, estadística y análisis numérico.
2. **Gate numérico:** reproducir dos casos de control y mostrar error, estabilidad, convergencia y sensibilidad.
3. **Gate geométrico/BIM:** validar un modelo mínimo con una release IFC fijada, documentar unidades y coordenadas, y registrar pérdidas de intercambio.
4. **Gate VVUQ:** separar verificación, validación e incertidumbre en un dossier; ningún término puede usarse como sinónimo de los otros.
5. **Gate de seguridad:** pasar pruebas de datos faltantes, unidades incompatibles, coordenadas invertidas, extrapolación, instrucciones maliciosas y conflicto entre fuentes.
6. **Gate de defensa:** responder oralmente a cambios en parámetros y explicar qué evidencia dejaría de ser válida.
7. **Gate humano:** un revisor de matemáticas y un revisor de arquitectura/BIM aceptan el proyecto, los límites y el plan de escalado.
8. **Gate operativo:** registrar versión de software, versión del estándar, licencia de cada dato, hash o identificador de artefactos y procedimiento de rollback.

## 10. Conclusión para revisión humana

La propuesta ofrece un ciclo avanzado y verificable sin atribuir a ARKI lecturas no realizadas. Su núcleo es la relación entre formulación matemática, cálculo reproducible, semántica del modelo y decisión responsable. La aprobación humana debe fijar el nivel inicial, los casos de uso, la jurisdicción, las versiones de estándares y el acceso autorizado a materiales. Hasta superar todos los gates, el estado correcto es **aprendizaje planificado / evidencia en construcción**, no “experto certificado”.

## References

[1]: https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/ "MIT OpenCourseWare, Differential Equations"

[2]: https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/pages/syllabus/ "MIT OpenCourseWare, Introduction to Numerical Analysis syllabus"

[3]: https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/ "MIT OpenCourseWare, Linear Algebra"

[4]: https://ocw.mit.edu/courses/18-303-linear-partial-differential-equations-analysis-and-numerics-fall-2014/ "MIT OpenCourseWare, Linear Partial Differential Equations: Analysis and Numerics"

[5]: https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/ "buildingSMART International, Industry Foundation Classes (IFC)"

[6]: https://www.ogc.org/standards/citygml/ "Open Geospatial Consortium, CityGML Standard"

[7]: https://www.iso.org/standard/68078.html "ISO 19650-1:2018, Concepts and principles"

[8]: https://www.maths.cam.ac.uk/undergrad/course "University of Cambridge Faculty of Mathematics, Undergraduate Course Information"

[9]: https://ifc43-docs.standards.buildingsmart.org/ "buildingSMART IFC 4.3 documentation"

[10]: https://www.asme.org/codes-standards/publications-information/verification-validation-uncertainty "ASME, Verification, Validation and Uncertainty Quantification"

[11]: https://www.nist.gov/itl/ai-risk-management-framework "NIST, AI Risk Management Framework"

[12]: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf "NIST AI 100-1, Artificial Intelligence Risk Management Framework 1.0"

---

**Control de estado:** `READY_FOR_HUMAN_REVIEW`. Este control significa que el informe está redactado y trazado para revisión; no significa que ARKI haya completado los cursos, ingerido los textos candidatos ni alcanzado los criterios de paso.
