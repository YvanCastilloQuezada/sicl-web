# MiLukita Controller Lab — adaptación por viewport nativo

**Fecha:** 28 de agosto de 2026.  
**Ruta:** `/touch-remote`.

## Decisión de diseño

La interfaz móvil **no debe fijarse a 16:9**. Esa proporción es apropiada para el lienzo de TV, mientras que los smartphones modernos son generalmente más altos y existen tablets, plegables y navegadores de escritorio con proporciones distintas. La página ya incluye viewport adaptable; la iteración incorpora la lectura de ancho y alto en píxeles CSS, relación aproximada y clase funcional de dispositivo. El contenido se refluye con Grid/Flex y no obliga desplazamiento horizontal.

La interfaz de control conserva su selector manual Horizontal/Vertical/Auto. La detección no intenta imponer la rotación del hardware: ajusta su composición a la orientación y tamaño disponibles. Esta alternativa evita conflictos con bloqueo de rotación, multitarea y pantallas plegables.

| Superficie | Regla aplicada |
|---|---|
| Celular 18:9 a 20:9 | Flujo vertical y tamaño libre basado en viewport disponible; no se encierra en un marco 16:9. |
| Celular horizontal | Reflow del contenido y modo Auto disponible; el preview no controla la orientación física. |
| Tablet / plegable | Reflow desde el ancho/alto disponible; la clase se muestra como contexto, no como declaración de compatibilidad física certificada. |
| TV / monitor | El lienzo de emisión permanece independiente y puede utilizar 16:9 donde corresponda. |

## Mejoras implementadas

| Elemento | Estado |
|---|---|
| Detección de viewport, proporción y clase phone/tablet/desktop | Implementado |
| Sugerencia de nombre e icono al importar perfiles | Implementado |
| Edición de nombre/icono y eliminación desde la lista local | Implementado |
| Alerta visual accesible por respaldo, latencia variable o alta | Implementado |
| Spinner accesible durante creación del QR | Implementado anteriormente y retenido |

## Validación

| Verificación | Resultado |
|---|---|
| `pnpm check` | PASS |
| Pruebas focalizadas | PASS — 4 archivos, 16 pruebas |
| `pnpm test -- --run` | PASS — 98 archivos, 336 pruebas; 1 archivo y 4 pruebas omitidas |
| `pnpm build` | PASS — 6,64 s |
| QA visual 390×844 (aprox. 19.5:9) | PASS, sin desbordamiento horizontal visible |
| QA visual 844×390 | PASS, sin desbordamiento horizontal visible |

La detección proporciona **píxeles CSS de viewport**, no la resolución física del panel. La resolución física, `devicePixelRatio`, área segura, teclado del sistema y modo multiventana no son datos fiables para imponer un diseño único; se deben tratar como condiciones de prueba física posteriores.

## Referencias

[1] [web.dev — Responsive web design basics](https://web.dev/articles/responsive-web-design-basics)  
[2] [MDN — `aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio)
