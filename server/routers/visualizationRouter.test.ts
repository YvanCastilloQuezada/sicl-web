import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { visualizationRouter } from "./visualizationRouter";

const rascacielos = JSON.parse(
  readFileSync(resolve(__dirname, "../gia/fixtures/rascacielos.json"), "utf-8")
);

// Helper para invocar un procedure tRPC sin pasar por HTTP
async function callProcedure<T>(
  proc: unknown,
  input: unknown,
): Promise<T> {
  const caller = (proc as { _def: { resolver: (opts: { input: unknown; ctx: unknown }) => Promise<T> } });
  // tRPC v11: el resolver vive en _def.resolver
  return caller._def.resolver({ input, ctx: { user: { id: 1, openId: "test" } } });
}

describe("visualizationRouter", () => {
  it("getRenderDataForAllPartis devuelve N RenderData con rascacielos.json", async () => {
    const proc = visualizationRouter._def.procedures.getRenderDataForAllPartis;
    const result = await callProcedure<{ projectId: string; nPartis: number; renderDatas: unknown[] }>(
      proc,
      { input: rascacielos },
    );

    expect(result.projectId).toBe("RAS-LIM-200-001");
    expect(result.nPartis).toBeGreaterThanOrEqual(2);
    expect(result.renderDatas).toHaveLength(result.nPartis);

    for (const rd of result.renderDatas as Array<{ partiId: string; materials: unknown[]; cameras: unknown[]; vertices: unknown[]; faces: unknown[] }>) {
      expect(rd.partiId).toBeTruthy();
      expect(rd.materials.length).toBeGreaterThan(0);
      expect(rd.cameras).toHaveLength(4);
      expect(rd.vertices.length).toBeGreaterThan(0);
      expect(rd.faces.length).toBeGreaterThan(0);
    }
  }, 30000);

  it("getRenderDataForParti devuelve el RenderData del partiId solicitado", async () => {
    const allProc = visualizationRouter._def.procedures.getRenderDataForAllPartis;
    const all = await callProcedure<{ renderDatas: Array<{ partiId: string }> }>(allProc, { input: rascacielos });
    const targetPartiId = all.renderDatas[0].partiId;

    const proc = visualizationRouter._def.procedures.getRenderDataForParti;
    const rd = await callProcedure<{ partiId: string }>(proc, { input: rascacielos, partiId: targetPartiId });
    expect(rd.partiId).toBe(targetPartiId);
  }, 30000);

  it("getVisualRequestForParti devuelve prompt + referenceSvg", async () => {
    const allProc = visualizationRouter._def.procedures.getRenderDataForAllPartis;
    const all = await callProcedure<{ renderDatas: Array<{ partiId: string }> }>(allProc, { input: rascacielos });
    const targetPartiId = all.renderDatas[0].partiId;

    const proc = visualizationRouter._def.procedures.getVisualRequestForParti;
    const vr = await callProcedure<{ prompt: string; referenceSvg: string; quality: string }>(proc, {
      input: rascacielos,
      partiId: targetPartiId,
      quality: "2K",
      purpose: "EXTERIOR_RENDER",
      language: "es",
    });
    expect(vr.prompt).toContain("Tipología");
    expect(vr.referenceSvg).toContain("<svg");
    expect(vr.quality).toBe("2K");
  }, 30000);
});
