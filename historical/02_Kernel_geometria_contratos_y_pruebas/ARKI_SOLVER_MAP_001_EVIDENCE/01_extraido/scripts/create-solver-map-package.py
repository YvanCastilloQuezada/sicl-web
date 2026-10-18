from __future__ import annotations
import hashlib, json, subprocess, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'ARKI_SOLVER_MAP_001_EVIDENCE'
if (OUT/'08_GEOTECHNICAL_SOLVER_STUDY.md').exists(): (OUT/'08_GEOTECHNICAL_SOLVER_STUDY.md').unlink()
source_paths=['scripts/create-solver-map.py','scripts/create-solver-map-package.py','scripts/test-solver-map-package.py','pasted_content_184.txt','C1_C80_WAVE1_REGISTRY.json']
for p in source_paths:
 if not (ROOT/p).is_file(): raise SystemExit('MISSING '+p)
files=[]
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
for p in sorted(OUT.iterdir()):
 if p.is_file() and p.name!='47_MANIFEST.json': files.append({'path':p.relative_to(ROOT).as_posix(),'sha256':digest(p),'bytes':p.stat().st_size})
for rel in sorted(Path('SOLVER_MAP_RESEARCH').glob('*.md')):
 p=ROOT/rel; files.append({'path':rel.as_posix(),'sha256':digest(p),'bytes':p.stat().st_size})
for rel in source_paths:
 p=ROOT/rel; files.append({'path':rel,'sha256':digest(p),'bytes':p.stat().st_size})
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=ROOT,text=True).strip()
branch=subprocess.check_output(['git','branch','--show-current'],cwd=ROOT,text=True).strip()
status=subprocess.check_output(['git','status','--porcelain'],cwd=ROOT,text=True)
manifest={'artifact':'ARKI-SOLVER-MAP-001','verdict':'SOLVER_MAP_PARTIAL','scope':'FORENSIC_MAPPING_ARCHITECTURE_TECHNICAL_EVALUATION_ONLY','accessDate':'2026-09-24','head':head,'branch':branch,'worktreeEntries':len(status.splitlines()),'aurora':{'executed':False,'solutionsUsed':False},'solvers':{'installed':False,'executed':False,'adaptersImplemented':False},'c1c80':{'mapped':80,'implemented':0,'promoted':0},'computationalFamilies':23,'requiredOutputs':49,'outputFiles':[x['path'] for x in files if x['path'].startswith('ARKI_SOLVER_MAP_001_EVIDENCE/')]+['ARKI_SOLVER_MAP_001_EVIDENCE/47_MANIFEST.json'],'files':files}
(OUT/'47_MANIFEST.json').write_text(json.dumps(manifest,indent=2)+'\n')
zip_path=ROOT/'ARKI_SOLVER_MAP_001_EVIDENCE.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(OUT.iterdir()):
  if p.is_file(): z.write(p,p.relative_to(ROOT).as_posix())
 for x in files:
  if not x['path'].startswith('ARKI_SOLVER_MAP_001_EVIDENCE/'):
   z.write(ROOT/x['path'],x['path'])
sha=hashlib.sha256(zip_path.read_bytes()).hexdigest(); (ROOT/'ARKI_SOLVER_MAP_001_EVIDENCE.zip.sha256').write_text(f'{sha}  {zip_path.name}\n')
print(f'ZIP={zip_path}\nSHA256={sha}\nOUTPUTS={len(manifest["outputFiles"])}\nPACKAGE_FILES={len(files)+1}')
