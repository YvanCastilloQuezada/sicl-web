# SiMS-DeI — ARQUI A21
# Implementación: Relaciones Espaciales, Zonas Funcionales, CirculationIntent y DesignMemory

## 1. Estado

```text
A21 = IMPLEMENTED / WEB-DERIVED MODEL
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
A20-P1_REUSED = YES
A20-P2_ACTIVATED = NO
A20-P3R_ACTIVATED = NO
A20-P4 = NOT AUTHORIZED
HUMAN_AUTHORITY = PRESERVED
AUTOMATIC_DECISION = NO
AUTOMATIC_RECOMMENDATION = NO
AUTOMATIC_WINNER = NO
```

La implementación añade modelos derivados en el Web. No crea entidades Core, no muta geometría y no convierte una intención de circulación en una ruta accesible o en una afirmación de cumplimiento.

## 2. Archivos implementados

```text
client/src/components/a21SpatialRelationships.ts
client/src/components/a21SpatialRelationships.test.ts
client/src/components/a21DesignMemory.ts
client/src/components/a21DesignMemory.test.ts
```

El documento de diseño precedente permanece como la especificación conceptual de A21.

## 3. Modelo de relaciones espaciales

Se implementaron los siguientes conceptos:

```text
ProgramNode
AdjacencyRequirement
SpatialZoneProposal
CirculationIntent
CirculationIntentValidation
```

`AdjacencyRequirement` distingue:

```text
REQUIRED_ADJACENCY
PREFERRED_ADJACENCY
REQUIRED_SEPARATION
PREFERRED_SEPARATION
DIRECT_ACCESS
CONTROLLED_ACCESS
VISUAL_CONNECTION
NO_VISUAL_CONNECTION
SEQUENTIAL_RELATION
VERTICAL_RELATION
```

Cada relación conserva prioridad, provenance, estado epistemológico y estado de relación. Las relaciones requeridas y preferidas no se mezclan.

## 4. Zonas funcionales propuestas

`proposeFunctionalZones` agrupa `ProgramNode` por tipo funcional y produce zonas propuestas.

```text
PUBLIC
SEMI_PUBLIC
PRIVATE
SERVICE
ACCESS
WORK
REST
TRANSITION
OUTDOOR
UNKNOWN
```

Cada zona conserva:

```text
programItemIds
supportingRelationIds
excludedRelationIds
privacyLevel
accessLevel
circulationRole
rationale
provenance
status
```

Las zonas tienen invariantes explícitas:

```text
status = PROPOSED
noGeometryMutation = true
noDecision = true
```

Por tanto, una zona funcional no se presenta como una habitación realizada ni como una decisión arquitectónica.

## 5. Detección de contradicciones

La implementación detecta el conflicto entre:

```text
REQUIRED_ADJACENCY(A, B)
+
REQUIRED_SEPARATION(A, B)
```

El conflicto se conserva para revisión humana. No se resuelve por frecuencia, prioridad implícita o preferencia del sistema.

## 6. Validación de CirculationIntent

La validación consume directamente `CirculationEvidenceGraph` de A20-P1.

```text
CirculationIntent
→ A20-P1 CirculationEvidenceGraph
→ observedEdgeIds
→ unverifiedNodes
→ missingEvidence
→ validationState
```

Estados posibles:

```text
INTENT_NOT_OBSERVED
OBSERVED_PARTIAL
OBSERVED
UNVERIFIED
CONFLICTING
INSUFFICIENT_EVIDENCE
```

La validación comprueba:

- secuencia declarada;
- origen y destino;
- nodos presentes en el grafo;
- aristas observadas entre los nodos de la secuencia;
- continuidad requerida;
- evidencia de loop cuando el tipo es `LOOP_INTENT`;
- evidencia de spine cuando el tipo es `PRIMARY_SPINE`;
- conflictos epistemológicos explícitos.

La validación nunca ejecuta reparación automática.

```text
accessibleRoute = NOT_ASSESSED
compliance = NOT_ASSESSED
humanReviewRequired = true
noAutomaticRepair = true
noDecision = true
noRecommendation = true
```

### Ejemplo positivo

Cuando A20-P1 contiene una arista observada para cada tramo requerido, el resultado puede ser:

```text
state = OBSERVED
```

Esto significa únicamente que la intención tiene correspondencia con evidencia observada. No significa que la ruta sea accesible, normativa, óptima o arquitectónicamente superior.

### Ejemplo parcial

Si una intención `ENTRY → PRIVATE` no tiene arista observada para el tramo privado, el resultado queda como:

```text
OBSERVED_PARTIAL
```

o:

```text
UNVERIFIED
```

Nunca se transforma automáticamente en `OBSERVED` completo.

## 7. DesignMemory

Se implementaron:

```text
DesignMemory
DesignBranch
DesignMemoryEntry
DesignTradeoff
DesignMemoryDecision
```

### DesignMemory

Conserva:

```text
projectId
activeBranchId
branches
entries
tradeoffs
decisions
openQuestions
unknowns
provenance
```

También contiene invariantes globales:

```text
noAutomaticDecision = true
noAutomaticRecommendation = true
noAutomaticWinner = true
```

### DesignBranch

Cada rama conserva:

```text
parentBranchId
label
status
programSnapshotId
adjacencySnapshotId
zoningSnapshotId
circulationIntentSnapshotId
spatialRepresentationId
changedParameters
changedRelations
changedZones
changedCirculation
newUnknowns
resolvedUnknowns
humanReason
provenance
```

Las ramas descartadas no se eliminan. Se conservan con:

```text
status = DISCARDED
```

### DesignMemoryEntry

Registra eventos como:

```text
INTENT_CAPTURED
PROGRAM_CONFIRMED
RELATIONSHIP_ADDED
ZONE_PROPOSED
CIRCULATION_INTENT_PROPOSED
DISTRIBUTION_GENERATED
DISTRIBUTION_COMPARED
CRITIQUE_RECORDED
REVISION_AUTHORIZED
REVISION_EXECUTED
BRANCH_DISCARDED
HUMAN_DECISION
UNKNOWN_RECORDED
CONFLICT_RECORDED
```

Cada entrada conserva autor, pregunta arquitectónica, observaciones, interpretación, hipótesis, alternativas, trade-offs, consecuencias, preguntas abiertas y referencias a programa, zonas, circulación y geometría.

### Trade-offs

Cada trade-off registra explícitamente:

```text
gained
sacrificed
rationale
evidenceRefs
humanReviewState
epistemicState
```

Esto permite conservar razonamientos como:

```text
GAINED = mayor separación de privacidad
SACRIFICED = recorrido directo más corto
STATUS = PENDING_HUMAN_REVIEW
```

### Decisiones humanas

Una decisión solo se registra mediante `recordHumanDesignDecision` y contiene:

```text
actor
statement
scope
selectedBranchId
rejectedBranchIds
reason
constraintsAcknowledged
evidenceAcknowledged
humanConfirmed = true
```

El sistema actualiza el estado de la rama seleccionada y de las ramas rechazadas, pero no crea una decisión automática.

## 8. Invariantes de autoridad

Se preservan las siguientes distinciones:

```text
AI_PROPOSED ≠ HUMAN_CONFIRMED
DERIVED_RELATION ≠ OBSERVED_CONNECTION
ZONE_PROPOSED ≠ ROOM_REALIZED
CIRCULATION_INTENT ≠ ACCESSIBLE_ROUTE
DISTRIBUTION_CANDIDATE ≠ RECOMMENDATION
REJECTED_BRANCH ≠ DELETED_HISTORY
```

## 9. Cobertura de pruebas

Las pruebas controladas validan:

1. relaciones requeridas y preferidas;
2. contradicciones de adyacencia y separación;
3. formación de zonas sin geometría ni decisión;
4. validación positiva de `CirculationIntent` contra A20-P1;
5. clasificación parcial por evidencia incompleta;
6. preservación de intención conflictiva;
7. creación de ramas;
8. registro de trade-offs;
9. preguntas abiertas y unknowns;
10. selección y descarte explícito por autoridad humana;
11. rechazo de entradas que referencian ramas inexistentes.

## 10. Validación técnica

```text
A21_FOCUSED_TEST_FILES = 2 passed
A21_FOCUSED_TESTS = 8 passed
A21_TYPECHECK = PASS
A21_GIT_DIFF_CHECK = PASS
WEB_FULL_TESTS = PASS
WEB_FULL_BUILD = PASS
CORE_STATUS = CLEAN
CORE_CODE_CHANGED = NO
```

La suite Web completa y el build pasaron antes de la corrección final del predicado de validación. Tras la corrección, se repitieron las pruebas focalizadas, TypeScript y `git diff --check`, todos con resultado satisfactorio. La corrección fue lógica y no amplió el alcance.

El build mantiene una advertencia existente sobre chunks mayores de 500 kB. No bloquea la compilación de A21.

## 11. Límites actuales

A21 todavía no implementa:

```text
FLOOR_PLAN_GENERATOR
ROOM_LAYOUT_SOLVER
GEOMETRIC_ZONE_REALIZATION
AUTOMATIC_ADJACENCY_OPTIMIZATION
ACCESSIBILITY_COMPLIANCE
REGULATORY_COMPLIANCE
AUTONOMOUS_ARCHITECTURAL_DECISION
```

A21 tampoco activa A20-P4 ni crea una ruta automática hacia una decisión.

## 12. Próximo gate recomendado

El siguiente gate seguro, si el Product Owner lo autoriza, es integrar `SpatialZoneProposal` y `CirculationIntent` en la superficie visual de ARQUI para que el arquitecto pueda:

- revisar las zonas propuestas;
- aceptar, rechazar o editar relaciones;
- ver qué parte de una intención tiene evidencia A20-P1;
- revisar preguntas abiertas;
- registrar un trade-off;
- seleccionar una rama sin eliminar las demás.

La generación geométrica de plantas debe permanecer separada y requerir un gate posterior.

## 13. Estado final

```text
A21_RELATIONSHIP_MODEL = IMPLEMENTED
A21_FUNCTIONAL_ZONES = IMPLEMENTED_AS_PROPOSALS
A21_CIRCULATION_INTENT_VALIDATION = IMPLEMENTED
A21_A20_P1_LINK = IMPLEMENTED_READ_ONLY
A21_DESIGN_MEMORY = IMPLEMENTED
A21_FLOOR_PLAN_GENERATION = FROZEN / NOT_IMPLEMENTED
A21_HUMAN_AUTHORITY = PRESERVED
A21_REAL_GATE = NOT_TRIGGERED
```
