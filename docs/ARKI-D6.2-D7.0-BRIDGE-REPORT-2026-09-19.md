# ARKI — Puente D6.2 → D7.0
## General Strategy Synthesis → Candidate Synthesis → Closed-Loop Reasoning

## Estado final

```text
D6.2 GATE = BLOCKED
D6.3 GATE = NOT_EXECUTED_BY_GOVERNANCE
D6.4 GATE = NOT_EXECUTED_BY_GOVERNANCE
D6.5 GATE = NOT_EXECUTED_BY_GOVERNANCE
D7.0 CHECKPOINT = BLOCKED_AT_D6.2
```

La macroorden fue ejecutada hasta el primer gate que no pudo superarse. La detención es válida y obligatoria: continuar a D6.3, D6.4, D6.5 o D7.0 habría presentado una capacidad de generación que el runtime actual no demostró.

## Baseline real

```text
REPOSITORY = YvanCastilloQuezada/sicl-web
BRANCH = feat/spatial-pilot-media-studio-v1
BASELINE_SHA = 013d63977e4f60d3507d3e128d263878cd46d865
REMOTE = origin/feat/spatial-pilot-media-studio-v1
D6.1 = PARTIAL / PASS_WITH_OBSERVATIONS
```

D6.1 permanece sin reescritura: `STRATEGIES GENERATED = 0`, `CANDIDATES GENERATED = 0`, `MUTATIONS = 0`, `K1 PROMOTIONS = 0`, `GENERALIZATION = NOT_DEMONSTRATED`.

## D6.2 — Intento controlado

La prueba se ejecutó con un problema estructuralmente descrito y:

```text
STRATEGIES PROVIDED = 0
STRATEGIES RETRIEVED = 0
STRATEGIES GENERATED = 0
STRATEGIES REJECTED = 1 fixture-specific repair answer
PROVENANCE = TRACEABLE
```

El problema utilizado no incluía una solución de restaurante, hospital, laboratorio, espacio público ni uso mixto. Tampoco se añadió un nombre de tipología para seleccionar una respuesta por dispatch oculto.

### Resultado del gate

D6.2 exige al menos dos familias estratégicas genuinamente distintas cuando el problema lo permite, con efecto requerido, precondiciones, autoridad, mutabilidad, dependencias, unknowns y razones de rechazo. El runtime actual tiene `V6StrategyFamily` y `V6DesignMove`, pero no tiene:

- registro de conocimiento de estrategias con efectos y precondiciones;
- procedimiento general de aplicabilidad;
- síntesis de estrategias no suministradas;
- provenance de una estrategia generada;
- rechazo explicable de estrategias potenciales por estado, autoridad o hard constraints.

Por tanto:

```text
D6.2 = BLOCKED
L5 GENERATES STRATEGIES = NOT_DEMONSTRATED
```

### Brecha mínima general

La brecha no se debe resolver con `RestaurantRepairEngine`, `HospitalRepairEngine`, `LaboratoryRepairEngine`, `PublicRealmRepairEngine` ni dispatch equivalente. La extensión mínima general requerida es:

```text
CAUSE
+ REQUIRED EFFECT
+ CONDITIONS
+ STATE / SCENARIO / TIME
+ MUTABILITY
+ AUTHORITY
+ HARD CONSTRAINTS
+ STRATEGY KNOWLEDGE
→ APPLICABLE STRATEGY SPACE
```

Cada registro estratégico deberá conservar familia, intención, efectos potenciales, precondiciones, condiciones prohibidas, tipos de objetivo, autoridad, dependencias, posibles efectos secundarios, unknown effects y provenance. La estrategia potencial no será todavía una estrategia válida ni seleccionada.

## Gates no ejecutados

| Gate | Estado | Motivo |
|---|---|---|
| D6.3 Candidate Synthesis | `NOT_EXECUTED_BY_GOVERNANCE` | Requiere D6.2 PASS. No se generaron estrategias desde las cuales generar candidatos. |
| D6.4 Closed Loop | `NOT_EXECUTED_BY_GOVERNANCE` | Requiere candidatos y mutación controlada. Ejecutarlo sería fabricar evidencia. |
| D6.5 Transfer/Learning/Persistence | `NOT_EXECUTED_BY_GOVERNANCE` | Requiere D6.4 PASS. D6.1 ya documentó restraint, pero no persistence ni learning. |
| D7.0 Canonical Checkpoint | `BLOCKED_AT_D6.2` | D7 no puede reclamar razonamiento general con L5/L6 no demostrados. |

## Matriz de capacidades

| Nivel | Estado | Evidencia |
|---|---|---|
| L0 Receives | `DEMONSTRATED` | Recibe, registra y preserva el delta. |
| L1 Represents | `DEMONSTRATED` | Representa problema, contratos, unknowns y provenance. |
| L2 Detects | `PARTIAL` | Detecta la brecha general y el riesgo de hardcoding. |
| L3 Diagnoses | `PARTIAL` | Formula hipótesis, sin causas verificadas para una síntesis nueva. |
| L4 Evaluates | `DEMONSTRATED` | Aplica gates, autoridad, epistemología y restraint. |
| L5 Generates strategies | `NOT_DEMONSTRATED` | Cero estrategias generadas con input de estrategias igual a cero. |
| L6 Generates candidates | `NOT_DEMONSTRATED` | Bloqueado por D6.2. |
| L7 Mutates/synthesizes | `NOT_DEMONSTRATED` | Bloqueado por D6.3. |
| L8 Reevaluates | `NOT_DEMONSTRATED` | Bloqueado por D6.4. |
| L9 Compares | `PARTIAL` | Comparación de contratos y transferencias previa; no comparación de candidatos generados. |
| L10 Generalizes | `NOT_DEMONSTRATED` | Bloqueado; D6.1 no demostró persistencia ni generalización. |

## Propagación triple

El resultado negativo se propagó a las tres superficies sin inflación epistemológica:

```text
ARKI RUNTIME = D6.2 BLOCKED / L5 NOT_DEMONSTRATED
CURRICULUM = RESEARCHED / TEACHABLE_AS_LIMIT / NOT_IMPLEMENTED_AS_GENERAL_GENERATION
DIGITAL BOOK = NEGATIVE RESULT PRESERVED / HUMAN_REVIEW_REQUIRED
CONSISTENCY = PASS
```

El currículo debe enseñar ahora la diferencia entre `V6StrategyFamily` como vocabulario contractual y una estrategia realmente generada por razonamiento general. El Libro Vivo conserva el fallo D6.2 y no lo elimina.

## Validación

```text
D6.2 FOCUSED TESTS = 14/14 PASS
V6.0 CONTRACT TESTS = PASS
V6.1 CONTROLLED PROOF TESTS = PASS
TYPECHECK = PASS
ANTI-HARDCODING CONTROL = PASS
BASELINE IMMUTABILITY = PASS
NO SECOND ENGINE = PASS
```

La regresión y el build completos de D6.1 habían pasado antes de esta extensión. La extensión D6.2 no modifica geometría ni muta el `CanonicalBuildingModel`.

## Estado epistemológico final

```text
ARCHITECTURAL KNOWLEDGE ≠ SYSTEM CAPABILITY KNOWLEDGE
KNOWLEDGE ABOUT ARKI ≠ KNOWLEDGE ABOUT ARCHITECTURE
D6.2 = BLOCKED
D7 GENERAL REASONING = NOT_CLAIMED
AUTO-CANONIZATION = PROHIBITED
AUTO-WINNER = PROHIBITED
HUMAN AUTHORITY = PRESERVED
```

## Próximo paso permitido

Sólo queda autorizado diseñar e implementar la **mínima extensión general** de conocimiento estratégico y aplicabilidad, reutilizando los contratos v6.0. Esa extensión deberá volver a ejecutar D6.2 con cero estrategias suministradas. Hasta que ese gate pase, no se debe avanzar a síntesis de candidatos, mutación cerrada, aprendizaje persistente ni D7.0.
