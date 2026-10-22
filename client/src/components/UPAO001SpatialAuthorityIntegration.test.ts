// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: { language: "es" },
    t: (key: string) => key,
  }),
}));

import UPAO001SpatialViewer, {
  type SpatialRepresentation,
  type TransportPayload,
} from "./UPAO001SpatialViewer";

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

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

const cases = [
  ["Core educational", "SYNTHETIC / EDUCATIONAL / MODEL PROJECT", true, "EDUCATIONAL"],
  ["Project alternative", "DERIVED_FROM_PROJECT_ALTERNATIVE", true, "DERIVED"],
  ["Unrecognized educational label", "MODEL PROJECT / EDUCATIONAL EXAMPLE", true, "UNKNOWN"],
  ["Forged canonical claim", "AGK_CANONICAL", true, "UNKNOWN"],
  ["Missing provenance", undefined, true, "UNKNOWN"],
  ["Missing read-only", "DERIVED_FROM_PROJECT_ALTERNATIVE", undefined, "UNKNOWN"],
  ["Explicitly mutable", "DERIVED_FROM_PROJECT_ALTERNATIVE", false, "UNKNOWN"],
] as const;

describe("ACE85 HTTP-to-viewer authority integration", () => {
  it.each(cases)("%s => %s", async (_name, provenance, readOnly, expected) => {
    const payload = {
      representations: [representation("UPAO-001-A", "compact")],
      metrics: {},
      explanations: {},
      provenance,
      read_only: readOnly,
    } as TransportPayload;

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: payload }),
    });

    vi.stubGlobal("fetch", fetchMock);
    render(React.createElement(UPAO001SpatialViewer));

    const notice = await screen.findByTestId(
      "viewer-spatial-authority-notice"
    );

    expect(notice.getAttribute("data-spatial-authority")).toBe(expected);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0]))
      .toContain("/api/core/v1/projects/UPAO-001/spatial-representations");

    expect(screen.getByTestId("spatial-viewer")).toBeTruthy();

    const text = notice.textContent ?? "";

    if (expected === "EDUCATIONAL") {
      expect(text).toContain("Modelo educativo · No canónico");
      expect(text).toContain(
        "no constituye geometría AGK verificada"
      );
    } else if (expected === "DERIVED") {
      expect(text).toContain("Alternativa derivada · No canónica");
      expect(text).toContain(
        "sin acreditación de snapshot D2 o promoción AGK"
      );
    } else {
      expect(notice.getAttribute("data-spatial-authority"))
        .toBe("UNKNOWN");
      expect(text).toMatch(/no verificad|no confirmad|sin autorización/i);
    }
  });

  it("fails closed on HTTP 503", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    }));

    render(React.createElement(UPAO001SpatialViewer));

    expect(await screen.findByRole("alert")).toBeTruthy();
    expect(
      screen.queryByTestId("viewer-spatial-authority-notice")
    ).toBeNull();
  });
});
