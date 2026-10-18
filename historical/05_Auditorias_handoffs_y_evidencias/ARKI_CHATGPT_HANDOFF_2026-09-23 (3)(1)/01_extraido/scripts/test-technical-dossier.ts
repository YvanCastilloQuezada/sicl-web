import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import { generateTechnicalDossier, technicalDossierMarkdown } from "../shared/arkiTechnicalDossier";
const building = generateDynamicBuilding({ familyId: "FAM-HEALTH", variantId: "GENERAL", context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" }, parameters: { areaM2: 20000, capacity: 400, floors: 4 } });
if (!building.constructionModel) throw new Error("NO_MODEL");
const dossier = generateTechnicalDossier(building.constructionModel, "La Libertad", 1.04);
if (!dossier.specifications.length || !dossier.formwork.length || !dossier.regionalPrices.length || !dossier.normativeFindings.length) throw new Error("INCOMPLETE_DOSSIER");
if (!technicalDossierMarkdown(dossier).includes("Encofrados")) throw new Error("NO_FORMWORK_SECTION");
console.log(JSON.stringify({ readiness: dossier.readiness.percentage, specifications: dossier.specifications.length, formwork: dossier.formwork.length, prices: dossier.regionalPrices.length, findings: dossier.normativeFindings.length, sections: dossier.sections.length }, null, 2));
