import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Camera, History, Mic, Sparkles, Tv, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLukaAlternativeCommands, LUKA_ENTRY_PROMPT, LUKA_NO_RESPONSE_SECONDS, resolveLukaIntent, type LukaVoiceHistoryItem } from "../../../shared/lukaOsContract";
import { INITIAL_CONTEXT_STATE } from "../../../shared/lukaRuntimeContract";
import { decideUniversalIntent, universalIntentFromVoice } from "../../../shared/universalInteraction";
import { getLukaContinuity, getLukaPresenceCopy, transitionLukaPresence, type LukaPresenceState } from "../../../shared/lukaPresenceAdvanced";
import { ttsTextForIntent } from "../../../shared/voiceProductive";

type SpeechRecognitionLike = new () => {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
};

function getSpeechRecognition() {
  const scope = window as Window & { SpeechRecognition?: SpeechRecognitionLike; webkitSpeechRecognition?: SpeechRecognitionLike };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

function speakLuka(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(ttsTextForIntent(text));
  utterance.lang = "es-PE";
  utterance.rate = 0.98;
  utterance.pitch = 1.03;
  window.speechSynthesis.speak(utterance);
  return true;
}

const VOICE_HISTORY_KEY = "luka-os-voice-history";
function loadVoiceHistory(): LukaVoiceHistoryItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(VOICE_HISTORY_KEY) ?? "[]");
    return Array.isArray(value) ? (value as LukaVoiceHistoryItem[]).slice(0, 5) : [];
  } catch {
    return [];
  }
}

const stateLabels: Record<LukaPresenceState, string> = {
  PRESENCE: "LUKA está aquí",
  LISTENING: "LUKA está escuchando",
  SPEAKING: "LUKA está respondiendo",
  THINKING: "LUKA está pensando",
  SILENT: "LUKA está en silencio",
};

export default function LukaUniversalEntry() {
  const [, navigate] = useLocation();
  const [presenceState, setPresenceState] = useState<LukaPresenceState>("PRESENCE");
  const [status, setStatus] = useState("Di LUKA… para dar órdenes");
  const [voiceError, setVoiceError] = useState("");
  const [suggestions, setSuggestions] = useState<readonly string[]>([]);
  const [voiceHistory, setVoiceHistory] = useState<LukaVoiceHistoryItem[]>(loadVoiceHistory);
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);

  const go = (spoken: string) => {
    const universalIntent = universalIntentFromVoice(spoken);
    const intent = resolveLukaIntent(spoken);
    const decision = decideUniversalIntent(universalIntent, { permissions: INITIAL_CONTEXT_STATE, connected: true, role: "guest" });
    setVoiceError("");
    if (decision.status === "DENIED") {
      setPresenceState((current) => transitionLukaPresence(current, "silence"));
      setVoiceError(decision.reason);
      setSuggestions(["El Mundo de MiLukita", "Ver TV"]);
      setStatus("LUKA mantiene esta capacidad reservada para una fase posterior.");
      return;
    }
    setSuggestions([]);
    if (intent.id === "enter-world" || intent.id === "return-ar") {
      setPresenceState((current) => transitionLukaPresence(current, "speak-start"));
      const response = getLukaPresenceCopy("SPEAKING", "ar");
      setStatus(response);
      speakLuka(response);
      window.setTimeout(() => navigate("/lukita-ar-stage?entry=presence"), 260);
      return;
    }
    if (intent.id === "watch-tv" || intent.id === "open-netflix" || intent.mode === "tv-media") {
      setPresenceState((current) => transitionLukaPresence(current, "speak-start"));
      const response = getLukaPresenceCopy("SPEAKING", "tv");
      setStatus(response);
      speakLuka(response);
      window.setTimeout(() => navigate("/tv-en-linea"), 260);
      return;
    }
    if (intent.mode === "keyboard" || intent.mode === "gamepad" || intent.mode === "trackpad" || intent.mode === "config") {
      setPresenceState((current) => transitionLukaPresence(current, "silence"));
      setVoiceError("Esta capacidad no forma parte de la presencia pública de Fase D.");
      setSuggestions(["El Mundo de MiLukita", "Ver TV"]);
      setStatus("LUKA mantiene esta capacidad reservada para una fase posterior.");
      return;
    }
    setPresenceState((current) => transitionLukaPresence(current, "silence"));
    setVoiceError("No reconocí esa orden todavía.");
    setSuggestions(getLukaAlternativeCommands(spoken));
    setStatus("Puedes elegir una alternativa o intentarlo de nuevo.");
  };

  const listen = () => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) {
      setPresenceState((current) => transitionLukaPresence(current, "silence"));
      setVoiceError("Este navegador no ofrece reconocimiento de voz.");
      setSuggestions(getLukaAlternativeCommands());
      setStatus("Voz no disponible; usa una entrada táctil.");
      speakLuka("Voz no disponible. Continúa mediante los controles táctiles.");
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "es-PE";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      const intent = resolveLukaIntent(transcript);
      setVoiceHistory((current) => [{ id: `${Date.now()}-${current.length}`, transcript, intentId: intent.id, createdAt: Date.now() }, ...current].slice(0, 5));
      setPresenceState((current) => transitionLukaPresence(current, "intent-detected"));
      setStatus(getLukaPresenceCopy("THINKING", "voice"));
      void go(transcript);
    };
    recognition.onerror = () => {
      setPresenceState((current) => transitionLukaPresence(current, "silence"));
      setVoiceError("No pude escuchar la orden.");
      setSuggestions(getLukaAlternativeCommands());
      setStatus("Puedes probar uno de estos comandos alternativos.");
      speakLuka("No pude escuchar la orden. Puedes usar los controles táctiles.");
    };
    recognitionRef.current = recognition;
    setPresenceState((current) => transitionLukaPresence(current, "listen-start"));
    setStatus(getLukaPresenceCopy("LISTENING", "voice"));
    recognition.start();
  };

  useEffect(() => {
    localStorage.setItem(VOICE_HISTORY_KEY, JSON.stringify(voiceHistory));
  }, [voiceHistory]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (presenceState === "PRESENCE") setStatus("¿Quieres entrar a mi mundo o ver TV?");
    }, LUKA_NO_RESPONSE_SECONDS * 1000);
    return () => window.clearTimeout(timer);
  }, [presenceState]);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const continuity = getLukaContinuity("entry", presenceState);
  const stateTone = presenceState === "LISTENING" ? "border-cyan-200/60 bg-cyan-200/10 text-cyan-50" : presenceState === "THINKING" ? "border-amber-200/60 bg-amber-200/10 text-amber-50" : presenceState === "SPEAKING" ? "border-violet-200/50 bg-violet-200/10 text-violet-50" : presenceState === "SILENT" ? "border-white/15 bg-black/20 text-slate-300" : "border-emerald-200/30 bg-emerald-200/5 text-emerald-100";

  return (
    <section data-luka-presence-state={presenceState} data-luka-identity={continuity.identityVersion} className="relative overflow-hidden border-b border-cyan-200/20 bg-[radial-gradient(circle_at_72%_18%,rgba(39,245,208,.22),transparent_28%),linear-gradient(120deg,#071b18,#071019_55%,#18120c)]">
      <div className="container grid min-h-[520px] items-center gap-8 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-16">
        <div>
          <div className="inline-flex items-center gap-2 border border-amber-200/30 bg-amber-200/10 px-3 py-2 text-xs font-bold uppercase tracking-[.16em] text-amber-100"><Sparkles className="h-4 w-4" /> LUKA · presencia contextual</div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-[.95] text-white sm:text-7xl">Hola, soy <span className="text-gradient-gold">LUKA.</span></h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-200">Estoy aquí para acompañarte. Puedes hablarme o elegir una entrada directa; las capacidades técnicas permanecen detrás de la experiencia.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Button size="lg" className={`gold-button relative overflow-visible ${presenceState === "LISTENING" ? "ring-2 ring-cyan-200 ring-offset-2 ring-offset-[#071b18]" : ""}`} onClick={listen} disabled={presenceState === "LISTENING"}><Mic className="mr-2 h-5 w-5" />{presenceState === "LISTENING" ? "Escuchando…" : "Hablar con LUKA"}</Button><Button size="lg" variant="outline" className="border-cyan-200/30 bg-cyan-200/10 text-cyan-50 hover:bg-cyan-200/20 hover:text-white" onClick={() => go("El Mundo de MiLukita")}><Camera className="mr-2 h-5 w-5" />El Mundo de MiLukita</Button><Button size="lg" variant="outline" className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white" onClick={() => go("Ver TV")}><Tv className="mr-2 h-5 w-5" />Ver TV</Button></div>
          <div className={`mt-5 flex items-center gap-3 border px-3 py-2 text-sm ${stateTone}`} aria-live="polite"><span className="h-2 w-2 rounded-full bg-current" /><span className="font-semibold">{stateLabels[presenceState]}</span><Volume2 className="h-4 w-4" />{status}</div>
          {voiceError ? <div className="mt-4 border border-amber-200/45 bg-amber-200/10 p-4" role="alert"><p className="flex items-center gap-2 text-sm font-bold text-amber-50"><AlertTriangle className="h-4 w-4" />{voiceError}</p><p className="mt-2 text-xs text-amber-100/75">Prueba una de estas órdenes:</p><div className="mt-3 flex flex-wrap gap-2">{suggestions.map((command) => <Button key={command} type="button" variant="outline" size="sm" onClick={() => go(command)} className="border-amber-200/30 bg-amber-200/5 text-amber-50 hover:bg-amber-200/15 hover:text-white">{command}</Button>)}</div></div> : null}
          {voiceHistory.length > 0 ? <div className="mt-4 border border-white/10 bg-black/15 p-4" aria-label="Historial de comandos de voz"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-cyan-100"><History className="h-4 w-4" />Últimos comandos</p><div className="mt-3 grid gap-2">{voiceHistory.map((item) => <Button key={item.id} type="button" variant="outline" size="sm" onClick={() => go(item.transcript)} className="justify-start border-white/10 bg-white/5 text-left text-xs text-slate-200 hover:bg-white/10 hover:text-white"><span className="mr-2 text-cyan-200">↻</span><span className="truncate">{item.transcript}</span><span className="ml-auto text-[10px] text-slate-500">{item.intentId}</span></Button>)}</div></div> : null}
          <p className="mt-3 text-xs text-slate-500">LUKA no solicita cámara, micrófono ni GPS al abrir. Si no respondes en {LUKA_NO_RESPONSE_SECONDS} segundos, te pregunta suavemente.</p>
        </div>
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="aspect-[9/16] border border-cyan-200/45 bg-black/50 p-3 shadow-[0_0_55px_rgba(39,245,208,.18)]"><div className="relative flex h-full flex-col items-center justify-center overflow-hidden border border-emerald-200/20 bg-[radial-gradient(circle_at_52%_40%,rgba(255,210,91,.18),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(39,245,208,.18),transparent_44%),#061313]"><div className="absolute left-4 right-4 top-4 flex items-center justify-between text-xs text-slate-300"><span className="font-display text-xl text-amber-200">L★</span><span className="flex items-center gap-1 text-cyan-100"><span className="h-2 w-2 rounded-full bg-emerald-300" />{stateLabels[presenceState]}</span></div><div className="grid h-36 w-36 place-items-center rounded-full border border-amber-200/45 bg-amber-200/10 shadow-[0_0_60px_rgba(255,210,91,.24)]"><Sparkles className="h-16 w-16 text-amber-200" /></div><p className="mt-7 px-6 text-center font-display text-2xl text-white">{LUKA_ENTRY_PROMPT}</p><div className="mt-8 flex items-center gap-2 border border-cyan-200/25 bg-cyan-200/10 px-4 py-3 text-xs text-cyan-50"><Mic className="h-4 w-4" /> Voz primero · tacto de respaldo</div></div></div>
        </div>
      </div>
    </section>
  );
}
