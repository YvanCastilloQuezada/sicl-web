/**
 * Cliente HTTP para motores-api (ingeniería especializada).
 * Corre en http://127.0.0.1:18771 (systemd user: motores-api.service).
 */

const MOTORES_API_URL = process.env.MOTORES_API_URL || "http://127.0.0.1:18771";

export type EngineResult = {
  status: "PASS" | "PARTIAL" | "FAIL" | "UNKNOWN" | "NOT_EVALUATED";
  engine: string;
  values: Record<string, unknown>;
  trace: string[];
  error?: string;
};

async function callEngine(endpoint: string, payload: Record<string, unknown>): Promise<EngineResult> {
  try {
    const res = await fetch(`${MOTORES_API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      const text = await res.text();
      return { status: "FAIL", engine: endpoint, values: {}, trace: [], error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    return (await res.json()) as EngineResult;
  } catch (err) {
    return {
      status: "UNKNOWN",
      engine: endpoint,
      values: {},
      trace: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function evaluateStructural(projectId: string, nStories = 3, storyHeightM = 3.0): Promise<EngineResult> {
  return callEngine("/structural/evaluate", { project_id: projectId, n_stories: nStories, story_height_m: storyHeightM });
}

export async function evaluateGeotech(projectId: string): Promise<EngineResult> {
  return callEngine("/geotech/evaluate", { project_id: projectId });
}

export async function evaluateHvac(projectId: string, floorAreaM2 = 100, nPeople = 10): Promise<EngineResult> {
  return callEngine("/hvac/evaluate", { project_id: projectId, floor_area_m2: floorAreaM2, n_people: nPeople });
}

export async function evaluateEvacuation(projectId: string, nOccupants = 100, nExits = 2): Promise<EngineResult> {
  return callEngine("/evacuation/evaluate", { project_id: projectId, n_occupants: nOccupants, n_exits: nExits });
}

export async function evaluateFire(projectId: string, peakHrrKw = 1000): Promise<EngineResult> {
  return callEngine("/fire/evaluate", { project_id: projectId, fire_peak_hrr_kw: peakHrrKw });
}

export async function evaluateAcoustic(projectId: string, roomVolumeM3 = 100, surfaceM2 = 150, absorption = 0.3): Promise<EngineResult> {
  return callEngine("/acoustic/evaluate", { project_id: projectId, room_volume_m3: roomVolumeM3, total_surface_m2: surfaceM2, avg_absorption_coeff: absorption });
}

export async function evaluateSewer(projectId: string, peakFlowM3S = 0.1): Promise<EngineResult> {
  return callEngine("/sewer/evaluate", { project_id: projectId, peak_flow_m3_s: peakFlowM3S });
}

export async function checkMotoresHealth(): Promise<{ ok: boolean; engines?: number; error?: string }> {
  try {
    const res = await fetch(`${MOTORES_API_URL}/engines`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, engines: data.engines?.length ?? 0 };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
