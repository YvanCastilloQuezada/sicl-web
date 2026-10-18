# BKH-0 — Invariant Registry

**Regla de auditoría:** ningún invariante se marca `PASS` por existir en un documento o por intención de diseño.

| ID | Invariante | Estado real | Evidencia | Conclusión |
|---|---|---|---|---|
| INV-001 | Una identidad semántica por entidad | FAIL / PARTIAL | `Muro`, `StructuralElement`, `SceneNode`, múltiples IDs y mapeos. | Existen identidades paralelas; falta consolidación. |
| INV-002 | No hay mutación silenciosa | NOT_DEMONSTRATED | Hay `setProjectBuilding`, `localStorage` e IndexedDB separados; no hay auditoría transversal. | No probado. |
| INV-003 | Candidato es diferente de decisión | PARTIAL | `GeneratedBuilding.status = GENERATED_CANDIDATE`, `humanReviewRequired = true`, gates y workflow local. | La separación está modelada, pero no está impuesta por un transaction gate global. |
| INV-004 | Generado es diferente de hecho | PARTIAL | Estados `GENERATED_CANDIDATE`, `borrador`, `construido` y warnings profesionales. | Existe vocabulario, no enforcement transversal. |
| INV-005 | Preview es diferente de commit | PARTIAL | Snapshot `draft/approved` y `projectStateMutation = NOT_REQUESTED`. | El Generador actualiza el contexto activo sin commit formal. |
| INV-006 | Rollback restaura exactamente el estado previo | MISSING | No hay Undo/Redo/Rollback Engine ni prueba integrada. | No demostrado y no implementado como capacidad general. |
| INV-007 | Entidades no relacionadas permanecen sin cambios | NOT_DEMONSTRATED | No existe prueba de aislamiento de mutación sobre el proyecto completo. | No probado. |
| INV-008 | GUID estable tras guardar y reabrir | PARTIAL | `arkiGlobalId.ts` ofrece función determinista; generación usa `Math.random()`, `Date.now()` y fechas actuales en varias rutas. | Estabilidad local, no universal. |
| INV-009 | Documentación referencia entidades canónicas | PARTIAL | Dossier, IFC y exportadores contienen IDs; no hay validador transversal de referencias. | Parcial. |
| INV-010 | La autoridad humana no puede ser evadida | PARTIAL | Gates, `requiresHumanReview` y `humanReviewRequired` existen; no hay control central que bloquee todas las mutaciones. | Parcial, no PASS. |

## Resultado

Los diez invariantes fueron revisados contra código y pruebas. Ninguno se eleva a `PASS` universal. Esto no bloquea el cierre de la auditoría BKH-0, pero sí bloquea cualquier afirmación de que el BIM Kernel está endurecido.
