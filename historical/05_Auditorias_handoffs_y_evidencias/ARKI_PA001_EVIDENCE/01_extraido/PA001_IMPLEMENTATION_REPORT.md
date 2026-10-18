# ARKI — Capacitación Previa PA-001
## Programa arquitectónico y relaciones espaciales

**Estado máximo:** `IMPLEMENTED / TESTS_PASS / PENDING INDEPENDENT REVIEW`

## A. Qué encontró la auditoría

El repositorio ya contiene `ConstructionSpace[]` dentro de `ConstructionModel` en `shared/arkiConstructionOntology.ts`. Ese modelo es el propietario actual del estado constructivo observado y ya expone nombre, función, nivel, área, altura, muros, requisitos y estado. También existe BKH-1 `RelationshipFabric` para relaciones semánticas generales y BKH-2 `ConstraintEngine` para evaluación declarativa, evidencia, applicability y estados epistemológicos.

No existe evidencia de un evaluador de programa arquitectónico equivalente. La generación actual de espacios no aporta evidencia suficiente para certificar todas las necesidades funcionales. Por ello, PA-001 mantiene `UNKNOWN` cuando la evidencia no permite decidir.

## B. Qué se reutilizó

Se reutilizó `ConstructionSpace` como representación observada, `ConstructionModel` como entrada de Project State, y las convenciones de provenance/evidence de BKH-1/BKH-2. No se modificaron esos contratos ni se creó una segunda fuente de verdad espacial.

## C. Qué se creó

Se creó `shared/arkiArchitecturalProgram.ts`, que define `ArchitecturalProgram`, `ProgramSpaceRequirement`, `ProgramRelationship`, `ObservedProjectState`, `ProgramEvaluationResult`, applicability, evidence, provenance y estados epistemológicos. El evaluador es puro, determinista y no ejecuta código arbitrario.

Se creó `scripts/test-architectural-program.ts` con pruebas normales, adversariales, metamórficas y test-the-test. Se creó el runner reproducible `scripts/run-pa001-evidence.sh`.

## D. Qué deliberadamente no se implementó

No se implementó Space Syntax, Hillier, Integration, Choice, Mean Depth, RA/RRA, Intelligibility, Brandes, exámenes A/B/C/D, normativa completa, lógica hospitalaria, museo, colegio, optimización generativa, solver estructural, MEP ni física del edificio. Tampoco se modificó `ConstructionModel`, BKH-1, BKH-2, persistencia, UI o estado canónico.

## E. Resultados de pruebas

| Bloque | Resultado |
|---|---:|
| PA-T01..PA-T10 | PASS |
| PA-A01..PA-A08 | PASS |
| PA-M01..PA-M05 | PASS |
| Test-the-test | PASS |
| Determinismo | PASS |
| UNKNOWN preservado | PASS |
| Provenance preservado | PASS |
| Detección de conflictos | PASS |
| Aislamiento entre proyectos | PASS |
| `pnpm check` | PASS |
| `pnpm build` | PASS |

## F. Mutaciones controladas

El test-the-test inyectó una mutación `UNKNOWN → SATISFIED` en el resultado y el oracle la detectó. La suite normal también cubre no tratar `PREFERENCE` como `MANDATORY`, no seleccionar silenciosamente conflictos, conservar provenance, mantener proyectos aislados y no transformar ausencia de evidencia en `VIOLATED`.

## G. Deuda y límites

La observación geométrica y relacional del proyecto aún es limitada: PA-001 recibe relaciones observadas explícitas y no pretende inferir automáticamente proximidad geométrica desde planos o meshes. La validación profesional, normativa y tipológica permanece fuera de alcance. Las dimensiones ambientales, accesibilidad, servicios y privacidad pueden representarse, pero no se certifican sin evidencia suficiente.

## H. Riesgos

El principal riesgo es confundir un requisito programático con una relación geométrica observada. Por diseño, el evaluador no lo hace. Otro riesgo es que futuros adaptadores agreguen relaciones observadas sin provenance; el contrato conserva `UNKNOWN_SOURCE` como estado permitido y los tests deben mantener esta frontera.

## I. Archivos modificados/creados

- `PA001_AUDIT_BEFORE_CODE.md`
- `shared/arkiArchitecturalProgram.ts`
- `scripts/test-architectural-program.ts`
- `scripts/run-pa001-evidence.sh`
- `PA001_IMPLEMENTATION_REPORT.md`
- `PA001_REQUIREMENT_MATRIX.md`
- `PA001_OUTPUTS.txt`
- `PA001_MANIFEST.json`

El worktree ya estaba sucio antes de PA-001; no se declara limpio. No se creó commit porque no fue autorizado.
