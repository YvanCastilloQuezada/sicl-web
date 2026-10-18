# ARKI --- Informe de avance técnico

## H-001 cerrado y H-002 en ejecución

**Fecha:** 26 de septiembre de 2026\
**Responsable operativo:** ChatGPT\
**Autoridad del proyecto:** Yvan Castillo

## 1. Estado ejecutivo

El trabajo continúa bajo el protocolo autorizado de endurecimiento
iterativo:

-   cada componente se revisa al menos dos veces desde su base;
-   todo punto débil detectado vuelve a ser atacado;
-   un punto puede ser reexaminado hasta **10 veces**;
-   si después del décimo examen persiste, se registra explícitamente
    como riesgo/deuda pendiente;
-   ningún `PASS` se concede sólo porque exista código o documentación;
-   se mantiene la separación entre `IMPLEMENTED`, `RUNTIME_EVIDENCE`,
    `E2E_VERIFIED`, `UNKNOWN` y riesgos pendientes.

No se avanza mediante cambios automáticos destructivos ni se elimina
Human Authority.

------------------------------------------------------------------------

# 2. H-001 --- Derivation Integrity Foundation

## Estado

**REFORZADO --- EXAMEN 10 COMPLETADO**

H-001 establece la capacidad de ARKI para demostrar de dónde proviene un
resultado mediante referencias versionadas, relaciones tipadas y
registros de derivación.

Componentes consolidados:

-   `VersionedRef`
-   `TypedRelation`
-   `DerivationRecord`
-   `DerivationLedger`
-   recorrido `WHY`
-   detección de dependencia ausente
-   detección de versión distinta
-   detección de contenido distinto bajo la misma identidad/versionado
-   serialización determinista
-   `contractVersion`
-   lectura histórica fail-closed
-   aislamiento por proyecto
-   canonicalización de dependencias y assumptions

## Resultado de regresión alcanzado

``` text
322 passed
0 failed

compileall = PASS
```

Dos archivos de pruebas IFC permanecen fuera de la suite reproducible
por ausencia de `ifcopenshell`. La dependencia no fue instalada
silenciosamente.

## Correcciones importantes encontradas durante el endurecimiento

La primera implementación permitía ambigüedad en la dirección semántica
de relaciones como `COMPUTED_FROM`. Se fijó la convención:

``` text
OUTPUT → RELATION → DEPENDENCY

Area COMPUTED_FROM Geometry
Claim SUPPORTED_BY Evidence
```

También fueron endurecidos:

-   outputs duplicados;
-   IDs de derivación contradictorios;
-   inputs duplicados;
-   relaciones duplicadas;
-   output usado como input de sí mismo;
-   eventos históricos mal formados;
-   conflictos históricos;
-   repetición idempotente;
-   canonicalización independiente del orden;
-   drift de esquema;
-   versionado explícito del contrato.

## Riesgos H-001 que permanecen registrados

### P1 --- Concurrent writer uniqueness

**Estado:** `KNOWN_RISK / DEFERRED`

La unicidad lógica de una derivación para `output@version` todavía no
está garantizada atómicamente frente a escritores concurrentes. Existe
riesgo TOCTOU.

### P2 --- Event Store query scaling

**Estado:** `PERFORMANCE_DEBT / DEFERRED`

Las consultas reconstruyen información desde el Event Store. Es correcto
para el alcance actual, pero no es la solución final para un grafo
derivacional grande.

### P3 --- Relation ontology completeness

**Estado:** `SEMANTIC_SCOPE_LIMIT / DEFERRED`

Existe separación básica de dominios y relaciones, pero todavía no una
ontología arquitectónica exhaustiva de pares entidad-relación.

### P4 --- Fingerprint semantics

**Estado:** `NAMING_SEMANTIC_DEBT / DEFERRED`

Debe mantenerse diferenciada la identidad criptográfica del registro
respecto de fingerprints específicos de inputs/metodología.

### P5 --- IFC

**Estado:** `ENVIRONMENT_BLOCKED`

La validación IFC completa requiere el entorno/dependencia
correspondiente.

------------------------------------------------------------------------

# 3. H-002 --- Impact Analysis / WHAT-IF

## Objetivo

Construir sobre H-001 la primera capacidad transversal para responder:

> Si cambia exactamente esta entidad/version, ¿qué resultados
> registrados dependen directa o transitivamente de ella?

Regla fundamental:

``` text
IMPACT DETECTED ≠ CHANGE EXECUTED
```

H-002 permanece **read-only**.

No debe:

-   invalidar automáticamente;
-   recomputar;
-   mutar geometría;
-   modificar BIM;
-   alterar decisiones;
-   inferir automáticamente `STALE`;
-   saltarse Human Authority.

## Primera pasada

Se implementó un `ImpactAnalyzer` con recorrido inverso de las
derivaciones.

Caso base:

``` text
Geometry G1@3
    ↓
RoomArea A1@1
    ↓
Quantity Q1@2
    ↓
Cost C1@4
```

Ante:

``` text
WHAT IF Geometry G1@3 changes?
```

el análisis identifica:

``` text
A1 depth 1
Q1 depth 2
C1 depth 3
```

También se probaron:

-   versión exacta;
-   ramas independientes;
-   branching;
-   joins;
-   aislamiento por proyecto;
-   ciclos acotados;
-   ausencia de mutación del Event Store.

### Punto débil descubierto

La primera versión retenía sólo un `viaRecordId` por artefacto.

Eso era insuficiente.

En:

``` text
          → Area ──────┐
Geometry               ├→ Cost
          → Perimeter ─┘
```

`Cost` posee dos caminos de dependencia legítimos.

Elegir sólo uno habría perdido causalidad.

La primera versión fue por tanto rechazada como arquitectura final.

------------------------------------------------------------------------

# 4. H-002 --- Segunda pasada

El contrato fue reformulado para conservar caminos explícitos:

``` text
ImpactPath
ImpactedArtifact
ImpactReport
ImpactAnalyzer
```

Cada impacto puede conservar:

-   referencia afectada;
-   profundidad mínima;
-   uno o varios caminos;
-   derivaciones responsables de cada salto.

El análisis sigue siendo exclusivamente observacional.

Se añadió además un límite explícito de caminos para evitar explosión
combinatoria.

Cuando se supera el límite:

``` text
FAIL-CLOSED
```

No se truncan caminos silenciosamente.

------------------------------------------------------------------------

# 5. H-002 --- Tercera pasada

El ataque adversarial encontró otra debilidad:

un mismo ciclo podía representarse varias veces dependiendo del punto
por el que se ingresara.

Ejemplo conceptual:

``` text
A → B → C → A
B → C → A → B
C → A → B → C
```

Son el mismo ciclo.

Se introdujo canonicalización rotacional para que la evidencia de ciclos
no se multiplique artificialmente.

Este punto se encontraba en validación cuando se produjo el último corte
de ejecución.

Por ello **H-002 NO se declara cerrado todavía**.

------------------------------------------------------------------------

# 6. Estado real del programa de endurecimiento

``` text
H-001 Derivation Integrity
    EXAMEN 10
    REFORZADO
    322 PASS / 0 FAIL reproducibles
    riesgos residuales explícitos

H-002 Impact Analysis / WHAT-IF
    PASADA 1   completada
    PASADA 2   completada
    PASADA 3   en endurecimiento
    cierre     PENDIENTE

H-003 Validity / Invalidation
    NO INICIADO

H-004 Reaction Planning
    NO INICIADO

H-005 Selective Recomputation
    NO INICIADO

H-006 Architectural Re-evaluation
    NO INICIADO

Wall-Move E2E
    NO INICIADO
```

------------------------------------------------------------------------

# 7. Regla de continuidad

El siguiente trabajo autorizado es continuar atacando **H-002**.

Si aparecen nuevas debilidades:

``` text
PASADA 4
PASADA 5
...
PASADA 10
```

según sea necesario.

Sólo después de que H-002 alcance un cierre defendible se autorizará
técnicamente H-003.

La secuencia permanece:

``` text
H-001
Derivation Integrity
        ↓
H-002
Impact / WHAT-IF
        ↓
H-003
Validity + Invalidation
        ↓
H-004
Reaction Planning
        ↓
H-005
Selective Recomputation
        ↓
H-006
Architectural Re-evaluation
        ↓
WALL-MOVE E2E
        ↓
16 → 4 → 1
        ↓
Optimization
        ↓
BIM / Parametric development
```

------------------------------------------------------------------------

# 8. Criterio de cierre

ARKI no se considerará reforzado porque sus módulos existan.

La prueba buscada es progresivamente:

``` text
¿DE DÓNDE SALIÓ?
        ↓
¿DE QUÉ DEPENDE?
        ↓
¿QUÉ CAMBIA SI MODIFICO ESTO?
        ↓
¿QUÉ QUEDA INVÁLIDO?
        ↓
¿QUÉ DEBO RECALCULAR?
        ↓
¿QUÉ CONSECUENCIA ARQUITECTÓNICA PRODUCE?
        ↓
¿SIGUE SIENDO UNA BUENA DECISIÓN?
        ↓
¿DEBO MUTAR, REEVALUAR O REPLANTEAR?
```

H-001 cubre la primera pregunta.

H-002 está construyendo la segunda y tercera.

Las siguientes fases cerrarán progresivamente el circuito cognitivo.

------------------------------------------------------------------------

## Estado de este informe

Este documento es un **reporte de avance**, no una declaración de cierre
de H-002.

La próxima versión deberá incorporar los resultados de las pasadas
restantes de H-002 y sus pruebas de regresión antes de promover el
trabajo hacia H-003.
