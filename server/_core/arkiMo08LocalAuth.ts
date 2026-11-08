/**
 * @deprecated MO08 legacy. Reemplazado por arkiIdentity/auth.ts (scrypt + SQLite).
 * Reemplazo: server/_core/arkiIdentity/auth.ts
 *
 * NO USAR. NO ELIMINAR todavía. Deuda documentada para eliminar
 * tras la fase de reconciliación sicl-web ↔ sicl-core ↔ arki-acs.
 * Ver: server/_core/arkiIdentity/README.md § Deuda técnica
 */

import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import mysql from "mysql2/promise";
import type { Express, Request, Response } from "express";
import { parse as parseCookie } from "cookie";
import { getUserByOpenId } from "../db";
import { ArkiLocalSqlSessions, MO08_SESSION_SCHEMA } from "./arkiLocalSqlSessions";
const scrypt = promisify(scryptCallback);
const COOKIE = "arki_local_session";
const USER_SCHEMA = `CREATE TABLE IF NOT EXISTS arki_local_credentials (
 user_id INT PRIMARY KEY, username VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL UNIQUE,
 password_salt VARBINARY(32) NOT NULL, password_hash VARBINARY(64) NOT NULL,
 enabled BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB`;
function enabled() { return process.env.ARKI_IDENTITY_MODE === "local" &&
  process.env.ARKI_MO08_LOCAL_AUTH === "1" && process.env.ARKI_DEV_OPEN !== "1" &&
  process.env.NODE_ENV !== "production"; }
function pool() {
 if (!enabled() || !process.env.ARKI_MO08_DATABASE_URL) throw Error("LOCAL_AUTH_DISABLED");
 return mysql.createPool({uri:process.env.ARKI_MO08_DATABASE_URL,connectionLimit:4});
}
function cookie(req:Request) {
 const raw=parseCookie(req.headers.cookie ?? "")[COOKIE];
 return typeof raw==="string" ? raw : "";
}
const opts={httpOnly:true,secure:true,sameSite:"strict" as const,path:"/api",maxAge:3600000};
export async function verifyArkiLocalRequest(req:Request) {
 if (!enabled()) return null;
 const db=pool();
 try {
  const uid=await new ArkiLocalSqlSessions(db).verify(cookie(req));
  if (!uid) return null;
  const [rows]=await db.execute<mysql.RowDataPacket[]>(
   "SELECT username FROM arki_local_credentials WHERE user_id=? AND enabled=TRUE LIMIT 1",[uid]);
  if(rows.length!==1) return null;
  const user=await getUserByOpenId(`arki-local:${rows[0].username}`);
  return user && user.id===uid ? {...user,role:"user" as const} : null;
 } finally {await db.end();}
}
export async function prepareMo08IsolatedSchema(db:mysql.Pool) {
 await db.query(MO08_SESSION_SCHEMA);await db.query(USER_SCHEMA);
}
export async function enrollMo08Isolated(db:mysql.Pool,userId:number,username:string,password:string) {
 if (!Number.isSafeInteger(userId)||userId<1||!/^[A-Za-z0-9_-]{3,48}$/.test(username)||
 typeof password!=="string"||password.length<16) throw Error("INVALID_ENROLLMENT");
 const salt=randomBytes(32);
 const hash=await scrypt(password,salt,64) as Buffer;
 await db.execute("INSERT INTO arki_local_credentials (user_id,username,password_salt,password_hash) VALUES (?,?,?,?)",
 [userId,username,salt,hash]);
}
export function registerArkiLocalRoutes(app:Express) {
 if (!enabled()) return;
 // Explicitly test-only: no endpoint registered in production or without opt-in.
 app.post("/api/arki-local/login",async(req:Request,res:Response)=>{
  res.setHeader("Cache-Control","no-store");
  const username=req.body?.username,password=req.body?.password;
  if(typeof username!=="string"||typeof password!=="string"||
   username.length>64||password.length>1024){res.status(401).json({error:"INVALID_CREDENTIALS"});return;}
  const db=pool();
  try {
   const [rows]=await db.execute<mysql.RowDataPacket[]>(
    "SELECT user_id,password_salt,password_hash FROM arki_local_credentials WHERE username=? AND enabled=TRUE LIMIT 1",[username]);
   const salt=rows.length===1?rows[0].password_salt:Buffer.alloc(32);
   const stored=rows.length===1?rows[0].password_hash:Buffer.alloc(64);
   const actual=await scrypt(password,salt,64) as Buffer;
   if(!timingSafeEqual(actual,stored)||rows.length!==1){res.status(401).json({error:"INVALID_CREDENTIALS"});return;}
   const token=await new ArkiLocalSqlSessions(db).issue(rows[0].user_id,3600);
   res.cookie(COOKIE,token,opts);res.status(200).json({ok:true});
  }catch{res.status(503).json({error:"AUTH_UNAVAILABLE"});}
  finally{await db.end();}
 });
 app.post("/api/arki-local/logout",async(req:Request,res:Response)=>{
  const db=pool();
  try{await new ArkiLocalSqlSessions(db).revoke(cookie(req));}
  catch{res.status(503).json({error:"AUTH_UNAVAILABLE"});return;}
  finally{await db.end();}
  res.clearCookie(COOKIE,{httpOnly:true,secure:true,sameSite:"strict",path:"/api"});
  res.status(200).json({ok:true});
 });
}
