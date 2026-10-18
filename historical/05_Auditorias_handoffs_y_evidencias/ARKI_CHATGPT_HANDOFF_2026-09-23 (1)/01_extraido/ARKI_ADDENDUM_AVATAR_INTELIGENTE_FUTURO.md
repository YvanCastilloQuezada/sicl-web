# ARKI — Addendum futuro: Avatar inteligente multimodal

**Estado:** Idea estratégica registrada; no implementado.  
**Alcance:** Futuro contrato de producto y plataforma ARKI.  
**Prioridad:** Alta, después de cerrar la base BIM, seguridad, permisos y contratos de dominio.

## 1. Visión del Avatar ARKI

El Avatar ARKI será la interfaz inteligente y contextual de la plataforma: un asistente capaz de comprender el proyecto BIM, observar información visual y documental, explicar decisiones, detectar riesgos, guiar al usuario y colaborar con especialistas durante todo el ciclo de vida del activo.

No será un chatbot decorativo. Debe operar como una capa de inteligencia sobre el modelo, el expediente, los costos, la coordinación, la construcción y el mantenimiento, siempre respetando permisos, trazabilidad y revisión profesional.

## 2. Capacidades previstas

| Capacidad | Descripción futura |
|---|---|
| Asistencia BIM contextual | Responder sobre elementos, espacios, familias, materiales, metrados, costos, relaciones, fases y estados del modelo seleccionado. |
| Visión inteligente | Interpretar planos, fotografías de obra, capturas de pantalla, detalles constructivos, documentos, tablas y evidencias de inspección. |
| Realidad aumentada | Superponer modelo, ejes, niveles, elementos, instalaciones, avances, advertencias y rutas de mantenimiento sobre el entorno físico. |
| Voz multimodal | Escuchar instrucciones, responder por voz y ejecutar comandos autorizados con confirmación cuando sean sensibles. |
| Lenguaje natural | Permitir consultas como “muéstrame los muros portantes del nivel 2”, “qué cambió desde la versión anterior” o “qué partidas afectan este cambio”. |
| Generación asistida | Proponer familias, espacios, alternativas, especificaciones, secuencias, reportes y documentación, sin sustituir la aprobación profesional. |
| Coordinación interdisciplinaria | Explicar clashes, responsables, severidad, impacto, alternativas de resolución y estado de cada incidencia. |
| Control de costos | Relacionar decisiones geométricas con metrados, APU, PriceBook, presupuesto, adicionales y sensibilidad económica. |
| Seguimiento de obra | Comparar modelo planificado con evidencia de campo, avance, calidad, seguridad, encofrados y cronograma 4D. |
| Operación y mantenimiento | Consultar activos, garantías, manuales, inspecciones, órdenes de trabajo, repuestos y mantenimiento preventivo. |
| Memoria de proyecto | Mantener una bitácora trazable de decisiones, fuentes, revisiones, aprobaciones y cambios de cada versión. |
| Educación y onboarding | Guiar a usuarios nuevos por el workspace, explicar módulos y adaptar la ayuda a cada perfil. |

## 3. Modos de interacción

El Avatar deberá funcionar mediante texto, voz, imagen, cámara, selección directa del modelo, gestos compatibles, realidad aumentada y comandos de teclado. La respuesta debe adaptarse al contexto: elemento seleccionado, disciplina activa, nivel, fase, vista, rol, versión y estado de aprobación.

El usuario podrá activar un modo breve para consultas rápidas, un modo técnico para explicaciones con fuentes y un modo de coordinación para revisar incidencias y tareas. La interfaz debe indicar siempre cuándo el Avatar está escuchando, observando, procesando, proponiendo o ejecutando.

## 4. Inteligencia visual y AR

La visión inteligente podrá reconocer, con el nivel de confianza visible, elementos BIM, símbolos, materiales, patologías aparentes, avances, desviaciones, riesgos de seguridad, interferencias físicas y evidencias documentales. Ningún reconocimiento visual podrá convertirse automáticamente en una aprobación técnica o legal.

La realidad aumentada deberá permitir calibración espacial, anclaje del modelo, selección de disciplina, control de transparencia, comparación planificado-versus-ejecutado, medición, captura de evidencia y registro de observaciones. La salida debe guardar fecha, ubicación, usuario, dispositivo, versión del modelo y nivel de confianza.

## 5. Reglas de seguridad y responsabilidad

El Avatar no podrá inventar datos, normas, costos, dimensiones, aprobaciones o resultados de cálculo. Cada respuesta técnica deberá distinguir entre dato del modelo, inferencia, recomendación, fuente externa y decisión pendiente.

Las acciones de alto impacto —modificar geometría aprobada, alterar presupuesto, emitir expediente, cambiar permisos, aprobar una incidencia, publicar una versión o crear una orden de trabajo— exigirán confirmación y, cuando corresponda, revisión del especialista responsable.

El Avatar deberá respetar el perfil de acceso, no revelar información de otros proyectos y registrar auditoría de consultas, fuentes, propuestas, acciones y confirmaciones. La inteligencia artificial será asistiva; la responsabilidad profesional permanecerá en el usuario autorizado.

## 6. Arquitectura futura

La implementación deberá separar:

1. **Avatar UI:** presencia visual, conversación, voz, estados y accesibilidad.
2. **Context Broker BIM:** contexto del proyecto, elemento seleccionado, versión, disciplina y permisos.
3. **Vision Gateway:** imágenes, cámara, planos, OCR, detección y comparación visual.
4. **AR Runtime:** anclaje espacial, overlays, medición y evidencias.
5. **Reasoning Orchestrator:** planificación de consultas, herramientas y fuentes.
6. **Tool Permissions:** acciones permitidas por rol y nivel de confirmación.
7. **Knowledge and Provenance:** normas, contratos, biblioteca corporativa, decisiones y fuentes.
8. **Audit and Safety Layer:** trazabilidad, validación, rechazo seguro y revisión humana.

## 7. Estados de producto

El Avatar se clasificará inicialmente como **FUTURE REFERENCE**. La primera entrega futura deberá demostrar únicamente conversación contextual de solo lectura sobre un modelo real. Las capacidades de visión, voz, generación, AR, acciones BIM, obra y mantenimiento se promoverán por entregas verificables independientes.

No se declarará “Avatar inteligente completo” por la existencia de un personaje, una ventana de chat o una respuesta generada. Cada capacidad requerirá contrato, integración, prueba, evidencia y límites declarados.

## 8. Roadmap propuesto

**Avatar 0 — Presencia:** identidad visual, ayuda contextual y estados del sistema.  
**Avatar 1 — BIM contextual:** consultas de solo lectura sobre elementos, espacios, costos y expediente.  
**Avatar 2 — Multimodal:** voz, imágenes, planos, documentos y visión inteligente.  
**Avatar 3 — Copiloto profesional:** propuestas, coordinación, análisis de cambios y reportes con revisión humana.  
**Avatar 4 — Realidad aumentada:** inspección, avance, comparación y mantenimiento en campo.  
**Avatar 5 — Ciclo de vida:** operación, activos, mantenimiento, aprendizaje de incidencias y asistencia continua.

## 9. Criterio contractual

El futuro contrato debe exigir que DeepSeek diseñe la experiencia, estados, wireflows, permisos, fuentes, fallos y criterios de aceptación del Avatar. Manus deberá integrar únicamente capacidades respaldadas por código, pruebas reproducibles y evidencia. El Product Owner decidirá los límites de autonomía, privacidad, dispositivos, proveedores de inteligencia y escenarios de uso profesional.


## 10. Presencia transversal durante el uso y el ciclo de vida

El Avatar ARKI no pertenecerá a una sola página, disciplina o fase. Será una **capa transversal del producto**, disponible durante todo el uso de ARKI y acompañando continuamente el ciclo de vida completo del activo.

Su presencia abarcará la concepción, definición del programa, generación de familias, diseño arquitectónico, cálculo y coordinación estructural, instalaciones, costos, metrados, presupuesto, expediente técnico, licitación, planificación 4D, construcción, control de calidad, seguridad, recepción, puesta en operación, mantenimiento, remodelación, ampliación, rehabilitación y cierre del activo.

En cada fase deberá conservar el contexto autorizado del proyecto, sus decisiones, versiones, incidencias, documentos, responsables y evidencias. El usuario podrá invocarlo desde el gateway, el shell BIM, el canvas 2D/3D, el modelo semántico, el expediente, los costos, el cronograma, la coordinación, la obra y el módulo de activos y mantenimiento.

El Avatar debe comportarse como un **copiloto continuo del ciclo de vida**, no como una ayuda aislada. Podrá cambiar de modo según la fase: orientador en la concepción, asistente de diseño, coordinador BIM, analista de costos, supervisor de planificación, asistente de obra, inspector de evidencias y copiloto de operación y mantenimiento. En todos los modos mantendrá trazabilidad, permisos, fuentes, límites de confianza y revisión humana.

La disponibilidad permanente no implica autonomía ilimitada. Cada acción deberá respetar el rol del usuario y el estado del proyecto. Las recomendaciones podrán acompañar todo el proceso, pero las modificaciones aprobadas, emisiones documentales, decisiones contractuales, cambios de presupuesto, aprobaciones técnicas y órdenes de trabajo requerirán autorización conforme al flujo corporativo.


## 11. Comportamiento visual en tres tamaños

El Avatar ARKI deberá estar disponible durante todo el uso de la plataforma mediante un control flotante persistente, sin ocultar el canvas ni bloquear las herramientas BIM.

| Estado | Activación | Función |
|---|---|---|
| Botón circular | Estado inicial y minimizado | Muestra la identidad del Avatar, estado de disponibilidad y acceso rápido a ayuda. Debe ocupar el mínimo espacio posible. |
| Panel mediano | Primer toque sobre el botón | Abre conversación breve, sugerencias contextuales, pasos siguientes, alertas y acciones rápidas del módulo activo. |
| Panel semigrande | Segundo toque sobre el panel | Abre el copiloto ampliado con conversación, visión, OCR, documentos, resultados, fuentes, herramientas BIM y guía paso a paso. |
| Minimizado | Tercer toque o comando de minimizar | Regresa al botón circular sin perder contexto ni conversación. |

La transición entre estados debe ser reversible, accesible por teclado y compatible con pantallas pequeñas. El Avatar debe recordar el estado preferido por usuario y proyecto, salvo que el usuario lo restablezca.

## 12. Guía permanente para usuarios nuevos

Al tratarse de un software nuevo, el Avatar acompañará al usuario durante todo el proceso de aprendizaje y producción. Debe enseñar qué hacer, dirigir al usuario hacia el siguiente paso y asesorarlo para obtener mejores resultados, sin ejecutar acciones críticas sin autorización.

La guía deberá ser contextual y progresiva: bienvenida al gateway, explicación del perfil, recorrido del workspace, ayuda del módulo activo, explicación de campos, advertencia de errores, sugerencia de buenas prácticas, resumen de decisiones y orientación hacia la siguiente fase. No debe repetir tutoriales ya completados ni interrumpir tareas avanzadas salvo que exista un riesgo relevante.

El usuario podrá solicitar “enséñame”, “guíame”, “revísalo”, “explícame esta decisión” o “qué sigue”. El Avatar deberá responder con pasos concretos, lenguaje adecuado al perfil y referencias al elemento o vista activa.

## 13. Capacidades obligatorias del Avatar

El futuro diseño deberá aprovechar las capacidades completas previstas para ARKI: inteligencia contextual BIM, visión inteligente, OCR, lectura de planos y documentos, reconocimiento de evidencias de obra, realidad aumentada, voz, texto, análisis de imágenes, comparación modelo-versus-realidad, coordinación de interferencias, costos, metrados, cronograma, expediente, operación y mantenimiento.

Estas capacidades deben estar conectadas a los permisos, fuentes, niveles de confianza, auditoría y revisión profesional del proyecto. El Avatar no se considerará completo por tener únicamente una ventana de chat o una ilustración.

## 14. Consulta obligatoria de diseño visual para DeepSeek

Antes de implementar el Avatar, DeepSeek deberá recomendar una paleta visual profesional para su presencia en ARKI. La recomendación deberá comparar la paleta actual azul oscuro `#080736` con alternativas apropiadas para una herramienta BIM profesional, considerando contraste, accesibilidad, fatiga visual, jerarquía, estados de alerta, visibilidad en campo y compatibilidad con realidad aumentada.

DeepSeek deberá entregar como mínimo tres propuestas de paleta, con colores para fondo, superficie, texto, acento primario, selección, éxito, advertencia, error, información y modo AR. Deberá justificar una recomendación final y explicar si conviene conservar `#080736`, modificarlo o reemplazarlo. El Product Owner decidirá la paleta antes del diseño final del Avatar.


## 15. Avatar 3D generable y animado

La referencia visual entregada por el Product Owner define la dirección del Avatar ARKI: un asistente robótico profesional, amigable y reconocible, con lenguaje visual de ingeniería y construcción. La imagen es una referencia de intención artística y no limita la evolución posterior del diseño.

El sistema deberá poder generar y exportar el Avatar como archivo **GLB/glTF 2.0**, con materiales PBR, texturas, jerarquía de nodos, rig esquelético, animaciones y metadatos. Cuando el flujo lo requiera, también podrá entregar formatos intermedios compatibles con el pipeline 3D, pero GLB será el formato principal para web, BIM visual, realidad aumentada y distribución multiplataforma.

### Requisitos mínimos del activo 3D

| Área | Requisito |
|---|---|
| Modelo | Geometría limpia, escala realista, pivotes correctos, nomenclatura estable y variantes de nivel de detalle. |
| Rig | Esqueleto para cabeza, visor, cuello, brazos, antebrazos, manos, dedos y elementos móviles del casco o visor. |
| Materiales | Materiales PBR separados para carcasa, visor, metal, goma, iluminación, acentos corporativos y modo AR. |
| Animaciones | Idle, saludo, escucha, pensamiento, explicación, confirmación, advertencia, error, celebración, espera, lectura OCR y minimización. |
| Gestos | Señalar, abrir las manos, levantar pulgar, negar, asentir, indicar una zona del modelo, presentar una alerta y guiar un paso. |
| Expresiones | Ojos/visor y luces capaces de comunicar atención, confianza, duda, procesamiento, éxito, advertencia y error. |
| Audio | Sincronización opcional de boca/visor con voz, silenciamiento, subtítulos y estados de escucha. |
| Interacción | Eventos y clips identificables para activar gestos desde el estado del Avatar, el módulo BIM y las respuestas del asistente. |
| Optimización | LOD para botón circular, panel mediano, panel semigrande, escritorio, móvil, AR y dispositivos de menor capacidad. |
| Exportación | GLB/glTF validado, con animaciones reproducibles, materiales conservados y manifest de versión. |

### Estados animados obligatorios

El Avatar debe reaccionar visualmente al estado de la conversación y del sistema. En modo botón circular utilizará una animación mínima y eficiente. En panel mediano podrá saludar, escuchar, pensar, mostrar una sugerencia y señalar el siguiente paso. En panel semigrande podrá acompañar explicaciones, presentar resultados, indicar elementos del modelo, expresar advertencias y mostrar confirmaciones. Al minimizarse, debe ejecutar una transición breve y conservar el contexto.

Las animaciones deben ser controlables por eventos semánticos, no por lógica visual dispersa. El contrato deberá definir estados como `idle`, `listening`, `thinking`, `speaking`, `guiding`, `vision_processing`, `ocr_processing`, `ar_tracking`, `success`, `warning`, `error` y `sleeping`.

### Generación y aceptación

DeepSeek deberá diseñar el contrato de generación del activo, sus nombres de clips, eventos, materiales, niveles de detalle, variantes de color, límites de peso y criterios de exportación. Manus deberá verificar que el GLB abre correctamente, que las animaciones se reproducen, que los materiales son visibles, que el modelo tiene escala coherente y que los tres tamaños del Avatar mantienen rendimiento aceptable.

No se considerará implementado el Avatar 3D por una imagen estática. La entrega verificable deberá incluir el archivo GLB/glTF, un visor de prueba, una lista de animaciones, una prueba de eventos de gestos y un manifest con versión, licencia, fuentes y hash del activo.
