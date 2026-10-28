# Ciclo formativo avanzado de Modelos Computacionales para ARKI

**Fecha de corte:** 2026-09-21  
**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Propósito:** propuesta de ruta progresiva para que ARKI desarrolle competencia verificable en modelado computacional, con aplicaciones prudentes a arquitectura, BIM, geometría, razonamiento y seguridad.

## 1. Resumen ejecutivo

Este documento propone un ciclo de 12 cursos agrupados en cuatro capas: fundamentos, métodos de modelado y simulación, laboratorio/proyecto y evaluación/seguridad. La estructura se deriva de planes y guías públicas de Georgia Tech, University of Pittsburgh, Harvard Graduate School of Design, Old Dominion University, ACM/IEEE/AAAI, ISO, buildingSMART, NIST y NASA. No se presenta como un grado universitario existente ni como una transcripción de ninguno de esos programas. Es una **síntesis curricular propuesta** para ARKI.

La ruta prioriza cinco capacidades: (1) formular un fenómeno o sistema como modelo explícito; (2) implementar algoritmos y estructuras de datos con control numérico; (3) estimar incertidumbre, validar y reproducir resultados; (4) representar información de arquitectura y BIM sin confundir geometría, semántica y evidencia; y (5) razonar sobre riesgos, seguridad y límites de automatización. Georgia Tech articula modelado y simulación alrededor de matemáticas continuas y discretas, ciencias y computación, y enumera métodos numéricos, álgebra lineal, probabilidad, algoritmos y programación como preparación. [1] Pittsburgh organiza su programa de posgrado en métodos numéricos, computación científica/programación, cursos fuera de informática y matemáticas, concentración disciplinar, seminario, examen y defensa. [2] Harvard describe un curso introductorio de diseño computacional para arquitectura, paisaje y urbanismo que combina fundamentos conceptuales, talleres prácticos y un proyecto final. [3]

**Conclusión operativa:** ARKI no debería declarar que “aprendió” una bibliografía completa. La evidencia disponible demuestra consulta de páginas de programa, documentación pública y secciones extraídas de documentos oficiales. Los libros de texto y manuales comerciales incluidos aquí son **bibliografía candidata**, no materiales ingeridos. El conocimiento detallado que no aparece en las fuentes públicas consultadas requeriría una ingestión autorizada y trazable, o bien trabajo explícito de laboratorio y evaluación.

## 2. Modelo de cobertura y estado de conocimiento

### 2.1 Cobertura propuesta

La cobertura se expresa en cuatro niveles y en tres estados de evidencia:

| Nivel | Contenido | Evidencia mínima para ARKI |
|---|---|---|
| Fundamentos | Álgebra lineal, cálculo, ecuaciones diferenciales, probabilidad, estadística, estructuras discretas, programación, algoritmos y datos | Resolver ejercicios y explicar supuestos; código probado en repositorio reproducible |
| Métodos | Modelos deterministas y estocásticos, análisis numérico, optimización, simulación de eventos/discreta y continua, gráficos, datos y paralelismo | Comparar métodos, medir error y coste, documentar sensibilidad e incertidumbre |
| Dominio | Geometría computacional, diseño paramétrico, BIM/IFC, sistemas de información, arquitectura y urbanismo | Construir un modelo interoperable y justificar qué significa cada entidad y atributo |
| Ingeniería y evaluación | Verificación, validación, reproducibilidad, seguridad, gobernanza, comunicación y revisión | Informe de evidencia, pruebas adversariales y defensa oral/técnica |

Los estados deben permanecer separados:

1. **Consultado públicamente:** páginas curriculares oficiales, documentación abierta de IFC, la página ISO de BIM, el marco NIST AI RMF, el manual público de ingeniería de sistemas de NASA, la página NIST sobre reproducibilidad numérica y la guía pública CS2023. Se consultaron las páginas y, cuando la extracción estuvo disponible, las secciones pertinentes; no se descargaron ni reprodujeron libros protegidos.
2. **Propuesto para el currículo:** la secuencia, duración, ejercicios, proyectos y umbrales de aprobación de este informe. Es diseño pedagógico, no evidencia de una oferta institucional concreta.
3. **Requiere ingestión autorizada o práctica adicional:** capítulos completos de libros, apuntes cerrados, datasets privados, documentación de una organización concreta, APIs de software propietario y cualquier contenido que no esté explícitamente en las fuentes públicas consultadas.

### 2.2 Lo que este informe no afirma

No afirma que ARKI haya leído libros completos, cursado los programas citados, obtenido créditos, aprobado exámenes universitarios ni dominado todos los temas enumerados en un índice. Un índice o plan de estudios muestra alcance y expectativas de un programa; una bibliografía indica posibles materiales; ninguno demuestra aprendizaje. La demostración de competencia se reserva a artefactos, pruebas, replicación, revisión humana y defensa.

## 3. Ruta progresiva completa propuesta

Se propone una dedicación de 36 a 48 semanas, ajustable a la capacidad de ARKI. Cada curso incluye propósito, contenidos, laboratorio y evidencia de aprobación. Los nombres son propuestas internas y no deben confundirse con cursos oficiales de las universidades citadas.

### Capa I — Fundamentos

#### Curso 1. Formulación de problemas y pensamiento de sistemas

**Objetivo.** Transformar una pregunta de arquitectura, infraestructura o información en límites del sistema, variables, estados, entradas, salidas, supuestos y criterios de éxito.

**Contenidos.** Tipos de modelos; niveles de abstracción; causalidad frente a correlación; modelos conceptuales, matemáticos, computacionales y de datos; unidades y dimensionalidad; trazabilidad de requisitos; diagramas de estado y de flujo; nociones de modelo de información.

**Laboratorio.** Formular tres versiones del mismo problema: energía de un recinto, coordinación de elementos BIM y flujo de ocupación. Comparar qué se pierde y qué se gana con cada abstracción.

**Evidencia.** Un documento de requisitos y un modelo conceptual revisado por otra persona. No se acepta código sin supuestos explícitos.

#### Curso 2. Matemáticas para modelos computacionales

**Objetivo.** Usar el lenguaje matemático necesario para modelar variación, equilibrio, incertidumbre y restricciones.

**Contenidos.** Álgebra lineal, sistemas lineales, autovalores, cálculo diferencial e integral, ecuaciones diferenciales ordinarias, cálculo multivariable, probabilidad, estadística descriptiva e inferencial, muestreo y optimización básica.

**Laboratorio.** Implementar un sistema lineal, un integrador de una ecuación diferencial y una estimación de incertidumbre por muestreo. Comparar solución analítica, aproximada y error.

**Evidencia.** Cuaderno ejecutable y explicación escrita de estabilidad, condiciones de borde, unidades y fuentes de error.

#### Curso 3. Programación, algoritmos y estructuras de datos

**Objetivo.** Construir programas legibles, testeables y eficientes para transformar matemáticas y datos en cómputo verificable.

**Contenidos.** Control de flujo, funciones, módulos, tipos, objetos, pruebas unitarias, complejidad, listas, mapas, árboles, grafos, búsqueda, ordenamiento, recursión y manejo de errores. CS2023 identifica áreas de algoritmos, fundamentos de programación, ingeniería de software, datos, gráficos, matemáticas, paralelismo, seguridad y sistemas como parte del cuerpo de conocimiento; su guía también formula competencias de diseño, desarrollo, pruebas, evaluación y despliegue. [4]

**Laboratorio.** Analizar un grafo de dependencias de elementos de un modelo; detectar ciclos, rutas críticas y entidades huérfanas.

**Evidencia.** Repositorio con pruebas, complejidad documentada, revisión de código y casos negativos.

### Capa II — Métodos de modelado y simulación

#### Curso 4. Análisis numérico y control del error

**Objetivo.** Elegir y usar métodos numéricos sin presentar una salida numérica como verdad física.

**Contenidos.** Redondeo y punto flotante, condicionamiento, estabilidad, búsqueda de raíces, interpolación, integración y diferenciación numérica, sistemas lineales, mínimos cuadrados, ecuaciones diferenciales y convergencia.

**Laboratorio.** Resolver el mismo problema con dos métodos y varias precisiones. Registrar error absoluto, relativo, sensibilidad al paso y comportamiento ante datos mal condicionados.

**Evidencia.** Informe de comparación y prueba de regresión numérica. NIST señala que el paralelismo, las precisiones bajas, las bibliotecas, compiladores, arquitecturas y el orden de operaciones pueden romper la reproducibilidad bit a bit. [5]

#### Curso 5. Modelos deterministas, dinámicos y basados en agentes

**Objetivo.** Seleccionar un paradigma que corresponda a la pregunta y distinguir simulación de predicción.

**Contenidos.** Sistemas dinámicos, ecuaciones diferenciales, modelos de estado, modelos discretos, autómatas, agentes, redes, Petri, Markov y dinámica de sistemas. ODU describe un curso oficial de ingeniería de modelos que presenta UML, grafos conceptuales, redes bayesianas, Markov, Petri, dinámica de sistemas y bond graphs, con un trabajo de implementación en equipo. [6]

**Laboratorio.** Comparar un modelo de ocupación basado en agentes con un modelo agregado de flujo; explicar diferencias y condiciones bajo las que no deben compararse.

**Evidencia.** Modelo ejecutable, diagrama de estados, calibración documentada y análisis de sensibilidad.

#### Curso 6. Probabilidad, inferencia, optimización y decisión

**Objetivo.** Razonar bajo incertidumbre y optimizar sin ocultar objetivos, restricciones ni sesgos.

**Contenidos.** Variables aleatorias, Bayes, Monte Carlo, intervalos, diseño experimental, regresión, clasificación, funciones objetivo, restricciones, optimización lineal y no lineal, multiobjetivo y análisis de trade-offs.

**Laboratorio.** Optimizar una propuesta de distribución espacial con objetivos de recorrido, iluminación y superficie, mostrando frontera de Pareto y casos donde el resultado cambia al variar pesos.

**Evidencia.** Cuaderno con semillas, partición de datos, baseline, métricas, incertidumbre y explicación de qué no puede concluirse.

#### Curso 7. Simulación computacional, rendimiento y visualización

**Objetivo.** Ejecutar simulaciones de manera eficiente y comunicar resultados sin convertir una visualización persuasiva en evidencia.

**Contenidos.** Simulación de eventos discretos y continua, muestreo, verificación de invariantes, perfiles de rendimiento, vectorización, paralelismo elemental, almacenamiento de resultados, visualización científica y comunicación de incertidumbre.

**Laboratorio.** Simular colas de acceso a un edificio y un proceso físico simple. Producir una visualización con bandas de incertidumbre y una versión reproducible sin interfaz gráfica.

**Evidencia.** Comparación de rendimiento, explicación de escalabilidad y paquete que otro operador pueda ejecutar desde cero.

### Capa III — Dominio arquitectura/BIM y razonamiento

#### Curso 8. Geometría computacional y diseño paramétrico

**Objetivo.** Manipular geometría y reglas de diseño de forma explícita y reversible.

**Contenidos.** Coordenadas, transformaciones, curvas y superficies, mallas, intersecciones, tolerancias, restricciones geométricas, parametrización, generación algorítmica y validación de geometría.

**Laboratorio.** Generar una familia de envolventes a partir de parámetros climáticos ficticios; detectar autointersecciones, degeneraciones y unidades inconsistentes.

**Evidencia.** Script paramétrico, conjunto de casos límite y registro de decisiones. La geometría generada no se interpreta por sí sola como cumplimiento normativo, constructibilidad o seguridad estructural.

#### Curso 9. BIM, semántica e interoperabilidad

**Objetivo.** Comprender que un modelo BIM contiene información estructurada sobre activos y procesos, no solo una forma 3D.

**Contenidos.** Identidad de entidades, propiedades, relaciones, unidades, clasificación, versiones, requisitos de información, intercambio, validación y trazabilidad. ISO presenta la familia ISO 19650 como marco para organizar, digitalizar e intercambiar datos durante el ciclo de vida, e incluye una parte sobre enfoque de seguridad de la información. [7] buildingSMART publica versiones oficiales de IFC con documentación HTML, EXPRESS, XSD/XML y OWL; la página consultada identifica IFC 4.3.2.0 como publicación oficial asociada a ISO 16739-1:2024 y distingue versiones en desarrollo, oficiales, retiradas y obsoletas. [8]

**Laboratorio.** Crear un subconjunto IFC pequeño para un espacio y sus elementos; validar tipos, relaciones, unidades y propiedades; documentar qué información se pierde en una conversión.

**Evidencia.** Archivo de intercambio, informe de validación, mapa de correspondencias y lista de campos desconocidos. No se permite presentar una exportación válida sintácticamente como validación de diseño o de obra.

#### Curso 10. Razonamiento sobre modelos y asistencia a decisiones

**Objetivo.** Usar lógica, reglas, grafos y probabilidades para consultar y revisar modelos sin atribuirles autoridad que no tienen.

**Contenidos.** Representación de conocimiento, ontologías ligeras, reglas de consistencia, consultas sobre grafos, razonamiento probabilístico, planificación, recuperación de evidencia y explicación de resultados.

**Laboratorio.** Construir un verificador de reglas para un modelo BIM: detectar espacio sin salida registrada, elemento sin unidad, relación incompatible o requisito sin evidencia. Separar hechos extraídos, inferencias y recomendaciones.

**Evidencia.** Suite de casos verdaderos, falsos y desconocidos; matriz de trazabilidad; explicación legible por un revisor.

### Capa IV — Laboratorio, ingeniería y evaluación

#### Curso 11. Verificación, validación y reproducibilidad

**Objetivo.** Demostrar que el código cumple lo especificado y que el modelo representa suficientemente el sistema para el uso previsto.

**Contenidos.** Requisitos verificables, pruebas unitarias y de integración, invariantes, casos de referencia, calibración, validación cruzada, análisis dimensional, sensibilidad, incertidumbre, configuración, datos, entornos y replicación.

**Laboratorio.** Elaborar un plan V&V para un modelo de energía o flujo. NASA distingue verificación de producto —demostrar conformidad con requisitos— y validación —confirmar que el producto verificado satisface expectativas de uso en su entorno previsto—. [9]

**Evidencia.** Matriz requisito-prueba-evidencia, informe de anomalías, réplica independiente y declaración de límites.

#### Curso 12. Seguridad, gobernanza y proyecto integrador

**Objetivo.** Integrar método, dominio y control de riesgos en un artefacto defendible.

**Contenidos.** Amenazas a datos y modelos, control de acceso, minimización de información sensible, integridad de archivos, procedencia, ataques a entradas, alucinación y automatización excesiva, revisión humana, incidentes, rollback y gestión del ciclo de vida. NIST AI RMF propone una gestión voluntaria del riesgo para incorporar confianza en diseño, desarrollo, uso y evaluación, y organiza su núcleo en Govern, Map, Measure y Manage. [10]

**Proyecto.** Diseñar un flujo de apoyo a una decisión arquitectónica o BIM. El flujo debe: recibir requisitos explícitos; producir un modelo o análisis; exponer supuestos; generar evidencia; validar entradas y salidas; degradar de forma segura ante información faltante; y permitir revisión humana.

**Evidencia.** Repositorio versionado, informe técnico, conjunto de datos sintético o autorizado, modelo interoperable, pruebas, evaluación de riesgos, demostración y defensa oral. El proyecto no puede operar sobre datos confidenciales reales sin autorización y controles definidos.

## 4. Laboratorio común y prácticas de trabajo

Cada curso debe conservar un cuaderno de laboratorio con versión del código, dependencias, semillas aleatorias, unidades, datos de entrada, parámetros, resultados, errores conocidos y fecha de ejecución. La estructura mínima del repositorio es `README`, `src`, `tests`, `data` o manifiesto de procedencia, `experiments`, `results`, `docs` y un archivo de entorno. Los resultados deben poder regenerarse sin depender de una captura de pantalla.

Para arquitectura y BIM se recomienda comenzar con geometría sintética y modelos de juguete. Los datos de edificios reales pueden revelar ubicaciones, sistemas, vulnerabilidades, patrones de ocupación o información propietaria. La aplicación prudente exige separar datos públicos, datos de prueba, datos autorizados y datos no disponibles. La exportación a IFC debe acompañarse de una declaración de versión, esquema, herramienta, pérdida conocida y validaciones ejecutadas.

## 5. Plan de evaluación

La evaluación combina pruebas de fundamento, laboratorios, revisión de código, replicación y defensa. No se asigna una calificación de dominio solo porque ARKI pueda producir una respuesta textual.

| Componente | Peso orientativo | Evidencia |
|---|---:|---|
| Fundamentos matemáticos y algorítmicos | 20% | Prueba escrita/oral y ejercicios implementados |
| Laboratorios de métodos | 20% | Comparación numérica, error, sensibilidad, rendimiento |
| Dominio arquitectura/BIM | 15% | Modelo semántico, interoperabilidad y trazabilidad |
| Reproducibilidad y V&V | 15% | Réplica independiente y matriz de requisitos |
| Proyecto integrador | 20% | Artefacto ejecutable, informe y demostración |
| Seguridad, límites y comunicación | 10% | Threat model, casos de fallo y defensa |

**Condición de aprobación.** Se recomienda una puntuación global mínima de 80/100, sin componente individual inferior a 70/100, además de aprobar todos los criterios de seguridad. Un resultado que no reproduce su salida, oculta incertidumbre, mezcla hechos con inferencias o usa datos no autorizados no puede aprobar aunque su visualización sea convincente.

## 6. Verification gates y criterios de paso

1. **Gate de formulación:** el problema tiene objetivo, alcance, variables, supuestos, unidades, entradas, salidas, usuarios y criterio de éxito. Pasa solo con revisión humana.
2. **Gate matemático:** las ecuaciones o reglas están definidas y se comprueba al menos un caso analítico, límite o referencia.
3. **Gate algorítmico:** el código tiene pruebas, manejo de errores, complejidad razonable y casos adversariales.
4. **Gate numérico:** se reportan convergencia, condicionamiento, precisión, sensibilidad y tolerancias pertinentes.
5. **Gate de datos:** cada dato tiene procedencia, licencia o autorización, esquema, versión y tratamiento de información sensible.
6. **Gate BIM/interoperabilidad:** el intercambio declara versión IFC u otro formato, validación aplicada, pérdidas conocidas y campos no interpretados.
7. **Gate V&V:** existe matriz requisito-prueba-evidencia y se diferencian verificación y validación.
8. **Gate de reproducibilidad:** una ejecución limpia por un segundo operador produce resultados equivalentes dentro de tolerancias documentadas.
9. **Gate de seguridad:** se identifican amenazas, permisos, superficies de entrada, abuso plausible, controles, monitoreo y procedimiento de rollback.
10. **Gate de comunicación:** el informe diferencia observación, cálculo, inferencia, recomendación y desconocimiento; no presenta una simulación como garantía de comportamiento real.
11. **Gate de defensa:** ARKI puede explicar por qué eligió el paradigma, qué cambiaría al variar supuestos y cuándo debe abstenerse de responder.

## 7. Bibliografía candidata trazable

La siguiente lista se divide entre fuentes públicas consultadas y materiales candidatos. **La inclusión de un libro no implica lectura completa ni ingestión.** No se descargaron ni reprodujeron libros protegidos.

### Fuentes públicas consultadas

- Georgia Institute of Technology, *Modeling & Simulation* — página oficial con preparación, objetivos, cursos requeridos y resultados de habilidades. [1]
- University of Pittsburgh, *Computational Modeling & Simulation, MS*, catálogo 2025–2026 — requisitos de métodos numéricos, programación científica, concentración, seminario, examen y defensa. [2]
- Harvard Graduate School of Design, *Introduction to Computational Design*, Fall 2021 — descripción oficial de diseño computacional aplicado a arquitectura, paisaje y urbanismo. [3]
- ACM, IEEE Computer Society y AAAI, *Computer Science Curricula 2023, Version Beta* — guía curricular pública y áreas de conocimiento. [4]
- NIST, *Numerical Reproducibility* — factores que afectan reproducibilidad numérica y cuantificación de incertidumbre. [5]
- Old Dominion University, *Modeling and Simulation Engineering* y descripción de *Model Engineering* — página oficial de programa y curso. [6]
- ISO, *Building information modelling (BIM)* — panorama oficial de ISO 19650-1 a ISO 19650-5 y gestión de información/seguridad. [7]
- buildingSMART International, *IFC Specifications Database* — versiones, documentación y estado de IFC. [8]
- NASA, *NASA Systems Engineering Handbook, SP-2016-6105 Rev. 2* — procesos de requisitos, verificación, validación, integración y gestión de riesgo. [9]
- NIST, *AI Risk Management Framework* — marco público para gobernar, mapear, medir y gestionar riesgos de IA. [10]

### Materiales candidatos para una fase autorizada

- Un texto universitario de álgebra lineal, cálculo, ecuaciones diferenciales, probabilidad y análisis numérico elegido por el responsable académico; debe fijarse título, autor, licencia y edición antes de cualquier ingestión.
- Un manual universitario de métodos numéricos con ejercicios y análisis de error; se recomienda usar una copia legal o un recurso abierto, no una copia no autorizada.
- Un texto de algoritmos y estructuras de datos para profundizar en complejidad, grafos y diseño algorítmico.
- Documentación oficial de las herramientas de geometría, IFC, validación y simulación que el laboratorio decida utilizar. Cada dependencia debe registrarse con versión, licencia y fecha de consulta.
- Normas ISO completas, especificaciones contractuales, manuales de fabricantes, datasets de edificios y documentación institucional cerrada solo después de verificar derechos de acceso y necesidad pedagógica.

Estas entradas son **candidatas**, no contenidos aprendidos por ARKI. Los estándares ISO completos pueden estar sujetos a compra o licencia; la página pública consultada se usó para identificar alcance y partes, no para reproducir el texto normativo.

## 8. Unknowns y preguntas para revisión humana

- No se ha definido el nivel actual de ARKI en cálculo, programación, estadística, geometría y BIM; la ruta debe comenzar con una prueba diagnóstica.
- No se han fijado lenguaje, sistema de control de versiones, motor geométrico, simulador, biblioteca IFC ni entorno de ejecución. Elegirlos puede cambiar los laboratorios.
- No se conoce el caso de uso prioritario de ARKI: diseño generativo, coordinación BIM, análisis energético, planificación, razonamiento documental o apoyo a operación.
- No se ha validado qué formatos y perfiles IFC necesita la organización, ni qué requisitos de información exige cada proyecto.
- No se conocen restricciones de licencia, presupuesto, disponibilidad de GPU, datos privados, políticas de retención o controles de acceso.
- La guía CS2023 consultada es una guía curricular, no una acreditación ni un estándar de competencia profesional para arquitectura.
- Las páginas curriculares institucionales pueden cambiar; debe registrarse una captura o copia de referencia conforme a las políticas de archivo permitidas.
- Las normas y manuales no sustituyen códigos de edificación, revisión profesional, ensayos físicos ni aprobación de autoridades competentes.

## 9. Límites de uso y seguridad

Los modelos computacionales son aproximaciones dependientes de datos, hipótesis, resolución, parámetros y entorno. En arquitectura, un resultado generado puede ser útil para explorar alternativas o detectar inconsistencias, pero no constituye por sí mismo cálculo estructural, certificación energética, cumplimiento normativo, evaluación de evacuación, autorización de obra ni garantía de seguridad.

No deben incorporarse a un laboratorio datos de clientes, planos sensibles, credenciales, ubicaciones de activos críticos o modelos propietarios sin autorización específica. En un sistema de asistencia, las acciones destructivas, publicaciones, cambios de modelo, decisiones de cumplimiento y comunicaciones externas requieren revisión humana y registro. Las entradas se deben validar contra esquemas, límites y permisos; las salidas deben conservar procedencia y permitir reversión.

La separación entre modelo, datos y decisión es obligatoria. Un modelo puede ser correcto respecto de sus ecuaciones y aun así no ser válido para la decisión porque el fenómeno, el contexto o los datos no corresponden. La incertidumbre debe mostrarse junto a la conclusión, no relegarse a una nota final.

## 10. Recomendación de puesta en marcha

Comenzar con un diagnóstico de dos horas y un mini-laboratorio de cuatro semanas. El diagnóstico debe cubrir álgebra lineal, cálculo, probabilidad, Python o lenguaje equivalente, grafos, geometría, lectura de un esquema IFC y razonamiento sobre supuestos. El mini-laboratorio debe producir un modelo pequeño, un informe de error, una exportación interoperable y una prueba de reproducibilidad. Si no supera los gates de formulación y reproducibilidad, ARKI debe repetir Cursos 1–4 antes de abordar optimización o razonamiento avanzado.

La revisión humana debe aprobar el mapa de fuentes, los derechos de acceso, los resultados de aprendizaje, el caso de uso BIM y el plan de datos antes de cualquier ingestión adicional. La siguiente revisión debe actualizar versiones de ISO, IFC, NIST, NASA y las páginas de programa, sin convertir cambios de edición o estado de una fuente en conocimiento supuesto de ARKI.

## References

[1]: https://www.cc.gatech.edu/academics/threads/modeling-simulation "Georgia Tech Modeling & Simulation"
[2]: https://catalog.upp.pitt.edu/preview_program.php?catoid=236&poid=73907 "University of Pittsburgh Computational Modeling & Simulation, MS"
[3]: https://www.gsd.harvard.edu/course/introduction-to-computational-design-fall-2021/ "Harvard GSD Introduction to Computational Design"
[4]: https://csed.acm.org/wp-content/uploads/2023/03/Version-Beta-v2.pdf "ACM IEEE-CS AAAI Computer Science Curricula 2023 Version Beta"
[5]: https://www.nist.gov/programs-projects/numerical-reproducibility "NIST Numerical Reproducibility"
[6]: https://www.odu.edu/academics/programs/undergraduate/modeling-simulation-engineering "Old Dominion University Modeling and Simulation Engineering"
[7]: https://www.iso.org/sectors/building-construction/building-information-modelling "ISO Building information modelling (BIM)"
[8]: https://technical.buildingsmart.org/standards/ifc/ifc-schema-specifications/ "buildingSMART IFC Specifications Database"
[9]: https://www.nasa.gov/wp-content/uploads/2018/09/nasa_systems_engineering_handbook_0.pdf "NASA Systems Engineering Handbook SP-2016-6105 Rev. 2"
[10]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"

---

**Estado de revisión:** listo para revisión humana. El texto debe ser aprobado antes de tratarlo como plan formativo oficial o antes de ingerir materiales adicionales.
