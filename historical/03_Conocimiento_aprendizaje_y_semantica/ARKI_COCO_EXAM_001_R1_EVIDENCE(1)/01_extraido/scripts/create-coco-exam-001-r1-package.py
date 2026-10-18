from __future__ import annotations
import hashlib, json, zipfile
from pathlib import Path

root = Path(__file__).resolve().parent.parent
files = [
    'scripts/test-coco-exam-001-r1.ts',
    'scripts/run-coco-exam-001-r1-evidence.sh',
    'scripts/create-coco-exam-001-r1-package.py',
    'ARKI_COCO_EXAM_001_R1_RAW.json',
    'ARKI_COCO_EXAM_001_R1_OUTPUTS.txt',
    'ARKI_COCO_EXAM_001_R1_REPORT.md',
    'ARKI_COCO_EXAM_001_R1_LEARNING_LEDGER.md',
    'ARKI_COCO_EXAM_001_R1_SCOPE_LIMITS.md',
]
for rel in files:
    if not (root / rel).is_file():
        raise SystemExit(f'MISSING:{rel}')
entries = []
for rel in files:
    data = (root / rel).read_bytes()
    entries.append({'path': rel, 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data)})
manifest = {
    'artifact': 'ARKI-COCO-EXAM-001.R1',
    'status': 'EXAM_VERIFIED_FOR_BOUNDED_FOUNDATION_TRANSFER',
    'maximumStatus': 'EXAM_VERIFIED_FOR_BOUNDED_FOUNDATION_TRANSFER',
    'professionalCompetency': 'NOT_CERTIFIED',
    'productMutation': False,
    'pfH01Modified': False,
    'seed': 'ARKI-TRANSFER-002-SEED-20260923',
    'entries': entries,
}
manifest_path = root / 'ARKI_COCO_EXAM_001_R1_MANIFEST.json'
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
zip_path = root / 'ARKI_COCO_EXAM_001_R1_EVIDENCE.zip'
with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zf:
    for rel in files:
        zf.write(root / rel, rel)
    zf.write(manifest_path, manifest_path.name)
zip_hash = hashlib.sha256(zip_path.read_bytes()).hexdigest()
(root / 'ARKI_COCO_EXAM_001_R1_ZIP_SHA256.txt').write_text(f'{zip_hash}  {zip_path.name}\n')
print(json.dumps({'status': manifest['status'], 'manifest': str(manifest_path), 'zip': str(zip_path), 'zipSha256': zip_hash, 'files': len(files) + 1}))
