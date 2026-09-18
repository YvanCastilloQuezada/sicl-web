import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Compass, MapPin, RefreshCw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiErrorMessage, siclClient, type CoreProject, type Evidence, type SpatialRegistration } from "@/api/sicl-client";
import ArquiAvatar from "@/components/ArquiAvatar";
import { routeArquiQuestion, type ArquiDialogueResponse, type ArquiDialogueContext } from "@/components/arquiDialogue";
import { deriveArquiDiagnostics } from "@/components/arquiDiagnostics";
import { deriveArquiCapabilities } from "@/components/arquiCapabilities";
import { deriveArquiWorkflow, routeArquiGoal, type ArquiGoal } from "@/components/arquiWorkflow";
import { deriveArchitecturalReasoning, type ArquiDesignReasoning } from "@/components/arquiReasoning";
import { answerCapabilityQuestion, deriveCapabilityKnowledge, type CapabilityKnowledgeContext } from "@/components/arquiCapabilityKnowledge";
import ArquiControlledOperations from "@/components/ArquiControlledOperations";

type WorkContext = "FIELD" | "DESIGN" | "ANALYSIS" | "COMPARISON" | "REVIEW" | "PRESENTATION_AR" | "UNKNOWN";
type Props = { projectId: string; onNavigate: (target: string) => void; initialWorkContext?: WorkContext };
type ContextState = { projectId: string; evidence: Evidence[]; registrations: SpatialRegistration[]; project?: CoreProject };

function evidenceState(item: Evidence): string { return String(item.epistemic_state ?? item.evidence_state ?? item.state ?? "").toUpperCase(); }
function registrationIsAvailable(item: SpatialRegistration): boolean { return ["LOCKED", "CONFIRMED", "REGISTERED", "AVAILABLE"].includes(String(item.status).toUpperCase()); }
function countCollection(value: unknown): number { return Array.isArray(value) ? value.length : value && typeof value === "object" ? Object.keys(value).length : 0; }

export default function ArquiContextPanel({ projectId, onNavigate, initialWorkContext = "UNKNOWN" }: Props) {
  const { t } = useTranslation();
  const [context, setContext] = useState<ContextState>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [workContext, setWorkContext] = useState<WorkContext>(initialWorkContext);
  const [question, setQuestion] = useState("");
  const [dialogue, setDialogue] = useState<ArquiDialogueResponse>();
  const [workflowGoal, setWorkflowGoal] = useState<ArquiGoal>("UNKNOWN_GOAL");
  const [reasoning, setReasoning] = useState<ArquiDesignReasoning>();
  const [capabilityAnswer, setCapabilityAnswer] = useState<ReturnType<typeof answerCapabilityQuestion>>();

  const refresh = useCallback(async () => {
    if (!projectId) return;
    setLoading(true); setError("");
    try {
      const [evidence, registrationData, project] = await Promise.all([
        siclClient.listEvidence(projectId),
        siclClient.listSpatialRegistrations(projectId),
        siclClient.getProject(projectId),
      ]);
      setContext({ projectId, evidence, registrations: registrationData.registrations ?? [], project });
    } catch (err) { setContext(undefined); setError(apiErrorMessage(err)); }
    finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { setWorkContext(initialWorkContext); }, [initialWorkContext]);

  const summary = useMemo(() => {
    const evidence = context?.evidence ?? [];
    const pendingReview = evidence.filter((item) => evidenceState(item) === "AI_PROPOSED");
    const confirmed = evidence.filter((item) => ["HUMAN_CONFIRMED", "HUMAN_CORRECTED", "OBSERVED"].includes(evidenceState(item)));
    const photos = evidence.filter((item) => String(item.evidence_type ?? "").toUpperCase() === "PHOTO" || Boolean(item.media_id));
    const alternativeCount = countCollection(context?.project?.alternatives);
    const hasAnalysis = Boolean(context?.project?.evaluations || context?.project?.comparisons);
    return { total: evidence.length, photos: photos.length, confirmed: confirmed.length, pendingReview: pendingReview.length, locationRegistered: (context?.registrations ?? []).some(registrationIsAvailable), alternativeCount, hasAnalysis };
  }, [context]);

  const openEvidence = (focus?: "review" | "capture") => { onNavigate("evidence"); if (focus) window.setTimeout(() => window.dispatchEvent(new CustomEvent(`sims-dei:field-${focus}`)), 0); };
  const state = error ? "unknown" : summary.pendingReview > 0 ? "attention" : "ready";
  const contextLabel = t(`arqui.context_${workContext.toLowerCase()}`);
  const actionBasis = summary.pendingReview > 0 ? t("arqui.basis_review", { count: summary.pendingReview }) : summary.alternativeCount > 0 ? t("arqui.basis_alternatives", { count: summary.alternativeCount }) : t("arqui.basis_context");
  const dialogueContext: ArquiDialogueContext = { photos: summary.photos, pendingReview: summary.pendingReview, confirmed: summary.confirmed, totalEvidence: summary.total, locationRegistered: summary.locationRegistered, alternatives: summary.alternativeCount, hasAnalysis: summary.hasAnalysis, workContext };
  const diagnostics = deriveArquiDiagnostics({ pendingReview: summary.pendingReview, alternatives: summary.alternativeCount, locationRegistered: summary.locationRegistered, hasAnalysis: summary.hasAnalysis });
  const capabilities = deriveArquiCapabilities({ alternatives: summary.alternativeCount, photos: summary.photos, pendingReview: summary.pendingReview, locationRegistered: summary.locationRegistered });
  const capabilityKnowledgeContext: CapabilityKnowledgeContext = { alternatives: summary.alternativeCount, photos: summary.photos, pendingReview: summary.pendingReview, locationRegistered: summary.locationRegistered, hasAnalysis: summary.hasAnalysis, hasSpatialRepresentation: Boolean(context?.project?.spatial_representation || context?.project?.geometry), hasKnowledge: true };
  const capabilityKnowledge = deriveCapabilityKnowledge(capabilityKnowledgeContext);
  const workflow = deriveArquiWorkflow(workflowGoal, { alternatives: summary.alternativeCount, photos: summary.photos, pendingReview: summary.pendingReview, locationRegistered: summary.locationRegistered });
  const askArqui = async () => {
    const asked = question;
    const response = routeArquiQuestion(asked, dialogueContext);
    const capabilityQuestion = /qué puedes hacer|what can you do|qué capacidad|what capability|qué necesitas|what do you need|cómo hago|how do i|hazlo por mí|do it for me|analiza.*foto|analyze.*photo|comparar.*alternativ|compare.*alternativ|cambiar.*altura|change.*height|mostrar.*ar|show.*design.*site|revisar.*observ|review.*observation/.test(asked.toLowerCase()) ? answerCapabilityQuestion(asked, capabilityKnowledgeContext) : undefined;
    const goal = routeArquiGoal(asked);
    setWorkflowGoal(goal);
    setQuestion("");
    if (capabilityQuestion && capabilityQuestion.kind !== "UNKNOWN") {
      const params = capabilityQuestion.params ? { ...capabilityQuestion.params, name: capabilityQuestion.descriptor ? t(capabilityQuestion.descriptor.nameKey) : capabilityQuestion.params.name } : undefined;
      setCapabilityAnswer({ ...capabilityQuestion, params });
      setDialogue({ ...response, intent: "CAPABILITY_QUERY", answerKey: capabilityQuestion.textKey, answerParams: params, basis: "CAPABILITY_CONTRACT", basisKey: "arqui.basis_capability", action: capabilityQuestion.descriptor?.uiDestination ? { target: capabilityQuestion.descriptor.uiDestination, labelKey: "arqui.open_capability" } : undefined });
      return;
    }
    if (response.intent.startsWith("DESIGN_")) {
      const raw = context?.project?.alternatives;
      const alternatives = raw && typeof raw === "object" ? Object.entries(raw).map(([key, value]) => ({ alternative_id: key, ...(value && typeof value === "object" ? value as Record<string, unknown> : {}) })) : [];
      setReasoning(deriveArchitecturalReasoning({ question: asked, alternatives, hasGeometry: Boolean(context?.project?.spatial_representation || context?.project?.geometry), hasKnowledge: response.intent === "DESIGN_WHY_QUERY", hasEvaluation: summary.hasAnalysis, hasConfirmedEvidence: summary.confirmed > 0 }));
      setDialogue(response);
      return;
    }
    if (goal !== "UNKNOWN_GOAL") {
      setDialogue({ intent: "WORKFLOW_GOAL_QUERY", answerKey: "arqui.workflow_goal_identified", answerParams: { goal: t(`arqui.goal_${goal.toLowerCase()}`) }, basis: "WORKFLOW", basisKey: "arqui.workflow_based_on" });
      return;
    }
    if (response.intent === "KNOWLEDGE_QUERY") {
      try {
        const result = await siclClient.queryDesignKnowledge({ spatial_scope: "edificacion", problem_terms: [asked] });
        const payload = result as { items?: unknown[]; patterns?: unknown[] };
        const matches = Array.isArray(payload.items) ? payload.items.length : Array.isArray(payload.patterns) ? payload.patterns.length : 0;
        setDialogue({ ...response, answerKey: "arqui.dialogue_knowledge_result", answerParams: { count: matches } });
      } catch { setDialogue(response); }
    } else setDialogue(response);
  };
  const runDialogueAction = () => { if (dialogue?.action) onNavigate(dialogue.action.target); };

  return <Card className="border-[#385348]/30 bg-card shadow-sm" aria-label={t("arqui.title")}>
    <CardHeader className="pb-3"><div className="flex items-center gap-3"><ArquiAvatar state={state} /><div className="min-w-0 flex-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]"><Sparkles className="h-4 w-4" />{t("arqui.eyebrow")}</p><CardTitle className="mt-1 font-serif text-2xl">{t("arqui.title")}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{t("arqui.assistant_label")}</p></div><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void refresh()} disabled={loading} aria-label={t("arqui.refresh")}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{t("arqui.refresh")}</Button><Button type="button" variant="ghost" size="icon" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? t("arqui.collapse") : t("arqui.expand")} aria-expanded={expanded}>{expanded ? <ChevronUp /> : <ChevronDown />}</Button></div></div></CardHeader>
    {expanded && <CardContent className="space-y-4">
      {loading && <p role="status" className="text-sm text-muted-foreground">{t("arqui.loading")}</p>}
      {error && <div className="flex items-center justify-between gap-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-sm"><span>{t("arqui.unavailable")}</span><Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>{t("arqui.retry")}</Button></div>}
      {!loading && !error && context && <>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.location")}</p><p className="mt-1 text-sm font-semibold">{summary.locationRegistered ? t("arqui.registered") : t("arqui.not_registered")}</p></div><div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.photos")}</p><p className="mt-1 text-sm font-semibold">{summary.photos}</p></div><div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.confirmed")}</p><p className="mt-1 text-sm font-semibold">{summary.confirmed}</p></div><div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.pending")}</p><p className="mt-1 text-sm font-semibold">{summary.pendingReview}</p></div></div>
        <div className="rounded border border-[#d07b4a]/40 bg-[#fffaf5] p-4 text-sm text-[#385348]"><p className="font-semibold">{t("arqui.guidance_title")}</p><p className="mt-1">{summary.pendingReview > 0 ? t("arqui.guidance_review", { count: summary.pendingReview }) : summary.alternativeCount > 0 ? t("arqui.guidance_alternatives", { count: summary.alternativeCount }) : summary.total === 0 ? t("arqui.guidance_empty") : t("arqui.guidance_available", { count: summary.total })}</p><p className="mt-2 text-xs text-[#52645a]">{t("arqui.guidance_basis")} {actionBasis}</p></div>
        <div className="rounded border border-[#385348]/20 bg-background p-3" aria-label={t("arqui.workflow_title")}><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.workflow_title")}</p><span className="text-xs text-muted-foreground">{workflow.unknown ? t("arqui.workflow_unknown") : t(`arqui.status_${(workflow.currentStep?.readiness ?? "UNKNOWN").toLowerCase()}`)}</span></div>{workflow.unknown ? <p className="mt-2 text-sm">{t("arqui.workflow_clarify")}</p> : <>{workflow.currentStep && <p className="mt-2 text-sm">{t(workflow.currentStep.purposeKey)} · {t(`arqui.capability_${workflow.currentStep.capabilityId.toLowerCase()}`)}</p>}{workflow.currentStep?.action && <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onNavigate(workflow.currentStep!.action!.target)}>{t(workflow.currentStep.action.labelKey)}</Button>}</>}</div>
        {capabilityAnswer && <div className="rounded border border-primary/30 bg-background p-3" aria-label={t("arqui.capability_self_knowledge")}><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.capability_self_knowledge")}</p><span className="text-xs text-muted-foreground">{capabilityKnowledge.relevant.length} {t("arqui.capabilities_available")}</span></div>{capabilityAnswer.descriptor && <div className="mt-3 grid gap-2 sm:grid-cols-3"><p className="text-sm"><strong>{t("arqui.capability_status")}</strong> {t(`arqui.availability_${capabilityAnswer.descriptor.availability.toLowerCase()}`)}</p><p className="text-sm"><strong>{t("arqui.capability_readiness")}</strong> {t(`arqui.status_${capabilityAnswer.descriptor.readiness.toLowerCase()}`)}</p><p className="text-sm"><strong>{t("arqui.capability_authority")}</strong> {t(`arqui.authority_${capabilityAnswer.descriptor.humanAuthorityLevel.toLowerCase()}`)}</p></div>}{capabilityAnswer.descriptor && <p className="mt-3 text-xs text-muted-foreground"><strong>{t("arqui.capability_limitations")}</strong> {capabilityAnswer.descriptor.limitations.join(" ")}</p>}</div>}
        {reasoning && <div className="rounded border border-[#385348]/30 bg-background p-3" aria-label={t("arqui.reasoning_title")}><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.reasoning_title")}</p><span className="text-xs text-muted-foreground">{reasoning.subject}</span></div><div className="mt-3 grid gap-3 sm:grid-cols-2">{([["FACT", reasoning.facts], ["COMPUTED", reasoning.computed], ["INTERPRETATION", reasoning.interpretations], ["HYPOTHESIS", reasoning.hypotheses], ["UNKNOWN", reasoning.unknowns]] as const).filter(([, items]) => items.length > 0).map(([kind, items]) => <div key={kind} className="rounded border border-border p-2"><p className="text-xs font-semibold">{t(`arqui.reasoning_${kind.toLowerCase()}`)}</p>{items.map((item, index) => <p key={`${kind}-${index}`} className="mt-1 text-sm text-muted-foreground">{item.text}</p>)}</div>)}</div>{reasoning.availableActions.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{reasoning.availableActions.map((action) => <Button key={action.target} type="button" variant="outline" size="sm" onClick={() => onNavigate(action.target)}>{t("arqui.reasoning_explore")}</Button>)}</div>}<p className="mt-3 text-xs text-muted-foreground">{t("arqui.reasoning_no_decision")}</p></div>}
        <div className="rounded border border-border bg-background p-3"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.work_context")}</p><p className="mt-1 text-sm font-semibold">{contextLabel}</p></div><span className="text-xs text-muted-foreground">{t("arqui.context_source")}</span></div>{workContext === "UNKNOWN" && <div className="mt-3 flex flex-wrap gap-2">{(["FIELD", "DESIGN", "ANALYSIS", "COMPARISON", "REVIEW", "PRESENTATION_AR"] as WorkContext[]).map((value) => <Button key={value} type="button" variant="outline" size="sm" onClick={() => setWorkContext(value)}>{t(`arqui.context_${value.toLowerCase()}`)}</Button>)}</div>}</div>
        <div className="rounded border border-[#385348]/20 bg-background p-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.dialogue_prompt")}</p><div className="mt-2 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void askArqui(); }} placeholder={t("arqui.dialogue_placeholder")} className="min-w-0 flex-1 rounded border border-input bg-background px-3 py-2 text-sm" aria-label={t("arqui.dialogue_placeholder")} /><Button type="button" onClick={() => void askArqui()} disabled={!question.trim()}>{t("arqui.ask")}</Button></div><div className="mt-2 flex flex-wrap gap-2">{["arqui.quick_pending", "arqui.quick_known", "arqui.quick_action", "arqui.quick_context"].map((key) => <button key={key} type="button" className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary" onClick={() => { const labels: Record<string, string> = { "arqui.quick_pending": t("arqui.quick_pending"), "arqui.quick_known": t("arqui.quick_known"), "arqui.quick_action": t("arqui.quick_action"), "arqui.quick_context": t("arqui.quick_context") }; setQuestion(labels[key]); }}>{t(key)}</button>)}</div>{dialogue && <div className="mt-3 rounded border border-[#d07b4a]/40 bg-[#fffaf5] p-3" role="status"><p className="text-sm text-[#385348]">{t(dialogue.answerKey, dialogue.answerParams)}</p><p className="mt-1 text-xs text-[#52645a]">{t("arqui.based_on")} {t(dialogue.basisKey, dialogue.answerParams)}</p>{dialogue.action && <Button type="button" className="mt-3" onClick={runDialogueAction}>{t(dialogue.action.labelKey, dialogue.action.params)}</Button>}</div>}</div>
        <ArquiControlledOperations projectId={projectId} project={context.project} onNavigate={onNavigate} />
        {diagnostics.length > 0 && <div className="rounded border border-[#d07b4a]/30 bg-[#fffaf5] p-3" aria-label={t("arqui.diagnostics_title")}><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a94524]">{t("arqui.diagnostics_title")}</p><div className="mt-2 space-y-2">{diagnostics.map((item) => <div key={item.id} className="rounded border border-[#d07b4a]/20 bg-background p-2"><p className="text-sm font-medium text-[#385348]">{t(item.messageKey, item.messageParams)}</p><p className="mt-1 text-xs text-muted-foreground">{t("arqui.based_on")} {t(item.basisKey, item.messageParams)}</p>{item.action && <Button type="button" size="sm" className="mt-2" onClick={() => onNavigate(item.action!.target)}>{t(item.action.labelKey, item.action.params)}</Button>}</div>)}</div></div>}
        <div className="rounded border border-border bg-background p-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.capabilities_title")}</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{capabilities.map((capability) => <div key={capability.id} className="rounded border border-border p-2"><div className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{t(`arqui.capability_${capability.id.toLowerCase()}`)}</span><span className="text-xs font-semibold">{t(`arqui.status_${capability.status.toLowerCase()}`)}</span></div>{capability.missingKeys.map((key) => <p key={key} className="mt-1 text-xs text-muted-foreground">{t(key)}</p>)}{capability.action && <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onNavigate(capability.action!.target)}>{t(capability.action.labelKey)}</Button>}</div>)}</div></div>
        <div className="rounded border border-[#385348]/20 bg-background p-3"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t("arqui.dialogue_prompt")}</p><div className="mt-2 flex gap-2"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void askArqui(); }} placeholder={t("arqui.dialogue_placeholder")} className="min-w-0 flex-1 rounded border border-input bg-background px-3 py-2 text-sm" aria-label={t("arqui.dialogue_placeholder")} /><Button type="button" onClick={() => void askArqui()} disabled={!question.trim()}>{t("arqui.ask")}</Button></div><div className="mt-2 flex flex-wrap gap-2">{["arqui.quick_pending", "arqui.quick_known", "arqui.quick_action", "arqui.quick_context"].map((key) => <button key={key} type="button" className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground hover:border-primary" onClick={() => { const labels: Record<string, string> = { "arqui.quick_pending": t("arqui.quick_pending"), "arqui.quick_known": t("arqui.quick_known"), "arqui.quick_action": t("arqui.quick_action"), "arqui.quick_context": t("arqui.quick_context") }; setQuestion(labels[key]); }}>{t(key)}</button>)}</div>{dialogue && <div className="mt-3 rounded border border-[#d07b4a]/40 bg-[#fffaf5] p-3" role="status"><p className="text-sm text-[#385348]">{t(dialogue.answerKey, dialogue.answerParams)}</p><p className="mt-1 text-xs text-[#52645a]">{t("arqui.based_on")} {t(dialogue.basisKey, dialogue.answerParams)}</p>{dialogue.action && <Button type="button" className="mt-3" onClick={runDialogueAction}>{t(dialogue.action.labelKey, dialogue.action.params)}</Button>}</div>}</div>
        <div className="flex flex-wrap gap-2" aria-label={t("arqui.actions_title")}>{summary.pendingReview > 0 && <Button type="button" onClick={() => openEvidence("review")}><Compass className="mr-2 h-4 w-4" />{t("arqui.review_action", { count: summary.pendingReview })}</Button>}<Button type="button" variant="outline" onClick={() => openEvidence("capture")}><Sparkles className="mr-2 h-4 w-4" />{t("arqui.photo_action")}</Button><Button type="button" variant="outline" onClick={() => onNavigate("context")}><MapPin className="mr-2 h-4 w-4" />{t("arqui.location_action")}</Button>{summary.alternativeCount > 0 && <Button type="button" variant="outline" onClick={() => onNavigate("alternatives")}><ArrowRight className="mr-2 h-4 w-4" />{t("arqui.compare_action", { count: summary.alternativeCount })}</Button>}{summary.hasAnalysis && <Button type="button" variant="outline" onClick={() => onNavigate("evaluations")}><ArrowRight className="mr-2 h-4 w-4" />{t("arqui.analysis_action")}</Button>}</div>
      </>}
    </CardContent>}
  </Card>;
}

export { evidenceState, registrationIsAvailable, countCollection };
