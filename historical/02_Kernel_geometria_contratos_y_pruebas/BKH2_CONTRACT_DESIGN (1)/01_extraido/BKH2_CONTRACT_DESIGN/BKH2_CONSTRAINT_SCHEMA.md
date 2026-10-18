# BKH-2 — Constraint Schema v1.2

## Estado

`BKH-2 CONTRACT v1.2 — IN REVIEW / IMPLEMENTATION BLOCKED`.

## ConstraintRecord

`ConstraintRecord` representa una condición declarada. Sus campos son:

| Campo | Estado | Significado |
|---|---|---|
| `constraintId` | REQUIRED | Identidad semántica estable. |
| `constraintRevisionId` | REQUIRED | Revisión de la constraint. |
| `constraintType` | REQUIRED | Tipo registrado. |
| `family` | DERIVED/validated | Familia declarada por el registry; no sustituye al tipo. |
| `subjectEntityIds` | REQUIRED | Entidades concretas afectadas. |
| `relationIds` | OPTIONAL | Relaciones BKH-1 consultadas o requeridas. |
| `applicability` | REQUIRED | Aplicabilidad de esta instancia. |
| `predicate` | REQUIRED | AST declarativo tipado. |
| `operands` | REQUIRED | Valores y referencias tipadas. |
| `hardness` | REQUIRED | `HARD` o `SOFT`. |
| `applicabilityMode` | REQUIRED | `UNCONDITIONAL` o `CONDITIONAL`. |
| `severity` | REQUIRED | Taxonomía independiente del hardness. |
| `enforcement` | REQUIRED | Política de reporte, bloqueo hipotético o revisión. |
| `epistemicStatus` | REQUIRED | Estado de conocimiento de la regla. |
| `provenance` | REQUIRED | Origen, fuente, autoría y transformaciones. |
| `projectVersion` | REQUIRED | Contexto de versión. |
| `scenario` | OPTIONAL | Escenario de evaluación. |
| `validFrom` / `validTo` | OPTIONAL | Vigencia temporal. |
| `status` | REQUIRED | Estado del registro, no el resultado de evaluación. |

Una constraint puede ser simultáneamente `HARD + CONDITIONAL + WARNING`, porque las tres propiedades responden preguntas distintas.

## InstanceApplicability

La capacidad de un tipo no constituye la aplicabilidad de una instancia. `applicability` debe declarar, según corresponda:

- `scales`: escalas permitidas para esta instancia.
- `disciplines`: disciplinas aplicables.
- `entityIds`: entidades concretas.
- `entityKinds`: clases de entidad admitidas.
- `jurisdictions`: jurisdicciones concretas.
- `conditions`: AST booleano que debe cumplirse para activar una constraint `CONDITIONAL`.
- `phaseIds`, `projectTypes` o contextos adicionales cuando el tipo lo requiera.

La instancia sólo se aplica si el contexto coincide con esta declaración. No se permite extrapolación automática de escala o disciplina.

## Predicate AST

`predicate` no es texto libre ni código. Es un árbol serializable cuyos nodos permitidos son:

- `literal`: número, texto, booleano o valor con unidad.
- `reference`: parámetro, propiedad de entidad, propiedad relacional o métrica derivada.
- `unary`: operador registrado como `NOT`, `NEGATE` o `ABS`.
- `binary`: operador registrado como `EQ`, `NE`, `LT`, `LTE`, `GT`, `GTE`, `ADD`, `SUB`, `MUL` o `DIV`.
- `logical`: operador registrado `AND` u `OR`.
- `set`: operador registrado `IN` o `NOT_IN`.
- `call`: sólo funciones registradas por `ConstraintTypeRegistry`, con argumentos tipados.

El AST debe pasar validación de tipos, unidades, aridad, profundidad y operadores permitidos antes de evaluarse. Se prohíben `eval()`, `Function()`, ejecución arbitraria de JavaScript y cualquier string interpretado como código.

## Evaluation State Model

`ConstraintEvaluationStatus` es una taxonomía única:

- `SATISFIED`
- `VIOLATED`
- `UNKNOWN`
- `NOT_APPLICABLE`
- `CONFLICTING`
- `ERROR`

Las causas epistemológicas y de resolución no son estados alternativos. Se expresan en `resolutionReason`:

- `NONE`
- `MISSING_DEPENDENCY`
- `UNSUPPORTED_SOLVER`
- `EXTERNAL_ORACLE_REQUIRED`
- `NOT_DEMONSTRATED`
- `INSUFFICIENT_EVIDENCE`
- `INSUFFICIENT_EPISTEMIC_STATE`
- `INVALID_INPUT`

Ejemplo: un solver inexistente produce `status: UNKNOWN` y `resolutionReason: UNSUPPORTED_SOLVER`. Nunca produce `SATISFIED`.

## ConstraintEvaluation

El resultado contiene `constraintId`, `constraintRevisionId`, `projectVersion`, `scenario`, `status`, `resolutionReason`, `actualValue`, `expectedValue`, `tolerance`, `units`, `hardness`, `severity`, `explanation`, `evidence`, `conflictingConstraintIds`, `dependencies`, `provenance` y `evaluatedAtRevision`.

## ConstraintConflict

Un conflicto contiene `conflictId`, `constraintIds`, `sharedApplicability`, `status: CONFLICTING`, `resolutionReason`, `explanation` y `evidence`. BKH-2 no decide cuál constraint gana.

## Fronteras

`relationIds` referencian Relationship Fabric. El schema no redefine relaciones, no muta entidades, no regenera geometría y no contiene comandos de commit, rollback, undo o redo.
