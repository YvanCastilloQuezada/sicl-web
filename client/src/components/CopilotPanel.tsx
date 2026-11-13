import { useState, useRef, useEffect } from "react";
import { Send, Mic, Plus, Sparkles, Paperclip, Image, Globe, Code, PenTool, Eye, Brain } from "lucide-react";
import { useSpeech } from "@/hooks/useSpeech";

interface CopilotPanelProps {
  messages: { role: string, text: string }[];
  input: string;
  setInput: (val: string) => void;
  onSend: () => void;
  isGenerating: boolean;
  onOpenAction: (action: string) => void;
  onOpenWorkspace: () => void; // Para abrir el menú expandido de herramientas
}

export default function CopilotPanel({ messages, input, setInput, onSend, isGenerating, onOpenAction, onOpenWorkspace }: CopilotPanelProps) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const { isListening, startListening } = useSpeech();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final cuando hay mensajes nuevos
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#0b1320]">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#1e293b]">
        <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
          <Sparkles size={16} className="text-[#f0a35b]" /> Copiloto ARKI
        </h2>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-[#f0a35b] text-black rounded-br-none' 
                : 'bg-[#1e293b] text-[#e2e8f0] rounded-bl-none border border-[#334155]'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-[#1e293b] bg-[#0f172a] relative">
        
        {/* Menú flotante del botón "+" */}
        {showPlusMenu && (
          <>
            <div className="fixed inset-0 z-[90]" onClick={() => setShowPlusMenu(false)}></div>
            <div className="absolute bottom-full left-3 mb-2 w-72 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl overflow-hidden z-[100]">
              <div className="p-2 space-y-1">
                <button onClick={() => { onOpenAction('upload'); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#e2e8f0] hover:bg-[#334155] rounded-lg text-left">
                  <Paperclip size={16} className="text-[#38bdf8]"/> Subir planos (IFC, DWG, PDF)
                </button>
                <button onClick={() => { onOpenAction('render'); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#e2e8f0] hover:bg-[#334155] rounded-lg text-left">
                  <Image size={16} className="text-[#f472b6]"/> Generar renders e imágenes
                </button>
                <button onClick={() => { onOpenAction('norms'); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#e2e8f0] hover:bg-[#334155] rounded-lg text-left">
                  <Globe size={16} className="text-[#4ade80]"/> Buscar normativa (RNE)
                </button>
                <button onClick={() => { onOpenAction('code'); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#e2e8f0] hover:bg-[#334155] rounded-lg text-left">
                  <Code size={16} className="text-[#fbbf24]"/> Generar código paramétrico
                </button>
                <button onClick={() => { onOpenWorkspace(); setShowPlusMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#38bdf8] font-bold hover:bg-[#334155] rounded-lg text-left border-t border-[#334155] mt-1 pt-2">
                  <Plus size={16} /> Más Herramientas (Workspace)
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 bg-[#0b1320] border border-[#334155] rounded-xl p-1 focus-within:border-[#f0a35b] transition">
          <button onClick={() => setShowPlusMenu(!showPlusMenu)} className="p-2 hover:bg-[#334155] rounded-lg text-[#64748b] hover:text-white transition">
            <Plus size={18} />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder="Describe lo que quieres construir..."
            className="flex-1 bg-transparent text-sm text-[#e2e8f0] outline-none px-2"
          />

          <button 
            onClick={() => startListening((text) => setInput(text))}
            className={`p-2 rounded-lg transition ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-[#64748b] hover:text-[#e2e8f0] hover:bg-[#334155]'}`}
          >
            <Mic size={18} />
          </button>

          <button 
            onClick={onSend} 
            disabled={!input.trim() || isGenerating}
            className="p-2 bg-[#f0a35b] text-black rounded-lg hover:bg-[#e09050] transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
