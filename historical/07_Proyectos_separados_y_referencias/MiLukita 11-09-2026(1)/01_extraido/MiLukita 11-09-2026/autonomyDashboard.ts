export type AutonomyRuntimeIndicators = {
  passed: boolean;
  chainCompleted: boolean;
  chaosPassed: boolean;
  killLukitaPassed: boolean;
  watchdogPass: boolean;
  controlMode: string;
};

export function isAutonomyDashboardHealthy(indicators: AutonomyRuntimeIndicators): boolean {
  return indicators.passed && indicators.chainCompleted && indicators.chaosPassed && indicators.killLukitaPassed && indicators.watchdogPass && indicators.controlMode !== "STOPPED";
}

export function describeAutonomyDashboard(indicators: AutonomyRuntimeIndicators): string {
  if (isAutonomyDashboardHealthy(indicators)) return "Prueba contractual aprobada";
  if (indicators.controlMode === "STOPPED") return "Sistema detenido por control humano";
  return "Revisión requerida";
}
