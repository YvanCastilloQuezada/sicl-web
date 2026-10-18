# MiLukita — Auditoría QR y nextEvent

**Orden 44 · Estado:** diagnóstico sin implementar soluciones.

## Máquina de estados real observada

La ronda de base de datos usa `draft → open → locked → drawn → settled → archived`. El contrato MjpTvManifest proyecta principalmente `SCHEDULED → OPEN → LOCKED → DRAWING → RESULT_VERIFIED/COMPLETED`, además de `CANCELLED`, `RECOVERY` y `DISCONNECTED`. La generación normal del manifest no completa QR ni siguiente evento: `qr.available=false`, `targetUrl=null`, `signed=false` y `nextEvent.available=false`. El QR firmado existe como procedimiento backend separado y solo se emite para `round.state === open`.

## Flujo auditado

| Paso | Evidencia actual | Estado |
|---|---|---|
| Evento actual | `getBroadcastRound` obtiene ronda de DB | Implementado |
| QR generado | `createRoundQr` firma payload y valida ventana | Implementado |
| QR mostrado en TV | `/overlay/:roundId` consulta QR; `/tv` no lo renderiza | Parcial |
| Escaneo/resolución | Payload contiene URL, roundId, eventId y experienceId | Contrato cubierto |
| Celular/interacción | URL dirige a `/juegos/:game` | Módulo implementado |
| Cierre | Servidor rechaza participación fuera de ventana | Implementado |
| Resultado | round/manifest y `/verificar` | Implementado |
| Next event | Builder no lo publica | No implementado en proyección normal |

## Casos requeridos

| Caso | Resultado de auditoría | Evidencia / limitación |
|---|---|---|
| 1. QR válido actual | PASS de contrato | `broadcast.test.ts` valida firma y ventana |
| 2. QR antiguo | PASS de contrato por ventana/round | No existe E2E de navegador con QR antiguo |
| 3. QR de evento cerrado | PASS de backend | `createRoundQr` rechaza estado no abierto |
| 4. QR inexistente | PASS esperado de procedimiento | `getBroadcastRound` devuelve null; falta E2E específico |
| 5. Evento actual sin nextEvent | PASS diagnóstico | Es el comportamiento actual; `available=false` |
| 6. Evento actual con nextEvent | NO PROBADO | El builder normal no tiene ruta de datos para poblarlo |
| 7. Cambio de evento en celular | NO PROBADO | No existe golden flow único |
| 8. Pérdida de conexión | Parcial | `/tv` tiene contingencia audiovisual; no prueba transición completa de celular |
| 9. Recuperación | Parcial | Polling y refetch; no hay evidencia física o de manifest RECOVERY runtime |
| 10. Dos dispositivos simultáneos | NO PROBADO | No hay prueba de concurrencia de escaneo/entrada |

## Hallazgos

| ID | Prioridad | Problema → evidencia → impacto → solución futura → dependencia → prioridad |
|---|---|---|---|---|---|
| QR-01 | P1 | QR no forma parte de la proyección normal del manifest → builder lo deja no disponible y `/tv` no consulta QR → el puente de TV a celular puede no existir en pantalla principal → definir un único contrato de QR derivado de ronda abierta → broadcast + manifest → alta |
| QR-02 | P1 | `nextEvent` nunca se publica en builder normal → `available=false` → no hay continuidad declarada → incorporar fuente validada desde programación → Scheduler + MjpTvManifest → alta |
| QR-03 | P2 | Cambio de evento en celular no probado → no existe golden flow → riesgo de contexto obsoleto → prueba de evento/round identity y expiración → QR + mobile → media |
| QR-04 | P2 | Recuperación completa no probada → UI maneja contingencia pero backend normaliza recovery → mensajes pueden divergir → fixture runtime de RECOVERY/DISCONNECTED → manifest + realtime → media |
| QR-05 | P2 | Escaneo simultáneo no probado → solo firma/ventana están cubiertos → falta evidencia de idempotencia/duplicidad de entrada → prueba concurrente aislada → API + QA → media |

## Conclusión

QR seguro y verificable está implementado como capacidad backend. La experiencia pública unificada y `nextEvent` no están demostrados. No se debe declarar cerrado el flujo hasta cubrir los diez casos con fixtures y, donde corresponda, hardware real.

## Actualización posterior — QR unificado en el manifest

La proyección pública del manifest ahora puede transportar el contrato QR completo durante una ronda abierta: `available`, `roundId`, `targetUrl`, `verifyUrl`, `expiresAt`, `signed`, `version`, `imageDataUrl` y el payload firmado. El payload se genera en backend con nonce determinista por ronda, expiración en `closeAt` y firma HMAC; la TV Client, `/overlay/:roundId` y el flujo público `/tv` consumen la misma proyección `manifest.qr`. El procedimiento `broadcast.qr` queda como adaptador compatible y devuelve exactamente el QR contenido en el manifest, no una fuente paralela.

El caso de `nextEvent` sigue sin estar implementado en la proyección normal; esta entrega no lo simula ni lo declara resuelto.

**Estado actualizado:** QR unificado implementado y probado por contrato; cambio de evento, escaneo simultáneo, recuperación completa y `nextEvent` continúan sin certificación E2E.

## Actualización posterior — continuidad del golden flow

Se completó la proyección de `nextEvent` en el `MjpTvManifest` público: el backend busca la siguiente ronda futura del mismo juego en MJP CORE y proyecta `eventId`, `gameId`, `gameName` y `scheduledStart`. La pantalla TV muestra el siguiente evento con un acceso para preparar el celular.

En el celular, cuando la URL proviene de un QR (`?round=`), la reserva individual y la previsualización de lotes quedan fijadas al `roundId` del evento conectado; no se sustituye silenciosamente por otra ronda abierta del mismo juego. Si el evento QR está cerrado o no corresponde al juego, la interfaz no ofrece una reserva alternativa automática.

La TV incorpora un estado visual del QR: **QR válido**, **QR vencido**, **QR requiere validación** o **QR inactivo**, acompañado del estado de conexión del manifest. La verificación se basa en disponibilidad, firma, URL y expiración proyectadas por el mismo manifest.

Prueba de contrato añadida: `server/broadcast.test.ts` valida la proyección de `nextEvent`. Esto demuestra continuidad de contrato, no certificación de escaneo físico simultáneo en dispositivos reales.
