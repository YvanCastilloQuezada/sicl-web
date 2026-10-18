# ARKI — Apertura de E7

**Fecha:** 23 de septiembre de 2026  
**Decisión del Product Owner:** Opción B sobre E6

## Estados

- **E5:** `E5-PREVIEW / IMPLEMENTATION FREEZE` — sin cambios.
- **E6:** `PARTIAL / IMPLEMENTATION FREEZE` — no se reabre durante E7.
- **E7:** `OPEN` — autorizado para contratación; código aún no autorizado hasta contrato aprobado.

## Ledger consolidado

E7 hereda visiblemente, pero no intenta resolver, las siguientes deudas:

- **E5-DEBT:** ocho capturas, manifest, scope limits, outputs crudos, controles independientes, nomenclatura de filtro por altura y medición entre centroides, clipping geométrico real y snapping profesional real.
- **E6-DEBT:** seis capturas con hash, restauración real de snapshot, restauración y persistencia de viewpoints, geometría IFC completa, materiales/relaciones/propiedades IFC y lossReport productivo.

Estas deudas suman **15 elementos**. Permanecen en el ledger y no se mezclan con el alcance de E7.

## Reglas nuevas de E7

1. No se escribe código sin contrato aprobado.
2. Manus reporta; no emite veredicto.
3. DeepSeek verifica archivos y evidencia antes de emitir veredicto.
4. No se declara `VERIFIED` sin prueba, output, captura y hash.
5. No se activan integraciones externas sin recursos reales.
6. Una entrega que supere dos ciclos en `PARTIAL` se congela automáticamente.
7. Cada entrega hereda como máximo una deuda funcional de la anterior; el resto permanece en el ledger.
8. El veredicto de DeepSeek debe ser corto, con máximo una página.
9. Manus no puede autoemitir `APPROVE` ni `VERIFIED`.
10. Toda captura debe tener SHA-256 y metadatos.

## Alcance candidato de E7

- Estructuras.
- MEP con subset inicial de gases medicinales, seguridad y sanitarias.
- Costos 5D.
- Planificación 4D.
- Coordinación y clashes reales.

La división recomendada es:

- **E7A:** Costos, 4D y Coordinación.
- **E7B:** Estructuras y MEP.

E7B sólo se abrirá después del cierre `VERIFIED` de E7A. Si E7A queda `PARTIAL`, se congela y E7B no se abre.

## Decisión pendiente del Product Owner

Debe elegirse entre:

- **Dividir E7 en E7A y E7B, empezando por E7A.**
- **Mantener E7 como una entrega completa**, con riesgo de alcance y verificación significativamente mayor.

Este documento abre E7 administrativamente, pero no autoriza implementación hasta que exista el Contrato E7A o el Contrato E7 completo aprobado.
