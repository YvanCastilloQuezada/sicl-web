# LUKA OS — Especificación v1.0 implementada

**Estado:** núcleo contextual inicial implementado y verificable. **MJP CORE:** sin modificaciones y sin autoridad desde la interfaz.

## Decisión constitucional

LUKA OS reemplaza la idea de una pantalla inicial saturada de menús por una entrada contextual. La primera impresión ahora presenta a LUKA como anfitriona y ofrece dos intenciones primarias: **Mundo LUKA** y **Ver TV**. La voz es la interacción preferida; los botones táctiles permanecen como respaldo accesible.

> La implementación es una primera capa de experiencia. No afirma todavía comprensión semántica avanzada, wake word de baja latencia garantizado ni detección real de Smart TV.

## Mapa de arquitectura

| Capa | Responsabilidad | Estado |
|---|---|---|
| LUKA Entry | Presentación inicial, pregunta contextual y fallback táctil | Implementado |
| Intent Engine | Normalización de texto y resolución de intenciones naturales | Implementado como contrato determinista |
| Progressive Disclosure | Lista de controles visibles y siguiente acción útil por modo | Implementado como contrato |
| Context Permission Gate | Cámara solo al solicitar AR; TV no solicita cámara | Implementado en entrada AR |
| LUKA AR Stage | Visor espacial, captura y presencia de Lukita | Existente; depende de WebXR/permisos físicos |
| LUKA TV | Navegación TV y controles especializados | Existente en rutas actuales; transición contextual inicial añadida |
| Controller Lab | Trackpad, Game Pad, Teclado y AR Stage | Existente; conserva acceso directo para pruebas/backstage |
| MJP CORE | Juego, RNG, RTP, wallet, ledger, settlement y reglas | Protegido; no tocado |

## Intent Engine v1

El contrato `shared/lukaOsContract.ts` reconoce las intenciones `Mundo LUKA`, `Ver TV`, escribir, jugar, navegar por TV, volver al mundo, abrir Netflix y configuración. La resolución admite frases naturales y elimina acentos para evitar depender de una coincidencia exacta. Una intención desconocida no ejecuta navegación ni solicita permisos.

| Intención | Modo | Permisos | Acción |
|---|---|---|---|
| Mundo LUKA | AR | Cámara, solo bajo demanda | Abrir visor |
| Ver TV | TV MEDIA | Ninguno | Abrir TV en línea |
| Quiero escribir | Teclado | Ninguno | Abrir Controller Lab |
| Quiero jugar | Game Pad | Ninguno | Abrir Controller Lab |
| Quiero navegar | Track Pad | Ninguno | Abrir Controller Lab |
| Configuración | Config | Ninguno | Abrir ajustes del Controller Lab |

## Progressive Interface Disclosure

El contrato `LUKA_DISCLOSURE` establece que AR muestra únicamente identidad, micrófono, conexión, estado del dispositivo, brillo y salida contextual a TV; TV MEDIA revela los controles especializados; Track Pad ofrece AR como escape natural; Game Pad ofrece Teclado; y Teclado ofrece Game Pad. La configuración queda fuera de la barra primaria y se accede por intención explícita.

## Inventario de cambios

| Archivo | Cambio |
|---|---|
| `shared/lukaOsContract.ts` | Contratos de modos, intenciones, permisos, disclosure, fallback y prompt de entrada |
| `shared/lukaOsContract.test.ts` | Pruebas de lenguaje natural, permisos y disclosure |
| `client/src/components/LukaUniversalEntry.tsx` | Entrada universal con voz prioritaria, fallback táctil y temporizador de 10 segundos |
| `client/src/pages/Home.tsx` | LUKA Entry incorporado antes del contenido existente |
| `docs/LUKA_OS_SPEC_V1_IMPLEMENTATION.md` | Mapa, inventario, estados y límites |

## Seguridad y privacidad

La entrada TV no llama a `getUserMedia`. El visor AR solo intenta solicitar cámara después de una acción explícita de entrada al mundo AR y detiene las pistas inmediatamente tras el gate inicial; la experiencia AR existente continúa gobernando su propio flujo. Micrófono y GPS permanecen sin solicitud inicial. No se crean llamadas a RNG, wallet, ledger, settlement, reglas ni manifestos del núcleo.

## Lo que aún requiere trabajo o validación humana

La detección real del wake word “LUKA” con latencia inferior a 200 ms, el reconocimiento robusto en ruido, la detección Bluetooth/WiFi de Smart TV, los comandos de proveedor para abrir Netflix, la validación de cámara y orientación en Safari iOS/Chrome Android y el modelo 3D definitivo requieren integración y pruebas reales. La especificación no autoriza publicación remota ni modifica el contrato constitucional de MJP CORE.

## Simulador de conexión Smart TV

Se añadió `SmartTvConnectionSimulator` dentro de la entrada universal. El flujo contiene los estados `idle`, `scanning`, `found`, `connecting`, `connected` y `failed` como contrato de simulación. El dispositivo mostrado es explícitamente `protocol: simulated`; no realiza descubrimiento Bluetooth/Wi‑Fi ni intenta controlar un televisor real. Una vez conectado, permite recorrer una navegación acotada de Inicio, Media y Apps mediante flechas, OK, atrás y home. El botón final abre la ruta existente de TV en línea, pero la simulación no transmite comandos hacia un proveedor externo.

## Retroalimentación visual de voz

La entrada de voz muestra un anillo pulsante alrededor del control, icono de micrófono animado, barras de actividad y estados accesibles `Escuchando…`, `Procesando intención…` y mensajes de error o fallback. La animación solo acompaña la interacción; no se presenta como garantía de wake word real ni de latencia inferior a 200 ms.

## Validación de esta iteración

Se ejecutaron TypeScript, pruebas focalizadas del contrato Smart TV y LUKA OS, y build de producción sin errores. El build conserva una advertencia no bloqueante por chunks grandes de Three.js. La certificación de conexión física, reconocimiento en ruido, Smart TV real, cámaras, micrófonos y sensores continúa pendiente de dispositivos y permisos humanos.

## Recuperación de voz e historial

La entrada universal ahora responde de forma amigable ante órdenes no reconocidas o fallos del navegador. Muestra el motivo, ofrece alternativas contextuales como `Mundo LUKA`, `Ver TV`, `Quiero escribir`, `Quiero jugar` y `Quiero navegar por el TV`, y permite ejecutar cualquier alternativa con un clic. Las últimas cinco transcripciones reconocidas se almacenan localmente, se muestran como historial y pueden repetirse mediante un botón. No se envían a un servicio remoto desde esta superficie.

## Pantalla virtual de comandos Smart TV

La simulación ahora muestra el estado de la pantalla, la ruta contextual activa —Inicio, Media o Apps—, los elementos visuales de cada ruta y el último comando ejecutado. Al pulsar una flecha u OK, el mensaje de estado confirma el comando y la pantalla refleja el cambio. El modelo sigue limitado a navegación de presentación y no representa una integración con equipos reales.

## Validación adicional

Las pruebas focalizadas de `shared/lukaOsContract.test.ts` y `shared/smartTvSimulationContract.test.ts`, TypeScript y build finalizaron correctamente. Se mantiene la advertencia no bloqueante de chunks grandes del bundle Three.js. El historial usa `localStorage` como persistencia local de prueba; para producción se requeriría consentimiento, política de retención y una decisión de persistencia remota separada.

## Orden Maestra LUKA TV Runtime: alcance ejecutado

La navegación física del simulador queda alineada con el requisito de eventos LRUD: `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Enter`, `Escape` y `Home`. Cada tecla se transforma en una acción de presentación segura y actualiza la pantalla virtual. La superficie táctil acepta toque corto como OK y deslizamientos horizontales o verticales como navegación espacial.

El alcance de esta iteración es deliberadamente simulado. DLNA/UPnP, Open Screen Protocol, Google Cast SDK, Trusted Web Activity, empaquetado Tizen/webOS, Roku Cloud Connector y la detección Bluetooth/Wi‑Fi real no se activan desde el sandbox. Requieren definición de proveedores, permisos, pruebas por plataforma, credenciales y aprobación humana. La simulación no debe interpretarse como compatibilidad certificada.

## Control Packs v1.0

Se incorporó el catálogo contextual de ocho configuraciones ergonómicas: Trackpad, Keyboard, Gamepad, Lights & Climate, Audio, Wearables, Vehicle Dashboard y TV. Cada pack declara su motivo, dispositivos objetivo, superficie central, activador de intención y hasta dos siguientes acciones útiles. La entrada universal revela únicamente el pack que coincide con la intención; no se presenta un selector con los ocho modos simultáneamente.

El detector `detectSimulatedDevices()` ofrece dispositivos de prueba explícitamente marcados con `protocol: simulated`. Sirve para validar el vínculo entre dispositivo y Control Pack sin escanear Bluetooth, Wi‑Fi o LAN. Las integraciones de descubrimiento físico y control —DLNA/UPnP, OSP, Cast, Tizen, webOS, Roku y wearables/vehículos reales— permanecen reservadas a una fase posterior con proveedores, permisos, pruebas por plataforma y aprobación humana.

| Pack | Activación contextual | Estado actual |
|---|---|---|
| Trackpad | “Quiero navegar” | Contrato y revelación contextual |
| Keyboard | “Quiero escribir” | Contrato y revelación contextual |
| Gamepad | “Quiero jugar” | Contrato y revelación contextual |
| Lights & Climate | “Baja la luz” | Contrato y revelación contextual |
| Audio | “Sube el volumen” | Contrato y revelación contextual |
| Wearables | “Muéstrame mi pulso” | Contrato y revelación contextual |
| Vehicle Dashboard | “Muestra el estado de mi bici” | Contrato y revelación contextual |
| TV | “Quiero ver TV” | Contrato, simulador y revelación contextual |

## Telemetría y transiciones de Control Packs

El detector simulado ahora entrega para cada dispositivo un nivel de batería y una fuerza de conexión expresados como porcentajes. La interfaz actualiza estos valores de forma determinista cada 2,2 segundos y los muestra únicamente para el Control Pack activo, con color semántico para niveles bajos, medios y adecuados. La etiqueta `telemetría simulada` evita confundir estos valores con datos reales del dispositivo.

Cuando cambia la intención y, por tanto, el Control Pack activo, el panel contextual se remonta con una transición breve de entrada. La animación está protegida con `motion-safe` para respetar la preferencia de reducción de movimiento y no altera la regla de disclosure progresivo: siguen visibles solo el pack activo y hasta dos siguientes acciones útiles.

## LUKA TV Runtime — Fase 1 Android TV / Google TV

La Fase 1 queda preparada como una implementación segura de contrato y simulación. El flujo modela búsqueda, TV encontrada, conexión, conexión confirmada y TV no encontrada, con el mensaje de fallback: “No he encontrado tu TV. Escanea el QR o prueba con otro dispositivo”. La pantalla virtual confirma el estado “Conectado a Smart TV” y muestra el efecto de las acciones de navegación.

La navegación espacial usa el mapeo LRUD de `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Enter`, `Escape`, `BrowserBack` y `Home`. El panel recibe foco automáticamente al conectar el entorno simulado y mantiene el indicador visible del canal `PRESENTATION_ONLY`.

El alcance real de Google Cast SDK, Trusted Web Activity, DLNA/UPnP, Bluetooth/Wi‑Fi y lanzamiento de URL no se activa en esta iteración. El código no descubre dispositivos reales, no envía comandos a una TV y no solicita credenciales. El checklist preparado para tres modelos Android TV debe ejecutarse posteriormente en hardware físico; la validación actual es de sandbox y simulación.

## Fallback QR, feedback LRUD y perfiles Android TV

El simulador incluye ahora un fallback QR visual cuando la búsqueda falla. La interfaz explica cuatro pasos: abrir la cámara o LUKA en el TV, escanear el código de vinculación, confirmar el mismo código en ambos dispositivos y volver al simulador para reintentar. El QR está identificado como simulado y la línea animada representa únicamente el proceso de guía; no genera ni valida una sesión real.

La navegación por teclado recibe un resaltado temporal en el panel de pantalla virtual y en el control correspondiente. Cuando el navegador lo permite, se reproduce un tono breve de baja intensidad; cualquier error del contexto de audio se ignora para que nunca bloquee la navegación. Se respeta `motion-safe` en las transiciones visuales.

El selector permite repetir las pruebas con tres perfiles: Google TV de referencia, Android TV de referencia y Android TV con red limitada. Los perfiles son escenarios reproducibles del sandbox, no modelos físicos certificados. La integración real de Google Cast SDK, TWA y descubrimiento en la misma Wi‑Fi sigue fuera de alcance hasta contar con proveedor, permisos y QA en tres equipos reales.

## Modo oscuro del simulador y roadmap Fases 3–8

El simulador Smart TV incorpora un interruptor local de modo oscuro, activado por defecto, con persistencia en `localStorage`. La variante clara conserva contraste funcional y la transición se limita a colores, sin alterar el comportamiento del runtime. El control expone su estado mediante `aria-pressed` y permanece dentro del simulador, sin modificar el tema global de LUKA OS.

Las Fases 3–8 del documento adjunto se mantienen como roadmap separado: webOS/Roku, ampliación del Intent Engine, detección contextual, disclosure progresivo, automatización del hogar y Visor AR. En esta entrega no se activan SDKs de Cast/TWA, escaneo Wi‑Fi/Bluetooth, webOS/Roku, automatización física, geocodificación ni WebXR productivo. Cualquier integración requerirá contratos específicos, permisos explícitos, pruebas por plataforma y validación humana.

## Modo oscuro del simulador Smart TV

El simulador dispone de un interruptor local de modo oscuro, activo por defecto, y una variante clara de alto contraste relativo. La preferencia se conserva en `localStorage` bajo una clave propia del simulador; no modifica el tema global de LUKA OS. La transición se limita a color y respeta las convenciones de accesibilidad existentes.

## Estado de Fases 3–8

Las Fases 3–8 del documento adjunto permanecen registradas como roadmap, no como integración productiva. webOS y Roku requieren sus SDK y ciclos de distribución propios; la domótica requiere proveedores y permisos; y el Visor AR requiere validación de WebXR, GPS, privacidad y hardware. Wi‑Fi, Bluetooth, Cast, TWA, geocodificación y controles físicos no se activan por esta entrega. MJP CORE continúa sin modificaciones y la simulación mantiene el canal `PRESENTATION_ONLY`.

## Avance sandbox de Fases 3–8

La ejecución actual completa el tramo verificable en sandbox de las Fases 3 a 8 mediante contratos y superficies simuladas. La Fase 3 dispone de perfiles webOS y Roku con LRUD y estados de runtime; la Fase 4 dispone de Intent Engine, confirmación explícita y vencimiento de 10 segundos; la Fase 5 mantiene detección contextual simulada; la Fase 6 conserva disclosure progresivo; la Fase 7 expone dispositivos domésticos simulados sin control físico; y la Fase 8 mantiene el acceso preparado al Visor AR con permiso contextual de cámara.

Este avance no equivale a una certificación productiva al 100 %. No se activaron SDKs de webOS/Roku, Google Cast, TWA, Wi‑Fi, Bluetooth, proveedores de domótica, GPS real ni un modelo 3D definitivo. El laboratorio se identifica como simulado y el límite de autoridad permanece en `PRESENTATION_ONLY`; MJP CORE, RNG, wallet, ledger, settlement y reglas no son accesibles.

## LUKA at Home — dispositivos interactivos de prueba

El laboratorio incorpora dos luces inteligentes simuladas y un dispositivo de audio de referencia. Las luces admiten foco por clic, flechas o navegación espacial, activación por Enter, ajuste de intensidad en pasos de 10 puntos y doble clic táctil. El estado se refleja mediante color, indicador luminoso, texto de intensidad y mensaje de actividad local. El audio permanece como dispositivo no interactivo en esta iteración para evitar sugerir una integración inexistente.

Los cambios se ejecutan exclusivamente en memoria del componente y se etiquetan como `simulated-online`; no se envían comandos a redes, hubs, dispositivos IoT, Matter, Bluetooth, Wi‑Fi ni proveedores de domótica. La transición a un dispositivo real exige permisos explícitos, conector aprobado, revocación, timeout, auditoría y prueba de aislamiento respecto de MJP CORE.


## LUKA Dev Lab — panel interno y simuladores críticos

El Dev Lab se incorporó como superficie interna para probar capacidades ocultas sin exponerlas en el flujo público. El acceso visible fue retirado y el panel se abre mediante cinco toques sobre el logo L★ del mockup contextual. El panel incluye un Capability Registry con toggles locales, una previsualización WebXR con planos simulados y puntos de interés territoriales, y un simulador LUKA TV con pantalla virtual, volumen y transición de canal.

Los toggles solo alteran el estado de la maqueta local. La previsualización AR no solicita cámara ni GPS reales; la pantalla TV no usa Cast, TWA, DLNA/UPnP, Wi‑Fi o Bluetooth. Estas capacidades requieren fases posteriores con SDK, permisos, dispositivos, observabilidad, revocación y revisión humana. El panel nunca concede autoridad sobre RNG, RTP, wallet, ledger, settlement, reglas o MjpTvManifest de MJP CORE.


## Identidad constitucional: LUKA y LUKALLPA

A partir de la definición vigente, **LUKA no equivale a LUKALLPA**. LUKA es la inteligencia, presencia y agente territorial: interpreta contexto, voz, ubicación, visión, gestos y dispositivos para presentar una experiencia. **LUKALLPA es el mundo digital-territorial aumentado**, la representación organizada de ciudades, calles, edificios, patrimonio, rutas, puntos AR, servicios, experiencias y conocimiento geoespacial.

La relación conceptual es:

> Territorio físico → LUKALLPA, mundo aumentado → LUKA, inteligencia que organiza y conecta → persona → acción.

La arquitectura recomendada queda expresada como `LUKA OS`, `LUKA Orchestrator`, `LUKA World Engine`, `LUKA Agent Network`, `LUKA Device Fabric`, `LUKA AR Engine` y `LUKA Security`, organizados alrededor de LUKALLPA. Los agentes son especialistas invocados por LUKA; el usuario no debe seleccionar agentes directamente.

Los juegos se mantienen dentro de `LUKALLPA → Experiencias → Recreación → Juegos → MJP → MJP CORE`. La economía digital y cualquier futura moneda L* quedan fuera del centro operativo y requieren arquitectura, revisión regulatoria, licencias y decisión legal separadas. Ninguna capa LUKA/LUKALLPA puede modificar resultados, RNG, RTP, wallet, ledger, settlement, reglas o manifiestos del núcleo protegido.

En el lanzamiento MVP, el usuario abre LUKA y puede entrar al mundo aumentado mediante Visor AR o ver TV. La terminología pública debe presentar a LUKA como anfitriona/inteligencia y a LUKALLPA como el mundo territorial al que conduce, sin exponer el catálogo completo de agentes ni capacidades ocultas.


## Cierre de experiencia nuclear en Dev Lab

La superficie LUKA TV del Dev Lab muestra una previsualización visual simulada del contenido al cambiar de canal. Cada cambio actualiza el número de canal, el título contextual —Noticias de LUKA, LUKALLPA en ruta o Experiencias AR— y una transición breve de entrada. No reproduce contenido real ni se conecta a proveedores.

La previsualización WebXR muestra una representación básica de LUKA como guía territorial. Al seleccionar un POI, el avatar cambia a estado reactivo, emite un pulso visual y comunica que guía hacia el punto elegido. La proximidad es una condición simulada; no usa GPS, cámara, geocodificación ni modelo 3D productivo.

El visor del Intent Engine incorpora búsqueda libre por transcripción, intención o estado y ordenamiento alternable entre registros recientes y orden alfabético por intención. Las exportaciones CSV/JSON y los registros continúan siendo sintéticos y locales.

La identidad de producto queda alineada con la decisión de consolidar la experiencia nuclear: MiLukita es el producto propietario, LUKA es la identidad/presencia inteligente, LUKA OS es la orquestación contextual, Lukita es su presencia visual, LUKA AR es la experiencia territorial y LUKA TV es la superficie de control televisivo. Las capacidades no prioritarias permanecen ocultas o reservadas.


## Orden Maestra MVP Productivo V1 — consolidación ejecutada

La entrada inicial del MVP queda concentrada en dos decisiones visibles: **Mundo LUKA** y **Ver TV**. El laboratorio técnico no aparece como acción pública; el acceso interno permanece reservado al gesto de cinco toques sobre L★.

El Capability Registry queda clasificado así: `AVAILABLE` para AR World, LUKA TV, TV Control, Trackpad, Keyboard, Gamepad y Voice; `RESERVED` para Lights & Climate, Audio, Wearables y Vehicle; `HIDDEN` para L* y capacidades financieras o experimentales. `HIDDEN` significa ausencia de disclosure, no eliminación del código.

Se añadió `shared/lukaControllerState.ts` como máquina única de estados de presentación: `ar`, `tv`, `trackpad`, `keyboard` y `gamepad`. Las transiciones son contextuales y no incluyen rutas a RNG, RTP, wallet, ledger, settlement, reglas, manifest ni MJP CORE.

El MVP está **listo para validación de experiencia en sandbox**, no certificado como operación productiva. AR, GPS, WebXR, voz, Cast, DLNA/UPnP, PWA y TV se mantienen simulados o contractuales donde corresponde. El circuito físico QR → LUKA → LUKITA → AR → TV requiere todavía dispositivos reales, permisos y QA antes de lanzamiento.


## Estado del documento adjunto y nuevas herramientas de verificación

El documento adjunto es útil como visión funcional, pero no es completamente exacto como acta de estado: mezcla experiencias deseadas con componentes simulados. En particular, `LUKA Universal Entry` ya cuenta con una primera implementación contextual, pero el circuito QR/PWA productivo no está certificado; `LUKA_CONTROLLER_STATE` ya tiene contrato de máquina única; y LUKA TV no controla televisores reales.

El Dev Lab incorpora ahora un QR de entrada simulado hacia Mundo LUKA, métricas reproducibles de `Time to First LUKA` y `Time to First Action`, y un indicador interactivo de transporte `Cast / DLNA simulado`. Ninguno crea sesiones, mide usuarios reales, descubre dispositivos ni envía comandos.

El control remoto universal del celular está operativo como **superficie de presentación y simulación**: navegación contextual, trackpad, teclado, gamepad, volumen, LRUD y previsualizaciones funcionan en el navegador. No está operativo todavía como control remoto universal físico porque faltan Cast/DLNA/UPnP, proveedores, permisos de red, pruebas en TV real y validación multiplataforma.

Estado del MVP: **sandbox-ready / hardware-not-certified**. La experiencia de entrada, AR simulado, TV simulado, Controller Lab y Dev Lab están implementados en distintos niveles; el modelo 3D definitivo de LUKITA, WebXR/GPS/cámara reales, wake word productivo, QR de vinculación real, PWA instalada, Cast/DLNA y pruebas con usuarios permanecen pendientes.


## Verificación QR y emparejamiento de TV

El Dev Lab incluye una transición visual del QR simulado hacia Mundo LUKA con estados `generado`, `escaneando` y `entrada confirmada`. También incluye un flujo de emparejamiento simulado de LUKA TV con estados de búsqueda, dispositivo encontrado, confirmación y emparejado. Ambos flujos son locales, deterministas y no crean sesiones ni envían comandos. La integración real de Google Cast, DLNA/UPnP, Tizen, webOS o Roku sigue bloqueada hasta disponer de SDK/proveedor, permisos de red, dispositivos físicos y QA reproducible.


## TV Runtime — contrato simulado e historial controlado

El Dev Lab expone contratos de diseño para **Cast** y **DLNA** con descubrimiento `simulated`, endpoint `local-sandbox`, autenticación `not-configured` y autoridad `presentation-only`. No abre sockets, no descubre televisores físicos y no transmite comandos externos.

El historial de dispositivos emparejados se conserva localmente en `localStorage`, con retención seleccionable de 7 días, 30 días o sin expiración, eliminación individual con feedback visual y borrado manual completo. La persistencia es de laboratorio: no es una sesión real ni un almacenamiento remoto de producción.

El documento maestro queda aplicado únicamente hasta donde el sandbox permite verificarlo. Cast/DLNA real, maquetas físicas certificadas, QR de producción, hardware y permisos de plataforma requieren validación posterior; MJP CORE continúa aislado.


## Orden P0 de identidad y realineamiento — cierre técnico

La jerarquía activa queda congelada así: **MiLukita** es la marca/ecosistema; **El Mundo de MiLukita** es el universo público; **LUKA** es la presencia inteligente; **LUKA OS** es la capa técnica; **LUKA AR** es la experiencia territorial aumentada; y **LUKA TV** es la experiencia de televisión. Los términos históricos o ambiguos —incluido Lukallpa/LUKITA cuando aparezcan en expedientes anteriores— no se sustituyen de forma global: se conservan para trazabilidad y se clasifican en `docs/MILUKITA_NAMING_MIGRATION_AUDIT.md`.

La entrada pública fue alineada para presentar **El Mundo de MiLukita** sin retirar la compatibilidad de comandos heredados. El cambio es nominal y de experiencia: no modifica rutas técnicas, contratos persistentes, reglas, RNG, RTP, wallet, ledger, settlement, resultados ni manifiestos protegidos. MJP CORE conserva autoridad completa.
