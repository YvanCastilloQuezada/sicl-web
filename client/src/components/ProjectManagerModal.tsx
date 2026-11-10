import { useState, useEffect } from "react";
import { X, Save, FolderOpen, Plus, Trash2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  date: string;
}

export default function ProjectManagerModal({ onClose }: { onClose: () => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("arki_projects");
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const saveProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem("arki_projects", JSON.stringify(newProjects));
  };

  const handleCreate = () => {
    if (!newProjectName.trim()) return;
    const newProj: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      date: new Date().toLocaleDateString(),
    };
    saveProjects([...projects, newProj]);
    setNewProjectName("");
  };

  const handleDelete = (id: string) => {
    saveProjects(projects.filter(p => p.id !== id));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2"><FolderOpen size={18} className="text-[#38bdf8]"/> Gestor de Proyectos</h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]"><X size={20} /></button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto max-h-[60vh]">
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Nombre del nuevo proyecto..."
              className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
            />
            <button onClick={handleCreate} className="bg-[#38bdf8] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#0284c7] transition flex items-center gap-1">
              <Plus size={16} /> Crear
            </button>
          </div>

          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-center text-[#64748b] text-sm py-8">No hay proyectos guardados.</p>
            ) : (
              projects.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                  <div>
                    <p className="text-[#e2e8f0] font-semibold text-sm">{p.name}</p>
                    <p className="text-[#64748b] text-xs">{p.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-[#4ade80] hover:text-[#22c55e] p-1" title="Cargar"><FolderOpen size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="text-[#f87171] hover:text-[#ef4444] p-1" title="Eliminar"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
