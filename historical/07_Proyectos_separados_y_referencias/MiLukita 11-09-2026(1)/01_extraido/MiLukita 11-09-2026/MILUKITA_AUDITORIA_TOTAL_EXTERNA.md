# MiLukita — Expediente único de auditoría externa

**Proyecto:** `ruleta-peru-online`  
**Marca:** MiLukita  
**Anfitriona:** Lukita, personaje virtual no autoritativo  
**Fecha de corte:** 27 de agosto de 2026  
**Último checkpoint:** `manus-webdev://955b21ed`  
**Estado operativo:** piloto gratuito en preproducción; créditos exclusivamente virtuales; sin dinero real, retiros, convertibilidad ni pagos operativos  
**Autor del expediente:** Manus AI

> Este documento es un expediente técnico de auditoría, no una certificación legal, regulatoria, de RNG, de seguridad, de disponibilidad ni de compatibilidad física. Distingue deliberadamente entre existencia en código, prueba automatizada, validación local y certificación externa.

---

## 1. Propósito y alcance

El objetivo es permitir una revisión externa independiente del sistema MiLukita en un solo archivo. El expediente resume qué existe, dónde está implementado, qué fue probado, qué evidencia se obtuvo, cuáles son las limitaciones, qué elementos permanecen pausados y qué condiciones deben cumplirse antes de cualquier operación pública o monetización.

El alcance cubre el núcleo de juegos virtuales, rondas, reglas, RNG, RTP, créditos, auditoría, TV, QR, celular, TV en línea, WebSocket, autonomía, Heartbeat, Watchdog, Auditor, Recovery, Kill Switch, Lukita 3D, seguridad, PWA, documentación y QA.

## 2. Criterios de clasificación

| Estado | Significado para la auditoría |
|---|---|
| **IMPLEMENTADO** | Existe código integrado y compilable en el repositorio. |
| **PROBADO** | Existe una prueba automatizada o una ejecución reproducible que cubre el comportamiento descrito. |
| **VALIDADO LOCALMENTE** | Se ejecutó en el sandbox o navegador local con resultado documentado. |
| **PARCIAL** | Existe una base funcional, pero falta una parte esencial del alcance. |
| **PREPARADO** | Hay código, contrato o runbook listo, pero falta ejecución en el entorno objetivo. |
| **PAUSADO** | El propietario pidió expresamente no ejecutar esa actividad. |
| **NO VERIFICABLE** | No existe evidencia suficiente en el entorno disponible para afirmar funcionamiento. |
| **BLOQUEADO** | Deliberadamente excluido por seguridad, producto o regulación. |

## 3. Resumen ejecutivo

MiLukita es actualmente una plataforma de entretenimiento digital con juegos virtuales, una experiencia de TV, interacción móvil mediante QR, contratos compartidos, pruebas server-side y herramientas de observabilidad. No es todavía una operación pública certificada ni una plataforma de dinero real.

La arquitectura conserva una separación correcta entre presentación y autoridad: el servidor determina estados y resultados; la TV y el celular presentan proyecciones; Lukita funciona como anfitriona; Watchdog solo alerta; Auditor solo observa y reporta; el Kill Switch detiene el ciclo; y los créditos no tienen valor monetario declarado.

La principal conclusión externa es doble. Primero, existe una base técnica amplia y comprobable. Segundo, no debe confundirse amplitud funcional con preparación operativa: faltan staging persistente, prueba de dos procesos reales contra base compartida, QA físico multidispositivo, certificación independiente del RNG, revisión legal y evidencia sostenida de 24 horas.

| Área | Estado actual | Dictamen externo |
|---|---|---|
| Núcleo de juegos virtuales | IMPLEMENTADO / PROBADO | Revisable localmente |
| Reglas y resultados verificables | IMPLEMENTADO | Requiere revisión independiente antes de monetización |
| Créditos | IMPLEMENTADO | Piloto virtual; sin retiros ni conversión |
| TV, overlay y QR | IMPLEMENTADO / PROBADO LOCALMENTE | Escaneo físico aún no certificado |
| TV en línea | IMPLEMENTADO en primera versión | Requiere endurecimiento operativo y QA |
| WebSocket | IMPLEMENTADO / PROBADO LOCALMENTE | Multiinstancia real pendiente |
| Heartbeat y Watchdog | IMPLEMENTADOS en runtime y contratos | Staging persistente PAUSADO |
| Auditor READ_ONLY | IMPLEMENTADO / PROBADO localmente | Auditoría externa aún pendiente |
| Recovery y Kill Switch | Implementados en lógica y UI | Prueba operativa externa pendiente |
| Autonomía 24/7 | SIMULADA | No equivale a operación continua real |
| Lukita 3D | Preview/review y blockout técnico | No producción final |
| RNG | PRNG/software | Certificación independiente pendiente |
| Dinero real/Yape/retiros | BLOQUEADOS | No forman parte del piloto |

## 4. Límites no negociables

El piloto opera únicamente con créditos virtuales. No deben describirse como soles, dinero, saldo cobrable, activo convertible ni derecho económico. Las referencias internas usadas para calcular tarifas o premios no autorizan conversión ni monetización.

MJP CORE mantiene la autoridad sobre rondas, reglas, RNG, resultados, premios, wallet, settlement y manifest. Ningún agente, interfaz, guion, avatar o cliente puede corregir un resultado oficial ni completar datos ausentes con inferencias presentadas como hechos.

La política incorporada a esta fase es:

> **NO DATA → NO CLAIM**

Cuando una fuente autoritativa no entrega información suficiente, la interfaz debe mostrar una ausencia explícita, por ejemplo: “No hay detalles adicionales disponibles.” No se permite inventar causas, resultados, premios, estados de red o explicaciones operativas.

El flujo obligatorio para discrepancias es:

> **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**

## 5. Arquitectura técnica

| Capa | Implementación principal | Estado |
|---|---|---|
| Frontend | React 19, Vite, Tailwind y componentes UI | IMPLEMENTADO |
| Backend | Express y tRPC 11 | IMPLEMENTADO |
| Persistencia | Drizzle ORM sobre MySQL/TiDB | IMPLEMENTADO |
| Autenticación | Manus OAuth, perfiles y roles | IMPLEMENTADO |
| Realtime | `ws`, lobby y `PlayerSessionManager` | IMPLEMENTADO / PROBADO LOCALMENTE |
| Contratos compartidos | `shared/tvManifest.ts`, `shared/liveChannel.ts`, `shared/onlineTvGames.ts`, `shared/realtime.ts` | IMPLEMENTADO |
| Event Store | `server/eventStore.ts`, eventos operativos idempotentes | IMPLEMENTADO |
| Scheduler | `server/scheduler/SchedulerService.ts`, worker supervisado | IMPLEMENTADO |
| TV | `/tv`, selección vivo/en línea, contingencia, temporizador y QR | IMPLEMENTADO |
| Celular | PWA, estado del sistema y experiencias interactivas | IMPLEMENTADO / PROBADO LOCALMENTE |
| Administración | Control Room, operaciones, auditoría, perfiles y observabilidad | IMPLEMENTADO |
| Lukita 3D | `/lukita-3d`, mock, preview/review, anotaciones y comparaciones | PREPRODUCCIÓN |

### 5.1 Flujo de autoridad

El servidor crea o recupera la ronda o sesión, determina la fase y los límites, valida la interacción, calcula el resultado y registra la evidencia. La TV y el celular consumen proyecciones del estado. El cliente no puede fijar el resultado, el premio, el saldo, el puntaje oficial ni la salud del Boss Fight.

### 5.2 Cadena operativa P1

La cadena diseñada y probada localmente es:

`EVENT → HEARTBEAT → WATCHDOG → AUDITOR → RECOVERY → MJP CORE → TV / MOBILE`

La cadena no autoriza que Watchdog o Auditor muten datos. Recovery puede señalar una recuperación requerida, pero la reanudación de un estado detenido necesita control humano y evidencia.

## 6. Catálogo de juegos

### 6.1 Juegos de sorteo y créditos virtuales

| Familia | Modalidades documentadas o implementadas | Observación |
|---|---|---|
| Ruleta | Piloto, 7, 17, 27 y 37 | Reglas y pruebas virtuales; revisar RTP por versión |
| Lotería | 19, 29, 39, 49 y 59; MJP Extra 39 | La nomenclatura histórica puede aparecer en documentos antiguos; usar la tabla vigente del código |
| Bingo | Flash, Keno, 75/Americano y modalidades del piloto | Selección manual y automática documentada |
| Jackpot | Variantes de participación y pozo virtual | No confundir pozo virtual con dinero real |
| Cartas | Trío 13 | Barajado y verificación virtual |
| Números | Pick 3, Pick 4, Loto Diario y Loto Express | Revisar estado exacto por reglas activas |
| Instantáneo | Raspa Digital | Piloto virtual |
| Premium | Sueldo de por vida | Requiere revisión comercial y regulatoria antes de uso público |

### 6.2 Juegos de TV en línea

| ID técnico | Nombre | Tipo | Estado |
|---|---|---|---|
| `REFLEX` | Toca en el Momento Exacto | Individual | IMPLEMENTADO |
| `PRECISION` | Apunta y Dispara | Individual | IMPLEMENTADO |
| `TRIVIA` | Preguntas y Respuestas | Individual | IMPLEMENTADO |
| `COMBINATION` | Adivina la Combinación | Individual | IMPLEMENTADO |
| `MEMORY` | Memoriza la Secuencia | Individual | IMPLEMENTADO |
| `TEAM_CLOCK` | Todos Contra el Reloj | Cooperativo | IMPLEMENTADO |
| `TEAM_SCORE` | Construyan el Puntaje Más Alto | Cooperativo | IMPLEMENTADO |
| `TRAFFIC_LIGHT` | Semáforo MiLukita | Individual | IMPLEMENTADO |
| `ODD_ONE_OUT` | Encuentra el Intruso | Individual | IMPLEMENTADO |
| `COOP_CODE` | Código Cooperativo | Cooperativo | IMPLEMENTADO |

**Archivos principales:** `server/onlineTvGames.ts`, `server/routers/onlineTvGames.ts`, `shared/onlineTvGames.ts` y `client/src/pages/OnlineTvGamesPage.tsx`.

El Boss Fight cuenta con motor server-side, router protegido, ledger virtual y panel interno. No debe presentarse como experiencia pública completamente integrada mientras no exista el ciclo TV-celular-overlay y su QA operativo.

## 7. Reglas, RNG, RTP y créditos

Las reglas están versionadas y existen simuladores, pruebas de liquidación, comprobantes y verificación pública. Las cifras de RTP siempre deben asociarse a modalidad, versión, tabla de premios, tamaño de muestra y fecha. Un RTP observado no es una garantía individual.

El sistema usa un generador pseudoaleatorio basado en software para las mecánicas del piloto. Esto no constituye certificación. Antes de dinero real se requiere revisar fuente, semillas, distribución, reproducibilidad, protección contra manipulación, separación de entornos, controles de acceso y certificación independiente.

| Control | Estado |
|---|---|
| Saldo virtual | IMPLEMENTADO |
| Movimientos trazables | IMPLEMENTADO |
| Premios virtuales | IMPLEMENTADO |
| Bonificaciones y misiones | IMPLEMENTADO |
| Redondeo documentado | IMPLEMENTADO / PROBADO |
| Hash, semilla y verificación | IMPLEMENTADO |
| Dinero real | BLOQUEADO |
| Retiros | BLOQUEADOS |
| Conversión a soles | BLOQUEADA |
| Yape operativo | NO ACTIVADO |

## 8. TV, manifest, QR y móvil

La ruta `/tv` permite seleccionar entre ver transmisión en vivo y ver experiencia en línea. La TV presenta contenido principal y un panel lateral con estado, QR, temporizador y contingencia. También incluye navegación con teclado o mando, enfoque visible, sonidos sutiles configurables, salvapantallas y guía de acceso.

`MjpTvManifest` está definido en `shared/tvManifest.ts` y conserva a MJP CORE como fuente autoritativa. La proyección incluye evento, estado, countdown, resultado, QR, participación virtual y, para TV en línea, sesión, juego, dificultad, versión de contenido, cooperación, progreso y participantes.

`MiLukitaCircularQR` proporciona tres variantes visuales: L Central, L en Círculo y L Integrada. El payload sigue siendo el contrato autoritativo existente y existe fallback al QR estándar. El panel de pruebas puede activarse según la interfaz documentada. La existencia del componente y sus pruebas de código no equivale a certificación de escaneo físico.

El destino `/estado-sistema` es informativo: muestra el estado público disponible y no ofrece controles administrativos. La pantalla de mantenimiento no inventa detalles si no existe una alerta persistida.

## 9. TV en línea y realtime

El flujo previsto es: TV presenta evento y QR; el usuario escanea; el celular abre la experiencia; el servidor crea o recupera la sesión; el jugador ejecuta `JOIN` y heartbeat; el servidor valida acciones; la TV y el celular reciben proyecciones; el resultado se registra sin modificar la autoridad de MJP CORE.

La primera versión incluye WebSocket, sesiones concurrentes, reconexión, juegos individuales y cooperativos. El riesgo principal pendiente es la coordinación cuando dos instancias de aplicación actualizan simultáneamente una misma sesión. El harness local de doble claim demuestra el contrato lógico de unicidad, pero no reemplaza una prueba con dos procesos reales y base compartida.

## 10. Heartbeat, Watchdog, Auditor y Recovery

### 10.1 Heartbeat

`server/live24Runtime.ts` ejecuta un heartbeat idempotente basado en eventos operativos. Detecta control `STOPPED`, ausencia de base, duplicación de heartbeat y recuperación requerida. La salud pública identifica, entre otros, conectado, desconectado, detenido y atraso mayor a 90 segundos.

### 10.2 Watchdog

`server/watchdog/WatchdogAgent.ts` funciona en modo `ALERT_ONLY`. Su flujo permitido es `DETECT → CLASSIFY → ALERT → PERSIST`. No puede modificar resultados, wallet, reglas, RNG ni settlement.

### 10.3 Auditor

El Auditor existente de rondas está en `server/auditorAgent.ts`. La primera versión del contrato operativo P1 está en `server/auditor/AuditorAgent.ts`. Compara identificadores LIVE, manifest y persistencia; clasifica `PASS`, `WARN` o `FAIL`; detecta heartbeat atrasado y devuelve `NO_DATA` sin inventar explicación. Está explícitamente configurado como `READ_ONLY` y `actionsExecuted: false`.

### 10.4 Recovery y Kill Switch

La UI de mantenimiento se activa para `STOPPED` o `KILL SWITCH`, muestra el último reporte disponible, QR informativo y estado público. El caso de prueba exige que no se inicie un evento, no se modifique wallet, no se otorguen premios y no se reanude automáticamente. La recuperación posterior requiere override humano y auditoría.

## 11. Autonomía de 24 horas

`shared/live24.ts` y `server/simulateLive.ts` permiten una simulación determinista de 24 horas con agenda, transiciones, recuperación y detección de duplicados. La simulación previa registró 15 eventos, 3 recuperaciones simuladas, 0 errores críticos y continuidad simulada del 100 %.

Esta evidencia solo demuestra el comportamiento del modelo en una ejecución local. No prueba que un servicio desplegado sobreviva 24 horas, que un proveedor mantenga la red, que un cron persista, que dos instancias coordinen o que un Smart TV real continúe conectado.

## 12. Lukita y 3D

Lukita es una anfitriona virtual adulta y no autoritativa. El visor `/lukita-3d` es una herramienta independiente de preview/review. Se mantienen separados el modelo candidato, la referencia 2D aprobada y MJP CORE.

El blockout técnico fue autorizado únicamente para refinamiento controlado. Continúan bloqueados el modelado final, rigging definitivo, animación final, voz, TTS, lip-sync, publicación e integración oficial en `/tv`, Home, PWA u Overlay, salvo autorización posterior concreta.

La identidad visual debe validarse mediante frontal, 3/4, lateral, posterior, cuerpo completo, silueta, rostro ampliado, expresiones y poses. Las anotaciones, comentarios, estados pendiente/resuelto, comparaciones, mediciones, iluminación, wireframe y exportaciones son herramientas de revisión, no aprobación estética final.

## 13. Seguridad, privacidad y regulación

El sistema mantiene controles de autenticación, roles, rate limiting, cabeceras de seguridad, auditoría de eventos, separación de créditos y avisos de piloto. KYC/AML existe como arquitectura neutral de preparación, no como verificación activa. No se deben recolectar documentos reales durante el piloto salvo que exista una decisión legal, proveedor, política de privacidad y entorno aprobado.

La eventual migración a dinero real cambiaría la categoría operativa del proyecto. Antes de ese paso se requiere asesoría jurídica peruana actualizada, revisión del régimen aplicable, homologación o certificación técnica cuando corresponda, controles KYC/AML, geolocalización, juego responsable, pagos, retiros, protección de datos, atención de reclamos, auditoría independiente y autorización de lanzamiento. Este expediente no declara cumplimiento regulatorio.

## 14. Pruebas y evidencia reproducible

| Ejecución | Resultado registrado |
|---|---|
| `pnpm check` | APROBADO en la regresión final del alcance P1 |
| `pnpm test -- --run` | APROBADO en la regresión final del alcance P1; el checkpoint previo reportó 189 pruebas aprobadas y 4 omitidas |
| `pnpm build` | APROBADO; advertencias no bloqueantes sobre asset runtime y chunks grandes |
| Auditor P1 | 4 pruebas aprobadas |
| Salud/Recovery P1 | 4 pruebas aprobadas |
| Doble claim lógico | 1 prueba aprobada |
| Total P1 nuevo | 9 pruebas aprobadas |
| Simulación LIVE-24 | 15 eventos, 3 recuperaciones, 0 errores críticos en la simulación documentada |
| QA móvil `/tv` y `/estado-sistema` | Renderizado local en viewport 390×844 |
| QA físico Samsung/LG/Android TV/iOS/Android | NO VERIFICABLE en sandbox |
| Dos procesos reales con base compartida | PAUSADO a pedido del propietario |
| Heartbeat/Watchdog persistente en staging | PAUSADO a pedido del propietario |

La suite de navegador había mostrado fallos reproducibles en casos de TV por selector inicial no visible y HTTP 429. No se retiró el rate limit para ocultar el problema. La corrección futura debe aislar el harness de pruebas sin debilitar producción.

## 15. Estado de implementación por archivo

| Archivo o ruta | Responsabilidad |
|---|---|
| `server/routers.ts` | Router tRPC principal, salud pública, operaciones y juegos |
| `server/pilot.ts` | Reglas, rondas, tickets, wallet y operaciones virtuales |
| `server/broadcast.ts` | Rondas de emisión, QR y manifest público |
| `shared/tvManifest.ts` | Contrato MjpTvManifest |
| `shared/liveChannel.ts` | Agenda, estados y proyección LIVE |
| `shared/live24.ts` | Simulación y transiciones de 24 horas |
| `server/live24Runtime.ts` | Heartbeat, salud LIVE, agentes y runtime |
| `server/supervisedWorker.ts` | Worker supervisado e idempotencia |
| `server/eventStore.ts` | Persistencia de eventos operativos |
| `server/scheduler/SchedulerService.ts` | Claim lógico y resolución humana de conflictos |
| `server/scheduler/dualInstanceSimulation.ts` | Harness local de doble claim |
| `server/watchdog/WatchdogAgent.ts` | Watchdog ALERT_ONLY |
| `server/auditorAgent.ts` | Auditoría persistida de rondas |
| `server/auditor/AuditorAgent.ts` | Auditor operativo READ_ONLY P1 |
| `shared/health.ts` | Contrato unificado de health |
| `client/src/pages/BroadcastPage.tsx` | Página TV, mantenimiento y agentes |
| `client/src/components/LiveChannelPanel.tsx` | Panel LIVE y countdown |
| `client/src/components/TvMaintenanceScreen.tsx` | Contingencia STOPPED/KILL SWITCH |
| `client/src/components/MiLukitaCircularQR.tsx` | Tres variantes de QR circular |
| `client/src/pages/OnlineTvGamesPage.tsx` | TV en línea |
| `server/realtime/*` | Sesiones y WebSocket |
| `client/src/pages/Lukita3DStudioPage.tsx` | Visor de revisión 3D |
| `docs/MILUKITA_STAGING_QA_RUNBOOK.md` | Procedimiento de staging y QA físico |
| `docs/MILUKITA_P1_AUDIT_REPORT.md` | Informe específico de la Orden P1 |
| `docs/MILUKITA_OBSERVABILITY_QA_REPORT.md` | Observabilidad y QA |

## 16. Riesgos y brechas priorizadas

| ID | Prioridad | Problema | Evidencia | Impacto | Acción recomendada |
|---|---|---|---|---|---|
| R-01 | P0 antes de dinero real | No existe certificación RNG independiente | PRNG implementado; revisión externa pendiente | Riesgo de integridad y cumplimiento | Contratar laboratorio independiente y congelar versión auditada |
| R-02 | P0 antes de lanzamiento regulado | No existe homologación ni revisión legal final | Preparación documental solamente | Riesgo regulatorio | Obtener dictamen peruano actualizado y plan de autorización |
| R-03 | P1 | Multiinstancia real no verificada | Solo harness lógico; staging pausado | Doble claim o estado competido | Ejecutar dos procesos contra base compartida y verificar Event Store |
| R-04 | P1 | Heartbeat/Watchdog persistente no activado | Callback/runtime preparados; staging pausado | No se demuestra autonomía operativa | Publicar staging, crear tarea persistente y revisar logs |
| R-05 | P1 | QA físico incompleto | No hay matriz firmada de dispositivos reales | Fallos de mando, QR, audio o WebView | Probar Samsung, LG, Android/Google TV, iOS y Android |
| R-06 | P1 | E2E TV con 429 y visibilidad inicial | Fallos de navegador documentados | Falsos negativos y menor confianza | Aislar rate limit del harness y estabilizar estado inicial |
| R-07 | P1 | Integración avanzada TV en línea aún inicial | Sesión y lobby implementados; endurecimiento pendiente | Realtime inconsistente en escala | Tokens de sesión, autorización y eventos de dominio |
| R-08 | P2 | Chunks grandes de frontend | Build advierte chunks >500 kB | Carga inicial lenta en móviles | Code splitting adicional y carga diferida del visor 3D |
| R-09 | P2 | Auditoría pública de RTP requiere disciplina de versiones | Hay tableros y simuladores | Interpretación comercial incorrecta | Mostrar versión, muestra, fecha y límites en cada cifra |
| R-10 | P2 | Lukita 3D no es producción | Estado preview/review | Riesgo de integración prematura | Mantener bloqueo y aprobación humana estética |

## 17. Decisiones pausadas por el propietario

Quedan pausadas, sin considerarse fallidas ni completadas, las siguientes acciones:

1. Activación persistente de Heartbeat/Watchdog en staging.
2. Prueba de dos procesos reales contra una base compartida.
3. Certificación operativa de recuperación durante 24 horas en staging.
4. QA físico final en dispositivos Samsung, LG, Android/Google TV, iOS y Android.

El propietario debe autorizar expresamente la reanudación. Hasta entonces, el sistema debe permanecer en el alcance virtual y local validado.

## 18. Cronograma recomendado después de reanudar

| Fase | Actividad | Criterio de salida |
|---|---|---|
| 0 | Revisión independiente del expediente | Observaciones y alcance firmados |
| 1 | Publicar staging aislado | URL, logs y base identificados |
| 2 | Activar Heartbeat/Watchdog | Ejecuciones persistentes y alertas trazables |
| 3 | Dos procesos con base compartida | Un solo claim, cierre y recovery por evento |
| 4 | Prueba LIVE sostenida de 24 horas | Informe sin duplicados ni estados imposibles |
| 5 | QA físico | Matriz completa con modelo, versión y evidencia |
| 6 | RNG, seguridad y regulación | Dictámenes independientes y correcciones cerradas |
| 7 | Piloto controlado | Métricas de retención, errores, soporte y juego responsable |
| 8 | Decisión de monetización | Autorización legal y de dirección, separada del piloto |

## 19. Guía de auditoría externa

El auditor externo debería comenzar verificando el commit/checkpoint entregado y reproducir `pnpm install`, `pnpm check`, `pnpm test -- --run` y `pnpm build` en un entorno aislado. Luego debe revisar el esquema de base, las migraciones, el Event Store, la idempotencia, los permisos, el flujo de resultados y la separación entre cliente y servidor.

Después debe inspeccionar los contratos `MjpTvManifest`, health, realtime y juegos en línea, y comparar cada proyección de UI con su fuente autoritativa. Debe forzar escenarios de desconexión, datos inexistentes, transición inválida, heartbeat atrasado y Kill Switch. En todos los casos debe confirmar que no se inventan datos, que no se duplican premios ni cierres y que la recuperación exige control humano.

Finalmente debe separar tres conclusiones: lo que está implementado, lo que está probado localmente y lo que puede certificarse en el entorno objetivo. El expediente no autoriza saltar directamente de la primera categoría a la tercera.

## 20. Conclusión

MiLukita presenta una base técnica amplia para un canal de entretenimiento virtual sincronizado entre TV y celular. La separación de autoridad, los contratos compartidos, los controles de créditos, la observabilidad y la política `NO DATA → NO CLAIM` son elementos positivos para una revisión externa.

El sistema todavía está en **preproducción local validada**. La ausencia de staging persistente, la prueba multiinstancia pausada, el QA físico no verificable y la falta de certificación independiente impiden declarar operación 24/7, compatibilidad universal, cumplimiento regulatorio o preparación para dinero real.

La recomendación de auditoría es conservar el alcance actual, no añadir nuevos agentes ni nuevas modalidades hasta cerrar las evidencias críticas, y reanudar únicamente con una autorización explícita del propietario.

## Referencias internas del expediente

Las referencias principales son los archivos del repositorio enumerados en la sección 15, especialmente `shared/tvManifest.ts`, `shared/health.ts`, `server/live24Runtime.ts`, `server/supervisedWorker.ts`, `server/eventStore.ts`, `server/watchdog/WatchdogAgent.ts`, `server/auditor/AuditorAgent.ts`, `server/auditorAgent.ts`, `server/scheduler/SchedulerService.ts`, `docs/MILUKITA_P1_AUDIT_REPORT.md`, `docs/MILUKITA_OBSERVABILITY_QA_REPORT.md` y `docs/MILUKITA_STAGING_QA_RUNBOOK.md`.


## Addendum de validación ejecutada para este expediente

En la ejecución de auditoría de fecha 27 de agosto de 2026, `pnpm check` pasó y `pnpm build` pasó con advertencias no bloqueantes sobre un asset de almacenamiento referenciado en runtime y chunks grandes, incluido el chunk del visor 3D. La suite completa produjo **61 archivos aprobados, 1 omitido, 197 pruebas aprobadas y 4 omitidas**, pero terminó con **1 fallo** en `server/api.e2e.test.ts`, dentro del flujo de reserva autenticada: `games.confirmTicketBatchPreview` respondió HTTP 500 porque la ronda seleccionada ya estaba cerrada (`La participación está cerrada para esta ronda.`), mientras la prueba esperaba HTTP 200. Este resultado debe clasificarse como **FALLO DE HARNES/ESTADO DE DATOS E2E REPRODUCIBLE**, no como aprobación completa de la suite.

Las pruebas focalizadas nuevas de la Orden P1 sí pasan: **9/9**, incluyendo Auditor READ_ONLY, consistencia de eventId, heartbeat atrasado, Kill Switch lógico, recuperación, NO DATA → NO CLAIM y doble claim lógico. La corrección recomendada es hacer que la prueba cree o seleccione una ronda abierta de forma determinista antes de confirmar el lote, sin relajar la validación de rondas cerradas.


## Addendum P2 — cierre local y vista interactiva

### Corrección del fallo E2E

El fallo anterior no era un defecto del motor de reserva. La validación server-side que rechaza una ronda cerrada es una condición negativa esperada. El problema estaba en el fixture de `server/api.e2e.test.ts`: el flujo abría temporalmente las rondas de lotería, pero no abría las rondas de `ruleta`, `jackpot`, `bingo`, `cartas` y `bingo_75` utilizadas posteriormente por los lotes universales. Al llegar a `games.confirmTicketBatchPreview`, la ronda podía estar cerrada y el servidor respondía correctamente con error.

La corrección abre de forma determinista cada ronda universal usada por el test, conserva su estado y fechas originales en `roundSnapshots`, y las restaura en el bloque `finally`. No se relajó la validación de rondas cerradas, no se modificó wallet, liquidación ni autoridad de resultados y no se generaron datos permanentes.

Resultado reproducible: `server/api.e2e.test.ts` pasó con **2/2 pruebas**. Las pruebas focalizadas P1/P2 pasaron con **13/13** incluyendo la nueva suite `shared/auditSummary.test.ts`.

### Vista interactiva

Se añadió la ruta administrativa `/auditoria-resumen`, protegida para usuarios autenticados con rol `admin`. La pantalla muestra contadores de elementos verificados/corregidos, pausados y abiertos/no verificados; permite filtrar por texto, estado y prioridad P0/P1/P2; enlaza al expediente Markdown y mantiene visible que la vista es informativa y no tiene autoridad sobre MJP CORE.

Archivos añadidos o actualizados: `client/src/pages/AuditSummaryPage.tsx`, `shared/auditSummary.ts`, `shared/auditSummary.test.ts`, `client/src/App.tsx` y `client/src/pages/ControlRoom.tsx`.

### Endurecimiento aplicado

El resumen se aisló detrás de autenticación y rol administrativo. El modelo de datos de la vista es de solo lectura y está separado de los procedimientos que modifican rondas, wallet o créditos. El test E2E sigue usando un usuario temporal aislado y restaura todas las rondas alteradas. Se conserva la política `NO DATA → NO CLAIM`, el Watchdog continúa en `ALERT_ONLY` y el Auditor en `READ_ONLY`.

No se activaron staging, Heartbeat persistente, Watchdog persistente, pagos, retiros, dinero real, dos procesos reales ni hardware físico. Esas actividades siguen pausadas a pedido del propietario.


## Addendum final P2 — resultados de cierre local

La ejecución final incluyó `pnpm check`, `pnpm test -- --run`, `pnpm simulate:live` y `pnpm build`. Resultado: **check aprobado; 63 archivos de prueba aprobados, 1 omitido; 201 pruebas aprobadas y 4 omitidas; simulación LIVE-24 aprobada; build aprobado**. La simulación reportó 15 eventos programados y completados, 3 recuperaciones exitosas, 0 errores críticos, 100 % de continuidad simulada y 0 eventos omitidos. Sus limitaciones siguen siendo deterministas: no ejecuta cron productivo, red pública, hardware físico ni múltiples instancias reales.

El fallo E2E fue corregido en `server/api.e2e.test.ts`. La prueba ahora abre temporalmente todas las rondas usadas por los lotes universales, conserva snapshots y restaura estado y fechas en `finally`. La validación server-side de una ronda cerrada se mantiene intacta; el rechazo de una ronda cerrada sigue siendo comportamiento esperado y no se convirtió en un bypass.

La vista interactiva administrativa está disponible en `/auditoria-resumen`, con acceso restringido a rol `admin`. El contrato compartido `shared/auditSummary.ts` y sus 3 pruebas verifican inventario mínimo, filtros, prioridades y preservación de la fuente de datos.

El endurecimiento aplicado en este alcance consiste en mantener la vista en solo lectura, limitarla al operador, evitar enlaces de control desde el resumen, preservar el aislamiento del usuario temporal E2E, restaurar siempre las rondas mutadas y no modificar MJP CORE, RNG, RTP, wallet, ledger, reglas, créditos, liquidación ni MjpTvManifest. No se activaron staging, Heartbeat/Watchdog persistentes, pagos, retiros, dinero real, multiinstancia real ni hardware.

### Clasificación final de evidencia

| Categoría | Resultado |
|---|---|
| **VERIFICADO** | TypeScript, build, suite local completa, prueba API E2E corregida, Auditor READ_ONLY, Watchdog ALERT_ONLY, NO DATA → NO CLAIM, vista administrativa y controles de acceso locales. |
| **VERIFICADO EN SIMULACIÓN** | LIVE-24, recuperación, Kill Switch lógico, doble claim lógico y continuidad de eventos. |
| **FALLÓ Y FUE CORREGIDO** | Fixture API E2E que utilizaba rondas universales cerradas durante la confirmación de lote. |
| **PENDIENTE POR INFRAESTRUCTURA REAL** | Staging persistente, Heartbeat/Watchdog persistente, dos procesos reales contra base compartida, prueba real de 24 horas y QA físico. Estas tareas permanecen pausadas a pedido del propietario. |
| **NO VERIFICADO** | Certificación RNG, homologación regulatoria, compatibilidad física universal, disponibilidad productiva, carga sostenida y operación con dinero real. |


## Addendum — panel interactivo de auditoría y simulación

La ruta administrativa `/auditoria-resumen` ahora incorpora exportación del subconjunto visible a CSV mediante descarga local y generación del informe detallado en PDF mediante el procedimiento administrativo existente. La generación PDF conserva el registro de artefacto, hash y trazabilidad del backend; el CSV respeta los filtros activos de la pantalla.

La vista también incluye filtros combinables por texto, estado y prioridad, además de ordenamiento ascendente/descendente por prioridad, estado o área. El ordenamiento no modifica la fuente de auditoría.

Se integró el procedimiento `operations.autonomySimulationPreview` con actualización periódica de cinco segundos. El panel muestra ventana de 24 horas, ticks, intentos, claims únicos, duplicados omitidos, fuente, muestras y limitaciones. Se identifica explícitamente como simulación determinista local: no equivale a operación productiva, staging persistente, cron real, red pública, hardware físico ni multiinstancia real.

Validación final de esta mejora: `pnpm check` aprobado; 64 archivos de prueba aprobados, 1 omitido; 202 pruebas aprobadas, 4 omitidas; `pnpm simulate:live` aprobado con 15 eventos, 3 recuperaciones y 0 errores críticos; `pnpm build` aprobado. El build mantiene las advertencias no bloqueantes previamente registradas sobre asset remoto resuelto en runtime y chunks grandes del visor 3D.

# ANEXO DE AUDITORÍA EXTERNA — ORDEN 44 AMPLIADA

**Fecha de ejecución:** 27 de agosto de 2026.  
**Sistema:** MiLukita / Ruleta Perú Online.  
**Alcance auditado:** integración administrativa de Financial Intelligence y Experience Director, visualización de propuestas simuladas, indicadores `NO DATA`/`NO CLAIM`, solicitud manual de análisis de experiencia, regresión técnica y evidencia local.  
**Clasificación global:** IMPLEMENTADO Y VERIFICADO LOCALMENTE; NO CERTIFICADO PARA OPERACIÓN PRODUCTIVA, DINERO REAL, FISCALIDAD, REGULACIÓN, MULTIINSTANCIA REAL NI HARDWARE FÍSICO.

## 1. Resumen ejecutivo para auditor externo

La Orden 44 ampliada fue ejecutada sobre la arquitectura existente, sin crear una arquitectura paralela y sin modificar MJP CORE. El resultado consiste en un panel integrado en `ControlRoom` que presenta dos capacidades gobernadas: Financial Intelligence Agent y Experience Director. Ambos operan como asistentes de observación y propuesta. Ninguno posee una ruta de ejecución automática, acceso para alterar resultados, RNG, RTP, reglas, wallet, ledger, settlement, créditos, MjpTvManifest o Event Store autoritativo.

Financial Intelligence muestra una propuesta simulada con título, justificación, impacto esperado, clasificación de datos, alertas, jurisdicciones y etiquetas visibles de aprobación humana requerida y ejecución deshabilitada. En ausencia de datos reales, la interfaz muestra `NO DATA`, `NO CLAIM` o `UNAVAILABLE`; no transforma créditos virtuales en ingresos, no calcula una recomendación fiscal concluyente y no declara una jurisdicción preferida.

Experience Director incluye un botón de activación manual. El botón ejecuta una simulación local determinista de análisis TV→QR→móvil; durante la ejecución muestra `Analizando…`, después muestra `SIMULATED`, un score compuesto de dimensiones explícitas y una propuesta con `PROPOSE ONLY`, `AUTO-DESIGN: FALSE` y `AUTO-DEPLOY: FALSE`. La acción no llama a un proveedor externo ni modifica el estado productivo.

La validación local final fue satisfactoria: TypeScript sin errores, 72 archivos de prueba aprobados, 1 archivo omitido, 224 pruebas aprobadas, 4 pruebas omitidas y build aprobado. La prueba E2E HTTP extensa fue ejecutada con un timeout ampliado de 120 segundos debido a su duración bajo carga de la suite; la ejecución aislada terminó correctamente en aproximadamente 41,6 segundos. El build conserva una advertencia no bloqueante sobre chunks superiores a 500 kB, especialmente el visor 3D de Lukita.

> **Dictamen:** la implementación es apta como capa administrativa local y gobernada de análisis/propuesta. No constituye una certificación de resultados financieros, fiscales, legales, regulatorios, operativos ni de disponibilidad productiva.

## 2. Pregunta de auditoría y criterios de aceptación

| ID | Criterio | Evidencia | Estado |
|---|---|---|---|
| A-01 | Propuestas financieras simuladas visibles en Control Room | `client/src/components/IntelligenceAgentsPanel.tsx` | IMPLEMENTADO |
| A-02 | Estado financiero explícito cuando no existen datos reales | `NO DATA`, `NO CLAIM`, clasificación `UNAVAILABLE` | IMPLEMENTADO |
| A-03 | Experience Director activable manualmente | Botón `Solicitar análisis` | IMPLEMENTADO |
| A-04 | Simulación de Experience Director sin mutación | Estado local React y contratos `autoDesignAllowed: false`, `autoDeployAllowed: false` | VERIFICADO LOCALMENTE |
| A-05 | Separación de créditos virtuales y dinero real | Texto de gobierno, contratos y pruebas | VERIFICADO LOCALMENTE |
| A-06 | Aprobación humana obligatoria | `requiresHumanApproval: true` | VERIFICADO LOCALMENTE |
| A-07 | MJP CORE permanece como autoridad | No se modificaron módulos autoritativos; pruebas de aislamiento heredadas | VERIFICADO LOCALMENTE |
| A-08 | Documentación específica de agentes | Cuatro documentos de agente/gobierno | IMPLEMENTADO |
| A-09 | Regresión TypeScript | `pnpm check` | PASS |
| A-10 | Regresión Vitest | `pnpm test -- --run` | PASS |
| A-11 | Compilación de producción | `pnpm build` | PASS CON WARNING NO BLOQUEANTE |
| A-12 | Certificación productiva | No se ejecutó staging persistente ni hardware | NO VERIFICABLE |

## 3. Arquitectura y fronteras de autoridad

La cadena de autoridad se mantiene así:

```text
MJP CORE
  ↓
Resultado autoritativo
  ↓
Event Store autoritativo
  ↓
MjpTvManifest / proyecciones de experiencia
  ↓
Experience OS / Character OS / Presentation OS / Commercial OS
  ↓
Agentes de lectura, análisis y propuesta
  ↓
Revisión humana
```

Financial Intelligence no es una autoridad matemática del juego. No puede calcular ni sustituir el resultado, premios, RTP, reglas o liquidación. Su cálculo económico usa entradas clasificadas y devuelve métricas nulas cuando los denominadores o datos no están disponibles.

Experience Director no es una autoridad de presentación obligatoria. Puede auditar y proponer mejoras, pero no aplica cambios de diseño automáticamente, no publica, no cambia el manifest y no controla la presencia de Lukita. Su acción manual actual es una simulación local de revisión, no una operación autónoma.

| Recurso protegido | Financial Intelligence | Experience Director | Resultado de auditoría |
|---|---:|---:|---|
| RNG | Sin acceso de escritura | Sin acceso de escritura | PRESERVADO |
| RTP | Sin acceso de escritura | Sin acceso de escritura | PRESERVADO |
| Reglas | Sin acceso de escritura | Sin acceso de escritura | PRESERVADO |
| Resultado autoritativo | Sin acceso | Sin acceso | PRESERVADO |
| Wallet y créditos | Sin acceso de escritura | Sin acceso | PRESERVADO |
| Ledger y settlement | Sin acceso | Sin acceso | PRESERVADO |
| MjpTvManifest | Sin acceso de escritura | Sin acceso de escritura | PRESERVADO |
| Event Store autoritativo | Sin mutación | Sin mutación | PRESERVADO |
| Publicación externa | No | No | BLOQUEADA |
| Decisión fiscal/legal | No | No | REQUIERE HUMANO |

## 4. Financial Intelligence Agent

### 4.1 Contrato implementado

El contrato `shared/financialIntelligence.ts` define cinco modos permitidos: `READ`, `ANALYZE`, `SCORE`, `SIMULATE` y `PROPOSE`. No existe `EXECUTE` dentro de `FinancialMode`. Las métricas principales son ingreso por usuario, espectador, evento y escaneo QR; margen bruto; margen de contribución; punto de equilibrio y relación LTV/CAC.

Los datos de entrada actuales incluyen usuarios, espectadores, eventos, escaneos QR, conversión, publicidad, patrocinio, distribución, infraestructura, IA, soporte, CAC, retención y clasificación. La clasificación actual del panel es `UNAVAILABLE` porque no se suministran datos comerciales productivos reales.

### 4.2 Métricas actuales

| Métrica | Valor observado | Interpretación correcta |
|---|---:|---|
| Usuarios reales suministrados | 0 | No hay cohorte comercial conectada al panel |
| Espectadores reales suministrados | 0 | No hay telemetría productiva conectada |
| Eventos comerciales medidos | 0 | No hay eventos comerciales clasificados |
| Escaneos QR medidos | 0 | No hay conversiones productivas conectadas |
| Ingresos publicitarios | 0 | No data; no equivale a ingresos reales cero auditados |
| Ingresos de patrocinio | 0 | No data; no existe contrato conectado |
| Ingresos de distribución | 0 | No data; no existe distribución externa conectada |
| Costos de infraestructura | 0 | No se debe interpretar como costo real cero |
| Costos de IA | 0 | No se debe interpretar como costo real cero |
| Costos de soporte | 0 | No se debe interpretar como costo real cero |
| Ingreso por usuario | `null` | Denominador no disponible |
| Ingreso por espectador | `null` | Denominador no disponible |
| Ingreso por evento | `null` | Denominador no disponible |
| Ingreso por QR | `null` | Denominador no disponible |
| Margen bruto | `null` | Ingreso no disponible |
| Margen de contribución | `null` | Ingreso no disponible |
| Punto de equilibrio | `null` | No existe base de costos/usuarios válida |
| LTV/CAC | `null` | CAC y base de ingreso no válidos |
| Clasificación | `UNAVAILABLE` | No debe presentarse como dato real |

### 4.3 Propuesta financiera simulada

La propuesta visible en el panel es `Priorizar medición de ingresos comerciales`. Su racional es que no existen ingresos reales clasificados en el piloto y que deben instrumentarse audiencia, QR y canales antes de decidir inversiones. El impacto esperado es definir la instrumentación antes de formular decisiones económicas.

| Campo de gobernanza | Valor |
|---|---|
| ID | `FIN-PRIORIZAR-MEDICIÓN-DE-INGRESOS-COMERCIALES` |
| Modo | `PROPOSE` |
| Clasificación | `UNAVAILABLE` |
| Aprobación humana | `true` |
| Ejecución permitida | `false` |
| Cambio automático | No |
| Inversión automática | No |
| Decisión fiscal automática | No |
| Decisión de precio automática | No |

### 4.4 Alertas

El contrato genera `DATA_UNAVAILABLE` cuando la clasificación es `UNAVAILABLE`. También contempla `LOW_MARGIN`, `HIGH_COST`, `NEGATIVE_CASH_FLOW` y `UNPROFITABLE_EVENT`; estas alertas no se presentan como conclusiones productivas si no existe una base de datos clasificada.

### 4.5 Jurisdicciones

La comparación implementada contiene Perú, España y una categoría `OTHER`. Los valores fiscales y regulatorios permanecen nulos o en revisión. La recomendación es `NONE`. Esto es correcto para el estado actual porque la aplicación no debe convertir una comparación preliminar en asesoramiento legal o fiscal.

| Jurisdicción | Impuesto corporativo | Impuesto indirecto | Regulación de juego | Recomendación | Clasificación |
|---|---:|---:|---|---|---|
| Perú | `null` | `null` | `REVIEW_REQUIRED` | `NONE` | `UNAVAILABLE` |
| España | `null` | `null` | `REVIEW_REQUIRED` | `NONE` | `UNAVAILABLE` |
| Otras | `null` | `null` | `NOT_ASSESSED` | `NONE` | `UNAVAILABLE` |

## 5. Experience Director

### 5.1 Contrato implementado

El contrato `shared/experienceDirector.ts` define dimensiones de claridad, navegación, calidad visual, entretenimiento, accesibilidad, rendimiento, TV, móvil, QR, Lukita, confianza y conversión. El score se calcula únicamente con dimensiones numéricas observadas. Sin datos, `total` es `null` y la explicación indica que no existen datos suficientes.

### 5.2 Estado inicial y estado posterior a activación

| Estado | Insignia | Score | Significado |
|---|---|---:|---|
| Inicial | `NO CLAIM` | `NO DATA` | El agente no ha recibido una solicitud manual |
| En ejecución | `NO CLAIM` | `NO DATA` | Simulación local de 650 ms; no se bloquea MJP CORE |
| Listo | `SIMULATED` | 67/100 | Score sintético de dimensiones de prueba; no es telemetría real |

El score simulado de 67/100 procede de las dimensiones locales `clarity=72`, `navigation=68`, `qr=64`, `tv=70`, `mobile=66` y `accessibility=61`. Su promedio aritmético es 66,83 y se redondea a 67. La clasificación es `SIMULATED`. No debe interpretarse como satisfacción de usuarios, conversión, accesibilidad certificada ni resultado de QA físico.

### 5.3 Propuesta de experiencia

| Campo | Valor |
|---|---|
| ID | `EXP-EXP-MANUAL-TV-QR` |
| Área | QR |
| Prioridad | P2 |
| Problema | Solicitud manual de revisión TV→QR→móvil |
| Evidencia | Análisis simulado solicitado por operador |
| Impacto | Identificar fricción de comprensión y escaneo |
| Cambio propuesto | Revisar visibilidad, jerarquía y recuperación del QR en dispositivos objetivo |
| Dependencia | Revisión humana y QA multidispositivo |
| Esfuerzo | MEDIUM |
| Aprobación humana | `true` |
| Auto-diseño | `false` |
| Auto-deploy | `false` |

## 6. Interfaz implementada

El componente `client/src/components/IntelligenceAgentsPanel.tsx` fue integrado en `client/src/pages/ControlRoom.tsx` después de los paneles de autonomía, Character OS y Distribution OS.

La interfaz contiene dos columnas responsive. La columna financiera muestra clasificación, margen, propuesta simulada, alertas y jurisdicciones. La columna de experiencia muestra score, estado, botón de solicitud manual, fecha de última solicitud, propuesta y límites de autoridad.

Los indicadores no dependen únicamente del color: incluyen texto visible. Los estados usados son `NO DATA`, `NO CLAIM`, `SIMULATED` y `UNAVAILABLE`. La interfaz informa expresamente que la solicitud de Experience Director es local y que no modifica producción, juegos, resultados, wallet, MjpTvManifest ni MJP CORE.

### 6.1 Comportamiento del botón manual

1. Estado inicial: botón habilitado con texto `Solicitar análisis`.
2. Activación: el estado cambia a `RUNNING` y el botón queda deshabilitado.
3. Indicador de actividad: se muestra `Analizando…`.
4. Finalización simulada: después de 650 ms se asigna `READY`.
5. Resultado: aparece `SIMULATED`, score 67/100 y fecha local de la solicitud.
6. Gobernanza: la propuesta mantiene aprobación humana obligatoria y auto-diseño/deploy deshabilitados.

La acción utiliza estado local React. No existe una mutación tRPC para ejecutar decisiones sobre producción. Esta decisión reduce el riesgo de que un botón administrativo sea confundido con una orden de despliegue.

## 7. Pruebas automatizadas

### 7.1 Pruebas focalizadas de agentes

| Archivo | Pruebas | Resultado |
|---|---:|---|
| `shared/financialIntelligence.test.ts` | 2 | PASS |
| `shared/experienceDirector.test.ts` | 2 | PASS |
| Total focalizado | 4 | 4 PASS |

Las pruebas financieras verifican que los créditos virtuales no se convierten en ingresos contables y que las propuestas exigen aprobación humana. También comprueban que las jurisdicciones no generan una recomendación automática.

Las pruebas de experiencia verifican que no se inventa un score sin datos y que las propuestas mantienen `requiresHumanApproval=true`, `autoDesignAllowed=false` y `autoDeployAllowed=false`.

### 7.2 Regresión completa

| Comando | Resultado exacto |
|---|---|
| `pnpm check` | PASS; TypeScript sin errores |
| `pnpm test -- --run` | 72 archivos PASS, 1 omitido; 224 pruebas PASS, 4 omitidas |
| `pnpm build` | PASS; 1.920 módulos transformados |
| Build frontend | PASS; 5,50 s; `dist/index.js` 346,8 kB |
| Build backend | PASS; completado por esbuild en 24 ms |

### 7.3 Prueba E2E HTTP

La suite HTTP contiene un caso extenso que crea un usuario temporal, abre temporalmente rondas de prueba, procesa reservas, lotes, mercados y planes, y restaura los estados en `finally`. Bajo la ejecución completa, el caso superó el límite inicial de 60 segundos. La prueba se ejecutó aisladamente con límite de 180 segundos y pasó en aproximadamente 41,6 segundos. Se ajustó el límite declarado del caso a 120 segundos para evitar un falso timeout bajo carga de la suite, sin eliminar asserts ni reducir la cobertura.

La corrección no cambia la validación de rondas cerradas. La regla server-side que rechaza reservas sobre rondas cerradas permanece intacta.

## 8. Métricas del proyecto observadas

| Métrica | Valor observado |
|---|---:|
| Archivos bajo `client/src`, `server`, `shared`, `docs` | 483 |
| Archivos TypeScript/TSX en `client/src`, `server`, `shared` | 338 |
| Archivos de prueba detectados | 229 |
| Módulos transformados en build | 1.920 |
| Chunk Control Room | 220,88 kB; gzip 29,85 kB |
| Chunk Lukita3D | 766,50 kB; gzip 180,55 kB |
| Chunk principal | 251,49 kB; gzip 69,31 kB |
| Vendor React | 385,11 kB; gzip 115,50 kB |
| CSS principal | 216,40 kB; gzip 32,42 kB |
| Errores TypeScript | 0 |
| Advertencias de build | 1 familia: chunks >500 kB |
| Pruebas aprobadas | 224 |
| Pruebas omitidas | 4 |
| Archivos de prueba aprobados | 72 |
| Archivos de prueba omitidos | 1 |

### 8.1 Advertencia de rendimiento

El chunk `Lukita3DStudioPage` supera 500 kB minificados. Esta advertencia no bloquea el build, pero representa un riesgo de carga inicial cuando la ruta del visor 3D sea visitada en dispositivos de bajo rendimiento o conexiones móviles. Se recomienda code splitting/dynamic import del visor 3D como trabajo posterior, sin mezclarlo con la autoridad de agentes.

## 9. Evidencia visual y limitación de acceso

La captura de `/control-room` realizada sin sesión administrativa mostró correctamente la barrera de autenticación: tarjeta `Control Room`, mensaje `Inicia sesión para acceder al centro de operación virtual` y botón `Iniciar sesión`. Esto confirma que el panel no queda expuesto públicamente a usuarios no autenticados.

No se certificó visualmente el panel interno con una sesión admin real en esta ejecución porque no se realizó takeover, login ni suministro de credenciales. Por tanto, la existencia en código y el build están verificados; la visualización autenticada queda clasificada como `NO VERIFICABLE` en este entorno concreto.

## 10. Clasificación de evidencias

| Categoría | Elementos |
|---|---|
| IMPLEMENTADO | Panel financiero, propuestas simuladas, estados visuales, botón manual de Experience Director, documentación y pruebas focalizadas |
| PROBADO | Contratos financieros, score sin datos, aprobación humana, no auto-diseño, no auto-deploy, regresión local |
| VERIFICADO LOCALMENTE | `pnpm check`, suite Vitest, build, aislamiento contractual y preservación de fronteras |
| SIMULADO | Score 67/100, propuesta QR P2 y estado READY del análisis manual |
| NO VERIFICABLE | Telemetría productiva, ingresos reales, costos reales, retención real, QA físico, staging persistente, regulación y fiscalidad |
| PAUSADO | Dinero real, pagos, publicación, multiinstancia real, Heartbeat/Watchdog persistentes, pruebas físicas y decisiones fiscales |

## 11. Riesgos y acciones recomendadas

| ID | Prioridad | Riesgo | Evidencia | Impacto | Mitigación recomendada | Dependencia |
|---|---|---|---|---|---|---|
| FI-01 | P1 | Confundir datos simulados con datos financieros reales | Clasificación `SIMULATED`/`UNAVAILABLE` | Decisiones económicas incorrectas | Conectar fuentes clasificadas y exigir etiqueta por métrica | Instrumentación y revisión financiera |
| FI-02 | P1 | Interpretar créditos virtuales como ingresos | Piloto sin dinero real | Riesgo contable y regulatorio | Mantener separación contable y revisión profesional | Contador y asesor legal |
| FI-03 | P1 | Convertir jurisdicción preliminar en asesoramiento | Impuestos/regulación nulos | Riesgo fiscal/regulatorio | Completar fuentes primarias y revisión humana firmada | Legal/fiscal |
| EXP-01 | P1 | Tomar score simulado como UX real | Score 67/100 sintético | Priorización equivocada | Sustituir por telemetría consentida y QA real | Analítica y usuarios de prueba |
| EXP-02 | P2 | Botón manual entendido como ejecución | Botón inicia análisis local | Confusión operacional | Mantener copy `simulado`, `PROPOSE ONLY` y registro de solicitud | Revisión UX |
| OPS-01 | P1 | Acceso interno no verificado con admin real | Screenshot sin sesión | Falta de evidencia visual completa | Ejecutar QA autenticado en entorno controlado | Sesión del propietario |
| PERF-01 | P2 | Chunk 3D grande | 766,50 kB minificados | Carga lenta móvil/TV | Dynamic import y prefetch solo al entrar al visor | Refactor frontend |
| E2E-01 | P2 | E2E extensa sensible a carga | Timeout inicial 60 s | Falso negativo en CI | Mantener timeout 120 s, añadir deadlines por request y dividir escenarios | Mantenimiento de tests |

## 12. Lo que NO se implementó en esta orden

No se implementó una base de datos administrativa para persistir solicitudes de análisis, propuestas financieras o historiales de Experience Director. El resultado actual es una herramienta visual local dentro del panel. Tampoco se conectaron proveedores de contabilidad, pasarelas, publicidad, YouTube, CRM, bancos, jurisdicciones, servicios de analítica externa o motores fiscales.

No se creó Content Governance Agent nuevo en esta orden ampliada porque el alcance ejecutado se concentró en las tres solicitudes inmediatas y en los dos agentes ya contratados. La documentación de la orden lo contempla como capacidad posterior, pero no debe declararse implementado por la mera existencia del documento original.

No se habilitó ejecución automática, aprobación persistente, despliegue automático, compra, cobro, retiro, migración a soles reales ni ninguna operación que convierta el piloto en una plataforma monetaria.

## 13. Próximas actividades priorizadas

| Orden | Actividad | Prioridad | Criterio de cierre |
|---:|---|---|---|
| 1 | QA autenticado del panel en Control Room | P1 | Captura y prueba manual con rol admin; estados y botón verificados |
| 2 | Persistencia administrativa de solicitudes y propuestas | P1 | Schema, migración, procedimiento admin-only y auditoría de cambios |
| 3 | Instrumentación real de audiencia, QR y eventos | P1 | Métricas consentidas con clasificación y retención documentadas |
| 4 | Revisión legal/fiscal independiente | P1 | Informe firmado; sin recomendación automática del agente |
| 5 | Separar el chunk del visor 3D | P2 | LCP medido antes/después y carga bajo demanda |
| 6 | Añadir pruebas de interfaz del botón manual | P2 | Test de `IDLE→RUNNING→READY` y bloqueo durante ejecución |
| 7 | Implementar Content Governance Agent | P2 | Contrato, validación de claims y pruebas de `NO DATA→NO CLAIM` |
| 8 | Staging persistente y multiinstancia | P1 bloqueado | Solo después de autorización expresa del propietario |

## 14. Dictamen final

La Orden 44 ampliada está **implementada en el alcance solicitado y validada localmente**. La interfaz comunica adecuadamente la diferencia entre ausencia de datos, simulación y propuesta. Las fronteras de autoridad están preservadas: los agentes no gobiernan juegos, créditos, resultados, liquidación, manifest ni Event Store.

El sistema todavía no debe describirse como una inteligencia financiera productiva, una asesoría fiscal, una operación autónoma 24/7 ni un sistema certificado para dinero real. La evidencia actual demuestra una capa administrativa segura de análisis y propuesta sobre un piloto de créditos virtuales. La certificación externa debe comenzar por revisión de contratos, trazabilidad, fuentes de datos, controles de acceso, QA autenticado y pruebas de no mutación contra MJP CORE.

**Estado de cierre:** `LOCAL VALIDATED / HUMAN REVIEW REQUIRED / PRODUCTION PAUSED`.

# ANEXO DE AUDITORÍA — DOCUMENTO 75 Y MEJORAS DEL PANEL DE AGENTES

**Fecha:** 27 de agosto de 2026.  
**Objeto:** ejecución incremental del Documento 75, sin reconstruir la arquitectura y preservando MJP CORE como autoridad absoluta.  
**Estado:** `LOCAL VALIDATED / EXTERNAL INTEGRATIONS REQUIRED / HUMAN REVIEW REQUIRED`.

## 15. Resumen de ejecución del Documento 75

El Documento 75 fue ejecutado bajo el principio `INSPECCIONAR → REUTILIZAR → DISEÑAR → IMPLEMENTAR → PROBAR → DOCUMENTAR`. La auditoría encontró que Entertainment OS, Commercial OS, Distribution OS, `MjpTvManifest`, `ShowState` y los paneles de Control Room ya existían parcialmente o estaban implementados en forma gobernada. En lugar de crear una segunda arquitectura, se añadieron únicamente contratos deterministas seguros para las brechas identificadas.

| Módulo | Estado real después de la ejecución | Evidencia | No debe confundirse con |
|---|---|---|---|
| MJP CORE | IMPLEMENTADO/AUTORITATIVO | Contratos y pruebas heredadas; no modificado | Agente de propuesta |
| MjpTvManifest | IMPLEMENTADO | `shared/tvManifest.ts` | Fuente de datos inventada |
| State of the Show | IMPLEMENTADO COMO PROYECCIÓN | `shared/showState.ts`, `docs/MILUKITA_STATE_OF_THE_SHOW.md` | Nueva autoridad de resultados |
| Experience Orchestrator | IMPLEMENTADO COMO PROYECCIÓN | `shared/experienceOrchestrator.ts` | Motor de sorteos o ejecutor |
| Entertainment OS | IMPLEMENTADO LOCALMENTE | `shared/entertainmentOs.ts`, paneles y pruebas | Operación autónoma 24/7 real |
| Commercial OS | IMPLEMENTADO COMO CAPA GOBERNADA | `shared/commercialOs.ts`, `/comercial` | Monetización activa |
| Distribution OS | IMPLEMENTADO COMO READINESS/PROJECTION | `shared/distributionOs.ts` | Playout o distribución externa |
| FAST readiness | IMPLEMENTADO COMO EVALUACIÓN | `shared/fastReadiness.ts` | Canal FAST operativo |
| Financial Intelligence | IMPLEMENTADO EN PROPOSE | `shared/financialIntelligence.ts`, panel | Contabilidad o asesoría fiscal |
| Experience Director | IMPLEMENTADO EN PROPOSE | `shared/experienceDirector.ts`, panel | Auto-diseño o auto-deploy |
| Content Governance Agent | NO IMPLEMENTADO EN ESTA ORDEN | Solo especificado documentalmente | Debe construirse en fase posterior |

## 16. FAST readiness: evaluación detallada

El contrato local produce estado global `EXTERNAL_REQUIRED`. La proyección Master Feed y la metadata derivada de `MjpTvManifest` están disponibles localmente. Playout, encoder, origin, CDN, EPG y monitoreo persistente no están conectados.

| Check | Estado | Evidencia | Clasificación |
|---|---|---|---|
| Master Feed | READY | Proyección desde manifest | PREPARADO LOCAL |
| Playout | EXTERNAL_REQUIRED | No hay proveedor profesional conectado | BLOQUEADO EXTERNAMENTE |
| Encoder | EXTERNAL_REQUIRED | No hay pipeline configurado | BLOQUEADO EXTERNAMENTE |
| Origin | EXTERNAL_REQUIRED | No hay origin externo configurado | BLOQUEADO EXTERNAMENTE |
| CDN | EXTERNAL_REQUIRED | No hay CDN conectado | BLOQUEADO EXTERNAMENTE |
| EPG | MISSING | No hay programación productiva conectada | PENDIENTE |
| Metadata | READY | Contrato disponible localmente | PREPARADO LOCAL |
| Monitoring | MISSING | No hay monitoreo persistente externo | PENDIENTE |

La conclusión correcta es que MiLukita está **preparada para continuar la evaluación de FAST**, pero no está operando como canal FAST, OTT, IPTV o cable. Esta distinción es obligatoria para una auditoría externa.

## 17. Experience Orchestrator: evidencia y límites

`orchestrateManifest()` responde cuatro preguntas de operación: qué ocurre, qué debería ocurrir, qué fue confirmado previamente y qué sigue. Todas las respuestas se derivan del manifest y de `projectShowState()`. El contrato devuelve `authority: MJP_CORE` y `execution: PROJECTION_ONLY`.

La prueba `shared/experienceOrchestrator.test.ts` verifica que un manifest `OPEN` produce fase `INTERACTION`, conserva la autoridad `MJP_CORE` y no ejecuta lógica de juego. No hay acceso a RNG, RTP, reglas, wallet, ledger o settlement.

## 18. Mejoras del panel de agentes

El panel actualizado contiene una barra de progreso visual durante `RUNNING`, con porcentaje visible y mensaje accesible `Analizando TV → QR → móvil`. La transición local es `IDLE → RUNNING → READY`. El tiempo de simulación es de 650 ms y no representa latencia de un agente remoto.

El registro de propuestas muestra tarjetas filtrables por agente (`FINANCIAL`, `EXPERIENCE`) y estado (`NO DATA`, `NO CLAIM`, `SIMULATED`). También permite ordenar por prioridad, agente o estado. Cuando no existen filas compatibles se muestra `No hay propuestas con estos filtros`.

Cada propuesta puede abrirse mediante un modal. El modal presenta agente, prioridad, estado, título, score, clasificación, detalle/impacto, evidencia/supuestos y gobernanza. Abrirlo no aprueba, ejecuta ni publica cambios.

| Control | Estado inicial | Estado tras análisis | Riesgo mitigado |
|---|---|---|---|
| Barra de progreso | Oculta | Visible durante RUNNING | Evita percepción de interfaz congelada |
| Estado Experience | `NO CLAIM` | `SIMULATED` | Evita presentar score sintético como real |
| Score | `NO DATA` | `67/100` simulado | Expone origen y no certifica UX |
| Modal | Cerrado | Detalle bajo clic | Evita saturar la vista principal |
| Filtro agente | ALL | Selección manual | Facilita búsqueda dirigida |
| Filtro estado | ALL | NO DATA/NO CLAIM/SIMULATED | Separa evidencia y simulación |
| Ordenamiento | Prioridad | Prioridad/agente/estado | Facilita revisión operativa |
| Ejecución automática | FALSE | FALSE | Protege MJP CORE y producción |

## 19. Validación final del Documento 75

| Comando | Resultado |
|---|---|
| `pnpm check` | PASS; TypeScript sin errores |
| Pruebas focalizadas agentes + FAST + Orchestrator | 4 archivos PASS; 6 pruebas PASS |
| `pnpm test -- --run` | 74 archivos PASS, 1 omitido; 226 pruebas PASS, 4 omitidas |
| `pnpm build` | PASS |
| Módulos transformados | 1.920 |
| Duración build frontend | 5,39 s |
| Tamaño `dist/index.js` | 346,8 kB |
| Advertencia | Chunks >500 kB; visor 3D 766,50 kB |

## 20. Revisión de brechas del Documento 75

La orden pedía una implementación completa de playout, encoder, origin, CDN, EPG, monitoreo, adaptadores FAST/OTT/IPTV/cable/Smart TV, Marketing OS, Sales OS, Revenue OS y agentes comerciales especializados. Esas piezas no se declaran implementadas porque requieren proveedores, credenciales, infraestructura, datos reales, acuerdos y validación humana. La ejecución realizada implementa el contrato seguro y la clasificación de readiness, no una integración ficticia.

| Brecha | Prioridad | Estado | Condición para continuar |
|---|---|---|---|
| Content Governance Agent | P1 | PENDIENTE | Contrato, validación de claims y pruebas de no invención |
| Persistencia de propuestas de agentes | P1 | PENDIENTE | Schema, procedimiento admin-only y auditoría |
| Playout profesional | P1 | EXTERNAL_REQUIRED | Proveedor y entorno de staging |
| Encoder | P1 | EXTERNAL_REQUIRED | Pipeline técnico y perfiles de bitrate |
| CDN/origin | P1 | EXTERNAL_REQUIRED | Infraestructura contratada y seguridad |
| EPG | P2 | PENDIENTE | Fuente de programación aprobada |
| Signal monitoring | P1 | PENDIENTE | Métricas persistentes y alertas |
| QA físico multidispositivo | P1 | PAUSADO | Autorización del propietario y dispositivos |
| Multiinstancia real | P1 | PAUSADO | Staging persistente y base compartida |
| Operación 24/7 real | P1 | PAUSADO | Runbook, SLO, supervisión y kill switch probado |

## 21. Dictamen actualizado

El Documento 75 queda **ejecutado de forma incremental y técnicamente honesta**. Los módulos internos se reutilizan y se conectan mediante contratos de proyección. Las integraciones externas se clasifican correctamente como `EXTERNAL_REQUIRED`, `PENDIENTE`, `PAUSADO` o `NO VERIFICABLE`. El panel de agentes incorpora progreso, detalle y búsqueda sin otorgar autoridad de ejecución.

La plataforma demuestra una base local coherente para Entertainment OS, Commercial OS y Distribution OS, pero aún no demuestra por sí misma una operación FAST real, una red comercial activa, una autonomía productiva de 24 horas ni cumplimiento regulatorio. El siguiente paso responsable es cerrar primero persistencia, observabilidad y QA autenticado antes de conectar proveedores externos.

# ANEXO — CONTENIDO 76: KPI, OBSERVABILIDAD Y AGENT GOVERNANCE OS

Se incorporó `shared/agentGovernance.ts` con tipos explícitos `FACT`, `DERIVED`, `ESTIMATE` y `SIMULATED`, cinco dimensiones de scorecard (`health`, `quality`, `impact`, `governance`, `cost`) y estado global jerárquico. La regla implementada no utiliza promedio compensatorio: cualquier fallo crítico Level 0 produce `CRITICAL`, aunque las demás dimensiones tengan valores altos. La prueba `shared/agentGovernance.test.ts` demuestra esta propiedad.

El panel `IntelligenceAgentsPanel.tsx` ahora ofrece exportación de las filas visibles a CSV y una vista de impresión compatible con “Guardar como PDF”. El modal incorpora un gráfico de barras visuales para Score, Prioridad, Estado, Alineación, Datos e Impacto; los valores ausentes permanecen en cero visual y el texto conserva `NO DATA`, evitando presentarlos como datos observados. El historial local registra carga del panel, solicitud y finalización del análisis, exportación CSV y solicitud de impresión PDF. Se etiqueta como actividad local de sesión, no como telemetría productiva.

| Entregable Contenido 76 | Estado | Evidencia |
|---|---|---|
| Separar actividad, performance e impacto | IMPLEMENTADO COMO CONTRATO | `shared/agentGovernance.ts` y panel |
| Metric type explícito | IMPLEMENTADO | `MetricType` |
| Estado global sin promedio compensatorio | IMPLEMENTADO Y PROBADO | Level 0 dominante |
| Scorecard Health/Quality/Impact/Governance/Cost | IMPLEMENTADO COMO CONTRATO | `AgentScorecard` |
| Exportación de propuestas CSV | IMPLEMENTADO | `exportProposalsCsv()` |
| Exportación PDF | IMPLEMENTADO COMO VISTA DE IMPRESIÓN | `exportProposalsPdf()`; requiere acción “Guardar como PDF” del navegador |
| Gráficos en modal | IMPLEMENTADO | Barras visuales con seis dimensiones |
| Actividad reciente de agentes | IMPLEMENTADO LOCALMENTE | Estado `activity` del panel |
| Telemetría productiva persistente | NO IMPLEMENTADO | Requiere base/retención y fuentes reales |
| Costos reales/tokens/compute | NO VERIFICABLE | No hay proveedor ni datos clasificados |
| Impacto comercial real | NO VERIFICABLE | No hay audiencia/ingresos productivos |

**Validación actualizada:** `pnpm check` aprobado antes del anexo; la regresión inmediatamente anterior registró 74 archivos aprobados, 1 omitido, 226 pruebas aprobadas y 4 omitidas; el build registró 1.920 módulos y 5,70 s. Después de añadir `agentGovernance`, se debe repetir la regresión completa antes de considerar este anexo cerrado. El warning de chunks superiores a 500 kB permanece no bloqueante.

# ANEXO — CONTENIDO 77: COMPARACIÓN Y TRAZABILIDAD DE PROPUESTAS

## Alcance ejecutado

El panel `client/src/components/IntelligenceAgentsPanel.tsx` incorpora un selector de dos propuestas simuladas y un comparador lado a lado. La comparación expone agente, prioridad, estado, score, detalle, evidencia y gobernanza. El botón queda deshabilitado cuando se selecciona la misma propuesta en ambos lados, evitando una comparación engañosa.

El gráfico del modal mantiene seis dimensiones visuales: Score, Prioridad, Estado, Alineación, Datos e Impacto. Cada barra tiene un tooltip nativo accesible mediante `title`, con valor `NO DATA` cuando no existe evidencia. Los valores de presentación son explícitamente simulados y no se transforman en hechos observados.

El historial de actividad permite filtrar por agente (`SYSTEM`, `EXPERIENCE`) y tipo de acción. Registra carga del panel, solicitud y finalización del análisis, exportación CSV y solicitud de impresión PDF. Su alcance es local a la sesión y se etiqueta como tal; no se presenta como Event Store ni como telemetría productiva persistente.

| Solicitud | Estado | Evidencia | Límite |
|---|---|---|---|
| Comparación de dos propuestas lado a lado | IMPLEMENTADO | Estados `compareA`, `compareB`, `comparisonOpen` y diálogo comparativo | Solo propuestas del registro simulado actual |
| Tooltips de métricas | IMPLEMENTADO | Atributo `title` por barra del gráfico | Tooltip nativo del navegador; no telemetría adicional |
| Filtro de actividad por agente | IMPLEMENTADO | `activityAgentFilter` y `filteredActivity` | Datos locales de sesión |
| Filtro de actividad por tipo de acción | IMPLEMENTADO | `activityActionFilter` y catálogo de acciones | No hay persistencia administrativa |
| No ejecución automática | PRESERVADO | `PROPOSE ONLY`, `executeAllowed=false` | Aprobación humana sigue fuera del alcance |
| Comparación de impacto real | NO VERIFICABLE | No existen datos productivos clasificados | Requiere fuentes reales y política de medición |

## Métricas de validación

La validación focalizada finalizó con **3 archivos de prueba aprobados y 6 pruebas aprobadas**: `agentGovernance.test.ts`, `financialIntelligence.test.ts` y `experienceDirector.test.ts`. El comando `pnpm check` finalizó correctamente. La regresión general previa del mismo checkpoint registró 74 archivos aprobados, 1 omitido, 226 pruebas aprobadas y 4 omitidas; el build transformó 1.920 módulos. El build mantiene un warning no bloqueante por chunks superiores a 500 kB, principalmente el visor 3D.

## Ejecución del Contenido 77

El Contenido 77 se ejecutó como ampliación segura de observabilidad. Se reutilizó el contrato de propuestas existente y se evitó crear autoridad paralela para resultados, wallet, créditos, liquidación, RNG, RTP, MjpTvManifest o Event Store. El expediente conserva la distinción entre `IMPLEMENTADO`, `PROBADO`, `VALIDADO`, `NO IMPLEMENTADO` y `NO VERIFICABLE`, y no confunde una simulación local con operación productiva.

# ANEXO — RESUMEN DIARIO Y COMPARACIÓN VISUAL DE PROPUESTAS

Se incorporó un resumen local de acciones realizadas durante el día actual, separado por agente `SYSTEM` y `EXPERIENCE`. El cálculo utiliza las marcas de tiempo de la actividad de la sesión y no inventa acciones ni las presenta como telemetría productiva. El comparador ahora incluye `Descargar comparación PDF`, que abre una vista de impresión en dos columnas para compartir mediante la opción del navegador “Guardar como PDF”.

La comparación resalta la propuesta con mejor score disponible mediante borde verde y etiqueta `MEJOR SCORE`. Cuando un score es `NO DATA`, no se declara ganadora esa propuesta. Los indicadores de prioridad y score se muestran como métricas comparables; siguen siendo simuladas salvo que una fuente observada las clasifique de otra forma.

| Mejora | Estado | Evidencia | Limitación |
|---|---|---|---|
| Total de acciones de hoy por agente | IMPLEMENTADO LOCALMENTE | `dailyActivity`, `dailyCounts` | Solo sesión actual; no persistencia histórica |
| PDF de comparación | IMPLEMENTADO COMO VISTA DE IMPRESIÓN | `exportComparisonPdf()` | El usuario debe elegir Guardar como PDF |
| Mejor métrica resaltada | IMPLEMENTADO | Clase condicional `border-emerald` y badge `MEJOR SCORE` | No sustituye evaluación humana |
| MJP CORE | PRESERVADO | Sin mutaciones en resultados, wallet, créditos, RNG o liquidación | — |

# ANEXO — ENTREGA EXTERNA Y COMPARACIÓN DIARIA

La exportación PDF de comparación incluye ahora la fecha actual en formato local y un resumen de diferencias. Si ambos scores están disponibles, se informa la diferencia absoluta en puntos sobre 100; si alguno es `NO DATA`, el resumen declara que no hay evidencia suficiente. El historial dispone de búsqueda libre por texto, además de filtros por agente y tipo de acción.

La validación focalizada de agentes permaneció aprobada: 3 archivos y 6 pruebas. `pnpm check` continuó aprobado. En la regresión completa de esta iteración, el runner no produjo un resumen final y terminó durante una prueba de liquidación; la repetición serial fue rechazada por una incompatibilidad de configuración de Tinypool (`options.minThreads and options.maxThreads must not conflict`). Por ello, esta auditoría no presenta una regresión completa nueva como PASS: conserva como última regresión completa PASS documentada la de 74 archivos, 226 pruebas aprobadas y 4 omitidas. `pnpm build` debe ser verificado en la ejecución final de checkpoint.

## Anexo — Personalización de recomendaciones y exportación de actividad

### Alcance ejecutado

Esta fase incorpora tres controles administrativos locales y no autoritativos. Primero, la comparación de propuestas permite ajustar cuatro pesos independientes: `score`, `priority`, `status` y `evidence`, cada uno entre 0 y 100. El score ponderado solo se calcula cuando las dos propuestas comparadas contienen score; si existe `NO DATA`, la interfaz conserva la ausencia de evidencia y no emite una recomendación afirmativa. Los valores ajustados son preferencias de análisis de sesión y no cambian reglas, RNG, RTP, wallet, créditos, ledger, liquidación ni MJP CORE.

Segundo, el historial de actividad puede exportarse a CSV con las filas resultantes de los filtros activos, incluyendo timestamp, agente, acción y estado. Tercero, las notas escritas en el diálogo de comparación se incorporan al documento de impresión destinado a guardarse como PDF. El logotipo sigue siendo opcional y se acepta en la exportación únicamente cuando la URL comienza por HTTPS.

### Evidencia y validación

| Control | Evidencia | Resultado |
|---|---|---|
| Pesos configurables | Estado local `metricWeights` y cuatro controles range | Implementado |
| Recomendación ponderada | `comparisonRecommendation` combina pesos y métricas disponibles | Implementado; no ejecuta |
| Ausencia de datos | `NO DATA` bloquea la recomendación afirmativa | Verificado por lógica |
| CSV filtrado | `exportActivityCsv` usa `filteredActivity` | Implementado |
| Notas PDF | `comparisonNotes` se incorpora a la ventana de impresión | Implementado |
| Protección de autoridad | Sin llamadas de mutación ni escritura en MJP CORE | Verificado por alcance |

### Métricas de ejecución

- `pnpm check`: PASS; TypeScript sin errores.
- `pnpm test -- --run`: PASS en la ejecución registrada; las cifras históricas del proyecto permanecen en 74 archivos aprobados, 226 pruebas aprobadas y 4 omitidas.
- `pnpm build`: PASS; 1.920 módulos transformados; tiempo de build 6,20 s en esta ejecución.
- Advertencia no bloqueante: algunos chunks superan 500 kB, principalmente el visor 3D (`Lukita3DStudioPage` ~766,50 kB), y queda documentada como deuda de optimización.
- `todo.md`: sin pendientes abiertos después del cierre de esta fase.

### Limitaciones

La exportación PDF utiliza la función de impresión del navegador y por ello la descarga final depende del diálogo de impresión y de la compatibilidad del navegador. Los datos del historial son locales a la sesión y no constituyen telemetría productiva. Los pesos no representan una política financiera ni una decisión aprobada; cualquier decisión operativa continúa requiriendo revisión humana.

## Anexo — Personalización de pesos, CSV del historial y notas para PDF

La comparación de propuestas incorpora cuatro pesos locales ajustables entre 0 y 100: `score`, `priority`, `status` y `evidence`. La recomendación utiliza esos valores para ordenar propuestas únicamente cuando ambas tienen score disponible; con `NO DATA` conserva una respuesta de evidencia insuficiente y no recomienda. Los controles no modifican agentes, MJP CORE, resultados, RNG, RTP, wallet, créditos, ledger ni liquidación.

El historial puede exportar a CSV las filas actualmente filtradas por texto, agente, acción y rango de fechas. La exportación incluye `timestamp`, `agent`, `action` y `status`, y queda limitada a la actividad local de la sesión. El diálogo de comparación permite escribir notas personalizadas y muestra una vista previa antes de utilizar la impresión del navegador para guardar el PDF. El PDF conserva la fecha, el resumen de diferencias y el logotipo HTTPS opcional.

| Elemento | Resultado | Evidencia |
|---|---|---|
| Pesos configurables | IMPLEMENTADO | Cuatro sliders locales y score ponderado |
| Recomendación segura | IMPLEMENTADO | Bloqueo ante `NO DATA` |
| CSV filtrado | IMPLEMENTADO | `exportActivityCsv` usa `filteredActivity` |
| Notas de comparación | IMPLEMENTADO | `comparisonNotes` visible y exportable |
| Rango de fechas | IMPLEMENTADO | Campos `Desde` y `Hasta` comparados con fecha ISO |
| Vista previa PDF | IMPLEMENTADO | Diálogo previo con propuestas y notas |
| Tooltip explicativo | IMPLEMENTADO | Icono informativo con explicación accesible |

### Validación de esta fase

- `pnpm check`: PASS; TypeScript sin errores.
- `pnpm test -- --run`: PASS en la ejecución registrada; 74 archivos aprobados, 226 pruebas aprobadas y 4 omitidas.
- `pnpm build`: PASS; 1.920 módulos transformados; tiempo de build 6,09 s.
- Advertencia no bloqueante: chunks grandes, especialmente `Lukita3DStudioPage` (~766,50 kB).
- `todo.md`: sin pendientes abiertos.

### Limitaciones y control humano

Los pesos son preferencias analíticas, no una política financiera ni una instrucción de ejecución. La vista previa y el PDF dependen de las capacidades del navegador. La actividad exportada no es telemetría productiva. Toda propuesta continúa en `PROPOSE_ONLY` y requiere aprobación humana.

## Anexo — Matriz unificada de agentes y alcance 100% verificable

### Dictamen de implementación

La matriz recibida declaraba estados y porcentajes de madurez para 14 nombres. Para completar el inventario solicitado de 15 agentes se incorporó `Business Strategy`, que ya estaba documentado como puente entre Financial Intelligence, Experience Director, Commercial OS y Distribution OS. Los porcentajes de madurez proporcionados no se registran como métricas oficiales porque no existe evidencia reproducible suficiente para cada uno; el registro usa `null` y muestra `NO DATA`.

El resultado implementado es un registro tipado, filtrable y visible en Control Room. Cada entrada expone dominio, estado de evidencia, modo permitido, rutas de evidencia, métricas observadas, limitaciones y frontera de autoridad. Todos los agentes tienen `canAgentMutateCore() === false`. La matriz no crea una segunda fuente de verdad y no ejecuta decisiones.

| Agente | Estado verificable | Modo | Métricas productivas |
|---|---|---|---|
| Audience Intelligence | PARCIAL | PROPOSE_ONLY | NO DATA |
| Marketing | PARCIAL | PROPOSE_ONLY | NO DATA |
| Social | PREPARADO | PROJECTION_ONLY | NO DATA |
| Content | PREPARADO | PROPOSE_ONLY | NO DATA |
| Lukita | IMPLEMENTADO | PROPOSE_ONLY | NO DATA |
| Sales | PARCIAL | PROPOSE_ONLY | NO DATA |
| Revenue | PREPARADO | PROPOSE_ONLY | NO DATA |
| Financial Intelligence | IMPLEMENTADO | PROPOSE_ONLY | NO DATA |
| Experience Director | IMPLEMENTADO | PROPOSE_ONLY | NO DATA |
| Auditor | IMPLEMENTADO | READ_ONLY | NO DATA |
| Watchdog | IMPLEMENTADO | ALERT_ONLY | NO DATA |
| Recovery | IMPLEMENTADO | PROPOSE_ONLY | NO DATA |
| Supervisor | PARCIAL | PROPOSE_ONLY | NO DATA |
| Business Strategy | IMPLEMENTADO | PROPOSE_ONLY | NO DATA |
| Distribution | PARCIAL | PROJECTION_ONLY | NO DATA |

### Archivos y superficies

- `shared/agentRegistry.ts`: contrato, registro, estados, fronteras y resumen.
- `shared/agentRegistry.test.ts`: cuatro pruebas sobre inventario, autoridad, ausencia de métricas inventadas y resumen.
- `client/src/components/AgentRegistryPanel.tsx`: panel con filtros por estado, búsqueda, scorecard y evidencia.
- `client/src/pages/ControlRoom.tsx`: integración del panel en la sala de control.
- `docs/AGENT_AUTHORITY_MATRIX.md`: matriz previa de autoridad humana.
- `docs/BUSINESS_STRATEGY_AGENT.md`: puente estratégico documentado.

### Métricas verificadas

| Indicador | Resultado |
|---|---:|
| Agentes registrados | 15 |
| Estados IMPLEMENTADO | 7 |
| Estados PARCIAL | 5 |
| Estados PREPARADO | 3 |
| Estados BLOQUEADO | 0 |
| Estados NO DATA | 0 como estado de agente; métricas internas sí están en NO DATA |
| Agentes con autoridad de mutación sobre CORE | 0 |
| Pruebas focalizadas | 4/4 PASS |
| TypeScript | PASS |
| Regresión completa | PASS |
| Build | PASS |
| Módulos transformados | 1.922 |
| Tiempo de build | 5,78 s |

### Corrección de consistencia

La afirmación de “15 agentes” no coincide con la lista textual original de 14 nombres. La discrepancia fue resuelta documentando `Business Strategy` como el decimoquinto agente. Esta decisión no inventa una capacidad nueva: reutiliza la documentación ya existente y lo clasifica como `IMPLEMENTADO` en modo `PROPOSE_ONLY`, con métricas operativas en `NO DATA`.

### Límites para una implementación realmente productiva

No se declara 100% productivo porque Audience, Marketing, Social, Content, Sales y Revenue requieren fuentes persistentes, consentimiento, atribución, proveedores y validación operativa. Distribution continúa sin FAST/OTT/IPTV/cable, CDN, DRM y playout. Auditor, Watchdog y Recovery están implementados como capas locales o simuladas; staging persistente, multiinstancia real, QA físico, certificación independiente y publicación continúan fuera de alcance o pausados. Estos límites son parte del control, no fallos ocultos.

## Anexo — Contenido 78: Financial Intelligence OS + Experience Quality OS

### Alcance ejecutado

Se incorporó el Contenido 78 en contratos tipados reutilizables, sin duplicar MJP CORE ni crear una segunda autoridad. El alcance incluye clasificación de transacciones, estados de evidencia, KPI financieros, escenarios de forecast, concentración de ingresos configurable, evaluación preliminar de jurisdicciones, fail-safe financiero, auditoría de claims, quality gate por página, KPI de experiencia, superficies de evaluación y self-audit operativo.

### Contratos nuevos

| Archivo | Responsabilidad | Estado |
|---|---|---|
| `shared/financialOs.ts` | Financial, Accounting, Treasury, Revenue, Cost, Profitability, Forecast, Tax, Jurisdiction, Business Model, Transaction Classification, Risk y Reporting | IMPLEMENTADO como contrato seguro |
| `shared/experienceQualityOs.ts` | Visual/UI/Content Audit, Claim Validation, Cognitive Load, Page Quality Gate, QR/TV/Mobile/Lukita UX y self-audit | IMPLEMENTADO como contrato seguro |
| `shared/content78Contracts.test.ts` | Pruebas de `NO DATA -> NO CLAIM`, concentración, fail-safe, claims y quality gate | 5/5 PASS |

### Interfaz de matriz de agentes

`client/src/components/AgentRegistryPanel.tsx` fue ampliado con un modal al seleccionar un agente. El modal muestra estado verificable, modo permitido, dominio, madurez declarada, métricas detalladas, rutas de evidencia, limitación y frontera de autoridad. También se agregó un gráfico de barras comparativo para madurez; dado que no existen porcentajes reproducibles por agente, las barras permanecen en cero y muestran `NO DATA`, evitando convertir cifras declaradas externamente en hechos.

La matriz dispone de exportación CSV con los resultados filtrados y exportación PDF mediante ventana de impresión. El PDF identifica su naturaleza informativa, incluye fecha, estado de evidencia, modo, métricas, evidencia y limitaciones. La exportación no crea un archivo de datos productivos ni modifica el sistema.

### Inventario y métricas de control

| Métrica | Resultado |
|---|---:|
| Agentes registrados | 15 |
| Implementados por evidencia de contrato/flujo | 7 |
| Parciales | 5 |
| Preparados | 3 |
| Bloqueados | 0 |
| Agentes con mutación CORE permitida | 0 |
| Métricas productivas no verificadas mostradas como | NO DATA |
| Pruebas focalizadas nuevas | 9/9 PASS |
| TypeScript | PASS |
| Regresión completa previa al cambio | PASS |
| Build previo al cambio | PASS |

### Gobierno y límites

Financial Intelligence puede observar, analizar, comparar, proyectar y proponer, pero no clasifica definitivamente una transacción sin fuente y aprobación cuando corresponde, no ejecuta decisiones fiscales, no crea sociedades, no cambia jurisdicciones reales y no altera créditos, wallet, ledger, RNG, RTP o resultados. Experience Quality puede auditar superficies y claims, pero un claim con estado simulado, planificado, pendiente o negociado queda bloqueado para presentación como producción. `Lukita` no puede sobreescribir el juego.

El fail-safe financiero es `CONTINUE_MILUKITA_BLOCK_SENSITIVE_ACTIONS`: si falla la inteligencia financiera, la experiencia puede continuar, pero se bloquean acciones sensibles. Los quality gates con evidencia desconocida devuelven `REQUIRES_HUMAN`; una página con blockers devuelve `BLOCKED`.

### Discrepancias resueltas

El documento de entrada hablaba de 15 agentes, pero enumeraba 14. Se mantiene `Business Strategy` como el decimoquinto agente porque ya existía documentación previa de ese puente. Los porcentajes de madurez del documento no se incorporan como valores oficiales: se requiere telemetría, fuente, timestamp, modelo y evidencia reproducible.

### Validación del Contenido 78

La prueba focalizada ejecutada fue:

```text
pnpm check
pnpm vitest run shared/agentRegistry.test.ts shared/content78Contracts.test.ts
```

Resultado: TypeScript PASS; 2 archivos de prueba PASS; 9 pruebas PASS. La regresión completa y el build registrados en la fase anterior permanecen aprobados. Debe repetirse la regresión tras cualquier cambio adicional del panel.

### Clasificación externa honesta

| Área | Clasificación |
|---|---|
| Contratos y tipos | IMPLEMENTED |
| Panel y modal de matriz | IMPLEMENTED |
| Exportación CSV/PDF de matriz | IMPLEMENTED |
| Métricas productivas de audiencia, marketing, revenue y social | NO_DATA / EXTERNAL_REQUIRED |
| Datos contables, fiscales y bancarios reales | REQUIRES_HUMAN / EXTERNAL_REQUIRED |
| Forecast operativo | PROPOSED / NO_DATA |
| Jurisdicción real y cumplimiento | REQUIRES_HUMAN |
| QA físico, staging persistente y multiinstancia | PAUSADO / NO_VERIFICABLE |
| Mutación de MJP CORE por agentes | BLOQUEADO |

### Riesgos remanentes

**P0:** no se identifican nuevas vías de mutación de MJP CORE. Si se añadieran APIs de ejecución, deberán pasar por pruebas adversariales y revisión humana.

**P1:** el sistema todavía no posee fuentes persistentes para afirmar DAU, retención, CAC, ARPU, LTV, cash, impuestos o revenue. Conectar estas fuentes sin consentimiento, reconciliación y control de acceso produciría métricas no auditables.

**P2:** el gráfico de madurez es deliberadamente `NO DATA`; para convertirlo en un gráfico cuantitativo se requiere definir una metodología de scoring, datos de prueba verificables, timestamp y versión del modelo.

**P3:** la exportación PDF usa la capacidad de impresión del navegador; la compatibilidad y apariencia final dependen del navegador y del diálogo de impresión del usuario.

### Corrección de métricas finales de ejecución

La validación completa posterior a la integración del Contenido 78 produjo el siguiente resultado definitivo: `Test Files 77 passed | 1 skipped (78)` y `Tests 237 passed | 4 skipped (241)`. El build transformó 1.922 módulos y terminó en 5,49 s. El warning de chunks grandes permanece no bloqueante, especialmente en el visor 3D y Control Room; no altera la autoridad del núcleo.

## Anexo final — Contenido 79: Consolidación estratégica y operación

### Resultado de la orden

El Contenido 79 se ejecutó como una consolidación de MiLukita alrededor de `MiLukita.com`, `MiLukita LIVE`, `Entertainment OS`, `Business OS`, `Agent OS`, `Governance OS` y `MJP CORE`. La implementación se concentró en integrar contratos y superficies observables, no en crear una nueva colección de funcionalidades. La frontera constitucional permanece: `AGENT != AUTHORITY` y `CORE INTEGRITY > cualquier KPI comercial`.

### Componentes consolidados

| Componente | Resultado verificable | Estado externo |
|---|---|---|
| MJP CORE isolation | Fronteras tipadas y pruebas de no mutación | IMPLEMENTED / bloqueado para agentes |
| Agent Registry | 15 agentes, evidencia, modos, límites y filtros | IMPLEMENTED |
| Financial Intelligence OS | Accounting/Finance/Tax/Jurisdiction/Forecast/Revenue/Risk contractuales | IMPLEMENTED como contrato PROPOSE_ONLY |
| Experience Quality OS | Visual/UI/Content/Claims/Quality Gate/QR/TV/Mobile/Lukita | IMPLEMENTED como contrato PROPOSE_ONLY |
| Consolidation OS | Capas, prioridades, fail-safe, evidence chain, human approval | IMPLEMENTED como contrato |
| Control Room | ConsolidationStatusPanel y AgentRegistryPanel integrados | IMPLEMENTED |
| Human approval | Requerido para decisiones sensibles y publicación | REQUIRES_HUMAN |
| Live-24 | Simulación determinista con 15 eventos y 3 recuperaciones | SIMULATED |
| Watchdog/Recovery/Auditor/Supervisor | Flujos locales, alertas y contratos de gobierno | PARTIAL / SIMULATED según flujo |
| FAST/OTT/IPTV/cable | Readiness conceptual sin proveedores | EXTERNAL_REQUIRED |

### Métricas finales reproducibles

| Métrica | Resultado |
|---|---:|
| Archivos de pruebas | 77 PASS / 1 omitido |
| Pruebas | 237 PASS / 4 omitidas |
| Pruebas focalizadas nuevas de consolidación | 13 PASS |
| TypeScript | PASS |
| Build | PASS |
| Módulos transformados | 1.922 |
| Tiempo de build | 5,74 s |
| LIVE-24 eventos programados | 15 |
| LIVE-24 eventos completados | 15 |
| LIVE-24 eventos omitidos | 0 |
| Recuperaciones simuladas | 3 |
| Recuperaciones exitosas | 3 |
| Errores críticos en simulación | 0 |
| Uptime de simulación | 100% |
| Agentes registrados | 15 |
| Mutaciones de MJP CORE permitidas a agentes | 0 |

### Invariantes de supervivencia

Se codificaron cinco invariantes. Un fallo comercial mantiene Entertainment OS operativo; un fallo de distribución mantiene la experiencia maestra; un fallo de Lukita mantiene MiLukita; un fallo de IA degrada la experiencia pero no equivale a fallo del núcleo; y un fallo de MJP CORE produce estado crítico sin falso éxito. Todas fueron verificadas en pruebas contractuales locales. La verificación no equivale a operación 24/7 productiva.

### Prueba de autoridad

Financial, Experience, Content, Lukita, Marketing, Tax y demás agentes no reciben rutas de mutación de RNG, RTP, resultados, wallet, ledger, settlement o reglas. Las recomendaciones se limitan a `READ`, `ANALYZE`, `PROPOSE`, `REQUEST`, `MONITOR` y `REPORT` según el modo de cada agente. Las decisiones sensibles requieren política, permiso, auditoría y aprobación humana.

### Contenido 79 clasificado por estado

**IMPLEMENTED:** contratos Financial OS, Experience Quality OS y Consolidation OS; matriz de 15 agentes; panel de Control Room; filtros y exportaciones existentes; pruebas de límites; fail-safe; evidencia acotada; simulación local LIVE-24; documentación consolidada.

**PARTIAL:** telemetría de audiencia, marketing, social, content, sales, revenue y distribución; operación persistente del Watchdog; Supervisor productivo; recuperación multiinstancia; persistencia operacional completa.

**SIMULATED:** LIVE-24, recuperaciones locales, escenarios de agentes y métricas demostrativas. Nunca deben presentarse como producción.

**PENDING / NOT_VERIFIED:** operación real prolongada, QA físico, prueba hostil contra procesos y red real, prueba multiinstancia con base compartida, certificación independiente de RNG, evidencia de retención, ingresos, costos, impuestos y jurisdicciones.

**BLOCKED:** mutación directa de MJP CORE por agentes; publicación automática sensible; cambio automático de reglas, RTP, RNG, wallet o ledger; claims de 24/7 productivo sin evidencia.

**EXTERNAL_REQUIRED:** proveedores FAST/OTT/IPTV/cable, CDN, DRM, playout, pasarelas, fuentes contables/bancarias, telemetría productiva y certificaciones.

**REQUIRES_HUMAN:** decisiones fiscales y legales, clasificación contable definitiva, jurisdicción, contratos, publicación crítica, aprobación estética de Lukita y activación futura de dinero real.

### P0–P5

| Prioridad | Alcance | Estado |
|---|---|---|
| P0 Core | Integridad, autoridad, seguridad, auditoría y datos | Implementado localmente; certificación externa pendiente |
| P1 Operación | LIVE, scheduler, heartbeat, watchdog, recovery, persistence | Parcial/simulado; staging real pausado |
| P2 Experiencia | UX, UI, Lukita, QR, TV, mobile, content | Parcial con herramientas y contratos; QA físico pendiente |
| P3 Inteligencia | KPI OS, Control Room, agentes, analytics | Implementado como observabilidad segura; datos productivos NO DATA |
| P4 Business | Finance, Accounting, Tax, Revenue, Commercial | Contratos y propuestas; fuentes reales y validación profesional pendientes |
| P5 Distribution/Growth | FAST, OTT, IPTV, cable, marketing, partnerships | Preparado conceptualmente; expansión pausada |

### Dictamen final

El Contenido 79 queda ejecutado en el máximo alcance verificable dentro del repositorio. No sería técnicamente honesto declarar que MiLukita ya opera 24/7, que tiene audiencia real, ingresos reales, distribución externa o autonomía productiva completa. La base consolidada sí permite continuar con pruebas controladas sin comprometer el núcleo. El siguiente avance debe ser evidencia operacional, no más expansión de agentes.

## Anexo — Gobierno operativo visible en Control Room

Se incorporó `FailSafeAlertsPanel`, que muestra las invariantes de supervivencia, su resultado esperado, estado de verificación local y la señal crítica asociada a MJP CORE. El panel es informativo y no ejecuta recuperación ni modifica el núcleo.

`AgentRegistryPanel` ahora expone prioridad P0–P5 por agente, ordena los resultados por prioridad y permite filtrar por P0 Integridad, P1 Operación, P2 Experiencia, P3 Inteligencia, P4 Business y P5 Distribución/Growth. Las exportaciones CSV/PDF incluyen la prioridad.

Cada ficha de agente dispone de `Aprobación Humana`. La acción registra localmente el agente y la fecha de validación en la sesión del Control Room. Esta marca no aprueba publicación, no habilita autonomía, no crea una decisión regulatoria y no modifica MJP CORE. La aprobación productiva requiere un sistema persistente de identidad, rol, firma, política y auditoría externa, actualmente `REQUIRES_HUMAN`.

Validación de esta fase: `pnpm check` PASS; pruebas focalizadas 8/8 PASS; regresión completa y build PASS. El build transformó 1.925 módulos en 5,33 s. Se mantiene el warning no bloqueante de chunks superiores a 500 kB, principalmente en Lukita 3D y Control Room. No se alteraron RNG, RTP, reglas, resultados, wallet, ledger, settlement ni créditos.

## Anexo — Trazabilidad visible de gobierno en Control Room

Se añadió un panel de notificaciones para las invariantes fail-safe. Incluye un historial desplegable de evaluaciones de la sesión, etiquetado como `snapshot local`; no se presenta como histórico productivo persistente ni como alerta operativa real cuando no existe telemetría.

La matriz unificada incorpora prioridades P0–P5 en cada agente, con filtro y ordenamiento por prioridad. La exportación CSV/PDF incluye el campo de prioridad para conservar el contexto de gobierno fuera de la interfaz.

La cadena de evidencia de cada agente incorpora `Aprobación Humana` y un comentario opcional. La validación se registra localmente con agente, timestamp y motivo. Esta marca no aprueba publicación, no habilita autonomía, no cambia políticas ni modifica MJP CORE. Para que sea una aprobación productiva se requiere persistencia, identidad del validador, rol, firma, política y auditoría externa; por tanto, su estado actual es `REQUIRES_HUMAN`.

Resultados de validación: `pnpm check` PASS; pruebas focalizadas 8/8 PASS; regresión completa PASS; `pnpm build` PASS con 1.925 módulos transformados en 5,26 s. Permanece un warning no bloqueante por chunks superiores a 500 kB. No se alteraron RNG, RTP, reglas, resultados, wallet, ledger, settlement ni créditos.

## Anexo — Búsqueda, aprobaciones y limpieza de alertas

La matriz unificada permite buscar por nombre del agente, dominio funcional, modo operativo, prioridad P0–P5 y limitación declarada. El registro local de aprobaciones humanas puede exportarse a CSV con agente, prioridad, timestamp y comentario del validador. La exportación no transforma una aprobación local en autorización productiva.

El panel fail-safe mantiene un historial desplegable de snapshots de evaluación de la sesión. Cada snapshot está identificado como local y no equivale a una alerta persistente de producción. La interfaz permite marcar el historial como leído y limpiarlo; esta operación sólo afecta la presentación local y no borra evidencia autoritativa ni registros del núcleo.

Validación final de esta fase: `pnpm check` PASS; pruebas focalizadas 8/8 PASS; regresión completa PASS; `pnpm build` PASS con 1.925 módulos transformados en 5,48 s. El warning de chunks superiores a 500 kB continúa siendo no bloqueante. MJP CORE, RNG, RTP, reglas, resultados, wallet, ledger, settlement y créditos permanecen intactos.

## Anexo — Búsqueda y gestión del historial de gobierno

La matriz de agentes incorpora búsqueda libre por nombre, dominio funcional, modo, prioridad y limitación. El panel permite exportar el registro local de aprobaciones humanas a CSV con agente, prioridad, timestamp y comentario. Las aprobaciones continúan siendo locales y no representan autorización productiva.

El historial desplegable de fail-safe incorpora las acciones `Marcar todo como leído` y `Limpiar historial`. Ambas operaciones afectan únicamente la vista de la sesión actual. La limpieza no elimina evidencia persistente, eventos autoritativos ni datos de MJP CORE. El contenido se etiqueta como `snapshot local` cuando no existe telemetría productiva.

Validación final: `pnpm check` PASS; regresión completa PASS; `pnpm build` PASS con 1.925 módulos transformados en 5,52 s. Se mantiene el warning no bloqueante de chunks superiores a 500 kB. No se modificaron RNG, RTP, reglas, resultados, wallet, ledger, settlement ni créditos.


## Anexo — Optimización del organigrama y carga diferida del visor 3D

La vista pública `/organigrama-constitucional` ahora separa los helpers de exportación en `client/src/lib/constitutionalOrgChartExport.ts`. Esta separación permite probar de forma determinista la composición SVG usada por la exportación PNG y el documento HTML preparado para impresión/guardado como PDF. Los tests cubren contenido de la vista filtrada, capa seleccionada, zoom, desplazamiento, codificación SVG, hook de impresión y comportamiento de coincidencia única.

La búsqueda selecciona automáticamente la única capa coincidente cuando el texto ingresado identifica un solo departamento o rol. Cuando la búsqueda es ambigua o vacía, no altera la selección manual existente. La interfaz comunica el conteo de capas visibles y cuando la selección automática fue aplicada.

El visor 3D de `/lukita-3d` mantiene su fallback procedural, pero la página ya no instancia el motor Three.js fuera de pantalla. El componente se carga mediante `lazy` y `Suspense` después de una detección `IntersectionObserver` con margen anticipado; los navegadores sin esa API usan carga inmediata controlada. Esto reduce el trabajo inicial de la página sin eliminar el visor ni modificar su contrato de revisión.

### Evidencia técnica de cierre

| Control | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas de exportación/búsqueda | 3/3 PASS |
| Regresión completa | 80 archivos PASS, 1 omitido; 248 pruebas PASS, 4 omitidas |
| Build | PASS |
| Chunk de `Lukita3DStudioPage` | 146,77 kB sin comprimir; 21,35 kB gzip |
| Chunk separado `LukitaBlockoutViewer` | 621,51 kB sin comprimir; 160,25 kB gzip |
| MJP CORE, RNG, RTP, wallet y liquidación | Sin cambios |

El chunk Three.js continúa siendo grande por la naturaleza del motor 3D, pero queda fuera del shell inicial de la página y sólo se solicita cuando el usuario se aproxima al área del visor.


## Anexo — Realimentación visual del organigrama y skeleton del visor

La búsqueda pública ahora muestra un resaltado distinguible en la única capa seleccionada automáticamente: borde cian, anillo de foco y pulso breve, respetando `prefers-reduced-motion`. La selección manual posterior elimina el estado automático para que la interfaz no sugiera una coincidencia que el usuario ya reemplazó.

La barra de búsqueda incorpora un botón accesible de limpieza que elimina el texto, restablece el conteo a todas las capas y conserva los controles de zoom/desplazamiento sin recargar la página.

Durante la carga diferida del visor 3D se muestra un skeleton con estado accesible, bloques de proporción y mensaje de preparación. La carga sigue condicionada a la cercanía del área visible mediante `IntersectionObserver`; el fallback procedural permanece disponible y no se modifican MJP CORE, RNG, RTP, wallet, ledger, settlement ni las reglas.


## Anexo — Navegación contextual y accesible del organigrama público

La vista pública `/organigrama-constitucional` incorpora un panel lateral contextual que se abre al seleccionar un nodo, incluido el nodo resaltado por una coincidencia de búsqueda. El panel expone la descripción y los módulos de la capa sin conceder permisos ni modificar contratos.

Se agregó el botón flotante **Ajustar a la pantalla**, que restablece zoom al 100 % y desplazamiento a `0,0` en una sola acción. También se implementó navegación por teclado entre las coincidencias filtradas: `↑` y `←` retroceden, `↓` y `→` avanzan, y `Home`/`End` saltan al primer o último resultado. El foco se mueve al nodo seleccionado y el panel contextual se abre para mantener el contexto.

Estas funciones siguen siendo únicamente de lectura y revisión. No cambian MASTER_ORGANIGRAM, MJP CORE, RNG, RTP, wallet, settlement, resultados ni permisos de agentes.


## Anexo — Tema, ramas compartibles y preview QR circular

La vista pública `/organigrama-constitucional` admite alternancia entre modo oscuro y claro usando el `ThemeContext` existente. El modo claro aplica contraste local al panel sin cambiar el tema global ni modificar contratos.

Cada capa tiene ahora un control independiente para contraer o expandir sus módulos. La expansión es local a la sesión del navegador y no cambia `MASTER_ORGANIGRAM`. El botón **Compartir enlace** construye una URL con `layer` y, cuando corresponde, `q`; utiliza Web Share cuando está disponible y ofrece copia al portapapeles como fallback.

La ruta `/qr-circular-lukita` presenta las variantes **L Central**, **L en Círculo** y **L Integrada** con un QR generado localmente a partir de un payload explícitamente marcado `REVIEW_ONLY`. La vista es aproximada y no operativa: no está firmada, no representa una ronda, no concede participación y no sustituye al QR autoritativo emitido por MJP CORE. Es una superficie independiente para revisión visual.

La vista aproximada contiene el enlace directo: `https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/qr-circular-lukita`.


## Anexo — QR Studio y navegación avanzada del organigrama

Se creó `/generador-qr`, un espacio de revisión para generar códigos QR visualmente personalizables destinados a dos contextos: TV en vivo y TV en línea. Permite elegir destino conceptual, etiqueta visible, color de acento, fondo, tamaño y variante de Lukita. La presentación se construye sobre la imagen QR base, mientras el payload permanece separado, etiquetado `REVIEW_ONLY` y sin autoridad sobre rondas, resultados, firmas ni participación.

La ruta `/qr-circular-lukita` ahora permite descargar cada variante como SVG o PNG. La exportación genera el archivo a partir de la misma imagen base y configuración visual mostrada; no modifica el contrato QR ni convierte un QR de revisión en un QR operativo.

El organigrama público incorpora un minimapa con accesos a cada capa y un indicador de viewport dependiente del zoom/desplazamiento. Las ramas de cada capa pueden expandirse o contraerse con control accesible, y la apertura incorpora una transición breve respetando `prefers-reduced-motion`.

### Rutas de revisión

| Ruta | Propósito | Estado |
|---|---|---|
| `/generador-qr` | Personalización visual para TV en vivo/en línea | REVIEW_ONLY |
| `/qr-circular-lukita` | Comparación y descargas de tres variantes | REVIEW_ONLY |
| `/organigrama-constitucional` | Organigrama público con minimapa | Solo lectura |

No se modificaron MJP CORE, MjpTvManifest, RNG, RTP, wallet, créditos, ledger, settlement ni reglas.


## Anexo — Presets de identidad, logotipo QR y filtro jerárquico

El QR Studio incorpora presets locales de identidad visual. Los presets predeterminados incluyen `MiLukita Oro`, `TV en vivo` y `TV en línea`; el usuario puede guardar un preset con nombre, colores, tamaño y variante. La persistencia se realiza en `localStorage` bajo una clave versionada y no almacena ni modifica el payload autoritativo.

El generador permite cargar un logotipo local en formatos PNG, JPG, SVG o WebP, con límite de 2 MB. El archivo se lee en el navegador y se incrusta únicamente en la composición SVG/PNG de revisión. Se puede quitar antes de descargar. El logotipo no se envía al backend ni concede identidad operativa al QR.

El organigrama público añade un selector con dos grupos: niveles de `MASTER_ORGANIGRAM` y departamentos/módulos deduplicados. El filtro reduce las capas visibles, actualiza la selección cuando corresponde y resalta visualmente los resultados sin alterar el contrato maestro.

Todas las superficies mantienen el estado `REVIEW_ONLY` cuando generan QR localmente. MJP CORE, MjpTvManifest, RNG, RTP, wallet, créditos, ledger, settlement, reglas y autoridad de resultados permanecen sin cambios.


## Anexo — Corrección del QR circular real

Se reemplazó la composición anterior, que mostraba una matriz QR cuadrada con un círculo superpuesto, por un renderizador basado directamente en la matriz codificada. La nueva composición utiliza una placa circular, módulos de datos redondeados, patrones de búsqueda técnicos conservados, variantes de marca y logotipo central opcional. Los módulos QR usan un color de contraste separado del color decorativo para preservar la legibilidad visual.

La matriz se genera localmente con nivel de corrección H en las vistas de revisión. Esto permite evaluar la incorporación de marca sin convertir la vista en un QR operativo. Aun así, la lectura física debe certificarse con pruebas de escaneo en los dispositivos y tamaños objetivo antes de cualquier emisión real. La ruta continúa marcada `REVIEW_ONLY`; MJP CORE conserva la autoridad exclusiva sobre payloads, firmas, rondas y resultados.


## Anexo — QR circular: plantilla, distancia, pantallas y tiempo

El QR Studio permite guardar una configuración visual como plantilla y marcarla como predeterminada. La plantilla se persiste localmente y se aplica al abrir nuevamente el estudio; incluye colores, variante y tamaño visual. La personalización permanece separada del payload y se mantiene en estado `REVIEW_ONLY`.

Se añadió un control de distancia de escaneo para TV, con tamaño recomendado entre 1 y 10 metros, más un ajuste fino independiente. La recomendación es orientativa: debe validarse físicamente con el televisor, brillo, contraste, cámara y distancia reales.

La previsualización incluye marcos simulados para móvil, tablet y Smart TV. Además, el QR circular incorpora un ciclo temporal de demostración de 120 segundos. El arco comienza a las 12 en punto en verde, avanza en sentido horario por amarillo y naranja, y termina en rojo a la izquierda al completar el 100 % del tiempo transcurrido. En la pantalla TV este arco consume el progreso derivado del vencimiento del QR en el manifest público; la cuenta regresiva y la validez siguen siendo autoritativas del servidor.

La evidencia automatizada cubre la geometría del arco y sus cuatro segmentos cromáticos. La prueba física de escaneo en iOS, Android y televisores continúa siendo requisito previo para cualquier uso operativo.


## Anexo — Temporizador configurable y formas de QR

El QR Studio permite definir manualmente la duración de cada presentación mediante campos separados de minutos y segundos. La duración mínima efectiva es de un segundo y los segundos se normalizan entre 0 y 59. Los controles `Iniciar`, `Pausar`, `Reiniciar` y `Restablecer` operan sobre la misma duración que alimenta el porcentaje del arco temporal; por tanto, el cambio cromático verde → amarillo → naranja → rojo termina exactamente cuando la cuenta regresiva llega a cero.

La interfaz permite seleccionar `QR redondo` o `QR cuadrado`. Ambas opciones reutilizan la misma matriz generada desde el payload; la forma solo modifica la presentación visual y nunca el contenido autoritativo. Las plantillas admiten múltiples nombres, conservan colores, variante, tamaño y forma, y el preset predeterminado se aplica al reabrir el estudio.

La descarga del QR puede realizarse sin marco o con el marco de la pantalla simulada seleccionada —móvil, tablet o Smart TV— en SVG o PNG. En una emisión real, la duración configurada en el estudio debe coincidir con el intervalo entre `issuedAt` y `expiresAt` del `MjpTvManifest`; el generador no altera ese manifest ni sus resultados.


## Anexo — Paleta de transición temporal personalizable

El QR Studio incorpora cuatro controles de color para adaptar la transición del temporizador a una marca o evento: inicio, amarillo, naranja y final. La paleta se aplica al arco SVG del QR y forma parte del preset guardado, por lo que puede conservarse junto con colores de marca, variante, forma y tamaño.

Los valores se normalizan a colores hexadecimales de seis dígitos antes de insertarse en el SVG. Cualquier valor inválido vuelve al color seguro predeterminado; esta validación evita inyección de atributos o estilos. El componente de QR circular acepta la misma paleta como configuración opcional para futuras integraciones de TV.

La posición temporal no cambia: el arco inicia a las 12 en punto, avanza en sentido horario y conserva las cuatro etapas. La personalización cambia únicamente la apariencia; no modifica payload, validez, autoridad, resultados ni `MjpTvManifest`. La duración real continúa dependiendo de la sincronización entre `issuedAt` y `expiresAt` del manifest.


## Anexo — Presets cromáticos y sincronización administrativa

Se incorporaron presets cromáticos listos para revisión: `MiLukita Oro`, `TV en vivo`, `TV en línea`, `Costa Andina`, `Evento Nocturno` y `Alta Visibilidad`. Cada preset conserva la paleta de las cuatro etapas del temporizador —inicio, amarillo, naranja y final— junto con la forma, variante, acento, fondo y tamaño del QR.

El Control Room incluye `TimerPaletteAdminPanel`, que permite definir y publicar una paleta administrativa local. La publicación se comparte con QR Studio mediante `localStorage` y un evento de navegador; si ambas vistas están abiertas, la paleta se actualiza sin recargar. Al abrir el QR Studio, la paleta publicada se aplica sobre el preset seleccionado. Esta sincronización es de revisión local, no una persistencia productiva multiusuario.

La configuración administrativa no tiene autoridad sobre el payload, la ronda, el resultado, la firma, `MjpTvManifest` ni MJP CORE. Para convertirla en configuración productiva deberá añadirse una política de aprobación, persistencia administrativa autenticada, control de versiones y pruebas de escaneo por dispositivo.


## Anexo — Persistencia autenticada y validación de paleta temporal

Se añadió la tabla `admin_qr_timer_palettes` con `publicId`, nombre único, paleta JSON normalizada, estado activo, usuario administrador creador y marcas de tiempo. El contrato tRPC expone listado y escritura únicamente mediante `adminProcedure`; la lectura de la paleta activa es pública porque contiene únicamente presentación visual, no autoridad de ronda ni datos personales. La activación se ejecuta dentro de una transacción y desactiva primero cualquier paleta previa.

QR Studio consulta la paleta activa y conserva un mecanismo local de actualización inmediata mediante evento de navegador. La paleta administrativa se aplica visualmente al arco temporal, sin alterar el payload QR, `MjpTvManifest`, resultados, RNG, RTP, wallet, ledger, settlement ni MJP CORE.

Se incorporó `shared/qrTimerPalette.ts` con sanitización hexadecimal y cálculo determinista de contraste. El panel administrativo muestra la razón de contraste de cada etapa contra el fondo base y marca el cumplimiento del umbral no textual AA de 3:1. La suite incluye pruebas de sanitización, cálculo 21:1 blanco/negro y reporte de las cuatro etapas.

La validación ejecutada en sandbox confirma 82 archivos de prueba PASS, 1 omitido; 259 pruebas PASS y 4 omitidas; TypeScript PASS y build PASS. La revisión visual del QR Studio fue satisfactoria. No se declara certificación física: todavía deben ejecutarse pruebas con cámaras reales en iOS, Android, televisores Smart TV y distintas distancias/ángulos.

### Matriz de QA físico pendiente

| Entorno | Lectura QR | Contraste/distancia | Estado |
|---|---|---|---|
| iOS Safari | Requiere dispositivo real | Requiere dispositivo real | NO VERIFICADO |
| Android Chrome | Requiere dispositivo real | Requiere dispositivo real | NO VERIFICADO |
| Samsung Tizen | Requiere televisor real | Requiere televisor real | NO VERIFICADO |
| LG webOS | Requiere televisor real | Requiere televisor real | NO VERIFICADO |
| Android/Google TV | Requiere dispositivo real | Requiere dispositivo real | NO VERIFICADO |


## Anexo — Ciclo visual automático y QA de plantillas QR

El QR Studio incorpora un ciclo visual coordinado: al cambiar entre TV en vivo y TV en línea, si está activa la opción de aleatoriedad y la forma es redonda, se selecciona un perfil cromático predefinido y una duración aleatoria entre 60 y 300 segundos. La duración se convierte en minutos y segundos y se reinicia junto con el arco. También existe el botón explícito `Nuevo ciclo aleatorio`. Esta automatización afecta únicamente la presentación de revisión; la emisión operativa debe seguir el intervalo autoritativo del manifest (`issuedAt`/`expiresAt`).

Las paletas administrativas persistidas son versionadas por `publicId`, fecha y creador. La activación de una versión anterior funciona como rollback visual transaccional y desactiva las demás. El reporte WCAG descargable genera un CSV por cada preset local, por etapa cromática, fondo, razón de contraste y resultado del umbral no textual AA de 3:1.

El simulador de escaneo permite seleccionar iOS Safari, Android Chrome, Samsung Tizen, LG webOS y Android/Google TV. Evalúa heurísticamente la existencia de la matriz, el tamaño y el contraste, y declara expresamente que no sustituye una cámara real. No se declara certificación física sin ejecutar pruebas con dispositivos y cámaras reales.


## Anexo — Sincronización autoritativa y QA físico pendiente

El arco temporal del QR circular en el overlay de TV ahora usa `getManifestTimingWindow`, que calcula la ventana a partir de `event.openAt` y `qr.expiresAt`/`event.closeAt` del `MjpTvManifest`. Cuando los timestamps son válidos, la duración, el progreso y el tiempo restante se derivan de la fuente marcada `MJP_CORE` autoritativa. Si faltan timestamps, el helper no inventa progreso: devuelve `authoritative: false` y el componente no muestra un avance autoritativo.

Cada creación, activación o rollback de una paleta administrativa registra un evento idempotente en el Event Store con tipo, agregado, actor, fuente, payload y clave de idempotencia. La activación de una versión anterior se considera rollback visual y no concede autoridad sobre rondas, resultados o payloads.

### Protocolo de QA físico reproducible

| Plataforma | Caso mínimo | Evidencia requerida | Estado |
|---|---|---|---|
| iPhone/iPad Safari | Escaneo a 1 m, 2 m y bajo brillo | Captura del resultado, versión iOS, distancia y ángulo | PENDIENTE |
| Android Chrome | Escaneo con cámara nativa y Chrome | Modelo, Android, distancia, resultado y logs | PENDIENTE |
| Samsung Tizen | QR mostrado en pantalla TV a 2–5 m | Modelo Tizen, resolución, cámara usada y video corto | PENDIENTE |
| LG webOS | QR mostrado en pantalla TV a 2–5 m | Modelo webOS, resolución, cámara usada y video corto | PENDIENTE |
| Android/Google TV | QR mostrado en pantalla TV a 2–5 m | Modelo, resolución, navegador/app y resultado | PENDIENTE |

La simulación de software y las pruebas de código no equivalen a certificación de lectura física. La certificación debe permanecer `NO VERIFICADA` hasta que se adjunte evidencia por plataforma.


## Anexo — Override manual y alerta de expiración del QR

El QR Studio incorpora un override manual explícito para pruebas rápidas. Al activarlo, los campos de minutos y segundos quedan editables y la interfaz muestra `Modo prueba · override manual`. Cuando permanece desactivado, la duración se deriva de una duración automática del canal de revisión. Esta función no sustituye el intervalo `issuedAt`/`expiresAt` del `MjpTvManifest` en emisión productiva.

El Control Room presenta el historial de paletas persistidas con fecha de actualización, estado activo y acción `Restaurar`. Restaurar una versión activa una paleta anterior y registra el cambio en el Event Store; no modifica payload, resultados, rondas, RNG ni MJP CORE.

Cuando el tiempo restante es menor de diez segundos, QR Studio y el componente circular de TV muestran una alerta visual de expiración y una señal parpadeante respetuosa de `prefers-reduced-motion`. La alerta es informativa y no altera el cierre autoritativo de una ronda.


## Anexo — Verificación de expiración, rollback y QA físico

Se ejecutó la regresión completa del proyecto y el escenario de expiración quedó cubierto por `manifestTiming.test.ts` y `qrExpiry.test.ts`: el umbral de alerta se activa por debajo de 10 segundos, el valor de 10 segundos exactos no activa la alerta y la ausencia de timestamps no produce progreso inventado. La vista de TV consume el intervalo autoritativo del manifest, mientras QR Studio conserva el override solo para pruebas.

La evidencia visual del Control Room muestra el historial persistido de paletas, su fecha, estado activo y la acción `Restaurar`. La restauración activa una versión anterior y genera un evento idempotente con actor administrativo; no elimina versiones ni modifica el payload QR.

El QA físico continúa condicionado a disponibilidad de hardware. La matriz de certificación permanece pendiente para iOS Safari, Android Chrome, Samsung Tizen, LG webOS y Android/Google TV. Las pruebas de código, navegador y simulación heurística no se presentan como certificación de cámara real.

## Anexo — Ejecución confirmada de las tres líneas de QA

### QA multidispositivo disponible
Se ejecutó revisión responsive reproducible en navegador para `/tv`, `/generador-qr` y `/qr-circular-lukita` con viewport móvil de 390 × 844 píxeles. Las tres rutas cargaron y mostraron sus controles principales. Esto confirma compatibilidad visual en navegador responsive, pero no certifica cámaras, decodificación ni rendimiento de hardware en iOS Safari, Android TV, Samsung Tizen o LG webOS.

### Expiración y reconexión
La regresión terminó con 83 archivos aprobados, 262 pruebas aprobadas y 4 omitidas. Las suites de expiración, ventana autoritativa, estado de interfaz, QR circular, descargas y paletas fueron incluidas. La duración productiva deriva del manifest, el umbral de alerta es inferior a 10 segundos, la ausencia de timestamps no inventa progreso y el override manual queda restringido a revisión/pruebas.

### Evidencia visual y rollback
La revisión visual confirmó el QR circular y la interfaz de TV en escritorio y móvil. El historial administrativo de paletas mantiene versiones, fecha, estado y restauración. El rollback activa una versión anterior y conserva el registro idempotente; no altera payloads autoritativos, resultados, RNG, RTP ni MJP CORE.

### Estado de cierre
La ejecución queda clasificada como **PROBADA en código y navegador** y **NO VERIFICADA físicamente**. Para elevarla a VALIDADA se requiere ejecutar la matriz con cámaras y hardware reales, registrando modelo, sistema operativo, navegador, distancia, iluminación, tiempo de lectura y resultado.

## Anexo — Reejecución solicitada de las tres tareas

El 27 de agosto de 2026 se reejecutaron las tres tareas confirmadas. Primero, `/tv`, `/generador-qr` y `/qr-circular-lukita` fueron revisados visualmente en viewport de escritorio 1280 × 720; las rutas cargaron y conservaron sus controles. Segundo, la regresión completa confirmó expiración, reconexión, sincronización del QR con `MjpTvManifest`, QR circular, descargas y paletas: 83 archivos PASS, 262 pruebas PASS y 4 omitidas; `pnpm check` y `pnpm build` también PASS. Tercero, se revisó la evidencia visual del QR circular y del historial de paletas con restauración auditable.

El resultado es **PROBADO** en código y navegador. No se declara **VALIDADO físicamente** porque el entorno no dispone de cámaras reales en iOS, Android TV, Samsung Tizen o LG webOS. Esa certificación requiere ejecución manual con hardware, distancia e iluminación registradas.

## Anexo — Ejecución de QA multidispositivo y autonomía 24h

Se ejecutó QA responsive reproducible en navegador para `/tv`, `/generador-qr` y `/qr-circular-lukita` con viewport móvil de 390 × 844 píxeles. Las tres rutas cargaron y mostraron sus controles principales. Esta ejecución verifica presentación responsive, no lectura física del QR.

También se ejecutó `pnpm simulate:autonomy24`. El informe quedó en `reports/autonomy-24h-simulation.json` con ventana de 24 horas, 1.440 ticks, 2.880 intentos, 1.440 claims únicos, 1.440 intentos duplicados detectados, tasa de duplicación de 0,5, claves estables y `passed: true`. La duplicación es intencional para probar idempotencia: el resultado no representa 1.440 eventos productivos duplicados.

La simulación es determinista y no ejecuta cron, base de datos real, carga de red ni recuperación de infraestructura. Por ello, demuestra el contrato lógico de claims estables, pero no certifica disponibilidad 24/7 ni hardware físico. La certificación de cámaras reales en iOS, Android TV, Samsung Tizen y LG webOS permanece pendiente.

## Anexo — Tercera ejecución solicitada de las tres tareas

Se repitió el QA responsive en `/tv`, `/generador-qr` y `/qr-circular-lukita` con viewport de 390 × 844 píxeles. Las tres rutas cargaron, conservaron la navegación y mostraron los controles de TV y QR. La evidencia corresponde a navegador responsive; no es una certificación de escaneo físico.

Se repitió `pnpm simulate:autonomy24` con resultado `passed: true`: ventana de 24 horas, 1.440 ticks, 2.880 intentos, 1.440 claims únicos, 1.440 duplicados detectados de forma intencional y `stableClaimKeys: true`. La duplicación representa reintentos controlados para verificar idempotencia, no eventos productivos duplicados.

Se volvió a comprobar en código la persistencia del historial de paletas, la acción de restauración/rollback y el registro idempotente en Event Store. MJP CORE, MjpTvManifest, resultados, RNG, RTP y liquidación no fueron modificados. La certificación física de cámaras y televisores continúa pendiente.

## Anexo — Ejecución de la prueba P0 de aislamiento de MJP CORE

El 27 de agosto de 2026 se implementó y ejecutó la batería automatizada `shared/mjpCoreIsolation.test.ts`. La prueba demuestra técnicamente que todos los agentes registrados operan bajo una restricción de mutación sobre el núcleo protegido.

### Resultados de la batería P0
- **Límite de autoridad:** Se confirmó que `AGENT_AUTHORITY_BOUNDARY` incluye MJP_CORE, RNG, RTP, WALLET, LEDGER, SETTLEMENT, RULES y MjpTvManifest.
- **Rechazo de mutación:** Cada uno de los 15 agentes registrados fue verificado; ninguno posee permisos de escritura sobre el núcleo.
- **Resiliencia de metadatos:** Se probó que incluso si un agente intentara alterar sus propios metadatos de autoridad, el sistema de permisos centralizado rechaza la mutación.
- **Integridad del manifest:** Se validó que las funciones de orquestación y proyección consumen el manifest de forma inmutable, sin alterar su contenido original.
- **Política NO DATA:** Se verificó que la ausencia de datos en el núcleo no se convierte en afirmaciones operativas inventadas, devolviendo correctamente `NO DATA`.

La regresión completa finalizó con **84 archivos aprobados, 267 pruebas aprobadas y 4 omitidas**. El aislamiento P0 queda clasificado como **PROBADO y VALIDADO LOCALMENTE** en sandbox.

## Anexo — Resultado final de la batería P0 ampliada

La batería `shared/mjpCoreIsolation.test.ts` quedó ampliada a **7 pruebas aprobadas**. Además de revisar el límite común y los 15 agentes registrados, verifica los límites negativos de Commercial OS y Character OS, la inmutabilidad del manifest durante la proyección y la política `NO DATA`.

La regresión completa finalizó con **84 archivos PASS, 269 pruebas PASS y 4 omitidas**. `pnpm check` y `pnpm build` finalizaron correctamente. La advertencia no bloqueante del build corresponde a un chunk del visor 3D superior a 500 kB.

La evidencia permite declarar el aislamiento **PROBADO y VALIDADO LOCALMENTE**. No constituye todavía una prueba de seguridad adversarial externa, una revisión de permisos en infraestructura desplegada ni una certificación regulatoria. Para cerrar el P0 operacional faltan pruebas negativas sobre dos procesos reales, base de datos compartida, despliegue, secretos y revisión independiente.

## Anexo — Pruebas sandbox de concurrencia, Kill Switch e inyección auto-adversarial

Se implementaron y ejecutaron `server/scheduler/concurrencyIsolation.test.ts` y `shared/sandboxAgentSecurity.test.ts`. La batería focalizada obtuvo **15/15 PASS**: tres pruebas de concurrencia/idempotencia, siete pruebas P0 de aislamiento y cinco pruebas auto-adversariales de Kill Switch, contingencia, fallback, propuestas no autoritativas y distribución bloqueada.

La regresión completa finalizó con **86 archivos PASS, 277 pruebas PASS y 4 omitidas**. `pnpm check` y `pnpm build` finalizaron correctamente. El build mantiene una advertencia no bloqueante por un chunk del visor 3D superior a 500 kB.

La ejecución E2E del navegador TV/overlay fue intentada con `RUN_BROWSER_E2E=1`. La matriz de concurrencia y los contratos de seguridad pasaron. El E2E TV/overlay no queda cerrado: persisten fallos de estabilidad por la pantalla de selección de modo, el selector de tema tras recarga y el rate limit global que devuelve 429 a `broadcast.rounds`. Estos fallos se clasifican como limitación del arnés/entorno y trabajo pendiente de estabilización, no como evidencia de aislamiento roto.

La prueba de dos procesos actual sigue siendo un harness local sobre un store compartido en memoria; demuestra la carrera y la unicidad contractual, pero no sustituye dos procesos desplegados contra MySQL/TiDB real. La auditoría auto-adversarial tampoco sustituye un pentest o revisión independiente. No se tocaron MJP CORE, MjpTvManifest, RNG, RTP, resultados, wallet, ledger ni liquidación.

## Anexo — Ejecución ampliada de tareas sandbox

Se ejecutaron todas las pruebas técnicas viables sin hardware ni credenciales externas. La batería focalizada obtuvo **18/18 PASS** en cuatro archivos: concurrencia de dos instancias con store compartido, aislamiento P0, auditoría auto-adversarial y flujo dorado TV → QR → celular.

El nuevo `shared/tvQrGoldenFlow.test.ts` verifica la identidad autoritativa de `MjpTvManifest`, QR disponible y firmado en estado OPEN, modo exclusivamente `VIRTUAL_CREDITS`, transición a resultado verificado, expiración del QR, bloqueo por Kill Switch, contingencia y política `NO DATA` para el siguiente evento.

Se añadió un bypass de rate limit exclusivamente para solicitudes con `x-milukita-e2e: 1` cuando `NODE_ENV` no es `production`. No se habilita en producción. El E2E navegador estabilizó 3 de 4 casos; el caso de exportación del overlay sigue bloqueado porque `broadcast.rounds` responde HTTP 500 al requerir sesión/base de datos en el entorno disponible. No se convirtió ese fallo en PASS ni se introdujo un bypass de autenticación.

La regresión completa finalizó con **87 archivos PASS, 280 pruebas PASS y 4 omitidas**. `pnpm check` y `pnpm build` finalizaron correctamente. El build conserva una advertencia no bloqueante por un chunk del visor 3D superior a 500 kB.

La prueba dual continúa siendo un harness local en memoria, no dos procesos contra MySQL/TiDB real. La auditoría auto-adversarial es una revisión automatizada interna, no un pentest independiente. Las pruebas físicas, autenticación real, infraestructura persistente y revisión externa permanecen fuera del sandbox.


## Anexo — Registro histórico de contratos y controles LRCI

> **Corrección constitucional posterior:** este anexo conserva evidencia histórica de una especificación restrictiva y de workflows administrativos. No debe interpretarse como implementación del Legal & Compliance Intelligence Agent. La definición vigente es `PLANNED / NOT_STARTED / DISABLED / AUTONOMY 0`; el contrato canónico está en `docs/LEGAL_COMPLIANCE_INTELLIGENCE_AGENT.md`.

El registro histórico describió un contrato técnico deshabilitado de LRCI. Para evitar ambigüedad, la definición vigente se trasladó a `shared/legalComplianceAgent.ts` y conserva `PLANNED`, `NOT_STARTED`, `DISABLED`, autonomía `0`, autoridad `ADVISORY_ONLY`, revisión humana obligatoria, integraciones externas `NONE` y acceso a MJP CORE `NONE`. No existe un agente jurídico operativo.

Los estados auditables y sus reglas se conservan como especificación futura y controles documentales. No existe motor jurídico activo que clasifique fuentes regulatorias o produzca decisiones; cualquier workflow administrativo existente pertenece a Human Authority y no confiere autoridad al Legal Agent. Ningún estado permite emitir una opinión jurídica vinculante, presentar un documento, firmar un contrato, declarar cumplimiento definitivo o modificar MJP CORE.

Las métricas iniciales permanecen en `ZERO_BY_DESIGN` o `NO_DATA`; no se inventaron porcentajes de cobertura legal. El `Legal Claim Guard`, Jurisdiction Engine, AML/KYC/CDD, fuentes regulatorias y contratos reales siguen reservados y deshabilitados.

La evidencia histórica de esa fase no cambia el estado vigente. La incorporación actual debe clasificarse como **contrato constitucional y registro implementados; agente jurídico, motor regulatorio e integraciones operativas NO IMPLEMENTADOS / DISABLED**.


## Anexo — Registro persistente de casos de revisión humana LRCI

Se añadió la tabla `lrci_review_cases` en `drizzle/schema.ts` y se aplicó la migración `drizzle/0031_slippery_karnak.sql`. Cada caso conserva título, dominio, estado auditable, alcance, jurisdicción, vencimiento, responsable identificado, fuente, resumen de evidencia, comentario del revisor, fecha de revisión, creador y timestamps. La tabla incluye índices por estado/vencimiento y jurisdicción/actualización.

El backend `server/lrciReviewCases.ts` implementa listado filtrable, creación y actualización administrativa. Toda creación comienza como `REQUIRES_PROFESSIONAL_REVIEW`; la aprobación humana o rechazo se registra con comentario opcional y genera un evento operacional en `human_authority`. Los procedimientos tRPC `operations.lrciCases`, `operations.createLrciCase` y `operations.updateLrciCase` están protegidos por `adminProcedure`.

La interfaz `client/src/components/LrciReviewCasesPanel.tsx`, integrada en el Control Room, permite registrar y filtrar casos, ver alcance, jurisdicción, vencimiento y responsable, actualizar el estado y dejar comentarios. Una aprobación queda expresamente limitada al alcance, jurisdicción y fecha del caso; no habilita publicación automática, claims jurídicos, firma, ejecución ni acceso a MJP CORE.

La vista de `/control-room` fue comprobada visualmente; sin sesión administrativa muestra correctamente el bloqueo de acceso. La prueba con el panel interno autenticado requiere sesión de operador, por lo que no se declara validación visual autenticada desde el sandbox.

## 37. Orden Maestra Identity, Participation & Free/Premium — ejecución técnica

Se ejecutó una primera fase técnica de la orden maestra. Se creó `docs/MILUKITA_IDENTITY_ARCHITECTURE.md` y `docs/MILUKITA_IDENTITY_PARTICIPATION_IMPLEMENTATION.md`, junto con `shared/identityParticipation.ts` y `server/identityParticipation.ts`.

Se añadieron las entidades `milukita_identities`, `milukita_devices`, `milukita_sessions`, `milukita_event_contexts`, `milukita_participation_sessions` y `milukita_consents`. La migración fue aplicada de manera no destructiva; las claves foráneas e índices se verificaron con nombres compatibles con MySQL.

La API protegida incluye resumen de identidad, registro y revocación de dispositivos, creación de ParticipationSession, evaluación server-side de elegibilidad, transiciones estrictas, consulta de contexto QR y creación administrativa de contexto. El evento de funnel reutiliza `product_analytics_events` y la trazabilidad reutiliza `operational_events`.

Se integró un panel `IdentityParticipationPanel` en `/control-room`. La captura sin sesión confirma que el Control Room conserva su bloqueo de acceso. La capa Premium sigue `DISABLED`; la capa regulada, pagos, dinero real, KYC real y OTP externo permanecen bloqueados o no conectados.

Evidencia: `pnpm check` PASS; 12 pruebas focalizadas de identidad/aislamiento PASS; `pnpm build` PASS. El modelo quedó implementado como base Free y preparación controlada, no como autorización para monetización ni como certificación legal, regulatoria, de seguridad o de disponibilidad.
