# Instrucción a DeepSeek — Redactar Orden Maestra UI-2

El Product Owner confirmó: **opción B + Generador integrado solamente + DeepSeek redacta la Orden Maestra UI-2 para revisión**.

Redacta una Orden Maestra UI-2 ejecutable, verificable y cerrada. La entrega debe definir alcance, contratos reutilizados, entregables, tests, criterios de aceptación, exclusiones, riesgos, compatibilidad y mensaje corto de arranque.

## Alcance autorizado

UI-2 será una migración estructural. Debe extraer componentes existentes de `Home.tsx` y reubicarlos como módulos del shell BIM, preservando el comportamiento del generador y sin cambiar los contratos de dominio.

Considera como entregables candidatos:

- `client/src/modules/GeneratorModule.tsx`.
- `client/src/modules/BimModule.tsx` para el `ConstructionPanel` existente.
- `client/src/modules/DossierModule.tsx` para el `DossierWorkspace` existente.
- `client/src/modules/MetricsModule.tsx` para las tarjetas `Metric`.
- `client/src/pages/Home.tsx` como orquestador ligero.
- Tests de integración de montaje, navegación y regresión.

La orden debe confirmar qué entregables son realmente necesarios después de inspeccionar el código; no debe inventar archivos ni afirmar implementaciones futuras como existentes.

## Contratos que deben conservarse

La orden debe preservar los contratos validados de UI-1 y dominio: `MODULE_DEFINITIONS`, `isAccessAllowed`, `supportedLanguages`, `useTranslation`, `t()`, los contratos 1A–1C, generación de familias, construcción, PriceBook, recalculation, expediente y exportaciones existentes.

## Exclusiones obligatorias de UI-2

No incluir canvas BIM nuevo, selección de elementos, Info Box poblado, clash detection visual, propiedades por elemento, nueva integración con `FamilyInstance`, nueva integración con `ProjectSnapshot`, backend, realidad aumentada, Avatar, expediente ampliado ni i18n completo.

## Criterios mínimos de aceptación

Los 12 comandos de regresión deben seguir pasando. El generador debe conservar el comportamiento actual. El shell debe montar cada módulo en su pestaña. La navegación `Generador`, `Modelo BIM`, `Expediente` y `Presupuesto` debe seguir funcionando. No debe romperse ningún contrato de dominio ni exportación.

La Orden Maestra debe separar claramente IMPLEMENTED, VERIFIED, PARTIAL, CONCEPTUAL, NOT AVAILABLE y FUTURE REFERENCE. No avances a código hasta que la orden sea revisada y aprobada.
