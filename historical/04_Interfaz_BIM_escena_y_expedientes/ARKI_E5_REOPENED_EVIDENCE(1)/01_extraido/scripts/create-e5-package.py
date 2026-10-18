from __future__ import annotations
import hashlib
import json
import zipfile
from pathlib import Path

root = Path(__file__).resolve().parents[1]
zip_path = root / "ARKI_E5_REOPENED_EVIDENCE.zip"
manifest = json.loads((root / "E5_MANIFEST.json").read_text())
files = sorted(set([item["path"] for item in manifest["files"]] + ["E5_MANIFEST.json", "scripts/create-e5-package.py"]))
package_manifest = {"schema": "ARKI-E5-REOPENED-EVIDENCE-PACKAGE-1.0", "status": manifest["status"], "files": []}
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for relative in files:
        path = root / relative
        if not path.is_file() or path.stat().st_size == 0:
            raise SystemExit(f"MISSING_OR_EMPTY:{relative}")
        archive.write(path, relative)
        package_manifest["files"].append({"path": relative, "sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "bytes": path.stat().st_size})
    archive.writestr("E5_PACKAGE_MANIFEST.json", json.dumps(package_manifest, indent=2, ensure_ascii=False) + "\n")
print(json.dumps({"status": "PASS", "zip": str(zip_path), "files": len(files), "sha256": hashlib.sha256(zip_path.read_bytes()).hexdigest()}, indent=2))
