# SiMS-DeI — ARQUI
# 12 Facultades de un Arquitecto de Clase Mundial

## Resultado

Se implementó un modelo canónico que organiza doce facultades de desempeño arquitectónico. El modelo no convierte a ARQUI en arquitecto certificado ni asigna un ganador automático. Su función es reunir evidencia de diseño, identificar fortalezas, exponer preguntas abiertas y mantener la autoridad humana.

```text
WORLD_CLASS_FACULTIES = 12
INTEGRATED_SURFACES = A21–A27
HUMAN_AUTHORITY = PRESERVED
AUTOMATIC_CERTIFICATION = FORBIDDEN
AUTOMATIC_WINNER = FORBIDDEN
AUTOMATIC_ARCHITECT_CREDENTIAL = FORBIDDEN
```

## Las 12 facultades

| Facultad | Función | Superficies reutilizadas |
|---|---|---|
| Juicio arquitectónico | Relacionar belleza, carácter, proporción, utilidad, dignidad, complejidad y excelencia. | A16, A26 |
| Dominio tipológico | Adaptar programa, flujos, riesgos y experiencia a cada tipo de edificio. | A24, A26, A27 |
| Razonamiento espacial | Conectar programa, espacios, adyacencias, privacidad, jerarquía, circulación y forma. | A13, A21, A24 |
| Coherencia multinivel | Mantener alineamiento, apilamiento, núcleos y continuidad entre niveles. | A22, A23, A24 |
| Accesibilidad universal | Considerar diversidad corporal, sensorial, cognitiva y clínica. | A20-P2, A27 |
| Seguridad y resiliencia | Razonar sobre incendio, evacuación, redundancia, humo, sismo y continuidad operativa. | A20-P3R, A25, A27 |
| Materialidad y ciclo de vida | Comparar desempeño, carbono, durabilidad, mantenimiento, circularidad y disponibilidad. | A25, A26, A27 |
| Economía y justicia | Buscar excelencia a costo razonable y hacer visibles los sacrificios. | A16, A21, A26 |
| Evidencia y normativa | Separar hechos, fuentes, normas, observaciones, hipótesis, cálculos y unknowns. | A15, A18, A20-P3R, A27 |
| Cultura y contexto | Relacionar clima, territorio, historia, memoria, identidad y recursos locales. | A11, A12, A25, A26 |
| Crítica y autocrítica | Comparar alternativas, detectar contradicciones y revisar hipótesis. | A16, A17, A19, A21 |
| Comunicación profesional | Explicar decisiones, incertidumbres, métricas y consecuencias a equipos y autoridades. | A15, A16, A21, A27 |

## Modelo de evaluación

Cada facultad produce un estado explícito:

```text
SUPPORTED
PARTIAL
REQUIRES_EVIDENCE
CONFLICTING
NOT_ASSESSED
```

Cada resultado conserva:

```text
facultyId
evidenceRefs
strengths
openQuestions
humanReviewRequired = true
```

La evaluación integrada devuelve una lectura de preparación, no una calificación profesional:

```text
PARTIAL_FOUNDATION
REQUIRES_PROJECT_EVIDENCE
CONFLICTING
```

## Tensiones que ARQUI debe razonar

La excelencia no consiste en maximizar una única variable. El modelo deja visibles las tensiones entre belleza y costo, complejidad formal y constructibilidad, accesibilidad y eficiencia de circulación, control de infecciones y apertura, reducción de carbono y durabilidad hospitalaria, seguridad y dignidad, e identidad local y legibilidad universal.

Estas tensiones son preguntas de diseño. No se resuelven ocultándolas ni convirtiéndolas automáticamente en una decisión.

## Integración con el caso hospitalario

El modelo reutiliza la evidencia A27 del proyecto hospitalario `HOSPITAL-001`. La información disponible incluye unidades de emergencia, imágenes, cuidados intensivos, cirugía y servicios públicos; rutas accesibles pendientes de revisión; evacuación conceptual; pacientes móviles, limitados y dependientes de cama; y candidatos materiales de menor carbono.

La salida correcta es una base parcial para deliberación profesional. No es una aprobación normativa, una certificación contra incendios, una firma médica, una especificación estructural ni un título de arquitecto.

## Controles de seguridad

```text
AUTHOR ≠ AGENT
PRECEDENT ≠ REQUIREMENT
HYPOTHESIS ≠ FACT
PARTIAL ≠ APPROVED
COMPLIANCE_STATUS_NOT_ASSESSED ≠ COMPLIANT
MODEL_READINESS ≠ PROFESSIONAL_LICENSE
```

La autoridad humana permanece superior al modelo. Toda facultad requiere revisión humana y la evidencia faltante se mantiene visible.

## Validación

```text
FOCUSED_TEST_FILES = 1 passed
FOCUSED_TESTS = 4 passed
WEB_FULL_TEST_FILES = 57 passed
WEB_FULL_TESTS = 293 passed
TYPECHECK = PASS
BUILD = PASS
GIT_DIFF_CHECK = PASS
CORE_CHANGED = NO
CORE_STATUS = CLEAN
```

El build conserva una advertencia no bloqueante sobre chunks grandes. No se modificó el Core ni se añadió una dependencia nueva.

## Artefactos

```text
client/src/components/worldClassArchitectFaculties.ts
client/src/components/worldClassArchitectFaculties.test.ts
docs/ARQUI-WORLD-CLASS-ARCHITECT-12-FACULTIES-FINAL.md
```
