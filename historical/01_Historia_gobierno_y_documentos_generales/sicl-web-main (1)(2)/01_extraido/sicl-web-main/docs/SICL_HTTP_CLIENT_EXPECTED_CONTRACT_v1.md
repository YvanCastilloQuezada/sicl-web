# SICL — Contrato HTTP esperado por el cliente TypeScript

**Fuente:** `server/coreHttpClient.ts`, `server/routers.ts` y `SICL_HTTP_ADAPTER_CONTRACT.md` del repositorio `sicl-web`.
**Propósito:** documentar lo que el gateway web espera del Core Python; no constituye una implementación del Core.

## 1. Arquitectura y límites

El repositorio `sicl-web` contiene el frontend React, el servidor TypeScript/tRPC y un cliente HTTP server-side. El Core Python no está incluido en este repositorio. El cliente HTTP obtiene la URL desde `SICL_CORE_URL` y el token exclusivamente desde `SICL_CORE_SERVICE_TOKEN`.

El navegador no recibe el token. Las llamadas al Core salen desde el servidor TypeScript mediante `fetch` y llevan:

```http
Accept: application/json
Authorization: Bearer <server-side service token>
```

Cuando no existe `SICL_CORE_URL`, el gateway solo puede usar el fallback local si se cumplen ambas condiciones:

```text
NODE_ENV != production
SICL_ALLOW_LOCAL_CORE == true
```

En producción, la ausencia de `SICL_CORE_URL` debe producir un error cerrado.

## 2. Tipos de respuesta comunes

### 2.1 Respuesta de escritura

Las escrituras remotas se tratan como respuestas con esta forma mínima:

```json
{
  "contract_version": "sicl-core-http/0.3",
  "project_id": "SICL-EXAMPLE",
  "observed_version": 2
}
```

El cliente permite campos adicionales porque el tipo TypeScript contiene `[key: string]: unknown`.

### 2.2 Snapshot canónico

```json
{
  "contract_version": "sicl-core-http/0.3",
  "project_id": "SICL-EXAMPLE",
  "observed_version": 2,
  "snapshot": {}
}
```

El campo `snapshot` es un objeto abierto para el cliente TypeScript y se normaliza mediante `siclCorePort`.

### 2.3 Not-found preservado

Para lecturas canónicas con HTTP 404, el cliente devuelve internamente:

```json
{
  "not_found": true,
  "project_id": "SICL-EXAMPLE",
  "status": 404,
  "error": "PROJECT_NOT_FOUND",
  "detail": "...",
  "envelope": {}
}
```

El cuerpo de error upstream se conserva en `envelope`.

### 2.4 Errores

El cliente convierte respuestas no exitosas en `SiclCoreHttpError` con:

```text
status: number
aerrorCode?: string
envelope: Record<string, unknown>
```

El servidor TypeScript espera como mínimo campos JSON opcionales `error` y `detail`.

## 3. Endpoints efectivos llamados por `coreHttpClient.ts`

### 3.1 Catálogo de métodos de Investigación de Operaciones

```http
GET /v1/operations-research/methods
```

Respuesta esperada:

```json
{
  "contract_version": "sicl-core-http/0.3",
  "read_only": true,
  "methods": [
    {
      "method": "MCDA_WEIGHTED",
      "required_inputs": [],
      "required_units": [],
      "required_constraints": [],
      "required_assumptions": [],
      "required_provenance": [],
      "output_fields": [],
      "feasibility_states": [],
      "sensitivity_outputs": [],
      "version": "1"
    }
  ]
}
```

El cliente exige los siguientes campos por método:

```text
method
required_inputs
required_units
required_constraints
required_assumptions
required_provenance
output_fields
feasibility_states
sensitivity_outputs
version
```

### 3.2 Crear proyecto

```http
POST /v1/projects
Content-Type: application/json
```

Payload efectivo:

```json
{
  "project_id": "SICL-EXAMPLE",
  "name": "UPAO Plaza Center",
  "spatial_scope": {
    "scale": "PROJECT",
    "id": "SICL-EXAMPLE",
    "name": "UPAO Plaza Center",
    "parent_id": "optional"
  },
  "temporal_scope": {
    "horizon": "PRESENT"
  }
}
```

`spatial_scope` y `temporal_scope` son opcionales en el cliente.

Escalas espaciales usadas por el gateway:

```text
PROJECT
SECTOR
DISTRICT
CITY
METROPOLITAN_AREA
REGION
MACROREGION
COUNTRY
```

Horizontes temporales:

```text
PRESENT
2030
2040
2050
```

Respuesta esperada:

```json
{
  "contract_version": "sicl-core-http/0.3",
  "project_id": "SICL-EXAMPLE",
  "observed_version": 1,
  "snapshot": {}
}
```

### 3.3 Obtener snapshot canónico

```http
GET /v1/projects/{project_id}/snapshot
```

Headers:

```http
Accept: application/json
Authorization: Bearer <server-side token>
```

Respuesta esperada:

```json
{
  "contract_version": "sicl-core-http/0.3",
  "project_id": "SICL-EXAMPLE",
  "observed_version": 1,
  "snapshot": {}
}
```

### 3.4 Obtener Council

Llamada efectiva del cliente actual:

```http
GET /v1/projects/{project_id}/council
```

Respuesta esperada por `CanonicalCouncil`:

```json
{
  "contract_version": "sicl-core-http/0.3",
  "project_id": "SICL-EXAMPLE",
  "observed_version": 3,
  "read_only": true,
  "readOnly": true,
  "finding": "...",
  "comparisons": [],
  "multi_comparisons": [],
  "tradeoffs": [],
  "recommendations": []
}
```

La función TypeScript considera Council una lectura; no espera que esta llamada cree Recommendation, HumanReview o Decision.

### 3.5 Registrar Preference

```http
POST /v1/projects/{project_id}/preferences
Content-Type: application/json
```

Payload construido por `server/routers.ts`:

```json
{
  "preference_id": "PREF-001",
  "name": "Preservar plaza existente",
  "justification": "Razón explícita",
  "domain": "GENERAL",
  "strength": "SOFT",
  "scope_type": "PROJECT",
  "scope_id": "SICL-EXAMPLE",
  "provenance": [],
  "valid_from": null,
  "valid_until": null,
  "status": "ACTIVE",
  "expected_project_version": 1,
  "event_id": "uuid"
}
```

Campos obligatorios validados en el gateway:

```text
id/name
justification
scopeId
```

El gateway traduce los nombres web a snake_case HTTP.

### 3.6 Registrar Recommendation

```http
POST /v1/projects/{project_id}/recommendations
Content-Type: application/json
```

Payload:

```json
{
  "recommendation_id": "REC-001",
  "alternative_id": "ALT-A",
  "based_on": "CMP-001",
  "based_on_kind": "BINARY",
  "reason": "Explicación analítica explícita de la recomendación",
  "expected_project_version": 3,
  "event_id": "uuid"
}
```

Valores admitidos por el gateway para `based_on_kind`:

```text
BINARY
MULTI_CRITERIA
COUNCIL_FINDING
COUNCIL_ASSESSMENT
COLLECTIVE_AGGREGATE
```

El gateway fija la fuente como `ANALYTICAL` en su validación tRPC, aunque el payload HTTP no incluye actualmente un campo `source` explícito.

La Recommendation no debe crear una Decision.

### 3.7 Registrar HumanReview

```http
POST /v1/projects/{project_id}/human-reviews
Content-Type: application/json
```

Payload:

```json
{
  "review_id": "REV-001",
  "recommendation_id": "REC-001",
  "actor_id": "human-actor-001",
  "authority_basis": "HUMAN_REVIEW",
  "confirmation_id": "confirmation-001",
  "status": "ACCEPTED",
  "reason": "Justificación humana explícita",
  "observed_project_version": 3,
  "recommendation_version": 1,
  "expected_project_version": 3,
  "event_id": "uuid"
}
```

Estados web admitidos:

```text
ACCEPTED
MODIFIED
REJECTED
```

### 3.8 Preparar Decision

El router TypeScript tiene una operación local de preparación:

```text
projects.decisionPrepare
```

La documentación HTTP define el endpoint canónico esperado:

```http
POST /v1/projects/{project_id}/decisions/prepare
```

Debe ser read-only y devolver un preview durable sin añadir un evento.

La respuesta web esperada incluye:

```json
{
  "ready": true,
  "writeRequired": true,
  "decisionType": "HUMAN",
  "observedVersion": 3,
  "actorId": "human-actor-001",
  "authorityBasis": "OWNER_APPROVAL",
  "confirmationId": "confirmation-001",
  "rationale": "...",
  "selectedAlternativeId": "ALT-A"
}
```

### 3.9 Registrar Decision humana

```http
POST /v1/projects/{project_id}/decisions
Content-Type: application/json
```

Payload:

```json
{
  "decision_id": "DEC-001",
  "selected_alternative_id": "ALT-A",
  "decision_maker": "human-actor-001",
  "rationale": "Justificación de la decisión humana",
  "expected_project_version": 3,
  "event_id": "uuid",
  "authority_context": {
    "actor_id": "human-actor-001",
    "authority_basis": "OWNER_APPROVAL",
    "confirmation_id": "confirmation-001"
  }
}
```

El Core debe ser la única autoridad para persistir la Decision y el evento correspondiente.

## 4. Operaciones que no llaman al Core remoto actualmente

La ruta tRPC genérica `projects.addRecord` mantiene un fallback local para la mayoría de tipos:

```text
sources
evidence
requirements
objectives
constraints
preferences
alternatives
evaluations
comparisons
multiComparisons
decisionConditions
```

Cuando `SICL_CORE_URL` está configurado:

- `preferences` se delega al Core mediante el endpoint canónico de Preference.
- `decisionConditions` se rechaza en escritura porque continúa read-only.
- Las demás clases no tienen una llamada HTTP específica en `coreHttpClient.ts` y no deben considerarse soportadas remotamente solo porque el frontend pueda representarlas localmente.

## 5. Invariantes esperadas por el gateway

```text
1. El token del servicio solo existe server-side.
2. El navegador nunca recibe SICL_CORE_SERVICE_TOKEN.
3. La ausencia de SICL_CORE_URL falla cerrado fuera del desarrollo explícito.
4. Cada escritura remota lleva expected_project_version y event_id.
5. Recommendation es distinta de Decision.
6. Recommendation no crea Decision.
7. Decision requiere actor, autoridad, confirmación y rationale humanos.
8. Decision Conditions no tiene endpoint remoto de escritura.
9. Council es read-only.
10. Los errores del Core no se convierten en respuestas exitosas.
```

## 6. Discrepancias encontradas

### 6.1 Endpoint Council

La documentación `SICL_HTTP_ADAPTER_CONTRACT.md` declara:

```http
POST /v1/projects/{project_id}/council/analyze
```

Pero el cliente efectivo llama:

```http
GET /v1/projects/{project_id}/council
```

Esto debe resolverse antes del E2E remoto. No se debe implementar ambos endpoints por inferencia.

### 6.2 Versión contractual

La documentación menciona:

```text
sicl-core-http/0.2
```

El código TypeScript y la fase A-003 esperan HTTP v0.3 con snake_case. El Core remoto debe declarar una única versión aprobada antes del despliegue.

### 6.3 Adaptador Python no recuperado

El repositorio web no contiene el servidor Python. El contrato de cliente permite especificar la superficie esperada, pero no demuestra que exista una implementación compatible.

### 6.4 Superficie parcialmente delegada

El frontend representa más clases de registro que las que actualmente tienen endpoints HTTP específicos. Por lo tanto, la presencia de una entidad en `recordKinds` no prueba que el Core HTTP la soporte.

## 7. Criterio de compatibilidad para el Core faltante

Un Core candidato solo debe considerarse compatible cuando:

```text
- responde a los endpoints efectivos documentados;
- usa snake_case en payloads HTTP;
- devuelve contract_version, project_id y observed_version cuando corresponde;
- conserva errores HTTP con códigos y detail;
- mantiene el token fuera del navegador;
- aplica control optimista por expected_project_version;
- persiste eventos append-only;
- mantiene Recommendation ≠ Decision;
- mantiene Decision y HumanReview bajo autoridad humana;
- confirma cuál es el endpoint canónico de Council;
- confirma una única versión del contrato HTTP.
```

**Conclusión:** `sicl-web` define una interfaz cliente razonablemente precisa para el Core, pero esa interfaz no permite reconstruir de forma segura la lógica Python faltante.
