from hashlib import sha256
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
files = [
    "shared/arkiCadGateway.ts",
    "scripts/test-arki-cad-gateway.ts",
    "ARKI_CAD_001C_IMPLEMENTATION_REPORT.md",
    "ARKI_CAD_001C_VALIDATION_REPORT.md",
    "ARKI_CAD_001C_GAPS.md",
    "ARKI_CAD_001C_TEST_OUTPUTS.txt",
    "ARKI_CAD_001C_BUILD_OUTPUTS.txt",
    "ARKI_CAD_001C_IFC_REGRESSION_OUTPUTS.txt",
    "pasted_content_128.txt",
]
manifest = {
    "schema": "ARKI-CAD-001C-MANIFEST-1.0",
    "order": "ARKI-CAD-001C",
    "status": "IMPLEMENTED_FOR_OPEN_CONTRACT_SCOPE",
    "baseline": {"branch": "main", "head": "c62183a5904f02aa0a935572454a5a35f9d167aa"},
    "deployment": "WINDOWS-FIRST / HEADLESS-CAPABLE",
    "primaryReaderRuntime": "BLOCKED_BY_LICENSE_OR_ACCESS",
    "licenseGate": "BLOCKED",
    "cadGeometryReady": "NO",
    "abb001": "BLOCKED",
    "bkhTouched": False,
    "commercialSdkLoaded": False,
    "semanticPromotion": "PROHIBITED",
    "files": {},
}
for name in files:
    path = root / name
    if not path.is_file():
        raise SystemExit(f"MISSING:{name}")
    manifest["files"][name] = {"sha256": sha256(path.read_bytes()).hexdigest(), "bytes": path.stat().st_size}
(root / "ARKI_CAD_001C_MANIFEST.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(json.dumps(manifest, indent=2))
