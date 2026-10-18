import { runWatchdog } from "../autonomy";

export type WatchdogStatus = "HEALTHY" | "WARNING" | "CRITICAL";
export type WatchdogCheck = { key: string; status: "PASS" | "WARNING" | "CRITICAL"; message: string };

export type WatchdogReport = {
  id: "MILUKITA_WATCHDOG";
  mode: "ALERT_ONLY";
  status: WatchdogStatus;
  checks: WatchdogCheck[];
  checkedAt: string;
  actionsExecuted: false;
};

function normalizeStatus(status: string): WatchdogStatus {
  if (status === "CRITICAL") return "CRITICAL";
  if (status === "WARNING") return "WARNING";
  return "HEALTHY";
}

export async function healthCheck(): Promise<WatchdogReport> {
  const result = await runWatchdog();
  return {
    id: "MILUKITA_WATCHDOG",
    mode: "ALERT_ONLY",
    status: normalizeStatus(result.status),
    checks: result.checks as WatchdogCheck[],
    checkedAt: result.checkedAt ?? new Date().toISOString(),
    actionsExecuted: false,
  };
}

export function shouldAlert(report: WatchdogReport): boolean {
  return report.status !== "HEALTHY";
}

export function alertMessage(report: WatchdogReport): string | null {
  if (!shouldAlert(report)) return null;
  return `Watchdog ${report.status}: ${report.checks.filter((check) => check.status !== "PASS").map((check) => check.message).join("; ") || "revisión requerida"}`;
}
