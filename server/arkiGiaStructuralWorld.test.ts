import { describe, it, expect } from "vitest";

const MOTORES_API_URL = process.env.MOTORES_API_URL || "http://127.0.0.1:18771";

async function post(endpoint: string, payload: Record<string, unknown>) {
  const res = await fetch(`${MOTORES_API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(40000),
  });
  return res.json();
}

describe("GIA-021 Shell cáscara cilíndrica", () => {
  it("cáscara ShellMITC4 + PlateFiber responde con deflexión", async () => {
    const r = await post("/structural/shell", {
      project_id: "GIA-SHELL-001",
      radius_m: 20, length_m: 40, thickness_m: 0.20,
      n_elems_x: 8, n_elems_y: 8, concrete_fc_mpa: 30, load_kn_m2: 5,
    });
    expect(r.engine).toBe("openseespy_shell");
    expect(r.values.disp_z_center_mm).toBeGreaterThan(0);
    expect(["PASS", "FAIL"]).toContain(r.status);
  }, 60000);
});

describe("GIA-022 Time-history sísmico", () => {
  it("UniformExcitation + Newmark calcula drift dinámico", async () => {
    const r = await post("/structural/time-history", {
      project_id: "GIA-TH-001",
      n_stories: 5, accel_amplitude_g: 0.45, duration_s: 10,
    });
    expect(r.engine).toBe("openseespy_time_history");
    expect(r.values.max_drift).toBeGreaterThan(0);
    expect(r.values.T1_s).toBeGreaterThan(0);
  }, 60000);
});

describe("GIA-023 Nonlinear frame (fibras)", () => {
  it("forceBeamColumn + Steel01 devuelve base_shear > 0", async () => {
    const r = await post("/structural/nonlinear-frame", {
      project_id: "GIA-NL-002",
      n_stories: 3, steel_fy_mpa: 420,
    });
    expect(r.engine).toBe("openseespy_nonlinear_frame");
    expect(r.values.roof_disp_mm).toBeGreaterThan(0);
    expect(r.values.base_shear_kN).toBeGreaterThan(0);
  }, 60000);
});
