# Registro Canónico de Motores — ARKI-GIA

**Regla de cierre:** un motor NO está integrado porque exista su catálogo, contrato o adaptador. Debe ejecutar cálculo real, recibir datos definidos, devolver resultados verificables y superar pruebas reproducibles.

**Estados:**
- **IMPLEMENTADO** — código ejecutable, E/S definidas, integración real, tests + evidencia.
- **PARCIAL** — ejecuta pero no cubre todo el alcance.
- **EXPERIMENTAL/DESCONECTADO** — existe con tests pero no está en el ciclo productivo.
- **AUSENTE** — sin evidencia en el runtime auditado.

## Motores en `motores-api` (puerto 18771)

| Motor | Estado endpoint | Nota |
|---|---|---|
| structural | PARTIAL | Doc dice world-class; endpoint dice PARTIAL. Unificar. |
| geotech | PASS | `q_ultimate` real |
| acoustic | PASS | T60 real |
| hvac | PARTIAL | Estimación conceptual |
| evacuation | PARTIAL | Estimación conceptual |
| fire | PARTIAL | Estimación conceptual |
| sewer | PARTIAL | Estimación conceptual |

## Deuda de motores por dominio (16 dominios)

| # | Dominio | Motor requerido | Estado ARKI | Acción |
|---|---|---|---|---|
| 1 | Funcional | Programa, capacidades, flujos | PARCIAL | Ampliar |
| 2 | Solar | Trayectoria, radiación, sombras | EXPERIMENTAL (rama Core) | Recuperar + ampliar con Radiance |
| 3 | Ambiental | Clima, viento, confort | AUSENTE | EnergyPlus + OpenFOAM |
| 4 | Lumínico | Iluminación natural/artificial | AUSENTE | Radiance |
| 5 | Acústico | Aislamiento, reverberación | PASS (básico) | Ampliar (pyroomacoustics / I-Simpa) |
| 6 | Estructural | Predimensionamiento, sismo | PARTIAL | OpenSees como maestro DAM |
| 7 | Geotécnico | Terreno, cimentaciones | PASS (básico) | Ampliar (GemPy) |
| 8 | Seguridad | Incendios, evacuación | PARTIAL | FDS/CFAST + motor evacuación propio |
| 9 | Accesibilidad | Rutas, diseño universal | AUSENTE | Motor nativo |
| 10 | Hidrosanitario | Agua, desagüe, drenaje | PARTIAL | EPA SWMM + EPANET |
| 11 | Eléctrico | Demanda, potencia, respaldo | AUSENTE | Motor nativo |
| 12 | Mecánico | HVAC, ventilación, extracción | PARTIAL | EnergyPlus + CONTAM |
| 13 | Paisajístico | Vegetación, microclima | AUSENTE | Motor nativo |
| 14 | Económico | Metrados, costos, ciclo de vida | PARCIAL (`calculateLifecycleBudget`) | Ampliar |
| 15 | Constructivo | Constructibilidad, secuencia | PARCIAL (`executeWave3`) | Ampliar |
| 16 | Sostenibilidad | Energía, agua, materiales | AUSENTE | EnergyPlus + LCA |

## Motores externos candidatos (maestros DAM)

Regla RFC-037: máx. 2 ramas DAM simultáneas. Doctrina: los externos son maestros temporales, no dependencias permanentes.

| Prioridad | Motor | Dominio | Estado |
|---|---|---|---|
| 1 | OpenSees | Estructuras + sismo | No instalado |
| 2 | Monte Carlo (SICL Core) | Simulación | ✅ **Ya en main** (`src/sicl/simulation.py`) |
| 3 | EnergyPlus | Energía | No instalado |
| 4 | Radiance | Iluminación | No instalado |
| 5 | EPA SWMM | Drenaje | No instalado |
| 6 | OpenFOAM | CFD / viento | No instalado |
| 7 | FDS/CFAST | Incendio | No instalado |
| 8 | IfcOpenShell | BIM/IFC | ✅ **Ya en SICL Core** |
| 9 | MATSim / SUMO | Movilidad urbana | No instalado |
| 10 | UrbanSim | Territorio | No instalado |

## Bloqueante actual

**Reporte local sin leer:** `~/Descargas/ARKI-REPORTES/ARKI-MOTOR-LOCAL-AUDIT-20261113-013131.txt`

Sin leer ese reporte, no se decide qué instalar. Puede revelar motores ya instalados que se duplicarían.

## Correcciones de clasificación

- **Monte Carlo NO es deuda de motor.** Ya está en `main` de SICL Core con tests.
- **IfcOpenShell NO es deuda de motor.** Ya se usa en SICL Core para IFC read-only.
- **`buildPartiProof()` en SICL Web genera PARTI sintético** en vez de construirlo desde el proyecto real. Defecto de integración.
