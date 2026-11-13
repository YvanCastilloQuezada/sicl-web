import { describe, expect, it } from "vitest";
import { exportRenderData } from "./exportRenderData";
import { readFileSync } from "fs";
import { resolve } from "path";
import { executeIntegratedArchitectCycle } from "../../arkiIntegratedArchitectCycle";

const input = JSON.parse(
  readFileSync(resolve(__dirname, "../../gia/fixtures/hospital.json"), "utf-8")
);

describe("exportRenderData", () => {
  it("genera vertices, faces, materiales, cámaras e iluminación", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const render = exportRenderData(cycle);

    expect(render.projectId).toBe(cycle.project.projectId);
    expect(render.vertices.length).toBeGreaterThan(0);
    expect(render.faces.length).toBeGreaterThan(0);
    expect(render.materials.length).toBeGreaterThan(0);
    expect(render.cameras).toHaveLength(4);
    expect(render.cameras.map((c) => c.id)).toEqual(["perspective", "axonometric", "pedestrian", "aerial"]);
    expect(render.lighting.hdri).toBe("blue_hour");
  });

  it("todos los faces referencian vertices válidos", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const render = exportRenderData(cycle);
    const maxIndex = render.vertices.length - 1;

    for (const face of render.faces) {
      for (const idx of face.vertices) {
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThanOrEqual(maxIndex);
      }
    }
  });

  it("los materiales tienen los parámetros PBR completos", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const render = exportRenderData(cycle);

    for (const mat of render.materials) {
      expect(mat.id).toBeDefined();
      expect(mat.type).toMatch(/glass|metal|concrete|wood|vegetation|emissive/);
      expect(mat.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(mat.roughness).toBeGreaterThanOrEqual(0);
      expect(mat.roughness).toBeLessThanOrEqual(1);
      expect(mat.metalness).toBeGreaterThanOrEqual(0);
      expect(mat.metalness).toBeLessThanOrEqual(1);
    }
  });
});
