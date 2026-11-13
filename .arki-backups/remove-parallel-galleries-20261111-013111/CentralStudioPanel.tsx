import { Activity } from "lucide-react";
import ProposalGallery from "./ProposalGallery";

interface CentralStudioPanelProps {
  partis: any[];
  isGenerating: boolean;
}

export default function CentralStudioPanel({ partis, isGenerating }: CentralStudioPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#061522] h-full overflow-hidden relative">
      {/* Barra superior del Estudio */}
      <div className="flex items-center justify-between p-2 border-b border-[#1e293b] bg-[#0b1320]">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#38bdf8]" />
          <span className="text-[#e2e8f0] font-bold text-sm">Embudo de Diseño - Funnel 16-4-1</span>
        </div>
        <div className="text-xs text-[#64748b]">
          {isGenerating ? "Generando propuestas..." : "Esperando propuesta..."}
        </div>
      </div>

      {/* Contenido (Galería o Estado vacío) */}
      <div className="flex-1 relative">
        {isGenerating ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#64748b]">
            <div className="w-16 h-16 border-4 border-[#1e293b] border-t-[#f0a35b] rounded-full animate-spin mb-4"></div>
            <p>ARKI está calculando las geometrías...</p>
          </div>
        ) : partis.length > 0 ? (
          <ProposalGallery proposals={partis} />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#475569]">
            <p className="text-sm">Pídele a ARKI que genere un edificio para ver las propuestas aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
}
