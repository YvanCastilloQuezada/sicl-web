"use strict";
/* Three non-executable strategies grounded in the observed inventory. */
function proposeStrategies(discovery){
 if(!discovery||discovery.schema!=="ARKI-CAPABILITY-DISCOVERY-1"||!Number.isInteger(discovery.totalFiles)||!Number.isInteger(discovery.unclassified)||discovery.unclassified<0||discovery.unclassified>discovery.totalFiles)throw Error("INVALID_DISCOVERY");
 const common={snapshot:discovery.sourceSnapshot,observedFiles:discovery.totalFiles,unclassifiedFiles:discovery.unclassified,execution:"NOT_EXECUTED",canonicalMutation:false,ownerApproval:"REQUIRED",independentReview:"REQUIRED"};
 return {schema:"ARKI-ASSEMBLY-STRATEGIES-1",decision:"OWNER_SELECTION_PENDING",strategies:[
  {id:"A",title:"Inventario y evidencias primero",priority:1,action:"Inspect unknown files and trace evidence before linking modules",benefit:"Lower uncertainty",tradeoff:"Slower visible integration",...common},
  {id:"B",title:"Dependencias y contratos primero",priority:2,action:"Map actual imports, API boundaries and frozen contracts before proposing connections",benefit:"Early detection of isolated or incompatible modules",tradeoff:"Requires source-level analysis and dependency validation",...common},
  {id:"C",title:"Gemelo aislado primero",priority:3,action:"Replay a minimal representative assembly in a disposable sandbox after source-level validation",benefit:"Earlier end-to-end feedback",tradeoff:"Higher risk of misleading conclusions if inventory is incomplete",...common}
 ]};
}
module.exports={proposeStrategies};
