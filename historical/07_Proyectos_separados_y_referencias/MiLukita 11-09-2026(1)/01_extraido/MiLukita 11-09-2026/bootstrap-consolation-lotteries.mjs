import { bootstrapPilotRules } from "../server/pilot.ts";

const result = await bootstrapPilotRules(1);
console.log(JSON.stringify({ action: "bootstrapPilotRules", created: result.created }, null, 2));
