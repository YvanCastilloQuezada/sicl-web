# ARKI Red Team v2.2 — Manifest

## Correcciones verificadas

- RT-58: `blocked_by` de ciclos contiene solo nodos unresolved del ciclo.
- RT-62: se añadieron E11 (change_kind), E12 (coverage warning) y E13 (path explosion).
- RT-63: E4 valida atribución estricta de `derivation_records` por path.
- E12 usa correctamente `ImpactAnalyzer(DerivationLedger(Store()))`.
- V-05 permanece como `PARTIALLY_VALID → REVIEW` con autoridad humana requerida.

## Resultados

- Adversarial RT-62/RT-63: **10 passed**.
- Regresión focal H-001/H-002/H-003/E2E/H-004: **66 passed**.
- Suite global: **431 passed, 2 warnings no bloqueantes**.
- Compileall: **PASS**, código de retorno 0.
- Commit local: `1590b655ed45626ec0c94cc3f3c23f87de43d6b8`.
- No se hizo push, PR ni merge.

## Nota sobre la tercera orden

La adjunta `pasted_content_38.txt` no estaba disponible en el sandbox durante esta ejecución; no se inventó ni se aplicó contenido no recibido.
