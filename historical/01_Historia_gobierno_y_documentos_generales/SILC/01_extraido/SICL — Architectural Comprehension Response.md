# SICL — Architectural Comprehension Response

## 1. ¿Qué es SICL y qué problema intenta resolver?

SICL, **Spatial Intelligence Command Language**, es un sistema progresivo de representación, razonamiento, evaluación y apoyo a decisiones para problemas espaciales complejos. Su propósito no es únicamente almacenar parámetros, sino convertir información heterogénea —hechos, supuestos, objetivos, restricciones, preferencias, evidencia y decisiones— en un estado estructurado, trazable y susceptible de análisis profesional.

Intenta resolver la dificultad de tomar decisiones espaciales cuando existen múltiples criterios, incertidumbre, restricciones incompatibles, fuentes diversas y responsabilidades profesionales. SICL debe ayudar a organizar el problema, detectar conflictos, evaluar alternativas, explicar consecuencias y conservar el origen de las decisiones, sin sustituir al profesional humano.

## 2. ¿Qué NO es SICL?

SICL no es un CRUD de proyectos, aunque su primer vertical slice pueda incluir una capa CRUD. Tampoco es por sí solo un gestor BIM, un GIS, un chatbot, un generador de edificios, un optimizador, un sistema simple de reglas, un conjunto de agentes ni una interfaz de lenguaje natural. Puede integrar esas tecnologías en el futuro, pero su identidad está en la representación y el razonamiento trazable sobre problemas espaciales.

## 3. ¿Cuál es la idea central que nunca debería perderse durante una refactorización?

La idea central es que SICL debe representar el **estado de un problema espacial y la cadena de razonamiento y decisión asociada**, distinguiendo tipos de conocimiento y haciendo visibles incertidumbres, conflictos, alternativas y consecuencias. Una refactorización no puede convertir silenciosamente `FACT`, `ASSUMPTION`, `OBJECTIVE`, `CONSTRAINT`, `PREFERENCE` y `DECISION` en un único diccionario genérico ni presentar inferencias como hechos.

## 4. ¿Cuál es la diferencia entre SICL y un CRUD convencional?

Un CRUD crea, consulta, modifica y elimina registros. SICL debe evolucionar desde esa infraestructura hacia un sistema semántico y de decisión: sabe qué representa cada dato, cuál es su procedencia, qué grado de certeza tiene, qué restricciones afecta, qué objetivos entra en tensión, qué alternativas existen y qué decisión humana se tomó. El CRUD es infraestructura del núcleo, no la inteligencia de SICL.

## 5. Explica la filosofía de hacer visibles los conflictos

Cuando una solicitud contradice una restricción, SICL no debe obedecer ciegamente ni bloquearla sin explicación. Debe identificar la regla afectada, describir la incompatibilidad, mostrar sus consecuencias y presentar opciones: mantener la restricción, modificarla si corresponde, generar alternativas o solicitar una decisión humana. La salida debe distinguir claramente entre detección computacional y decisión profesional.

## 6. Diferencia entre FACT, ASSUMPTION, OBJECTIVE, CONSTRAINT, PREFERENCE, DECISION y EVENT

| Concepto | Significado |
|---|---|
| `FACT` | Información considerada dato o afirmación respaldada por una fuente. |
| `ASSUMPTION` | Supuesto adoptado bajo incertidumbre, que puede tener confianza y requerir validación. |
| `OBJECTIVE` | Resultado que se desea maximizar, minimizar o alcanzar. |
| `CONSTRAINT` | Condición, límite o regla que restringe las soluciones admisibles. |
| `PREFERENCE` | Preferencia relativa que orienta la evaluación, pero no necesariamente impone un límite. |
| `DECISION` | Determinación adoptada por una autoridad humana o por un proceso explícitamente autorizado. |
| `EVENT` | Registro de algo que ocurrió, como un comando, modificación, error o transición de estado. |

## 7. Ejemplo arquitectónico de cada uno

| Tipo | Ejemplo |
|---|---|
| `FACT` | “El terreno tiene 2.000 m²”, respaldado por un documento de levantamiento. |
| `ASSUMPTION` | “Se esperan aproximadamente 500 usuarios diarios”, con confianza 0,60. |
| `OBJECTIVE` | “Maximizar el confort térmico”. |
| `CONSTRAINT` | “La altura no puede superar seis pisos”. |
| `PREFERENCE` | “Se prefiere una imagen arquitectónica sobria”. |
| `DECISION` | “Se mantiene el límite de seis pisos”. |
| `EVENT` | “Se ejecutó `/CONSTRAINT SET HEIGHT <= 6 FLOORS`”. |

## 8. ¿Qué ocurre si SICL confunde ASSUMPTION con FACT?

Confunde un supuesto incierto con una afirmación respaldada. Eso puede contaminar la evaluación, producir una falsa certeza, ocultar riesgos y generar decisiones incorrectas. La diferencia debe conservarse en el tipo, el nivel de confianza, la fuente, el estado de validación y la trazabilidad.

## 9. ¿Qué ocurre cuando dos CONSTRAINTS entran en conflicto?

El conflicto debe representarse explícitamente. SICL debe identificar las dos restricciones, explicar por qué no pueden satisfacerse simultáneamente dentro del contexto actual, indicar qué información falta y presentar alternativas. No debe descartar una restricción ni escoger una prioridad por conveniencia de implementación. Si la resolución afecta al producto o a la responsabilidad profesional, debe marcar `REQUIRES_HUMAN_DECISION`.

## 10. ¿Qué ocurre cuando dos OBJECTIVES entran en conflicto?

No necesariamente existe un error. Puede haber un trade-off entre objetivos, como maximizar confort y minimizar coste. SICL debería conservar ambos, hacer explícita la tensión y permitir posteriormente ponderación, evaluación multicriterio, análisis de escenarios y frontera de Pareto. La prioridad o ponderación no debe inventarse automáticamente si no está definida.

## 11. ¿Quién conserva la autoridad final?

La autoridad final sobre una decisión profesional y sobre las decisiones fundamentales del producto la conserva el propietario humano y el profesional responsable. SICL es un sistema de apoyo a decisiones, no una autoridad profesional autónoma ni un certificador legal o normativo.

## 12. Explica la arquitectura completa entendida

La arquitectura comienza con un modelo de proyecto y conocimiento que representa hechos, supuestos, objetivos, restricciones, preferencias, decisiones, evidencia, eventos, conflictos, evaluaciones, escenarios y alternativas. Sobre ese estado se organizan capas de razonamiento, evaluación y trazabilidad.

En fases futuras, el **Conflict Engine** detectará incompatibilidades; el **Decision Engine** coordinará análisis y apoyo a decisiones; el **Evaluation Engine** comparará alternativas con múltiples criterios; el **Feasibility Engine** analizará dimensiones legal, técnica, económica, urbana, ambiental, operativa y temporal; el **Generative Engine** producirá alternativas; el **Optimization Engine** tratará trade-offs, Pareto y escenarios; y el razonamiento causal explicará relaciones y consecuencias.

**Site Intelligence** incorporará sitio, geometría, topografía, clima, asoleamiento, viento, hidrología, movilidad, uso de suelo, zonificación, infraestructura, servicios, riesgos y contexto urbano. GIS, BIM y Digital Twin serán extensiones del modelo de conocimiento espacial, no simples visualizaciones. Los agentes especializados operarán sobre un modelo común y compartirán memoria y trazabilidad. El lenguaje natural será una capa de interpretación futura que transformará expresiones humanas en representaciones estructuradas, pero el núcleo inicial usará una gramática formal reproducible.

## 13. ¿Qué parte debe implementarse en 0.2.1?

El MVP debe implementar únicamente un núcleo persistente y verificable: `Project`, `Objective`, `Constraint`, `Role`, `Event`, `Response`, `Repository`, `Interpreter`, `CLI`, `History` y SQLite. Debe admitir creación, apertura, listado, visualización y modificación controlada de proyectos; etapas; objetivos; restricciones; roles; historial; respuestas estructuradas; errores; guardado automático y recuperación entre sesiones.

## 14. ¿Qué debe permanecer fuera de 0.2.1?

Deben permanecer fuera el entendimiento de lenguaje natural, agentes avanzados, Climate Engine, GIS, BIM, Digital Twin, Generative Design, Optimization, Pareto, inferencia causal, cumplimiento normativo automático, certificación profesional, decisiones autónomas, ecosistema de APIs externas y cualquier motor especializado no definido en el contrato.

## 15. ¿Qué elementos futuros deben preservarse conceptualmente?

Deben preservarse la ontología diferenciada, la trazabilidad, la evidencia, los conflictos, las alternativas, los escenarios, las evaluaciones multicriterio, la factibilidad multidimensional, la causalidad, los agentes, los motores, Site Intelligence, GIS/BIM/Digital Twin, generación, optimización, Pareto, lenguaje natural y supervisión humana. Preservarlos no significa implementarlos parcialmente, sino evitar que el núcleo actual cierre el camino para incorporarlos correctamente.

## 16. Vertical slice mínimo de 0.2.1

El recorrido mínimo es:

```text
crear proyecto
→ establecer etapa
→ añadir objetivos
→ añadir restricciones
→ añadir roles
→ mostrar estado
→ consultar historial
→ guardar automáticamente
→ cerrar sesión
→ abrir una nueva sesión
→ recuperar el proyecto
→ verificar estado e historial
```

Debe ejecutarse con `UPAO-001 — UPAO PLAZA CENTER` y demostrar que el resultado recuperado coincide con el estado anterior al cierre.

## 17. ¿Qué significa trazabilidad?

Trazabilidad significa poder seguir el origen, evolución, interpretación y efecto de una información o decisión. Debe ser posible saber qué fuente respaldó un dato, qué supuesto se adoptó, qué comando modificó el estado, qué conflicto apareció, qué evaluación se produjo, qué alternativa se consideró y quién tomó la decisión final. Una salida sin origen o sin relación con el estado del proyecto no es trazable.

## 18. Diferencia entre estado actual e historial de eventos

El **estado actual** es la representación vigente del proyecto: etapa, objetivos, restricciones, roles y demás entidades actuales. El **historial de eventos** registra lo que ocurrió para llegar a ese estado: comandos, cambios, errores, actores y tiempos. Un snapshot puede ser suficiente para 0.2.1, pero no equivale a un event log append-only. La arquitectura futura debe separar ambos conceptos.

## 19. Papel futuro del Decision Engine

El Decision Engine debe coordinar la transformación de información estructurada en análisis y apoyo a decisiones. Deberá entender el estado, representar relaciones, comprobar restricciones, detectar conflictos, evaluar consecuencias, generar o solicitar alternativas, explicar resultados y conservar trazabilidad. No debe ser una función genérica que simplemente devuelva una decisión sin contexto, evidencia ni responsabilidad explícita.

## 20. Papel de Site Intelligence

Site Intelligence debe incorporar el contexto espacial real al razonamiento: condiciones físicas, urbanas, ambientales, normativas, de movilidad, infraestructura y riesgo. Su propósito no es solo mostrar mapas, sino permitir que el sitio modifique las evaluaciones, restricciones, alternativas y decisiones del proyecto.

## 21. Papel de los demás motores

El `Evaluation Engine` comparará alternativas mediante múltiples criterios y pesos explícitos. El `Feasibility Engine` analizará dimensiones de factibilidad, dejando claro que un resultado computacional no es una certificación profesional o legal. El `Generative Engine` producirá varias alternativas a partir del estado, objetivos, restricciones y contexto. El `Optimization Engine` tratará objetivos múltiples, trade-offs, escenarios, sensibilidad y Pareto. Todos deben operar sobre el modelo común y producir resultados explicables y trazables.

## 22. Diferencia entre DOMAIN OBJECT, ENGINE y AGENT

Un **Domain Object** representa una entidad o concepto del problema, como `Project`, `Objective`, `Constraint`, `Fact` o `Decision`. Un **Engine** ejecuta una capacidad analítica o de transformación sobre objetos y estado, como evaluar, detectar conflictos o analizar factibilidad. Un **Agent** es un participante especializado que puede consumir conocimiento, producir análisis o coordinar acciones dentro de un marco común. Un agente no es simplemente un chatbot independiente y un rol profesional no es automáticamente un agente de software.

## 23. ¿Por qué es peligroso introducir agentes demasiado pronto?

Porque pueden multiplicar interfaces, estados, interpretaciones y errores antes de que exista un modelo común sólido. También pueden ocultar decisiones, duplicar memoria, producir resultados no reproducibles y convertir el sistema en varios chatbots sin trazabilidad compartida. Primero debe existir un dominio, un contrato, una historia y límites de responsabilidad claros.

## 24. Diez contradicciones, inconsistencias o ambigüedades históricas

1. Se alternó entre `/PROJECT SHOW` y `/PROJECT_SHOW`.
2. El modelo de `Event` apareció con estructuras incompatibles.
3. El historial se describió a veces como eventos y a veces como snapshot del estado.
4. Se usaron distintas definiciones o responsabilidades para `Response`.
5. La prioridad de objetivos se mezcló con intensidad, dirección y ponderación.
6. Se aceptaron operadores `=` y `==` sin contrato de normalización consolidado.
7. Las etapas se propusieron como lista cerrada y también como texto libre.
8. La identidad de `Project ID` quedó abierta entre texto normalizado y posible UUID interno.
9. Los roles profesionales se aproximaron conceptualmente a agentes de software.
10. Se habló de `Decision Engine` como arquitectura avanzada y, en algunos fragmentos, como una función simple.
11. Se anunciaron tests pasados sin que todos los tests o archivos estuvieran completos.
12. Se presentaron fragmentos de código como versiones ejecutables aunque estaban truncados o mezclados con documentación.
13. Se usó SQLite como persistencia actual, pero sin contrato definitivo sobre transacciones, errores y recuperación.
14. Se mencionó la trazabilidad como principio fundamental mientras el snapshot no garantiza un historial append-only.
15. Se usó “implementado” para referirse a código existente, aunque faltaban ejecución, evidencia y revisión.

Estas observaciones son contradicciones o ambigüedades del material recibido; deben confirmarse durante la auditoría completa de todos los documentos históricos.

## 25. Decisiones vigentes, obsoletas y pendientes

| Categoría | Elementos |
|---|---|
| Vigentes conceptualmente | SICL como sistema de apoyo a decisiones; distinción ontológica; visibilidad de conflictos; trazabilidad; autoridad humana; evolución progresiva. |
| Provisionales para el MVP | SICL 0.2.1; SQLite local; guardado automático; objetivos `MAXIMIZE`/`MINIMIZE`; roles normalizados; respuestas estructuradas; CLI textual. |
| Legacy | Código fragmentado de 0.1, 0.2 y prototipos anteriores hasta que coincida con el contrato aprobado. |
| Futuras | Fact, Assumption, Preference, Decision, Evidence, Conflict Engine, agentes, Site Intelligence, motores especializados, GIS/BIM, NLP y optimización como capacidades implementadas. |
| Pendientes | Lista de etapas; política exacta de identidad y normalización de Project ID; gramática final de cada comando; contrato completo de Event/History; política detallada de errores; compatibilidad entre versiones; estrategia de snapshot frente a event log. |

## 26. Código anterior reutilizable y descartable

Conceptualmente pueden rescatarse las ideas de separación de dominio, interpretación de comandos, respuestas estructuradas, persistencia SQLite, normalización básica, historial y tests de persistencia. No debe rescatarse automáticamente ninguna implementación concreta.

Deben descartarse o tratarse como `LEGACY` los fragmentos truncados, los generadores con indentación defectuosa, los archivos que mezclan documentación con código, las APIs incompatibles entre versiones, los tests que validan una arquitectura obsoleta y cualquier implementación que no pueda relacionarse con el Core Contract aprobado. La reutilización debe demostrarse mediante compatibilidad y pruebas, no por apariencia.

## 27. ¿Un CRUD que pasa todos los tests sería exitoso?

No. Sería exitoso como software CRUD, pero no necesariamente como SICL. Los tests solo demostrarían los comportamientos que cubren. Si el diseño destruye la distinción ontológica, oculta conflictos, pierde trazabilidad o no puede evolucionar hacia razonamiento y decisión, entonces habría pasado una validación técnica estrecha pero habría fracasado arquitectónicamente.

## 28. ¿Qué partes no comprendo suficientemente bien?

No tengo información histórica suficiente para afirmar todavía una versión definitiva de la ontología completa, especialmente sobre `Requirement`, `Source`, `Evidence`, `Inference`, `Scenario`, `Alternative`, `Evaluation` y `Decision`. Tampoco están cerrados el modelo de confianza, la relación entre `Role` y `Agent`, la semántica formal de los operadores y unidades, la identidad persistente de los proyectos, el formato exacto del historial, los permisos, los actores, las transacciones y la compatibilidad de versiones.

Además, no puedo verificar la totalidad de las decisiones históricas si no se entrega el conjunto completo de documentos y código. Por eso esas áreas deben aparecer como `INDETERMINED`, `PENDING` o `PROPOSED`, no como decisiones resueltas.

## 29. ¿Qué decisiones solo pueden tomar los autores?

Los autores deben decidir qué problema y qué identidad debe preservar SICL, qué conceptos son fundamentales, qué compromisos arquitectónicos son aceptables, qué entra en el MVP, qué significa éxito del producto, qué autoridad tiene cada participante, qué riesgos de simplificación son inaceptables y qué cambios alteran la visión. El implementador puede proponer alternativas y señalar inviabilidad, pero no cambiar silenciosamente esas decisiones.

## 30. SICL en máximo 15 líneas

SICL es un sistema de apoyo profesional a decisiones para problemas espaciales complejos. Representa proyectos como estados estructurados de conocimiento y decisiones. Distingue hechos, supuestos, objetivos, restricciones, preferencias, inferencias, evaluaciones, conflictos y decisiones. Conserva evidencia e historial para mantener trazabilidad. No obedece ciegamente instrucciones incompatibles ni bloquea conflictos sin explicación. Identifica tensiones y presenta alternativas para intervención humana. Su arquitectura futura incluye razonamiento, evaluación, factibilidad, generación, optimización, agentes y contexto espacial mediante GIS/BIM. El MVP no implementará todo eso. SICL 0.2.1 demostrará un núcleo persistente, formal y verificable. Ese núcleo debe crecer sin convertirse en un CRUD genérico ni deformar la ontología original.

## Conclusión

La comprensión es suficiente para iniciar la auditoría arquitectónica, pero no para cerrar todavía el Core Contract. La auditoría debe confirmar o corregir estas interpretaciones, clasificar el material histórico y convertir las ambigüedades en decisiones explícitas. No se ha escrito código ni se ha autorizado implementación en esta respuesta.
