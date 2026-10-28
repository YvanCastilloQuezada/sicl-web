# ARKI — Ciclo formativo avanzado de White Hat Hacking y Ciberseguridad Defensiva

**Estado:** `READY_FOR_HUMAN_REVIEW`  
**Fecha de investigación:** 2026-09-21  
**Tema:** ruta progresiva, ética y técnicamente acotada para que ARKI desarrolle capacidades de seguridad ofensiva autorizada, defensa, razonamiento y aplicación prudente a arquitectura/BIM.

## 1. Resumen ejecutivo

Se propone un ciclo de 12 cursos y un proyecto final, organizado en cuatro etapas: fundamentos, métodos, laboratorio y evaluación. La ruta no equivale a una certificación profesional ni a una afirmación de que ARKI haya completado o leído materiales completos. Se construye a partir de **programas universitarios públicos**, **estándares y guías técnicas primarias** y **laboratorios deliberadamente vulnerables o de entrenamiento**.

El principio rector es “**autorización, mínima intrusión, evidencia reproducible y remediación verificable**”. Las prácticas ofensivas se limitan a laboratorios propios, CTF educativos o activos expresamente incluidos en una política de divulgación; no se propone escanear, explotar, persistir, exfiltrar o pivotar sobre terceros sin autorización escrita. La formación defensiva tiene el mismo peso que la ofensiva: gobierno de riesgo, diseño seguro, telemetría, detección, respuesta, recuperación, privacidad y comunicación.

La pertinencia para arquitectura y BIM es real pero acotada. Un modelo IFC o un flujo openBIM debe tratarse como activo de información y cadena de suministro: control de acceso, integridad, validación de esquemas, requisitos de información, intercambio y trazabilidad. No se debe inferir que IFC o IDS sean, por sí solos, controles de ciberseguridad; su función primaria es interoperabilidad y calidad de información. Para edificios conectados, IoT, BMS y otros sistemas ciberfísicos se requiere además un análisis específico de seguridad operacional y continuidad.

## 2. Alcance, cobertura y modelo de competencia

### 2.1 Cobertura

La cobertura propuesta incluye:

1. **Fundamentos:** redes, sistemas operativos, programación, datos, criptografía aplicada, identidad y control de acceso.
2. **Seguridad de software y web:** modelado de amenazas, validación de entradas, autenticación, sesiones, APIs, dependencias y SDLC seguro.
3. **Seguridad de redes y endpoints:** segmentación, hardening, firewalls, detección, registros, configuración y gestión de vulnerabilidades.
4. **White hat autorizado:** alcance, reglas de compromiso, reconocimiento controlado, análisis de vulnerabilidades, pruebas de explotación no destructivas, evidencia y reporte.
5. **Defensa:** threat modeling, MITRE ATT&CK como lenguaje de comportamiento, ingeniería de detección, triaje, forense inicial, respuesta y recuperación.
6. **Gobierno y ética:** autorización, privacidad, divulgación coordinada, cadena de custodia, gestión de riesgo y comunicación ejecutiva.
7. **BIM/arquitectura:** clasificación de activos digitales, flujos IFC/IDS, validación de intercambio, amenazas a repositorios y colaboración, y conexión prudente con CPS/BMS.
8. **Razonamiento y evaluación:** hipótesis explícitas, separación entre observación e inferencia, reproducibilidad, análisis de incertidumbre y revisión humana.

### 2.2 Modelo de cobertura por capacidad

Se recomienda un mapa de evidencias, no una lista de lecturas. Cada capacidad se marca como **C (concepto)**, **P (práctica en laboratorio autorizado)**, **E (evidencia evaluable)** y **R (revisión humana)**.

| Dominio | C | P | E | R | Resultado mínimo |
|---|---:|---:|---:|---:|---|
| Fundamentos de computación y redes | Sí | Sí | Sí | Sí | Explicar y diagnosticar una red aislada reproducible |
| Criptografía, identidad y acceso | Sí | Sí | Sí | Sí | Elegir controles sin inventar garantías criptográficas |
| Secure SDLC y software | Sí | Sí | Sí | Sí | Encontrar, corregir y volver a probar defectos en código de laboratorio |
| Web/API testing | Sí | Sí | Sí | Sí | Informe WSTG con impacto, evidencia y remediación |
| Pentest autorizado | Sí | Sí | Sí | Sí | Plan y reporte conforme a alcance y reglas de compromiso |
| Defensa de red y endpoint | Sí | Sí | Sí | Sí | Hardening + telemetría + detección verificable |
| Incidentes y forense inicial | Sí | Sí | Sí | Sí | Línea temporal, contención, recuperación y lecciones aprendidas |
| Threat modeling / ATT&CK | Sí | Sí | Sí | Sí | Mapeo de amenazas a técnicas, controles y detecciones |
| Gobierno, ética y divulgación | Sí | Sí | Sí | Sí | Decidir cuándo detenerse, escalar y reportar |
| BIM/openBIM y CPS | Sí | Sí | Sí | Sí | Validar intercambio y riesgos sin confundir calidad con seguridad |
| Razonamiento y documentación | Sí | Sí | Sí | Sí | Registro de hipótesis, incertidumbre, fuentes y revisión |

El estándar de dominio no es “reconocer términos”, sino producir artefactos auditables: diagrama de alcance, inventario, amenaza, prueba, log, parche/configuración, evidencia antes/después, reporte y retrospectiva.

## 3. Ruta progresiva: cursos completos propuestos

Los títulos siguientes son **cursos propuestos para ARKI**, no cursos oficiales que ARKI haya cursado. Las referencias universitarias se usan para inspirar alcance y secuencia, no para atribuir matrícula, aprobación o lectura completa.

### Etapa I — Fundamentos (cursos 1–4)

#### Curso 1 — Sistemas, redes y automatización segura

**Propósito:** adquirir la base para razonar sobre un sistema antes de probarlo.  
**Módulos:** Linux/Windows en entorno aislado; procesos, memoria y permisos; TCP/IP, DNS, HTTP(S), TLS, routing y segmentación; shell y Python para automatización reproducible; Git y gestión de evidencias.  
**Laboratorio:** dos máquinas virtuales y una red privada; capturas de tráfico propias; inventario y diagrama de flujo; script que recoja sólo metadatos del laboratorio.  
**Producto:** arquitectura del laboratorio, threat model inicial y cuaderno reproducible.  
**Paso:** explicar cada flujo y obtener al menos 80% en una prueba conceptual; ninguna acción fuera del rango autorizado.

#### Curso 2 — Programación, datos y fundamentos de sistemas seguros

**Propósito:** entender cómo aparecen y se mitigan defectos en código y datos.  
**Módulos:** tipos, memoria, errores, excepciones, serialización, SQL, validación de entrada, gestión de secretos, logs y pruebas; principios de autenticación, autorización y mínimo privilegio.  
**Laboratorio:** aplicación local con vulnerabilidades intencionales; escribir pruebas de seguridad, corregir defectos y demostrar que la corrección no rompe el comportamiento legítimo.  
**Producto:** diff de código, tests, matriz de riesgo y explicación de límites.  
**Paso:** corregir vulnerabilidades de laboratorio y documentar causa raíz, no sólo aplicar un parche superficial.

#### Curso 3 — Criptografía aplicada, identidad y privacidad

**Propósito:** usar criptografía como control, no como palabra mágica.  
**Módulos:** confidencialidad, integridad, autenticidad, hash, MAC, cifrado autenticado, firmas, PKI, intercambio de claves, gestión y rotación de secretos, autenticación multifactor, autorización y minimización de datos.  
**Laboratorio:** verificar firmas y certificados en un entorno propio; comparar configuración segura/insegura; diseñar una política de claves y recuperación.  
**Producto:** decisión técnica con amenaza, propiedad de seguridad, control, supuesto y prueba.  
**Paso:** distinguir autenticación de autorización y demostrar qué protege cada control y qué no protege.

#### Curso 4 — Gobierno, ética, riesgo y reglas de compromiso

**Propósito:** establecer la frontera legal y operativa antes de cualquier prueba.  
**Módulos:** activos, propietarios, autorización escrita, alcance/allowlist, ventanas, contactos, datos sensibles, criterios de parada, evidencias, divulgación coordinada, privacidad, cadena de custodia y comunicación.  
**Laboratorio:** redactar una política de divulgación inspirada en la plantilla CISA y un Rules of Engagement para una red ficticia.  
**Producto:** autorización, matriz de alcance y procedimiento de escalamiento.  
**Paso:** rechazar correctamente una solicitud ambigua o fuera de alcance y justificar la decisión.

### Etapa II — Métodos ofensivos y defensivos (cursos 5–8)

#### Curso 5 — Secure SDLC, threat modeling y DevSecOps

**Propósito:** anticipar y reducir vulnerabilidades durante el diseño y entrega.  
**Módulos:** activos y límites de confianza; abuso/mal uso; STRIDE como heurística a validar; requisitos; revisión de código; SAST/DAST/dependencias; secretos; CI/CD; SBOM y gestión de proveedores; NIST SSDF.  
**Laboratorio:** pipeline local que ejecute tests, análisis y controles de dependencias sobre una aplicación de prueba.  
**Producto:** threat model, backlog priorizado, pipeline y evidencia de remediación.  
**Paso:** vincular cada hallazgo a riesgo, control, propietario, criterio de aceptación y prueba de regresión.

#### Curso 6 — Seguridad web y API con OWASP WSTG

**Propósito:** aprender pruebas web sistemáticas, no explotación improvisada.  
**Módulos:** configuración, identidad, autenticación, autorización, sesiones, validación, errores, criptografía, lógica de negocio, APIs, clientes y reporting.  
**Laboratorio:** OWASP Juice Shop local, sin exposición pública; probar casos permitidos y documentar hallazgos.  
**Producto:** informe técnico y ejecutivo con severidad justificada, reproducción mínima, impacto, remediación y retest.  
**Paso:** cubrir el alcance acordado, evitar datos reales y obtener valoración aprobatoria de un revisor humano.

#### Curso 7 — Seguridad de redes, endpoints y nube

**Propósito:** diseñar capas de prevención, detección y contención.  
**Módulos:** hardening, configuración segura, segmentación, firewalls, VPN, DNS, gestión de parches, EDR/NDR, logging, IAM, almacenamiento y secretos en nube, backups y restauración.  
**Laboratorio:** endurecer una red aislada, generar eventos benignos, verificar alertas y restaurar un servicio.  
**Producto:** baseline, matriz de controles, consultas de detección y evidencia antes/después.  
**Paso:** reducir superficie sin dejar el sistema inoperable y explicar falsos positivos/negativos.

#### Curso 8 — Threat intelligence, ATT&CK y detección

**Propósito:** convertir observaciones de adversarios en hipótesis defensivas.  
**Módulos:** ciclo de inteligencia; tácticas y técnicas ATT&CK; mapeo de comportamiento; telemetría; detecciones; cobertura; priorización; purple-team seguro.  
**Laboratorio:** ejecutar únicamente comportamientos benignos de un emulador/CTF dentro del laboratorio, mapearlos a ATT&CK y crear detecciones.  
**Producto:** matriz técnica–log–detección–respuesta con huecos explícitos.  
**Paso:** no confundir una técnica de ATT&CK con una prueba de que ocurrió un ataque; toda inferencia debe citar evidencia.

### Etapa III — Laboratorio, respuesta y especialización (cursos 9–11)

#### Curso 9 — Pentest autorizado, análisis de vulnerabilidades y reporte

**Propósito:** aplicar el ciclo completo de evaluación técnica con control de riesgo.  
**Módulos:** planificación; descubrimiento; enumeración; análisis; validación no destructiva; límites de explotación; evidencia; priorización; mitigación; retest; comunicación.  
**Marco:** NIST SP 800-115 y controles de autorización de CISA; WSTG para web; ATT&CK para describir comportamientos, no para justificar intrusión.  
**Laboratorio:** escenario propio con servicios deliberadamente vulnerables y snapshot de recuperación.  
**Producto:** plan, diario de pruebas, reporte, anexos de evidencia y carta de retest.  
**Paso:** cero violaciones de alcance; si aparece información sensible, detenerse, preservar lo mínimo y escalar.

#### Curso 10 — Detección, respuesta a incidentes y forense inicial

**Propósito:** pasar de la alerta a una decisión defendible.  
**Módulos:** preparación; intake y triaje; adquisición mínima; integridad de evidencia; línea temporal; contención; erradicación; recuperación; comunicación; métricas y lecciones aprendidas.  
**Laboratorio:** escenario CISA/cyber-range o dataset sintético; analizar logs propios, identificar alcance y proponer acciones reversibles.  
**Producto:** informe de incidente, timeline, decisiones, indicadores y plan de mejora.  
**Paso:** distinguir hechos observados, hipótesis y decisiones; no destruir evidencia ni atribuir actor sin base.

#### Curso 11 — Seguridad BIM, openBIM y sistemas ciberfísicos

**Propósito:** aplicar el pensamiento de seguridad a información de diseño, coordinación y operación.  
**Módulos:** inventario de activos BIM; repositorios y CDE; roles y permisos; versiones y procedencia; amenazas a intercambio; IFC 4.3; IDS 1.0; validación; APIs y automatización; BMS/IoT/CPS; seguridad operacional y continuidad.  
**Laboratorio:** usar archivos de prueba o sintéticos; validar IFC; crear un requisito IDS de información; verificar control de acceso y trazabilidad en un repositorio local; modelar un flujo BMS sin conectarlo a instalaciones reales.  
**Producto:** threat model BIM/CPS, matriz de controles y prueba de validación.  
**Paso:** demostrar que la conformidad IFC/IDS es calidad/interoperabilidad, no garantía integral de confidencialidad, integridad o disponibilidad.

### Etapa IV — Integración y evaluación (curso 12 + capstone)

#### Curso 12 — Razonamiento de seguridad, comunicación y revisión humana

**Propósito:** convertir resultados técnicos en decisiones claras y revisables.  
**Módulos:** hipótesis y falsabilidad; análisis de incertidumbre; calibración de severidad; sesgos; documentación; revisión por pares; comunicación a dirección, diseño, operaciones y legal; actualización de fuentes.  
**Laboratorio:** revisar un informe con afirmaciones mezcladas; separar fuente, observación, inferencia y recomendación; producir una versión corregida.  
**Producto:** registro de decisiones y memo ejecutivo con límites.  
**Paso:** ninguna afirmación crítica sin fuente o evidencia; los unknowns deben quedar explícitos.

#### Capstone — Evaluación defensiva autorizada de un entorno BIM/servicio

**Alcance:** entorno sintético o propiedad de ARKI expresamente autorizada. Incluirá CDE/repo BIM, servicio web/API ficticio, identidad, logs y una vista de operación ciberfísica simulada.  
**Fases:** (1) autorización y activos; (2) threat model y plan; (3) pruebas no destructivas; (4) hardening; (5) detecciones y escenario de incidente; (6) retest; (7) reporte técnico/ejecutivo; (8) retrospectiva.  
**Entregables:** carta de alcance; diagrama; inventario; matriz de amenazas; diario; hallazgos; configuración/parches; logs y evidencias; reporte; plan de remediación; retest; declaración de límites y fuentes.  
**Restricciones:** no producción ni terceros sin permiso; no denegación de servicio, ingeniería social, persistencia, exfiltración, movimiento lateral real o extracción de PII; snapshots y restauración obligatorios.

## 4. Materiales públicos consultados versus bibliografía candidata

### 4.1 Materiales públicos realmente consultados en esta investigación

Se consultaron páginas públicas y extractos web de los siguientes recursos. Esto **no significa** que ARKI haya leído el documento completo, cursado la asignatura o ingerido todos sus materiales:

- NIST SP 800-181 Rev. 1, página oficial del NICE Framework: describe tareas, conocimientos, habilidades, competencias y roles; la propia página advierte que los componentes actuales se mantienen en el Resource Center.
- NIST SP 800-115, página oficial de Technical Guide to Information Security Testing and Assessment: planificación y conducción de pruebas, análisis de hallazgos y mitigación; publicada en 2008.
- NIST CSWP 29, CSF 2.0: taxonomía de resultados de alto nivel y funciones de gestión de riesgo; publicado el 2024-02-26.
- MITRE ATT&CK, página oficial: base abierta de tácticas y técnicas basada en observaciones del mundo real.
- OWASP Web Security Testing Guide, página del proyecto: versión estable v4.2 indicada en la página; v5.0 aparece como desarrollo. Se usó la página y no se descargó ni reprodujo el PDF.
- CIS Critical Security Controls v8.1, página oficial: salvaguardas priorizadas y actualización de alineación con CSF 2.0.
- Georgia Tech OMS Cybersecurity Curriculum: página pública con áreas de especialización, cursos descritos, laboratorios y practicum. Se utilizó como referencia curricular, no como evidencia de matrícula.
- Carnegie Mellon CyLab, lista pública de cursos de security and privacy: se verificó la existencia/listado de áreas como ethical penetration testing, network defenses, software security, incident response-related topics y policy/governance.
- Stanford CS155 Computer and Network Security, página pública de Spring 2026: principios de sistemas seguros, ejemplos prácticos, proyectos de control hijacking, web y network security. Los ejercicios no se reprodujeron ni ejecutaron contra terceros.
- NIST SP 800-61 Rev. 3, respuesta a incidentes: recomendaciones integradas con CSF 2.0; publicado en 2025.
- NIST SP 800-218 SSDF v1.1: prácticas de alto nivel para integrar desarrollo seguro en SDLC; publicado en 2022.
- Plantilla CISA Vulnerability Disclosure Policy: autorización, alcance, métodos no autorizados, parada ante datos sensibles y reporte.
- buildingSMART IFC: IFC 4.3.2.0 como versión oficial indicada por buildingSMART, ISO 16739-1:2024, y servicio oficial de validación.
- buildingSMART IDS: IDS 1.0 aprobado como estándar en 2024 para requisitos de información interpretables por computadora y comprobación automática sobre IFC.
- OWASP Juice Shop: aplicación deliberadamente insegura para formación, demos, CTF y prueba de herramientas; se considera sólo para despliegue local/autorizado.
- CISA Cyber Range Training Events: descripción pública de clases virtuales con laboratorios guiados para investigar, remediar y responder.

### 4.2 Bibliografía candidata trazable

La siguiente bibliografía es una **lista de consulta propuesta**, no una declaración de conocimiento aprendido. Se indican fuentes primarias o institucionales y el uso curricular; cada edición o versión debe verificarse de nuevo antes de incorporarla a un syllabus.

1. Petersen, Santos, Wetzel y Smith, **NIST SP 800-181 Rev. 1: Workforce Framework for Cybersecurity (NICE Framework)**, NIST, 2020. DOI: [10.6028/NIST.SP.800-181r1](https://doi.org/10.6028/NIST.SP.800-181r1). Uso: competencias y roles.
2. Scarfone, Souppaya, Cody y Orebaugh, **NIST SP 800-115: Technical Guide to Information Security Testing and Assessment**, NIST, 2008. DOI: [10.6028/NIST.SP.800-115](https://doi.org/10.6028/NIST.SP.800-115). Uso: proceso de testing.
3. Pascoe, Quinn y Scarfone, **NIST CSWP 29: The NIST Cybersecurity Framework (CSF) 2.0**, NIST, 2024. DOI: [10.6028/NIST.CSWP.29](https://doi.org/10.6028/NIST.CSWP.29). Uso: gobierno y riesgo.
4. Nelson, Rekhi, Souppaya y Scarfone, **NIST SP 800-61 Rev. 3: Incident Response Recommendations and Considerations for Cybersecurity Risk Management**, NIST, 2025. DOI: [10.6028/NIST.SP.800-61r3](https://doi.org/10.6028/NIST.SP.800-61r3). Uso: respuesta.
5. Souppaya, Scarfone y Dodson, **NIST SP 800-218: Secure Software Development Framework (SSDF) Version 1.1**, NIST, 2022. DOI: [10.6028/NIST.SP.800-218](https://doi.org/10.6028/NIST.SP.800-218). Uso: SDLC seguro.
6. **MITRE ATT&CK**, knowledge base oficial, [attack.mitre.org](https://attack.mitre.org/). Uso: modelado y detección; consultar la versión vigente al evaluar.
7. **OWASP Web Security Testing Guide**, proyecto oficial, [owasp.org/projects/web-security-testing-guide](https://owasp.org/projects/web-security-testing-guide). Uso: metodología web; verificar release vigente.
8. **CIS Critical Security Controls v8.1**, Center for Internet Security, [cisecurity.org/controls/v8-1](https://www.cisecurity.org/controls/v8-1). Uso: salvaguardas priorizadas.
9. Georgia Tech, **OMS Cybersecurity Curriculum**, [pe.gatech.edu/degrees/cybersecurity/curriculum](https://pe.gatech.edu/degrees/cybersecurity/curriculum). Uso: contraste universitario y practicum.
10. Carnegie Mellon CyLab, **Security and privacy courses**, [cylab.cmu.edu/education/courses.html](https://www.cylab.cmu.edu/education/courses.html). Uso: contraste de cursos y especializaciones.
11. Stanford, **CS155 Computer and Network Security**, [cs155.stanford.edu](https://cs155.stanford.edu/). Uso: fundamentos y evaluación práctica.
12. CISA, **Vulnerability Disclosure Policy Template**, [cisa.gov/vulnerability-disclosure-policy-template](https://www.cisa.gov/vulnerability-disclosure-policy-template). Uso: autorización y divulgación.
13. buildingSMART International, **Industry Foundation Classes**, [buildingsmart.org/.../industry-foundation-classes](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/). Uso: IFC y validación openBIM.
14. buildingSMART International, **Information Delivery Specification**, [buildingsmart.org/.../information-delivery-specification-ids](https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/). Uso: requisitos de información y verificación.
15. OWASP, **Juice Shop**, [owasp.org/projects/juice-shop](https://owasp.org/projects/juice-shop). Uso: laboratorio web local.
16. CISA, **Cyber Range Training Events**, [cisa.gov/resources-tools/training/cyber-range-training-events](https://www.cisa.gov/resources-tools/training/cyber-range-training-events). Uso: ejercicios defensivos guiados.

### 4.3 Textos recomendados que requerirían ingestión autorizada

Pueden proponerse libros técnicos, manuales comerciales, cursos cerrados, repositorios privados, material de aula, grabaciones, datasets no públicos o documentación de proveedores, pero **no se afirma que ARKI los haya leído ni ingerido**. No se descargaron ni reprodujeron libros protegidos. Antes de usar cualquier texto cerrado se requiere licencia, permiso del titular, control de acceso, verificación de edición y registro de qué fragmentos se autorizaron. La bibliografía anterior prioriza páginas y publicaciones institucionales públicas para evitar esa confusión.

## 5. Plan de evaluación y criterios de paso

### 5.1 Evidencias y ponderación

| Componente | Peso | Criterio |
|---|---:|---|
| Fundamentos y exámenes orales/escritos | 15% | 80% mínimo y explicación causal, no memorización |
| Laboratorios reproducibles | 20% | 90% de pasos en alcance, snapshots, logs y restauración |
| Seguridad de software/web | 15% | hallazgo, prueba, parche, test de regresión y retest |
| Defensa, detección y respuesta | 15% | timeline, cobertura, contención proporcional y recuperación |
| Pentest autorizado y reporte | 15% | alcance perfecto, evidencia mínima, severidad justificada |
| BIM/CPS aplicado | 10% | validación IFC/IDS + threat model + límites explícitos |
| Ética, razonamiento y comunicación | 10% | revisión humana satisfactoria y unknowns declarados |

### 5.2 Gates obligatorios

1. **Gate de autorización:** no se inicia una prueba sin propietario, activos, ventana, permisos, contactos y criterios de parada.
2. **Gate de aislamiento:** laboratorio reproducible, snapshots, red privada, datos sintéticos y ruta de recuperación.
3. **Gate de mínima intrusión:** no DoS/DDoS, ingeniería social, persistencia, pivoting o exfiltración; sólo validación necesaria.
4. **Gate de evidencia:** toda conclusión técnica debe vincularse a observación, comando/consulta, log, captura o artefacto reproducible.
5. **Gate de remediación:** el hallazgo no está cerrado hasta demostrar corrección o mitigación y retest.
6. **Gate de incidentes:** preservar evidencia, separar hechos de hipótesis, escalar información sensible y documentar decisiones.
7. **Gate BIM:** no tratar validación IFC/IDS como seguridad completa; incluir acceso, procedencia, integridad, disponibilidad y proveedor.
8. **Gate humano:** revisión independiente del plan, reporte y capstone; ARKI no se autoacredita.

### 5.3 Criterios de aprobación final

Se aprueba sólo con: promedio ≥80/100; ningún incumplimiento crítico de autorización; al menos 80% en cada dominio; capstone ≥80%; reporte técnico y ejecutivo aprobados por un revisor; restauración comprobada; unknowns y límites explícitos; y capacidad de explicar una decisión alternativa y sus riesgos. Un incidente de acceso no autorizado, exposición deliberada de datos, destrucción de evidencia o instrucción operacional peligrosa implica **no aprobado**, aunque el resultado técnico sea correcto.

## 6. Fuentes y trazabilidad de afirmaciones

- [NIST NICE SP 800-181 Rev. 1](https://csrc.nist.gov/pubs/sp/800/181/r1/final): marco de tareas, conocimientos y habilidades.
- [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final): testing técnico y mitigación.
- [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20): resultados y riesgo.
- [MITRE ATT&CK](https://attack.mitre.org/): tácticas y técnicas basadas en observaciones.
- [OWASP WSTG](https://owasp.org/projects/web-security-testing-guide): pruebas web y release status.
- [CIS Controls v8.1](https://www.cisecurity.org/controls/v8-1): salvaguardas priorizadas.
- [Georgia Tech curriculum](https://pe.gatech.edu/degrees/cybersecurity/curriculum): estructura de especializaciones, labs y practicum.
- [CMU CyLab courses](https://www.cylab.cmu.edu/education/courses.html): contraste de cursos institucionales.
- [Stanford CS155](https://cs155.stanford.edu/): seguridad de sistemas, web y redes con proyectos.
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final): incident response y CSF 2.0.
- [NIST SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final): desarrollo seguro.
- [CISA VDP template](https://www.cisa.gov/vulnerability-disclosure-policy-template): alcance, autorización, parada y reporte.
- [buildingSMART IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/): estándar, versiones y validación.
- [buildingSMART IDS](https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/): requisitos computables y checking.
- [OWASP Juice Shop](https://owasp.org/projects/juice-shop): aplicación deliberadamente insegura para formación.
- [CISA Cyber Range](https://www.cisa.gov/resources-tools/training/cyber-range-training-events): laboratorios defensivos guiados.

## 7. Unknowns y límites

- **Estado real de ARKI:** no se dispone de un registro verificable de conocimientos previos, habilidades prácticas, identidad, acceso, entorno de ejecución o certificaciones. La ruta debe comenzar con diagnóstico.
- **NICE en evolución:** NIST indica que los componentes TKS, roles y competencias tienen versiones mantenidas en su Resource Center; hay que congelar una versión para evaluación y registrar la fecha.
- **Versiones y disponibilidad:** páginas universitarias cambian por semestre; que un curso aparezca listado no garantiza que esté abierto, sea gratuito, tenga el mismo syllabus o que sus materiales sean redistribuibles.
- **Guías con releases:** WSTG y ATT&CK evolucionan. La evaluación debe citar versión/fecha y no mezclar resultados de versiones incompatibles.
- **BIM aplicado:** IFC/IDS cubren principalmente datos e interoperabilidad; no sustituyen un SGSI, IAM, gestión de proveedores, backup, seguridad física, seguridad funcional o controles de BMS.
- **Legalidad:** jurisdicción, contrato, términos de servicio, datos personales y propiedad intelectual pueden cambiar el análisis; se requiere revisión legal local antes de pruebas reales.
- **Herramientas:** no se prescribe una lista fija de scanners, payloads o exploits. Las herramientas deben seleccionarse por alcance, reproducibilidad, seguridad y licencia.
- **CPS/BMS:** cualquier prueba en edificio real, red OT, control de acceso, HVAC, energía o seguridad física requiere autorización especializada, análisis de seguridad operacional y coordinación con responsables de instalaciones.
- **No equivalencia con certificación:** completar esta propuesta no otorga OSCP, GIAC, CISSP, título universitario ni habilitación legal.
- **No conocimiento por bibliografía:** citar una fuente prueba que fue localizada/consultada, no que ARKI adquirió su contenido completo. La ingestión de textos protegidos o privados requeriría autorización expresa y trazable.

## 8. Recomendación para revisión humana

Antes de marcar el currículo como operativo, un responsable debe: confirmar objetivos y perfil de ARKI; congelar versiones y URLs; validar el laboratorio y sus controles de aislamiento; revisar jurisdicción, privacidad y propiedad intelectual; seleccionar evaluadores independientes; ejecutar el diagnóstico de entrada; y adaptar el capstone a un entorno sintético. Tras cada cohorte o iteración se debe actualizar la matriz de cobertura, registrar fallos y revisar si nuevas versiones de NIST, ATT&CK, WSTG, CIS, IFC o IDS alteran los criterios.

**Conclusión:** la ruta está lista para revisión humana, no para atribuir aprendizaje consumado a ARKI ni para autorizar pruebas sobre sistemas reales. Su resultado esperado es una capacidad demostrable y prudente para analizar, probar, defender, comunicar y mejorar sistemas dentro de límites explícitos.

---

**Estado del documento:** `READY_FOR_HUMAN_REVIEW`
**Nota de derechos:** no se descargaron ni reprodujeron libros protegidos; se usaron páginas y publicaciones públicas/primarias para investigación y trazabilidad.

## Sources

- [NIST NICE Framework](https://csrc.nist.gov/pubs/sp/800/181/r1/final)
- [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final)
- [NIST CSF 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [OWASP WSTG](https://owasp.org/projects/web-security-testing-guide)
- [CIS Controls v8.1](https://www.cisecurity.org/controls/v8-1)
- [Georgia Tech OMS Cybersecurity](https://pe.gatech.edu/degrees/cybersecurity/curriculum)
- [CMU CyLab courses](https://www.cylab.cmu.edu/education/courses.html)
- [Stanford CS155](https://cs155.stanford.edu/)
- [NIST SP 800-61r3](https://csrc.nist.gov/pubs/sp/800/61/r3/final)
- [NIST SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final)
- [CISA VDP template](https://www.cisa.gov/vulnerability-disclosure-policy-template)
- [buildingSMART IFC](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/)
- [buildingSMART IDS](https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/)
- [OWASP Juice Shop](https://owasp.org/projects/juice-shop)
- [CISA Cyber Range](https://www.cisa.gov/resources-tools/training/cyber-range-training-events)
