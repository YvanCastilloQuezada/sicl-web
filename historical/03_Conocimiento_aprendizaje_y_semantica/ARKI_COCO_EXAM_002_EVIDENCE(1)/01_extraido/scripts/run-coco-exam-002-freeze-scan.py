from __future__ import annotations

import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'COCO_EXAM_002_FREEZE'
OUT.mkdir(exist_ok=True)

def run(*args: str) -> str:
    return subprocess.run(args, cwd=ROOT, text=True, capture_output=True, check=False).stdout.strip()

tracked = run('git', 'ls-files').splitlines()
status = run('git', 'status', '--short')
branch = run('git', 'branch', '--show-current')
head = run('git', 'rev-parse', 'HEAD')
repo = run('git', 'rev-parse', '--show-toplevel')
package = json.loads((ROOT / 'package.json').read_text())

state = {
    'artifact': 'ARKI-COCO-EXAM-002',
    'capturedAtUtc': datetime.now(timezone.utc).isoformat(),
    'repository': repo,
    'branch': branch,
    'head': head,
    'worktreeStatus': status,
    'trackedFileCount': len(tracked),
    'packageVersion': package.get('version'),
    'testCorpusVersion': 'COCO-EXAM-002-COLD-001',
    'knowledgeCorpusVersion': 'C1-C53-TRANSFERRED-DOCUMENTED-CONTRACT-READY',
    'projectStateVersion': 'UNSPECIFIED_IN_REPOSITORY',
}
state_bytes = json.dumps(state, sort_keys=True, indent=2).encode()
state['baselineSha256'] = hashlib.sha256(state_bytes).hexdigest()
(OUT / 'BASELINE.json').write_text(json.dumps(state, indent=2) + '\n')

# Do not search the Git metadata, dependencies, generated bundles, or ZIPs.
ignored = {'.git', 'node_modules', 'dist', 'COCO_EXAM_002_FREEZE'}
terms = [
    'PROJECT ORION', 'ARKI-TRANSFER-002', 'TRANSFER-002', 'SURPRISE TRANSFER',
    'CENTRO DE PRODUCCIÓN, INVESTIGACIÓN Y DISTRIBUCIÓN',
    'EXAM_VERIFIED_FOR_BOUNDED_C1_C53_TRANSFER', 'COVERAGE_MATRIX_C1_C53',
    'PATTERN_TO_LAW', 'TYPOLOGY_TO_FACT', 'SIMULATION_TO_TRUTH',
    'CERTIFICATION_PROJECTED_TO_CERTIFIED', 'PFH01_BYPASS', 'ORION',
]
results = []
for path in ROOT.rglob('*'):
    if not path.is_file() or any(part in ignored for part in path.parts):
        continue
    if path.suffix.lower() in {'.zip', '.png', '.webp', '.jpg', '.jpeg', '.gif', '.lock'}:
        continue
    try:
        text = path.read_text(errors='ignore')
    except OSError:
        continue
    for term in terms:
        count = text.lower().count(term.lower())
        if count:
            results.append({'path': str(path.relative_to(ROOT)), 'term': term, 'count': count})

# Existing transfer and historical material is supplied/documented. The scanner
# itself necessarily contains the forbidden-term vocabulary, so it is ENCODED
# audit machinery rather than an exam fixture. Material contamination means an
# ORION-specific scenario or expected answer exists outside this scanner.
scanner_path = 'scripts/run-coco-exam-002-freeze-scan.py'
material = [
    r for r in results
    if r['term'] in {'PROJECT ORION', 'CENTRO DE PRODUCCIÓN, INVESTIGACIÓN Y DISTRIBUCIÓN'}
    and r['path'] != scanner_path
    and not r['path'].startswith('COCO_EXAM_002_FREEZE/')
]
for match in results:
    if match['path'] == scanner_path:
        match['classification'] = 'ENCODED'
    elif match['path'].startswith('ARKI_COCO_EXAM_001_R1_') or match['path'].startswith('scripts/test-coco-exam-001-r1') or match['path'].startswith('scripts/run-coco-exam-001-r1') or match['path'].startswith('scripts/create-coco-exam-001-r1'):
        match['classification'] = 'SUPPLIED'
    else:
        match['classification'] = 'RETRIEVED'
scan = {
    'artifact': 'ANTI_CONTAMINATION_SCAN',
    'termsScanned': terms,
    'matches': results,
    'materialContaminationMatches': material,
    'classification': 'EXAM_CONTAMINATED' if material else 'NO_MATERIAL_ORION_CONTAMINATION_DETECTED',
    'note': 'Historical R1 material is SUPPLIED and the scanner vocabulary is ENCODED. Only ORION-specific runtime fixtures outside the scanner count as material contamination.',
}
(OUT / 'ANTI_CONTAMINATION_SCAN.json').write_text(json.dumps(scan, indent=2) + '\n')
(OUT / 'ANTI_CONTAMINATION_SCAN.txt').write_text('\n'.join([
    'ANTI-CONTAMINATION SCAN',
    f"classification={scan['classification']}",
    f"matchCount={len(results)}",
    f"materialContaminationCount={len(material)}",
    *[f"{r['path']} :: {r['term']} :: {r['count']}" for r in results],
]) + '\n')
print(json.dumps({'baseline': str(OUT / 'BASELINE.json'), 'scan': str(OUT / 'ANTI_CONTAMINATION_SCAN.json'), 'classification': scan['classification'], 'materialCount': len(material)}))
