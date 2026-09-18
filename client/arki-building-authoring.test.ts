import { describe, expect, it } from "vitest";
import { generateHouseA21S1FloorPlan } from "./src/components/arkiConstructiveSpatialGeneration";
import { buildCanonicalBuildingModel, deriveDrawingViews, drawingViewToSvg, spatialRepresentationToGeoJson, validateAuthoringIdentity } from "./src/components/arkiBuildingAuthoring";
import type { SpatialRepresentation } from "./src/components/UPAO001SpatialViewer";

const representation: SpatialRepresentation = { id: "SR-A", alternative_id: "UPAO-001-A", spatial_scope: "edificacion", representation_version: "1.0", generator_version: "test", coordinate_system: "LOCAL_ENU", units: "m", input_fingerprint: "a".repeat(64), north_degrees: 0, elements: [{ id: "site", element_type: "SiteBoundary", geometry: { type: "polygon", coordinates: [[[0, 0], [24, 0], [24, 18], [0, 18], [0, 0]]] } }] };

describe("ARKI canonical building authoring bridge", () => {
  it("derives one stable building model from the existing S1 plan", () => {
    const model = buildCanonicalBuildingModel(generateHouseA21S1FloorPlan());
    expect(model.maturity).toBe("CONCEPTUAL");
    expect(model.constructionReady).toBe(false);
    expect(model.elements.some((item) => item.kind === "SPACE")).toBe(true);
    expect(model.elements.some((item) => item.kind === "WALL")).toBe(true);
    expect(model.elements.some((item) => item.kind === "DOOR")).toBe(true);
    expect(model.elements.every((item) => item.epistemicState === "HYPOTHESIS")).toBe(true);
  });
  it("derives plans, site, section and elevation views without a second source of truth", () => {
    const model = buildCanonicalBuildingModel();
    const views = deriveDrawingViews(model);
    expect(views.map((view) => view.kind)).toEqual(["FLOOR_PLAN", "SITE_PLAN", "BUILDING_SECTION", "EXTERIOR_ELEVATION"]);
    expect(validateAuthoringIdentity(model, views)).toBe(true);
    expect(drawingViewToSvg(views[0])).toContain(`data-model-version="${model.modelVersion}"`);
  });
  it("preserves explicit conceptual maturity and avoids false construction claims", () => {
    const svg = drawingViewToSvg(deriveDrawingViews(buildCanonicalBuildingModel())[2]);
    expect(svg).toContain("CONCEPTUAL");
    expect(svg).toContain("PERMIT_READY=FALSE");
    expect(svg).toContain("CONSTRUCTION_READY=FALSE");
  });
  it("exports the existing spatial representation to GeoJSON with CRS and provenance", () => {
    const geojson = spatialRepresentationToGeoJson(representation);
    expect(geojson.type).toBe("FeatureCollection");
    expect(geojson.features.length).toBeGreaterThan(0);
    expect(geojson.metadata.crs).toBe(representation.coordinate_system);
    expect(geojson.features.every((feature) => feature.properties.provenance)).toBe(true);
  });
  it("preserves cross-representation identity", () => {
    const model = buildCanonicalBuildingModel();
    const views = deriveDrawingViews(model);
    const referenced = views.flatMap((view) => view.elementIds);
    expect(referenced.every((id) => model.elements.some((element) => element.arkiId === id))).toBe(true);
    expect(new Set(model.elements.map((element) => element.arkiId)).size).toBe(model.elements.length);
  });
});
