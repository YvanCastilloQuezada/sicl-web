import { describe, expect, it } from "vitest";
import {
  computeLightColor,
  computeLightIntensity,
  computeShadowDirection,
  computeShadowTimeline,
  solarDirectionToVector3,
} from "./arkiSolarShadows";

describe("ARKI Solar Shadows — Conversión a vector 3D", () => {
  it("cenit (90° elevación, cualquier azimut) → vector (0, 1, 0)", () => {
    const vec = solarDirectionToVector3(90, 0);
    expect(vec.x).toBeCloseTo(0, 5);
    expect(vec.y).toBeCloseTo(1, 5);
    expect(vec.z).toBeCloseTo(0, 5);
  });

  it("horizonte norte (0° elevación, 0° azimut) → vector (0, 0, -1)", () => {
    const vec = solarDirectionToVector3(0, 0);
    expect(vec.x).toBeCloseTo(0, 5);
    expect(vec.y).toBeCloseTo(0, 5);
    expect(vec.z).toBeCloseTo(-1, 5);
  });

  it("vector resultante siempre está normalizado (longitud ≈ 1)", () => {
    for (let elev = 0; elev <= 90; elev += 10) {
      for (let az = 0; az < 360; az += 30) {
        const vec = solarDirectionToVector3(elev, az);
        const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        expect(length).toBeCloseTo(1, 5);
      }
    }
  });
});

describe("ARKI Solar Shadows — Intensidad de luz", () => {
  it("noche (elevación <= 0) → intensidad 0", () => {
    expect(computeLightIntensity(-10)).toBe(0);
    expect(computeLightIntensity(0)).toBe(0);
  });

  it("cenit (elevación = 90) → intensidad 1", () => {
    expect(computeLightIntensity(90)).toBe(1);
  });
});

describe("ARKI Solar Shadows — Color de luz", () => {
  it("noche → color negro (0, 0, 0)", () => {
    const color = computeLightColor(-10);
    expect(color).toEqual({ r: 0, g: 0, b: 0 });
  });

  it("amanecer (0°) → naranja cálido (255, 180, 100)", () => {
    const color = computeLightColor(0);
    expect(color).toEqual({ r: 255, g: 180, b: 100 });
  });

  it("mediodía (90°) → blanco cálido (255, 250, 240)", () => {
    const color = computeLightColor(90);
    expect(color).toEqual({ r: 255, g: 250, b: 240 });
  });
});

describe("ARKI Solar Shadows — Caso de referencia: TRUJILLO, PERÚ", () => {
  const trujillo = { latitude: -8.1091, longitude: -79.0211, timezoneOffset: -5 };

  it("21 junio 12:00 — sol alto, intensidad alta, color cálido", () => {
    const shadow = computeShadowDirection({
      ...trujillo,
      datetime: "2026-06-21T12:00:00",
    });
    expect(shadow.solarPosition.elevation).toBeGreaterThan(57);
    expect(shadow.solarPosition.elevation).toBeLessThan(59);
    expect(shadow.intensity).toBeGreaterThan(0.8);
    expect(shadow.intensity).toBeLessThan(0.9);
    expect(shadow.color.r).toBe(255);
    expect(shadow.color.g).toBeGreaterThan(220);
    expect(shadow.color.b).toBeGreaterThanOrEqual(190);
    expect(shadow.y).toBeGreaterThan(0.8);
  });

  it("21 junio 23:00 — noche, intensidad 0, color negro", () => {
    const shadow = computeShadowDirection({
      ...trujillo,
      datetime: "2026-06-21T23:00:00",
    });
    expect(shadow.solarPosition.elevation).toBeLessThan(0);
    expect(shadow.intensity).toBe(0);
    expect(shadow.color).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe("ARKI Solar Shadows — Timeline de sombras", () => {
  it("genera timeline de 6 horas (06:00 a 12:00, paso 60 min) → 7 puntos", () => {
    const timeline = computeShadowTimeline(
      { latitude: -8.1091, longitude: -79.0211, timezoneOffset: -5, date: "2026-06-21" },
      6,
      12,
      60,
    );
    expect(timeline).toHaveLength(7); // 06:00, 07:00, 08:00, 09:00, 10:00, 11:00, 12:00
    // Intensidad debe aumentar progresivamente
    for (let i = 1; i < timeline.length; i++) {
      expect(timeline[i].intensity).toBeGreaterThanOrEqual(timeline[i - 1].intensity);
    }
  });
});
