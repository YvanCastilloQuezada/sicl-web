import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siclClient, apiErrorMessage } from "@/api/sicl-client";

type Props = { projectId: string };
type Memory = Record<string, any>;

export default function DesignMemoryPanel({ projectId }: Props) {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [selected, setSelected] = useState("UPAO-001-A");
  const [query, setQuery] = useState("HOW_DID_WE_GET_HERE");
  const [result, setResult] = useState<Memory | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { let active = true; siclClient.designMemory(projectId).then((value) => active && setMemory(value)).catch((value) => active && setError(apiErrorMessage(value))); return () => { active = false; }; }, [projectId]);
  const run = async (action: () => Promise<Memory>) => { setBusy(true); setError(""); try { setResult(await action()); } catch (value) { setError(apiErrorMessage(value)); } finally { setBusy(false); } };
  const history = (memory?.history as Array<Memory> | undefined) ?? [];
  const lineage = (memory?.lineage as Array<Memory> | undefined) ?? [];
  return <section className="rounded border border-[#385348] bg-[#fbfaf6] p-4 text-[#1d2925]" aria-label="Design Memory">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a94524]">GDI-P5</p><h3 className="font-serif text-xl text-[#385348]">Design Memory</h3><p className="mt-1 text-xs text-[#718078]">History derived from actual Event Log evidence. It does not create decisions.</p></div><span className="rounded bg-[#dce8df] px-2 py-1 text-xs font-semibold text-[#385348]">{memory?.memory_status ?? "Loading…"}</span></div>
    {error && <p className="mt-2 text-sm text-[#a94524]" role="alert">{error}</p>}
    <div className="mt-3 grid gap-3 lg:grid-cols-[1.2fr_1fr]"><div className="rounded border border-[#d7d8cf] bg-white p-3"><p className="font-semibold text-[#385348]">Design history</p>{history.length ? <ol className="mt-2 space-y-2">{history.map((item) => <li key={`${item.sequence}-${item.event.event_id}`} className="rounded border border-[#e2e4de] p-2 text-xs"><span className="font-semibold">{item.sequence}. {item.kind}</span><span className="ml-2 text-[#718078]">{item.event.type}</span><p className="mt-1 text-[#52645a]">{item.alternative_id ?? "Project event; alternative not recorded"}</p></li>)}</ol> : <p className="mt-2 text-xs text-[#718078]">No design history recorded yet.</p>}</div><div className="space-y-3"><div className="rounded border border-[#d7d8cf] bg-white p-3"><p className="font-semibold text-[#385348]">Branch history</p>{lineage.length ? lineage.map((item) => <button type="button" key={item.alternative_id} onClick={() => setSelected(item.alternative_id)} className={`mt-2 block w-full rounded border p-2 text-left text-xs ${selected === item.alternative_id ? "border-[#a94524] bg-[#fff5ed]" : "border-[#e2e4de]"}`}><span className="font-semibold">{item.alternative_id}</span><span className="ml-2 text-[#718078]">parent: {item.parent_alternative_id ?? "base / not recorded"}</span><span className="mt-1 block text-[#718078]">children: {(item.children ?? []).join(", ") || "none observed"}</span></button>) : <p className="mt-2 text-xs text-[#718078]">No lineage records available.</p>}</div><div className="rounded border border-[#d7d8cf] bg-white p-3"><p className="font-semibold text-[#385348]">Memory actions</p><div className="mt-2 flex flex-wrap gap-2"><Button size="sm" onClick={() => run(() => siclClient.explainDesign(projectId, selected))} disabled={busy}>Explain this design</Button><Button size="sm" variant="outline" onClick={() => run(() => siclClient.replayDesign(projectId, selected))} disabled={busy}>Replay</Button><Button size="sm" variant="outline" onClick={() => run(() => siclClient.memoryQuery(projectId, query))} disabled={busy}>Query memory</Button></div><Input className="mt-2" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Memory query" placeholder="HOW_DID_WE_GET_HERE" /><div className="mt-2 flex gap-2"><Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Optional human reason" aria-label="Human reason" /><Button size="sm" variant="outline" onClick={() => run(() => siclClient.recordDesignDirection(projectId, selected, "REJECTED_BY_HUMAN", reason))} disabled={busy}>Reject direction</Button></div><p className="mt-2 text-[11px] text-[#718078]">Not selected is not rejected. A rejection requires this explicit human action.</p></div></div></div>
    {result && <div className="mt-3 rounded border border-[#385348] bg-[#eef1eb] p-3 text-xs"><p className="font-semibold text-[#385348]">Evidence-based result</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-[#52645a]">{JSON.stringify(result, null, 2)}</pre><a className="mt-2 inline-block font-semibold text-[#385348] underline" href={`/spatial-comparison?project=${encodeURIComponent(projectId)}&alternative=${encodeURIComponent(selected)}`}>Open actual design: {selected}</a></div>}
  </section>;
}
