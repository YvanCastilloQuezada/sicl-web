import { fetchOperationsResearchMethods } from "../server/coreHttpClient.ts";

const result = await fetchOperationsResearchMethods();
if (!result?.read_only || !result.methods.some(({ method }) => method === "TRANSPORTATION_LP")) {
  throw new Error("web client did not receive the canonical IO catalog");
}
const transportation = result.methods.find(({ method }) => method === "TRANSPORTATION_LP");
for (const key of ["required_constraints", "required_provenance", "feasibility_states", "sensitivity_outputs"]) {
  if (!transportation?.[key]?.length) throw new Error(`web client lost ${key}`);
}
console.log(JSON.stringify({ source: "coreHttpClient.fetchOperationsResearchMethods", contract_version: result.contract_version, read_only: result.read_only, method: transportation.method, fields_verified: ["required_constraints", "required_provenance", "feasibility_states", "sensitivity_outputs"] }));
