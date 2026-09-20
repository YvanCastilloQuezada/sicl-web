import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
registry = repo / "docs/deltas/ARKI-DELTA-REGISTRY.json"
data = json.loads(registry.read_text())
for delta in data["deltas"]:
    if delta["delta_id"] == "PASTED-CONTENT-493-V491":
        delta.update({
            "status": "EXECUTED / PASS_WITH_OBSERVATIONS",
            "knowledge_state": "METADATA_CONTRACT / NOT_LEARNING",
            "annex_i_status": "IMPLEMENTED / REFERENCE_ONLY",
            "annex_i_contract": "docs/annex-i/ANEXO-I-CONTRACT.md",
            "annex_i_manifest": "docs/annex-i/manifest.json",
            "duplicated_artifacts": False,
            "r_parti_artifacts_reused": True,
            "p94_reexecuted": False,
            "regression_status": "PASS",
            "human_authority_required": True,
            "next_step": "STOP_AFTER_FORMALIZATION"
        })
        break
else:
    raise SystemExit("delta 493 not registered")
registry.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

curriculum = repo / "docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md"
with curriculum.open("a", encoding="utf-8") as f:
    f.write("\n## PASTED-CONTENT-493-V491 — ANEXO I\n\nFormalized the reusable ANEXO I evidence manifest. This is metadata/reference infrastructure, not a learning event; existing R-PARTI and P9.4 results remain unchanged.\n")
