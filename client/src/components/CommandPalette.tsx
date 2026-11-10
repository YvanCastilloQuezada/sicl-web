import { useState, useEffect } from "react";
import { Search, X, FolderKanban, Box, FileText, Activity } from "lucide-react";

export default function CommandPalette({ onClose, onAction }: { onClose: () => void, onAction: (action: string) => void }) {
  const [query, setQuery] = useState("");
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const commands = [
    { id: 'projects', label: 'Abrir Gestor de Proyectos', icon: <FolderKanban size={16} className="text-[#38bdf8]"/> },
    { id: 'terreno', label: 'Seleccionar Terreno en el Mapa', icon: <MapPin size={16} className="text-[#4ade80]"/> },
    { id: 'analysis', label: 'Ver Análisis (4D, 5D, 6D)', icon: <Activity size={16} className="text-[#fbbf24]"/> },
    { id: 'export', label: 'Exportar Proyecto a IFC', icon: <FileText size={16} className="text-[#fb7185]"/> },
    { id: 'ifc', label: 'Abrir Visor 3D / IFC', icon: <Box size={16} className="text-[#f472b6]"/> },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-[600px] max-w-[90vw] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-[#1e293b]">
          <Search size={20} className="text-[#64748b] mr-3" />
          <input 
            autoFocus
            type="text" 
            placeholder="Escribe un comando o busca una herramienta..." 
            className="flex-1 bg-transparent text-[#e2e8f0] outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} className="text-[#64748b] hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-2 max-h-[50vh] overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-[#64748b] py-4 text-sm">No se encontraron comandos.</p>
          ) : (
            filtered.map(cmd => (
              <button 
                key={cmd.id}
                onClick={() => { onAction(cmd.id); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#e2e8f0] hover:bg-[#1e293b] rounded-lg transition text-left"
              >
                {cmd.icon} {cmd.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
