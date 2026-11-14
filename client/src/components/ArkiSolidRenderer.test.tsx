// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import React from "react";
import { render } from "@testing-library/react";
import type { RenderData } from "../../../server/gia/visualization/types";

// Mock de R3F: Canvas se reemplaza por un div, useThree no se usa en el test
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  ),
  useThree: () => ({}),
}));

// Mock de Drei: OrbitControls y Environment no hacen nada en jsdom
vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  Environment: () => null,
}));

import ArkiSolidRenderer from "./ArkiSolidRenderer";

const fixture: RenderData = {
  projectId: "TEST-001",
  typology: "TEST",
  vertices: [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1],
  ],
  faces: [
    { vertices: [0, 1, 2], materialId: "concrete" },
    { vertices: [0, 1, 3], materialId: "glass" },
  ],
  materials: [
    { id: "concrete", type: "concrete", color: "#888888", roughness: 0.9, metalness: 0 },
    { id: "glass", type: "glass", color: "#aaccff", roughness: 0.1, metalness: 0, transmission: 0.9 },
  ],
  cameras: [
    { id: "perspective", position: [5, 5, 5], target: [0, 0, 0], fov: 45 },
    { id: "axonometric", position: [10, 10, 10], target: [0, 0, 0], fov: 30 },
    { id: "pedestrian", position: [2, 1.6, 2], target: [0, 0, 0], fov: 60 },
    { id: "aerial", position: [20, 20, 20], target: [0, 0, 0], fov: 40 },
  ],
  lighting: { hdri: "blue_hour", sunAzimuthDeg: 180, sunElevationDeg: 45 },
  partiId: "P1",
  flowStrategy: "linear-separation",
  organizingIdea: "Torre esbelta",
};

describe("ArkiSolidRenderer", () => {
  it("monta sin errores y renderiza el canvas mock", () => {
    const { container } = render(<ArkiSolidRenderer renderData={fixture} />);
    const canvas = container.querySelector('[data-testid="r3f-canvas"]');
    expect(canvas).toBeTruthy();
  });

  it("renderiza el botón de exportar PNG si onExportPng está definido", () => {
    const { container } = render(<ArkiSolidRenderer renderData={fixture} onExportPng={() => {}} />);
    const button = container.querySelector("button");
    expect(button?.textContent).toContain("Exportar PNG");
  });

  it("no renderiza el botón de exportar PNG si onExportPng no está definido", () => {
    const { container } = render(<ArkiSolidRenderer renderData={fixture} />);
    const button = container.querySelector("button");
    expect(button).toBeFalsy();
  });
});
