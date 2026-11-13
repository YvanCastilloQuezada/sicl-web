import { useState } from "react";
import { Paperclip, Image as ImageIcon, BookOpen, Code2, PenTool, Eye, Brain } from "lucide-react";

interface WorkspaceMenuProps {
  onAction: (action: string) => void;
}

export default function WorkspaceMenu({ onAction }: WorkspaceMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: string) => {
    onAction(action);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Botón "+" que abre el menú */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 bg-[#1e293b] text-[#e2e8f0] hover:bg-[#334155] rounded-full transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
      </button>

      {/* Panel flotante (idéntico al original) */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)}></div>
          
          <div className="absolute bottom-12 left-0 w-64 bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl z-[999] overflow-hidden">
            <div className="p-2 space-y-1">
              <button onClick={() => handleAction('upload')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <Paperclip size={16} className="text-[#38bdf8]"/> Subir planos y archivos (IFC, DWG, PDF)
              </button>
              <button onClick={() => handleAction('render')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <ImageIcon size={16} className="text-[#f472b6]"/> Generar renders e imágenes
              </button>
              <button onClick={() => handleAction('norms')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <BookOpen size={16} className="text-[#4ade80]"/> Buscar normativa (RNE, OECE)
              </button>
              <button onClick={() => handleAction('code')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <Code2 size={16} className="text-[#fbbf24]"/> Generar código paramétrico
              </button>
              <button onClick={() => handleAction('editor')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <PenTool size={16} className="text-[#a78bfa]"/> Dibuja y adjunta un plano
              </button>
              <button onClick={() => handleAction('vision')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <Eye size={16} className="text-[#f472b6]"/> Visión Artificial (Analizar imagen)
              </button>
              <button onClick={() => handleAction('brain')} className="w-full flex items-center gap-3 text-left px-3 py-2 text-[12px] text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition">
                <Brain size={16} className="text-[#fbbf24]"/> Razonamiento detallado (ARKI Brain)
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
