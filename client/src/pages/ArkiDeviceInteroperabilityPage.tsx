import { useMemo, useState } from "react";
import { Bluetooth, Box, Camera, CheckCircle2, Gamepad2, Keyboard, Link2, MapPin, Monitor, MousePointer2, Radio, ShieldCheck, Smartphone, Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildArkiDeviceLinkPlan, ARKI_DEVICE_MODES, type ArkiDeviceMode, type ArkiDeviceDescriptor } from "@shared/arkiDeviceInteroperability";

type BrowserNavigator = Navigator & { bluetooth?: unknown; xr?: unknown };
const MODE_META: Record<ArkiDeviceMode, { label: string; icon: typeof Monitor; description: string }> = {
  REMOTE: { label: "Control remoto", icon: Monitor, description: "Navegar presentaciones, visores y superficies autorizadas." },
  GAMEPAD: { label: "Gamepad", icon: Gamepad2, description: "Controlar prototipos interactivos sin tocar el equipo principal." },
  TRACKPAD: { label: "Trackpad", icon: MousePointer2, description: "Convertir el teléfono en puntero y navegación espacial." },
  KEYBOARD: { label: "Teclado", icon: Keyboard, description: "Escribir comandos o notas en otra pantalla." },
  AR: { label: "Visor AR", icon: Box, description: "Abrir contexto de cámara, hit-test y modelo espacial." },
  FIELD: { label: "Campo", icon: MapPin, description: "Capturar cámara, voz, GPS y observaciones para revisión." },
  PRESENTATION: { label: "Presentación", icon: Monitor, description: "Usar el móvil como control de una presentación BIM o visual." },
};

export default function ArkiDeviceInteroperabilityPage() {
  const [mode, setMode] = useState<ArkiDeviceMode>("TRACKPAD");
  const [plan, setPlan] = useState<ReturnType<typeof buildArkiDeviceLinkPlan> | null>(null);
  const [paired, setPaired] = useState(false);
  const descriptor = useMemo<ArkiDeviceDescriptor>(() => {
    const browser = navigator as BrowserNavigator;
    const capabilities: ArkiDeviceDescriptor["capabilities"] = ["NAVIGATION", "POINTER", "KEYBOARD", "GAMEPAD", "PRESENTATION"];
    if ("mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices) capabilities.push("CAMERA", "MICROPHONE");
    if ("geolocation" in navigator) capabilities.push("GEOLOCATION");
    if (browser.xr) capabilities.push("HIT_TEST");
    const protocols: ArkiDeviceDescriptor["protocols"] = ["ARKI_RECEIVER", "WEBSOCKET", "BROADCAST_CHANNEL"];
    if (typeof RTCPeerConnection !== "undefined") protocols.push("WEBRTC");
    if (browser.bluetooth) protocols.push("VENDOR");
    return { deviceId: "browser-local", deviceName: "Este dispositivo", platform: navigator.platform || "web", capabilities, protocols, status: "LOCAL" };
  }, []);
  const selected = MODE_META[mode];
  const SelectedIcon = selected.icon;
  const prepare = () => { setPlan(buildArkiDeviceLinkPlan(mode, descriptor)); setPaired(false); };
  const simulatedPair = () => { if (plan?.status === "READY") setPaired(true); };

  return <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-10"><div className="mx-auto max-w-6xl space-y-6"><header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">ARKI DEVICE BRIDGE</p><h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Un teléfono, muchas herramientas</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Contrato absorbido de MiLukita: remoto, gamepad, trackpad, teclado, AR y campo. El navegador detecta capacidades reales y no inventa una conexión que todavía requiera un receptor externo.</p></div><div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200"><ShieldCheck className="h-4 w-4" />Sin autoridad de decisión</div></header>

<section className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" />Dispositivo local</CardTitle></CardHeader><CardContent className="space-y-4"><div className="rounded-lg border border-border bg-muted/30 p-4"><p className="font-medium">{descriptor.deviceName}</p><p className="mt-1 text-xs text-muted-foreground">{descriptor.platform} · {descriptor.status}</p><div className="mt-3 flex flex-wrap gap-2">{descriptor.capabilities.map((capability) => <Badge key={capability} variant="outline">{capability}</Badge>)}</div></div><div><p className="mb-2 text-sm font-medium">Protocolos detectados</p><div className="flex flex-wrap gap-2">{descriptor.protocols.map((protocol) => <Badge key={protocol} variant="secondary"><Wifi className="mr-1 h-3 w-3" />{protocol}</Badge>)}</div></div><p className="text-xs leading-5 text-muted-foreground">La detección local sólo identifica capacidades del navegador. Pairing con otro equipo requiere receptor ARKI autorizado, WebSocket/WebRTC o adaptador del fabricante.</p></CardContent></Card><Card><CardHeader><CardTitle className="flex items-center gap-2"><Link2 className="h-5 w-5 text-primary" />Modo seleccionado</CardTitle></CardHeader><CardContent className="space-y-4"><div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4"><SelectedIcon className="h-7 w-7 text-primary" /><div><p className="font-semibold">{selected.label}</p><p className="text-xs text-muted-foreground">{selected.description}</p></div></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{ARKI_DEVICE_MODES.map((candidate) => { const Icon = MODE_META[candidate].icon; return <Button key={candidate} variant={candidate === mode ? "default" : "outline"} className="h-auto justify-start gap-2 px-3 py-3 text-left" onClick={() => { setMode(candidate); setPlan(null); }}><Icon className="h-4 w-4 shrink-0" /><span className="text-xs">{MODE_META[candidate].label}</span></Button>; })}</div><Button onClick={prepare} className="w-full"><Radio className="mr-2 h-4 w-4" />Preparar enlace seguro</Button></CardContent></Card></section>

{plan && <Card className="border-primary/30"><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />Plan de interoperabilidad</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid gap-3 sm:grid-cols-4"><Stat label="Estado" value={plan.status} /><Stat label="Protocolo" value={plan.recommendedProtocol ?? "HOST EXTERNO"} /><Stat label="Fallbacks" value={String(plan.fallbackProtocols.length)} /><Stat label="Autoridad" value={plan.authority} /></div><div className="rounded-lg border border-border bg-muted/20 p-4 text-sm"><p className="font-medium">Capacidades requeridas</p><p className="mt-1 text-muted-foreground">{plan.requiredCapabilities.join(" · ")}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted-foreground">{plan.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul></div><div className="flex flex-wrap gap-2"><Button onClick={simulatedPair} disabled={plan.status !== "READY"}><Bluetooth className="mr-2 h-4 w-4" />{paired ? "Enlace preparado" : "Preparar pairing"}</Button><Button variant="outline" onClick={() => setPlan(null)}>Limpiar</Button></div>{paired && <p className="text-xs text-emerald-500" role="status">Contrato listo. La conexión efectiva depende de un receptor o host compatible; no se ha ejecutado ninguna acción privilegiada.</p>}</CardContent></Card>}

<Card><CardHeader><CardTitle>Reglas de seguridad del Bridge</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3"><Rule title="Permiso explícito" text="Cámara, micrófono, ubicación y AR se solicitan sólo al iniciar el modo correspondiente." /><Rule title="Sin secretos en móvil" text="Los tokens del Core y credenciales de host permanecen en servidor." /><Rule title="Sin publicación" text="Un dispositivo puede controlar y capturar; no puede decidir, publicar ni alterar auditoría." /></CardContent></Card></div></main>;
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-border bg-muted/20 p-3"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-sm font-semibold">{value}</p></div>; }
function Rule({ title, text }: { title: string; text: string }) { return <div className="rounded-lg border border-border p-4"><p className="font-medium text-foreground">{title}</p><p className="mt-1 text-xs leading-5">{text}</p></div>; }
