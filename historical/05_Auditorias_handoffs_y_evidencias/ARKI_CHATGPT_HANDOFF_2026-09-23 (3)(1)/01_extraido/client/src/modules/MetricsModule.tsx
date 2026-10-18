import type React from "react";
export default function MetricsModule({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) { return <div className="metric-card"><span className="metric-icon">{icon}</span><div><span>{label}</span><strong>{value}</strong></div></div>; }
