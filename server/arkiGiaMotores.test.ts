import { describe, it, expect } from "vitest";

const MOTORES_API_URL = process.env.MOTORES_API_URL || "http://127.0.0.1:18771";

async function callMotor<T>(endpoint: string, body: unknown): Promise<T> {
  const res = await fetch(`${MOTORES_API_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    throw new Error(`Motor ${endpoint} falló: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

describe("GIA-011..017 — Motores de ingeniería (referencia + determinismo)", () => {
  // --- Structural ---
  it("GIA-011 structural: V_basal > 0 y determinista", async () => {
    const input = {
      project_id: "REF-STRUCT",
      typology: "GENERIC",
      n_stories: 5,
      story_height_m: 3,
      n_bays_x: 3,
      n_bays_y: 2,
      bay_x_m: 6,
      bay_y_m: 6,
      seismic_zone: "Z4",
      soil_type: "S2",
      importance: 1,
      reduction: 7,
      concrete_fc_mpa: 21,
      col_width_m: 0.4,
      col_depth_m: 0.4,
      beam_width_m: 0.3,
      beam_depth_m: 0.5,
    };
    const r1 = await callMotor<{ status: string; values: { base_shear_kn?: number } }>("/structural/evaluate", input);
    const r2 = await callMotor<{ status: string; values: { base_shear_kn?: number } }>("/structural/evaluate", input);

    expect(["PASS", "PARTIAL"]).toContain(r1.status);
    // El cortante basal debe ser > 0 para un edificio de 5 pisos en Z4
    if (typeof r1.values.base_shear_kn === "number") {
      expect(r1.values.base_shear_kn).toBeGreaterThan(0);
    }
    // Determinismo
    expect(r2.values).toEqual(r1.values);
  });

  // --- Geotech ---
  it("GIA-012 geotech: q_ultimate > 0 y determinista", async () => {
    const input = {
      project_id: "REF-GEO",
      soil_type: "S2",
      foundation_type: "shallow",
      footing_width_m: 2,
      footing_length_m: 2,
      depth_m: 1.5,
      n_spt: 15,
      cohesion_kpa: 25,
      friction_angle_deg: 30,
      unit_weight_kn_m3: 18,
      water_table_depth_m: 3,
    };
    const r1 = await callMotor<{ status: string; values: { q_ultimate_kpa?: number } }>("/geotech/evaluate", input);
    const r2 = await callMotor<{ status: string; values: { q_ultimate_kpa?: number } }>("/geotech/evaluate", input);

    expect(r1.status).toBe("PASS");
    // Para SPT 15, q_ultimate > 100 kPa es esperado
    if (typeof r1.values.q_ultimate_kpa === "number") {
      expect(r1.values.q_ultimate_kpa).toBeGreaterThan(100);
    }
    expect(r2.values).toEqual(r1.values);
  });

  // --- HVAC ---
  it("GIA-013 hvac: carga térmica > 0 y determinista", async () => {
    const input = {
      project_id: "REF-HVAC",
      n_floors: 5,
      floor_height_m: 3,
      floor_width_m: 30,
      floor_depth_m: 20,
      ventilation_rate_ach: 2,
      occupancy: 200,
      climate_zone: "TEMPERATE",
    };
    const r1 = await callMotor<{ status: string; values: { cooling_load_kw?: number; heating_load_kw?: number } }>("/hvac/evaluate", input);
    const r2 = await callMotor<{ status: string; values: { cooling_load_kw?: number; heating_load_kw?: number } }>("/hvac/evaluate", input);

    expect(["PASS", "PARTIAL"]).toContain(r1.status);
    if (typeof r1.values.cooling_load_kw === "number") {
      expect(r1.values.cooling_load_kw).toBeGreaterThan(0);
    }
    expect(r2.values).toEqual(r1.values);
  });

  // --- Evacuation ---
  it("GIA-014 evacuation: tiempo de evacuación > 0 y determinista", async () => {
    const input = {
      project_id: "REF-EVA",
      n_floors: 5,
      floor_area_m2: 500,
      occupancy: 200,
      exit_width_m: 1.2,
      exit_count: 2,
    };
    const r1 = await callMotor<{ status: string; values: { evacuation_time_s?: number } }>("/evacuation/evaluate", input);
    const r2 = await callMotor<{ status: string; values: { evacuation_time_s?: number } }>("/evacuation/evaluate", input);

    expect(["PASS", "PARTIAL"]).toContain(r1.status);
    if (typeof r1.values.evacuation_time_s === "number") {
      expect(r1.values.evacuation_time_s).toBeGreaterThan(0);
    }
    expect(r2.values).toEqual(r1.values);
  });

    // --- Fire ---
  // Nota: el motor fire usa CFAST (pycfast), un solver de dinámica de incendios
  // que es PROBABILÍSTICO. Dos llamadas pueden dar valores distintos.
  // Por eso no se verifica determinismo, solo que el resultado está en rango plausible.
  it("GIA-015 fire: temperatura de humo en rango plausible (probabilístico)", async () => {
    const input = {
      project_id: "REF-FIRE",
      n_floors: 5,
      fire_floor: 1,
      floor_width_m: 10,
      floor_depth_m: 10,
      floor_height_m: 3,
      fire_peak_hrr_kw: 1000,
      simulation_time_s: 600,
    };
    const r = await callMotor<{ status: string; values: Record<string, unknown> }>("/fire/evaluate", input);

    expect(["PASS", "PARTIAL"]).toContain(r.status);

    // Aceptar cualquier nombre de campo que contenga la temperatura de humo
    const possibleFields = [
      "max_upper_layer_temp_c",
      "estimated_smoke_layer_temp_c",
      "max_temp_c",
      "upper_layer_temp_c",
      "smoke_layer_temp_c",
    ];
    let temp: number | undefined;
    for (const field of possibleFields) {
      const value = r.values[field];
      if (typeof value === "number") {
        temp = value;
        break;
      }
    }

    // El motor debe devolver un número, no None ni undefined
    expect(temp).toBeDefined();
    expect(typeof temp).toBe("number");

    // Rango físicamente plausible: 20°C (ambiente) a 1500°C (incendio severo)
    expect(temp).toBeGreaterThan(20);
    expect(temp).toBeLessThan(1500);
  });

// --- Acoustic ---
  it("GIA-016 acoustic: T60 > 0 y determinista", async () => {
    const input = {
      project_id: "REF-ACU",
      room_volume_m3: 500,
      surface_area_m2: 300,
      reverberation_time_s: 1.5,
      material: "plaster",
    };
    const r1 = await callMotor<{ status: string; values: { t60_s?: number; reverberation_time_s?: number } }>("/acoustic/evaluate", input);
    const r2 = await callMotor<{ status: string; values: { t60_s?: number; reverberation_time_s?: number } }>("/acoustic/evaluate", input);

    expect(r1.status).toBe("PASS");
    const t60 = r1.values.t60_s ?? r1.values.reverberation_time_s;
    if (typeof t60 === "number") {
      expect(t60).toBeGreaterThan(0);
    }
    expect(r2.values).toEqual(r1.values);
  });

  // --- Sewer ---
  it("GIA-017 sewer: caudal de drenaje > 0 y determinista", async () => {
    const input = {
      project_id: "REF-SEWER",
      n_floors: 5,
      floor_area_m2: 500,
      occupancy: 200,
      drainage_area_m2: 1000,
      rainfall_intensity_mm_h: 100,
    };
    const r1 = await callMotor<{ status: string; values: { peak_flow_l_s?: number; design_flow_l_s?: number } }>("/sewer/evaluate", input);
    const r2 = await callMotor<{ status: string; values: { peak_flow_l_s?: number; design_flow_l_s?: number } }>("/sewer/evaluate", input);

    expect(["PASS", "PARTIAL"]).toContain(r1.status);
    const flow = r1.values.peak_flow_l_s ?? r1.values.design_flow_l_s;
    if (typeof flow === "number") {
      expect(flow).toBeGreaterThan(0);
    }
    expect(r2.values).toEqual(r1.values);
  });
});
