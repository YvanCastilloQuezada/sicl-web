import { appRouter } from "../server/routers";
const root = (appRouter as any)._def;
console.log(Object.keys(root));
console.log(Object.keys(root.record ?? {}));
console.log(Object.keys(root.procedures ?? {}));
console.log(Object.keys((root.record ?? {}).territorial?._def?.record ?? {}));
