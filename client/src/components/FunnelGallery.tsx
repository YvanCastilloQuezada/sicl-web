import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Mock data para la galería (en producción, vendría del motor de generación)
const MOCK_CANDIDATES = [
  { id: "A01", name: "Alternativa 01", desc: "Patio central · 78%", strategy: "PATIO" },
  { id: "A02", name: "Alternativa 02", desc: "Espina pública · 80%", strategy: "SPINE" },
  { id: "A03", name: "Alternativa 03", desc: "Núcleo compacto · 82%", strategy: "CORE" },
  { id: "A04", name: "Alternativa 04", desc: "Borde climático · 84%", strategy: "EDGE" },
];

export default function FunnelGallery() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#061522] text-[#d7e8f2]">
      {/* Barra superior de vistas */}
      <div className="flex items-center gap-2 p-3 border-b border-[#28445b]">
        <span className="text-xs font-bold text-[#d4ff3a]">FUNNEL 16-4-1</span>
        <div className="flex gap-1 ml-4">
          {["Planta", "3D", "Corte", "Programa", "Costo", "Técnico"].map(v => (
            <button key={v} className="px-3 py-1 text-[10px] rounded border border-[#28445b] hover:bg-[#1e293b]">
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Galería de tarjetas */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {MOCK_CANDIDATES.map((candidate) => (
            <div 
              key={candidate.id}
              className={`border rounded-lg overflow-hidden cursor-pointer transition ${
                selected.includes(candidate.id) 
                  ? "border-[#d4ff3a] bg-[#102538]" 
                  : "border-[#28445b] hover:border-[#d4ff3a]/50"
              }`}
              onClick={() => toggleSelection(candidate.id)}
            >
              {/* Visor 3D en miniatura */}
              <div className="relative aspect-video bg-[#0a1825]">
                <div className="absolute inset-0 opacity-30" style={{ 
                  backgroundImage: 'radial-gradient(#d4ff3a 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }} />
                <div className="absolute inset-4 border border-[#d4ff3a]/30 rounded flex items-center justify-center">
                  <span className="text-[10px] text-[#d4ff3a]/60">VISTA CONCEPTUAL</span>
                </div>
                <Badge className="absolute top-2 right-2 bg-[#061522]/80 text-[#d4ff3a] border-[#d4ff3a]/30 text-[10px]">
                  {candidate.id}
                </Badge>
              </div>

              {/* Datos */}
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold">{candidate.name}</h3>
                  {selected.includes(candidate.id) && (
                    <span className="w-2 h-2 rounded-full bg-[#d4ff3a]" />
                  )}
                </div>
                <p className="text-[10px] text-[#8fa8bc] mt-1">{candidate.desc}</p>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    className={`text-[10px] h-7 ${
                      selected.includes(candidate.id)
                        ? "bg-[#d4ff3a] text-black"
                        : "bg-transparent border border-[#28445b] text-[#d7e8f2]"
                    }`}
                  >
                    {selected.includes(candidate.id) ? "Seleccionado" : "Elegir"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra inferior con resumen */}
      <div className="p-3 border-t border-[#28445b] flex items-center justify-between">
        <span className="text-[10px] text-[#8fa8bc]">
          {selected.length} de 4 seleccionadas
        </span>
        <Button 
          size="sm" 
          className="bg-[#d4ff3a] text-black text-[10px] h-7"
          disabled={selected.length === 0}
        >
          Promover a Finalistas
        </Button>
      </div>
    </div>
  );
}
