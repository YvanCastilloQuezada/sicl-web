import { X, Search } from "lucide-react";
export default function NormativaModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-[600px]">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold">Base de Normativa</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <input type="text" placeholder="Buscar en RNE, OECE, Invierte.pe..." className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-4 py-2 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]" />
            <button className="bg-[#38bdf8] text-black px-4 py-2 rounded-lg"><Search size={18} /></button>
          </div>
          <p className="text-[#64748b] text-sm text-center py-8">Ingresa un término para buscar.</p>
        </div>
      </div>
    </div>
  );
}
