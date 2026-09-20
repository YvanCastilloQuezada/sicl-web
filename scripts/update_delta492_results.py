import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
registry = repo / "docs/deltas/ARKI-DELTA-REGISTRY.json"
data = json.loads(registry.read_text())
for delta in data["deltas"]:
    if delta["delta_id"] == "PASTED-CONTENT-492-V492":
        delta.update({
            "status": "EXECUTED / PASS_WITH_OBSERVATIONS / HUMAN_REVIEW_REQUIRED",
            "knowledge_state": "K2_CANDIDATE / PROJECT_ONLY / NOT_GENERALIZED",
            "curriculum_status": "UPDATED_WITH_EXPERIMENTAL_RESULT",
            "book_status": "UPDATED_WITH_EPISTEMIC_BOUNDARY",
            "execution": "P9.4-0 through P9.12",
            "selected_unknown": "B-unknown-capacity",
            "evidence": "SYNTHETIC_EXPERIMENTAL_EVIDENCE",
            "impact": "EVALUATION_ONLY",
            "geometry_mutated": False,
            "project_discovery": "PROJECT_ONLY",
            "transfer": "ADAPT_ONLY",
            "generalization": "G1",
            "autonomy": "L9_COMPARES",
            "next_step": "NEXT_STEP_READY",
            "report": "docs/arki-p94/ARKI-P94-EVIDENCE-TO-LEARNING-EXPERIMENT-2026-09-20.md",
        })
        break
else:
    raise SystemExit("delta 492 not registered")
registry.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")

curriculum = repo / "docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md"
with curriculum.open("a", encoding="utf-8") as f:
    f.write("\n## PASTED-CONTENT-492-V492 — P9.4→P9.x\n\nCapacity UNKNOWN was resolved for a synthetic experiment only. The result is a PROJECT_ONLY K2 candidate, evaluation-only impact, G1 generalization, no automatic promotion, and human review required.\n")
