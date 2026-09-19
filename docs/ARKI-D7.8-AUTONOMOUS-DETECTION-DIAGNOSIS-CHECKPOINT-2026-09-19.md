# ARKI — D7.6 → D7.8 Autonomous Detection, Diagnosis & Novel Observation Checkpoint

## Estado final

| Fase | Resultado | Evidencia |
|---|---|---|
| D7.6 / L2 — Autonomous deficit detection | **DEMONSTRATED** | Detector relacional; déficit no suministrado; falsos controles y UNKNOWN |
| D7.7 / L3 — Autonomous cause diagnosis | **DEMONSTRATED** | Hipótesis causales, discriminación, hipótesis no apoyadas y UNKNOWN |
| D7.8 — Novel observation | **NO_VALID_NOVEL_OBSERVATION** | K0 congelado; efectos clasificados como ejecución directa |
| D7.9 — Persistence / reinitialization | **NOT_EXECUTED / STOPPED** | Requiere candidato de aprendizaje legítimo |
| D8.0 — Transfer / generalization | **NOT_EXECUTED / STOPPED** | Requiere K1 persistido y recuperable |

## D7.6 — Detección relacional

ARKI recibió únicamente un estado de proyecto compuesto por actores, actividades, journeys, flujos, relaciones, capacidades, controles, dependencias y evidencia. No recibió un campo `DEFICIT = X` ni una respuesta esperada oculta.

El detector comparó relaciones requeridas frente a relaciones disponibles, demanda frente a capacidad, journeys requeridos frente a topología activa, controles requeridos frente a controles activos, dependencias requeridas frente a dependencias disponibles y cobertura de evidencia.

El resultado detectó déficits genuinos de journey, flujo, relación y dependencia. También preservó una condición con evidencia insuficiente como `UNKNOWN / INSUFFICIENT_EVIDENCE`.

Los controles pasaron:

- **Falso positivo:** una configuración inusual pero funcional no fue clasificada como déficit.
- **Falso negativo:** un déficit relacional no se dedujo sólo por geometría superficial.
- **UNKNOWN:** la ausencia de evidencia no se convirtió en PASS ni FAIL.
- **Anti-dispatch:** no se utilizó el nombre de una tipología para seleccionar el detector.
- **Anti-leakage:** la respuesta no fue introducida en el runtime como fixture semántico.

## D7.7 — Diagnóstico causal

Los déficits detectados por D7.6 se utilizaron como entrada, pero las causas no se suministraron. ARKI generó hipótesis de relación/topología, capacidad y geometría.

El diagnóstico discriminó hipótesis apoyadas y no apoyadas cuando existió evidencia suficiente. Retuvo hipótesis geométricas como `UNKNOWN` cuando la evidencia relacional no permitía afirmar que la geometría fuera la causa. No se promovieron causas a `VERIFIED`.

Se preservaron las siguientes distinciones:

```text
OBSERVED CONDITION ≠ DEFICIT
DEFICIT ≠ CAUSE
CAUSE ≠ STRATEGY
DETECTION ≠ DIAGNOSIS
FAILURE LOCATION ≠ CAUSE LOCATION
```

El modelo permite multicausalidad y conserva una ruta de resolución para causas todavía indeterminadas.

## D7.8 — Novedad y aprendizaje

Antes de la ejecución se congeló K0. El snapshot incluyó el registro estratégico D6.2, la síntesis contextual D6.2R, Design Moves, mutación S2, reevaluación D7.1, comparación D7.2 y causas apoyadas por D7.7.

Los efectos observados se clasificaron como:

```text
DIRECT_EXECUTION_RESULT
```

No se clasificaron como `NOVEL_CANDIDATE` porque eran efectos previstos por el runtime y por K0. Crear K1 en estas condiciones habría sido una falsa afirmación de aprendizaje.

Resultado:

```text
K0 = FROZEN / RECORDED
NOVEL OBSERVATION = NONE VALID
LEARNING CANDIDATE = NONE
K1 = NOT CREATED
PERSISTENCE = STOPPED
```

## Madurez independiente

| Nivel | Estado |
|---|---|
| L0 Receives | DEMONSTRATED |
| L1 Represents | DEMONSTRATED |
| L2 Detects | **DEMONSTRATED** |
| L3 Diagnoses | **DEMONSTRATED** |
| L4 Evaluates | DEMONSTRATED |
| L5 Generates strategies | DEMONSTRATED |
| L6 Generates candidates | DEMONSTRATED |
| L7 Mutates / synthesizes | DEMONSTRATED_BOUNDED_S2 |
| L8 Reevaluates | DEMONSTRATED |
| L9 Compares | DEMONSTRATED |
| L10 Generalizes | PARTIAL |

Aunque L2 y L3 alcanzaron demostración controlada, esto no constituye todavía aprendizaje arquitectónico persistente ni conocimiento generalizado.

## Detención válida

La detención en D7.8 es obligatoria y correcta. D7.9 no puede ejecutarse sin un candidato de aprendizaje legítimo que haya sobrevivido a un desafío de repetición, variante y contraejemplo.

D8.0 tampoco puede ejecutarse porque todavía no existe un K1 persistido, recuperado desde una inicialización fresca y usado en un caso estructuralmente nuevo.

## Gobernanza

```text
HUMAN_AUTHORITY = PRESERVED
AUTOMATIC_WINNER = NONE
AUTOMATIC_DECISION = NONE
AUTOMATIC_CANONIZATION = NONE
PROFESSIONAL_CERTIFICATION = NOT_CLAIMED
```

## Próximo gate real

La siguiente evidencia necesaria es una observación arquitectónicamente significativa que no esté contenida en K0, no sea suministrada como respuesta, no sea una simple consecuencia directa de la mutación y pueda ser desafiada con un caso repetido, una variante y un contraejemplo. Sólo después se podrá evaluar K1 y persistencia.
