import type { ReactNode } from "react";
export type AreaCommandCenterShellProps = { areaName: string; status: string; objective?: string; currentTask?: string; children: ReactNode };
export default function AreaCommandCenterShell({ areaName, status, objective, currentTask, children }: AreaCommandCenterShellProps) {
  return <section className="ccf-area-shell" data-area-id={areaName.toLowerCase().replaceAll(" ", "-")}><header className="ccf-area-shell-header"><div><span className="panel-kicker">AREA COMMAND CENTER</span><h2>{areaName}</h2></div><span className={`status-pill ${status.toLowerCase().replaceAll("_", "-")}`}><i />{status}</span></header><div className="ccf-area-shell-summary"><span>OBJECTIVE <b>{objective ?? "Not declared"}</b></span><span>CURRENT ACTION <b>{currentTask ?? "No active task"}</b></span></div>{children}</section>;
}
