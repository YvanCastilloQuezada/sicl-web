# Solver Candidate Scorecard

The full factual dimensions are preserved in the ten source reports under `SOLVER_MAP_RESEARCH/`. No single winner score is produced.

| family | candidate | decision | licenseRisk | professional |
|---|---|---|---|---|
| Internal ARKI methods / geometry / graph / constraints | unit conversion; coordinate transforms; areas; volumes; distances; angles; topology; graphs; adjacency; basic visibility; bounded statistics | NO_SOLVER_REQUIRED | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| BIM / IFC / CAD | IfcOpenShell; web-ifc; Three.js; GDAL/PROJ/GEOS; OCCT when exact B-Rep is required | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Structural FEM | OpenSees/OpenSeesPy; Code_Aster; CalculiX; PLAXIS comparison | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Geotechnical | Code_Aster; OpenSeesPy research; PLAXIS professional comparison | HYBRID | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Wind / CFD / aerodynamics | OpenFOAM; SU2; professional wind-tunnel testing | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Energy / thermal | EnergyPlus; OpenStudio | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Airflow / IAQ | CONTAM / ContamX; coupling limits explicit | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Daylight / solar | Radiance; EnergyPlus/OpenStudio for thermal coupling | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Acoustics | I-Simpa; pyroomacoustics for bounded research fixtures | HYBRID | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Fire / smoke | FDS; Smokeview only visualization; CONTAM for multizone boundary | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Hydraulics / water | EPANET | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Electrical / power | OpenDSS; pandapower | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Vertical transportation | No strong open universal engine verified; professional candidates deferred | PROFESSIONAL_SERVICE_REQUIRED | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Evacuation / crowd | JuPedSim; Vadere; NIST analytical baseline; Pathfinder comparison | HYBRID | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Construction / scheduling | CPM/PERT internally; OR-Tools CP-SAT for discrete optimization | HYBRID | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Cost / finance / LCC | Deterministic ARKI equations; SciPy for numerical sampling; data provenance required | BUILD_INTERNAL | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| LCA / carbon | Brightway candidate; calculation engine separate from LCA databases | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Optimization | SciPy; OR-Tools; pymoo candidate for multiobjective | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| MCDA / decision | Bounded deterministic AHP/TOPSIS/PROMETHEE should be governed internally or via separately validated library | BUILD_INTERNAL | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Risk / uncertainty | SciPy distributions/QMC; Monte Carlo with explicit seed and uncertainty model | HYBRID | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| Digital twin / control / IoT | Telemetry, time series, asset graph and rules are separate; no mythical twin solver | HYBRID | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
| GIS / territorial | GDAL; PROJ; GEOS; PostGIS where server context is justified | INTEGRATE_OPEN_SOURCE | SEE_LICENSE_AUDIT | QUALIFIED_REVIEW_REQUIRED |
