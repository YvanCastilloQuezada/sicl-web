# SiMS-DeI — Controles negativos y configuración futura de federación

## Estado

```text
AUDIT_MODE = READ_ONLY
CODE_CHANGED = NO
CORE_CHANGED = NO
WEB_PRODUCT_CODE_CHANGED = NO
FEDERATION = REGISTERED / NOT_ACTIVATED
BIOCLIMATIC_PROFILE = PREPARED / FROZEN
HOUSING_PROFILE = PREPARED / FROZEN
SOURCE_INGESTION = NOT_AUTHORIZED
AUTOMATIC_DECISION = NO
HUMAN_AUTHORITY = PRESERVED
```

Este documento no activa fuentes, no ingiere libros, no añade dependencias y no crea una segunda autoridad de conocimiento.

## 1. Auditoría de controles negativos

### 1.1 Autorización humana

La operación `REALIZE_SPATIAL_ELEMENT` tiene dos estados epistemológicos distintos:

```text
PREVIEW
≠
EXECUTED RESULT
```

La prueba sin confirmación produjo:

```text
HUMAN_CONFIRMATION_REQUIRED
RESULT_ALTERNATIVE = NONE
MUTATION = NONE
```

La ejecución positiva solo continuó después de `human_confirmed=true`. Por ello, la cadena actual no permite que un preview sea interpretado como autorización.

### 1.2 Inmutabilidad de la fuente

La prueba E2E verificó:

```text
SOURCE_ALTERNATIVE = UPAO-001-A
SOURCE_EXPLICIT_REALIZATIONS = []
RESULT_ALTERNATIVE = UPAO-001-A-SPACE-BEDROOM-01
SOURCE ≠ RESULT
```

La geometría explícita se transporta en el resultado derivado. No se incorpora silenciosamente a la alternativa fuente.

### 1.3 Geometría inválida

El contrato rechaza polígonos abiertos o degenerados. La prueba focalizada verificó el rechazo de un polígono sin cierre:

```text
INVALID CLOSED POLYGON → REJECTED
```

No existe reparación automática. El sistema no agrega puntos, no corrige orientación ni inventa un límite alternativo.

### 1.4 Área objetivo sin geometría

El área no genera geometría. Una futura entrada de `target_area` solo puede ser comparada contra un área calculada desde una geometría resultante cuando ambos valores existan.

```text
TARGET_AREA WITHOUT EXPLICIT GEOMETRY
→ NO REALIZATION
→ ACTUAL_AREA = UNKNOWN
```

El sistema no convierte metros cuadrados en un dormitorio, una planta o una habitación.

### 1.5 Identidad duplicada

Una segunda realización con el mismo `space_id` produce conflicto:

```text
DUPLICATE SPACE_ID → SPATIAL_REALIZATION_CONFLICT
```

No hay sobrescritura silenciosa, merge implícito ni sustitución de provenance.

### 1.6 Control semantic-only

`BATH-01` se conserva como control sin geometría explícita. La prueba E2E verificó que no se genera una `SpatialZone` colateral:

```text
BATH-01 = SEMANTIC-ONLY
GEOMETRY = NONE
ACTUAL_AREA = UNKNOWN
COLLATERAL_REALIZATION = NONE
```

El alcance de ASI-G2 es atómico: una realización explícita no materializa las demás entidades semánticas.

### 1.7 Readback independiente

El resultado no se considera válido por el contenido de la respuesta de la operación. Deben leerse por separado:

```text
RESULT ALTERNATIVE
→ RESULT SpatialRepresentation
→ TARGET SpatialZone
→ geometry
→ actual area
→ A15 fresh observation
```

El readback P2R-V verificó:

```text
GEOMETRY_MATCH = YES
ACTUAL_AREA_SOURCE = RESULT_GEOMETRY_COMPUTATION
PREVIEW_INJECTED_AS_OBSERVATION = NO
TARGET_AREA_USED_AS_ACTUAL = NO
```

### 1.8 Protección contra falso éxito

Una ejecución solo puede clasificarse como verificada si existe una alternativa resultante, una representación resultante, una zona espacial canónica, una geometría coincidente y una lectura A15 fresca.

```text
OPERATION_SUCCESS WITHOUT VALID READBACK
→ NOT VERIFIED
```

A17 conserva la misma protección: si no hay `geometryChanged`, resultado, readback y post-critique, el estado no alcanza `VERIFIED`.

### 1.9 Límites actuales

```text
SPACE_REALIZATION = SUPPORTED
SPACE_MODIFICATION = UNSUPPORTED
SPACE_GENERATION = UNSUPPORTED
FLOOR_PLAN_GENERATION = UNSUPPORTED
WALL_DOOR_WINDOW_MODEL = UNSUPPORTED
BIM_ROOM_CREATION = UNSUPPORTED
AUTONOMOUS_GEOMETRY = UNSUPPORTED
```

Estas limitaciones son controles de seguridad, no fallos que deban ocultarse.

## 2. Parámetros declarativos de federación futura

### 2.1 Parámetros globales

```yaml
federation_id: DESIGN-KNOWLEDGE-FEDERATION-01
status: REGISTERED_NOT_ACTIVATED
activation_requires: EXPLICIT_PRODUCT_OWNER_ORDER
runtime_retrieval: EXISTING_RFC026_ONLY
source_ingestion: DISABLED
external_fetch: DISABLED
llm_authority: NONE
requirement_generation: DISABLED
compliance_claims: DISABLED
recommendation_generation: DISABLED
decision_creation: DISABLED
human_review_required_for_project_use: true
contradiction_preservation: true
unknown_preservation: true
```

### 2.2 Perfil bioclimático

```yaml
profile_id: DESIGN-KNOWLEDGE-BIOCLIMATIC-01
domain: BIOCLIMATIC_ARCHITECTURE
status: REGISTERED_NOT_ACTIVATED
priority: FUTURE
scopes:
  - edificacion
  - parcela_sitio
  - zona_barrio_sector
  - distrito_ciudad
  - provincia_metropoli
  - region
  - macro_region
  - pais
typologies:
  - housing
  - educational
  - health
  - mixed_use
  - public
  - landscape
  - infrastructure
knowledge_modes:
  - principle
  - precedent
  - strategy
  - design_question
  - evidence_link
  - contradiction
allowed_epistemic_outputs:
  - SOURCE_METADATA_ONLY
  - THEORETICAL
  - PRECEDENT
  - STRATEGY_CANDIDATE
  - UNKNOWN
  - CONTRADICTORY
forbidden_outputs:
  - AUTOMATIC_REQUIREMENT
  - COMPLIANCE_CLAIM
  - PERFORMANCE_CLAIM_WITHOUT_VERIFIED_ANALYSIS
  - AUTOMATIC_RECOMMENDATION
  - DECISION
```

Dominios de recuperación iniciales:

```text
SOLAR_ORIENTATION
SOLAR_CONTROL
DAYLIGHT
NATURAL_VENTILATION
THERMAL_MASS
SHADE
MICROCLIMATE
OUTDOOR_COMFORT
WATER_AWARENESS
CLIMATE_RISK
ENERGY_CONTEXT
```

Estos dominios clasifican conocimiento. No activan simulación solar, térmica, energética, CFD o confort.

```text
BIOCLIMATIC_KNOWLEDGE ≠ THERMAL_SIMULATION
BIOCLIMATIC_STRATEGY ≠ PERFORMANCE_PROOF
SOLAR_PATTERN ≠ REGULATORY_REQUIREMENT
```

### 2.3 Perfil de vivienda

```yaml
profile_id: DESIGN-KNOWLEDGE-HOUSING-01
domain: HOUSING_ARCHITECTURE
status: REGISTERED_NOT_ACTIVATED
priority: FUTURE
scopes:
  - edificacion
  - parcela_sitio
  - zona_barrio_sector
  - distrito_ciudad
  - provincia_metropoli
  - region
typologies:
  - single_family
  - multifamily
  - collective
  - incremental
  - social_housing
  - mixed_use_housing
knowledge_modes:
  - program_space_relation
  - domestic_pattern
  - housing_precedent
  - typology
  - privacy_strategy
  - access_strategy
  - adaptability_strategy
  - design_question
  - contradiction
allowed_epistemic_outputs:
  - SOURCE_METADATA_ONLY
  - THEORETICAL
  - PRECEDENT
  - STRATEGY_CANDIDATE
  - PATTERN_CANDIDATE
  - UNKNOWN
  - CONTRADICTORY
forbidden_outputs:
  - UNIVERSAL_HOUSING_RULE
  - AUTOMATIC_LAYOUT
  - AUTOMATIC_ROOM_GENERATION
  - INVESTMENT_RECOMMENDATION
  - COMPLIANCE_CLAIM
  - DECISION
```

Dominios de recuperación iniciales:

```text
PROGRAM
PRIVACY
ACCESS
DOMESTIC_CIRCULATION
FAMILY_STRUCTURE
ADAPTABILITY
DENSITY
SHARED_SPACE
OPEN_SPACE
INCREMENTALITY
AFFORDABILITY_CONTEXT
HOUSING_PRECEDENT
```

Un patrón habitacional puede aportar contexto o una pregunta de diseño. No puede crear automáticamente un programa, una habitación, una distribución ni una recomendación de inversión.

## 3. Registro obligatorio de fuente

Toda fuente futura debe incluir, como mínimo:

```yaml
source_id: required
author_or_authority: required
title: required
source_type: required
language: required
publication_date: required
revision_date: optional
rights_status: required
jurisdiction: optional
geographic_scope: required
spatial_scope: required
typology: optional
domain_tags: required
provenance_status: required
evidence_status: required
reliability_notes: required
contradiction_group: optional
retrieval_context: required
```

Estados de derechos y evidencia deben ser independientes:

```text
RIGHTS_VERIFIED
RIGHTS_PENDING
RIGHTS_UNKNOWN

SOURCE_METADATA_ONLY
THEORETICAL
PRECEDENT
PROJECT_EVIDENCE
HUMAN_CONFIRMED
UNKNOWN
CONTRADICTORY
```

Una fuente con derechos no verificados no puede ingresar al corpus activo. Una fuente teórica no se puede presentar como hecho del proyecto.

## 4. Filtros de recuperación

La recuperación futura deberá exigir coincidencia o compatibilidad explícita con:

```text
active SpatialScope
project typology
project stage
user question
available evidence
geographic context
jurisdiction when relevant
domain
```

Debe devolver también las razones de exclusión y las preguntas abiertas. No debe ocultar contradicciones por conveniencia de interfaz.

## 5. Integración con A16

El conocimiento federado puede servir como contexto para una crítica:

```text
A15 OBSERVED GEOMETRY
+
PROJECT INTENT / OBJECTIVES
+
SOURCE-AWARE BIOCLIMATIC OR HOUSING CONTEXT
→
A16 DERIVED CRITIQUE
```

Cada hallazgo debe conservar su base:

```text
OBSERVED_GEOMETRY
PROJECT_DATA
VERIFIED_ANALYSIS
DESIGN_KNOWLEDGE
REGULATORY_EVIDENCE
HUMAN_INPUT
UNKNOWN_MISSING_EVIDENCE
```

Ejemplo permitido:

```text
La orientación de la alternativa puede compararse con la estrategia solar descrita por la fuente X.
```

Ejemplos prohibidos sin evidencia adicional:

```text
La alternativa cumple confort térmico.
La vivienda es adecuada.
La orientación es óptima.
La solución es reglamentaria.
```

## 6. Integración con A17

El conocimiento puede justificar una hipótesis, pero no puede autorizarla ni ejecutarla:

```text
A16 FINDING
→ source-aware strategy candidate
→ human selection
→ explicit parameters
→ preview
→ human authorization
→ existing canonical operation
→ result readback
→ A15
→ A16
```

La fuente debe aparecer en `knowledgeBasis`, la hipótesis debe conservar `noExecution=true` y la autorización debe pertenecer a la persona, no a la fuente, al autor ni al agente.

## 7. Real Gate de activación

La federación no puede activarse si requiere:

- una segunda ontología de conocimiento;
- una segunda autoridad de fuentes;
- ingesta sin derechos verificados;
- convertir patrones en requisitos;
- simulación bioclimática no autorizada;
- recomendaciones de inversión;
- decisiones automáticas;
- un cambio incompatible del Core Contract.

La activación futura deberá identificar exactamente:

```text
profile_id
source_subset
rights_status
scopes
typologies
allowed_outputs
forbidden_outputs
human_review_gate
rollback_or_deactivation_rule
```

## 8. Resultado de la auditoría

```text
FALSE_SUCCESS_PROTECTION = PASS
HUMAN_AUTHORITY = PRESERVED
SOURCE_IMMUTABILITY = PASS
NO_AUTHORIZATION_CONTROL = PASS
INVALID_GEOMETRY_CONTROL = PASS
DUPLICATE_ID_CONTROL = PASS
SEMANTIC_ONLY_CONTROL = PASS
INDEPENDENT_READBACK = PASS
PARAMETER_FABRICATION = NONE
AUTONOMOUS_GEOMETRY = NO
```

La federación bioclimática y de vivienda queda **configurada como dirección futura declarativa**, pero permanece congelada y sin recuperación activa.
