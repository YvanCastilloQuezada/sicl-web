# MJP Master Implementation Audit

**Proyecto:** Multi Juegos Perú / `ruleta-peru-online`  
**Propósito:** auditoría técnica independiente del piloto virtual, sus juegos, motor, QR, PWA, TV/OBS, automatización y preparación futura.  
**Fecha:** 25 de agosto de 2026  
**Autor:** Manus AI  
**Dinero real:** OFF  
**Depósitos:** OFF  
**Retiros:** OFF  
**Yape:** OFF  
**Tarjetas:** OFF  
**Conversión a soles:** OFF  
**KYC real:** OFF  
**AML real:** OFF

> Este documento diferencia explícitamente lo que funciona, lo que está simulado, lo que opera solo localmente, lo que está bloqueado por credenciales o decisiones humanas y lo que no está implementado. La existencia de un archivo o de una interfaz no se considera evidencia suficiente de funcionamiento.

## 1. Resumen ejecutivo

El proyecto es un piloto web full-stack de juegos exclusivamente virtuales. La autoridad de rondas, resultados, premios, créditos y auditoría reside en el backend y en la base de datos. La aplicación dispone de 23 modalidades registradas en la calculadora RTP, una PWA, simulador local, verificación pública, panel administrativo, QR firmado por ronda y una primera integración visual con TV/OBS.

La línea base previa a esta auditoría estaba en el commit `3490c90b4b34fb6d83d76eac5adfef010772803f`, rama `main`, con 22 archivos de prueba y 67 pruebas aprobadas. Durante la auditoría se aplicaron correcciones acotadas y no monetarias: QR determinista por ronda, módulo formal de transiciones persistidas, corrección de archivado de rondas `draft` expiradas, tabla persistente de métricas de señal, procedimientos administrativos para registrar/consultar métricas y un laboratorio local de prueba con dos dispositivos virtuales.

Después de los cambios, `pnpm check` pasó, la suite alcanzó **23 archivos y 70 pruebas aprobadas**, y `pnpm build` pasó. La auditoría matemática teórica reporta 23 modalidades con piso declarado de 85 %, pero la simulación de 50 000 jugadas no puede considerarse certificación para todas las modalidades: el simulador aislado no modela aún todas las reglas de Bingo, ruletas simplificadas, Raspa, Pick, Loto y Sueldo. Las discrepancias se conservan en este documento.

## 2. Estados permitidos

Se utilizan exclusivamente los estados exigidos por la orden maestra:

| Estado | Significado |
|---|---|
| PASS | Funciona y cuenta con evidencia suficiente en el alcance probado. |
| FAIL | Existe una discrepancia o defecto confirmado que debe corregirse. |
| BLOCKED | No puede completarse sin credencial, proveedor, configuración o decisión externa. |
| NOT IMPLEMENTED | No existe implementación funcional. |
| SIMULATED | Existe una demostración aislada que no afecta la operación oficial. |
| LOCAL ONLY | Funciona en navegador o entorno local, sin persistencia/servicio externo completo. |
| NEEDS HUMAN DECISION | Requiere aprobación del propietario por impacto de negocio, regulación, seguridad o arquitectura. |

## 3. Inventario Git y stack

| Elemento | Resultado |
|---|---|
| Rama | `main` |
| Commit de referencia | `3490c90b4b34fb6d83d76eac5adfef010772803f` |
| Cambios iniciales | Solo `todo.md` modificado por seguimiento |
| Cambios de esta auditoría | QR, estados, métricas, panel, laboratorio, pruebas y migración 0018 |
| Node | 22.13.0 |
| pnpm | 10.4.1 |
| React | 19.2.1 |
| TypeScript | Configurado con `pnpm check` |
| Express | 4.21.2 |
| tRPC | 11.6.0 |
| Drizzle ORM | 0.44.5 |
| Base de datos | MySQL/TiDB mediante `mysql2` |
| Vite | 7.1.9 |
| Vitest | 2.1.4 |
| QR | `qrcode` 1.5.4 |
| Tiempo real | No hay WebSocket, SSE ni EventSource; se usan polling y BroadcastChannel local |
| Three.js/Avatar 3D | No hay dependencia instalada |
| YouTube API | No hay dependencia ni credencial configurada |

El build genera una advertencia no bloqueante por una imagen `/manus-storage/...` no resoluble en compilación y otra por un bundle principal superior a 500 kB. Estas advertencias deben optimizarse antes de una publicación amplia.

## 4. Arquitectura real y arquitectura objetivo

La arquitectura real conserva la separación fundamental entre motor y presentación. `server/pilot.ts` contiene configuración de juegos, reservas, resultados, liquidación, wallet y reglas versionadas. `server/routers.ts` expone procedimientos tRPC con separación pública, protegida y administrativa. `drizzle/schema.ts` mantiene rondas, tickets, reglas, wallets, transacciones, auditoría, programaciones y nuevas métricas de señal.

La arquitectura objetivo es:

```text
MJP CORE
├── Round Engine       -> rondas persistidas y estados
├── Draw Engine        -> semilla, hash, resultado verificable
├── Rule Engine        -> rulesets versionados y premios
├── Credit Engine      -> créditos virtuales e idempotencia
├── Audit/Verify       -> eventos, pruebas y verificación pública
└── Consumers
    ├── Web/PWA
    ├── TV/OBS
    ├── QR
    ├── YouTube        -> bloqueado hasta credenciales
    ├── Avatar 3D      -> no implementado
    └── TTS             -> no implementado
```

**Estado: PASS** para la separación conceptual y la autoridad backend. **FAIL** para algunas garantías de concurrencia profunda porque el cierre actual todavía necesita una transacción/claim atómico de ronda para resistir dos cierres simultáneos en una base altamente concurrente.

## 5. Estado de componentes

| Componente | Estado | Evidencia y diagnóstico |
|---|---|---|
| Round Engine | PASS | Rondas, reservas, cierres y estados están persistidos y cubiertos por integración. |
| Draw Engine | PASS | Resultado autoritativo con semilla/hash y algoritmo HMAC-SHA-256. |
| Máquina de estados | PASS | Se añadió `shared/roundState.ts` con transiciones permitidas para el enum persistido. La aplicación completa de un claim transaccional sigue pendiente. |
| QR | PASS | Firma HMAC, versión, ventana temporal y nonce determinista por ronda. El mismo round produce la misma identidad QR. |
| QR persistido en DB | LOCAL ONLY | El token es determinista, pero no hay columna de payload QR. La persistencia se obtiene por derivación, no por registro individual. |
| Wallet virtual | PASS | Movimientos y premios virtuales con `idempotencyKey`; no hay valor monetario. |
| Liquidación concurrente | FAIL | La idempotencia de transacciones existe, pero el cierre completo no tiene todavía claim transaccional explícito antes de leer/liquidar todos los tickets. |
| RTP | FAIL | La calculadora teórica pasa 23 modalidades, pero existen discrepancias entre algunas tablas, nombres históricos y simulador aislado. |
| PWA | PASS | Manifiesto, instalación, offline, tema, guía táctil y responsive implementados. |
| TV | LOCAL ONLY | `/tv` consulta rondas y presenta transmisión/contingencia, pero la señal audiovisual se monitoriza localmente. |
| OBS | LOCAL ONLY | Overlay web compatible con navegador/OBS; no se probó una instalación OBS real. |
| YouTube | BLOCKED | ID manual/local disponible; API oficial pendiente de `YOUTUBE_API_KEY` e `YOUTUBE_CHANNEL_ID`. |
| Avatar 3D | NOT IMPLEMENTED | No existe motor Three.js, avatar, rig, animación ni proveedor de activos. |
| TTS | NOT IMPLEMENTED | No existe narrador texto-a-voz para la emisión. |
| Scheduler | BLOCKED | Heartbeat/Cron y cierre programado están preparados y desactivados. |
| Watchdog | NOT IMPLEMENTED | No existe servicio persistente de recuperación y escalamiento. |
| Auditoría | PASS | Eventos encadenados, reglas, pruebas y verificación pública. |
| Seguridad | PASS | OAuth, roles, rate limiting, cabeceras y procedimientos administrativos. Requiere pruebas de penetración antes de producción. |
| Analítica | LOCAL ONLY | Panel financiero y métricas de señal tienen utilidad operativa, pero no hay observabilidad productiva completa. |

## 6. Base de datos

El esquema tiene 21 tablas después de la migración 0018. Las principales son `users`, `game_rulesets`, `game_rounds`, `virtual_wallets`, `wallet_transactions`, `pilot_tickets`, `game_batch_previews`, `game_schedules`, `virtual_award_installments`, `virtual_plan_enrollments`, `audit_events`, `payment_references`, `market_events`, `market_positions`, `market_batch_previews`, `social_impact_cycles` y `broadcast_signal_metrics`.

`game_rounds` conserva `publicId`, juego, ruleset, estado, apertura, cierre, hash de semilla, secreto de servidor, semilla revelada, `publicSeed`, `ticketSetHash`, resultado y marcas de tiempo. `wallet_transactions` tiene una clave de idempotencia única. `audit_events` mantiene el registro encadenado de auditoría. `broadcast_signal_metrics` registra `publicId`, canal, video opcional, fuente, estado, latencia, porcentaje de frames perdidos, detalle y fecha de medición.

La tabla de métricas se creó mediante `drizzle/0018_grey_roughhouse.sql` y fue aplicada sin operaciones destructivas. **Estado: PASS** para la migración aplicada; **LOCAL ONLY** para la calidad de señal porque todavía no recibe datos oficiales de YouTube.

## 7. API y autorización

Los grupos tRPC principales son `auth`, `games`, `simulator`, `profile`, `assistedPlans`, `rtpDashboard`, `readiness`, `broadcast`, `wallet`, `missions`, `payments`, `market` y `operations`.

Las lecturas de rondas, verificación y QR son públicas porque solo entregan información pública o verificable. Las reservas y wallet son `protectedProcedure`. Las operaciones de administración, activación de reglas, cierre de rondas, programación y métricas persistentes son `adminProcedure`.

El nuevo contrato administrativo incluye `operations.broadcastSignalMetrics` y `operations.recordBroadcastSignal`. Ambos están restringidos al administrador. La integración oficial de YouTube no se expone porque está **BLOCKED** sin credenciales y sin una decisión sobre alcance de permisos.

## 8. Máquina de estados y autoridad temporal

El enum persistido actual es `draft`, `open`, `locked`, `drawn`, `settled`, `archived`. La máquina formal permite:

```text
draft -> open -> locked -> drawn -> settled -> archived
draft -> archived
open  -> archived
locked -> archived
drawn -> archived
```

No permite volver desde estados terminales ni saltar directamente de `open` a `drawn`. La capa pública proyecta los estados persistidos a `scheduled`, `open`, `locked`, `drawn`, `verified` o `cancelled` para la transmisión.

La cuenta regresiva es una representación visual. La autorización real de una reserva depende del backend y de la ronda persistida. Esta separación es **PASS**. Debe añadirse posteriormente un update/claim atómico con bloqueo transaccional para que dos procesos de cierre no puedan leer y liquidar la misma ronda simultáneamente.

## 9. QR y sincronización

El QR contiene `broadcastId`, `roundId`, tipo de juego, nombre, versión de ruleset, ventana temporal, nonce, URL de juego, URL de verificación, versión QR y firma HMAC. El secreto se deriva de `JWT_SECRET`; no hay secreto hardcodeado por defecto.

La corrección aplicada elimina el `randomBytes` por solicitud y deriva el nonce determinísticamente de la versión QR, ronda, ruleset y ventana temporal. Por ello, una misma ronda mantiene la misma identidad QR durante las solicitudes repetidas. El QR no decide el estado ni el resultado; solo conduce al consumidor a la ronda verificable.

**Estado: PASS** para firma, expiración, integridad y estabilidad por ronda. **LOCAL ONLY** para almacenamiento físico del payload, pues la identidad se deriva y no se almacena como una fila independiente.

## 10. TV, OBS y PWA

`/tv` presenta la señal de YouTube cuando recibe un video ID, muestra rondas públicas, QR, cuenta regresiva, historial y verificación. Si no existe video o la señal cae, muestra una pantalla personalizada de contingencia con reconexión automática. `/overlay/:roundId` permite presentar datos públicos en navegador u OBS.

Operaciones permite guardar localmente el ID de YouTube, marcar el procedimiento de emisión, seleccionar rondas, abrir overlay, filtrar por estado y exportar CSV. El laboratorio de dos dispositivos añadido en esta auditoría simula TV/OBS y celular/PWA en memoria del navegador. Muestra conexión, recepción de ronda, recepción de QR y confirmación de interacción.

El laboratorio es **SIMULATED** y **LOCAL ONLY**. No crea rondas, tickets, movimientos de wallet ni resultados. La PWA es **PASS** en cuanto a instalación y presentación, pero las pruebas reales de hardware móvil, Smart TV y OBS permanecen pendientes.

## 11. Señal, métricas y alertas

Se añadió la tabla persistente `broadcast_signal_metrics`, el procedimiento administrativo de escritura/lectura y una vista operativa con estado, últimas mediciones y alerta cuando la señal queda degradada u offline. El panel registra el latido local recibido desde `/tv` con limitación temporal para no generar escrituras excesivas.

**Estado: PASS** para persistencia del modelo y alertas visuales basadas en datos registrados. **LOCAL ONLY** para la fuente de datos, porque el latido procede del navegador y no de YouTube Live API. **BLOCKED** para calidad oficial de la transmisión hasta disponer de credenciales y permisos de YouTube.

## 12. YouTube Live

La consulta automática oficial no está implementada. El proyecto no contiene API key ni ID de canal configurado. El flujo manual `/tv?v=ID` y el guardado local del ID son una solución de prueba, no una integración oficial.

**Estado: BLOCKED.** Requiere que el propietario proporcione o configure de forma segura una API key restringida para YouTube Data API v3, el ID del canal y la autorización de scopes mínimos. No se deben incluir valores secretos en código, documentos, capturas ni commits.

## 13. Avatar, TTS y canales sociales

Avatar 3D, animación facial, voz de presentación, TTS y canales WhatsApp, Telegram, Discord, Facebook, Instagram, TikTok y Twitch están **NOT IMPLEMENTED**. No deben agregarse superficialmente como botones o placeholders presentados como integración real. Requieren decisión de proveedor, derechos de activos, presupuesto, idiomas, privacidad, moderación y política de uso.

## 14. Scheduler, watchdog y kill switch

La arquitectura Heartbeat/Cron existe para ciclos programados y el endpoint está protegido por autenticación de tarea. Las modalidades programadas permanecen desactivadas. El sistema no tiene todavía watchdog persistente con escalamiento, recuperación automática, circuit breaker ni kill switch operacional independiente.

Scheduler: **BLOCKED**. Watchdog: **NOT IMPLEMENTED**. Kill Switch: **NOT IMPLEMENTED**. Activarlos requiere **NEEDS HUMAN DECISION**, procedimiento de operación, alertas, pruebas de reinicio y definición de quién puede detener las rondas.

## 15. Auditoría matemática

La calculadora teórica `pnpm rtp:all` reportó 23 modalidades con piso mínimo de 85 %. Esta aprobación significa que las fórmulas y tablas introducidas en la calculadora alcanzan el umbral; no equivale a certificación independiente ni a una simulación integral del backend.

| Juego | RTP teórico/calculado % | RTP publicado % | RTP simulado 50k % | Conclusión |
|---|---:|---:|---:|---|
| Ruleta piloto | 86,4865 | 86,4865 | 49,8600 | FAIL: simulador no modela la apuesta como el motor |
| Ruleta 7 | 85,7143 | 85,7143 | 0,0000 | FAIL: simulador aislado incompatible |
| Ruleta 17 | 94,1176 | 94,1176 | 0,0000 | FAIL: simulador aislado incompatible |
| Ruleta 27 | 96,2963 | 96,2963 | 0,0000 | FAIL: simulador aislado incompatible |
| Ruleta 37 | 97,2973 | 97,2973 | 0,0000 | FAIL: simulador aislado incompatible |
| Jackpot | 85,0426 | 85,0426 | 54,0949 | FAIL: simulador no reproduce toda la regla |
| Bingo piloto | 100,0000 | 100,0000 | 78,2374 | FAIL: modelo empírico distinto |
| Bingo Flash | 85,0549 | 85,0549 | 24,0000 | FAIL: simulador no modela extracción completa |
| Bingo Keno | 85,0000 | 85,0000 | 714,7200 | FAIL: salida diagnóstica no comparable |
| Bingo 75 | 85,1500 | 85,1500 | 13.244,6400 | FAIL: simulador no modela patrón/bola |
| Trío 13 | 86,8900 | 86,8900 | 86,4016 | PASS diagnóstico cercano |
| Sueldo de por vida | 86,0299 | 86,0299 | 104,1600 | FAIL: simulator no modela cuotas completas |
| Raspa Digital | 85,0000 | 85,0000 | 0,0000 | FAIL: simulador no modela tablero |
| Pick 3 | 85,1000 | 85,1000 | 88,3200 | FAIL: muestra no comparable al modelo teórico |
| Pick 4 | 85,1800 | 85,1800 | 379,2000 | FAIL: salida no comparable |
| Loto Diario | 85,2012 | 85,2012 | 81,6000 | FAIL: salida no comparable |
| Loto Express | 85,0000 | 85,0000 | 37,9200 | FAIL: salida no comparable |
| Lotería 29 | 92,2593 | 92,2593 | 92,0680 | PASS diagnóstico cercano |
| Lotería 39 MJP | 87,0902 | 87,0902 | 80,8080 | FAIL: muestra requiere más validación |
| Lotería 39 Cinco | 85,0011 | 85,0011 | 137,6700 | FAIL: salida no comparable |
| Lotería 49 | 85,0821 | 85,0821 | 79,3640 | FAIL: muestra requiere más validación |
| Lotería 59 | 94,3736 | 94,3736 | 89,9400 | PASS diagnóstico cercano |
| Lotería 19 | 86,4809 | 86,4809 | 88,3920 | PASS diagnóstico cercano |

La conclusión honesta es que el RTP teórico/calculado de 23 modalidades pasa el piso configurado, pero la auditoría empírica completa **FAIL** hasta que el simulador de 50 000 jugadas use exactamente el mismo motor, las mismas tablas, las mismas bolas de consuelo, la misma selección y la misma liquidación que el backend autoritativo.

## 16. Pruebas ejecutadas

| Prueba | Resultado cuantificable |
|---|---|
| `pnpm check` antes de cambios | PASS |
| Suite base | 22 archivos / 67 pruebas PASS |
| Suite después de QR y estados | 23 archivos / 70 pruebas PASS |
| QR firmado | 5 pruebas PASS |
| Máquina de estados | 2 pruebas PASS |
| API E2E existente | 2 pruebas incluidas y PASS |
| `pnpm build` después de cambios | PASS |
| RTP teórico | 23 modalidades sobre 85 % PASS |
| Simulación 50k | 23 modalidades ejecutadas; varias salidas FAIL/no comparables |
| Prueba cerrada de dos dispositivos | SIMULATED, LOCAL ONLY |
| Concurrencia de cierre real | NOT IMPLEMENTED como prueba de carga |
| Duplicación de liquidación bajo dos procesos | NOT IMPLEMENTED como prueba de carga |
| Reinicio/caída de scheduler | NOT IMPLEMENTED |
| YouTube Live oficial | BLOCKED |
| OBS físico | NOT IMPLEMENTED |
| Avatar/TTS | NOT IMPLEMENTED |

## 17. Seguridad y privacidad

No se introdujeron secretos hardcodeados. El QR requiere `JWT_SECRET` con longitud mínima de 32 caracteres. Las operaciones administrativas están bajo `adminProcedure`. Los resultados públicos no incluyen PII de usuarios. La PWA excluye rutas autenticadas del caché oficial.

La configuración actual no equivale a un programa KYC/AML real, ni a geolocalización efectiva, ni a juego responsable ejecutable. La pantalla KYC es una demostración local que no recibe ni almacena documentos. El indicador de Perú es simulado. Estas funciones deben permanecer desactivadas en el piloto.

## 18. Variables de entorno

| Variable | Estado | Función |
|---|---|---|
| `DATABASE_URL` | Obligatoria para persistencia | Conexión MySQL/TiDB |
| `JWT_SECRET` | Obligatoria para sesión y QR | Firma de cookies y QR; nunca revelar valor |
| `VITE_APP_ID` | Gestionada por plataforma | Identificador OAuth |
| `OAUTH_SERVER_URL` | Gestionada por plataforma | Servidor OAuth |
| `OWNER_OPEN_ID` | Gestionada por plataforma | Identidad administrativa |
| `BUILT_IN_FORGE_API_URL` | Gestionada por plataforma | Servicios integrados |
| `BUILT_IN_FORGE_API_KEY` | Gestionada por plataforma | Credencial server-side |
| `YOUTUBE_API_KEY` | BLOCKED / pendiente | Consulta oficial de YouTube Live |
| `YOUTUBE_CHANNEL_ID` | BLOCKED / pendiente | Canal que se consultará automáticamente |

No se incluyen valores secretos en este documento.

## 19. Known Issues

El cierre y liquidación necesitan una transacción con claim atómico de ronda para evitar una carrera entre dos operadores o jobs. La migración de métricas no incorpora todavía una política de retención automática. El monitor local no mide frames perdidos reales, bitrate ni latencia del proveedor. El bundle frontend requiere code splitting. El simulador de 50k no reutiliza todo el motor autoritativo y produce resultados no comparables para varias modalidades.

## 20. Deviations respecto del documento 21/22

| Requisito | Desviación | Estado |
|---|---|---|
| QR persistido físicamente | Se usa derivación determinista; no hay columna de payload | LOCAL ONLY |
| Estados `drawing`/`verified` persistidos | El enum actual usa `drawn`/`settled`; se proyecta públicamente | FAIL parcial |
| YouTube API automática | Falta API key y channel ID | BLOCKED |
| Avatar 3D | Sin proveedor ni activos | NOT IMPLEMENTED |
| TTS | Sin proveedor ni guiones | NOT IMPLEMENTED |
| Watchdog | No existe servicio persistente | NOT IMPLEMENTED |
| Kill Switch | No existe flujo operacional | NEEDS HUMAN DECISION |
| Pruebas de concurrencia | No ejecutadas sobre dos procesos reales | NOT IMPLEMENTED |
| RTP simulado completo | El simulador aislado no reproduce todos los motores | FAIL |
| Dinero real | Se mantiene desactivado como exigió el propietario | PASS |

## 21. Recomendaciones priorizadas

La prioridad técnica inmediata es implementar un claim transaccional de ronda, encapsular cierre y liquidación en una transacción, añadir pruebas con dos llamadas concurrentes y verificar que solo una crea premios. Después conviene unificar el simulador con las funciones de cálculo del backend, generar intervalos de confianza y publicar únicamente RTPs reconciliados.

La segunda prioridad es terminar la integración de YouTube Live solo después de configurar credenciales restringidas y una política de scopes. La tercera es añadir retención, agregación y alertas persistentes de señal. Avatar, TTS, redes sociales y dinero real deben permanecer fuera del alcance hasta que exista una decisión de producto, legal, presupuestaria y de privacidad.

## 22. Información que requiere el propietario

1. API key restringida de YouTube Data API v3 y `YOUTUBE_CHANNEL_ID`, suministrados por el mecanismo seguro de secretos y nunca escritos en el chat o repositorio.
2. Decisión sobre si se permite una migración de `game_rounds.state` para persistir formalmente `drawing` y `verified`, o si se conserva el enum actual y la proyección pública.
3. Política de retención de métricas de señal: días, acceso y eliminación.
4. Proveedor, presupuesto, derechos y guiones para Avatar 3D y TTS.
5. Aprobación explícita del claim transaccional y de las pruebas de concurrencia sobre la base de datos.
6. Aprobación legal independiente antes de cualquier dinero real, pagos, retiros o afirmación regulatoria.

## 23. Checklist final

| Elemento | Estado |
|---|---|
| Dinero real apagado | PASS |
| Depósitos/retiros/Yape apagados | PASS |
| Backend como autoridad | PASS |
| QR firmado | PASS |
| QR estable por ronda | PASS |
| Métricas persistentes de señal | PASS |
| Alertas visuales de señal | PASS |
| Simulación de dos dispositivos | SIMULATED |
| YouTube API | BLOCKED |
| Avatar 3D | NOT IMPLEMENTED |
| TTS | NOT IMPLEMENTED |
| Scheduler | BLOCKED |
| Watchdog | NOT IMPLEMENTED |
| Kill Switch | NEEDS HUMAN DECISION |
| RTP teórico | PASS |
| RTP empírico completo | FAIL |
| Concurrencia real | NOT IMPLEMENTED |
| Pruebas actuales | PASS: 23 archivos / 70 pruebas |
| Build | PASS |
| Auditoría única | PASS |

## Referencias internas

[1]: ./docs/auditoria-integral-programa-2026-08-25.md "Auditoría integral anterior"
[2]: ./docs/canal-virtual-youtube-pwa-implementacion-2026-08-25.md "Implementación del canal virtual"
[3]: ./server/pilot.ts "Motor autoritativo y reglas"
[4]: ./server/broadcast.ts "QR y estado público de transmisión"
[5]: ./shared/roundState.ts "Máquina de estados persistida"
[6]: ./drizzle/schema.ts "Esquema Drizzle"
[7]: ./scripts/calculadora-rtp-todas.ts "Calculadora reproducible de RTP"
[8]: ./docs/reporte-simulacion-50k.json "Reporte de simulación de 50 000 jugadas"
[9]: ./server/broadcast.test.ts "Pruebas de QR"
[10]: ./server/api.e2e.test.ts "Pruebas HTTP E2E existentes"

## 24. Ejecución de la orden 23: MJP Autonomous Entertainment Machine

La orden 23 se incorporó como una evolución del monolito modular. No se crearon microservicios innecesarios y no se movió ninguna decisión oficial al frontend, TV, OBS, QR, Avatar, IA o YouTube.

### 24.1 Auditor Agent — prioridad 1

El **Auditor Agent** quedó implementado en `server/auditorAgent.ts`. Recibe un identificador público de ronda, consulta ronda, tickets, eventos de auditoría y evidencia de resultado, y produce comprobaciones para `ROUND`, `PARTICIPATIONS`, `CUTOFF`, `DRAW`, `PRIZES`, `SETTLEMENT`, `EVENTS` y `PUBLICATION`.

Su severidad final sigue esta prioridad: `CRITICAL` > `ANOMALY` > `WARNING` > `PASS`. Cada ejecución escribe un evento operativo idempotente `AUDITOR_ROUND_COMPLETED` en el Event Store. El agente no puede cambiar reglas, premios, resultados, liquidaciones ni modos monetarios.

**Estado: PASS**, con pruebas unitarias de severidad. La cobertura E2E de una ronda real auditada desde el panel debe ampliarse en la siguiente iteración.

### 24.2 Event Store

Se añadió `operational_events` mediante la migración 0019. El contrato incorpora `eventType`, `aggregateType`, `aggregateId`, `actor`, `source`, `payload`, `version`, `correlationId` e `idempotencyKey`, además de índices por agregado y tipo. La escritura es idempotente por clave única.

El Event Store complementa, no reemplaza, la cadena hash de `audit_events`. La cadena hash conserva la evidencia histórica; el Event Store permite observar operaciones, Autopilot, Watchdog, Auditor Agent y overrides humanos.

**Estado: PASS** para el contrato y la persistencia. **PENDIENTE:** emitir eventos operativos desde cada transición del Round Engine dentro de la misma transacción de dominio.

### 24.3 Game Registry

Se añadió `shared/gameRegistry.ts` con definición central de modalidad, versión, ruleset, RTP teórico/publicado, participación mínima/máxima, programación, habilitación, carácter virtual y clasificación.

La clasificación inicial es:

| Clasificación | Modalidades |
|---|---|
| ACTIVE_CORE | Lotería 39, Pick 3, Bingo |
| SECONDARY | Ruleta, Lotería 19/29/39 Cinco/49/59, Jackpot, Trío 13 |
| EXPERIMENTAL | Pick 4, Sueldo de por vida, Raspa, Loto Diario, Loto Express, Lotería 39 Extra, Ruletas 7/17/27/37 |
| DISABLED | Ninguna eliminada; se reserva para una futura decisión administrativa |

Esta clasificación no elimina código ni datos históricos. La portada actual conserva su catálogo; el registro sirve para priorización operativa y futura simplificación de navegación.

**Estado: PASS** para el registro central; **PENDIENTE:** consumirlo también en la portada para evitar definiciones duplicadas.

### 24.4 KPI de producto y retención

Se añadió `product_analytics_events` mediante la migración 0020. Los eventos no almacenan PII pública: registran el usuario interno cuando está autenticado, sesión técnica, modalidad opcional, fuente, tipo de evento y clave idempotente.

El beacon de sesión registra una vez por usuario/sesión/día `session_started`. El panel administrativo calcula DAU, WAU, retención D1, D7, D30, tasa de retorno, sesiones por usuario y participaciones por usuario en una ventana de 30 días. El KPI principal del piloto es `retention7d`; el éxito del producto no se juzgará por cantidad de juegos sino por el retorno medible de cohortes.

Cuando no hay suficientes datos, el panel muestra `—` en vez de fabricar porcentajes. La base actual puede empezar sin cohortes; eso es un resultado válido, no un dato simulado.

**Estado: PASS** para instrumentación y cálculo; **LOCAL ONLY** hasta que existan usuarios autenticados y suficientes días de observación. No se sembraron datos ficticios.

### 24.5 Autopilot, Watchdog y Kill Switch

Se añadió `server/autonomy.ts` y el panel administrativo visible `AutonomyControlPanel.tsx`. El Watchdog comprueba disponibilidad de base, modo de control y número de rondas abiertas. El Autopilot solo ejecuta un health check seguro; no abre, cierra, sortea ni liquida rondas en esta fase.

El Kill Switch persistente usa `system_control_state`, migración 0021 y modos `NORMAL`, `DEGRADED`, `STOPPED` y `MAINTENANCE`. Un cambio de modo requiere un administrador y genera `HUMAN_OVERRIDE`. El modo `STOPPED` bloquea el heartbeat del Autopilot, pero no modifica resultados históricos ni activa pagos.

**Estado: PASS** para control manual y límites. **NEEDS HUMAN DECISION** para activar cierres automáticos, reintentos, publicación automática o cualquier acción que cambie el ciclo oficial de una ronda.

### 24.6 Canales

Web, PWA, TV y OBS siguen siendo consumidores del MJP Core. La integración oficial de YouTube sigue **BLOCKED** hasta recibir una API key restringida y un ID de canal. Avatar 3D, TTS y Content Engine permanecen **NOT IMPLEMENTED**; no se presentaron como si fueran integraciones reales.

### 24.7 Resultado de implementación de la orden 23

| Entregable | Estado |
|---|---|
| Auditor Agent prioritario | PASS |
| Event Store | PASS |
| Game Registry | PASS |
| KPI de retención | PASS/LOCAL ONLY |
| DAU/WAU/D1/D7/D30 | PASS/LOCAL ONLY |
| Autopilot seguro | PASS limitado a health check |
| Watchdog | PASS básico |
| Kill Switch | PASS con decisión humana para activación |
| Dinero real | OFF |
| YouTube API | BLOCKED |
| Avatar 3D | NOT IMPLEMENTED |
| TTS | NOT IMPLEMENTED |
| Datos de retención fabricados | PROHIBIDO; no se generaron |

## 25. Próxima validación

La siguiente prueba de aceptación debe crear o usar una cuenta de prueba aislada, registrar sesiones en días distintos, confirmar que la clave idempotente no duplica eventos, consultar el panel y verificar que D1/D7 se calculan desde datos reales. En paralelo, debe auditarse una ronda real de staging y comprobar que el Auditor Agent produce evidencia sin modificarla.

## 26. Auditoría matemática reproducible posterior a la orden 23

Se ejecutaron `pnpm rtp:all` y `pnpm simulate:50k`. El calculador teórico reportó **23 modalidades con piso matemático mínimo de 85 %**, incluyendo Ruleta piloto 86,486486 %, Ruleta 7 85,714286 %, Jackpot 85,0426 %, Bingo Flash 85,054945 %, Bingo Keno 85,000012 %, Bingo 75 85,15 %, Pick 3 85,1 %, Pick 4 85,18 %, Loto Diario 85,2012 %, Lotería 39 Cinco 85,001138 %, Lotería 49 85,082069 % y Lotería 19 86,480908 %.

La simulación de 50 000 jugadas por modalidad debe interpretarse como **diagnóstica**, no como certificación, porque el simulador de carga no modela todas las reglas de cada modalidad. La salida mostró, entre otros, RTP observados incompatibles con la teoría para Ruletas simplificadas, Bingos, Sueldo de por vida, Pick 3/4 y Loto Express. Esto no se oculta ni se corrige artificialmente: indica que falta alinear el simulador empírico con el motor autoritativo, sus probabilidades y sus tablas de premios.

| Evidencia | Resultado | Interpretación |
|---|---:|---|
| RTP teórico calculado | 23/23 con piso >=85 % | PASS matemático del modelo de tablas actual |
| Simulación 50k | Ejecutada para 23/23 | Diagnóstico; no certifica modalidades cuyo simulador sea simplificado |
| RTP publicado | Debe reconciliarse por modalidad | No debe usarse un único promedio global |
| Certificación independiente | No realizada | Requisito futuro antes de dinero real |

La regla de auditoría queda establecida: una modalidad solo podrá promocionarse como RTP verificado cuando coincidan su regla publicada, cálculo teórico, implementación del motor y simulación que modele todas sus reglas. Los resultados que exceden 100 % en la simulación son señal de cobertura incompleta del simulador y deben bloquear cualquier afirmación comercial sobre rentabilidad o ventaja.

## 27. Validación final de la orden 23

La implementación posterior al diagnóstico se validó con TypeScript, suite completa y build:

| Validación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Suite Vitest | **24 archivos, 73 pruebas aprobadas** |
| Prueba de limpieza de usuario temporal | PASS tras cambiar FKs analíticas/operativas a `ON DELETE SET NULL` |
| `pnpm rtp:all` | PASS: 23 modalidades con piso teórico >=85 % |
| `pnpm simulate:50k` | PASS como ejecución diagnóstica; discrepancias documentadas |
| `pnpm build` | PASS con advertencias no bloqueantes de asset externo y bundle >500 kB |

La corrección de FKs es relevante para auditoría: los eventos conservan su evidencia después de eliminar el actor de un fixture temporal, pero la relación al usuario queda nula. Esto permite pruebas aisladas sin borrar el historial operativo.

El resultado del documento 23 no equivale a certificación regulatoria, certificación de RNG, garantía de retención ni habilitación de dinero real. La retención todavía requiere observación temporal con usuarios reales del piloto; el sistema muestra `—` cuando la cohorte es insuficiente y no fabrica datos.

## 28. Adaptador YouTube Live

Se añadió `server/youtubeLive.ts` y el procedimiento administrativo `operations.youtubeLiveStatus`. Cuando existen `YOUTUBE_API_KEY` y `YOUTUBE_CHANNEL_ID`, consulta `search.list` de YouTube Data API v3 con `eventType=live`, `type=video`, timeout de 5 segundos y resultado normalizado a `LIVE`, `UPCOMING`, `NONE` o `ERROR`. Cuando faltan credenciales, devuelve `BLOCKED` con explicación y mantiene la configuración local/manual existente.

El panel de Control Center muestra el estado automático y no convierte la respuesta de YouTube en fuente de verdad de rondas. La autoridad sigue siendo el Round Engine. Las credenciales continúan pendientes de suministro/configuración segura; no se almacenan en el cliente ni se escriben en el repositorio.

## 29. Validación del adaptador YouTube Live

La prueba `server/youtubeLive.test.ts` confirma que, sin `YOUTUBE_API_KEY` ni `YOUTUBE_CHANNEL_ID`, el adaptador devuelve `BLOCKED` y no realiza una llamada externa. La validación posterior registró **25 archivos y 74 pruebas aprobadas**, además de `pnpm check` y `pnpm build` satisfactorios. Las advertencias del build permanecen no bloqueantes: asset externo no resuelto durante compilación y bundle principal superior a 500 kB.


## 31. Ejecución de la orden maestra 24 — transformación Event Engine

### 31.1 Alcance aplicado

La orden 24 se implementó como una ampliación modular sobre el monolito existente. No se reemplazó el motor matemático, no se duplicó la autoridad del backend y no se activaron pagos, retiros, conversión monetaria, Yape, KYC real, AML real ni las credenciales de YouTube que permanecen pausadas por decisión del propietario.

La solución conserva las rondas persistidas como fuente oficial y añade una proyección `MjpEvent` para que TV, overlay, PWA y futuras interfaces consuman una abstracción común de evento. El evento incluye identificador, juego, ventanas de participación, estado explícito, versión de reglas, configuración de QR, verificación y estado de recuperación.

### 31.2 Event Engine

Se creó `shared/eventEngine.ts`. La proyección traduce los estados persistidos actuales (`draft`, `open`, `locked`, `drawn`, `settled`, `archived`) a estados de evento (`SCHEDULED`, `OPEN`, `LOCKED`, `RESULT_VERIFIED`, `COMPLETED`, entre otros). El contrato conserva `virtualOnly: true` y enlaza el QR y la verificación con el mismo identificador público de ronda.

La máquina de estados del evento rechaza saltos no autorizados, por ejemplo pasar directamente de `OPEN` a `RESULT_VERIFIED`. La implementación no sustituye aún el enum persistido de la base de datos; actúa como capa formal de dominio y presentación compatible con el esquema actual.

### 31.3 Scheduler Engine

Se creó `server/schedulerEngine.ts` y el procedimiento administrativo `operations.scheduleProposal`. El scheduler recibe frecuencia, duración, prioridad, horario preferente, categoría y separación mínima. Genera bloques con apertura, juego, resultado y transición; detecta parámetros inválidos y ventanas excedidas.

La propuesta devuelve `requiresApproval: true` y `published: false`. El sistema puede sugerir una programación, pero no publica una pauta nueva automáticamente durante el piloto. Se añadió `ProgramSchedulePanel.tsx` a Operaciones para revisar la propuesta en modo humano/asistido.

### 31.4 TV Client y Second Screen

`server/broadcast.ts` ahora devuelve la proyección `event` junto con el estado público de la ronda. `/tv` y el overlay muestran la fase del Event Engine, mientras el QR continúa asociado al identificador de ronda/evento y el enlace de verificación permanece público. YouTube sigue siendo únicamente un canal audiovisual; el estado autoritativo procede de MJP.

### 31.5 Interaction Engine

Se creó `shared/interactionEngine.ts`. Las interacciones distinguen `ENTERTAINMENT_INTERACTION` de `GAME_PARTICIPATION` y soportan tipos como trivia, encuesta, elección, Sí/No, color, par/impar, votación y reacción. Las interacciones creadas por este contrato son virtuales y no alteran resultados, premios, balances ni reglas oficiales.

### 31.6 Avatar y Content Engine

Se creó `shared/avatarScripts.ts` con guiones deterministas en español para inicio, cierre, sorteo, resultado verificado, transición e interacción. Cada guion declara `canChangeOfficialState: false`. Esto implementa la arquitectura de presentación sin afirmar que exista un Avatar 3D o una voz TTS real.

`shared/experienceEngine.ts` aporta vistas de experiencia (`BEFORE_EVENT`, `OPEN`, `LOCKED`, `DRAWING`, `RESULT`, `COMPLETED` y `CONTINGENCY`) y mensajes estructurados a partir del estado del evento. No utiliza un LLM ni permite que contenido generado modifique el dominio oficial.

### 31.7 Contingencia y último estado confirmado

Se creó `shared/contingencyEngine.ts` para representar fallos de conexión, YouTube, avatar, QR, backend, transmisión, cliente TV o sincronización. El estado de contingencia conserva el último snapshot confirmado y muestra un mensaje explícito. No genera resultados nuevos ni mantiene la apariencia de que un evento continúa activo cuando no puede confirmarse.

### 31.8 Pruebas de la orden 24

La validación posterior a estos cambios terminó con **27 archivos de prueba y 80 pruebas aprobadas**. Se añadieron pruebas para la proyección Event Engine, transiciones inválidas, Scheduler no publicador, separación de interacción, subordinación del avatar, Experience Engine y Contingency Engine. También se repitió la suite de integración existente para rondas, liquidación virtual, QR, autenticación, seguridad, API y modalidades.

Las pruebas no constituyen certificación regulatoria, prueba de carga de producción ni validación audiovisual de YouTube. Las credenciales oficiales de YouTube continúan sin configurarse.

### 31.9 Archivos nuevos y modificados de esta orden

| Archivo | Tipo de cambio |
|---|---|
| `shared/eventEngine.ts` | Nuevo contrato y proyección de eventos |
| `shared/interactionEngine.ts` | Nueva separación de interacción y participación |
| `shared/avatarScripts.ts` | Guiones deterministas subordinados al evento |
| `shared/experienceEngine.ts` | Vistas y contenido estructurado por estado |
| `shared/contingencyEngine.ts` | Último estado confirmado y causas de contingencia |
| `server/schedulerEngine.ts` | Propuesta de programación por bloques |
| `shared/eventExperience.test.ts` | Pruebas Event, Scheduler, Interaction, Avatar y Experience |
| `shared/contingencyEngine.test.ts` | Pruebas de contingencia y snapshot confirmado |
| `server/broadcast.ts` | Proyección `event` para TV/overlay/PWA |
| `server/routers.ts` | Procedimiento administrativo `scheduleProposal` |
| `client/src/components/ProgramSchedulePanel.tsx` | Panel de propuesta y revisión humana |
| `client/src/pages/Operations.tsx` | Integración del panel Scheduler |
| `client/src/pages/BroadcastPage.tsx` | Visualización del estado Event Engine |

### 31.10 Limitaciones explícitas

Avatar 3D, TTS, contenido generativo, WebSocket/SSE, publicación automática de programación y automatización integral de Heartbeat no se declaran implementados como producción. El sistema dispone de contratos, propuestas y fallback local, pero estos elementos requieren proveedor, activos, pruebas operativas o una decisión humana. YouTube Live permanece en `BLOCKED` sin API key ni channel ID.


## 19. Implementación de MjpTvManifest v1 — actualización 25 de agosto de 2026

Se implementó el contrato compartido `shared/tvManifest.ts` con versión explícita `mjp-tv-manifest-v1`. El contrato conserva a `MJP_CORE` como fuente autoritativa, incorpora identificador de evento, juego, estado, reglas, ventana temporal, cuenta regresiva basada en servidor, participación, resultado, verificación pública, recuperación y el bloqueo declarativo `VIRTUAL_CREDITS`/`virtualOnly`/`creditsOnly`. La proyección no habilita depósitos, retiros, conversión a soles ni pagos.

El backend de `server/broadcast.ts` construye el manifest a partir de la ronda y del ruleset persistidos, y `server/routers.ts` expone `broadcast.manifest` como lectura pública. El overlay consulta el manifest y usa su resultado cuando está disponible; la ronda queda como respaldo de transporte. `/tv` consulta el manifest de la ronda pública activa y muestra estado de conexión, secuencia, cuenta regresiva, participantes, evidencia y el límite de créditos virtuales.

Se añadió `ManifestTestPanel`, accesible únicamente con `?manifestTest=1` en desarrollo. Sus fixtures son deterministas, viven solo en memoria del navegador y no llaman a la base de datos. Permiten inspeccionar `SCHEDULED`, `OPEN`, `LOCKED`, `DRAWING`, `RESULT_VERIFIED`, `COMPLETED` y `CANCELLED`; la prueba de contingencia se representa localmente con `recovery.mode = CONTINGENCY`. No se presenta como operación oficial.

| Elemento | Estado | Evidencia |
|---|---|---|
| Contrato MjpTvManifest v1 | PASS | `shared/tvManifest.ts` y pruebas dedicadas |
| Endpoint público `broadcast.manifest` | PASS | `server/routers.ts` |
| Construcción desde ronda/ruleset | PASS | `server/broadcast.ts` |
| TV Client /tv | PASS | Consulta del evento activo y panel de estado |
| Overlay /overlay/:roundId | PASS | Consumo del manifest y fallback de ronda |
| Fixtures de estados | SIMULATED / LOCAL ONLY | `ManifestTestPanel` y `createManifestFixture` |
| Dinero real, Yape, retiros, conversión | OFF | No se modificó ningún flujo monetario |
| Integración oficial YouTube | BLOCKED | Credenciales y decisión de alcance siguen pausadas |

La revisión visual confirmó que `/tv` conserva su guía táctil inicial y la pantalla de contingencia; el laboratorio queda oculto en producción y solo aparece mediante la bandera de desarrollo indicada. La ejecución posterior registró **29 archivos y 86 pruebas aprobadas**, además de build de producción aprobado con las advertencias preexistentes de asset y tamaño de bundle.


## 20. Revisión visual de estados TV/overlay — actualización 25 de agosto de 2026

La revisión visual de `/tv?signal=down` y `/overlay/RP-R-JQXXKIYB` confirma que el overlay presenta el indicador de `Manifest conectado`, la secuencia del evento, el estado bloqueado y el nuevo panel operativo de datos del manifest. La vista mantiene la leyenda de créditos virtuales y la ausencia de dinero real. En `/tv`, la guía táctil inicial aparece en el primer acceso y mantiene el comportamiento previamente implementado; el aviso de contingencia sigue visible detrás de la guía sin bloquear el flujo del usuario una vez que la guía se cierra.

La actualización incorpora transiciones cortas, pulso de conexión, shimmer de carga y entrada animada de notificaciones, todos anulables por `prefers-reduced-motion` y por la preferencia interna de reducción de movimiento. Las notificaciones de `/tv` se disparan solo cuando cambia la secuencia o el identificador del evento recibido; no se generan por cada polling sin cambio. Esto evita ruido visual y conserva el carácter informativo del canal.

La revisión responsive a 390×844 px confirma que `/tv` conserva la jerarquía de contingencia, el estado del manifest, la guía de acceso y el historial sin desbordamiento horizontal visible. El overlay móvil muestra un estado de carga centrado con indicador de progreso y mensaje de sincronización; el panel de estadísticas queda disponible después de la carga, respetando el ancho de pantalla. La guía táctil de `/tv` puede cubrir temporalmente el contenido en el primer acceso, tal como estaba diseñado, y no constituye un error de layout.


## 21. Mejora visual TV/overlay y estadísticas — actualización 25 de agosto de 2026

Se mejoraron los estados de conexión mediante el componente reutilizable `ManifestConnectionStatus`, con iconos diferenciados, pulso de conexión, animación de carga, mensaje de respaldo y reconocimiento visual del origen `MJP CORE`. Las animaciones respetan `prefers-reduced-motion` y la preferencia interna de reducción de movimiento.

`/tv` ahora emite una notificación accesible y temporal cuando cambia la secuencia del manifest o cuando aparece un nuevo identificador de evento. La secuencia del backend se construye de forma estable a partir de la apertura de la ronda y del estado público proyectado, evitando avisos por cada polling sin cambios. Se corrigió además una divergencia detectada durante la auditoría: las rondas cuyo cierre temporal ya venció se proyectan como `LOCKED` también en el manifest.

`/overlay/:roundId` incorpora `ManifestStatsPanel`, con estado, cuenta regresiva, participantes confirmados, disponibilidad y firma del QR, resultado, ruleset, canal de recuperación, secuencia, hora de actualización y modo `VIRTUAL_CREDITS`, todos derivados del manifest. La revisión visual de escritorio confirmó el panel y el indicador conectado; la revisión móvil confirmó carga centrada y ausencia de desbordamiento horizontal visible. La guía táctil inicial de `/tv` continúa apareciendo en el primer acceso por diseño.


## Addendum 2026-08-26 — validación TV, claim y modelo financiero

### Cobertura E2E

Las 90 pruebas del checkpoint anterior no representaban por sí solas una cobertura completa del navegador. En esta fase se separaron los alcances: **91 pruebas aprobadas en la suite Vitest principal** y **5 pruebas E2E aprobadas mediante `pnpm test:e2e`**, cubriendo API HTTP, selección en vivo/en línea, cambio de modo, salida al portal, persistencia de tema y exportación PNG con marca. Los casos de navegador se excluyen de la suite principal cuando no se activa `RUN_BROWSER_E2E=1`. La validación física en Smart TV, Android TV, tablet y celular requiere una matriz de hardware y QA humano; Chromium automatizado no la sustituye.

### Exportación y personalización

La marca textual y el interruptor de marca de agua se persisten inmediatamente en `localStorage`. La exportación genera un PNG local desde el navegador, sin subir datos del manifest a un servidor. La prueba automatizada confirma la descarga en Chromium; la compatibilidad con Safari, Firefox, WebView de Android, navegadores de Smart TV y distintos motores de fuentes debe validarse en dispositivos reales.

### Claim transaccional

`closeAndDrawRound` abre una transacción y ejecuta `SELECT id FROM game_rounds WHERE publicId = ? FOR UPDATE` antes de recalcular el resultado, premios y movimientos. Si la ronda ya está `settled`, conserva la respuesta de evidencia existente; esto protege contra doble liquidación lógica. Se añadió una prueba dedicada que confirma el inicio de la transacción y la reclamación previa. Falta probar concurrencia real en MySQL/TiDB de staging, incluyendo deadlocks, timeouts, reintentos y rollback.

### Modelo financiero peruano 2026

Se generaron `MJP_MODELO_FINANCIERO_PERU_2026.md` y `MJP_MODELO_FINANCIERO_PERU_2026.xlsx`. La UIT 2026 de S/ 5,500, la tarifa publicada de Yape Empresa de 2,95 % y la referencia SUNAT de 12 % para juegos a distancia se incorporan como datos externos o sensibilidades claramente etiquetadas. Nómina, soporte, marketing, cloud, certificación y homologación permanecen como supuestos editables, no como cotizaciones. El modelo no activa ni contabiliza dinero real, cobros, retiros o conversión.

### Estado de fase

| Entregable | Estado | Evidencia |
| --- | --- | --- |
| Cambio de modo y salida TV | PASS | E2E de navegador |
| Persistencia de tema | PASS | E2E tras recarga |
| Exportación PNG con marca | PASS en Chromium | E2E de descarga local |
| Claim de cierre | IMPLEMENTED / NEEDS STAGING | Bloqueo de fila e idempotencia lógica |
| Modelo financiero 2026 | DELIVERED / PRELIMINARY | Markdown + XLSX parametrizable |
| Smart TV / Android TV físico | NOT TESTED | Requiere hardware disponible |
| Operación monetaria | BLOCKED | Pagos, retiros, conversión, KYC/AML real y autorización regulatoria desactivados |


### Matriz responsive automatizada — 2026-08-26

Se añadió y ejecutó una prueba E2E específica para el selector TV en 1280×720, 1024×768, 768×1024 y 390×844. El selector de modo y el flujo de entrada en línea resultaron utilizables en las cuatro dimensiones. La ejecución `pnpm test:e2e` terminó con **2 archivos y 6 pruebas aprobadas**. Esta evidencia cubre renderizado automatizado en Chromium; la prueba física con Smart TV, Android TV, tablet y celular concretos sigue requiriendo equipos disponibles y revisión humana.


### Cierre de validación física — 2026-08-26

El propietario confirmó que la revisión interactiva del flujo TV resultó satisfactoria en los dispositivos contemplados: Smart TV, Android TV, tablet y celular. Se cerró el pendiente de compatibilidad en `todo.md`. Esta conclusión se basa en la confirmación del propietario; para una auditoría externa formal conviene conservar además modelo de dispositivo, sistema operativo, navegador, versión, resolución, fecha, capturas y observaciones por caso.


## Fase adicional — dispositivos, concurrencia y revisión RNG/regulatoria

Se añadió `docs/DEVICE_COMPATIBILITY_MATRIX.md` con fichas para Smart TV, Android TV, Google TV, laptop/PC, tablet, celular y OBS, incluyendo requisitos, casos de aceptación, riesgos y formato de evidencia. La confirmación del propietario de pruebas satisfactorias se conserva como evidencia de usuario, pero una auditoría externa debe registrar modelo, sistema operativo, navegador, versión, resolución, fecha, conectividad, capturas y logs.

Se añadió `scripts/run-concurrency-staging.mjs` y `docs/STAGING_CONCURRENCY_PROTOCOL.md`. El runner incorpora guardas para impedir el uso accidental de la base del piloto. Se ejecutó sin `STAGING_DATABASE_URL` y devolvió `BLOCKED`; no realizó consultas. Por tanto, la concurrencia real contra MySQL/TiDB de staging sigue pendiente y no se presentan métricas de rendimiento inventadas.

Se añadió `docs/RNG_REGULACION_PERU_INFORME_PRELIMINAR.md` y las notas de investigación `docs/research-notes-rng-regulacion-2026.md`. El informe distingue HMAC-SHA-256, rejection sampling, compromiso/revelación de semilla y verificación reproducible de una certificación independiente. También documenta la Ley N.° 31557, Ley N.° 31806, D.S. N.° 005-2023-MINCETUR, el trámite oficial de homologación y las referencias técnicas NIST, GLI e ISO/IEC 17025. Ninguna fuente se interpreta como autorización del piloto.


## Orden 25 — MJP Experience OS (cierre técnico de esta fase)

La Orden 25 se implementó de manera incremental sobre el monolito modular existente. Se reutilizaron el Game Core, Event Engine, Event Store, broadcast, manifest, QR HMAC, contingencia, watchdog y Kill Switch; no se creó una segunda fuente de verdad para rondas, resultados, reglas, premios o RTP.

Se añadieron estados, fases y plantillas formales al Experience Engine; validaciones y lifecycle `DRAFT → APPROVED → PUBLISHED` al Scheduler; contexto de experiencia al `MjpTvManifest v1`; QR contextual con expiración y sesión efímera firmada; contratos seguros para autonomía, contenido y contingencia; y la ruta administrativa `/control-room`.

Evidencia: `pnpm check` aprobado; suite completa con **100 pruebas aprobadas y 4 omitidas** en **34 archivos aprobados y 1 omitido**; `shared/order25.e2e.test.ts` recorre Scheduler→Event→Experience→Manifest y simula 1000 ciclos; `pnpm build` aprobado; revisión visual de `/control-room` y `/tv` completada. Las pruebas omitidas corresponden a la suite de navegador condicionada. La concurrencia MySQL/TiDB real contra staging sigue **BLOCKED** por ausencia de `STAGING_DATABASE_URL` y no se inventan métricas.

El piloto continúa exclusivamente en créditos virtuales. Autonomy Engine no puede modificar resultados, reglas, premios, RTP, históricos ni activar dinero real. Avatar 3D, TTS, WebSocket/SSE, YouTube API oficial, persistencia completa PROGRAM/BLOCK/EXPERIENCE, certificación RNG y operación regulada permanecen fuera de alcance o bloqueados hasta revisión independiente.

Documentos asociados: `MJP_ORDER25_FINAL_AUDIT.md`, `MJP_SYSTEM_AUDIT_ORDER25.md`, `docs/MJP_EXPERIENCE_OS.md`, `docs/SCHEDULER.md`, `docs/SECOND_SCREEN.md`, `docs/AUTONOMY.md`, `docs/CONTENT_ENGINE.md`, `docs/CONTINGENCY.md`, `docs/REALTIME.md`, `docs/CONTROL_ROOM.md`, `docs/GAME_MATHEMATICS.md` y `docs/TEST_MATRIX.md`.


## Orden de transformación MiLukita — corte 26 de agosto de 2026

Se incorpora una primera ola de rebranding reversible hacia MiLukita. La marca visible se desacopla de los identificadores técnicos MJP: el header, home, PWA, TV start screen, estado de manifest, exportación PNG y Control Room muestran MiLukita; Lukita queda definido como anfitrión no autoritativo; `MjpTvManifest`, `MJP CORE`, prefijos históricos, rulesets, RNG, RTP, premios, resultados, créditos virtuales y rutas permanecen intactos.

Nuevos expedientes: `MILUKITA_BRAND_SYSTEM.md`, `MILUKITA_REBRAND_AUDIT.md`, `shared/brandSystem.ts` y `shared/brandSystem.test.ts`. Validación del corte: 3 pruebas de marca aprobadas, `pnpm check` y `pnpm build` aprobados. Se conserva la advertencia de bundle grande y el asset hero servido en runtime.

Pendientes externos o bloqueados: disponibilidad/registro de `MiLukita.com`, registro marcario, YouTube, pagos, dinero real, KYC/AML productivo, avatar 3D, voz TTS y certificación independiente. El piloto sigue exclusivamente virtual.


## Corte posterior: MiLukita Control Room y Lukita Script Lab — 26 de agosto de 2026

La identidad visible se amplió con una vista previa protegida en `/control-room` para Header, Home, TV, Overlay, PWA, Manifest y exportación. Se incorporaron `Logo`, `LukitaAvatar`, tokens de color y microinteracciones accesibles.

El nuevo `LukitaScriptsPanel` permite al operador seleccionar disparadores, editar texto y fallback, probar la renderización y restaurar plantillas. La persistencia es local del navegador, no existe publicación automática y los guiones mantienen `canChangeOfficialState: false`; MJP CORE conserva la autoridad sobre estado, resultados, RNG, RTP, premios y créditos virtuales.

La constancia adjunta fue documentada con prudencia: demuestra una solicitud denominativa «MiLukita» de servicio en clase 38, no una resolución final de concesión. El dominio y la situación registral definitiva permanecen pendientes de confirmación documental.

Evidencia técnica del corte: `pnpm check` aprobado, 106 pruebas aprobadas y 4 omitidas en la suite completa, 6 pruebas focalizadas de marca/manifest/guiones aprobadas y `pnpm build` aprobado. La inspección detectó y corrigió una clave React duplicada en Home. El aviso de bundle grande permanece como riesgo de rendimiento ya conocido.


## Actualización: Lukita IA, base administrativa y bundle — 26 de agosto de 2026

La fase posterior al branding amplió `Lukita Script Lab` sin alterar la autoridad del MJP CORE. Se creó la tabla `lukita_script_versions` mediante la migración no destructiva `drizzle/0023_wonderful_jackal.sql`, con versiones activas/archivadas, fallback, actor, origen y timestamps. Los procedimientos `operations.lukitaScripts`, `saveLukitaScript`, `resetLukitaScript` y `generateLukitaVariations` están protegidos por `adminProcedure`.

El asistente IA opera únicamente en servidor mediante `invokeLLM`, usa catálogo dinámico y salida JSON Schema estricta. Genera como máximo tres variantes acotadas; cada una requiere selección y aprobación humana. No puede cambiar estados, resultados, reglas, RTP, premios ni créditos, y no existe publicación automática.

El almacenamiento local dejó de ser la fuente de persistencia. El navegador conserva solo el borrador no guardado; el guardado explícito crea una nueva versión administrativa y archiva la anterior. El origen se conserva como `operator_edit` o `ai_generated`.

El bundle inicial pasó a carga diferida por rutas y chunks de vendor. En el build validado, el entry `index-DuoGsPoV.js` quedó en 243,72 kB (67,34 kB gzip), mientras páginas como Operations, Broadcast y GamePage se entregan separadas. Se mantiene una advertencia no bloqueante de asset resuelto en runtime y debe seguirse optimizando vendor React antes de publicación amplia.

Validación de cierre: `pnpm check` aprobado, `pnpm build` aprobado, 37 archivos de prueba aprobados, 110 pruebas aprobadas y 4 omitidas. La ejecución IA real no se invocó automáticamente durante los tests; la integración queda protegida por el servidor y el filtro estructurado está cubierto por 2 pruebas específicas.


## Actualización: Script Lab con historial, preview y categorías — 26 de agosto de 2026

Lukita Script Lab incorpora historial visual de versiones mediante `operations.lukitaScriptHistory`, con selección de una versión y comparación visible entre el texto anterior y el texto posterior. La consulta se filtra por disparador, categoría, estado y límite; cada versión conserva origen, etiquetas, actor y timestamp.

Las variaciones generadas por IA ahora disponen de una vista previa contextual con el juego de prueba antes de aplicarse al borrador. La vista previa no guarda, no publica y no modifica ninguna entidad autoritativa. Las etiquetas y categorías se almacenan en `lukita_script_versions` mediante `category` y `tagsJson`; la migración 0024 fue corregida para compatibilidad con TiDB usando `varchar(512)` sin default de tipo TEXT.

Se creó `MJP_PROXIMAS_ACTIVIDADES.md`, que separa el cierre técnico, la gobernanza editorial, rendimiento, dispositivos, staging, certificación independiente y límites de monetización. El documento mantiene como pendientes reales la concurrencia contra staging aislado, las pruebas en hardware físico, la certificación externa y cualquier futura decisión regulatoria.


## Actualización: informes unificados en PDF y control administrativo — 26 de agosto de 2026

Se añadió `audit_report_artifacts` mediante la migración no destructiva 0026. La tabla conserva versión, título, formato, clave de almacenamiento, URL, hash SHA-256, tamaño, actor y fecha. El contenido binario se almacena mediante el adaptador S3/Forge y no en la base de datos.

Control Room incorpora `AuditReportsPanel` con vista previa del Markdown unificado, generación server-side de PDF y listado histórico de artefactos. Los procedimientos `operations.auditReportPreview`, `operations.generateAuditReportPdf`, `operations.auditReportHistory` y `operations.auditReportDownload` usan `adminProcedure`; las descargas se resuelven con URL firmada. La generación registra un evento operativo y no existe ruta pública para el informe.

El build copia el informe unificado al artefacto de producción para que la vista previa y la generación funcionen también fuera del filesystem de desarrollo. Validación de cierre: `pnpm check`, suite de 39 archivos con 114 pruebas aprobadas y 4 omitidas, y `pnpm build` aprobados. Permanece una advertencia no bloqueante por un asset `/manus-storage/...` que se resuelve en runtime.


## Actualización: Lukita Show aprobado y variantes conceptuales — 26 de agosto de 2026

El propietario seleccionó la propuesta A, **Lukita Show**, como dirección conceptual aprobada. Se congelaron los anchors visuales: anfitriona adulta, apariencia trigueña cálida, sonrisa reconocible, cabello largo oscuro, vestido de presentadora azul profundo con acentos dorados/blancos, micrófono moderno e insignia “L” discreta.

Se prepararon variantes conceptuales para TV, web/avatar, celebración y contingencia. La integración en `LukitaAvatar` consume los assets como recursos visuales secundarios; Lukita no puede cubrir resultado, QR, countdown, estado de ronda ni verificación. La jerarquía de autoridad se mantiene: backend y `MjpTvManifest` prevalecen siempre; el avatar no genera números, decide ganadores, calcula premios, altera rondas o modifica créditos.

La propuesta A fue convertida a JPG y BMP manteniendo 1632×2176 px. La ficha técnica `docs/LUKITA_AVATAR_CONCEPT.md` documenta la aprobación, variantes, límites, expresiones y próximos pasos. Validación: `pnpm check`, suite de 39 archivos con 114 pruebas aprobadas y 4 omitidas, y `pnpm build` aprobados. El modelado 3D definitivo, turnaround, rigging, voz y animación siguen pendientes de una fase posterior.


## Orden 33: dirección de Lukita y combinación recomendada — 26 de agosto de 2026

La Orden 33 confirma que Lukita Show, Lukita Moderna y Lukita Ícono son direcciones conceptuales que deben compararse antes del cierre, permite combinar elementos y prohíbe iniciar modelado 3D definitivo, voz/TTS o integración oficial antes de la aprobación humana.

La recomendación técnica es conservar **Lukita Show A como base**, por su mejor desempeño en TV, eventos y piezas hero, combinando el cabello/silueta simplificada de C para tamaños pequeños y los acabados contemporáneos de B para reducir complejidad y favorecer animación. Se mantienen el vestido azul profundo, acentos dorados/blancos, micrófono y la insignia L discreta.

La recomendación está documentada en `docs/LUKITA_AVATAR_CONCEPT.md` y no equivale a aprobación final del diseño combinado. La jerarquía de autoridad continúa intacta: Lukita consume el MjpTvManifest y no produce resultados, reglas, premios, estados ni movimientos de créditos.


## Orden 34-A — funciones futuras y reconocimiento de Lukita

Se incorpora la Orden 34-A como complemento de la Ficha Maestra. Quedan documentados cuatro niveles de evolución: anfitriona visual, anfitriona audiovisual, presentadora interactiva y personaje audiovisual de marca. Toda respuesta factual futura deberá basarse en datos autorizados y mensajes aprobados.

Se formalizan como prohibiciones permanentes la generación o modificación de resultados, ganadores, RTP, RNG, rulesets, rondas, liquidaciones, wallets, créditos, premios y MjpTvManifest, así como la sustitución de Auditor/Verify o el ocultamiento de información autoritativa. La cadena de autoridad permanece MJP CORE → estado autoritativo → MjpTvManifest → Lukita → presentación.

La guía maestra añade rasgos esenciales, secundarios y variables, tests de silueta/rostro/contexto reducido, reglas de personalidad, evolución tecnológica, guardrails para IA/TTS y criterios de aprobación humana. Modelado 3D, rigging, animación, voz, TTS, lip-sync e integración oficial siguen bloqueados hasta aprobación explícita del propietario.


## Cierre conceptual de la Orden 34

La dirección A+B+C queda consolidada como Lukita Show: base escénica de A, silueta simplificada de C y acabados contemporáneos de B. Se prepararon hojas conceptuales de turnaround y de expresiones/poses para revisar consistencia de cabello, rostro, silueta, vestuario, micrófono, insignia y lenguaje corporal.

Los entregables visuales son conceptuales y no constituyen un modelo 3D ni autorización de producción. Modelado 3D, rigging, animación, voz, TTS, lip-sync e integración oficial permanecen bloqueados hasta aprobación humana explícita. Lukita continúa siendo un consumidor/presentador del MjpTvManifest; MJP CORE conserva toda autoridad sobre estados, resultados, RNG, RTP, rulesets, créditos y verificación.


## Orden 35 — aprobación formal y turnaround técnico 2D

La Ficha Maestra de Lukita queda clasificada como **PENDIENTE DE APROBACIÓN HUMANA**. La combinación A+B+C es una dirección conceptual y no una autorización de producción. Se prepararon un turnaround técnico 2D con vistas frontal, 3/4, lateral, posterior, cuerpo completo, cabeza y silueta, y una hoja facial/de vestuario/expresiones/poses.

La revisión de originalidad registra que las referencias anteriores fueron usadas únicamente como guía de acabado y lenguaje visual; no se deben copiar rostro, anatomía, cabello, vestuario, poses, accesorios o identidad. No se afirma propiedad exclusiva absoluta sin revisión de términos, licencias y eventuales elementos de terceros. Cualquier similitud sustancial requiere estado NEEDS HUMAN/LEGAL REVIEW.

Se documentaron los tests de silueta, rostro y contexto reducido como criterios conceptuales de revisión. Permanecen bloqueados el modelado 3D, texturizado definitivo, rigging, facial rig, animación, captura, lip-sync, TTS y voz definitiva. No se modificó RNG, RTP, rulesets, Draw Engine, Round Engine, Settlement, wallet, créditos, Auditor, Event Store ni MjpTvManifest.


## Decisión posterior del propietario — Lukita A+B+C

El propietario seleccionó la síntesis **A+B+C** como dirección visual preferida. A conserva la presencia cálida de anfitriona televisiva; B aporta el acabado contemporáneo y profesional; C aporta una silueta simple y reconocible en tamaños reducidos. Se congelan como anchors de revisión el rostro adulto amable, cabello oscuro largo y controlado, vestuario #0A1628 con acentos #FFD700 y blanco, micrófono, insignia «L» y rol no autoritativo subordinado a MJP CORE/MjpTvManifest.

La selección aún no se registra como aprobación maestra definitiva. Continúan bloqueados modelado 3D, voz, TTS, animación, lip-sync e integración oficial hasta la confirmación explícita del propietario y la revisión de derechos.


## Aprobación humana de Lukita y autorización de preproducción 3D

El propietario confirmó explícitamente **«Sí, esta es Lukita.»**. La síntesis A+B+C queda registrada como identidad visual conceptual aprobada y el turnaround 2D se congela como `LUKITA-A+B+C-2D-APPROVED-01`.

Se autoriza iniciar la **preproducción 3D y el blockout controlado** usando `docs/LUKITA_3D_PRODUCTION_SPEC.md`. Esta autorización no equivale a aprobación del modelo 3D final ni habilita voz, TTS, lip-sync definitivo, publicación audiovisual o integración oficial. Cualquier modificación de anchors debe crear una nueva versión y volver a revisión humana.

Se mantiene la restricción arquitectónica: Lukita solo presenta datos autorizados mediante `MjpTvManifest`; no genera resultados, decide ganadores, modifica RNG/RTP/rulesets, liquida créditos ni sustituye Auditor/Verify.


## Orden 36 — blockout 3D controlado y estudio web

Se incorporó la Orden 36 como gate formal. El blockout 3D inicial se implementó como una previsualización procedimental en Three.js, con formas base para cuerpo, rostro, cabello, vestuario, micrófono e insignia «L». Su finalidad es comprobar identidad, silueta, proporciones y lectura de las expresiones; no es todavía un modelo artístico final ni un asset listo para publicación.

Se creó la ruta `/lukita-3d`, enlazada desde la portada, con visor interactivo, rotación por arrastre, zoom, modo silueta, selector de expresiones, selector de poses y comparación lado a lado. La carga de `.glb` y `.gltf` se realiza localmente mediante Object URLs; no se persisten ni se suben archivos en esta fase. El contrato compartido `shared/lukita3dSpec.ts` valida la versión aprobada, las poses, expresiones y extensiones permitidas.

La Orden 36 exige comparar frontal, 3/4, lateral, cuerpo completo, silueta sin materiales y rostro sin cabello. La web deja documentado el criterio «¿Sigue siendo claramente Lukita?» y el flujo de discrepancias DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR. Rigging definitivo, facial rig, animación, lip-sync, voz, TTS, publicación e integración oficial en `/tv` continúan bloqueados.

Validación de esta fase: `pnpm check` aprobado, prueba focalizada del contrato 3D con 4 casos aprobados y `pnpm build` aprobado. Se mantiene una advertencia no bloqueante previa por un asset de héroe externo y una advertencia de tamaño del chunk del estudio 3D por Three.js.


## Confirmación final del visor 3D — Preview / Review independiente

El propietario confirmó que el visor web debe permanecer como herramienta independiente de revisión. Se retiró el acceso añadido previamente desde Home. La ruta directa `/lukita-3d` continúa disponible para el equipo de preproducción, pero no forma parte de `/tv`, Home, PWA, Overlay ni de la experiencia pública.

El visor permite visualizar, rotar, ampliar, cambiar poses y expresiones, revisar ángulos y comparar el blockout con una versión local. No modifica el modelo maestro, no tiene autoridad sobre MJP CORE o MjpTvManifest, no genera resultados y no persiste archivos de producción. Su etiqueta y documentación lo clasifican como **Preview / Review**.

La autorización permanece limitada a preproducción y blockout controlado conforme a `LUKITA-A+B+C-2D-APPROVED-01` y `LUKITA_3D_PRODUCTION_SPEC.md`. Si surge contradicción entre ambas referencias, el flujo debe detenerse para decisión humana. Continúan bloqueados rigging definitivo, animación final, voz, TTS, lip-sync e integración oficial.


## Mejoras de validación visual del visor 3D

Se añadieron tres herramientas al entorno aislado `/lukita-3d`: superposición del turnaround 2D aprobado con opacidad ajustable; anotaciones locales con coordenada, categoría y nota para registrar discrepancias; y controles de intensidad y azimut de la luz direccional para inspeccionar volúmenes. Todas están clasificadas como Preview / Review, no modifican el modelo maestro, no persisten cambios en MJP CORE y no se integran con `/tv`, Home, PWA, Overlay ni MjpTvManifest.


## Nuevas funciones del visor 3D — revisión de Orden

Se incorporaron exportación de anotaciones en JSON y PDF, alternancia de material sólido/wireframe y un panel lateral de revisión rápida para poses, expresiones, turnaround, iluminación y anotaciones. La exportación se limita a la sesión local y no modifica el modelo maestro ni MJP CORE. Wireframe se clasifica como inspección preliminar, no como certificación de topología. El fundamento del nombre Lukita se documentó en el sistema de marca sin cambiar el diseño aprobado ni atribuir valor monetario a los créditos virtuales.


## Sesiones y cámaras del visor 3D

El visor independiente incorpora importación validada de sesiones JSON, cámaras Frontal/Lateral/Superior y Reset, además de captura PNG local del canvas con anotaciones activas. La importación solo acepta el esquema de revisión definido y no persiste datos en el servidor. Las cámaras y la captura son herramientas de inspección; no modifican el modelo aprobado ni habilitan integración productiva.


## Contraste, medición y filtrado del visor 3D

Se incorporó un interruptor de tema claro/oscuro, medición relativa de dos puntos basada en la escala provisional de 1,70 m y filtro visual de anotaciones por categoría. La medición es orientativa para comparar el blockout con el turnaround y no certifica la escala de escena, la topología ni las proporciones finales. El filtro no elimina anotaciones. Todo permanece limitado a Preview / Review y sin integración productiva.


## Inspección avanzada del visor 3D

El visor independiente permite exportar JPG de la revisión, guardar y cargar perfiles de iluminación en el navegador, seleccionar iteraciones del historial local de versiones y activar un clipping plane horizontal. Estas funciones son exclusivamente de revisión: no modifican la geometría maestra, no crean entregables productivos y no generan autoridad sobre MJP CORE o MjpTvManifest.


## Candidato y control técnico del blockout

El visor incorpora generación local de versiones candidatas A+B+C, acceso rápido a su historial, presets de iluminación de estudio/exterior/contraluz, comentarios por versión y estadísticas informativas de vértices y polígonos. Las vistas y expresiones se mantienen como controles de validación. Ninguna función eleva una iteración a producción ni modifica el modelo maestro o la autoridad del sistema.


## Orden 39 — Identity Lock y ficha multivista

Se implementó en `/lukita-3d` un Identity Lock Test con cinco modos, checklist de reconocimiento, referencia explícita al turnaround aprobado, exportación de ficha multivista en imagen de alta resolución, exportación/importación de comentarios estructurados por versión y panel reservado para normales, UV y materiales de futuros GLB. El candidato permanece en CANDIDATE / PREVIEW / REVIEW. No se modificaron MJP CORE, MjpTvManifest, juegos, RNG, RTP, créditos ni liquidación; tampoco se inició modelado detallado, rigging, animación, voz, TTS, lip-sync o integración oficial.


## Evidencia de revisión de la Orden 39

Se añadió comparación local lado a lado entre ficha JPG de Candidate 01 y referencia 2D aprobada, barra de progreso del Identity Lock basada en seis criterios y filtro/ordenamiento de comentarios por estado y fecha. Estas funciones son herramientas de evidencia y coordinación artística; no generan aprobación automática ni habilitan producción.


## Orden 40 — cierre del Identity Lock

Se implementó en `/lukita-3d` el cambio de estado de comentarios entre pendiente y resuelto con historial local y fechas; la revisión anotada de diferencias frente a `LUKITA-A+B+C-2D-APPROVED-01`; y la ficha comparativa de alta resolución. El Candidate 01 no fue aprobado automáticamente. Los controles no modifican la referencia maestra y permanecen bloqueados el modelado detallado, rigging, facial rig, animación, voz, TTS, lip-sync, integración `/tv` y publicación. MJP CORE, MjpTvManifest, RNG, RTP, créditos, rondas y liquidación permanecen intactos.


## Revisión de documento ejecutivo — cierre de Candidate 01

Se revisó e incorporó al expediente la presentación ejecutiva del propietario. El documento confirma la referencia maestra `LUKITA-A+B+C-2D-APPROVED-01`, el estado `LUKITA-3D-CANDIDATE-01 — PENDING HUMAN APPROVAL`, la función no autoritativa de Lukita y la separación estricta entre preproducción y producción.

El visor `/lukita-3d` se considera suficiente para la revisión humana definitiva. No se incorporan nuevas funciones salvo correcciones derivadas de observaciones concretas. Permanecen bloqueados modelado detallado, rigging, facial rig, animación, voz, TTS, lip-sync, integración oficial y publicación. MJP CORE, MjpTvManifest, juegos, RNG, RTP, créditos, rondas y liquidación no fueron modificados.


## Observaciones humanas — Candidate 01

El propietario registró dos correcciones pendientes: revisar proporciones del rostro y revisar proporciones/volumen del cabello frente a `LUKITA-A+B+C-2D-APPROVED-01`. Se cargaron como comentarios locales PENDIENTE en el visor, sin alterar el candidato automáticamente.

Se añadió zoom sincronizado entre la referencia 2D y el modelo 3D para facilitar la comparación. El control es exclusivamente visual y permanece en `/lukita-3d`; no modifica MJP CORE, MjpTvManifest ni ningún estado productivo.


## Registro de discrepancia crítica — revisión humana del Candidate 01

El propietario indicó que la presentación de `LUKITA-A+B+C` era insatisfactoria y que el modelo mostrado no se parecía a Lukita. La captura evidenció que `mrs.incredible_-_elastigirl.glb` fue cargado como versión seleccionada; ese asset no corresponde a Lukita, no es una versión autorizada del personaje y queda invalidado para el expediente. La discrepancia se clasifica como **FAIL / NEEDS HUMAN DECISION**.

Se detiene cualquier avance de producción. El blockout procedimental se ajusta únicamente hacia una silueta adulta, atlética, alargada y natural, sin copiar literalmente a Elasticgirl. La referencia 2D maestra no se modifica. Se mantiene `LUKITA-3D-CANDIDATE-01` en `PENDING HUMAN APPROVAL` y el visor en `PREVIEW / REVIEW`. Se refuerza el rechazo de archivos de terceros o sin procedencia documentada. Cualquier corrección futura debe seguir **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**.


## Gate de aprobación técnica del blockout — LUKITA-3D-BLOCKOUT-TECH-APPROVED-01

Por orden expresa del propietario, `LUKITA-3D-CANDIDATE-01` queda autorizado exclusivamente como blockout técnico de preproducción. Esta autorización permite continuar de forma controlada con el refinamiento de proporciones, modelado facial, cabello, vestuario, accesorios, topología y preparación técnica.

La autorización no representa aprobación estética definitiva ni convierte el candidato en una versión `FINAL`, `PRODUCTION`, `PUBLIC` u `OFFICIAL`. La identidad estética permanece abierta a modificaciones controladas. `LUKITA-A+B+C-2D-APPROVED-01` continúa siendo la referencia maestra.

La interfaz registra la decisión como `APPROVED · TECHNICAL BLOCKOUT ONLY` en almacenamiento local de revisión. Este registro no modifica MJP CORE ni ningún estado de rondas, juegos, RNG, RTP, créditos, liquidación o MjpTvManifest. Toda modificación de rostro, silueta, proporciones o elementos distintivos debe documentarse y volver a validar mediante Identity Lock Test.

Continúan bloqueadas la integración en `/tv`, Home, PWA, Overlay, publicación pública, voz, TTS, lip-sync definitivo y animación final. El visor permanece aislado como Preview / Review.


## Orden 41 — Refinamiento visual controlado de Lukita

Se implementó una primera pasada de refinamiento visual sobre el blockout procedimental de `LUKITA-3D-CANDIDATE-01`. La actualización mejora la lectura de anfitriona adulta mediante rostro simplificado con cejas, nariz y boca, cabello con marco facial y volumen posterior, hombros, cinturón dorado, detalles de calzado, manos visibles, micrófono e insignia L. La dirección de proporciones atlética, natural y profesional se conserva.

El resultado sigue siendo una candidata de preproducción y no un modelo final. Se mantiene como referencia obligatoria `LUKITA-A+B+C-2D-APPROVED-01` junto con `LUKITA_3D_PRODUCTION_SPEC.md`. La identidad estética permanece abierta y toda modificación de rostro, cabello, silueta, proporciones o elementos distintivos debe pasar nuevamente por Identity Lock Test.

No se utilizaron ni autorizaron assets de terceros. Permanecen bloqueados rigging definitivo, facial rig definitivo, animación, voz, TTS, lip-sync, publicación e integración con `/tv`, Home, PWA u Overlay. No se modificaron MJP CORE, MjpTvManifest, RNG, RTP, reglas, créditos ni liquidación.

**Estado:** nueva versión visual candidata, pendiente de revisión humana.


## Orden 42 — Mapa Maestro de Agentes MJP

Se creó `docs/MJP_MASTER_AGENT_MAP.md` como fuente documental de gobernanza para agentes actuales y futuros. El documento distingue permisos READ, WRITE, PROPOSE y EXECUTE; separa agentes implementados, limitados, preparados y conceptuales; define la cadena de autoridad de MJP CORE; documenta prohibiciones, trazabilidad, eventos versionados, escalamiento y kill switches; y mantiene a Lukita como Host Visual Agent no autoritativo.

La clasificación se realizó contra la evidencia disponible en el repositorio y no convierte módulos de soporte en agentes autónomos. El Auditor Agent, Watchdog y Supervisor independientes permanecen conceptuales o no implementados. No se modificaron RNG, RTP, rulesets, rondas, settlement, wallet, MjpTvManifest, juegos, pagos, retiros, `/tv`, PWA ni el visor de Lukita.

**Estado:** Orden 42 documental implementada; pruebas multiagente formales pendientes hasta que existan agentes runtime independientes.


## Resiliencia de Preview / Review y consulta de gobernanza — 26 de agosto de 2026

Se añadió un mock 3D procedural local en `/lukita-3d` para validar la interfaz sin depender de una API externa. El visor diferencia `Mock local listo`, `Modelo local cargado`, `Cargando modelo…` y `Fuente no disponible · respaldo activado`. Ante un error de carga, incluido un posible límite temporal de peticiones, conserva la sesión, activa el respaldo y realiza como máximo un reintento automático; el revisor conserva un botón de reintento manual.

Se añadió `AgentPermissionsPanel` al `Control Room`. El panel permite filtrar por estado, seleccionar agentes y consultar READ, WRITE, PROPOSE, EXECUTE, autoridad final, eventos y prohibiciones. Es exclusivamente de consulta: no concede permisos, no modifica allowlists y no cambia la autoridad de MJP CORE. Se creó el contrato compartido `shared/agentMap.ts` y pruebas focalizadas para el mapa y la política de recuperación.

Validación: `pnpm check`, suite completa con 128 pruebas aprobadas y 4 omitidas, build de producción aprobado y revisión responsive de `/lukita-3d` y `/control-room`. El acceso a Control Room continúa protegido por autenticación y rol administrativo.


## Controles de iluminación, fondo y captura — 26 de agosto de 2026

El visor `/lukita-3d` incorpora controles básicos de inspección de iluminación mediante intensidad, ángulo y presets de estudio, exterior de día y contraluz. También permite cambiar el color de fondo con un selector personalizado y presets marino, claro y silueta para mejorar el contraste durante la revisión.

Se añadió el botón **Capturar y descargar modelo actual**, que genera una imagen PNG local del canvas 3D actual con el fondo seleccionado y las anotaciones visibles. La captura utiliza el buffer del renderer y no sube archivos al servidor. Se mantiene disponible la captura PNG con anotaciones, JPG y exportaciones previas.

Estas funciones son herramientas de evidencia de Preview / Review. No modifican el modelo maestro, no crean una versión productiva, no otorgan autoridad a Lukita y no alteran MJP CORE, MjpTvManifest, RNG, RTP, reglas, rondas, wallet o liquidación.

## Orden posterior a auditoría 43-B/44 — estado de implementación

Se aisló la telemetría del flujo principal con deduplicación, backoff y descarte seguro ante 429; se añadió prueba unitaria específica. El contrato `manifest.qr` ahora es la única proyección pública consumida por `/tv` y `/overlay`, conservando el endpoint QR como adaptador compatible.

Se implementó `server/supervisedWorker.ts` con claim idempotente por tarea/cubeta UTC, respeto del kill switch `STOPPED`, eventos operacionales y reutilización del ciclo autorizado. La autonomía de 24 horas sigue sin certificación física u operativa externa.

La descarga local usa Blob con fallback Safari iOS/navegadores sin `download`; la estrategia Android TV fue probada a nivel unitario. La auditoría emulada de `/tv`, `/lukita-3d` y `/overlay` se realizó en Chromium a 1280×720 y 390×844. No se dispone de hardware Safari iOS ni Android TV, por lo que no se declara certificación física.

Validación: `pnpm check` exit 0; `pnpm test -- --run` exit 0 con 44 archivos aprobados, 1 omitido, 138 pruebas aprobadas y 4 omitidas; `pnpm build` exit 0. Permanecen warnings no bloqueantes por asset externo no resuelto en build y chunk del visor 3D mayor a 500 kB.
