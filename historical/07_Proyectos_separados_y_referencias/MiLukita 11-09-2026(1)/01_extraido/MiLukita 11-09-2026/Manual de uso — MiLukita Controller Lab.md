# Manual de uso — MiLukita Controller Lab

**Versión:** revisión de producto

**Ruta:** `/touch-remote`

## 1. Qué es Controller Lab

MiLukita Controller Lab convierte el celular en un mando de presentación para una pantalla vinculada. El celular es el dispositivo de conexión y operación; la TV o pantalla recibe comandos de presentación autorizados. La herramienta no es un mando de juego con autoridad sobre resultados y no modifica MJP CORE, RNG, reglas, resultados, RTP, wallet, ledger, settlement, créditos ni el manifest autoritativo.

> **Idea principal:** la persona configura y usa el control únicamente dentro de `/touch-remote`; la pantalla vinculada recibe solo acciones de navegación, selección, retorno, inicio, salida, texto, reproducción o visibilidad QR según el rol y la sesión.

## 2. Acceso

Abre [`/touch-remote`](https://3000-i2iir7cc4y7kro7s9cjv5-72fa419e.us4.manus.computer/touch-remote). Si el entorno solicita autenticación, inicia sesión con la cuenta autorizada. El Controller Lab funciona como una página independiente de configuración y control; fuera de esta ruta no existe una configuración equivalente del mando.

## 3. La maqueta de pantalla

La vista previa usa una **maqueta maestra de 16 cm de largo por 8 cm de ancho** (proporción 2:1) para representar casi exactamente el dispositivo propuesto. La superficie lógica es siempre 16 × 8 cm; al girar el celular, la maqueta rota automáticamente y visualmente pasa a 8 × 16 cm (1:2).

Esta maqueta no pretende afirmar que todos los teléfonos físicos midan 16 × 8 cm. Es una referencia fija para evaluar proporciones, jerarquía y ergonomía. El teléfono real puede tener otra proporción; la interfaz detecta el viewport, rota automáticamente al cambiar la orientación y escala la maqueta sin exigir una selección manual.

## 4. Preparar la conexión con la TV

### Flujo QR

Primero abre Controller Lab en el celular y crea una sesión temporal desde el panel de sesión. En la pantalla autorizada aparecerá el QR de vinculación. Escanéalo con la cámara del celular y confirma el vínculo. La pantalla y el celular reciben tokens separados; la sesión es temporal, autenticada, auditable y de un solo vínculo móvil.

Cuando el vínculo termina, la interfaz muestra la luz de conexión, el rol activo y, cuando el canal WebSocket está disponible, la latencia aproximada. Si el WebSocket no está activo, el sistema usa el respaldo de consulta de comandos persistidos. Esto no debe interpretarse como disponibilidad física 24/7 sin una verificación específica del entorno de hosting y del hardware.

### Código manual

Si la cámara no puede leer el QR, genera o solicita el código numérico temporal de ocho dígitos que aparece en la sesión. Escríbelo en el celular y confirma. El código se usa una vez dentro de su vigencia, se almacena como hash en el servidor y no reemplaza la autenticación de la sesión.

### Cierre

Cierra la sesión desde Controller Lab cuando termine la presentación. No compartas capturas que contengan tokens, URLs privadas o códigos activos. Los perfiles y escenas locales no incluyen tokens, sesiones, QR ni estado de red.

## 5. Barra superior común

La barra superior concentra los accesos que deben estar disponibles sin ocupar la zona principal de uso. Los tres modos se muestran como iconos compactos. En reposo aparecen en **gris**; el modo activo aparece en **verde**. A la derecha se encuentra el cuarto botón: el **candado**.

| Control | Ubicación | Función |
|---|---|---|
| Icono Game Pad | Barra superior | Cambia al mando de navegación y presentación. |
| Icono Track Pad | Barra superior | Cambia a la superficie táctil y sus gestos. |
| Icono Teclado | Barra superior | Cambia al teclado y puntero. |
| Candado | A la derecha de los tres modos | Bloquea los controles para evitar pulsaciones accidentales. |
| Estado de conexión | Barra superior o área de estado superior | Muestra sesión, respaldo, WebSocket y latencia cuando existe medición. |
| Encendido `ON/OFF` | Parte superior izquierda del Game Pad | Indica si existe una sesión conectada; no representa alimentación eléctrica de la TV. |
| Estrella | Esquina superior derecha del Game Pad | Marca visual de escena o estado favorito; no ejecuta un comando de juego. |

El menú **Acceso rápido** permite cambiar entre Game Pad, Track Pad y Teclado sin volver a la pantalla principal. Al cambiar, el modo activo se resalta y aparece una transición breve. El interruptor de vibración permite activar o desactivar la háptica; el sonido sutil acompaña las pulsaciones cuando el navegador lo permite.

## 6. Regla de proporciones y rotación automática de las maquetas

| Modo | Horizontal | Vertical |
|---|---|---|
| Game Pad | 16 × 8 cm, 2:1 | 8 × 16 cm, superficie 16 × 8 cm rotada |
| Track Pad | 16 × 8 cm, 2:1 | 8 × 16 cm, superficie 16 × 8 cm rotada |
| Teclado | 16 × 8 cm, 2:1 | 8 × 16 cm, superficie 16 × 8 cm rotada |

La referencia **16 × 8 cm** describe la superficie lógica de cada maqueta. En vertical, la superficie se rota; no se crea una versión estrecha distinta ni se cambia la jerarquía de controles. El usuario solo debe girar el celular.

## 7. Game Pad

Game Pad usa la misma maqueta maestra de 16 × 8 cm y se adapta automáticamente al giro del celular. Su objetivo es controlar navegación y escenas de una presentación, no ejecutar lógica de juego.

### Franja superior

En la parte superior aparecen las teclas `0` a `9`, además de `*` y `#`. Estas teclas envían texto o selección de presentación según el contexto de la pantalla vinculada.

### Navegar

La zona de navegación contiene cuatro cuadrados grandes: arriba, izquierda, derecha y abajo. El centro queda libre; **no hay un botón OK entre las flechas**. Las flechas se usan para mover el foco visual en la pantalla.

### Escena

La zona de escena se organiza en tres columnas:

| Izquierda | Centro | Derecha |
|---|---|---|
| `VOL−` arriba | Retroceder arriba | `CH−` arriba |
| `VOL+` abajo | `EXIT` abajo | `CH+` abajo |

### Foco

La zona Foco contiene un solo círculo grande con `OK`. Úsalo para confirmar el elemento que está actualmente enfocado.

La parte inferior se mantiene despejada para permitir el uso cómodo del celular, especialmente en horizontal. Retroceso, encendido, señal y estrella no deben ocupar esa zona.

## 8. Track Pad

Track Pad es una superficie táctil para desplazamiento, toque y gestos de presentación. Sus controles de navegación superior son siempre visibles arriba: Atrás, Inicio, Salir, Retroceder e intensidad de señal. La superficie táctil ocupa el área central y queda libre de controles permanentes para que el dedo pueda desplazarse sin obstrucciones.

Un toque equivale a selección contextual cuando la pantalla lo admite. El desplazamiento con dos dedos mueve el contenido en la dirección del gesto; el pellizco separando los dedos y el pellizco acercándolos se traducen a zoom de presentación mediante acciones seguras de desplazamiento. El panel permite ajustar la sensibilidad de 1 a 10 en tiempo real; los valores altos reconocen movimientos más pequeños. Durante el gesto aparece un punto de contacto y un rastro breve. La vibración puede configurarse como **Suave, Media o Fuerte**; el navegador y el dispositivo pueden limitarla.

## 9. Teclado

Teclado incorpora escritura y un área de puntero/trackpad ajustable. La barra superior contiene los mismos cinco accesos: Atrás, Inicio, Salir, Retroceder e intensidad de señal.

En vertical, el teclado se ubica arriba y el trackpad debajo. En horizontal, el teclado ocupa aproximadamente dos tercios y el trackpad el tercio restante, con el tamaño ajustable desde su control. El usuario puede cambiar entre horizontal y vertical desde las preferencias del Controller Lab; los controles superiores permanecen arriba en ambas orientaciones.

## 10. Perfiles, escenas y personalización

Los perfiles guardan preferencias visuales y ergonómicas, como color, layout, vibración, sonido, modo, orientación, proporción del trackpad, sensibilidad táctil, posiciones y colores configurables. Las escenas favoritas guardan una combinación rápida de modo, color, layout, orientación y tamaño del trackpad.

Para guardar una escena, escribe un nombre en el panel de escenas y pulsa **Guardar**. Para utilizarla, selecciónala y pulsa **Aplicar**. Para eliminarla, usa la acción de eliminación de esa escena. Estas funciones son locales al navegador y no transmiten credenciales ni permisos.

El orden de los iconos superiores se puede personalizar desde el panel **Orden**. Usa las flechas laterales de cada icono para moverlo a izquierda o derecha. El orden se guarda localmente y se conserva en ese navegador.

## 11. Colores, tema, vibración y sonido

Los menús superpuestos usan una capa de cristal esmerilado (glassmorphism) con transparencia, desenfoque y contraste suficiente para conservar legibilidad. El tema puede alternarse entre las opciones disponibles del Controller Lab. El color neón puede seleccionarse de la paleta, personalizarse o regenerarse aleatoriamente. El color cambia la presentación visual del mando, pero no altera la autoridad de los comandos.

La vibración es opcional. Si se encuentra activada, el usuario elige intensidad **Suave, Media o Fuerte**; se intenta usar la API de vibración del dispositivo al pulsar controles, hacer doble toque o ejecutar un deslizamiento rápido. El sonido es un tono breve generado únicamente después de una interacción del usuario y puede estar bloqueado por las políticas del navegador. Ninguna de estas señales confirma por sí sola que la TV haya recibido el comando; para eso debe observarse el estado de conexión y la confirmación de sesión.

## 12. Candado y seguridad de uso

Pulsa el candado para bloquear las superficies de control. Cuando está bloqueado, las pulsaciones no envían comandos. Pulsa nuevamente para desbloquear. Es recomendable bloquear el mando cuando se está transportando el celular o cuando la presentación debe permanecer estable.

Los roles distinguen usuario, presentador y operador. Las sesiones son temporales y los comandos se validan por rol. El Controller Lab no concede acceso al núcleo del sistema y no permite controlar resultados, RNG, reglas, créditos, wallet o liquidación.

## 13. Diagnóstico rápido

| Situación | Qué significa | Qué hacer |
|---|---|---|
| `SIN SESIÓN` | El celular no tiene una vinculación activa. | Crear sesión y escanear QR o usar código manual. |
| `RESPALDO` | El canal persistente no está activo y se usa consulta de respaldo. | Mantener la sesión; comprobar red y pantalla. |
| Latencia alta | El tiempo de respuesta es elevado. | Acercarse al punto de acceso, reducir congestión y revisar la red. |
| El QR no escanea | La cámara o la imagen no permite leerlo. | Aumentar brillo, limpiar la cámara o usar código manual. |
| No vibra | El dispositivo o navegador no ofrece la API o está desactivada. | Activar el interruptor, probar otra intensidad y continuar usando feedback visual. |
| El multitouch no responde | El navegador no entrega dos punteros o el gesto se realizó con un dedo. | Usar dos dedos simultáneamente y comprobar que la superficie tenga el foco. |
| No suena | El navegador bloqueó audio o el sonido está desactivado. | Interactuar primero con la página y revisar el interruptor de sonido. |
| Controles no responden | El mando puede estar bloqueado o la sesión haber caducado. | Desbloquear, revisar estado y renovar la sesión. |

## 14. Uso recomendado en una presentación

Antes de comenzar, abre la TV en la pantalla autorizada, abre Controller Lab en el celular, vincula la sesión y confirma la señal. Selecciona el modo que usarás, prueba una flecha y una acción de foco, y después bloquea el mando si no habrá cambios durante unos minutos.

Durante la presentación, mantén la parte inferior libre, usa la barra superior para volver o cambiar de modo y observa la señal. En Game Pad usa la navegación y el foco; en Track Pad usa gestos; en Teclado escribe con el teclado superior y mueve el puntero en la superficie correspondiente.

Al finalizar, detén la sesión y evita conservar códigos activos. Si existe un incidente, registra hora, modo, estado de conexión y acción intentada, sin incluir tokens en el informe.

## 15. Límites actuales

Controller Lab es un piloto virtual de presentación. La operación de WebSocket persistente, el escaneo físico de QR, la vibración, el sonido y la experiencia concreta en cada modelo de celular deben comprobarse en el hardware y entorno correspondiente. La maqueta fija de 16 × 8 cm ayuda a entender la distribución, pero no sustituye la detección de la orientación y proporción nativa del dispositivo.

## 16. Lukita Star Trail

El puntero de las superficies táctiles se presenta como una estrella amarilla denominada **Lukita Star Trail**. Sigue el punto de contacto y deja una estela breve para hacer visible el recorrido del dedo. Su tamaño y color se ajustan desde la sección de configuración; estas preferencias quedan guardadas en el perfil local del usuario.

Los puntos circulares que aparecen durante un gesto multitáctil representan contactos activos y no son botones adicionales. La estrella y su estela son únicamente feedback visual: no modifican la autoridad de los comandos ni acceden al núcleo del sistema.

### Configuración de la estela

En **Rastro de contacto**, el interruptor **Mostrar estela** permite activar o desactivar la estela de Lukita Star Trail. El control **Duración** determina cuánto tiempo permanece visible después del gesto. En multitouch, cada dedo conserva su propia estrella y su propio recorrido mientras el contacto está activo. Al tocar o hacer clic aparece un destello radial breve de partículas; es feedback visual y no confirma por sí solo la recepción del comando en la TV.

## 17. Compartir perfiles y controlar volumen

Desde **Compartir sin sesión**, genera un código corto para la configuración visual actual. El Lab también presenta un enlace y un código QR que contienen únicamente la referencia temporal del perfil; no incluyen sesiones, tokens, roles ni estado de conexión. El usuario receptor puede cargar el código desde su propio Controller Lab.

Los tres devices disponen de controles de volumen en la barra superior. **Volumen menos** y **Volumen más** envían acciones de presentación a la pantalla vinculada; no modifican el audio local de feedback del celular. El sonido de toque y la vibración se controlan por separado desde las preferencias del Lab.


### Volumen, mute y ocultación automática

La barra de volumen muestra el nivel actual y usa el color configurado por el usuario. Tras el período seleccionado, entre 2 y 12 segundos, se desvanece para dejar limpia la interfaz; vuelve a aparecer cuando se ajusta el volumen o se modifica el mute. El icono cambia entre altavoz activo y altavoz silenciado. El mute actúa sobre el audio de presentación; los sonidos de interacción del celular se gestionan por separado.

La propuesta de visor **Lukita AR Stage**, incluyendo su tutorial de 30 segundos, requisitos de optimización 3D y la integración de volumen y Lukita Star Trail, se encuentra en `docs/LUKITA_AR_STAGE_PROPOSAL.md`. Permanece como propuesta de preproducción y no activa WebAR por sí sola.

## 18. Herramientas nuevas de Lukita Live

### Generador QR dinámico para pruebas físicas

En Controller Lab, abre **Generador QR dinámico** y elige `Experience QR` o `LukitaPoint · prueba`. Define una etiqueta y una duración de 1 a 30 minutos; después pulsa **Generar QR dinámico**. Escanea el código desde otro móvil para abrir el flujo de experiencia. Puedes descargar la imagen del QR. Este código es exclusivamente de prueba, expira automáticamente y no vincula Controller Lab ni concede permisos sobre el juego.

### Revisión privada de LukitaPoints

El módulo **Borrador de publicación** permite nombrar un punto y elegir `Privado`, `No listado` o `Público`. La opción recomendada para pruebas es `Privado`. Marca la confirmación de borrador y pulsa **Enviar a revisión**. El estado cambia a `REVIEW`; la activación pública no ocurre desde Controller Lab y siempre exige aprobación humana, asset versionado y verificación de privacidad.

### Vista previa del Character Foundation

La tarjeta **Vista previa de anchors** permite alternar entre las vistas conceptuales frontal, tres cuartos y lateral y marcar los anchors que se desean revisar: rostro adulto, cabello y silueta, estrella dorada, proporción y paleta maestra. El contador muestra únicamente el avance del checklist. La referencia visual no es el GLB final y marcar todos los anchors no constituye aprobación de producción.
