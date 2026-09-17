import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiErrorMessage, siclClient, type IntentInterpretation } from "@/api/sicl-client";
import { toast } from "sonner";

export default function DesignIntentPanel({ projectId, spatialScope }: { projectId?: string; spatialScope?: string }) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [interpretation, setInterpretation] = useState<IntentInterpretation>();
  const [approved, setApproved] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [adopted, setAdopted] = useState(false);

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
      await siclClient.confirmDesignIntent(projectId, interpretation, approved, "human-architect");
      setAdopted(true);
      toast.success(t("guided.intent.confirmed", { defaultValue: "Intención adoptada por autoridad humana" }));
    } catch (error) { toast.error(apiErrorMessage(error)); } finally { setBusy(false); }
  };

  return <Card className="border-[#385348] bg-[#fbfaf6] shadow-none">
    <CardHeader className="pb-3"><div className="flex items-center justify-between gap-3"><CardTitle className="flex items-center gap-2 font-serif text-xl"><Sparkles className="h-5 w-5 text-[#d07b4a]" />{t("guided.intent.title", { defaultValue: "Human design intent" })}</CardTitle><Badge className="bg-[#dce6dc] text-[#385348] hover:bg-[#dce6dc]">{t("guided.human_authority", { defaultValue: "Human authority" })}</Badge></div><p className="text-sm text-[#718078]">{t("guided.intent.subtitle", { defaultValue: "Describe what matters. SICL suggests structure; you decide what to adopt." })}</p></CardHeader>
    <CardContent className="space-y-3"><Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder={t("guided.intent.placeholder", { defaultValue: "Example: I want more open site area, a compact mass, and privacy." })} className="min-h-24 bg-white" /><div className="flex flex-wrap gap-2"><Button type="button" onClick={interpret} disabled={busy || !text.trim()}>{busy ? t("guided.intent.working", { defaultValue: "Interpreting…" }) : t("guided.intent.interpret", { defaultValue: "Suggest structured intent" })}</Button>{interpretation && <Button type="button" variant="outline" onClick={confirm} disabled={busy || !projectId || approved.length === 0 || adopted}>{t("guided.intent.confirm", { defaultValue: "Confirm selected intent" })}</Button>}</div>{!projectId && interpretation && <p className="text-xs text-[#a94524]">{t("guided.intent.project_required", { defaultValue: "Select a project before confirming." })}</p>}{interpretation && <div className="space-y-2 rounded border border-[#d7d8cf] bg-white p-3"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wide text-[#718078]">{t("guided.intent.suggestions", { defaultValue: "Suggested intent" })}</p>{adopted && <span className="flex items-center gap-1 text-xs font-semibold text-[#385348]"><CheckCircle2 className="h-4 w-4" />{t("guided.intent.adopted", { defaultValue: "Adopted" })}</span>}</div>{interpretation.suggestions.map((item) => <label key={item.intent_id} className="flex items-start gap-2 rounded border border-[#e6e8e2] p-2 text-sm"><input type="checkbox" checked={approved.includes(item.intent_id)} disabled={adopted} onChange={(event) => setApproved((current) => event.target.checked ? [...current, item.intent_id] : current.filter((id) => id !== item.intent_id))} /><span><strong className="text-[#385348]">{item.kind}</strong><span className="ml-2 text-[#1d2925]">{item.statement}</span><span className="mt-1 block text-xs text-[#718078]">{item.evidence_terms.join(", ") || t("guided.intent.no_terms", { defaultValue: "No matching rule term; review carefully." })}</span></span></label>)}<p className="text-xs text-[#718078]">{t("guided.intent.notice", { defaultValue: "Suggestion ≠ recommendation ≠ decision. Confirmation is recorded in the Event Log." })}</p></div>}</CardContent>
  </Card>;
}
