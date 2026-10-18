import { bootstrapPilotRules } from "../server/pilot";

const result = await bootstrapPilotRules(1);
console.log(JSON.stringify({ action: "bootstrap_simplified_modalities", ...result }, null, 2));
