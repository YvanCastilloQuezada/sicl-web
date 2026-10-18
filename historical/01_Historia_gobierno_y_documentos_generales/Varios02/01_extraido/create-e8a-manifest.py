from hashlib import sha256
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]

def digest(path: Path) -> str:
    return sha256(path.read_bytes()).hexdigest()

paths = [
    "E8_CONTRATO_PROPUESTO_V1.md",
    "E8_SCOPE_LIMITS.md",
    "E8_PREFLIGHT_OUTPUTS.txt",
    "E8-A_REPORT.md",
    "E8A_GENERATION_OUTPUTS.txt",
    "E8A_TEST_OUTPUTS.txt",
    "E8-A_OUTPUTS.txt",
    "shared/arkiTechnicalDossierCompiler.ts",
    "scripts/test-e8a-dossier.ts",
    "scripts/generate-e8a-evidence.ts",
]
output_paths = sorted(p.relative_to(root).as_posix() for p in (root / "E8_A_OUTPUT").rglob("*") if p.is_file())
output_paths += sorted(p.relative_to(root).as_posix() for p in (root / "E8_CAPTURAS").glob("*.svg"))
capture_paths = sorted(p.relative_to(root).as_posix() for p in (root / "E8_CAPTURAS").glob("*.webp"))
manifest = {
    "schema": "ARKI-E8-MANIFEST-1.0",
    "status": "E8-A IMPLEMENTED / PENDING INDEPENDENT REVIEW",
    "authority": "Product Owner / Human Authority",
    "baseline": "c62183a",
    "cycleLimit": 1,
    "implementationAuthorized": True,
    "verificationStatus": "E8-A PENDING INDEPENDENT REVIEW",
    "blocks": {"E8-A": "IMPLEMENTED / PENDING REVIEW", "E8-B": "NOT_STARTED", "E8-C": "NOT_STARTED"},
    "capturesRequiredAtClosure": 6,
    "capturesProducedThisBlock": len(capture_paths),
    "testsRequiredAtClosure": 12,
    "testsProducedThisBlock": 4,
    "sourceEvidence": [{"path": p, "sha256": digest(root / p)} for p in paths],
    "outputs": [{"path": p, "sha256": digest(root / p)} for p in output_paths],
    "captures": [{"path": p, "sha256": digest(root / p), "format": "WEBP", "block": "E8-A"} for p in capture_paths],
    "notes": [
        "E8-A is independently bounded and does not imply E8-B or E8-C completion.",
        "The compiled dossier is derived from an approved snapshot and remains subject to specialist review.",
        "E5/E6/E7 remain frozen and were not modified.",
        "Final E8 manifest must be regenerated at cycle closure.",
    ],
}
(root / "E8_MANIFEST.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(json.dumps({"status": "PASS", "manifest": "E8_MANIFEST.json", "outputs": len(output_paths), "captures": len(capture_paths)}, indent=2))
