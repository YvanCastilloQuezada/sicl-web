from __future__ import annotations
import hashlib, json, subprocess, zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
evidence=root/'C1C80_ASSIMILATION_EVIDENCE'
source_files=['shared/arkiCapabilityAssimilation.ts','scripts/run-c1c80-assimilation.ts','scripts/test-assimilation-framework.ts','scripts/create-assimilation-package.py','C1_C80_WAVE1_REGISTRY.json','DIGEST-001_EVIDENCE/18_C1_C80_READINESS_MATRIX.md','pasted_content_183.txt']
(root/'pasted_content_183.txt').write_bytes(Path('/home/ubuntu/upload/pasted_content_183.txt').read_bytes())
for rel in source_files:
 if not (root/rel).is_file(): raise SystemExit(f'MISSING:{rel}')
def h(data): return f'sha256:v1:{hashlib.sha256(data).hexdigest()}'
files=[]
for f in sorted(evidence.rglob('*')):
 if f.is_file() and f.name!='28_MANIFEST.json':
  files.append({'path':f.relative_to(root).as_posix(),'sha256':h(f.read_bytes()),'bytes':f.stat().st_size})
for rel in source_files:
 f=root/rel; files.append({'path':rel,'sha256':h(f.read_bytes()),'bytes':f.stat().st_size})
head=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
branch=subprocess.check_output(['git','branch','--show-current'],cwd=root,text=True).strip()
status=subprocess.check_output(['git','status','--porcelain'],cwd=root,text=True)
manifest={'artifact':'ARKI-C1C80-ASSIMILATE-001','status':'ASSIMILATION_PROGRAM_PARTIAL','head':head,'branch':branch,'worktreeEntries':len([x for x in status.splitlines() if x]),'quarantine':{'enforced':True,'violations':0,'AuroraSolutionsUsed':False},'counts':{'attempted':80,'documented':80,'digested':80,'implementedBounded':0,'adversariallyTested':0,'transferTested':0,'verifiedBounded':0},'files':files}
mp=evidence/'28_MANIFEST.json'; mp.write_text(json.dumps(manifest,indent=2)+'\n')
files=[x for x in files if x['path']!='C1C80_ASSIMILATION_EVIDENCE/28_MANIFEST.json']
with zipfile.ZipFile(root/'ARKI_C1C80_ASSIMILATION_EVIDENCE.zip','w',zipfile.ZIP_DEFLATED) as z:
 z.write(mp,mp.relative_to(root).as_posix())
 for x in files: z.write(root/x['path'],x['path'])
zip_path=root/'ARKI_C1C80_ASSIMILATION_EVIDENCE.zip'; digest=hashlib.sha256(zip_path.read_bytes()).hexdigest()
(zip_path.with_suffix('.zip.sha256')).write_text(f'{digest}  {zip_path.name}\n')
print(f'ASSIMILATION_ZIP={zip_path}')
print(f'ASSIMILATION_SHA256={digest}')
print(f'FILES={len(files)+1}')
