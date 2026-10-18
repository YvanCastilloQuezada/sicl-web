export type ContextViewport = { scale: number; translateX: number; translateY: number };
export type ContextLevel = { id: string; name: string; index: number };
export type ContextDiscipline = { id: string; name: string };
export type ContextTreeNode = { id: string; label: string; kind: "discipline" | "level" | "category" | "element"; elementId?: string; children?: ContextTreeNode[] };
export type ContextTool = { id: "select" | "zoom" | "pan" | "fit"; label: string; enabled: boolean };
export type ContextPanelState = { levels: ContextLevel[]; activeLevel: number; disciplines: ContextDiscipline[]; activeDiscipline: string | "all"; phases: string[]; activePhase: string | "all"; visibleCategories: string[]; tree: ContextTreeNode[]; tools: ContextTool[]; viewport: ContextViewport };
