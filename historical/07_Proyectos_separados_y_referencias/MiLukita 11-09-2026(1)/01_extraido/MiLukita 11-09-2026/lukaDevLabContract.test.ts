import { describe, expect, it } from "vitest";
import { DEV_LAB_AR_POINTS, DEV_LAB_TABS, clampTvVolume, describeArPreview, getDevLabTvPreview, nextTvChannel, toggleDevCapability } from "./lukaDevLabContract";

describe("LUKA Dev Lab contract", () => {
  it("expone únicamente las tres superficies internas previstas", () => {
    expect(DEV_LAB_TABS).toEqual(["registry", "ar", "tv"]);
    expect(DEV_LAB_AR_POINTS).toContain("Huaca del Sol");
  });

  it("mantiene los toggles en available/hidden", () => {
    expect(toggleDevCapability("hidden")).toBe("available");
    expect(toggleDevCapability("available")).toBe("hidden");
  });

  it("limita volumen y canal a rangos seguros del simulador", () => {
    expect(clampTvVolume(120)).toBe(100);
    expect(clampTvVolume(-10)).toBe(0);
    expect(nextTvChannel(15, 1)).toBe(16);
    expect(nextTvChannel(1, -1)).toBe(1);
  });

  it("describe la guía AR según planos y punto seleccionado", () => {
    expect(describeArPreview(false, null)).toContain("detección de planos");
    expect(describeArPreview(true, "Huaca del Sol")).toContain("Huaca del Sol");
  });

  it("devuelve una previsualización contextual para cada canal simulado", () => {
    expect(getDevLabTvPreview(15).title).toBe("Noticias de LUKA");
    expect(getDevLabTvPreview(16).title).toBe("LUKALLPA en ruta");
    expect(getDevLabTvPreview(17).subtitle).toContain("canal 17");
  });
});
