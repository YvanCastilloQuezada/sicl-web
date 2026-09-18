# SiMS-DeI — ARQUI A22
# Implementación del Grafo Vertical y Validación de Apilamiento

## 1. Estado

```text
A22 = IMPLEMENTED / WEB-DERIVED MODEL
VERTICAL_RELATION_GRAPH = IMPLEMENTED
MASS_STACK = IMPLEMENTED
MASS_ALIGNMENT_VALIDATION = IMPLEMENTED
DISPLACED_UNJUSTIFIED_FLOOR_CASE = PASS
CORE_CHANGED = NO
CORE_CONTRACT_CHANGED = NO
NEW_DEPENDENCY = NO
FLOOR_PLAN_GENERATION = NOT IMPLEMENTED
STRUCTURAL_VALIDATION = NOT ASSESSED
HUMAN_AUTHORITY = PRESERVED
AUTOMATIC_CORRECTION = NO
AUTOMATIC_DECISION = NO
```

A22 se implementó sobre la capa Web derivada. No se modificó Core, no se creó una entidad Core y no se corrigieron automáticamente masas desplazadas.

## 2. Archivos

```text
client/src/components/a22VerticalCoherence.ts
client/src/components/a22VerticalCoherence.test.ts
docs/ARQUI-A22-IMPLEMENTATION-FINAL.md
```

## 3. Modelo implementado

Se implementaron:

```text
A22Level
A22MassMember
A22VerticalRelation
A22MassStack
A22AlignmentAssessment
```

El grafo vertical admite:

```text
STACKS_ABOVE
STACKS_BELOW
ALIGNS_WITH
CONTINUES_FROM
CONNECTS_TO
SUPPORTED_BY
RETRACTS_FROM
PROJECTS_OVER
SEPARATES_FROM
SHARES_CORE_WITH
REQUIRES_VERTICAL_ACCESS
MUST_REMAIN_CLEAR
```

La validación conserva relaciones independientes para:

```text
alignment
containment
setback
overhang
support
vertical core continuity
vertical circulation
```

## 4. Reglas implementadas

La implementación aplica estas reglas:

1. Solo compara niveles de la misma alternativa.
2. Rechaza relaciones verticales que cruzan alternativas.
3. Exige dos miembros de masa para evaluar un apilamiento.
4. Comprueba orden vertical.
5. Comprueba unidades, marco de coordenadas y orientación.
6. Calcula la proporción de solape de las huellas.
7. Calcula el desplazamiento del centro geométrico.
8. Clasifica una masa superior contenida como coherente.
9. Clasifica un retranqueo explícitamente justificado como coherente con observaciones.
10. Clasifica una masa sin solape y sin justificación como conflicto.
11. Clasifica una proyección justificada como candidato de voladizo, no como soporte estructural probado.
12. Conserva preguntas abiertas y exige revisión humana.

## 5. Caso de prueba negativo

Fixture:

```text
ALTERNATIVE = UPAO-001-A
N1 MASS = rectangle [0,0] → [10,8]
N2 MASS = rectangle [30,30] → [40,38]
RELATION = STACKS_ABOVE
RATIONALE = absent
SUPPORT_MODE = UNKNOWN
```

La planta superior está completamente desplazada respecto de la inferior. No existe retranqueo declarado, voladizo, masa independiente, núcleo compartido ni razón arquitectónica.

Resultado:

```text
state = CONFLICTING
massAlignment = CONFLICTING
massContainment = CONFLICTING
setbackState = OFFSET_UNJUSTIFIED
overhangState = OVERHANG_UNEXPLAINED
humanReviewRequired = true
noAutomaticCorrection = true
openQuestions =
  ARCHITECTURAL_REASON_FOR_OFFSET
  VERTICAL_SUPPORT_OR_INDEPENDENT_MASS
```

Este caso demuestra que ARQUI no acepta dos plantas independientes como un edificio coherente solo porque cada huella sea geométricamente válida.

## 6. Casos positivos y de control

### Masa contenida

Una masa superior casi coincidente con la masa inferior se clasifica como:

```text
state = COHERENT
massAlignment = SUPPORTED
massContainment = SUPPORTED
structuralValidation = NOT_ASSESSED
```

### Retranqueo justificado

Una masa superior parcialmente desplazada, con relación `RETRACTS_FROM` y razón arquitectónica registrada, se clasifica como:

```text
state = COHERENT_WITH_OBSERVATIONS
massAlignment = PARTIAL
setbackState = SUPPORTED
```

La justificación no se interpreta como prueba de seguridad estructural.

### Alternativas distintas

Una relación entre niveles de alternativas distintas queda fuera del grafo vertical válido y no se compara.

## 7. Estados y autoridad

La evaluación devuelve dimensiones independientes y estados epistemológicos. No reduce la coherencia a un booleano ciego.

Se preservan:

```text
ALIGNMENT ≠ STRUCTURAL VALIDITY
PROJECTS_OVER ≠ SAFE CANTILEVER
VERTICAL_RELATION ≠ ACCESSIBLE_ROUTE
GEOMETRIC_COHERENCE ≠ ARCHITECTURAL QUALITY
UNKNOWN ≠ FAIL
CONFLICTING ≠ AUTOMATIC CORRECTION
```

Cada evaluación contiene:

```text
humanReviewRequired = true
structuralValidation = NOT_ASSESSED
noAutomaticCorrection = true
noDecision = true
noRecommendation = true
```

## 8. Validación técnica

```text
A22_FOCUSED_TEST_FILES = 1 passed
A22_FOCUSED_TESTS = 4 passed
A21_REGRESSION_TEST_FILES = 2 passed
A21_REGRESSION_TESTS = 8 passed
COMBINED_FOCUSED_TESTS = 12 passed
WEB_FULL_TEST_FILES = 52 passed
WEB_FULL_TESTS = 273 passed
WEB_TYPECHECK = PASS
WEB_BUILD = PASS
WEB_GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_STATUS = CLEAN
```

El build conserva la advertencia existente sobre chunks mayores de 500 kB. No bloquea A22.

## 9. Límites

A22 no implementa todavía:

```text
FLOOR_PLAN_GENERATOR
STRUCTURAL_SOLVER
BIM_SUPPORT_ANALYSIS
ACCESSIBILITY_COMPLIANCE
REGULATORY_COMPLIANCE
AUTOMATIC_MASS_CORRECTION
AUTONOMOUS_ARCHITECTURAL_DECISION
```

El sistema detecta la necesidad de una hipótesis de retranqueo, voladizo o masa independiente, pero espera la revisión del arquitecto.

## 10. Estado final

```text
A22_VERTICAL_RELATION_GRAPH = IMPLEMENTED
A22_MASS_STACK = IMPLEMENTED
A22_ALIGNMENT_RULES = IMPLEMENTED
A22_UNJUSTIFIED_OFFSET_FIXTURE = PASS
A22_HUMAN_REVIEW_GATE = PRESERVED
A22_FLOOR_PLAN_GENERATION = NOT IMPLEMENTED
A22_STRUCTURAL_ANALYSIS = NOT ASSESSED
REAL_GATE = NOT TRIGGERED
```
