# BKH-2 — ConstraintTypeRegistry Contract v1.2

**Estado:** diseño contractual; no implementación.

## Autoridad única

`ConstraintTypeRegistry` será la única autoridad para declarar tipos de constraints. Un adapter legacy no podrá inventar silenciosamente un tipo nuevo ni un operador nuevo.

## Capacidad del tipo

Cada tipo declara capacidades potenciales:

- `typeId` estable.
- `family`.
- `supportedHardness`: `HARD` y/o `SOFT`.
- `supportedApplicabilityModes`: `UNCONDITIONAL` y/o `CONDITIONAL`.
- `severityTaxonomy` permitida.
- escalas y disciplinas que el tipo puede comprender.
- `operandTypes`, operadores y funciones registrados.
- unidades y dimensiones esperadas.
- evidencia mínima y requisitos epistemológicos.
- estrategia de evaluación.
- dependencias de relaciones o entidades.
- versión, estado y provenance del tipo.

Esto describe **TYPE CAPABILITY**. No demuestra que una instancia concreta sea aplicable.

## Instance Applicability

Cada `ConstraintRecord` debe declarar su propio `applicability`: escalas, disciplinas, entidades, clases, jurisdicciones y condiciones. La evaluación verifica la coincidencia entre el contexto y la instancia. Una capacidad de tipo no autoriza extrapolación a otra escala, disciplina o jurisdicción.

## Taxonomía independiente

### Hardness

- `HARD`: no admite trade-off ordinario.
- `SOFT`: preferencia u objetivo susceptible de negociación.

### Applicability mode

- `UNCONDITIONAL`: se evalúa cuando el contexto coincide.
- `CONDITIONAL`: se evalúa sólo si `applicability.conditions` resulta satisfecha.

Una constraint puede ser `HARD + CONDITIONAL`.

### Severity

La severidad es independiente de hardness y aplicabilidad. Valores contractuales iniciales:

- `INFORMATIONAL`
- `ADVISORY`
- `WARNING`
- `ERROR`
- `CRITICAL`

No se usarán `ADVISORY` o `INFORMATIONAL` como sustitutos de `SOFT`.

## Estado canónico de evaluación

`ConstraintEvaluationStatus` sólo puede ser:

`SATISFIED`, `VIOLATED`, `UNKNOWN`, `NOT_APPLICABLE`, `CONFLICTING` o `ERROR`.

Las causas se declaran separadamente en `resolutionReason`: `NONE`, `MISSING_DEPENDENCY`, `UNSUPPORTED_SOLVER`, `EXTERNAL_ORACLE_REQUIRED`, `NOT_DEMONSTRATED`, `INSUFFICIENT_EVIDENCE`, `INSUFFICIENT_EPISTEMIC_STATE` o `INVALID_INPUT`.

## Predicate y operadores

El registry gobierna un AST declarativo. Sólo se permiten nodos y operadores registrados, con aridad, tipos, unidades y límites de profundidad definidos. No se permite `eval()`, `Function()`, ejecución arbitraria de JavaScript ni strings interpretados como código.

Operadores iniciales candidatos: `EQ`, `NE`, `LT`, `LTE`, `GT`, `GTE`, `ADD`, `SUB`, `MUL`, `DIV`, `AND`, `OR`, `NOT`, `NEGATE`, `ABS`, `IN` y `NOT_IN`. Las llamadas (`call`) sólo pueden dirigirse a funciones registradas.

## Familias no ejecutables

Las familias contractuales son `GEOMETRIC`, `SPATIAL`, `PARAMETRIC`, `FUNCTIONAL`, `STRUCTURAL`, `MEP`, `REGULATORY`, `ACCESSIBILITY`, `ENVIRONMENTAL`, `PERFORMANCE`, `COST`, `SCHEDULE`, `CONSTRUCTABILITY`, `DOCUMENTATION` y `EPISTEMIC`.

La presencia de una familia no demuestra la existencia de un solver profesional. Un solver ausente produce `UNKNOWN` con `UNSUPPORTED_SOLVER`, `EXTERNAL_ORACLE_REQUIRED` o `NOT_DEMONSTRATED`.

## Seguridad

Una regla investigada no se convierte automáticamente en normativa verificada. Una preferencia no se convierte en `HARD`. Una escala o disciplina no se extrapola a otra sin aplicabilidad explícita.
