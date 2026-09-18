import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiErrorMessage, siclClient, type IntentInterpretation } from "@/api/sicl-client";
import { toast } from "sonner";
import SpatialSynthesisPreview from "@/components/SpatialSynthesisPreview";

export default function DesignIntentPanel({ projectId, spatialScope }: { projectId?: string; spatialScope?: string }) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [interpretation, setInterpretation] = useState<IntentInterpretation>();
  const [approved, setApproved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [adopted, setAdopted] = useState(false);
  const [adoptedPayload, setAdoptedPayload] = useState<Record<string, unknown>>();
  const [knowledge, setKnowledge] = useState<Record<string, unknown>>();
  const [exploration, setExploration] = useState<Record<string, unknown>>();
  const [bounded, setBounded] = useState<Record<string, unknown>>();
  const [challenge, setChallenge] = useState<Record<string, unknown>>();
  const [spaceMap, setSpaceMap] = useState<Record<string, unknown>>();
  const [spatialSynthesis, setSpatialSynthesis] = useState<Record<string, unknown>>();

  const interpret = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      const result = await siclClient.interpretDesignIntent(text, projectId, spatialScope);
      setInterpretation(result);
      setApproved(result.suggestions.map((item) => item.intent_id));
      setAdopted(false);
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const confirm = async () => {
    if (!projectId || !interpretation || approved.length === 0) return;
    setBusy(true);
    try {
      const confirmation = await siclClient.confirmDesignIntent(projectId, interpretation, approved, "human-architect");
      const confirmedIntent = (confirmation.adopted_intent ?? confirmation) as Record<string, unknown>;
      const linkedKnowledge = await siclClient.linkDesignKnowledge(projectId, confirmedIntent);
      setAdoptedPayload(confirmedIntent);
      setKnowledge(linkedKnowledge);
      setAdopted(true);
      toast.success(t("guided.intent.confirmed", { defaultValue: "Intención adoptada por autoridad humana" }));
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const exploreBounded = async () => {
    if (!projectId || !adoptedPayload || !knowledge) return;
    setBusy(true);
    try {
      const result = await siclClient.exploreGdi(projectId, "UPAO-001-A", adoptedPayload, knowledge, "STANDARD");
      setBounded(result);
      window.sessionStorage.setItem("sims-dei.gdi.exploration", JSON.stringify(result));
      toast.success(t("guided.intent.bounded_ready", { defaultValue: "Bounded design exploration ready" }));
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const buildSpaceMap = async () => {
    if (!projectId || !bounded) return;
    setBusy(true);
    try { setSpaceMap(await siclClient.gdiMultiobjective(projectId, bounded)); } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const generateSpatialSynthesis = async () => {
    if (!projectId || !adoptedPayload) return;
    setBusy(true);
    try {
      const result = await siclClient.spatialSynthesisGenerate(projectId, adoptedPayload, ["CENTRALIZED", "COURTYARD", "LINEAR"]);
      setSpatialSynthesis(result);
      toast.success(t("guided.intent.synthesis_ready", { defaultValue: "Architectural spatial synthesis ready" }));
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const challengeCandidate = async (candidate: Record<string, unknown>) => {
    if (!projectId || !knowledge) return;
    setBusy(true);
    try { setChallenge(await siclClient.challengeGdi(projectId, candidate, knowledge)); } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const evolveCandidate = async (candidate: Record<string, unknown>, action: string) => {
    if (!projectId) return;
    setBusy(true);
    try { const evolved = await siclClient.evolveGdi(projectId, candidate, action); setBounded((current) => current ? { ...current, evolved } : current); } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  const explore = async () => {
    if (!projectId || !adoptedPayload || !knowledge) return;
    setBusy(true);
    try {
      const result = await siclClient.exploreDesignAlternative(projectId, "UPAO-001-A", adoptedPayload, knowledge);
      setExploration(result);
      window.sessionStorage.setItem("sims-dei.div-p0.exploration", JSON.stringify(result));
      toast.success(t("guided.intent.exploration_ready", { defaultValue: "Controlled alternative generated" }));
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  return <Card className="border-[#385348] bg-[#fbfaf6] shadow-none">
    <CardHeader className="pb-3"><div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 font-serif text-xl"><Sparkles className="h-5 w-5 text-[#d07b4a]" />{t("guided.intent.title", { defaultValue: "Human design intent" })}</CardTitle><Badge className="bg-[#dce6dc] text-[#385348] hover:bg-[#dce6dc]">{t("guided.human_authority", { defaultValue: "Human authority" })}</Badge></div><p className="text-sm text-[#718078]">{t("guided.intent.subtitle", { defaultValue: "Describe what matters. SICL suggests structure; you decide what to adopt." })}</p></CardHeader>
    <CardContent className="space-y-3"><Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t("guided.intent.placeholder", { defaultValue: "Example: I want more open site area, a compact mass, and privacy." })} className="min-h-24 bg-white" /><div className="flex flex-wrap gap-2"><Button type="button" onClick={interpret} disabled={busy || !text.trim()}>{busy ? t("guided.intent.working", { defaultValue: "Interpreting…" }) : t("guided.intent.interpret", { defaultValue: "Suggest structured intent" })}</Button>{interpretation && <Button type="button" variant="outline" onClick={confirm} disabled={busy || !projectId || approved.length === 0 || adopted}>{t("guided.intent.confirm", { defaultValue: "Confirm selected intent" })}</Button>}{adopted && <Button type="button" onClick={explore} disabled={busy || !knowledge || Boolean(exploration)}>{t("guided.intent.explore", { defaultValue: "Authorize controlled exploration" })}</Button>}{adopted && <Button type="button" variant="outline" onClick={exploreBounded} disabled={busy || !knowledge || Boolean(bounded)}>{t("guided.intent.bounded", { defaultValue: "Explore bounded design space" })}</Button>}{adopted && <Button type="button" variant="outline" onClick={generateSpatialSynthesis} disabled={busy || Boolean(spatialSynthesis)}>{t("guided.intent.synthesize", { defaultValue: "Generate program + spaces" })}</Button>}</div>{!projectId && interpretation && <p className="text-xs text-[#a94524]">{t("guided.intent.project_required", { defaultValue: "Select a project before confirming." })}</p>}{interpretation && <div className="space-y-2 rounded border border-[#d7d8cf] bg-white p-3"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-[#718078]">{t("guided.intent.suggestions", { defaultValue: "Suggested intent" })}</p>{adopted && <span className="flex items-center gap-1 text-xs font-semibold text-[#385348]"><CheckCircle2 className="h-4 w-4" />{t("guided.intent.adopted", { defaultValue: "Adopted" })}</span>}</div>{interpretation.suggestions.map((item) => <label key={item.intent_id} className="flex items-start gap-2 rounded border border-[#e6e8e2] p-2 text-sm"><input type="checkbox" checked={approved.includes(item.intent_id)} disabled={adopted} onChange={(event) => setApproved((current) => event.target.checked ? [...current, item.intent_id] : current.filter((id) => id !== item.intent_id))} /><span><strong className="text-[#385348]">{item.kind}</strong><span className="ml-2 text-[#1d2925]">{item.statement}</span><span className="mt-1 block text-xs text-[#718078]">{item.evidence_terms.join(", ") || t("guided.intent.no_terms", { defaultValue: "No matching rule term; review carefully." })}</span></span></label>)}<p className="text-xs text-[#718078]">{t("guided.intent.notice", { defaultValue: "Suggestion ≠ recommendation ≠ decision. Confirmation is recorded in the Event Log." })}</p>{knowledge && <div className="space-y-2 rounded border border-[#c9d7c9] bg-[#f1f6ef] p-3 text-xs text-[#1d2925]">
  <p className="font-semibold text-[#385348]">{t("guided.intent.knowledge_linked", { defaultValue: "Design knowledge linked: {{count}} matches", count: (knowledge.links as unknown[] | undefined)?.length ?? 0 })}</p>
  <p className="text-[#52645a]">{t("guided.intent.knowledge_notice", { defaultValue: "These are contextual suggestions, not requirements or decisions." })}</p>
  <div className="space-y-1">{((knowledge.applicable_items as Array<Record<string, unknown>> | undefined) ?? []).slice(0, 4).map((item) => <div key={String(item.knowledge_item_id)} className="rounded border border-[#d7e2d7] bg-white p-2"><p className="font-semibold text-[#385348]">{String(item.title)}</p><p>{String(item.statement)}</p><p className="mt-1 text-[#718078]">{t("guided.intent.knowledge_source", { defaultValue: "Source" })}: {String(item.source_id)} · {t("guided.intent.knowledge_type", { defaultValue: "Type" })}: {String(item.epistemic_status)}</p><p className="text-[#718078]">{t("guided.intent.knowledge_limitations", { defaultValue: "Limitations" })}: {((item.limitations as string[] | undefined) ?? []).join(" ") || "—"}</p></div>)}</div>
  <div className="border-t border-[#d7e2d7] pt-2"><p className="font-semibold text-[#385348]">{t("guided.intent.knowledge_provenance", { defaultValue: "Source provenance" })}</p>{((knowledge.sources as Array<Record<string, unknown>> | undefined) ?? []).slice(0, 4).map((source) => <p key={String(source.source_id)} className="text-[#52645a]">{String(source.title)} · {String(source.review_status)} · {String(source.license_status)}{source.url ? <> · <a className="underline" href={String(source.url)} target="_blank" rel="noreferrer">{t("guided.intent.open_source", { defaultValue: "Open source record" })}</a></> : null}</p>)}</div>
</div>}{bounded && <div className="rounded bg-[#eef1eb] p-3 text-xs text-[#1d2925]"><strong>{t("guided.intent.bounded_title", { defaultValue: "Bounded design space" })}</strong><p className="mt-1">{t("guided.intent.families", { defaultValue: "Families" })}: {Object.keys((bounded.design_families as Record<string, unknown> | undefined) ?? {}).join(", ") || "—"}</p><div className="mt-2 space-y-2">{(bounded.candidates as Array<Record<string, unknown>> | undefined)?.map((candidate) => <div key={String((candidate.alternative as { alternative_id: string }).alternative_id)} className="rounded border border-[#d7d8cf] bg-white p-2"><div className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold">{String((candidate.alternative as { alternative_id: string }).alternative_id)} · {String((candidate.design_dna as { composition_family: string }).composition_family)}</span><span className="flex gap-1"><Button type="button" size="sm" variant="outline" onClick={() => evolveCandidate(candidate, "KEEP_THIS")}>{t("guided.intent.keep", { defaultValue: "Keep" })}</Button><Button type="button" size="sm" variant="outline" onClick={() => evolveCandidate(candidate, "CHANGE_THAT")}>{t("guided.intent.change", { defaultValue: "Change" })}</Button><Button type="button" size="sm" variant="outline" onClick={() => challengeCandidate(candidate)}>{t("guided.intent.challenge", { defaultValue: "Challenge" })}</Button></span></div></div>)}</div><a href="/spatial-comparison" className="mt-2 inline-block font-semibold text-[#385348] underline">{t("guided.intent.open_exploration", { defaultValue: "Open generated designs in visual comparison" })}</a>{challenge && <p className="mt-2 text-[#385348]">{t("guided.intent.perspectives", { defaultValue: "{{count}} design perspectives preserved", count: (challenge.perspectives as unknown[] | undefined)?.length ?? 0 })}</p>}<Button type="button" size="sm" variant="outline" onClick={buildSpaceMap} disabled={busy || !bounded || Boolean(spaceMap)}>{t("guided.intent.map_tradeoffs", { defaultValue: "Map supported trade-offs" })}</Button>{spaceMap && <div className="mt-2 rounded border border-[#d7d8cf] bg-white p-2"><p className="font-semibold">{t("guided.intent.frontier", { defaultValue: "Raw Pareto frontier" })}: {((spaceMap.pareto_front as string[] | undefined) ?? []).join(", ") || "—"}</p><p className="mt-1 text-[#718078]">{t("guided.intent.no_winner", { defaultValue: "No automatic winner; select a design visually." })}</p></div>}{spatialSynthesis && <div className="mt-2 rounded border border-[#385348] bg-[#eef1eb] p-3"><p className="font-semibold">{t("guided.intent.synthesis_title", { defaultValue: "Architectural spatial synthesis" })}</p><p className="mt-1">{t("guided.intent.synthesis_program", { defaultValue: "Program spaces" })}: {String(((spatialSynthesis.program as { requirements?: unknown[] } | undefined)?.requirements?.length) ?? 0)}</p><p>{t("guided.intent.synthesis_alternatives", { defaultValue: "Spatial alternatives" })}: {String(((spatialSynthesis.alternatives as unknown[] | undefined)?.length) ?? 0)}</p><p className="mt-1 text-xs">{t("guided.intent.synthesis_provenance", { defaultValue: "Synthetic demonstration data; generated layout is not regulatory validation." })}</p></div>}</div>}{exploration && <div className="rounded bg-[#eef1eb] p-3 text-xs text-[#1d2925]"><strong>{t("guided.intent.generated", { defaultValue: "Generated controlled alternative" })}</strong><p className="mt-1">{String(exploration.parent_alternative_id)} → {String((exploration.derived_alternative as { alternative_id?: string } | undefined)?.alternative_id ?? "—")}</p><p className="mt-1">{t("guided.intent.changed", { defaultValue: "Changed parameters" })}: {Object.keys((exploration.changed_parameters as Record<string, unknown> | undefined) ?? {}).join(", ") || "—"}</p><p className="mt-1">{t("guided.intent.tradeoff", { defaultValue: "Trade-offs are descriptive; no winner is selected." })}</p><a href="/spatial-comparison" className="mt-2 inline-block font-semibold text-[#385348] underline">{t("guided.intent.open_comparison", { defaultValue: "Open visual A/B/C comparison" })}</a></div>}</div>}{spatialSynthesis && <SpatialSynthesisPreview alternatives={(spatialSynthesis.alternatives as Array<{ family?: string; representation?: { alternative_id?: string; elements?: unknown[] } }> | undefined) ?? []} />}</CardContent>
  </Card>;
}
