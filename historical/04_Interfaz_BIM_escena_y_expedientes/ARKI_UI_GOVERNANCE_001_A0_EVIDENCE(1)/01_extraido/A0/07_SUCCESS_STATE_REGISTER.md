# A0 — Registro de estados de éxito

No se canonizó ningún mensaje de éxito como prueba de operación. El código contiene textos como “guardado”, “actualizado”, “exportado”, “generado” y `toast.success`, pero A0 exige asociar cada mensaje con una transición observable y, cuando aplique, con una lectura posterior desde la fuente de verdad.

Los mensajes de éxito son, por tanto, **candidatos de evidencia**. La revisión A0 debe confirmar que no aparezcan antes de que finalice la mutación, que representen el resultado real y que los errores posteriores no queden ocultos por un toast optimista.
