# MiLukita — Expediente Único de Auditoría Total

**Proyecto:** `ruleta-peru-online`  
**Marca:** MiLukita  
**Anfitriona:** Lukita, personaje virtual no autoritativo  
**Fecha de corte:** 26 de agosto de 2026  
**Último checkpoint técnico:** `manus-webdev://fddeaa18`  
**Estado de operación:** piloto gratuito, créditos exclusivamente virtuales, sin dinero real, retiros ni convertibilidad  
**Autor del expediente:** Manus AI

> Este documento distingue entre existencia en código, pruebas automatizadas, evidencia visual y validación operativa. Una función documentada no se considera automáticamente implementada. Una prueba local tampoco equivale a certificación independiente, homologación regulatoria, QA físico o disponibilidad multiinstancia.

---

## 1. Objetivo y alcance de la auditoría

Este expediente consolida en un solo archivo el estado situacional del sistema MiLukita: arquitectura, catálogo de juegos, TV, QR, WebSocket, PWA, usuarios, créditos, reglas, RTP, recompensas, Boss Fight, avatar Lukita, autonomía, seguridad, documentación, pruebas, riesgos, pendientes y ruta de avance.

La auditoría se realiza sobre el código y la documentación existentes en el repositorio. El objetivo no es declarar el producto listo para monetización ni para operación regulada, sino establecer con precisión qué existe, qué ha sido probado, qué ha sido validado solamente en entorno local, qué permanece en preproducción y qué debe completarse antes de cualquier lanzamiento público.

### 1.1 Criterios de clasificación

| Clasificación | Significado |
|---|---|
| **IMPLEMENTADO** | Existe código funcional integrado en el proyecto. |
| **PROBADO** | Cuenta con pruebas automatizadas o una ejecución reproducible. |
| **VALIDADO LOCALMENTE** | Se ejecutó en el sandbox/staging local con evidencia de resultado. |
| **PARCIAL** | Existe una base funcional, pero falta una parte esencial del alcance. |
| **PENDIENTE** | No existe una implementación suficiente o no se ha demostrado. |
| **BLOQUEADO** | Está deliberadamente excluido por decisión de producto, seguridad o regulación. |
| **NO VERIFICABLE** | Existe una referencia, pero no hay evidencia suficiente para afirmar funcionamiento. |

---

## 2. Resumen ejecutivo

MiLukita ya no es únicamente un catálogo de juegos. El repositorio contiene una plataforma virtual con autenticación, billetera de créditos, reglas versionadas, rondas, resultados verificables, auditoría, simuladores, interfaz TV, QR circular, overlay, WebSocket para jugadores concurrentes, lobby móvil, persistencia inicial de sesiones de TV en línea y un motor server-side de Boss Fight.

El catálogo de juegos de sorteo y participación virtual está ampliamente desarrollado. También se implementó una línea separada de **TV en línea** con diez contratos de juegos interactivos, incluidos los siete juegos originales del documento y tres modalidades adicionales: Semáforo MiLukita, Encuentra el Intruso y Código Cooperativo.

La plataforma tiene una arquitectura técnicamente coherente para continuar, pero **no debe describirse todavía como una operación pública completa, multiinstancia, certificada o regulada**. Las principales brechas son la coordinación distribuida de acciones, la certificación física en dispositivos reales, la integración completa de las sesiones de TV en línea con el ciclo autoritativo de rondas, la observabilidad de producción, la prueba sostenida más allá del sandbox y la certificación independiente del RNG y de los juegos.

| Área | Estado global |
|---|---|
| Núcleo de juegos virtuales | **Implementado y probado** |
| Reglas, RTP y resultados verificables | **Implementado; requiere revisión independiente antes de monetización** |
| Créditos virtuales | **Implementado** |
| Dinero real, pagos y retiros | **No activados / bloqueados** |
| TV, overlay y QR | **Implementado como plataforma genérica** |
| TV en línea interactiva | **Implementado en primera versión, con integración avanzada reciente** |
| WebSocket y lobby | **Implementado y probado hasta 100 jugadores localmente** |
| Persistencia de sesiones TV en línea | **Implementada como primera capa; falta locking distribuido** |
| Boss Fight | **Motor y panel interno implementados; experiencia pública pendiente** |
| Lukita 3D | **Herramienta de revisión/preproducción; no producción final** |
| Autonomía 24/7 | **Simulada; operación real continua pendiente** |
| QA físico multidispositivo | **Pendiente** |
| Certificación legal, RNG y homologación | **Pendiente** |

---

## 3. Decisiones y límites no negociables

El piloto utiliza créditos virtuales. Aunque en etapas anteriores se utilizó una referencia contable interna para facilitar cálculos, la documentación actual debe mantener explícito que esos créditos no son dinero, no son cobrables, no son convertibles a soles y no generan derecho económico real.

Lukita es una anfitriona y companion visual. No controla resultados, RNG, reglas, premios, wallet, liquidación, cierres ni permisos. El cliente tampoco tiene autoridad sobre esas funciones.

El flujo obligatorio para discrepancias visuales o técnicas es:

> **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**

El acceso a dinero real, Yape, retiros, convertibilidad, compra automática, mercados de predicción abiertos y monetización se mantiene fuera del piloto. La capa futura de pagos existe únicamente como preparación técnica desactivada.

---

## 4. Arquitectura técnica actual

### 4.1 Componentes principales

| Capa | Componentes y rutas relevantes | Estado |
|---|---|---|
| Frontend | React 19, Vite, Tailwind, shadcn/ui, Wouter | Implementado |
| API | Express, tRPC 11, procedimientos protegidos y públicos | Implementado |
| Persistencia | Drizzle ORM, MySQL/TiDB, migraciones | Implementado |
| Autenticación | Manus OAuth, perfiles, roles `user/admin` | Implementado |
| Realtime | `ws`, `/realtime`, `PlayerSessionManager` | Implementado |
| Contratos compartidos | `shared/realtime.ts`, `shared/tvManifest.ts`, `shared/onlineTvGames.ts` | Implementado |
| TV | `/tv`, manifest, QR circular, contingencia, carrusel | Implementado |
| Overlay | `/overlay/:roundId`, estadísticas y exportación | Implementado/parcial según función |
| Créditos | Wallet virtual, movimientos, premios y ledger | Implementado |
| Auditoría | Eventos, informes, hashes, logs y documentos | Implementado |
| Juegos TV en línea | `/tv-en-linea`, router y servicio server-side | Implementado en primera versión |
| 3D Lukita | `/lukita-3d`, preview/review y mock local | Preproducción |

### 4.2 Flujo autoritativo

1. El servidor crea o recupera la sesión o ronda.
2. El servidor determina fase, objetivo, tiempo, dificultad y resultado.
3. La TV recibe el estado público y presenta el evento.
4. El celular envía una acción o respuesta.
5. El servidor valida identidad, fase, tiempo, objetivo, límites e idempotencia.
6. El servidor calcula puntos, progreso y cierre.
7. El cliente recibe el resultado y solo lo representa.
8. Las recompensas, cuando corresponda, se registran en el ledger virtual.

La defensa principal del diseño es que el navegador no puede fijar por sí mismo la respuesta correcta, el puntaje, la salud del Boss, la posición del objetivo, el premio ni el saldo.

### 4.3 Riesgo de arquitectura distribuida

La memoria local sigue siendo una caché de baja latencia. La base de datos ya puede recibir sesiones de TV en línea y el router puede recuperar una sesión ausente de memoria. Sin embargo, una operación multiinstancia necesita resolver concurrencia entre dos instancias que actualicen la misma sesión simultáneamente.

Antes de producción se requiere una de estas soluciones: bloqueo transaccional en base de datos, versionado optimista con rechazo de conflictos, un almacén realtime compartido o una arquitectura de instancia persistente única con límites documentados. Sin esto, dos acciones simultáneas podrían competir por el mismo estado.

---

## 5. Catálogo de juegos

### 5.1 Catálogo de TV en vivo según la clasificación oficial del proyecto

En este expediente, **TV en vivo** identifica el catálogo de modalidades de ruleta, lotería, bingo, Jackpot, cartas y juegos numéricos, que puede ser presentado por la emisión TV y conectado mediante QR al dispositivo del usuario.

| Familia | Modalidades |
|---|---|
| Ruleta | Ruleta piloto, Ruleta 7, Ruleta 17, Ruleta 27, Ruleta 37 |
| Lotería | Lotería 19, 29, 39, variante 39 · 5/39, 49 y 59 |
| Bingo | Bingo piloto, Bingo Flash, Bingo Keno, Bingo 75/Americano |
| Jackpot | Jackpot con participación y pozo virtual |
| Cartas | Trío 13 |
| Números | Pick 3, Pick 4, Loto Diario y Loto Express |
| Instantáneo | Raspa Digital |
| Premium virtual | Sueldo de por vida |

**Estado:** implementado en reglas, páginas, simuladores y flujos virtuales según modalidad. La emisión `/tv` es un contenedor genérico; no significa que cada modalidad tenga todavía una producción televisiva independiente con guion específico.

### 5.2 Catálogo de TV en línea

La línea de **TV en línea** corresponde a los juegos interactivos de habilidad y cooperación definidos en el documento del propietario.

| ID técnico | Nombre | Tipo | Estado |
|---|---|---|---|
| `REFLEX` | Toca en el Momento Exacto | Individual | Implementado |
| `PRECISION` | Apunta y Dispara | Individual | Implementado |
| `TRIVIA` | Preguntas y Respuestas | Individual | Implementado |
| `COMBINATION` | Adivina la Combinación | Individual | Implementado |
| `MEMORY` | Memoriza la Secuencia | Individual | Implementado |
| `TEAM_CLOCK` | Todos Contra el Reloj | Cooperativo | Implementado |
| `TEAM_SCORE` | Construyan el Puntaje Más Alto | Cooperativo | Implementado |
| `TRAFFIC_LIGHT` | Semáforo MiLukita | Individual | Implementado |
| `ODD_ONE_OUT` | Encuentra el Intruso | Individual | Implementado |
| `COOP_CODE` | Código Cooperativo | Cooperativo | Implementado |

**Ruta principal:** `/tv-en-linea`.  
**Servicio:** `server/onlineTvGames.ts`.  
**Router:** `server/routers/onlineTvGames.ts`.  
**Contrato:** `shared/onlineTvGames.ts`.  
**Página:** `client/src/pages/OnlineTvGamesPage.tsx`.

### 5.3 Estado real de “todos los juegos”

No debe afirmarse que todos los juegos descritos históricamente están terminados en el mismo nivel. El catálogo de TV en vivo está mucho más maduro. La línea TV en línea ya tiene una primera experiencia jugable y validación server-side, pero necesita endurecimiento operativo, contenidos versionados más amplios, integración distribuida y QA físico.

El Boss Fight no debe contarse como juego público terminado: existe el motor, el router protegido y el panel interno, pero no la experiencia pública completa integrada en TV, celular, overlay y ciclo de producción.

---

## 6. Reglas, RNG, RTP y créditos

### 6.1 Reglas y resultados

Las reglas de los juegos de sorteo están versionadas y existen simuladores, pruebas de liquidación y página de verificación pública. Los resultados se diseñan para ser verificables mediante hash, semilla revelada, algoritmo y reglas aplicadas.

### 6.2 RNG

El proyecto utiliza generación pseudoaleatoria basada en software para las mecánicas de juego y simulación. Esto puede ser técnicamente apropiado para un piloto virtual, pero **no equivale a certificación**. Antes de una operación regulada se requiere revisión independiente del RNG, análisis estadístico, revisión de semillas, controles de integridad y certificación del sistema completo.

### 6.3 RTP y probabilidades

El proyecto contiene calculadoras, simulaciones y tableros de RTP teórico/observado. Los valores deben presentarse siempre con su modalidad, versión de reglas, tamaño de muestra y fecha de cálculo. No se debe convertir una muestra simulada en una promesa individual de ganar.

La simulación Boss de 1.000 partidas produjo una tasa observada configurable; el análisis de sensibilidad produjo escenarios aproximados de EASY 94,40 %, STANDARD 85,30 %, HARD 76,40 % y EXPERT 60,30 %. Estas cifras son resultados de modelos de prueba y no deben interpretarse como garantía de victoria, RTP de un juego de azar ni promesa comercial.

### 6.4 Créditos

| Función | Estado |
|---|---|
| Saldo virtual | Implementado |
| Bonificación inicial | Implementado |
| Recompensa diaria | Implementado |
| Premios virtuales | Implementado |
| Historial de movimientos | Implementado |
| Ledger de torneos/logros | Implementado como capa virtual persistente |
| Dinero real | Bloqueado |
| Retiro | Bloqueado |
| Conversión a soles | Bloqueada |
| Yape operativo | No activado |

---

## 7. TV, MjpTvManifest, QR y celular

### 7.1 TV genérica

`/tv` presenta una experiencia en dos zonas: contenido principal con carrusel o video y panel lateral persistente con QR circular, estado, validez y temporizador. La TV puede mostrar contingencia si el video o la conexión fallan.

### 7.2 QR circular MiLukita

Existe `MiLukitaCircularQR` con tres variantes visuales: **L Central**, **L en Círculo** y **L Integrada**. Las variantes preservan el payload autoritativo y existe fallback visual al QR estándar. El panel de pruebas se activa con `?tvTest=1` o `Alt+Shift+Q`.

La evidencia existente corresponde principalmente a código, pruebas automatizadas y revisión de interfaz. La certificación física de escaneo en Safari iOS, Android TV y condiciones reales sigue pendiente.

### 7.3 Manifest

`shared/tvManifest.ts` define el contrato `MjpTvManifest`. Para TV en línea se añadió una proyección `onlineTv` con:

| Campo | Propósito |
|---|---|
| `sessionId` | Identifica la sesión interactiva |
| `gameId` | Identifica la modalidad |
| `difficulty` | EASY, STANDARD o HARD |
| `contentVersion` | Versión del banco de contenido |
| `cooperative` | Indica si la sesión es colectiva |
| `progress` | Progreso cooperativo |
| `threshold` | Umbral de cierre colectivo |
| `participantCount` | Participantes de la sesión |

La función `buildOnlineTvManifest` mantiene la fuente declarada como `MJP_CORE` y la autoridad en servidor. El router `onlineTvGames.manifest` expone la proyección de la sesión.

### 7.4 Flujo TV→celular

1. La TV muestra el evento y el QR.
2. El usuario escanea o abre la URL manual.
3. El celular abre `/tv-en-linea` o el destino correspondiente.
4. El servidor identifica o crea la sesión.
5. El cliente realtime ejecuta `JOIN`, heartbeat y reconexión.
6. La TV y el celular reciben el estado correspondiente.
7. La acción se valida en servidor.
8. La TV presenta la evolución y el celular muestra confirmación.

La integración avanzada actual conecta la página TV en línea al hook `useRealtimePlayer` mediante el identificador de sesión. El flujo todavía debe endurecerse con tokens de sesión específicos de juego, autorización de participante y eventos realtime de dominio en lugar de depender únicamente del lobby genérico.

---

## 8. WebSocket y jugadores concurrentes

### 8.1 Implementación

| Elemento | Archivo |
|---|---|
| Contratos | `shared/realtime.ts` |
| Gestor de sesiones | `server/realtime/playerSessionManager.ts` |
| Adaptador WebSocket | `server/realtime/websocketServer.ts` |
| Hook cliente | `client/src/hooks/useRealtimePlayer.ts` |
| Lobby móvil | `client/src/components/RealtimePlayerLobby.tsx` |
| Documentación | `docs/REALTIME.md` |

La capacidad lógica configurada es de 100 jugadores por sala. Se implementaron join, heartbeat, reconexión, leave, timeout, estados de conexión e idempotencia por `requestId`.

### 8.2 Evidencia de carga

Se ejecutaron pruebas WebSocket locales con 100 clientes, 100 JOIN, 100 reconexiones y cero errores. La prueba sostenida de 15 minutos produjo:

| Operación | p50 | p95 | p99 |
|---|---:|---:|---:|
| JOIN | 50,976 ms | 253,527 ms | 279,296 ms |
| Reconexión | 64,587 ms | 284,838 ms | 314,015 ms |

La evidencia es válida para staging local sobre WebSocket. No certifica una red pública, varias instancias, balanceador, base de datos bajo carga, navegador físico o operación 24/7.

---

## 9. Boss Fight

### 9.1 Implementado

| Componente | Estado |
|---|---|
| Contrato compartido | Implementado en `shared/bossFight.ts` |
| Motor server-side | Implementado en `server/games/bossFightEngine.ts` |
| Movimiento determinista | Implementado |
| Patrones SWEEP, PULSE y ORBIT | Implementados |
| Detección de hit por distancia | Implementada |
| Validación de fase y alcance | Implementada |
| Idempotencia por request | Implementada |
| Router protegido | Implementado en `server/routers/bossFight.ts` |
| Panel operador | Implementado en `client/src/components/BossFightTestPanel.tsx` |
| Experiencia pública TV/celular | Pendiente |
| Integración con wallet/ledger | No debe activarse sin diseño aprobado |
| Integración con `/tv` | Pendiente y bloqueada hasta QA |

### 9.2 Riesgos pendientes

El Boss Fight todavía necesita un contrato de ronda pública, control de participantes, snapshots realtime de combate, reglas de cierre, pruebas de reconexión durante impacto, protección contra replay, métricas de latencia y una interfaz visual específica. No debe confundirse el panel interno con el producto final.

---

## 10. Ledger de recompensas virtuales

Existe un ledger persistente para `TOURNAMENT_PRIZE` y `COOPERATIVE_ACHIEVEMENT`, con `idempotencyKey`, metadata y movimientos asociados al wallet virtual. Se añadió la tabla `virtual_reward_ledger` y el servicio persistente `server/rewards/persistentRewardLedger.ts`.

También existe la base de persistencia para sesiones de TV en línea en `online_tv_sessions` y para contenido versionado en `online_tv_content_items`, aplicada mediante migración Drizzle `0028_peaceful_gargoyle.sql`.

| Requisito | Estado |
|---|---|
| Premio virtual idempotente | Implementado |
| Registro de movimiento wallet | Implementado |
| Consulta de historial | Implementado |
| Torneo completo | Parcial |
| Clasificación de torneo | Pendiente |
| Cierre y adjudicación de torneo | Pendiente |
| Reconciliación ledger-wallet | Pendiente |
| Locking distribuido | Pendiente |
| Dinero real | Bloqueado |

---

## 11. Lukita y avatar 3D

Lukita está definida como anfitriona virtual humana adulta, peruana contemporánea, cercana, elegante, profesional y no autoritativa. La ficha maestra 2D continúa siendo la referencia de identidad.

`/lukita-3d` es una herramienta de **Preview / Review**. Incluye mock 3D local, carga de modelos GLB/GLTF por URL HTTPS, cámara, zoom, rotación, iluminación, wireframe, comparación 2D/3D, anotaciones, exportación, checklist Identity Lock, historial y estados de comentarios.

El estado correcto del candidato sigue siendo de preproducción. La autorización técnica del blockout no equivale a aprobación estética final.

| Actividad 3D | Estado |
|---|---|
| Blockout técnico | Aprobado técnicamente como base de preproducción |
| Refinamiento visual | Autorizado de forma controlada |
| Identity Lock final | Pendiente de aprobación humana |
| Modelado detallado | Bloqueado/no iniciado como producción definitiva |
| Rigging definitivo | Bloqueado |
| Animación final | Bloqueada |
| Voz, TTS y lip-sync | Bloqueados |
| Integración pública | Bloqueada |
| Uso en `/tv` | No autorizado |

---

## 12. PWA, móvil y dispositivos

La aplicación incluye experiencia responsive, manifest/PWA, instalación sugerida, modo oscuro, guía táctil, pantalla de pérdida de conexión y preferencias de interfaz. Se realizaron revisiones visuales en viewport de escritorio y móvil.

La evidencia disponible no equivale a certificación de cada dispositivo. El estado por plataforma es:

| Plataforma | Estado |
|---|---|
| Navegador de escritorio | Probado localmente |
| Celular responsive | Probado visualmente en viewport |
| Tablet responsive | Parcialmente cubierto por diseño responsive |
| Safari iOS físico | Pendiente de certificación |
| Android TV físico | Pendiente de certificación |
| Google TV físico | Pendiente de certificación |
| Smart TV fabricante específico | No verificable sin equipo real |

La descarga de imágenes tiene fallback de compatibilidad para navegadores sin soporte completo de `download`, pero todavía se debe ejecutar la matriz física de pruebas solicitada.

---

## 13. Autonomía, workers y control humano

Existe un worker supervisado con claims idempotentes, eventos operativos, respeto del estado STOPPED y simulación determinista de 24 horas. La simulación alcanzó 1.440 claims únicos en el expediente anterior.

Esto demuestra el comportamiento lógico de una simulación, no la disponibilidad real de 24 horas. Para afirmar autonomía operativa faltan proceso persistente, supervisión real, alertas externas, recuperación tras reinicio, métricas, almacenamiento compartido, runbook y prueba prolongada de infraestructura.

| Control | Estado |
|---|---|
| Worker supervisado | Implementado |
| Claims idempotentes | Implementado |
| Simulación 24 h | Probada |
| Kill Switch lógico | Implementado/documentado |
| Kill Switch operativo externo | Pendiente de certificación |
| Reinicio y recuperación real | Pendiente |
| Monitorización 24/7 | Parcial |
| Autonomía productiva | Pendiente |

---

## 14. Seguridad, acceso y responsabilidad

Se implementaron autenticación, roles, límites de solicitudes, cabeceras de seguridad, controles de acceso, límites de sesión, pausa voluntaria y preparación neutral de KYC/AML.

KYC/AML está preparado como arquitectura de estados y auditoría, pero no hay proveedor activo ni captura operativa de documentos. No debe presentarse como cumplimiento regulatorio completo.

El piloto incluye controles de juego responsable y mensajes de créditos virtuales. Antes de una operación real se requerirían revisión legal, política de privacidad final, control de edad, geolocalización válida, KYC/AML real, retención documental, monitoreo antifraude, procedimientos de reclamos y homologación.

---

## 15. Pruebas y evidencia acumulada

### 15.1 Última validación registrada

| Validación | Resultado |
|---|---|
| `pnpm check` | Aprobado |
| Suite Vitest | 53 archivos aprobados, 1 omitido |
| Pruebas | 172 aprobadas, 4 omitidas |
| `pnpm build` | Aprobado |
| WebSocket 100 clientes | 100 JOIN, 100 reconexiones, 0 errores |
| WebSocket sostenido | 15 minutos |
| UI desktop | Revisada en 1280×720 |
| UI móvil | Revisada en 390×844 |
| QA Safari iOS físico | Pendiente |
| QA Android TV físico | Pendiente |
| RNG independiente | Pendiente |
| Certificación regulatoria | Pendiente |

### 15.2 Pruebas que no deben confundirse con certificación

Las pruebas unitarias demuestran que determinadas funciones cumplen casos definidos. Las pruebas de integración verifican la interacción dentro del sandbox. Las capturas demuestran una representación visual en un viewport. Las simulaciones demuestran un modelo bajo parámetros elegidos. Ninguna de las cuatro sustituye auditoría independiente, prueba de penetración, certificación de RNG, homologación, QA físico o ensayo de producción.

---

## 16. Etapas de avance del proyecto

### Etapa 0 — Piloto y núcleo de juegos

**Estado:** completada.  
Incluye créditos virtuales, autenticación, juegos principales, reglas, wallet, resultados, verificación y documentación inicial.

### Etapa 1 — Realtime y jugadores concurrentes

**Estado:** completada técnicamente.  
Se implementaron contratos realtime, sesiones, lobby, heartbeat, reconexión y capacidad lógica de 100 jugadores.

### Etapa 2 — Boss Fight

**Estado:** motor técnico inicial completado; producto público pendiente.  
El estado, movimiento y validación de impactos están bajo autoridad del servidor. Falta experiencia pública y pruebas operativas ampliadas.

### Etapa 3 — Ledger de recompensas

**Estado:** capa virtual persistente inicial completada; torneo completo pendiente.  
Existen premios idempotentes y movimientos asociados, pero faltan clasificación, cierre formal, reconciliación y operaciones de torneo.

### Etapa 4 — Simulación

**Estado:** completada como simulación reproducible.  
Existen simulación de 1.000 partidas y sensibilidad por dificultad. Las tasas observadas no son garantías de victoria.

### Etapa 5 — Juegos TV en línea

**Estado:** primera versión implementada.  
Los diez juegos tienen contratos, motor, router y página. Falta madurez de contenido, locking distribuido, integración de dominio realtime y QA físico.

### Etapa 6 — Operación sostenida

**Estado:** parcialmente preparada.  
Se probó carga sostenida de 15 minutos con 100 clientes. Falta operación de 60 minutos, observabilidad completa, red pública, varias instancias y recuperación.

### Etapa 7 — Validación de producto y cumplimiento

**Estado:** pendiente.  
Incluye usuarios reales del piloto, retención, accesibilidad física, legal, RNG, seguridad, privacidad y eventual homologación si se decidiera cambiar de categoría.

---

## 17. Matriz de funcionalidades

| Funcionalidad | Código | Pruebas | Evidencia local | Estado de entrega |
|---|---:|---:|---:|---|
| Ruleta/lotería/bingo/Jackpot virtual | Sí | Sí | Sí | Implementado |
| RTP y simuladores | Sí | Sí | Sí | Implementado con revisión pendiente |
| Wallet virtual | Sí | Sí | Sí | Implementado |
| QR circular | Sí | Sí | Sí | Implementado; escaneo físico pendiente |
| TV `/tv` | Sí | Sí | Sí | Implementado genéricamente |
| Overlay | Sí | Parcial | Sí | Parcial según exportación/dispositivo |
| WebSocket | Sí | Sí | Sí | Implementado localmente |
| Lobby 100 jugadores | Sí | Sí | Sí | Implementado localmente |
| TV en línea, 7 juegos base | Sí | Sí | Sí | Implementado primera versión |
| Semáforo | Sí | Sí | Sí | Implementado primera versión |
| Intruso | Sí | Sí | Sí | Implementado primera versión |
| Código Cooperativo | Sí | Sí | Sí | Implementado primera versión |
| Dificultad | Sí | Sí | Sí | Implementado |
| Contenido versionado | Sí | Parcial | Sí | Parcial: v1 disponible |
| Sesiones persistentes | Sí | Parcial | Sí | Primera capa; locking pendiente |
| Boss Fight motor | Sí | Sí | Sí | Implementado interno |
| Boss Fight público | No | No | No | Pendiente |
| Torneos completos | No | No | No | Pendiente |
| Rankings completos | Parcial | Parcial | Parcial | Pendiente de consolidación |
| KYC/AML activo | No | No | No | Pendiente/bloqueado sin proveedor |
| Pagos reales | No | No | No | Bloqueado |
| Retiros | No | No | No | Bloqueado |
| 24/7 real | No | Simulación | Simulación | Pendiente |
| Safari iOS físico | No | No | No | Pendiente |
| Android TV físico | No | No | No | Pendiente |
| Certificación RNG | No | No | No | Pendiente |

---

## 18. Riesgos priorizados

| Prioridad | Riesgo | Evidencia | Impacto | Mitigación recomendada |
|---|---|---|---|---|
| P0 | Autoridad duplicada entre cliente y servidor | Debe prevenirse en toda acción interactiva | Resultados manipulables | Mantener validación server-side, pruebas de replay y auditoría |
| P1 | Concurrencia entre instancias | Sesiones usan caché en memoria y persistencia inicial | Estados divergentes | Locking/versionado optimista o almacén realtime compartido |
| P1 | Falta de certificación física | Safari iOS y Android TV no certificados | Flujo QR/exportación puede fallar | Matriz de dispositivos reales y evidencias por versión |
| P1 | Boss Fight no integrado públicamente | Solo motor/router/panel interno | Promesa de producto incompleta | Completar contrato público y QA antes de activar |
| P1 | Simulación interpretada como garantía | Tasas configuradas/observadas | Comunicación engañosa | Publicar muestra, parámetros y límites |
| P1 | Falta de certificación RNG | No existe auditor independiente | Riesgo de confianza/regulación | Certificación independiente antes de monetización |
| P2 | Banco de contenido pequeño | `online-tv-content-v1` es inicial | Repetición y baja variedad | Versionar banco curado y moderado |
| P2 | Observabilidad incompleta | Métricas de carga locales | Difícil diagnosticar producción | Métricas de CPU, memoria, p95/p99 y alertas |
| P2 | Torneos incompletos | Ledger existe, torneo no consolidado | Premios colectivos ambiguos | Definir registro, clasificación, cierre y apelaciones |
| P3 | Navegación y nomenclatura histórica | Proyecto evolucionó desde MJP | Confusión de usuario | Mantener matriz TV en vivo/TV en línea única |

---

## 19. Cronograma recomendado

| Horizonte | Actividades | Criterio de salida |
|---|---|---|
| Semana 1 | Locking distribuido, pruebas de replay, prueba sostenida 30–60 min | Sin divergencias y p95/p99 registrados |
| Semana 2 | QA real en Safari iOS, Android TV, Google TV, tablet y celular | Flujos QR, conexión, salida y exportación verificados |
| Semana 3 | Banco de contenidos v2, moderación y dificultad | Contenido versionado reproducible y aprobado |
| Semana 4 | Boss Fight público interno de QA | Ronda completa TV→celular→resultado sin wallet monetaria |
| Semanas 5–6 | Retención, accesibilidad, errores, soporte y observabilidad | Informe de piloto con métricas de uso y fallos |
| Posterior | Revisión legal, RNG, privacidad, KYC/AML y decisión regulatoria | Decisión formal antes de dinero real |

---

## 20. Próximos pasos obligatorios

1. Resolver coordinación distribuida de sesiones y acciones antes de desplegar múltiples instancias.
2. Crear pruebas de seguridad específicas para replay, doble envío, manipulación de tiempo, cambio de jugador y payloads inválidos.
3. Ejecutar pruebas físicas reales en Safari iOS y Android TV, documentando modelo, sistema operativo, navegador, resolución y resultado.
4. Terminar la integración de los estados de sesión TV en línea con el ciclo de evento y `MjpTvManifest` autoritativo.
5. Ampliar y versionar el banco de contenido de Semáforo, Intruso y Código Cooperativo.
6. Completar un entorno de QA interno para Boss Fight sin integrarlo todavía a producción pública.
7. Crear reconciliación automática entre `virtual_reward_ledger`, `wallet_transactions` y saldo virtual.
8. Preparar auditoría independiente del RNG, reglas, seguridad y trazabilidad antes de evaluar cualquier monetización.
9. Mantener una separación visible entre TV en vivo, TV en línea, piloto virtual y cualquier futura operación regulada.
10. No presentar las simulaciones de victoria, RTP o carga como garantías comerciales.

---

## 21. Conclusión de auditoría

MiLukita cuenta con una base tecnológica amplia y con varias capas que ya están implementadas y probadas: juegos virtuales, créditos, rondas, verificación, TV, QR, realtime, lobby, juegos de TV en línea, persistencia inicial, ledger virtual y motor Boss Fight.

El proyecto está en transición entre **prototipo técnico avanzado** y **producto de preproducción validable**. La siguiente prioridad no debe ser agregar una cantidad ilimitada de juegos, sino cerrar las brechas operativas: coordinación multiinstancia, pruebas de seguridad, QA físico, observabilidad, contenido versionado y validación independiente.

La conclusión responsable es:

> **El sistema tiene arquitectura suficiente para continuar el desarrollo y un catálogo virtual considerablemente implementado. Todavía no está certificado, no está listo para dinero real, no tiene todos los juegos de habilidad en nivel productivo y no debe declararse autónomo 24/7 hasta completar las pruebas de infraestructura y control humano.**

---

## 22. Índice de archivos y evidencias principales

| Área | Archivos |
|---|---|
| TV y broadcast | `client/src/pages/BroadcastPage.tsx`, `server/broadcast.ts`, `shared/tvManifest.ts` |
| QR circular | `shared/circularQr.ts`, componente `MiLukitaCircularQR`, pruebas QR |
| Realtime | `shared/realtime.ts`, `server/realtime/playerSessionManager.ts`, `server/realtime/websocketServer.ts` |
| Lobby móvil | `client/src/hooks/useRealtimePlayer.ts`, `client/src/components/RealtimePlayerLobby.tsx` |
| TV en línea | `shared/onlineTvGames.ts`, `server/onlineTvGames.ts`, `server/routers/onlineTvGames.ts`, `client/src/pages/OnlineTvGamesPage.tsx` |
| Carga WebSocket | `scripts/load-realtime-ws.ts` |
| Boss Fight | `shared/bossFight.ts`, `server/games/bossFightEngine.ts`, `server/routers/bossFight.ts`, `client/src/components/BossFightTestPanel.tsx` |
| Ledger | `server/rewards/rewardLedger.ts`, `server/rewards/persistentRewardLedger.ts`, `server/routers/rewards.ts` |
| Base de datos | `drizzle/schema.ts`, `drizzle/0028_peaceful_gargoyle.sql` |
| Lukita 3D | `client/src/pages/Lukita3DStudioPage.tsx`, documentación de identidad y producción 3D |
| Auditorías previas | `docs/MILUKITA_UX_MASTER_AUDIT.md`, `docs/MILUKITA_15_MINUTE_EXPERIENCE.md`, `docs/MILUKITA_KILL_LUKITA_TEST.md` |
| TV en línea | `docs/ONLINE_TV_GAMES.md`, `docs/TV_LINES_CLASSIFICATION.md` |
| Fase Boss/ledger/simulación | `docs/PHASES_2_4_BOSS_LEDGER_SIMULATION.md` |
| Fase realtime | `docs/PHASE2_REALTIME_BOSS_FIGHT.md`, `docs/REALTIME.md` |
| Registro de tareas | `todo.md` |

---

## 23. Checkpoints principales

| Checkpoint | Contenido |
|---|---|
| `manus-webdev://6a98c969` | Core Realtime y 100 jugadores |
| `manus-webdev://44046c81` | Carga, espera móvil y motor Boss Fight inicial |
| `manus-webdev://2102a952` | WebSocket real, estados y panel protegido Boss Fight |
| `manus-webdev://58012902` | Boss Fight, ledger virtual y simulación 1.000 partidas |
| `manus-webdev://40aeddbf` | Persistencia ledger, sensibilidad y carga WebSocket |
| `manus-webdev://e04b6498` | Siete juegos de TV en línea |
| `manus-webdev://e35ec245` | Semáforo, Intruso y Código Cooperativo |
| `manus-webdev://7cf8a7c2` | Integración avanzada WebSocket, manifest, dificultad y carga |
| `manus-webdev://fddeaa18` | Persistencia TV en línea, carga sostenida 15 min y QA responsive |

---

**Fin del expediente único de auditoría.**


## Anexo de auditoría — locking, replay, dispositivos y certificación

### Estado del endurecimiento realtime

Se añadió la tabla `online_tv_actions` con una clave única de operación y sesión. El endpoint de acciones de TV en línea registra una reserva idempotente, procesa la acción en servidor y finaliza el registro con el resultado aceptado/rechazado. Una segunda solicitud con el mismo `actionId` se rechaza sin volver a sumar puntos. La prueba focalizada `server/onlineTvGames.replay.test.ts` demuestra este comportamiento.

Este mecanismo proporciona deduplicación distribuida de acciones entre instancias cuando comparten la misma base de datos. No constituye todavía un coordinador distribuido completo de estado de sesión: las transiciones de fase y algunos agregados realtime siguen requiriendo una estrategia de locking/consistencia de sesión para despliegues multiinstancia. Por eso el estado se clasifica como **PARCIALMENTE IMPLEMENTADO** para operación multiinstancia.

### QA físico

Se preparó `docs/QA_DEVICE_CERTIFICATION.md`. El entorno actual permitió revisión de escritorio y viewport móvil, pero no dispone de un Safari iOS físico ni de un Android TV físico. En consecuencia, la certificación de escaneo QR, PWA, audio, navegación con control remoto, exportación y reconexión en esos equipos permanece **NO VERIFICABLE** hasta ejecutar la matriz con hardware real.

### Preparación de certificación

Se creó `docs/RNG_LEGAL_CERTIFICATION_DOSSIER.md`. El expediente distingue simulación de certificación y describe el paquete que debe entregar un laboratorio independiente. También incorpora referencias oficiales de MINCETUR y El Peruano. No constituye opinión legal ni homologación; cualquier monetización exige revisión legal peruana, certificación independiente y trámites aplicables.


## Addendum — Optimización Smart TV y control remoto (2026-08-27)

Se implementó una capa de experiencia Smart TV sobre `/tv`. Incluye navegación por flechas, Enter/OK, Volver/Escape e Info mediante `client/src/hooks/useTvRemoteNavigation.ts`, foco visible de alto contraste y botones con dimensiones ampliadas. Se añadió `client/src/components/TVBrandGuide.tsx`, que presenta instrucciones por marca para Samsung Tizen, LG webOS, Google/Android TV, Apple TV/AirPlay y Fire TV, además de un QR de acceso directo a `/tv?mode=online`.

El QR de acceso directo de la guía es distinto del QR de ronda: el primero facilita abrir la experiencia TV; el segundo continúa siendo el QR firmado y autoritativo proyectado por `MjpTvManifest`. El manifest PWA se ajustó con orientación adaptable, categorías TV y un acceso rápido a MiLukita TV, sin declarar instalación universal ni crear aplicaciones nativas.

La validación local terminó con `pnpm check` aprobado, 179 pruebas aprobadas y 4 omitidas, `pnpm build` aprobado y captura visual de `/tv?mode=online` en escritorio. La certificación en hardware real —Samsung Tizen, LG webOS, Android TV/Google TV, Apple TV y Fire TV— permanece pendiente y no debe considerarse validada hasta ejecutar la matriz física correspondiente. El detalle operativo está en `docs/MILUKITA_SMART_TV_GUIDE.md`.
