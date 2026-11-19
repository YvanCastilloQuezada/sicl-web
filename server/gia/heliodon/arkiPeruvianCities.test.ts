import { describe, expect, it } from "vitest";
import {
  PERUVIAN_CITIES,
  cityToSolarInput,
  getCityById,
  getCityByName,
  getCitiesByClimate,
  getCitiesByDepartment,
  getCitiesBySeismicZone,
} from "./arkiPeruvianCities";
import { computeSolarPosition } from "./arkiSolarEngine";

describe("ARKI Peruvian Cities — Integridad del catálogo", () => {
  it("contiene al menos 25 ciudades", () => {
    expect(PERUVIAN_CITIES.length).toBeGreaterThanOrEqual(25);
  });

  it("todos los IDs son únicos", () => {
    const ids = PERUVIAN_CITIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("todas las ciudades tienen coordenadas válidas", () => {
    for (const city of PERUVIAN_CITIES) {
      expect(city.latitude).toBeGreaterThanOrEqual(-18.5);
      expect(city.latitude).toBeLessThanOrEqual(0);
      expect(city.longitude).toBeGreaterThanOrEqual(-82);
      expect(city.longitude).toBeLessThanOrEqual(-68);
    }
  });

  it("todas las ciudades tienen altitud no negativa", () => {
    for (const city of PERUVIAN_CITIES) {
      expect(city.altitudeM).toBeGreaterThanOrEqual(0);
    }
  });

  it("todas las ciudades tienen jurisdicción RNE-PE", () => {
    for (const city of PERUVIAN_CITIES) {
      expect(city.jurisdiction).toBe("RNE-PE");
    }
  });

  it("todas las ciudades tienen timezoneOffset -5", () => {
    for (const city of PERUVIAN_CITIES) {
      expect(city.timezoneOffset).toBe(-5);
    }
  });
});

describe("ARKI Peruvian Cities — Ciudades clave", () => {
  it("incluye Trujillo (ciudad del autor)", () => {
    const trujillo = getCityById("trujillo");
    expect(trujillo.name).toBe("Trujillo");
    expect(trujillo.department).toBe("La Libertad");
    expect(trujillo.latitude).toBeCloseTo(-8.1091, 3);
    expect(trujillo.longitude).toBeCloseTo(-79.0211, 3);
  });

  it("incluye Lima (capital)", () => {
    const lima = getCityById("lima");
    expect(lima.name).toBe("Lima");
    expect(lima.seismicZone).toBe("Z4");
  });

  it("incluye Cusco (zona sísmica Z4)", () => {
    const cusco = getCityById("cusco");
    expect(cusco.seismicZone).toBe("Z4");
    expect(cusco.altitudeM).toBeGreaterThan(3000);
  });

  it("incluye Iquitos (selva baja, Z1)", () => {
    const iquitos = getCityById("iquitos");
    expect(iquitos.climate).toBe("tropical_humedo");
    expect(iquitos.seismicZone).toBe("Z1");
  });
});

describe("ARKI Peruvian Cities — Búsquedas", () => {
  it("getCityByName es case-insensitive", () => {
    expect(getCityByName("TRUJILLO").id).toBe("trujillo");
    expect(getCityByName("  lima  ").id).toBe("lima");
  });

  it("getCityByName lanza error para ciudad inexistente", () => {
    expect(() => getCityByName("Madrid")).toThrow(/no encontrada/);
  });

  it("getCitiesByDepartment retorna todas las ciudades de un departamento", () => {
    const sanMartin = getCitiesByDepartment("San Martín");
    expect(sanMartin.length).toBeGreaterThanOrEqual(2); // Tarapoto + Moyobamba
  });

  it("getCitiesByClimate agrupa correctamente", () => {
    const puna = getCitiesByClimate("puna");
    expect(puna.length).toBeGreaterThanOrEqual(2); // Cerro de Pasco, Puno, Huancavelica
    for (const city of puna) {
      expect(city.altitudeM).toBeGreaterThan(3000);
    }
  });

  it("getCitiesBySeismicZone Z4 incluye ciudades de alta sismicidad", () => {
    const z4 = getCitiesBySeismicZone("Z4");
    const names = z4.map((c) => c.name);
    expect(names).toContain("Lima");
    expect(names).toContain("Arequipa");
    expect(names).toContain("Cusco");
  });
});

describe("ARKI Peruvian Cities — Integración con Heliodón", () => {
  it("cityToSolarInput produce input válido para computeSolarPosition", () => {
    const trujillo = getCityById("trujillo");
    const input = cityToSolarInput(trujillo, "2026-06-21T12:00:00");
    const pos = computeSolarPosition(input);
    // Debe dar el mismo resultado que el test de MO-HELIODON-01
    expect(pos.elevation).toBeGreaterThan(57);
    expect(pos.elevation).toBeLessThan(59);
    // Mismo criterio que arkiSolarEngine.test.ts:
    // 21-jun el sol en Trujillo esta al NORTE (azimut ~7.6), no al sur.
    expect(pos.azimuth).toBeGreaterThan(0);
    expect(pos.azimuth).toBeLessThan(15);
  });

  it("todas las ciudades producen posición solar válida al mediodía del 21 junio", () => {
    for (const city of PERUVIAN_CITIES) {
      const input = cityToSolarInput(city, "2026-06-21T12:00:00");
      const pos = computeSolarPosition(input);
      // Al mediodía solar, el sol debe estar sobre el horizonte en todo el Perú
      expect(pos.elevation).toBeGreaterThan(30);
      expect(pos.elevation).toBeLessThanOrEqual(90);
      expect(pos.azimuth).toBeGreaterThan(0);
      expect(pos.azimuth).toBeLessThan(360);
    }
  });
});
