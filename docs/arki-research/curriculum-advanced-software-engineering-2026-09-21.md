# Ciclo formativo avanzado de Ingeniería de Software para ARKI

**Fecha de corte:** 2026-09-21  
**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Propósito:** proponer una ruta progresiva y evaluable para que ARKI desarrolle capacidades de ingeniería de software aplicables, cuando corresponda, a arquitectura, BIM, modelado, razonamiento asistido y seguridad.

## 1. Resumen ejecutivo

Este documento propone un currículo de 18–24 meses, organizado en cuatro fases: fundamentos, métodos de ingeniería, laboratorio/proyecto y evaluación profesional. La propuesta no equivale a una carrera universitaria acreditada ni acredita competencias por sí sola. Se inspira en guías curriculares y criterios oficiales, pero adapta su escala a un sistema de IA y a un contexto de investigación aplicada.

La base de cobertura combina: **SE 2014** de ACM/IEEE, **CS2023** de IEEE Computer Society, ACM y AAAI, **SWEBOK V4** de IEEE Computer Society, criterios ABET 2025–2026, procesos de ciclo de vida ISO/IEC/IEEE 12207, prácticas de desarrollo seguro NIST SSDF, principios CISA Secure by Design, el modelo de calidad ISO/IEC 25010, y la documentación primaria de buildingSMART sobre IFC. Estas fuentes describen áreas, resultados o procesos; no son, por sí mismas, cursos completos ni evidencia de aprendizaje.

La distinción epistemológica es obligatoria:

1. **Índice o plan de estudios:** una lista de temas, áreas o resultados recomendados por una universidad, sociedad profesional o organismo de acreditación.
2. **Texto recomendado o candidato:** una obra que podría apoyar un curso, sujeta a licencia, edición y revisión humana.
3. **Material público realmente consultado:** las páginas y extractos enlazados en este informe, consultados durante esta investigación. No se descargaron ni reprodujeron libros protegidos.
4. **Conocimiento que requeriría ingestión autorizada:** el texto íntegro de normas de pago, libros, manuales privados, repositorios con restricciones, documentación interna, datos de proyectos o cualquier corpus que no esté explícitamente disponible para su uso.

No se afirma que **ARKI haya leído libros completos**, que haya completado un grado, que posea certificaciones o que domine una norma sólo por aparecer en la bibliografía. Las capacidades deben demostrarse mediante artefactos, pruebas, revisiones y gates de paso.

## 2. Modelo de cobertura

### 2.1 Ejes y niveles

La cobertura se medirá en seis ejes, cada uno con tres niveles:

| Eje | Incluye | Nivel 1: reconocer | Nivel 2: aplicar | Nivel 3: justificar y verificar |
|---|---|---|---|---|
| Fundamentos computacionales | programación, estructuras de datos, algoritmos, sistemas, redes, bases de datos, matemática discreta, probabilidad y estadística | define y ejemplifica | implementa y prueba | compara alternativas y explica complejidad, supuestos y límites |
| Ingeniería del producto | requisitos, diseño, arquitectura, construcción, pruebas, mantenimiento, configuración y operaciones | identifica procesos y artefactos | produce un incremento reproducible | traza decisiones, riesgos, métricas y cambios |
| Método y colaboración | ciclo de vida, Agile/iteración, estimación, gestión, comunicación, ética y economía | describe roles y trade-offs | trabaja con issues, revisiones y entregas | negocia objetivos conflictivos y defiende decisiones ante stakeholders |
| Calidad y seguridad | atributos de calidad, verificación/validación, threat modeling, supply chain, privacidad y respuesta a vulnerabilidades | detecta riesgos básicos | automatiza controles y pruebas | presenta evidencia de seguridad, residual risk y plan de respuesta |
| Arquitectura, modelado y BIM | modelado conceptual, arquitectura de software, datos espaciales/semánticos, IFC, interoperabilidad y validación | lee modelos y esquemas | crea y transforma modelos | demuestra semántica, compatibilidad, validez y límites de intercambio |
| Razonamiento y sistemas asistidos | descomposición, evidencia, incertidumbre, evaluación de modelos y uso prudente de IA | separa hechos de hipótesis | construye argumentos y tests | calibra confianza, registra procedencia y gestiona riesgos de automatización |

La cobertura objetivo para una salida **apta para revisión humana** es: nivel 2 en los seis ejes; nivel 3 en ingeniería del producto, calidad/seguridad y método; y al menos nivel 2 con una demostración de interoperabilidad en arquitectura/BIM. El nivel 3 en razonamiento asistido no se infiere de respuestas lingüísticas: requiere un protocolo de evaluación independiente.

### 2.2 Resultados de salida

Al finalizar, ARKI debería poder, bajo supervisión humana adecuada:

- analizar un problema complejo y convertirlo en requisitos verificables;
- seleccionar y justificar un ciclo de vida, una arquitectura y un modelo de datos;
- implementar software mantenible con pruebas automatizadas, documentación y control de cambios;
- evaluar funcionalidad, rendimiento, seguridad, confiabilidad, mantenibilidad y compatibilidad;
- comunicar decisiones y trade-offs a públicos técnicos y no técnicos;
- trabajar con artefactos BIM/IFC sin confundir interoperabilidad sintáctica con equivalencia semántica;
- usar herramientas de IA o razonamiento como apoyo, no como autoridad única, conservando trazabilidad y revisión;
- identificar cuándo carece de evidencia, cuándo una norma está desactualizada y cuándo necesita una fuente o autorización adicional.

## 3. Ruta progresiva y cursos completos propuestos

La secuencia es propuesta, no un plan oficial de una institución. Cada curso incluye propósito, contenidos, laboratorio y evidencia de aprobación. La carga sugerida es de 6–8 semanas por curso a 8–12 horas semanales; los cursos pueden compactarse o ampliarse según la capacidad de evaluación disponible.

### Fase I — Fundamentos verificables

#### C1. Programación, herramientas y reproducibilidad

**Prerequisitos:** ninguno; alfabetización matemática básica.  
**Resultados:** implementar programas pequeños con tipos, funciones, módulos, excepciones, pruebas unitarias, control de versiones y documentación; explicar entradas, salidas, invariantes y fallos.  
**Métodos:** Python o TypeScript para prototipos; shell; Git; entornos aislados; revisión de código.  
**Laboratorio:** construir una utilidad de ingestión de datos con CLI, validación de esquema, logs, tests y ejecución reproducible.  
**Evaluación:** 40% pruebas y corrección, 25% revisión de código, 20% documentación/provenance, 15% defensa oral.  
**Gate:** ≥80% en tests funcionales y ningún defecto crítico sin documentar.

#### C2. Matemática discreta, algoritmos y datos

**Prerequisitos:** C1.  
**Resultados:** usar lógica, conjuntos, relaciones, grafos, inducción, complejidad asintótica, estructuras de datos, probabilidad elemental y estadística descriptiva para razonar sobre software.  
**Laboratorio:** resolver un problema de trazabilidad de dependencias y otro de validación de datos BIM; comparar al menos dos algoritmos con datos sintéticos.  
**Evaluación:** ejercicios razonados, experimento reproducible, informe de complejidad y análisis de errores.  
**Gate:** justificar la elección algorítmica y no sólo producir una salida correcta.

#### C3. Sistemas, redes, bases de datos y nube

**Prerequisitos:** C1–C2.  
**Resultados:** explicar procesos, memoria, concurrencia, almacenamiento, HTTP, autenticación, bases de datos relacionales y documentales, contenedores y principios de despliegue.  
**Laboratorio:** servicio pequeño con API, persistencia, migraciones, observabilidad, límites de recursos y recuperación de errores.  
**Evaluación:** pruebas de integración, diseño de esquema, análisis de fallos y operación local reproducible.  
**Gate:** demostrar aislamiento de secretos, manejo de errores y recuperación documentada.

### Fase II — Métodos de ingeniería de software

#### C4. Requisitos, dominio y modelado

**Prerequisitos:** C1–C3.  
**Resultados:** elicitar y normalizar requisitos funcionales y no funcionales; distinguir necesidad, decisión, restricción, supuesto y criterio de aceptación; modelar contexto, actores, datos, estados y dependencias.  
**Laboratorio:** caso de arquitectura/BIM: transformar una solicitud ambigua en backlog priorizado, glosario, casos de uso, requisitos de calidad, riesgos y matriz de trazabilidad.  
**Evaluación:** revisión con dos perfiles de stakeholder simulados, consistencia interna y cobertura de aceptación.  
**Gate:** no se acepta un requisito sin fuente, prioridad, criterio verificable y responsable de cambio.

#### C5. Diseño y arquitectura de software

**Prerequisitos:** C4.  
**Resultados:** diseñar componentes, interfaces, contratos, persistencia y despliegue; evaluar modularidad, acoplamiento, cohesión, escalabilidad, disponibilidad, seguridad y coste; registrar decisiones arquitectónicas (ADR).  
**Laboratorio:** dos arquitecturas alternativas para el mismo sistema, una modular monolítica y otra distribuida sólo si la evidencia lo justifica.  
**Evaluación:** revisión de arquitectura, threat model preliminar, pruebas de contrato y análisis de trade-offs.  
**Gate:** cada decisión importante debe vincular requisito, alternativa descartada, riesgo y evidencia.

#### C6. Construcción, pruebas y calidad

**Prerequisitos:** C5.  
**Resultados:** aplicar diseño orientado a interfaces, refactorización, pruebas unitarias, integración, sistema, propiedad basada en invariantes, pruebas de regresión, revisión estática y métricas de calidad.  
**Laboratorio:** desarrollar un servicio con pipeline de integración continua que bloquee regresiones y publique artefactos versionados.  
**Evaluación:** cobertura significativa, mutación o pruebas negativas, informe de defectos, revisión por pares y reproducibilidad.  
**Gate:** ninguna liberación con defecto crítico conocido; la cobertura no se usará como único indicador de calidad.

#### C7. Procesos, Agile/iteración, estimación y mantenimiento

**Prerequisitos:** C4–C6.  
**Resultados:** seleccionar un modelo de ciclo de vida adecuado; planificar iteraciones; estimar con incertidumbre; gestionar configuración, cambios, deuda técnica, incidentes y retiro.  
**Laboratorio:** mantener un producto durante tres iteraciones con requisitos cambiantes, releases, changelog, retrospectiva y análisis de coste.  
**Evaluación:** cumplimiento de objetivos, gestión de cambios, calidad del backlog, capacidad de explicar desviaciones y mejora entre iteraciones.  
**Gate:** demostrar que el proceso produce evidencia útil y no sólo ceremonias.

### Fase III — Seguridad, interoperabilidad y razonamiento aplicado

#### C8. Ingeniería de seguridad y privacidad

**Prerequisitos:** C5–C7.  
**Resultados:** integrar seguridad en el ciclo de vida; identificar activos, amenazas, abuso, controles, privacidad, vulnerabilidades de dependencias y riesgos de la cadena de suministro; responder y aprender de incidentes.  
**Métodos:** NIST SSDF, Secure by Design de CISA, mínimo privilegio, MFA cuando sea aplicable, logging, gestión de secretos, SBOM y revisión de dependencias.  
**Laboratorio:** threat model de una plataforma de proyectos o BIM, análisis SAST/DAST de un entorno de prueba, parche deliberado y postmortem.  
**Evaluación:** matriz de riesgos, controles implementados, evidencia de tests, informe de vulnerabilidad y plan de respuesta.  
**Gate:** bloqueo automático de secretos expuestos y vulnerabilidades críticas de demostración; la ausencia de hallazgos no se interpreta como seguridad total.

#### C9. Modelado semántico, BIM e interoperabilidad

**Prerequisitos:** C4–C5 y fundamentos de datos.  
**Resultados:** distinguir geometría, identidad, propiedades, relaciones, unidades, versiones, procedencia y semántica; leer y producir un subconjunto documentado de IFC; validar intercambios y reconocer pérdidas de información.  
**Laboratorio:** generar un modelo IFC pequeño de un activo construido, intercambiarlo entre herramientas abiertas, ejecutar validación oficial cuando sea posible y comparar una tabla de requisitos de información antes/después.  
**Aplicación prudente:** IFC es un estándar abierto y vendor-neutral de descripción digital del entorno construido; no garantiza por sí mismo que dos herramientas implementen el mismo subconjunto ni que la semántica de un proyecto quede completa.  
**Evaluación:** validez del archivo, trazabilidad de entidades y propiedades, prueba de round-trip, reporte de pérdidas y explicación de versión/MVD.  
**Gate:** no afirmar “interoperable” sin especificar versión, vista, formato, casos de prueba y resultados.

#### C10. Razonamiento asistido, evidencia y evaluación de IA

**Prerequisitos:** C4–C8.  
**Resultados:** descomponer preguntas, separar observación de inferencia, citar evidencia, expresar incertidumbre, detectar contradicciones, diseñar tests de regresión para respuestas y evaluar automatizaciones.  
**Métodos:** rúbricas de exactitud, completitud, trazabilidad, calibración, robustez y seguridad; NIST AI RMF como marco de riesgo, no como garantía de confiabilidad.  
**Laboratorio:** construir un evaluador de respuestas sobre requisitos o modelos, con conjunto de casos normales, ambiguos, adversariales y fuera de distribución.  
**Evaluación:** benchmark ciego, análisis de errores, calibración de confianza, procedencia de fuentes y decisión explícita de abstención.  
**Gate:** no usar una respuesta de IA como evidencia primaria en decisiones de seguridad, cumplimiento, estructura, coste o construcción sin verificación competente.

### Fase IV — Laboratorio/proyecto integrador y evaluación profesional

#### C11. DevSecOps, operación y gestión técnica

**Prerequisitos:** C6–C10.  
**Resultados:** operar un producto con CI/CD, observabilidad, gestión de configuración, controles de cambio, backups, respuesta a incidentes, releases y retirada.  
**Laboratorio:** pipeline con entornos separados, artefactos firmados o verificables cuando sea viable, escaneo de dependencias, rollback y runbook.  
**Evaluación:** simulacro de incidente, SLO/SLI apropiados, auditoría de logs, recuperación y revisión de costes.  
**Gate:** restauración comprobada desde backup y rollback ensayado; una declaración de disponibilidad sin prueba no cuenta.

#### C12. Proyecto de ingeniería de software para ARKI

**Prerequisitos:** C1–C11; aprobación de propuesta por revisión humana.  
**Propósito:** integrar ingeniería, modelado y razonamiento en un sistema pequeño pero realista.  
**Alcance recomendado:** una plataforma de apoyo a decisiones para un flujo arquitectónico/BIM, por ejemplo validación de requisitos de intercambio, consulta de un modelo IFC, generación de incidencias trazables y panel de evidencia. No debe controlar directamente obras, estructuras, instalaciones críticas ni decisiones regulatorias.  
**Entregables:** declaración de problema y límites; requisitos y criterios de aceptación; modelo de dominio; ADR; código versionado; esquema de datos; dataset público o sintético; pruebas; threat model; SBOM si procede; documentación de despliegue; evaluación de interoperabilidad; informe de riesgos y limitaciones; demo reproducible; manual de operación; retrospectiva.  
**Evaluación:** 20% ingeniería de requisitos y trazabilidad, 20% diseño/arquitectura, 20% implementación y pruebas, 15% seguridad y privacidad, 10% interoperabilidad/modelado, 10% evidencia y razonamiento, 5% comunicación.  
**Gate final:** revisión humana independiente, reproducibilidad desde entorno limpio, evidencia de control de cambios, ningún riesgo crítico sin aceptación explícita y capacidad de explicar qué no sabe el sistema.

## 4. Laboratorio transversal y reglas de evidencia

Cada curso debe mantener un repositorio de trabajo con commits, issue tracker, decisiones, resultados de pruebas, fuentes, fecha de consulta, versión de herramientas y un registro de cambios. Los datos reales de proyectos, planos, modelos, credenciales, conversaciones privadas y documentación propietaria sólo pueden usarse con autorización explícita, minimización y controles de acceso.

El laboratorio debe preferir datos sintéticos, ejemplos públicos y pequeños subconjuntos creados para la evaluación. En BIM, el artefacto mínimo debe conservar identificadores, unidades, relaciones y procedencia. En razonamiento, cada afirmación importante debe tener fuente, nivel de confianza y una ruta de verificación. En seguridad, no se deben probar técnicas ofensivas fuera de entornos autorizados.

## 5. Evaluación, gates y criterios de paso

### 5.1 Gates progresivos

| Gate | Evidencia mínima | Criterio de paso |
|---|---|---|
| G0 — Preparación | entorno reproducible, control de versiones, política de datos y límites | revisión humana de riesgos y autorización del caso de uso |
| G1 — Fundamentos | tres implementaciones con tests y análisis | ≥80% de rúbrica; sin fallos críticos no reconocidos |
| G2 — Ingeniería | requisitos, diseño, código, pruebas y trazabilidad | cobertura de requisitos ≥90% en muestra auditada; decisiones justificadas |
| G3 — Seguridad/interoperabilidad | threat model, controles, modelo BIM/IFC, validaciones | cada riesgo alto tiene control, aceptación o plan; no se afirma compatibilidad sin prueba |
| G4 — Operación | pipeline, logs, backup, rollback, runbook | recuperación demostrada y revisión de configuración |
| G5 — Capstone | demo reproducible, informe, defensa y revisión adversarial | ≥80% global, ≥70% en cada eje, cero bloqueadores abiertos |
| G6 — Revisión humana | dos evaluadores independientes y registro de desacuerdos | decisión explícita: apto, apto con restricciones o no apto |

### 5.2 Rúbrica común

Cada artefacto se califica de 0 a 4 en corrección, trazabilidad, mantenibilidad, seguridad, comunicación y manejo de incertidumbre. Un 4 requiere evidencia y explicación de límites; un 3 indica desempeño aplicable con defectos menores; un 2 indica prototipo incompleto; un 1 indica afirmaciones sin soporte; un 0 indica ausencia o incumplimiento. La nota global no compensa un fallo crítico en seguridad, privacidad, licenciamiento, integridad de datos o reproducibilidad.

La evaluación debe mezclar pruebas directas, revisión de artefactos, defensa oral, escenarios nuevos, casos adversariales y evaluación longitudinal. Las respuestas correctas en casos conocidos no son suficientes para demostrar transferencia.

## 6. Bibliografía candidata trazable

La siguiente lista distingue orientación curricular, estándares/documentación primaria y textos de apoyo. Es una **bibliografía candidata**, no un registro de lecturas completadas por ARKI.

### 6.1 Guías curriculares y cuerpos de conocimiento

- ACM/IEEE Computer Society, *Software Engineering 2014: Curriculum Guidelines for Undergraduate Degree Programs in Software Engineering*. Es una guía de currículo y resultados, no un curso impartido ni evidencia de aprendizaje. [1]
- IEEE Computer Society, ACM y AAAI, *Computer Science Curricula 2023*. Orienta conocimientos y competencias de grado en computación; se usa aquí como marco de fundamentos, no como sustituto de práctica. [2]
- IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK) Guide V4.0*. Su propia documentación distingue un cuerpo de conocimiento de un currículo; se usa para comprobar cobertura, no para afirmar ingestión integral. [3]
- ABET, *Criteria for Accrediting Computing Programs, 2025–2026* y *Criteria for Accrediting Engineering Programs, 2025–2026*. Se usan como criterios de resultados, currículo, evaluación y mejora continua; no implican acreditación de ARKI. [4] [5]

### 6.2 Procesos, calidad y seguridad

- ISO/IEC/IEEE 12207:2026, *Systems and software engineering — Software life cycle processes*, como referencia vigente localizada en el registro de IEEE; la edición 2017 consultada en ISO aparece retirada/sustituida. La norma completa es material sujeto a condiciones de acceso. [6] [7]
- NIST SP 800-218, *Secure Software Development Framework (SSDF) Version 1.1*. Publicación gubernamental primaria consultada en su página oficial; se usa para prácticas y vocabulario de desarrollo seguro. [8]
- CISA, *Secure by Design*. Guía pública sobre responsabilidad del fabricante, seguridad incorporada al diseño, MFA, logging y otras capacidades. [9]
- ISO/IEC 25010:2023, *Systems and software engineering — Product quality model*. Se recomienda como estándar candidato para la rúbrica de calidad; la página pública consultada permite identificar el estándar, pero no equivale a haber leído la norma completa. [10]

### 6.3 Arquitectura, BIM y razonamiento

- buildingSMART International, *Industry Foundation Classes (IFC)* y documentación IFC 4.3.2.0/ISO 16739-1:2024. Son fuentes primarias para esquema, interoperabilidad, formatos y validación; el uso requiere comprobar versión, vista y alcance. [11] [12]
- NIST, *AI Risk Management Framework (AI RMF 1.0)* y recursos asociados. Se usa como marco voluntario para gobernanza, mapeo, medición y gestión de riesgos de IA; no certifica exactitud de un sistema. [13]

### 6.4 Textos pedagógicos candidatos

Se pueden proponer libros de ingeniería de software, arquitectura, bases de datos, sistemas, seguridad y pruebas sólo después de verificar edición, licencia, disponibilidad y pertinencia con la revisión humana. No se enumeran como “aprendidos” y no se descargaron ni reprodujeron libros protegidos. Para una eventual ingestión, debe existir autorización, copia legítima, registro de versión, alcance y eliminación conforme a la licencia.

## 7. Materiales públicos realmente consultados

Durante la investigación se consultaron las páginas públicas de ACM/IEEE SE 2014, ABET 2025–2026, University of Arizona BS Software Engineering, NIST SP 800-218, CISA Secure by Design, IEEE Computer Society SWEBOK, IEEE/ISO 12207, buildingSMART IFC, NIST AI RMF y la página de CS2023. Se leyeron descripciones, extractos y secciones pertinentes; se contrastaron fechas y estados de estándares cuando la página los exponía.

La página de University of Arizona se utilizó como ejemplo de un programa universitario real que declara requisitos, arquitectura, assurance, gestión, estimación, DevOps, Agile, integración continua y experiencias de diseño. No se presenta como la única estructura correcta ni se afirma que ARKI haya cursado sus asignaturas.

No se descargaron libros protegidos. Una guía, un índice, una página de programa o una bibliografía no demuestran que ARKI haya leído el material completo. Los estándares ISO/IEC/IEEE pueden tener acceso restringido, y su cita no equivale a ingestión autorizada.

## 8. Aplicaciones prudentes a ARKI

**Arquitectura:** ARKI puede generar alternativas, ADR, matrices de trade-offs y preguntas de revisión. Las decisiones sobre seguridad física, estructura, cumplimiento, coste, habitabilidad o permisos requieren profesionales responsables y fuentes de proyecto.

**BIM y modelado:** ARKI puede ayudar a consultar esquemas, comprobar propiedades, detectar inconsistencias y documentar transformaciones. No debe inferir que un archivo IFC válido representa todo el modelo requerido ni que la validación sintáctica prueba la corrección constructiva.

**Razonamiento:** se debe conservar la cadena afirmación–fuente–transformación–conclusión. Cuando falten datos, ARKI debe abstenerse o pedir verificación. La fluidez lingüística no es una métrica de exactitud.

**Seguridad:** las prácticas NIST SSDF y CISA Secure by Design deben incorporarse desde requisitos hasta operación. Las pruebas ofensivas deben limitarse a entornos y datos autorizados; las vulnerabilidades reales deben manejarse mediante divulgación y respuesta responsable.

**IA integrada:** el AI RMF puede organizar riesgos de gobernanza, medición y gestión. No debe usarse como sello de seguridad o como sustituto de pruebas específicas del sistema.

## 9. Unknowns y preguntas abiertas

- No se conoce el nivel inicial de programación, matemática, sistemas, BIM, idiomas ni disponibilidad de herramientas de ARKI.
- No está definido si el objetivo es un plan autodidacta, una certificación, una evaluación interna, un programa universitario equivalente o preparación para un equipo de producción.
- No se conocen jurisdicción, requisitos regulatorios, dominios de arquitectura, clasificación de información, modelos de amenaza ni responsables humanos.
- No se ha fijado el entorno técnico final: lenguaje, proveedor cloud, repositorio, herramientas BIM, formatos permitidos y política de dependencias.
- El estado de algunas normas cambia. ISO muestra 12207:2017 como retirada y enlaza una versión 2026; debe verificarse la edición adquirida antes de convertirla en requisito.
- La página pública de ISO/IEC 25010 consultada identifica el estándar, pero no expone todo su contenido; se requiere acceso legítimo para construir una rúbrica normativa detallada.
- La interoperabilidad IFC depende de versión, implementación y vista; se necesita un conjunto de casos de prueba del proyecto.
- La evaluación de razonamiento necesita un benchmark con criterios y datos independientes; no se puede inferir a partir de unas pocas conversaciones.

## 10. Límites y controles

- Este informe es diseño curricular e investigación documental, no acreditación, licencia profesional, auditoría de seguridad ni dictamen de ingeniería.
- La bibliografía no se convierte en conocimiento aprendido. Sólo se consultaron materiales públicos indicados y extractos pertinentes.
- No se debe cargar contenido protegido, datos personales, planos confidenciales, modelos propietarios ni secretos sin autorización, base legal y controles técnicos.
- Las demos deben usar datos sintéticos o públicos y entornos aislados. No se deben ejecutar pruebas de intrusión contra sistemas de terceros.
- Las salidas generadas por ARKI deben someterse a revisión humana competente en decisiones de arquitectura, construcción, seguridad, legalidad, costes, accesibilidad y cumplimiento.
- La cobertura propuesta puede quedar obsoleta por cambios de herramientas, estándares o riesgos; se recomienda revisión semestral y revisión extraordinaria ante incidentes.
- “Listo para revisión humana” significa que el currículo y sus evidencias están preparados para inspección. No significa que ARKI haya aprobado los gates.

## 11. Decisión solicitada a la revisión humana

La persona revisora debería aprobar o modificar: (a) objetivos y dominio del capstone; (b) nivel inicial y duración; (c) herramientas autorizadas; (d) datos y licencias; (e) umbrales de paso; (f) responsables de revisar seguridad, BIM, arquitectura y cumplimiento; y (g) qué competencias pueden declararse públicamente después de la evaluación.

## References

[1]: https://www.acm.org/binaries/content/assets/education/se2014.pdf "ACM/IEEE Software Engineering 2014 Curriculum Guidelines"
[2]: https://www.computer.org/press-room/new-cs2023-curriculum-guide "IEEE Computer Society, ACM and AAAI CS2023 curriculum guidance"
[3]: https://www.computer.org/education/bodies-of-knowledge/software-engineering "IEEE Computer Society Software Engineering Body of Knowledge (SWEBOK)"
[4]: https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-computing-programs-2025-2026/ "ABET Criteria for Accrediting Computing Programs 2025–2026"
[5]: https://www.abet.org/accreditation/accreditation-criteria/criteria-for-accrediting-engineering-programs-2025-2026/ "ABET Criteria for Accrediting Engineering Programs 2025–2026"
[6]: https://standards.ieee.org/ieee/12207/11416 "IEEE/ISO/IEC 12207:2026 Software life cycle processes"
[7]: https://www.iso.org/standard/63712.html "ISO/IEC/IEEE 12207:2017 status and abstract"
[8]: https://csrc.nist.gov/pubs/sp/800/218/final "NIST SP 800-218 Secure Software Development Framework Version 1.1"
[9]: https://www.cisa.gov/securebydesign "CISA Secure by Design"
[10]: https://www.iso.org/obp/ui/#iso:std:iso-iec:25010:en "ISO/IEC 25010 Online Browsing Platform entry"
[11]: https://technical.buildingsmart.org/standards/ifc/ "buildingSMART IFC introduction and technical documentation"
[12]: https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/ "buildingSMART IFC standard, versions and validation"
[13]: https://www.nist.gov/itl/ai-risk-management-framework "NIST AI Risk Management Framework"
[14]: https://engineering.arizona.edu/majors/software "University of Arizona Software Engineering degree and focus areas"

---

**Estado final del documento:** `READY_FOR_HUMAN_REVIEW`

**Criterio de no sobreafirmación:** este informe describe una ruta propuesta y materiales consultados; no declara lectura íntegra de libros, dominio certificado ni aprobación de ARKI.
