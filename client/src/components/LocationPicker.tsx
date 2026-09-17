import { useEffect, useState } from "react";
import { MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiErrorMessage, siclClient, type MissingDataReport, type SpatialLocation } from "@/api/sicl-client";

type Props = { projectId?: string };

export default function LocationPicker({ projectId }: Props) {
  const { t } = useTranslation();
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [label, setLabel] = useState("");
  const [candidate, setCandidate] = useState<{ longitude: number; latitude: number }>();
  const [location, setLocation] = useState<SpatialLocation>();
  const [missing, setMissing] = useState<MissingDataReport>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const refresh = async () => {
    if (!projectId) return;
    try {
      const [current, report] = await Promise.all([siclClient.currentLocation(projectId), siclClient.missingData(projectId, "parcela_sitio")]);
      setLocation(current ?? undefined);
      setMissing(report);
      if (current?.longitude != null && current?.latitude != null) {
        setLongitude(String(current.longitude)); setLatitude(String(current.latitude));
      }
    } catch (err) { setError(apiErrorMessage(err)); }
  };
  useEffect(() => { void refresh(); }, [projectId]);
  const preview = () => {
    const lon = Number(longitude); const lat = Number(latitude);
    if (!Number.isFinite(lon) || !Number.isFinite(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) { setError(t("location.invalid_coordinates")); return; }
    setError(""); setMessage(""); setCandidate({ longitude: lon, latitude: lat });
  };
  const confirm = async () => {
    if (!projectId || !candidate) return;
    setBusy(true); setError("");
    try { await siclClient.confirmLocation(projectId, { longitude: candidate.longitude, latitude: candidate.latitude, place_label: label || undefined }); setCandidate(undefined); setMessage(t("location.confirmed")); await refresh(); }
    catch (err) { setError(apiErrorMessage(err)); } finally { setBusy(false); }
  };
  return <Card className="mt-5 border-border bg-card shadow-none"><CardHeader><div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /><div><CardTitle className="font-serif text-xl">{t("location.title")}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{t("location.description")}</p></div></div></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 md:grid-cols-3"><div><Label>{t("location.longitude")}</Label><Input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="-79.028" className="mt-1 bg-background" /></div><div><Label>{t("location.latitude")}</Label><Input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="-8.111" className="mt-1 bg-background" /></div><div><Label>{t("location.label")}</Label><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder={t("location.label_placeholder")} className="mt-1 bg-background" /></div></div><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={preview}><MapPin className="mr-2 h-4 w-4" />{t("location.preview")}</Button>{candidate && <Button type="button" onClick={confirm} disabled={busy}><CheckCircle2 className="mr-2 h-4 w-4" />{busy ? t("location.saving") : t("location.confirm")}</Button>}</div>{candidate && <div className="border border-amber-500/60 bg-amber-50 p-3 text-sm text-amber-950"><strong>{t("location.preview_title")}</strong><p>{candidate.longitude}, {candidate.latitude}. {t("location.preview_note")}</p></div>}{location && <div className="flex items-start gap-3 border border-emerald-600/40 bg-emerald-50 p-3 text-sm text-emerald-950"><CheckCircle2 className="mt-0.5 h-4 w-4" /><span><strong>{t("location.current")}</strong> {location.place_label || `${location.longitude}, ${location.latitude}`} · {location.status}</span></div>}{missing && <div className="border border-border bg-background p-3 text-sm"><p className="font-semibold">{t("location.missing_title")}</p><p className="mt-1 text-muted-foreground">{t("location.missing_summary", { count: missing.variables.filter((item) => item.state === "MISSING").length })}</p><div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><AlertTriangle className="h-3.5 w-3.5" />{t("location.human_authority")}</div></div>}{message && <p role="status" className="text-sm text-emerald-700">{message}</p>}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</CardContent></Card>;
}
