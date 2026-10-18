# CONTRATO TÉCNICO DE TRANSFERENCIA DE CONOCIMIENTO
## MiLukita — KNOWLEDGE TRANSFER CONTRACT (KTC)

**Versión:** 1.0 · **Autor:** Manus AI · **Fecha:** 2026-09-06

> Este contrato transfiere conocimiento explícito, verificable y auditable sobre MiLukita desde el repositorio y la documentación existente hacia un futuro arquitecto, ingeniero, equipo de desarrollo u otra IA. No concede autoridad de producción, no certifica funcionamiento físico y no sustituye la revisión del propietario.

## 1. Alcance y prohibiciones

La transferencia cubre identidad, arquitectura, datos, flujos, estados, APIs, agentes, seguridad, auditoría, Mapper, The Eye, World Engine, LUKA AR, QR/L★, TV/Remote, Copilot, economía documentada, dependencias y migración. Durante la elaboración no se modificaron código de aplicación, MJP CORE, SQL, dependencias, assets funcionales ni despliegue. El paquete debe leerse junto con `ORDEN_55_INDEX.md` y la matriz CSV.

## 2. Qué se transfiere y qué estado tiene

Se transfiere conocimiento derivado de `client/src`, `server`, `shared`, `drizzle`, `docs`, tests y configuración del repositorio. Cada afirmación se clasifica como **IMPLEMENTED**, **PARTIAL**, **DOCUMENTED**, **SIMULATED**, **PENDING**, **BLOCKED**, **EXTERNAL_REQUIRED**, **REQUIRES_HUMAN**, **NOT_VERIFIED** o **DEPRECATED**. No se usa “production-ready” sin evidencia específica.

| Dominio | Evidencia principal | Estado de transferencia | Límite |
|---|---|---|---|
| Portal y rutas | `client/src/App.tsx`, `Home.tsx` | IMPLEMENTED/PARTIAL | La fidelidad visual y la publicación deben verificarse por entorno. |
| Mapper | `TerritorialFieldEntryPage.tsx`, `TerritorialTrustPage.tsx`, `TerritorialFieldTools.tsx` | IMPLEMENTED/PARTIAL | GPS, cámara, HTTPS, offline y campo real requieren dispositivo. |
| The Eye | `TerritorialTrustPage.tsx`, `server/territorialTrust.ts` | IMPLEMENTED/PARTIAL | La decisión humana final no es automatizable. |
| World Engine | `server/territorialTrust.ts`, `shared/territorialTrust.ts` | IMPLEMENTED/PARTIAL | Runtime consume conocimiento publicado, no captura sin verificar. |
| LUKA AR | `LukitaARStagePage.tsx`, Three.js/GLB | PARTIAL/SIMULATED | WebXR, GLB, cámara, calibración y modelo definitivo requieren validación externa. |
| QR/L★ | `QrGeneratorPage.tsx`, `customQrGenerator.ts`, `shared/circularQr.ts` | IMPLEMENTED/PARTIAL | QR es transporte/entrada; no es autorización. |
| Remote/TV | `TouchRemotePage.tsx`, `server/routers.ts` | UI/PARTIAL | Cast, DLNA, receptor y control físico no quedan demostrados por la UI. |
| MJP CORE | `shared/mjpCoreIsolation.test.ts`, contratos MJP | PROTECTED/READ ONLY | No forma parte de la autoridad territorial. |

## 3. Identidad del sistema

**MiLukita** es el nombre del ecosistema y de la experiencia de acceso. **LUKA** es la identidad/agente/personaje operativo que presenta, guía o asiste. **LUKALLPA** representa el mundo/territorio cuando esa terminología aparece en la documentación. Mapper captura realidad territorial; The Eye revisa afirmaciones y evidencias; Human Authority conserva autoridad final; World Engine publica versiones verificadas; LUKA AR consume datos publicados.

MiLukita no debe confundirse con una única página, un único agente, una wallet ni MJP CORE. LUKA puede asistir y contextualizar, pero no puede convertir una intención en verdad territorial, resolver por sí sola una disputa o publicar conocimiento sin autoridad humana explícita.

## 4. Modelo conceptual

`REALIDAD → CAPTURA → WorldPoint/WorldObject → WORLD ENGINE → THE EYE → HUMAN AUTHORITY → PUBLISHED VERSION → RUNTIME → LUKA AR`.

En cada transición se conserva actor, input, proceso, output, estado, versión, evidencia, permisos y audit log. `VERIFIED` no equivale a `PUBLISHED`; el runtime debe consumir únicamente la versión publicada. Una captura local u offline puede existir sin ser pública. El conflicto debe resolverse con una decisión auditable, no con last-write-wins implícito.

## 5. Organigrama y autoridad

La autoridad institucional se ordena así: propietario/Human Authority; gobierno y auditoría; Mapper Operator; Eye Reviewer; World Engine/Runtime; experiencias LUKA. La autoridad tecnológica se ordena: frontend; API/tRPC; servicios territoriales; ORM/base de datos; S3; Service Worker; proveedores externos; dispositivos. Los agentes IA son asistentes con capacidades acotadas, nunca una autoridad sobre resultados, RNG, wallet, ledger, settlement, reglas o MjpTvManifest.

| Actor | Puede hacer | No puede hacer |
|---|---|---|
| Mapper Operator | Capturar, adjuntar observaciones y evidencia, trabajar offline | Verificar verdad, publicar o resolver autoridad final |
| Eye Reviewer | Revisar Claims, Sources, Evidence, confidence y conflictos | Sustituir Human Authority en publicación |
| Human Authority | Aprobar/rechazar, resolver decisiones finales, autorizar publicación | Delegar silenciosamente su autoridad al Copilot |
| World Engine | Versionar y servir conocimiento publicado | Promover automáticamente una captura a publicación |
| LUKA/Copilot | Detectar intents, asistir, dictar, proponer y hacer fallback | Verificar verdad, publicar o conceder permisos |
| Runtime/AR/TV | Consumir experiencias y comandos permitidos | Acceder al MJP CORE protegido |

## 6. Modelo de datos y flujo

Las entidades nucleares son WorldObject, WorldPoint, Claim, Source, Evidence, CaptureSession, Observation, Publication, Sync, Conflict, Experience, User, Role, Permission y Audit. Sus campos concretos, relaciones, creación, modificación, versionado y permisos están en `08_MILUKITA_DATA_MODEL.md`, y deben contrastarse con `drizzle/schema.ts` antes de migrar.

El ciclo Mapper es: iniciar sesión; verificar permisos; iniciar CaptureSession; comprobar GPS/cámara; capturar punto/objeto; registrar observación y evidencia; guardar localmente si no hay red; sincronizar; detectar conflicto; resolver con rol permitido; enviar a revisión. The Eye organiza Claims, Sources y Evidence Matrix; calcula o muestra confianza explicable; conserva versiones; separa VERIFIED de PUBLISHED; registra aprobación humana; entrega al World Engine solo una versión autorizada.

## 7. Copilot y eventos

El Field Voice Copilot distingue `INTENT DETECTED` de `ACTION EXECUTED`. Puede procesar audio, mostrar estados, producir observaciones dictadas pendientes de verificación y ofrecer fallback manual. La voz no es autoridad. Los eventos de captura, evidencia, sincronización, conflicto, revisión, publicación, QR, sesión y comando remoto deben conservar requestId, actor, timestamp, contexto, resultado y error cuando corresponda.

## 8. QR, AR y TV

QR público, Context QR, Experience QR y Session QR no son equivalentes. Compartir un QR distribuye un enlace o payload; no autoriza ni autentica por sí solo. Los tokens, expiración, revocación y deep links deben ser comprobados contra el código vigente antes de migrar. LUKA AR puede abrir una entrada, cargar referencia o GLB y mostrar fallback; el modelo definitivo, WebXR, cámara, GPS, calibración y publicación territorial requieren prueba física. Remote TV contiene una superficie UI y contratos de sesión/comando, pero Cast, DLNA/UPnP, receptor y una TV real son dependencias externas hasta ser demostrados.

## 9. Seguridad, auditoría y MJP CORE

La autenticación se apoya en la infraestructura del proyecto; autorización se aplica mediante procedimientos y contratos territoriales. Debe auditarse siempre la diferencia entre permiso visible en UI y enforcement backend. S3 contiene bytes; base de datos contiene metadatos y referencias. Los informes y decisiones pueden llevar SHA-256, pero el hash prueba integridad del artefacto y no veracidad del contenido.

MJP CORE es un **PROTECTED SYSTEM / READ ONLY / NO MODIFICATION**. La transferencia documenta únicamente dependencias, interfaces, puntos de integración e intercambios de datos. Está prohibido reinterpretar o modificar RNG, wallet, ledger, settlement, reglas o manifest. `mjpCoreIsolation.test.ts` es evidencia de aislamiento, no una autorización para ampliar la integración.

## 10. Migración y prueba de transferencia

La migración independiente requiere inventariar variables y secretos, reemplazar Manus OAuth y Forge, conservar contratos tRPC, provisionar MySQL/TiDB, S3, dominio HTTPS, WebSocket y proveedores de mapas/voz/AR, ejecutar migraciones verificadas y repetir pruebas. Ninguna de estas acciones se ejecuta mediante este contrato.

Una nueva IA podría comprender la intención, límites y mapa de módulos usando este paquete. No podría instalar ni operar producción con certeza sin secretos, infraestructura, datos reales, autoridad humana, configuración de proveedores, modelo 3D definitivo, protocolo de TV y prueba física. Esa diferencia queda registrada en `KNOWLEDGE_TRANSFER_GAP_REPORT.md`.

## 11. Evidencia y referencias internas

La fuente de cada afirmación crítica se encuentra en `30_MILUKITA_FILE_INVENTORY.md`, `ORDEN_54_INDEX.md`, `CONTRADICTIONS_REPORT.md`, `MJP_CORE_DEPENDENCY_MAP.md`, los anexos y los tests citados. La matriz CSV añade fuente, evidencia, estado, confianza, dependencia, riesgo y destino. Cuando una conclusión es inferida, se marca explícitamente como INFERRED.

## 12. Aceptación

El contrato se considera transferido documentalmente cuando el receptor puede localizar una afirmación en un anexo, seguirla hasta un archivo/test/contrato, distinguir implementación de simulación y enumerar las acciones prohibidas. No se considera certificación de producción, certificación legal, certificación de seguridad ni aprobación de Human Authority.

## Referencias

[1]: ./ORDEN_54_INDEX.md "Índice de ingeniería inversa de MiLukita"
[2]: ./04_MILUKITA_MASTER_ARCHITECTURE.md "Arquitectura maestra"
[3]: ./08_MILUKITA_DATA_MODEL.md "Modelo de datos"
[4]: ./19_SECURITY_RBAC_ANALYSIS.md "Seguridad y RBAC"
[5]: ./21_MJP_CORE_DEPENDENCY_MAP.md "Dependencias de MJP CORE"
[6]: ./23_CONTRADICTIONS_REPORT.md "Contradicciones"
[7]: ./29_MILUKITA_RECOVERY_MATRIX.md "Matriz de recuperación"
