import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, MapPin, Navigation, Paperclip, Pin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiErrorMessage, siclClient } from "@/api/sicl-client";

const SCOPES = ["edificacion", "parcela_sitio", "zona_barrio_sector", "distrito_ciudad", "provincia_metropoli"];
type Capture = { file: File; preview: string; capturedAt: string };
type Props = { projectId: string; onCaptured?: () => void };

export default function FieldCapturePanel({ projectId, onCaptured }: Props) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [capture, setCapture] = useState<Capture>();
  const [scope, setScope] = useState("edificacion");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number; crs: string }>();
  const [locationState, setLocationState] = useState<"UNKNOWN" | "AVAILABLE" | "DENIED">("UNKNOWN");
  const [pointMode, setPointMode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const requestLocation = () => {
    if (!navigator.geolocation) { setLocationState("UNKNOWN"); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, crs: "EPSG:4326" }); setLocationState("AVAILABLE"); },
      () => { setLocationState("DENIED"); },
      { enableHighAccuracy: false, maximumAge: 30_000, timeout: 8_000 },
    );
  };
  const chooseFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCapture({ file, preview: URL.createObjectURL(file), capturedAt: new Date().toISOString() });
    setMessage(""); setError(""); requestLocation();
  };
  const useCurrentLocation = () => { setError(""); requestLocation(); };
  const confirm = async () => {
    if (!capture && !note.trim()) { setError(t("field_capture.pending")); return; }
    setBusy(true); setError(""); setMessage("");
    try {
      const captureId = `CAP-${Date.now().toString(36).toUpperCase()}`;
      await siclClient.createSpatialEvidence(projectId, {
        evidence_id: captureId,
        statement: note.trim() || t("field_capture.photo"),
        evidence_type: capture ? "PHOTO" : "OBSERVATION",
        evidence_url: capture ? `local-capture://${captureId}/${encodeURIComponent(capture.file.name)}` : undefined,
        photo_reference: capture ? capture.file.name : undefined,
        spatial_scope: scope,
        observation_type: capture ? "FIELD_PHOTO" : "MANUAL_OBSERVATION",
        epistemic_state: "USER_PROVIDED",
        evidence_state: "OBSERVED",
        captured_at: capture?.capturedAt || new Date().toISOString(),
        observation_point: location || null,
        photo_direction: null,
        qualifier: "UNKNOWN",
        actor: "field-architect",
        source_kind: "USER / FIELD_CAPTURE",
        unknowns: ["photo_direction", ...(location ? [] : ["observation_point"])],
      });
      if (capture) URL.revokeObjectURL(capture.preview);
      setCapture(undefined); setNote(""); setMessage(t("field_capture.captured")); onCaptured?.();
    } catch (err) { setError(apiErrorMessage(err)); } finally { setBusy(false); }
  };
  const pointX = location ? (location.longitude + 180) / 360 * 720 : 360;
  const pointY = location ? (90 - location.latitude) / 180 * 220 : 110;

  return <Card className="border-primary/30 bg-card shadow-sm" aria-label={t("field_capture.title")}>
    <CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="font-serif text-2xl">{t("field_capture.title")}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{t("field_capture.description")}</p></div><Camera className="h-6 w-6 text-primary" /></div></CardHeader>
    <CardContent className="space-y-4">
      <div className="lg:grid lg:grid-cols-[minmax(150px,0.72fr)_minmax(280px,1.55fr)_minmax(190px,0.83fr)] lg:items-start lg:gap-4">
        <aside className="order-2 mt-4 space-y-3 lg:order-1 lg:mt-0" aria-label={t("field_capture.scope")}>
          <div><Label>{t("field_capture.scope")}</Label><Select value={scope} onValueChange={setScope}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{SCOPES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
          <div className="rounded-lg border border-border bg-background p-3 text-xs text-muted-foreground"><div className="flex items-center gap-2"><MapPin className="h-4 w-4" />{locationState === "AVAILABLE" ? t("field_capture.point_ready") : locationState === "DENIED" ? t("field_capture.location_denied") : t("field_capture.unknown")}</div>{location && <p className="mt-2">{location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}{location.accuracy ? ` ±${Math.round(location.accuracy)} m` : ""}</p>}</div>
          <Button type="button" variant="outline" className="min-h-11 w-full" onClick={useCurrentLocation}><Navigation className="mr-2 h-4 w-4" />{t("field_capture.use_location")}</Button>
        </aside>

        <div className="order-1 min-w-0 lg:order-2" aria-label={t("field_capture.photo")}>
          <div className="flex min-h-52 items-center justify-center overflow-hidden rounded-xl border border-border bg-slate-950 sm:min-h-64 lg:min-h-80">
            {capture ? <div className="relative flex h-full w-full items-center justify-center"><img src={capture.preview} alt={t("field_capture.photo")} className="max-h-80 w-full object-contain" /><button type="button" aria-label={t("common.cancel")} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white" onClick={() => { URL.revokeObjectURL(capture.preview); setCapture(undefined); }}><X className="h-4 w-4" /></button></div> : <div className="p-6 text-center text-sm text-slate-200"><Camera className="mx-auto mb-3 h-9 w-9 text-sky-300" /><p>{t("field_capture.camera_hint")}</p></div>}
          </div>
          {pointMode && <div className="mt-3 overflow-hidden rounded-xl border border-border bg-slate-950"><svg viewBox="0 0 720 220" className="block h-40 w-full cursor-crosshair" role="img" aria-label={t("field_capture.place_point")} onClick={(event) => { const rect = event.currentTarget.getBoundingClientRect(); const x = ((event.clientX - rect.left) / rect.width) * 720; const y = ((event.clientY - rect.top) / rect.height) * 220; setLocation({ longitude: Number((-180 + (x / 720) * 360).toFixed(6)), latitude: Number((90 - (y / 220) * 180).toFixed(6)), crs: "EPSG:4326" }); setLocationState("AVAILABLE"); setPointMode(false); }}><rect width="720" height="220" fill="#0f2742" /><path d="M40 150 C140 70 220 170 330 90 S500 80 680 125" fill="none" stroke="#4f7894" strokeWidth="3" /><text x="16" y="24" fill="#d7e9f5" fontSize="12">EPSG:4326</text><circle cx={pointX} cy={pointY} r="9" fill="#fbbf24" stroke="#111827" strokeWidth="3" /></svg></div>}
        </div>

        <section className="order-3 mt-4 space-y-3 lg:mt-0" aria-label={t("field_capture.confirm")}>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1"><Button type="button" className="min-h-11" onClick={() => inputRef.current?.click()}><Camera className="mr-2 h-4 w-4" />{t("field_capture.take_photo")}</Button><Button type="button" variant="outline" className="min-h-11" onClick={() => inputRef.current?.click()}><Paperclip className="mr-2 h-4 w-4" />{t("field_capture.select_photo")}</Button><input ref={inputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => chooseFile(event.target.files?.[0])} /></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1"><Button type="button" variant="outline" className="min-h-11" onClick={() => setPointMode((value) => !value)}><Pin className="mr-2 h-4 w-4" />{t("field_capture.place_point")}</Button><Button type="button" variant="outline" className="min-h-11" onClick={() => document.getElementById("field-observation")?.focus()}><MapPin className="mr-2 h-4 w-4" />{t("field_capture.observation")}</Button></div>
          <div><Label>{t("field_capture.note")}</Label><Textarea id="field-observation" value={note} onChange={(event) => setNote(event.target.value)} placeholder={t("field_capture.note_placeholder")} className="mt-1 min-h-20" /></div>
          <Button type="button" disabled={busy || (!capture && !note.trim())} onClick={confirm} className="min-h-12 w-full"><CheckCircle2 className="mr-2 h-4 w-4" />{busy ? t("field_capture.pending") : t("field_capture.confirm")}</Button>
        </section>
      </div>
      <p className="text-xs text-muted-foreground">{t("field_capture.camera_hint")}</p>
      {message && <p role="status" className="border border-emerald-600/30 bg-emerald-50 p-3 text-sm text-emerald-950">{message}</p>}{error && <p role="alert" className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    </CardContent>
  </Card>;
}
