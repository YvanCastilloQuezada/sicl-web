# Control Room

La ruta `/control-room` es un centro operativo protegido por rol administrativo. Presenta el evento actual, experiencia, estado, cuenta regresiva, salud de TV, móvil, QR, Event Store, Scheduler, autonomía y Watchdog, además de un log de eventos operativos reciente.

Cada semáforo muestra texto junto con el color: `HEALTHY`, `WARNING`, `CRITICAL` o `NOT MEASURED`. La ausencia de datos no se convierte en un estado saludable ficticio.

El panel puede abrir TV y overlay, actualizar datos y observar el modo operativo. El cambio de modo sigue siendo una acción auditada y respeta `STOPPED`. El panel no modifica resultados, reglas, premios, RTP ni históricos.

La prueba E2E administrativa dedicada y la validación con múltiples operadores siguen pendientes de staging. El Control Room del piloto no es un NOC de producción.


## Espacio conceptual de Legal & Compliance

El Control Room reconoce una tarjeta de solo lectura para **Legal & Compliance Intelligence Agent**. La tarjeta debe mostrar `PLANNED`, `NOT_STARTED`, `ADVISORY_ONLY`, `AUTONOMY 0`, `EXECUTION DISABLED`, `RISK ENGINE NOT ACTIVE`, `REGULATORY MONITORING NOT ACTIVE`, `CONTRACT INTELLIGENCE NOT ACTIVE`, `CLAIM GUARD NOT ACTIVE` y `MJP CORE ACCESS NONE`.

Esta tarjeta es observabilidad constitucional, no un dashboard legal operativo. No consulta legislación, no califica casos reales, no emite claims, no autoriza actividades reguladas y no habilita acciones sobre contratos, licencias, pagos, distribución o MJP CORE. La futura activación requiere una orden independiente, fuentes vigentes, revisión profesional y aprobación humana trazable.

## Addendum — Observability OS

El Control Room incorpora un resumen visual de observabilidad basado en `shared/observabilityContract.ts`. Este resumen distingue `NO_DATA`, `INSPECT`, `BOUNDED` y `PROTECTED`, aplica overrides críticos y no presenta un estado verde cuando faltan datos. La vista es informativa y de control humano; no concede autoridad a agentes ni modifica MJP CORE.

Las capacidades de pipeline persistente, KPI histórico, Incident Center, deduplicación productiva, retención configurable y notificaciones externas permanecen `PENDING` o `EXTERNAL_REQUIRED`. El estado real y los criterios de salida se detallan en `docs/MILUKITA_AGENT_OBSERVABILITY.md`.
