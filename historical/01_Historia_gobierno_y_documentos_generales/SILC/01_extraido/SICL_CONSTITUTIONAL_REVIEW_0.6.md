# SICL_CONSTITUTIONAL_REVIEW_0.6

## Revisión constitucional B-001

**Estado del documento:** resolución B-001 recibida y consolidada. El documento conserva las preguntas originales como evidencia de deliberación; no congela el Core Contract, no autoriza implementación adicional y no sustituye la evidencia técnica existente.

**Objeto:** estudiar cuatro decisiones constitucionales de SICL 0.6 a partir del `SICL_MASTER_SPEC_v1.md`, `SICL_STATE_AUDIT_v1.md`, `SICL_0_6_ACCEPTANCE_MATRIX_v1.md`, el Core Contract Python actual y el adaptador HTTP v0.3.

> Esta revisión no implementa alternativas. Tras la respuesta del Product Owner, su finalidad es dejar trazable la resolución B-001 antes de continuar con infraestructura o ampliar el sistema.

---

## 1. Criterios de clasificación

| Clasificación | Significado en esta revisión |
|---|---|
| **APROBADO** | Existe una decisión explícita del Product Owner que debe conservarse como regla constitucional. |
| **PROPUESTA** | Recomendación técnica de Manus; no autoriza implementación por sí sola. |
| **PENDIENTE DE DECISIÓN** | Requiere clasificación expresa del Product Owner. |
| **FUERA DE ALCANCE** | No pertenece a SICL 0.6 y no debe inferirse del MVP. |
| **BLOQUEADO POR CONTRATO** | El contrato actual no permite operar o probar la capacidad sin definir una superficie canónica. |

En todo el documento, “existe en el código” significa que se observó en el código local indicado. No significa que exista una operación HTTP remota ni que el E2E haya sido ejecutado.

---

## 2. Fuentes contrastadas

| Fuente | Uso en esta revisión |
|---|---|
| `docs/SICL_MASTER_SPEC_v1.md` | Visión, principios, estados normativos, RFC y alcance propuesto. |
| `docs/SICL_STATE_AUDIT_v1.md` | Diferencia entre entidades, proyecciones, artefactos, código local y capacidades remotas. |
| `docs/SICL_0_6_ACCEPTANCE_MATRIX_v1.md` | Operaciones observables, endpoints actuales y brechas marcadas como bloqueadas. |
| `src/sicl/core_contract/model.py` | Entidades, estados, invariantes y autoridad del Core Python. |
| `http_adapter/sicl_core_http.py` | Superficie HTTP v0.3 realmente expuesta. |
| `server/routers.ts` | Frontera tRPC, fallback explícito y tratamiento read-only de Decision Conditions. |

---

## 3. Resumen ejecutivo B-001

| Decisión | Estado propuesto para clasificación |
|---|---|
| **B-001.1 Fact / Assumption** | **APROBADO** como decisión conceptual; implementación separada aún no demostrada. |
| **B-001.2 Audit / Report** | **PENDIENTE DE DECISIÓN**; Manus presenta una recomendación, no una resolución. |
| **B-001.3 Decision Conditions** | **PENDIENTE DE DECISIÓN** sobre su forma canónica; estado operativo actual: read-only. |
| **B-001.4 Alcance constitucional de SICL 0.6** | **PENDIENTE DE DECISIÓN**; la cobertura local y la cobertura HTTP no son equivalentes. |

La conclusión común es que SICL 0.6 puede seguir avanzando únicamente si se distingue entre cuatro planos: semántica aprobada, implementación local, superficie HTTP operativa y capacidades futuras. La presencia de una entidad en el Master Spec no demuestra que exista como entidad independiente ni que pueda persistirse por HTTP.

---

# 4. B-001.1 — Fact / Assumption

## 4.1 Decisión ya aprobada

El Product Owner ha establecido la siguiente regla conceptual y no debe volver a solicitarse su aprobación:

> **Fact y Assumption son epistemológicamente diferentes. UNKNOWN y CONFLICTING representan estados de conocimiento. Un Assumption no puede convertirse automáticamente en Fact. La transición requiere nueva evidencia verificable y un evento auditable.**

**Clasificación:** **APROBADO**.

Esta decisión pertenece a la constitución semántica de SICL, aunque su representación técnica completa todavía no esté separada como entidad o tipo de dato independiente.

## 4.2 Estado actual en el Master Spec

El Master Spec separa conceptualmente Source, Evidence, Fact y Assumption y afirma que el flujo debe conservar procedencia, incertidumbre y estados explícitos. También establece que el conocimiento institucional debe ser versionado, no aprendido autónomamente por el sistema.

El Master Spec, sin embargo, utiliza una formulación más amplia que el código actual: presenta Fact y Assumption dentro del mapa semántico, pero no afirma de forma suficientemente visible que la decisión aprobada requiere una transición explícita, evidencia nueva y evento auditable.

## 4.3 Qué existe realmente en el código

El Core Python contiene `Source` y `Evidence` como clases canónicas. `Evidence` incluye `evidence_id`, `source_id`, `statement` y un estado limitado a `UNVERIFIED`, `SUPPORTED`, `CONTESTED` o `REJECTED`. No se observa una clase independiente `Fact`, una clase independiente `Assumption`, un enum `UNKNOWN`/`CONFLICTING` para esos conceptos ni una operación canónica de promoción de Assumption a Fact.

La auditoría de estado confirma que Fact y Assumption son actualmente conceptos representables de manera indirecta, pero no entidades canónicas independientes demostradas. HTTP v0.3 tampoco expone operaciones específicas para ellos.

## 4.4 Problema de dejarlo como está

El riesgo no es que el código convierta automáticamente un supuesto en hecho; no existe evidencia de tal automatismo. El riesgo es la **ambigüedad de representación**: un usuario o una futura integración podría tratar `SUPPORTED` como si significara Fact, o `CONTESTED` como si significara CONFLICTING, sin que exista una distinción constitucional verificable.

También sería incorrecto afirmar que SICL ya registra una transición completa de conocimiento. Actualmente puede conservar evidencia y estados locales, pero no demuestra una transición Fact/Assumption con nueva evidencia y evento específico.

## 4.5 Alternativas

| Alternativa | Consecuencia |
|---|---|
| Mantener Fact y Assumption como roles/tipos de Evidence | Menor complejidad y compatibilidad inmediata; exige un campo o taxonomía explícita para no perder la diferencia epistemológica. |
| Crear entidades canónicas independientes | Mayor precisión semántica; requiere modelo, persistencia, eventos, endpoints, migración y pruebas adicionales. |
| Tratar ambos como estados derivados de Evidence | Evita duplicación; puede ocultar la diferencia entre el contenido de la evidencia y su estatus epistemológico. |

## 4.6 Recomendación técnica de Manus

Conservar la decisión constitucional aprobada y **no crear todavía nuevas entidades**. Para SICL 0.6, la regla debe registrarse como invariante normativa: ningún estado de evidencia equivale automáticamente a una conversión de Assumption en Fact. La representación canónica detallada debe quedar para una decisión posterior, preferentemente partiendo de Evidence con una taxonomía explícita y transición auditable, antes que duplicar entidades prematuramente.

**DECISIÓN DEL PRODUCT OWNER:** **APROBADA** para la regla conceptual; la forma técnica detallada queda **PENDIENTE DE DECISIÓN**.

---

# 5. B-001.2 — Audit / Report

## 5.1 Estado actual en el Master Spec

El Master Spec incluye Audit y Report en la visión y el flujo general, pero también indica que Audit puede ser una proyección de eventos, revisiones y decisiones, mientras Report puede ser una salida o exportación. Esa doble formulación debe clasificarse antes de congelar el Core Contract.

## 5.2 Qué existe realmente en el código

En el Core Python, `Event` es una entidad persistente del agregado. `CoreProject` conserva eventos, revisiones y decisiones. No aparece una entidad canónica independiente `Audit` ni una entidad persistente `Report` equivalente.

En tRPC, la consulta `audit` devuelve una proyección compuesta por `events`, `humanReviews` y `decisions`. En la interfaz, la auditoría se presenta como timeline/lectura. La exportación de trazabilidad genera un JSON seguro mediante `safeAuditData`; no constituye una entidad Report persistida ni un endpoint HTTP `/reports`.

La matriz de aceptación confirma que Audit se puede consultar indirectamente mediante snapshot/auditoría, mientras Report está **BLOQUEADO POR CONTRATO** por no existir un formato canónico ni endpoint HTTP v0.3 dedicado.

## 5.3 Problema de dejarlo como está

Si Audit y Report permanecen sin clasificación, distintos implementadores pueden tratarlos como entidades, vistas o documentos persistentes incompatibles entre sí. Eso produciría duplicación de estado, eventos ambiguos y posibles conflictos sobre qué constituye la fuente de verdad.

También existe el riesgo de que un reporte exportado sea interpretado como una decisión, certificación profesional o registro canónico, aunque hoy el código lo presenta como exportación de trazabilidad segura.

## 5.4 Alternativas

| Alternativa | Audit | Report | Consecuencias |
|---|---|---|---|
| Entidades independientes | Registro durable propio | Documento durable propio | Máxima formalidad; exige identidad, versionado, eventos, persistencia, endpoints y reglas de actualización. |
| Vistas derivadas | Proyección de eventos y estados | Exportación derivada | Mantiene un único estado de verdad; menor complejidad; exige definir consultas y estabilidad del formato. |
| Artefactos de evidencia | Registro de lo ocurrido | Artefacto de salida | Útil para auditorías externas; puede duplicar datos si no se define referencia a la fuente canónica. |
| Combinación controlada | Vista derivada con snapshot firmado/versionado en el futuro | Exportación derivada versionada | Equilibra trazabilidad y estabilidad; requiere especificar qué parte es canónica y qué parte es copia. |

## 5.5 Recomendación técnica de Manus

La recomendación es **no convertir Audit ni Report en entidades nucleares de SICL 0.6**. Mantener Audit como proyección derivada de eventos, revisiones y decisiones; mantener Report como artefacto de exportación derivado, con referencia al snapshot y a su versión. Si en el futuro se necesita un documento durable para una autoridad externa, debe aprobarse un RFC específico que defina su identidad, firma/versionado, procedencia y relación con el estado canónico.

Esta es una recomendación, no una decisión impuesta.

**DECISIÓN DEL PRODUCT OWNER:** **PENDIENTE DE DECISIÓN**.

---

# 6. B-001.3 — Decision Conditions

## 6.1 Qué son

Decision Conditions son condiciones declarativas que explican **en qué circunstancias una alternativa podría dejar de ser preferible, viable o compatible con un objetivo**. No son una decisión, no son una orden y no son una predicción automática.

Una condición puede expresar, por ejemplo, que una recomendación depende de que un indicador permanezca por debajo de un umbral, que una restricción siga vigente o que una evidencia no sea refutada. Su función es hacer visibles las dependencias y los límites de una recomendación.

## 6.2 Qué autoridad tienen

Su autoridad es **explicativa y analítica**, no decisoria. Una Decision Condition no puede seleccionar una alternativa, aprobar un proyecto, convertir un supuesto en hecho, certificar cumplimiento legal ni sustituir la revisión humana.

Tampoco debe confundirse con una `Constraint`: una restricción limita el espacio de alternativas conforme al contrato; una Decision Condition explica una dependencia o condición de validez de una salida analítica. Si en el futuro ambos conceptos interactúan, la relación deberá definirse explícitamente.

## 6.3 Dónde viven actualmente

Actualmente aparecen como estructura declarativa local en TypeScript y como representación visible/read-only en el Command Center. La interfaz puede mostrar referencia, objetivo, criterio, operador, umbral, justificación, procedencia y estado de la condición.

En `server/routers.ts`, cuando `SICL_CORE_URL` está configurado, la mutación de `decisionConditions` se rechaza porque no existe un endpoint canónico Python para persistirlas. Esta frontera evita que el frontend cree una segunda semántica local frente al Core remoto.

No existe evidencia de una entidad canónica `DecisionCondition` en el modelo Python ni de un endpoint HTTP v0.3 de escritura.

## 6.4 Problema de dejarlo como está

El estado read-only protege el contrato actual, pero deja una diferencia entre la intención visible del producto y la semántica persistente del Core. Si se presenta como una capacidad completamente operativa, un usuario podría suponer que las condiciones se guardan en el mismo estado canónico que Preference, Recommendation o Decision.

El riesgo contrario también es importante: implementar rápidamente un endpoint local o una entidad paralela podría convertir una condición explicativa en una regla automática no aprobada.

## 6.5 Alternativas

| Alternativa | Consecuencia |
|---|---|
| Mantenerla como vista/artefacto read-only | Preserva seguridad y evita ampliar el Core; no permite persistencia canónica. |
| Convertirla en entidad canónica | Permite trazabilidad durable; exige modelo, eventos, versionado, endpoint y reglas de autoridad. |
| Tratarla como parte de Recommendation | Reduce entidades; puede mezclar la salida analítica con sus condiciones de validez. |
| Tratarla como extensión de Constraint | Puede favorecer verificabilidad; puede alterar el significado de una restricción y requiere nueva semántica. |

## 6.6 Recomendación técnica de Manus

Mantener Decision Conditions **read-only** y fuera de la escritura canónica durante SICL 0.6. Su ubicación inmediata debe ser la frontera de análisis/representación, con referencias a entidades canónicas existentes cuando corresponda, pero sin crear persistencia paralela.

Una futura propuesta canónica debería definir si Decision Conditions son entidades, artefactos derivados de Recommendation o una relación formal entre Recommendation, Objective, Constraint, Evidence y estados. Esa decisión debe incluir versionado, procedencia, evento, autoridad y comportamiento ante cambios de evidencia.

**DECISIÓN DEL PRODUCT OWNER:** **PENDIENTE DE DECISIÓN** sobre su forma canónica; estado operativo actual **READ-ONLY / BLOQUEADO POR CONTRATO para escritura**.

---

# 7. B-001.4 — Alcance constitucional exacto de SICL 0.6

## 7.1 Regla de lectura

El alcance de SICL 0.6 debe distinguir entre:

1. **Semántica del Core local:** clases y reglas que existen en el Core Python.
2. **Superficie HTTP v0.3:** operaciones que pueden ejecutarse de manera canónica entre servicios.
3. **Representación web:** vistas y formularios que muestran o capturan información.
4. **Evidencia de aceptación:** pruebas efectivamente ejecutadas.

Una entidad que aparece en el Master Spec o en el modelo Python no es automáticamente una operación disponible por HTTP.

## 7.2 Entidades y operaciones que pertenecen al núcleo de 0.6

La siguiente clasificación refleja la recomendación técnica de alcance, sin declarar cerrado aquello que requiere decisión del Product Owner:

| Elemento | Estado real | Clasificación para 0.6 |
|---|---|---|
| Project y contexto espacial/temporal | Core, SQLite, HTTP y web locales | **NÚCLEO OPERATIVO PREPARADO** |
| Source y Evidence | Modelo/locales; sin endpoint HTTP específico | **BLOQUEADO POR CONTRATO** para E2E remoto |
| Fact y Assumption | Decisión conceptual aprobada; sin entidades separadas demostradas | **APROBADO CON IMPLEMENTACIÓN TÉCNICA PENDIENTE** |
| Objective | Modelo y reglas locales; sin endpoint HTTP específico | **BLOQUEADO POR CONTRATO** para E2E remoto |
| Constraint y Requirement | Modelo/locales; sin endpoint HTTP específico | **BLOQUEADO POR CONTRATO** para E2E remoto |
| Preference | Modelo, SQLite, evento, snapshot, HTTP v0.3 y web local | **NÚCLEO OPERATIVO PREPARADO; E2E REMOTO PENDIENTE** |
| Alternative | Modelo/locales; sin endpoint HTTP específico | **BLOQUEADO POR CONTRATO** para E2E remoto |
| Evaluation | Modelo/locales y flujo web local; sin endpoint HTTP específico | **BLOQUEADO POR CONTRATO** para E2E remoto |
| Comparison | Modelo/locales/Council; sin endpoint HTTP específico de escritura | **BLOQUEADO POR CONTRATO** para E2E remoto |
| Recommendation | Modelo, HTTP v0.3 y web; salida analítica | **NÚCLEO OPERATIVO PREPARADO; E2E REMOTO PENDIENTE** |
| HumanReview | Modelo/flujo, HTTP v0.3 y web | **NÚCLEO OPERATIVO PREPARADO; E2E REMOTO PENDIENTE** |
| Decision | Modelo/flujo, HTTP v0.3 y autoridad explícita | **NÚCLEO OPERATIVO PREPARADO; E2E REMOTO PENDIENTE** |
| Event | Persistencia local y append-only a nivel de aplicación | **NÚCLEO DE TRAZABILIDAD; REINICIO REMOTO PENDIENTE** |
| Audit | Proyección de eventos, revisiones y decisiones | **VISTA DERIVADA; FORMA CANÓNICA PENDIENTE** |
| Report | Exportación JSON segura; sin entidad ni endpoint dedicado | **BLOQUEADO POR CONTRATO** como Report canónico |
| Council | Consulta analítica read-only | **VISTA READ-ONLY PREPARADA** |
| Decision Conditions | Estructura TS/UI read-only; sin Core Python canónico | **READ-ONLY; BLOQUEADO POR CONTRATO para escritura** |

## 7.3 Invariantes que sí pertenecen a 0.6

Las siguientes invariantes forman parte del núcleo constitucional y no deben relajarse:

| Invariante | Estado para 0.6 |
|---|---|
| La IA analiza y recomienda; la autoridad humana decide | **Núcleo aprobado y probado localmente** |
| Recommendation no equivale a Decision | **Implementada y probada localmente** |
| Recommendation no crea Decision | **Implementada y probada localmente** |
| Decision requiere actor, base de autoridad y confirmación | **Implementada y probada localmente** |
| Preference conserva justificación, procedencia, estado y versión | **Implementada y probada localmente** |
| Preference registra `PREFERENCE_RECORDED` | **Implementada y probada localmente** |
| La dirección de Objective no se infiere | **Implementada y probada localmente** |
| Evaluación conserva método, inputs, unidad, criterio y factibilidad | **Implementada y probada localmente** |
| Comparación insuficiente produce estado explícito | **Implementada y probada localmente** |
| Eventos previos no se modifican en replay | **Implementada a nivel de aplicación; persistencia externa pendiente** |
| Fact no es Assumption y no hay promoción automática | **Regla constitucional aprobada; representación detallada pendiente** |
| Decision Conditions no es una decisión ni una predicción | **Implementada como read-only local** |
| El fallback local no se presenta como Remote Core | **Implementada y probada localmente** |
| Los secretos no llegan al navegador | **Preparada/probada localmente; navegador remoto pendiente** |

## 7.4 Brecha contractual explícita

La matriz de aceptación operacional establece que las siguientes áreas están actualmente **BLOQUEADAS POR CONTRATO en HTTP v0.3**:

> **Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report.**

Esta brecha no se resuelve en esta revisión. No se propone crear endpoints, ampliar HTTP, cambiar SQLite ni modificar el Core Contract. La brecha debe permanecer visible hasta que el Product Owner clasifique el alcance y autorice un RFC contractual específico.

## 7.5 Lo que queda fuera de SICL 0.6

Quedan fuera del alcance constitucional de SICL 0.6, salvo decisión posterior explícita:

- AestheticProfile, motor universal de belleza o score universal de estética.
- Agentes autónomos o decisiones delegadas a IA.
- BIM operativo, Digital Twin e IoT.
- GIS operativo y agregación territorial avanzada.
- Monte Carlo, optimización avanzada y simulación compleja.
- Escenarios nacionales completos, agregación colectiva y validación política.
- Nuevas entidades para Fact, Assumption, Audit, Report o Decision Conditions.
- Superficies HTTP nuevas para cerrar la brecha de la matriz.

La estética se conserva únicamente como **RFC/capacidad futura**: un dominio eventual de Preference, Criterion, Evaluation, Evidence, incertidumbre y revisión humana. No forma parte del Core Contract de 0.6.

## 7.6 Recomendación técnica sobre el alcance

La recomendación es congelar SICL 0.6 como un MVP de trazabilidad y autoridad humana con dos niveles de afirmación:

- **Release Candidate local:** semántica, persistencia temporal, pruebas y Command Center verificados.
- **Integración remota preparada:** Project, Preference, Recommendation, HumanReview, Decision, Council y snapshot tienen superficies definidas o preparadas, pero requieren Cloud Computer, persistencia, HTTPS y E2E.

No se debe describir SICL 0.6 como un flujo remoto completo Evidence→Decision mientras la brecha HTTP permanezca abierta. Esa decisión de nomenclatura y alcance final corresponde al Product Owner.

**DECISIÓN DEL PRODUCT OWNER:** **PENDIENTE DE DECISIÓN** sobre el alcance constitucional exacto y la forma en que la brecha contractual afecta la definición oficial de 0.6.

---

# 8. Decisiones que no se resuelven en este documento

Esta revisión no decide por sí sola:

| Tema | Estado |
|---|---|
| Entidades independientes o roles para Fact/Assumption | Decisión conceptual aprobada; forma técnica pendiente. |
| Audit como proyección o entidad | Pendiente del Product Owner. |
| Report como exportación o entidad | Pendiente del Product Owner. |
| Forma canónica de Decision Conditions | Pendiente; escritura bloqueada. |
| Si el conjunto completo Evidence→Decision pertenece al alcance remoto de 0.6 | Pendiente. |
| Clasificación formal del Master Spec como constitución congelada | Pendiente. |
| RFC de estética futura | Propuesto; fuera del Core Contract 0.6. |

---

# 9. INTERVENCIÓN DEL PRODUCT OWNER — RESPUESTAS NECESARIAS (HISTÓRICO)

Responder cada pregunta con una sola opción: **APROBADO**, **APROBADO CON CAMBIOS**, **POSTERGAR** o **RECHAZADO**. Si una respuesta requiere información adicional, escribir **INTERVENCIÓN DEL USUARIO REQUERIDA** y explicar qué dato falta.

### B-001.1 — Fact / Assumption

1. ¿Confirma como regla constitucional que **Fact y Assumption son epistemológicamente diferentes**, que `UNKNOWN` y `CONFLICTING` representan estados de conocimiento, que un Assumption no puede convertirse automáticamente en Fact y que la transición requiere nueva evidencia verificable y evento auditable?

> Estado actual: **APROBADO**. Esta pregunta solo solicita confirmación documental de la decisión ya comunicada; no debe interpretarse como una nueva solicitud de aprobación.

2. ¿Aprueba mantener la forma técnica detallada de Fact/Assumption fuera de la implementación inmediata de SICL 0.6, sin crear nuevas entidades durante esta fase?

### B-001.2 — Audit / Report

3. ¿Aprueba que **Audit permanezca como proyección derivada** de eventos, HumanReviews y Decisions, sin entidad canónica independiente en SICL 0.6?

4. ¿Aprueba que **Report permanezca como exportación/artefacto derivado versionado**, sin entidad persistente ni endpoint HTTP dedicado en SICL 0.6?

5. Si no aprueba alguna de las dos preguntas anteriores, ¿clasifica la alternativa preferida como **APROBADO CON CAMBIOS** y solicita un RFC posterior que defina identidad, versionado, procedencia, eventos y superficie HTTP antes de implementarla?

### B-001.3 — Decision Conditions

6. ¿Aprueba que Decision Conditions sigan siendo **read-only** durante SICL 0.6 y que no se cree un endpoint de escritura en esta fase?

7. ¿Aprueba que su autoridad sea únicamente **explicativa/analítica**, sin capacidad para crear Decisions, seleccionar alternativas, convertir Assumptions en Facts o certificar validez profesional?

8. ¿Aprueba postergar la decisión sobre su forma canónica —entidad, artefacto derivado o relación con Recommendation/Constraint— hasta un RFC específico posterior?

### B-001.4 — Alcance constitucional de SICL 0.6

9. ¿Aprueba definir SICL 0.6 como un MVP de trazabilidad y autoridad humana con Release Candidate local verificado e integración remota preparada, pero **sin afirmar que el flujo remoto completo Evidence→Decision está cerrado**?

10. ¿Aprueba mantener explícitamente **BLOQUEADO POR CONTRATO** en HTTP v0.3 a Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report, sin crear endpoints para resolverlo durante esta fase?

11. ¿Aprueba que SICL 0.6 no incorpore nuevas entidades, estética, agentes, BIM, Digital Twin, IoT, Monte Carlo, optimización avanzada, GIS operativo ni agregación territorial/nacional avanzada?

12. ¿Aprueba clasificar formalmente `SICL_MASTER_SPEC_v1.md` como **APROBADO CON CAMBIOS** o **POSTERGAR** hasta responder las preguntas 2–11 y consolidar las respuestas en una versión posterior?

---

## 10. Resolución recibida y estado consolidado

La respuesta del Product Owner resuelve B-001 del siguiente modo:

| Área | Estado consolidado |
|---|---|
| Fact / Assumption | **APROBADO** como distinción epistemológica; no promoción automática; forma técnica detallada postergada sin nuevas entidades en 0.6. |
| Audit | **APROBADO** como proyección derivada de Events, HumanReviews y Decisions; sin entidad canónica independiente en 0.6. |
| Report | **APROBADO** como artefacto/exportación derivado y versionado; sin entidad persistente ni endpoint dedicado en 0.6. |
| Decision Conditions | **APROBADO** como read-only, con autoridad exclusivamente explicativa/analítica; sin endpoint de escritura en 0.6. |
| Forma canónica de Decision Conditions | **POSTERGADA** a RFC específico posterior. |
| Alcance exacto de SICL 0.6 | **APROBADO CON CAMBIOS**: núcleo constitucional y operativo inicial; distinguir Core, HTTP, Web y E2E. |
| Entidades/operaciones sin HTTP v0.3 | **BLOQUEADO POR CONTRATO**, no fuera de SICL. |
| Estética y capacidades avanzadas | **FUERA DE ALCANCE** del Core Contract 0.6; estética únicamente como RFC futuro. |
| Master Spec | **APROBADO CON CAMBIOS** como constitución consolidada; queda recomendada una revisión documental posterior de su estructura. |

> **Cierre:** B-001 queda consolidado documentalmente. Esta resolución no autoriza código, endpoints, migraciones, infraestructura, E2E remoto ni ampliación del Core Contract. La integración remota permanece preparada, no certificada.

---

## Referencias internas

1. `docs/SICL_MASTER_SPEC_v1.md` — Especificación maestra constitucional revisada.
2. `docs/SICL_STATE_AUDIT_v1.md` — Auditoría técnica del estado real.
3. `docs/SICL_0_6_ACCEPTANCE_MATRIX_v1.md` — Matriz operacional de aceptación.
4. `src/sicl/core_contract/model.py` — Modelo canónico del Core Python.
5. `http_adapter/sicl_core_http.py` — Adaptador HTTP v0.3.
6. `server/routers.ts` — Frontera tRPC, Core remoto y Decision Conditions read-only.
7. `deploy/CLOUD_COMPUTER_RUNBOOK.md` — Runbook remoto, no ejecutado en esta fase.
8. `docs/SICL_A001_RESOLUTION.md` — Resolución de la discrepancia técnica A-001.

**Autor:** Manus AI  
**Fecha:** 24 de agosto de 2026  
**Estado:** B-001 consolidado documentalmente.
