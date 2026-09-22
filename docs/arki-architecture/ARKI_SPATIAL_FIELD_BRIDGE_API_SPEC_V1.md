# ARKI Spatial Field Bridge — Especificación técnica de API

**Versión:** 1.0.0-draft  
**Estado:** `DESIGN_READY_FOR_IMPLEMENTATION`  
**Fecha:** 2026-09-21  
**Sistemas:** Miluquita · ARKI · SICL Core  
**Contrato:** `ARKI-SFB-1.0`

## 1. Propósito y decisión arquitectónica

El **ARKI Spatial Field Bridge** es una API de integración que conecta una aplicación de realidad aumentada de campo, Miluquita, con la inteligencia arquitectónica de ARKI y el estado canónico de SICL Core.

La API no crea un segundo cerebro, no duplica el Project State y no permite que un dispositivo móvil publique decisiones por sí solo. Su función es transportar de forma autenticada, versionada y trazable cuatro clases de información: encargos conversacionales, paquetes espaciales, observaciones de campo y propuestas de cambio.

La regla fundamental es:

> **Miluquita captura y visualiza. ARKI interpreta y propone. SICL Core persiste, versiona y autoriza.**

La integración se diseña bajo estas invariantes:

1. Existe un único estado canónico por proyecto.
2. El cliente móvil es un entorno no confiable.
3. Ningún dato capturado por cámara, GPS, sensores o voz se convierte automáticamente en un hecho confirmado.
4. Una observación de campo no es una decisión de diseño.
5. Una propuesta de ARKI no es una decisión aprobada.
6. `CREATE`, `PROPOSE`, `REVIEW` y `PUBLISH` son estados distintos.
7. La pérdida de autenticación, integridad, versión o contrato produce rechazo explícito y no una escritura parcial.
8. La geometría AR local puede continuar en modo degradado, pero la persistencia canónica queda bloqueada si SICL Core no está disponible.

## 2. Límites entre sistemas

| Sistema | Responsabilidad | No puede hacer por sí solo |
|---|---|---|
| **Miluquita** | Cámara, voz, GPS, WebXR, hit-test, anclaje, calibración de dos puntos, visualización y captura de observaciones | Aprobar decisiones, publicar versiones, elevar UNKNOWN a FACT o escribir directamente en el Core |
| **ARKI** | Interpretar encargos, clasificar evidencia, solicitar información faltante, generar alternativas, analizar consecuencias y preparar propuestas | Firmar como especialista humano, publicar automáticamente o modificar el estado canónico sin autorización |
| **SICL Core** | Identidad, autorización, Project State, historial, versiones, decisiones, auditoría y conflictos | Inventar datos faltantes o aceptar operaciones desconocidas |
| **Spatial Field Bridge** | Autenticación de servicio, validación de contratos, correlación, idempotencia, transporte y sincronización | Convertirse en una base de datos canónica o sustituir a ARKI/Core |

La auditoría de Miluquita debe mantenerse separada de esta especificación hasta recuperar y verificar su workspace canónico. El repositorio disponible declara C-001 como `BLOCKED` por C-000; por ello esta API no presupone que funcionalidades de Miluquita estén implementadas hasta contar con evidencia ejecutable.

## 3. Arquitectura de referencia

```text
┌──────────────────────────────┐
│ Miluquita Web/PWA/Mobile     │
│ cámara · voz · GPS · WebXR   │
│ caché offline · visor AR     │
└──────────────┬───────────────┘
               │ HTTPS / WebSocket opcional
               │ OAuth2/OIDC o sesión del usuario
               ▼
┌──────────────────────────────┐
│ ARKI Spatial Field Bridge    │
│ Edge validation              │
│ authz · idempotency          │
│ schema · size · replay guard │
└──────────────┬───────────────┘
               │ servicio interno autenticado
               ▼
┌──────────────────────────────┐
│ ARKI Application/BRAIN       │
│ intake · interpretation      │
│ proposal · visual analysis   │
│ human-review preparation     │
└──────────────┬───────────────┘
               │ canonical read/write
               ▼
┌──────────────────────────────┐
│ SICL Core / TRUST MANIAC     │
│ Project State                │
│ version conflict             │
│ audit hash chain             │
│ human authority              │
└──────────────────────────────┘
```

### 3.1 Modos operativos

| Modo | Lectura | Captura local | Sincronización | Escritura canónica |
|---|---:|---:|---:|---:|
| `ONLINE` | Sí | Sí | Inmediata | Permitida sólo mediante Core y autorización |
| `DEGRADED` | Caché autorizada | Sí | En cola | Bloqueada para decisiones y publicaciones |
| `OFFLINE` | Caché local | Sí | Pendiente | Bloqueada |
| `CORE_UNAVAILABLE` | Si existe caché | Sí | Reintento | Bloqueada, sin fallback silencioso |
| `REVOKED` | No | No | No | Bloqueada |

## 4. Base URL y versionado

La API pública del puente usa versionado mayor en la ruta:

```text
https://<bridge-domain>/api/spatial-field/v1
```

En el despliegue inicial del proyecto ARKI, el puente puede vivir dentro del backend ARKI bajo `/api/spatial-field/v1`, pero debe mantener una frontera de módulo y no exponer directamente el token de SICL Core.

Toda petición debe declarar:

```http
Accept: application/json
Content-Type: application/json
X-Bridge-Contract: ARKI-SFB-1.0
X-Request-Id: req_01J...
Idempotency-Key: idem_01J...
```

Las respuestas incluyen:

```http
X-Request-Id: req_01J...
X-Bridge-Contract: ARKI-SFB-1.0
ETag: "sfb:<resource>:<version>"
```

Los cambios incompatibles requieren `/v2`. Los cambios aditivos pueden permanecer en `/v1` si se conservan los campos obligatorios y la semántica existente.

## 5. Identidad, autenticación y autorización

### 5.1 Actores

```text
HUMAN_USER       Usuario autenticado que opera Miluquita o ARKI.
FIELD_DEVICE     Dispositivo registrado, sin autoridad de decisión.
ARKI_SERVICE     Servicio interno que interpreta y prepara propuestas.
SFB_SERVICE      Servicio del puente que valida y correlaciona.
SICL_CORE        Autoridad canónica del estado.
HUMAN_REVIEWER   Actor autorizado para revisión o decisión.
PROFESSIONAL     Arquitecto o ingeniero con revisión profesional requerida.
```

### 5.2 Tokens

El dispositivo nunca recibe `SICL_CORE_SERVICE_TOKEN`, claves privadas de servicio ni credenciales de escritura del Core. La autenticación recomendada es:

1. El usuario inicia sesión mediante la identidad existente de ARKI/Miluquita.
2. El backend emite un access token de corta duración y alcance limitado.
3. El dispositivo usa ese token únicamente contra el Bridge.
4. El Bridge valida el token y usa credenciales internas separadas para comunicarse con ARKI/Core.
5. La revocación del usuario o dispositivo invalida nuevas operaciones.

Los scopes propuestos son:

```text
sfb:project:read
sfb:project:observe
sfb:project:propose
sfb:artifact:read
sfb:artifact:upload
sfb:review:read
sfb:admin:device
```

No existe un scope móvil equivalente a `sicl:decision:commit` o `sicl:publish`. Las decisiones y publicaciones se ejecutan únicamente mediante procedimientos protegidos de ARKI/Core.

### 5.3 Autorización por proyecto

Cada operación se evalúa contra:

```text
user_id
organization_id / tenant_id
device_id
project_id
project_version
role
scope
resource_state
human_authority_requirement
```

Un `project_id` válido no otorga acceso. El Bridge debe comprobar pertenencia, permiso explícito y alcance de la operación. Las respuestas de autorización no deben revelar si un proyecto ajeno existe.

## 6. Recursos principales

### 6.1 Project Link

Vincula un proyecto de ARKI con una sesión o espacio de trabajo de Miluquita.

```json
{
  "link_id": "link_01J...",
  "project_id": "TRU-CLINIC-150",
  "project_version": 7,
  "client": "MILUQUITA",
  "client_instance_id": "mlu_app_01J...",
  "device_id": "dev_01J...",
  "access_mode": "READ_AND_OBSERVE",
  "created_by": "user_01J...",
  "expires_at": "2026-09-22T00:00:00Z",
  "status": "ACTIVE",
  "provenance": "SICL_CORE"
}
```

`access_mode` puede ser `READ_ONLY`, `READ_AND_OBSERVE` o `READ_AND_PROPOSE`. Nunca puede ser `DECISION_COMMIT` ni `PUBLISH` desde el Bridge.

### 6.2 Spatial Package

Describe el modelo que se visualizará en Miluquita.

```json
{
  "package_id": "spkg_01J...",
  "project_id": "TRU-CLINIC-150",
  "project_version": 7,
  "artifact": {
    "native": { "format": "ARK", "artifact_id": "art_01J...", "checksum": "sha256:..." },
    "exchange": [
      { "format": "IFC4", "artifact_id": "art_01J...", "checksum": "sha256:..." },
      { "format": "GLB", "artifact_id": "art_01J...", "checksum": "sha256:..." }
    ]
  },
  "coordinate_frame": {
    "type": "LOCAL_PROJECT_FRAME",
    "crs": "UNKNOWN",
    "origin": { "x": 0, "y": 0, "z": 0 },
    "units": "m",
    "north": { "status": "UNKNOWN" }
  },
  "anchor_strategy": "TWO_POINT_CALIBRATION",
  "geometry_fingerprint": "sha256:...",
  "human_review_required": true,
  "publication_state": "REVIEWED_NOT_PUBLISHED"
}
```

Un paquete sin checksum, sin versión o con `publication_state` incompatible no puede distribuirse como paquete oficial. Miluquita puede visualizar un paquete de prueba, pero debe etiquetarlo `SYNTHETIC`.

### 6.3 Field Observation

Una observación describe algo registrado en el campo. No afirma que el contenido sea cierto.

```json
{
  "observation_id": "obs_01J...",
  "project_id": "TRU-CLINIC-150",
  "project_version": 7,
  "device_id": "dev_01J...",
  "session_id": "field_01J...",
  "kind": "PHOTO_NOTE",
  "captured_at": "2026-09-21T22:00:00Z",
  "payload": {
    "text": "El acceso parece estar más alto que la vereda.",
    "media_artifact_id": "art_01J..."
  },
  "spatial_context": {
    "frame": "LOCAL_PROJECT_FRAME",
    "position": { "x": 12.4, "y": 5.2, "z": 0.3 },
    "accuracy_m": 0.15,
    "source": "DEVICE_DERIVED"
  },
  "epistemic": {
    "status": "UNVERIFIED",
    "provenance": "USER_CAPTURED",
    "confidence": "USER_REPORTED"
  },
  "requires_human_review": true,
  "status": "RECEIVED"
}
```

### 6.4 Anchor Session

Representa el proceso de calibración espacial.

```json
{
  "session_id": "field_01J...",
  "project_id": "TRU-CLINIC-150",
  "project_version": 7,
  "device_id": "dev_01J...",
  "strategy": "TWO_POINT_CALIBRATION",
  "status": "CALIBRATING",
  "points": [
    {
      "point_id": "A",
      "status": "CAPTURED",
      "pose": { "x": 0, "y": 0, "z": 0, "qx": 0, "qy": 0, "qz": 0, "qw": 1 },
      "accuracy_m": 0.08,
      "source": "HIT_TEST"
    },
    {
      "point_id": "B",
      "status": "CAPTURED",
      "pose": { "x": 6.2, "y": 0, "z": 0.1, "qx": 0, "qy": 0, "qz": 0, "qw": 1 },
      "accuracy_m": 0.11,
      "source": "HIT_TEST"
    }
  ],
  "quality": {
    "distance_m": 6.2,
    "orientation_error_degrees": 2.4,
    "scale_error_percent": 1.1,
    "status": "ACCEPTABLE"
  },
  "physical_validation_required": true
}
```

Una sesión `ACCEPTABLE` permite visualización provisional. No demuestra georreferenciación legal, precisión topográfica ni exactitud constructiva.

## 7. Endpoints HTTP

### 7.1 Salud y capacidades

```http
GET /api/spatial-field/v1/health
GET /api/spatial-field/v1/capabilities
```

`/capabilities` devuelve capacidades declaradas, no promesas de compatibilidad universal.

```json
{
  "contract_version": "ARKI-SFB-1.0",
  "bridge_status": "ONLINE",
  "core_status": "CONNECTED",
  "capabilities": {
    "webxr_hit_test": "DEVICE_DEPENDENT",
    "anchors": "DEVICE_DEPENDENT",
    "two_point_calibration": "IMPLEMENTED",
    "ark_read": "SUPPORTED",
    "ifc4_exchange": "ADAPTER_REQUIRED",
    "offline_observations": "SUPPORTED",
    "canonical_decision_commit": "CORE_ONLY"
  }
}
```

### 7.2 Vincular proyecto

```http
POST /api/spatial-field/v1/project-links
GET  /api/spatial-field/v1/project-links/{link_id}
DELETE /api/spatial-field/v1/project-links/{link_id}
```

Request:

```json
{
  "project_id": "TRU-CLINIC-150",
  "requested_version": 7,
  "access_mode": "READ_AND_OBSERVE",
  "device_id": "dev_01J..."
}
```

La respuesta incluye el paquete espacial autorizado o un estado `PENDING_REVIEW`. El enlace debe expirar y puede ser revocado desde ARKI/Core.

### 7.3 Descargar el paquete espacial

```http
GET /api/spatial-field/v1/projects/{project_id}/versions/{version}/spatial-package
```

La respuesta puede ser una descripción JSON con URLs de almacenamiento temporales. Nunca debe incluir credenciales permanentes.

```json
{
  "package": { "package_id": "spkg_01J..." },
  "download": [
    { "format": "GLB", "url": "https://storage.example/temporary/...", "expires_at": "..." },
    { "format": "IFC4", "url": "https://storage.example/temporary/...", "expires_at": "..." }
  ],
  "checksum_required": true
}
```

### 7.4 Iniciar y cerrar una sesión de campo

```http
POST /api/spatial-field/v1/projects/{project_id}/field-sessions
GET  /api/spatial-field/v1/field-sessions/{session_id}
POST /api/spatial-field/v1/field-sessions/{session_id}/close
POST /api/spatial-field/v1/field-sessions/{session_id}/reset
```

Request de inicio:

```json
{
  "project_version": 7,
  "device_id": "dev_01J...",
  "strategy": "TWO_POINT_CALIBRATION",
  "requested_features": ["HIT_TEST", "ANCHORS", "CAMERA", "GEOLOCATION"],
  "physical_validation_acknowledged": true
}
```

El Bridge no debe asumir que el dispositivo soporta WebXR. El cliente debe negociar capabilities y degradar así:

```text
WebXR hit-test → cámara/orientación → visor 3D local → vista 2D/métricas
```

### 7.5 Calibración y anclaje

```http
POST /api/spatial-field/v1/field-sessions/{session_id}/anchors
PATCH /api/spatial-field/v1/field-sessions/{session_id}/anchors/{anchor_id}
POST /api/spatial-field/v1/field-sessions/{session_id}/calibration/validate
```

Request de punto:

```json
{
  "point_id": "A",
  "pose": { "x": 0, "y": 0, "z": 0, "qx": 0, "qy": 0, "qz": 0, "qw": 1 },
  "source": "HIT_TEST",
  "accuracy_m": 0.08,
  "captured_at": "2026-09-21T22:00:00Z"
}
```

El resultado de validación contiene métricas y límites. No debe responder sólo `true/false`.

```json
{
  "status": "ACCEPTABLE",
  "visualization_allowed": true,
  "canonical_georeferencing_proven": false,
  "metrics": {
    "distance_m": 6.2,
    "orientation_error_degrees": 2.4,
    "scale_error_percent": 1.1
  },
  "warnings": ["La precisión física requiere validación en el dispositivo y terreno reales."],
  "human_review_required": true
}
```

### 7.6 Observaciones de campo

```http
POST /api/spatial-field/v1/projects/{project_id}/field-observations
GET  /api/spatial-field/v1/projects/{project_id}/field-observations?version=7&cursor=...
GET  /api/spatial-field/v1/field-observations/{observation_id}
POST /api/spatial-field/v1/field-observations/{observation_id}/acknowledge
```

`POST` acepta observaciones individuales o un lote offline:

```json
{
  "batch_id": "batch_01J...",
  "events": [
    {
      "client_event_id": "ce_01J...",
      "event_type": "FIELD_OBSERVATION_CAPTURED",
      "occurred_at": "2026-09-21T22:00:00Z",
      "observation": { "...": "..." }
    }
  ]
}
```

La respuesta debe informar por evento si fue aceptado, duplicado, rechazado o dejado pendiente.

### 7.7 Enviar un encargo o nota conversacional

```http
POST /api/spatial-field/v1/projects/{project_id}/field-intake
```

```json
{
  "session_id": "field_01J...",
  "input": {
    "kind": "VOICE_TRANSCRIPT",
    "text": "Mueve la entrada hacia el lado norte porque el acceso actual queda muy alto.",
    "language": "es"
  },
  "context": {
    "project_version": 7,
    "observation_ids": ["obs_01J..."],
    "anchor_session_id": "field_01J..."
  },
  "requested_action": "INTERPRET_ONLY"
}
```

`requested_action` sólo puede ser:

```text
INTERPRET_ONLY
CREATE_OBSERVATION
PREPARE_ALTERNATIVE
REQUEST_MISSING_INFORMATION
```

No se acepta `COMMIT_DECISION` desde este endpoint.

### 7.8 Preparar una propuesta de cambio

```http
POST /api/spatial-field/v1/projects/{project_id}/change-proposals
GET  /api/spatial-field/v1/projects/{project_id}/change-proposals/{proposal_id}
POST /api/spatial-field/v1/change-proposals/{proposal_id}/request-review
```

```json
{
  "base_version": 7,
  "source_observation_ids": ["obs_01J..."],
  "intent": "Relocate entrance toward north edge",
  "changes": [
    {
      "target": "ENTRANCE_MAIN",
      "operation": "TRANSLATE",
      "delta": { "x": 0, "y": 2.0, "z": 0 },
      "unit": "m"
    }
  ],
  "unknowns": ["Topographic slope not verified", "Regulatory setback not verified"],
  "evaluation_requests": ["ACCESSIBILITY", "EVACUATION", "COST", "STRUCTURAL_COORDINATION"],
  "human_review_required": true
}
```

El resultado es una propuesta versionada, no una mutación del proyecto base:

```json
{
  "proposal_id": "prop_01J...",
  "status": "CANDIDATE",
  "base_version": 7,
  "candidate_version": null,
  "ark_artifact_id": "art_01J...",
  "evaluations": [
    { "criterion": "ACCESSIBILITY", "status": "NOT_RUN" },
    { "criterion": "EVACUATION", "status": "UNKNOWN" }
  ],
  "decision": "NOT_DECIDED",
  "publishable": false,
  "next_step": "HUMAN_REVIEW_REQUIRED"
}
```

## 8. Eventos y sincronización offline

### 8.1 Envelope de evento

```json
{
  "event_id": "evt_01J...",
  "event_type": "FIELD_OBSERVATION_CAPTURED",
  "contract_version": "ARKI-SFB-1.0",
  "tenant_id": "tenant_01J...",
  "project_id": "TRU-CLINIC-150",
  "project_version": 7,
  "aggregate_id": "field_01J...",
  "sequence": 12,
  "client_event_id": "ce_01J...",
  "idempotency_key": "idem_01J...",
  "occurred_at": "2026-09-21T22:00:00Z",
  "received_at": "2026-09-21T22:00:05Z",
  "producer": { "system": "MILUQUITA", "device_id": "dev_01J..." },
  "provenance": "DEVICE_CAPTURED",
  "epistemic_status": "UNVERIFIED",
  "payload": {},
  "integrity": { "payload_checksum": "sha256:..." }
}
```

### 8.2 Reglas de cola

La cola local de Miluquita puede guardar observaciones y medios cifrados temporalmente. No puede guardar una decisión como si estuviera confirmada. Cada elemento debe tener una clave idempotente estable.

La sincronización usa reintentos exponenciales con límite. La respuesta por lote debe distinguir:

```text
ACCEPTED
DUPLICATE_ALREADY_APPLIED
PENDING_REVIEW
VERSION_CONFLICT
REJECTED_SCHEMA
REJECTED_AUTH
REJECTED_EXPIRED
CORE_UNAVAILABLE
```

Un `VERSION_CONFLICT` nunca se resuelve sobrescribiendo. El cliente debe descargar la nueva versión, mostrar la diferencia y permitir crear una nueva propuesta sobre la versión actual.

### 8.3 WebSocket opcional

```text
wss://<bridge-domain>/api/spatial-field/v1/ws
```

El WebSocket sirve para progreso y notificaciones de revisión. No sirve para commits directos.

Mensajes permitidos:

```text
SESSION_STATUS
UPLOAD_PROGRESS
OBSERVATION_ACCEPTED
PROPOSAL_STATUS_CHANGED
HUMAN_REVIEW_REQUIRED
CORE_STATUS_CHANGED
```

Debe heredar los límites existentes de ARKI: origen permitido, payload pequeño, una suscripción por socket, límite de mensajes, ping/pong y cierre ante violación.

## 9. Estados y transiciones

### 9.1 Observaciones

```text
CAPTURED → QUEUED → RECEIVED → CLASSIFIED → REVIEWED
                         └────→ REJECTED
```

`CLASSIFIED` significa que ARKI clasificó el contenido; no significa que lo confirmó.

### 9.2 Propuestas

```text
DRAFT → CANDIDATE → EVALUATING → READY_FOR_REVIEW
                                   ├→ REJECTED
                                   ├→ NEEDS_REVISION
                                   └→ HUMAN_APPROVED
                                      └→ CORE_COMMIT_PENDING
                                         └→ COMMITTED
```

`COMMITTED` sólo puede ser emitido por SICL Core después de comprobar versión, autoridad, integridad y reglas del dominio.

### 9.3 Publicación

```text
CREATED != REVIEWED != VERIFIED != PUBLISHED
```

Miluquita puede consumir `REVIEWED` o `VERIFIED` según el permiso. Para visualización pública sólo se distribuyen artefactos `PUBLISHED`.

## 10. Seguridad MANIAC aplicada al puente

### EDGE

El Bridge debe aplicar CSP estricta en producción, headers defensivos, guardia de origen, límites de tamaño, rate limit, validación de content type, bloqueo de SSRF, allowlist de almacenamiento y límites de WebSocket.

Los archivos aceptados deben validarse por tamaño, MIME declarado, firma o parser seguro, checksum y límite de descompresión. Nunca se ejecuta código recibido desde `.ark`, `.ifc`, `.glb`, `.dyn` o `.ghx` en el servidor.

### BRAIN / APPLICATION

ARKI transforma observaciones en clasificaciones y propuestas. Debe preservar `UNKNOWN`, `UNVERIFIED`, provenance y conflictos. La IA o regla determinista puede recomendar, pero no puede escribir una decisión final.

Las imágenes, transcripciones y metadatos del dispositivo se tratan como entradas no confiables. El contenido no puede modificar prompts de sistema, permisos, destinatarios ni URLs de servicio.

### CORE / TRUST MANIAC

Toda mutación canónica pasa por `authorizeManiacCoreTrust` o por el equivalente del SICL Core remoto. Se rechaza cuando ocurre cualquiera de estas condiciones:

- actor no autenticado;
- tenant o proyecto no autorizado;
- operación desconocida;
- token ausente o inválido;
- checksum o cadena de auditoría inválida;
- versión base desactualizada;
- falta de revisión humana;
- estado incompatible con publicación;
- contrato o esquema no reconocido;
- intento de escribir directamente desde Edge o dispositivo.

El Bridge debe registrar correlación, actor, dispositivo, proyecto, versión, checksum, decisión de autorización y respuesta del Core. No debe registrar tokens, imágenes completas ni secretos.

## 11. Privacidad y retención

La captura de cámara, audio y ubicación requiere consentimiento explícito y debe indicar qué se almacena, durante cuánto tiempo y para qué proyecto. El usuario debe poder detener la captura.

La política mínima recomendada es:

| Dato | Retención inicial | Regla |
|---|---:|---|
| Pose temporal de WebXR | Sesión | No se convierte en georreferencia sin evidencia |
| GPS | Según proyecto y consentimiento | Precisión reducida cuando no sea necesaria |
| Fotografías | Hasta revisión o política del proyecto | Cifrado y acceso por proyecto |
| Audio original | Temporal | Preferir conservar transcripción y checksum si es suficiente |
| Transcripción | Proyecto/versionado | Marcada `USER_CAPTURED` y `UNVERIFIED` |
| Logs de seguridad | Retención administrativa | Integridad encadenada, sin secretos |

## 12. Contrato de errores

Todas las respuestas de error usan este formato:

```json
{
  "error": {
    "code": "SFB_VERSION_CONFLICT",
    "message": "La versión base ya no es la versión vigente.",
    "request_id": "req_01J...",
    "retryable": false,
    "details": {
      "expected_version": 8,
      "provided_version": 7
    }
  }
}
```

Códigos mínimos:

| HTTP | Código | Significado |
|---:|---|---|
| 400 | `SFB_INVALID_REQUEST` | JSON o parámetros inválidos |
| 401 | `SFB_AUTH_REQUIRED` | Token ausente o inválido |
| 403 | `SFB_SCOPE_DENIED` | El actor no tiene el alcance requerido |
| 404 | `SFB_RESOURCE_NOT_FOUND` | Recurso no visible o inexistente |
| 409 | `SFB_VERSION_CONFLICT` | La versión base quedó obsoleta |
| 413 | `SFB_PAYLOAD_TOO_LARGE` | Archivo o payload excede el límite |
| 415 | `SFB_UNSUPPORTED_MEDIA` | Formato no aceptado |
| 422 | `SFB_EPISTEMIC_CONTRACT_INVALID` | Faltan provenance, UNKNOWN o estados obligatorios |
| 429 | `SFB_RATE_LIMITED` | Límite de solicitudes excedido |
| 451 | `SFB_CONSENT_REQUIRED` | Falta consentimiento de captura o ubicación |
| 503 | `SFB_CORE_UNAVAILABLE` | El Core no está disponible; no hay fallback silencioso |
| 504 | `SFB_CORE_TIMEOUT` | El Core no respondió dentro del plazo |

## 13. Observabilidad y auditoría

Cada operación debe producir métricas técnicas y eventos de seguridad separados.

Métricas mínimas:

```text
sfb_requests_total{route,status}
sfb_request_duration_ms{route}
sfb_observation_queue_depth
sfb_sync_retry_total{reason}
sfb_version_conflict_total
sfb_core_unavailable_total
sfb_anchor_validation_total{status}
sfb_upload_rejected_total{reason}
```

Trazas mínimas:

```text
request_id
trace_id
project_id
project_version
session_id
device_id_hash
actor_id_hash
core_request_id
outcome
```

Nunca se debe incluir en logs de aplicación el token, el contenido completo de audio, imágenes o coordenadas precisas si no son necesarias para la investigación del incidente.

## 14. Compatibilidad de artefactos

El formato nativo preferido es `ARKI-ARK-1.0`. El paquete puede incluir `IFC4`, `GLB` u otros formatos de visualización, pero cada artefacto conserva su checksum y provenance.

La lectura IFC debe distinguir:

```text
SEMANTIC_PARSED
GEOMETRY_NOT_DECODED
GEOMETRY_VERIFIED
ROUND_TRIP_PASS
ROUND_TRIP_FAIL
```

No se declara compatibilidad geométrica completa sólo porque el archivo IFC pueda abrirse. La validación round-trip debe conservar identidad de elementos, clase semántica, cajas geométricas normalizadas y tolerancia explícita. La compatibilidad nativa con Revit, Dynamo o Rhino requiere un host autorizado y no se simula desde el Bridge.

## 15. Flujos de extremo a extremo

### 15.1 Abrir y visualizar un proyecto

```text
1. Miluquita autentica al usuario.
2. Solicita un project-link para un project_id y versión.
3. Bridge comprueba identidad, tenant, permisos y estado de publicación.
4. ARKI/Core devuelve el paquete autorizado.
5. Miluquita verifica checksum antes de mostrarlo.
6. El dispositivo negocia WebXR y selecciona el modo de degradación.
7. La visualización se etiqueta con proyecto, versión, precisión y estado.
```

### 15.2 Registrar una observación offline

```text
1. Miluquita solicita consentimiento.
2. Captura foto, voz, texto o pose.
3. Marca el dato como USER_CAPTURED / DEVICE_DERIVED y UNVERIFIED.
4. Guarda un evento idempotente en la cola local.
5. Al recuperar red, envía el lote al Bridge.
6. Bridge valida esquema, checksum, permisos y duplicación.
7. ARKI clasifica y conserva UNKNOWN.
8. SICL Core registra el evento de observación.
9. El usuario recibe el resultado y cualquier necesidad de revisión.
```

### 15.3 Proponer un cambio de diseño

```text
1. Miluquita envía una observación o instrucción conversacional.
2. ARKI interpreta la intención sin mutar el proyecto base.
3. ARKI crea una alternativa candidata sobre una versión concreta.
4. Se ejecutan evaluaciones disponibles y se preservan los UNKNOWN.
5. Se solicita revisión humana o profesional.
6. La autoridad aprueba, rechaza o pide revisión.
7. Sólo tras la aprobación, ARKI solicita al Core el commit con expected_version.
8. El Core rechaza si la versión cambió o la auditoría no es íntegra.
9. Si el commit tiene éxito, se genera una nueva versión y un nuevo paquete espacial.
10. Miluquita recibe una notificación y debe descargar explícitamente la nueva versión.
```

## 16. Implementación recomendada en ARKI

La primera implementación debe reutilizar los contratos actuales, no crear un servidor paralelo:

- `server/arkiParametricExchange.ts` para `ARK`, semántica, provenance y puente IFC.
- `server/arkiIfc4.ts` para parsing, adaptación geométrica y round-trip.
- `server/arkiSecurityLayers.ts` para autorización fail-closed y límites Core/Trust.
- `server/coreHttpClient.ts` para comunicación autenticada con SICL Core.
- `client/src/lib/spatialAr.ts` y `client/src/pages/FieldModePage.tsx` para capacidades WebXR y fallback.
- `client/src/api/visual-field.ts` y `server/visualField.ts` para observaciones visuales propuestas.
- `server/security.ts` para headers, origen, rate limits y eventos de seguridad.

La implementación debe empezar por contratos compartidos y pruebas de integración. No debe comenzar por una UI nueva ni por un segundo almacenamiento de proyectos.

## 17. Gates de aceptación

### Gate SFB-01 — Contrato

- [ ] Todos los endpoints validan `ARKI-SFB-1.0`.
- [ ] Los errores tienen códigos estables.
- [ ] La idempotencia está probada.
- [ ] No existen campos de decisión final en payloads móviles.

### Gate SFB-02 — Seguridad

- [ ] No se expone ningún token del Core al cliente.
- [ ] IDOR entre proyectos está rechazado.
- [ ] Los payloads y archivos tienen límites.
- [ ] El WebSocket respeta límites existentes.
- [ ] La operación desconocida falla cerrada.

### Gate SFB-03 — Estado y versiones

- [ ] Un conflicto 409 no sobrescribe.
- [ ] Las observaciones conservan provenance y UNKNOWN.
- [ ] Las propuestas nunca mutan el Project State directamente.
- [ ] El Core conserva una sola versión canónica.

### Gate SFB-04 — Campo físico

- [ ] Se prueba WebXR en dispositivo compatible.
- [ ] Se prueba Android moderno.
- [ ] Se prueba Android antiguo compatible.
- [ ] Se prueba iPhone compatible.
- [ ] Se prueba fallback 3D/2D.
- [ ] La precisión de hit-test y anclaje queda registrada como evidencia física, no como afirmación de diseño.

### Gate SFB-05 — Interoperabilidad

- [ ] Se verifica checksum de ARK, IFC y GLB.
- [ ] IFC4 se parsea sin ejecutar código.
- [ ] Geometría BRep, CSG y malla reporta estado explícito.
- [ ] Round-trip usa tolerancia declarada.
- [ ] Revit/Dynamo sólo se ejecuta en hosts autorizados.

### Gate SFB-06 — Revisión humana

- [ ] Existe una cola de observaciones y propuestas.
- [ ] El usuario puede corregir o rechazar una interpretación.
- [ ] La aprobación queda registrada en SICL Core.
- [ ] `PUBLISHED` nunca se deriva automáticamente de una observación móvil.

## 18. Roadmap de entrega

**MVP de lectura:** project-link, paquete ARK/GLB, checksum, sesión de campo, calibración local y visor degradado.

**MVP de observación:** cola offline, fotos/notas/transcripciones, provenance, sincronización idempotente y revisión en ARKI.

**MVP de propuestas:** interpretación conversacional, alternativas, evaluaciones, conflictos de versión y revisión humana.

**Integración avanzada:** IFC4 geométrico, round-trip, hosts Revit/Dynamo autorizados, georreferencia validada y métricas de rendimiento.

No debe habilitarse publicación automática desde Miluquita en ninguna fase.

## 19. Resultado esperado

Con esta API, Miluquita se convierte en la interfaz espacial de campo de ARKI sin fragmentar el sistema:

```text
Miluquita = percepción, interacción y visualización espacial
ARKI      = interpretación, alternativas y razonamiento arquitectónico
SICL Core = memoria, autoridad, versionado y auditoría
```

El Bridge es únicamente la frontera segura y trazable que conecta los tres componentes.

## Referencias

[1]: ../../server/arkiParametricExchange.ts "Contrato ARK e intercambio paramétrico de ARKI"
[2]: ../../server/arkiSecurityLayers.ts "Arquitectura de seguridad en tres capas y Core/Trust MANIAC"
[3]: ../../server/coreHttpClient.ts "Cliente HTTP del SICL Core canónico"
[4]: ../../server/arkiIfc4.ts "Parser IFC4 y validación geométrica round-trip"
[5]: ../../client/src/lib/spatialAr.ts "Adaptador espacial WebXR de ARKI"
[6]: ../../client/src/pages/FieldModePage.tsx "Interfaz de modo de campo de ARKI"
[7]: ../../../milukita-spec-inspect/docs/work-orders/C-001_REALITY_MAP_MACHINE_READY.md "Estado de evidencia y límites del workspace Miluquita"
[8]: ../../../milukita-spec-inspect/docs/automation/DECISION_EVENT_SCHEMA.md "Esquema de eventos y gates humanos de Miluquita"

author: Manus AI
status: DESIGN_READY_FOR_IMPLEMENTATION
canonical_decision_commit: NOT_REQUESTED
human_review_required: true
future_external_core_required: true
one_canonical_project_state: true
```
