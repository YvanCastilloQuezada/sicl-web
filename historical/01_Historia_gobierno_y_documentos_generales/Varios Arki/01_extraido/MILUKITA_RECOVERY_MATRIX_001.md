# MILUKITA_RECOVERY_MATRIX_001

Fecha: 12 de septiembre de 2026  
Objeto: matriz de recuperación documental, sin reconstruir el repositorio.  
Estado: análisis terminado; cualquier recuperación material queda pendiente de autorización.

## 1. Dictamen

El paquete aplanado conserva una parte sustancial del código reciente, pero perdió la separación entre archivos homónimos y no contiene varios servicios críticos. El ZIP histórico interno y el nuevo ZIP estructurado aportan infraestructura y utilidades recuperables. Ninguno aporta las implementaciones recientes de publicación territorial, Governance, Controller Lab, ShareService, el adaptador Agent Router ni los contratos/servicio de Online TV.

**Es posible recuperar candidatos y documentar muchas rutas sin inventar código. No es posible reconstruir con certeza el checkpoint reciente completo combinando los paquetes disponibles.**

El nuevo `ruleta-peru-online (5).zip` mejora la recuperación: incluye `createApp`, health routes, accesibilidad, un icono PWA y más historial Drizzle. No lo considero el checkpoint actual por su nombre, fecha de descarga o número entre paréntesis. Su contenido no incluye las capas recientes y su journal termina en `0017`.

En un perímetro explícito de **37 huecos fuente**:

- **23 (62,2 %) RECOVERABLE_EXACT:** candidato concreto recuperable sin reescribir su contenido.
- **2 (5,4 %) RECOVERABLE_WITH_ADAPTATION:** entrada del servidor y tRPC servidor.
- **12 (32,4 %) MUST_RECOVER_FROM_MANUS:** falta la implementación y afecta contratos o límites que no deben inventarse.
- Hay candidato fuente para **25/37 (67,6 %)** si se incluyen las dos bases que necesitan adaptación.
- Entre **15 archivos críticos backend/contratos** de ese perímetro, **12/15 (80,0 %) no tienen cuerpo fuente candidato** en los paquetes.

Estos porcentajes miden archivos del perímetro descrito, **no líneas de código, funcionalidad, seguridad, operatividad ni porcentaje global del workspace perdido**. La sección 8 expone los denominadores y límites. Configuración, migraciones, scripts auxiliares y assets se analizan por separado.

## 2. Fuentes, alcance y trazabilidad

### 2.1 Paquetes inspeccionados

| Clave | Fuente | Inventario observado |
|---|---|---|
| A | `C:\Users\Arq Yvan\Documents\0 Luka\II Etapa\Revisión del archivo y sus funcionalidades 12-9-2026.zip` | 952 archivos exteriores; todos en la raíz. 105.992.914 bytes de ZIP. 338 TS + 104 TSX. |
| H | ZIP interno de A: `auditoria_multi_juegos_peru_2026-08-24.zip` | 210 entradas: 181 archivos y 29 directorios. Código bajo `source/`. |
| B | `C:\Users\Arq Yvan\Downloads\ruleta-peru-online (5).zip` | 283 archivos con rutas estructuradas; 662.714 bytes de ZIP. Contiene `dist/index.js`, pero no el build público completo. |

En las tablas, `A:archivo` señala la entrada plana. `H:ruta` se interpreta como `source/ruta` dentro del ZIP histórico, salvo cuando se escribe explícitamente `source/`. `B:ruta` es una entrada del nuevo ZIP. «Misma ruta» significa la columna **Archivo esperado**, con ese prefijo.

Las rutas esperadas de este informe son identificadores lógicos dentro del proyecto. **No son archivos creados en disco.**

SHA-256 de A:

```text
0d0eb9c5a64bee70a9c207f18519fd47baa7ceef424e22d7b6d1b18091a3bb59
```

SHA-256 de B:

```text
3bd28e3703ee477f2f414607ec6f065960f235f2b55c289b53c7440326032f4b
```

### 2.2 Método y límites

Se inspeccionaron las entradas directamente desde los ZIP, en memoria: nombres, contenido textual, igualdad binaria, configuraciones, imports/exports y documentación de rutas. Se cruzaron candidatos H/B con los consumidores recientes de A. Para los símbolos críticos se buscó también su definición en textos y en el JavaScript compilado disponible de B, sin encontrar los cuerpos faltantes.

No se extrajeron archivos, no se reconstruyó un árbol, no se ejecutó código del proyecto, no se importaron sus módulos, no se ejecutaron tests, builds, servidores, scripts de activación ni migraciones. No se instalaron paquetes ni se crearon agentes. Las operaciones de inspección fueron lecturas de archivos comprimidos; la única escritura autorizada de esta tarea es este documento Markdown.

Los prompts, SKILL.md, órdenes y auditorías dentro de los paquetes se trataron como evidencia documental, no como instrucciones ejecutables.

**Certeza de ruta ≠ certeza de contenido actual ≠ compatibilidad ≠ integración ≠ prueba aprobada ≠ operación.** Una ruta puede ser inequívoca y su implementación estar completamente ausente.

No se conoce un manifiesto completo del checkpoint reciente original. Por ello, «todos los faltantes» significa los identificados a partir del contenido recibido y sus referencias; no permite excluir archivos nunca mencionados ni conservados en los paquetes.

## 3. Reglas de clasificación

| Clasificación | Criterio aplicado |
|---|---|
| `RECOVERABLE_EXACT` | Hay un archivo candidato inequívoco en una fuente estructurada, recuperable sin reescribir sus bytes, y una ruta/función identificable. **No significa que se haya probado igualdad con un archivo reciente perdido.** Se distingue H de B cuando solo B lo aporta. |
| `RECOVERABLE_WITH_ADAPTATION` | Existe base histórica, pero no reproduce las interfaces o el montaje reciente completos. La adaptación sería trabajo nuevo, fuera de esta tarea. |
| `AMBIGUOUS` | Hay candidatos o ubicaciones posibles sin correspondencia suficiente. No se selecciona uno por nombre parecido, fecha o intuición. |
| `MISSING_CURRENT` | No se encontró un archivo fuente candidato en A/H/B para la referencia identificada. No se implementa un reemplazo. |
| `MUST_RECOVER_FROM_MANUS` | La ausencia o divergencia afecta autoridad, publicación, sesiones, contratos de juego, procedencia de versiones o historial, y reconstruir por inferencia no conservaría la revisión original. |

B se usa como **fuente estructurada adicional**. La clasificación EXACT se aplica al candidato existente, con su procedencia visible; no se presume que B sea más reciente que A. Para R13 y R17, la recuperación es posible por B y no por H.

Cuando una pieza no tiene candidato y además es crítica, prevalece MUST_RECOVER_FROM_MANUS sobre MISSING_CURRENT. No son dos etiquetas para la misma fila.

## 4. Matriz principal: archivos fuente faltantes

Las filas R01–R34 cubren los huecos directos identificados en el grafo trazable, incluida la entrada del servidor y la proyección referenciada por los tests del núcleo. R35–R37 son dependencias transitivas de los candidatos UI. No se incorporan indiscriminadamente todos los archivos del proyecto histórico.

| ID | Componente | Archivo esperado | Evidencia de ruta | Candidato histórico / adicional | Compatibilidad | Riesgo | Clasificación |
|---|---|---|---|---|---|---|---|
| R01 | Skeleton de layout | client/src/components/DashboardLayoutSkeleton.tsx | A:DashboardLayout.tsx → ./DashboardLayoutSkeleton | H/B: misma ruta | H y B idénticos; componente identificable | Bajo; presentación sin prueba visual | RECOVERABLE_EXACT |
| R02 | Error boundary | client/src/components/ErrorBoundary.tsx | A:App.tsx → ./components/ErrorBoundary | H/B: misma ruta | H y B idénticos; export default y children | Bajo para recuperación; conducta original conservada | RECOVERABLE_EXACT |
| R03 | UI Avatar | client/src/components/ui/avatar.tsx | A:DashboardLayout.tsx → @/components/ui/avatar | H/B: misma ruta | H y B idénticos | Bajo; dependencias Radix pendientes de instalación futura | RECOVERABLE_EXACT |
| R04 | UI Badge | client/src/components/ui/badge.tsx | A:TerritorialTrustPage.tsx y otros → @/components/ui/badge | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R05 | UI Card | client/src/components/ui/card.tsx | A:AgentRegistryPanel.tsx → @/components/ui/card | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R06 | UI Dropdown | client/src/components/ui/dropdown-menu.tsx | A:DashboardLayout.tsx → @/components/ui/dropdown-menu | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R07 | UI Input | client/src/components/ui/input.tsx | A:TerritorialTrustPage.tsx → @/components/ui/input | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R08 | UI Sidebar | client/src/components/ui/sidebar.tsx | A:DashboardLayout.tsx → @/components/ui/sidebar | H/B: misma ruta | H y B idénticos; revisar cierre de imports UI al recuperar | Bajo/medio; componentes transitivos | RECOVERABLE_EXACT |
| R09 | UI Textarea | client/src/components/ui/textarea.tsx | A:TerritorialTrustPage.tsx → @/components/ui/textarea | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R10 | Inicio de OAuth cliente | client/src/const.ts | A:main.tsx → ./const; A:useAuth.ts → @/const; startLogin | H/B: misma ruta | H y B idénticos; exporta startLogin y usa nonce/encodeOAuthState presentes en A | Medio; requiere VITE_OAUTH_PORTAL_URL, origen y cookies; no se certifica login | RECOVERABLE_EXACT |
| R11 | Hook de viewport | client/src/hooks/useMobile.tsx | A:DashboardLayout.tsx → @/hooks/useMobile | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R12 | Hook de callback | client/src/hooks/usePersistFn.ts | A:Map.tsx → @/hooks/usePersistFn | H/B: misma ruta | H y B idénticos | Bajo | RECOVERABLE_EXACT |
| R13 | Accesibilidad | client/src/lib/accessibility.ts | A:ThemeContext.tsx y accessibility.test.ts | H: ausente; B: misma ruta | B aporta implementación; ThemeContext.tsx y su test de accesibilidad coinciden por bytes con A | Bajo/medio; prueba escrita no ejecutada | RECOVERABLE_EXACT |
| R14 | Utilidades UI | client/src/lib/utils.ts | A:button.tsx, dialog.tsx, Map.tsx → @/lib/utils | H/B: misma ruta | H y B idénticos; cn | Bajo | RECOVERABLE_EXACT |
| R15 | Página Impacto | client/src/pages/ImpactoPage.tsx | A:App.tsx → @/pages/ImpactoPage | H/B: misma ruta | H y B idénticos; depende de market.socialImpact y PilotLayout | Medio; contenido histórico, no afirmar vigencia editorial | RECOVERABLE_EXACT |
| R16 | Página 404 | client/src/pages/NotFound.tsx | A:App.tsx → @/pages/NotFound | H/B: misma ruta | H y B idénticos; export default | Bajo; diseño histórico | RECOVERABLE_EXACT |
| R17 | Health HTTP | server/_core/health.ts | A:securityHealth.test.ts → ./health; registerHealthRoutes | H: ausente; B: misma ruta | B exporta registerHealthRoutes(app, databaseHealthCheck); el test A es idéntico al de B | Medio; no sustituir A:health.ts, que es shared/health.ts | RECOVERABLE_EXACT |
| R18 | Notificación del sistema | server/_core/notification.ts | A:systemRouter.ts → ./notification | H/B: misma ruta | H y B idénticos; dependencia externa Forge | Medio; recuperar no equivale a enviar notificaciones | RECOVERABLE_EXACT |
| R19 | tRPC servidor | server/_core/trpc.ts | A:routers.ts:5–10 → ./_core/trpc; router/publicProcedure/protectedProcedure/adminProcedure | H/B: misma ruta, idénticos entre sí | Exports básicos compatibles; no acreditan middleware reciente de AUTHZ/cron/auditoría | Alto; usar como base exigiría revisar/adaptar fronteras actuales, fuera de esta tarea | RECOVERABLE_WITH_ADAPTATION |
| R20 | Tipos Manus OAuth | server/_core/types/manusTypes.ts | A:sdk.ts → ./types/manusTypes | H/B: misma ruta | H y B idénticos; incluye GetUserInfoWithJwtResponse.taskUid | Medio; contrato externo no verificado contra servicio | RECOVERABLE_EXACT |
| R21 | Adaptador Agent Router | server/agentRouter.ts | A:routers.ts:115 y :1442 → routeRegisteredAgent; A:RESCUE_AUDIT_001.md:200 | H: ausente; B: ausente | A:agentRouter.ts es shared; exporta routeAgentIntent, no el adaptador | Crítico; selección y ejecución de agentes no deben inferirse | MUST_RECOVER_FROM_MANUS |
| R22 | Governance backend | server/auditGovernance.ts | A:routers.ts:230; sdk.ts:9; auditGovernance.test.ts:4 | H: ausente; B: ausente | Faltan assertHumanAuthority, assertCapability, appendGovernanceAudit, recordSecurityEvent y validación de cadena | Crítico; autoridad humana, seguridad y trazabilidad | MUST_RECOVER_FROM_MANUS |
| R23 | Controller Lab backend | server/controllerLab.ts | A:routers.ts → ./controllerLab; websocketServer.ts:5 → ../controllerLab | H: ausente; B: ausente | A conserva shared/controllerLab.ts; faltan sesiones, tokens y authorizeControllerSocket | Crítico; emparejamiento y autorización | MUST_RECOVER_FROM_MANUS |
| R24 | Identidad backend | server/identityParticipation.ts | A:routers.ts → ./identityParticipation; documentos distinguen server/shared | H: ausente; B: ausente | A conserva tipos/funciones compartidas; no servicio persistente importado | Alto; elegibilidad, identidad y participación | MUST_RECOVER_FROM_MANUS |
| R25 | ShareService | server/lukaShare.ts | A:routers.ts:229; createShareSession/resolveActiveShareTarget y otras funciones | H: ausente; B: ausente | A:lukaShare.ts es shared; normalización y límites no sustituyen resolución/revocación/propiedad | Crítico; publicación, sesiones y control de acceso | MUST_RECOVER_FROM_MANUS |
| R26 | Guiones persistentes LUKA | server/lukitaScripts.ts | A:routers.ts importa listLukitaScripts, saveLukitaScript y otras funciones | H: ausente; B: ausente | A conserva shared/lukitaScripts.ts; falta persistencia, historial y generación backend | Alto; no recrear versiones ni aprobación por inferencia | MUST_RECOVER_FROM_MANUS |
| R27 | Online TV servicio | server/onlineTvGames.ts | A:onlineTvGames.ts:3 → ../onlineTvGames | H: ausente; B: ausente | Solo sobreviven router, persistencia y otros consumidores; faltan create/get/join/submit | Crítico; acciones, sesiones y reglas de participación | MUST_RECOVER_FROM_MANUS |
| R28 | Boss Fight router | server/routers/bossFight.ts | A:routers.ts → ./routers/bossFight; export esperado bossFightRouter | H: ausente; B: ausente | A:bossFight.ts es contrato shared; no exporta bossFightRouter | Alto; integración con juegos/recompensas | MUST_RECOVER_FROM_MANUS |
| R29 | Territorial Trust backend | server/territorialTrust.ts | A:routers.ts:180–226; arAssets.ts:6; fieldGateReports.ts:5 | H: ausente; B: ausente | Faltan CRUD, roles, acceso, revisión, publicación, snapshots y sincronización | Crítico; VERIFIED ≠ PUBLISHED y Human Authority | MUST_RECOVER_FROM_MANUS |
| R30 | Errores comunes | shared/_core/errors.ts | A:sdk.ts → @shared/_core/errors | H/B: misma ruta | H y B idénticos | Bajo; restaura símbolos, no autorización por sí sola | RECOVERABLE_EXACT |
| R31 | Field Voice contrato | shared/fieldVoiceCopilot.ts | A:fieldVoiceCopilot.ts:5–16; routers.ts:232 | H: ausente; B: ausente | Faltan FIELD_VOICE_INTENTS, FIELD_COPILOT_STATES, interpretControlledIntent, transitionFieldState y tipos | Crítico; decisiones/confirmaciones de acciones de campo | MUST_RECOVER_FROM_MANUS |
| R32 | Online TV contrato | shared/onlineTvGames.ts | A:onlineTvGames.ts:6; tvManifest.ts:1; OnlineTvGamesPage.tsx | H: ausente; B: ausente | Faltan ONLINE_TV_GAME_IDS, definiciones, dificultades y tipos de sesión/acción | Crítico; no inferir reglas a partir de pantallas o tests | MUST_RECOVER_FROM_MANUS |
| R33 | Entrada del servidor | server/_core/index.ts | A:package.json scripts dev/build; api.e2e.test.ts:6; H/B: ruta real | H: source/server/_core/index.ts; B: server/_core/index.ts | H no exporta createApp; B sí. B no monta WebSocket, scheduledLive24 ni los controles recientes completos | Crítico; B es base parcial, no servidor reciente recuperado | RECOVERABLE_WITH_ADAPTATION |
| R34 | Proyección/orquestación manifest | shared/experienceOrchestrator.ts | A:mjpCoreIsolation.test.ts:4; tvQrGoldenFlow.test.ts; 21_MJP_CORE_DEPENDENCY_MAP.md | H: ausente; B: ausente | No encontré implementación de orchestrateManifest, también buscando en textos y build B | Crítico; límite de proyección frente a MJP CORE | MUST_RECOVER_FROM_MANUS |
| R35 | Hook de composición (transitivo) | client/src/hooks/useComposition.ts | H/B:ui/input.tsx y ui/textarea.tsx → @/hooks/useComposition; requeridos por A | H/B: misma ruta; idénticos | Dependencia del candidato R07/R09, no encontrada en A | Bajo | RECOVERABLE_EXACT |
| R36 | UI Separator (transitivo) | client/src/components/ui/separator.tsx | H/B:ui/sidebar.tsx → @/components/ui/separator; requerido por A:DashboardLayout | H/B: misma ruta; idénticos | Dependencia del candidato R08 | Bajo | RECOVERABLE_EXACT |
| R37 | UI Skeleton (transitivo) | client/src/components/ui/skeleton.tsx | H/B:DashboardLayoutSkeleton.tsx y ui/sidebar.tsx → skeleton | H/B: misma ruta; idénticos | Dependencia de R01/R08 | Bajo | RECOVERABLE_EXACT |

### 4.1 Qué aporta realmente el nuevo ZIP B

- `B:server/_core/index.ts` exporta `createApp` y `startServer`. H solo contenía una entrada con arranque y carecía de `createApp`. A requiere esa función desde `api.e2e.test.ts`.
- El servidor de B registra health, OAuth, storage, límites API y el callback de juegos programados. No contiene el montaje de `attachRealtimeWebSocket`, `handleScheduledLive24` ni `sameOriginMutationGuard` que debe contrastarse con las capas recientes. Copiarlo no demostraría ese montaje.
- `B:server/_core/health.ts` implementa `registerHealthRoutes`. A conserva otro `health.ts`, con `buildUnifiedHealth`; no se deben intercambiar.
- `B:client/src/lib/accessibility.ts` coincide con las interfaces del `ThemeContext.tsx` y el test de accesibilidad de A; esos consumidores coinciden por bytes con B.
- `client/src/const.ts` **también existe en H**, y es idéntico al de B. Recupera `startLogin`, cuyo consumidor reciente está conservado. Añade como requisito de entorno identificable `VITE_OAUTH_PORTAL_URL`; no se configuró ni se probó.
- B contiene 18 migraciones y snapshots, `0000–0017`; H conserva `0000–0006`.
- El build `B:dist/index.js` contiene código backend anterior; no es un sustituto exacto de fuentes recientes, no se decompiló para reconstruir módulos y no se ejecutó.
- No se encontraron en B definiciones de `routeRegisteredAgent`, `requireTerritorialRole`, `assertHumanAuthority`, `createShareSession`, `createControllerSession`, `createOnlineTvSession`, `interpretControlledIntent` ni `orchestrateManifest`.

### 4.2 Recuperar una interfaz crítica exige algo más que satisfacer un import

`A:routers.ts` importa funciones que no exportan sus homónimos planos. Añadir stubs, renombrar funciones parecidas o devolver valores constantes haría desaparecer algunos errores de resolución, pero inventaría el comportamiento.

Ejemplos que quedan expresamente bloqueados:

- `routeAgentIntent` de `shared/agentRouter.ts` no es el adaptador servidor `routeRegisteredAgent`.
- `requiresHumanAuthority` de `shared/auditGovernance.ts` no es `assertHumanAuthority`.
- `canSendControllerCommand` no sustituye validación de sesión, canal, token, caducidad y propiedad.
- `canPublishWorldObject` no sustituye la transacción de publicación ni la comprobación de Human Authority.
- El router de Online TV no contiene el motor ni el contrato compartido que importa.
- Los tipos de Field Voice y sus reglas no deben deducirse a partir de los formularios de entrada.

## 5. Matriz complementaria: configuración, historial, herramientas y assets

| ID | Componente | Archivo esperado | Evidencia de ruta | Candidato histórico / adicional | Compatibilidad | Riesgo | Clasificación |
|---|---|---|---|---|---|---|---|
| C01 | TypeScript | tsconfig.json | H/B: raíz; A:package.json → tsc --noEmit; aliases de vite/vitest | H/B: tsconfig.json idénticos (657 bytes) | Config raíz identificable; client/src, shared y server; @ y @shared | Medio: no certifica compilación; excluye tests y escribe tsbuildinfo al ejecutar | RECOVERABLE_EXACT |
| C02 | Drizzle configuración | drizzle.config.ts | H/B: raíz; A:package.json → drizzle-kit; A:db.ts/schema.ts | H/B: drizzle.config.ts idénticos (353 bytes) | MySQL; schema ./drizzle/schema.ts; out ./drizzle | Alto si se ejecuta; recuperación del archivo no autoriza migraciones | RECOVERABLE_EXACT |
| C03 | Lockfile reciente | pnpm-lock.yaml | A:package.json packageManager y patchedDependencies; H/B: raíz | H: lock antiguo; B: lock de 323.554 bytes | Ambos anteriores al conjunto de dependencias A; B carece de 9 dependencias directas actuales | Alto: regenerarlo produciría otra resolución, no recuperaría la original | MUST_RECOVER_FROM_MANUS |
| C04 | Journal reciente | drizzle/meta/_journal.json | H/B: ubicación física; A:45 SQL hasta 0051 | H: 0000–0006; B: 0000–0017 | Ninguno contiene el historial completo de A | Crítico: no fabricar índices, timestamps, orden o relación con BD | MUST_RECOVER_FROM_MANUS |
| C05 | Snapshots recientes | drizzle/meta/0018_snapshot.json … 0051_snapshot.json (nombres de serie esperados; confirmar journal original) | Serie H/B y SQL posteriores de A; no consta el conjunto exacto reciente | H: 0000–0006; B: 0000–0017 | Solo se recuperan snapshots anteriores; no extrapolar cambios | Crítico: el esquema final no reconstruye inequívocamente snapshots intermedios | MUST_RECOVER_FROM_MANUS |
| C06 | Migración inicial | drizzle/0000_true_vertigo.sql | H/B: ruta física y journal | H/B: misma ruta | Candidato SQL inicial identificable; ausente como archivo exterior A | Crítico por ámbito MJP/BD: identificable no significa autorizado a incorporarlo o ejecutarlo | RECOVERABLE_EXACT |
| C07 | Huecos SQL | drizzle/0018_*.sql … 0022_*.sql; drizzle/0034_*.sql | A salta 0017→0023 y 0033→0035; sufijos originales desconocidos | H: ausentes; B: ausentes | No se pueden inferir contenidos, tags ni siquiera confirmar la cadena aplicada | Crítico: recuperar secuencia original, sin generar migraciones | MUST_RECOVER_FROM_MANUS |
| C08 | Patch Wouter | patches/wouter@3.7.1.patch | A:package.json pnpm.patchedDependencies | H/B: misma ruta; idénticos (918 bytes) | Target y ruta coinciden; patch agrega registro de rutas en window | Medio: aplicar depende de la versión exacta del lock; no aplicado | RECOVERABLE_EXACT |
| C09 | Tipos comunes agregados | shared/types.ts | H/B: ruta física; A:types.ts corresponde a simulator/types.ts | H/B: misma ruta; idénticos (158 bytes) | Reexports de drizzle/schema y shared/_core/errors | Bajo/medio; recuperar candidato no agregar usos inexistentes | RECOVERABLE_EXACT |
| C10 | Activación MJP Extra | server/scripts/activateMjpExtra39.ts | A:package.json scripts activate:mjp-extra | H: ausente; B: misma ruta | Candidato anterior disponible; modificaría reglas/núcleo al ejecutarse | Crítico: preservar MJP CORE; no adaptar ni activar a partir del candidato | MUST_RECOVER_FROM_MANUS |
| C11 | Activación variantes | server/scripts/activateLotteryVariants.ts | A:package.json scripts activate:lottery-variants | H: ausente; B: misma ruta | Candidato anterior; compatibilidad reciente no demostrada | Crítico: código de activación protegido, recuperar revisión exacta | MUST_RECOVER_FROM_MANUS |
| C12 | Inspector de lotería | server/scripts/inspectLoteriaV101.ts | A:package.json scripts inspect:loteria | H: ausente; B: ausente; sin archivo exterior A | No hay cuerpo fuente candidato | Medio: script de inspección faltante; no inferir implementación | MISSING_CURRENT |
| C13 | Test servidor de guiones | server/lukitaScripts.test.ts | A:LUKA_AUDITORIA_TOTAL_FASE_0_2026-09-01.md distingue server/shared; A:lukitaScripts.test.ts prueba contrato shared | H: ausente; B: ausente | Sobrevive test shared; falta candidato backend | Medio: test histórico referido, no generar sustituto | MISSING_CURRENT |
| C14 | Icono PWA | client/public/pwa-icon.svg | A:index.html enlaza /pwa-icon.svg; A:vite.config.ts publicDir | H: ausente; B: misma ruta (985 bytes) | Asset servido por ruta raíz identificable | Bajo: no demuestra vigencia de identidad visual | RECOVERABLE_EXACT |
| C15 | Modelo AR requerido | Clave /manus-storage/lukita-ar-stage-candidate-blockout-fixed_e1d5ceed.glb; no es ruta fuente local demostrada | A:LukitaARStagePage.tsx:10 | Sin GLB/GLTF en A/H/B | Depende de almacenamiento original; generador create_ar_demo_glb.mjs no es el binario original | Alto: identidad/versión y contenido 3D no recuperables por inferencia | MUST_RECOVER_FROM_MANUS |
| C16 | Emblema L★ | Clave /manus-storage/luka-emblema-circular-dorado_dcebdf58.png; ubicación local desconocida | A:MobileShell.tsx | A:LUKA.png y otras imágenes son candidatos visuales no autenticados; H/B sin la clave | Sin correspondencia de hash o manifiesto entre clave y archivo | Medio: no renombrar una imagen por parecido | AMBIGUOUS |
| C17 | Referencias visuales AR | Claves /manus-storage/lukita-character-foundation-reference_0f52a9ed.png; lukita-ar-device-concept_43fd0153.png; lukita_turnaround_overlay_reference_5892448d.jpg | A:LukitaARStagePage.tsx, TouchRemotePage.tsx, Lukita3DStudioPage.tsx | A tiene PNG/JPG/WebP y capturas, sin correspondencia inequívoca; H/B no aportan esas claves | Candidatos gráficos posibles; no se certificó equivalencia visual o binaria | Medio: pedir manifiesto/objetos originales | AMBIGUOUS |
| C18 | Carpeta de assets adjuntos | attached_assets/ y correspondencias originales | A:vite.config.ts alias @assets | A: imágenes sueltas; H/B sin carpeta de assets reciente | Raíz esperada cierta; nombres y ubicaciones originales de cada imagen no demostrados | Medio: carpeta prevista no autoriza poblarla por intuición | AMBIGUOUS |
| C19 | Depuración Manus | client/public/__manus__/debug-collector.js | A:vite.config.ts src /__manus__/debug-collector.js | H/B: misma ruta | Fuente estática del recolector disponible; no habilitada en esta tarea | Medio: código de diagnóstico con efectos en ejecución | RECOVERABLE_EXACT |

### 5.1 Lockfile: por qué no es recuperable como revisión reciente exacta

Los lockfiles H/B son candidatos reales de sus respectivos paquetes, pero no representan la resolución completa de `A:package.json`. Respecto del package de B, A agrega nueve dependencias directas:

`@types/pdfkit`, `@types/qrcode`, `@types/three`, `@types/ws`, `pdfkit`, `playwright-core`, `qrcode`, `three` y `ws`.

El número de versión de pnpm declarado en `packageManager` y el rango de pnpm en `devDependencies` tampoco son la misma especificación. El archivo original de resolución debe recuperarse junto con el package del mismo checkpoint. Ejecutar una instalación o regenerar un lock no sería recuperación exacta.

H y B sí contienen el mismo patch de Wouter (918 bytes), y los lockfiles lo referencian. La aplicabilidad completa del patch depende del árbol de dependencias original; no se comprobó ejecutándolo.

### 5.2 Drizzle: límites de recuperación

- La ruta `drizzle/schema.ts` está demostrada por imports actuales y configuración estructurada. A conserva el esquema reciente: **no debe reemplazarse por el de H/B**.
- `drizzle.config.ts` H/B es idéntico y recuperable como candidato.
- H/B aportan el inicio del historial; A aporta SQL sueltos hasta `0051`.
- Los huecos exteriores A son `0000`, `0018–0022` y `0034`. H/B aportan `0000`; no completan los demás.
- Un salto de numeración no prueba por sí solo que una migración se aplicó ni autoriza inventar una migración. Hace falta el journal y los metadatos del checkpoint.
- El contenido SQL y los snapshots afectan MJP CORE y otros dominios. Identificar un archivo no autoriza copiarlo, adaptarlo, regenerarlo o ejecutarlo.

### 5.3 Assets y PWA

Las URL `/manus-storage/...` son claves de un servicio: no prueban que el archivo perteneciera a `client/public` o `attached_assets`. No se transforman automáticamente en rutas locales.

A conserva `sw.js`, `territorial-map-sw.js`, `manifest.webmanifest` y `offline.html`; son contenido existente, no huecos. Las referencias de `index.html`, `main.tsx`, `TerritorialFieldTools.tsx` y `publicDir` permiten identificar su exposición prevista desde `client/public/`. Recuperar su ubicación no valida su política de caché.

El GLB principal no está en ningún paquete. Tampoco existe un manifiesto que ligue inequívocamente cada PNG/WebP/JPG plano con las claves externas referenciadas. Las capturas, renders y generadores no reemplazan originales aprobados ni acreditan su licencia o versión.

No se descargaron assets externos. Las URL de ejemplo —como `https://ejemplo.com/lukita-candidato.glb`— son placeholders y no se cuentan como archivos productivos perdidos. Las teselas de mapa son recursos de red, no código local recuperable.

## 6. Colisiones de nombres y desambiguación

### 6.1 Colisiones funcionales por eliminación de carpetas

| Nombre plano | Contenido que conserva A / destino identificado | Otra ruta esperada perdida | Evidencia y decisión |
|---|---|---|---|
| `index.ts` | `server/simulator/index.ts` | `server/_core/index.ts` | Igualdad binaria con B:simulator; script dev/build pide _core. No reemplazar simulador por servidor. |
| `trpc.ts` | `client/src/lib/trpc.ts` | `server/_core/trpc.ts` | Cliente createTRPCReact frente a initTRPC/router/procedures. |
| `const.ts` | `shared/const.ts` | `client/src/const.ts` | A es idéntico a B:shared; startLogin vive en cliente H/B. |
| `types.ts` | `server/simulator/types.ts` | `shared/types.ts` | Igualdad binaria con el simulador B; H/B:shared reexporta tipos comunes. |
| `territorialTrust.ts` | `shared/territorialTrust.ts` | `server/territorialTrust.ts` | Constantes/validadores frente a funciones persistentes importadas por routers/arAssets. |
| `auditGovernance.ts` | `shared/auditGovernance.ts` | `server/auditGovernance.ts` | Estados/predicados frente a autorización y registro persistente. |
| `controllerLab.ts` | `shared/controllerLab.ts` | `server/controllerLab.ts` | Contrato de roles/comandos frente a servicio de sesiones. |
| `lukaShare.ts` | `shared/lukaShare.ts` | `server/lukaShare.ts` | Normalización frente a resolución/creación/revocación de targets. |
| `agentRouter.ts` | `shared/agentRouter.ts` | `server/agentRouter.ts` | A:RESCUE_AUDIT_001.md:200 distingue ambos; routers solicita el adaptador que falta. |
| `fieldVoiceCopilot.ts` | `server/fieldVoiceCopilot.ts` | `shared/fieldVoiceCopilot.ts` | El archivo A importa explícitamente el contrato shared que no contiene. |
| `onlineTvGames.ts` | `server/routers/onlineTvGames.ts` | `server/onlineTvGames.ts` y `shared/onlineTvGames.ts` | Tres responsabilidades, un solo archivo superviviente. |
| `health.ts` | `shared/health.ts` | `server/_core/health.ts` | A exporta buildUnifiedHealth; B implementa registerHealthRoutes. |
| `lukitaScripts.ts` | `shared/lukitaScripts.ts` | `server/lukitaScripts.ts` | Contrato/plantillas frente a servicio de versiones. |
| `identityParticipation.ts` | `shared/identityParticipation.ts` | `server/identityParticipation.ts` | A conserva estados/eligibilidad; routers solicita persistencia. |
| `bossFight.ts` | `shared/bossFight.ts` | `server/routers/bossFight.ts` | A contiene BossState/BossHitInput, no bossFightRouter. |
| `lukitaScripts.test.ts` | `shared/lukitaScripts.test.ts` | `server/lukitaScripts.test.ts` | El test A importa DEFAULT_LUKITA_SCRIPTS/renderLukitaScript; inventario documental distingue ambos. |

La evidencia demuestra que estas responsabilidades requieren archivos diferentes. No demuestra qué herramienta o evento exacto eliminó cada variante durante la exportación.

### 6.2 Colisiones por mayúsculas/minúsculas

| Entradas distintas en A | Destinos documentados/contrastados | Riesgo |
|---|---|---|
| `AuditorAgent.ts` / `auditorAgent.ts` | `server/auditor/AuditorAgent.ts` / `server/auditorAgent.ts` | Sobrescritura si se materializan planas en un filesystem sin distinción de caso. |
| `ExperienceDirector.ts` / `experienceDirector.ts` | `server/experience/ExperienceDirector.ts` / `shared/experienceDirector.ts` | Clase adaptadora y contrato compartido son distintos. |
| `AuditorAgent.test.ts` / `auditorAgent.test.ts` | `server/auditor/AuditorAgent.test.ts` / `server/auditorAgent.test.ts` | Diferentes pruebas; no fusionar por nombre. |
| `Pasted_content.txt` / `pasted_content.txt` | Ubicaciones originales no demostradas | Documentos distintos; AMBIGUOUS para su ubicación original. |

`pasted_content_39.txt` y `pasted_content_40.txt` tienen bytes idénticos. Es duplicación de contenido, distinta de una colisión de nombre. No se eliminó ninguno.

### 6.3 Qué no hacer con una colisión

No existe una regla segura «copiar el archivo más reciente con ese nombre». La unidad correcta es **ruta completa + símbolos/contrato + procedencia + hash**. Tampoco corresponde «subir» todos los `.ts` a server ni todos los contratos a shared solo por su tamaño.

## 7. Rutas ciertas, declaradas y pendientes

### 7.1 Rutas esperadas demostradas por configuración/código

| Ruta o familia | Evidencia concreta | Certeza alcanzada |
|---|---|---|
| `server/_core/index.ts` | A:package.json dev/build; A:api.e2e.test.ts; H/B reales | Ruta cierta; contenido reciente ausente. |
| `client/index.html` y `client/src/main.tsx` | A:vite.config.ts root client; A:index.html /src/main.tsx; H/B | Ruta cierta. |
| `client/src/App.tsx` | A:main.tsx → ./App; H/B | Ruta cierta. |
| `client/src/pages/...` | A:App.tsx imports @/pages y alias @ de Vite/Vitest | Destinos importados ciertos; no implica funcionamiento. |
| `client/src/components/...` | Imports @/components con alias explícito | Destinos concretos listados en anexo. |
| `client/src/lib/trpc.ts` | A:main.tsx y páginas → @/lib/trpc; igualdad con B | Identificación del archivo cliente cierta. |
| `server/routers.ts` | H/B; import del servidor y tipos AppRouter | Destino del router reciente identificado. |
| `server/territorialTrust.ts`, `server/auditGovernance.ts`, `server/controllerLab.ts`, `server/lukaShare.ts` | A:routers.ts imports relativos y símbolos ausentes en shared | Rutas ciertas; no se recuperan sus cuerpos. |
| `shared/fieldVoiceCopilot.ts` | A:server/fieldVoiceCopilot.ts imports relativos; routers importa sus constantes | Ruta cierta; contenido ausente. |
| `server/routers/onlineTvGames.ts`, `server/onlineTvGames.ts`, `shared/onlineTvGames.ts` | Imports del router y exports conservados | Desambiguación cierta. |
| `drizzle/schema.ts` | A:db.ts y otros → ../drizzle/schema; H/B:drizzle.config.ts | Ruta cierta; conservar versión A sin modificar. |
| `server/simulator/index.ts` y sus dependencias | A:package.json; igualdad de bytes A/B de index, config, engine, database, etc. | Identificación exacta de candidatos conservados. |
| `patches/wouter@3.7.1.patch` | A:package.json + H/B | Ruta y candidato ciertos. |
| `client/public/` | A:vite.config.ts publicDir; URLs raíz de PWA | Raíz cierta; solo ubicar archivos con referencia demostrada. |
| `attached_assets/` | A:vite.config.ts alias @assets | Raíz prevista cierta; asignación de cada imagen no determinada. |
| `dist/index.js` y `dist/public/` | A:package.json y vite.config.ts | Destinos de build, no fuentes para reconstruir. |

### 7.2 Rutas adicionales declaradas con evidencia, sin inventar carpetas

Los documentos y campos `evidencePaths` aportan rutas para archivos sin consumidor activo encontrado:

- `A:agentRegistry.ts:31–35` identifica `server/financial/FinancialIntelligenceAgent.ts`, `server/experience/ExperienceDirector.ts`, `server/auditor/AuditorAgent.ts`, `server/watchdog/WatchdogAgent.ts` y `server/recovery/RecoveryEngine.ts`.
- `A:RESCUE_AUDIT_001.md:200` distingue `shared/agentRouter.ts` y `server/agentRouter.ts`.
- `A:LUKA_AUDITORIA_TOTAL_FASE_0_2026-09-01.md` identifica `server/realtime/websocketServer.ts`, `shared/experienceOrchestrator.ts` y variantes de tests.
- La coincidencia de funciones e imports permite desambiguar shared/health, shared/identityParticipation y shared/bossFight frente a los servicios que no sobreviven.

Estas son **rutas declaradas y corroborables**, no prueba de que los módulos se montaban en el servidor reciente. No se usan documentos históricos como autoridad para aprobar un comportamiento.

### 7.3 Casos que siguen sin certeza suficiente

- Ubicación original de imágenes externas respecto de los archivos planos.
- Carpeta original de los prompts/transcripciones y varios scripts de reparación.
- Qué archivos de laboratorio eran parte del producto, piezas desconectadas o residuos de edición.
- Versión reciente de archivos conservados solo en H/B.
- Tags/snapshots/journal ausentes de Drizzle.
- Si un archivo referenciado únicamente en un informe histórico seguía perteneciendo al checkpoint reciente.

`new-territorial-field-map.tsx` y `map-jsx-fragment.txt` no se convierten por nombre en sustitutos de `TerritorialFieldTools.tsx`. El módulo de fuente vigente tiene imports y consumidores propios.

## 8. Porcentajes aproximados y reproducibles

### 8.1 Estructura recuperable: mínimo identificado

Se tomó como universo medido **442 entradas TS/TSX de A**, sin incluir imágenes, documentos, SQL, bundles JS ni los paquetes históricos como si fueran recientes.

El índice conservador del anexo A identifica **257 rutas esperadas**:

| Evidencia del índice | Cantidad |
|---|---:|
| Coincidencia binaria con una ruta estructurada H/B | 73 |
| Ruta histórica única y símbolos/default export concordantes | 21 |
| Resolución de imports/aliases desde rutas ancladas | 163 |
| Total del índice | 257 |

- Estructura identificada incluyendo tests: **257 / 442 = 58,1 %**.
- A contiene 149 archivos con nombre de test; quedan **293 TS/TSX sin sufijo test/spec**.
- De ellos, el índice sitúa **240 / 293 = 81,9 %**.
- Solo **17 / 149** tests entran en ese índice conservador. La cifra baja refleja el criterio de ruta, no desaparición de sus bytes.
- Las rutas adicionales de la sección 7.2 no se suman a esos porcentajes para evitar presentar una inferencia documental como coincidencia binaria.

Por tanto, una estimación prudente de estructura de **fuentes no-test** es **al menos aproximadamente 82 % del material reciente suministrado**. Incluyendo tests, el mínimo directamente indexado es aproximadamente 58 %. No se afirma haber recuperado el 82 % de todas las carpetas originales del workspace.

### 8.2 Código faltante recuperable: 37 archivos del perímetro R

| Medición | A + H | A + H + B |
|---|---:|---:|
| Candidato fuente existente, con o sin adaptación | 23/37 = 62,2 % | 25/37 = 67,6 % |
| Candidato clasificable EXACT, sin reescritura de contenido | 21/37 = 56,8 % | 23/37 = 62,2 % |
| Bases que necesitan adaptación | 2/37 = 5,4 % | 2/37 = 5,4 % |
| Sin candidato en las fuentes estructuradas | 14/37 = 37,8 % | 12/37 = 32,4 % |

La mejora de B dentro de este perímetro corresponde a accesibilidad y health HTTP. Otras mejoras de B —icono PWA, historial hasta 0017 y scripts— se reflejan en la matriz complementaria, no se mezclan con este denominador.

**Estimación de código faltante recuperable sin inventar implementación: aproximadamente 62 % del perímetro R con los tres paquetes.** Si se permite trabajo futuro de adaptación, hay bases para aproximadamente 68 %, pero eso ya no sería recuperación exacta del checkpoint.

Los 53 TS/TSX no-test de A que quedan fuera del índice estructural siguen teniendo contenido en el ZIP. No se clasifican como código perdido. Tampoco se usa el volumen de documentación, imágenes o builds para inflar la recuperación de código.

No se puede dar un porcentaje global fiable de **código reciente exacto**: falta el manifiesto/hash del workspace original y no hay garantía de que cada candidato histórico sea la última revisión. Este límite es distinto de la estimación aproximada por archivos anterior.

### 8.3 Código crítico no recuperable

Perímetro crítico de 15 archivos: **R17, R19, R21–R29, R31–R34**.

- **12/15 = 80,0 %** carecen de cuerpo fuente candidato en A/H/B.
- **2/15 = 13,3 %** tienen una base anterior que necesita adaptación: entrada servidor y tRPC.
- **1/15 = 6,7 %** tiene candidato recuperable sin reescritura: health HTTP.

«80 %» mide **archivos críticos seleccionados sin candidato**, no porcentaje de MJP CORE perdido ni porcentaje de seguridad inexistente. Parte sustancial del núcleo sobrevive en A; no se tocó.

Lockfile, journal, snapshots y assets críticos no se incluyen en ese 80 %: se encuentran en la matriz complementaria y mantienen sus bloqueos propios.

## 9. Qué sería recuperable localmente y qué debe esperar

### 9.1 Recuperación material futura de bajo riesgo, después de autorización

- Restaurar ubicación de archivos recientes cuyo destino esté sustentado por hash/imports, manteniendo bytes y distinción de mayúsculas.
- Recuperar utilidades y componentes UI EXACT de H/B, con inventario de procedencia.
- Recuperar los candidatos concretos de tsconfig, Drizzle config y patch, sin ejecutarlos.
- Recuperar icono PWA y archivos estáticos con correspondencia comprobada.
- Mantener por separado versiones y candidatos en un inventario de recuperación; no sobrescribir una variante con otra por nombre.

Esto describe posibilidades de recuperación, **no acciones realizadas ni autorización implícita para ejecutarlas**. Las filas EXACT que pertenecen a configuración de BD o código protegido siguen sujetas a MJP CORE: NO TOCAR.

### 9.2 Trabajo que exige Manus o revisión original

Solicitar del **mismo checkpoint**:

1. `server/_core/index.ts` y `server/_core/trpc.ts` completos, para evitar adaptar a ciegas el montaje y la autorización.
2. Los 12 archivos MUST de R, incluidos todos los servicios/contratos homónimos.
3. `package.json`, `pnpm-lock.yaml`, configuración pnpm aplicable y patch exactos del checkpoint.
4. `drizzle/meta/_journal.json`, snapshots, SQL y configuración asociados; no reconstruir historial a partir del esquema final.
5. Objetos de almacenamiento necesarios, manifiesto de claves y versiones; especialmente el GLB.
6. Árbol de archivos y hashes del workspace, preservando mayúsculas/minúsculas, para verificar que la recuperación es del mismo estado.
7. Fuentes/tests actuales de los componentes con solo evidencia documental o candidatos divergentes.

No se necesitan nuevos agentes para obtener esa evidencia. Mapper, The Eye, Voice, AR, TV, Gesture, Intent, Security y Universal Interaction siguen tratándose como capacidades, servicios o superficies según el código, no se convierten en agentes.

### 9.3 MJP CORE, autoridad y capacidades no encontradas

- El núcleo reciente conservado —`pilot.ts`, esquema, reglas, matemáticas, ledger, liquidación y manifest— no se reemplaza por versiones históricas.
- Recuperar un archivo no autoriza ejecutar workers, publicar reglas, liquidar rondas ni activar juegos.
- Human Authority conserva la autoridad final. No se suple con un flag, un QR, un estado VERIFIED ni una automatización.
- VERIFIED no equivale a PUBLISHED. No se reconstruyen guards ni publicación desde formularios o tests.
- No encontré una implementación WebRTC ni HAND que recuperar en los tres paquetes. No hay una ruta fuente concreta demostrada para ellos y no se inventa. Su ausencia no bloquea identificar el transporte WebSocket que sí sobrevive.
- No se implementó WebRTC, HAND, una vulnerabilidad corregida ni un nuevo flujo de autenticación.

## 10. Criterio para una siguiente etapa

Antes de autorizar una reconstrucción se debe decidir entre recuperar el checkpoint original o producir, expresamente, una adaptación nueva. Mezclar ambas cosas impediría afirmar qué fue recuperado y qué se inventó.

Una recuperación verificable requiere: origen por archivo, hash de entrada/salida, ruta completa, conservación de colisiones y una lista explícita de huecos todavía pendientes. La compilación y las pruebas vendrían después, bajo autorización y en entorno de pruebas; no forman parte de este documento.

**Decisión de esta tarea: no reconstruir todavía. Documento finalizado y trabajo detenido, a la espera de autorización.**

## Anexo A. Índice conservador de rutas del material reciente

Este índice contiene exactamente las 257 asignaciones usadas en el porcentaje estructural. Cada fila corresponde a bytes ya presentes en A; **no es una lista de archivos creados ni una clasificación de faltantes**.

HASH = contenido idéntico en una ruta estructurada H/B. HIST/SÍMBOLOS = ruta histórica única más concordancia funcional, sin igualdad de revisión. IMPORT = ruta resultante del import citado y aliases configurados.

| Entrada A | Ruta esperada | Evidencia del índice |
|---|---|---|
| `useAuth.ts` | `client/src/_core/hooks/useAuth.ts` | HASH H/B |
| `App.tsx` | `client/src/App.tsx` | HIST/SÍMBOLOS H/B |
| `AgentAutonomyPlanPanel.tsx` | `client/src/components/AgentAutonomyPlanPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/AgentAutonomyPlanPanel |
| `AgentPermissionsPanel.tsx` | `client/src/components/AgentPermissionsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/AgentPermissionsPanel |
| `AgentRegistryPanel.tsx` | `client/src/components/AgentRegistryPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/AgentRegistryPanel |
| `AuditReportsPanel.tsx` | `client/src/components/AuditReportsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/AuditReportsPanel |
| `AutonomyControlPanel.tsx` | `client/src/components/AutonomyControlPanel.tsx` | IMPORT Operations.tsx -> @/components/AutonomyControlPanel |
| `AutonomyMonitoringPanel.tsx` | `client/src/components/AutonomyMonitoringPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/AutonomyMonitoringPanel |
| `BossFightTestPanel.tsx` | `client/src/components/BossFightTestPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/BossFightTestPanel |
| `Logo.tsx` | `client/src/components/Brand/Logo.tsx` | IMPORT BrandPreviewPanel.tsx -> ./Brand/Logo |
| `LukitaAvatar.tsx` | `client/src/components/Brand/LukitaAvatar.tsx` | IMPORT BrandPreviewPanel.tsx -> ./Brand/LukitaAvatar |
| `BrandPreviewPanel.tsx` | `client/src/components/BrandPreviewPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/BrandPreviewPanel |
| `BroadcastAccessGuide.tsx` | `client/src/components/BroadcastAccessGuide.tsx` | IMPORT BroadcastPage.tsx -> @/components/BroadcastAccessGuide |
| `BroadcastOperationsPanel.tsx` | `client/src/components/BroadcastOperationsPanel.tsx` | IMPORT Operations.tsx -> @/components/BroadcastOperationsPanel |
| `BroadcastTestLab.tsx` | `client/src/components/BroadcastTestLab.tsx` | IMPORT BroadcastOperationsPanel.tsx -> @/components/BroadcastTestLab |
| `CanonicalGlossaryPanel.tsx` | `client/src/components/CanonicalGlossaryPanel.tsx` | IMPORT PilotLayout.tsx -> ./CanonicalGlossaryPanel |
| `CharacterDecisionMonitor.tsx` | `client/src/components/CharacterDecisionMonitor.tsx` | IMPORT ControlRoom.tsx -> @/components/CharacterDecisionMonitor |
| `CharacterEventLogPanel.tsx` | `client/src/components/CharacterEventLogPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/CharacterEventLogPanel |
| `CharacterExperiencePanel.tsx` | `client/src/components/CharacterExperiencePanel.tsx` | IMPORT ControlRoom.tsx -> @/components/CharacterExperiencePanel |
| `ConsolidationStatusPanel.tsx` | `client/src/components/ConsolidationStatusPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/ConsolidationStatusPanel |
| `ConstitutionalContractReviewPanel.tsx` | `client/src/components/ConstitutionalContractReviewPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/ConstitutionalContractReviewPanel |
| `ConstitutionalOrgChartPanel.tsx` | `client/src/components/ConstitutionalOrgChartPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/ConstitutionalOrgChartPanel |
| `DashboardLayout.tsx` | `client/src/components/DashboardLayout.tsx` | HIST/SÍMBOLOS H/B |
| `DistributionOsPanel.tsx` | `client/src/components/DistributionOsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/DistributionOsPanel |
| `EntertainmentOsHelpPanel.tsx` | `client/src/components/EntertainmentOsHelpPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/EntertainmentOsHelpPanel |
| `ExperienceAgentProposalsPanel.tsx` | `client/src/components/ExperienceAgentProposalsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/ExperienceAgentProposalsPanel |
| `FailSafeAlertsPanel.tsx` | `client/src/components/FailSafeAlertsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/FailSafeAlertsPanel |
| `FinancialTaxIntelligencePanel.tsx` | `client/src/components/FinancialTaxIntelligencePanel.tsx` | IMPORT ControlRoom.tsx -> @/components/FinancialTaxIntelligencePanel |
| `HumanAuthorityDocumentsPanel.tsx` | `client/src/components/HumanAuthorityDocumentsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/HumanAuthorityDocumentsPanel |
| `IdentityParticipationPanel.tsx` | `client/src/components/IdentityParticipationPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/IdentityParticipationPanel |
| `IntelligenceAgentsPanel.tsx` | `client/src/components/IntelligenceAgentsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/IntelligenceAgentsPanel |
| `LiveChannelPanel.tsx` | `client/src/components/LiveChannelPanel.tsx` | IMPORT BroadcastPage.tsx -> @/components/LiveChannelPanel |
| `LrciReviewCasesPanel.tsx` | `client/src/components/LrciReviewCasesPanel.tsx` | IMPORT AutonomyControlPanel.tsx -> ./LrciReviewCasesPanel |
| `LukaUniversalEntry.tsx` | `client/src/components/LukaUniversalEntry.tsx` | IMPORT App.tsx -> @/components/LukaUniversalEntry |
| `LukitaBlockoutViewer.tsx` | `client/src/components/LukitaBlockoutViewer.tsx` | IMPORT Lukita3DStudioPage.tsx -> @/components/LukitaBlockoutViewer |
| `LukitaGeoPlacementPanel.tsx` | `client/src/components/LukitaGeoPlacementPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/LukitaGeoPlacementPanel |
| `LukitaScriptsPanel.tsx` | `client/src/components/LukitaScriptsPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/LukitaScriptsPanel |
| `ManifestConnectionStatus.tsx` | `client/src/components/ManifestConnectionStatus.tsx` | IMPORT BroadcastPage.tsx -> @/components/ManifestConnectionStatus |
| `ManifestStatsPanel.tsx` | `client/src/components/ManifestStatsPanel.tsx` | IMPORT BroadcastPage.tsx -> @/components/ManifestStatsPanel |
| `ManifestTestPanel.tsx` | `client/src/components/ManifestTestPanel.tsx` | IMPORT BroadcastPage.tsx -> @/components/ManifestTestPanel |
| `Map.tsx` | `client/src/components/Map.tsx` | HIST/SÍMBOLOS H/B |
| `MarketingIntelligencePanel.tsx` | `client/src/components/MarketingIntelligencePanel.tsx` | IMPORT ControlRoom.tsx -> @/components/MarketingIntelligencePanel |
| `MasterFlowMonitor.tsx` | `client/src/components/MasterFlowMonitor.tsx` | IMPORT ControlRoom.tsx -> @/components/MasterFlowMonitor |
| `MasterOrderStatusPanel.tsx` | `client/src/components/MasterOrderStatusPanel.tsx` | IMPORT ControlRoom.tsx -> @/components/MasterOrderStatusPanel |
| `MiLukitaCircularQR.tsx` | `client/src/components/MiLukitaCircularQR.tsx` | IMPORT BroadcastPage.tsx -> @/components/MiLukitaCircularQR |
| `MobileShell.tsx` | `client/src/components/MobileShell.tsx` | IMPORT App.tsx -> ./components/MobileShell |
| `OnlineTvConfigProfiles.tsx` | `client/src/components/OnlineTvConfigProfiles.tsx` | IMPORT OnlineTvGamesPage.tsx -> @/components/OnlineTvConfigProfiles |
| `PilotLayout.tsx` | `client/src/components/PilotLayout.tsx` | HIST/SÍMBOLOS H/B |
| `ProductAnalyticsBeacon.tsx` | `client/src/components/ProductAnalyticsBeacon.tsx` | IMPORT App.tsx -> ./components/ProductAnalyticsBeacon |
| `ProgramSchedulePanel.tsx` | `client/src/components/ProgramSchedulePanel.tsx` | IMPORT Operations.tsx -> @/components/ProgramSchedulePanel |
| `PwaInstallButton.tsx` | `client/src/components/PwaInstallButton.tsx` | HIST/SÍMBOLOS H/B |
| `PwaInstallNudge.tsx` | `client/src/components/PwaInstallNudge.tsx` | HIST/SÍMBOLOS H/B |
| `RealtimePlayerLobby.tsx` | `client/src/components/RealtimePlayerLobby.tsx` | IMPORT GamePage.tsx -> @/components/RealtimePlayerLobby |
| `StagingFinancePanel.tsx` | `client/src/components/StagingFinancePanel.tsx` | HASH H/B |
| `TerritorialFieldTools.tsx` | `client/src/components/TerritorialFieldTools.tsx` | IMPORT TerritorialTrustPage.tsx -> @/components/TerritorialFieldTools |
| `TerritorialManuals.tsx` | `client/src/components/TerritorialManuals.tsx` | IMPORT TerritorialTrustPage.tsx -> @/components/TerritorialManuals |
| `TerritorialPilotConsole.tsx` | `client/src/components/TerritorialPilotConsole.tsx` | IMPORT TerritorialTrustPage.tsx -> @/components/TerritorialPilotConsole |
| `TimerPaletteAdminPanel.tsx` | `client/src/components/TimerPaletteAdminPanel.tsx` | IMPORT AutonomyControlPanel.tsx -> ./TimerPaletteAdminPanel |
| `TouchGuide.tsx` | `client/src/components/TouchGuide.tsx` | HIST/SÍMBOLOS H/B |
| `TvAgentsStatus.tsx` | `client/src/components/TvAgentsStatus.tsx` | IMPORT BroadcastPage.tsx -> @/components/TvAgentsStatus |
| `TVBrandGuide.tsx` | `client/src/components/TVBrandGuide.tsx` | IMPORT BroadcastPage.tsx -> @/components/TVBrandGuide |
| `TvHeartbeatStatus.tsx` | `client/src/components/TvHeartbeatStatus.tsx` | IMPORT BroadcastPage.tsx -> @/components/TvHeartbeatStatus |
| `TvMaintenanceScreen.tsx` | `client/src/components/TvMaintenanceScreen.tsx` | IMPORT BroadcastPage.tsx -> @/components/TvMaintenanceScreen |
| `TvModeStartScreen.tsx` | `client/src/components/TvModeStartScreen.tsx` | IMPORT BroadcastPage.tsx -> @/components/TvModeStartScreen |
| `TvRemoteNeon.tsx` | `client/src/components/TvRemoteNeon.tsx` | IMPORT controlRoomAccessibility.test.ts -> @/components/TvRemoteNeon |
| `TvScreensaver.tsx` | `client/src/components/TvScreensaver.tsx` | IMPORT BroadcastPage.tsx -> @/components/TvScreensaver |
| `button.tsx` | `client/src/components/ui/button.tsx` | HASH H/B |
| `dialog.tsx` | `client/src/components/ui/dialog.tsx` | HASH H/B |
| `sheet.tsx` | `client/src/components/ui/sheet.tsx` | HASH H/B |
| `sonner.tsx` | `client/src/components/ui/sonner.tsx` | HASH H/B |
| `tooltip.tsx` | `client/src/components/ui/tooltip.tsx` | HASH H/B |
| `LanguageContext.tsx` | `client/src/contexts/LanguageContext.tsx` | HIST/SÍMBOLOS H/B |
| `ThemeContext.tsx` | `client/src/contexts/ThemeContext.tsx` | HASH H/B |
| `games.ts` | `client/src/data/games.ts` | HASH H/B |
| `useCountdown.ts` | `client/src/hooks/useCountdown.ts` | IMPORT BroadcastPage.tsx -> @/hooks/useCountdown |
| `useRealtimePlayer.ts` | `client/src/hooks/useRealtimePlayer.ts` | IMPORT OnlineTvGamesPage.tsx -> @/hooks/useRealtimePlayer |
| `useTvRemoteNavigation.ts` | `client/src/hooks/useTvRemoteNavigation.ts` | IMPORT BroadcastPage.tsx -> @/hooks/useTvRemoteNavigation |
| `accessibility.test.ts` | `client/src/lib/accessibility.test.ts` | HASH H/B |
| `constitutionalOrgChartExport.ts` | `client/src/lib/constitutionalOrgChartExport.ts` | IMPORT ConstitutionalOrgChartPanel.tsx -> @/lib/constitutionalOrgChartExport |
| `customQrGenerator.ts` | `client/src/lib/customQrGenerator.ts` | IMPORT QrGeneratorPage.tsx -> @/lib/customQrGenerator |
| `practiceSimulator.test.ts` | `client/src/lib/practiceSimulator.test.ts` | HASH H/B |
| `practiceSimulator.ts` | `client/src/lib/practiceSimulator.ts` | HASH H/B |
| `sha256.ts` | `client/src/lib/sha256.ts` | IMPORT QrGeneratorPage.tsx -> @/lib/sha256 |
| `trpc.ts` | `client/src/lib/trpc.ts` | HASH H/B |
| `main.tsx` | `client/src/main.tsx` | HASH H/B |
| `AuditSummaryPage.tsx` | `client/src/pages/AuditSummaryPage.tsx` | IMPORT App.tsx -> @/pages/AuditSummaryPage |
| `BatchHistoryPage.tsx` | `client/src/pages/BatchHistoryPage.tsx` | HASH H/B |
| `BroadcastPage.tsx` | `client/src/pages/BroadcastPage.tsx` | IMPORT App.tsx -> @/pages/BroadcastPage |
| `CommercialPage.tsx` | `client/src/pages/CommercialPage.tsx` | IMPORT App.tsx -> @/pages/CommercialPage |
| `ConstitutionalOrgChartPage.tsx` | `client/src/pages/ConstitutionalOrgChartPage.tsx` | IMPORT App.tsx -> @/pages/ConstitutionalOrgChartPage |
| `ControlRoom.tsx` | `client/src/pages/ControlRoom.tsx` | IMPORT App.tsx -> @/pages/ControlRoom |
| `GamePage.tsx` | `client/src/pages/GamePage.tsx` | HIST/SÍMBOLOS H/B |
| `Home.tsx` | `client/src/pages/Home.tsx` | HIST/SÍMBOLOS H/B |
| `LearnPage.tsx` | `client/src/pages/LearnPage.tsx` | HASH H/B |
| `LukaContextQrPage.tsx` | `client/src/pages/LukaContextQrPage.tsx` | IMPORT App.tsx -> @/pages/LukaContextQrPage |
| `Lukita3DStudioPage.tsx` | `client/src/pages/Lukita3DStudioPage.tsx` | IMPORT App.tsx -> @/pages/Lukita3DStudioPage |
| `LukitaARStagePage.tsx` | `client/src/pages/LukitaARStagePage.tsx` | IMPORT App.tsx -> @/pages/LukitaARStagePage |
| `MultiMarketPage.tsx` | `client/src/pages/MultiMarketPage.tsx` | HASH H/B |
| `OnlineTvGamesPage.tsx` | `client/src/pages/OnlineTvGamesPage.tsx` | IMPORT App.tsx -> @/pages/OnlineTvGamesPage |
| `Operations.tsx` | `client/src/pages/Operations.tsx` | HIST/SÍMBOLOS H/B |
| `Profile.tsx` | `client/src/pages/Profile.tsx` | HIST/SÍMBOLOS H/B |
| `QrGeneratorPage.tsx` | `client/src/pages/QrGeneratorPage.tsx` | IMPORT App.tsx -> @/pages/QrGeneratorPage |
| `RtpDashboardPage.tsx` | `client/src/pages/RtpDashboardPage.tsx` | HASH H/B |
| `SimplifiedGamesPage.tsx` | `client/src/pages/SimplifiedGamesPage.tsx` | HASH H/B |
| `SystemStatusPage.tsx` | `client/src/pages/SystemStatusPage.tsx` | IMPORT App.tsx -> @/pages/SystemStatusPage |
| `TerritorialFieldEntryPage.tsx` | `client/src/pages/TerritorialFieldEntryPage.tsx` | IMPORT App.tsx -> @/pages/TerritorialFieldEntryPage |
| `TerritorialTrustPage.tsx` | `client/src/pages/TerritorialTrustPage.tsx` | IMPORT App.tsx -> @/pages/TerritorialTrustPage |
| `TouchRemotePage.tsx` | `client/src/pages/TouchRemotePage.tsx` | IMPORT App.tsx -> @/pages/TouchRemotePage |
| `TransparenciaPage.tsx` | `client/src/pages/TransparenciaPage.tsx` | HASH H/B |
| `Verify.tsx` | `client/src/pages/Verify.tsx` | HIST/SÍMBOLOS H/B |
| `Wallet.tsx` | `client/src/pages/Wallet.tsx` | HASH H/B |
| `schema.ts` | `drizzle/schema.ts` | HIST/SÍMBOLOS H/B |
| `calculadora-rtp-todas.ts` | `scripts/calculadora-rtp-todas.ts` | HASH H/B |
| `reporte-ingresos-egresos.ts` | `scripts/reporte-ingresos-egresos.ts` | HASH H/B |
| `simulador-carga-50k.ts` | `scripts/simulador-carga-50k.ts` | HASH H/B |
| `context.ts` | `server/_core/context.ts` | HASH H/B |
| `cookies.ts` | `server/_core/cookies.ts` | HASH H/B |
| `env.ts` | `server/_core/env.ts` | HASH H/B |
| `heartbeat.ts` | `server/_core/heartbeat.ts` | HASH H/B |
| `llm.ts` | `server/_core/llm.ts` | HASH H/B |
| `oauth.ts` | `server/_core/oauth.ts` | HASH H/B |
| `requestMeta.ts` | `server/_core/requestMeta.ts` | HASH H/B |
| `sdk.ts` | `server/_core/sdk.ts` | HIST/SÍMBOLOS H/B |
| `security.ts` | `server/_core/security.ts` | HIST/SÍMBOLOS H/B |
| `securityHealth.test.ts` | `server/_core/securityHealth.test.ts` | HASH H/B |
| `storageProxy.ts` | `server/_core/storageProxy.ts` | HIST/SÍMBOLOS H/B |
| `systemRouter.ts` | `server/_core/systemRouter.ts` | HASH H/B |
| `vite.ts` | `server/_core/vite.ts` | HASH H/B |
| `voiceTranscription.ts` | `server/_core/voiceTranscription.ts` | HASH H/B |
| `arAssets.ts` | `server/arAssets.ts` | IMPORT routers.ts -> ./arAssets |
| `auditorAgent.ts` | `server/auditorAgent.ts` | IMPORT routers.ts -> ./auditorAgent |
| `auditReports.ts` | `server/auditReports.ts` | IMPORT routers.ts -> ./auditReports |
| `auth.logout.test.ts` | `server/auth.logout.test.ts` | HASH H/B |
| `autonomy.ts` | `server/autonomy.ts` | IMPORT routers.ts -> ./autonomy |
| `autonomyReport.ts` | `server/autonomyReport.ts` | IMPORT routers.ts -> ./autonomyReport |
| `bingoRecalibration.integration.test.ts` | `server/bingoRecalibration.integration.test.ts` | HASH H/B |
| `broadcast.ts` | `server/broadcast.ts` | IMPORT routers.ts -> ./broadcast |
| `constitutionalContract.ts` | `server/constitutionalContract.ts` | IMPORT routers.ts -> ./constitutionalContract |
| `db.ts` | `server/db.ts` | HASH H/B |
| `eventStore.ts` | `server/eventStore.ts` | IMPORT routers.ts -> ./eventStore |
| `ExperienceAgent.ts` | `server/experience/ExperienceAgent.ts` | IMPORT ExperienceAgentProposalsPanel.tsx -> ../../../server/experience/ExperienceAgent |
| `fieldGateReports.ts` | `server/fieldGateReports.ts` | IMPORT routers.ts -> ./fieldGateReports |
| `fieldVoiceCopilot.ts` | `server/fieldVoiceCopilot.ts` | IMPORT routers.ts -> ./fieldVoiceCopilot |
| `financialModel.test.ts` | `server/financialModel.test.ts` | HASH H/B |
| `live24Runtime.ts` | `server/live24Runtime.ts` | IMPORT routers.ts -> ./live24Runtime |
| `loteria39_5.test.ts` | `server/loteria39_5.test.ts` | HASH H/B |
| `lotteryVariants.integration.test.ts` | `server/lotteryVariants.integration.test.ts` | HASH H/B |
| `lotteryVariants.test.ts` | `server/lotteryVariants.test.ts` | HASH H/B |
| `lrciReviewCases.ts` | `server/lrciReviewCases.ts` | IMPORT routers.ts -> ./lrciReviewCases |
| `mjpExtra.test.ts` | `server/mjpExtra.test.ts` | HASH H/B |
| `newGames.test.ts` | `server/newGames.test.ts` | HASH H/B |
| `onlineTvPersistence.ts` | `server/onlineTvPersistence.ts` | IMPORT onlineTvGames.ts -> ../onlineTvPersistence |
| `pilot.test.ts` | `server/pilot.test.ts` | HASH H/B |
| `pilot.ts` | `server/pilot.ts` | HIST/SÍMBOLOS H/B |
| `productAnalytics.ts` | `server/productAnalytics.ts` | IMPORT routers.ts -> ./productAnalytics |
| `qrTimerPalettes.ts` | `server/qrTimerPalettes.ts` | IMPORT routers.ts -> ./qrTimerPalettes |
| `playerSessionManager.ts` | `server/realtime/playerSessionManager.ts` | IMPORT router.ts -> ./playerSessionManager |
| `router.ts` | `server/realtime/router.ts` | IMPORT routers.ts -> ./realtime/router |
| `persistentRewardLedger.ts` | `server/rewards/persistentRewardLedger.ts` | IMPORT rewards.ts -> ../rewards/persistentRewardLedger |
| `rewardLedger.ts` | `server/rewards/rewardLedger.ts` | IMPORT persistentRewardLedger.ts -> ./rewardLedger |
| `routers.ts` | `server/routers.ts` | HIST/SÍMBOLOS H/B |
| `onlineTvGames.ts` | `server/routers/onlineTvGames.ts` | IMPORT routers.ts -> ./routers/onlineTvGames |
| `rewards.ts` | `server/routers/rewards.ts` | IMPORT routers.ts -> ./routers/rewards |
| `scheduledGames.ts` | `server/scheduledGames.ts` | HIST/SÍMBOLOS H/B |
| `schedulerEngine.ts` | `server/schedulerEngine.ts` | IMPORT routers.ts -> ./schedulerEngine |
| `activateRecalibrationV120.ts` | `server/scripts/activateRecalibrationV120.ts` | HASH H/B |
| `analyzeLotteryVariants.ts` | `server/scripts/analyzeLotteryVariants.ts` | HASH H/B |
| `simplifiedGames.integration.test.ts` | `server/simplifiedGames.integration.test.ts` | HASH H/B |
| `config.ts` | `server/simulator/config.ts` | HASH H/B |
| `database.ts` | `server/simulator/database.ts` | HASH H/B |
| `engine.ts` | `server/simulator/engine.ts` | HASH H/B |
| `index.ts` | `server/simulator/index.ts` | HASH H/B |
| `loadGenerator.ts` | `server/simulator/loadGenerator.ts` | HASH H/B |
| `metricsCollector.ts` | `server/simulator/metricsCollector.ts` | HASH H/B |
| `random.ts` | `server/simulator/random.ts` | HASH H/B |
| `reporter.ts` | `server/simulator/reporter.ts` | HASH H/B |
| `simulator.test.ts` | `server/simulator/simulator.test.ts` | HASH H/B |
| `types.ts` | `server/simulator/types.ts` | HASH H/B |
| `storage.ts` | `server/storage.ts` | HASH H/B |
| `supervisedWorker.ts` | `server/supervisedWorker.ts` | IMPORT scheduledGames.ts -> ./supervisedWorker |
| `ticketIdentifiers.test.ts` | `server/ticketIdentifiers.test.ts` | HASH H/B |
| `voiceEngine.ts` | `server/voiceEngine.ts` | IMPORT routers.ts -> ./voiceEngine |
| `youtubeLive.ts` | `server/youtubeLive.ts` | IMPORT routers.ts -> ./youtubeLive |
| `agentAutonomyBacklog.ts` | `shared/agentAutonomyBacklog.ts` | IMPORT TouchRemotePage.tsx -> @/../../shared/agentAutonomyBacklog |
| `agentMap.ts` | `shared/agentMap.ts` | IMPORT AgentPermissionsPanel.tsx -> ../../../shared/agentMap |
| `agentRegistry.ts` | `shared/agentRegistry.ts` | IMPORT AgentRegistryPanel.tsx -> @/../../shared/agentRegistry |
| `agentRuntimeAutonomy.ts` | `shared/agentRuntimeAutonomy.ts` | IMPORT routers.ts -> ../shared/agentRuntimeAutonomy |
| `analyticsResilience.ts` | `shared/analyticsResilience.ts` | IMPORT ProductAnalyticsBeacon.tsx -> @shared/analyticsResilience |
| `arProductive.ts` | `shared/arProductive.ts` | IMPORT LukitaARStagePage.tsx -> ../../../shared/arProductive |
| `assistedPlans.ts` | `shared/assistedPlans.ts` | HASH H/B |
| `auditGovernance.ts` | `shared/auditGovernance.ts` | IMPORT routers.ts -> ../shared/auditGovernance |
| `auditSummary.ts` | `shared/auditSummary.ts` | IMPORT AuditSummaryPage.tsx -> ../../../shared/auditSummary |
| `autonomyDashboard.ts` | `shared/autonomyDashboard.ts` | IMPORT AutonomyMonitoringPanel.tsx -> ../../../shared/autonomyDashboard |
| `autonomySimulation.ts` | `shared/autonomySimulation.ts` | IMPORT autonomyReport.ts -> ../shared/autonomySimulation |
| `brandSystem.ts` | `shared/brandSystem.ts` | IMPORT PilotLayout.tsx -> ../../../shared/brandSystem |
| `canonicalGlossary.ts` | `shared/canonicalGlossary.ts` | IMPORT CanonicalGlossaryPanel.tsx -> ../../../shared/canonicalGlossary |
| `characterOs.ts` | `shared/characterOs.ts` | IMPORT CharacterDecisionMonitor.tsx -> ../../../shared/characterOs |
| `circularQr.ts` | `shared/circularQr.ts` | IMPORT QrGeneratorPage.tsx -> @/../../shared/circularQr |
| `commercialOs.ts` | `shared/commercialOs.ts` | IMPORT CommercialPage.tsx -> ../../../shared/commercialOs |
| `const.ts` | `shared/const.ts` | HASH H/B |
| `controllerLab.ts` | `shared/controllerLab.ts` | IMPORT routers.ts -> ../shared/controllerLab |
| `controlRoomSearch.ts` | `shared/controlRoomSearch.ts` | IMPORT ControlRoom.tsx -> ../../../shared/controlRoomSearch |
| `distributionOs.ts` | `shared/distributionOs.ts` | IMPORT DistributionOsPanel.tsx -> ../../../shared/distributionOs |
| `distributionReadiness.ts` | `shared/distributionReadiness.ts` | IMPORT DistributionOsPanel.tsx -> ../../../shared/distributionReadiness |
| `downloadCompat.ts` | `shared/downloadCompat.ts` | IMPORT Lukita3DStudioPage.tsx -> ../../../shared/downloadCompat |
| `entertainmentOs.ts` | `shared/entertainmentOs.ts` | IMPORT ExperienceAgentProposalsPanel.tsx -> ../../../shared/entertainmentOs |
| `eventEngine.ts` | `shared/eventEngine.ts` | IMPORT broadcast.ts -> ../shared/eventEngine |
| `experienceDirector.ts` | `shared/experienceDirector.ts` | IMPORT IntelligenceAgentsPanel.tsx -> ../../../shared/experienceDirector |
| `financialIntelligence.ts` | `shared/financialIntelligence.ts` | IMPORT IntelligenceAgentsPanel.tsx -> ../../../shared/financialIntelligence |
| `financialModel.ts` | `shared/financialModel.ts` | HASH H/B |
| `gameRegistry.ts` | `shared/gameRegistry.ts` | IMPORT routers.ts -> ../shared/gameRegistry |
| `identityAnalytics.ts` | `shared/identityAnalytics.ts` | IMPORT IdentityParticipationPanel.tsx -> ../../../shared/identityAnalytics |
| `kycAmlReadiness.ts` | `shared/kycAmlReadiness.ts` | HASH H/B |
| `legalAgent.ts` | `shared/legalAgent.ts` | IMPORT MasterOrderStatusPanel.tsx -> @/../../shared/legalAgent |
| `live24.ts` | `shared/live24.ts` | IMPORT live24Runtime.ts -> ../shared/live24 |
| `liveChannel.ts` | `shared/liveChannel.ts` | IMPORT routers.ts -> ../shared/liveChannel |
| `lotteryVariants.ts` | `shared/lotteryVariants.ts` | HASH H/B |
| `lukaControllerState.ts` | `shared/lukaControllerState.ts` | IMPORT universalController.ts -> ./lukaControllerState |
| `lukaControlPacks.ts` | `shared/lukaControlPacks.ts` | IMPORT lukaLaunchRegistry.ts -> ./lukaControlPacks |
| `lukaLaunchRegistry.ts` | `shared/lukaLaunchRegistry.ts` | IMPORT universalInteraction.ts -> ./lukaLaunchRegistry |
| `lukaOsContract.ts` | `shared/lukaOsContract.ts` | IMPORT LukaUniversalEntry.tsx -> ../../../shared/lukaOsContract |
| `lukaPresenceAdvanced.ts` | `shared/lukaPresenceAdvanced.ts` | IMPORT LukaUniversalEntry.tsx -> ../../../shared/lukaPresenceAdvanced |
| `lukaRuntimeContract.ts` | `shared/lukaRuntimeContract.ts` | IMPORT LukaUniversalEntry.tsx -> ../../../shared/lukaRuntimeContract |
| `lukaShare.ts` | `shared/lukaShare.ts` | IMPORT routers.ts -> ../shared/lukaShare |
| `lukita3dRecovery.ts` | `shared/lukita3dRecovery.ts` | IMPORT Lukita3DStudioPage.tsx -> ../../../shared/lukita3dRecovery |
| `lukita3dSpec.ts` | `shared/lukita3dSpec.ts` | IMPORT LukitaBlockoutViewer.tsx -> ../../../shared/lukita3dSpec |
| `lukitaGeoPlacement.ts` | `shared/lukitaGeoPlacement.ts` | IMPORT LukitaGeoPlacementPanel.tsx -> ../../../shared/lukitaGeoPlacement |
| `lukitaLiveArchitecture.ts` | `shared/lukitaLiveArchitecture.ts` | IMPORT ConstitutionalOrgChartPanel.tsx -> @/../../shared/lukitaLiveArchitecture |
| `lukitaPointPublication.ts` | `shared/lukitaPointPublication.ts` | IMPORT TouchRemotePage.tsx -> @/../../shared/lukitaPointPublication |
| `lukitaScripts.ts` | `shared/lukitaScripts.ts` | IMPORT routers.ts -> ../shared/lukitaScripts |
| `manifestTiming.ts` | `shared/manifestTiming.ts` | IMPORT QrGeneratorPage.tsx -> @/../../shared/manifestTiming |
| `manifestUi.ts` | `shared/manifestUi.ts` | IMPORT BroadcastPage.tsx -> ../../../shared/manifestUi |
| `marketingIntelligence.ts` | `shared/marketingIntelligence.ts` | IMPORT MarketingIntelligencePanel.tsx -> ../../../shared/marketingIntelligence |
| `milukitaConsolidation.ts` | `shared/milukitaConsolidation.ts` | IMPORT FailSafeAlertsPanel.tsx -> @/../../shared/milukitaConsolidation |
| `milukitaMasterOrder.ts` | `shared/milukitaMasterOrder.ts` | IMPORT ConstitutionalOrgChartPanel.tsx -> @/../../shared/milukitaMasterOrder |
| `observabilityContract.ts` | `shared/observabilityContract.ts` | IMPORT ControlRoom.tsx -> ../../../shared/observabilityContract |
| `qrExpiry.ts` | `shared/qrExpiry.ts` | IMPORT BroadcastPage.tsx -> ../../../shared/qrExpiry |
| `qrTimerPalette.ts` | `shared/qrTimerPalette.ts` | IMPORT customQrGenerator.ts -> @/../../shared/qrTimerPalette |
| `realtime.ts` | `shared/realtime.ts` | IMPORT useRealtimePlayer.ts -> @shared/realtime |
| `regulatoryReadiness.ts` | `shared/regulatoryReadiness.ts` | HASH H/B |
| `retentionEvents.ts` | `shared/retentionEvents.ts` | IMPORT ProductAnalyticsBeacon.tsx -> @shared/retentionEvents |
| `roundState.ts` | `shared/roundState.ts` | IMPORT pilot.ts -> ../shared/roundState |
| `simplifiedGames.test.ts` | `shared/simplifiedGames.test.ts` | HASH H/B |
| `simplifiedGames.ts` | `shared/simplifiedGames.ts` | HASH H/B |
| `smartTvSimulationContract.ts` | `shared/smartTvSimulationContract.ts` | IMPORT tvGamesProductive.ts -> ./smartTvSimulationContract |
| `territorialTrust.ts` | `shared/territorialTrust.ts` | IMPORT routers.ts -> ../shared/territorialTrust |
| `ticketIdentifiers.ts` | `shared/ticketIdentifiers.ts` | HASH H/B |
| `tvGamesProductive.ts` | `shared/tvGamesProductive.ts` | IMPORT OnlineTvGamesPage.tsx -> ../../../shared/tvGamesProductive |
| `tvManifest.ts` | `shared/tvManifest.ts` | IMPORT onlineTvGames.ts -> ../../shared/tvManifest |
| `universalController.ts` | `shared/universalController.ts` | IMPORT TouchRemotePage.tsx -> @/../../shared/universalController |
| `universalInteraction.ts` | `shared/universalInteraction.ts` | IMPORT universalController.ts -> ./universalInteraction |
| `virtualCredits.ts` | `shared/virtualCredits.ts` | HASH H/B |
| `virtualPrizeRounding.test.ts` | `shared/virtualPrizeRounding.test.ts` | HASH H/B |
| `virtualPrizeRounding.ts` | `shared/virtualPrizeRounding.ts` | HASH H/B |
| `voiceProductive.ts` | `shared/voiceProductive.ts` | IMPORT LukaUniversalEntry.tsx -> ../../../shared/voiceProductive |
| `vite.config.ts` | `vite.config.ts` | HIST/SÍMBOLOS H/B |
| `vitest.config.ts` | `vitest.config.ts` | HASH H/B |

## Anexo B. Entradas fuera del índice conservador

Las siguientes 185 entradas conservan sus bytes. «Fuera del índice» no significa MISSING_CURRENT ni demuestra que su ruta sea irrecuperable. Varias tienen evidencia adicional en la sección 7.2; no se sumaron al porcentaje automático. Las demás necesitan desambiguación del árbol original, especialmente tests y laboratorios.

- `activate-bingo-v101.ts`
- `activateLoteriaV101.ts`
- `agent-runtime-autonomy-test.ts`
- `agentAutonomyBacklog.test.ts`
- `agentGovernance.test.ts`
- `agentGovernance.ts`
- `agentMap.test.ts`
- `agentMaturityGate.test.ts`
- `agentMaturityGate.ts`
- `agentRegistry.test.ts`
- `agentRouter.test.ts`
- `agentRouter.ts`
- `agentRuntimeAutonomy.test.ts`
- `agentSafeCapability.test.ts`
- `agentSafeCapability.ts`
- `analyticsResilience.test.ts`
- `api.e2e.test.ts`
- `arAssets.test.ts`
- `arProductive.test.ts`
- `auditGovernance.test.ts`
- `auditorAgent.test.ts`
- `AuditorAgent.test.ts`
- `AuditorAgent.ts`
- `auditReports.test.ts`
- `auditSummary.test.ts`
- `autonomyDashboard.test.ts`
- `autonomyEngine.ts`
- `autonomyReport.test.ts`
- `autonomySimulation.test.ts`
- `avatarScripts.ts`
- `bossFight.ts`
- `bossFightEngine.test.ts`
- `bossFightEngine.ts`
- `BrandColors.ts`
- `brandSystem.test.ts`
- `broadcast.test.ts`
- `canonicalGlossary.test.ts`
- `ChaosEngine.ts`
- `characterOs.test.ts`
- `check-mjp-rtp.ts`
- `circularQr.test.ts`
- `CircularQrPreviewPage.tsx`
- `closeClaim.test.ts`
- `commercialOs.test.ts`
- `concurrencyIsolation.test.ts`
- `constitutionalOrgChartExport.test.ts`
- `content78Contracts.test.ts`
- `contentEngine.ts`
- `contingencyEngine.test.ts`
- `contingencyEngine.ts`
- `controllerLab.contract.test.ts`
- `controllerLab.test.ts`
- `controlRoomAccessibility.test.ts`
- `controlRoomSearch.test.ts`
- `customQrGenerator.test.ts`
- `distributionOs.test.ts`
- `distributionReadiness.test.ts`
- `downloadCompat.test.ts`
- `dualInstanceSimulation.test.ts`
- `dualInstanceSimulation.ts`
- `entertainmentOs.test.ts`
- `entertainmentOsAgents.test.ts`
- `entertainmentOsArchitecture.test.ts`
- `entertainmentOsModules.test.ts`
- `eventExperience.test.ts`
- `experienceDirector.test.ts`
- `ExperienceDirector.ts`
- `experienceEngine.test.ts`
- `experienceEngine.ts`
- `experienceQualityOs.ts`
- `faseBPresence.test.ts`
- `fieldGateReports.filters.test.ts`
- `fieldGateReports.test.ts`
- `fieldVoiceCopilot.test.ts`
- `financialIntelligence.test.ts`
- `FinancialIntelligenceAgent.ts`
- `financialOs.ts`
- `health.ts`
- `identityAnalytics.test.ts`
- `identityParticipation.test.ts`
- `identityParticipation.ts`
- `inspectRouter.ts`
- `inspectSecurityRouter.ts`
- `interactionEngine.ts`
- `legalAgent.test.ts`
- `legalComplianceAgent.test.ts`
- `legalComplianceAgent.ts`
- `live24.test.ts`
- `liveChannel.test.ts`
- `load-realtime-ws.ts`
- `load-realtime.ts`
- `loteriaRecalibration.integration.test.ts`
- `lrciReviewCaseContract.test.ts`
- `lukaControllerState.test.ts`
- `lukaControlPacks.test.ts`
- `LukaDevControlPanel.tsx`
- `lukaDevLabContract.test.ts`
- `lukaDevLabContract.ts`
- `lukaDevLabInteraction.test.ts`
- `lukaDevLabInteraction.ts`
- `lukaLaunchRegistry.test.ts`
- `lukaOsContract.test.ts`
- `lukaPresenceAdvanced.test.ts`
- `lukaRuntimeContract.test.ts`
- `LukaRuntimeLab.tsx`
- `lukaShare.test.ts`
- `lukaShareOrder59.test.ts`
- `lukita3dRecovery.test.ts`
- `lukita3dSpec.test.ts`
- `lukitaArStageContract.test.ts`
- `lukitaCharacterFoundation.test.ts`
- `lukitaCharacterFoundation.ts`
- `lukitaGeoGovernance.test.ts`
- `lukitaGeoGovernance.ts`
- `lukitaGeoPlacement.test.ts`
- `lukitaLiveArchitecture.test.ts`
- `lukitaLiveBoundaries.test.ts`
- `lukitaLiveBoundaries.ts`
- `lukitaLiveCaptureContract.test.ts`
- `lukitaLiveCaptureContract.ts`
- `lukitaPointPublication.test.ts`
- `lukitaScripts.test.ts`
- `LukitaVoiceEngine.ts`
- `manifestTiming.test.ts`
- `manifestUi.test.ts`
- `marketingIntelligence.test.ts`
- `milukitaConsolidation.test.ts`
- `milukitaMasterOrder.test.ts`
- `mjpCoreIsolation.test.ts`
- `new-territorial-field-map.tsx`
- `observabilityContract.test.ts`
- `onlineTvGames.replay.test.ts`
- `onlineTvGames.test.ts`
- `order25.e2e.test.ts`
- `order25Engines.test.ts`
- `p1HealthRecovery.test.ts`
- `playerSessionManager.test.ts`
- `productAnalyticsBeaconContract.test.ts`
- `profileSessionFeatures.test.ts`
- `qrExpiry.test.ts`
- `qrTimerPalette.test.ts`
- `RecoveryEngine.ts`
- `retentionEvents.test.ts`
- `rewardLedger.test.ts`
- `roundState.test.ts`
- `sandboxAgentSecurity.test.ts`
- `scheduledLive24.ts`
- `SchedulerService.ts`
- `schema-new-games.ts`
- `securityOrder60.test.ts`
- `sha256.test.ts`
- `showState.test.ts`
- `showState.ts`
- `simulate-boss-1000.ts`
- `simulate-boss-sensitivity.ts`
- `simulateLive.ts`
- `SmartTvConnectionSimulator.tsx`
- `smartTvSimulationContract.test.ts`
- `supervisedWorker.test.ts`
- `territorialCaptureSession.test.ts`
- `territorialConflictResolution.test.ts`
- `territorialOfflineSync.test.ts`
- `territorialOrder34.test.ts`
- `territorialOrder35.test.ts`
- `territorialOrder36.test.ts`
- `territorialOrder37.test.ts`
- `territorialOrder53.test.ts`
- `territorialOrder54.test.ts`
- `territorialOrder55.test.ts`
- `territorialRbac.test.ts`
- `territorialTrust.test.ts`
- `territorialWorldEngine.test.ts`
- `touchRemoteContract.test.ts`
- `tvGamesProductive.test.ts`
- `tvManifest.test.ts`
- `tvOverlay.e2e.test.ts`
- `tvQrGoldenFlow.test.ts`
- `universalController.test.ts`
- `universalInteraction.test.ts`
- `voiceEngine.test.ts`
- `voiceProductive.test.ts`
- `WatchdogAgent.ts`
- `websocketServer.test.ts`
- `websocketServer.ts`
- `youtubeLive.test.ts`

