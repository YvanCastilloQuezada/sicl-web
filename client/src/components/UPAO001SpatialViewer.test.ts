// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { SpatialSvgViewer, type SpatialRepresentation } from "./UPAO001SpatialViewer";

const representation = (alternative_id: string, strategy: string): SpatialRepresentation => ({
  id: `SR-${alternative_id}`, alternative_id, spatial_scope: "edificacion", representation_version: "1.0", generator_version: "upao001-spatial-v1", coordinate_system: "LOCAL_ENU", units: "m", input_fingerprint: "a".repeat(64), north_degrees: 270,
  elements: [
    { id: `${alternative_id}-site`, element_type: "SiteBoundary", geometry: { type: "polygon", coordinates: [[[0, 0], [40, 0], [40, 30], [0, 30], [0, 0]]] }, labels: { es: "Límite del sitio" } },
    { id: `${alternative_id}-footprint`, element_type: "BuildingFootprint", geometry: { type: "polygon", coordinates: [strategy === "courtyard" ? [[8, 6], [32, 6], [32, 24], [8, 24], [8, 6]] : [[10, 8], [30, 8], [30, 22], [10, 22], [10, 8]]] }, labels: { es: "Huella" } },
    { id: `${alternative_id}-mass`, element_type: "BuildingMass", geometry: { type: "volume", coordinates: [[[10, 8, 0], [30, 8, 0], [30, 22, 0], [10, 22, 0], [10, 8, 8], [30, 8, 8], [30, 22, 8], [10, 22, 8]]] }, metadata: { strategy }, labels: { es: "Masa" } },
    { id: `${alternative_id}-zone`, element_type: "SpatialZone", geometry: { type: "polygon", coordinates: [[[11, 9], [19, 9], [19, 12], [11, 12], [11, 9]]] }, labels: { es: "Comercial" } },
    { id: `${alternative_id}-circulation`, element_type: "CirculationElement", geometry: { type: "line", coordinates: [[20, 2], [20, 15]] }, labels: { es: "Acceso" } },
  ],
});
const view = (value: SpatialRepresentation, metrics?: Record<string, number>) => React.createElement(SpatialSvgViewer, { representation: value, metrics });
afterEach(() => cleanup());

describe("UPAO001SpatialViewer SVG projection", () => {
  it("renders all S2 controlled element types with stable spatial IDs", () => {
    render(view(representation("UPAO-001-A", "compact"), { site_area: 1200, footprint_area: 280, coverage_ratio: 0.23, gross_massing_area: 1400, height: 16, floor_count: 5 }));
    expect(screen.getByTestId("spatial-viewer")).toBeTruthy();
    expect(screen.getByTestId("north-indicator").getAttribute("aria-label")).toBe("North 270 degrees");
    expect(document.querySelector('[data-spatial-id="UPAO-001-A-site"]')).toBeTruthy();
    expect(document.querySelector('[data-spatial-id="UPAO-001-A-footprint"]')).toBeTruthy();
    expect(document.querySelector('[data-spatial-id="UPAO-001-A-mass"]')).toBeTruthy();
    expect(document.querySelector('[data-spatial-id="UPAO-001-A-zone"]')).toBeTruthy();
    expect(document.querySelector('[data-spatial-id="UPAO-001-A-circulation"]')).toBeTruthy();
    expect(screen.getByText("site_area: 1200.0 m²")).toBeTruthy();
    expect(screen.getByText("MODEL PROJECT / EDUCATIONAL EXAMPLE")).toBeTruthy();
  });
  it("renders different S2 geometry for individually selected alternatives without comparison", () => {
    const { rerender } = render(view(representation("UPAO-001-A", "compact")));
    const firstPolygon = document.querySelector('[data-spatial-id="UPAO-001-A-footprint"] polygon')?.getAttribute("points");
    rerender(view(representation("UPAO-001-B", "courtyard")));
    const secondPolygon = document.querySelector('[data-spatial-id="UPAO-001-B-footprint"] polygon')?.getAttribute("points");
    expect(firstPolygon).toBeTruthy(); expect(secondPolygon).toBeTruthy(); expect(firstPolygon).not.toBe(secondPolygon);
    expect(document.querySelector('[data-spatial-id="UPAO-001-A-footprint"]')).toBeNull();
    rerender(view(representation("UPAO-001-C", "articulated")));
    expect(document.querySelector('[data-spatial-id="UPAO-001-C-footprint"] polygon')?.getAttribute("points")).toBeTruthy();
  });
  it("keeps explicit SVG presentation attributes independent of Tailwind CSS", () => {
    render(view(representation("UPAO-001-A", "compact")));
    const expected = [
      ["site", "#dbeafe", "#2563eb"],
      ["footprint", "#f59e0b", "#b45309"],
      ["mass", "#f97316", "#9a3412"],
      ["zone", "#22c55e", "#15803d"],
    ] as const;
    for (const [id, fill, stroke] of expected) {
      const polygon = document.querySelector(`[data-spatial-id="UPAO-001-A-${id}"] polygon`);
      expect(polygon?.getAttribute("fill")).toBe(fill);
      expect(polygon?.getAttribute("stroke")).toBe(stroke);
      expect(polygon?.getAttribute("stroke-width")).toBe("2");
    }
    const circulation = document.querySelector('[data-spatial-id="UPAO-001-A-circulation"] polyline');
    expect(circulation?.getAttribute("fill")).toBe("none");
    expect(circulation?.getAttribute("stroke")).toBe("#7c3aed");
    expect(circulation?.getAttribute("stroke-width")).toBe("3");
    const north = screen.getByTestId("north-indicator").querySelector("line");
    expect(north?.getAttribute("stroke")).toBe("#111827");
    expect(north?.getAttribute("stroke-width")).toBe("3");
    const label = document.querySelector('[data-spatial-id="UPAO-001-A-mass-label"]');
    expect(label?.getAttribute("fill")).toBe("#111827");
    expect(label?.getAttribute("font-size")).toBe("10");
  });
  it("separates coincident residential and circulation labels deterministically", () => {
    const item = representation("UPAO-001-A", "compact");
    const sharedGeometry = { type: "polygon", coordinates: [[[10, 14], [30, 14], [30, 18], [10, 18], [10, 14]]] };
    item.elements.push(
      { id: "SpatialZone:zone-residential:test", element_type: "SpatialZone", geometry: sharedGeometry, labels: { es: "residential" } },
      { id: "SpatialZone:zone-circulation-service:test", element_type: "SpatialZone", geometry: sharedGeometry, labels: { es: "circulation/service" } },
    );
    render(view(item));
    const residential = document.querySelector('[data-spatial-id="SpatialZone:zone-residential:test-label"]');
    const circulation = document.querySelector('[data-spatial-id="SpatialZone:zone-circulation-service:test-label"]');
    expect(residential?.getAttribute("x")).toBe(circulation?.getAttribute("x"));
    expect(residential?.getAttribute("y")).not.toBe(circulation?.getAttribute("y"));
    expect(residential?.getAttribute("stroke")).toBe("#ffffff");
    expect(circulation?.getAttribute("paint-order")).toBe("stroke");
    expect(residential?.getAttribute("data-spatial-id")).toContain("zone-residential");
    expect(circulation?.getAttribute("data-spatial-id")).toContain("zone-circulation-service");
  });
  it("reports unsupported types without crashing the complete SVG", () => {
    const item = representation("UPAO-001-C", "articulated");
    item.elements.push({ id: "unknown-1", element_type: "UnknownType", geometry: { type: "point", coordinates: [20, 15] } });
    render(view(item));
    expect(screen.getByRole("status").textContent).toContain("UnknownType");
    expect(screen.getByTestId("spatial-viewer")).toBeTruthy();
    expect(document.querySelector('[data-spatial-id="unknown-1"] polygon')).toBeNull();
  });
});
