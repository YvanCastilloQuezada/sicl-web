import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { GeneratedBuilding } from "@shared/arkiDynamicFamilies";
import type { ConstructionModel } from "@shared/arkiConstructionOntology";
const ProjectContext = createContext<{ building: GeneratedBuilding | null; constructionModel: ConstructionModel | null; setBuilding: (building: GeneratedBuilding | null) => void } | null>(null);
export function ProjectContextProvider({ children }: { children: ReactNode }) { const [building, setBuilding] = useState<GeneratedBuilding | null>(null); const constructionModel = building?.constructionModel ?? null; const value = useMemo(() => ({ building, constructionModel, setBuilding }), [building, constructionModel]); return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>; }
export function useProjectContext() { const context = useContext(ProjectContext); if (!context) throw new Error("useProjectContext must be used inside ProjectContextProvider"); return context; }
