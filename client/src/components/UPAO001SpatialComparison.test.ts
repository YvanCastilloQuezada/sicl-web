// @vitest-environment jsdom
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

vi.mock("react-i18next", () => ({ useTranslation: () => ({ i18n: { language: "es" }, t: (key: string) => key }) }));

import UPAO001SpatialComparison, { ALT_ORDER, ALT_TITLES, comparisonBounds, metricsSummary } from "./UPAO001SpatialComparison";
import type { SpatialRepresentation, TransportPayload } from "./UPAO001SpatialViewer";

const representation = (alternative_id: string, massCount: number, height: number): SpatialRepresentation => ({
  id: `SR-${alternative_id}`, alternative_id, spatial_scope: "edificacion", representation_version: "1.0", generator_version: "upao001-spatial-v1", coordinate_system: "LOCAL_ENU", units: "m", input_fingerprint: "a".repeat(64), north_degrees: 0,
  elements: [
    { id: `${alternative_id}-site`, element_type: "SiteBoundary", geometry: { type: "polygon", coordinates: [[[0, 0], [40, 0], [40, 30], [0, 30], [0, 0]]] } },
    ...Array.from({ length: massCount }, (_, index) => ({ id: `${alternative_id}-mass-${index + 1}`, element_type: "BuildingMass" as const, geometry: { type: "volume", coordinates: [[5 + index * 14, 6, 0], [15 + index * 14, 6, 0], [15 + index * 14, 18, 0], [5 + index * 14, 18, 0], [5 + index * 14, 6, height], [15 + index * 14, 6, height], [15 + index * 14, 18, height], [5 + index * 14, 18, height]] }, metadata: { height, base_elevation: 0, floor_count: Math.round(height / 3.2) } })),
  ],
});

const payload = (): TransportPayload => ({
  representations: [representation("UPAO-001-A", 1, 16), representation("UPAO-001-B", 4, 12.8), representation("UPAO-001-C", 2, 9.6)],
  metrics: { "UPAO-001-A": { height: 16, floor_count: 5, footprint_area: 342.7, coverage_ratio: 0.285 }, "UPAO-001-B": { height: 12.8, floor_count: 4, footprint_area: 300, coverage_ratio: 0.25 }, "UPAO-001-C": { height: 9.6, floor_count: 3, footprint_area: 214.7, coverage_ratio: 0.179 } },
  explanations: {}, provenance: "MODEL PROJECT / EDUCATIONAL EXAMPLE", read_only: true,
});

const view = () => React.createElement(UPAO001SpatialComparison, { payload: payload() });
afterEach(() => cleanup());

describe("UPAO001SpatialComparison S5", () => {
  it("keeps canonical A/B/C order and descriptive configuration names", () => {
    expect(ALT_ORDER).toEqual(["UPAO-001-A", "UPAO-001-B", "UPAO-001-C"]);
    expect(ALT_TITLES["UPAO-001-A"]).toContain("COMPACT");
    expect(ALT_TITLES["UPAO-001-B"]).toContain("COURTYARD");
    expect(ALT_TITLES["UPAO-001-C"]).toContain("SEPARATED");
  });
  it("computes one common site comparison bounds instead of fitting independently", () => {
    expect(comparisonBounds(payload().representations)).toEqual({ minX: 0, maxX: 57, minY: 0, maxY: 30 });
  });
  it("uses only existing metrics and keeps alternative association visible", () => {
    expect(metricsSummary(payload().metrics["UPAO-001-B"])).toEqual(["Height: 12.8 m", "Floors: 4", "Footprint: 300.0 m²", "Coverage: 0.250"]);
    expect(metricsSummary(undefined)).toEqual(["No metrics available"]);
  });
  it("renders A/B/C simultaneously in 2D and preserves representation identity", () => {
    render(view());
    expect(screen.getAllByTestId("comparison-panel-UPAO-001-A")).toHaveLength(1);
    expect(screen.getAllByTestId("comparison-panel-UPAO-001-B")).toHaveLength(1);
    expect(screen.getAllByTestId("comparison-panel-UPAO-001-C")).toHaveLength(1);
    expect(screen.getByText("SpatialRepresentation: SR-UPAO-001-A")).toBeTruthy();
    expect(screen.getByText("SpatialRepresentation: SR-UPAO-001-B")).toBeTruthy();
    expect(screen.getByText("SpatialRepresentation: SR-UPAO-001-C")).toBeTruthy();
    expect(screen.getAllByTestId("spatial-viewer")).toHaveLength(3);
  });
  it("selection remains inspection state and does not expose approval language", () => {
    render(view());
    fireEvent.click(screen.getAllByRole("button", { name: "Inspect" })[0]);
    expect(screen.getByRole("status").textContent).toContain("Selected for inspection: UPAO-001-A");
    expect(screen.getByRole("status").textContent).toContain("does not create a Decision");
    expect(screen.queryByText("Winner")).toBeNull();
    expect(screen.queryByText("Recommended")).toBeNull();
  });
  it("offers 3D mode without eagerly rendering it in 2D", () => {
    render(view());
    expect(screen.getByRole("button", { name: "3D" })).toBeTruthy();
    expect(screen.queryByTestId("comparison-3d-UPAO-001-A")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "3D" }));
    expect(screen.getByText("Synchronize view")).toBeTruthy();
  });
});
