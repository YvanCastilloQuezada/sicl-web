# E7 — Auditoría del estado `mep: VERIFIED`

**Orden:** 93 · **Clasificación:** `PROVEN_SAFE` únicamente para el alcance bounded/topológico.

## Hallazgo

El output de `scripts/test-e7.ts` informa `mep: "VERIFIED"` porque `validateMepModel()` comprueba que cada nodo referencia conectores existentes y que cada conector referencia un nodo existente. El fixture contiene cuatro nodos y cuatro conectores, y la prueba confirma cero conexiones faltantes.

El mismo contrato devuelve siempre la advertencia `Professional MEP sizing solver not executed`. Por tanto, `VERIFIED` significa **integridad de referencias del subconjunto MEP**, no cálculo de caudales, pérdidas, diámetros normativos, presión, selectividad, coordinación federada, firma profesional ni dimensionamiento hospitalario.

## Veredicto

| Alcance | Estado |
|---|---|
| Carga y forma del fixture | PROVEN_SAFE |
| Conectividad nodo–conector | PROVEN_SAFE |
| Gases medicinales / sanitarias / seguridad como categorías topológicas | PROVEN_SAFE, bounded |
| Solver profesional MEP | DEFERRED_WITH_REASON |
| Diseño hospitalario firmado | DEFERRED_WITH_REASON |
| Extrapolación a todas las disciplinas MEP | ARCHITECTURAL_DECISION_REQUIRED |

No se modifica E7 ni se cambia el nombre histórico del campo, porque la auditoría documenta su semántica exacta y evita una interpretación profesional falsa.
