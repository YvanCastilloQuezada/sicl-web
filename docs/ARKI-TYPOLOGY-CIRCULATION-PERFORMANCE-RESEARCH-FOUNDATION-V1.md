# ARKI — TYPOLOGY, CIRCULATION & PERFORMANCE
# RESEARCH FOUNDATION v1.0

**STATUS:** `APPROVED_RESEARCH_FOUNDATION`  
**SOFTWARE_STATUS:** `NOT_IMPLEMENTED_BY_THIS_DOCUMENT`  
**EVIDENCE_STATUS:** `MIXED`  
**TYPOLOGY_CORPUS_STATUS:** `RESEARCH_PENDING`  
**REGULATORY_CORPUS_STATUS:** `PARTIAL / REQUIRES SOURCE-BY-SOURCE VERIFICATION`  
**AUTHORITY:** `HUMAN PRODUCT OWNER`  
**PRODUCT OWNER:** Yvan Castillo  
**DATE:** 2026-09-19  
**SOURCE RECORD:** `pasted_content_473.txt`  
**DOCUMENT TYPE:** Documentation / Knowledge Preservation Only

> Esta fundación preserva una estructura de investigación aprobada por la autoridad humana. No convierte automáticamente conceptos de investigación en clases, interfaces, tablas, enums, nodos, módulos, entidades runtime o requisitos normativos.

## 1. Alcance y límites vinculantes

Esta orden no autoriza implementación funcional. No modifica motores de ARKI/ARQUI, ontologías runtime, contratos TypeScript, UI, generación arquitectónica, el verificador RNE, el `CanonicalBuildingModel`, matrices tipológicas, datasets definitivos ni ningún sistema de ingeniería. Tampoco autoriza push, PR, merge, deploy, rebase, reset o reescritura de historia.

La documentación distingue explícitamente:

```text
APPROVED RESEARCH BASE ≠ IMPLEMENTED SOFTWARE CONTRACT
RESEARCH CONCEPT ≠ RUNTIME ENTITY
CONCEPTUAL DISTINCTION ≠ IMPLEMENTATION OBJECT
```

Este documento establece la estructura con la cual se investigará posteriormente cada tipología. No afirma que todos los conceptos estén implementados, que todas las relaciones hayan sido verificadas normativamente ni que ARKI pueda emitir proyectos aprobables.

## 2. Tesis central

ARKI no debe aprender tipologías como listas fijas de habitaciones ni como plantillas fijas de plantas.

```text
PURPOSE
→ TYPOLOGY
→ SUBTYPE
→ FUNCTIONAL PROFILE
→ ACTORS + ACTIVITIES + RESOURCES
→ SYSTEM REQUIREMENTS
→ PROCESSES + STATES
→ FLOWS
→ FLOW INTERACTIONS
→ CIRCULATION REQUIREMENTS
→ FUNCTIONAL PROGRAM
→ RELATIONSHIPS
→ CAPACITY + TIME
→ TOPOLOGY
→ SITE + CLIMATE + ENVIRONMENT + REGULATION
→ DESIGN ALTERNATIVES
→ PERFORMANCE
→ MANDATORY CONSTRAINTS
→ MULTIOBJECTIVE EVALUATION
→ TRADE-OFF / PARETO SET
→ HUMAN DECISION
```

La tesis de trabajo es:

> **Do not research what a building typology should look like. Research what it needs to do, why it needs to do it, who and what participate, how people, objects, services and information move, which flows may share or must separate, under what conditions they operate, what performance is required, which regulations may apply, what remains unknown, and which architectural alternatives can satisfy those requirements.**

## 3. Taxonomía tipológica inicial

La taxonomía es abierta, no exhaustiva y no regulatoria. El número de tipologías no se considera universal ni cerrado. La investigación inicial registra aproximadamente 40 familias y podrá expandirse posteriormente hacia 150–250 o más subtipos, según evidencia.

| ID | Familia inicial |
|---:|---|
| 01 | Residential |
| 02 | Hospitality |
| 03 | Senior / Assisted Living / Care |
| 04 | Early Childhood |
| 05 | School Education |
| 06 | Higher Education |
| 07 | Specialized Education |
| 08 | Outpatient Healthcare |
| 09 | Hospital |
| 10 | Emergency Healthcare |
| 11 | Laboratory |
| 12 | Office |
| 13 | Retail |
| 14 | Shopping Center |
| 15 | Market |
| 16 | Restaurant / Food Service |
| 17 | Industry |
| 18 | Warehouse |
| 19 | Logistics / Distribution |
| 20 | Airport |
| 21 | Bus / Land Terminal |
| 22 | Railway / Metro |
| 23 | Port / Maritime |
| 24 | Parking / Mobility Hub |
| 25 | Library |
| 26 | Museum / Exhibition |
| 27 | Performing Arts |
| 28 | Cinema / Entertainment |
| 29 | Sports |
| 30 | Recreation |
| 31 | Religious |
| 32 | Civic / Government |
| 33 | Justice / Courthouse |
| 34 | Police |
| 35 | Fire / Rescue |
| 36 | Correctional |
| 37 | Data / Telecommunications |
| 38 | Specialized Research |
| 39 | Mixed Use |
| 40 | Campus / Building Complex |

```text
INITIAL RESEARCH TAXONOMY
OPEN
NON-EXHAUSTIVE
NON-REGULATORY
```

Preservar las distinciones:

```text
ARCHITECTURAL TYPOLOGY ≠ REGULATORY OCCUPANCY CLASSIFICATION
BUILDING ≠ SINGLE TYPOLOGY
```

## 4. Modelo de sistemas funcionales

```text
TYPOLOGY
→ FUNCTIONAL PROFILE
→ SYSTEM REQUIREMENTS
→ FUNCTIONAL REQUIREMENTS
→ ACTIVITIES / PROCESSES
→ POSSIBLE SPATIAL REALIZATIONS
→ SPACES / COMPONENTS
```

Las siguientes distinciones son obligatorias:

```text
MINIMUM SYSTEM ≠ MINIMUM ROOM
SYSTEM ≠ ZONE ≠ SPACE ≠ ROOM
SYSTEM REQUIRED ≠ ROOM REQUIRED
TYPOLOGY ≠ TEMPLATE
ROOM NAME ≠ ACTIVITY MODEL
NEED ≠ ROOM
```

El rol y la necesidad funcional deben permanecer separados:

| Dimensión | Valores de investigación |
|---|---|
| Role | `PRIMARY`, `SUPPORT`, `CONTROL`, `SERVICE`, `INFRASTRUCTURE`, `INTERFACE` |
| Functional necessity | `ESSENTIAL`, `CONDITIONAL`, `OPTIONAL`, `NOT_APPLICABLE`, `UNKNOWN` |

```text
SUPPORT SYSTEM ≠ OPTIONAL SYSTEM
FUNCTIONALLY ESSENTIAL ≠ LEGALLY MANDATORY
LEGALLY MANDATORY ≠ TYPOLOGICALLY ESSENTIAL
```

## 5. Programa, cantidad y capacidad

Un programa no es una lista de habitaciones, una tabla de áreas ni una topología.

```text
SYSTEM REQUIREMENT ≠ PROGRAM COMPONENT ≠ SPACE
ONE ACTIVITY ≠ ONE SPACE
ONE SPACE ≠ ONE ACTIVITY
PROGRAM ≠ ROOM LIST
PROGRAM ≠ AREA TABLE
PROGRAM ≠ TOPOLOGY
```

La programación conceptual debe considerar actividades, tiempo, capacidad, equipamiento, privacidad, seguridad, acústica, ambiente, higiene, accesibilidad y gestión para derivar requisitos espaciales. La compatibilidad programática puede ser `SHARE`, `SHARE_WITH_CONDITIONS`, `SEPARATE` o `UNKNOWN`.

Toda cantidad o dimensión debe conservar su tipo de procedencia:

```text
FUNCTIONALLY_DERIVED
REFERENCE
REGULATORY
TECHNICALLY_CALCULATED
PROJECT_TARGET
UNKNOWN
```

Esto aplica a número, capacidad, área, dimensiones, despejes, altura, equipamiento y ocupación.

```text
REFERENCE DIMENSION ≠ PROJECT REQUIREMENT
CAPACITY ≠ SPACE COUNT
POPULATION ≠ THROUGHPUT
UNKNOWN ≠ ZERO
```

## 6. Flujos y circulación

La cadena de razonamiento de flujos es:

```text
PROCESS
→ FLOW
→ FLOW SEGMENT
→ INTERACTION WITH OTHER FLOWS
→ COMPATIBILITY
→ SEPARATION REQUIREMENT
→ CIRCULATION REQUIREMENT
→ CIRCULATION NETWORK
→ SPATIAL REALIZATION
```

```text
PROCESS ≠ FLOW ≠ CIRCULATION
FLOW ≠ CORRIDOR
CIRCULATION ≠ RESIDUAL SPACE
DIFFERENT FLOWS ≠ AUTOMATICALLY DIFFERENT CORRIDORS
```

La circulación debe entenderse como una red con nodos, segmentos, accesos, destinos, niveles, continuidad, dirección cuando exista y referencia a la geometría fuente. Una circulación no queda demostrada por una flecha, un organigrama o una relación semántica: debe existir evidencia espacial suficiente, manteniendo `UNKNOWN` cuando falte.

### 6.1 Vocabulario de investigación de flujos

Este vocabulario no es un enum runtime definitivo:

```text
PUBLIC, VISITOR, CUSTOMER, RESIDENT, PATIENT, STAFF,
RESTRICTED STAFF, EMERGENCY,
FOOD, GOODS, SUPPLIES, MEDICATION, SPECIMENS, EQUIPMENT,
CLEAN MATERIAL, STERILE MATERIAL,
DIRTY RETURN, SOILED MATERIAL, WASTE, HAZARDOUS MATERIAL,
PUBLIC VEHICLES, SERVICE VEHICLES, FREIGHT, AMBULANCE,
FIRE / RESCUE, MAINTENANCE
```

No todos los flujos aplican a todas las tipologías.

### 6.2 Compatibilidad y separación

La compatibilidad debe investigarse por flujo, segmento, tiempo, estado, riesgo y regulación. Los estados conceptuales son `COMPATIBLE`, `COMPATIBLE_WITH_CONDITIONS`, `CONTROLLED_CROSSING`, `TEMPORALLY_SEPARATED`, `AVOID_INTERACTION`, `PHYSICALLY_SEPARATED`, `PROTECTED_ROUTE` y `UNKNOWN`.

Las formas de separación a investigar son `HORIZONTAL`, `VERTICAL`, `TEMPORAL`, `CONTROLLED`, `ACCESS-CONTROLLED`, `PROTECTED`, `SEPARATE CORE` y `EXTERNAL`.

```text
FLOW SEPARATION REQUIREMENT ≠ AUTOMATIC PHYSICAL CORRIDOR SEPARATION
```

Una única ruta física puede servir a varias redes funcionales y de seguridad si las condiciones, los permisos, el estado y el riesgo lo permiten. La compatibilidad no debe asumirse por compartir geometría.

### 6.3 Tiempo y estado operativo

```text
PHYSICAL NETWORK + TIME + OPERATIONAL STATE + PERMISSION
= ACTIVE OPERATIONAL TOPOLOGY
```

Estados a investigar: `NORMAL`, `PEAK`, `EVENT`, `NIGHT`, `CLEANING`, `SUPPLY`, `MAINTENANCE`, `EMERGENCY`, `FAILURE` y `POST-EVENT`.

```text
SAME GEOMETRY CAN HAVE DIFFERENT OPERATIONAL TOPOLOGIES.
TEMPORAL SEPARATION MUST BE VERIFIED, NOT ASSUMED.
```

### 6.4 Circulación horizontal, vertical y exterior

```text
CIRCULATION NETWORK
├── HORIZONTAL
├── VERTICAL
└── SITE / EXTERNAL
```

Realizaciones posibles: corridor, passage, hall, gallery, aisle, service spine, ramp, stair, elevator, service elevator, freight elevator, escalator, moving walk, specialized lift, platform, bridge, tunnel, service road, loading lane y exterior path.

La circulación vertical no equivale automáticamente a evacuación. Para cada elemento deben estudiarse flujos permitidos y prohibidos, uso normal, servicio, accesibilidad, rol de evacuación, respuesta de emergencia, capacidad, tiempos, ubicación, distancia, redundancia, protección y horarios.

## 7. Accesibilidad, evacuación y seguridad

La accesibilidad se investiga como una cadena completa:

```text
ORIGIN
→ SITE
→ APPROACH
→ ENTRY
→ HORIZONTAL ROUTE
→ VERTICAL ROUTE
→ DESTINATION
→ ACTIVITY / SERVICE
→ SAFETY / EGRESS
```

```text
ACCESSIBLE ENTRY ≠ ACCESSIBLE BUILDING
ACCESSIBILITY ≠ ACCESS ELEMENT
ELEMENT COMPLIANCE ≠ SYSTEM ACCESSIBILITY
```

La evacuación se analiza como:

```text
EXIT ACCESS
→ EXIT
→ EXIT DISCHARGE
→ EXTERNAL SAFE ROUTE / AREA
```

Debe incluir capacidad, redundancia, separación, protección, continuidad, compartimentación, recorrido, estado de emergencia y descarga. La circulación normal y la circulación de emergencia no son la misma topología por defecto.

```text
EGRESS DOES NOT END AT THE BUILDING DOOR
SAFE AREA WITHOUT SAFE ACCESS ≠ COMPLETE SAFETY SYSTEM
```

Las ocho capas analíticas de circulación son: funcional/operativa; servicio/logística; accesibilidad; transporte vertical; evacuación/life safety; respuesta de emergencia; seguridad/control; sitio/exterior. Son capas de análisis, no ocho corredores físicos obligatorios.

## 8. Regulación, ambiente y desempeño

Toda cifra normativa deberá conservar fuente, versión, jurisdicción, tipología/ocupación, condiciones, excepciones y aplicabilidad. Los límites de distancia son requisitos regulatorios condicionales, no números universales.

Cada tipología deberá investigarse, con pesos no asumidos como iguales, respecto a:

- función, programa, circulación, accesibilidad, life safety, seguridad y peligros;
- desempeño térmico, ventilación/IAQ, iluminación natural, iluminación y acústica;
- energía, agua, materiales, carbono, residuos, biodiversidad, suelo, escorrentía, contaminación, isla de calor y resiliencia;
- estructura, MEP/técnica, construcción, operación, mantenimiento, adaptabilidad y costo;
- composición, experiencia espacial y contexto.

La cadena ambiental es:

```text
CLIMATE / SITE CONDITION
+ ACTOR + ACTIVITY + OCCUPANCY + TIME + EXPOSURE
→ HUMAN / PERFORMANCE REQUIREMENT
→ POSSIBLE STRATEGIES
→ ARCHITECTURAL RESPONSE
→ VERIFICATION
```

```text
ENVIRONMENTAL CONDITION ≠ REQUIREMENT ≠ STRATEGY ≠ PERFORMANCE
DESIGN MOVE ≠ GUARANTEED PERFORMANCE
THERMAL COMFORT ≠ ENERGY PERFORMANCE
```

La sostenibilidad se investigará por variables separadas: clima, energía, agua, carbono, materiales, biodiversidad, vegetación, suelo, escorrentía, residuos, contaminación, isla de calor, resiliencia y ciclo de vida.

## 9. Restricciones, objetivos y alternativas

Clasificar cada variable como `MANDATORY CONSTRAINT`, `FUNCTIONAL REQUIREMENT`, `PERFORMANCE OBJECTIVE`, `PREFERENCE`, `ASPIRATION`, `CONDITION` o `UNKNOWN`.

```text
DESIGN ALTERNATIVE
→ MANDATORY / CRITICAL GATES
→ PASS?
├── NO → NONCOMPLIANT / INFEASIBLE
└── YES → MULTIOBJECTIVE EVALUATION
```

Una no conformidad obligatoria no puede compensarse con una puntuación alta en otro dominio. Después de los gates se podrán investigar prioridades `LOW`, `MEDIUM`, `HIGH` y `CRITICAL`, con procedencia `TYPOLOGY_DEFAULT`, `PROJECT_OBJECTIVE`, `CLIENT_PRIORITY`, `ARCHITECT_DECISION` o `HUMAN_OVERRIDE`.

Cada decisión de diseño debe conservar beneficios, costos, riesgos, dependencias, objetivos afectados y unknowns. El flujo de alternativas es:

```text
VALID ALTERNATIVES
→ MULTIOBJECTIVE EVALUATION
→ TRADE-OFF ANALYSIS
→ PARETO SET
→ HUMAN REVIEW
→ HUMAN DECISION
```

```text
ARKI SHALL NOT DECLARE A UNIVERSALLY BEST ARCHITECTURAL SOLUTION.
```

## 10. Multiescala

```text
HUMAN ↕ OBJECT ↕ ACTIVITY ↕ SPACE ↕ FUNCTIONAL SYSTEM ↕ BUILDING
↕ SITE ↕ PUBLIC REALM / BLOCK ↕ NEIGHBORHOOD ↕ CITY ↕ REGION ↕ COUNTRY
```

```text
MULTISCALE ≠ SAME METHOD AT EVERY SCALE
```

## 11. Fuentes y procedencia

Los futuros corpus podrán incluir libros profesionales, manuales de diseño, guías de tipos de edificios, guías de agencias, códigos modelo, estándares, literatura científica, evidencia post-ocupación, precedentes, regulación peruana y regulación local.

Corpus inicial de investigación: Neufert, Plazola, Metric Handbook, Time-Saver Standards, Architectural Graphic Standards, Building Type Basics, WBDG, UFC, GSA, FAA, VA, NIH, IBC, ADA, NFPA, ASHRAE, FGI, RNE Perú, regulación sectorial peruana y autoridades municipales.

Cada futura unidad de conocimiento debe poder responder:

```text
WHAT? WHY? SOURCE? SOURCE TYPE? EDITION / VERSION? DATE?
JURISDICTION? TYPOLOGY? SUBTYPE? SCALE? CONDITIONS?
APPLICABILITY? MANDATORY OR REFERENCE? EVIDENCE STRENGTH?
CONFLICT? TRANSFERABILITY? UNKNOWN?
```

```text
BOOK ≠ DESIGN GUIDE ≠ STANDARD ≠ MODEL CODE ≠ LAW/REGULATION ≠ PROJECT REQUIREMENT
FOREIGN STANDARD ≠ AUTOMATICALLY APPLICABLE PROJECT REQUIREMENT
U.S. STANDARD ≠ AUTOMATIC PERUVIAN REQUIREMENT
```

## 12. Ficha maestra futura por tipología

Cada investigación profunda podrá utilizar esta ficha de 66 categorías:

1. Identity; 2. Purpose; 3. Subtypes; 4. Operating Models; 5. Actors; 6. Activities; 7. Resources / Objects; 8. Operational States; 9. Essential Systems; 10. Conditional Systems; 11. Processes; 12. Capacities; 13. Temporal Patterns; 14. Functional Program; 15. Space / Component Types; 16. Quantity Logic; 17. Area / Dimension Logic; 18. Equipment; 19. Relationships; 20. Flows; 21. Flow Compatibility Matrix; 22. Separation Requirements; 23. Horizontal Circulation; 24. Vertical Circulation; 25. Mechanical Circulation; 26. External / Site Circulation; 27. Temporal Circulation; 28. Control Points; 29. Accessibility; 30. Egress; 31. Fire / Life Safety; 32. Emergency Response; 33. Security; 34. Seismic / Hazards; 35. Thermal; 36. Ventilation / IAQ; 37. Daylight / Lighting; 38. Acoustics; 39. Energy; 40. Water; 41. Ecology / Environment; 42. Materials / Carbon / Waste; 43. Resilience; 44. Structure; 45. Technical Systems; 46. Construction; 47. Maintenance; 48. Lifecycle / Adaptability; 49. Site Relationships; 50. Zoning; 51. Topological Patterns; 52. Composition / Experience; 53. Regulatory Corpus; 54. Professional Bibliography; 55. Standards / Design Guides; 56. Evidence; 57. Source Conflicts; 58. Unknowns; 59. Mandatory Constraints; 60. Performance Objectives; 61. Preferences; 62. Trade-offs; 63. Typology Priorities; 64. Transferable Principles; 65. Counterexamples; 66. Validation Cases.

```text
66 RESEARCH CATEGORIES ≠ 66 SOFTWARE OBJECTS
```

## 13. Batches futuros de investigación

1. Residential / Hospitality / Care  
2. Restaurant / Food Service / Retail / Market  
3. Office / Civic / Justice  
4. Education / Library / Culture / Religious  
5. Healthcare / Clinical / Hospital / Laboratory  
6. Industry / Warehouse / Logistics  
7. Airport / Rail / Bus / Port / Mobility  
8. Sports / Recreation / Entertainment  
9. Police / Fire / Correctional / Emergency  
10. Data Center / Specialized Research  
11. Mixed-use / Campus / Complex  
12. Site / Public Realm / Urban Scale

Esta secuencia es una estrategia de investigación, no una prioridad arquitectónica.

## 14. Generalización y anti-explosión ontológica

Cada descubrimiento debe preguntar si es específico de una tipología o si es un principio arquitectónico transferible. No se universaliza automáticamente un caso particular.

```text
TRANSFER PRINCIPLE, NOT SOLUTION.
1000 RESEARCH DISCOVERIES ≠ 1000 SOFTWARE TYPES
```

Antes de crear una entidad runtime, revisar si el concepto puede componerse con entidades existentes como actor, actividad, recurso/objeto, entidad espacial, sistema, estado, transición, proceso, relación, flujo, control, interfaz, requisito, condición, capacidad, tiempo, evidencia o issue.

## 15. Regla generativa de circulación

No colocar habitaciones primero para conectarlas después. En tipologías donde la circulación es estructurante:

```text
SYSTEMS
→ PROCESSES
→ FLOWS
→ FLOW COMPATIBILITY
→ CRITICAL CIRCULATION NETWORKS
→ PROGRAM CLUSTERING
→ TOPOLOGY
→ PLAN + SECTION + MASSING
```

La circulación puede ser una restricción generativa y no un espacio residual.

## 16. Estado de la base

| Dominio | Estado preservado |
|---|---|
| Typology taxonomy | `BASE_DEFINED` |
| Functional system model | `BASE_DEFINED` |
| Program model | `BASE_DEFINED` |
| Flow model | `BASE_DEFINED / UPDATED` |
| Flow compatibility model | `BASE_DEFINED` |
| Circulation network model | `BASE_DEFINED / UPDATED` |
| Temporal circulation | `BASE_DEFINED` |
| Vertical circulation | `BASE_DEFINED` |
| Accessibility model | `BASE_DEFINED` |
| Egress / fire model | `BASE_DEFINED CONCEPTUALLY` |
| Security model | `BASE_DEFINED CONCEPTUALLY` |
| Seismic / safe-area model | `BASE_DEFINED CONCEPTUALLY` |
| Thermal model | `BASE_DEFINED CONCEPTUALLY` |
| Environmental / ecological model | `BASE_DEFINED CONCEPTUALLY` |
| Performance model | `BASE_DEFINED CONCEPTUALLY` |
| Hard-constraint model | `BASE_DEFINED` |
| Multiobjective weighting | `BASE_DEFINED CONCEPTUALLY` |
| Trade-off / Pareto | `BASE_DEFINED CONCEPTUALLY` |
| Source / regulatory model | `BASE_DEFINED` |
| Deep typology corpus | `NOT_YET_RESEARCHED` |
| Deep flow-compatibility corpus | `NOT_YET_RESEARCHED` |
| Complete regulatory corpus | `NOT_IMPLEMENTED` |
| Software implementation of this foundation | `NOT_AUTHORIZED_BY_THIS_ORDER` |

## 17. Relationship to Existing ARKI Architecture

Esta sección mapea, sin implementar deltas, la fundación con la arquitectura existente.

| Concepto de esta fundación | Relación | Superficie existente / límite |
|---|---|---|
| Existing typology knowledge | `EXTEND` | `arkiTypologyFunctionalKnowledge.ts`; 23 perfiles operativos existentes, no corpus exhaustivo |
| Functional profiles and systems | `MAP_TO_EXISTING` | `arkiCanonicalFunctionalOperationalization.ts`, `arkiTypologyOperationalPrograms.ts` |
| Program and activity model | `REUSE` | programas operativos, actividades, relaciones y requisitos existentes |
| Circulation evidence | `REUSE` | `circulationEvidenceGraph`, `arkiRestaurantDesign.ts`; no nueva red canónica |
| Functional void audit | `MAP_TO_EXISTING` | `arkiFunctionalVoidAudit`; los vacíos no justificados siguen siendo issues |
| CanonicalBuildingModel | `PRESERVE` | autoridad geométrica existente; no se altera por esta base |
| Regulatory foundation | `REUSE` | `regulatoryApplicabilityFoundation.ts`, `rnePeruCompliance.ts` |
| RNE evidence gate | `PRESERVE` | aplicabilidad, fuente, versión, evidencia y revisión humana separadas |
| Environmental/site reasoning | `EXTEND` | contratos existentes; desempeño futuro requiere evidencia de sitio |
| Multidisciplinary engineering | `MAP_TO_EXISTING` | `arkiMultidisciplinaryEngineering.ts`; no se fabrican cálculos |
| GDI / A21 / S1 / S2 | `PRESERVE` | cadenas existentes de intención, programa, relaciones y realización |
| Learning cycle | `REUSE` | `arkiLearningCycle.ts`; práctica no equivale a dominio profesional |
| Knowledge acquisition ledger | `REUSE` | `arkiKnowledgeAcquisitionLedger.ts`; preserva fuente, aprendizaje y unknowns |
| 40-family research taxonomy | `RESEARCH_ONLY` | no se convierte en enum ni catálogo runtime por este documento |
| 66 research categories | `DATA_ONLY` | ficha de investigación futura, no 66 objetos software |
| Flow compatibility matrix | `REQUIRES_FUTURE_DECISION` | no existe aquí una matriz runtime nueva |
| Performance/Pareto model | `RESEARCH_ONLY` | no se crea score universal ni motor Pareto |

## 18. Estados que deben preservarse

Toda implementación futura debe preservar autoridad humana, `UNKNOWN`, estado `HYPOTHESIS`, provenance, separación de aplicabilidad normativa, prohibición de ganador arquitectónico automático, autoridad del `CanonicalBuildingModel`, arquitectura GDI/A21/S1/S2, entrada tipológica existente, fundación regulatoria RNE y arquitectura de aprendizaje/ledger.

## 19. Estado de esta preservación

```text
DOCUMENTATION_PRESERVATION = COMPLETE
FUNCTIONAL_IMPLEMENTATION_BY_THIS_DOCUMENT = NONE
NEW_RUNTIME_ENTITY = 0
NEW_ONTOLOGY = 0
NEW_DATABASE_SCHEMA = 0
NEW_UI = 0
NEW_GENERATOR = 0
NEW_SCORING_ENGINE = 0
NEW_PARETO_ENGINE = 0
NEW_COMPLIANCE_CLAIM = 0
HUMAN_AUTHORITY = PRESERVED
UNKNOWN_PRESERVATION = PRESERVED
HYPOTHESIS_STATUS = PRESERVED
PUSH = NO
PR = NO
MERGE = NO
DEPLOY = NO
```

## 20. Próximo paso recomendado

El siguiente paso recomendado es una **investigación profunda del corpus tipológico**, comenzando por el batch que el Product Owner autorice. La investigación debe trabajar fuente por fuente, diferenciar referencia profesional de requisito regulatorio, registrar conflictos y unknowns, y completar la ficha maestra por tipología. No debe comenzar automáticamente desde este documento y no debe implementar ninguna de sus ideas sin una orden posterior.
