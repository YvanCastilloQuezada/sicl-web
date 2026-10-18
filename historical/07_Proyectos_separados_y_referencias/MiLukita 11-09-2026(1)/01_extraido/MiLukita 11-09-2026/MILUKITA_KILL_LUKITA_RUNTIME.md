# KILL LUKITA — Informe runtime de continuidad

**Identificador:** `KILL-LUKITA-RUNTIME-01`  
**Fecha:** 26 de agosto de 2026  
**Alcance:** simulación controlada y contrato de degradación; no es apagado de un proceso de producción

## Objetivo

Demostrar que Lukita es una capa de identidad, presentación y acompañamiento, no una autoridad sobre el juego. Cuando Lukita se encuentra fuera de servicio, la cadena autoritativa debe continuar con presentación degradada.

## Resultado

La prueba auxiliar `AGENT_RUNTIME_AUTONOMY_TEST` marca el escenario como aprobado en la simulación. Se conserva el estado de TV, QR, celular, evento, cierre, resultado, verificación y siguiente evento. Se degradan la presentación adaptativa, el guion de Lukita y la celebración audiovisual.

| Área | Resultado con Lukita OFF |
|---|---|
| Estado autoritativo | Continúa |
| TV | Continúa con fallback |
| QR | Continúa si el manifest está disponible; si no, usa contingencia |
| Celular | Continúa según estado de sesión |
| Interacción | Continúa bajo validación del servidor |
| Cierre | Continúa |
| Resultado | Continúa sin alteración |
| Verificación | Continúa |
| Siguiente evento | Continúa si la programación es válida |
| Narración y celebración | Degradadas o ausentes |

## Datos que permanecen intactos

No se modifica RNG, RTP, reglas, resultados, wallet, ledger, liquidación, Event Store autoritativo, MjpTvManifest ni permisos de agentes. La prueba no concede autoridad adicional a Lukita ni al cliente.

## Limitación

La evidencia actual es determinista y controlada. No representa un apagado físico de un proceso de avatar 3D, TTS o proveedor externo en producción. La certificación runtime requiere un entorno de QA con servicios separados, trazas y procedimiento de reversión.

## Flujo obligatorio ante fallo

**DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR.**
