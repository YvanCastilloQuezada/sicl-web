import { Download, FolderOpen, Plus, Search } from "lucide-react";
import { toast } from "sonner";
export default function ModuleToolbar({ module }: { module: string }) {
  const focusSearch = () => { const input = document.querySelector<HTMLInputElement>('input[placeholder="hospital, cultura..."]'); input?.focus(); input?.scrollIntoView({ behavior: "smooth", block: "center" }); };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" });
  return <div className="arki-module-toolbar"><span className="arki-toolbar-module">{module}</span>{module === "Generador" ? <><button onClick={() => scrollTo("versions")}><FolderOpen size={13} /> Comparador</button><button onClick={() => scrollTo("exports")}><Download size={13} /> Exportaciones</button><button onClick={focusSearch}><Search size={13} /> Buscar familia</button><button onClick={() => toast.info("Selecciona una familia para iniciar una nueva propuesta")}><Plus size={13} /> Nuevo</button></> : <span className="arki-toolbar-hint">Herramientas del módulo activo</span>}</div>;
}
