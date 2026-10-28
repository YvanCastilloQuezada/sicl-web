# ARKI UI Governance 001 — A0 Executive Report

## Veredicto

**A0 queda en estado `PARTIAL / EVIDENCE_INSUFFICIENT`.** La auditoría documental y de fuente se ejecutó sin corregir lógica de producto. Se identificaron 38 rutas y 1336 ocurrencias de controles o handlers. La clasificación conservadora es `UNKNOWN_UNVERIFIED` para los 1336 controles inventariados; no se declara que estén rotos, pero tampoco se declara que funcionen.

## Hallazgos principales

El sistema tiene una superficie amplia y heterogénea. Las rutas incluyen workspace, control center, generadores paramétricos, visor BIM, familias dinámicas, Design Funnel, interoperabilidad, LUCA, campo, seguridad, investigación y ayuda. La amplitud hace insuficiente una prueba manual informal: se necesita una matriz por control y por estado de proyecto.

La evidencia histórica disponible confirma interacción parcial del Design Funnel. Esa evidencia incluye selección humana, promoción al Final Four, evaluación y vistas Planta, Corte, 3D y Programa. No cubre las 38 rutas ni demuestra persistencia completa, permisos, errores y exportaciones para cada control.

La validación automatizada actual pasó `pnpm check`, **96 archivos de prueba y 434 tests**, y `pnpm build`. El build emite un warning de chunks grandes, con `ifcGeometryAdapter` de aproximadamente 3,49 MB y otros chunks principales por encima de 500 kB. Ese warning afecta rendimiento y mantenimiento, pero no fue tratado como defecto funcional dentro de A0.

El bootstrap actual no presenta el blocker heredado: `pnpm check` y `pnpm build` pasan. La aceptación total sigue sin declararse porque todavía no existe un sweep runtime exhaustivo de las 38 rutas y los 1.336 controles.

## Conteos

| Estado | Conteo |
|---|---:|
| Rutas declaradas | 38 |
| Controles/handlers descubiertos | 1336 |
| Funcionales confirmados en A0 | 0 |
| Deshabilitados con razón confirmada | 0 |
| Ocultos por política confirmados | 0 |
| No implementados explícitos confirmados | 0 |
| Bloqueados por permiso confirmado | 0 |
| Bloqueados por dependencia confirmado | 0 |
| Rotos confirmados por A0 | 0 |
| Unknown/unverified | 1336 |

## Decisión de cierre

A0 no autoriza afirmar “todos los botones funcionan”. Autoriza pasar a una fase de verificación runtime controlada. Esa fase debe resolver primero el bootstrap, después validar rutas y finalmente clasificar controles con evidencia. Ninguna corrección de producto se ejecutó en A0.

## Entregables

El paquete A0 contiene el mapa de rutas, el inventario por área, la matriz de acciones, el registro JSON, los registros de éxito y unknowns, la matriz de persistencia, gates de autoridad, revisión de seguridad, accesibilidad, exportación, placeholders, blockers, runbook y checklist.

## Referencias

[1]: `client/src/App.tsx:73-115` "Declaración de rutas ARKI"
[2]: `client/src/main.tsx` "Entrada de montaje React"
[3]: `scripts/run_ui_governance_a0.py` "Generador reproducible del inventario A0"
