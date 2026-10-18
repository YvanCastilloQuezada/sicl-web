# Orden Maestra MILUKITA LIVE-24 — Informe de implementación y auditoría

**Proyecto:** MiLukita / ruleta-peru-online  
**Checkpoint base:** `manus-webdev://6c0a1244`  
**Estado del piloto:** créditos virtuales, sin dinero real, sin retiros y sin convertibilidad.

## 1. Resumen ejecutivo

La Orden Maestra se implementó como una capa de endurecimiento controlado sobre los módulos existentes. MiLukita LIVE conserva a MJP CORE como única autoridad para eventos, rondas, reglas, resultados, wallet y liquidación. El TV Client recibe proyecciones de presentación; no puede establecer por sí mismo `eventId`, resultados ni premios.

La ejecución local demuestra transición determinista, QR asociado al evento, deduplicación por identificadores y simulación de continuidad durante 24 horas virtuales. **No se declara autonomía productiva 24/7:** el callback está preparado para Heartbeat desplegable, pero la certificación real requiere activar una tarea persistente, ejecutar multiinstancia y probar hardware físico.

## 2. Estado por fase

| Fase | Estado | Evidencia | Límite restante |
|---|---|---|---|
| E2E de cambio de evento | IMPLEMENTADO / PROBADO | `shared/live24.ts`, `shared/live24.test.ts` | Falta navegador E2E con dos instancias reales |
| Locking e idempotencia | PARCIALMENTE IMPLEMENTADO | claim persistente mediante `operationalEvents.idempotencyKey`; `supervisedWorker.ts` | Falta lock explícito de transición de sesión multiinstancia |
| Heartbeat | PREPARADO / INTEGRADO | `/api/scheduled/milukita-live`, `runLiveHeartbeat` | Falta crear/activar la tarea en el servicio desplegado |
| Watchdog | IMPLEMENTADO EN MODO ALERTA | `runLiveWatchdog`, `runWatchdog` | Falta persistencia específica de métricas y umbrales LIVE completos |
| Recovery | IMPLEMENTADO COMO RECOVERY CONTROLADO | eventos `LIVE_HEARTBEAT_RECOVERY_REQUIRED` y reintento mediante worker | Falta prueba física de reinicio, red y proveedor |
| Multiinstancia | NO VERIFICADO | diseño de claim idempotente | Requiere dos procesos conectados a la misma base de datos |
| QA Smart TV | NO VERIFICADO FÍSICAMENTE | guía/documentación y revisión de navegador | Requiere Samsung Tizen, LG webOS y Android/Google TV reales |
| LIVE-24 | PROBADO COMO SIMULACIÓN | `simulateLive24`, reporte determinista | No equivale a 24 horas de operación real |
| Auditor Agent | IMPLEMENTADO COMO SOLO LECTURA PARA RONDAS | `server/auditorAgent.ts` | Falta auditor de ciclo LIVE-24 completo |

## 3. Flujo protegido

El flujo diseñado es `CHECK → LOCK/CLAIM → EXECUTE → PERSIST → RELEASE → AUDIT`. El claim usa una clave determinista por ventana de ejecución y se registra en Event Store. Un callback repetido se transforma en operación idempotente o se omite; no debe producir una segunda recompensa, transición o evento silencioso.

El callback HTTP `POST /api/scheduled/milukita-live` exige una solicitud cron autenticada por el SDK y rechaza solicitudes que no sean de cron. En modo `STOPPED`, el Heartbeat registra el bloqueo y no ejecuta el ciclo. Los errores se registran como recovery requerido y se devuelven como estado degradado, sin corregir resultados ni modificar RNG, RTP o settlement.

## 4. Evidencia de pruebas

La suite completa ejecutada en esta iteración reportó **58 archivos aprobados, 1 omitido; 184 pruebas aprobadas, 4 omitidas**. Las pruebas focalizadas de `shared/live24.test.ts`, `shared/liveChannel.test.ts`, `server/supervisedWorker.test.ts` y `server/autonomy.test.ts` pasaron. `pnpm check` y `pnpm build` pasaron.

La simulación determinista usa 1.440 ticks de minuto, cuenta eventos programados, ejecutados, completados, recuperaciones, transiciones, QR READY, duplicados, inconsistencias, errores críticos y downtime virtual. El informe incluye `mode: SIMULATION` para impedir que se confunda con disponibilidad productiva.

## 5. Seguridad y gobernanza

No se implementó dinero real, Yape, retiros, convertibilidad, KYC/AML operativo ni monetización. Lukita se mantiene como componente de presentación. El Watchdog solo observa, alerta y solicita recovery; no puede modificar RNG, RTP, reglas, resultados, wallet ni settlement. El Auditor Agent solo lee evidencia, compara y reporta.

## 6. Pendientes P0/P1

El riesgo **P1** principal es la diferencia entre idempotencia persistente de callbacks y locking distribuido completo de estado de sesión. Antes de Autoscale multiinstancia debe añadirse una versión persistente de transición o un lock transaccional inequívoco.

El segundo riesgo **P1** es activar Heartbeat real sin una política de pausa, Kill Switch, observabilidad y retención de evidencias. El tercer riesgo **P1** es declarar QA Smart TV sin dispositivos físicos; por ello la matriz se mantiene como **NO VERIFICADO**.

## 7. Próximo orden recomendado

Primero, crear la tarea Heartbeat en staging con frecuencia mínima de un minuto y ejecutar el callback durante una ventana controlada. Segundo, conectar dos procesos a la misma base de datos y probar el mismo heartbeat, evento y `actionId` simultáneamente. Tercero, añadir el auditor de ciclo LIVE y ejecutar la matriz física. Solo después debe considerarse una prueba operativa de 24 horas reales.

> **Conclusión:** la arquitectura está preparada para endurecimiento y validación, pero el estado correcto sigue siendo **preproducción validada localmente**, no autonomía productiva certificada.


## 8. Resiliencia visual de la TV

La TV ahora consulta `broadcast.liveHeartbeatHealth` cada 15 segundos y muestra un indicador discreto con estados `CONNECTED`, `DISCONNECTED`, `STOPPED` o `LOADING`. El estado `DISCONNECTED` se determina cuando no existe un heartbeat completado reciente o cuando supera el umbral de 90 segundos; no representa por sí mismo una caída del servidor de juegos.

Cuando el backend confirma `STOPPED` o `controlMode: STOPPED`, `BroadcastPage` reemplaza la experiencia de emisión por `TvMaintenanceScreen`. La pantalla informa que la pausa es una medida de seguridad, evita presentar una transición como disponible y ofrece reintento de lectura. Esta vista no modifica resultados ni activa operaciones; el Kill Switch conserva prioridad.

La transición visual y el aviso de cambio de evento permanecen en el flujo LIVE existente. La validación realizada fue de código, `pnpm check`, pruebas focalizadas, `pnpm build` y revisión visual en navegador. La activación real de Heartbeat, una prueba con dos procesos y el QA sobre Samsung Tizen, LG webOS y Android/Google TV siguen clasificados como pendientes o no verificados físicamente.


## 9. Evidencia de ejecución LIVE-24

La ejecución solicitada se realizó con el script disponible `pnpm simulate:live` (el alias `pnpm simulate:live24` no existe en el `package.json` y fue descartado sin modificar la lógica). Resultado de la simulación determinista: ventana de 24 horas, 15 eventos programados, 15 completados, 0 omitidos, 3 recuperaciones simuladas exitosas, 0 errores críticos, 15 eventos con jugadores y uptime simulado de 100 %. Estado: `PASS` dentro del alcance local.

Esta evidencia no equivale a una operación autónoma productiva. El propio informe conserva como limitaciones la ausencia de cron desplegado, red pública, navegador físico, múltiples instancias y un Watchdog persistente ejecutándose durante 24 horas reales.


## 10. Refinamiento de comunicación en mantenimiento

La pantalla de mantenimiento ahora incluye la instrucción visible **“Escanea el QR para consultar el estado”**, explicación de uso con la cámara del teléfono y la aclaración de que el código no permite modificar rondas, resultados ni controles operativos. El contenedor del QR utiliza un pulso visual continuo únicamente cuando el navegador permite movimiento; `prefers-reduced-motion` desactiva la animación.

Cuando el Heartbeat reaparece como `DISCONNECTED`, el indicador añade la explicación **“conexión inestable · revisión automática”**. Cuando cambia a `CONNECTED` después de un estado degradado, BroadcastPage muestra una bienvenida visual, reproduce el tono suave permitido por la preferencia de audio y muestra el título del evento actual confirmado, o “en sincronización” si todavía no existe manifest.

La prueba visual verificó la ruta móvil `/estado-sistema` y el panel TV en navegador. El estado inicial observado fue “Sin confirmación reciente”, coherente con que no se ha activado un Heartbeat productivo en staging. No se afirmó un estado `CONNECTED` ni una recuperación real sin evidencia del backend.


## 11. Reconexión progresiva y contexto de recuperación

El indicador de Heartbeat ahora distingue tres situaciones antes de ocultarse: `LOADING` muestra “Comprobando Heartbeat”; una consulta en curso sobre un estado degradado muestra “Reconectando…” con spinner; y, si la recuperación no ocurre, se muestra “Heartbeat desconectado” junto con “conexión inestable · revisión automática”. Cuando la consulta vuelve a `CONNECTED` después de un estado degradado, la TV presenta una transición de bienvenida que identifica el evento actual confirmado y describe brevemente su contenido.

La ETA de mantenimiento continúa condicionada a datos explícitos del backend. Si el estado operativo proporciona un tiempo estimado, la interfaz deberá mostrarlo; cuando no existe ese dato, no se inventa una duración y se conserva el mensaje de revalidación automática. En esta versión el endpoint público de salud no proporciona ETA, por lo que la pantalla informa correctamente que el tiempo no está disponible.


## 12. Transparencia pública de agentes y preview de Lukita

Se añadió `broadcast.agentHealth` como proyección pública de solo lectura. Esta proyección informa el estado resumido del **Watchdog** en modo `ALERT_ONLY` y del **Auditor Agent** en modo `READ_ONLY`; no expone procedimientos administrativos ni permite ejecutar acciones desde la TV.

La pantalla TV incorpora `TvAgentsStatus`. Cuando está en mantenimiento, `TvMaintenanceScreen` muestra hasta cinco alertas específicas disponibles del último reporte persistido del Watchdog. Si no existe detalle persistido, se informa de forma explícita que no hay alertas detalladas disponibles.

El Script Lab de Lukita incorpora una transición visual suave al activar una previsualización. Esta función continúa siendo de preproducción: `LukitaVoiceEngine` conserva `testOnly: true` y `productionEnabled: false`. No se genera audio real, no se activa TTS productivo y no se inicia lip-sync definitivo.

La proyección de agentes y las alertas deben verificarse adicionalmente en staging. La vista `/tv` mostró el estado público en navegador; la validación en hardware físico, bajo degradación real y durante una operación LIVE-24 productiva continúa pendiente.


## 13. Observabilidad de agentes y QA

La pantalla de mantenimiento muestra las últimas alertas disponibles del Watchdog, con estado, clave, mensaje y hora observada. El historial se conserva localmente en el navegador hasta ocho entradas y no reemplaza un Event Store central. La TV permite mostrar u ocultar los indicadores públicos de Watchdog y Auditor Agent mediante una preferencia local. Una alerta nueva activa un tono sutil mediante el mismo mecanismo de audio del mando, respetando el silencio persistente.

La suite unitaria completa pasó con 59 archivos aprobados, 1 omitido, 189 pruebas aprobadas y 4 omitidas. La suite HTTP/TV E2E se ejecutó: la API pasó; cuatro pruebas de `server/tvOverlay.e2e.test.ts` fallaron por selector inicial no visible y por una respuesta HTTP 429 durante la consulta pública. Se documenta como brecha del harness/E2E y no se desactiva el rate limit.

La prueba de dos instancias con base compartida, la activación persistente de Heartbeat/Watchdog en staging y la certificación física en Samsung Tizen, LG webOS, Android/Google TV, iOS y Android no fueron ejecutadas en este entorno. Permanecen clasificadas como `NO VERIFICADO` o `NO VERIFICABLE` hasta disponer de infraestructura, credenciales de staging y dispositivos reales.
