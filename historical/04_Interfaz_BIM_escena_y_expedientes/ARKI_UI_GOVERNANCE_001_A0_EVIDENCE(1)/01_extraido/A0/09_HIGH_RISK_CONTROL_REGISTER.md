# A0 — Controles candidatos de alto riesgo

Se detectaron 797 ocurrencias con palabras asociadas a cambios de estado, publicación, aprobación, exportación, importación, subida, recalculo, selección o borrado. Son **candidatos**, no defectos confirmados.

La prioridad de verificación es: primero acciones que puedan mutar Project State o Core; después exportaciones y publicaciones; luego acciones de persistencia de archivos; finalmente acciones reversibles de navegación y visualización. Cada candidato debe registrar autoridad requerida, confirmación humana, request exacto, respuesta, versión observada y posibilidad de rollback.

A0 no ejecutó acciones de alto impacto ni aceptó cambios en Core. Cualquier futura prueba de aprobar, publicar, firmar, borrar o sincronizar debe usar fixture aislado y una puerta humana explícita.
