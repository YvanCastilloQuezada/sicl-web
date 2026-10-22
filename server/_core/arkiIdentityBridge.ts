/** MO08I isolated local identity: disabled in production, explicit opt-in required. */
import type { Request } from "express";
import type { User } from "../../drizzle/schema";
import { verifyArkiLocalRequest } from "./arkiMo08LocalAuth";
export async function authenticateLocalIdentity(req:Request):Promise<User|null> {
 if(process.env.ARKI_IDENTITY_MODE!=="local"||
 process.env.ARKI_MO08_LOCAL_AUTH!=="1"||
 process.env.NODE_ENV==="production"||process.env.ARKI_DEV_OPEN==="1") return null;
 return await verifyArkiLocalRequest(req);
}
