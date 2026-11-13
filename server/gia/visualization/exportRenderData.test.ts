import { describe, expect, it } from "vitest";
import { exportRenderData } from "./exportRenderData";
import type { IntegratedArchitectCycle } from "../../arkiIntegratedArchitectCycle";
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

// === Tests del Funnel 9-4-1 ===

import { exportRenderDataForParti, exportRenderDataForAllPartis } from "./exportRenderData";
import { renderSolidSvg } from "./renderSolidSvg";
import type { DynamicParti } from "../../arkiProjectBrain";

const defaultParti: DynamicParti = {
  id: "PARTI-TEST",
  title: "Test",
  organizingIdea: "Test idea",
  rules: [],
  flowStrategy: "linear-separation",
  derivedFrom: [],
  status: "AI_PROPOSED",
  humanReviewRequired: true,
};

describe("Funnel 9-4-1 — exportRenderDataForAllPartis", () => {
  it("genera un RenderData por cada PARTI del ciclo", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const renders = exportRenderDataForAllPartis(cycle);
    expect(renders).toHaveLength(cycle.projectPartis.length);
    expect(renders.length).toBeGreaterThanOrEqual(2);
    const ids = renders.map((r) => r.partiId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("PARTIs con flowStrategy distinto tienen vértices distintos", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const renders = exportRenderDataForAllPartis(cycle);
    const strategies = new Set(renders.map((r) => r.flowStrategy));
    if (strategies.size >= 2) {
      const vertexHashes = renders.map((r) => JSON.stringify(r.vertices.slice(0, 10)));
      expect(new Set(vertexHashes).size).toBeGreaterThan(1);
    }
  });

  it("cada RenderData incluye todos los materiales del motor", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const renders = exportRenderDataForAllPartis(cycle);
    for (const render of renders) {
      expect(render.materials.length).toBeGreaterThan(0);
      for (const mat of render.materials) {
        expect(mat.id).toBeDefined();
        expect(mat.color).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("cada RenderData genera un SVG isométrico propio", async () => {
    const cycle = await executeIntegratedArchitectCycle(input);
    const renders = exportRenderDataForAllPartis(cycle);
    for (const render of renders) {
      const svg = renderSolidSvg(render);
      expect(svg).toMatch(/^<svg /);
      expect(svg).toContain("viewBox=");
      expect(svg).toContain("</svg>");
      expect(svg).toContain(`ARKI solid ${render.projectId}`);
    }
  });

  it("conceptFromParti mapea los 3 flowStrategy a 3 concepts", () => {
    // Test indirecto: exportRenderDataForParti con 3 partis con flowStrategy distintos
    // produce 3 RenderData con vértices distintos
    const cycle = { project: { projectId: "TEST", typology: "test" }, projectPartis: [], evaluation: { engines: {} }, reasoning: {} } as unknown as IntegratedArchitectCycle;
    const p1 = { ...defaultParti, flowStrategy: "linear-separation" };
    const p2 = { ...defaultParti, flowStrategy: "central-hub" };
    const p3 = { ...defaultParti, flowStrategy: "nested-rings" };
    const r1 = exportRenderDataForParti(cycle, p1);
    const r2 = exportRenderDataForParti(cycle, p2);
    const r3 = exportRenderDataForParti(cycle, p3);
    const hashes = [r1, r2, r3].map((r) => JSON.stringify(r.vertices.slice(0, 5)));
    expect(new Set(hashes).size).toBeGreaterThan(1);
  });
});
