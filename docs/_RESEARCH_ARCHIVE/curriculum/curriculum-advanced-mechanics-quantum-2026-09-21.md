# Ciclo formativo completo de Mecánica cuántica para ARKI

**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Fecha de corte:** 2026-09-21  
**Ámbito:** propuesta curricular independiente, trazable y revisable para ARKI.

## Resumen ejecutivo

Se propone un itinerario de **40–48 semanas**, con una carga orientativa de **420–560 horas**, que progresa desde álgebra lineal, ecuaciones diferenciales, ondas y electromagnetismo hasta formalismo cuántico, métodos aproximados, computación cuántica, medición, proyecto y evaluación acumulativa. La secuencia se inspira en planes públicos de MIT OpenCourseWare y Oxford, pero **no es un curso oficial de esas instituciones**. Es una propuesta para ARKI que debe ser validada por una persona experta en física antes de usarse como criterio de competencia.

La arquitectura curricular tiene cuatro capas de evidencia:

1. **Índices y planes de estudio:** programas, objetivos, prerrequisitos, temas, tareas y formas de evaluación publicados por universidades.
2. **Material público realmente consultado:** páginas web y documentación abierta consultadas para este informe. Se consultaron los sílabos de MIT 8.04, 8.05, 8.06, 10.675J y 8.370X; el programa de Oxford de J. J. Binney; páginas de NIST sobre ciencia de la información cuántica y criptografía poscuántica; estándares FIPS 203 y FIPS 204; y documentación oficial de IBM Quantum/Qiskit.
3. **Bibliografía candidata:** textos y referencias que dichos programas recomiendan. Su inclusión **no significa que ARKI los haya leído**, ni que el informe reproduzca capítulos protegidos.
4. **Ingestión autorizada futura:** libros completos, bases de datos, apuntes privados, laboratorios cerrados, código no público, evaluaciones restringidas o documentación con licencia solo podrán incorporarse con autorización y trazabilidad de derechos.

No se descargaron ni reprodujeron libros protegidos. La investigación utilizó páginas públicas, índices y documentación primaria. Por tanto, el resultado describe una **ruta de aprendizaje propuesta**, no una certificación de conocimiento ya adquirido por ARKI.

## Modelo de cobertura y criterios de logro

La cobertura se expresa por competencias observables, no por número de libros o páginas. Cada bloque debe producir evidencias: derivaciones, soluciones originales, notebooks reproducibles, análisis de datos, una defensa oral o escrita y una evaluación independiente.

| Nivel | Competencia objetivo | Evidencia mínima | Dependencia |
|---|---|---|---|
| L0. Puente matemático-físico | Manejar números complejos, álgebra lineal, ecuaciones diferenciales, Fourier, probabilidad, ondas y unidades | Diagnóstico resuelto con al menos 80% y notebook de verificación | Ninguna; es prerrequisito |
| L1. Fundamentos | Explicar experimentos motivadores y resolver la ecuación de Schrödinger en sistemas unidimensionales básicos | Problemas sobre pozos, barreras, oscilador y paquetes de onda; explicación de incertidumbre | L0 |
| L2. Formalismo | Usar kets, bras, operadores hermíticos, bases, evolución temporal, medición, conmutadores y simetrías | Derivaciones completas y examen cerrado | L1 |
| L3. Sistemas avanzados | Resolver momento angular, espín, átomo de hidrógeno, partículas idénticas y perturbaciones | Problemas analíticos y comparación con resultados numéricos | L2 |
| L4. Métodos y modelado | Aplicar perturbación, variacional, WKB, dispersión y métodos numéricos con análisis de error | Código versionado, convergencia, sensibilidad y límites de validez | L3 |
| L5. Información, medición y seguridad | Representar qubits, canales, mediciones, circuitos y riesgos poscuánticos sin confundirlos con seguridad ya desplegada | Circuitos simulados, protocolo documentado y matriz de riesgos | L2; L4 recomendado |
| L6. Laboratorio/proyecto | Formular una pregunta, medir o simular, estimar incertidumbres, documentar procedencia y defender conclusiones | Informe tipo artículo, repositorio reproducible y defensa | L3; L4 y L5 según proyecto |
| L7. Transferencia responsable | Relacionar resultados con arquitectura, BIM, materiales o seguridad sin extrapolaciones no justificadas | Nota técnica de aplicación con separación entre evidencia, hipótesis y analogía | L4–L6 |

La cobertura global se considera **completa para nivel introductorio universitario avanzado y preparación para trabajo computacional guiado** cuando ARKI supera L0–L6. No equivale a una licenciatura, maestría, autorización de laboratorio ni capacidad de diseñar hardware cuántico.

## Cursos completos propuestos

Los nombres y cargas siguientes son una **propuesta curricular de ARKI**; no deben presentarse como cursos oficiales de MIT, Oxford u otra universidad.

### Q0 — Puente matemático, físico y computacional (6–8 semanas; 60–80 h)

**Objetivo.** Asegurar el lenguaje matemático y físico que los cursos universitarios usan como prerrequisito. MIT 8.04 exige ondas/electromagnetismo y ecuaciones diferenciales; MIT 8.370X señala que el álgebra lineal es útil aunque la mecánica cuántica previa no sea obligatoria [1] [6].

**Unidades.** Números complejos y exponenciales; vectores y espacios vectoriales; matrices, autovalores y autovectores; producto interno y ortogonalidad; operadores lineales; ecuaciones diferenciales ordinarias; series y transformada de Fourier; probabilidad condicional y variables aleatorias; unidades, escalas, incertidumbre y propagación de errores; mecánica newtoniana, ondas, interferencia y electromagnetismo básico; Python/NumPy, gráficos y control de versiones.

**Prácticas.** Diagonalización de matrices hermíticas; integración numérica de una ecuación de onda; ajuste y residuales; prueba de convergencia; notebook que documente unidades y semilla aleatoria.

**Paso.** 80% en el diagnóstico final, todas las magnitudes con unidades y un notebook reproducible que otra persona pueda ejecutar.

### Q1 — Fundamentos experimentales y mecánica ondulatoria (7–8 semanas; 70–90 h)

**Objetivo.** Construir intuición sin sustituir la matemática. MIT 8.04 incluye efecto fotoeléctrico, Compton, Franck–Hertz, átomo de Bohr, difracción electrónica, dualidad onda-partícula, función de onda, amplitudes de probabilidad, incertidumbre, pozos, barreras, oscilador y potenciales centrales [1].

**Unidades.** Evidencia experimental histórica; amplitudes y probabilidades; ecuación de Schrödinger dependiente e independiente del tiempo; normalización y valores esperados; paquetes de onda; relación posición-momento; estados estacionarios; pozo infinito y finito; reflexión, transmisión y túnel; oscilador armónico; introducción al hidrógeno.

**Laboratorio seguro.** Simulación de interferencia de doble rendija, barrera y paquete de onda. Si se usa un kit óptico o detector, debe existir supervisión, evaluación eléctrica/óptica y protocolo institucional. No se propone construir fuentes radiactivas ni láseres de potencia.

**Paso.** Resolver y explicar, sin ayuda externa, al menos 8 problemas representativos y comparar una solución analítica con una simulación, incluyendo un análisis de error.

### Q2 — Formalismo, dinámica, medición, espín y simetrías (7–8 semanas; 70–90 h)

**Objetivo.** Dominar la estructura abstracta de la teoría. MIT 8.05 exige 8.04 y cubre estructura general, dinámica, sistemas de dos estados, momento angular, espín, ecuación radial, métodos de operadores y partículas idénticas [2]. Oxford explicita estados, amplitudes, operadores hermíticos, representaciones, incertidumbre, simetrías y conservación [7].

**Unidades.** Notación de Dirac; bases discretas y continuas; observables y operadores hermíticos; proyectores y medición; evolución unitaria; conmutadores; imagen de Schrödinger y operadores; simetrías y leyes de conservación; sistemas de dos niveles; matrices de Pauli; Stern–Gerlach; espín 1/2; composición elemental.

**Prácticas.** Derivar la precesión de un espín en un campo idealizado; calcular probabilidades de medición en distintas bases; verificar numéricamente un conmutador; distinguir estado, observable, resultado y distribución de resultados.

**Paso.** Examen cerrado de 90–180 minutos con al menos 70%, más una explicación oral breve que detecte errores de notación y de interpretación.

### Q3 — Tres dimensiones, momento angular, átomo y partículas idénticas (6–8 semanas; 70–90 h)

**Objetivo.** Completar el núcleo de mecánica cuántica no relativista de nivel universitario. El curso QP III de MIT continúa 8.05 e introduce sistemas de dos dimensiones, estructura fina del hidrógeno, láseres y dispersión [3].

**Unidades.** Momento angular orbital y total; armónicos esféricos; ecuación radial; hidrógeno y degeneración; perturbación estacionaria y dependiente del tiempo; estructura fina a nivel introductorio; emisión y absorción; partículas idénticas; bosones y fermiones; introducción a dispersión y resonancia; modelo elemental de láser.

**Prácticas.** Estados del hidrógeno; reglas de selección a nivel cualitativo y cuantitativo cuando estén justificadas; comparación de niveles perturbados; sección eficaz de un potencial modelo.

**Paso.** Resolver una colección acumulativa con 70% o más, explicar qué aproximaciones se emplearon y entregar una nota sobre el dominio de validez.

### Q4 — Métodos aproximados, materia y mecánica cuántica computacional (7–9 semanas; 80–110 h)

**Objetivo.** Convertir la teoría en modelado reproducible. MIT 10.675J presenta cálculos cuánticos desde química y física, enseña a ejecutar códigos e interpretar sus salidas sin exigir conocer cada línea interna, y exige teoría, literatura crítica y proyecto final [4].

**Unidades.** Método variacional; perturbación; WKB; aproximación adiabática/Born–Oppenheimer como concepto; dispersión numérica; diferencias finitas y diagonalización; estados ligados; convergencia y estabilidad; introducción a estructura electrónica, orbitales, densidad y teoría del funcional de la densidad solo como mapa; periodicidad y materiales; documentación de software y reproducibilidad.

**Prácticas.** Implementar un solver 1D; comparar diferencias finitas con una solución conocida; estudiar convergencia de energía; analizar un cálculo de estructura electrónica abierto sin presentar el resultado del software como verdad; registrar versión, parámetros, entradas y salidas.

**Paso.** Proyecto computacional pequeño con pruebas, control de unidades, análisis de sensibilidad y réplica independiente. Un resultado sin incertidumbre o sin especificar condiciones no pasa.

### Q5 — Información cuántica, simulación y medición (5–7 semanas; 50–80 h)

**Objetivo.** Conectar el formalismo con qubits y circuitos sin vender capacidades inexistentes. MIT 8.370X es una serie de tres partes sobre fundamentos, protocolos, algoritmos, ruido, canales y distribución de claves; indica que la mecánica cuántica previa ayuda, pero no es obligatoria, y que el álgebra lineal es recomendable [6]. La documentación oficial de IBM define un circuito como qubits más instrucciones, y explica profundidad, puertas y mediciones [8].

**Unidades.** Qubit y esfera de Bloch; producto tensorial; entrelazamiento; puertas; circuitos; medición y muestreo; teleportación y superdense coding; algoritmos de Deutsch–Jozsa, Grover y Shor como objetos de estudio; canales y ruido; CHSH como demostración; simulador frente a hardware; límites de NISQ.

**Laboratorio computacional.** Construir circuitos en un simulador y, si hay acceso autorizado, ejecutar una prueba de baja sensibilidad en hardware público. Registrar shots, backend, versión, profundidad, mediciones, ruido y diferencia entre ideal y observado. La medición no debe describirse como “leer el estado completo”: muestrea resultados de observables según el circuito.

**Paso.** Reproducir tres circuitos, explicar sus mediciones y cuantificar la diferencia entre simulador ideal y ejecución ruidosa. No se exige afirmar ventaja cuántica.

### Q6 — Laboratorio, proyecto y comunicación técnica (6–8 semanas; 80–120 h)

**Objetivo.** Integrar teoría, método, datos y comunicación. El modelo se inspira en QP III, donde MIT incorpora un trabajo escrito en estilo de artículo y exige una calificación mínima de C para aprobar el componente de comunicación [3], y en 10.675J, que usa un proyecto final como 50% de su evaluación [4].

**Rutas de proyecto elegibles.** (a) interferencia y túnel simulados con validación analítica; (b) espín 1/2 y medición en circuito; (c) método variacional para un potencial modelo; (d) análisis reproducible de un material con datos o código público; (e) estudio de sensibilidad de un sensor cuántico descrito por una fuente primaria; (f) inventario de criptografía vulnerable y plan de migración poscuántica para un flujo BIM, sin desplegar criptografía en producción.

**Entregables.** Pregunta y alcance; revisión de fuentes; modelo; supuestos; código o protocolo; datos; incertidumbres; resultados; límites; riesgos; licencia y procedencia; informe de 8–15 páginas; repositorio reproducible; defensa de 20 minutos; revisión por una persona experta.

**Paso.** Dos réplicas independientes producen resultados compatibles dentro del intervalo declarado; la defensa distingue datos, inferencias, hipótesis y analogías; no se aceptan conclusiones que excedan el modelo.

### Q7 — Transferencia prudente a arquitectura, BIM, modelado, razonamiento y seguridad (4–6 semanas; 40–70 h)

Este módulo no pretende convertir la mecánica cuántica en una técnica general para diseñar edificios. Sus aplicaciones se limitan a conexiones verificables:

- **Arquitectura y materiales.** La estructura electrónica y los cálculos de materiales pueden informar propiedades de semiconductores, sensores, fotónica, recubrimientos o almacenamiento. La ruta debe usar datos y métodos específicos del material; no basta con citar “cuántico”.
- **BIM y modelado.** La mecánica cuántica no sustituye BIM ni demuestra automáticamente una optimización superior. La transferencia razonable está en la disciplina de modelado: declarar estados y parámetros, separar mediciones de inferencias, versionar entradas, documentar incertidumbre y registrar procedencia. Una analogía entre superposición y “alternativas de diseño” debe etiquetarse como analogía, no como equivalencia física.
- **Razonamiento.** La medición cuántica enseña que una predicción puede ser una distribución condicionada por un estado, observable y protocolo. No autoriza a describir cualquier incertidumbre humana, semántica o empresarial como superposición física.
- **Seguridad.** NIST define la ciencia de la información cuántica como la combinación de física cuántica e información, con aplicaciones en computación, sensores, redes y criptografía [5]. Para flujos BIM, propiedad intelectual, firmas de modelos y servicios cloud, la preocupación práctica es inventariar algoritmos de clave pública, planear criptoagilidad y migrar con controles de seguridad. NIST publicó FIPS 203 para ML-KEM y FIPS 204 para ML-DSA [9] [10]; la mecánica cuántica por sí sola no constituye una evaluación criptográfica ni una certificación de seguridad.

**Paso.** Nota de transferencia con una afirmación validada, una afirmación hipotética y una afirmación explícitamente rechazada por falta de evidencia. Debe incluir impacto, riesgo, fuente y criterio de actualización.

## Evaluación acumulativa y criterios de paso

Se recomienda una ponderación orientativa: **30% problemas y derivaciones**, **20% laboratorios/notebooks**, **20% exámenes**, **20% proyecto integrador** y **10% comunicación, procedencia y seguridad**. Los porcentajes son una propuesta de ARKI, no una reproducción de una escala institucional. MIT 8.05, por ejemplo, pondera examen parcial, final y conjuntos de problemas, mientras 8.06 combina problemas, exámenes y trabajo escrito [2] [3].

Los criterios de paso son:

1. **Prerrequisitos:** L0 con al menos 80%; sin pasar L0 no se habilita la ruta analítica.
2. **Dominio conceptual:** mínimo 70% en cada examen de Q1–Q4 y 80% en preguntas de interpretación, medición y unidades.
3. **Resolución original:** al menos 70% de problemas entregados con derivación legible y sin copiar soluciones.
4. **Código y datos:** ejecución desde cero, dependencias declaradas, prueba de convergencia, control de versiones y análisis de errores.
5. **Laboratorio:** protocolo seguro, calibración o simulación validada, incertidumbre y separación de observación frente a interpretación.
6. **Proyecto:** rúbrica mínima de 70/100, defensa satisfactoria y revisión experta. Una afirmación materialmente falsa sobre seguridad, datos o evidencia implica revisión antes del aprobado.
7. **Integridad de fuentes:** cada afirmación externa trazable a una fuente; los textos recomendados se etiquetan como recomendación, no como material ingerido.
8. **Mantenimiento:** revisión anual de software, estándares poscuánticos y fuentes; revisión extraordinaria si cambia un estándar o se descubre una errata crítica.

## Bibliografía candidata trazable

La siguiente lista es **bibliografía recomendada por los programas consultados**, no un registro de lectura de ARKI. Se deben adquirir o consultar legalmente las ediciones pertinentes. No se copiaron capítulos ni se descargaron libros protegidos.

| Recurso | Uso propuesto | Estado de acceso en esta investigación |
|---|---|---|
| Eisberg y Resnick, *Quantum Physics of Atoms, Molecules, Solids, Nuclei, and Particles* | Introducción y fenomenología | Recomendado por MIT 8.04; no leído íntegramente |
| Liboff, *Introductory Quantum Mechanics* | Introducción y problemas | Recomendado por MIT 8.04; no leído íntegramente |
| Gasiorowicz, *Quantum Physics* | Introducción alternativa | Recomendado por MIT 8.04; no leído íntegramente |
| Shankar, *Principles of Quantum Mechanics* | Formalismo y métodos | Recomendado por MIT 8.04/8.05/8.06; no leído íntegramente |
| Griffiths y Schroeter, *Introduction to Quantum Mechanics* | Núcleo de Q1–Q4 | Texto requerido o recomendado en MIT 8.05/8.06; no leído íntegramente |
| Cohen-Tannoudji et al., *Quantum Mechanics* | Referencia avanzada | Referencia de MIT 8.05/8.06; no leído íntegramente |
| Sakurai, *Modern Quantum Mechanics* | Perspectiva avanzada | Referencia de MIT 8.05/8.06; no leído íntegramente |
| Binney y Skinner, *The Physics of Quantum Mechanics* | Base del programa Oxford | Oxford describe el curso y remite a sus primeros ocho capítulos; no leído íntegramente |
| Szabo y Ostlund, *Modern Quantum Chemistry* | Estructura electrónica computacional | “Required” en MIT 10.675J; no leído íntegramente |
| Nielsen y Chuang, *Quantum Computation and Quantum Information* | Referencia de información cuántica | Candidata para Q5; requiere verificar edición y licencia antes de ingerir contenido |

## Fuentes públicas realmente consultadas

[1] MIT OpenCourseWare, sílabo de **Quantum Physics I (8.04, Spring 2013)**: prerrequisitos, descripción, textos, problemas y exámenes.  
[2] MIT OpenCourseWare, sílabo de **Quantum Physics II (8.05, Fall 2013)**: prerrequisito, formalismo, temas, problemas, exámenes y ponderación.  
[3] MIT OpenCourseWare, sílabo de **Quantum Physics III (8.06, Spring 2018)**: métodos analíticos y aproximados, proyecto, trabajo escrito, exámenes y evaluación.  
[4] MIT OpenCourseWare, sílabo de **Computational Quantum Mechanics of Molecular and Extended Systems (10.675J, Fall 2004)**: objetivos, límites de códigos, software, proyecto y evaluación.  
[5] NIST, **Quantum information science**: definición, medición, estándares, sensores, computación, redes y criptografía poscuántica.  
[6] MIT OpenCourseWare/Open Learning Library, **Quantum Information Science I (8.370X, Spring 2018)**: serie de tres partes, fundamentos, algoritmos, ruido, canales y requisitos.  
[7] University of Oxford, J. J. Binney, **Quantum Mechanics synopsis**: objetivos, secuencia de 27 unidades, conjuntos de problemas y textos de referencia.  
[8] IBM Quantum Documentation, **Construct circuits**: qubits, instrucciones, profundidad, puertas y mediciones.  
[9] NIST CSRC, **FIPS 203: Module-Lattice-Based Key-Encapsulation Mechanism Standard**: ML-KEM, propósito, conjuntos de parámetros y estado de publicación.  
[10] NIST CSRC, **FIPS 204: Module-Lattice-Based Digital Signature Standard**: ML-DSA, autenticidad, integridad y estado de publicación.  
[11] NIST CSRC, **Post-Quantum Cryptography PQC**: FIPS 203/204/205, migración, criptoagilidad y calendario de transición.

## Unknowns y cuestiones para revisión humana

- No se conoce el nivel inicial de ARKI en álgebra lineal, ecuaciones diferenciales, electromagnetismo, programación, inglés técnico ni razonamiento probabilístico.
- No se ha definido si ARKI necesita competencia conceptual, capacidad de simulación, apoyo a investigación o una certificación formal. La ruta propuesta cubre las tres primeras con profundidad limitada.
- No se verificó una institución, docente o laboratorio que certifique este currículo de ARKI. Los cursos externos son fuentes de diseño, no acreditación.
- Los métodos de materiales, DFT, dispersión, sensores y computación cuántica requieren especialización adicional. No se debe asumir que Q1–Q7 bastan para investigación publicable.
- La disponibilidad, licencia y versión de Qiskit, backends de hardware y paquetes científicos puede cambiar. Cada ejecución debe fijar versiones y fecha.
- La situación normativa de criptografía poscuántica puede evolucionar; debe revisarse NIST y la autoridad jurisdiccional aplicable antes de decisiones de producción.
- Las conexiones con arquitectura y BIM son principalmente transferencias metodológicas o aplicaciones de materiales/seguridad. No existe aquí evidencia de que “pensamiento cuántico” mejore por sí mismo un proceso BIM.

## Límites, seguridad y gobernanza

Este informe no afirma que ARKI haya leído libros completos, cursado oficialmente las asignaturas, realizado laboratorios físicos, ejecutado hardware cuántico o adquirido conocimiento que requiriese ingestión autorizada. Solo se atribuye a la investigación la consulta de las páginas públicas enumeradas. Los libros aparecen como textos recomendados o candidatos.

No se descargaron ni reprodujeron libros protegidos. La futura ingestión de capítulos, libros, apuntes privados, datasets restringidos, código cerrado o exámenes debe contar con autorización, licencia, registro de procedencia y reglas de retención. El sistema debe conservar una separación entre **material consultado**, **material recomendado**, **contenido generado por ARKI** y **contenido pendiente de validación**.

Los laboratorios deben ser simulados por defecto. Cualquier experimento óptico, eléctrico, criogénico, de vacío o con radiación requiere instalaciones, supervisión, evaluación de riesgos y procedimientos institucionales. Las demostraciones de seguridad deben usar entornos de prueba y no llaves o modelos BIM de producción. La adopción de ML-KEM, ML-DSA u otro mecanismo debe realizarla personal criptográfico competente, con inventario, pruebas de interoperabilidad, gestión de claves, respaldo y revisión de cumplimiento; una referencia a FIPS no es una implementación segura.

## Puertas de verificación antes de declarar competencia

1. **Gate A — alcance:** una persona experta confirma que objetivos, prerrequisitos y nivel no se presentan como acreditación universitaria.
2. **Gate B — matemática:** revisión de un examen L0 y de dos notebooks para detectar errores de álgebra lineal, unidades y convergencia.
3. **Gate C — física:** revisión de soluciones de Q1–Q4 y una defensa oral sobre medición, incertidumbre, espín y aproximaciones.
4. **Gate D — computación:** ejecución limpia del proyecto en un entorno reproducible, con comparación analítica o de referencia.
5. **Gate E — laboratorio:** auditoría de seguridad, incertidumbre, calibración y trazabilidad; ningún experimento físico sin autorización local.
6. **Gate F — transferencia:** revisión de la nota BIM/arquitectura/seguridad para eliminar afirmaciones de ventaja cuántica no demostradas.
7. **Gate G — fuentes y derechos:** comprobación de que cada recurso está etiquetado como consultado, recomendado o pendiente de ingestión autorizada.
8. **Gate H — mantenimiento:** revisión al menos anual y después de cambios en estándares NIST, bibliotecas, hardware o fuentes institucionales.

## References

[1]: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2013/pages/syllabus/ "MIT OpenCourseWare — Quantum Physics I syllabus"
[2]: https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/pages/syllabus/ "MIT OpenCourseWare — Quantum Physics II syllabus"
[3]: https://ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/pages/syllabus/ "MIT OpenCourseWare — Quantum Physics III syllabus"
[4]: https://ocw.mit.edu/courses/10-675j-computational-quantum-mechanics-of-molecular-and-extended-systems-fall-2004/pages/syllabus/ "MIT OpenCourseWare — Computational Quantum Mechanics syllabus"
[5]: https://www.nist.gov/quantum-information-science "NIST — Quantum information science"
[6]: https://ocw.mit.edu/courses/8-370x-quantum-information-science-i-spring-2018/ "MIT OpenCourseWare — Quantum Information Science I"
[7]: http://www-thphys.physics.ox.ac.uk/people/JamesBinney/qm_synopsis.html "University of Oxford — Quantum Mechanics synopsis"
[8]: https://qiskit.qotlabs.org/docs/guides/construct-circuits "IBM Quantum Documentation — Construct circuits"
[9]: https://csrc.nist.gov/pubs/fips/203/final "NIST FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard"
[10]: https://csrc.nist.gov/pubs/fips/204/final "NIST FIPS 204 — Module-Lattice-Based Digital Signature Standard"
[11]: https://csrc.nist.gov/projects/post-quantum-cryptography "NIST CSRC — Post-Quantum Cryptography project"

**Decisión recomendada:** mantener el estado `READY_FOR_HUMAN_REVIEW` hasta que se complete el diagnóstico de ARKI y una revisión experta de física, computación científica y seguridad. Luego podrá fijarse una versión curricular, una rúbrica de aprobación y un registro de evidencias por competencia.
