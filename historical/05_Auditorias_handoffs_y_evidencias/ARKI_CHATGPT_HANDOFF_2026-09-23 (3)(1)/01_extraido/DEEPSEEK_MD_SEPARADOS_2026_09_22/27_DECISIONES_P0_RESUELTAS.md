# Decisiones P0 — Resolución del Product Owner

**Fecha:** 2026-09-23

El Product Owner acepta las cinco recomendaciones propuestas por DeepSeek:

| ID | Decisión | Resolución |
|---|---|---|
| P0-1 | Tecnología del visor 3D | **RESOLVED — Three.js + React Three Fiber** |
| P0-2 | Persistencia real | **RESOLVED — IndexedDB local-first + adaptador de servidor opcional** |
| P0-3 | Parser IFC4 | **RESOLVED — web-ifc gobernado con reporte de pérdida** |
| P0-4 | Solver estructural | **RESOLVED — OpenSees, sujeto a validación profesional** |
| P0-5 | Normativa MEP | **RESOLVED — Perú como país base + alcance hospitalario inicial** |

## Límites de la resolución

Estas decisiones autorizan la arquitectura contractual de E5-E7. No significan que Three.js/R3F, IndexedDB, web-ifc, OpenSees o la normativa MEP ya estén implementados o verificados. Cada tecnología debe tener su ADR, contrato, prueba, output y limitaciones.

La validación profesional de estructuras, MEP y firma continúa siendo obligatoria. La persistencia IndexedDB no sustituye una persistencia multiusuario de servidor. web-ifc debe reportar pérdidas y no puede presentarse como round-trip productivo hasta verificarse con fixtures reales.

## Estado

`FIX-0.4 — RESOLVED BY PRODUCT OWNER`

E1 continúa pendiente de cierre de los demás fixes F0 y de la aprobación formal de clasificación y evidencia visual.
