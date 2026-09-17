import { describe, expect, it } from "vitest";
import { exportFileName, spatialToDxf, spatialToGlb, spatialToIfc } from "./spatialExport";
import type { SpatialRepresentation } from "../components/UPAO001SpatialViewer";

const rep: SpatialRepresentation = {
  id: "SR-UPAO-001-B", project_id: "UPAO-001", alternative_id: "UPAO-001-B", alternative_name: "COURTYARD / VOID", north_degrees: 0,
  elements: [{ id: "SITE", element_type: "SiteBoundary", geometry: { type: "polygon", coordinates: [[[-10,-10],[10,-10],[10,10],[-10,10],[-10,-10]]] }, metadata: {} }, { id: "MASS-B", element_type: "BuildingMass", geometry: { type: "volume", coordinates: [[-4,-4,0],[4,-4,0],[4,4,0],[-4,4,0],[-4,-4,4],[4,-4,4],[4,4,4],[-4,4,4]] }, metadata: { height: 4, base_elevation: 0, floor_count: 1 } }],
};
const meta = { projectId: "UPAO-001", alternativeId: "UPAO-001-B", alternativeName: "COURTYARD / VOID", provenance: "test", units: "m", coordinateSystem: "LOCAL_ENU" };

describe("spatial export interoperability", () => {
  it("creates deterministic useful names", () => expect(exportFileName(meta, "ifc")).toBe("SiMS-DeI_UPAO-001_UPAO-001-B_COURTYARD_VOID.ifc"));
  it("exports DXF layers and geometry without mutating representation", () => { const before = JSON.stringify(rep); const out = spatialToDxf(rep, meta); expect(out).toContain("SIMS_SITE"); expect(out).toContain("SIMS_BUILDING"); expect(out).toContain("-10"); expect(JSON.stringify(rep)).toBe(before); });
  it("exports a valid GLB header with canonical alternative metadata", () => { const out = spatialToGlb(rep, meta); expect(new TextDecoder().decode(out.slice(0,4))).toBe("glTF"); expect(out.byteLength).toBeGreaterThan(100); });
  it("exports IFC4 spatial/massing exchange with stable identity", () => { const out = spatialToIfc(rep, meta); expect(out).toContain("FILE_SCHEMA(('IFC4'))"); expect(out).toContain("UPAO-001-B"); expect(out).toContain("IFCBUILDINGELEMENTPROXY"); expect(out).toContain("END-ISO-10303-21"); });
});
