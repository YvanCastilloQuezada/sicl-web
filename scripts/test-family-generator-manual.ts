import { dynamicFamilySummary, familyOptions, generateDynamicBuilding, isProposalOnly, searchDynamicFamilies } from "../shared/arkiDynamicFamilies";
import { exportDynamicBuilding } from "../shared/arkiFamilyComparison";

const summary = dynamicFamilySummary();
if (summary.familyCount < 1) throw new Error("NO_FAMILIES");
if (!searchDynamicFamilies("hospital").some((item) => item.familyId === "FAM-HEALTH")) throw new Error("SEARCH_FAILED");
if (!familyOptions().some((item) => item.id === "FAM-HEALTH")) throw new Error("OPTIONS_FAILED");
const building = generateDynamicBuilding({
  familyId: "FAM-HEALTH",
  variantId: "GENERAL",
  context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" },
  parameters: { areaM2: 20000, capacity: 400, floors: 4 },
});
if (!isProposalOnly(building)) throw new Error("GOVERNANCE_FAILED");
const artifact = exportDynamicBuilding(building, "JSON");
if (artifact.mimeType !== "application/json" || !artifact.content.includes("GENERATED_CANDIDATE")) throw new Error("EXPORT_FAILED");
console.log(JSON.stringify({ familyCount: summary.familyCount, variantCount: summary.variantCount, buildingId: building.id, validation: building.validation.status, export: artifact.fileName }, null, 2));
