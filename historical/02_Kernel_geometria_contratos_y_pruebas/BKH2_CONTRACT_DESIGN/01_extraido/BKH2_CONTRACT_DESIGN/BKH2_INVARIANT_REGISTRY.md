# BKH-2 — Invariant Registry

**Estado:** invariantes contractuales; ningún PASS de implementación se declara.

| ID | Invariante | Criterio futuro de prueba |
|---|---|---|
| `CONSTRAINT_IDENTITY_STABLE` | La identidad semántica permanece estable entre revisiones compatibles | `constraintId` igual en V1/V2 |
| `REVISION_NOT_IDENTITY` | Revisión de proyecto y entidad semántica son conceptos distintos | Historial V1/V2 preservado |
| `UNKNOWN_NOT_PASS` | Falta de datos o solver no equivale a satisfecho | Prueba negativa |
| `NO_SCALE_EXTRAPOLATION` | No se extrapola una regla entre escalas | Caso BUILDING/SITE |
| `NO_DISCIPLINE_EXTRAPOLATION` | No se extrapola una regla entre disciplinas | Caso arquitectura/estructuras |
| `DIMENSIONAL_COHERENCE` | Operandos dimensionalmente incompatibles no se comparan | metros/kilogramos rechazados |
| `EVIDENCE_REQUIRED_WHEN_DECLARED` | Se exige la evidencia declarada por el registro | reference/reproducible/human_review |
| `EVALUATION_NO_MUTATION` | Evaluar no modifica modelo, relación ni snapshot | Comparación antes/después |
| `RELATIONSHIP_FABRIC_NOT_DUPLICATED` | BKH-2 referencia BKH-1 y no crea grafo paralelo | IDs y hash de relaciones |
| `HUMAN_AUTHORITY_PRESERVED` | BKH-2 no decide ni aprueba por el humano | No existe comando de aprobación |
| `GENERATED_NOT_FACT` | Generado/inferido no se eleva a hecho | Resultado epistemológico |
| `RESEARCHED_NOT_VERIFIED` | Investigado no se eleva a verificado | Constraint regulatoria |
| `UNSUPPORTED_SOLVER_NOT_DEMONSTRATED` | Solver ausente produce estado explícito | UNKNOWN/EXTERNAL_ORACLE_REQUIRED |
| `CAUSATION_NOT_ASSUMED` | Violación no demuestra causalidad | No se genera causa implícita |
| `CONDITIONAL_SCOPE_EXPLICIT` | Conditional requiere condición declarada | Caso de aplicabilidad |

## Regla

Estos invariantes deben pasar pruebas ejecutables antes de cualquier veredicto `VERIFIED`. Durante Contract Design permanecen `DEFINED / NOT IMPLEMENTED`.
