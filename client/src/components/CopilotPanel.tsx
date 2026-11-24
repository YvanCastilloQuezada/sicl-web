import { useState, useRef, useEffect } from "react";
import { Send, Mic, Plus, Paperclip, Image, Globe, Code, Camera, Video, Glasses, CheckCircle2, Loader2, Minimize2 } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

interface CopilotPanelProps {
  messages: { role: string, text: string }[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isGenerating: boolean;
  onOpenAction: (action: string) => void;
  onOpenWorkspace: () => void;
}

export default function CopilotPanel({ messages, input, setInput, onSend, isGenerating, onOpenAction, onOpenWorkspace }: CopilotPanelProps) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [avatarPose, setAvatarPose] = useState<"idle" | "listening" | "thinking" | "voice" | "camera" | "video" | "ar" | "send">("idle");
  const { isListening, startListening } = useSpeech();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const transientPoses = ["listening", "thinking", "camera", "video", "ar", "send", "voice"];
    if (!transientPoses.includes(avatarPose)) return;
    if (avatarPose === "listening" && isListening) return;
    if (avatarPose === "thinking" && isGenerating) return;
    if (isListening || isGenerating) return;
    const resetDelay = avatarPose === "listening" ? 900 : avatarPose === "thinking" ? 1200 : 1400;
    const timeout = window.setTimeout(() => setAvatarPose("idle"), resetDelay);
    return () => window.clearTimeout(timeout);
  }, [avatarPose, isListening, isGenerating]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const effectivePose = isListening ? "listening" : isGenerating ? "thinking" : avatarPose;
  const poseFile: Record<string, string> = { idle: "arki_idle.png", listening: "arki_listening.png", thinking: "arki_thinking.png", voice: "arki_voice_active.png", camera: "arki_camera_active.png", video: "arki_idle_ready.png", ar: "arki_idle_ready.png", send: "arki_send_active.png" };
  const avatarSrc = `/arki/poses/${poseFile[effectivePose] ?? "arki_idle.png"}`;
  const status = isListening ? "ESCUCHANDO" : isGenerating ? "ANALIZANDO" : "EN LÍNEA";
  const statusColor = isListening ? "text-rose-300 border-rose-400/40 bg-rose-400/10" : isGenerating ? "text-amber-300 border-amber-400/40 bg-amber-400/10" : "text-emerald-300 border-emerald-400/40 bg-emerald-400/10";

  return isMinimized ? (
    <button
      type="button"
      aria-label="Restaurar Copiloto ARKI"
      title="Abrir Copiloto ARKI"
      onClick={() => setIsMinimized(false)}
      className="fixed bottom-5 right-5 z-[120] h-20 w-20 rounded-full border-2 border-cyan-400 bg-[#071321] shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:scale-105 transition-transform overflow-hidden"
    >
      <img src={avatarSrc} alt="ARKI" className="h-full w-full object-contain" />
      <span className="absolute bottom-1 right-1 h-3 w-3 rounded-full border-2 border-[#071321] bg-emerald-400" />
    </button>
  ) : (
    <div className="flex flex-col h-full min-h-0 bg-[#071321] text-slate-100">
      <header className="flex items-center justify-between gap-3 p-3 border-b border-cyan-900/60 bg-[#091827]">
        <div className="flex items-center gap-2 min-w-0">
          <img src={avatarSrc} alt={`ARKI — ${effectivePose}`} className="h-10 w-10 shrink-0 object-contain rounded-xl border border-cyan-500/40 bg-[#071321]" />
          <h2 className="font-bold tracking-wide">Copiloto ARKI</h2>
          <span className="hidden md:inline text-[10px] uppercase tracking-[0.18em] text-slate-400">Arquitectura · IA · Geometría · AGK</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider ${statusColor}`}>
          <span className={`h-2 w-2 rounded-full ${isListening ? "bg-rose-400 animate-pulse" : isGenerating ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
          {status}
        </span>
        <button type="button" aria-label="Minimizar Copiloto ARKI" title="Minimizar" onClick={() => setIsMinimized(true)} className="p-2 rounded-lg text-cyan-300 hover:text-white hover:bg-[#1e3a54] transition">
          <Minimize2 size={17}/>
        </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4">
        {messages.length === 0 && (
          <section className="rounded-2xl border border-cyan-800/70 bg-gradient-to-br from-[#0a2238] via-[#0b1b2b] to-[#081522] p-4 md:p-5 shadow-[0_0_30px_rgba(0,195,220,0.08)]">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse" />
                <div className="h-36 w-36 md:h-44 md:w-44 rounded-2xl border border-cyan-400/50 bg-[#071321] overflow-hidden flex items-center justify-center shadow-[0_0_28px_rgba(34,211,238,0.18)]">
                  <img src={avatarSrc} alt={`ARKI, asistente de arquitectura — ${effectivePose}`} className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg md:text-xl font-bold text-white">Hola, soy ARKI.</p>
                <p className="mt-1 text-sm text-slate-300">Tu asistente de arquitectura e ingeniería. Puedo ayudarte a explorar propuestas, revisar geometría y trabajar con las herramientas disponibles en tu proyecto.</p>
                <ul className="mt-3 grid gap-1.5 text-xs md:text-sm text-slate-200">
                  <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400"/>Generación y evaluación de propuestas arquitectónicas</li>
                  <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400"/>Geometría AGK, modelos y flujo IFC/BIM</li>
                  <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400"/>Sitio, contexto, normativa y criterios de diseño</li>
                  <li className="flex gap-2"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400"/>Evaluación, simulación y síntesis de resultados</li>
                </ul>
              </div>
            </div>
          </section>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role !== "user" && (
              <div className="mr-2 mt-1 h-8 w-8 shrink-0 rounded-full border border-cyan-700 bg-[#102b43] flex items-center justify-center text-[10px] font-bold text-amber-300">A</div>
            )}
            <div className={`max-w-[88%] rounded-2xl p-3 text-sm whitespace-pre-wrap break-words ${msg.role === "user" ? "bg-amber-400 text-[#111827] rounded-br-sm" : "bg-[#10243a] text-slate-100 rounded-bl-sm border border-cyan-900/60"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-cyan-200/80 pl-10">
            <Loader2 size={14} className="animate-spin"/> ARKI está analizando…
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 border-t border-cyan-900/60 bg-[#081726] relative">
        {showPlusMenu && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setShowPlusMenu(false)} />
            <div className="absolute bottom-full left-3 mb-2 w-72 bg-[#10243a] border border-cyan-900/70 rounded-xl shadow-2xl overflow-hidden z-[100]">
              <div className="p-2 space-y-1">
                <button onClick={() => { onOpenAction("upload"); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:bg-[#1e3a54] rounded-lg text-left">
                  <Paperclip size={16} className="text-cyan-300"/> Subir planos (IFC, DWG, PDF)
                </button>
                <button onClick={() => { onOpenAction("render"); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:bg-[#1e3a54] rounded-lg text-left">
                  <Image size={16} className="text-fuchsia-300"/> Generar renders e imágenes
                </button>
                <button onClick={() => { onOpenAction("norms"); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:bg-[#1e3a54] rounded-lg text-left">
                  <Globe size={16} className="text-emerald-300"/> Buscar normativa (RNE)
                </button>
                <button onClick={() => { onOpenAction("code"); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-200 hover:bg-[#1e3a54] rounded-lg text-left">
                  <Code size={16} className="text-amber-300"/> Generar código paramétrico
                </button>
                <button onClick={() => { onOpenWorkspace(); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-cyan-300 font-bold hover:bg-[#1e3a54] rounded-lg text-left border-t border-cyan-900/60 mt-1 pt-2">
                  <Plus size={16}/> Más herramientas (Workspace)
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex items-stretch gap-2 bg-[#071321] border border-cyan-900/70 rounded-2xl p-1.5 focus-within:border-cyan-400/70 transition">
          <button aria-label="Abrir menú de herramientas" title="Más herramientas" onClick={() => setShowPlusMenu(!showPlusMenu)} className="self-end p-2 hover:bg-[#1e3a54] rounded-lg text-slate-500 hover:text-white transition">
            <Plus size={18}/>
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); setAvatarPose("send"); onSend(); } }}
            placeholder="Escribe tu consulta o instrucción a ARKI…"
            rows={3}
            className="flex-1 min-w-0 resize-none bg-transparent text-sm text-slate-100 outline-none px-2 py-2 placeholder:text-slate-500"
          />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1 py-1">
            <button aria-label="Hablar con ARKI" title="Micrófono — hablar con ARKI" onClick={() => { setAvatarPose("listening"); startListening((text) => { setInput(text); setAvatarPose("thinking"); }); }} className={`p-2 rounded-lg transition ${isListening ? "bg-rose-500/20 text-rose-300 animate-pulse" : "text-cyan-300 hover:text-white hover:bg-[#1e3a54]"}`}>
              <Mic size={18}/>
            </button>
            <button aria-label="Abrir cámara" title="Capturar, subir y analizar imágenes" onClick={() => { setAvatarPose("camera"); onOpenAction("camera"); }} className="p-2 rounded-lg text-cyan-300 hover:text-white hover:bg-[#1e3a54] transition">
              <Camera size={18}/>
            </button>
            <button aria-label="Entrada de video" title="Video (si está habilitado)" onClick={() => { setAvatarPose("video"); onOpenAction("video"); }} className="p-2 rounded-lg text-cyan-300 hover:text-white hover:bg-[#1e3a54] transition">
              <Video size={18}/>
            </button>
            <button aria-label="Abrir Realidad Aumentada" title="AR — anclar y manipular modelos 3D" onClick={() => { setAvatarPose("ar"); onOpenAction("ar"); }} className="p-2 rounded-lg text-violet-300 font-bold text-xs tracking-wide hover:text-white hover:bg-[#1e3a54] transition">
              <Glasses size={18}/>
            </button>
            <button aria-label="Enviar mensaje" title="Enviar" onClick={() => { setAvatarPose("send"); onSend(); }} disabled={!input.trim() || isGenerating} className="p-2.5 sm:px-4 bg-cyan-400 text-[#041321] rounded-xl hover:bg-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed">
              <Send size={18}/>
            </button>
          </div>
        </div>
        <p className="mt-1.5 text-[10px] text-slate-500 text-center">ARKI puede proponer y analizar; las acciones que modifican el proyecto requieren verificación.</p>
      </div>
    </div>
  );
}
