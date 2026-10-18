from __future__ import annotations
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
files = [
    "E5_CONTRATO_REVISADO_V1_APROBADO.md", "E5_SCENE_MODEL_3D_REPORT.md", "E5_SCENE_MODEL_3D_OUTPUTS.txt",
    "E5_CLOSURE_HANDOFF_TO_DEEPSEEK.md", "E5_SCOPE_LIMITS.md", "E5_CLOSURE_REPORT.md", "E5_OUTPUTS.txt", "E5_CAPTURE_OUTPUTS.txt",
    "client/src/canvas/SceneModel3D.tsx", "client/src/comparison/SceneComparisonSideBySide.tsx", "client/src/persistence/arkiIndexedDb.ts", "shared/persistence/arkiPersistence.ts",
    "scripts/generate-e5-evidence.ts", "scripts/run-e5-reopen-evidence.sh", "scripts/create-e5-manifest.py", "scripts/create-e5-package.py",
    "scripts/test-e5-close-snapshot.ts", "scripts/test-e5-close-viewpoint.ts", "scripts/test-e5-close-comparison-controls.ts",
    "scripts/test-scene-model.ts", "scripts/test-scene-model-mount.ts", "scripts/test-scene-comparison.ts", "scripts/test-plan-3d-sync.ts",
    "scripts/test-clipping-section.ts", "scripts/test-camera-modes.ts", "scripts/test-measure-snap.ts", "scripts/test-viewpoints.ts", "scripts/test-isolate-freeze.ts",
]
files += [p.relative_to(root).as_posix() for p in sorted((root / "E5_CAPTURAS").glob("*.svg"))]
files += [p.relative_to(root).as_posix() for p in sorted((root / "E5_CAPTURAS").glob("*.webp"))]
files = sorted(set(files))
missing = [relative for relative in files if not (root / relative).is_file()]
if missing:
    raise SystemExit("MISSING:" + ",".join(missing))
manifest = {
    "schema": "ARKI-E5-MANIFEST-2.0",
    "status": "REOPENED FOR EVIDENCE CLOSURE / PENDING INDEPENDENT REVIEW",
    "generatedAt": "2026-09-23",
    "cycle": "surgical reopening; no new features",
    "functionalRegression": {"e5Existing": "PASS", "e5CloseTests": "PASS", "e6Regression": "PASS", "e7Regression": "PASS", "e8Regression": "PASS", "pnpmCheck": "PASS", "pnpmBuild": "PASS"},
    "captures": {"svg": 8, "webp": 8, "directory": "E5_CAPTURAS"},
    "newTests": ["E5-CLOSE-01 snapshot restore", "E5-CLOSE-02 viewpoint restore", "E5-CLOSE-03 independent comparison controls"],
    "acceptedDebt": {"solidClipping": "DECLARED_DEBT / FUTURE", "professionalSnapping": "DECLARED_DEBT / FUTURE"},
    "notes": [
        "Captures are script-generated documentary panels, not UI screenshots.",
        "Snapshot and viewpoint restoration run against fake-indexeddb with close/reopen operations in the adapter.",
        "heightFilter is node visibility by Y coordinate, not solid clipping.",
        "Measurement is centroid distance, not professional vertex/face/axis snapping.",
        "E6, E7, E8 and BKH-1 were not reopened or modified by this E5 cycle.",
        "DeepSeek/Product Owner must issue the independent contractual verdict.",
    ],
    "files": [],
}
for relative in files:
    data = (root / relative).read_bytes()
    manifest["files"].append({"path": relative, "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data)})
(root / "E5_MANIFEST.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print(json.dumps({"status": "PASS", "manifest": "E5_MANIFEST.json", "files": len(files), "svg": 8, "webp": 8}, indent=2))
