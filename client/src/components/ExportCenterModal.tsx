import { X, Download } from "lucide-react";
export default function ExportCenterModal({ onClose }: { onClose: () => void }) {
  const formats = ["IFC (BIM)", "DWG (AutoCAD)", "PDF (Planos)", "Excel (Presupuesto)"];
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-[400px]">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold">Exportar Proyecto</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-2">
          {formats.map(f => (
            <label key={f} className="flex items-center gap-3 p-3 bg-[#1e293b] rounded-lg cursor-pointer hover:bg-[#334155] transition">
              <input type="checkbox" className="w-4 h-4 accent-[#38bdf8]" defaultChecked />
              <span className="text-[#e2e8f0] text-sm">{f}</span>
            </label>
          ))}
        </div>
        <div className="p-4 border-t border-[#1e293b]">
          <button className="w-full bg-[#38bdf8] text-black px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2"><Download size={16} /> Exportar Seleccionados</button>
        </div>
      </div>
    </div>
  );
}
