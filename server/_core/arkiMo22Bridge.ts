/**
 * @deprecated MO22 legacy. Storage de objetos con ledger MySQL, dormido.
 * Reemplazo: Pendiente: portar a SQLite o eliminar.
 *
 * NO USAR. NO ELIMINAR todavía. Deuda documentada para eliminar
 * tras la fase de reconciliación sicl-web ↔ sicl-core ↔ arki-acs.
 * Ver: server/_core/arkiIdentity/README.md § Deuda técnica
 */
/** MO-22 staged adapter. Requires explicit activation; no fake identities. */
import type { Express, Request } from 'express';
import { parse as parseCookies } from 'cookie';
import { COOKIE_NAME } from '@shared/const';
import { sdk } from './sdk';
import { ENV } from './env';
import { getUserByOpenId } from '../db';
import { authenticateLocalIdentity } from './arkiIdentityBridge';
import mysql from 'mysql2/promise';
import { ArkiMysqlLedgerRepository } from './arkiMysqlLedgerRepository.mjs';
import { createAuthorizedStorage } from './arkiAuthorizedStorage.mjs';
import { createFileBackend } from './arkiFileBackend.mjs';
import { registerArkiStorageRoutes } from './arkiHttpRoutes.mjs';

function enabled(): boolean {
  return process.env.ARKI_STORAGE_MODE === 'local' &&
    process.env.ARKI_MO22_ENABLE === '1' &&
    process.env.ARKI_DEV_OPEN !== '1' &&
    (process.env.ARKI_IDENTITY_MODE === 'manus' ||
      (process.env.ARKI_IDENTITY_MODE === 'local' &&
       process.env.ARKI_MO08_LOCAL_AUTH === '1' &&
       process.env.NODE_ENV !== 'production'));
}
let service: ReturnType<typeof createAuthorizedStorage> | undefined;
function storage() {
  if (!enabled()) throw Error('MO22_DISABLED');
  if (!service) {
    const url = process.env.DATABASE_URL;
    const root = process.env.ARKI_STORAGE_ROOT;
    if (!url || !root || !root.startsWith('/')) throw Error('MO22_CONFIG_MISSING');
    const pool = mysql.createPool({uri:url,connectionLimit:8,timezone:'Z'});
    service = createAuthorizedStorage({ledger:new ArkiMysqlLedgerRepository(pool),files:createFileBackend(root)});
  }
  return service;
}
async function authenticated(req: Request) {
  if (process.env.ARKI_IDENTITY_MODE === 'local') {
    return authenticateLocalIdentity(req);
  }
  // Do not upsert users, use a verified cookie and an existing DB identity only.
  const cookieToken = parseCookies(req.headers.cookie ?? '')[COOKIE_NAME];
  const authorization = req.headers.authorization;
  const bearerToken =
    typeof authorization === 'string' && authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : undefined;
  const token = cookieToken || bearerToken;
  const session = await sdk.verifySession(token);
  if (!session || session.appId !== ENV.appId || session.openId.startsWith('cron_')) return null;
  const user = await getUserByOpenId(session.openId);
  return user && Number.isSafeInteger(user.id) && user.id > 0 ? user : null;
}
export async function putArkiMo22(ownerId:number,projectId:string,data:Buffer,contentType:string) {
  if (!enabled()) throw Error('MO22_DISABLED');
  const result = await storage().put({ownerId,projectId,data,contentType});
  return {key:result.key,url:`/api/arki-storage/projects/${encodeURIComponent(projectId)}/objects/${result.objectId}`};
}
export function registerArkiMo22(app:Express) {
  if (!enabled()) return;
  const guarded = {
    put: (args:any) => storage().put(args),
    read: (args:any) => storage().read(args),
    revoke: (args:any) => storage().revoke(args),
  };
  registerArkiStorageRoutes(app,{storage:guarded,getAuthenticatedUser:authenticated,enabled:true});
}
