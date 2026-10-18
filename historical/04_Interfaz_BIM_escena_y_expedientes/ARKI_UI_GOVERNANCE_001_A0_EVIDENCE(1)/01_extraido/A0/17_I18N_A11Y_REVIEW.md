# A0 — Internacionalización y accesibilidad

La interfaz contiene rutas y páginas con textos en español, inglés y etiquetas técnicas. A0 no afirma cobertura completa de ocho idiomas. La verificación debe comparar cada string visible con el catálogo de traducciones, revisar textos de fallback, comprobar labels de inputs, foco de teclado, nombres accesibles, contraste, estados de carga y mensajes de error.

Se debe repetir la matriz de controles para español, inglés y los demás idiomas soportados. Un botón traducido pero sin label accesible sigue siendo defectuoso. Un control visible solo después de permisos debe registrar esa condición explícitamente.
