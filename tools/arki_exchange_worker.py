#!/usr/bin/env python3
"""Small, isolated OSS exchange worker used by ARKI fixtures and adapter tests.

It intentionally creates bounded demonstration files. It does not claim arbitrary
vendor round-trip fidelity; every output must be accompanied by ARKI's loss
manifest and human review.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import struct
from pathlib import Path


def create_dxf(output: Path) -> dict:
    import ezdxf
    document = ezdxf.new("R2018")
    document.units = 6  # metres
    document.layers.add("ARKI-WALLS", color=7)
    model = document.modelspace()
    model.add_lwpolyline([(0, 0), (10, 0), (10, 6), (0, 6), (0, 0)], dxfattribs={"layer": "ARKI-WALLS", "closed": True})
    document.saveas(output)
    return {"format": "DXF", "version": "R2018", "entities": 1, "units": "metres"}


def create_geojson(output: Path) -> dict:
    payload = {"type": "FeatureCollection", "name": "ARKI fixture", "crs": {"type": "name", "properties": {"name": "EPSG:4326"}}, "features": [{"type": "Feature", "properties": {"project_id": "ARKI-FIXTURE-001", "kind": "site"}, "geometry": {"type": "Polygon", "coordinates": [[[0, 0], [0.0001, 0], [0.0001, 0.0001], [0, 0.0001], [0, 0]]]}}]}
    output.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    return {"format": "GEOJSON", "crs": "EPSG:4326", "features": 1}


def create_gpkg(output: Path) -> dict:
    # Minimal valid GeoPackage with one polygon feature and WGS84 CRS.
    conn = sqlite3.connect(output)
    conn.executescript("""
      PRAGMA application_id = 1196437808;
      PRAGMA user_version = 10300;
      CREATE TABLE gpkg_spatial_ref_sys (srs_name TEXT NOT NULL, srs_id INTEGER NOT NULL PRIMARY KEY, organization TEXT NOT NULL, organization_coordsys_id INTEGER NOT NULL, definition TEXT NOT NULL, description TEXT);
      INSERT INTO gpkg_spatial_ref_sys VALUES ('WGS 84 geodetic',4326,'EPSG',4326,'GEOGCS[\"WGS 84\",DATUM[\"WGS_1984\"],PRIMEM[\"Greenwich\",0],UNIT[\"degree\",0.0174532925199433]]','');
      CREATE TABLE gpkg_contents (table_name TEXT NOT NULL PRIMARY KEY, data_type TEXT NOT NULL, identifier TEXT UNIQUE, description TEXT DEFAULT '', last_change DATETIME NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), min_x DOUBLE, min_y DOUBLE, max_x DOUBLE, max_y DOUBLE, srs_id INTEGER, FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys(srs_id));
      CREATE TABLE gpkg_geometry_columns (table_name TEXT NOT NULL, column_name TEXT NOT NULL, geometry_type_name TEXT NOT NULL, srs_id INTEGER NOT NULL, z TINYINT NOT NULL, m TINYINT NOT NULL, PRIMARY KEY (table_name, column_name), FOREIGN KEY (srs_id) REFERENCES gpkg_spatial_ref_sys(srs_id));
      CREATE TABLE sites (fid INTEGER PRIMARY KEY AUTOINCREMENT, project_id TEXT NOT NULL, geom BLOB NOT NULL);
      INSERT INTO gpkg_contents(table_name,data_type,identifier,description,min_x,min_y,max_x,max_y,srs_id) VALUES ('sites','features','sites','ARKI fixture',0,0,0.0001,0.0001,4326);
      INSERT INTO gpkg_geometry_columns VALUES ('sites','geom','POLYGON',4326,0,0);
    """)
    # GeoPackage binary header + little-endian WKB polygon.
    rings = [(0.0, 0.0), (0.0001, 0.0), (0.0001, 0.0001), (0.0, 0.0001), (0.0, 0.0)]
    wkb = struct.pack("<bI I", 1, 3, 1) + struct.pack("<I", len(rings)) + b"".join(struct.pack("<dd", *point) for point in rings)
    header = b"GP" + bytes([0, 0]) + struct.pack("<i", 4326) + bytes([0]) * 8
    conn.execute("INSERT INTO sites(project_id,geom) VALUES (?,?)", ("ARKI-FIXTURE-001", header + wkb))
    conn.commit()
    conn.close()
    return {"format": "GEOPACKAGE", "crs": "EPSG:4326", "features": 1}


def create_ifc(output: Path) -> dict:
    import ifcopenshell
    import ifcopenshell.api
    model = ifcopenshell.api.run("project.create_file", version="IFC4")
    project = ifcopenshell.api.run("root.create_entity", model, ifc_class="IfcProject", name="ARKI IFC Fixture")
    length_unit = ifcopenshell.api.run("unit.add_si_unit", model, unit_type="LENGTHUNIT")
    area_unit = ifcopenshell.api.run("unit.add_si_unit", model, unit_type="AREAUNIT")
    ifcopenshell.api.run("unit.assign_unit", model, units=[length_unit, area_unit])
    context = ifcopenshell.api.run("context.add_context", model, context_type="Model")
    site = ifcopenshell.api.run("root.create_entity", model, ifc_class="IfcSite", name="ARKI Site")
    building = ifcopenshell.api.run("root.create_entity", model, ifc_class="IfcBuilding", name="ARKI Building")
    storey = ifcopenshell.api.run("root.create_entity", model, ifc_class="IfcBuildingStorey", name="Ground Floor")
    wall = ifcopenshell.api.run("root.create_entity", model, ifc_class="IfcWall", name="Fixture Wall")
    for parent, child in [(project, site), (site, building), (building, storey), (storey, wall)]:
        ifcopenshell.api.run("aggregate.assign_object", model, products=[child], relating_object=parent)
    representation = ifcopenshell.api.run("geometry.add_wall_representation", model, context=context, length=10.0, height=3.0, thickness=0.2)
    ifcopenshell.api.run("geometry.assign_representation", model, product=wall, representation=representation)
    model.write(output)
    return {"format": "IFC4", "entities": len(model.by_type("IfcRoot")), "schema": model.schema}


def create_step(output: Path, iges: bool = False) -> dict:
    from OCP.BRepPrimAPI import BRepPrimAPI_MakeBox
    shape = BRepPrimAPI_MakeBox(10.0, 6.0, 3.0).Shape()
    if iges:
        from OCP.IGESControl import IGESControl_Controller, IGESControl_Writer
        IGESControl_Controller.Init_s()
        writer = IGESControl_Writer("MM", 0)
        writer.AddShape(shape)
        writer.Write(str(output))
        return {"format": "IGES", "shape": "box", "units": "millimetres"}
    from OCP.STEPControl import STEPControl_AsIs, STEPControl_Writer
    writer = STEPControl_Writer()
    writer.Transfer(shape, STEPControl_AsIs)
    writer.Write(str(output))
    return {"format": "STEP", "shape": "box", "units": "millimetres"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("operation", choices=["dxf", "geojson", "gpkg", "ifc", "step", "iges"])
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    creators = {"dxf": create_dxf, "geojson": create_geojson, "gpkg": create_gpkg, "ifc": create_ifc, "step": create_step, "iges": lambda p: create_step(p, iges=True)}
    result = creators[args.operation](args.output)
    print(json.dumps({"ok": True, "output": str(args.output), **result}, sort_keys=True))


if __name__ == "__main__":
    main()
