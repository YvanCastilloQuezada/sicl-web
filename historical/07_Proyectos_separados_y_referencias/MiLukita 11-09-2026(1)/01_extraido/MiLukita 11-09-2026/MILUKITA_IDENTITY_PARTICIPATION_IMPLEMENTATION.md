# MiLukita — Identity & Participation Implementation

## Clasificación honesta

**Implementado:** entidades persistentes, procedimientos tRPC, elegibilidad server-side, transiciones de participación, contexto QR, registro de dispositivos, métricas básicas y panel administrativo.

**Preparado pero deshabilitado:** Premium, pagos, KYC real, verificación de identidad fuerte, capa regulada, OTP y proveedores externos.

**No certificado:** operación 24/7 persistente, doble proceso contra base compartida, QA físico de cámaras, pentest independiente y revisión profesional legal/regulatoria.

## Contrato de identidad

`users` es la identidad interna OAuth. `milukita_identities.publicId` es el identificador público Milukita ID. Un dispositivo se registra mediante un hash normalizado; nunca se guarda el identificador bruto como identidad. Una persona puede tener varios dispositivos y un dispositivo revocado no puede reutilizarse silenciosamente.

## Contrato de sesión y participación

La sesión tiene estado `ACTIVE`, `EXPIRED` o `REVOKED` y vencimiento UTC. La ParticipationSession sigue transiciones estrictas: `CREATED → IDENTIFIED → ELIGIBLE → STARTED → SUBMITTED → COMPLETED`. Las salidas `EXPIRED`, `REJECTED` y `CANCELLED` son terminales. No se aceptan saltos desde el cliente ni reactivación de estados terminales.

## QR y contexto de evento

`milukita_event_contexts` conserva `eventId`, show, segmento, campaña, distribución y `expiresAt`. El contexto QR es contextual y no reemplaza el payload autoritativo de `MjpTvManifest`. La creación administrativa del contexto exige rol admin; su consulta pública sólo utiliza `publicId`.

## Elegibilidad

La decisión se calcula en servidor con evento abierto, sesión activa, nivel de identidad, verificación y política Free. La decisión devuelve un conjunto `claims` vacío por diseño: no crea claims monetarios, regulatorios ni de resultado. Premium devuelve `PREMIUM_DISABLED`; sin verificación suficiente devuelve `VERIFICATION_REQUIRED`; un evento cerrado devuelve `EVENT_CLOSED`.

## Free/Premium/Regulated

Free es la única vía habilitada para el piloto virtual. Premium está representado como `VERIFIED_PREMIUM_READY` pero su activación es `DISABLED`. La capa regulada/dinero real es `BLOCKED`. No se habilitan cobros, retiros, equivalencia de créditos a soles ni liquidación económica.

## Analítica

Los eventos del funnel se traducen al catálogo existente `product_analytics_events` con idempotencia y `payload.funnelEvent`. Se soportan QR escaneado, landing, inicio de identidad, creación de sesión, elegibilidad, participación, retorno y vistas Premium. Los eventos deben distinguir `web`, `pwa`, `tv`, `simulator` y `secondary_screen`.

## Seguridad y gobernanza

Los endpoints de identidad del usuario son `protectedProcedure`; la creación de contexto de evento es `adminProcedure`; el evento de funnel no confía en `userId` enviado por el cliente para elevar permisos. Ninguna operación de esta capa escribe resultados, reglas, RNG, RTP, wallet, ledger, settlement o `MjpTvManifest` autoritativo.

## Evidencia y pruebas

La batería determinista cubre Free elegible, evento cerrado, sesión inactiva, Premium bloqueado, verificación insuficiente, normalización de dispositivo, transiciones válidas/ inválidas y estados regulados. `pnpm check`, pruebas focalizadas y build deben ejecutarse antes de cada checkpoint.

## Próximo nivel

Para elevar madurez se requieren una prueba autenticada con sesión de operador, dos procesos reales en staging con base compartida, expiración y reconexión con tráfico real, carga concurrente, revisión de secretos, pentest y revisión profesional peruana antes de cualquier monetización.

## Mejoras de perfil, sesiones y transición QR — 27-08-2026

Se amplió `/perfil` para mostrar el Milukita ID del usuario autenticado, nivel de identidad, dispositivos reconocidos y sesiones registradas. Cada sesión activa muestra vencimiento y permite una revocación explícita mediante el procedimiento protegido `identity.revokeSession`; la acción queda auditada y no modifica MJP CORE. La gestión de dispositivos conserva la revocación existente.

El panel administrativo Identity & Participation incorpora filtros por tipo de dispositivo y estado (`ACTIVE`, `EXPIRED`, `REVOKED`). El tipo se presenta desde `milukita_devices.deviceType`, con `UNKNOWN` como valor seguro cuando no existe clasificación.

La experiencia TV añade `QrContextTransition`, con estados accesibles de preparación, actualización, desconexión y refresco del contexto QR. La animación comunica sincronización, pero no altera el payload, la firma, la duración autoritativa ni la elegibilidad server-side.

Validación: `pnpm test -- --run`, `pnpm check` y `pnpm build` PASS. El build conserva advertencias no bloqueantes de chunks grandes del visor 3D. QA visual reproducible completado en escritorio para `/perfil`, `/tv` y `/generador-qr`; las pruebas de cámaras y dispositivos físicos continúan fuera del alcance del sandbox.

## Cierre de iteración: perfil, avatar, preferencias y exportación — 27-08-2026

La página autenticada `/perfil` incorpora ahora una zona de presencia del piloto para cargar foto de perfil en formato JPEG, PNG o WebP, con límite de 2 MB y almacenamiento mediante la capa S3; el servidor valida el tipo MIME y el tamaño antes de persistir únicamente la referencia de almacenamiento. La operación está protegida por `identity.uploadAvatar`, registra `IDENTITY_AVATAR_UPLOADED` en `operational_events` y no modifica ninguna autoridad del núcleo.

La sección de preferencias permite activar o desactivar individualmente las notificaciones dentro de la aplicación, actualizaciones de QR, alertas de seguridad, alertas de sesión y alertas críticas de expiración. La mutación protegida `identity.updateNotificationPreferences` conserva la configuración en `milukita_identities.notificationPreferences`, usa actualización parcial y registra `IDENTITY_NOTIFICATION_PREFERENCES_UPDATED`. La interfaz muestra confirmación explícita y estados de guardado/error.

El perfil incluye una tabla de sesiones activas con fecha de creación, vencimiento, último uso y tipo de dispositivo. La revocación mantiene la operación auditable y muestra estados de carga y error. El Control Room dispone de filtrado por dispositivo y estado, además de exportación del conjunto filtrado a CSV en cliente (`identity-sessions.csv`) y a PDF mediante `operations.exportIdentitySessionsPdf`; la generación PDF se almacena en S3 y registra `IDENTITY_SESSIONS_EXPORTED_PDF`. La exportación se limita a administración y no expone secretos ni payloads de resultado.

`QrContextTransition` comunica carga, actualización, reconexión y desconexión; ante fallos aplica reintentos automáticos con backoff exponencial acotado, evita reintentos cuando el componente se desmonta y muestra un timeout accionable. Este comportamiento es sólo de experiencia y resiliencia de transporte: el contexto no sustituye al `MjpTvManifest` autoritativo, no cambia el QR firmado y no concede participación.

Se añadieron contratos compartidos y pruebas deterministas para MIME permitido, preferencias explícitas y frontera protegida (`shared/profileSessionFeatures.test.ts`). La implementación conserva el piloto virtual: Premium permanece deshabilitado, la capa regulada bloqueada y `claims` vacío.

### Evidencia de validación

- `pnpm check`: **PASS**.
- `pnpm test -- --run`: **90 archivos PASS, 1 omitido; 297 pruebas PASS y 4 omitidas**.
- `pnpm build`: **PASS**. El bundler mantiene advertencias no bloqueantes sobre chunks grandes, principalmente el visor 3D y algunos paneles administrativos.
- QA visual reproducible en escritorio: `/perfil`, `/tv` y `/control-room` cargaron correctamente. `/perfil` mostró el modal de guía inicial del piloto en la sesión de captura; debe cerrarse para revisar los controles inferiores.
- No se declara validación física de cámaras o dispositivos en iOS, Android, Samsung Tizen, LG webOS ni Android/Google TV sin hardware real.

### Límites explícitos

La carga de avatar no prueba todavía cuotas de almacenamiento, antivirus, imágenes maliciosas ni integración con un proveedor externo de identidad. La exportación PDF requiere sesión administrativa real para probar autorización y datos de staging. Los reintentos QR se validaron por contrato y UI, pero no certifican conectividad móvil real, redes intermitentes de Smart TV ni operación 24/7 productiva.

## Tareas de cierre implementadas — 27-08-2026

Se reforzó la validación de avatar en dos niveles. El cliente rechaza extensiones no permitidas, archivos mayores de 2 MB y estados sin feedback; el servidor ahora utiliza `isValidAvatarDataUrl` desde `shared/identityParticipation.ts` para exigir que el MIME declarado coincida exactamente con el encabezado del data URL. Esto reduce ambigüedad de contenido antes de almacenarlo en S3. La decisión continúa siendo virtual y no relacionada con KYC.

Se mejoró la accesibilidad operacional del perfil y del panel administrativo. Las secciones anuncian carga mediante `aria-busy`, los mensajes de éxito y error usan regiones `role=status` con `aria-live`, los fallos de consulta usan `role=alert`, el selector de avatar tiene etiqueta accesible y queda deshabilitado durante la subida, y los checkboxes de preferencias exponen nombres explícitos y se bloquean mientras se guarda. Las exportaciones de sesiones muestran estado de preparación, éxito o error sin ocultar la operación al usuario.

Se aplicó code-splitting adicional en Control Room. Los paneles administrativos pesados se importan de forma diferida y se montan mediante `DeferredPanel` cuando se aproximan al viewport usando `IntersectionObserver`; mientras tanto se presenta un estado informativo y accesible. El visor 3D ya conserva su propio cargador diferido. En el build, el chunk de `ControlRoom` se redujo a aproximadamente 80,61 kB sin comprimir frente a aproximadamente 406,14 kB observados antes de esta optimización. El chunk del visor 3D continúa siendo grande (aproximadamente 621,51 kB) porque contiene Three.js; sigue cargándose fuera del primer render de las rutas generales.

La regresión final reportó **91 archivos de prueba aprobados, 1 omitido; 301 pruebas aprobadas y 4 omitidas**. `pnpm check` y `pnpm build` finalizaron correctamente. Persisten únicamente advertencias no bloqueantes de chunks superiores a 500 kB y del paquete `baseline-browser-mapping` desactualizado. La captura visual verificó `/perfil`, `/control-room` y `/lukita-3d`; la guía inicial del piloto aparece en `/perfil` durante la primera visita y puede cerrarse para inspeccionar el contenido.

## Mejoras posteriores de Control Room — 27-08-2026

Se añadió una **búsqueda rápida unificada** en el registro operativo del Control Room. La consulta se aplica en tiempo real sobre tipo de evento, agregado, identificador, fuente, área, estado, personaje y detalle del historial; ignora espacios exteriores y diferencias de mayúsculas. El resultado muestra el número de coincidencias y ofrece un control accesible para limpiar la búsqueda. La función pura `matchesControlRoomSearch` y sus tres pruebas quedan en `shared/controlRoomSearch.ts` y `shared/controlRoomSearch.test.ts`.

Las exportaciones del Control Room ahora entregan confirmación visual mediante toast al completarse, tanto para el CSV general como para el historial filtrado y el registro de sesiones de Identity & Participation. También se muestran estados inline anunciables por `aria-live` y mensajes de error cuando no se genera un enlace o la operación falla. El componente global `Toaster` ya estaba montado en `client/src/App.tsx` y se reutiliza sin duplicar infraestructura.

Los paneles diferidos del Control Room reciben la clase `control-room-deferred-panel` y, al pasar de `deferred` a `loaded`, presentan una entrada breve basada únicamente en opacidad y desplazamiento vertical. La animación se desactiva con `prefers-reduced-motion: reduce`; no modifica la altura estructural, la autoridad ni los contratos de los paneles. El estado también queda expuesto como `data-panel-state` para verificación automatizada.

## Incidente de lentitud y accesos — diagnóstico y evidencia

Durante la revisión en navegador autenticado se observó inicialmente que el resumen de Identity & Participation fallaba porque la consulta solicitaba `deviceType`, mientras la tabla `milukita_devices` no contenía esa columna. La discrepancia se confirmó comparando `drizzle/schema.ts` con `information_schema.COLUMNS`; el esquema declarativo y la migración `drizzle/0034_exotic_fantastic_four.sql` ya definían la columna. Se aplicó únicamente el `ALTER TABLE` no destructivo pendiente, sin cambiar datos existentes. Tras recargar, el resumen mostró `IDENTITY READY`, un Milukita ID y los controles de sesiones volvieron a estar disponibles.

También se detectó un origen independiente de solicitudes repetitivas en `ProductAnalyticsBeacon`: el objeto completo de la mutación tRPC formaba parte de las dependencias del efecto. Se estabilizó la dependencia usando la función `mutate` (`recordEvent`), evitando que los cambios de estado de la mutación reprogramen el mismo lote de eventos. La deduplicación por `idempotencyKey` y el límite de reintentos se mantienen.

Evidencia reproducible del 27-08-2026: con sesión autenticada, la búsqueda `AUDIT` devolvió `10 coincidencias`; una exportación CSV del event log mostró el toast `Exportación completada` y la preparación del archivo; el botón PDF del registro de sesiones abrió un documento generado por servidor con título `MiLukita — Registro de sesiones`; y una pulsación de `Tab` desplazó el foco visible al enlace `TV`. La primera pantalla no autenticada continúa mostrando correctamente `Inicia sesión`, por lo que la prueba administrativa requiere operador autenticado.

Límite de la evidencia: el navegador de sandbox confirma la interacción en Chromium y el flujo autenticado disponible; no constituye certificación de Safari iOS, Android TV, lectores de pantalla físicos ni hardware real. Esos ensayos siguen requiriendo dispositivos correspondientes.

## QA de bloqueo, accesibilidad y móvil — 27-08-2026

La reproducción autenticada confirmó que el Control Room responde después de corregir la discrepancia de esquema: el resumen muestra `IDENTITY READY`, el event log presenta 12 coincidencias iniciales y la búsqueda `AUDIT` redujo el resultado a 10 coincidencias. La exportación CSV mostró el toast `Exportación completada` y la exportación PDF abrió un documento de servidor titulado `MiLukita — Registro de sesiones` con cero registros, coherente con el estado de staging observado. No se alteraron rondas ni resultados.

La navegación mediante teclado se verificó con `Tab`: el foco visible avanzó al enlace `TV` y el árbol interactivo expuso controles de TV, Auditoría, exportaciones, filtros, búsqueda, actualización y exportación filtrada. Las pruebas de contrato `controlRoomAccessibility.test.ts` cubren el buscador, limpieza, estados `role=status`/`aria-live`, `data-panel-state`, `prefers-reduced-motion` y el proveedor global de toasts.

La medición de navegación en Chromium registró `responseEnd ≈ 40 ms`, `DOMContentLoaded ≈ 368 ms`, `loadEvent ≈ 389 ms`, 144 recursos y una transferencia JS aproximada reportada por el navegador de 300 bytes (valor sujeto a la política de caché y a la instrumentación del entorno). En viewport móvil 390 × 844 el Control Room se presenta en una sola columna, mantiene legibles los controles principales y no muestra overflow horizontal en la primera pantalla.

Límites: no se declara certificación de lector de pantalla, Safari iOS, Android TV ni dispositivo móvil físico. La prueba PDF/CSV se realizó en el navegador Chromium autenticado del sandbox y debe repetirse en los navegadores objetivo antes de publicación.

## Analítica de dispositivos y rango temporal — 27-08-2026

Se añadió al panel Identity & Participation una ventana de analítica con fechas `Desde` y `Hasta`, límites cruzados (`max`/`min`) y botón `Limpiar rango`. El rango se aplica a dispositivos, sesiones y participaciones usando sus timestamps reales de creación. La distribución por tipo se calcula con `summarizeDeviceDistribution`; los tipos desconocidos permanecen explícitos como `UNKNOWN`. Si el rango no contiene registros, se muestra `No hay dispositivos en el rango seleccionado` y no se formula ninguna conclusión.

La visualización utiliza el componente Recharts ya presente en el proyecto, con barras, ejes, cuadrícula y tooltip. Durante la carga se muestra un skeleton de barras con `role=status` y etiqueta accesible; las métricas individuales también conservan su espacio mediante skeletons. Los estilos de skeleton respetan `prefers-reduced-motion` y sustituyen el shimmer por una superficie estática cuando corresponde.

QA visual en escritorio (1280×720): la cabecera, componentes y el inicio del panel Identity & Participation cargan sin desbordamiento visible. El panel completo se revisó en captura de página larga. Las pruebas deterministas verificaron inclusión de los límites del día, ordenamiento estable, agrupación de `UNKNOWN` y ausencia de datos fuera del rango.

La comprobación final en `/control-room` mostró el selector `Desde/Hasta`, el botón `Limpiar rango`, el bloque `Distribución de dispositivos` y la lectura `Datos observados`. El entorno actual no contiene dispositivos persistidos para el operador, por lo que se presenta deliberadamente `No hay dispositivos en el rango seleccionado` en lugar de inventar una distribución. Esta conducta cumple la política `NO DATA → NO CLAIM` y el gráfico se renderizará automáticamente cuando existan registros autorizados.

## Exportación y lectura precisa de la distribución — 27-08-2026

El gráfico de dispositivos incorpora un tooltip interactivo que muestra el tipo registrado, el conteo absoluto y el porcentaje calculado sobre el total visible del rango seleccionado, redondeado a una decimal. La base del cálculo sigue siendo exclusivamente el conjunto persistido; los porcentajes no se generan cuando el conjunto está vacío.

Se añadió la acción `Limpiar rango` junto al selector `Desde/Hasta`, que restablece ambas fechas y devuelve la lectura a `inicio → ahora`. La acción permanece deshabilitada cuando no existe ningún filtro aplicado. También se añadieron los botones `PNG` y `PDF`: el primero serializa el SVG renderizado en un lienzo de alta resolución y descarga una imagen; el segundo abre una vista de impresión con el rango y la fuente de datos indicados para guardarla como PDF desde el navegador. Ambos botones permanecen deshabilitados durante carga o sin datos y anuncian el resultado mediante toast.

La prueba focalizada de accesibilidad y exportación quedó en 2 archivos aprobados y 8 pruebas aprobadas. La revisión móvil en 390×844 no mostró overflow horizontal en la estructura general; el entorno de QA permanece sin dispositivos persistidos, por lo que se observó correctamente el estado NO DATA y no la gráfica con barras.

## Comparación temporal y exportación tabular — 27-08-2026

El gráfico de dispositivos ahora permite definir un **rango actual** y un **rango comparado** mediante dos pares independientes de fechas. La comparación se activa únicamente cuando el segundo par está completo y alinea todos los tipos observados en ambos períodos, conservando ceros explícitos cuando un tipo existe en un período pero no en el otro. La vista usa dos series distinguibles y el tooltip informa conteo y porcentaje para ambos rangos.

Para pantallas táctiles, cada tipo se presenta además como un control seleccionable debajo del gráfico. Al tocarlo se muestra un detalle persistente y anunciable con las cifras exactas; esto complementa, sin sustituir, el tooltip de interacción sobre la gráfica. La exportación CSV incluye tipo, conteos, porcentajes y diferencia cuando hay comparación; en modo simple incluye tipo, conteo y porcentaje. El archivo incorpora BOM UTF-8 y saltos de línea compatibles con hojas de cálculo.

La comparación, los ceros explícitos de alineación y el contrato de lectura sin registros están cubiertos por pruebas deterministas. La interfaz mantiene `NO DATA → NO CLAIM`: si ninguno de los rangos contiene dispositivos persistidos no se dibuja una gráfica ni se habilita ninguna exportación.

## Comparador de rangos y exportación CSV — 27-08-2026

Se incorporó un segundo par de fechas para comparar la distribución de dispositivos del rango actual con un rango comparado. La comparación se activa solo cuando ambas fechas del segundo rango están completas. El contrato `compareDeviceDistributions` une los tipos presentes en cualquiera de los períodos y representa con cero los tipos ausentes; por ello la lectura no oculta diferencias ni introduce datos sintéticos.

El tooltip del gráfico se separó en un componente reutilizable con valores legibles y, para interacción táctil, cada categoría dispone de un control seleccionable que abre un detalle persistente con conteos y porcentajes. La exportación CSV incluye BOM UTF-8, saltos de línea válidos, tipos, conteos y porcentajes; en modo comparativo añade ambos rangos y la diferencia de dispositivos.

La regresión focalizada cubre la alineación entre rangos, ceros explícitos y accesibilidad de los controles. QA responsive en 390×844 mantuvo la estructura sin overflow horizontal visible. El entorno observado continúa sin dispositivos persistidos, por lo que la interfaz mantiene el estado NO DATA y las exportaciones permanecen deshabilitadas hasta que existan registros reales.
