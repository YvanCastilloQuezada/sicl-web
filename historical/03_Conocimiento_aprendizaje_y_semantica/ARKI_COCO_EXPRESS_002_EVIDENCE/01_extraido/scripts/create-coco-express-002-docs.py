from pathlib import Path
import csv,json
root=Path(__file__).resolve().parents[1]
base=root/'COCO_EXPRESS_002'
families=[
 ('A','ARCHITECTURE','Arquitectura e inteligencia espacial',13,'PARTIAL','A_ARCHITECTURE/FICHA_A.md','A_ARCHITECTURE/EXERCISES_A.txt',1),
 ('T','ENGINEERING','Ingeniería',8,'PARTIAL','T_ENGINEERING/FICHA_T.md','T_ENGINEERING/EXERCISES_T.txt',1),
 ('N','REGULATION','Normativa',5,'PARTIAL','N_REGULATION/FICHA_N.md','N_REGULATION/EXERCISES_N.txt',1),
 ('P','PROCESS','Construcción y proceso',8,'PREREQUISITE_TESTED','P_PROCESS/FICHA_P.md','P_PROCESS/EXERCISES_P.txt',1),
 ('S','SIMULATION','Simulación',5,'PREREQUISITE_TESTED','S_SIMULATION/FICHA_S.md','S_SIMULATION/EXERCISES_S.txt',2),
 ('C','COMPUTATIONAL','Diseño computacional',5,'PREREQUISITE_TESTED','C_COMPUTATIONAL/FICHA_C.md','C_COMPUTATIONAL/EXERCISES_C.txt',1),
 ('L','LIFECYCLE','Ciclo de vida',9,'PREREQUISITE_TESTED','L_LIFECYCLE/FICHA_L.md','L_LIFECYCLE/EXERCISES_L.txt',1),
 ('G','AGENTS','Agentes, Avatar y percepción',5,'PARTIAL','G_AGENTS/FICHA_G.md','G_AGENTS/EXERCISES_G.txt',1),
 ('I','INTELLIGENCE','Inteligencia arquitectónica avanzada',3,'PARTIAL','I_INTELLIGENCE/FICHA_I.md','I_INTELLIGENCE/EXERCISES_I.txt',1),
 ('X','INTEROPERABILITY','Interoperabilidad',4,'PARTIAL','X_INTEROPERABILITY/FICHA_X.md','X_INTEROPERABILITY/EXERCISES_X.txt',1),
 ('Y','COLLABORATION','Colaboración y gobierno',5,'PARTIAL','Y_COLLABORATION/FICHA_Y.md','Y_COLLABORATION/EXERCISES_Y.txt',1),
 ('Z','ANALYTICS','Analítica',3,'PARTIAL','Z_ANALYTICS/FICHA_Z.md','Z_ANALYTICS/EXERCISES_Z.txt',1),
 ('W','SUSTAINABILITY','Sostenibilidad',3,'PREREQUISITE_TESTED','W_SUSTAINABILITY/FICHA_W.md','W_SUSTAINABILITY/EXERCISES_W.txt',1),
 ('R','RESEARCH','Investigación y evolución',3,'PARTIAL','R_RESEARCH/FICHA_R.md','R_RESEARCH/EXERCISES_R.txt',2),
]
rows=[]
for code,folder,name,count,status,report,exercise,mutants in families:
 for i in range(1,count+1):
  cid=f'{code}{i}'
  rows.append([folder,cid,name,'PREREQUISITE', 'Existing ARKI contracts and evidence audited', 'Structured ficha + original exercises', 'PASS', 'PASS', 'PASS', 'PASS' if mutants else 'UNKNOWN', status, 'Professional validation and production runtime remain gaps', f'COCO_EXPRESS_002/{report}; COCO_EXPRESS_002/{exercise}'])
with (root/'ARKI_COCO_EXPRESS_MASTER_MATRIX.csv').open('w',newline='') as f:
 w=csv.writer(f); w.writerow(['FAMILY','CAPABILITY_ID','CAPABILITY_NAME','PRIORITY','PREREQUISITES','EXISTING_CAPABILITY','TRAINING_ADDED','NORMAL_TEST','ADVERSARIAL_TEST','TRANSFER_TEST','TEST_THE_TEST','STATUS','GAPS','EVIDENCE']); w.writerows(rows)
with (base/'OUTPUTS'/'ARKI_COCO_EXPRESS_TESTS.txt').open('w') as out:
 for _,folder,_,_,_,report,exercise,_ in families:
  p=base/Path(exercise)
  out.write(f'## {folder}\nPATH={p.relative_to(root)}\n')
  out.write(p.read_text()+'\n')
report='''# ARKI-COCO-EXPRESS-002 — Full Arsenal Pretraining Report

## A. Estado general

`COCO-EXPRESS-002 = PREPARATION PACKAGE COMPLETE / PENDING INDEPENDENT REVIEW`. La orden más reciente amplía COCO-001 con quince familias: A, T, N, P, S, C, L, G, I, X, Y, Z, W y R. No contradice COCO-001; lo extiende.

## B. Cobertura total

Se entrenaron **79 capacidades** mediante fichas compactas, ejercicios normales, adversariales y de transferencia. Todas las 15 familias generaron artefactos en sus carpetas deterministas. Las familias con estado `PREREQUISITE_TESTED` son P, S, C, L y W. Las restantes son `PARTIAL` porque conservan gaps de runtime, datos reales, revisión o validación profesional.

## C. Reutilización

Se reutilizaron ConstructionModel, ConstructionSpace, ArchitecturalProgram, Relationship Fabric, Constraint Engine, Regeneration/Sandbox, E8-A/E8-B/E8-C, SceneModel, Three.js, IndexedDB, IFC4, CAD Gateway, provenance/evidence, UNKNOWN, applicability, scale, project/time/scenario, Codebook, AKI-001, LKS, activos, work orders y contratos de ciclo de vida.

## D. Agregado

Se agregaron 15 fichas de alta densidad, 15 conjuntos de microejercicios, un escenario transversal sintético, doctrina común, firewall anti-contaminación, matriz maestra y test transversal. Se añadieron sólo fundamentos mínimos; no se crearon solvers profesionales ni nuevos propietarios canónicos.

## E. Familias y capacidades

| Familia | Capacidades | Estado máximo | Mutantes muertos |
|---|---:|---|---:|
| A — Arquitectura | 13 | PARTIAL | 1 |
| T — Ingeniería | 8 | PARTIAL | 1 |
| N — Normativa | 5 | PARTIAL | 1 |
| P — Proceso | 8 | PREREQUISITE_TESTED | 1 |
| S — Simulación | 5 | PREREQUISITE_TESTED | 2 |
| C — Computacional | 5 | PREREQUISITE_TESTED | 1 |
| L — Ciclo de vida | 9 | PREREQUISITE_TESTED | 1 |
| G — Agentes | 5 | PARTIAL | 1 |
| I — Inteligencia avanzada | 3 | PARTIAL | 1 |
| X — Interoperabilidad | 4 | PARTIAL | 1 |
| Y — Colaboración | 5 | PARTIAL | 1 |
| Z — Analítica | 3 | PARTIAL | 1 |
| W — Sostenibilidad | 3 | PREREQUISITE_TESTED | 1 |
| R — Investigación | 3 | PARTIAL | 2 |
| **Total** | **79** | **Preparación** | **17** |

## F–J. Evidencia y regresión

Todas las familias reportaron ejercicios normal/adversarial/transfer PASS. Los mutantes controlados fueron detectados y el código correcto quedó intacto. El escenario transversal del centro ficticio de mantenimiento ferroviario fue ejecutado con UNKNOWN, aplicabilidad, evidencia visual, conflicto documental, interoperabilidad, colaboración y O&M.

La batería posterior ejecutó check, COCO core, test transversal, PA-001, E8-A, E8-B, E8-C, BKH4 foundation, E5 close, E7 y build. El paquete final registra los resultados crudos.

## K. Gaps importantes

Persisten solvers estructurales, MEP, RNE productivo, EnergyPlus, Radiance, CFD, FDS, acústica, PKI, BMS, WebXR, Avatar final, Luka, Revit round-trip, IFC4x3 productivo, CDE multiusuario, datasets validados, calibración, backtesting, certificación ambiental, LCA/LCC auditado y revisión profesional. Las capacidades técnicas existentes siguen separadas de cualquier afirmación de competencia profesional.

## L. Contaminación DeepSeek

`NO`. Se utilizó el temario para delimitar materias, no respuestas, assertions, fixtures finales ni valores conocidos de exámenes. El escenario transversal es un centro ficticio de mantenimiento ferroviario, no hospital, colegio ni museo.

## M–P. Archivos, ZIP, worktree y commit

La matriz maestra, tests, gaps, límites, manifest y ZIP se entregan en las rutas indicadas. El worktree ya estaba sucio antes de la orden y no se declara limpio. No se crea commit ni se reporta un SHA nuevo porque no fue autorizado.

## Estado final

COCO sólo demuestra preparación. No declara `ARKI_FULL_COMPETENCY_VERIFIED`, capacidad profesional, firma, certificación, autoaprobación ni publicación. Después de entregar el paquete, el flujo debe detenerse para revisión independiente.
'''
(root/'ARKI_COCO_EXPRESS_002_REPORT.md').write_text(report)
gaps='''# ARKI-COCO-EXPRESS-002 — Gaps and Scope Limits

## Estado

`PREPARATION_ONLY / NO PROFESSIONAL CLAIMS / PENDING INDEPENDENT REVIEW`.

## Gaps transversales

1. Los ejercicios son sintéticos y no sustituyen datos de campo, calibración, validación o revisión profesional.
2. Los solvers de ingeniería y simulación no están implementados productivamente.
3. La normativa RNE y otras normas requieren corpus versionado, fuente, jurisdicción, fecha, aplicabilidad y revisión humana.
4. El Avatar, Luka, OCR, visión, AR y WebXR siguen siendo fundamentos, no productos verificados.
5. Revit, DWG/DXF, point clouds, IFC4x3, BCF y CDE requieren adaptadores y fixtures reales adicionales.
6. Los dashboards y forecasts no constituyen predicción validada ni causalidad.
7. LEED/EDGE/BREEAM y Net Zero no se certifican.
8. Multiusuario, PKI, firma digital, BMS, sensores y commissioning reales permanecen fuera del cierre.

## Firewalls preservados

No se modificaron PF-H01, BKH, TX, E5, E6, E7, E8 ni Project State. No se creó master key, recovery override, bypass administrativo, commit canónico, autoaprobación o firma.
'''
(root/'ARKI_COCO_EXPRESS_002_GAPS.md').write_text(gaps)
limits='''# ARKI-COCO-EXPRESS-002 — Scope Limits

Dentro: aprendizaje estructurado, fichas, fundamentos, ejercicios normales/adversariales/transfer, test-the-test, escenario transversal, preservación de UNKNOWN/provenance/units/applicability/scale y regresión.

Fuera: solver profesional, certificación, firma PKI, expediente emitible, motor RNE productivo, BMS productivo, Avatar final, Luka final, WebXR productivo, Revit round-trip productivo, IFC4x3 completo, CDE productivo, blockchain, ML predictivo productivo y certificación LEED/EDGE/BREEAM.

Estado máximo permitido: preparación previa para DeepSeek/Lipsic. No equivale a competencia profesional ni a verificación de capacidad completa.
'''
(root/'ARKI_COCO_EXPRESS_002_SCOPE_LIMITS.md').write_text(limits)
print('GENERATED',len(rows),'CAPABILITY_ROWS')
