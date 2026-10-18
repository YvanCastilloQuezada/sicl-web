# BKH-1 — Test Plan

Este documento define pruebas futuras. No implementa ninguna prueba ni modifica el producto.

## Identidad y validez

| ID | Caso | Criterio |
|---|---|---|
| RF-T01 | Misma relación insertada dos veces | Se obtiene un único registro o rechazo explícito. |
| RF-T02 | Relaciones con source/target intercambiados | La dirección y el ID se mantienen correctamente. |
| RF-T03 | Relación inversa | La consulta inversa devuelve el vínculo sin crear una segunda verdad. |
| RF-T04 | Entidad inexistente | La inserción es rechazada con error trazable. |
| RF-T05 | Tipo inválido para familia | La inserción es rechazada. |
| RF-T06 | Ciclo no permitido | Se rechaza o se marca según regla del tipo; nunca se oculta. |
| RF-T07 | Duplicado legacy y canónico | El adapter produce una única relación con provenance completa. |

## Disciplina, escala y epistemología

| ID | Caso | Criterio |
|---|---|---|
| RF-T08 | Relación cross-discipline | Conserva disciplina origen y destino o una disciplina compuesta explícita. |
| RF-T09 | Relación cross-scale | Conserva escala y aplicabilidad; no extrapola reglas. |
| RF-T10 | Relación causal sin evidencia | Se rechaza como causal o queda `UNKNOWN/DERIVED`. |
| RF-T11 | Estado `VERIFIED` sin evidencia | Se rechaza. |
| RF-T12 | Provenance incompleta | Se rechaza para relación canónica. |

## Persistencia y compatibilidad

| ID | Caso | Criterio |
|---|---|---|
| RF-T13 | Save/close/reopen | La relación mantiene identidad y provenance. |
| RF-T14 | Migración `ElementRelation` | No se pierden campos ni se duplican relaciones. |
| RF-T15 | Migración `wallIds` | La lista legacy se deriva de Fabric y no muta la fuente sin autorización. |
| RF-T16 | Adaptación `relatedIds` SceneModel | La representación se reconstruye desde Fabric. |
| RF-T17 | Versión de proyecto distinta | Se conservan validez temporal y projectVersion. |
| RF-T18 | Datos corruptos | Se produce error explícito y no se guarda parcialmente. |

## No modificación colateral

| ID | Caso | Criterio |
|---|---|---|
| RF-T19 | Añadir relación entre A y B | Entidades no relacionadas permanecen byte-equivalentes o con diff justificado. |
| RF-T20 | Eliminar relación | No elimina entidades ni otras relaciones. |
| RF-T21 | Importar IFC | Las relaciones importadas conservan GlobalId y loss report. |
| RF-T22 | Clash derivado | No sustituye relaciones semánticas. |

## Pruebas negativas obligatorias

Deben cubrir source inexistente, target inexistente, tipo desconocido, familia incompatible, direction inválida, escala inválida, provenance vacía, versión inexistente, ciclos prohibidos, duplicados, causalidad inferida sin evidencia y migraciones no idempotentes.

La implementación no podrá declararse verificada si sólo pasa pruebas positivas.
