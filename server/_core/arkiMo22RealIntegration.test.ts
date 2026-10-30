import { describe, it, expect } from "vitest";
import { DatabaseSync } from "node:sqlite";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import express from "express";
import { sdk } from "./sdk";
import { ENV } from "./env";
import { createAuthorizedStorage } from "./arkiAuthorizedStorage.mjs";
import { createFileBackend } from "./arkiFileBackend.mjs";
import { registerArkiStorageRoutes } from "./arkiHttpRoutes.mjs";

function createSqliteLedger(db: DatabaseSync) {
  const rows = (sql: string, values: any[] = []) => db.prepare(sql).all(...values) as Record<string, any>[];
  const one = (sql: string, values: any[] = []) => db.prepare(sql).get(...values) as Record<string, any> | undefined;
  const run = (sql: string, values: any[] = []) => db.prepare(sql).run(...values);
  return {
    async tx<T>(fn: () => Promise<T> | T): Promise<T> {
      db.exec("BEGIN IMMEDIATE");
      try { const result = await fn(); db.exec("COMMIT"); return result; }
      catch (error) { db.exec("ROLLBACK"); throw error; }
    },
    async assertOwner(ownerId: number, projectId: string) {
      if (!Number.isSafeInteger(ownerId) || ownerId <= 0) throw new Error("STORAGE_ACCESS_DENIED");
      if (!one("SELECT id FROM sicl_projects WHERE owner_id=? AND project_id=? LIMIT 1", [ownerId, projectId])) throw new Error("STORAGE_ACCESS_DENIED");
    },
    async isProjectOwner(ownerId: number, projectId: string) {
      return Boolean(one("SELECT id FROM sicl_projects WHERE owner_id=? AND project_id=? LIMIT 1", [ownerId, projectId]));
    },
    async insertPending(input: any) {
      return this.tx(async () => {
        await this.assertOwner(input.ownerId, input.projectId);
        run("INSERT INTO arki_storage_objects(object_id,owner_id,project_id,storage_key,sha256,size_bytes,content_type,status) VALUES(?,?,?,?,?,?,?,'PENDING')",
          [input.objectId,input.ownerId,input.projectId,input.key,input.sha256,input.sizeBytes,input.contentType]);
      });
    },
    async transitionReady(objectId: string, ownerId: number, projectId: string) {
      return this.tx(async () => {
        await this.assertOwner(ownerId, projectId);
        const result = run("UPDATE arki_storage_objects SET status='READY' WHERE object_id=? AND owner_id=? AND project_id=? AND status='PENDING'",[objectId,ownerId,projectId]);
        if (Number(result.changes) !== 1) throw new Error("STORAGE_ACCESS_DENIED");
      });
    },
    async get(objectId: string) {
      const r = one("SELECT object_id,owner_id,project_id,storage_key,sha256,size_bytes,content_type,status FROM arki_storage_objects WHERE object_id=? LIMIT 1",[objectId]);
      return r ? {objectId:r.object_id,ownerId:r.owner_id,projectId:r.project_id,key:r.storage_key,sha256:r.sha256,sizeBytes:r.size_bytes,contentType:r.content_type,status:r.status} : null;
    },
    async revoke(objectId: string, ownerId: number, projectId: string) {
      return this.tx(async () => {
        await this.assertOwner(ownerId, projectId);
        const result=run("UPDATE arki_storage_objects SET status='REVOKED' WHERE object_id=? AND owner_id=? AND project_id=? AND status IN ('PENDING','READY')",[objectId,ownerId,projectId]);
        if(Number(result.changes)!==1) throw new Error("STORAGE_ACCESS_DENIED");
      });
    },
  };
}

describe("MO22 isolated SQLite HTTP integration", () => {
  it("executes authorization, persistence and integrity checks without MariaDB", async () => {
    const db = new DatabaseSync(":memory:");
    const root = await mkdtemp(join(process.env.RUNNER_TEMP ?? tmpdir(), "arki-mo22-sqlite-"));
    let server: ReturnType<ReturnType<typeof express>["listen"]> | undefined;
    try {
      db.exec("PRAGMA foreign_keys=ON");
      db.exec("CREATE TABLE sicl_projects (id INTEGER PRIMARY KEY, owner_id INTEGER NOT NULL, project_id TEXT NOT NULL UNIQUE)");
      db.exec("CREATE TABLE arki_storage_objects (object_id TEXT PRIMARY KEY, owner_id INTEGER NOT NULL, project_id TEXT NOT NULL, storage_key TEXT NOT NULL UNIQUE, sha256 TEXT NOT NULL, size_bytes INTEGER NOT NULL, content_type TEXT NOT NULL, status TEXT NOT NULL CHECK(status IN ('PENDING','READY','REVOKED')))");
      db.prepare("INSERT INTO sicl_projects(owner_id,project_id) VALUES(?,?),(?,?)").run(101,"PROJECT-A",202,"PROJECT-B");

      const storage = createAuthorizedStorage({ ledger: createSqliteLedger(db), files: createFileBackend(root) });
      const app = express();
      app.use(express.json({limit:"35mb"}));
      const getAuthenticatedUser = async (req: express.Request) => {
        const header = req.headers.authorization;
        const token = typeof header === "string" && header.startsWith("Bearer ") ? header.slice(7) : undefined;
        const session = await sdk.verifySession(token);
        if (!session || session.appId !== ENV.appId || session.openId.startsWith("cron_")) return null;
        if (session.openId === "mo22-owner-a") return {id:101,openId:session.openId};
        if (session.openId === "mo22-owner-b") return {id:202,openId:session.openId};
        return null;
      };
      registerArkiStorageRoutes(app, {storage, getAuthenticatedUser, enabled:true});
      server = app.listen(0,"127.0.0.1");
      await new Promise<void>(resolve => server!.once("listening",resolve));
      const address = server.address();
      if (!address || typeof address === "string") throw new Error("MO22_TEST_SERVER_ADDRESS_INVALID");
      const base = `http://127.0.0.1:${address.port}`;
      const endpoint = "/api/arki-storage/projects/PROJECT-A/objects";
      const a = await sdk.signSession({openId:"mo22-owner-a",appId:ENV.appId,name:"A"});
      const b = await sdk.signSession({openId:"mo22-owner-b",appId:ENV.appId,name:"B"});
      const foreign = await sdk.signSession({openId:"mo22-owner-a",appId:"FOREIGN_MO22_APP",name:"Foreign"});
      const req = (path:string, method="GET", token?:string, body?:unknown) =>
        fetch(base+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`}:{}),"Content-Type":"application/json"},...(body?{body:JSON.stringify(body)}:{})});
      const data=Buffer.from("ARKI_MO22_SQLITE_"+randomUUID());
      const payload={base64:data.toString("base64"),contentType:"application/pdf"};
      let id="";
      const checks: Array<[string,()=>Promise<void>]> = [
        ["owner upload persists READY",async()=>{const r=await req(endpoint,"POST",a,payload);expect(r.status).toBe(201);id=(await r.json()).objectId;expect(db.prepare("SELECT status FROM arki_storage_objects WHERE object_id=?").get(id)).toMatchObject({status:"READY"});}],
        ["owner downloads exact bytes",async()=>{const r=await req(endpoint+"/"+id,"GET",a);expect(r.status).toBe(200);expect(Buffer.from(await r.arrayBuffer())).toEqual(data);}],
        ["anonymous request rejected",async()=>{expect((await req(endpoint+"/"+id)).status).toBe(401);}],
        ["foreign owner rejected",async()=>{expect((await req(endpoint+"/"+id,"GET",b)).status).toBe(403);}],
        ["foreign app rejected",async()=>{expect((await req(endpoint+"/"+id,"GET",foreign)).status).toBe(401);}],
        ["tampered token rejected",async()=>{expect((await req(endpoint+"/"+id,"GET",a+"invalid")).status).toBe(401);}],
        ["owner cannot upload to foreign project",async()=>{expect((await req("/api/arki-storage/projects/PROJECT-B/objects","POST",a,payload)).status).toBe(403);}],
        ["malformed base64 rejected",async()=>{expect((await req(endpoint,"POST",a,{base64:"%%%%",contentType:"application/pdf"})).status).toBe(403);}],
        ["direct service stores and serves object",async()=>{const stored=await storage.put({ownerId:101,projectId:"PROJECT-A",data:Buffer.from("MO22_DIRECT"),contentType:"application/pdf"});const r=await req(endpoint+"/"+stored.objectId,"GET",a);expect(r.status).toBe(200);expect(await r.text()).toBe("MO22_DIRECT");}],
        ["direct service rejects foreign project",async()=>{await expect(storage.put({ownerId:101,projectId:"PROJECT-B",data:Buffer.from("DENY"),contentType:"application/pdf"})).rejects.toThrow("STORAGE_ACCESS_DENIED");}],
        ["owner revocation returns 204",async()=>{expect((await req(endpoint+"/"+id,"DELETE",a)).status).toBe(204);}],
        ["revoked object cannot be read",async()=>{expect((await req(endpoint+"/"+id,"GET",a)).status).toBe(403);}],
        ["SHA tampering is rejected",async()=>{const r=await req(endpoint,"POST",a,payload);expect(r.status).toBe(201);const oid=(await r.json()).objectId;await writeFile(join(root,"objects",oid),"TAMPERED");expect((await req(endpoint+"/"+oid,"GET",a)).status).toBe(403);}],
      ];
      for (const [name,run] of checks) { await run(); console.log("PASS",name); }
      console.log(`MO22_SQLITE_E2E=${checks.length}/${checks.length} PASS`);
    } finally {
      if (server) await new Promise<void>(resolve=>server!.close(()=>resolve()));
      db.close();
      await rm(root,{recursive:true,force:true});
    }
  },120000);
});
