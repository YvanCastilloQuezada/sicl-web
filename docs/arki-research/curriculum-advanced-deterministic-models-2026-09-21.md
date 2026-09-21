# Modelos determinísticos para ARKI: currículo avanzado

**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Fecha de corte:** 2026-09-21  
**Objeto:** diseñar una ruta formativa completa para ARKI en modelos determinísticos, desde fundamentos matemáticos hasta un proyecto verificable aplicado a arquitectura, BIM y gestión de activos.

## 1. Conclusión ejecutiva

Se propone un recorrido de **seis cursos encadenados**, distribuido en cuatro fases: fundamentos; formulación y métodos; laboratorio/proyecto; y evaluación/certificación interna. El núcleo es la capacidad de traducir un problema del mundo real a un modelo matemático explícito, resolverlo con un método apropiado, verificar factibilidad y optimalidad, analizar sensibilidad y comunicar las limitaciones de los datos y de los supuestos.

La ruta toma como referencia convergente varios planes universitarios. Rowan incluye formulación, validación, programación lineal, simplex, puntos interiores, dualidad, sensibilidad, transporte, asignación, programación entera, programación dinámica e inventarios determinísticos. Illinois añade redes, programación no lineal y teoría de juegos. Lehigh explicita la relación primal-dual, holguras complementarias, análisis de sensibilidad y uso de un solver. MIT aporta un curso de posgrado orientado a logística, lot-sizing, inventarios, routing y proyectos. Estas fuentes muestran el **alcance de índices y syllabi**, no prueban que ARKI haya cursado las asignaturas ni leído íntegramente los libros indicados. [1] [2] [3] [4]

La aplicación a AEC/BIM debe ser prudente: optimización de asignación de espacios, rutas, compras, secuenciación y mantenimiento puede modelarse cuando las variables y restricciones están bien definidas; no sustituye el juicio de arquitectos, ingenieros, responsables de obra, facility managers o especialistas de seguridad. IFC es un estándar de intercambio de información BIM y cubre objetos, relaciones, procesos y análisis a lo largo del ciclo de vida; ISO 19650 estructura la gestión de información y su Parte 5 exige un enfoque de seguridad para información sensible. [5] [6] [7]

## 2. Alcance y modelo de cobertura

### 2.1 Definición operativa

En este currículo, un **modelo determinístico** usa datos, parámetros y relaciones considerados conocidos para el escenario analizado. No significa que el mundo real sea cierto, estable o predecible. Si demanda, duraciones, costes o fallos son inciertos, el resultado debe declararse como solución de un escenario, o extenderse posteriormente a análisis de escenarios, robustez o modelos estocásticos.

Se cubren cinco capacidades acumulativas:

| Dimensión | Cobertura objetivo | Evidencia de dominio |
|---|---|---|
| Fundamentos | Álgebra lineal, cálculo, conjuntos, grafos, convexidad básica, complejidad y lectura de datos | Derivaciones cortas, comprobación de unidades y ejercicios reproducibles |
| Modelado | Variables de decisión, objetivo, restricciones, dominios, índices, unidades, supuestos y validación | Modelo documentado con trazabilidad desde requisitos a ecuaciones |
| Métodos | LP, simplex, dualidad, sensibilidad, redes, IP/MILP, branch-and-bound, DP, inventarios y NLP básico | Solución manual de casos pequeños y solución computacional contrastada |
| Ingeniería del resultado | Factibilidad, optimalidad, cotas, gap, degeneración, escalado, análisis de sensibilidad y escenarios | Informe que distingue solución, diagnóstico y límites |
| Aplicación AEC/BIM y seguridad | Espacio, logística, planificación, compras, mantenimiento, IFC, gestión de información y protección de datos sensibles | Proyecto con modelo de datos, controles de acceso, auditoría y revisión humana |

### 2.2 Lo que se investigó y lo que no se afirma

**Materiales públicos realmente consultados:** las páginas públicas de MIT OpenCourseWare sobre descripción, syllabus, lecturas, notas y tareas de ESD.273J; los syllabi públicos de Rowan Math 03.411, Illinois IE 310 y Lehigh ISE 240; las guías públicas de NEOS sobre LP e IP; la documentación pública de Google OR-Tools; las páginas oficiales ISO sobre BIM, ISO 19650-5 e ISO 16739-1:2024; la documentación técnica de buildingSMART sobre IFC; y la ficha pública de NIST sobre reconstrucción de BIM a partir de nubes de puntos. [1]–[12]

**Índices y planes de estudio:** los syllabi se usan para inferir secuencia, prerrequisitos, temas y formas de evaluación. No se presentan como un curso oficial de ARKI ni como evidencia de aprendizaje adquirido.

**Textos recomendados:** los libros listados por los syllabi y NEOS se registran abajo como bibliografía candidata. No se descargaron ni reprodujeron libros protegidos, y no se afirma que ARKI haya leído ninguno completo.

**Conocimiento que requeriría ingestión autorizada:** capítulos completos, ejercicios no públicos, soluciones de docentes, ediciones comerciales, estándares ISO completos, documentación propietaria de solvers, manuales internos, modelos BIM de proyectos, datos de costes, información de seguridad, nubes de puntos restringidas y cualquier corpus suministrado por el titular. Para que ARKI responda apoyándose en esos materiales habría que obtenerlos legalmente, registrar licencia y alcance, ingerirlos en un entorno autorizado y volver a evaluar sus respuestas.

## 3. Cursos completos propuestos

La carga sugerida es de **24–30 semanas**, con 5–7 horas semanales por curso, más un proyecto de 6–8 semanas. Los cursos son una propuesta curricular interna, no nombres ni ediciones de cursos existentes.

### Curso 1 — Fundamentos matemáticos y lenguaje de decisión

**Propósito.** Construir la base para leer, formular y auditar modelos sin convertir notación en una caja negra.

**Resultados de aprendizaje.** Al terminar, ARKI debe poder explicar conjuntos e índices; vectores, matrices y sistemas lineales; desigualdades y regiones factibles; derivadas y gradientes; grafos y redes; unidades y escalas; y la diferencia entre parámetro, variable de decisión, restricción, objetivo, supuesto y criterio de parada.

**Secuencia.** (1) Problemas de decisión y ciclo de modelado. (2) Álgebra lineal para modelos. (3) Funciones, derivadas y convexidad intuitiva. (4) Grafos, caminos y flujos. (5) Lógica de restricciones, variables binarias y dominios. (6) Complejidad computacional y reproducibilidad. (7) Validación dimensional y detección de datos faltantes.

**Laboratorio.** Implementar desde cero un modelo pequeño de asignación de salas y un camino mínimo en una red de edificio. Comparar solución analítica, enumeración exhaustiva para instancias pequeñas y solver. Cada notebook debe incluir datos sintéticos, semilla o versión de datos, unidades y pruebas de factibilidad.

**Producto.** Glosario técnico y ficha de modelado de dos páginas por problema, con diagrama de entidades y tabla de supuestos.

**Criterio de salida.** Al menos 80 % en ejercicios; ninguna restricción esencial omitida en dos casos consecutivos; y explicación oral de por qué una solución factible no necesariamente es óptima.

### Curso 2 — Programación lineal, dualidad y análisis de sensibilidad

**Propósito.** Dominar la familia central de modelos determinísticos y su interpretación.

**Resultados de aprendizaje.** Formular LP en forma algebraica y matricial; resolver problemas pequeños gráficamente y con simplex; interpretar dualidad, precios sombra, holguras y costes reducidos; distinguir infeasibilidad, ilimitación y múltiples óptimos; y realizar análisis de sensibilidad dentro de rangos válidos.

**Secuencia.** (1) Formulación y forma estándar. (2) Región factible y geometría. (3) Simplex y variantes. (4) Dualidad débil y fuerte. (5) Holgura complementaria. (6) Sensibilidad de coeficientes y lados derechos. (7) Puntos interiores a nivel conceptual. (8) Implementación con un solver y auditoría de salida.

**Laboratorio.** Planificación de materiales y mano de obra para una pequeña obra, con límites de suministro, presupuesto, horas y emisiones. Resolver una instancia manual de dos variables, una instancia con OR-Tools y una tercera con perturbaciones de parámetros. Registrar el estado del solver, tolerancias, objetivo, restricciones activas y sensibilidad.

**Producto.** Informe técnico que conecte cada salida numérica con una decisión operativa y señale qué cambios invalidan la interpretación de sensibilidad.

**Criterio de salida.** 85 % en formulación y diagnóstico; 80 % en una prueba manual de simplex/dualidad; y cero afirmaciones de optimalidad sin estado, certificado o verificación apropiada.

### Curso 3 — Redes, transporte, asignación y flujos

**Propósito.** Reconocer estructura de red antes de usar un modelo general más costoso.

**Resultados de aprendizaje.** Modelar transporte y asignación; camino mínimo, árbol de expansión mínima y flujo máximo; comprender capacidades, conservación de flujo, costes y nodos ficticios; y justificar cuándo un algoritmo especializado es preferible a un LP genérico.

**Secuencia.** (1) Representación de grafos. (2) Transporte balanceado y no balanceado. (3) Asignación y variables binarias. (4) Camino mínimo. (5) Árbol de expansión mínima. (6) Flujo máximo y corte mínimo. (7) Redes de proyecto y precedencias. (8) Validación contra rutas y cantidades de referencia.

**Laboratorio.** Crear una red sintética de acceso a obra y distribución de materiales. Resolver rutas de vehículos simplificadas, asignación de cuadrillas y flujo de materiales; después, comparar los resultados con una formulación MILP pequeña.

**Producto.** Modelo de red visualizado, archivo de datos separado del modelo y memoria de selección del algoritmo.

**Criterio de salida.** 80 % en ejercicios; balance de flujo verificado nodo a nodo; y explicación de la diferencia entre una ruta de menor coste y una ruta segura o legalmente autorizada.

### Curso 4 — Programación entera, MILP y optimización no lineal básica

**Propósito.** Representar decisiones discretas y entender el coste de la combinatoria.

**Resultados de aprendizaje.** Usar variables binarias para activar decisiones; formular implicaciones, selección, cobertura, precedencias y tamaños mínimos; distinguir IP, MILP, MINLP y programación por restricciones; explicar relajación lineal, cotas, branch-and-bound, gap y time limit; y resolver problemas no lineales pequeños con derivadas, multiplicadores de Lagrange y condiciones KKT a nivel introductorio.

NEOS define IP como optimización lineal con restricciones de integralidad y distingue modelos puros, binarios y mixtos; también advierte que los modelos enteros son, en general, mucho más difíciles que LP. [9] El curso debe tratar esta dificultad como un asunto de garantía y recursos, no como una invitación a prometer optimalidad en cualquier tamaño.

**Secuencia.** (1) Relajación LP. (2) Big-M y alternativas con indicadores, con advertencia de escalado. (3) Cobertura, localización y selección. (4) Precedencias y calendarización. (5) Branch-and-bound, cortes y heurísticas como conceptos. (6) Diagnóstico de gap e infeasibilidad. (7) NLP sin restricciones y con restricciones. (8) KKT, convexidad y límites de los óptimos locales.

**Laboratorio.** Seleccionar un conjunto de intervenciones de mantenimiento sujeto a presupuesto, ventanas, precedencias y niveles de servicio. Ejecutar al menos dos formulaciones equivalentes, comparar tamaño, tiempo, gap y estabilidad, y documentar qué decisiones son enteras por necesidad de negocio.

**Producto.** Paquete reproducible con modelo, datos, log del solver, prueba de factibilidad, solución incumbente, cota y análisis de sensibilidad por escenarios.

**Criterio de salida.** 85 % en formulación; 80 % en interpretación de gap y estados; y rechazo explícito de una solución cuando falta certificado o cuando los datos no sostienen el supuesto.

### Curso 5 — Programación dinámica, inventarios determinísticos y logística

**Propósito.** Tratar decisiones secuenciales y planificación a lo largo del tiempo.

**Resultados de aprendizaje.** Identificar estado, acción, transición y coste; construir recursiones de programación dinámica; resolver inventarios de demanda conocida, EOQ y lot-sizing; extender a múltiples periodos y niveles de suministro; y diferenciar claramente el caso determinístico del estocástico.

MIT describe un curso de logística que requiere experiencia previa en probabilidad y LP, y cubre routing, lot-sizing, inventarios de varios niveles, pricing y modelos determinísticos y estocásticos. Su calendario público y sus notas incluyen EOQ, dynamic economic lot sizing y materiales de contratos y demanda; aquí se usa como referencia de progresión, no como evidencia de que ARKI haya completado ese curso. [1] [13] [14]

**Secuencia.** (1) Horizonte finito e infinito. (2) EOQ y costes de ordenar, mantener y escasez. (3) Lot-sizing dinámico. (4) DP hacia delante y hacia atrás. (5) Inventario multinivel simplificado. (6) Routing y consolidación como modelos de red/MILP. (7) Escenarios de demanda y límites del determinismo. (8) Introducción a robustez y estrés, sin confundirla con un modelo estocástico completo.

**Laboratorio.** Planificar entregas de materiales para un proyecto con demanda temporal conocida en el caso base, capacidad de almacén, costes de pedido y fechas de obra. Resolver por DP y por MILP; comparar políticas cuando se alteran plazos, costes y demanda.

**Producto.** Caso de estudio con una política explicable, comparación de costes y un apartado de escenarios adversos.

**Criterio de salida.** 80 % en recursiones y formulación; coincidencia entre DP y MILP en instancias de prueba; y advertencia explícita cuando el resultado depende de una demanda supuestamente conocida.

### Curso 6 — Laboratorio integrado de arquitectura, BIM, razonamiento y seguridad

**Propósito.** Integrar modelado, optimización, interoperabilidad y controles humanos en un problema AEC realista pero no sensible.

**Resultados de aprendizaje.** Extraer entidades y relaciones de un dataset BIM autorizado; mapearlas a variables, restricciones y objetivos; documentar la trazabilidad desde requisito hasta resultado; intercambiar una selección de información mediante IFC; y producir un informe que no confunda optimización de un escenario con una decisión de diseño certificada.

**Aplicaciones prudentes.** Son adecuadas como ejercicios: asignación de espacios con requisitos declarados; selección de alternativas de fachada con presupuesto y carbono; secuenciación de actividades con precedencias; rutas de materiales dentro de un recinto; asignación de equipos de mantenimiento; y priorización de inspecciones. No deben presentarse como cálculo estructural, aprobación de evacuación, cumplimiento normativo automático, garantía de seguridad física, presupuesto contractual ni sustituto de un profesional habilitado.

IFC 4.3/ISO 16739-1:2024 es un estándar abierto de intercambio de información BIM que define esquema, documentación, conjuntos de propiedades y estructura de archivos, con alcance ampliado a infraestructura y distintos Model View Definitions. [6] buildingSMART explica además que IFC representa identidad, semántica, atributos y relaciones de objetos, procesos, análisis y actores. [7] NIST organiza la reconstrucción de un BIM as-built en modelado geométrico, reconocimiento de objetos y modelado de relaciones, y señala que la creación manual a partir de nubes de puntos es costosa, subjetiva y propensa a errores. [11]

**Secuencia.** (1) Requisitos de información y diccionario de datos. (2) IFC, entidades, propiedades, relaciones y MVD. (3) Preparación de datasets sintéticos o autorizados. (4) Modelo de asignación o planificación. (5) Verificación geométrica y semántica, sin inferir más de lo observado. (6) Reproducibilidad y revisión por pares. (7) Riesgos de información sensible. (8) Presentación ante panel técnico.

**Seguridad.** ISO 19650-5:2020 especifica principios y requisitos para una gestión de información con mentalidad de seguridad, aplicable durante el ciclo de vida y a información sensible, comercial, personal o de propiedad intelectual; la ficha oficial indica que fue confirmada como vigente en 2025. [5] El laboratorio debe usar control de acceso mínimo, separación de datos identificables, registro de versiones, inventario de fuentes, revisión de exportaciones, no publicación de planos sensibles y un procedimiento de incidente. No se ingerirá información clasificada o crítica sin autorización expresa.

**Producto.** Proyecto final, defensa oral, archivo reproducible y ficha de riesgos.

**Criterio de salida.** Aprobación conjunta del modelo, de la evidencia computacional, de la trazabilidad BIM y de la revisión de seguridad.

## 4. Laboratorio y proyecto integrador

Se recomienda un proyecto de **planificación de rehabilitación de un edificio sintético**. El dataset contiene espacios, elementos, actividades, recursos, costes, precedencias, ventanas temporales y requisitos de acceso. Debe ser ficticio o liberado con licencia que permita su uso.

El equipo formula tres submodelos conectados:

1. **Selección:** qué intervenciones ejecutar bajo presupuesto, impacto y precedencias.
2. **Programación:** cuándo ejecutarlas con recursos limitados y restricciones de calendario.
3. **Logística:** cómo asignar cuadrillas y rutas de materiales sin violar capacidades del recinto.

El archivo de requisitos debe mapear cada decisión a una variable y cada regla a una restricción. El informe debe incluir un caso base, al menos tres escenarios, un análisis de sensibilidad, un diagnóstico de infeasibilidad deliberadamente introducida y una comparación entre una formulación compacta y otra más explícita. La salida IFC debe limitarse a la información necesaria para el intercambio y no debe incluir datos personales ni detalles de seguridad no necesarios.

La revisión humana se divide en cuatro roles: experto en operaciones, profesional AEC/BIM, responsable de datos y responsable de seguridad. Ninguna aprobación de ARKI se interpreta como aprobación de diseño, obra o cumplimiento normativo.

## 5. Plan de evaluación y criterios de paso

| Hito | Evidencia | Umbral de paso |
|---|---|---:|
| Diagnóstico inicial | Prueba de álgebra, grafos y lectura de modelos | 70 % para entrar; si no, cursar refuerzo |
| Fundamentos | Dos fichas de modelado y notebook con pruebas | 80 % y 100 % de unidades declaradas |
| LP/dualidad | Examen manual y modelo computacional | 80 %; diagnóstico correcto de infeasible/unbounded |
| Redes | Modelo de transporte y camino/flujo | 80 %; balances auditados |
| IP/NLP | MILP con gap y análisis de formulación | 85 % de formulación; gap comunicado |
| DP/logística | DP contra MILP en casos pequeños | 80 %; supuestos temporales explícitos |
| Proyecto | Repositorio, informe, defensa y revisión de seguridad | 80/100 global y ningún fallo crítico |

La rúbrica del proyecto pondera: **30 % formulación y trazabilidad**, **20 % corrección matemática y computacional**, **15 % validación y sensibilidad**, **15 % reproducibilidad**, **10 % comunicación**, y **10 % BIM/seguridad**. Un fallo crítico es cualquier resultado no factible presentado como válido, cualquier afirmación de optimalidad sin soporte, la exposición de datos sensibles, o una recomendación de diseño/seguridad presentada sin revisión profesional.

El paso final exige que ARKI pueda responder cinco preguntas para cada resultado: qué se optimizó; bajo qué datos y supuestos; qué evidencia acredita factibilidad y, si procede, optimalidad; qué cambia bajo perturbaciones; y quién debe revisar antes de usarlo.

## 6. Bibliografía candidata trazable

La siguiente lista es **bibliografía para adquisición o consulta posterior**, no una lista de obras aprendidas por ARKI. Los libros protegidos no se descargaron ni reprodujeron.

| Tipo | Referencia candidata | Uso previsto y estado |
|---|---|---|
| Texto de curso | Hillier, F. S.; Lieberman, G. J., *Introduction to Operations Research*, 10.ª ed., McGraw-Hill, 2014 | Recomendado en Illinois y Lehigh; edición y datos tomados de los syllabi; no leído íntegramente |
| Texto de curso | Taha, H. A., *Operations Research: An Introduction*, 8.ª ed., Prentice-Hall, 2006 | Lectura adicional citada por Lehigh; no leído íntegramente |
| Texto de curso | Winston, W. L., *Operations Research: Applications and Algorithms*, 4.ª ed., Duxbury Press, 2003 | Lectura adicional citada por Lehigh; no leído íntegramente |
| Logística | Simchi-Levi, D.; Chen, X.; Bramel, J., *The Logic of Logistics: Theory, Algorithms, and Applications for Logistics and Supply Chain Management*, 2.ª ed., Springer, 2004 | Texto del curso MIT y fuente de preguntas públicas; solo se consultaron páginas públicas del curso, no el libro completo |
| IP | Nemhauser, G. L.; Wolsey, L. A., *Integer and Combinatorial Optimization*, Wiley, 1988 | Referencia listada en NEOS; no consultada en forma completa |
| IP | Schrijver, A., *Linear and Integer Programming*, Wiley, 1984 | Referencia listada en NEOS; no consultada en forma completa |
| IP | Wolsey, L. A., *Integer Programming*, Wiley, 1998 | Referencia listada en NEOS; no consultada en forma completa |
| Documentación primaria | NEOS Guide, “Linear Programming” e “Integer Programming” | Consultada públicamente; sirve para definiciones y métodos, no sustituye un curso completo |
| Documentación primaria | Google, *OR-Tools Optimization* | Consultada públicamente; sirve para APIs, clases de problemas y ejemplos oficiales |
| Estándar | ISO 19650-1/-2/-3/-4/-5 | Fichas y resúmenes oficiales consultados; el texto normativo completo requiere compra/licencia |
| Estándar | ISO 16739-1:2024, IFC Part 1: Data schema | Ficha y abstract oficiales consultados; el estándar completo requiere licencia |

## 7. Unknowns y preguntas para revisión humana

1. No se conoce el nivel actual de ARKI en cálculo, álgebra lineal, programación, estadística ni BIM; el diagnóstico inicial debe preceder a la asignación de curso.
2. No se conoce el entorno autorizado de ejecución, los solvers disponibles, sus licencias ni las restricciones de uso comercial.
3. No se conoce qué versiones IFC, MVD, herramientas de autoría o validadores emplea ARKI; la interoperabilidad debe probarse con un archivo de referencia concreto.
4. No se dispone de datos AEC reales con licencia de entrenamiento o evaluación; el proyecto propuesto debe empezar con datos sintéticos o cedidos explícitamente.
5. No se ha verificado una equivalencia entre el resultado de ningún solver y un requisito normativo local de edificación, accesibilidad, incendios, contratación o seguridad.
6. No se ha establecido qué métricas de calidad debe usar ARKI para reconocer objetos en nubes de puntos ni cuál es la tolerancia admisible en cada proyecto.
7. Las páginas universitarias consultadas son de años concretos y pueden cambiar; el currículo de ARKI debe versionarse y volver a verificarse antes de cada cohorte.
8. La ficha de Purdue consultada funciona como mapa general y advierte que no constituye información oficial detallada; por ello no se usa como evidencia principal de contenidos específicos.

## 8. Límites, seguridad y gobernanza

Un modelo determinístico produce una respuesta condicionada por su formulación. No descubre por sí mismo que una restricción falta, que una medición es errónea o que una solución viola una norma no codificada. La sensibilidad local no es una predicción de comportamiento fuera del rango analizado. Una heurística puede ser útil sin ser óptima. Un estado “optimal” del solver tampoco certifica que el modelo represente correctamente el proyecto.

No debe usarse ARKI para aprobar estructuras, rutas de evacuación, instalaciones críticas, selección de contratistas, presupuestos contractuales o decisiones de seguridad física sin revisión independiente y autoridad competente. En información BIM, deben minimizarse atributos sensibles, aplicar control de acceso, conservar historial de cambios y separar datos de entrenamiento de datos operativos. ISO 19650-5 exige un enfoque de seguridad a lo largo del ciclo de vida; este currículo lo convierte en una condición de laboratorio, no en una certificación de cumplimiento. [5]

La ingestión de libros, normas completas, modelos de clientes o documentación propietaria solo puede hacerse con permiso, base legal, control de acceso y registro de procedencia. La bibliografía no demuestra conocimiento aprendido. El estado `READY_FOR_HUMAN_REVIEW` significa que el diseño está listo para revisión experta, no que ARKI haya superado los cursos.

## 9. Fuentes públicas consultadas

[1]: https://ocw.mit.edu/courses/esd-273j-logistics-and-supply-chain-management-fall-2009/ "MIT OpenCourseWare, Logistics and Supply Chain Management"
[2]: https://csm.rowan.edu/departments/math/_docs/Syllabi/deterministic-models-in-operations-research-03411.pdf "Rowan University, Math 03.411 Deterministic Models in Operations Research syllabus"
[3]: https://ws.engr.illinois.edu/courses/getfile.asp?id=806 "University of Illinois, IE 310 Deterministic Models in Optimization syllabus"
[4]: https://engineering.lehigh.edu/sites/engineering.lehigh.edu/files/_DEPARTMENTS/ise/pdf/syllabus_ISE240_2019Fall.pdf "Lehigh University, ISE 240 Introduction to Deterministic Models in Operations Research syllabus"
[5]: https://www.iso.org/standard/74206.html "ISO 19650-5:2020, Security-minded approach to information management"
[6]: https://www.iso.org/standard/84123.html "ISO 16739-1:2024, Industry Foundation Classes (IFC) Part 1: Data schema"
[7]: https://technical.buildingsmart.org/standards/ifc/ "buildingSMART International, Industry Foundation Classes (IFC) introduction"
[8]: https://neos-guide.org/guide/types/lp/ "NEOS Guide to Optimization, Linear Programming"
[9]: https://neos-guide.org/guide/types/integer/ "NEOS Guide to Optimization, Integer Programming"
[10]: https://developers.google.com/optimization "Google OR-Tools, Optimization documentation"
[11]: https://www.nist.gov/publications/automatic-reconstruction-built-building-information-models-laser-scanned-point-clouds "NIST, Automatic Reconstruction of As-Built Building Information Models from Laser-Scanned Point Clouds"
[12]: https://ocw.mit.edu/courses/esd-273j-logistics-and-supply-chain-management-fall-2009/pages/syllabus/ "MIT OpenCourseWare, ESD.273J syllabus"
[13]: https://ocw.mit.edu/courses/esd-273j-logistics-and-supply-chain-management-fall-2009/pages/lecture-notes/ "MIT OpenCourseWare, ESD.273J public lecture notes"
[14]: https://ocw.mit.edu/courses/esd-273j-logistics-and-supply-chain-management-fall-2009/pages/assignments/ "MIT OpenCourseWare, ESD.273J public assignments"
[15]: https://www.iso.org/sectors/building-construction/building-information-modelling "ISO, Building information modelling (BIM) standards overview"

**Nota de verificación:** las URLs anteriores son las fuentes públicas consultadas el 2026-09-21. Las fichas ISO muestran metadatos, abstracts o resúmenes; no se trató de acceder ni reproducir el texto completo de las normas protegidas.

## 10. Decisión solicitada al revisor humano

Antes de declarar el currículo operativo, el revisor debe aprobar: (a) prerrequisitos y diagnóstico; (b) solver y licencias; (c) dataset BIM y licencia; (d) versión IFC/MVD; (e) panel de evaluación y umbrales; (f) reglas de seguridad, retención y eliminación; y (g) los casos de uso AEC que quedan expresamente fuera de alcance. Tras esa revisión puede emitirse una versión numerada del currículo y comenzar una cohorte piloto con datos sintéticos.

**Estado final:** `READY_FOR_HUMAN_REVIEW`.

**Resumen de cobertura:** fundamentos matemáticos, formulación, LP, dualidad, sensibilidad, redes, IP/MILP, NLP básico, programación dinámica, inventarios, logística, laboratorio, proyecto AEC/BIM, IFC, seguridad de información, evaluación, unknowns y límites.

**Criterio global de paso:** ARKI solo puede declararse competente cuando supera los hitos cuantitativos, entrega un proyecto reproducible y defendible, comunica incertidumbre y obtiene aprobación humana en los dominios AEC/BIM y seguridad pertinentes.

**Autor:** Manus AI
**Fecha de corte:** 2026-09-21
**Estado:** `READY_FOR_HUMAN_REVIEW`
