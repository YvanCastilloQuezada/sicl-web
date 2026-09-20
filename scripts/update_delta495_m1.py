import json
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
registry_path = repo / "docs/deltas/ARKI-DELTA-REGISTRY.json"
registry = json.loads(registry_path.read_text())
for item in registry["deltas"]:
    if item["delta_id"] == "PASTED-CONTENT-495-V494":
        item.update({
            "status": "EXECUTED / BLOCKED_BY_PRIMARY_SOURCE",
            "knowledge_state": "SCHEMA_READY / CONTENT_NOT_INGESTED",
            "m1_status": "BLOCKED_BY_PRIMARY_SOURCE",
            "m1_report": "docs/arki-m1-white/ARKI-M1-EDWARD-T-WHITE-SOURCE-GATE-2026-09-20.md",
            "m1_structured_report": "docs/arki-m1-white/ARKI-M1-EDWARD-T-WHITE-SOURCE-GATE-2026-09-20.json",
            "m1_proof": "client/src/components/arkiM1WhiteSourceGate.ts",
            "m1_tests": "client/src/components/arkiM1WhiteSourceGate.test.ts",
            "anexo_i_manifest": "docs/annex-i/manifest.json",
            "source_primary_available": False,
            "content_entries": 0,
            "manual_populated": False,
            "human_authority_required": True,
            "regression_status": "PENDING_FULL_SUITE",
            "next_step": "BLOCKED_BY_PRIMARY_SOURCE"
        })
        break
else:
    raise SystemExit("delta 495 not found")
registry_path.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n")

manifest_path = repo / "docs/annex-i/manifest.json"
manifest = json.loads(manifest_path.read_text())
if not any(p.get("anexoId") == "ANEXO-I-M1-EDWARD-T-WHITE-SOURCE-GATE" for p in manifest["packages"]):
    manifest["packages"].append({
        "anexoId": "ANEXO-I-M1-EDWARD-T-WHITE-SOURCE-GATE",
        "title": "ANEXO I — M1 Edward T. White Source Gate",
        "experimentId": "M1-EDWARD-T-WHITE-SYSTEMATIC-ACQUISITION",
        "checkpointId": "M1.1 SOURCE AUDIT",
        "deltaId": "PASTED-CONTENT-495-V494",
        "baselineSha": "83aa7eb5ba2397a8dd5c77f825c27066591ae23c",
        "finalSha": "83aa7eb5ba2397a8dd5c77f825c27066591ae23c",
        "humanReport": "docs/arki-m1-white/ARKI-M1-EDWARD-T-WHITE-SOURCE-GATE-2026-09-20.md",
        "structuredReport": "docs/arki-m1-white/ARKI-M1-EDWARD-T-WHITE-SOURCE-GATE-2026-09-20.json",
        "executableProof": "client/src/components/arkiM1WhiteSourceGate.ts",
        "tests": ["client/src/components/arkiM1WhiteSourceGate.test.ts"],
        "experimentalArtifacts": [],
        "replayOrGenerator": "scripts/generate_arki_m1_white_report.ts",
        "provenance": ["docs/deltas/inbox/PASTED-CONTENT-495-V495/pasted_content_495.txt", "docs/annex-i/ANEXO-I-CONTRACT.md", "docs/deltas/ARKI-DELTA-REGISTRY.json"],
        "epistemicStatus": "PRIMARY_SOURCE_NOT_AVAILABLE / SCHEMA_READY",
        "unknowns": ["edition", "publisher", "publication year", "ISBN", "language", "page count", "source location", "source completeness"],
        "blocked": ["source inventory", "concept extraction", "normalization", "generative tests", "Manual content population"],
        "coverage": "Source gate only; zero content entries",
        "regressionStatus": "PENDING_FULL_SUITE",
        "humanAuthorityRequired": True,
        "propagationRefs": ["DELTA_495", "ARKI", "CURRICULUM", "LIVING_BOOK"]
    })
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

curriculum = repo / "docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md"
text = curriculum.read_text()
marker = "<!-- PASTED-CONTENT-495-V494-M1 -->"
if marker not in text:
    curriculum.write_text(text.rstrip() + f"\n\n{marker}\n## PASTED-CONTENT-495-V494 — M1 Edward T. White\n\nThe primary-source gate found no Edward T. White corpus in the workspace or repository. Architecture/schema preparation is ready, but content ingestion is blocked; no White content was invented or canonized.\n")
