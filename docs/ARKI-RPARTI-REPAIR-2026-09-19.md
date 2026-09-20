# ARKI — R-PARTI Repair Report

## Resultado

El checkpoint R-PARTI inicial reportó ocho bloqueos. Se analizaron individualmente contra los contratos existentes de ARKI. Siete fueron reparados mediante extensiones acotadas del Manual de Formas Arquitectónicas; uno permanece bloqueado porque aún requiere una fase geométrica controlada real.

| Bloqueo | Resultado | Reparación |
|---|---|---|
| RP-06 | PASS | `evaluatePartiHardConstraints` consume las validaciones S1 existentes y mantiene separados los UNKNOWN regulatorios. |
| RP-09 | PASS | `recordHumanAestheticReview` registra aceptación, rechazo o solicitud de evidencia sin convertir la opinión en score automático, ganador o aprendizaje. |
| RP-10 | PASS | `deriveGeometryBacktrack` crea un evento de backtrack desde geometría hacia familia de realizaciones, preservando evidencia y revisión humana. |
| RP-12 | PASS | `detectPartiFixation` aplica un umbral configurable a repeticiones del mismo parti sin cambios relacionales; solo alerta, no muta ni rechaza. |
| RP-16 | PASS | `validateRPartiRepresentationResolution` verifica identidad del modelo canónico, versión e IDs requeridos en las vistas. |
| RP-18 | PASS | `expandConstraintPreservingAlternatives` produce candidatos semánticos y conserva las hard constraints sin crear ganador automático. |
| RP-20 | BLOCKED legítimo | `summarizeRealizationFamily` distingue varios IDs de realización de geometrías realmente distintas y devuelve `REQUIRES_GEOMETRIC_MATERIALIZATION`. |

RP-13 no necesitaba un motor adicional: queda cubierto por la reparación de backtrack de RP-10 y conserva su estado PASS.

## Límites preservados

La reparación no crea un segundo motor geométrico, evaluador paralelo, sistema de memoria, sistema de aprendizaje ni decisión humana automática. La evaluación funcional no se presenta como cumplimiento normativo. La revisión estética humana no se transforma en una preferencia universal. Las alternativas siguen siendo candidatas y no ganadores.

## RP-20 y la razón de no falsificarlo

Una familia con `realizationIds` múltiples demuestra una capacidad de representación semántica, pero no demuestra que dos geometrías distintas hayan sido generadas desde el mismo parti. Marcar RP-20 como PASS sin producir y validar esas geometrías sería un falso éxito. La siguiente fase autorizable debe reutilizar el generador S1 y las operaciones S2 existentes, crear dos realizaciones con identidad de parti común, validarlas con hard constraints y comparar sus geometrías sin seleccionar automáticamente una ganadora.

## Pruebas

La suite focalizada actualizada contiene nueve pruebas PASS. `pnpm check` y `git diff --check` pasan. El conteo de la matriz R-PARTI queda en **19 PASS, 1 BLOCKED legítimo, 0 falsos PASS**.

## Estado epistemológico

`R-PARTI = PASS_WITH_OBSERVATIONS / REPAIRED v0.2.0`.

`CONSTRUCTION_DOCUMENTATION = NOT_CLAIMED`.

`AUTOMATIC_WINNER = NONE`.

`HUMAN_AUTHORITY = PRESERVED`.

`P9.4 = HOLD` y no se reabre por esta reparación.
