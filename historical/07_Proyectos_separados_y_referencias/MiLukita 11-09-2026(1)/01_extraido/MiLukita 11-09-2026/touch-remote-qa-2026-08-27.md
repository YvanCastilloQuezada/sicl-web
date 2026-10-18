# MiLukita Touch Remote · QA visual

La ruta independiente `/touch-remote` fue verificada en Chromium a 1280×720 y 390×844. La vista muestra una previsualización del pad, paleta neón con color aleatorio al montar, botón Aleatorio, modos espacioso/compacto, vibración, guardado/carga de perfiles y enlace de sesión temporal. No se observó overflow horizontal en la primera pantalla móvil. El alcance se mantiene en comandos de presentación y navegación; no se implementó todavía el canal realtime ni una sesión QR autoritativa.

## Evaluación trackpad

La previsualización ahora presenta una superficie táctil continua con instrucciones de deslizar, tocar y desplazar. Los gestos de puntero traducen deslizamientos horizontales a izquierda/derecha, deslizamientos verticales a desplazamiento arriba/abajo, toques cortos a selección y rueda a desplazamiento. La interacción tiene umbral de 24 px para reducir activaciones accidentales y conserva vibración opcional. La captura desktop confirma una jerarquía visual centrada en la superficie, pero la sensación física, latencia y precisión en un teléfono real requieren validación con hardware.

## Controller Lab de cuatro modos

La ruta `/touch-remote` ahora presenta un selector accesible con cuatro modos: **Remoto**, **Game Pad**, **Track Pad** y **Teclado**. Remoto conserva el pad direccional; Game Pad añade botones A, Acción y B; Track Pad conserva gestos y desplazamiento; Teclado incorpora filas alfanuméricas, espacio, borrar, Enter y limpiar texto. El color neón se mantiene por sesión y puede regenerarse desde la personalización. La interfaz continúa limitada a presentación/navegación y no concede autoridad sobre MJP CORE.

## Enlace QR, permisos y respuesta visual

El Controller Lab implementa sesiones persistentes con QR temporal, un token independiente para la pantalla y otro para el celular, vencimiento entre 60 y 1.800 segundos, vínculo de un solo celular por sesión, idempotencia por `requestId`, comandos auditables y cierre explícito. La pantalla `/tv?mode=live&controllerSession=…&controllerScreen=…` consulta los comandos nuevos cada 750 ms mediante el almacenamiento persistente y solo aplica acciones de presentación. Los roles efectivos son USER, PRESENTER y OPERATOR; una cuenta administrativa equivale a OPERATOR para el Controller Lab y solo ADMIN puede asignar roles. La revisión visual en 1280×720 y 390×844 mostró los cuatro modos, el control neón y los paneles de sesión/permisos sin overflow horizontal observable. La validación de latencia entre dispositivos físicos sigue pendiente.

## Perfiles sensoriales y escaneo QR guiado

Los perfiles locales ahora conservan color neón, distribución, vibración, sonido, modo y posiciones/colores de los controles perimetrales. El audio es una señal Web Audio breve, invocada únicamente por una acción del usuario; si el navegador la bloquea, se conserva feedback visual y háptico cuando esté permitido. A 390×844, los interruptores de vibración y sonido, las cuatro posiciones configurables y el botón de creación QR se muestran sin desbordamiento horizontal observable. Al crear o vincular una sesión, la guía explica escaneo, confirmación y revisión de conexión; tras vincularse muestra el estado de éxito. La validación del lector físico y la reproducción de sonido en hardware móvil continúan pendientes.
