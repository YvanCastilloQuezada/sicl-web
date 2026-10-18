from __future__ import annotations

import json
import sqlite3
from pathlib import Path

import ezdxf
import ifcopenshell
from OCP.IGESControl import IGESControl_Reader
from OCP.STEPControl import STEPControl_Reader

ROOT = Path("/home/ubuntu/arki-fixtures")


def verify_ifc(path: Path):
    model = ifcopenshell.open(path)
    return {"format": "IFC4", "schema": model.schema, "walls": len(model.by_type("IfcWall")), "projects": len(model.by_type("IfcProject"))}


def verify_dxf(path: Path):
    doc = ezdxf.readfile(path)
    return {"format": "DXF", "version": doc.dxfversion, "entities": len(doc.modelspace()), "layers": len(doc.layers)}


def verify_geojson(path: Path):
    payload = json.loads(path.read_text(encoding="utf-8"))
    return {"format": "GEOJSON", "crs": payload["crs"]["properties"]["name"], "features": len(payload["features"])}


def verify_gpkg(path: Path):
    conn = sqlite3.connect(path)
    table = conn.execute("SELECT table_name FROM gpkg_contents WHERE data_type='features'").fetchone()[0]
    count = conn.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
    conn.close()
    return {"format": "GEOPACKAGE", "table": table, "features": count}


def verify_step(path: Path):
    reader = STEPControl_Reader()
    status = reader.ReadFile(str(path))
    roots = reader.NbRootsForTransfer()
    return {"format": "STEP", "read_status": int(status), "roots": roots}


def verify_iges(path: Path):
    reader = IGESControl_Reader()
    status = reader.ReadFile(str(path))
    roots = reader.NbRootsForTransfer()
    return {"format": "IGES", "read_status": int(status), "roots": roots}


checks = {
    "fixture.ifc": verify_ifc,
    "fixture.dxf": verify_dxf,
    "fixture.geojson": verify_geojson,
    "fixture.gpkg": verify_gpkg,
    "fixture.step": verify_step,
    "fixture.iges": verify_iges,
}
results = []
for filename, verifier in checks.items():
    path = ROOT / filename
    if not path.exists() or path.stat().st_size == 0:
        raise SystemExit(f"missing or empty fixture: {path}")
    result = verifier(path)
    results.append({"file": filename, **result})
    print(json.dumps(results[-1], sort_keys=True))

assert any(result.get("walls") == 1 for result in results)
assert any(result.get("entities") == 1 for result in results if result["file"] == "fixture.dxf")
assert any(result.get("features") == 1 for result in results if result["file"] == "fixture.geojson")
assert any(result.get("features") == 1 for result in results if result["file"] == "fixture.gpkg")
assert all(result.get("roots", 0) >= 1 for result in results if result["file"] in {"fixture.step", "fixture.iges"})
print(json.dumps({"ok": True, "verified_formats": [result["format"] for result in results]}))
