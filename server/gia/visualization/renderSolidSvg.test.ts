import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { executeIntegratedArchitectCycle } from "../../arkiIntegratedArchitectCycle";
import { exportRenderData } from "./exportRenderData";
import { renderSolidSvg } from "./renderSolidSvg";
import { projectVertex, projectAll } from "./projectIsometric";

const input = JSON.parse(
  readFileSync(resolve(__dirname, "../../gia/fixtures/hospital.json"), "utf-8")
);

describe("projectIsometric", () => {
  it("proyecta un cubo de 8 vertices a 8 puntos 2D finitos", () => {
    const cube: Array<[number, number, number]> = [
      [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
      [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
    ];
    const result = projectAll(cube, { width: 400, height: 300, margin: 20 });
    expect(result.points).toHaveLength(8);
    for (const [x, y] of result.points) {
      expect(Number.isFinite(x)).toBe(true);
      expect(Number.isFinite(y)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(20);
      expect(x).toBeLessThanOrEqual(380);
      expect(y).toBeGreaterThanOrEqual(20);
      expect(y).toBeLessThanOrEqual(280);
    }
  });

  it("projectVertex es determinista", () => {
    const v: [number, number, number] = [10, 5, 3];
    const a = projectVertex(v);
    const b = projectVertex(v);
    expect(a).toEqual(b);
  });
});

describe("renderSolidSvg", () => {
  it("genera un SVG válido con un <polygon> por face", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const render = exportRenderData(cycle);
    const svg = renderSolidSvg(render);

    expect(svg).toMatch(/^<svg /);
    expect(svg).toContain("viewBox=");
    expect(svg).toContain("</svg>");

    const polygonCount = (svg.match(/<polygon /g) ?? []).length;
    expect(polygonCount).toBe(render.faces.length);
  });

  it("cada <polygon> tiene fill hex y data-face-index", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const render = exportRenderData(cycle);
    const svg = renderSolidSvg(render);

    const polygons = svg.match(/<polygon [^>]+\/>/g) ?? [];
    expect(polygons.length).toBeGreaterThan(0);

    for (const polygon of polygons) {
      expect(polygon).toMatch(/fill="#[0-9a-f]{6}"/i);
      expect(polygon).toMatch(/data-face-index="\d+"/);
    }
  });

  it("las faces están ordenadas por profundidad (z-buffer aproximado)", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const render = exportRenderData(cycle);
    const svg = renderSolidSvg(render);

    // Extraer los data-face-index en orden de aparición
    const indices = [...svg.matchAll(/data-face-index="(\d+)"/g)].map((m) => parseInt(m[1], 10));
    expect(indices.length).toBe(render.faces.length);

    // La primera face dibujada debe tener mayor o igual profundidad que la última
    const depths = indices.map((i) => {
      const face = render.faces[i];
      const verts = face.vertices.map((vi) => render.vertices[vi]);
      return verts.reduce((acc, v) => acc + v[2], 0) / verts.length;
    });
    expect(depths[0]).toBeGreaterThanOrEqual(depths[depths.length - 1]);
  });
});
