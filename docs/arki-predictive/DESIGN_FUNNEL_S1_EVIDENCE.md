# ARKI Design Funnel S1 · Evidencia de ejecución

## Resultado

La implementación local de S1 está en estado **DESIGN_FUNNEL_PARTIAL**: el contrato, la UI y las transiciones humanas funcionan; la persistencia productiva en CDE/Project State y la conexión real a CCF/autopilot quedan como integración posterior.

## Ruta verificada

`/arki-design-funnel` en preview de producción local: `https://4000-ioq0m1fmtd5iqzzxqbot1-a8ffe840.us1.manus.computer/arki-design-funnel`.

La página mostró 16 alternativas en cuadrícula 4×4, selector de modos Vista/Planta/3D/Corte/Programa/Costo/Técnico, panel de decisión humana, contador 0/4, historial y estado `AWAITING_16_TO_4_SELECTION`.

## Transiciones observadas

1. Se seleccionaron manualmente A01, A02, A03 y A04.
2. La UI pasó a `FINALIST_4`, mostró `Final Four: 4`, `Archivadas: 12` y registró `HUMAN_DESIGN_SELECTION` y `DEEP_EVALUATION_STARTED`.
3. Se ejecutó la evaluación profunda determinista local y la UI pasó a `AWAITING_4_TO_1_SELECTION`, registrando `DEEP_EVALUATION_COMPLETED`.
4. Se eligió manualmente A01 y la UI pasó a `SELECTED_FOR_DEVELOPMENT`, preservando el historial.
5. Se pulsó “Volver al Final Four” y la UI restauró los cuatro finalistas, registrando `RETURN_TO_FINAL_FOUR`.
6. Consola del navegador: **sin errores** durante la verificación visual.

Captura final: `outputs/arki-predictive/design-funnel-final-four.webp`.

## Validación automatizada

| Control | Resultado |
|---|---:|
| TypeScript (`pnpm check`) | PASS |
| Conflictos en `client/src`, `server`, `shared` | PASS |
| `git diff --check` | PASS |
| Pruebas específicas Design Funnel | 8/8 PASS |
| Suite completa | 94 archivos / 413 pruebas PASS |
| Build producción | PASS |
| Chunk de ruta independiente | PASS (`ArkiDesignFunnelPage` generado) |
| Consola visual | PASS, sin salida de error |

## Gates conservados

No existe ganador automático. No se eliminan candidatos. No se promueve una selección sin actor humano. No se permite selección cruzada entre proyectos. No se permite seleccionar 1 antes de completar la evaluación de 4. No se inventan solvers; el contrato permite `BLOCKED` y `UNKNOWN`.

## Pendiente explícito

La UI actual mantiene el estado en memoria de sesión para la demostración local. Falta conectar eventos a persistencia durable de Project State/CDE, integrar CCF/autopilot y conectar solvers reales de estructura, MEP, energía, costos y normativa por país. Hasta entonces, la página es una herramienta de exploración y decisión gobernada, no un expediente técnico definitivo ni una firma profesional.
