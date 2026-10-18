# ADR-UI2-016 — Taxonomía final de módulos

**Estado:** Implementado y verificado  
**Fecha:** 22 de septiembre de 2026  
**Decisor:** Product Owner ARKI

## Decisión

La taxonomía UI-2 adopta dieciséis módulos canónicos: Data, Biblioteca, Proyectos, Generador, Modelo BIM, Planta, Corte, 3D, Metrados, PRESUP-5D, GASTOS, 4D, Clashes, EXP-TEC, O-M y ADM.

La página SILC no se mantiene como módulo independiente. Su responsabilidad queda absorbida por Modelo BIM, evitando duplicación de navegación y de dominio.

## Matriz

Data y Biblioteca son públicos. Los módulos de proyecto son visibles para perfiles no visitantes según la matriz verificada. GASTOS, O-M y ADM son visibles para perfiles no visitantes, pero se desactivan cuando su estado es `NOT AVAILABLE` o `FUTURE REFERENCE`, mostrando tooltip de integración pendiente.

## Consecuencias

El Navigator, el tab bar, la matriz de permisos y el catálogo i18n utilizan los mismos nombres canónicos. Las capacidades futuras permanecen explícitas y no se presentan como implementadas. UI-3 no se inicia con esta decisión.
