from __future__ import annotations
import hashlib, json, zipfile
from pathlib import Path
root = Path(__file__).resolve().parents[1]
evidence = root / 'DIGEST-001_EVIDENCE'
source_files = [
    'shared/arkiCapabilityDigest.ts',
    'shared/arkiSharedFoundation.ts',
    'scripts/test-capability-digest.ts',
    'scripts/test-digest-preflight.ts',
    'scripts/run-capability-digest.ts',
    'scripts/test-wave1-foundation.ts',
    'scripts/create-digest-package.py',
    'C1_C80_WAVE1_REGISTRY.json',
    'C1_C80_WAVE1_DAG.json',
    'F0_C1_C80_FOUNDATION_MAP.md',
    'WAVE1_IMPLEMENTATION_REPORT.md',
    'WAVE1_SCOPE_LIMITS.md',
    'WAVE1_ORDER_SOURCE_180.txt',
    'pasted_content_181.txt',
]
for rel in source_files:
    if not (root / rel).is_file(): raise SystemExit(f'MISSING_SOURCE:{rel}')
files = []
for file in sorted(evidence.rglob('*')):
    if file.is_file():
        rel = file.relative_to(root).as_posix()
        data = file.read_bytes()
        files.append({'path': rel, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)})
for rel in source_files:
    data = (root / rel).read_bytes()
    files.append({'path': rel, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)})
manifest = {'artifact': 'ARKI-CAPABILITY-DIGEST-001', 'status': 'DIGEST_PIPELINE_PARTIAL', 'c1c80Digested': 80, 'readinessDistribution': {'KNOWLEDGE_DEFICIT': 80}, 'canonicalMutation': False, 'files': files}
manifest_path = evidence / '27_MANIFEST.json'
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
files = [item for item in files if item['path'] != 'DIGEST-001_EVIDENCE/27_MANIFEST.json']
manifest['files'] = files
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
zip_path = root / 'ARKI_CAPABILITY_DIGEST_001_EVIDENCE.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as z:
    z.write(manifest_path, manifest_path.relative_to(root).as_posix())
    for item in files: z.write(root / item['path'], item['path'])
sha = hashlib.sha256(zip_path.read_bytes()).hexdigest()
(zip_path.with_suffix('.zip.sha256')).write_text(f'{sha}  {zip_path.name}\n')
print(f'DIGEST_MANIFEST={manifest_path}')
print(f'DIGEST_ZIP={zip_path}')
print(f'DIGEST_ZIP_SHA256={sha}')
print(f'FILES={len(files)+1}')
