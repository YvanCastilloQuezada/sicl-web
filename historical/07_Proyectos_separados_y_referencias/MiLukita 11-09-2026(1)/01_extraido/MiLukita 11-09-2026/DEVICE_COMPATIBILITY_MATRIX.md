# Multi Juegos Perú — Fichas técnicas de compatibilidad multidispositivo

**Fecha de corte:** 26 de agosto de 2026  
**Producto:** Multi Juegos Perú, piloto de entretenimiento con créditos virtuales  
**Rutas principales:** `/`, `/tv`, `/overlay/:roundId`, `/games`, `/simulator`

> Estas fichas describen compatibilidad esperada y criterios de prueba. No sustituyen la certificación de un laboratorio, la prueba de un dispositivo concreto ni una homologación regulatoria.

## 1. Requisitos comunes

MJP es una aplicación web/PWA. El dispositivo debe disponer de navegador moderno con JavaScript, cookies o almacenamiento local habilitado, conexión HTTPS y reloj razonablemente correcto. El TV Client y el overlay consumen el manifest desde el backend; no calculan resultados.

| Requisito | Mínimo recomendado | Evidencia a registrar |
|---|---|---|
| Conexión | Wi-Fi estable; 5 Mbps para señal audiovisual | Latencia, pérdida y tipo de red |
| Navegador | Motor Chromium, WebKit o Firefox actualizado | Nombre y versión |
| JavaScript | Habilitado | Carga de rutas y llamadas tRPC |
| Almacenamiento | `localStorage` habilitado | Persistencia de tema y marca |
| Pantalla | 320 px de ancho para UI móvil; 1280×720 recomendado para TV | Resolución y escala |
| Accesibilidad | Teclado, lector o controles remotos según equipo | Navegación y foco visible |
| Instalación | Soporte PWA opcional | Resultado de instalación |

## 2. Ficha: Smart TV con navegador integrado

**Uso principal.** Visualizar `/tv` como canal web, elegir transmisión en vivo o en línea, consultar estado, QR, contingencia y manifest. El control remoto debe poder alcanzar el selector, los botones de modo y **Salir al portal**.

**Criterios técnicos.** Probar el navegador integrado del fabricante en 1280×720 o la resolución nativa. Confirmar que CSS Grid, `backdrop-filter` degradable, `aria-live`, foco visible, `localStorage`, QR y polling funcionan. Si el navegador no soporta instalación PWA, usar marcador o URL fija.

**Matriz de aceptación.**

| Caso | Resultado esperado |
|---|---|
| Abrir `/tv` | Aparece selector de transmisión en vivo/en línea sin desbordamiento |
| Control remoto | Los controles reciben foco y activación |
| Modo en línea | Muestra manifest, ronda, QR e historial sin depender de YouTube |
| Modo en vivo | Reserva espacio audiovisual y comunica contingencia si no hay señal |
| Actualización | La notificación aparece solo cuando cambia secuencia/estado |
| Desconexión | Se informa pérdida de manifest y se conserva último estado verificable |
| Salida | **Salir al portal** devuelve a `/` |
| Legibilidad | Texto y estados permanecen visibles a distancia de 2–3 metros |

**Riesgos.** Navegadores propietarios pueden no soportar APIs modernas, fuentes, audio/video embebido o interacción táctil. Debe evitarse depender de funciones especiales del fabricante.

## 3. Ficha: Android TV y Google TV

**Uso principal.** Ejecutar `/tv` en navegador compatible o mediante una envoltura web aprobada por el producto. Para el flujo real se recomienda que el QR se escanee desde un celular, no desde el control remoto.

**Criterios técnicos.** Probar foco direccional con flechas, tecla atrás, escalado 1080p/4K, suspensión/reanudación, reconexión Wi-Fi y cambios de orientación de ventana. Confirmar que la caída de señal audiovisual no oculta el estado del manifest.

| Caso | Resultado esperado |
|---|---|
| Flechas y OK | Selector, temas y salida son navegables sin mouse |
| Tecla atrás | No genera doble navegación ni deja overlay bloqueante |
| Reconexión | El indicador cambia de desconectado a conectado sin recargar toda la app |
| 4K escalado | No aparecen textos microscópicos ni paneles cortados |
| QR | El código permanece visible y con contraste suficiente |
| Modo reducido | `prefers-reduced-motion` elimina pulsos no esenciales |

**Riesgos.** El soporte de navegador y PWA varía por fabricante y versión de Android TV. La validación debe registrar si se usó navegador, WebView o aplicación envolvente.

## 4. Ficha: Laptop o PC

**Uso principal.** Operación, navegación, simuladores, `/tv`, overlay para OBS y panel administrativo.

**Criterios técnicos.** Probar Chrome/Edge, Firefox y Safari cuando corresponda; 1280×720 mínimo para operación cómoda y 1920×1080 recomendado. Confirmar teclado, mouse, lector de pantalla, descarga PNG y exportación con marca.

| Caso | Resultado esperado |
|---|---|
| `/tv` | Selector y panel de temas accesibles por teclado |
| Persistencia | El tema y la marca se conservan después de recargar |
| Overlay | Estadísticas se actualizan con el manifest y resaltan cambios |
| PNG | Se descarga archivo local con marca y leyenda virtual |
| OBS | La URL del overlay puede abrirse como fuente de navegador |
| Exportación | No se realiza subida del manifest al servidor |

**Riesgos.** Extensiones de privacidad, bloqueo de descargas o políticas corporativas pueden impedir `localStorage`, canvas o descargas.

## 5. Ficha: Tablet

**Uso principal.** Segunda pantalla, participación virtual, visualización TV en modo horizontal y consulta de resultados.

**Criterios técnicos.** Probar 768×1024 y 1024×768, orientación horizontal/vertical, zoom del navegador, toque, teclado virtual y recuperación tras suspensión.

| Caso | Resultado esperado |
|---|---|
| Toque | Botones y tarjetas tienen área táctil cómoda |
| Orientación | No se pierde el modo seleccionado ni el manifest |
| Suspensión | Al volver, el indicador actualiza conexión correctamente |
| Tema | El panel de notificaciones permite elegir tema sin teclado |
| QR | Puede visualizarse o escanearse desde otro dispositivo |
| Offline | Se muestra contingencia, no un resultado inventado |

## 6. Ficha: Celular

**Uso principal.** Pantalla secundaria, escaneo de QR, modo en línea, simuladores y PWA instalada.

**Criterios técnicos.** Probar 390×844 y un ancho de 320 px; Android Chrome y iOS Safari. Confirmar safe areas, teclado, desplazamiento, instalación PWA, permisos de cámara solo si se incorporan posteriormente y navegación con una mano.

| Caso | Resultado esperado |
|---|---|
| Inicio | No hay desbordamiento horizontal |
| PWA | Se puede instalar según el sistema; si no, la web sigue funcionando |
| QR | El enlace abre la pantalla secundaria y respeta expiración |
| Desconexión | Se informa sin atribuir autoridad al último resultado no verificado |
| Exportación | Si se ofrece, la descarga usa el mecanismo soportado por el navegador |
| Salida | El usuario puede volver al portal sin quedar atrapado |

**Riesgos.** iOS Safari tiene restricciones de descarga, almacenamiento y ejecución en segundo plano; el resultado depende de la versión instalada. No se debe asumir soporte idéntico al de Chromium.

## 7. Ficha: OBS y navegador de producción

**Uso principal.** Fuente de navegador para `/overlay/:roundId` en OBS. El overlay debe mantenerse limpio, legible y sin controles innecesarios durante la emisión.

**Criterios técnicos.** Probar transparencia/fondo requerido por la escena, escalado 16:9, latencia de polling, reconexión y actualización del panel. Registrar versión de OBS, motor embebido, resolución de lienzo y FPS.

| Caso | Resultado esperado |
|---|---|
| Carga inicial | Estado claro sin parpadeo prolongado |
| Manifest nuevo | Panel resalta actualización brevemente |
| Error | Mensaje de desconexión, sin datos fabricados |
| Resultado | Solo aparece cuando el manifest lo publica |
| PNG | Exportación opcional desde navegador normal, no requisito de OBS |

## 8. Procedimiento de prueba por equipo

Cada ejecución debe registrar: identificador de prueba, fecha UTC, dispositivo, fabricante y modelo, sistema operativo, navegador/WebView, versión, resolución, orientación, red, URL, usuario de prueba si aplica, resultado PASS/FAIL, evidencia visual, logs de consola y observaciones.

La secuencia recomendada es abrir `/tv`, cerrar la guía táctil si aparece, seleccionar **Ver en línea**, confirmar estado conectado, cambiar tema, recargar, verificar persistencia, observar un cambio de manifest, seleccionar **Cambiar modo**, entrar en vivo, volver a línea y usar **Salir al portal**. Para overlay, abrir un `roundId` público, observar estadísticas, cambiar la marca, exportar PNG y revisar el archivo descargado.

## 9. Criterios de cierre

La matriz se considera cerrada solo cuando cada caso crítico tiene evidencia por dispositivo. Un resultado automatizado de Chromium no certifica navegadores propietarios, WebView móviles ni hardware físico. Cualquier fallo de renderizado debe clasificarse como bloqueo, degradación aceptable o mejora pendiente, con responsable y fecha.
