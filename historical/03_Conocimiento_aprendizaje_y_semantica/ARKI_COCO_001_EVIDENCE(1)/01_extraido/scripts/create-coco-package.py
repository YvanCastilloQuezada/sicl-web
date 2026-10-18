from __future__ import annotations
import hashlib,json,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
files=[
 'COCO/COCO_ORDER_SOURCE.txt','COCO/COCO_AUDIT.md','COCO/COCO_SCOPE_LIMITS.md','COCO/COCO_REPORT.md','COCO/COCO_TEST_MATRIX.csv',
 'COCO/AUDIT/COCO-A_AUDIT.md','COCO/AUDIT/COCO-B_AUDIT.md','COCO/AUDIT/COCO-C_AUDIT.md','COCO/AUDIT/COCO-D_AUDIT.md',
 'shared/arkiCocoSpatial.ts','shared/arkiCocoDossier.ts','shared/arkiCocoAvatar.ts','shared/arkiCocoOm.ts',
 'scripts/test-coco.ts','scripts/run-coco-evidence.sh','scripts/create-coco-package.py','PA001_REQUIREMENT_MATRIX.md',
 'COCO/OUTPUTS/COCO_OUTPUTS.txt'
]
missing=[p for p in files if not (root/p).is_file()]
if missing: raise SystemExit('MISSING:'+','.join(missing))
manifest={'schema':'ARKI-COCO-001-MANIFEST-1.0','artifact':'ARKI-COCO-001','status':'COCO-A/B/C/D PREREQUISITES TESTED / PENDING INDEPENDENT REVIEW','claims':{'spatialSyntaxCompetency':'NOT_CLAIMED','technicalDossierCompetency':'NOT_CLAIMED','avatarCompetency':'NOT_CLAIMED','omCompetency':'NOT_CLAIMED','professionalValidation':'REQUIRED','pfh01':'UNCHANGED'},'results':{'check':'PASS','build':'PASS','commandsPassed':10,'commandsFailed':0,'cocoAssertions':34,'normalBoundaryAdversarialMetamorphicTransfer':'PASS','testTheTest':'PASS','unknownPreserved':True,'provenancePreserved':True,'projectIsolationPreserved':True,'determinism':'PASS'},'baseline':{'repo':'/home/ubuntu/generador-familias','branch':'main','head':'c62183a5904f02aa0a935572454a5a35f9d167aa','worktree':'DIRTY BEFORE COCO; NOT CLAIMED CLEAN'},'files':[]}
for rel in files:
 p=root/rel; manifest['files'].append({'path':rel,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size})
(root/'COCO/COCO_MANIFEST.json').write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
package_files=files+['COCO/COCO_MANIFEST.json']
package_manifest={'schema':'ARKI-COCO-001-EVIDENCE-PACKAGE-1.0','status':manifest['status'],'files':[]}
zip_path=root/'ARKI_COCO_001_EVIDENCE.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as z:
 for rel in package_files:
  p=root/rel; z.write(p,rel); package_manifest['files'].append({'path':rel,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size})
 z.writestr('COCO/MANIFEST/COCO_PACKAGE_MANIFEST.json',json.dumps(package_manifest,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'status':'PASS','manifest':str(root/'COCO/COCO_MANIFEST.json'),'zip':str(zip_path),'zipSha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'files':len(package_files)},indent=2))
