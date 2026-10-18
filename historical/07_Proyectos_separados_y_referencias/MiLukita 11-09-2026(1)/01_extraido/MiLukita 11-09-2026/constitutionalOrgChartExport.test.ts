import { describe, expect, it } from "vitest";
import { MASTER_ORGANIGRAM } from "@/../../shared/milukitaMasterOrder";
import { buildConstitutionalOrgPrintHtml, buildConstitutionalOrgSvg, getUniqueOrgMatch } from "./constitutionalOrgChartExport";

describe("constitutional organigram export helpers", () => {
  it("builds a complete PNG source snapshot from the current filtered view", () => {
    const selected = MASTER_ORGANIGRAM.find((item) => item.layer === "MJP CORE") ?? MASTER_ORGANIGRAM[0];
    const svg = buildConstitutionalOrgSvg([selected], selected, "wallet", 1.2, { x: 24, y: -18 });

    expect(svg.startsWith("<svg ")).toBe(true);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain("MJP CORE");
    expect(svg).toContain("Wallet");
    expect(svg).toContain("búsqueda: wallet");
    expect(svg).toContain("zoom 120%");
    expect(svg).toContain("desplazamiento 24, -18");
    expect(svg).toContain("#164e3b");
  });

  it("builds a printable PDF-ready view with encoded SVG and automatic print hook", () => {
    const selected = MASTER_ORGANIGRAM[0];
    const svg = buildConstitutionalOrgSvg([selected], selected, "MILUKITA NETWORK", 1, { x: 0, y: 0 });
    const html = buildConstitutionalOrgPrintHtml(svg);

    expect(html).toContain("MiLukita · Organigrama constitucional");
    expect(html).toContain("data:image/svg+xml;charset=utf-8,");
    expect(html).toContain("window.print()");
    expect(html).toContain("print-color-adjust:exact");
  });

  it("returns only one layer when the search has a unique match", () => {
    const unique = getUniqueOrgMatch(MASTER_ORGANIGRAM, "MjpTvManifest");
    const ambiguous = getUniqueOrgMatch(MASTER_ORGANIGRAM, "OS");
    const empty = getUniqueOrgMatch(MASTER_ORGANIGRAM, "");

    expect(unique?.layer).toBe("MJP CORE");
    expect(ambiguous).toBeUndefined();
    expect(empty).toBeUndefined();
  });
});
