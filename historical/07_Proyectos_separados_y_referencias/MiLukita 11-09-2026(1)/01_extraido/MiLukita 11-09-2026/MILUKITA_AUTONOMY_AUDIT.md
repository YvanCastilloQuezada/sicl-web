# MiLukita — Auditoría de autonomía y Scheduler

**Orden 44 · Estado:** diagnóstico sin implementar soluciones.

## Clasificación de capacidades

| Capacidad | Clasificación | Evidencia |
|---|---|---|
| Proponer bloques de programación | ASISTIDO | `proposeSchedule` genera bloques y exige aprobación |
| Validar conflictos y precondiciones | ASISTIDO | `validateScheduleCandidates` bloquea faltantes y solapamientos |
| Aprobar programación | HUMANO OBLIGATORIO | `approveSchedule` exige actor humano |
| Publicar programación | HUMANO OBLIGATORIO | `publishSchedule` exige propuesta APPROVED y actor |
| Heartbeat de salud | ASISTIDO | `runSafeAutopilotHeartbeat` solo registra `health_check_only` |
| Watchdog de DB/modo/rondas | ASISTIDO | `runWatchdog` revisa salud y registra evento |
| Kill switch global | HUMANO OBLIGATORIO | `setControlMode` registra `HUMAN_OVERRIDE`; STOPPED bloquea autopilot |
| Abrir/cerrar/sortear/liquidar 24 h | NO DEMOSTRADO | No se encontró worker persistente que encadene el ciclo completo |
| Generar QR | ASISTIDO/CONDICIONAL | Procedimiento disponible solo con ronda abierta |
| Publicar resultado | PROHIBIDO AUTOMATIZAR FUERA DE MJP CORE | La autoridad pertenece a Core/Draw/Rule/Audit |
| Modificar RNG, RTP, reglas o wallet | PROHIBIDO AUTOMATIZAR | Guardrails documentales y separación de autoridad |

## Pregunta de 24 horas

**Respuesta basada en evidencia: no está demostrado que MiLukita funcione 24 horas sin intervención humana.** Existe un handler para invocación cron autenticada y un heartbeat seguro, pero no evidencia de un scheduler runtime persistente, cola de trabajos, reanudación tras caída, idempotencia del ciclo completo, observabilidad continua ni un proceso que garantice siguiente evento.

La arquitectura es **preparada/supervisada**, no autónoma certificada. No debe confundirse la existencia de tipos, funciones, fixtures y endpoints con una operación 24/7 probada.

## Conflictos detectables

El motor detecta parámetros inválidos, ventanas excedidas, solapamientos, ruleset no válido, RTP no validado, experiencia incompleta, contingencia ausente, contenido/TV/móvil no configurados y recursos faltantes. Sin embargo, el validador no compara expresamente la suma de `items[].durationMinutes` con `ProgramBlock.durationMinutes`; esto puede permitir una composición interna inconsistente.

El handler `scheduledGames.ts` rechaza solicitudes sin identidad cron (`403 cron-only`) y ejecuta `runScheduledGameCycle` cuando la solicitud sí está autenticada. No se observó en este alcance un registro que demuestre la configuración externa de un job recurrente de 24 horas.

## Kill switch y Lukita

El kill switch operativo detiene automatización general con estado `STOPPED`; no existe un kill switch específico de Lukita. La independencia conceptual está documentada: Lukita consume MjpTvManifest y no decide resultados. Falta una prueba runtime que quite la presentación del personaje y demuestre continuidad de TV, QR, celular, cierre, resultado, verificación y siguiente evento.

## Hallazgos

| ID | Prioridad | Problema → evidencia → impacto → solución futura → dependencia → prioridad |
|---|---|---|---|---|---|
| AUTO-01 | P1 | No hay autonomía 24 h demostrada → heartbeat solo `health_check_only` y cron handler aislado → no se puede prometer continuidad → diseñar worker/cola supervisada con idempotencia y observabilidad → infraestructura + operación → alta |
| AUTO-02 | P1 | KILL LUKITA runtime no certificado → kill switch es global, no específico del host → riesgo de dependencia accidental → prueba de apagado aislado → TV Client + QA → alta |
| AUTO-03 | P1 | `nextEvent` no está conectado al builder normal → siempre false → no hay continuidad automática visible → fuente programada validada → Scheduler + manifest → alta |
| AUTO-04 | P2 | Duración interna de bloques no validada completamente → suma de ítems puede exceder bloque → conflictos de emisión → validación de duración y transición → Scheduler → media |
| AUTO-05 | P2 | Configuración cron 24 h no demostrada → handler exige cron pero no prueba job externo → operación depende de configuración no auditada → evidencia de despliegue y prueba de reanudación → plataforma → media |

## Conclusión

La autonomía real está en estado **NO CERTIFICADO — LIMITACIÓN DE EVIDENCIA OPERATIVA**. Los límites humanos y el kill switch son buenas bases de gobernanza; falta probar la operación continua y el circuito completo de eventos antes de calificar el sistema como máquina autónoma de entretenimiento.

## Actualización posterior — worker supervisado

Se implementó `server/supervisedWorker.ts` y la ruta cron existente `/api/scheduled/game-rounds` ahora ejecuta el ciclo a través del worker supervisado. El worker consulta el kill switch global, reutiliza `runScheduledGameCycle`, registra `SCHEDULER_WORKER_CLAIMED`, `SCHEDULER_WORKER_ERROR` y `SCHEDULER_WORKER_COMPLETED`, y usa una clave única por `taskUid` y cubeta UTC de un minuto. Una segunda invocación de la misma tarea en la misma cubeta se clasifica como `duplicate_claim` y no vuelve a ejecutar el ciclo.

Esto mejora la seguridad operacional y permite probar reintentos, duplicados y bloqueo; **no constituye todavía certificación de autonomía física 24/7**. Siguen pendientes la evidencia de despliegue real del cron, persistencia fuera del proceso, reinicio tras caída, monitoreo externo, prueba de 24 horas y ejecución con hardware/entorno productivo. El worker no puede modificar resultados, RNG, RTP, reglas o liquidación fuera de las funciones autorizadas del core.

**Estado actualizado:** worker supervisado implementado; autonomía continua de 24 horas permanece NO CERTIFICADA.

## Actualización posterior — simulación de 24 horas

Se añadió `scripts/simulate-autonomy-24h.mjs` y el comando `pnpm simulate:autonomy24`. La ejecución determinista cubre una ventana de 24 horas en intervalos de un minuto: **1.440 ticks, 2.880 intentos totales, 1.440 claims únicos y 1.440 duplicados esperados**. Las claves permanecen estables por tarea y bucket; resultado de la simulación: **PASS**.

El reporte queda en `reports/autonomy-24h-simulation.json`. La simulación verifica la política de bucket e idempotencia del worker, pero no ejecuta cron, base de datos, proveedor de tareas, carga real, latencia, disponibilidad 24/7 ni recuperación de infraestructura. Por tanto, no equivale a una certificación de autonomía física de 24 horas.

El Control Room incorpora exportación administrativa del informe en **CSV y PDF**. El CSV contiene el resumen y todas las muestras deterministas; el PDF contiene el resumen, una muestra acotada y las limitaciones. Cada exportación devuelve nombre, MIME, tamaño y SHA-256 para facilitar la trazabilidad. La descarga no convierte la simulación en certificación operativa.
