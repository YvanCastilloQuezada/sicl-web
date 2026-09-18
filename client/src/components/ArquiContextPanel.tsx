import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Compass, MapPin, RefreshCw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiErrorMessage, siclClient, type Evidence, type SpatialRegistration } from "@/api/sicl-client";
import ArquiAvatar from "@/components/ArquiAvatar";

type Props = { projectId: string; onNavigate: (target: string) => void };
type ContextState = {
  projectId: string;
  evidence: Evidence[];
  registrations: SpatialRegistration[];
};

function evidenceState(item: Evidence): string {
  return String(item.epistemic_state ?? item.evidence_state ?? item.state ?? "").toUpperCase();
}

function registrationIsAvailable(item: SpatialRegistration): boolean {
  return ["LOCKED", "CONFIRMED", "REGISTERED", "AVAILABLE"].includes(String(item.status).toUpperCase());
}

export default function ArquiContextPanel({ projectId, onNavigate }: Props) {
  const { t } = useTranslation();
  const [context, setContext] = useState<ContextState>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(true);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError("");
    try {
      const [evidence, registrationData] = await Promise.all([
        siclClient.listEvidence(projectId),
        siclClient.listSpatialRegistrations(projectId),
      ]);
      setContext({ projectId, evidence, registrations: registrationData.registrations ?? [] });
    } catch (err) {
      setContext(undefined);
      setError(apiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { void refresh(); }, [refresh]);

  const summary = useMemo(() => {
    const evidence = context?.evidence ?? [];
    const registrations = context?.registrations ?? [];
    const pendingReview = evidence.filter((item) => evidenceState(item) === "AI_PROPOSED");
    const confirmed = evidence.filter((item) => ["HUMAN_CONFIRMED", "HUMAN_CORRECTED", "OBSERVED"].includes(evidenceState(item)));
    const photos = evidence.filter((item) => String(item.evidence_type ?? "").toUpperCase() === "PHOTO" || Boolean(item.media_id));
    const locationRegistered = registrations.some(registrationIsAvailable);
    return { total: evidence.length, photos: photos.length, confirmed: confirmed.length, pendingReview: pendingReview.length, locationRegistered };
  }, [context]);

  const openEvidence = (focus?: "review" | "capture") => {
    onNavigate("evidence");
    if (focus) window.setTimeout(() => window.dispatchEvent(new CustomEvent(`sims-dei:field-${focus}`)), 0);
  };

  const state = error ? "unknown" : summary.pendingReview > 0 ? "attention" : "ready";
  return <Card className="border-[#385348]/30 bg-card shadow-sm" aria-label={t("arqui.title")}>
    <CardHeader className="pb-3"><div className="flex items-center gap-3"><ArquiAvatar state={state} /><div className="min-w-0 flex-1"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d07b4a]"><Sparkles className="h-4 w-4" />{t("arqui.eyebrow")}</p><CardTitle className="mt-1 font-serif text-2xl">{t("arqui.title")}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{t("arqui.assistant_label")}</p></div><div className="flex items-center gap-2"><Button type="button" variant="outline" size="sm" onClick={() => void refresh()} disabled={loading} aria-label={t("arqui.refresh")}><RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{t("arqui.refresh")}</Button><Button type="button" variant="ghost" size="icon" onClick={() => setExpanded((value) => !value)} aria-label={expanded ? t("arqui.collapse") : t("arqui.expand")} aria-expanded={expanded}>{expanded ? <ChevronUp /> : <ChevronDown />}</Button></div></div></CardHeader>
    {expanded && <CardContent className="space-y-4">
      {loading && <p role="status" className="text-sm text-muted-foreground">{t("arqui.loading")}</p>}
      {error && <div className="flex items-center justify-between gap-3 rounded border border-destructive/30 bg-destructive/10 p-3 text-sm"><span>{t("arqui.unavailable")}</span><Button type="button" variant="outline" size="sm" onClick={() => void refresh()}>{t("arqui.retry")}</Button></div>}
      {!loading && !error && context && <>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.location")}</p><p className="mt-1 text-sm font-semibold">{summary.locationRegistered ? t("arqui.registered") : t("arqui.not_registered")}</p></div>
          <div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.photos")}</p><p className="mt-1 text-sm font-semibold">{summary.photos}</p></div>
          <div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.confirmed")}</p><p className="mt-1 text-sm font-semibold">{summary.confirmed}</p></div>
          <div className="rounded border border-border bg-background p-3"><p className="text-xs text-muted-foreground">{t("arqui.pending")}</p><p className="mt-1 text-sm font-semibold">{summary.pendingReview}</p></div>
        </div>
        <div className="rounded border border-[#d07b4a]/40 bg-[#fffaf5] p-4 text-sm text-[#385348]"><p className="font-semibold">{t("arqui.guidance_title")}</p><p className="mt-1">{summary.pendingReview > 0 ? t("arqui.guidance_review", { count: summary.pendingReview }) : summary.total === 0 ? t("arqui.guidance_empty") : t("arqui.guidance_available", { count: summary.total })}</p><p className="mt-2 text-xs text-[#52645a]">{t("arqui.guidance_basis")}</p></div>
        <div className="flex flex-wrap gap-2" aria-label={t("arqui.actions_title")}>
          {summary.pendingReview > 0 && <Button type="button" onClick={() => openEvidence("review")}><Compass className="mr-2 h-4 w-4" />{t("arqui.review_action", { count: summary.pendingReview })}</Button>}
          <Button type="button" variant="outline" onClick={() => openEvidence("capture")}><Sparkles className="mr-2 h-4 w-4" />{t("arqui.photo_action")}</Button>
          <Button type="button" variant="outline" onClick={() => onNavigate("context")}><MapPin className="mr-2 h-4 w-4" />{t("arqui.location_action")}</Button>
        </div>
      </>}
    </CardContent>}
  </Card>;
}

export { evidenceState, registrationIsAvailable };
