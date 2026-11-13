import { Activity } from "lucide-react";

interface CentralStudioPanelProps {
  isGenerating: boolean;
}

export default function CentralStudioPanel({ isGenerating }: CentralStudioPanelProps) {
  return (
    <div className="flex-1 flex flex-col bg-[#061522] h-full overflow-hidden relative">
      <div className="flex items-center justify-between p-2 border-b border-[#1e293b] bg-[#0b1320]">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-[#38bdf8]" />
          <span className="text-[#e2e8f0] font-bold text-sm">ARKI · Funnel canónico 9→4→1</span>
        </div>
        <div className="text-xs text-[#64748b]">
          {isGenerating ? "Generación en curso..." : "Gestión centralizada"}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <p className="text-sm text-[#cbd5e1]">
            El proceso de alternativas y decisiones se ejecuta en una única autoridad.
          </p>
          <a
            href="/arki-design-funnel"
            className="mt-4 inline-flex rounded-md bg-[#f0a35b] px-4 py-2 text-sm font-semibold text-[#111827]"
          >
            Abrir ARKI Design Funnel
          </a>
        </div>
      </div>
    </div>
  );
}
