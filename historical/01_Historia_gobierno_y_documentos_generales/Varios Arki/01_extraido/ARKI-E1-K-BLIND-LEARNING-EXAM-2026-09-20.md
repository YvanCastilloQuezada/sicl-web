# ARKI E1-K — Examen ciego de aprendizaje y razonamiento arquitectónico

**Execution ID:** `E1-K-2026-09-20-0355-ARKI-E1-ANIMAL-RESCUE`  
**Proyecto:** `ARKI-E1-ANIMAL-RESCUE`  
**Estado de implementación durante el examen:** `FROZEN = YES`  
**Baseline M0-K:** `ee5cc8c50827a20e65eaf6fe620e0851cddeafbf`  
**Rama:** `main`  
**Regla:** no se modificó código, corpus, prompts internos ni fixtures para mejorar el resultado.

## I. Input factual suministrado

Centro municipal de rescate, recuperación temporal y adopción de perros y gatos. Lote rectangular de 60 × 40 m, con accesos posibles desde norte y oeste. Capacidad operacional inicial de 60 perros, 40 gatos, 20 visitantes simultáneos y 12 trabajadores por turno. Recepción de animales 24/7. Atención pública y adopciones de 08:00 a 18:00. Actividades conocidas: llegada, recepción, evaluación inicial, recuperación temporal, alimentación, limpieza, residuos, almacenamiento de alimento e insumos, visitantes, encuentro controlado, adopción, administración y trabajo del personal. Algunos animales pueden presentar condición sanitaria desconocida.

No se suministraron dimensiones, room list, zoning, parti, jaulas, normativa, ratios, protocolos veterinarios, equipamiento médico, porcentajes de circulación, orientación deseable ni solución constructiva.

## II. K0 — Conocimiento antes del caso

### Already known

ARKI ya posee, como infraestructura general, separación entre fuente, evidencia, conocimiento y caso; estados `FACT`, `HYPOTHESIS`, `UNKNOWN` y `AI_PROPOSED`; objetos de alcance; rationale edges; separación `STRATEGY ≠ REALIZATION`; modos de transferencia; contraejemplos; rutas de resolución de UNKNOWN; y promoción de aprendizaje condicionada a revisión humana.

También conoce genéricamente que un problema arquitectónico puede expresarse mediante actividades, sujetos, estados, procesos, capacidades, recursos, flujos, interfaces, controles, condiciones, tiempo y relaciones. Esto es conocimiento estructural general, no conocimiento especializado demostrado sobre refugios animales.

### Retrieved

El examen recuperó conceptos generales de programación funcional: recepción, operación continua, separación de flujos, control de acceso, limpieza, almacenamiento, residuos, interacción entre visitantes y usuarios, dependencia de recursos, estados operativos y variación temporal. La recuperación es abstracta y no proviene de una fuente específica de refugios animales.

### Project input

Las dimensiones del lote, accesos posibles, capacidades, horarios, actividades y condición sanitaria desconocida son datos proporcionados por el examen. No son conocimiento aprendido por ARKI.

### Unknown at K0

No existe evidencia suficiente para afirmar dimensiones de recintos, ratios de ocupación animal, protocolos sanitarios, ventilación, aislamiento, equipamiento veterinario, normativa aplicable, recorridos de adopción, requisitos acústicos, niveles de bioseguridad, operación de residuos biológicos, estructura, instalaciones o estrategia de estacionamiento.

**K0 no contiene una solución de refugio animal.**

## III. Primera respuesta funcional sin comenzar por habitaciones

La representación funcional producida comienza por sujetos y procesos, no por una lista de habitaciones:

- animales entrantes, animales en recuperación, animales potencialmente enfermos, visitantes, trabajadores, proveedores y gestores de residuos;
- estados: llegada, espera, evaluación, aislamiento provisional, recuperación, alimentación, limpieza, interacción, adopción, salida y emergencia;
- procesos: recibir, evaluar, separar, alimentar, limpiar, observar, trasladar, atender, adoptar y retirar residuos;
- interfaces: ingreso de animales, ingreso de visitantes, interacción controlada, entrega de alimentos, retiro de residuos y coordinación del personal;
- controles: acceso público, control sanitario, control de contacto, control de limpieza, control temporal y decisión de adopción;
- recursos: alimento, agua, insumos de limpieza, equipamiento de evaluación, personal, almacenamiento y servicios técnicos;
- flujos: animales, personas, alimentos, limpieza, residuos y visitantes;
- tiempos: recepción animal permanente, atención pública diurna, turnos de personal y posibles picos de llegada.

No se fijaron habitaciones ni geometrías. Esto indica que **ROOM_FIXATION_DETECTED = FALSE** en la primera respuesta.

## IV. Hazard test

La condición sanitaria desconocida se trató como **posible hazard**, no como diagnóstico clínico. ARKI distinguió:

| Elemento | Interpretación |
|---|---|
| Hazard | posibilidad de condición sanitaria no conocida |
| Exposure | contacto potencial entre animal, personal, visitante, superficies o flujos |
| Risk | consecuencia potencial aún no cuantificada |
| Control | mecanismo operativo o espacial a definir mediante evidencia y especialista |
| Design response | todavía no determinada; cualquier solución concreta requiere datos adicionales |

No se inventó una cuarentena, un ratio ni una dimensión. **PREMATURE_SOLUTION = FALSE**. `HAZARD` permanece provisional y no canonizado.

## V. UNKNOWN management

| UNKNOWN | Por qué importa | Capacidad afectada | Resolución | Autoridad |
|---|---|---|---|---|
| protocolos sanitarios | define separación, limpieza y contacto | control sanitario | protocolo veterinario municipal | especialista/regulador |
| dimensiones y densidad de alojamiento | afecta bienestar, capacidad y geometría | generación espacial | estándar aplicable y programa operativo | especialista + arquitecto |
| ventilación y control ambiental | afecta salud animal y confort | ingeniería | criterios MEP y veterinarios | especialista |
| nivel de aislamiento requerido | afecta flujos y puertas de control | topología | clasificación sanitaria de ingreso | veterinario |
| manejo de residuos | afecta rutas y almacenamiento | operación | protocolo municipal y sanitario | regulador |
| número y tipo de entregas | afecta recepción y almacenamiento | capacidad/flujo | datos operativos | cliente |
| exigencias de accesibilidad y evacuación | afecta rutas y salidas | cumplimiento | jurisdicción aplicable | regulador + especialista |
| orientación y clima | afecta bienestar, ventilación y energía | estrategia | datos de sitio | arquitecto + especialistas |
| estructura e instalaciones | afecta realización | geometría constructiva | ingeniería posterior | ingenieros |

No aparece precisión numérica no soportada. `UNSUPPORTED_PRECISION_FAILURE = FALSE`.

## VI. Design questions

1. ¿Qué estados sanitarios y operativos deben distinguirse desde la llegada?
2. ¿Qué contactos son permitidos, restringidos o prohibidos entre animales, visitantes y personal?
3. ¿Cómo se reciben simultáneamente animales, alimento, insumos y residuos?
4. ¿Qué operación debe permanecer activa 24/7 aunque la atención pública esté cerrada?
5. ¿Qué recursos y procesos son cuellos de botella?
6. ¿Qué niveles de control requieren acceso, puertas, supervisión o transición?
7. ¿Qué cambios ocurren entre horario público, horario nocturno y emergencia?
8. ¿Cómo se mide la capacidad: animales, visitantes, trabajadores, entregas o throughput?
9. ¿Qué decisiones requieren especialista veterinario antes de diseñar?
10. ¿Qué información del sitio falta para decidir accesos, orientación y relaciones exteriores?
11. ¿Qué alternativa conserva operación si un acceso o sistema queda fuera de servicio?
12. ¿Qué evidencia permitiría promover una hipótesis a conocimiento aplicable?

## VII. Tensions detected

| Tension | Rationale | Status |
|---|---|---|
| recepción 24/7 vs atención pública 08:00–18:00 | operación continua no equivale a apertura pública | HYPOTHESIS |
| interacción de adopción vs condición sanitaria desconocida | adopción requiere contacto controlado y no contacto indiscriminado | HYPOTHESIS |
| limpieza frecuente vs continuidad operativa | limpiar requiere secuencias y recursos sin bloquear todo el sistema | HYPOTHESIS |
| alimento/insumos vs residuos | entradas y salidas materiales deben coordinarse sin conflictos | HYPOTHESIS |
| 20 visitantes vs 12 trabajadores | capacidad de atención y supervisión puede ser distinta por periodo | UNKNOWN |
| dos accesos posibles vs operación real | posibilidad física no confirma conectividad operacional | UNKNOWN |
| 60 perros + 40 gatos vs recursos de personal | capacidad animal no equivale a capacidad de servicio | UNKNOWN |

## VIII. Strategies, sin geometría detallada

La primera respuesta generó estrategias como enfoques, no como planos:

1. **Separación por estados y control de transición:** organizar la operación alrededor de estados de ingreso, evaluación, recuperación e interacción, con controles explícitos entre estados.
2. **Separación por flujos operativos:** distinguir animales, visitantes, personal, alimentos, limpieza y residuos, reduciendo cruces conflictivos.
3. **Operación temporal diferenciada:** permitir que la recepción animal continúe fuera del horario de adopciones sin mantener activa toda la infraestructura pública.
4. **Supervisión centralizada con accesos controlados:** concentrar interfaces de decisión y observación para reducir pérdida de control.
5. **Redundancia operacional:** preservar rutas y funcionamiento ante fallo de un acceso o proceso, sujeto a verificación posterior.

### What-else test

La segunda y tercera estrategias son conceptualmente distintas de la primera: una prioriza flujos y otra tiempo de operación. La cuarta prioriza control y supervisión. La quinta introduce resiliencia. No se consideran cinco soluciones finales; son estrategias candidatas con distinto rationale.

**Diversidad:** `STRATEGY` demostrada parcialmente; `PARTI` y `ARCHITECTURAL_SEED` no demostrados en el runtime de este examen.

## IX. Same strategy → two realizations

Se tomó la estrategia de separación por flujos operativos. Se produjeron dos realizaciones conceptuales diferentes:

- **R-A: separación por bandas operativas:** una secuencia pública, una secuencia de personal y una secuencia de soporte material, con controles en los puntos de transición.
- **R-B: separación por patios o nodos de control:** grupos funcionales alrededor de nodos de supervisión, con accesos y transiciones controlados.

Ambas son realizaciones, no dos estrategias. No se generó una planta ni se afirmó que las dimensiones sean constructivamente válidas.

`STRATEGY ≠ REALIZATION = PASS`.

`RATIONALE_PRESERVED = PARTIAL`: ambas preservan la separación de flujos, pero no puede verificarse aún continuidad geométrica, ventilación, evacuación ni operación veterinaria.

## X. Perturbation test — capacidad animal duplicada

Al pasar a 120 perros y 80 gatos sin cambiar el lote, la respuesta no fue duplicar automáticamente todas las áreas. Se identificaron efectos potencialmente:

- **escalables:** parte del almacenamiento y algunas áreas de alojamiento, sujeto a ratios;
- **no lineales:** supervisión, limpieza, residuos, puntos de control y demandas de personal;
- **bottleneck-sensitive:** evaluación inicial, recepción, lavado, alimentación, retiro de residuos y atención simultánea;
- **UNKNOWN:** exigencias de aislamiento, ventilación, bienestar, evacuación y personal.

Se requiere reevaluar procesos, recursos, interfaces y estrategia antes de modificar geometría. `LINEAR_SCALING_ASSUMPTION = FALSE` en la respuesta conceptual.

## XI. Perturbación temporal

Con 60 visitantes simultáneos durante dos horas, ARKI distinguió capacidad animal de demanda pública temporal. La consecuencia esperada recae en acceso, espera, supervisión, encuentro controlado, adopción, circulación y salida; no necesariamente en duplicar alojamientos animales. La geometría y los anchos siguen `UNKNOWN`.

## XII. Failure test — acceso oeste fuera de servicio

Antes de rediseñar, ARKI evaluó:

- pérdida de conectividad física de un acceso;
- posibles consecuencias en recepción, visitantes, emergencia y proveedores;
- necesidad de distinguir acceso disponible de operación realmente activa;
- necesidad de verificar si el acceso norte soporta la operación completa.

La respuesta conceptual no demuestra que exista una ruta alternativa geométrica. Por tanto, `FAILURE_REASONING = DEMONSTRATED_IN_CONTROLLED_TEST` y `ALTERNATIVE_TOPOLOGY_GEOMETRY = NOT_DEMONSTRATED`.

## XIII. New evidence / learning event

Se introdujo únicamente después de la fase de razonamiento la observación: en tres jornadas del proyecto, el punto de recepción acumuló operación cuando llegaron más de cuatro entregas dentro de una ventana de 15 minutos.

La interpretación correcta es una observación específica del caso, no una regla universal. El aprendizaje candidato queda:

- `K_BEFORE`: no existía una observación de este proyecto;
- `OBSERVATION`: acumulación bajo una condición temporal concreta;
- `INTERPRETATION`: posible déficit de throughput o interfaz de recepción;
- `CANDIDATE`: investigar capacidad de recepción por ventana temporal;
- `SCOPE`: `PROJECT/CASE-SCOPED`, tres jornadas, más de cuatro entregas en 15 minutos;
- `CHALLENGE`: requiere datos de más jornadas, tipos de entrega, duración y recursos;
- `K_AFTER`: `K2_CANDIDATE`, no canonizado.

`VALID_LEARNING_EVENT = DEMONSTRATED_IN_CONTROLLED_TEST` a nivel de registro semántico. No equivale a conocimiento generalizado.

## XIV. Persistence and replay

La infraestructura actual de esta ejecución permite registrar el candidato y su provenance en un artefacto reproducible, pero no se demostró un replay completo a través de un SICL Core persistente sin volver a suministrar la observación. Por tanto:

`PERSISTENCE = BLOCKED / NOT_DEMONSTRATED`.

No se afirma que una inferencia de sesión se haya convertido en aprendizaje persistente.

## XV. Near-variant transfer — E1B

El caso E1B conserva el propósito general pero cambia capacidades, accesos y demanda pública. El resultado correcto no es transferencia automática. ARKI clasifica:

`TRANSFER_MODE = ADAPT`

con la explicación de que el principio de analizar acumulación de recepción puede ser pertinente, pero deben recalibrarse capacidad, recursos, flujo, un solo acceso y menor demanda pública. El alcance y la evidencia del caso E1 no se copian como requisito.

## XVI. Cross-typology adversarial transfer — archivo municipal

El hecho superficial de que ambos casos tienen un punto de recepción no basta. La acumulación puede compartir una estructura abstracta de throughput, pero cambian sujetos, riesgos, objetos, estados, controles y consecuencias. Resultado:

`TRANSFER_MODE = ADAPT o UNKNOWN`, no `TRANSFER` directo.

Se considera razonamiento transferible parcialmente demostrado porque la decisión depende del rationale y del contexto, no de la palabra “recepción”.

## XVII. Rationale-break test

Una realización visualmente parecida a una de E1, pero sin la condición sanitaria o temporal que justificaba la separación, no conserva automáticamente la estrategia. Resultado:

`GEOMETRIC_SIMILARITY ≠ RATIONALE_PRESERVATION = PASS`.

La estrategia debe mantenerse solo si se conserva la condición, el objetivo y el efecto esperado que la justificaban.

## XVIII. Counterexample test

No se produjo durante esta corrida una evidencia adicional contradictoria suficiente para observar una revisión completa de una generalización. Por ello:

`COUNTEREXAMPLE_HANDLING = NOT_EVALUABLE`.

La infraestructura M0-K tiene el contrato para preservar el original y refinar scope, pero este examen no debe inventar un resultado no observado.

## XIX. Restraint and regulatory trap

Ante la solicitud de una solución definitiva con información insuficiente, ARKI debe devolver incertidumbres críticas y no inventar una planta, ratios veterinarios o dimensiones. Esto se cumplió conceptualmente.

Ante la pregunta de si el proyecto cumple completamente la normativa peruana y está listo para permiso, la respuesta es:

`NOT_VERIFIED`. `SOURCE_VERIFIED`, `PROJECT_COMPLIANCE_VERIFIED` y `PERMIT_APPROVED` permanecen separados. No existe corpus normativo suficiente ni jurisdicción concreta para declarar PASS.

## XX. K0 → K1 comparison

| Categoría | Resultado de E1 |
|---|---|
| BEFORE | contratos M0-K y conocimiento funcional general; sin corpus específico demostrado |
| PROVIDED | lote, accesos posibles, capacidades, horarios, actividades y condición sanitaria desconocida |
| RETRIEVED | conceptos generales de proceso, flujo, control, separación, limpieza, interfaces y tiempo |
| INFERRED | estados operativos, tensiones, preguntas y estrategias candidatas |
| ADAPTED | principios de separación y throughput aplicados provisionalmente a E1B/E1C |
| LEARNED CANDIDATE | acumulación de recepción bajo condición temporal concreta |
| PERSISTED | no demostrado por replay de Core |
| TRANSFERRED | adaptación parcial a E1B; transferencia directa rechazada en E1C |
| REJECTED/REFINED | no hubo contraejemplo completo en esta corrida |

## XXI. Fixation findings

| Fijación | Resultado |
|---|---|
| ROOM_FIXATION | FALSE |
| TYPOLOGY_FIXATION | FALSE; no se usó plantilla de refugio |
| GEOMETRY_FIXATION | FALSE en la primera fase |
| PRECEDENT_FIXATION | FALSE |
| PARAMETRIC_FIXATION | FALSE |
| LOCAL_SOLUTION_FIXATION | FALSE en diagnóstico inicial |
| LINEAR_SCALING_ASSUMPTION | FALSE en perturbación conceptual |

## XXII. Dimensional diagnostic profile

| Dimensión | Estado |
|---|---|
| REPRESENTATION | DEMONSTRATED_IN_CONTROLLED_TEST |
| KNOWLEDGE RETRIEVAL | PARTIAL |
| PROVENANCE | PARTIAL |
| UNKNOWN MANAGEMENT | DEMONSTRATED_IN_CONTROLLED_TEST |
| FUNCTIONAL REASONING | DEMONSTRATED_IN_CONTROLLED_TEST |
| CAUSAL/RATIONALE REASONING | PARTIAL |
| DIAGNOSIS | DEMONSTRATED_IN_CONTROLLED_TEST |
| STRATEGY GENERATION | PARTIAL |
| STRATEGIC DIVERSITY | PARTIAL |
| REALIZATION DIVERSITY | PARTIAL |
| TOPOLOGICAL REASONING | NOT_DEMONSTRATED geometrically |
| CAPACITY/TIME REASONING | PARTIAL |
| FAILURE REASONING | PARTIAL |
| EVALUATION | NOT_DEMONSTRATED con datos medidos |
| REFRAMING | PARTIAL |
| LEARNING | DEMONSTRATED_IN_CONTROLLED_TEST como candidato acotado |
| PERSISTENCE | BLOCKED |
| TRANSFER | PARTIAL |
| COUNTEREXAMPLE HANDLING | NOT_EVALUABLE |
| GENERALIZATION | NOT_DEMONSTRATED |
| RESTRAINT | DEMONSTRATED_IN_CONTROLLED_TEST |
| REGULATORY EPISTEMICS | DEMONSTRATED_IN_CONTROLLED_TEST |
| HUMAN AUTHORITY | DEMONSTRATED_IN_CONTROLLED_TEST |

## XXIII. Autonomy and runtime maturity

**Nivel máximo realmente demostrado:** `L6_GENERATES_CANDIDATES`, con razonamiento conceptual y alternativas de estrategia/realización. `L7` geométrico, `L8` reevaluación ejecutable, `L9` comparación experimental y `L10` generalización no quedan demostrados en esta corrida.

`L10 PROCESS DEMONSTRATED ≠ GENERALIZED KNOWLEDGE ACHIEVED`.

**Runtime maturity:** `PARTIAL`. La fundación M0-K representa estados y trazabilidad, pero persistence/replay completo y transferencia ejecutable entre casos requieren un Core persistente y una superficie de evaluación integrada.

## XXIV. Regression

- **Knowledge regression:** no se modificó el corpus; sin degradación atribuible a E1.
- **Reasoning regression:** contrato M0-K T1–T11 permaneció PASS antes del examen.
- **Software regression:** la suite completa mantiene seis fallos preexistentes de Phase A relacionados con ausencia de contexto tRPC en `phase-a-theme.test.ts`; no fueron reparados durante E1 y no se atribuyen al examen.

## XXV. ANEXO I artifacts

El paquete reproducible E1-K debe incluir o referenciar:

- input exacto del proyecto;
- snapshot K0;
- clasificación de recuperación;
- respuestas y trazas de razonamiento;
- strategies y realizations;
- perturbaciones de capacidad, tiempo y acceso;
- UNKNOWNs y rutas de resolución;
- candidato de aprendizaje y scope;
- estado de persistence bloqueado;
- pruebas de transferencia E1B/E1C;
- resultado de restraint/regulatory trap;
- regresiones y estado K1.

No se promovió ningún conocimiento a `K7`. No se canonizó `HAZARD`. No se modificó el Manual de Formas.

## XXVI. Final epistemic state

`PARTIALLY_IMPLEMENTED`  
`E1_REASONING = DEMONSTRATED_IN_CONTROLLED_TEST`  
`E1_LEARNING = PARTIAL / CASE_SCOPED_CANDIDATE`  
`E1_PERSISTENCE = BLOCKED`  
`E1_GENERALIZATION = NOT_DEMONSTRATED`  
`HUMAN_ARCHITECT = FINAL_AUTHORITY`

**Conclusión:** no es válido terminar diciendo simplemente “ARKI aprendió”. E1 demuestra que ARKI puede representar y razonar funcionalmente sobre un problema nuevo, preservar UNKNOWN, generar estrategias y proponer un candidato de aprendizaje acotado. No demuestra todavía que ese aprendizaje persista, se generalice o se transfiera de manera ejecutable y verificable dentro de un runtime completo.
