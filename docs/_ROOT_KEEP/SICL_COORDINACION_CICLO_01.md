# SICL — Implementation Coordination Record

**Ciclo:** 01
**Fecha:** 2026-08-24
**Estado:** **IMPLEMENTADO Y VALIDADO LOCALMENTE; E2E REMOTO PENDIENTE**
**Artefacto:** incorporación canónica de `Preference` en SICL 0.6

## 1. Propuesta recibida

Se aprobó incorporar `Preference` también al Core Contract canónico Python, no únicamente al fallback web. La intención es que una preferencia sea una entidad semántica explícita, trazable y distinta de `Requirement`, `Objective` y `Constraint`. Debe expresar una prioridad o inclinación humana sin convertirse automáticamente en obligación, hecho, restricción dura, recomendación o decisión.

El documento 70 establece el protocolo operativo: primero análisis de impacto, después validación arquitectónica humana, luego implementación, pruebas y validación final. Por tanto, la primera versión de este archivo constituyó el registro de coordinación previo a la implementación. Tras la validación arquitectónica del documento 73 y la aprobación humana, el cierre del ciclo se registra al final de este mismo archivo.

## 2. Análisis del estado actual

### Qué existe

En `sicl-web` ya existe una implementación local de `Preference` en el snapshot TypeScript, el router de registros y el Command Center. El formulario exige nombre y justificación, permite declarar fuerza `SOFT` o `STRONG` y muestra que la preferencia no se promueve silenciosamente a requisito o restricción. También existen pruebas de dominio, normalización de snapshots y contrato de UI.

El proyecto web ya dispone de Evaluation, Comparison, Recommendation, HumanReview, Decision, Audit, scopes espaciales/temporales, Council read-only y exportación JSON filtrada. La capa web falla cerrado en producción si falta `SICL_CORE_URL` y el fallback local solo se habilita explícitamente en desarrollo.

### Qué no existe

El Core Contract Python no tiene una clase `Preference`, ni una colección `preferences` en `CoreProject`, ni tabla SQLite, ni método `add_preference`, ni carga/persistencia de preferencias, ni representación en `ReviewSummary` o `review_payload`. El adaptador HTTP no tiene endpoint para escribir preferencias. La interfaz HTTP de escritura existente cubre proyecto, Recommendation, HumanReview y Decision; el snapshot se serializa genéricamente, pero no puede exponer una colección que el núcleo no contiene.

### Qué existe parcialmente

La preferencia existe hoy como capacidad local de producto, pero no como entidad canónica interoperable. Esto permite probar la semántica de interfaz, pero no permite afirmar que una preferencia creada desde el web se conservará en el Core Python remoto. El snapshot web puede normalizar `preferences`, pero la delegación remota todavía no tiene contrato de escritura para ella.

### Contradicciones o riesgos de interpretación

La principal contradicción sería declarar que SICL 0.6 tiene Preferences canónicas cuando solo existe soporte local. Otra sería introducir una preferencia con comportamiento de restricción dura o usar `STRONG` como sinónimo de obligación. También sería peligroso exigir una fuente como si toda preferencia fuera un hecho verificable, o permitir que una preferencia influya automáticamente en un ganador, Recommendation o Decision.

## 3. Impacto técnico

| Superficie | Impacto | Evaluación |
|---|---|---|
| Core Contract | Nueva entidad `Preference` y sus invariantes. | Alto; requiere validación semántica antes de codificar. |
| Python | `model.py`, exportaciones y métodos de `CoreProject`. | Alto, pero acotable a una entidad mínima. |
| SQLite | Tabla `preferences`, orden de guardado/carga, índices y compatibilidad con bases existentes. | Alto; debe ser atómico y reversible. |
| API HTTP | Snapshot automático tras carga; endpoint de escritura aún inexistente. | Alto; requiere decidir si se agrega endpoint específico o escritura genérica. |
| Web | Ya existe soporte local; debe delegar al Core cuando esté disponible. | Medio; no debe conservar dos semánticas divergentes. |
| Persistencia | Nuevas filas y eventos; idempotencia y conflictos deben seguir las reglas actuales. | Alto. |
| Auditoría | Debe registrarse creación y origen sin secretos; no debe sugerir autoridad. | Medio/alto. |
| Tests | Modelo, referencias, round-trip SQLite, snapshots, HTTP y router. | Alto y obligatorio. |
| Seguridad | Validación server-side, autenticación del adaptador y filtrado de payloads. | Alto; no se relaja el fail-closed. |
| Migraciones | `CREATE TABLE IF NOT EXISTS` no sustituye una estrategia documentada para bases persistentes existentes. | Medio/alto. |

## 4. Propuesta de implementación de Manus

Implementar una entidad canónica mínima y no normativa, con estas propiedades iniciales propuestas: identidad propia, `project_id`, nombre, justificación, fuerza declarada y alcance explícito. La entidad no debe tener `winner`, `decision`, `recommendation`, `threshold` ni una dirección de optimización. Su presencia no debe activar ningún cálculo.

La implementación debería seguir el orden: contrato y enums; agregado `CoreProject`; persistencia SQLite; carga y round-trip; resumen/review payload; evento; endpoint HTTP o mecanismo de escritura aprobado; cliente anti-corrupción; tRPC; integración del fallback web; pruebas de errores, referencias, idempotencia, conflicto y seguridad; documentación de migración.

Mi recomendación de programador es **no implementar todavía** hasta que ChatGPT valide dos decisiones semánticas: el significado exacto de `scope` y el tratamiento de la procedencia. La aprobación previa de incorporar `Preference` autoriza el objetivo, pero no autoriza a Manus a inventar esos detalles.

## 5. Elementos que no deben implementarse todavía

No deben implementarse todavía pesos automáticos, agregación multiobjetivo, MCDA, dominancia, selección automática, traducción de `STRONG` a constraint, inferencia de preferencias desde lenguaje natural, perfiles profesionales, agentes autónomos, GIS avanzado, BIM, Digital Twin, IoT, planificación nacional automática, certificación profesional ni recomendaciones derivadas exclusivamente de preferencias.

Tampoco debe crearse un endpoint HTTP genérico de escritura solo para evitar diseñar el contrato de `Preference`. La generalización de escrituras es una decisión arquitectónica distinta y no debe introducirse incidentalmente en este ciclo.

## 6. Cambios concretos propuestos

| Archivo o superficie | Cambio propuesto | Estado |
|---|---|---|
| `src/sicl/core_contract/model.py` | Añadir `Preference` y sus invariantes mínimas. | Propuesto |
| `CoreProject` | Añadir `preferences` y `add_preference`. | Propuesto |
| `src/sicl/core_contract/sqlite.py` | Crear tabla, guardar, cargar y mapear referencias. | Propuesto |
| `src/sicl/core_contract/review.py` | Decidir si los resúmenes cuentan preferencias y cómo. | Pendiente de validación |
| `http_adapter/sicl_core_http.py` | Exponer preferencias en snapshot y definir escritura si corresponde. | Pendiente de validación |
| `sicl-web/server/coreHttpClient.ts` | Añadir cliente solo después de fijar el endpoint. | Pendiente |
| `sicl-web/server/routers.ts` | Delegar `preferences` al Core cuando exista URL; conservar fail-closed. | Pendiente |
| `sicl-web/server/siclCore.ts` | Mantener compatibilidad del fallback y alinear invariantes con el Core. | Parcialmente implementado |
| Tests Python | Modelo, referencias, round-trip, eventos, rollback y compatibilidad. | Pendiente |
| Tests web | Delegación, normalización, errores y separación de autoridad. | Parcialmente implementado |
| Documentación | Runbook, contrato HTTP, migración y evidencia de ciclo. | Pendiente |

## 7. Dependencias

Antes de implementar se necesita validar arquitectónicamente: si `Preference` pertenece al Core Contract 1.0 o a una revisión de contrato; si su alcance puede ser `PROJECT`, `OBJECTIVE` o `ALTERNATIVE`; si puede referenciar `Evidence` o `Source`; si `SOFT` y `STRONG` son suficientes; si una preferencia puede modificarse mediante una nueva versión o solo mediante un nuevo registro; qué evento canónico debe registrar su creación; y si el adaptador necesita un endpoint específico de escritura.

Después de esa validación se necesita ejecutar la suite Python, la suite web, pruebas HTTP con autenticación, round-trip SQLite, prueba de rollback transaccional y una verificación de compatibilidad de snapshots. La verificación poblada en navegador y el despliegue remoto siguen dependiendo del Cloud Computer.

## 8. Riesgos

El riesgo semántico principal es que el sistema trate una preferencia como una obligación. El riesgo arquitectónico principal es crear una entidad en TypeScript que el Core Python no pueda leer o escribir. El riesgo de persistencia es introducir la tabla sin incorporar carga, actualización, eventos y pruebas atómicas. El riesgo de producto es que una etiqueta `STRONG` sea interpretada por usuarios como decisión normativa. El riesgo operativo es declarar interoperabilidad antes de probar el adaptador real.

Existe también un riesgo de alcance: incorporar Preferences al Core puede abrir la puerta a pesos, agregación y optimización. Este ciclo debe cerrar explícitamente esa puerta. La entidad debe conservar significado declarativo; cualquier influencia analítica futura requiere un contrato separado y una nueva decisión.

## 9. Decisiones que requieren aprobación humana

| Decisión | Motivo |
|---|---|
| Confirmar si `Preference` forma parte de Core Contract 1.0 o requiere una revisión de contrato. | Cambia la semántica canónica y la compatibilidad. |
| Aprobar los valores y significado de `preference_strength`. | Evita que `STRONG` se interprete como obligación. |
| Aprobar el alcance permitido de una preferencia. | Define sus relaciones ontológicas. |
| Aprobar si la procedencia es opcional, requerida o solo referenciable. | Evita confundir preferencia con evidencia. |
| Aprobar el mecanismo HTTP de escritura. | Endpoint específico y escritura genérica tienen impactos diferentes. |
| Aprobar el modelo de evolución: actualización, nueva versión o nuevo registro. | Afecta auditoría, idempotencia y trazabilidad. |

## 10. Estado de implementación

| Elemento | Estado |
|---|---|
| Protocolo de coordinación ChatGPT–Manus | Adoptado y documentado |
| Product Acceptance Contract SICL 0.6 | Aprobado por Product Owner |
| Preference en fallback web | Implementado y probado localmente |
| Preference en Core Contract Python | **No implementado** |
| Preference en SQLite canónico | **No implementado** |
| Preference en API HTTP canónica | **No implementado** |
| Prueba interoperable Node ↔ Python | **No ejecutada para Preference** |
| Validación arquitectónica independiente | **Pendiente** |
| Aprobación de decisiones de detalle | **Pendiente** |
| Implementación canónica | **Bloqueada hasta validación del presente record** |

## Resultado de coordinación

Manus recomendó inicialmente no codificar hasta validar los detalles. El documento 73 validó la dirección y el Product Owner aprobó la implementación. El cierre y la evidencia se registran a continuación; la verificación remota poblada sigue pendiente por falta de Cloud Computer.


## Cierre del Ciclo 01 — evidencia posterior a la validación

El documento 73 validó la dirección arquitectónica: `Preference` genérica en el Core ahora; representación estética sin motor en Product 0.6; criterios estéticos formalizados en 0.7; evaluación reproducible en 0.7–0.8; visión artificial después de 0.8; y belleza objetiva universal excluida permanentemente.

Con esa validación y la aprobación humana recibida, se implementó `Preference` en el núcleo canónico. El modelo incluye `justification`, `domain`, `strength`, `scope_type`, `scope_id`, `provenance`, `valid_from`, `valid_until` y `status`. `CoreProject` valida referencias a proyecto, objetivo o alternativa. SQLite persiste y carga la entidad en orden de dependencia, con índice por alcance y transacción atómica de creación junto con incremento optimista del proyecto y evento `PREFERENCE_RECORDED`.

El adaptador HTTP se versionó a `sicl-core-http/0.3` y expone `POST /v1/projects/{project_id}/preferences` con autenticación bearer, validación Pydantic, control de versión y payload seguro. El cliente TypeScript y `addRecord` tRPC delegan la escritura cuando existe `SICL_CORE_URL`; el fallback local continúa disponible únicamente bajo la regla de desarrollo explícito. El normalizador TypeScript conserva campos snake_case y la vista analítica expone Preferences como información read-only.

La evidencia ejecutada es la siguiente:

| Verificación | Resultado |
|---|---|
| Suite Python completa | Aprobada |
| Modelo y referencias de Preference | Aprobadas |
| Round-trip SQLite | Aprobado |
| Atomicidad, idempotencia y evento | Aprobadas por el patrón transaccional y regresiones |
| Endpoint HTTP autenticado | Aprobado |
| Payload snake_case del cliente | Aprobado |
| TypeScript | Sin errores |
| Suite web | 60 pruebas aprobadas |
| E2E remoto con Cloud Computer | Pendiente |
| E2E poblado en navegador | Pendiente |

La implementación no añade `weights`, `aesthetic_score`, `beauty`, `dominance`, `learned_preference`, `visual_embedding`, motor estético, visión artificial ni decisiones automáticas. Tampoco convierte `Preference` en `Constraint`, `Recommendation` o `Decision`.

### Estado final del ciclo

**IMPLEMENTADO:** soporte canónico de `Preference` en Python, SQLite, HTTP, cliente tRPC y normalización web.
**VALIDADO:** suites automatizadas locales, prueba HTTP autenticada y regresiones de snapshot.
**PENDIENTE:** despliegue en Cloud Computer, prueba contra URL real, verificación poblada de navegador y validación funcional humana del vertical slice completo.
