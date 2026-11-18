import { describe, expect, it } from "vitest";
import { computeSolarPosition, isSunAboveHorizon } from "./arkiSolarEngine";

describe("ARKI Solar Engine — Trujillo, Perú", () => {
  const trujillo = { latitude: -8.1091, longitude: -79.0211, timezoneOffset: -5 };

  it("21 junio 12:00 — sol alto, ligeramente al este del sur (±1°)", () => {
    const pos = computeSolarPosition({ ...trujillo, datetime: "2026-06-21T12:00:00" });
    expect(pos.elevation).toBeGreaterThan(57);
    expect(pos.elevation).toBeLessThan(59);
    expect(pos.azimuth).toBeGreaterThan(170);
    expect(pos.azimuth).toBeLessThan(175);
  });

  it("21 diciembre 12:00 — solsticio verano austral, sol casi al cenit", () => {
    const pos = computeSolarPosition({ ...trujillo, datetime: "2026-12-21T12:00:00" });
    expect(pos.elevation).toBeGreaterThan(73);
    expect(pos.elevation).toBeLessThan(76);
  });

  it("21 junio 23:00 — sol bajo el horizonte", () => {
    const pos = computeSolarPosition({ ...trujillo, datetime: "2026-06-21T23:00:00" });
    expect(pos.elevation).toBeLessThan(0);
    expect(isSunAboveHorizon(pos)).toBe(false);
  });
});
