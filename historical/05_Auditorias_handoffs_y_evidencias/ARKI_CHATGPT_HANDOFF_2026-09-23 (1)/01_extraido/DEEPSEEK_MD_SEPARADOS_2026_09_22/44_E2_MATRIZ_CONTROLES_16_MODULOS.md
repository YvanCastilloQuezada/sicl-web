# E2.2 — Matriz de controles de los 16 módulos

| Módulo | Contexto izquierdo | Canvas central | Inspector derecho | Caso mínimo |
|---|---|---|---|---|
| Data | organización, fuente, estado, versión, catálogo, importar | tabla, editor, relaciones, errores | identidad, vigencia, consumidores, impacto | cambiar versión de material y detectar afectados |
| Biblioteca | categoría, disciplina, tipología, origen, detalle, buscar | tarjetas, previews 2D/3D, parámetros, tipos | rangos, restricciones, materiales, reglas, IFC/Revit | cambiar ancho/alto/espesor y reconciliar resultados |
| Proyectos | organizaciones, proyectos, estado, cliente, etapas, disciplinas | resumen, hitos, riesgos, progreso | cliente, normativa, responsables, snapshot, alertas | crear versión y reconstruir snapshot anterior |
| Generador | pasos de familia, tipología, terreno, aforo, niveles, materiales, reglas | planta, corte, masa, variantes, estado | parámetros, elementos, espacios, metrados, costo, plazo, advertencias | cambiar aforo/niveles y verificar cadena completa |
| Modelo BIM | árbol, niveles, fases, disciplinas, categorías, aislamiento, búsqueda | vista 2D/3D, grilla, ejes, selección, medición | ID, familia, geometría, capas, metrado, costo, relaciones | misma selección en árbol y canvas |
| Planta | nivel, disciplina, fase, categorías, grilla, herramientas | muros, puertas, ventanas, columnas, vigas, losas, espacios | propiedades, capas, materiales, metrado, costo, relaciones | click, Shift, Escape, zoom, pan y encuadre |
| Corte | línea, profundidad, niveles, disciplina, fase, cotas | corte vertical, encuentros, niveles, elementos atravesados | alturas, espesores, continuidad, impacto | cambiar altura de nivel y verificar corte |
| 3D | cámara, vistas, órbita, sección, estilo, transparencia, aislamiento | modelo navegable, selección, clipping, medición | propiedades, materiales, relaciones, clashes, evidencias | misma identidad planta/3D y sección coherente |
| Metrados | regla, nivel, fase, categoría, familia, partida, unidad, snapshot | tabla, totales, diferencias, sin partida | fórmula, origen, dimensiones, cantidad, evidencia | cambiar longitud y recalcular área/volumen/peso |
| PRESUP-5D | WBS, capítulos, partidas, región, precios, APU, moneda, impuestos | presupuesto, APU, curvas, variaciones | origen BIM, cantidad, precio, parciales, aprobación | cambiar cantidad/material y reconciliar presupuesto |
| GASTOS | obra, contrato, proveedor, centro, periodo, tipo, aprobación | gastos, comprometido, valorizaciones, desviaciones, curva S | documento, monto, pago, aprobadores, impacto | registrar gasto y detectar desviación |
| 4D | WBS, calendario, fases, recursos, ruta crítica, snapshot | Gantt, secuencia, avance, curva | tarea, elementos, duración, predecesoras, costo | cambiar duración y actualizar ruta |
| Clashes | modelos, disciplinas, reglas, tolerancia, estados, responsables | incidencias espaciales, agrupación, comparación | clash, elementos, regla, severidad, responsable, evidencia | crear, asignar, resolver y reabrir clash |
| EXP-TEC | capítulos, documentos, revisiones, normativa, estado de emisión | índice, documentos, visor, checklist | origen, revisión, aprobación, firma, gate | cambio de muro actualiza expediente pendiente |
| O-M | activos, sistemas, ubicación, garantía, estado, órdenes | inventario, mapa, mantenimiento, historial | activo, fabricante, serial, garantía, BIM, órdenes | crear activo desde elemento y registrar mantenimiento |
| ADM | organización, usuarios, roles, políticas, auditoría | panel administrativo, catálogos, actividad | usuario, permiso, política, evento, evidencia | denegar acción fuera del rol y auditarla |

La matriz se complementa con `ARCHI_CONTROLES_FUNCIONALES_16_MODULOS.md`, que conserva la especificación detallada existente.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards"
