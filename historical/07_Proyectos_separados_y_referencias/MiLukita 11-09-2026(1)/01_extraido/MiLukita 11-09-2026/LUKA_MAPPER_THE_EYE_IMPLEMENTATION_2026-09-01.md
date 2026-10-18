# MiLukita Mapper + The Eye — expediente de implementación

**Fecha:** 2026-09-01  
**Autor:** Manus AI  
**Propósito:** documentar la primera implementación ejecutable de la capa de confianza territorial solicitada en `pasted_content_28.txt`.

## Decisión arquitectónica

Se mantiene la separación obligatoria **CAPTURA → VERIFICACIÓN → PUBLICACIÓN**. MiLukita Mapper registra WorldObjects, claims, fuentes y evidencias. The Eye registra decisiones de revisión y transiciones. Human Authority conserva la publicación final. El Runtime público solo recibe filas con estado `PUBLISHED` mediante `territorial.runtimePublished`.

> Ninguna ruta del dominio territorial escribe, lee o muta tablas de juegos, sorteos, pagos, wallets, RTP, RNG, settlement o reglas del MJP CORE.

## Componentes implementados

| Componente | Implementación | Control |
|---|---|---|
| WorldObject | Tabla `world_objects`, geometría JSON, coordenadas, precisión, atributos, relaciones, assets, versión y estado | `adminProcedure` |
| Claim | Tabla `territorial_claims`, estado de verificación, confianza y observaciones | Asociado a WorldObject |
| Source | Tabla `territorial_sources`, institución/persona, tipo, referencia, fecha, autoridad y observaciones | Asociado a WorldObject |
| Evidence | Tabla `territorial_evidence`, origen, fecha, responsable, claim opcional, integridad y metadatos | Huella registrada; no se inventan archivos |
| The Eye | Tabla `territorial_verification_reviews` y función de transición | Decisiones explícitas y motivo obligatorio |
| Human Authority | Mutación `territorial.publish` separada de `territorial.review` | Solo estado `VERIFIED` con fuente y evidencia |
| Audit Log | Reutilización de `audit_events` con hash encadenado SHA-256 | Solo inserción desde este dominio |
| Runtime | Query pública `territorial.runtimePublished` | Filtra exclusivamente `PUBLISHED` |
| Interfaz | Ruta `/mapper-the-eye` con captura, listado, detalle, claims, fuentes, evidencia, revisión y publicación | Dashboard autenticado; backend admin como autoridad definitiva |

## Estados y gates

WorldObject soporta `DRAFT`, `CAPTURED`, `UNDER_REVIEW`, `EVIDENCE_REQUIRED`, `VERIFIED`, `PUBLISHED`, `DISPUTED`, `OUTDATED`, `REJECTED` y `ARCHIVED`. La máquina de transiciones impide saltos como `CAPTURED → PUBLISHED`. La publicación requiere estado `VERIFIED`, confianza mayor que cero y al menos una fuente y una evidencia. El score de confianza no sustituye a la evidencia.

La decisión `VERIFY` se registra con el conjunto de evidencias revisadas y la versión aprobada. Las decisiones `REQUEST_EVIDENCE`, `DISPUTE`, `REJECT` y `ARCHIVE` quedan registradas con su motivo. La publicación no se realiza desde Mapper ni automáticamente desde The Eye.

## Seguridad aplicada

Las mutaciones y las vistas administrativas usan `adminProcedure`, por lo que requieren sesión autenticada y rol `admin` verificado server-side. Las entradas se validan con Zod: identificadores, coordenadas, URL opcional, fechas, enumeraciones, límites de longitud y rangos numéricos. La ruta pública únicamente expone objetos publicados y omite los registros de trabajo.

La autorización territorial no otorga ningún privilegio sobre MJP CORE. Los nuevos módulos usan tablas y servicios independientes. No se añadieron imports hacia los servicios del núcleo de juegos.

## Validación ejecutada

La prueba unitaria `shared/territorialTrust.test.ts` cubre flujo válido, saltos inválidos, gates de publicación y aislamiento del Runtime. Validación final del proyecto:

| Control | Resultado |
|---|---:|
| TypeScript `tsc --noEmit` | PASS |
| Vitest | 123 archivos aprobados, 1 omitido; 448 pruebas aprobadas, 4 omitidas |
| Build Vite/esbuild | PASS |
| Advertencia | Chunks grandes existentes; no bloqueante |

## Alcance pendiente antes de declarar producción

Esta iteración implementa el núcleo auditable y la superficie administrativa, pero no debe declararse producción completa todavía. Quedan como gates explícitos: carga binaria protegida de fotografía/video/documentos mediante S3 y control de acceso por asset; importación CSV/XLSX con validación y reporte de errores; exportación GeoJSON/CSV; detección real de duplicados y contradicciones; rate limiting específico por endpoint; permisos diferenciados persistidos para Mapper Operator, Eye Reviewer y Human Authority; y QA en dispositivos físicos/GPS/mapa real.

Tampoco se crean datos simulados ni se publica ningún WorldObject automáticamente. La ausencia de assets binarios no se oculta: la interfaz lo informa y solo permite registrar una referencia textual de evidencia en esta fase.

## Criterio de aceptación cubierto y no cubierto

Se cubre el flujo de datos estructurado: crear un objeto, asociar claims/fuentes/evidencias, enviarlo a revisión, verificarlo, registrar la versión y publicar únicamente después del gate. El criterio completo del adjunto requiere además capturar archivos físicos, importar/exportar formatos y validar fuentes en territorio real; esas capacidades permanecen pendientes y documentadas como gates, no como integraciones ficticias.

## Archivos principales

- `shared/territorialTrust.ts`
- `server/territorialTrust.ts`
- `drizzle/schema.ts`
- `drizzle/0040_flawless_baron_strucker.sql`
- `client/src/pages/TerritorialTrustPage.tsx`
- `client/src/App.tsx`
- `shared/territorialTrust.test.ts`

**Conclusión:** el proyecto dispone de un primer núcleo funcional y auditable de confianza territorial. El diseño respeta el orden constitucional y mantiene MJP CORE fuera del dominio. La siguiente prioridad no es agregar agentes, sino completar storage protegido, import/export, RBAC fino, rate limiting y QA externo.


## Addendum de ampliación urgente

La iteración posterior incorpora tres capacidades operativas adicionales. Primero, el RBAC territorial detallado se persiste en `territorial_role_assignments` con los roles `MAPPER_OPERATOR`, `EYE_REVIEWER` y `HUMAN_AUTHORITY`. Las operaciones server-side se separan por responsabilidad: Mapper puede crear objetos, claims y evidencias; The Eye puede revisar y registrar decisiones; Human Authority puede publicar. Un administrador sin asignación explícita conserva únicamente el fallback de Human Authority.

Segundo, los archivos se suben mediante `storagePut` hacia el almacenamiento S3 preconfigurado. El servidor valida MIME, nombre, tamaño máximo de 20 MB y asociación con el WorldObject. Se conserva en la base de datos únicamente la referencia de storage, tamaño, MIME, hash SHA-256, alcance y responsable. El alcance inicial es `ADMIN_ONLY`; no se exponen archivos binarios al Runtime automáticamente.

Tercero, Mapper ofrece importación y exportación masiva CSV y GeoJSON. CSV requiere `name`, `latitude` y `longitude`; GeoJSON requiere un `FeatureCollection` con geometrías coordenadas válidas. Se limitan las importaciones a 500 registros por operación, se rechazan filas inválidas y todo registro importado queda `CAPTURED`, nunca `PUBLISHED`. Las exportaciones se generan desde el servidor y pueden descargarse desde la interfaz administrativa.

La validación de esta ampliación ejecutó TypeScript, la suite completa de Vitest y el build. Resultado: TypeScript PASS; 123 archivos aprobados y 1 omitido; 448 pruebas aprobadas y 4 omitidas; build PASS. La advertencia de chunks grandes permanece no bloqueante. Se añadieron pruebas de contrato RBAC y se conserva la declaración de que MJP CORE no fue modificado.

Los siguientes controles de producción siguen siendo gates separados: rate limiting específico por endpoint territorial, RBAC de múltiples asignaciones por usuario si la operación lo requiere, antivirus/escaneo de contenido para uploads, URLs firmadas con alcance granular para revisión, importación XLSX además de CSV, validación semántica de geometrías complejas, deduplicación y contradicciones automatizadas, y QA con datos de territorio real.


## Addendum de la orden 30

La orden 30 se consolidó sobre el dominio territorial existente, preservando la secuencia CAPTURA → WORLD OBJECT → CLAIMS → SOURCES/EVIDENCE → THE EYE → VERIFICATION → HUMAN AUTHORITY → PUBLICATION → RUNTIME. La interfaz ahora permite previsualizar localmente una evidencia antes de persistirla en S3; las imágenes y videos muestran una vista previa y los demás tipos informan que serán validados por MIME, tamaño e integridad al confirmarse. Cancelar la previsualización no realiza upload.

La tabla de WorldObjects incorpora búsqueda libre por ID, nombre, descripción o tipo, además de filtros combinables por estado, tipo y presencia de evidencia. La importación CSV/GeoJSON muestra estado accesible, porcentaje y animación de progreso; el porcentaje es una señal de avance de interfaz y la decisión final depende de la respuesta server-side. Los registros importados permanecen en CAPTURED y no se publican automáticamente.

Se verificó que el build conserva TypeScript PASS y que la suite completa finaliza con 124 archivos aprobados y 1 omitido, 450 pruebas aprobadas y 4 omitidas. El build de producción finaliza correctamente con una advertencia no bloqueante de chunks grandes. La implementación de esta orden no añade autoridad al Runtime ni modifica MJP CORE.

Pendientes explícitos frente al documento: CaptureSession persistente, Field Mode con sensores reales, geometrías POLYGON/MULTI*, Nearby Intelligence con cálculo geoespacial, matriz de evidencia/confianza configurable, detección semántica de conflictos, versionado profundo y XLSX requieren una iteración dedicada. No se presentan como implementados para evitar confundir una maqueta de UI con capacidad productiva.


## Addendum de la orden 31

Se incorporó `territorial_capture_sessions` como entidad independiente para agrupar una salida de campo: nombre, territorio, responsable Mapper, estado de sesión, estado de sincronización, área JSON y contadores derivados de objetos y evidencias. `world_objects.captureSessionId` es opcional para conservar compatibilidad con capturas históricas y permitir que una importación CSV/GeoJSON se vincule a la sesión elegida. La sesión organiza; no reemplaza el workflow individual de cada objeto.

Se añadieron endpoints administrativos para crear, listar y consultar sesiones. La asociación verifica la sesión, evita adjuntar a una sesión archivada y exige responsabilidad compatible cuando la sesión ya dejó el estado inicial. La UI muestra la sesión activa, sus contadores, responsable y sincronización; la importación conserva el estado `CAPTURED`.

El expediente de cada WorldObject ahora dispone de edición previa a confirmación. Las ediciones server-side validan coordenadas, bloquean registros `VERIFIED`, `PUBLISHED` y `ARCHIVED`, incrementan la versión, vuelven a `CAPTURED` y registran `WORLD_OBJECT_EDITED` en la auditoría. Por diseño, la modificación obliga a repetir revisión antes de publicar.

Los filtros de la tabla pueden guardarse como presets locales del navegador, incluyendo búsqueda, estado, tipo, evidencia y ordenamiento. El almacenamiento es deliberadamente local y no constituye una preferencia global ni altera datos territoriales.

Limitaciones explícitas: no se simula sincronización offline real, resolución automática de conflictos ni versionado histórico completo de snapshots; estas capacidades requieren una migración de versiones y pruebas de campo posteriores. MJP CORE permanece fuera del dominio territorial.


## Addendum — Orden 32: continuidad offline y sincronización controlada

La iteración 32 incorpora `territorial_world_object_snapshots` y `territorial_offline_captures`. Cada WorldObject creado o editado genera un snapshot inmutable con estado completo, versión y hash SHA-256. Restaurar una versión nunca sobrescribe la historia: crea una nueva versión `CAPTURED`, registra la operación y obliga a repetir la revisión de The Eye.

Mapper muestra el estado `ONLINE` u `OFFLINE`, conserva capturas en una cola local y ofrece **Sincronizar ahora**. La sincronización es explícita, secuencial e idempotente mediante `clientCaptureId`. Si la versión local no coincide con la del servidor, la captura pasa a `CONFLICT`; se conservan ambos payloads, se exige revisión humana y no se aplica last-write-wins.

El Runtime continúa leyendo únicamente WorldObjects `PUBLISHED`. Las capturas offline, snapshots y conflictos no son visibles públicamente. Esta cola local es un mecanismo controlado de MVP; no sustituye todavía una sincronización multi-dispositivo certificada ni pruebas de campo en condiciones intermitentes reales.

Validación: TypeScript PASS; `pnpm test -- --run` con 126 archivos aprobados, 1 omitido, 455 pruebas aprobadas y 4 omitidas; build PASS en 10,04 s. Se conserva una advertencia no bloqueante por chunks grandes.


## Addendum — Orden 33: resolución manual y observabilidad de sincronización

La orden 33 añade `CONFLICT_RESOLUTIONS` con cuatro decisiones explícitas: `KEEP_LOCAL`, `KEEP_REMOTE`, `MERGE` y `MARK_DISPUTED`. Solo `EYE_REVIEWER` y `HUMAN_AUTHORITY` pueden resolver un conflicto. Mantener la versión local o combinarla genera una nueva versión `CAPTURED` y un snapshot; mantener la remota conserva el objeto publicado/servidor sin aplicar el payload local; marcar disputa cambia el conocimiento territorial a `DISPUTED`. En todos los casos se conserva el payload del conflicto y se añade `OFFLINE_CONFLICT_RESOLVED` al audit log.

La interfaz de Mapper muestra notificaciones accesibles de éxito, advertencia y error mediante `aria-live`, alerta cuando se detectan divergencias y ofrece un panel lateral de cola. El panel informa el total, progreso, estado individual y decisiones de resolución, sin cerrar ni ocultar conflictos. La sincronización no aplica last-write-wins y los conflictos no pasan al Runtime.

Se separó además `publicationStatus` de `status` en `world_objects`. Una edición o restauración retorna a `CAPTURED` y `UNPUBLISHED`; Runtime exige simultáneamente `status = PUBLISHED` y `publicationStatus = PUBLISHED`. Esto impide que una nueva versión territorial reemplace automáticamente una versión publicada.


## Addendum — Orden 34: cierre técnico y preparación para QA real

La interfaz de cola offline ahora admite los estados `LOCAL_PENDING`, `SYNCING`, `SYNCED`, `CONFLICT` y `SYNC_ERROR`, conservando las capturas fallidas para reintento manual. Los conflictos muestran versión A/local y versión B/remota lado a lado con campos de identificación, coordenadas, descripción, estado y versión. Las resoluciones permitidas continúan siendo explícitas y auditables; no se elimina silenciosamente ninguna versión.

The Eye incorpora una matriz de evidencia con ocho dimensiones: existencia, ubicación, identidad, contenido, fuente, actualidad, evidencia y consistencia. El valor mostrado es un nivel de confianza explicable basado en datos registrados; no equivale a una probabilidad ni certifica la verdad del objeto. `publicationStatus` se mantiene separado de `status`; Runtime exige conocimiento publicado y publicación publicada para la versión actual.

| Prueba | Entorno | Resultado | Evidencia / limitación |
|---|---|---|---|
| TypeScript | Sandbox | PASS | `pnpm exec tsc --noEmit` |
| Vitest | Sandbox | PASS | Suite completa, conteo registrado en checkpoint |
| Build | Sandbox | PASS | Vite/esbuild; warning no bloqueante de chunks grandes |
| Mapper online | Navegador sandbox | PASS parcial | Flujo de UI y mutaciones tipadas; GPS/cámara reales no disponibles |
| Mapper offline | Navegador sandbox | PASS simulado | `localStorage`, reconexión y reintento; no sustituye prueba física |
| Conflicto A/B | Contratos + servidor | PASS controlado | Resolución sin last-write-wins y audit log |
| QA Android/iOS, GPS, cámara | Dispositivo real | PENDIENTE | Requiere hardware, permisos y datos de campo reales |
| Runtime | Sandbox | PASS | Solo `status = PUBLISHED` y `publicationStatus = PUBLISHED` |

No se implementó code-splitting adicional: el build identifica chunks grandes, pero no se ha demostrado todavía que una optimización compense la complejidad en esta fase. La siguiente puerta de calidad es ejecutar el protocolo en dos teléfonos reales y registrar capturas, fotografías, permisos, pérdida de conexión, recuperación y conflicto concurrente.


## Addendum — Orden 35: permisos de campo, historial y mapa operativo

Se añadió un gestor visual de permisos para GPS y cámara. Cada permiso expone estados `No solicitado`, `Solicitando`, `Permitido`, `Denegado` y `No disponible`. Cuando el navegador deniega GPS o cámara, la interfaz explica cómo recuperar el permiso y ofrece rutas alternativas: coordenadas manuales o adjuntar un archivo existente. No se persiste ni se publica automáticamente ningún dato por solicitar un permiso.

La consola territorial conserva un historial local de notificaciones de sincronización y decisiones de conflicto, limitado a 30 eventos y separado de la auditoría server-side. El historial muestra fecha, resultado y texto de la operación; los conflictos siguen requiriendo una decisión explícita y trazable en el servidor.

La vista `Puntos de levantamiento` muestra un mapa esquemático interactivo con marcadores seleccionables, coordenadas, versión, precisión, estado de workflow, estado de sincronización disponible y confidence score explicable. Es una vista operativa de sandbox, no una certificación cartográfica ni una fuente pública. Runtime continúa consumiendo únicamente la versión autorizada y publicada.

El documento 35 solicita QA con dispositivos físicos, dos teléfonos, GPS, cámara, pérdida de conexión, reconexión y conflicto concurrente. Esos escenarios no pueden certificarse desde el sandbox; quedan como gate externo obligatorio antes de declarar la infraestructura lista para UI definitiva.


## Addendum — Orden 36: cartografía real y expediente interactivo

La vista territorial incorpora una capa raster de contexto de OpenStreetMap con atribución visible y mantiene el Google Maps proxy protegido existente para navegación cartográfica cuando el proveedor está disponible. Si la red o el proveedor cartográfico falla, la vista esquemática de sandbox permanece operativa; ningún error de mapas bloquea la captura, la cola offline ni la cadena de publicación.

El mapa permite filtrar por estado de sincronización (`SYNCED`, `SERVER_RECORD`, `PENDING_SYNC`, `CONFLICT`) y por umbral de confidence score explicable (`HIGH`, `MEDIUM`, `LOW`). Los marcadores de ambas vistas son seleccionables y abren un modal accesible con coordenadas, versión, precisión, workflow, sync, Claims, Sources, Evidence y assets asociados. La información se presenta como expediente de revisión, no como certificación automática.

Se añadieron pruebas de contrato para los filtros y la generación determinista de URLs de teselas. La capa cartográfica requiere conexión y sus proveedores deben revisarse para producción: atribución, límites de uso, disponibilidad, privacidad, coste y política de caché. La prueba real de GPS/cámara y el piloto físico de Trujillo continúan siendo gates externos.


## Addendum — Tres mejoras de operación territorial

La vista de levantamientos incorpora un botón explícito **Centrar GPS** que solicita `navigator.geolocation` solo por acción del usuario, utiliza alta precisión con timeout de 10 segundos y muestra mensajes de éxito o recuperación cuando el permiso es denegado, el navegador no ofrece GPS o la consulta falla. La ubicación se usa únicamente para recentrar el mapa; no crea ni publica WorldObjects por sí sola.

Los puntos cercanos se agrupan determinísticamente por una cuadrícula de tres decimales, conservando los miembros originales y mostrando el conteo del grupo en la cartografía proxy y en la vista esquemática. Los filtros de sync y confianza se aplican antes de agrupar para evitar mezclar estados que el operador haya ocultado.

La superficie se validó visualmente en un viewport móvil de 390×844 y mantiene controles apilables, botones táctiles y fallback esquemático. Esto no sustituye las pruebas físicas en Android/iOS ni certifica permisos de cámara/GPS en dispositivos reales. MJP CORE permanece fuera del dominio territorial y sin rutas de acceso.


## Addendum — Tres tareas operativas posteriores

El clustering del mapa ahora depende del zoom: con zoom bajo agrupa por dos decimales, con zoom medio por tres y con zoom alto por cuatro. Al aumentar el zoom se desagregan progresivamente los puntos cercanos; cada grupo conserva sus registros y el clic abre el primer expediente asociado sin alterar estados.

La vista esquemática incorpora navegación offline controlada mediante desplazamiento por flechas y zoom, con etiqueta explícita `Offline`. No intenta simular tiles ni afirma disponibilidad de cartografía externa; funciona como fallback operativo para revisar posiciones ya guardadas cuando no hay red.

El botón de GPS usa la API del navegador únicamente tras acción explícita. El protocolo móvil recomendado es: abrir la ruta por HTTPS, conceder GPS, verificar precisión y mensaje de centrado, denegar GPS y confirmar el mensaje de recuperación, repetir en orientación vertical y horizontal, y revisar que los datos no se publiquen automáticamente. Android e iOS reales no están disponibles en el sandbox, por lo que su certificación permanece como prueba externa.


## Addendum — Operación cartográfica móvil y offline

La cartografía real reporta zoom y límites del viewport al dominio territorial. Los puntos se filtran por esos límites antes de agruparse y la precisión del clustering aumenta en niveles de zoom altos. El cambio de zoom controlado se sincroniza con la instancia cartográfica cuando el proveedor está disponible.

Se añadió una caché local opcional, limitada a 1 MB y 1.000 registros, que requiere consentimiento explícito. Solo almacena registros territoriales seleccionados; no descarga ni guarda teselas de terceros. El modo offline se identifica claramente y ofrece controles de desplazamiento y zoom sobre la vista esquemática, sin afirmar cobertura cartográfica.

El protocolo Android/iOS exige HTTPS, permiso explícito, comprobación de precisión, prueba de denegación y recuperación, y revisión en orientaciones vertical y horizontal. El sandbox valida código, contratos y responsive; no sustituye la prueba en hardware real.


## Addendum — Orden 37: cierre de infraestructura y gate de campo

La interfaz territorial incorpora el panel interactivo **TRUJILLO — PILOTO 001** para ejecutar una prueba física en dos dispositivos: Mapper en el dispositivo A, The Eye/Human Authority en el dispositivo B, permisos GPS/cámara, captura offline, verificación, conflicto/publicación y registro de resultado. El panel permite anotar dispositivos, severidad y observaciones; no certifica hardware desde el sandbox.

`MapView` trabaja detrás de `MapProviderAdapter`, con el Google Maps proxy como proveedor concreto y fallback esquemático cuando el proveedor no carga. El contexto raster de OpenStreetMap mantiene atribución visible. Los marcadores siguen filtrándose por viewport y zoom.

La descarga de mapas offline requiere consentimiento explícito, se limita a una zona de hasta nueve teselas alrededor del centro filtrado, usa Cache Storage y un service worker específico, y muestra progreso/errores. No se descargan teselas sin consentimiento ni se afirma cobertura offline si el proveedor no responde. Las credenciales permanecen en variables de entorno.

Validación sandbox de esta orden: TypeScript PASS, suite completa PASS y build PASS. El gate físico sigue pendiente para validar GPS, cámara, conectividad, permisos, rendimiento, almacenamiento y usabilidad en Android/iOS reales. La decisión técnica es **READY FOR FIELD GATE**, no “100 % robusto”. MJP CORE no fue modificado.


## Addendum — Registro físico, HTTPS y zonas offline poligonales

El protocolo de campo ahora conserva hasta veinte reportes locales en `localStorage`, con identificador, dispositivos A/B, severidad, observaciones, fecha y estado individual `PENDING`, `PASS`, `FAIL` o `BLOCKED` para cada paso. El registro es una ayuda operativa del gate humano; no sustituye auditoría server-side ni certifica un dispositivo.

El gestor GPS/cámara comprueba `window.isSecureContext` antes de solicitar permisos. En producción exige HTTPS; en desarrollo se admite el contexto seguro de localhost. Cuando el navegador deniega o no soporta una API, la interfaz explica cómo recuperar el permiso o continuar con coordenadas/archivos manuales.

La cartografía esquemática permite activar `Dibujar zona`, añadir de tres a ocho vértices, revisar cuántos puntos quedan dentro, limpiar el trazado y descargar como máximo veinticinco teselas OSM del bounding box seleccionado. La descarga sigue requiriendo consentimiento explícito, límite de zoom y Cache Storage/service worker. El polígono se usa como selección operativa acotada; la cobertura offline no se presenta como garantía de navegación cartográfica completa.

Validación sandbox: pruebas específicas 8/8 PASS; suite completa 132 archivos PASS y 1 omitido, 473 pruebas PASS y 4 omitidas; build PASS en 10,87 s, con advertencia no bloqueante de chunks grandes. La validación física Android/iOS y la descarga en campo requieren dispositivos reales y conectividad controlada. MJP CORE permanece intacto.


## Addendum — Orden 38: manuales operativos y resultados de campo

Se implementó `TerritorialManuals.tsx` como centro interactivo de operación con dos recorridos: **MiLukita Mapper** y **The Eye**. Cada recorrido contiene introducción, pasos secuenciales, ayudas de operación, FAQ, límites del sandbox y descargo de autoridad. También se generaron los documentos `MILUKITA_MAPPER_MANUAL_1.0.md` y `THE_EYE_MANUAL_1.0.md`. El endpoint protegido `territorial.exportManual` genera el PDF descargable del manual seleccionado.

La edición de vértices del polígono offline queda integrada con el selector de zona existente. Los reportes del protocolo físico se guardan localmente, se envían al servidor al guardar si existe conectividad y se reintentan automáticamente al recuperar el evento `online`; la persistencia server-side conserva hash SHA-256 e idempotencia por `publicId`. La vista ofrece exportación CSV y PDF del registro completo.

La validación final ejecutó TypeScript, Vitest y build de producción con resultado PASS. El proveedor de PDF, GPS, cámara, mapas y la certificación física real siguen sujetos a sus gates externos. MJP CORE no fue modificado.


## Addendum — Orden 39: acceso móvil y criterios de cierre

La superficie territorial dispone ahora de los alias `/mapper` y `/the-eye`, que reutilizan la misma implementación de `TerritorialTrustPage` y no crean sistemas paralelos. Ambos accesos mantienen autenticación, RBAC, rate limiting y autorización server-side; ningún QR o URL contiene credenciales ni tokens permanentes. La aplicación separa Mapper y The Eye mediante funciones y permisos, aunque comparten la cadena territorial existente.

El documento 39 se considera técnicamente cubierto en sandbox/preview para captura, CaptureSession, WorldObject, evidencia, offline, sync, conflictos, The Eye, publicación versionada y Runtime restringido a `PUBLISHED`. La categoría **PROBADO EN DISPOSITIVO REAL** permanece pendiente hasta ejecutar la salida de campo en Android/iOS con GPS, cámara, conexión intermitente y QR físico. Estado recomendado: **READY FOR FIELD GATE**, no certificación productiva.

## Addendum — Orden 41: análisis filtrado y reporte PDF del piloto

El panel de Field Operations MVP incorpora filtros por rango de fecha UTC inclusivo y búsqueda por tipo o modelo en cualquiera de los dos dispositivos registrados. La interfaz recalcula sobre el subconjunto visible el número de reportes, sincronizaciones exitosas y errores; los contadores generales de WorldObjects y evidencias mantienen su alcance territorial y no se presentan como métricas del filtro de reportes.

La exportación **Métricas del piloto** se ejecuta mediante un procedimiento administrativo server-side con los mismos filtros y genera un PDF corporativo que incluye fecha de generación, rango, dispositivo, reportes, sincronizados, bloqueos y pasos completados. La subida de fotografías comunica éxito o error mediante `role=status` y `aria-live`; los assets mantienen asociación al WorldObject, RBAC y S3 protegido. El PDF resume registros persistidos y no certifica hardware, GPS, cámara ni producción. MJP CORE no fue modificado.

Validación de la orden 41: TypeScript PASS; Vitest PASS; build PASS en 9,95 s; revisión visual de `/mapper-the-eye` en página completa. La advertencia de chunks grandes continúa siendo no bloqueante.

## Addendum — Orden 41: análisis filtrado y reporte PDF del piloto

El panel de Field Operations MVP incorpora filtros por rango de fecha UTC inclusivo y búsqueda por tipo o modelo en cualquiera de los dos dispositivos registrados. La interfaz recalcula sobre el subconjunto visible el número de reportes, sincronizaciones exitosas y errores; los contadores generales de WorldObjects y evidencias mantienen su alcance territorial y no se presentan como métricas del filtro de reportes.

La exportación **Métricas del piloto** se ejecuta mediante un procedimiento administrativo server-side con los mismos filtros y genera un PDF corporativo que incluye fecha de generación, rango, dispositivo, reportes, sincronizados, bloqueos y pasos completados. La subida de evidencia fotográfica comunica éxito o error mediante `role=status` y `aria-live`; los assets mantienen asociación al WorldObject, RBAC y S3 protegido. El PDF resume registros persistidos y no certifica hardware, GPS, cámara ni producción. MJP CORE no fue modificado.

Validación de la orden 41: TypeScript PASS; Vitest PASS; build PASS en 9,95 s; revisión visual de `/mapper-the-eye` en página completa. La advertencia de chunks grandes continúa siendo no bloqueante.


## Addendum — Orden 42: observabilidad visual y exportación CSV

La consola del piloto incorpora una galería de evidencias basada únicamente en assets S3 con URL de previsualización autorizada. Cada miniatura abre un modal accesible con nombre, WorldObject y publicId; si no existe una URL apta, la interfaz lo declara sin fabricar contenido.

Se añadió un timeline SVG interactivo de los reportes filtrados por fecha y dispositivo. Sus puntos distinguen `SYNCED`, estados pendientes y `SYNC_ERROR`, y exponen publicId, estado y fecha mediante título accesible. La gráfica representa datos persistidos del MVP y no telemetría certificada de hardware en tiempo real.

La exportación CSV se realiza mediante mutación tRPC protegida, aplicando los filtros server-side antes de producir el archivo. El PDF corporativo existente conserva su alcance y advertencias. El Field Voice Copilot continúa separado como capacidad futura no activada en esta iteración; no se declara implementado por ausencia de un flujo de voz completo validado.

## Addendum de la orden 43 — optimización y verificación

La galería de evidencias del piloto ahora permite filtrar por fecha de carga y por categoría derivada de `assetType`/`category`, mostrando el subconjunto frente al total. Los assets siguen procediendo de WorldObjects persistidos y la vista previa continúa protegida por la ruta administrativa; si un asset no tiene fecha verificable, no se incluye en un filtro de fecha.

Field Voice Copilot incorpora una barra de progreso accesible para las etapas de escucha, recepción y procesamiento. La capacidad de voz sigue dependiendo del reconocimiento nativo del navegador; si no está disponible, el operador puede escribir manualmente. La observación dictada se conserva con la marca `DICTADO · PENDIENTE DE VERIFICACIÓN` y no puede publicar ni autorizar conocimiento territorial.

`MapView` se carga mediante `React.lazy`/`Suspense` y Three.js junto con `OrbitControls`, `GLTFLoader` y `ARButton` se importan bajo demanda al montar Lukita AR Stage. Rollup separa el core y los addons de Three.js. El core 3D continúa siendo pesado por naturaleza, por lo que se configuró un umbral explícito de advertencia; la mejora relevante es que ya no forma parte de la carga inicial de las rutas públicas.

La verificación del generador confirmó que la variante `round` recibe la matriz QR real y genera módulos y patrones de búsqueda circulares; no compone un QR cuadrado con un círculo superpuesto. La variante `square` permanece disponible como opción independiente. Las pruebas cubren la diferencia round/square, payload compartido, arco temporal verde-amarillo-naranja-rojo y nombres seguros de descarga. Esto valida el SVG generado, pero no certifica el escaneo en una cámara física.

El documento adjunto exige además auditoría general, E2E, persistencia, RBAC, Human Authority, integridad de MJP CORE y validación física. La implementación existente conserva esas capas con sus respectivos contratos y tests, pero los gates de Android/iOS reales, GPS, cámara, micrófono, offline móvil, QR físico, HTTPS productivo y proveedores cartográficos continúan clasificados como `EXTERNAL_REQUIRED` o `NOT_VERIFIED` cuando no existe evidencia de dispositivo. No se declara validación física por haber ejecutado únicamente sandbox.


## Addendum de la orden 44 — UX del QR y Field Voice Copilot

El QR Studio incorpora un botón de compartir que usa `navigator.share` cuando el dispositivo admite compartir archivos. El archivo compartido es el SVG generado con la forma activa —redonda o cuadrada— y un nombre seguro; en navegadores sin Web Share se ejecuta un fallback de descarga y se informa al usuario. La descarga SVG/PNG y las variantes con marco permanecen disponibles. La verificación de geometría round continúa basada en la matriz QR, módulos circulares y patrones de búsqueda circulares; compartir no cambia el payload.

Field Voice Copilot muestra mensajes contextuales junto al porcentaje de progreso: `Escuchando audio…`, `Procesando audio…`, `Analizando observación…`, `Voz no disponible · usa texto manual` y `No se pudo procesar · usa texto manual`. El reconocimiento sigue siendo una capacidad nativa del navegador y la observación conserva su marca pendiente de verificación humana.

La galería S3 añade una búsqueda de texto libre combinable con fecha y categoría. La consulta se aplica sobre nombre de archivo, nombre de WorldObject, publicId y categoría, sin ampliar el alcance de los assets ni exponer evidencias no autorizadas.

Validación focalizada de la orden 44: TypeScript PASS; `customQrGenerator.test.ts` y `fieldGateReports.filters.test.ts`, 12 tests PASS. El build y la suite general deben considerarse junto con la validación registrada en el checkpoint anterior. La prueba de compartir depende de capacidades del navegador y la validación de escaneo QR físico continúa como `EXTERNAL_REQUIRED`.


## Addendum de la orden 45 — personalización y control de captura

El QR Studio permite personalizar el color de acento, fondo y módulos del QR, además de cargar un logotipo central procesado localmente. La composición redonda conserva módulos y patrones de búsqueda circulares; la personalización se refleja en la previsualización y en las descargas SVG/PNG sin modificar el payload ni ninguna autoridad de MJP CORE. Los presets guardan también el color de módulos para conservar la identidad visual elegida.

El Field Voice Copilot ahora permite cancelar tanto la escucha como el procesamiento posterior. La cancelación aborta el reconocimiento disponible, limpia el temporizador de procesamiento, restablece el progreso y deja intacta la entrada manual. No se persiste una observación parcial como si fuese verificada.

La galería protegida de evidencias presenta una vista previa ampliada en modal al seleccionar una imagen, con cierre por botón o por el fondo, metadatos del archivo y del WorldObject, sin descargar automáticamente el asset.

Validación de la orden 45: TypeScript PASS; suite completa con 134 archivos aprobados y 1 omitido; 480 tests aprobados y 4 omitidos; build PASS. Se añadió cobertura para módulo de color, logo central y composición round sin rectángulos. La prueba de Web Share y escaneo físico continúa dependiendo de capacidades y cámaras reales del dispositivo.
