import { useState } from "react";
import { Button } from "@/components/ui/button";
import { siclClient, apiErrorMessage } from "@/api/sicl-client";
import { DEFAULT_PARENT } from "@/components/AdvancedEvolutionPanel";

type Props = { projectId: string };

export default function MultiAgentDesignPanel({ projectId }: Props) {
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [scope, setScope] = useState("edificacion");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      setResult(await siclClient.multiAgentExploration(projectId, { alternative: DEFAULT_PARENT, spatial_scope: scope, active_agents: ["GENERALIST", "BIOCLIMATIC", "URBAN_SITE", "DEVELOPER_AREA_EFFICIENCY", "BEAUTY_HARMONY"] }));
    } catch (value) {
      setError(apiErrorMessage(value));
    } finally {
      setBusy(false);
    }
  };

  const observations = result?.exploration?.observations ?? [];
  const critic = result?.critic;
  const matrix = result?.position_matrix;

  return (
    <section className="rounded border border-[#385348] bg-[#fbfaf6] p-4 text-[#1d2925]" aria-label="Design perspectives">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-xl text-[#385348]">Design perspectives</h3>
          <p className="mt-1 text-xs text-[#718078]">The same alternative is examined through different professional lenses. Perspectives support review; they do not decide.</p>
        </div>
        <span className="rounded bg-[#dce8df] px-2 py-1 text-xs font-semibold text-[#385348]">Human review</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <select value={scope} onChange={(event) => setScope(event.target.value)} className="h-9 rounded border border-[#b9c4bd] bg-white px-2 text-sm" aria-label="Spatial scope">
          <option value="edificacion">Edificación</option>
          <option value="parcela_sitio">Parcela / Sitio</option>
          <option value="pais">País</option>
        </select>
        <Button size="sm" onClick={run} disabled={busy}>{busy ? "Reviewing…" : "Ask perspectives"}</Button>
      </div>
      {error && <p className="mt-2 text-sm text-[#a94524]" role="alert">{error}</p>}
      {result && <div className="mt-3 space-y-3">
        <div className="grid gap-2 md:grid-cols-2">
          {observations.map((item: any) => <article key={item.agent} className="rounded border border-[#d7d8cf] bg-white p-3 text-xs">
            <p className="font-semibold text-[#385348]">{item.agent}</p>
            <p className="mt-1 text-[11px] uppercase tracking-wide text-[#718078]">{item.classification ?? item.state ?? "Perspective"}</p>
            {item.fact && <p className="mt-2 text-[#52645a]"><strong>Evidence:</strong> {item.fact.metric} = {String(item.fact.value)}</p>}
            <p className="mt-2 text-[#52645a]"><strong>Reading:</strong> {item.interpretation ?? "No evidence-backed observation"}</p>
          </article>)}
        </div>
        <div className="rounded border border-[#d7d8cf] bg-white p-3 text-xs">
          <p className="font-semibold text-[#385348]">Review status</p>
          <p className="mt-1 text-[#52645a]">{critic?.automatic_decision === false ? "No automatic decision." : "Human confirmation remains required."}</p>
          <p className="text-[#52645a]">{matrix?.disagreement_preserved ? "Unresolved disagreement can remain visible." : "No unresolved disagreement was detected for this request."}</p>
        </div>
        <details className="rounded border border-[#d7d8cf] bg-white p-3 text-xs">
          <summary className="cursor-pointer font-semibold text-[#385348]">Technical matrix and strategies</summary>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-[#52645a]">{JSON.stringify({ position_matrix: matrix, critic, strategies: result.strategies, agent_winner: result.agent_winner, decision_created: result.decision_created }, null, 2)}</pre>
        </details>
        <p className="text-[11px] text-[#718078]">Agents propose observations and strategies only. Any generation requires human confirmation through the existing design flow.</p>
      </div>}
    </section>
  );
}
