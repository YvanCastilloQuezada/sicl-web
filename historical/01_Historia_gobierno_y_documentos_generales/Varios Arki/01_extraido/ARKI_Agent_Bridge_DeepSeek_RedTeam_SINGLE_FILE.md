# ARKI AGENT BRIDGE — DEEPSEEK RED TEAM — SINGLE MARKDOWN PACK

**Prepared for:** DeepSeek Independent Architecture Review / Red Team  
**Owner / Human Authority:** Yvan  
**Purpose:** One self-contained Markdown file because ZIP upload is not available.

---

## HOW TO USE THIS FILE

Read the entire document before issuing conclusions.

The sections below deliberately separate:
1. the exact review order;
2. v0.2 technical specification;
3. v0.2A implementation report;
4. v0.1 audit;
5. complete textual source extracted from the original v0.1 ZIP.

### Critical evidence limitation

The actual v0.2A source directory is **not included in the material currently available to ChatGPT**.  
The v0.2A implementation report is therefore **reported evidence**, not code inspection.

Do not silently upgrade `REPORTED` to `VERIFIED`.

---


---

# PART 1 — REVIEW ORDER


# DEEPSEEK REVIEW ORDER

PROJECT: ARKI Agent Bridge
ROLE: Independent Architecture Reviewer / Red Team

## CONTEXT

We are building private infrastructure whose purpose is to progressively eliminate Yvan's manual work as the messenger between ChatGPT/OpenAI and Manus.

Roles:
- Yvan = Human Authority
- ChatGPT = principal architect / supervisor / reconciler
- Manus = technical implementer
- DeepSeek = independent reviewer / Red Team

Your job is NOT to automatically agree with ChatGPT or Manus.
Your job is to find where the architecture, implementation claims, security model, state model, or automation strategy may be wrong.

## OBJECTIVE

Perform an adversarial and independent audit of ARKI Agent Bridge v0.2 before real credentials are connected.

## EVIDENCE RULE

This document includes the complete v0.1 source available to ChatGPT, the v0.1 audit, the v0.2 technical specification, and the v0.2A implementation report.

It does NOT include the actual v0.2A source-code directory.

Therefore:
- do not treat the v0.2A Implementation Report as equivalent to source inspection;
- mark source-level conclusions about v0.2A as `UNVERIFIED`;
- distinguish DOCUMENTED / REPORTED / CODE_EVIDENCE / VERIFIED / UNVERIFIED.

## CURRENT ARCHITECTURE

YVAN / HUMAN AUTHORITY
        ↓
DECISION POLICY ENGINE
        ↓
PERSISTENT ORCHESTRATOR
       ↙ ↘
OPENAI   MANUS
AGENT    ADAPTER
       ↘ ↙
SQLITE EVENT / AUDIT STORE

Principle:
AI OUTPUT ≠ EXECUTION AUTHORITY

Every action:
AI OUTPUT → SCHEMA VALIDATION → POLICY ENGINE → STATE MACHINE → AUTHORIZED ACTION

## TRY TO BREAK THE DESIGN

Investigate at minimum:
1. authority bypass
2. prompt injection
3. confused-deputy attacks
4. replay
5. duplicate execution
6. race conditions
7. invalid state transitions
8. crash/restart inconsistencies
9. partial transaction failures
10. SQLite concurrency
11. webhook spoofing
12. canonical URL weaknesses
13. secret leakage
14. audit-log manipulation
15. scope escalation
16. cross-decision contamination
17. cross-session contamination
18. Manus waiting-state mistakes
19. stopped/background-job mistakes
20. OpenAI structured-output failures
21. infinite OpenAI ⇄ Manus loops
22. runaway API/cost loops
23. contradictory agent outputs
24. stale decisions
25. abandoned tasks
26. unauthorized correction loops
27. evidence poisoning
28. malicious repository/file content
29. Human Authority bypass
30. anything overlooked.

## END-GOAL TEST

Determine whether this can actually achieve:

Yvan authorizes once
→ OpenAI Architect reasons
→ Manus executes
→ OpenAI Architect reviews
→ Manus corrects
→ repeat automatically
→ Yvan appears only for material decisions.

Identify every point where Yvan would still act manually as messenger.

## ABSENCE ANALYSIS

Ask:
- What component should exist but nobody designed?
- What state/event is missing?
- What authority is implicit?
- What if both agents are wrong?
- What if both agree but are wrong?
- What if Manus returns malicious/poisoned information?
- What if OpenAI returns syntactically valid but semantically dangerous action?
- What happens after 100 automatic cycles?
- What happens if Bridge restarts halfway through an operation?
- What if external API succeeds but local transaction fails?
- What prevents replay of an old authorized decision?
- What bounds cost, tokens, retries, corrections, elapsed time and cycles?

## SPECIAL: HUMAN AUTHORITY

Try to prove whether a non-human component can:
- create authority
- enlarge scope
- reinterpret a Decision Lock
- authorize a correction that is actually a new decision
- turn REVIEW_ALLOWED into de facto autonomous authority
- hide a material choice inside a technically valid next action.

## SPECIAL: LOOP SAFETY

Evaluate explicit bounds for:
- max automatic cycles/decision
- max corrections
- max API calls
- max token/cost budget
- max elapsed time
- max retry count
- repeated-identical-action detection
- no-progress detection
- circuit breaker
- owner escalation.

Treat a required missing bound as a finding.

## SPECIAL: PERSISTENCE / EXACTLY-ONCE ILLUSION

Analyze failure windows between:
1. commit local state
2. make external Manus/OpenAI request
3. external success
4. persist external result

Determine whether crash/restart can cause duplicate external side effects.
Do not assume SQLite transactions make external API calls atomic.

## DO NOT IMPLEMENT

Do not modify code.
Do not create another version.
Do not deploy.
Do not connect APIs.
Do not request credentials.
Do not modify ARKI.
Analysis only.

## CLASSIFICATION

Severity:
CRITICAL / HIGH / MEDIUM / LOW / INFORMATIONAL

Confidence:
CONFIRMED / LIKELY / POSSIBLE / UNVERIFIED

For every finding:
ID
SEVERITY
CONFIDENCE
COMPONENT
ATTACK/FAILURE SCENARIO
WHY IT MATTERS
EVIDENCE
CURRENT MITIGATION
WHY MITIGATION MAY FAIL
RECOMMENDED CORRECTION
TEST THAT WOULD PROVE THE FIX

## FINAL REPORT

OVERALL ARCHITECTURE ASSESSMENT:
EVIDENCE LIMITATIONS:
CRITICAL FINDINGS:
HIGH FINDINGS:
MEDIUM FINDINGS:
LOW FINDINGS:
MISSING COMPONENTS:
HUMAN AUTHORITY WEAKNESSES:
OPENAI ↔ MANUS LOOP RISKS:
PERSISTENCE / STATE RISKS:
SECURITY RISKS:
COST / RUNAWAY LOOP RISKS:
WHAT CHATGPT/MANUS MAY HAVE MISSED:
REQUIRED CHANGES BEFORE REAL E2E:
REQUIRED TESTS BEFORE REAL E2E:
CAN V0.2B PROCEED IN PARALLEL: YES / NO + WHY
READY FOR REAL CREDENTIALS: YES / NO + WHY
READY FOR REAL E2E: YES / NO + WHY

Do not implement corrections. Stop after the report.


---

# PART 2 — ARKI AGENT BRIDGE v0.2 TECHNICAL SPECIFICATION

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


---

# PART 3 — v0.2A IMPLEMENTATION REPORT

# ARKI Agent Bridge v0.2A — Implementation Report

**Orden:** `AB-V02A-IMPLEMENT-001`  
**Resultado:** implementación autorizada de fases 0–4 completada  
**Fecha:** 2026-09-25

## VERSION:

`0.2.0-alpha.1` — v0.2A.

## FILES CREATED:

- `README.md`
- `package.json`
- `migrations/001_initial.sql`
- `src/store.mjs`
- `src/state-machine.mjs`
- `src/policy.mjs`
- `src/schemas.mjs`
- `src/security.mjs`
- `src/manus.mjs`
- `src/orchestrator.mjs`
- `src/fake-openai.mjs`
- `src/server.mjs`
- `tests/policy-state.test.mjs`
- `tests/store.test.mjs`
- `tests/security.test.mjs`
- `tests/manus-orchestrator.test.mjs`
- `tests/server.test.mjs`
- `tests/requirements.test.mjs`
- `tests/no-touch.test.mjs`

## FILES MODIFIED:

Ninguno fuera del directorio aislado `bridge-v0.2a/`. No se modificó ARKI, el ZIP de v0.1 ni la especificación aprobada.

## DATABASE:

SQLite durable mediante `node:sqlite`, con WAL y foreign keys. Se implementaron tablas para decisiones, tareas, eventos, mensajes, transiciones, escalaciones, audit log e idempotencia. La migración crea nueve tablas incluyendo `schema_migrations`.

## MIGRATIONS:

`migrations/001_initial.sql` implementada y ejecutada en pruebas sobre bases nuevas y existentes. Se verificó recuperación después de cerrar y reabrir SQLite.

## STATE MACHINE:

Implementados los estados `CREATED`, `AUTHORIZED`, `DISPATCHED`, `RUNNING`, `WAITING_EXTERNAL`, `RESULT_RECEIVED`, `REVIEW_REQUIRED`, `CORRECTION_REQUIRED`, `HUMAN_DECISION_REQUIRED`, `COMPLETED`, `FAILED` y `CANCELLED`. Las transiciones ilegales son rechazadas.

## POLICY ENGINE:

Implementadas las clases `AUTO_ALLOWED`, `REVIEW_ALLOWED`, `HUMAN_REQUIRED` y `PROHIBITED`, con escalamiento para categorías materiales y cambios de scope.

## GATEWAY SECURITY:

Gateway privado autenticado mediante `BRIDGE_INTERNAL_SECRET`, con validación de schemas, límite de cuerpo de 128 KiB, límite de mensajes de 16 KiB, idempotency keys y errores públicos estructurados. Sin autenticación, el Gateway responde rechazo.

## WEBHOOK SECURITY:

Implementado fail-closed. Ausencia de clave pública, firma inválida, timestamp expirado, URL no HTTPS o URL canónica inválida producen rechazo. La firma se verifica mediante RSA-SHA256 sobre `{timestamp}.{canonical_url}.{sha256_hex(body)}`.

## IDEMPOTENCY:

Implementada persistencia SQLite de `idempotency_keys`, conflictos por reutilización con payload diferente y deduplicación de webhooks por `external_event_id` o hash de payload. Los eventos duplicados no producen un segundo efecto material.

## MANUS ADAPTER:

Implementados `task.create`, `task.sendMessage`, `task.detail`, `task.listMessages`, `webhook.create` y `webhook.publicKey`, junto con timeout, retries acotados, backoff exponencial, manejo de 429/5xx y paginación por cursor.

## ORCHESTRATOR:

Implementada la correlación `decision_id ↔ task_id ↔ event_id ↔ correlation_id`, creación y autorización de decisiones, dispatch, reconciliación Manus, persistencia de mensajes, transiciones y recuperación desde SQLite. `stopped` no se trata automáticamente como final cuando los trabajos de fondo están activos o desconocidos.

## FAKE OPENAI ADAPTER:

Implementado únicamente para contratos y pruebas. No contiene cliente real, runtime real, modelo ni llamada OpenAI.

## AUDIT LOG:

Implementado audit log append-only a nivel de aplicación. Registra actores, acciones, objetos, decisiones, hashes, correlaciones y transiciones. La redacción evita almacenar valores de API keys, tokens, autorizaciones, secretos, cookies o contraseñas.

## TESTS:

`npm test` pasó:

```text
ℹ tests 16
ℹ pass 16
ℹ fail 0
```

También pasó `node --check` para todos los módulos fuente y tests.

## SECURITY TESTS:

Pasaron las pruebas de autenticación ausente/inválida, fail-closed sin public key, firma válida, firma inválida, timestamp expirado, URL no canónica, límite de payload, redacción de secretos, replay y deduplicación.

## RESTART RECOVERY:

PASS. La suite cierra y reabre SQLite y verifica que decisiones, tareas, audit log e idempotency keys se conservan.

## ARKI NO-TOUCH:

PASS. La prueba de frontera no encuentra rutas de producto ARKI ni operaciones de mutación ARKI en el código del Bridge. La implementación está físicamente contenida en `bridge-v0.2a/`.

## REAL MANUS CALLS:

`0`. Se utilizaron únicamente fakes. No se registró webhook real y no se ejecutó ninguna tarea Manus real.

## REAL OPENAI CALLS:

`0`. Solo se utilizó `FakeOpenAIAdapter` en pruebas de contrato.

## CREDENTIALS USED:

Ninguna. No se solicitaron, leyeron ni expusieron credenciales. Las pruebas usan secretos sintéticos y claves RSA efímeras generadas dentro del proceso de test.

## BLOCKERS:

No hay bloqueadores para el alcance v0.2A autorizado. La API `node:sqlite` emite una advertencia experimental en Node 22.13.0; el comportamiento está cubierto por la suite, pero deberá revisarse al fijar el runtime operativo.

## UNRESOLVED:

El runtime OpenAI real, modelo, API key, conversación o interfaz de retorno permanecen deliberadamente diferidos. La validación E2E real, el webhook público y el despliegue permanecen fuera del alcance autorizado de v0.2A.

## READY FOR V0.2B:

**NO.** v0.2A cumple su criterio de aceptación, pero no se debe avanzar a v0.2B hasta que el propietario autorice la fase siguiente y se cierre explícitamente el runtime OpenAI y el plan E2E. Esta orden termina aquí.


---

# PART 4 — v0.1 TECHNICAL AUDIT

# Auditoría técnica de ARKI Agent Bridge v0.1

**Fecha de auditoría:** 2026-09-25  
**Alcance:** contenido completo de `arki-agent-bridge-v0.1.zip`, extraído en un directorio temporal.  
**Límite aplicado:** no se modificó ARKI, no se modificó el ZIP, no se publicaron servicios y no se usaron credenciales.

## Conclusión ejecutiva

La semilla implementa una capa mínima para construir una orden gobernada, crear una tarea Manus, enviar mensajes posteriores y recuperar detalle e historial. También contiene la rutina criptográfica compatible con la documentación oficial de webhooks de Manus. Sin embargo, la integración no constituye todavía una comunicación bidireccional autónoma ChatGPT/OpenAI ⇄ Manus.

El único test existente pasa, y todos los módulos revisados tienen sintaxis válida. Esa evidencia no demuestra un flujo real contra Manus: no se ejecutó una prueba end-to-end porque el archivo no contiene credenciales y no se solicitaron. Tampoco existe persistencia, cola, audit log, correlación duradera de eventos, deduplicación de webhooks, autenticación de los endpoints entrantes ni un runtime del lado OpenAI/ChatGPT capaz de recibir resultados y decidir el siguiente paso.

El riesgo más importante observado es de seguridad: cuando `MANUS_WEBHOOK_PUBLIC_KEY_PEM` no está configurada, el servidor omite completamente la verificación y acepta cualquier JSON en `/webhooks/manus`. La variable aparece como opcional en `.env.example`, por lo que una configuración incompleta puede convertir el receptor en un endpoint de confianza falsa.

## BRIDGE VERSION:

**v0.1.0**, según `package.json` y la respuesta de `/health`.

## FILES REVIEWED:

Se revisaron los ocho archivos presentes en el archivo comprimido:

| Archivo | Contenido revisado |
|---|---|
| `README.md` | Alcance, límites, seguridad declarada, rutas y frontera v0.1/v0.2 |
| `package.json` | Metadatos, módulo ESM, scripts y runtime requerido |
| `.env.example` | Variables de API, puerto y verificación de webhooks |
| `src/manus.mjs` | Cliente HTTP para Manus API v2 |
| `src/protocol.mjs` | Construcción de órdenes y texto de DECISION LOCK |
| `src/server.mjs` | Servidor HTTP, rutas Manus y receptor de webhooks |
| `src/webhook-security.mjs` | Verificación RSA-SHA256 y ventana temporal |
| `tests/protocol.test.mjs` | Test unitario de `buildOrder` |

No hay `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, base de datos, migraciones, archivos de despliegue, configuración de CI, documentación OpenAI, servidor MCP, worker, cola o almacenamiento persistente.

## ARCHITECTURE FOUND:

La arquitectura encontrada es un servidor HTTP Node.js sin framework y sin estado persistente. El proceso expone `/health`, tres operaciones de tarea bajo `/manus/tasks`, y `/webhooks/manus`. Cada operación crea un `ManusClient` y llama directamente a `https://api.manus.ai/v2` mediante `fetch`.

El flujo previsto es lineal:

```text
Cliente externo autorizado por la red
        |
        v
Bridge HTTP -- buildOrder --> Manus API v2 -- tarea asíncrona --> Manus webhook o consulta
        |
        +--> devuelve la respuesta HTTP al llamador
```

El webhook solo analiza el evento y devuelve un resumen. No lo guarda, no publica el resultado hacia OpenAI/ChatGPT y no crea un siguiente mensaje. Por tanto, el lado ChatGPT/OpenAI no está incluido en el artefacto.

## IMPLEMENTED:

Las siguientes capacidades tienen código presente, pero no deben interpretarse como validación end-to-end:

1. **Cliente Manus API v2 — IMPLEMENTED.** `src/manus.mjs` define llamadas a `task.create`, `task.sendMessage`, `task.listMessages`, `task.detail`, `webhook.create` y `webhook.publicKey`, usando `x-manus-api-key` desde `MANUS_API_KEY`.
2. **Creación de tareas — IMPLEMENTED.** `POST /manus/tasks` llama a `buildOrder` y a `task.create`. Pasa `project_id` y, si están presentes, opciones de conectores y skills.
3. **Mensajes a tareas existentes — IMPLEMENTED.** `POST /manus/tasks/:task_id/messages` llama a `task.sendMessage` con texto.
4. **Recuperación básica — IMPLEMENTED.** `GET /manus/tasks/:task_id` solicita `task.detail` y `task.listMessages` y devuelve ambos resultados juntos.
5. **Protocolo textual de órdenes — IMPLEMENTED.** `buildOrder` exige `decision_id`, `project`, `context`, `why`, `objective`, `execution` y `acceptance`, y serializa además `preserve`, `do_not_touch` y `validation` cuando existen.
6. **DECISION LOCK textual — IMPLEMENTED.** La orden contiene instrucciones explícitas para no reconfirmar la misma decisión y detenerse ante decisiones nuevas de tipo destructivo, de seguridad, de datos, arquitectónico o fuera de alcance.
7. **Verificación criptográfica compatible — IMPLEMENTED.** `verifyManusWebhook` reconstruye `{timestamp}.{url}.{sha256_hex(body)}` y usa RSA-SHA256 con la firma en Base64.
8. **Gestión básica de secretos — IMPLEMENTED.** El código no contiene una clave; la obtiene del entorno y `.env.example` deja el valor vacío.
9. **Endpoint de salud — IMPLEMENTED.** `/health` devuelve versión y estado básico.

## VERIFIED:

La siguiente evidencia se comprobó directamente durante esta auditoría:

1. **Build/test del protocolo — VERIFIED.** `npm test` pasó: 1 test, 1 aprobado, 0 fallos.
2. **Sintaxis — VERIFIED.** `node --check` pasó para todos los módulos de `src/` y `tests/`.
3. **Inicio y health — VERIFIED.** El servidor inició en Node.js y `GET /health` respondió HTTP 200 con `version: "0.1.0"`.
4. **Recepción sin firma cuando falta la clave — VERIFIED.** Una petición JSON válida a `/webhooks/manus` respondió HTTP 200 sin `MANUS_WEBHOOK_PUBLIC_KEY_PEM`. Esto confirma el riesgo descrito en `SECURITY ISSUES`.
5. **Contrato documental básico — VERIFIED por comparación estática.** Las rutas y el encabezado de API usados en el cliente coinciden con la documentación oficial consultada para `task.create`, `task.sendMessage`, `task.detail`, `task.listMessages`, `webhook.create` y `webhook.publicKey` [1] [2] [3] [4] [5] [6].

No se verificó una llamada real contra Manus, una firma válida producida por Manus ni una entrega pública de webhook.

## MISSING:

1. **Orquestador del lado OpenAI/ChatGPT — MISSING.** No hay proceso que reciba el resultado Manus, lo entregue a un modelo OpenAI o active el siguiente ciclo.
2. **Canal de retorno — MISSING.** El webhook no envía datos a ChatGPT/OpenAI, a un endpoint de conversación, a una cola ni a un sistema de mensajes.
3. **Persistencia — MISSING.** No hay base de datos, almacenamiento de tareas, estado de decisiones, historial de eventos ni recuperación tras reinicio.
4. **Audit log — MISSING.** No se guardan la orden original, la identidad de quien la emitió, respuestas, eventos, hashes, timestamps ni transiciones de estado.
5. **Idempotencia y deduplicación — MISSING.** No hay `event_id` almacenado, clave de idempotencia, tabla de eventos procesados ni protección contra procesamiento duplicado.
6. **Autenticación del Bridge — MISSING.** Las rutas `/manus/tasks` no exigen autenticación propia. Cualquier proceso que alcance el puerto puede intentar crear tareas, enviar mensajes o leer tareas.
7. **Enforcement de HUMAN AUTHORITY — MISSING.** `decision_id` y DECISION LOCK son texto de prompt. No existe una política ejecutable que valide propietario, alcance, permisos, estado de decisión o escalamiento.
8. **Validación robusta de entradas — MISSING.** No se valida esquema, tipos, longitud, tamaño máximo del cuerpo, formato de `task_id` ni contenido de `body.content`.
9. **Manejo de estados Manus — MISSING.** No se interpreta `running`, `stopped`, `waiting` o `error`, ni se distingue una pregunta del agente de una confirmación de acción. La documentación de `task.listMessages` exige esa distinción [4].
10. **Paginar historial — MISSING.** `listMessages` fija solo `limit` y no usa `order`, `cursor`, `has_more` ni `next_cursor`.
11. **Entrega fiable — MISSING.** No hay reintentos con backoff, timeouts, cancelación, circuit breaker, cola ni límite de concurrencia.
12. **Operación segura — MISSING.** No hay TLS propio, autorización por ruta, rate limiting, límites de payload, logs estructurados ni métricas.
13. **Pruebas de seguridad e integración — MISSING.** Solo hay un test de texto; faltan pruebas de firma, timestamp, URL canónica, replay, entradas inválidas, autenticación, errores HTTP y ciclo completo.
14. **Configuración de webhook completa — MISSING.** Aunque existe `createWebhook` en el cliente, no hay ruta o procedimiento operativo que registre el endpoint, cachee la clave pública y valide la configuración.
15. **Contrato estructurado de resultados — MISSING.** No se usa `structured_output_schema` ni un esquema estable para que el lado OpenAI consuma resultados sin depender de texto libre.

## BLOCKED:

1. **Prueba end-to-end contra Manus — BLOCKED.** No se realizó porque no hay credenciales en el archivo y no se solicitaron, conforme al alcance de la auditoría.
2. **Prueba real de entrega de webhook — BLOCKED.** El servidor de esta auditoría solo estuvo disponible localmente; no se registró una URL pública HTTPS ni se conectó a Manus.
3. **Automatización ChatGPT/OpenAI específica — BLOCKED por ausencia del componente.** No puede verificarse ni ejecutarse una continuación automática porque v0.1 no incluye runtime, credenciales, endpoint de retorno ni política de autoridad del lado OpenAI.

## SECURITY ISSUES:

### Severidad alta

- **Verificación opcional de webhooks.** En `src/server.mjs`, si `MANUS_WEBHOOK_PUBLIC_KEY_PEM` está vacía, el bloque de verificación se omite y el JSON se acepta. La firma debe ser obligatoria en un receptor de producción. La documentación oficial de Manus describe la firma RSA-SHA256 y la comprobación de timestamp de cinco minutos [5].
- **Endpoints entrantes sin autenticación.** El Bridge no protege creación de tareas, mensajes ni lectura de resultados. La API key saliente no autentica al llamador del Bridge.
- **Ausencia de control de replay persistente.** La ventana de cinco minutos reduce repeticiones antiguas, pero el mismo evento firmado puede repetirse dentro de la ventana porque no se registra ningún identificador ni hash procesado.

### Severidad media

- **Sin límites de cuerpo ni rate limiting.** `read` acumula todo el cuerpo en memoria y el proceso no limita tamaño, frecuencia ni concurrencia.
- **Errores internos expuestos.** El catch global devuelve `e.message` directamente al cliente. Esto puede revelar detalles de validación, red o proveedores.
- **Errores de API normalizados como HTTP 500.** No se preservan códigos de autenticación, rate limit, conflicto o error transitorio, lo que dificulta reintentos correctos.
- **URL firmada dependiente de configuración.** La firma utiliza `MANUS_WEBHOOK_PUBLIC_URL` si existe, y si no construye una URL local con `http://` y el encabezado `Host`. Detrás de un proxy HTTPS, una configuración incorrecta puede rechazar firmas válidas o aceptar una ruta operacionalmente mal definida.
- **No hay protección de acceso por proyecto o tarea.** Un `task_id` no se vincula a un propietario, `decision_id` o contexto almacenado por el Bridge.

### Aspectos positivos comprobados

- La clave Manus no está incluida en el ZIP.
- El código usa el cuerpo crudo para verificar la firma antes de parsear el JSON.
- El control temporal de cinco minutos coincide con la guía oficial de webhooks [5].
- El README prohíbe comprometer `MANUS_API_KEY` y declara que no existe endpoint de deploy/publicación.

## MANUS API INTEGRATION STATUS:

**IMPLEMENTED**, con alcance limitado. El adaptador usa el endpoint base correcto y las operaciones básicas documentadas. La cobertura es suficiente para crear una tarea, continuar una conversación y leer estado/historial. No hay evidencia de ejecución real contra Manus. La recuperación tampoco implementa el ciclo recomendado completo: no pagina mensajes, no interpreta estados de espera, no maneja confirmaciones de acciones y no obtiene ni resuelve de forma estructurada los resultados.

La documentación actual indica que `task.detail` puede devolver `stopped` mientras continúan trabajos en segundo plano y que la ausencia de `has_running_background_jobs` no debe tratarse como `false` [3]. v0.1 no contiene esa lógica de decisión.

## WEBHOOK STATUS:

**IMPLEMENTED** como receptor HTTP y como rutina de firma, pero **MISSING** como integración operativa segura y durable. El endpoint devuelve un resumen del evento, pero no persiste ni dispara ninguna acción. La verificación criptográfica está condicionada a una variable opcional; por eso la configuración predeterminada no es segura. La protección de replay es parcial: existe ventana temporal, pero falta deduplicación persistente.

## OPENAI/CHATGPT SIDE STATUS:

**MISSING.** No existe código OpenAI, cliente de modelo, worker, endpoint de retorno, conversación asociada, servidor MCP, cola ni runtime persistente. El propio README reconoce que la conversación específica de ChatGPT no puede despertarse desde un webhook y que esa capacidad quedó fuera de v0.1.

## HUMAN AUTHORITY STATUS:

**IMPLEMENTED** únicamente como texto de protocolo: la orden transporta `decision_id`, alcance, preservación, exclusiones y DECISION LOCK.  
**MISSING** como control técnico: no se autentica a Yvan, no se firma la decisión, no se almacena el mandato, no se comprueba que un evento corresponda a la decisión original y no existe máquina de estados para escalar solo las categorías materiales.

Por ello, el Bridge actualmente puede transmitir una instrucción con intención de autoridad, pero no puede demostrar técnicamente quién la autorizó ni impedir que un cliente de red inyecte otra.

## WHAT CURRENTLY REQUIRES YVAN:

Yvan todavía debe copiar o transmitir manualmente la orden al entorno Manus y devolver manualmente el resultado a ChatGPT/OpenAI. También tendría que intervenir para responder preguntas, confirmar acciones que Manus marque como `waiting`, revisar errores, decidir ante cambios de alcance y aportar las credenciales o la configuración pública necesarias para cualquier prueba real.

El Bridge reduce parte de la escritura manual si un cliente externo ya puede llamar a sus endpoints, pero v0.1 no elimina el papel de mensajero. Tampoco puede sustituir la autoridad humana en decisiones materiales, y no debería hacerlo.

## WHAT CAN ALREADY BE AUTOMATED:

**IMPLEMENTED:** construir una orden con formato gobernado; enviarla a `task.create`; enviar un seguimiento textual a una tarea conocida; consultar detalle e historial; recibir y verificar una firma cuando la clave está correctamente configurada.

**MISSING:** seleccionar automáticamente la siguiente acción, persistir el estado, entregar resultados a ChatGPT/OpenAI, contestar preguntas de Manus con reglas autorizadas, deduplicar webhooks y producir evidencia auditable. Esas ausencias impiden afirmar que exista automatización bidireccional.

## RECOMMENDED V0.2 ARCHITECTURE:

La v0.2 debería separar explícitamente cuatro componentes:

1. **Gateway autenticado del Bridge.** Debe aceptar únicamente llamadas autenticadas por el runtime autorizado del lado OpenAI y aplicar validación de esquema, límites de tamaño, rate limiting y autorización por tarea/proyecto.
2. **Orquestador persistente.** Debe mantener una máquina de estados por `decision_id` y `task_id`. Debe crear tareas, recibir eventos, consultar el estado definitivo cuando corresponda, paginar mensajes y decidir si el siguiente paso es automático o requiere HUMAN_DECISION_REQUIRED.
3. **Almacén transaccional y audit log.** Debe guardar órdenes inmutables, identidad de autoridad, eventos recibidos, hashes de payload, deduplicación, respuestas, resultados, errores, timestamps y transiciones. Los eventos de webhook deben procesarse de forma idempotente.
4. **Adaptador OpenAI/ChatGPT.** Debe convertir resultados Manus a un contrato estructurado y devolverlos al runtime autorizado del lado OpenAI. No debe intentar “despertar” una conversación sin una interfaz o runtime explícitamente soportado.

El receptor Manus debe requerir siempre firma válida, usar una clave pública cacheada con procedimiento de rotación, verificar timestamp, registrar un identificador o hash de evento y devolver 2xx solo después de aceptar el evento de manera segura. Los estados `waiting`, `stopped`, `error` y los trabajos de fondo deben tratarse según el contrato de Manus, sin confirmar automáticamente acciones no reconocidas [4].

La frontera de seguridad debe mantener al Bridge desacoplado de ARKI. El Bridge puede transportar `project` y `do_not_touch`, pero no debe copiar ni modificar código de ARKI ni convertirse en fuente de verdad del producto.

## EXACT NEXT STEP:

Antes de implementar v0.2, producir una especificación técnica bloqueada por decisiones que defina: el runtime autorizado del lado OpenAI, el contrato de retorno, el modelo de persistencia, la política ejecutable de HUMAN AUTHORITY, el esquema de autenticación entre componentes, la semántica de idempotencia y las categorías exactas de escalamiento. Después de esa especificación, implementar primero el almacén de estado y el receptor de webhook seguro con pruebas; dejar la conexión real y las credenciales para una validación end-to-end separada.

## READY TO BUILD V0.2:

**NO.** La semilla es una base útil para v0.2, pero faltan decisiones arquitectónicas materiales y controles de seguridad fundamentales. No se recomienda iniciar una implementación autónoma sobre la base actual sin cerrar esas definiciones y sin convertir la verificación de firma, autenticación del Bridge, persistencia y audit log en requisitos obligatorios.

## References

[1]: https://open.manus.ai/docs/v2/task.create "Manus API v2 task.create"
[2]: https://open.manus.ai/docs/v2/task.sendMessage "Manus API v2 task.sendMessage"
[3]: https://open.manus.ai/docs/v2/task.detail "Manus API v2 task.detail"
[4]: https://open.manus.ai/docs/v2/task.listMessages "Manus API v2 task.listMessages"
[5]: https://open.manus.ai/docs/v2/webhooks-security "Manus API v2 Webhook Security"
[6]: https://open.manus.ai/docs/v2/webhook.publicKey "Manus API v2 webhook.publicKey"
[7]: https://open.manus.ai/docs/v2/webhook.create "Manus API v2 webhook.create"
[8]: https://open.manus.ai/docs/v2/authentication "Manus API v2 Authentication"


---

# PART 5 — COMPLETE TEXTUAL SOURCE FROM ORIGINAL v0.1 ZIP


### FILE: `arki-agent-bridge-v0.1/.env.example`

```text
MANUS_API_KEY=
BRIDGE_PORT=8787
MANUS_WEBHOOK_PUBLIC_URL=
# Optional: PEM public key returned by Manus webhook.publicKey for signature verification.
MANUS_WEBHOOK_PUBLIC_KEY_PEM=
```


### FILE: `arki-agent-bridge-v0.1/README.md`

```markdown
# ARKI Agent Bridge v0.1 (private/internal)

Temporary, detachable bridge for sending governed ARKI work orders to Manus API v2. It does **not** modify ARKI and contains no credentials.

## Security
- Never commit `MANUS_API_KEY`.
- Manus API keys provide broad account access; keep the key only in an environment variable/secrets manager.
- Webhook signature verification is supported when `MANUS_WEBHOOK_PUBLIC_KEY_PEM` is configured.
- No deploy/publish endpoint is exposed by this bridge.

## Start
1. Copy `.env.example` values into your local secret environment (do not paste the key into source code).
2. `MANUS_API_KEY=... node src/server.mjs`
3. `GET http://localhost:8787/health`

## Send governed task
POST `/manus/tasks` with JSON fields:
`decision_id, project, context, why, objective, execution, preserve, do_not_touch, acceptance, validation`.

## Follow up / inspect
- POST `/manus/tasks/:task_id/messages` body `{ "content": "..." }`
- GET `/manus/tasks/:task_id`

## Webhook
POST `/webhooks/manus`. For real Manus delivery this endpoint must be public HTTPS and registered with Manus. Configure the Manus public key for RSA-SHA256 verification.

## Important v0.1 boundary
This bridge automates **ChatGPT-authored order → Manus task → result retrieval/webhook reception**. It does not make this specific ChatGPT conversation wake up from an external webhook. Fully unattended ChatGPT↔Manus cycles require a persistent orchestrator/agent runtime on the ChatGPT/OpenAI side. That is phase v0.2, not silently claimed here.
```


### FILE: `arki-agent-bridge-v0.1/package.json`

```json
{
  "name": "arki-agent-bridge",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {"start":"node src/server.mjs","test":"node --test"},
  "engines":{"node":">=20"}
}
```


### FILE: `arki-agent-bridge-v0.1/src/manus.mjs`

```javascript
const BASE = 'https://api.manus.ai/v2';

export class ManusClient {
  constructor(apiKey = process.env.MANUS_API_KEY) {
    if (!apiKey) throw new Error('MANUS_API_KEY is required');
    this.apiKey = apiKey;
  }
  async request(path, {method='GET', body, query}={}) {
    const url = new URL(BASE + path);
    if (query) for (const [k,v] of Object.entries(query)) if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    const res = await fetch(url, {
      method,
      headers: {'x-manus-api-key': this.apiKey, ...(body ? {'content-type':'application/json'} : {})},
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(`Manus API ${res.status}: ${data?.error?.message || JSON.stringify(data)}`);
    return data;
  }
  createTask(content, options={}) {
    const message = {content};
    if (options.connectors) message.connectors = options.connectors;
    if (options.enable_skills) message.enable_skills = options.enable_skills;
    if (options.force_skills) message.force_skills = options.force_skills;
    const body = {message};
    if (options.project_id) body.project_id = options.project_id;
    return this.request('/task.create', {method:'POST', body});
  }
  sendMessage(task_id, content) { return this.request('/task.sendMessage', {method:'POST', body:{task_id, message:{content}}}); }
  listMessages(task_id, limit=50) { return this.request('/task.listMessages', {query:{task_id, limit}}); }
  detail(task_id) { return this.request('/task.detail', {query:{task_id}}); }
  createWebhook(url) { return this.request('/webhook.create', {method:'POST', body:{url}}); }
  webhookPublicKey() { return this.request('/webhook.publicKey'); }
}
```


### FILE: `arki-agent-bridge-v0.1/src/protocol.mjs`

```javascript
export function buildOrder(o) {
  const req = ['decision_id','project','context','why','objective','execution','acceptance'];
  for (const k of req) if (!o[k]) throw new Error(`Missing ${k}`);
  return `ARKI INTERNAL BRIDGE\nDECISION_ID: ${o.decision_id}\nPROJECT: ${o.project}\n\nCONTEXT\n${o.context}\n\nWHY\n${o.why}\n\nOBJECTIVE\n${o.objective}\n\nEXECUTION\n${o.execution}\n\nPRESERVE\n${o.preserve || 'Only what is outside the authorized scope.'}\n\nDO NOT TOUCH\n${o.do_not_touch || 'No scope expansion.'}\n\nACCEPTANCE CRITERIA\n${o.acceptance}\n\nVALIDATION\n${o.validation || 'Return concrete evidence, tests and blockers.'}\n\nDECISION LOCK\nExecute within this scope without reconfirming the same owner decision. Stop only for a materially new destructive, security, data, architectural, or out-of-scope decision.\n\nREPORT\nReturn: STATUS, ROOT_CAUSE/RESULT, FILES_CHANGED, TESTS, EVIDENCE, BLOCKERS, HUMAN_DECISION_REQUIRED.`;
}
```


### FILE: `arki-agent-bridge-v0.1/src/server.mjs`

```javascript
import http from 'node:http';
import {ManusClient} from './manus.mjs';
import {buildOrder} from './protocol.mjs';
import {verifyManusWebhook} from './webhook-security.mjs';

const port = Number(process.env.BRIDGE_PORT || 8787);
const json = (res, code, data) => { res.writeHead(code, {'content-type':'application/json'}); res.end(JSON.stringify(data,null,2)); };
const read = req => new Promise((resolve,reject)=>{let b=[];req.on('data',c=>b.push(c));req.on('end',()=>resolve(Buffer.concat(b)));req.on('error',reject)});

http.createServer(async (req,res)=>{
  try {
    if (req.method==='GET' && req.url==='/health') return json(res,200,{ok:true,bridge:'ARKI Agent Bridge',version:'0.1.0'});
    if (req.method==='POST' && req.url==='/manus/tasks') {
      const body=JSON.parse((await read(req)).toString('utf8'));
      const client=new ManusClient();
      return json(res,200,await client.createTask(buildOrder(body), body));
    }
    if (req.method==='POST' && req.url?.startsWith('/manus/tasks/') && req.url.endsWith('/messages')) {
      const taskId=req.url.split('/')[3]; const body=JSON.parse((await read(req)).toString('utf8'));
      return json(res,200,await new ManusClient().sendMessage(taskId, body.content));
    }
    if (req.method==='GET' && req.url?.startsWith('/manus/tasks/')) {
      const taskId=req.url.split('/')[3]; const c=new ManusClient();
      return json(res,200,{detail:await c.detail(taskId),messages:await c.listMessages(taskId)});
    }
    if (req.method==='POST' && req.url==='/webhooks/manus') {
      const raw=await read(req); const publicKey=process.env.MANUS_WEBHOOK_PUBLIC_KEY_PEM;
      if (publicKey) {
        const external=process.env.MANUS_WEBHOOK_PUBLIC_URL || `http://${req.headers.host}${req.url}`;
        const ok=verifyManusWebhook({rawBody:raw,url:external,timestamp:req.headers['x-webhook-timestamp'],signature:req.headers['x-webhook-signature'],publicKeyPem:publicKey});
        if (!ok) return json(res,401,{ok:false,error:'invalid webhook signature'});
      }
      const event=JSON.parse(raw.toString('utf8'));
      // v0.1 deliberately records/returns the event; autonomous ChatGPT continuation requires a persistent orchestrator integration.
      return json(res,200,{ok:true,received:event.event_type,task_id:event?.task_detail?.task_id,stop_reason:event?.task_detail?.stop_reason});
    }
    json(res,404,{ok:false,error:'not found'});
  } catch(e) { json(res,500,{ok:false,error:e.message}); }
}).listen(port,()=>console.log(`ARKI Agent Bridge v0.1 listening on ${port}`));
```


### FILE: `arki-agent-bridge-v0.1/src/webhook-security.mjs`

```javascript
import crypto from 'node:crypto';
export function verifyManusWebhook({rawBody, url, timestamp, signature, publicKeyPem, now=Date.now()}) {
  if (!timestamp || !signature || !publicKeyPem) return false;
  const ts = Number(timestamp);
  if (!Number.isFinite(ts) || Math.abs(Math.floor(now/1000)-ts) > 300) return false;
  const hash = crypto.createHash('sha256').update(rawBody).digest('hex');
  const signed = `${timestamp}.${url}.${hash}`;
  return crypto.verify('RSA-SHA256', Buffer.from(signed), publicKeyPem, Buffer.from(signature, 'base64'));
}
```


### FILE: `arki-agent-bridge-v0.1/tests/protocol.test.mjs`

```javascript
import test from 'node:test'; import assert from 'node:assert/strict'; import {buildOrder} from '../src/protocol.mjs';
test('buildOrder includes decision lock and why',()=>{const s=buildOrder({decision_id:'D1',project:'ARKI',context:'c',why:'w',objective:'o',execution:'e',acceptance:'a'});assert.match(s,/DECISION LOCK/);assert.match(s,/WHY\nw/);});
```


---

# END OF EVIDENCE PACK

DeepSeek: now perform the requested independent adversarial review. Do not implement.
