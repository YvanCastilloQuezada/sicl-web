# ARKI-HARDENING-H002 --- Impact Analysis / WHAT-IF --- Examen 10

## Estado ejecutivo

H-002 implementa análisis de impacto transitivo **read-only** sobre
H-001.

Regla central:

**IMPACT DETECTED ≠ CHANGE EXECUTED**

No invalida, no recomputa, no muta geometría, no escribe BIM y no cambia
decisiones humanas.

## Protocolo aplicado

H-002 fue atacado y reforzado hasta examen 10.

### Pasadas 1--3

-   Cadena `G1@3 → A1@1 → Q1@2 → C1@4`.
-   versión exacta;
-   branching/join;
-   aislamiento de proyecto;
-   ciclos;
-   conservación de rutas alternativas;
-   límite fail-closed para explosión de paths;
-   canonicalización de ciclos.

### Examen 4

Validación estructural de `ImpactPath`: refs y pasos inválidos son
rechazados.

### Examen 5

`ImpactReport.contractVersion = 1`.

### Examen 6

Límite explícito `max_impacted_artifacts`; la explosión no se trunca
silenciosamente.

### Examen 7

Hallazgo: conservar sólo `recordId` perdía la semántica
causal/dependencial de cada salto.

Corrección: `ImpactStep` conserva: - `recordId`; - `from_ref`; -
`to_ref`; - `relation_type`; - `relation_domain`.

Por tanto una ruta WHAT-IF ya no es una secuencia opaca de IDs.

### Examen 8

`ImpactReport` posee serialización canónica y `stable_fingerprint()`
SHA-256 determinista.

### Examen 9

Prueba contra `SQLiteRepository(':memory:')` real: - tres derivaciones
registradas; - análisis transitivo correcto; - número de eventos
antes/después idéntico; - consulta WHAT-IF efectivamente read-only.

### Examen 10

Regresión Core reproducible: - **336 passed / 0 failed**; -
`compileall`: PASS; - dos tests IFC no se ejecutan por ausencia de
`ifcopenshell`; no se instaló silenciosamente.

## Capacidades demostradas

-   reverse dependency traversal desde una `VersionedRef` exacta;
-   impacto transitivo;
-   profundidad mínima;
-   múltiples rutas de impacto;
-   semántica de relación por salto;
-   ciclos detectados/canónicos;
-   límites de profundidad, paths y artefactos;
-   aislamiento por proyecto;
-   determinismo/fingerprint;
-   integración read-only con Event Store SQLite.

## No capacidades

H-002 NO demuestra: - causalidad arquitectónica física; - que todo
impacto descubierto deba invalidarse; - propagación automática; -
invalidación; - recomputación; - reacción; - mutación; - BIM write; -
wall-move E2E; - juicio arquitectónico; - aprendizaje.

## Riesgos/deuda que permanecen

### H2-R1 --- PATH EXPLOSION

Mitigado con límites fail-closed, no eliminado matemáticamente. Grafos
grandes pueden exceder límites.

### H2-R2 --- EVENT STORE SCALING

El análisis parte de `ledger.list(project_id)` y reconstruye desde
eventos. Correcto para integridad actual; futuro read-model/index
requerido para escala.

### H2-R3 --- SEMANTIC ONTOLOGY LIMIT

H-002 conserva `relation_type/domain`, pero la calidad de esas
relaciones depende de H-001. No demuestra ontología arquitectónica
completa.

### H2-R4 --- EXACT VERSION QUERY SEMANTICS

El análisis parte de una referencia exacta consumida. Un cambio
`G1@3 → G1@4` no significa que consultar `G1@4` herede automáticamente
los consumidores de `G1@3`. La comparación de versiones y la
interpretación del cambio pertenecen a capas posteriores.

### H2-R5 --- CONCURRENT WRITER RISK INHERITED

H-002 hereda el riesgo H-001 de escrituras concurrentes del ledger;
H-002 mismo es read-only.

## Orden para Red Team externo

Atacar H-001 + H-002 como sistema.

Buscar especialmente: 1. contraejemplos donde reverse dependency
traversal produzca falso impacto; 2. impactos que deban depender de
relation type/domain; 3. pérdida de caminos en joins complejos; 4.
ciclos superpuestos; 5. path explosion; 6. cambio de versión vs cambio
de identidad; 7. content-hash drift; 8. eventos históricos corruptos; 9.
concurrencia H-001; 10. escalabilidad del Event Store; 11. posibilidad
legítima de múltiples derivaciones para un output; 12. si `ImpactStep`
confunde dependencia con causalidad; 13. si un cambio arquitectónico
debería impactar entidades no conectadas explícitamente; 14. riesgos
antes de H-003 Validity/Invalidation.

No implementar. Entregar severidad, evidencia, contraejemplo
reproducible, punto ciego y corrección mínima.

## Estrategia posterior

Después del ataque/refuerzo externo: 1. ChatGPT revisa cada hallazgo
contra código/evidencia. 2. Integra sólo correcciones justificadas. 3.
Optimiza arquitectura y código. 4. Repite regresión. 5. Somete
H-001+H-002 optimizados a un nuevo Red Team dirigido por ChatGPT. 6.
Sólo entonces decide si H-003 puede comenzar.
