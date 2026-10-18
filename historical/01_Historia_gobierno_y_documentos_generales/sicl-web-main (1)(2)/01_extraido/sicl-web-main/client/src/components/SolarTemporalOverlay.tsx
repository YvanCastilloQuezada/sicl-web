import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export type SolarAnalysis = {
  example_id: string;
  analysis_type: "SOLAR";
  temporal_mode: "INSTANT";
  selected_date: string;
  selected_time: string;
  location: { name: string; latitude: number; longitude: number; timezone: string; role: string; location_class: string; provenance: string; surveyed_site: boolean; cadastral_location: boolean; verified_upao_site: boolean };
  analyses: Array<{ alternative_id: string; local_timestamp: string; derived_metrics: { solar_azimuth_degrees: number; solar_elevation_degrees: number; solar_vector_local_enu: [number, number, number] }; source_values: Record<string, number>; units: Record<string, string> }>;
  source_data_disclaimer: string;
  educational_disclaimer: string;
  decision_created: boolean;
};

type CapabilityResolution = { capability_id: string; spatial_scope: string; status: "AVAILABLE" | "REQUIRES_DATA" | "NOT_AVAILABLE" | "NOT_APPLICABLE"; reason: string; required_data: string[]; missing_data: string[]; profile_version: string };

type Props = { selectedAlternativeId: string | null; onAnalysisChange: (analysis: SolarAnalysis | null) => void };

function todayLocal(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function hourNow(): string {
  const hour = Math.min(18, Math.max(6, new Date().getHours()));
  return `${String(hour).padStart(2, "0")}:00`;
}

export default function SolarTemporalOverlay({ selectedAlternativeId, onAnalysisChange }: Props) {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(todayLocal);
  const [selectedTime, setSelectedTime] = useState(hourNow);
  const [playing, setPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<SolarAnalysis | null>(null);
  const [capability, setCapability] = useState<CapabilityResolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setError(null);
      try {
        const response = await fetch(`/api/core/v1/examples/UPAO-001/environmental-analysis?selected_date=${encodeURIComponent(selectedDate)}&selected_time=${encodeURIComponent(selectedTime)}`, { headers: { accept: "application/json" } });
        const body = await response.json();
        if (!response.ok) throw new Error(body?.error?.message ?? body?.message ?? t("solar.sourceUnavailable"));
        if (!cancelled) { setAnalysis(body.data); onAnalysisChange(body.data); }
      } catch (cause) {
        if (!cancelled) { setAnalysis(null); onAnalysisChange(null); setError(cause instanceof Error ? cause.message : t("solar.sourceUnavailable")); }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [selectedDate, selectedTime, onAnalysisChange, t]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/core/v1/examples/UPAO-001/capabilities/SOLAR_TEMPORAL_ANALYSIS?spatial_scope=edificacion", { headers: { accept: "application/json" } })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body?.detail?.message ?? body?.message ?? t("solar.capabilityUnavailable"));
        return body.data as CapabilityResolution;
      })
      .then((value) => { if (!cancelled) setCapability(value); })
      .catch(() => { if (!cancelled) setCapability(null); });
    return () => { cancelled = true; };
  }, [t]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setSelectedTime((current) => {
        const next = Number(current.slice(0, 2)) + 1;
        if (next > 18) { setPlaying(false); return "18:00"; }
        return `${String(next).padStart(2, "0")}:00`;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [playing]);

  const selected = useMemo(() => analysis?.analyses.find((item) => item.alternative_id === selectedAlternativeId) ?? analysis?.analyses[0], [analysis, selectedAlternativeId]);
  const azimuth = selected?.derived_metrics.solar_azimuth_degrees ?? 0;
  const elevation = selected?.derived_metrics.solar_elevation_degrees ?? 0;
  const arrow = 100 + Math.sin((azimuth * Math.PI) / 180) * 70;
  const arrowY = 100 - Math.cos((azimuth * Math.PI) / 180) * 70;

  return <section className="mb-6 rounded-lg border border-amber-400/50 bg-card p-4 text-card-foreground" aria-label={t("solar.title")}>
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-600">{t("solar.layer")}</p><h2 className="mt-1 text-lg font-semibold">{t("solar.title")}</h2><p className="mt-1 max-w-3xl text-sm text-muted-foreground">{t("solar.description")}</p></div>
      <span className="rounded-full border border-amber-400/50 px-3 py-1 text-xs font-semibold text-amber-700">{t("solar.educational")}</span>
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
      <div className="flex flex-wrap items-end gap-3"><label className="grid gap-1 text-xs font-semibold"><span>{t("solar.date")}</span><input aria-label={t("solar.date")} type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} className="rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground" /></label><label className="grid gap-1 text-xs font-semibold"><span>{t("solar.time")}</span><input aria-label={t("solar.time")} type="time" step={3600} min="06:00" max="18:00" value={selectedTime} onChange={(event) => setSelectedTime(event.target.value.slice(0, 2) + ":00")} className="rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground" /></label></div>
      <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setPlaying((value) => !value)} className="rounded border border-border px-3 py-1.5 text-sm font-semibold text-foreground">{playing ? t("solar.pause") : t("solar.play")}</button><button type="button" onClick={() => setSelectedTime((current) => `${String(Math.min(18, Number(current.slice(0, 2)) + 1)).padStart(2, "0")}:00`)} className="rounded border border-border px-3 py-1.5 text-sm font-semibold text-foreground">{t("solar.step")}</button><span className="text-sm text-muted-foreground">{selectedDate} · {selectedTime} · {analysis?.location.timezone ?? "America/Lima"}</span></div>
      <div className="flex items-center gap-3" aria-label={t("solar.direction")}><svg viewBox="0 0 200 125" className="h-24 w-40 rounded border border-border bg-slate-950" role="img" aria-label={`${t("solar.direction")}: ${azimuth.toFixed(1)}°`}><circle cx="100" cy="100" r="52" fill="none" stroke="#64748b" strokeDasharray="3 4" /><text x="100" y="18" textAnchor="middle" fill="#e2e8f0" fontSize="12">N</text><line x1="100" y1="100" x2={arrow} y2={arrowY} stroke="#fbbf24" strokeWidth="5" /><circle cx={arrow} cy={arrowY} r="6" fill="#fbbf24" /></svg><dl className="text-xs"><dt className="font-semibold">{t("solar.azimuth")}</dt><dd>{azimuth.toFixed(1)}°</dd><dt className="mt-1 font-semibold">{t("solar.elevation")}</dt><dd>{elevation.toFixed(1)}°</dd></dl></div>
    </div>
    {capability && <div className="mt-3 flex flex-wrap items-center gap-2 text-xs"><strong>{t("solar.capability")}</strong><span className="rounded-full border border-border px-2 py-1 font-semibold">{t(`solar.capabilityStates.${capability.status}`)}</span><span className="text-muted-foreground">{capability.reason}</span></div>}
    {error ? <div role="alert" className="mt-3 rounded border border-destructive/60 bg-destructive/10 p-3 text-sm text-destructive">{t("solar.unavailable")} {error}</div> : analysis ? <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-3"><p><strong className="text-foreground">{t("solar.environmentalReference")}</strong> {analysis.location.name}</p><p><strong className="text-foreground">{t("solar.sourceData")}</strong> Open-Meteo · {Object.entries(selected?.source_values ?? {}).map(([key, value]) => `${key}: ${value}`).join(" · ")}</p><p><strong className="text-foreground">{t("solar.disclosure")}</strong> {t("solar.proxyDisclosure")}</p></div> : null}
  </section>;
}
