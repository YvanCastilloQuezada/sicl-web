# ARKI — BKH-1 Relationship Fabric Report

**Estado:** `BKH-1 VERIFIED — BKH-1 SCOPE`

**Autorización:** Documento 86 — Orden de Ejecución BKH-1 Relationship Fabric.

**Baseline inicial:** `main@c62183a5904f02aa0a935572454a5a35f9d167aa`.

## Alcance ejecutado

Se implementó una única Relationship Fabric en `shared/arkiRelationshipFabric.ts`. La Fabric incluye un `RelationshipTypeRegistry` canónico, identidad semántica estable, identidad de revisión separada, validación de escalas y disciplinas, provenance, estado epistémico, inversas, deduplicación, serialización y restauración.

Se implementaron adapters en `shared/arkiRelationshipAdapters.ts` para convertir las relaciones existentes de `ConstructionModel.relations`, `tracesTo`, `ConstructionSpace.wallIds` y `ScheduleTask.elementIds` hacia la Fabric. Los owners existentes no fueron reemplazados: `ConstructionModel` continúa siendo el owner constructivo observado y `SceneModel` continúa siendo derivado.

## Criterios demostrados

| Criterio | Estado | Evidencia |
|---|---|---|
| sourceScale / targetScale / applicabilityScale | PASS | `scripts/test-bkh1-relationship-fabric.ts` |
| sourceDiscipline / targetDiscipline / relationshipDiscipline opcional | PASS | `scripts/test-bkh1-relationship-fabric.ts` |
| relationshipId estable entre versiones | PASS | prueba RF-T00B equivalente |
| relationshipRevisionId cambia por versión | PASS | prueba RF-T00B equivalente |
| RelationshipTypeRegistry | PASS | prueba de tipos registrados e inversas |
| tipo legacy no registrado | PASS | rechazo explícito |
| migración legacy determinista | PASS | comparación de dos migraciones |
| save / close / reopen | PASS | serialización JSON y restauración |
| duplicados | PASS | deduplicación por identidad semántica |
| inversas | PASS | SUPPORTS ↔ RESTS_ON |
| entidades inexistentes | PARCIAL | el adapter conserva IDs; no existe aún un registry global de entidades |
| ciclos | CONTRACT/PARTIAL | las políticas están registradas; no se implementó un grafo global de detección |
| FIX-BKH1-01 — inversas semánticas completas | PASS | escalas y disciplinas se intercambian en la prueba cross-scale/cross-discipline |
| FIX-BKH1-02 — historial de revisiones | PASS | V1 → add → V2 → save → reopen conserva dos revisiones |
| FIX-BKH1-03 — minimumEvidence | PASS | pruebas negativas para `reference`, `reproducible` y `human_review` |
| HumanDecision authority | FUERA DE ALCANCE | reservado a BKH-4 |
| Constraint / Regeneration / Transaction engines | FUERA DE ALCANCE | reservados a BKH-2/BKH-3/BKH-4 |

## Verificación

`pnpm check`: PASS.

`pnpm build`: PASS.

`pnpm tsx scripts/test-bkh1-relationship-fabric.ts`: PASS — 130 relaciones migradas; 14 tipos registrados; tres fixes correctivos PASS.

La regresión seleccionada de dominio, SceneModel, persistencia, comparación y E7 terminó con código de salida cero. El output crudo completo se conserva en `BKH1_IMPLEMENTATION_OUTPUTS.txt`.

## Separación de cambios

El baseline se congeló antes de modificar código. El worktree ya contenía cambios y archivos no rastreados de fases anteriores. El paquete distingue el baseline previo de los archivos agregados o modificados por BKH-1; no se atribuyen a BKH-1 los cambios preexistentes.

## Límites y deuda

La implementación actual no convierte automáticamente todos los consumidores de relaciones a lectura exclusiva de la Fabric. El adapter permite una migración gobernada, pero la eliminación física de cada campo legacy requiere gates posteriores y evidencia específica. Tampoco se implementa un registro global de entidades, detección universal de ciclos ni autoridad de decisiones humanas.

## Veredicto propuesto

`BKH-1 VERIFIED — BKH-1 SCOPE`.

La verificación confirma los tres fixes correctivos, la regresión pertinente y la preservación de los límites del alcance. BKH-2 permanece bloqueado hasta que se diseñe y apruebe su contrato independiente.

## Deuda independiente de tooling

Los outputs muestran el warning de pnpm sobre `pnpm.patchedDependencies` y `pnpm.overrides` en `package.json`. Se registra como deuda de tooling/configuración separada; no reabre ni invalida BKH-1.
