# Lukita AR Stage

## Estado

**Propuesta de experiencia y especificación de preproducción.** No constituye aprobación del avatar final, integración oficial, publicación pública ni conexión con MJP CORE.

## Concepto

Lukita AR Stage es un visor WebAR de presentación. Su objetivo es permitir que una persona coloque a Lukita en su espacio, la observe a escala controlada y revise su presencia, silueta, rostro, vestuario y expresiones sin convertir la sesión AR en una autoridad de juego ni en un editor del modelo maestro.

La pantalla inicial debe ser limpia y directa. El CTA principal será **Ver a Lukita en mi espacio**. Antes de solicitar la cámara, el visor explicará qué permiso necesita, que el procesamiento debe permanecer local cuando sea posible y que se puede continuar en un visor 3D si el navegador no admite WebXR.

## Bienvenida y tutorial de 30 segundos

| Tiempo | Pantalla | Acción del usuario | Confirmación |
|---|---|---|---|
| 0–5 s | Bienvenida: “Lukita AR Stage” y “Ver a Lukita en mi espacio” | Inicia la experiencia | El usuario entiende el propósito y ve la opción de continuar sin AR |
| 5–10 s | Permiso de cámara y privacidad | Acepta o rechaza | El visor no activa cámara sin consentimiento |
| 10–15 s | Detección de superficie | Mueve lentamente el celular | Una retícula indica una superficie estable |
| 15–20 s | Colocación | Toca la superficie | Aparece Lukita en escala inicial moderada |
| 20–25 s | Ajustes | Arrastra para mover, pellizca para escala y gira con dos dedos | Una microayuda confirma cada gesto una sola vez |
| 25–30 s | Escena | Pulsa “Ver presentación” o “Recentrar” | El tutorial termina sin bloquear el visor |

El tutorial debe poder omitirse y reabrirse desde un botón de ayuda. Se debe respetar `prefers-reduced-motion`, evitar animaciones decorativas continuas y mantener siempre visibles **Pausar**, **Ocultar Lukita**, **Recentrar** y **Salir**.

## Modos recomendados

El visor debe comenzar con tres opciones: **Cuerpo completo**, **Busto** y **Rostro**. Cada modo debe conservar la identidad aprobada y usar una cámara guiada, no una colección de controles técnicos. La iluminación debe ofrecer al menos **Estudio**, **Neutra** y **Entorno**, sin prometer una captura físicamente exacta del espacio.

## Requerimientos preliminares del modelo 3D

Estos límites son objetivos de optimización para preproducción y deberán validarse con un GLB real. No sustituyen el control de calidad del artista.

| Elemento | Objetivo inicial móvil | Criterio |
|---|---:|---|
| Cuerpo completo visible | 35k–70k triángulos renderizados | Mantener silueta, rostro y cabello legibles |
| Busto o rostro | 25k–55k triángulos renderizados | Priorizar rasgos faciales y cabello |
| LOD adicional | 8k–20k triángulos | Usarlo en distancia o hardware limitado |
| Materiales | 4–8 materiales principales | Evitar fragmentación innecesaria |
| Texturas | 1k–2k por mapa en móvil; 2k solo si es necesario | Preferir KTX2/Basis cuando el pipeline lo permita |
| UV | Sin solapamientos inesperados en zonas visibles | Revisar rostro, cabello, insignia y vestuario |
| Animaciones | Pocas y cortas | No cargar rigging definitivo en esta fase |

El archivo GLB debe comprimirse con **Draco** para geometría cuando el pipeline y el dispositivo lo toleren, y usar **Meshopt** como alternativa o complemento para la entrega. La compresión no debe introducir artefactos en rostro, cabello, manos, insignia o silueta. Las texturas deben comprimirse con un formato GPU apropiado; se recomienda preparar variantes de calidad y cargar progresivamente.

La carga debe separar el primer plano de los recursos secundarios: primero silueta, rostro y materiales esenciales; después accesorios, expresiones y variantes. El visor debe mostrar progreso, permitir cancelar y liberar recursos al salir. Se debe probar memoria, tiempo de primera aparición, estabilidad térmica y recuperación tras volver de segundo plano.

## Lukita Star Trail en AR

Lukita Star Trail será el cursor de interacción del visor, no un elemento pegado al cuerpo de Lukita. Puede aparecer al tocar, mover o seleccionar una opción, dejando una estela breve configurable. Su color amarillo por defecto debe contrastar con escenas claras y oscuras; tamaño, color, visibilidad y duración deben depender de las preferencias del Controller Lab cuando el usuario comparta un perfil. En AR se debe limitar la densidad de partículas para no competir con el rostro ni producir fatiga visual.

## Volumen y audio

El volumen debe mostrarse en una barra compacta del visor, con mute, nivel actual y recuperación al tocar. El control puede gobernar el audio de presentación de AR; los efectos de interfaz deben poder silenciarse por separado. Los sonidos deben ser cortos, suaves y opcionales. Si el dispositivo o navegador bloquea audio automático, el visor debe esperar una interacción explícita y explicar el estado sin mostrar un error técnico.

## Límites de seguridad y producto

AR Stage no debe leer ni modificar RNG, resultados, reglas, RTP, wallet, ledger, settlement, créditos ni MjpTvManifest. Tampoco debe permitir que Lukita cambie decisiones de juego. El modelo cargado por URL, si se habilita en una fase posterior, debe quedar confinado a revisión local y separado del avatar maestro.

Antes de considerar el visor listo para piloto, se requiere evidencia en iOS Safari, Android Chrome y al menos un dispositivo con pantalla grande. Deben medirse carga inicial, FPS percibido, consumo de memoria, estabilidad al girar el teléfono, recuperación de permisos y calidad de fallback 3D.

## Recomendación de fases

Primero construiría un prototipo de colocación con un modelo candidato optimizado y sin voz. Después validaría Identity Lock Test en cuerpo completo, busto y rostro. Solo tras aprobar esa evidencia incorporaría expresiones, audio y escenas más ricas. Rigging definitivo, lip-sync, integración con juegos y publicación deben permanecer fuera de esta propuesta hasta contar con aprobación humana específica.

## Conceptualización del device Lukita AR

Lukita AR se plantea como un companion visual de presentación espacial, no como un terminal de juego. Su lenguaje formal combina una superficie frontal de vidrio oscuro, un perímetro fino verde/turquesa neón, un puntero de estrella dorada asociado a Lukita Star Trail y controles mínimos de volumen y escena, sin copiar el diseño de un fabricante existente. La imagen conceptual de referencia se sirve desde `/manus-storage/lukita-ar-device-concept_43fd0153.png`.

La experiencia funcional prioriza cuatro acciones: iniciar la escena WebXR cuando el navegador lo permita, colocar un candidato GLB, ajustar su transformación mediante gestos multitáctiles y controlar volumen/estela. La captura PNG y la grabación corta se consideran herramientas de presentación local; el preset de luz se conserva en `localStorage` y no se publica como configuración autoritativa.

### Límite constitucional

El device y el visor no pueden leer ni modificar RNG, resultados, RTP, wallet, ledger, settlement, reglas, claims ni el MJP TV Manifest. Todos los GLB son candidatos de revisión hasta recibir aprobación humana externa al visor. La caja delimitadora, la iluminación, los presets y la grabación son estados de presentación y no alteran el motor del juego.

### Estado de esta iteración

Se incorporaron captura PNG, grabación WebM cuando el navegador expone `MediaRecorder`, caja delimitadora activable para la ubicación del candidato, presets locales de intensidad de luz y un apartado visual dedicado al device AR. La compatibilidad de WebXR, cámara, captura y háptica debe certificarse posteriormente en hardware físico Safari iOS, Android Chrome y dispositivos de TV compatibles.

> La imagen es una dirección conceptual original para evaluar forma y experiencia; no representa un hardware final ni copia el diseño de un fabricante existente.

### Evidencia de implementación

- Página: `client/src/pages/LukitaARStagePage.tsx`
- Ruta: `/lukita-ar-stage`
- Activo conceptual: `/manus-storage/lukita-ar-device-concept_43fd0153.png`
- Validaciones ejecutadas: `pnpm check`, `pnpm test`, `pnpm build`

La grabación generada en esta iteración usa WebM para respetar las capacidades nativas del navegador; una exportación MP4 requeriría una decisión posterior de procesamiento. La prueba de escaneo, la autorización de cámara y la medición de rendimiento 3D deben ejecutarse en dispositivos físicos antes de considerar el visor apto para una demostración productiva.

### Contrato presentation-only

Este módulo se limita a visualizar, manipular y capturar una escena 3D candidata. No contiene procedimientos tRPC, acceso de escritura a base de datos, ni rutas que otorguen autoridad sobre MJP CORE. Cualquier futura integración de eventos deberá ser un contrato de solo lectura, con payload versionado, origen verificable y rechazo explícito de campos de juego o monetarios.


## Anexo — Piloto Lukita Live de captura social

El piloto de captura se completa con una revisión previa obligatoria. Al detener una grabación, el archivo queda en memoria local y se abre un modal con reproducción, pausa, avance, descarte, descarga y compartir. El menú de compartir del dispositivo se usa cuando el navegador admite archivos; en caso contrario, el visor descarga el archivo y abre el flujo oficial de la red social seleccionada para que el usuario lo adjunte manualmente. No existe subida ni publicación automática.

Los destinos de demostración son X, WhatsApp, Instagram y TikTok. El formato preferido es MP4 cuando `MediaRecorder` lo soporta; el fallback WebM se anuncia claramente. El flujo permanece condicionado a permiso explícito de cámara y no realiza reconocimiento de identidad ni lectura de datos del juego.

La referencia visual de Lukita se puede activar u ocultar desde la escena mediante el control **Mostrar referencia Lukita**. Su estado se comunica como placeholder interactivo para composición, escala y presencia; no sustituye el modelo 3D maestro ni modifica la ficha de Character Foundation.

En Controller Lab, el selector de color neón se presenta como **Iluminación del control**. Los presets, el color personalizado y el modo aleatorio aplican el nuevo acento de forma progresiva mediante una transición breve de resplandor, escala y opacidad, con estado accesible del preset activo. Esta personalización es local al backstage y no modifica MJP CORE.


## Anexo — Preparación de captura e interacción del placeholder

El placeholder interactivo de Lukita admite ahora dos gestos táctiles dentro del visor: **arrastrar con un dedo** para desplazarlo en el plano de presentación y **pellizcar con dos dedos** para redimensionarlo suavemente dentro de límites seguros. El control **Restablecer Lukita** devuelve la posición y escala de referencia. Esta manipulación es puramente visual y no altera el candidato GLB ni el Character Foundation.

Controller Lab incorpora un ajuste de **Intensidad lumínica** para el color neón activo. El valor se conserva localmente en el dispositivo y modifica el brillo del borde y del resplandor de la maqueta en tiempo real. No se transmite a la TV como autoridad ni modifica configuraciones de juego.

Antes de crear un video se muestra una cuenta regresiva visual de tres segundos. Durante ese período no se inicia `MediaRecorder`, permitiendo que la persona se prepare; al finalizar comienza el flujo de captura ya existente y, al detenerlo, se abre la revisión obligatoria antes de compartir.


## Revisión del concepto Lukita AR Stage Pad

La propuesta actualizada conserva los colores del Controller Lab: grafito oscuro, perímetro fino verde/turquesa neón y estrella amarilla Lukita Star Trail. La variante sin fondo es un activo conceptual aislado para revisión de forma y composición; no representa una promesa de transparencia del visor ni una implementación funcional.

El control visual incluye acciones separadas para fotografía, video, compartir mediante acción explícita y cambio de cámara frontal/trasera. La orientación se resuelve automáticamente con la orientación física del celular: la interfaz rota y recoloca los controles, preservando la maqueta 16 × 8 cm y los objetivos táctiles. No se contempla un selector manual como requisito principal.

La imagen permanece como propuesta pendiente de aprobación humana. Las mejoras de Control Room, preview gate por gate de Distribution y reporte visual de agentes ya están implementadas y verificadas; no se duplican ni se integran con autoridad de MJP CORE.


## Anexo — Cuarto control como trackpad continuo

La nueva propuesta convierte toda la superficie activa del cuarto control Lukita AR Stage Pad en un **trackpad continuo**. El área central e inferior queda libre de botones fijos y admite arrastre con un dedo, pellizco para escalar, zoom, rotación de dos dedos, doble toque, puntos de contacto independientes, estela Lukita Star Trail, sensibilidad configurable y háptica contextual. La franja superior conserva únicamente acciones persistentes y compactas: AR, cámara frontal/trasera, foto, video, compartir explícito, privacidad y restablecer. Un rail lateral mínimo puede alojar volumen e intensidad lumínica sin invadir la superficie principal.

El borde permanece fino, perimétrico y verde/turquesa neón, coherente con los tres controles existentes. La orientación se calcula automáticamente desde la orientación física del celular; si el sensor no está disponible o el permiso es rechazado, el fallback usa el viewport y comunica la orientación detectada sin convertirlo en un selector manual obligatorio. La proporción maestra 16 × 8 cm se conserva en ambas presentaciones.

La propuesta visual es conceptual y queda pendiente de aprobación humana. La implementación futura deberá reutilizar los handlers multitáctiles ya probados en el visor AR, mantener la revisión previa antes de compartir y prohibir cualquier acceso a MJP CORE, datos de juego o monetización.


## Implementación aprobada — AR Stage Pad en Controller Lab

Tras la aprobación visual, Controller Lab incorpora un cuarto modo local llamado **AR Stage**. La superficie central funciona como trackpad continuo: arrastre con un dedo para desplazar la composición, pellizco con dos dedos para escalarla, puntos de contacto visibles y estado de interacción accesible. El borde conserva el perímetro fino verde/turquesa neón compartido con Game Pad, Track Pad y Teclado. La franja superior concentra AR, cámara, foto, video, compartir explícito y restablecimiento; el volumen se mantiene como control secundario.

La orientación se corrige automáticamente con el listener de viewport y `screen.orientation`, manteniendo la proporción maestra 16 × 8 cm. Cuando el modo local AR envía una orden compatible con la sesión, usa el canal presentation-only `TRACKPAD` existente; esta decisión evita alterar el enum persistido y no amplía permisos ni comandos. La manipulación, captura y compartir permanecen fuera de la autoridad del juego y sujetos a consentimiento.

Los botones de foto, video, cámara y compartir del cuarto control son controles de presentación: indican el estado o preparan la acción; la revisión previa y la publicación explícita siguen siendo obligatorias. No se concede acceso a RNG, resultados, RTP, reglas, wallet, ledger, settlement ni MJP CORE.


## Implementación — activación AR y captura social desde el cuarto control

El cuarto control integra un estado local de ubicación. Mientras la ubicación no está activa, la superficie muestra una guía de preparación y el placeholder de Lukita con la leyenda **guía de ubicación**; las acciones de foto, video y compartir informan que primero debe activarse la ubicación. Al activar la ubicación, el estado cambia a **Ubicación AR activa · Lukita lista** y el placeholder comunica **lista para cámara**. Esta activación es una confirmación de preparación de la escena, no una geolocalización ni una escritura en el sistema.

El botón **AR Stage** abre el visor completo en `/lukita-ar-stage`, que concentra la solicitud de cámara, el giro frontal/trasero, el gesto de colocación, cuenta regresiva, captura, revisión y compartir explícito. La revisión permanece obligatoria y no existe publicación automática. El transporte del cuarto modo sigue siendo `TRACKPAD` para conservar compatibilidad con el contrato persistido y evitar ampliar autoridad.


## Consola de escenas geolocalizadas y ayuda de Controller Lab

Control Room incorpora la consola **Mapa de escenas Lukita** para preparar lugares y presencias visuales. Permite elegir un punto en mapa, usar la ubicación del celular con permiso explícito y configurar el tipo de presencia —Lukita protagonista, Kiko compañero o compañero de TV— junto con altura, escala, orientación, iluminación, interacción y privacidad. Los datos se guardan como borrador local; `PUBLIC_REVIEW` solo expresa intención y siempre requiere revisión humana.

La guía táctil de Controller Lab explica los cuatro controles: Game Pad para navegación y escenas, Track Pad para gestos precisos, Mini Teclado para escribir y apuntar, y AR Stage para colocar a Lukita y crear capturas. Los tooltips del selector superior describen la función de cada modo y respetan los límites presentation-only.

El flujo recomendado es permiso explícito de ubicación → selección o confirmación del punto → preview de altura y escala → captura opcional → revisión → publicación solo mediante un servicio autorizado. Sin permiso o precisión suficiente, la escena permanece en `LOCATION_REQUIRED` o `LOCAL_DRAFT_ONLY`. Ninguna parte del panel escribe en MJP CORE, wallet, RNG, resultados o reglas.
