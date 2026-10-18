# E8-C — Gate final de aptitud para construcción

**Estado máximo:** `IMPLEMENTED / PENDING INDEPENDENT REVIEW`  
**Fecha:** 23 de septiembre de 2026  
**Alcance:** gate determinista mínimo de E8-C; un ciclo único.

## Resultado

Se implementó `evaluateProjectGate(input)` en `shared/arkiProjectGate.ts`. La función conserva la autoridad humana y permanece fail-closed.

El gate produce `not_approved` si el actor es IA, si el snapshot no tiene `approval.gateStatus: "passed"`, si falta cualquier criterio, si la evidencia o verificación humana están incompletas o si falta una firma profesional con hash. Sólo produce `approved` cuando los doce criterios están satisfechos, trazados, verificados por una persona y acompañados por una firma profesional declarada.

El gate no calcula estructura, MEP ni normativa. Esas entradas se consideran evidencia declarada y permanecen sujetas a revisión profesional, conforme al contrato.

## Componentes

| Componente | Ruta | Estado |
|---|---|---|
| Contrato y evaluación | `shared/arkiProjectGate.ts` | IMPLEMENTED |
| Tests E8C-01…E8C-04 | `scripts/test-e8c-gate.ts` | 4/4 PASS |
| Generador de evidencia | `scripts/generate-e8c-evidence.ts` | IMPLEMENTED |
| Gate rechazado | `E8_C_CAPTURAS/01-gate-not-approved.svg/.webp` | GENERATED |
| Gate aprobado | `E8_C_CAPTURAS/02-gate-approved.svg/.webp` | GENERATED |
| Output crudo | `E8-C_OUTPUTS.txt` | GENERATED |

## Tests

- **E8C-01 PASS:** actor `ai` siempre produce `not_approved` y `GATE_NEVER_APPROVED_BY_AI`.
- **E8C-02 PASS:** snapshot sin `approval.gateStatus: "passed"` es rechazado.
- **E8C-03 PASS:** la ausencia de `mep_calculated` aparece en `missingCriteria`.
- **E8C-04 PASS:** doce criterios satisfechos, evidencia trazable, verificación humana y firma producen `approved`.

También pasaron las regresiones directas de E8-A y E8-B. `pnpm check` pasó. `pnpm build` debe permanecer como gate de entrega y se registra en el output consolidado.

## Evidencia visual

Las capturas SVG y WEBP son paneles documentales generados por script. No son screenshots de interacción del preview. El panel rechazado muestra `NO APTO — PROPUESTO EN REVISIÓN` y el criterio faltante. El panel aprobado muestra los doce criterios, la verificación humana y la firma profesional declarada.

## Límites

E8-C no implementa PKI real, validación normativa automática, cálculo estructural, dimensionamiento MEP, backend productivo, multiusuario, notificaciones, dashboards ni PDF. No toca BKH-1, E5, E6 ni E7.

Este reporte no declara E8-C `VERIFIED` ni declara E8 completo. La revisión independiente de archivos, outputs, manifest y hashes corresponde al verificador autorizado.

**Manus reporta evidencia; no emite el veredicto final.**

## References

[1]: file:///home/ubuntu/generador-familias/E8_CONTRATO_PROPUESTO_V1.md "E8 proposed contract"
[2]: file:///home/ubuntu/generador-familias/E8-A_REPORT.md "E8-A report"
[3]: file:///home/ubuntu/generador-familias/E8-B_REPORT.md "E8-B report"
