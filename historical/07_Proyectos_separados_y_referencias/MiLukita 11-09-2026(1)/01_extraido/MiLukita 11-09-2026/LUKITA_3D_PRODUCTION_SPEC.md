# Lukita — Hoja de especificaciones para producción 3D

**Proyecto:** MiLukita  
**Personaje:** Lukita  
**Versión de identidad:** `LUKITA-A+B+C-2D-APPROVED-01`  
**Estado:** Aprobación humana recibida; turnaround 2D congelado para preproducción 3D  
**Uso:** Documento de handoff para concept artist, modelador, groom artist, look-development, rigging y revisión técnica  
**Fuente principal:** `docs/LUKITA_MASTER_CHARACTER_GUIDE.md`  
**Regla de autoridad:** Lukita es una anfitriona visual no autoritativa; no decide resultados ni modifica el MJP CORE.

> **Decisión aprobada:** «Sí, esta es Lukita.» La síntesis A+B+C es la única dirección visual autorizada para iniciar preproducción. Ningún artista debe reinterpretar la identidad base sin registrar una solicitud de cambio.

## 1. Objetivo artístico

Crear un personaje 3D de una mujer adulta, elegante, profesional y cercana, diseñada para televisión digital, web, PWA, overlays y futuras piezas de video. La versión debe conservar la calidez escénica de **Lukita Show A**, el acabado contemporáneo de **Lukita Moderna B** y la legibilidad de silueta de **Lukita Ícono C**.

El resultado debe parecer una presentadora virtual latinoamericana contemporánea, no una mascota infantil, una modelo sexualizada, una superheroína, una figura de casino tradicional ni una celebridad reconocible. La identidad debe funcionar tanto en plano completo como en busto pequeño.

## 2. Anchors obligatorios de identidad

| Área | Especificación congelada | No cambiar sin control de versión |
|---|---|---|
| Edad visual | Adulta, aproximadamente 25–32 años | Sí |
| Piel | Trigueña cálida, natural, sin estereotipos | Sí |
| Rostro | Armónico, amable, memorable, con expresión inteligente | Sí |
| Ojos | Grandes y expresivos; marrón oscuro o avellana | Sí |
| Sonrisa | Profesional, cálida y reconocible | Sí |
| Cabello | Oscuro, largo, elegante y con volumen controlado | Sí |
| Silueta | Femenina adulta, proporcionada, estilizada y abierta | Sí |
| Paleta | Azul marino `#0A1628`, dorado `#FFD700`, blanco como acento | Sí |
| Accesorios | Micrófono moderno de presentadora e insignia «L» discreta | Sí |
| Personalidad | Cercana, segura, elegante, no dominante | Sí |

## 3. Proporciones y escala de trabajo

La primera versión debe modelarse con proporciones adultas naturales y estilizadas, evitando anatomía caricaturesca. Como referencia de producción, usar **8 cabezas de altura aproximada** para el cuerpo completo; esta cifra es una guía de bloqueo y puede ajustarse durante el sculpt si se conserva la lectura adulta y la silueta aprobada. No se deben exagerar busto, cintura, caderas, ojos o labios.

La escena maestra debe usar unidades métricas consistentes. Establecer la altura del personaje como **1,70 m de referencia provisional**, con pies apoyados en el eje vertical y origen del rig en el centro entre ambos pies. Esta medida es una escala de producción, no una afirmación biográfica. Todas las cámaras, luces, simulaciones de tela y exportaciones deberán conservar la misma unidad.

| Elemento de escala | Valor de trabajo |
|---|---:|
| Altura total de personaje | 1,70 m provisional |
| Altura de ojos | Aproximadamente 1,58–1,61 m; validar con el sculpt |
| Altura del micrófono en pose oficial | Entre cintura alta y pecho, según gesto |
| Margen de seguridad de cabello | Sin interpenetración visible con hombros o vestuario |
| Escala de insignia «L» | Pequeña; nunca competir con el rostro o el logotipo MiLukita |

## 4. Modelado del cuerpo y rostro

El bloqueo inicial debe validar la silueta en frontal, tres cuartos, lateral y posterior antes de detallar. El cuerpo debe tener hombros naturales, manos proporcionadas, cuello adulto y postura abierta de presentadora. Las manos deben ser suficientemente limpias para sostener el micrófono, señalar una pantalla y realizar un saludo.

El rostro requiere topología preparada para expresiones de bienvenida, explicación, concentración, celebración controlada, contingencia serena y escucha. La sonrisa debe ser reconocible pero no permanente. El modelado facial debe evitar rasgos genéricos intercambiables; el equipo debe comparar constantemente con el turnaround 2D congelado.

No usar morphs, texturas o referencias que produzcan semejanza intencional con una persona real, actriz, influencer, presentadora o personaje existente.

## 5. Cabello y groom

El cabello será oscuro, largo y elegante, con volumen controlado. Debe conservar una masa gráfica reconocible en silueta y permitir variación limitada de movimiento. La línea frontal, el largo general y el volumen lateral son anchors; los mechones secundarios pueden ajustarse para producción.

El groom deberá incluir una versión optimizada para tiempo real y otra de mayor calidad para renders promocionales. Evitar simulación excesivamente compleja que tape el rostro, interfiera con el micrófono o provoque interpenetración con hombros y cuello.

## 6. Vestuario y materiales

El vestuario toma como base el vestido largo escénico de A, con líneas limpias de B y lectura gráfica de C. Debe ser elegante, moderno, televisivo y animable. No debe parecer armadura, uniforme rígido, traje de casino o vestuario sexualizado.

| Material | Color base | Tratamiento |
|---|---|---|
| Tela principal | Azul marino `#0A1628` | Mate o semimate, tejido fino, sin brillo plástico |
| Acentos premium | Dorado `#FFD700` | Ribetes y detalles controlados; evitar exceso metálico |
| Contraste | Blanco `#FFFFFF` | Pequeñas zonas para separación visual y legibilidad |
| Piel | Trigueña cálida | Subsurface moderado, natural, sin tono artificial |
| Cabello | Castaño muy oscuro/negro suave | Variación sutil, sin bloque plano |
| Micrófono | Negro grafito con detalles dorados | Profesional, compacto y reconocible |
| Insignia «L» | Dorado | Pequeña, limpia y secundaria |

El vestuario debe tener retopología y UVs separadas por piezas funcionales: cuerpo principal, ribetes, detalles dorados, calzado, micrófono e insignia. Preparar una variante sin micrófono para escenas de tutorial si el equipo de dirección la solicita, pero conservar el micrófono en la pose oficial.

## 7. Accesorios

El micrófono moderno es un elemento narrativo: comunica que Lukita es anfitriona. Debe poder sostenerse correctamente, tener pivote y controles independientes, y no bloquear la boca ni los datos de pantalla. La insignia «L» debe ser un broche o detalle del vestuario, de tamaño discreto, sin sustituir el logotipo MiLukita.

No añadir corona, fichas, dinero, armas, alas, símbolos religiosos, elementos partidistas ni objetos que sugieran autoridad sobre los resultados.

## 8. Rigging y deformación — requisitos de preproducción

El modelo debe prepararse para rig corporal y facial, aunque el rig final se mantenga como fase posterior. El cuerpo requiere controles de columna, cuello, cabeza, hombros, brazos, manos, dedos, cadera, piernas y pies. Las manos necesitan al menos poses de agarre de micrófono, saludo, señalamiento y reposo.

El rostro debe admitir controles de ojos, párpados, cejas, mejillas, labios, mandíbula y sonrisa. Preparar shapes o controles equivalentes para neutral, sonrisa, bienvenida, explicación, concentración, celebración, preocupación y contingencia. Las expresiones deben conservar el mismo rostro; no se permiten deformaciones que cambien la identidad.

## 9. Poses y encuadres de validación

La pose oficial es de cuerpo completo, mirada a cámara, sonrisa moderada, torso abierto, una mano presentando o saludando y la otra sosteniendo el micrófono. Las pruebas mínimas son frontal, tres cuartos, lateral, posterior, busto, plano medio y avatar reducido.

Cada prueba debe verificar que el personaje no cubra resultados, códigos QR, cuenta regresiva, estados del evento ni mensajes de verificación. La prioridad visual de producto sigue siendo: resultado, estado, countdown, juego, QR/verificación, información secundaria y Lukita.

## 10. Requisitos técnicos de entrega

| Entregable | Requisito |
|---|---|
| Archivo maestro | Escena nativa del software 3D, con unidades métricas y referencias enlazadas |
| Malla | Cuerpo, cabeza, cabello, vestuario y accesorios organizados y nombrados |
| Topología | Deformación limpia en rostro, hombros, codos, manos, cadera y rodillas |
| UV | Islas organizadas por material; sin solapes no autorizados |
| Texturas | Albedo/base color, roughness, normal y máscara de materiales cuando corresponda |
| Rig | Entrega preparada para rigging; controles finales en fase posterior |
| Exportación | GLB/GLTF para web cuando se autorice; formato nativo para continuidad de producción |
| Optimización | Variante real-time y variante high-quality, sin perder identidad |
| Cámaras | Frontal, 3/4, lateral, posterior, busto y avatar pequeño |
| Documentación | Capturas de prueba, lista de materiales, escala, versión y cambios |

## 11. Criterios de aceptación artística

La entrega pasa revisión cuando el rostro, cabello, silueta, proporciones, paleta, vestuario, micrófono e insignia se reconocen como Lukita en todas las vistas. Debe verse claramente adulta y profesional, sin sexualización ni infantilización. El modelo debe ser legible en televisión y en una miniatura de interfaz.

La entrega se rechaza si introduce cambios no autorizados en el rostro, edad aparente, tono de piel, cabello, silueta, colores, micrófono o insignia; si parece otro personaje; si depende de una celebridad; si cubre datos autoritativos; o si presenta a Lukita como quien decide, valida o calcula resultados.

## 12. Control de autoridad y contenido

La producción 3D solo crea una representación audiovisual. El personaje no será una fuente de resultados. La integración autorizada mantiene el flujo:

`MJP CORE → MjpTvManifest → componente audiovisual → Lukita`

Lukita no puede generar números, seleccionar ganadores, modificar reglas, RTP, RNG, premios, wallet, rondas, tickets, manifest ni auditoría. Las reacciones de celebración o contingencia solo se disparan desde estados autorizados y mensajes versionados.

## 13. Registro de versiones

| Versión | Estado | Descripción |
|---|---|---|
| `LUKITA-A+B+C-2D-APPROVED-01` | Congelada | Turnaround 2D aprobado por el propietario |
| `LUKITA-3D-BLOCKOUT-01` | Próxima | Bloqueo volumétrico y validación de silueta |
| `LUKITA-3D-SCULPT-01` | Futura | Sculpt de rostro, cuerpo y accesorios |
| `LUKITA-3D-LOOKDEV-01` | Futura | Materiales, cabello e iluminación |
| `LUKITA-3D-RIG-01` | Futura | Rig corporal y facial |

Cualquier modificación de un anchor requiere una nueva revisión humana y un nuevo identificador de versión. El equipo no debe sobrescribir el turnaround aprobado.

## 14. Checklist de inicio

Antes de iniciar el blockout, el director de arte debe confirmar que el equipo recibió el turnaround 2D aprobado, la Ficha Maestra y este documento. El modelador debe confirmar la escala, unidades, nomenclatura, referencias y ausencia de semejanza intencional con terceros. El director técnico debe definir el software, versión, formato de exportación, destino de tiempo real y presupuesto de polígonos antes de producir el rig final.

La fase autorizada ahora es **preproducción 3D y blockout controlado**. La producción de voz, TTS, lip-sync definitivo y publicación audiovisual sigue requiriendo decisiones y validaciones separadas.


## 15. Orden 36 — blockout 3D controlado y visor web

La Orden 36 autoriza el **blockout 3D controlado** usando exclusivamente `LUKITA-A+B+C-2D-APPROVED-01` y esta especificación. La prioridad de revisión es rostro, silueta, proporciones, cabello, vestuario, micrófono, insignia «L» y expresiones básicas. El blockout no se evalúa por belleza ni detalle final; se evalúa por continuidad de identidad.

Se habilitó el estudio web en `/lukita-3d`. El visor utiliza un blockout procedimental de previsualización para verificar frontal, tres cuartos, lateral, poses, expresiones y modo silueta. También permite cargar modelos locales `.glb` o `.gltf` mediante Object URLs del navegador y compararlos lado a lado con la referencia procedimental. En esta fase los archivos no se suben ni se persisten en el servidor.

Las pruebas obligatorias del gate son: frontal contra el turnaround, tres cuartos para rostro, lateral para nariz/mandíbula/cabello, cuerpo completo para silueta, silueta sin materiales y rostro sin cabello. El criterio de identidad es **«¿Sigue siendo claramente Lukita?»**. Si aparece una discrepancia importante, el flujo es **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**.

El visor y sus datos de prueba no tienen autoridad sobre rondas, resultados, premios, RNG, RTP, rulesets, créditos o auditoría. Continúan bloqueados el rigging definitivo, facial rig definitivo, animación definitiva, lip-sync, voz, TTS, publicación audiovisual e integración oficial en `/tv`.


## 16. Confirmación final de alcance del visor — Preview / Review

Por decisión del propietario, `/lukita-3d` es una ruta web independiente destinada exclusivamente a **Preview / Review**. No se enlaza desde Home ni se integra con `/tv`, PWA, Overlay, MjpTvManifest ni la experiencia pública. Su función es permitir que artistas y revisores giren el blockout, hagan zoom, prueben expresiones y poses, revisen frontal/3/4/lateral/posterior y comparen una versión local con la referencia procedimental.

El visor no modifica el modelo maestro, no persiste ni publica archivos de producción y no tiene autoridad sobre MJP CORE. La comparación con el turnaround aprobado es una ayuda visual de control; no sustituye la revisión humana ni la aprobación del equipo de arte.

La autorización vigente cubre únicamente preproducción y blockout 3D controlado. Siguen bloqueados el rigging definitivo, facial rig definitivo, animación final, voz, TTS, lip-sync, publicación audiovisual e integración oficial. Ante cualquier contradicción entre el diseño 2D aprobado y la especificación, se debe detener el flujo y solicitar una decisión humana.


## 17. Herramientas adicionales de validación visual

El visor Preview / Review incorpora una superposición del turnaround 2D aprobado sobre el canvas 3D, con activación independiente y opacidad regulable. Esta superposición sirve para comparar silueta, proporciones y encuadre; no reemplaza la revisión ortográfica del artista ni altera el asset maestro.

El modo de anotación permite marcar coordenadas visibles del canvas y asociarlas con una categoría —silueta, rostro, cabello, vestuario, proporción o accesorio— y una nota breve. Las anotaciones son locales a la sesión del navegador, no se persisten en MJP CORE y no representan aprobación ni cambio de diseño.

Los controles de iluminación exponen intensidad y azimut de una luz direccional para estudiar volúmenes del blockout bajo distintos ángulos. Son controles de inspección y no constituyen una decisión de look development, materiales finales ni iluminación de producción.


## 18. Herramientas de revisión y exportación

El panel lateral de `/lukita-3d` concentra el cambio rápido de poses y expresiones, la visibilidad del turnaround y la inspección de iluminación. El control **Vista wireframe** alterna el material del blockout entre sólido y malla para revisar de forma preliminar la distribución geométrica. Esta vista no equivale a una auditoría de topología final ni aprueba edge flow, UVs o deformaciones.

Las anotaciones de la sesión pueden exportarse en JSON para intercambio estructurado y en un PDF liviano para revisión humana. Ambos archivos incluyen la referencia aprobada, pose, expresión, coordenadas relativas, categoría y nota. Las anotaciones siguen siendo locales: exportarlas no modifica el modelo maestro, no crea una versión productiva y no escribe en MJP CORE.


## 19. Reanudación de sesiones y captura de revisión

El visor admite importar archivos JSON previamente exportados con el esquema `milukita-review-annotations.v1`. La importación valida el esquema, limita el número de anotaciones, restringe categorías reconocidas, acota coordenadas al canvas y recorta notas extensas. Un archivo inválido no reemplaza la sesión activa.

Se añadieron cámaras predefinidas **Frontal**, **Lateral** y **Superior**, además de **Reset** para regresar al encuadre inicial. El botón **Capturar PNG con anotaciones** genera una imagen local del canvas actual con los marcadores visibles. Estas funciones sirven para revisión de preproducción y no crean una versión productiva ni modifican el modelo maestro.


## 20. Contraste, medición y filtrado

El visor incluye un interruptor específico de tema oscuro/claro para evaluar la iluminación y los volúmenes sobre fondos de contraste distinto. La herramienta de medición permite marcar dos puntos relativos en el canvas y obtener una distancia orientativa usando la escala provisional de 1,70 m; el valor es una referencia de revisión y no sustituye mediciones del archivo 3D, la escala de escena ni una validación técnica de producción.

El panel lateral permite filtrar las anotaciones por categoría o visualizar todas. El filtro afecta la revisión visual y no elimina anotaciones almacenadas en la sesión local. Estas funciones continúan siendo herramientas Preview / Review.


## 21. Exportación e inspección avanzada

La vista actual puede exportarse localmente en JPG, conservando el canvas y los marcadores de anotación visibles. Los perfiles de iluminación se pueden nombrar, guardar en `localStorage` y cargar en otra sesión del mismo navegador; contienen únicamente intensidad y azimut. El historial de versiones muestra las iteraciones cargadas en la sesión y permite seleccionarlas rápidamente para comparación lado a lado.

El **clipping plane** permite activar un corte horizontal y variar su altura para observar el interior de la malla. Es una herramienta visual de preproducción: no reescribe geometría, no exporta una malla modificada y no reemplaza una revisión de topología, normales, UV o deformación.


## 22. Candidato multivista y control técnico

El botón **Generar versión candidata** crea una iteración local de revisión vinculada a la identidad A+B+C, con fecha y selección rápida en el historial. La revisión se realiza con las vistas frontal, 3/4, lateral, posterior, cuerpo completo, silueta y las expresiones principales disponibles en el panel. La etiqueta candidata no constituye aprobación de producción ni modifica el modelo maestro.

Se añadieron presets rápidos de iluminación para **Luz de estudio**, **Exterior día** y **Contraluz**. Cada versión puede recibir comentarios de revisión locales, destinados a registrar discrepancias antes de avanzar a la siguiente iteración. El panel de estadísticas muestra el conteo de vértices y polígonos de la geometría actualmente cargada; estas cifras son informativas y no certifican topología, optimización, UV, rigging o calidad final.


## 23. Orden 39 — Identity Lock Test y ficha multivista

El candidato 3D se revisa mediante cinco estados de identidad: **A normal** con materiales y colores, **B silueta** completamente negra, **C avatar** a escala reducida, **D solo rostro** y **E frontal/3/4/lateral**. El criterio humano de cierre es: «¿Sigue siendo inequívocamente la misma Lukita?». La ficha Candidate 01 mantiene visible `LUKITA-A+B+C-2D-APPROVED-01`, diferencia referencia 2D de candidato 3D y permite marcar rostro, cabello, silueta/proporciones, vestuario, expresiones y reconocimiento reducido.

La ficha multivista puede exportarse como imagen de alta resolución para compartir con artistas. La sesión de comentarios puede exportarse e importarse en JSON con versión, fecha, elemento afectado, comentario y estado. Las métricas avanzadas de normales, UV y materiales se muestran como pendientes hasta cargar un GLB real; no se generan datos ficticios.

Ante una discrepancia importante se mantiene el flujo **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**. Esta orden no eleva automáticamente el candidato a producción y no modifica MJP CORE, MjpTvManifest, juegos, RNG, RTP, créditos ni liquidación.


## 24. Evidencia comparativa y progreso de revisión

La interfaz permite cargar localmente una ficha JPG exportada y verla lado a lado con `LUKITA-A+B+C-2D-APPROVED-01`. La referencia 2D conserva su carácter maestro; la imagen cargada es evidencia de candidato y no la reemplaza.

El Identity Lock Test muestra una barra de progreso basada en los seis criterios de reconocimiento: rostro, cabello, silueta/proporciones, vestuario, expresiones y reconocimiento reducido. El indicador organiza el trabajo, pero no convierte el porcentaje en aprobación automática.

Los comentarios por versión pueden filtrarse por **pendiente** o **resuelto** y ordenarse por fecha ascendente o descendente. La sesión JSON mantiene versionId, date, element, comment y status para facilitar el intercambio con artistas.


## 25. Orden 40 — cierre de herramientas del Identity Lock

Los comentarios de revisión pueden cambiar desde la interfaz entre **pendiente** y **resuelto**. Cada cambio conserva fecha, estado anterior y estado nuevo en el historial local de la sesión JSON. Las diferencias anotadas permanecen asociadas a la revisión visual y pueden referirse a rostro, cabello, silueta, proporciones, vestuario, expresiones y accesorios.

La ficha multivista mantiene la exportación de alta resolución. Ningún control del visor aplica correcciones al modelo maestro: cualquier discrepancia debe seguir **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**. El Candidate 01 no se declara aprobado automáticamente y continúan bloqueados el modelado detallado, rigging, facial rig, animación, voz, TTS, lip-sync, integración en `/tv` y publicación pública.


## Observaciones humanas registradas y zoom sincronizado

Se registran dos observaciones pendientes sobre `LUKITA-3D-CANDIDATE-01`: revisar las proporciones del rostro y revisar las proporciones y el volumen del cabello frente a `LUKITA-A+B+C-2D-APPROVED-01`. Estas observaciones no ejecutan cambios automáticos y deben tratarse mediante **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**.

El visor independiente incorpora un control de zoom sincronizado 2D/3D. El mismo factor ajusta la distancia de cámara del blockout y la escala visual de la referencia 2D superpuesta, para facilitar la inspección comparativa. Es una ayuda de revisión y no una medición certificada ni una modificación del modelo.


## 26. Orden — aprobación técnica del blockout

El propietario autoriza `LUKITA-3D-CANDIDATE-01` exclusivamente como **blockout técnico de preproducción**, bajo el identificador documental `LUKITA-3D-BLOCKOUT-TECH-APPROVED-01`. Esta autorización permite continuar, de forma controlada, con el refinamiento de proporciones, modelado facial, cabello, vestuario, accesorios, topología y preparación técnica.

Esta aprobación no es aprobación estética definitiva y no convierte el candidato en una versión `FINAL`, `PRODUCTION`, `PUBLIC` u `OFFICIAL`. La identidad estética permanece abierta a modificaciones controladas. `LUKITA-A+B+C-2D-APPROVED-01` continúa siendo la referencia maestra.

Toda modificación que afecte rostro, silueta, proporciones o elementos distintivos debe documentarse y volver a validarse mediante el Identity Lock Test, siguiendo **DETENER → DOCUMENTAR → CORREGIR → VOLVER A VALIDAR**.

Continúan bloqueadas la integración en `/tv`, Home, PWA, Overlay, publicación pública, voz, TTS, lip-sync definitivo y animación final. El visor sigue siendo una herramienta independiente de Preview / Review y no tiene autoridad sobre MJP CORE, MjpTvManifest, juegos, RNG, RTP, créditos, rondas o liquidación.


## 27. Orden 41 — Refinamiento visual controlado

`LUKITA-3D-CANDIDATE-01` incorpora una primera pasada de refinamiento visual procedimental, manteniendo el estado de candidata para revisión humana. La actualización prioriza la lectura de anfitriona adulta mediante un rostro más definido, cejas y nariz simplificadas, marco facial de cabello, mechones laterales, volumen posterior, hombros, cinturón dorado, detalles de calzado, manos visibles, micrófono e insignia L.

La proporción atlética y natural continúa siendo una guía de blockout; los volúmenes no constituyen un modelo final de producción. La paleta utiliza azul profundo, dorado, piel cálida, blanco y elementos oscuros, sin usar assets, rostros, cuerpos, cabello o vestuario de personajes de terceros.

Esta versión se presenta para una nueva revisión humana mediante Identity Lock Test. Si el refinamiento contradice la Ficha Maestra o la referencia `LUKITA-A+B+C-2D-APPROVED-01`, debe detenerse, documentarse, corregirse y volver a validarse. Continúan bloqueados rigging definitivo, facial rig definitivo, animación, voz, TTS, lip-sync, publicación e integración en `/tv`, Home, PWA u Overlay.


## 20. Resiliencia del visor y mock de respaldo

El visor independiente `/lukita-3d` dispone de un **mock procedural local** para revisar la interfaz sin depender de una API externa. El mock es una herramienta de Preview / Review; no es el modelo maestro, no se publica y no habilita ninguna integración operativa.

La interfaz muestra el estado de la fuente: cargando, modelo local cargado, mock local listo o fuente no disponible con respaldo activado. Ante una falla de carga —incluido un límite temporal de peticiones— conserva la sesión local, activa el blockout procedural y realiza como máximo un reintento automático con espera progresiva. El reintento manual queda disponible para el revisor.

El fallback no oculta la incidencia: la interfaz informa que el modelo externo no fue cargado y diferencia visualmente el mock del modelo GLB/GLTF. Ningún estado del visor modifica MJP CORE, MjpTvManifest, RNG, RTP, reglas, rondas, tickets, wallet o liquidación.
