/**
 * Mock de motores-api para tests unitarios.
 *
 * Intercepta fetch a http://127.0.0.1:18771 y devuelve respuestas predefinidas.
 * Los tests de integración (puntual_infra.test.ts, etc.) NO usan este mock.
 *
 * Uso:
 *   import { installMockMotores, uninstallMockMotores } from "./mockMotores";
 *   beforeAll(() => installMockMotores());
 *   afterAll(() => uninstallMockMotores());
 */

const MOTORES_URL = "http://127.0.0.1:18771";

type EngineStatus = "PASS" | "PARTIAL" | "UNKNOWN";

type MockResponse = {
  status: EngineStatus;
  engine: string;
  values: Record<string, number | string | boolean | number[] | string[]>;
  trace?: string[];
};

function mockEstructural(): MockResponse {
  return {
    status: "PASS",
    engine: "openseespy",
    values: {
      T1_s: 1.2,
      T2_s: 1.1,
      T3_s: 1.0,
      Z: 0.45,
      S: 1.05,
      C: 1.27,
      V_basal_kN: 1000000,
      drift_max: 0.0004,
      drift_limit: 0.007,
      n_stories: 3,
    },
    trace: ["engine=openseespy+pushover", "project_id=MOCK", "mock=true"],
  };
}

function mockGeotech(): MockResponse {
  return {
    status: "PASS",
    engine: "bearing_capacity",
    values: { q_ultimate_kPa: 1460, q_allowable_kPa: 486, factor_of_safety: 3 },
    trace: ["engine=bearing_capacity", "mock=true"],
  };
}

function mockHvac(): MockResponse {
  return {
    status: "PARTIAL",
    engine: "opensimula",
    values: { cooling_load_kw: 300, heating_load_kw: 180, zone_volume_m3: 100 },
    trace: ["engine=opensimula", "mock=true"],
  };
}

function mockEvacuation(): MockResponse {
  return {
    status: "PASS",
    engine: "jupedsim",
    values: { n_total: 40, evacuated: 40, evacuation_time_s: 11.0 },
    trace: ["engine=jupedsim", "mock=true"],
  };
}

function mockFire(): MockResponse {
  return {
    status: "PASS",
    engine: "pycfast (CFAST)",
    values: { max_upper_layer_temp_c: 1000, peak_hrr_kw: 1000, simulation_time_s: 600 },
    trace: ["engine=pycfast", "mock=true"],
  };
}

function mockAcoustic(): MockResponse {
  return {
    status: "PASS",
    engine: "pyrato",
    values: { reverberation_time_t60_s: 0.68, room_volume_m3: 18000 },
    trace: ["engine=pyrato", "mock=true"],
  };
}

function mockSewer(): MockResponse {
  return {
    status: "PARTIAL",
    engine: "pysewer",
    values: { estimated_pipe_diameter_m: 0.304 },
    trace: ["engine=pysewer", "mock=true"],
  };
}

function responseForUrl(url: string): MockResponse | null {
  if (url.includes("/structural/")) return mockEstructural();
  if (url.includes("/geotech/")) return mockGeotech();
  if (url.includes("/hvac/")) return mockHvac();
  if (url.includes("/evacuation/")) return mockEvacuation();
  if (url.includes("/fire/")) return mockFire();
  if (url.includes("/acoustic/")) return mockAcoustic();
  if (url.includes("/sewer/")) return mockSewer();
  return null;
}

let originalFetch: typeof fetch | null = null;

export function installMockMotores(): void {
  if (originalFetch) return; // ya instalado
  originalFetch = global.fetch;
  global.fetch = (async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    if (!url.startsWith(MOTORES_URL)) {
      // No es motores-api, usar fetch real
      return originalFetch!(input, init);
    }
    const mock = responseForUrl(url);
    if (!mock) {
      // URL de motores-api desconocida, devolver 404
      return new Response(JSON.stringify({ error: "MOCK_NOT_FOUND", url }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify(mock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
}

export function uninstallMockMotores(): void {
  if (!originalFetch) return;
  global.fetch = originalFetch;
  originalFetch = null;
}
