# BKH-2 — Invariant Registry v1.2

**Estado:** invariantes contractuales; ningún PASS de implementación se declara.

| ID | Invariante | Criterio futuro de prueba |
|---|---|---|
| `CONSTRAINT_IDENTITY_STABLE` | La identidad semántica permanece estable entre revisiones compatibles | `constraintId` igual en V1/V2 |
| `REVISION_NOT_IDENTITY` | Revisión y entidad semántica son conceptos distintos | Historial V1/V2 preservado |
| `HARDNESS_APPLICABILITY_SEVERITY_SEPARATE` | Hardness, modo de aplicabilidad y severidad son ejes independientes | HARD + CONDITIONAL + WARNING válido |
| `UNKNOWN_NOT_PASS` | La incertidumbre nunca equivale a satisfecho | UNKNOWN con cualquier razón no pasa |
| `UNIFIED_EVALUATION_STATUS` | Todas las evaluaciones usan la taxonomía única | No existen estados paralelos |
| `INSTANCE_APPLICABILITY_EXPLICIT` | La instancia declara escala, disciplina, entidad y jurisdicción cuando corresponda | Capacidad del tipo no basta |
| `NO_SCALE_EXTRAPOLATION` | No se extrapola una regla entre escalas | Caso BUILDING/SITE |
| `NO_DISCIPLINE_EXTRAPOLATION` | No se extrapola una regla entre disciplinas | Caso arquitectura/estructuras |
| `DIMENSIONAL_COHERENCE` | Operandos incompatibles no se comparan | metros/kilogramos rechazados |
| `PREDICATE_DECLARATIVE_ONLY` | Predicate sólo usa AST/DSL validado | eval/Function/código arbitrario rechazados |
| `OPERATOR_REGISTRY_CLOSED` | Operadores y funciones deben estar registrados | Operador desconocido rechazado |
| `EVIDENCE_REQUIRED_WHEN_DECLARED` | Se exige evidencia declarada por el registry | Casos negativos |
| `EVALUATION_NO_MUTATION` | Evaluar no modifica modelo, relación ni snapshot | Comparación antes/después |
| `RELATIONSHIP_FABRIC_NOT_DUPLICATED` | BKH-2 referencia BKH-1 y no crea grafo paralelo | IDs y hash de relaciones |
| `HUMAN_AUTHORITY_PRESERVED` | BKH-2 no decide por el humano | No existe aprobación automática |
| `GENERATED_NOT_FACT` | Generado/inferido no se eleva a hecho | Resultado epistemológico |
| `RESEARCHED_NOT_VERIFIED` | Investigado no se eleva a verificado | Constraint regulatoria |
| `UNSUPPORTED_SOLVER_NOT_DEMONSTRATED` | Solver ausente produce UNKNOWN con razón explícita | UNKNOWN + UNSUPPORTED_SOLVER |
| `CAUSATION_NOT_ASSUMED` | Violación no demuestra causalidad | No se genera causa implícita |
| `CONDITIONAL_SCOPE_EXPLICIT` | Conditional requiere condición declarada | Caso de aplicabilidad |

## Taxonomías canónicas

`ConstraintEvaluationStatus` sólo contiene `SATISFIED`, `VIOLATED`, `UNKNOWN`, `NOT_APPLICABLE`, `CONFLICTING` y `ERROR`.

Las causas están en `resolutionReason`: `NONE`, `MISSING_DEPENDENCY`, `UNSUPPORTED_SOLVER`, `EXTERNAL_ORACLE_REQUIRED`, `NOT_DEMONSTRATED`, `INSUFFICIENT_EVIDENCE`, `INSUFFICIENT_EPISTEMIC_STATE` e `INVALID_INPUT`.

## Regla

Estos invariantes deben pasar pruebas ejecutables antes de cualquier veredicto `VERIFIED`. Durante Contract Design permanecen `DEFINED / NOT IMPLEMENTED`.
