import { useState, useEffect } from "react";
import { X, FolderOpen, Plus, Trash2, Loader2, Cloud, AlertCircle } from "lucide-react";
import { siclClient } from "@/api/sicl-client";

interface Project {
  project_id: string;
  name: string;
  stage?: string;
  created_at?: string;
}

export default function ProjectManagerModal({ onClose, onLoadProject }: { onClose: () => void, onLoadProject?: (project: Project) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar proyectos desde el Core REAL
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await siclClient.listProjects();
        setProjects(data as any);
      } catch (err: any) {
        console.error("[ProjectManager] Error cargando proyectos:", err);
        setError(err?.message || "No se pudo conectar con el Core");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 2. Crear un proyecto en el Core REAL
  const handleCreate = async () => {
    if (!newProjectName.trim()) return;
    setIsSaving(true);
    setError(null);
    
    const projectId = `PROJ-${Date.now()}`;
    
    try {
      const newProject = await siclClient.createProject({
        project_id: projectId,
        name: newProjectName,
      });
      setProjects(prev => [...prev, newProject as any]);
      setNewProjectName("");
    } catch (err: any) {
      console.error("[ProjectManager] Error creando proyecto:", err);
      setError(err?.message || "No se pudo crear el proyecto");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Cargar un proyecto (leer sus datos del Core)
  const handleLoad = async (project: Project) => {
    try {
      const fullProject = await siclClient.getProject(project.project_id);
      if (onLoadProject) {
        onLoadProject(fullProject as any);
      }
      onClose();
    } catch (err: any) {
      console.error("[ProjectManager] Error cargando proyecto:", err);
      setError(err?.message || "No se pudo cargar el proyecto");
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl shadow-2xl w-[600px] max-w-[90vw] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#1e293b]">
          <h2 className="text-[#e2e8f0] font-bold flex items-center gap-2">
            <Cloud size={18} className="text-[#38bdf8]"/> Gestor de Proyectos (Base de Datos)
          </h2>
          <button onClick={onClose} className="text-[#64748b] hover:text-[#e2e8f0]">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto max-h-[70vh]">
          {/* Formulario de creación */}
          <div className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              placeholder="Nombre del nuevo proyecto..."
              className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#e2e8f0] focus:outline-none focus:border-[#38bdf8]"
            />
            <button 
              onClick={handleCreate} 
              disabled={isSaving || !newProjectName.trim()}
              className="bg-[#38bdf8] text-black px-4 py-2 rounded-lg font-bold hover:bg-[#0284c7] transition flex items-center gap-1 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} 
              {isSaving ? "Guardando..." : "Crear"}
            </button>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Lista de proyectos */}
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-[#64748b]">
                <Loader2 size={32} className="animate-spin text-[#38bdf8] mb-3" />
                <p className="text-sm">Cargando proyectos del Core...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen size={48} className="text-[#1e293b] mx-auto mb-4" />
                <p className="text-[#64748b] text-sm">No hay proyectos en la base de datos.</p>
                <p className="text-[#475569] text-xs mt-2">Crea uno nuevo para empezar.</p>
              </div>
            ) : (
              projects.map(p => (
                <div key={p.project_id} className="flex items-center justify-between bg-[#1e293b] p-3 rounded-lg border border-[#334155] hover:border-[#38bdf8] transition group">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#e2e8f0] font-semibold text-sm truncate">{p.name || p.project_id}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[#64748b] text-xs font-mono truncate">{p.project_id}</p>
                      {p.stage && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                          {p.stage}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button 
                      onClick={() => handleLoad(p)}
                      className="text-[#4ade80] hover:text-[#22c55e] p-2 rounded hover:bg-[#4ade80]/10 transition" 
                      title="Cargar Proyecto"
                    >
                      <FolderOpen size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1e293b] bg-[#0b1320] flex items-center justify-between">
          <span className="text-xs text-[#64748b]">
            {projects.length} proyecto{projects.length !== 1 ? 's' : ''} en la base de datos
          </span>
          <span className="text-[10px] text-[#475569]">
            Powered by SICL Core • SQLite
          </span>
        </div>
      </div>
    </div>
  );
}
