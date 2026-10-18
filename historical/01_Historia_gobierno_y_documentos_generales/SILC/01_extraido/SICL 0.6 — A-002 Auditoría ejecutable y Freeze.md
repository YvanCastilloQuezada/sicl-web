# SICL 0.6 — A-002 Auditoría ejecutable y Freeze

**Estado final:** `A-002 COMPLETE — AWAITING PRODUCT OWNER`  
**Tipo:** auditoría documental y técnica de estado; no es implementación.  
**Fecha:** 24 de agosto de 2026  
**Autor:** Manus AI  
**Base de revisión:** `SICL_MASTER_SPEC_v1.md`, `SICL_CONSTITUTIONAL_REVIEW_0.6.md`, `SICL_STATE_AUDIT_v1.md`, `SICL_0_6_ACCEPTANCE_MATRIX_v1.md`, `SICL_REMOTE_EXECUTION_PACKAGE_v1.md`, `SICL_READINESS_CHECK_v1.md`, `SICL_A001_RESOLUTION.md`, Core Python, SQLite, HTTP v0.3, tRPC, Web, pruebas, simuladores y adaptadores.

> **Restricción aplicada:** durante A-002 no se modificaron entidades, invariantes, Core Contract, SQLite, HTTP v0.3, tRPC, frontend, simuladores ni infraestructura. No se escribieron tests nuevos, no se ejecutó Cloud Computer y no se declaró E2E remoto.

---

## 1. Regla de evidencia

Esta auditoría no completa huecos por inferencia. Los estados se mantienen separados:

| Estado | Significado operativo |
|---|---|
| `IN CORE` | Pertenece al contrato semántico canónico. |
| `EXPOSED` | Existe una superficie HTTP identificada. |
| `IMPLEMENTED` | Existe código local identificable. |
| `VERIFIED` | Existe prueba local o temporal con resultado registrado. |
| `E2E VERIFIED` | Existe prueba contra infraestructura remota objetivo. |
| `READ-ONLY` | Puede consultarse, pero no tiene escritura canónica autorizada. |
| `BLOCKED BY CONTRACT` | Pertenece al mapa de SICL, pero HTTP v0.3 no expone la operación necesaria. |
| `BLOCKED BY INFRASTRUCTURE` | El contrato existe, pero falta Cloud Computer, servicio, HTTPS o persistencia real. |
| `PENDING` | Falta una decisión, dependencia o evidencia. |
| `UNKNOWN / NOT DEMONSTRATED` | No existe evidencia suficiente para afirmar el estado. |
| `FUTURE` | Está fuera del alcance operativo de SICL 0.6. |

Nunca se transforma automáticamente `IN CORE` en `IMPLEMENTED`, `IMPLEMENTED` en `VERIFIED` ni `VERIFIED` en `E2E VERIFIED`.

---

# 2. Conclusión ejecutiva

SICL 0.6 existe hoy como un **Release Candidate local amplio y verificable**, con núcleo Python, persistencia SQLite local, adaptador HTTP v0.3, integración tRPC, Command Center, Preference, Recommendations, HumanReviews, Decisions, Council read-only, catálogo de Investigación de Operaciones y simulador Fase A. La autoridad humana está separada localmente: Recommendation no equivale a Decision, HumanReview registra la revisión y Decision exige autoridad explícita.

No existe evidencia de Cloud Computer adjunto, servicio Python remoto operativo, URL pública, HTTPS, `/data/sicl/` montado, persistencia tras reinicio remoto ni navegador poblado contra el Core remoto. Por tanto, SICL 0.6 no puede clasificarse como `E2E VERIFIED`.

Además, HTTP v0.3 no permite probar por una superficie canónica completa Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report. Estas capacidades no están fuera de SICL; están **BLOQUEADAS POR CONTRATO** para el E2E remoto actual.

| Dimensión | Estado real |
|---|---|
| Constitución B-001 | Consolidada documentalmente; alcance aprobado con cambios. |
| Core Python | Implementado y probado localmente en el alcance auditado. |
| HTTP v0.3 | Implementado localmente y parcialmente expuesto. |
| Web/tRPC | Implementado localmente con fallback explícito. |
| Pruebas locales | Suite Python, Vitest, compileall, smoke HTTP y simulador registrados como aprobados en la evidencia existente. |
| Infraestructura remota | No disponible en esta sesión. |
| E2E remoto | No ejecutado. |
| Release final 0.6 | No aprobado todavía; requiere decisión del Product Owner y gates técnicos. |

---

# 3. Matriz maestra única de verdad

En esta matriz, “forma parte de 0.6” distingue pertenencia constitucional/semántica de disponibilidad operacional. `Sí — bloqueado por contrato` significa que el elemento pertenece al mapa de SICL, pero no puede probarse por HTTP v0.3 sin una decisión contractual posterior.

| ID | Nombre | Definición | Estado constitucional | Estado Core | Estado HTTP | Estado Web | Estado implementación | Estado pruebas | Estado E2E | Evidencia | Documento fuente | Dependencia | Bloqueo | Acción necesaria | ¿Forma parte de 0.6? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ENT-001 | Project | Agregado raíz del proyecto y contexto. | APPROVED | IN CORE | EXPOSED: create/snapshot | IMPLEMENTED | IMPLEMENTED | VERIFIED local | PENDING infraestructura | Smoke HTTP y snapshot temporal | Core/HTTP/Acceptance | Servicio remoto y persistencia | BLOCKED BY INFRASTRUCTURE | Ejecutar contra Core remoto y reinicio | Sí |
| ENT-002 | Source | Fuente identificable de procedencia. | APPROVED | IN CORE | No endpoint específico demostrado | Parcial | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | Modelo, snapshot y auditoría local | State Audit/Acceptance | Mapping HTTP canónico | BLOCKED BY CONTRACT | Definir endpoint solo mediante RFC/decisión | Sí |
| ENT-003 | Evidence | Evidencia trazable que soporta afirmaciones. | APPROVED | IN CORE | Sin escritura/lectura HTTP canónica identificada | Parcial | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | Modelo, snapshot y pruebas locales | Acceptance/State Audit | Mapping HTTP | BLOCKED BY CONTRACT | No inventar endpoint; decidir contrato | Sí — bloqueado por contrato |
| ENT-004 | Fact | Estado o rol epistemológico de evidencia verificable. | APPROVED como distinto de Assumption | Sin entidad separada en 0.6 | No endpoint | No módulo propio | Representable por evidencia/procedencia | Indirecto | BLOCKED BY CONTRACT | Decisión B-001 y auditoría ontológica | Constitutional Review | Forma técnica futura | PENDING/RFC | No crear entidad en 0.6 | Sí como concepto |
| ENT-005 | Assumption | Supuesto no equivalente a hecho. | APPROVED; no promoción automática | Sin entidad separada en 0.6 | No endpoint | No módulo propio | Representable por evidencia/procedencia | Indirecto | BLOCKED BY CONTRACT | Decisión B-001 y auditoría ontológica | Constitutional Review | Forma técnica futura | PENDING/RFC | No crear entidad en 0.6 | Sí como concepto |
| ENT-006 | Objective | Objetivo con dirección explícita. | APPROVED | IN CORE | Sin endpoint HTTP identificado | IMPLEMENTED local | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | Dirección obligatoria y regresiones | Acceptance/State Audit | Mapping HTTP | BLOCKED BY CONTRACT | Decidir exposición antes de E2E | Sí — bloqueado por contrato |
| ENT-007 | Constraint | Restricción evaluable del proyecto. | APPROVED | IN CORE | Sin endpoint HTTP identificado | IMPLEMENTED local | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | Modelo, UI y pruebas locales | State Audit | Mapping HTTP | BLOCKED BY CONTRACT | Decidir exposición antes de E2E | Sí — bloqueado por contrato |
| ENT-008 | Requirement | Requisito del proyecto. | APPROVED | IN CORE | Sin endpoint HTTP identificado | IMPLEMENTED local | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | Modelo, UI y pruebas locales | State Audit | Mapping HTTP | BLOCKED BY CONTRACT | Decidir exposición antes de E2E | Sí — bloqueado por contrato |
| ENT-009 | Preference | Preferencia versionada, revisable y trazable. | APPROVED | IN CORE | EXPOSED: POST + snapshot | IMPLEMENTED | IMPLEMENTED | VERIFIED local/HTTP temporal | PENDING infraestructura | `PREFERENCE_RECORDED`, SQLite round-trip, HTTP auth | State Audit/Acceptance | Cloud Computer, URL, persistencia externa | BLOCKED BY INFRASTRUCTURE | Ejecutar persistencia y reinicio remoto | Sí |
| ENT-010 | Alternative | Alternativa del proyecto. | APPROVED | IN CORE | Sin endpoint HTTP identificado | IMPLEMENTED local | IMPLEMENTED | VERIFIED local/simulador | BLOCKED BY CONTRACT | UPAO/simulador y UI local | Acceptance/State Audit | Mapping HTTP | BLOCKED BY CONTRACT | Decidir contrato antes de E2E | Sí — bloqueado por contrato |
| ENT-011 | Evaluation | Evaluación de alternativa y criterio. | APPROVED | IN CORE | Sin endpoint HTTP identificado | IMPLEMENTED local | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | método, inputs, unidad, provenance y regresiones | Acceptance/State Audit | Mapping HTTP | BLOCKED BY CONTRACT | Decidir contrato antes de E2E | Sí — bloqueado por contrato |
| ENT-012 | Comparison | Comparación con dirección y factibilidad. | APPROVED | IN CORE | Sin endpoint HTTP identificado | Council read-only indirecto | IMPLEMENTED | VERIFIED local | BLOCKED BY CONTRACT | dirección obligatoria, estados y Council | Acceptance/State Audit | Mapping HTTP | BLOCKED BY CONTRACT | Decidir contrato antes de E2E | Sí — bloqueado por contrato |
| ENT-013 | Recommendation | Salida analítica trazable, no decisión. | APPROVED | IN CORE | EXPOSED: POST + Council | IMPLEMENTED | IMPLEMENTED | VERIFIED local | PENDING infraestructura | Regresiones Recommendation ≠ Decision | Acceptance/State Audit | Servicio remoto | BLOCKED BY INFRASTRUCTURE | Ejecutar con snapshot remoto poblado | Sí |
| ENT-014 | HumanReview | Registro de revisión humana identificable. | APPROVED | IN CORE | EXPOSED: POST | IMPLEMENTED/Audit | IMPLEMENTED | VERIFIED local | PENDING infraestructura | actor, confirmation, authority basis | Acceptance/State Audit | Servicio remoto | BLOCKED BY INFRASTRUCTURE | Ejecutar después de Recommendation | Sí |
| ENT-015 | Decision | Registro de decisión con autoridad humana. | APPROVED | IN CORE | EXPOSED: POST | Prepare/register | IMPLEMENTED | VERIFIED local | PENDING infraestructura | Rechazo sin autoridad y aceptación explícita | Acceptance/State Audit | HumanReview y servicio remoto | BLOCKED BY INFRASTRUCTURE | Ejecutar prueba de autoridad | Sí |
| ENT-016 | Event | Registro append-only a nivel de aplicación. | APPROVED | IN CORE | Indirecto vía snapshot/audit | Audit view | IMPLEMENTED local | VERIFIED local | PENDING persistencia | Replay, segundo guardado, comparación de eventos | Acceptance/State Audit | Almacenamiento externo | BLOCKED BY INFRASTRUCTURE | Reinicio y verificación de inmutabilidad | Sí |
| ENT-017 | Audit | Proyección derivada de Events, HumanReviews y Decisions. | APPROVED como proyección | Derivado; no entidad | Read-only indirecto | READ-ONLY | IMPLEMENTED projection | VERIFIED local | PENDING infraestructura | Snapshot/auditoría filtrada | Constitutional Review/Acceptance | Servicio remoto | BLOCKED BY INFRASTRUCTURE | Verificar orden y no mutación remotamente | Sí |
| ENT-018 | Report | Exportación/artefacto derivado y versionado. | APPROVED como artefacto | No entidad persistente | Sin endpoint dedicado | Export local | IMPLEMENTED export | VERIFIED local | BLOCKED BY CONTRACT | Export seguro local | Constitutional Review/Acceptance | Formato HTTP futuro | BLOCKED BY CONTRACT | No crear `/reports` en 0.6 | Sí como artefacto |
| ENT-019 | Council | Vista read-only de resultados analíticos. | APPROVED como proyección | Derivado/read-only | EXPOSED read-only | READ-ONLY | IMPLEMENTED | VERIFIED local/HTTP temporal | PENDING infraestructura | Council y comparaciones | State Audit/Acceptance | Servicio remoto | BLOCKED BY INFRASTRUCTURE | Ejecutar lectura poblada | Sí |
| ENT-020 | Decision Conditions | Condiciones declarativas explicativas. | APPROVED read-only | Forma canónica postergada | Sin escritura | READ-ONLY | Declarativo local | VERIFIED local | BLOCKED BY CONTRACT | Contrato TS, UI y pruebas | Constitutional Review/State Audit | RFC y modelo canónico futuro | BLOCKED BY CONTRACT | Mantener solo lectura | Sí — read-only |
| ENT-021 | IO methods | Catálogo de métodos de Investigación de Operaciones. | APPROVED como capa analítica | Catálogo definido | EXPOSED read-only | Parcial | IMPLEMENTED | VERIFIED local/HTTP temporal | PENDING infraestructura | Endpoint de métodos y regresiones | State Audit/Acceptance | Servicio remoto | BLOCKED BY INFRASTRUCTURE | Verificar contra servicio real | Sí — read-only |
| CAP-001 | SICL 1 | Escala de proyecto/edificio. | APPROVED como principio | Scope mínimo | Parcial | Representado | Parcialmente implementado | VERIFIED local | PENDING infraestructura | `spatial_scope` y fixtures | Master/State Audit | Servicio remoto y caso poblado | BLOCKED BY INFRASTRUCTURE | Verificar proyecto real | Sí, alcance mínimo |
| CAP-002 | SICL 2 | Escala ciudad/territorio. | APPROVED como principio | Scope mínimo preparado | No operación territorial completa | No GIS operativo | PREPARED | Parcial | FUTURE/PENDING contract | Documentación y scopes | Master/State Audit | GIS y contrato territorial | FUTURE/BLOCKED | Requiere RFC posterior | No como operación 0.6 |
| CAP-003 | SICL 3 | Escala nacional/escenarios. | APPROVED como principio | Scope temporal mínimo | No operación nacional completa | No escenario productivo | PREPARED | Parcial | FUTURE/PENDING contract | Documentación y `temporal_scope` | Master/State Audit | Contrato y validación institucional | FUTURE/BLOCKED | Requiere RFC posterior | No como operación 0.6 |
| CAP-004 | Infraestructura remota | Cloud Computer, HTTPS, persistencia y URL. | Operacional, no constitucional | No aplica | Dependencia operacional | No aplica | PREPARED en runbook | No E2E | BLOCKED BY INFRASTRUCTURE | Runbook y readiness | Remote Package/Readiness | Máquina, dominio, credenciales | BLOCKED BY INFRASTRUCTURE | Inspección real Paso 0 | No es capacidad semántica |
| CAP-005 | Estética/AestheticProfile | Preferencias estéticas contextualizadas. | FUTURE/RFC | OUT OF CORE 0.6 | No | No | No implementada | No | FUTURE | RFC-011 | Master/Constitutional Review | Nueva decisión y contrato | FUTURE | No implementar | No |
| CAP-006 | Agentes/BIM/GIS/Digital Twin/IoT | Capacidades expansivas. | FUTURE/OUT OF SCOPE | OUT OF CORE 0.6 | No | No | No implementadas | No | FUTURE | Límites constitucionales | Master/Review | RFCs futuros | FUTURE | No implementar | No |

---

# 4. Diferencias y discrepancias clasificadas

| Categoría | Elementos | Diagnóstico |
|---|---|---|
| A. Especificado pero no implementado | Forma técnica detallada Fact/Assumption; forma canónica de Decision Conditions; operación completa SICL 2–3; Report HTTP dedicado. | Correctamente postergado o fuera de 0.6; no debe inferirse desde la Constitución. |
| B. Implementado pero no especificado con precisión suficiente | Detalles de normalización Web/tRPC, algunos campos de UI y comportamiento de fallback local. | Deben registrarse en Implementation Status, no elevarse automáticamente al Core Contract. |
| C. Especificado y parcialmente implementado | Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison en el flujo local pero sin superficie HTTP canónica completa. | Pertenecen al mapa 0.6, pero están bloqueados para E2E por contrato. |
| D. Implementado y verificado localmente | Project, Preference, Recommendation, HumanReview, Decision, Event, Council, catálogo IO y simulador Fase A, según cada componente. | `VERIFIED` local no implica `E2E VERIFIED`. |
| E. Expuesto por HTTP | Project/snapshot, Preference, Recommendation, HumanReview, Decision, Council, métodos IO y endpoints auxiliares del adaptador. | La exposición es parcial; no equivale al Core completo. |
| F. Bloqueado por HTTP | Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report. | `BLOCKED BY CONTRACT`, no `FUTURE` ni fuera de SICL. |
| G. Preparado sin infraestructura E2E | Dockerfile, etiqueta `sicl-core-http:release-0.6`, systemd/runbook, persistencia prevista, UFW, HTTPS, `SICL_CORE_URL`. | `PREPARED`; Cloud Computer, dominio, URL y reinicio siguen sin evidencia. |
| H. Fuera del alcance 0.6 | AestheticProfile, estética operativa, agentes, BIM, Digital Twin, IoT, GIS operativo, Monte Carlo, optimización avanzada, agregación territorial/nacional avanzada y nuevas entidades no aprobadas. | `FUTURE/OUT OF SCOPE`; no implementar durante 0.6. |

## 4.1 Inconsistencias documentales que deben conservarse como hallazgos

| ID | Problema | Severidad | Tratamiento en A-002 |
|---|---|---|---|
| DISC-001 | El Master Spec sigue siendo un documento híbrido con Constitución, contrato, implementación, pruebas y roadmap. | Media | No reescribir; registrar para una fase documental posterior. |
| DISC-002 | “Implementado” puede referirse a Core, Web, HTTP o local. | Alta | Usar estados de la matriz maestra. |
| DISC-003 | El flujo Evidence→Decision no está íntegramente expuesto por HTTP v0.3. | Alta | Mantener bloqueos contractuales explícitos. |
| DISC-004 | Audit/Report aparecen en algunos inventarios cerca de entidades canónicas. | Media | Mantener su clasificación B-001 como derivados. |
| DISC-005 | La Acceptance Matrix documenta un checkout objetivo verificable, pero el directorio de trabajo contiene artefactos posteriores no rastreados. | Media | El despliegue futuro debe usar checkout limpio; no limpiar ahora. |
| DISC-006 | E2E, persistencia externa, HTTPS y URL real se describen como preparados, pero no están ejecutados. | Alta | Mantener `BLOCKED BY INFRASTRUCTURE`. |
| DISC-007 | SICL 1–3 mezclan principio de escalabilidad con capacidades operativas futuras. | Media | Separar principio aprobado de operación no demostrada. |
| DISC-008 | RFC no equivale a decisión del Product Owner. | Media | Añadir autoridad y estado en un RFC Index futuro. |

---

# 5. Propuesta de `SICL_0_6_FREEZE`

## 5.1 Definitivamente dentro del freeze 0.6

Quedan dentro del freeze constitucional y operativo inicial: Project y su contexto; Source, Evidence, Objective, Constraint, Requirement, Preference, Alternative, Evaluation, Comparison, Recommendation, HumanReview, Decision y Event como mapa canónico; trazabilidad y procedencia; versionado y control de concurrencia existente; separación Recommendation ≠ Decision; autoridad humana obligatoria para Decision; Audit como proyección; Report como exportación/artefacto derivado; Council y Decision Conditions en modo read-only; catálogo IO read-only; scopes mínimos SICL 1 y horizonte temporal sin prometer operaciones territoriales o nacionales completas; y fallback local solo cuando esté explícitamente autorizado para desarrollo.

## 5.2 Implementado y verificable dentro del freeze

El estado permitido para declarar antes de infraestructura es `IMPLEMENTED/VERIFIED LOCAL`: Core Python, SQLite temporal, Preference y `PREFERENCE_RECORDED`, evaluaciones y comparaciones locales, Recommendations, HumanReviews, Decisions, eventos a nivel de aplicación, adaptador HTTP v0.3 en pruebas temporales, tRPC, Command Center, catálogo IO y simulador Fase A. Cada afirmación debe conservar su alcance local.

## 5.3 Falta para cerrar 0.6

Falta obtener la clasificación formal del Product Owner sobre esta especificación ejecutable, resolver qué significa “release” para el flujo remoto sin ampliar el contrato, y ejecutar los gates de infraestructura y E2E. Falta también decidir, antes de cualquier ampliación, si las capacidades bloqueadas por HTTP forman parte de un E2E futuro obligatorio o de una fase posterior de contrato.

## 5.4 Bloqueado por contrato

Permanecen bloqueados en HTTP v0.3 Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison y Report. No se crean endpoints por esta auditoría.

## 5.5 Bloqueado por infraestructura

Permanecen bloqueados por infraestructura Cloud Computer, servicio remoto, `/data/sicl/`, Docker runtime, systemd runtime, UFW, dominio, HTTPS, `SICL_CORE_URL`, persistencia externa, reinicio y navegador poblado contra el Core remoto.

## 5.6 No debe tocarse durante 0.6

No deben tocarse el Core Contract, invariantes, nuevas entidades Fact/Assumption, entidades Audit/Report, escritura de Decision Conditions, nuevos endpoints HTTP, estética operativa, agentes, BIM, GIS operativo, Digital Twin, IoT, Monte Carlo, optimización avanzada ni agregación territorial/nacional avanzada sin RFC y autorización explícita.

---

# 6. Backlog técnico priorizado

| ID | Prioridad | Descripción | Motivo | Componente | Dependencia | Criterio de aceptación | Evidencia requerida | Riesgo |
|---|---|---|---|---|---|---|---|---|
| BL-001 | P0 | Obtener clasificación del Product Owner para A-002 y freeze. | Sin alcance aprobado no debe declararse release. | Gobernanza documental | Respuesta del Product Owner | Decisión registrada como aprobada, cambiada, postergada o rechazada. | Decision Register y respuesta fechada. | Avance por silencio. |
| BL-002 | P0 | Mantener checkout limpio del commit autorizado `2ef49aba2136` para despliegue. | Reproducibilidad y control de cambios. | Release/deploy | Acceso a máquina real | `git status` limpio y commit verificado en Cloud Computer. | Salida de comandos y hash. | Desplegar artefactos posteriores accidentalmente. |
| BL-003 | P0 | Ejecutar Paso 0 de inspección de infraestructura real. | No se puede asumir Docker, memoria, almacenamiento o acceso. | Cloud Computer | Máquina adjunta | Inventario de OS, recursos, Docker, puertos, disco y acceso registrado. | Log de inspección firmado por sesión. | Configuración incompatible. |
| BL-004 | P0 | Construir y ejecutar `sicl-core-http:release-0.6`. | Servicio real requerido para cierre. | Docker/systemd | BL-002, BL-003 | Imagen construida desde checkout exacto; health responde. | Digest/ID, logs y `/health`. | Etiqueta o checkout incorrectos. |
| BL-005 | P0 | Configurar persistencia externa y verificar reinicio. | Event log y snapshots deben sobrevivir reinicio. | `/data/sicl/`, systemd | BL-004 | Datos y eventos idénticos antes/después de reinicio. | Snapshots comparados y listado de montaje. | Pérdida o mutación de datos. |
| BL-006 | P1 | Configurar dominio, HTTPS y `SICL_CORE_URL` server-side. | Integración web real segura. | Reverse proxy/WebDev secrets | BL-004, dominio real | HTTPS válido; token nunca llega al navegador; router usa URL real. | Certificado, request logs seguros y prueba de secreto. | Exposición de secretos o URL incorrecta. |
| BL-007 | P1 | Ejecutar E2E de Project, Preference, Recommendation, HumanReview, Decision, Audit y Council. | Certificación operacional del alcance expuesto. | Acceptance/E2E | BL-005, BL-006 | Todas las filas expuestas pasan y se conservan invariantes de autoridad. | Evidencia por fila y snapshot final. | Falso PASS por fallback local. |
| BL-008 | P1 | Ejecutar verificación visual poblada en navegador. | Confirmar que UI representa Core remoto, no fallback. | Web/Browser | BL-006, BL-007 | Escritorio y móvil muestran datos canónicos sin secretos ni autoridad automática. | Capturas, logs de red y sesión. | Confundir preview vacío con E2E. |
| BL-009 | P1 | Verificar errores 401/404/409/422 contra servicio real. | Confirmar preservación de contrato en integración. | HTTP/tRPC | BL-006 | Código, envelope y detalle seguro se preservan; no hay mutación parcial. | Requests/responses redacted. | Traducir o ocultar errores. |
| BL-010 | P1 | Confirmar que el fallback local no se presenta como Remote Core. | Límite constitucional y operativo. | tRPC/UI | BL-006 | Producción sin URL falla cerrado; fallback solo con flag local. | Configuración y prueba de estados. | Mezcla de fuentes de verdad. |
| BL-011 | P2 | Diseñar RFC HTTP para capacidades bloqueadas. | Solo si el Product Owner exige E2E completo Evidence→Decision. | Core/HTTP | BL-001 | RFC define mapping, autoridad, versionado, eventos, errores y migración. | RFC aprobado. | Ampliar contrato sin gobernanza. |
| BL-012 | FUTURE | Definir AestheticProfile, agentes, GIS/BIM, simulación avanzada y nuevas entidades. | Visión posterior, no 0.6. | RFC futuro | Decisión de alcance futura | Solo iniciar tras RFC y autorización independiente. | RFC y decisión. | Diluir el freeze. |

---

# 7. Tests faltantes identificados

No se escriben tests en A-002. Se identifican los siguientes criterios para una fase posterior.

## 7.1 Necesarios para `VERIFIED` local o de integración

| ID | Test | PASS | FAIL | Evidencia |
|---|---|---|---|---|
| TST-001 | Contrato de cada endpoint expuesto | Request válido devuelve envelope y versión esperada. | Campo perdido, versión incorrecta o transformación silenciosa. | Request/response redacted. |
| TST-002 | Preference idempotente y versionada | `PREFERENCE_RECORDED`, incremento correcto, conflicto sin evento parcial. | Duplicación, pérdida de payload o mutación previa. | Snapshot, eventos y códigos. |
| TST-003 | Recommendation no crea Decision | Snapshot posterior contiene Recommendation sin Decision nueva. | Decision aparece automáticamente. | Snapshot antes/después. |
| TST-004 | Decision requiere autoridad | Sin autoridad falla; con actor, base y confirmación válidos pasa. | Se acepta sin autoridad o falta trazabilidad. | 401/422 y evento separado. |
| TST-005 | Audit append-only | Segundo guardado conserva byte a byte los eventos anteriores. | Evento anterior se edita, elimina o reordena indebidamente. | Comparación de snapshots/eventos. |
| TST-006 | Fallback explícito | Sin URL en producción falla cerrado; con flag local funciona solo en desarrollo. | Fallback silencioso o etiqueta Remote Core falsa. | Configuración y logs sin secretos. |
| TST-007 | Decision Conditions read-only | Lectura funciona; no existe mutación canónica. | UI o router permiten escritura no contractual. | Contrato y prueba de ausencia. |
| TST-008 | Bloqueos HTTP | Entidades sin endpoint no generan rutas inventadas ni falso PASS. | Se afirma cobertura HTTP inexistente. | Acceptance Matrix actualizada. |

## 7.2 Necesarios para `E2E VERIFIED`

| ID | Test E2E | PASS | FAIL | Dependencia |
|---|---|---|---|---|
| E2E-001 | Health/contract remoto | `/health` y `/v1/contract` responden desde URL real con versión esperada. | Servicio ausente, versión diferente o secreto expuesto. | BL-004, BL-006 |
| E2E-002 | Persistencia de Project y Preference | Crear, recuperar, reiniciar y recuperar nuevamente produce datos idénticos. | Pérdida o divergencia tras reinicio. | BL-005 |
| E2E-003 | Flujo humano completo expuesto | Recommendation → HumanReview → Decision conserva separación y autoridad. | Recommendation crea Decision o Decision sin autoridad. | BL-007 |
| E2E-004 | Audit/Council remoto | Proyecciones muestran los mismos datos seguros del snapshot. | Diferencias, secretos o mutación. | BL-007 |
| E2E-005 | Errores contractuales | 401/404/409/422 se conservan correctamente en Web/tRPC. | Código/envelope perdido o mutación parcial. | BL-009 |
| E2E-006 | Navegador poblado | La UI muestra datos del Core remoto y no fallback local. | UI vacía, fallback silencioso o token visible. | BL-008, BL-010 |
| E2E-007 | Seguridad del navegador | Cero tokens, secretos o variables server-side en payload, consola o bundle. | Aparece cualquier secreto. | BL-006, BL-008 |

Las capacidades `BLOCKED BY CONTRACT` no pueden recibir un resultado E2E PASS hasta que exista una superficie contractual aprobada. El test correcto hoy es comprobar y documentar el bloqueo, no inventar una ruta.

---

# 8. Release Gate

## Gate 0 — READY DOCUMENTAL

| Criterio | Estado actual | PASS requerido |
|---|---|---|
| B-001 consolidado | Sí | Registro de decisión disponible. |
| A-001 resuelto localmente | Sí | `release-0.6` alineado en artefactos operativos. |
| Freeze propuesto | Sí, en este documento | Product Owner debe clasificarlo. |
| Matriz maestra | Sí, en este documento | Sin estados inferidos. |
| Código/contrato congelados durante A-002 | Sí | Sin cambios técnicos en esta fase. |

**Resultado actual:** `READY DOCUMENTAL — AWAITING PRODUCT OWNER`.

## Gate 1 — RELEASE CANDIDATE LOCAL

Requiere: clasificación del Product Owner; checkout reproducible; suite Python; suite web; compileall; smoke HTTP temporal; simulador; `git diff --check`; revisión de secretos; Dockerfile y runbook estáticamente coherentes; y evidencia de que el fallback está explícitamente aislado.

**Resultado actual:** preparado localmente según la evidencia existente, pero no debe interpretarse como release remoto ni como E2E.

## Gate 2 — RELEASE CANDIDATE OPERACIONAL

Requiere Cloud Computer real, Paso 0 de inspección, checkout limpio, imagen `sicl-core-http:release-0.6`, systemd, `/data/sicl/`, UFW, HTTPS, dominio real, `SICL_CORE_URL`, token server-side y health/contract remoto.

**Resultado actual:** `BLOCKED BY INFRASTRUCTURE`.

## Gate 3 — E2E VERIFIED

Requiere todos los tests E2E-001 a E2E-007 aplicables, evidencia redacted, persistencia después de reinicio, navegador poblado y confirmación explícita de que no se utilizó fallback local. Las filas bloqueadas por contrato se mantienen fuera del conjunto certificable hasta una decisión contractual posterior.

**Resultado actual:** `NOT EXECUTED`.

---

# 9. Decisiones que requieren autorización del Product Owner

1. **¿Aprueba este documento como especificación ejecutable única de SICL 0.6 y aprueba el `SICL_0_6_FREEZE` propuesto?** Responder: `SÍ` o `NO`.

2. **¿Aprueba declarar como dentro del mapa semántico de 0.6, pero `BLOCKED BY CONTRACT`, Evidence, Objective, Constraint/Requirement, Alternative, Evaluation y Comparison mientras no exista HTTP canónico?** Responder: `SÍ` o `NO`.

3. **¿Aprueba mantener Report sin endpoint y como artefacto/exportación derivado en 0.6?** Responder: `SÍ` o `NO`.

4. **¿Aprueba mantener Decision Conditions exclusivamente read-only y sin endpoint de escritura en 0.6?** Responder: `SÍ` o `NO`.

5. **¿Autoriza comenzar únicamente el despliegue remoto del alcance ya expuesto, cuando exista Cloud Computer, sin ampliar el contrato?** Responder: `SÍ` o `NO`.

6. **¿Aprueba que el estado remoto solo pueda declararse `E2E VERIFIED` después de superar el Release Gate y los tests E2E aplicables?** Responder: `SÍ` o `NO`.

7. **¿Aprueba mantener estética, AestheticProfile, agentes, BIM, GIS operativo, Digital Twin, IoT, Monte Carlo, optimización avanzada, agregación territorial/nacional y nuevas entidades fuera de 0.6?** Responder: `SÍ` o `NO`.

8. **¿Autoriza una futura fase documental para diseñar un RFC HTTP de las capacidades bloqueadas, sin implementarlo ahora?** Responder: `SÍ` o `NO`.

> El Product Owner debe responder explícitamente. El silencio no se considera aprobación.

---

# 10. Estado final A-002

`A-002 COMPLETE — AWAITING PRODUCT OWNER`

La auditoría ejecutable, la matriz maestra, las discrepancias, el freeze, el backlog, los tests faltantes, el Release Gate y las decisiones pendientes están documentados. A-002 no implementa, no despliega, no crea una nueva arquitectura documental completa, no reescribe `SICL_MASTER_SPEC_v2` y no cierra las brechas HTTP.

**Próxima acción:** esperar la respuesta cerrada del Product Owner a la sección 9. Hasta entonces, no implementar ni desplegar.

---

## Referencias internas

1. [`SICL_MASTER_SPEC_v1.md`](SICL_MASTER_SPEC_v1.md)
2. [`SICL_CONSTITUTIONAL_REVIEW_0.6.md`](SICL_CONSTITUTIONAL_REVIEW_0.6.md)
3. [`SICL_STATE_AUDIT_v1.md`](SICL_STATE_AUDIT_v1.md)
4. [`SICL_0_6_ACCEPTANCE_MATRIX_v1.md`](SICL_0_6_ACCEPTANCE_MATRIX_v1.md)
5. [`SICL_REMOTE_EXECUTION_PACKAGE_v1.md`](SICL_REMOTE_EXECUTION_PACKAGE_v1.md)
6. [`SICL_READINESS_CHECK_v1.md`](SICL_READINESS_CHECK_v1.md)
7. [`SICL_A001_RESOLUTION.md`](SICL_A001_RESOLUTION.md)
8. [`http_adapter/sicl_core_http.py`](../http_adapter/sicl_core_http.py)
9. [`server/routers.ts`](../../sicl-web/server/routers.ts)

**No es una autorización de implementación.**
