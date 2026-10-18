# SICL_STATE_AUDIT_v1
## Auditoría técnica del estado real contra SICL_MASTER_SPEC_v1 revisado

**Fecha de auditoría:** 24 de agosto de 2026  
**Objeto:** determinar exactamente qué existe en código y qué sigue siendo local, preparado, read-only, propuesto o bloqueado.  
**Regla:** esta auditoría describe el estado; no modifica el Core Contract, no corrige discrepancias y no interpreta el silencio como aprobación.

> **Conclusión ejecutiva:** SICL dispone de un Release Candidate local amplio y verificable, con Core Python, adaptador HTTP, integración tRPC, Command Center, Preference, Recommendation–HumanReview–Decision, Council read-only y simulador Fase A. No existe evidencia de despliegue remoto, persistencia externa, HTTPS, `SICL_CORE_URL` operativo ni E2E poblado contra un Cloud Computer.

---

## A. Resumen ejecutivo

La auditoría confirma que la semántica crítica de SICL está representada en código y cubierta por pruebas locales. La suite Python completa pasó, la suite web pasó con 64 pruebas, `compileall` pasó y `git diff --check` pasó. Esto prueba reproducibilidad y coherencia local; no prueba disponibilidad remota ni aceptación operativa del MVP.

El hallazgo más importante es la diferencia entre el **Core Contract canónico** y las entidades nombradas en la visión histórica. El Core Contract Python contiene entidades de primera clase para Project, Requirement, Objective, Constraint, Preference, Alternative, Source, Evidence, Evaluation, Comparison, Recommendation, Decision y Event. HumanReview existe en el módulo de revisión. `Audit` y `Report` no aparecen como entidades canónicas equivalentes en el modelo principal: auditoría es una proyección de eventos/revisiones/decisiones y Report es una salida o exportación, no una entidad persistente demostrada.

La autoridad humana se mantiene correctamente en la implementación local: Council observa, Recommendation describe, HumanReview registra revisión y Decision exige autoridad. El riesgo restante no es una violación local demostrada, sino la falta de verificación contra el servicio remoto y la necesidad de no confundir el fallback local con la operación canónica.

### Clasificación global

| Estado | Elementos confirmados |
|---|---|
| **Implementado y probado localmente** | Entidades nucleares, Preference, evaluación/comparación, Recommendation–HumanReview–Decision, eventos de aplicación, SQLite temporal, HTTP v0.3, tRPC, Council read-only, simulador Fase A. |
| **Implementado localmente, sin E2E remoto** | Delegación tRPC→Python, persistencia completa tras reinicio, errores contra instancia remota y navegador poblado con Core canónico. |
| **Read-only** | Council, métodos de Investigación de Operaciones, Decision Conditions en web y vistas de auditoría. |
| **Preparado, no verificado remotamente** | Dockerfile, runbook, `/data/sicl/`, UFW, systemd, HTTPS, `SICL_CORE_URL`. |
| **Propuesto** | RFC-011 de estética, AestheticProfile, agregación avanzada, GIS/BIM operativo, capacidades de escala superior. |
| **Bloqueado** | Cloud Computer, URL real, persistencia externa, E2E poblado y aceptación final. |
| **Fuera de alcance de 0.6** | Agentes autónomos, Digital Twin, IoT, belleza universal, Monte Carlo y nuevas entidades no aprobadas. |

---

## B. Matriz Master Spec → implementación real

| Área del Master Spec | Estado real | Evidencia | Límite o discrepancia |
|---|---|---|---|
| Visión de flujo Evidence→Decision | Implementada localmente | Core Contract, servicios, UI, pruebas integradas | No equivale a operación remota. |
| Autoridad humana | Implementada y probada localmente | `Decision`, `HumanReview`, router y pruebas | Falta probar el flujo poblado contra Core remoto. |
| Trazabilidad | Implementada localmente | Event, snapshot, safe audit, manifiesto | Persistencia fuera del contenedor no verificada. |
| Preference | Implementada y probada localmente | `core_contract/model.py`, SQLite, review, HTTP v0.3, pruebas | E2E remoto pendiente. |
| Evaluación/comparación | Implementada y probada localmente | Modelos, catálogo IO, UI y pruebas | No se verificó navegador poblado remoto. |
| Recommendation≠Decision | Implementada y probada localmente | Servicios, router, UI y regresiones | No hay evidencia remota. |
| Decision Conditions | Read-only local | Contrato TS, UI y pruebas tRPC | No existe endpoint canónico de escritura demostrado. |
| HTTP v0.3 | Implementado localmente | `http_adapter/sicl_core_http.py`, smoke test | URL pública y HTTPS pendientes. |
| Seguridad server-to-server | Preparada y probada en local | bearer, variables server-side, pruebas 401 | No se verificó gestión de secretos en infraestructura real. |
| Fallback local | Explícito | `SICL_ALLOW_LOCAL_CORE`, router y pruebas | No debe considerarse operación de producción. |
| SICL 1 | Parcialmente representado y probado | `spatial_scope`, UI y fixtures | E2E poblado pendiente. |
| SICL 2 | Contrato mínimo preparado | scopes y documentación | GIS, agregación y datos territoriales no implementados como capacidad operativa. |
| SICL 3 | Contrato mínimo preparado | `temporal_scope` y documentación | Escenarios nacionales y validación institucional pendientes. |
| Simulador Fase A | Implementado y probado | `src/sicl/simulator.py`, fixtures y evidencia | Es harness externo; no es autoridad ni motor productivo. |
| Estética | Propuesta RFC-011 | Master Spec y documentación | No implementada deliberadamente. |

---

## C. Estado de cada entidad

**Leyenda de columnas:** Modelo = clase canónica; SQLite = persistencia; CoreProject = integración en agregado; Snapshot = salida; HTTP/API = exposición; Frontend = representación; Pruebas = tests; Evidencia = ejecución comprobada.

| Entidad | Modelo | SQLite | CoreProject | Snapshot | HTTP/API | Frontend | Pruebas | Evidencia de ejecución | Estado final |
|---|---|---|---|---|---|---|---|---|---|
| **Project** | Sí | Sí | Sí | Sí | POST y lecturas | Sí | Sí | Sí, local | Implementada/probada localmente |
| **Source** | Sí | Sí | Sí | Sí | Indirecta en contrato/snapshot | Parcial | Sí | Sí, local | Implementada localmente |
| **Evidence** | Sí | Sí | Sí | Sí | Indirecta en contrato/snapshot | Parcial | Sí | Sí, local | Implementada localmente |
| **Fact** | No como entidad separada demostrada | No separada | No separada | Representable vía evidencia/procedencia | No endpoint específico demostrado | No módulo específico | Cobertura indirecta | No como entidad independiente | Concepto representado, no entidad canónica separada |
| **Assumption** | No como entidad separada demostrada | No separada | No separada | Representable vía evidencia/procedencia | No endpoint específico demostrado | No módulo específico | Cobertura indirecta | No como entidad independiente | Concepto representado, no entidad canónica separada |
| **Requirement** | Sí | Sí | Sí | Sí | Indirecta en snapshot | Sí | Sí | Sí, local | Implementada/probada localmente |
| **Objective** | Sí | Sí | Sí | Sí | Indirecta en snapshot | Sí | Sí | Sí, dirección validada | Implementada/probada localmente |
| **Constraint** | Sí | Sí | Sí | Sí | Indirecta en snapshot | Sí | Sí | Sí, local | Implementada/probada localmente |
| **Preference** | Sí | Sí | Sí | Sí | POST autenticado v0.3 | Sí | Sí | Sí, local y HTTP temporal | Implementada/probada localmente; remoto pendiente |
| **Alternative** | Sí | Sí | Sí | Sí | Indirecta en snapshot | Sí | Sí | Sí, simulador y UI | Implementada/probada localmente |
| **Evaluation** | Sí | Sí | Sí | Sí | Flujo local/contrato | Sí | Sí | Sí, integración local | Implementada/probada localmente |
| **Comparison** | Sí | Sí | Sí | Sí | Council/snapshot | Sí, Council y módulo analítico | Sí | Sí, dirección y factibilidad | Implementada/probada localmente |
| **Recommendation** | Sí | Sí | Sí | Sí | POST autenticado v0.3 | Sí | Sí | Sí, no crea Decision | Implementada/probada localmente |
| **HumanReview** | Sí, módulo `human_review`/review | Sí en el flujo de revisión | Sí | Sí | POST autenticado v0.3 | Sí, Audit | Sí | Sí, local | Implementada/probada localmente |
| **Decision** | Sí | Sí | Sí | Sí | POST autenticado v0.3 | Sí, preparación/registro | Sí | Sí, autoridad requerida | Implementada/probada localmente |
| **Event** | Sí | Sí | Sí | Sí | Incluido en auditoría/snapshot | Sí, Audit | Sí | Sí, append-only a nivel aplicación | Remoto/persistencia externa pendiente |
| **Audit** | No como entidad principal; proyección | Derivada de eventos | Sí como consulta/proyección | Sí | Council/audit read-only | Sí | Sí | Sí, local | Proyección implementada; entidad separada no demostrada |
| **Report** | No como entidad canónica principal | No persistencia específica demostrada | No agregado específico | Exportación segura | No endpoint específico | Export JSON de trazabilidad | Cobertura de exportación | Sí, local | Salida/exportación, no entidad canónica |

### C.1 Discrepancia ontológica no corregida

El Master Spec enumera Fact, Assumption, Audit y Report como conceptos del sistema, pero la auditoría del código no demuestra cuatro entidades canónicas independientes equivalentes. Esto no prueba que la visión sea incorrecta; sí demuestra que debe distinguirse entre **entidad persistente**, **concepto semántico**, **proyección** y **artefacto de salida** antes de congelar el Core Contract.

**INTERVENCIÓN DEL USUARIO REQUERIDA:** decidir si Fact y Assumption deben seguir siendo roles/tipos de Evidence y si Audit y Report deben permanecer como proyecciones/salidas, o si en una versión posterior deben convertirse en entidades canónicas. No recomiendo inferir esa decisión desde el código actual.

---

## D. Estado de invariantes críticas

| Invariante | Estado | Evidencia | Observación |
|---|---|---|---|
| Recommendation ≠ Decision | Implementada y probada localmente | Servicios, router, UI y regresiones | No se verificó en servicio remoto. |
| Decision requiere autoridad humana | Implementada y probada localmente | Modelo, revisión, router y pruebas | La UI no decide por sí sola. |
| Hechos ≠ supuestos ≠ preferencias ≠ decisiones | Parcial | Preference y estados de autoridad están separados; Fact/Assumption no son entidades separadas demostradas | Requiere decisión ontológica adicional. |
| Provenance obligatorio donde corresponde | Implementada en evaluaciones, evidencia y Preference | Modelo, catálogo, pruebas y export seguro | No todos los conceptos históricos tienen campo propio. |
| Eventos no alterables retrospectivamente | Implementada a nivel de aplicación y probada localmente | Replay, SQLite y regresiones | No equivale a garantía de almacenamiento externo hasta probar reinicio. |
| Frontend no es autoridad semántica independiente | Implementada localmente | Adaptador tRPC, fallback explícito, pruebas | E2E remoto pendiente. |
| Dirección de Objective no se infiere | Implementada y probada | `INSUFFICIENT_DATA`, pruebas 0.2.5 | La UI ofrece opciones, pero no autoriza default semántico. |
| Método IO desconocido no se inventa | Implementada y probada | Catálogo cerrado, `UNKNOWN_METHOD` | Métodos futuros requieren contrato. |
| Decision Conditions no son texto IA | Implementada como datos declarativos read-only | Contrato TS, UI, pruebas | Escritura canónica pendiente. |

---

## E. Estado específico de Preference

Preference está integrada como entidad canónica del Core Contract Python. La clase contiene, según el contrato implementado, identificación, proyecto, nombre, justificación, dominio, fuerza, alcance, procedencia, vigencia y estado. Está conectada con `CoreProject`, persistencia SQLite, revisión, snapshot/export y el adaptador HTTP v0.3.

El guardado utiliza control de versión y transacción atómica en el ámbito local, y registra el evento `PREFERENCE_RECORDED`. El replay idempotente fue endurecido para exigir coincidencia de `event_type`, `entity_type`, `entity_id`, `project_id` y payload completo. Las pruebas HTTP cubren escritura autenticada y el cliente web conserva la normalización `snake_case`.

| Punto solicitado | Estado real |
|---|---|
| Modelo Python | Implementado y probado localmente. |
| Persistencia SQLite | Implementada y probada en round-trip. |
| CoreProject | Integrado. |
| Revisión/versionado | Integrado con control de versión y revisión. |
| Snapshot/export | Integrado. |
| API | HTTP v0.3 autenticado. |
| Frontend | Formulario y normalización web integrados. |
| Pruebas | Suite Python, HTTP y web pasan. |
| E2E remoto | No probado; bloqueado por Cloud Computer. |

**Conclusión:** la afirmación “Preference está integrada” es correcta para el alcance local. No debe ampliarse a “integración remota completa”.

---

## F. Estado de Decision Conditions

Decision Conditions existe actualmente como una estructura declarativa en el contrato TypeScript y como representación visible/read-only en el Command Center. Puede contener referencia, tipo, umbral, procedencia, estado y explicación de la condición. La UI muestra las condiciones registradas y la escritura se bloquea cuando `SICL_CORE_URL` está configurado porque no existe un endpoint canónico Python demostrado para persistirlas.

No hay evidencia de que Decision Conditions sea texto generado por IA ni de que el sistema lo use para convertir una condición en una decisión. La estructura actual debe entenderse como una superficie explicativa y de contrato pendiente, no como una entidad ya integrada en el Core Python.

Para convertirla en capacidad canónica faltan: definición ontológica aprobada, modelo Python, migración SQLite, operaciones atómicas/versionadas, evento, endpoint HTTP v0.4 o posterior, delegación tRPC, pruebas de error y migración de la UI. Este listado es una descripción de dependencia, no una autorización para implementarlo.

**Estado:** read-only local; escritura canónica preparada conceptualmente, no implementada.

---

## G. Estado HTTP y Remote Core

El adaptador `sicl-core-http` contiene rutas para health, contrato, proyectos, Preference, Recommendation, HumanReview, Decision, métodos IO, Council y snapshot. La autenticación bearer server-to-server y la propagación de errores fueron probadas localmente. El smoke test temporal verifica autenticación, escritura, snapshot y Council read-only contra una base temporal.

| Punto | Estado real |
|---|---|
| `SICL_CORE_URL` | Variable consumida server-side; no registrada con URL real. |
| Token | Server-side; no expuesto al navegador. |
| Core no disponible | Producción falla cerrado si falta configuración; fallback local solo es explícito. |
| Fallback local | Disponible para desarrollo mediante `SICL_ALLOW_LOCAL_CORE=true`. |
| URL pública | No existe evidencia de URL del Core desplegado. |
| HTTPS | No configurado/verificado. |
| `/data/sicl/` | Runbook preparado; no montado en máquina real. |
| UFW/systemd | Runbook preparado; no ejecutado. |
| Persistencia tras reinicio | No probada externamente. |
| Prueba HTTP temporal | Aprobada localmente. |
| E2E remoto poblado | Pendiente. |

**Conclusión:** la frontera de integración está preparada, no operativa en producción.

---

## H. Estado de pruebas

| Prueba | Resultado | Qué demuestra |
|---|---|---|
| Suite Python | PASSED | Coherencia local del Core y módulos cubiertos. |
| Suite Vitest | 64/64 PASSED | Coherencia local de tRPC, adaptadores, router y UI cubierta. |
| Simulador Fase A | PASSED | Dos fixtures SICL 1 sintéticos, determinismo e invariantes declaradas. |
| Smoke test HTTP RC | PASSED | Contrato HTTP temporal, autenticación, snapshot y Council. |
| `compileall` | PASSED | Compilación sintáctica de Core, adaptador y herramientas. |
| `git diff --check` | PASSED | Sin errores de whitespace en el estado auditado. |
| Navegador sin datos canónicos poblados | Parcial | Render responsive revisado; no es E2E poblado. |
| E2E remoto | NO EJECUTADO | Requiere Cloud Computer, URL, HTTPS y datos. |
| Persistencia externa tras reinicio | NO EJECUTADA | Requiere almacenamiento y servicio real. |

La advertencia de FastAPI/httpx observada durante la suite es una advertencia de deprecación, no un fallo de prueba. Debe registrarse para mantenimiento, pero no se convierte en una corrección de contrato dentro de esta auditoría.

---

## I. Discrepancias encontradas

| ID | Discrepancia | Severidad | Estado |
|---|---|---|---|
| D-001 | Fact y Assumption aparecen en la visión, pero no como entidades canónicas separadas demostradas. | P1 conceptual | No corregida; requiere decisión. |
| D-002 | Audit y Report aparecen como conceptos, pero el código demuestra proyecciones/exportaciones más que entidades principales. | P1 conceptual | No corregida; requiere decisión. |
| D-003 | Preference está integrado localmente, mientras la redacción puede ser leída como integración remota completa. | P1 interpretativa | Precisada en Master Spec; E2E sigue pendiente. |
| D-004 | Decision Conditions existe en TypeScript/UI read-only, pero no en Core Python/HTTP canónico demostrado. | P1 contractual | Deliberadamente no corregida. |
| D-005 | El Master Spec contiene capacidades SICL 2–3 con contrato mínimo, pero no una operación urbana/nacional completa. | P1 de alcance | Documentada; no corregida. |
| D-006 | Eventos son append-only a nivel de aplicación, pero no existe evidencia de reinicio sobre almacenamiento externo. | P0 operativo para aceptación | Bloqueada por infraestructura. |
| D-007 | El fallback local y el Core remoto son rutas distintas; solo la segunda puede cerrar la aceptación canónica. | P0 operativo | Documentada; sin evidencia remota. |
| D-008 | El estado del frontend fue validado visualmente, pero no con datos canónicos poblados en navegador. | P1 verificación | Bloqueada por Core remoto/datos. |

---

## J. Riesgos técnicos

El riesgo principal es declarar el MVP funcional basándose únicamente en pruebas locales. El segundo es ampliar la ontología por acumulación de nombres históricos sin decidir si cada nombre es entidad, tipo, proyección o artefacto. El tercero es que una futura escritura local de Decision Conditions cree una segunda semántica fuera del Core. El cuarto es evaluar estética, escenarios nacionales o métodos avanzados antes de cerrar incertidumbre, procedencia y autoridad.

Existe además un riesgo de operación: la persistencia SQLite local puede funcionar mientras el proceso está activo y aun así no estar protegida frente a recreación del contenedor. Por esa razón, `/data/sicl/`, reinicio, backup y restauración no pueden darse por hechos hasta una prueba en la máquina objetivo.

La advertencia de compatibilidad futura de `httpx`/Starlette es un riesgo de mantenimiento de dependencias, no una evidencia de fallo semántico. Debe mantenerse visible para el siguiente ciclo técnico.

---

## K. Elementos que requieren intervención humana

**INTERVENCIÓN DEL USUARIO REQUERIDA** para cualquiera de las siguientes decisiones:

| Decisión | Motivo |
|---|---|
| Clasificar formalmente este Master Spec como APROBADO, APROBADO CON CAMBIOS, POSTERGAR o RECHAZADO. | Es la autoridad constitucional del proyecto. |
| Decidir si Fact y Assumption son entidades, tipos de Evidence o conceptos documentales. | Cambia la ontología del Core Contract. |
| Decidir si Audit y Report permanecen como proyecciones/salidas o se convierten en entidades. | Cambia persistencia y API. |
| Aprobar un endpoint canónico de escritura para Decision Conditions. | Cambia entidad, API, persistencia y frontera web. |
| Aprobar cualquier modificación de invariantes, autoridad o seguridad. | No puede inferirse técnicamente. |
| Aprobar la incorporación de estética como capacidad de producto. | RFC-011 es futuro y deliberadamente no implementado. |
| Aprobar ampliación SICL 2–3 operativa, GIS/BIM, agentes o simulación avanzada. | Implica alcance y contratos nuevos. |
| Autorizar el despliegue remoto y aportar/confirmar la infraestructura y dominio. | Sin ello no existe evidencia E2E. |

---

## L. Recomendación del siguiente ciclo de implementación

La recomendación técnica es no agregar nuevas entidades ni capacidades. El siguiente ciclo debe ser un ciclo de **integración y aceptación**, no de expansión conceptual.

Primero debe adjuntarse el Cloud Computer y documentarse su sistema, recursos, red y dominio. Después debe desplegarse `sicl-core-http` con almacenamiento externo, reinicio automático, firewall mínimo y HTTPS. Luego deben registrarse `SICL_CORE_URL` y el token únicamente server-side. Finalmente debe ejecutarse el flujo UPAO-001 desde navegador: Project, Evidence, Objective, Constraint/Requirement, Preference, Alternative, Evaluation, Comparison, Recommendation, HumanReview, Decision, Council y Audit.

Cada etapa debe producir evidencia concreta: comandos, respuestas, códigos de error, snapshot, eventos, persistencia antes/después del reinicio, ausencia de secretos y capturas del navegador con datos canónicos. La aceptación final debe seguir la Product Acceptance Contract, no una estimación de tiempo ni un HTTP 200 aislado.

Mientras el Cloud Computer no esté disponible, la única actividad razonable es conservar este estado, revisar las discrepancias ontológicas y esperar la clasificación del Master Spec. Implementar estética o convertir Decision Conditions en escritura canónica ahora sería adelantar decisiones que esta auditoría deja abiertas.

---

## Referencias internas

1. [SICL Master Specification v1 revisado](SICL_MASTER_SPEC_v1.md)
2. [Product Acceptance Contract SICL 0.6](PRODUCT_ACCEPTANCE_CONTRACT_SICL_0_6.md)
3. [Release Candidate SICL 0.6](RELEASE_CANDIDATE_SICL_0_6.md)
4. [Auditoría consolidada SICL 0.6](AUDITORIA_CONSOLIDADA_SICL_0_6.md)
5. [Hoja de ruta ejecutiva SICL 0.6](ROADMAP_EJECUTIVA_SICL_0_6.md)
6. [Guía funcional SICL 1–3 para arquitectos](GUIA_FUNCIONAL_SICL_1_3_PARA_ARQUITECTOS.md)
7. [Simulador Fase A](SIMULATOR_PHASE_A.md)
8. [Runbook Cloud Computer](deploy/CLOUD_COMPUTER_RUNBOOK.md)
9. `/home/ubuntu/SICL_0_2_1/src/sicl/core_contract/model.py`
10. `/home/ubuntu/SICL_0_2_1/http_adapter/sicl_core_http.py`
11. `/home/ubuntu/sicl-web/server/routers.ts`
12. `/home/ubuntu/sicl-web/client/src/pages/Home.tsx`
