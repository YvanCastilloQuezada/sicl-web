# ARKI — P8.2 Applicability, Sufficiency & Legitimate Non-Plurality
## Semantic Gate Refinement and P8.1 Replay

**Fecha:** 2026-09-19  
**Proyecto:** `P81-CLEAN-CONTROLLED-PROJECT`  
**Modo:** focused architectural reasoning refinement  
**Fuente:** `PASTED-CONTENT-486-V1`  
**Estado:** `PASS_WITH_EXTERNAL_DEPENDENCIES`

## 1. Propósito

P8.2 no reconstruye P8.1 ni amplía el conocimiento estratégico. Reutiliza el mismo proyecto limpio, los mismos hechos y la arquitectura D6/D7 existente. Su función es distinguir entre una falla real de capacidad, una operación legítimamente no aplicable, evidencia insuficiente, dependencia especialista, decisión humana pendiente y una única opción factible.

UPAO-001 continúa excluido del runtime y conserva únicamente el estado `HISTORICAL_CONTAMINATED_INTEGRATION_BENCHMARK`.

## 2. Replay antes y después

| Gate | P8.1 antes | P8.2 después | Evidencia |
|---|---|---|---|
| D6.2 strategy synthesis | `BLOCKED` | `SINGLE_FEASIBLE_OPTION` | Se recuperaron múltiples estrategias; una quedó aplicable y las demás fueron rechazadas con razones explícitas |
| D7.2 comparison | `BLOCKED` | `NOT_APPLICABLE` | Solo existió un candidato factible; no se fabricó otro para cumplir un umbral artificial |
| Multidisciplinary coordination | `BLOCKED` | `SPECIALIST_INPUT_REQUIRED` | La capacidad de coordinación existe, pero falta el modelo específico y los datos de especialistas |
| Performance | `PASS_WITH_OBSERVATIONS` | `PARTIAL / BOUNDED_PROXY_EVIDENCE` | La evidencia es proxy; no se convirtió en desempeño medido ni cumplimiento |
| Human decision | `PENDING_HUMAN_DECISION` | `HUMAN_DECISION_REQUIRED` | El sistema alcanzó un límite legítimo de autoridad arquitectónica |

## 3. D6.2 — pluralidad estratégica

El registro estratégico contenía cinco estrategias potenciales recuperadas. El runtime retuvo una estrategia topológica aplicable: `SK-REROUTE-TOPOLOGICAL`. Las demás fueron conservadas como rechazadas con sus razones de incompatibilidad.

```text
potential strategy space = 5
retrieved strategies = 5
applicable strategies = 1
rejected strategies = 4
unknown strategies = preserved
plurality structurally warranted = FALSE for this state
result = SINGLE_FEASIBLE_OPTION
termination = SINGLE_FEASIBLE_OPTION
```

Esto no se clasifica como generación fallida porque el sistema recuperó y evaluó el espacio estratégico completo disponible. Una estrategia aplicable no equivale a una falla de inteligencia ni obliga a inventar alternativas.

## 4. D7.2 — comparación

El circuito produjo un único candidato factible. Por ello la comparación multiopción no era aplicable en ese estado.

```text
feasible candidates = 1
comparison required = NO
comparison capability failure = NO
result = NOT_APPLICABLE
termination = LEGITIMATE_NOT_APPLICABLE
automatic winner = NONE
```

El candidato continúa siendo una hipótesis sujeta a revisión humana. No se creó ganador, recomendación ni decisión automática.

## 5. Coordinación especialista

La coordinación no se marcó como falla del sistema. El puente existe, pero requiere entradas que no fueron suministradas:

- modelo multidisciplinario específico del proyecto;
- registros de estructura, MEP, seguridad contra incendios y otras disciplinas;
- cálculos y criterios de especialistas;
- revisión profesional independiente.

Estado correcto: `SPECIALIST_INPUT_REQUIRED`.

## 6. Desempeño

La única evidencia del replay fue de clase `PROXY`. Se conserva como observación analítica acotada. No se declara medición real, validación independiente, cumplimiento normativo ni desempeño verificado.

Estado correcto: `PARTIAL / BOUNDED_PROXY_EVIDENCE`.

## 7. Autoridad humana

El sistema alcanzó una frontera legítima de decisión arquitectónica. Puede presentar opciones, trade-offs, evidencia, incertidumbres y consecuencias; no puede registrar una decisión aceptada sin acción humana explícita.

Estado correcto: `HUMAN_DECISION_REQUIRED`.

## 8. Trazabilidad semántica

El replay conserva la trazabilidad derivativa y la provenance. La traza integrada heredada de P8.1 permanece clasificada como `STRUCTURAL_ONLY` porque el builder histórico aún exige etapas canónicas con nombres más estrechos que el recorrido extendido. P8.2 no falsifica esta condición ni la convierte en traza semántica completa.

Esto constituye una observación de implementación pendiente, no una razón para relabelar falsamente el resultado como completo.

## 9. Resultado de aceptación P8.2

```text
P8.2 = PASS

D6.2 = SINGLE_FEASIBLE_OPTION
D7.2 = NOT_APPLICABLE
COORDINATION = SPECIALIST_INPUT_REQUIRED
PERFORMANCE = PARTIAL / BOUNDED_PROXY_EVIDENCE
HUMAN_DECISION = HUMAN_DECISION_REQUIRED
P8.1 = PRESERVED
K1 = NOT_CREATED
AUTOMATIC_WINNER = NONE
FALSE_LEARNING = NOT_PRESENT
SECOND_ENGINE = NOT_CREATED
```

Estado de proyecto resultante:

```text
INTEGRATED_CHAIN_DEMONSTRATED_WITH_EXTERNAL_DEPENDENCIES
```

La palabra **demonstrated** describe la cadena computacional que efectivamente atravesó los puentes. Las dependencias externas siguen impidiendo declarar el proyecto como completamente verificado o profesionalmente aprobado.

## 10. Casos adversariales ejecutados

| Caso | Resultado correcto |
|---|---|
| Varias estrategias estructuralmente necesarias, generador devuelve cero | `CAPABILITY_FAILURE` |
| Varias estrategias recuperadas, una aplicable tras filtros legítimos | `SINGLE_FEASIBLE_OPTION` |
| Varias alternativas factibles, comparador no puede operar | `CAPABILITY_FAILURE` |
| Una sola alternativa factible | `NOT_APPLICABLE` |
| Coordinación disponible, datos especialistas ausentes | `SPECIALIST_INPUT_REQUIRED` |
| Representación requerida inexistente | `CAPABILITY_FAILURE` |
| Trade-off arquitectónico sin selección humana | `HUMAN_DECISION_REQUIRED` |

Estos casos prueban que los estados no son simples renombrados de `BLOCKED`.

## 11. Validación

```text
P8.2 focused tests = 6 passed
P8.1 preservation tests = 3 passed
TypeScript = PASS
```

La regresión completa, build y `git diff --check` deben completarse antes de sincronizar el commit con GitHub.

## 12. Límites preservados

P8.2 no crea K1, no canoniza conocimiento, no crea un score universal, no agrega estrategias artificiales, no fabrica evidencia multidisciplinaria, no toma decisiones humanas, no declara cumplimiento normativo y no convierte un proxy en desempeño verificado.
