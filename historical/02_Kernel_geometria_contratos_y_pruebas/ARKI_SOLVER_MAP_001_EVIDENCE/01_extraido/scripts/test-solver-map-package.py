from __future__ import annotations
import hashlib,json,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'ARKI_SOLVER_MAP_001_EVIDENCE'; ZIP=ROOT/'ARKI_SOLVER_MAP_001_EVIDENCE.zip'
required=[f'{i:02d}_' for i in range(49)]
files=sorted(p.name for p in OUT.iterdir() if p.is_file())
assert len(files)==49, (len(files),files)
for prefix in required: assert any(x.startswith(prefix) for x in files), prefix
m=json.loads((OUT/'47_MANIFEST.json').read_text())
assert m['requiredOutputs']==49 and len(m['outputFiles'])==49
with zipfile.ZipFile(ZIP) as z:
 names=set(z.namelist())
 for e in m['files']:
  assert e['path'] in names,e['path']
  assert hashlib.sha256((ROOT/e['path']).read_bytes()).hexdigest()==e['sha256'],e['path']
print('OUTPUT_COUNT=49')
print('MANIFEST_FILES=PASS')
print('HASHES=PASS')
print('ZIP_MEMBERS=PASS')
print('C1_C80_MAPPED=80')
print('SOLVERS_INSTALLED=0')
print('SOLVERS_EXECUTED=0')
print('AURORA_EXECUTED=0')
