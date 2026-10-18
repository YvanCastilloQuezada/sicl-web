import { describe, expect, it } from "vitest";
import { buildCircularQrSvg, buildCustomizedQrSvg, buildQrDownloadName, getTimerArcSegments, normalizeTimerPalette } from "./customQrGenerator";

describe("custom QR generator", () => {
  const base = "data:image/png;base64,preview";

  it("keeps the payload image and applies the selected visual variant", () => {
    const svg = buildCustomizedQrSvg(base, { size: 900, label: "TV en vivo", accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "circle" });
    expect(svg).toContain("data:image/png;base64,preview");
    expect(svg).toContain("TV en vivo");
    expect(svg).toContain("#f5c96a");
    expect(svg).toContain("<circle");
  });

  it("escapes visible labels and clamps invalid sizes", () => {
    const svg = buildCustomizedQrSvg(base, { size: 12, label: "TV & <online>", accentColor: "#fff", backgroundColor: "#000", variant: "central" });
    expect(svg).toContain('width="160"');
    expect(svg).toContain("TV &amp; &lt;online&gt;");
    expect(svg).not.toContain("TV & <online>");
  });

  it("renders a circular QR composition from a real matrix", () => {
    const matrix = Array.from({ length: 21 }, (_, row) => Array.from({ length: 21 }, (_, column) => (row + column) % 3 === 0));
    const svg = buildCircularQrSvg(matrix, { size: 520, label: "Lukita", accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "circle" });
    expect(svg).toContain('<circle cx="260" cy="260"');
    expect(svg).toContain("<circle cx=");
    expect(svg).not.toContain("<rect");
    expect(svg).not.toContain('<image href=');
  });

  it("applies custom module color and central logo to the round QR", () => {
    const matrix = Array.from({ length: 21 }, (_, row) => Array.from({ length: 21 }, (_, column) => (row + column) % 3 === 0));
    const svg = buildCircularQrSvg(matrix, { size: 520, label: "Brand", accentColor: "#f5c96a", backgroundColor: "#071a12", moduleColor: "#22d3ee", variant: "circle", logoDataUrl: "data:image/png;base64,logo" });
    expect(svg).toContain('fill="#22d3ee"');
    expect(svg).toContain('image href="data:image/png;base64,logo"');
    expect(svg).not.toContain("<rect");
  });

  it("renders the timer arc clockwise from green at 12 to red at the left edge", () => {
    const matrix = Array.from({ length: 21 }, (_, row) => Array.from({ length: 21 }, (_, column) => (row + column) % 3 === 0));
    const svg = buildCircularQrSvg(matrix, { size: 520, label: "Timer", accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "circle", timerProgress: 100 });
    expect(svg).toContain('stroke="#22c55e"');
    expect(svg).toContain('stroke="#facc15"');
    expect(svg).toContain('stroke="#f97316"');
    expect(svg).toContain('stroke="#ef4444"');
    expect(svg).toContain('A 247 247 0 0 1 13 260');
  });

  it("switches between round and square shapes without changing the payload matrix", () => {
    const matrix = Array.from({ length: 21 }, (_, row) => Array.from({ length: 21 }, (_, column) => (row * 2 + column) % 4 === 0));
    const baseConfig = { size: 520, label: "Shape", accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "circle" as const };
    const round = buildCustomizedQrSvg("", { ...baseConfig, matrix, shape: "round" });
    const square = buildCustomizedQrSvg("", { ...baseConfig, matrix, shape: "square" });
    expect(round).toContain('<circle cx="260" cy="260"');
    expect(round).not.toContain("<rect");
    expect(square).toContain('aria-label="QR cuadrado personalizado Shape"');
    expect(square).toContain('<rect width="100%" height="100%"');
  });

  it("uses a custom timer palette for the four transition stages", () => {
    const palette = { green: "#102030", yellow: "#203040", orange: "#304050", red: "#405060" };
    const segments = getTimerArcSegments(100, 100, palette);
    expect(segments.map(({ color }) => color)).toEqual(["#102030", "#203040", "#304050", "#405060"]);
    const svg = buildCircularQrSvg(Array.from({ length: 21 }, () => Array.from({ length: 21 }, () => true)), { size: 520, label: "Brand", accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "circle", timerProgress: 100, timerPalette: palette });
    expect(svg).toContain('stroke="#405060"');
  });

  it("falls back to safe defaults when a palette value is invalid", () => {
    expect(normalizeTimerPalette({ green: "red", red: "#405060" })).toEqual({ green: "#22c55e", yellow: "#facc15", orange: "#f97316", red: "#405060" });
  });

  it("creates safe deterministic download names", () => {
    expect(buildQrDownloadName("MiLukita LIVE", "png")).toBe("milukita-live.png");
    expect(buildQrDownloadName("", "svg")).toBe("milukita-qr.svg");
  });
});
