import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
registry_path = repo / "docs/deltas/ARKI-DELTA-REGISTRY.json"
registry = json.loads(registry_path.read_text())
for item in registry["deltas"]:
    if item["delta_id"] == "PASTED-CONTENT-494-V492":
        item.update({
            "status": "EXECUTED / PASS_WITH_OBSERVATIONS / HUMAN_REVIEW_REQUIRED",
            "knowledge_state": "K2_RETAINED / G1_PROCESS_ONLY / NOT_UNIVERSALIZED",
            "p10_status": "PASS_WITH_OBSERVATIONS",
            "p10_report": "docs/arki-p10/ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.md",
            "p10_structured_report": "docs/arki-p10/ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.json",
            "p10_proof": "client/src/components/arkiP10KnowledgeTransferChallenge.ts",
            "p10_tests": "client/src/components/arkiP10KnowledgeTransferChallenge.test.ts",
            "anexo_i_manifest": "docs/annex-i/manifest.json",
            "knowledge_promotion": "K2_CANDIDATE",
            "l10_generalization": "L10_DEMONSTRATED",
            "human_authority_required": True,
            "p94_reexecuted": False,
            "regression_status": "PASS",
            "next_step": "READY_FOR_NEXT_EXPERIMENT"
        })
        break
else:
    raise SystemExit("delta 494 not found")
registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n")

manifest_path = repo / "docs/annex-i/manifest.json"
manifest = json.loads(manifest_path.read_text())
if not any(p.get("anexoId") == "ANEXO-I-P10-KNOWLEDGE-TRANSFER" for p in manifest["packages"]):
    manifest["packages"].append({
        "anexoId": "ANEXO-I-P10-KNOWLEDGE-TRANSFER",
        "title": "ANEXO I — P10 Knowledge Transfer & Generalization Challenge",
        "experimentId": "P10-KNOWLEDGE-TRANSFER-GENERALIZATION",
        "checkpointId": "P10.15",
        "deltaId": "PASTED-CONTENT-494-V492",
        "baselineSha": "a34efbd3a4c944685bd7e29064d21ebd15645e7e",
        "finalSha": "a34efbd3a4c944685bd7e29064d21ebd15645e7e",
        "humanReport": "docs/arki-p10/ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.md",
        "structuredReport": "docs/arki-p10/ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.json",
        "executableProof": "client/src/components/arkiP10KnowledgeTransferChallenge.ts",
        "tests": ["client/src/components/arkiP10KnowledgeTransferChallenge.test.ts"],
        "experimentalArtifacts": ["docs/arki-p10/ARKI-P10-KNOWLEDGE-TRANSFER-2026-09-20.json"],
        "replayOrGenerator": "scripts/generate_arki_p10_report.ts",
        "provenance": ["docs/deltas/inbox/PASTED-CONTENT-494-V492/pasted_content_494.txt", "docs/arki-p94/ARKI-P94-EVIDENCE-TO-LEARNING-EXPERIMENT-2026-09-20.json", "docs/arki-rparti-integration/ARKI-RPARTI-INTEGRATION-PROOF-I0-I11.json", "docs/deltas/ARKI-DELTA-REGISTRY.json"],
        "epistemicStatus": "L10_PROCESS_DEMONSTRATED / K2_CANDIDATE",
        "unknowns": ["route width", "jurisdiction and life-safety code", "cross-typology applicability", "human confirmation"],
        "blocked": ["K3/K4/K5/K6/K7 promotion", "universal architectural rule"],
        "coverage": "P10.0–P10.15; focused battery P10-T01..P10-T20",
        "regressionStatus": "PASS",
        "propagationRefs": ["DELTA_494", "ARKI", "CURRICULUM", "LIVING_BOOK"]
    })
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

curriculum = repo / "docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md"
text = curriculum.read_text()
marker = "<!-- PASTED-CONTENT-494-V492-P10 -->"
if marker not in text:
    curriculum.write_text(text.rstrip() + f"\n\n{marker}\n## PASTED-CONTENT-494-V492 — P10 Knowledge Transfer\n\nP10 tested the Project-B K2 candidate through bounded abstraction, near/cross-project/cross-typology transfer, adversarial non-transfer and counterexample scope refinement. The system process reached L10_DEMONSTRATED while knowledge remained K2_CANDIDATE; no universal rule was promoted.\n")
