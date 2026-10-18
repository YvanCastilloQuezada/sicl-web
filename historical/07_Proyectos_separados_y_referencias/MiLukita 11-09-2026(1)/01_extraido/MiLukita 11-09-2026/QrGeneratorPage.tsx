import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import QRCode from "qrcode";
import { ArrowLeft, Download, Info, Radio, Share2, Smartphone, Star, Tv, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { ADMIN_TIMER_PALETTE_STORAGE_KEY, buildCustomizedQrSvg, buildPaletteWcagCsv, buildQrDownloadName, createRandomTimerVisualProfile, qrMatrixFromData, DEFAULT_TIMER_PALETTE, normalizeTimerPalette, timerPaletteContrastReport, TIMER_PALETTE_EVENT, type CustomQrVisualConfig, type TimerPalette } from "@/lib/customQrGenerator";
import type { CircularQrVariant } from "@/../../shared/circularQr";
import { isQrExpiringSoon } from "@/../../shared/manifestTiming";
import { sha256Hex } from "@/lib/sha256";

const qrDestinations = {
  portal: { label: "Portal · Mundo MiLukita", path: "/portal" },
  mapper: { label: "Mapper · Guía Territorial", path: "/mapper" },
  eye: { label: "The Eye · Revisión Territorial", path: "/the-eye" },
  ar: { label: "LUKA AR · Experiencia 3D", path: "/lukita-ar-stage?entry=qr" },
} as const;

const variantLabels: Record<CircularQrVariant, string> = { central: "L Central", circle: "L en Círculo", integrated: "L Integrada" };
type Preset = Pick<CustomQrVisualConfig, "accentColor" | "backgroundColor" | "variant" | "size" | "shape"> & { moduleColor?: string; logoDataUrl?: string | null; timerPalette: TimerPalette };
const defaultPresets: Record<string, Preset> = {
  "MiLukita Oro": { accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "circle", size: 520, shape: "round", timerPalette: DEFAULT_TIMER_PALETTE },
  "TV en vivo": { accentColor: "#f5c96a", backgroundColor: "#071a12", variant: "integrated", size: 560, shape: "round", timerPalette: DEFAULT_TIMER_PALETTE },
  "TV en línea": { accentColor: "#7dd3fc", backgroundColor: "#07152b", variant: "central", size: 520, shape: "square", timerPalette: DEFAULT_TIMER_PALETTE },
  "Costa Andina": { accentColor: "#fef08a", backgroundColor: "#12352b", variant: "integrated", size: 560, shape: "round", timerPalette: { green: "#16a34a", yellow: "#eab308", orange: "#ea580c", red: "#b91c1c" } },
  "Evento Nocturno": { accentColor: "#c4b5fd", backgroundColor: "#17112f", variant: "central", size: 520, shape: "round", timerPalette: { green: "#34d399", yellow: "#fbbf24", orange: "#fb7185", red: "#be123c" } },
  "Alta Visibilidad": { accentColor: "#111827", backgroundColor: "#f8fafc", variant: "circle", size: 640, shape: "square", timerPalette: { green: "#15803d", yellow: "#ca8a04", orange: "#c2410c", red: "#b91c1c" } },
};
const PRESETS_STORAGE_KEY = "milukita.qr.visual-presets.v1";
const DEFAULT_PRESET_STORAGE_KEY = "milukita.qr.visual-default.v1";
const FAVORITE_PRESETS_STORAGE_KEY = "milukita.qr.visual-favorites.v1";

function downloadFile(content: string, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function QrGeneratorPage() {
  const [channel, setChannel] = useState<"live" | "online">("live");
  const [qrDestination, setQrDestination] = useState<keyof typeof qrDestinations>("portal");
  const [label, setLabel] = useState("MiLukita LIVE");
  const [accentColor, setAccentColor] = useState("#f5c96a");
  const [backgroundColor, setBackgroundColor] = useState("#071a12");
  const [moduleColor, setModuleColor] = useState("#07110d");
  const [variant, setVariant] = useState<CircularQrVariant>("circle");
  const [shape, setShape] = useState<"round" | "square">("round");
  const [size, setSize] = useState(520);
  const [scanDistance, setScanDistance] = useState(3);
  const [screenPreview, setScreenPreview] = useState<"mobile" | "tablet" | "smart-tv">("smart-tv");
  const [timerRunning, setTimerRunning] = useState(false);
  const [manualDurationOverride, setManualDurationOverride] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(2);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerPalette, setTimerPalette] = useState<TimerPalette>(DEFAULT_TIMER_PALETTE);
  const activeAdminPalette = trpc.operations.qrTimerPalettesActive.useQuery(undefined, { staleTime: 30_000, refetchInterval: 30_000 });
  const [timerElapsed, setTimerElapsed] = useState(0);
  const [qrMatrix, setQrMatrix] = useState<ReturnType<typeof qrMatrixFromData> | null>(null);
  const [qrHash, setQrHash] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState("");
  const [presetName, setPresetName] = useState("MiLukita Oro");
  const [defaultPresetName, setDefaultPresetName] = useState("MiLukita Oro");
  const [presets, setPresets] = useState<Record<string, Preset>>(defaultPresets);
  const [favoritePresetNames, setFavoritePresetNames] = useState<string[]>(["MiLukita Oro"]);
  const [presetStatus, setPresetStatus] = useState("");
  const [autoRandomCycle, setAutoRandomCycle] = useState(true);
  const [scanOs, setScanOs] = useState<"ios" | "android" | "samsung" | "lg" | "google-tv">("ios");
  const [scanResult, setScanResult] = useState("");
  const [isOnline, setIsOnline] = useState(() => typeof navigator === "undefined" ? true : navigator.onLine);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const online = () => setIsOnline(true);
    const offline = () => setIsOnline(false);
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    void navigator.serviceWorker?.ready.then(() => setOfflineReady(true));
    return () => { window.removeEventListener("online", online); window.removeEventListener("offline", offline); };
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(PRESETS_STORAGE_KEY) ?? "null") as Record<string, Preset> | null;
      const savedDefault = localStorage.getItem(DEFAULT_PRESET_STORAGE_KEY);
      const savedFavorites = JSON.parse(localStorage.getItem(FAVORITE_PRESETS_STORAGE_KEY) ?? "[]") as unknown;
      const available = stored && typeof stored === "object" ? { ...defaultPresets, ...stored } : defaultPresets;
      setPresets(available);
      setFavoritePresetNames(Array.isArray(savedFavorites) ? savedFavorites.filter((name): name is string => typeof name === "string" && Boolean(available[name])) : ["MiLukita Oro"]);
      const selectedDefault = savedDefault && available[savedDefault] ? savedDefault : "MiLukita Oro";
      const preset = available[selectedDefault];
      setDefaultPresetName(selectedDefault);
      setPresetName(selectedDefault);
      setAccentColor(preset.accentColor);
      setBackgroundColor(preset.backgroundColor);
      setModuleColor(preset.moduleColor ?? "#07110d");
      setLogoDataUrl(preset.logoDataUrl ?? null);
      setVariant(preset.variant);
      setShape(preset.shape ?? "round");
      setTimerPalette({ ...DEFAULT_TIMER_PALETTE, ...(preset.timerPalette ?? {}) });
      setSize(preset.size);
    } catch { /* La configuración predeterminada permanece disponible. */ }
  }, []);

  const publicQrUrl = useMemo(() => {
    const origin = typeof window === "undefined" ? "https://PUBLIC-DOMAIN-PENDING" : window.location.origin;
    return `${origin}${qrDestinations[qrDestination].path}`;
  }, [qrDestination]);
  const payload = useMemo(() => publicQrUrl, [publicQrUrl]);
  const automaticDurationSeconds = channel === "live" ? 120 : 90;
  const timerDurationSeconds = manualDurationOverride ? Math.max(1, timerMinutes * 60 + timerSeconds) : automaticDurationSeconds;
  const timerRemainingSeconds = Math.max(0, timerDurationSeconds - timerElapsed);
  const timerProgress = Math.min(100, (timerElapsed / timerDurationSeconds) * 100);
  const timerExpiringSoon = isQrExpiringSoon(timerRemainingSeconds);
  const config: CustomQrVisualConfig = { matrix: qrMatrix ?? undefined, size, label, accentColor, backgroundColor, moduleColor, variant, shape, logoDataUrl, timerProgress, timerPalette };
  const svg = qrMatrix ? buildCustomizedQrSvg("", config) : null;

  useEffect(() => {
    let active = true;
    setQrHash("");
    if (!svg) return () => { active = false; };
    void sha256Hex(svg).then(hash => { if (active) setQrHash(hash); }).catch(() => { if (active) setQrHash("No disponible"); });
    return () => { active = false; };
  }, [svg]);

  useEffect(() => {
    let active = true;
    const generated = QRCode.create(JSON.stringify(payload), { errorCorrectionLevel: "H" });
    if (active) setQrMatrix(qrMatrixFromData(generated.modules));
    return () => { active = false; };
  }, [payload, size]);

  useEffect(() => {
    if (!activeAdminPalette.data) return;
    const safePalette = normalizeTimerPalette(activeAdminPalette.data.palette);
    setTimerPalette(safePalette);
    setPresetStatus(`Paleta activa: ${activeAdminPalette.data.name}`);
    window.setTimeout(() => setPresetStatus(""), 2600);
  }, [activeAdminPalette.data?.publicId]);

  useEffect(() => {
    const applyAdminPalette = (candidate?: Partial<TimerPalette> | null) => {
      const safePalette = normalizeTimerPalette(candidate);
      setTimerPalette(safePalette);
      setPresetStatus("Paleta administrativa aplicada al QR Studio");
      window.setTimeout(() => setPresetStatus(""), 2600);
    };
    const readStoredPalette = () => {
      try {
        const stored = JSON.parse(localStorage.getItem(ADMIN_TIMER_PALETTE_STORAGE_KEY) ?? "null") as Partial<TimerPalette> | null;
        if (stored) applyAdminPalette(stored);
      } catch { /* Se conserva la paleta del preset actual. */ }
    };
    const handlePaletteEvent = (event: Event) => applyAdminPalette((event as CustomEvent<Partial<TimerPalette>>).detail);
    readStoredPalette();
    window.addEventListener(TIMER_PALETTE_EVENT, handlePaletteEvent);
    window.addEventListener("storage", readStoredPalette);
    return () => { window.removeEventListener(TIMER_PALETTE_EVENT, handlePaletteEvent); window.removeEventListener("storage", readStoredPalette); };
  }, []);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => setTimerElapsed((current) => { if (current >= timerDurationSeconds) { setTimerRunning(false); return timerDurationSeconds; } return current + 1; }), 1000);
    return () => window.clearInterval(interval);
  }, [timerDurationSeconds, timerRunning]);

  useEffect(() => {
    setTimerElapsed((current) => Math.min(current, timerDurationSeconds));
  }, [timerDurationSeconds]);

  const applyPreset = (name: string) => {
    const preset = presets[name];
    if (!preset) return;
    setPresetName(name);
    setAccentColor(preset.accentColor);
    setBackgroundColor(preset.backgroundColor);
    setModuleColor(preset.moduleColor ?? "#07110d");
    setLogoDataUrl(preset.logoDataUrl ?? null);
    setVariant(preset.variant);
    setShape(preset.shape ?? "round");
    setTimerPalette(normalizeTimerPalette(preset.timerPalette));
    setSize(preset.size);
    setPresetStatus(`Preset “${name}” cargado`);
    window.setTimeout(() => setPresetStatus(""), 2200);
  };
  const savePreset = () => {
    const name = presetName.trim().slice(0, 30);
    if (!name) return;
    const next = { ...presets, [name]: { accentColor, backgroundColor, moduleColor, logoDataUrl, variant, shape, size, timerPalette } };
    setPresets(next);
    try { localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(next)); } catch { setPresetStatus("El logo es demasiado grande para guardarlo localmente"); return; }
    setPresetStatus(`Preset “${name}” guardado localmente`);
    window.setTimeout(() => setPresetStatus(""), 2200);
  };
  const toggleFavoritePreset = () => {
    const name = presetName.trim();
    if (!name || !presets[name]) { setPresetStatus("Guarda primero este preset para marcarlo como favorito"); return; }
    const next = favoritePresetNames.includes(name) ? favoritePresetNames.filter(item => item !== name) : [...favoritePresetNames, name];
    setFavoritePresetNames(next);
    localStorage.setItem(FAVORITE_PRESETS_STORAGE_KEY, JSON.stringify(next));
    setPresetStatus(next.includes(name) ? `“${name}” añadido a favoritos` : `“${name}” quitado de favoritos`);
    window.setTimeout(() => setPresetStatus(""), 2200);
  };
  const makeDefaultPreset = () => {
    const name = presetName.trim();
    if (!name || !presets[name]) { setPresetStatus("Guarda primero este preset para usarlo como predeterminado"); return; }
    setDefaultPresetName(name);
    localStorage.setItem(DEFAULT_PRESET_STORAGE_KEY, name);
    setPresetStatus(`“${name}” será el preset predeterminado`);
    window.setTimeout(() => setPresetStatus(""), 2200);
  };
  const randomizeVisualCycle = () => {
    const profile = createRandomTimerVisualProfile();
    setManualDurationOverride(true);
    setTimerPalette(profile.palette);
    setTimerMinutes(Math.floor(profile.durationSeconds / 60));
    setTimerSeconds(profile.durationSeconds % 60);
    setTimerElapsed(0);
    setTimerRunning(false);
    setPresetStatus("Ciclo visual aleatorio coordinado con su duración");
    window.setTimeout(() => setPresetStatus(""), 2200);
  };
  useEffect(() => { if (autoRandomCycle && shape === "round") randomizeVisualCycle(); }, [channel]);
  useEffect(() => { if (!manualDurationOverride) { setTimerMinutes(Math.floor(automaticDurationSeconds / 60)); setTimerSeconds(automaticDurationSeconds % 60); setTimerElapsed(0); setTimerRunning(false); } }, [automaticDurationSeconds, manualDurationOverride]);
  const downloadWcagReport = () => downloadFile(buildPaletteWcagCsv(presets), `milukita-wcag-paletas-${new Date().toISOString().slice(0, 10)}.csv`, "text/csv;charset=utf-8");
  const simulateScan = () => {
    const report = timerPaletteContrastReport(timerPalette, backgroundColor);
    const compatible = Boolean(qrMatrix) && report.every((item) => item.passesNonTextAA) && size >= 340;
    const labels = { ios: "iOS Safari", android: "Android Chrome", samsung: "Samsung Tizen", lg: "LG webOS", "google-tv": "Android/Google TV" };
    setScanResult(`${labels[scanOs]} · ${compatible ? "SIMULACIÓN DE LECTURA DISPONIBLE" : "SIMULACIÓN CON ADVERTENCIAS"}. No sustituye una prueba con cámara real.`);
  };
  const setDistance = (distance: number) => { setScanDistance(distance); setSize(Math.min(900, Math.round(340 + distance * 60))); };
  const toggleTimer = () => { if (timerElapsed >= timerDurationSeconds) { setTimerElapsed(0); setTimerRunning(true); return; } setTimerRunning((current) => !current); };
  const resetTimer = () => { setTimerRunning(false); setTimerElapsed(0); };
  const updateTimerColor = (key: keyof TimerPalette, value: string) => setTimerPalette((current) => ({ ...current, [key]: value }));
  const removeLogo = () => { setLogoDataUrl(null); setLogoError(""); };
  const handleLogo = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setLogoError("Selecciona una imagen PNG, JPG, SVG o WebP."); return; }
    if (file.size > 2 * 1024 * 1024) { setLogoError("El logotipo debe pesar como máximo 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = () => { setLogoDataUrl(typeof reader.result === "string" ? reader.result : null); setLogoError(""); };
    reader.onerror = () => setLogoError("No se pudo leer el logotipo.");
    reader.readAsDataURL(file);
  };

  const deviceFrameSize = screenPreview === "mobile" ? { width: 440, height: 760, screenX: 44, screenY: 92, screenWidth: 352, screenHeight: 576, radius: 48 } : screenPreview === "tablet" ? { width: 900, height: 640, screenX: 70, screenY: 60, screenWidth: 760, screenHeight: 520, radius: 34 } : { width: 1200, height: 720, screenX: 34, screenY: 34, screenWidth: 1132, screenHeight: 590, radius: 18 };
  const buildFramedSvg = () => {
    if (!svg) return null;
    const frame = deviceFrameSize;
    const qrData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}" role="img" aria-label="${screenPreview} con QR ${label}"><rect width="100%" height="100%" rx="${frame.radius}" fill="#111827"/><rect x="${frame.screenX}" y="${frame.screenY}" width="${frame.screenWidth}" height="${frame.screenHeight}" rx="${Math.max(8, frame.radius - 10)}" fill="#f8fafc"/><image href="${qrData}" x="${frame.screenX + 18}" y="${frame.screenY + 18}" width="${frame.screenWidth - 36}" height="${frame.screenHeight - 36}" preserveAspectRatio="xMidYMid meet"/><circle cx="${frame.width / 2}" cy="${frame.height - 34}" r="8" fill="#9ca3af"/></svg>`;
  };
  const downloadSvg = () => { if (svg) downloadFile(svg, buildQrDownloadName(label, "svg"), "image/svg+xml;charset=utf-8"); };
  const shareQr = async () => {
    if (!svg) return;
    const filename = buildQrDownloadName(`${label}-${shape}`, "svg");
    const file = new File([svg], filename, { type: "image/svg+xml;charset=utf-8" });
    if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
      try {
        await navigator.share({ title: `QR ${shape === "round" ? "redondo" : "cuadrado"} MiLukita`, text: label, files: [file] });
        setPresetStatus("QR compartido desde el dispositivo");
      } catch { setPresetStatus("Compartición cancelada · el QR sigue disponible para descargar"); }
      window.setTimeout(() => setPresetStatus(""), 2400);
      return;
    }
    downloadSvg();
    setPresetStatus("Este navegador no permite compartir archivos · QR descargado");
    window.setTimeout(() => setPresetStatus(""), 2400);
  };
  const downloadFramedSvg = () => { const framed = buildFramedSvg(); if (framed) downloadFile(framed, buildQrDownloadName(`${label}-${screenPreview}-marco`, "svg"), "image/svg+xml;charset=utf-8"); };
  const downloadPng = () => {
    if (!svg) return;
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => { const canvas = document.createElement("canvas"); canvas.width = size; canvas.height = size; canvas.getContext("2d")?.drawImage(image, 0, 0, size, size); URL.revokeObjectURL(url); const link = document.createElement("a"); link.download = buildQrDownloadName(label, "png"); link.href = canvas.toDataURL("image/png"); link.click(); };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  };
  const downloadFramedPng = () => {
    const framed = buildFramedSvg();
    if (!framed) return;
    const image = new Image();
    const url = URL.createObjectURL(new Blob([framed], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => { const frame = deviceFrameSize; const canvas = document.createElement("canvas"); canvas.width = frame.width; canvas.height = frame.height; canvas.getContext("2d")?.drawImage(image, 0, 0, frame.width, frame.height); URL.revokeObjectURL(url); const link = document.createElement("a"); link.download = buildQrDownloadName(`${label}-${screenPreview}-marco`, "png"); link.href = canvas.toDataURL("image/png"); link.click(); };
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  };

  return <main className="min-h-screen bg-[#06120e] px-5 py-8 text-white sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="eyebrow text-emerald-200">MiLukita · QR Studio</p><h1 className="font-display mt-3 text-4xl sm:text-5xl">Generador QR personalizable</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Personaliza únicamente la presentación visual para TV en vivo o TV en línea. El payload se mantiene separado y el QR generado aquí está marcado para revisión.</p></div><Link href="/tv" className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"><ArrowLeft className="h-4 w-4" /> Volver a TV</Link></div>
    <div className="mt-4 flex flex-wrap items-center gap-2 border border-emerald-200/20 bg-emerald-200/[.05] p-3 text-xs text-slate-300" role="status" aria-live="polite"><span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-300" : "bg-amber-300"}`} />{isOnline ? "ONLINE" : "OFFLINE"} · QR Studio usa generación local{offlineReady ? " y Service Worker listo" : " · visita esta ruta online una vez para preparar caché"}. La galería conserva índice local y assets previamente cacheados.</div><div className="mt-8 flex items-start gap-3 border border-amber-200/25 bg-amber-200/10 p-4 text-sm text-amber-50"><Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" /><div><strong className="block">Separación de responsabilidades</strong><span className="mt-1 block leading-6 text-amber-100/80">Color, fondo, etiqueta, tamaño, logotipo y variante son presentación. No se permite editar la autoridad, el resultado, la ronda ni la firma de MJP CORE. Los datos de esta pantalla usan `REVIEW_ONLY`.</span></div></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]"><section className="border border-emerald-200/20 bg-emerald-200/5 p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Configuración visual</p><div className="mt-5 grid gap-4"><div><p className="mb-2 text-sm font-bold">Preset de identidad</p><div className="flex flex-wrap gap-2"><select value={presetName} onChange={(event) => applyPreset(event.target.value)} aria-label="Seleccionar preset visual" className="min-w-0 flex-1 border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"><option value="" disabled>Seleccionar preset</option>{Object.keys(presets).map((name) => <option key={name} value={name}>{favoritePresetNames.includes(name) ? "★ " : ""}{name}{name === defaultPresetName ? " · predeterminado" : ""}</option>)}</select><Button type="button" size="sm" onClick={savePreset} className="bg-emerald-200 text-slate-950 hover:bg-emerald-100">Guardar</Button><Button type="button" size="sm" variant="outline" onClick={toggleFavoritePreset} className={favoritePresetNames.includes(presetName) ? "border-amber-200/60 bg-amber-200/10 text-amber-100" : "border-white/15 bg-black/20 text-white hover:bg-white/10"}><Star className={`mr-2 h-3.5 w-3.5 ${favoritePresetNames.includes(presetName) ? "fill-amber-200" : ""}`} />{favoritePresetNames.includes(presetName) ? "Favorito" : "Favorito"}</Button><Button type="button" size="sm" variant="outline" onClick={makeDefaultPreset} className="border-amber-200/30 bg-amber-200/10 text-amber-100 hover:bg-amber-200/20">Usar por defecto</Button></div>{presetStatus && <p className="mt-2 text-xs text-emerald-200" role="status">{presetStatus}</p>}</div><div><p className="mb-2 text-sm font-bold">Destino de navegación sin credenciales</p><select value={qrDestination} onChange={(event) => setQrDestination(event.target.value as keyof typeof qrDestinations)} aria-label="Destino público del QR" className="w-full border border-white/15 bg-black/20 px-3 py-2 text-sm text-white">{Object.entries(qrDestinations).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select><p className="mt-2 break-all font-mono text-[11px] text-cyan-200">{publicQrUrl}</p><p className="mt-2 text-xs leading-5 text-slate-400">El QR contiene únicamente esta URL pública. Para abrir directamente a LUKA en 3D, selecciona “LUKA AR · Experiencia 3D”.</p></div><div><p className="mb-2 text-sm font-bold">Canal visual</p><div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" onClick={() => { setChannel("live"); setLabel("MiLukita LIVE"); }} className={channel === "live" ? "border-amber-200/70 bg-amber-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}><Radio className="mr-2 h-4 w-4" /> TV en vivo</Button><Button type="button" variant="outline" onClick={() => { setChannel("online"); setLabel("MiLukita Online"); }} className={channel === "online" ? "border-cyan-200/70 bg-cyan-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}><Tv className="mr-2 h-4 w-4" /> TV en línea</Button></div></div><label className="text-sm font-bold">Etiqueta visible<Input value={label} onChange={(event) => setLabel(event.target.value)} maxLength={30} className="mt-2 border-white/15 bg-black/20 text-white" /></label><div className="grid grid-cols-2 gap-3"><label className="text-sm font-bold">Acento<input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} className="mt-2 h-10 w-full cursor-pointer border border-white/15 bg-black/20 p-1" /></label><label className="text-sm font-bold">Fondo<input type="color" value={backgroundColor} onChange={(event) => setBackgroundColor(event.target.value)} className="mt-2 h-10 w-full cursor-pointer border border-white/15 bg-black/20 p-1" /></label><label className="text-sm font-bold">Módulos QR<input type="color" value={moduleColor} onChange={(event) => setModuleColor(event.target.value)} className="mt-2 h-10 w-full cursor-pointer border border-white/15 bg-black/20 p-1" /></label></div><label className="text-sm font-bold">Distancia de escaneo TV: {scanDistance} m<input type="range" min="1" max="10" step="1" value={scanDistance} onChange={(event) => setDistance(Number(event.target.value))} className="mt-3 w-full accent-amber-200" /></label><p className="-mt-2 text-xs leading-5 text-slate-400">Tamaño recomendado: {Math.min(900, Math.round(340 + scanDistance * 60))}px. Es una referencia visual y debe verificarse en el televisor objetivo.</p><label className="text-sm font-bold">Ajuste fino: {size}px<input type="range" min="240" max="900" step="10" value={size} onChange={(event) => setSize(Number(event.target.value))} className="mt-3 w-full accent-amber-200" /></label><div><p className="mb-2 text-sm font-bold">Forma del QR</p><div className="grid grid-cols-2 gap-2"><Button type="button" variant="outline" onClick={() => setShape("round")} className={shape === "round" ? "border-amber-200/70 bg-amber-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}>QR redondo</Button><Button type="button" variant="outline" onClick={() => setShape("square")} className={shape === "square" ? "border-cyan-200/70 bg-cyan-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}>QR cuadrado</Button></div><p className="mt-2 text-xs leading-5 text-slate-400">Ambas formas usan la misma matriz; el QR redondo conserva patrones técnicos para favorecer la lectura. El destino actual es una URL pública, no una credencial.</p></div><div><p className="mb-2 text-sm font-bold">Variante Lukita</p><div className="grid gap-2">{(Object.keys(variantLabels) as CircularQrVariant[]).map((item) => <Button key={item} type="button" variant="outline" onClick={() => setVariant(item)} className={variant === item ? "justify-start border-amber-200/70 bg-amber-200/15 text-white" : "justify-start border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}>{variantLabels[item]}</Button>)}</div></div><div><p className="mb-2 text-sm font-bold">Logotipo central del QR redondo</p><div className="flex flex-wrap items-center gap-2"><label className="inline-flex cursor-pointer items-center gap-2 border border-white/15 bg-black/20 px-3 py-2 text-xs font-bold text-white hover:bg-white/10"><Upload className="h-3.5 w-3.5" /> Subir logotipo<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" className="sr-only" onChange={(event) => handleLogo(event.target.files?.[0])} /></label>{logoDataUrl && <Button type="button" size="sm" variant="outline" onClick={removeLogo} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><X className="mr-2 h-3.5 w-3.5" /> Quitar</Button>}</div><p className="mt-2 text-xs leading-5 text-slate-400">Se procesa localmente y se incrusta en la previsualización y en las descargas SVG/PNG. Límite: 2 MB.</p>{logoError && <p className="mt-2 text-xs text-rose-200" role="alert">{logoError}</p>}{logoDataUrl && <img src={logoDataUrl} alt="Vista previa del logotipo seleccionado" className="mt-3 h-12 w-12 border border-white/20 bg-white object-contain p-1" />}</div></div></section>
      <section className="border border-white/10 bg-black/20 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Previsualización</p><h2 className="mt-2 text-xl font-bold">{label || "MiLukita"}</h2></div><span className="border border-amber-200/25 bg-amber-200/10 px-2 py-1 text-xs font-bold text-amber-100">REVIEW_ONLY</span></div><div className="mt-4 border border-cyan-200/20 bg-cyan-200/[.04] p-3" aria-live="polite"><p className="text-[11px] font-bold uppercase tracking-[.12em] text-cyan-200">SHA-256 del QR generado</p><p className="mt-1 break-all font-mono text-[11px] text-slate-300">{qrHash || "Calculando digest…"}</p><p className="mt-1 text-[11px] text-slate-500">Digest del SVG actual; cambiar color, logo, tamaño, forma o payload produce otro hash.</p></div><div className="mt-6 flex min-h-[420px] items-center justify-center border border-white/10 bg-[#020806] p-6"><div className={`flex items-center justify-center border border-white/10 bg-[#071a12] p-5 transition-[width,height] duration-200 ${screenPreview === "mobile" ? "h-[390px] w-[230px] rounded-[2rem]" : screenPreview === "tablet" ? "h-[330px] w-[470px] rounded-[1.5rem]" : "h-[280px] w-full max-w-[640px] rounded-xl"}`}>{svg ? <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`} alt={`QR ${shape === "round" ? "redondo" : "cuadrado"} en vista ${screenPreview}`} className={`max-h-full max-w-full object-contain ${shape === "round" ? "rounded-full" : "rounded-none"}`} /> : <p className="text-sm text-slate-400">Generando QR de previsualización…</p>}</div></div><div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Simular tamaño de pantalla"><Button type="button" size="sm" variant="outline" onClick={() => setScreenPreview("mobile")} className={screenPreview === "mobile" ? "border-cyan-200/70 bg-cyan-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}>Móvil</Button><Button type="button" size="sm" variant="outline" onClick={() => setScreenPreview("tablet")} className={screenPreview === "tablet" ? "border-cyan-200/70 bg-cyan-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}>Tablet</Button><Button type="button" size="sm" variant="outline" onClick={() => setScreenPreview("smart-tv")} className={screenPreview === "smart-tv" ? "border-cyan-200/70 bg-cyan-200/15 text-white" : "border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"}>Smart TV</Button></div><div className={`mt-4 border p-3 ${timerExpiringSoon ? "qr-timer-expiring" : "border-white/10 bg-white/[.03]"}`}><div className="flex flex-wrap items-center gap-2"><p className="mr-2 text-xs font-bold uppercase tracking-[.12em] text-slate-400">Temporizador de esta presentación</p><label className="flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={manualDurationOverride} onChange={(event) => { setManualDurationOverride(event.target.checked); resetTimer(); }} /> Override manual <span className="text-slate-500">(prueba)</span></label><label className={`text-xs ${manualDurationOverride ? "text-slate-300" : "text-slate-500"}`}>Minutos<input disabled={!manualDurationOverride} aria-label="Duración en minutos" type="number" min="0" max="180" value={timerMinutes} onChange={(event) => { setTimerMinutes(Math.max(0, Math.min(180, Number(event.target.value) || 0))); resetTimer(); }} className="ml-2 w-16 border border-white/15 bg-black/20 px-2 py-1 text-center font-mono text-white" /></label><label className={`text-xs ${manualDurationOverride ? "text-slate-300" : "text-slate-500"}`}>Segundos<input disabled={!manualDurationOverride} aria-label="Duración en segundos" type="number" min="0" max="59" value={timerSeconds} onChange={(event) => { setTimerSeconds(Math.max(0, Math.min(59, Number(event.target.value) || 0))); resetTimer(); }} className="ml-2 w-16 border border-white/15 bg-black/20 px-2 py-1 text-center font-mono text-white" /></label><Button type="button" size="sm" onClick={toggleTimer} className="bg-amber-200 text-slate-950 hover:bg-amber-100">{timerRunning ? "Pausar" : timerElapsed >= timerDurationSeconds ? "Reiniciar" : "Iniciar"}</Button><Button type="button" size="sm" variant="outline" onClick={resetTimer} className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">Restablecer</Button></div><div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-sm text-amber-100"><span>{manualDurationOverride ? "Modo prueba · override manual" : "Duración automática del canal"}</span><span>Transcurrido {Math.floor(timerElapsed / 60).toString().padStart(2, "0")}:{(timerElapsed % 60).toString().padStart(2, "0")}</span><span>Restante {Math.floor(timerRemainingSeconds / 60).toString().padStart(2, "0")}:{(timerRemainingSeconds % 60).toString().padStart(2, "0")}</span>{timerExpiringSoon && <span className="font-bold text-rose-200" role="alert" aria-live="assertive">QR expira en {timerRemainingSeconds}s</span>}<span>· {Math.round(timerProgress)}%</span></div><div className="mt-4"><p className="mb-2 text-xs font-bold uppercase tracking-[.12em] text-slate-400">Colores de transición</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{(["green", "yellow", "orange", "red"] as const).map((key) => <label key={key} className="flex items-center gap-2 text-xs text-slate-300"><input type="color" value={timerPalette[key]} onChange={(event) => updateTimerColor(key, event.target.value)} aria-label={`Color ${key} del temporizador`} className="h-8 w-10 cursor-pointer border border-white/15 bg-black/20 p-1" /><span>{key === "green" ? "Inicio" : key === "yellow" ? "Amarillo" : key === "orange" ? "Naranja" : "Final"}</span></label>)}</div><Button type="button" size="sm" variant="outline" onClick={() => setTimerPalette(DEFAULT_TIMER_PALETTE)} className="mt-3 border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">Restaurar colores</Button></div><p className="mt-3 text-xs leading-5 text-slate-400">El arco usa exactamente {Math.floor(timerDurationSeconds / 60).toString().padStart(2, "0")}:{(timerDurationSeconds % 60).toString().padStart(2, "0")} y cambia de verde a rojo al terminar. En emisión real, esta duración debe coincidir con `expiresAt` del manifest autoritativo.</p></div><div className="mt-5 flex flex-wrap gap-2"><Button type="button" onClick={randomizeVisualCycle} className="border border-emerald-200/30 bg-emerald-200/10 text-emerald-100 hover:bg-emerald-200/20">Nuevo ciclo aleatorio</Button><Button type="button" onClick={() => setAutoRandomCycle((current) => !current)} variant="outline" className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">Aleatoriedad automática: {autoRandomCycle ? "ON" : "OFF"}</Button><Button type="button" onClick={downloadWcagReport} variant="outline" className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white">Reporte WCAG</Button><Button type="button" onClick={downloadSvg} disabled={!svg} className="bg-amber-200 text-slate-950 hover:bg-amber-100"><Download className="mr-2 h-4 w-4" /> Descargar QR SVG</Button><Button type="button" onClick={downloadPng} disabled={!svg} variant="outline" className="border-white/15 bg-black/20 text-white hover:bg-white/10 hover:text-white"><Download className="mr-2 h-4 w-4" /> Descargar QR PNG</Button><Button type="button" onClick={() => void shareQr()} disabled={!svg} variant="outline" className="border-emerald-200/30 bg-emerald-200/10 text-emerald-100 hover:bg-emerald-200/20"><Share2 className="mr-2 h-4 w-4" /> Compartir QR {shape === "round" ? "redondo" : "cuadrado"}</Button><Button type="button" onClick={downloadFramedSvg} disabled={!svg} variant="outline" className="border-cyan-200/30 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/20 hover:text-white">Marco SVG</Button><Button type="button" onClick={downloadFramedPng} disabled={!svg} variant="outline" className="border-cyan-200/30 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/20 hover:text-white">Marco PNG</Button></div><div className="mt-4 border border-cyan-200/15 bg-cyan-200/5 p-3"><p className="text-xs font-bold uppercase tracking-[.12em] text-cyan-200">Simulador de lectura por sistema</p><p className="mt-1 text-xs leading-5 text-slate-400">Evalúa heurísticamente matriz, tamaño y contraste. Es una simulación de interfaz, no certifica una cámara real.</p><div className="mt-3 flex flex-wrap gap-2"><select value={scanOs} onChange={(event) => setScanOs(event.target.value as typeof scanOs)} aria-label="Sistema operativo del simulador QR" className="border border-white/15 bg-black/20 px-3 py-2 text-xs text-white"><option value="ios">iOS Safari</option><option value="android">Android Chrome</option><option value="samsung">Samsung Tizen</option><option value="lg">LG webOS</option><option value="google-tv">Android/Google TV</option></select><Button type="button" size="sm" onClick={simulateScan} variant="outline" className="border-cyan-200/30 bg-cyan-200/10 text-cyan-100 hover:bg-cyan-200/20 hover:text-white">Simular escaneo</Button></div>{scanResult && <p className="mt-3 text-xs text-cyan-100" role="status">{scanResult}</p>}</div><div className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-400"><Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />{channel === "live" ? "Destino conceptual: pantalla de TV en vivo." : "Destino conceptual: experiencia de TV en línea."} La emisión real debe usar el manifiesto autoritativo.</div></section></div>
    <section className="mt-8 border border-white/10 bg-black/20 p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-emerald-200">Payload separado</p><pre className="mt-3 overflow-auto text-xs leading-6 text-emerald-100">{JSON.stringify(payload, null, 2)}</pre></section>
  </div></main>;
}
