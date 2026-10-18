# SICL 0.2.4 — Decision Pressure Test Evidence

## Estado

`SICL 0.2.4 — Functional Technical Prototype / Semantic Core Alpha`

La versión 0.2.3 aplica endurecimiento semántico quirúrgico sobre la base 0.2.1. No rediseña la arquitectura por capas ni introduce IA, agentes, GIS, BIM, optimización avanzada, causalidad o decisión autónoma.

## Instalación

```text
python3 -m pip install -e '.[dev]'
```

Resultado: instalación editable exitosa.

## Tests

```text
pytest -q
```

Resultado actual: **22 passed**.

La suite cubre:

- tipos semánticos y contratos de respuesta;
- normalización y validación de restricciones;
- creación y modificación de proyectos;
- persistencia y recuperación entre sesiones;
- separación entre `Recommendation` y `Decision`;
- independencia del dominio respecto de SQLite;
- parser con argumentos entrecomillados mediante `shlex`;
- evaluación determinista `TOTAL_COST`;
- comparación con dirección `MINIMIZE`/`MAXIMIZE`, ganador y diferencia;
- recomendación analítica vinculada a una comparación explícita;
- decisión humana explícita;
- trazabilidad detallada;
- recalculo después de cambiar un input y recuperación posterior;
- rechazo de recomendaciones que intentan adivinar una comparación;
- rechazo de comparaciones ambiguas sin Evaluation IDs explícitos;
- persistencia append-only de eventos;
- diferencia entre constraint declarada y constraint validada;
- persistencia separada de `evaluation_version` y `contract_version`;
- Evidence identificable con referencia de fuente mínima y recuperación entre sesiones;
- comparación multicriterio con detección de dominancia;
- detección de TradeOff sin inventar un ganador;
- rechazo de comparación multicriterio con datos insuficientes;
- separación entre rendimiento y factibilidad declarada.

## Flujo semántico verificable

```text
Alternative data
  → Method
  → Evaluation
  → Comparison
  → Recommendation
  → Human Decision
  → Traceability
```

Método determinista implementado:

```text
TOTAL_COST = area × unit_cost
```

Caso:

```text
Alternative A: area=1000, unit_cost=850 → 850000
Alternative B: area=1000, unit_cost=920 → 920000
Criterion: COST
Direction: MINIMIZE
Winner: A
Difference: 70000
Recommendation: A
Human Decision: B
```

El hecho de que la recomendación analítica y la decisión humana puedan diferir está probado explícitamente.

## Decision Pressure Test

```text
python3 examples/decision_pressure_slice.py
```

Resultado:

```text
SICL 0.2.4 Decision Pressure Test: OK
Status: TRADE_OFF
Non-dominated alternatives: A, B, C
Recommendation=A; based_on=MCMP-...; Human Decision=B
No automatic winner was invented.
```

El caso usa tres objetivos sintéticos —`COST`, `PROFITABILITY` y `ATTRACTIVENESS`— y demuestra que no existe un ganador universal cuando las alternativas intercambian ventajas y sacrificios.

## Vertical slice UPAO-001

```text
python3 examples/upao_vertical_slice.py
```

Resultado:

```text
UPAO-001 vertical slice 0.2.3: OK
Evaluation A: 1000 × 850 = 850000
Evaluation B: 1000 × 920 = 920000
Comparison: winner=A, direction=MINIMIZE, difference=70000
Recommendation=A; based_on=CMP-...; Human Decision=B
Traceability chain: Evaluation → Comparison → Recommendation → Human Decision
```

Los datos son sintéticos e ilustrativos y no se presentan como datos reales de UPAO.

## CLI instalada

La entrada instalada `sicl` fue probada con creación, estado y salida:

```text
OK: PROJECT_CREATED
OK: STATUS
OK: EXIT
```

El parser acepta argumentos entrecomillados, por ejemplo:

```text
/PROJECT CREATE UPAO-001 "UPAO PLAZA CENTER"
/ALTERNATIVE CREATE A "Base Alternative" area=1000 unit_cost=850
```

## Correcciones realizadas

1. Se sustituyó `raw.split()` por `shlex.split()` para soportar quoting real.
2. Se diferenciaron errores de argumento, persistencia, aplicación e internos.
3. Se añadió evaluación determinista para `TOTAL_COST`, `COST_PER_AREA` y `RATIO`.
4. Se añadió comparación semántica con criterio, dirección, ganador y diferencia.
5. Se vinculó una recomendación analítica con la comparación que la sustenta.
6. Se distinguió explícitamente `decision_type=HUMAN`.
7. Se amplió `TRACEABILITY SHOW` para devolver evaluaciones, comparaciones, recomendaciones y decisiones, no solo un contador de eventos.
8. Se añadió recalculo verificable después de cambiar inputs.
9. Se añadió `.gitignore` y se eliminaron `debug_save.py` y artefactos de prueba del repositorio.
10. Se actualizó el vertical slice al flujo determinista de 0.2.3.

## Estado honesto y límites

La trazabilidad es ahora operacional y estructurada, pero todavía no constituye event sourcing. El almacenamiento de eventos sí conserva los eventos existentes y agrega únicamente eventos nuevos. Los resultados declarados antiguos se conservan únicamente por compatibilidad y se identifican como `DECLARED_RESULT`; no se consideran evaluación determinista.

El MVP no demuestra inteligencia espacial avanzada, uso de datos reales, autoridad profesional autónoma, integración GIS/BIM, perfiles profesionales completos, lenguaje natural contractual, optimización avanzada, razonamiento causal ni Digital Twin.

La siguiente etapa correcta es una auditoría de presión semántica de SICL 0.2.4, no SICL 0.3 todavía.
