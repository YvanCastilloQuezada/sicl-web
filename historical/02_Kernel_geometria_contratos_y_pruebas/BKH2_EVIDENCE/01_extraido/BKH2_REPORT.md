# ARKI — BKH-2 Constraint Engine Report

**Fecha:** 23 de septiembre de 2026  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`  
**Estado:** **IMPLEMENTED / NOT YET VERIFIED**

## Veredicto de implementación

BKH-2 fue implementado dentro de su frontera aprobada. El núcleo nuevo está en `shared/arkiConstraintEngine.ts` y su suite en `scripts/test-bkh2-constraint-engine.ts`. La implementación no sustituye la Relationship Fabric, no regenera geometría, no muta el modelo canónico y no inicia transacciones.

El estado no se promueve a `VERIFIED` en este documento. La verificación independiente debe revisar el código real, la suite, los outputs y los invariantes contractuales.

## Capacidades implementadas

| Capacidad | Estado | Evidencia |
|---|---|---|
| `ConstraintRecord` canónico | IMPLEMENTED | `shared/arkiConstraintEngine.ts` |
| `ConstraintTypeRegistry` único | IMPLEMENTED | 12 tipos registrados |
| Ejes independientes `hardness`, `applicabilityMode`, `severity` | IMPLEMENTED | Suite BKH-2 |
| Aplicabilidad por escala, disciplina, entidad, jurisdicción, fase y tipo de proyecto | IMPLEMENTED | `ApplicabilityCondition` y validadores |
| AST declarativo tipado | IMPLEMENTED | literales, referencias, unary, binary, logical, set y call |
| Prohibición de `eval`, `Function` y código arbitrario | IMPLEMENTED | inspección de fuente y suite negativa |
| Estados unificados | IMPLEMENTED | `SATISFIED`, `VIOLATED`, `UNKNOWN`, `NOT_APPLICABLE`, `CONFLICTING`, `ERROR` |
| Razones epistemológicas separadas | IMPLEMENTED | `resolutionReason` |
| Unidades y dimensiones | IMPLEMENTED | conversiones controladas m/cm/mm/m²/m³/kg/g/PEN/USD |
| Restricciones que requieren solver externo | IMPLEMENTED | resultado `UNKNOWN + UNSUPPORTED_SOLVER` |
| Detección de conflictos HARD | IMPLEMENTED | `detectConstraintConflicts()` |
| Revisiones por versión de proyecto | IMPLEMENTED | `ConstraintEngine.history()` y `toJSON()/fromJSON()` |
| Adapter desde `arkiParametricFamilies.Constraint` | IMPLEMENTED | `legacyConstraintToRecord()` |
| Referencias a relaciones BKH-1 | IMPLEMENTED | `relationIds` y dependencia faltante fail-closed |

## Evidencia de validación

El archivo `BKH2_IMPLEMENTATION_OUTPUTS.txt` conserva los outputs reales de:

- `pnpm check`.
- `pnpm build`.
- `scripts/test-bkh2-constraint-engine.ts`.
- Regresión BKH-1.
- Pruebas constructivas, profesionales, dossier técnico, serialización y coherencia de muro.
- Pruebas SceneModel, persistencia formal y E7.

Resultado global de la ejecución: `validation_exit=0`.

## Límites declarados

BKH-2 no implementa regeneración o propagación de cambios, commit, rollback, undo/redo, worksharing, aprobación humana, persistencia remota, solver estructural profesional ni ejecución de fórmulas como código. Esas responsabilidades permanecen en BKH-3, BKH-4, adaptadores externos o fases posteriores.

El worktree ya estaba sucio antes de Gate 1. Los cambios preexistentes se registraron en `BKH2_GATE1_BASELINE.txt` y no se atribuyen a BKH-2. El warning de pnpm sobre la sección `pnpm` de `package.json` también pertenece al estado preexistente del proyecto.

## Próximo gate

Revisión independiente del paquete, especialmente de los diez invariantes BKH-2, la no mutación, la compatibilidad dimensional, la determinación de conflictos y la separación estricta respecto de BKH-1/BKH-3/BKH-4. Hasta ese veredicto, BKH-3 y BKH-4 continúan bloqueados.
