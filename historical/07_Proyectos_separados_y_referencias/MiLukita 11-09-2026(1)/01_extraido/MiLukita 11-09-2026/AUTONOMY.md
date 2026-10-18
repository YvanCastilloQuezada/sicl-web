# Autonomy Engine

## Niveles

| Nivel | Conducta | Aprobación humana |
| --- | --- | --- |
| `MANUAL` | El operador ejecuta las acciones | Obligatoria |
| `ASSISTED` | El sistema propone y registra | Obligatoria |
| `SUPERVISED` | El sistema ejecuta acciones allowlisted y monitoriza | En acciones críticas o modo degradado |
| `AUTONOMOUS` | Orquesta, verifica y prepara continuidad | Sujeta a Kill Switch y políticas |
| `RESILIENT_AUTONOMOUS` | Además detecta fallos y entra en contingencia | Siempre reversible y auditable |

## Permitido

Abrir/cerrar eventos, activar experiencias, iniciar countdown, activar QR, publicar contenido no autoritativo, preparar el siguiente evento, detectar fallos, entrar en contingencia y registrar auditoría.

## Prohibido

Modificar resultados, reglas, premios, RTP, registros históricos, eliminar auditoría, activar dinero real, activar pagos o saltarse el Kill Switch. `shared/autonomyEngine.ts` expresa esta allowlist y el modo `STOPPED` bloquea la ejecución.

## Human Override

Las acciones de control deben registrar actor, timestamp, acción, motivo, estado anterior y estado nuevo mediante el Event Store. `server/autonomy.ts` ya conserva el modo global y registra cambios de control; Control Room expone observación y control protegido por rol administrativo.

## Estado de producción

El heartbeat actual es deliberadamente seguro: realiza health check y respeta `STOPPED`. La autonomía de negocio no se activa en producción, y todas las operaciones continúan siendo virtuales o simuladas hasta contar con staging, pruebas de recuperación y revisión independiente.
