import React, { useRef, useState } from "react";
import { Camera, CheckCircle2, MapPin, Navigation, Paperclip, X } from "lucide-react";
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
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const chooseFile = (file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCapture({ file, preview: URL.createObjectURL(file), capturedAt: new Date().toISOString() });
    setMessage(""); setError("");
  };
  const useCurrentLocation = () => {
    setError("");
    if (!navigator.geolocation) { setLocationState("UNKNOWN"); setError(t("field_capture.location_denied")); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => { setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, crs: "EPSG:4326" }); setLocationState("AVAILABLE"); },
      () => { setLocation(undefined); setLocationState("DENIED"); setError(t("field_capture.location_denied")); },
      { enableHighAccuracy: false, maximumAge: 30_000, timeout: 8_000 },
    );
  };
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
      setCapture(undefined); setNote(""); setMessage(t("field_capture.captured")); onCaptured?.();
    } catch (err) { setError(apiErrorMessage(err)); } finally { setBusy(false); }
  };
  return <Card className="border-primary/30 bg-card shadow-sm" aria-label={t("field_capture.title")}>
    <CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div><CardTitle className="font-serif text-2xl">{t("field_capture.title")}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{t("field_capture.description")}</p></div><Camera className="h-6 w-6 text-primary" /></div></CardHeader>
    <CardContent className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2">
        <Button type="button" className="min-h-12" onClick={() => inputRef.current?.click()}><Camera className="mr-2 h-4 w-4" />{t("field_capture.take_photo")}</Button>
        <Button type="button" variant="outline" className="min-h-12" onClick={() => inputRef.current?.click()}><Paperclip className="mr-2 h-4 w-4" />{t("field_capture.select_photo")}</Button>
        <input ref={inputRef} className="hidden" type="file" accept="image/*" capture="environment" onChange={(event) => chooseFile(event.target.files?.[0])} />
      </div>
      {capture && <div className="relative overflow-hidden rounded-xl border border-border bg-slate-950"><img src={capture.preview} alt={t("field_capture.photo")} className="max-h-64 w-full object-contain" /><button type="button" aria-label={t("common.cancel")} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white" onClick={() => { URL.revokeObjectURL(capture.preview); setCapture(undefined); }}><X className="h-4 w-4" /></button></div>}
      <div className="grid gap-3 sm:grid-cols-2"><div><Label>{t("field_capture.scope")}</Label><Select value={scope} onValueChange={setScope}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{SCOPES.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div><div className="flex items-end"><Button type="button" variant="outline" className="w-full" onClick={useCurrentLocation}><Navigation className="mr-2 h-4 w-4" />{t("field_capture.use_location")}</Button></div></div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-4 w-4" />{locationState === "AVAILABLE" ? `${location?.latitude.toFixed(5)}, ${location?.longitude.toFixed(5)} ±${Math.round(location?.accuracy || 0)} m` : locationState === "DENIED" ? t("field_capture.location_denied") : t("field_capture.unknown")}</div>
      <div><Label>{t("field_capture.note")}</Label><Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder={t("field_capture.note_placeholder")} className="mt-1 min-h-20" /></div>
      <p className="text-xs text-muted-foreground">{t("field_capture.camera_hint")}</p>
      <Button type="button" disabled={busy || (!capture && !note.trim())} onClick={confirm} className="min-h-12 w-full"><CheckCircle2 className="mr-2 h-4 w-4" />{busy ? t("field_capture.pending") : t("field_capture.confirm")}</Button>
      {message && <p role="status" className="border border-emerald-600/30 bg-emerald-50 p-3 text-sm text-emerald-950">{message}</p>}{error && <p role="alert" className="border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
    </CardContent>
  </Card>;
}
