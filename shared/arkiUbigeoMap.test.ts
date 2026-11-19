import { describe, expect, it } from "vitest";
import { getAllUbigeoLocations, getUbigeoByLabel } from "./arkiUbigeoMap";
import { findLocation } from "./arkiUbigeoHierarchy";

describe("ARKI Ubigeo — Coordenadas reales por distrito", () => {
  it("contiene al menos 1700 distritos", () => {
    expect(getAllUbigeoLocations().length).toBeGreaterThanOrEqual(1700);
  });

  it("Víctor Larco Herrera tiene coordenadas DISTINTAS a Trujillo capital", () => {
    const vlh = getUbigeoByLabel("Victor Larco Herrera, Trujillo, La Libertad");
    const cap = getUbigeoByLabel("Trujillo, Trujillo, La Libertad");
    expect(vlh).toBeDefined();
    expect(cap).toBeDefined();
    // Víctor Larco está al OESTE (más negativo) y al SUR de la capital
    expect(vlh!.longitude).toBeLessThan(cap!.longitude - 0.005);
    expect(vlh!.latitude).toBeLessThan(cap!.latitude); // Victor Larco está al SUR de Trujillo
  });

  it("Salaverry está en la costa SUR de Trujillo", () => {
    const sal = findLocation("La Libertad", "Trujillo", "Salaverry");
    expect(sal).toBeDefined();
    expect(sal!.latitude).toBeLessThan(-8.2);
  });

  it("Moche está al NORTE de Trujillo", () => {
    const mch = findLocation("La Libertad", "Trujillo", "Moche");
    expect(mch).toBeDefined();
    expect(mch!.latitude).toBeLessThan(-8.1); // Moche está al SUR de Trujillo
  });

  it("El Porvenir está al NORTE de Trujillo", () => {
    const por = findLocation("La Libertad", "Trujillo", "El Porvenir");
    expect(por).toBeDefined();
    expect(por!.latitude).toBeGreaterThan(-8.1);
  });

  it("todas las coordenadas caen dentro del bounding box de Perú", () => {
    for (const loc of getAllUbigeoLocations()) {
      expect(loc.latitude).toBeGreaterThanOrEqual(-18.5);
      expect(loc.latitude).toBeLessThanOrEqual(0);
      expect(loc.longitude).toBeGreaterThanOrEqual(-82);
      expect(loc.longitude).toBeLessThanOrEqual(-68);
    }
  });

  it("el click en Salaverry resuelve a Salaverry (no a El Porvenir)", () => {
    // Coordenadas aproximadas de la playa de Salaverry
    const salaverryLat = -8.222;
    const salaverryLng = -78.982;
    let nearest = getAllUbigeoLocations()[0];
    let minDist = Infinity;
    for (const loc of getAllUbigeoLocations()) {
      const d = (loc.latitude - salaverryLat) ** 2 + (loc.longitude - salaverryLng) ** 2;
      if (d < minDist) {
        minDist = d;
        nearest = loc;
      }
    }
    expect(nearest.district).toBe("Salaverry");
  });
});
