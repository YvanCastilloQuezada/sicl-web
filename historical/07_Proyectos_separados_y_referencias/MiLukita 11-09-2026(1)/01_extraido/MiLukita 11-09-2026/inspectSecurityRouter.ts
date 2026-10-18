import { appRouter } from "../server/routers";
const procedures = Object.keys((appRouter as any)._def.procedures).filter((key: string) => /territorial|governance|fieldVoice|share/.test(key));
console.log(procedures.join("\n"));
