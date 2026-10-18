# E1.8 — Matriz de cobertura Archi / Arqui / Revit

Esta matriz no afirma que Arqui o Revit estén disponibles en esta sesión. Define el benchmark que DeepSeek debe verificar y ampliar contra capacidades reales.

| Área | Archi actual | Capacidad objetivo | Brecha inicial | Entrega |
|---|---|---|---|---|
| Generación paramétrica | Motor constructivo base | Familias, tipos, instancias, host y restricciones | DSL ampliado | E3 |
| Planta y corte | SVG 2D semántico | Vistas técnicas, cotas, filtros y edición | Profundidad de herramientas | E2/E5 |
| Visor 3D | No profesional | SceneModel, cámaras, clipping, medición y selección | Visor real | E5 |
| Documentación | Dossier conceptual | Hojas, revisiones, detalles, emisión y trazabilidad | Publicación coordinada | E8 |
| Persistencia | Local y snapshots parciales | Versiones, auditoría, aprobación y restauración | IndexedDB y servidor opcional | E6 |
| IFC | Exportación conceptual | IFC4, parser, GlobalId y round-trip | Adaptador productivo | E6 |
| Revit/RFA/RVT | No adaptador productivo | Importación/exportación gobernada | Host y software real | E6 |
| Estructuras | Predimensionamiento | Solver, resultados y memoria firmada | OpenSees y profesional | E7 |
| MEP | Parámetros conceptuales | Redes calculables y coordinación | Modelo MEP | E7 |
| Costos/4D | Referencial | Catálogo contractual, contratos, avance y ruta crítica | Gobierno y conciliación | E7 |
| Clashes | Conceptual | Detección espacial, BCF y cierre | Motor de coordinación | E7 |
| OCR/visión | Futuro | Lectura de planos y conversión BIM trazable | Luka y proveedor | E8 |
| Avatar | Futuro | GLB, rig, gestos, guía y AR | Contrato independiente | E8 |
| O-M | Conceptual | Activos, garantías, órdenes e historial | Sistema operativo | E8 |

Cada fila debe revisarse con código, prueba, output y limitaciones antes de cambiar de estado.

## Referencias

[1]: https://www.buildingsmart.org/standards/bsi-standards/information-delivery-manual/ "buildingSMART information delivery standards" 
