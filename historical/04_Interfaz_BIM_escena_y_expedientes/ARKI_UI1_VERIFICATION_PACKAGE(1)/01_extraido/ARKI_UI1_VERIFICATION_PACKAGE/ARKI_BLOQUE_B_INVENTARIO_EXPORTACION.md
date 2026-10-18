# ARKI — Bloque B: inventario técnico y exportación

**Estado:** Entregado para revisión técnica  
**Alcance:** Inventario corporativo y contrato ARKI → IFC/Revit

## 1. Regla de inventario

La biblioteca completa es una referencia corporativa. Una familia solo puede declararse `IMPLEMENTED` cuando posee contrato paramétrico, integración con el dominio, propiedades, reglas de cantidad o costo cuando correspondan y una prueba reproducible.

Estados válidos:

```text
IMPLEMENTED · VERIFIED · CONCEPTUAL · PARTIAL · NOT AVAILABLE · FUTURE REFERENCE
```

## 2. Disciplinas

| Disciplina | Familias prioritarias | Estado actual |
|---|---|---|
| Arquitectura | espacios, muros, puertas, ventanas, mamparas, pisos, techos, acabados | PARTIAL / VERIFIED en núcleo constructivo |
| Estructuras | cimentaciones, columnas, vigas, losas, placas, acero | CONCEPTUAL; requiere cálculo especializado |
| Geotecnia | suelo, capacidad portante, estratos, cimentación | NOT AVAILABLE |
| Materiales | ladrillo, tarrajeo, imprimante, pintura y acabados | PARTIAL |
| Transporte vertical | ascensores, montacargas y plataformas | FUTURE REFERENCE |
| Sanitarias | agua fría, agua caliente, desagüe y ventilación | FUTURE REFERENCE |
| Eléctricas | tableros, luminarias, tomas, respaldo y canalizaciones | FUTURE REFERENCE |
| HVAC | chillers, VRF, fan coils, ductos y controles | FUTURE REFERENCE |
| Gases medicinales | oxígeno, aire medicinal, vacío y centrales | FUTURE REFERENCE |
| Telecomunicaciones | racks, routers, switches, Wi-Fi y cableado | FUTURE REFERENCE |
| Seguridad | CCTV, acceso, alarmas y sensores | FUTURE REFERENCE |
| Contra incendio | rociadores, gabinetes, hidrantes y alarmas | FUTURE REFERENCE |
| Costos | PriceBook, APU, S10, CAPECO y metrados | VERIFIED referencial |
| Construcción | encofrados, 4D, avance y calidad | PARTIAL |
| Coordinación BIM | relaciones, clashes, BCF y revisiones | PARTIAL / heurístico |
| Operación | activos, garantías y mantenimiento | NOT AVAILABLE |

## 3. Contrato de exportación

Cada exportación debe producir:

```text
archivo
formato y versión
origen del modelo
fecha o versión de snapshot
entidades exportadas
entidades omitidas
propiedades aproximadas
reporte de cobertura
advertencias
```

El mapa mínimo es:

```text
Entidad ARKI
→ categoría destino
→ familia o tipo destino
→ parámetros compartidos
→ material
→ clasificación IFC
→ regla de pérdida
→ advertencia
```

Si ARKI tiene más propiedades que el destino, no se eliminan. Se conservan en parámetros compartidos, propiedades IFC, tablas JSON/CSV o anexos.

## 4. Destinos

| Destino | Estado contractual |
|---|---|
| IFC4X3 semántico | Parcial; requiere parser formal externo |
| JSON/CSV | Disponible para intercambio local |
| Markdown | Disponible para expediente local |
| BCF | Futuro; requiere incidencias y viewpoints formales |
| RVT/RFA | Futuro; requiere conector o exportador especializado |
| PDF emitible | Futuro; requiere compositor documental |
| DWG/DXF | Futuro; requiere conector especializado |

Revit es un destino de interoperabilidad. No define la completitud de ARKI.

## 5. Criterio de cierre

El Bloque B se considera preparado cuando cada familia nueva tenga responsable, prioridad, nivel geométrico, nivel de información, reglas de costo, reglas 4D, mantenimiento, clasificación IFC, mapeo Revit y prueba requerida. La implementación de nuevas disciplinas queda separada del shell UI-1.

## Referencias

[1]: file:///home/ubuntu/generador-familias/ARKI_CONTRATO_UI_BIM_CORPORATIVO_V2.md "Contrato corporativo de interfaz BIM ARKI"
[2]: file:///home/ubuntu/generador-familias/ARKI_LISTA_COMPLETA_FAMILIAS_REVIT.md "Lista de familias ARKI según Revit"
[3]: file:///home/ubuntu/generador-familias/ARKI_ESTADO_COMPLETO_Y_PENDIENTES.md "Estado completo y pendientes"
