# MiLukita — Auditoría maestra de experiencia UX

**Orden:** 43-B · **Fecha de auditoría:** 26 de agosto de 2026 · **Estado:** diagnóstico, sin implementar soluciones.

## 1. Alcance y criterio de auditoría

Esta auditoría evalúa si el sistema actual se comporta como una experiencia integrada de entretenimiento digital y no solamente como un conjunto de módulos. El recorrido de referencia es:

> TV → Lukita → QR → celular → evento → interacción → cierre → resultado → verificación → siguiente evento.

La revisión se hizo contra el código disponible, los contratos compartidos, las pruebas existentes, la documentación operativa y una inspección del entorno de preview. No se modificaron RNG, RTP, reglas, wallet, liquidación, Event Store autoritativo, MJP CORE, MjpTvManifest, autoridad de resultados ni permisos de agentes.

## 2. Veredicto ejecutivo

La arquitectura tiene **buenas separaciones de autoridad y contratos útiles**, especialmente en MjpTvManifest, QR firmado, verificación pública, modo contingencia y el principio de que Lukita no decide resultados. Sin embargo, la experiencia integrada aún no está demostrada como una máquina autónoma de 24 horas. El sistema actual funciona mejor descrito como **monolito modular con piezas de emisión, operación y validación**, algunas implementadas y otras preparadas o conceptuales.

El bloqueo más visible de la auditoría fue el entorno de preview: el navegador recibió el título de MiLukita pero mostró un viewport blanco y registró respuestas 429 sobre solicitudes repetidas de analítica. Esto impide validar el primer minuto de forma confiable desde ese canal y debe separarse entre una falla de infraestructura/proxy y una fragilidad de aplicación: el 429 pertenece al servicio de solicitudes, pero la aplicación no degrada la telemetría de forma suficientemente aislada.

| Área | Estado observado | Conclusión |
|---|---|---|
| Identidad MiLukita | Implementada en marca y documentación | Consistente en páginas revisadas; Lukita no es autoridad |
| TV y modos | Implementado | Selector en vivo/en línea y salida existen |
| QR firmado | Implementado en backend para ronda abierta | No está proyectado de forma completa dentro del manifest ni de `/tv` |
| MjpTvManifest | Contrato y proyección implementados | La proyección deja QR y siguiente evento desactivados por defecto |
| Celular/interacción | Implementado por rutas de juego | El encadenamiento TV → QR → experiencia móvil no está probado en dispositivo real |
| Resultado/verificación | Implementado | Fuente autoritativa separada y verificable |
| Contingencia audiovisual | Implementada en `/tv` | Conserva consulta y muestra recuperación; no equivale a autonomía total |
| Lukita en TV | Concepto y visor independiente implementados | No existe integración pública; esto es correcto para el gate actual |
| Scheduler | Motor de propuesta/validación implementado | No hay evidencia de worker persistente de 24 horas |
| Autopilot/Watchdog | Health check y kill switch implementados | Autopilot solo realiza `health_check_only` |
| KILL LUKITA | No existe como prueba runtime específica | Solo puede inferirse la separación arquitectónica |
| Safari iOS/Android TV | No certificado | Cobertura actual automatizada es Chromium |

## 3. Inventario de pantallas y superficies

| Superficie | Propósito | Entrada | Salida/autoridad | Estado UX |
|---|---|---|---|---|
| `/` | Descubrimiento y primer acceso | Usuario nuevo | Navegación y contexto de piloto | Implementada; preview presentó viewport blanco durante esta auditoría |
| `/tv` | Canal virtual y selector de modo | Modo en vivo/en línea | Manifest, estado de señal, historial y enlaces | Implementada; depende de ronda y, para video, de `?v=` |
| `/overlay/:roundId` | Overlay para emisión/OBS | `roundId` | Manifest, contador, resultado y QR mientras está abierta | Implementada; QR se consulta aparte |
| `/juegos/:game` | Participación e interacción | Navegación o QR | Juego y reserva/liquidación virtual | Implementada según módulos existentes |
| `/verificar` | Evidencia pública | Ronda/URL de verificación | Resultado reproducible y estado | Implementada |
| `/lukita-3d` | Revisión de preproducción | Acceso directo | Mock/modelo, Identity Lock, anotaciones y capturas locales | Implementada y aislada; acceso afectado por 429 en preview |
| `/control-room` | Operación y gobernanza | Rol administrativo | Scheduler, watchdog, kill switch, matriz de agentes y guiones | Implementada; autenticación/rol necesarios |
| `/operacion` | Operación de rondas y reglas | Rol operativo | Gestión operativa | Implementada según módulos existentes |
| `/perfil` | Perfil, KYC neutral y juego responsable | Usuario autenticado | Preferencias y estados simulados | Implementada según documentación del piloto |
| `/billetera` | Créditos virtuales | Usuario autenticado | Saldo e historial virtual | Implementada; sin dinero real |
| `/rtp` y `/transparencia` | Transparencia matemática | Público | RTP y reglas | Implementadas |
| `/aprender` | Práctica sin impacto en wallet | Público | Simulación | Implementada |
| `/lotes` | Historial de lotes/comprobantes | Usuario autenticado | Evidencia virtual | Implementada |
| `/multimarket` | Contratos virtuales curados | Usuario autenticado | Interacción moderada | Implementada con límites documentados |

## 4. Auditoría del primer minuto

El primer minuto ideal tiene cinco pasos: entender que es un piloto virtual, elegir la modalidad, comprender que el servidor manda, entrar a la experiencia, y encontrar un siguiente paso claro. La interfaz contiene avisos de créditos virtuales, guía táctil, instalación PWA y navegación principal. En `/tv`, la pantalla inicial ofrece **Ver transmisión en vivo**, **Ver en línea** y **Salir al portal**.

La evidencia de preview no permite aprobar este flujo con confianza: el navegador mostró título correcto, pero el viewport quedó blanco y no detectó elementos interactivos. Los logs registraron solicitudes 429 a `operations.recordProductEvent` en el arranque. La hipótesis más probable es una interacción entre el proxy/límite de solicitudes y el patrón de telemetría del cliente, no una prueba suficiente de que todos los usuarios reales vean blanco. Hasta aislar telemetría y repetir en un navegador limpio, el primer minuto debe considerarse **no certificado**.

## 5. Auditoría TV → QR → celular → evento

El backend construye la ronda pública desde la base de datos y la convierte en un manifest cuya fuente autoritativa es MJP CORE. `createRoundQr` firma el payload, exige ronda `open`, incorpora `roundId`, `eventId`, `experienceId`, URL de juego, URL de verificación y expiración en `closeAt`. Las pruebas existentes verifican firma, manipulación, versión y expiración [1] [2].

La integración no está completa en una sola cadena de pantalla. `BroadcastOverlayPage` consulta el QR por separado cuando la ronda está abierta, mientras `BroadcastPage` consulta rondas y manifest pero no muestra un QR de participación propio. Además, `buildMjpTvManifest` genera `qr.available: false`, `targetUrl: null` y `signed: false` por defecto. Por ello, existe backend QR seguro, pero no evidencia de que todo evento público tenga QR proyectado dentro del manifest y visible en `/tv`.

| Tramo | Evidencia | Diagnóstico |
|---|---|---|
| TV selecciona modo | `TvModeStartScreen` y E2E de cambio de modo | PASS funcional en Chromium |
| TV recibe evento | `broadcast.rounds` + `broadcast.manifest` | PASS condicionado a ronda disponible |
| TV muestra QR | QR separado en overlay; no en `/tv` | P1: cadena pública incompleta |
| Celular abre experiencia | Payload QR contiene URL de juego | PASS de contrato; falta prueba física |
| Interacción | Rutas de juego y créditos virtuales | PASS modular; no probado como flujo de 15 minutos |
| Cierre | Estado autoritativo en backend | PASS de arquitectura |
| Resultado | Manifest/round y verificación pública | PASS de separación de autoridad |
| Siguiente evento | `nextEvent.available` queda falso en builder | P1/P2: continuidad no demostrada |

## 6. Lukita como identidad, presentadora y companion

Lukita está correctamente definida como anfitriona virtual adulta, profesional y no autoritativa. La documentación establece que recibe el estado desde MjpTvManifest y nunca puede producir números, decidir ganadores, calcular premios, modificar reglas, abrir/cerrar rondas o sustituir verificación [3]. El visor `/lukita-3d` es independiente y se mantiene en Preview / Review; esta separación es correcta para preproducción.

La experiencia pública actual no muestra evidencia de una instancia de Lukita dentro de `/tv`, Home o Overlay. Desde la perspectiva de la Orden 43-B esto tiene una lectura doble: reduce riesgo de dependencia circular y respeta la orden de mantener la integración oficial bloqueada, pero significa que el recorrido TV → Lukita todavía no está implementado como experiencia integrada.

| Momento | Debería aparecer Lukita | Debería desaparecer o reducirse |
|---|---|---|
| Introducción | Presentar canal, juego y reglas resumidas | No cubrir título ni estado |
| Apertura/QR | Acompañar llamada a participar | No tapar QR, countdown ni URL |
| Interacción | Servir de guía/companion no autoritativa | No improvisar resultados |
| Cierre | Acompañar suspense | Ceder prioridad al estado del servidor |
| Resultado | Celebrar solo después de manifest verificado | No anunciar antes de verificación |
| Contingencia | Comunicar recuperación con copy aprobado | No inventar causa, premio o tiempo |
| Verificación | Recordar `/verificar` | No sustituir el expediente público |

## 7. KILL LUKITA

No existe una prueba runtime específica que apague únicamente a Lukita y ejecute el recorrido completo. Sí existe separación documental: MJP CORE es la fuente autoritativa, el manifest es consumido por clientes y el visor 3D no tiene autoridad sobre rondas. El kill switch operativo de `server/autonomy.ts` detiene automatización mediante `STOPPED`, pero no es un interruptor específico del personaje.

**Resultado diagnóstico:** la independencia arquitectónica es PASS; la demostración operativa “KILL LUKITA y el evento continúa” es NOT PROVEN. La solución futura deberá probar que, al quitar host/guion/asset de Lukita, TV, QR, interacción, cierre, resultado y verificación continúan sin error y sin cambio de autoridad. No se implementa en esta orden.

## 8. Scheduler, autonomía de 24 horas y conflictos

`schedulerEngine.ts` puede proponer, validar, aprobar y publicar bloques. Exige aprobación humana para la propuesta y bloquea si faltan ruleset, RTP, experiencia, contingencia, contenido, TV, móvil o recursos. `scheduledGames.ts` expone un handler protegido para una invocación cron autenticada. `runSafeAutopilotHeartbeat` registra únicamente `health_check_only` y queda bloqueado por el kill switch.

No se encontró evidencia de un worker persistente, heartbeat continuo, cola de 24 horas o proceso que encadene automáticamente apertura, QR, cierre, sorteo, liquidación, verificación y siguiente evento. El sistema está **preparado para orquestación supervisada**, no demostrado como autónomo continuo.

También se detecta una posible inconsistencia de duración: un bloque puede declarar `durationMinutes` y contener `OPENING + GAME + RESULT + TRANSITION` cuya suma excede esa duración en eventos cortos. El validador revisa solapamientos y requisitos, pero no valida expresamente que la suma de ítems coincida con la duración del bloque.

## 9. Estados, QR y contingencias

El contrato MjpTvManifest declara estados `SCHEDULED`, `OPEN`, `LOCKED`, `DRAWING`, `RESULT_VERIFIED`, `COMPLETED`, `CANCELLED`, `RECOVERY` y `DISCONNECTED`. La construcción normal del manifest mapea rondas a los estados de negocio principales, pero `RECOVERY` y `DISCONNECTED` se usan principalmente como estados de fixture/UI; el builder normal fija `recovery.mode: NORMAL`, `nextEvent.available: false` y QR no disponible. La UI `/tv` sí tiene mensaje de contingencia audiovisual, reconexión cada 10 segundos y enlaces a verificación.

El resultado es una buena separación entre señal audiovisual y autoridad del servidor, pero no una cobertura demostrada de cada transición. El riesgo principal es que existan estados de contrato sin una transición operacional completa o eventos sin QR visible.

## 10. Hallazgos priorizados

| ID | Prioridad | Problema | Evidencia | Impacto | Solución futura (no implementada) | Dependencia |
|---|---|---|---|---|---|---|
| UX-01 | P1 alto | El primer minuto no es reproducible en preview por viewport blanco | Captura sandbox y logs 429 de telemetría | Un usuario puede no llegar a escoger juego o modo | Aislar telemetría, aplicar backoff/circuit breaker y repetir en navegador limpio | Infraestructura proxy + ProductAnalyticsBeacon |
| UX-02 | P1 alto | `/tv` no presenta el QR de participación como parte del manifest público | `buildMjpTvManifest` deja `qr.available=false`; `/tv` no consulta QR | Se rompe TV → QR → celular en el punto más importante | Definir proyección QR única y prueba de evento abierto | MjpTvManifest + backend broadcast |
| UX-03 | P1 alto | No está demostrada la autonomía de 24 horas | Cron handler y heartbeat solo de salud; no worker persistente | No se puede afirmar emisión autónoma continua | Diseñar scheduler runtime supervisado, idempotencia y observabilidad | Infraestructura persistente + aprobación operativa |
| UX-04 | P1 alto | KILL LUKITA no está demostrado como prueba runtime | No hay kill específico del host; solo kill switch general | No se prueba que el producto sobreviva sin personaje | Ejecutar escenario de apagado de host con golden flow | TV Client + MjpTvManifest + QA |
| UX-05 | P1 alto | Descarga de imagen no está certificada en Safari iOS ni Android TV | E2E usa Chromium y `page.waitForEvent('download')` | Puede fallar por restricciones de `toDataURL`, `anchor.click` o WebView | Probar matriz física y fallback Blob/share/save | Navegadores y hardware reales |
| UX-06 | P2 medio | `nextEvent` no está poblado en el builder normal | `nextEvent.available=false` | La continuidad “siguiente evento” queda sin cierre UX | Resolver siguiente evento desde scheduler/manifest | Scheduler + backend |
| UX-07 | P2 medio | RECOVERY/DISCONNECTED están más completos en fixtures que en proyección real | Builder fija recuperación NORMAL | Mensajes pueden no reflejar estados de backend | Definir transiciones y contrato de recuperación real | MjpTvManifest + runtime |
| UX-08 | P2 medio | La suma de ítems puede exceder la duración declarada del bloque | `scheduleEngine` no compara suma de items con `durationMinutes` | Programación inconsistente o cortes superpuestos | Validar duración interna y transiciones | Scheduler |
| UX-09 | P2 medio | Lukita está documentada y aislada, pero no integrada en TV | `/tv` no renderiza host; visor independiente | La experiencia aún no es “TV → Lukita” | Solo después de aprobación estética/productiva y gate de integración | Propietario + producción 3D |
| UX-10 | P2 medio | El mecanismo de analítica registra eventos individualmente y recibe 429 en batch | `events.forEach(record.mutate)` | Riesgo de presión al backend y ruido en arranque | Cola con deduplicación y envío tolerante a rate limit | Product analytics |
| UX-11 | P3 bajo | Temas y nudges dependen de localStorage | Componentes PWA/TV | Persistencia desigual en modo privado/TV WebView | Fallback de preferencias y telemetría de fallos | Plataforma |
| UX-12 | P3 bajo | Polling no equivale a tiempo real certificado | `/tv` 5–10 s; overlay 5 s; QR 15 s | Latencia de aviso puede variar | Medir timestamps o adoptar canal realtime después de evidencia | Observabilidad |

## 11. Dependencias circulares

No se observa una dependencia circular autoritativa entre Lukita y MJP CORE. El flujo documentado es `Round Engine → Draw Engine → Rule Engine → Credit/Settlement → Audit/Verify → MjpTvManifest → TV/Web/Overlay/Lukita`. Lukita consume una proyección; MJP CORE no consume la decisión visual de Lukita. Esta parte es **PASS arquitectónico**, con la salvedad de que la integración pública del personaje está bloqueada y, por tanto, no existe todavía una prueba runtime completa.

## 12. Conclusión independiente

Está realmente bien diseñado el aislamiento de autoridad, la firma y expiración del QR, la verificación pública, el modo virtual y la separación del visor 3D. Aún no está demostrado como experiencia integrada la unión TV–Lukita–QR–celular ni la autonomía continua de 24 horas. La mayor señal de humo sería afirmar que existe “autonomía” solo porque existen tipos, fixtures, endpoints y un health check. La próxima evaluación debe priorizar un golden flow reproducible, una prueba KILL LUKITA, la proyección QR única y pruebas físicas multiplataforma.

## Referencias internas

[1]: ../server/broadcast.ts "Backend de broadcast, QR firmado y estados de ronda"
[2]: ../server/broadcast.test.ts "Pruebas de seguridad e identidad del QR"
[3]: ./LUKITA_MASTER_CHARACTER_GUIDE.md "Guía maestra de identidad y autoridad de Lukita"
[4]: ../shared/tvManifest.ts "Contrato MjpTvManifest v1"
[5]: ../server/schedulerEngine.ts "Propuesta, validación, aprobación y publicación de programación"
[6]: ../server/autonomy.ts "Watchdog, autopilot de health check y kill switch operativo"
[7]: ../client/src/components/ProductAnalyticsBeacon.tsx "Registro de eventos de retención"
[8]: ../server/tvOverlay.e2e.test.ts "Cobertura E2E de Chromium para TV, overlay y PNG"

## 13. Validación técnica ejecutada

Los comandos solicitados se ejecutaron en el entorno local el 26 de agosto de 2026 y quedaron registrados en `_audit_43_validation.log`.

| Comando | Resultado exacto | Lectura de auditoría |
|---|---|---|
| `pnpm check` | `CHECK_EXIT=0` | TypeScript/check aprobado |
| `pnpm test` | `TEST_EXIT=1`; 40 archivos pasaron, 1 falló, 1 omitido; 127 pruebas pasaron, 4 omitidas; 1 falló | No se puede declarar la suite verde |
| `pnpm build` | `BUILD_EXIT=0` | Build aprobado, con warning de asset `/manus-storage/ruleta-peru-hero_7732dc7d.png` no resuelto en build y chunk de `Lukita3DStudioPage` de 739.35 kB |

El fallo de test es reproducible en `server/api.e2e.test.ts`: `games.reserveTicket` esperaba HTTP 200, pero recibió HTTP 500 con el mensaje **“La participación está cerrada para esta ronda.”**. Se registra como evidencia de consistencia temporal/fixture E2E y no se corrige en esta Orden porque el mandato es diagnosticar y no implementar soluciones.

## 14. Estado de la optimización de descarga multiplataforma

La función de captura existente tiene cobertura E2E en Chromium mediante `page.waitForEvent("download")` y valida el nombre `mjp-manifest-*.png`. No se ejecutó Safari iOS ni Android TV real en esta auditoría. Por tanto, la compatibilidad solicitada no está certificada. El riesgo se clasifica como **P1** hasta probar `canvas.toDataURL`, `Blob`, descarga iniciada por gesto, almacenamiento y restricciones de WebView en hardware objetivo.

## 15. Corrección posterior del fixture E2E

Se corrigió exclusivamente `server/api.e2e.test.ts`: antes de reservar, el test captura estado y fechas de las rondas seleccionadas, las abre temporalmente con una ventana de prueba de una hora y restaura los valores originales en `finally`. El cambio no modifica rondas persistentes fuera del aislamiento de la prueba.

La prueba focalizada pasó: `server/api.e2e.test.ts` — 2 tests aprobados. La suite completa posterior también pasó: **41 archivos aprobados, 1 omitido; 128 pruebas aprobadas, 4 omitidas; `FULL_TEST_EXIT=0`**.

La corrección confirma que el fallo anterior era un problema de fixture/ventana temporal de E2E, no una autorización para relajar la regla de cierre de rondas. `games.reserveTicket` sigue rechazando una ronda cerrada; la prueba ahora prepara explícitamente una ronda abierta y restaura el estado al finalizar.

## 16. P0 y propuesta de interfaz

No existen P0 registrados en esta auditoría. Se creó `MILUKITA_P0_TV_CELULAR_UX_PROPOSAL.md` con las propuestas conceptuales priorizadas para QR único, entrada móvil confirmada, estado común TV/celular, cierre, siguiente evento y contingencia. Estas propuestas son diagnóstico y diseño; no se implementaron.

## 17. Seguimiento Orden 44

La Orden 44 confirmó que la corrección de `games.reserveTicket` corresponde al **Caso A: fixture/test incorrecto**, no a un defecto de producción. El fixture ahora abre temporalmente las rondas seleccionadas, ejecuta la reserva bajo una ventana válida y restaura estado y fechas en `finally`. La lógica productiva continúa rechazando correctamente la participación cuando la ronda está cerrada.

Las auditorías específicas de QR/nextEvent, plataformas y autonomía quedan separadas en `MILUKITA_QR_NEXT_EVENT_AUDIT.md`, `MILUKITA_PLATFORM_COMPATIBILITY.md` y `MILUKITA_AUTONOMY_AUDIT.md`. Sus conclusiones no convierten en certificados los puntos que requieren hardware físico, runtime KILL LUKITA o una fuente real de siguiente evento.

## 12. Actualización de mitigaciones técnicas

La telemetría del cliente ahora aplica deduplicación por `idempotencyKey`, backoff exponencial acotado y descarte silencioso después de reintentos ante `429`, timeout o abortos. Esto evita que el registro de retención bloquee la experiencia principal, aunque el entorno de preview debe verificarse nuevamente.

El QR firmado se proyecta en `manifest.qr` para rondas abiertas, incluyendo URL, expiración, versión, firma, payload e imagen; `/tv` y `/overlay/:roundId` consumen esa misma fuente. El endpoint QR se conserva como adaptador compatible. `nextEvent` sigue pendiente.

El worker supervisado registra claims por tarea y cubeta UTC de un minuto, respeta `STOPPED`, reutiliza el ciclo autorizado del core y deja evidencia de error/completado. Esto mitiga duplicados, pero no certifica 24 horas continuas sin evidencia de despliegue, reinicio y monitoreo externo.

La descarga de imágenes usa Blob con fallback de pestaña o navegación para Safari iOS y navegadores sin `download`; la estrategia Android TV está cubierta por pruebas unitarias, no por hardware físico.

## 18. Seguimiento de la implementación QR + nextEvent + autonomía

Se implementó la continuidad de `nextEvent` en el builder del `MjpTvManifest`: se consulta la siguiente ronda futura del mismo juego y se expone su identidad y hora programada. `/tv` muestra el acceso para preparar la siguiente ronda; `/juegos/:game` fija la reserva al `roundId` recibido por QR y evita sustituir silenciosamente el evento conectado. El indicador de TV distingue QR válido, vencido, pendiente de validación e inactivo, además del estado de conexión del manifest.

Se añadió `scripts/simulate-autonomy-24h.mjs`, ejecutado con resultado **PASS**: 1.440 ticks, 2.880 intentos, 1.440 claims únicos, 1.440 duplicados esperados y claves estables. Esta evidencia confirma la política de idempotencia en una simulación determinista, pero no certifica cron desplegado, base de datos real, carga, latencia, reinicio, disponibilidad 24/7 o hardware físico.

El estado consolidado pasa de “contrato QR incompleto y nextEvent no implementado” a **QR unificado implementado, nextEvent implementado en proyección y worker supervisado implementado**. Permanecen pendientes: golden flow único de quince minutos con dispositivos reales, KILL LUKITA runtime, certificación Safari iOS/Android TV y evidencia operativa de 24 horas.

## 19. Mejoras posteriores — exportación y estados TV/móvil

El Control Room permite exportar la simulación determinista de autonomía en CSV y PDF. El CSV conserva todas las muestras y el PDF resume el resultado, una muestra acotada y las limitaciones; ambos incluyen hash SHA-256, tamaño, MIME y nombre de archivo para auditoría.

La pantalla TV muestra mensajes diferenciados cuando el QR está vencido, no tiene imagen escaneable o requiere una validación adicional. En esos casos no presenta un código engañoso y orienta al usuario a solicitar un QR actualizado o abrir el evento manualmente cuando el contexto lo permite.

La pantalla móvil, al abrirse desde `?round=`, muestra una carga explícita mientras verifica la ronda y su siguiente evento. Si la resolución falla o el QR no corresponde al juego, ofrece reintento y entrada sin QR, sin cambiar silenciosamente el evento conectado.

Estas mejoras están cubiertas por TypeScript y pruebas del exportador; la compatibilidad física de escaneo, descarga y comportamiento en Safari iOS/Android TV continúa NO CERTIFICADA por falta de hardware objetivo.

## 20. Vista previa de exportación y expiración visible del QR

El panel operativo ahora abre una ventana modal de vista previa antes de exportar la simulación de autonomía. La modal muestra el resultado PASS/FAIL, ticks, claims únicos, cantidad total de muestras, una muestra inicial y las limitaciones. La decisión de exportar CSV o PDF se realiza dentro de la misma ventana, evitando descargas accidentales y haciendo visible el alcance de la evidencia.

En `/tv`, el QR válido incluye una cuenta regresiva actualizada cada segundo con el tiempo restante hasta `expiresAt`, además del horario de vencimiento. Al llegar a cero, el sistema cambia a estado vencido, retira la presentación escaneable y comunica que se debe esperar un QR actualizado. Esta experiencia sigue pendiente de prueba física con dispositivos reales.

## Orden 45-B — Implementación del QR circular y experiencia TV

Se incorporó `client/src/components/MiLukitaCircularQR.tsx` como capa de presentación sobre `manifest.qr`. El componente soporta las variantes `central` (L Central), `circle` (L en Círculo) e `integrated` (L Integrada). La utilidad `shared/circularQr.ts` conserva sin cambios `imageDataUrl`, `payload`, `targetUrl`, `verifyUrl`, `expiresAt`, `signed` y `available`; `shared/circularQr.test.ts` verifica la invariancia del payload y del destino entre las tres variantes. La implementación incluye fallback visual cuando el QR no está disponible o la imagen falla, pero la certificación de escaneo físico continúa pendiente.

La vista `/tv` ahora incorpora una composición en dos zonas: una zona principal con la transmisión YouTube cuando existe o con acompañamiento interactivo de Lukita cuando no existe, y un panel lateral persistente con selector de variante, QR, estado de validez y tiempo restante. `/overlay/:roundId` utiliza también la capa circular para mantener coherencia en el flujo TV → QR → celular. La presentación ejecutiva queda disponible en `manus-slides://VeC7NYurUjuRACrxmQcGxT`.

La recomendación operativa es mostrar el temporizador desde el primer segundo usando `expiresAt` del servidor; reforzarlo durante los últimos 3 minutos; mostrar urgencia durante los últimos 30 segundos; y retirar el código al llegar a cero sin detener el contenido principal. La captura automática de preview estuvo cubierta por la guía inicial de controles táctiles, por lo que no se considera evidencia de escaneo ni certificación de hardware.

**Validación:** `pnpm check` aprobado; `pnpm test -- --run` aprobado con 48 archivos aprobados, 1 omitido, 150 pruebas aprobadas y 4 omitidas; `pnpm build` aprobado. La certificación en Safari iOS, Android TV, distancias, reflejos, ángulos y escaneo físico sigue siendo un gate posterior.

## 21. Mejoras audiovisuales y pruebas físicas de QR
La zona principal de `/tv` admite ahora un video promocional corto mediante el parámetro seguro `promoVideo` con URL HTTPS validada; cuando no se proporciona video, mantiene el carrusel textual de acompañamiento. El video se reproduce en modo muted, loop y playsInline, con controles disponibles para revisión. Esta capacidad es de presentación y no altera MjpTvManifest ni la autoridad del evento.

El panel de pruebas QR puede activarse únicamente mediante `?tvTest=1` o el atajo `Alt+Shift+Q`. Mientras permanece activo se muestra un indicador discreto `Modo prueba QR · TV TEST` en la esquina superior y se permite alternar las tres variantes visuales. El indicador evita confundir una prueba física con una emisión pública normal.

El panel lateral incorpora un anillo de progreso calculado desde `expiresAt` y el tiempo restante del QR. El helper `getQrProgressPercent` limita el valor entre 0 y 100; el payload, la firma, la URL y la expiración siguen proviniendo del QR autoritativo. Se añadieron pruebas unitarias para progreso completo, intermedio, cero y límites superiores.

La consulta sobre adquirir un asset 3D base para Lukita se considera **FACTIBLE COMO ACELERADOR TÉCNICO**, no como sustituto de identidad. Se recomienda usar un asset humano adulto estilizado con licencia comercial explícita, sin rasgos o marcas de terceros, conservar factura/licencia/autoría, adaptarlo al diseño maestro `LUKITA-A+B+C-2D-APPROVED-01`, mantenerlo en Preview/Review y ejecutar Identity Lock Test antes de cualquier integración pública. Los modelos con licencia editorial o sin derechos comerciales verificables deben descartarse. La decisión documentada y las fuentes están en `docs/research-asset-3d-licensing-2026.md`.

**Validación de esta iteración:** `pnpm check` aprobado; pruebas focalizadas de QR 6/6 aprobadas; suite previa completa 150/150 aprobadas con 4 omitidas; build aprobado. La prueba visual confirmó el indicador de modo TV TEST. La certificación física de reproducción de video, escaneo a distancia y compatibilidad Safari iOS/Android TV continúa pendiente.

## 22. Candidate Asset Preview y mejoras audiovisuales
Se implementó en `/lukita-3d` una ficha visible `Candidate Asset Preview` para revisar un asset 3D antes de cualquier integración. La ficha identifica el origen y formato del candidato, muestra el estado de elegibilidad y exige cuatro gates locales: licencia comercial verificable, procedencia/originalidad, Identity Lock Test y aptitud técnica. El resultado “Listo para revisión humana” no significa aprobación estética, producción ni publicación. La regla compartida `isCandidateReadyForHumanReview` está cubierta por pruebas y bloquea assets identificados como terceros o no elegibles.

En `/tv`, el video promocional corto configurable mantiene reproducción silenciada por defecto y ahora incluye control explícito para activar o silenciar el audio. La preferencia se conserva localmente en el dispositivo de prueba; en una emisión pública deberán definirse piezas oficiales y política de audio. La barra circular del QR conserva su cálculo basado en `expiresAt` y cambia a rojo cuando quedan menos de 30 segundos, con helper y pruebas de límites.

La decisión de arquitectura mantiene la propuesta original de usar un asset base para acelerar la producción, pero añade un gate de procedencia, licencias, identidad y rendimiento antes de aceptar candidatos. Lukita continúa en Preview/Review y no se habilita integración pública, voz, TTS, lip-sync ni producción final sin aprobación humana.

## 23. Carga externa de candidatos y confirmación de QR

`/lukita-3d` incorpora un formulario de prueba para registrar una URL externa HTTPS directa a un archivo `.glb` o `.gltf`. La URL se añade únicamente al historial local de Preview/Review; no se descarga al servidor, no modifica el modelo maestro y no habilita integración pública. Si el origen remoto bloquea CORS o no entrega un modelo válido, el visor conserva un fallback procedural y el candidato queda sujeto a revisión.

`/tv` muestra ahora la notificación “QR actualizado correctamente” cuando cambia la proyección de QR y el nuevo código está disponible, firmado y dirigido a una ronda. El mensaje se basa en la comparación de la clave QR del manifest y no crea un estado paralelo ni modifica el payload autoritativo.

## 24. Controles de revisión, confirmación QR y filtros de checklist
La vista previa de candidatos de `/lukita-3d` incorpora controles explícitos para rotación y zoom del modelo seleccionado. Los botones de giro de ±45°, frontal y restablecimiento, junto con el control de zoom, solo modifican la cámara de la previsualización local; no alteran el asset, el modelo maestro ni el estado productivo. `LukitaBlockoutViewer` acepta ahora `cameraAzimuth` y mantiene interacción directa por arrastre y rueda.

El aviso `QR actualizado correctamente` de `/tv` se muestra con entrada y desvanecimiento suave y se elimina automáticamente después de cinco segundos. El ciclo se cancela si el operador lo cierra manualmente y respeta `prefers-reduced-motion`.

El checklist de Candidate Asset Preview permite filtrar `Todos`, `Aprobados` y `Pendientes`. La misma selección gobierna la lista visible y las exportaciones PDF/CSV, evitando que un informe filtrado incluya candidatos fuera del estado solicitado. La clasificación compartida distingue un candidato listo para revisión humana de uno pendiente o no elegible; ningún estado equivale a aprobación estética o productiva.

**Validación de esta iteración:** `pnpm check` aprobado; pruebas focalizadas de contratos Lukita-3D, QR y manifest aprobadas; `pnpm build` aprobado. La compatibilidad física del visor, la carga de assets externos con CORS real y el escaneo QR en dispositivos físicos permanecen como gates posteriores.
