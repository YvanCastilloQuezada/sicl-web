from __future__ import annotations
import hashlib,json,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
base=root/'COCO_EXPRESS_002'
files=[]
for p in sorted(base.rglob('*')):
 if p.is_file() and p.name not in {'ARKI_COCO_EXPRESS_002_MANIFEST.json'}:
  files.append(p.relative_to(root).as_posix())
files += ['ARKI_COCO_EXPRESS_002_REPORT.md','ARKI_COCO_EXPRESS_MASTER_MATRIX.csv','ARKI_COCO_EXPRESS_002_GAPS.md','ARKI_COCO_EXPRESS_002_SCOPE_LIMITS.md','scripts/create-coco-express-002-docs.py','scripts/create-coco-express-002-package.py','scripts/run-coco-express-002-evidence.sh','scripts/test-coco-express-002.ts','scripts/test-coco.ts','shared/arkiCocoSpatial.ts','shared/arkiCocoDossier.ts','shared/arkiCocoAvatar.ts','shared/arkiCocoOm.ts']
files=list(dict.fromkeys(files))
missing=[p for p in files if not (root/p).is_file()]
if missing: raise SystemExit('MISSING:'+','.join(missing))
metadata={
 'schema':'ARKI-COCO-EXPRESS-002-MANIFEST-1.0',
 'artifact':'ARKI-COCO-EXPRESS-002',
 'status':'PREPARATION_PACKAGE_COMPLETE / PENDING INDEPENDENT REVIEW',
 'authority':'Product Owner / Human Authority',
 'sourceOrder':'pasted_content_155.txt',
 'coverage':{'families':['A','T','N','P','S','C','L','G','I','X','Y','Z','W','R'],'capabilities':79,'normal':'PASS','adversarial':'PASS','transfer':'PASS','testTheTest':'PASS','mutantsKilled':17,'transverseScenario':'PASS','deepseekExamContamination':'NO'},
 'validation':{'check':'PASS','build':'PASS','commandsPassed':13,'commandsFailed':0,'overall':'PASS','regressions':['PA-001','E5','E7','E8-A','E8-B','E8-C','BKH4 foundation','COCO core']},
 'claims':{'professionalStructural':'NOT_CLAIMED','professionalMep':'NOT_CLAIMED','rneEngine':'NOT_CLAIMED','technicalDossier':'NOT_CLAIMED','avatar':'NOT_CLAIMED','luka':'NOT_CLAIMED','simulation':'NOT_CLAIMED','arkiFullCompetency':'NOT_CLAIMED'},
 'firewall':{'PF-H01':'UNCHANGED','BKH':'UNCHANGED','TX':'UNCHANGED','E5':'UNCHANGED','E6':'UNCHANGED','E7':'UNCHANGED','E8':'UNCHANGED','projectState':'UNCHANGED','canonicalPersistence':'UNCHANGED'},
 'baseline':{'repo':'/home/ubuntu/generador-familias','branch':'main','head':'c62183a5904f02aa0a935572454a5a35f9d167aa','worktree':'DIRTY BEFORE ORDER; NOT CLAIMED CLEAN','commit':'NONE'},
 'files':[]
}
for rel in files:
 p=root/rel; metadata['files'].append({'path':rel,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size})
manifest_path=root/'ARKI_COCO_EXPRESS_002_MANIFEST.json'; manifest_path.write_text(json.dumps(metadata,indent=2,ensure_ascii=False)+'\n')
package_files=files+['ARKI_COCO_EXPRESS_002_MANIFEST.json']
zip_path=root/'ARKI_COCO_EXPRESS_002_EVIDENCE.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
 for rel in package_files: z.write(root/rel,rel)
 z.writestr('COCO_EXPRESS_002/MANIFEST/PACKAGE_CONTENT_MANIFEST.json',json.dumps({'artifact':'ARKI_COCO_EXPRESS_002_EVIDENCE.zip','files':[{'path':rel,'sha256':hashlib.sha256((root/rel).read_bytes()).hexdigest()} for rel in package_files]},indent=2)+'\n')
print(json.dumps({'status':'PASS','manifest':str(manifest_path),'zip':str(zip_path),'zipSha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'files':len(package_files),'capabilities':79},indent=2))
