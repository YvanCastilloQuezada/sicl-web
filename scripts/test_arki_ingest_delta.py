import json
import tempfile
from pathlib import Path

import arki_ingest_delta as ingest


def run() -> None:
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        ingest.REPO = root
        ingest.REGISTRY = root / "docs/deltas/ARKI-DELTA-REGISTRY.json"
        ingest.CURRICULUM = root / "docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md"
        ingest.BOOK_INDEX = root / "docs/deltas/ARKI-LIVING-BOOK-DELTA-INDEX.json"
        ingest.INBOX = root / "docs/deltas/inbox"
        ingest.REGISTRY.parent.mkdir(parents=True)
        ingest.REGISTRY.write_text(json.dumps({"schema": "test", "deltas": []}), encoding="utf-8")
        source = root / "ARKI_Canonical_Research_Delta_v99.txt"
        source.write_text("# Delta v99\n## New reasoning contract\n", encoding="utf-8")
        first = ingest.ingest(source)
        assert first["status"] == "REGISTERED"
        assert "ARKI-CANONICAL-RESEARCH-DELTA-V99" in first["delta_id"]
        registry = json.loads(ingest.REGISTRY.read_text(encoding="utf-8"))
        assert len(registry["deltas"]) == 1
        record = registry["deltas"][0]
        assert record["knowledge_state"] == "SUPPLIED_INPUT / NOT_LEARNED"
        curriculum = ingest.CURRICULUM.read_text(encoding="utf-8")
        assert first["delta_id"] in curriculum
        assert "VOLUME_I" in record["curriculum_targets"]
        book = json.loads(ingest.BOOK_INDEX.read_text(encoding="utf-8"))
        assert len(book["deltas"]) == 1
        assert book["deltas"][0]["knowledge_state"] == "SUPPLIED_INPUT / NOT_LEARNED"
        second = ingest.ingest(source)
        assert second["status"] == "DUPLICATE"
        assert len(json.loads(ingest.REGISTRY.read_text(encoding="utf-8"))["deltas"]) == 1
    print("AUTOMATIC_DELTA_INGESTION_TEST=PASS")


if __name__ == "__main__":
    run()
