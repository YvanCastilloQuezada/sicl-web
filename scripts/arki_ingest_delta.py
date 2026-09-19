#!/usr/bin/env python3
"""Deterministic ARKI delta ingestor.

It registers a supplied delta without claiming that the corpus was learned.
Use: python3 scripts/arki_ingest_delta.py --file /path/to/delta.xlsx
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
from datetime import date
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
REGISTRY = REPO / "docs/deltas/ARKI-DELTA-REGISTRY.json"
CURRICULUM = REPO / "docs/deltas/ARKI-LIVING-CURRICULUM-AUTO-UPDATE.md"
BOOK_INDEX = REPO / "docs/deltas/ARKI-LIVING-BOOK-DELTA-INDEX.json"
INBOX = REPO / "docs/deltas/inbox"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def infer_id(path: Path, text: str) -> str:
    haystack = f"{path.name}\n{text[:10000]}"
    match = re.search(r"(?:delta|checkpoint|v)(?:[-_ ]*)(\d+(?:\.\d+)?)", haystack, re.I)
    version = match.group(1) if match else "UNVERSIONED"
    safe = re.sub(r"[^A-Za-z0-9]+", "-", path.stem).strip("-").upper()
    return f"{safe}-V{version.replace('.', '_')}"


def read_preview(path: Path) -> tuple[str, list[str], int]:
    suffix = path.suffix.lower()
    if suffix in {".txt", ".md", ".csv"}:
        text = path.read_text(encoding="utf-8", errors="replace")
        headings = [line.lstrip("# ").strip() for line in text.splitlines() if line.startswith("#")][:8]
        return text, headings, len(text.splitlines())
    if suffix == ".xlsx":
        from openpyxl import load_workbook
        wb = load_workbook(path, read_only=True, data_only=False)
        sheets = list(wb.sheetnames)
        return "", sheets, len(sheets)
    data = path.read_bytes()
    return "", [], len(data)


def load_registry() -> dict:
    if not REGISTRY.exists():
        return {"schema": "ARKI-DELTA-REGISTRY-0.1", "human_authority": "FINAL", "deltas": []}
    return json.loads(REGISTRY.read_text(encoding="utf-8"))


def update_book_index(record: dict) -> None:
    if BOOK_INDEX.exists():
        book = json.loads(BOOK_INDEX.read_text(encoding="utf-8"))
    else:
        book = {
            "schema": "ARKI-LIVING-BOOK-DELTA-INDEX-0.1",
            "title": "ARKI — Libro Vivo: índice automático de deltas",
            "human_authority": "FINAL",
            "volumes": ["VOLUME_I", "VOLUME_II", "VOLUME_III"],
            "deltas": [],
        }
    if any(item.get("sha256") == record["sha256"] for item in book.get("deltas", [])):
        return
    book["last_updated"] = date.today().isoformat()
    book.setdefault("deltas", []).append({
        "delta_id": record["delta_id"],
        "source_name": record["source_name"],
        "sha256": record["sha256"],
        "received_at": record["received_at"],
        "curriculum_reflection": record["curriculum_targets"],
        "editorial_state": "REGISTERED / HUMAN_REVIEW_REQUIRED",
        "knowledge_state": "SUPPLIED_INPUT / NOT_LEARNED",
        "next_editorial_action": "Create examples, exercises, transfer tests and human-reviewed promotion record.",
    })
    BOOK_INDEX.parent.mkdir(parents=True, exist_ok=True)
    BOOK_INDEX.write_text(json.dumps(book, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_curriculum(record: dict) -> None:
    if not CURRICULUM.exists():
        CURRICULUM.write_text("# ARKI — Currículo vivo: actualizaciones automáticas\n\n", encoding="utf-8")
    text = CURRICULUM.read_text(encoding="utf-8")
    marker = f"<!-- {record['delta_id']} -->"
    if marker in text:
        return
    preview = ", ".join(record["preview_items"]) if record["preview_items"] else "sin elementos legibles en la vista previa"
    section = f"""\n{marker}\n## {record['delta_id']} — {record['source_name']}\n\n- **Fecha de recepción:** {record['received_at']}\n- **Hash SHA-256:** `{record['sha256']}`\n- **Estado de conocimiento:** `SUPPLIED_INPUT / NOT_LEARNED / HUMAN_REVIEW_REQUIRED`\n- **Integración curricular:** registro automático pendiente de revisión humana; no reemplaza capítulos ni módulos anteriores.\n- **Vista previa detectada:** {preview}\n- **Acción automática realizada:** fuente registrada, delta indexada y conexión preparada para Volúmenes I, II y III.\n- **Acción no automática:** no se canoniza, no se declara aprendizaje, no se modifica una decisión de diseño y no se promueve madurez sin pruebas K0→K1.\n- **Próxima evidencia:** análisis del delta, caso positivo, contraejemplo, transferencia y validación humana.\n"""
    CURRICULUM.write_text(text.rstrip() + "\n" + section, encoding="utf-8")


def ingest(source: Path) -> dict:
    source = source.resolve()
    if not source.exists() or not source.is_file():
        raise FileNotFoundError(source)
    source_hash = sha256(source)
    text, preview_items, preview_count = read_preview(source)
    registry = load_registry()
    existing = next((item for item in registry["deltas"] if item["sha256"] == source_hash), None)
    if existing:
        return {"status": "DUPLICATE", "delta_id": existing["delta_id"], "sha256": source_hash, "destination": existing["destination"]}
    delta_id = infer_id(source, text)
    destination_dir = INBOX / delta_id
    destination_dir.mkdir(parents=True, exist_ok=True)
    destination = destination_dir / source.name
    shutil.copy2(source, destination)
    record = {
        "delta_id": delta_id,
        "source_name": source.name,
        "source_path_at_ingest": str(source),
        "destination": str(destination.relative_to(REPO)),
        "sha256": source_hash,
        "received_at": date.today().isoformat(),
        "format": source.suffix.lower().lstrip("."),
        "preview_items": preview_items,
        "preview_count": preview_count,
        "status": "REGISTERED / HUMAN_REVIEW_REQUIRED",
        "knowledge_state": "SUPPLIED_INPUT / NOT_LEARNED",
        "curriculum_targets": ["VOLUME_I", "VOLUME_II", "VOLUME_III"],
        "automatic_actions": ["REGISTER_SOURCE", "UPDATE_CURRICULUM_INDEX", "UPDATE_DELTA_REGISTRY", "PRESERVE_PROVENANCE"],
        "prohibited_automatic_actions": ["CANONIZE", "CLAIM_LEARNING", "CREATE_WINNER", "MUTATE_PROJECT", "PUSH_WITHOUT_AUTHORIZATION"],
    }
    registry.setdefault("schema", "ARKI-DELTA-REGISTRY-0.1")
    registry["last_updated"] = date.today().isoformat()
    registry["human_authority"] = "FINAL"
    registry.setdefault("deltas", []).append(record)
    REGISTRY.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    update_curriculum(record)
    update_book_index(record)
    return {"status": "REGISTERED", "delta_id": delta_id, "sha256": source_hash, "destination": str(destination)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--file", required=True, type=Path)
    args = parser.parse_args()
    print(json.dumps(ingest(args.file), ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
