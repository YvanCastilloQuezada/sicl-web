# Consulta formal a DeepSeek — Avatar ARKI y paleta visual

El Avatar ARKI acompañará al usuario durante todo el uso de ARKI y durante todo el ciclo de vida del producto: concepción, diseño, BIM, coordinación, costos, expediente, planificación, construcción, operación y mantenimiento.

Diseña la especificación funcional completa del Avatar considerando visión inteligente, OCR, lectura de planos y documentos, análisis de imágenes, realidad aumentada, voz, conversación contextual, coordinación BIM, costos, obra, mantenimiento, guía de aprendizaje y asistencia profesional.

El Avatar debe tener cuatro estados visuales: botón circular mínimo; panel mediano al primer toque; panel semigrande al segundo toque; y minimización al botón al tercer toque o mediante comando. Debe conservar el contexto, conversación y estado del proyecto al cambiar de tamaño. Debe funcionar en escritorio y móvil, ser accesible por teclado y no bloquear el canvas.

Como ARKI es una plataforma nueva, el Avatar debe enseñar, dirigir y asesorar durante todo el proceso: onboarding, explicación del módulo, guía contextual, sugerencias de siguiente paso, revisión de errores, buenas prácticas, trazabilidad y ayuda para obtener mejores resultados. Las acciones sensibles requieren autorización y revisión humana.

## Consulta de paleta

Recomienda tres paletas profesionales para el Avatar y el workspace BIM. Para cada una incluye valores HEX para fondo, superficie, texto principal, texto secundario, acento primario, selección, éxito, advertencia, error, información y modo AR.

Evalúa explícitamente la paleta actual `#080736` con texto blanco y acentos amarillo, naranja y verde. Indica si la conservarías, la ajustarías o la reemplazarías. Justifica la recomendación según contraste, accesibilidad, fatiga visual, jerarquía BIM, impresión de planos, trabajo prolongado, estados de coordinación y visibilidad en realidad aumentada.

Entrega también criterios de aceptación, wireflows de los tres tamaños, estados de carga/error/sin permisos, contrato de privacidad, auditoría, nivel de confianza de visión/OCR y límites de autonomía. No declares implementado aquello que solo esté diseñado.


## Requisito adicional del Product Owner: activo 3D

La referencia visual adjunta define un Avatar robótico profesional, amigable y orientado a ingeniería. Diseña también el pipeline para generar el activo como **GLB/glTF 2.0**, incluyendo geometría optimizada, materiales PBR, rig, clips de animación, expresiones del visor, gestos de manos y eventos semánticos.

Debes especificar como mínimo los estados `idle`, `listening`, `thinking`, `speaking`, `guiding`, `vision_processing`, `ocr_processing`, `ar_tracking`, `success`, `warning`, `error` y `sleeping`, además de gestos de saludo, señalamiento, presentación, confirmación, duda, advertencia y minimización.

Define cómo el mismo activo se adaptará a los tres tamaños de interfaz: botón circular, panel mediano y panel semigrande. Incluye LOD, rendimiento, accesibilidad, subtítulos, sincronización opcional de voz, manifest, versión, licencia, hash del GLB y criterios de aceptación del visor 3D. La entrega no debe llamarse implementada si solo existe una imagen o un modelo sin rig y animaciones verificables.
