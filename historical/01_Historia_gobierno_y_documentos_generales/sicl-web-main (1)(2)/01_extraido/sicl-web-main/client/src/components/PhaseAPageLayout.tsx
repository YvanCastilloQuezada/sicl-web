import React from "react";
import ProjectWorkspace, { fieldClass, type WorkspaceSection } from "@/components/ProjectWorkspace";

type PhaseAPage = "evidence" | "evaluations" | "comparisons";

export default function PhaseAPageLayout({ active, children, projectId }: { active: PhaseAPage; children: React.ReactNode; projectId?: string }) {
  return <ProjectWorkspace active={active as WorkspaceSection} projectId={projectId}>{children}</ProjectWorkspace>;
}

export { fieldClass };
