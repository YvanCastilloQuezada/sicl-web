import { useState } from "react";
import { X, MapPin, Camera, Box, FolderKanban, FileText, Code2, PenTool, Activity, Layers } from "lucide-react";

interface WorkspacePanelProps {
  onClose: () => void;
  onOpenTool: (tool: string) => void;
}

export default function WorkspacePanel({ onClose, onOpenTool }: WorkspacePanelProps) {
  const [activeCategory, setActiveCategory] = useState('Diseño');

  const categories = ['Diseño', 'Análisis', 'Gestión', 'Ingeniería'];

  const tools = {
    'Diseño': [
      { id: 'nodes', name: 'Generador Paramétrico (Nodos)', desc: 'Crea lógica visual con nodos', icon: <Code2 size={20} className="text-[#38bdf8]" /> },
      { id: 'editor', name: 'Editor de Planos (Canvas)', desc: 'Dibuja y diagrama a mano alzada', icon: <PenTool size={20} className="text-[#a78bfa]" /> },
      { id: 'ar', name: 'Visor de Realidad Aumentada', desc: 'Coloca el modelo en el mundo real', icon: <Box size={20} className="text-[#4ade80]" /> },
    ],
    'Análisis': [
      { id: 'analysis', name: 'Dashboard de Análisis', desc: 'Gráficos 4D, 5D y 6D', icon: <Activity size={20} className="text-[#fbbf24]" /> },
      { id: 'camera', name: 'Escáner 3D (Visión IA)', desc: 'Convierte fotos en planos', icon: <Camera size={20} className="text-[#f472b6]" /> },
    ],
    'Gestión': [
      { id: 'terreno', name: 'Selección de Terreno', desc: 'Mapa global interactivo', icon: <MapPin size={20} className="text-[#38bdf8]" /> },
      { id: 'projects', name: 'Gestor de Proyectos', desc: 'Guarda y carga tus diseños', icon: <FolderKanban size={20} className="text-[#4ade80]" /> },
      { id: 'documents', name: 'Documentos SUNARP', desc: 'Sube planos y extrae parámetros', icon: <FileText size={20} className="text-[#fbbf24]" /> },
    ],
    'Ingeniería': [
      { id: 'expediente', name: 'Expediente Técnico', desc: 'Documentación Estatal y Privada', icon: <Layers size={20} className="text-[#f472b6]" /> },
    ]
  };

  return (
    <div className="fixed inset-y-0 right-0 z-[9999] w-[400px] bg-[#0b1320] border-l border-[#1e293b] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#1e293b] bg-[#0f172a]">
        <h2 className="text-[#e2e8f0] font-bold text-lg flex items-center gap-2">
          <Layers size={20} className="text-[#f0a35b]" /> Workspace
        </h2>
        <button onClick={onClose} className="text-[#64748b] hover:text-white bg-[#1e293b] p-1 rounded">
          <X size={20} />
        </button>
      </div>

      {/* Tabs de Categorías */}
      <div className="flex overflow-x-auto border-b border-[#1e293b] bg-[#0a1825]">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors ${
              activeCategory === cat ? 'text-[#38bdf8] border-b-2 border-[#38bdf8]' : 'text-[#64748b] hover:text-[#e2e8f0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Herramientas */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tools[activeCategory as keyof typeof tools].map(tool => (
          <button
            key={tool.id}
            onClick={() => { onOpenTool(tool.id); onClose(); }}
            className="w-full flex items-start gap-4 p-4 bg-[#1e293b] border border-[#334155] rounded-xl hover:border-[#38bdf8] hover:bg-[#1e293b]/80 transition group text-left"
          >
            <div className="bg-[#0f172a] p-2 rounded-lg group-hover:scale-110 transition-transform">
              {tool.icon}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#e2e8f0] group-hover:text-[#38bdf8] transition-colors">{tool.name}</h3>
              <p className="text-xs text-[#64748b] mt-1">{tool.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1e293b] bg-[#0f172a] text-center">
        <p className="text-[10px] text-[#64748b]">ARKI OS v2.0 • Workspace Module</p>
      </div>
    </div>
  );
}
