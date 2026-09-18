# ARKI — Capability Map V1

**Estado:** CURRENT / CANONICAL / GENERATED FROM ACTUAL IMPLEMENTATION  
**Fecha de corte:** 2026-09-18  
**Regla:** `IMPLEMENTED` no significa `PROFESSIONALLY CERTIFIED`; los estados externos y los datos faltantes permanecen explícitos.

## 1. Repositorios y ramas

| Repositorio | Rama | HEAD | Estado |
|---|---|---|---|
| Core | `feat/weather-environmental-context-p1` | `646dae525dd1db4b9f357aced21cc1302fc791a0` | limpio; contrato Core no modificado por esta orden |
| Web | `feat/spatial-pilot-media-studio-v1` | `04939e492e9bf0ed248c396771de83712b762ad9` al iniciar la orden; commit de esta orden se reporta en el cierre | cambios locales controlados; sin push/PR/merge/deploy |

## 2. Organigrama funcional

```text
ARKI / SiMS-DeI
├── 01. Fundamentos epistemológicos
│   ├── Human Architect = autoridad final
│   ├── HYPOTHESIS / UNKNOWN preservados
│   ├── provenance y lineage
│   └── no winner / no automatic decision
├── 02. Inteligencia arquitectónica
│   ├── programa y relaciones A21
│   ├── parti y zoning
│   ├── circulación y coherencia multinivel
│   ├── A15 lectura / A16 crítica / A17 revisión
│   └── DesignMemory
├── 03. Generative Design Intelligence
│   ├── GDI-P9 → GDI-P24
│   ├── alternativas A/B/C
│   ├── DNA, ramas, replay, comparación
│   ├── critique, trade-offs, challenge
│   └── GDI → S2 controlled loop
├── 04. Realización espacial
│   ├── S1 planta conceptual verificable
│   ├── S2 MOVE/RESIZE/OFFSET/RESHAPE/EDIT
│   ├── límites, contención, no-overlap
│   ├── muros, particiones, aperturas y reservas
│   └── rutas y continuidad multinivel
├── 05. Building Model
│   ├── CanonicalBuildingModel único
│   ├── identity / lineage / provenance
│   ├── plan, site, section, elevation derivados
│   └── quantities/costs con UNKNOWN cuando falta dato
├── 06. Engineering
│   ├── S3–S11, 48 disciplinas conceptuales
│   ├── impactos y reservas
│   └── cálculo profesional = externo / requiere datos
├── 07. Professional intelligence
│   ├── conocimiento K1–K11
│   ├── regulación sin claim de compliance
│   ├── site/GIS con REQUIRES_DATA
│   ├── memoria y persistencia local
│   └── costes sin tarifas inventadas
├── 08. Interoperabilidad
│   ├── DXF: adapter espacial
│   ├── IFC: massing-only
│   ├── GLB: visual massing
│   └── GeoJSON: requiere geometría georreferenciada
├── 09. Visual y documentación
│   ├── SpatialSvgViewer / vistas derivadas
│   ├── 2D/3D conceptual
│   ├── SVG/PDF conceptual
│   └── renderer avanzado = dependencia externa
└── 10. Delivery Orchestrator
    ├── DESIGN_BASIS
    ├── DRAWINGS / SVG
    ├── CAD / BIM / GIS states
    ├── persistence snapshot
    └── external dependency register
```

## 3. Dependencia canónica

```text
KNOWLEDGE + SITE + PROGRAM + HUMAN INTENT
                    ↓
           ARCHITECTURAL INTELLIGENCE
                    ↓
           GENERATIVE INTELLIGENCE
                    ↓
            SPATIAL REALIZATION
                    ↓
             BUILDING MODEL
                    ↓
              ENGINEERING
                    ↓
        PROFESSIONAL INTELLIGENCE
                    ↓
          DELIVERY ORCHESTRATOR
                    ↓
       PLANOS / CAD / BIM / GIS / VISUAL / DATA
```

## 4. Capacidad por rama

| Rama | Capacidades presentes en el estado auditado |
|---|---|
| `feat/weather-environmental-context-p1` (Core) | Core contractual, generación/operaciones espaciales base, ambiente Open-Meteo y estados de evidencia; sin cambios por esta orden |
| `feat/spatial-pilot-media-studio-v1` (Web) | A21, A15–A34, K1–K11, D1–D32, GDI-P9–P24, S1/S2, authoring, engineering S3–S11, foundation S12–S20, exportación, visualización, persistencia local, Capability Set V1 y Delivery Orchestrator |

## 5. Registro factual de capacidades

| Capacidad | Estado | Implementación / límite |
|---|---|---|
| Program / relationships / zoning | PROVEN | A21, hipótesis trazables |
| Parti / concept | PROVEN_WITH_OBSERVATIONS | derivado y revisable; no decisión automática |
| Circulation / vertical coherence | PROVEN_WITH_OBSERVATIONS | evidencia y reservas; compliance separado |
| Alternatives / trade-offs | PROVEN | GDI y A/B/C; no ranking/winner |
| Critique / challenge | PROVEN_WITH_OBSERVATIONS | observaciones y unknowns preservados |
| S1 constructive spatial generation | PROVEN_WITH_OBSERVATIONS | planta conceptual verificable; no documentación constructiva |
| S2 spatial editing | PROVEN_WITH_OBSERVATIONS | autorización humana, parent immutable, fresh readback |
| Canonical Building Model | PROVEN | una sola fuente geométrica derivada |
| Drawings | PROVEN_WITH_OBSERVATIONS | plan/site/section/elevation conceptuales |
| 3D / GLB / SVG | PROVEN_WITH_OBSERVATIONS | visual/massing; renderer avanzado no afirmado |
| DXF | EXTERNAL_VALIDATION_REQUIRED | adapter disponible; round-trip no probado aquí |
| IFC / Revit | EXTERNAL_VALIDATION_REQUIRED | massing-only; runtime Revit externo |
| GIS / cadastre | REQUIRES_DATA | GeoJSON/CRS requieren entrada georreferenciada |
| Engineering | PROVEN_WITH_OBSERVATIONS | 48 disciplinas conceptuales; cálculos requieren engines/datos |
| Regulatory | PROVEN_WITH_OBSERVATIONS | cadena y provenance; no compliance claim |
| Cost / quantities | PROVEN_WITH_OBSERVATIONS | cantidades derivadas; rates/cost UNKNOWN |
| Persistence | PROVEN_WITH_OBSERVATIONS | snapshot local determinista; producción pendiente |
| Delivery | PROVEN_WITH_OBSERVATIONS | empaqueta outputs y estados externos |

## 6. No duplicación

Se conserva una única arquitectura canónica para `Alternative`, `SpatialRepresentation`, `CanonicalBuildingModel`, `DesignOperation`, `DesignMemory`, knowledge, evidence y delivery. No se creó un segundo BIM model, GIS model, lineage system, distance engine ni floor-plan engine.

## 7. Dependencias externas

Revit/IFC parser, DWG round-trip, renderer fotorrealista, CFD, energy simulation, structural solvers, detailed MEP, official GIS/cadastre, survey/terrain, current regulatory corpus, market cost data y professional certification no se simulan localmente. Cada uno queda como `EXTERNAL_VALIDATION_REQUIRED`, `REQUIRES_DATA` o `NOT_CLAIMED`.

## 8. Scoreboard sin puntuación subjetiva

ARKI cuenta con mecanismos operativos para **program, relationships, flow, site, concept, parti, plan, section, massing, circulation, privacy, alternatives, critique, trade-offs, change impact, documentation**. `views`, `environment`, `structure awareness`, `systems awareness` y `constructability awareness` existen como contexto/reservas/observaciones, no como prueba profesional universal.
