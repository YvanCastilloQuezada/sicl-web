# Juegos de TV en línea — MiLukita

## Alcance

Esta línea contiene cinco experiencias individuales y dos cooperativas: Toca en el Momento Exacto, Apunta y Dispara, Preguntas y Respuestas, Adivina la Combinación, Memoriza la Secuencia, Todos Contra el Reloj y Construyan el Puntaje Más Alto.

La ruta pública de prueba es `/tv-en-linea`. El catálogo de sorteos, ruletas, bingos, Jackpot, cartas y modalidades numéricas permanece separado en sus rutas existentes y corresponde a la línea de TV en vivo definida por el propietario.

## Autoridad

El navegador solo presenta controles y envía acciones. El servidor crea la sesión, genera el objetivo, valida la respuesta, calcula los puntos y cambia la fase. Las sesiones actuales son de memoria para preproducción y no otorgan créditos ni realizan liquidación.

## Contrato

El contrato compartido está en `shared/onlineTvGames.ts`; el servicio está en `server/onlineTvGames.ts`; el router protegido está en `server/routers/onlineTvGames.ts`; y la interfaz está en `client/src/pages/OnlineTvGamesPage.tsx`.

## Estados y límites

Las fases son `WAITING`, `ACTIVE`, `RESULT` y `FINISHED`. Los modos cooperativos acumulan progreso hasta un umbral. El prototipo usa 100 puntos de umbral y permite hasta 100 participantes como límite de contrato. La visualización realtime completa de participantes y el enlace formal a un evento MjpTvManifest quedan como trabajo posterior.

## Validación

`pnpm check`, `pnpm test -- --run` y `pnpm build` fueron ejecutados después de la integración. La captura visual de `/tv-en-linea` confirmó el selector y el panel de juego; el tutorial inicial existente puede aparecer sobre la primera visita.

## Pendientes antes de producción

Se requiere persistencia de sesiones o un coordinador compartido para multiinstancia, integración completa con MjpTvManifest, pruebas de carga sostenida, controles antifraude, revisión de accesibilidad y una revisión humana de las reglas de puntuación. No debe presentarse ninguna tasa de victoria como garantía para usuarios.

## Nuevas modalidades incorporadas

Se incorporaron tres modalidades adicionales: **Semáforo MiLukita**, que acepta únicamente la señal `GO`; **Encuentra el Intruso**, que valida la posición correcta dentro de una matriz; y **Código Cooperativo**, que acumula los fragmentos `LU`, `KI` y `TA` hasta completar el umbral colectivo.

Las tres usan el mismo router protegido y el mismo modelo de sesión. Sus acciones se validan en el servidor, con puntuación virtual y sin liquidación monetaria.

## Integración avanzada

Las sesiones de TV en línea ahora se conectan al hook WebSocket existente mediante el identificador de sesión, y la interfaz muestra el estado realtime y el número de jugadores conectados. El router expone un manifest de sesión mediante `onlineTvGames.manifest`, incluyendo dificultad, versión de contenido, progreso colectivo y participantes.

La dificultad se puede seleccionar como Fácil, Estándar o Difícil. La versión vigente del banco de contenido es `online-tv-content-v1`. Los objetivos se generan server-side según la dificultad.

En staging local se ejecutó una prueba WebSocket de 100 jugadores: 100 JOIN, 100 reconexiones y cero errores. JOIN: p50 52,49 ms, p95 290,62 ms, p99 334,329 ms. Reconexión: p50 91,919 ms, p95 356,314 ms, p99 385,308 ms. Estos datos no certifican red pública, multiinstancia ni carga de base de datos.

## Operación y QA del bloque avanzado

Las sesiones se persisten en `online_tv_sessions` y el banco versionado se prepara en `online_tv_content_items`. La memoria local continúa sirviendo como caché de baja latencia; el router puede recuperar una sesión desde base de datos si la instancia no la tiene en memoria. La persistencia es compatible con Autoscale, aunque la coordinación simultánea de acciones entre varias instancias todavía requiere una estrategia de locking o almacenamiento realtime compartido antes de producción.

Se ejecutó carga sostenida de 15 minutos con 100 conexiones WebSocket, 100 reconexiones y cero errores. JOIN: p50 50,976 ms, p95 253,527 ms, p99 279,296 ms. Reconexión: p50 64,587 ms, p95 284,838 ms, p99 314,015 ms.

El QA visual se realizó en viewport de escritorio 1280×720 y móvil 390×844. Se verificaron selector, guía inicial, navegación, dificultad y estado realtime. La certificación en Safari iOS y Android TV físicos aún no está realizada; estos screenshots no sustituyen dispositivos reales.

## Mejoras operativas y de configuración

La ruta `/control-room` incorpora `AutonomyMonitoringPanel`, visible únicamente para administradores. El panel consulta periódicamente el resumen de autonomía, la salud del watchdog y el modo operativo; muestra minutos virtuales, eventos, escenarios de caos, KILL LUKITA y fecha de medición. La interfaz diferencia una simulación contractual de una certificación 24/7 real.

La ruta `/tv-en-linea` ahora ofrece estados de carga y validación durante la creación de una ronda y el envío de respuestas. El lobby móvil muestra conexión, reconexión y sincronización con la TV mediante indicadores accesibles.

La configuración de las modalidades se realiza mediante un nivel de ronda `EASY`, `STANDARD` o `HARD`. La pantalla muestra el efecto funcional del nivel y los parámetros aplicados por el servidor. El navegador puede seleccionar el nivel, pero no puede alterar tolerancias, objetivos, respuestas, umbrales, puntuaciones ni resultados. Cualquier futura configuración administrativa persistente deberá versionarse, auditarse y validarse server-side antes de hacerse efectiva.
