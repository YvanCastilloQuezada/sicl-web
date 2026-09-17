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
    expect(screen.getAllByText("UPAO-001-A").length).toBeGreaterThan(0);
    expect(screen.getAllByText("UPAO-001-B").length).toBeGreaterThan(0);
    expect(screen.getAllByText("UPAO-001-C").length).toBeGreaterThan(0);
    expect(screen.getByText("Focused design")).toBeTruthy();
    expect(screen.getByRole("button", { name: "2D plan" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "2D plan" }));
    expect(screen.getAllByTestId("spatial-viewer")).toHaveLength(1);
  });
  it("selection remains inspection state and does not expose approval language", () => {
    render(view());
    fireEvent.click(screen.getByTestId("comparison-panel-UPAO-001-A"));
    expect(screen.getByRole("status").textContent).toContain("Selected for inspection: UPAO-001-A");
    expect(screen.getByRole("status").textContent).toContain("does not create a Decision");
    expect(screen.queryByText("Winner")).toBeNull();
    expect(screen.queryByText("Recommended")).toBeNull();
  });
  it("transitions explicitly between building and site while preserving the focused alternative", () => {
    render(view());
    fireEvent.click(screen.getByTestId("comparison-panel-UPAO-001-B"));
    expect(screen.getAllByTestId("scope-indicator")[0].textContent).toBe("EDIFICACIÓN");
    fireEvent.click(screen.getAllByRole("button", { name: "View in site" })[0]);
    expect(screen.getAllByTestId("scope-indicator")[0].textContent).toBe("PARCELA / SITIO");
    expect(screen.getByText("Parcel / site context")).toBeTruthy();
    expect(screen.getByText("UPAO-001-B · COURTYARD / VOID")).toBeTruthy();
    fireEvent.click(screen.getByTestId("comparison-panel-UPAO-001-C"));
    expect(screen.getAllByTestId("scope-indicator")[0].textContent).toBe("PARCELA / SITIO");
    expect(screen.getByText("UPAO-001-C · ARTICULATED / SEPARATED MASSES")).toBeTruthy();
    fireEvent.click(screen.getAllByRole("button", { name: "Inspect building" })[0]);
    expect(screen.getAllByTestId("scope-indicator")[0].textContent).toBe("EDIFICACIÓN");
    expect(screen.getByText("UPAO-001-C · ARTICULATED / SEPARATED MASSES")).toBeTruthy();
  });
  it("keeps site context truthful and does not claim terrain or GIS data", () => {
    render(view());
    fireEvent.click(screen.getAllByRole("button", { name: "View in site" })[0]);
    expect(screen.getAllByText(/NOT AVAILABLE|NO DISPONIBLE|not_available/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getAllByRole("button", { name: "2D plan" })[0]);
    expect(screen.getAllByText("MODEL PROJECT / EDUCATIONAL EXAMPLE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Synthetic analytical geometry · LOCAL_ENU · m").length).toBeGreaterThan(0);
  });
  it("exposes shadow modes and disables photo-realistic without faking it", () => {
    render(view());
    expect(screen.getByText("faces_shadows")).toBeTruthy();
    expect(screen.getByText("materials_shadows")).toBeTruthy();
    const photoButton = screen.getByText("photo_realistic").closest("button");
    expect(photoButton?.hasAttribute("disabled")).toBe(true);
    fireEvent.click(screen.getByText("faces_shadows"));
    expect(screen.getByText("faces_shadows").closest("button")?.getAttribute("aria-pressed")).toBe("true");
  });
  it("offers truthful presentation modes and keeps saved views local to the UI", () => {
    render(view());
    expect(screen.getByText("lines")).toBeTruthy();
    expect(screen.getByText("realistic")).toBeTruthy();
    fireEvent.click(screen.getByText("faces"));
    expect(screen.getByText("faces").closest("button")?.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "Save current view" }));
    expect(screen.getByText("UPAO-001-A · faces")).toBeTruthy();
  });
  it("offers 3D mode without eagerly rendering it in 2D", () => {
    render(view());
    expect(screen.getByRole("button", { name: "3D massing" })).toBeTruthy();
    expect(screen.getByTestId("comparison-3d-UPAO-001-A")).toBeTruthy();
    expect(screen.getByText("Drag to rotate · wheel to zoom · right-drag to pan")).toBeTruthy();
  });
});
