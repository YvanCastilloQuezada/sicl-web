import type { CommandData, CoreProject } from "./sicl-client";

const MOCK_PROJECT_ID = "MOCK-ARKI-001";

let mockProject: CoreProject = {
  project_id: MOCK_PROJECT_ID,
  name: "Proyecto demostración ARKI",
  stage: "OPEN",
  version: 3,
  objectives: { energy: "MAXIMIZE", cost: "MINIMIZE" },
  constraints: { budget: 250000, site: "Centro urbano" },
  alternatives: { "ALT-A": "Patio bioclimático", "ALT-B": "Torre compacta" },
  evaluations: { "ALT-A": { energy_savings: 82, cost: 210000 }, "ALT-B": { energy_savings: 63, cost: 180000 } },
  comparisons: { selected: ["ALT-A", "ALT-B"] },
  recommendations: { "MOCK-REC-001": { alternative_id: "ALT-A", rationale: "Mejor equilibrio energético" } },
  events: [
    { type: "PROJECT_CREATED", actor: "mock-system" },
    { type: "PREFERENCE_RECORDED", actor: "mock-human" },
    { type: "RECOMMENDATION_CREATED", actor: "mock-system" },
  ],
};

export function mockListProjects(): CoreProject[] {
  return [mockProject];
}

export function mockGetProject(projectId: string): CoreProject {
  if (projectId !== mockProject.project_id) throw new Error("Proyecto simulado no encontrado");
  return { ...mockProject };
}

export function mockCreateProject(data: { project_id: string; name: string }): CoreProject {
  mockProject = { ...mockProject, project_id: data.project_id || MOCK_PROJECT_ID, name: data.name || mockProject.name, version: mockProject.version + 1 };
  return { ...mockProject };
}

export function mockExecuteCommand(command: string): CommandData {
  mockProject = { ...mockProject, version: mockProject.version + 1, events: [...(mockProject.events ?? []), { type: "COMMAND_SIMULATED", command, actor: "mock-human" }] };
  return { simulated: true, command, project_id: mockProject.project_id, observed_version: mockProject.version };
}
