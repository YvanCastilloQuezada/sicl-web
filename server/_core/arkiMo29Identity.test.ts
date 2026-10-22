import { describe, it, expect, vi, afterEach } from "vitest";
import express from "express";
import { randomUUID } from "node:crypto";
vi.mock("./arkiIdentityBridge", () => ({ authenticateLocalIdentity: vi.fn(async (req:any) => req.headers["x-mo29-test-user"] === "a" ? {id:101} : null) }));
vi.mock("./arkiMysqlLedgerRepository.mjs", () => ({ ArkiMysqlLedgerRepository: class {} }));
vi.mock("./arkiAuthorizedStorage.mjs", () => ({ createAuthorizedStorage: () => ({
 put: async ({ownerId,projectId}:any) => {if(ownerId!==101||projectId!=="PROJECT-A") throw Error("DENIED");return {objectId:randomUUID(),sha256:"a".repeat(64),sizeBytes:1};},
 read: async ({ownerId,projectId}:any) => {if(ownerId!==101||projectId!=="PROJECT-A") throw Error("DENIED");return {body:Buffer.from("ok"),contentType:"text/plain"};},
 revoke: async ({ownerId,projectId}:any) => {if(ownerId!==101||projectId!=="PROJECT-A") throw Error("DENIED");}
}) }));
vi.mock("./arkiFileBackend.mjs", () => ({ createFileBackend: () => ({}) }));
import { registerArkiMo22 } from "./arkiMo22Bridge";
const vars=["ARKI_STORAGE_MODE","ARKI_MO22_ENABLE","ARKI_DEV_OPEN","ARKI_IDENTITY_MODE","ARKI_MO08_LOCAL_AUTH","NODE_ENV","DATABASE_URL","ARKI_STORAGE_ROOT"] as const;
const before=Object.fromEntries(vars.map(k=>[k,process.env[k]]));
afterEach(()=>{for(const k of vars){if(before[k]===undefined) delete process.env[k];else process.env[k]=before[k];}});
describe("MO29 identity bridge gating",()=>{
 it("does not register local routes without explicit auth or in production",()=>{
  Object.assign(process.env,{ARKI_STORAGE_MODE:"local",ARKI_MO22_ENABLE:"1",ARKI_DEV_OPEN:"0",ARKI_IDENTITY_MODE:"local",ARKI_MO08_LOCAL_AUTH:"0",NODE_ENV:"test"});
  const a=express();registerArkiMo22(a);expect(a._router?.stack?.some((s:any)=>s.route?.path?.includes("arki-storage"))??false).toBe(false);
  process.env.ARKI_MO08_LOCAL_AUTH="1";process.env.NODE_ENV="production";
  const b=express();registerArkiMo22(b);expect(b._router?.stack?.some((s:any)=>s.route?.path?.includes("arki-storage"))??false).toBe(false);
 });
 it("uses local verified identity and denies anonymous/foreign project",async()=>{
  Object.assign(process.env,{ARKI_STORAGE_MODE:"local",ARKI_MO22_ENABLE:"1",ARKI_DEV_OPEN:"0",ARKI_IDENTITY_MODE:"local",ARKI_MO08_LOCAL_AUTH:"1",NODE_ENV:"test",DATABASE_URL:"mysql://placeholder:placeholder@127.0.0.1:3306/placeholder",ARKI_STORAGE_ROOT:"/tmp/mo29-isolated"});
  const app=express();app.use(express.json());registerArkiMo22(app);
  const server=app.listen(0,"127.0.0.1");await new Promise<void>(r=>server.once("listening",r));
  try {
   const base=`http://127.0.0.1:${(server.address() as any).port}/api/arki-storage/projects/`;
   const send=(project:string,user?:string)=>fetch(base+project+"/objects",{method:"POST",headers:{"Content-Type":"application/json",...(user?{"x-mo29-test-user":user}:{})},body:JSON.stringify({contentType:"text/plain",base64:"eA=="})});
   expect((await send("PROJECT-A","a")).status).toBe(201);
   expect((await send("PROJECT-A")).status).toBe(401);
   expect((await send("PROJECT-B","a")).status).toBe(403);
  }finally{await new Promise<void>(r=>server.close(()=>r()));}
 });
});
