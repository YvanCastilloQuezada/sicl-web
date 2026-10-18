# Fase 2 — Realtime, espera móvil y Boss Fight

**Estado:** Implementación inicial validada en sandbox local  
**Fecha:** 26 de agosto de 2026  
**Marca:** MiLukita  
**Alcance:** créditos virtuales; sin dinero real ni retiros.

## 1. Carga progresiva del realtime

Se ejecutó `pnpm load:realtime` con el gestor `PlayerSessionManager` y una sala aislada. La prueba ejercitó altas acumulativas, heartbeat, reconexión y salida de los jugadores.

| Nivel | Conectados observados | Join (ms) | Heartbeat (ms) | Errores |
|---:|---:|---:|---:|---:|
| 1 | 1 | 0.846 | 0.148 | 0 |
| 10 | 10 | 0.428 | 0.194 | 0 |
| 25 | 25 | 0.170 | 0.164 | 0 |
| 50 | 50 | 0.459 | 3.732 | 0 |
| 75 | 75 | 0.310 | 1.517 | 0 |
| 100 | 100 | 0.478 | 2.212 | 0 |

La reconexión de 100 sesiones tardó 1.091 ms y la salida de 100 sesiones tardó 0.827 ms en esta ejecución. El estado final quedó en cero jugadores activos. Estos valores miden únicamente el gestor en memoria; no representan latencia de red, WebSocket real, base de datos, balanceador o infraestructura multiinstancia.

> Interpretación: la capacidad lógica del gestor cumple el límite configurado de 100 jugadores en una sala aislada. Falta una prueba de carga de red y persistencia antes de certificar capacidad operativa.

## 2. Experiencia móvil de espera

`RealtimePlayerLobby` se integra en `GamePage` cuando el usuario entra desde un `round` de TV. El usuario define nickname y avatar, se conecta a `/realtime`, recibe un token de sesión local por ronda y mantiene heartbeat. La interfaz muestra los estados de conexión, error, reintento, salida y contador de jugadores.

La pantalla de espera traduce los estados del lobby de la siguiente manera:

| Estado | Mensaje de usuario |
|---|---|
| `WAITING` | Esperando inicio |
| `ACTIVE` | Evento en vivo |
| `CLOSING` | Cierre en curso |
| `FINISHED` | Evento finalizado |

El cliente no calcula resultados, premios, score ni saldo. El snapshot y las transiciones dependen del servidor.

## 3. Motor inicial Boss Fight

Se añadieron `shared/bossFight.ts` y `server/games/bossFightEngine.ts`. El motor mantiene fase, salud, posición, patrón de movimiento, marca temporal y último evento. Los patrones iniciales son `SWEEP`, `PULSE` y `ORBIT`. La posición se proyecta en el servidor y el cliente, cuando exista, solo podrá representar el estado recibido.

La detección de impacto valida fase activa, distancia contra la posición autoritativa y request idempotente. Un impacto válido aplica 10 puntos de daño; un request repetido, una fase incorrecta o un impacto fuera de alcance no modifica la salud. El motor no liquida premios ni modifica wallet, RNG, RTP, reglas o MJP CORE.

## 4. Validación ejecutada

| Validación | Resultado |
|---|---|
| `pnpm check` | Aprobado |
| Pruebas focalizadas realtime/Boss Fight | Aprobadas |
| Suite focalizada ejecutada | 51 archivos aprobados, 1 omitido; 164 pruebas aprobadas, 4 omitidas |
| Carga progresiva 1→100 | Sin errores lógicos |
| Build de producción | Pendiente de ejecutar después de este bloque |

## 5. Limitaciones y siguientes controles

La prueba de carga actual es local y determinista. No certifica 100 conexiones simultáneas sobre red real ni operación multiinstancia. Antes de staging se debe medir WebSocket real, memoria, CPU, reconexión masiva, latencias p95/p99, desconexiones y comportamiento bajo Autoscale. Para operación persistente se debe evaluar almacenamiento compartido o hosting reservado.

El Boss Fight se encuentra en estado de motor inicial y pruebas de dominio. Todavía no tiene UI pública, no está conectado a una ronda productiva ni tiene integración con premios. La siguiente etapa debe definir el contrato de eventos del combate y un router protegido para el operador, sin permitir que el cliente sea autoridad.

## 6. WebSocket real y panel operativo

Se añadió el router protegido `bossFight` al contrato tRPC. `start` y `expire` requieren rol administrativo; `state` y `hit` requieren sesión autenticada. El panel `BossFightTestPanel` se muestra dentro de `ControlRoom`, que ya exige rol de operador. Permite iniciar un combate de prueba, consultar el estado cada segundo y enviar un impacto sobre la posición publicada por el servidor.

La interfaz se mantiene explícitamente en preproducción. No se integra en `/tv`, Home, PWA ni Overlay, y no concede autoridad al cliente para modificar salud, posición, fase o resultados.

La suite focalizada posterior a estos cambios finalizó con 51 archivos aprobados, 1 omitido, 164 pruebas aprobadas y 4 omitidas. El build de producción también fue aprobado.

La prueba de carga de WebSocket real sobre conexiones de red no quedó certificada en este bloque; la métrica disponible corresponde al gestor local y debe complementarse con un harness de conexiones WebSocket contra staging.
