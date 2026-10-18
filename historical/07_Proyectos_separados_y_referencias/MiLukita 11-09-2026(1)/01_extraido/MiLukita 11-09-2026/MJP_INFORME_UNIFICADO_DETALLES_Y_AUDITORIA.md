# MiLukita — Informe unificado de detalles y auditoría

**Proyecto:** MiLukita / MJP CORE  
**Repositorio:** `ruleta-peru-online`  
**Fecha de consolidación:** 26 de agosto de 2026  
**Autor:** Manus AI  
**Estado operativo:** Piloto exclusivamente virtual; créditos sin valor monetario; pagos, retiros, conversión y operación monetaria desactivados

## Propósito del archivo único

Este documento reúne en un solo archivo descargable los informes de detalle, auditoría técnica, estado situacional, cierre de Orden 25, auditoría de rebranding MiLukita y próximas actividades. Se conservan las referencias históricas MJP/Multi Juegos Perú cuando son necesarias para trazabilidad, código, migraciones, auditoría o compatibilidad; la marca visible vigente es **MiLukita** y **Lukita** es únicamente el anfitrión no autoritativo.

> El backend y MJP CORE conservan la autoridad sobre rondas, resultados, reglas, RTP, premios virtuales, créditos, auditoría y liquidación. Ninguna interfaz de marca ni propuesta de IA puede modificar esos elementos.

## Resumen ejecutivo vigente

El proyecto es una plataforma web full-stack de entretenimiento interactivo con juegos virtuales, verificación pública, PWA, experiencia TV/Overlay, QR verificable, Control Room, Experience OS y Script Lab administrativo. La última ampliación incorpora historial visual de versiones, comparación antes/después, preview contextual de variaciones IA y categorías/etiquetas persistidas en la base de datos administrativa.

La última validación registrada informa **111 pruebas aprobadas y 4 omitidas**, `pnpm check` aprobado y `pnpm build` aprobado. La concurrencia real contra staging continúa diferida porque no se dispone de una base aislada configurada. Las pruebas en hardware físico, la certificación independiente de RNG, la integración oficial de YouTube y cualquier monetización permanecen pendientes o bloqueadas.

## Índice de anexos

| Anexo | Documento incluido | Finalidad |
|---:|---|---|
| 1 | `MJP_MASTER_IMPLEMENTATION_AUDIT.md` | Auditoría maestra del sistema, arquitectura, juegos, seguridad, TV/PWA, matemáticas y bloqueos |
| 2 | `MJP_ORDER25_FINAL_AUDIT.md` | Cierre de Experience OS, Scheduler, Control Room, manifest y validaciones de Orden 25 |
| 3 | `MJP_ESTADO_SITUACIONAL_AUDITORIA_EXHAUSTIVA.md` | Estado situacional exhaustivo, evidencias y riesgos del proyecto |
| 4 | `MILUKITA_REBRAND_AUDIT.md` | Auditoría de la transformación de marca y compatibilidad de identificadores |
| 5 | `MJP_PROXIMAS_ACTIVIDADES.md` | Próximas actividades, responsables, dependencias, criterios y cronograma |

## Lectura recomendada

Para una revisión ejecutiva, leer primero este resumen y el Anexo 5. Para una auditoría técnica completa, revisar los anexos en orden. Las afirmaciones de cada anexo deben interpretarse según su fecha de corte y estado declarado; este archivo no convierte una simulación en certificación ni una preparación regulatoria en autorización de operación.

---

# ANEXO 1 — Auditoría maestra de implementación

**Fuente:** `MJP_MASTER_IMPLEMENTATION_AUDIT.md`



---

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


---

# ANEXO 2 — Auditoría final de Orden 25

**Fuente:** `MJP_ORDER25_FINAL_AUDIT.md`

# MJP Order 25 — Informe final de auditoría técnica

**Fecha de corte:** 26 de agosto de 2026  
**Proyecto:** `ruleta-peru-online` / Multi Juegos Perú  
**Estado operativo:** piloto de créditos virtuales; dinero real, pagos y retiros desactivados.  
**Regla de interpretación:** `CODE_EXISTS` no equivale a `PRODUCTION_READY`.

## Resumen ejecutivo

La Orden 25 fue implementada como una ampliación incremental del monolito modular existente. Se reutilizaron el Game Core, Event Engine, manifest TV, QR HMAC, Event Store, Scheduler previo, contingencia, watchdog y Kill Switch. No se introdujo una segunda fuente de verdad para resultados, reglas, premios o RTP.

La ampliación incorpora un Experience Engine formal con estados, fases y plantillas; validaciones de Scheduler con lifecycle `DRAFT → APPROVED → PUBLISHED`; contexto de experiencia en `MjpTvManifest v1`; QR contextual con expiración y sesión efímera firmada; contratos seguros para autonomía y contenido; contingencia con preservación explícita de la autoridad del resultado; y una ruta `/control-room` protegida por rol administrativo.

La validación técnica final de esta fase reporta **100 pruebas aprobadas y 4 omitidas**, en **34 archivos aprobados y 1 archivo omitido**. El build de producción terminó correctamente. La concurrencia real contra base de staging permanece bloqueada porque no se ha proporcionado una `STAGING_DATABASE_URL` aislada; no se inventan métricas de rendimiento.

## A. Estado anterior

Antes de la Orden 25 ya existían Game Core, Event Engine, broadcast TV/overlay, `MjpTvManifest v1`, QR firmado por ronda, Event Store, control operativo, watchdog básico, Kill Switch, Scheduler de propuestas, contingencia y analítica no-PII. El Scheduler era principalmente in-memory; no existía un contrato formal de Experience OS ni una ruta consolidada de Control Room.

## B. Estado posterior

El sistema ahora puede representar una experiencia virtual con `experienceId`, plantilla, fase, modo TV, modo móvil e interacción. El manifest conserva a MJP Core como fuente autoritativa y distribuye el contexto a TV, overlay y QR. El Scheduler valida prerequisitos y no permite aprobación/publicación de una propuesta bloqueada. La autonomía tiene niveles y allowlist; el modo `STOPPED` impide acciones de autopilot. El contenido tiene fallback seguro. La contingencia conserva snapshot y declara `resultAuthorityPreserved: true`.

## C. Componentes creados o modificados

| Componente | Evidencia | Resultado |
| --- | --- | --- |
| `MJP_SYSTEM_AUDIT_ORDER25.md` | Auditoría inicial | Creado |
| `shared/experienceEngine.ts` | Estados, fases, plantillas, transición | Ampliado |
| `shared/experienceEngine.test.ts` | 3 pruebas | Creado |
| `server/schedulerEngine.ts` | Validación y lifecycle | Ampliado |
| `shared/tvManifest.ts` | Contexto de experiencia | Ampliado |
| `server/broadcast.ts` | QR contextual y firma compatible | Ampliado |
| `server/routers.ts` | Inputs tRPC enriquecidos | Ampliado |
| `shared/autonomyEngine.ts` | Niveles y allowlist | Creado |
| `shared/contentEngine.ts` | Fact/content/fallback | Creado |
| `shared/contingencyEngine.ts` | Escenarios y pasos | Ampliado |
| `shared/order25Engines.test.ts` | 4 pruebas de seguridad | Creado |
| `client/src/pages/ControlRoom.tsx` | Centro operativo protegido | Creado |
| `client/src/App.tsx` | Ruta `/control-room` | Modificado |
| `docs/*.md` | Arquitectura, Scheduler, Second Screen, Autonomy, Content, Contingency, Test Matrix | Creados |

## D. Componentes reutilizados

Se conservaron `server/pilot.ts`, `shared/eventEngine.ts`, `server/eventStore.ts`, `server/autonomy.ts`, `shared/avatarScripts.ts`, `server/broadcast.ts`, `client/src/pages/BroadcastPage.tsx`, `shared/tvManifest.ts`, `server/tvOverlay.e2e.test.ts`, el esquema Drizzle existente y las políticas de créditos virtuales. No se creó otro motor de sorteo ni otra wallet.

## E. Pruebas ejecutadas

| Tipo | Resultado |
| --- | --- |
| TypeScript `pnpm check` | Aprobado |
| Suite completa `pnpm test -- --run` | 100 aprobadas, 4 omitidas |
| Archivos de prueba | 34 aprobados, 1 omitido |
| Pruebas nuevas Experience Engine | 3 aprobadas |
| Pruebas nuevas autonomía/contenido/contingencia/Scheduler | 4 aprobadas |
| TV manifest | 5 aprobadas |
| QR broadcast | 5 aprobadas |
| Build `pnpm build` | Aprobado |
| E2E completo Program→Block→Event→Next Event | No disponible: no existe persistencia completa de PROGRAM/BLOCK/EVENT |
| Concurrencia MySQL/TiDB staging | Bloqueada: falta `STAGING_DATABASE_URL` |

Las cuatro pruebas omitidas corresponden a la suite de navegador marcada para ejecución condicionada; no se cuentan como aprobadas. La suite HTTP y los tests de integración reversibles existentes sí forman parte de las aprobaciones reportadas.

## F. Matriz de madurez

| Componente | Código | Unit test | E2E | Validación manual | Producción | Bloqueo |
| --- | --- | --- | --- | --- | --- | --- |
| Game Core | Sí | Sí | Parcial | Sí | No | RNG independiente |
| Event Engine | Sí | Sí | Parcial | Sí | No | Persistencia E2E de programa |
| Experience Engine | Sí | Sí | No | No | No | E2E principal |
| Scheduler | Sí | Sí | No | Parcial | No | Tablas PROGRAM/BLOCK y aprobación E2E |
| TV | Sí | Sí | Sí | Sí | No | QA físico continuo |
| Mobile/Second Screen | Sí | Sí | Parcial | Sí | No | sesión persistida y latencia |
| QR | Sí | Sí | Sí | Sí | No | replay/expiración independiente |
| Realtime | Sí | Sí | Parcial | Parcial | No | WebSocket/SSE no activado |
| Autonomy | Sí | Sí | No | Parcial | No | staging y aprobación operacional |
| Avatar | Sí, guiones | Sí | No | No | No | Avatar 3D/TTS |
| Content | Sí, determinista | Sí | No | No | No | proveedor IA futuro |
| Contingency | Sí | Sí | No | Parcial | No | recovery testing staging |
| Watchdog | Sí | Sí | Parcial | Sí | No | métricas de todos los componentes |
| Control Room | Sí | No dedicado | No | Parcial | No | E2E admin |
| Mathematics | Sí | Sí | Parcial | Sí | No | certificación independiente |
| Security | Sí | Sí | Parcial | Sí | No | pentest y revisión externa |

## G. Qué está realmente operativo

Está operativo en el piloto virtual el flujo de rondas existente, la proyección de eventos, el manifest TV/overlay, QR firmado por ronda, polling, contingencia visual, control de modo, watchdog básico, Event Store, auditoría de rondas, pruebas de RTP, billetera virtual y claim transaccional de cierre. El nuevo Control Room es accesible para rol admin y observa APIs existentes.

## H. Qué está simulado

La publicación de programas y bloques sigue siendo una propuesta en memoria; Experience Engine y autonomía se prueban como contratos deterministas; contenido y Avatar son plantillas; las métricas móviles/latencia completas no están medidas; el realtime avanzado no está activado; y la continuidad autónoma completa no se ejecuta sin staging.

## I. Qué está bloqueado

La concurrencia real requiere `STAGING_DATABASE_URL`. La homologación peruana, certificación RNG independiente, operación con dinero real, pagos, KYC/AML real, geolocalización regulatoria, YouTube API oficial, Avatar 3D, TTS y monetización permanecen bloqueados o fuera de alcance.

## J. Riesgos restantes

El riesgo principal es presentar contratos in-memory como operación completa. También deben validarse carreras de dos procesos contra MySQL/TiDB real, replay de QR contextual, expiración bajo reloj distribuido, autorización administrativa, recuperación después de interrupción durante draw y matriz física por modelo de TV.

## K. Recomendaciones

La siguiente fase debe provisionar una base de staging aislada, ejecutar el runner `scripts/run-concurrency-staging.mjs`, persistir `PROGRAM/BLOCK/EXPERIENCE` mediante migración revisada, automatizar la prueba E2E completa y encargar revisión independiente del RNG, matemáticas, seguridad y marco regulatorio peruano. No se debe activar dinero real mientras estas condiciones no estén cerradas.

## Referencias internas

- `MJP_SYSTEM_AUDIT_ORDER25.md`
- `docs/MJP_EXPERIENCE_OS.md`
- `docs/SCHEDULER.md`
- `docs/SECOND_SCREEN.md`
- `docs/AUTONOMY.md`
- `docs/CONTENT_ENGINE.md`
- `docs/CONTINGENCY.md`
- `docs/TEST_MATRIX.md`
- `docs/STAGING_CONCURRENCY_PROTOCOL.md`
- `docs/RNG_REGULACION_PERU_INFORME_PRELIMINAR.md`


---

# ANEXO 3 — Estado situacional y auditoría exhaustiva

**Fuente:** `MJP_ESTADO_SITUACIONAL_AUDITORIA_EXHAUSTIVA.md`

# Multi Juegos Perú — Estado situacional y auditoría exhaustiva

**Proyecto:** `ruleta-peru-online`  
**Producto:** Multi Juegos Perú (MJP)  
**Fecha de corte:** 26 de agosto de 2026  
**Autor:** Manus AI  
**Checkpoint de referencia:** `7ecabd40`  
**Estado operativo:** piloto gratuito, exclusivamente virtual  

> Este documento consolida el estado técnico, funcional, matemático, operativo y regulatorio del piloto. No constituye certificación independiente, opinión tributaria, asesoría legal ni autorización para operar con dinero real.

## 1. Dictamen ejecutivo

MJP es un piloto web full-stack de entretenimiento con créditos virtuales. El backend y la base de datos conservan la autoridad sobre rondas, resultados, reglas, premios virtuales, auditoría y movimientos de wallet. La interfaz web/PWA, el canal TV, el overlay para OBS y la pantalla secundaria consumen proyecciones públicas; no deben decidir resultados.

La versión auditada incluye motor de rondas, sorteo verificable mediante HMAC-SHA-256, reglas versionadas, billetera virtual, simulador, RTP, Bingo, Loterías, Ruletas Simplificadas, Trío 13, MultiMarket virtual, PWA, TV/QR/OBS, Auditor Agent, Event Store, Game Registry, Scheduler de propuesta, Autopilot acotado, Watchdog conceptual, Kill Switch administrativo, métricas no-PII y preparación regulatoria. Los pagos, retiros, conversión de créditos, Yape, KYC real, AML real y operación monetaria permanecen desactivados.

La cobertura automatizada más reciente separa **91 pruebas aprobadas en la suite Vitest** y **6 pruebas E2E aprobadas** mediante `pnpm test:e2e`. También se ejecutaron `pnpm check` y `pnpm build` con resultado satisfactorio. La validación interactiva adicional en Smart TV, Android TV, tablet y celular fue confirmada por el propietario; para una auditoría externa formal deben conservarse los modelos, versiones, resoluciones, capturas y logs de cada dispositivo.

## 2. Estados de auditoría

| Estado | Interpretación aplicada |
| --- | --- |
| **PASS** | Funciona y existe evidencia dentro del alcance probado. |
| **IMPLEMENTED / NEEDS STAGING** | Está implementado, pero falta validación bajo infraestructura representativa. |
| **SIMULATED** | Opera con datos aislados o demostrativos y no afecta la operación oficial. |
| **LOCAL ONLY** | Funciona principalmente en navegador o almacenamiento local. |
| **BLOCKED** | Depende de credenciales, proveedor, decisión o autorización externa. |
| **NOT IMPLEMENTED** | No existe funcionalidad operativa. |
| **NEEDS HUMAN DECISION** | Requiere aprobación formal del propietario, legal, seguridad o dirección. |

## 3. Inventario técnico

| Elemento | Situación |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind 4, PWA |
| Backend | Express, tRPC 11, TypeScript |
| Persistencia | Drizzle ORM sobre MySQL/TiDB |
| Identidad | Manus OAuth y roles |
| Integridad | HMAC-SHA-256, semillas, hashes, reglas versionadas e idempotencia |
| Tiempo real | Polling de 5–10 segundos y BroadcastChannel local; no hay WebSocket/SSE productivo |
| Pruebas | Vitest, integración, API E2E y Chromium E2E |
| Estado de referencia | Checkpoint `7ecabd40` |

El build mantiene dos advertencias no bloqueantes conocidas: un recurso `/manus-storage/...` que se resuelve en runtime y un bundle frontend principal superior a 500 kB. Conviene optimizarlos antes de una publicación amplia.

## 4. Arquitectura y fuente de verdad

```text
MJP CORE
├── Round Engine       -> rondas persistidas y estados
├── Draw Engine        -> semilla, hash, resultado verificable
├── Rule Engine        -> rulesets versionados y premios
├── Credit Engine      -> créditos virtuales e idempotencia
├── Audit/Verify       -> eventos, pruebas y verificación pública
└── Consumidores
    ├── Web/PWA
    ├── TV Client
    ├── Overlay/OBS
    ├── QR/Pantalla secundaria
    ├── Auditor Agent
    ├── Event Store
    └── YouTube, Avatar y TTS — bloqueados o no implementados
```

El contrato `MjpTvManifest v1` unifica la distribución pública del evento. Incluye identidad de evento y ronda, juego, subtipo, versión de ruleset, estado proyectado, cuenta regresiva, QR firmado, resultado cuando corresponde, participantes, timestamps, URLs públicas, secuencia, versión del manifest y banderas de crédito virtual. TV Client y overlay no generan resultados ni modifican rondas.

## 5. Estado funcional por dominio

| Dominio | Estado | Evidencia / limitación |
| --- | --- | --- |
| Rondas y estados | PASS | Estados persistidos y máquina formal de transiciones. |
| Sorteo verificable | PASS | HMAC-SHA-256, semilla revelable y verificación pública. |
| Liquidación virtual | PASS | Movimientos e idempotencia; claim con bloqueo de fila añadido. |
| Claim transaccional | IMPLEMENTED / NEEDS STAGING | `SELECT ... FOR UPDATE` antes de liquidar; falta carga concurrente real MySQL/TiDB. |
| Wallet | PASS | Solo créditos virtuales, sin valor monetario ni conversión. |
| QR | PASS / LOCAL ONLY | Firma, expiración y derivación determinista; sin almacenamiento físico del payload como fila independiente. |
| TV `/tv` | PASS dentro del piloto | Selector en vivo/en línea, salida, contingencia, QR, historial, temas y notificaciones. |
| Overlay `/overlay/:roundId` | PASS dentro del piloto | Estadísticas del manifest, realce de cambios y exportación PNG local. |
| PWA | PASS | Manifiesto, instalación, offline, tema y guía táctil. |
| Auditor Agent | PASS acotado | Verifica determinísticamente; no tiene autoridad para cambiar resultados. |
| Event Store | PASS acotado | Correlación, idempotencia y encadenamiento operativo. |
| Analítica | LOCAL ONLY | Sesiones, retornos y pantalla secundaria sin PII innecesaria. |
| YouTube Live oficial | BLOCKED | Falta API key, canal y autorización de scopes mínimos. |
| Avatar 3D/TTS | NOT IMPLEMENTED | Requiere proveedor, activos, presupuesto y decisión de producto. |
| Scheduler | BLOCKED | Preparado, pero no activado para cierres automáticos. |
| Watchdog/Kill Switch independiente | NOT IMPLEMENTED / NEEDS HUMAN DECISION | Falta operación persistente y procedimiento formal. |

## 6. Catálogo virtual

El catálogo activo contiene Loterías, Bingo, Ruletas Simplificadas y modalidades adicionales. Las tarifas internas se expresan en créditos virtuales referenciados internamente a una unidad PEN únicamente como parámetro de diseño; esto no crea valor monetario, deuda ni promesa de conversión.

| Familia | Modalidades o alcance |
| --- | --- |
| Lotería | Lotería 19, 29, 39, 49, 59 y variante separada 5/39 según ruleset vigente; MJP Extra conserva reglas diferenciadas. |
| Bingo | Bingo Flash, Bingo Keno y Bingo 75, con selección manual o generación automática según modalidad. |
| Ruleta | Ruleta piloto y Ruletas Simplificadas 7, 17, 27 y 37; se diferencian reglas y pagos por ruleset. |
| Cartas | Trío 13 con barajado y verificación virtual. |
| Mercados | MultiMarket Perú virtual, curado y moderado; sin publicación automática ni dinero real. |
| Juegos adicionales | Pick 3, Pick 4, Raspa, Sueldo de por vida y Loto Express sujetos a reglas, simulaciones y validación matemática individual antes de operación regulada. |

No debe utilizarse el promedio del catálogo para afirmar que cada juego alcanza un RTP determinado. Cada modalidad requiere su propio ruleset, cálculo exacto, simulación compatible y aprobación.

## 7. Auditoría matemática y RTP

La calculadora RTP del proyecto ha sido utilizada para comparar tablas y objetivos. El umbral de 85 % es una referencia de diseño del piloto y no una certificación regulatoria. La simulación aislada no debe tratarse como equivalente al motor si no reproduce todas sus reglas, especialmente en Bingo, ruletas simplificadas, Raspa, Pick, Loto y Sueldo.

Las reglas de redondeo virtual están documentadas: fracciones entre 0 y menos de 0,40 se anulan; desde 0,40 hasta menos de 1,00 se redondean hacia la unidad superior. Los premios publicados deben mostrar siempre unidades enteras y el ruleset exacto aplicado.

La afirmación correcta para auditoría es: **el sistema dispone de cálculos y pruebas por modalidad, pero requiere certificación matemática independiente y pruebas de carga antes de dinero real**. No deben publicarse comparaciones con operadores externos ni probabilidades no sustentadas por una fuente y una fórmula reproducible.

## 8. TV, PWA, QR y experiencia multidispositivo

Al encender `/tv`, el usuario puede elegir **Ver transmisión en vivo** o **Ver en línea**. El primer modo prepara la señal audiovisual cuando existe configuración válida; el segundo conserva el estado del evento, QR, historial y verificación aunque no exista señal audiovisual. El botón **Salir al portal** devuelve al inicio.

Las notificaciones de `/tv` reaccionan a cambios de secuencia o estado autoritativo, no a cada polling. Se pueden seleccionar temas de notificación y el nombre de marca o marca de agua se conserva localmente. El overlay muestra estado, juego, subtipo, secuencia, cuenta regresiva, participantes, QR, resultado, ruleset, timestamp, versión y modo virtual. La exportación PNG es local y no envía el manifest a un servidor.

La prueba automatizada responsive cubre 1280×720, 1024×768, 768×1024 y 390×844. La revisión interactiva adicional fue confirmada por el propietario como satisfactoria en Smart TV, Android TV, tablet y celular. Para formalizar la evidencia externa se recomienda conservar una ficha por dispositivo con fabricante, modelo, sistema operativo, navegador, versión, resolución, conectividad, fecha, resultado y captura.

## 9. Seguridad, privacidad y juego responsable

El piloto mantiene límites de solicitudes, cabeceras de seguridad, OAuth, separación de roles, procedimientos protegidos, controles de accesibilidad, modo offline y eventos de auditoría. Los mecanismos KYC/AML, geolocalización, autoexclusión y límites de tiempo son preparatorios o simulados, no controles regulatorios efectivos.

No se deben cargar documentos reales en el simulador KYC. Tampoco debe presentarse el estado de geolocalización simulada como una comprobación legal de ubicación. Antes de cualquier dinero real se requiere diseño y revisión específica de protección de datos, retención, acceso, consentimiento, prevención de fraude, KYC/AML, juego responsable y atención de reclamos.

## 10. Claim transaccional de cierre

El cierre de ronda utiliza una transacción y reclama la fila con `SELECT ... FOR UPDATE` antes de calcular resultado, premios y movimientos. Una ronda ya liquidada conserva la evidencia existente para impedir doble liquidación lógica. La prueba dedicada confirma la transacción y la reclamación previa.

El estado se clasifica **IMPLEMENTED / NEEDS STAGING**, no como certificación de concurrencia. Faltan pruebas en MySQL/TiDB representativo con dos procesos simultáneos, deadlocks, timeouts, reintentos, rollback, observabilidad y recuperación operativa.

## 11. Pruebas y evidencias

| Validación | Resultado |
| --- | --- |
| `pnpm check` | PASS; TypeScript sin errores |
| `pnpm test -- --run` | PASS; 31 archivos, 91 pruebas aprobadas y 3 pruebas de navegador omitidas por bandera de entorno |
| `pnpm test:e2e` | PASS; 2 archivos y 6 pruebas E2E aprobadas |
| Cambio de modo TV | PASS en navegador automatizado |
| Salida al portal | PASS en navegador automatizado |
| Persistencia de temas | PASS tras recarga |
| Exportación PNG con marca | PASS en Chromium |
| Responsive TV | PASS en cuatro tamaños automatizados |
| Claim de cierre | PASS unitario; NEEDS STAGING para concurrencia |
| Revisión física | Confirmada por el propietario; faltan fichas técnicas por dispositivo para auditoría externa |
| Build | PASS; advertencias no bloqueantes documentadas |

## 12. Modelo financiero preliminar 2026

El archivo complementario `MJP_MODELO_FINANCIERO_PERU_2026.xlsx` contiene hojas de supuestos, costos fijos, escenarios y notas de auditoría. `MJP_MODELO_FINANCIERO_PERU_2026.md` explica la metodología.

El modelo utiliza como referencias externas la UIT 2026 de S/ 5 500, la tarifa publicada de Yape Empresa de 2,95 % y una referencia SUNAT de 12 % para juegos a distancia, aplicadas únicamente como sensibilidades de una operación futura. La nómina, cloud, marketing, soporte, certificación, homologación, reservas, fraude, chargebacks, IGV, renta, ISC y otros costos deben sustituirse por contratos, cotizaciones o dictámenes profesionales.

Con una jugada hipotética de S/ 1 y RTP de 85 %, el margen bruto teórico antes de fees, impuestos y costos fijos es 15 %. Esto no es utilidad neta. El piloto actual no genera ventas, ingresos, premios monetarios, obligaciones tributarias de operación real ni conversión de créditos.

## 13. Preparación regulatoria y límites de alcance

La eventual migración a dinero real sería un proyecto nuevo, no una simple activación de configuración. Exigiría separar ledger virtual y ledger monetario, rediseñar pagos y conciliación, implementar KYC/AML efectivo, geolocalización, juego responsable, protección de datos, atención de reclamos, control de menores, homologación, certificación RNG, revisión tributaria y autorización aplicable de MINCETUR. Los requisitos deben verificarse con asesoría peruana vigente antes de cualquier lanzamiento [1] [2].

No se permite afirmar que el piloto está homologado, autorizado, certificado o listo para operar con soles. La referencia interna crédito/PEN sirve solo para evitar distorsiones de diseño y no habilita cobros ni retiros.

## 14. Riesgos y recomendaciones priorizadas

| Prioridad | Riesgo o brecha | Acción recomendada | Responsable sugerido |
| --- | --- | --- | --- |
| Alta | Certificación independiente pendiente | Contratar auditor técnico competente para RNG, rulesets y RTP | Dirección / QA |
| Alta | Claim no probado bajo concurrencia real | Ejecutar staging MySQL/TiDB con carreras, rollback y deadlocks | Ingeniería / QA |
| Alta | Modelo financiero preliminar | Sustituir supuestos por cotizaciones, contratos y memo contable/tributario | Contador |
| Alta | Integración YouTube oficial bloqueada | Configurar API key restringida y canal solo tras aprobación de alcance | Operaciones |
| Media | Evidencia física resumida | Guardar ficha por dispositivo y captura por escenario | QA |
| Media | Bundle frontend grande | Aplicar code splitting y optimización de recursos | Ingeniería |
| Media | Métricas productivas incompletas | Definir retención, cohortes, alertas y observabilidad con privacidad | Producto / Datos |

## 15. Checklist de auditoría externa

| Control | Evidencia a solicitar |
| --- | --- |
| Código y dependencias | Checkpoint, lockfile, inventario de versiones y diff |
| Reglas | Rulesets, fórmulas, tablas de premios y aprobación de cambios |
| Sorteo | Semilla, hash, algoritmo, revelación y reproducción independiente |
| Liquidación | Logs, idempotency keys, transacciones y pruebas de concurrencia |
| Datos | Esquema, migraciones, retención, backups y controles de acceso |
| TV/QR | Manifest, firma, expiración, rutas públicas y capturas |
| E2E | Logs completos, entorno, navegador, dispositivo y timestamp |
| Finanzas | Modelo, cotizaciones, bases tributarias y supuestos editables |
| Regulación | Memo legal, homologación, certificación y autorización aplicable |
| Seguridad | Pen test, threat model, incident response y revisión de secretos |

## 16. Conclusión

El proyecto presenta una base técnica sólida para un piloto virtual verificable y multiplataforma. La implementación actual permite probar juegos, rondas, TV, QR, overlay, PWA y auditoría sin utilizar dinero real. La arquitectura separa razonablemente la autoridad del backend de las vistas consumidoras y conserva límites explícitos frente a una futura regulación.

El sistema **no debe considerarse listo para monetización**. Las decisiones críticas siguientes son: certificación independiente del RNG y RTP, pruebas de concurrencia en staging, revisión contable y tributaria, formalización de evidencia de dispositivos, seguridad ofensiva y decisión legal sobre el alcance regulado. Hasta completar esos controles, deben permanecer desactivados pagos, retiros, conversión, Yape, KYC/AML real, operación automática y cualquier promesa de premio monetario.

## Referencias

[1]: https://www.sunat.gob.pe/indicestasas/uit.html — SUNAT, “Unidad Impositiva Tributaria - UIT”.

[2]: https://emprender.sunat.gob.pe/principales-impuestos/otros/impuesto-los-juegos-apuestas-deportivas-distancia — SUNAT, “Impuesto a los juegos y apuestas deportivas a distancia”.

[3]: https://www.yape.com.pe/productos/yape-empresa — Yape, “Yape Empresa”.

[4]: https://apuestasdeportivas.mincetur.gob.pe/ — MINCETUR, portal de juegos online y apuestas deportivas a distancia.


---

# ANEXO 4 — Auditoría de rebranding MiLukita

**Fuente:** `MILUKITA_REBRAND_AUDIT.md`

# MiLukita — Auditoría de rebranding e inventario técnico

**Fecha de corte:** 26 de agosto de 2026  
**Fuente:** Orden maestra adjunta y checkpoint `66820fde`  
**Estado de dinero real:** bloqueado  
**Estado de YouTube:** bloqueado  
**Estado de dominio/marca:** no verificado jurídicamente

## Resumen

La transformación propuesta es viable como evolución incremental. La arquitectura actual ya contiene Experience OS, Event Engine, `MjpTvManifest v1`, TV/overlay, QR, Second Screen, Scheduler, Control Room, contenido determinista, contingencia y piloto de créditos virtuales. El rebranding debe modificar la identidad comercial y la presentación, pero no los identificadores técnicos, las reglas, el RNG, los premios, el RTP, la liquidación ni los registros históricos.

## Inventario de superficies encontradas

La búsqueda inicial detectó **124 coincidencias en 31 archivos** para `MJP`, `Multi Juegos Perú`, `Multi Juegos` y `Ruleta Perú`. El inventario se concentra en las siguientes superficies:

| Superficie | Ejemplos encontrados | Tratamiento |
| --- | --- | --- |
| Metadata HTML | título, description, manifest, icono | Actualizar a MiLukita; conservar aviso de piloto |
| Home y navegación | encabezado, subtítulos, enlaces | Actualizar marca visible; conservar rutas |
| TV/overlay | textos de canal, manifest, broadcasts | Usar MiLukita TV y MiLukita Eventos |
| QR y comprobantes | prefijos e identificadores | No cambiar IDs históricos ni prefijos técnicos |
| Backend | `MJP_TV_MANIFEST_VERSION`, `MJP_EXTRA_39`, agregados `MJP` | Mantener por compatibilidad técnica |
| Experience OS | documentos y títulos internos | Mantener nombres técnicos; añadir alias comercial |
| Operaciones/Control Room | paneles y eventos | Presentar MiLukita; conservar auditoría y roles |
| Tests/fixtures | nombres de juegos, broadcasts y rounds | No romper fixtures; añadir pruebas de alias |
| Documentación | auditorías, fichas y guías | Actualizar progresivamente con trazabilidad |
| Assets | `pwa-icon.svg`, hero y referencias `/manus-storage` | Revisar visualmente; no generar ni comprar activos externos |
| Build generado | `dist/` contiene copias compiladas | No editar manualmente; regenerar tras cambios |

## Identidad visual actual

La interfaz actual utiliza una identidad oscura y premium asociada a Ruleta Perú Online/Multi Juegos Perú. El HTML usa `Ruleta Perú Online · Piloto gratuito`, la descripción menciona juegos virtuales verificables y el encabezado visual de la home contiene referencias a Multi Juegos Perú. La marca técnica se encuentra más distribuida que la marca visual: varios nombres como `MJP_TV_MANIFEST_VERSION`, `MJP_EXTRA_39`, `MJP_CORE` y prefijos de rondas deben conservarse.

## Clasificación de nombres

| Clase | Ejemplos | ¿Renombrar? |
| --- | --- | --- |
| Marca comercial visible | Multi Juegos Perú, Ruleta Perú Online | Sí, de forma gradual |
| Marca nueva | MiLukita, MiLukita TV, MiLukita Juegos, MiLukita Eventos | Añadir y priorizar |
| Personaje | Lukita | Añadir como anfitrión, no como nombre de módulo |
| Contrato técnico | `MjpTvManifest`, `MJP_TV_MANIFEST_VERSION`, `MJP_CORE` | No |
| Identificador histórico | `RP-MJP-*`, rounds, tickets, rulesets | No |
| Reglas y matemáticas | titles de juego, RTP, premios, RNG | No modificar en esta iteración |
| Dominio objetivo | `MiLukita.com` | Documentar; disponibilidad no confirmada |

## Dependencias y riesgos

El rebranding afecta copias visibles en React, HTML, metadata, documentación y posibles fixtures. Un reemplazo global sería inseguro porque podría romper contratos compartidos, IDs históricos, auditoría y consultas. Se debe usar una capa de identidad comercial (`brandSystem`) y conservar aliases técnicos.

El dominio `MiLukita.com`, el registro de marca y la disponibilidad jurídica no se consideran confirmados. No se deben comprar dominios, registrar marcas ni contratar servicios externos dentro de esta orden.

## Estado inicial de validación

El checkpoint anterior registró 100 pruebas aprobadas y 4 omitidas, `pnpm check` aprobado, `pnpm build` aprobado y un piloto exclusivamente virtual. La suite de concurrencia de staging está diferida por decisión del propietario.

## Plan de migración

Primero se crea el contrato de marca y los aliases. Después se actualizan metadata, home, navegación y textos de TV/overlay. Luego se añade el contexto comercial al manifest sin alterar su autoridad. Finalmente se regeneran build, pruebas, screenshots y documentación. Los nombres técnicos se conservan hasta que exista una migración formal y reversible, que no forma parte de esta fase.

## Estados de la auditoría

| Estado | Aplicación |
| --- | --- |
| `IMPLEMENTED` | Implementado y comprobado |
| `PARTIAL` | Existe parcialmente o solo en determinadas superficies |
| `SIMULATED` | Funciona como demostración aislada |
| `BLOCKED` | Depende de credenciales, proveedor o configuración externa |
| `REQUIRES_REVIEW` | Necesita revisión humana, legal o de diseño |
| `NOT_IMPLEMENTED` | No existe implementación funcional |

## Decisiones reservadas al propietario

La comprobación de disponibilidad del dominio, el registro de marca, la identidad legal, la activación de YouTube, la monetización, pagos, KYC/AML real y Avatar 3D productivo quedan fuera de esta implementación y requieren decisión o acción externa.

## Corte de implementación MiLukita — 26 de agosto de 2026

Se implementó una primera ola reversible de identidad:

| Superficie | Resultado |
| --- | --- |
| Header global | MiLukita + Lukita · Anfitrión digital |
| Ribbon del piloto | MiLukita mantiene créditos virtuales y ausencia de dinero real |
| Home | MiLukita Eventos y Lukita integrados en la narrativa |
| TV start screen | MiLukita TV y autoridad del servidor explícitas |
| Manifest status | MiLukita TV visible; `MJP CORE` conservado como alias técnico |
| Overlay export | Marca de agua MiLukita por defecto; archivo exportado con prefijo `milukita-event` |
| PWA | `name` y `short_name` actualizados a MiLukita |
| Control Room | MiLukita Control Room · Experience OS |
| Traducciones base | Título, tagline y texto responsable actualizados en español/inglés |
| Contrato compartido | `shared/brandSystem.ts` y pruebas unitarias aisladas |

**Validación del corte:** `pnpm vitest run shared/brandSystem.test.ts` aprobó 3 pruebas; `pnpm check` aprobado; `pnpm build` aprobado. El build conserva una advertencia preexistente de asset `/manus-storage/ruleta-peru-hero_7732dc7d.png` resuelto en runtime y la advertencia de bundle grande ya documentada.

No se renombraron rutas, contratos, IDs, rulesets, RNG, RTP, premios, créditos virtuales, resultados históricos ni tablas de base de datos. No se configuró dominio, registro de marca, YouTube, pagos, KYC/AML real, dinero real ni avatar 3D.

## Evidencia visual del corte

Se revisaron `/` y `/tv` en viewport escritorio 1280×720 y móvil 390×844. La home muestra MiLukita, MiLukita Eventos y el anfitrión Lukita; el selector TV muestra MiLukita TV, las opciones «Ver transmisión en vivo» y «Ver en línea», el aviso de créditos virtuales y la salida al portal. En móvil, la identidad y el selector se mantienen legibles y las tarjetas se apilan sin recorte crítico visible. La guía táctil y la invitación PWA aparecen como overlays existentes del piloto y no son parte del rebranding.

## Constancia adjunta revisada

El PDF adjunto identifica una **solicitud de registro de marca de servicio denominativa «MiLukita»** ante INDECOPI, en la clase 38, asociada a servicios de telecomunicaciones. Para proteger la privacidad, esta auditoría no reproduce número de documento, domicilio, teléfono, correo, comprobante de pago ni otros datos del solicitante.

El documento revisado es una constancia/formulario de solicitud de dos páginas; no se interpreta como una resolución final de concesión ni como certificado de registro. En consecuencia, el producto puede usar MiLukita como identidad proporcionada por el propietario, pero la documentación pública debe describir el estado legal como **solicitud presentada / registro pendiente de confirmación**, salvo que el propietario entregue posteriormente la resolución o certificado correspondiente.

## Ampliación implementada: Control Room y Lukita Script Lab

Se añadió `BrandPreviewPanel` en `/control-room` con seis superficies seleccionables: Header, Home, TV, Overlay, PWA y Manifest. La vista muestra MiLukita, Lukita, MiLukita TV, la condición de piloto virtual y los aliases técnicos MJP sin alterar el contrato autoritativo.

Se añadió `LukitaScriptsPanel`, protegido por el acceso existente de operador de Control Room. Permite seleccionar seis disparadores, editar el texto y fallback, renderizar `{game}`, activar/desactivar el texto personalizado, probar la salida y restaurar la plantilla. La persistencia es local al navegador del operador; no publica guiones ni crea una vía automática de decisión. `shared/lukitaScripts.ts` conserva `canChangeOfficialState: false`.

Se incorporaron microinteracciones de marca para logo, avatar, tabs y superficies, con transiciones de 180–240 ms y reglas `prefers-reduced-motion`. También se corrigió una clave React duplicada en los beneficios de Home detectada durante la inspección.

Validación del corte: `pnpm check` aprobado; pruebas focalizadas de marca, manifest y guiones: 6 aprobadas; suite completa: 106 aprobadas y 4 omitidas; `pnpm build` aprobado. Se mantiene la advertencia de bundle grande existente y el entorno público de Control Room continúa protegido por autenticación/rol de operador.

## Evidencia visual de la ampliación

La captura de `/` confirma que la experiencia pública mantiene MiLukita, la guía táctil y el aviso de instalación sin romper la carga inicial. La captura de `/control-room` confirma que el centro operativo conserva sus semáforos, límites de autoridad, estado de ronda y enlace TV. El preview y Script Lab están ubicados más abajo en la misma ruta y quedan accesibles dentro del panel protegido; la carga diferida de rutas se verifica en el build mediante chunks separados.

## Nueva fase: IA, persistencia administrativa y rendimiento

Se migró Lukita Script Lab desde `localStorage` hacia `lukita_script_versions`, tabla versionada con trigger, locale, texto, fallback, estado, origen, versión, actor y timestamps. La migración `drizzle/0023_wonderful_jackal.sql` fue revisada y aplicada sin operaciones destructivas.

Se añadieron procedimientos administrativos tRPC para listar, guardar, restaurar y generar variaciones. La generación usa `invokeLLM` exclusivamente server-side, descubre el catálogo disponible, solicita JSON Schema estricto y limita la salida a tres propuestas de 280 caracteres. Cada propuesta muestra que requiere aprobación humana y conserva `canChangeOfficialState: false`; la IA no publica ni decide estados, resultados, RTP, premios o créditos.

El bundle inicial se optimizó con carga diferida de rutas y chunks de vendor. El build produjo `index-DuoGsPoV.js` de 243,72 kB (67,34 kB gzip), con páginas pesadas separadas; el riesgo restante es el bundle de React vendor de 385,11 kB sin gzip y una advertencia no bloqueante de asset `/manus-storage/...` resuelto en runtime.

Validación final de esta fase: `pnpm check` aprobado; pruebas focalizadas 7/7 aprobadas; build frontend y servidor aprobados. La suite anterior de 108 pruebas aprobadas y 4 omitidas fue ampliada con dos pruebas del guard IA; se debe conservar el conteo de la ejecución completa más reciente en el cierre de entrega.

## Cierre de ampliación del Script Lab

El panel administrativo ahora permite recorrer versiones, seleccionar una edición y comparar el texto anterior con el posterior. Las propuestas de IA se pueden previsualizar en el contexto de un juego antes de aplicarlas al borrador; la preview no persiste ni publica cambios. Los guiones guardados incorporan categoría y hasta ocho etiquetas, con filtros por trigger, categoría, estado y límite.

Se creó `MJP_PROXIMAS_ACTIVIDADES.md` como documento único de continuidad. Incluye cierre técnico, gobernanza editorial, rendimiento, pruebas en hardware, staging, certificación independiente, dominio y límites de monetización. La base continúa siendo exclusivamente virtual y la IA sigue subordinada a revisión humana y al MJP CORE.


---

# ANEXO 5 — Próximas actividades

**Fuente:** `MJP_PROXIMAS_ACTIVIDADES.md`

# MiLukita — Próximas actividades y hoja de ruta operativa

**Proyecto:** MiLukita / MJP CORE  
**Fecha de corte:** 26 de agosto de 2026  
**Documento:** Hoja de ruta posterior a la ampliación de Lukita Script Lab  
**Estado:** Piloto exclusivamente virtual, con créditos sin valor monetario, sin pagos, retiros ni conversión

## 1. Propósito

Este documento consolida las actividades que deben ejecutarse después de la implementación del historial visual, la comparación de versiones, la previsualización de variaciones IA y las categorías administrativas de Lukita Script Lab. Su finalidad es separar con claridad lo que ya está implementado de lo que todavía requiere validación, decisión humana, proveedor externo o certificación independiente.

La prioridad operativa es fortalecer el control editorial sin trasladar autoridad funcional a la IA. El MJP CORE conserva la autoridad sobre rondas, resultados, reglas, RTP, premios virtuales, créditos, auditoría, Event Store y controles de operación. Lukita solo comunica estados confirmados y el asistente IA solo propone textos sujetos a revisión humana.

## 2. Estado actual resumido

| Área | Estado al corte | Evidencia o referencia |
|---|---|---|
| Marca MiLukita y anfitrión Lukita | Implementado | `MILUKITA_BRAND_SYSTEM.md`, `MILUKITA_REBRAND_AUDIT.md` |
| Script Lab administrativo | Implementado | `client/src/components/LukitaScriptsPanel.tsx` |
| Persistencia de versiones | Implementado | `lukita_script_versions`, migraciones 0023 y 0024 |
| Historial y comparación antes/después | Implementado en interfaz | Endpoint `operations.lukitaScriptHistory` y selector visual de versión |
| Categorías y etiquetas | Implementado | Columnas `category` y `tagsJson`, filtros en Script Lab |
| Preview de variaciones IA | Implementado | Preview local, sin guardado ni publicación automática |
| Asistente IA | Implementado con límites | `invokeLLM` server-side, JSON Schema, máximo tres propuestas |
| Tests de la nueva fase | Aprobados | Focalizados: 8/8; suite completa previa: 110/4, debe repetirse tras el último cambio |
| Build y TypeScript | Validados en la fase anterior | `pnpm check` y `pnpm build`; repetir como cierre de esta fase |
| Dinero real, pagos, retiros y conversión | Bloqueados | No forman parte del piloto |
| Concurrencia real en staging | Diferida | Falta `STAGING_DATABASE_URL` aislada |
| Certificación externa de RNG y seguridad | Pendiente | Requiere auditor independiente |

## 3. Actividades inmediatas de cierre técnico

| Prioridad | Actividad | Responsable sugerido | Dependencia | Criterio de aceptación |
|---|---|---|---|---|
| Alta | Ejecutar nuevamente `pnpm check` y `pnpm test --` después de la integración del historial | Ingeniería | Ninguna | TypeScript sin errores; todas las pruebas aplicables aprobadas |
| Alta | Ejecutar `pnpm build` y conservar el reporte de chunks | Ingeniería | Suite aprobada | Entry inicial y páginas diferidas medidos; sin regresiones funcionales |
| Alta | Verificar en una cuenta administrativa que se crean, archivan y consultan versiones | QA + Operador | Sesión con rol admin | Un guardado crea una nueva versión; la anterior queda archivada y comparable |
| Alta | Probar una variación IA, abrir su preview y verificar que no se persiste hasta guardar | QA + Operador | Credenciales/servicio LLM disponible | Preview visible; no cambia DB ni estado del juego antes de aprobación |
| Media | Validar filtros por categoría, trigger, estado y etiquetas con datos administrativos | QA | Al menos dos versiones por trigger | Resultados consistentes y sin exposición a jugadores |
| Media | Confirmar que `tagsJson` queda compatible con TiDB y documentar la migración 0024 corregida | Ingeniería | Base de datos accesible | `SHOW COLUMNS` confirma `varchar(512)` y valores por defecto válidos |

## 4. Próxima fase de producto y gobernanza editorial

La siguiente ampliación recomendable es un flujo de aprobación más explícito. El operador debería poder seleccionar una versión, compararla con su antecesora, previsualizarla en el contexto de Home, TV y Overlay, y aprobarla para uso comunicacional. Esta aprobación no debe publicar reglas ni modificar resultados; únicamente debe establecer qué texto puede presentar la capa de experiencia.

| Actividad | Resultado esperado | Prioridad |
|---|---|---:|
| Historial de auditoría enriquecido | Usuario, hora, motivo, origen, versión anterior y versión nueva consultables | Alta |
| Estado editorial separado | `draft`, `review`, `approved`, `archived`, sin confundirlo con estado de ronda | Alta |
| Comparación de fallback | Antes/después también para fallback, categoría y etiquetas | Media |
| Preview por superficie | Mismo guion simulado en Web, TV, Overlay y pantalla secundaria | Media |
| Exportación de revisión | Informe textual o JSON de la versión aprobada, sin datos sensibles | Baja |

## 5. Rendimiento y experiencia

El code-splitting ya separa las páginas principales y los vendors. La actividad siguiente es medir carga en condiciones representativas, no solamente observar el tamaño de los archivos. Deben compararse carga inicial de Home, carga de `/tv`, carga del Control Room y navegación a una página de juego. El indicador debe separar descarga, ejecución JavaScript, renderizado y llamadas de datos.

| Actividad | Métrica que debe conservarse | Criterio de aceptación |
|---|---|---|
| Medición de Home | Tamaño transferido, tiempo de render y errores de consola | Sin regresión frente al build de referencia |
| Medición de rutas diferidas | Tiempo desde navegación hasta contenido útil | Cada ruta carga solo sus dependencias necesarias |
| Optimización vendor React | Gzip, ejecución y duplicación de dependencias | Reducir costo de entrada sin degradar compatibilidad |
| Asset de hero | Resolución en runtime y peso real | Sin advertencias bloqueantes ni imagen rota |
| Responsive | 390×844, 768×1024, 1024×768 y 1280×720 | Sin desbordamientos ni pérdida de información crítica |

## 6. Seguridad, datos y operación

El asistente IA debe seguir siendo una herramienta de apoyo interno. No se deben enviar a un proveedor LLM datos de usuarios, documentos de identidad, saldos, semillas, resultados no publicados, secretos, identificadores de sesión ni información de auditoría sensible. El prompt debe recibir únicamente el contexto editorial mínimo: disparador, nombre de juego, texto actual y fallback.

La persistencia administrativa debe conservar el historial, pero no debe convertirse en un canal para modificar el motor de juegos. Todo endpoint nuevo debe permanecer bajo `adminProcedure`; los clientes públicos no deben listar ni consultar las versiones internas de Lukita. Las acciones de guardar y restaurar deben continuar registrando eventos operativos con idempotencia.

| Control | Estado | Próxima acción |
|---|---|---|
| Autorización administrativa | Implementada | Añadir prueba explícita de rechazo para jugador |
| Límite de longitud | Implementado | Mantener 280 caracteres por texto |
| Máximo de variaciones | Implementado | Mantener máximo tres propuestas por solicitud |
| Salida estructurada | Implementada | Registrar fallos de parseo sin guardar contenido inválido |
| Aprobación humana | Implementada en UI | Separar posteriormente `draft/review/approved` |
| Datos personales en prompt | No enviados por diseño | Revisar cualquier nueva variable antes de incorporarla |
| Publicación automática | Bloqueada | No activar sin decisión de producto y control de rollback |

## 7. Validación de dispositivos y TV

El proyecto ya cuenta con validación responsive automatizada y revisión visual del navegador. Todavía conviene completar una matriz física antes de una audiencia amplia: Smart TV real, Android TV o Google TV, tablet y celular. La prueba debe cubrir selector en vivo/en línea, salida al portal, QR, reconexión, overlay, lectura del manifest y legibilidad de resultados.

| Dispositivo | Flujos mínimos | Responsable |
|---|---|---|
| Smart TV | Arranque, modo TV, navegación por control remoto, QR, contingencia | QA con equipo físico |
| Android TV/Google TV | Instalación o navegador, foco, reproducción y reconexión | QA con equipo físico |
| Tablet | Orientación vertical/horizontal, touch, PWA y overlay | QA |
| Celular | PWA, instalación, offline, guía táctil y pantalla secundaria | QA |
| PC/laptop | Web, Control Room, exportación PNG y verificación | Ingeniería + QA |

## 8. Datos de staging y concurrencia

La prueba de concurrencia real continúa diferida por decisión del propietario. No debe utilizarse `DATABASE_URL` del piloto. Para reactivar esta actividad se necesita una base MySQL/TiDB aislada y una variable `STAGING_DATABASE_URL` proporcionada mediante el mecanismo seguro de secretos. El runner existente debe verificar la variable, abortar si apunta a la base del piloto y generar un reporte reproducible.

El criterio de aceptación será obtener métricas reales de reservas concurrentes, cierres, claims idempotentes, latencia y errores de base de datos, con limpieza posterior de los datos de prueba. Hasta que exista esa URL, cualquier número de concurrencia debe presentarse como no medido.

## 9. Regulación, certificación y monetización futura

El piloto debe permanecer con créditos virtuales. Antes de cualquier decisión de dinero real se requerirá una revisión legal específica, un diseño de KYC/AML con proveedor aprobado, geolocalización, juego responsable, homologación aplicable, certificación independiente del RNG, seguridad, trazabilidad y validación de cada modalidad. La arquitectura preparada no equivale a autorización para operar.

| Actividad futura | Condición previa | Estado |
|---|---|---|
| Certificación independiente de RNG | Expediente técnico congelado y entorno reproducible | Pendiente |
| Auditoría de matemáticas y RTP | Reglas versionadas, simulaciones y tablas finales | Pendiente |
| Revisión legal peruana | Definición exacta de modalidad y modelo operativo | Pendiente |
| KYC/AML real | Decisión de monetización y proveedor | Bloqueado |
| Pagos y retiros | Licenciamiento, controles y decisión formal | Bloqueado |
| Conversión de créditos | Prohibida durante el piloto | No implementar |
| YouTube Live | Credenciales, decisión del propietario y prueba de canal | Pausado |
| Dominio MiLukita | Compra y configuración por el propietario | Pendiente |

## 10. Cronograma sugerido por fases

| Fase | Horizonte orientativo | Entregable |
|---|---:|---|
| Cierre técnico de Script Lab | 1–2 días hábiles | Suite completa, build, pruebas administrativas y auditoría actualizada |
| Flujo editorial aprobado | 3–5 días hábiles | Estados de revisión, auditoría enriquecida y preview por superficie |
| Rendimiento y assets | 3–5 días hábiles | Medición de carga, optimización vendor y corrección de assets |
| Matriz de dispositivos | 1–2 semanas | Evidencia en equipos reales y lista de incidencias |
| Staging y concurrencia | Depende de URL aislada | Reporte real de carga y claims |
| Certificación y revisión legal | Según terceros | Expediente externo; no es una tarea automática de ingeniería |

Los plazos son orientativos y no representan una promesa de certificación ni de autorización regulatoria. Las actividades que dependen de equipos físicos, credenciales, asesores o proveedores deben programarse después de contar con esos recursos.

## 11. Criterios de no avance

No se debe avanzar hacia dinero real, pagos, retiros, conversión, premios monetarios o automatización regulada mientras el piloto no tenga una decisión formal, revisión legal, proveedor definido, pruebas independientes y controles operativos verificables. Tampoco se debe permitir que un guion generado por IA se interprete como resultado, regla, premio o probabilidad oficial.

La próxima acción técnica más segura es cerrar la validación completa de esta fase y luego implementar, si se aprueba, el flujo editorial `draft → review → approved → archived` con rollback visible. En paralelo, QA puede preparar la matriz física de dispositivos y el propietario puede facilitar la URL de staging aislada cuando decida reactivar la concurrencia.

## 12. Referencias internas

- `MILUKITA_REBRAND_AUDIT.md`
- `MILUKITA_BRAND_SYSTEM.md`
- `MJP_MASTER_IMPLEMENTATION_AUDIT.md`
- `shared/lukitaScripts.ts`
- `server/lukitaScripts.ts`
- `client/src/components/LukitaScriptsPanel.tsx`
- `drizzle/schema.ts`
- `drizzle/0023_wonderful_jackal.sql`
- `drizzle/0024_tired_alex_wilder.sql`
- `todo.md`

## Evidencia visual de la fase Script Lab

La revisión móvil de `/` y `/control-room` confirmó que la navegación pública MiLukita, la guía táctil y el acceso protegido se adaptan a 390×844 sin desbordamiento visible. El Control Room se mantiene protegido por autenticación; por ello, la inspección visual de los módulos internos de historial y Script Lab requiere una sesión administrativa real y no se declara como validación pública.


---

## Nota de consolidación

Este archivo es una copia unificada para descarga y auditoría. Los documentos fuente permanecen separados en el repositorio para facilitar control de versiones y futuras actualizaciones.
