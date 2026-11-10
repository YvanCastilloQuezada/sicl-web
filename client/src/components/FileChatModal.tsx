import { X } from "lucide-react";
export default function FileChatModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl w-[600px] flex flex-col h-[500px]">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold">Chat con Archivos</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        <div className="flex-1 p-4 flex flex-col items-center justify-center text-[#64748b]">
          <p>Sube un PDF o Plano para hacerle preguntas a la IA.</p>
        </div>
        <div className="p-4 border-t border-[#1e293b]">
          <input type="file" className="w-full text-sm text-[#e2e8f0] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#38bdf8] file:text-black hover:file:bg-[#0284c7]" />
        </div>
      </div>
    </div>
  );
}
