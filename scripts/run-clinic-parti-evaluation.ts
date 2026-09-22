import { writeFile } from "node:fs/promises";
import { executeIntegratedArchitectCycle, summarizeArchitectCapability, type IntegratedArchitectInput } from "../server/arkiIntegratedArchitectCycle";

const input: IntegratedArchitectInput = {
  projectId: "CLI-ARK-150-001",
  projectName: "Clínica ambulatoria y hospitalaria 150 camas",
  typology: "CLINIC_HOSPITAL_150_BEDS",
  brief: "Diseñar una clínica de 150 camas en un terreno urbano de 3,000 m². El encargo exige una organización clara entre acceso público, diagnóstico, tratamiento, hospitalización, servicios, logística y emergencias, con posibilidades de crecimiento y coordinación preliminar de estructura e instalaciones. Proponer el parti antes de describir la geometría.",
  context: {
    location: "UNKNOWN_CITY_PERU",
    siteAreaM2: 3000,
    beds: 150,
    perimeter: "UNKNOWN",
    regulatoryVersion: "UNKNOWN",
    soilStudy: "UNKNOWN",
  },
  constraints: [
    "Terreno fijo de 3,000 m².",
    "150 camas como capacidad de encargo, no aforo normativo verificado.",
    "Separar flujos públicos, clínicos, personal, residuos y abastecimiento.",
    "El parti no debe confundirse con forma, organización, topología ni geometría.",
    "No declarar cumplimiento normativo ni factibilidad estructural sin evidencia especializada.",
  ],
  activities: [
    { id: "public-arrival", label: "public arrival and orientation", subjects: ["patients", "visitors"], capacity: 150, frequency: "daily", duration: "medium", temporalOverlap: true, privacy: "shared" },
    { id: "emergency", label: "emergency care", subjects: ["patients", "staff"], capacity: 30, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "controlled" },
    { id: "diagnostics", label: "diagnostics and treatment", subjects: ["patients", "staff"], capacity: 40, frequency: "daily", duration: "medium", temporalOverlap: true, privacy: "controlled" },
    { id: "inpatient", label: "inpatient care", subjects: ["patients", "staff"], capacity: 150, frequency: "daily", duration: "long", temporalOverlap: true, privacy: "private" },
    { id: "logistics", label: "service and logistics", subjects: ["staff", "suppliers"], capacity: 20, frequency: "daily", duration: "medium", temporalOverlap: true, accessControl: "service", privacy: "controlled" },
  ],
  subjects: ["patients", "visitors", "clinical staff", "administration", "suppliers", "waste service"],
  relationships: [
    { id: "r-public-clinical", from: "public-arrival", to: "diagnostics", relation: "legible patient interface", subjects: ["patients", "visitors", "staff"], state: "open", frequency: "daily", time: "business-hours", control: "reception" },
    { id: "r-emergency", from: "emergency", to: "diagnostics", relation: "rapid controlled clinical connection", subjects: ["patients", "staff"], state: "controlled", frequency: "daily", time: "all-hours", control: "clinical" },
    { id: "r-service", from: "logistics", to: "inpatient", relation: "back-of-house service interface", subjects: ["staff", "suppliers"], state: "controlled", frequency: "daily", time: "all-hours", control: "service" },
  ],
  conditions: ["Urban site with four sides presumed accessible; exact street hierarchy unknown.", "Clinical flows overlap at peak demand and require explicit separation.", "Future expansion is desired but not defined.", "The project needs a human professional review before any decision."],
  unknowns: ["city and jurisdiction", "current health regulations", "site perimeter and access hierarchy", "soil and seismic data", "clinical program and department areas", "budget and phasing", "structural system", "MEP capacity and redundancy", "fire and evacuation criteria"],
  envelope: { width: 60, height: 50 },
  sourceIds: ["USER_BRIEF:CLINIC_150_BEDS", "ARKI_PARTI_CONTRACT_1.0", "D6.2-D6.3-CONTRACTS"],
};

const cycle = executeIntegratedArchitectCycle(input);
const result = { input, cycle, capabilitySummary: summarizeArchitectCapability(cycle), oracle: { suppliedToSystem: false, status: "SEPARATED" } };
await writeFile("/home/ubuntu/ARKI_CLINIC_150_PARTI_EVALUATION.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify({ status: cycle.status, partiFinalStatus: cycle.parti.finalStatus, gates: cycle.parti.gates, capabilitySummary: result.capabilitySummary, output: "/home/ubuntu/ARKI_CLINIC_150_PARTI_EVALUATION.json" }, null, 2));

export { input };
