import { describe, expect, it } from "vitest";
import { DEFAULT_TIMER_PALETTE, contrastRatio, normalizeTimerPalette, timerPaletteContrastReport } from "./qrTimerPalette";

describe("qrTimerPalette", () => {
  it("sanitiza valores inválidos y conserva los colores válidos", () => {
    expect(normalizeTimerPalette({ green: "not-a-color", red: "#123456" })).toEqual({ ...DEFAULT_TIMER_PALETTE, red: "#123456" });
  });

  it("calcula una razón de contraste determinista", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 4);
  });

  it("genera un reporte por etapa con el umbral no textual AA", () => {
    const report = timerPaletteContrastReport({ green: "#ffffff", yellow: "#ffffff", orange: "#ffffff", red: "#ffffff" }, "#000000");
    expect(report).toHaveLength(4);
    expect(report.every((item) => item.passesNonTextAA)).toBe(true);
  });
});
