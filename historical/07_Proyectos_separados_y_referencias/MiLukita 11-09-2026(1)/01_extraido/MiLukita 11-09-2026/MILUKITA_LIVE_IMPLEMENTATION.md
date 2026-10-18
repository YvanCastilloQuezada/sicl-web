# MiLukita LIVE — Implementación y estado de autonomía

**Fecha de corte:** 27 de agosto de 2026  
**Estado:** piloto virtual, proyección LIVE implementada para revisión y simulación local  
**Autoridad:** MJP CORE; los componentes LIVE no generan resultados ni liquidan premios.

## Resumen

Se desarrolló una primera capa funcional de MiLukita LIVE sobre los contratos existentes. La nueva proyección representa un canal continuo con evento actual, estado, jugadores, disponibilidad de QR, resultado, próximo evento y agenda inicial. La TV consume esta proyección mediante una consulta pública de solo lectura; el panel deja explícito que la fuente autoritativa es MJP CORE y que el piloto usa exclusivamente créditos virtuales.

El ciclo modelado es: `PRESENTING → QR_READY → INTERACTION → CLOSING → RESULT → NEXT_EVENT`. La agenda alterna Boss Fight, Lotería 39, Ruleta 17 y Trivia, con duración y enfriamiento definidos. Esta implementación no reemplaza `runScheduledGameCycle`, `MjpTvManifest`, el Round Engine, Draw Engine ni Settlement.

## Componentes incorporados

| Componente | Archivo | Estado |
|---|---|---|
| Contrato LIVE | `shared/liveChannel.ts` | Implementado y probado |
| Agenda de 24 horas | `buildDefaultLiveSchedule()` | Implementada como agenda determinista de simulación |
| Proyección actual/próxima | `projectLiveManifest()` | Implementada; fuente declarada MJP CORE |
| Simulación de 24 horas | `simulateLiveDay()` | Implementada para validación local |
| Endpoint público | `broadcast.livePreview` en `server/routers.ts` | Implementado; lectura, piloto-only |
| Vista TV | `client/src/components/LiveChannelPanel.tsx` integrada en `BroadcastPage.tsx` | Implementada |
| Pruebas | `shared/liveChannel.test.ts` | 3 pruebas nuevas, 10 aserciones |

## Flujo funcional

| Etapa | Estado esperado | Responsabilidad |
|---|---|---|
| Inicio | `NEXT_EVENT` o `IDLE` | Mostrar agenda y siguiente ventana |
| Presentación | `PRESENTING` | Preparar anuncio y contexto |
| QR | `QR_READY` | Exponer el QR autorizado existente cuando la ronda real esté abierta |
| Interacción | `INTERACTION` | Dejar que WebSocket y el juego server-side validen acciones |
| Cierre | `CLOSING` | Delegar el cierre al Round Engine |
| Resultado | `RESULT` | Mostrar únicamente resultado autorizado |
| Recompensa | Fuera de este proyector | Settlement y wallet existentes |
| Siguiente evento | `NEXT_EVENT` | Proyectar la siguiente ventana sin mutar la ronda |

## Seguridad y límites

La proyección LIVE no recibe autoridad para crear ganadores, modificar RNG, RTP, reglas, premios, wallet, créditos, liquidación o `MjpTvManifest`. El campo `source` declara `{ system: "MJP_CORE", authoritative: true }`, mientras `virtualOnly: true` evita confundir el piloto con dinero real.

Los jugadores mostrados en la vista previa son un parámetro de simulación. No representan audiencia real. La agenda determinista no prueba disponibilidad continua, red pública, escalamiento multiinstancia ni certificación regulatoria.

## Evaluación de autonomía

La simulación genera una agenda de 24 horas, reporta eventos programados/completados, recuperaciones y errores críticos, y documenta sus limitaciones. La prueba unitaria confirma que la agenda no se solapa, que el manifest conserva la autoridad de MJP CORE y que los fallos recuperables simulados terminan correctamente.

Esto no debe presentarse como “24 horas operativas sin intervención”. Para esa afirmación falta ejecutar el sistema desplegado en un entorno persistente, con cron/Heartbeat real, métricas retenidas, WebSocket, base de datos, QR real, navegador TV y registro de incidentes.

## Opciones de operación continua

| Alternativa | Ventajas | Limitaciones | Costo/operación |
|---|---|---|---|
| Ejecución programada sobre el hosting estándar | Menor costo y adecuada para callbacks periódicos; usa handlers idempotentes | No mantiene un proceso permanente ni estado en memoria; requiere que el estado esté en DB | Uso medido; no se habilitó automáticamente |
| Proceso persistente para WebSocket, worker y loop continuo | Sin cold start y apto para un proceso 24/7 dentro de 1 vCPU/512 MB | Instancia única, recursos limitados y costo superior | Hasta aproximadamente US$37,50/mes a plena utilización, menos US$10 de crédito mensual; egress adicional medido |

No se habilitó ninguna modalidad de alojamiento ni se creó un cron de producción. Antes de hacerlo se requiere checkpoint, despliegue del sitio, aprobación del propietario y definición del procedimiento de Kill Switch.

## Pendientes críticos

| Prioridad | Pendiente | Motivo |
|---|---|---|
| P0 antes de dinero real | Revisión legal, homologación y certificación independiente | El piloto no debe convertirse en operación monetaria sin autorización aplicable |
| P1 | Locking distribuido u optimistic concurrency | Evitar carreras en múltiples instancias |
| P1 | Watchdog persistente limitado a alertas | La simulación no sustituye monitoreo real |
| P1 | Recovery operativo con reintentos, fallback y escalamiento | Los planes de recuperación del documento original aún son un contrato de diseño |
| P1 | Integración real con Scheduler y `runScheduledGameCycle` | El proyector LIVE actual no abre ni cierra rondas por sí solo |
| P1 | QA físico | Validar QR, foco, audio, WebSocket y legibilidad en TV/móvil reales |
| P2 | Métricas de retención y audiencia | Medir si el canal consigue usuarios recurrentes |

## Criterio de aceptación honesto

La implementación actual pasa la validación de contrato y simulación local. El criterio de aceptación de un canal autónomo de 24 horas queda **pendiente** hasta demostrar, en un entorno desplegado, al menos 24 horas continuas, 90 % de eventos ejecutados, recuperaciones verificadas, cero errores críticos, evidencia de QR y resultados, y activación efectiva del Kill Switch.

> La arquitectura LIVE ya puede presentar un canal continuo de forma controlada; todavía no debe llamarse una operación autónoma productiva de 24 horas.


## Mejoras de experiencia del panel LIVE

El panel ahora muestra una cuenta regresiva visual `HH:MM:SS` para el próximo evento. El contador se inicia a partir de la proyección del servidor y continúa localmente entre actualizaciones del manifest; no decide ni modifica la agenda autoritativa.

Cuando cambia el `eventId`, la interfaz muestra durante seis segundos un aviso destacado de “Nuevo evento en vivo” y reproduce un tono corto de selección. El sonido utiliza la misma preferencia persistente del mando remoto (`milukita-tv-remote-sound`); si está silenciado, no se reproduce. Los navegadores y televisores pueden bloquear audio iniciado fuera de una interacción previa, por lo que el aviso visual siempre es la señal principal.

Cuando el estado QR pasa de no disponible a `READY`, el indicador se resalta temporalmente con una animación de pulso. La animación respeta `prefers-reduced-motion` y el payload continúa siendo el QR existente firmado por MJP CORE; la animación no altera su contenido ni su validez.


## Diagnóstico de la solicitud de temporización

| Función solicitada | Estado antes de esta iteración | Estado actual |
|---|---|---|
| Barra de tiempo transcurrido/restante del evento actual | No implementada en `LiveChannelPanel`; solo existía el estado del evento | Implementada con porcentaje, barra visual y tiempos transcurrido/restante |
| Recordatorio del próximo evento | No implementado | Implementado con opciones de 1, 5, 10 minutos o desactivado; persistencia local por dispositivo |
| Temporizador legible a distancia | Existía contador `text-3xl`, sin configuración específica de TV | Ajustado a `text-5xl`, tipografía monoespaciada, contraste alto y `aria-live` |

El recordatorio es local y funciona mientras la vista TV permanezca abierta. No se presenta como una notificación push ni como una garantía de aviso con la aplicación cerrada. El aviso visual continúa siendo la señal principal; el sonido respeta la preferencia de silencio y las políticas del navegador.
