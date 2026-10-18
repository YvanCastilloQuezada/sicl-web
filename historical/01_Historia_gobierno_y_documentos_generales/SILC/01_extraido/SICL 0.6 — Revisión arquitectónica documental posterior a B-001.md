# SICL 0.6 — Revisión arquitectónica documental posterior a B-001

**Estado:** diagnóstico y propuesta documental para revisión del Product Owner. No es una autorización de implementación.

**Fecha:** 24 de agosto de 2026  
**Autor:** Manus AI  
**Alcance:** revisión documental exclusivamente; no se modificaron código, entidades, SQLite, endpoints, HTTP v0.3, tRPC, frontend, infraestructura ni evidencia E2E.

> **Regla de lectura:** la Constitución define qué es SICL; el Core Contract define qué es canónico; HTTP define qué puede exponerse; la implementación describe lo que existe; Acceptance define qué se ha probado; Roadmap define qué falta; y los RFC describen cambios futuros. Ninguna capa puede utilizarse como evidencia automática de otra.

---

## Resumen ejecutivo

La arquitectura documental de SICL es sustancialmente coherente después de B-001, pero `SICL_MASTER_SPEC_v1.md` todavía funciona como un documento híbrido: contiene principios constitucionales, entidades del Core Contract, detalles de HTTP, estados de implementación, aceptación, roadmap y RFC futuros. Esto es útil como índice maestro, pero no es todavía una constitución pura.

La recomendación es **no reescribir inmediatamente el Master Spec v2 completo**. Primero debe aprobarse una separación documental por capas. El Master Spec actual debe conservarse como índice y constitución consolidada de transición, mientras nuevos documentos canónicos separan normatividad, contrato, superficie de exposición, evidencia y operación.

La revisión confirma que el problema principal no es una contradicción semántica grave, sino la posibilidad de que un lector confunda una afirmación perteneciente a una capa con una prueba de otra. En particular, “implementado localmente” no significa “expuesto por HTTP”, “preparado” no significa “verificado”, y “bloqueado por contrato” no significa “fuera de SICL”.

| Resultado | Clasificación |
|---|---|
| Principios de autoridad humana y trazabilidad | **IN CONSTITUTION / APPROVED** |
| Entidades canónicas del Core | **IN CORE**, con estado de implementación independiente |
| Audit y Report | **DERIVADOS APROBADOS**, no entidades canónicas de 0.6 |
| Decision Conditions | **READ-ONLY / APPROVED**, forma canónica futura |
| HTTP v0.3 | **EXPOSED parcialmente**, no equivalente al Core completo |
| Implementación local | **IMPLEMENTED / VERIFIED localmente** según componente |
| E2E remoto | **NO E2E VERIFIED**; bloqueado por infraestructura |
| Capacidades no expuestas por HTTP v0.3 | **BLOCKED BY CONTRACT**, no fuera de SICL |
| Estética, agentes, BIM, Digital Twin, IoT, GIS operativo y optimización avanzada | **FUTURE / OUT OF SCOPE 0.6** |

---

# Entregable A — Diagnóstico de arquitectura documental

## A.1 Lo que está correctamente separado

La separación de autoridad está bien definida. Recommendation describe una salida analítica, HumanReview registra una revisión identificable y Decision exige autoridad humana explícita. La documentación y la evidencia local coinciden en que el sistema no puede convertir una recomendación en una decisión ni tomar una decisión por ausencia de respuesta humana.

La separación entre Audit y Report también está correctamente resuelta por B-001. Audit es una proyección derivada de eventos, revisiones y decisiones; Report es un artefacto o exportación derivado y versionado. Ninguno debe tratarse como entidad persistente independiente en SICL 0.6.

La brecha entre Core Contract y HTTP v0.3 está explícitamente reconocida en la Acceptance Matrix. Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report no tienen una superficie HTTP canónica completa demostrada. El documento no inventa endpoints y marca correctamente estas capacidades como **BLOQUEADO POR CONTRATO**.

La diferencia entre implementación local y operación remota también está bien declarada. El Release Candidate, las pruebas Python, las pruebas web, el smoke test HTTP temporal, el Dockerfile y el runbook prueban preparación y coherencia local; no prueban Cloud Computer, HTTPS, persistencia externa ni E2E remoto.

Fact y Assumption quedaron conceptualmente separados. La regla aprobada es que un Assumption no se convierte automáticamente en Fact; una eventual transición exige evidencia verificable nueva y un evento auditable. La forma técnica detallada se mantiene postergada, sin nuevas entidades en 0.6.

## A.2 Lo que permanece mezclado

| ID | Mezcla documental | Riesgo | Corrección recomendada |
|---|---|---|---|
| MIX-001 | El Master Spec combina Constitución, Core Contract, HTTP, implementación, aceptación, roadmap y RFC. | Un lector puede interpretar una descripción operativa como regla constitucional. | Convertir el Master Spec v2 en índice normativo y separar documentos especializados. |
| MIX-002 | La sección “Core Contract” lista entidades canónicas junto con Council, Audit y Report. | Puede interpretarse que toda fila es una entidad persistente de igual rango. | Dividir entidades canónicas, proyecciones y artefactos derivados. |
| MIX-003 | La visión Evidence→Decision aparece junto a etapas que no están expuestas por HTTP v0.3. | Puede confundirse flujo semántico completo con flujo remoto certificable. | Añadir siempre columnas o estados Core/HTTP/Web/E2E. |
| MIX-004 | “Implementado” se usa en diferentes contextos: modelo, UI, HTTP, local o remoto. | Sobreestimación del grado de disponibilidad. | Usar taxonomía única: IN CORE, EXPOSED, IMPLEMENTED, VERIFIED, E2E VERIFIED. |
| MIX-005 | RFC implementados, propuestos y futuros están en una tabla única. | Un RFC puede parecer autorización del Product Owner. | Separar decisión constitucional, contrato vigente, propuesta, postergado y futuro. |
| MIX-006 | Roadmap de Cloud Computer y HTTPS está incluido en el Master Spec. | La Constitución puede parecer dependiente de una infraestructura concreta. | Mover la ejecución a documentación operacional enlazada. |
| MIX-007 | La revisión constitucional conserva preguntas históricas junto con la resolución posterior. | El lector puede ver “pendiente” aunque B-001 ya fue resuelto. | Mantener el bloque histórico, pero anteponer un estado consolidado inequívoco. |
| MIX-008 | SICL 1–3 se presentan como arquitectura común y como capacidades de uso. | Puede inferirse que SICL 2 y 3 ya son operaciones territoriales/nacionales completas. | Separar principio de escalabilidad, contrato mínimo preparado y capacidades no implementadas. |
| MIX-009 | Acceptance y estado de implementación aparecen en el documento constitucional. | Un PASS local puede adquirir apariencia normativa o remota. | Mantener solo reglas de aceptación; mover resultados de ejecución a Evidence Ledger. |

## A.3 Diagnóstico final

La arquitectura documental está **apta para continuar como transición controlada**, pero no debe declararse todavía una constitución pura. No recomiendo cambiar el Core Contract para resolver este problema. La corrección adecuada es documental: separar responsabilidades, asignar estados y convertir los documentos actuales en fuentes con autoridad distinta.

---

# Entregable B — Propuesta de nueva estructura documental SICL 0.6

La siguiente estructura preserva los documentos existentes y añade una separación clara. No implica borrar, renombrar ni reescribirlos durante esta fase.

| Documento propuesto | Propósito | Autoridad | Relación |
|---|---|---|---|
| `SICL_CONSTITUTION_v1.md` | Identidad, propósito, autoridad humana, trazabilidad, estados epistemológicos, reglas de expansión y límites. | Normativa constitucional | Fuente superior de principios. |
| `SICL_CORE_CONTRACT_0.6.md` | Entidades canónicas, invariantes, versionado, eventos y transacciones aprobadas. | Contrato semántico | Deriva de la Constitución. |
| `SICL_HTTP_CONTRACT_v0.3.md` | Endpoints, envelopes, autenticación, normalización, errores y capacidades expuestas. | Contrato de exposición | Expone solo una parte del Core. |
| `SICL_IMPLEMENTATION_STATUS_0.6.md` | Qué existe en Python, SQLite, tRPC, Web y simulador. | Descriptiva | No redefine el contrato. |
| `SICL_ACCEPTANCE_EVIDENCE_0.6.md` | Pruebas ejecutadas, comandos, commits, hashes, PASS/FAIL y límites. | Evidencia | No autoriza cambios. |
| `SICL_OPERATIONAL_RUNBOOK_0.6.md` | Cloud Computer, Docker, systemd, persistencia, HTTPS, secretos y reinicio. | Operacional | Solo aplica cuando exista infraestructura real. |
| `SICL_RFC_INDEX.md` | Índice de propuestas, contratos futuros, postergaciones y decisiones asociadas. | Propositiva | RFC no equivale a aprobación. |
| `SICL_0_6_DECISION_REGISTER.md` | Registro de decisiones del Product Owner, incluyendo B-001 y A-001. | Gobernanza documental | Vincula decisión con artefactos afectados. |
| `SICL_MASTER_SPEC_v1.md` | Índice maestro de transición y referencia consolidada. | Mixta, temporal | Debe enlazar las fuentes anteriores y declarar su carácter transitorio. |

## B.1 Regla de precedencia

Cuando exista una aparente contradicción, la precedencia documental recomendada es: `SICL_CONSTITUTION_v1.md` para principios; `SICL_CORE_CONTRACT_0.6.md` para semántica canónica; `SICL_HTTP_CONTRACT_v0.3.md` para exposición; `SICL_IMPLEMENTATION_STATUS_0.6.md` para existencia de código; `SICL_ACCEPTANCE_EVIDENCE_0.6.md` para pruebas; `SICL_OPERATIONAL_RUNBOOK_0.6.md` para despliegue; y `SICL_RFC_INDEX.md` para futuro.

El Master Spec no debe ganar por estar en una posición central. Debe funcionar como índice y mapa de navegación, no como sustituto de cada fuente especializada.

---

# Entregable C — Matriz de correspondencia por capas

**Leyenda:** `APPROVED` pertenece a una decisión o regla aprobada; `IN CORE` pertenece al contrato canónico; `EXPOSED` tiene superficie HTTP identificada; `IMPLEMENTED` existe código; `VERIFIED` tiene pruebas locales; `E2E VERIFIED` tiene prueba remota completa; `READ-ONLY` no modifica estado; `BLOCKED BY CONTRACT` pertenece al mapa SICL pero no puede probarse por HTTP actual; `FUTURE` queda fuera del alcance operativo.

| Concepto | Constitución | Core | HTTP | Web | Implementación | Test | E2E |
|---|---|---|---|---|---|---|---|
| Project | APPROVED | IN CORE | EXPOSED: create/snapshot | IMPLEMENTED | IMPLEMENTED | VERIFIED | PENDING |
| Source | APPROVED | IN CORE | No endpoint específico | Parcial | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Evidence | APPROVED | IN CORE | BLOCKED BY CONTRACT | Parcial | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT |
| Fact | APPROVED como distinción | No entidad separada en 0.6 | No endpoint | No módulo propio | Representable vía Evidence/procedencia | Indirecto | BLOCKED BY CONTRACT |
| Assumption | APPROVED como distinción | No entidad separada en 0.6 | No endpoint | No módulo propio | Representable vía Evidence/procedencia | Indirecto | BLOCKED BY CONTRACT |
| Objective | APPROVED | IN CORE | BLOCKED BY CONTRACT | IMPLEMENTED local | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Constraint | APPROVED | IN CORE | BLOCKED BY CONTRACT | IMPLEMENTED local | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Requirement | APPROVED | IN CORE | BLOCKED BY CONTRACT | IMPLEMENTED local | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Preference | APPROVED | IN CORE | EXPOSED: POST + snapshot | IMPLEMENTED | IMPLEMENTED | VERIFIED | PENDING infrastructure |
| Alternative | APPROVED | IN CORE | BLOCKED BY CONTRACT | IMPLEMENTED local | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Evaluation | APPROVED | IN CORE | BLOCKED BY CONTRACT | IMPLEMENTED local | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Comparison | APPROVED | IN CORE | BLOCKED BY CONTRACT | Council/read-only local | IMPLEMENTED | VERIFIED | BLOCKED BY CONTRACT |
| Recommendation | APPROVED | IN CORE | EXPOSED: POST + Council | IMPLEMENTED | IMPLEMENTED | VERIFIED | PENDING infrastructure |
| HumanReview | APPROVED | IN CORE | EXPOSED: POST | IMPLEMENTED/Audit | IMPLEMENTED | VERIFIED | PENDING infrastructure |
| Decision | APPROVED | IN CORE | EXPOSED: POST | Prepare/register | IMPLEMENTED | VERIFIED | PENDING infrastructure |
| Event | APPROVED | IN CORE | Indirect via snapshot/audit | Audit view | IMPLEMENTED local | VERIFIED local | PENDING persistence |
| Audit | APPROVED como proyección | Derivado; no entidad | READ-ONLY indirecto | READ-ONLY | IMPLEMENTED projection | VERIFIED local | PENDING infrastructure |
| Report | APPROVED como artefacto | No entidad | BLOCKED BY CONTRACT | Export local | IMPLEMENTED export | VERIFIED local | BLOCKED BY CONTRACT |
| Council | APPROVED como vista | Derivado/read-only | READ-ONLY exposed | READ-ONLY | IMPLEMENTED | VERIFIED | PENDING infrastructure |
| Decision Conditions | APPROVED read-only | Forma canónica postergada | No escritura | READ-ONLY | Declarativo local | VERIFIED local | BLOCKED BY CONTRACT |
| Investigación de Operaciones | APPROVED como capa analítica | Catálogo/métodos definidos según alcance | READ-ONLY methods | Parcial | IMPLEMENTED catálogo | VERIFIED local | PENDING infraestructura |
| SICL 1 | APPROVED como escala | Scope mínimo | Parcial | Representado | Parcial | VERIFIED local | PENDING |
| SICL 2 | APPROVED como principio | Scope mínimo preparado | No operación territorial completa | No GIS operativo | PREPARED | Parcial | FUTURE/PENDING contract |
| SICL 3 | APPROVED como principio | Scope temporal mínimo | No operación nacional completa | No escenario productivo | PREPARED | Parcial | FUTURE/PENDING contract |
| Estética/AestheticProfile | FUTURE/RFC | OUT OF CORE 0.6 | No | No operativa | No implementada | No E2E | FUTURE |
| Cloud Computer/HTTPS | No constitucional | No | Operational dependency | No | PREPARED runbook | No remote evidence | BLOCKED BY INFRASTRUCTURE |

**Lectura correcta de la matriz:** una fila puede estar `IN CORE` y simultáneamente `BLOCKED BY CONTRACT` en HTTP. Eso no es una contradicción; significa que la semántica pertenece al Core, pero la superficie de exposición todavía no la permite certificar remotamente.

---

# Entregable D — Lista de inconsistencias documentales

| ID | Documento o capa | Problema | Capa correcta | Severidad | Acción recomendada |
|---|---|---|---|---|---|
| DOC-001 | `SICL_MASTER_SPEC_v1.md` | El título y propósito son constitucionales, pero el documento también contiene roadmap, pruebas, implementación y RFC. | Constitución + índice maestro, con enlaces a documentos especializados. | Media | Reclasificar secciones en v2; no modificar código. |
| DOC-002 | Master Spec, sección Core Contract | Council, Audit y Report aparecen próximos a entidades canónicas. | Core Contract separado de proyecciones y artefactos. | Alta | Separar visual y normativamente esas categorías en v2. |
| DOC-003 | Master Spec y State Audit | La visión Evidence→Decision puede leerse como flujo HTTP completo. | Constitución para visión; HTTP/Acceptance para cobertura real. | Alta | Añadir una etiqueta permanente “semántica conceptual; HTTP parcial”. |
| DOC-004 | Master Spec, tabla de entidades | “Implementado” no siempre indica si es local, HTTP o remoto. | Implementation Status + Acceptance Evidence. | Alta | Sustituir estados simples por la taxonomía de capas. |
| DOC-005 | Master Spec, RFC index | RFC implementados y futuros comparten tabla y lenguaje. | RFC Index y Decision Register. | Media | Añadir estado y autoridad de cada RFC. |
| DOC-006 | Master Spec, roadmap | Cloud Computer, HTTPS y persistencia aparecen dentro del documento constitucional. | Operational Runbook. | Media | Moverlos a un documento operacional enlazado. |
| DOC-007 | Constitutional Review | Las preguntas históricas continúan mostrando “pendiente” después de la resolución B-001. | Decision Register + bloque histórico claramente rotulado. | Baja | Mantener histórico, pero usar el estado consolidado como fuente vigente. |
| DOC-008 | Master Spec, SICL 1–3 | El principio multiescala y la operación territorial/nacional no siempre están visualmente diferenciados. | Constitution para principio; Status/Roadmap para capacidad. | Media | Separar “principio aprobado”, “scope preparado” y “operación futura”. |
| DOC-009 | Master Spec, acceptance | La evidencia de pruebas y la regla de aceptación comparten espacio. | Acceptance Contract vs Acceptance Evidence. | Media | Separar criterio normativo de resultado de ejecución. |
| DOC-010 | Acceptance Matrix / repositorio | El checkout objetivo es verificable, pero el directorio de trabajo tiene artefactos posteriores no rastreados. | Release/Evidence Ledger. | Media | Usar checkout limpio del commit autorizado para despliegue; no limpiar destructivamente ahora. |
| DOC-011 | Master Spec, RFC-013/014 | Los RFC añadidos después de B-001 están integrados en la tabla, pero la numeración y su autoridad deben quedar registradas en un índice formal. | RFC Index. | Baja | Documentar que son consolidaciones documentales, no cambios de Core. |
| DOC-012 | Todos los documentos | Se usan español e inglés para estados sin una tabla de equivalencias única. | Taxonomía de estados. | Baja | Definir estados canónicos en español con código estable en v2. |

Ninguna de estas inconsistencias justifica modificar el Core Contract, crear endpoints o iniciar infraestructura. Son inconsistencias de clasificación, nomenclatura y navegación documental.

---

# Entregable E — Propuesta de estructura para `SICL_MASTER_SPEC_v2`

No se redacta todavía el documento v2 completo. Se propone la siguiente arquitectura.

## E.1 Portada y control normativo

1. Identidad del documento, versión, fecha, autor y estado.
2. Clasificación vigente: constitución consolidada de SICL 0.6.
3. Autoridad de aprobación y registro de decisiones aplicables.
4. Regla explícita: el documento no prueba implementación ni E2E por aparecer en él.

## E.2 Constitución de SICL

1. Identidad y propósito.
2. Naturaleza del sistema: inteligencia asistida y trazable, no autoridad automática.
3. Autoridad humana y límites.
4. Trazabilidad, procedencia, versionado y reversibilidad.
5. Estados epistemológicos: `UNKNOWN`, `CONFLICTING`, Fact y Assumption.
6. Regla `Fact ≠ Assumption` y no promoción automática.
7. Recommendation, HumanReview y Decision.
8. Audit como proyección y Report como artefacto.
9. Escalabilidad SICL 1–3 como principio, no como afirmación de capacidades operativas completas.
10. Regla de expansión: RFC y decisión explícita del Product Owner para modificar el Core Contract.

## E.3 Mapa de capas

Incluir una sola matriz resumida con las capas Constitución, Core, HTTP, Web, Implementación, Test y E2E. Cada fila debe poder enlazar al documento o evidencia que la sustenta. La matriz no debe convertirse en una segunda fuente de verdad; debe ser un índice verificable.

## E.4 Fronteras y no equivalencias

Este capítulo debe declarar de forma visible:

> `IN CORE` no significa `EXPOSED`.
>
> `IMPLEMENTED` no significa `VERIFIED`.
>
> `VERIFIED` no significa `E2E VERIFIED`.
>
> `BLOCKED BY CONTRACT` no significa `FUTURE` ni `OUT OF SICL`.
>
> `Recommendation ≠ Decision`.

## E.5 Referencias documentales

El Master Spec v2 debe enlazar, sin duplicar innecesariamente, al Core Contract, HTTP Contract, Implementation Status, Acceptance Evidence, Operational Runbook, RFC Index y Decision Register.

## E.6 Apéndice de alcance 0.6

Debe listar explícitamente lo que sí forma parte del alcance constitucional/operativo inicial y lo que queda fuera: estética operativa, AestheticProfile, agentes, BIM, Digital Twin, IoT, GIS operativo, Monte Carlo, optimización avanzada, agregación territorial/nacional avanzada y nuevas entidades no aprobadas.

## E.7 Regla de transición

El v2 no debe reemplazar al v1 de manera silenciosa. Debe incluir una tabla de migración documental:

| Elemento v1 | Destino en v2 | Acción |
|---|---|---|
| Principios constitucionales | Constitución | Conservar y simplificar. |
| Core Contract | Documento de contrato | Extraer sin alterar semántica. |
| HTTP v0.3 | Contrato HTTP | Extraer superficie y errores. |
| Estado de implementación | Implementation Status | Extraer estados locales/remotos. |
| Pruebas de aceptación | Acceptance Contract/Evidence | Separar criterio de resultado. |
| Roadmap y despliegue | Operational Runbook/Roadmap | Extraer dependencias operativas. |
| RFC | RFC Index | Reclasificar autoridad y estado. |
| Decisiones B-001/A-001 | Decision Register | Vincular decisión con documentos afectados. |

---

# Taxonomía documental propuesta

| Código | Significado | Puede afirmar |
|---|---|---|
| `IN CONSTITUTION` | Pertenece a la definición normativa de SICL. | Es una regla o principio aprobado. |
| `IN CORE` | Existe en el Core Contract. | Es canónico semánticamente. |
| `EXPOSED` | Existe en la superficie contractual correspondiente. | Puede operarse por esa interfaz, sujeto a autenticación. |
| `IMPLEMENTED` | Existe código. | Hay una implementación identificable. |
| `VERIFIED` | Existe prueba con evidencia. | El comportamiento indicado pasó la prueba declarada. |
| `E2E VERIFIED` | Existe evidencia extremo a extremo en infraestructura objetivo. | El flujo indicado fue probado remotamente. |
| `READ-ONLY` | Consulta o proyección sin escritura canónica. | Puede observarse sin mutar estado. |
| `BLOCKED BY CONTRACT` | Pertenece al mapa SICL, pero no tiene superficie contractual suficiente. | Debe permanecer sin falso PASS. |
| `BLOCKED BY INFRASTRUCTURE` | El contrato existe, pero falta entorno real. | No debe declararse E2E. |
| `FUTURE` | No forma parte del alcance operativo actual. | Solo puede documentarse como visión o RFC. |
| `PENDING` | Falta decisión, contrato o evidencia concreta. | No autoriza inferencia. |

---

# Respuestas al criterio de terminación

| Pregunta | Respuesta documental actual |
|---|---|
| ¿Qué es constitucional? | Identidad, autoridad humana, trazabilidad, estados epistemológicos, separación Recommendation–HumanReview–Decision, límites de expansión y escalabilidad como principio. |
| ¿Qué es canónico en el Core? | Project, Source, Evidence, Objective, Constraint, Requirement, Preference, Alternative, Evaluation, Comparison, Recommendation, HumanReview, Decision y Event, en el alcance documentado. |
| ¿Qué está expuesto por HTTP? | Project/snapshot, Preference, Recommendation, HumanReview, Decision, Council, métodos IO y contratos auxiliares según HTTP v0.3; no todo el Core. |
| ¿Qué está implementado? | Hay implementación local amplia en Core Python, SQLite, tRPC, Web, simulador y adaptador HTTP, con estados por componente. |
| ¿Qué está probado? | Hay pruebas Python, Vitest, compileall, smoke HTTP temporal, regresiones y simulador local según la evidencia registrada. |
| ¿Qué está probado E2E? | **Nada del flujo remoto poblado está certificado**; la matriz marca pendientes y bloqueos. |
| ¿Qué está bloqueado por contrato? | Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report en HTTP v0.3. |
| ¿Qué está postergado? | Forma técnica de Fact/Assumption, forma canónica de Decision Conditions, cambio de Audit/Report a entidades y capacidades avanzadas. |
| ¿Qué es futuro? | Estética operativa, AestheticProfile, agentes, BIM, Digital Twin, IoT, GIS operativo, Monte Carlo, optimización avanzada y agregación territorial/nacional avanzada. |
| ¿Qué requiere nueva decisión? | Cualquier cambio del Core Contract, nueva superficie HTTP, formalización canónica de Decision Conditions, entidades nuevas y cualquier ampliación de alcance 0.6. |

Cuando la evidencia no distingue entre implementación, exposición y E2E, el estado correcto es `PENDING` o `UNKNOWN / NO DEMOSTRADO`, no una inferencia optimista.

---

# Próximo paso documental recomendado

La siguiente acción no es implementar ni desplegar. Es revisar esta propuesta de arquitectura documental y decidir si el Product Owner autoriza una fase posterior para crear los documentos especializados o un `SICL_MASTER_SPEC_v2` completo. Hasta esa autorización, se mantienen vigentes el Master Spec v1 consolidado, la Acceptance Matrix, el State Audit, el paquete remoto y la resolución B-001.

**No se solicita ahora aprobar el Core Contract, HTTP v0.3, infraestructura ni capacidades futuras.**

---

## Referencias internas

1. [`SICL_MASTER_SPEC_v1.md`](SICL_MASTER_SPEC_v1.md) — Constitución maestra consolidada tras B-001.
2. [`SICL_CONSTITUTIONAL_REVIEW_0.6.md`](SICL_CONSTITUTIONAL_REVIEW_0.6.md) — Revisión y resolución documental de B-001.
3. [`SICL_STATE_AUDIT_v1.md`](SICL_STATE_AUDIT_v1.md) — Estado real frente al Master Spec.
4. [`SICL_0_6_ACCEPTANCE_MATRIX_v1.md`](SICL_0_6_ACCEPTANCE_MATRIX_v1.md) — Matriz ejecutable y bloqueos contractuales.
5. [`SICL_REMOTE_EXECUTION_PACKAGE_v1.md`](SICL_REMOTE_EXECUTION_PACKAGE_v1.md) — Paquete remoto preparado, no ejecutado.
6. [`SICL_READINESS_CHECK_v1.md`](SICL_READINESS_CHECK_v1.md) — Estado de preparación y resolución A-001.
7. [`SICL_A001_RESOLUTION.md`](SICL_A001_RESOLUTION.md) — Resolución de etiqueta `release-0.6`.
8. [`http_adapter/sicl_core_http.py`](../http_adapter/sicl_core_http.py) — Adaptador HTTP v0.3.
9. [`server/routers.ts`](../../sicl-web/server/routers.ts) — Frontera tRPC y fallback local explícito.

**Estado de esta revisión:** propuesta documental; no autoriza implementación. 
