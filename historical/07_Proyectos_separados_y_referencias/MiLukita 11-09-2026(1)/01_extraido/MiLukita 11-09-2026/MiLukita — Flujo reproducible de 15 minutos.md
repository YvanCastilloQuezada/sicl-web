# MiLukita — Flujo reproducible de 15 minutos

**Orden:** 43-B · **Objetivo:** demostrar o refutar el recorrido TV → Lukita → QR → celular → evento → interacción → cierre → resultado → verificación → siguiente evento.

## Resultado de la ejecución diagnóstica

El flujo está **parcialmente demostrado**, no certificado como recorrido integrado completo. La cobertura automatizada existente demuestra selección de modo TV, cambio de modo, salida al portal, persistencia de tema y exportación PNG en Chromium [1]. Las pruebas de QR demuestran firma, integridad, versión y expiración [2]. No existe evidencia equivalente en Safari iOS, Android TV, Smart TV real ni una prueba única que encadene los quince minutos y todos los sistemas.

La inspección de preview mostró un caso de bloqueo: el título de MiLukita fue recibido, pero el viewport quedó blanco y no detectó controles. En paralelo, los logs registraron respuestas 429 sobre el batch de `operations.recordProductEvent`. Este caso debe repetirse después de aislar el límite de telemetría; por ahora el cronómetro de experiencia no puede considerarse PASS en ese entorno.

## Guion minuto a minuto

| Tiempo | Acción del auditor | Evidencia esperada | Resultado actual |
|---|---|---|---|
| 00:00–01:00 | Abrir `/tv` y escoger en vivo o en línea | Selector visible, explicación de autoridad y salida | Implementado en Chromium; preview general afectado por 429 |
| 01:00–02:00 | Confirmar estado de señal y manifest | Estado de conexión, juego y modo virtual | Implementado; depende de ronda/manifest |
| 02:00–03:00 | Identificar a Lukita como companion | Host visible, copy no autoritativo | No integrado en `/tv`; visor separado por decisión de gate |
| 03:00–04:00 | Mostrar QR de la ronda abierta | QR firmado y URL de experiencia | Backend implementado; `/tv` no lo muestra directamente |
| 04:00–05:00 | Escanear/abrir QR en celular | Ruta `/juegos/:game` con round, broadcast y experience | Payload preparado; dispositivo físico no probado |
| 05:00–07:00 | Interactuar con créditos virtuales | Confirmación de jugada, reglas y saldo virtual | Módulos implementados; cadena única no ejecutada |
| 07:00–08:00 | Llegar al cierre | Participación bloqueada por estado autoritativo | Motor de ronda implementado |
| 08:00–09:00 | Observar resultado | Resultado solo después de sorteo/manifest | Verificación de backend y fixtures existentes |
| 09:00–10:00 | Abrir `/verificar` | Evidencia pública reproducible | Implementado |
| 10:00–11:00 | Simular contingencia audiovisual | Mensaje de recuperación, no resultado inventado | Implementado en `/tv`; reintento cada 10 s |
| 11:00–12:00 | Cambiar tema/recargar | Preferencia persistente | E2E Chromium aprobado |
| 12:00–13:00 | Abrir overlay | Manifest, estadísticas y QR durante ronda abierta | Implementado; polling de 5 s |
| 13:00–14:00 | Avanzar a siguiente evento | `nextEvent` disponible y transición | No demostrado; builder deja `nextEvent.available=false` |
| 14:00–15:00 | Ejecutar KILL LUKITA y repetir verificación | TV/QR/evento/resultado continúan | No existe prueba runtime específica |

## Criterio de cierre

El flujo solo debe declararse PASS cuando exista evidencia con dispositivo, navegador, resolución, red, timestamps, logs y URL para cada paso. La prueba Chromium actual es una evidencia parcial, no certifica Safari iOS, WebView, Android TV o Smart TV.

## Hallazgos del flujo

| ID | Prioridad | Problema → evidencia → impacto → solución futura → dependencia → prioridad |
|---|---|---|---|---|---|
| FLOW-01 | P1 | QR no visible en `/tv` → `BroadcastPage` consulta manifest pero el QR se obtiene en overlay por procedimiento separado → rompe el puente TV-celular → unificar proyección/consumo y probar ronda abierta → backend broadcast + manifest → alta |
| FLOW-02 | P1 | Flujo de 15 minutos no ejecutado como una prueba única → solo existen E2E parciales → no se puede afirmar integración → crear golden flow aislado y reversible → QA + ronda fixture → alta |
| FLOW-03 | P1 | Siguiente evento no publicado → `nextEvent.available=false` en builder → se corta continuidad → definir fuente y transición → Scheduler + MjpTvManifest → alta |
| FLOW-04 | P1 | KILL LUKITA no probado → no existe interruptor específico ni E2E del escenario → dependencia desconocida en runtime → prueba de apagado del host → TV Client + QA → alta |
| FLOW-05 | P1 | Safari iOS/Android TV sin certificación → E2E usa Chromium → descarga/gestos/PWA pueden variar → matriz física y fallback de descarga → hardware real → alta |
| FLOW-06 | P2 | Contingencia real del manifest no completamente recorrida → UI maneja señal pero builder normaliza recovery → mensajes potencialmente desalineados → fixture y transición runtime → manifest + realtime → media |

## Referencias

[1]: ../server/tvOverlay.e2e.test.ts "E2E TV/overlay en Chromium"
[2]: ../server/broadcast.test.ts "Pruebas de QR firmado y expiración"
[3]: ../shared/tvManifest.ts "Contrato MjpTvManifest"

## Validación ejecutada

`pnpm check` terminó con código 0. `pnpm test` terminó con código 1: 40 archivos pasaron, 1 falló y 1 fue omitido; 127 pruebas pasaron y 4 fueron omitidas. El fallo fue `server/api.e2e.test.ts`, porque `games.reserveTicket` recibió 500 (`La participación está cerrada para esta ronda`) cuando la prueba esperaba 200. `pnpm build` terminó con código 0, con warnings de asset externo no resuelto en build y chunk grande del visor 3D.

Este resultado impide declarar PASS el flujo completo de 15 minutos. La evidencia disponible es de contratos y E2E parciales, no de una ejecución única en hardware real.

## Actualización posterior a la implementación

El paso TV → QR debe verificar ahora que `/tv` y `/overlay/:roundId` muestran exclusivamente `manifest.qr`, con `roundId`, URL, firma y expiración correspondientes a la misma ronda abierta. No debe aceptarse un QR separado o de una ronda anterior.

Si la telemetría responde `429`, el beacon aplica deduplicación y backoff y la navegación debe continuar. La repetición en navegador limpio sigue siendo necesaria para certificar que el viewport no queda bloqueado por infraestructura o por una regresión del cliente.

El worker supervisado permite verificar claims duplicados, `STOPPED` y eventos operacionales dentro de este flujo, pero el guion de 15 minutos no sustituye una prueba de autonomía de 24 horas con cron desplegado, reinicio de proceso y monitoreo externo.

## Actualización posterior — golden flow implementado parcialmente

El manifest ahora publica `nextEvent` cuando existe una ronda futura del mismo juego y `/tv` muestra su disponibilidad para preparar la siguiente interacción. El QR visible en TV y overlay se deriva de `manifest.qr`; en `/juegos/:game` el parámetro `round` fija el contexto de reserva y evita cambiar silenciosamente a otra ronda.

El recorrido queda técnicamente encadenado en contrato y UI, pero continúa **parcialmente demostrado**: no se ejecutó una sesión única de quince minutos con escaneo físico, dos dispositivos reales, cierre autoritativo, resultado, verificación y transición observada de punta a punta. La simulación de 24 horas valida idempotencia de claims, no sustituye esta prueba de experiencia ni la certificación de hardware.
