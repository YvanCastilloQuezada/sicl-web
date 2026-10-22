
import { describe, it, expect, vi } from "vitest";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import express from "express";
import mysql from "mysql2/promise";
vi.mock("../db", () => ({
 getUserByOpenId: vi.fn(async (id:string) => id === "mo22-owner-a" ? {id:101,openId:id} : id === "mo22-owner-b" ? {id:202,openId:id} : null)
}));
import { sdk } from "./sdk";
import { ENV } from "./env";
import { registerArkiMo22, putArkiMo22 } from "./arkiMo22Bridge";
describe("MO22 real bridge MariaDB HTTP",()=>{
 it("executes 13 authorization and integrity checks",async()=>{
  const db=mysql.createPool({uri:process.env.DATABASE_URL!,timezone:"Z",connectionLimit:4});
  let server:any; let count=0;
  const check=async(name:string,fn:()=>Promise<void>)=>{await fn();count++;console.log("PASS",name)};
  try {
   await db.query(`CREATE TABLE sicl_projects (id INT AUTO_INCREMENT PRIMARY KEY,ownerId INT NOT NULL,projectId VARCHAR(128) NOT NULL UNIQUE) ENGINE=InnoDB`);
   await db.query(`CREATE TABLE arki_storage_objects (object_id CHAR(36) PRIMARY KEY,owner_id INT NOT NULL,project_id VARCHAR(128) NOT NULL,storage_key VARCHAR(512) NOT NULL UNIQUE,sha256 CHAR(64) NOT NULL,size_bytes INT NOT NULL,content_type VARCHAR(200) NOT NULL,status ENUM('PENDING','READY','REVOKED') NOT NULL DEFAULT 'PENDING',created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,KEY idx_owner_project_status(owner_id,project_id,status)) ENGINE=InnoDB`);
   await db.query("INSERT INTO sicl_projects(ownerId,projectId) VALUES (101,'PROJECT-A'),(202,'PROJECT-B')");
   process.env.ARKI_MO22_ENABLE="0";
   const disabled=express();registerArkiMo22(disabled);
   await check("disabled routes",async()=>{expect(disabled._router?.stack?.some((x:any)=>x.route?.path?.includes("arki-storage"))??false).toBe(false)});
   process.env.ARKI_MO22_ENABLE="1";
   const app=express();app.use(express.json({limit:"35mb"}));registerArkiMo22(app);
   server=app.listen(0,"127.0.0.1");await new Promise<void>(r=>server.once("listening",r));
   const base=`http://127.0.0.1:${server.address().port}`;
   const endpoint="/api/arki-storage/projects/PROJECT-A/objects";
   const a=await sdk.signSession({openId:"mo22-owner-a",appId:ENV.appId,name:"A"});
   const b=await sdk.signSession({openId:"mo22-owner-b",appId:ENV.appId,name:"B"});
   const foreign=await sdk.signSession({openId:"mo22-owner-a",appId:"FOREIGN_MO22_APP",name:"Foreign"});
   const req=(path:string,method="GET",token?:string,body?:any)=>fetch(base+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`}:{}) ,"Content-Type":"application/json"},...(body?{body:JSON.stringify(body)}:{})});
   const data=Buffer.from("ARKI_MO22_REAL_"+randomUUID());const payload={base64:data.toString("base64"),contentType:"application/pdf"};let id="";
   await check("POST owner + DB READY",async()=>{const r=await req(endpoint,"POST",a,payload);expect(r.status).toBe(201);id=(await r.json()).objectId;expect(id).toMatch(/^[a-f0-9-]{36}$/i);const [rows]:any=await db.execute("SELECT status,owner_id FROM arki_storage_objects WHERE object_id=?",[id]);expect(rows[0].status).toBe("READY");expect(rows[0].owner_id).toBe(101)});
   await check("GET exact bytes",async()=>{const r=await req(endpoint+"/"+id,"GET",a);expect(r.status).toBe(200);expect(Buffer.from(await r.arrayBuffer())).toEqual(data)});
   await check("anonymous 401",async()=>{expect((await req(endpoint+"/"+id)).status).toBe(401)});
   await check("foreign owner 403",async()=>{expect((await req(endpoint+"/"+id,"GET",b)).status).toBe(403)});
   await check("foreign app 401",async()=>{expect((await req(endpoint+"/"+id,"GET",foreign)).status).toBe(401)});
   await check("tampered JWT 401",async()=>{expect((await req(endpoint+"/"+id,"GET",a+"invalid")).status).toBe(401)});
   await check("wrong project POST 403",async()=>{expect((await req("/api/arki-storage/projects/PROJECT-B/objects","POST",a,payload)).status).toBe(403)});
   await check("bad base64 403",async()=>{expect((await req(endpoint,"POST",a,{base64:"%%%%",contentType:"application/pdf"})).status).toBe(403)});
   await check("direct bridge put/read",async()=>{const r=await putArkiMo22(101,"PROJECT-A",Buffer.from("MO22_DIRECT"),"application/pdf");expect(r.url).toContain("/api/arki-storage/projects/PROJECT-A/objects/");const response=await req(r.url,"GET",a);expect(response.status).toBe(200);expect(Buffer.from(await response.arrayBuffer()).toString()).toBe("MO22_DIRECT")});
   await check("direct bridge wrong project",async()=>{await expect(putArkiMo22(101,"PROJECT-B",Buffer.from("DENY"),"application/pdf")).rejects.toThrow()});
   await check("DELETE owner 204",async()=>{expect((await req(endpoint+"/"+id,"DELETE",a)).status).toBe(204)});
   await check("revoked GET 403",async()=>{expect((await req(endpoint+"/"+id,"GET",a)).status).toBe(403)});
   await check("SHA tamper rejected",async()=>{const r=await req(endpoint,"POST",a,payload);expect(r.status).toBe(201);const oid=(await r.json()).objectId;await writeFile(join(process.env.ARKI_STORAGE_ROOT!,"objects",oid),"TAMPERED");expect((await req(endpoint+"/"+oid,"GET",a)).status).toBe(403)});
   console.log(`MO22_REAL_E2E=${count}/14 PASS`);
  } finally {if(server)await new Promise<void>(r=>server.close(()=>r()));await db.end()}
 },120000)
});
