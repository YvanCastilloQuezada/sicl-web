# BKH-2 — ConstraintTypeRegistry Contract

**Estado:** diseño contractual; no implementación.

## Autoridad única

`ConstraintTypeRegistry` será la única autoridad para declarar tipos de constraints. Un adapter legacy no podrá inventar silenciosamente un tipo nuevo.

## Campos contractuales

Cada tipo deberá declarar:

- `typeId` estable.
- `family` y dominio de aplicación.
- `hardness` permitida: `HARD`, `SOFT` o `CONDITIONAL`.
- escalas y disciplinas permitidas.
- operandos y operadores admitidos.
- unidades y dimensiones esperadas.
- evidencia mínima.
- requisitos epistemológicos.
- estrategia de evaluación.
- dependencias de relaciones o entidades.
- versión y estado del registro.
- política para `UNKNOWN`, `NOT_APPLICABLE` y `CONFLICTING`.

## Taxonomía inicial no ejecutable

Las familias contractuales son `GEOMETRIC`, `SPATIAL`, `PARAMETRIC`, `FUNCTIONAL`, `STRUCTURAL`, `MEP`, `REGULATORY`, `ACCESSIBILITY`, `ENVIRONMENTAL`, `PERFORMANCE`, `COST`, `SCHEDULE`, `CONSTRUCTABILITY`, `DOCUMENTATION` y `EPISTEMIC`.

La presencia de una familia no demuestra que exista un solver profesional. Si la estrategia no existe o la evidencia es insuficiente, el resultado debe ser `UNKNOWN`, `EXTERNAL_ORACLE_REQUIRED` o `NOT_DEMONSTRATED`.

## Tipos candidatos iniciales

`DISTANCE_LIMIT`, `ALIGNMENT`, `DIMENSION_RANGE`, `PARAMETER_FORMULA`, `HOST_COMPATIBILITY`, `CLEARANCE`, `CONTAINMENT`, `PHASE_COMPATIBILITY`, `MATERIAL_COMPATIBILITY` y `DOMAIN_RULE` quedan como candidatos para revisión. No se consideran implementados.

## Reglas de seguridad

Una preferencia de usuario no se convierte silenciosamente en `HARD`. Una regla investigada no se convierte automáticamente en normativa verificada. Una condición de una escala o disciplina no se extrapola a otra sin aplicabilidad explícita.
