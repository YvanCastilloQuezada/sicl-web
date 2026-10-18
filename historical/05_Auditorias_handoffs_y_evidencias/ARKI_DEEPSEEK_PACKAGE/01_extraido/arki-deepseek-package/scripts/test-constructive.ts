import { generateDynamicBuilding } from "../shared/arkiDynamicFamilies";
import { exportConstructionIfc } from "../shared/arkiConstructionOntology";

const building = generateDynamicBuilding({ familyId: "FAM-HEALTH", variantId: "GENERAL", context: { country: "PE", city: "Trujillo", jurisdiction: "RNE-PE" }, parameters: { areaM2: 20000, capacity: 400, floors: 4 } });
const model = building.constructionModel;
if (!model) throw new Error("CONSTRUCTION_MODEL_MISSING");
if (model.summary.wallCount !== 16) throw new Error(`EXPECTED_16_WALLS_GOT_${model.summary.wallCount}`);
if (model.summary.spaceCount !== 16) throw new Error(`EXPECTED_16_SPACES_GOT_${model.summary.spaceCount}`);
if (model.summary.columnCount < 4 || model.summary.beamCount < 4 || model.summary.slabCount !== 4 || model.summary.foundationCount < 4 || model.summary.stairCount !== 4 || model.summary.floorElementCount !== 4 || model.summary.roofCount !== 1 || model.summary.partitionCount !== 4) throw new Error("CONSTRUCTIVE_ELEMENTS_INVALID");
if (model.summary.doorCount < 1 || model.summary.windowCount < 1 || model.summary.relationCount < 1) throw new Error("OPENINGS_OR_RELATIONS_INVALID");
if (model.summary.totalNetWallAreaM2 <= 0 || model.summary.totalBudgetPen <= 0 || model.summary.totalDurationDays <= 0) throw new Error("CONSTRUCTION_SUMMARY_INVALID");
const ifc = exportConstructionIfc(model, { name: building.name, familyId: building.familyId, city: "Trujillo", country: "PE" });
for (const token of ["IFCWALL", "IFCCOLUMN", "IFCBEAM", "IFCSLAB", "IFCFOOTING", "IFCDOOR", "IFCWINDOW", "IFCSTAIR", "IFCROOF", "IFCWALLSTANDARDCASE", "IFCSPACE", "IFCMATERIALLAYER", "IFCPROPERTYSET", "IFCRELAGGREGATES", "IFCRELCONTAINEDINSPATIALSTRUCTURE"]) if (!ifc.content.includes(token)) throw new Error(`IFC_TOKEN_MISSING_${token}`);
console.log(JSON.stringify({ walls: model.summary.wallCount, spaces: model.summary.spaceCount, columns: model.summary.columnCount, beams: model.summary.beamCount, slabs: model.summary.slabCount, foundations: model.summary.foundationCount, stairs: model.summary.stairCount, floors: model.summary.floorElementCount, roofs: model.summary.roofCount, partitions: model.summary.partitionCount, doors: model.summary.doorCount, windows: model.summary.windowCount, relations: model.summary.relationCount, netWallM2: model.summary.totalNetWallAreaM2, budgetPen: model.summary.totalBudgetPen, durationDays: model.summary.totalDurationDays, ifcFile: ifc.fileName, ifcSchema: ifc.metadata.schema }, null, 2));
