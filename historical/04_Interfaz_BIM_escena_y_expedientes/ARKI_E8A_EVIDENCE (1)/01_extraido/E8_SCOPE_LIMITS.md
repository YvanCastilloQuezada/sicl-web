# E8 — Scope Limits

**Estado:** `OPEN / 1 CYCLE / REDUCED SCOPE`  
**Fecha:** 23 de septiembre de 2026  
**Baseline:** `c62183a`  
**Autoridad:** Product Owner / Human Authority  

## Dentro del alcance

### E8-A — Expediente técnico

Generación de documentos desde un snapshot aprobado, incluyendo planos, cortes, detalles, metrados, presupuesto, especificaciones y memoria. Cada documento deberá conservar trazabilidad a versión, snapshot y elemento BIM cuando corresponda.

### E8-B — Operación y mantenimiento

Activos vinculados a elementos BIM, garantías, manuales, inspecciones, órdenes de trabajo, historial por activo, responsables y vida útil.

### E8-C — Gate final

Verificación de los doce criterios definidos por el contrato E8 antes de mostrar `APTO PARA CONSTRUCCIÓN`. Mientras falte cualquier criterio, el resultado deberá permanecer `NO APTO — PROPUESTO EN REVISIÓN`. El gate no podrá activarse por una acción de IA.

## Fuera del alcance

Los siguientes elementos no se implementan ni se reabren dentro de E8:

- Avatar ARKI.
- Luka.
- Visión, OCR y AR.
- Academy, Tutor y Oracle.
- DXF.
- Revit, RVT y RFA.
- Colaboración multiusuario.
- Backend productivo.
- Reapertura de E5, E6 o E7.
- Nuevos motores BKH.
- Nuevas disciplinas o solvers profesionales.

## Reglas de ejecución

E8 tendrá un único ciclo. Si no cierra todos sus criterios, se declarará `PARTIAL / FREEZE`. E8-A, E8-B y E8-C se verificarán separadamente; el fallo de un bloque no deberá ocultar el estado de los otros. Las capturas y el manifest forman parte de los entregables iniciales y no se reservarán únicamente para el final.

## Estados heredados

```text
E5: FROZEN / PARTIAL
E6: PARTIAL / FREEZE
E7: PARTIAL / FREEZE
E8: OPEN / 1 CYCLE / REDUCED SCOPE
```

## Preflight confirmado

`pnpm check`, `pnpm build` y las regresiones seleccionadas de E5, E6 y E7 terminaron con `EXIT_CODE=0`. La evidencia cruda está en `E8_PREFLIGHT_OUTPUTS.txt`.

Este documento no declara implementación ni verificación de E8.
