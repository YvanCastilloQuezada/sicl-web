import { SemanticConcept } from "./types";

const std = {
  sourceId: "buildingSMART-IFC4.3-ADD2",
  sourceType: "STANDARD" as const,
  authority: "buildingSMART International / ISO 16739-1:2024"
};

// Starter alignment only. It is intentionally not a complete IFC schema.
export const IFC43_STARTER_SEED: SemanticConcept[] = [
  {
    id: "arki-sem:project", canonicalName: "PROJECT",
    definition: "A governed ARKI project context for built-environment information.",
    status: "ACTIVE", scales: ["SITE","BUILDING"], parentIds: [],
    properties: [], quantities: [], relationships: [],
    mappings: [{ standard:"IFC4_3_ADD2", version:"4.3.2.0", externalId:"IfcProject", kind:"RELATED", provenance:[std] }],
    provenance:[std], epistemicState:"DOCUMENTED", schemaVersion:"0.1.0", aliases:["Project"]
  },
  {
    id: "arki-sem:site", canonicalName: "SITE",
    definition: "A spatial site entity in the ARKI multiscale built-environment model.",
    status:"ACTIVE", scales:["SITE"], parentIds:["arki-sem:project"],
    properties:[], quantities:[
      { key:"area", dimension:"AREA", canonicalUnit:"m2" }
    ], relationships:[],
    mappings:[{ standard:"IFC4_3_ADD2", version:"4.3.2.0", externalId:"IfcSite", kind:"EXACT", provenance:[std] }],
    provenance:[std], epistemicState:"DOCUMENTED", schemaVersion:"0.1.0", aliases:["Site"]
  },
  {
    id:"arki-sem:building", canonicalName:"BUILDING",
    definition:"A building entity governed by ARKI project state.",
    status:"ACTIVE", scales:["BUILDING"], parentIds:["arki-sem:site"],
    properties:[], quantities:[
      { key:"grossFloorArea", dimension:"AREA", canonicalUnit:"m2", derived:true }
    ], relationships:[],
    mappings:[{ standard:"IFC4_3_ADD2", version:"4.3.2.0", externalId:"IfcBuilding", kind:"EXACT", provenance:[std] }],
    provenance:[std], epistemicState:"DOCUMENTED", schemaVersion:"0.1.0", aliases:["Building"]
  },
  {
    id:"arki-sem:space", canonicalName:"SPACE",
    definition:"A bounded or conceptually defined spatial unit used by activities and building systems.",
    status:"ACTIVE", scales:["SPACE"], parentIds:["arki-sem:building"],
    properties:[], quantities:[
      { key:"netArea", dimension:"AREA", canonicalUnit:"m2", derived:true },
      { key:"volume", dimension:"VOLUME", canonicalUnit:"m3", derived:true }
    ], relationships:[],
    mappings:[{ standard:"IFC4_3_ADD2", version:"4.3.2.0", externalId:"IfcSpace", kind:"EXACT", provenance:[std] }],
    provenance:[std], epistemicState:"DOCUMENTED", schemaVersion:"0.1.0", aliases:["Room","Space"]
  },
  {
    id:"arki-sem:wall", canonicalName:"WALL",
    definition:"A wall semantic entity. Source geometry alone is insufficient to promote a wall candidate to this concept.",
    status:"ACTIVE", scales:["BUILDING","SPACE"], parentIds:["arki-sem:building"],
    properties:["material"], quantities:[
      { key:"length", dimension:"LENGTH", canonicalUnit:"m", derived:true },
      { key:"area", dimension:"AREA", canonicalUnit:"m2", derived:true },
      { key:"volume", dimension:"VOLUME", canonicalUnit:"m3", derived:true }
    ], relationships:[],
    mappings:[{ standard:"IFC4_3_ADD2", version:"4.3.2.0", externalId:"IfcWall", kind:"EXACT", provenance:[std] }],
    provenance:[std], epistemicState:"DOCUMENTED", schemaVersion:"0.1.0", aliases:["Wall","Muro"]
  },
  {
    id:"arki-sem:door", canonicalName:"DOOR",
    definition:"A door semantic entity providing a governed opening/access function.",
    status:"ACTIVE", scales:["BUILDING","SPACE","OBJECT"], parentIds:["arki-sem:building"],
    properties:[], quantities:[],
    relationships:[],
    mappings:[{ standard:"IFC4_3_ADD2", version:"4.3.2.0", externalId:"IfcDoor", kind:"EXACT", provenance:[std] }],
    provenance:[std], epistemicState:"DOCUMENTED", schemaVersion:"0.1.0", aliases:["Door","Puerta"]
  }
];
