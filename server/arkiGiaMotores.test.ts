import { describe, it, expect, beforeAll } from "vitest";
import {
  checkMotoresHealth,
  evaluateStructural,
  evaluateGeotech,
  evaluateHvac,
  evaluateEvacuation,
  evaluateFire,
  evaluateAcoustic,
  evaluateSewer,
} from "./motoresClient";

const PROJECT_ID = "GIA-MOT-001-001";

describe("Motores-api health", () => {
  it("motores-api responde y tiene 7 motores", async () => {
    const health = await checkMotoresHealth();
    expect(health.ok).toBe(true);
    expect(health.engines).toBe(7);
  }, 10000);
});

describe("GIA-011 Estructuras", () => {
  it("structural responde PARTIAL con OpenSeesPy", async () => {
    const result = await evaluateStructural(PROJECT_ID, 3, 3.0);
    expect(result.engine).toBe("openseespy");
    expect(["PARTIAL", "PASS"]).toContain(result.status);
    expect(result.error).toBeUndefined();
  }, 20000);
});

describe("GIA-012 Geotecnia", () => {
  it("geotech responde PASS con q_ultimate calculado", async () => {
    const result = await evaluateGeotech(PROJECT_ID);
    expect(result.engine).toBe("bearing_capacity");
    expect(result.status).toBe("PASS");
    expect(result.values).toBeDefined();
  }, 20000);
});

describe("GIA-013 HVAC", () => {
  it("hvac responde PARTIAL con cargas térmicas", async () => {
    const result = await evaluateHvac(PROJECT_ID, 100, 10);
    expect(result.engine).toBe("opensimula");
    expect(["PARTIAL", "PASS"]).toContain(result.status);
    expect(result.values.cooling_load_kw).toBeGreaterThan(0);
  }, 20000);
});

describe("GIA-014 Evacuación", () => {
  it("evacuation responde PARTIAL con tiempo estimado", async () => {
    const result = await evaluateEvacuation(PROJECT_ID, 100, 2);
    expect(result.engine).toBe("jupedsim");
    expect(["PARTIAL", "PASS"]).toContain(result.status);
    expect(result.values.estimated_evacuation_time_s).toBeGreaterThan(0);
  }, 20000);
});

describe("GIA-015 Incendios", () => {
  it("fire responde PARTIAL con temperatura de humo", async () => {
    const result = await evaluateFire(PROJECT_ID, 1000);
    expect(result.engine).toBe("cfast_bin");
    expect(["PARTIAL", "PASS"]).toContain(result.status);
    expect(result.values.estimated_smoke_layer_temp_c).toBeGreaterThan(0);
  }, 20000);
});

describe("GIA-016 Acústica", () => {
  it("acoustic responde PASS con T60 calculado", async () => {
    const result = await evaluateAcoustic(PROJECT_ID, 100, 150, 0.3);
    expect(result.engine).toBe("pyrato");
    expect(result.status).toBe("PASS");
    expect(result.values.reverberation_time_t60_s).toBeGreaterThan(0);
  }, 20000);
});

describe("GIA-017 Saneamiento", () => {
  it("sewer responde PARTIAL con diámetro estimado", async () => {
    const result = await evaluateSewer(PROJECT_ID, 0.1);
    expect(result.engine).toBe("pysewer");
    expect(["PARTIAL", "PASS"]).toContain(result.status);
    expect(result.values.estimated_pipe_diameter_mm).toBeGreaterThan(0);
  }, 20000);
});
