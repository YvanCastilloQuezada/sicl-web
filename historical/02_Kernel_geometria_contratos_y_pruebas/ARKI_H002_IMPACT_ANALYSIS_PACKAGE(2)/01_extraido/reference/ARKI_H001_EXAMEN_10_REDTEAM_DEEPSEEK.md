# ARKI H-001 --- Informe de endurecimiento iterativo hasta examen 10

## Orden ejecutada

Se aplicó la regla: cualquier punto débil descubierto se vuelve a
examinar y corregir tantas veces como sea necesario, con límite máximo
de 10 exámenes. Los exámenes 1--3 corresponden a la doble reconstrucción
desde baseline y la tercera pasada sobre puntos débiles. Se continuó con
exámenes 4--10.

## Examen 4 --- historia corrupta y fail-closed

Hallazgo: un evento `DERIVATION_RECORDED` con envelope/payload no válido
podía ser ignorado silenciosamente; además, un historial
importado/corrupto con dos derivaciones para el mismo output podía
colapsarse posteriormente en un diccionario.

Corrección: - lectura histórica fail-closed; - detección de conflicto
por `derivation id`; - detección de conflicto por `output@version`; -
repetición histórica idéntica se deduplica de forma determinista.

Resultado: PASS.

## Examen 5 --- escalabilidad y semántica de hojas

`leaf_inputs` significa correctamente referencias sin derivación
registrada, no datos faltantes. La reconstrucción del ledger es O(E) por
consulta porque recorre Event Store. No afecta integridad en H-001, pero
queda como `PERFORMANCE_DEBT`.

Resultado: PASS con deuda de rendimiento no bloqueante.

## Examen 6 --- canonicalización de assumptions y alcance semántico

Hallazgo: assumptions admitían espacios y duplicados semánticamente
equivalentes, alterando identidad canónica.

Corrección: - strip obligatorio; - unicidad después de normalización.

Límite conservado: H-001 no inventa una ontología completa de pares
entity-type/relation. `DERIVED_FROM` sigue deliberadamente general
dentro de dominios permitidos. Estado: `SEMANTIC_SCOPE_LIMIT`, no falso
PASS de comprensión arquitectónica.

Resultado: PASS.

## Examen 7 --- determinismo independiente del orden

Hallazgo: dependencias equivalentes en distinto orden producían
fingerprints distintos.

Corrección: - `canonical_json()` ordena inputs, relations y assumptions
antes del SHA-256. - el orden se trata como no semántico en H-001.

Resultado: PASS.

## Examen 8 --- drift de esquema

Hallazgo: `from_dict` aceptaba campos desconocidos silenciosamente.

Corrección: - `VersionedRef`, `TypedRelation` y `DerivationRecord`
rechazan claves desconocidas.

Resultado: PASS.

## Examen 9 --- versionado del contrato

El fail-closed reveló que no existía una versión explícita del esquema
de DerivationRecord.

Corrección: - `contractVersion = 1`; - serialización explícita; -
lectores rechazan versiones no soportadas.

Resultado: PASS.

## Examen 10 --- regresión final

-   Core reproducible: **322 passed / 0 failed**.
-   `compileall`: PASS.
-   métodos de acción prohibidos en H-001
    (propagate/invalidate/recompute/mutate/write_bim): NONE.
-   IFC continúa fuera de la suite reproducible por ausencia de
    `ifcopenshell`; no se instaló silenciosamente.

## Puntos que persisten al límite y quedan marcados

### P1 --- CONCURRENT_WRITER_UNIQUENESS

Estado: `KNOWN_RISK / DEFERRED`. La unicidad de `output@version` se
protege lógicamente, pero no mediante restricción transaccional
específica. Dos escritores concurrentes pueden sufrir TOCTOU. Resolverlo
exige diseño de persistencia/CAS/índice o frontera transaccional y
ampliaría H-001.

### P2 --- EVENT_STORE_QUERY_SCALING

Estado: `PERFORMANCE_DEBT / DEFERRED`. `list()` reconstruye desde
eventos y `why()` depende de esa reconstrucción. Correcto para H-001, no
adecuado indefinidamente para un grafo grande. Futuro read-model/index
derivacional.

### P3 --- RELATION ONTOLOGY COMPLETENESS

Estado: `SEMANTIC_SCOPE_LIMIT / DEFERRED`. H-001 distingue dominios y
tipos básicos, pero no demuestra una ontología completa que valide todos
los pares entity-type/relation. No se inventó una matriz extensa
prematuramente.

### P4 --- FINGERPRINT NAMING

Estado: `NAMING_SEMANTIC_DEBT / DEFERRED`. El campo opcional
`fingerprint` y `stable_fingerprint()` representan conceptos
relacionados pero distintos. No se renombró ahora para evitar cambio de
API antes de integración con módulos reales.

### P5 --- IFC FULL SUITE

Estado: `ENVIRONMENT_BLOCKED`. Dos tests IFC requieren `ifcopenshell`.
No se instaló silenciosamente.

## Estado de cimentación H-001

H-001 demuestra integridad derivacional y trazabilidad read-only con
evidencia runtime. No demuestra propagación, invalidación,
recomputación, causalidad arquitectónica completa, BIM write ni
autonomía.

**322 PASS / 0 FAIL en la suite Core reproducible.**

Los cinco puntos anteriores no se ocultan. P1 es el riesgo de integridad
más importante que queda; P2--P4 son de evolución/arquitectura; P5 es
ambiental.

## Objetivos para DeepSeek

Atacar esta versión final, especialmente P1--P5, buscar contraejemplos a
la dirección `output → dependency`, cuestionar si un output@version
puede tener varias justificaciones legítimas, revisar el uso del Event
Store como ledger, atacar `content_hash`, canonicalización, schema
versioning, fail-closed, ciclos, imports históricos y separación de
genealogías.

No implementar. Clasificar cada hallazgo como CRITICAL/HIGH/MEDIUM/LOW y
aportar contraejemplo reproducible, evidencia y corrección mínima.
