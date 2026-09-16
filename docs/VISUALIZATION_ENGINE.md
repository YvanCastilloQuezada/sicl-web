# Motor de visualización — Fase 1

## Alcance

La Fase 1 añade visualizaciones bidimensionales para dos capacidades ya existentes del Core: el frente de Pareto y la secuencia temporal de eventos de auditoría. El motor no toma decisiones, no altera registros y no sustituye la separación entre evaluación, recomendación, revisión humana y decisión.

## Arquitectura

Los modelos `paretoModel.ts` y `eventModel.ts` transforman envelopes del Core en estructuras gráficas estables. Los componentes `ParetoChart` y `EventTimeline` renderizan SVG accesible, con escalas D3, etiquetas, colores de estado y tooltips nativos mediante `<title>`. `ChartEmptyState` centraliza la respuesta visual cuando no hay datos.

Los bindings del cliente REST se mantienen en `sicl-client.ts`. `calculatePareto` consume `POST /v1/projects/{id}/multiobjective/pareto` y `getCanonicalHistory` consume `GET /v1/projects/{id}/history`. Los errores del Core se muestran al usuario; los datos de ejemplo solo se usan cuando la vista aún no tiene un proyecto seleccionado.

## Cómo añadir un gráfico

Primero se define un modelo puro que convierta la respuesta canónica a un modelo visual. El modelo debe conservar identificadores, procedencia y estados epistemológicos, y no debe inferir datos faltantes. Después se implementa un componente SVG que reciba el modelo como prop, tenga un estado vacío explícito y use la paleta común de `d3Setup.ts`. Finalmente se añaden pruebas del modelo, del estado vacío y del renderizado, junto con las claves i18n en los ocho locales.

## Cómo añadir una entidad

Una entidad nueva requiere un endpoint Core existente o una especificación aprobada. El frontend solo añade un tipo, un método de cliente y un modelo de presentación cuando el contrato ya está disponible. No se deben fabricar endpoints ni convertir una visualización en una mutación implícita.

## Estilos

La paleta de gráficos conserva el lenguaje visual del Command Center: verde profundo para elementos principales y frente no dominado, gris salvia para elementos dominados, y terracota para datos incompletos o avisos. Los SVG usan tipografía del sistema y márgenes comunes. No se incluyen animaciones ni 3D en esta fase.

## Datos reales y mocks

Los mocks de `client/src/visualization/mocks` sirven para desarrollo aislado y pruebas deterministas. La conexión real se realiza mediante `VITE_API_URL` y el cliente REST existente. Un error de red no se presenta como un resultado válido; se conserva como error visible para que el operador pueda distinguir ausencia de datos, dato incompleto y fallo de servicio.

## Limitaciones conocidas

La interacción de zoom avanzada y la selección persistida son futuras mejoras. La respuesta de Pareto depende de que el Core entregue métricas numéricas reconocibles para los objetivos configurados. El timeline ordena por timestamp y muestra un resumen, pero no pretende ser una auditoría certificada ni reemplaza la lista de eventos detallada.
