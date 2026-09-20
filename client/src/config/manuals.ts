export type ManualId = "user" | "operations" | "commands";

export type ManualDefinition = {
  id: ManualId;
  title: string;
  description: string;
  path: string;
  pdfUrl: string;
  githubUrl: string;
};

export const MANUALS: ManualDefinition[] = [
  {
    id: "user",
    title: "Manual de Usuario",
    description: "Conceptos, flujos principales y reglas constitucionales de ARKI.",
    path: "/help/user",
    pdfUrl: "/manuals/user-manual.pdf",
    githubUrl: "https://github.com/YvanCastilloQuezada/sicl-core/blob/main/docs/USER_MANUAL.md",
  },
  {
    id: "operations",
    title: "Manual Operativo",
    description: "Tareas paso a paso para operar el Core mediante CLI y HTTP.",
    path: "/help/operations",
    pdfUrl: "/manuals/operations-manual.pdf",
    githubUrl: "https://github.com/YvanCastilloQuezada/sicl-core/blob/main/docs/OPERATIONS_MANUAL.md",
  },
  {
    id: "commands",
    title: "Referencia de Comandos",
    description: "Sintaxis canónica del CLI alineada con src/sicl/cli.py.",
    path: "/help/commands",
    pdfUrl: "/manuals/commands-reference.pdf",
    githubUrl: "https://github.com/YvanCastilloQuezada/sicl-core/blob/docs/commands-reference/docs/COMMANDS_REFERENCE.md",
  },
];

export const manualById = (id: ManualId) => MANUALS.find((manual) => manual.id === id)!;
