# BKH-2 — Boundary Matrix

| Pregunta | Owner | BKH-2 puede | BKH-2 no puede |
|---|---|---|---|
| ¿Qué está relacionado con qué? | BKH-1 Relationship Fabric | Referenciar `relationshipId` y usar propiedades relacionales | Crear una Relationship Fabric paralela |
| ¿Qué condiciones deben cumplirse? | BKH-2 Constraint Engine | Declarar y evaluar predicates | Mutar el modelo para cumplirlos |
| ¿Qué debe regenerarse después? | BKH-3 Regeneration Engine | Emitir diagnóstico de dependencia si el contrato lo permite | Regenerar geometría o recalcular downstream |
| ¿Cómo se aplica o revierte un cambio? | BKH-4 Transaction Engine | Entregar resultados de evaluación | Commit, rollback, undo, redo o aprobación |
| ¿Quién decide entre restricciones incompatibles? | HumanDecision / BKH-4 | Reportar conflicto y evidencia | Resolver automáticamente |
| ¿Quién posee geometría? | Owner geométrico canónico futuro | Leer referencias | Crear o sustituir geometría |
| ¿Quién posee cantidades y costos? | Sus owners respectivos | Evaluar reglas que los referencien | Recalcular cantidades o precios |
| ¿Quién posee la representación de escena? | SceneModel derivado | Usar IDs y parámetros observables | Convertir el SceneModel en owner semántico |

## Regla central

Una relación afirma un vínculo. Una restricción evalúa una condición sobre un contexto. BKH-2 no debe convertir una relación en restricción automáticamente sin una regla explícita registrada.

## Estado

Esta matriz es contractual. No constituye implementación.
