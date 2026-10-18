# E2.4 — Catálogo de pruebas funcionales

| ID | Módulo | Prueba | Resultado esperado |
|---|---|---|---|
| T01 | Data | Versionar un material usado por un muro | Impactos detectados y datos trazables |
| T02 | Biblioteca | Cambiar parámetros de familia | Geometría, 2D/3D, metrado y costo coherentes |
| T03 | Proyectos | Crear versión y abrir snapshot anterior | Snapshot anterior reconstruible |
| T04 | Generador | Cambiar aforo y niveles | Espacios, elementos, cantidades, costo y plazo actualizados |
| T05 | Modelo BIM | Seleccionar árbol y canvas | Misma identidad e inspector actualizado |
| T06 | Planta | Click, Shift, Escape, zoom, pan, encuadre | Selección y viewport correctos |
| T07 | Corte | Cambiar altura de nivel | Corte, encuentros y metrados actualizados |
| T08 | 3D | Selección, sección y medición | Identidad común con Planta |
| T09 | Metrados | Cambiar longitud de muro | Área, volumen, peso y partida reconciliados |
| T10 | PRESUP-5D | Cambiar cantidad o material | APU y presupuesto reconciliados |
| T11 | GASTOS | Registrar gasto aprobado | Desviación y trazabilidad actualizadas |
| T12 | 4D | Cambiar duración de tarea | Ruta crítica y avance actualizados |
| T13 | Clashes | Crear y cerrar incidencia | Evidencia, responsable y estado conservados |
| T14 | EXP-TEC | Cambiar elemento documentado | Documento marcado pendiente de revisión |
| T15 | O-M | Crear activo desde elemento BIM | Activo, garantía y relación BIM persistentes |
| T16 | ADM | Ejecutar acción fuera del rol | Acción denegada y auditada |

## Pruebas globales

`G01` verifica ocho idiomas y fallback. `G02` verifica atajos. `G03` verifica selección sincronizada. `G04` verifica cancelación y deshacer. `G05` verifica estados `BLOCKED`, `PARTIAL` y `NOT IMPLEMENTED`. `G06` verifica que ninguna exportación se presente como definitiva sin gate.

Estos son casos de aceptación, no resultados de ejecución. Su implementación se programa en los bloques correspondientes y no se debe marcar `PASS` antes de obtener output real.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
