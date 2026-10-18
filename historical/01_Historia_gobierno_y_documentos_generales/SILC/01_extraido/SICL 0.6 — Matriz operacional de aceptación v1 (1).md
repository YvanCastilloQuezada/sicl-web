# SICL 0.6 — Matriz operacional de aceptación v1

**Propósito:** servir como guion ejecutable para el futuro E2E remoto de SICL 0.6.

**Regla de alcance:** esta matriz no agrega endpoints, entidades, invariantes ni soluciones. Refleja únicamente el contrato actualmente observable en el Core Python y su adaptador HTTP v0.3. Cuando el contrato no permite probar una etapa por HTTP, el estado correcto es **BLOQUEADO POR CONTRATO**.

**Estado de infraestructura al redactar:** no existe Cloud Computer adjunto, no existe `SICL_CORE_URL` configurado, no existe `/data/sicl/` verificable y no se ejecuta un E2E remoto.

## 1. Criterios de lectura

| Estado | Significado |
|---|---|
| IMPLEMENTADO LOCAL | Existe en el código local y tiene pruebas locales, pero no demuestra ejecución remota. |
| OPERACIONALMENTE PREPARADO | El endpoint o procedimiento está documentado y puede ejecutarse cuando exista infraestructura. |
| BLOQUEADO POR CONTRATO | El contrato HTTP actual no expone la operación necesaria; no se inventa un endpoint. |
| BLOQUEADO POR INFRAESTRUCTURA | El contrato existe, pero falta Cloud Computer, servicio, HTTPS, persistencia o configuración real. |
| PASS | Todas las precondiciones y verificaciones de la fila se cumplen con evidencia. |
| FAIL | Una precondición verificable falla. |
| NO EJECUTADO | Aún no corresponde ejecutar porque una dependencia anterior está bloqueada. |

## 2. Matriz operacional principal

| Entidad | Operación | Endpoint / superficie actual | Precondición | Resultado esperado | Evento | Cambio de versión | Snapshot | Prueba | Criterio PASS/FAIL | Autoridad requerida |
|---|---|---|---|---|---|---|---|---|---|---|
| Project | Persist | `POST /v1/projects` | Bearer válido; `project_id` y `name` válidos; repositorio SQLite disponible | `200`; proyecto creado; `contract_version=sicl-core-http/0.3` | Evento de creación según repositorio; verificar en snapshot/auditoría | `observed_version` inicial de Project | `GET /v1/projects/{id}/snapshot` devuelve el proyecto | Smoke HTTP de creación + recuperación | PASS si crea y recupera el mismo proyecto; FAIL si no persiste o hay pérdida de campos | No profesional; operación de sistema autenticada |
| Project | Retrieve | `GET /v1/projects/{project_id}/snapshot` | Proyecto existente; Bearer válido | `200`; snapshot canónico y `observed_version` | No crea evento | No cambia versión | Snapshot completo del CoreProject | Comparar respuesta con creación | PASS si el snapshot es recuperable; FAIL si devuelve datos distintos o secretos | No |
| Project | Context | Campos `spatial_scope` y `temporal_scope` en `POST /v1/projects`; lectura por snapshot | Scope válido según enums; no inferir coordenadas ni geografía | Scope se conserva literalmente | Evento de creación; verificar procedencia | Incremento normal del proyecto | Snapshot conserva scopes | Crear proyecto SICL 1 con scope explícito; repetir con horizonte permitido | PASS si conserva valores explícitos; FAIL si infiere o transforma silenciosamente | No |
| Evidence | Persist / Retrieve | **Ningún endpoint HTTP v0.3 de escritura o lectura de Evidence identificado** | Requiere mapping canónico HTTP no presente | **BLOQUEADO POR CONTRATO** | No se puede exigir evento HTTP no definido | No se puede verificar versión HTTP | No se puede recuperar por endpoint HTTP | No inventar endpoint; registrar bloqueo | PASS de la matriz únicamente como bloqueo explícito; FAIL si se afirma cobertura E2E | No aplica |
| Objective | Persist / Retrieve | **Ningún endpoint HTTP v0.3 identificado** | Requiere mapping y operación canónica no expuestos | **BLOQUEADO POR CONTRATO** | No verificable por HTTP | No verificable por HTTP | No verificable por HTTP | Revisar contrato antes de intentar E2E | PASS como bloqueo documentado; FAIL si se presenta como operativo | No aplica |
| Constraint / Requirement | Persist / Retrieve | **Ningún endpoint HTTP v0.3 identificado** | Requiere mapping canónico no expuesto | **BLOQUEADO POR CONTRATO** | No verificable por HTTP | No verificable por HTTP | No verificable por HTTP | No ejecutar una ruta inventada | PASS como bloqueo documentado | No aplica |
| Preference | Persist | `POST /v1/projects/{project_id}/preferences` | Proyecto existente; Bearer válido; `expected_project_version`; campos obligatorios; `event_id` único | `200`; Preference registrada; versión observada incrementada | `PREFERENCE_RECORDED` | `observed_version = expected_project_version + 1` | Recuperar en snapshot y comprobar contenido | Smoke HTTP autenticado; repetición con versión anterior para conflicto | PASS si persiste, genera evento y no pierde campos; FAIL si duplica o altera evento | No profesional; escritura server-to-server |
| Preference | Retrieve | `GET /v1/projects/{project_id}/snapshot` | Preference ya persistida | Snapshot contiene Preference y su procedencia/estado | No crea evento | No incrementa versión | Preference aparece en CoreProject | Comparar con respuesta de persistencia | PASS si coincide exactamente con lo registrado | No |
| Alternative | Persist / Retrieve | **Ningún endpoint HTTP v0.3 de Alternative identificado** | Requiere mapping canónico no expuesto por el adaptador actual | **BLOQUEADO POR CONTRATO** | No verificable por HTTP | No verificable por HTTP | No verificable por HTTP | No inventar `POST /alternatives` | PASS como bloqueo documentado | No aplica |
| Evaluation | Persist / Retrieve | **Ningún endpoint HTTP v0.3 de Evaluation identificado** | Requiere mapping canónico no expuesto | **BLOQUEADO POR CONTRATO** | No verificable por HTTP | No verificable por HTTP | No verificable por HTTP | No inventar `POST /evaluations` | PASS como bloqueo documentado | No aplica |
| Comparison | Persist / Retrieve | **Ningún endpoint HTTP v0.3 de Comparison identificado** | Requiere mapping canónico no expuesto | **BLOQUEADO POR CONTRATO** | No verificable por HTTP | No verificable por HTTP | No verificable por HTTP | No inventar `POST /comparisons` | PASS como bloqueo documentado | No aplica |
| Recommendation | Persist analytical | `POST /v1/projects/{project_id}/recommendations` | Proyecto existente; referencia `based_on`; `based_on_kind`; versión esperada; Bearer válido | `200`; Recommendation analítica registrada; no Decision creada | Evento de artefacto analítico según repositorio | `observed_version = expected_project_version + 1` | Council y snapshot muestran Recommendation | Ejecutar con referencia válida; verificar ausencia de Decision | PASS si Recommendation existe separada de Decision; FAIL si crea Decision o acepta referencia inválida | No: solo salida analítica |
| Recommendation | Retrieve / Council | `GET /v1/projects/{project_id}/council` y snapshot | Recommendation ya registrada; Bearer válido | Council read-only con `recommendations`; snapshot la conserva | No crea evento | No incrementa versión | Council y snapshot canónicos | Comparar ambos envelopes | PASS si ambos contienen la misma Recommendation y Council es read-only | No |
| HumanReview | Persist | `POST /v1/projects/{project_id}/human-reviews` | Recommendation existente; `actor_id`; `authority_basis`; `confirmation_id`; versión observada; estado válido; Bearer válido | `200`; revisión registrada con actor y base de autoridad | Evento de revisión según repositorio | `observed_version = expected_project_version + 1` | Snapshot/auditoría conserva revisión | Ejecutar con datos explícitos de revisión humana | PASS si se conserva actor, autoridad, confirmación y versión; FAIL si falta cualquiera | Sí; actor humano explícito |
| Decision | Prepare / Persist | `POST /v1/projects/{project_id}/decisions` | Revisión/autoridad según contrato; `decision_maker`; `authority_context`; versión esperada; Bearer válido | `200`; Decision registrada solo con autoridad válida | Evento de decisión según repositorio | `observed_version = expected_project_version + 1` | Snapshot/auditoría conserva Decision | Ejecutar primero sin autoridad válida y luego con autoridad válida | PASS si rechazo sin autoridad y aceptación con autoridad; FAIL si permite decisión automática | **Sí, obligatoria** |
| Decision | Boundary | Mismo endpoint de Decision | Recommendation existente no equivale a autoridad | Recommendation no crea Decision | Debe existir evento separado | Versiones separadas | Snapshot debe mostrar ambas entidades separadas | Verificar flujo Recommendation → HumanReview → Decision | PASS si no existe Decision antes del registro humano; FAIL si aparece automáticamente | Sí para Decision |
| Audit | Retrieve | `GET /v1/projects/{project_id}/snapshot`; eventos incluidos según CoreProject | Proyecto existente; acceso autenticado | Snapshot conserva eventos seguros y ordenados | Eventos append-only | Versiones observables | Snapshot/auditoría | Guardar snapshot, ejecutar segundo guardado y comparar eventos previos | PASS si eventos anteriores no se modifican/eliminan; FAIL si hay mutación | No profesional; lectura autenticada |
| Report | Retrieve / Export | No existe endpoint HTTP v0.3 dedicado de Report | Requiere formato canónico de Report no definido en HTTP v0.3 | **BLOQUEADO POR CONTRATO** | No se exige evento no definido | No verificable | No existe envelope dedicado | No inventar `/reports` | PASS como bloqueo documentado | No aplica |

## 3. Invariantes obligatorias

| Invariante | Procedimiento E2E | Resultado exigido | Estado actual |
|---|---|---|---|
| Recommendation ≠ Decision | Crear/recuperar Recommendation; consultar snapshot antes de HumanReview | No debe existir Decision | Preparado; remoto no ejecutado |
| Recommendation no puede crear Decision | Persistir Recommendation y revisar snapshot/auditoría | Cero Decision nueva | Preparado; remoto no ejecutado |
| Decision requiere autoridad humana | Intentar Decision sin `authority_context` válido y luego con actor/base/confirmación | Primer intento rechazado; segundo solo con autoridad explícita | Contrato presente; remoto no ejecutado |
| Preference persiste y genera `PREFERENCE_RECORDED` | Registrar Preference; recuperar snapshot y eventos | Preference visible y evento exacto presente | Preparado; remoto no ejecutado |
| Decision Conditions continúa read-only | Consultar UI/contrato; intentar escritura solo si existe endpoint | No existe mutación canónica; no se inventa endpoint | Read-only en web; escritura canónica bloqueada |
| Eventos son append-only | Guardar estado, realizar segundo guardado, comparar eventos previos | Eventos previos idénticos y no eliminados | Cubierto localmente; persistencia remota pendiente |
| Persistencia sobrevive reinicio | Crear proyecto y Preference; reiniciar contenedor/systemd; recuperar snapshot | Mismos datos y eventos después del reinicio | BLOQUEADO POR INFRAESTRUCTURA |
| Navegador no recibe secretos | Inspeccionar payloads, consola y solicitudes del navegador | No aparecen tokens ni secretos | Preparado localmente; navegador poblado remoto pendiente |
| Fallback local no es Remote Core | Ejecutar con `SICL_CORE_URL` ausente/presente y revisar estado | Producción falla cerrado; fallback solo con configuración local explícita | Cubierto por contrato/pruebas locales; remoto pendiente |

## 4. Errores y respuestas esperadas

| Situación | Código/estado esperado | Criterio |
|---|---|---|
| Bearer ausente o incorrecto | `401` | PASS si no se ejecuta escritura ni lectura protegida |
| Proyecto inexistente en Council/snapshot | `404` | PASS si se conserva el envelope contractual y tRPC lo traduce sin inventar datos |
| Versión esperada obsoleta | `409` | PASS si no se crea una nueva versión ni evento parcial |
| Violación del Core Contract | `422` | PASS si se devuelve el error contractual sin secreto |
| Endpoint inexistente para una entidad | No se ejecuta | PASS si se marca **BLOQUEADO POR CONTRATO** |
| Servicio remoto ausente | No se ejecuta E2E | PASS si se marca **BLOQUEADO POR INFRAESTRUCTURA** |

## 5. Orden de ejecución futuro

La ejecución real solo comienza después de inspeccionar infraestructura: Cloud Computer conectado, checkout versionado, Docker, almacenamiento persistente, systemd, UFW, dominio, HTTPS, secretos server-side y etiqueta `sicl-core-http:release-0.6`. Después se ejecutan, en orden, `/health`, `/v1/contract`, persistencia de Project, recuperación de snapshot, Preference y evento, Recommendation separada, HumanReview, Decision con autoridad, auditoría, reinicio y recuperación, y finalmente la verificación del navegador.

Las filas bloqueadas por contrato no deben convertirse en falsos PASS. Antes de cubrir Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison o Report por el E2E remoto, debe existir una decisión contractual y una superficie HTTP canónica. Esa decisión es independiente del despliegue y, si se pretende modificar el contrato, requiere **INTERVENCIÓN DEL USUARIO REQUERIDA**.

## 6. Estado de aceptación de esta matriz

La matriz está lista para ser ejecutada, pero no constituye evidencia de que el E2E remoto haya pasado. La etiqueta `release-0.6` está alineada en los artefactos operativos; el servicio, la imagen, HTTPS, la persistencia externa y el navegador poblado todavía requieren Cloud Computer.

**INTERVENCIÓN DEL USUARIO REQUERIDA:** si el Product Owner quiere que Evidence, Objective, Constraint/Requirement, Alternative, Evaluation, Comparison o Report sean etapas obligatorias del E2E remoto, debe clasificar o aprobar primero la superficie contractual que actualmente no está expuesta por HTTP v0.3. No se propone resolverlo automáticamente en esta matriz.

## 7. Estado del checkout utilizado

El commit `2ef49aba2136` existe y contiene la resolución A-001. Sin embargo, el directorio de trabajo actual contiene artefactos posteriores no rastreados (`docs/SICL_MASTER_SPEC_v1.md`, `docs/SICL_NEXT_CYCLE_REPORT_v1.md`, `docs/SICL_STATE_AUDIT_v1.md`, `docs/word/` y herramientas de documentación). Por tanto, el checkout actual **no está limpio** aunque el commit objetivo sea verificable. Para el despliegue, se debe utilizar un checkout limpio del commit/release autorizado; esta observación no modifica el Core Contract.

## 8. Fuentes locales

| Fuente | Uso |
|---|---|
| `http_adapter/sicl_core_http.py` | Rutas, modelos de request, códigos y flags del contrato HTTP v0.3. |
| `deploy/sicl-core-http.service` | Etiqueta de imagen, montaje persistente y estrategia systemd. |
| `deploy/CLOUD_COMPUTER_RUNBOOK.md` | Precondiciones y orden operativo remoto. |
| `docs/SICL_REMOTE_EXECUTION_PACKAGE_v1.md` | Paquete de ejecución y criterios de evidencia. |
| `docs/SICL_READINESS_CHECK_v1.md` | Estado de readiness, bloqueo de infraestructura y A-001 resuelto. |
