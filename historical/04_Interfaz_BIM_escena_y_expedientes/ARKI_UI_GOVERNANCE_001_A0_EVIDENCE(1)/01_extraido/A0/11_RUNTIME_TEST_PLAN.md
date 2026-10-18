# A0 — Plan de pruebas runtime

El sweep debe abrir cada ruta en un navegador limpio y registrar URL, usuario o modo de acceso, estado de carga, consola, red, controles visibles, controles deshabilitados y resultado de cada interacción. Las acciones deben comenzar por operaciones reversibles y usar proyectos de prueba aislados.

Para cada acción se debe comprobar: que el control se muestra cuando corresponde; que el click o cambio de valor dispara el handler correcto; que la interfaz muestra progreso; que el resultado es observable; que el error se muestra de forma útil; que no se duplica la acción; que la persistencia puede leerse de nuevo; y que el usuario puede volver atrás o restaurar el estado.

Las pruebas físicas de WebXR, cámara, micrófono, WebRTC, Revit, Dynamo, Rhino, Blender y dispositivos reales no se consideran realizadas en sandbox si no existe evidencia física verificable.
