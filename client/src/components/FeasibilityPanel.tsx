import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siclClient, type FeasibilityResult } from "@/api/sicl-client";

type Props = { projectId: string };

export default function FeasibilityPanel({ projectId }: Props) {
  const [alternativeId, setAlternativeId] = useState("ALT-A");
  const [key, setKey] = useState("INVESTMENT");
  const [value, setValue] = useState("90");
  const [result, setResult] = useState<FeasibilityResult>();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function check() {
    setBusy(true); setMessage("");
    try {
      const evaluated = await siclClient.checkFeasibility(projectId, alternativeId, { [key.trim().toUpperCase()]: Number(value) });
      setResult(evaluated);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo evaluar la factibilidad");
    } finally { setBusy(false); }
  }

  const stateClass = result?.state === "FEASIBLE" ? "border-[#385348] bg-[#e8f2e6] text-[#385348]" : "border-[#d07b4a] bg-[#fff0e7] text-[#9a3f21]";
  return <Card className="border-[#385348] bg-[#fbfaf6] shadow-none" aria-label="Factibilidad RFC-020"><CardHeader><CardTitle className="flex items-center gap-2 font-serif text-xl"><ShieldCheck className="h-5 w-5 text-[#385348]" /> Filtro de factibilidad</CardTitle><p className="text-sm leading-6 text-[#718078]">Evalúa restricciones duras y blandas sin crear una recomendación ni una decisión.</p></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><div><Label htmlFor="feasibility-alternative">Alternativa</Label><Input id="feasibility-alternative" value={alternativeId} onChange={(event) => setAlternativeId(event.target.value)} /></div><div><Label htmlFor="feasibility-key">Variable</Label><Input id="feasibility-key" value={key} onChange={(event) => setKey(event.target.value)} /></div><div><Label htmlFor="feasibility-value">Valor</Label><Input id="feasibility-value" type="number" value={value} onChange={(event) => setValue(event.target.value)} /></div></div><Button type="button" onClick={() => void check()} disabled={busy} className="bg-[#385348] text-white hover:bg-[#294038]">{busy ? "Evaluando…" : "Comprobar factibilidad"}</Button>{result && <div className={`border p-4 ${stateClass}`} role="status">{result.state === "FEASIBLE" ? <CheckCircle2 className="mr-2 inline h-4 w-4" /> : <AlertTriangle className="mr-2 inline h-4 w-4" />}<strong>{result.alternative_id}: {result.state}</strong><p className="mt-1 text-sm">{result.state === "FEASIBLE" ? "Las restricciones duras declaradas se cumplen." : result.state === "INFEASIBLE" ? "Al menos una restricción dura fue violada." : "Faltan datos o no se pudo evaluar una restricción."}</p></div>}{message && <p role="alert" className="text-sm text-[#9a3f21]">{message}</p>}</CardContent></Card>;
}
