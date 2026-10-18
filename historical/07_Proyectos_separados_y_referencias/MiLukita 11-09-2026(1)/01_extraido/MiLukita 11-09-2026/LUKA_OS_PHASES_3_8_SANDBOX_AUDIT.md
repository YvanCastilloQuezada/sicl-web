# Auditoría de avance sandbox — LUKA OS Fases 3–8

**Fecha:** 1 de septiembre de 2026  
**Autor:** Manus AI  
**Alcance:** implementación verificable dentro del sandbox del proyecto `ruleta-peru-online`.

## Dictamen ejecutivo

Las Fases 3–8 no deben declararse productivas al 100 %. Se ejecutó el máximo seguro y verificable en sandbox: contratos tipados, transiciones deterministas, superficies de prueba, confirmación explícita, permisos contextuales, disclosure progresivo, dispositivos domésticos simulados y acceso preparado al Visor AR. Las conexiones físicas, SDKs propietarios, proveedores externos, geolocalización real y certificación multidispositivo siguen pendientes.

> El criterio de esta auditoría es no confundir una maqueta ejecutable con una integración real.

## Matriz de estado

| Fase | Entregable verificable | Estado sandbox | Pendiente externo | Riesgo | Límite constitucional |
|---|---|---|---|---|---|
| 3 | Runtime universal Android TV, webOS y Roku | Implementado como perfiles simulados con LRUD y estados de conexión | SDK webOS, Roku Cloud Connector, Cast/TWA, distribución y QA física | Medio | Solo navegación y presentación |
| 4 | Intent Engine y confirmación | Implementado con resolución de intenciones, confirmación Sí/No y vencimiento | Reconocimiento de voz robusto, wake word, NLU productivo y métricas de latencia | Medio | Nunca interpreta ni modifica resultados de MJP CORE |
| 5 | Device Detector | Implementado con catálogo de dispositivos simulados y telemetría determinista | Escaneo Wi‑Fi/Bluetooth, permisos de sistema, emparejamiento y seguridad de red | Alto | No descubre dispositivos reales |
| 6 | Progressive Interface Disclosure | Implementado mediante Control Packs y revelación del contexto activo | Telemetría de contexto real, pruebas de usabilidad y políticas finales de disclosure | Bajo | No expone funciones no activas |
| 7 | LUKA at Home | Implementado como panel de dispositivos simulados y acciones con confirmación | Proveedores IoT, OAuth, Matter/Hub, control físico, límites de seguridad doméstica | Alto | No conmuta luces, clima, audio ni vehículos reales |
| 8 | LUKA Visor AR | Integración de entrada y permiso contextual preparada; visor existente disponible | WebXR en hardware, GPS real, modelo 3D definitivo, anclaje, privacidad y QA | Alto | AR es presentación, no autoridad del juego |

## Evidencia técnica

El contrato `shared/lukaRuntimeContract.ts` define tres runtimes simulados, estados `idle`, `discovering`, `found`, `connected`, `not-found` y `qr-fallback`, confirmaciones con estados `pending`, `confirmed`, `rejected` y `expired`, permisos contextuales y dispositivos domésticos simulados. La función `runSafeRuntimeEvent` limita los eventos a descubrimiento, conexión, fallback QR y navegación.

La superficie `client/src/components/LukaRuntimeLab.tsx` permite seleccionar Android TV/Google TV, LG webOS o Roku, simular búsqueda, conectar o fallar, probar confirmación de volumen, consultar dispositivos domésticos simulados y preparar la cámara para AR sin solicitarla al abrir. La entrada `client/src/components/LukaUniversalEntry.tsx` expone el laboratorio mediante configuración y mantiene el flujo contextual.

Las pruebas `shared/lukaRuntimeContract.test.ts` cubren perfiles, LRUD, estados, confirmación, permisos, dispositivos simulados y rechazo de eventos no seguros. La suite adicional del proyecto cubre regresiones existentes.

## Validación reproducible

La validación de esta iteración ejecutó TypeScript, pruebas focalizadas y build. Resultado registrado: **117 archivos de prueba aprobados, 1 omitido; 417 pruebas aprobadas, 4 omitidas; TypeScript PASS; build PASS**. El build mantiene una advertencia no bloqueante sobre chunks grandes, principalmente por Three.js y superficies de AR.

## Separación de responsabilidades

LUKA OS puede decidir qué interfaz presentar y qué acción contextual pedir al usuario. No puede decidir resultados, RNG, RTP, wallet, ledger, settlement, reglas ni manifiestos de MJP CORE. Las futuras integraciones de webOS, Roku, IoT, Cast, GPS y WebXR requieren revisión de permisos, seguridad, observabilidad, pruebas de fallo y aprobación humana antes de cambiar su estado a operativo.

## Recomendación de gobernanza

El siguiente cambio de madurez debe exigir evidencia de proveedor, pruebas en tres dispositivos de cada plataforma, revocación de permisos, timeout y recuperación, registro de auditoría, política de privacidad y prueba explícita de que ningún adaptador puede invocar rutas de MJP CORE. Hasta cumplir esos gates, el estado correcto es **IMPLEMENTED-SANDBOX / NOT PRODUCTION**.

## Orden crítica Device Detector + Intent Engine + TV Runtime

La orden adjunta fue reconciliada con el estado real del proyecto. En sandbox se completó el Device Detector simulado con dos fuentes diferenciadas: Wi‑Fi para TV, luces y dispositivos de red; Bluetooth para consola, audio, wearables y movilidad. La activación contextual devuelve únicamente un `ControlPackId` de presentación.

El Intent Engine cuenta con una matriz reproducible de diez comandos. El resultado esperado y validado es el siguiente:

| # | Comando | Intención | Modo |
|---:|---|---|---|
| 1 | Quiero ver TV | `watch-tv` | `tv-media` |
| 2 | Quiero escribir | `write` | `keyboard` |
| 3 | Quiero jugar | `play` | `gamepad` |
| 4 | Quiero estar en la calle | `enter-world` | `ar` |
| 5 | Quiero aumentar la voz | `audio` | `config` |
| 6 | Quiero disminuir las luces | `lights-climate` | `config` |
| 7 | LUKA, configuración | `open-config` | `config` |
| 8 | Quiero navegar por el TV | `navigate-tv` | `trackpad` |
| 9 | Pon Netflix | `open-netflix` | `tv-media` |
| 10 | Muéstrame mi pulso | `wearables` | `config` |

Las acciones sensibles del laboratorio exigen confirmación `Sí/No`, vencen después de diez segundos y solo modifican la maqueta local. El TV Runtime dispone de perfiles Android TV/Google TV, webOS y Roku simulados, estados de búsqueda/conexión/fallo, fallback QR y navegación LRUD.

No se implementó conectividad real en esta orden. Google Cast SDK, TWA, DLNA/UPnP, SDKs webOS/Roku, Wi‑Fi/Bluetooth del sistema operativo, proveedores IoT y pruebas en tres Android TV y dos Samsung TV requieren dispositivos, SDKs, permisos, red controlada y revisión humana. Por tanto, el estado correcto es **IMPLEMENTED-SANDBOX / NOT PRODUCTION**.

## Fase 1 — LUKA Guía Territorial como MVP de lanzamiento

Se incorpora un registro explícito de capacidades de lanzamiento. `ar-visor`, `luka-tv` y el contexto `tv` aparecen como `available`; Trackpad, Keyboard, Gamepad, Lights & Climate, Audio, Wearables, Vehicle Dashboard y moneda L* quedan en `hidden`. La entrada contextual bloquea el acceso directo a packs ocultos y ofrece únicamente Visor AR o LUKA TV como alternativas de lanzamiento.

La disponibilidad del MVP no convierte las integraciones en productivas. El Visor AR conserva los permisos y límites previamente documentados; LUKA TV conserva el runtime simulado y LRUD. El registro funciona como política de disclosure y no como autorización para modificar MJP CORE.


## Dev Lab: ubicación, activación interna y registros del Intent Engine

La previsualización WebXR del Dev Lab incorpora un selector de GPS simulado con tres puntos reproducibles: Plaza de Armas, Huaca del Sol y Comisaría. Cada opción presenta coordenadas de referencia y actualiza únicamente la escena local. No solicita permisos GPS, no realiza geocodificación ni inicia navegación real.

El acceso reservado mediante cinco toques sobre el logo L★ muestra un contador sutil de avance y usa vibración breve cuando el navegador expone `navigator.vibrate`. El quinto toque abre el Dev Lab; la vibración es opcional, no bloqueante y no constituye certificación de un dispositivo físico.

El visor de registros del Intent Engine muestra transcripción, intención, estado y origen `simulated`, incorporando eventos locales de prueba cada 4,2 segundos. No captura audio, no envía comandos y no representa un log productivo. La validación física de AR, TV, voz, detector y la Fase 2 Lights & Climate/Audio permanece pendiente de equipos, SDKs, permisos, proveedores, observabilidad y aprobación humana.


## Identidad vigente: LUKA y LUKALLPA

La definición constitucional vigente distingue **LUKA** de **LUKALLPA**. LUKA es la inteligencia, presencia y agente territorial que comprende contexto, voz, ubicación, visión, gestos y dispositivos. LUKALLPA es el mundo digital-territorial aumentado que organiza ciudades, patrimonio, rutas, puntos AR, servicios, experiencias y conocimiento geoespacial. El usuario abre LUKA y, cuando entra al mundo, accede a LUKALLPA.

La arquitectura conceptual queda organizada como LUKA OS, LUKA Orchestrator, LUKA World Engine, LUKA Agent Network, LUKA Device Fabric, LUKA AR Engine y LUKA Security. Los agentes son especialistas internos invocados por LUKA, no destinos que el usuario deba seleccionar. Los juegos viven bajo `LUKALLPA → Experiencias → Recreación → Juegos → MJP → MJP CORE`; la economía digital y L* requieren un programa legal y técnico independiente.

## Dev Lab ampliado

El Dev Lab permite añadir POIs personalizados introduciendo nombre, latitud y longitud. La validación rechaza coordenadas fuera de latitud −90…90, longitud −180…180 y nombres vacíos; los puntos se mantienen en memoria y se identifican como `POI personalizado de sandbox`. El selector actualiza el punto de referencia de la escena WebXR simulada.

Los registros simulados del Intent Engine pueden exportarse desde el panel en CSV o JSON. El contenido exportado contiene únicamente transcripción sintética, intención, estado y origen `simulated`; no contiene audio, credenciales ni comandos enviados. La activación reservada de cinco toques mantiene el contador visual y vibración opcional.


## Refinamientos de experiencia nuclear

La pantalla LUKA TV del Dev Lab ofrece una previsualización local de contenido al cambiar de canal: el estado visual cambia de forma breve, muestra el canal activo y alterna entre contenidos ficticios de Noticias de LUKA, LUKALLPA en ruta y Experiencias AR. No se reproduce vídeo real ni se invoca un proveedor externo.

La vista WebXR simulada incorpora un avatar básico de LUKA asociado al POI seleccionado. Cuando existe un punto de interés activo, el avatar muestra pulso visual, halo y el texto de guía contextual. Esta es una aproximación de interacción para validar UX; no representa el Character Foundation definitivo ni cálculo de distancia GPS real.

El visor del Intent Engine admite filtrado libre por transcripción, intención o estado y ordenamiento alternable entre registros recientes y orden alfabético por intención. Los datos son sintéticos, locales y marcados como `simulated`; las exportaciones CSV/JSON no contienen audio ni órdenes enviadas a dispositivos.


## Orden Maestra MVP Productivo V1 — estado de cierre

La consolidación del MVP prioriza el circuito QR → LUKA → LUKITA → Mundo AR / TV. La entrada pública muestra solo las dos decisiones iniciales y el Dev Lab queda reservado para acceso interno. El Capability Registry distingue `AVAILABLE`, `RESERVED` y `HIDDEN`; el cambio no elimina capacidades, pero impide su disclosure prematuro.

Se formalizó una máquina de estados única para la capa de presentación con cinco estados: AR, TV, Trackpad, Keyboard y Gamepad. El controlador sigue siendo presentation-only y no dispone de rutas hacia MJP CORE. Se corrigió el test heredado del registry para reflejar el alcance MVP vigente.

La evidencia automatizada confirma compilación y pruebas del repositorio. La advertencia restante corresponde al tamaño de chunks de Three.js y no bloquea el build. Queda bloqueado para lanzamiento real: la verificación QR en dos dispositivos, WebXR/GPS/cámara en móviles, wake word y voz en ruido, Cast/DLNA/UPnP, PWA instalada, pruebas en Android/iOS, TV física, consentimiento de permisos y observación de usuarios reales.


## Estado de la Orden Maestra posterior al refinamiento del Controller Lab

La simplificación pública se conserva como Entrada → LUKA → Mundo/TV; el Dev Lab permanece reservado. El Controller Lab reconoce ahora cinco configuraciones contextuales, incluyendo **Universal Control**, y usa la maqueta física 8 × 18 cm en vertical (4:9) y 18 × 8 cm en horizontal (9:4), con giro automático por viewport.

El flujo de compartir añade una presentación circular de marca L★ alrededor del QR. El módulo QR interno mantiene un área cuadrada legible para no degradar la posibilidad de escaneo. Por tanto, la evidencia certifica un **marco circular de presentación**, no un QR circular matemáticamente reconfigurado ni un enlace QR productivo.

La revisión QA en sandbox cubre TypeScript, pruebas focalizadas, build y captura visual. La certificación física del teléfono, cámara, QR, TV, Cast/DLNA y PWA sigue siendo un gate externo.
