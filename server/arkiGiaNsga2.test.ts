import { describe, it, expect } from "vitest";

const MOTORES_API_URL = process.env.MOTORES_API_URL || "http://127.0.0.1:18771";

describe("GIA-025 Surrogate + NSGA-II", () => {
  it("optimiza configuraciones y devuelve frente de Pareto factible", async () => {
    const res = await fetch(`${MOTORES_API_URL}/structural/surrogate-optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        project_id: "GIA-NSGA2-TEST",
        n_samples: 20, n_generations: 5, pop_size: 10, seed: 42,
      }),
      signal: AbortSignal.timeout(180000),
    });
    const r = await res.json();
    expect(r.engine).toBe("openseespy+MLPRegressor+NSGA-II");
    expect(r.values.n_samples).toBe(20);
    expect(r.values.surrogate_r2).toBeGreaterThan(0);
    expect(r.values.pareto_size).toBeGreaterThan(0);
  }, 200000);
});
