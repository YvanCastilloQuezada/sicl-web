# SiMS-DeI — A17
# Controlled Architectural-Space Geometry Revision

## Estado y decisión de alcance

```text
A17 DESIGN = PREPARED / FROZEN
A17 SPACE-MODIFICATION = NOT IMPLEMENTED
A17 MASSING-REVISION BASELINE = EXISTING / CONTROLLED
A16-GCR = PASS_WITH_OBSERVATIONS / CLOSED BASELINE
A15 = EXISTING / FROZEN BASELINE
ASI-G2 REALIZE_SPATIAL_ELEMENT = EXISTING / SUPPORTED
CORE CHANGE = NO
NEW OPERATION IN THIS DESIGN = NO
KNOWLEDGE FEDERATION = REGISTERED / FROZEN / NOT ACTIVATED
BIOCLIMATIC PROFILE = PREPARED / FROZEN
HOUSING PROFILE = PREPARED / FROZEN
HUMAN AUTHORITY = PRESERVED
```

Este documento inicia el **diseño formal** de A17. No implementa modificación de geometría espacial, no activa la federación de conocimiento, no crea endpoints, no introduce una operación nueva y no ejecuta cambios sobre alternativas.

A17 debe entenderse como un **controlador de revisión**, no como un generador autónomo de arquitectura. Su función futura será llevar un hallazgo A16 hacia una revisión explícita, reversible y verificable, siempre bajo autoridad humana.

## 1. Objetivo

A17 debe permitir que una persona examine un hallazgo de A16, seleccione una hipótesis acotada, prepare sus parámetros, revise un preview y autorice —o rechace— una operación concreta. Después de una ejecución autorizada, el sistema debe leer nuevamente el resultado, ejecutar A15 sobre el estado resultante y volver a ejecutar A16 para clasificar qué cambió.

El ciclo canónico será:

```text
A15 FRESH OBSERVATION
→ A16 GEOMETRY-CRITICAL FINDING
→ BOUNDED CHANGE HYPOTHESIS
→ HUMAN SELECTION
→ PARAMETER PREPARATION
→ PREVIEW
→ EXPLICIT HUMAN AUTHORIZATION
→ CANONICAL EXECUTION
→ RESULT READBACK
→ A15 FRESH READING
→ A16 POST-CHANGE CRITIQUE
→ HUMAN REVIEW
```

Cada transición debe dejar evidencia. La preparación no equivale a autorización. La autorización no equivale a verificación. La verificación no equivale a recomendación.

## 2. Límites constitucionales

A17 debe conservar las siguientes distinciones:

```text
A15 OBSERVATION ≠ A16 CRITIQUE
A16 CRITIQUE ≠ A17 REVISION
HYPOTHESIS ≠ RECOMMENDATION
RECOMMENDATION ≠ DECISION
PREVIEW ≠ EXECUTION
EXECUTION ≠ VERIFICATION
GEOMETRY PRESERVED ≠ GEOMETRY VALID RELATIVE TO CHANGED MASSING
MASSING OPERATION ≠ SPACE-POLYGON MODIFICATION
KNOWLEDGE PATTERN ≠ REQUIREMENT
BIOCLIMATIC CONTEXT ≠ PERFORMANCE PROOF
HOUSING PRECEDENT ≠ UNIVERSAL HOUSING RULE
```

A17 nunca debe crear automáticamente una decisión, un ganador, una preferencia, una recomendación de inversión o una afirmación de cumplimiento.

## 3. Capacidad futura y capacidad actual

### 3.1 Capacidades que ya existen

```text
REALIZE_SPATIAL_ELEMENT = SUPPORTED
PREVIEW = SUPPORTED FOR EXISTING CANONICAL OPERATION PATH
HUMAN AUTHORIZATION GATE = SUPPORTED
RESULT ALTERNATIVE = SUPPORTED
INDEPENDENT READBACK = SUPPORTED
A15 FRESH READ = SUPPORTED
A16 RE-CRITIQUE = SUPPORTED
CONTROLLED MASSING REVISION = EXISTING BASELINE
```

`REALIZE_SPATIAL_ELEMENT` crea una realización espacial explícita suministrada por una persona. No modifica la geometría de un espacio existente.

### 3.2 Capacidades que continúan congeladas

```text
MODIFY_EXISTING_ARCHITECTURAL_SPACE_GEOMETRY = UNSUPPORTED
RESHAPE_SPATIAL_ELEMENT = UNSUPPORTED
RESIZE_ROOM = UNSUPPORTED
MOVE_ROOM = UNSUPPORTED
OFFSET_ROOM = UNSUPPORTED
EDIT_ROOM = UNSUPPORTED
AUTOMATIC_FLOOR_PLAN_GENERATION = UNSUPPORTED
WALL_DOOR_WINDOW_GENERATION = UNSUPPORTED
AUTONOMOUS_REVISION = UNSUPPORTED
```

Las operaciones de massing existentes no pueden utilizarse como sustitutos semánticos de una modificación de dormitorio, baño, circulación o límite espacial.

## 4. Entrada formal de A17

A17 debe recibir una estructura equivalente a la siguiente:

```text
ControlledRevisionRequest {
  sourceAlternativeId: string
  sourceReadingId: string
  sourceFindingId: string
  selectedHypothesisId: string
  candidateCapability: string
  candidateParameters: Record<string, unknown>
  parameterProvenance: ProvenanceRef[]
  humanSelection: HumanSelection
  humanAuthorization?: HumanAuthorization
  requestedScope: "MASSING" | "ARCHITECTURAL_SPACE"
}
```

La solicitud debe rechazar cualquier inconsistencia entre:

```text
sourceAlternativeId
sourceFindingId
selectedHypothesisId
candidateCapability
requestedScope
```

No se puede autorizar una revisión de una alternativa o espacio diferente del que la persona inspeccionó en el preview.

## 5. Hipótesis elegible

Una hipótesis A16 elegible debe contener:

```text
hypothesis_id
finding_id
subject
intended_effect
architectural_rationale
required_evidence
candidate_capability
capability_status
unknowns
knowledge_basis
no_execution = true
```

La hipótesis debe estar causalmente vinculada a un hallazgo. No se aceptan ideas libres generadas por un modelo sin finding, provenance ni evidencia.

Ejemplo válido:

```text
FINDING:
  explicit bedroom geometry exists after a massing change

HYPOTHESIS:
  investigate whether the space remains valid relative to the new massing

CAPABILITY:
  MODIFY_EXISTING_ARCHITECTURAL_SPACE_GEOMETRY

STATUS:
  UNSUPPORTED

EXECUTION:
  NO
```

## 6. Estados de A17

El estado mínimo es:

```text
NOT_SELECTED
→ SELECTED
→ PREPARED
→ PREVIEW_READY
→ AUTHORIZED
→ EXECUTING
→ READBACK_PENDING
→ RECRITIQUE_PENDING
→ VERIFIED
```

Estados de bloqueo y rechazo:

```text
BLOCKED
REJECTED_BY_HUMAN
CANCELLED
FAILED_VALIDATION
FAILED_EXECUTION
FAILED_READBACK
NOT_VERIFIED
```

### 6.1 Reglas de transición

`NOT_SELECTED` solo puede pasar a `SELECTED` mediante una acción humana identificable.

`SELECTED` solo puede pasar a `PREPARED` si la hipótesis está vinculada a un finding y sus parámetros están presentes o se declara explícitamente que faltan.

`PREPARED` solo puede pasar a `PREVIEW_READY` si la operación puede validarse sin mutar el estado fuente.

`PREVIEW_READY` solo puede pasar a `AUTHORIZED` mediante una confirmación humana explícita que incluya la alternativa, el finding, la hipótesis, los parámetros y la operación.

`AUTHORIZED` no implica éxito. La ejecución debe producir un resultado independiente y verificable.

`VERIFIED` solo es válido si existe readback del resultado, lectura A15 fresca, re-crítica A16 y comparación antes/después.

## 7. Autoridad humana

La autorización debe preservar:

```text
human_actor_id
authorization_timestamp
source_alternative_id
source_finding_id
selected_hypothesis_id
candidate_capability
candidate_parameters
parameter_provenance
preview_hash_or_equivalent
authorization_scope
```

La autorización debe ser revocable antes de la ejecución. Si expira, cambia el preview o cambia cualquier parámetro, el estado debe volver a `PREPARED` y exigir una nueva revisión.

Una fuente de conocimiento, un autor, un agente o una hipótesis no puede autorizar una mutación.

## 8. Preview

El preview debe mostrar, como mínimo:

```text
CURRENT ALTERNATIVE
CURRENT SPATIAL REPRESENTATION
A16 FINDING
SELECTED HYPOTHESIS
CANDIDATE CAPABILITY
PARAMETERS
PARAMETER PROVENANCE
EXPECTED SCOPE
KNOWN LIMITATIONS
UNKNOWNS
POSSIBLE POST-CHANGE CHECKS
```

Debe declarar claramente:

```text
PREVIEW_MUTATES_SOURCE = NO
PREVIEW_CREATES_DECISION = NO
PREVIEW_CREATES_RECOMMENDATION = NO
PREVIEW_IS_AUTHORIZATION = NO
```

Para una hipótesis de modificación de espacio existente, el preview debe bloquear la ejecución porque la capacidad todavía está `UNSUPPORTED`.

## 9. Ejecución inicial permitida

La primera ruta ejecutable de A17 continúa siendo la ruta de operaciones canónicas ya existente, cuando el finding sea realmente de massing y la persona la autorice.

Por ejemplo, una revisión `SET_GAP` puede ejecutarse solo si:

```text
finding subject = MASSING
candidate capability = SET_GAP
parameters = complete and validated
human selection = present
human authorization = present
```

El resultado debe describirse como **revisión de massing**. No puede describirse como edición de un dormitorio o modificación de un polígono espacial.

## 10. Modificación espacial futura

La modificación de un espacio arquitectónico existente requerirá una futura activación explícita. El mínimo contrato conceptual sería:

```text
ModifyArchitecturalSpaceGeometry {
  sourceAlternativeId
  sourceSpaceId
  sourceProgramItemId
  sourceGeometryHash
  replacementGeometry
  coordinateSystem
  units
  boundaryStatus
  geometryProvenance
  humanAuthorization
}
```

El contrato futuro deberá validar:

```text
closed geometry
non-degenerate geometry
compatible coordinate system
compatible units
stable space identity
program lineage
duplicate-space conflicts
container relationship when applicable
```

No se autoriza en este documento la creación de dicha operación.

## 11. Readback y re-crítica

Después de una operación autorizada, A17 debe leer el resultado desde la fuente canónica y nunca desde el payload del preview:

```text
RESULT ALTERNATIVE
→ RESULT SpatialRepresentation
→ RESULT SpatialElement / SpatialZone
→ geometry and metadata
→ A15 fresh reading
→ A16 fresh critique
```

La comparación antes/después debe clasificar cada finding como:

```text
UNCHANGED
RESOLVED
REDUCED
TRANSFORMED
NEW
NO_LONGER_OBSERVABLE
UNKNOWN
```

`RESOLVED` significa únicamente que el hallazgo ya no se observa bajo las reglas actuales. No significa que la alternativa sea mejor, correcta u óptima.

## 12. Protección contra falsos éxitos

A17 debe devolver `NOT_VERIFIED` cuando:

- no existe una alternativa resultante independiente;
- no puede regenerarse la representación espacial;
- la geometría cambia sin provenance declarada;
- cambia silenciosamente `space_id` o `program_item_id`;
- A15 consume datos del preview;
- desaparece un elemento sin política explícita;
- la geometría autorizada no coincide con la observada;
- no puede ejecutarse la re-crítica A16;
- el resultado solo contiene un mensaje de éxito sin evidencia geométrica.

## 13. Integración pasiva con federación de conocimiento

La federación bioclimática y de vivienda permanece congelada. A17 puede reservar campos declarativos, pero no puede activar recuperación:

```text
knowledge_context_required: boolean
knowledge_domains_relevant: string[]
knowledge_question: string?
knowledge_references: ProvenanceRef[]
```

Estos campos no deben producir consultas, embeddings, ingesta o llamadas externas en la fase actual.

### 13.1 Perfil bioclimático inicial

```yaml
profile_id: DESIGN-KNOWLEDGE-BIOCLIMATIC-01
status: REGISTERED_NOT_ACTIVATED
scope_selector: SpatialScope + typology + stage + context + objectives
initial_domains:
  - SOLAR_ORIENTATION
  - SOLAR_CONTROL
  - DAYLIGHT
  - NATURAL_VENTILATION
  - THERMAL_MASS
  - SHADE
  - MICROCLIMATE
  - OUTDOOR_COMFORT
  - WATER_AWARENESS
  - CLIMATE_RISK
  - ENERGY_CONTEXT
allowed_outputs:
  - SOURCE_METADATA_ONLY
  - THEORETICAL
  - PRECEDENT
  - STRATEGY_CANDIDATE
  - OPEN_QUESTION
  - UNKNOWN
  - CONTRADICTORY
forbidden_outputs:
  - AUTOMATIC_REQUIREMENT
  - COMPLIANCE_CLAIM
  - PERFORMANCE_CLAIM_WITHOUT_VERIFIED_ANALYSIS
  - AUTOMATIC_RECOMMENDATION
  - DECISION
retrieval: DISABLED
source_ingestion: DISABLED
```

### 13.2 Perfil de vivienda inicial

```yaml
profile_id: DESIGN-KNOWLEDGE-HOUSING-01
status: REGISTERED_NOT_ACTIVATED
scope_selector: SpatialScope + typology + stage + context + objectives
initial_domains:
  - PROGRAM
  - PRIVACY
  - ACCESS
  - DOMESTIC_CIRCULATION
  - FAMILY_STRUCTURE
  - ADAPTABILITY
  - DENSITY
  - SHARED_SPACE
  - OPEN_SPACE
  - INCREMENTALITY
  - AFFORDABILITY_CONTEXT
  - HOUSING_PRECEDENT
allowed_outputs:
  - SOURCE_METADATA_ONLY
  - THEORETICAL
  - PRECEDENT
  - STRATEGY_CANDIDATE
  - PATTERN_CANDIDATE
  - OPEN_QUESTION
  - UNKNOWN
  - CONTRADICTORY
forbidden_outputs:
  - UNIVERSAL_HOUSING_RULE
  - AUTOMATIC_LAYOUT
  - AUTOMATIC_ROOM_GENERATION
  - INVESTMENT_RECOMMENDATION
  - COMPLIANCE_CLAIM
  - DECISION
retrieval: DISABLED
source_ingestion: DISABLED
```

### 13.3 Cómo puede influir conocimiento en A17

La cadena permitida, cuando la federación sea activada en una orden posterior, será:

```text
SOURCE-AWARE CONTEXT
→ A16 FINDING BASIS
→ BOUNDED HYPOTHESIS
→ HUMAN SELECTION
→ HUMAN AUTHORIZATION
→ CANONICAL OPERATION
→ READBACK
```

La cadena prohibida es:

```text
PATTERN
→ AUTOMATIC REQUIREMENT
→ AUTOMATIC ROOM CHANGE
→ AUTOMATIC DECISION
```

Un patrón bioclimático o habitacional puede justificar una pregunta o una hipótesis. No puede autorizar una geometría ni demostrar desempeño del proyecto.

## 14. Integración con ARQUI

ARQUI debe explicar A17 en seis capas:

```text
WHAT I OBSERVE
WHAT I CAN COMPUTE
WHAT THE PROJECT REQUIRES
WHAT THIS MAY INDICATE
WHAT I CANNOT DETERMINE
WHAT THE HUMAN MAY INVESTIGATE NEXT
```

La interfaz debe mostrar la diferencia entre:

```text
CRITIQUE
HYPOTHESIS
PREVIEW
AUTHORIZATION
RESULT
VERIFICATION
```

No se debe crear un dashboard separado. La superficie visual existente de ARQUI/A16 debe reutilizarse.

## 15. Real Gate de A17

A17 debe detenerse y devolver `REAL_GATE` si el siguiente paso requiere:

- nueva entidad canónica del Core;
- cambio incompatible del Core Contract;
- nueva autoridad de fuentes;
- nueva operación de mutación espacial;
- motor de adyacencia o containment no existente;
- reparación automática de geometría;
- ingesta o recuperación federada;
- simulación bioclimática;
- reglas habitacionales universales;
- decisión automática.

El gate debe reportar exactamente la capacidad faltante y no intentar resolverla mediante una operación de massing.

## 16. Plan de fases futuras

### A17-D0 — Contrato y estados

Definir tipos, estados, payload de preview, autorización, rechazo, expiración y readback. No ejecutar todavía modificación espacial.

### A17-D1 — Handoff controlado desde A16

Conectar findings e hipótesis con selección humana, sin activar una nueva operación. Validar que una hipótesis unsupported quede bloqueada.

### A17-D2 — Revisión de massing existente

Reutilizar únicamente operaciones ya soportadas y demostrar la cadena A16 → selección → autorización → operación → A15 → A16.

### A17-D3 — Real Gate para espacio existente

Presentar una orden independiente para decidir si se activa la modificación de un único espacio arquitectónico. Este gate debe ocurrir antes de crear una operación nueva.

### A17-D4 — Piloto de modificación espacial

Solo si D3 es aprobado: implementar una modificación acotada con validación geométrica, lineage, conflicto, readback y re-crítica.

## 17. Criterios de aceptación futuros

A17 no podrá considerarse verificado si no demuestra:

```text
HUMAN_SELECTION = PRESENT
HUMAN_AUTHORIZATION = PRESENT
PREVIEW_NO_MUTATION = PASS
SOURCE_IMMUTABILITY = PASS
PARAMETER_PROVENANCE = PASS
RESULT_ALTERNATIVE = PRESENT
READBACK = PASS
A15_FRESH_READ = PASS
A16_POST_CRITIQUE = PASS
NO_FALSE_SUCCESS = PASS
NO_AUTOMATIC_DECISION = PASS
```

Para modificación espacial, además:

```text
SPACE_ID_PRESERVED = PASS
PROGRAM_LINEAGE_PRESERVED = PASS
GEOMETRY_VALID = PASS
DUPLICATE_CONFLICT_CONTROL = PASS
CONTAINER_STATE = EXPLICIT OR UNKNOWN
RELATIVE_MASSING_VALIDITY = EXPLICIT OR REQUIRES_REVIEW
```

## 18. Estado final de esta orden

```text
A17 FORMAL DESIGN = COMPLETED / FROZEN
A17 IMPLEMENTATION = NOT AUTHORIZED BY THIS DOCUMENT
A17 SPACE MODIFICATION = UNSUPPORTED
A17 EXISTING MASSING REVISION = EXISTING CONTROLLED BASELINE
FEDERATION PARAMETERS = CONFIGURED DECLARATIVELY
BIOCLIMATIC RETRIEVAL = DISABLED
HOUSING RETRIEVAL = DISABLED
SOURCE INGESTION = DISABLED
CORE CHANGED = NO
WEB PRODUCT CODE CHANGED = NO
NEW DEPENDENCY = NO
PUSH = NO
PR = NO
MERGE = NO
DEPLOYMENT = NO
```

## References

[1]: docs/ARCHITECTURAL-SPACE-INTELLIGENCE-A16-GCR-FINAL.md "A16-GCR Geometry-Critical Reading final report"
[2]: docs/KNOWLEDGE-FEDERATION-NEGATIVE-CONTROLS-CONFIG.md "Knowledge federation safeguards and declarative profiles"
[3]: docs/ASI-A16-A17-SPATIAL-CRITIQUE-REVISION-DESIGN.md "Previous A16/A17 spatial critique and revision design"
