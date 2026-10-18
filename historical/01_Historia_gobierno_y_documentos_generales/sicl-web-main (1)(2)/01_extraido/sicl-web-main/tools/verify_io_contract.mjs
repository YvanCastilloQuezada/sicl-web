const base = process.env.SICL_VERIFY_CORE_URL;
const token = process.env.SICL_CORE_SERVICE_TOKEN;
if (!base || !token) throw new Error("SICL_VERIFY_CORE_URL and SICL_CORE_SERVICE_TOKEN are required");

const response = await fetch(`${base}/v1/operations-research/methods`, {
  headers: { accept: "application/json", authorization: `Bearer ${token}` },
});
if (!response.ok) throw new Error(`adapter returned ${response.status}`);
const payload = await response.json();
const method = payload.methods.find(({ method }) => method === "TRANSPORTATION_LP");
if (!payload.read_only || !method) throw new Error("invalid operations research catalog");
for (const key of ["required_constraints", "required_provenance", "feasibility_states", "sensitivity_outputs"]) {
  if (!Array.isArray(method[key]) || method[key].length === 0) throw new Error(`missing ${key}`);
}
console.log(JSON.stringify({ contract_version: payload.contract_version, read_only: payload.read_only, method: method.method, fields_verified: ["required_constraints", "required_provenance", "feasibility_states", "sensitivity_outputs"] }));
