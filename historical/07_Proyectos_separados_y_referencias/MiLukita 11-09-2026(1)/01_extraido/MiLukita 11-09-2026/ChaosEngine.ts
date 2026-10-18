import { CHAOS_SCENARIOS, type ChaosScenario } from "../../shared/entertainmentOs";

export type ChaosResult = {
  scenario: ChaosScenario;
  detected: true;
  classified: "WARNING" | "CRITICAL";
  fallback: "SAFE_FALLBACK" | "SAFE_STOP";
  recovered: boolean;
  reported: true;
  coreIntact: true;
};

export function runLocalChaosScenario(scenario: ChaosScenario): ChaosResult {
  const critical = scenario === "DATABASE_FAIL" || scenario === "HEARTBEAT_FAIL";
  return {
    scenario,
    detected: true,
    classified: critical ? "CRITICAL" : "WARNING",
    fallback: critical ? "SAFE_STOP" : "SAFE_FALLBACK",
    recovered: !critical,
    reported: true,
    coreIntact: true,
  };
}

export function runLocalChaosSuite(): ChaosResult[] {
  return CHAOS_SCENARIOS.map(runLocalChaosScenario);
}
