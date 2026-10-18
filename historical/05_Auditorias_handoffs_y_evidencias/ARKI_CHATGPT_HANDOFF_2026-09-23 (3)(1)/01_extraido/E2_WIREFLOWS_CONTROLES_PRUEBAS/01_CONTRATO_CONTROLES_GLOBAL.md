# E2.1 — Contrato global de controles

E2 define controles antes de programarlos. Todas las pantallas de Archi mantienen tres zonas: **Contexto**, **Canvas** e **Inspector**. La zona central cambia de tipo según el módulo, pero la relación entre selección, datos y trazabilidad permanece estable.

## Controles globales

El workspace debe mostrar proyecto y versión activa, snapshot, idioma, ayuda contextual, estado del motor, guardar snapshot, deshacer/rehacer cuando aplique, búsqueda, filtros, cambios sin guardar, validación y exportaciones permitidas.

## Reglas de interacción

Seleccionar en el canvas actualiza árbol e inspector. Seleccionar en el árbol resalta el elemento en el canvas. El inspector nunca conserva datos de una selección anterior. Una modificación anuncia si afecta geometría, materiales, metrados, costo, plazo o expediente. Toda acción modificadora permite cancelar o volver atrás.

## Atajos contractuales

| Atajo | Acción | Alcance |
|---|---|---|
| `Ctrl/Cmd+K` | Buscar elemento, familia o comando | Global |
| `Ctrl/Cmd+S` | Guardar snapshot o borrador | Global |
| `Escape` | Cancelar o limpiar selección | Canvas/formularios |
| `Shift+click` | Añadir selección | Vistas seleccionables |
| `Ctrl/Cmd+Z` | Deshacer | Módulos editables |
| `Ctrl/Cmd+Shift+Z` | Rehacer | Módulos editables |
| `F` | Encuadrar selección | Canvas |
| `M` | Medir | Planta, corte y 3D |

## Estados de control

Cada control debe tener estado disponible, deshabilitado con causa, cargando, vacío, error recuperable, bloqueado por permiso y bloqueado por evidencia. Un tooltip no sustituye el mensaje de causa.

## Alcance excluido

E2 no implementa Three.js, R3F, IndexedDB, web-ifc, OpenSees, MEP productivo, Avatar, Luka ni conectores externos. Solo define sus puntos de integración.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
