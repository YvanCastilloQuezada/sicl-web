# ARKI --- H-002 Impact Analysis / WHAT-IF --- Cierre Examen 10

## Estado

H-002 se implementó como análisis de impacto transitivo **read-only**
sobre H-001.

Regla central:

`IMPACT DETECTED ≠ CHANGE EXECUTED`

No invalida, no recomputa, no muta geometría, no escribe BIM y no
modifica Human Authority.

## Cambio RT-A incorporado

Se recibió la decisión RT-A: un mismo `output@version` puede tener
múltiples derivaciones legítimas si sus `derivationId` son distintos.

No se modificó sólo el test. Se actualizó transversalmente H-001:

-   mismo ID + mismo contenido = replay idempotente;
-   mismo ID + contenido diferente = error;
-   mismo output + IDs distintos = permitido;
-   `why()` preserva todas las derivaciones y no selecciona una
    silenciosamente;
-   historia append-only preserva derivaciones alternativas.

H-002 fue diseñado sobre esa semántica.

## Contrato H-002

-   `ImpactPath`: secuencia exacta de refs y derivation IDs.
-   `ImpactedArtifact`: referencia afectable, profundidad mínima y todos
    los caminos conservados dentro del límite.
-   `ImpactReport`: `contractVersion=1`, referencia de cambio,
    artefactos impactables, ciclos detectados, `readOnly=true`.
-   `ImpactAnalyzer`: reverse traversal sobre inputs consumidos.

## Exámenes

1.  Cadena transitiva G→A→Q→C y read-only.
2.  Versión exacta y aislamiento de referencias no relacionadas.
3.  Branch/join y preservación de caminos.
4.  RT-A: derivaciones alternativas para el mismo output.
5.  Múltiples caminos hacia un join sin selección arbitraria.
6.  Semántica de content hash: H-002 recibe referencia BEFORE/consumida;
    no colapsa hashes/versiones.
7.  Ciclos acotados y canonicalizados; límite explícito.
8.  `contractVersion=1`.
9.  Determinismo independiente del orden histórico de eventos.
10. Regresión Core completa reproducible.

## Resultado runtime

-   Focal H-001 + H-002: PASS.
-   Suite Core reproducible excluyendo sólo los dos tests IFC bloqueados
    por `ifcopenshell`: **332 passed / 0 failed**.
-   `compileall`: PASS.

## Límites y puntos diferidos

### D1 --- Concurrent writer uniqueness / RT-A identity

Sigue pendiente la frontera transaccional del Event Store. RT-A elimina
la falsa unicidad por output, pero la identidad por `derivationId`
todavía usa check-before-write y puede sufrir TOCTOU bajo escritores
concurrentes.

Estado: `KNOWN_RISK / DEFERRED`.

### D2 --- Path explosion

H-002 conserva caminos alternativos, pero un grafo denso puede crecer
combinatoriamente. Se introducen `max_paths_per_artifact` y
`max_cycles`; al excederse, falla cerrado en vez de truncar
silenciosamente.

Estado: `BOUNDED / NEEDS SCALE DESIGN`.

### D3 --- BEFORE → AFTER ChangeSet

H-002 analiza la referencia exacta consumida (BEFORE). No intenta
equiparar un hash/versión nueva con la antigua. El futuro ChangeSet
deberá transportar `before_ref → after_ref`.

Estado: `INTENTIONAL BOUNDARY`.

### D4 --- Impact ≠ invalidation

Que un artefacto aparezca en ImpactReport no significa que sea STALE,
INVALID ni que requiera recomputación. RT-A hace esto especialmente
importante: una salida puede conservar otra derivación válida.

Estado: `H-003 RESPONSIBILITY`.

### D5 --- IFC

Dos tests IFC siguen bloqueados por dependencia `ifcopenshell` no
instalada. No se instaló silenciosamente.

Estado: `ENVIRONMENT_BLOCKED`.

## Nota sobre RT-D

El texto recibido afirma que tests RT-D/F-1 deberían pasar, pero no se
proporcionó en este turno una implementación o suite RT-D separada
identificable para ejecutar. No se declara RT-D verificado sólo por esa
afirmación.

## Git

No se realizó commit/push porque el conector GitHub disponible en esta
conversación continúa sin repositorios autorizados. El paquete incluye
patch exacto para persistencia posterior.

## Siguiente fase

H-003 puede comenzar con una premisa nueva: múltiples derivaciones por
output implican que la invalidez debe evaluarse por
derivación/justificación y luego agregarse al artefacto; no debe
marcarse un output STALE simplemente porque uno de sus caminos fue
afectado.
