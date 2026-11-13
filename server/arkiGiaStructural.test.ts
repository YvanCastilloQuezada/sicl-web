import { describe, it, expect } from "vitest";

const MOTORES_API_URL = process.env.MOTORES_API_URL || "http://127.0.0.1:18771";

async function evaluateStructural(payload: Record<string, unknown>) {
  const res = await fetch(`${MOTORES_API_URL}/structural/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(30000),
  });
  return res.json();
}

describe("GIA-018 Structural real", () => {
  it("pórtico 3D con NTE E.030 devuelve T1 y V_basal", async () => {
    const result = await evaluateStructural({
      project_id: "GIA-STR-001",
      n_stories: 5,
      story_height_m: 3.0,
      seismic_zone: "Z4",
      soil_type: "S2",
      importance: 1.0,
      reduction: 7.0,
    });
    expect(result.engine).toBe("openseespy");
    expect(result.values.T1_s).toBeGreaterThan(0);
    expect(result.values.V_basal_kN).toBeGreaterThan(0);
    expect(["PASS", "FAIL"]).toContain(result.status);
  }, 40000);
});

describe("GIA-019 Structural drift", () => {
  it("drift_max y drift_limit están presentes", async () => {
    const result = await evaluateStructural({
      project_id: "GIA-STR-002",
      n_stories: 3,
      story_height_m: 3.0,
      seismic_zone: "Z4",
      soil_type: "S2",
      importance: 1.0,
      reduction: 7.0,
    });
    expect(result.values.drift_max).toBeDefined();
    expect(result.values.drift_limit).toBe(0.007);
  }, 40000);
});

describe("GIA-020 Structural zona/soil", () => {
  it("diferentes zonas producen diferentes V_basal", async () => {
    const r1 = await evaluateStructural({ project_id: "T1", seismic_zone: "Z1", soil_type: "S1" });
    const r2 = await evaluateStructural({ project_id: "T2", seismic_zone: "Z4", soil_type: "S2" });
    expect(r2.values.V_basal_kN).toBeGreaterThan(r1.values.V_basal_kN);
  }, 40000);
});
