# Realtime y sincronización

## Estado de Fase 1

La plataforma conserva el `MjpTvManifest` como unidad autoritativa de distribución para TV, overlay y celular. Sobre esa base se añadió un **Core Realtime de sesiones de jugadores** en `/realtime`, sin permitir que el cliente determine ronda, hit, daño, score, recompensa, saldo o resultado.

La capa utiliza el mismo servidor HTTP de Express y expone un adaptador WebSocket con `ws`. El cliente puede enviar comandos de incorporación, heartbeat, reconexión y salida; el servidor valida los datos, mantiene el estado de sesión y emite snapshots del lobby.

## Contratos y archivos

| Elemento | Ubicación | Responsabilidad |
|---|---|---|
| Contratos compartidos | `shared/realtime.ts` | Tipos `ConcurrentPlayer`, `PlayerSession`, `LobbySnapshot`, comandos y eventos. |
| Gestor de sesiones | `server/realtime/playerSessionManager.ts` | Join por ronda/dispositivo, máximo de 100 jugadores, estado y transiciones. |
| Adaptador WebSocket | `server/realtime/websocketServer.ts` | Endpoint `/realtime`, validación de comandos y emisión de eventos. |
| Router tRPC | `server/realtime/router.ts` | Snapshot, join, heartbeat, reconnect y leave como alternativa HTTP. |
| Arranque HTTP | `server/_core/index.ts` | Conecta WebSocket al mismo `http.Server` de Express. |
| Registro API | `server/routers.ts` | Expone el namespace `realtime`. |
| Pruebas | `server/realtime/*.test.ts` | Cobertura unitaria e integración del gestor y WebSocket. |

## Flujo implementado

```text
TV / QR
  ↓
JOIN { roundId, deviceId, nickname, avatar, requestId }
  ↓
Servidor valida y crea sesión
  ↓
SESSION_READY + LOBBY_STATE
  ↓
HEARTBEAT
  ↓
HEARTBEAT_ACK
  ↓
Cierre o pérdida de conexión
  ↓
RECONNECT con sessionToken + deviceId
  ↓
RECONNECT_ACCEPTED + STATE_SYNC
```

El `sessionToken` es generado por el servidor. El cliente no puede elegir el `playerId`; este se deriva de la ronda y del dispositivo en el gestor. Los comandos críticos aceptan `requestId` y devuelven el mismo resultado ante un reintento idempotente.

## Estados y tiempos

| Estado | Condición | Acción |
|---|---|---|
| `ACTIVE` | Heartbeat o acción reciente | Se cuenta como conectado. |
| `IDLE` | 30 segundos sin actividad | Se conserva la sesión y se excluye del conteo conectado. |
| `DISCONNECTED` | 90 segundos sin actividad | Se conserva la sesión para reconexión. |
| `LEFT` | Salida explícita o TTL de 15 minutos | No vuelve al lobby activo mediante esa sesión. |

El límite de la sala es de 100 jugadores por instancia del gestor. La implementación actual mantiene el estado en memoria y es adecuada para la validación de Fase 1 y un proceso único. Para operación multi-instancia en Autoscale, el siguiente gate debe mover el estado de sala a un almacén compartido o usar Reserved Hosting con un proceso persistente; no se debe declarar escalabilidad productiva de 100 jugadores hasta ejecutar pruebas de carga y verificar esa decisión.

## Fallback y autoridad

La alternativa HTTP tRPC permite probar el flujo sin WebSocket y conservar compatibilidad con polling. Si una conexión WebSocket se corta, la sesión no se elimina inmediatamente; queda disponible para reconexión durante el TTL. El fallback no sustituye la validación autoritativa de rondas ni habilita resultados desde el cliente.

Esta Fase 1 no implementa todavía Boss Fight, hit detection, movimiento autoritativo, rankings, torneos, pagos reales, recompensas de juegos cooperativos ni persistencia histórica de sesiones. Esos módulos pertenecen a fases posteriores y deben reutilizar estos contratos, no crear un segundo sistema de sesiones.
