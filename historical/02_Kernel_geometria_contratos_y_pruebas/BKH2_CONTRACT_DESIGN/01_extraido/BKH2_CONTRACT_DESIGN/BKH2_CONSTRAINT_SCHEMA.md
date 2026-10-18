# BKH-2 — Constraint Schema

## Estado

`CONTRACT DESIGN ONLY`.

## Entidades

### ConstraintRecord

`ConstraintRecord` representa una condición declarada. Sus campos son `constraintId`, `constraintRevisionId`, `constraintType`, `subjectEntityIds`, `relationIds`, `predicate`, `operands`, `domain`, `units`, `severity`, `enforcement`, `epistemicStatus`, `projectVersion` y `provenance`.

### ConstraintOperand

Un operando debe declarar `kind`, `value`, `valueType`, `units` cuando corresponda y una referencia opcional a entidad, parámetro o relación. No se permiten valores numéricos sin unidad cuando el tipo de restricción exige unidad.

### ConstraintEvaluation

El resultado debe declarar `constraintId`, `status`, `actualValue`, `expectedValue`, `tolerance`, `units`, `severity`, `explanation`, `evidence`, `conflictingConstraintIds`, `projectVersion` y `evaluatedAtRevision`.

### ConstraintConflict

Un conflicto contiene `conflictId`, `constraintIds`, `sharedDomain`, `status`, `explanation`, `evidence` y `resolutionState`. BKH-2 sólo diagnostica; no selecciona una resolución.

## Tipos cerrados

- `ConstraintSeverity`: `HARD`, `SOFT`, `ADVISORY`, `INFORMATIONAL`.
- `ConstraintEnforcement`: `REPORT_ONLY`, `BLOCK_HYPOTHETICAL`, `REQUIRE_REVIEW`.
- `ConstraintEvaluationStatus`: `SATISFIED`, `VIOLATED`, `UNRESOLVED`, `NOT_APPLICABLE`, `CONFLICTING`, `ERROR`.
- `OperandKind`: `CONSTANT`, `ENTITY_PARAMETER`, `RELATION_PROPERTY`, `DERIVED_METRIC`, `EXPRESSION`, `EXTERNAL_REFERENCE`.

## Identidad y revisión

`constraintId` identifica el significado de la condición. `constraintRevisionId` identifica su estado en una revisión. `projectVersion` contextualiza la evaluación. La identidad no debe incluir valores que cambien sólo por revisión.

## Fail-closed

Un tipo no registrado, una unidad incompatible, un operand type incorrecto o un solver externo ausente no puede producir `SATISFIED`. Debe producir `ERROR` o `UNRESOLVED` con evidencia.

## Frontera con BKH-1

`relationIds` son referencias a la Relationship Fabric. El esquema no redefine relaciones, no copia sus registros y no altera su ownership.

## Frontera con BKH-3 y BKH-4

No contiene comandos de regeneración, mutación, commit, rollback, undo, redo ni aplicación automática.
