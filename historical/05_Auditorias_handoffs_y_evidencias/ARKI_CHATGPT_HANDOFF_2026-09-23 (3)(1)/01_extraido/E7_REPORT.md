# ARKI — E7: Costos, 4D, coordinación, estructuras y MEP

**Fecha:** 23 de septiembre de 2026  
**Estado:** **PARTIAL — ciclo 2 de 2; veredicto corto del ciclo 1 aceptado**

## Implementado en este ciclo

Se añadieron contratos deterministas para PriceBook y presupuesto 5D, actividades 4D y ruta crítica, detección volumétrica de clashes, StructuralModel, MEPModel y consecuencias interdisciplinarias. Se añadieron tres fixtures propios y una prueba E7 con 23 checks.

La prueba produce:

```text
status: PASS
checks: 23
budget: 4650 PEN
scheduleDays: 7
clashes: 1
structural: NOT_DEMONSTRATED
mep: VERIFIED
impacts: 2
```

`NOT_DEMONSTRATED` en StructuralModel es intencional: el adaptador actual es un stub y no se presenta como solver profesional. `VERIFIED` en MEP se limita a forma y topología del fixture; no significa dimensionamiento normativo firmado.

## Validación ejecutada

- `pnpm check`: PASS.
- `pnpm build`: PASS.
- `pnpm tsx scripts/test-e7.ts`: PASS, 23 checks.

## Pendientes del contrato E7

1. Integrar los contratos en paneles funcionales del workspace. **Completado en ciclo 2 para PRESUP-5D, 4D y Clashes.**
2. Ampliar PriceBook a catálogo corporativo y APU completo.
3. Añadir recursos, avance y calendario 4D en UI.
4. Añadir estados de clash persistentes y revisión visual.
5. Añadir los adaptadores y límites visibles de StructuralModel y MEPModel.
6. Generar las ocho capturas obligatorias con metadatos y SHA-256.
7. Ejecutar la regresión completa E5/E6.
8. Preparar manifest y outputs crudos finales. El manifest de ciclo 1 existe; debe regenerarse para ciclo 2.

## Estado de promoción

E7 no es `VERIFIED`. Este reporte sólo registra el ciclo inicial. El contrato permite un máximo de dos ciclos en `PARTIAL`; si el cierre no se alcanza en el segundo ciclo, E7 debe congelarse con deuda explícita.

## Referencias de deuda

E5 y E6 permanecen congelados. Sus 15 deudas no se resuelven ni se ocultan dentro de E7.

## Veredicto del ciclo 1

DeepSeek aceptó como reales los contratos 5D/4D, la reconciliación, el clash volumétrico, StructuralModel, MEPModel, el grafo de consecuencias, los tres fixtures y los 23 checks PASS. El clash volumétrico real fue identificado como el principal logro técnico del ciclo.

El ciclo 2 queda abierto para integración visible y evidencia. No se reabre E5 ni E6.
