from hashlib import sha256
from pathlib import Path
import json
import zipfile

root = Path(__file__).resolve().parents[1]
zip_path = root / "ARKI_E8A_EVIDENCE.zip"
files = [
    "E8-A_REPORT.md",
    "E8_SCOPE_LIMITS.md",
    "E8_CONTRATO_PROPUESTO_V1.md",
    "E8_MANIFEST.json",
    "E8_PREFLIGHT_OUTPUTS.txt",
    "E8A_GENERATION_OUTPUTS.txt",
    "E8A_TEST_OUTPUTS.txt",
    "E8-A_OUTPUTS.txt",
    "shared/arkiTechnicalDossierCompiler.ts",
    "scripts/test-e8a-dossier.ts",
    "scripts/generate-e8a-evidence.ts",
]
files += [p.relative_to(root).as_posix() for p in (root / "E8_A_OUTPUT").rglob("*") if p.is_file()]
files += [p.relative_to(root).as_posix() for p in (root / "E8_CAPTURAS").glob("*.svg")]
files += [p.relative_to(root).as_posix() for p in (root / "E8_CAPTURAS").glob("*.webp")]
files = sorted(set(files))
manifest = {"schema": "ARKI-E8A-EVIDENCE-PACKAGE-1.0", "status": "IMPLEMENTED / PENDING INDEPENDENT REVIEW", "files": []}
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for relative in files:
        path = root / relative
        archive.write(path, relative)
        manifest["files"].append({"path": relative, "sha256": sha256(path.read_bytes()).hexdigest(), "bytes": path.stat().st_size})
    archive.writestr("E8A_PACKAGE_MANIFEST.json", json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
print(json.dumps({"status": "PASS", "zip": str(zip_path), "files": len(files), "sha256": sha256(zip_path.read_bytes()).hexdigest()}, indent=2))
