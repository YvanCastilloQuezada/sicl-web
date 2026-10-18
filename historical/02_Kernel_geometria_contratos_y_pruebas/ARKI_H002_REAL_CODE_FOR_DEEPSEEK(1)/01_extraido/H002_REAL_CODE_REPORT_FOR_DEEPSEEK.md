# ARKI H-002 --- REAL CODE REVIEW PACKAGE

## Propósito

Este paquete responde directamente al Red Team que indicó: **"Sin código
real no puedo ir más profundo"**. Incluye código Python ejecutable real
de H-001 endurecido y H-002, más tests adversariales reproducibles.

## Estado

H-002 sigue siendo **READ-ONLY**:

`IMPACT DETECTED ≠ INVALIDATED ≠ RECOMPUTED ≠ CHANGED`

No implementa H-003, propagación automática, invalidación,
recomputación, mutación geométrica, BIM write ni bypass de Human
Authority.

## Código real incluido

-   `src/sicl/derivation.py` --- H-001 endurecido, dependencia real de
    H-002.
-   `src/sicl/impact.py` --- H-002 Impact Analysis / WHAT-IF.
-   `tests/test_derivation.py` --- tests H-001.
-   `tests/test_impact.py` --- tests H-002 + ataques derivados del Red
    Team.
-   `DEEPSEEK_REDTEAM_INPUT.md` --- informe estático recibido, para
    trazabilidad.

## Correcciones frente al Red Team

### RT-01 / F-1 --- hash opcional

Corregido. El reverse lookup busca primero por
`(entity_type, entity_id, version)`, no por hash exacto. Si el
consumidor carece de hash, el impacto **no desaparece**: se devuelve
`UNCERTAIN / MISSING_CONTENT_HASH`. Si el hash contradice el de la
fuente: `UNCERTAIN / CONTENT_HASH_CONFLICT`.

### RT-02 --- ciclos con dominios mixtos

Corregido. La canonicalización de ciclo incluye: - source
type/id/version - relation type - relation domain - target
type/id/version

Dos ciclos con mismos IDs y dominios/relaciones diferentes no colisionan
semánticamente.

### RT-03 --- contenido vs versión vs identidad

Corregido mediante `ImpactChange.change_kind`: - `CONTENT_CHANGED` -
`VERSION_UPGRADED` - `IDENTITY_CHANGED` - `UNKNOWN`

`VERSION_UPGRADED` e `IDENTITY_CHANGED` no se interpretan como
modificación retroactiva de la versión anterior. `UNKNOWN` falla
cerrado.

### RT-04 --- cobertura incompleta

Corregido contractualmente. Todo `ImpactReport` declara:

`coverageWarning = GRAPH_MAY_BE_INCOMPLETE`

Ausencia de impacto en el grafo **no significa** ausencia de
consecuencia arquitectónica.

### RT-05 --- fail-closed ciego

Corregido. Profundidad 1 se recopila completa antes de aplicar el límite
transitorio. Si se supera el límite: - resultados ya descubiertos se
conservan; - `partial = true`; - `partialDepth` se informa; -
`failClosedReason = MAX_TOTAL_TRANSITIVE_PATHS_EXCEEDED`.

No se devuelve falsamente una lista vacía.

### RT-06 --- múltiples derivaciones

H-001 endurecido normalmente rechaza conflicto de output histórico.
H-002, sin embargo, no oculta estados legacy/concurrentes que un reader
pueda exponer: conserva paths múltiples y `derivationRecords[]`. Tests
cubren dos derivaciones diferentes para el mismo output.

### RT-07 --- assumptions ocultas

No se convierten textos en dependencias inventadas. El reporte declara
`assumptionsTraversable = false` y mantiene `GRAPH_MAY_BE_INCOMPLETE`.
Para que una assumption participe en WHAT-IF deberá convertirse en
referencia versionada explícita en una fase posterior.

### RT-08 --- concurrencia H-001

**PERSISTE / DEFERRED.** H-002 puede exponer múltiples derivaciones si
llegan desde un reader, pero H-001 no tiene todavía garantía
transaccional atómica contra escritores concurrentes. Requiere trabajo
de persistencia/índice/CAS y no se oculta como PASS.

### RT-09 --- escala Event Store

**PERSISTE / DEFERRED.** La interfaz actual `ledger.list(project_id)`
sigue implicando reconstrucción completa. Para escala real hace falta
reverse index persistente `(project_id, input_ref_key)` o read-model
equivalente. No se simula una solución inexistente.

### RT-10 --- dependencia ≠ causalidad

Preservado. `ImpactStep` conserva `relation_type` y `relation_domain`;
H-002 sólo descubre caminos registrados. No declara invalidación.

### RT-11 --- ciclos superpuestos

Contrato actual: ciclos simples distintos permanecen distintos aunque
compartan nodos/aristas. Hay test explícito con `A→B→C→A` y `A→B→D→A`.

### RT-12 --- discrepancias históricas de conteos

Este paquete no reutiliza conteos históricos. La ejecución focal actual
es la única cifra atribuida a este artefacto.

### RT-13 --- contractVersion

`ImpactReport.contractVersion = 1` explícito.

### RT-14 --- determinismo

`impactedArtifacts`, paths y ciclos se ordenan determinísticamente. Hay
test que invierte el orden del ledger y exige mismo `canonical_dict()` y
mismo SHA-256.

## Runtime de este paquete

Comando:

`PYTHONPATH=src python -m pytest -q tests/test_derivation.py tests/test_impact.py`

Resultado:

**38 passed / 0 failed**

`python -m compileall -q src tests` → **PASS**

Esto es evidencia focal del paquete. No se presenta como ejecución de
toda la suite del repositorio sicl-core porque este paquete no contiene
el repositorio completo.

## Puntos persistentes

1.  `CONCURRENT_WRITER_UNIQUENESS` --- DEFERRED / HIGH.
2.  `EVENT_STORE_QUERY_SCALING` --- DEFERRED / HIGH.
3.  `RELATION_ONTOLOGY_COMPLETENESS` --- KNOWN LIMITATION.
4.  `ASSUMPTION_REFS` --- KNOWN LIMITATION; texto libre no es
    traversable.
5.  Integración contra el repositorio GitHub real --- pendiente hasta
    que el conector tenga acceso efectivo.

## Petición a DeepSeek

Ahora sí hay código real. Auditar **estos archivos**, no sólo contratos
resumidos.

Ejecutar o razonar línea por línea sobre: - `src/sicl/impact.py` -
`src/sicl/derivation.py` - `tests/test_impact.py` -
`tests/test_derivation.py`

Buscar: 1. falso negativo de impacto; 2. falso positivo; 3. pérdida de
paths; 4. colisión de ciclos; 5. drift de hash; 6. ambigüedad
changeKind; 7. reportes parciales que aparenten completitud; 8. no
determinismo; 9. explosión combinatoria; 10. contaminación
dependencia→causalidad; 11. casos concurrentes; 12. forma mínima de
resolver el reverse index persistente.

No conceder PASS por presencia de tests. Para cada FAIL, entregar
contraejemplo ejecutable mínimo.
