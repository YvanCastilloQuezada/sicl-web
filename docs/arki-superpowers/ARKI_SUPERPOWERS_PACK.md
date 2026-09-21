# ARKI Superpowers Pack 1.0

## Alcance

El paquete añade cinco capacidades transversales al **ARKI Unified Motor** sin crear un segundo cerebro: **SP-01 Consequence Radar**, **SP-02 Value of Information**, **SP-03 Design Divergence**, **SP-04 Architectural Debt** y **SP-05 Counterfactual Explorer**. Todas reciben el mismo estado de proyecto y devuelven una traza con evidencia, límites y revisión humana.

## Capacidad implementada

| ID | Capacidad | Salida actual | Límite explícito |
|---|---|---|---|
| SP-01 | Consequence Radar | Clasifica consecuencias como DIRECT, SECONDARY, TERTIARY, POSSIBLE o UNKNOWN en dominios de programa, flujos, costo, operación, seguridad y regulación. | La propagación es heurística; no sustituye simulación, cálculo o verificación normativa. |
| SP-02 | Value of Information | Ordena UNKNOWN por impacto esperado y propone la ruta de resolución. | El puntaje es una heurística de priorización, no una medición probabilística del proyecto. |
| SP-03 | Design Divergence | Compara alternativas por parti, topología, relaciones, circulación, sección, masa y estructura. | Determina diferencia arquitectónica; no decide cuál alternativa es mejor. |
| SP-04 | Architectural Debt | Registra beneficios inmediatos, pasivos futuros, horizonte, riesgo y mitigación de decisiones. | El riesgo requiere revisión profesional y evidencia del proyecto. |
| SP-05 | Counterfactual Explorer | Genera ocho escenarios AI_PROPOSED y los dominios que deben reevaluarse contra el baseline. | No ejecuta simulaciones ni afirma resultados que no hayan sido observados. |

## Flujo

```text
PROJECT STATE
    ├── CHANGE ───────────────> SP-01 CONSEQUENCE RADAR
    ├── UNKNOWN REGISTER ─────> SP-02 VALUE OF INFORMATION
    ├── ALTERNATIVES ─────────> SP-03 DESIGN DIVERGENCE
    ├── DECISIONS ────────────> SP-04 ARCHITECTURAL DEBT
    └── BASELINE DECISION ────> SP-05 COUNTERFACTUAL EXPLORER
                 ↓
          HUMAN AUTHORITY = FINAL
```

## Evidencia

La implementación está en `server/arkiSuperpowersPack.ts` y las pruebas focalizadas en `server/arkiSuperpowersPack.test.ts`. La capacidad se expone mediante `appRouter.superpowers.run`, protegida por sesión y validación de proyecto, y se registra en el Control Center como `ARKI-SUPERPOWERS-PACK-1.0`.

Las pruebas demuestran: ejecución de las cinco capacidades en una única traza `ARKI-UNIFIED-MOTOR-1.0`; clasificación completa de consecuencias; priorización de UNKNOWN; comparación de tres alternativas; registro de deuda arquitectónica; generación de ocho contrafactuales; y preservación de la condición `TRANSVERSAL_DECISION_SUPPORT_ONLY`.

## Integridad epistemológica

El paquete no convierte una inferencia en FACT, no promueve UNKNOWN, no declara cumplimiento RNE, no calcula estructura, no valida costos de mercado, no genera documentación ejecutiva nativa y no reemplaza al arquitecto, ingeniero, autoridad regulatoria o propietario. Las salidas que no tienen evidencia se marcan como `POSSIBLE`, `UNKNOWN`, `PARTIAL` o `AI_PROPOSED` y requieren revisión humana.

## Estado

`IMPLEMENTED / FOCUSED_TESTS_PASS / PASS_WITH_BOUNDS / HUMAN_REVIEW_REQUIRED`

La implementación se detiene después de estas cinco capacidades, conforme al paquete autorizado. Las ideas adicionales —Red Team ampliado, búsqueda por problema, diseño autónomo de experimentos y compilador arquitectónico— permanecen fuera de esta entrega y no se activan automáticamente.
