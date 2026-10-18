# QA de compatibilidad TV — reejecución

## Evidencia reproducible

Se capturó `/tv` con viewport 1920×1080 como perfil de pantalla grande y con 1366×768 como perfil de pantalla intermedia. En ambos casos la pantalla cargó la selección de modo con `Ver transmisión en vivo` y `Ver en línea`, el aviso de créditos virtuales y la autoridad del servidor, además de la sección de favoritos.

| Perfil | Viewport | Resultado de emulación |
|---|---:|---|
| Smart TV grande | 1920×1080 | PASS visual en navegador Sandbox |
| TV intermedia | 1366×768 | PASS visual en navegador Sandbox |
| Android/Google TV de referencia | 1280×720 | PASS visual previo en navegador Sandbox |

Esta evidencia solo verifica layout y contenido en Chromium con viewport configurable. No certifica Samsung Tizen, LG webOS, Android TV/Google TV ni mando a distancia porque no hay hardware físico conectado al Sandbox.

## Control remoto neón

Se añadió un mando visual fijo en `/tv` con paleta neón aleatoria al montar el componente. Incluye botones accesibles para arriba, abajo, izquierda, derecha y seleccionar, además de una acción para cambiar el color. La segunda captura a 1280×720 confirmó que el control queda dentro del viewport tras reducir su tamaño; la verificación se realizó en Chromium emulado y no representa certificación de mando físico.
