# A0 — Protocolo de auditoría

A0 usa una política conservadora. La presencia de un control en JSX no se interpreta como prueba de funcionamiento. Un control solo puede cambiar a `FUNCTIONAL` cuando existe evidencia de renderizado, interacción, resultado observable, manejo de error y efecto de estado o persistencia cuando corresponda.

Cada control se registra con cinco niveles de evidencia: existencia en fuente, renderizado, handler o dependencia, resultado observable y efecto persistido. Si falta cualquier nivel, la clasificación permanece `UNKNOWN_UNVERIFIED` o pasa a un defecto específico cuando existe evidencia suficiente del fallo.

Los estados funcionales y defectos se mantienen separados. Un botón puede tener un handler y continuar sin evidencia de que el handler produzca un resultado correcto. También se evita confundir un mensaje de éxito escrito en el código con una confirmación de operación real.

A0 no acepta como evidencia única el build, la existencia de una ruta, el texto de un toast, una respuesta HTTP 200 o un mock. Las fuentes externas, credenciales, servicios remotos y dispositivos físicos quedan fuera de la prueba automática salvo que exista evidencia reproducible y autorizada.
