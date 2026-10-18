# ARKI Agent Bridge v0.2 — Technical Specification

**Orden:** `AB-V02-SPEC-001`  
**Estado:** especificación técnica bloqueada para implementación posterior  
**Versión objetivo:** `0.2`  
**Alcance:** infraestructura privada de un único propietario  
**Estado de implementación:** no implementado por esta tarea

> Esta especificación define el diseño de v0.2. No crea código, no solicita credenciales, no publica servicios y no modifica ARKI.

## 1. Architecture

ARKI Agent Bridge v0.2 será un sistema privado y desacoplado compuesto por siete componentes obligatorios:

```text
Yvan / Human Authority
          |
          v
Decision Policy Engine
          |
          v
Private Bridge Gateway ---> Persistent Orchestrator
                                  |             |
                                  v             v
                           Manus Adapter   OpenAI Adapter
                                  |             |
                                  v             v
                         Secure Manus Webhook Receiver
                                  |
                                  v
                         SQLite Event / Audit Store
```

El Gateway recibe órdenes y consultas autenticadas. El Orchestrator posee la máquina de estados y es el único componente autorizado a cambiarla. El Manus Adapter encapsula la API Manus. El OpenAI Adapter encapsula la interfaz explícitamente soportada del lado OpenAI. El Webhook Receiver valida y registra eventos antes de entregarlos al Orchestrator. SQLite es la fuente de verdad del estado del Bridge.

El Bridge no contiene una copia de ARKI y no es fuente de verdad del producto. `project`, `do_not_touch` y referencias de contexto solo se transportan como datos de la orden.

### Flujo principal

```text
AUTHORIZED DECISION
  -> persist decision
  -> dispatch Manus task
  -> persist task and transition
  -> receive verified Manus event
  -> deduplicate and persist event
  -> reconcile task state
  -> normalize structured result
  -> policy check
  -> OpenAI review, if required by policy
  -> next authorized action or escalation
```

### Principios de diseño

1. **Human Authority first:** una decisión autorizada se conserva y no se vuelve a solicitar dentro de su alcance.
2. **Fail closed:** ausencia o invalidez de autenticación, firma o configuración de seguridad detiene el procesamiento.
3. **Durability:** toda orden, evento, resultado y transición relevante se persiste antes de considerarse aceptada.
4. **Idempotency:** un mismo evento o comando no puede producir dos efectos materiales.
5. **Reversibility:** las acciones automáticas deben ser acotadas, auditables y reversibles cuando sea posible.
6. **Minimality:** no se introducen sistemas distribuidos ni capacidades multiusuario en v0.2.

## 2. Trust Boundaries

| Boundary | Zona origen | Zona destino | Control obligatorio |
|---|---|---|---|
| B1 | Cliente de control privado | Bridge Gateway | secreto interno fuerte, TLS o loopback seguro, esquema, límite de cuerpo |
| B2 | Bridge | Manus API | `MANUS_API_KEY` fuera del código, timeout, retries acotados, scopes/cuenta adecuados |
| B3 | Manus | Webhook Receiver | HTTPS público, firma RSA-SHA256 obligatoria, timestamp, URL canónica, deduplicación |
| B4 | Orchestrator | OpenAI Adapter | interfaz explícita, autenticación del runtime, contrato estructurado, timeout |
| B5 | Procesos del host | SQLite | permisos de archivo restrictivos, WAL, backup controlado, no exposición de la base |
| B6 | Logs y respuestas | Sistema externo | redacción de secretos, límites de contenido, no almacenar API keys/tokens |
| B7 | Bridge | ARKI | frontera de solo referencia; prohibido copiar, modificar o publicar ARKI |

Ningún dato procedente de Manus o OpenAI se considera una decisión autorizada por sí mismo. La autoridad se determina por la entidad `decisions` y por `Decision Policy Engine`.

## 3. Component Responsibilities

### A. Private Bridge Gateway

Expone exclusivamente las operaciones privadas necesarias para crear una decisión, despacharla, enviar un mensaje autorizado, consultar estado y leer evidencia. Valida autenticación, tamaño, tipos y autorización de tarea. No decide transiciones ni ejecuta lógica de negocio fuera de la política.

### B. Persistent Orchestrator

Coordina el ciclo de vida. Persiste primero los comandos recibidos, llama a los adaptadores, registra respuestas, reconcilia estados y emite transiciones atómicas. Debe poder reiniciarse y continuar desde SQLite sin perder la correlación `decision_id` ↔ `task_id`.

### C. Manus Adapter

Implementa `task.create`, `task.sendMessage`, `task.detail`, `task.listMessages`, `webhook.create` y `webhook.publicKey`. Traduce errores HTTP/API a errores estructurados. No expone la API key fuera del proceso y no interpreta texto libre como autoridad.

### D. OpenAI Adapter

Aísla el runtime OpenAI seleccionado en una interfaz estable. Entrega contexto mínimo, resultado Manus normalizado y evidencia. Devuelve una decisión estructurada, no una instrucción textual sin esquema.

### E. Decision Policy Engine

Clasifica acciones como `AUTO_ALLOWED`, `REVIEW_ALLOWED`, `HUMAN_REQUIRED` o `PROHIBITED`. Comprueba el alcance de la decisión, las categorías de escalamiento y las transiciones permitidas.

### F. Event Store / Audit Log

SQLite conserva decisiones, tareas, mensajes, eventos, transiciones, escalaciones y auditoría. Las filas de auditoría son append-only a nivel lógico; las correcciones se registran como nuevos eventos.

### G. Secure Manus Webhook Receiver

Acepta únicamente webhooks con firma válida. No ejecuta el evento directamente. Valida y persiste el evento de forma idempotente, responde 2xx solo cuando la aceptación segura ha concluido y deja el procesamiento posterior al Orchestrator.

## 4. State Machine

Estados mínimos obligatorios:

```text
CREATED -> AUTHORIZED -> DISPATCHED -> RUNNING
RUNNING -> WAITING_EXTERNAL
RUNNING -> RESULT_RECEIVED
RUNNING -> FAILED
WAITING_EXTERNAL -> RUNNING
WAITING_EXTERNAL -> HUMAN_DECISION_REQUIRED
RESULT_RECEIVED -> REVIEW_REQUIRED
RESULT_RECEIVED -> COMPLETED
REVIEW_REQUIRED -> CORRECTION_REQUIRED
REVIEW_REQUIRED -> COMPLETED
CORRECTION_REQUIRED -> DISPATCHED
Cualquier estado activo -> CANCELLED, solo si la política lo permite
```

### Definiciones

| Estado | Significado |
|---|---|
| `CREATED` | Orden recibida y validada, sin autorización efectiva persistida |
| `AUTHORIZED` | Decisión de Yvan registrada con alcance y política aplicable |
| `DISPATCHED` | Solicitud enviada a Manus y correlación creada |
| `RUNNING` | Manus está ejecutando la tarea |
| `WAITING_EXTERNAL` | La tarea espera una respuesta o evento externo no material |
| `RESULT_RECEIVED` | Se recibió un resultado verificable y persistido |
| `REVIEW_REQUIRED` | El resultado necesita revisión OpenAI o humana |
| `CORRECTION_REQUIRED` | Existe una corrección autorizada dentro del alcance |
| `HUMAN_DECISION_REQUIRED` | La continuación excede la autorización o cae en categoría material |
| `COMPLETED` | Criterios de aceptación y validación satisfechos |
| `FAILED` | Error no recuperable o expiración del plazo |
| `CANCELLED` | Cancelación explícita autorizada y registrada |

Cada transición debe validar `from_state`, `to_state`, `reason`, actor, timestamp y `decision_id`. Una transición ilegal no se aplica y genera un evento de rechazo.

## 5. Database Schema

SQLite será la persistencia de v0.2. La base debe usar WAL, foreign keys, índices de correlación y migraciones versionadas. El archivo debe tener permisos de propietario y no debe quedar bajo una ruta pública.

### `decisions`

| Columna | Tipo | Requisito |
|---|---|---|
| `id` | TEXT | PK durable, `decision_id` |
| `owner_subject` | TEXT | identidad del propietario autenticado |
| `project` | TEXT | referencia externa; no copia de ARKI |
| `context` | TEXT | contexto autorizado, sujeto a límites |
| `why` | TEXT | motivo de la orden |
| `objective` | TEXT | objetivo |
| `execution` | TEXT | alcance de ejecución |
| `preserve` | TEXT | límites de preservación |
| `do_not_touch` | TEXT | exclusiones |
| `acceptance` | TEXT | criterios de aceptación |
| `validation` | TEXT | validación esperada |
| `policy_version` | TEXT | versión de política aplicada |
| `state` | TEXT | estado actual |
| `created_at` / `authorized_at` | INTEGER | Unix seconds |
| `expires_at` | INTEGER NULL | vencimiento opcional |

### `tasks`

Contiene `id`, `decision_id`, `manus_task_id`, `status`, `last_cursor`, `last_manus_updated_at`, `created_at`, `updated_at` y `metadata_json`. `decision_id` y `manus_task_id` deben tener índices únicos donde corresponda.

### `events`

Contiene `id`, `source`, `event_type`, `external_event_id`, `payload_sha256`, `raw_payload_encrypted_or_redacted`, `signature_timestamp`, `received_at`, `processed_at`, `processing_status` y `error_code`. Debe existir una restricción única sobre `(source, external_event_id)` y, cuando no exista ID externo, sobre `(source, payload_sha256)` dentro de la política de retención.

### `messages`

Contiene `id`, `task_id`, `manus_message_id`, `direction`, `message_type`, `content_redacted`, `content_hash`, `cursor`, `created_at` y `metadata_json`. No debe guardar secretos ni tokens.

### `transitions`

Contiene `id`, `decision_id`, `task_id`, `from_state`, `to_state`, `reason`, `actor_type`, `actor_subject`, `policy_result`, `created_at` y `correlation_id`.

### `escalations`

Contiene `id`, `decision_id`, `task_id`, `category`, `question`, `required_action`, `status`, `created_at`, `resolved_at`, `resolved_by` y `resolution_hash`.

### `audit_log`

Contiene `id`, `correlation_id`, `actor_type`, `actor_subject`, `action`, `object_type`, `object_id`, `decision_id`, `before_hash`, `after_hash`, `metadata_redacted_json` y `created_at`. Es append-only a nivel de aplicación.

## 6. Decision Model

Una decisión es un mandato durable de Yvan con alcance explícito. El modelo mínimo es:

```json
{
  "decision_id": "AB-V02-EXAMPLE-001",
  "owner_subject": "yvan",
  "project": "arki-agent-bridge",
  "context": "...",
  "why": "...",
  "objective": "...",
  "execution": "...",
  "preserve": "...",
  "do_not_touch": "ARKI product repository and runtime",
  "acceptance": "...",
  "validation": "...",
  "authorized_actions": [],
  "policy_version": "v0.2.0",
  "expires_at": null
}
```

`decision_id` no se reutiliza. Una corrección dentro del alcance conserva la decisión y crea una orden hija o una transición correlacionada. Un cambio material crea una nueva decisión y entra en `HUMAN_DECISION_REQUIRED`.

## 7. Human Authority Policy

### Clasificación

| Clase | Regla |
|---|---|
| `AUTO_ALLOWED` | Acción determinista, reversible, dentro del alcance y sin nueva frontera de seguridad |
| `REVIEW_ALLOWED` | Acción ejecutable tras revisión OpenAI estructurada, sin nueva autorización material |
| `HUMAN_REQUIRED` | Requiere decisión explícita de Yvan antes de ejecutar |
| `PROHIBITED` | Fuera del objetivo o contradice una restricción permanente |

### `HUMAN_REQUIRED` mínimo

- `ARCHITECTURAL_FORK`
- `DESTRUCTIVE_OUT_OF_SCOPE`
- `SECURITY_BOUNDARY`
- `CREDENTIAL_REQUIRED`
- `COST_OR_RESOURCE_DECISION`
- `PROFESSIONAL_VALIDATION_REQUIRED`
- `AMBIGUOUS_MATERIAL_SCOPE`

La política debe impedir reconfirmar una decisión ya autorizada dentro de su alcance. El texto de un mensaje Manus, OpenAI o usuario externo nunca puede ampliar el alcance por sí solo.

## 8. Authentication

El Gateway utilizará un secreto interno fuerte proporcionado por variable de entorno o almacén de secretos del host. El secreto no se guarda en SQLite, código, mensajes, respuestas ni logs. Las comparaciones deben ser constant-time.

Requisitos:

1. Rechazar ausencia de secreto con fail closed.
2. Separar autenticación del Gateway de `MANUS_API_KEY`.
3. Aplicar autenticación también a consultas de estado y evidencia.
4. Limitar el servidor a loopback o red privada cuando la topología lo permita.
5. Usar HTTPS en cualquier exposición no local.
6. No implementar OAuth multiusuario en v0.2.
7. No permitir que un `task_id` autenticado se lea fuera de su `decision_id` autorizado.

## 9. Webhook Security

La firma Manus es obligatoria. La ausencia, invalidez o expiración de la clave pública debe producir rechazo; nunca aceptación silenciosa.

Proceso obligatorio:

1. Leer el cuerpo crudo sin normalizarlo.
2. Exigir `X-Webhook-Signature` y `X-Webhook-Timestamp`.
3. Rechazar timestamps fuera de la ventana de cinco minutos.
4. Construir exactamente `{timestamp}.{canonical_url}.{sha256_hex(body)}`.
5. Verificar RSA-SHA256 con la clave pública Manus cacheada.
6. Validar que la URL canónica sea la URL HTTPS registrada, no una URL derivada ambiguamente del header `Host`.
7. Persistir hash, timestamp, tipo de evento e identificador externo.
8. Rechazar duplicados ya procesados o marcarlos como `duplicate` sin ejecutar efectos.
9. Entregar al Orchestrator solo después de commit transaccional.
10. Redactar payloads sensibles antes del audit log.

La clave pública debe obtenerse mediante `webhook.publicKey`, cachearse y rotarse mediante un procedimiento explícito [5] [6]. El endpoint debe ser HTTPS público y registrado mediante `webhook.create` [7].

## 10. Idempotency Strategy

Cada comando de creación y cada mensaje debe aceptar una `idempotency_key` generada por el cliente autorizado. La clave se vincula a la operación, `decision_id` y payload hash. Si se repite la misma solicitud, se devuelve el resultado persistido. Si se reutiliza con otro payload, se rechaza por conflicto.

Para webhooks:

- Preferir `external_event_id` cuando Manus lo entregue.
- Usar `payload_sha256` como fallback.
- Crear una restricción única en SQLite.
- Registrar `first_seen_at`, `last_seen_at` y `processing_status`.
- Ejecutar efectos posteriores dentro de una transacción o con un outbox durable.
- No procesar de nuevo eventos `processed`, `duplicate` o `rejected` salvo una operación administrativa explícita y auditada.

## 11. Manus State Mapping

El Adapter debe consultar `task.detail` y paginar `task.listMessages`. El estado `stopped` no equivale automáticamente a finalización: hay que considerar `has_running_background_jobs`; si el campo falta, el estado de trabajos es desconocido [3].

| Manus signal | Bridge handling |
|---|---|
| `running` | `RUNNING`; continuar observación |
| `waiting` + pregunta | `WAITING_EXTERNAL`; clasificar pregunta y responder solo si la política lo permite |
| `waiting` + acción/confirmación | `HUMAN_DECISION_REQUIRED` salvo regla explícita; no auto-confirmar tipos desconocidos |
| `stopped` + no background jobs | reconciliar mensajes y pasar a `RESULT_RECEIVED`, `FAILED` o `REVIEW_REQUIRED` |
| `stopped` + background jobs true | mantener pendiente; continuar hasta deadline |
| `stopped` + background jobs omitido | tratar como desconocido; no declarar finalización |
| `error` | `FAILED`, conservar error estructurado y clasificar retryabilidad |
| `structured_output_result` | validar schema y producir resultado normalizado |

La paginación debe usar `has_more` y `next_cursor`, sin asumir que los últimos 50 mensajes contienen toda la evidencia [4].

## 12. OpenAI Adapter Contract

El Adapter será una interfaz separada, con implementación concreta definida después de seleccionar el runtime OpenAI explícitamente soportado. No asumirá que una conversación ChatGPT específica puede ser despertada desde un webhook.

### Entrada normalizada

```json
{
  "decision_id": "string",
  "task_id": "string",
  "project": "string",
  "authorized_scope": "string",
  "manus_status": "string",
  "result": {},
  "evidence": [],
  "blockers": [],
  "questions": [],
  "policy_version": "string",
  "correlation_id": "string"
}
```

### Salida obligatoriamente estructurada

```json
{
  "decision_id": "string",
  "classification": "AUTO_ALLOWED | REVIEW_ALLOWED | HUMAN_REQUIRED | PROHIBITED",
  "summary": "string",
  "next_action": "string",
  "scope_delta": false,
  "requires_human": false,
  "reason": "string",
  "evidence_to_preserve": ["string"]
}
```

El Orchestrator valida la salida contra schema, comprueba política y no ejecuta `next_action` si `scope_delta` es verdadero o `requires_human` no es compatible con la autorización almacenada.

## 13. Structured Result Schemas

El resultado Manus normalizado debe tener como mínimo:

```json
{
  "decision_id": "string",
  "task_id": "string",
  "status": "RESULT_RECEIVED | REVIEW_REQUIRED | COMPLETED | FAILED",
  "summary": "string",
  "files_changed": ["string"],
  "tests": [
    {"name": "string", "status": "passed | failed | skipped", "evidence": "string"}
  ],
  "evidence": ["string"],
  "blockers": ["string"],
  "questions": ["string"],
  "requires_human": false,
  "next_action": "string"
}
```

En implementación, todos los campos deben figurar en `required` y el schema debe impedir propiedades adicionales no reconocidas, siguiendo la capacidad de salida estructurada documentada por Manus [1] [2] [4]. Los archivos se representan por identidad y ruta/URL segura, nunca por contenido secreto incluido en logs.

## 14. Failure Handling

Los errores se clasifican como:

- **Validation:** no reintentar; devolver error público estable y registrar detalle redacted.
- **Authentication/authorization:** no reintentar automáticamente; escalar si requiere credencial o permiso.
- **Signature/security:** rechazar y registrar; no ejecutar efectos.
- **Transient network/5xx/rate limit:** bounded retry con exponential backoff y jitter.
- **Conflict/idempotency:** devolver el resultado previo o conflicto explícito.
- **Manus task error:** reconciliar mensajes, conservar evidencia y pasar a `FAILED` o `REVIEW_REQUIRED`.
- **OpenAI adapter unavailable:** persistir resultado Manus y pasar a `REVIEW_REQUIRED`; no perder el evento.
- **SQLite unavailable/locked:** no confirmar aceptación de un evento no persistido; aplicar timeout y error operativo.

No se devuelven stacks ni mensajes internos completos al cliente. Cada error público tiene `code`, `message`, `correlation_id` y, cuando procede, `retryable`.

## 15. Audit Model

El log debe reconstruir:

```text
WHO -> WHAT -> WHY -> WHEN -> DECISION -> ORDER -> MANUS RESULT
     -> OPENAI RESULT -> STATE TRANSITION -> HUMAN INTERVENTION
```

Cada entrada registra actor, acción, objeto, decisión, correlación, hashes y timestamp. Los secretos, tokens, API keys, cookies, headers de autorización y payloads no necesarios se excluyen o redactan antes de persistir. El contenido de mensajes se limita, se hashea o se cifra según la política de retención.

Las operaciones administrativas —replay manual, corrección de estado, rotación de clave, exportación y purga— requieren autenticación, motivo y auditoría adicional.

## 16. Threat Model

| Amenaza | Impacto | Mitigación v0.2 |
|---|---|---|
| Webhook falsificado | ejecución de orden no autorizada | firma obligatoria, fail closed, URL canónica |
| Replay de webhook | doble efecto | timestamp, external ID/hash único, transacción |
| Acceso no autorizado al Gateway | creación/lectura/envío indebido | secreto interno, red privada, autorización por decisión |
| Exposición de API key | control de cuenta Manus | variable/secrets manager, redacción, permisos de archivo |
| Inyección de prompt o scope | cambio de objetivo | decisión durable y policy engine, no confiar en texto |
| Confusión stopped/background | cierre prematuro | reconciliación con `has_running_background_jobs` |
| Duplicación de mensajes | efectos repetidos | idempotency keys y registro de comandos |
| DoS por cuerpo/frecuencia | agotamiento de memoria/CPU | body limit, rate limit, bounded concurrency |
| Fuga en logs | exposición de secretos/datos | redaction, allowlist de campos, permisos y retención |
| Corrupción o pérdida de estado | ciclo inconsistente | SQLite WAL, transacciones, backups verificados |
| Modificación accidental de ARKI | contaminación del producto | frontera explícita, rutas fuera del repo ARKI, pruebas de no-touch |
| Ambigüedad material | decisión incorrecta | `HUMAN_DECISION_REQUIRED`, no autoavance |

## 17. Test Strategy

La implementación posterior debe incluir:

1. **Unit tests:** schemas, policy engine, state machine, canonical URL, firma, timestamp, hashing y redaction.
2. **Property tests:** transiciones ilegales, idempotencia para payloads repetidos y entradas de tamaño límite.
3. **Integration tests:** SQLite migrations, transactions, outbox, Manus Adapter con servidor falso y OpenAI Adapter con contrato falso.
4. **Security tests:** ausencia de key fail-closed, firma inválida, URL alterada, timestamp expirado, replay, body oversized, missing auth y error redaction.
5. **Reliability tests:** timeout, retry bounded, 429, 5xx, SQLite lock y reinicio durante cada fase.
6. **Protocol tests:** presencia de `decision_id`, alcance, exclusiones, acceptance y resultado estructurado.
7. **Boundary tests:** ninguna operación del Bridge escribe en el repositorio o estado de ARKI.
8. **End-to-end tests:** solo con credenciales y endpoint de prueba provistos en una fase separada y autorizada.

El criterio mínimo es que ninguna prueba de seguridad dependa de una configuración opcional insegura.

## 18. E2E Validation Plan

La validación end-to-end se realizará después de implementar y revisar localmente:

1. Crear entorno de prueba aislado sin datos de producción.
2. Configurar secretos fuera del repositorio.
3. Exponer únicamente un endpoint HTTPS de prueba.
4. Registrar el webhook Manus y obtener/cachear la clave pública.
5. Crear una decisión de bajo riesgo y alcance reversible.
6. Crear la tarea Manus y verificar correlación durable.
7. Recibir evento firmado, verificarlo, persistirlo y comprobar que un duplicado no produce una segunda transición.
8. Reconciliar `task.detail` y paginar `task.listMessages`.
9. Validar el resultado estructurado y el contrato OpenAI mediante un runtime de prueba.
10. Provocar deliberadamente un estado `waiting` y un error para verificar escalamiento.
11. Verificar audit log completo y ausencia de secretos.
12. Verificar que no se modificó ARKI.
13. Revocar o retirar la configuración de prueba y conservar la evidencia.

No se hará esta validación en la fase de especificación y no se solicitarán credenciales como parte de ella.

## 19. Migration v0.1 → v0.2

La migración debe ser aditiva y reversible:

1. Mantener el cliente Manus v0.1 como referencia de contrato, pero encapsularlo en `Manus Adapter`.
2. Crear SQLite y migraciones iniciales sin conectar todavía tareas reales.
3. Introducir schemas y autenticación del Gateway antes de exponer rutas equivalentes.
4. Implementar policy engine y state machine sin autoejecución.
5. Implementar Webhook Receiver fail-closed y pruebas de firma/replay.
6. Añadir persistencia de comandos y eventos.
7. Añadir reconciliación Manus y paginación.
8. Añadir OpenAI Adapter detrás de una interfaz falsa.
9. Ejecutar pruebas de contrato y de frontera ARKI.
10. Habilitar una validación end-to-end aislada.
11. Migrar gradualmente rutas v0.1 a rutas v0.2 autenticadas.
12. Retirar la aceptación de webhooks sin clave y documentar la incompatibilidad deliberada.

No se copian archivos de ARKI ni se modifica el repositorio oficial del producto.

## 20. Implementation Sequence

### Phase 0 — Freeze and scaffolding

Crear la estructura de v0.2, migraciones, configuración segura y contratos. No conectar credenciales reales.

### Phase 1 — Persistence and policy

Implementar SQLite, repositorios, audit log, state machine y Decision Policy Engine. Validar todas las transiciones localmente.

### Phase 2 — Secure gateway and webhook

Implementar autenticación del Gateway, límites, errores estructurados, firma obligatoria, URL canónica y deduplicación transaccional.

### Phase 3 — Manus adapter and reconciliation

Encapsular endpoints Manus, añadir timeouts, retries bounded, paginación, status mapping y correlación.

### Phase 4 — Orchestrator

Conectar comandos, eventos, outbox y transiciones. Probar reinicios y entregas duplicadas.

### Phase 5 — OpenAI adapter contract

Implementar primero un adapter falso y validación de schema. Conectar el runtime OpenAI únicamente después de resolver la interfaz y autoridad del runtime.

### Phase 6 — Isolated E2E

Ejecutar el plan de validación end-to-end con credenciales de prueba y alcance reversible.

### Phase 7 — Controlled readiness review

Revisar seguridad, auditabilidad, límites, rollback y evidencia. Solo entonces considerar v0.2 lista para uso privado controlado.

## Unresolved Material Decisions

Las siguientes decisiones permanecen abiertas y deben resolverse antes de implementar el componente correspondiente:

1. **OpenAI runtime/interface:** qué runtime explícitamente soportado recibirá resultados y emitirá decisiones estructuradas. Esta especificación no asume que una conversación ChatGPT pueda ser despertada directamente.
2. **Topología de hosting:** proceso privado local, host persistente u otra opción autorizada. Debe conservar la frontera de red privada y cumplir HTTPS para webhooks.
3. **Gestión operativa de secretos:** variable de entorno protegida frente a un secrets manager disponible en el entorno de ejecución.
4. **Retención:** duración de payloads, mensajes y hashes en SQLite, respetando el principio de mínimo necesario.
5. **Política de expiración:** duración máxima de una decisión y tratamiento de tareas Manus abandonadas.
6. **Formato exacto de identidad de Yvan:** `owner_subject` que el runtime podrá autenticar y auditar.
7. **Contrato de revisión OpenAI:** modelo, límites de contexto y reglas de salida; no se deben seleccionar credenciales ni modelo en esta fase.

Estas son decisiones materiales, no deben inferirse durante la implementación.

## References

[1]: https://open.manus.ai/docs/v2/task.create "Manus API v2 task.create"
[2]: https://open.manus.ai/docs/v2/task.sendMessage "Manus API v2 task.sendMessage"
[3]: https://open.manus.ai/docs/v2/task.detail "Manus API v2 task.detail"
[4]: https://open.manus.ai/docs/v2/task.listMessages "Manus API v2 task.listMessages"
[5]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 Webhook Security"
[6]: https://open.manus.ai/docs/v2/webhook.publicKey "Manus API v2 webhook.publicKey"
[7]: https://open.manus.ai/docs/v2/webhook.create "Manus API v2 webhook.create"
[8]: https://open.manus.ai/docs/v2/authentication "Manus API v2 Authentication"
