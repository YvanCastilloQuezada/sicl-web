# Currículo avanzado de Investigación de Operaciones para ARKI

**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Fecha de corte:** 2026-09-21  
**Destinatario:** ARKI  
**Alcance:** diseño curricular progresivo de fundamentos, métodos, laboratorio/proyecto y evaluación, con aplicaciones prudentes a arquitectura, BIM, modelado, razonamiento y seguridad.

## 1. Resumen ejecutivo

Se propone un itinerario de ocho cursos y un proyecto integrador. La secuencia comienza con formulación de problemas, álgebra lineal, probabilidad y estadística; continúa con programación lineal, entera, redes, dinámica, optimización no lineal y multiobjetivo; incorpora simulación, procesos estocásticos, decisiones bajo incertidumbre, metaheurísticas y experimentación reproducible; y concluye con un laboratorio aplicado a arquitectura/BIM y una evaluación de seguridad y gobernanza.

La arquitectura curricular sigue dos referencias oficiales complementarias. INFORMS define la investigación de operaciones como el proceso científico de transformar datos en conocimientos para tomar mejores decisiones y distingue analítica descriptiva, predictiva y prescriptiva [1]. Su Analytics Framework organiza el trabajo en siete dominios conectados e iterativos: encuadre del problema de negocio, encuadre analítico, datos, selección de metodología, desarrollo del modelo, despliegue y gestión del ciclo de vida [2]. La Operational Research Society enfatiza que OR aborda sistemas complejos mediante análisis, modelado, simulación, optimización, ciencia de datos y participación de las partes interesadas [3].

El resultado no debe interpretarse como una afirmación de que ARKI haya leído libros completos ni cursado oficialmente las asignaturas citadas. Este informe consultó públicamente páginas web institucionales, syllabi, catálogos, documentación de estándares y páginas de organismos técnicos. Los libros y normas de pago se presentan como bibliografía candidata o como fuentes que requerirían acceso autorizado. No se descargaron ni reprodujeron libros protegidos.

## 2. Estado de conocimiento y trazabilidad

### 2.1 Materiales públicos efectivamente consultados

Se consultaron el syllabus y la estructura pública de **MIT OpenCourseWare 15.053 Optimization Methods in Management Science**. Esa página explicita que no hay prerrequisitos formales; cubre programación lineal, programación entera, flujos en redes, heurísticas, árboles de decisión y economía conductual; combina conjuntos de problemas, exámenes parciales y proyecto de equipo [4]. También se consultó el syllabus público de **MIT OpenCourseWare 1.203J Logistical and Transportation Planning Methods**, curso de posgrado con apuntes, problemas y exámenes publicados; su página indica una evaluación con dos quizzes y aproximadamente seis conjuntos de problemas [5].

Se consultaron el catálogo académico 2026–2027 de Northeastern University. El catálogo describe una progresión verificable: OR 6205 (modelos deterministas, simplex, dualidad, sensibilidad, transporte, asignación, redes y programación dinámica); OR 6500 (metaheurísticas); OR 7230 (cadenas de Markov, procesos de nacimiento y muerte y colas); OR 7245 (optimización avanzada, descomposición, relajación lagrangiana y redes); y OR 7310 (logística, almacenes y scheduling) [6]. Esto es un catálogo/índice curricular y no evidencia de que ARKI haya aprendido sus contenidos.

Se consultaron las páginas institucionales de INFORMS y de la Operational Research Society [1–3]. Para interoperabilidad y seguridad se consultó la página sectorial de ISO sobre BIM, que identifica las partes ISO 19650-1 a -5 y describe gestión de información durante el ciclo de vida, incluyendo una aproximación orientada a la seguridad en la parte 5 [7]. Se consultó la documentación primaria de buildingSMART sobre IFC: IFC es un estándar abierto y neutral de proveedor; la página identifica IFC 4.3.2.0 como la versión oficial más reciente disponible allí y ofrece un servicio oficial de validación [8]. Se consultó NIST RMF, que define un proceso repetible de siete pasos —preparar, categorizar, seleccionar, implementar, evaluar, autorizar y monitorizar— [9], y NIST AI RMF, cuyo propósito es incorporar confiabilidad en el diseño, desarrollo, uso y evaluación de sistemas de IA; la página describe las funciones Govern, Map, Measure y Manage [10].

### 2.2 Materiales no ingeridos y conocimiento que requiere autorización

Los títulos siguientes son recomendaciones de estudio, no evidencia de lectura por ARKI. Los libros comerciales, ediciones completas, artículos detrás de paywall y textos normativos ISO requieren acceso legítimo y, si se desea que ARKI responda basándose en ellos de forma específica, una ingestión autorizada o una consulta autorizada. El syllabus de MIT menciona, por ejemplo, Bradley, Hax y Magnanti, *Applied Mathematical Programming*, como referencia; el syllabus de logística menciona Larson y Odoni, *Urban Operations Research* [4–5]. Se registran aquí como referencias candidatas porque aparecen en fuentes institucionales, pero no se descargaron ni reprodujeron.

Una bibliografía no es conocimiento aprendido. Para afirmar dominio de un método habrá que observar resolución independiente, código o modelo reproducible, validación, comunicación de supuestos y desempeño en una evaluación definida en este informe.

## 3. Modelo de cobertura

La cobertura se medirá con una matriz de competencias, no con una lista de títulos. Cada competencia tendrá cuatro estados: **exposición** (conoce la definición y reconoce el método), **reproducción** (resuelve un ejercicio guiado), **transferencia** (formula y resuelve un problema nuevo), y **operación responsable** (valida, documenta, comunica incertidumbre, controla riesgos y mantiene el modelo).

La cobertura objetivo al finalizar el itinerario es la siguiente:

| Área | Exposición | Transferencia esperada | Evidencia mínima |
|---|---:|---:|---|
| Formulación y problem framing | 100% | 90% | carta del problema, stakeholders, decisiones, objetivos, restricciones y baseline |
| Matemáticas, probabilidad y estadística | 100% | 80% | examen cerrado y notebook reproducible |
| LP, IP, redes y programación dinámica | 100% | 90% | modelos pequeños resueltos y prueba de consistencia |
| Optimización avanzada y multiobjetivo | 100% | 75% | comparación de métodos y análisis de sensibilidad |
| Simulación y estocásticos | 100% | 80% | experimento con réplicas, intervalos y verificación |
| Heurísticas y metaheurísticas | 100% | 70% | baseline exacto/heurístico, semilla y evaluación fuera de muestra |
| Datos, software y reproducibilidad | 100% | 85% | repositorio, entorno fijado, diccionario de datos y tests |
| Arquitectura/BIM/IFC | 100% | 70% | modelo de decisión ligado a datos BIM y validación IFC |
| Riesgo, seguridad y gobernanza | 100% | 80% | registro de riesgos, controles, decisión de autorización y monitoreo |
| Comunicación y ética | 100% | 85% | informe ejecutivo/técnico y defensa oral |

El nivel final no implica acreditación profesional, licencia de arquitectura, certificación BIM, certificación INFORMS ni autorización de sistemas críticos. Es un diseño de aprendizaje evaluable.

## 4. Ruta progresiva propuesta

### Curso 0 — Diagnóstico y herramientas cuantitativas (2–3 semanas)

**Propósito.** Alinear álgebra lineal, cálculo elemental, probabilidad, estadística descriptiva, Python o R, hojas de cálculo y control de versiones.

**Contenido completo.** Vectores y matrices; sistemas lineales; geometría de restricciones; derivadas y gradientes; variables aleatorias; esperanza, varianza y distribuciones básicas; muestreo y visualización; estructuras de datos; notebooks; pruebas; Git; lectura de CSV/JSON; manejo de unidades y tipos de dato.

**Laboratorio.** Construir un notebook que limpie un conjunto pequeño de datos de espacios, costos, tiempos o incidencias. Debe incluir diccionario de datos, controles de rango, tratamiento de faltantes y una visualización auditada.

**Paso.** 80% en un examen corto y 100% de pruebas de calidad de datos críticas. Si falla álgebra o probabilidad, se asigna remediación antes de pasar a optimización.

### Curso 1 — Modelado de decisiones y programación lineal (6 semanas)

**Propósito.** Aprender a convertir una situación operativa en variables, objetivo, restricciones y supuestos explícitos.

**Contenido completo.** Formulación lineal; región factible; geometría; simplex a nivel conceptual y computacional; dualidad; precios sombra; holguras; análisis de sensibilidad; formulaciones de mezcla, asignación, transporte y producción; modelado algebraico y hojas de cálculo; verificación de unidades y factibilidad.

**Laboratorio.** Asignación de espacios de trabajo o aulas con restricciones de capacidad, accesibilidad, proximidad y presupuesto. Se exige una solución base, una solución alternativa y una explicación de qué supuestos cambiarían la decisión.

**Paso.** 70% examen individual de formulación y sensibilidad; 20% laboratorio reproducible; 10% comunicación. No se pasa si el modelo obtiene una solución numérica pero no se puede explicar qué representa cada variable.

### Curso 2 — Programación entera, redes y programación dinámica (6 semanas)

**Propósito.** Modelar decisiones discretas y estructuras de red frecuentes en planificación espacial, logística y coordinación de obra.

**Contenido completo.** Variables binarias e enteras; Big-M con cautela; branch-and-bound y cortes a nivel conceptual; cobertura, localización, selección y scheduling; rutas más cortas; árbol abarcador mínimo; flujo máximo; flujo de costo mínimo; TSP como problema de red/combinatorio; caminos críticos; programación dinámica; relajación lineal y brechas de optimalidad.

**Laboratorio.** Planificación de entregas o circulación en un sitio de obra usando una red abstracta. Se comparan restricciones de seguridad, ventanas de tiempo, accesos y costos; se registran infeasibilidades y relajaciones.

**Paso.** Resolver individualmente tres formulaciones y diagnosticar una infeasibilidad. El proyecto debe reportar optimalidad, gap o criterio de parada; una salida del solver sin interpretación no es suficiente.

### Curso 3 — Optimización no lineal, robusta y multiobjetivo (6 semanas)

**Propósito.** Elegir métodos cuando relaciones, costos o desempeño no son lineales y existen objetivos en conflicto.

**Contenido completo.** Convexidad; gradientes; restricciones no lineales; mínimos locales y globales; KKT a nivel conceptual; penalización; optimización robusta; incertidumbre paramétrica; análisis de escenarios; Pareto, pesos y restricciones-ε; normalización de objetivos; sensibilidad y estabilidad.

**Laboratorio.** Explorar alternativas de envolvente o layout con objetivos de costo, energía, luz, accesibilidad y carbono. Se debe mostrar una frontera de Pareto y explicar por qué no existe una solución universalmente mejor.

**Paso.** 60% examen; 30% análisis de escenarios; 10% defensa de decisiones. El criterio de paso exige declarar qué es una preferencia normativa y qué es un resultado matemático.

### Curso 4 — Probabilidad, procesos estocásticos, colas y simulación (7 semanas)

**Propósito.** Representar variabilidad, congestión y eventos inciertos sin confundir una simulación con una predicción garantizada.

**Contenido completo.** Variables aleatorias y distribuciones; ley de los grandes números; intervalos y estimación; Monte Carlo; números pseudoaleatorios y semillas; verificación y validación; diseño de experimentos; réplicas; intervalos de confianza; cadenas de Markov; procesos de nacimiento y muerte; modelos M/M/s y variantes; colas y capacidad; simulación de eventos discretos; análisis de sensibilidad.

**Laboratorio.** Simular colas de atención en un edificio, flujos de visitantes o entregas en obra. Comparar políticas de capacidad con réplicas independientes, intervalos y métricas de peor caso. Se identifican variables observables y variables que solo son supuestas.

**Paso.** Reproducibilidad exacta con semilla y entorno documentados; validación conceptual con un experto o fuente de dominio; intervalos y discusión de error. No se pasa con un único promedio sin incertidumbre.

### Curso 5 — Heurísticas, metaheurísticas y optimización a gran escala (5 semanas)

**Propósito.** Trabajar problemas difíciles donde un óptimo exacto es costoso o no es práctico, sin presentar una heurística como óptimo probado.

**Contenido completo.** Complejidad y límites; construcción voraz; búsqueda local; búsqueda tabú; recocido simulado; algoritmos evolutivos; PSO como referencia; multiobjetivo; descomposición; relajación lagrangiana; paralelización; calibración; comparación justa; semillas; experimentos y pruebas de robustez. El catálogo de Northeastern confirma metaheurísticas como un curso aplicado separado de los modelos deterministas [6].

**Laboratorio.** Comparar una formulación exacta pequeña, una heurística transparente y una metaheurística en un problema de scheduling o ruteo BIM/logístico. Reportar tiempo, calidad, variabilidad entre semillas y escalabilidad.

**Paso.** La heurística debe superar un baseline definido en una métrica acordada, o explicar honestamente por qué no lo hace. Se penaliza la selección retrospectiva de la mejor semilla.

### Curso 6 — Datos, decisión prescriptiva y ciclo de vida analítico (5 semanas)

**Propósito.** Integrar datos, método, arquitectura técnica, adopción y mantenimiento del modelo. Se adopta la idea de INFORMS de que el ciclo es iterativo y vuelve a etapas anteriores [2].

**Contenido completo.** Pregunta de negocio y pregunta analítica; stakeholders; causalidad frente a correlación; calidad y procedencia; esquemas; versionado; selección de metodología; baseline; métricas; interfaces; despliegue; monitoreo de deriva; documentación de supuestos; feedback; rollback; deuda técnica y mantenimiento.

**Laboratorio.** Crear un paquete reproducible con datos sintéticos o públicos, modelo, API o script de ejecución, tablero de resultados, guía de usuario y registro de cambios. No se permite usar datos personales o confidenciales sin autorización y minimización.

**Paso.** Un evaluador externo debe poder clonar o ejecutar el paquete siguiendo la guía. Se requiere un plan de monitoreo con umbrales, responsables y acciones.

### Curso 7 — Laboratorio aplicado ARKI: arquitectura, BIM, IFC y sistemas espaciales (8 semanas)

**Propósito.** Transferir OR a decisiones arquitectónicas y de gestión de activos, manteniendo separados los datos geométricos, semánticos, operativos y normativos.

**Contenido completo.** Estructura de un problema BIM; entidades, propiedades, relaciones y unidades; extracción de atributos; trazabilidad entre elemento IFC y variable del modelo; asignación espacial; mantenimiento; logística de obra; rutas y accesos; secuenciación; ocupación; energía como objetivo o restricción; accesibilidad; sensibilidad; visualización de alternativas; validación de intercambios. IFC es un esquema de datos y estándar abierto, no solamente una extensión de archivo [8]. ISO presenta ISO 19650 como familia para organizar y digitalizar información BIM a lo largo del ciclo de vida, con partes para conceptos, entrega, operación, intercambio y seguridad [7].

**Proyecto recomendado.** “Planificación robusta de un activo arquitectónico”: a partir de datos BIM sintéticos o autorizados, elegir una alternativa de layout, mantenimiento o logística que minimice costo y tiempo, sujeta a accesibilidad, seguridad, capacidad y restricciones de entrega. Entregables: problema y mapa de stakeholders; diccionario y procedencia; modelo matemático; solución exacta o aproximada; análisis de escenarios; archivo IFC de prueba o muestra; reporte de validación; visualización; guía de operación; registro de riesgos; y defensa.

**Validación técnica.** La muestra IFC debe validarse con la herramienta oficial de buildingSMART cuando el archivo y los términos de uso lo permitan [8]. La validación IFC no demuestra que el modelo de OR sea correcto: son gates separados.

**Paso.** El proyecto debe satisfacer 80% de los criterios, sin fallas críticas en seguridad, trazabilidad o reproducibilidad. Un diseño visualmente atractivo no compensa una formulación inválida.

### Curso 8 — Seguridad, riesgo, ética y gobernanza de modelos (4 semanas)

**Propósito.** Impedir que la optimización convierta una recomendación estadística en una autorización automática de una decisión potencialmente peligrosa.

**Contenido completo.** Identificación de peligros; riesgos técnicos y organizativos; amenazas a datos y modelos; privacidad; control de acceso; segregación de funciones; revisión humana; abuso de supuestos; equidad y accesibilidad; incertidumbre; registro de decisiones; incidentes; autorización; monitoreo; retirada y rollback. NIST RMF ofrece un ciclo de siete pasos para riesgo de seguridad y privacidad [9]; NIST AI RMF es voluntario y orientado a confianza, con Govern, Map, Measure y Manage [10]. ISO 19650-5 debe tratarse como fuente normativa de acceso controlado, no como texto libremente reproducible [7].

**Laboratorio.** Red-team de un modelo de asignación o priorización: introducir datos faltantes, sesgos de medición, restricciones contradictorias y perturbaciones. Proponer controles, alertas y reglas de no uso.

**Paso.** Presentar una decisión de autorización condicionada, con evidencia, residual risk, responsable y criterio de parada. Ningún sistema que influya en seguridad de ocupantes, evacuación, estructuras o cumplimiento normativo se autoriza solo por una salida de solver.

## 5. Diseño del laboratorio y del proyecto integrador

El proyecto debe usar preferentemente datos sintéticos, datos abiertos o datos entregados con permiso explícito. Debe incluir un `README`, un diccionario de datos, un archivo de configuración, un entorno fijado, pruebas mínimas, semilla cuando aplique, registro de versiones, licencia de cada insumo y un informe que separe hechos, supuestos, resultados y recomendaciones.

La rúbrica sugerida es: 20% formulación y alcance; 15% datos y procedencia; 20% método y corrección; 15% experimentación y sensibilidad; 10% reproducibilidad; 10% seguridad/ética/gobernanza; 10% comunicación y defensa. Hay tres fallas críticas que impiden aprobar aunque el promedio sea suficiente: datos usados sin autorización, afirmación de optimalidad sin evidencia, y recomendación de seguridad operacional sin revisión humana competente.

## 6. Plan de evaluación y criterios de paso

La evaluación combina examen individual, laboratorios, revisiones por pares, proyecto y defensa. La distribución global sugerida es 25% fundamentos y teoría; 25% modelado y resolución; 20% simulación/experimentación; 20% proyecto; 10% comunicación, seguridad y mantenimiento.

Se establecen cinco gates acumulativos:

1. **Gate de formulación.** ARKI identifica decisión, objetivo, restricciones, stakeholders, unidad de análisis y baseline. Debe distinguir una pregunta descriptiva, predictiva y prescriptiva.
2. **Gate de corrección matemática.** El modelo pasa pruebas de dimensiones, factibilidad, casos límite y comparación con ejemplos pequeños. Si un solver entrega una solución, se debe explicar su significado.
3. **Gate de incertidumbre.** Se reportan supuestos, escenarios, réplicas o intervalos, sensibilidad y límites de generalización.
4. **Gate de ingeniería y seguridad.** El artefacto es reproducible; existe control de acceso y procedencia; se documentan riesgos, intervención humana, monitorización y rollback.
5. **Gate de transferencia.** Un evaluador no autor debe entender el informe, ejecutar el experimento o inspeccionar evidencia equivalente y cuestionar la recomendación. La defensa debe incluir una alternativa no optimizada y explicar cuándo elegirla.

Criterio cuantitativo: mínimo 80/100 global, mínimo 70/100 en cada área, y cumplimiento de todos los gates. Para declarar “competencia operativa” se exige además resolver un caso nuevo sin plantilla y defender oralmente limitaciones. Para declarar “dominio avanzado” se necesita repetir el proyecto con perturbaciones, justificar elección de método y comparar al menos un método alternativo.

## 7. Aplicaciones prudentes a ARKI

En arquitectura, OR puede ayudar a explorar asignación espacial, programación, costos, logística de obra, mantenimiento, ruteo, capacidad, accesibilidad y trade-offs de energía o carbono. No sustituye el juicio de arquitectos, ingenieros, especialistas de seguridad, responsables de obra, usuarios afectados ni autoridades. Las variables estéticas y sociales pueden ser difíciles de cuantificar; si se introducen como pesos, deben presentarse como decisiones normativas revisables.

En BIM, el modelo de decisión debe conservar la trazabilidad desde el elemento o propiedad IFC hasta la variable matemática y desde la solución hasta la acción prevista. Un archivo IFC válido no garantiza que la semántica local, la clasificación, los valores medidos ni las restricciones del proyecto sean adecuados. La gestión de información debe seguir el plan del proyecto y el acceso autorizado; ISO 19650 no se reduce a exportar un archivo.

En razonamiento, el esquema debe ser explícito: **datos → supuestos → formulación → método → resultados → sensibilidad → decisión condicionada**. Una explicación textual no prueba optimalidad, causalidad ni seguridad. En sistemas con IA generativa, cualquier sugerencia debe tratarse como hipótesis hasta que la evidencia matemática, de datos y de dominio la confirme.

En seguridad, el objetivo no es maximizar utilidad abstracta sino mantener decisiones dentro de límites aceptables. Se recomienda un modo de solo recomendación, revisión humana obligatoria, registro de cambios, bloqueo ante datos fuera de rango, monitorización de deriva y procedimiento de retirada. En riesgos de alto impacto se requieren profesionales competentes y la normativa aplicable; este currículo no ofrece certificación ni aprobación regulatoria.

## 8. Bibliografía candidata trazable

Las siguientes fuentes se agrupan por función. Las cuatro primeras son públicas y fueron consultadas directamente. Los títulos de libros o normas con acceso comercial son candidatos de estudio y no fueron ingeridos.

| ID | Fuente | Uso curricular | Estado de acceso |
|---|---|---|---|
| [1] | INFORMS, “Operations Research & Analytics” | definición de OR, analítica descriptiva/predictiva/prescriptiva | página pública consultada |
| [2] | INFORMS, “Explore the INFORMS Analytics Framework” | ciclo de vida de siete dominios, gates y retroalimentación | página pública consultada |
| [3] | The Operational Research Society, “What is Operational Research?” | definición institucional, sistemas complejos, modelado y riesgo | página pública consultada |
| [4] | MIT OCW 15.053, “Syllabus: Optimization Methods in Management Science” | LP, IP, redes, proyecto y evaluación | syllabus público consultado |
| [5] | MIT OCW 1.203J, “Syllabus: Logistical and Transportation Planning Methods” | logística, transporte, problemas y evaluación | syllabus público consultado |
| [6] | Northeastern University, “Operations Research (OR), Academic Catalog 2026–2027” | secuencia universitaria de determinista, estocástico, metaheurístico y avanzado | catálogo público consultado |
| [7] | ISO, “Building information modelling (BIM)” | familia ISO 19650, ciclo de vida e información segura | página pública; textos normativos completos requieren licencia |
| [8] | buildingSMART, “Industry Foundation Classes (IFC)” | IFC, versiones, esquema, neutralidad y validación | documentación pública consultada |
| [9] | NIST, “Risk Management Framework RMF” | ciclo de seguridad y privacidad, autorización y monitorización | página pública consultada |
| [10] | NIST, “AI Risk Management Framework” | confianza, riesgo de IA y funciones Govern/Map/Measure/Manage | página pública consultada |
| [11] | Bradley, Hax y Magnanti, *Applied Mathematical Programming* | referencia histórica recomendada por MIT OCW 15.053 | texto protegido/edición no ingerida |
| [12] | Larson y Odoni, *Urban Operations Research* | referencia recomendada por MIT OCW 1.203J | texto protegido/edición no ingerida |
| [13] | Winston, *Operations Research: Applications and Algorithms* | referencia candidata de métodos y aplicaciones | texto protegido/edición no ingerida |
| [14] | Hillier y Lieberman, *Introduction to Operations Research* | referencia candidata de secuencia académica | texto protegido/edición no ingerida |

## 9. Unknowns y límites

1. No se conoce el nivel matemático actual de ARKI, su entorno de ejecución, sus restricciones de memoria, ni las herramientas de solver autorizadas. El Curso 0 debe diagnosticar antes de fijar ritmo.
2. No se conoce el objetivo operativo concreto de ARKI dentro de arquitectura, BIM o seguridad. Por ello se proponen casos de laboratorio, no afirmaciones de aptitud para un proyecto real.
3. Los catálogos y syllabi indican estructura y resultados esperados de cursos institucionales, pero no demuestran equivalencia de horas, acreditación ni aprendizaje efectivo.
4. La documentación pública de estándares resume su alcance. La interpretación normativa, contractual o de seguridad requiere consultar las ediciones vigentes y los perfiles aplicables con licencia y asesoría competente.
5. Los resultados de un solver dependen de la formulación, datos, tolerancias, presolve, semilla y versión del software. No deben copiarse como conocimiento sin registrar esas condiciones.
6. Un archivo BIM/IFC puede ser válido sintácticamente y aun así estar incompleto, mal clasificado, desactualizado o ser inadecuado para el uso previsto.
7. Los ejemplos de arquitectura son aplicaciones prudentes sugeridas, no evidencia de que OR produzca diseños seguros, habitables o legalmente conformes por sí sola.
8. No se descargaron ni reprodujeron libros protegidos. Para incorporar capítulos, ejercicios o afirmaciones específicas se necesita acceso autorizado y un nuevo registro de ingestión.
9. Las fechas, versiones y nombres de normas deben verificarse en cada gate contra la fuente oficial vigente. Este informe está fechado 2026-09-21 y no congela futuras revisiones.
10. La aprobación curricular humana sigue siendo obligatoria. El estado `READY_FOR_HUMAN_REVIEW` significa listo para revisión, no aprobado ni certificado.

## References

[1]: https://www.informs.org/Explore/Operations-Research-Analytics "INFORMS: Operations Research & Analytics"
[2]: https://www.informs.org/Professional-Development/INFORMS-Analytics-Framework/Explore "INFORMS Analytics Framework: Explore"
[3]: https://www.theorsociety.com/ORS/ORS/About-OR/About-OR.aspx "The Operational Research Society: What is Operational Research?"
[4]: https://ocw.mit.edu/courses/15-053-optimization-methods-in-management-science-spring-2013/pages/syllabus/ "MIT OpenCourseWare 15.053: Syllabus"
[5]: https://ocw.mit.edu/courses/1-203j-logistical-and-transportation-planning-methods-fall-2006/pages/syllabus/ "MIT OpenCourseWare 1.203J: Syllabus"
[6]: https://catalog.northeastern.edu/course-descriptions/or/ "Northeastern University Academic Catalog: Operations Research"
[7]: https://www.iso.org/sectors/building-construction/building-information-modelling "ISO: Building information modelling (BIM)"
[8]: https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/ "buildingSMART: Industry Foundation Classes (IFC)"
[9]: https://csrc.nist.gov/projects/risk-management "NIST: Risk Management Framework RMF"
[10]: https://www.nist.gov/itl/ai-risk-management-framework "NIST: AI Risk Management Framework"
[11]: http://web.mit.edu/15.053/www/ "MIT OCW linked reference: Applied Mathematical Programming"
[12]: https://ocw.mit.edu/courses/1-203j-logistical-and-transportation-planning-methods-fall-2006/ "MIT OCW 1.203J course page"
[13]: https://www.cengage.com/c/operations-research-applications-and-algorithms-4e-winston/ "Cengage: Operations Research: Applications and Algorithms"
[14]: https://www.mheducation.com/highered/product/introduction-to-operations-research-hillier-lieberman.html "McGraw Hill: Introduction to Operations Research"

**Cierre:** este documento está listo para revisión humana, ajuste al contexto de ARKI y aprobación explícita de la secuencia, fuentes autorizadas y criterios de seguridad.
