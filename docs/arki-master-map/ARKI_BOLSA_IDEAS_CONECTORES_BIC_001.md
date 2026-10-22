# ARKI — Bolsa de Ideas con Conectores (BIC-001)

Estado: INVENTARIO EXPERIMENTAL / SIN PROMOCIÓN CANÓNICA
Fecha: 2026-10-13

## Ley
Una rama Git no es una idea; una idea es una capacidad, hipótesis o solución identificada por contenido. Una rama puede contener varias ideas y una idea puede atravesar varias ramas y repositorios. Ninguna idea se descarta por nombre, edad o falta de integración. No duplicar Core/D-2/AGK.

## Esquema de cada ficha
- `idea_id`: ID estable; `title`, `intent`, `problem`, `expected_outcome`.
- `sources`: repositorio, rama, SHA exacto, rutas y pruebas; conservar varias fuentes si hay variantes.
- `maturity`: CONCEPT / CODE_CANDIDATE / TESTED_LOCAL / CI_VERIFIED / INTEGRATED / SUPERSEDED / REJECTED / UNKNOWN.
- `evidence`: CI exacto, logs, pruebas, auditorías, límites y UNKNOWN.
- `connectors`: `target_phase` F1..F10 o UNKNOWN; `target_component`; `authority` CORE/D2/AGK/WEB/ACS/UNKNOWN; `contract`; `dependencies`; `integration_strategy` CONNECT/ADAPT/HOLD; `connector_status` PROPOSED/VALIDATED/BLOCKED/CONNECTED; `required_checks`.
- `alternatives`: soluciones competidoras; `conflicts`, `duplicates`, `supersedes`.
- `decision`: PENDING/APPROVED/REJECTED; aprobador, fecha, evidencia; nunca inferir autorización.

## Flujo
Descubrir código y pruebas → agrupar por capacidad → comparar variantes → crear ficha y conector tentativo → auditar contrato y autoridad → probar en gemelo aislado → presentar tres opciones con métricas reales cuando existan → aprobación → PR acotado → CI exact SHA y seguridad → integrar → actualizar Mapa Vivo y Árbol Vivo.

## Primeras fichas basadas en código inspeccionado
| Idea | Fuente | Función verificada por lectura | Conector candidato | Estado |
|---|---|---|---|---|
| BIC-001 | `feat/arbol-vivo-precedencias-seguras-20261010:tools/maqueta-viva/generate-arki-handoff.cjs` | Generar ARKI_HANDOFF desde Git local; no valida CI | Mapa Vivo / continuidad; WEB, Fase UNKNOWN | CODE_CANDIDATE |
| BIC-002 | `feat/arbol-vivo-precedencias-seguras-20261010:tools/maqueta-viva/arki-living-memory.cjs` | Registro experimental en memoria; sin persistencia | Mapa Vivo, adaptador subordinado a Core; Fase UNKNOWN | CODE_CANDIDATE / BLOCKED |
| BIC-003 | `feat/arki-autonomy-memory-main-20261013:tools/maqueta-viva/arki-autonomy-memory.cjs` | Diario hash encadenado in-memory; PR #58 CI fallido | Mapa Vivo / evidencia; autoridad Core, no segunda memoria | CODE_CANDIDATE / BLOCKED |
| BIC-004 | `feat/arbol-vivo-precedencias-seguras-20261010:tools/maqueta-viva/arki-arbol-vivo-auto.cjs` | Ordenamiento de ideas, componentes, dependencias y F1–F10 | Árbol Vivo, WEB; transversal F1–F10 | CODE_CANDIDATE |
| BIC-005 | `feat/arbol-vivo-precedencias-seguras-20261010:tools/maqueta-viva/arki-adn-mejora-continua.cjs` | Propuestas métricas hipotéticas; no simulación verificada | Gemelo Digital Vivo / laboratorio; transversal | CODE_CANDIDATE |
| BIC-006 | `feat/arbol-vivo-autoensamblaje-20261011:tools/maqueta-viva/arki-assembly-planner.cjs` | Plan de conexiones, ciclos y bloqueos; no ejecuta integración | Árbol Vivo / autoensamblaje, WEB | CODE_CANDIDATE |
| BIC-007 | `feat/arki-autonomy-orchestrator-20261013:tools/maqueta-viva/arki-autonomy-macro-orders.cjs` | Macroórdenes AUDIT_AND_PLAN/REASSESS; sin acciones externas | Mapa Vivo + Árbol Vivo / coordinación | CODE_CANDIDATE |
| BIC-008 | `feat/arbol-vivo-autoensamblaje-20261011:tools/maqueta-viva/arki-map-adn-bridge.cjs` | Puente read-only de mapa a observaciones ADN; sin promoción | Mapa Vivo → Gemelo experimental | CODE_CANDIDATE |
| BIC-009 | `reconcile/arki-live-map-2026-10-07:docs/ARKI_CROSS_REPO_AUTHORITY_CONTRACT_V1.md` en sicl-core | Define límites de autoridad | Conector transversal de contratos | CONTRACT_REVIEW |
| BIC-010 | `feat/oece-arki-integration-v1` en arki-acs | Rama con 85 commits de corpus OECE, workers, tests | ACS laboratorio, importación de evidencia a Core bajo contrato | INVENTORY_PENDING |

## Reglas de protección
- No mover ni borrar ramas durante el inventario; usar referencias inmutables por SHA.
- `UNKNOWN` cuando falta la fase exacta, prueba, conector o autoridad. No inferir por nombre de rama.
- BIC-002 y BIC-003 son alternativas/solapamientos, no dos memorias canónicas a fusionar juntas.
- Fichas y conectores son metadatos, no permisos de escritura ni pruebas de integración.
- Esta bolsa se sincronizará con Mapa Vivo mediante una proyección versionada solo después de verificar el mecanismo real.
