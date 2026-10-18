import { describe, expect, it } from "vitest";
import { getUnifiedReportPreview, renderUnifiedReportPdf } from "./auditReports";

describe("auditReports", () => {
  it("lee el informe unificado y calcula metadatos reproducibles", async () => {
    const preview = await getUnifiedReportPreview();
    expect(preview.filename).toBe("MJP_INFORME_UNIFICADO_DETALLES_Y_AUDITORIA.md");
    expect(preview.markdown).toContain("MiLukita — Informe unificado de detalles y auditoría");
    expect(preview.lineCount).toBeGreaterThan(100);
    expect(preview.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(preview.byteSize).toBeGreaterThan(10_000);
  });

  it("genera un PDF no vacío con la portada y contenido del informe", async () => {
    const pdf = await renderUnifiedReportPdf("# Informe de prueba\n\n## Estado\n\nPiloto virtual");
    expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(1_000);
  });

  it("mantiene la autoridad del MJP CORE explícita en el informe fuente", async () => {
    const preview = await getUnifiedReportPreview();
    expect(preview.markdown).toContain("MJP CORE");
    expect(preview.markdown).toContain("créditos virtuales");
  });
});
