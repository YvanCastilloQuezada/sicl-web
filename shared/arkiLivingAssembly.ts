/** ARKI living-tree assembly: deterministic, proposal-only integration planning. */
export type AssemblyCapability = { id: string; phase: number; authority: "CORE" | "D2" | "AGK" | "WEB" | "ACS"; inputs: string[]; outputs: string[]; dependencies: string[]; evidence: string[]; verified: boolean };
export type AssemblyOption = { id: string; strategy: "CONNECT" | "ADAPT" | "HOLD"; title: string; reason: string; requiredChecks: string[]; authorized: false };
export type AssemblyReview = { schema: "ARKI-LIVING-ASSEMBLY-1"; capabilityId: string; status: "PROPOSAL_ONLY"; blockers: string[]; options: [AssemblyOption,AssemblyOption,AssemblyOption]; selected: null };
const sorted = (values: string[]) => Array.from(new Set(values)).sort();
/** No side effects, no writes, no automatic approval. Stable inputs produce stable output. */
export function evaluateAssembly(capability: AssemblyCapability, availableIds: readonly string[]): AssemblyReview {
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,127}$/.test(capability.id)) throw new Error("INVALID_CAPABILITY_ID");
  if (!Number.isInteger(capability.phase) || capability.phase < 1 || capability.phase > 10) throw new Error("INVALID_PHASE");
  const missing = sorted(capability.dependencies.filter(id => !availableIds.includes(id)));
  const blockers = [...missing.map(id => `MISSING_DEPENDENCY:${id}`), ...(!capability.verified || capability.evidence.length === 0 ? ["EVIDENCE_NOT_VERIFIED"] : []), ...(capability.inputs.length === 0 || capability.outputs.length === 0 ? ["CONTRACT_INCOMPLETE"] : [])];
  const checks = sorted(["HUMAN_APPROVAL", "AUTHORITY_BOUNDARY", "DETERMINISTIC_REPLAY", "REGRESSION_1_TO_10", ...missing.map(id => `RESOLVE:${id}`)]);
  return { schema:"ARKI-LIVING-ASSEMBLY-1", capabilityId:capability.id, status:"PROPOSAL_ONLY", blockers, selected:null,
    options:[
      {id:`${capability.id}:A`,strategy:"CONNECT",title:"Conexión directa al árbol",reason:blockers.length?"Bloqueada hasta resolver evidencia, contrato y dependencias":"Usar interfaces existentes sin alterar autoridades",requiredChecks:checks,authorized:false},
      {id:`${capability.id}:B`,strategy:"ADAPT",title:"Adaptador subordinado",reason:"Aislar incompatibilidades sin crear autoridad ni motor paralelo",requiredChecks:sorted([...checks,"ADAPTER_CONTRACT_TEST"]),authorized:false},
      {id:`${capability.id}:C`,strategy:"HOLD",title:"Mantener en laboratorio",reason:"Conservar el estado canónico mientras se obtiene evidencia",requiredChecks:sorted(["HUMAN_APPROVAL","EVIDENCE_COLLECTION"]),authorized:false}
    ]};
}
