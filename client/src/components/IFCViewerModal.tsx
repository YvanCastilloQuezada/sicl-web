import { X } from "lucide-react";
import ProfessionalFamilyViewer from "./ProfessionalFamilyViewer";

export default function IFCViewerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-[#090e14]">
      <div className="flex items-center justify-between p-3 border-b border-[#1e293b] bg-[#0f172a]">
        <h2 className="text-[#e2e8f0] font-bold">Visor 3D / IFC</h2>
        <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0] bg-[#1e293b] p-1 rounded"><X size={20} /></button>
      </div>
      <div className="flex-1 relative">
        <ProfessionalFamilyViewer mode="MODEL_3D" quality="alta" resolution="hd" />
        <div className="absolute bottom-4 left-4 text-[#64748b] text-xs">Interactúa con el mouse para rotar y hacer zoom.</div>
      </div>
    </div>
  );
}
