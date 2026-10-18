# ARKI F1 — Paquete de evidencia para revisión de código

## Identidad

- **Baseline:** `5333c1f45c980c62e3f8540ff73544014ed002b6`
- **Rama:** `feat/h005-selective-recomputation`
- **HEAD:** `a9d1ae21bc82bdbaff34f8bcc1e1d1e383543ec9`
- **main:** permanece en `5333c1f45c980c62e3f8540ff73544014ed002b6`
- **Objetivo:** revisar la implementación H-005 sin modificar H-001–H-004.

## Contenido

- `source/sicl/h005/`: contrato, registry, engine e inicializador H-005.
- `tests/`: todos los archivos `test_h005_*.py` de la rama.
- `verification/pytest_global.txt`: corrida global exacta: **532 passed, 2 warnings**.
- `verification/pytest_focal_h001_h005.txt`: corrida focal exacta: **90 passed**.
- `verification/git_log_5333_to_a9d1ae2.txt`: commits y estadísticas desde el baseline.
- `verification/diff_src_sicl.txt`: diff completo bajo `src/sicl/`.
- `verification/frozen_core_diff.txt`: diff de H-001–H-004; debe estar vacío.
- `verification/forbidden_primitives_grep.txt`: grep de `eval`, `exec`, imports dinámicos, shell y red en H-005; está vacío.
- `verification/human_authority_guard.txt`: fragmento literal del guard de elegibilidad.
- `verification/selective_subgraph_guard.txt`: fragmento literal de selección, derivación y plan stale.
- `verification/phase3_fix_diff.txt`: evidencia del archivo de test creado durante la corrección de Fase 3; la corrección de la comparación de relaciones quedó en el commit del engine.

## C-1 — ¿Cadena causal o pipeline acotada?

La evidencia de `tests/test_h005_e2e_persistence.py` demuestra una **pipeline causal acotada y trazable**:

```text
DERIVATION → CHANGE → IMPACT → VALIDITY → REACTION → H-005 → NEW DERIVATION → CLOSE/REOPEN/VERIFY
```

No demuestra razonamiento causal semántico general, inferencia arquitectónica ni completitud del grafo. La clasificación correcta es:

```text
H001_H005_CAUSAL_CHAIN = VERIFIED_BOUNDED_PIPELINE
SEMANTIC_CAUSAL_REASONING = NOT_CLAIMED
```

## C-2 — Selectividad

La selectividad se determina por las acciones `RECOMPUTE` que H-004 entrega en el `ReactionPlan`. H-005 no recorre ni recomputa todo el ledger. Por cada acción:

1. busca únicamente la derivación del artefacto solicitado en el `project_id` recibido;
2. exige que el artefacto esté `FULLY_STALE`;
3. resuelve únicamente `(method, method_version)`;
4. ejecuta el handler seleccionado;
5. actualiza refs efectivos solo para outputs ejecutados;
6. continúa en el orden topológico ya producido por H-004.

El test `test_three_level_chain_recomputes_in_topological_order_without_stale_inputs` prueba A→B→C y verifica que B recibe A versión 2 y C recibe B versión 2.

Esto verifica **selectividad respecto al ReactionPlan**, no completitud semántica del subgrafo. `GRAPH_MAY_BE_INCOMPLETE` de H-002 sigue siendo una limitación declarada.

## C-3 — Guard de Human Authority

El guard literal está en `verification/human_authority_guard.txt` y exige simultáneamente:

```python
if action.action_type is not ActionType.RECOMPUTE: reject
if action.status is not ActionStatus.PLANNED: reject
if action.requires_human_authority: reject
```

Además, el engine revalida que el artefacto del snapshot del plan esté en `FULLY_STALE`. El test `test_engine_blocks_human_authority_and_forged_review_plan` demuestra el rechazo de una acción `REVIEW` con `requires_human_authority=True`.

**Reserva TOCTOU:** el engine no vuelve a ejecutar `ValidityAnalyzer` dentro de `execute`; valida el snapshot `ReactionPlan`, el estado `FULLY_STALE`, la derivación existente y `current_refs`. Una revalidación H-003 en el mismo método sería una mejora futura separada.

## C-4 — Mapeo fail-closed

| Condición | Evidencia | Estado |
|---|---|---|
| Replay / stale plan | `test_replaying_a_plan_after_success_is_blocked_as_stale` | VERIFICADO |
| Out-of-order execution | `test_three_level_chain_recomputes_in_topological_order_without_stale_inputs` | VERIFICADO |
| Malformed plan / forged plan | `test_malformed_plan_unknown_artifact_and_partial_graph_are_blocked`, `test_forged_recompute_against_fully_valid_report_is_blocked` | VERIFICADO |
| Unknown handler | `test_missing_and_ambiguous_handlers_do_not_execute`, `test_engine_blocks_missing_handler_without_mutating_ledger` | VERIFICADO |
| Ambiguous handler | `test_missing_and_ambiguous_handlers_do_not_execute` | VERIFICADO |
| Handler exception / malformed output | `test_engine_blocks_handler_exception_and_malformed_output` | VERIFICADO |
| Dependency race / missing current ref | `test_malformed_handler_output_and_dependency_race_are_blocked` | VERIFICADO |
| Cycle | `test_cycle_is_blocked_and_never_executes` | VERIFICADO |
| Missing dependency / identity uncertainty | `test_missing_dependency_and_identity_uncertainty_fail_closed_at_planning` | VERIFICADO |
| Hash mismatch | misma prueba; además validación H-003 produce `RECOMPUTE` para mismatch compatible | PARCIAL: no hay un test H-005 dedicado a ejecutar/no ejecutar específicamente ese caso |
| Cross-project | `test_cross_project_execution_cannot_reuse_other_project_derivation` | VERIFICADO |
| Multiple derivations | `test_multiple_derivations_never_auto_recompute_when_one_is_valid` | VERIFICADO |

Hay **7 archivos de test H-005 y 25 tests nuevos**. Algunas pruebas cubren más de una condición. No se presenta como ocho tests independientes uno-a-uno: el mapeo anterior conserva esa distinción.

## C-5 — Primitivas prohibidas

`verification/forbidden_primitives_grep.txt` es vacío para `src/sicl/h005/`. El grep no encuentra:

```text
eval / exec / __import__ / subprocess / socket / requests / urllib
```

La prueba adversarial usa `subprocess` únicamente para ejecutar `git diff` durante la auditoría del test; no pertenece al código H-005 de producción.

## C-6 — Suite global

`verification/pytest_global.txt` conserva la salida completa de una corrida:

```text
532 passed, 2 warnings in 51.21s
```

Warnings:

1. `StarletteDeprecationWarning` relacionado con `httpx`.
2. `PytestUnraisableExceptionWarning` de limpieza interna de IFCOpenShell en `tests/test_rfc030_drawing.py::test_ifc_invalid_rejected`.

La corrida focal independiente conserva:

```text
90 passed in 0.43s
```

## C-7 — Defectos corregidos

### Defecto 1 — relation-key validation

Durante Fase 3 el engine comparaba claves de relaciones como pares `(key, version)` contra triples `(entity_type, entity_id, version)`. El test de ejecución falló. Se corrigió en `src/sicl/h005/engine.py` para comparar triples homogéneos. La corrección quedó en el commit `19232fb`.

### Defecto 2 — fixture partial-valid

El primer fixture de múltiples derivaciones omitía el hash de la derivación que debía ser válida; H-003 la clasificó correctamente como `IDENTITY_UNCERTAIN`, no como `VALID`. Se corrigió el fixture con hashes coincidentes. La corrección quedó en el commit `a9d1ae2`.

## P-1 — Registry

El registry no hace fallback. La clave es exactamente `(method, method_version)`:

- ausencia: `HANDLER_NOT_REGISTERED`;
- más de un handler: `AMBIGUOUS_HANDLER`;
- versión no registrada: no hay fallback a otra versión.

No existe una política especial de deprecated handlers; si no se registra explícitamente la clave, se bloquea.

## P-2 — Dependencia fuera del subgrafo

El test multinivel muestra que el engine actualiza `effective_refs` después de cada ejecución y entrega la versión nueva al siguiente handler. Si la dependencia requerida no aparece en `current_refs`, el engine devuelve `MISSING_CURRENT_DEPENDENCY` y no registra una derivación.

Esto protege contra la carrera local demostrada; no afirma completitud global del grafo.

## P-3 — Revalidación TOCTOU

El engine revalida el estado del snapshot (`FULLY_STALE`), la existencia y unicidad de la derivación, la ausencia de una versión posterior, el handler, las refs actuales y el provenance del output. No ejecuta una nueva llamada a H-003 dentro de `execute`. Esto queda marcado como **reserva de diseño**, no oculto como capacidad implementada.

## Veredicto de revisión

```text
F1_IMPLEMENTED=YES
F1_CODE_REVIEW_PACKAGE=PREPARED
F1_VERDICT=CODE_REVIEW_REQUIRED
H001_H004_FREEZE=PRESERVED
MAIN_MODIFIED=NO
```

Este paquete permite revisar código, tests, diffs y warnings. No convierte automáticamente los claims en aprobación arquitectónica.
