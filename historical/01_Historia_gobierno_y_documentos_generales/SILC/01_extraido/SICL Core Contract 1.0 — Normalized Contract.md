# SICL Core Contract 1.0 — Normalized Contract

**Estado:** propuesta contractual normalizada para auditoría y aprobación  
**Baseline legacy:** SICL 0.2.5, tag `v0.2.5-acceptance`  
**Propósito:** cerrar la semántica del núcleo antes de implementar SICL 0.3.

## 1. Decisión de alcance

Core Contract 1.0 define la semántica de las entidades, sus referencias, sus estados y sus invariantes. No implementa perfiles profesionales, pesos de perfiles, IA, GIS, BIM, Event Sourcing, optimización avanzada ni motores profesionales de factibilidad.

La regla de gobierno es:

> Ninguna relación importante se resolverá por nombre, posición, orden de creación o inferencia. Si la relación tiene significado, debe existir como referencia explícita o el sistema debe declarar que no puede establecerla.

Core Contract 1.0 será una ruptura compatible hacia adelante: los proyectos creados bajo 0.2.5 permanecen legacy y no se rellenarán sus relaciones faltantes mediante conjeturas.

## 2. Vocabulario normativo

| Término | Significado contractual |
|---|---|
| **Project** | Unidad raíz de identidad, alcance y persistencia. |
| **Context** | Condición o marco espacial, social, económico o regulatorio que explica una necesidad. |
| **Requirement** | Necesidad declarada del proyecto, vinculada a un Context. |
| **Objective** | Intención evaluable derivada de un Requirement; siempre tiene dirección explícita. |
| **Constraint** | Condición que limita o regula el proyecto, una alternativa o un objetivo dentro de un ámbito explícito. |
| **Alternative** | Opción de diseño o acción que puede evaluarse. Puede existir sin datos completos. |
| **Evaluation** | Resultado reproducible de aplicar un método catalogado a una Alternative. |
| **Comparison** | Relación analítica entre evaluaciones seleccionadas; puede no producir ganador. |
| **TradeOff** | Estado que registra ventajas y sacrificios entre alternativas no dominadas. |
| **Recommendation** | Propuesta analítica o humana; nunca equivale a una decisión. |
| **Decision** | Acto de autoridad humana; siempre conserva responsable y justificación. |
| **FeasibilityAssessment** | Evaluación separada de cumplimiento de restricciones; no es sinónimo de rendimiento. |
| **Event** | Registro append-only de una operación o hecho; no implica Event Sourcing. |

## 3. Entidades y campos contractuales

### 3.1 Project

| Campo | Tipo | Regla |
|---|---|---|
| `project_id` | string | Obligatorio, único. |
| `name` | string | Obligatorio, no vacío. |
| `description` | string nullable | Opcional. |
| `status` | `DRAFT \| ACTIVE \| COMPLETED \| ARCHIVED` | `DRAFT` por defecto. |
| `contract_version` | string | Obligatorio; `1.0`. |
| `created_at` | timestamp | Inmutable. |
| `updated_at` | timestamp | Cambia con modificación válida. |
| `entity_version` | integer | Comienza en 1; incrementa con modificación válida. |

### 3.2 Context

Un proyecto puede tener múltiples contextos. Un Context pertenece a un Project y no se vincula a un Requirement por texto.

| Campo | Tipo | Regla |
|---|---|---|
| `context_id` | string | Obligatorio, único dentro del Project. |
| `project_id` | string | FK a Project. |
| `name` | string | Obligatorio. |
| `description` | string nullable | Opcional. |
| `context_type` | `PHYSICAL \| SOCIAL \| ECONOMIC \| REGULATORY` | Obligatorio. |
| `created_at`, `updated_at` | timestamp | Ciclo de vida. |
| `entity_version` | integer | Versionado de entidad. |

### 3.3 Requirement

| Campo | Tipo | Regla |
|---|---|---|
| `requirement_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `context_id` | string | FK a Context del mismo Project; obligatorio. |
| `name` | string | Obligatorio. |
| `description` | string nullable | Opcional. |
| `priority` | `MUST \| SHOULD \| COULD \| WONT` | Obligatorio. |
| `created_at`, `updated_at` | timestamp | Ciclo de vida. |
| `entity_version` | integer | Versionado de entidad. |

### 3.4 Objective

| Campo | Tipo | Regla |
|---|---|---|
| `objective_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `requirement_id` | string | FK a Requirement del mismo Project; obligatorio. |
| `name` | string | Obligatorio. |
| `description` | string nullable | Opcional. |
| `direction` | `MINIMIZE \| MAXIMIZE` | Obligatorio; nunca se infiere. |
| `weight` | decimal nullable | Opcional; si existe, debe estar en `[0,1]`. No se usa en 1.0 para resolver automáticamente. |
| `created_at`, `updated_at` | timestamp | Ciclo de vida. |
| `entity_version` | integer | Versionado de entidad. |

### 3.5 Constraint

La propuesta original hacía que toda Constraint dependiera de un Objective. Se modifica para no imponer una ontología demasiado estrecha: una restricción puede tener ámbito de Project, Objective o Alternative, pero exactamente uno debe declararse.

| Campo | Tipo | Regla |
|---|---|---|
| `constraint_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `scope_type` | `PROJECT \| OBJECTIVE \| ALTERNATIVE` | Obligatorio. |
| `scope_id` | string | Referencia al objeto indicado por `scope_type`. |
| `name` | string | Obligatorio. |
| `constraint_type` | `HARD \| SOFT` | Obligatorio. |
| `metric` | string | Debe identificar una métrica evaluable. |
| `operator` | `LT \| LE \| EQ \| GE \| GT \| NE` | Obligatorio. |
| `threshold` | número | Obligatorio. |
| `tolerance` | número nullable | Solo permitido para `SOFT`; no negativo. |
| `source_ref` | string nullable | Referencia a evidencia o fuente; no se inventa. |
| `created_at`, `updated_at` | timestamp | Ciclo de vida. |
| `entity_version` | integer | Versionado de entidad. |

### 3.6 Alternative

`Alternative.data` admite únicamente escalares serializables en 1.0. No se exige que exista contenido en el momento de crear la alternativa; cada método declara sus propios inputs requeridos.

| Campo | Tipo | Regla |
|---|---|---|
| `alternative_id` | string | Obligatorio, único dentro del Project. |
| `project_id` | string | FK a Project. |
| `name` | string | Obligatorio. |
| `description` | string nullable | Opcional. |
| `data` | `Map[string, scalar]` | Puede estar vacío; no admite estructuras anidadas. |
| `created_at`, `updated_at` | timestamp | Ciclo de vida. |
| `entity_version` | integer | Versionado de entidad. |

### 3.7 Evaluation

| Campo | Tipo | Regla |
|---|---|---|
| `evaluation_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `alternative_id` | string | FK a Alternative del mismo Project. |
| `criterion` | string | Debe corresponder a un Objective o declararse como criterio explícito del contexto de evaluación. |
| `method` | catálogo cerrado | Obligatorio; método desconocido produce `UNKNOWN_METHOD`. |
| `direction` | `MINIMIZE \| MAXIMIZE` | Obligatoria en 1.0; debe coincidir con el Objective relacionado. |
| `inputs` | `Map[string, scalar]` | Debe contener los inputs exigidos por el método. |
| `output` | número | Resultado calculado o declarado según método. |
| `unit` | string | Unidad contractual del output. |
| `performance_version` | string | Versión del cálculo. |
| `contract_version` | string | Contrato que interpreta la evaluación. |
| `evidence_ids` | lista de IDs | Cada referencia debe existir cuando se declara. |
| `created_at` | timestamp | Inmutable. |

Una Evaluation no declara por sí sola que la alternativa sea factible.

### 3.8 FeasibilityAssessment

Se incorpora como entidad separada para evitar que el estado de factibilidad sea un campo ambiguo dentro del rendimiento.

| Campo | Tipo | Regla |
|---|---|---|
| `assessment_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `alternative_id` | string | FK a Alternative. |
| `status` | `UNKNOWN \| FEASIBLE \| INFEASIBLE \| HUMAN_REVIEW_REQUIRED \| INSUFFICIENT_DATA` | `UNKNOWN` por defecto. |
| `constraint_results` | lista de resultados | Cada resultado refiere a una Constraint concreta. |
| `evidence_ids` | lista de IDs | Evidencia verificable si existe. |
| `method_version` | string nullable | Obligatorio si el sistema calcula automáticamente. |
| `reviewer` | string nullable | Obligatorio para `HUMAN_REVIEW_REQUIRED` o revisión humana. |
| `message` | string nullable | Explica el estado sin sustituir los datos. |
| `created_at` | timestamp | Inmutable. |

La implementación automática de esta entidad queda fuera de SICL 0.2.5 y será decidida durante SICL 0.3.

### 3.9 Comparison y MultiCriteriaComparison

Una comparación debe conservar las evaluaciones concretas utilizadas. `winner` es nullable.

| Campo | Tipo | Regla |
|---|---|---|
| `comparison_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `evaluation_ids` | lista de IDs | Al menos dos para una comparación binaria o comparativa. |
| `criterion` / `criteria` | string o lista | Criterios comparados. |
| `direction` / `directions` | dirección o mapa | Siempre explícita. |
| `status` | `DOMINANT \| TRADE_OFF \| INSUFFICIENT_DATA` | Obligatorio. |
| `winner` | alternative ID nullable | Prohibido en `TRADE_OFF` e `INSUFFICIENT_DATA`. |
| `values` | mapa | Valores usados para reproducir el resultado. |
| `method` | string | `DIRECT_COMPARISON` o `PARETO_DOMINANCE` en 1.0. |
| `created_at` | timestamp | Inmutable. |

### 3.10 TradeOff

Un TradeOff se crea únicamente cuando una comparación multicriterio tiene estado `TRADE_OFF`. No resuelve por sí mismo el intercambio ni selecciona ganador.

### 3.11 Recommendation

| Campo | Tipo | Regla |
|---|---|---|
| `recommendation_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `alternative_id` | string | FK a Alternative. |
| `source` | `ANALYTICAL \| HUMAN` | Obligatorio. |
| `based_on` | Comparison ID nullable | Obligatorio si `source=ANALYTICAL`; opcional si `HUMAN`. |
| `reason` | string | Obligatorio. |
| `created_at` | timestamp | Inmutable. |

### 3.12 Decision

| Campo | Tipo | Regla |
|---|---|---|
| `decision_id` | string | Obligatorio. |
| `project_id` | string | FK a Project. |
| `recommendation_id` | string nullable | Opcional; si existe, debe referir a Recommendation válida. |
| `selected_alternative_id` | string | FK a Alternative. |
| `decision_maker` | string | Obligatorio. |
| `decision_type` | `HUMAN` | Único valor permitido en 1.0. |
| `rationale` | string | Obligatorio; no se sustituye por Recommendation. |
| `created_at` | timestamp | Inmutable. |

## 4. Relaciones aprobadas

| Relación | Cardinalidad | Regla de integridad |
|---|---:|---|
| Project → Context | 1:N | Context pertenece al mismo Project. |
| Context → Requirement | 1:N | Requirement requiere Context explícito. |
| Requirement → Objective | 1:N | Objective requiere Requirement explícito. |
| Project / Objective / Alternative → Constraint | 1:N | Constraint requiere un único ámbito explícito. |
| Project → Alternative | 1:N | Alternative pertenece al Project. |
| Alternative → Evaluation | 1:N | Evaluation requiere Alternative y Project. |
| Evaluation → Comparison | N:M | Comparison conserva todos los IDs usados. |
| Comparison → TradeOff | 1:0..1 | Solo si el estado es `TRADE_OFF`. |
| Comparison → Recommendation | 1:N | Solo para Recommendation `ANALYTICAL`. |
| Recommendation → Decision | 0:N | Decision puede existir sin Recommendation. |
| Alternative → FeasibilityAssessment | 1:N | Assessment separado de Evaluation. |

## 5. Invariantes no negociables

| ID | Invariante |
|---|---|
| INV-001 | No existe dirección por defecto. |
| INV-002 | No existe ganador en `TRADE_OFF` o `INSUFFICIENT_DATA`. |
| INV-003 | Método fuera del catálogo produce `UNKNOWN_METHOD`. |
| INV-004 | Recommendation analítica requiere Comparison existente. |
| INV-005 | Recommendation y Decision son tipos distintos. |
| INV-006 | Decision siempre es `HUMAN` y conserva rationale y decision_maker. |
| INV-007 | Evaluation de rendimiento no equivale a factibilidad. |
| INV-008 | Toda referencia declarada debe apuntar a una entidad del mismo Project. |
| INV-009 | Ninguna relación se resuelve por texto, posición o última entidad creada. |
| INV-010 | Eventos persistidos no se actualizan ni eliminan mediante operaciones normales. |
| INV-011 | Un cálculo reproducible conserva método, inputs, output, unidad y versiones. |
| INV-012 | Los datos legacy de 0.2.5 no reciben relaciones inventadas durante migración. |

## 6. Estados de respuesta

| Estado | Significado | Efecto |
|---|---|---|
| `OK` | Operación válida completada. | Puede persistir entidad o resultado. |
| `INSUFFICIENT_DATA` | Faltan datos o una dirección explícita. | No crea ganador, comparación analítica ni recomendación automática. |
| `UNKNOWN_METHOD` | Método no pertenece al catálogo. | No crea Evaluation. |
| `INVALID_REFERENCE` | ID inexistente o de otro Project. | No crea ni modifica entidad. |
| `INVALID_ARGUMENT` | Violación de formato o dominio. | No crea ni modifica entidad. |
| `HUMAN_REVIEW_REQUIRED` | El sistema no puede resolver sin autoridad profesional. | No produce decisión automática. |

## 7. Compatibilidad y migración

SICL 0.2.5 permanece disponible como legacy. No se modificará su historial para agregar `context_id`, `requirement_id`, `objective_id`, `scope_id` o `recommendation_id` donde no existan.

La migración permitida es forward-only:

1. Crear un nuevo proyecto bajo Core Contract 1.0.
2. Importar únicamente datos con referencias explícitas comprobables.
3. Marcar lo no trazable como legacy o `INSUFFICIENT_DATA`.
4. No convertir nombres coincidentes en relaciones.
5. Conservar una referencia al origen 0.2.5 cuando se importe un dato.

No se aprobará una migración automática hasta disponer de pruebas de conservación de identidad y de no invención semántica.

## 8. Criterios de salida antes de SICL 0.3

| Área | Criterio de salida |
|---|---|
| Dominio | Todas las invariantes tienen tests unitarios sin SQLite ni CLI. |
| Relaciones | Se puede recorrer una Constraint hasta su Context usando IDs, sin búsqueda textual. |
| Comparación | TradeOff nunca crea ganador y la insuficiencia nunca crea comparación válida. |
| Recomendación/decisión | Se prueban Recommendation analítica, Recommendation humana y Decision independiente. |
| Factibilidad | Se decide si `FeasibilityAssessment` será motor automático, revisión humana o ambos. |
| Persistencia | FK, restricciones de integridad y round-trip están probados. |
| Eventos | Se documenta formalmente snapshot + event log o se aprueba Event Sourcing por separado. |
| Migración | Existe estrategia forward-only y prueba de no inferencia sobre datos legacy. |
| Reproducibilidad | Existe commit/tag, suite completa y vertical slice documentado. |

## 9. Decisión final

Este documento reemplaza las ambigüedades de la propuesta inicial y queda como **Core Contract 1.0 normalizado para auditoría**. Todavía no es autorización para implementar SICL 0.3. La siguiente acción es construir un prototipo de dominio puro con estas entidades e invariantes, auditarlo y solo después diseñar la persistencia.
