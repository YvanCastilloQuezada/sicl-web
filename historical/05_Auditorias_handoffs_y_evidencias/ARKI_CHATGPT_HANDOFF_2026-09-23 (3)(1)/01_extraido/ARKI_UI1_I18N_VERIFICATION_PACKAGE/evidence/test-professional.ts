import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import { buildFinancial5D, detectModelClashes, simulateConstruction, createApprovalWorkflow, createCdeManifest, importS10Csv } from "../shared/arkiProfessionalModules";

const building = generateDynamicBuilding({ familyId: "FAM-HEALTH", variantId: "GENERAL", context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" }, parameters: { areaM2: 20000, capacity: 400, floors: 4 } });
if (!building.constructionModel) throw new Error("NO_CONSTRUCTION_MODEL");
const model = building.constructionModel;
const financial = buildFinancial5D(model);
const simulation = simulateConstruction(model);
const clashes = detectModelClashes(model);
const approval = createApprovalWorkflow(model);
const cde = createCdeManifest(model, clashes);
const s10 = importS10Csv("codigo,descripcion,unidad,costo_directo\n03.01.01,Concreto f280,m3,450\n05.04.02,Puerta,und,850");
if (!financial.periods.length || !financial.summary.sCurve.length) throw new Error("NO_5D_PERIODS");
if (simulation.resources.length < 3 || simulation.criticalPath.durationDays <= 0) throw new Error("NO_CONSTRUCTION_SIMULATION");
if (!clashes.length || !approval.missingRoles.length || cde.documents.length !== 2) throw new Error("PROFESSIONAL_MODULES_INVALID");
if (s10.imported !== 2 || s10.rows[0].unitPrice <= 0) throw new Error("S10_IMPORT_INVALID");
console.log(JSON.stringify({ periods: financial.summary.totalPeriods, financialTotal: financial.summary.totalCost, conflicts: simulation.conflicts.length, clashes: clashes.length, approvalStatus: approval.status, cdeDocuments: cde.documents.length, s10Imported: s10.imported }, null, 2));
