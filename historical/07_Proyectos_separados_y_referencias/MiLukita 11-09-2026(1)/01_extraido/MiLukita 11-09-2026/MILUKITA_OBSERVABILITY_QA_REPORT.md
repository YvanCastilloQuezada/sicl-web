# MiLukita — Informe de observabilidad y QA

**Fecha:** 27 de agosto de 2026  
**Estado:** preproducción validada localmente; sin publicación ni dinero real.

## Resumen

Se implementó una capa pública e informativa para la TV que muestra el estado resumido del Watchdog y del Auditor Agent. La vista de mantenimiento conserva las últimas alertas disponibles del Watchdog en almacenamiento local del navegador, permite ocultar o mostrar los indicadores de agentes y reproduce un tono sutil cuando aparece una alerta nueva, siempre sujeto a la preferencia de silencio del mando.

El Watchdog continúa en modo `ALERT_ONLY` y el Auditor Agent en `READ_ONLY`. Ninguno puede modificar rondas, resultados, RNG, RTP, reglas, wallet, créditos ni liquidación.

## Estado de entregables

| Entregable | Estado | Evidencia | Límite |
|---|---|---|---|
| Historial visual de alertas en mantenimiento | IMPLEMENTADO | `TvMaintenanceScreen.tsx`, estado `watchdogAlertHistory` en `BroadcastPage.tsx` | Historial local del navegador, no almacén central de auditoría |
| Mostrar/ocultar agentes en TV | IMPLEMENTADO | Preferencia `milukita-tv-agent-indicators` | No sustituye una política de visibilidad operativa central |
| Sonido ante alerta nueva | IMPLEMENTADO | `playTvRemoteTone("select")` con mute persistente | Los navegadores pueden requerir una interacción previa para audio |
| Dos instancias con base compartida | NO VERIFICADO | Diseño de claims idempotentes existente | Requiere dos procesos y entorno compartido real |
| Heartbeat/Watchdog en staging | PREPARADO, NO ACTIVADO | Callback y runtime existentes | Faltan tarea persistente, secretos/configuración y observabilidad de staging |
| Kill Switch supervisado | IMPLEMENTADO EN DISEÑO | `STOPPED`/`KILL SWITCH` bloquea el ciclo | Falta prueba operativa de staging |
| QA Samsung Tizen/LG webOS/Android TV/iOS/Android | NO VERIFICABLE EN ESTA SESIÓN | Revisión de navegador y documentación | Requiere dispositivos físicos y red real |

## Pruebas ejecutadas

`pnpm check` pasó. La suite unitaria completa pasó con **59 archivos aprobados, 1 omitido; 189 pruebas aprobadas y 4 omitidas**.

Las pruebas focalizadas `server/broadcast.test.ts`, `shared/entertainmentOsModules.test.ts` y `shared/live24.test.ts` pasaron: **14 pruebas aprobadas**.

La suite `pnpm test:e2e` se ejecutó con navegador. La API E2E pasó, pero `server/tvOverlay.e2e.test.ts` falló en cuatro casos: el selector de modo/tema no fue visible en el estado inicial del navegador de prueba y una consulta pública recibió HTTP **429** por límite de solicitudes. Estos fallos deben tratarse como una brecha reproducible del harness/E2E, no como evidencia de compatibilidad física ni como motivo para retirar el rate limit sin análisis.

## Recomendación de corrección

Primero, hacer que el harness cierre explícitamente todos los modales y espere a que la pantalla inicial esté lista antes de consultar selectores. Segundo, aislar el rate limit de las pruebas mediante una política de entorno de test o una ventana de backoff, sin desactivar la protección en producción. Tercero, ejecutar dos procesos contra una base compartida y verificar que un mismo `idempotencyKey` produce un único claim.

## QA físico requerido

La certificación física debe ejecutarse con una matriz que registre modelo, sistema operativo, navegador/WebView, resolución, distancia de lectura, navegación del mando, audio, QR, mantenimiento, recuperación y captura de evidencia. Hasta completar esa matriz, todos los dispositivos permanecen en estado **NO VERIFICADO**.

## Conclusión

La observabilidad de TV y el comportamiento seguro de mantenimiento están implementados y cubiertos por validación local. La operación multiinstancia, staging persistente y QA físico continúan pendientes y no deben presentarse como certificados.


## Addendum — verificación reproducible posterior

El harness `server/scheduler/dualInstanceSimulation.ts` ejecutó dos instancias lógicas en concurrencia contra un almacenamiento compartido atómico. La prueba `server/scheduler/dualInstanceSimulation.test.ts` pasó con 1 claim adquirido, 1 claim almacenado y una única clave de idempotencia. Confirma el contrato lógico, pero no certifica aún dos procesos desplegados contra MySQL/TiDB compartido.

Se ejecutó QA automatizado de `/tv` y `/estado-sistema` en viewport móvil de 390×844. Ambas rutas renderizaron correctamente y mostraron el flujo de selección TV y el estado informativo. La compatibilidad de dispositivos físicos permanece no verificable desde el sandbox; la matriz y el procedimiento están en `docs/MILUKITA_STAGING_QA_RUNBOOK.md`.
