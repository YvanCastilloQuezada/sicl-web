import { describe, expect, it } from "vitest";
import { exportAutonomySimulation, getAutonomySimulationPreview } from "./autonomyReport";

describe("exportación de simulación de autonomía", () => {
  it("expone una vista previa acotada antes de exportar", async () => {
    const preview = await getAutonomySimulationPreview();
    expect(preview.title).toContain("autonomía 24 horas");
    expect(preview.summary).toMatchObject({ passed: true, ticks: 1440, uniqueClaims: 1440 });
    expect(preview.samples).toHaveLength(12);
    expect(preview.sampleCount).toBe(2880);
    expect(preview.limitations.length).toBeGreaterThan(0);
  });

  it("genera CSV auditable con todas las muestras", async () => {
    const artifact = await exportAutonomySimulation("csv");
    const content = Buffer.from(artifact.base64, "base64").toString("utf8");
    expect(artifact.format).toBe("csv");
    expect(artifact.mimeType).toContain("text/csv");
    expect(artifact.filename).toMatch(/milukita-autonomy-24h-\d{4}-\d{2}-\d{2}\.csv/);
    expect(artifact.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(content).toContain("claims_unicos,1440");
    expect(content).toContain("intento,fecha,taskUid,bucket,claimKey,ejecucion,accion_esperada");
    expect(content.split("\n")).toHaveLength(2902);
  });

  it("genera PDF con el resumen PASS y bytes verificables", async () => {
    const artifact = await exportAutonomySimulation("pdf");
    const bytes = Buffer.from(artifact.base64, "base64");
    expect(artifact.format).toBe("pdf");
    expect(artifact.mimeType).toBe("application/pdf");
    expect(artifact.filename).toMatch(/\.pdf$/);
    expect(bytes.subarray(0, 5).toString("ascii")).toBe("%PDF-");
    expect(bytes.byteLength).toBe(artifact.byteSize);
    expect(artifact.report).toMatchObject({ passed: true, ticks: 1440, totalAttempts: 2880, uniqueClaims: 1440, duplicateClaims: 1440 });
  });
});
