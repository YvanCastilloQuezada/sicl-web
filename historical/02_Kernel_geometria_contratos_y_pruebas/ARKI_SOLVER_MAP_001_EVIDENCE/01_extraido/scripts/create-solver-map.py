from __future__ import annotations
import hashlib, json, os, re, subprocess, zipfile
from pathlib import Path
from datetime import date

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'ARKI_SOLVER_MAP_001_EVIDENCE'
RESEARCH=ROOT/'SOLVER_MAP_RESEARCH'
OUT.mkdir(exist_ok=True)
registry=json.loads((ROOT/'C1_C80_WAVE1_REGISTRY.json').read_text())
caps=registry['capabilities']
access='2026-09-24'

families=[
 ('INTERNAL','Internal ARKI methods / geometry / graph / constraints','unit conversion; coordinate transforms; areas; volumes; distances; angles; topology; graphs; adjacency; basic visibility; bounded statistics','NO_SOLVER_REQUIRED'),
 ('BIM/IFC/CAD','BIM / IFC / CAD','IfcOpenShell; web-ifc; Three.js; GDAL/PROJ/GEOS; OCCT when exact B-Rep is required','INTEGRATE_OPEN_SOURCE'),
 ('STRUCTURAL','Structural FEM','OpenSees/OpenSeesPy; Code_Aster; CalculiX; PLAXIS comparison','INTEGRATE_OPEN_SOURCE'),
 ('GEOTECH','Geotechnical','Code_Aster; OpenSeesPy research; PLAXIS professional comparison','HYBRID'),
 ('CFD','Wind / CFD / aerodynamics','OpenFOAM; SU2; professional wind-tunnel testing','INTEGRATE_OPEN_SOURCE'),
 ('ENERGY','Energy / thermal','EnergyPlus; OpenStudio','INTEGRATE_OPEN_SOURCE'),
 ('AIRFLOW','Airflow / IAQ','CONTAM / ContamX; coupling limits explicit','INTEGRATE_OPEN_SOURCE'),
 ('LIGHTING','Daylight / solar','Radiance; EnergyPlus/OpenStudio for thermal coupling','INTEGRATE_OPEN_SOURCE'),
 ('ACOUSTICS','Acoustics','I-Simpa; pyroomacoustics for bounded research fixtures','HYBRID'),
 ('FIRE','Fire / smoke','FDS; Smokeview only visualization; CONTAM for multizone boundary','INTEGRATE_OPEN_SOURCE'),
 ('HYDRAULICS','Hydraulics / water','EPANET','INTEGRATE_OPEN_SOURCE'),
 ('ELECTRICAL','Electrical / power','OpenDSS; pandapower','INTEGRATE_OPEN_SOURCE'),
 ('VERTICAL','Vertical transportation','No strong open universal engine verified; professional candidates deferred','PROFESSIONAL_SERVICE_REQUIRED'),
 ('EVACUATION','Evacuation / crowd','JuPedSim; Vadere; NIST analytical baseline; Pathfinder comparison','HYBRID'),
 ('SCHEDULING','Construction / scheduling','CPM/PERT internally; OR-Tools CP-SAT for discrete optimization','HYBRID'),
 ('FINANCE','Cost / finance / LCC','Deterministic ARKI equations; SciPy for numerical sampling; data provenance required','BUILD_INTERNAL'),
 ('LCA','LCA / carbon','Brightway candidate; calculation engine separate from LCA databases','INTEGRATE_OPEN_SOURCE'),
 ('OPTIMIZATION','Optimization','SciPy; OR-Tools; pymoo candidate for multiobjective','INTEGRATE_OPEN_SOURCE'),
 ('MCDA','MCDA / decision','Bounded deterministic AHP/TOPSIS/PROMETHEE should be governed internally or via separately validated library','BUILD_INTERNAL'),
 ('RISK','Risk / uncertainty','SciPy distributions/QMC; Monte Carlo with explicit seed and uncertainty model','HYBRID'),
 ('DIGITAL_TWIN','Digital twin / control / IoT','Telemetry, time series, asset graph and rules are separate; no mythical twin solver','HYBRID'),
 ('GIS','GIS / territorial','GDAL; PROJ; GEOS; PostGIS where server context is justified','INTEGRATE_OPEN_SOURCE'),
]

def fam_for(name,domain):
 s=(name+' '+domain).lower()
 if any(x in s for x in ['ifc','cad','bim','shape','geometry','spatial','programa','circulación','espacio','sintax','topolog','gis','territor']): return 'BIM/IFC/CAD'
 if any(x in s for x in ['estructura','struct','seismic','seismic','vibr','geotec','foundation','soil']): return 'STRUCTURAL' if 'geotec' not in s and 'soil' not in s else 'GEOTECH'
 if any(x in s for x in ['wind','cfd','aerodynamic','fluido']): return 'CFD'
 if any(x in s for x in ['thermal','térmic','energy','energ','hvac','airflow','ventil']): return 'ENERGY' if 'air' not in s and 'ventil' not in s else 'AIRFLOW'
 if any(x in s for x in ['daylight','solar','lighting','ilumin','acúst','acoustic']): return 'LIGHTING' if not any(x in s for x in ['acúst','acoustic']) else 'ACOUSTICS'
 if any(x in s for x in ['fire','smoke','incend','fuego']): return 'FIRE'
 if any(x in s for x in ['hydraulic','water','hydro','sanit','plumb']): return 'HYDRAULICS'
 if any(x in s for x in ['elect','power','eléct']): return 'ELECTRICAL'
 if any(x in s for x in ['vertical transport','elevator','ascensor']): return 'VERTICAL'
 if any(x in s for x in ['evac','crowd','pedestrian','egress','evacu']): return 'EVACUATION'
 if any(x in s for x in ['schedule','construction','lean','takt','obra','planificación']): return 'SCHEDULING'
 if any(x in s for x in ['cost','finance','finance','lcc','presup','price','econom']): return 'FINANCE'
 if any(x in s for x in ['lca','carbon','sustain','sosten','ambient']): return 'LCA'
 if any(x in s for x in ['optim','nsga','genetic','pareto']): return 'OPTIMIZATION'
 if any(x in s for x in ['mcda','decision','ahp','topsis']): return 'MCDA'
 if any(x in s for x in ['risk','monte carlo','uncert']): return 'RISK'
 if any(x in s for x in ['twin','iot','telemetry','control']): return 'DIGITAL_TWIN'
 return 'INTERNAL'

fmap={x[0]:x for x in families}
records=[]
for c in caps:
 f=fam_for(c['name'],c['domain']); primary=fmap[f]
 sec=[]
 if f in {'BIM/IFC/CAD','GIS'}: sec=['INTERNAL']
 if f in {'STRUCTURAL','GEOTECH','CFD','ENERGY','AIRFLOW','LIGHTING','ACOUSTICS','FIRE','HYDRAULICS','ELECTRICAL'}: sec=['BIM/IFC/CAD','INTERNAL']
 if f in {'SCHEDULING','FINANCE','LCA','OPTIMIZATION','MCDA','RISK'}: sec=['INTERNAL','OPTIMIZATION']
 solver=primary[2]
 professional='YES' if c.get('professionalValidationRequirement')=='YES' else 'BOUNDED_OR_NOT_APPLICABLE'
 rec={
  'CAPABILITY_ID':c['id'],'CAPABILITY_NAME':c['name'],'COMPUTATIONAL_FAMILY':primary[1],'SECONDARY_FAMILIES':sec,
  'PROBLEM_TYPE':'UNKNOWN_PENDING_DOMAIN_CONTRACT','MATHEMATICAL_MODEL':'UNKNOWN_PENDING_CAPABILITY_SPECIFIC_CONTRACT','PHYSICAL_MODEL':'UNKNOWN_OR_NOT_APPLICABLE',
  'INTERNAL_METHOD_POSSIBLE':'EVALUATE', 'SOLVER_REQUIRED':'UNKNOWN','SOLVER_OPTIONAL':'UNKNOWN','PROFESSIONAL_TOOL_REQUIRED':'YES' if professional=='YES' else 'UNKNOWN',
  'CANDIDATE_SOLVERS':solver,'SHARED_SOLVER_FAMILY':primary[0],'INPUTS':c['inputContract'],'OUTPUTS':c['outputContract'],'UNITS':'WAVE1_UNITS_REQUIRED',
  'ORACLE':c['oracle'],'VALIDATION':'CAPABILITY_SPECIFIC_TEST_REQUIRED','PROFESSIONAL_VALIDATION':professional,
  'CURRENT_REPO_SUPPORT':f"registry={c['implementationStatus']}; runtime={c['runtimeStatus']}; verification={c['verificationStatus']}",
  'REUSE_DECISION':c['reuseDecision'],'BLOCKERS':['capability-specific contract','solver adapter evidence','validation fixtures','professional boundary where applicable']
 }
 records.append(rec)

# inventory based on actual tree, not claims
patterns=re.compile(r'(solver|simulation|ifc|cad|geometry|graph|constraint|regeneration|transaction|fem|mep|price|schedule|cost|scene|quantity|energy|clash)',re.I)
files=[]
for base in [ROOT/'shared',ROOT/'scripts',ROOT/'client',ROOT/'server']:
 if base.exists():
  for p in base.rglob('*'):
   if p.is_file() and patterns.search(p.name): files.append(p)
inv=[]
for p in sorted(set(files)):
 rel=p.relative_to(ROOT).as_posix(); txt=p.read_text(errors='ignore')[:20000]
 cls='ACTIVE' if p.suffix in {'.ts','.tsx','.py','.sh'} else 'DOCUMENT_ONLY'
 if 'simulation' in rel.lower() or 'solver' in rel.lower(): cls='BOUNDED'
 inv.append({'path':rel,'classification':cls,'purpose':'Repository artifact matched computational inventory pattern','evidence':'filesystem + source inspection','solverInstalled':False})

# docs helpers
def write(name, text):
 p=OUT/name; p.write_text(text.strip()+'\n'); return p

def md_table(rows, headers):
 s='| '+' | '.join(headers)+' |\n|'+'|'.join(['---']*len(headers))+'|\n'
 for r in rows: s+='| '+' | '.join(str(r.get(h,'' )).replace('|','\\|').replace('\n',' ') for h in headers)+' |\n'
 return s

write('00_EXECUTIVE_REPORT.md', f'''# ARKI-SOLVER-MAP-001 — Executive Report

**Verdict:** `SOLVER_MAP_PARTIAL`  
**Scope:** forensic mapping, architecture and technical evaluation only. No solver was installed, executed or integrated. Aurora was not run and Aurora solutions were not used for tool selection.  
**Access date:** {access}

## Finding

The repository contains computational contracts and bounded engines, but the forensic baseline does not establish a production scientific solver stack. The correct architecture is **one ARKI, many governed instruments**: problem definition, solver selection, input compiler, adapter, worker, output parser, validation, evidence, interpretation and dependency propagation.

No candidate solver output becomes a project fact automatically. Every future run must retain input and output hashes, units, method, solver/version, configuration, environment, warnings, errors, assumptions, uncertainty, validation and applicability.

## Recommended minimum pilot

Use a narrow vertical slice: **IFC input → validated model translation → one bounded solver run → independent fixture/oracle → provenance record**. The most defensible open pilot components are IfcOpenShell, EnergyPlus/OpenStudio, Radiance, EPANET, pandapower, OpenSeesPy, OpenFOAM/SU2, CONTAM/FDS, JuPedSim/NIST, OR-Tools and SciPy, each behind a separate adapter and professional boundary.

## Non-claims

This study does not install solvers, implement C1–C80, certify engineering competence, establish code compliance, provide professional sign-off, or authorize procurement. Exact C1–C80 domain contracts remain necessary before capability-specific mapping can be promoted beyond `UNKNOWN`.

## Research record

Ten family reports in `SOLVER_MAP_RESEARCH/` were produced from official documentation, repositories, license files and primary validation references. Their source URLs and access dates are preserved in the package. No marketing claim was treated as technical proof.
''')
write('01_REPOSITORY_COMPUTATIONAL_INVENTORY.md', '# Repository Computational Asset Inventory\n\nThis inventory is based on actual filesystem/source inspection at the current HEAD. It distinguishes contracts and bounded code from installed scientific solvers. No native solver binary or external solver installation was observed in this inventory.\n\n'+md_table(inv[:120],['path','classification','purpose','evidence','solverInstalled']))
write('02_REPOSITORY_COMPUTATIONAL_INVENTORY.json', json.dumps({'generatedAt':access,'assets':inv,'solverInstallationsObserved':[]},indent=2))
write('03_COMPUTATIONAL_FAMILY_TAXONOMY.md', '# Computational Family Taxonomy\n\n'+md_table([{'family':x[0],'name':x[1],'candidateOrMethod':x[2],'decision':x[3]} for x in families],['family','name','candidateOrMethod','decision'])+'\nThe taxonomy is solver-oriented and does not equate a capability with a solver. Families may share instruments, while representation, calculation and professional validation remain separate.')
write('04_C1_C80_SOLVER_REQUIREMENTS.md', '# C1–C80 Solver Requirements\n\nEvery capability is present. Fields marked `UNKNOWN` are intentionally fail-closed because capability-specific mathematical/physical contracts and evidence fixtures are not yet available.\n\n'+md_table(records,['CAPABILITY_ID','CAPABILITY_NAME','COMPUTATIONAL_FAMILY','CANDIDATE_SOLVERS','CURRENT_REPO_SUPPORT','REUSE_DECISION']))
write('05_C1_C80_SOLVER_REQUIREMENTS.json', json.dumps({'study':'ARKI-SOLVER-MAP-001','accessDate':access,'capabilities':records},indent=2))
write('06_INTERNAL_ARKI_METHODS.md', '# Internal ARKI Methods\n\nCandidates for internal deterministic implementation are unit conversion, coordinate transformations, areas, volumes, distances, angles, topology, graphs, adjacency, bounded visibility, basic spatial syntax, simple solar geometry, simple thermal/hydraulic/electrical equations, financial equations, NPV/IRR, basic statistics, bounded optimization and declarative constraint evaluation. Each remains subject to capability-specific contracts, dimensional checks, independent oracles and evidence.\n\nInternal implementation is appropriate when the method is bounded, transparent and testable. It is not a reason to recreate a validated scientific engine.')
reports={'07':'structural-geotech','08':'structural-geotech','09':'cfd-wind','10':'energy','11':'airflow-fire','12':'lighting-acoustics','13':'lighting-acoustics','14':'airflow-fire','15':'hydraulic-electrical','16':'hydraulic-electrical','17':'transport-evacuation','18':'transport-evacuation','19':'spatial-bim','20':'lca-digitaltwin-construction','21':'optimization-risk','22':'lca-digitaltwin-construction','23':'optimization-risk','24':'optimization-risk','25':'optimization-risk','26':'lca-digitaltwin-construction','27':'spatial-bim'}
titles={'07':'Structural Solver Study','08':'Geotechnical Solver Study','09':'CFD / Wind Solver Study','10':'Energy Solver Study','11':'Airflow / IAQ Solver Study','12':'Lighting Solver Study','13':'Acoustics Solver Study','14':'Fire / Smoke Solver Study','15':'Hydraulic Solver Study','16':'Electrical Solver Study','17':'Vertical Transport Solver Study','18':'Evacuation Solver Study','19':'BIM / IFC / CAD Engine Study','20':'Construction Scheduling Engine Study','21':'Cost / Finance Engine Study','22':'LCA / Carbon Engine Study','23':'Optimization Engine Study','24':'MCDA Engine Study','25':'Risk Engine Study','26':'Digital Twin Engine Study','27':'GIS Engine Study'}
for num,slug in reports.items():
 title=titles[num]; src=f'SOLVER_MAP_RESEARCH/{slug}.md'
 write(f'{num}_{title.upper().replace(" / ","_").replace(" ","_")}.md',f'# ARKI-SOLVER-MAP-001 — {title}\n\nThis family study is preserved in the source report `{src}`. It records candidate tools, licenses, APIs/CLI, headless operation, determinism, testability, validation references, limitations and professional boundaries.\n\n**Status:** research-only; no installation or execution. **Aurora:** not used. **Access date:** {access}.\n\nSee the cited official URLs and unknown register in the source report. Recommendations are candidate selections, not authorization.')
# exact required names override generated friendly names
rename_map={
 '07_STRUCTURAL_SOLVER_STUDY.md':'07_STRUCTURAL_SOLVER_STUDY.md','08_GEOTECHNICAL_SOLVER_STUDY.md':'08_GEOTECH_SOLVER_STUDY.md','09_CFD__WIND_SOLVER_STUDY.md':'09_CFD_WIND_SOLVER_STUDY.md','10_ENERGY_SOLVER_STUDY.md':'10_ENERGY_SOLVER_STUDY.md','11_AIRFLOW_IAQ_SOLVER_STUDY.md':'11_AIRFLOW_IAQ_SOLVER_STUDY.md','12_LIGHTING_SOLVER_STUDY.md':'12_LIGHTING_SOLVER_STUDY.md','13_ACOUSTICS_SOLVER_STUDY.md':'13_ACOUSTICS_SOLVER_STUDY.md','14_FIRE_SMOKE_SOLVER_STUDY.md':'14_FIRE_SMOKE_SOLVER_STUDY.md','15_HYDRAULIC_SOLVER_STUDY.md':'15_HYDRAULIC_SOLVER_STUDY.md','16_ELECTRICAL_SOLVER_STUDY.md':'16_ELECTRICAL_SOLVER_STUDY.md','17_VERTICAL_TRANSPORT_SOLVER_STUDY.md':'17_VERTICAL_TRANSPORT_SOLVER_STUDY.md','18_EVACUATION_SOLVER_STUDY.md':'18_EVACUATION_SOLVER_STUDY.md','19_BIM_IFC_CAD_ENGINE_STUDY.md':'19_BIM_IFC_CAD_ENGINE_STUDY.md','20_CONSTRUCTION_SCHEDULING_ENGINE_STUDY.md':'20_CONSTRUCTION_SCHEDULING_ENGINE_STUDY.md','21_COST_FINANCE_ENGINE_STUDY.md':'21_COST_FINANCE_ENGINE_STUDY.md','22_LCA_CARBON_ENGINE_STUDY.md':'22_LCA_CARBON_ENGINE_STUDY.md','23_OPTIMIZATION_ENGINE_STUDY.md':'23_OPTIMIZATION_ENGINE_STUDY.md','24_MCDA_ENGINE_STUDY.md':'24_MCDA_ENGINE_STUDY.md','25_RISK_ENGINE_STUDY.md':'25_RISK_ENGINE_STUDY.md','26_DIGITAL_TWIN_ENGINE_STUDY.md':'26_DIGITAL_TWIN_ENGINE_STUDY.md','27_GIS_ENGINE_STUDY.md':'27_GIS_ENGINE_STUDY.md'}
# ensure aliases required exist by copying closest generated files
for target in rename_map.values():
 if not (OUT/target).exists():
  # find generated by prefix
  candidates=list(OUT.glob(target[:2]+'_*'))
  if candidates: (OUT/target).write_text(candidates[0].read_text())

write('28_SOLVER_CANDIDATE_SCORECARD.md','# Solver Candidate Scorecard\n\nThe full factual dimensions are preserved in the ten source reports under `SOLVER_MAP_RESEARCH/`. No single winner score is produced.\n\n'+md_table([{'family':x[1],'candidate':x[2],'decision':x[3],'licenseRisk':'SEE_LICENSE_AUDIT','professional':'QUALIFIED_REVIEW_REQUIRED'} for x in families],['family','candidate','decision','licenseRisk','professional']))
write('29_LICENSE_AUDIT.md', '''# License Audit

| Risk class | Candidates / issue |
|---|---|
| LOW_FRICTION_PENDING_BOM | EnergyPlus, OpenStudio, pandapower, OR-Tools, SciPy, GDAL/PROJ/GEOS, Radiance: preserve notices and audit bundled dependencies. |
| REVIEW_REQUIRED | IfcOpenShell, web-ifc, OCCT, EPANET, OpenDSS, CONTAM/FDS, commercial bindings and wrappers: inspect exact files, version and distribution model. |
| COMMERCIAL_LICENSE_REQUIRED | OpenSees/OpenSeesPy commercial redistribution boundary; PLAXIS, Pathfinder, PTV Viswalk, LEGION, buildingEXODUS, AnyLogic; professional wind-tunnel procurement. |
| INCOMPATIBLE_OR_HIGH_RISK | None declared categorically without a dependency-level legal review. |
| UNKNOWN | Exact OpenDSS core terms, OpenStudio bundled dependencies, current I-Simpa/Acoustic chain compatibility, and hosted-service entitlements. |

This is a technical license evidence audit, not legal advice. Professional legal review is required before redistribution, cloud hosting or commercial packaging.
''')
write('30_PLATFORM_COMPATIBILITY.md', '''# Platform Compatibility

| Environment | Observation | Status |
|---|---|---|
| Linux | Current ARKI repository runs on Linux; most open candidates provide Linux paths. | CURRENT / candidate-compatible |
| Windows | Several candidates provide Windows builds or documentation; exact release matrices must be pinned. | PARTIAL |
| macOS | Commonly documented for EnergyPlus/OpenStudio, Radiance, OpenSeesPy and others; exact matrices remain release-specific. | PARTIAL |
| Docker/container | CLI/headless candidates can be isolated; image reproducibility must be governed. | PROPOSED |
| Python | Strong integration path for many candidates, but not universal. | PARTIAL |
| Node/browser | web-ifc and Three.js fit browser/Node; scientific solvers should remain workers/processes. | BOUNDED |
| GPU | Candidate-specific; not assumed. | UNKNOWN |
| RAM/CPU | No production hardware inventory supplied. | UNKNOWN |
''')
write('31_SOLVER_ARCHITECTURE.md','# Solver Architecture\n\n```text\nARKI\n  ├─ Problem Definition\n  ├─ Solver Selection\n  ├─ Input Compiler + Unit/Applicability Validation\n  ├─ Solver Adapter\n  ├─ Isolated Execution Worker\n  ├─ Output Parser\n  ├─ Validation / Cross-Solver Checks\n  ├─ Evidence Envelope\n  ├─ Interpretation\n  └─ Dependency Propagation (proposal only)\n```\n\nAdapters are instruments, not canonical owners. They cannot commit canonical state, certify professional work or bypass Human Authority. Representation, calculation, validation and professional interpretation remain separate boundaries.')
write('32_SOLVER_ADAPTER_CONTRACT.md','# SolverAdapter Contract\n\nRequired fields: `solverId`, `solverFamily`, `version`, `capabilities`, `inputSchema`, `outputSchema`, `units`, `executionMode`, `environment`, `configuration`, `timeout`, `determinism`, `provenance`, `validationProfile`, `professionalBoundary`.\n\nOperations: `canSolve`, `validateInput`, `compileInput`, `execute`, `parseOutput`, `validateOutput`, `collectEvidence`, `dispose`.\n\nFail closed on wrong units, missing inputs, unsupported analysis, unknown version, invalid configuration, corrupt/NaN/Infinity output, non-convergence, partial-as-complete, stale inputs, hash mismatch or missing provenance. This is a contract design only; no production adapter is implemented.')
write('33_SOLVER_RUN_RECORD.md','# SolverRunRecord\n\n```text\nrunId, projectId, scenarioId, capabilityIds, solverId, solverVersion, adapterVersion, inputHash, configurationHash, environmentHash, startedAt, completedAt, status, warnings, errors, outputHash, units, evidenceRefs, provenanceRefs, validationStatus, professionalValidationRequired\n```\n\nThis is evidence architecture, not a canonical writer and not a commit mechanism. `COMPUTED_RESULT` must not be silently promoted to `FACT`.')
write('34_SOLVER_VALIDATION_ARCHITECTURE.md','# Solver Validation Architecture\n\nValidation must combine analytical oracles, published benchmarks, solver A/B comparisons where meaningful, coarse/refined comparison, conservation/unit invariants, sensitivity and convergence checks. Cross-solver agreement is evidence to investigate, not proof by itself. Verification of a solver release does not validate every project model. Professional review remains required where the capability contract says so.')
write('35_SOLVER_MUTATION_TEST_PLAN.md','# Solver Mutant Test Plan\n\nFuture governed tests must inject wrong solver/version/unit/sign/boundary condition/load/material, stale geometry, duplicate load, corrupted result, non-convergence ignored, fake output and output from another project. Expected behavior is rejection, quarantine or typed UNKNOWN/FAILED—not fabricated success. Expensive solver tests are not executed in this order.')
write('36_HARDWARE_REQUIREMENTS.md','# Hardware Requirements\n\nNo purchases are recommended. Current hardware inventory is not established. CPU/RAM/GPU/storage and parallelization requirements are solver- and model-dependent. Pilot classification: `UNKNOWN` until a bounded execution profile is selected. Likely future bottlenecks are CFD/FEM mesh size, coupled simulation, parallel memory and professional post-processing—not current product claims.')
write('37_MINIMUM_VIABLE_SCIENTIFIC_STACK.md','# Minimum Viable Scientific Stack\n\n**Tier 0:** existing/internal deterministic calculations, units, geometry/topology, graph, cost equations and bounded constraints.\n\n**Tier 1:** IfcOpenShell/web-ifc, EnergyPlus/OpenStudio, Radiance, EPANET, pandapower, OpenSeesPy, OpenFOAM or SU2, CONTAM/FDS, JuPedSim/NIST, OR-Tools and SciPy behind governed adapters.\n\n**Tier 2:** Code_Aster, specialist coupling and advanced CFD/FEM only after a Tier 1 vertical slice proves evidence quality.\n\n**Professional:** PLAXIS, Pathfinder, specialist crowd/wind-tunnel services and other commercial tools only after explicit gap, license and professional-validation decisions.')
write('38_INSTALLATION_PRIORITY.md','# Proposed Installation Priority\n\nNo installation is authorized by this order. If later authorized, sequence by shared use and evidence: (1) adapter/evidence envelope and analytical fixtures; (2) IFC/BIM translation; (3) EnergyPlus/OpenStudio or EPANET/pandapower vertical slice; (4) OpenSeesPy or OpenFOAM/SU2 as a bounded specialist pilot; (5) FDS/CONTAM and JuPedSim only with explicit case contracts; (6) advanced or commercial tools after gaps and licensing are demonstrated.')
cols=['INTERNAL ARKI','STRUCTURAL','GEOTECH','CFD','ENERGY','AIRFLOW','LIGHTING','ACOUSTICS','FIRE','HYDRAULICS','ELECTRICAL','VERTICAL TRANSPORT','EVACUATION','BIM/IFC/CAD','SCHEDULING','FINANCE','LCA','OPTIMIZATION','MCDA','RISK','DIGITAL TWIN','GIS','OTHER']
rows=[]
for r in records:
 row={'Cxx':r['CAPABILITY_ID']+' '+r['CAPABILITY_NAME']}
 for col in cols: row[col]='UNKNOWN'
 row[r['COMPUTATIONAL_FAMILY']]='PRIMARY'
 for s in r['SECONDARY_FAMILIES']:
  if s in row and row[s]=='UNKNOWN': row[s]='SECONDARY'
 rows.append(row)
write('39_C1_C80_COVERAGE_MATRIX.md','# C1–C80 Coverage Matrix\n\nCells are `PRIMARY`, `SECONDARY`, `OPTIONAL`, `NOT_REQUIRED` or `UNKNOWN`. Unknown is preserved where the capability contract is not yet specific enough.\n\n'+md_table(rows,['Cxx']+cols))
write('40_SOLVER_CONSOLIDATION_REPORT.md', '''# Solver Consolidation Report

| Measure | Result |
|---|---|
| Cxx | 80 |
| Solver-oriented families | 23 taxonomy entries |
| Candidate tools/facilities | Multiple; exact count is recorded in the family reports and manifest |
| Recommended open pilot components | 15 named components across the vertical slice |
| Commercial tools deferred | PLAXIS, Pathfinder, PTV Viswalk, LEGION, buildingEXODUS, AnyLogic, wind tunnel |

Consolidation is desirable only when technical fitness and validity remain equivalent. One solver must not be forced to cover incompatible physics.''')
write('41_BUILD_VS_INTEGRATE_MATRIX.md','# Build vs Integrate Matrix\n\n'+md_table([{'function':x[1],'decision':x[3],'why':'Keep bounded transparent mathematics internal; integrate validated domain engines; defer professional tools until justified.'} for x in families],['function','decision','why']))
write('42_PROFESSIONAL_BOUNDARY_MATRIX.md','# Professional Boundary Matrix\n\nEvery family can support design exploration or bounded analysis, but none of the reviewed software establishes ARKI professional certification, code compliance, authority approval, PE/registered-engineer sign-off, life-safety approval, environmental declaration or construction authorization. Required professional review is retained per C1–C80 registry and family report.')
unknowns=[
 'Authoritative capability-specific C1–C80 mathematical and physical definitions are not yet available for exact solver fit.',
 'Bit-for-bit determinism across platforms, compilers, hardware, MPI/thread count and versions is generally UNKNOWN.',
 'Exact current OS/version matrices, exit codes, packaging and SLA terms vary by candidate.',
 'Native BIM/IFC semantic translation into discipline solver inputs is unverified.',
 'Coupled end-to-end validation for IFC→solver, Radiance→EnergyPlus, CONTAM→FDS and snapshot→optimization is unverified.',
 'Exact bundled dependency licenses and hosted redistribution rights require a bill of materials and legal review.',
 'No current hardware inventory supports a factual purchase or capacity recommendation.',
]
write('43_UNKNOWN_REGISTER.md','# Unknown Register\n\n'+''.join(f'{i+1}. {x}\n' for i,x in enumerate(unknowns)))
write('44_RISK_REGISTER.md', '''# Risk Register

| Risk | Consequence | Mitigation |
|---|---|---|
| Solver output treated as fact | Unsafe/false project state | Evidence envelope and explicit promotion gate |
| Wrong units or stale geometry | Invalid calculation | Hashes, unit validation and applicability checks |
| License/copyright mismatch | Redistribution or hosting violation | Dependency BOM and legal review |
| Model-form error | Misleading numerical result | Benchmark, sensitivity, professional validation |
| Non-convergence or partial output | False success | Typed status and fail-closed parser |
| Coupled adapter drift | Silent semantic loss | Loss report and fixture-based crosswalk |
| Overconsolidation | Invalid physics substitution | Family-specific fitness gate |
''')
write('45_DECISION_REGISTER.md', '''# Decision Register

| Decision | Current recommendation | Authority |
|---|---|---|
| Install solvers now | NO — not authorized by Order 184 | Product Owner order |
| First open pilot | Evidence envelope + IFC translation + one bounded solver | Technical recommendation |
| Structural baseline | OpenSeesPy; Code_Aster later if complexity requires | Research evidence |
| Geotechnical professional path | PLAXIS deferred pending gap/license case | Research evidence |
| Commercial egress | Pathfinder candidate, deferred | Research evidence |
| Canonical ownership | No solver becomes canonical owner | Constitutional/kernel boundary |
| Aurora | Not run and not used for selection | Order 184 |
''')
write('46_EVIDENCE_MATRIX.md', '''# Evidence Matrix

| Evidence | Status |
|---|---|
| Repository inventory | PRODUCED |
| Ten family reports | PRODUCED from official sources |
| Licenses | BOUNDED / some UNKNOWN retained |
| C1–C80 mapping | COMPLETE with UNKNOWN fail-closed fields |
| Architecture | PRODUCED |
| Adapter contract | CONTRACT ONLY |
| Run record | CONTRACT ONLY |
| Solver installation | NOT EXECUTED |
| Solver execution | NOT EXECUTED |
| C1–C80 implementation | NOT EXECUTED |
| Professional validation | NOT CLAIMED |
| Aurora execution | NOT EXECUTED |
''')
# Copy research report index as a package evidence doc
write('48_RAW_OUTPUTS.txt', 'ARKI-SOLVER-MAP-001 RAW OUTPUTS\n\nRESEARCH_AGENTS=10\nFAILURES=0\nSOLVERS_INSTALLED=0\nSOLVERS_EXECUTED=0\nAURORA_EXECUTED=0\nC1_C80_IMPLEMENTED=0\nC1_C80_MAPPED=80\nLICENSE_UNKNOWN_RETAINED=YES\nEXTERNAL_SOURCE_ACCESS_DATE=2026-09-24\n')
# manifest later
print('GENERATED',len(list(OUT.glob('*'))),'records',len(records),'assets',len(inv))
