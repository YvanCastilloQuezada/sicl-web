# ORDEN MAESTRA 54 — Ingeniería inversa completa de MiLukita

**Autor:** Manus AI  
**Fecha de corte:** 2026-09-06  
**Proyecto auditado:** `ruleta-peru-online`  
**Alcance:** análisis, ingeniería inversa, documentación y mapa de realidad.  
**Regla aplicada:** durante esta auditoría no se modifican archivos de código, assets, configuración, dependencias, SQL, migraciones, despliegue ni MJP CORE.

> Este documento describe lo que puede demostrarse en el repositorio. No convierte una interfaz, una prueba unitaria o una ruta existente en una capacidad operativa de producción. Las conclusiones están etiquetadas como **IMPLEMENTADO**, **DOCUMENTADO**, **VISUAL/SIMULADO**, **NO_VERIFICADO**, **REQUIERE_HUMANO** o **EXTERNAL_REQUIRED**.

## 1. Dictamen ejecutivo

MiLukita es un proyecto fullstack React/TypeScript + Vite + Express + tRPC + Drizzle/MySQL/TiDB que contiene dos capas muy diferentes. La primera es el producto histórico de entretenimiento virtual —ruleta, jackpot, bingo, lotería, billetera virtual, comprobantes, TV y gobernanza operativa—. La segunda es el ecosistema territorial LUKA/MiLukita: Portal, QR, LUKA AR, Mapper, The Eye, Controller Lab, Field Gate, evidencia, offline y publicación humana.

La base técnica contiene una cantidad considerable de contratos, servicios, tablas y pruebas. Esto permite afirmar **IMPLEMENTADO** para varios flujos server-side y de gobernanza. Sin embargo, la existencia de código no prueba que la experiencia visual sea equivalente a las maquetas ni que los accesos públicos estén certificados en dispositivos reales. La revisión anterior del navegador mostró una separación importante entre el código local, la versión publicada, el Service Worker y la experiencia visible. Por ello, el estado correcto no es “producto terminado”, sino **CODE_READY_WITH_EXTERNAL_GATES**.

La capa territorial sí tiene una arquitectura coherente: captura, evidencia, claims, sources, revisión, snapshot, hash, offline, conflicto y publicación. El backend restringe la publicación a **HUMAN_AUTHORITY**, conserva snapshots y encadena auditoría SHA-256. El frontend, en cambio, debe evaluarse como una superficie separada: las rutas públicas, la entrada autenticada, los paneles de campo y las maquetas de Controller Lab no son la misma cosa.

MJP CORE está protegido por contratos y pruebas de aislamiento. En [1] se declara la frontera `MJP_CORE`, `RNG`, `RTP`, `WALLET`, `LEDGER`, `SETTLEMENT`, `RULES` y `MjpTvManifest`; los agentes no pueden mutarla y el manifest se proyecta como lectura. Esta evidencia no autoriza afirmar que todos los escenarios de producción estén probados; demuestra que existe una barrera contractual automatizada.

## 2. Convenciones de clasificación

| Etiqueta | Uso en este informe |
|---|---|
| **IMPLEMENTADO** | Existe código ejecutable o persistencia identificable en el repositorio. |
| **DOCUMENTADO** | Existe contrato, manual o especificación, pero no necesariamente implementación completa. |
| **VISUAL/SIMULADO** | Existe interfaz, fixture, preview o simulador sin integración operacional completa. |
| **NO_VERIFICADO** | El repositorio permite inferir la intención, pero no se comprobó el comportamiento requerido. |
| **REQUIERE_HUMANO** | La decisión o aprobación pertenece a una persona con autoridad. |
| **EXTERNAL_REQUIRED** | Depende de hardware, permisos, HTTPS, dominio, proveedor, dispositivo o red real. |

## 3. Fuente de verdad e inventario

La aplicación se inicia mediante `client/src/App.tsx`, que define rutas públicas, rutas territoriales, QR, Controller Lab, TV y LUKA AR. El proyecto usa React 19, TypeScript, Vite, Tailwind, tRPC 11, Express 4, Drizzle ORM, MySQL/TiDB, Three.js, QRCode, PDFKit, WebSocket y almacenamiento S3. La fuente operativa de scripts y dependencias es [2].

| Área | Evidencia primaria | Estado de la evidencia |
|---|---|---|
| Ruteo frontend | `client/src/App.tsx` | IMPLEMENTADO como rutas React; disponibilidad pública requiere verificación externa. |
| Auth base | `server/_core/oauth.ts`, `server/_core/context.ts`, `client/src/_core/hooks/useAuth.ts` | IMPLEMENTADO en infraestructura; flujo físico requiere prueba de navegador. |
| API | `server/routers.ts` y módulos server-side | IMPLEMENTADO como contratos tRPC protegidos. |
| Persistencia | `drizzle/schema.ts` | IMPLEMENTADO como modelo Drizzle; estado de base desplegada requiere comprobar entorno. |
| Territorio | `server/territorialTrust.ts`, `shared/territorialTrust.ts` | IMPLEMENTADO en captura, revisión, publicación y offline. |
| QR | `client/src/pages/QrGeneratorPage.tsx`, `client/src/lib/customQrGenerator.ts`, `shared/circularQr.ts` | IMPLEMENTADO como generador y proyección visual; escaneo real EXTERNAL_REQUIRED. |
| AR | `client/src/pages/LukitaARStagePage.tsx`, contrato AR y asset GLB | IMPLEMENTADO como visor/prototipo; WebXR, cámara y GLB definitivo EXTERNAL_REQUIRED. |
| Controller Lab | `client/src/pages/TouchRemotePage.tsx`, `shared/controllerLab.ts`, tablas `controller_*` | IMPLEMENTADO como laboratorio/controlador; integración real con TV NO_VERIFICADO o EXTERNAL_REQUIRED. |
| TV | `shared/tvManifest.ts`, `client/src/pages/BroadcastPage.tsx`, `OnlineTvGamesPage.tsx` | Hay contrato y simulación; Cast/DLNA real no queda probado por el repositorio. |
| Auditoría | `server/territorialTrust.ts`, `auditEvents`, informes Markdown | IMPLEMENTADO en cadena territorial; auditoría completa de despliegue REQUIERE_HUMANO. |
| Manuales | `docs/`, protocolos e informes | DOCUMENTADO; legibilidad profesional debe revisarse como entregable separado. |

## 4. Qué es MiLukita

MiLukita aparece en el código como una marca/ecosistema que agrupa identidad, sesiones, dispositivos, contexto de evento, participación, consentimiento, entretenimiento, territorio, control remoto, AR, TV y gobernanza. No es una sola página ni un único servicio. La tabla `milukita_identities` modela identidad pública y estado de verificación; `milukita_devices` y `milukita_sessions` modelan dispositivos y sesiones; `milukita_event_contexts` y `milukita_participation_sessions` modelan contexto y participación.

**LUKA** se presenta en el proyecto como identidad/experiencia protagonista y como entrada a experiencias AR/territoriales. No se demuestra que sea una entidad autónoma con autoridad sobre resultados. En la arquitectura de gobierno, los agentes y experiencias están limitados por contratos y por la frontera de MJP CORE.

**LUKA OS** es una denominación arquitectónica/conceptual que agrupa experiencias y módulos. **LUKA AR** es el visor 3D/WebXR con GPS, referencia visual, carga de GLB, placeholder y controles. **LUKA TV** es la experiencia de televisión, reproducción y navegación; su conexión real a Cast/DLNA no queda confirmada. **LUKA CONNECT** es una idea/agrupación de conectividad que se materializa parcialmente en sesiones Controller Lab y WebSocket, no una prueba de interoperabilidad universal.

**Mapper** es el actor/superficie de captura territorial. **The Eye** es el actor/superficie de revisión. La separación de roles está en `MAPPER_ROLES` y en `requireTerritorialRole`. **WorldObject**, Claims, Sources, Evidence, CaptureSession, Snapshot y OfflineCapture son entidades/procesos verificables en código. **Field Gate** es un protocolo operativo de validación física; su ejecución real depende de personas y dispositivos.

**QR** es un mecanismo de acceso/contexto. El contrato circular declara que una variante puede proyectar una imagen, matriz, payload, URL destino, URL de verificación, expiración, firma y disponibilidad; la función `getCircularQrPresentation` es explícitamente de presentación y no cambia el payload [3]. **L★** es un emblema/entrada visual en la portada; no es por sí mismo un sistema de autorización.

**Voice/Copilot** existe como flujo guiado de reconocimiento, estados de escucha/procesamiento/análisis y fallback; la transcripción y calidad de reconocimiento dependen del navegador y del micrófono. No debe considerarse autoridad de publicación ni autoridad de MJP CORE.

## 5. Organigrama funcional y tecnológico

| Capa | Elementos observables | Autoridad real |
|---|---|---|
| Gobierno | Human Authority, auditoría, contratos canónicos, límites MJP CORE | Human Authority decide publicación territorial; MJP CORE conserva autoridad sobre sus dominios. |
| Dirección/producto | Portal, LUKA, experiencias AR/TV, QR, Field Gate | PROPUESTA/EXPERIENCIA; no sustituye autoridades server-side. |
| Operaciones | Mapper Operator, Eye Reviewer, Control Room, Field Operations | Procedimientos protegidos por auth/RBAC. |
| Producto | Portal, QR Lab, LUKA AR, LUKA TV, Controller Lab | Mezcla de IMPLEMENTADO y VISUAL/SIMULADO según módulo. |
| Tecnología | React, Vite, Express, tRPC, Drizzle, S3, WebSocket, Three.js, Service Worker | IMPLEMENTADO como infraestructura del proyecto. |
| Datos | users, identities, sessions, worldObjects, claims, sources, evidence, snapshots, offline captures, audit events | IMPLEMENTADO en schema y servicios; datos reales de producción NO_VERIFICADOS. |
| IA/agentes | Agent Registry, Auditor, Watchdog, Recovery, Legal/Compliance, Supervisor y otros contratos | Contratos/tests y lógica parcial; autoridad sobre MJP CORE prohibida. |
| Territorio | World Engine, Mapper, The Eye, Field Gate, mapa, GPS, evidencia | IMPLEMENTADO en backend; campo físico EXTERNAL_REQUIRED. |
| Seguridad | Auth, RBAC, scopes de asset, hashes, audit chain, rate/security tests | IMPLEMENTADO en varios límites; configuración productiva requiere revisión. |
| Sistemas externos | Manus OAuth, S3, OpenStreetMap/Google proxy, navegador APIs, WebXR, Cast/DLNA | EXTERNAL_REQUIRED o NO_VERIFICADO según integración. |

### Agentes

El registro de agentes y las pruebas de gobierno establecen modos restrictivos como `READ_ONLY`, `ALERT_ONLY`, `PROPOSE_ONLY` y `PROJECTION_ONLY`. Un agente puede leer, alertar o proponer; no puede sobrescribir RNG, resultados, RTP, wallet, ledger, settlement, reglas ni `MjpTvManifest`. La existencia de un test de frontera no significa que cada agente tenga una operación productiva independiente; varios son contratos de gobernanza y readiness.

## 6. Arquitectura maestra reconstruida

La arquitectura observable puede resumirse así:

```text
Usuario / dispositivo
        ↓
Portal / QR / Controller / Mapper / The Eye / AR / TV
        ↓
React + Router + Auth + Theme + Network Status
        ↓
tRPC client
        ↓
Express + tRPC routers + protected/admin procedures
        ↓
Servicios de dominio
  - territorialTrust
  - fieldGateReports
  - controller/session/commands
  - identity/sessions
  - games/wallet/markets/TV
        ↓
Drizzle ORM
        ↓
MySQL/TiDB + S3 + audit events
        ↓
Runtime publicado o interfaz de revisión
```

El límite territorial CAPTURE → VERIFY → PUBLISH está implementado de forma explícita. `createTerritorialObject` exige `MAPPER_OPERATOR`; `reviewTerritorialObject` exige `EYE_REVIEWER`; `publishTerritorialObject` exige `HUMAN_AUTHORITY`. La publicación requiere estado `VERIFIED`, score positivo, evidencia y fuente. El runtime solo lista objetos con estado y publicationStatus `PUBLISHED` [4].

La auditoría territorial construye `eventHash` a partir del hash anterior, evento, entidad, identificador y payload. El snapshot calcula `snapshotHash` sobre su estado serializado. Esto proporciona una cadena técnica de integridad, pero la auditoría debe comprobar en un entorno con datos reales que no existan saltos, reordenamientos o escrituras fuera del servicio.

## 7. Mapa de módulos

| Módulo | Archivos principales | Estado real | Dependencias y límites |
|---|---|---|---|
| Portal | `Home.tsx`, `App.tsx`, assets de marca | IMPLEMENTADO como portada | La calidad visual depende del asset y CSS servido; no implica identidad final aprobada. |
| L★ / QR | `QrGeneratorPage.tsx`, `customQrGenerator.ts`, `circularQr.ts` | IMPLEMENTADO como generador/presentación | URL pública, firma, expiración y escaneo real requieren validación externa. |
| QR Lab | `QrGeneratorPage.tsx`, presets/localStorage, QRCode | IMPLEMENTADO como laboratorio frontend | No equivale a un backend de campañas o distribución. |
| Mapper | `TerritorialFieldEntryPage.tsx`, `TerritorialTrustPage.tsx`, Field Tools | IMPLEMENTADO con RBAC y captura | GPS/cámara, datos reales y permiso móvil EXTERNAL_REQUIRED. |
| The Eye | misma superficie con `surface="the-eye"`, revisión backend | IMPLEMENTADO como revisión protegida | La autoridad final pertenece a Human Authority. |
| Controller Lab | `TouchRemotePage.tsx`, `controllerLab.ts`, `controller_*` | IMPLEMENTADO como laboratorio/simulador | Control real de TV requiere sesión y receptor integrados; no se infiere del render. |
| LUKA AR | `LukitaARStagePage.tsx`, Three.js addons, GLB | IMPLEMENTADO como prototipo WebXR/fallback | WebXR, cámara, plano, modelo final y rendimiento físico EXTERNAL_REQUIRED. |
| World Engine | `worldObjects`, `territorialTrust.ts`, shared contracts | IMPLEMENTADO en trust territorial | Publicación separada de runtime. |
| WorldPoints | Concepto de puntos/objetos y geodatos | PARCIAL/INFERIDO según uso | No todas las denominaciones conceptuales tienen entidad independiente. |
| Field Gate | reports, manuals, sync, export | IMPLEMENTADO como protocolo y persistencia | La primera muestra física aún requiere humano y hardware. |
| Voice Copilot | `TerritorialPilotConsole.tsx`, Web Speech/voice flow | VISUAL/IMPLEMENTADO PARCIAL | Calidad, permisos y precisión real del audio NO_VERIFICADOS. |
| LUKA TV | `BroadcastPage`, `OnlineTvGamesPage`, TV contracts | VISUAL/SIMULADO + contratos | Cast/DLNA de producción EXTERNAL_REQUIRED. |
| Identity/Auth | `users`, OAuth, identity/session tables | IMPLEMENTADO | Proveedor, dominio y sesión real dependen de entorno. |
| RBAC | users role, controller roles, territorial assignments | IMPLEMENTADO | Debe comprobarse asignación productiva y principio de mínimo privilegio. |
| Audit | `auditEvents`, chain hashes, reports | IMPLEMENTADO en dominios cubiertos | No implica auditoría universal de cada UI event. |
| Analytics | beacon, metrics tables, operational reports | IMPLEMENTADO PARCIAL | Métricas de producto y retención no equivalen a evidencia territorial. |
| MJP CORE | game rules, rounds, wallet, ledger, manifest | PROTEGIDO/IMPLEMENTADO | No debe ser mutado por territorial, agents, controller o AR. |

## 8. Modelo de datos

El schema contiene el núcleo de autenticación (`users`), identidades y dispositivos (`milukitaIdentities`, `milukitaDevices`, `milukitaSessions`), contexto y participación (`milukitaEventContexts`, `milukitaParticipationSessions`, `milukitaConsents`), juegos (`gameRulesets`, `gameRounds`, tickets, wallet y movimientos), sesiones Controller (`controllerSessions`, `controllerCommands`, `controllerSharedProfiles`), auditoría/operaciones, agentes, TV, QR y la pila territorial.

La pila territorial verificable está compuesta por:

| Entidad | Función | Campos/propiedades relevantes |
|---|---|---|
| `territorial_capture_sessions` | Agrupa levantamientos | publicId, territorio, mapper, status, sync, área, timestamps. |
| `world_objects` | Representa un lugar/objeto territorial | publicId, tipo, nombre, descripción, lat/lng, precisión, estado, publicationStatus, score, versión. |
| `territorial_claims` | Afirmaciones sobre el objeto | texto, tipo, observaciones, autor, verificación. |
| `territorial_sources` | Fuentes de respaldo | institución/persona, tipo, URL/documento, autoridad, fecha. |
| `territorial_evidence` | Evidencia vinculada a claims/objeto | tipo, origen, fecha, responsable, integrityHash, metadata. |
| `territorial_assets` | Bytes/metadata almacenados en S3 | key/url, mime, tamaño, hash, scope. |
| `territorial_verification_reviews` | Decisión The Eye | decisión, evidencia revisada, versión aprobada, razón. |
| `territorial_role_assignments` | RBAC Mapper/The Eye/HA | usuario, rol, asignador, timestamps. |
| `territorial_world_object_snapshots` | Restauración no destructiva | versión, stateJson, snapshotHash, autor. |
| `territorial_offline_captures` | Cola server-side offline | clientCaptureId, fingerprint, payload, status, conflictJson, sync. |
| `territorial_field_reports` | Resultados de prueba física | dispositivo, pasos, severidad, observaciones, estado de sync. |
| `audit_events` | Cadena de auditoría | previousHash, eventHash, actor, entidad, payload. |

## 9. Roles, permisos y autoridad

| Actor | Puede leer | Puede modificar | No puede hacer |
|---|---|---|---|
| Visitor/User | Portal y superficies públicas según ruta | Preferencias locales/inputs locales | No puede publicar territorio ni mutar MJP CORE. |
| Mapper Operator | Sesiones, objetos propios/territoriales permitidos, evidencia | Crear/editar capturas, claims, evidencia, offline queue | No puede verificar/publicar. |
| Eye Reviewer | Expedientes, claims, sources, evidence, conflictos | Revisar, solicitar evidencia, verificar, disputar, resolver conflictos según procedimiento | No publica runtime. |
| Human Authority | Expediente y decisiones de gobierno | Asignar rol, restaurar, publicar, aprobar | No delega su autoridad automáticamente a agentes. |
| Admin base | Infraestructura de usuario según `users.role` | Gestión administrativa general | No se debe asumir que admin equivale a autoridad territorial salvo el fallback explícito de `requireTerritorialRole`. |
| Controller User | Control según sesión/rol | Enviar comandos permitidos | No puede acceder a RNG, resultados, reglas, wallet, ledger, settlement o manifest. |
| Agentes IA | Depende del modo registrado | Lectura/alerta/propuesta/proyección | Mutar dominios protegidos. |
| Runtime | Solo objetos publicados | Ninguno | No muestra objetos no publicados. |

## 10. Flujos reconstruidos

### 10.1 Captura territorial

El Mapper entra por `/mapper`, se autentica y alcanza `TerritorialTrustPage` en superficie Mapper. Crea o usa una CaptureSession, captura nombre/tipo/ubicación/precisión/geometría, incorpora claims/evidencia y puede conservar datos localmente si está offline. El objeto nace `CAPTURED`, `UNPUBLISHED`, con versión y snapshot. Cada acción relevante añade auditoría. Estado: IMPLEMENTADO en código; permisos de GPS/cámara y muestra real: EXTERNAL_REQUIRED.

### 10.2 Revisión The Eye

The Eye entra por `/the-eye`, se autentica, carga expedientes y contrasta claims, fuentes, evidencias y score. La revisión puede solicitar evidencia, verificar, disputar, rechazar o archivar, siempre dentro de transiciones permitidas. Estado: IMPLEMENTADO en backend y UI; calidad de revisión humana: REQUIERE_HUMANO.

### 10.3 Publicación

Human Authority verifica que el objeto esté `VERIFIED`, tenga score, evidencia y fuente; luego marca `PUBLISHED` y `publicationStatus=PUBLISHED`. Solo entonces `listPublishedTerritorialObjects` lo expone al runtime. Esto es un gate real server-side, no una promesa editorial.

### 10.4 Offline y conflicto

El cliente guarda cola local y puede enviar un payload al backend. El backend detecta si `baseVersion` difiere de la versión remota. En conflicto conserva el expediente y exige resolución `KEEP_LOCAL`, `KEEP_REMOTE`, `MERGE` o `MARK_DISPUTED`. No existe last-write-wins silencioso en este flujo. Sin embargo, la disponibilidad completa depende del Service Worker, almacenamiento del navegador y conectividad de cada dispositivo.

### 10.5 QR

El generador produce un payload y una representación. La variante circular puede ser `central`, `circle` o `integrated`; la presentación no modifica el payload. La parte auditable es la URL/payload/hash/expiración. La capacidad de escaneo en una TV o celular específico depende de contraste, tamaño, cámara, iluminación y URL pública accesible.

### 10.6 LUKA AR

La página carga Three.js y addons bajo demanda, intenta cargar un GLB, permite fallback visual/placeholder y tiene controles de referencia/GLB local según las últimas iteraciones. WebXR, cámara, detección de plano, escala, iluminación y compatibilidad de GLB dependen del navegador/dispositivo. Por tanto el visor es IMPLEMENTADO como prototipo y EXTERNAL_REQUIRED como producto AR certificado.

### 10.7 Controller/TV

Controller Lab modela sesiones, roles, comandos, modos y perfiles. El frontend contiene Game Pad, Trackpad, Keyboard y AR/TV surfaces. La base de datos registra sesiones y comandos. No se debe confundir esto con la integración universal de un televisor: el receptor, Cast/DLNA, permisos, red local, latencia y comandos compatibles requieren prueba EXTERNAL_REQUIRED.

## 11. Máquinas de estado observables

| Máquina | Estados/decisiones verificables |
|---|---|
| WorldObject | DRAFT → CAPTURED → UNDER_REVIEW/EVIDENCE_REQUIRED → VERIFIED → PUBLISHED; también DISPUTED, OUTDATED, REJECTED, ARCHIVED. |
| Claim | UNVERIFIED, UNDER_REVIEW, VERIFIED, DISPUTED, REJECTED. |
| CaptureSession | DRAFT, ACTIVE, PAUSED, COMPLETED, ARCHIVED. |
| OfflineCapture | OFFLINE, PENDING_SYNC, SYNCED, CONFLICT, REJECTED. |
| Conflict | KEEP_LOCAL, KEEP_REMOTE, MERGE, MARK_DISPUTED. |
| Review | REQUEST_EVIDENCE, VERIFY, DISPUTE, REJECT, ARCHIVE. |
| ControllerSession | PENDING, CONNECTED, EXPIRED, CLOSED. |
| Controller role | USER, PRESENTER, OPERATOR. |
| Identity | VISITOR, FREE, VERIFIED_PREMIUM_READY; verification UNVERIFIED/BASIC/VERIFIED/REQUIRES_REVIEW. |
| Participation | CREATED, IDENTIFIED, ELIGIBLE, STARTED, SUBMITTED, COMPLETED, EXPIRED, REJECTED, CANCELLED. |
| Asset scope | ADMIN_ONLY, REVIEW_ONLY, PUBLISHED_RUNTIME. |
| QR | La matriz compartida define disponibilidad, firma, expiración y destino; no prueba por sí sola escaneo real. |
| AR | Loader/model status/placeholder/fallback están en UI; WebXR completo no se demuestra solo con estado frontend. |

## 12. Tests y qué demuestran

El repositorio contiene pruebas para aislamiento MJP CORE, territorial trust, RBAC, CaptureSession, offline sync, resolución de conflictos, QR circular, Controller Lab, TV manifest, AR Stage, character foundation, geo placement, audit summary, permisos y exportaciones. Esto demuestra intención ejecutable y regresión de funciones concretas. No demuestra que todas las pantallas visuales coincidan con las maquetas, que todos los endpoints públicos estén servidos por la última versión ni que un teléfono real autorice cámara/GPS/micrófono.

La prueba P0 de aislamiento [1] es especialmente importante: declara dominios protegidos, rechaza mutación de cada agente, resiste metadatos hostiles y mantiene el manifest sin mutación. El resultado correcto de auditoría es **IMPLEMENTADO COMO CONTRATO DE AISLAMIENTO**, no “certificación de seguridad total”.

## 13. Mapa de realidad: implementado frente a simulado

| Capacidad | Clasificación | Razón |
|---|---|---|
| CAPTURE → VERIFY → PUBLISH territorial | IMPLEMENTADO | Procedimientos, estados, RBAC, auditoría y tablas reales. |
| Human Authority para publicar | IMPLEMENTADO/REQUIERE_HUMANO | El backend exige rol; la decisión no puede automatizarse. |
| SHA-256 de eventos/snapshots/assets | IMPLEMENTADO | Hashes calculados en server territorial. |
| QR redondo personalizable | IMPLEMENTADO PARCIAL | Generador y presets existen; escaneo físico y campaña productiva no verificados. |
| Portal visual | IMPLEMENTADO como ruta | Calidad de maqueta y continuidad de assets requieren evaluación visual. |
| LUKA AR | IMPLEMENTADO COMO PROTOTIPO | Carga Three/GLB/fallback; WebXR físico depende de navegador/dispositivo. |
| Mapper/The Eye backend | IMPLEMENTADO | CRUD, evidence, review, publish, snapshots, offline. |
| Mapper/The Eye experiencia física | EXTERNAL_REQUIRED | GPS, cámara, captura y uso en campo requieren dispositivos reales. |
| Offline | IMPLEMENTADO BÁSICO | Service Worker/cache/local queue; límites de cache y assets requieren prueba real. |
| Controller Lab | IMPLEMENTADO COMO LABORATORIO | Sesiones/comandos/perfiles; no prueba interoperabilidad TV universal. |
| LUKA TV/Cast/DLNA | VISUAL/SIMULADO o EXTERNAL_REQUIRED | Contratos y simuladores existen; proveedores reales no están certificados. |
| Voice Copilot | IMPLEMENTADO PARCIAL/VISUAL | Estados y fallback existen; reconocimiento y permisos reales no verificados. |
| Agentes | CONTRACTUAL/PARCIAL | Registro y tests; no todos son servicios operativos productivos. |
| QR sin credenciales | IMPLEMENTADO COMO REGLA | Los generadores revisados no deben incorporar secretos; hay que verificar cada payload exportado. |
| Dominio/HTTPS | EXTERNAL_REQUIRED | Depende de publicación, DNS, certificado y cache del entorno. |

## 14. Dependencias y riesgos

La experiencia depende de que Vite sirva chunks coherentes, que el Service Worker no entregue HTML viejo, que los assets S3 existan y tengan headers compatibles, que el GLB sea autocontenido y válido, y que el navegador mantenga permisos. El frontend puede cargar una ruta mientras el contenido real está obsoleto o fallar silenciosamente por cache. Esto explica por qué el repositorio puede pasar TypeScript/tests mientras el usuario ve una pantalla vacía o una interfaz de baja calidad.

El diseño también tiene una deuda de composición: el mismo dominio contiene superficies de producto, administración, laboratorio, manuales y pruebas. Si un alias público apunta al dashboard equivocado, la ruta funciona técnicamente pero no cumple el propósito humano. La entrada de Mapper/The Eye debe ser captura/revisión primero; la documentación y los controles administrativos deben estar detrás de una navegación deliberada.

## 15. Respuesta explícita a la Orden Maestra 54

**¿Qué existe?** Existe un sistema fullstack amplio con contratos, tablas, servicios, tests y múltiples superficies frontend. La capa territorial es la parte más coherente en cuanto a modelo de datos y gates.

**¿Qué es solo interfaz o simulación?** Parte importante de AR, TV, Cast/DLNA, Controller Lab físico, voz y visuales de marca. La interfaz no convierte automáticamente esas capacidades en operaciones reales.

**¿Qué requiere humano?** Aprobación de publicación, decisiones de conflicto según el caso, selección de fuentes, revisión de claims/evidencia, validación de maquetas, publicación final y prueba de campo.

**¿Qué requiere externo?** Android/iOS reales, GPS, cámara, micrófono, WebXR, lectura de QR, red local, TV, HTTPS estable, DNS, S3/headers, proveedor Cast/DLNA y prueba offline.

**¿Se modificó MJP CORE en esta auditoría?** No. La auditoría se limita a lectura y documentación. El código previo contiene tests de aislamiento que mantienen el núcleo protegido [1].

**¿Está listo para producción pública?** No puede declararse con las fuentes revisadas. El estado defendible es **CODE_READY_WITH_EXTERNAL_GATES**. Puede prepararse un piloto controlado cuando se ejecuten los gates físicos, pero no debe confundirse con producción general.

## 16. Recomendación de control de cambios

La Orden Maestra 54 debe convertirse en la fuente de verdad antes de cualquier nueva edición. El siguiente cambio debería empezar por un diff visual controlado: una superficie, una maqueta, un objetivo de interacción y una prueba de aceptación. No debe añadirse otro módulo hasta que Portal, QR Lab, LUKA AR, Mapper, The Eye y Controller Lab tengan una matriz de aceptación visual/funcional con evidencia.

La auditoría no recomienda eliminar código histórico sin un inventario de dependencias. Tampoco recomienda modificar MJP CORE para resolver problemas de presentación o de integración territorial. El camino seguro es separar claramente producto público, laboratorio, administración y runtime publicado.

## 17. Referencias internas

[1]: ../shared/mjpCoreIsolation.test.ts "Pruebas P0 de aislamiento de MJP CORE"
[2]: ../package.json "Dependencias y scripts del proyecto"
[3]: ../shared/circularQr.ts "Contrato de presentación QR circular"
[4]: ../server/territorialTrust.ts "Implementación server-side de Territorial Trust"
[5]: ../shared/territorialTrust.ts "Estados, roles, transiciones y score territorial"
[6]: ../client/src/App.tsx "Rutas y shell principal de la aplicación"
[7]: ../drizzle/schema.ts "Modelo de persistencia Drizzle"
[8]: ./ORDEN_48_MAPA_REALIDAD_AUDITORIA.md "Mapa de realidad anterior"
[9]: ./orden52_public_failure_reproduction.md "Reproducción de fallos públicos"
[10]: ./orden53_visual_findings.md "Hallazgos visuales de las maquetas"

## 18. Evidencia de validación disponible en el corte

El último checkpoint registrado antes de congelar esta auditoría documenta la suite como **482 tests PASS / 4 omitidos**, TypeScript PASS y build PASS. Este dato se trata como evidencia histórica del checkpoint, no como una nueva ejecución durante la Orden 54. La auditoría no afirma cobertura total ni certificación móvil; los tests faltantes deben analizarse por módulo y los gates externos deben ejecutarse con personas/dispositivos reales.

La Orden 54 no ejecuta despliegue, migración, SQL, cambio de configuración ni modificación de MJP CORE.
