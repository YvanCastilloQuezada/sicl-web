import { useState } from "react";
import type { ComparisonInput } from "@/api/sicl-client";
export default function ComparisonForm({ onSubmit, busy }: { onSubmit: (input: ComparisonInput) => Promise<void>; busy?: boolean }) {
  const [alternatives, setAlternatives] = useState(""); const [objectives, setObjectives] = useState("");
  return <form className="grid gap-3 border p-4" onSubmit={async (event) => { event.preventDefault(); const values = alternatives.split(",").map((item) => item.trim()).filter(Boolean); if (values.length < 2) return; await onSubmit({ alternatives: values, objectives: objectives.split(",").map((item) => item.trim()).filter(Boolean) }); setAlternatives(""); setObjectives(""); }}><h3 className="font-semibold">Crear Comparison</h3><label>Alternatives (mínimo 2, separadas por coma)<input required value={alternatives} onChange={(e) => setAlternatives(e.target.value)} /></label><label>Objectives (opcional, separadas por coma)<input value={objectives} onChange={(e) => setObjectives(e.target.value)} /></label><button disabled={busy} type="submit">{busy ? "Guardando…" : "Crear Comparison"}</button></form>;
}
