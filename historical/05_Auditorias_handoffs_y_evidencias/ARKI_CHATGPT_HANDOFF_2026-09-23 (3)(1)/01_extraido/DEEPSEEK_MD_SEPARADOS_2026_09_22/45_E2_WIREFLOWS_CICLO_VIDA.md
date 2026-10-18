# E2.3 — Wireflows del ciclo de vida

## Flujo A — Datos a biblioteca

`Data → crear fuente → validar versión → Biblioteca → crear familia/tipo → definir restricciones → validar reglas → publicar en catálogo`

El inspector debe indicar qué familias, partidas y documentos consumen cada dato. La publicación requiere snapshot y responsable.

## Flujo B — Generador a modelo BIM

`Generador → elegir familia → definir tipología → introducir parámetros → generar → revisar advertencias → aceptar propuesta → crear ConstructionModel → abrir Modelo BIM`

La aceptación debe mostrar los objetos creados, sus IDs y los impactos previstos. El modelo generado no se considera aprobado para construir.

## Flujo C — Modelo a vistas

`Modelo BIM → seleccionar nivel/disciplina/fase → Planta o Corte o 3D → seleccionar elemento → Inspector → cambiar vista sin perder identidad`

La selección debe conservar `elementId`, familia, tipo y trazabilidad en todas las vistas.

## Flujo D — Modelo a cantidades, costo y tiempo

`Modelo BIM → Metrados → aplicar regla → reconciliar cantidades → PRESUP-5D → asignar APU → 4D → vincular actividad → validar impactos`

Cualquier cambio geométrico debe marcar metrados, partidas, costos y tareas potencialmente obsoletos.

## Flujo E — Coordinación

`Modelo federado → Clashes → aplicar tolerancia → crear incidencia → asignar responsable → revisar evidencia → resolver → revalidar → cerrar`

Cerrar una incidencia exige conservar evidencia y versión de los modelos revisados.

## Flujo F — Expediente y operación

`Modelo aprobado por gate → EXP-TEC → checklist → revisión → emisión controlada → O-M → registrar activos → garantía → mantenimiento`

Un expediente en estado preliminar no puede mostrar botón de emisión definitiva. Un activo de operación debe conservar relación con el elemento BIM de origen.

## Flujo transversal de rechazo

`Acción → validación → falla → mensaje de causa → cancelar o corregir → reintentar`

No se permite continuar silenciosamente cuando falta una fuente, una aprobación, una firma o una integración externa.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
