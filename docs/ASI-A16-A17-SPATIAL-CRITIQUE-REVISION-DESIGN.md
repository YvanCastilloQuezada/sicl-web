# SiMS-DeI — Diseño A16/A17 y Federación Futura

## Estado y alcance

Este documento inicia la **fase de diseño** para extender A16 y A17 sobre geometría espacial arquitectónica realizada por ASI-G2. También define la configuración declarativa para una futura federación de conocimiento en arquitectura bioclimática y vivienda.

```text
A16 DESIGN = PREPARED / NOT IMPLEMENTED
A17 DESIGN = PREPARED / NOT IMPLEMENTED
KNOWLEDGE FEDERATION CONFIG = DECLARED / NOT ACTIVATED
ASI-G2 = CLOSED / PASS_WITH_OBSERVATIONS
CORE = 4060b4f98224b4403ecbfee5e59042e736ccf5be
WEB BASELINE = 23d5c2d1c93ee4fa346d0913b8d5cec46c64334b
CODE CHANGED BY THIS DOCUMENT = NO
NEW ENDPOINT = NO
NEW DEPENDENCY = NO
HUMAN AUTHORITY = PRESERVED
```

La fase no genera nuevas geometrías, no ejecuta revisiones, no ingiere libros ni activa fuentes externas. Su objetivo es fijar contratos, estados, evidencia y límites antes de cualquier implementación.

## 1. Base técnica verificada en ASI-G2

ASI-G2 habilitó una única mutación genérica:

```text
REALIZE_SPATIAL_ELEMENT
```

La mutación acepta geometría explícita suministrada por una persona, exige validación y autoridad humana, crea un `RESULT ALTERNATIVE`, compone una `SpatialZone` arquitectónica en el `SpatialRepresentation` y permite lectura independiente por A15.

El resultado demostrado para `BEDROOM-01` conservó:

```text
space_id = BEDROOM-01
program_item_id = BEDROOM
space_role = architectural_space
geometry_provenance = HUMAN_SUPPLIED_TEST_INPUT
boundary_status = EXPLICIT_BOUNDARY
actual_area = 6 m²
```

Los controles negativos también quedaron demostrados. Sin autorización no hay resultado ni mutación. La geometría inválida se rechaza. El área objetivo no genera una forma. Un `space_id` duplicado produce conflicto. Las operaciones `SPLIT_MASS`, `CREATE_COURTYARD` y `SET_GAP` no se consideran sustitutos de una realización de espacio.

Las pruebas reportadas fueron:

```text
CORE = 399 passed, 1 warning
WEB = 244 passed / 46 test files
CONTROLLED CORE RUNTIME = PASS
A15 FRESH READ = PASS
```

## 2. Principios constitucionales de A16/A17

A16 y A17 deben preservar las siguientes separaciones:

```text
OBSERVED GEOMETRY ≠ DESIGN QUALITY

GEOMETRY VALID ≠ ARCHITECTURALLY GOOD

TARGET AREA ≠ SATISFIED PROGRAM

A15 OBSERVATION ≠ A16 CRITIQUE

A16 CRITIQUE ≠ A17 REVISION

HYPOTHESIS ≠ EXECUTION

EXECUTION ≠ VERIFICATION

VERIFICATION ≠ RECOMMENDATION

KNOWLEDGE PATTERN ≠ REQUIREMENT

BIOCLIMATIC EVIDENCE ≠ PERFORMANCE CLAIM
```

A16 puede describir tensiones, alineaciones, conflictos y vacíos de evidencia. A17 puede preparar una revisión candidata y someterla a selección y autorización humana. Ninguno puede crear una decisión automáticamente.

## 3. A16 — Crítica de geometría espacial realizada

### 3.1 Entrada canónica

A16 debe consumir únicamente una lectura A15 fresca derivada del `RESULT SpatialRepresentation`:

```text
ArchitecturalDesignReading
→ observedSpaceGeometry
→ observedElements
→ observedHierarchy
→ observedRelationships
→ observedMassVoid
→ observedCirculation
→ observedVerticalOrganization
→ observedSiteRelationship
→ correspondence
→ unknowns / contradictions
```

Para cada espacio arquitectónico explícito, A16 debe recibir al menos:

```text
alternative_id
space_id
program_item_id
spatial_element_id
geometry_type
boundary_status
actual_area
coordinate_system
units
realization_status
geometry_provenance
```

Si el área, la relación, el nivel o la función no están presentes en el estado canónico, la salida debe ser `UNKNOWN` o `UNVERIFIABLE`. No se deben completar mediante inferencia silenciosa.

### 3.2 Categorías de crítica

La crítica espacial se organizará en seis categorías controladas:

| Categoría | Pregunta permitida | Resultado permitido |
|---|---|---|
| `REALIZATION_INTEGRITY` | ¿La geometría realizada conserva identidad y provenance? | `ALIGNED`, `CONFLICT`, `UNKNOWN` |
| `PROGRAM_GEOMETRY` | ¿Existe vínculo verificable entre programa y espacio? | `ALIGNED`, `UNRESOLVED`, `UNKNOWN` |
| `AREA_RELATION` | ¿Cómo se relaciona el área actual con el target declarado? | `BELOW_TARGET`, `AT_TARGET`, `ABOVE_TARGET`, `UNKNOWN` |
| `BOUNDARY` | ¿El límite está explícitamente presente y es válido? | `OBSERVED`, `UNKNOWN` |
| `SPATIAL_RELATIONSHIPS` | ¿Las relaciones observables respaldan la intención? | `PRESERVED`, `TRANSFORMED`, `NOT_REALIZED`, `UNVERIFIABLE` |
| `EVIDENCE_GAP` | ¿Qué información falta para criticar responsablemente? | `UNKNOWN`, `REQUIRES_EVIDENCE` |

`BELOW_TARGET` no significa `BAD`, `NONCOMPLIANT` ni `UNACCEPTABLE`. Solo describe la relación geométrica entre dos valores.

### 3.3 Hallazgo A16

Cada hallazgo debe conservar:

```text
finding_id
subject
category
kind
observation
basis
interpretation
implication
uncertainty
severity
confidence
evidence
knowledge_basis
change_hypotheses
epistemic_status = DERIVED_CRITIQUE
no_decision = true
no_recommendation = true
no_mutation = true
provenance
```

La `basis` debe diferenciar:

```text
OBSERVED_GEOMETRY
PROJECT_INTENT
PROJECT_OBJECTIVE
PROJECT_CONSTRAINT
VERIFIED_ANALYSIS
DESIGN_KNOWLEDGE
REGULATORY_EVIDENCE
HUMAN_INPUT
UNKNOWN_MISSING_EVIDENCE
```

### 3.4 Crítica específica para BEDROOM-01

Con el resultado ASI-G2 conocido, A16 puede afirmar:

```text
BEDROOM-01 = GEOMETRICALLY_REALIZED
BOUNDARY = OBSERVED
ACTUAL_AREA = 6 m²
PROGRAM_LINEAGE = OBSERVED
PROVENANCE = HUMAN_SUPPLIED_TEST_INPUT
```

Si no existe `TARGET_AREA`, A16 no debe generar `BELOW_TARGET`, `AT_TARGET` ni `ABOVE_TARGET`. Si el target de 10 m² se incorpora como dato de proyecto, puede producir:

```text
TARGET_RELATION = BELOW_TARGET
```

No puede producir:

```text
DESIGN_FAILURE
REGULATORY_NONCOMPLIANCE
POOR_LAYOUT
UNSUITABLE BEDROOM
```

porque esas conclusiones requieren evidencia adicional.

### 3.5 Crítica de geometría después de massing

ASI-G2 conserva la geometría explícita cuando se deriva una nueva alternativa massing, pero no transforma automáticamente sus coordenadas. A16 debe clasificar esta situación como:

```text
EXPLICIT_GEOMETRY_STATE = PRESERVED
RELATION TO CHANGED MASSING = REQUIRES_REVIEW
TRANSFORMATION = NOT_AVAILABLE
```

No debe asumir que una habitación sigue dentro de la huella, que conserva orientación o que mantiene relaciones espaciales después de `CHANGE_HEIGHT`, `SCALE_MASS`, `SET_GAP` o `CREATE_COURTYARD`.

## 4. A17 — Revisión controlada de geometría

### 4.1 Entrada

A17 recibe:

```text
A16 ArchitecturalCritique
selected DesignChangeHypothesis
A15 current reading
source Alternative
human selection state
candidate parameters
parameter provenance
```

Una hipótesis debe especificar:

```text
id
finding_id
target
intended_effect
architectural_rationale
required_evidence
candidate_capability
capability_status
uncertainty
epistemic_status = HYPOTHESIS
no_execution = true
```

### 4.2 Gating obligatorio

El flujo de A17 se mantiene:

```text
NOT_SELECTED
→ SELECTED
→ PREPARED
→ AUTHORIZED
→ EXECUTED
→ VERIFIED
```

Si faltan parámetros, la capacidad es `UNSUPPORTED` o la hipótesis no ha sido seleccionada, el estado debe ser `BLOCKED`. La preparación nunca ejecuta.

La autorización debe estar ligada a:

```text
source_alternative
source_finding
selected_hypothesis
candidate_capability
parameters
parameter_provenance
```

No se permite autorizar una revisión para un espacio o alternativa distinta de la que se mostró en el preview.

### 4.3 Revisión soportada inicialmente

La primera revisión compatible con la capacidad existente es una operación massing ya soportada, por ejemplo `SET_GAP`, siempre que A16 haya producido una hipótesis pertinente y la persona la seleccione explícitamente.

Esto significa:

```text
A17 can revise existing massing operation = SUPPORTED
A17 can modify explicit room geometry = UNSUPPORTED
A17 can generate a floor plan = UNSUPPORTED
A17 can create walls/doors/windows = UNSUPPORTED
```

El uso de `SET_GAP` no debe describirse como modificación de un dormitorio, corredor o límite espacial. Es una revisión de massing cuyo efecto sobre la geometría espacial explícita debe releerse.

### 4.4 Readback y re-crítica

Después de una ejecución autorizada, A17 debe:

```text
read result Alternative
regenerate/read result SpatialRepresentation
run fresh A15
run A16 on fresh reading
compare findings before/after
classify transitions
```

Las transiciones permitidas son:

```text
UNCHANGED
RESOLVED
REDUCED
TRANSFORMED
NEW
NO_LONGER_OBSERVABLE
UNKNOWN
```

`RESOLVED` significa solamente que el hallazgo dejó de presentarse bajo la regla de observación utilizada. No significa que la alternativa sea mejor ni que una autoridad deba adoptarla.

### 4.5 Criterios de falso éxito

A17 debe marcar `VERIFIED = false` si ocurre cualquiera de los siguientes casos:

- el resultado no crea una alternativa distinta cuando la operación lo requiere;
- el resultado no puede regenerar la `SpatialRepresentation`;
- el elemento espacial desaparece sin política explícita;
- la geometría autorizada y la observada no coinciden sin transformación declarada;
- el `space_id` o `program_item_id` cambia silenciosamente;
- A15 consume preview en vez de estado resultante;
- el post-critique no puede reconstruirse desde la lectura fresca.

## 5. Contrato futuro de crítica espacial

La siguiente estructura es declarativa y no está implementada todavía:

```text
SpatialCritiqueContext {
  source_alternative_id
  result_alternative_id?
  a15_reading
  target_area?
  project_objectives[]
  project_constraints[]
  verified_analyses[]
  knowledge_references[]
  regulatory_references[]
  unknowns[]
}
```

La salida debe separar:

```text
observations[]
computed_relations[]
interpretations[]
hypotheses[]
unknowns[]
contradictions[]
```

No debe devolver `winner`, `recommendation`, `decision` ni `quality_score`.

## 6. Configuración declarativa de federación futura

La federación de conocimiento se configura como una capacidad futura compatible con RFC-026 y el agente de Design Knowledge. Esta configuración no descarga fuentes, no ingiere documentos y no activa recuperación externa.

### 6.1 Estado de los perfiles

```text
FEDERATION = REGISTERED / NOT_ACTIVATED
BIOCLIMATIC_PROFILE = PREPARED / FROZEN
HOUSING_PROFILE = PREPARED / FROZEN
SOURCE_INGESTION = NOT_AUTHORIZED
RUNTIME_RETRIEVAL = EXISTING RFC-026 ONLY
AUTOMATIC_REQUIREMENT_CREATION = NO
AUTOMATIC_DECISION = NO
```

### 6.2 Perfil bioclimático

```yaml
profile_id: DESIGN-KNOWLEDGE-BIOCLIMATIC-01
status: REGISTERED_NOT_ACTIVATED
domain: BIOCLIMATIC_ARCHITECTURE
priority: FUTURE
supported_scopes:
  - edificacion
  - parcela_sitio
  - zona_barrio_sector
  - distrito_ciudad
  - provincia_metropoli
  - region
  - macro_region
  - pais
knowledge_modes:
  - precedent
  - principle
  - strategy
  - design_question
  - evidence_link
allowed_outputs:
  - source_aware_context
  - strategy_candidate
  - design_hypothesis
  - open_question
  - applicability_note
forbidden_outputs:
  - automatic_requirement
  - compliance_claim
  - performance_claim_without_evidence
  - automatic_recommendation
  - decision
required_provenance:
  - source_id
  - source_title
  - author_or_authority
  - publication_or_revision_date
  - jurisdiction_if_any
  - spatial_scope
  - evidence_status
  - retrieval_context
```

Los dominios candidatos son:

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

Estos dominios son etiquetas de recuperación. No equivalen a módulos de simulación. En particular:

```text
BIOCLIMATIC_KNOWLEDGE ≠ THERMAL_SIMULATION
BIOCLIMATIC_STRATEGY ≠ PERFORMANCE_PROOF
SOLAR_PATTERN ≠ REGULATORY_REQUIREMENT
```

### 6.3 Perfil de vivienda

```yaml
profile_id: DESIGN-KNOWLEDGE-HOUSING-01
status: REGISTERED_NOT_ACTIVATED
domain: HOUSING_ARCHITECTURE
priority: FUTURE
supported_scopes:
  - edificacion
  - parcela_sitio
  - zona_barrio_sector
  - distrito_ciudad
  - provincia_metropoli
knowledge_modes:
  - program_space_relation
  - domestic_pattern
  - housing_precedent
  - typology
  - privacy_strategy
  - access_strategy
  - adaptability_strategy
  - design_question
allowed_outputs:
  - source_aware_context
  - pattern_candidate
  - strategy_candidate
  - design_hypothesis
  - open_question
forbidden_outputs:
  - universal_housing_rule
  - automatic_layout
  - automatic_room_generation
  - investment_recommendation
  - compliance_claim
  - decision
required_provenance:
  - source_id
  - source_title
  - author_or_authority
  - publication_or_revision_date
  - geographic_context
  - typology
  - spatial_scope
  - evidence_status
  - retrieval_context
```

Los dominios candidatos son:

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

El perfil no transforma un patrón de vivienda en un programa obligatorio. Las referencias pueden proponer preguntas, pero no sustituyen la autoridad de quien diseña.

### 6.4 Reglas de federación

Toda futura fuente debe incluir:

```text
source_id
source_type
title
author_or_authority
publication_date
revision_date
language
jurisdiction
geographic_scope
spatial_scope
typology
domain_tags
rights_status
provenance_status
evidence_status
reliability_notes
contradiction_group?
```

La recuperación debe filtrar por:

```text
active SpatialScope
project typology
project stage
user question
available evidence
jurisdiction when relevant
```

La federación debe conservar fuentes contradictorias. No debe fusionar dos posiciones en una regla promedio ni presentar una teoría como hecho del proyecto.

Estados epistemológicos mínimos:

```text
SOURCE_METADATA_ONLY
THEORETICAL
PRECEDENT
STRATEGY_CANDIDATE
PROJECT_EVIDENCE
HUMAN_CONFIRMED
UNKNOWN
CONTRADICTORY
```

## 7. Integración futura con A16

A16 podrá recibir conocimiento federado como una base contextual, no como autoridad automática:

```text
A15 OBSERVED GEOMETRY
+
PROJECT INTENT / OBJECTIVES
+
SOURCE-AWARE BIOCLIMATIC OR HOUSING CONTEXT
→
DERIVED CRITIQUE
```

Cada hallazgo debe indicar si su interpretación procede de:

```text
OBSERVED_GEOMETRY
PROJECT_DATA
VERIFIED_ANALYSIS
DESIGN_KNOWLEDGE
REGULATORY_EVIDENCE
```

Una fuente bioclimática o de vivienda puede aportar una hipótesis de lectura, por ejemplo:

```text
"La orientación puede compararse con estrategias bioclimáticas de la fuente X."
```

No puede afirmar:

```text
"La alternativa cumple confort térmico."
"La vivienda es adecuada."
"Esta es la mejor solución."
```

## 8. Integración futura con A17

A17 puede usar conocimiento federado para enriquecer la justificación de una hipótesis, pero no para ejecutar sin autorización:

```text
A16 FINDING
→ source-aware strategy candidate
→ human selection
→ explicit parameters
→ preview
→ human authorization
→ existing canonical operation
→ readback
→ A15
→ A16
```

La fuente debe permanecer visible en `knowledgeBasis` y en la provenance de la hipótesis. El autor de una fuente no se convierte en agente ni autoridad del proyecto.

## 9. Real Gate futuro

La implementación de federación debe detenerse si requiere:

- una segunda ontología de conocimiento;
- una segunda autoridad de fuentes;
- una ingesta sin derechos verificados;
- un motor de recomendaciones que convierta patrones en requisitos;
- una simulación bioclimática no autorizada;
- una decisión automática;
- un cambio incompatible del contrato Core.

La activación posterior debe identificar explícitamente el perfil, el subconjunto de fuentes, los scopes y las acciones permitidas.

## 10. Próxima fase recomendada

La siguiente fase segura no es todavía la ingesta de libros ni la ejecución de revisiones. Es una implementación controlada de **A16 Geometry-Critical Reading**, limitada a:

1. leer geometría explícita desde A15;
2. comparar target y área real cuando ambos existan;
3. detectar cambios de identidad y provenance;
4. clasificar la relación entre geometría espacial y massing como `REQUIRES_REVIEW` cuando no exista transformación;
5. generar hipótesis A17 sin ejecución;
6. añadir pruebas de falso éxito y no autorización;
7. mantener la federación declarativa como configuración inactiva.

```text
NEXT_IMPLEMENTATION_SLICE = A16 GEOMETRY-CRITICAL READING
A17 EXECUTION = LATER CONTROLLED SLICE
KNOWLEDGE INGESTION = FROZEN
BIOCLIMATIC RETRIEVAL = FROZEN
HOUSING RETRIEVAL = FROZEN
```

## Conclusión

ASI-G2 proporciona una base suficiente para criticar geometría espacial realizada porque ya existe un estado canónico observable y verificable. A16 debe ampliar la crítica sin convertir observaciones geométricas en juicios de calidad. A17 debe convertir únicamente hipótesis seleccionadas por la persona en revisiones autorizadas, con readback y re-crítica.

La federación futura de conocimiento bioclimático y vivienda queda configurada como perfiles declarativos, con provenance, estados epistemológicos, filtros multiescala y prohibiciones explícitas. No se activó ingestión ni recuperación nueva.
