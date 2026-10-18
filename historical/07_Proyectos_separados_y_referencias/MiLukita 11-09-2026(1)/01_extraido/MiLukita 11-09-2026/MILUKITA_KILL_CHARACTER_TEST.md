# Kill Lukita / Character Failure Test

## Objetivo

Demostrar que Lukita es una capa de presentación y no autoridad del núcleo.

## Procedimiento local

1. Activar `LUKITA_DISABLED` desde el panel de revisión.
2. Confirmar que el evento, Scheduler, QR, resultados, verificación y MJP CORE permanecen fuera del panel y no reciben mutaciones.
3. Activar fallback `TWO_D`, `STATIC_CARD` o `TEXT_GRAPHIC_HOST`.
4. Registrar `LUKITA_KILL`, `FALLBACK_ACTIVATION` y `LUKITA_RESTORE` con evento, versión, razón y origen.

## Límite

La prueba local valida aislamiento lógico. No certifica disponibilidad productiva, hardware ni operación 24/7 real.
