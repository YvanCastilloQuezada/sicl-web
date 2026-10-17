/** MO-14 MySQL adapter for MO-13. Pool: mysql2/promise compatible.
 * Never reads credentials or connects at import time. Fail closed on DB errors.
 */
const denied = () => { throw new Error('STORAGE_ACCESS_DENIED'); };
const uuid = x => typeof x === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(x);
const project = x => typeof x === 'string' && /^[A-Za-z0-9_.-]{1,128}$/.test(x);
const owner = x => Number.isSafeInteger(x) && x > 0;
const rows = result => result[0];
export class ArkiMysqlLedgerRepository {
  constructor(pool) { if (!pool?.getConnection) throw new Error('MySQL pool required'); this.pool = pool; }
  async tx(fn) {
    const c = await this.pool.getConnection();
    try { await c.beginTransaction(); const value = await fn(c); await c.commit(); return value; }
    catch (err) { try { await c.rollback(); } catch {} throw err; }
    finally { c.release(); }
  }
  async assertOwner(c, userId, projectId) {
    if (!owner(userId) || !project(projectId)) denied();
    const result = rows(await c.execute('SELECT id FROM sicl_projects WHERE ownerId = ? AND projectId = ? LIMIT 1 FOR UPDATE', [userId, projectId]));
    if (result.length !== 1) denied();
  }
  async isProjectOwner(userId, projectId) {
    if (!owner(userId) || !project(projectId)) return false;
    return this.tx(async c => {
      const result = rows(await c.execute('SELECT id FROM sicl_projects WHERE ownerId = ? AND projectId = ? LIMIT 1', [userId, projectId]));
      return result.length === 1;
    });
  }
  async insertPending({objectId,ownerId,projectId,key,sha256,sizeBytes,contentType}) {
    if (!uuid(objectId) || !owner(ownerId) || !project(projectId) || key !== `objects/${objectId}` || !/^[a-f0-9]{64}$/.test(sha256) || !Number.isSafeInteger(sizeBytes) || sizeBytes < 0 || sizeBytes > 25*1024*1024 || typeof contentType !== 'string' || contentType.length > 200 || !/^[\w.+-]+\/[\w.+-]+$/.test(contentType)) denied();
    return this.tx(async c => {
      await this.assertOwner(c,ownerId,projectId);
      await c.execute('INSERT INTO arki_storage_objects (object_id,owner_id,project_id,storage_key,sha256,size_bytes,content_type,status) VALUES (?,?,?,?,?,?,?,\'PENDING\')',[objectId,ownerId,projectId,key,sha256,sizeBytes,contentType]);
    });
  }
  async transitionReady(objectId,ownerId,projectId) {
    if (!uuid(objectId)) denied();
    return this.tx(async c => {
      await this.assertOwner(c,ownerId,projectId);
      const result=rows(await c.execute("UPDATE arki_storage_objects SET status='READY' WHERE object_id=? AND owner_id=? AND project_id=? AND status='PENDING'",[objectId,ownerId,projectId]));
      if (result.affectedRows !== 1) denied();
    });
  }
  async get(objectId) {
    if (!uuid(objectId)) return null;
    return this.tx(async c => {
      const result=rows(await c.execute('SELECT object_id,owner_id,project_id,storage_key,sha256,size_bytes,content_type,status FROM arki_storage_objects WHERE object_id=? LIMIT 1',[objectId]));
      const r=result[0]; return r ? {objectId:r.object_id,ownerId:r.owner_id,projectId:r.project_id,key:r.storage_key,sha256:r.sha256,sizeBytes:r.size_bytes,contentType:r.content_type,status:r.status} : null;
    });
  }
  async revoke(objectId,ownerId,projectId) {
    if (!uuid(objectId) || !owner(ownerId) || !project(projectId)) denied();
    return this.tx(async c => {
      await this.assertOwner(c,ownerId,projectId);
      const result=rows(await c.execute("UPDATE arki_storage_objects SET status='REVOKED' WHERE object_id=? AND owner_id=? AND project_id=? AND status IN ('PENDING','READY')",[objectId,ownerId,projectId]));
      if (result.affectedRows !== 1) denied();
    });
  }
  /** Read-only inventory for offline reconciliation; no automatic deletion. */
  async listStalePending(before,limit=100) {
    if (!(before instanceof Date) || Number.isNaN(before.getTime()) || !Number.isInteger(limit) || limit<1 || limit>500) throw new Error('Invalid reconciliation window');
    return this.tx(async c => rows(await c.execute("SELECT object_id,storage_key,updated_at FROM arki_storage_objects WHERE status='PENDING' AND updated_at < ? ORDER BY updated_at LIMIT ?",[before.toISOString().slice(0,19).replace("T"," "),limit])));
  }
}
