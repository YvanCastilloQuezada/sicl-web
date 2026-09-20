# ARKI — R-PARTI Repair Report

## Resultado

El checkpoint R-PARTI inicial reportó ocho bloqueos. Se analizaron individualmente contra los contratos existentes de ARKI. Los ocho fueron resueltos: siete mediante extensiones acotadas del Manual de Formas Arquitectónicas y RP-20 mediante una fase geométrica controlada posterior.

| Bloqueo | Resultado | Reparación |
|---|---|---|
| RP-06 | PASS | `evaluatePartiHardConstraints` consume las validaciones S1 existentes y mantiene separados los UNKNOWN regulatorios. |
| RP-09 | PASS | `recordHumanAestheticReview` registra aceptación, rechazo o solicitud de evidencia sin convertir la opinión en score automático, ganador o aprendizaje. |
| RP-10 | PASS | `deriveGeometryBacktrack` crea un evento de backtrack desde geometría hacia familia de realizaciones, preservando evidencia y revisión humana. |
| RP-12 | PASS | `detectPartiFixation` aplica un umbral configurable a repeticiones del mismo parti sin cambios relacionales; solo alerta, no muta ni rechaza. |
| RP-16 | PASS | `validateRPartiRepresentationResolution` verifica identidad del modelo canónico, versión e IDs requeridos en las vistas. |
| RP-18 | PASS | `expandConstraintPreservingAlternatives` produce candidatos semánticos y conserva las hard constraints sin crear ganador automático. |
| RP-20 | PASS_WITH_OBSERVATIONS | Se materializan dos geometrías distintas del mismo parti mediante el adaptador geométrico existente; los UNKNOWN regulatorios y de accesibilidad se preservan. |

RP-13 no necesitaba un motor adicional: queda cubierto por la reparación de backtrack de RP-10 y conserva su estado PASS.

## Límites preservados

La reparación no crea un segundo motor geométrico, evaluador paralelo, sistema de memoria, sistema de aprendizaje ni decisión humana automática. La evaluación funcional no se presenta como cumplimiento normativo. La revisión estética humana no se transforma en una preferencia universal. Las alternativas siguen siendo candidatas y no ganadores.

## RP-20: materialización controlada

La fase `arkiRPartiGeometricMaterialization.ts` reutiliza las dos variantes geométricas conceptuales existentes de Project B. Las dos realizaciones comparten `partiId`, pero tienen `geometrySignature`, `projectId`, `sourcePlanId` y lineage de realización distintos. Contención, no superposición, conexión de puertas y ruta pública pasan. Accesibilidad, capacidad y regulación permanecen `UNKNOWN`. No se selecciona una ganadora.

## Pruebas

La suite focalizada actualizada contiene once pruebas PASS. `pnpm check` y `git diff --check` pasan. El conteo de la matriz R-PARTI queda en **20 PASS, 0 BLOCKED, 0 falsos PASS**.

## Estado epistemológico

`R-PARTI = PASS_WITH_OBSERVATIONS / RP-20 CLOSED v0.3.0`.

`CONSTRUCTION_DOCUMENTATION = NOT_CLAIMED`.

`AUTOMATIC_WINNER = NONE`.

`HUMAN_AUTHORITY = PRESERVED`.

`P9.4 = HOLD` y no se reabre por esta reparación.
