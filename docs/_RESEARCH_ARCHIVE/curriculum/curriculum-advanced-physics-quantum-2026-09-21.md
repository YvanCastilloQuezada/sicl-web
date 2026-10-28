# Ciclo formativo completo de Física cuántica para ARKI

**Fecha de corte:** 2026-09-21  
**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Objeto:** propuesta de currículo progresivo, no certificación de dominio ni afirmación de que ARKI haya leído libros completos.

## 1. Alcance y conclusión ejecutiva

Este documento propone una ruta completa para que ARKI pueda razonar sobre física cuántica con rigor suficiente para análisis técnico, modelado, documentación, prototipos computacionales y aplicaciones prudentes a arquitectura, BIM, simulación, sensado y seguridad. La ruta se inspira en secuencias universitarias públicas y en documentación técnica primaria. No sustituye un grado en Física, una formación experimental supervisada ni una revisión humana experta.

La secuencia central toma como referencia pública la progresión **MIT 8.04 → 8.05 → 8.06**. MIT 8.04 exige Física III: vibraciones y ondas; cubre función de onda, probabilidad, ecuación de Schrödinger, operadores, incertidumbre, potenciales unidimensionales, dispersión y átomo de hidrógeno [1]. 8.05 continúa con estructura general, dinámica, sistemas de dos estados, momento angular, espín, métodos de operadores y partículas idénticas [2]. 8.06 añade técnicas exactas y aproximadas, sistemas bidimensionales, estructura fina, láseres y dispersión, junto con un trabajo de investigación [3].

Para extender esa base hacia tecnologías cuánticas, el currículo incorpora la cobertura interdisciplinaria de Oxford: computación, sensado, comunicaciones, hardware, prácticas y un proyecto de investigación de cuatro meses [4]. IBM aporta un itinerario público de información cuántica sobre estados, medidas, circuitos, entrelazamiento, teleportación, codificación superdensa, desigualdad de CHSH y ejercicios en Qiskit [5]. Para aplicaciones y seguridad se usan NIST y DOE: sensado cuántico, estándares de criptografía poscuántica, migración criptográfica, simulación de materiales y límites de madurez [6] [7] [8] [9].

**No se afirma que ARKI haya leído ningún libro completo.** Los libros que aparecen en los syllabi se registran como **bibliografía candidata recomendada por las instituciones**, no como conocimiento ingestido. Lo que sí se consultó para este informe son las páginas web y documentos públicos enlazados en la sección de fuentes. La ingestión de libros, capítulos de pago, bancos de exámenes no públicos, manuales propietarios o documentación con licencia requeriría autorización y un mecanismo de ingestión trazable.

## 2. Modelo de cobertura y estados de conocimiento

La cobertura se divide en cinco capas, cada una con una evidencia distinta:

1. **Fundamentos matemáticos y físicos.** Álgebra lineal compleja, cálculo, ecuaciones diferenciales, Fourier, probabilidad, ondas, electromagnetismo y termodinámica. Resultado: ARKI puede interpretar símbolos, unidades, hipótesis y órdenes de magnitud.
2. **Mecánica cuántica formal.** Estados, observables, operadores hermíticos, evolución, medición, incertidumbre, potenciales, espín, momento angular, partículas idénticas, perturbaciones y dispersión. Resultado: puede plantear y comprobar derivaciones y resolver modelos canónicos.
3. **Información y tecnologías cuánticas.** Qubits, circuitos, puertas, mediciones, entrelazamiento, algoritmos introductorios, corrección de errores, sensores, redes y hardware. Resultado: puede distinguir una demostración de circuito de una promesa de ventaja práctica.
4. **Métodos, laboratorio y modelado.** Simulación numérica, propagación de incertidumbre, ajuste de datos, ruido, control, reproducibilidad, notebooks, circuitos en simulador y, cuando exista autorización, acceso a hardware remoto. Resultado: puede producir artefactos verificables, no solo explicaciones.
5. **Aplicación responsable.** Arquitectura, BIM, modelado de materiales y sistemas, seguridad de información, gobernanza y comunicación de límites. Resultado: conecta un problema real con una hipótesis cuántica sin convertir una posibilidad de investigación en una capacidad comercial demostrada.

Cada competencia debe marcarse como **Plan**, **Material público consultado**, **Ejercicio realizado**, **Evaluado** o **No verificado**. Una bibliografía, por sí sola, nunca cambia un elemento a “aprendido”.

## 3. Cursos completos propuestos para ARKI

Los nombres y cargas siguientes son una propuesta de ARKI, no cursos oficiales existentes. Su orden respeta prerrequisitos verificables en los syllabi consultados.

### Curso 0 — Preparación matemática, computacional y física

**Propósito.** Cerrar las condiciones de entrada de una secuencia universitaria de mecánica cuántica.

**Resultados.** ARKI debe manejar números complejos, vectores y espacios vectoriales, autovalores y autovectores, producto interno, matrices hermíticas y unitarias, cálculo multivariable, ecuaciones diferenciales ordinarias, series de Fourier, probabilidad, análisis dimensional y programación científica reproducible. Debe explicar por qué MIT 8.04 presupone una asignatura previa de vibraciones y ondas [1].

**Práctica.** Implementar en Python un oscilador clásico, una transformada de Fourier discreta, propagación de una onda y un cuaderno de control de unidades. Comparar una solución analítica con una solución numérica y registrar error de discretización.

**Paso.** Al menos 80 % en una prueba de álgebra lineal/cálculo/probabilidad y una defensa oral de cinco minutos sobre hipótesis, unidades y estabilidad numérica.

### Curso 1 — Mecánica cuántica I: experimentos y ecuación de Schrödinger

**Base pública.** MIT 8.04, nivel undergraduate, con apuntes, vídeos, problemas y exámenes listados como recursos públicos [1] [10]. El syllabus consultado especifica tres bloques: conceptos básicos; potenciales unidimensionales y oscilador armónico; dispersión, momento angular y átomo de hidrógeno [1].

**Resultados.** Explicar la evidencia experimental que motivó la teoría; interpretar la función de onda como amplitud de probabilidad; resolver estados estacionarios en la caja, pozo finito, potencial delta y oscilador armónico; analizar tunelamiento, dispersión básica y el hidrógeno; distinguir predicción, interpretación y medición.

**Métodos.** Separación de variables, condiciones de contorno, operadores, conmutadores, valores esperados, teorema de Ehrenfest, paquetes de onda, evolución temporal y análisis dimensional.

**Laboratorio/proyecto.** Simulación de un paquete gaussiano en un potencial con barrera. El informe debe incluir convergencia de malla, conservación aproximada de probabilidad, comparación con una referencia analítica y análisis de sensibilidad.

**Evaluación.** Problemas semanales; dos pruebas parciales; examen acumulativo. Como referencia, MIT pondera en 8.04 un 75 % de exámenes y 25 % de tareas [1]. Para ARKI se recomienda un umbral de 70 % en problemas y 75 % en el examen, sin errores conceptuales críticos.

### Curso 2 — Mecánica cuántica II: estructura, espín y sistemas compuestos

**Base pública.** MIT 8.05 exige haber aprobado 8.04 y cubre estructura general, dinámica, sistemas de dos estados, momento angular y espín, ecuación radial, métodos de operadores, suma de momento angular y partículas idénticas [2].

**Resultados.** Representar estados en notación de Dirac y matrices; calcular evolución unitaria y mediciones; resolver sistemas de dos niveles; usar álgebra de espín y momento angular; combinar momentos angulares; explicar bosones, fermiones y simetrización sin confundirlos con “partículas clásicas pequeñas”.

**Métodos.** Bases y cambios de base, operadores densidad como extensión opcional, conmutadores, degeneración, perturbación introductoria y trazas parciales a nivel conceptual.

**Laboratorio/proyecto.** Modelo de un qubit sometido a pulsos: evolución, medición, decoherencia fenomenológica y ajuste de parámetros. El resultado debe separar claramente un modelo ideal de una medición de hardware real.

**Evaluación.** Tareas semanales, parcial cerrado y final acumulativo. MIT 8.05 usa 25 % parcial, 45 % final y 30 % problem sets [2]. Para ARKI: mínimo 75 % agregado, al menos 70 % en cada bloque de espín, medición y sistemas compuestos.

### Curso 3 — Mecánica cuántica III: aproximaciones, dispersión y comunicación científica

**Base pública.** MIT 8.06 continúa 8.05, trabaja técnicas exactas y aproximadas, sistemas bidimensionales, estructura fina del hidrógeno, láseres y dispersión; incluye nueve problem sets, parcial, final y un term paper [3].

**Resultados.** Elegir una aproximación justificando su dominio de validez; trabajar perturbaciones, variación y aproximaciones semiclasicas en problemas apropiados; analizar niveles, transiciones, emisión estimulada y dispersión; leer un artículo técnico sin convertirlo en autoridad automática.

**Proyecto.** Reproducir un resultado acotado de un artículo o de apuntes abiertos mediante cálculo propio. Temas posibles: resonancia, oscilador perturbado, emisión estimulada, dispersión parcial o sistema de dos niveles impulsado. El documento debe tener formato de artículo breve y declarar toda fuente, código y parte no verificada.

**Evaluación.** 25 % problemas, 15 % parcial, 25 % artículo/proyecto y 35 % final, tomando como referencia la estructura de MIT 8.06 [3]. El proyecto no se aprueba si carece de hipótesis, análisis de error o trazabilidad.

### Curso 4 — Información cuántica y computación

**Base pública.** IBM presenta un curso público de fundamentos que comienza con matemática de información cuántica, pasa por sistemas simples y múltiples, circuitos y productos internos, y termina con teleportación, codificación superdensa y CHSH; incluye implementaciones en Qiskit y un examen para insignia [5].

**Resultados.** Explicar qubit, superposición, medición, interferencia y entrelazamiento; construir circuitos de una y dos qubits; simular mediciones; distinguir complejidad algorítmica de velocidad física; explicar por qué el entrelazamiento no permite comunicación clásica instantánea; describir, sin prometer rendimiento, la función de la corrección de errores.

**Práctica.** Implementar estados de Bell, teleportación y CHSH en simulador; repetirlos con ruido configurable; documentar número de shots, semilla, versión de software y diferencia entre simulador y hardware. Como ampliación, estudiar un algoritmo de búsqueda o factorización solo a nivel de recursos y supuestos.

**Evaluación.** 40 % notebooks reproducibles, 25 % problemas matemáticos, 20 % examen conceptual y 15 % defensa. Paso: 75 % global, cero afirmaciones de ventaja sin baseline clásico y cuantificación de error.

### Curso 5 — Sensado, comunicaciones, hardware y laboratorio

**Base pública.** Oxford estructura su MSc alrededor de computación, sensado y comunicaciones, con módulos de introducción, aplicaciones, hardware, prácticas y un proyecto de investigación de cuatro meses [4]. NIST explica que los sensores cuánticos aprovechan propiedades como niveles de energía y espín, y enumera aplicaciones en salud, geología, materiales, navegación y astronomía [6]. El DOE añade computación, sensado, simulación y redes, pero advierte que los recursos y la ventaja cuántica práctica siguen siendo objeto de investigación [7] [8].

**Resultados.** Comparar sensor clásico y cuántico con una métrica definida; modelar ruido, estabilidad, calibración y sensibilidad; describir nociones de reloj atómico, magnetometría, interferometría, fotónica y redes; separar un prototipo de laboratorio de una especificación de producto.

**Laboratorio seguro.** Usar datos públicos o simulados de interferometría, magnetometría o reloj. Medir señal-ruido, deriva, repetibilidad y propagación de incertidumbre. No se deben operar láseres, criogenia, fuentes ionizantes, vacío, imanes de alta potencia ni dispositivos de laboratorio sin supervisión, evaluación de riesgos y autorización institucional.

**Proyecto.** Diseñar un protocolo de sensado para una variable de edificio, sitio o material. Se exige una comparación clásica, un presupuesto de incertidumbre, análisis de interferencias ambientales y una conclusión que pueda ser “no hay ventaja demostrada”.

### Curso 6 — Estudio de aplicación: arquitectura, BIM, modelado y seguridad

**Propósito.** Convertir conocimiento cuántico en decisiones de ingeniería prudentes para ARKI, sin presentar la arquitectura como una aplicación cuántica validada por las fuentes.

**Arquitectura y BIM.** Las conexiones razonables son indirectas: sensores de precisión para monitorización estructural o ambiental; caracterización de materiales; optimización y simulación de sistemas; y preparación de datos para futuras herramientas. El DOE cita sensores, simulación de materiales y gestión de infraestructura/logística como áreas de investigación [7] [8]. No se debe afirmar que un flujo BIM corriente requiera computación cuántica ni que exista una ventaja práctica general. El entregable debe mapear entidades BIM, variables físicas, cadencia de medición, incertidumbres, formatos, permisos y baseline clásico.

**Modelado.** Construir un gemelo digital pequeño de un sistema de edificio: entradas, estados, observaciones, ruido y decisiones. Comparar un método clásico reproducible con una formulación cuántica simulada. El objetivo es aprender a elegir el método, no forzar una solución cuántica.

**Seguridad.** NIST publicó en 2024 FIPS 203 (ML-KEM), FIPS 204 (ML-DSA) y FIPS 205 (SLH-DSA), y recomienda comenzar la migración a criptografía resistente a cuántica [9]. ARKI debe realizar un inventario de algoritmos vulnerables en un flujo BIM hipotético, clasificar datos de larga vida, proponer crypto-agility y citar los FIPS primarios. La computación cuántica no es una justificación para cambiar criptografía sin inventario, análisis de riesgo y validación.

**Evaluación.** 30 % arquitectura de datos/BIM, 25 % comparación clásica-cuántica, 25 % seguridad y trazabilidad, 20 % defensa ante revisión humana. Paso: toda recomendación operativa debe tener fuente, alcance, supuesto y plan de reversión.

## 4. Ruta temporal y dependencia

Una ejecución intensiva puede organizarse en **40–52 semanas**: 6–8 semanas para Curso 0; 8–10 para Curso 1; 8–10 para Curso 2; 8–10 para Curso 3; 5–7 para Curso 4; 6–8 para Curso 5; y 6–8 para el estudio aplicado, con solapamiento limitado entre proyecto y revisión. Para una ruta menos intensiva, cada curso puede extenderse sin cambiar los criterios de paso.

No se debe saltar de divulgación a aplicaciones. La dependencia mínima es Curso 0 → Curso 1 → Curso 2 → Curso 3. Curso 4 puede comenzar después de álgebra lineal y conceptos de Curso 2, pero la interpretación física debe apoyarse en Cursos 1–2. Curso 5 requiere Curso 2 y prácticas numéricas. Curso 6 requiere al menos Cursos 3–5.

## 5. Materiales realmente consultados y materiales no ingeridos

### Consultados para este informe

Se consultaron páginas públicas de MIT OpenCourseWare 8.04, 8.05 y 8.06, incluida la información de nivel, prerrequisitos, temas, materiales de aprendizaje, evaluación y bibliografía listada en los respectivos syllabi [1] [2] [3] [10]. Se consultó la descripción oficial del MSc de Oxford para estructura interdisciplinaria, prácticas y proyecto [4]. Se consultó IBM Quantum Learning para el alcance del curso público de información cuántica [5]. Se consultaron NIST sobre sensado cuántico y sobre el proyecto PQC y sus FIPS [6] [9]. Se consultaron DOE sobre QIS y su hoja de ruta de aplicaciones [7] [8].

### Candidatos recomendados, no conocimiento atribuido a ARKI

Los syllabi MIT recomiendan, entre otros, Griffiths y Schroeter, Shankar, Cohen-Tannoudji, Sakurai, Merzbacher, Feynman Vol. 3, Ohanian, Axler y textos de procesos e información cuántica [1] [2] [3]. Estos registros demuestran que fueron recomendados por MIT; **no demuestran que ARKI ni este agente hayan leído los libros**. No se descargaron ni reprodujeron libros protegidos. Para usar capítulos, ejercicios o ediciones concretas en entrenamiento se requeriría licencia o ingestión autorizada. Las ediciones y ISBN deben verificarse en el catálogo editorial antes de comprar o citar una edición específica.

## 6. Bibliografía candidata trazable

1. Barton Zwiebach, MIT OpenCourseWare, **Quantum Physics I, 8.04, Spring 2016**, syllabus y materiales públicos [1] [10].
2. Barton Zwiebach, MIT OpenCourseWare, **Quantum Physics II, 8.05, Fall 2013**, syllabus y materiales públicos [2].
3. MIT OpenCourseWare, **Quantum Physics III, 8.06, Spring 2018**, syllabus y materiales públicos [3].
4. University of Oxford, **MSc in Quantum Technologies**, descripción, estructura y componentes [4].
5. IBM Quantum Learning, **Basics of quantum information**, curso público y contenidos [5].
6. National Institute of Standards and Technology, **Quantum Sensing Explained** [6].
7. U.S. Department of Energy, **Quantum Information Science** [7].
8. U.S. Department of Energy, Office of Science, **2024 Quantum Information Science Applications Roadmap** [8].
9. NIST, **Post-Quantum Cryptography PQC** y anuncio de los tres estándares finalizados [9] [11].
10. Libros de texto listados en los syllabi MIT: candidatos de lectura bajo licencia, no fuentes ingeridas ni evidencia de dominio [1] [2] [3].

## 7. Plan de evaluación, gates y criterios de paso

### Gates de verificación

| Gate | Evidencia mínima | Criterio de paso |
|---|---|---|
| G0 | Prueba de matemáticas, ondas y código | ≥80 % y notebook reproducible |
| G1 | Problemas de Curso 1 y simulación de barrera | ≥75 %; conservación y convergencia explicadas |
| G2 | Sistemas de dos niveles, espín y medición | ≥75 %; sin confundir estado, observable y resultado |
| G3 | Proyecto de aproximación o dispersión | Reproducción trazable, incertidumbre y revisión humana |
| G4 | Circuitos, Bell, teleportación y CHSH | ≥75 %; baseline y ruido documentados |
| G5 | Protocolo de sensor o datos de laboratorio | Presupuesto de incertidumbre, seguridad y comparación clásica |
| G6 | Caso BIM/modelado/seguridad | Fuentes primarias, supuestos, threat model y reversibilidad |
| G7 | Defensa final | 20 minutos de preguntas; separar aprendido, consultado, supuesto y desconocido |

El paso global requiere superar todos los gates, mantener un repositorio con versiones, fuentes y pruebas, y no tener fallos críticos de seguridad. Una puntuación alta no compensa una atribución falsa, una afirmación de ventaja cuántica sin evidencia, una recomendación criptográfica sin fuente primaria o una práctica experimental no autorizada.

## 8. Aplicaciones prudentes y límites de inferencia

**Arquitectura y BIM.** Es válido estudiar cómo sensores cuánticos podrían aportar mediciones de alta sensibilidad en contextos concretos, o cómo una futura simulación cuántica podría abordar materiales. No es válido prometer que un edificio “cuántico”, un IFC o un gemelo digital obtendrá automáticamente una ventaja cuántica. La aplicación debe comenzar con el problema físico, la métrica y el baseline clásico.

**Modelado y razonamiento.** Un modelo cuántico debe incluir sistema, estado, observables, Hamiltoniano o circuito, medición, ruido y criterio de validación. Una visualización de amplitudes no prueba un fenómeno físico. La salida de un simulador no es un experimento y un artículo citado no sustituye la reproducción.

**Seguridad.** La amenaza relevante para sistemas digitales es la posible ruptura futura de criptografía vulnerable y la necesidad de migración. NIST identifica ML-KEM, ML-DSA y SLH-DSA en FIPS 203–205 y recomienda comenzar a migrar [9] [11]. ARKI debe tratar la seguridad como ingeniería de inventario, gestión de claves, firmas, actualizaciones y crypto-agility, no como marketing de “cifrado cuántico”.

**Madurez.** DOE señala que la naturaleza exacta de la ventaja cuántica, los recursos necesarios y los plazos siguen teniendo incertidumbre, y que persisten desafíos de ingeniería en empaquetado, detectores, controles, materiales e integración [8]. Toda hoja de ruta de ARKI debe conservar esa incertidumbre.

## 9. Unknowns pendientes de revisión humana

- No se definieron el nivel matemático inicial, el tiempo semanal, el presupuesto ni el entorno de ejecución de ARKI.
- No se determinó si ARKI tendrá acceso autorizado a hardware cuántico, laboratorios, datos BIM reales o material editorial con licencia.
- Los nombres, fechas y versiones de plataformas y estándares pueden cambiar; deben verificarse antes de cada cohorte.
- La disponibilidad, licencia y edición exacta de los libros candidatos requiere comprobación editorial o bibliotecaria.
- Oxford y MIT ofrecen modelos de referencia, pero sus requisitos y evaluaciones no constituyen una acreditación de ARKI.
- La transferencia a arquitectura, BIM y materiales es una hipótesis de aplicación; no se ha demostrado una ventaja cuántica para un caso de edificio concreto.
- Se requieren expertos de física cuántica, ingeniería de sistemas, seguridad y arquitectura para aprobar el proyecto final.

## 10. Límites, gobernanza y próxima revisión

Este informe no acredita conocimientos, no certifica seguridad, no recomienda desplegar criptografía por sí solo y no autoriza experimentos físicos. El material público consultado se usa como base de diseño curricular y trazabilidad. Las afirmaciones sobre libros están limitadas a su presencia como textos requeridos o referencias en syllabi oficiales. El contenido de un libro no se atribuye como aprendido si no se ha consultado legalmente y registrado.

Antes de marcar una competencia como adquirida, un revisor humano debe comprobar el artefacto correspondiente, ejecutar el código, revisar las fuentes y formular preguntas nuevas. Se recomienda revisar el currículo al menos anualmente o cuando MIT, Oxford, IBM, NIST o DOE actualicen sus páginas, estándares, cursos o hojas de ruta.

## References

[1]: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/pages/syllabus/ "MIT OpenCourseWare — Quantum Physics I syllabus"
[2]: https://ocw.mit.edu/courses/8-05-quantum-physics-ii-fall-2013/pages/syllabus/ "MIT OpenCourseWare — Quantum Physics II syllabus"
[3]: https://ocw.mit.edu/courses/8-06-quantum-physics-iii-spring-2018/pages/syllabus/ "MIT OpenCourseWare — Quantum Physics III syllabus"
[4]: https://www.ox.ac.uk/admissions/graduate/courses/msc-quantum-technologies "University of Oxford — MSc in Quantum Technologies"
[5]: https://quantum.cloud.ibm.com/learning/courses/basics-of-quantum-information "IBM Quantum Learning — Basics of quantum information"
[6]: https://www.nist.gov/quantum-information-science/quantum-sensing-explained "NIST — Quantum Sensing Explained"
[7]: https://www.energy.gov/topics/quantum-information-science "U.S. Department of Energy — Quantum Information Science"
[8]: https://www.quantum.gov/wp-content/uploads/2024/12/DOE_QIS_Roadmap_Final.pdf "DOE Office of Science — 2024 Quantum Information Science Applications Roadmap"
[9]: https://csrc.nist.gov/projects/post-quantum-cryptography "NIST CSRC — Post-Quantum Cryptography PQC"
[10]: https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/ "MIT OpenCourseWare — Quantum Physics I course page"
[11]: https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards "NIST — First three finalized post-quantum encryption standards"
