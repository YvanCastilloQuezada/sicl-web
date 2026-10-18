import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createManifestFixture, type ManifestFixtureState, type MjpTvManifest } from "../../../shared/tvManifest";

const states: ManifestFixtureState[] = ["SCHEDULED", "OPEN", "LOCKED", "DRAWING", "RESULT_VERIFIED", "COMPLETED", "CANCELLED"];

export default function ManifestTestPanel() {
  const [state, setState] = useState<ManifestFixtureState>("OPEN");
  const [manifest, setManifest] = useState<MjpTvManifest>(() => createManifestFixture("OPEN"));
  const simulate = (next: ManifestFixtureState) => { setState(next); setManifest(createManifestFixture(next)); };
  return <section className="mt-8 rounded-[2rem] border border-fuchsia-300/20 bg-fuchsia-950/20 p-6" aria-label="Laboratorio local de MjpTvManifest"><div className="flex flex-wrap items-center justify-between gap-4"><div><Badge className="border border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-100">LABORATORIO LOCAL</Badge><h2 className="mt-3 font-display text-3xl text-white">Simulador MjpTvManifest v1</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Fixtures deterministas en memoria para validar el render del TV Client. No crea rondas, tickets, saldos ni eventos en la base de datos.</p></div><code className="text-xs text-fuchsia-200">?manifestTest=1</code></div><div className="mt-5 flex flex-wrap gap-2">{states.map((option) => <Button key={option} type="button" variant="outline" onClick={() => simulate(option)} className={state === option ? "border-fuchsia-200 bg-fuchsia-200/20 text-white" : "border-white/15 bg-white/5 text-slate-200"}>{option}</Button>)}</div><pre className="mt-5 max-h-64 overflow-auto bg-black/30 p-4 text-xs leading-5 text-fuchsia-100">{JSON.stringify(manifest, null, 2)}</pre></section>;
}
