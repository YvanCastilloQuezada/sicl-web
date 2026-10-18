# E4.1 — Esquema común de familias especializadas

Toda familia especializada debe usar la identidad canónica de Archi y declarar:

| Grupo | Campos mínimos |
|---|---|
| Identidad | `elementId`, familia, tipo, versión, origen, responsable |
| Contexto | proyecto, edificio, nivel, fase, disciplina, zona, host |
| Geometría | dimensiones, unidades, ejes, referencias, tolerancias |
| Materiales | material, acabado, protección, fabricante opcional |
| Reglas | restricciones, rangos, compatibilidad, advertencias |
| Cantidad | fórmula, unidad, elementos origen, redondeo |
| Costo | partida, moneda, precio fuente, fecha, APU |
| Tiempo | actividad, duración, predecesoras, estado |
| Coordinación | relaciones, reservas, cruces, interferencias |
| Operación | activo, serial, garantía, mantenimiento, fabricante |
| Exportación | IFC, DXF, Revit u otro destino y pérdida declarada |
| Gobierno | revisión, aprobación, evidencia, firma requerida |

## Estados

`DRAFT`, `VALIDATED`, `APPROVED`, `BLOCKED`, `SUPERSEDED` y `REJECTED`. `APPROVED` en el catálogo no equivale a aprobación profesional.

## Reglas de seguridad

Los rangos deben rechazar valores inválidos. La unidad se conserva explícitamente. La identidad no cambia al modificar dimensiones. Toda regeneración debe registrar qué salidas potenciales quedaron obsoletas.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
