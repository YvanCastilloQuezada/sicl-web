# Computational Family Taxonomy

| family | name | candidateOrMethod | decision |
|---|---|---|---|
| INTERNAL | Internal ARKI methods / geometry / graph / constraints | unit conversion; coordinate transforms; areas; volumes; distances; angles; topology; graphs; adjacency; basic visibility; bounded statistics | NO_SOLVER_REQUIRED |
| BIM/IFC/CAD | BIM / IFC / CAD | IfcOpenShell; web-ifc; Three.js; GDAL/PROJ/GEOS; OCCT when exact B-Rep is required | INTEGRATE_OPEN_SOURCE |
| STRUCTURAL | Structural FEM | OpenSees/OpenSeesPy; Code_Aster; CalculiX; PLAXIS comparison | INTEGRATE_OPEN_SOURCE |
| GEOTECH | Geotechnical | Code_Aster; OpenSeesPy research; PLAXIS professional comparison | HYBRID |
| CFD | Wind / CFD / aerodynamics | OpenFOAM; SU2; professional wind-tunnel testing | INTEGRATE_OPEN_SOURCE |
| ENERGY | Energy / thermal | EnergyPlus; OpenStudio | INTEGRATE_OPEN_SOURCE |
| AIRFLOW | Airflow / IAQ | CONTAM / ContamX; coupling limits explicit | INTEGRATE_OPEN_SOURCE |
| LIGHTING | Daylight / solar | Radiance; EnergyPlus/OpenStudio for thermal coupling | INTEGRATE_OPEN_SOURCE |
| ACOUSTICS | Acoustics | I-Simpa; pyroomacoustics for bounded research fixtures | HYBRID |
| FIRE | Fire / smoke | FDS; Smokeview only visualization; CONTAM for multizone boundary | INTEGRATE_OPEN_SOURCE |
| HYDRAULICS | Hydraulics / water | EPANET | INTEGRATE_OPEN_SOURCE |
| ELECTRICAL | Electrical / power | OpenDSS; pandapower | INTEGRATE_OPEN_SOURCE |
| VERTICAL | Vertical transportation | No strong open universal engine verified; professional candidates deferred | PROFESSIONAL_SERVICE_REQUIRED |
| EVACUATION | Evacuation / crowd | JuPedSim; Vadere; NIST analytical baseline; Pathfinder comparison | HYBRID |
| SCHEDULING | Construction / scheduling | CPM/PERT internally; OR-Tools CP-SAT for discrete optimization | HYBRID |
| FINANCE | Cost / finance / LCC | Deterministic ARKI equations; SciPy for numerical sampling; data provenance required | BUILD_INTERNAL |
| LCA | LCA / carbon | Brightway candidate; calculation engine separate from LCA databases | INTEGRATE_OPEN_SOURCE |
| OPTIMIZATION | Optimization | SciPy; OR-Tools; pymoo candidate for multiobjective | INTEGRATE_OPEN_SOURCE |
| MCDA | MCDA / decision | Bounded deterministic AHP/TOPSIS/PROMETHEE should be governed internally or via separately validated library | BUILD_INTERNAL |
| RISK | Risk / uncertainty | SciPy distributions/QMC; Monte Carlo with explicit seed and uncertainty model | HYBRID |
| DIGITAL_TWIN | Digital twin / control / IoT | Telemetry, time series, asset graph and rules are separate; no mythical twin solver | HYBRID |
| GIS | GIS / territorial | GDAL; PROJ; GEOS; PostGIS where server context is justified | INTEGRATE_OPEN_SOURCE |

The taxonomy is solver-oriented and does not equate a capability with a solver. Families may share instruments, while representation, calculation and professional validation remain separate.
