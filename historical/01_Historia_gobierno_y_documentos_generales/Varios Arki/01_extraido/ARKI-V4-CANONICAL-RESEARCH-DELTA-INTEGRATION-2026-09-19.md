# ARKI / ARQUI — Integración de la delta de investigación v4.0

**Fecha:** 2026-09-19  
**Workbook:** `ARKI_ARQUI_Canonical_Research_Delta_v4.0.xlsx`  
**SHA-256:** `03ad41f0092c5e92c3e2a66c16cee4d02b351010b9e2c9ca1e3825d12e5e6c99`  
**Baseline declarado por el workbook:** v3.0 + implementación local `54d0c2224256779825c2694f73c637c39c5aba65`

## Estado

```text
RESEARCH_DELTA_V4 = INTEGRATED_AS_CANDIDATE_KNOWLEDGE
FOCUSED_TESTS = PASS
TYPECHECK = PASS
FULL_REGRESSION = PASS
BUILD = PASS
GIT_DIFF_CHECK = PASS
PUSH = NO
PR = NO
MERGE = NO
DEPLOY = NO
HUMAN_AUTHORITY = PRESERVED
```

La v4.0 se trató como una **delta incremental de investigación**. No se eliminaron conocimientos v3.0 que no aparecen repetidos en el workbook. Tampoco se creó un segundo motor de geometría, topología, capacidades, regulación, aprendizaje o revisión humana.

## Alcance integrado

El workbook amplía el razonamiento hacia:

- estado multidimensional vinculado a un sujeto;
- escenarios con demanda, duración, secuencia, solapamiento y fases;
- grafos de dependencia de capacidades;
- topología activa derivada del modelo canónico;
- validación de concurrencia y contención;
- cobertura explícita de verificación;
- capacidad condicionada por sujeto, proceso, tiempo, estado, asignación y duración;
- redundancia y dominios de falla como conocimiento candidato;
- custodia, autoridad, observabilidad y handoff como relaciones o procesos;
- misión crítica, centros de datos y continuidad operativa como investigación no normativa peruana.

## Implementación realizada

Se agregó `client/src/components/arkiV4ResearchDelta.ts` como extensión de los contratos existentes. El módulo contiene:

- metadatos trazables del workbook;
- siete unidades de conocimiento candidato;
- estados de sujeto multidimensionales;
- perfiles temporales y escenarios;
- dependencias AND/OR de capacidades;
- topología activa derivada;
- demandas concurrentes;
- evaluación preliminar de redundancia;
- cobertura explícita;
- validadores y resumen de delta.

El almacén K4 se extendió mediante `fromV4KnowledgeUnit`. Los registros se insertan como `SOURCE_DERIVED` y `CANDIDATE`, con `noAutomaticDecision` y `noAutomaticWinner` activos.

## Controles preservados

1. Estado no se convierte en un enum universal.
2. La topología activa no duplica la geometría canónica.
3. Un enlace esencial no resuelto bloquea un PASS verificado salvo alterno válido.
4. Un objeto duplicado no se cuenta automáticamente como redundancia.
5. `UNKNOWN` y `NOT_EVALUATED` no son `PASS`.
6. PASS sin cobertura declarada no se presenta como verificación completa.
7. Tier I–IV, N+1 y 2N no se convierten en ley peruana ni verdad arquitectónica universal.
8. La resiliencia operativa no se infiere solamente de la topología de diseño.
9. La identidad de una persona bajo custodia permanece como identidad de actor; custodia es una relación.
10. La autoridad humana continúa siendo final.

## Pruebas focalizadas

Archivo: `client/src/components/arkiV4ResearchDelta.test.ts`

```text
9 tests passed
TypeScript check passed
```

Las pruebas cubren:

- contrato incremental y ausencia de motor paralelo;
- estado sujeto–dimensión;
- topología activa derivada;
- dependencias esenciales y alternos válidos;
- demanda concurrente;
- redundancia, independencia y endurance;
- cobertura y estado unresolved;
- entrada al almacén K4 como candidato;
- resumen cuantitativo de la delta.

## Estado de madurez

La investigación v4.0 es **enseñable y estructurada**, pero no todo está implementado como capacidad productiva. El workbook distingue correctamente:

```text
RESEARCHED
≠
TEACHABLE
≠
IMPLEMENTED
≠
PROJECT_VERIFIED
≠
PROFESSIONALLY_CONFIRMED
```

Las áreas marcadas como `PARTIAL`, `DERIVED_VIEW` o `DATA_ONLY` no deben presentarse como capacidades completas.

## Resultado de la validación completa

La regresión completa de Vitest, el typecheck, el build y `git diff --check` finalizaron con código de salida 0. El build emitió únicamente una advertencia no bloqueante sobre algunos chunks mayores de 500 kB.

La integración del workbook, los documentos y el módulo candidato en la colección editorial también quedó completada. Permanecen como trabajo futuro la revisión humana del alcance de las unidades candidatas y la eventual ampliación de concurrencia y cobertura sobre los módulos existentes.

## Pausa solicitada

La colección puede quedar en pausa después de las verificaciones anteriores. La pausa no congela ni declara cerrada la investigación v4.0; conserva el estado incremental para retomarlo posteriormente.
