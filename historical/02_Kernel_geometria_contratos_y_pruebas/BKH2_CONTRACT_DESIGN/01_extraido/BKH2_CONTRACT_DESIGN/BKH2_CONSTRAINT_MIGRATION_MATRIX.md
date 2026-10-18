# BKH-2 — Constraint Migration Matrix

**Regla:** audit first → extend second → create only if missing. Esta matriz no ejecuta migraciones.

| Mecanismo existente | Ubicación | Significado actual | Clasificación | Destino contractual | Riesgo |
|---|---|---|---|---|---|
| Límites de `areaM2`, `capacity`, `floors` | `shared/arkiDynamicFamilies.ts` | Sanitizan y acotan entradas de familias | `KEEP_AS_DOMAIN_VALIDATOR` | Adapter opcional a `DIMENSION_RANGE` / `DOMAIN_RULE` | Cambiar sanitización por evaluación podría alterar generación |
| `Math.max` / `Math.min` de parámetros | `shared/arkiDynamicFamilies.ts` | Evitan valores fuera de rango | `KEEP_AS_DOMAIN_VALIDATOR` | Documentar como regla de generación; no duplicar automáticamente | Límites implícitos no tienen provenance suficiente |
| Área neta y aberturas | `shared/arkiConstructionOntology.ts` | Derivan métricas de muro | `KEEP_AS_DOMAIN_VALIDATOR` | Referenciar como `DERIVED_METRIC` | Confundir métrica con constraint |
| Coherencia de capas | Ontología constructiva y pruebas | Verifica capas y metrado | `ADAPT` | Predicate dimensional/material cuando exista evidencia | Materiales y acabados requieren contexto de dominio |
| Metrados y presupuesto | `shared/arki5d/index.ts`, ontología | Calculan quantities, partidas y costos | `KEEP_AS_DOMAIN_VALIDATOR` | Constraints `COST` sólo como lectura | BKH-2 no debe recalcular 5D |
| Precedencias y ruta crítica | `shared/arki4d/index.ts` | Calculan schedule | `KEEP_AS_DOMAIN_VALIDATOR` | Constraints `SCHEDULE` sólo como lectura | BKH-2 no debe mutar actividades |
| Detección de clashes | `shared/coordination/index.ts` | Detecta intersección volumétrica | `KEEP_AS_DOMAIN_VALIDATOR` | Adaptar resultado a `CONFLICTING` si se aprueba | Clash no equivale automáticamente a constraint |
| Contrato estructural | `shared/structural/index.ts` | Define modelo y stub de análisis | `KEEP_AS_DOMAIN_VALIDATOR` / `CONTRACT_ONLY` | `STRUCTURAL` con solver declarado | No afirmar solver profesional |
| Contrato MEP | `shared/mep/index.ts` | Define topología especializada | `KEEP_AS_DOMAIN_VALIDATOR` / `CONTRACT_ONLY` | `MEP` con dependencias explícitas | No inventar análisis de redes |
| IFC parser/exporter | `shared/ifc4/*` | Importa/exporta y reporta pérdidas | `ADAPT` | Provenance y applicability de constraints IFC | No convertir loss report en aprobación |
| Snapshots y versiones | `shared/persistence/*` | Persiste estados y auditoría | `KEEP` | Consumir `projectVersion` | BKH-2 no controla commit |
| Relationship Fabric | `shared/arkiRelationshipFabric.ts` | Identifica y valida relaciones | `REUSE` | Referenciar `relationIds` | Crear un grafo paralelo |
| Validaciones normativas | No se observó un motor normativo canónico | Contratos y textos parciales | `CREATE ONLY IF MISSING`, future | `REGULATORY` con fuente, jurisdicción y evidencia | `RESEARCHED` no equivale a `VERIFIED` |
| Constraint Engine general | No observado | No existe registro/evaluador transversal | `CREATE` | BKH-2 owner futuro | Riesgo de duplicar validadores de dominio |

## Criterio de migración

Ningún mecanismo legacy se elimina durante Contract Design. Un adapter futuro sólo será aceptable si conserva el comportamiento observado, identifica el owner actual y tiene pruebas de equivalencia y de no mutación.
