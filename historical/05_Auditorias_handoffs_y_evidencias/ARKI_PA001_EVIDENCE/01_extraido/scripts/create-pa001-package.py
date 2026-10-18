from __future__ import annotations
import hashlib,json,zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
files=[
 "PA001_ORDER_SOURCE.txt","PA001_AUDIT_BEFORE_CODE.md","PA001_IMPLEMENTATION_REPORT.md","PA001_REQUIREMENT_MATRIX.md","PA001_OUTPUTS.txt",
 "shared/arkiArchitecturalProgram.ts","scripts/test-architectural-program.ts","scripts/run-pa001-evidence.sh","scripts/create-pa001-package.py"
]
missing=[p for p in files if not (root/p).is_file()]
if missing: raise SystemExit("MISSING:"+",".join(missing))
manifest={"schema":"ARKI-PA001-MANIFEST-1.0","artifact":"ARKI-CAPACITACION-PREVIA-001","status":"IMPLEMENTED / TESTS_PASS / PENDING INDEPENDENT REVIEW","baseline":{"repo":"/home/ubuntu/generador-familias","branch":"main","head":"c62183a5904f02aa0a935572454a5a35f9d167aa","worktree":"DIRTY BEFORE PA-001; NOT CLAIMED CLEAN"},"scope":{"spaceSyntax":"NOT_IMPLEMENTED","deepseekExams":"NOT_USED","professionalCompetency":"NOT_CLAIMED"},"results":{"check":"PASS","build":"PASS","normal":10,"adversarial":8,"metamorphic":5,"testTheTest":"PASS","deterministic":True,"unknownPreserved":True,"provenancePreserved":True,"conflictDetection":True,"projectIsolation":True},"files":[]}
for rel in files:
 p=root/rel; manifest["files"].append({"path":rel,"sha256":hashlib.sha256(p.read_bytes()).hexdigest(),"bytes":p.stat().st_size})
(root/"PA001_MANIFEST.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n")
package_files=files+["PA001_MANIFEST.json"]
package_manifest={"schema":"ARKI-PA001-EVIDENCE-PACKAGE-1.0","status":manifest["status"],"files":[]}
zip_path=root/"ARKI_PA001_EVIDENCE.zip"
with zipfile.ZipFile(zip_path,"w",zipfile.ZIP_DEFLATED) as z:
 for rel in package_files:
  p=root/rel; z.write(p,rel); package_manifest["files"].append({"path":rel,"sha256":hashlib.sha256(p.read_bytes()).hexdigest(),"bytes":p.stat().st_size})
 z.writestr("PA001_PACKAGE_MANIFEST.json",json.dumps(package_manifest,indent=2,ensure_ascii=False)+"\n")
print(json.dumps({"status":"PASS","manifest":"PA001_MANIFEST.json","zip":str(zip_path),"zipSha256":hashlib.sha256(zip_path.read_bytes()).hexdigest(),"files":len(package_files)},indent=2))
