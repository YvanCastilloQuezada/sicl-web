import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, CircleDot, Loader2, MonitorPlay, Moon, Power, QrCode, RotateCcw, Sun, Volume2, Wifi, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANDROID_TV_PROFILES, mapSmartTvKeyToAction, SIMULATED_SMART_TV, SMART_TV_CONNECTED_MESSAGE, SMART_TV_NOT_FOUND_MESSAGE, SMART_TV_SIMULATION_STEPS, nextSmartTvRoute, type SmartTvAction, type SmartTvRoute, type SmartTvSimulationState } from "../../../shared/smartTvSimulationContract";

function playNavigationTone(action: SmartTvAction) {
  if (typeof window === "undefined") return;
  const AudioContextCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextCtor) return;
  try {
    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = action === "ok" ? 720 : action === "back" ? 420 : 560;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.09);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
    oscillator.addEventListener("ended", () => void context.close(), { once: true });
  } catch {
    // El feedback sonoro es opcional y nunca debe bloquear la navegación.
  }
}

const ROUTE_CONTENT: Record<SmartTvRoute, { eyebrow: string; title: string; items: string[] }> = {
  home: { eyebrow: "Inicio", title: "Tu pantalla de bienvenida", items: ["Continuar viendo", "Experiencia LUKA", "TV en vivo"] },
  media: { eyebrow: "Media", title: "Contenido disponible", items: ["TV en vivo", "Películas", "Series"] },
  apps: { eyebrow: "Apps", title: "Aplicaciones", items: ["Netflix", "YouTube", "Prime Video"] },
  settings: { eyebrow: "Ajustes", title: "Preferencias del TV", items: ["Imagen", "Audio", "Red"] },
};

export default function SmartTvConnectionSimulator({ onOpenTv, onClose }: { onOpenTv: () => void; onClose: () => void }) {
  const [state, setState] = useState<SmartTvSimulationState>("idle");
  const [route, setRoute] = useState<SmartTvRoute>("home");
  const [message, setMessage] = useState("Elige buscar para iniciar un entorno seguro de prueba.");
  const [profileId, setProfileId] = useState(ANDROID_TV_PROFILES[0].id);
  const [darkMode, setDarkMode] = useState(() => typeof window === "undefined" ? true : localStorage.getItem("luka-smart-tv-dark-mode") !== "false");
  const [lastAction, setLastAction] = useState<SmartTvAction | null>(null);
  const [highlightedAction, setHighlightedAction] = useState<SmartTvAction | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const [inputSource, setInputSource] = useState<"button" | "keyboard" | "gesture">("button");
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const scan = () => {
    setState("scanning");
    setMessage("Buscando solo dispositivos simulados… no se realiza descubrimiento Bluetooth/Wi‑Fi.");
    window.setTimeout(() => setState("found"), 850);
  };
  const simulateNotFound = () => {
    setState("scanning");
    setMessage("Comprobando dispositivos simulados…");
    window.setTimeout(() => {
      setState("failed");
      setMessage(SMART_TV_NOT_FOUND_MESSAGE);
    }, 650);
  };
  const connect = () => {
    setState("connecting");
    setMessage("Preparando un canal de presentación local, sin comandos de juego ni datos de wallet.");
    window.setTimeout(() => {
      setState("connected");
      setMessage(`${SMART_TV_CONNECTED_MESSAGE}. Prueba la navegación contextual antes de integrar un TV real.`);
    }, 700);
  };
  const reset = () => {
    setState("idle");
    setRoute("home");
    setLastAction(null);
    setMessage("Elige buscar para iniciar un entorno seguro de prueba.");
  };
  const move = (action: SmartTvAction, source: "button" | "keyboard" | "gesture" = "button") => {
    setLastAction(action);
    setHighlightedAction(action);
    setInputSource(source);
    if (source === "keyboard") playNavigationTone(action);
    window.setTimeout(() => setHighlightedAction((current) => current === action ? null : current), 240);
    setRoute((current) => nextSmartTvRoute(current, action));
    setMessage(`Comando visual ejecutado: ${action.toUpperCase()}. La pantalla virtual refleja el cambio.`);
  };

  const mapKeyToAction = (key: string): SmartTvAction | null => mapSmartTvKeyToAction(key);
  const content = ROUTE_CONTENT[route];
  const selectedProfile = ANDROID_TV_PROFILES.find((profile) => profile.id === profileId) ?? ANDROID_TV_PROFILES[0];
  const actionLabel = lastAction ? lastAction === "ok" ? "OK · confirmar" : lastAction === "home" ? "INICIO" : lastAction.toUpperCase() : "Sin comando";

  useEffect(() => {
    localStorage.setItem("luka-smart-tv-dark-mode", String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (state !== "connected") return;
    screenRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      const action = mapKeyToAction(event.key);
      if (!action) return;
      event.preventDefault();
      move(action, "keyboard");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (state !== "connected") return;
    touchStartRef.current = { x: event.clientX, y: event.clientY, time: Date.now() };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || state !== "connected") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const elapsed = Date.now() - start.time;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24 && elapsed < 500) {
      move("ok", "gesture");
      return;
    }
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left", "gesture");
    else if (Math.abs(dy) >= 24) move(dy > 0 ? "down" : "up", "gesture");
  };

  return (
    <section data-simulator-theme={darkMode ? "dark" : "light"} className={`mt-8 border p-5 shadow-[0_0_40px_rgba(39,245,208,.12)] transition-colors duration-300 ${darkMode ? "border-cyan-200/25 bg-[#071a18]/95 text-white" : "border-cyan-700/25 bg-slate-100 text-slate-950"}`} aria-label="Simulador de conexión Smart TV">
      <div className="flex items-start justify-between gap-4"><div><p className={`text-xs font-bold uppercase tracking-[.16em] ${darkMode ? "text-cyan-200" : "text-cyan-800"}`}>Simulador local · Smart TV</p><h2 className={`mt-2 font-display text-3xl ${darkMode ? "text-white" : "text-slate-950"}`}>Prueba la navegación antes de conectar</h2><p className={`mt-2 max-w-2xl text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>Este entorno reproduce búsqueda, conexión y controles de presentación. No descubre dispositivos reales, no solicita permisos y no puede modificar MJP CORE.</p></div><div className="flex items-center gap-2"><Button type="button" variant="outline" onClick={() => setDarkMode((current) => !current)} aria-pressed={darkMode} className={darkMode ? "border-cyan-200/30 bg-cyan-200/10 text-cyan-50 hover:bg-cyan-200/20 hover:text-white" : "border-cyan-700/30 bg-white text-cyan-900 hover:bg-cyan-50"}>{darkMode ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}{darkMode ? "Modo oscuro" : "Modo claro"}</Button><Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar simulador" className={darkMode ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-600 hover:bg-cyan-100 hover:text-slate-950"}><X className="h-5 w-5" /></Button></div></div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
        <div className={`border p-4 transition-colors duration-300 ${darkMode ? "border-white/10 bg-black/20" : "border-cyan-900/15 bg-white/80"}`}><div className="flex items-center gap-3"><div className={`grid h-12 w-12 place-items-center border ${state === "connected" ? "border-emerald-300/50 bg-emerald-300/10 text-emerald-200" : "border-cyan-200/30 bg-cyan-200/10 text-cyan-100"}`}>{state === "scanning" || state === "connecting" ? <Loader2 className="h-6 w-6 animate-spin" /> : state === "connected" ? <Check className="h-6 w-6" /> : <MonitorPlay className="h-6 w-6" />}</div><div><p className="text-sm font-bold">{SMART_TV_SIMULATION_STEPS.find((item) => item.state === state)?.label ?? "Simulación"}</p><p className="mt-1 text-xs text-slate-400">Canal: PRESENTATION_ONLY · entorno local</p></div></div><div className="mt-5 space-y-2">{SMART_TV_SIMULATION_STEPS.map((step, index) => <div key={step.state} className={`flex items-center gap-3 border px-3 py-2 text-xs ${step.state === state ? "border-cyan-200/40 bg-cyan-200/10 text-cyan-50" : "border-white/8 text-slate-500"}`}><span className="font-mono">0{index + 1}</span><span>{step.label}</span>{step.state === state ? <CircleDot className="ml-auto h-3.5 w-3.5 text-cyan-200" /> : null}</div>)}</div><label className="mt-5 block text-xs text-slate-300">Perfil Android TV<select value={profileId} onChange={(event) => { setProfileId(event.target.value); setMessage(`Perfil seleccionado: ${ANDROID_TV_PROFILES.find((profile) => profile.id === event.target.value)?.label ?? "Android TV"}.`); }} className="mt-2 w-full border border-cyan-200/25 bg-[#06100e] px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-200/70"><option value={ANDROID_TV_PROFILES[0].id}>{ANDROID_TV_PROFILES[0].label}</option><option value={ANDROID_TV_PROFILES[1].id}>{ANDROID_TV_PROFILES[1].label}</option><option value={ANDROID_TV_PROFILES[2].id}>{ANDROID_TV_PROFILES[2].label}</option></select></label><p className="mt-4 text-xs leading-5 text-cyan-100/75" aria-live="polite">{message}</p><p className="mt-2 text-[11px] text-slate-500">{selectedProfile.model} · foco previsto: {selectedProfile.focusNotes}</p><div className="mt-5 flex flex-wrap gap-2">{state === "idle" ? <><Button type="button" onClick={scan} className="bg-cyan-200 text-[#06201a] hover:bg-cyan-100"><Wifi className="mr-2 h-4 w-4" />Buscar TV simulada</Button><Button type="button" variant="outline" onClick={simulateNotFound} className="border-amber-200/25 bg-amber-200/5 text-amber-50 hover:bg-amber-200/10 hover:text-white">Probar TV no encontrada</Button></> : null}{state === "found" ? <Button type="button" onClick={connect} className="bg-emerald-300 text-[#06201a] hover:bg-emerald-200"><Power className="mr-2 h-4 w-4" />Conectar entorno</Button> : null}{state === "failed" ? <Button type="button" onClick={scan} className="bg-cyan-200 text-[#06201a] hover:bg-cyan-100"><Wifi className="mr-2 h-4 w-4" />Reintentar búsqueda</Button> : null}{state === "connected" ? <Button type="button" onClick={onOpenTv} className="gold-button">Abrir flujo TV</Button> : null}<Button type="button" variant="outline" onClick={reset} className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"><RotateCcw className="mr-2 h-4 w-4" />Reiniciar</Button></div></div>
        <div className={`border p-4 transition-colors duration-300 ${state === "connected" ? (darkMode ? "border-emerald-300/30 bg-[radial-gradient(circle_at_65%_20%,rgba(39,245,208,.16),transparent_38%),#08120f]" : "border-emerald-700/25 bg-emerald-50") : (darkMode ? "border-white/10 bg-black/20" : "border-cyan-900/15 bg-white/80")}`}><div className="flex items-center justify-between border-b border-white/10 pb-3"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-emerald-200">Vista del televisor</p><p className="mt-1 text-sm text-slate-300">{state === "connected" ? "Conectado a Smart TV · simulación" : "Sin conexión"}</p></div><div className="flex items-center gap-2 text-xs text-slate-400"><span className={`h-2 w-2 rounded-full ${state === "connected" ? "bg-emerald-300" : "bg-slate-600"}`} />{state === "connected" ? "ONLINE" : "OFFLINE"}</div></div>{state === "failed" ? <div className="mt-4 border border-amber-200/30 bg-amber-200/5 p-4" aria-label="Fallback de conexión por código QR"><div className="flex items-center gap-2 text-sm font-bold text-amber-50"><QrCode className="h-4 w-4" />Conecta mediante código QR</div><p className="mt-2 text-xs leading-5 text-amber-100/80">Sigue estos pasos para continuar la prueba de presentación:</p><ol className="mt-3 space-y-2 text-xs text-slate-200"><li><strong>1.</strong> Abre la cámara del teléfono o la aplicación LUKA en el TV.</li><li><strong>2.</strong> Escanea el código de vinculación mostrado en la pantalla.</li><li><strong>3.</strong> Confirma el mismo código en ambos dispositivos.</li><li><strong>4.</strong> Regresa a este simulador para reintentar.</li></ol><div className="relative mx-auto mt-4 grid h-28 w-28 place-items-center border-4 border-white bg-white p-2" aria-label="Código QR simulado"><div className="h-full w-full bg-[repeating-conic-gradient(#06100e_0_25%,#fff_0_50%)] [background-size:16px_16px]" /><span className="absolute inset-x-2 top-1/2 h-1 -translate-y-1/2 animate-pulse bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,.9)]" /></div><p className="mt-3 text-center text-[11px] text-amber-100/70">Animación de escaneo · código solo de prueba</p></div> : null}<div ref={screenRef} tabIndex={state === "connected" ? 0 : -1} className={`mt-4 grid min-h-[220px] touch-none place-items-center border ${darkMode ? "bg-[#06100e]" : "bg-slate-50"} p-6 text-center outline-none transition-[border-color,box-shadow,transform] duration-200 focus-visible:border-cyan-200/70 focus-visible:ring-2 focus-visible:ring-cyan-200/30 ${highlightedAction ? "border-cyan-200/75 shadow-[0_0_30px_rgba(34,211,238,.28)] motion-safe:scale-[1.005]" : "border-white/10"}`} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} title="Desliza para navegar; toca para confirmar"><div><div className="mx-auto mb-4 flex items-center justify-center gap-2"><span className={`h-3 w-3 rounded-full ${state === "connected" ? "bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,.8)]" : "bg-slate-700"}`} /><span className="text-[10px] font-bold uppercase tracking-[.14em] text-slate-500">{state === "connected" ? "Pantalla activa" : "Esperando conexión"}</span></div><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-200">{content.eyebrow}</p><h3 className="mt-3 font-display text-3xl text-white">{content.title}</h3><div className="mt-5 flex flex-wrap justify-center gap-2">{content.items.map((item, index) => <span key={item} className={`border px-3 py-2 text-xs ${index === 0 && state === "connected" ? "border-amber-200/60 bg-amber-200/10 text-amber-100" : "border-white/10 text-slate-400"}`}>{item}</span>)}</div><p className={`mt-5 border px-3 py-2 text-[11px] text-cyan-100 transition-[background-color,border-color] duration-200 ${highlightedAction ? "border-cyan-200/70 bg-cyan-200/15" : "border-cyan-200/20 bg-cyan-200/5"}`} aria-live="polite">Último comando: <strong>{actionLabel}</strong> · entrada: <strong>{inputSource === "keyboard" ? "teclado físico" : inputSource === "gesture" ? "gesto táctil" : "botón"}</strong>{highlightedAction ? <span className="ml-2 font-bold text-emerald-200 motion-safe:animate-pulse">· recibido</span> : null}</p><p className="mt-2 text-[10px] text-slate-500">Teclado: flechas · Enter · Escape · Home &nbsp;|&nbsp; Táctil: desliza o toca</p><p className="mt-2 flex items-center justify-center gap-1 text-[10px] text-slate-600"><Volume2 className="h-3 w-3" />Feedback sonoro sutil al navegar por teclado</p></div></div><div className="mt-4 flex items-center justify-between gap-4"><div className="grid grid-cols-3 gap-2"><span /><Button type="button" variant="outline" size="icon" disabled={state !== "connected"} onClick={() => move("up")} aria-label="Arriba" aria-pressed={highlightedAction === "up"} className={`border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white ${highlightedAction === "up" ? "border-cyan-200/80 bg-cyan-200/20 shadow-[0_0_18px_rgba(34,211,238,.38)]" : ""}`}><ArrowUp className="h-4 w-4" /></Button><span /><Button type="button" variant="outline" size="icon" disabled={state !== "connected"} onClick={() => move("left")} aria-label="Izquierda" aria-pressed={highlightedAction === "left"} className={`border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white ${highlightedAction === "left" ? "border-cyan-200/80 bg-cyan-200/20 shadow-[0_0_18px_rgba(34,211,238,.38)]" : ""}`}><ArrowLeft className="h-4 w-4" /></Button><Button type="button" variant="outline" size="icon" disabled={state !== "connected"} onClick={() => move("ok")} aria-label="OK" className="border-emerald-300/35 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20">OK</Button><Button type="button" variant="outline" size="icon" disabled={state !== "connected"} onClick={() => move("right")} aria-label="Derecha" aria-pressed={highlightedAction === "right"} className={`border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white ${highlightedAction === "right" ? "border-cyan-200/80 bg-cyan-200/20 shadow-[0_0_18px_rgba(34,211,238,.38)]" : ""}`}><ArrowRight className="h-4 w-4" /></Button><span /><Button type="button" variant="outline" size="icon" disabled={state !== "connected"} onClick={() => move("down")} aria-label="Abajo" aria-pressed={highlightedAction === "down"} className={`border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white ${highlightedAction === "down" ? "border-cyan-200/80 bg-cyan-200/20 shadow-[0_0_18px_rgba(34,211,238,.38)]" : ""}`}><ArrowDown className="h-4 w-4" /></Button><span /></div><p className="max-w-[220px] text-right text-xs leading-5 text-slate-500">Solo acciones de navegación visual. El simulador no ejecuta apuestas, RNG, wallet, ledger ni settlement.</p></div></div>
      </div>
    </section>
  );
}
