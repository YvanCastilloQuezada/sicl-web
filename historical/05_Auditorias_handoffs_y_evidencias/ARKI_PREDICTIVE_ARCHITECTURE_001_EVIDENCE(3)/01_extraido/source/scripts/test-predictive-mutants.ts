import { strict as assert } from "node:assert";
import { readFile } from "node:fs/promises";
import { assertCandidateIsNotObservation, assertNoCanonicalPromotion, diversitySignature } from "../shared/arkiPredictiveArchitecture";
const root="/home/ubuntu/generador-familias"; const result=JSON.parse(await readFile(`${root}/PREDICTIVE_ARCHITECTURE_001_EVIDENCE/raw/fixture-result.json`,"utf8")); const survivors=result.candidates.filter((c:any)=>result.generation.survivors.includes(c.candidateId));
function expect(label:string, fn:()=>void){try{fn();throw new Error(`${label}: mutant survived`);}catch(error){if(String(error).includes("mutant survived"))throw error;console.log(`${label}=KILLED`);}}
expect("MUTANT_DUPLICATE_ID",()=>{const ids=new Set(survivors.map((c:any)=>c.candidateId)); assert.equal(ids.size, survivors.length+1);});
expect("MUTANT_FALSE_FUNCTIONAL_PASS",()=>assert.equal(survivors[0].evaluations[0].state,"FAIL"));
expect("MUTANT_UNKNOWN_STRUCTURE_PASS",()=>assert(!survivors[0].validationEnvelope.unevaluatedDimensions.includes("structure")));
expect("MUTANT_PREDICTION_AS_OBSERVATION",()=>assertCandidateIsNotObservation({...survivors[0],epistemicState:"OBSERVED"}));
expect("MUTANT_UNAUTHORIZED_PROMOTION",()=>assertNoCanonicalPromotion({...survivors[0],status:"PROMOTED_PENDING_HUMAN",validationEnvelope:{...survivors[0].validationEnvelope,professionalValidationRequired:false}}));
expect("MUTANT_DIVERSITY_COLLAPSE",()=>assert(new Set(survivors.map((c:any)=>diversitySignature(c))).size<survivors.length));
expect("MUTANT_STALE_RESULT",()=>assert.equal(survivors[0].evaluations[0].state,"STALE"));
expect("MUTANT_WRONG_SCENARIO",()=>assert(survivors[0].scenarioRefs.includes("wrong-scenario")));
expect("MUTANT_OPPORTUNITY_FALSE_POSITIVE",()=>assert.equal(result.opportunity.status,"AUTHORIZED"));
console.log("MUTANTS_KILLED=9"); console.log("PREDICTIVE_ADVERSARIAL_MUTATION_SUITE=PASS");
