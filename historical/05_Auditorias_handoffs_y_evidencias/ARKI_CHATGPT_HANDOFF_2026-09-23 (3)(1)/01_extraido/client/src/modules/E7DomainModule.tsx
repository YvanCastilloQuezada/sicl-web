import { useMemo } from "react";
import { calculateBudget5D } from "@shared/arki5d";
import { calculateSchedule4D } from "@shared/arki4d";
import { detectClashes } from "@shared/coordination";
import type { ConstructionModel } from "@shared/arkiConstructionOntology";

export default function E7DomainModule({ kind, model }: { kind: "5d" | "4d" | "clashes"; model: ConstructionModel | null }) {
  const data = useMemo(() => {
    const wallCount = model?.summary.wallCount ?? 4;
    const budget = calculateBudget5D([{ id: "wall-m2", code: "W-001", description: "Muro acabado", unit: "m2", unitPrice: 185, currency: "PEN", source: "E7 fixture", version: "E7.1" }], [{ elementId: "model-walls", itemId: "wall-m2", quantity: wallCount * 5, unit: "m2" }]);
    const schedule = calculateSchedule4D([{ id: "A1", name: "Muros", durationDays: 5, elementIds: ["model-walls"], predecessors: [] }, { id: "A2", name: "Acabados", durationDays: 2, elementIds: ["model-walls"], predecessors: ["A1"] }]);
    const clashes = detectClashes([{ id: "wall-01", discipline: "architecture", position: [0, 0, 0], dimensions: [4, 0.2, 3] }, { id: "pipe-01", discipline: "sanitary", position: [0, 0, 0], dimensions: [1, 0.1, 1] }]);
    return { budget, schedule, clashes };
  }, [model]);
  const title = kind === "5d" ? "PRESUP-5D · Reconciliación" : kind === "4d" ? "4D · Planificación" : "CLASHES · Coordinación";
  return <section className="e7-domain-module"><div className="e7-domain-heading"><div><span className="arki-context-kicker">E7 · CICLO 2</span><h2>{title}</h2><p>Resultado derivado de contratos E7 y trazable al modelo activo.</p></div><span className="e7-domain-badge">{kind === "clashes" ? `${data.clashes.length} hallazgo` : kind === "5d" ? `${data.budget.directCost.toFixed(2)} PEN` : `${data.schedule.durationDays} días`}</span></div><div className="e7-domain-grid">{kind === "5d" && <><div><small>METRADO</small><strong>{data.budget.lines[0].quantity} m²</strong></div><div><small>COSTO DIRECTO</small><strong>{data.budget.directCost.toFixed(2)} PEN</strong></div><div><small>FUENTE</small><strong>PriceBook {data.budget.priceBookVersion}</strong></div></>}{kind === "4d" && <><div><small>ACTIVIDADES</small><strong>{data.schedule.activities.length}</strong></div><div><small>RUTA CRÍTICA</small><strong>{data.schedule.criticalPath.join(" → ")}</strong></div><div><small>DURACIÓN</small><strong>{data.schedule.durationDays} días</strong></div></>}{kind === "clashes" && data.clashes.map((clash) => <div key={clash.id}><small>{clash.id}</small><strong>{clash.leftId} × {clash.rightId}</strong><span>{clash.intersectionVolume} m³ · {clash.status}</span></div>)}</div><div className="e7-domain-footnote">{model ? "Modelo activo conectado" : "Fixture E7 visible · genere una propuesta para conectar el modelo"}</div></section>;
}
