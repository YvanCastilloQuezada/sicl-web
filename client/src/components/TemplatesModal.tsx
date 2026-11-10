import { X } from "lucide-react";
export default function TemplatesModal({ onClose }: { onClose: () => void }) {
  const templates = ["Hospital Nivel II", "Colegio Modular", "Aeropuerto Comercial", "Vivienda Multifamiliar", "Centro Comercial", "Planta Industrial"];
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-[800px] max-w-[90vw] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#e2e8f0] font-bold text-lg">Templates Pre-diseñados</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {templates.map(t => (
            <div key={t} className="bg-[#1e293b] p-4 rounded-xl cursor-pointer hover:bg-[#334155] transition border border-[#334155] text-center">
              <p className="text-[#e2e8f0] font-semibold">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
