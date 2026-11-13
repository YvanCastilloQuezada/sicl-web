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

## Evidencia local (reporte ARKI-MOTOR-LOCAL-AUDIT-20261113-013131.txt, 2026-11-13)

### Instalado en el shell del usuario
- GDAL 3.12.2 (ogrinfo, gdalinfo) - geoespacial basico
- numpy - pero SIN scipy ni pandas (analisis numerico limitado)
- osgeo (GDAL Python bindings)

### NO instalado en el shell del usuario
- OpenSees, OpenSeesPy, gmsh, FreeCAD, Blender
- swmm5, epanet, energyplus, radiance, rtrace, rpict
- openfoam, foamRun, simpleFoam, sumo, netconvert, qgis
- scipy, pandas, salib, SALib, pymc, openturns, ladybug, honeybee
- pyswmm, swmm, pyroomacoustics, geopandas, shapely, ezdxf, fipy, fenics

### Instalado en ~/ARKI/motores-venv (servicio motores-api, PID 951342)
- OpenSeesPy - el motor structural ya lo usa via HTTP
- Los otros 6 motores del servicio tambien operan desde ese venv

Correccion critica: "OpenSees no instalado" es cierto SOLO para el shell del usuario.
El servicio motores-api si tiene OpenSeesPy y opera. La integracion no es instalar
OpenSees: es completar los 4 motores PARTIAL que ya corren.

### Dependencias de SICL Core (pyproject.toml)
- dependencies: jsonschema, tzdata, cryptography
- test: pytest, ifcopenshell, reportlab, pypdf
- api: fastapi, uvicorn, httpx, python-multipart

ifcopenshell es dependencia opcional test, NO runtime. ~25 modulos de SICL Core
lo importan sin guard. Si no se instala pip install -e ".[test]", esos modulos fallan.

### Estado de repos
- sicl-core: main, limpio, commit c3343255
- sicl-web: rama fix/vitest-exclude-motores, working tree SUCIO (4 archivos + 7 backups sin versionar)
- arki-acs: main, limpio, commit 91464a60

### Deuda de seguridad
- Token de gitea en texto plano en URL de remotos (git remote -v).
  Es localhost, pero debe migrarse a ~/.netrc o credential helper.

## Bloqueante real (actualizado)

No es "instalar OpenSees". Es:

1. Resolver el working tree sucio de sicl-web (rama fix/vitest-exclude-motores).
2. Completar los 4 motores PARTIAL (hvac, evacuation, fire, sewer) a PASS con evidencia real.
3. Decidir scipy antes que OpenSees - sin scipy, el analisis numerico base
   (regresion, optimizacion, estadistica) es Python puro o depende de numpy sin algebra lineal seria.
4. Instalar ifcopenshell en el venv correcto si se quiere usar el IFC de SICL Core en el shell.


---

## Deuda del repo `motores-api` (2026-11-13)

**Hallazgo de auditoría (sesión 2026-11-13):**

El repo `github.com/YvanCastilloQuezada/motores-api`:

| Aspecto | Valor |
|---|---|
| Tamaño del código | 3.8 MB |
| Tamaño del venv | **6.7 GB** |
| `requirements.txt` | `fastapi`, `uvicorn`, `pydantic` (solo) |
| Motores en `requirements.txt` | **0 de 7** |
| Motores en el venv | **7 de 7** (OpenSeesPy, bearing_capacity, opensimula, jupedsim, cfast_bin, pyrato, pysewer) |

**Consecuencia:** levantar `motores-api` en un runner de GitHub Actions es **inviable** porque:
1. Los 7 motores no están en `requirements.txt`.
2. Algunos (OpenSeesPy, jupedsim) requieren binarios compilados que tardan 20-30 min en instalar o descargar.
3. El venv de 6.7 GB excede lo razonable para CI.

**Decisión:** el CI de GIA separa unitarios (GIA-001..010, sin motores) de integración (GIA-011..025, con motores). Los de integración se saltan con warning visible cuando `motores-api` no responde.

**Deuda para el repo `motores-api`:**
1. Declarar los 7 motores en `requirements.txt` (o en un `extras` separado).
2. Evaluar si es viable un `Dockerfile` que empaquete los 7 motores.
3. Si no, mantener la política actual: integración solo local.
