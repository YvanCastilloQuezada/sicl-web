# ARKI — BKH-3 Regeneration Engine

**Fecha:** 23 de septiembre de 2026  
**Orden:** 92A — BKH-3 Corrective + Evidence Closure  
**Estado:** `IMPLEMENTED / PENDING INDEPENDENT EVIDENCE REVIEW`  
**Baseline:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`

## Fixes ejecutados

**FIX-BKH3-01 — Freshness E2E.** La planificación acepta fingerprints esperados y ensucia un nodo cuando cambia la revisión de una fuente o dependencia, la versión del regenerador o un contexto relevante. La suite demuestra que un contexto irrelevante no modifica el fingerprint de una salida no relacionada. La vigencia no depende únicamente de `CLEAN`.

**FIX-BKH3-02 — Conditional propagation.** `PropagationRule.conditionId` ya no se ignora. Sin evaluador, la regla queda sin propagación; con evaluador gobernado sólo propaga en `TRUE`. La suite cubre `TRUE`, `FALSE` y `UNKNOWN`.

**FIX-BKH3-03 — Partial aggregation.** Se añadió agregación explícita de estados por nodo. `COMPLETED`, `PARTIAL`, `BLOCKED`, `FAILED` y `UNKNOWN` se distinguen; un nodo bloqueado, fallido o desconocido permanece visible y evita declarar éxito global incorrectamente.

**FIX-BKH3-04 — BKH-2 integration.** `RegeneratorDefinition` puede ejecutar gates reales de BKH-2 antes y después de regenerar. La suite usa `evaluateConstraint` de `shared/arkiConstraintEngine.ts` y demuestra estados `SATISFIED`, `VIOLATED` y `UNKNOWN`. BKH-3 no fabrica ni modifica definiciones de constraints y no auto-certifica evidencia.

**FIX-BKH3-05 — Torture scenario.** La suite ejecuta una cadena de dependencia `PARAMETER → GEOMETRY → RELATIONSHIP → QUANTITY → COST`, propagación directa y transitiva, entidad no relacionada, dominio sin regenerador, estados de constraint, y protección contra mutación canónica. El dirty set mínimo observado fue `geometry`, `quantity`, `cost`.

## Evidencia final

| Comprobación | Resultado |
|---|---|
| `pnpm check` | PASS |
| `pnpm build` | PASS |
| BKH-1 regression | PASS |
| BKH-2 regression | PASS |
| BKH-3 original suite | PASS |
| BKH-3 corrective suite | PASS |
| Constructive regression | PASS |
| Professional regression | PASS |
| Technical dossier regression | PASS |
| E7 regression | PASS |
| ZIP integrity | PASS |
| Manifest file-by-file | PASS |
| SHA-256 file-by-file | PASS |

## Fronteras preservadas

BKH-3 sólo planifica y regenera estados derivados. No realiza commit, transacción, rollback, undo/redo, aprobación humana, worksharing, documentación, nuevos solvers ni cambios en BKH-1/BKH-2. BKH-4, BKH-5, BKH-6, BKH-7 y E8 permanecen bloqueados; E5, E6 y E7 permanecen congelados.

## Limitaciones declaradas

Los regeneradores productivos de todos los dominios de ARKI aún deben registrarse de manera gobernada. La integración BKH-2 se ejecuta mediante el callback de gates de cada regenerador; no convierte a BKH-3 en propietario del Constraint Engine. El motor no persiste resultados ni los promueve a estado canónico.

## Veredicto

**BKH-3: IMPLEMENTED / PENDING INDEPENDENT EVIDENCE REVIEW.**

No se declara `VERIFIED` hasta que la revisión independiente confirme el paquete y la correspondencia entre manifest, ZIP, hashes y outputs crudos.
