# MiLukita / LUKA — Mapa de realidad del sistema
## Auditoría de la Orden 48 · 1 de septiembre de 2026

> **Alcance autorizado:** se implementaron únicamente hash SHA-256 visible, diagnóstico de GPS/cámara/micrófono y modo offline básico para QR Studio y galería. No se desplegó, no se integró TV y no se modificó MJP CORE.

## 1. Conclusión ejecutiva

El proyecto se encuentra en condición de **piloto controlado en sandbox**, no en condición de producción ni de certificación de campo. La capa territorial dispone de un flujo de software amplio para captura, sincronización, conflictos, evidencia, auditoría y publicación con intervención humana. Sin embargo, una parte crítica de la evidencia todavía depende de ejecutar pruebas en dispositivos físicos, bajo HTTPS productivo y con operadores reales.

El **QR Studio** genera localmente variantes redonda y cuadrada. La variante redonda usa la matriz QR real con módulos y patrones circulares; el color, el logotipo y el hash visible son de presentación. Esto no equivale a certificar la lectura en todas las cámaras, distancias, televisores o condiciones de iluminación.

El **modo offline** implementado es deliberadamente básico y controlado: el Service Worker cachea el app shell, las rutas del flujo territorial/QR, recursos estáticos y hasta 24 URLs de evidencias previamente observadas. El índice de galería se conserva en `localStorage`. No se cachean APIs autenticadas ni se pretende convertir una sesión sin red en una sesión con permisos nuevos.

## 2. Clasificación de capacidades

| Superficie | Estado en sandbox | Qué existe realmente | Qué sigue sin probar o es simulación |
|---|---|---|---|
| Portal MiLukita | IMPLEMENTED_UI | Rutas públicas, navegación, identidad visual y accesos de revisión. | No es evidencia de usuarios reales, ingresos ni operación productiva. |
| QR Studio | IMPLEMENTED_REVIEW_ONLY | Generación local de payload separado, QR redondo/cuadrado, color, logo, descargas, Web Share con fallback y hash SVG visible. | Lectura física, óptica de cámara, distancia TV y flujo productivo de expiración. |
| Mapper | IMPLEMENTED_RESTRICTED | Captura territorial, CaptureSession, evidencias S3, estados offline, sincronización, filtros y exports. | GPS/cámara reales, continuidad offline móvil, rendimiento y operación de campo. |
| The Eye | IMPLEMENTED_RESTRICTED | Revisión, evidencia, confidence score explicable, conflictos, auditoría y separación de publicación. | Decisiones de auditores reales, revisión de evidencia territorial real y aprobación Human Authority. |
| Human Authority | IMPLEMENTED_GATE | Publicación separada, revisión humana y controles RBAC en el dominio territorial. | Ejecución organizacional real, responsabilidades, firma/autoridad fuera del sandbox. |
| Field Voice Copilot | IMPLEMENTED_GUIDED | Reconocimiento nativo si el navegador lo ofrece, progreso, cancelación, texto manual y marca de revisión humana. | Calidad acústica, permisos de micrófono, latencia y reconocimiento en teléfonos reales. |
| Diagnóstico GPS/cámara/micrófono | IMPLEMENTED_DIAGNOSTIC | Solicitud explícita, estados GRANTED/DENIED/UNSUPPORTED/REQUESTING y guía de recuperación. | Resultado real depende de hardware, permisos, HTTPS y políticas del navegador. |
| Offline QR/galería | IMPLEMENTED_BASIC_OFFLINE | Service Worker, app shell, índice local y precarga de evidencias visibles. | No hay sincronización API offline automática ni garantía sobre URLs S3 que no se hayan visitado/cacheado. |
| LUKA TV | UI_SIMULATION / PARTIAL | Interfaz web TV, navegación simulada, QR/fallback y simulador de conexión. | Cast SDK real, DLNA/UPnP real, Samsung Tizen/webOS, descubrimiento y control hardware. |
| WebAR / Three.js | IMPLEMENTED_SANDBOX | Carga diferida de Three.js, AR Stage, placeholder/modelo y controles visuales de revisión. | WebXR en dispositivos compatibles, tracking de planos, iluminación, cámara y modelo definitivo. |
| MJP CORE | PROTECTED / OUT_OF_SCOPE | Sigue separado del dominio territorial y sus reglas, RNG, wallet, ledger, settlement y autoridad de resultados. | Esta orden no certifica una auditoría criptográfica independiente del core; solo confirma que los cambios de esta orden no lo tocaron. |

## 3. Cambios ejecutados en la Orden 48

### 3.1 Hash SHA-256 visible

Se creó un helper de Web Crypto para calcular digest hexadecimal SHA-256. QR Studio muestra el digest del SVG exacto que se está previsualizando; cualquier cambio de payload, forma, tamaño, color, logo o variante produce un digest diferente. La consola territorial calcula y muestra el hash del último CSV exportado sobre sus bytes UTF-8 y del último PDF sobre sus bytes decodificados desde base64.

Los reportes de campo persistidos ya disponían de `reportHash` server-side, calculado a partir del contrato de reporte y registrado en el audit log. La nueva visualización complementa esa integridad mostrando al operador el hash del archivo que acaba de generar.

### 3.2 Panel de diagnóstico prepiloto

El panel existente de permisos territoriales fue ampliado con micrófono. El operador puede revisar en pantalla GPS, cámara y micrófono, solicitar cada permiso por separado y recibir instrucciones si el navegador deniega o no soporta la capacidad. GPS muestra además coordenadas y precisión cuando el navegador las entrega.

El diagnóstico no concede permisos por sí mismo, no evita restricciones del sistema operativo y no reemplaza el registro del protocolo físico. Las solicitudes solo se ejecutan por acción explícita del operador.

### 3.3 Offline básico

El Service Worker global se amplió a una versión nueva de caché y mantiene una instalación tolerante: una ruta protegida que no responda no bloquea el resto del app shell. Se cachean las rutas de QR y territorial cuando fueron visitadas, recursos estáticos same-origin y hasta 24 assets remotos de evidencia enviados explícitamente desde la galería.

La galería guarda un índice local limitado a 24 evidencias. Sin red, puede mostrar metadatos y assets previamente cacheados; no consulta el API autenticado ni crea autoridad nueva. La primera visita a las rutas y la visualización de evidencias deben realizarse online para preparar la caché.

## 4. Evidencia técnica y validación

| Control | Resultado |
|---|---|
| TypeScript | PASS; sin errores de compilación en la validación final. |
| Vitest | 135 archivos aprobados, 1 omitido; 482 tests aprobados, 4 omitidos. |
| Build Vite | PASS; 9,71 s en la ejecución documentada. |
| Three.js | Separado en chunk diferido; el chunk 3D no forma parte de la ruta inicial pública. |
| MJP CORE diff de esta orden | Sin archivos del core modificados; cambios restringidos a cliente, Service Worker, helper de hash, documentación y TODO. |
| Datos territoriales | No se añadieron muestras ficticias ni se inventaron resultados de campo. |
| Evidencia fotográfica | Acceso protegido y limitado por el workflow territorial; offline solo conserva assets previamente cacheados. |

## 5. Gates que deben cerrarse antes del primer muestreo real

1. Abrir `/mapper` y `/the-eye` en dos dispositivos físicos distintos, bajo HTTPS, con sesiones y roles correctos.
2. Ejecutar el diagnóstico de GPS, cámara y micrófono y registrar cada resultado, incluidos permisos denegados y recuperación.
3. Capturar una primera evidencia real; comprobar que su URL protegida se visualiza, se cachea únicamente después de la acción esperada y mantiene su clasificación.
4. Desactivar la red después de preparar la sesión y comprobar la lectura del índice local, el QR generado y la galería previamente cacheada.
5. Restaurar conectividad, sincronizar el reporte, comprobar `SYNCED`/`CONFLICT` y revisar la cadena de auditoría.
6. Escanear los QR redondo y cuadrado en el televisor o pantalla objetivo desde Android e iOS, midiendo distancia, iluminación y orientación.
7. Obtener aprobación de Human Authority para publicar cualquier primer WorldObject; no usar el Runtime como sustituto de la revisión.

## 6. Decisión de readiness

**Decisión:** `READY_FOR_CONTROLLED_FIELD_GATE`, `NOT_READY_FOR_PRODUCTION`.

La aplicación está lista para que un equipo autorizado ejecute el protocolo físico documentado, siempre que entienda que el sandbox no prueba hardware, permisos reales, cámaras, GPS, micrófono, conectividad intermitente ni proveedores de mapas en condiciones de campo. No se recomienda declarar “operativo al 100 %” el sistema completo ni afirmar que LUKA TV está integrado con hardware.

## 7. Aislamiento de MJP CORE

La Orden 48 no modifica RNG, wallet, rules, ledger, settlement, resultados, manifiestos ni autoridad de MJP CORE. QR Studio utiliza payloads de revisión separados y marca `REVIEW_ONLY`; la superficie territorial solo gestiona conocimiento, claims, sources, evidence, captura, verificación y publicación con autoridad humana. El modo offline conserva presentación e índice local; no crea resultados, saldos, permisos ni publicaciones.

> **Confirmación final:** MJP CORE permanece intacto respecto de los cambios de esta orden. El despliegue queda expresamente pendiente de la decisión del propietario.


## Addendum de la Orden 49 — preparación de publicación sin despliegue

Se añadieron aliases de aplicación para `/portal`, `/qr-studio`, `/mapper` y `/the-eye`. QR Studio permite seleccionar como destino sin credenciales el Portal, Mapper, The Eye o `/lukita-ar-stage?entry=qr`, que abre la experiencia LUKA AR de revisión. La URL se calcula desde el origen actual; mientras no se publique, no se debe llamar “URL definitiva” ni imprimir QRs productivos con el dominio de preview.

La aplicación muestra un indicador persistente `ONLINE`/`OFFLINE` en la esquina superior y QR Studio incluye el estado de Service Worker. El panel territorial permite exportar un archivo de texto con fecha UTC, contexto seguro, conectividad y estados de GPS, cámara y micrófono.

La revisión visual en viewport móvil 390×844 confirmó `/qr-studio`, `/mapper`, `/the-eye` y `/lukita-ar-stage?entry=qr`. En la vista AR de sandbox el navegador reportó `AR NOT SUPPORTED`, lo que es una limitación esperada del entorno y no una prueba de WebXR físico.

No se ejecutó Publish ni se configuró un dominio DNS. El enlace actualmente verificable es el preview administrado por Manus: `https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer`. Para obtener una URL pública estable y SSL productivo, el propietario debe crear el checkpoint y usar el botón **Publish** de la interfaz de gestión; después puede asociar un dominio propio desde Settings → Domains. Los QR definitivos deben generarse solo después de conocer ese dominio.

**Readiness de publicación:** `CODE_READY_FOR_PUBLISH`, `PUBLIC_DEPLOYMENT_NOT_EXECUTED`, `DOMAIN_NOT_CONFIGURED`, `PHYSICAL_QR_SCAN_NOT_VERIFIED`. MJP CORE permanece fuera de los cambios de esta orden.


## Addendum de la Orden 50 — portal mínimo y publicación condicionada

La portada raíz quedó reducida a un portal de acceso visual inspirado en la referencia entregada: imagen de LUKA, botón L★ en la esquina superior izquierda, entrada interactiva **ENTRAR AL MUNDO** hacia `/lukita-ar-stage?entry=portal` y entrada **VER TV** hacia `/tv`. Se retiraron de la portada los catálogos, métricas, navegación extensa y módulos secundarios.

LUKA AR Stage incorpora loader interactivo durante la carga del motor 3D y un botón **Menú principal** hacia `/`. El modo WebXR sigue condicionado a soporte real del navegador/dispositivo; el fallback 3D no equivale a AR certificada.

Mapper + The Eye ahora muestra un modal de resumen del informe con descarga TXT. La aplicación mantiene el indicador persistente ONLINE/OFFLINE. El QR Studio ofrece destinos sin credenciales, incluyendo la entrada AR, pero la URL solo será definitiva después de Publish.

**Publicación:** no se ejecutó Publish ni se configuró DNS/dominio. Por tanto, no se generaron QRs productivos definitivos. El preview verificable continúa siendo `https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer`. El propietario debe crear el checkpoint, pulsar **Publish**, asociar el dominio en Settings → Domains y luego regenerar los QRs con el dominio público.

**Aislamiento:** la orden modificó únicamente `client/src`, documentación y TODO. No hay cambios en `server`, `drizzle` o `shared`; MJP CORE queda intacto. TV permanece fuera de integración técnica y solo se conserva como destino de navegación.


## Addendum de la Orden 51 — UX, accesos y Field Gate

La portada conserva el portal mínimo y ahora ofrece hover luminoso en el emblema circular L★. Un tap abre el visor QR circular; una pulsación larga usa Web Share cuando el dispositivo lo soporta y, en caso contrario, abre QR Studio. Los botones **ENTRAR AL MUNDO** y **VER TV** muestran transición y estado de carga antes de cambiar de ruta. El modal de auditoría ofrece correo, WhatsApp y descarga TXT.

Se generaron QRs SVG de preview, sin credenciales, para Portal, Mapper, The Eye y LUKA AR. No son QRs definitivos de producción: apuntan al preview HTTPS temporal y deben regenerarse después de Publish y dominio.

El Portal de Mantenimiento `/tech` queda deliberadamente no implementado en esta orden, siguiendo la recomendación del documento adjunto de obtener primero las primeras cinco muestras de campo. El diagnóstico existente en Mapper cubre GPS, cámara, micrófono y offline; el protocolo Field Gate 001 queda en `docs/ORDEN_51_FIELD_GATE_PROTOCOL.md`.

**Decisión de salida:** sí es posible iniciar un piloto controlado y reversible con dos teléfonos, cinco muestras y revisión humana. No debe declararse producción ni certificación AR hasta verificar permisos, escaneo, conectividad, cola offline, evidencia, hashes y decisión de Human Authority en dispositivos reales.


## Addendum — dominio público y QRs definitivos

La aplicación dispone ahora del dominio HTTPS público de Manus: `https://ruletaperu-dnzxnqyn.manus.space`. Se generaron QRs SVG sin credenciales para `/portal`, `/mapper`, `/the-eye` y `/lukita-ar-stage?entry=qr`. Estos códigos son definitivos respecto de la URL pública actual, pero su aceptación operativa todavía requiere escaneo físico en Android/iOS y ejecución del Field Gate 001. La configuración de dominio personalizado, si se desea una marca propia, queda como acción posterior en Settings → Domains.

La orden no integra TV ni modifica MJP CORE. La ruta `/tech` sigue siendo una propuesta de mantenimiento documentada, no una superficie nueva habilitada en la portada.
