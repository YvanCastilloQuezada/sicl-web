# SiMS-DeI — ARQUI A24
# Generación Inteligente de Plantas y Validación Arquitectónica

## 1. Estado

```text
A24 = IMPLEMENTED / WEB-DERIVED MODEL
FLOORPLAN_GENERATION = IMPLEMENTED_AS_CONTROLLED_CANDIDATE
PROFILE_GENERATION = IMPLEMENTED
CRAZY_RULED_HYPERBOLIC_CASE = PASS
DESIGN_MEMORY_N2_CROSS_VALIDATION = PASS
ANTI_ABSURDITY_GATES = IMPLEMENTED
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
HUMAN_AUTHORITY = PRESERVED
AUTOMATIC_DECISION = NO
AUTOMATIC_WINNER = NO
```

A24 no genera una planta aprobada ni afirma viabilidad constructiva. Genera candidatos delimitados que deben pasar validación y revisión humana.

## 2. Salvaguardas contra resultados absurdos

Una alternativa se rechaza si:

```text
no tiene niveles
no tiene núcleo vertical
el núcleo referencia niveles inexistentes
un espacio tiene geometría inválida
un espacio sale del sitio
existe solape no resuelto entre zonas distintas
un espacio no tiene acceso al núcleo
el perfil CRAZY no conserva su familia geométrica declarada
```

Se mantienen estas distinciones:

```text
GENERATED_PLAN ≠ APPROVED_PLAN
CRAZY_FORM ≠ ARCHITECTURAL_QUALITY
HYPERBOLIC ≠ STRUCTURALLY_VALID
RULED_SURFACE ≠ CONSTRUCTIBLE
CORE_ACCESS ≠ ACCESSIBILITY_COMPLIANCE
PARAMETRIC_VARIATION ≠ DESIGN_INTELLIGENCE
```

## 3. Perfiles implementados

```text
JUNIOR   → ORTHOGONAL_GRID
ARCHITECT → ORTHOGONAL_GRID + CURVILINEAR
MASTER   → ORTHOGONAL_GRID + RADIAL + HYBRID
GENIUS   → RADIAL + CURVILINEAR + HYBRID
CRAZY    → RULED_SURFACE + HYPERBOLIC_PROFILE
```

Todos producen candidatos con:

```text
humanReviewRequired = true
noAutomaticDecision = true
noAutomaticWinner = true
```

## 4. Caso CRAZY

El fixture usa:

```text
PROFILE = CRAZY
SHAPES = RULED_SURFACE + HYPERBOLIC_PROFILE
PARAMETERS =
  ruledSurfaceTwist = 0.22
  hyperbolicCurvature = 0.16
  amplitude = 0.35
CONSTRUCTABILITY = CONTROLLED_HYPOTHESIS
LEVELS = N1 + N2
VERTICAL_CORE = CORE-N1-N2
```

La planta mantiene:

```text
space inside site = true
core access = present
core levels = N1, N2
continuous core = declared
provenance = present
```

Resultado:

```text
validationState = SUPPORTED
conflicts = []
```

El resultado no afirma que la superficie reglada o hiperbólica sea construible. Solo confirma que el candidato respeta los límites espaciales y el núcleo vertical del fixture.

## 5. Control negativo CRAZY

Se desplazó deliberadamente un espacio a:

```text
[100,100] → [110,110]
```

fuera del sitio:

```text
[0,0] → [24,16]
```

Resultado:

```text
validationState = CONFLICTING
conflict = SPACE_OUTSIDE_SITE_OR_INVALID
```

ARQUI rechaza el candidato y no intenta corregirlo automáticamente.

## 6. Validación cruzada DesignMemory ↔ zonificación N2

El caso de prueba registra:

```text
PROJECT = UPAO-001
LEVEL = N2
ZONE = n2-private
PROGRAM = BEDROOM-N2
DECISION = HUMAN_CONFIRMED
BRANCH = branch-n2
```

La decisión humana indica que la zona privada de N2 se conserva para `BEDROOM-N2`, preservando privacidad y la relación con `CORE-N1-N2`.

Resultado de la validación cruzada:

```text
memoryValid = true
zoningValid = true
state = SUPPORTED
decisionRefs = [decision:1]
zoneRefs = [n2-private]
unmatchedDecisionZoneRefs = []
unmatchedZoneDecisionRefs = []
humanReviewRequired = true
noAutomaticDecision = true
```

La validación confirma consistencia entre la memoria y la zonificación. No convierte la decisión humana en una nueva decisión automática.

## 7. Validación técnica

```text
A24_FOCUSED_TEST_FILES = 1 passed
A24_FOCUSED_TESTS = 3 passed
A21_A22_REGRESSION_TESTS = 12 passed
COMBINED_FOCUSED_TESTS = 15 passed
WEB_FULL_TEST_FILES = 53 passed
WEB_FULL_TESTS = 276 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_STATUS = CLEAN
```

El build conserva la advertencia existente sobre chunks mayores de 500 kB. No bloquea A24.

## 8. Límites

A24 no implementa:

```text
structural_solver
BIM_authoring
regulatory_certification
accessibility_certification
automatic_space_correction
automatic_design_decision
construction_documentation
```

## 9. Estado final

```text
A24_PROFILE_GENERATION = IMPLEMENTED
A24_FLOORPLAN_CANDIDATE = IMPLEMENTED
A24_ANTI_ABSURDITY_VALIDATION = PASS
A24_CRAZY_CASE = PASS
A24_N2_MEMORY_ZONE_CROSSCHECK = PASS
CORE_CHANGED = NO
HUMAN_AUTHORITY = PRESERVED
```
