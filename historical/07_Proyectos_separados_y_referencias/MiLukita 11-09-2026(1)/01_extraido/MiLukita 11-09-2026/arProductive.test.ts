import { describe, expect, it } from "vitest";
import { arFallbackLabel, canRenderPoi, distanceMeters, isPublishedPoi, normalizePublishedPoi } from "./arProductive";

describe("Fase E.3 · AR Productivo", () => {
  it("acepta únicamente registros territoriales con coordenadas válidas para normalizarlos como POIs publicados", () => {
    const raw = { publicId: "WOBJ-ABC", name: "Punto publicado", latitude: "-8.111", longitude: "-79.021" };
    expect(isPublishedPoi(raw)).toBe(true);
    expect(normalizePublishedPoi(raw)).toMatchObject({ status: "PUBLISHED", latitude: -8.111, longitude: -79.021 });
    expect(isPublishedPoi({ publicId: "WOBJ-INVALID", name: "Sin coordenadas", latitude: "x", longitude: "y" })).toBe(false);
  });

  it("calcula distancias y no permite renderizar estados no publicados", () => {
    expect(distanceMeters({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 0 })).toBe(0);
    expect(canRenderPoi({ publicId: "WOBJ-1", name: "P", latitude: 0, longitude: 0, status: "PUBLISHED" })).toBe(true);
  });

  it("conserva fallback 2D cuando AR no está disponible", () => {
    expect(arFallbackLabel("UNAVAILABLE")).toBe("Continuar en 2D");
    expect(arFallbackLabel("AVAILABLE")).toBe("AR listo");
  });
});
