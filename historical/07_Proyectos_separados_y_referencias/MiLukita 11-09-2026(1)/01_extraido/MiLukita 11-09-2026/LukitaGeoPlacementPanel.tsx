import { useEffect, useRef, useState } from "react";
import { MapPin, LocateFixed, LockKeyhole, RotateCcw, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapView } from "@/components/Map";
import { validateGeoDraft } from "../../../shared/lukitaGeoPlacement";

type SceneType = "AR_LUKITA" | "AR_KIKO" | "TV_COMPANION";
type Visibility = "PRIVATE" | "UNLISTED" | "PUBLIC_REVIEW";
type Draft = { name: string; type: SceneType; lat: number | null; lng: number | null; height: number; scale: number; orientation: number; lighting: "NEUTRAL" | "STUDIO" | "AMBIENT"; interaction: "IDLE" | "PHOTO" | "VIDEO"; visibility: Visibility };
type SavedScene = Draft & { version: number; savedAt: number; reviewState: "LOCAL_DRAFT" | "HUMAN_REVIEW_REQUIRED" };

const SCENES: Record<SceneType, { label: string; description: string }> = {
  AR_LUKITA: { label: "Lukita protagonista", description: "Presencia principal para foto, video y saludo contextual." },
  AR_KIKO: { label: "Kiko compañero", description: "Mascota visual de apoyo para escenas breves y familiares." },
  TV_COMPANION: { label: "Compañero de TV", description: "Avatar de apoyo para orientar la transición TV → celular." },
};

const initialDraft: Draft = { name: "", type: "AR_LUKITA", lat: null, lng: null, height: 1.65, scale: 1, orientation: 0, lighting: "AMBIENT", interaction: "PHOTO", visibility: "PRIVATE" };
const SCENE_STORAGE_KEY = "milukita-geo-scenes-v1";
function loadSavedScenes(): SavedScene[] {
  try {
    const value = JSON.parse(localStorage.getItem(SCENE_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? (value as SavedScene[]).slice(0, 20) : [];
  } catch {
    return [];
  }
}

export default function LukitaGeoPlacementPanel() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [draft, setDraft] = useState<Draft>(initialDraft);
  const [saved, setSaved] = useState<SavedScene[]>([]);
  useEffect(() => {
    setSaved(loadSavedScenes());
  }, []);
  const [notice, setNotice] = useState("Borrador local: todavía no publicado");
  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const placeMarker = (lat: number, lng: number) => {
    setDraft((current) => ({ ...current, lat, lng }));
    if (markerRef.current) markerRef.current.setMap(null);
    if (mapRef.current && window.google?.maps) markerRef.current = new google.maps.Marker({ map: mapRef.current, position: { lat, lng }, title: "Borrador local de escena Lukita" });
  };
  const locate = () => {
    if (!navigator.geolocation) { setNotice("Este navegador no expone geolocalización; selecciona un punto directamente en el mapa."); return; }
    setNotice("Solicitando ubicación del dispositivo…");
    navigator.geolocation.getCurrentPosition((position) => { const point = { lat: position.coords.latitude, lng: position.coords.longitude }; mapRef.current?.panTo(point); mapRef.current?.setZoom(16); placeMarker(point.lat, point.lng); setNotice("Ubicación capturada localmente; aún es un borrador privado."); }, () => setNotice("No se obtuvo ubicación. Puedes elegir un punto manualmente en el mapa."), { enableHighAccuracy: false, timeout: 8000 });
  };
  const saveDraft = () => { const validation = validateGeoDraft({ name: draft.name, type: draft.type, latitude: draft.lat, longitude: draft.lng, heightMeters: draft.height, scale: draft.scale, orientationDegrees: draft.orientation, visibility: draft.visibility }); if (!validation.canSaveLocalDraft) { setNotice(validation.reason === "LOCATION_REQUIRED" ? "Selecciona una ubicación antes de guardar el borrador." : validation.reason === "INVALID_DIMENSIONS" ? "Revisa altura y escala antes de guardar." : "La ubicación no es válida."); return; } const nextVersion = (saved.filter(scene => scene.name === draft.name).reduce((max, scene) => Math.max(max, scene.version), 0) ?? 0) + 1; const nextScene: SavedScene = { ...draft, version: nextVersion, savedAt: Date.now(), reviewState: "LOCAL_DRAFT" }; setSaved(current => { const next = [nextScene, ...current].slice(0, 20); localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(next)); return next; }); setNotice(`Escena guardada como versión ${nextVersion}; publicación bloqueada.`); };
  const requestReview = (index: number) => { setSaved(current => { const next = current.map((scene, sceneIndex) => sceneIndex === index ? { ...scene, reviewState: "HUMAN_REVIEW_REQUIRED" as const } : scene); localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(next)); return next; }); setNotice("Solicitud de revisión humana registrada localmente; no se publicó la escena."); };
  const restoreScene = (scene: SavedScene) => { const { version: _version, savedAt: _savedAt, reviewState: _reviewState, ...restored } = scene; setDraft(restored); if (scene.lat != null && scene.lng != null) placeMarker(scene.lat, scene.lng); setNotice(`Versión ${scene.version} restaurada como borrador local.`); };
  return <section className="mt-6 border border-cyan-200/20 bg-cyan-200/[.04] p-5" aria-labelledby="lukita-geo-title">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-200">Spatial / AR Control</p><h2 id="lukita-geo-title" className="mt-2 font-display text-2xl text-white">Mapa de escenas Lukita</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Prepara lugares y comportamientos visuales. La ubicación y configuración se mantienen en este navegador; no se publica ni modifica MJP CORE.</p></div><Badge className="border border-amber-200/20 bg-amber-200/10 text-amber-100"><LockKeyhole className="mr-2 h-3.5 w-3.5" /> Solo borrador local</Badge></div>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]"><div className="min-h-[360px] overflow-hidden border border-white/10 bg-black/20"><MapView className="h-[360px]" initialCenter={{ lat: -12.0464, lng: -77.0428 }} initialZoom={12} onMapReady={(map) => { mapRef.current = map; map.addListener("click", (event: google.maps.MapMouseEvent) => { if (event.latLng) placeMarker(event.latLng.lat(), event.latLng.lng()); }); }} /></div><div className="space-y-3"><div className="flex gap-2"><Button type="button" onClick={locate} className="border border-cyan-200/30 bg-cyan-200/10 text-cyan-50 hover:bg-cyan-200/20"><LocateFixed className="mr-2 h-4 w-4" /> Usar mi ubicación</Button><Button type="button" variant="outline" onClick={() => { setDraft(initialDraft); markerRef.current?.setMap(null); setNotice("Borrador restablecido."); }} className="border-white/15 bg-white/5 text-white hover:bg-white/10"><RotateCcw className="mr-2 h-4 w-4" /> Restablecer</Button></div><input value={draft.name} onChange={(event) => setField("name", event.target.value)} placeholder="Nombre del lugar o escena" aria-label="Nombre del lugar o escena" className="w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-slate-500" /><select value={draft.type} onChange={(event) => setField("type", event.target.value as SceneType)} aria-label="Tipo de MiLukita" className="w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white">{Object.entries(SCENES).map(([value, scene]) => <option key={value} value={value}>{scene.label}</option>)}</select><p className="text-xs leading-5 text-slate-400">{SCENES[draft.type].description}</p><div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-400">Altura (m)<input type="number" min="0.2" max="8" step="0.05" value={draft.height} onChange={(event) => setField("height", Number(event.target.value))} className="mt-1 w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" /></label><label className="text-xs text-slate-400">Escala<input type="number" min="0.1" max="4" step="0.05" value={draft.scale} onChange={(event) => setField("scale", Number(event.target.value))} className="mt-1 w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" /></label><label className="text-xs text-slate-400">Orientación (°)<input type="number" min="-180" max="180" step="5" value={draft.orientation} onChange={(event) => setField("orientation", Number(event.target.value))} className="mt-1 w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white" /></label><label className="text-xs text-slate-400">Iluminación<select value={draft.lighting} onChange={(event) => setField("lighting", event.target.value as Draft["lighting"])} className="mt-1 w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"><option value="AMBIENT">Entorno</option><option value="NEUTRAL">Neutra</option><option value="STUDIO">Estudio</option></select></label></div><div className="grid grid-cols-2 gap-3"><label className="text-xs text-slate-400">Interacción<select value={draft.interaction} onChange={(event) => setField("interaction", event.target.value as Draft["interaction"])} className="mt-1 w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"><option value="PHOTO">Foto</option><option value="VIDEO">Video</option><option value="IDLE">Solo presencia</option></select></label><label className="text-xs text-slate-400">Privacidad<select value={draft.visibility} onChange={(event) => setField("visibility", event.target.value as Visibility)} className="mt-1 w-full border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"><option value="PRIVATE">Privado</option><option value="UNLISTED">No listado</option><option value="PUBLIC_REVIEW">Público · requiere revisión</option></select></label></div><Button type="button" onClick={saveDraft} className="w-full gold-button"><Save className="mr-2 h-4 w-4" /> Guardar borrador local</Button><p className="flex items-center gap-2 text-xs text-amber-100" role="status" aria-live="polite"><Sparkles className="h-3.5 w-3.5" />{notice}</p>{draft.lat != null ? <p className="text-xs text-slate-500">Coordenadas: {draft.lat.toFixed(5)}, {draft.lng?.toFixed(5)}</p> : null}</div></div>
    {saved.length ? <div className="mt-5 border-t border-white/10 pt-4"><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Borradores versionados ({saved.length})</p><div className="mt-2 grid gap-2 sm:grid-cols-2">{saved.map((scene, index) => <div key={`${scene.name}-${scene.version}-${index}`} className="border border-white/10 bg-black/20 p-3 text-xs"><p className="font-bold text-white">{scene.name || "Escena sin nombre"} <span className="text-cyan-200">v{scene.version}</span></p><p className="mt-1 text-slate-400">{SCENES[scene.type].label} · {scene.height} m · escala {scene.scale}</p><p className="mt-1 text-amber-100">{scene.reviewState === "HUMAN_REVIEW_REQUIRED" ? "Revisión humana requerida" : "Borrador local"} · {scene.visibility === "PUBLIC_REVIEW" ? "intención pública" : "privado"}</p><div className="mt-2 flex flex-wrap gap-2"><Button type="button" size="sm" variant="outline" onClick={() => restoreScene(scene)} className="border-white/15 bg-white/5 text-white">Restaurar v{scene.version}</Button>{scene.reviewState !== "HUMAN_REVIEW_REQUIRED" ? <Button type="button" size="sm" onClick={() => requestReview(index)} className="border border-amber-200/30 bg-amber-200/10 text-amber-50">Solicitar revisión</Button> : null}</div></div>)}</div></div> : null}
  </section>;
}
