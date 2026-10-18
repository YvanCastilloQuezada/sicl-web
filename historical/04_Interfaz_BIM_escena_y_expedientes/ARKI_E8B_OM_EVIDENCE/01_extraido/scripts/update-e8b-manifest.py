from hashlib import sha256
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
manifest_path = root / "E8_MANIFEST.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

def digest(relative: str) -> str:
    return sha256((root / relative).read_bytes()).hexdigest()

def append_unique(collection: list[dict], relative: str) -> None:
    if not any(item.get("path") == relative for item in collection):
        collection.append({"path": relative, "sha256": digest(relative)})

source_files = [
    "E8-B_REPORT.md",
    "E8-B_OUTPUTS.txt",
    "shared/arkiOperationMaintenance.ts",
    "shared/persistence/arkiPersistence.ts",
    "client/src/persistence/arkiIndexedDb.ts",
    "scripts/test-e8b-assets.ts",
    "scripts/generate-e8b-evidence.ts",
    "package.json",
    "pnpm-lock.yaml",
]
for relative in source_files:
    append_unique(manifest["sourceEvidence"], relative)

for path in sorted((root / "E8_B_CAPTURAS").glob("*.svg")):
    append_unique(manifest["outputs"], path.relative_to(root).as_posix())

for relative in ["E8-B_OUTPUTS.txt"]:
    append_unique(manifest["outputs"], relative)

captures = manifest.setdefault("captures", [])
for path in sorted((root / "E8_B_CAPTURAS").glob("*.webp")):
    relative = path.relative_to(root).as_posix()
    if not any(item.get("path") == relative for item in captures):
        captures.append({"path": relative, "sha256": digest(relative), "format": "WEBP", "block": "E8-B"})

manifest["blocks"]["E8-B"] = "IMPLEMENTED / PENDING REVIEW"
manifest["verificationStatus"] = "E8-A VERIFIED / E8-B PENDING INDEPENDENT REVIEW"
manifest["notes"].append("E8-B uses local-first IndexedDB stores and remains bounded to O-M; external CMMS, alerts and backend are excluded.")
manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print(json.dumps({"status": "PASS", "manifest": str(manifest_path), "e8bCaptures": len([item for item in captures if item.get("block") == "E8-B"]), "sourceEvidence": len(manifest["sourceEvidence"])}, indent=2))
