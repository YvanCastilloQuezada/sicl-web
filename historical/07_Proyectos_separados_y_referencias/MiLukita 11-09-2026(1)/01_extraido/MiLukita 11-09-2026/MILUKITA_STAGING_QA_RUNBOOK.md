# MiLukita — Runbook de staging y QA externo

## Alcance

Este documento separa la evidencia reproducible local de las actividades que requieren infraestructura compartida, credenciales, red y dispositivos físicos. El piloto continúa usando créditos virtuales y no activa pagos ni retiros.

## Dos instancias y locking

Ejecutar dos procesos de la misma versión apuntando a la misma base MySQL/TiDB de staging. Enviar simultáneamente el mismo evento y `idempotencyKey` al callback LIVE. Debe registrarse un único evento de claim y un único avance de ciclo. Revisar el Event Store por `idempotencyKey`, `aggregateId` y `source`; cualquier duplicado obliga a detener la prueba.

El harness local `server/scheduler/dualInstanceSimulation.ts` demuestra el contrato de unicidad con dos instancias lógicas y un almacenamiento compartido atómico. No constituye certificación de dos procesos reales ni sustituye la prueba contra la base de staging.

## Heartbeat, Watchdog y Kill Switch

En staging, crear una tarea Heartbeat autenticada con frecuencia definida por el operador, apuntando al callback LIVE-24. Verificar persistencia de cada ejecución, estado `ALERT_ONLY` del Watchdog y evidencia de `STOPPED/KILL SWITCH`. Activar el Kill Switch de manera supervisada, comprobar que no se generan nuevas transiciones y después reanudar mediante una acción humana registrada. No usar este procedimiento en producción sin aprobación legal, operativa y de seguridad.

## Matriz QA física

| Plataforma | Navegación | QR | Audio/mute | Mantenimiento | Recuperación | Estado |
|---|---|---|---|---|---|---|
| Samsung Tizen | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NO VERIFICADO |
| LG webOS | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NO VERIFICADO |
| Android/Google TV | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NO VERIFICADO |
| iOS Safari | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NO VERIFICADO |
| Android Chrome/WebView | Pendiente | Pendiente | Pendiente | Pendiente | Pendiente | NO VERIFICADO |

Cada fila requiere modelo exacto, versión del sistema, navegador, resolución, distancia de lectura, resultado, fecha, operador y captura o video de evidencia.

## Criterio de cierre

La orden externa solo puede marcarse como validada cuando exista evidencia de dos instancias reales, logs de staging persistentes y una matriz física completa. Hasta entonces, la clasificación correcta es `PREPARADO` o `NO VERIFICADO`.
