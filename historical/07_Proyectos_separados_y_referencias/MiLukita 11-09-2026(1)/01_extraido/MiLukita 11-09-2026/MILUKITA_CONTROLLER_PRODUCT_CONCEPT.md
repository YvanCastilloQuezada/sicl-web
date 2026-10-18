# MiLukita Controller Lab — Propuesta formal de concepto de producto

**Estado:** Dirección visual aprobada para wireframe; composición Prism aplicada en Controller Lab y pendiente de revisión visual humana antes de cualquier refinamiento posterior.  
**Ámbito:** Solo interfaz del companion móvil de presentación. No altera MJP CORE, reglas, RNG, resultados, RTP, wallet, ledger, settlement, créditos ni `MjpTvManifest`.

## 1. Decisión de producto

Mi propuesta es que MiLukita no intente parecer un control físico específico ni una copia de un periférico conocido. Debe convertirse en un **companion de pantalla vivo**, con tres personalidades coherentes: **Game Pad de escena**, **superficie de gestos** y **teclado de apoyo**. Los tres modos usan una maqueta maestra de 16 × 8 cm y se adaptan automáticamente al giro del celular; no se requiere una selección manual de orientación.

La identidad no se basa en logos, nombres de modelos, disposición exacta de botones, acabados iridiscentes ajenos ni promesas de tecnologías de hardware. La inspiración permitida es funcional: jerarquía clara, controles rápidos, superficie táctil amplia y respuesta visual/háptica optativa. La ejecución debe ser inequívocamente MiLukita: vidrio oscuro, borde neón fino, acento configurable, tipografía de señal y una insignia `ML` propia.

La diferenciación tampoco se medirá por un porcentaje visual —por ejemplo, “cambiar 2%”—, porque una variación mínima seguiría pudiendo conservar una apariencia reconocible de un producto ajeno. La regla correcta es mantener solo las **capacidades genéricas** y construir una composición, nomenclatura, jerarquía, iconografía y comportamiento propios.

## 2. Concepto rector: **MiLukita Prism Control**

El dispositivo virtual parte de una maqueta maestra de 16 × 8 cm (2:1) y se divide en tres zonas de lectura inmediata. Al girar el celular, la misma superficie rota automáticamente a 8 × 16 cm, sin crear una distribución vertical distinta. A la izquierda vive la navegación direccional; al centro, las acciones de presentación de contexto; a la derecha, una superficie radial o de gestos. La distribución es asimétrica, limpia y estable: no intenta simular un teléfono de marca, sino una consola de control de contenidos para una pantalla asociada.

| Zona | Propósito | Elementos | Restricción |
|---|---|---|---|
| Banda superior | Estado y seguridad | Luz de enlace, rol, latencia, candado, regresar | No muestra credenciales ni autoridad de juego. |
| Área izquierda | Navegación precisa | Cruceta, seleccionar y volver | Solo comandos de presentación permitidos. |
| Área central | Acciones de escena | Inicio, salir, volumen/avance visuales si los permisos lo permiten | Ninguna acción cambia una ronda, resultado o saldo. |
| Área derecha | Control contextual | Rueda de foco, trackpad o puntero según modo | No accede a la lógica autoritativa. |

## 3. Especificación por modo

### Matriz de referencia funcional, no visual

| Necesidad funcional | Traducción propia MiLukita | No se adopta |
|---|---|---|
| Navegar una pantalla | Cruceta Prism con `OK` central, `Atrás`, `Inicio` y `Salir` separados | Forma, posición exacta, color, etiquetas o logotipo de un control comercial. |
| Cambiar contexto de presentación | Disco contextual derecho y selector de tres modos | Botones de canal, fuente o encendido físico de una TV. |
| Desplazar, tocar y ampliar | Gestos de toque, arrastre, scroll y presión prolongada en Prism Track Pad | Nombre de tecnología propietaria, sensor físico o apariencia de un trackpad concreto. |
| Escribir y mover puntero | Teclado superior y trackpad inferior vertical, con altura ajustable | Rejilla, chasis, atajos, leyendas o disposición de un teclado comercial. |

### A. Modo **Prism Game Pad**

El Game Pad usa la misma maqueta maestra 16 × 8 cm y rota automáticamente con el celular, conservando sus controles y jerarquía. La franja superior reúne las teclas `0–9`, `*` y `#`; todos los símbolos quedan en esa banda. Su navegación usa cuatro cuadrados de flechas ampliados, sin `OK` entre las flechas. El único `OK` grande vive en el área de foco, a la derecha, evitando confundir navegación y confirmación.

El área Escena se divide en tres columnas de presentación: volumen (`VOL −` y `VOL +`) a la izquierda; retroceso y `EXIT` al centro; canal (`CH −` y `CH +`) a la derecha. Estas etiquetas emiten únicamente acciones de interfaz autorizadas hacia una pantalla vinculada y no controlan hardware físico ni funciones de juego.

Los controles de “volumen” o “canal” se tratarán como comandos de interfaz de presentación únicamente si existe una acción autorizada del receptor. En ausencia de esa capacidad, deben desaparecer o informar que no están disponibles. No se dibujarán logos de terceros, números de modelo ni botones que sugieran control real de hardware externo.

### B. Modo **Prism Track Pad**

La experiencia se inspira en la sensación de una superficie amplia y continua, no en una réplica de un periférico. Ocupa la mayor parte de la pantalla con una cuadrícula de luz muy discreta y ofrece toque, arrastre, desplazamiento y zoom solo cuando el receptor soporte una acción de presentación equivalente. Un toque breve confirma; una pulsación prolongada abre una alternativa contextual visual; los bordes quedan deliberadamente inactivos para reducir toques accidentales.

La respuesta se compone de brillo puntual, vibración opcional y sonido suave activado únicamente tras interacción del usuario. No se afirmará soporte de sensores de presión ni de una tecnología de hardware inexistente. La función se denomina **presión prolongada**, no “Force Touch”.

### C. Modo **Mini Teclado + Puntero**

La referencia funcional es un teclado inalámbrico compacto con superficie de puntero integrada, pero el diseño propio conserva una rejilla tipográfica MiLukita. En vertical, el teclado se ubica arriba y el trackpad debajo; en horizontal, se distribuyen en dos columnas. La altura o el ancho del trackpad se mantiene ajustable entre 20% y 45%, según la orientación. Se priorizan teclas necesarias para búsquedas, nombres o acciones de presentación: letras, números, espacio, borrar, limpiar y enviar.

El área de puntero es un plano inferior vertical con una línea de scroll y un botón primario virtual, no una copia geométrica de un teclado comercial. El texto se transmite exclusivamente como comando permitido y se visualiza como previsualización local antes de llegar a una pantalla vinculada.

## 4. Sistema visual y ergonomía

La carcasa virtual propone negro mineral, aluminio grafito simulado y neón configurable —por defecto generado al iniciar—, sin acabados arcoíris asociados a productos ajenos. En vez de sombras profundas, la profundidad se comunica con dos niveles: vidrio negro y línea de luz fina. El usuario puede guardar perfiles, etiquetas, iconos, favoritos, orientación y posición de controles desde Controller Lab, y solo allí.

| Decisión | Regla propuesta |
|---|---|
| Orientación | Los tres modos usan la maqueta 16 × 8 cm y rotan automáticamente según el viewport; no hay selector manual de orientación. |
| Área operable | Controles críticos con zona mínima de 44 px y márgenes anti-error. |
| Accidentalidad | Candado persistente; desactiva toda emisión de comando mientras está activo. |
| Estado de enlace | Siempre visible mediante luz, etiqueta, barras de calidad y latencia. |
| Color | Un color neón principal por perfil; alerta de red progresa de verde a rojo según ping. |
| Movimiento | Solo transiciones breves, reversibles y respetuosas de reducción de movimiento. |

## 5. Flujos esenciales

1. La TV crea un enlace temporal y expone QR más código manual de ocho dígitos.
2. El usuario escanea o ingresa el código mientras tiene sesión autenticada.
3. La aplicación confirma vínculo, rol y estado de transporte; el control no se habilita antes.
4. El usuario selecciona modo o perfil; sus ajustes permanecen locales, salvo que comparta una configuración sanitizada por código corto.
5. Ante pérdida de socket, se ve el respaldo, cuenta regresiva y botón de reconexión; los comandos persisten por el canal autorizado existente.
6. Al vencer o cerrar la sesión, el control vuelve a estado seguro sin conservar token ni código temporal.

## 6. Límites obligatorios

> MiLukita Controller Lab es una superficie de presentación, no un mando de juego autoritativo ni un mando físico de TV.

El diseño conserva la barrera `coreAccess: NONE`. No debe incluir operaciones, textos o iconografía que sugieran acceso a resultados, RNG, reglas, RTP, créditos, wallet, ledger, settlement, retiros, dinero real o `MjpTvManifest`. El diseño tampoco debe copiar o utilizar marcas, logotipos, números de modelo, nombres comerciales o trade dress de LG, Apple, Logitech u otros terceros.

## 7. Secuencia recomendada de implementación

| Fase | Resultado verificable | Decisión humana requerida |
|---|---|---|
| 1. Wireframe | Composición Prism Game Pad, Track Pad y Mini Teclado vertical en las proporciones ya soportadas | Revisar legibilidad, densidad de controles y prioridad visual. |
| 2. Prototipo UI | Cambio entre modos, estados de enlace, candado y perfiles sin tocar backend de sesiones | Aprobar los refinamientos visuales que surjan de la revisión del wireframe. |
| 3. Prueba física | Flujo TV → QR/código → celular → comandos de presentación en al menos un teléfono y una TV | Confirmar ergonomía y umbrales reales de latencia. |
| 4. Ajuste final | Correcciones de tamaño, contraste, háptica y lectura a distancia | Aprobar para uso interno de presentación. |

## 8. Recomendación final

**MiLukita Prism Control** combina lo valioso de las referencias —orientación horizontal, direccional, superficie táctil y teclado integrado— con una identidad diferenciada, límites de seguridad explícitos y una ejecución viable sobre el Controller Lab existente. El wireframe revisable está aplicado sin generar una copia visual ni integrar hardware; cualquier ajuste siguiente debe derivar de observaciones humanas concretas sobre este diseño propio.
