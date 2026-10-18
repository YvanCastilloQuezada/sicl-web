import { describe, expect, it } from "vitest";
import { isMilukitaTechnicalAlias, MILUKITA_BRAND, MILUKITA_HOST_SCRIPTS } from "./brandSystem";

describe("MiLukita brand system", () => {
  it("mantiene la jerarquía comercial separada del anfitrión", () => {
    expect(MILUKITA_BRAND.name).toBe("MiLukita");
    expect(MILUKITA_BRAND.host).toBe("Lukita");
    expect(MILUKITA_BRAND.tvName).toBe("MiLukita TV");
    expect(MILUKITA_BRAND.gamesName).toBe("MiLukita Juegos");
    expect(MILUKITA_BRAND.host).not.toBe(MILUKITA_BRAND.gamesName);
  });

  it("conserva el aviso de piloto virtual y la fuente técnica", () => {
    expect(MILUKITA_BRAND.pilotNotice).toContain("créditos virtuales");
    expect(MILUKITA_BRAND.pilotNotice).toContain("sin dinero real");
    expect(MILUKITA_BRAND.technicalCore).toBe("MJP CORE");
  });

  it("define guiones para hechos de experiencia sin otorgar autoridad al anfitrión", () => {
    expect(MILUKITA_HOST_SCRIPTS.LOCK).toContain("cerrada");
    expect(MILUKITA_HOST_SCRIPTS.CONTINGENCY).toContain("resultado oficial");
    expect(isMilukitaTechnicalAlias("MJP_TV_MANIFEST_VERSION")).toBe(true);
    expect(isMilukitaTechnicalAlias("MiLukita TV")).toBe(false);
  });
});
