# Resumen de la propuesta de Planta SVG recibida

## Qué propone

La propuesta recibida describe una vista de planta SVG interactiva con zoom, desplazamiento, capas activables, hover, tooltips, cotas, escala gráfica, regla, exportación SVG/PNG y grupos separados para estructura, vanos, circulación, instalaciones, mobiliario, medidas y etiquetas.

También incluye símbolos para muros, columnas, vigas, ambientes, puertas, ventanas, circulaciones, instalaciones de agua, electricidad y HVAC, ejes y norte.

## Qué demuestra

Demuestra una especificación útil para una vista 2D técnica. Define controles y capas que deben formar parte del contrato de Planta.

## Qué no demuestra

El documento es una propuesta de implementación en JavaScript/Vue y no prueba que esas capacidades estén integradas actualmente en el repositorio React/TypeScript de Archi. Tampoco demuestra que el SVG esté conectado al `ConstructionModel`, que las puertas estén hospedadas en muros, que los datos sean editables o que las exportaciones estén verificadas.

## Tratamiento en la Addenda E

DeepSeek debe incorporar esta propuesta a la matriz de cobertura, pero debe verificar cada función contra el código real. Debe conservar la intención funcional —capas, medidas, interacción, exportación y tooltips— y adaptar la implementación a la arquitectura actual de Archi.

La vista SVG 2D puede ser una capacidad implementada o parcial, pero no debe presentarse como visor BIM 3D profesional. Para el nivel profesional todavía deben demostrarse SceneModel, visor 3D, selección espacial, clipping, cámaras, rendimiento, comparación visual, IFC4, persistencia y coordinación.

## Demostración mínima actual

La evidencia mínima que debe mantenerse es un cuadrado real de cuatro muros generado por `ConstructionModel`, una puerta de 0.90 × 2.10 m relacionada con el muro norte, selección del muro y selección de la puerta. Esa cadena debe vincularse a capas, metrados, costos y trazabilidad.
