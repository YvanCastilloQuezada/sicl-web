# Canal virtual YouTube + PWA + web

## Alcance implementado

Se implementó una primera capa operativa del canal virtual sobre la aplicación existente, sin crear una segunda aplicación y sin activar pagos, retiros ni dinero real. La web pública expone `/tv` como punto de entrada del canal, mientras que `/overlay/:roundId` funciona como vista de pantalla para OBS, navegador o producción audiovisual. El enlace TV de la navegación abre la misma experiencia en escritorio, tablet y móvil.

## Flujo real de una ronda

1. El operador prepara una ronda desde `/operacion` usando las funciones existentes de reglas versionadas y cierre autoritativo.
2. La PWA o la página pública consulta `broadcast.round` mediante tRPC y recibe solo datos públicos: nombre, estado, horarios, contador, cantidad de participaciones confirmadas, resultado cuando corresponde y URL de verificación.
3. Mientras la ronda está abierta, `broadcast.qr` genera un QR firmado con el identificador de transmisión, ronda, juego, versión de reglas, ventana temporal, nonce, URL de juego y URL de verificación.
4. El overlay consume el mismo estado mediante tRPC y actualiza cada cinco segundos. El contador se calcula con `closeAt`, no con la hora mostrada en televisión; así el servidor continúa siendo la autoridad.
5. Cuando el servidor cierra y sortea, el overlay deja de mostrar el QR y presenta el resultado publicado. El enlace de verificación abre `/verificar?round=...` y precarga el expediente de la ronda.
6. El usuario que llega desde un QR conserva el parámetro `round` en la URL del juego. La página muestra una banda de ronda TV conectada y su cuenta regresiva, pero la reserva sigue pasando por la autenticación, billetera virtual, idempotencia y validaciones existentes.

## Seguridad aplicada

La firma QR usa HMAC-SHA-256 derivado de `JWT_SECRET`, que ya es un secreto gestionado por el entorno. No existe un secreto por defecto en código. La serialización que se firma es canónica y ordenada; la validación utiliza comparación resistente a tiempo, comprueba versión, ventana de apertura y cierre, y rechaza modificaciones del identificador o del contenido. El QR no contiene saldo, identidad, documento ni información privada.

El QR se calcula bajo demanda y no crea boletos ni altera rondas. La consulta de estado oculta las semillas privadas y limita los datos a la presentación pública. Los estados de producción se proyectan a `scheduled`, `open`, `locked`, `drawn`, `verified` o `cancelled`; el cierre y el sorteo siguen ejecutándose mediante las operaciones autoritativas del piloto.

## Diferencias con la especificación adjunta

La especificación proponía un WebSocket, Redis, un servidor separado, un `QR_SECRET` con valor de respaldo, rutas REST abiertas para generar rondas, una recarga genérica y un panel administrativo paralelo. No se copiaron esos patrones porque introducirían duplicación, riesgo de seguridad o conflicto con el diseño actual. Esta implementación utiliza tRPC, base de datos existente, autenticación administrativa y `JWT_SECRET` gestionado por el entorno.

La integración de YouTube es configurable mediante `/tv?v=ID_DEL_VIDEO`; no se hardcodea un video inexistente ni se activa una transmisión real. El panel operativo muestra el QR y el overlay para una ronda existente, pero la creación y el cierre permanecen en las acciones protegidas de Operaciones. Los créditos siguen siendo gratuitos, virtuales y no convertibles.

## Archivos principales

| Archivo | Propósito |
|---|---|
| `server/broadcast.ts` | Estado público, firma/validación QR y generación de Data URL. |
| `server/routers.ts` | Procedimientos públicos `broadcast.id`, `rounds`, `round`, `qr` y `validateQr`. |
| `server/broadcast.test.ts` | Pruebas de firma, manipulación, expiración y versión. |
| `client/src/pages/BroadcastPage.tsx` | Canal `/tv` y overlay `/overlay/:roundId`. |
| `client/src/hooks/useCountdown.ts` | Cuenta regresiva basada en fecha UTC. |
| `client/src/components/BroadcastOperationsPanel.tsx` | Panel de transmisión dentro de Operaciones. |
| `client/src/pages/GamePage.tsx` | Contexto de ronda TV al entrar desde QR. |
| `client/src/pages/Verify.tsx` | Precarga del expediente desde el enlace QR. |

## Validación realizada

`pnpm check` pasó sin errores. La suite de Vitest pasó con **22 archivos y 67 pruebas aprobadas**. `pnpm build` pasó y generó el bundle de producción. La página `/tv` fue revisada en escritorio de 1280×720 y móvil de 375×812; la guía táctil existente aparece de forma modal en la primera visita, por lo que debe cerrarse para revisar el canal completo durante una prueba manual.

## Pendientes antes de una transmisión real

Todavía no se activó un calendario automático de sorteos para TV, una integración de YouTube Live API, un servidor de eventos dedicado, redundancia, monitorización de emisión, conciliación de latencia entre señal y servidor, certificación independiente, política legal ni operación con dinero real. Antes de emitir públicamente, debe definirse quién opera el canal, cómo se obtiene el video ID de cada emisión, cuál es el procedimiento de contingencia y qué revisión legal/regulatoria corresponde.

## Mejora de operación y contingencia

El panel de Operaciones ahora permite guardar localmente el ID de video de YouTube, abrir la vista pública configurada y seguir un procedimiento guiado de cinco pasos. La configuración se limita al navegador del operador: no se guarda una API key ni se ejecutan acciones administrativas sobre YouTube.

El mismo panel incluye un historial de hasta diez rondas públicas recientes. Cada fila muestra modalidad, identificador, participaciones y estado; al seleccionarla, se carga el QR firmado correspondiente y se habilitan los enlaces al overlay y a la vista TV.

La página `/tv` presenta una alerta viva de estado. Si no existe ID de video, la consulta de rondas falla, el estado queda sin actualizar por más de treinta segundos o el operador fuerza una prueba con `?signal=down`, se activa un modo de contingencia. Este modo conserva accesos a verificación e historial y explica que el servidor continúa siendo la autoridad. El iframe de YouTube no se interpreta como fuente de resultados y su caída no modifica rondas ni créditos.

La recuperación se prueba mediante el botón **Reintentar señal**, que revalida el estado de rondas. Para pruebas controladas, `?signal=down` permite revisar el aviso y el modo alterno sin tocar la base de datos.

## Acceso por dispositivo y operación ampliada

`/tv` ahora ofrece un selector explícito entre **Jugar en vivo** y **Jugar en línea**. La tabla integrada explica el acceso recomendado para Smart TV, computadora, tablet y celular, junto con la interacción esperada. En términos de producto, la Smart TV es principalmente una pantalla de emisión; el celular funciona como control de participación mediante QR; la computadora sirve para emisión, overlay y verificación; y la tablet combina visualización y controles táctiles.

Operaciones muestra un indicador de señal basado en un latido local entre la vista `/tv` y el panel mediante `BroadcastChannel`. “Señal monitorizada” significa que una vista `/tv` configurada está enviando latidos; “Sin monitor conectado” significa que el ID existe pero no hay una vista local observada; “Revisar señal” indica error o falta de actualización. Este indicador no pretende reemplazar una integración oficial con YouTube Live API y no afirma que se hayan recibido cuadros de video desde otro dispositivo.

El historial operativo permite filtrar por estado y descargar las filas filtradas como CSV con identificador, juego, estado, participantes y fechas UTC. La exportación se genera en el navegador del operador y no incluye datos personales, saldos ni secretos.

La contingencia de `/tv` incorpora mensaje personalizado, preservación de verificación e historial y reconexión automática cada diez segundos cuando existe un ID de video. El parámetro `?signal=down` se conserva como mecanismo de prueba visual sin modificar rondas ni base de datos.


## 69. Retención frontend y experiencia TV–QR

Se añadió `shared/retentionEvents.ts` como plan puro y testeable de eventos de producto. `ProductAnalyticsBeacon` lo utiliza para registrar una sesión diaria, el retorno después de otro día activo y el acceso a una pantalla secundaria desde un QR de ronda. Cuando el usuario vuelve a utilizar la pantalla secundaria en otro día, se registra `secondary_screen_returned`; el primer acceso registra `secondary_screen_viewed`. Se utilizan identificadores de sesión locales y claves idempotentes; no se envían PII innecesaria. La telemetría solo se activa para usuarios autenticados, de modo que los KPI persistentes puedan asociarse a cohortes internas.

`ProgramSchedulePanel` añade filtros de bloques (`Todos`, `Requieren aprobación` y `Sin conflicto`) y una etiqueta visible `Requiere aprobación` en cada bloque propuesto. El panel mantiene la advertencia de que ningún bloque se publica automáticamente.

`BroadcastAccessGuide` añade una transición de opacidad y desplazamiento de 150 ms al alternar entre `Jugar en vivo` y `Jugar en línea`. La transición utiliza `motion-reduce` para respetar preferencias de reducción de movimiento y afecta solo a la interfaz; no modifica rondas, QR, reglas, créditos ni resultados.

La validación de esta ampliación alcanzó 28 archivos y 82 pruebas aprobadas, TypeScript sin errores y build funcional. La retención real requiere usuarios autenticados y un periodo de observación; las pruebas unitarias confirman la lógica de eventos, no una métrica de audiencia real.
