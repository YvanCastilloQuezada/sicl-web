# ARKI — Decisión formal de apertura UI-2

**Estado:** Decisión confirmada por el Product Owner.  
**Fecha:** 22 de septiembre de 2026.

## Decisión

Se aprueba abrir UI-2 con **opción B: migración estructural** y con alcance limitado al **Generador integrado**.

La migración extraerá y reubicará componentes existentes de `Home.tsx` dentro del shell BIM, preservando el dominio y el comportamiento ya verificado. No se autoriza una migración cosmética como entrega final ni una migración funcional que cambie los contratos de dominio.

## Alcance aprobado

UI-2 podrá extraer `ConstructionPanel`, `DossierWorkspace` y `Metric` para convertirlos en módulos visibles del workspace. El generador debe continuar funcionando sin cambios de dominio y la navegación debe mostrar el contenido en las pestañas correspondientes.

## Alcance excluido

UI-2 no incluye canvas BIM nuevo, selección de elementos, Info Box poblado, clash detection visual, propiedades por elemento, integración nueva con `FamilyInstance`, integración nueva con `ProjectSnapshot`, backend, expediente ampliado, costos avanzados ni realidad aumentada.

Esos alcances se reservarán para UI-3 a UI-6, cada uno con contrato propio.

## Decisión sobre la Orden Maestra

DeepSeek redactará la primera propuesta de la **Orden Maestra UI-2**. Manus y el Product Owner la revisarán contra el código real antes de aprobar la implementación.

No se inicia código de UI-2 hasta que la Orden Maestra tenga alcance, entregables, contratos reutilizados, pruebas, criterios de aceptación y exclusiones explícitas.
